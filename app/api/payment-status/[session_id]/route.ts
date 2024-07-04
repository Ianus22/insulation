// pages/api/payment-status.ts
import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20'
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const sessionId = req.query.session_id as string;
    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      res.status(200).json({ session });
    } catch (error) {
      res.status(500).json({ error: 'Unable to retrieve session' });
    }
  } else {
    res.setHeader('Allow', 'GET');
    res.status(405).end('Method Not Allowed');
  }
};

export default handler;
