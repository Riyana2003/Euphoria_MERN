/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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

  useEffect(() => {
    localStorage.setItem("authToken", token || "");
    localStorage.setItem("username", username || "");
  }, [token, username]);

  useEffect(() => {
    getProductsData();
  }, []);

  const getProductsData = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`);
      setProducts(Array.isArray(response.data.products) ? response.data.products : []);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    }
  };

  // Helper to find product by ID
  const findProductById = (itemId) => {
    return products.find(product => product._id === itemId);
  };

  // Helper to validate shade exists for product
  const validateShade = (itemId, shadeName) => {
    const product = findProductById(itemId);
    if (!product) {
      toast.error("Product not found");
      return false;
    }
    
    const shadeExists = product.shades.some(shade => shade.name === shadeName);
    if (!shadeExists) {
      toast.error("Selected shade is not available for this product");
      return false;
    }
    
    return true;
  };

  // Enhanced addToCart with shade validation
  const addToCart = async (itemId, shadeName, quantity) => {
    if (!shadeName) {
      toast.error("Please select a shade");
      return;
    }

    if (!quantity || quantity <= 0) {
      toast.error("Please select a valid quantity");
      return;
    }

    if (!validateShade(itemId, shadeName)) {
      return;
    }

    // Get complete shade info
    const product = findProductById(itemId);
    const shadeInfo = product.shades.find(shade => shade.name === shadeName);

    let cartData = { ...cartItems };
    if (!cartData[itemId]) {
      cartData[itemId] = {};
    }
    
    // Store shade info along with quantity
    cartData[itemId][shadeName] = {
      quantity: (cartData[itemId][shadeName]?.quantity || 0) + quantity,
      shadeData: shadeInfo // Store complete shade info
    };
    
    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(
          `${backendUrl}/api/cart/add`, 
          { itemId, shade: shadeName, quantity }, 
          { headers: token }
        );
        toast.success("Item added to cart successfully!");
      } catch (error) {
        console.error("Error adding item to cart:", error);
        toast.error(error.response?.data?.message || "Failed to add item to cart");
      }
    }
  };

  // Enhanced updateCart with shade validation
  const updateCart = async (itemId, shadeName, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId, shadeName);
      return;
    }

    if (!validateShade(itemId, shadeName)) {
      return;
    }

    let cartData = { ...cartItems };
    if (!cartData[itemId]) {
      cartData[itemId] = {};
    }
    
    // Preserve shade data when updating quantity
    cartData[itemId][shadeName] = {
      quantity: newQuantity,
      shadeData: cartData[itemId][shadeName]?.shadeData || findProductById(itemId)?.shades.find(s => s.name === shadeName)
    };
    
    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(
          `${backendUrl}/api/cart/update`, 
          { itemId, shade: shadeName, quantity: newQuantity }, 
          { headers: token }
        );
      } catch (error) {
        console.error("Error updating cart:", error);
      }
    }
  };

  const removeFromCart = async (itemId, shadeName) => {
    let cartData = { ...cartItems };
    if (cartData[itemId] && cartData[itemId][shadeName]) {
      delete cartData[itemId][shadeName];
      if (Object.keys(cartData[itemId]).length === 0) {
        delete cartData[itemId];
      }
    }

    setCartItems(cartData);
    toast.success("Item removed from cart");

    if (token) {
      try {
        await axios.post(
          `${backendUrl}/api/cart/remove`, 
          { itemId, shade: shadeName }, 
          { headers: token }
        );
      } catch (error) {
        console.error("Error removing item from cart:", error);
      }
    }
  };

  const getUserCart = async () => {
    if (!token) return;

    try {
      const response = await axios.post(
        `${backendUrl}/api/cart/get`, 
        { userId: localStorage.getItem("user_id") }, 
        { headers: token}
      );
      
      if (response.data.success) {
        // Enhance cart items with shade data if missing
        const enhancedCart = {};
        for (const [itemId, shades] of Object.entries(response.data.cartData || {})) {
          enhancedCart[itemId] = {};
          const product = findProductById(itemId);
          
          for (const [shadeName, quantity] of Object.entries(shades)) {
            const shadeData = product?.shades.find(s => s.name === shadeName);
            enhancedCart[itemId][shadeName] = {
              quantity,
              shadeData: shadeData || { name: shadeName } // Fallback if shade not found
            };
          }
        }
        
        setCartItems(enhancedCart);
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

  const getCartCount = () => {
    return Object.values(cartItems).reduce((totalCount, shades) => {
      return totalCount + Object.values(shades).reduce((sum, item) => sum + (item.quantity || 0), 0);
    }, 0);
  };

  // Get total cart amount
  const getTotalCartAmount = () => {
    return Object.entries(cartItems).reduce((total, [itemId, shades]) => {
      const product = findProductById(itemId);
      if (!product) return total;
      
      const itemTotal = Object.values(shades).reduce((sum, item) => {
        return sum + (product.price * (item.quantity || 0));
      }, 0);
      
      return total + itemTotal;
    }, 0);
  };

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
    getTotalCartAmount,
    navigate,
    backendUrl,
    token,
    setToken,
    username,
    setUsername,
    findProductById, // Expose this for components to use
  };

  return <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>;
};

export default ShopContextProvider;