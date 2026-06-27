import express from "express";
import {
  getOrdersByCustomerId,
  getPendingOrderCountByCustomer,
  getProcessingOrderCountByCustomer,
  getDispatchedOrderCountByCustomer,
  getInTransitOrderCountByCustomer,
  getDeliveredOrderCountByCustomer,
  getAllOrders,
  updateOrderStatus,
  issueOrderItems,
  confirmOrderDelivery,
  restockRejectedItems,
  getAllPurchaseOrders,
  updatePurchaseOrderStatus,
  createOrder,
} from "../controllers/orderController.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const orderRouter = express.Router();

// Base path: /api/orders

// ── Customer routes ────────────────────────────────────────────────────────
// Customers can only view their own orders; the controller further scopes by ID.
orderRouter.get("/customer/:customerId", requireAuth, getOrdersByCustomerId);
orderRouter.post("/", requireAuth, createOrder);
orderRouter.put("/confirm-delivery/:id", requireAuth, confirmOrderDelivery);

// ── Per-customer stat counts ───────────────────────────────────────────────
orderRouter.get("/pending-count/:customerId",    requireAuth, getPendingOrderCountByCustomer);
orderRouter.get("/processing-count/:customerId", requireAuth, getProcessingOrderCountByCustomer);
orderRouter.get("/dispatched-count/:customerId", requireAuth, getDispatchedOrderCountByCustomer);
orderRouter.get("/in-transit-count/:customerId", requireAuth, getInTransitOrderCountByCustomer);
orderRouter.get("/delivered-count/:customerId",  requireAuth, getDeliveredOrderCountByCustomer);

// ── Admin-only routes ──────────────────────────────────────────────────────
orderRouter.get("/",                        requireAuth, requireAdmin, getAllOrders);
orderRouter.put("/:id/status",              requireAuth, requireAdmin, updateOrderStatus);
orderRouter.put("/:id/issue-items",         requireAuth, requireAdmin, issueOrderItems);
orderRouter.put("/restock-rejected/:id",    requireAuth, requireAdmin, restockRejectedItems);
orderRouter.get("/purchase-orders",         requireAuth, requireAdmin, getAllPurchaseOrders);
orderRouter.put("/purchase-orders/:id/status", requireAuth, requireAdmin, updatePurchaseOrderStatus);

export default orderRouter;