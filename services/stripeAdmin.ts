import { databaseAdmin } from './firebaseAdmin';
import Stripe from 'stripe';

const stripeAdmin = new Stripe(process.env.STRIPE_SECRET_KEY as string);

async function getCustomerIdFromUserId(userId: string): Promise<string> {
  const customerId = (await databaseAdmin.ref(`/Users/${userId}/CustomerID`).get()).val() ?? '';
  return customerId.trim().length == 0 ? null : customerId;
}

export { stripeAdmin, getCustomerIdFromUserId };

