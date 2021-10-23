import express from "express";
import {
  getAllCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category.js";

import {
  adminRequire,
  signinRequire,
  userProfile,
} from "../middleware/auth.js";
const router = express.Router();

router.get("/", getAllCategories);

router.post("/create", signinRequire, userProfile, adminRequire, addCategory);

router.patch("/:id", signinRequire, userProfile, adminRequire, updateCategory);

router.delete("/:id", signinRequire, userProfile, adminRequire, deleteCategory);



export default router;
