import express from "express";
import {
  getAllUsers,
  loginUser,
  registerUser,
  logoutUser,
  getAuthUser,
  updateProfile,
} from "../handlers/auth.handler";
import { verifyJWT } from "../middleware/auth.middleware";
import upload from "../utils/multar.config";

const router = express.Router();

router.get("/users", verifyJWT, getAllUsers);
router.post("/register", upload.single("image"), registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.get("/authuser", verifyJWT, getAuthUser);
router.put("/updateProfile", verifyJWT, upload.single("image"), updateProfile);

export default router;
