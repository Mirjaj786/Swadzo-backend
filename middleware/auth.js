import jwt from "jsonwebtoken";

export const authMiddleware = async (req, res, next) => {
  const token = req.headers.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized! Please login.",
    });
  }

  try {
    const token_decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = token_decoded.user_id;
    next();
  } catch (err) {
    console.log("Auth error:", err.message);
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};
