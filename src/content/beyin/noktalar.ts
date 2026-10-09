/**
 * Kemiklerin üzerindeki işaret noktaları: çıkıntı uçları, delik ve kanal ağızları, çukurlar, köşeler ve bölgeler.
 * Koordinatlar üç boyutlu modelin kendi koordinatlarıdır (mm; X sol, Y yukarı, Z ön; merkez beynin ortası; sürüm
 * `model-surum.ts`). Her nokta modelin kemik ağı üzerinde ölçülerek bulundu ve en az iki bakıştan çizilip denetlendi.
 * Model sadeleştirilmiş olduğundan ağda görünmeyen küçük delikler (ör. foramen spinosum, göz üstü deliği,
 * pterigoid kanal) buraya konmadı. Delik noktası deliğin ağzının ortasında, ağız kenarının hizasındadır; bölge
 * noktası bölgenin ortasındadır. Model yeniden üretilirse `tests/beyin.test.ts` her noktanın kendi kemiğinin
 * yüzeyine yakın kaldığını denetler.
 */

export type NoktaTuru = 'uc' | 'delik' | 'cukur' | 'bolge' | 'kose' | 'kenar';

export interface IsaretNoktasi {
  id: string;
  /** Etikette görünen kısa Türkçe ad. */
  ad: string;
  latince: string;
  /** Noktanın bulunduğu kemiğin yapı kimliği (`yapilar.ts`). */
  yapi: string;
  konum: [number, number, number];
  tur: NoktaTuru;
}

function n(id: string, ad: string, latince: string, yapi: string, konum: [number, number, number], tur: NoktaTuru): IsaretNoktasi {
  return { id, ad, latince, yapi, konum, tur };
}

export const NOKTALAR: IsaretNoktasi[] = [
  // alin-kemigi
  n('glabella', 'Glabella', 'Glabella', 'alin-kemigi', [0, 3, 97.6], 'bolge'),
  n('nasion', 'Nasion', 'Nasion', 'alin-kemigi', [0, -15, 94.4], 'kose'),
  n('supraorbital-kenar-sol', 'Göz çukuru üst kenarı', 'Margo supraorbitalis', 'alin-kemigi', [36, -6.1, 86.9], 'kenar'),
  n('alin-elmacik-cikintisi-sol', 'Elmacık çıkıntısı', 'Processus zygomaticus ossis frontalis', 'alin-kemigi', [41.4, -18.9, 62.9], 'uc'),
  n('alin-tumsegi-sol', 'Alın tümseği', 'Tuber frontale', 'alin-kemigi', [31.4, 23.9, 92.3], 'bolge'),
  n('kas-kemeri-sol', 'Kaş kemeri', 'Arcus superciliaris', 'alin-kemigi', [20, 0, 94.9], 'bolge'),
  n('orbita-tavani-sol', 'Göz çukuru tavanı', 'Pars orbitalis ossis frontalis', 'alin-kemigi', [31, -3.9, 70], 'bolge'),
  n('alin-kristasi', 'Alın kristası', 'Crista frontalis', 'alin-kemigi', [0, 5, 84.7], 'kenar'),
  n('sakak-cizgisi-alin-sol', 'Şakak çizgisi', 'Linea temporalis ossis frontalis', 'alin-kemigi', [58.8, 8, 62.5], 'kenar'),
  n('alin-burun-dikeni', 'Burun dikeni', 'Spina nasalis ossis frontalis', 'alin-kemigi', [0, -23.8, 90], 'uc'),
  // yan-kafa-kemigi-sol
  n('yan-kafa-tumsegi-sol', 'Yan kafa tümseği', 'Tuber parietale', 'yan-kafa-kemigi-sol', [64.8, 55, -29], 'bolge'),
  n('yan-kafa-alin-kosesi-sol', 'Alın köşesi (bregma)', 'Angulus frontalis', 'yan-kafa-kemigi-sol', [0, 82.2, 31], 'kose'),
  n('yan-kafa-art-kafa-kosesi-sol', 'Art kafa köşesi (lambda)', 'Angulus occipitalis', 'yan-kafa-kemigi-sol', [-0.2, 36.2, -89], 'kose'),
  n('yan-kafa-kama-kosesi-sol', 'Kama köşesi (pterion)', 'Angulus sphenoidalis', 'yan-kafa-kemigi-sol', [54.2, 1.5, 50.5], 'kose'),
  n('yan-kafa-mastoid-kosesi-sol', 'Mastoid köşesi (asterion)', 'Angulus mastoideus', 'yan-kafa-kemigi-sol', [62.4, -29.5, -44], 'kose'),
  n(
    'orta-meninks-oluk-sol',
    'Orta meninks arteri oluğu',
    'Sulcus arteriae meningeae mediae',
    'yan-kafa-kemigi-sol',
    [65.1, 24, 23.5],
    'cukur',
  ),
  // sakak-kemigi-sol
  n('sakak-pul-kismi-sol', 'Pul kısmı', 'Pars squamosa', 'sakak-kemigi-sol', [67.9, -17, 5], 'bolge'),
  n(
    'sakak-elmacik-cikintisi-sol',
    'Elmacık çıkıntısı',
    'Processus zygomaticus ossis temporalis',
    'sakak-kemigi-sol',
    [56.7, -40.6, 53.9],
    'uc',
  ),
  n('eklem-tumsegi-sol', 'Eklem tümseği', 'Tuberculum articulare', 'sakak-kemigi-sol', [52, -42.9, 25.5], 'uc'),
  n('cene-eklem-cukuru-sol', 'Çene eklem çukuru', 'Fossa mandibularis', 'sakak-kemigi-sol', [49.6, -39, 14.5], 'cukur'),
  n('dis-kulak-yolu-sol', 'Dış kulak yolu', 'Porus acusticus externus', 'sakak-kemigi-sol', [53.5, -43.4, 4], 'delik'),
  n('suprameatal-ucgen-sol', 'Macewen üçgeni', 'Foveola suprameatica', 'sakak-kemigi-sol', [60.3, -37.5, -2], 'bolge'),
  n('mastoid-cikinti-sol', 'Mastoid çıkıntı', 'Processus mastoideus', 'sakak-kemigi-sol', [57.2, -58.7, -9.6], 'uc'),
  n('mastoid-centigi-sol', 'Mastoid çentik', 'Incisura mastoidea', 'sakak-kemigi-sol', [52.2, -55.2, -12], 'cukur'),
  n('stiloid-cikinti-sol', 'Stiloid çıkıntı', 'Processus styloideus', 'sakak-kemigi-sol', [40.1, -72, 8.3], 'uc'),
  n('stilomastoid-delik-sol', 'Stilomastoid delik', 'Foramen stylomastoideum', 'sakak-kemigi-sol', [47, -53, -2], 'delik'),
  n('kayalik-tepe-sol', 'Kayalık kısmın tepesi', 'Apex partis petrosae', 'sakak-kemigi-sol', [12.8, -38.9, 15.2], 'uc'),
  n('arkuat-kabariklik-sol', 'Arkuat kabarıklık', 'Eminentia arcuata', 'sakak-kemigi-sol', [40.6, -25.7, -4.6], 'uc'),
  n('ic-kulak-yolu-sol', 'İç kulak yolu', 'Porus acusticus internus', 'sakak-kemigi-sol', [23.7, -36.4, -1.1], 'delik'),
  n('juguler-cukur-sol', 'Juguler çukur', 'Fossa jugularis', 'sakak-kemigi-sol', [34.5, -44.7, -5.5], 'cukur'),
  n(
    'karotis-kanali-dis-agzi-sol',
    'Karotis kanalının ağzı',
    'Apertura externa canalis carotici',
    'sakak-kemigi-sol',
    [30, -48.6, 5.5],
    'delik',
  ),
  n('sigmoid-olugu-sol', 'Sigmoid sinüs oluğu', 'Sulcus sinus sigmoidei', 'sakak-kemigi-sol', [55.9, -40.1, -21.7], 'cukur'),
  // art-kafa-kemigi
  n(
    'dis-art-kafa-cikintisi',
    'Dış art kafa çıkıntısı (inion)',
    'Protuberantia occipitalis externa',
    'art-kafa-kemigi',
    [0, -46.5, -78.2],
    'uc',
  ),
  n('art-kafa-pul-kismi', 'Pul kısmı', 'Squama occipitalis', 'art-kafa-kemigi', [20, 10, -96.3], 'bolge'),
  n('buyuk-delik', 'Foramen magnum', 'Foramen magnum', 'art-kafa-kemigi', [0, -61.3, -20.7], 'delik'),
  n('bazion', 'Bazion', 'Basion', 'art-kafa-kemigi', [0, -58.4, -1], 'kenar'),
  n('opistion', 'Opistion', 'Opisthion', 'art-kafa-kemigi', [0, -64.3, -40.4], 'kenar'),
  n('art-kafa-kondili-sol', 'Kondil', 'Condylus occipitalis', 'art-kafa-kemigi', [21.5, -68.6, -13], 'uc'),
  n('art-kafa-kondili-sag', 'Kondil', 'Condylus occipitalis', 'art-kafa-kemigi', [-21.5, -68.6, -13], 'uc'),
  n('hipoglossal-kanal-sol', 'Hipoglossal kanal', 'Canalis nervi hypoglossi', 'art-kafa-kemigi', [23.7, -54.7, -4], 'delik'),
  n('kondil-cukuru-sol', 'Kondil çukuru', 'Fossa condylaris', 'art-kafa-kemigi', [31.5, -59.2, -23.5], 'cukur'),
  n('juguler-cikinti-sol', 'Juguler çıkıntı', 'Processus jugularis', 'art-kafa-kemigi', [38.5, -57.5, -6], 'uc'),
  n('klivus', 'Klivus', 'Clivus', 'art-kafa-kemigi', [0, -36.6, 10], 'bolge'),
  n('ic-art-kafa-cikintisi', 'İç art kafa çıkıntısı', 'Protuberantia occipitalis interna', 'art-kafa-kemigi', [0, -38.6, -69.5], 'uc'),
  n('enine-sinus-olugu-sol', 'Enine sinüs oluğu', 'Sulcus sinus transversi', 'art-kafa-kemigi', [44, -34.5, -61], 'cukur'),
  // kama-kemigi
  n('kama-govdesi', 'Gövde', 'Corpus ossis sphenoidalis', 'kama-kemigi', [0, -44.1, 25], 'bolge'),
  n('turk-eyeri', 'Türk eyeri (sella)', 'Sella turcica', 'kama-kemigi', [0, -26.2, 25.5], 'cukur'),
  n('eyer-tumsegi', 'Eyer tümseği', 'Tuberculum sellae', 'kama-kemigi', [0, -17.3, 32.6], 'kenar'),
  n('eyer-sirti', 'Eyer sırtı', 'Dorsum sellae', 'kama-kemigi', [0, -17.8, 16.6], 'kenar'),
  n('arka-klinoid-sol', 'Arka klinoid çıkıntı', 'Processus clinoideus posterior', 'kama-kemigi', [6.2, -17.3, 16.2], 'uc'),
  n('on-klinoid-sol', 'Ön klinoid çıkıntı', 'Processus clinoideus anterior', 'kama-kemigi', [13.7, -16.7, 28.4], 'uc'),
  n('optik-kanal-sol', 'Optik kanal', 'Canalis opticus', 'kama-kemigi', [15, -18.8, 46], 'delik'),
  n('ust-orbital-yarik-sol', 'Üst orbital yarık', 'Fissura orbitalis superior', 'kama-kemigi', [20.5, -18.6, 42.6], 'delik'),
  n('yuvarlak-delik-sol', 'Yuvarlak delik', 'Foramen rotundum', 'kama-kemigi', [17.2, -27.6, 39.3], 'delik'),
  n('oval-delik-sol', 'Oval delik', 'Foramen ovale', 'kama-kemigi', [24.6, -38.6, 21.7], 'delik'),
  n('kucuk-kanat-sol', 'Küçük kanat', 'Ala minor ossis sphenoidalis', 'kama-kemigi', [27, -9.5, 44], 'bolge'),
  n('buyuk-kanat-beyin-yuzu-sol', 'Büyük kanat, beyin yüzü', 'Facies cerebralis alae majoris', 'kama-kemigi', [36, -35.5, 30], 'bolge'),
  n('buyuk-kanat-sakak-yuzu-sol', 'Büyük kanat, şakak yüzü', 'Facies temporalis alae majoris', 'kama-kemigi', [52.1, -10, 46], 'bolge'),
  n('pterigoid-dis-levha-sol', 'Pterigoid dış levha', 'Lamina lateralis processus pterygoidei', 'kama-kemigi', [26.7, -57, 38], 'bolge'),
  n('pterigoid-ic-levha-sol', 'Pterigoid iç levha', 'Lamina medialis processus pterygoidei', 'kama-kemigi', [13.5, -58, 39.6], 'kenar'),
  n('pterigoid-cengel-sol', 'Pterigoid çengel', 'Hamulus pterygoideus', 'kama-kemigi', [13.7, -68.6, 41.4], 'uc'),
  n('kama-kristasi', 'Kama kristası', 'Crista sphenoidalis', 'kama-kemigi', [0, -28, 46], 'kenar'),
  n('kama-dikeni-sol', 'Kama dikeni', 'Spina ossis sphenoidalis', 'kama-kemigi', [32.1, -53.1, 17.4], 'uc'),
  // kalbur-kemigi
  n('horoz-ibigi', 'Horoz ibiği (crista galli)', 'Crista galli', 'kalbur-kemigi', [0.1, -15.2, 73.8], 'uc'),
  n('kalbur-levha-sol', 'Kalbur levha', 'Lamina cribrosa ossis ethmoidalis', 'kalbur-kemigi', [4.5, -26.7, 62], 'bolge'),
  n('dik-levha', 'Dik levha', 'Lamina perpendicularis ossis ethmoidalis', 'kalbur-kemigi', [0, -37, 84.4], 'bolge'),
  n('goz-cukuru-levhasi-sol', 'Göz çukuru levhası', 'Lamina orbitalis ossis ethmoidalis', 'kalbur-kemigi', [15.2, -33, 62], 'bolge'),
  n('orta-burun-kavkasi-sol', 'Orta burun kavkası', 'Concha nasalis media', 'kalbur-kemigi', [6, -48.6, 62], 'bolge'),
  n('kalbur-labirenti-sol', 'Kalbur labirenti', 'Labyrinthus ethmoidalis', 'kalbur-kemigi', [9, -29, 76.1], 'bolge'),
  // ust-cene-kemigi-sol
  n('ust-cene-govdesi-sol', 'Gövde', 'Corpus maxillae', 'ust-cene-kemigi-sol', [31, -62, 78.7], 'bolge'),
  n('ust-cene-alin-cikintisi-sol', 'Alın çıkıntısı', 'Processus frontalis maxillae', 'ust-cene-kemigi-sol', [8, -17, 90.9], 'uc'),
  n(
    'ust-cene-elmacik-cikintisi-sol',
    'Elmacık çıkıntısı',
    'Processus zygomaticus maxillae',
    'ust-cene-kemigi-sol',
    [43.5, -65, 71.6],
    'uc',
  ),
  n(
    'ust-cene-dis-yuvasi-cikintisi-sol',
    'Diş yuvası çıkıntısı',
    'Processus alveolaris maxillae',
    'ust-cene-kemigi-sol',
    [31.3, -76.5, 73],
    'bolge',
  ),
  n('ust-cene-damak-cikintisi-sol', 'Damak çıkıntısı', 'Processus palatinus maxillae', 'ust-cene-kemigi-sol', [8, -72.7, 76], 'bolge'),
  n('goz-alti-deligi-sol', 'Göz altı deliği', 'Foramen infraorbitale', 'ust-cene-kemigi-sol', [27.6, -55.5, 81.6], 'delik'),
  n('goz-alti-kenari-sol', 'Göz altı kenarı', 'Margo infraorbitalis', 'ust-cene-kemigi-sol', [23, -47.2, 82.9], 'kenar'),
  n('ust-cene-goz-cukuru-yuzu-sol', 'Göz çukuru yüzü', 'Facies orbitalis maxillae', 'ust-cene-kemigi-sol', [28, -45, 66], 'bolge'),
  n('on-burun-dikeni', 'Ön burun dikeni', 'Spina nasalis anterior', 'ust-cene-kemigi-sol', [0.4, -68.9, 99.4], 'uc'),
  n('ust-cene-yumrusu-sol', 'Üst çene yumrusu', 'Tuber maxillae', 'ust-cene-kemigi-sol', [30.2, -73.2, 53.8], 'bolge'),
  n('kopek-disi-cukuru-sol', 'Köpek dişi çukuru', 'Fossa canina', 'ust-cene-kemigi-sol', [22, -63.5, 85], 'cukur'),
  n('kesici-delik', 'Kesici delik', 'Foramen incisivum', 'ust-cene-kemigi-sol', [0.3, -79.6, 91.6], 'delik'),
  n('ust-cene-sinusu-acikligi-sol', 'Sinüs açıklığı (hiatus)', 'Hiatus maxillaris', 'ust-cene-kemigi-sol', [15.8, -54.5, 65], 'delik'),
  n('burun-centigi-sol', 'Burun çentiği', 'Incisura nasalis maxillae', 'ust-cene-kemigi-sol', [13.8, -57.5, 92], 'kenar'),
  // elmacik-kemigi-sol
  n('elmacik-govdesi-sol', 'Gövde (yanak çıkıntısı)', 'Os zygomaticum, facies lateralis', 'elmacik-kemigi-sol', [51.2, -50, 69.7], 'bolge'),
  n(
    'elmacik-alin-cikintisi-sol',
    'Alın çıkıntısı',
    'Processus frontalis ossis zygomatici',
    'elmacik-kemigi-sol',
    [51.8, -12.3, 73.6],
    'uc',
  ),
  n(
    'elmacik-sakak-cikintisi-sol',
    'Şakak çıkıntısı',
    'Processus temporalis ossis zygomatici',
    'elmacik-kemigi-sol',
    [63.4, -49.2, 43.5],
    'uc',
  ),
  n('elmacik-goz-kenari-sol', 'Göz çukuru kenarı', 'Margo orbitalis', 'elmacik-kemigi-sol', [48.6, -42.3, 72.7], 'kenar'),
  // burun-kemigi-sol
  n('burun-kemigi-bolgesi-sol', 'Burun kemiği', 'Os nasale', 'burun-kemigi-sol', [3.2, -30, 103], 'bolge'),
  // gozyasi-kemigi-sol
  n('gozyasi-kemigi-bolgesi-sol', 'Gözyaşı kemiği', 'Os lacrimale', 'gozyasi-kemigi-sol', [13.7, -31, 79], 'bolge'),
  n('gozyasi-olugu-sol', 'Gözyaşı kesesi çukuru', 'Fossa sacci lacrimalis', 'gozyasi-kemigi-sol', [14, -43, 81.5], 'cukur'),
  n('arka-gozyasi-sirti-sol', 'Arka gözyaşı sırtı', 'Crista lacrimalis posterior', 'gozyasi-kemigi-sol', [17.2, -43, 78.4], 'kenar'),
  // damak-kemigi-sol
  n('damak-kemigi-yatay-plak-sol', 'Yatay plak', 'Lamina horizontalis ossis palatini', 'damak-kemigi-sol', [6, -71.9, 58], 'bolge'),
  n('damak-kemigi-dik-plak-sol', 'Dik plak', 'Lamina perpendicularis ossis palatini', 'damak-kemigi-sol', [10.6, -56, 56], 'bolge'),
  n('piramit-cikinti-sol', 'Piramit çıkıntı', 'Processus pyramidalis ossis palatini', 'damak-kemigi-sol', [23.9, -73.3, 47.4], 'uc'),
  n(
    'damak-kemigi-goz-cukuru-cikintisi-sol',
    'Göz çukuru çıkıntısı',
    'Processus orbitalis ossis palatini',
    'damak-kemigi-sol',
    [16, -37.9, 47],
    'uc',
  ),
  // sapan-kemigi
  n('sapan-kemigi-bolgesi', 'Sapan kemiği', 'Vomer', 'sapan-kemigi', [0.4, -58, 65], 'bolge'),
  n('sapan-kemigi-kanadi-sol', 'Sapan kanadı', 'Ala vomeris', 'sapan-kemigi', [5.2, -39.3, 38], 'uc'),
  n('sapan-kemigi-arka-kenari', 'Arka serbest kenar', 'Margo posterior vomeris', 'sapan-kemigi', [0.6, -57, 41.6], 'kenar'),
  // alt-burun-kavkasi-sol
  n('alt-burun-kavkasi-bolgesi-sol', 'Alt burun kavkası', 'Concha nasalis inferior', 'alt-burun-kavkasi-sol', [6.1, -58, 76], 'bolge'),
  // alt-cene-kemigi
  n('kondil-basi-sol', 'Kondil başı', 'Caput mandibulae', 'alt-cene-kemigi', [44.5, -41.4, 15], 'uc'),
  n('kondil-boynu-sol', 'Kondil boynu', 'Collum mandibulae', 'alt-cene-kemigi', [50.3, -56, 19], 'bolge'),
  n('koronoid-cikinti-sol', 'Koronoid çıkıntı', 'Processus coronoideus', 'alt-cene-kemigi', [44.2, -53.1, 54.8], 'uc'),
  n('alt-cene-centigi-sol', 'Mandibula çentiği', 'Incisura mandibulae', 'alt-cene-kemigi', [44, -62.6, 40.4], 'kenar'),
  n('alt-cene-acisi-sol', 'Açı (gonion)', 'Angulus mandibulae', 'alt-cene-kemigi', [40.2, -95.6, 22], 'kose'),
  n('alt-cene-dali-sol', 'Dal (ramus)', 'Ramus mandibulae', 'alt-cene-kemigi', [45, -81, 30], 'bolge'),
  n('alt-cene-govdesi-sol', 'Gövde', 'Corpus mandibulae', 'alt-cene-kemigi', [35, -111, 60], 'bolge'),
  n('cene-deligi-sol', 'Çene deliği (mentale)', 'Foramen mentale', 'alt-cene-kemigi', [23.1, -110.9, 78], 'delik'),
  n('cene-cikintisi', 'Çene çıkıntısı', 'Protuberantia mentalis', 'alt-cene-kemigi', [0, -118.5, 92.7], 'uc'),
  n('alt-cene-simfizi', 'Simfiz', 'Symphysis mandibulae', 'alt-cene-kemigi', [0, -109.5, 91.1], 'bolge'),
  n('alveol-kismi-sol', 'Diş yuvaları (alveol)', 'Pars alveolaris', 'alt-cene-kemigi', [28.7, -102.5, 72], 'bolge'),
  n('alt-cene-deligi-sol', 'Mandibular delik', 'Foramen mandibulae', 'alt-cene-kemigi', [37.2, -77, 30.5], 'delik'),
  n('lingula-sol', 'Lingula', 'Lingula mandibulae', 'alt-cene-kemigi', [35.4, -79.5, 33.6], 'uc'),
  n('milohyoid-cizgi-sol', 'Milohyoid çizgi', 'Linea mylohyoidea', 'alt-cene-kemigi', [18.9, -104.5, 60], 'kenar'),
  // dil-kemigi
  n('dil-kemigi-govdesi', 'Gövde', 'Corpus ossis hyoidei', 'dil-kemigi', [0, -120, 48], 'bolge'),
  n('dil-kemigi-buyuk-boynuz-sol', 'Büyük boynuz', 'Cornu majus ossis hyoidei', 'dil-kemigi', [17.3, -108.6, 14.8], 'uc'),
  n('dil-kemigi-kucuk-boynuz-sol', 'Küçük boynuz', 'Cornu minus ossis hyoidei', 'dil-kemigi', [13.4, -111.8, 42.2], 'uc'),
  // atlas
  n('atlas-on-kemer', 'Ön kemer', 'Arcus anterior atlantis', 'atlas', [6, -76, 4.9], 'bolge'),
  n('atlas-on-tuberkul', 'Ön tüberkül', 'Tuberculum anterius atlantis', 'atlas', [0, -78, 7.9], 'uc'),
  n('atlas-arka-kemer-sol', 'Arka kemer', 'Arcus posterior atlantis', 'atlas', [11, -78, -32.8], 'bolge'),
  n('atlas-arka-tuberkul', 'Arka tüberkül', 'Tuberculum posterius atlantis', 'atlas', [0, -79.8, -38.9], 'uc'),
  n('atlas-yan-kitle-sol', 'Yan kitle', 'Massa lateralis atlantis', 'atlas', [17, -75, 1.6], 'bolge'),
  n('atlas-ust-eklem-yuzu-sol', 'Üst eklem yüzü', 'Facies articularis superior atlantis', 'atlas', [15.5, -70.9, -7.5], 'cukur'),
  n('atlas-enine-cikinti-sol', 'Enine çıkıntı', 'Processus transversus atlantis', 'atlas', [41, -78.7, -10.2], 'uc'),
  n('atlas-enine-delik-sol', 'Enine delik', 'Foramen transversarium', 'atlas', [28, -74.8, -8.1], 'delik'),
  n('atlas-dens-eklem-yuzu', 'Dens eklem yüzü', 'Fovea dentis', 'atlas', [0, -74, 2.4], 'cukur'),
  // aksis
  n('aksis-dens-tepesi', 'Dens (dişsi çıkıntı)', 'Dens axis', 'aksis', [0, -69.2, -4.5], 'uc'),
  n('aksis-govdesi', 'Gövde', 'Corpus axis', 'aksis', [0, -92, 5.3], 'bolge'),
  n('aksis-diken-cikinti-ucu', 'Diken çıkıntı (çatallı)', 'Processus spinosus axis', 'aksis', [0, -111, -42.7], 'uc'),
  n('aksis-ust-eklem-yuzu-sol', 'Üst eklem yüzü', 'Facies articularis superior axis', 'aksis', [15.5, -85.4, -6], 'bolge'),
  n('aksis-enine-delik-sol', 'Enine delik', 'Foramen transversarium', 'aksis', [18.6, -95.6, -7.1], 'delik'),
  n('aksis-lamina-sol', 'Lamina', 'Lamina arcus vertebrae', 'aksis', [7, -101, -28.8], 'bolge'),
];

export function noktaById(id: string): IsaretNoktasi | undefined {
  return NOKTALAR.find((p) => p.id === id);
}
