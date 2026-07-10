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