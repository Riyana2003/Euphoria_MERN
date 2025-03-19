/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */

import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Create the ShopContext
export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const [searchQuery, setSearchQuery] = useState("");
  const currency = "Rs.";
  const delivery_fee = 50;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState(() => localStorage.getItem("authToken") || "");
  const [cartItems, setCartItems] = useState({});
  const [username, setUsername] = useState(() => localStorage.getItem("username") || "");
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  // Persist token and username in localStorage
  useEffect(() => {
    localStorage.setItem("authToken", token || "");
    localStorage.setItem("username", username || "");

  }, [token, username]);

  // Fetch products on mount
  useEffect(() => {
    getProductsData();
  }, []);

  // Fetch products from the backend
  const getProductsData = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`);
      console.log("Fetched Products:", response.data);
      setProducts(Array.isArray(response.data.products) ? response.data.products : []);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    }
  };

  // Add item to cart
  const addToCart = async (itemId, shades, quantity) => {
    if (!shades || !quantity) {
      toast.error("Select your shade and quantity");
      return;
    }

    let cartData = { ...cartItems };
    if (!cartData[itemId]) {
      cartData[itemId] = {};
    }
    cartData[itemId][shades] = (cartData[itemId][shades] || 0) + quantity;
    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(`${backendUrl}/api/cart/add`, { itemId, shades, quantity }, { headers: { Authorization: `Bearer ${token}` } });
        toast.success("Item added to cart successfully!");
      } catch (error) {
        console.error("Error adding item to cart:", error);
        toast.error(error.response?.data?.message || "Failed to add item to cart");
      }
    }
  };

  // Update cart item quantity
  const updateCart = async (itemId, shades, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId, shades);
    } else {
      let cartData = { ...cartItems };
      if (!cartData[itemId]) {
        cartData[itemId] = {};
      }
      cartData[itemId][shades] = newQuantity;
      setCartItems(cartData);

      if (token) {
        try {
          await axios.post(`${backendUrl}/api/cart/update`, { itemId, shades, quantity: newQuantity }, { headers: { Authorization: `Bearer ${token}` } });
        } catch (error) {
          console.error("Error updating cart:", error);
        }
      }
    }
  };

  // Remove item from cart
  const removeFromCart = async (itemId, shades) => {
    let cartData = { ...cartItems };
    if (cartData[itemId] && cartData[itemId][shades]) {
      delete cartData[itemId][shades];
      if (Object.keys(cartData[itemId]).length === 0) {
        delete cartData[itemId];
      }
    }

    setCartItems(cartData);
    toast.success("Item removed from cart");

    if (token) {
      try {
        await axios.post(`${backendUrl}/api/cart/remove`, { itemId, shades }, { headers: { Authorization: `Bearer ${token}` } });
      } catch (error) {
        console.error("Error removing item from cart:", error);
      }
    }
  };

  // Fetch user cart from the backend
  const getUserCart = async () => {
    if (!token) return;

    try {
      const response = await axios.post(`${backendUrl}/api/cart/get`, { userId: localStorage.getItem("user_id") }, { headers: { Authorization: `Bearer ${token}` } });
      if (response.data.success) {
        setCartItems(response.data.cartData || {});
      } else {
        console.error("Failed to fetch cart:", response.data.message);
        setCartItems({});
      }
    } catch (error) {
      console.error("Error fetching user cart:", error);
      setCartItems({});
    }
  };

  useEffect(() => {
    if (token) {
      getUserCart();
    }
  }, [token]);

  // Get total count of items in the cart
  const getCartCount = () => {
    return Object.values(cartItems).reduce((totalCount, shades) => {
      return totalCount + Object.values(shades).reduce((sum, qty) => sum + qty, 0);
    }, 0);
  };

  // Provide context values to children
  const value = {
    products,
    currency,
    delivery_fee,
    searchQuery,
    setSearchQuery,
    cartItems,
    addToCart,
    setCartItems,
    updateCart,
    notifications,
    setNotifications,
    removeFromCart,
    getCartCount,
    navigate,
    backendUrl,
    token,
    setToken,
    username,
    setUsername,
  };

  return <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>;
};

export default ShopContextProvider;
