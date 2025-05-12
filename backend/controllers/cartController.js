import userModel from "../models/userModel.js";

// Add products to user cart
const addToCart = async (req, res) => {
    try {
        const { userId, itemId, shadeName, quantity } = req.body;

        // Validate input
        if (!userId || !itemId || shadeName|| quantity == null) {
            return res.status(400).json({ 
                success: false, 
                message: "User ID, item ID, shade name, and quantity are required" 
            });
        }

        if (quantity <= 0) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be greater than 0"
            });
        }

        const userData = await userModel.findById(userId);
        if (!userData) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found" 
            });
        }

        let cartData = userData.cartData || {};

        // Initialize item if it doesn't exist
        if (!cartData[itemId]) {
            cartData[itemId] = {};
        }

        // Initialize shade if it doesn't exist
        if (!cartData[itemId][shadeName]) {
            cartData[itemId][shadeName] = 0;
        }

        // Update quantity
        cartData[itemId][shadeName] += quantity;

        await userModel.findByIdAndUpdate(userId, { cartData });

        return res.status(200).json({ 
            success: true, 
            message: "Added to Cart",
            cartData
        });
    } catch (error) {
        console.error("Error in addToCart:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Internal server error",
            error: error.message 
        });
    }
};

// Update user cart
const updateCart = async (req, res) => {
    try {
        const { userId, itemId, shadeName, quantity } = req.body;

        // Validate input
        if (!userId || !itemId || shadeName|| quantity == null) {
            return res.status(400).json({ 
                success: false, 
                message: "User ID, item ID, shade name, and quantity are required" 
            });
        }

        const userData = await userModel.findById(userId);
        if (!userData) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found" 
            });
        }

        let cartData = userData.cartData || {};

        // Check if item and shade exist in cart
        if (!cartData[itemId] || !cartData[itemId][shadeName]) {
            return res.status(404).json({ 
                success: false, 
                message: "Item or shade not found in cart" 
            });
        }

        if (quantity > 0) {
            cartData[itemId][shadeName] = quantity;
        } else {
            // Remove shade if quantity is 0 or less
            delete cartData[itemId][shadeName];
            
            // Remove item if no shades left
            if (Object.keys(cartData[itemId]).length === 0) {
                delete cartData[itemId];
            }
        }

        await userModel.findByIdAndUpdate(userId, { cartData });

        return res.status(200).json({ 
            success: true, 
            message: "Cart Updated",
            cartData
        });
    } catch (error) {
        console.error("Error in updateCart:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Internal server error",
            error: error.message 
        });
    }
};

// Get user cart data
const getUserCart = async (req, res) => {
    try {
        const { userId } = req.body;

        // Validate input
        if (!userId) {
            return res.status(400).json({ 
                success: false, 
                message: "User ID is required" 
            });
        }

        const userData = await userModel.findById(userId);
        if (!userData) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found" 
            });
        }

        return res.status(200).json({ 
            success: true, 
            cartData: userData.cartData || {} 
        });
    } catch (error) {
        console.error("Error in getUserCart:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Internal server error",
            error: error.message 
        });
    }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
    try {
        const { userId, itemId, shadeName } = req.body;

        // Validate input
        if (!userId || !itemId || shadeName === undefined) {
            return res.status(400).json({ 
                success: false, 
                message: "User ID, item ID, and shade name are required" 
            });
        }

        const userData = await userModel.findById(userId);
        if (!userData) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found" 
            });
        }

        let cartData = userData.cartData || {};

        // Check if item and shade exist
        if (cartData[itemId] && cartData[itemId][shadeName]) {
            delete cartData[itemId][shadeName];
            
            // Remove item if no shades left
            if (Object.keys(cartData[itemId]).length === 0) {
                delete cartData[itemId];
            }
        } else {
            return res.status(404).json({ 
                success: false, 
                message: "Item or shade not found in cart" 
            });
        }

        await userModel.findByIdAndUpdate(userId, { cartData });

        return res.status(200).json({ 
            success: true, 
            message: "Item removed from cart",
            cartData
        });
    } catch (error) {
        console.error("Error in removeFromCart:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Internal server error",
            error: error.message 
        });
    }
};

export { addToCart, updateCart, getUserCart, removeFromCart };