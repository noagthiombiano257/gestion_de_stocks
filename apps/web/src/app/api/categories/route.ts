import { NextRequest, NextResponse } from 'next/server';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { pgTable, serial, varchar, text, timestamp } from 'drizzle-orm/pg-core';
import { desc, eq } from 'drizzle-orm';

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

// GET - Liste toutes les catégories
export async function GET() {
  try {
    const allCategories = await db
      .select()
      .from(categories)
      .orderBy(desc(categories.id));

    return NextResponse.json({
      success: true,
      data: allCategories,
    });
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST - Créer une nouvelle catégorie
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, color } = body;

    // Validation des champs requis
    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Category name is required' },
        { status: 400 }
      );
    }

    // Créer la catégorie
    const [newCategory] = await db
      .insert(categories)
      .values({ 
        name: name.trim(), 
        description: description ? description.trim() : null,
        color: color || '#3b82f6' // Couleur bleue par défaut
      })
      .returning();

    return NextResponse.json({
      success: true,
      data: newCategory,
      message: 'Category created successfully',
    });
  } catch (error: any) {
    console.error('Error creating category:', error);
    
    // Gestion spécifique pour les erreurs de contrainte unique (nom dupliqué)
    if (error.code === '23505') {
      if (error.constraint === 'categories_name_key') {
        return NextResponse.json(
          { 
            success: false, 
            error: 'This category name already exists.',
            field: 'name'
          },
          { status: 409 }
        );
      }
    }
    
    // Autres erreurs
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create category' },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour une catégorie
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, description, color } = body;

    // Validation des champs requis
    if (!id || !name) {
      return NextResponse.json(
        { success: false, error: 'Category ID and name are required' },
        { status: 400 }
      );
    }

    // Mettre à jour la catégorie
    const [updatedCategory] = await db
      .update(categories)
      .set({ 
        name: name.trim(),
        description: description ? description.trim() : null,
        color: color || '#3b82f6',
        updated_at: new Date()
      })
      .where(eq(categories.id, id))
      .returning();

    if (!updatedCategory) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedCategory,
      message: 'Category updated successfully',
    });
  } catch (error: any) {
    console.error('Error updating category:', error);
    
    // Gestion spécifique pour les erreurs de contrainte unique (nom dupliqué)
    if (error.code === '23505') {
      if (error.constraint === 'categories_name_key') {
        return NextResponse.json(
          { 
            success: false, 
            error: 'This category name already exists.',
            field: 'name'
          },
          { status: 409 }
        );
      }
    }
    
    // Autres erreurs
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update category' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer une catégorie
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Category ID is required' },
        { status: 400 }
      );
    }

    // Supprimer la catégorie
    const [deletedCategory] = await db
      .delete(categories)
      .where(eq(categories.id, parseInt(id)))
      .returning();

    if (!deletedCategory) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: deletedCategory,
      message: 'Category deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting category:', error);
    
    // Gération spécifique pour les erreurs de contrainte étrangère
    if (error.code === '23503') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Cannot delete category: it is being used by products',
          field: 'products'
        },
        { status: 409 }
      );
    }
    
    // Autres erreurs
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete category' },
      { status: 500 }
    );
  }
}