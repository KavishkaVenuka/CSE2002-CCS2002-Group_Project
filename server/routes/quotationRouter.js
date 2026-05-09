import express from "express";
import { getPendingQuotationCount, getPendingQuotations, getAcceptedQuotationsCount, getRejectedQuotationsCount, getExpiredQuotationsCount, getAllquotationsByCustomer, getPendingQuotationsByCustomer, rejectQuotation } from "../controllers/quotationController.js";

const quotationRouter = express.Router();

quotationRouter.get("/pending-count/:email", getPendingQuotationCount);
quotationRouter.get("/pending/:email", getPendingQuotations);
quotationRouter.get("/pending-customer/:email", getPendingQuotationsByCustomer);
quotationRouter.get("/accepted-count", getAcceptedQuotationsCount);
quotationRouter.get("/rejected-count", getRejectedQuotationsCount);
quotationRouter.get("/expired-count", getExpiredQuotationsCount);
quotationRouter.get("/customer/:email", getAllquotationsByCustomer);
quotationRouter.put("/reject/:id", rejectQuotation);

export default quotationRouter;