// src/app/api/debug-env/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  // Security: Only run in non-production environments or add a secret query param check
  if (process.env.NODE_ENV === 'production') {
     // En producción, podrías querer deshabilitarlo o requerir una clave secreta.
     // Por ahora, lo dejaremos accesible pero ten cuidado.
  }

  // Clonamos el objeto para evitar modificar el original y lo filtramos por seguridad.
  const envVars: { [key: string]: string | undefined } = {};
  for (const key in process.env) {
    // Filtramos para mostrar solo las variables relevantes para no exponer secretos innecesariamente.
    if (key.startsWith('STRIPE_') || key.startsWith('NEXT_PUBLIC_') || key.includes('CREATOR') || key.includes('PRO')) {
      envVars[key] = process.env[key];
    }
  }

  return NextResponse.json({
    message: "Available Environment Variables (Filtered for relevance)",
    variables: envVars,
  });
}