import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema({
    invoiceID: {
        type: String,
        required: true,
        unique: true
    },
    orderID: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    paymentMethod: {
        type: String,
        required: false
    },
    notes: {
        type: String,
        required: false
    },
    transactionID: {
        type: String,
        required: false
    },
    paymentProof: {
        type: String,
        required: false
    }

});

export default mongoose.model("Invoice", invoiceSchema);