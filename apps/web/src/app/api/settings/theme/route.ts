import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Simulate saving to database (in real app, save to DB)
    console.log('Saving theme settings:', body);
    
    return NextResponse.json({
      success: true,
      message: 'Thème enregistré avec succès'
    });
  } catch (error) {
    console.error('Error saving theme settings:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de l\'enregistrement du thème' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Return default theme settings (in real app, fetch from DB)
    const defaultTheme = {
      theme: 'dark',
      accentColor: '#8b5cf6'
    };
    
    return NextResponse.json({
      success: true,
      data: defaultTheme
    });
  } catch (error) {
    console.error('Error fetching theme settings:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération du thème' },
      { status: 500 }
    );
  }
}
