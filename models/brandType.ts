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