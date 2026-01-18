import { Router } from "express";
import multer from "multer";
import adminAuth from "../middleware/adminAuth.js";

import {
  addNewFood,
  getAllFood,
  getFoodById,
  removeFood,
  searchFood,
} from "../controller/foodcontroller.js";

const router = Router();

import { storage } from "../config/cloudinary.js";

const upload = multer({ storage: storage });

router.route("/food/new").post(adminAuth, upload.single("image"), addNewFood);
router.route("/food/list").get(getAllFood);
router.route("/food/remove").post(adminAuth, removeFood);
router.route("/food/search").get(searchFood);
router.route("/food/:food_id").get(getFoodById);

export default router;
