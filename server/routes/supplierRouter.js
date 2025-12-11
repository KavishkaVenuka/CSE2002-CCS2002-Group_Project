import express from "express"
import { createSupplier, loginSupplier } from "../controllers/supplierController.js"


const supplierRouter = express.Router()

supplierRouter.post("/register", createSupplier)
supplierRouter.post("/login", loginSupplier)


export default supplierRouter