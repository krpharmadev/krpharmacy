import { pgTable, serial, integer, text, decimal } from 'drizzle-orm/pg-core'

export const order_item = pgTable('order_item', {
  id: serial('id').primaryKey(),
  order_id: integer('order_id'),
  sku: text('sku'),
  quantity: integer('quantity'),
  price: decimal('price'),
})
