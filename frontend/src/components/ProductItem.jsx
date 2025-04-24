/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useContext, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link, useNavigate } from 'react-router-dom'; // Added useNavigate
import { assets } from "../assets/assets";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductItem = ({ id, image, name, price, brand, bestseller }) => {
  const { currency, addToCart } = useContext(ShopContext);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate(); // Initialize navigate

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart({ id, name, price, image: image[0] });
  };

  // New function to handle product click with scroll to top
  const handleProductClick = (e) => {
    e.preventDefault();
    window.scrollTo(0, 0); // Scroll to top before navigation
    navigate(`/product/${id}`);
  };


  return (
    <div 
      className="relative border p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Bestseller Badge */}
      {bestseller && (
        <div className="absolute top-2 left-2 bg-pink-500 text-white text-xs px-2 py-1 rounded">
          Bestseller
        </div>
      )}

      {/* Updated Link to use onClick handler */}
      <div className="text-gray-700 cursor-pointer" onClick={handleProductClick}>
        <div className="overflow-hidden rounded-lg relative">
          <img
            className={`w-full h-48 object-cover transition-transform duration-500 ${
              isHovered ? 'scale-105' : 'scale-100'
            }`}
            src={image[0]}
            alt={name}
          />
          {/* Brand Tag */}
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
            {brand}
          </div>
        </div>

        <div className="mt-3">
          <p className="text-sm font-semibold text-gray-800 line-clamp-2 h-12">{name}</p>
          <div className="flex justify-between items-center mt-2">
            <p className="text-lg font-bold text-pink-600">
              {currency} {price.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Add to Cart Button - Only shows on hover */}
      <div className={`mt-4 transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
        <button
          className="w-full flex items-center justify-center bg-pink-500 text-white px-4 py-2 rounded-full shadow hover:bg-pink-600 transition-colors"
          onClick={handleAddToCart}
        >
          <img src={assets.cart} className="w-5 h-5 mr-2" alt="Cart" />
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductItem;