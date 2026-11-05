import type { BandText, InsightRule, ReportTemplate } from './types';

/**
 * Sınav Kaygısı ve Baş Etme: rapor metinleri.
 *
 * Dayanaklar (araştırma cümlelerinin her biri bunlardan birine dayanır; künyeler bilim kartında):
 *  - Hembree (1988) ve von der Embse ve ark. (2018), aktaran Schillinger ve ark. (2021): sınav sonuçlarıyla kaygının düşünce
 *    yanı, bedensel yanından daha çok ilişkili.
 *  - Schillinger ve ark. (2021; 730 üniversite öğrencisi): sonuçlarla en tutarlı ilişkili yanlar sınav sırasında dikkati
 *    dağıtan düşünceler (takılma) ve kendine güvensizlik; endişenin ve bedensel heyecanın ayrıca bir ilişkisi yok.
 *  - Stöber (2004; 162 öğrenci): endişe hazırlıkla (göreve yönelme) birlikte, takılma kaçınmayla ve daha az hazırlıkla birlikte
 *    görülüyor.
 *  - Jamieson ve ark. (2010): sınav öncesi bedensel heyecanın performansa zarar vermediği, yardım edebileceği söylenen
 *    katılımcılar sınavın matematik bölümünde daha yüksek puan aldı (rehberdeki "Sınav kaygısı" yazısı da anlatır).
 *  - Ergene (2003) ve Huntley ve ark. (2019): sınav kaygısını azaltmaya yönelik çalışmalar etkili.
 * İlkeler: kaygı bir kusur gibi, düşük kaygı bir başarı notu gibi anlatılmaz; "biraz heyecan olağandır" denir, kaygının
 * sorun olduğu söylenmez. Sonuç öz bildirime dayandığı için öğrenciye "... söylüyorsun", veliye "Çocuğunuz ... belirtiyor"
 * dili kullanılır. Kartlar sonucu anlatır, öneri vermez (öneriler yol haritasındadır; zihniyet testindeki 2026-10-22
 * ilkesi). Bir araştırma bulgusu bir raporda bir kez anılır. Kaygının üç yanından biri yüksekse destek kutusu açılır
 * (`support`). Metinler okula özgü sözcük taşımaz (yalnızca "sınav": testin konusudur); yetişkine öğrenci metinleri
 * gösterilir.
 *
 * Birlikte yorum ("Birlikte bakınca"): giriş her raporda aynıdır (biraz heyecan olağandır; düşünce yanı sonuçlarla daha çok
 * ilişkilidir). Ardından kaygının üç yanına göre tam bir kural: takılma yüksekse o; değilse endişe yüksekse o; değilse
 * beden yüksekse o (endişede hazırlık düşükken araştırma cümlesi yok: hazırlık kartıyla çelişmesin); hiçbiri yüksek değilse
 * üçü de düşükken bir, öteki durumlarda bir kural. Kaygının bir yanı yüksekse baş
 * etme yolları düşük ya da yüksekken bir kural daha; takılma yüksek ve hazırlık düşükken bir kural daha
 * (tests/sinav-kaygisi.test.ts bütün 243 birleşimde denetler).
 */
const t = (summary: string, student: string, parent: string, support = false): BandText => ({
  summary,
  student,
  parent,
  tipsStudent: [],
  tipsParent: [],
  ...(support ? { support: true } : {}),
});

const rule = (when: InsightRule['when'], student: string, parent: string, not?: InsightRule['not']): InsightRule => ({
  when,
  ...(not ? { not } : {}),
  text: { student, parent },
});

const NOT_HIGH = ['low', 'average'] as const;
/** Kaygının üç yanından hiçbiri yüksek değil (`not` ile: en az biri yüksek). */
const NONE_HIGH = { worry: [...NOT_HIGH], body: [...NOT_HIGH], block: [...NOT_HIGH] };
const ALL_LOW = { worry: ['low' as const], body: ['low' as const], block: ['low' as const] };

const OVERVIEW =
  'Her satır bir alan. İlk üç satır sınav kaygısının yanlarıdır: puan 5’e yaklaştıkça o yan daha sık yaşanıyor. Son iki satır kaygıyla baş etmenin yollarıdır: puan 5’e yaklaştıkça bu yollar daha sık kullanılıyor. Değerler 1 (hiçbir zaman) ile 5 (her zaman) arasındadır; bu bir başarı puanı değildir.';

const LEAD =
  'Önemli bir sınavdan önce biraz heyecanlanmak olağandır. Bu raporda önemli olan, kaygının hazırlanmayı ya da sınav anını ne kadar zorlaştırdığıdır. Araştırmalarda sınav sonuçlarıyla kaygının düşünce yanı (endişeli düşünceler ve takılma), bedendeki heyecandan daha çok ilişkili bulunmuştur.';
const LEAD_PARENT =
  'Önemli bir sınavdan önce biraz heyecanlanmak olağandır. Bu raporda önemli olan, kaygının çocuğunuzun hazırlanmasını ya da sınav anını ne kadar zorlaştırdığıdır. Araştırmalarda sınav sonuçlarıyla kaygının düşünce yanı (endişeli düşünceler ve takılma), bedendeki heyecandan daha çok ilişkili bulunmuştur.';

const WORRY_ONLY =
  'Endişeli düşüncelerin sık, ama sınav sırasında takılma puanın yüksek değil: endişe her zaman sınav anını zorlaştırmaz.';
const WORRY_ONLY_PARENT =
  'Çocuğunuzun endişeli düşünceleri sık, ama sınav sırasında takılma puanı yüksek değil: endişe her zaman sınav anını zorlaştırmaz.';

export const sinavKaygisiReport: ReportTemplate = {
  version: 'sinav-kaygisi-rapor-1',
  bandLabels: { low: 'Düşük', average: 'Orta', high: 'Yüksek' },
  overview: { student: OVERVIEW, parent: OVERVIEW },
  insight: {
    title: { you: 'Birlikte bakınca', parent: 'Birlikte bakınca' },
    pageNote:
      'Alanların birlikte yorumu: kaygının hangi yanının öne çıktığı, araştırmaların bu yan hakkında ne bulduğu ve kaygıyla baş etme yollarının buna nasıl eşlik ettiği',
    lead: [{ when: {}, text: { student: LEAD, parent: LEAD_PARENT } }],
    rules: [
      // Kaygının yanlarından tam biri (takılma; endişe, hazırlık düşük değilken ya da düşükken; beden; hiçbiri yüksek değilse
      // üçü düşük ya da öteki durumlar).
      rule(
        { block: ['high'] },
        'Sınav sırasında takılma puanın yüksek. Bir araştırmada kaygının yanları içinde sınav sonuçlarıyla en tutarlı ilişkili olan, sınav sırasında dikkati dağıtan düşüncelerdi; bu alan onlara yakındır. Bu yüzden sınav anında kullanılacak küçük yollar işine yarayabilir.',
        'Çocuğunuzun sınav sırasında takılma puanı yüksek. Bir araştırmada kaygının yanları içinde sınav sonuçlarıyla en tutarlı ilişkili olan, sınav sırasında dikkati dağıtan düşüncelerdi; bu alan onlara yakındır. Bu yüzden sınav anında kullanılacak küçük yollar onun işine yarayabilir.',
      ),
      rule(
        { worry: ['high'], block: [...NOT_HIGH], prep: ['average', 'high'] },
        `${WORRY_ONLY} Bir araştırmada endişesi yüksek olanların hazırlanmaya daha çok yöneldiği görülmüştür.`,
        `${WORRY_ONLY_PARENT} Bir araştırmada endişesi yüksek olanların hazırlanmaya daha çok yöneldiği görülmüştür.`,
      ),
      rule({ worry: ['high'], block: [...NOT_HIGH], prep: ['low'] }, WORRY_ONLY, WORRY_ONLY_PARENT),
      rule(
        { body: ['high'], worry: [...NOT_HIGH], block: [...NOT_HIGH] },
        'Bedensel tepkilerin sık; endişeli düşüncelerin ve takılma puanın ise yüksek değil: kaygı daha çok bedeninde hissediliyor. Bir deneyde, sınav öncesindeki heyecanın zarar vermediği, yardım edebileceği söylenen katılımcılar sınavın matematik bölümünde daha yüksek puan almıştır.',
        'Çocuğunuzun bedensel tepkileri sık; endişeli düşünceleri ve takılma puanı ise yüksek değil: kaygı daha çok bedeninde hissediliyor. Bir deneyde, sınav öncesindeki heyecanın zarar vermediği, yardım edebileceği söylenen katılımcılar sınavın matematik bölümünde daha yüksek puan almıştır.',
      ),
      rule(
        ALL_LOW,
        'Kaygının üç yanında da puanın düşük: sınavlardan önce ve sınav sırasında genellikle rahat olduğunu söylüyorsun.',
        'Çocuğunuzun puanı kaygının üç yanında da düşük: sınavlardan önce ve sınav sırasında genellikle rahat olduğunu belirtiyor.',
      ),
      rule(
        NONE_HIGH,
        'Kaygının hiçbir yanında puanın yüksek değil: sınavlar seni zaman zaman gerse de hazırlanmanı ya da sınav anını belirgin biçimde zorlaştırmıyor gibi görünüyor.',
        'Çocuğunuzun puanı kaygının hiçbir yanında yüksek değil: sınavlar onu zaman zaman gerse de hazırlanmasını ya da sınav anını belirgin biçimde zorlaştırmıyor gibi görünüyor.',
        ALL_LOW,
      ),
      // Takılma yüksek ve hazırlık düşükken.
      rule(
        { block: ['high'], prep: ['low'] },
        'Hazırlık puanın düşük. Başka bir araştırmada sınav sırasında takılma, daha az hazırlanmaya yönelmekle ve sınavı düşünmekten kaçınmakla birlikte görülmüştür.',
        'Çocuğunuzun hazırlık puanı düşük. Başka bir araştırmada sınav sırasında takılma, daha az hazırlanmaya yönelmekle ve sınavı düşünmekten kaçınmakla birlikte görülmüştür.',
      ),
      // Kaygının en az bir yanı yüksekken baş etme yolları.
      rule(
        { calm: ['low'] },
        'Kaygının bir yanı yüksek; baş etme yollarını ise az kullandığını söylüyorsun. Bu yollar öğrenilebilir: araştırmalarda baş etmeyi öğreten programların kaygıyı azalttığı görülmüştür. Sayfanın sonundaki öneriler küçük bir başlangıç olabilir.',
        'Kaygının bir yanı yüksek; çocuğunuz baş etme yollarını ise az kullandığını belirtiyor. Bu yollar öğrenilebilir: araştırmalarda baş etmeyi öğreten programların kaygıyı azalttığı görülmüştür. Sayfanın sonundaki öneriler ona nasıl eşlik edebileceğinizi anlatıyor.',
        NONE_HIGH,
      ),
      rule(
        { calm: ['high'] },
        'Baş etme yollarını sık kullandığını da söylüyorsun. Bu yollar kaygıyı her zaman yeterince hafifletmeyebilir; o zaman sonuçların altındaki destek notu işine yarayabilir.',
        'Çocuğunuz baş etme yollarını sık kullandığını da belirtiyor. Bu yollar kaygıyı her zaman yeterince hafifletmeyebilir; o zaman sonuçların altındaki destek notu işinize yarayabilir.',
        NONE_HIGH,
      ),
    ],
  },
  scales: {
    worry: {
      high: t(
        'Sınav öncesi sık endişe',
        'Bir sınav yaklaşınca sonucun kötü olacağını, çalıştıklarının yetmeyeceğini ya da başkalarının sana bakışının değişeceğini sık sık düşündüğünü söylüyorsun. Bu düşünceler sınava önem verdiğini gösterebilir; çok sık geldiklerinde ise çalışırken insanı yorabilir.',
        'Çocuğunuz bir sınav yaklaşınca sonucun kötü olacağını, çalıştıklarının yetmeyeceğini ya da başkalarının ona bakışının değişeceğini sık sık düşündüğünü belirtiyor. Bu düşünceler sınava önem verdiğini gösterebilir; çok sık geldiklerinde ise çalışırken insanı yorabilir.',
        true,
      ),
      average: t(
        'Ara sıra endişe',
        'Bazı sınavlardan önce sonucu ve ne kadar hazır olduğunu dert ettiğini, bazılarında ise bunu pek düşünmediğini söylüyorsun. Sınavın ne kadar önemli olduğu bu farkı etkileyebilir.',
        'Çocuğunuz bazı sınavlardan önce sonucu ve ne kadar hazır olduğunu dert ettiğini, bazılarında ise bunu pek düşünmediğini belirtiyor. Sınavın ne kadar önemli olduğu bu farkı etkileyebilir.',
      ),
      low: t(
        'Sınav öncesi az endişe',
        'Sınavlardan önce sonucu, hazırlığını ya da başkalarının ne düşüneceğini pek kafana takmadığını söylüyorsun. Sınavı düşünmek seni genellikle yormuyor.',
        'Çocuğunuz sınavlardan önce sonucu, hazırlığını ya da başkalarının ne düşüneceğini pek kafasına takmadığını belirtiyor. Sınavı düşünmek onu genellikle yormuyor.',
      ),
    },
    body: {
      high: t(
        'Bedende sık heyecan',
        'Sınavlardan önce ve sınav sırasında heyecanı bedeninde sık sık hissettiğini söylüyorsun: midende, kalbinde, ellerinde ya da sınavdan önceki gece uykunda. Beden önemli bir duruma böyle hazırlanır; tepkiler sık ve güçlü olunca ise yorucu olabilir.',
        'Çocuğunuz sınavlardan önce ve sınav sırasında heyecanı bedeninde sık sık hissettiğini belirtiyor: midesinde, kalbinde, ellerinde ya da sınavdan önceki gece uykusunda. Beden önemli bir duruma böyle hazırlanır; tepkiler sık ve güçlü olunca ise yorucu olabilir.',
        true,
      ),
      average: t(
        'Ara sıra bedensel heyecan',
        'Bazı sınavlarda heyecanı midende, kalbinde ya da ellerinde hissettiğini, bazılarında ise bedeninin rahat olduğunu söylüyorsun.',
        'Çocuğunuz bazı sınavlarda heyecanı midesinde, kalbinde ya da ellerinde hissettiğini, bazılarında ise bedeninin rahat olduğunu belirtiyor.',
      ),
      low: t(
        'Beden genellikle rahat',
        'Sınavlardan önce ve sınav sırasında bedeninin genellikle rahat olduğunu, heyecanı bedeninde pek hissetmediğini söylüyorsun.',
        'Çocuğunuz sınavlardan önce ve sınav sırasında bedeninin genellikle rahat olduğunu, heyecanı bedeninde pek hissetmediğini belirtiyor.',
      ),
    },
    block: {
      high: t(
        'Sınavda sık takılma',
        'Sınav sırasında sık sık takıldığını söylüyorsun: bildiğin bir şey o an aklına gelmeyebiliyor, aklın kaygılarına kayabiliyor ya da bir soruda takılınca sonrakilere odaklanmak zorlaşabiliyor. Bu, bildiğin bir konuyu sınavda gösterememek gibi hissettirebilir.',
        'Çocuğunuz sınav sırasında sık sık takıldığını belirtiyor: bildiği bir şey o an aklına gelmeyebiliyor, aklı kaygılarına kayabiliyor ya da bir soruda takılınca sonrakilere odaklanmak zorlaşabiliyor. Bu, bildiği bir konuyu sınavda gösterememek gibi hissettirebilir.',
        true,
      ),
      average: t(
        'Bazen takılma',
        'Bazı sınavlarda bir soruda takılıp toparlanmakta zorlandığını ya da bildiğin bir şeyi o an hatırlayamadığını, bazılarında ise dikkatini sorulara verebildiğini söylüyorsun.',
        'Çocuğunuz bazı sınavlarda bir soruda takılıp toparlanmakta zorlandığını ya da bildiği bir şeyi o an hatırlayamadığını, bazılarında ise dikkatini sorulara verebildiğini belirtiyor.',
      ),
      low: t(
        'Dikkat sorularda',
        'Sınav sırasında dikkatini genellikle sorulara verebildiğini, bir soruda takılsan da kafanın pek karışmadığını söylüyorsun.',
        'Çocuğunuz sınav sırasında dikkatini genellikle sorulara verebildiğini, bir soruda takılsa da kafasının pek karışmadığını belirtiyor.',
      ),
    },
    prep: {
      high: t(
        'Önceden ve planlı hazırlık',
        'Sınava çalışmaya genellikle erkenden başladığını, çalışmayı günlere yaydığını ve kendini soru çözerek ya da bakmadan anlatarak sınadığını söylüyorsun. Bu alışkanlıklar sınavdan önce daha hazır hissetmeni kolaylaştırabilir.',
        'Çocuğunuz sınava çalışmaya genellikle erkenden başladığını, çalışmayı günlere yaydığını ve kendini soru çözerek ya da bakmadan anlatarak sınadığını belirtiyor. Bu alışkanlıklar sınavdan önce daha hazır hissetmesini kolaylaştırabilir.',
      ),
      average: t(
        'Sınava göre değişen hazırlık',
        'Bazı sınavlara önceden ve planlı hazırlandığını, bazılarında ise çalışmayı son güne bıraktığını söylüyorsun. Sınavın konusu ve o dönemdeki yoğunluğun bu farkı etkileyebilir.',
        'Çocuğunuz bazı sınavlara önceden ve planlı hazırlandığını, bazılarında ise çalışmayı son güne bıraktığını belirtiyor. Sınavın konusu ve o dönemdeki yoğunluğu bu farkı etkileyebilir.',
      ),
      low: t(
        'Hazırlık son ana kalıyor',
        'Sınavlara çalışmayı çoğu zaman son geceye bıraktığını ya da başka şeylerle oyalanıp başlamayı geciktirdiğini söylüyorsun. Bu senin hakkında bir yargı değil; hazırlık alışkanlıkları küçük adımlarla değişebilir.',
        'Çocuğunuz sınavlara çalışmayı çoğu zaman son geceye bıraktığını ya da başka şeylerle oyalanıp başlamayı geciktirdiğini belirtiyor. Bu onun hakkında bir yargı değil; hazırlık alışkanlıkları küçük adımlarla değişebilir.',
      ),
    },
    calm: {
      high: t(
        'Baş etme yolları sık',
        'Yavaş nefesle toparlanmak, sınavla ilgili duygularını güvendiğin biriyle konuşmak, takıldığın soruyu geçip sonra dönmek gibi yolları sık kullandığını söylüyorsun.',
        'Çocuğunuz yavaş nefesle toparlanmak, sınavla ilgili duygularını güvendiği biriyle konuşmak, takıldığı soruyu geçip sonra dönmek gibi yolları sık kullandığını belirtiyor.',
      ),
      average: t(
        'Ara sıra baş etme yolu',
        'Bu yolları bazen kullandığını, bazen kullanmadığını söylüyorsun; hangisine ne zaman başvurduğun sınava göre değişebilir.',
        'Çocuğunuz bu yolları bazen kullandığını, bazen kullanmadığını belirtiyor; hangisine ne zaman başvurduğu sınava göre değişebilir.',
      ),
      low: t(
        'Baş etme yolları az',
        'Yavaş nefesle toparlanmak, duygularını biriyle paylaşmak ya da takıldığın soruyu geçmek gibi yolları az kullandığını söylüyorsun. Sınavlarda pek gerilmiyorsan bu yollara daha az ihtiyaç duyuyor olabilirsin; gerektiğinde bu yollar öğrenilebilir.',
        'Çocuğunuz yavaş nefesle toparlanmak, duygularını biriyle paylaşmak ya da takıldığı soruyu geçmek gibi yolları az kullandığını belirtiyor. Sınavlarda pek gerilmiyorsa bu yollara daha az ihtiyaç duyuyor olabilir; gerektiğinde bu yollar öğrenilebilir.',
      ),
    },
  },
};
