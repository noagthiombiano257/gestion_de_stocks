"use server";

import { db } from "@shopflow/db";
import { products, stockMovements } from "@shopflow/db";
import { eq, desc } from "drizzle-orm";

// Tous les mouvements de stock (avec nom du produit)
export async function getAllStockMovements() {
  const rows = await db
    .select({
      id: stockMovements.id,
      quantity: stockMovements.quantity,
      type: stockMovements.reason,
      createdAt: stockMovements.created_at,
      productName: products.name,
    })
    .from(stockMovements)
    .leftJoin(products, eq(stockMovements.product_id, products.id))
    .orderBy(desc(stockMovements.created_at));

  return rows.map((r) => ({
    ...r,
    type: r.type ?? "N/A",
    productName: r.productName ?? "Produit supprimé",
    createdAt: r.createdAt ?? new Date(),
  }));
}

// Un produit par ID
export async function getProductById(id: number) {
  const result = await db
    .select()
    .from(products)
    .where(eq(products.id, id))
    .limit(1);

  return result[0] ?? null;
}

// Mouvements d'un produit spécifique
export async function getStockMovements(productId: number) {
  const rows = await db
    .select()
    .from(stockMovements)
    .where(eq(stockMovements.product_id, productId))
    .orderBy(desc(stockMovements.created_at));

  return rows.map((r) => ({
    id: r.id,
    quantity: r.quantity,
    type: r.reason ?? "N/A",
    createdAt: r.created_at ?? new Date(),
  }));
}