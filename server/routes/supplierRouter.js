import express from "express"
import { createSupplier } from "../controllers/supplierController.js"


const supplierRouter = express.Router()

supplierRouter.post("/register", createSupplier)


export default supplierRouter