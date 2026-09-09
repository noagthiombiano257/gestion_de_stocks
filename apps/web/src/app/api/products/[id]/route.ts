import { NextRequest, NextResponse } from 'next/server';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { pgTable, serial, text, integer, timestamp, varchar } from 'drizzle-orm/pg-core';
import { eq } from 'drizzle-orm';

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

// GET - Récupérer un produit par ID avec catégorie
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

    const [product] = await db
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
        created_at: products.created_at,
        updated_at: products.updated_at,
      })
      .from(products)
      .leftJoin(categories, eq(products.category_id, categories.id))
      .where(eq(products.id, productId));

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        ...product,
        price: product.price ? product.price / 100 : null // Convertir en euros
      },
    });
  } catch (error: any) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour un produit
export async function PUT(
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
    const { name, sku, quantity, price, categoryId, supplier, lowStockThreshold } = body;

    // Construire l'objet de mise à jour avec seulement les champs fournis
    const updateData: any = {
      updated_at: new Date(),
    };
    
    if (name !== undefined) updateData.name = name;
    if (sku !== undefined) updateData.sku = sku;
    if (quantity !== undefined) updateData.quantity = quantity;
    if (price !== undefined) updateData.price = price ? Math.round(price * 100) : null;
    if (categoryId !== undefined) updateData.category_id = categoryId || null;
    if (supplier !== undefined) updateData.supplier = supplier || null;
    if (lowStockThreshold !== undefined) updateData.low_stock_threshold = lowStockThreshold || 10;

    const [updatedProduct] = await db
      .update(products)
      .set(updateData)
      .where(eq(products.id, productId))
      .returning();

    if (!updatedProduct) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        ...updatedProduct,
        price: updatedProduct.price ? updatedProduct.price / 100 : null // Convertir en euros
      },
    });
  } catch (error: any) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un produit
export async function DELETE(
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

    await db
      .delete(products)
      .where(eq(products.id, productId));

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}