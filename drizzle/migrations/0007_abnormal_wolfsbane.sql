CREATE TABLE "aigc_english_content" (
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"topic" text NOT NULL,
	"audio" text NOT NULL,
	"title_english" text NOT NULL,
	"title_chinese" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "aigc_english_sentence" (
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"text_id" text NOT NULL,
	"english" text NOT NULL,
	"chinese" text NOT NULL,
	"audio_duration" integer NOT NULL
);
