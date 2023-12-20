import { Router } from "express";
import {
  logoutUser,
  loginUser,
  registerUser,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Register user
router
  .route("/register")
  .post(upload.fields([{ name: "avatar", maxCount: 1 }]), registerUser);

// Login user
router.route("/login").post(loginUser);

//secure route
router.route("/logout").post(verifyJWT, logoutUser);
export default router;
