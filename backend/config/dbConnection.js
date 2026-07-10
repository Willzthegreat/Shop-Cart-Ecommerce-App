import mongoose from "mongoose";

const connectDB = async () => {
    const mongoUri = process.env.CONNECTION_STRING || process.env.MONGODB_URL || process.env.MONGO_URI;

    if (!mongoUri) {
        console.error("MongoDB connection string is not defined. Set CONNECTION_STRING, MONGODB_URL, or MONGO_URI in your environment.");
        return;
    }

    try {
        const connect = await mongoose.connect(mongoUri);
        console.log(
            "Database connected: ",
            connect.connection.host,
            connect.connection.name
        );
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
};

export default connectDB;