import express from "express"
import { createUser, loginUser, getAllCustomers } from "../controllers/userController.js";
import { verifyToken, requireAuth } from "../middleware/auth.js";

const userRouter = express.Router()

userRouter.post("/register", createUser);
userRouter.post("/login", loginUser);
userRouter.get("/all-customers", verifyToken, requireAuth, getAllCustomers);





export default userRouter