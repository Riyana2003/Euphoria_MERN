/* eslint-disable no-unused-vars */
import React from 'react';
import { assets } from '../assets/assets';
import { Link, useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
    window.scrollTo(0, 0); // Scroll to top after navigation
  };

  return (
    <div className="bg-pink-500 text-white px-5 sm:px-20 py-10 mt-5 text-sm">
      <div className="max-w-screen-lg mx-auto grid grid-cols-1 sm:grid-cols-4 gap-10">
        {/* About Us */}
        <div className="flex flex-col items-start">
          <p className="text-xl font-medium mb-5">ABOUT US</p>
          <p className="w-full">
            Founded in Nepal in 2024 to be a luxury e-commerce platform for cosmetics.
          </p>
          <button 
            onClick={() => handleNavigation('/about')}
            className="mt-3 text-white underline hover:text-pink-200 transition"
          >
            Learn more about us
          </button>
        </div>

        {/* Customer Care */}
        <div>
          <p className="text-xl font-medium mb-5">CUSTOMER CARE</p>
          <ul className="flex flex-col gap-2">
            <li>
              <Link 
                to="/shipping" 
                className="hover:text-pink-200 transition"
                onClick={() => window.scrollTo(0, 0)}
              >
                Shipping and delivery
              </Link>
            </li>
            <li>
              <Link 
                to="/terms" 
                className="hover:text-pink-200 transition"
                onClick={() => window.scrollTo(0, 0)}
              >
                Terms and conditions
              </Link>
            </li>
            <li>
              <Link 
                to="/privacy" 
                className="hover:text-pink-200 transition"
                onClick={() => window.scrollTo(0, 0)}
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link 
                to="/returns" 
                className="hover:text-pink-200 transition"
                onClick={() => window.scrollTo(0, 0)}
              >
                Return Policy
              </Link>
            </li>
            <li>
              <Link 
                to="/faq" 
                className="hover:text-pink-200 transition"
                onClick={() => window.scrollTo(0, 0)}
              >
                FAQ
              </Link>
            </li>
          </ul>
        </div>

        {/* Follow Us */}
        <div>
          <p className="text-xl font-medium mb-5">FOLLOW US</p>
          <p className="mb-3">For exclusive news and updates.</p>
          <div className="flex gap-4 items-center mb-5">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <img src={assets.facebook} alt="Facebook" className="w-6 h-6 hover:opacity-80 transition" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <img src={assets.instagram} alt="Instagram" className="w-6 h-6 hover:opacity-80 transition" />
            </a>
          </div>
          <div className="flex gap-4">
            <img src={assets.khalti} alt="Khalti" className="w-20 h-8" />
          </div>
        </div>

        {/* Download Our Apps & Contact Us */}
        <div>
          <p className="text-xl font-medium mb-5">DOWNLOAD OUR APPS</p>
          <div className="flex gap-4 mb-6">
            <a href="#" className="hover:opacity-80 transition">
              <img src={assets.play_store} alt="Play Store" className="w-6 h-6" />
            </a>
            <a href="#" className="hover:opacity-80 transition">
              <img src={assets.app_store} alt="App Store" className="w-6 h-6" />
            </a>
          </div>

          {/* Contact Us Section */}
          <div className="mt-6">
            <Link 
                to="/contact" 
                className="text-xl font-medium mb-3 hover:text-pink-200 transition"
                onClick={() => window.scrollTo(0, 0)}
                
              >
                Contact Us
              </Link>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>info@euphoria.com</span>
              </div>
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>+977 (01)-5801212</span>
              </div>
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Euphoria Tower, Maharajganj, Kathmandu</span>
              </div>
            </div>
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