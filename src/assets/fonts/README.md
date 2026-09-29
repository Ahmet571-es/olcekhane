# PDF raporlarının yazı tipleri

PDF raporları sunucuda üretilir ve yazı tiplerini bu klasörden okur (bkz. `src/lib/pdf/`). Web sitesindeki
yazı tiplerinin aynısıdır; Türkçe harflerin hepsini içeren tek parça TTF dosyalarıdır.

- `AtkinsonHyperlegibleNext-Regular.ttf`, `-Bold.ttf`: Google Fonts deposundaki değişken yazı tipinden
  (`ofl/atkinsonhyperlegiblenext/AtkinsonHyperlegibleNext[wght].ttf`) fontTools ile wght=400 ve 700
  örnekleri alınarak üretildi.
- `BricolageGrotesque-Bold.ttf`: `ofl/bricolagegrotesque/BricolageGrotesque[opsz,wdth,wght].ttf`
  dosyasından opsz=36, wdth=92, wght=700 örneği.

İkisi de SIL Open Font License 1.1 ile lisanslıdır (lisans metinleri bu klasörde).
