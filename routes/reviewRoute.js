import Router from "express";
import {
  addReview,
  deleteReview,
  getAllReviews,
  getReviewsByFood,
} from "../controller/reviewController.js";
import { authMiddleware } from "../middleware/auth.js";
const router = Router();

router.route("/review/all").get(getAllReviews);
router.route("/review/add").post(authMiddleware, addReview);
router.route("/review/delete/:id").delete(authMiddleware, deleteReview);
router.route("/reviews/:foodId").get(getReviewsByFood);

export default router;
