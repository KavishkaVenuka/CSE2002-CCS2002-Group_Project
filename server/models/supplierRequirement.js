import mongoose from 'mongoose';

const supplierItemSchema = new mongoose.Schema({
    itemName:     { type: String, required: true },
    quantity:     { type: Number, required: true },
    unit:         { type: String, default: 'units' },
    targetPrice:  { type: Number },
    deliveryDate: { type: Date },
    notes:        { type: String, default: '' },
}, { _id: false });

const supplierRequirementSchema = new mongoose.Schema(
    {
        originalRequirementId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Requirement',
            required: false
        },
        supplierId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', 
            required: [true, 'Supplier ID is required'],
        },
        assignedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        items: {
            type: [supplierItemSchema],
            validate: {
                validator: (arr) => arr.length > 0,
                message: 'At least one item is required',
            },
        },
        status: {
            type: String,
            enum: ['sent', 'pending', 'quoted', 'accepted', 'rejected', 'delivered'],
            default: 'sent',
        },
        rejectReason: { type: String, default: null },
    },
    { timestamps: true }
);

const SupplierRequirement = mongoose.model('SupplierRequirement', supplierRequirementSchema);
export default SupplierRequirement;