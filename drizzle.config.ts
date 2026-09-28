import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema/index.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL ?? 'postgres://olcekhane:olcekhane@127.0.0.1:54329/olcekhane',
  },
  strict: true,
  verbose: true,
});
