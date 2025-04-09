/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";

const Cart = () => {
  const { 
    products, 
    currency, 
    cartItems, 
    updateCart, 
    removeFromCart, 
    navigate,
    getTotalCartAmount,
    delivery_fee 
  } = useContext(ShopContext);
  
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      const tempData = [];
      for (const itemId in cartItems) {
        for (const shadeName in cartItems[itemId]) {
          const cartItem = cartItems[itemId][shadeName];
          if (cartItem.quantity > 0) {
            tempData.push({
              _id: itemId,
              shadeName: shadeName,
              quantity: cartItem.quantity,
              shadeData: cartItem.shadeData // Include shade data
            });
          }
        }
      }
      setCartData(tempData);
    }
  }, [cartItems, products]);

  const totalAmount = getTotalCartAmount();
  const discount = totalAmount > 100 ? totalAmount * 0.1 : 0;
  const grandTotal = totalAmount - discount + delivery_fee;

  return (
    <div className="p-8 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Your Shopping Cart</h2>
      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6">
        {/* Cart Items Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          {cartData.length > 0 ? (
            cartData.map((item, index) => {
              const productData = products.find((product) => product._id === item._id);
              return productData ? (
                <div key={index} className="flex justify-between items-center border-b pb-4 mb-4">
                  <div className="flex items-center gap-4">
                    <input type="checkbox" className="w-4 h-4" />
                    <img 
                      className="w-16 h-16 object-cover" 
                      src={item.shadeData?.image || productData?.image[0]} 
                      alt={productData?.name} 
                    />
                    <div>
                      <p className="text-lg font-medium">{productData?.name}</p>
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-gray-500">Shade: {item.shadeName}</p>
                        {item.shadeData?.colorCode && (
                          <div 
                            className="w-4 h-4 rounded-full border border-gray-300"
                            style={{ backgroundColor: item.shadeData.colorCode }}
                          />
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-2">
                        <button
                          className="p-1 bg-gray-200 rounded"
                          onClick={() => updateCart(item._id, item.shadeName, Math.max(1, item.quantity - 1))}
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          className="p-1 bg-gray-200 rounded"
                          onClick={() => updateCart(item._id, item.shadeName, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{currency}{(productData?.price * item.quantity).toFixed(2)}</p>
                    <button 
                      className="text-red-500 mt-2"
                      onClick={() => removeFromCart(item._id, item.shadeName)}
                    >
                      <img src={assets.trash} alt="Remove" className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <p key={index} className="text-red-500">Product not found</p>
              );
            })
          ) : (
            <p className="text-gray-500">Your cart is empty.</p>
          )}
        </div>

        {/* Order Summary Section */}
        <div className="bg-white p-6 rounded-lg shadow-md h-fit sticky top-4">
          <h3 className="text-lg font-bold mb-4">Order Summary</h3>
          <div className="space-y-3 mb-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{currency}{totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-green-600">
              <span>Discount (10%)</span>
              <span>- {currency}{discount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>{currency}{delivery_fee.toFixed(2)}</span>
            </div>
          </div>
          <div className="border-t pt-3 mb-4">
            <div className="flex justify-between font-semibold text-lg">
              <span>Grand Total</span>
              <span>{currency}{grandTotal.toFixed(2)}</span>
            </div>
          </div>
          <button 
            onClick={() => navigate('/place-order')}
            className={`w-full py-3 rounded-lg text-center font-semibold ${
              cartData.length > 0 
                ? 'bg-pink-500 hover:bg-pink-600 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            disabled={cartData.length === 0}
          >
            PROCEED TO CHECKOUT
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;