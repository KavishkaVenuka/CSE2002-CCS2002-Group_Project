import express from "express";
import { 
    getOrdersByCustomerId,
    getPendingOrderCountByCustomer,
    getProcessingOrderCountByCustomer,
    getDispatchedOrderCountByCustomer,
    getInTransitOrderCountByCustomer,
    getDeliveredOrderCountByCustomer
} from "../controllers/orderController.js";

const orderRouter = express.Router();

// 1. Table eka load karanna adala orders tika ganna route eka
// Frontend eke axios.get(`.../api/orders/customer/${customID}`) widiyata call karanna
orderRouter.get("/customer/:customerId", getOrdersByCustomerId);

// 2. Stats cards tika sandaha routes
orderRouter.get("/pending-count/:customerId", getPendingOrderCountByCustomer);
orderRouter.get("/processing-count/:customerId", getProcessingOrderCountByCustomer);
orderRouter.get("/dispatched-count/:customerId", getDispatchedOrderCountByCustomer);
orderRouter.get("/in-transit-count/:customerId", getInTransitOrderCountByCustomer);
orderRouter.get("/delivered-count/:customerId", getDeliveredOrderCountByCustomer);

export default orderRouter;