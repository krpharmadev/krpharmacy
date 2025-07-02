import { pgTable, uuid, text, timestamp, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const products = pgTable('products', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  price: integer('price').notNull(),
  categoryId: text('category_id').notNull(),
  subcategoryId: text('subcategory_id').notNull(),
  imageUrl: text('image_url'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const productClassifications = pgTable('product_classifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  productId: uuid('product_id')
    .notNull()
    .references(() => products.id, { onDelete: 'cascade' }),
  classification: text('classification').notNull().$type<'ATC' | 'General'>(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const productsRelations = relations(products, ({ many }) => ({
  classifications: many(productClassifications),
}));

export const productClassificationsRelations = relations(productClassifications, ({ one }) => ({
  product: one(products, {
    fields: [productClassifications.productId],
    references: [products.id],
  }),
}));