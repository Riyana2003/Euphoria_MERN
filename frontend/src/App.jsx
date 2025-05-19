/* eslint-disable no-unused-vars */
import React from 'react'
import { Routes,Route} from 'react-router-dom'
import Home from './pages/Home'
import Face from './pages/Face'
import Lips from './pages/Lips'
import Eyes from './pages/Eyes'
import Tools from './pages/Tools'
import About from './pages/About'
import Product from './pages/Product'
import Cart from './pages/Cart'
import LoginPopup from './components/LoginPopup'
import Orders from './pages/Orders'
import PlaceOrder from './pages/PlaceOrder'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { toast, ToastContainer } from "react-toastify"; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import toast CSS
import Contact from './pages/Contact'
import Chatbot from './components/Chatbot'
import PaymentSuccess from './pages/PaymentSuccess';
import Profile from './pages/Profile'
import Shipping from './pages/Shipping'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import Returns from './pages/Returns'
import FAQ from './pages/FAQ'

const App = () => {
  return (
    <div className='w-full'>
      <ToastContainer />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/face" element={<Face/>}/>
        <Route path='/eyes' element={<Eyes/>}/>
        <Route path='/lips' element={<Lips/>}/>
        <Route path='/tools & makeup sets' element={<Tools/>}/>
        <Route path='/about' element={<About/>}/>
        <Route path='/contact' element={<Contact/>}/>
        <Route path='/shipping' element={<Shipping/>}/>
        <Route path='/terms' element={<Terms/>}/>
        <Route path='/privacy' element={<Privacy/>}/>
        <Route path='/returns' element={<Returns/>}/>
        <Route path='/faq' element={<FAQ/>}/>
        <Route path='/product/:productId' element={<Product/>}/>
        <Route path='/cart' element={<Cart/>}/>
        <Route path='/login' element={<LoginPopup/>}/>
        <Route path='/profile' element={<Profile/>}/>
        <Route path='/orders' element={<Orders/>}/>
        <Route path='/place-order' element={<PlaceOrder/>}/>
        <Route path="/payment-success" element={<PaymentSuccess />} />
        </Routes>  
        <Chatbot  />  
        <Footer />  
    </div>
  )
}

export default App
