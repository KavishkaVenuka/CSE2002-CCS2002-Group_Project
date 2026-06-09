import express from "express";
import { getPendingQuotationCount, getPendingQuotations, getAcceptedQuotationsCount, getRejectedQuotationsCount, getExpiredQuotationsCount, getAllQuotations, getAllQuotationsByCustomer, getPendingQuotationsByCustomer, rejectQuotation, acceptQuotation, createSupplierQuotation } from "../controllers/quotationController.js";

const quotationRouter = express.Router();

quotationRouter.get("/all", getAllQuotations);
quotationRouter.get("/pending-count/:email", getPendingQuotationCount);
quotationRouter.get("/pending/:email", getPendingQuotations);
quotationRouter.get("/pending-customer/:email", getPendingQuotationsByCustomer);
quotationRouter.get("/accepted-count", getAcceptedQuotationsCount);
quotationRouter.get("/rejected-count", getRejectedQuotationsCount);
quotationRouter.get("/expired-count", getExpiredQuotationsCount);
quotationRouter.get("/customer/:customerId", getAllQuotationsByCustomer);
quotationRouter.put("/reject/:id", rejectQuotation);
quotationRouter.put("/accept/:id", acceptQuotation);
quotationRouter.post("/create-supplier-quotation", createSupplierQuotation );

export default quotationRouter;