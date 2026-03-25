import mongoose from "mongoose";

const paymentTransactionSchema = new mongoose.Schema(
  {
    transaction_id: {
      type: String,
      unique: true,
    },
    type: {
      type: String,
      enum: ["expense", "supplier", "customer"],
      required: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    relatedEntity: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
      default: 0,
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "bank"],
      required: true,
    },
    bankAccountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BankAccount",
      default: null,
    },
    bankAccountName: {
      type: String,
      trim: true,
      default: "",
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "completed",
    },
    notes: {
      type: String,
      trim: true,
      default: "",
    },
    receiptUrl: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

paymentTransactionSchema.pre("save", async function (next) {
  if (!this.transaction_id) {
    const count = await mongoose.models.PaymentTransaction.countDocuments();
    this.transaction_id = `TXN-${String(count + 1).padStart(4, "0")}`;
  }
  next();
});

const PaymentTransaction =
  mongoose.models.PaymentTransaction ||
  mongoose.model("PaymentTransaction", paymentTransactionSchema);

export default PaymentTransaction;