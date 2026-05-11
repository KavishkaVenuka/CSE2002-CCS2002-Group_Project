import Order from "../models/Order.js";

// 1. GET: Customer kenekta adala orders tika pamanak ganna (Table eka sandaha)
export const getOrdersByCustomerId = async (req, res) => {
    try {
        const { customerId } = req.params;
        // customerId eka anuwa filter kara aluthma order eka udaata ena se sort kirima
        const orders = await Order.find({ customerId: customerId }).sort({ date: -1 });

        // Frontend eke interface ekata galapena widiyata map kirima
        const mappedOrders = orders.map(o => ({
            _id: o._id,
            orderID: o.orderID,
            quotationRef: o.quotationRef || null,
            orderDate: o.date,
            totalAmount: o.total || o.totalCost,
            totalItems: o.items?.length || 0,
            status: o.status.toLowerCase(),
            customerID: o.customerId
        }));

        res.status(200).json(mappedOrders);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// 2. GET: Pending Count
export const getPendingOrderCountByCustomer = async (req, res) => {
    try {
        const { customerId } = req.params;
        const count = await Order.countDocuments({ customerId, status: "pending" });
        res.status(200).json({ count });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 3. GET: Processing Count
export const getProcessingOrderCountByCustomer = async (req, res) => {
    try {
        const { customerId } = req.params;
        const count = await Order.countDocuments({ customerId, status: "processing" });
        res.status(200).json({ count });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 4. GET: Dispatched Count
export const getDispatchedOrderCountByCustomer = async (req, res) => {
    try {
        const { customerId } = req.params;
        const count = await Order.countDocuments({ customerId, status: "dispatched" });
        res.status(200).json({ count });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 5. GET: In-Transit Count
export const getInTransitOrderCountByCustomer = async (req, res) => {
    try {
        const { customerId } = req.params;
        const count = await Order.countDocuments({ customerId, status: "in-transit" });
        res.status(200).json({ count });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 6. GET: Delivered Count
export const getDeliveredOrderCountByCustomer = async (req, res) => {
    try {
        const { customerId } = req.params;
        const count = await Order.countDocuments({ customerId, status: "delivered" });
        res.status(200).json({ count });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};