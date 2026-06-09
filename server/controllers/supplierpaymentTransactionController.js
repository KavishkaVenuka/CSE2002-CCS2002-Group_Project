import mongoose from 'mongoose';
import SupplierPaymentTransaction from '../models/supplierPaymentTransaction.js';
import BankAccount from '../models/BankAccount.js';
import Finance from '../models/finance.js';

const parseDecimal = (value) => {
    if (value == null) return 0;
    if (typeof value === 'number') return value;
    if (typeof value === 'string') return Number(value) || 0;
    if (typeof value === 'object' && '$numberDecimal' in value) return Number(value.$numberDecimal) || 0;
    return Number(value) || 0;
};

const getBankBalance = async (bankAccountId) => {
    const bank = await BankAccount.findById(bankAccountId);
    if (!bank) return 0;
    const openingBalance = parseDecimal(bank.opening_balance);

    const income = await SupplierPaymentTransaction.aggregate([
        { $match: { status: 'completed', paymentMethod: 'bank', bankAccountId: new mongoose.Types.ObjectId(bankAccountId), type: 'supplier' } },
        { $group: { _id: null, total: { $sum: { $toDouble: '$amount' } } } }
    ]);

    return openingBalance + (income[0]?.total || 0);
};

// ==========================================
// 1. GET all supplier payment transactions
// ==========================================
export const getSupplierPayments = async (req, res) => {
    try {
        const payments = await SupplierPaymentTransaction.find().sort({ date: -1 });
        const mapped = payments.map(p => ({
            ...p.toObject(),
            amount: parseDecimal(p.amount)
        }));
        res.status(200).json({ success: true, count: mapped.length, payments: mapped });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch payments', error: error.message });
    }
};

// ==========================================
// 2. ADD a supplier payment transaction
// ==========================================
export const addSupplierPayment = async (req, res) => {
    try {
        const {
            category,
            relatedEntity,
            supplierId,
            supplierEmail,
            purchaseOrderRef,
            billRef,
            amount,
            paymentMethod,
            bankAccountId,
            bankAccountName,
            date,
            status,
            notes,
            receiptUrl
        } = req.body;

        const numericAmount = Number(amount);

        if (!category || !relatedEntity || !date || !paymentMethod) {
            return res.status(400).json({ success: false, message: 'category, relatedEntity, paymentMethod and date are required' });
        }

        if (!['cash', 'bank'].includes(paymentMethod)) {
            return res.status(400).json({ success: false, message: 'Payment method must be cash or bank' });
        }

        if (!numericAmount || numericAmount <= 0) {
            return res.status(400).json({ success: false, message: 'Amount must be greater than 0' });
        }

        if (paymentMethod === 'bank') {
            if (!bankAccountId) return res.status(400).json({ success: false, message: 'Bank account required for bank transfer' });
            const bank = await BankAccount.findById(bankAccountId);
            if (!bank) return res.status(404).json({ success: false, message: 'Selected bank account not found' });

            if ((status || 'completed') === 'completed') {
                const balance = await getBankBalance(bankAccountId);
                if (numericAmount > balance) {
                    return res.status(400).json({ success: false, message: `Insufficient bank balance. Available: ${balance}` });
                }
            }
        }

        const payment = await SupplierPaymentTransaction.create({
            type: 'supplier',
            category,
            relatedEntity,
            supplierId: supplierId || null,
            supplierEmail: supplierEmail || '',
            purchaseOrderRef: purchaseOrderRef || '',
            billRef: billRef || '',
            amount: numericAmount,
            paymentMethod,
            bankAccountId: paymentMethod === 'bank' ? bankAccountId : null,
            bankAccountName: paymentMethod === 'bank' ? (bankAccountName || '') : '',
            date,
            status: status || 'completed',
            notes: notes || '',
            receiptUrl: receiptUrl || ''
        });

        // Create Finance Entry for dashboard/ledger
        if ((status || 'completed') === 'completed') {
            await Finance.create({
                transaction_type: paymentMethod === 'cash' ? 'cash_out' : 'bank_withdraw',
                amount: numericAmount,
                description: `Supplier Payment: ${relatedEntity} (${billRef || 'Direct'})`,
                date: date || new Date(),
                notes: notes || "",
                bankAccountId: paymentMethod === "bank" ? bankAccountId : null,
                bankAccountName: paymentMethod === "bank" ? (bankAccountName || "") : ""
            });
        }

        res.status(201).json({ success: true, message: 'Supplier payment recorded and added to finance', payment });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to add payment', error: error.message });
    }
};

// ==========================================
// 3. DELETE a supplier payment
// ==========================================
export const deleteSupplierPayment = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await SupplierPaymentTransaction.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ success: false, message: 'Payment not found' });
        res.status(200).json({ success: true, message: 'Payment deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete payment', error: error.message });
    }
};
// ==========================================
// 4. GET payments for supplier portal (by email)
// ==========================================
export const getSupplierPaymentsByEmail = async (req, res) => {
    try {
        const supplierEmail = req.user.email;
        const payments = await SupplierPaymentTransaction.find({ supplierEmail }).sort({ date: -1 });
        const mapped = payments.map(p => ({
            ...p.toObject(),
            id: p._id,
            amount: parseDecimal(p.amount)
        }));
        res.status(200).json({ success: true, payments: mapped });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch payments', error: error.message });
    }
};

// ==========================================
// 5. GET payment stats (Supplier)
// ==========================================
export const getSupplierPaymentStats = async (req, res) => {
    try {
        const supplierEmail = req.user.email;
        
        const [receivedAmountRes, pendingAmountRes, totalPayments, failedPayments] = await Promise.all([
            SupplierPaymentTransaction.aggregate([
                { $match: { supplierEmail, status: 'completed' } },
                { $group: { _id: null, total: { $sum: { $toDouble: '$amount' } } } }
            ]),
            SupplierPaymentTransaction.aggregate([
                { $match: { supplierEmail, status: 'pending' } },
                { $group: { _id: null, total: { $sum: { $toDouble: '$amount' } } } }
            ]),
            SupplierPaymentTransaction.countDocuments({ supplierEmail }),
            SupplierPaymentTransaction.countDocuments({ supplierEmail, status: 'failed' })
        ]);

        res.json({ 
            success: true, 
            stats: { 
                receivedAmount: receivedAmountRes[0]?.total || 0,
                pendingAmount: pendingAmountRes[0]?.total || 0,
                totalPayments,
                failedPayments
            } 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
