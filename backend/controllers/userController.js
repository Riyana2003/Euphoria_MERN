import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

// Function to create a JWT token
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET);
};

// Route for user login
const loginUser = async (req, res) => {
    try {
        const { mobile, password } = req.body;

        // Check if mobile and password are provided
        if (!mobile || !password) {
            return res.status(400).json({ success: false, message: "Mobile and password are required" });
        }

        // Find the user by mobile number
        const user = await userModel.findOne({ mobile });
        if (!user) {
            return res.status(401).json({ success: false, message: "User doesn't exist" });
        }

        // Compare the provided password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        // Generate a token for the user
        const token = createToken(user._id);

        // Return success response with token and user ID
        res.status(200).json({ success: true, token, userId: user._id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Route for user registration
const registerUser = async (req, res) => {
    try {
        const { username, mobile, password, confirm_password } = req.body;

        // Ensure all fields are present
        if (!username || !mobile || !password || !confirm_password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // Check if the user already exists
        const exists = await userModel.findOne({ mobile });
        if (exists) {
            return res.status(409).json({ success: false, message: "User already exists" });
        }

        // Validate mobile number
        if (!validator.isMobilePhone(mobile)) {
            return res.status(400).json({ success: false, message: "Please enter a valid mobile number" });
        }

        // Validate password strength
        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Password must be at least 8 characters long" });
        }

        // Validate confirm_password
        if (password !== confirm_password) {
            return res.status(400).json({ success: false, message: "Passwords do not match" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Save new user to the database
        const newUser = new userModel({
            username,
            mobile,
            password: hashedPassword,
            confirm_password: hashedPassword,
        });

        const user = await newUser.save();

        // Generate a token for the user
        const token = createToken(user._id);

        // Return success response with token
        res.status(201).json({ success: true, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Route for admin login
const adminLogin = async (req, res) => {
    try {
        const { mobile, password } = req.body;

        // Check if mobile and password match admin credentials
        if (mobile === process.env.ADMIN_MOBILE && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(mobile + password, process.env.JWT_SECRET);
            res.status(200).json({ success: true, token });
        } else {
            res.status(401).json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        console.log("Admin login error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Exporting the routes
export { loginUser, registerUser, adminLogin };