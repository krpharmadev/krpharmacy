CREATE TABLE "atc_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" varchar(10) NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"level" integer NOT NULL,
	"parent_code" varchar(10),
	"anatomical_group" varchar(255),
	"therapeutic_group" varchar(255),
	"pharmacological_group" varchar(255),
	"chemical_group" varchar(255),
	"chemical_substance" varchar(255),
	CONSTRAINT "atc_categories_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "medicines" (
	"id" serial PRIMARY KEY NOT NULL,
	"medicine_id" varchar(50) NOT NULL,
	"generic_name" text NOT NULL,
	"strength" varchar(100) NOT NULL,
	"form" varchar(100) NOT NULL,
	"atc_code" varchar(10) NOT NULL,
	"atc_category_id" integer NOT NULL,
	"indication" text NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"stock" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "medicines_medicine_id_unique" UNIQUE("medicine_id")
);
--> statement-breakpoint
ALTER TABLE "medicines" ADD CONSTRAINT "medicines_atc_category_id_atc_categories_id_fk" FOREIGN KEY ("atc_category_id") REFERENCES "public"."atc_categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "atc_categories_code_idx" ON "atc_categories" USING btree ("code");--> statement-breakpoint
CREATE UNIQUE INDEX "medicines_generic_name_idx" ON "medicines" USING btree ("generic_name");--> statement-breakpoint
CREATE UNIQUE INDEX "medicines_atc_code_idx" ON "medicines" USING btree ("atc_code");