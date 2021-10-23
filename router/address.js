import express from "express";
import {
  addAddress,
  deleteAddress,
  deleteAllAddress,
  getAddress,
} from "../controllers/address.js";
import { signinRequire } from "../middleware/auth.js";
import { createAddressValidate } from "../validate/address.js";
import runvalidate from "../validate/runvalidate.js";

const router = express.Router();

router.get("/", signinRequire, getAddress);

router.post(
  "/create",
  signinRequire,
  createAddressValidate,
  runvalidate,
  addAddress
);

router.delete("/delete/:id", signinRequire, deleteAllAddress);


router.delete("/:id", signinRequire, deleteAddress);

export default router;
