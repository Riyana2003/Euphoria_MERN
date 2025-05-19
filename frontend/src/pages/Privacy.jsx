/* eslint-disable no-unused-vars */
import React from 'react';
import Policy_Banner from '../components/Policy_Banner';

const Privacy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-black-900">
      <h1 className="text-4xl font-bold text-center text-pink-500 mb-10">Privacy Policy</h1>
      
      <div className="space-y-6 bg-pink-50 p-6 rounded-2xl shadow-md">
        <section>
          <h2 className="text-2xl font-semibold mb-2">1. Introduction</h2>
          <p>
            Welcome to Euphoria. Your privacy is important to us. This Privacy Policy outlines how we collect, use, and protect your personal information when you visit or make a purchase from our website.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">2. Information We Collect</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Personal Information: Name, email, phone number, shipping address</li>
            <li>Payment Information: Used securely through Khalti and other encrypted gateways</li>
            <li>Browsing Data: Pages visited, time spent, and device information</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">3. How We Use Your Information</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>To fulfill and manage your orders</li>
            <li>To personalize your shopping experience</li>
            <li>To communicate offers, updates, and recommendations</li>
            <li>To improve our website and services</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">4. Information Sharing</h2>
          <p>
            We do not sell or rent your data. We only share necessary details with trusted third-party services for payment processing, delivery, and analytics – all of which comply with data protection laws.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">5. Data Security</h2>
          <p>
            We implement strong security practices and encrypted systems to protect your information. Payment details are never stored on our servers.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">6. Your Rights</h2>
          <p>
            You have the right to access, modify, or delete your personal data at any time. You may also opt out of promotional emails by clicking “unsubscribe.”
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">7. Changes to This Policy</h2>
          <p>
            We may occasionally update this policy to reflect changes in our practices. Any changes will be posted on this page with an updated effective date.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">8. Contact Us</h2>
          <p>
            For any questions about our Privacy Policy, please email us at <span className="text-pink-600 font-medium">support@euphoria.com</span>.
          </p>
        </section>
      </div>
      <Policy_Banner />
    </div>
  );
};

export default Privacy;
