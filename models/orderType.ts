// import { BasketIcon } from "@sanity/icons";
// import { defineType, defineField } from "sanity";

// export const Basket = defineType({
//     name: "order",
//     title: "Order",
//     type: "document",
//     icon: BasketIcon,
//     fields: [
//         defineField({
//             name: "orderNumber",
//             title: "Order Number",
//             type: "string",
//             validation: (Rule) => Rule.required(),
//         }),
//         {
//           name: "invoice",
//           type: "object",
//           fields: [
//             {name: "id", type: "string"},
//             {name: "number", type: "string"},
//             {name: "hosted_invoice_url", type: "url"},
//           ],
//         },
//         defineField({
//           name: "stripeCheckoutSessionId",
//           title: "Stripe Checkout Session ID",
//           type: "string", 
//         }),
//         defineField({
//           name: "stripeCustomerId",
//           title: "Stripe Customer ID",
//           type: "string",
//           validation: (Rule) => Rule.required(),
//         }),
//         defineField({
//           name: "clerkUserId",
//           title: "Clerk User ID",
//           type: "string",
//           validation: (Rule) => Rule.required(),
//         }),
//         defineField({
//           name: "customerName",
//           title: "Customer Name",
//           type: "string",
//           validation: (Rule) => Rule.required(),
//         }),
//         defineField({
//           name: "email",
//           title: "Customer Email",
//           type: "string",
//           validation: (Rule) => Rule.required(),
//         }),
//         defineField({
//           name: "stripePaymentIntentId",
//           title: "Stripe Payment Intent ID",
//           type: "string",
//           validation: (Rule) => Rule.required(),
//         }),
//         defineField({
//           name: "products",
//           title: "Products",
//           type: "array",
//           of: [
//             defineArrayMember({
//               type: "object",
//               fields: [
//                 { name: "product", 
//                   title: "Product Bought",
//                   type: "reference",
//                   to: [{ type: "product" }], 
//                 },
//                 defineField({
//                   name: "quantity",
//                   title: "Quantity Purchased",
//                   type: "number",
//                 }),
//               ],
//               preview: {
//                 select: {
//                   product: "product.name",
//                   quantity: "quantity",
//                   image: "product.image",
//                   price: "product.price",
//                   currency: "product.currency",
//                 },
//                 prepare(select) {
//                   // const { product, quantity, image, price, currency } = selection;
//                   return {
//                     title: `${select.product} x ${select.quantity}`,
//                     media: select.image,
//                     subtitle: `${select.price} ${select.quantity}`,
//                   };
//                 },
//               },
//             }),
//           ],
//         }),
//       defineField({
//         name: "totalPrice",
//         title: "Total Price",
//         type: "number",
//         validation: (Rule) => Rule.required().min(0),
//       }),
//       defineField({
//         name: "currency",
//         title: "Currency",
//         type: "string",
//         validation: (Rule) => Rule.required(),
//       }),
//       defineField({
//         name: "amountDiscount",
//         title: "Amount Discount",
//         type: "number",
//         validation: (Rule) => Rule.required(),
//       }),
//       defineField({
//         name: "address",
//         title: "Shipping Address",
//         type: "object",
//         fields: [
//           { name: "name", title: "Name", type: "string" },
//           { name: "address", title: "Address", type: "string" },
//           { name: "city", title: "City", type: "string" },
//           { name: "state", title: "State", type: "string" },
//           { name: "zipCode", title: "Zip Code", type: "string" },
//         ],
//       }),
//       defineField({
//         name: "status",
//         title: "Order Status",
//         type: "string",
//         options: {
//           list: [
//             { title: "Pending", value: "pending" },
//             { title: "Processing", value: "processing" },
//             { title: "Paid", value: "paid" },
//             { title: "Shipped", value: "shipped" },
//             { title: "Out for Delivery", value: "out_for_delivery" },
//             { title: "Delivered", value: "delivered" },
//             { title: "Cancelled", value: "cancelled" },
//           ],
//         },
//       }),
//       defineField({
//         name: "orderDate",
//         title: "Order Date",
//         type: "datetime",
//         validation: (Rule) => Rule.required(),
//       }),
//     ],
//     preview: {
//       select: {
//         name: "customerName",
//         amount: "totalPrice",
//         currency: "currency",
//         orderId: "orderNumber",
//         email: "email",
//       },
//       prepare(select) {
//         const orderIdSnippet = `${select.orderId.slice(0, 5)}...${select.orderId.slice(-4)}`;
//         return {
//           title: `${select.name} - ${select.amount} ${select.currency}`,
//           subtitle: `Order ID: ${orderIdSnippet} | Email: ${select.email}`,
//         };
//       }
//     },
//   });
// // });








import mongoose, { Schema, Document } from "mongoose";

export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  quantity: number;
}

export interface IInvoice {
  id?: string;
  number?: string;
  hosted_invoice_url?: string;
}

export interface IShippingAddress {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface IOrder extends Document {
  orderNumber: string;

  invoice?: IInvoice;

  stripeCheckoutSessionId?: string;
  stripeCustomerId: string;
  stripePaymentIntentId: string;

  clerkUserId: string;

  customerName: string;
  email: string;

  products: IOrderItem[];

  totalPrice: number;
  currency: string;
  amountDiscount: number;

  address: IShippingAddress;

  status:
    | "pending"
    | "processing"
    | "paid"
    | "shipped"
    | "out_for_delivery"
    | "delivered"
    | "cancelled";

  orderDate: Date;
}

/* ===========================
   Invoice Schema
=========================== */

const InvoiceSchema = new Schema(
  {
    id: String,

    number: String,

    hosted_invoice_url: String,
  },
  {
    _id: false,
  }
);

/* ===========================
   Shipping Address Schema
=========================== */

const AddressSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    address: {
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
  },
  {
    _id: false,
  }
);

/* ===========================
   Order Item Schema
=========================== */

const OrderItemSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  {
    _id: false,
  }
);

/* ===========================
   Main Order Schema
=========================== */

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    invoice: {
      type: InvoiceSchema,
      default: {},
    },

    stripeCheckoutSessionId: {
      type: String,
      default: "",
    },

    stripeCustomerId: {
      type: String,
      required: true,
    },

    stripePaymentIntentId: {
      type: String,
      required: true,
    },

    clerkUserId: {
      type: String,
      required: true,
    },

    customerName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    products: {
      type: [OrderItemSchema],
      required: true,
    },

    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      required: true,
      default: "USD",
    },

    amountDiscount: {
      type: Number,
      default: 0,
      min: 0,
    },

    address: {
      type: AddressSchema,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "processing",
        "paid",
        "shipped",
        "out_for_delivery",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },

    orderDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Order =
  mongoose.models.Order ||
  mongoose.model<IOrder>("Order", OrderSchema);

export default Order;