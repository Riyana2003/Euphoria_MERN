/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const LoginPopup = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isRegisterOtpSent, setIsRegisterOtpSent] = useState(false);
  const { setToken, backendUrl } = useContext(ShopContext);
  
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Clear form fields when switching between login and signup
  useEffect(() => {
    if (!isOpen) return;
    setEmail("");
    setOtp("");
    setUsername("");
    setPassword("");
    setConfirmPassword("");
    setIsOtpSent(false);
    setIsRegisterOtpSent(false);
  }, [isLogin, isOpen]);

 const handleSendLoginOtp = async (e) => {
    e.preventDefault();
    try {
        const response = await fetch(`${backendUrl}/api/user/send-login-otp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                email: email.trim(), 
                password: password 
            }),
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.message || "Login failed");
        
        toast.success("OTP sent successfully");
        setIsOtpSent(true);
    } catch (error) {
        console.error("Login error:", error);
        toast.error(error.message || "Login failed. Please check your credentials.");
    }
};

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password || !otp) {
      toast.error("Please enter OTP");
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/api/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, otp }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("user_id", data.userId);
        setToken(data.token);
        toast.success("Login successful");

        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        toast.error(data.message || "Login failed. Please check your OTP.");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleSendRegisterOtp = async (e) => {
    e.preventDefault();
    if (!username || !email || !password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/api/user/send-registration-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password, confirm_password: confirmPassword }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("OTP sent to your email");
        setIsRegisterOtpSent(true);
      } else {
        toast.error(data.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error("OTP send error:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!username || !email || !password || !confirmPassword || !otp) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
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
          email,
          password,
          confirm_password: confirmPassword,
          otp
        }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Registration successful. You can now log in.");
        setIsLogin(true);
        setIsRegisterOtpSent(false);
      } else {
        toast.error(data.message || "Registration failed");
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
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold text-center mb-6">
          {isLogin ? "Login" : "Sign Up"}
        </h2>

        {isLogin ? (
          <form onSubmit={isOtpSent ? handleLogin : handleSendLoginOtp} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 rounded-md px-4 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-pink-500"
              required
              disabled={isOtpSent}
            />
            
            {!isOtpSent ? (
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border border-gray-300 rounded-md px-4 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-pink-500"
                required
              />
            ) : (
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="border border-gray-300 rounded-md px-4 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-pink-500"
                required
              />
            )}

            <button
              type="submit"
              className="bg-pink-500 text-white py-2 rounded-md hover:bg-pink-600 transition"
            >
              {isOtpSent ? "Login" : "Send OTP"}
            </button>

            {isOtpSent && (
              <button
                type="button"
                onClick={() => setIsOtpSent(false)}
                className="text-pink-500 text-sm hover:underline"
              >
                Change Email
              </button>
            )}
          </form>
        ) : (
          <form onSubmit={isRegisterOtpSent ? handleSignUp : handleSendRegisterOtp} className="flex flex-col gap-4">
            {!isRegisterOtpSent ? (
              <>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="border border-gray-300 rounded-md px-4 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="border border-gray-300 rounded-md px-4 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required
                />
              </>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="border border-gray-300 rounded-md px-4 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required
                />
              </>
            )}

            <button
              type="submit"
              className="bg-pink-500 text-white py-2 rounded-md hover:bg-pink-600 transition"
            >
              {isRegisterOtpSent ? "Complete Registration" : "Send OTP"}
            </button>

            {isRegisterOtpSent && (
              <button
                type="button"
                onClick={() => setIsRegisterOtpSent(false)}
                className="text-pink-500 text-sm hover:underline"
              >
                Change Details
              </button>
            )}
          </form>
        )}

        <p className="text-sm text-center mt-4 text-gray-600">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <span
            onClick={() => {
              setIsLogin(!isLogin);
              setIsOtpSent(false);
              setIsRegisterOtpSent(false);
            }}
            className="text-pink-500 cursor-pointer hover:underline"
          >
            {isLogin ? "Sign Up" : "Login"}
          </span>
        </p>
      </div>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default LoginPopup;