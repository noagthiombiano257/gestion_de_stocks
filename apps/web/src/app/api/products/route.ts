import { NextRequest, NextResponse } from 'next/server';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { pgTable, serial, text, integer, timestamp, varchar } from 'drizzle-orm/pg-core';
import { desc, eq } from 'drizzle-orm';

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

// GET - Liste tous les produits
export async function GET() {
  try {
    const allProducts = await db
      .select({
        id: products.id,
        name: products.name,
        sku: products.sku,
        quantity: products.quantity,
        price: products.price,
        category_id: products.category_id,
        category_name: categories.name,
        supplier: products.supplier,
        low_stock_threshold: products.low_stock_threshold,
        created_at: products.created_at
      })
      .from(products)
      .leftJoin(categories, eq(products.category_id, categories.id))
      .orderBy(desc(products.id));

    return NextResponse.json({
      success: true,
      data: allProducts,
    });
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST - Créer un nouveau produit
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, sku, quantity, price, categoryId, supplier, lowStockThreshold } = body;

    // Validation des champs requis
    if (!name || !sku) {
      return NextResponse.json(
        { success: false, error: 'Name and SKU are required' },
        { status: 400 }
      );
    }

    // Validation du SKU (optionnel - format)
    if (sku.trim().length < 3) {
      return NextResponse.json(
        { success: false, error: 'SKU must be at least 3 characters' },
        { status: 400 }
      );
    }

    // Créer le produit
    const [newProduct] = await db
      .insert(products)
      .values({ 
        name: name.trim(), 
        sku: sku.trim().toUpperCase(), // Convertir en majuscules pour cohérence
        quantity: quantity || 0,
        price: price ? Math.round(price * 100) : null, // Convertir en cents
        category_id: categoryId || null,
        supplier: supplier ? supplier.trim() : null,
        low_stock_threshold: lowStockThreshold || 10
      })
      .returning();

    return NextResponse.json({
      success: true,
      data: {
        ...newProduct,
        price: newProduct.price ? newProduct.price / 100 : null // Convertir en dollars
      },
      message: 'Product created successfully',
    });
  } catch (error: any) {
    console.error('Error creating product:', error);
    
    // Gestion spécifique pour les erreurs de contrainte unique (SKU dupliqué)
    if (error.code === '23505') {
      if (error.constraint === 'products_sku_key') {
        return NextResponse.json(
          { 
            success: false, 
            error: 'This SKU already exists. Please use a different SKU.',
            field: 'sku'
          },
          { status: 409 }
        );
      }
    }
    
    // Autres erreurs
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create product' },
      { status: 500 }
    );
  }
}