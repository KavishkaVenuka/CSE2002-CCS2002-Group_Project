import mongoose from "mongoose";
import Counter from "./Counter.js"; // Counter model එක import කරන්න

const customerSchema = new mongoose.Schema(
  {
    // ස්වයංක්‍රීයව හැදෙන ID එක (අනෙක් Database සමඟ සම්බන්ධ කිරීමට)
    customerId: {
      type: String,
      unique: true,
    },

    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },

    companyName: {
      type: String,
      required: false,
      trim: true,
    },

    businessRegistrationNumber: {
      type: String,
      required: false,
      unique: true,
      sparse: true,
    },

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
      required: [true, "Physical address is required"],
      trim: true,
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
      enum: ["Customer", "Supplier", "Admin"],
      default: "Customer",
    },
  },
  { timestamps: true }
);

// -----------------------------------------------------------
// PRE-SAVE HOOK: දත්ත Save වීමට පෙර Customer ID එක හැදීම
// -----------------------------------------------------------
customerSchema.pre("save", async function (next) {
  const doc = this;

  // අලුත් පාරිභෝගිකයෙක් නම් පමණක් ID එකක් හදන්න
  if (doc.isNew) {
    try {
      const counter = await Counter.findOneAndUpdate(
        { id: "customerId" },
        { $inc: { seq: 1 } },
        { new: true, upsert: true } // පේළිය නැතිනම් අලුතින් හදන්න
      );

      // ID එක සකස් කිරීම: CUST-0001 ආකාරයට
      doc.customerId = `CUST-${counter.seq.toString().padStart(4, "0")}`;
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

const Customer = mongoose.model("Customer", customerSchema);

export default Customer;