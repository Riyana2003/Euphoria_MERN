/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useContext, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';
import { assets } from "../assets/assets";

const ProductItem = ({ id, image, name, price }) => {
  const { currency } = useContext(ShopContext);
  const [rating, setRating] = useState(0); 

  const handleAddToCart = () => {
    console.log(`Product ${id} added to cart`); 
  };

  const renderStars = () => {
    return Array(5)
      .fill(0)
      .map((_, index) => (
        <span
          key={index}
          className={`cursor-pointer text-lg ${
            index < rating ? 'text-yellow-500' : 'text-gray-400'
          }`}
          onClick={() => setRating(index + 1)}
        >
          ★
        </span>
      ));
  };

  return (
    <div className="border p-4 rounded-lg shadow-md">
      <Link className="text-gray-700 cursor-pointer" to={`/product/${id}`}>
        <div className="overflow-hidden rounded-lg">
          <img
            className="hover:scale-110 transition ease-in-out w-full h-48 object-cover"
            src={image[0]}
            alt={name}
          />
        </div>
        <p className="text-center text-sm font-medium mt-2">
          {currency} {price}
        </p>
        <p className="pt-3 pb-1 text-sm text-center font-semibold">{name}</p>
      </Link>

      {/* Rating Stars */}
      <div className="flex justify-center mt-2">{renderStars()}</div>

      {/* Add to Cart Button */}
      <div className="flex justify-center mt-4">
        <button
          className="flex items-center bg-pink-500 text-white px-4 py-2 rounded-full shadow-md hover:bg-pink-600 transition ease-in-out"
          onClick={handleAddToCart}
        >
          <img src={assets.cart} className="w-5 h-5 mr-2" />
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductItem;
