'use client';

import { useEffect } from 'react';

const PaymentPage: React.FC = () => {
  useEffect(() => {
    const redirectToStripe = () => {
      const paymentLink = 'https://buy.stripe.com/test_fZe3ehd07dXK0Te7ss'; // Replace with your actual Stripe payment link
      window.location.href = paymentLink;
    };

    redirectToStripe();
  }, []);

  return <div>Redirecting to Stripe...</div>;
};

export default PaymentPage;
