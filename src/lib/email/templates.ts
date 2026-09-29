/** Sade, her e-posta istemcisinde düzgün görünen şablonlar. */

function esc(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}

const DEFAULT_FOOTER =
  'Bu e-postayı Ölçekhane hesabınızla ilgili bir işlem yapıldığı için aldınız. Bu işlemi siz yapmadıysanız e-postayı yok sayabilirsiniz.';

function layout(title: string, bodyHtml: string, footer = DEFAULT_FOOTER): string {
  return `<!doctype html><html lang="tr"><head><meta charset="utf-8"><title>${esc(title)}</title></head>
<body style="margin:0;padding:24px;background:#f4f6f8;font-family:Arial,Helvetica,sans-serif;color:#14213d">
<table role="presentation" width="100%" style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:8px">
<tr><td style="padding:28px 28px 8px;font-size:18px;font-weight:bold;letter-spacing:.2px">Ölçekhane</td></tr>
<tr><td style="padding:8px 28px 28px;font-size:15px;line-height:1.6">${bodyHtml}</td></tr>
</table>
<p style="max-width:560px;margin:16px auto 0;font-size:12px;color:#5a6780;line-height:1.5">${esc(footer)}</p>
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

export function inviteTemplate(p: { orgName: string; roleLabel: string; inviterName: string; link: string; days: number }) {
  const subject = `${p.orgName} sizi Ölçekhane’ye davet ediyor`;
  const html = layout(
    subject,
    `<p>Merhaba,</p><p>${esc(p.inviterName)}, sizi <strong>${esc(p.orgName)}</strong> ekibine <strong>${esc(p.roleLabel.toLocaleLowerCase('tr-TR'))}</strong> olarak davet etti. Daveti kabul etmek için aşağıdaki düğmeye basın. Hesabınız yoksa birkaç adımda oluşturabilirsiniz. Bağlantı ${p.days} gün geçerlidir.</p>${button(p.link, 'Daveti kabul et')}`,
    'Bu e-postayı bir okul ekibine davet edildiğiniz için aldınız. Daveti beklemiyorsanız e-postayı yok sayabilirsiniz.',
  );
  const text = `Merhaba,\n\n${p.inviterName}, sizi ${p.orgName} ekibine ${p.roleLabel.toLocaleLowerCase('tr-TR')} olarak davet etti. Daveti kabul etmek için bu bağlantıyı açın (${p.days} gün geçerli):\n${p.link}\n`;
  return { subject, html, text };
}

export function newCounselorTemplate(p: { orgName: string; name: string; email: string; link: string }) {
  const subject = `${p.orgName}: ekibe yeni bir rehber öğretmen katıldı`;
  const html = layout(
    subject,
    `<p>Merhaba,</p><p><strong>${esc(p.name)}</strong> (${esc(p.email)}), <strong>${esc(p.orgName)}</strong> ekibine rehber öğretmen olarak katıldı. Rehber öğretmenler öğrencilerin bireysel sonuçlarını görebilir.</p><p>Bu kişiyi tanımıyorsanız ya da bu görevi almaması gerekiyorsa okul yöneticinizle görüşün; okul yöneticisi görevi ekip sayfasından kaldırabilir.</p>${button(p.link, 'Ekibi görüntüle')}`,
    'Bu e-postayı okulunuzun Ölçekhane ekibindeki görevleriniz nedeniyle aldınız.',
  );
  const text = `${p.name} (${p.email}), ${p.orgName} ekibine rehber öğretmen olarak katıldı. Rehber öğretmenler öğrencilerin bireysel sonuçlarını görebilir. Bu kişiyi tanımıyorsanız okul yöneticinizle görüşün.\n${p.link}\n`;
  return { subject, html, text };
}

export function guardianUnlinkedTemplate(p: { orgName: string; studentName: string; emailChanged: boolean }) {
  const subject = `${p.studentName}: veli hesabı bağlantınız kaldırıldı`;
  const lead = p.emailChanged
    ? `${p.orgName}, ${p.studentName} için kayıtlı veli e-postasını değiştirdi. Bu nedenle öğrencinin Ölçekhane’deki veli hesabı bağlantınız kaldırıldı.`
    : `${p.orgName} rehberlik servisi, ${p.studentName} adlı öğrencinin Ölçekhane’deki veli hesabı bağlantınızı kaldırdı.`;
  const rest = 'Bu öğrencinin raporlarını artık hesabınızda göremezsiniz. Bunun bir yanlışlık olduğunu düşünüyorsanız okulun rehberlik servisiyle görüşün.';
  const html = layout(
    subject,
    `<p>Sayın veli,</p><p>${esc(lead)}</p><p>${esc(rest)}</p>`,
    'Bu e-postayı Ölçekhane hesabınıza bağlı bir öğrenciyle ilgili değişiklik yapıldığı için aldınız.',
  );
  const text = `Sayın veli,\n\n${lead}\n\n${rest}\n`;
  return { subject, html, text };
}

export function consentRequestTemplate(p: { orgName: string; studentName: string; link: string; days: number }) {
  const subject = `${p.studentName} için veli onayı: ${p.orgName} rehberlik servisi`;
  const html = layout(
    subject,
    `<p>Sayın veli,</p><p><strong>${esc(p.orgName)}</strong> rehberlik servisi, öğrencileri daha iyi tanımak için Ölçekhane platformunda bilimsel ölçekler ve görevler uygulamak istiyor. Bu uygulamalar çocuğunuz <strong>${esc(p.studentName)}</strong> için ancak sizin açık rızanızla yapılabilir.</p><p>Aşağıdaki bağlantıda kişisel verilerin nasıl işlendiğini anlatan aydınlatma metnini ve açık rıza metnini okuyabilir, onay verip vermeyeceğinizi seçebilirsiniz. Onay vermemeniz çocuğunuz için hiçbir olumsuz sonuç doğurmaz. Verdiğiniz onayı aynı bağlantıdan dilediğiniz zaman geri alabilirsiniz.</p>${button(p.link, 'Metinleri oku ve karar ver')}<p style="font-size:13px;color:#5a6780">Bağlantı ${p.days} gün geçerlidir. Bu e-postayı okulunuzun size ait kayıtlı adresine göndermesi nedeniyle aldınız. Çocuğun velisi değilseniz lütfen bağlantıyı açmayın ve okulu bilgilendirin.</p>`,
    'Bu e-postayı çocuğunuzun okulu, veli onayı almak için Ölçekhane üzerinden gönderdi.',
  );
  const text = `Sayın veli,\n\n${p.orgName} rehberlik servisi, çocuğunuz ${p.studentName} için Ölçekhane platformunda ölçek uygulamak istiyor. Bu uygulamalar ancak sizin açık rızanızla yapılabilir. Metinleri okuyup karar vermek için bu bağlantıyı açın (${p.days} gün geçerli):\n${p.link}\n\nOnay vermemeniz hiçbir olumsuz sonuç doğurmaz. Verdiğiniz onayı aynı bağlantıdan dilediğiniz zaman geri alabilirsiniz.\n`;
  return { subject, html, text };
}

export function consentReceiptTemplate(p: { orgName: string; studentName: string; granted: boolean; link: string }) {
  const subject = p.granted ? `Onayınız alındı: ${p.studentName}` : `Kararınız kaydedildi: ${p.studentName}`;
  const body = p.granted
    ? `<p>Sayın veli,</p><p><strong>${esc(p.studentName)}</strong> için verdiğiniz açık rıza ${esc(p.orgName)} adına kaydedildi. Rızanızı dilediğiniz zaman aşağıdaki bağlantıdan geri alabilirsiniz; geri aldığınızda yeni uygulama yapılmaz ve bu rızaya dayanan veriler en geç 30 gün içinde silinir.</p>`
    : `<p>Sayın veli,</p><p><strong>${esc(p.studentName)}</strong> için onay vermediğiniz kaydedildi. Çocuğunuza bu platformda uygulama yapılmayacak. Fikrinizi değiştirirseniz aynı bağlantıdan onay verebilirsiniz.</p>`;
  const html = layout(subject, `${body}${button(p.link, 'Kararımı görüntüle ya da değiştir')}<p style="font-size:13px;color:#5a6780">Bu e-postayı kayıtlarınız için saklamanızı öneririz.</p>`,
    'Bu e-postayı çocuğunuzun okulu adına verdiğiniz karar kaydedildiği için aldınız.',
  );
  const text = `${p.granted ? `${p.studentName} için açık rızanız kaydedildi.` : `${p.studentName} için onay vermediğiniz kaydedildi.`}\n\nKararınızı görüntülemek ya da değiştirmek için: ${p.link}\n`;
  return { subject, html, text };
}

export function passwordChangedTemplate(name: string, link: string) {
  const subject = 'Şifreniz değiştirildi';
  const html = layout(
    subject,
    `<p>Merhaba ${esc(name)},</p><p>Ölçekhane hesabınızın şifresi az önce değiştirildi ve diğer cihazlardaki oturumlarınız kapatıldı.</p><p>Bu değişikliği siz yapmadıysanız hemen “Şifremi unuttum” bağlantısıyla yeni bir şifre belirleyin ve bize yazın.</p>${button(link, 'Şifremi yenile')}`,
    'Bu e-postayı hesabınızın güvenliğiyle ilgili bir değişiklik yapıldığı için aldınız.',
  );
  const text = `Merhaba ${name},\n\nÖlçekhane hesabınızın şifresi değiştirildi ve diğer cihazlardaki oturumlarınız kapatıldı. Bunu siz yapmadıysanız hemen yeni bir şifre belirleyin:\n${link}\n`;
  return { subject, html, text };
}

export function accountClosedTemplate(name: string, deletedProfiles: number) {
  const subject = 'Hesabınız kapatıldı';
  const profiles =
    deletedProfiles > 0
      ? `<p>Hesabınıza bağlı ${deletedProfiles} çocuk profili de silindi. Profillere ait ölçme verileri ve raporlar en geç 30 gün içinde kalıcı olarak silinecek.</p>`
      : '';
  const html = layout(
    subject,
    `<p>Merhaba ${esc(name)},</p><p>İsteğiniz üzerine Ölçekhane hesabınız kapatıldı. Artık bu hesapla giriş yapılamaz.</p>${profiles}<p>Açık rıza kayıtları gibi yasal olarak saklamamız gereken kayıtlar, saklama süresi boyunca erişime kapalı tutulur. Sorularınız için bu e-postayı yanıtlayabilirsiniz.</p>`,
    'Bu e-postayı hesabınızı kapattığınız için aldınız.',
  );
  const text = `Merhaba ${name},\n\nİsteğiniz üzerine Ölçekhane hesabınız kapatıldı.${deletedProfiles > 0 ? ` Hesabınıza bağlı ${deletedProfiles} çocuk profili de silindi; ölçme verileri en geç 30 gün içinde kalıcı olarak silinecek.` : ''}\n`;
  return { subject, html, text };
}

export function twoFactorChangedTemplate(p: { name: string; change: 'enabled' | 'moved' | 'disabled' | 'reset' | 'codes'; link: string }) {
  const subject = {
    enabled: 'İki aşamalı doğrulama açıldı',
    moved: 'İki aşamalı doğrulama yeni bir cihaza taşındı',
    codes: 'Kurtarma kodlarınız yenilendi',
    disabled: 'İki aşamalı doğrulama kapatıldı',
    reset: 'İki aşamalı doğrulama kapatıldı',
  }[p.change];
  const what = {
    enabled: 'Ölçekhane hesabınızda iki aşamalı doğrulama açıldı. Bundan sonra girişte şifrenizin yanında kimlik doğrulama uygulamanızdaki kodu da yazacaksınız. Diğer cihazlardaki oturumlarınız kapatıldı.',
    moved: 'Ölçekhane hesabınızın iki aşamalı doğrulaması yeni bir cihaza taşındı. Eski cihazdaki kodlar ve eski kurtarma kodları artık geçerli değil; diğer cihazlardaki oturumlarınız kapatıldı.',
    disabled: 'Ölçekhane hesabınızda iki aşamalı doğrulama kapatıldı. Girişte artık yalnızca şifreniz istenecek.',
    reset: 'Ölçekhane hesabınızın iki aşamalı doğrulaması platform yöneticisi tarafından sıfırlandı ve oturumlarınız kapatıldı. Bir sonraki girişinizde yeniden kurmanız istenecek.',
    codes: 'Ölçekhane hesabınız için yeni kurtarma kodları oluşturuldu; eski kodlar artık geçerli değil.',
  }[p.change];
  const html = layout(
    subject,
    `<p>Merhaba ${esc(p.name)},</p><p>${esc(what)}</p><p>Bu değişikliği siz yapmadıysanız hemen şifrenizi yenileyin ve bize yazın.</p>${button(p.link, 'Hesabımı görüntüle')}`,
    'Bu e-postayı hesabınızın güvenliğiyle ilgili bir değişiklik yapıldığı için aldınız.',
  );
  const text = `Merhaba ${p.name},\n\n${what}\n\nBu değişikliği siz yapmadıysanız hemen şifrenizi yenileyin ve bize yazın.\n${p.link}\n`;
  return { subject, html, text };
}

export function recoveryCodeUsedTemplate(name: string, left: number, link: string) {
  const subject = 'Hesabınıza kurtarma koduyla giriş yapıldı';
  const what = `Ölçekhane hesabınıza bir kurtarma koduyla giriş yapıldı. Kullanılmamış ${left} kurtarma kodunuz kaldı.`;
  const html = layout(
    subject,
    `<p>Merhaba ${esc(name)},</p><p>${esc(what)} Telefonunuzu değiştirdiyseniz iki aşamalı doğrulamayı yeni cihazınızda yeniden kurun.</p><p>Bu girişi siz yapmadıysanız hemen şifrenizi yenileyin ve bize yazın.</p>${button(link, 'İki aşamalı doğrulama ayarları')}`,
    'Bu e-postayı hesabınızın güvenliğiyle ilgili bir işlem yapıldığı için aldınız.',
  );
  const text = `Merhaba ${name},\n\n${what}\n\nBu girişi siz yapmadıysanız hemen şifrenizi yenileyin.\n${link}\n`;
  return { subject, html, text };
}

export function secondStepFailedTemplate(name: string, resetLink: string) {
  const subject = 'Hesabınızda doğrulama kodu birkaç kez yanlış girildi';
  const what =
    'Ölçekhane hesabınıza şifrenizle giriş yapılmaya çalışıldı ama iki aşamalı doğrulama kodu birkaç kez yanlış girildi. Bunu siz yapmadıysanız şifreniz başkasının elinde olabilir.';
  const html = layout(
    subject,
    `<p>Merhaba ${esc(name)},</p><p>${esc(what)} Hesabınız doğrulama kodu sayesinde korundu; yine de şifrenizi hemen değiştirmenizi öneririz.</p>${button(resetLink, 'Şifremi yenile')}`,
    'Bu e-postayı hesabınızın güvenliğiyle ilgili bir durum nedeniyle aldınız.',
  );
  const text = `Merhaba ${name},\n\n${what} Şifrenizi hemen değiştirmenizi öneririz:\n${resetLink}\n`;
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
