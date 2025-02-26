import { Router } from "express";
import { userAuth } from "../handler/user.handler";
import verifyJWT from "../middleware/auth.middleware";

const route = Router();

route.get("/getAuthUser", verifyJWT, userAuth);

export default route;
