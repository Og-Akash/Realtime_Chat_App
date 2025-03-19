import { Router } from "express";
import { userAuth } from "../handler/user.handler";
import { searchUserByQuery } from "../handler/user.handler";
import verifyJWT from "../middleware/auth.middleware";

const route = Router();

route.get("/getAuthUser", verifyJWT, userAuth);
route.get("/search/:query",verifyJWT,searchUserByQuery)

export default route;
