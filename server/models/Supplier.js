import mongoose from "mongoose";

const SupplierSchema = new mongoose.Schema(
  {
    // Added to match the "Full Name" field in your UI
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },

    // Changed to optional to match UI "(Optional)" label
    companyName: {
      type: String,
      required: false,
      trim: true,
    },

    // Changed to optional and added sparse: true to allow multiple nulls
    businessRegistrationNumber: {
      type: String,
      required: false,
      unique: true,
      sparse: true, 
    },

    // Optional in UI
    vatNumber: {
      type: String,
      default: null,
      required: false,
    },

    contactNumber: {
      type: String,
      required: [true, "Contact number is required"],
    },
    
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },

    address: {
      type: String,
      required: false,
      trim: true,
    },

    // Tracks which requirements this supplier has already quoted
    quotedRequirementIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Requirement",
      },
    ],

    // Summary counters updated when quotations/orders change
    stats: {
      totalRevenue:       { type: Number, default: 0 },
      activeOrdersCount:  { type: Number, default: 0 },
      pendingQuotations:  { type: Number, default: 0 },
    },

    businessType: {
      type: String,
      enum: ["Manufacturer", "Distributor", "Service Provider", "Other", null],
      required: false,
    },

    natureOfBusiness: {
      type: String,
      required: false,
    },

    productCategories: [
      {
        type: String,
      },
    ],

    role: {
      type: String,
      enum: ["Supplier", "Customer", "Admin"],
      default: "Supplier",
    },
  },
  { timestamps: true }
);

const Supplier = mongoose.model("Supplier", SupplierSchema);

export default Supplier;