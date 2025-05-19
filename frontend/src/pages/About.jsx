/* eslint-disable no-unused-vars */
import React from 'react';
import { assets } from '../assets/assets';
import Policy_Banner from '../components/Policy_Banner';

const About = () => {
  return (
    <div className="px-4 md:px-10 max-w-6xl mx-auto">
      <div className="text-3xl font-bold text-center pt-12 border-t text-pink-500">ABOUT US</div>

      <div className="my-12 flex flex-col md:flex-row items-center gap-10">
        <img className="w-full md:max-w-md rounded-lg shadow-md" src={assets.about} alt="About Euphoria" />
        <div className="flex flex-col gap-6 text-gray-700 md:w-2/3">
          <p>
            Founded in Nepal in 2024, <b className="text-pink-600">Euphoria</b> is a luxury e-commerce platform dedicated to bringing the finest cosmetics to beauty enthusiasts. We curate premium makeup products that blend elegance, innovation, and quality, ensuring a seamless shopping experience.
          </p>
          <p>
            At Euphoria, we believe beauty is an art. Our mission is to empower individuals with luxurious products that inspire confidence and self-expression. We offer a curated selection that meets global luxury standards, with expert recommendations and exclusive collections.
          </p>
          <div>
            <h3 className="font-semibold text-lg text-gray-800">Our Mission</h3>
            <p>
              To redefine beauty by offering a luxury makeup shopping experience that is effortless, elegant, and empowering. We bring world-class cosmetic brands to Nepal, celebrating beauty in all its forms through innovation, authenticity, and exceptional service.
            </p>
          </div>
        </div>
      </div>

      <div className="text-2xl font-bold text-center text-pink-500 py-8">Why Choose Us?</div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
        <div className="border rounded-xl shadow-md px-8 py-10 bg-white">
          <h4 className="font-bold text-lg text-pink-600 mb-2">Quality Assurance</h4>
          <p className="text-gray-600 text-sm">
            We offer only the finest, authentic luxury makeup products. Each item is curated from globally renowned brands and meets top standards of safety and performance. Shop confidently with 100% authenticity guaranteed.
          </p>
        </div>

        <div className="border rounded-xl shadow-md px-8 py-10 bg-white">
          <h4 className="font-bold text-lg text-pink-600 mb-2">Convenience</h4>
          <p className="text-gray-600 text-sm">
            Shop luxury beauty effortlessly from the comfort of your home. Our user-friendly platform, secure payments, and fast delivery ensure a smooth and joyful experience from click to doorstep.
          </p>
        </div>

        <div className="border rounded-xl shadow-md px-8 py-10 bg-white">
          <h4 className="font-bold text-lg text-pink-600 mb-2">Best Customer Service</h4>
          <p className="text-gray-600 text-sm">
            Our dedicated support team is always here for you. Whether you need beauty advice or help with your order, we provide prompt, friendly service to make your luxury shopping journey effortless.
          </p>
        </div>
      </div>

      <Policy_Banner />
    </div>
  );
};

export default About;
