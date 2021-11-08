import express from "express";
import {
  addOrder,
  getOrder,
  getOrders,
  updateOrder,
  deleteOrder,
  checkOrder,
  getListOrder,
} from "../controllers/order.js";
import { signinRequire } from "../middleware/auth.js";
import { createAddressValidate } from "../validate/address.js";
import runvalidate from "../validate/runvalidate.js";

const router = express.Router();

router.get("/", signinRequire, getOrders);
router.post(
  "/check",
  signinRequire,
  createAddressValidate,
  runvalidate,
  checkOrder
);

router.post(
  "/create",
  signinRequire,
  createAddressValidate,
  runvalidate,
  addOrder
);

router.get("/:id", signinRequire, getOrder);
router.get("/get-order", signinRequire, getListOrder);

router.post("/:id", signinRequire, updateOrder);

router.delete("/:id", signinRequire, deleteOrder);

export default router;
