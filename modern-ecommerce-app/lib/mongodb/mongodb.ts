// import mongoose from "mongoose";

// const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URL;

// if (!MONGO_URI) {
//   throw new Error("Please define the MONGO_URI or MONGODB_URL environment variable.");
// }

// const mongoUri = MONGO_URI;
// const globalForMongoose = globalThis as typeof globalThis & {
//   mongooseConnection?: Promise<typeof mongoose> | null;
// };

// const DatabaseConnection = async (p0: { query: any; }): Promise<void> => {
//   if (mongoose.connection.readyState >= 1) {
//     return;
//   }

//   try {
//     if (!globalForMongoose.mongooseConnection) {
//       globalForMongoose.mongooseConnection = mongoose.connect(mongoUri, {
//         serverSelectionTimeoutMS: 10000,
//         connectTimeoutMS: 10000,
//       });
//     }

//     await globalForMongoose.mongooseConnection;

//     if (process.env.NODE_ENV === "development") {
//       const safeUri = new URL(mongoUri);
//       console.log(
//         `MongoDB connected: host=${safeUri.hostname} db=${safeUri.pathname.replace("/", "") || "(default)"}`
//       );
//     }
//   } catch (error) {
//     const message = error instanceof Error ? error.message : String(error);
//     console.error("MongoDB connection failed:", message);
//     globalForMongoose.mongooseConnection = null;
//     throw error;
//   }
// };

// export default DatabaseConnection;













import mongoose from "mongoose";

const MONGODB_URI =
  process.env.MONGO_URI ||
  process.env.MONGODB_URI ||
  process.env.MONGODB_URL;

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache:
    | {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
      }
    | undefined;
}

const cached = global.mongooseCache || {
  conn: null,
  promise: null,
};

global.mongooseCache = cached;

const DatabaseConnection = async () => {
  if (!MONGODB_URI) {
    throw new Error(
      "MongoDB is not configured. Define MONGO_URI, MONGODB_URI, or MONGODB_URL."
    );
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        maxPoolSize: 10,
      })
      .then((mongoose) => mongoose);
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    // Do not keep a rejected connection promise. The next request should be
    // able to retry after a temporary MongoDB/network failure.
    cached.promise = null;
    cached.conn = null;
    throw error;
  }

  return cached.conn;
};

export default DatabaseConnection;
