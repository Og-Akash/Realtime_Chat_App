import express from "express"
import {authAuth,getAllUser,login,logout,register} from "../handler/auth.handler"

const route = express.Router()

route.get("/getAllUsers",getAllUser)
route.post("/register",register)
route.post("/login",login)
route.get("/logout",logout)
route.get("/getAuthUser",authAuth)

export default route