import { pgTable, serial, varchar, text, timestamp, integer, decimal, boolean } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { order_item } from './order_item'

// ตาราง orders หลักสำหรับลูกค้าทั่วไป
export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  orderNumber: varchar('order_number', { length: 32 }).notNull().unique(),
  userId: varchar('user_id', { length: 64 }),
  customerName: varchar('customer_name', { length: 128 }).notNull(),
  email: varchar('email', { length: 128 }).notNull(),
  phone: varchar('phone', { length: 32 }).notNull(),
  deliveryAddress: text('delivery_address').notNull(),
  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }).notNull(),
  status: varchar('status', { length: 32 }).notNull().default('pending'), // pending, processing, shipped, delivered, cancelled
  paymentStatus: varchar('payment_status', { length: 32 }).notNull().default('unpaid'), // unpaid, paid, refunded
  paymentMethod: varchar('payment_method', { length: 32 }),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// ตาราง professional orders สำหรับผู้เชี่ยวชาญทางการแพทย์
export const professionalOrders = pgTable('professional_orders', {
  id: serial('id').primaryKey(),
  orderNumber: varchar('order_number', { length: 32 }).notNull().unique().default('PROF-'),
  professionalId: varchar('professional_id', { length: 64 }).notNull(),
  professionalType: varchar('professional_type', { length: 32 }).notNull(),
  hospitalName: varchar('hospital_name', { length: 128 }).notNull(),
  department: varchar('department', { length: 128 }),
  email: varchar('email', { length: 128 }).notNull(),
  phone: varchar('phone', { length: 32 }).notNull(),
  deliveryAddress: text('delivery_address').notNull(),
  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }).notNull().default('0'),
  status: varchar('status', { length: 32 }).notNull().default('pending'),
  paymentStatus: varchar('payment_status', { length: 32 }).notNull().default('unpaid'),
  paymentMethod: varchar('payment_method', { length: 32 }),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Relations
export const ordersRelations = relations(orders, ({ many }) => ({
  items: many(order_item),
}))

export const professionalOrdersRelations = relations(professionalOrders, ({ many }) => ({
  items: many(order_item),
}))
