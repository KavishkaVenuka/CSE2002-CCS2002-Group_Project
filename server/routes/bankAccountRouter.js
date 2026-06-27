import express from "express";
import {
  getBankAccounts,
  addBankAccount,
  deleteBankAccount,
} from "../controllers/bankAccountController.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// Base path: /api/bankAccounts
// All bank account operations are Admin-only — financial institution details
// must never be accessible without authentication.
router.get("/getBankAccounts",    requireAuth, requireAdmin, getBankAccounts);
router.post("/addBankAccount",    requireAuth, requireAdmin, addBankAccount);
router.delete("/deleteBankAccount/:id", requireAuth, requireAdmin, deleteBankAccount);

export default router;