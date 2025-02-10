ALTER TABLE "public"."system_setting" ALTER COLUMN "key" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."system_setting_fields";--> statement-breakpoint
CREATE TYPE "public"."system_setting_fields" AS ENUM('AdminUsername', 'AdminPassword', 'AIApiURL', 'AIApiKey', 'AigcEnglishModel', 'AigcEnglishPrompt');--> statement-breakpoint
ALTER TABLE "public"."system_setting" ALTER COLUMN "key" SET DATA TYPE "public"."system_setting_fields" USING "key"::"public"."system_setting_fields";