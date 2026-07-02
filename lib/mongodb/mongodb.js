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


const MONGO_URI = process.env.MONGO_URI as string;


const DatabaseConnection = async () => {

  if (mongoose.connection.readyState >= 1) {
    return;
  }
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};


export default DatabaseConnection;