import express from "express";
import {
  getAllUser,
  login,
  logout,
  register,
  refreshAccessToken,
  verifyEmail,
  forgetUserPassword,
  resetUserPassword
} from "../handler/auth.handler";

const route = express.Router();

route.get("/getAllUsers", getAllUser);
route.post("/register", register);
route.post("/login", login);
route.get("/logout", logout);
route.get("/refresh", refreshAccessToken);
route.get("/email/verify/:code", verifyEmail);
route.post("/password/forgot", forgetUserPassword);
route.post("/password/reset", resetUserPassword);

export default route;
