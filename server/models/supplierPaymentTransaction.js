import mongoose from 'mongoose';

const supplierPaymentTransactionSchema = new mongoose.Schema(
    {
        transaction_id: {
            type: String,
            unique: true
        },
        // Always 'supplier' for this collection
        type: {
            type: String,
            enum: ['supplier'],
            default: 'supplier',
            required: true
        },
        category: {
            type: String,
            required: true,
            trim: true
        },
        relatedEntity: {
            type: String,
            required: true,
            trim: true
        },
        supplierId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null
        },
        supplierEmail: {
            type: String,
            lowercase: true,
            trim: true,
            default: ''
        },
        // Links payment to a purchase order (po_id string)
        purchaseOrderRef: {
            type: String,
            default: ''
        },
        // Links payment to a supplier bill (bill_id string)
        billRef: {
            type: String,
            default: ''
        },
        amount: {
            type: mongoose.Schema.Types.Decimal128,
            required: true,
            default: 0
        },
        paymentMethod: {
            type: String,
            enum: ['cash', 'bank'],
            required: true
        },
        bankAccountId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'BankAccount',
            default: null
        },
        bankAccountName: {
            type: String,
            trim: true,
            default: ''
        },
        date: {
            type: Date,
            required: true
        },
        status: {
            type: String,
            enum: ['pending', 'completed', 'failed'],
            default: 'completed'
        },
        notes: {
            type: String,
            trim: true,
            default: ''
        },
        receiptUrl: {
            type: String,
            default: ''
        },
        isFinanceLinked: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

supplierPaymentTransactionSchema.pre('save', async function (next) {
    if (!this.transaction_id) {
        const count = await mongoose.models.SupplierPaymentTransaction.countDocuments();
        this.transaction_id = `STXN-${String(count + 1).padStart(4, '0')}`;
    }
    next();
});

const SupplierPaymentTransaction =
    mongoose.models.SupplierPaymentTransaction ||
    mongoose.model('SupplierPaymentTransaction', supplierPaymentTransactionSchema);

export default SupplierPaymentTransaction;