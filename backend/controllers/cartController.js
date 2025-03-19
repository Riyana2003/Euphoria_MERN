import userModel from "../models/userModel.js";

// Add products to user cart
const addToCart = async (req, res) => {
    try {
        const { userId, itemId, shades, quantity } = req.body;

        // Validate input
        if (!userId || !itemId || !shades || quantity == null) {
            return res.status(400).json({ success: false, message: "User ID, item ID, shade, and quantity are required" });
        }

        const userData = await userModel.findById(userId);
        if (!userData) return res.status(404).json({ success: false, message: "User not found" });

        let cartData = { ...userData.cartData };

        if (!cartData[itemId]) {
            cartData[itemId] = {};
        }

        cartData[itemId][shades] = (cartData[itemId][shades] || 0) + quantity;

        await userModel.findByIdAndUpdate(userId, { $set: { cartData } });

        res.status(200).json({ success: true, message: "Added to Cart" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Update user cart
const updateCart = async (req, res) => {
    try {
        const { userId, itemId, shades, quantity } = req.body;

        // Validate input
        if (!userId || !itemId || !shades || quantity == null) {
            return res.status(400).json({ success: false, message: "User ID, item ID, shade, and quantity are required" });
        }

        const userData = await userModel.findById(userId);
        if (!userData) return res.status(404).json({ success: false, message: "User not found" });

        let cartData = { ...userData.cartData };

        if (!cartData[itemId] || !cartData[itemId][shades]) {
            return res.status(404).json({ success: false, message: "Item or shade not in cart" });
        }

        if (quantity > 0) {
            cartData[itemId][shades] = quantity;
        } else {
            delete cartData[itemId][shades]; // Remove shade if quantity is 0
            if (Object.keys(cartData[itemId]).length === 0) {
                delete cartData[itemId]; // Remove item if no shades left
            }
        }

        await userModel.findByIdAndUpdate(userId, { $set: { cartData } });

        res.status(200).json({ success: true, message: "Cart Updated" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Get user cart data
const getUserCart = async (req, res) => {
    try {
        const { userId } = req.body;

        // Validate input
        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }

        let userData = await userModel.findById(userId);
        if (!userData) return res.status(404).json({ success: false, message: "User not found" });

        res.status(200).json({ success: true, cartData: userData.cartData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
    try {
        const { userId, itemId, shades } = req.body;

        // Validate input
        if (!userId || !itemId || !shades) {
            return res.status(400).json({ success: false, message: "User ID, item ID, and shade are required" });
        }

        const userData = await userModel.findById(userId);
        if (!userData) return res.status(404).json({ success: false, message: "User not found" });

        let cartData = { ...userData.cartData };

        if (cartData[itemId] && cartData[itemId][shades]) {
            delete cartData[itemId][shades];
        }

        if (cartData[itemId] && Object.keys(cartData[itemId]).length === 0) {
            delete cartData[itemId];
        }

        await userModel.findByIdAndUpdate(userId, { $set: { cartData } });

        res.status(200).json({ success: true, message: "Item removed from cart" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export { addToCart, updateCart, getUserCart, removeFromCart };
