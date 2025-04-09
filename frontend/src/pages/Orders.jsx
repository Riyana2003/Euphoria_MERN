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

  // Load orders from localStorage on initial render
  useEffect(() => {
    const savedOrders = localStorage.getItem('userOrders');
    if (savedOrders) {
      setOrderData(JSON.parse(savedOrders));
    }
    loadOrderData();
  }, []);

  // Save orders to localStorage whenever they change
  useEffect(() => {
    if (orderData.length > 0) {
      localStorage.setItem('userOrders', JSON.stringify(orderData));
    }
  }, [orderData]);

  const loadOrderData = async () => {
    setLoading(true);
    try {
      if (!token) {
        console.error('No token found.');
        return;
      }

      const userId = localStorage.getItem('user_id');
      if (!userId) {
        toast.error('User ID not found. Please login again.');
        return;
      }

      const response = await fetch(`${backendUrl}/api/order/userorders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token || localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ userId }),
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

      // If products aren't loaded yet, wait a bit and retry
      if (!products || products.length === 0) {
        setTimeout(loadOrderData, 1000);
        return;
      }

      // Merge product details with order items
      const allOrdersItem = (data.data || []).flatMap(order =>
        (order.items || []).map(item => {
          const product = products.find(p => p._id === item._id);
          return {
            ...item,
            productData: product,
            status: order.status,
            payment: order.payment,
            paymentMethod: order.paymentMethod,
            date: order.date,
            orderId: order._id, // Add order ID for reference
          };
        })
      );

      setOrderData(allOrdersItem.reverse());
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders. Please try again.');
      
      // If API fails but we have cached data, keep showing that
      const savedOrders = localStorage.getItem('userOrders');
      if (savedOrders) {
        setOrderData(JSON.parse(savedOrders));
      } else {
        setOrderData([]);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className='border-t pt-16 px-4 max-w-7xl mx-auto'>
      <h2 className='text-2xl font-bold mb-8'>My Orders</h2>
      <div className='space-y-6'>
        {orderData?.length > 0 ? (
          orderData.map((item, index) => {
            const productData = item.productData;
            
            // Fallback if product data isn't available
            if (!productData) {
              return (
                <div key={index} className='py-4 border rounded-lg p-4 bg-gray-50'>
                  <p>Loading product details...</p>
                </div>
              );
            }

            return (
              <div 
                key={`${item.orderId}-${index}`} 
                className='py-4 border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow'
              >
                <div className='flex flex-col md:flex-row gap-6'>
                  <img 
                    className='w-24 h-24 object-cover rounded-lg border' 
                    src={productData?.image?.[0] || '/placeholder-product.jpg'} 
                    alt={productData?.name} 
                    onError={(e) => {
                      e.target.src = '/placeholder-product.jpg';
                    }}
                  />
                  <div className='flex-1'>
                    <div className='flex flex-col md:flex-row md:justify-between gap-4'>
                      <div>
                        <h3 className='text-lg font-medium'>{productData?.name}</h3>
                        <div className='flex flex-wrap items-center gap-3 mt-2 text-gray-700'>
                          <p className='font-semibold'>{currency}{productData?.price}</p>
                          <p>Quantity: {item.quantity}</p>
                          {item.shade && (
                            <div className='flex items-center gap-1'>
                              <span>Shade:</span>
                              {item.shadeData?.colorCode && (
                                <div 
                                  className='w-4 h-4 rounded-full border border-gray-300'
                                  style={{ backgroundColor: item.shadeData.colorCode }}
                                />
                              )}
                              <span>{item.shade}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className='flex flex-col items-end gap-2'>
                        <div className='flex items-center gap-2'>
                          <div className={`w-2 h-2 rounded-full ${
                            item.status === 'Delivered' ? 'bg-green-500' :
                            item.status === 'Processing' ? 'bg-blue-500' :
                            item.status === 'Shipped' ? 'bg-yellow-500' :
                            'bg-gray-500'
                          }`}></div>
                          <span className='text-sm capitalize'>{item.status || 'Processing'}</span>
                        </div>
                        <span className='text-sm text-gray-500'>
                          Ordered on: {new Date(item.date).toLocaleDateString()}
                        </span>
                        <span className='text-sm text-gray-500'>
                          Payment: {item.paymentMethod} ({item.payment ? 'Paid' : 'Pending'})
                        </span>
                      </div>
                    </div>
                    
                    <div className='mt-4 flex justify-end'>
                      <button 
                        className='px-4 py-2 border border-pink-500 text-pink-500 rounded-md hover:bg-pink-50 transition-colors'
                        onClick={() => window.location.href = `/track-order/${item.orderId}`}
                      >
                        Track Order
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className='text-center py-12'>
            <p className='text-gray-500 text-lg mb-4'>You have not placed any orders yet</p>
            <button 
              className='bg-pink-500 text-white px-6 py-2 rounded-md hover:bg-pink-600 transition-colors'
              onClick={() => window.location.href = '/'}
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Orders;