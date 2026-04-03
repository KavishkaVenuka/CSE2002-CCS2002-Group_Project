import mongoose from 'mongoose';

const quotationSchema = new mongoose.Schema({
    
    quotationID :{
        type:String,
        required:true,
        unique: true
    },
    email:{
        type:String,
        required:true,

    },
    name:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        required:true,
        default: Date.now
    },
    total:{
        type: Number,
        required:true
    },
    status:{
        type:String,
        required:true,
        default: "Pending"
    },
    notes:{
        type:String,
        required:false
    },
    phonenumber:{
        type:Number,
        required:true
    },
    items:[
        {
            productID: {type:String, required:true},
            name: {type:String, required:true},
            price: {type:Number, required:true},
            quantity: {type:Number, required:true},
            image: {type:String, required:true},
            // Supplier quotation item extra fields
            unit:        {type:String, default:"pieces"},
            unitPrice:   {type:Number, default:0},
            totalPrice:  {type:Number, default:0},
            description: {type:String, default:""},

        }
    ],

    // ── Supplier Quotation fields (null for customer quotations) ──
    sq_id: {
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

    // Links back to the Requirement this quotation is responding to
    requirementId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Requirement",
      default: null,
    },

    validUntil: {
      type: Date,
      default: null,
    },

    currency: {
      type: String,
      default: "LKR",
    },

    total_estimate: {
      type: Number,
      default: 0,
    },

    // "supplier" or "customer" — lets controllers filter correctly
    quotationType: {
      type: String,
      enum: ["supplier", "customer"],
      default: "customer",
    },

    delivery_timeline: {
    type: String,
    default: "",
    },

    payment_terms: {
    type: String,
    default: "Net 30",
    },

    adminNotes: {
    type: String,
    default: null,
    },

    });

    // Auto-generate sq_id for supplier quotations
    quotationSchema.pre("save", async function (next) {
    if (this.quotationType === "supplier" && !this.sq_id) {
        const count = await mongoose.models.Quotation.countDocuments({
        quotationType: "supplier",
        });
        this.sq_id = `SQ-${String(count + 1).padStart(5, "0")}`;
    }
    next();

    });

const Quotation = mongoose.model('Quotation', quotationSchema);

export default Quotation;