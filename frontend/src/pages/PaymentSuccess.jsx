import { useEffect, useContext, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { toast } from 'react-toastify';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const { backendUrl, token, setCartItems } = useContext(ShopContext) || { backendUrl, token: null };
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const hasVerifiedRef = useRef(false); // Using `useRef` instead of state

  useEffect(() => {
    const verifyPayment = async () => {
      // Prevent multiple executions
      if (hasVerifiedRef.current) return;
      hasVerifiedRef.current = true; // Mark as verified immediately

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
        // Clear cart
        if (typeof setCartItems === 'function') {
          setCartItems({});
        }

        localStorage.removeItem('cart');
        setIsLoading(false);
        navigate('/orders');
      }
    };

    verifyPayment();

    // Cleanup function 
    return () => {
      hasVerifiedRef.current = true;
    };
  }, [searchParams, navigate, backendUrl, token, setCartItems]); 

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