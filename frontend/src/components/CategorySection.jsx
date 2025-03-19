/* eslint-disable no-unused-vars */
import React from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";

const categories = [
  {
    id: 1,
    image: assets.category_1, 
    title: "FACE",
    buttonText: "SHOP NOW",
    path: "/face", 
  },
  {
    id: 2,
    image: assets.category_2, 
    title: "LIPS",
    buttonText: "SHOP NOW",
    path: "/lips",
  },
  {
    id: 3,
    image: assets.category_3,
    title: "EYES",
    buttonText: "SHOP NOW",
    path: "/eyes",
  },
];

const CategorySection = () => {
  const navigate = useNavigate();

  return (
    <div className="my-10 w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Title and View All */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">SHOP BY CATEGORY</h2>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div 
            key={category.id} 
            className="relative group cursor-pointer" 
            onClick={() => navigate(category.path)}
          >
            <img
              src={category.image}
              alt={category.title}
              className="w-full h-60 sm:h-72 object-cover rounded-lg shadow-md"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
              <div className="absolute bottom-4 left-4">
                <h3 className="text-white text-lg sm:text-xl font-semibold">
                  {category.title}
                </h3>
                <button 
                  className="mt-2 px-4 py-2 bg-pink-600 text-white text-sm font-medium rounded hover:bg-pink-700 transition"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevents parent div click from firing
                    navigate(category.path);
                  }}
                >
                  {category.buttonText}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategorySection;
