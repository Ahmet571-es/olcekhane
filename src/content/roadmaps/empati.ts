import { besFaktorRoadmap as bf } from './bes-faktor';
import { KAYNAK } from './kaynaklar';
import type { RoadmapTemplate } from './types';

/**
 * Empati: gelişim yol haritası metinleri.
 *
 * İlkeler:
 *  - Etkili öğrenme yöntemleri herkes için aynıdır (kaynağa bakmadan hatırlamaya çalışmak, tekrarları günlere yaymak;
 *    Dunlosky ve ark., 2013; Roediger ve Karpicke, 2006). Empati yalnızca bu yöntemleri kiminle ve hangi düzende kullanmanın
 *    kolay geleceğine ipucu verir; kişiliğe göre "öğrenme stili" eşleştirmesi vaat edilmez.
 *  - "Bu hafta dene" önerileri gündelik, küçük ve güvenli adımlardır: dinlemek, karşındakinin söylediğini kendi cümlesiyle
 *    geri söyleyip doğru anlayıp anlamadığını sormak, bir duyguyu adlandırmak, değer verdiğini göstermek. Empati eğitimlerinin
 *    orta büyüklükte bir etkisi bulunmuştur (Teding van Berkhout ve Malouff, 2016); burada bir eğitim programı değil, ondan
 *    esinlenen küçük denemeler önerilir ve bir etki vaat edilmez.
 *  - Düşük düzeyde kişi suçlanmaz ve zorlanmaz; yüksek düzeyde başkalarına destek olurken kendini de gözetmesi hatırlatılır
 *    (her isteğe "evet" demek zorunda olmadığı, duygusunu adlandırıp rahatlamanın yollarını bulması).
 *  - 2. hafta "Dinle ve anla" (Başkalarını düşünme); 3. hafta ortadan en uzak öteki yön.
 *  - Aynı yön ve düzeyde rapor kartı, "Nasıl çalışabilirsin?" kartı, "Bu hafta dene" ve veliye yaklaşım aynı fikri tekrar
 *    etmez; veliye yaklaşım önerileri de birbirini tekrar etmez (tests/empati.test.ts ortak söz öbeklerini arar).
 *  - Ortamlar bir meslek önerisi değildir; meslek için ilgi testlerine yönlendirilir (Beş Faktör'deki not).
 *  - Test yetişkinlere de açıktır: öğrenci metni okula özgü olduğunda ya da kitaptan söz ettiğinde yetişkin metni yazılır.
 */
export const empatiRoadmap: RoadmapTemplate = {
  version: 'empati-yol-haritasi-1',
  planningScale: 'understanding',
  planningTitle: 'Dinle ve anla',
  unit: { one: 'yön', toPlural: 'yönlere' },
  studyIntro: {
    student:
      'Araştırmalara göre herkes için en etkili öğrenme yöntemleri aynıdır: öğrendiğini kaynağa bakmadan hatırlamaya çalışmak ve tekrarları günlere yaymak. Empatinin yönleri, bu yöntemleri kiminle ve hangi düzende kullanmanın sana kolay geleceği konusunda ipucu verebilir.',
    parent:
      'Araştırmalara göre herkes için en etkili öğrenme yöntemleri aynıdır: öğrendiğini kaynağa bakmadan hatırlamaya çalışmak ve tekrarları günlere yaymak. Çocuğunuzun empatisinin yönleri, bu yöntemleri kiminle ve hangi düzende kullanmanın ona kolay geleceği konusunda ipucu verebilir.',
  },
  settingsNote: bf.settingsNote,
  firstWeek: {
    student:
      'Raporundaki üç yöne bak. Bu hafta her gün, birinin ne hissettiğini fark ettiğin bir anı bir cümleyle yaz: kimdi, ne hissediyor olabilirdi, bunu nereden anladın?',
    parent:
      'Bu hafta raporu çocuğunuzla birlikte okuyun; hangi cümlelerin onu anlattığını sorun. Hemen bir şeyi değiştirmeye çalışmayın, yalnızca birlikte gözlem yapın.',
  },
  lastWeek: bf.lastWeek,
  nextTests: ['kisiligin-10-yonu', 'duygusal-zeka-bilesenleri'],
  nextPurpose: {
    you: 'başkalarıyla ilişkilerini ve duygularını başka yönlerden de görmek',
    parent: 'çocuğunuzun başkalarıyla ilişkilerini ve duygularını başka yönlerden de görmek',
  },
  approach: {
    understanding: {
      low: 'Başkalarından söz ederken ara sıra “Sence o kişi neden böyle davrandı?” diye sorun; cevabını yargılamadan karşılayın.',
      average: 'Birine yardım ettiği ya da birinin görüşüne değer verdiği bir anı fark ettiğinizde bunu ona söyleyin.',
      high: 'Başkalarına gösterdiği özeni takdir edin; her isteğe “evet” demek zorunda olmadığını da açıkça konuşun.',
    },
    affective: {
      low: 'Her olaydan etkilenmesini beklemeyin; siz de kendi duygularınızı adlandırarak konuşun (“Buna üzüldüm” gibi).',
      average: 'Gün içinde onu neyin etkilediğini, neyin pek etkilemediğini merakla sorun; iki cevabı da olağan karşılayın.',
      high: 'Bir olaydan çok etkilendiğinde “Bu kadar üzülme” demek yerine “Bu seni çok üzdü, değil mi?” gibi sözlerle duygusunu ciddiye alın.',
    },
    warmth: {
      low: 'Sıcaklığını göstermesi için onu zorlamayın; yakınlık kimi zaman yan yana bir iş yaparken daha kolay kurulur: birlikte yemek hazırlamak ya da bir şeyi onarmak gibi.',
      average: 'Bir yakınınızı ararken ya da misafir ağırlarken, isterse çocuğunuza da küçük bir iş verin (hâl hatır sormak, ikram etmek gibi).',
      high: 'İnsanlarla kurduğu sıcak ilişkilere değer verdiğinizi gösterin; kendisi için de dinlenme vakti bırakmasını hatırlatın.',
    },
  },
  scales: {
    understanding: {
      color: '#df4777',
      study: {
        high: {
          student:
            'Başkalarının bakış açısına değer vermen birlikte çalışırken işine yarayabilir. Bir arkadaşınla çalışırken sırayla birbirinize kitaba bakmadan soru sorun; cevap veremediğiniz yerleri birlikte not edin.',
          parent:
            'Çocuğunuzun başkalarının bakış açısına değer vermesi birlikte çalışırken işine yarayabilir. Bir arkadaşıyla sırayla birbirlerine kitaba bakmadan soru sorup cevap veremedikleri yerleri not etmelerini önerebilirsiniz.',
          adult:
            'Başkalarının bakış açısına değer vermen birlikte öğrenirken işine yarayabilir. Aynı konuyu öğrenen biriyle sırayla birbirinize kaynağa bakmadan soru sorun; cevap veremediğiniz yerleri birlikte not edin.',
        },
        average: {
          student:
            'Bir konuyu çalıştıktan sonra, onu hiç bilmeyen birine anlatacakmış gibi kitaba bakmadan kendi cümlelerinle yaz; sonra kitapla karşılaştırıp eksiklerini bul.',
          parent:
            'Bir konuyu çalıştıktan sonra, onu hiç bilmeyen birine anlatacakmış gibi kitaba bakmadan kendi cümleleriyle yazması ve sonra kitapla karşılaştırması çocuğunuzun eksiklerini görmesini kolaylaştırabilir.',
          adult:
            'Bir konuyu öğrendikten sonra, onu hiç bilmeyen birine anlatacakmış gibi kaynağa bakmadan kendi cümlelerinle yaz; sonra kaynakla karşılaştırıp eksiklerini bul.',
        },
        low: {
          student:
            'Kendi önceliklerine odaklanman, kendi çalışma planını yapmanı kolaylaştırabilir. Tekrar günlerini önceden belirle (bir gün, bir hafta ve bir ay sonra gibi) ve her tekrarda önce kitaba bakmadan hatırlamaya çalış.',
          parent:
            'Kendi önceliklerine odaklanması, çocuğunuzun kendi çalışma planını yapmasını kolaylaştırabilir. Tekrar günlerini önceden belirlemesi ve her tekrarda önce kitaba bakmadan hatırlamaya çalışması işine yarayabilir.',
          adult:
            'Kendi önceliklerine odaklanman, kendi öğrenme planını yapmanı kolaylaştırabilir. Tekrar günlerini önceden belirle (bir gün, bir hafta ve bir ay sonra gibi) ve her tekrarda önce kaynağa bakmadan hatırlamaya çalış.',
        },
      },
      action: {
        high: {
          student: 'Bu hafta birine yardım etmeden önce ona neye ihtiyacı olduğunu sor: bazen insanlar bir çözüm değil, yalnızca onları dinleyecek birini ister.',
          parent: 'Bu hafta çocuğunuza, birine yardım etmeden önce ona neye ihtiyacı olduğunu sormasını önerin: bazen insanlar bir çözüm değil, yalnızca onları dinleyecek birini ister.',
        },
        average: {
          student:
            'Bu hafta seninle farklı düşünen birini sözünü kesmeden dinle; sonra onun görüşünü kendi cümlelerinle ona söyle ve “Doğru mu anladım?” diye sor.',
          parent:
            'Bu hafta çocuğunuzla şunu deneyin: farklı düşündüğünüz bir konuda biriniz konuşurken öteki onun sözünü kesmeden dinlesin, sonra duyduğunu kendi cümleleriyle söyleyip doğru anlayıp anlamadığını sorsun.',
        },
        low: {
          student: 'Bu hafta her gün bir kişiye günün nasıl geçtiğini sor ve cevabını sonuna kadar dinle; sonra aklında kalan bir şeyi ona söyle.',
          parent: 'Bu hafta akşam yemeğinde çocuğunuzla her gün birbirinize günün nasıl geçtiğini sorun ve sırayla, birbirinizin sözünü kesmeden dinleyin.',
        },
      },
      settings: {
        high: 'İş birliğinin ve birbirine yardım etmenin değer gördüğü ortamlar',
        low: 'Kendi hedeflerine odaklanılabilen, görev ve sorumlulukların açık olduğu ortamlar',
      },
    },
    affective: {
      color: '#7a4ee6',
      study: {
        high: {
          student:
            'Duygularla kurduğun bağ öğrenmede de işine yarayabilir. Tarih ya da edebiyat gibi konularda, olayları yaşayan insanların ne hissetmiş olabileceğini düşün; sonra kitaba bakmadan olayların sırasını ve nedenlerini anlatmaya çalış.',
          parent:
            'Çocuğunuzun duygularla kurduğu bağ öğrenmede de işine yarayabilir. Tarih ya da edebiyat gibi konularda, olayları yaşayan insanların ne hissetmiş olabileceğini düşünüp sonra kitaba bakmadan olayların sırasını ve nedenlerini anlatmaya çalışabilir.',
          adult:
            'Duygularla kurduğun bağ öğrenmede de işine yarayabilir. Tarihle ya da bir hikâyeyle ilgili bir şey öğrenirken olayları yaşayan insanların ne hissetmiş olabileceğini düşün; sonra kaynağa bakmadan olayların sırasını ve nedenlerini anlatmaya çalış.',
        },
        average: {
          student:
            'Öğrendiğin bir konuyu gerçek hayattaki insanlarla ilişkilendir: her konudan sonra “Bu, kimin hayatında nasıl bir fark yaratır?” diye kendine sor ve cevabını kitaba bakmadan yaz.',
          parent:
            'Çocuğunuz öğrendiği bir konuyu gerçek hayattaki insanlarla ilişkilendirebilir: her konudan sonra “Bu, kimin hayatında nasıl bir fark yaratır?” diye kendine sorup cevabını kitaba bakmadan yazabilir.',
          adult:
            'Öğrendiğin bir konuyu gerçek hayattaki insanlarla ilişkilendir: her konudan sonra “Bu, kimin hayatında nasıl bir fark yaratır?” diye kendine sor ve cevabını kaynağa bakmadan yaz.',
        },
        low: {
          student:
            'Kendini sınamak herkes için etkili bir yöntemdir. Çalışırken gerçek sınava benzeyen denemeler yap: süre tut, kitabı kapat ve soruları çöz; sonra yanlışlarına bakıp onları birkaç gün sonra yeniden dene.',
          parent:
            'Gerçek sınava benzeyen denemeler (süre tutup kitabı kapatarak soru çözmek, birkaç gün sonra yanlışları yeniden denemek) çocuğunuza uygun olabilir; kendini sınamak herkes için etkili bir yöntemdir.',
          adult:
            'Kendini sınamak herkes için etkili bir yöntemdir. Öğrendiğini, gerçekte kullanacağın duruma benzeyen bir denemeyle sına (bir sunumu prova etmek ya da örnek soruları çözmek gibi): süre tut, kaynağı kapat ve baştan sona yap; sonra takıldığın yerleri birkaç gün sonra yeniden dene.',
        },
      },
      action: {
        high: {
          student:
            'Bu hafta seni çok etkileyen bir şey olduğunda duygunu bir sözcükle adlandır (“üzgünüm”, “kaygılıyım” gibi) ve sana iyi gelen bir şey yap: kısa bir yürüyüşe çıkmak, sevdiğin bir müziği dinlemek ya da güvendiğin biriyle konuşmak gibi.',
          parent:
            'Bu hafta çocuğunuza, onu çok etkileyen bir şey olduğunda duygusunu bir sözcükle adlandırmasını ve kendisine iyi gelen bir şey yapmasını önerin: kısa bir yürüyüşe çıkmak, sevdiği bir müziği dinlemek ya da güvendiği biriyle konuşmak gibi.',
        },
        average: {
          student: 'Bu hafta bir film izlerken ya da bir hikâye okurken bir karakterin ne hissettiğini ve neden öyle hissettiğini düşün; kısaca not et.',
          parent: 'Bu hafta çocuğunuzla bir film izleyin ya da bir hikâye okuyun ve bir karakterin ne hissettiğini, neden öyle hissettiğini birlikte tahmin edin.',
        },
        low: {
          student:
            'Bu hafta sohbet ettiğin insanların yüzüne ve ses tonuna dikkat et. Uygun bir anda “İyi misin?” diye sor ve onun cevabını kendi gözleminle karşılaştır.',
          parent:
            'Bu hafta çocuğunuzla bir oyun oynayın: bir fotoğraftaki ya da filmdeki insanın yüz ifadesine bakıp ne hissediyor olabileceğini sırayla tahmin edin.',
        },
      },
      settings: {
        high: 'İnsanlarla anlamlı bağların kurulduğu, duyguların konuşulabildiği ortamlar',
        low: 'Duyguların ön planda olmadığı, işin ve düzenin öne çıktığı ortamlar',
      },
    },
    warmth: {
      color: '#d28a14',
      study: {
        high: {
          student:
            'İnsanlarla birlikte olmak sana iyi geliyorsa bir çalışma buluşması ayarla: önce ikiniz de ayrı ayrı, kitaba bakmadan hatırladıklarınızı yazın; sonra yazdıklarınızı karşılaştırıp eksikleri tamamlayın.',
          parent:
            'İnsanlarla birlikte olmak çocuğunuza iyi geliyorsa bir arkadaşıyla çalışma buluşması işine yarayabilir: önce ikisi de ayrı ayrı, kitaba bakmadan hatırladıklarını yazar; sonra karşılaştırıp eksikleri tamamlarlar.',
          adult:
            'İnsanlarla birlikte olmak sana iyi geliyorsa aynı şeyi öğrenen biriyle buluş: önce ikiniz de ayrı ayrı, kaynağa bakmadan hatırladıklarınızı yazın; sonra yazdıklarınızı karşılaştırıp eksikleri tamamlayın.',
        },
        average: {
          student:
            'Bazen yalnız, bazen birlikte çalışmak sana uyabilir: yeni bir konuyu tek başına çalış; birkaç gün sonra bir arkadaşınla ikiniz de kitaba bakmadan konunun şemasını çizin ve şemalarınızı karşılaştırın.',
          parent:
            'Çocuğunuza bazen yalnız, bazen birlikte çalışmak uyabilir: yeni bir konuyu tek başına çalışabilir; birkaç gün sonra bir arkadaşıyla ikisi de kitaba bakmadan konunun şemasını çizip karşılaştırabilirler.',
          adult:
            'Bazen yalnız, bazen birlikte öğrenmek sana uyabilir: yeni bir konuyu tek başına çalış; birkaç gün sonra biriyle, ikiniz de kaynağa bakmadan konunun şemasını çizin ve karşılaştırın.',
        },
        low: {
          student:
            'Tek başına çalışmak sana daha rahat gelebilir. Kendine soru kartları hazırla: bir yüzüne soruyu, öbür yüzüne cevabı yaz; kartı çevirmeden önce cevabı söylemeye çalış.',
          parent:
            'Tek başına çalışmak çocuğunuza daha rahat gelebilir. Kendine soru kartları hazırlaması (bir yüzünde soru, öbür yüzünde cevap) ve kartı çevirmeden önce cevabı söylemeye çalışması işine yarayabilir.',
        },
      },
      action: {
        high: {
          student: 'Bu hafta bir grupta kenarda kalan birini fark et ve onu sohbete kat.',
          parent: 'Bu hafta çocuğunuzla, bir grupta kenarda kalan birini fark edip sohbete katmanın yollarını konuşun.',
        },
        average: {
          student: 'Bu hafta her gün bir kişiye içten bir teşekkür et; neye teşekkür ettiğini de söyle.',
          parent: 'Bu hafta çocuğunuz da dahil evde herkes her gün birine içten bir teşekkür etsin ve neye teşekkür ettiğini de söylesin.',
        },
        low: {
          student: 'Bu hafta değer verdiğin birine bunu küçük bir şeyle göster: kısa bir mesaj ya da bir yardım gibi.',
          parent: 'Bu hafta çocuğunuzu, değer verdiği bir kişiye bunu küçük bir şeyle göstermeye cesaretlendirin: kısa bir mesaj ya da küçük bir yardım gibi.',
        },
      },
      settings: {
        high: 'Sık sık bir araya gelinen, sıcak ve samimi ortamlar',
        low: 'Bağımsız çalışılabilen, sosyal beklentilerin az olduğu ortamlar',
      },
    },
  },
  sources: [KAYNAK.dunlosky, KAYNAK.roediger, KAYNAK.tedingVanBerkhout],
};
