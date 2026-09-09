import { NextRequest, NextResponse } from 'next/server';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { pgTable, serial, text, integer, timestamp } from 'drizzle-orm/pg-core';
import { eq, sql } from 'drizzle-orm';

const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  sku: text('sku').notNull(),
  quantity: integer('quantity').default(0).notNull(),
  updated_at: timestamp('updated_at').defaultNow(),
  created_at: timestamp('created_at').defaultNow(),
});

const stockMovements = pgTable('stock_movements', {
  id: serial('id').primaryKey(),
  product_id: integer('product_id').notNull(),
  user_id: integer('user_id'),
  quantity: integer('quantity').notNull(),
  type: text('type'), // ← "type" pas "reason"
  created_at: timestamp('created_at').defaultNow(),
});

const sqlClient = neon(process.env.DATABASE_URL!);
const db = drizzle(sqlClient);

export const dynamic = 'force-dynamic';

export async function POST(
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

    const body = await request.json();
    const { adjustment, type, user_id } = body; // ← "type" au lieu de "reason"

    if (typeof adjustment !== 'number') {
      return NextResponse.json(
        { success: false, error: 'Adjustment must be a number' },
        { status: 400 }
      );
    }

    // Mettre à jour la quantité
    const [product] = await db
      .update(products)
      .set({
        quantity: sql`quantity + ${adjustment}`,
        updated_at: new Date(),
      })
      .where(eq(products.id, productId))
      .returning();

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    // Enregistrer le mouvement de stock
    await db.insert(stockMovements).values({
      product_id: productId,
      user_id: user_id || null,
      quantity: adjustment,
      type: type || 'manual_adjustment', // ← "type" au lieu de "reason"
    });

    return NextResponse.json({
      success: true,
      data: product,
      message: `Stock ${adjustment > 0 ? 'increased' : 'decreased'} by ${Math.abs(adjustment)}`,
    });
  } catch (error: any) {
    console.error('Error adjusting stock:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}