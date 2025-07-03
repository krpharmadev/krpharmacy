CREATE TABLE "professional_orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"professional_id" varchar(64) NOT NULL,
	"professional_type" varchar(32) NOT NULL,
	"hospital_name" varchar(128) NOT NULL,
	"department" varchar(128),
	"email" varchar(128) NOT NULL,
	"phone" varchar(32) NOT NULL,
	"delivery_address" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP TABLE "order" CASCADE;