import express from 'express'
import {getAllUsers} from "../handlers/getAllUsers.handler";

const router = express.Router()

router.get("/auth/users", getAllUsers)
router.get("/auth/v1/register", getAllUsers)
router.get("/auth/v1/login", getAllUsers)
router.get("/auth/v1/logout", getAllUsers)
router.get("/auth/v1/authuser", getAllUsers)

export default router