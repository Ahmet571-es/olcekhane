/** Sade, her e-posta istemcisinde düzgün görünen şablonlar. */

function esc(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}

function layout(title: string, bodyHtml: string): string {
  return `<!doctype html><html lang="tr"><head><meta charset="utf-8"><title>${esc(title)}</title></head>
<body style="margin:0;padding:24px;background:#f4f6f8;font-family:Arial,Helvetica,sans-serif;color:#14213d">
<table role="presentation" width="100%" style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:8px">
<tr><td style="padding:28px 28px 8px;font-size:18px;font-weight:bold;letter-spacing:.2px">Ölçekhane</td></tr>
<tr><td style="padding:8px 28px 28px;font-size:15px;line-height:1.6">${bodyHtml}</td></tr>
</table>
<p style="max-width:560px;margin:16px auto 0;font-size:12px;color:#5a6780;line-height:1.5">Bu e-postayı Ölçekhane hesabınızla ilgili bir işlem yapıldığı için aldınız. Bu işlemi siz yapmadıysanız e-postayı yok sayabilirsiniz.</p>
</body></html>`;
}

function button(href: string, label: string): string {
  return `<p style="margin:24px 0"><a href="${esc(href)}" style="display:inline-block;background:#14213d;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:6px;font-weight:bold">${esc(label)}</a></p>
<p style="font-size:13px;color:#5a6780">Düğme çalışmazsa bu adresi tarayıcınıza yapıştırın:<br><span style="word-break:break-all">${esc(href)}</span></p>`;
}

export function verifyEmailTemplate(name: string, link: string) {
  const subject = 'E-posta adresinizi doğrulayın';
  const html = layout(
    subject,
    `<p>Merhaba ${esc(name)},</p><p>Ölçekhane hesabınızı oluşturduğunuz için teşekkürler. Testlere başlayabilmek için e-posta adresinizi doğrulayın. Bağlantı 48 saat geçerlidir.</p>${button(link, 'E-postamı doğrula')}`,
  );
  const text = `Merhaba ${name},\n\nÖlçekhane hesabınızı doğrulamak için bu bağlantıyı açın (48 saat geçerli):\n${link}\n`;
  return { subject, html, text };
}

export function passwordResetTemplate(name: string, link: string) {
  const subject = 'Şifrenizi yenileyin';
  const html = layout(
    subject,
    `<p>Merhaba ${esc(name)},</p><p>Şifre yenileme isteği aldık. Yeni şifrenizi belirlemek için aşağıdaki düğmeye basın. Bağlantı 1 saat geçerlidir ve yalnızca bir kez kullanılabilir.</p>${button(link, 'Yeni şifre belirle')}`,
  );
  const text = `Merhaba ${name},\n\nYeni şifrenizi belirlemek için bu bağlantıyı açın (1 saat geçerli):\n${link}\n`;
  return { subject, html, text };
}
