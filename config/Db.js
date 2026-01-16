import mongoose from "mongoose";

export const configDB = async () => {
  try {
    let connection = await mongoose.connect(process.env.MONGO_URL);
    console.log("database connection succesfully");
  } catch (err) {
    console.log(`error when connection with database ${err.message}`);
  }
};
