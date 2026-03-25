import express from "express"
import { addProduct, getAllProducts, getProductById, updateProduct, deleteProduct } from "../controllers/stockController.js"



const stockRouter = express.Router()

stockRouter.post("/addItem" , addProduct)
stockRouter.get("/getItems" , getAllProducts)
stockRouter.get("/getItems/:id" , getProductById)
stockRouter.put("/updateItem/:id" , updateProduct)
stockRouter.delete("/deleteItem/:id" , deleteProduct)




export default stockRouter