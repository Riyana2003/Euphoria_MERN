/* eslint-disable no-unused-vars */
import React from 'react';
import { assets } from '../assets/assets';


const Footer = () => {
  return (
    <div className="bg-pink-500 text-white px-5 sm:px-20 py-10 mt-5 text-sm">
      <div className="max-w-screen-lg mx-auto grid grid-cols-1 sm:grid-cols-4 gap-10">
        {/* About Us */}
        <div className="flex flex-col items-start">
          <p className="text-xl font-medium mb-5">ABOUT US</p>
          <p className="w-full">
            Founded in Nepal in 2024 to be a luxury e-commerce platform for cosmetics.
          </p>
        </div>

        {/* Customer Care */}
        <div>
          <p className="text-xl font-medium mb-5">CUSTOMER CARE</p>
          <ul className="flex flex-col gap-2">
            <li>Shipping and delivery</li>
            <li>Terms and conditions</li>
            <li>Privacy Policy</li>
            <li>Return Policy</li>
            <li>FAQ</li>
          </ul>
        </div>

        {/* Follow Us */}
        <div>
          <p className="text-xl font-medium mb-5">FOLLOW US</p>
          <p className="mb-3">For exclusive news and updates.</p>
          <div className="flex gap-4 items-center mb-5">
            <img src={assets.facebook} alt="Facebook" className="w-6 h-6" />
            <img src={assets.instagram} alt="Instagram" className="w-6 h-6" />
          </div>
          <div className="flex gap-4">
            <img src={assets.khalti} alt="Khalti" className="w-20 h-8" />
          </div>
        </div>

        {/* Download Our Apps */}
        <div>
          <p className="text-xl font-medium mb-5">DOWNLOAD OUR APPS</p>
          <div className="flex gap-4">
            <img src={assets.play_store} alt="Play Store" className="w-6 h-6" />
            <img src={assets.app_store} alt="App Store" className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="mt-10">
        <hr className="border-white opacity-50 mb-5" />
        <p className="py-3 text-center">
          Copyright © 2025 Euphoria. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
