import { Router } from "express";
import multer from "multer";
import adminAuth from "../middleware/adminAuth.js";
// import Food from "../models/foodModle.js";

import {
  addNewFood,
  getAllFood,
  getFoodById,
  removeFood,
  searchFood,
} from "../controller/foodcontroller.js";

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, callBack) => {
    callBack(null, "uploads");
  },

  filename: (req, file, callBack) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    callBack(null, uniqueName);
  },
});

const upload = multer({ storage: storage });

router.route("/food/new").post(adminAuth, upload.single("image"), addNewFood);
// router.post("/food/edit", upload.single("image"), editFood);
router.route("/food/list").get(getAllFood);
router.route("/food/remove").post(adminAuth, removeFood);
router.route("/food/search").get(searchFood);
router.route("/food/:food_id").get(getFoodById);

export default router;
