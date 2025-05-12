import express from "express";
import { addProduct, listProducts, removeProduct, singleProduct } from '../controllers/productController.js';
import upload from "../middleware/multer.js";
import adminAuth from "../middleware/adminAuth.js";

const productRouter = express.Router();

// Configure file upload fields for products
const productUpload = upload.fields([
  // Main product images
  { name: 'image1', maxCount: 1 },
  { name: 'image2', maxCount: 1 },
  { name: 'image3', maxCount: 1 },
  { name: 'image4', maxCount: 1 },
  
  // Shade images - supports up to 10 shades with 4 images each
  ...Array.from({ length: 10 }, (_, shadeIndex) => [
    { name: `shade${shadeIndex}_image1`, maxCount: 1 },
    { name: `shade${shadeIndex}_image2`, maxCount: 1 },
    { name: `shade${shadeIndex}_image3`, maxCount: 1 },
    { name: `shade${shadeIndex}_image4`, maxCount: 1 }
  ]).flat()
]);

// Route for adding a product (admin only)
productRouter.post(
  '/add',
  adminAuth,
  (req, res, next) => {
    productUpload(req, res, (err) => {
      if (err) {
        // Handle Multer errors specifically
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          console.warn(`Unexpected file field detected: ${err.field}`);
          // Continue processing without failing for unexpected files
          return next();
        }
        return next(err);
      }
      next();
    });
  },
  addProduct
);

// Route for listing all products (admin only)
productRouter.get('/list', listProducts);

// Route for removing a product (admin only)
productRouter.post('/remove', adminAuth, removeProduct);

// Route for fetching a single product (public access)
productRouter.get('/single/:productId', singleProduct); // Changed to GET with parameter

// Error handling middleware
productRouter.use((err, req, res, next) => {
  console.error("Error in product router:", err);
  
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: err.code === 'LIMIT_FILE_SIZE' 
        ? 'File too large. Maximum size is 30MB'
        : 'File upload error'
    });
  }
  
  res.status(500).json({ 
    success: false, 
    message: "Internal server error",
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

export default productRouter;