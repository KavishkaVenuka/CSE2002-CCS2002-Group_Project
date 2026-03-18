import Invoice from "../models/Invoice";

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
