import express from "express";
import {
    createSupplierRequirement,
    getMySupplierRequirements,
    getSupplierRequirementStats,
    getSupplierRequirementById,
    getAllSuppliersForAdmin,
    getSupplierDashboardStats,
    getRecentSupplierRequirements,
    getRecentSupplierOrders,
    getSupplierPendingPayments
} from "../controllers/supplierRequirementController.js";

import { requireAuth, requireAdmin } from "../middleware/auth.js";

const supplierRequirementRouter = express.Router();

// Base path: /api/suppliers

// Dashboard Routes
supplierRequirementRouter.get("/dashboard/stats", requireAuth, getSupplierDashboardStats);
supplierRequirementRouter.get("/dashboard/recent-requirements", requireAuth, getRecentSupplierRequirements);
supplierRequirementRouter.get("/dashboard/recent-orders", requireAuth, getRecentSupplierOrders);
supplierRequirementRouter.get("/dashboard/pending-payments", requireAuth, getSupplierPendingPayments);

// Match frontend expectations
// GET  /api/suppliers/all
supplierRequirementRouter.get("/all", requireAdmin, getAllSuppliersForAdmin);

// GET  /api/suppliers/supplier-requirements/my
supplierRequirementRouter.get("/supplier-requirements/my", requireAuth, getMySupplierRequirements);

// POST /api/suppliers/supplier-requirements
supplierRequirementRouter.post("/supplier-requirements", requireAdmin, createSupplierRequirement);

// GET  /api/suppliers/requirements/stats
supplierRequirementRouter.get("/requirements/stats", getSupplierRequirementStats);

// GET  /api/suppliers/requirements/:id
supplierRequirementRouter.get("/requirements/:id", getSupplierRequirementById);

export default supplierRequirementRouter;