import mongoose from "mongoose";

const addressSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    min: 3,
    max: 50,
  },
  phone: {
    type: String,
    required: [true, "Phone is required"],
    trim: true,
  },
  city: {
    type: String,
    required: [true, "City is required"],
    trim: true,
  },
  town: {
    type: String,
    required: [true, "Town is required"],
    trim: true,
  },
  address: {
    type: String,
    required: [true, "Address is required"],
    trim: true,
  },
});

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // address: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "UserAddress.address",
    //   required: true,
    // },
    address: addressSchema,
    totalAmount: {
      type: Number,
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Products",
          required: true,
        },
        payablePrice: {
          type: Number,
          required: true,
        },
        purchaseQty: {
          type: Number,
          required: true,
        },
      },
    ],
    fee: {
      type: Number,
      required: [true, "Fee is required"],
    },
    paymentStatus: {
      type: String,
      enum: ["start", "pending", "complete", "cancel", "refund"],
      default: "start",
    },
    orderStatus: [
      {
        type: {
          type: String,
          enum: ["order", "shipping", "delivered"],
          default: "order",
        },
        date: Date,
        isCompleted: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  { timestamps: true }
);

mongoose.model("OrderAddress", addressSchema);

export default mongoose.model("Order", orderSchema);
