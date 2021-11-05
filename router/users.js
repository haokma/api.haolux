import express from "express";

import { getUser, login, signout, signup } from "../controllers/users.js";
import {
  adminRequire,
  getNewToken,
  signinRequire,
  userProfile,
} from "../middleware/auth.js";

const router = express.Router();
router.get("/getUser", signinRequire, getUser);
router.post("/login", login);
router.post("/signup", signup);

router.get("/signout", signinRequire, signout);

router.post("/refresh-token", signinRequire, userProfile, getNewToken);

router.get("/test", signinRequire, userProfile, adminRequire, (req, res) => {
  res.json({
    status: "success",
    user: req.user,
  });
});

export default router;
