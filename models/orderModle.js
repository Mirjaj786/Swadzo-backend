import mongoose from "mongoose";
const OrderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  items: {
    type: Array,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  address: {
    type: Object,
    required: true,
  },
  status: {
    type: String,
    default: "Food Processing",
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  payment: {
    type: Boolean,
    default: false,
  },
});

const OrderModle = mongoose.model("order", OrderSchema);

export default OrderModle;










// import mongoose from "mongoose";

// const OrderSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "user",
//     required: true,
//   },

//   items: [
//     {
//       itemId: { type: mongoose.Schema.Types.ObjectId, ref: "food" },
//       quantity: { type: Number, required: true },
//     },
//   ],

//   amount: {
//     type: Number,
//     required: true,
//   },

//   address: {
//     name: String,
//     phone: String,
//     street: String,
//     city: String,
//     pincode: String,
//   },

//   status: {
//     type: String,
//     enum: ["Food Processing", "Out for Delivery", "Delivered", "Cancelled"],
//     default: "Food Processing",
//   },

//   payment: {
//     type: Boolean,
//     default: false,
//   },

//   paymentMethod: {
//     type: String,
//     default: "COD",
//   },

//   date: {
//     type: Date,
//     default: Date.now,
//   },
// });

// const OrderModel = mongoose.model("order", OrderSchema);
// export default OrderModel;

