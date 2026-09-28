import Link from 'next/link';
import { PageHeader, Section } from '@/components/site/page-header';
import { pageMeta } from '@/lib/seo';

export const metadata = pageMeta({
  title: 'Okullar ve rehberlik servisleri için',
  description:
    'Rehberlik servisleri için çevrim içi ölçme platformu: sınıf yönetimi, e-postayla veli onayı, rehber öğretmene bireysel rapor, öğretmenlere yalnızca grup özeti. Veriler Türkiye’de.',
  path: '/okullar-icin',
    ownImage: true,
});

const FEATURES = [
  {
    t: 'Sınıf ve öğrenci yönetimi',
    d: 'Sınıfları ve öğrenci listelerini bir tabloyla aktarın. Öğrenciler e-posta adresi olmadan, kendilerine özel kısa bir kodla giriş yapar.',
  },
  {
    t: 'Çevrim içi veli onayı',
    d: 'Velilere e-postayla bağlantı gönderilir. Aydınlatma metni ve açık rıza ayrı ayrı sunulur; onay vermeyen velinin çocuğu test çözemez. Bütün onaylar tarih ve sürümüyle kayıt altındadır.',
  },
  {
    t: 'Rehber öğretmene bireysel rapor',
    d: 'Bireysel sonuçları yalnızca okulun rehber öğretmeni (psikolojik danışman) görür. Her rapor görüntülemesi denetim kaydına yazılır.',
  },
  {
    t: 'Öğretmenlere yalnızca grup özeti',
    d: 'Sınıf öğretmenleri ve okul yönetimi bireysel sonuç göremez; yalnızca en az beş öğrencilik grupların özetlerini görür.',
  },
  {
    t: 'Toplu atama ve takip',
    d: 'Testleri sınıflara atayın, kimin tamamladığını izleyin. Uygun sınıf düzeyi dışındaki testler atanamaz.',
  },
  {
    t: 'Veriler Türkiye’de',
    d: 'Sunucular Türkiye’dedir. Öğrenci verileri reklam, pazarlama ya da yapay zekâ eğitimi için kullanılmaz.',
  },
];

export default function SchoolsPage() {
  return (
    <>
      <PageHeader
        title="Okullar ve rehberlik servisleri için"
        lede="Rehber öğretmenlerin bireyi tanıma çalışmalarını destekleyen, veli onayını çevrim içi toplayan ve sonuçları doğru kişiye doğru ayrıntıda gösteren bir ölçme platformu."
      >
        <div className="flex flex-wrap gap-3">
          <Link href="/iletisim?konu=school" className="btn btn-primary btn-lg">
            Okul başvurusu yapın
          </Link>
          <Link href="/bilimsel-yaklasim" className="btn btn-secondary btn-lg">
            Bilimsel yaklaşımımız
          </Link>
        </div>
      </PageHeader>

      <Section id="ozellikler" title="Rehberlik servisi için neler var?">
        <dl className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
          {FEATURES.map((f) => (
            <div key={f.t} className="flex flex-col gap-2 border-t-2 border-ink pt-4">
              <dt className="font-display text-lg font-bold">{f.t}</dt>
              <dd className="text-ink-2">{f.d}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section id="roller" title="Kim neyi görür?" className="border-t border-rule">
        <div className="overflow-x-auto rounded-xl border border-rule bg-surface">
          <table className="w-full min-w-[36rem] border-collapse text-left">
            <thead>
              <tr className="border-b border-rule-strong text-[0.875rem] text-ink-3">
                <th scope="col" className="px-5 py-3 font-bold">Rol</th>
                <th scope="col" className="px-5 py-3 font-bold">Bireysel rapor</th>
                <th scope="col" className="px-5 py-3 font-bold">Grup özeti</th>
                <th scope="col" className="px-5 py-3 font-bold">Hesap yönetimi</th>
              </tr>
            </thead>
            <tbody className="text-[0.975rem]">
              {[
                ['Rehber öğretmen', 'Evet', 'Evet', 'Hayır'],
                ['Sınıf öğretmeni', 'Hayır', 'En az 5 öğrencilik gruplar', 'Hayır'],
                ['Okul yöneticisi', 'Hayır', 'Katılım istatistikleri', 'Evet'],
                ['Veli', 'Yalnızca kendi çocuğu', 'Hayır', 'Hayır'],
                ['Öğrenci', 'Kendi öğrenci raporu', 'Hayır', 'Hayır'],
              ].map((r) => (
                <tr key={r[0]} className="border-b border-rule last:border-0">
                  <th scope="row" className="px-5 py-3 font-bold">
                    {r[0]}
                  </th>
                  <td className="px-5 py-3">{r[1]}</td>
                  <td className="px-5 py-3">{r[2]}</td>
                  <td className="px-5 py-3">{r[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="measure text-ink-2">
          Bu rol dağılımı, Millî Eğitim Bakanlığı Rehberlik ve Psikolojik Danışma Hizmetleri Yönetmeliği’nin bireyi tanıma çalışmalarını
          psikolojik danışmanlara bıraken yaklaşımına göre kurgulanmıştır. Ölçekhane, MEB’in e-Rehberlik sistemindeki resmî envanterlerin
          yerine geçmez; onları tamamlar.
        </p>
      </Section>

      <Section id="surec" title="Nasıl başlarsınız?" className="border-t border-rule">
        <ol className="flex flex-col gap-6">
          {[
            ['Başvuru', 'İletişim formundan okulunuzun adını ve rehberlik servisinden bir yetkilinin bilgilerini gönderin.'],
            ['Tanışma görüşmesi', 'Hangi sınıf düzeylerinde hangi testlerin uygun olduğunu birlikte planlarız.'],
            ['Pilot sınıf', 'Önce bir ya da iki sınıfla başlar, veli onayı ve uygulama sürecini birlikte denetleriz.'],
            ['Okul geneli', 'Süreç oturduktan sonra diğer sınıflara yayarız.'],
          ].map(([t, d], i) => (
            <li key={t} className="grid grid-cols-[2.75rem_1fr] gap-5">
              <span className="flex h-11 w-11 items-center justify-center rounded-full border-[1.5px] border-ink font-display text-xl font-bold" aria-hidden="true">
                {i + 1}
              </span>
              <div>
                <h3 className="t-h3">{t}</h3>
                <p className="measure mt-1 text-ink-2">{d}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="measure">Fiyatlandırma okulun öğrenci sayısına göre belirlenir. Ayrıntılar için başvurun.</p>
        <div>
          <Link href="/iletisim?konu=school" className="btn btn-primary">
            Okul başvurusu yapın
          </Link>
        </div>
      </Section>
    </>
  );
}
