import Order from "../models/Order.js";
import Product from "../models/Product.js";

exports.createOrder = async (req, res) => {

    if(req.user == null){
        return res.status(401).json({ message: "Authentication required" });

    }
    try{const latestOrder = await Order.findOne().sort({ date: -1 });

    let orderID = "ORD000001";

    if(latestOrder !== null){
        let latestOrderID= latestOrder.orderID;
        let latestOrderNumberString = latestOrderID.replace("ORD", "");
        let latestOrderNumber = parseInt(latestOrderNumberString);
        let newOrderNumber = latestOrderNumber + 1;
        orderID = "ORD" + newOrderNumber.toString().padStart(6, '0');

    }
    const items = []
    let total = 0

    for(let i=0 ; i < req.body.items.length; i++){
        const product = await Product.findOne({
            productID: req.body.items[i].productID
        })
  
    if(product == null ){
        return res.status(400).json({
            message : `Product with ID ${req.body.items[i].productID}not found`
        })}

    if(product.stock < req.body.items[i].quantity){
        return res.status(400).json({
            message:`only ${product.stock} items available in stock for product ID ${req.body.items[i].productID} `})}    
    
     items.push({
                    productID: product.productID,
                    name: product.name,
                    price: product.price,
                    quantity: req.body.items[i].quantity,
                    image: product.images[0]
                });
        total += product.price * req.body.items[i].quantity;
    
        } 
    let name = req.body.name;         
    if(req.body.name == null ) {
        name = req.user.firstName + " " + req.user.lastName;
    }  
    const newOrder = new Order({
        orderID: orderID,
        email : req.user.email,
        address : req.body.address,
        notes: req.body.notes ?? req.body.note ?? undefined,
        total : total,
        items : items,
        phonenumber: req.body.phonenumber,
        name: name
    })

    await newOrder.save();

    for(let i=0 ; i < req.body.items.length; i++){
        await Product.updateOne(
            { productID: req.body.items[i].productID },
            {$inc: { stock: -req.body.items[i].quantity }   })}

    return res.json({
        message: "Order created successfully",
        orderID: orderID
    });

                
    }catch(err){ 
        return res.status(500).json({ message: "Server error", error: err.message });   
    }
    

        }

exports.getOrders = async (req, res) => {
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

exports.updateOrder = async (req, res) => {
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

exports.getActiveOrderCount = async (req, res) => {
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

exports.getDeliveredOrderCount = async (req, res) => {
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

exports.getRecentOrders = async (req, res) => {
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

exports.getPendingOrderCountByCustomer = async (req, res) => {
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

exports.getProcessingOrderCountByCustomer = async (req, res) => {
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

exports.getDispatchedOrderCountByCustomer = async (req, res) => {
    try{
        const email = req.params.email;
        const dispatchedOrderCount = await Order.countDocuments({
             email: email, 
             status: "in_transit" 
        });
        
        res.status(200).json({ success: true, dispatchedOrderCount: dispatchedOrderCount });
    } catch (err) {
        res.status(500).json({
             success: false, 
             message: "Error getting dispatched order count", 
             error: err.message });
    }
}

exports.getDeliveredOrderCountByCustomer = async (req, res) => {
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

exports.getPendingOrdersByCustomer = async (req, res) => {
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

exports.getProcessingOrdersByCustomer = async (req, res) => {
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

exports.getDispatchedOrdersByCustomer = async (req, res) => {
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

exports.getInTransitOrdersByCustomer = async (req, res) => {
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

exports.getDeliveredOrdersByCustomer = async (req, res) => {
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

exports.uploadDeliveryProof = async (req, res) => {
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
exports.getSupplierOrders = async (req, res) => {
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
exports.getSupplierOrderById = async (req, res) => {
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
exports.updateSupplierOrderStatus = async (req, res) => {
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
exports.getSupplierOrderStats = async (req, res) => {
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
exports.getSupplierOrdersTable = async (req, res) => {
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
exports.acknowledgeSupplierOrder = async (req, res) => {
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
exports.getDispatchOrderList = async (req, res) => {
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
exports.getDeliveryProgress = async (req, res) => {
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
exports.dispatchSupplierOrder = async (req, res) => {
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