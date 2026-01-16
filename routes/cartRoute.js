import Route from "express";
import {
  addToCart,
  getCartData,
  removeFromCart,
} from "../controller/cartController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Route();

router.route("/cart/add").post(authMiddleware, addToCart);
router.route("/cart/remove").post(authMiddleware, removeFromCart);
router.route("/cart/get").get(authMiddleware, getCartData);

export default router;
