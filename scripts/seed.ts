// Geliştirme için: tanımları eşitler ve isteğe bağlı olarak bir yönetici hesabı oluşturur.
// Çalıştırma: npm run db:seed   (ADMIN_EMAIL ve ADMIN_PASSWORD ortam değişkenleriyle)
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { users } from '@/db/schema';
import { hashPassword } from '@/lib/auth/password';
import { syncDefinitions } from '@/lib/instruments/sync';

await syncDefinitions();

const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD;
if (email && password) {
  const [existing] = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
  if (existing) {
    await db.update(users).set({ role: 'admin' }).where(eq(users.id, existing.id));
    console.log(`Yönetici yetkisi verildi: ${email}`);
  } else {
    await db.insert(users).values({
      email,
      passwordHash: await hashPassword(password),
      fullName: process.env.ADMIN_NAME ?? 'Yönetici',
      role: 'admin',
      emailVerifiedAt: new Date(),
    });
    console.log(`Yönetici hesabı oluşturuldu: ${email}`);
  }
}
process.exit(0);
