import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    
    orderID :{
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
            image: {type:String, required:true}

        }
    ],
    totalCost:{
        type:Number,
        required:true
    },
    delivery:{
        trackingNumber:{
            type:String,
            required:false
        },
        estimatedDeliveryDate:{
            type:Date,
            required:false
        },
        deliveryAddress:{
            type:String,
            required:false
        }
    },
    statusDates:{
        quotationAcceptedDate:{
            type:Date,
            required:false
        },
        preparedDate:{
            type:Date,
            required:false
        },
        dispatchedDate:{
            type:Date,
            required:false
        },
        inTransitDate:{
            type:Date,
            required:false
        },
        deliveredDate:{
            type:Date,
            required:false
        }
    },
    dispatchDetails: {
        vehicleNumber:{ 
            type: String, 
            default: "" 
        },
        driverName:{ 
            type: String, 
            default: "" 
        },
        dispatchDate:{ 
            type: Date,   
            default: null 
        },
        deliveryNotes:{ 
            type: String, 
            default: "" 
        },
        deliveryNoteFileUrl:{ 
            type: String, 
            default: "" 
        },
    },
    deliveryProof:{
        type:String,
        required:false
    },
    // ── Purchase Order fields (null for customer orders) ──
    po_id: {
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

    // Links to the supplier quotation that generated this PO
    quotationRef: {
      type: String,
      default: null,
    },

    expectedDeliveryDate: {
      type: Date,
      default: null,
    },

    payment_terms: {
      type: String,
      default: "Net 30",
    },

    // "purchase" for supplier POs, "customer" for customer orders
    orderType: {
      type: String,
      enum: ["purchase", "customer"],
      default: "customer",
    },

})

// Auto-generate po_id for purchase orders
orderSchema.pre("save", async function (next) {
  if (this.orderType === "purchase" && !this.po_id) {
    const count = await mongoose.models.Order.countDocuments({
      orderType: "purchase",
    });
    this.po_id = `PO-${String(count + 1).padStart(5, "0")}`;
  }
  next();
});

const Order = mongoose.model('Order', orderSchema);

export default Order;