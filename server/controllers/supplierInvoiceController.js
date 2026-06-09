import SupplierInvoice from '../models/supplierInvoice.js';
import SupplierOrder from '../models/supplierOrder.js';
import SupplierPaymentTransaction from '../models/supplierPaymentTransaction.js';
import PaymentTransaction from '../models/PaymentTransaction.js';
import Finance from '../models/finance.js';
import StockItem from '../models/Stock.js';

// ==========================================
// 1. GET all supplier invoices (Admin)
// ==========================================
export const getAllSupplierInvoices = async (req, res) => {
    try {
        const invoices = await SupplierInvoice.find().sort({ date: -1 });
        res.status(200).json({ success: true, invoices });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ==========================================
// 2. GET invoices for logged-in supplier
// ==========================================
export const getInvoicesBySupplierEmail = async (req, res) => {
    try {
        const supplierEmail = req.user.email;
        const invoices = await SupplierInvoice.find({ supplierEmail }).sort({ date: -1 });
        res.status(200).json({ success: true, invoices });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ==========================================
// 3. GET invoice counts by status
// ==========================================
export const getPaidInvoiceCount = async (req, res) => {
    try {
        const email = req.params.email;
        const count = await SupplierInvoice.countDocuments({ supplierEmail: email, payment_status: 'paid' });
        res.json({ success: true, count });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getUnpaidInvoiceCount = async (req, res) => {
    try {
        const email = req.params.email;
        const count = await SupplierInvoice.countDocuments({ supplierEmail: email, payment_status: 'unpaid' });
        res.json({ success: true, count });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getOverdueInvoiceCount = async (req, res) => {
    try {
        const email = req.params.email;
        const count = await SupplierInvoice.countDocuments({ supplierEmail: email, payment_status: 'overdue' });
        res.json({ success: true, count });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ==========================================
// 4. ACCEPT / REJECT supplier invoice payment (Admin)
// ==========================================
export const acceptSupplierPayment = async (req, res) => {
    try {
        const { paymentMethod, bankAccountId, bankAccountName, notes } = req.body;
        const invoice = await SupplierInvoice.findById(req.params.id);
        if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
        
        invoice.status = 'paid';
        invoice.payment_status = 'paid';
        if (paymentMethod) invoice.paymentMethod = paymentMethod;
        if (bankAccountId) invoice.bankAccountId = bankAccountId;
        if (notes) invoice.notes = notes;
        
        await invoice.save();

        const txnId = invoice.transactionID || `STXN-${Date.now()}`;

        // 1. Create Supplier-specific transaction record
        await SupplierPaymentTransaction.create({
            transaction_id: txnId,
            type: 'supplier',
            category: 'Invoice Payment',
            relatedEntity: invoice.supplierEmail,
            supplierId: invoice.supplierId,
            supplierEmail: invoice.supplierEmail,
            purchaseOrderRef: invoice.purchaseOrderRef || '',
            billRef: invoice.bill_id,
            amount: invoice.total,
            paymentMethod: paymentMethod || invoice.paymentMethod || 'bank',
            bankAccountId: bankAccountId || null,
            bankAccountName: bankAccountName || '',
            date: new Date(),
            status: 'completed',
            notes: notes || invoice.notes,
            receiptUrl: invoice.paymentProof
        });

        // 2. Create Global Payment Transaction (for Payments & Transactions page)
        await PaymentTransaction.create({
            transaction_id: txnId,
            type: 'supplier',
            category: 'Supplier Bill Payment',
            relatedEntity: invoice.supplierEmail,
            amount: invoice.total,
            paymentMethod: paymentMethod || invoice.paymentMethod || 'bank',
            bankAccountId: bankAccountId || null,
            bankAccountName: bankAccountName || '',
            date: new Date(),
            status: 'completed',
            notes: notes || invoice.notes,
            purchaseOrderRef: invoice.purchaseOrderRef || '',
            billRef: invoice.bill_id,
            isFinanceLinked: true
        });

        // 3. Create Finance Entry (for Finance Management main page)
        await Finance.create({
            transaction_type: paymentMethod === 'cash' ? 'cash_out' : 'bank_withdraw',
            amount: invoice.total,
            description: `Payment for Supplier Bill: ${invoice.bill_id || invoice.invoiceID}`,
            date: new Date(),
            notes: `Supplier: ${invoice.supplierEmail}. Ref: ${invoice.purchaseOrderRef}`,
            bankAccountId: bankAccountId || null,
            bankAccountName: bankAccountName || ''
        });

        res.status(200).json({ success: true, message: 'Payment accepted and finance records updated', invoice });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const rejectSupplierPayment = async (req, res) => {
    try {
        const invoice = await SupplierInvoice.findById(req.params.id);
        if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
        invoice.status = 'unpaid';
        invoice.payment_status = 'unpaid';
        invoice.notes = (invoice.notes || '') + '\nAdmin: Payment rejected. Please re-submit.';
        await invoice.save();
        res.status(200).json({ success: true, message: 'Payment rejected', invoice });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ==========================================
// 5. SUBMIT PAYMENT PROOF (Supplier)
// ==========================================
export const submitSupplierPaymentProof = async (req, res) => {
    try {
        const { invoiceID } = req.params;
        const { paymentMethod, transactionID, notes } = req.body;
        const paymentProof = req.file ? req.file.path : (req.body.paymentProof || '');

        const invoice = await SupplierInvoice.findOne({ invoiceID });
        if (!invoice) return res.status(404).json({ message: 'Invoice not found' });

        invoice.paymentMethod = paymentMethod;
        invoice.transactionID = transactionID;
        invoice.paymentProof = paymentProof;
        invoice.notes = notes || invoice.notes;
        invoice.status = 'pending-verification';
        await invoice.save();

        res.json({ success: true, message: 'Payment proof submitted for verification' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// ==========================================
// 6. CREATE INVOICE (Supplier)
// ==========================================
export const createSupplierInvoiceBySupplier = async (req, res) => {
    try {
        const supplierEmail = req.user.email;
        const supplierId = req.user.id;
        const { purchaseOrderRef, items, subtotal, tax_amount, total, due_date, notes } = req.body;

        const invoice = new SupplierInvoice({
            invoiceID: `SINV-${Date.now()}`,
            purchaseOrderRef,
            orderID: purchaseOrderRef,
            supplierId,
            supplierEmail,
            email: supplierEmail,
            date: new Date(),
            due_date,
            total,
            subtotal,
            tax_amount,
            status: 'unpaid',
            payment_status: 'unpaid',
            items: items.map(i => ({
                itemName: i.itemName,
                quantity: i.quantity,
                unitPrice: i.unitPrice,
                totalPrice: i.totalPrice
            })),
            notes
        });

        await invoice.save();

        // Mark the Purchase Order as invoiced so it doesn't show up again
        await SupplierOrder.findOneAndUpdate(
            { po_id: purchaseOrderRef },
            { invoiced: true }
        );

        res.status(201).json({ success: true, invoice });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ==========================================
// 7. GET INVOICE STATS (Supplier)
// ==========================================
export const getSupplierInvoiceStats = async (req, res) => {
    try {
        const supplierEmail = req.user.email;
        const [total, paid, unpaid, overdue] = await Promise.all([
            SupplierInvoice.countDocuments({ supplierEmail }),
            SupplierInvoice.countDocuments({ supplierEmail, payment_status: 'paid' }),
            SupplierInvoice.countDocuments({ supplierEmail, payment_status: 'unpaid' }),
            SupplierInvoice.countDocuments({ supplierEmail, payment_status: 'overdue' })
        ]);

        res.json({ success: true, stats: { total, paid, unpaid, overdue } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
