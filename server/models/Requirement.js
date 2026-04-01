import mongoose from 'mongoose';

const requirementItemSchema = new mongoose.Schema({
    itemName: { type: String, required: true },
    unit: { type: String, enum: ['kilograms', 'meters', 'boxes', 'pieces'], required: true },
    expectedDeliveryDate: { type: Date, required: true },
    quantity: { type: Number, required: true },
    notes: { type: String }
});

const requirementSchema = new mongoose.Schema({
    requirements: [requirementItemSchema],
    attachedDocument: { type: String },
}, { timestamps: true });

const Requirement = mongoose.model('Requirement', requirementSchema);
export default Requirement;