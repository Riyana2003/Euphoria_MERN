import {v2 as cloudinary } from "cloudinary"
import productModel from "../models/productModel.js"
// Function for adding a product
const addProduct = async (req, res) => {
    try {
        const { name, description, price, brand, category, shades, bestseller } = req.body;

        const image1 = req.files.image1 && req.files.image1[0];
        const image2 = req.files.image2 && req.files.image2[0];
        const image3 = req.files.image3 && req.files.image3[0];
        const image4 = req.files.image4 && req.files.image4[0];

        const images= [image1, image2, image3, image4].filter((item) => item !== undefined)

        let imagesUrl = await Promise.all(
            images.map(async(item) => {
                let result = await cloudinary.uploader.upload(item.path,{resource_type:'image'});
                return result.secure_url;
            })
        )
       const productData={
        name,
        description,
        brand,
        price:Number(price),
        category,
        bestseller: bestseller === "true" ? true : false,
        shades: JSON.parse(shades),
        image: imagesUrl,
        date: Date.now()
       }

       console.log(productData);

       const product = new productModel (productData);
       await product.save();

        res.json({ success: true, message: "Product added successfully" });

    } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Function for listing products
const listProducts = async (req, res) => {
    try {
       
        const products = await productModel.find({});
        res.json({ success: true, products });
    } catch (error) {
        console.error("Error listing products:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Function for removing a product
const removeProduct = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.body.id)
        res.status(200).json({ success: true, message: "Product removed successfully" });
    } catch (error) {
        console.error("Error removing product:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Function for single product info
const singleProduct = async (req, res) => {
    try {
        
        const { productId } = req.body
        const product = await productModel.findById(productId);
        res.status(200).json({ success: true, product });
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export { addProduct, listProducts, removeProduct, singleProduct };