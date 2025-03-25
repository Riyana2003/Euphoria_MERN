  import Order from "../models/orderModel.js";
  import User from "../models/userModel.js";
  import axios from "axios";
  import { v4 as uuidv4 } from "uuid"; // For generating temporary unique pidx

  // Helper function to validate order data
  const validateOrderData = (userId, items, amount, address) => {
    if (!userId || !items || !amount || !address) {
      throw new Error("Missing required fields: userId, items, amount, or address.");
    }
    if (!Array.isArray(items) || items.length === 0) {
      throw new Error("Items must be a non-empty array.");
    }
    if (typeof amount !== "number" || amount <= 0) {
      throw new Error("Amount must be a positive number.");
    }
    // Validate each item in the items array
    items.forEach((item, index) => {
      if (!item._id) {
        throw new Error(`Product ID is required for item at index ${index}.`);
      }
      if (!item.quantity || typeof item.quantity !== "number" || item.quantity <= 0) {
        throw new Error(`Invalid quantity for item at index ${index}. Quantity must be a positive number.`);
      }
      if (!item.image) {
        throw new Error(`Image is required for item at index ${index}.`);
      }
    });
  };

  // Placing orders (COD and Khalti)
  const placeOrder = async (req, res) => {
    try {
      const { userId, items, amount, address, paymentMethod } = req.body;

      // Validate order data
      validateOrderData(userId, items, amount, address);

      // Initialize order data
      const orderData = {
        userId,
        items,
        amount,
        address,
        paymentMethod,
        payment: paymentMethod === "Khalti", // true for Khalti, false for COD
        status: paymentMethod === "COD" ? "Processing" : "Pending",
        date: Date.now(),
      };

      // Save the order to the database
      const newOrder = new Order(orderData);
      await newOrder.save();

      // Clear the user's cart after placing the order
      await User.findByIdAndUpdate(userId, { cartData: {} });

      res.status(201).json({ 
        success: true, 
        message: "Your order has been placed successfully.", 
        order: newOrder 
      });
    } catch (error) {
      console.error("Error placing order:", error);
      res.status(400).json({ 
        success: false, 
        message: error.message 
      });
    }
  };

  // Initiate Khalti Payment
  const initiateKhaltiPayment = async (req, res) => {
    try {
      const { userId, items, amount, address } = req.body;

      // Validate order data
      validateOrderData(userId, items, amount, address);

      // Create temporary order with a unique pidx
      const tempOrder = new Order({
        userId,
        items,
        amount,
        address,
        paymentMethod: "Khalti",
        payment: false,
        status: "Pending",
        pidx: uuidv4(), // Set a temporary unique pidx
      });

      const savedOrder = await tempOrder.save();

      // Prepare Khalti payload
      const khaltiPayload = {
        return_url: `${process.env.FRONTEND_URL}/payment-success?orderId=${savedOrder._id}&pidx=${savedOrder.pidx}`,
        website_url: process.env.FRONTEND_URL,
        amount: amount * 100, // Convert to paisa
        purchase_order_id: savedOrder._id,
        purchase_order_name: "Beauty Product Order",
      };

      // Initiate payment with Khalti
      const khaltiResponse = await axios.post(
        "https://a.khalti.com/api/v2/epayment/initiate/",
        khaltiPayload,
        {
          headers: {
            Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Update the order with the actual pidx from Khalti
      savedOrder.pidx = khaltiResponse.data.pidx;
      await savedOrder.save();

      res.status(200).json({
        success: true,
        paymentUrl: khaltiResponse.data.payment_url,
      });
    } catch (error) {
      console.error("Error initiating Khalti payment:", error);
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };
      // Verify payment with Khalti API
      const verifyKhaltiPayment = async (req, res) => {
        try {
          const { pidx } = req.body;
      
          if (!pidx) {
            return res.status(400).json({
              success: false,
              message: "Payment ID (pidx) is required.",
            });
          }
      
          const verificationResponse = await axios.post(
            "https://a.khalti.com/api/v2/epayment/lookup/",
            { pidx },
            {
              headers: {
                Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
                "Content-Type": "application/json",
              },
            }
          );
      
          const paymentData = verificationResponse.data;
      
          if (paymentData.status !== "Completed") {
            throw new Error("Khalti payment failed or is pending.");
          }
      
          const order = await Order.findOneAndUpdate(
            { pidx },
            {
              payment: true,
              status: "Processing",
            },
            { new: true }
          );
      
          if (!order) {
            throw new Error("Order not found for this payment.");
          }
      
          await User.findByIdAndUpdate(order.userId, { cartData: {} });
      
          res.status(200).json({
            success: true,
            message: "Payment verified successfully.",
            order,
          });
        } catch (error) {
          console.error("Error verifying Khalti payment:", error);
      
          if (error.response) {
            const { status, data } = error.response;
            return res.status(status).json({
              success: false,
              message: "Khalti payment verification failed",
              details: pidx,
            });
          } else {
            return res.status(500).json({
              success: false,
              message: error.message || "Internal server error during payment verification.",
            });
          }
        }
      };
      

  // All Orders data for Admin Panel
  const allOrders = async (req, res) => {
    try {
      const orders = await Order.find({});
      res.status(200).json({ success: true, data: orders });
    } catch (error) {
      console.error("Error fetching all orders:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  };

  // User Order Data For Frontend
  const userOrders = async (req, res) => {
    try {
      const { userId } = req.body;

      if (!userId) {
        throw new Error("User ID is required.");
      }

      const orders = await Order.find({ userId });
      res.status(200).json({ success: true, data: orders });
    } catch (error) {
      console.error("Error fetching user orders:", error);
      res.status(400).json({ success: false, message: error.message });
    }
  };

  // Update Order Status
  const updateStatus = async (req, res) => {
    try {
      const { orderId, status } = req.body;

      if (!orderId || !status) {
        throw new Error("Order ID and status are required.");
      }

      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        { status },
        { new: true }
      );

      if (!updatedOrder) {
        throw new Error("Order not found.");
      }

      res.status(200).json({
        success: true,
        message: "Order status updated successfully.",
        order: updatedOrder,
      });
    } catch (error) {
      console.error("Error updating order status:", error);
      res.status(400).json({ success: false, message: error.message });
    }
  };

  export {  
    placeOrder,
    initiateKhaltiPayment,
    verifyKhaltiPayment,
    allOrders,
    userOrders,
    updateStatus,
  };