import { Router } from "express";
const router = Router();
import { authMiddleware } from "../middleware/auth.js";

import {
  authMe,
  loginUser,
  registerUser,
} from "../controller/userCon.js";
import { forgotPassword, resetPassword } from "../controller/passwordController.js";

router.route("/user/register").post(registerUser);
router.route("/user/login").post(loginUser);
router.route("/auth/me").get(authMiddleware, authMe);
router.route("/user/forgot-password").post(forgotPassword);
router.route("/user/reset-password/:token").post(resetPassword);

export default router;
