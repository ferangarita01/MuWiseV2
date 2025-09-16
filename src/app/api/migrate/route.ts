import { NextResponse } from 'next/server';
import { migrateAgreements } from '@/lib/scripts/migrateAgreements';

export async function GET(request: Request) {
  // AÑADE UNA CAPA DE SEGURIDAD - ¡CAMBIA ESTA CLAVE!
  // Para ejecutar, visita: /api/migrate?secret=MI_CLAVE_SECRETA
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');

  // Asegúrate de usar una clave secreta fuerte en un entorno real
  if (secret !== 'firebase-1234') { 
    return NextResponse.json({ error: 'Unauthorized: Invalid or missing secret key.' }, { status: 401 });
  }

  try {
    console.log('API route triggered for migration.');
    const result = await migrateAgreements();
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error running migration from API route:', error);
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}
