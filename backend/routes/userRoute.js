import express from "express"
import { loginUser, registerUser, listUsers } from "../controllers/userController.js"
import authMiddleware, { adminMiddleware } from "../middleware/auth.js"

const userRouter = express.Router()

userRouter.post("/register", registerUser)
userRouter.post("/login", loginUser)
userRouter.get("/list", authMiddleware, adminMiddleware, listUsers)

export default userRouter