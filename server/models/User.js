import mongoose from "mongoose";

const supplierSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
    },

    businessRegistrationNumber: {
      type: String,
      required: true,
      unique: true,
    },

    vatNumber: {
      type: String,
      default: null,
    },

    contactNumber: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    address: {
      type: String,
      required: true,
    },

    businessType: {
      type: String,
      enum: ["Manufacturer", "Distributor", "Service Provider", "Other"],
      required: true,
    },

    natureOfBusiness: {
      type: String,
      required: true,
    },

    productCategories: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

const Supplier = mongoose.model("Supplier", supplierSchema);

export default Supplier;