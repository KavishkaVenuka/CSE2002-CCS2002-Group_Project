import express from "express";
import {
  createSupplierQuotation,
  getSupplierQuotations,
  getSupplierQuotationById,
  updateSupplierQuotation,
  submitDraftQuotation,
  getAllQuotations,
  acceptQuotation,
  rejectQuotation,
  getSupplierQuotationStats,
} from "../controllers/supplierQuotation.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const supplierQuotationRouter = express.Router();

// Base path: /api/suppliers/quotations

// ── Supplier-facing routes ─────────────────────────────────────────────────
supplierQuotationRouter.post("/",           requireAuth, createSupplierQuotation);
supplierQuotationRouter.get("/",            requireAuth, getSupplierQuotations);
supplierQuotationRouter.get("/table",       requireAuth, getSupplierQuotations);
supplierQuotationRouter.get("/stats",       requireAuth, getSupplierQuotationStats);
supplierQuotationRouter.get("/:id",         requireAuth, getSupplierQuotationById);
supplierQuotationRouter.get("/:id/detail",  requireAuth, getSupplierQuotationById);
supplierQuotationRouter.patch("/:id",       requireAuth, updateSupplierQuotation);
supplierQuotationRouter.post("/:id/submit", requireAuth, submitDraftQuotation);

// ── Admin-only routes ──────────────────────────────────────────────────────
supplierQuotationRouter.get("/all",          requireAuth, requireAdmin, getAllQuotations);
supplierQuotationRouter.put("/accept/:id",   requireAuth, requireAdmin, acceptQuotation);
supplierQuotationRouter.put("/reject/:id",   requireAuth, requireAdmin, rejectQuotation);

export default supplierQuotationRouter;
