import express from "express";
import {
  addOrder,
  getOrder,
  getOrders,
  updateOrder,
  deleteOrder,
} from "../controllers/order.js";
import { signinRequire } from "../middleware/auth.js";
import { createAddressValidate } from "../validate/address.js";
import runvalidate from "../validate/runvalidate.js";

const router = express.Router();

router.get("/", signinRequire, getOrders);

router.post(
  "/create",
  signinRequire,
  createAddressValidate,
  runvalidate,
  addOrder
);

router.get("/:id", signinRequire, getOrder);

router.post("/:id", signinRequire, updateOrder);

router.delete("/:id", signinRequire, deleteOrder);

export default router;
