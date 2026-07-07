// import { defineType, defineField } from 'sanity';

// export const brandType = defineType({
//     name: "brand",
//     title: "Brand",
//     type: "document",
//     fields: [   
//       defineField({
//         name: "title",
//         type: "string"
//       }),
//       defineField({
//         name: "slug",
//         type: "string",
//         options: {
//           source: "title",
//           maxLength: 96,
//         },
//       }),
//       defineField({
//         name: "description",
//         type: "text"
//       }),
//       defineField({
//         name: "image",
//         title: "Brand image",
//         type: "image",
//         options: {
//           hotspot: true,
//         },
//       }),
//     ],
//     preview: {
//       select: {
//         title: "title",
//         subtitle: "description",
//         media: "image",
//       },
//     }
//   })











// import mongoose, { Schema, Document } from "mongoose";
// import slugify from "slugify";

// export interface IBrand extends Document {
//   title: string;
//   slug: string;
//   description?: string;
//   image?: string;
// }

// const BrandSchema = new Schema<IBrand>(
//   {
//     title: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     slug: {
//       type: String,
//       unique: true,
//       trim: true,
//     },

//     description: {
//       type: String,
//       default: "",
//     },

//     image: {
//       type: String,
//       default: "",
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// BrandSchema.pre("save", function () {
//   const brand = this as IBrand;

//   if (brand.isModified("title")) {
//     brand.slug = slugify(brand.title, {
//       lower: true,
//       strict: true,
//     });
//   }
// });

// const Brand =
//   mongoose.models.Brand ||
//   mongoose.model<IBrand>("Brand", BrandSchema);

// export default Brand;











import mongoose, { Document, Schema } from "mongoose";
import slugify from "slugify";

export interface IBrand extends Document {
  title: string;
  slug: string;
}

const BrandSchema = new Schema<IBrand>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    slug: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
  },
  {
    timestamps: true,
  }
);

BrandSchema.pre("save", function () {
  if (this.isModified("title")) {
    this.slug = slugify(this.title, {
      lower: true,
      strict: true,
    });
  }
});

export default mongoose.models.Brand ||
  mongoose.model<IBrand>("Brand", BrandSchema);