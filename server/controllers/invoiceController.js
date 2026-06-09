import Invoice from "../models/Invoice.js";
import Order from "../models/Order.js";
import PaymentTransaction from "../models/PaymentTransaction.js";
import Finance from "../models/finance.js";

export const getPaidInvoiceCountByCustomer = async (req, res) => {
    try {
        const email = req.params.email;
        const paidInvoices = await Invoice.find({ email, status: "paid" });
        res.json({ count: paidInvoices.length });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getUnpaidInvoiceCountByCustomer = async (req, res) => {
    try {
        const email = req.params.email;
        const unpaidInvoices = await Invoice.find({ email, status: "unpaid" });
        res.json({ count: unpaidInvoices.length });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getOverDueInvoiceCountByCustomer = async (req, res) => {
    try {
        const email = req.params.email;
        const overDueInvoices = await Invoice.find({ email, status: "overdue" });
        res.json({ count: overDueInvoices.length });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getInvoicesByCustomer = async (req, res) => {
    try {
        const email = req.params.email;
        if (!email) {
            return res.json([]);
        }
        // Escape email for regex and use case-insensitive match
        const escapedEmail = email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const invoices = await Invoice.find({ 
            email: { $regex: new RegExp(`^${escapedEmail}$`, "i") }, 
            invoiceType: "customer" 
        }).sort({ date: -1 });
        res.json(invoices);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.find().sort({ date: -1 });
        res.json(invoices);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createPaymentForInvoice = async (req, res) => {
    try {
        const invoiceID = req.params.invoiceID;
        const { paymentMethod, transactionID, notes } = req.body;
        console.log("Processing payment for:", invoiceID, { paymentMethod, transactionID });
        
        // Use req.file.path if it exists, otherwise use what was sent in body (for fallback)
        const paymentProof = req.file ? req.file.path : (req.body.paymentProof || "");
        console.log("File received:", req.file ? req.file.originalname : "No file via multer");

        const invoice = await Invoice.findOne({ invoiceID });

        if (!invoice) {
            console.error("Invoice not found:", invoiceID);
            return res.status(404).json({ message: "Invoice not found" });
        }

        invoice.paymentMethod = paymentMethod;
        invoice.transactionID = transactionID;
        invoice.paymentProof = paymentProof;
        invoice.notes = notes || invoice.notes;
        invoice.status = "pending-verification"; 
        invoice.payment_status = "unpaid"; // Still unpaid until admin verifies

        await invoice.save();
        console.log("Payment proof saved for invoice:", invoiceID);

        res.json({ message: "Payment proof submitted successfully for verification" });
    } catch (error) {
        console.error("Payment submission error:", error.message);
        res.status(500).json({ message: error.message });
    }
};

export const acceptPayment = async (req, res) => {
    try {
        const { id } = req.params;
        const { paymentMethod, bankAccountId, bankAccountName, notes } = req.body;
        const invoice = await Invoice.findById(id);
        if (!invoice) return res.status(404).json({ message: "Invoice not found" });

        invoice.status = "paid";
        invoice.payment_status = "paid";
        if (paymentMethod) invoice.paymentMethod = paymentMethod;
        if (bankAccountId) invoice.bankAccountId = bankAccountId;
        if (bankAccountName) invoice.bankAccountName = bankAccountName;
        if (notes) invoice.notes = notes;

        await invoice.save();

        const txnId = invoice.transactionID || `TXN-${Date.now()}`;

        // 1. Create Payment Transaction (for Payments & Transactions page)
        // Normalize method for enum: ["cash", "bank", "cheque", "other"]
        let finalMethod = (paymentMethod || invoice.paymentMethod || 'bank').toLowerCase();
        if (finalMethod.includes('cash')) finalMethod = 'cash';
        else if (finalMethod.includes('bank') || finalMethod.includes('online') || finalMethod.includes('transfer')) finalMethod = 'bank';
        else if (finalMethod.includes('cheque')) finalMethod = 'cheque';
        else finalMethod = 'other';

        await PaymentTransaction.create({
            transaction_id: txnId,
            type: 'customer',
            category: 'Invoice Payment',
            relatedEntity: invoice.email,
            amount: invoice.total,
            paymentMethod: finalMethod,
            bankAccountId: bankAccountId || null,
            bankAccountName: bankAccountName || '',
            date: new Date(),
            status: 'completed',
            notes: notes || invoice.notes,
            receiptUrl: invoice.paymentProof,
            isFinanceLinked: true
        });

        // 2. Create Finance Entry (for Finance Management main page)
        const financeTxnType = 'income';
        
        await Finance.create({
            transaction_type: financeTxnType,
            amount: invoice.total,
            description: `Income from Invoice: ${invoice.invoiceID}`,
            date: new Date(),
            notes: `Customer: ${invoice.email}. Order: ${invoice.orderID}`,
            bankAccountId: bankAccountId || null,
            bankAccountName: bankAccountName || ''
        });

        res.json({ success: true, message: "Payment accepted successfully and recorded in finance", invoice });
    } catch (error) {
        console.error("Accept payment error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const rejectPayment = async (req, res) => {
    try {
        const { id } = req.params;
        const invoice = await Invoice.findById(id);
        if (!invoice) return res.status(404).json({ message: "Invoice not found" });

        invoice.status = "unpaid";
        invoice.payment_status = "unpaid";
        invoice.notes = (invoice.notes || "") + "\nAdmin: Payment rejected. Please re-upload proof.";
        await invoice.save();

        res.json({ message: "Payment rejected", invoice });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ================================
//   (Supplier-only invoice functions removed)
// ================================

// ================================
//   CREATE CUSTOMER INVOICE FROM ORDER
// ================================
export const createCustomerInvoice = async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (order.invoiced) {
            return res.status(400).json({ message: "Invoice already generated for this order" });
        }

        // Calculate total based on received items
        let calculatedTotal = 0;
        const invoiceItems = order.items.map(item => {
            const qty = item.receivedQuantity || 0;
            const price = item.price || 0;
            const itemTotal = qty * price;
            calculatedTotal += itemTotal;
            return {
                itemName: item.name,
                quantity: qty,
                unitPrice: price,
                totalPrice: itemTotal
            };
        });

        // Add tax if needed, for now just 0
        const tax = calculatedTotal * 0.1; // 10% tax example
        const grandTotal = calculatedTotal + tax;

        const invoice = new Invoice({
            invoiceID: `INV-${Date.now()}`,
            orderID: order.orderID,
            email: order.email.toLowerCase(),
            date: new Date(),
            total: grandTotal,
            status: "unpaid",
            invoiceType: "customer",
            payment_status: "unpaid",
            items: invoiceItems,
            subtotal: calculatedTotal,
            tax_amount: tax,
            due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days due
        });

        await invoice.save();

        // Update order status or flag
        order.invoiced = true;
        await order.save();

        res.status(201).json(invoice);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ================================
//   (Admin supplier invoice functions removed)
// ================================
