import express from "express";
import {
  addProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/stockController.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const stockRouter = express.Router();

// Base path: /api/stocks
// Stock reads are needed by Customers (to browse available items) — requireAuth only.
// Writes (add / update / delete) are Admin-only operations.
stockRouter.get("/getItems",        requireAuth, getAllProducts);
stockRouter.get("/getItems/:id",    requireAuth, getProductById);
stockRouter.post("/addItem",        requireAuth, requireAdmin, addProduct);
stockRouter.put("/updateItem/:id",  requireAuth, requireAdmin, updateProduct);
stockRouter.delete("/deleteItem/:id", requireAuth, requireAdmin, deleteProduct);

export default stockRouter;