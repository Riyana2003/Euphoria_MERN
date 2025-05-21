/* eslint-disable no-unused-vars */
import React from 'react'
import Hero from '../components/Hero'
import Trending from '../components/Trending'
import BestSeller from '../components/BestSeller'
import CategorySection from '../components/CategorySection'
import Policy_Banner from '../components/Policy_Banner'
import Footer from '../components/Footer'

const Home = () => {
  return (
    <div>
      <Hero />
      <CategorySection/>
      <Trending />
      <BestSeller />
      <Policy_Banner/>
    </div>
  )
}

export default Home
