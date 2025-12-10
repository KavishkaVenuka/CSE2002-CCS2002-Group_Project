import express from "express"
import { createUser, loginUser } from "../controllers/userController.js"
import { getCurrentUser } from "../controllers/userController.js"
import { verifyToken, requireAuth } from "../middleware/auth.js"

const userRouter = express.Router()

userRouter.post("/",createUser)
userRouter.post("/login",loginUser)

// GET current authenticated user
userRouter.get("/", verifyToken, (req, res) => {
	// If a valid token is present, `req.user` will be set by verifyToken.
	if (!req.user) return res.status(401).json({ message: "Authentication required" });
	return res.json(req.user);
})


export default userRouter