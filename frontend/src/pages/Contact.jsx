/* eslint-disable no-unused-vars */
import React from 'react';
import { assets } from '../assets/assets';
import Policy_Banner from '../components/Policy_Banner';

const Contact = () => {
  return (
    <div className="px-4 md:px-10 max-w-6xl mx-auto">
      <div className="text-3xl font-bold text-center pt-12 border-t text-pink-500">Contact Us</div>

      <div className="my-12 flex flex-col md:flex-row items-center gap-10 mb-28">
        <img
          className="w-full md:max-w-md rounded-lg shadow-md"
          src={assets.about}
          alt="Contact Euphoria"
        />
        
        <div className="flex flex-col justify-center gap-6 text-gray-700 md:w-2/3">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">Our Store</h3>
            <p className="text-gray-600 mt-1">
              Euphoria Tower <br />
              Maharajganj, Kathmandu
            </p>
          </div>

          <div>
            <p className="text-gray-600">
              Tel: (01)-5801212 <br />
              Email: info@euphoria.com
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-800">Careers at Euphoria</h3>
            <p className="text-gray-600 mt-1">Learn more about our teams and job openings.</p>
            <button className="mt-4 bg-white border border-pink-500 text-pink-600 font-medium px-6 py-3 rounded-full hover:bg-pink-600 hover:text-white transition duration-300 ease-in-out">
              Explore Jobs
            </button>
          </div>
        </div>
      </div>

      <Policy_Banner />
    </div>
  );
};

export default Contact;
