/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useContext, useState, useEffect } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";

const Hero = () => {
  const [heroImages, setHeroImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
   const { backendUrl } = useContext(ShopContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch hero images from backend
  useEffect(() => {
    const fetchHeroImages = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/hero`);
        // Filter only active images and sort by order
        const activeImages = response.data
          .filter(img => img.isActive)
          .sort((a, b) => a.order - b.order);
        setHeroImages(activeImages);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching hero images:", err);  
        setError("Failed to load hero images");
        setLoading(false);
      }
    };

    fetchHeroImages();
  }, []);

  // Auto-rotate carousel
  useEffect(() => {
    if (heroImages.length <= 1) return;

    const interval = setInterval(() => {
      handleNext();
    }, 3000);

    return () => clearInterval(interval);
  }, [heroImages, currentIndex]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? heroImages.length - 1 : prevIndex - 1
    );
  };

  if (loading) {
    return (
      <div className="w-full aspect-[16/9] bg-gray-200 rounded-lg flex items-center justify-center">
        <p>Loading hero images...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full aspect-[16/9] bg-gray-200 rounded-lg flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (heroImages.length === 0) {
    return (
      <div className="w-full aspect-[16/9] bg-gray-200 rounded-lg flex items-center justify-center">
        <p>No hero images available</p>
      </div>
    );
  }

  return (
    <div className="relative bg-white w-full mt-5 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="relative w-full">
        {/* Hero Image */}
        <img
          src={heroImages[currentIndex].imageUrl}
          alt={heroImages[currentIndex].title}
          className="w-full aspect-[16/9] object-cover rounded-lg"
        />

        {/* Hero Content */}
        <div className="absolute top-1/2 left-4 sm:left-6 lg:left-10 transform -translate-y-1/2 w-3/4 sm:w-1/2">
          <div className="space-y-4">
            <h2 className="inknut-antiqua-semibold text-2xl sm:text-3xl lg:text-4xl font-bold text-black">
              {heroImages[currentIndex].title}
            </h2>
            <p className="inknut-antiqua-semibold text-lg sm:text-xl lg:text-2xl text-black">
              {heroImages[currentIndex].price}
            </p>
            <button className="inknut-antiqua-semibold px-6 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition">
              {heroImages[currentIndex].buttonText || "SHOP NOW"}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation only shown if more than one image */}
      {heroImages.length > 1 && (
        <>
          {/* Previous Button */}
          <div className="absolute top-1/2 -translate-y-1/2 left-2 sm:left-4 flex items-center z-10">
            <button
              onClick={handlePrevious}
              className="bg-white text-gray-800 p-3 rounded-full shadow-md hover:bg-gray-200 transition"
            >
              <img className="h-4 sm:h-5 rotate-0" src={assets.back} alt="Previous" />
            </button>
          </div>

          {/* Next Button */}
          <div className="absolute top-1/2 -translate-y-1/2 right-2 sm:right-4 flex items-center z-10">
            <button
              onClick={handleNext}
              className="bg-white text-gray-800 p-3 rounded-full shadow-md hover:bg-gray-200 transition"
            >
              <img className="h-4 sm:h-5 rotate-180" src={assets.back} alt="Next" />
            </button>
          </div>

          {/* Dot Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-3">
            {heroImages.map((_, index) => (
              <span
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full ${
                  currentIndex === index ? "bg-pink-600" : "bg-gray-400"
                } cursor-pointer`}
              ></span>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Hero;