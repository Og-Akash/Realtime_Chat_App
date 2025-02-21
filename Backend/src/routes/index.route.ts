import express from 'express'
import usersRoute from "./users.route";
import messageRoute from "./message.route";

const router = express.Router()

router.use("/auth/v1", usersRoute)
router.use("/message", messageRoute)

export default router