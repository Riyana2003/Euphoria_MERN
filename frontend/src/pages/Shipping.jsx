/* eslint-disable no-unused-vars */
import React from 'react';
import Policy_Banner from '../components/Policy_Banner';

const Shipping = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 text-black-900">
      <h1 className="text-4xl font-bold text-center text-pink-500 mb-10">Shipping Information</h1>

      <div className="bg-pink-50 p-6 rounded-2xl shadow-md space-y-6">
        
        <section>
          <h2 className="text-2xl font-semibold mb-2">📍 Inside Kathmandu Valley</h2>
          <p>
            We offer fast and reliable shipping service within the Kathmandu Valley. Orders are typically delivered <span className="font-medium text-pink-700">within 1 business day</span> after order confirmation.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">🚚 Outside Kathmandu Valley</h2>
          <p>
            We deliver across Nepal with our trusted logistics partners. Shipping takes <span className="font-medium text-pink-700">2–3 business days</span> depending on your location.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">💸 Delivery Charges</h2>
          <ul className="list-disc list-inside space-y-1">
            <li><span className="font-medium">Inside Kathmandu Valley:</span> Free delivery</li>
            <li><span className="font-medium">Outside Valley:</span> Starts from <span className="text-pink-700 font-medium">Nrs. 50</span> and can go up to <span className="text-pink-700 font-medium">Nrs. 200</span> based on the delivery location</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">📦 Order Tracking</h2>
          <p>
            Once your order is shipped, you can see your order status in your My orders page.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">Need Help?</h2>
          <p>
            If you have any questions regarding your order or delivery, feel free to contact us at <span className="text-pink-600 font-medium">info@euphoria.com</span>.
          </p>
        </section>
      </div>
      <Policy_Banner />
    </div>
  );
};

export default Shipping;
