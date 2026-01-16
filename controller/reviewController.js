import Review from "../models/reviewModle.js";

export const addReview = async (req, res) => {
  const userId = req.userId; // from auth middleware
  const { food, content, rating } = req.body;

  try {
    if (!food || !content || !rating) {
      return res.status(400).json({
        success: false,
        message: "Food, content and rating are required",
      });
    }

    const review = new Review({
      user: userId,
      food,
      content,
      rating,
    });

    await review.save();

    return res.status(201).json({
      success: true,
      message: "Review added successfully",
    });
  } catch (error) {
    // duplicate review error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "You already reviewed this food",
      });
    }

    console.error("Add review error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
export const getAllReviews = async (req, res) => {
  try {
    const response = await Review.find({}).populate("food", "name _id");
    if (!response) {
      res.status(404).json({ success: false, message: "Review not found!" });
      return;
    }

    return res.status(200).json({ success: true, data: response });
  } catch (error) {
    console.log(`Error while get all reviews : ${error.message}`);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getReviewsByFood = async (req, res) => {
  const { foodId } = req.params;

  try {
    if (!foodId) {
      return res.status(400).json({
        success: false,
        message: "Food ID is required",
      });
    }

    const reviews = await Review.find({ food: foodId })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    console.error("Get reviews error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch reviews",
    });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params; // review id
    const userId = req.userId;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Review id not provided",
      });
    }

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized, please login",
      });
    }

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    if (review.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: " You are not author of this review.",
      });
    }

    // 3️⃣ Delete review
    await Review.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.log("Error while deleting review:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
