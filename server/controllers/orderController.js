import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

export const createOrder = async (req, res) => {
    // 1. Authentication Check
    const userId = req.user?._id || req.user?.id;
    if (!req.user || !userId) {
        return res.status(401).json({ message: "Authentication required" });
    }

    try {
        const dbUser = await User.findById(userId);
        if (!dbUser) {
            return res.status(404).json({ message: "User not found in database" });
        }

        // 2. Generate Order ID (Incremental)
        const latestOrder = await Order.findOne().sort({ date: -1 });
        let orderID = "ORD000001";

        if (latestOrder && latestOrder.orderID) {
            let latestOrderNumber = parseInt(latestOrder.orderID.replace("ORD", ""));
            orderID = "ORD" + (latestOrderNumber + 1).toString().padStart(6, '0');
        }

        // 3. Process Items and Validate Stock
        const items = [];
        let total = 0;

        for (const item of req.body.items) {
            let productRecord = null;
            if (item.productID && item.productID !== "CUSTOM") {
                productRecord = await Product.findOne({ productID: item.productID });
            }

            if (productRecord) {
                // It's a standard inventory product
                if (productRecord.stock < item.quantity) {
                    return res.status(400).json({ 
                        message: `Only ${productRecord.stock} items available for ${productRecord.name}` 
                    });
                }
                items.push({
                    productID: productRecord.productID,
                    name: productRecord.name,
                    price: productRecord.price,
                    quantity: item.quantity,
                    image: (productRecord.images && productRecord.images.length > 0) ? productRecord.images[0] : ""
                });
                total += productRecord.price * item.quantity;
            } else {
                // It's a custom quotation item that is not in the regular Products collection
                items.push({
                    productID: item.productID || "CUSTOM",
                    name: item.name || item.productID || "Custom Item",
                    price: item.price || 0,
                    quantity: item.quantity || 1,
                    image: item.image || ""
                });
                total += (item.price || 0) * (item.quantity || 1);
            }
        }

        // 4. Determine Display Name
        const name = req.body.name || dbUser.fullName || dbUser.name || "Customer";

        // 5. Create New Order Instance
        const newOrder = new Order({
            customerId: userId, // Passing the Customer ID here
            orderID: orderID,
            email: dbUser.email || req.user.email,
            name: name,
            address: req.body.address,
            phonenumber: req.body.phonenumber,
            items: items,
            total: total,
            totalCost: total, // Schema requires totalCost, mapping total to it
            notes: req.body.notes || req.body.note,
            // If this comes from "Accept Quotation", you might want to set:
            quotationRef: req.body.quotationId || null 
        });

        // 6. Save Order
        await newOrder.save();

        // 7. Update Stock Levels
        const stockUpdates = req.body.items.map(item => 
            Product.updateOne(
                { productID: item.productID },
                { $inc: { stock: -item.quantity } }
            )
        );
        await Promise.all(stockUpdates);

        return res.status(201).json({
            message: "Order created successfully",
            orderID: orderID,
            order: newOrder
        });

    } catch (err) {
        console.error("Order Creation Error:", err);
        return res.status(500).json({ message: "Server error", error: err.message });
    }
};

export const getOrders = async (req, res) => {
    if(req.user == null){
        return res.status(401).json({ message: "Authentication required" });        
    }
    if(req.user.role === "admin"){
        const orders = await Order.find().sort({ date: -1 });
        return res.json(orders);
    }else{
        const orders = await Order.find({ email: req.user.email }).sort({ date: -1 });
        return res.json(orders);
    }
}    

export const updateOrder = async (req, res) => {
    if(req.user == null || req.user.role !== "admin"){
        return res.status(401).json({ message: "Authentication required" });         
    }
    try{
    const orderID = req.params.orderID;
    const status = req.body.status;
    const notes = req.body.notes ?? req.body.note ?? undefined;

    await Order.updateOne(
        { orderID: orderID },
        { $set: { status: status, notes: notes } }
    );
    return res.json({ message: "Order updated successfully" });
    }catch(err){
        return res.status(500).json({ message: "Server error", error: err.message });
    }
}

export const getActiveOrderCount = async (req, res) => {
    try{
        const email = req.params.email;
        const activeOrderCount = await Order.countDocuments({
             email: email, 
             status: { $in: ["pending", "processing", "in_transit"] } 
        });
        
        res.status(200).json({ success: true, activeOrderCount: activeOrderCount });

    } catch (err) {
        res.status(500).json({
             success: false, 
             message: "Error getting active order count", 
             error: err.message });
    }
}

export const getDeliveredOrderCount = async (req, res) => {
    try{
        const email = req.params.email;
        const activeOrderCount = await Order.countDocuments({
             email: email, 
             status: { $in: ["delivered"] } 
        });
        
        res.status(200).json({ success: true, deliveredOrderCount: deliveredOrderCount });

    } catch (err) {
        res.status(500).json({
             success: false, 
             message: "Error getting delivered order count", 
             error: err.message });
    }
}

export const getRecentOrders = async (req, res) => {
    try{
        const email = req.params.email;
        const recentOrders = await Order.find({ email: email }).sort({ date: -1 }).limit(3).select('orderID status date totalCost items');

        const formattedOrders = recentOrders.map(order => ({
            orderID: order.orderID,
            status: order.status,
            date: order.date,
            totalCost: order.totalCost,
            itemCount: order.items.length
        }));

        res.status(200).json({ success: true, recentOrders: formattedOrders });

    } catch (err) {
        res.status(500).json({
             success: false, 
             message: "Error getting recent orders", 
             error: err.message });
    }
}

export const getPendingOrderCountByCustomer = async (req, res) => {
    try{
        const email = req.params.email;
        const pendingOrderCount = await Order.countDocuments({
             email: email, 
             status: "pending" 
        });
        
        res.status(200).json({ success: true, pendingOrderCount: pendingOrderCount });

    } catch (err) {
        res.status(500).json({
             success: false, 
             message: "Error getting pending order count", 
             error: err.message });
    }
}

export const getProcessingOrderCountByCustomer = async (req, res) => {
    try{
        const email = req.params.email;
        const processingOrderCount = await Order.countDocuments({
             email: email, 
             status: "processing" 
        });
        
        res.status(200).json({ success: true, processingOrderCount: processingOrderCount });
    } catch (err) {
        res.status(500).json({
             success: false, 
             message: "Error getting processing order count", 
             error: err.message });
    }
}

export const getDispatchedOrderCountByCustomer = async (req, res) => {
    try{
        const email = req.params.email;
        const dispatchedOrderCount = await Order.countDocuments({
             email: email, 
             status: "dispatched" 
        });
        
        res.status(200).json({ success: true, dispatchedOrderCount: dispatchedOrderCount });
    } catch (err) {
        res.status(500).json({
             success: false, 
             message: "Error getting dispatched order count", 
             error: err.message });
    }
}

export const getInTransitOrderCountByCustomer = async (req, res) => {
    try{
        const email = req.params.email;
        const inTransitOrderCount = await Order.countDocuments({
             email: email, 
             status: "in-transit" 
        });
        
        res.status(200).json({ success: true, inTransitOrderCount: inTransitOrderCount });
    } catch (err) {
        res.status(500).json({
             success: false, 
             message: "Error getting in-transit order count", 
             error: err.message });
    }
}

export const getDeliveredOrderCountByCustomer = async (req, res) => {
    try{
        const email = req.params.email;
        const deliveredOrderCount = await Order.countDocuments({
             email: email, 
             status: "delivered" 
        });
        
        res.status(200).json({ success: true, deliveredOrderCount: deliveredOrderCount });
    } catch (err) {
        res.status(500).json({
             success: false, 
             message: "Error getting delivered order count", 
             error: err.message });
    }
}

export const getPendingOrdersByCustomer = async (req, res) => {
    try{
        const { email } = req.query;
        if(!email){
            return res.status(400).json({ success: false, message: "Email is required" });
        }
        const pendingOrders = await Order.find({
            email: email,
            status: "pending"
        }).sort({ date: -1 });

        const formattedOrders = pendingOrders.map(order => ({
            orderID: order.orderID,
            status: order.status,
            quotationRef: order.quotationRef || null,
            date: order.date,
            totalCost: order.totalCost,
            itemCount: order.items.length
        }));
        res.status(200).json({ success: true, pendingOrders: formattedOrders });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error getting pending orders",
            error: err.message
        });
    }
}

export const getProcessingOrdersByCustomer = async (req, res) => {
    try{
        const { email } = req.query;
        if(!email){
            return res.status(400).json({ success: false, message: "Email is required" });
        }
        const processingOrders = await Order.find({
            email: email,
            status: "processing"
        }).sort({ date: -1 });

        const formattedOrders = processingOrders.map(order => ({
            orderID: order.orderID,
            status: order.status,
            quotationRef: order.quotationRef || null,
            date: order.date,
            totalCost: order.totalCost,
            itemCount: order.items.length
        }));
        res.status(200).json({ success: true, processingOrders: formattedOrders });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error getting processing orders",
            error: err.message
        });
    }
}

export const getDispatchedOrdersByCustomer = async (req, res) => {
    try{
        const { email } = req.query;
        if(!email){
            return res.status(400).json({ success: false, message: "Email is required" });
        }
        const dispatchedOrders = await Order.find({
            email: email,
            status: "dispatched"
        }).sort({ date: -1 });

        const formattedOrders = dispatchedOrders.map(order => ({
            orderID: order.orderID,
            status: order.status,
            quotationRef: order.quotationRef || null,
            date: order.date,
            totalCost: order.totalCost,
            itemCount: order.items.length
        }));
        res.status(200).json({ success: true, dispatchedOrders: formattedOrders });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error getting dispatched orders",
            error: err.message
        });
    }
}

export const getInTransitOrdersByCustomer = async (req, res) => {
    try{
        const { email } = req.query;
        if(!email){
            return res.status(400).json({ success: false, message: "Email is required" });
        }
        const inTransitOrders = await Order.find({
            email: email,
            status: "in-transit"
        }).sort({ date: -1 });

        const formattedOrders = inTransitOrders.map(order => ({
            orderID: order.orderID,
            status: order.status,
            quotationRef: order.quotationRef || null,
            date: order.date,
            totalCost: order.totalCost,
            itemCount: order.items.length
        }));
        res.status(200).json({ success: true, inTransitOrders: formattedOrders });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error getting in-transit orders",
            error: err.message
        });
    }
}

export const getDeliveredOrdersByCustomer = async (req, res) => {
    try{
        const { email } = req.query;
        if(!email){
            return res.status(400).json({ success: false, message: "Email is required" });
        }
        const deliveredOrders = await Order.find({
            email: email,
            status: "delivered"
        }).sort({ date: -1 });

        const formattedOrders = deliveredOrders.map(order => ({
            orderID: order.orderID,
            status: order.status,
            quotationRef: order.quotationRef || null,
            date: order.date,
            totalCost: order.totalCost,
            itemCount: order.items.length
        }));
        res.status(200).json({ success: true, deliveredOrders: formattedOrders });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error getting delivered orders",
            error: err.message
        });
    }
}

export const uploadDeliveryProof = async (req, res) => {
    try{
        const { orderID } = req.body;
        if(!orderID || !req.file){
            return res.status(400).json({ success: false, message: "Order ID and delivery proof are required" });
        }

        const order = await Order.findOne({ orderID: orderID });
        if(!order){
            return res.status(404).json({ success: false, message: "Order not found" });
        }
        
        order.deliveryProof = req.file.path;
        await order.save();

        res.status(200).json({ success: true, message: "Delivery proof uploaded successfully" });
    } 
    catch (err) {
        res.status(500).json({
            success: false,
            message: "Error uploading delivery proof",
            error: err.message
        });
    }
}

// ================================
//   GET ALL PURCHASE ORDERS FOR THIS SUPPLIER
// ================================
export const getSupplierOrders = async (req, res) => {
    try {
        const supplierEmail = req.user.email;

        const orders = await Order.find({
            supplierEmail,
            orderType: "purchase",
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            orders,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error getting supplier orders",
            error: error.message,
        });
    }
};

// ================================
//   GET SINGLE PURCHASE ORDER
// ================================
export const getSupplierOrderById = async (req, res) => {
    try {
        const supplierEmail = req.user.email;

        const order = await Order.findOne({
            _id:           req.params.id,
            supplierEmail,
            orderType:     "purchase",
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        return res.status(200).json({
            success: true,
            order,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error getting supplier order",
            error: error.message,
        });
    }
};

// ================================
//   UPDATE PURCHASE ORDER STATUS
// ================================
export const updateSupplierOrderStatus = async (req, res) => {
    try {
        const supplierEmail     = req.user.email;
        const { status, notes } = req.body;

        const allowed = ["confirmed", "dispatched", "delivered", "cancelled"];
        if (!status || !allowed.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `status must be one of: ${allowed.join(", ")}`,
            });
        }

        const order = await Order.findOne({
            _id:       req.params.id,
            supplierEmail,
            orderType: "purchase",
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        order.status = status;
        if (notes) order.notes = notes;

        // Record status-change dates using the existing statusDates field
        if (status === "dispatched") {
            order.statusDates = order.statusDates || {};
            order.statusDates.dispatchedDate = new Date();
        }
        if (status === "delivered") {
            order.statusDates = order.statusDates || {};
            order.statusDates.inTransitDate = new Date();
        }

        await order.save();

        return res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            order: {
                id:     order._id,
                po_id:  order.po_id,
                status: order.status,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating supplier order status",
            error: error.message,
        });
    }
};

// ================================
//   CUSTOMER ORDERS PAGE - STAT CARDS
// ================================
export const getSupplierOrderStats = async (req, res) => {
    try {
        const supplierEmail = req.user.email;

        const pending      = await Order.countDocuments({ supplierEmail, orderType: "purchase", status: "pending" });
        const acknowledged = await Order.countDocuments({ supplierEmail, orderType: "purchase", status: "confirmed" });
        const preparing    = await Order.countDocuments({ supplierEmail, orderType: "purchase", status: "preparing" });
        const ready        = await Order.countDocuments({ supplierEmail, orderType: "purchase", status: "ready" });
        const dispatched   = await Order.countDocuments({ supplierEmail, orderType: "purchase", status: "dispatched" });

        return res.status(200).json({
            success: true,
            stats: { pending, acknowledged, preparing, ready, dispatched },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================================
//   CUSTOMER ORDERS PAGE - TABLE
// ================================
export const getSupplierOrdersTable = async (req, res) => {
    try {
        const supplierEmail = req.user.email;
        const { status, search } = req.query;

        const filter = { supplierEmail, orderType: "purchase" };
        if (status) filter.status = status;
        if (search) {
            filter.$or = [
                { po_id:   { $regex: search, $options: "i" } },
                { orderID: { $regex: search, $options: "i" } },
            ];
        }

        const orders = await Order.find(filter).sort({ createdAt: -1 });

        const formatted = orders.map((o) => ({
            id:           o._id,
            po_id:        o.po_id,
            customerName: o.name || "Hardware Store",
            totalItems:   o.items?.length || 0,
            totalAmount:  o.total,
            orderDate:    o.date,
            status:       o.status,
            items:        o.items,
        }));

        return res.status(200).json({ success: true, orders: formatted });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================================
//   ACKNOWLEDGE ORDER
// ================================
export const acknowledgeSupplierOrder = async (req, res) => {
    try {
        const supplierEmail = req.user.email;

        const order = await Order.findOne({
            _id:           req.params.id,
            supplierEmail,
            orderType:     "purchase",
            status:        "pending",
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Pending order not found",
            });
        }

        order.status = "confirmed";
        order.statusDates = order.statusDates || {};
        order.statusDates.quotationAcceptedDate = new Date();
        await order.save();

        return res.status(200).json({
            success: true,
            message: "Order acknowledged successfully",
            order: { id: order._id, po_id: order.po_id, status: order.status },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================================
//   DELIVERY PROGRESS PAGE - ORDER DROPDOWN
// ================================
export const getDispatchOrderList = async (req, res) => {
    try {
        const supplierEmail = req.user.email;

        const orders = await Order.find({
            supplierEmail,
            orderType: "purchase",
            status: { $nin: ["pending", "delivered"] },
        })
            .sort({ createdAt: -1 })
            .select("po_id name status");

        const formatted = orders.map((o) => ({
            id:           o._id,
            po_id:        o.po_id,
            customerName: o.name || "Hardware Store",
            status:       o.status,
            label:        `${o.po_id} — ${o.name || "Hardware Store"}`,
        }));

        return res.status(200).json({ success: true, orders: formatted });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================================
//   DELIVERY PROGRESS PAGE - GET ORDER TIMELINE
// ================================
export const getDeliveryProgress = async (req, res) => {
    try {
        const supplierEmail = req.user.email;

        const order = await Order.findOne({
            _id:           req.params.id,
            supplierEmail,
            orderType:     "purchase",
        });

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        // Map statuses to timeline steps
        const statusRank = {
            pending:    0,
            confirmed:  1,
            preparing:  2,
            ready:      3,
            dispatched: 4,
            delivered:  5,
        };

        const currentRank = statusRank[order.status] ?? 0;

        const timeline = [
            {
                step:        "order_received",
                label:       "Order Received",
                description: "Order confirmed from customer",
                completed:   currentRank >= 1,
                date:        order.statusDates?.quotationAcceptedDate || null,
            },
            {
                step:        "goods_prepared",
                label:       "Goods Prepared",
                description: "All items packed and ready",
                completed:   currentRank >= 3,
                date:        order.statusDates?.preparedDate || null,
            },
            {
                step:        "dispatched",
                label:       "Dispatched",
                description: currentRank >= 4 ? order.dispatchDetails?.deliveryNotes || "Dispatched" : "Enter dispatch details",
                completed:   currentRank >= 4,
                inProgress:  currentRank === 3,
                date:        order.statusDates?.dispatchedDate || null,
            },
            {
                step:        "in_transit",
                label:       "In Transit",
                description: currentRank >= 4 ? "Package in transit" : "Awaiting dispatch",
                completed:   currentRank >= 5,
                date:        order.statusDates?.inTransitDate || null,
            },
            {
                step:        "delivered",
                label:       "Delivered",
                description: currentRank >= 5 ? "Delivered successfully" : "Awaiting delivery confirmation",
                completed:   currentRank >= 5,
                date:        order.statusDates?.deliveredDate || null,
            },
        ];

        return res.status(200).json({
            success: true,
            order: {
                id:     order._id,
                po_id:  order.po_id,
                status: order.status,
            },
            timeline,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================================
//   DISPATCH DETAILS - MARK AS DISPATCHED
// ================================
export const dispatchSupplierOrder = async (req, res) => {
    try {
        const supplierEmail = req.user.email;
        const {
            trackingNumber,
            vehicleNumber,
            driverName,
            dispatchDate,
            deliveryNotes,
            deliveryNoteFileUrl,  
        } = req.body;

        const order = await Order.findOne({
            _id:           req.params.id,
            supplierEmail,
            orderType:     "purchase",
            status:        { $in: ["confirmed", "preparing", "ready"] },
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found or cannot be dispatched in its current status",
            });
        }

        order.status = "dispatched";
        order.delivery = {
            trackingNumber:          trackingNumber        || "",
            estimatedDeliveryDate:   order.expectedDeliveryDate || null,
            deliveryAddress:         order.address         || "",
        };
        order.dispatchDetails = {
            vehicleNumber:      vehicleNumber      || "",
            driverName:         driverName         || "",
            dispatchDate:       dispatchDate        ? new Date(dispatchDate) : new Date(),
            deliveryNotes:      deliveryNotes       || "",
            deliveryNoteFileUrl: deliveryNoteFileUrl || "",
        };
        order.statusDates = order.statusDates || {};
        order.statusDates.dispatchedDate = new Date();

        await order.save();

        return res.status(200).json({
            success: true,
            message: "Order marked as dispatched",
            order: {
                id:     order._id,
                po_id:  order.po_id,
                status: order.status,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};