// src/lib/stripe.ts
import Stripe from 'stripe';
import { adminDb } from '@/lib/firebase-server';

export function getStripeClient(): Stripe {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeSecretKey) {
    console.error('[Stripe Setup] CRITICAL: STRIPE_SECRET_KEY environment variable is not set.');
    throw new Error('The Stripe secret key is not configured on the server.');
  }

  return new Stripe(stripeSecretKey, {
    apiVersion: '2024-06-20',
    typescript: true,
  });
}

export async function findOrCreateStripeCustomer(userId: string, email?: string | null, name?: string | null): Promise<string> {
  const userDocRef = adminDb.collection('users').doc(userId);
  const userDoc = await userDocRef.get();
  const userData = userDoc.data();
  const stripe = getStripeClient();

  if (userData?.stripeCustomerId) {
    try {
      const customer = await stripe.customers.retrieve(userData.stripeCustomerId);
      if (!customer.deleted) {
        console.log(`[Stripe] Found and verified existing customer ID: ${userData.stripeCustomerId} for user ${userId}`);
        return customer.id;
      }
    } catch (error) {
      console.warn(`[Stripe] Could not retrieve customer ${userData.stripeCustomerId}. It might be deleted or invalid. Creating a new one.`, error);
    }
  }
  
  console.log(`[Stripe] No valid Stripe customer ID found for user ${userId}. Creating new customer...`);
  try {
    const customer = await stripe.customers.create({
      email: email || undefined,
      name: name || undefined,
      metadata: {
        firebaseUID: userId,
      },
    });

    await userDocRef.set({
      stripeCustomerId: customer.id,
    }, { merge: true });

    console.log(`[Stripe] Created and saved new Stripe customer ID: ${customer.id}`);
    return customer.id;
  } catch(error: any) {
    console.error("[Stripe] CRITICAL: Failed to create Stripe customer.", error);
    throw new Error(`Could not create a customer profile in the payment system: ${error.message}`);
  }
}
