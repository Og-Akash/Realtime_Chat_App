import express from "express";
import authRouter from "./auth.route";
import userRoute from "./user.route";
import messageRoute from "./message.route";
import sessionRoute from "./session.route";
import { uploadImageToCloudinary } from "../utils/uploadImageToCloudinary";
import verifyJWT from "../middleware/auth.middleware";
import { upload } from "../services/multar";


const route = express.Router();

route.use("/auth/v1", authRouter);
route.use("/user/v1", userRoute);
route.use("/messages", messageRoute);
route.use("/session/v1", verifyJWT, sessionRoute);
route.post("/upload/media", upload.single("image") ,uploadImageToCloudinary);


export default route;
