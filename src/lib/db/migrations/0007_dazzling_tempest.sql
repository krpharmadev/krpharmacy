CREATE TABLE "orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_number" varchar(32) NOT NULL,
	"user_id" varchar(64),
	"customer_name" varchar(128) NOT NULL,
	"email" varchar(128) NOT NULL,
	"phone" varchar(32) NOT NULL,
	"delivery_address" text NOT NULL,
	"total_amount" numeric(10, 2) NOT NULL,
	"status" varchar(32) DEFAULT 'pending' NOT NULL,
	"payment_status" varchar(32) DEFAULT 'unpaid' NOT NULL,
	"payment_method" varchar(32),
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "orders_order_number_unique" UNIQUE("order_number")
);
--> statement-breakpoint
ALTER TABLE "order_item" ALTER COLUMN "sku" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "order_item" ALTER COLUMN "quantity" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "order_item" ALTER COLUMN "price" SET DATA TYPE numeric(10, 2);--> statement-breakpoint
ALTER TABLE "order_item" ALTER COLUMN "price" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "professional_orders" ADD COLUMN "order_number" varchar(32) NOT NULL;--> statement-breakpoint
ALTER TABLE "professional_orders" ADD COLUMN "total_amount" numeric(10, 2) NOT NULL;--> statement-breakpoint
ALTER TABLE "professional_orders" ADD COLUMN "status" varchar(32) DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE "professional_orders" ADD COLUMN "payment_status" varchar(32) DEFAULT 'unpaid' NOT NULL;--> statement-breakpoint
ALTER TABLE "professional_orders" ADD COLUMN "payment_method" varchar(32);--> statement-breakpoint
ALTER TABLE "professional_orders" ADD COLUMN "notes" text;--> statement-breakpoint
ALTER TABLE "professional_orders" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "order_item" ADD COLUMN "professional_order_id" integer;--> statement-breakpoint
ALTER TABLE "order_item" ADD COLUMN "product_name" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "order_item" ADD COLUMN "total_price" numeric(10, 2) NOT NULL;--> statement-breakpoint
ALTER TABLE "professional_orders" ADD CONSTRAINT "professional_orders_order_number_unique" UNIQUE("order_number");