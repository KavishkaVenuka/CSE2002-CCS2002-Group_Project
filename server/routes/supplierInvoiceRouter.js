import express from 'express';
import {
    getAllSupplierInvoices,
    getInvoicesBySupplierEmail,
    getPaidInvoiceCount,
    getUnpaidInvoiceCount,
    getOverdueInvoiceCount,
    acceptSupplierPayment,
    rejectSupplierPayment,
    submitSupplierPaymentProof,
    createSupplierInvoiceBySupplier,
    getSupplierInvoiceStats
} from '../controllers/supplierInvoiceController.js';
import { uploadPaymentProof } from '../middleware/uploadMiddleware.js';
import { requireAuth } from '../middleware/auth.js';

const supplierInvoiceRouter = express.Router();

// Base path: /api/supplier-invoices

// Admin routes
supplierInvoiceRouter.get('/', getAllSupplierInvoices);
supplierInvoiceRouter.put('/accept-payment/:id', acceptSupplierPayment);
supplierInvoiceRouter.put('/reject-payment/:id', rejectSupplierPayment);

// Supplier portal routes (uses req.user.email)
supplierInvoiceRouter.get('/my', requireAuth, getInvoicesBySupplierEmail);
supplierInvoiceRouter.get('/all', requireAuth, getInvoicesBySupplierEmail); // Frontend expects /all
supplierInvoiceRouter.get('/stats', requireAuth, getSupplierInvoiceStats); // Frontend expects /stats
supplierInvoiceRouter.post('/', requireAuth, createSupplierInvoiceBySupplier); // Frontend expects POST /
supplierInvoiceRouter.get('/paid-count/:email', getPaidInvoiceCount);
supplierInvoiceRouter.get('/unpaid-count/:email', getUnpaidInvoiceCount);
supplierInvoiceRouter.get('/overdue-count/:email', getOverdueInvoiceCount);
supplierInvoiceRouter.post('/:invoiceID/payment', uploadPaymentProof.single('paymentProof'), submitSupplierPaymentProof);

export default supplierInvoiceRouter;
