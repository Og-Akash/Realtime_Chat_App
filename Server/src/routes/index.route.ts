import express from "express";
import authRouter from "./auth.route";
import userRoute from "./user.route";
import sessionRoute from "./session.route";
import { uploadImageToCloudinary } from "../utils/uploadImageToCloudinary";
import verifyJWT from "../middleware/auth.middleware";

const route = express.Router();

route.use("/auth/v1", authRouter);
route.use("/user/v1", userRoute);
route.use("/session/v1", verifyJWT, sessionRoute);
route.post("/upload/media", uploadImageToCloudinary);

export default route;
