import express from "express";

// Auth, profile, dashboard stay in supplierController
import {
    createSupplier,
    loginSupplier,
    getAllSuppliers,
    getSupplierProfile,
    updateSupplierProfile,
    getDashboardStats,
    getDashboardRecentRequirements,
    getDashboardRecentOrders,
    getDashboardPendingPayments,
} from "../controllers/supplierController.js";

// Requirements
import {
    getAllRequirements,
    getRequirementById,
    getRequirementStats,
} from "../controllers/requirementController.js";

// Quotations
import {
    createSupplierQuotation,
    getSupplierQuotations,
    getSupplierQuotationById,
    updateSupplierQuotation,
    submitDraftQuotation,
    getSupplierQuotationStats,
    getSupplierQuotationsTable,
    getSupplierQuotationDetail,
} from "../controllers/quotationController.js";

// Orders
import {
    getSupplierOrders,
    getSupplierOrderById,
    updateSupplierOrderStatus,
    getSupplierOrderStats,
    getSupplierOrdersTable,
    acknowledgeSupplierOrder,
    getDispatchOrderList,
    getDeliveryProgress,
    dispatchSupplierOrder,
} from "../controllers/orderController.js";

// Invoices
import {
    createSupplierInvoice,
    getSupplierInvoices,
    getSupplierInvoiceById,
    getInvoiceableOrders,
} from "../controllers/invoiceController.js";

// Payments
import {
    getSupplierPayments,
    getSupplierPaymentStats,
    getSupplierPaymentsTable,
} from "../controllers/paymentTransactionController.js";

import { verifyToken, requireAuth } from "../middleware/auth.js";

const supplierRouter = express.Router();

// ── Auth (Public) ─────────────────────────────────────────────
supplierRouter.post("/register", createSupplier);
supplierRouter.post("/login",    loginSupplier);

// ── Profile ───────────────────────────────────────────────────
supplierRouter.get("/profile", verifyToken, requireAuth, getSupplierProfile);
supplierRouter.put("/profile", verifyToken, requireAuth, updateSupplierProfile);

// ── Admin ─────────────────────────────────────────────────────
supplierRouter.get("/all", verifyToken, requireAuth, getAllSuppliers);

// ── Dashboard ─────────────────────────────────────────────────
supplierRouter.get("/dashboard/stats",               verifyToken, requireAuth, getDashboardStats);
supplierRouter.get("/dashboard/recent-requirements", verifyToken, requireAuth, getDashboardRecentRequirements);
supplierRouter.get("/dashboard/recent-orders",       verifyToken, requireAuth, getDashboardRecentOrders);
supplierRouter.get("/dashboard/pending-payments",    verifyToken, requireAuth, getDashboardPendingPayments);

// ── Requirements ──────────────────────────────────────────────
supplierRouter.get("/requirements/stats", verifyToken, requireAuth, getRequirementStats);
supplierRouter.get("/requirements",       verifyToken, requireAuth, getAllRequirements);
supplierRouter.get("/requirements/:id",   verifyToken, requireAuth, getRequirementById);

// ── Quotations ────────────────────────────────────────────────
supplierRouter.get("/quotations/stats",         verifyToken, requireAuth, getSupplierQuotationStats);
supplierRouter.get("/quotations/table",         verifyToken, requireAuth, getSupplierQuotationsTable);
supplierRouter.post("/quotations",              verifyToken, requireAuth, createSupplierQuotation);
supplierRouter.get("/quotations",               verifyToken, requireAuth, getSupplierQuotations);
supplierRouter.get("/quotations/:id",           verifyToken, requireAuth, getSupplierQuotationById);
supplierRouter.get("/quotations/:id/detail",    verifyToken, requireAuth, getSupplierQuotationDetail);
supplierRouter.put("/quotations/:id",           verifyToken, requireAuth, updateSupplierQuotation);
supplierRouter.patch("/quotations/:id/submit",  verifyToken, requireAuth, submitDraftQuotation);          

// ── Purchase Orders ───────────────────────────────────────────
supplierRouter.get("/orders/stats",                 verifyToken, requireAuth, getSupplierOrderStats);
supplierRouter.get("/orders/all",                   verifyToken, requireAuth, getSupplierOrdersTable);
supplierRouter.get("/orders/dispatch-list",         verifyToken, requireAuth, getDispatchOrderList);
supplierRouter.get("/orders",                       verifyToken, requireAuth, getSupplierOrders);
supplierRouter.get("/orders/:id",                   verifyToken, requireAuth, getSupplierOrderById);
supplierRouter.put("/orders/:id/status",            verifyToken, requireAuth, updateSupplierOrderStatus);
supplierRouter.patch("/orders/:id/acknowledge",     verifyToken, requireAuth, acknowledgeSupplierOrder);
supplierRouter.get("/orders/:id/delivery-progress", verifyToken, requireAuth, getDeliveryProgress);
supplierRouter.post("/orders/:id/dispatch",         verifyToken, requireAuth, dispatchSupplierOrder);

// ── Invoices ──────────────────────────────────────────────────
supplierRouter.get("/invoices/invoiceable-orders", verifyToken, requireAuth, getInvoiceableOrders);
supplierRouter.post("/invoices",                   verifyToken, requireAuth, createSupplierInvoice);
supplierRouter.get("/invoices",                    verifyToken, requireAuth, getSupplierInvoices);
supplierRouter.get("/invoices/:id",                verifyToken, requireAuth, getSupplierInvoiceById);


// ── Payments ──────────────────────────────────────────────────
supplierRouter.get("/payments/stats",  verifyToken, requireAuth, getSupplierPaymentStats);
supplierRouter.get("/payments/all",    verifyToken, requireAuth, getSupplierPaymentsTable);
supplierRouter.get("/payments",        verifyToken, requireAuth, getSupplierPayments);

export default supplierRouter;