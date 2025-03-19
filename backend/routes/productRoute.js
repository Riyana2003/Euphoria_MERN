import express from "express";
import { addProduct, listProducts, removeProduct, singleProduct } from '../controllers/productController.js';
import upload from "../middleware/multer.js";
import adminAuth from "../middleware/adminAuth.js";

const productRouter = express.Router();

// Route for adding a product (admin only)
productRouter.post(
  '/add',adminAuth,
   // Ensure only admins can add products
upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'image4', maxCount: 1 }
  ]),
  addProduct
);

// Route for listing all products (admin only)
productRouter.get('/list', listProducts);

// Route for removing a product (admin only)
productRouter.post('/remove',adminAuth,  removeProduct);

// Route for fetching a single product (public access)
productRouter.post('/single/:productId', singleProduct); // Changed to GET and added :productId as a parameter

// Error handling middleware
productRouter.use((err, req, res, next) => {
  console.error("Error in product router:", err);
  res.status(500).json({ success: false, message: "Internal server error" });
});

export default productRouter;