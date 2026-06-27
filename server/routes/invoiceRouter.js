import express from "express";
import {
  getPaidInvoiceCountByCustomer,
  getUnpaidInvoiceCountByCustomer,
  getOverDueInvoiceCountByCustomer,
  getInvoicesByCustomer,
  createPaymentForInvoice,
} from "../controllers/invoiceController.js";
import { uploadPaymentProof } from "../middleware/uploadMiddleware.js";
import { requireAuth } from "../middleware/auth.js";

const invoiceRouter = express.Router();

// Base path: /api/invoices
// All invoice data is sensitive — requires a valid authenticated session.
invoiceRouter.get("/paid-count/:email",   requireAuth, getPaidInvoiceCountByCustomer);
invoiceRouter.get("/unpaid-count/:email", requireAuth, getUnpaidInvoiceCountByCustomer);
invoiceRouter.get("/overdue-count/:email",requireAuth, getOverDueInvoiceCountByCustomer);
invoiceRouter.get("/customer/:email",     requireAuth, getInvoicesByCustomer);
invoiceRouter.post(
  "/:invoiceID/payment",
  requireAuth,
  uploadPaymentProof.single("paymentProof"),
  createPaymentForInvoice
);

export default invoiceRouter;