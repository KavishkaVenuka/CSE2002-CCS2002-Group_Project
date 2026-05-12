import express from 'express';
import {
    getSupplierPayments,
    addSupplierPayment,
    deleteSupplierPayment,
    getSupplierPaymentsByEmail,
    getSupplierPaymentStats
} from '../controllers/supplierpaymentTransactionController.js';
import { requireAuth } from '../middleware/auth.js';

const supplierPaymentTransactionRouter = express.Router();

// Base path: /api/supplier-payments

supplierPaymentTransactionRouter.get('/', requireAuth, getSupplierPayments);
supplierPaymentTransactionRouter.get('/all', requireAuth, getSupplierPaymentsByEmail); // Frontend expects /all
supplierPaymentTransactionRouter.get('/stats', requireAuth, getSupplierPaymentStats); // Frontend expects /stats
supplierPaymentTransactionRouter.post('/', requireAuth, addSupplierPayment);
supplierPaymentTransactionRouter.delete('/:id', requireAuth, deleteSupplierPayment);

export default supplierPaymentTransactionRouter;