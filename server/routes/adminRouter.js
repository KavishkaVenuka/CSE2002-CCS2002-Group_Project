import express from "express"
import { createAdmin, loginAdmin } from "../controllers/adminController.js"


const adminRouter = express.Router()

adminRouter.post("/register", createAdmin)
adminRouter.post("/login", loginAdmin)




export default adminRouter