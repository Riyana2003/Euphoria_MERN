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
  const [searchInput, setSearchInput] = useState("");
  
  const {
    searchQuery,
    setSearchQuery,
    token,
    getCartCount,
    searchProducts,
    searchResults,
    showSearchResults,
    setShowSearchResults,
  } = useContext(ShopContext);

  const searchRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const navigate = useNavigate();

  // Sync search input with context
  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
      
      if (visible && 
          mobileMenuRef.current && 
          !mobileMenuRef.current.contains(event.target) && 
          !event.target.closest('img[alt="Menu"]')) {
        setVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [visible]);

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
    navigate("/search");
  };

  const handleProductClick = (product) => {
    setSearchInput(product.name);
    setSearchQuery(product.name);
    setShowSearchResults(false);
    setVisible(false);
    navigate(`/product/${product._id}`);
    window.scrollTo(0, 0);
  };

  const toggleMobileMenu = () => {
    setVisible(!visible);
    setShowSearchResults(false);
  };

  const handleOpenLoginPopup = () => {
    setLoginPopupOpen(true);
    setVisible(false);
  };

  const handleCloseLoginPopup = () => {
    setLoginPopupOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("username");
    localStorage.removeItem("cart");
    localStorage.removeItem("user_id");
    localStorage.removeItem("userOrders");

    toast.success("You have logged out.");
    navigate("/", { replace: true });
    window.location.reload();
  };

  return (
    <div className="w-full flex flex-col relative">
      {/* Marquee Section */}
      <div className="bg-pink-500 text-white py-2 text-center text-sm">
        <marquee>
          Celebrate New Year 2025 with 15% Off on Every Product!
        </marquee>
      </div>

      {/* Navbar */}
      <div className="bg-white shadow-md w-full relative z-50">
        <div className="flex items-center justify-between px-4 lg:px-16 py-4">
          {/* Logo */}
          <Link to="/" className="flex">
            <img
              src={assets.logo}
              className="w-28 sm:w-36"
              alt="Euphoria Logo"
            />
          </Link>

          {/* Search Section - Desktop */}
          <div className="hidden sm:flex flex-grow mx-4 lg:mx-8 relative">
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
              {showSearchResults && searchResults?.length > 0 && (
                <div className="absolute top-12 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-[1000] max-h-96 overflow-y-auto">
                  {searchResults?.map((product) => (
                    <button
                      key={product._id}
                      onClick={() => handleProductClick(product)}
                      className="w-full text-left flex items-center p-3 hover:bg-gray-100 border-b border-gray-100"
                    >
                      <img
                        src={product.image[0]}
                        alt={product.name}
                        className="w-10 h-10 object-cover rounded mr-3"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-500">{product.brand}</p>
                      </div>
                      <p className="text-sm font-bold text-pink-500">
                        Rs. {product.price}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Navbar Items */}
          <div className="flex items-center gap-4">
            {/* Profile Dropdown */}
            {token ? (
              <div className="relative group hidden sm:block">
                <img
                  src={assets.account_profile}
                  className="w-6 h-6 cursor-pointer"
                  alt="Profile"
                />
                <div className="absolute right-0 hidden group-hover:block pt-2 w-48 py-3 px-4 bg-white text-gray-500 rounded shadow-md z-[1000] border border-gray-200">
                  <div className="flex flex-col gap-3">
                    <Link
                      to="/profile"
                      className="cursor-pointer hover:text-pink-500 text-sm"
                    >
                      My Profile
                    </Link>
                    <Link
                      to="/orders"
                      className="cursor-pointer hover:text-pink-500 text-sm"
                    >
                      My Orders
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="cursor-pointer hover:text-pink-500 text-sm text-left"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div
                onClick={handleOpenLoginPopup}
                className="hidden sm:flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full cursor-pointer hover:bg-gray-200"
              >
                <img src={assets.account_profile} className="w-5 h-5" alt="Login" />
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
              <img
                src={assets.cart}
                className="w-6 h-6 cursor-pointer"
                alt="Cart"
              />
             
            </Link>

            {/* Mobile Menu Toggle */}
            <img
              onClick={toggleMobileMenu}
              src={visible ? assets.close : assets.menu}
              className="w-6 h-6 cursor-pointer sm:hidden"
              alt="Menu"
            />
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="sm:hidden px-4 py-2 bg-gray-100 relative">
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
              <div className="absolute top-12 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-[1000] max-h-96 overflow-y-auto">
                {searchResults.map((product) => (
                  <button
                    key={product._id}
                    onClick={() => handleProductClick(product)}
                    className="w-full text-left flex items-center p-3 hover:bg-gray-100 border-b border-gray-100"
                  >
                    <img
                      src={product.image[0]}
                      alt={product.name}
                      className="w-10 h-10 object-cover rounded mr-3"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-500">{product.brand}</p>
                    </div>
                    <p className="text-sm font-bold text-pink-500">
                      Rs. {product.price}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Sidebar Menu */}
        {visible && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-[999] sm:hidden" 
               onClick={() => setVisible(false)} />
        )}
        <div
          ref={mobileMenuRef}
          className={`fixed top-0 right-0 bottom-0 bg-white z-[1000] transition-transform duration-300 ${
            visible ? "translate-x-0" : "translate-x-full"
          } sm:hidden w-64 shadow-lg`}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-2 p-4 border-b">
              <img 
                className="h-4 cursor-pointer" 
                src={assets.back} 
                alt="Back" 
                onClick={() => setVisible(false)}
              />
              <p className="font-medium">Menu</p>
            </div>
            <div className="overflow-y-auto flex-1">
              <div className="p-4 font-medium text-gray-700">Categories</div>
              <NavLink
                to="/"
                className={({ isActive }) => 
                  `block py-3 px-6 border-b hover:text-pink-500 ${
                    isActive ? "text-pink-500 font-medium" : "text-gray-700"
                  }`
                }
                onClick={() => setVisible(false)}
              >
                ALL CATEGORY
              </NavLink>
              <NavLink
                to="/face"
                className={({ isActive }) => 
                  `block py-3 px-6 border-b hover:text-pink-500 ${
                    isActive ? "text-pink-500 font-medium" : "text-gray-700"
                  }`
                }
                onClick={() => setVisible(false)}
              >
                FACE
              </NavLink>
              <NavLink
                to="/eyes"
                className={({ isActive }) => 
                  `block py-3 px-6 border-b hover:text-pink-500 ${
                    isActive ? "text-pink-500 font-medium" : "text-gray-700"
                  }`
                }
                onClick={() => setVisible(false)}
              >
                EYES
              </NavLink>
              <NavLink
                to="/lips"
                className={({ isActive }) => 
                  `block py-3 px-6 border-b hover:text-pink-500 ${
                    isActive ? "text-pink-500 font-medium" : "text-gray-700"
                  }`
                }
                onClick={() => setVisible(false)}
              >
                LIPS
              </NavLink>
              <NavLink
                to="/tools & makeup sets"
                className={({ isActive }) => 
                  `block py-3 px-6 border-b hover:text-pink-500 ${
                    isActive ? "text-pink-500 font-medium" : "text-gray-700"
                  }`
                }
                onClick={() => setVisible(false)}
              >
                TOOLS & MAKEUP SETS
              </NavLink>
              
              <div className="p-4 font-medium text-gray-700 mt-4">Account</div>
              {token ? (
                <>
                  <NavLink
                    to="/profile"
                    className={({ isActive }) => 
                      `block py-3 px-6 border-b hover:text-pink-500 ${
                        isActive ? "text-pink-500 font-medium" : "text-gray-700"
                      }`
                    }
                    onClick={() => setVisible(false)}
                  >
                    My Profile
                  </NavLink>
                  <NavLink
                    to="/orders"
                    className={({ isActive }) => 
                      `block py-3 px-6 border-b hover:text-pink-500 ${
                        isActive ? "text-pink-500 font-medium" : "text-gray-700"
                      }`
                    }
                    onClick={() => setVisible(false)}
                  >
                    My Orders
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left py-3 px-6 border-b hover:text-pink-500 text-gray-700"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={handleOpenLoginPopup}
                  className="w-full text-left py-3 px-6 border-b hover:text-pink-500 text-gray-700"
                >
                  Login / Register
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ALL CATEGORY Section - Desktop */}
        <div className="hidden px-6 lg:px-16 sm:flex bg-gray-100 py-3 border-t flex-wrap items-center justify-between">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center gap-2 hover:text-pink-500 text-sm px-3 py-1 rounded ${
                isActive ? "text-pink-500 font-bold bg-pink-50" : "text-gray-700"
              }`
            }
          >
            ALL CATEGORY
          </NavLink>
          <NavLink
            to="/face"
            className={({ isActive }) =>
              `hover:text-pink-500 text-sm px-3 py-1 rounded ${
                isActive ? "text-pink-500 font-bold bg-pink-50" : "text-gray-700"
              }`
            }
          >
            FACE
          </NavLink>
          <NavLink
            to="/eyes"
            className={({ isActive }) =>
              `hover:text-pink-500 text-sm px-3 py-1 rounded ${
                isActive ? "text-pink-500 font-bold bg-pink-50" : "text-gray-700"
              }`
            }
          >
            EYES
          </NavLink>
          <NavLink
            to="/lips"
            className={({ isActive }) =>
              `hover:text-pink-500 text-sm px-3 py-1 rounded ${
                isActive ? "text-pink-500 font-bold bg-pink-50" : "text-gray-700"
              }`
            }
          >
            LIPS
          </NavLink>
          <NavLink
            to="/tools & makeup sets"
            className={({ isActive }) =>
              `hover:text-pink-500 text-sm px-3 py-1 rounded ${
                isActive ? "text-pink-500 font-bold bg-pink-50" : "text-gray-700"
              }`
            }
          >
            TOOLS & MAKEUP SETS
          </NavLink>
        </div>

        {/* Login Popup */}
        <LoginPopup isOpen={isLoginPopupOpen} onClose={handleCloseLoginPopup} />
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  );
};

export default Navbar;