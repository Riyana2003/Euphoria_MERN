/* eslint-disable no-unused-vars */
import React, { useState, useContext, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PlaceOrder = () => {
  const { 
    currency, 
    backendUrl, 
    token, 
    setCartItems, 
    cartItems, 
    products, 
    navigate, 
    delivery_fee, 
    userId,
    getTotalCartAmount
  } = useContext(ShopContext);
  
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newAddress, setNewAddress] = useState({ type: '', details: '', contact: '' });
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [cartData, setCartData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedAddresses = JSON.parse(localStorage.getItem('addresses')) || [];
    setAddresses(savedAddresses);
  }, []);

  useEffect(() => {
    localStorage.setItem('addresses', JSON.stringify(addresses));
  }, [addresses]);

  useEffect(() => {
    const tempData = [];
    for (const itemId in cartItems) {
      for (const shadeName in cartItems[itemId]) {
        const cartItem = cartItems[itemId][shadeName];
        if (cartItem.quantity > 0) {
          const product = products.find((p) => p._id === itemId);
          if (product) {
            tempData.push({
              _id: itemId,
              shade: shadeName,
              quantity: cartItem.quantity,
              name: product.name,
              price: product.price,
              image: cartItem.shadeData?.image || product.image[0],
              shadeData: cartItem.shadeData
            });
          }
        }
      }
    }
    setCartData(tempData);
  }, [cartItems, products]);

  const totalAmount = getTotalCartAmount();
  const discount = totalAmount > 100 ? totalAmount * 0.1 : 0;
  const grandTotal = totalAmount - discount + delivery_fee;

  const handleAddAddress = () => {
    if (newAddress.type && newAddress.details && newAddress.contact) {
      const newId = addresses.length > 0 ? Math.max(...addresses.map(a => a.id)) + 1 : 1;
      const updatedAddresses = [...addresses, { id: newId, ...newAddress }];
      setAddresses(updatedAddresses);
      setNewAddress({ type: '', details: '', contact: '' });
      setShowModal(false);
      toast.success('Address added successfully!');
    } else {
      toast.error('Please fill all fields.');
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error('Please select an address.');
      return;
    }
    if (selectedPayment === null) {
      toast.error('Please select a payment method.');
      return;
    }
    if (!cartData.length) {
      toast.error('Your cart is empty. Please add items before placing an order.');
      return;
    }
  
    setIsLoading(true);
  
    try {
      const address = addresses.find((addr) => addr.id === selectedAddress);
      
      const orderData = {
        userId,
        items: cartData.map(item => ({
          _id: item._id,
          name: item.name,
          shade: item.shade,
          quantity: item.quantity,
          price: item.price,
          image: item.image,
          shadeData: item.shadeData || null
        })),
        amount: grandTotal,
        address: address.details,
        contact: address.contact,
        paymentMethod: selectedPayment === 0 ? 'COD' : 'Khalti',
      };

      console.log('Order Data:', orderData);

      let response;
      if (selectedPayment === 1) {
        // Khalti payment
        response = await fetch(`${backendUrl}/api/order/khalti/initiate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token || localStorage.getItem('authToken')}`,
          },
          body: JSON.stringify(orderData),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to initiate payment');
        }
  
        const { paymentUrl } = await response.json();
        window.location.href = paymentUrl;
      } else {
        // COD payment
        response = await fetch(`${backendUrl}/api/order/place`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token || localStorage.getItem('authToken')}`,
          },
          body: JSON.stringify(orderData),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to place order');
        }
  
        const result = await response.json();
        toast.success('Order placed successfully!');
        
        // Clear cart
        if (typeof setCartItems === 'function') {
          setCartItems({});
        }
        localStorage.removeItem('cart');
        
        navigate('/orders');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error(error.message || 'Failed to place order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className='flex flex-col sm:flex-row justify-between gap-6 pt-5 sm:pt-14 min-h-[80vh] border-t px-6'>
      {/* Left Side - Billing Details */}
      <div className='flex flex-col gap-6 w-full sm:max-w-[480px]'>
        <h2 className='text-2xl font-semibold'>Billing Details</h2>
        
        <div className='border rounded-lg p-4'>
          <h4 className='text-lg font-semibold mb-2'>Select Address</h4>
          {addresses.length > 0 ? (
            addresses.map((address) => (
              <div 
                key={address.id} 
                className={`p-3 border rounded-md cursor-pointer flex items-center gap-2 ${
                  selectedAddress === address.id ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`} 
                onClick={() => setSelectedAddress(address.id)}
              >
                <input 
                  type='radio' 
                  name='address' 
                  checked={selectedAddress === address.id} 
                  readOnly 
                  className='h-4 w-4'
                />
                <div>
                  <span className='font-semibold capitalize'>{address.type}</span>
                  <p className='text-sm text-gray-600'>{address.details}</p>
                  <p className='text-sm text-gray-600'>Contact: {address.contact}</p>
                </div>
              </div>
            ))
          ) : (
            <p className='text-gray-500 text-sm'>No addresses saved. Please add an address.</p>
          )}
          <button 
            className='text-blue-500 mt-2 flex items-center gap-1'
            onClick={() => setShowModal(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Address
          </button>
        </div>
        
        {/* Payment Options */}
        <h2 className='text-2xl font-semibold'>Select Payment Option</h2>
        <div className='flex gap-4 flex-wrap'>
          <button 
            className={`w-32 h-16 rounded-lg border-2 flex flex-col items-center justify-center ${
              selectedPayment === 0 ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`} 
            onClick={() => setSelectedPayment(0)}
          >
            <img src={assets.cod} alt='Cash on Delivery' className='w-10 h-10' />
            <span className='text-xs mt-1'>Cash on Delivery</span>
          </button>
          
          <button 
            className={`w-32 h-16 rounded-lg border-2 flex flex-col items-center justify-center ${
              selectedPayment === 1 ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`} 
            onClick={() => setSelectedPayment(1)}
          >
            <img src={assets.khalti} alt='Khalti Payment' className='w-10 h-10' />
            <span className='text-xs mt-1'>Khalti Pay</span>
          </button>
        </div>
      </div>
      
      {/* Right Side - Order Summary */}
      <div className='mt-8 w-full sm:max-w-[400px]'>
        <div className='bg-white p-6 rounded-lg shadow-md sticky top-4'>
          <h3 className='text-lg font-bold mb-4'>Order Summary</h3>
          
          <div className='mb-4 max-h-64 overflow-y-auto'>
            {cartData.map((item, index) => (
              <div key={index} className='flex items-center gap-3 mb-3 pb-3 border-b'>
                <img 
                  src={item.shadeData?.image?.[0]} 
                  alt={item.name} 
                  className='w-12 h-12 object-cover rounded'
                />
                <div className='flex-1'>
                  <p className='font-medium text-sm'>{item.name}</p>
                  <div className='flex items-center gap-2'>
                    <p className='text-xs text-gray-500'>Shade: {item.shade}</p>
                    {item.shadeData?.colorCode && (
                      <div 
                        className='w-3 h-3 rounded-full border border-gray-300'
                        style={{ backgroundColor: item.shadeData.colorCode }}
                      />
                    )}
                  </div>
                  <p className='text-xs text-gray-500'>Qty: {item.quantity}</p>
                </div>
                <p className='font-semibold text-sm'>{currency}{(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>

          <div className='space-y-2 mb-4'>
            <div className='flex justify-between'>
              <span>Subtotal</span>
              <span>{currency}{totalAmount.toFixed(2)}</span>
            </div>
            <div className='flex justify-between text-green-600'>
              <span>Discount (10%)</span>
              <span>- {currency}{discount.toFixed(2)}</span>
            </div>
            <div className='flex justify-between'>
              <span>Delivery Fee</span>
              <span>{currency}{delivery_fee.toFixed(2)}</span>
            </div>
          </div>

          <div className='border-t pt-3 mb-4'>
            <div className='flex justify-between font-semibold text-lg'>
              <span>Grand Total</span>
              <span>{currency}{grandTotal.toFixed(2)}</span>
            </div>
          </div>

          <button 
            onClick={handlePlaceOrder} 
            disabled={isLoading || !selectedAddress || !cartData.length}
            className={`w-full py-3 rounded-lg text-center font-semibold ${
              isLoading || !selectedAddress || !cartData.length
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-pink-500 hover:bg-pink-600 text-white'
            }`}
          >
            {isLoading ? (
              <span className='flex items-center justify-center gap-2'>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              'PLACE ORDER'
            )}
          </button>
        </div>
      </div>
      
      {/* Modal for Adding Address */}
      {showModal && (
        <div className='fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50'>
          <div className='bg-white p-5 rounded-lg shadow-lg w-full max-w-md'>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-lg font-bold'>Add New Address</h2>
              <button 
                onClick={() => setShowModal(false)}
                className='text-gray-500 hover:text-gray-700'
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className='space-y-3'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Address Type</label>
                <select
                  className='border border-gray-300 rounded py-2 px-3 w-full'
                  value={newAddress.type}
                  onChange={(e) => setNewAddress({ ...newAddress, type: e.target.value })}
                >
                  <option value="">Select Type</option>
                  <option value="home">Home</option>
                  <option value="work">Work</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Address Details</label>
                <textarea
                  className='border border-gray-300 rounded py-2 px-3 w-full'
                  placeholder='Street, City, Province'
                  rows={3}
                  value={newAddress.details}
                  onChange={(e) => setNewAddress({ ...newAddress, details: e.target.value })}
                />
              </div>
              
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Contact Number</label>
                <input
                  className='border border-gray-300 rounded py-2 px-3 w-full'
                  type='tel'
                  placeholder='98XXXXXXXX'
                  value={newAddress.contact}
                  onChange={(e) => setNewAddress({ ...newAddress, contact: e.target.value })}
                />
              </div>
            </div>
            
            <div className='flex justify-end gap-2 mt-4'>
              <button 
                className='bg-gray-300 px-4 py-2 rounded hover:bg-gray-400'
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button 
                className='bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600'
                onClick={handleAddAddress}
              >
                Save Address
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default PlaceOrder;
