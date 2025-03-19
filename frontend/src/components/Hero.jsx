/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { assets } from "../assets/assets";
  
const Hero = () => {
  const images = [
    { src: assets.hero_img_1, title: "NARS COSMETICS", price: "Starting at Rs. 2,999", button: "SHOP NOW" },
    { src: assets.hero_img_2, title: "Channel Beauty", price: "Starting at NPR 3,499", button: "SHOP NOW" },
    { src: assets.hero_img_3, title: "Valentine Offer DIOR", price: "Exclusive Offer Starting at Rs. 4,499", button: "SHOP NOW" },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative bg-white w-full mt-5 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="relative w-full">
        {/* Hero Image */}
        <img
          src={images[currentIndex].src}
          alt={`Slide ${currentIndex + 1}`}
          className="w-full aspect-[16/9] object-cover rounded-lg"
        />

        {/* Hero Content */}
        <div className="absolute top-1/2 left-4 sm:left-6 lg:left-10 transform -translate-y-1/2 w-3/4 sm:w-1/2">
          <div className="space-y-4">
            <h2 className="inknut-antiqua-semibold text-2xl sm:text-3xl lg:text-4xl font-bold text-black">
              {images[currentIndex].title}
            </h2>
            <p className="inknut-antiqua-semibold text-lg sm:text-xl lg:text-2xl text-black">
              {images[currentIndex].price}
            </p>
            <button className="inknut-antiqua-semibold px-6 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition">
              {images[currentIndex].button}
            </button>
          </div>
        </div>
      </div>

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
        {images.map((_, index) => (
          <span
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full ${
              currentIndex === index ? "bg-pink-600" : "bg-gray-400"
            } cursor-pointer`}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default Hero;
