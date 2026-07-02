// import mongoose from "mongoose";

// const MONGO_URI = process.env.MONGO_URI;

// if (!MONGO_URI) {
//   throw new Error("Please add MONGO_URI inside .env.local");
// }

// export async function connectDB() {
//   try {
//     if (mongoose.connection.readyState >= 1) {
//       return;
//     }

//     await mongoose.connect(MONGO_URI);

//     console.log("MongoDB Connected");
//   } catch (error) {
//     console.log(error);
//   }
// }






import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("Missing MONGO_URI");
}

export async function connectDB() {
  try {
    if (mongoose.connection.readyState >= 1) {
      return;
    }

    await mongoose.connect(MONGO_URI);

    console.log("MongoDB Connected");
  } catch (error) {
    console.log(error);

    throw error;
  }
}
