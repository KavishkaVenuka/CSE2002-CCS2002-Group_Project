import mongoose from "mongoose";

const financeSchema = new mongoose.Schema(
  {
    transaction_type: {
      type: String,
      required: true,
      enum: ["income", "expense"],
      trim: true,
    },
    amount: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
      min: 0,
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
    category: {
      type: String,
      default: "",
      trim: true,
    },
    payment_method: {
      type: String,
      default: "",
      trim: true,
    },
    status: {
      type: String,
      enum: ["paid", "pending"],
      default: "paid",
    },
    module: {
      type: String,
      default: "",
      trim: true,
    },
    notes: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { timestamps: true }
);

const Finance = mongoose.model("Finance", financeSchema);

export default Finance;