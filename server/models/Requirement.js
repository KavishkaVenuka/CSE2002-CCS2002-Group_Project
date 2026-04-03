import mongoose from 'mongoose';

// Sub-schema: requirement item අතුළත් කිරීම
const requirementItemSchema = new mongoose.Schema({
    itemName:             { type: String, required: true },
    quantity:             { type: Number, required: true },
    unit:                 { type: String, default: 'units' },   // units, kg, meters, boxes, pieces …
    deliveryDate:         { type: Date },                        // optional
    notes:                { type: String, default: '' },
}, { _id: false });

// Main schema
const requirementSchema = new mongoose.Schema(
    {
        // =============================================
        // Customer reference — ඉල්ලුම් කළ පාරිභෝගිකයා
        // =============================================
        customerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Customer ID is required'],
        },

        // =============================================
        // Line items
        // =============================================
        requirements: {
            type: [requirementItemSchema],
            validate: {
                validator: (arr) => arr.length > 0,
                message: 'At least one requirement item is required',
            },
        },

        // =============================================
        // Optional document attachment (multer path)
        // =============================================
        attachedDocument: { type: String, default: null },

        // =============================================
        // Lifecycle status
        // =============================================
        status: {
            type: String,
            enum: ['pending', 'quoted', 'accepted', 'delivered', 'rejected'],
            default: 'pending',
        },
    },
    { timestamps: true }
);

const Requirement = mongoose.model('Requirement', requirementSchema);
export default Requirement;