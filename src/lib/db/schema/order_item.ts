import { pgTable, serial, integer, text, decimal, varchar } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { orders, professionalOrders } from './order'

export const order_item = pgTable('order_item', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id'),
  professionalOrderId: integer('professional_order_id'),
  sku: text('sku').notNull(),
  productName: varchar('product_name', { length: 255 }).notNull(),
  quantity: integer('quantity').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  totalPrice: decimal('total_price', { precision: 10, scale: 2 }).notNull(),
})

// Relations
export const orderItemRelations = relations(order_item, ({ one }) => ({
  order: one(orders, {
    fields: [order_item.orderId],
    references: [orders.id],
  }),
  professionalOrder: one(professionalOrders, {
    fields: [order_item.professionalOrderId],
    references: [professionalOrders.id],
  }),
}))
