import express from "express";
import {
  login,
  logout,
  register,
  googleAuth,
  googleCallback,
  refreshAccessToken,
  verifyEmail,
  forgetUserPassword,
  resetUserPassword,
  changeUserPassword,
  updateUserDetails,
} from "../handler/auth.handler";
import { upload } from "../services/multar";
import verifyJWT from "../middleware/auth.middleware";

const route = express.Router();

route.post("/register", register);
route.get("/google", googleAuth);
route.get("/google/callback", googleCallback);
route.post("/login", login);
route.get("/logout", logout);
route.get("/refresh", refreshAccessToken);
route.get("/email/verify/:code", verifyEmail);
route.post("/password/forgot", forgetUserPassword);
route.post("/password/reset", resetUserPassword);
route.put("/password/change", verifyJWT,changeUserPassword);
route.put(
  "/update",
  verifyJWT,
  upload.single("profileImage"),
  updateUserDetails
);

export default route;
