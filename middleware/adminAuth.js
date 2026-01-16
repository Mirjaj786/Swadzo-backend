import jwt from "jsonwebtoken";
import User from "../models/UserModle.js";

const adminAuth = async (req, res, next) => {
    try {
        const { token } = req.headers;
        if (!token) {
            return res.json({ success: false, message: "Not Authorized Login Again" });
        }
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = token_decode.user_id;

        const user = await User.findById(req.userId);
        if (user.role !== "admin") {
            return res.json({ success: false, message: "Not Authorized Login Again" });
        }

        next();
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

export default adminAuth;
