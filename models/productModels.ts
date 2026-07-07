// import mongoose, { Schema, model, models } from "mongoose";


// export interface DatabaseProducts {
//   product_id: mongoose.Types.ObjectId;
//   name: string;
//   description: string;
//   price: number;
//   slug: string;
//   category: string;
//   image: string[];
// }


// const ProductSchema = new Schema<DatabaseProducts>(
//   {
//     product_id: {
//       type: mongoose.Schema.Types.ObjectId,
//       required: true,
//       default: () => new mongoose.Types.ObjectId(),
//     },

//     name: {
//       type: String,
//       required: true,
//     },

//     description: {
//       type: String,
//       required: true,
//     },

//     price: {
//       type: Number,
//       required: true,
//     },

//     slug: {
//       type: String,
//       required: true,
//       unique: true,
//     },

//     category: {
//       type: String,
//       required: true,
//     },

//     image: {
//       type: [String],
//       required: true,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );


// const ProductModels =
//   models.Product || model<DatabaseProducts>("Product", ProductSchema);


// export default ProductModels;