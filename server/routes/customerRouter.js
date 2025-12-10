import express from "express"
import { createCustomer } from "../controllers/customerController.js";


const customerRouter = express.Router()

customerRouter.post("/register", createCustomer);





export default customerRouter