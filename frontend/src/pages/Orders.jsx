/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Orders = () => {
  const { products, backendUrl, token, currency } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrderData();
  }, []);

  const loadOrderData = async () => {
    setLoading(true);
    try {
      if (!token) {
        console.error('No token found.');
        return;
      }

      const response = await fetch(`${backendUrl}/api/order/userorders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token || localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ userId: localStorage.getItem('userId') }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Data:', data);

      if (!data.success) {
        toast.error(data.message || 'Failed to fetch orders.');
        return;
      }

      // Merge product details with order items
      const allOrdersItem = (data.data || []).flatMap(order =>
        (order.items || []).map(item => {
          const product = products.find(p => p._id === item._id); // Find the product details
          return {
            ...item,
            productData: product, // Store the entire product object
            status: order.status,
            payment: order.payment,
            paymentMethod: order.paymentMethod,
            date: order.date,
          };
        })
      );

      setOrderData(allOrdersItem.reverse());
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders. Please try again.');
      setOrderData([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-gray-500 text-center py-8">Loading orders...</p>;

  return (
    <div className='border-t pt-16'>
      <h2 className='text-2xl'>My Orders</h2>
      <div>
        {orderData?.length > 0 ? (
          orderData?.map((item, index) => {
            const productData = item.productData; // Get product data from the item
            return (
              <div key={index} className='py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                <div className='flex items-start gap-6 text-sm'>
                  <img className='w-16 sm:w-20' src={productData?.image[0]} alt={productData?.name} />
                  <div>
                    <p className='sm:text-base font-medium'>{productData?.name}</p>
                    <div className='flex items-center gap-3 mt-2 text-base text-gray-700'>
                      <p className='text-lg'>{currency}{productData?.price}</p>
                      <p>Quantity: {item.quantity}</p>
                      <p>Shade: {item.shade}</p>
                    </div>
                    <p className='mt-2'>Date: <span className='text-gray-400'>{item.date ? new Date(item.date).toLocaleDateString() : 'N/A'}</span></p>
                    {/* Display Payment Method */}
                    <p className='mt-2'>Payment Method: <span className='text-gray-400'>{item.paymentMethod || 'N/A'}</span></p>
                  </div>
                </div>
                <div className='md:w-1/2 flex justify-between'>
                  <div className='flex items-center gap-2'>
                    {/* Display Order Status */}
                    <p className={`min-w-2 h-2 rounded-full ${item.status === 'Ready to ship' ? 'bg-green-500' : 'bg-red-500'}`}></p>
                    <p className='text-sm md:text-base'>{item.status}</p>
                  </div>
                  <button className='border px-4 py-2 text-sm font-medium rounded-sm'>Order Status</button>
                </div>
              </div>
            );
          })
        ) : (
          <p className='text-gray-500 text-center py-8'>No orders found.</p>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Orders;