// import { TrolleyIcon } from "@sanity/icons";
// import { optimisticKey } from "react";
// import { defineType, defineField } from "sanity";

// export const productType = defineType({
//     name: "product",
//     title: "Product",
//     type: "document",
//     icon: TrolleyIcon,
//     fields: [
//         defineField({
//             name: "name",
//             title: "Product Name",
//             type: "string"
//             validation: (Rule) => Rule.required().error("Product name is required"),
//         }),
//         defineField({
//             name: "slug",
//             title: "Slug",
//             type: "slug",
//             options: {
//                 source: "name",
//                 maxLength: 96,
//             },
//             validation: (Rule) => Rule.required().error("Slug is required"),
//         }),
//         defineField({
//             name: "description",
//             title: "Description",
//             type: "text"
//         }),
//         defineField({
//             name: "image",
//             title: "Product image",
//             type: "array",
//             of: [{ type: "image", options: { hotspot: true } }],
           
//         }),
//         defineField({
//             name: "description",
//             title: "Description",
//             type: "string",
//         }),
//         defineField({
//             name: "price",
//             title: "Price",
//             type: "number",
//             validation: (Rule) => Rule.required().min(0).error("Price is required"),
//         }),
//         defineField({
//             name: "discount",
//             title: "Discount",
//             type: "number",
//             validation: (Rule) => Rule.required().min(0).error("Discount price must be a positive number"),
//         }),
//         defineField({
//             name: "categories",
//             title: "Categories",
//             type: "array",
//             of: [{ type: "reference", to: { type: "category" } }],
//         }),
//         defineField({
//             name: "stock",
//             title: "Stock",
//             type: "number",
//             validation: (Rule) => Rule.required().min(0).error("Stock must be a positive number"),
//         }),
//         defineField({
//             name: "brand",
//             title: "Brand",
//             type: "reference",
//             to: { type: "brand" },
//         }),
//         defineField({
//           name: "status",
//           title: "Product Status",
//           type: "string",
//           options: {
//             list: [
//               { title: "New", value: "new" },
//               { title: "Hot", value: "hot" },
//               { title: "Sale", value: "sale" }
//             ]
//           }
//         }),
//         defineField({
//           name: "variants",
//           title: "Product Variants",
//           type: "array",
//           options: {
//             list: [
//               { title: "Gadget", value: "gadget" },
//               { title: "Appliances", value: "appliances" },
//               { title: "Refrigerators", value: "refrigerators" },
//               { title: "Others", value: "others" }
//             ],
//           },
//         }),
//         defineField({
//           name: "isFeatured",
//           title: "Featured Product",
//           type: "boolean",
//           description: "Check this box if the product is featured",
//           initialValue: false,
//         }),
//     ],
//     preview: {
//         select: {
//             title: "name",
//             subtitle: "price",
//             media: "images",
//         },
//         prepare(selection) {
//             const { title, subtitle, media } = selection;
//             const image = media && media[0];
//             return {
//                 title: title,
//                 subtitle: `$${subtitle}`,
//                 media: image,
//             };
//         }
//     }
// })










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