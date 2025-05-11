/* eslint-disable no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
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
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);  
  const [token, setToken] = useState(() => localStorage.getItem("authToken") || "");
  const [cartItems, setCartItems] = useState(() => {
    const localCart = localStorage.getItem("cart");
    try {
      return localCart ? JSON.parse(localCart) : {};
    } catch (e) {
      return {};
    }
  });
  const [username, setUsername] = useState(() => localStorage.getItem("username") || "");
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  // Persist auth data to localStorage
  useEffect(() => {
    localStorage.setItem("authToken", token);
    localStorage.setItem("username", username);
  }, [token, username]);

  // Persist cart to localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Fetch products and user cart on mount
  useEffect(() => {
    getProductsData();
    if (token) {
      getUserCart();
    }
  }, [token]);

  const getProductsData = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`);
      setProducts(Array.isArray(response.data.products) ? response.data.products : []);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    }
  };

  const findProductById = (itemId) => {
    return products.find(product => product._id === itemId);
  };

  const searchProducts = (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    
    const results = products.filter(product => 
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.brand.toLowerCase().includes(query.toLowerCase())
    );
    
    setSearchResults(results.slice(0, 5));
    setShowSearchResults(results.length > 0);
  };

  const validateShade = (itemId, shadeName) => {
    const product = findProductById(itemId);
    if (!product) {
      toast.error("Product not found");
      return false;
    }
    
    const shadeExists = product.shades?.some(shade => shade.name === shadeName);
    if (!shadeExists) {
      toast.error("Selected shade is not available for this product");
      return false;
    }
    
    return true;
  };

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

    const product = findProductById(itemId);
    const shadeInfo = product.shades.find(shade => shade.name === shadeName);

    setCartItems(prev => {
      const newCart = { ...prev };
      if (!newCart[itemId]) newCart[itemId] = {};
      
      newCart[itemId][shadeName] = {
        quantity: (newCart[itemId][shadeName]?.quantity || 0) + quantity,
        shadeData: shadeInfo
      };
      
      return newCart;
    });

    if (token) {
      try {
        await axios.post(
          `${backendUrl}/api/cart/add`, 
          { itemId, shade: shadeName, quantity }, 
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        toast.success("Item added to cart successfully!");
      } catch (error) {
        console.error("Error adding item to cart:", error);
        toast.error(error.response?.data?.message || "Failed to add item to cart");
      }
    }
  };

  const updateCart = async (itemId, shadeName, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId, shadeName);
      return;
    }

    if (!validateShade(itemId, shadeName)) {
      return;
    }

    setCartItems(prev => {
      const newCart = { ...prev };
      if (!newCart[itemId]) newCart[itemId] = {};
      
      const product = findProductById(itemId);
      const shadeData = product?.shades.find(s => s.name === shadeName);
      
      newCart[itemId][shadeName] = {
        quantity: newQuantity,
        shadeData: shadeData || newCart[itemId][shadeName]?.shadeData
      };
      
      return newCart;
    });

    if (token) {
      try {
        await axios.post(
          `${backendUrl}/api/cart/update`, 
          { itemId, shade: shadeName, quantity: newQuantity }, 
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
      } catch (error) {
        console.error("Error updating cart:", error);
        toast.error("Failed to update cart");
      }
    }
  };

  const removeFromCart = async (itemId, shadeName) => {
    setCartItems(prev => {
      const newCart = { ...prev };
      if (newCart[itemId]?.[shadeName]) {
        delete newCart[itemId][shadeName];
        if (Object.keys(newCart[itemId]).length === 0) {
          delete newCart[itemId];
        }
      }
      return newCart;
    });

    toast.success("Item removed from cart");

    if (token) {
      try {
        await axios.post(`${backendUrl}/api/cart/remove`, {
          itemId,
          shade: shadeName
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      } catch (error) {
        console.error("Error removing item from cart:", error);
      }
    }
  };

  const getUserCart = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/cart/get`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        const cartItems = {};
        for (const [itemId, shades] of Object.entries(response.data.cartData || {})) {
          cartItems[itemId] = {};
          const product = findProductById(itemId);
          
          for (const [shadeName, itemData] of Object.entries(shades)) {
            const shadeData = product?.shades.find(s => s.name === shadeName);
            cartItems[itemId][shadeName] = {
              quantity: itemData.quantity,
              shadeData: shadeData || { name: shadeName }
            };
          }
        }
        
        setCartItems(cartItems);
      }
    } catch (error) {
      console.error("Error fetching user cart:", error);
    }
  };

  const getCartCount = () => {
    return Object.values(cartItems).reduce((totalCount, shades) => {
      return totalCount + Object.values(shades).reduce((sum, item) => sum + (item.quantity || 0), 0);
    }, 0);
  };

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

  const safeSetCartItems = (newCart) => {
    if (typeof newCart === 'object') {
      setCartItems(newCart);
      localStorage.setItem("cart", JSON.stringify(newCart));
    }
  };

  const value = {
    products,
    currency,
    delivery_fee,
    searchQuery,
    setSearchQuery,
    cartItems,
    setCartItems: safeSetCartItems,
    addToCart,
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
    findProductById,
    searchResults,
    showSearchResults,
    setShowSearchResults,
    searchProducts,
  };

  return <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>;
};

export default ShopContextProvider;