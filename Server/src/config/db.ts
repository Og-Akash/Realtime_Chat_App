import mongoose from "mongoose";
import { MONGO_URI } from "../constants/env";

export async function connectDb() {
  const conn = await mongoose.connect(MONGO_URI, {
    maxConnecting: 10,
  });

  try {
    if (conn) {
      console.log("Connected to MongoDB 🧃");
    } else {
      console.error("Failed to connect to MongoDB ❌",);
      process.exit(1);
    }
  } catch (error) {
    console.log(`Eror connecting to MongoDB`, error);
    
  }
}
