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


async function DatabaseConnection() {

  if (cached.conn) {
    return cached.conn;
  }


  if (!cached.promise) {

    cached.promise = mongoose.connect(MONGODB_URL)
      .then((mongooseInstance) => {

        console.log(
          "Mongo connected:",
          mongooseInstance.connection.readyState
        );

        return mongooseInstance;

      });

  }


  cached.conn = await cached.promise;

  return cached.conn;

}


export default DatabaseConnection;