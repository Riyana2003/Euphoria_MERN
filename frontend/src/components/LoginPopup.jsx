/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import { toast, ToastContainer } from "react-toastify"; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import toast CSS

const LoginPopup = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true); 
  const { setToken, backendUrl } = useContext(ShopContext);
  
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState(""); 
  const [username, setUsername] = useState(""); // Fixed variable name from username to name
  const [confirm_password, setConfirmPassword] = useState("");

  // Clear form fields when switching between login and signup
  useEffect(() => {
    if (!isOpen) return; // Only reset when the popup is open
    setMobile("");
    setPassword("");
    setUsername("");
    setConfirmPassword("");
  }, [isLogin, isOpen]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!mobile || !password) {
      toast.error("Please fill in all fields");
      return;
    }
  
    try {
      const response = await fetch(`${backendUrl}/api/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mobile,
          password,
        }),
      });
  
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("authToken", data.token); // Store token in localStorage
        localStorage.setItem("user_id", data.userId); // Store userId in localStorage
        localStorage.setItem("username", data.username); // Store username in localStorage
        setToken(data.token); // Update token in context
        setUsername(data.username); // Update username in context
        toast.success("Login successful");
  
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        toast.error(data.message || "Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred. Please try again.");
    }
  };
  
  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!username || !mobile || !password || !confirm_password) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password !== confirm_password) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/api/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username, 
          mobile,
          password,
          confirm_password,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Sign-up successful. You can now log in.");
        setIsLogin(true); // Switch to login form after successful signup
      } else {
        toast.error(data.message || "Sign-up failed");
      }
    } catch (error) {
      console.error("Sign-up error:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${
        isOpen ? "visible" : "invisible"
      } transition-opacity duration-300`}
    >
      <div className="bg-white w-96 rounded-lg shadow-lg p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        {/* Header */}
        <h2 className="text-xl font-bold text-center mb-6">
          {isLogin ? "Login" : "Sign Up"}
        </h2>

        {/* Login Form */}
        {isLogin ? (
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Phone Number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="border border-gray-300 rounded-md px-4 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-pink-500"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 rounded-md px-4 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-pink-500"
              required
            />
            <button
              type="submit"
              className="bg-pink-500 text-white py-2 rounded-md hover:bg-pink-600 transition"
            >
              Login
            </button>
          </form>
        ) : (
          /* Signup Form */
          <form onSubmit={handleSignUp} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Full Name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border border-gray-300 rounded-md px-4 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-pink-500"
              required
            />
            <input
              type="text"
              placeholder="Phone Number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="border border-gray-300 rounded-md px-4 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-pink-500"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 rounded-md px-4 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-pink-500"
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirm_password}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border border-gray-300 rounded-md px-4 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-pink-500"
              required
            />
            <button
              type="submit"
              className="bg-pink-500 text-white py-2 rounded-md hover:bg-pink-600 transition"
            >
              Sign Up
            </button>
          </form>
        )}

        {/* Toggle between Login and Signup */}
        <p className="text-sm text-center mt-4 text-gray-600">
          {isLogin
            ? "Don't have an account?"
            : "Already have an account?"} {" "}
          <span
            onClick={() => setIsLogin(!isLogin)}
            className="text-pink-500 cursor-pointer hover:underline"
          >
            {isLogin ? "Sign Up" : "Login"}
          </span>
        </p>
      </div>

      {/* ToastContainer must be included to show toasts */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default LoginPopup;