import express from "express";
import { createProduct, deleteProduct, getAllProducts, getProductByID, updateProduct } from "../controllers/productController.js";
import { requireAdmin } from "../middleware/auth.js";

const productRouter = express.Router();

productRouter.get("/", getAllProducts);

productRouter.get("/trending", (req, res) => {
    res.json({ message: "trending products endpoint" });
});

// Protect create/update/delete routes for admins only
productRouter.post("/", requireAdmin, createProduct);

productRouter.get("/:productID", getProductByID);

productRouter.delete("/:productID", requireAdmin, deleteProduct);

productRouter.put("/:productID", requireAdmin, updateProduct);

export default productRouter;