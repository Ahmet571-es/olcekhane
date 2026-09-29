CREATE TABLE "group_report_snapshots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"class_id" uuid NOT NULL,
	"instrument_id" uuid NOT NULL,
	"attempt_ids" jsonb NOT NULL,
	"n" integer NOT NULL,
	"report" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "group_report_snapshots" ADD CONSTRAINT "group_report_snapshots_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group_report_snapshots" ADD CONSTRAINT "group_report_snapshots_instrument_id_instruments_id_fk" FOREIGN KEY ("instrument_id") REFERENCES "public"."instruments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "group_report_snapshots_idx" ON "group_report_snapshots" USING btree ("class_id","instrument_id","created_at");