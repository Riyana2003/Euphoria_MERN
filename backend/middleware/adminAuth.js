import jwt from 'jsonwebtoken';

const adminAuth = async (req, res, next) => {
    try {
        const{token} = req.headers
        if (!token) {
            return res.status(401).json({ success: false, message: "Not authorized. Please login again." });
        }
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        // Check if the decoded token contains admin credentials
        if (token_decode !== process.env.ADMIN_MOBILE + process.env.ADMIN_PASSWORD) {
            return res.status(403).json({ success: false, message: "Not authorized. Admin access required." });
        }
        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({ success: false, message: "Invalid token. Please login again." });
    }
};

export default adminAuth;