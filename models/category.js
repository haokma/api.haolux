import mongoose from "mongoose";

const categorySchema = mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, "Name is required"],
    min: 3,
    max: 128,
  },
  slug: {
    type: String,
    unique: true,
    required: true,
  },
  parentId: String,
});

export default mongoose.model("Category", categorySchema);
