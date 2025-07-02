import { pgTable, serial, integer, text, decimal, timestamp } from 'drizzle-orm/pg-core'

export const order = pgTable('order', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id'),
  total_amount: decimal('total_amount'),
  status: text('status'), // pending, confirmed, shipped
  created_at: timestamp('created_at'),
})
