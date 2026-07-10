import mongoose, { Schema, Document } from "mongoose";

export interface IAddress extends Document {
  name: string;
  email: string;
  city: string;
  state: string;
  zipCode: string;
  default: boolean;
}

const AddressSchema = new Schema<IAddress>(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    city: {
      type: String,
      required: true,
    },

    state: {
      type: String,
      required: true,
    },

    zipCode: {
      type: String,
      required: true,
    },

    default: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Address ||
  mongoose.model<IAddress>("Address", AddressSchema);