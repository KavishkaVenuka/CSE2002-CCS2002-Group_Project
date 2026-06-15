import mongoose from "mongoose";
import Order from "../models/Order.js";
import StockItem from "../models/Stock.js";
import Quotation from "../models/Quotation.js";
import User from "../models/User.js";

// Helper to resolve all query conditions for a given customer identifier
const resolveCustomerConditions = async (customerId) => {
    let user = null;
    if (mongoose.Types.ObjectId.isValid(customerId)) {
        user = await User.findById(customerId);
    }
    if (!user) {
        user = await User.findOne({
            $or: [
                { customID: customerId },
                { email: customerId }
            ]
        });
    }

    let queryConditions = [];
    
    if (user) {
        const userObjectId = user._id;
        const userStringId = user._id.toString();
        const userCustomId = user.customID;
        const userEmail = user.email;

        queryConditions.push({ customerId: userObjectId });
        queryConditions.push({ customerId: userStringId });
        if (userCustomId) {
            queryConditions.push({ customerId: userCustomId });
        }
        if (userEmail) {
            queryConditions.push({ email: userEmail });
        }
    } else {
        // Fallback if no user is found in the database
        if (mongoose.Types.ObjectId.isValid(customerId)) {
            queryConditions.push({ customerId: customerId });
            queryConditions.push({ customerId: new mongoose.Types.ObjectId(customerId) });
        } else {
            queryConditions.push({ customerId: customerId });
            queryConditions.push({ email: customerId });
        }
    }
    return queryConditions;
};

// 1. GET: Customer kenekta adala orders tika pamanak ganna (Table eka sandaha)
export const getOrdersByCustomerId = async (req, res) => {
    try {
        const { customerId } = req.params;
        const queryConditions = await resolveCustomerConditions(customerId);
        const orders = await Order.collection.find({ $or: queryConditions }).sort({ date: -1 }).toArray();

        // Frontend eke interface ekata galapena widiyata map kirima
        const mappedOrders = orders.map(o => ({
            _id: o._id,
            orderID: o.orderID,
            email: o.email,
            quotationRef: o.quotationRef || null,
            orderDate: o.date,
            totalAmount: o.total || o.totalCost,
            totalItems: o.items?.length || 0,
            status: o.status.toLowerCase(),
            customerID: o.customerId,
            items: o.items, // Include items for tracking
            invoiced: o.invoiced || false,
            statusDates: o.statusDates
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
        const queryConditions = await resolveCustomerConditions(customerId);
        const count = await Order.collection.countDocuments({
            $or: queryConditions,
            status: { $regex: /^pending$/i }
        });
        res.status(200).json({ count });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 3. GET: Processing Count
export const getProcessingOrderCountByCustomer = async (req, res) => {
    try {
        const { customerId } = req.params;
        const queryConditions = await resolveCustomerConditions(customerId);
        const count = await Order.collection.countDocuments({
            $or: queryConditions,
            status: { $regex: /^processing$/i }
        });
        res.status(200).json({ count });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 4. GET: Dispatched Count
export const getDispatchedOrderCountByCustomer = async (req, res) => {
    try {
        const { customerId } = req.params;
        const queryConditions = await resolveCustomerConditions(customerId);
        const count = await Order.collection.countDocuments({
            $or: queryConditions,
            status: { $regex: /^dispatched$/i }
        });
        res.status(200).json({ count });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 5. GET: In-Transit Count
export const getInTransitOrderCountByCustomer = async (req, res) => {
    try {
        const { customerId } = req.params;
        const queryConditions = await resolveCustomerConditions(customerId);
        const count = await Order.collection.countDocuments({
            $or: queryConditions,
            status: { $regex: /^in-transit$/i }
        });
        res.status(200).json({ count });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 6. GET: Delivered Count
export const getDeliveredOrderCountByCustomer = async (req, res) => {
    try {
        const { customerId } = req.params;
        const queryConditions = await resolveCustomerConditions(customerId);
        const count = await Order.collection.countDocuments({
            $or: queryConditions,
            status: { $regex: /^delivered$/i }
        });
        res.status(200).json({ count });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all orders for Admin
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().sort({ date: -1 });
        
        const mappedOrders = orders.map(o => ({
            id: o.orderID,
            customer: o.name || "Customer",
            email: o.email,
            phonenumber: o.phonenumber,
            address: o.address,
            quotationRef: o.quotationRef || "N/A",
            orderDate: o.date,
            totalItems: o.items?.length || 0,
            totalAmount: o.total || o.totalCost || 0,
            status: o.status.toLowerCase(),
            items: o.items, // Include items for detail view
            _id: o._id
        }));

        res.status(200).json(mappedOrders);
    } catch (error) {
        res.status(500).json({ message: "Orders ලබා ගැනීමට නොහැකි විය", error: error.message });
    }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            { status: status },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: "Error updating status", error: error.message });
    }
};

// Issue items from an order
export const issueOrderItems = async (req, res) => {
    try {
        const { id } = req.params;
        const { issuedItems } = req.body; // Array of { productID, quantityToIssue }

        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Update issuedQuantity for each item
        issuedItems.forEach(issuedItem => {
            const item = order.items.find(i => i.productID === issuedItem.productID);
            if (item) {
                item.issuedQuantity = (item.issuedQuantity || 0) + issuedItem.quantityToIssue;
                // Cap at ordered quantity
                if (item.issuedQuantity > item.quantity) {
                    item.issuedQuantity = item.quantity;
                }
            }
        });

        // Check if all items are fully issued
        const allIssued = order.items.every(item => (item.issuedQuantity || 0) >= item.quantity);
        if (allIssued) {
            order.status = "dispatched"; 
            order.statusDates.dispatchedDate = new Date();
        } else {
            order.status = "partially-issued";
        }

        await order.save({ validateBeforeSave: false });
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: "Error issuing items", error: error.message });
    }
};
// Confirm delivery by customer
export const confirmOrderDelivery = async (req, res) => {
    try {
        const { id } = req.params;
        const { receivedItems } = req.body; // Array of { productID, receivedQuantity }

        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        receivedItems.forEach(recItem => {
            const item = order.items.find(i => i.productID === recItem.productID);
            if (item) {
                item.receivedQuantity = recItem.receivedQuantity;
                item.rejectedQuantity = (item.issuedQuantity || 0) - recItem.receivedQuantity;
                if (item.rejectedQuantity < 0) item.rejectedQuantity = 0;
            }
        });

        order.status = "delivered";
        order.statusDates.deliveredDate = new Date();
        await order.save({ validateBeforeSave: false });
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: "Error confirming delivery", error: error.message });
    }
};

// Restock rejected items by admin
export const restockRejectedItems = async (req, res) => {
    try {
        const { id } = req.params;
        const { productID } = req.body;

        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        const item = order.items.find(i => i.productID === productID);
        if (!item || item.rejectedQuantity <= 0 || item.restocked) {
            return res.status(400).json({ message: "Item not found or already restocked" });
        }

        // Increase stock - try finding by ID first, then by name as fallback
        let stock = null;
        try {
            if (mongoose.Types.ObjectId.isValid(item.productID)) {
                stock = await StockItem.findById(item.productID);
            }
        } catch (e) {
            console.log("Restock: ID lookup failed, trying name...");
        }

        if (!stock) {
            stock = await StockItem.findOne({ item_name: item.name });
        }

        if (stock) {
            stock.quantity += item.rejectedQuantity;
            await stock.save();
            console.log(`Restocked ${item.rejectedQuantity} of ${item.name}`);
        } else {
            console.warn(`Could not find stock item for ${item.name} to restock.`);
            // We still mark as restocked in the order to avoid duplicate attempts
            // but you might want to return an error if stock must be updated.
        }

        item.restocked = true;
        await order.save({ validateBeforeSave: false });

        res.status(200).json({ message: "Item restocked successfully", order });
    } catch (error) {
        res.status(500).json({ message: "Error restocking item", error: error.message });
    }
};

// Create a new order (called by Customer when accepting a quotation)
export const createOrder = async (req, res) => {
    try {
        const { 
            name, 
            customerId, 
            address, 
            phonenumber, 
            notes, 
            items, 
            quotationId,
            email 
        } = req.body;

        console.log("Creating Order with payload:", { name, customerId, quotationId });

        if (!items || items.length === 0) {
            return res.status(400).json({ message: "Items are required to create an order" });
        }

        // Calculate total
        const total = items.reduce((sum, item) => sum + (Number(item.price) * Number(item.quantity)), 0);

        // Fetch Quotation to get the source email if not provided
        let customerEmail = email || req.user?.email;
        
        if (!customerEmail && quotationId) {
            const quotation = await Quotation.findById(quotationId);
            if (quotation) {
                customerEmail = quotation.email;
            }
        }

        if (!customerEmail) {
            return res.status(400).json({ message: "Customer email is required" });
        }
        
        // Generate unique Order ID
        const orderCount = await Order.countDocuments();
        const orderID = `ORD-${Date.now()}-${String(orderCount + 1).padStart(3, '0')}`;

        const newOrder = new Order({
            orderID,
            customerId: customerId || req.user?.id,
            email: customerEmail,
            name,
            address,
            phonenumber: Number(phonenumber), // Ensure it's a number
            notes: notes || "",
            items: items.map(item => ({
                ...item,
                price: Number(item.price),
                quantity: Number(item.quantity)
            })),
            total,
            totalCost: total,
            status: "Pending",
            orderType: "customer",
            quotationRef: quotationId,
            date: new Date()
        });

        await newOrder.save();
        console.log("Order created successfully:", newOrder.orderID);
        res.status(201).json({ success: true, message: "Order created successfully", order: newOrder });
    } catch (error) {
        console.error("Create Order Internal Error:", error);
        res.status(500).json({ 
            success: false,
            message: "Failed to create order", 
            error: error.message 
        });
    }
};

// =============================================================
//   (Supplier-specific order functions removed)
// =============================================================



// GET: All purchase orders for Admin
export const getAllPurchaseOrders = async (req, res) => {
    try {
        const orders = await Order.find({ orderType: "purchase" }).sort({ date: -1 });
        const mapped = orders.map(o => ({
            id: o._id,
            po_id: o.orderID || "PO-NEW",
            supplier: o.supplierEmail || "Unknown Supplier",
            orderDate: o.date,
            expectedDelivery: o.dispatchDetails?.dispatchDate || "Pending",
            totalItems: o.items?.length || 0,
            totalAmount: o.total || 0,
            status: o.status.toLowerCase(),
            items: o.items
        }));
        return res.status(200).json({ success: true, orders: mapped });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// PUT: Update PO status by Admin
export const updatePurchaseOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        if (!order) return res.status(404).json({ message: "Purchase Order not found" });
        return res.status(200).json({ success: true, order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
