/* eslint-disable no-unused-vars */
import React from 'react';
import Policy_Banner from '../components/Policy_Banner';

const Returns = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-black-900">
      <h1 className="text-4xl font-bold text-center text-pink-500 mb-10">Returns & Exchange Policy</h1>

      <div className="space-y-6 bg-pink-50 p-6 rounded-2xl shadow-md">
        <section>
          <h2 className="text-2xl font-semibold mb-2">Easy 14-Day Return Policy</h2>
          <p>
            At Euphoria, we want you to love your purchase. If you are not completely satisfied, you have up to <strong>14 days</strong> from the date of delivery to return or exchange eligible items.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">Eligibility for Returns</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Item must be unused and in original packaging</li>
            <li>Seal, tags, or authenticity labels must remain intact</li>
            <li>Makeup products must be unopened and in resellable condition</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">Non-Returnable Items</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Opened beauty products (due to hygiene concerns)</li>
            <li>Gift cards or promotional items</li>
            <li>Customized or limited-edition products</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">How to Initiate a Return</h2>
          <ol className="list-decimal list-inside space-y-1">
            <li>Contact our support team via <span className="text-pink-600 font-medium">support@euphoria.com</span> or through the chatbot</li>
            <li>Provide your order ID and reason for return</li>
            <li>We will guide you through the return process or exchange options</li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">Refund Process</h2>
          <p>
            Once your return is received and inspected, your refund will be processed within 5–7 business days via the original payment method. Cash on Delivery (COD) orders will be refunded via mobile wallet or bank transfer.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">Questions?</h2>
          <p>
            Feel free to reach out to our support team. We are here to ensure you have a smooth and worry-free shopping experience.
          </p>
        </section>
      </div>
       <Policy_Banner />
    </div>
  );
};

export default Returns;
