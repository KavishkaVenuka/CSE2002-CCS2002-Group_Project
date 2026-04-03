import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // පෙර පියවරේදී අප කතා කළ අභිරුචි හැඳුනුම් අංකය (ADM000001, CUST000001)
    customID: {
      type: String,
      unique: true,
    },

    // Admin සහ අනෙක් අයට පොදු දත්ත
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
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

    // Role එක අනුව පාලනය කිරීම
    role: {
      type: String,
      enum: ["Admin", "Customer", "Supplier"],
      default: "Customer",
    },

    // පහත දත්ත Admin ට අත්‍යවශ්‍ය නොවේ (Optional for Admin)
    contactNumber: {
      type: String,
      required: false, 
    },

    address: {
      type: String,
      required: false,
      trim: true,
    },

    companyName: {
      type: String,
      required: false,
      trim: true,
    },

    vatNumber: {
      type: String,
      required: false,
      default: null,
    },

    businessRegistrationNumber: {
      type: String,
      required: false,
      unique: true,
      sparse: true, // Null අගයන් කිහිපයක් තිබිය හැකි නිසා අනිවාර්ය වේ
    },

    productCategories: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;