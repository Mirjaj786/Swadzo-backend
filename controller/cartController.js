import User from "../models/UserModle.js";

export const addToCart = async (req, res) => {
  try {
    const user_id = req.userId;
    const item_id = req.body.itemId;

    let userData = await User.findById(user_id);
    let cartData = await userData.cartData;

    if (!cartData[item_id]) {
      cartData[item_id] = 1; // new entry
    } else {
      cartData[item_id] += 1;
    }

    await User.findByIdAndUpdate(user_id, { cartData });

    return res.status(201).json({ success: true, message: "Added to cart." });
  } catch (err) {
    console.log(`Error while add to cart : ${err.message}`);
    return res
      .status(400)
      .json({ success: false, message: "Faild to add cart!" });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const user_id = req.userId;
    const item_id = req.body.itemId;

    const userData = await User.findById(user_id);
    if (!userData) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    let cartData = userData.cartData || {};

    if (!cartData[item_id]) {
      return res.status(400).json({
        success: false,
        message: "Item not in cart",
      });
    }

    cartData[item_id] -= 1;

    if (cartData[item_id] === 0) {
      delete cartData[item_id];
    }

    await User.findByIdAndUpdate(user_id, { cartData });

    return res.status(200).json({
      success: true,
      message: "Food removed from cart!",
      cartData,
    });
  } catch (err) {
    console.log(`Error to remove cart data : ${err.message}`);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getCartData = async (req, res) => {
  try {
    const user_id = req.userId;

    let userData = await User.findById(user_id);
    let cartData = userData.cartData;

    return res.status(201).json({ success: true, cartData });
  } catch (err) {
    console.log(`Error to get Cart Data : ${err.message}`);
    return res.status(400).json({ success: false, message: err.message });
  }
};
