import express from "express";
import { uploadDeliveryProof } from "../middleware/uploadMiddleware.js";
import { uploadDeliveryProof, createOrder, getOrders, updateOrder, getActiveOrderCount, getRecentOrders, getPendingOrderCountByCustomer, getProcessingOrderCountByCustomer, getDispatchedOrderCountByCustomer, getInTransitOrderCountByCustomer, getDeliveredOrderCountByCustomer, getPendingOrdersByCustomer, getProcessingOrdersByCustomer, getDispatchedOrdersByCustomer, getInTransitOrdersByCustomer, getDeliveredOrdersByCustomer } from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/", createOrder);
orderRouter.get("/", getOrders);
orderRouter.get("/active-count", getActiveOrderCount);
orderRouter.put("/:orderID", updateOrder);
orderRouter.get("/recent", getRecentOrders);
orderRouter.get("/pending-count/:email", getPendingOrderCountByCustomer);
orderRouter.get("/processing-count/:email", getProcessingOrderCountByCustomer);
orderRouter.get("/dispatched-count/:email", getDispatchedOrderCountByCustomer);
orderRouter.get("/in-transit-count/:email", getInTransitOrderCountByCustomer);
orderRouter.get("/delivered-count/:email", getDeliveredOrderCountByCustomer);
orderRouter.get("/pending/:email", getPendingOrdersByCustomer);
orderRouter.get("/processing/:email", getProcessingOrdersByCustomer);
orderRouter.get("/dispatched/:email", getDispatchedOrdersByCustomer);
orderRouter.get("/in-transit/:email", getInTransitOrderByCustomer);

export default orderRouter;