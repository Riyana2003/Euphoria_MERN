import { useEffect, useContext, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { toast } from 'react-toastify';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const { backendUrl, token } = useContext(ShopContext) || { backendUrl: 'http://localhost:4000', token: null };
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyPayment = async () => {
      const pidx = searchParams.get('pidx');

      if (!pidx) {
        toast.error('Invalid payment details. Please try again.');
        navigate('/orders');
        return;
      }

      try {
        const response = await fetch(`${backendUrl}/api/order/khalti/verify`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token || localStorage.getItem('authToken')}`,
          },
          body: JSON.stringify({ pidx }),
        });

        const result = await response.json();

        if (response.ok && result.success) {
          toast.success('Payment verified successfully!');
        } else {
          toast.error(result.message || 'Payment verification failed');
        }
      } catch (error) {
        console.error('Payment verification failed:', error);
        toast.error('Payment verification failed. Please try again.');
      } finally {
        setIsLoading(false);
        navigate('/orders');
      }
    };

    verifyPayment();
  }, [searchParams, navigate, backendUrl, token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        {isLoading ? (
          <>
            <h1 className="text-2xl font-bold mb-4">Processing Payment...</h1>
            <p className="text-gray-600">Please wait while we confirm your payment</p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-4">Payment Verified</h1>
            <p className="text-gray-600">Your payment has been successfully verified.</p>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;