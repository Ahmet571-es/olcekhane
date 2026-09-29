ALTER TABLE "email_outbox" ADD COLUMN "attempts" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "email_outbox" ADD COLUMN "next_attempt_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "email_outbox" ADD COLUMN "last_attempt_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "email_outbox" ADD COLUMN "redact_after_send" boolean DEFAULT false NOT NULL;--> statement-breakpoint
CREATE INDEX "email_outbox_queue_idx" ON "email_outbox" USING btree ("status","next_attempt_at");--> statement-breakpoint
CREATE INDEX "email_outbox_attempt_idx" ON "email_outbox" USING btree ("last_attempt_at");