import mongoose from "mongoose";

const bankAccountSchema = new mongoose.Schema(
  {
    bank_name: {
      type: String,
      required: true,
      trim: true,
    },
    account_name: {
      type: String,
      required: true,
      trim: true,
    },
    account_number: {
      type: String,
      required: true,
      trim: true,
    },
    branch: {
      type: String,
      trim: true,
      default: "",
    },
    notes: {
      type: String,
      trim: true,
      default: "",
    },
    opening_balance: {
      type: mongoose.Schema.Types.Decimal128,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const BankAccount =
  mongoose.models.BankAccount || mongoose.model("BankAccount", bankAccountSchema);

export default BankAccount;

