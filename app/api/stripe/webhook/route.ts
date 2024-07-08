import { databaseAdmin } from '@/services/firebaseAdmin';
import { NextRequest } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';

type METADATA = {
  userId: string;
  priceId: string;
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  const body = await request.text();
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;
  const sig = headers().get('stripe-signature') as string;
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    return new Response(`Webhook Error: ${err}`, {
      status: 400
    });
  }

  const eventType = event.type;
  if (eventType !== 'checkout.session.completed' && eventType !== 'checkout.session.async_payment_succeeded')
    return new Response('Server Error', {
      status: 500
    });
  const data = event.data.object;
  const metadata = data.metadata as METADATA;
  const userId = metadata.userId;

  try {
    await databaseAdmin.ref(`/Users/${userId}/CustomerID`).set(data.customer);
    console.log(data);

    return new Response('Subscription added', {
      status: 200
    });
  } catch (error) {
    return new Response('Server error', {
      status: 500
    });
  }
}

