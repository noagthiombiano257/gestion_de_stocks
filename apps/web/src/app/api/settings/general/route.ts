import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Simulate saving to database (in real app, save to DB)
    console.log('Saving general settings:', body);
    
    return NextResponse.json({
      success: true,
      message: 'Paramètres généraux enregistrés avec succès'
    });
  } catch (error) {
    console.error('Error saving general settings:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de l\'enregistrement des paramètres' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Return default settings (in real app, fetch from DB)
    const defaultSettings = {
      companyName: 'ShopFlow SARL',
      companyEmail: 'contact@shopflow.fr',
      timezone: 'Africa/Ouagadougou',
      language: 'fr',
      dateFormat: 'DD/MM/YYYY',
      currency: 'XOF'
    };
    
    return NextResponse.json({
      success: true,
      data: defaultSettings
    });
  } catch (error) {
    console.error('Error fetching general settings:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération des paramètres' },
      { status: 500 }
    );
  }
}
