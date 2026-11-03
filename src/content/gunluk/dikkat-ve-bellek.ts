import type { SkillsDaily } from './types';

/**
 * Dikkat ve Çalışma Belleği Görevleri: günlük hayatta nerede kullanılır (4. sınıftan mezuna; yetişkinlere açık değil).
 * Rapor beş görevi beş ayrı kartla anlatır; burada da her görevin kendi kartı vardır ve her kart yalnızca o görevin ölçtüğü
 * beceriyi anlatır (görevlerin `measures` metinleri ve raporun kartları, src/lib/reports/build.ts):
 *  - Sayı dizisi: kısa süreli bellek (gösterilen ya da duyulan kısa bir bilgiyi aynı sırayla akılda tutmak). Görevde rakamlar
 *    ekranda gösterilir: arkadaş ve ev örnekleri görülen rakamlardır; okuldaki örnek raporun kendi örneğidir ("öğretmenin
 *    söylediği sayfa numarasını açana kadar aklında tutmak"; tahtaya yazılan numara akılda tutulmayı istemezdi). Tek bir
 *    sözcük (parola) sıra ve uzunluk istemediği için örnek değildir.
 *  - Tersten sayı dizisi: çalışma belleği (bilgiyi akılda tutarken sırasını tersine çevirmek): örneklerin üçü de bir sırayı
 *    tersine çevirmeyi ister.
 *  - Kutu dizisi: yerleri ve sıralarını akılda tutmak (sırayla gösterilen yerlere aynı sırayla dokunmak, ışıklar, kumandada
 *    gösterilen düğmeler). Raporun "harita" ve "tahtadaki çizimi deftere geçirmek" örnekleri kullanılmaz: haritada yön
 *    bulmayı Bakış Açısı Alma, hareketsiz bir görüntüyü akılda tutmayı Desen Hatırlama ölçer. Bir eşyayı ararken bakılan
 *    yerler sıra istemediği ve eşya kaybetmeyi çağrıştırdığı için örnek değildir.
 *  - Ok görevi: seçici dikkat (yanlardaki dikkat dağıtıcılara aldırmadan ortadaki hedefe bakmak: oyun tahtasında kendi taşı).
 *    Hareket eden bir topu izlemek görsel takiptir ve spora kayar: örnek değildir.
 *  - Sembol eşleştirme: işlem hızı (bir tabloya bakarak işaretleri karşılıklarına hızla çevirmek). Simge Bulma'nın örnekleri
 *    (karşılaştırmak, farkı bulmak, listede ad aramak) burada kullanılmaz.
 * Kısa süreli bellek kartında alışveriş listesi (Kelime Listesi Hatırlama), hiçbir kartta zihinden hesap (Zihinden Hesaplama
 * Hızı) yoktur. 4. sınıfa açık olduğu için telefon ve mesaj varsayılmaz. Örnekler tanımlayıcıdır; sonucun bu işlerde ne
 * olacağını söylemez.
 */
export const dikkatBellekDaily: SkillsDaily = {
  kind: 'skills',
  version: 'dikkat-ve-bellek-gunluk-1',
  skills: [
    {
      key: 'sayi-ileri',
      title: 'Sayı dizisi: kısa süreli bellek',
      short: 'Kısa süreli bellek',
      text: 'Bu beceri, görülen ya da duyulan kısa bir bilgiyi kullanılana kadar sırasıyla akılda tutmayı gerektiren işlerde kullanılır.',
      branches: {
        school: 'Sayfa numarasını tutmak',
        friends: 'Rakamları tekrarlamak',
        home: 'Numarayı akılda tutmak',
      },
      student: {
        school: 'Öğretmenin söylediği sayfa numarasını kitabı açana kadar aklında tutmak bu beceriyi kullanır.',
        friends: 'Bir oyunda bir kez gösterilen birkaç rakamı aynı sırayla tekrarlamak bu beceriyi kullanır.',
        home: 'Bir kâğıtta gördüğün kısa bir numarayı başka bir yere yazana kadar aklında tutmak bu beceriyi kullanır.',
      },
      parent: {
        school: 'Çocuğunuzun söylenen sayfa numarasını kitabı açana kadar aklında tutması bu beceriyi kullanır.',
        friends: 'Bir oyunda bir kez gösterilen birkaç rakamı aynı sırayla tekrarlamak bu beceriyi kullanır.',
        home: 'Bir kâğıtta görülen kısa bir numarayı başka bir yere yazana kadar akılda tutmak bu beceriyi kullanır.',
      },
    },
    {
      key: 'sayi-geri',
      title: 'Tersten sayı dizisi: çalışma belleği',
      short: 'Çalışma belleği',
      text: 'Bu beceri, bir bilgiyi akılda tutarken onun üzerinde değişiklik yapmayı, örneğin sırasını tersine çevirmeyi gerektiren işlerde kullanılır.',
      branches: {
        school: 'Rakamları ters çevirmek',
        friends: 'Tersten söyleme oyunu',
        home: 'Ayları tersten saymak',
      },
      student: {
        school: 'Bir sayının rakamlarını aklında ters çevirip oluşan sayıyı söylemek bu beceriyi kullanır.',
        friends: 'Bir kelimeyi harf harf tersten söyleme oyunu da bu beceriyi kullanır.',
        home: 'Haftanın günlerini ya da ayları sondan başa saymak bu tür bir iştir.',
      },
      parent: {
        school: 'Çocuğunuzun bir sayının rakamlarını ters çevirip oluşan sayıyı söylemesi bu beceriyi kullanır.',
        friends: 'Bir kelimeyi harf harf tersten söyleme oyunu da bu beceriyi kullanır.',
        home: 'Haftanın günlerini ya da ayları sondan başa saymak bu tür bir iştir.',
      },
    },
    {
      key: 'kutu',
      title: 'Kutu dizisi: yerleri sırasıyla tutma',
      short: 'Yer ve sıra',
      text: 'Bu beceri, birbiri ardından gösterilen yerleri ve sıralarını kısa bir süre akılda tutmayı gerektiren işlerde kullanılır.',
      branches: {
        school: 'Gösterilen yerleri izlemek',
        friends: 'Sırayı tekrarlama oyunu',
        home: 'Düğme sırasını tekrarlamak',
      },
      student: {
        school: 'Öğretmenin tahtada sırayla gösterdiği yerleri aynı sırayla hatırlamak bu beceriyi kullanır.',
        friends: 'Sırayla yanan ışıkları aynı sırayla tekrarlama oyunları da bu beceriyi kullanır.',
        home: 'Birinin kumandada bir kez gösterdiği düğmelere aynı sırayla basmak bu tür bir iştir.',
      },
      parent: {
        school: 'Çocuğunuzun, öğretmenin tahtada sırayla gösterdiği yerleri aynı sırayla hatırlaması bu beceriyi kullanır.',
        friends: 'Sırayla yanan ışıkları aynı sırayla tekrarlama oyunları da bu beceriyi kullanır.',
        home: 'Birinin kumandada bir kez gösterdiği düğmelere aynı sırayla basmak bu tür bir iştir.',
      },
    },
    {
      key: 'ok',
      title: 'Ok görevi: seçici dikkat',
      short: 'Seçici dikkat',
      text: 'Bu beceri, çevredeki dikkat dağıtan şeylere aldırmadan önemli olana odaklanmayı gerektiren işlerde kullanılır.',
      branches: {
        school: 'İstenen soruya bakmak',
        friends: 'Kendi taşına bakmak',
        home: 'Kendi işine odaklanmak',
      },
      student: {
        school: 'Kalabalık bir sayfada yanındaki sorulara takılmadan istenen soruya bakmak bu beceriyi kullanır.',
        friends: 'Kalabalık bir oyun tahtasında yanındaki taşlara takılmadan kendi taşına bakmak bu beceriyi kullanır.',
        home: 'Yanında biri başka bir işle uğraşırken kendi işine odaklanmak bu beceriyi kullanır.',
      },
      parent: {
        school: 'Çocuğunuzun kalabalık bir sayfada yanındaki sorulara takılmadan istenen soruya bakması bu beceriyi kullanır.',
        friends: 'Kalabalık bir oyun tahtasında yanındaki taşlara takılmadan kendi taşına bakmak bu beceriyi kullanır.',
        home: 'Yanında biri başka bir işle uğraşırken kendi işine odaklanmak bu beceriyi kullanır.',
      },
    },
    {
      key: 'sembol',
      title: 'Sembol eşleştirme: işlem hızı',
      short: 'İşlem hızı',
      text: 'Bu beceri, basit bir işi hem hızlı hem doğru yapmayı gerektiren durumlarda kullanılır. Bir tabloya bakarak işaretleri karşılıklarına çevirmek buna bir örnektir.',
      branches: {
        school: 'İşaretleri sayıya çevirmek',
        friends: 'Şifreli not oyunları',
        home: 'Sayılara göre boyama',
      },
      student: {
        school: 'Derste bir tabloya bakarak işaretleri sayılara çevirmek bu tür bir iştir.',
        friends: 'Şifreli not oyunlarında işaretlerin karşılığı olan harfleri çabucak bulmak bu beceriyi kullanır.',
        home: 'Sayılara göre boyamada her sayının rengini tabloya bakarak çabucak bulmak bu tür bir iştir.',
      },
      parent: {
        school: 'Çocuğunuzun derste bir tabloya bakarak işaretleri sayılara çevirmesi bu tür bir iştir.',
        friends: 'Şifreli not oyunlarında işaretlerin karşılığı olan harfleri çabucak bulmak bu beceriyi kullanır.',
        home: 'Sayılara göre boyamada her sayının rengini tabloya bakarak çabucak bulmak bu tür bir iştir.',
      },
    },
  ],
};
