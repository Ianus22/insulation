import { getCustomerIdFromUserId, stripeAdmin } from '@/services/stripeAdmin';
import { NextRequest, NextResponse } from 'next/server';
import { getUserIdFromRequest } from '@/services/auth';

const PRICE_IDS = {
  Basic: 'price_1PYm25RoqFsZZLyxYJ6en26A'
} as const;

export async function POST(request: NextRequest) {
  const userId = await getUserIdFromRequest(request);

  if (userId == null) return new Response('Unauthorized', { status: 401 });

  const customerId = await getCustomerIdFromUserId(userId);

  const checkoutSession = await stripeAdmin.checkout.sessions.create({
    line_items: [
      {
        price: PRICE_IDS.Basic,
        quantity: 1
      }
    ],
    customer: customerId.trim().length == 0 ? undefined : customerId,
    mode: 'subscription',
    success_url: `${process.env.NEXT_BASE_URL}/`,
    cancel_url: `${process.env.NEXT_BASE_URL}/`,
    metadata: {
      userId,
      priceId: PRICE_IDS.Basic
    }
  });

  return NextResponse.json(checkoutSession);
}

