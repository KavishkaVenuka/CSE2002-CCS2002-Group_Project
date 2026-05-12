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

const supplierOrderRouter = express.Router();

// Base path: /api/supplier-orders

// Admin routes
supplierOrderRouter.get('/', getAllSupplierOrders);
supplierOrderRouter.put('/:id/status', updateSupplierOrderStatus);
supplierOrderRouter.put('/:id/dispatch', dispatchSupplierOrder);
supplierOrderRouter.put('/:id/confirm-delivery', confirmSupplierDelivery);
supplierOrderRouter.post('/:orderId/create-invoice', createSupplierInvoice);

// Admin invoice management
supplierOrderRouter.get('/invoices', getAllSupplierInvoices);
supplierOrderRouter.put('/invoices/:id/accept', acceptSupplierPayment);
supplierOrderRouter.put('/invoices/:id/reject', rejectSupplierPayment);

// Supplier portal routes (auth required - uses req.user)
supplierOrderRouter.get('/my-orders', getOrdersBySupplierEmail);
supplierOrderRouter.get('/my-invoices', getInvoicesBySupplierEmail);
supplierOrderRouter.get('/my-pending-count', getPendingOrderCount);
supplierOrderRouter.get('/my-active-count', getActiveOrderCount);
supplierOrderRouter.get('/my-delivered-count', getDeliveredOrderCount);
supplierOrderRouter.get('/my-stats', getSupplierOrderStats);
supplierOrderRouter.get('/dispatch-list', getDispatchableOrders);
supplierOrderRouter.get('/:id/delivery-progress', getDeliveryProgress);
supplierOrderRouter.get('/invoiceable-orders', getInvoiceableOrders);
supplierOrderRouter.get('/:id', getSupplierOrderById);
supplierOrderRouter.patch('/:id/acknowledge', acknowledgeSupplierOrder);

// Admin lookup by supplierId
supplierOrderRouter.get('/supplier/:supplierId', getOrdersBySupplierId);

export default supplierOrderRouter;