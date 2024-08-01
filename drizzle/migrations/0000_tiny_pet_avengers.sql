CREATE TABLE IF NOT EXISTS "batch" (
	"id" varchar PRIMARY KEY NOT NULL,
	"task" text,
	"completed" boolean DEFAULT false
);
