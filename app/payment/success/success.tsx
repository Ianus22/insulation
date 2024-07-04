// pages/success.tsx
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const SuccessPage: React.FC = () => {
  const router = useRouter();
  //   const { session_id } = use;
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);

  useEffect(() => {
    if (session_id) {
      fetch(`/api/payment-status/${session_id}`)
        .then(response => response.json())
        .then(data => {
          if (data.session && data.session.payment_status === 'paid') {
            setPaymentStatus('Payment successful!');
          } else {
            setPaymentStatus('Payment not verified.');
          }
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching payment status:', error);
          setPaymentStatus('Payment not verified.');
          setLoading(false);
        });
    }
  }, [session_id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{paymentStatus}</h1>
    </div>
  );
};

export default SuccessPage;
