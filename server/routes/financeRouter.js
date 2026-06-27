import express from "express";
import {
  addTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
} from "../controllers/financeController.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const financeRouter = express.Router();

// Base path: /api/finance
// All finance/transaction data is Admin-only — sensitive financial records.
financeRouter.post("/addTransaction",           requireAuth, requireAdmin, addTransaction);
financeRouter.get("/getTransactions",           requireAuth, requireAdmin, getAllTransactions);
financeRouter.get("/getTransactions/:id",       requireAuth, requireAdmin, getTransactionById);
financeRouter.put("/updateTransaction/:id",     requireAuth, requireAdmin, updateTransaction);
financeRouter.delete("/deleteTransaction/:id",  requireAuth, requireAdmin, deleteTransaction);

export default financeRouter;