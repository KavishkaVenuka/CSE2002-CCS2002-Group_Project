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
    createOrder
} from "../controllers/orderController.js";

const orderRouter = express.Router();

// 1. Table eka load karanna adala orders tika ganna route eka
// Frontend eke axios.get(`.../api/orders/customer/${customID}`) widiyata call karanna
orderRouter.get("/customer/:customerId", getOrdersByCustomerId);
orderRouter.get("/", getAllOrders); 
orderRouter.post("/", createOrder);

// New routes for updating order
orderRouter.put("/:id/status", updateOrderStatus);
orderRouter.put("/:id/issue-items", issueOrderItems);
orderRouter.put("/confirm-delivery/:id", confirmOrderDelivery);
orderRouter.put("/restock-rejected/:id", restockRejectedItems);

// Purchase Order Routes for Admin
orderRouter.get("/purchase-orders", getAllPurchaseOrders);
orderRouter.put("/purchase-orders/:id/status", updatePurchaseOrderStatus);

// 2. Stats cards tika sandaha routes
orderRouter.get("/pending-count/:customerId", getPendingOrderCountByCustomer);
orderRouter.get("/processing-count/:customerId", getProcessingOrderCountByCustomer);
orderRouter.get("/dispatched-count/:customerId", getDispatchedOrderCountByCustomer);
orderRouter.get("/in-transit-count/:customerId", getInTransitOrderCountByCustomer);
orderRouter.get("/delivered-count/:customerId", getDeliveredOrderCountByCustomer);

export default orderRouter;