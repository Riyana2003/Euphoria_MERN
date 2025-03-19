/* eslint-disable no-unused-vars */
import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import Policy_Banner from '../components/Policy_Banner'

const Contact = () => {
  return (
    <div>
      <div className='text-center text-2xl pt-10 border-t'>
        <Title text1={'Contact'} text2={'US'}/>
      </div>
      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28'>
        <img className='w-full md:max-w-[450px]' src={assets.about} alt=""/>
        <div className='flex flex-col justify-center items-start gap-6'>
            <p className='font-semibold text-xl text-gray-600'>Our Store</p>
            <p className='text-gray-500'>Euphoria Tower <br /> Maharajganj, Kathmandu</p>
            <p className='text-gray-500'>Tel:(01)-5801212 <br /> Email: contacteuphoria@gmail.com</p>
            <p className='font-semibold text-xl text-gray-500'> Careers at Euphoria</p>
            <p className='text-gray-500'>Learn more about our teams and job openings.</p>
            <button className='border border-pink-500 px-8 py-4 text-sm hover:bg-pink-600 hover:text-white transition-all duration-500'>Explore Jobs</button>
        </div>
      </div>
      <Policy_Banner/>
    </div>
  )
}

export default Contact
