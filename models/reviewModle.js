import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    food: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Food",
      required: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
  },
  { timestamps: true }
);

//One user can review one food only once
reviewSchema.index({ user: 1, food: 1 }, { unique: true });

const Review = mongoose.model("Review", reviewSchema);
export default Review;
