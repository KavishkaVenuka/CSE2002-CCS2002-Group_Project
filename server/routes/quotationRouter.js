import express from "express";
import {
  getPendingQuotationCount,
  getPendingQuotations,
  getAcceptedQuotationsCount,
  getRejectedQuotationsCount,
  getExpiredQuotationsCount,
  getAllQuotations,
  getAllQuotationsByCustomer,
  getPendingQuotationsByCustomer,
  rejectQuotation,
  acceptQuotation,
  createSupplierQuotation,
} from "../controllers/quotationController.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const quotationRouter = express.Router();

// Base path: /api/quotations

// ── Customer-facing routes ─────────────────────────────────────────────────
quotationRouter.get("/customer/:customerId",       requireAuth, getAllQuotationsByCustomer);
quotationRouter.get("/pending/:email",             requireAuth, getPendingQuotations);
quotationRouter.get("/pending-count/:email",       requireAuth, getPendingQuotationCount);
quotationRouter.get("/pending-customer/:email",    requireAuth, getPendingQuotationsByCustomer);

// ── Admin-only routes ──────────────────────────────────────────────────────
quotationRouter.get("/all",                        requireAuth, requireAdmin, getAllQuotations);
quotationRouter.get("/accepted-count",             requireAuth, requireAdmin, getAcceptedQuotationsCount);
quotationRouter.get("/rejected-count",             requireAuth, requireAdmin, getRejectedQuotationsCount);
quotationRouter.get("/expired-count",              requireAuth, requireAdmin, getExpiredQuotationsCount);
quotationRouter.put("/reject/:id",                 requireAuth, requireAdmin, rejectQuotation);
quotationRouter.put("/accept/:id",                 requireAuth, requireAdmin, acceptQuotation);
quotationRouter.post("/create-supplier-quotation", requireAuth, requireAdmin, createSupplierQuotation);

export default quotationRouter;