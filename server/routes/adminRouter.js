import express from "express"
import { addStock, updateStock, deleteStock, getAllStock } from "../controllers/adminController.js"
import { verifyToken, requireAdmin } from "../middleware/auth.js"

const adminRouter = express.Router()

// All routes protected — Admin only
adminRouter.post("/add-stock", verifyToken, requireAdmin, addStock)
adminRouter.put("/update-stock/:id", verifyToken, requireAdmin, updateStock)
adminRouter.delete("/delete-stock/:id", verifyToken, requireAdmin, deleteStock)
adminRouter.get("/get-stock", verifyToken, requireAdmin, getAllStock)

export default adminRouter
