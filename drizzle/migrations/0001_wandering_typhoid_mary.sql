CREATE TABLE IF NOT EXISTS "task" (
	"title" text,
	"input" text,
	"prompt_id" text,
	"completed" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "system_setting" (
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"key" "system_setting_fields" NOT NULL,
	"value" text NOT NULL,
	CONSTRAINT "system_setting_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "prompt" (
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"template" text NOT NULL,
	"tag" text NOT NULL,
	CONSTRAINT "prompt_tag_unique" UNIQUE("tag")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "post" (
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"tags" text[]
);
--> statement-breakpoint
ALTER TABLE "batch" ADD COLUMN "createdAt" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "batch" ADD COLUMN "updatedAt" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "batch" DROP COLUMN IF EXISTS "task";