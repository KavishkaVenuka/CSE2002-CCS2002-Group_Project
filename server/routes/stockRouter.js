import express from "express"
import { addProduct } from "../controllers/stockController.js"



const stockRouter = express.Router()

stockRouter.get("/addItem" , addProduct)




export default stockRouter