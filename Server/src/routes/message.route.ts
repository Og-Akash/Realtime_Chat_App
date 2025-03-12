import { Router } from "express";
import verifyJWT from "../middleware/auth.middleware";
import { getUsers, getMessages, sendMessageToUser } from "../handler/message.hander";
import { upload } from "../services/multar";

const route = Router();

route.get("/users", verifyJWT, getUsers);
route.get("/:id", verifyJWT, getMessages);
route.post("/send/:id", verifyJWT, upload.single("image") ,sendMessageToUser);

export default route;
