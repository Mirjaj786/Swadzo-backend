import Food from "../models/foodModle.js";
import fs from "fs";
import mongoose from "mongoose";

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

    const newFood = new Food({
      name,
      resturant,
      price: Number(price),
      description,
      category,
      image: req.file.filename,
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

    // Delete image from uploads folder
    fs.unlink(`uploads/${food.image}`, (err) => {
      if (err) {
        console.log("Image delete error:", err.message);
      }
    });

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

    const searchRegex = new RegExp(input.trim(), "i"); // case-insensitive

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

// export const editFood = async (req, res) => {
//   try {
//     const { id, name, price, description, category } = req.body;

//     const food = await Food.findById(id);
//     if (!food) {
//       return res.status(404).json({
//         success: false,
//         message: "Food not found",
//       });
//     }

//     // If new image uploaded → delete old image
//     if (req.file) {
//       fs.unlink(`uploads/${food.image}`, (err) => {
//         if (err) console.log("Old image delete error:", err.message);
//       });
//       food.image = req.file.filename;
//     }

//     food.name = name || food.name;
//     food.price = price || food.price;
//     food.description = description || food.description;
//     food.category = category || food.category;

//     await food.save();

//     return res.status(200).json({
//       success: true,
//       message: "Food updated successfully!",
//       food,
//     });
//   } catch (err) {
//     console.error("Edit food error:", err.message);
//     return res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };
