ALTER TABLE "sessions" ADD COLUMN "two_factor_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "totp_pending_secret" text;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "totp_pending_secret";