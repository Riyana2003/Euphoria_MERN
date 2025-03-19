/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';
import { assets } from '../assets/assets';

const Navbar = ({ onLogout }) => {
  const handleLogout = () => {
    if (onLogout) {
      onLogout();
      localStorage.removeItem('token');
    } else {
      console.error('Logout handler is not defined.');
    }
  };

  return (
    <div className='flex items-center py-2 px-4 sm:px-8 justify-between'>
      <img
        className='w-[max(10%,80px)]'
        src={assets.logo}
        alt='Website Logo'
      />
      <button
        onClick={handleLogout}
        className='bg-pink-500 text-white px-4 py-2 sm:px-6 sm:py-2 rounded-full text-xs sm:text-sm hover:bg-pink-600 transition-colors'
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;