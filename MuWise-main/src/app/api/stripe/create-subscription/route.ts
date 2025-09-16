// src/app/api/stripe/create-subscription/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getStripeClient, findOrCreateStripeCustomer } from '@/lib/stripe';
import { adminAuth } from '@/lib/firebase-server';

const stripePriceIds: { [key: string]: string | undefined } = {
  creator_monthly: process.env.CREATOR_MONTHLY,
  creator_annual: process.env.CREATOR_ANNUAL,
  pro_monthly: process.env.PRO_MONTHLY,
  pro_annual: process.env.PRO_ANNUAL,
};

export async function POST(req: NextRequest) {
  console.log('=== INICIANDO CREACIÓN DE SESIÓN DE CHECKOUT ===');
  
  try {
    const idToken = req.headers.get('authorization')?.split('Bearer ')[1];
    if (!idToken) {
      console.error('[Stripe Checkout] Error de autenticación: No se proporcionó token.');
      return NextResponse.json({ error: 'Usuario no autenticado.' }, { status: 401 });
    }

    const { planId } = await req.json();
    console.log(`[Stripe Checkout] Plan ID recibido del cliente: ${planId}`);
    
    if (!planId) {
      console.error('[Stripe Checkout] Error de parámetro: Falta planId.');
      return NextResponse.json({ error: 'Falta el identificador del plan.' }, { status: 400 });
    }

    const stripePriceId = stripePriceIds[planId as keyof typeof stripePriceIds];
    console.log(`[Stripe Checkout] Mapeado a Stripe Price ID: ${stripePriceId}`);

    if (!stripePriceId) {
      const expectedVarName = Object.keys(stripePriceIds).find(key => key === planId)?.toUpperCase() || 'DESCONOCIDA';
      const errorMessage = `El ID de precio para el plan '${planId}' no está configurado en las variables de entorno del servidor. Se esperaba la variable '${expectedVarName}'.`;
      console.error(`[Stripe Checkout] CRITICAL: ${errorMessage}`);
      return NextResponse.json({ error: `Configuración de servidor incompleta para el plan '${planId}'.` }, { status: 500 });
    }
    
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const { uid, email, name } = decodedToken;
    console.log(`[Stripe Checkout] Usuario autenticado: ${uid}`);

    const customerId = await findOrCreateStripeCustomer(uid, email, name);
    console.log(`[Stripe Checkout] Usando Customer ID de Stripe: ${customerId}`);
    
    const stripe = getStripeClient();
    const requestOrigin = req.headers.get('origin') || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer: customerId,
      line_items: [
        {
          price: stripePriceId,
          quantity: 1,
        },
      ],
      success_url: `${requestOrigin}/dashboard/billing?session_id={CHECKOUT_SESSION_ID}&status=success`,
      cancel_url: `${requestOrigin}/dashboard/billing?status=cancelled`,
      subscription_data: {
        metadata: {
          firebaseUID: uid,
          planId: planId,
        }
      }
    });

    if (session.url) {
      console.log(`[Stripe Checkout] Sesión creada exitosamente. URL: ${session.url}`);
      return NextResponse.json({ sessionId: session.id, url: session.url });
    } else {
      throw new Error('La sesión de Stripe Checkout no devolvió una URL.');
    }

  } catch (error: any) {
    console.error('[Stripe Checkout] CRÍTICO: Falló la creación de la sesión de Checkout. Error detallado:', error);
    const errorMessage = error.message || "No se pudo iniciar el proceso de pago debido a un error del servidor.";
    
    if (error.type === 'StripeInvalidRequestError' && error.code === 'resource_missing' && error.param?.includes('price')) {
      return NextResponse.json({ error: `El ID de precio configurado para el plan no existe en Stripe. Verifica que la variable de entorno sea correcta y que el precio exista en el modo (test/live) correcto de Stripe.` }, { status: 500 });
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
