import { pgTable, text, integer, uuid, timestamp, decimal } from 'drizzle-orm/pg-core';

export const productInventory = pgTable('product_inventory', {
  id: uuid('id').primaryKey().defaultRandom(),
  sanity_product_id: text('sanity_product_id').notNull(),
  sku: text('sku').notNull().unique(),
  stock_quantity: integer('stock_quantity').notNull().default(0),
  reserved_quantity: integer('reserved_quantity').notNull().default(0),
  reorder_level: integer('reorder_level').notNull().default(5),
  cost_price: decimal('cost_price', { precision: 10, scale: 2 }),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
}); 