import {
  NeutralToneMapping,
  BackSide,
  Box3,
  Color,
  DirectionalLight,
  FrontSide,
  Group,
  HemisphereLight,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PMREMGenerator,
  PerspectiveCamera,
  Plane,
  Raycaster,
  SRGBColorSpace,
  Scene,
    Vector2,
  Vector3,
  WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import type { Bakis, KesitDuzlemi, Sahne } from '@/content/beyin/types';
import { YAPILAR, type Katman, type Yapi, yapiAdi } from '@/content/beyin/yapilar';
import { katmanYukle } from './model';
import { sahneRengi } from './renkler';
import { seciciUyar, tarafsiz, uyar } from './secici';

/**
 * Üç boyutlu beyin çizicisi. Sayfada tek bir çizici (tek WebGL bağlamı) vardır: tuvali o an etkin olan sahne kutusuna
 * taşınır, ayrılan kutuya son görüntüsü resim olarak bırakılır. Kare yalnızca bir şey değişince çizilir (pil ve ısı için).
 *
 * Eksenler model dosyasındaki gibidir: X hastanın solu, Y yukarı, Z ön (milimetre, merkez beynin ortası).
 */

const BAKIS_YONU: Record<Bakis, [number, number, number]> = {
  sol: [1, 0.12, 0],
  sag: [-1, 0.12, 0],
  on: [0, 0.1, 1],
  arka: [0, 0.12, -1],
  ust: [0, 1, -0.03],
  alt: [0, -1, 0.03],
  egik: [0.85, 0.45, 0.75],
  'ic-sol': [-1, 0.1, 0],
  'ic-sag': [1, 0.1, 0],
};

export interface SecimBilgisi {
  id: string;
}

interface YapiNesnesi {
  yapi: Yapi;
  grup: Group;
  malzeme: MeshStandardMaterial;
  kesitMalzeme: MeshBasicMaterial;
  kesitAglari: Mesh[];
  /** Ayrıştırma uygulanmamış dünya merkezi. */
  merkez: Vector3;
  kutu: Box3;
  renk: Color;
  hedefRenk: Color;
  opaklik: number;
  hedefOpaklik: number;
}

interface Etiket {
  id: string;
  nokta: HTMLSpanElement;
  metin: HTMLSpanElement;
  cizgi: SVGLineElement;
  ortulu: boolean;
  /** Son görünürlük denetiminde seçilen nokta adayı. */
  aday: number;
}

/**
 * Etiket noktası için hedef: kutunun merkezi, beynin ortasından dışarı doğru biraz itilir. Böylece kemik gibi kabuk
 * biçimli yapılarda nokta iç yüze değil dış yüze, kıvrımlarda görünen yüze düşer.
 */
function disaDogru(kutu: Box3): Vector3 {
  const m = kutu.getCenter(new Vector3());
  const u = m.length();
  if (u < 1) return m;
  return m.clone().addScaledVector(m.clone().divideScalar(u), kutu.getSize(new Vector3()).length() * 0.25);
}

const gecis = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

export function hareketAzaltilmis(): boolean {
  return typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export class BeyinMotoru {
  readonly kok: HTMLDivElement;
  readonly tuval: HTMLCanvasElement;
  private readonly etiketKati: HTMLDivElement;
  private readonly cizici: WebGLRenderer;
  private readonly sahne3b = new Scene();
  private readonly kamera = new PerspectiveCamera(32, 1, 1, 5000);
  private readonly kontrol: OrbitControls;
  private readonly nesneler = new Map<string, YapiNesnesi>();
  private readonly yuklenen = new Set<Katman>();
  private readonly kesitDuzlemi = new Plane(new Vector3(-1, 0, 0), 0);
  private readonly yarimDuzlemi = new Plane(new Vector3(1, 0, 0), 0.8);
  private duzlemler: Plane[] = [];
  private ayar: Sahne = { katmanlar: [] };
  private secili: string | null = null;
  private uzerinde: string | null = null;
  private etiketler: Etiket[] = [];
  /** Etiket noktası önbelleği (yapı ve aday → kesit, konum ve kamera anahtarı, nokta). */
  private readonly kesitNoktalari = new Map<string, { anahtar: string; nokta: Vector3 | null }>();
  private etiketGoster = true;
  private ayristirma = 0;
  private hedefAyristirma = 0;
  private kareBekliyor = false;
  private kameraGecisi: { bas: number; sure: number; konum0: Vector3; konum1: Vector3; hedef0: Vector3; hedef1: Vector3 } | null = null;
  private hareketli = false;
  private boyutGozlemcisi: ResizeObserver | null = null;
  private secimDinleyici: ((id: string | null) => void) | null = null;
  private sonIsaret = new Vector2();
  private readonly isinci = new Raycaster();
  private uzerindeZamani = 0;
  private yuklemeNo = 0;

  constructor() {
    this.kok = document.createElement('div');
    this.kok.className = 'beyin-tuval-kok';
    this.tuval = document.createElement('canvas');
    this.tuval.className = 'beyin-tuval';
    this.tuval.setAttribute('aria-hidden', 'true');
    this.etiketKati = document.createElement('div');
    this.etiketKati.className = 'beyin-etiketler';
    this.etiketKati.setAttribute('aria-hidden', 'true');
    this.kok.append(this.tuval, this.etiketKati);

    this.cizici = new WebGLRenderer({ canvas: this.tuval, antialias: true, alpha: true, powerPreference: 'high-performance' });
    this.cizici.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.cizici.outputColorSpace = SRGBColorSpace;
    this.cizici.toneMapping = NeutralToneMapping;
    this.cizici.toneMappingExposure = 1;
    this.cizici.localClippingEnabled = true;

    const pmrem = new PMREMGenerator(this.cizici);
    this.sahne3b.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();
    this.sahne3b.add(new HemisphereLight(0xffffff, 0x2a3350, 0.55));
    const anaIsik = new DirectionalLight(0xffffff, 1.6);
    anaIsik.position.set(0.6, 1, 0.8);
    this.kamera.add(anaIsik);
    const arkaIsik = new DirectionalLight(0x9fb8ff, 0.7);
    arkaIsik.position.set(-1, 0.3, -1);
    this.kamera.add(arkaIsik);
    this.sahne3b.add(this.kamera);

    this.kontrol = new OrbitControls(this.kamera, this.tuval);
    this.kontrol.enableDamping = true;
    this.kontrol.dampingFactor = 0.09;
    this.kontrol.rotateSpeed = 0.75;
    this.kontrol.zoomSpeed = 0.9;
    this.kontrol.panSpeed = 0.8;
    this.kontrol.autoRotateSpeed = 0.9;
    this.kontrol.addEventListener('change', () => this.kareIste());
    this.kontrol.addEventListener('start', () => {
      this.kontrol.autoRotate = false;
      this.kameraGecisi = null;
      this.hareketli = true;
      this.etiketKati.classList.add('beyin-etiketler-gizli');
    });
    this.kontrol.addEventListener('end', () => {
      this.hareketli = false;
      window.setTimeout(() => this.etiketleriYerlestir(true), 260);
    });

    this.tuval.addEventListener('pointerdown', (e) => this.sonIsaret.set(e.clientX, e.clientY));
    this.tuval.addEventListener('pointerup', (e) => {
      if (Math.hypot(e.clientX - this.sonIsaret.x, e.clientY - this.sonIsaret.y) > 6) return;
      const id = this.isaretlenen(e.clientX, e.clientY);
      this.sec(id === this.secili ? null : id);
      this.secimDinleyici?.(this.secili);
    });
    this.tuval.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse' || e.buttons !== 0) return;
      const simdi = performance.now();
      if (simdi - this.uzerindeZamani < 70) return;
      this.uzerindeZamani = simdi;
      const id = this.isaretlenen(e.clientX, e.clientY);
      if (id !== this.uzerinde) {
        this.uzerinde = id;
        this.tuval.style.cursor = id ? 'pointer' : 'grab';
        this.tuval.title = id ? yapiAdi(this.nesneler.get(id)!.yapi) : '';
        this.renkleriUygula(false);
      }
    });
    this.tuval.addEventListener('pointerleave', () => {
      if (!this.uzerinde) return;
      this.uzerinde = null;
      this.renkleriUygula(false);
    });
  }

  /** Tuvali verilen kutuya taşır ve kutunun boyuna uyar. */
  baglan(kap: HTMLElement) {
    if (this.kok.parentElement !== kap) kap.appendChild(this.kok);
    this.boyutGozlemcisi?.disconnect();
    this.boyutGozlemcisi = new ResizeObserver(() => this.boyutla());
    this.boyutGozlemcisi.observe(kap);
    this.boyutla();
  }

  ayril() {
    this.boyutGozlemcisi?.disconnect();
    this.boyutGozlemcisi = null;
    this.kontrol.autoRotate = false;
    this.kok.remove();
  }

  onSecim(f: ((id: string | null) => void) | null) {
    this.secimDinleyici = f;
  }

  private boyutla() {
    const kap = this.kok.parentElement;
    if (!kap) return;
    const w = Math.max(1, kap.clientWidth);
    const h = Math.max(1, kap.clientHeight);
    this.cizici.setSize(w, h, false);
    const once = this.kamera.aspect;
    this.kamera.aspect = w / h;
    this.kamera.updateProjectionMatrix();
    // En-boy oranı belirgin değişince (tam ekran, telefonu yan çevirme) beyin yeniden ekrana sığdırılır.
    if (this.nesneler.size > 0 && Math.abs(once - this.kamera.aspect) / once > 0.08 && !this.kameraGecisi) {
      const { konum, hedef } = this.kameraKonumu(this.kamera.position.clone().sub(this.kontrol.target));
      this.kamera.position.copy(konum);
      this.kontrol.target.copy(hedef);
      this.kontrol.update();
    }
    this.kareIste();
    this.etiketleriYerlestir(false);
  }

  /**
   * Sahne ayarını uygular: gereken paketleri indirir, görünürlüğü, renkleri, kesiti ve bakışı ayarlar.
   * `ilerleme` 0–1 arasında indirme oranını bildirir.
   */
  async uygula(ayar: Sahne, secenek: { anlik?: boolean; ilerleme?: (oran: number) => void; bakisKoru?: boolean } = {}) {
    const no = ++this.yuklemeNo;
    this.ayar = ayar;
    const eksik = ayar.katmanlar.filter((k) => !this.yuklenen.has(k));
    if (eksik.length > 0) {
      const { modelDizini } = await import('./model');
      const dizin = await modelDizini();
      const toplam = eksik.reduce((t, k) => t + dizin.katmanlar[k], 0);
      const alinan = new Map<Katman, number>();
      const bildir = () => secenek.ilerleme?.([...alinan.values()].reduce((t, x) => t + x, 0) / Math.max(1, toplam));
      await Promise.all(
        eksik.map(async (k) => {
          const geometri = await katmanYukle(k, (b) => {
            alinan.set(k, b);
            bildir();
          });
          if (!this.yuklenen.has(k)) this.katmanEkle(k, geometri);
        }),
      );
      secenek.ilerleme?.(1);
    }
    if (no !== this.yuklemeNo) return;
    this.secili = null;
    this.hedefAyristirma = ayar.ayristir ?? 0;
    this.gorunurlukUygula();
    this.duzlemleriUygula();
    this.renkleriUygula(true);
    this.etiketleriKur();
    const anlik = secenek.anlik || hareketAzaltilmis();
    if (anlik) this.ayristirma = this.hedefAyristirma;
    if (!secenek.bakisKoru) this.bakisaGit(ayar.bakis ?? 'sol', anlik);
    this.kontrol.autoRotate = Boolean(ayar.donme) && !hareketAzaltilmis();
    if (anlik) {
      for (const n of this.nesneler.values()) {
        n.opaklik = n.hedefOpaklik;
        n.renk.copy(n.hedefRenk);
      }
    }
    this.kareIste();
  }

  private katmanEkle(k: Katman, geometri: Map<string, import('three').BufferGeometry>) {
    this.yuklenen.add(k);
    for (const y of YAPILAR) {
      if (y.katman !== k) continue;
      const malzeme = new MeshStandardMaterial({ roughness: 0.62, metalness: 0, envMapIntensity: 0.55, side: FrontSide });
      const kesitMalzeme = new MeshBasicMaterial({ side: BackSide });
      const grup = new Group();
      grup.userData.yapi = y.id;
      const kutu = new Box3();
      const kesitAglari: Mesh[] = [];
      for (const p of y.parcalar) {
        const g = geometri.get(p);
        if (!g) continue;
        const ag = new Mesh(g, malzeme);
        ag.userData.yapi = y.id;
        grup.add(ag);
        const kesitAgi = new Mesh(g, kesitMalzeme);
        kesitAgi.userData.yapi = y.id;
        kesitAgi.visible = false;
        kesitAgi.renderOrder = -1;
        grup.add(kesitAgi);
        kesitAglari.push(kesitAgi);
        kutu.union(g.boundingBox!);
      }
      this.sahne3b.add(grup);
      const n: YapiNesnesi = {
        yapi: y,
        grup,
        malzeme,
        kesitMalzeme,
        kesitAglari,
        merkez: kutu.getCenter(new Vector3()),
        kutu,
        renk: new Color('#888'),
        hedefRenk: new Color('#888'),
        opaklik: 0,
        hedefOpaklik: 0,
      };
      grup.visible = false;
      this.nesneler.set(y.id, n);
    }
  }

  private gorunurMu(y: Yapi): boolean {
    const a = this.ayar;
    if (!a.katmanlar.includes(y.katman)) return false;
    if (a.goster && !uyar(y, a.goster)) return false;
    if (uyar(y, a.gizle)) return false;
    return true;
  }

  private gorunurlukUygula() {
    const vurguVar = (this.ayar.vurgula?.length ?? 0) > 0;
    for (const n of this.nesneler.values()) {
      const g = this.gorunurMu(n.yapi);
      let op = g ? 1 : 0;
      if (g && uyar(n.yapi, this.ayar.saydam)) op = 0.16;
      if (g && vurguVar && !uyar(n.yapi, this.ayar.vurgula)) op = Math.min(op, 0.14);
      n.hedefOpaklik = op;
    }
  }

  private duzlemleriUygula() {
    const d: Plane[] = [];
    const yarim = this.ayar.yarim;
    if (yarim) {
      this.yarimDuzlemi.normal.set(yarim === 'sol' ? 1 : -1, 0, 0);
      this.yarimDuzlemi.constant = 0.8;
      d.push(this.yarimDuzlemi);
    }
    if (this.ayar.kesit) {
      this.kesitAyarla(this.ayar.kesit.duzlem, this.ayar.kesit.konum, false);
      d.push(this.kesitDuzlemi);
    }
    this.duzlemler = d;
    for (const n of this.nesneler.values()) {
      n.malzeme.clippingPlanes = d;
      n.kesitMalzeme.clippingPlanes = d;
      n.malzeme.needsUpdate = true;
      n.kesitMalzeme.needsUpdate = true;
      for (const k of n.kesitAglari) k.visible = d.length > 0;
    }
  }

  /** Kameranın sığdıracağı yapılar: vurgu varsa öne çıkanlar, yoksa görünenlerin hepsi. */
  private cerceveNesneleri(): YapiNesnesi[] {
    const hepsi = [...this.nesneler.values()];
    const net = hepsi.filter((n) => n.hedefOpaklik > 0.5);
    if (net.length > 0 && (this.ayar.vurgula?.length ?? 0) > 0) return net;
    const gorunen = hepsi.filter((n) => n.hedefOpaklik > 0 && n.yapi.katman !== 'kemik');
    return gorunen.length > 0 ? gorunen : hepsi.filter((n) => n.hedefOpaklik > 0);
  }

  /** Kesit düzlemi: konum −1 ile 1 arasında, görünen yapıların kutusuna göre. */
  kesitAyarla(duzlem: KesitDuzlemi, konum: number, uygula = true) {
    const kutu = this.tumKutu();
    const eksen = duzlem === 'sagital' ? 'x' : duzlem === 'koronal' ? 'z' : 'y';
    const mn = kutu.min[eksen];
    const mx = kutu.max[eksen];
    const c = MathUtils.lerp(mn, mx, (MathUtils.clamp(konum, -1, 1) + 1) / 2);
    if (duzlem === 'sagital') this.kesitDuzlemi.set(new Vector3(-1, 0, 0), c);
    else if (duzlem === 'koronal') this.kesitDuzlemi.set(new Vector3(0, 0, -1), c);
    else this.kesitDuzlemi.set(new Vector3(0, -1, 0), c);
    if (uygula) {
      this.ayar = { ...this.ayar, kesit: { duzlem, konum } };
      this.duzlemleriUygula();
      this.kareIste();
    }
  }

  kesitKaldir() {
    this.ayar = { ...this.ayar, kesit: undefined };
    this.duzlemleriUygula();
    this.kareIste();
  }

  yarimAyarla(yarim: 'sol' | 'sag' | undefined) {
    this.ayar = { ...this.ayar, yarim };
    this.duzlemleriUygula();
    this.kareIste();
  }

  ayristirAyarla(x: number) {
    this.hedefAyristirma = MathUtils.clamp(x, 0, 1);
    if (hareketAzaltilmis()) this.ayristirma = this.hedefAyristirma;
    this.kareIste();
  }

  katmanAyarla(k: Katman, acik: boolean) {
    const katmanlar = acik ? [...new Set([...this.ayar.katmanlar, k])] : this.ayar.katmanlar.filter((x) => x !== k);
    return this.uygula({ ...this.ayar, katmanlar }, { bakisKoru: true });
  }

  renkAyarla(renk: NonNullable<Sahne['renk']>) {
    this.ayar = { ...this.ayar, renk };
    this.renkleriUygula(false);
  }

  etiketAyarla(acik: boolean) {
    this.etiketGoster = acik;
    this.etiketleriYerlestir(true);
  }

  /** Yalnızca verilen yapıyı (iki yanıyla) gösterir; null verilirse sahnenin kendi ayarına döner. */
  yalnizGoster(id: string | null, temel: Sahne) {
    if (id === null) return this.uygula(temel, { bakisKoru: true });
    const y = this.nesneler.get(id)?.yapi;
    if (!y) return Promise.resolve();
    return this.uygula(
      { ...temel, goster: [tarafsiz(y.id)], gizle: [], vurgula: [], saydam: [], katmanlar: [y.katman], etiketler: [], yarim: undefined, kesit: undefined, ayristir: 0 },
      { bakisKoru: false },
    );
  }

  private tumKutu(): Box3 {
    const k = new Box3();
    for (const n of this.nesneler.values()) if (this.ayar.katmanlar.includes(n.yapi.katman) && n.yapi.katman !== 'kemik') k.union(n.kutu);
    return k.isEmpty() ? new Box3(new Vector3(-70, -90, -90), new Vector3(70, 90, 90)) : k;
  }

  private renkleriUygula(yeni: boolean) {
    const sema = this.ayar.renk ?? 'lob';
    for (const n of this.nesneler.values()) {
      n.hedefRenk.set(sahneRengi(n.yapi, this.ayar));
      if (yeni && n.opaklik === 0) n.renk.copy(n.hedefRenk);
      const kesitRengi = n.hedefRenk.clone().multiplyScalar(n.yapi.katman === 'beyaz' || sema === 'dogal' ? 0.97 : 0.86);
      n.kesitMalzeme.color.copy(kesitRengi);
      const vurgu = this.secili === n.yapi.id ? 0.45 : this.uzerinde === n.yapi.id ? 0.22 : 0;
      n.malzeme.emissive.copy(n.hedefRenk).multiplyScalar(vurgu);
    }
    this.kareIste();
  }

  sec(id: string | null) {
    this.secili = id;
    this.renkleriUygula(false);
  }

  get seciliYapi() {
    return this.secili;
  }

  /** Görünen yapıların listesi (erişilebilir liste ve açıklama için). */
  gorunenYapilar(): Yapi[] {
    return [...this.nesneler.values()].filter((n) => n.hedefOpaklik > 0).map((n) => n.yapi);
  }

  private isaretlenen(x: number, y: number): string | null {
    const r = this.tuval.getBoundingClientRect();
    const nokta = new Vector2(((x - r.left) / r.width) * 2 - 1, -((y - r.top) / r.height) * 2 + 1);
    this.isinci.setFromCamera(nokta, this.kamera);
    const hedefler: Mesh[] = [];
    for (const n of this.nesneler.values()) {
      if (!n.grup.visible || n.opaklik < 0.08) continue;
      // Kesit varken kesik yüze dokunmak da o yapıyı seçer.
      for (const c of n.grup.children)
        if (c instanceof Mesh && (c.material === n.malzeme || (this.duzlemler.length > 0 && c.material === n.kesitMalzeme))) hedefler.push(c);
    }
    const vuruslar = this.isinci.intersectObjects(hedefler, false);
    const vurguVar = (this.ayar.vurgula?.length ?? 0) > 0;
    for (const v of vuruslar) {
      if (this.duzlemler.some((d) => d.distanceToPoint(v.point) < 0)) continue;
      const id = v.object.userData.yapi as string;
      const n = this.nesneler.get(id)!;
      // Soluk yapıların içinden geçip öne çıkan yapıyı seçmeyi kolaylaştır.
      if (vurguVar && n.opaklik < 0.5) {
        const arkasi = vuruslar.find((w) => {
          const m = this.nesneler.get(w.object.userData.yapi as string)!;
          return m.opaklik >= 0.5 && !this.duzlemler.some((d) => d.distanceToPoint(w.point) < 0);
        });
        if (arkasi) return arkasi.object.userData.yapi as string;
      }
      return id;
    }
    return null;
  }

  /**
   * Görünen yapıları verilen yönden bakınca ekrana sığdıran kamera konumu. Her yapının kendi kutusu ayrı ayrı
   * sığdırılır; böylece beynin biçimine tek bir büyük kutudan daha yakın bir çerçeve elde edilir.
   */
  private kameraKonumu(bakis: Bakis | Vector3): { konum: Vector3; hedef: Vector3 } {
    const kaydir = this.hedefAyristirma * 0.9;
    const kutular = this.cerceveNesneleri().map((n) => n.kutu.clone().translate(n.merkez.clone().multiplyScalar(kaydir)));
    if (kutular.length === 0) kutular.push(new Box3(new Vector3(-70, -80, -90), new Vector3(70, 80, 90)));
    const birlesik = new Box3();
    for (const k of kutular) birlesik.union(k);
    const merkez = birlesik.getCenter(new Vector3());
    const yon = (typeof bakis === 'string' ? new Vector3(...BAKIS_YONU[bakis]) : bakis.clone()).normalize();
    const sag = new Vector3(0, 1, 0).cross(yon);
    if (sag.lengthSq() < 1e-6) sag.set(1, 0, 0);
    sag.normalize();
    const ust = yon.clone().cross(sag).normalize();
    const tanD = Math.tan(MathUtils.degToRad(this.kamera.fov) / 2) * 0.92;
    const tanY = tanD * this.kamera.aspect;
    let uzaklik = 0;
    let yaricap = 0;
    const k = new Vector3();
    for (const kutu of kutular) {
      for (let i = 0; i < 8; i++) {
        k.set(i & 1 ? kutu.max.x : kutu.min.x, i & 2 ? kutu.max.y : kutu.min.y, i & 4 ? kutu.max.z : kutu.min.z).sub(merkez);
        yaricap = Math.max(yaricap, k.length());
        const derin = k.dot(yon);
        uzaklik = Math.max(uzaklik, derin + Math.abs(k.dot(sag)) / tanY, derin + Math.abs(k.dot(ust)) / tanD);
      }
    }
    this.kontrol.minDistance = yaricap * 0.5;
    this.kontrol.maxDistance = uzaklik * 3;
    return { konum: merkez.clone().addScaledVector(yon, uzaklik), hedef: merkez };
  }

  bakisaGit(bakis: Bakis, anlik = false) {
    const { konum, hedef } = this.kameraKonumu(bakis);
    this.kamera.near = Math.max(1, konum.distanceTo(hedef) / 50);
    this.kamera.far = konum.distanceTo(hedef) * 10;
    this.kamera.updateProjectionMatrix();
    if (anlik || hareketAzaltilmis()) {
      this.kameraGecisi = null;
      this.kamera.position.copy(konum);
      this.kontrol.target.copy(hedef);
      this.kontrol.update();
      this.kareIste();
      window.setTimeout(() => this.etiketleriYerlestir(true), 30);
      return;
    }
    this.kameraGecisi = {
      bas: performance.now(),
      sure: 900,
      konum0: this.kamera.position.clone(),
      konum1: konum,
      hedef0: this.kontrol.target.clone(),
      hedef1: hedef,
    };
    this.etiketKati.classList.add('beyin-etiketler-gizli');
    this.kareIste();
  }

  private etiketleriKur() {
    this.etiketKati.replaceChildren();
    this.etiketler = [];
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'beyin-etiket-cizgiler');
    this.etiketKati.append(svg);
    for (const e of this.ayar.etiketler ?? []) {
      const ilk = [...this.nesneler.values()].find((n) => seciciUyar(n.yapi, e.yapi) && n.hedefOpaklik > 0);
      if (!ilk) continue;
      const nokta = document.createElement('span');
      nokta.className = 'beyin-etiket-nokta';
      const metin = document.createElement('span');
      metin.className = 'beyin-etiket-metin';
      metin.textContent = e.metin ?? ilk.yapi.ad;
      const cizgi = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      svg.append(cizgi);
      this.etiketKati.append(nokta, metin);
      this.etiketler.push({ id: ilk.yapi.id, nokta, metin, cizgi, ortulu: false, aday: 0 });
    }
    this.etiketleriYerlestir(true);
  }

  /**
   * Etiket noktası adayının hedefi (dünya koordinatı): 0 kameraya bakan yüz, 1 beynin ortasından dışa bakan yüz
   * (kemik gibi kabuk biçimli yapılarda dış yüz), 2 kutunun merkezi. Nokta, yapının bu hedefe en yakın köşesidir.
   */
  private etiketHedefi(n: YapiNesnesi, aday: number): Vector3 {
    const g = n.grup.position;
    if (aday === 1) return disaDogru(n.kutu).add(g);
    const m = n.merkez.clone().add(g);
    if (aday === 2) return m;
    const yon = this.kamera.position.clone().sub(m).normalize();
    return m.addScaledVector(yon, n.kutu.getSize(new Vector3()).length() * 0.5);
  }

  /**
   * Etiketin dünya koordinatındaki noktası: yapının, adayın hedefine en yakın köşesi (kıvrık bir damarda bile nokta
   * damarın üstündedir). Kesitle kaldırılan köşeler atlanır; yapının hepsi kaldırıldıysa null (etiket boşlukta asılı
   * kalmasın).
   */
  private etiketNoktasi(n: YapiNesnesi, aday: number): Vector3 | null {
    const g = n.grup.position;
    const yuvarla = (v: Vector3) => v.toArray().map((x) => Math.round(x * 2) / 2).join(',');
    const anahtar = [
      this.duzlemler.map((d) => `${d.normal.toArray().join(',')},${d.constant}`).join('|'),
      yuvarla(g),
      aday === 0 ? yuvarla(this.kamera.position) : '',
    ].join('/');
    const kayit = `${n.yapi.id}#${aday}`;
    const onceki = this.kesitNoktalari.get(kayit);
    if (onceki?.anahtar === anahtar) return onceki.nokta?.clone() ?? null;
    const hedef = this.etiketHedefi(n, aday);
    const v = new Vector3();
    let enIyi = Infinity;
    let nokta: Vector3 | null = null;
    for (const m of n.kesitAglari) {
      const k = m.geometry.getAttribute('position');
      for (let i = 0; i < k.count; i++) {
        v.set(k.getX(i), k.getY(i), k.getZ(i)).add(g);
        if (this.duzlemler.some((d) => d.distanceToPoint(v) < 0)) continue;
        const u = v.distanceToSquared(hedef);
        if (u < enIyi) {
          enIyi = u;
          nokta = v.clone();
        }
      }
    }
    this.kesitNoktalari.set(kayit, { anahtar, nokta });
    return nokta?.clone() ?? null;
  }

  /** Bu noktanın önünü (kameradan bakınca) başka bir yapı kapatıyor mu? */
  private onuKapali(n: YapiNesnesi, p: Vector3): boolean {
    const kesitVar = this.duzlemler.length > 0;
    const yon = p.clone().sub(this.kamera.position);
    const uzak = yon.length();
    this.isinci.set(this.kamera.position, yon.normalize());
    const engel = this.isinci
      .intersectObjects(
        [...this.nesneler.values()]
          .filter((m) => m.grup.visible && m.opaklik > 0.6)
          // Kesit varken kesik yüzler de önü kapatır (kesit yüzünün altında kalan noktanın etiketi gizlenir).
          .flatMap((m) => m.grup.children.filter((c) => c instanceof Mesh && (c.material === m.malzeme || (kesitVar && c.material === m.kesitMalzeme)))),
        false,
      )
      .find((v) => !this.duzlemler.some((d) => d.distanceToPoint(v.point) < 0));
    // Nokta yüzeyde durduğundan pay küçüktür; oluğun dibindeki nokta komşu kıvrımın kenarına takılmasın diye biraz pay.
    const pay = Math.min(n.kutu.getSize(new Vector3()).length() * 0.35, 15);
    return Boolean(engel && engel.object.userData.yapi !== n.yapi.id && engel.distance < uzak - pay);
  }

  /** Ekranın içinde mi? */
  private ekranda(p: Vector3): boolean {
    const e = p.clone().project(this.kamera);
    return e.z < 1 && Math.abs(e.x) <= 1.05 && Math.abs(e.y) <= 1.05;
  }

  /**
   * Etiketleri yerleştirir: nokta yapının üstünde, yazı beynin merkezinden dışarı doğru itilmiş ve bir çizgiyle
   * noktaya bağlı; üst üste binen yazılar aşağı kaydırılır. `ortu` verilirse önü kapalı yapıların etiketi gizlenir
   * (yalnızca kamera dururken denetlenir).
   */
  private etiketleriYerlestir(ortu: boolean) {
    if (!this.etiketGoster || this.etiketler.length === 0 || this.hareketli || this.kameraGecisi) {
      this.etiketKati.classList.add('beyin-etiketler-gizli');
      return;
    }
    const r = this.tuval.getBoundingClientRect();
    if (r.width === 0) return;
    this.kamera.updateMatrixWorld();
    const W = r.width;
    const H = r.height;
    const yerler = this.etiketler.map((e) => {
      const n = this.nesneler.get(e.id)!;
      if (ortu) {
        // Kamera dururken adaylar sırayla denenir: kesilmemiş, ekranda ve önü açık olan ilk nokta seçilir.
        e.ortulu = true;
        for (let a = 0; a < 3; a++) {
          const q = this.etiketNoktasi(n, a);
          if (q && this.ekranda(q) && !this.onuKapali(n, q)) {
            e.aday = a;
            e.ortulu = false;
            break;
          }
        }
      }
      const nokta = this.etiketNoktasi(n, e.aday);
      const p = nokta ?? n.merkez.clone().add(n.grup.position);
      const ekran = p.clone().project(this.kamera);
      const gorunur = nokta !== null && !e.ortulu && this.ekranda(p) && n.opaklik > 0.05;
      return { e, x: ((ekran.x + 1) / 2) * W, y: ((1 - ekran.y) / 2) * H, gorunur };
    });
    const gorunen = yerler.filter((y) => y.gorunur);
    const merkez = this.kontrol.target.clone().project(this.kamera);
    const mx = ((merkez.x + 1) / 2) * W;
    const my = ((1 - merkez.y) / 2) * H;
    const kutular = gorunen.map((y) => {
      let dx = y.x - mx;
      let dy = y.y - my;
      const u = Math.hypot(dx, dy);
      if (u < 1) [dx, dy] = [1, 0];
      else [dx, dy] = [dx / u, dy / u];
      const gen = y.e.metin.offsetWidth || 90;
      const yuk = y.e.metin.offsetHeight || 24;
      const sagda = dx >= -0.15;
      const tx = y.x + dx * 34;
      let ty = y.y + dy * 30;
      let sol = sagda ? tx : tx - gen;
      sol = Math.min(Math.max(sol, 6), W - gen - 6);
      // Üstteki yuvarlak düğmelerin altında kalmasın.
      ty = Math.min(Math.max(ty, yuk / 2 + 58), H - yuk / 2 - 6);
      return { y, sol, ust: ty - yuk / 2, gen, yuk, sagda };
    });
    // Çakışma giderme: yukarıdan aşağıya sırayla, üst üste binen kutuyu aşağı kaydır.
    kutular.sort((a, b) => a.ust - b.ust);
    for (let i = 0; i < kutular.length; i++) {
      for (let j = 0; j < i; j++) {
        const a = kutular[j];
        const b = kutular[i];
        const yatay = a.sol < b.sol + b.gen + 4 && b.sol < a.sol + a.gen + 4;
        if (yatay && b.ust < a.ust + a.yuk + 4) b.ust = a.ust + a.yuk + 4;
      }
    }
    for (const y of yerler) {
      const k = kutular.find((x) => x.y === y);
      const e = y.e;
      const op = k ? '1' : '0';
      e.nokta.style.opacity = op;
      e.metin.style.opacity = op;
      e.cizgi.style.opacity = op;
      e.nokta.style.transform = `translate(${y.x}px, ${y.y}px)`;
      if (!k) continue;
      e.metin.style.transform = `translate(${k.sol}px, ${k.ust}px)`;
      const ux = k.sagda ? k.sol : k.sol + k.gen;
      const uy = k.ust + k.yuk / 2;
      e.cizgi.setAttribute('x1', String(y.x));
      e.cizgi.setAttribute('y1', String(y.y));
      e.cizgi.setAttribute('x2', String(ux));
      e.cizgi.setAttribute('y2', String(uy));
    }
    this.etiketKati.classList.remove('beyin-etiketler-gizli');
  }

  /** O anki görüntü (sahne kutusundan ayrılırken yerine bırakılır). */
  goruntu(): string {
    this.cizici.render(this.sahne3b, this.kamera);
    return this.tuval.toDataURL('image/png');
  }

  kareIste() {
    if (this.kareBekliyor) return;
    this.kareBekliyor = true;
    requestAnimationFrame((t) => this.kare(t));
  }

  private kare(t: number) {
    this.kareBekliyor = false;
    if (!this.kok.isConnected) return;
    let devam = false;

    if (this.kameraGecisi) {
      const g = this.kameraGecisi;
      const u = MathUtils.clamp((t - g.bas) / g.sure, 0, 1);
      const e = gecis(u);
      // Yön küresel olarak, uzaklık doğrusal olarak geçer: kamera beynin etrafında döner.
      const d0 = g.konum0.clone().sub(g.hedef0);
      const d1 = g.konum1.clone().sub(g.hedef1);
      const hedef = g.hedef0.clone().lerp(g.hedef1, e);
      const yon = d0.clone().normalize().lerp(d1.clone().normalize(), e);
      if (yon.lengthSq() < 1e-6) yon.copy(d1).normalize();
      yon.normalize().multiplyScalar(MathUtils.lerp(d0.length(), d1.length(), e));
      this.kamera.position.copy(hedef).add(yon);
      this.kontrol.target.copy(hedef);
      if (u >= 1) {
        this.kameraGecisi = null;
        window.setTimeout(() => this.etiketleriYerlestir(true), 30);
      } else devam = true;
    }

    // Opaklık, renk ve ayrıştırma geçişleri.
    const adim = 0.14;
    for (const n of this.nesneler.values()) {
      if (Math.abs(n.opaklik - n.hedefOpaklik) > 0.005) {
        n.opaklik += (n.hedefOpaklik - n.opaklik) * adim * 1.6;
        devam = true;
      } else n.opaklik = n.hedefOpaklik;
      if (!n.renk.equals(n.hedefRenk)) {
        n.renk.lerp(n.hedefRenk, 0.2);
        if (Math.abs(n.renk.r - n.hedefRenk.r) + Math.abs(n.renk.g - n.hedefRenk.g) + Math.abs(n.renk.b - n.hedefRenk.b) < 0.01) n.renk.copy(n.hedefRenk);
        devam = true;
      }
      const op = n.opaklik;
      n.grup.visible = op > 0.01;
      n.malzeme.color.copy(n.renk);
      const saydam = op < 0.99;
      if (n.malzeme.transparent !== saydam) {
        n.malzeme.transparent = saydam;
        n.malzeme.depthWrite = !saydam;
        n.malzeme.needsUpdate = true;
      }
      n.malzeme.opacity = op;
      for (const k of n.kesitAglari) k.visible = this.duzlemler.length > 0 && op > 0.5;
    }
    if (Math.abs(this.ayristirma - this.hedefAyristirma) > 0.001) {
      this.ayristirma += (this.hedefAyristirma - this.ayristirma) * 0.16;
      devam = true;
    } else this.ayristirma = this.hedefAyristirma;
    for (const n of this.nesneler.values()) n.grup.position.copy(n.merkez).multiplyScalar(this.ayristirma * 0.9);

    const kontrolDegisti = this.kontrol.update();
    if (this.kontrol.autoRotate || kontrolDegisti) devam = true;
    this.cizici.render(this.sahne3b, this.kamera);
    if (!this.hareketli && !this.kameraGecisi && this.etiketler.length > 0 && !this.kontrol.autoRotate) this.etiketleriYerlestir(false);
    if (devam) this.kareIste();
  }
}

let motorSozu: Promise<BeyinMotoru> | null = null;

/** Sayfadaki tek çizici; WebGL açılamazsa hata verir. */
export function motorAl(): Promise<BeyinMotoru> {
  motorSozu ??= Promise.resolve().then(() => new BeyinMotoru());
  motorSozu.catch(() => {
    motorSozu = null;
  });
  return motorSozu;
}
