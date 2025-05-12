/* eslint-disable no-unused-vars */
import React from 'react'
import { assets } from '../assets/assets'
import Policy_Banner from '../components/Policy_Banner'

const About = () => {
  return (
    <div>
      <div className='text-2xl text-center pt-8 border-t'>
       ABOUT US
      </div>
      <div className='my-10 flex flex-col md:flex-row gap-16'>
        <img className='w-full md:max-w-[450px]' src={assets.about} alt=""/>
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
        <p>Founded in Nepal in 2024, Euphoria is a luxury e-commerce platform dedicated to bringing the finest cosmetics to beauty enthusiasts. We curate premium makeup products that blend elegance, innovation, and quality, ensuring a seamless shopping experience. At Euphoria, we believe beauty is an art, and our mission is to empower individuals with luxurious products that inspire confidence and self-expression.</p>
        <p>With a commitment to excellence, Euphoria sources only the most prestigious and high-quality beauty brands, offering a curated selection that meets global luxury standards. Our platform is designed to provide a seamless, personalized shopping experience, complete with expert recommendations and exclusive collections. Whether you are looking for timeless classics or the latest trends, Euphoria is your destination for all things beauty, redefining luxury in Nepal and beyond.</p>
        <b className='text-gray-800'> Our Mission</b>
        <p>At Euphoria, our mission is to redefine beauty by offering a luxury makeup shopping experience that is effortless, elegant, and empowering. We aim to bring world-class cosmetic brands to Nepal, providing beauty enthusiasts with access to high-quality products that enhance confidence and self-expression. Through innovation, authenticity, and exceptional service, we strive to create a community where beauty is celebrated in all its forms.</p>
        </div>
      </div>
      <div className='text-xl py-4'>
       Why Choose US ?
      </div>
      <div className='flex flex-col md:flex-row text-sm mb-20'>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
        <b>Quality Assurance</b>
        <p className='text-gray-600'>At Euphoria, we are committed to offering only the finest, authentic luxury makeup products. Every item in our collection is carefully curated from globally renowned brands and meets the highest standards of safety, performance, and excellence. We guarantee 100% authenticity, ensuring that you receive premium-quality cosmetics that enhance your beauty with confidence. Shop with peace of mind, knowing that luxury and quality are always our top priorities.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
        <b>Convenience</b>
        <p className='text-gray-600'>At Euphoria, we make luxury beauty shopping effortless. Our seamless online platform allows you to browse, discover, and purchase premium cosmetics from the comfort of your home. With secure payment options, easy navigation, and a hassle-free checkout process, we ensure a smooth and enjoyable shopping experience. Plus, our fast and reliable delivery service brings your favorite luxury beauty products straight to your doorstep, saving you time and effort.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
        <b>Best Customer Service</b>
        <p className='text-gray-600'>At Euphoria, our customers are at the heart of everything we do. Our dedicated support team is always ready to assist you with personalized beauty recommendations, order assistance, and any inquiries you may have. Whether you need expert advice on the perfect product or help with your purchase, we ensure a smooth and satisfying shopping experience. Your satisfaction is our priority, and we are here to make your luxury beauty journey effortless and enjoyable.</p>
        </div>
      </div>
      <Policy_Banner/>
    </div>

  )
}

export default About
