import Link from 'next/link';
import { JsonLd } from '@/components/seo/json-ld';
import { PageHeader, Section } from '@/components/site/page-header';
import { ReliabilityDemo } from '@/components/site/reliability-demo';
import { breadcrumbLd, pageMeta } from '@/lib/seo';
import { PageGuide } from '@/components/site/page-guide';

export const metadata = pageMeta({
  title: 'Bilimsel yaklaşımımız: hangi testleri neden kullanıyoruz',
  description:
    'Ölçekhane hangi ölçekleri neden seçiyor, Türkçeye nasıl uyarlıyor, norm yokken sonuçları nasıl yorumluyor ve öğrenme stilleri, sağ-sol beyin, projektif testler gibi araçları neden kullanmıyor?',
  path: '/bilimsel-yaklasim',
    ownImage: true,
});

const CRITERIA = [
  {
    t: 'Kanıt',
    d: 'Ölçeğin güvenirliği ve geçerliği hakemli bilimsel yayınlarla gösterilmiş olmalı. Kendi geliştirdiğimiz testlerde bu kanıt henüz yok; bu testler “pilot” olarak işaretlenir ve durumları test sayfasında açıkça yazılır.',
  },
  {
    t: 'Kullanım izni',
    d: 'Ölçeğin çevrim içi ve ücretli bir platformda kullanılmasına izin verilmiş olmalı. Kamu malı ölçekleri (ör. IPIP), açık lisanslı kaynakları ya da yazılı izin aldığımız ölçekleri kullanıyoruz. İzni olmayan bir ölçeği, ne kadar tanınmış olursa olsun kullanmıyoruz.',
  },
  {
    t: 'Yaşa uygunluk',
    d: 'Maddelerin dili ve içeriği öğrencinin yaşına uygun olmalı. Her test yalnızca uygun olduğu sınıf düzeylerinde açılır.',
  },
];

const ADAPTATION = [
  ['Çeviri ve sade dil', 'Maddeler Türkçeye çevrilir ve ergenlerin rahatça anlayacağı bir dile getirilir. Her çevirinin yanında özgün madde metni belgelenir.'],
  ['Uzman incelemesi', 'Psikoloji ve ölçme alanından uzmanlar, çevirinin özgün anlamı koruyup korumadığını değerlendirir.'],
  ['Öğrencilerle anlaşılırlık denemesi', 'Maddeler küçük bir öğrenci grubuna okutulur; yanlış anlaşılan ifadeler düzeltilir.'],
  ['Güvenirlik ve geçerlik çalışması', 'Test, velilerin bilgilendirilmiş onayıyla yeterli sayıda öğrenciye uygulanır. İç tutarlılık (Cronbach alfa), madde analizi, faktör yapısı ve yaş ile cinsiyet grupları arasında ölçme eşdeğerliği incelenir.'],
  ['Norm çalışması', 'Türkiye’yi temsil eden bir örneklemle sınıf düzeylerine göre normlar hesaplanır. Ancak bundan sonra puanlar akranlarla karşılaştırılarak, yüzdelik değerlerle yorumlanabilir.'],
];

const NOT_USED = [
  {
    t: 'Projektif testler (mürekkep lekesi, resim çizdirme, cümle tamamlama)',
    d: 'Bu testlerin göstergelerinin büyük bölümünün bilimsel desteği zayıftır; desteklenen az sayıdaki gösterge de ancak eğitimli bir klinisyen tarafından, yüz yüze uygulandığında anlam taşır. İnternette kendi kendine çözülen bir “psikoanaliz testi” geçerli bir ölçüm değildir.',
    ref: 'Lilienfeld, Wood ve Garb, 2000',
  },
  {
    t: 'Öğrenme stilleri (görsel, işitsel, kinestetik)',
    d: 'Öğretimi öğrencinin “öğrenme stiline” göre ayarlamanın başarıyı artırdığı fikri kontrollü çalışmalarda büyük ölçüde desteklenmemiştir. 2024 tarihli bir meta-analiz, gözlenen etkilerin yaygın kullanımı haklı çıkaramayacak kadar küçük ve seyrek olduğu sonucuna varmıştır. Bunun yerine, etkisi araştırmalarla gösterilmiş ders çalışma alışkanlıklarını ölçüyoruz.',
    ref: 'Pashler ve ark., 2008; Clinton-Lisell ve Litzinger, 2024',
  },
  {
    t: 'Sağ beyin / sol beyin testleri',
    d: 'Beynin iki yarımküresi birlikte çalışır. Bin kişiden fazla katılımcıyla yapılan bir beyin görüntüleme çalışması, insanların “sağ beyinli” ya da “sol beyinli” diye ayrılabileceğine dair bir bulgu elde etmemiştir. Bu tür testler çocuğa gereksiz bir etiket verir.',
    ref: 'Nielsen ve ark., 2013',
  },
  {
    t: 'Parmak izinden yetenek tahmini (dermatoglifik testler)',
    d: 'Parmak izi desenleri ile zekâ, yetenek ya da meslek uygunluğu arasında bilimsel olarak gösterilmiş bir ilişki yoktur.',
    ref: '',
  },
  {
    t: 'MBTI, Enneagram ve benzeri “tip” testleri',
    d: 'Bu araçlar kişiyi sınırlı sayıda “tipe” yerleştirir. Tekrar uygulamada kişilerin azımsanmayacak bir kısmı farklı bir tip alır; bazılarının kullanımı da lisansa bağlıdır. Kişiliği “ya o ya bu” diye değil, sürekli boyutlarla ölçen Beş Faktör modelini tercih ediyoruz.',
    ref: 'Pittenger, 2005',
  },
  {
    t: 'Çocuklara çevrim içi zekâ (IQ) puanı',
    d: 'Zekâ testleri standart koşullarda ve eğitimli bir uygulayıcı tarafından yapılmalıdır. Bilişsel görevlerimiz dikkat ve çalışma belleği gibi belirli becerileri ölçer; bir zekâ puanı vermez.',
    ref: '',
  },
];

const REFS = [
  {
    t: 'Clinton-Lisell, V. ve Litzinger, C. (2024). Is it really a neuromyth? A meta-analysis of the learning styles matching hypothesis. Frontiers in Psychology, 15, 1428732.',
    u: 'https://doi.org/10.3389/fpsyg.2024.1428732',
  },
  {
    t: 'Goldberg, L. R. ve ark. (2006). The International Personality Item Pool and the future of public-domain personality measures. Journal of Research in Personality, 40(1), 84–96.',
    u: 'https://doi.org/10.1016/j.jrp.2005.08.007',
  },
  {
    t: 'International Test Commission (2017). ITC Guidelines for Translating and Adapting Tests (2. baskı).',
    u: 'https://www.intestcom.org/files/guideline_test_adaptation_2ed.pdf',
  },
  {
    t: 'Lilienfeld, S. O., Wood, J. M. ve Garb, H. N. (2000). The scientific status of projective techniques. Psychological Science in the Public Interest, 1(2), 27–66.',
    u: 'https://doi.org/10.1111/1529-1006.002',
  },
  {
    t: 'Nielsen, J. A., Zielinski, B. A., Ferguson, M. A., Lainhart, J. E. ve Anderson, J. S. (2013). An evaluation of the left-brain vs. right-brain hypothesis with resting state functional connectivity magnetic resonance imaging. PLOS ONE, 8(8), e71275.',
    u: 'https://doi.org/10.1371/journal.pone.0071275',
  },
  {
    t: 'Pashler, H., McDaniel, M., Rohrer, D. ve Bjork, R. (2008). Learning styles: Concepts and evidence. Psychological Science in the Public Interest, 9(3), 105–119.',
    u: 'https://doi.org/10.1111/j.1539-6053.2009.01038.x',
  },
  {
    t: 'Pittenger, D. J. (2005). Cautionary comments regarding the Myers-Briggs Type Indicator. Consulting Psychology Journal: Practice and Research, 57(3), 210–221.',
    u: 'https://doi.org/10.1037/1065-9293.57.3.210',
  },
];

export default function SciencePage() {
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: 'Ana sayfa', path: '/' },
          { name: 'Bilimsel yaklaşımımız', path: '/bilimsel-yaklasim' },
        ])}
      />
      <PageHeader
        title="Bilimsel yaklaşımımız"
        lede="Bir test, arkasındaki kanıt kadar güvenilirdir. Hangi araçları neden seçtiğimizi, neleri bilerek kullanmadığımızı ve sonuçları nasıl yorumladığımızı burada açıkça anlatıyoruz."
      >
        <PageGuide next={[{ href: '/testler', label: 'Testlere göz at' }, { href: '/rehber/kisilik-testleri-guvenilir-mi', label: 'Testler güvenilir mi?' }]}>
          <p>
            Bu sayfada testlerimizin hangi kaynaklara dayandığını, neyi ölçüp neyi ölçmediğini ve sonuçların nasıl yorumlanacağını
            okuyabilirsiniz. Her testin kendi bilimsel dayanağı, test sayfasındaki bilim kartında ayrıca yazar.
          </p>
        </PageGuide>
      </PageHeader>

      <Section id="olcutler" title="Bir testi hangi ölçütlerle seçiyoruz?">
        <dl className="flex flex-col gap-7">
          {CRITERIA.map((c) => (
            <div key={c.t} className="grid gap-2 sm:grid-cols-[10rem_1fr] sm:gap-6">
              <dt className="font-display text-xl font-bold">{c.t}</dt>
              <dd className="measure text-ink-2">{c.d}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section id="iki-soru" title="Güvenirlik ve geçerlik" intro="Bir testin iyi olup olmadığını iki soru belirler." className="border-t border-rule">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2 border-t-2 border-ink pt-4">
            <h3 className="t-h3">Güvenirlik: tutarlı ölçüyor mu?</h3>
            <p className="text-ink-2">
              Aynı kişiyi tarttığınızda banyo tartısı her seferinde aynı kiloyu gösteriyorsa tartı güvenilirdir. Bir testin güvenirliği de
              maddelerinin aynı özelliği ne kadar tutarlı ölçtüğünü gösterir.
            </p>
          </div>
          <div className="flex flex-col gap-2 border-t-2 border-ink pt-4">
            <h3 className="t-h3">Geçerlik: doğru şeyi mi ölçüyor?</h3>
            <p className="text-ink-2">
              Tartı her seferinde aynı sayıyı gösterip yine de üç kilo eksik tartıyor olabilir. Geçerlik, testin ölçtüğünü söylediği şeyi
              gerçekten ölçüp ölçmediğidir. Güvenirlik geçerliğin ön koşuludur ama tek başına yetmez.
            </p>
          </div>
        </div>
      </Section>

      <Section
        id="olcum-payi"
        title="Ölçüm payı nedir?"
        intro="Hiçbir test kusursuz değildir. Güvenirliği bilinen ölçeklerde raporda puanın yanında bir ölçüm payı da gösteriyoruz."
        className="border-t border-rule"
      >
        <p className="measure">
          Bir öğrenci aynı testi farklı günlerde çözse puanı biraz değişir. Bu değişimin ne kadar olabileceğini testin güvenirliği belirler.
          Aşağıdaki kaydırıcılarla güvenirlik değiştikçe ölçüm payının nasıl genişleyip daraldığını görebilirsiniz.
        </p>
        <ReliabilityDemo />
        <p className="t-meta measure">
          Hesap: ölçmenin standart hatası = standart sapma × √(1 − güvenirlik). Örnekte standart sapma 0,7 alınmıştır; gösterilen aralık %90
          güven aralığıdır.
        </p>
      </Section>

      <Section
        id="uyarlama"
        title="Bir testin Türkçe sürümü nasıl doğrulanır?"
        intro="Uluslararası Test Komisyonu’nun (ITC) test uyarlama yönergelerine göre bir ölçeğin Türkçe sürümü şu beş adımdan geçmelidir. Kendi geliştirdiğimiz testler için de aynı adımlar gerekir."
        className="border-t border-rule"
      >
        <ol className="flex flex-col gap-6">
          {ADAPTATION.map(([t, d], i) => (
            <li key={t} className="grid grid-cols-[2.75rem_1fr] gap-5">
              <span
                className="flex h-11 w-11 items-center justify-center rounded-full border-[1.5px] border-ink font-display text-xl font-bold"
                aria-hidden="true"
              >
                {i + 1}
              </span>
              <div>
                <h3 className="t-h3">{t}</h3>
                <p className="measure mt-1 text-ink-2">{d}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="notice notice-info measure flex flex-col gap-2">
          <p className="font-bold">Sitedeki testler bu adımların neresinde?</p>
          <p>
            Çevirisini yaptığımız testlerde (Beş Faktör Kişilik ve Öz-saygı) yalnızca ilk adım tamamlandı; kendi geliştirdiğimiz testler
            yazılmış ve kaynaklarıyla belgelenmiş durumda. Hiçbir test için uzman incelemesi, güvenirlik ve geçerlik ya da norm çalışması henüz
            yapılmadı. Sitemiz hiçbir test cevabını saklamadığı için bu çalışmalar site üzerinden yapılamaz; ancak katılımcıların
            bilgilendirilmiş onayıyla yürütülen ayrı bir araştırmayla yapılabilir.
          </p>
          <p>
            Her testin sayfasındaki <strong>bilim kartında</strong> o testin durumu yazar. <Link href="/testler">Testlere göz atın</Link>
          </p>
        </div>
      </Section>

      <Section id="norm" title="Norm yokken sonuçları nasıl yorumluyoruz?" className="border-t border-rule">
        <p className="measure">
          Norm, bir puanın aynı yaştaki öğrencilerle karşılaştırıldığında nerede durduğunu gösterir. Türkçeye uyarlanmış ölçeklerin çoğunda
          güvenirlik ve geçerlik çalışması vardır, ancak sınıf düzeylerine göre yayımlanmış normlar oldukça azdır.
        </p>
        <p className="measure">
          Normu henüz hazır olmayan testlerde puanı <strong>ölçeğin kendi aralığına göre</strong> yorumluyoruz: “Bu özelliği kendinde ne kadar
          görüyorsun?” sorusuna verilen cevapların ortalaması. Bu yorum öğrencinin kendini nasıl tanımladığını gösterir ama akranlarıyla
          karşılaştırma yapmaz. Rapor bu farkı her zaman açıkça belirtir.
        </p>
        <p className="measure">
          Şu an sitedeki testlerin hiçbirinin Türkiye normu yok; bu yüzden hiçbir raporda “akranlarının yüzde kaçından yüksek” gibi bir
          karşılaştırma bulunmaz. Sitemiz cevapları saklamadığı için normlar sitedeki cevaplardan oluşturulamaz. Bir test için güvenilir bir
          norm yayımlanırsa, raporlar ancak o zaman akranlarla karşılaştırma yapmaya başlar ve bu değişiklik test sayfasında açıkça yazılır.
        </p>
      </Section>

      <Section id="kalite" title="Cevap kalitesini nasıl kontrol ediyoruz?" className="border-t border-rule">
        <ul className="measure flex list-disc flex-col gap-2 pl-5">
          <li>Her maddenin cevaplanma süresini ölçüyoruz. Cümleyi okumaya yetmeyecek kadar hızlı verilen cevaplar raporda uyarı olarak görünür.</li>
          <li>Uzun bölümlerde hep aynı seçeneğin işaretlenmesini fark ediyoruz. Testlerde ters yönlü maddeler olduğu için bu durum dikkatsizliğe işaret eder.</li>
          <li>Yeterince madde cevaplanmamışsa o bölüm için puan hesaplamıyoruz.</li>
          <li>Okuma görevinde metin çok hızlı geçildiyse hız değerini güvenilir saymıyoruz.</li>
        </ul>
      </Section>

      <Section
        id="kullanmadiklarimiz"
        title="Neleri bilerek kullanmıyoruz?"
        intro="İnternette yaygın olan bazı test türlerinin bilimsel dayanağı yok ya da çevrim içi uygulamaya uygun değil."
        className="border-t border-rule"
      >
        <ul className="flex flex-col divide-y divide-rule border-y border-rule">
          {NOT_USED.map((n) => (
            <li key={n.t} className="flex flex-col gap-1.5 py-5">
              <h3 className="t-h3">{n.t}</h3>
              <p className="measure text-ink-2">{n.d}</p>
              {n.ref && <p className="t-meta">Kaynak: {n.ref}</p>}
            </li>
          ))}
        </ul>
      </Section>

      <Section id="tani" title="Tanı koymuyoruz" className="border-t border-rule">
        <p className="measure">
          Raporlarımız psikolojik ya da tıbbi bir tanı değildir ve tanının yerine geçmez. Çocuğu etiketlemez; güçlü yanları ve gelişim alanlarını
          anlatır. Bir sonuç dikkat gerektiriyorsa raporda okulun rehberlik servisine ya da bir uzmana başvurmanızı öneririz.
        </p>
        <p>
          Veliler için: <Link href="/veliler-icin#uzman">Ne zaman bir uzmana başvurmalı?</Link>
        </p>
      </Section>

      <Section id="kaynaklar" title="Kaynaklar" className="border-t border-rule">
        <ul className="flex flex-col gap-3 text-[0.975rem]">
          {REFS.map((r) => (
            <li key={r.u} className="measure">
              {r.t}{' '}
              <a href={r.u} target="_blank" rel="noopener noreferrer" className="break-all">
                {r.u.replace('https://', '')}
              </a>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
