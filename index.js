import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import { configDB } from "./config/Db.js";
import foodRoute from "./routes/foodRoute.js";
import UserRoute from "./routes/userRoute.js";
import CartRoute from "./routes/cartRoute.js";
import OrderRoute from "./routes/orderRoute.js";
import reviewRoute from "./routes/reviewRoute.js";
import dashboardRoute from "./routes/dashboardRoute.js";

const app = express();
const PORT = 4000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DB Config
configDB();

app.use(foodRoute);
app.use("/images", express.static("uploads"));

app.use(UserRoute);

app.use(CartRoute);
app.use("/images", express.static("uploads"));

app.use(OrderRoute);
app.use(dashboardRoute);
app.use(reviewRoute);

app.listen(PORT, () => {
  console.log(`server was running on http://localhost:${PORT}`);
});
