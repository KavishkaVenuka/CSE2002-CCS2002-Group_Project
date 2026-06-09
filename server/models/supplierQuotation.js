import mongoose from 'mongoose';

const supplierQuotationSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  quotationID: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  name: { type: String, required: true },
  address: { type: String, default: "" },
  date: { type: Date, default: Date.now },
  total: { type: Number, required: true },
  status: { type: String, default: "Pending" },
  notes: { type: String },
  phonenumber: { type: Number, default: 0 },
  items: [
    {
      productID: { type: String, required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      unit: { type: String, default: "pieces" },
      unitPrice: { type: Number, default: 0 },
      totalPrice: { type: Number, default: 0 },
      description: { type: String, default: "" },
    }
  ],
  requirementId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SupplierRequirement",
    default: null,
  },
  supplierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  supplierEmail: {
    type: String,
    default: null,
  },
  sq_id: { type: String, default: null },
  validUntil: { type: Date },
  total_estimate: { type: Number, default: 0 },
  subtotal: { type: Number, default: 0 },
  tax_amount: { type: Number, default: 0 },
  currency: { type: String, default: "LKR" },
}, { timestamps: true });

// Auto-generate SQ ID
supplierQuotationSchema.pre("save", async function (next) {
  if (!this.sq_id) {
    const count = await mongoose.models.SupplierQuotation.countDocuments();
    this.sq_id = `SQ-${String(count + 1).padStart(5, "0")}`;
  }
  next();
});

const SupplierQuotation = mongoose.model('SupplierQuotation', supplierQuotationSchema);
export default SupplierQuotation;