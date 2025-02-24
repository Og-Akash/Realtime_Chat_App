import express from "express";
import authRouter from "./auth.route";
import { uploadImageToCloudinary } from "../utils/uploadImageToCloudinary";

const route = express.Router();

route.use("/auth/v1", authRouter);
route.post("/upload/media",uploadImageToCloudinary)

export default route;