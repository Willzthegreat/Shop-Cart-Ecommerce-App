import mongoose, { Schema, Document } from "mongoose";
import slugify from "slugify";

export interface IBlog extends Document {
  title: string;
  slug: string;
  mainImage?: string;
  blogCategories: mongoose.Types.ObjectId[];
  author: mongoose.Types.ObjectId;
  body: string;
  publishedAt?: Date;
  isLatest: boolean;
}

const BlogSchema = new Schema<IBlog>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      unique: true,
      trim: true,
    },

    mainImage: {
      type: String,
      default: "",
    },

    blogCategories: [
      {
        type: Schema.Types.ObjectId,
        ref: "BlogCategory",
      },
    ],

    author: {
      type: Schema.Types.ObjectId,
      ref: "Author",
      required: true,
    },

    body: {
      type: String,
      required: true,
    },

    publishedAt: {
      type: Date,
      default: Date.now,
    },

    isLatest: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

BlogSchema.pre("save", function () {
  const blog = this as IBlog;

  if (blog.isModified("title")) {
    blog.slug = slugify(blog.title, {
      lower: true,
      strict: true,
    });
  }
});

const Blog =
  mongoose.models.Blog ||
  mongoose.model<IBlog>("Blog", BlogSchema);

export default Blog;