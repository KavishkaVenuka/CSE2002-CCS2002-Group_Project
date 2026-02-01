import express from "express"
import { createAdmin, loginAdmin, addStock, updateStock, deleteStock, getAllStock } from "../controllers/adminController.js"


const adminRouter = express.Router()

adminRouter.post("/register", createAdmin)
adminRouter.post("/login", loginAdmin)
adminRouter.post("/add-stock", addStock)
adminRouter.put("/update-stock/:id", updateStock)
adminRouter.delete("/delete-stock/:id", deleteStock)
adminRouter.get("/get-stock", getAllStock)




export default adminRouter