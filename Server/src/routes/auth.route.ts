import express from "express"
import {authAuth,getAllUser,login,logout,register,refreshAccessToken} from "../handler/auth.handler"

const route = express.Router()

route.get("/getAllUsers",getAllUser)
route.post("/register",register)
route.post("/login",login)
route.get("/logout",logout)
route.get("/refresh",refreshAccessToken)
route.get("/getAuthUser",authAuth)

export default route