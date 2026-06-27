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
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const supplierInvoiceRouter = express.Router();

// Base path: /api/supplier-invoices

// ── Admin-only routes ──────────────────────────────────────────────────────
supplierInvoiceRouter.get('/',                       requireAuth, requireAdmin, getAllSupplierInvoices);
supplierInvoiceRouter.put('/accept-payment/:id',     requireAuth, requireAdmin, acceptSupplierPayment);
supplierInvoiceRouter.put('/reject-payment/:id',     requireAuth, requireAdmin, rejectSupplierPayment);

// ── Supplier portal routes (uses req.user.email) ───────────────────────────
supplierInvoiceRouter.get('/my',          requireAuth, getInvoicesBySupplierEmail);
supplierInvoiceRouter.get('/all',         requireAuth, getInvoicesBySupplierEmail);
supplierInvoiceRouter.get('/stats',       requireAuth, getSupplierInvoiceStats);
supplierInvoiceRouter.post('/',           requireAuth, createSupplierInvoiceBySupplier);

// ── Per-email counts (used by admin views) ─────────────────────────────────
supplierInvoiceRouter.get('/paid-count/:email',   requireAuth, requireAdmin, getPaidInvoiceCount);
supplierInvoiceRouter.get('/unpaid-count/:email', requireAuth, requireAdmin, getUnpaidInvoiceCount);
supplierInvoiceRouter.get('/overdue-count/:email',requireAuth, requireAdmin, getOverdueInvoiceCount);

// ── Payment proof submission ───────────────────────────────────────────────
supplierInvoiceRouter.post(
    '/:invoiceID/payment',
    requireAuth,
    uploadPaymentProof.single('paymentProof'),
    submitSupplierPaymentProof
);

export default supplierInvoiceRouter;
