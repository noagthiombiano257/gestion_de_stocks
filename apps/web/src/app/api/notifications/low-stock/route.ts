import { NextRequest, NextResponse } from 'next/server';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { pgTable, serial, text, integer, timestamp, varchar } from 'drizzle-orm/pg-core';
import { and, lt, isNotNull, eq } from 'drizzle-orm';

// Schema products
const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  sku: text('sku').notNull(),
  quantity: integer('quantity').default(0).notNull(),
  price: integer('price'),
  category_id: integer('category_id'),
  supplier: text('supplier'),
  low_stock_threshold: integer('low_stock_threshold').default(10),
  updated_at: timestamp('updated_at').defaultNow(),
  created_at: timestamp('created_at').defaultNow(),
});

// Schema categories
const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  color: varchar('color', { length: 7 }),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

export const dynamic = 'force-dynamic';

// GET - Récupérer les alertes de stock bas
export async function GET() {
  try {
    // Récupérer les produits avec stock bas
    const lowStockProducts = await db
      .select({
        id: products.id,
        name: products.name,
        sku: products.sku,
        quantity: products.quantity,
        low_stock_threshold: products.low_stock_threshold,
        supplier: products.supplier,
        category_name: categories.name,
        category_color: categories.color
      })
      .from(products)
      .leftJoin(categories, eq(products.category_id, categories.id))
      .where(
        and(
          isNotNull(products.low_stock_threshold),
          lt(products.quantity, products.low_stock_threshold)
        )
      )
      .orderBy(products.quantity);

    // Calculer le nombre total d'alertes
    const totalAlerts = lowStockProducts.length;

    return NextResponse.json({
      success: true,
      data: {
        alerts: lowStockProducts,
        total: totalAlerts,
        message: totalAlerts > 0 
          ? `Vous avez ${totalAlerts} produit(s) avec un stock bas`
          : 'Aucune alerte de stock bas'
      },
    });
  } catch (error: any) {
    console.error('Error fetching low stock alerts:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}