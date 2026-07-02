import mongoose, { Schema, Document } from "mongoose";

export interface ICategory extends Document {
  title: string;
  slug: string;
  description?: string;
  range?: number;
  featured: boolean;
  image?: string;
}

const CategorySchema = new Schema<ICategory>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    range: {
      type: Number,
    },

    featured: {
      type: Boolean,
      default: false,
    },

    image: {
      type: String,
    },
  },

  {
    timestamps: true,
  },
);

const Category =
  mongoose.models.Category ||
  mongoose.model<ICategory>("Category", CategorySchema);

export default Category;
