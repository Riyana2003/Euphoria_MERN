/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useContext, useState, useEffect, useRef } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink, useNavigate } from "react-router-dom";
import LoginPopup from "./LoginPopup";
import { ShopContext } from "../context/ShopContext";
import { toast, ToastContainer } from "react-toastify";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [isLoginPopupOpen, setLoginPopupOpen] = useState(false);
  const { 
    searchQuery, 
    setSearchQuery, 
    token, 
    setToken, 
    getCartCount, 
    username, 
    setUsername,
    searchProducts,
    searchResults,
    showSearchResults,
    setShowSearchResults
  } = useContext(ShopContext);
  
  const [searchInput, setSearchInput] = useState(searchQuery);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    setSearchQuery(value);
    searchProducts(value);
    setShowSearchResults(value.trim().length > 0);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(searchInput);
    setShowSearchResults(false);
  };

  // New function to handle product click with scroll to top
  const handleProductClick = (product, e) => {
    e.preventDefault();
    setSearchInput(product.name);
    setSearchQuery(product.name);
    setShowSearchResults(false);
    window.scrollTo(0, 0); // Scroll to top before navigation
    navigate(`/product/${product._id}`);
  };

  const handleOpenLoginPopup = () => {
    setLoginPopupOpen(true);
  };

  const handleCloseLoginPopup = () => {
    setLoginPopupOpen(false);
  };

  const handleLogout = () => {
    // Clear from state
    localStorage.removeItem('authToken'); 
    localStorage.removeItem('username');   
    localStorage.removeItem('cart');  
    localStorage.removeItem('user_id'); 
    localStorage.removeItem('userOrders');   
    
    toast.success("You have logged out.");
    navigate('/', { replace: true });
  window.location.reload();
  };

  return (
    <div className="w-full flex flex-col">
      {/* Marquee Section */}
      <div className="bg-pink-500 text-white py-2 text-center text-sm">
        <marquee>Celebrate New Year 2025 with 15% Off on Every Product!</marquee>
      </div>

      {/* Navbar */}
      <div className="bg-white shadow-md w-full">
        <div className="flex items-center justify-between px-4 lg:px-16 py-4">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img src={assets.logo} className="w-28 sm:w-36" alt="Euphoria Logo" />
          </Link>

          {/* Search Section */}
          <div className="hidden sm:flex flex-grow mx-4 lg:mx-8 max-w-[100%]">
            <div className="relative w-full" ref={searchRef}>
              <form onSubmit={handleSearchSubmit} className="relative w-full">
                <input
                  type="text"
                  value={searchInput}
                  onChange={handleSearch}
                  onFocus={() => searchInput && setShowSearchResults(true)}
                  placeholder="Search for your products"
                  className="border border-gray-300 rounded-full px-4 py-2 text-sm w-full focus:outline-none focus:ring-1 focus:ring-pink-500 pl-4 pr-10"
                />
                <button 
                  type="submit" 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  <img
                    src={assets.search}
                    alt="Search"
                    className="w-5 h-5 cursor-pointer"
                  />
                </button>
              </form>

              {/* Search Results Dropdown */}
              {showSearchResults && searchResults.length > 0 && (
                <div className="absolute top-12 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                  {searchResults.map((product) => (
                    <Link
                      key={product._id}
                      to={`/product/${product._id}`}
                      onClick={(e) => handleProductClick(product, e)}
                      className="flex items-center p-3 hover:bg-gray-100 border-b border-gray-100"
                    >
                      <img 
                        src={product.image[0]} 
                        alt={product.name} 
                        className="w-10 h-10 object-cover rounded mr-3"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.brand}</p>
                      </div>
                      <p className="text-sm font-bold text-pink-500">Rs. {product.price}</p>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Navbar Items */}
          <div className="flex items-center gap-4">
            {/* Profile Dropdown */}
            {token ? (
              <div className="relative group sm:block">
                <img
                  src={assets.account_profile}
                  className="w-6 h-6 cursor-pointer"
                  alt="Profile"
                />
                <div className="absolute right-0 hidden group-hover:block pt-2 w-36 py-3 px-4 bg-slate-100 text-gray-500 rounded shadow-md">
                  <div className="flex flex-col gap-2">
                    <Link to="/profile" className="cursor-pointer hover:text-pink-500">
                      My Profile
                    </Link>
                    <Link to="/orders" className="cursor-pointer hover:text-pink-500">
                      My Orders
                    </Link>
                    <p onClick={handleLogout} className="cursor-pointer hover:text-pink-500">
                      Logout
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div
                onClick={handleOpenLoginPopup}
                className="hidden sm:flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full cursor-pointer hover:bg-gray-200"
              >
                <span className="text-gray-700 text-sm">Login</span>
              </div>
            )}

            {/* Cart Section */}
            <Link
              to="/cart"
              className="relative flex items-center text-gray-700 gap-2"
            >
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-xs flex items-center justify-center rounded-full">
                {getCartCount()}
              </span>
              <img src={assets.cart} className="w-6 h-6 cursor-pointer" alt="Cart" />
            </Link>

            {/* Mobile Menu Toggle */}
            <img
              onClick={() => setVisible(!visible)}
              src={assets.menu}
              className="w-6 h-6 cursor-pointer sm:hidden"
              alt="Menu"
            />
          </div>
        </div>

        {/* Login Popup */}
        <LoginPopup isOpen={isLoginPopupOpen} onClose={handleCloseLoginPopup} />

        {/* Mobile Search Bar */}
        <div className="flex sm:hidden px-4 py-2 bg-gray-100">
          <div className="relative w-full" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                value={searchInput}
                onChange={handleSearch}
                onFocus={() => searchInput && setShowSearchResults(true)}
                placeholder="Search for your products"
                className="border border-gray-300 rounded-full px-4 py-2 text-sm w-full focus:outline-none focus:ring-1 focus:ring-pink-500 pl-4 pr-10"
              />
              <button 
                type="submit" 
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <img
                  src={assets.search}
                  alt="Search"
                  className="w-5 h-5 cursor-pointer"
                />
              </button>
            </form>

            {/* Mobile Search Results Dropdown */}
            {showSearchResults && searchResults.length > 0 && (
              <div className="absolute top-12 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                {searchResults.map((product) => (
                  <Link
                    key={product._id}
                    to={`/product/${product._id}`}
                    onClick={(e) => handleProductClick(product, e)}
                    className="flex items-center p-3 hover:bg-gray-100 border-b border-gray-100"
                  >
                    <img 
                      src={product.image[0]} 
                      alt={product.name} 
                      className="w-10 h-10 object-cover rounded mr-3"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.brand}</p>
                    </div>
                    <p className="text-sm font-bold text-pink-500">Rs. {product.price}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Sidebar Menu */}
        <div
          className={`fixed top-0 right-0 bottom-0 bg-white z-50 transition-transform duration-300 ${
            visible ? "translate-x-0" : "translate-x-full"
          } sm:hidden w-64 shadow-lg`}
        >
          <div className="flex flex-col text-gray-700">
            <div
              onClick={() => setVisible(false)}
              className="flex items-center gap-2 p-4 border-b cursor-pointer"
            >
              <img className="h-4" src={assets.back} alt="Back" />
              <p>Back</p>
            </div>
            <NavLink
              className="py-3 px-6 border-b hover:text-pink-500"
              onClick={() => setVisible(false)}
              to="/"
            >
              ALL CATEGORY
            </NavLink>
            <NavLink
              className="py-3 px-6 border-b hover:text-pink-500"
              onClick={() => setVisible(false)}
              to="/face"
            >
              FACE
            </NavLink>
            <NavLink
              className="py-3 px-6 border-b hover:text-pink-500"
              onClick={() => setVisible(false)}
              to="/eyes"
            >
              EYES
            </NavLink>
            <NavLink
              className="py-3 px-6 border-b hover:text-pink-500"
              onClick={() => setVisible(false)}
              to="/lips"
            >
              LIPS
            </NavLink>
            <NavLink
              className="py-3 px-6 border-b hover:text-pink-500"
              onClick={() => setVisible(false)}
              to="/tools & makeup sets"
            >
              TOOLS & MAKEUP SETS
            </NavLink>
          </div>
        </div>

        {/* ALL CATEGORY Section */}
        <div className="hidden px-6 lg:px-16 sm:flex bg-gray-100 py-4 border-t flex-wrap items-center justify-between">
          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-2 hover:text-pink-500 text-base ${
                isActive ? "text-pink-500 font-bold" : "text-gray-700"
              }`
            }
          >
            ALL CATEGORY
          </NavLink>

          <NavLink
            to="/face"
            className={({ isActive }) =>
              `hover:text-pink-500 ${isActive ? "text-pink-500" : ""}`
            }
          >
            FACE
          </NavLink>
          <NavLink
            to="/eyes"
            className={({ isActive }) =>
              `hover:text-pink-500 ${isActive ? "text-pink-500" : ""}`
            }
          >
            EYES
          </NavLink>
          <NavLink
            to="/lips"
            className={({ isActive }) =>
              `hover:text-pink-500 ${isActive ? "text-pink-500" : ""}`
            }
          >
            LIPS
          </NavLink>
          <NavLink
            to="/tools & makeup sets"
            className={({ isActive }) =>
              `hover:text-pink-500 ${isActive ? "text-pink-500" : ""}`
            }
          >
            TOOLS & MAKEUP SETS
          </NavLink>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Navbar;