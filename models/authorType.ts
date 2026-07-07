import mongoose, { Schema, Document } from "mongoose";
import slugify from "slugify";

export interface IAuthor extends Document {
  name: string;
  slug: string;
  image?: string;
  bio?: string;
}

const AuthorSchema = new Schema<IAuthor>(
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

    image: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

AuthorSchema.pre("save", function () {
  const author = this as IAuthor;

  if (!author.slug) {
    author.slug = slugify(author.name, {
      lower: true,
      strict: true,
    });
  }
});

const Author =
  mongoose.models.Author ||
  mongoose.model<IAuthor>("Author", AuthorSchema);

export default Author; 