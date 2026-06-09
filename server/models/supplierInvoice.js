import mongoose from 'mongoose';

const supplierInvoiceSchema = new mongoose.Schema({
    bill_id: {
        type: String,
        unique: true,
        default: null
    },
    invoiceID: {
        type: String,
        required: true,
        unique: true
    },
    // Links to the purchase order
    purchaseOrderRef: {
        type: String,
        default: null
    },
    orderID: {
        type: String,
        required: true
    },
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
    // email mirrors supplierEmail for consistency
    email: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    due_date: {
        type: Date,
        default: null
    },
    total: {
        type: Number,
        required: true
    },
    subtotal: {
        type: Number,
        default: 0
    },
    tax_amount: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        required: true,
        default: 'unpaid'
    },
    payment_status: {
        type: String,
        enum: ['unpaid', 'partially_paid', 'paid', 'overdue'],
        default: 'unpaid'
    },
    paymentMethod: {
        type: String,
        default: ''
    },
    transactionID: {
        type: String,
        default: ''
    },
    paymentProof: {
        type: String,
        default: ''
    },
    notes: {
        type: String,
        default: ''
    },
    items: [
        {
            itemName: { type: String, default: '' },
            quantity: { type: Number, default: 0 },
            unitPrice: { type: Number, default: 0 },
            totalPrice: { type: Number, default: 0 }
        }
    ]
}, { timestamps: true });

// Auto-generate bill_id for all supplier invoices
supplierInvoiceSchema.pre('save', async function (next) {
    if (!this.bill_id) {
        const count = await mongoose.models.SupplierInvoice.countDocuments();
        this.bill_id = `BILL-${String(count + 1).padStart(5, '0')}`;
    }
    next();
});

const SupplierInvoice = mongoose.model('SupplierInvoice', supplierInvoiceSchema);
export default SupplierInvoice;