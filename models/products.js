import mongoose from "mongoose";

const productSchema = mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  productImage: [{ img: { type: String } }],
  category: { type: Array, required: true },
  sizeProduct: [
    {
      quantity: { type: Number, required: true },
      size: { type: Number, required: true },
    },
  ],
  price: { type: Number, default: 0 },
  quantity: {
    type: Number,
  },
  sale: { type: Number },
  slug: { type: String },
  rating: { type: Number, default: 0, required: true },
  reviews: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, required: true },
      review: String,
    },
  ],
  createAt: { type: Date, default: new Date() },
});

export default mongoose.model("Products", productSchema);
