import type { SurveyDaily } from './types';

/**
 * Sınav Kaygısı ve Baş Etme: günlük hayatta nasıl görünür (5. sınıftan yetişkine). Ton: gelişim (bütün ölçekler;
 * lib/reports/daily-parts.ts, `GROWTH_SLUGS`). Kaygının üç yanında (endişe, beden, takılma) zor uç yüksek uçtur, baş
 * etmenin iki yanında (hazırlık, baş etme yolları) düşük uçtur. Rahat uca uydurma bir zorluk, zor uca uydurma bir güçlü yan
 * yazılmaz; düşük kaygı bir başarı, yüksek kaygı bir kusur gibi anlatılmaz. Hassas ölçekler yumuşak yazılır: bedensel
 * tepkilerde her satır tek bir tepkiyi anlatır (belirti listesi yok), klinik sözcük yok. Zor anı anlatan örneklerin bazılarının
 * yanında bir dayanak vardır (heyecanın yardım edebileceğini düşünmek, yatmadan önce sakin bir şey, kısa bir mola, güvenilen
 * biriyle konuşmak, biriyle birlikte başlamak); dayanaklar birbirini ve yol haritasının önerilerini yinelemez. Baş etme
 * yollarının düşük ucundaki satırlar kaygıyı varsaymaz ("Gerildiğinde …"): sınavlarda pek kaygılanmayan biri de bu düzeye
 * düşebilir.
 *
 * Ortamlar: okul satırları sınavın kendisinden söz eder (sınıfa özgü bir yer yok: sınava hazırlanan bir mezun için de
 * anlamlıdır); arkadaş satırları sınav öncesi ve sonrası arkadaşlarla konuşmayı ya da birlikte çalışmayı; ev satırları sınavdan
 * önceki akşamı, geceyi ve evde soru çözmeyi anlatır. Yetişkinin iş satırı işle ilgili bir sınavdan (ehliyet, sertifika ya da
 * işe giriş sınavı gibi) söz eder. Endişenin yüksek düzeyindeki ev satırı evdekilerden söz ettiği için yetişkinin kendi ev
 * satırı vardır (`adult.home`). Yetişkin metninde "sınav" sözcüğü okula özgü sayılmaz: testin konusudur
 * (tests/helpers/school.ts, `EXAM_TESTS`).
 *
 * Kartlar birbiriyle çelişmesin diye: endişe sınavdan önceki düşünceleri (W1–W5), beden bedende hissedilen heyecanı (B1–B5),
 * takılma sınav sırasında ve soru çözerken dikkati (T1–T5), hazırlık ne zaman ve nasıl çalışıldığını (P1–P5), baş etme
 * yolları gerilince ne yapıldığını (C1–C5) anlatır. Nefesle toparlanmak ve takılan soruyu geçip sonra dönmek yalnızca baş
 * etme yollarının satırlarında geçer. Bağımsız inceleme (2026-11-05) bulguları uygulandı: "büyük bir sınavın gecesi" yerine
 * "ertesi gün büyük bir sınav varken", "sınava başlamak" yerine "sınava çalışmaya başlamak", sohbet anıyla karışan "o an".
 */
export const sinavKaygisiDaily: SurveyDaily = {
  kind: 'survey',
  version: 'sinav-kaygisi-gunluk-1',
  scales: {
    /*
     * Endişeli düşünceler: W1 "Bir sınav yaklaşınca “Ya kötü geçerse?” diye düşünüp dururum", W2 "Sınav sonucumun
     * başkalarının bana bakışını değiştireceğinden endişelenirim", W3 "Sınava hazırlanırken çalıştıklarımın yetmeyeceğinden
     * endişelenirim", W4 "Bir sınavda başarısız olursam her şeyin kötüye gideceğini düşünürüm"; ters: W5 "Bir sınav
     * yaklaşırken sonuç konusunda içim rahattır".
     */
    worry: {
      poles: { low: 'Sınavı pek dert etmez', high: 'Sınavı sık dert eder' },
      bands: {
        low: {
          from: { school: ['W5'], friends: ['W2'], home: ['W1'], work: ['W5'] },
          student: {
            school: 'Sınav günü yaklaşırken sonucun ne olacağını pek dert etmeyebilirsin.',
            friends: 'Sonucunu arkadaşlarının nasıl karşılayacağını pek düşünmeyebilirsin.',
            home: 'Sınavdan önceki akşam kötü bir sonucu pek düşünmeyebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz sınav günü yaklaşırken sonucun ne olacağını pek dert etmeyebilir.',
            friends: 'Sonucunu arkadaşlarının nasıl karşılayacağını pek düşünmeyebilir.',
            home: 'Sınavdan önceki akşam kötü bir sonucu pek düşünmeyebilir.',
          },
          adult: {
            work: 'İş için girdiğin bir sınavın günü yaklaşırken sonucunu pek dert etmeyebilirsin.',
          },
        },
        average: {
          from: { school: ['W1', 'W5'], friends: ['W2'], home: ['W3'], work: ['W1'] },
          student: {
            school: 'Önemli bir sınavdan önce bazen sonucu düşünüp gerilebilir, küçük sınavlarda rahat kalabilirsin.',
            friends: 'Arkadaşlarınla sınavı konuşurken bazen sonucunu nasıl karşılayacaklarını düşünebilirsin.',
            home: 'Bazı akşamlar çalıştıklarının yetip yetmeyeceğini düşünebilir, bazı akşamlar bunu aklına getirmeyebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz önemli bir sınavdan önce bazen sonucu düşünüp gerilebilir, küçük sınavlarda rahat kalabilir.',
            friends: 'Arkadaşlarıyla sınavı konuşurken bazen sonucunu nasıl karşılayacaklarını düşünebilir.',
            home: 'Bazı akşamlar çalıştıklarının yetip yetmeyeceğini düşünebilir, bazı akşamlar bunu aklına getirmeyebilir.',
          },
          adult: {
            work: 'Ehliyet ya da sertifika gibi önemli bir sınavdan önce bazen sonucu düşünüp gerilebilirsin.',
          },
        },
        high: {
          from: { school: ['W1'], friends: ['W2'], home: ['W3'], work: ['W4'] },
          student: {
            school: 'Bir sınav yaklaşırken sık sık kötü bir sonucu düşünüp durabilirsin.',
            friends: 'Arkadaşlarının, sınav sonucunu duyunca ne düşüneceğini merak edip gerilebilirsin.',
            home: 'Çalıştığın hâlde akşam “Yine de yetmeyecek” diyebilirsin; bunu evdekilerden biriyle konuşmak iyi gelebilir.',
          },
          parent: {
            school: 'Çocuğunuz bir sınav yaklaşırken sık sık kötü bir sonucu düşünebilir.',
            friends: 'Arkadaşlarının, onun sınav sonucunu duyunca ne düşüneceğini merak edip gerilebilir.',
            home: 'Çalıştığı hâlde akşam “Yine de yetmeyecek” diyebilir; bunu güvendiği biriyle konuşmak ona iyi gelebilir.',
          },
          adult: {
            work: 'İşle ilgili bir sınavın sonucu kötü olursa her şeyin bozulacağını düşünebilirsin.',
            home: 'Çalıştığın hâlde akşam “Yine de yetmeyecek” diyebilirsin; bunu güvendiğin biriyle konuşmak iyi gelebilir.',
          },
        },
      },
    },
    /*
     * Bedensel tepkiler: B1 "Sınav yaklaşınca midemde bir sıkışma hissederim", B2 "Sınav kâğıdı önüme gelince kalbim küt küt
     * atar", B3 "Sınav sırasında ellerim terler ya da titrer"; ters: B4 "Önemli bir sınavdan önceki gece rahatça uyurum", B5
     * "Sınav sırasında kendimi bedenen rahat hissederim".
     */
    body: {
      poles: { low: 'Bedeni rahat kalır', high: 'Heyecanı bedeninde duyar' },
      bands: {
        low: {
          from: { school: ['B5'], friends: ['B1'], home: ['B4'], work: ['B3'] },
          student: {
            school: 'Sınav başlamadan önce bedeninde genellikle bir gerginlik hissetmeyebilirsin.',
            friends: 'Sınav sabahı arkadaşlarınla buluştuğunda miden genellikle rahat olabilir.',
            home: 'Ertesi gün büyük bir sınav varken genellikle rahatça uyuyabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz sınav başlamadan önce bedeninde genellikle bir gerginlik hissetmeyebilir.',
            friends: 'Sınav sabahı arkadaşlarıyla buluştuğunda midesi genellikle rahat olabilir.',
            home: 'Ertesi gün büyük bir sınav varken genellikle rahatça uyuyabilir.',
          },
          adult: {
            work: 'Bir iş sınavı başlayınca ellerinde genellikle bir titreme hissetmeyebilirsin.',
          },
        },
        average: {
          from: { school: ['B2', 'B5'], friends: ['B1'], home: ['B4'], work: ['B3'] },
          student: {
            school: 'Bazı sınavlarda başlarken kalbinin hızlandığını fark edebilir, bazılarında sakin kalabilirsin.',
            friends: 'Arkadaşlarınla sınava girmeden önce bazen midende hafif bir kıpırtı hissedebilirsin.',
            home: 'Ertesi gün büyük bir sınav varken bazen uykuya geç dalabilir, bazen rahatça uyuyabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz bazı sınavlarda başlarken kalbinin hızlandığını fark edebilir, bazılarında sakin kalabilir.',
            friends: 'Arkadaşlarıyla sınava girmeden önce bazen midesinde hafif bir kıpırtı hissedebilir.',
            home: 'Ertesi gün büyük bir sınav varken bazen uykuya geç dalabilir, bazen rahatça uyuyabilir.',
          },
          adult: {
            work: 'Önemli bir sınav başlayınca bazen ellerinin terlediğini, bazen sakin kaldığını fark edebilirsin.',
          },
        },
        high: {
          from: { school: ['B2'], friends: ['B1'], home: ['B4'], work: ['B3'] },
          student: {
            school: 'Kâğıtlar dağıtılırken kalbinin hızlandığını fark edebilirsin; bu heyecanın sana yardım edebileceğini düşünmek iyi gelebilir.',
            friends: 'Sınav sabahı arkadaşlarınla buluştuğunda midende bir ağırlık hissedebilirsin.',
            home: 'Ertesi gün büyük bir sınav varken uykuya dalman uzun sürebilir; yatmadan önce sakin bir şey yapmak iyi gelebilir.',
          },
          parent: {
            school: 'Çocuğunuz kâğıtlar dağıtılırken kalbinin hızlandığını fark edebilir; bu heyecanın ona yardım edebileceğini düşünmek iyi gelebilir.',
            friends: 'Sınav sabahı arkadaşlarıyla buluştuğunda midesinde bir ağırlık hissedebilir.',
            home: 'Ertesi gün büyük bir sınav varken uykuya dalması uzun sürebilir; yatmadan önce sakin bir şey yapmak iyi gelebilir.',
          },
          adult: {
            work: 'Bir iş ya da ehliyet sınavı başlayınca ellerinin terlediğini fark edebilirsin.',
          },
        },
      },
    },
    /*
     * Sınav sırasında takılma: T1 "Sınavda bildiğim bir şeyi o an hatırlayamam", T2 "Sınav sırasında aklım sorulardan kayıp
     * kaygılarıma gider", T3 "Sınavda bir soruda takılınca sonraki sorulara odaklanamam", T4 "Sınavda gerildiğimde aynı soruyu
     * tekrar tekrar okurum ama aklıma girmez"; ters: T5 "Sınav sırasında dikkatimi sorulara verebilirim".
     */
    block: {
      poles: { low: 'Dikkati sorularda kalır', high: 'Sınavda sık takılır' },
      bands: {
        low: {
          from: { school: ['T5'], friends: ['T1'], home: ['T3'], work: ['T4'] },
          student: {
            school: 'Sınav sırasında dikkatini çoğu zaman önündeki soruda tutabilirsin.',
            friends: 'Sınavdan sonra arkadaşlarınla cevapları konuşurken bildiklerini kâğıda yazabildiğini görebilirsin.',
            home: 'Soru çözerken birinde takılsan da sonrakine genellikle rahatça geçebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz sınav sırasında dikkatini çoğu zaman önündeki soruda tutabilir.',
            friends: 'Sınavdan sonra arkadaşlarıyla cevapları konuşurken bildiklerini kâğıda yazabildiğini görebilir.',
            home: 'Soru çözerken birinde takılsa da sonrakine genellikle rahatça geçebilir.',
          },
          adult: {
            work: 'Bir sertifika sınavında soruları genellikle bir iki okuyuşta anlayabilirsin.',
          },
        },
        average: {
          from: { school: ['T2', 'T5'], friends: ['T1'], home: ['T3'], work: ['T4'] },
          student: {
            school: 'Bazı sınavlarda dikkatini sorularda tutabilir, bazılarında endişelerine kaptırabilirsin.',
            friends: 'Sınavdan sonra arkadaşlarınla konuşurken, bildiğin bir cevabı sınavda hatırlayamadığını bazen fark edebilirsin.',
            home: 'Soru çözerken birinde takılınca bazen toparlanabilir, bazen sonrakilere geçmekte güçlük çekebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz bazı sınavlarda dikkatini sorularda tutabilir, bazılarında endişelerine kaptırabilir.',
            friends: 'Sınavdan sonra arkadaşlarıyla konuşurken, bildiği bir cevabı sınavda hatırlayamadığını bazen fark edebilir.',
            home: 'Soru çözerken birinde takılınca bazen toparlanabilir, bazen sonrakilere geçmekte güçlük çekebilir.',
          },
          adult: {
            work: 'İşle ilgili bir sınavda gerildiğinde bazen bir soruyu birkaç kez okuman gerekebilir.',
          },
        },
        high: {
          from: { school: ['T2'], friends: ['T1'], home: ['T3'], work: ['T4'] },
          student: {
            school: 'Sınav sırasında sık sık sorudan uzaklaşıp endişelerine dalabilirsin.',
            friends: 'Sınavdan sonra arkadaşlarınla konuşurken, bildiğin bazı cevapları sınavda hatırlayamadığını fark edebilirsin.',
            home: 'Soru çözerken birinde takılınca sonrakilere dikkatini vermen güçleşebilir; kısa bir mola verip yeniden başlamak iyi gelebilir.',
          },
          parent: {
            school: 'Çocuğunuz sınav sırasında sık sık sorudan uzaklaşıp endişelerine dalabilir.',
            friends: 'Sınavdan sonra arkadaşlarıyla konuşurken, bildiği bazı cevapları sınavda hatırlayamadığını fark edebilir.',
            home: 'Soru çözerken birinde takılınca sonrakilere dikkatini vermesi güçleşebilir; kısa bir mola verip yeniden başlamak iyi gelebilir.',
          },
          adult: {
            work: 'Önemli bir sınavda gerildiğinde bir soruyu birkaç kez okuyup kavramakta güçlük çekebilirsin.',
          },
        },
      },
    },
    /*
     * Sınava hazırlık: P1 "Sınava çalışmaya erkenden başlar, çalışmayı günlere yayarım", P2 "Sınava çalışırken soru çözerek
     * ya da bakmadan anlatarak kendimi sınarım", P3 "Sınavda nelerin sorulacağını öğrenip çalışmamı buna göre planlarım";
     * ters: P4 "Sınava çalışmayı son geceye bırakırım", P5 "Sınavı düşünmemek için başka şeylerle oyalanırım".
     */
    prep: {
      poles: { low: 'Hazırlığı daha az planlı', high: 'Önceden hazırlanır' },
      bands: {
        low: {
          from: { school: ['P4'], friends: ['P2'], home: ['P5'], work: ['P4'] },
          student: {
            school: 'Bir sınava çalışmaya çoğu zaman son akşam başlayabilirsin.',
            friends: 'Arkadaşlarınla çalışırken birbirinize soru sormak yerine notları okumayı seçebilirsin.',
            home: 'Sınav aklına geldikçe başka işlere dalabilirsin; biriyle birlikte çalışmaya başlamak iyi gelebilir.',
          },
          parent: {
            school: 'Çocuğunuz bir sınava çalışmaya çoğu zaman son akşam başlayabilir.',
            friends: 'Arkadaşlarıyla çalışırken birbirlerine soru sormak yerine notları okumayı seçebilir.',
            home: 'Sınav aklına geldikçe başka işlere dalabilir; biriyle birlikte çalışmaya başlamak ona iyi gelebilir.',
          },
          adult: {
            work: 'İşle ilgili bir sınava çalışmaya çoğu zaman son akşam başlayabilirsin.',
          },
        },
        average: {
          from: { school: ['P1', 'P4'], friends: ['P2'], home: ['P5'], work: ['P1'] },
          student: {
            school: 'Bazı sınavlara günler önceden çalışmaya başlayabilir, bazılarını son geceye bırakabilirsin.',
            friends: 'Arkadaşlarınla çalışırken bazen birbirinize soru sorabilir, bazen yalnızca notlara göz atabilirsin.',
            home: 'Bazı akşamlar sınavı aklından uzak tutmak için çalışmayı ertesi güne kaydırabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz bazı sınavlara günler önceden çalışmaya başlayabilir, bazılarını son geceye bırakabilir.',
            friends: 'Arkadaşlarıyla çalışırken bazen birbirlerine soru sorabilir, bazen yalnızca notlara göz atabilir.',
            home: 'Bazı akşamlar sınavı aklından uzak tutmak için çalışmayı ertesi güne kaydırabilir.',
          },
          adult: {
            work: 'Bir iş sınavına bazen erkenden, bazen son günlerde hazırlanabilirsin.',
          },
        },
        high: {
          from: { school: ['P3'], friends: ['P2'], home: ['P1'], work: ['P3'] },
          student: {
            school: 'Bir sınav açıklanınca hangi konulardan soru geleceğini öğrenip plan yapabilirsin.',
            friends: 'Arkadaşlarınla çalışırken konuyu birbirinize anlatarak tekrar edebilirsin.',
            home: 'Sınavdan önceki günlerde her akşam biraz çalışarak hazırlanabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz bir sınav açıklanınca hangi konulardan soru geleceğini öğrenip plan yapabilir.',
            friends: 'Arkadaşlarıyla çalışırken konuyu birbirlerine anlatarak tekrar edebilir.',
            home: 'Sınavdan önceki günlerde her akşam biraz çalışarak hazırlanabilir.',
          },
          adult: {
            work: 'Ehliyet ya da iş sınavı için hangi konulardan soru geleceğini öğrenip plan yapabilirsin.',
          },
        },
      },
    },
    /*
     * Baş etme yolları: C1 "Sınavdan önce birkaç yavaş nefes alarak kendimi toparlarım", C2 "Sınavlarla ilgili duygularımı
     * güvendiğim biriyle konuşurum", C3 "Sınavda takıldığım bir soruyu geçip sonra ona geri dönerim", C4 "Sınavdan önce
     * kendime “Elimden geleni yapacağım” gibi sakinleştirici sözler söylerim"; ters: C5 "Sınavda takıldığım bir soruyu geçmek
     * yerine onda uzun süre kalırım".
     */
    calm: {
      poles: { low: 'Bu yolları az kullanır', high: 'Bu yolları sık kullanır' },
      bands: {
        low: {
          from: { school: ['C5'], friends: ['C2'], home: ['C1'], work: ['C1'] },
          student: {
            school: 'Sınavda zorlandığın bir soruyla, onu geçip sonra dönmek yerine uğraşmayı sürdürebilirsin.',
            friends: 'Gerildiğinde bunu arkadaşlarına ya da başka birine pek açmayabilirsin.',
            home: 'Sınavdan önceki akşam nefesini yavaşlatıp toparlanmayı pek denemeyebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz sınavda zorlandığı bir soruyla, onu geçip sonra dönmek yerine uğraşmayı sürdürebilir.',
            friends: 'Gerildiğinde bunu arkadaşlarına ya da başka birine pek açmayabilir.',
            home: 'Sınavdan önceki akşam nefesini yavaşlatıp toparlanmayı pek denemeyebilir.',
          },
          adult: {
            work: 'İş için girdiğin bir sınavdan önce nefesinle toparlanmayı pek denemeyebilirsin.',
          },
        },
        average: {
          from: { school: ['C3', 'C5'], friends: ['C2'], home: ['C1'], work: ['C4'] },
          student: {
            school: 'Sınavda takıldığında bazen soruyu geçip sonra dönebilir, bazen onunla uzun süre uğraşabilirsin.',
            friends: 'Sınavla ilgili duygularını bazen bir arkadaşınla paylaşabilir, bazen bunları kimseyle konuşmayabilirsin.',
            home: 'Sınavdan önceki akşam bazen nefesini yavaşlatıp toparlanabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz sınavda takıldığında bazen soruyu geçip sonra dönebilir, bazen onunla uzun süre uğraşabilir.',
            friends: 'Sınavla ilgili duygularını bazen bir arkadaşıyla paylaşabilir, bazen bunları kimseyle konuşmayabilir.',
            home: 'Sınavdan önceki akşam bazen nefesini yavaşlatıp toparlanabilir.',
          },
          adult: {
            work: 'Önemli bir sınavdan önce bazen kendine cesaret veren bir söz söyleyebilirsin.',
          },
        },
        high: {
          from: { school: ['C3'], friends: ['C2'], home: ['C4'], work: ['C1'] },
          student: {
            school: 'Sınavda takıldığın soruyu işaretleyip kalanlara geçebilir, sonra ona dönebilirsin.',
            friends: 'Sınavla ilgili duygularını arkadaşlarından biriyle paylaşabilirsin.',
            home: 'Sınav sabahı kendine “Elimden geleni yapacağım” diyebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz sınavda takıldığı soruyu işaretleyip kalanlara geçebilir, sonra ona dönebilir.',
            friends: 'Sınavla ilgili duygularını arkadaşlarından biriyle paylaşabilir.',
            home: 'Sınav sabahı kendine “Elimden geleni yapacağım” diyebilir.',
          },
          adult: {
            work: 'Bir iş sınavından önce birkaç derin nefesle toparlanabilirsin.',
          },
        },
      },
    },
  },
};
