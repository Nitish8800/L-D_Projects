import config from "@config/env/config";
import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = mongoose.connect(config.MONGO_URI);

    console.log(` MongoDB Connected... Successfully `);
  } catch (err) {
    console.error(`Error: ${err}`);
    process.exit(); // process.exit() is used to terminate the process
  }
};
