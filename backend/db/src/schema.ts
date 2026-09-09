import { pgTable, serial, varchar, integer, timestamp, text, jsonb } from 'drizzle-orm/pg-core';

// Table des utilisateurs
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password_hash: text('password_hash').notNull(),
  avatar_url: text('avatar_url'),
  role: varchar('role', { length: 20 }).default('user'),
  status: varchar('status', { length: 20 }).default('active'),
  last_login: timestamp('last_login'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

// Table des catégories de produits
export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull().unique(),
  description: text('description'),
  color: varchar('color', { length: 7 }), // Hex color code
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

// Table des produits
export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  sku: varchar('sku', { length: 100 }).notNull().unique(),
  quantity: integer('quantity').default(0).notNull(),
  price: integer('price'), // Price in cents to avoid floating point issues
  category_id: integer('category_id').references(() => categories.id, { onDelete: 'set null' }),
  supplier: varchar('supplier', { length: 255 }),
  low_stock_threshold: integer('low_stock_threshold').default(10),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

// Table des mouvements de stock
export const stockMovements = pgTable('stock_movements', {
  id: serial('id').primaryKey(),
  product_id: integer('product_id').references(() => products.id, { onDelete: 'cascade' }).notNull(),
  user_id: integer('user_id').references(() => users.id, { onDelete: 'set null' }),
  quantity: integer('quantity').notNull(),
  reason: varchar('reason', { length: 255 }),
  created_at: timestamp('created_at').defaultNow(),
});

// Table des actions utilisateurs (pour audit)
export const userActions = pgTable('user_actions', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').references(() => users.id, { onDelete: 'set null' }),
  action_type: varchar('action_type', { length: 50 }).notNull(),
  product_id: integer('product_id').references(() => products.id, { onDelete: 'set null' }),
  details: jsonb('details'),
  created_at: timestamp('created_at').defaultNow(),
});

// Table des logs d'activité (pour le dashboard admin)
export const activityLogs = pgTable('activity_logs', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').references(() => users.id, { onDelete: 'set null' }),
  action_type: varchar('action_type', { length: 50 }).notNull(),
  description: text('description').notNull(),
  entity_type: varchar('entity_type', { length: 50 }),
  entity_id: integer('entity_id'),
  metadata: jsonb('metadata'),
  created_at: timestamp('created_at').defaultNow(),
});

// Table des ventes
export const sales = pgTable('sales', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').references(() => users.id, { onDelete: 'set null' }),
  total_amount: integer('total_amount').notNull(), // Montant total en centimes
  payment_method: varchar('payment_method', { length: 50 }).notNull(), // 'cash', 'mobile_money', 'card'
  payment_status: varchar('payment_status', { length: 20 }).default('completed'), // 'pending', 'completed', 'failed'
  customer_name: varchar('customer_name', { length: 255 }),
  customer_phone: varchar('customer_phone', { length: 20 }),
  items: jsonb('items').notNull(), // Détails des articles vendus
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});