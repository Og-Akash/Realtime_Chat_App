import express from 'express'
import usersRoute from "./users.route";

const router = express.Router()

router.use("/user", usersRoute)

export default router