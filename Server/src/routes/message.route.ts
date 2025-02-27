import { Router } from "express";
import verifyJWT from "../middleware/auth.middleware";
import { getUsers, getMessages, sendMessageToUser } from "../handler/message.hander";

const route = Router();

route.get("/users", verifyJWT, getUsers);
route.get("/:id", verifyJWT, getMessages);
route.post("/send/:id", verifyJWT, sendMessageToUser);

export default route;
