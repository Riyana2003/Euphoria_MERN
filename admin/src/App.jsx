/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { Routes, Route, Navigate } from 'react-router-dom';
import Add from './pages/Add';
import List from './pages/List';
import Orders from './pages/Orders';
import Login from './components/Login';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HeroManager from './pages/HeroManager';


export const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://euphoria-mern.vercel.app';
export const currency = 'Rs.'

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  const handleLogin = (newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
  };

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('token');
  };

  return (
    <div className='bg-gray-50 min-h-screen'>
      <ToastContainer />
      {!token ? (
        <Login onLogin={handleLogin} />
      ) : (
        <>
          <Navbar onLogout={handleLogout} />
          <hr />
          <div className='flex w-full'>
            <Sidebar />
            <div className='w-full md:w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base'>
              <Routes>
                <Route path='/' element={<Navigate to='/add' />} />
                <Route path='/add' element={<Add />} />
                <Route path='/list' element={<List />} />
                <Route path='/orders' element={<Orders />} />
                <Route path='/manage' element={<HeroManager />} />
                <Route path='*' element={<Navigate to='/add' />} />
              </Routes>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;