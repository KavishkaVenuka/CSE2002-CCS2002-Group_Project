import mongoose from "mongoose";
import BankAccount from "../models/BankAccount.js";

// GET /getBankAccounts
export const getBankAccounts = async (req, res) => {
  try {
    const bankAccounts = await BankAccount.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bankAccounts.length,
      bankAccounts,
    });
  } catch (error) {
    console.error("Error fetching bank accounts:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch bank accounts",
      error: error.message,
    });
  }
};

// POST /addBankAccount
export const addBankAccount = async (req, res) => {
  try {
    const {
      bank_name,
      account_name,
      account_number,
      branch,
      notes,
      opening_balance,
    } = req.body;

    if (!bank_name || !account_name || !account_number) {
      return res.status(400).json({
        success: false,
        message: "bank_name, account_name and account_number are required",
      });
    }

    const existingAccount = await BankAccount.findOne({
      account_number: account_number.trim(),
    });

    if (existingAccount) {
      return res.status(409).json({
        success: false,
        message: "Bank account with this account number already exists",
      });
    }

    const bankAccount = await BankAccount.create({
      bank_name: bank_name.trim(),
      account_name: account_name.trim(),
      account_number: account_number.trim(),
      branch: branch?.trim() || "",
      notes: notes?.trim() || "",
      opening_balance: opening_balance || 0,
    });

    res.status(201).json({
      success: true,
      message: "Bank account added successfully",
      bankAccount,
    });
  } catch (error) {
    console.error("Error adding bank account:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add bank account",
      error: error.message,
    });
  }
};

// DELETE /deleteBankAccount/:id
export const deleteBankAccount = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid bank account ID",
      });
    }

    const deletedBankAccount = await BankAccount.findByIdAndDelete(id);

    if (!deletedBankAccount) {
      return res.status(404).json({
        success: false,
        message: "Bank account not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Bank account deleted successfully",
      deletedBankAccount,
    });
  } catch (error) {
    console.error("Error deleting bank account:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete bank account",
      error: error.message,
    });
  }
};