// import mongoose from "mongoose";


// const DatabaseConnection = async () => {

//   try {
//     const MONGODB_URL = process.env.MONGODB_URL;
//     if (!MONGODB_URL) {
//       throw new Error("MONGODB_URL environment variable is not defined");
//     }
//     const connection = await mongoose.connect(MONGODB_URL);
//     console.log("MongoDB connected");
//     return connection;
//   } catch (err) {
//     const message =
//       err instanceof Error ? err.message : String(err);
//     throw new Error(`Database connection failed: ${message}`);
//   }
// };


// export default DatabaseConnection;


import mongoose from "mongoose";


const MONGODB_URL = process.env.MONGODB_URL;


if (!MONGODB_URL) {
  throw new Error("MONGODB_URL is missing");
}


let cached = (global as any).mongoose;


if (!cached) {
  cached = (global as any).mongoose = {
    conn: null,
    promise: null,
  };
}


const DatabaseConnection = async () => {

  if (cached.conn) {
    return cached.conn;
  }


  if (!cached.promise) {

    cached.promise = mongoose.connect(MONGODB_URL)
      .then((mongoose) => {

        console.log("MongoDB connected");

        return mongoose;

      });

  }


  cached.conn = await cached.promise;


  return cached.conn;

};


export default DatabaseConnection;