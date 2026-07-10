import mongoose, { Schema, Document } from "mongoose";
import slugify from "slugify";

export interface IProduct extends Document {
  name: string;
  slug: string;
  description?: string;
  images: string[];
  price: number;
  discount?: number;
  categories: mongoose.Types.ObjectId[];
  stock: number;
  brand: mongoose.Types.ObjectId;
  status: "new" | "hot" | "sale";
  variants: string[];
  isFeatured: boolean;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      unique: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    images: {
      type: [String],
      default: [],
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    discount: {
      type: Number,
      default: 0,
      min: 0,
    },

    categories: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category",
      },
    ],

    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    brand: {
      type: Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },

    status: {
      type: String,
      enum: ["new", "hot", "sale"],
      default: "new",
    },

    variants: {
      type: [String],
      enum: ["gadget", "appliances", "refrigerators", "others"],
      default: [],
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

ProductSchema.pre("save", function () {
  const product = this as IProduct;

  if (product.isModified("name")) {
    product.slug = slugify(product.name, {
      lower: true,
      strict: true,
    });
  }
});

const Product =
  mongoose.models.Product ||
  mongoose.model<IProduct>("Product", ProductSchema);

export default Product;