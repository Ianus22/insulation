import { stripe } from '@/services/stripe';
import { User } from 'firebase/auth';

enum SubscriptionType {
  Free,
  Monthly,
  Yearly
}

async function APIPurchaseSubscription(user: User, type: SubscriptionType) {
  const req = await fetch('/api/subscription/purchase', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + (await user.getIdToken())
    },
    body: JSON.stringify({ isMonthly: type === SubscriptionType.Monthly })
  });

  const result = await req.json();

  const stripeFrontend = (await stripe)!;

  return () =>
    stripeFrontend.redirectToCheckout({
      sessionId: result.id
    });
}

async function APIGetSubscriptionStatus(user: User) {
  const req = await fetch('/api/subscription/status', {
    headers: {
      Authorization: 'Bearer ' + (await user.getIdToken())
    }
  });

  const { subscription } = await req.json();

  return subscription as {
    id: string;
    start: number;
    end: number;
    isMonthly: boolean;
  };
}

async function APICancelSubscription(user: User) {
  await fetch('/api/subscription/cancel', {
    method: 'DELETE',
    headers: {
      Authorization: 'Bearer ' + (await user.getIdToken())
    }
  });
}

export { APIPurchaseSubscription, APIGetSubscriptionStatus, APICancelSubscription, SubscriptionType };

