import Link from 'next/link';
import { JsonLd } from '@/components/seo/json-ld';
import { PageHeader, Section } from '@/components/site/page-header';
import { PageGuide } from '@/components/site/page-guide';
import { PACKAGE_AREAS, PACKAGE_NAME, PACKAGE_PATH, packageGrades, packageMinutes, packageTests, type PackageTest } from '@/content/paket';
import { ADULT_GRADE, ADULT_PARAM, GRADE_LABELS } from '@/lib/config';
import { breadcrumbLd, pageMeta } from '@/lib/seo';

export const metadata = pageMeta({
  title: 'Kendini Tanı Paketi: kişilik, ilgi ve zekâ testleri tek raporda (ücretsiz)',
  description:
    'Kişilik, ilgi alanları, çalışma alışkanlıkları ve dört zihinsel beceri testi art arda; sonunda tek rapor ve tek PDF. 5. sınıftan yetişkinlere, ücretsiz, hesap açmadan; cevaplar saklanmaz.',
  path: PACKAGE_PATH,
});

/** Aynı testlerden oluşan sınıfları birleştirir: "6. sınıf", "9. sınıftan mezuna", "Yetişkin". */
function compositions() {
  const out: { grades: number[]; tests: PackageTest[] }[] = [];
  for (const g of packageGrades()) {
    const tests = packageTests(g);
    const key = tests.map((t) => t.def.slug).join(',');
    const last = out[out.length - 1];
    if (last && last.tests.map((t) => t.def.slug).join(',') === key && g !== ADULT_GRADE && last.grades.at(-1) === g - 1) last.grades.push(g);
    else out.push({ grades: [g], tests });
  }
  return out;
}

function gradesLabel(grades: number[]): string {
  if (grades[0] === ADULT_GRADE) return 'Üniversite ve yetişkin';
  const a = grades[0];
  const b = grades[grades.length - 1];
  if (a === b) return GRADE_LABELS[a] ?? `${a}. sınıf`;
  return b === 13 ? `${a}. sınıftan mezuna` : `${a}–${b}. sınıf`;
}

const FAQ = [
  {
    q: 'Neden yaklaşık bir saat?',
    a: 'Paket en çok yedi testi bir araya getirir: kişilik, ilgi alanları, çalışma alışkanlıkları ve dört zihinsel beceri (akıl yürütme, sözel, uzamsal, bellek). Her test kendi başına da çözülebilir; paket hepsini tek oturumda ve tek raporda toplar.',
  },
  {
    q: 'Ara verebilir miyim?',
    a: 'Evet. Bir test bitince sıradaki testi sen başlatırsın; arada mola verebilirsin. Yalnızca sayfayı kapatma ve yenileme: cevapların ve raporların hiçbir yere kaydedilmediği için yalnızca açık sayfada durur.',
  },
  {
    q: 'İstemediğim bir testi çıkarabilir miyim?',
    a: 'Evet. Başlamadan önce istemediğin testin işaretini kaldırabilir, paket sürerken sıradaki testi atlayabilir ya da paketi istediğin an bitirip o ana kadarki raporları alabilirsin.',
  },
  {
    q: 'Özet testleri birbirine bağlayan bir yorum yapıyor mu?',
    a: 'Hayır. Özet her testin öne çıkan sonuçlarını yan yana koyar; her satır o testin kendi raporunda da yazar. Testleri birbirine bağlayan yeni bir yorum eklenmez; ayrıntılar ve öneriler her testin kendi raporundadır.',
  },
  {
    q: 'Zekâ puanı (IQ) veriyor mu?',
    a: 'Hayır. Zihinsel beceriler ayrı ayrı ölçülür ve her biri kendi raporunda anlatılır; tek bir zekâ puanı hesaplanmaz. Türkiye normu olmayan testlerde sonuç başkalarıyla karşılaştırılmaz.',
  },
  {
    q: 'Bir tanı mı?',
    a: 'Hayır. Testler kişinin kendi cevaplarına ve o gün gösterdiği performansa dayanır; tanı koymaz. Her testin bilimsel dayanağı, sınırları ve norm durumu kendi sayfasında ve raporunda yazıyor.',
  },
];

export default function PackagePage() {
  const groups = compositions();
  const grades = packageGrades();
  const mins = groups.map((c) => packageMinutes(c.tests));
  const range = Math.min(...mins) === Math.max(...mins) ? `${mins[0]}` : `${Math.min(...mins)}–${Math.max(...mins)}`;
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: 'Ana sayfa', path: '/' },
          { name: 'Testler', path: '/testler' },
          { name: PACKAGE_NAME, path: PACKAGE_PATH },
        ])}
      />
      <PageHeader
        kicker={`Ücretsiz · yaklaşık ${range} dakika · 5. sınıftan yetişkinlere`}
        title={PACKAGE_NAME}
        lede="Kişiliğin, ilgi alanların, çalışma alışkanlıkların ve dört zihinsel becerin için testler art arda açılır. Sonunda başta kısa bir özet, ardından her testin kendi raporu ve gelişim yol haritası: hepsi tek PDF’te."
      >
        <PageGuide
          steps={[
            'Paketi kimin çözdüğünü seç: testler sınıfa göre seçilir.',
            'Testleri sırayla çöz; aralarda mola verebilir, istemediğin testi atlayabilirsin.',
            'Özeti ve bütün raporları oku, tek PDF olarak indir; istersen sonucunu paylaş.',
          ]}
        >
          <p>Hesap açmadan, ücretsiz. Cevapların hiçbir yere kaydedilmez.</p>
        </PageGuide>
        <form method="get" action={`${PACKAGE_PATH}/coz`} className="flex flex-wrap items-end gap-3">
          <div className="field min-w-[15rem]">
            <label htmlFor="sinif" className="field-label">
              Paketi kim çözüyor?
            </label>
            <select id="sinif" name="sinif" className="input" defaultValue="" required>
              <option value="" disabled>
                Seç
              </option>
              {grades
                .filter((g) => g !== ADULT_GRADE)
                .map((g) => (
                  <option key={g} value={g}>
                    {GRADE_LABELS[g] ?? `${g}. sınıf`}
                  </option>
                ))}
              {grades.includes(ADULT_GRADE) && <option value={ADULT_PARAM}>Yetişkinim (18 yaş ve üzeri)</option>}
            </select>
          </div>
          <button type="submit" className="btn btn-primary btn-lg">
            Pakete başla
          </button>
        </form>
      </PageHeader>

      <Section id="icerik-listesi" title="Pakette neler var?" intro="Testler sınıfa göre seçilir: her yaşa uygun olanlar. Paketteki her test kendi sayfasında tek başına da çözülebilir.">
        <div className="grid gap-4 md:grid-cols-2">
          {groups.map((c) => (
            <div key={c.grades.join('-')} className="panel flex flex-col gap-3 p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-display text-xl font-bold">{gradesLabel(c.grades)}</h3>
                <p className="t-meta">
                  {c.tests.length} test · yaklaşık {packageMinutes(c.tests)} dakika
                </p>
              </div>
              <ul className="flex flex-col gap-1.5">
                {c.tests.map((t) => (
                  <li key={t.def.slug} className="flex flex-wrap items-baseline gap-x-2">
                    <span className="t-small text-ink-3">{t.slot.skill}:</span>
                    <Link href={`/testler/${t.def.slug}`}>{t.def.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="t-small text-ink-2">
          Alanlar: {PACKAGE_AREAS.map((a) => a.name).join(', ')}. 5. ve 6. sınıfa uygun bir ilgi testi henüz yok; bu sınıflarda paket ilgi testi olmadan
          gelir.
        </p>
      </Section>

      <Section id="rapor" title="Rapor nasıl?" className="border-t border-rule">
        <ul className="flex list-disc flex-col gap-2 pl-5 text-ink-2">
          <li>
            <strong className="text-ink">Kısa bir özet:</strong> her testin öne çıkan sonuçları yan yana. Özet testleri birbirine bağlayan yeni bir yorum
            eklemez; her satır o testin kendi raporunda da yazar.
          </li>
          <li>
            <strong className="text-ink">Her testin kendi raporu:</strong> grafikler, her başlık için açıklama ve dört haftalık küçük adımlarla gelişim
            yol haritası.
          </li>
          <li>
            <strong className="text-ink">Öğrenci ve veli için ayrı:</strong> okul çağındakilere iki rapor (öğrenciye ve veliye), yetişkine tek, kişisel
            rapor.
          </li>
          <li>
            <strong className="text-ink">Tek PDF ve paylaşım görseli:</strong> bütün raporlar tek dosyada. İstersen kişilik ve ilgi sonuçlarının özetini
            Instagram hikâyesine ya da WhatsApp durumuna uygun bir görsel olarak paylaşabilirsin; zihinsel beceri sonuçları görsele girmez.
          </li>
        </ul>
      </Section>

      <Section id="sorular" title="Sık sorulanlar" className="border-t border-rule">
        <dl className="flex flex-col gap-5">
          {FAQ.map((f) => (
            <div key={f.q} className="flex flex-col gap-1">
              <dt className="font-bold">{f.q}</dt>
              <dd className="text-ink-2">{f.a}</dd>
            </div>
          ))}
        </dl>
      </Section>
    </>
  );
}
