import express from "express";
import authRouter from "./auth.route";

const route = express.Router();

route.use("/auth/v1", authRouter);

export default route;