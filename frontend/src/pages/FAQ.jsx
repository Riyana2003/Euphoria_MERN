/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Policy_Banner from '../components/Policy_Banner';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const navigate = useNavigate();

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "How do I know Euphoria products are authentic?",
      answer: "We source directly from brand-authorized distributors and provide authenticity certificates with every premium product. Our quality control team verifies each item before delivering."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept Khalti and cash on delivery inside Kathmandu valley. All transactions are securely processed through encrypted payment gateways."
    },
    {
      question: "Do you offer service outside Kathmandu valley?",
      answer: "Yes! We have all over Nepal delivery service. Outside valley orders typically arrive within 2-3 business days after processing."
    },
    {
      question: "Can I get product recommendations?",
      answer: "Absolutely! Our AI chatbot is well-trained via chat to recommend products based on your skin type, preferences, and desired look. You can also try our virtual try-on feature."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-pink-900">
      <h1 className="text-4xl font-bold text-center text-pink-500 mb-4">Frequently Asked Questions</h1>

      {/* What is Euphoria? */}
      <div className="bg-pink-50 p-6 rounded-xl shadow mb-10">
        <h2 className="text-2xl font-semibold mb-2"> What is Euphoria?</h2>
        <p>
          <span className="font-medium text-pink-700">Euphoria</span> is Nepal’s first luxury beauty e-commerce platform that brings you genuine high-end makeup and skincare products from trusted global brands. Our platform offers a seamless online shopping experience with features like virtual try-on, AI-powered product suggestions, fast delivery, and secure payment methods. We’re more than just a store — we’re your personalized beauty destination.
        </p>
      </div>

      {/* FAQs */}
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div 
            key={index}
            className="border border-pink-200 rounded-lg overflow-hidden transition-all duration-300"
          >
            <button
              className={`w-full px-6 py-4 text-left flex justify-between items-center 
                ${activeIndex === index ? 'bg-pink-600 text-white' : 'bg-pink-50 text-pink-800 hover:bg-pink-500 hover:text-white'}`}
              onClick={() => toggleFAQ(index)}
            >
              <span className="font-medium text-lg">{faq.question}</span>
              <svg 
                className={`w-5 h-5 transform transition-transform ${activeIndex === index ? 'rotate-180' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {activeIndex === index && (
              <div className="px-6 py-4 bg-white">
                <p>{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Contact Section */}
      <div className="mt-10 text-center">
        <p className="text-pink-700">Still have questions?</p>
        <Link 
          to="/contact" 
          className="inline-block mt-4 px-6 py-3 bg-pink-600 text-white font-semibold rounded-lg hover:bg-pink-700 transition"
          onClick={() => window.scrollTo(0, 0)}
        >
          Contact Us
        </Link>
      </div>
      <Policy_Banner />
    </div>
  );
};

export default FAQ;
