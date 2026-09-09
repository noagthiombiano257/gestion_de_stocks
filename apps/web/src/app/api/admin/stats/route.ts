import { NextResponse } from 'next/server';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { pgTable, serial, text, integer, varchar, timestamp } from 'drizzle-orm/pg-core';
import { sql, count } from 'drizzle-orm';

const users = pgTable('users', {
  id: serial('id').primaryKey(),
  status: varchar('status', { length: 255 }).default('active'),
});

const products = pgTable('products', {
  id: serial('id').primaryKey(),
  quantity: integer('quantity').default(0).notNull(),
});

const sqlClient = neon(process.env.DATABASE_URL!);
const db = drizzle(sqlClient);

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [usersCount] = await db.select({ count: count() }).from(users);
    const [productsCount] = await db.select({ count: count() }).from(products);
    const [lowStockCount] = await db.select({ count: count() }).from(products).where(sql`quantity < 10`);
    const [totalQuantity] = await db.select({ total: sql<number>`COALESCE(SUM(quantity), 0)` }).from(products);

    const statsData = {
      active_users: usersCount?.count || 0,
      total_products: productsCount?.count || 0,
      total_quantity: totalQuantity?.total || 0,
      low_stock_alerts: lowStockCount?.count || 0,
    };

    return NextResponse.json({ success: true, data: statsData });
  } catch (error: any) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}