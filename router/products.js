import express from "express";

import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProducstBySlug,
  getProductBySlug,
  getInitialData,
} from "../controllers/products.js";

const router = express.Router();

router.get("/", getProducts);

router.get("/initial-data", getInitialData);

router.post("/create", createProduct);

router.get("/detail/:productSlug", getProductBySlug);

router.get("/:categorySlug", getProducstBySlug);

router.patch("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
