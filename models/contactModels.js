import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Types.ObjectId,
      requird: true,
      ref: "User",
    },
    name: {
      type: String,
      required: [true, "Please add the contact name"],
    },
    email: {
      type: String,
      required: [true, "Please add the contact email address"],
    },
    phone: {
      type: String,
      required: [true, "Please add the contact phone number"],
    },
  },
  {
    timestamps: true,
  }
);

const Contact = mongoose.model("Contact", contactSchema);

export default Contact;