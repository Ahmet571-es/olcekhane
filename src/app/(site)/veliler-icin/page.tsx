import Link from 'next/link';
import { PageHeader, Section } from '@/components/site/page-header';
import { pageMeta } from '@/lib/seo';

export const metadata = pageMeta({
  title: 'Veliler için: çocuğunuzu bilimsel testlerle tanıyın',
  description:
    'Ölçekhane veliler için nasıl çalışır? Ücretsiz hesap, çocuk profili, açık rıza, test ve iki ayrı rapor. Raporu çocuğunuzla nasıl konuşacağınız ve ne zaman bir uzmana başvurmanız gerektiği.',
  path: '/veliler-icin',
    ownImage: true,
});

const STEPS = [
  {
    t: 'Ücretsiz hesap açın',
    d: 'Adınız, e-posta adresiniz ve bir şifre yeterli. E-posta adresinizi doğruladıktan sonra testleri başlatabilirsiniz.',
  },
  {
    t: 'Çocuğunuzun profilini oluşturun',
    d: 'Adını ve sınıfını girin. Test verilerinin işlenmesi için açık rızanızı ayrı bir metinle istiyoruz; rızanızı istediğiniz zaman geri alabilirsiniz.',
  },
  {
    t: 'Testi birlikte başlatın',
    d: 'Testi siz başlatın, cihazı çocuğunuza verin. Çocuğunuz önce kendi yaşına göre yazılmış kısa bir bilgilendirmeyi okur. Sessiz bir ortam ve acele etmemek en doğru sonucu verir.',
  },
  {
    t: 'Raporu birlikte okuyun',
    d: 'Test biter bitmez iki rapor hazırlanır: biri size, biri çocuğunuza. Önce onun raporunu birlikte okumanızı öneririz.',
  },
];

const TALK = [
  'Güçlü yanlardan başlayın. Her raporda çocuğunuzun iyi yaptığı ya da doğal olarak kolay gelen şeyler yazıyor.',
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
        <div className="flex flex-wrap gap-3">
          <Link href="/kayit" className="btn btn-primary btn-lg">
            Ücretsiz veli hesabı aç
          </Link>
          <Link href="/testler" className="btn btn-secondary btn-lg">
            Testleri incele
          </Link>
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
          Aynı testi aradan zaman geçtikten sonra yeniden çözebilirsiniz. Her uygulama tarihiyle birlikte profilde saklanır; böylece
          çocuğunuzun zaman içinde nasıl değiştiğini görebilirsiniz. Kişilik ölçümlerinde anlamlı bir değişim görmek için genellikle en az
          6–12 ay beklemek gerekir; okuma gibi becerilerde ise bir dönem sonra yapılan tekrar fikir verir.
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
          <li>Çocuğunuzun e-posta adresini ya da kimlik numarasını istemiyoruz.</li>
          <li>Sonuçları veli hesabında yalnızca siz görürsünüz.</li>
          <li>Veriler Türkiye’deki sunucularda tutulur; reklam, pazarlama ya da yapay zekâ eğitimi için kullanılmaz.</li>
          <li>Açık rızanızı geri alabilir, profili ve bütün sonuçları silebilirsiniz.</li>
        </ul>
        <p>
          Ayrıntılar: <Link href="/yasal/aydinlatma-metni">KVKK aydınlatma metni</Link>
        </p>
      </Section>
    </>
  );
}
