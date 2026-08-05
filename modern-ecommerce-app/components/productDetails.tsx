import { Schema, model, models } from "mongoose";

export interface IProduct {
  name: string;
  slug: string;
  description: string;
  images: string[];
  price: number;
  discount?: number;
  stock: number;
}

const productSchema = new Schema<IProduct>({
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  description: String,
  images: {
    type: [String],
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  discount: Number,
  stock: {
    type: Number,
    required: true,
  },
});

const Product =
  models.Product || model<IProduct>("Product", productSchema);

export default Product;