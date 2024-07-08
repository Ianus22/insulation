import { databaseAdmin } from './firebaseAdmin';
import Stripe from 'stripe';

const stripeAdmin = new Stripe(process.env.STRIPE_SECRET_KEY as string);

async function getCustomerIdFromUserId(userId: string): Promise<string | null> {
  const customerId = (await databaseAdmin.ref(`/Users/${userId}/CustomerID`).get()).val() ?? '';
  return customerId.trim().length == 0 ? null : customerId;
}

async function checkSubscription(customerId: string | null) {
  if (customerId == null) return null;

  const { data: subscriptions } = await stripeAdmin.subscriptions.list({ customer: customerId });
  if (subscriptions.length == 0) return null;

  const subscription = subscriptions[0];

  return {
    id: subscription.id,
    start: subscription.current_period_start,
    end: subscription.current_period_end,
    isMonthly: (subscription as any).plan?.interval === 'month'
  };
}

export { stripeAdmin, getCustomerIdFromUserId, checkSubscription };

