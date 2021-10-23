import mongoose from "mongoose";
import Products from "../models/products.js";

const cartSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cartItems: [
      {
        cartItemId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Products",
          required: true,
        },
        quantity: { type: Number, required: true },
        size: Number, // 37,38,39
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Cart", cartSchema);
