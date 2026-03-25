import express from "express"
import { addTransaction, getAllTransactions, getTransactionById, updateTransaction, deleteTransaction } from "../controllers/financeController.js"



const financeRouter = express.Router()

financeRouter.post("/addTransaction" , addTransaction)
financeRouter.get("/getTransactions" , getAllTransactions)
financeRouter.get("/getTransactions/:id" , getTransactionById)
financeRouter.put("/updateTransaction/:id" , updateTransaction)
financeRouter.delete("/deleteTransaction/:id" , deleteTransaction)




export default financeRouter