import { besFaktorReport } from '@/content/reports/bes-faktor';
import { besFaktorRoadmap as bf } from './bes-faktor';
import type { BandGroup, RoadmapTemplate } from './types';

/**
 * Hızlı Kişilik Testi: gelişim yol haritası. Test, Beş Faktör Kişilik Profili'nin dayandığı 50 maddelik IPIP Beş Faktör
 * ölçeğinin 20 maddelik kısa formudur (Mini-IPIP); beş boyut ve anahtarları aynıdır. Bu yüzden hocanın onayladığı Beş
 * Faktör yol haritası metinleri kullanılır (Ayrıntılı Kişilik Profili'ndeki gibi; Beş Faktör'ün yol haritası yetişkin
 * metinlerini de içerir). Veliye yaklaşım önerileri Beş Faktör raporundaki veli önerilerinin ilkidir.
 *
 * Ancak bu testin her boyutu yalnızca dört maddeyle ölçülür ve rapor metinleri yalnızca o maddelerin sorduğunu anlatır.
 * Beş Faktör metinlerinden bu maddelerin hiç sormadığı bir özelliği güçlü yan diye söyleyen ya da rapordaki kartla çelişen
 * metinler bu testte değiştirildi:
 *  - Uyumluluk düşük: Beş Faktör "Fikirleri sorgulamak ve eleştirel bakmak senin güçlü yanın" der; buradaki dört madde
 *    yalnızca başkalarının duygularına ve sorunlarına ilgiyi sorar. Öneri, kendine adım adım açıklama (Dunlosky ve ark.,
 *    2013: kendine açıklama) ve başkalarının fikrini sormaktır; ortam da eleştiriye değil göreve odaklanır. Çalışma önerisi
 *    boyuttan bir güç çıkarmaz ("Kendi işine odaklanmak…" gibi bir çıkarım, dışadönüklük yüksekken "İnsanlarla birlikte
 *    çalışmak seni canlı tutuyor" metniyle yan yana çelişirdi).
 *  - Uyumluluk yüksek: Beş Faktör "İş birliği içinde öğrenmek sana kolay geliyor" der; maddeler iş birliğini sormaz. Yalnızca
 *    bu ilk cümle değişti.
 *  - Sorumluluk orta: Beş Faktör "İlgini çeken işlerde düzenlisin" der; maddeler ilgiyi sormaz. Yalnızca bu ilk cümle değişti.
 *  - Merak ve Hayal Gücü düşük: Beş Faktör "Somut ve işe yarar konulara odaklanmak senin güçlü yanın" der; maddeler somut
 *    konulara ilgiyi sormaz. Bu cümle çıkarıldı.
 *  - Duygusal Denge düşük: Beş Faktör "Duygularını yoğun yaşaman" der; maddeler duyguların yoğunluğunu değil, sık sık inip
 *    çıkmasını sorar. Yalnızca bu ilk söz değişti; metnin kalanı Beş Faktör'ündür.
 *  - Duygusal Denge orta: Beş Faktör "Çoğu zaman sakinsin" der; buradaki kart "bazen sakin, bazen çabuk etkilenen" der.
 *  - Duygusal Denge yüksek: Beş Faktör "Baskı altında sakin kalabilmen" der; maddeler baskıyı ya da hızlı kararı sormaz,
 *    "çoğu zaman rahat ve sakin" olmayı sorar. Ortam da "baskı altında, hızlı karar" yerine yalnızca sakin kalabilmektir.
 *  - Veliye yaklaşım: Uyumluluk yüksek ve orta, Dışadönüklük orta (Beş Faktör'deki "kendi görüşünü savunma", "farklı
 *    görüşleri tartışma" ve karşılığı olmayan "bu denge"), Sorumluluk düşük (aynı yol haritasının 2. haftasındaki "herkesin
 *    görebileceği takvim"i tekrar ederdi; burada maddelerin sorduğu "yerine koyma" ve "hemen halletme"), Merak ve Hayal Gücü
 *    düşük (aynı boyutun "Nasıl çalışabilir?" metnindeki "gerçek hayattan örnek"i tekrar ederdi; Beş Faktör raporundaki
 *    ikinci veli önerisi).
 */
const parentTip = (key: string): Record<BandGroup, string> => ({
  low: besFaktorReport.scales[key].low!.tipsParent[0],
  average: besFaktorReport.scales[key].average!.tipsParent[0],
  high: besFaktorReport.scales[key].high!.tipsParent[0],
});

/** Metindeki bir sözü değiştirir; söz metinde yoksa (Beş Faktör metni değiştiyse) hata verir. */
function swap(text: string, from: string, to: string): string {
  if (!text.includes(from)) throw new Error(`Beş Faktör yol haritasında bulunamadı: ${from}`);
  return text.replace(from, to);
}

const A = bf.scales.agreeableness;
const C = bf.scales.conscientiousness;
const ES = bf.scales.emotional_stability;
const I = bf.scales.intellect;

export const hizliKisilikTestiRoadmap: RoadmapTemplate = {
  ...bf,
  version: 'hizli-kisilik-testi-yol-haritasi-1',
  scales: {
    ...bf.scales,
    agreeableness: {
      ...A,
      study: {
        ...A.study,
        high: {
          student: swap(
            A.study.high.student,
            'İş birliği içinde öğrenmek sana kolay geliyor.',
            'Başkalarının ne hissettiğini anlaman, birlikte çalışırken işine yarayabilir.',
          ),
          parent: swap(
            A.study.high.parent,
            'Çocuğunuza iş birliği içinde öğrenmek kolay geliyor olabilir.',
            'Başkalarının ne hissettiğini anlaması, birlikte çalışırken çocuğunuzun işine yarayabilir.',
          ),
          adult: swap(
            A.study.high.adult!,
            'İş birliği içinde öğrenmek sana kolay geliyor.',
            'Başkalarının ne hissettiğini anlaman, birlikte çalışırken işine yarayabilir.',
          ),
        },
        low: {
          student:
            'Hangi ortamda çalışırsan çalış, öğrendiğini kendine açıklamak işe yarar: bir bölümü okuduktan ya da bir soruyu çözdükten sonra ne öğrendiğini ya da nasıl çözdüğünü adım adım kendine anlat. Açıklayamadığın yer, yeniden bakman gereken yerdir.',
          parent:
            'Çocuğunuz hangi ortamda çalışırsa çalışsın, öğrendiğini kendine açıklaması işe yarar: bir bölümü okuduktan ya da bir soruyu çözdükten sonra ne öğrendiğini ya da nasıl çözdüğünü adım adım kendine anlatması, neyi yeniden çalışması gerektiğini gösterir.',
          adult:
            'Hangi ortamda çalışırsan çalış, öğrendiğini kendine açıklamak işe yarar: bir konuyu okuduktan ya da bir işi bitirdikten sonra ne öğrendiğini ya da nasıl yaptığını adım adım kendine anlat. Açıklayamadığın yer, yeniden bakman gereken yerdir.',
        },
      },
      action: {
        ...A.action,
        low: {
          student: 'Bir grup çalışmasına başlamadan önce herkese ne düşündüğünü sor; hepsini dinledikten sonra kendi fikrini söyle.',
          parent:
            'Çocuğunuzla, bir grup çalışmasına başlarken arkadaşlarına ne düşündüklerini nasıl sorabileceğini konuşun; bunu bir eleştiri olarak değil, işi kolaylaştıran bir adım olarak anlatın.',
          adult: 'Ortak bir işe başlamadan önce herkese ne düşündüğünü sor; hepsini dinledikten sonra kendi fikrini söyle.',
        },
      },
      settings: { ...A.settings, low: 'Kararların işin gereğine göre verildiği, göreve odaklanan ortamlar' },
    },
    conscientiousness: {
      ...C,
      study: {
        ...C.study,
        average: {
          student: swap(
            C.study.average.student,
            'İlgini çeken işlerde düzenlisin; diğerlerinde başlamak zor gelebilir.',
            'Bazı işlere başlamak sana ötekilerden daha zor gelebilir.',
          ),
          parent: swap(
            C.study.average.parent,
            'Çocuğunuz ilgisini çeken işlerde düzenli, diğerlerinde başlamakta zorlanıyor olabilir.',
            'Bazı işlere başlamak çocuğunuza ötekilerden daha zor gelebilir.',
          ),
          adult: swap(
            C.study.average.adult!,
            'İlgini çeken işlerde düzenlisin; diğerlerinde başlamak zor gelebilir.',
            'Bazı işlere başlamak sana ötekilerden daha zor gelebilir.',
          ),
        },
      },
    },
    emotional_stability: {
      ...ES,
      study: {
        ...ES.study,
        low: {
          student: swap(ES.study.low.student, 'Duygularını yoğun yaşaman', 'Duygularının inip çıkması'),
          parent: swap(ES.study.low.parent, 'Çocuğunuz duyguları yoğun yaşıyor olabilir;', 'Çocuğunuz duygularının inip çıkabildiğini belirtiyor;'),
          adult: swap(ES.study.low.adult!, 'Duygularını yoğun yaşaman', 'Duygularının inip çıkması'),
        },
        high: {
          student:
            'Çoğu zaman rahat ve sakin olman, sınava hazırlanırken de işine yarayabilir. Bu rahatlığın "Nasılsa yetişir" düşüncesine dönüşmemesi için sınav tarihinden geriye doğru küçük bir plan yap ve deneme sınavlarıyla kendini sına.',
          parent:
            'Çocuğunuzun çoğu zaman rahat ve sakin olması, sınavlara hazırlanırken bir güç olabilir. Bu rahatlığın son ana bırakmaya dönüşmemesi için sınav tarihinden geriye doğru küçük bir plan yapmasına destek olabilirsiniz.',
          adult:
            'Çoğu zaman rahat ve sakin olman önemli bir güç olabilir. Bu rahatlığın son ana bırakmaya dönüşmemesi için önemli bir işin tarihinden geriye doğru küçük bir plan yap.',
        },
        average: {
          student:
            'Bazı dersler ya da sınavlar seni ötekilerden daha çok gerebilir. Seni zorlayan konulara daha erken başla ve onları kısa ama sık tekrarlarla çalış. İyi hazırlanmış hissetmek gerginliği azaltır.',
          parent:
            'Bazı dersler ya da sınavlar çocuğunuzu ötekilerden daha çok gerebilir. Zorlandığı konulara erken başlaması ve onları kısa ama sık tekrarlarla çalışması, iyi hazırlanmış hissetmesini sağlar.',
          adult:
            'Bazı işler seni ötekilerden daha çok gerebilir. Seni zorlayan işlere daha erken başla ve onları küçük parçalara böl. İyi hazırlanmış hissetmek gerginliği azaltır.',
        },
      },
      settings: { ...ES.settings, high: 'Sakin kalabilmenin işe yaradığı ortamlar' },
    },
    intellect: {
      ...I,
      study: {
        ...I.study,
        low: {
          student: swap(I.study.low.student, 'Somut ve işe yarar konulara odaklanmak senin güçlü yanın. ', ''),
          parent: swap(
            I.study.low.parent,
            'Çocuğunuz somut ve işe yarar konulara odaklanmayı seviyor. Soyut bir konuyu gerçek hayattan bir örnekle ya da bir çizimle başlatmak işini kolaylaştırır.',
            'Soyut bir konuyu gerçek hayattan bir örnekle ya da bir çizimle başlatmak çocuğunuzun işini kolaylaştırır.',
          ),
          adult: swap(I.study.low.adult!, 'Somut ve işe yarar konulara odaklanmak senin güçlü yanın. ', ''),
        },
      },
    },
  },
  approach: {
    extraversion: {
      ...parentTip('extraversion'),
      average: 'Hem grup hem de bireysel etkinliklere yer açmak, farklı ortamlarda rahat edebilmesini destekler.',
    },
    agreeableness: {
      ...parentTip('agreeableness'),
      high: 'Başkalarının sıkıntısını yakından hissettiği günlerde onu dinleyin; kendi ihtiyaçlarına da zaman ayırmasını destekleyin.',
      average: 'Hangi insanların duygularına daha yakın, hangilerine daha mesafeli olduğunu onunla suçlamadan, merakla konuşabilirsiniz.',
    },
    conscientiousness: {
      ...parentTip('conscientiousness'),
      low: 'Suçlamak yerine birlikte basit düzenler kurun: kullandığı şeyler için sabit bir yer, yapılacak işler için kısa bir liste.',
    },
    emotional_stability: parentTip('emotional_stability'),
    intellect: { ...parentTip('intellect'), low: besFaktorReport.scales.intellect.low!.tipsParent[1] },
  },
};
