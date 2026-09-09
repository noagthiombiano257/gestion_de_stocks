import { NextRequest, NextResponse } from 'next/server';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { pgTable, serial, text, integer, timestamp } from 'drizzle-orm/pg-core';
import { eq, desc } from 'drizzle-orm';

const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  sku: text('sku').notNull(),
});

const stockMovements = pgTable('stock_movements', {
  id: serial('id').primaryKey(),
  product_id: integer('product_id').notNull(),
  user_id: integer('user_id'),
  quantity: integer('quantity').notNull(),
  type: text('type'), // ← C'est "type" pas "reason"
  created_at: timestamp('created_at').defaultNow(),
});

const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
});

const sqlClient = neon(process.env.DATABASE_URL!);
const db = drizzle(sqlClient);

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const productId = parseInt(id);

    if (isNaN(productId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid product ID' },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');

    const movements = await db
      .select({
        id: stockMovements.id,
        product_id: stockMovements.product_id,
        user_id: stockMovements.user_id,
        quantity: stockMovements.quantity,
        type: stockMovements.type, // ← Utilise "type"
        created_at: stockMovements.created_at,
        user: {
          id: users.id,
          name: users.name,
          email: users.email,
        },
        product: {
          id: products.id,
          name: products.name,
          sku: products.sku,
        },
      })
      .from(stockMovements)
      .leftJoin(users, eq(stockMovements.user_id, users.id))
      .leftJoin(products, eq(stockMovements.product_id, products.id))
      .where(eq(stockMovements.product_id, productId))
      .orderBy(desc(stockMovements.created_at))
      .limit(limit);

    return NextResponse.json({
      success: true,
      data: movements,
    });
  } catch (error: any) {
    console.error('Error fetching product history:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}