import mongoose, { Schema, model, models } from "mongoose";


const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["buyer", "seller", "admin"],
      default: "buyer",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);


const User = models.User || model("User", userSchema);


export default User;
