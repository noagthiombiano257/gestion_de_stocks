import { NextRequest, NextResponse } from 'next/server';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { eq, sql } from 'drizzle-orm';
import { sales, products } from '@shopflow/db/schema';

const queryClient = neon(process.env.DATABASE_URL!);
const db = drizzle(queryClient);

export const dynamic = 'force-dynamic';

// POST - Créer une nouvelle vente
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, total, paymentMethod, customerName, customerPhone, userId } = body;

    // Préparer les données de vente
    const saleData = {
      user_id: userId || null,
      total_amount: Math.round(total * 100), // Convertir en cents
      payment_method: paymentMethod,
      payment_status: 'completed',
      customer_name: customerName || null,
      customer_phone: customerPhone || null,
      items: items, // Stocker les articles en JSON
    };

    // Insérer la vente
    const [newSale] = await db.insert(sales).values(saleData).returning();

    // Mettre à jour le stock des produits
    for (const item of items) {
      await db
        .update(products)
        .set({
          quantity: sql`GREATEST(0, quantity - ${item.quantity})`, // Éviter les quantités négatives
          updated_at: new Date(),
        })
        .where(eq(products.sku, item.sku));
    }

    return NextResponse.json({
      success: true,
      data: {
        id: newSale.id,
        total,
        paymentMethod,
        customerName,
        customerPhone,
        items,
      },
    });
  } catch (error: any) {
    console.error('Error creating sale:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// GET - Récupérer toutes les ventes
export async function GET() {
  try {
    const salesData = await db.select().from(sales).orderBy(sales.created_at);

    // Formater les données pour le frontend
    const formattedSales = salesData.map((sale) => ({
      id: sale.id,
      date: sale.created_at,
      total: sale.total_amount / 100, // Convertir en euros
      paymentMethod: sale.payment_method,
      paymentStatus: sale.payment_status,
      customerName: sale.customer_name,
      customerPhone: sale.customer_phone,
      items: sale.items, // Les articles sont déjà stockés en JSON
      itemCount: sale.items ? (Array.isArray(sale.items) ? sale.items.length : 0) : 0,
    }));

    return NextResponse.json({
      success: true,
      data: formattedSales,
    });
  } catch (error: any) {
    console.error('Error fetching sales:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}