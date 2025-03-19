/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import { useContext, useState } from 'react';
import ProductItem from './ProductItem';

const Trending = () => {
  const { products } = useContext(ShopContext);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    setTrendingProducts(products.slice(0, 10));
  }, [products]);

  const handleNext = () => {
    if (startIndex + 5 < trendingProducts.length) {
      setStartIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (startIndex > 0) {
      setStartIndex((prevIndex) => prevIndex - 1);
    }
  };

  return (
    <div className="my-10 w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Title and View All */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Trending</h2>
        <button className="text-pink-600 hover:underline text-sm sm:text-base font-medium">
          View All
        </button>
      </div>

      {/* Product Slider */}
      <div className="relative flex items-center">
        {/* Previous Button */}
        {startIndex > 0 && (
          <button
            onClick={handlePrevious}
            className="bg-white p-2 rounded-full shadow-md hover:bg-gray-200 transition"
          >
            &#8249;
          </button>
        )}

        {/* Product List */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 overflow-hidden flex-grow">
          {trendingProducts
            .slice(startIndex, startIndex + 5)
            .map((product, index) => (
              <ProductItem
                key={index}
                id={product._id}
                image={product.image}
                name={product.name}
                price={product.price}
              />
            ))}
        </div>

        {/* Next Button */}
        {startIndex + 5 < trendingProducts.length && (
          <button
            onClick={handleNext}
            className="bg-white p-2 rounded-full shadow-md hover:bg-gray-200 transition"
          >
            &#8250;
          </button>
        )}
      </div>
    </div>
  );
};

export default Trending;
