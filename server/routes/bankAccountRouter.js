import express from "express";
import {
  getBankAccounts,
  addBankAccount,
  deleteBankAccount,
} from "../controllers/bankAccountController.js";

const router = express.Router();

router.get("/getBankAccounts", getBankAccounts);
router.post("/addBankAccount", addBankAccount);
router.delete("/deleteBankAccount/:id", deleteBankAccount);

export default router;