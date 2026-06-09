import mongoose from 'mongoose';

const supplierOrderSchema = new mongoose.Schema({

    supplierId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    supplierEmail: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    orderID: {
        type: String,
        required: true,
        unique: true
    },
    // Links to the supplier quotation that generated this PO
    quotationRef: {
        type: String,
        default: null
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    address: {
        type: String,
        default: ''
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    total: {
        type: Number,
        required: true
    },
    totalCost: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        required: true,
        default: 'Pending'
    },
    notes: {
        type: String,
        default: ''
    },
    phonenumber: {
        type: Number,
        default: 0
    },
    items: [
        {
            productID: { type: String, required: true },
            name: { type: String, required: true },
            price: { type: Number, required: true },
            quantity: { type: Number, required: true },
            unit: { type: String, default: 'pieces' },
            issuedQuantity: { type: Number, default: 0 },
            receivedQuantity: { type: Number, default: 0 },
            rejectedQuantity: { type: Number, default: 0 },
            restocked: { type: Boolean, default: false }
        }
    ],
    delivery: {
        trackingNumber: { type: String, default: '' },
        estimatedDeliveryDate: { type: Date, default: null },
        deliveryAddress: { type: String, default: '' }
    },
    dispatchDetails: {
        vehicleNumber: { type: String, default: '' },
        driverName: { type: String, default: '' },
        dispatchDate: { type: Date, default: null },
        deliveryNotes: { type: String, default: '' },
        deliveryNoteFileUrl: { type: String, default: '' }
    },
    deliveryProof: { type: String, default: '' },
    payment_terms: { type: String, default: 'Net 30' },
    expectedDeliveryDate: { type: Date, default: null },
    // Auto-generated PO number
    po_id: { type: String, default: null },
    invoiced: { type: Boolean, default: false }

}, { timestamps: true });

// Auto-generate po_id for all supplier purchase orders
supplierOrderSchema.pre('save', async function (next) {
    if (!this.po_id) {
        const count = await mongoose.models.SupplierOrder.countDocuments();
        this.po_id = `PO-${String(count + 1).padStart(5, '0')}`;
    }
    next();
});

const SupplierOrder = mongoose.model('SupplierOrder', supplierOrderSchema);
export default SupplierOrder;