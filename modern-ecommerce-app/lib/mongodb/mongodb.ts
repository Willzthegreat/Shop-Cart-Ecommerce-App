import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URL;

if (!MONGO_URI) {
  throw new Error("Please define the MONGO_URI or MONGODB_URL environment variable.");
}

const mongoUri = MONGO_URI;
const globalForMongoose = globalThis as typeof globalThis & {
  mongooseConnection?: Promise<typeof mongoose> | null;
};

const DatabaseConnection = async (): Promise<void> => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    if (!globalForMongoose.mongooseConnection) {
      globalForMongoose.mongooseConnection = mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 10000,
      });
    }

    await globalForMongoose.mongooseConnection;

    if (process.env.NODE_ENV === "development") {
      const safeUri = new URL(mongoUri);
      console.log(
        `MongoDB connected: host=${safeUri.hostname} db=${safeUri.pathname.replace("/", "") || "(default)"}`
      );
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("MongoDB connection failed:", message);
    globalForMongoose.mongooseConnection = null;
    throw error;
  }
};

export default DatabaseConnection;
