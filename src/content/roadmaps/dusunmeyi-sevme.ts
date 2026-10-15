import { besFaktorRoadmap as bf } from './bes-faktor';
import type { RoadmapTemplate } from './types';

/**
 * Düşünmeyi Sevme Ölçeği: gelişim yol haritası metinleri.
 *
 * İlkeler:
 *  - Etkili çalışma yöntemleri herkes için aynıdır (Dunlosky ve ark., 2013). Düşünmeyi sevme düzeyi bu yöntemleri hangi
 *    konularla ve nasıl başlatmanın kolay geleceğine ipucu verir. İsveç'te 274 lise öğrencisiyle yapılan bir çalışmada
 *    kaynağa bakmadan hatırlamaya çalışmanın, düşünmeyi sevme düzeyi düşük olanlarda da bir hafta sonra daha çok
 *    hatırlamayı sağladığı görüldü (Wiklund-Hörnqvist ve ark., 2022); düşük düzeydeki öneri buna dayanır.
 *  - Veliye öneriler: evde düşündüren etkinlikler ve çocuğun kendi seçimlerini yapmasına alan tanıyan bir tutum, ergenlikte
 *    bu eğilimin yüksek seyriyle birlikte görülmüştür (Lavrijsen ve ark., 2024; ilişki, neden-sonuç değil). Biraz zorlayan
 *    ama başarılabilir işler, çabanın takdiri ve yetişkinin düşünürken yüksek sesle düşünmesi ve hatasını kabul etmesi
 *    araştırmacıların önerdiği, henüz sınanmamış yollardır (Aerts ve ark., 2024); metinler bunları vaat olarak sunmaz.
 *  - Tek boyutlu test: üç boyutlu profil ve ortamlar bölümü yoktur; 2. hafta bu ölçeğin denemesi ("Kafa yoran küçük bir
 *    deneme"), 3. hafta şablondaki ek deneme ("Birlikte düşünmek").
 *  - Zekâ hakkında hüküm verilmez; "beyni çalıştırma" ya da puanı yükseltme vaadi yoktur. Rapor metinleri tekrar edilmez.
 *  - Yetişkin metni yalnızca öğrenci metni okula özgü olduğunda ya da kitaptan, dersten söz ettiğinde yazılır.
 */
const dunlosky = bf.sources.find((s) => s.text.startsWith('Dunlosky'))!;

export const dusunmeyiSevmeRoadmap: RoadmapTemplate = {
  version: 'dusunmeyi-sevme-yol-haritasi-1',
  planningScale: 'need_for_cognition',
  planningTitle: 'Kafa yoran küçük bir deneme',
  extraWeek: {
    title: 'Birlikte düşünmek',
    text: {
      student:
        'Bu hafta biriyle, örneğin bir arkadaşınla, kafa yorabileceğiniz bir şey seç: bir bulmaca, beraber izleyeceğiniz bir belgesel ya da gündelik bir soru olabilir. Önce onun ne düşündüğünü sor, sonra kendi fikrini gerekçesiyle anlat.',
      parent:
        'Bu hafta çocuğunuzla birlikte kafa yoracağınız bir şey seçin: bir bulmaca, bir belgesel ya da sofrada konuşulacak bir soru. Siz de nasıl düşündüğünüzü yüksek sesle anlatın; bilmediğiniz yerde “Bilmiyorum, birlikte bakalım” deyin.',
    },
  },
  studyIntro: {
    student:
      'Araştırmalara göre herkes için en etkili yöntemler aynıdır: öğrendiğini kaynağa bakmadan hatırlamaya çalışmak ve tekrarları günlere yaymak. Düşünmeyi ne kadar sevdiğin, bu yöntemleri hangi konularda ve nasıl kullanmaya başlamanın sana kolay geleceğine dair ipucu verebilir.',
    parent:
      'Araştırmalara göre herkes için en etkili yöntemler aynıdır: öğrendiğini kaynağa bakmadan hatırlamaya çalışmak ve tekrarları günlere yaymak. Çocuğunuzun düşünmeyi ne kadar sevdiği, bu yöntemleri hangi konularda ve nasıl kullanmaya başlamanın ona kolay geleceğine dair ipucu verebilir.',
  },
  firstWeek: {
    student:
      'Raporundaki sonucu düşün. Bu hafta hangi işlerde düşünmekten keyif aldığını, hangilerinden kaçındığını fark et ve iki üç cümleyle bir deftere yaz.',
    parent: bf.firstWeek.parent,
  },
  lastWeek: bf.lastWeek,
  // Öğrenme ve Başarı Özellikleri aynı 10 cümleyi içerdiği için önerilmez.
  nextTests: ['zihniyet'],
  nextPurpose: {
    you: 'zekâ ve öğrenme hakkındaki inançlarını da görmek',
    parent: 'çocuğunuzun zekâ ve öğrenme hakkındaki inançlarını da görmek',
  },
  approach: {
    need_for_cognition: {
      low: 'Ona çok zor işler yerine biraz uğraştıran ama başarabileceği işler önerin; başardığında emeğini ve izlediği yolu somut sözlerle takdir edin.',
      average: 'İlgisini çeken konuları sorun; o konularda daha derine inmesi için ona zaman ve kaynak sağlayın.',
      high: 'Fikirlerini dinlemeye zaman ayırın; neyi okuyacağına ve neyi araştıracağına kendisinin karar vermesine alan tanıyın.',
    },
  },
  scales: {
    need_for_cognition: {
      color: '#7a4ee6',
      study: {
        low: {
          student:
            'Kafa yoran işlerden pek hoşlanmasan da en etkili yöntemler senin için de işe yarar: lise öğrencileriyle yapılan bir araştırmada, öğrendiğini kaynağa bakmadan hatırlamaya çalışmanın, düşünmeyi sevme düzeyi düşük olanlarda da bir hafta sonra daha çok hatırlamayı sağladığı görüldü. Zor bir konuyu kısa bölümlere ayır ve takıldığın yeri birine sor.',
          parent:
            'Çocuğunuz kafa yoran işlerden pek hoşlanmasa da en etkili yöntemler onun için de işe yarar: lise öğrencileriyle yapılan bir araştırmada, öğrendiğini kaynağa bakmadan hatırlamaya çalışmanın, düşünmeyi sevme düzeyi düşük olanlarda da bir hafta sonra daha çok hatırlamayı sağladığı görüldü. Zor bir konuyu kısa bölümlere ayırması ve takıldığı yeri sorması işini kolaylaştırabilir.',
          adult:
            'Kafa yoran işlerden pek hoşlanmasan da en etkili yöntemler senin için de işe yarar: gençlerle yapılan bir araştırmada, öğrendiğini kaynağa bakmadan hatırlamaya çalışmanın, düşünmeyi sevme düzeyi düşük olanlarda da bir hafta sonra daha çok hatırlamayı sağladığı görüldü. Zor bir konuyu kısa bölümlere ayır ve takıldığın yeri birine sor.',
        },
        average: {
          student:
            'İlgini daha az çeken bir konuyu, sevdiğin bir konuyla ya da gündelik hayattan bir soruyla ilişkilendir. Üzerine kafa yorduğun bir konuyu birkaç gün sonra kaynağa bakmadan hatırlamaya çalışmak, onu daha kalıcı hâle getirebilir.',
          parent:
            'İlgisini daha az çeken bir konuyu sevdiği bir konuyla ya da gündelik hayattan bir soruyla ilişkilendirmesi çocuğunuzun işini kolaylaştırabilir. Çalıştığı bir konuyu birkaç gün sonra kaynağa bakmadan hatırlamaya çalışması da onu daha kalıcı hâle getirebilir.',
        },
        high: {
          student:
            'Zor bir konuyla uğraşmaktan keyif alman güçlü bir dayanak. Bunu en etkili yöntemlerden biriyle birleştir: üzerine kafa yorduğun bir konuyu birkaç gün sonra kaynağa bakmadan hatırlamaya çalış. Aklına gelen yan sorular seni asıl konudan uzaklaştırıyorsa onları bir kenara not et; asıl konuyu bitirince onlara dön.',
          parent:
            'Çocuğunuzun zor bir konuyla uğraşmaktan keyif alması güçlü bir dayanak. Bunu, üzerine kafa yorduğu bir konuyu birkaç gün sonra kaynağa bakmadan hatırlamaya çalışmasıyla birleştirebilir. Aklına gelen yan sorular onu asıl konudan uzaklaştırıyorsa, onları not edip asıl konuyu bitirince dönmesini önerebilirsiniz.',
        },
      },
      action: {
        low: {
          student:
            'Bu hafta her gün 10 dakika ayır: o gün öğrendiğin bir şeyi kaynağa bakmadan hatırlamaya çalış, sonra doğru hatırlayıp hatırlamadığını kontrol et.',
          parent: 'Bu hafta çocuğunuza günde 10 dakikalık bir “hatırla ve kontrol et” denemesi önerin; hafta sonunda nasıl geçtiğini birlikte konuşun.',
        },
        average: {
          student: 'Bu hafta ilgini daha az çeken bir konu seç; o konuda kendine “Bu neden böyle?” diye sor ve cevabını üç cümleyle açıkla.',
          parent: 'Bu hafta çocuğunuzla ilgisini daha az çeken bir konu seçin ve “Bu neden böyle?” sorusunun cevabını birlikte bulmaya çalışın.',
        },
        high: {
          student: 'Bu hafta merak ettiğin bir soruyu seç, üzerine düşün ve bulduklarını birine beş dakikada anlat; anlatırken takıldığın yeri not et.',
          parent: 'Bu hafta çocuğunuzdan merak ettiği bir soruyu araştırıp size beş dakikada anlatmasını isteyin; dinlerken ilgiyle sorular sorun.',
        },
      },
    },
  },
  sources: [
    dunlosky,
    {
      text: 'Wiklund-Hörnqvist, C., Stillesjö, S., Andersson, M., Jonsson, B. ve Nyberg, L. (2022). Retrieval practice is effective regardless of self-reported need for cognition: Behavioral and brain imaging evidence. Frontiers in Psychology, 12, 797395.',
      url: 'https://doi.org/10.3389/fpsyg.2021.797395',
    },
    {
      text: 'Lavrijsen, J., Aerts, E., Preckel, F., Ramos, A. ve Verschueren, K. (2024). Becoming a “hungry mind”: Stability and change in need for cognition across adolescence. Journal of Intelligence, 12(10), 103.',
      url: 'https://doi.org/10.3390/jintelligence12100103',
    },
    {
      text: 'Aerts, E., Lavrijsen, J., Preckel, F. ve Verschueren, K. (2024). A theoretical framework for the development of need for cognition in childhood and adolescence. Journal of Intelligence, 12(10), 99.',
      url: 'https://doi.org/10.3390/jintelligence12100099',
    },
  ],
};
