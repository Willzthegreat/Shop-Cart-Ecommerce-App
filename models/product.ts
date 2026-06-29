import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    description: String,

    price: Number,

    slug: {
      type: String,
      unique: true,
    },

    category: String,

    image: [String],
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
