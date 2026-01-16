import Route from "express";
import { authMiddleware } from "../middleware/auth.js";
import {
  placeOrder,
  UserOrders,
  verifyOrder,
  OrdersForAdmin,
  updateOrderStatus,
} from "../controller/orderController.js";

const router = Route();

router.route("/order/place").post(authMiddleware, placeOrder);
router.route("/order/verify").post(verifyOrder);
router.route("/userorders").get(authMiddleware, UserOrders);
router.route("/listorders").get(OrdersForAdmin);
router.route("/order/updatestatus").post(updateOrderStatus);

export default router;
