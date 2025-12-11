import express from "express"
import { createCustomer, loginCustomer } from "../controllers/customerController.js";


const customerRouter = express.Router()

customerRouter.post("/register", createCustomer);
customerRouter.post("/login", loginCustomer);





export default customerRouter