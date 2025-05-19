import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {

    const token = req.headers.authorization?.split(" ")[1] || 
                 req.headers?.token || 
                 req.query.token || 
                 req.body.token;

    if (!token) {
        return res.status(401).json({ 
            success: false, 
            message: "Not Authorized. Login Again" 
        });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decodedToken;  // Attach full user data
        req.body.userId = decodedToken.id;
        next();
    } catch (error) {
        console.error("JWT Verification Error:", error);
        return res.status(401).json({ 
            success: false, 
            message: "Invalid token, please log in again" 
        });
    }
};

export default authUser;