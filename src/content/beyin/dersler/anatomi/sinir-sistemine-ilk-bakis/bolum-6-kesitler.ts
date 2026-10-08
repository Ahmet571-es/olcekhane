import type { DersBolumu, Sahne } from '../../../types';

const KESIT_KATMANLARI: Sahne['katmanlar'] = ['kabuk', 'beyaz', 'derin', 'karincik', 'sap'];

/** 6. bölüm: kesit düzlemleri, MR ve BT okuma, görüntü dosyalarında koordinatlar. */
export const kesitDuzlemleri: DersBolumu = {
  id: 'kesit-duzlemleri',
  baslik: 'Kesit düzlemleri, MR ve BT',
  bloklar: [
    {
      tur: 'metin',
      md: `Beynin içini görmenin en iyi yolu onu hayalî düzlemlerle dilimlemektir. MR görüntüleri de bu düzlemlerde çekilir:

- **Sagital düzlem** beyni **sağ ve sol** diye ayırır. Tam orta hattan geçene **orta sagital** (median) düzlem, ondan yana kaymış olanlara **parasagital** düzlem denir.
- **Koronal (frontal) düzlem** beyni **ön ve arka** diye ayırır.
- **Aksiyel (horizontal, transvers) düzlem** beyni **üst ve alt** diye ayırır.`,
    },
    {
      tur: 'sahne',
      baslik: 'Kendi kesitini al',
      aciklama:
        'Önce bir düzlem seç, sonra kaydırıcıyla kesitin yerini değiştir. Kesilen yüzeyde gri ve beyaz cevher, derin çekirdekler ve karıncıklar görünür. Katmanlar düğmesiyle kafatasını da ekleyebilirsin.',
      sahne: {
        katmanlar: KESIT_KATMANLARI,
        renk: 'dogal',
        gizle: ['bolge:sinir'],
        kesit: { duzlem: 'aksiyel', konum: 0.3 },
        bakis: 'ust',
      },
      araclar: ['kesit', 'bakis', 'katman', 'liste'],
    },
    {
      tur: 'sahne',
      baslik: 'Orta sagital kesit: beynin iç yüzü',
      aciklama:
        'Sağ yarımküre kaldırıldı; sol yarımküreye içeriden bakıyorsun. Korpus kallozum, talamus, beyin sapının üç bölümü ve beyinciğin kesit yüzü bu görünümde bir arada izlenir.',
      sahne: {
        katmanlar: KESIT_KATMANLARI,
        renk: 'yapi',
        gizle: ['bolge:sinir'],
        yarim: 'sol',
        bakis: 'ic-sol',
        etiketler: [
          { yapi: 'korpus-kallozum' },
          { yapi: 'singulat-girus-sol', metin: 'Singulat girus' },
          { yapi: 'talamus-sol', metin: 'Talamus' },
          { yapi: 'orta-beyin' },
          { yapi: 'pons' },
          { yapi: 'omurilik-sogani' },
          { yapi: 'beyincik' },
        ],
      },
      araclar: ['bakis', 'yarim', 'liste'],
    },
    {
      tur: 'metin',
      md: 'Kesit görüntüsüne bakarken bir sorun daha var: ekranın solu hastanın solu mudur, sağı mı? Bunun için iki kural kullanılır.',
    },
    {
      tur: 'animasyon',
      ad: 'mr-gosterimi',
      duzey: 'lisans',
      baslik: 'MR’da sağ ve sol',
      aciklama:
        'Radyolojik gösterimde aksiyel kesite hastanın ayak ucundan bakılır; hastanın sağı ekranın solunda görünür. Düğmeyle nörolojik gösterime geçince görüntü aynalanır.',
    },
    {
      tur: 'kutu',
      cesit: 'sinav-notu',
      md: `- **Sagital:** sağ ve sol · **Koronal:** ön ve arka · **Aksiyel:** üst ve alt.
- **Radyolojik gösterim:** aksiyel kesitlere ayak ucundan, koronal kesitlere hastanın karşısından bakılır; hastanın **sağı ekranın solundadır**.
- Bazı araştırma programları ters kuralı (nörolojik gösterim) kullanır. Görüntüdeki **R (sağ)** ve **L (sol)** harflerine bakmadan taraf söylenmez.`,
    },
    {
      tur: 'kutu',
      cesit: 'goruntuleme',
      baslik: 'BT ve MR’da ne ne renkte görünür?',
      md: `**Bilgisayarlı tomografide (BT)** dokuların yoğunluğu Hounsfield birimiyle (HU) ölçülür:

- **Kemik** çok parlaktır (1000 HU’nun üstü). Görüntüden kafatasını ayıklayan yazılımlar beyin dokusunu kabaca 20–80 HU aralığıyla seçer (Pham ve ark., 2026).
- **Beyin-omurilik sıvısı** beyinden koyudur: bir çalışmada BT’de BOS 0–15 HU eşiğiyle ayrıldı (Lee ve ark., 2026).
- **Taze kan** parlaktır (beyinden yoğun). Subdural kanamada kan ilk günlerde parlak, yaklaşık iki haftaya kadar beyinle aynı yoğunlukta, üç haftadan sonra koyu görünür (Nouri ve ark., 2021). Parlak bir alan kanamayı, daha seyrek olarak kireçlenmeyi gösterebilir (Bustamante ve ark., 2026).

**Manyetik rezonans (MR)** görüntülemede aynı doku farklı sekanslarda farklı parlaklıkta görünür (Simha ve ark., 2012):

- **T1 ağırlıklı:** BOS koyu; gri cevher beyaz cevherden koyu.
- **T2 ağırlıklı:** BOS parlak; beyaz cevher gri cevherden koyu.
- **FLAIR:** T2’ye benzer ama karıncıklardaki BOS’un parlak sinyali bastırılır; böylece karıncıkların yanındaki beyaz cevher lezyonları (örneğin MS plakları) daha iyi seçilir.
- **Difüzyon ağırlıklı görüntüleme (DWI):** Akut enfarkt, suyun hareketinin kısıtlandığı parlak bir alan olarak görünür; damar tıkandıktan sonraki dakikalar içinde saptanabilir (Simha ve ark., 2012; Tedyanto ve ark., 2022).`,
    },
    {
      tur: 'kutu',
      cesit: 'derinles',
      duzey: 'ileri',
      baslik: 'Görüntü dosyalarında sağ ve sol: RAS ve LPS',
      md: `Radyolojik ve nörolojik gösterim ekrana ait bir kuraldır; görüntü dosyalarının içinde ise koordinatlar bir eksen kuralıyla yazılır. Nörogörüntülemede yaygın kural **RAS+** dır: x ekseni soldan **sağa** (Right), y ekseni arkadan **öne** (Anterior), z ekseni aşağıdan **yukarı** (Superior) doğru artar. DICOM dosyaları ise vokselleri tarayıcının **LPS+** uzayına bağlar: x sola, y arkaya doğru artar (NiBabel). İki kuralda x ve y eksenlerinin yönü terstir; bu yüzden bir dosyanın hangi kuralı kullandığı bilinmeden yapılan dönüşüm sağı ve solu karıştırabilir.

Standart uzaylarda başlangıç noktası (0, 0, 0) ön komissürdür: MNI uzayında ön komissürün orta hattı kestiği nokta, Talairach uzayında da AC noktasıdır ve Y ekseni arka komissürden geçer (NiBabel).`,
    },
  ],
};
