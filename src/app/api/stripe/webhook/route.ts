// src/app/api/stripe/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-server';
import { getStripeClient } from '@/lib/stripe';
import type Stripe from 'stripe';
import { headers } from 'next/headers';

// Maps Stripe Price IDs (from environment variables) back to your internal plan IDs
const priceIdToPlanId: { [key: string]: string } = {
  [process.env.CREATOR_MONTHLY || '']: 'creator',
  [process.env.CREATOR_ANNUAL || '']: 'creator',
  [process.env.PRO_MONTHLY || '']: 'pro',
  [process.env.PRO_ANNUAL || '']: 'pro',
};

// Function to get planId from a Stripe priceId
const getPlanFromPriceId = (priceId: string): string => {
    return priceIdToPlanId[priceId] || 'free';
}

export async function POST(req: NextRequest) {
  const stripe = getStripeClient();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('[Stripe Webhook] Error: STRIPE_WEBHOOK_SECRET is not set.');
    return NextResponse.json({ error: 'Webhook secret is not configured.' }, { status: 500 });
  }

  const signature = headers().get('stripe-signature');
  if (!signature) {
    return NextResponse.json({ error: 'No stripe-signature header value was provided.' }, { status: 400 });
  }

  let event: Stripe.Event;
  const body = await req.text();

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`[Stripe Webhook] Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  console.log(`[Stripe Webhook] Received event: ${event.type}`);

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      // This event is now primarily for logging, as subscription.created/updated is more reliable.
      if (session.mode === 'subscription' && session.payment_status === 'paid') {
          console.log(`[Stripe Webhook] Checkout session for subscription ${session.subscription} completed successfully.`);
      }
      break;
    }

    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription;
      const firebaseUID = subscription.metadata.firebaseUID;
      const priceId = subscription.items.data[0]?.price.id;

      if (!firebaseUID || !priceId) {
        console.error(`[Stripe Webhook] Critical: firebaseUID or priceId not found in subscription metadata for subscription ${subscription.id}`);
        break;
      }
      
      const planId = getPlanFromPriceId(priceId);

      const userDocRef = adminDb.collection('users').doc(firebaseUID);
      await userDocRef.update({
        stripeSubscriptionId: subscription.id,
        stripePriceId: priceId,
        stripeSubscriptionStatus: subscription.status,
        planId: planId, // <-- CRITICAL: Update the user's plan
      });
      
      console.log(`[Stripe Webhook] Subscription for user ${firebaseUID} updated. New plan: ${planId}, Status: ${subscription.status}`);
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      const firebaseUID = subscription.metadata.firebaseUID;

      if (!firebaseUID) {
        console.warn(`[Stripe Webhook] firebaseUID not found in subscription metadata for deleted subscription ${subscription.id}.`);
        break;
      }
      
      const userDocRef = adminDb.collection('users').doc(firebaseUID);
      await userDocRef.update({
        stripeSubscriptionId: null,
        stripePriceId: null,
        stripeSubscriptionStatus: subscription.status,
        planId: 'free', // Revert user to the free plan
      });
      
      console.log(`[Stripe Webhook] Subscription for user ${firebaseUID} was canceled. User reverted to 'free' plan.`);
      break;
    }
      
    default:
      console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
