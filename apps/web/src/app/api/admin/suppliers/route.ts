import { NextRequest, NextResponse } from 'next/server';

// Simuler une base de données en mémoire
let suppliers: any[] = [
  {
    id: '1',
    name: 'TechSupply Inc.',
    contact: 'Marie Dubois',
    email: 'marie.dubois@techsupply.fr',
    phone: '+33 1 23 45 67 89',
    address: '15 Rue de la Technologie, 75001 Paris',
    productsCount: 24,
    totalSpent: 125000,
    lastOrder: '2024-01-10',
    status: 'active'
  },
  {
    id: '2',
    name: 'Global Electronics',
    contact: 'Pierre Martin',
    email: 'pierre.martin@globalelec.com',
    phone: '+33 4 56 78 90 12',
    address: '42 Avenue des Affaires, 69002 Lyon',
    productsCount: 18,
    totalSpent: 89500,
    lastOrder: '2024-01-12',
    status: 'active'
  },
  {
    id: '3',
    name: 'Office Solutions Ltd',
    contact: 'Sophie Laurent',
    email: 'sophie.laurent@officesol.fr',
    phone: '+33 5 67 89 01 23',
    address: '8 Boulevard du Commerce, 33000 Bordeaux',
    productsCount: 31,
    totalSpent: 156800,
    lastOrder: '2024-01-08',
    status: 'active'
  }
];

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: suppliers
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération des fournisseurs' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const newSupplier = {
      id: `sup-${Date.now()}`,
      ...body,
      productsCount: 0,
      totalSpent: 0,
      lastOrder: new Date().toISOString().split('T')[0]
    };
    
    suppliers.push(newSupplier);
    
    return NextResponse.json({
      success: true,
      data: newSupplier
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Erreur lors de l\'ajout du fournisseur' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    
    const index = suppliers.findIndex(supplier => supplier.id === id);
    
    if (index === -1) {
      return NextResponse.json(
        { success: false, error: 'Fournisseur non trouvé' },
        { status: 404 }
      );
    }
    
    suppliers[index] = { ...suppliers[index], ...updateData };
    
    return NextResponse.json({
      success: true,
      data: suppliers[index]
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la mise à jour du fournisseur' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID du fournisseur requis' },
        { status: 400 }
      );
    }
    
    const index = suppliers.findIndex(supplier => supplier.id === id);
    
    if (index === -1) {
      return NextResponse.json(
        { success: false, error: 'Fournisseur non trouvé' },
        { status: 404 }
      );
    }
    
    suppliers.splice(index, 1);
    
    return NextResponse.json({
      success: true,
      message: 'Fournisseur supprimé avec succès'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la suppression du fournisseur' },
      { status: 500 }
    );
  }
}
