import express from "express";
import {
  login,
  logout,
  register,
  refreshAccessToken,
  verifyEmail,
  forgetUserPassword,
  resetUserPassword,
  updateUserDetails,
} from "../handler/auth.handler";
import { upload } from "../services/multar";
import verifyJWT from "../middleware/auth.middleware";

const route = express.Router();

route.post("/register", register);
route.post("/login", login);
route.get("/logout", logout);
route.get("/refresh", refreshAccessToken);
route.get("/email/verify/:code", verifyEmail);
route.post("/password/forgot", forgetUserPassword);
route.post("/password/reset", resetUserPassword);
route.put(
  "/update",
  verifyJWT,
  upload.single("profileImage"),
  updateUserDetails
);

export default route;
