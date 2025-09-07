CREATE TABLE "lead_activities" (
	"id" text PRIMARY KEY NOT NULL,
	"lead_id" text NOT NULL,
	"user_id" text NOT NULL,
	"type" varchar(50) NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"status" varchar(50) DEFAULT 'pending' NOT NULL,
	"message_content" text,
	"response_received" boolean DEFAULT false,
	"response_content" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "campaigns" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "campaigns" ADD COLUMN "target_audience" varchar(255);--> statement-breakpoint
ALTER TABLE "campaigns" ADD COLUMN "goal_count" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "campaigns" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN "title" varchar(255);--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN "company" varchar(255);--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN "location" varchar(255);--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN "profile_image" text;--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN "connection_status" varchar(50);--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN "linkedin_url" text;--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN "phone_number" varchar(50);--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN "industry" varchar(100);--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN "company_size" varchar(50);--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN "last_activity" timestamp;--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN "last_contacted_at" timestamp;--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN "response_rate" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "lead_activities" ADD CONSTRAINT "lead_activities_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lead_activities" ADD CONSTRAINT "lead_activities_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;