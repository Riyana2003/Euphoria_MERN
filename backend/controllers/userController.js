import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import otpGenerator from "otp-generator";
import nodemailer from "nodemailer";

// Function to create a JWT token
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET);
};

// Email transporter configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
        rejectUnauthorized: false,
    },
});

// Update your otpStorage to store both OTP and timestamp
const otpStorage = new Map(); // Now stores { otp: string, timestamp: number }

// Helper function to check if OTP is expired (2 minutes)
const isOtpExpired = (timestamp) => {
    const now = Date.now();
    return now - timestamp > 2 * 60 * 1000; 
};

// Modified sendLoginOtp function
const sendLoginOtp = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("Login attempt for:", email);

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password required" });
        }

        const user = await userModel.findOne({ email });
        console.log("Found user:", user);

        if (!user) {
            console.log("User not found");
            return res.status(401).json({ message: "Invalid credentials" });
        }

        if (!user.password) {
            console.log("User has no password set");
            return res.status(401).json({ message: "Invalid credentials" });
        }

        console.log("Comparing passwords...");
        const isMatch = await bcrypt.compare(password, user.password);
        console.log("Password match:", isMatch);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        
        // Generate OTP
        const otp = otpGenerator.generate(6, {
            digits: true,
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false
        });

        // Store OTP with timestamp
        otpStorage.set(email, {
            otp,
            timestamp: Date.now()
        });

        // Send OTP email
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your Login OTP',
            text: `Your OTP is: ${otp}`,
            html: `<h2>Your One-Time Password</h2>
    <p>Hello valued Euphoria customer,</p>
    <p>We received a request to log in to your account. Please use the following OTP to complete your login:</p>
    <div class="otp-container">
        <div class="otp-code">${otp}</div>
    </div>
    <p><strong>This OTP will expire in 2 minutes.</strong></p>
    <p>If you didn't request this OTP, please ignore this email or contact our support team immediately.</p>`
        });

        res.status(200).json({ success: true, message: "OTP sent successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to send OTP" });
    }
};

// Modified loginUser function (OTP verification part)
const loginUser = async (req, res) => {
    try {
        const { email, password, otp } = req.body;

        // Validate inputs
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }

        // Find user
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        // If OTP is provided, verify it
        if (otp) {
            const storedData = otpStorage.get(email);
            
            // Check if OTP exists
            if (!storedData || !storedData.otp) {
                return res.status(401).json({ success: false, message: "OTP not found or expired" });
            }
            
            // Check if OTP is expired
            if (isOtpExpired(storedData.timestamp)) {
                otpStorage.delete(email);
                return res.status(401).json({ success: false, message: "OTP expired" });
            }
            
            // Verify OTP code
            if (storedData.otp !== otp) {
                return res.status(401).json({ success: false, message: "Invalid OTP" });
            }
            
            // Clear OTP after successful verification
            otpStorage.delete(email);
            
            // Generate token
            const token = createToken(user._id);
            return res.status(200).json({ success: true, token, userId: user._id });
        }

        // If no OTP, indicate it's required
        return res.status(202).json({ 
            success: true, 
            message: "Password verified. OTP required." 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};


// Route for user registration with OTP verification
const registerUser = async (req, res) => {
    try {
        const { username, email, password, confirm_password, otp } = req.body;

        // Validate inputs
        if (!username || !email || !password || !confirm_password || !otp) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // Validate email
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Invalid email format" });
        }

        // Check if user exists
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.status(409).json({ success: false, message: "Email already registered" });
        }

        // Verify OTP with timestamp check
        const storedData = otpStorage.get(email);
        if (!storedData || !storedData.otp) {
            return res.status(401).json({ success: false, message: "OTP not found or expired" });
        }
        
        if (isOtpExpired(storedData.timestamp)) {
            otpStorage.delete(email);
            return res.status(401).json({ success: false, message: "OTP expired" });
        }
        
        if (storedData.otp !== otp) {
            return res.status(401).json({ success: false, message: "Invalid OTP" });
        }

        // Validate password
        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
        }

        if (password !== confirm_password) {
            return res.status(400).json({ success: false, message: "Passwords do not match" });
        }

        // Hash password and create user
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            username,
            email,
            password: hashedPassword,
        });

        const user = await newUser.save();
        otpStorage.delete(email);

        // Generate token
        const token = createToken(user._id);
        res.status(201).json({ success: true, token });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Route to send registration OTP (after initial validation)
const sendRegistrationOtp = async (req, res) => {
    try {
        const { username, email, password, confirm_password } = req.body;

        // Initial validation
        if (!username || !email || !password || !confirm_password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Invalid email format" });
        }

        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
        }

        if (password !== confirm_password) {
            return res.status(400).json({ success: false, message: "Passwords do not match" });
        }

        // Check if user exists
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.status(409).json({ success: false, message: "Email already registered" });
        }

        // Generate and send OTP
        const otp = otpGenerator.generate(6, {
            digits: true,
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false
        });

       // Store with timestamp
        otpStorage.set(email, {
            otp,
            timestamp: Date.now()
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your Registration OTP',
            text: `Your OTP is: ${otp}`,
            html: `<h2>Your One-Time Password</h2>
    
    <p>Hello valued Euphoria customer,</p>
    
    <p>We received a request to register to your account. Please use the following OTP to complete your registration:</p>
    
    <div class="otp-container">
        <div class="otp-code">{${otp}}</div>
        
    </div>
    
    <p>If you didn't request this OTP, please ignore this email or contact our support team immediately.</p>`
        });

        res.status(200).json({ success: true, message: "OTP sent successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to send OTP" });
    }
};

// Admin login route
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET);
            res.status(200).json({ success: true, token });
        } else {
            res.status(401).json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        console.log("Admin login error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export { loginUser, registerUser, adminLogin, sendLoginOtp, sendRegistrationOtp };