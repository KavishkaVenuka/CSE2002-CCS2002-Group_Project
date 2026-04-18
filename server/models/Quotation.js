import mongoose from 'mongoose';

const quotationSchema = new mongoose.Schema({
  // Customer සම්බන්ධ කරන ප්‍රධාන ලින්ක් එක
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
    ref: "Requirement",
    default: null,
  },
  quotationType: { type: String, enum: ["supplier", "customer"], default: "customer" },
  sq_id: { type: String, default: null },
  validUntil: { type: Date },
  total_estimate: { type: Number, default: 0 },
}, { timestamps: true });

// Auto-generate SQ ID
quotationSchema.pre("save", async function (next) {
  if (this.quotationType === "supplier" && !this.sq_id) {
    const count = await mongoose.models.Quotation.countDocuments({ quotationType: "supplier" });
    this.sq_id = `SQ-${String(count + 1).padStart(5, "0")}`;
  }
  next();
});

const Quotation = mongoose.model('Quotation', quotationSchema);
export default Quotation;