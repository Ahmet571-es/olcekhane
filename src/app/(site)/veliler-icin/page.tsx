import Link from 'next/link';
import { PageHeader, Section } from '@/components/site/page-header';
import { pageMeta } from '@/lib/seo';
import { GroupPicker } from '@/components/site/group-picker';
import { PageGuide } from '@/components/site/page-guide';

export const metadata = pageMeta({
  title: 'Veliler için: çocuğunuzu bilimsel testlerle tanıyın',
  description:
    'Ölçekhane veliler için nasıl çalışır? Hesap açmadan ücretsiz test, öğrenci ve veli için iki ayrı rapor, PDF olarak. Raporu çocuğunuzla nasıl konuşacağınız ve ne zaman bir uzmana başvurmanız gerektiği.',
  path: '/veliler-icin',
  ownImage: true,
});

const STEPS = [
  {
    t: 'Bir test seçin',
    d: 'Testler sayfasından çocuğunuza uygun bir test seçin. Her testin süresi, uygun olduğu sınıflar ve bilimsel dayanağı test sayfasında yazıyor.',
  },
  {
    t: 'Sınıfı seçip başlayın',
    d: 'Hesap açmanız gerekmez; ad, e-posta ya da telefon istemiyoruz. Yalnızca sınıfı seçersiniz, çünkü sorular ve rapor sınıf düzeyine göre hazırlanır.',
  },
  {
    t: 'Testi çocuğunuz çözsün',
    d: 'Cihazı çocuğunuza verin; yakınında olun ama cevaplara karışmayın. Sessiz bir ortam ve acele etmemek en doğru sonucu verir. Testi tek seferde bitirin: sayfa kapanırsa cevaplar silinir.',
  },
  {
    t: 'Raporu birlikte okuyun, PDF olarak saklayın',
    d: 'Test biter bitmez iki rapor hazırlanır: biri size, biri çocuğunuza. Raporlar hiçbir yerde saklanmaz; saklamak için PDF olarak indirin. Önce çocuğunuzun raporunu birlikte okumanızı öneririz.',
  },
];

const TALK = [
  'Güçlü yanlardan başlayın. Raporda çocuğunuzun iyi yaptığı ya da ona kolay gelen şeyleri bulun ve önce onları konuşun.',
  '“Sence bu seni anlatıyor mu?” diye sorun. Çocuğunuzun katılmadığı yerler, raporun kendisi kadar değerlidir.',
  'Etiket kullanmayın. “Sen içe dönüksün” yerine “Kalabalık yerine küçük grupları seviyorsun gibi görünüyor” demek, değişim ve gelişim için alan bırakır.',
  'Kardeşlerle ya da arkadaşlarıyla karşılaştırmayın. Kişilik boyutlarında iyi ya da kötü uç yoktur.',
  'Sonucu kesin bir yargı gibi değil, bugünkü hâlinin bir fotoğrafı gibi görün. Ergenlikte kişilik ve beceriler gelişmeye devam eder.',
];

export default function ParentsPage() {
  return (
    <>
      <PageHeader
        title="Veliler için"
        lede="Çocuğunuzu en iyi siz tanırsınız. Ölçekhane bu bilgiye bilimsel ölçümlerden gelen ikinci bir bakış ekler: çocuğunuzun kendini nasıl gördüğü, neye ilgi duyduğu ve nasıl öğrendiği."
      >
        <PageGuide
          steps={[
            'Çocuğunuzun sınıfına uygun testleri açın ve birlikte birini seçin.',
            'Testi çocuğunuz çözsün; siz yanında olun ama cevap vermeyin.',
            'Öğrenci ve veli raporunu birlikte okuyun, PDF olarak saklayın.',
          ]}
        >
          <p>
            Bu sayfada çocuğunuzla test seçmeyi, raporu birlikte okumayı ve ne zaman bir uzmana başvuracağınızı bulacaksınız. Önce
            çocuğunuzun grubunu seçin:
          </p>
          <GroupPicker compact />
        </PageGuide>
        <div className="flex flex-wrap gap-3">
          <Link href="/testler" className="btn btn-primary btn-lg">
            Bütün testler
          </Link>
          <a href="#nasil" className="btn btn-secondary btn-lg">
            Nasıl işler?
          </a>
        </div>
      </PageHeader>

      <Section id="nasil" title="Nasıl işler?">
        <ol className="flex flex-col gap-7">
          {STEPS.map((s, i) => (
            <li key={s.t} className="grid grid-cols-[2.75rem_1fr] gap-5">
              <span
                className="flex h-11 w-11 items-center justify-center rounded-full border-[1.5px] border-ink font-display text-xl font-bold tabular"
                aria-hidden="true"
              >
                {i + 1}
              </span>
              <div>
                <h3 className="t-h3">{s.t}</h3>
                <p className="measure mt-1 text-ink-2">{s.d}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section
        id="konusmak"
        title="Raporu çocuğunuzla nasıl konuşursunuz?"
        intro="Raporun asıl değeri, açtığı sohbettedir."
        className="border-t border-rule"
      >
        <ul className="flex flex-col gap-4">
          {TALK.map((t) => (
            <li key={t} className="measure border-l-2 border-brass pl-4">
              {t}
            </li>
          ))}
        </ul>
      </Section>

      <Section id="gelisim" title="Gelişimini izleyin" className="border-t border-rule">
        <p className="measure">
          Aynı testi aradan zaman geçtikten sonra yeniden çözebilirsiniz. Sonuçları biz saklamadığımız için karşılaştırmak isterseniz her
          seferinde raporu PDF olarak indirip saklayın; raporda testin tarihi yazar. Kişilik ölçümlerinde anlamlı bir değişim görmek için
          genellikle en az 6–12 ay beklemek gerekir; okuma gibi becerilerde ise bir dönem sonra yapılan tekrar fikir verir.
        </p>
      </Section>

      <Section id="uzman" title="Ne zaman bir uzmana başvurmalı?" className="border-t border-rule">
        <p className="measure">
          Ölçekhane’deki testler tanı koymaz. Aşağıdaki durumlardan biri birkaç haftadır sürüyor ve çocuğunuzun okulunu, uykusunu ya da
          arkadaşlıklarını etkiliyorsa, test sonucu ne olursa olsun bir uzmanla görüşmenizi öneririz:
        </p>
        <ul className="measure flex list-disc flex-col gap-2 pl-5">
          <li>Belirgin ve süreğen mutsuzluk, isteksizlik ya da içe kapanma</li>
          <li>Günlük hayatı zorlaştıran kaygı, okula gitmek istememe</li>
          <li>Uyku ya da yeme düzeninde belirgin değişiklik</li>
          <li>Kendine zarar verme ya da ölümden söz etme</li>
        </ul>
        <div className="notice notice-info measure">
          <p>
            İlk adım olarak okulun rehberlik servisine (psikolojik danışman) ya da aile hekiminize başvurabilirsiniz. Çocuğunuzun güvenliğiyle
            ilgili acil bir durum olduğunu düşünüyorsanız <strong>112</strong>’yi arayın.
          </p>
        </div>
      </Section>

      <Section id="gizlilik" title="Çocuğunuzun verileri" className="border-t border-rule">
        <ul className="measure flex list-disc flex-col gap-2 pl-5">
          <li>Hesap açmanız gerekmez. Sizden ya da çocuğunuzdan ad, e-posta, telefon ya da kimlik numarası istemiyoruz.</li>
          <li>Sitemizin veritabanı yok. Cevaplar yalnızca raporu hazırlamak için kullanılır ve hiçbir yere kaydedilmez.</li>
          <li>Raporun tek kopyası size verilen PDF’tir. Kiminle paylaşacağınıza siz karar verirsiniz.</li>
          <li>Sitemizin sunucusu Almanya’dadır (Avrupa Birliği). Çerez kullanmıyoruz; reklam, izleme ya da analiz aracı da yok.</li>
        </ul>
        <p>
          Ayrıntılar: <Link href="/yasal/aydinlatma-metni">KVKK aydınlatma metni</Link>
        </p>
      </Section>
    </>
  );
}
