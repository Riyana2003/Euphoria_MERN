    import { v2 as cloudinary } from "cloudinary";
    import productModel from "../models/productModel.js";

    // Helper function for Cloudinary upload
    async function uploadToCloudinary(file) {
        const result = await cloudinary.uploader.upload(file.path, {
            resource_type: 'image',
            folder: 'products'
        });
        return result.secure_url;
    }

    const addProduct = async (req, res) => {
        try {
            // Validate required fields first
            const { name, description, price, brand, category, shadeNames, bestseller } = req.body;
            if (!name || !description || !price || !brand || !category) {
                return res.status(400).json({ 
                    success: false, 
                    message: "Missing required fields" 
                });
            }

            // Process main product image
            const mainImages = [];
            for (let i = 1; i <= 4; i++) {
                if (req.files[`image${i}`] && req.files[`image${i}`][0]) {
                    mainImages.push(req.files[`image${i}`][0]);
                }
            }

            // Validate at least one main image exists
            if (mainImages.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "At least one main product image is required"
                });
            }

            // Parse shade names
            let parsedShadeNames;
            try {
                parsedShadeNames = JSON.parse(shadeNames);
                if (!Array.isArray(parsedShadeNames)) {
                    throw new Error("Shade names must be an array");
                }
            } catch (parseError) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid shade names format"
                });
            }

            // Process shade images
            const shadeImages = [];
            for (let shadeIndex = 0; shadeIndex < parsedShadeNames.length; shadeIndex++) {
                const shadeImageUrls = [];
                
                // Check for each possible image (1-4) for this shade
                for (let imgNum = 1; imgNum <= 4; imgNum++) {
                    const fieldName = `shade${shadeIndex}_image${imgNum}`;
                    if (req.files[fieldName] && req.files[fieldName][0]) {
                        shadeImageUrls.push(req.files[fieldName][0]);
                    }
                }
                
                if (shadeImageUrls.length === 0) {
                    return res.status(400).json({
                        success: false,
                        message: `No images provided for shade ${parsedShadeNames[shadeIndex]}`
                    });
                }
                
                shadeImages.push(shadeImageUrls);
            }

            // Upload all images to Cloudinary
            const [mainImagesUrl, shadeImagesUrls] = await Promise.all([
                Promise.all(mainImages.map(uploadToCloudinary)),
                Promise.all(shadeImages.map(shade => 
                    Promise.all(shade.map(uploadToCloudinary)))
                )
            ]);

            // Prepare product data
            const productData = {
                name,
                description,
                brand,
                price: Number(price),
                category,
                bestseller: bestseller === "true",
                shades: parsedShadeNames.map((shadeName, index) => ({
                    name: shadeName,
                    image: shadeImagesUrls[index], // Now storing ALL shade images as an array
                    colorCode: req.body[`shadeColor${index}`] || '#FFFFFF'
                })),
                image: mainImagesUrl,
                date: Date.now()
            };

            // Save to database
            const product = new productModel(productData);
            await product.save();

            res.status(201).json({ 
                success: true, 
                message: "Product added successfully",
                productId: product._id
            });

        } catch (error) {
            console.error("Server error adding product:", error);
            res.status(500).json({ 
                success: false, 
                message: "Internal server error",
                error: error.message 
            });
        }
    };

    const listProducts = async (req, res) => {
        try {
            const products = await productModel.find({});
            res.json({ success: true, products });
        } catch (error) {
            console.error("Error listing products:", error);
            res.status(500).json({ success: false, message: error.message });
        }
    };

    const removeProduct = async (req, res) => {
        try {
            await productModel.findByIdAndDelete(req.body.id);
            res.status(200).json({ success: true, message: "Product removed successfully" });
        } catch (error) {
            console.error("Error removing product:", error);
            res.status(500).json({ success: false, message: error.message });
        }
    };

    const singleProduct = async (req, res) => {
        try {
            const { productId } = req.body;
            const product = await productModel.findById(productId);
            if (!product) {
                return res.status(404).json({ success: false, message: "Product not found" });
            }
            res.status(200).json({ success: true, product });
        } catch (error) {
            console.error("Error fetching product:", error);
            res.status(500).json({ success: false, message: error.message });
        }
    };

    export { addProduct, listProducts, removeProduct, singleProduct };