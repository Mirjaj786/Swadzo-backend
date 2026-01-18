import Food from "../models/foodModle.js";
import fs from "fs";
import { cloudinary } from "../config/cloudinary.js";

// Add new food
export const addNewFood = async (req, res) => {
  try {
    const { name, price, description, category, resturant } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image is required!" });
    }

    if (!name || !price || !description || !category || !resturant) {
      return res.status(400).json({ message: "Please provide all details!" });
    }

    const imageUrl = req.file.path.replace(/\s/g, "");

    const newFood = new Food({
      name,
      resturant,
      price: Number(price),
      description,
      category,
      image: imageUrl,
    });

    await newFood.save();

    return res.status(201).json({
      success: true,
      message: "Food added successfully!",
      food: newFood,
    });
  } catch (err) {
    console.error("Error adding food:", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
};

// desplay all food
export const getAllFood = async (req, res) => {
  try {
    const food_list = await Food.find({}).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: food_list });
  } catch (err) {
    console.error("Error fetching all food", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
};

// display single food

export const getFoodById = async (req, res) => {
  const { food_id } = req.params;

  try {
    if (!food_id) {
      return res
        .status(400)
        .json({ success: false, message: "Food ID is Missing" });
    }
    const food = await Food.findById(food_id);

    if (!food) {
      return res
        .status(404)
        .json({ success: false, message: "Food item not found" });
    }
    return res.status(200).json({ success: true, data: food });
  } catch (error) {
    console.error("Error fetching food by ID", error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// remove food
export const removeFood = async (req, res) => {
  const { id } = req.body;

  try {
    const food = await Food.findById(id);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food item not found",
      });
    }

    // Delete image from Cloudinary
    if (food.image.startsWith("http")) {
      try {
        const parts = food.image.split("/");
        const filenameWithExt = parts[parts.length - 1];
        const folder = parts[parts.length - 2];

        const publicId = `Food_Web/${filenameWithExt.split('.')[0]}`;

        await cloudinary.uploader.destroy(publicId);
      } catch (error) {
        console.log("Cloudinary delete error:", error.message);
      }
    } else {
      fs.unlink(`uploads/${food.image}`, (err) => {
        if (err) {
          console.log("Image delete error:", err.message);
        }
      });
    }

    await Food.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Food deleted successfully!",
    });
  } catch (err) {
    console.log("Error while deleting food:", err.message);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const searchFood = async (req, res) => {
  try {
    const { input } = req.query;

    if (!input || !input.trim()) {
      return res.status(400).json({
        success: false,
        message: "Search input required",
      });
    }

    const searchRegex = new RegExp(input.trim(), "i");

    const foods = await Food.find({
      $or: [
        { name: { $regex: searchRegex } },
        { category: { $regex: searchRegex } },
        { resturant: { $regex: searchRegex } },
      ],
    });

    if (foods.length === 0) {
      return res.json({
        success: false,
        message: "No food found",
        data: [],
      });
    }

    res.json({
      success: true,
      count: foods.length,
      data: foods,
    });
  } catch (error) {
    console.log("Search error:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};