import express from "express";

import {
  addToCart,
  getCart,
  removeCart,
  removeProduct,
  updatePrdQuantity,
} from "../controllers/cart.js";
import { signinRequire, userProfile } from "../middleware/auth.js";
import { createCartValidate, updateCartValidate } from "../validate/cart.js";
import runvalidate from "../validate/runvalidate.js";

const router = express.Router();

router.get("/", signinRequire, getCart);

router.post(
  "/create",
  signinRequire,
  createCartValidate,
  runvalidate,
  addToCart
);

router.post(
  "/update/:slug",
  signinRequire,
  updateCartValidate,
  runvalidate,
  updatePrdQuantity
);

router.delete("/remove/:id", signinRequire, removeProduct);

router.delete("/:id", signinRequire, removeCart);

export default router;
