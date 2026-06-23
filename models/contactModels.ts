// import mongoose, { Schema, model, models, Document } from "mongoose";


// export interface IContact extends Document {
//   user_id: mongoose.Types.ObjectId;
//   name: string;
//   email: string;
//   phone: string;
// }


// const contactSchema = new Schema<IContact>(
//   {
//     user_id: {
//       type: mongoose.Schema.Types.ObjectId,
//       required: true,
//       ref: "User",
//     },

//     name: {
//       type: String,
//       required: [true, "Please add the contact name"],
//     },

//     email: {
//       type: String,
//       required: [true, "Please add the contact email address"],
//     },

//     phone: {
//       type: String,
//       required: [true, "Please add the contact phone number"],
//     },
//   },
//   {
//     timestamps: true,
//   }
// );


// const Contact =
//   models.Contact || model<IContact>("Contact", contactSchema);


// export default Contact;