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
    getSupplierQuotationStats
} from "../controllers/supplierQuotation.js";

const supplierQuotationRouter = express.Router();

// Base path: /api/suppliers/quotations
supplierQuotationRouter.post("/", createSupplierQuotation);
supplierQuotationRouter.get("/", getSupplierQuotations);
supplierQuotationRouter.get("/table", getSupplierQuotations); // Frontend expects /table
supplierQuotationRouter.get("/stats", getSupplierQuotationStats); // Frontend expects /stats
supplierQuotationRouter.get("/all", getAllQuotations); // Admin view
supplierQuotationRouter.get("/:id", getSupplierQuotationById);
supplierQuotationRouter.get("/:id/detail", getSupplierQuotationById); // Frontend expects /detail
supplierQuotationRouter.patch("/:id", updateSupplierQuotation);
supplierQuotationRouter.post("/:id/submit", submitDraftQuotation);
supplierQuotationRouter.put("/accept/:id", acceptQuotation); // Admin action
supplierQuotationRouter.put("/reject/:id", rejectQuotation); // Admin action

export default supplierQuotationRouter;
