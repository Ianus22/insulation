import { checkSubscription, getCustomerIdFromUserId, stripeAdmin } from '@/services/stripeAdmin';
import { NextRequest, NextResponse } from 'next/server';
import { getUserIdFromRequest } from '@/services/auth';

export async function DELETE(request: NextRequest) {
  const userId = await getUserIdFromRequest(request);

  if (userId == null) return new Response('Unauthorized', { status: 401 });

  const customerId = await getCustomerIdFromUserId(userId);

  const subscription = await checkSubscription(customerId);

  if (subscription == null) return new Response("You don't have an active subscription!", { status: 400 });

  await stripeAdmin.subscriptions.cancel(subscription.id);

  return new NextResponse('OK');
}

