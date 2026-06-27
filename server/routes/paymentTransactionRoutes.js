import express from "express";
import {
  getPayments,
  addPayment,
  deletePayment,
} from "../controllers/paymentTransactionController.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// Base path: /api/paymentTransactions
// Payment transaction records are Admin-only — must never be exposed without auth.
router.get("/getPayments",         requireAuth, requireAdmin, getPayments);
router.post("/addPayment",         requireAuth, requireAdmin, addPayment);
router.delete("/deletePayment/:id",requireAuth, requireAdmin, deletePayment);

export default router;