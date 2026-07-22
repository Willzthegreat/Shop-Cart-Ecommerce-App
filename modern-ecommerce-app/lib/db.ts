import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URL;

if (!MONGO_URI) {
  throw new Error("Missing MONGO_URI or MONGODB_URL");
}

const mongoUri = MONGO_URI;

export async function connectDB() {
  try {
    if (mongoose.connection.readyState >= 1) {
      return;
    }

    await mongoose.connect(mongoUri);

    console.log("MongoDB Connected");
  } catch (error) {
    console.log(error);

    throw error;
  }
}
