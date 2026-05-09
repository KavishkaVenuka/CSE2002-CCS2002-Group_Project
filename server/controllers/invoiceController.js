import Invoice from "../models/Invoice.js";
import Order from "../models/Order.js";

exports.getPaidInvoiceCountByCustomer = async (req, res) => {
    try {
        const email = req.params.email;
        const paidInvoices = await Invoice.find({ email, status: "paid" });
        res.json({ count: paidInvoices.length });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getUnpaidInvoiceCountByCustomer = async (req, res) => {
    try {
        const email = req.params.email;
        const unpaidInvoices = await Invoice.find({ email, status: "unpaid" });
        res.json({ count: unpaidInvoices.length });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getOverDueInvoiceCountByCustomer = async (req, res) => {
    try {
        const email = req.params.email;
        const overDueInvoices = await Invoice.find({ email, status: "overdue" });
        res.json({ count: overDueInvoices.length });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getInvoicesByCustomer = async (req, res) => {
    try {
        const email = req.params.email;
        const invoices = await Invoice.find({ email });
        res.json(invoices);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createPaymentForInvoice = async (req, res) => {
    try {
        const invoiceID = req.params.invoiceID;
        const { paymentMethod, transactionID, paymentProof } = req.body;

        const invoice = await Invoice.findOne({ invoiceID });

        if (!invoice) {
            return res.status(404).json({ message: "Invoice not found" });
        }

        invoice.paymentMethod = paymentMethod;
        invoice.transactionID = transactionID;
        invoice.paymentProof = paymentProof;

        await invoice.save();

        res.json({ message: "Payment details updated successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ================================
//   SUBMIT SUPPLIER BILL / INVOICE
// ================================
exports.createSupplierInvoice = async (req, res) => {
    try {
        const supplierId    = req.user.id;
        const supplierEmail = req.user.email;

        const {
            purchaseOrderRef,
            items,
            subtotal,
            tax_amount,
            total,
            due_date,
            notes,
        } = req.body;

        if (!purchaseOrderRef || !total) {
            return res.status(400).json({
                success: false,
                message: "purchaseOrderRef and total are required",
            });
        }

        // Verify this purchase order belongs to this supplier
        const order = await Order.findOne({
            po_id:         purchaseOrderRef,
            supplierEmail,
            orderType:     "purchase",
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Purchase order not found or does not belong to you",
            });
        }

        const invoice = new Invoice({
            invoiceID:       `BILL-TEMP-${Date.now()}`,
            orderID:         purchaseOrderRef,
            email:           supplierEmail,
            date:            new Date(),
            total,
            status:          "unpaid",
            notes:           notes || "",
            supplierId,
            supplierEmail,
            purchaseOrderRef,
            invoiceType:     "supplier",
            payment_status:  "unpaid",
            items:           items     || [],
            subtotal:        subtotal  || 0,
            tax_amount:      tax_amount || 0,
            due_date:        due_date  || null,
        });

        await invoice.save();

        // Sync invoiceID with the auto-generated bill_id
        invoice.invoiceID = invoice.bill_id;
        await invoice.save();

        return res.status(201).json({
            success: true,
            message: "Invoice submitted successfully",
            invoice: {
                id:      invoice._id,
                bill_id: invoice.bill_id,
                total:   invoice.total,
                status:  invoice.payment_status,
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ================================
//   GET ALL INVOICES FOR THIS SUPPLIER
// ================================
exports.getSupplierInvoices = async (req, res) => {
    try {
        const supplierEmail = req.user.email;

        const invoices = await Invoice.find({
            supplierEmail,
            invoiceType: "supplier",
        }).sort({ date: -1 });

        return res.status(200).json({
            success: true,
            invoices,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ================================
//   GET SINGLE SUPPLIER INVOICE
// ================================
exports.getSupplierInvoiceById = async (req, res) => {
    try {
        const supplierEmail = req.user.email;

        const invoice = await Invoice.findOne({
            _id:         req.params.id,
            supplierEmail,
            invoiceType: "supplier",
        });

        if (!invoice) {
            return res.status(404).json({
                success: false,
                message: "Invoice not found",
            });
        }

        return res.status(200).json({
            success: true,
            invoice,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ================================
//   INVOICE SUBMISSION PAGE - ORDER DROPDOWN
// ================================
exports.getInvoiceableOrders = async (req, res) => {
    try {
        const supplierEmail = req.user.email;

        // Get dispatched orders for this supplier
        const orders = await Order.find({
            supplierEmail,
            orderType: "purchase",
            status:    "dispatched",
        }).select("po_id name");

        // Find which ones already have a submitted bill
        const existingBills = await Invoice.find({
            supplierEmail,
            invoiceType: "supplier",
        }).select("purchaseOrderRef");

        const billedPoIds = new Set(existingBills.map((b) => b.purchaseOrderRef));

        const invoiceable = orders
            .filter((o) => !billedPoIds.has(o.po_id))
            .map((o) => ({
                id:           o._id,
                po_id:        o.po_id,
                customerName: o.name || "Hardware Store",
                label:        `${o.po_id} — ${o.name || "Hardware Store"}`,
            }));

        return res.status(200).json({ success: true, orders: invoiceable });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
