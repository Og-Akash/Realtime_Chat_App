import express from "express";
import { verifyJWT } from "../middleware/auth.middleware";
import {
  getMessageOfUser,
  sendMessageToUser,
} from "../handlers/message.hander";

const router = express.Router();

router.get("/getMessage/:id", verifyJWT, getMessageOfUser);
router.post("/send/:id", verifyJWT, sendMessageToUser);

export default router;
