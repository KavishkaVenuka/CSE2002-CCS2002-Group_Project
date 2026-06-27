import express from 'express';
import {
    getAllSupplierOrders,
    getOrdersBySupplierId,
    getOrdersBySupplierEmail,
    updateSupplierOrderStatus,
    dispatchSupplierOrder,
    confirmSupplierDelivery,
    createSupplierInvoice,
    getAllSupplierInvoices,
    acceptSupplierPayment,
    rejectSupplierPayment,
    getInvoicesBySupplierEmail,
    getPendingOrderCount,
    getActiveOrderCount,
    getDeliveredOrderCount,
    getSupplierOrderStats,
    getDispatchableOrders,
    getDeliveryProgress,
    getInvoiceableOrders,
    getSupplierOrderById,
    acknowledgeSupplierOrder
} from '../controllers/supplierOrderController.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const supplierOrderRouter = express.Router();

// Base path: /api/supplier-orders

// ── Admin-only routes ──────────────────────────────────────────────────────
supplierOrderRouter.get('/',                              requireAuth, requireAdmin, getAllSupplierOrders);
supplierOrderRouter.put('/:id/status',                   requireAuth, requireAdmin, updateSupplierOrderStatus);
supplierOrderRouter.post('/:orderId/create-invoice',     requireAuth, requireAdmin, createSupplierInvoice);

// Admin invoice management
supplierOrderRouter.get('/invoices',                     requireAuth, requireAdmin, getAllSupplierInvoices);
supplierOrderRouter.put('/invoices/:id/accept',          requireAuth, requireAdmin, acceptSupplierPayment);
supplierOrderRouter.put('/invoices/:id/reject',          requireAuth, requireAdmin, rejectSupplierPayment);

// Admin lookup by supplierId
supplierOrderRouter.get('/supplier/:supplierId',         requireAuth, requireAdmin, getOrdersBySupplierId);

// ── Supplier portal routes (uses req.user) ─────────────────────────────────
supplierOrderRouter.get('/my-orders',                    requireAuth, getOrdersBySupplierEmail);
supplierOrderRouter.get('/my-invoices',                  requireAuth, getInvoicesBySupplierEmail);
supplierOrderRouter.get('/my-pending-count',             requireAuth, getPendingOrderCount);
supplierOrderRouter.get('/my-active-count',              requireAuth, getActiveOrderCount);
supplierOrderRouter.get('/my-delivered-count',           requireAuth, getDeliveredOrderCount);
supplierOrderRouter.get('/my-stats',                     requireAuth, getSupplierOrderStats);
supplierOrderRouter.get('/dispatch-list',                requireAuth, getDispatchableOrders);
supplierOrderRouter.get('/invoiceable-orders',           requireAuth, getInvoiceableOrders);
supplierOrderRouter.put('/:id/dispatch',                 requireAuth, dispatchSupplierOrder);
supplierOrderRouter.put('/:id/confirm-delivery',         requireAuth, confirmSupplierDelivery);
supplierOrderRouter.get('/:id/delivery-progress',        requireAuth, getDeliveryProgress);
supplierOrderRouter.get('/:id',                          requireAuth, getSupplierOrderById);
supplierOrderRouter.patch('/:id/acknowledge',            requireAuth, acknowledgeSupplierOrder);

export default supplierOrderRouter;