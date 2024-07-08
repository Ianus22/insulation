import { checkSubscription, getCustomerIdFromUserId, stripeAdmin } from '@/services/stripeAdmin';
import { NextRequest, NextResponse } from 'next/server';
import { getUserIdFromRequest } from '@/services/auth';

const PRICE_IDS = {
  Monthly: 'price_1PaDFsRoqFsZZLyxMkcoM9hr',
  Yearly: 'price_1PaDJkRoqFsZZLyxCUGyMLmM'
} as const;

export async function POST(request: NextRequest) {
  let data: any = null;
  try {
    data = await request.json();
  } catch {}

  if (data == null || typeof data !== 'object' || typeof data.isMonthly !== 'boolean')
    return new NextResponse('Invalid body.', { status: 400 });

  const userId = await getUserIdFromRequest(request);

  if (userId == null) return new Response('Unauthorized', { status: 401 });

  const customerId = await getCustomerIdFromUserId(userId);

  const subscription = await checkSubscription(customerId);

  if (subscription != null) return new Response('Cannot buy subscription again!', { status: 400 });

  const priceId = data.isMonthly ? PRICE_IDS.Monthly : PRICE_IDS.Yearly;

  const checkoutSession = await stripeAdmin.checkout.sessions.create({
    line_items: [
      {
        price: priceId,
        quantity: 1
      }
    ],
    customer: customerId == null ? undefined : customerId,
    mode: 'subscription',
    success_url: `${process.env.NEXT_BASE_URL}/pricing`,
    cancel_url: `${process.env.NEXT_BASE_URL}/pricing`,
    metadata: {
      userId,
      priceId
    }
  });

  return NextResponse.json(checkoutSession);
}

