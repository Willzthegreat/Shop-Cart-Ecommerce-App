import mongoose from "mongoose";
import slugify from "slugify";

const BrandSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    logo: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
  },
  {
    timestamps: true,
  }
);

BrandSchema.pre("save", function (next) {
  if (!this.slug) {
    this.slug = slugify(this.title, {
      lower: true,
      strict: true,
    });
  }
  next();
});

export default mongoose.models.Brand ||
  mongoose.model("Brand", BrandSchema);