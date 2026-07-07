// import mongoose from "mongoose";

// const DatabaseConnection = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI);

//     console.log("MongoDB Connected");
//   } catch (error) {
//     console.log(error);
//   }
// };

// export default DatabaseConnection;


















import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URL;

if (!MONGO_URI) {
  throw new Error("Please define the MONGO_URI or MONGODB_URL environment variable.");
}

const mongoUri = MONGO_URI;

const DatabaseConnection = async (): Promise<void> => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};

export default DatabaseConnection;