#!/usr/bin/env python3
"""Bir işlemenin yayın durumunu GitHub Actions'tan okur: Denetim → Yayın (ve varsa Kurulum provası).

Kullanım (herhangi bir klasörden):
  python3 araclar/yayin-durumu.py                  şimdiki işleme (HEAD) için bir kez bakar
  python3 araclar/yayin-durumu.py --bekle          hepsi bitene kadar bekler (en çok 9 dakika)
  python3 araclar/yayin-durumu.py <işleme> --bekle --sure 15

Beklerken Bash aracının zaman aşımı 600000 ms verilir. Çalışma kayıtları (loglar) bu ortamdan indirilemediği için iş
akışlarının özet notları (check-run annotations) yazdırılır; hatalar ve sitenin dışarıdan sınanması bu notlardadır.
En sondaki SONUÇ satırı ne yapılacağını söyler.

Çıkış kodu:
  0  yayında: Denetim ve Yayın başarılı, sunucudaki sürüm bu işleme, site dışarıdan sınandı
  1  hata: notlara bakılır (SONUÇ satırı sorunun kodda mı, sunucuda ya da ayarlarda mı olduğunu söyler)
  2  henüz bitmedi: aynı komut yeniden çalıştırılır
  3  bu işleme için sonuç alınamadı: GitHub'a ulaşılamadı, işleme main'de değil ya da çalışması daha yeni bir
     gönderim yüzünden durduruldu (SONUÇ satırındaki komut çalıştırılır)
"""
import argparse
import json
import os
import re
import subprocess
import sys
import time
from pathlib import Path

# (iş akışı dosyası, tetikleyen olay, görünen ad)
AKISLAR = [
    ('denetim.yml', 'push', 'Denetim'),
    ('prova.yml', 'push', 'Kurulum provası'),
    ('yayin.yml', 'workflow_run', 'Yayın'),
]
SONUC_ADI = {
    'success': 'başarılı',
    'failure': 'BAŞARISIZ',
    'cancelled': 'durduruldu',
    'skipped': 'atlandı',
    'timed_out': 'süre aşımı',
    'action_required': 'onay bekliyor',
    'neutral': 'nötr',
    'stale': 'eskidi',
    'startup_failure': 'başlatılamadı',
}
DURUM_ADI = {'queued': 'sırada', 'in_progress': 'çalışıyor', 'waiting': 'bekliyor', 'pending': 'bekliyor', 'requested': 'sırada'}
YOKLAMA_ARALIGI = 20  # saniye


class GitHubHatasi(Exception):
    pass


def calistir(komut):
    try:
        return subprocess.run(komut, capture_output=True, text=True, timeout=60)
    except (FileNotFoundError, subprocess.TimeoutExpired):
        return None


def git(*arg):
    p = calistir(['git', *arg])
    return p.stdout.strip() if p and p.returncode == 0 else ''


def api(yol):
    """GitHub REST isteği. Önce oturumun gh istemcisi, olmazsa curl; ikisi de oturumun vekil sunucusundan geçer
    ve kimlik bilgisini vekil ekler (depoda ya da sohbette hiçbir anahtar tutulmaz)."""
    denemeler = [
        ['gh', 'api', yol],
        ['curl', '-sS', '-f', '-m', '30', '-H', 'Accept: application/vnd.github+json', 'https://api.github.com/' + yol],
    ]
    for komut in denemeler:
        p = calistir(komut)
        if p is None or p.returncode != 0 or not p.stdout.strip():
            continue
        try:
            return json.loads(p.stdout)
        except json.JSONDecodeError:
            continue
    raise GitHubHatasi(yol)


def depo_adi():
    m = re.search(r'github\.com[/:]([^/]+)/([^/]+?)(?:\.git)?/?$', git('remote', 'get-url', 'origin'))
    return f'{m.group(1)}/{m.group(2)}' if m else 'Ahmet571-es/olcekhane'


def site_adresi():
    try:
        with open('yayin/ayarlar.env', encoding='utf-8') as f:
            for satir in f:
                if satir.startswith('SITE_DOMAIN='):
                    alan = satir.split('=', 1)[1].strip().strip('\'"')
                    if alan:
                        return 'https://' + alan
    except OSError:
        pass
    return 'https://olcekhane.com'


def sure_yazi(r):
    try:
        bas = time.mktime(time.strptime(r['run_started_at'], '%Y-%m-%dT%H:%M:%SZ'))
        son = time.mktime(time.strptime(r['updated_at'], '%Y-%m-%dT%H:%M:%SZ'))
    except (KeyError, TypeError, ValueError):
        return ''
    s = max(0, int(son - bas))
    return f'{s // 60} dk {s % 60:02d} sn'


def son_calisma(depo, dosya, olay, sha):
    d = api(f'repos/{depo}/actions/workflows/{dosya}/runs?head_sha={sha}&event={olay}&per_page=20')
    return max(d.get('workflow_runs') or [], key=lambda r: r['id'], default=None)


def durum_metni(r):
    if r is None:
        return 'yok'
    if r['status'] != 'completed':
        return DURUM_ADI.get(r['status'], r['status'])
    return SONUC_ADI.get(r['conclusion'], r['conclusion'] or '?')


def notlar(depo, r):
    """Bir çalışmanın işlerindeki özet notlar ve başarısız adımlar: (düzey, başlık, ileti)."""
    satirlar = []
    for j in api(f'repos/{depo}/actions/runs/{r["id"]}/jobs?per_page=50').get('jobs') or []:
        for adim in j.get('steps') or []:
            if adim.get('conclusion') == 'failure':
                satirlar.append(('failure', 'Başarısız adım', f'{j["name"]} → {adim["name"]}'))
        try:
            # GitHub notları sondan başa verir; yazıldıkları sırayla gösterilir.
            for a in reversed(api(f'repos/{depo}/check-runs/{j["id"]}/annotations?per_page=100')):
                mesaj = (a.get('message') or '').replace('\r', '').strip()
                satirlar.append((a.get('annotation_level') or '?', a.get('title') or '', mesaj))
        except GitHubHatasi:
            satirlar.append(('warning', 'Notlar okunamadı', j['name']))
    return satirlar


def bitti_mi(c):
    """Beklemeye gerek kalmadı mı? c: ad → çalışma."""
    den, prova, yay = c['Denetim'], c['Kurulum provası'], c['Yayın']
    if den is None or den['status'] != 'completed':
        return False
    if prova is not None and prova['status'] != 'completed':
        return False
    if den['conclusion'] != 'success':
        return True
    return yay is not None and yay['status'] == 'completed'


def yazdir(ad, r, ns):
    if r is None:
        neden = ' (sunucu ve yayın dosyaları değişmedi)' if ad == 'Kurulum provası' else ''
        print(f'{ad:<16} çalışmadı{neden}')
        return
    print(f'{ad:<16} {durum_metni(r):<13} {sure_yazi(r)}')
    if r['conclusion'] != 'success':
        print(f'                 {r.get("html_url", "")}')
    for duzey, baslik, mesaj in ns:
        # Başarılı Denetim ve provada yalnızca uyarı ve hatalar; Yayın'ın bütün notları (sitenin durumu) gösterilir.
        if ad != 'Yayın' and r['conclusion'] == 'success' and duzey == 'notice':
            continue
        if duzey == 'failure':
            # Hata notları kısaltılmaz: "Hata ayrıntıları" adımları kaydın son satırlarını buraya yazar.
            print(f'  {duzey:<8} | {baslik} |')
            for satir in mesaj.split('\n'):
                print(f'             {satir}')
        else:
            print(f'  {duzey:<8} | {baslik} | {mesaj.replace(chr(10), " / ")[:400]}')


def main():
    os.chdir(Path(__file__).resolve().parents[1])
    ap = argparse.ArgumentParser(description='Bir işlemenin Denetim ve Yayın sonucunu gösterir.')
    ap.add_argument('isleme', nargs='?', default='HEAD', help='işleme (varsayılan: HEAD)')
    ap.add_argument('--bekle', action='store_true', help='iş akışları bitene kadar bekle')
    ap.add_argument('--sure', type=float, default=9, help='en çok kaç dakika beklensin (varsayılan 9)')
    arg = ap.parse_args()

    sha = git('rev-parse', '--verify', '--quiet', arg.isleme + '^{commit}')
    if not sha:
        print(f'SONUÇ: İşleme bulunamadı: {arg.isleme}')
        return 3
    print(f'İşleme {sha[:7]}: {git("log", "-1", "--format=%s", sha)}')

    calistir(['git', 'fetch', '-q', 'origin', 'main'])
    p = calistir(['git', 'merge-base', '--is-ancestor', sha, 'origin/main'])
    if not p or p.returncode != 0:
        print("SONUÇ: Bu işleme main'de değil. Önce gönderin: git pull --rebase origin main && git push origin HEAD:main")
        return 3
    son_main = git('rev-parse', 'origin/main')
    daha_yeni = f'python3 araclar/yayin-durumu.py {son_main[:7]} --bekle'

    depo = depo_adi()
    baslangic = time.time()
    bitis = baslangic + arg.sure * 60
    onceki = None
    while True:
        try:
            c = {ad: son_calisma(depo, dosya, olay, sha) for dosya, olay, ad in AKISLAR}
        except GitHubHatasi as e:
            print(f'SONUÇ: GitHub API okunamadı ({e}); gh api ve curl ikisi de başarısız oldu. Biraz sonra yeniden deneyin.')
            return 3
        ozet = '  ·  '.join(f'{ad}: {durum_metni(c[ad])}' for _, _, ad in AKISLAR)
        if ozet != onceki:
            print(f'[{int(time.time() - baslangic):>4} sn] {ozet}', flush=True)
            onceki = ozet
        if bitti_mi(c):
            break
        if c['Denetim'] is None and time.time() - baslangic > 120:
            if son_main and son_main != sha:
                print('SONUÇ: Bu işleme için çalışma yok: iş akışları yalnızca bir gönderimin son işlemesi için çalışır. '
                      f"main'in son işlemesine bakın: {daha_yeni}")
            else:
                print('SONUÇ: Gönderimden bu yana 2 dakikadır Denetim başlamadı. GitHub Actions gecikiyor olabilir; '
                      'birkaç dakika sonra yeniden çalıştırın.')
            return 3
        if not arg.bekle or time.time() + YOKLAMA_ARALIGI + 10 > bitis:
            print('SONUÇ: Henüz bitmedi. Aynı komutu yeniden çalıştırın.')
            return 2
        time.sleep(YOKLAMA_ARALIGI)

    print()
    hepsi = {}
    for _, _, ad in AKISLAR:
        try:
            hepsi[ad] = notlar(depo, c[ad]) if c[ad] else []
        except GitHubHatasi:
            hepsi[ad] = [('warning', 'Notlar okunamadı', ad)]
        yazdir(ad, c[ad], hepsi[ad])
    print()

    den, prova, yay = c['Denetim'], c['Kurulum provası'], c['Yayın']
    if den['conclusion'] == 'cancelled' or (yay and yay['conclusion'] == 'cancelled'):
        if son_main and son_main != sha:
            print("SONUÇ: Bu işlemenin çalışması daha yeni bir gönderim yüzünden durduruldu; yayına main'in son işlemesi "
                  f'girer. Ona bakın: {daha_yeni}')
            return 3
        print('SONUÇ: Çalışma durduruldu (elle ya da GitHub tarafından). Yeniden yayın için main\'e yeni bir işleme gönderin.')
        return 1
    if den['conclusion'] != 'success':
        print('SONUÇ: Denetim başarısız; değişiklik yayına alınmadı, canlı site önceki sürümde. Hata notlarına göre '
              'düzeltip yeniden gönderin.')
        return 1
    if yay is None:
        print('SONUÇ: Denetim başarılı ama Yayın çalışması başlamadı. Birkaç dakika sonra yeniden bakın.')
        return 2
    if yay['conclusion'] != 'success':
        print('SONUÇ: Yayın başarısız (notlar yukarıda). Sorun sitenin kendisindeyse (dış sınamada açılmayan sayfa, '
              'hatalı rapor) düzeltip yeniden gönderin; sunucu, bağlantı ya da gizli değerle ilgiliyse kodu değiştirmeyin, '
              'site sahibine sade dille bildirin.')
        return 1

    yn = hepsi['Yayın']
    basliklar = {b: (d, m) for d, b, m in yn}
    if 'Yayın atlandı' in basliklar:
        print(f'SONUÇ: Yayın atlandı: {basliklar["Yayın atlandı"][1]} Bu kodla ilgili değil; site sahibine bildirin.')
        return 1
    if 'Site dışarıdan açılmıyor' in basliklar:
        print('SONUÇ: Sunucuya kuruldu ama site dışarıdan açılmıyor (DNS ya da sertifika olabilir). Bu kodla ilgili '
              'değil; site sahibine bildirin.')
        return 1
    sinama = basliklar.get('Site dışarıdan sınandı')
    if not sinama or sinama[0] != 'notice':
        print('SONUÇ: Site dışarıdan sınanamadı ("Site dışarıdan sınandı" notu yok). Notlara bakın.')
        return 1
    calisan = re.search(r'Uygulama çalışıyor: ([0-9a-f]{7})', ' '.join(m for d, b, m in yn if b == 'Yayın'))
    alinan = ' '.join(m for d, b, m in yn if b == 'Yayına alınan işleme')
    if calisan and calisan.group(1) != sha[:7]:
        print(f'SONUÇ: Sunucuda başka bir sürüm çalışıyor ({calisan.group(1)}); bu işleme {sha[:7]}. Notlara bakın.')
        return 1
    if not calisan and sha not in alinan:
        print('SONUÇ: Yayın başarılı görünüyor ama sunucudaki sürüm doğrulanamadı. Notlara bakın.')
        return 1
    if prova is not None and prova['conclusion'] != 'success':
        print(f'SONUÇ: Yayında ({site_adresi()} bu işlemeyi gösteriyor), ama Kurulum provası başarısız: sunucu kurulum '
              'dosyalarındaki bir hata yeni bir sunucuya kurulumu bozabilir. Notlara göre düzeltin.')
        return 1
    print(f'SONUÇ: Yayında. {site_adresi()} bu işlemeyi ({sha[:7]}) gösteriyor; site dışarıdan sınandı.')
    return 0


if __name__ == '__main__':
    sys.exit(main())
