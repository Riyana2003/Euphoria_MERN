// middleware/attachProducts.js
import productModel from '../models/productModel.js';

const attachProducts = async (req, res, next) => {
  try {
    // Fetch products from the database
    const products = await productModel.find({});
    req.products = products; // Attach products to the request object
    next();
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch products' });
  }
};

export default attachProducts;