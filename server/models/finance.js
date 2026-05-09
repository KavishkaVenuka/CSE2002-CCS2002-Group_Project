import mongoose from "mongoose";

const financeSchema = new mongoose.Schema(
  {
    transaction_type: {
      type: String,
      enum: ['fund', 'loan', 'cash_in', 'cash_out', 'bank_deposit', 'bank_withdraw'],
      required: true,
      trim: true,
    },
    amount: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
      default: 0,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
    bankAccountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BankAccount",
      default: null,
    },
    bankAccountName: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Finance =
  mongoose.models.Finance || mongoose.model("Finance", financeSchema);

export default Finance;
