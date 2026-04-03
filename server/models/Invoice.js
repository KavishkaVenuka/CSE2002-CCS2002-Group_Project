import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema({
    invoiceID: {
        type: String,
        required: true,
        unique: true
    },
    orderID: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    paymentMethod: {
        type: String,
        required: false
    },
    notes: {
        type: String,
        required: false
    },
    transactionID: {
        type: String,
        required: false
    },
    paymentProof: {
        type: String,
        required: false
    },
    // ── Supplier Bill fields (null for customer invoices) ──
    bill_id: {
      type: String,
      default: null,
    },

    supplierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      default: null,
    },

    supplierEmail: {
      type: String,
      default: null,
      lowercase: true,
      trim: true,
    },

    // Links this bill to a purchase order
    purchaseOrderRef: {
      type: String,
      default: null,
    },

    due_date: {
      type: Date,
      default: null,
    },

    tax_amount: {
      type: Number,
      default: 0,
    },

    subtotal: {
      type: Number,
      default: 0,
    },

    // "supplier" for supplier bills, "customer" for customer invoices
    invoiceType: {
      type: String,
      enum: ["supplier", "customer"],
      default: "customer",
    },

    payment_status: {
      type: String,
      enum: ["unpaid", "partially_paid", "paid", "overdue"],
      default: "unpaid",
    },

    items: [
      {
        itemName:   { type: String, default: "" },
        quantity:   { type: Number, default: 0  },
        unitPrice:  { type: Number, default: 0  },
        totalPrice: { type: Number, default: 0  },
      },
    ],

});

// Auto-generate bill_id for supplier bills
invoiceSchema.pre("save", async function (next) {
  if (this.invoiceType === "supplier" && !this.bill_id) {
    const count = await mongoose.models.Invoice.countDocuments({
      invoiceType: "supplier",
    });
    this.bill_id = `BILL-${String(count + 1).padStart(5, "0")}`;
  }
  next();
});

export default mongoose.model("Invoice", invoiceSchema);