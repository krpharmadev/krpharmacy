import { pgTable, serial, integer, text } from 'drizzle-orm/pg-core'

export const cart = pgTable('cart', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id'),
  sku: text('sku'),
  quantity: integer('quantity'),
})
