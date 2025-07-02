CREATE TABLE "cart" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"sku" text,
	"quantity" integer
);
--> statement-breakpoint
CREATE TABLE "order" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"total_amount" numeric,
	"status" text,
	"created_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "order_item" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" integer,
	"sku" text,
	"quantity" integer,
	"price" numeric
);
