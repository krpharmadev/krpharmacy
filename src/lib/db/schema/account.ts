// src/lib/db/schema/account.ts
import { pgTable, uuid, text, timestamp, integer, boolean, uniqueIndex, pgEnum, primaryKey } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// กำหนด enum สำหรับ role
export const roleEnum = pgEnum('role', [
  'medical_personnel',
  'pharmacist',
  'customer',
  'admin',
  'sales_staff',
  'inventory_staff',
]);

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: timestamp('email_verified', { withTimezone: true }),
  image: text('image'),
  password: text('password'),
  lineId: text('line_id'), // เพิ่ม lineId สำหรับ LINE LIFF
  role: roleEnum('role').notNull().default('customer'), // เพิ่ม role
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const sessions = pgTable('sessions', {
  sessionToken: text('session_token').primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { withTimezone: true }).notNull(),
  accessToken: text('access_token'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const accounts = pgTable('accounts', {
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),
  provider: text('provider').notNull(),
  providerAccountId: text('provider_account_id').notNull(),
  refresh_token: text('refresh_token'),
  access_token: text('access_token'),
  expires_at: integer('expires_at'),
  token_type: text('token_type'),
  scope: text('scope'),
  id_token: text('id_token'),
  session_state: text('session_state'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  pk: primaryKey({ columns: [table.provider, table.providerAccountId] }),
}));

// ตารางสำหรับการลงทะเบียนพิเศษ
export const professionalRegistrations = pgTable('professional_registrations', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  licenseNumber: text('license_number').notNull(),
  profession: text('profession').notNull().$type<'medical' | 'pharmacist'>(),
  fullName: text('full_name'),
  phone: text('phone'),
  hospital: text('hospital'),
  experience: text('experience'),
  status: text('status').notNull().$type<'pending' | 'approved' | 'rejected'>().default('pending'),
  documentUrl: text('document_url'), // URL เอกสารใบอนุญาต
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// Define relations
export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  accounts: many(accounts),
  professionalRegistrations: many(professionalRegistrations),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const professionalRegistrationsRelations = relations(professionalRegistrations, ({ one }) => ({
  user: one(users, {
    fields: [professionalRegistrations.userId],
    references: [users.id],
  }),
}));