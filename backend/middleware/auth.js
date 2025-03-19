import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];  

    if (!token) {
        return res.json({ success: false, message: "Not Authorized. Login Again" });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.body.userId = decodedToken.id;  
        next();
    } catch (error) {
        console.error("JWT Verification Error:", error);
        res.json({ success: false, message: "Invalid token, please log in again" });
    }
};

export default authUser;
