import express from "express";
import { getDashboardStats } from "../controller/dashboardController.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

router.get("/admin/dashboard", adminAuth, getDashboardStats);

export default router;
