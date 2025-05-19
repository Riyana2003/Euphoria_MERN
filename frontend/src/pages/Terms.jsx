/* eslint-disable no-unused-vars */
import React from 'react';
import Policy_Banner from '../components/Policy_Banner';

const Terms = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-black-900">
      <h1 className="text-4xl font-bold text-center text-pink-500 mb-10">Terms & Conditions</h1>

      <div className="space-y-6 bg-pink-50 p-6 rounded-2xl shadow-md">
        <section>
          <h2 className="text-2xl font-semibold mb-2">1. Introduction</h2>
          <p>
            Welcome to Euphoria! By accessing or using our website, you agree to be bound by these Terms and Conditions. Please read them carefully before using our services.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">2. Use of the Website</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>You must be at least 16 years old to use this site.</li>
            <li>You agree not to use our website for any illegal or unauthorized purpose.</li>
            <li>You may not reproduce, distribute, or exploit our content without permission.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">3. Product Information</h2>
          <p>
            We make every effort to display accurate product details. However, colors and packaging may vary due to lighting or brand updates. All descriptions are for informational purposes only and not intended as medical advice.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">4. Pricing & Payments</h2>
          <p>
            Prices are subject to change without prior notice. We accept secure payments via Khalti and offer cash on delivery (COD) within the Kathmandu Valley. All transactions are encrypted for your protection.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">5. Returns & Exchanges</h2>
          <p>
            You may return eligible products within 14 days of delivery. Please refer to our <span className="text-pink-600 font-medium">Returns Policy</span> for complete details.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">6. Account & Security</h2>
          <p>
            You are responsible for maintaining the confidentiality of your account credentials. Notify us immediately if you suspect unauthorized access to your account.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">7. Limitation of Liability</h2>
          <p>
            Euphoria is not liable for any direct, indirect, or consequential damages that may result from the use or inability to use the site or products purchased through it.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">8. Changes to Terms</h2>
          <p>
            We reserve the right to update or modify these Terms at any time without prior notice. Your continued use of the site constitutes your acceptance of any changes.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">9. Contact Us</h2>
          <p>
            For questions regarding these Terms & Conditions, please contact us at <span className="text-pink-600 font-medium">support@euphoria.com</span>.
          </p>
        </section>
      </div>
      <Policy_Banner />
    </div>
  );
};

export default Terms;
