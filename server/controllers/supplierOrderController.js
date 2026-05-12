import mongoose from 'mongoose';
import SupplierOrder from '../models/supplierOrder.js';
import SupplierInvoice from '../models/supplierInvoice.js';
import StockItem from '../models/Stock.js';

// ==========================================
// 1. GET all supplier purchase orders (Admin)
// ==========================================
export const getAllSupplierOrders = async (req, res) => {
    try {
        const orders = await SupplierOrder.find().sort({ date: -1 });
        const mapped = orders.map(o => ({
            _id: o._id,
            id: o._id,
            po_id: o.po_id || o.orderID,
            supplier: o.supplierEmail || 'Unknown',
            name: o.name,
            email: o.supplierEmail,
            quotationRef: o.quotationRef || 'N/A',
            orderDate: o.date,
            expectedDelivery: o.expectedDeliveryDate || o.dispatchDetails?.dispatchDate || 'Pending',
            totalItems: o.items?.length || 0,
            totalAmount: o.total || 0,
            status: o.status.toLowerCase(),
            items: o.items,
            invoiced: o.invoiced || false
        }));
        return res.status(200).json({ success: true, orders: mapped });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==========================================
// 2. GET supplier orders for a specific supplier
// ==========================================
export const getOrdersBySupplierId = async (req, res) => {
    try {
        const { supplierId } = req.params;
        const orders = await SupplierOrder.find({ supplierId }).sort({ date: -1 });
        const mapped = orders.map(o => ({
            _id: o._id,
            orderID: o.po_id || o.orderID,
            email: o.supplierEmail,
            quotationRef: o.quotationRef || null,
            orderDate: o.date,
            totalAmount: o.total || 0,
            totalItems: o.items?.length || 0,
            status: o.status.toLowerCase(),
            items: o.items,
            invoiced: o.invoiced || false
        }));
        res.status(200).json(mapped);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// ==========================================
// 3. GET supplier orders by email (for supplier portal)
// ==========================================
export const getOrdersBySupplierEmail = async (req, res) => {
    try {
        const supplierEmail = req.user.email;
        const orders = await SupplierOrder.find({ supplierEmail }).sort({ date: -1 });
        const mapped = orders.map(o => ({
            _id: o._id,
            po_id: o.po_id || o.orderID,
            customerName: o.name || "Hardware Admin",
            total: o.total || 0,
            status: o.status.toLowerCase(),
            date: o.date,
            items: o.items || [],
            expectedDeliveryDate: o.expectedDeliveryDate,
            payment_terms: o.payment_terms || "Net 30"
        }));
        res.status(200).json({ success: true, orders: mapped });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// ==========================================
// 4. UPDATE order status (Admin)
// ==========================================
export const updateSupplierOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const updated = await SupplierOrder.findByIdAndUpdate(id, { status }, { new: true });
        if (!updated) return res.status(404).json({ message: 'Order not found' });
        res.status(200).json({ success: true, order: updated });
    } catch (error) {
        res.status(500).json({ message: 'Error updating status', error: error.message });
    }
};

// ==========================================
// 5. DISPATCH (Admin marks as dispatched with details)
// ==========================================
export const dispatchSupplierOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { vehicleNumber, driverName, dispatchDate, deliveryNotes, items } = req.body;

        const order = await SupplierOrder.findById(id);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        // Update issued quantities if provided
        if (items && Array.isArray(items)) {
            items.forEach(dispatchItem => {
                const orderItem = order.items.find(i => i.productID === dispatchItem.productID);
                if (orderItem) {
                    orderItem.issuedQuantity = dispatchItem.issuedQuantity || 0;
                }
            });
        } else {
            // Default: if no items provided, assume full dispatch of what was ordered
            order.items.forEach(item => {
                item.issuedQuantity = item.quantity;
            });
        }

        order.dispatchDetails = { vehicleNumber, driverName, dispatchDate: dispatchDate || new Date(), deliveryNotes };
        order.status = 'dispatched';
        await order.save();

        res.status(200).json({ success: true, order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ==========================================
// 6. CONFIRM DELIVERY (Admin marks as delivered)
// ==========================================
export const confirmSupplierDelivery = async (req, res) => {
    try {
        const { id } = req.params;
        const { items } = req.body; // Array of { productID, receivedQuantity, rejectedQuantity }

        const order = await SupplierOrder.findById(id);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        if (items && Array.isArray(items)) {
            items.forEach(receiveItem => {
                const orderItem = order.items.find(i => i.productID === receiveItem.productID);
                if (orderItem) {
                    orderItem.receivedQuantity = receiveItem.receivedQuantity || 0;
                    orderItem.rejectedQuantity = receiveItem.rejectedQuantity || 0;
                }
            });
        } else {
            // Default: assume full receipt of what was issued
            order.items.forEach(item => {
                item.receivedQuantity = item.issuedQuantity || item.quantity;
                item.rejectedQuantity = 0;
            });
        }

        order.status = 'delivered';
        await order.save();

        // Update Stock levels
        if (items && Array.isArray(items)) {
            for (const receiveItem of items) {
                if (receiveItem.receivedQuantity > 0) {
                    try {
                        // Try finding by productID (which might be the Stock _id) or name
                        let stock = await StockItem.findById(receiveItem.productID);
                        
                        if (!stock) {
                            // Fallback to name search if ID doesn't match
                            const orderItem = order.items.find(i => i.productID === receiveItem.productID);
                            if (orderItem) {
                                stock = await StockItem.findOne({ item_name: orderItem.name });
                            }
                        }

                        if (stock) {
                            stock.quantity += receiveItem.receivedQuantity;
                            await stock.save();
                        }
                    } catch (err) {
                        console.error(`Failed to update stock for item ${receiveItem.productID}:`, err.message);
                    }
                }
            }
        }

        res.status(200).json({ success: true, order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ==========================================
// 7. CREATE SUPPLIER INVOICE from PO (Admin)
// ==========================================
export const createSupplierInvoice = async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await SupplierOrder.findById(orderId);
        if (!order) return res.status(404).json({ message: 'Purchase Order not found' });

        if (order.invoiced) {
            return res.status(400).json({ message: 'Invoice already generated for this order' });
        }

        let calculatedTotal = 0;
        const invoiceItems = order.items.map(item => {
            const qty = item.quantity || 0;
            const price = item.price || 0;
            const itemTotal = qty * price;
            calculatedTotal += itemTotal;
            return {
                itemName: item.name,
                quantity: qty,
                unitPrice: price,
                totalPrice: itemTotal
            };
        });

        const tax = calculatedTotal * 0.1;
        const grandTotal = calculatedTotal + tax;

        const invoice = new SupplierInvoice({
            invoiceID: `SINV-${Date.now()}`,
            orderID: order.po_id || order.orderID,
            purchaseOrderRef: order.po_id,
            supplierId: order.supplierId,
            supplierEmail: order.supplierEmail,
            email: order.supplierEmail,
            date: new Date(),
            due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            total: grandTotal,
            subtotal: calculatedTotal,
            tax_amount: tax,
            status: 'unpaid',
            payment_status: 'unpaid',
            items: invoiceItems
        });

        await invoice.save();

        order.invoiced = true;
        await order.save();

        res.status(201).json({ success: true, invoice });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ==========================================
// 8. GET all Supplier Invoices (Admin)
// ==========================================
export const getAllSupplierInvoices = async (req, res) => {
    try {
        const invoices = await SupplierInvoice.find().sort({ date: -1 });
        res.status(200).json({ success: true, invoices });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ==========================================
// 9. ACCEPT / REJECT supplier invoice payment (Admin)
// ==========================================
export const acceptSupplierPayment = async (req, res) => {
    try {
        const invoice = await SupplierInvoice.findById(req.params.id);
        if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
        invoice.status = 'paid';
        invoice.payment_status = 'paid';
        await invoice.save();
        res.status(200).json({ success: true, message: 'Payment accepted', invoice });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const rejectSupplierPayment = async (req, res) => {
    try {
        const invoice = await SupplierInvoice.findById(req.params.id);
        if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
        invoice.status = 'unpaid';
        invoice.payment_status = 'unpaid';
        invoice.notes = (invoice.notes || '') + '\nAdmin: Payment rejected. Please re-submit.';
        await invoice.save();
        res.status(200).json({ success: true, message: 'Payment rejected', invoice });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ==========================================
// 10. GET invoices for supplier portal (by email)
// ==========================================
export const getInvoicesBySupplierEmail = async (req, res) => {
    try {
        const supplierEmail = req.user.email;
        const invoices = await SupplierInvoice.find({ supplierEmail }).sort({ date: -1 });
        res.status(200).json({ success: true, invoices });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ==========================================
// 11. Stats counts for supplier portal
// ==========================================
export const getPendingOrderCount = async (req, res) => {
    try {
        const supplierEmail = req.user.email;
        const count = await SupplierOrder.countDocuments({ supplierEmail, status: { $regex: /^pending$/i } });
        res.status(200).json({ success: true, count });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getActiveOrderCount = async (req, res) => {
    try {
        const supplierEmail = req.user.email;
        const count = await SupplierOrder.countDocuments({ supplierEmail, status: { $in: ['processing', 'dispatched', 'in-transit'] } });
        res.status(200).json({ success: true, count });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getDeliveredOrderCount = async (req, res) => {
    try {
        const supplierEmail = req.user.email;
        const count = await SupplierOrder.countDocuments({ supplierEmail, status: { $regex: /^delivered$/i } });
        res.status(200).json({ success: true, count });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getSupplierOrderStats = async (req, res) => {
    try {
        const supplierEmail = req.user.email;
        const total = await SupplierOrder.countDocuments({ supplierEmail });
        const confirmed = await SupplierOrder.countDocuments({ supplierEmail, status: { $in: ['confirmed', 'processing', 'preparing'] } });
        const dispatched = await SupplierOrder.countDocuments({ supplierEmail, status: 'dispatched' });
        const delivered = await SupplierOrder.countDocuments({ supplierEmail, status: 'delivered' });
        
        res.status(200).json({ 
            success: true, 
            stats: { total, confirmed, dispatched, delivered } 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
// ==========================================
// 12. GET Dispatchable Orders for Supplier
// ==========================================
export const getDispatchableOrders = async (req, res) => {
    try {
        const supplierEmail = req.user.email;
        // Orders that are confirmed or processing but not yet dispatched/delivered
        const orders = await SupplierOrder.find({ 
            supplierEmail, 
            status: { $in: ['confirmed', 'processing', 'preparing'] } 
        }).sort({ date: -1 });

        res.status(200).json({ success: true, orders });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ==========================================
// 13. GET Delivery Progress
// ==========================================
export const getDeliveryProgress = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await SupplierOrder.findById(id);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        const totalItems = order.items.length;
        const dispatchedItems = order.status === 'dispatched' || order.status === 'delivered' ? totalItems : 0;
        const receivedItems = order.status === 'delivered' ? totalItems : 0;

        const progress = {
            totalItems,
            dispatchedItems,
            receivedItems,
            items: order.items.map(item => ({
                productID: item.productID,
                name: item.name,
                ordered: item.quantity,
                issued: item.issuedQuantity || 0,
                received: item.receivedQuantity || 0,
                rejected: item.rejectedQuantity || 0
            }))
        };

        res.status(200).json({ success: true, progress });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ==========================================
// 14. GET Invoiceable Orders
// ==========================================
export const getInvoiceableOrders = async (req, res) => {
    try {
        const supplierEmail = req.user.email;
        // Orders that are delivered or dispatched but not yet invoiced
        const orders = await SupplierOrder.find({ 
            supplierEmail, 
            status: { $in: ['dispatched', 'delivered'] },
            invoiced: { $ne: true }
        }).sort({ date: -1 });

        const mapped = orders.map(o => ({
            id: o._id,
            po_id: o.po_id || o.orderID,
            customerName: "Hardware Admin",
            label: `${o.po_id || o.orderID} - LKR ${o.total.toLocaleString()}`
        }));

        res.status(200).json({ success: true, orders: mapped });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ==========================================
// 15. ACKNOWLEDGE ORDER (Supplier)
// ==========================================
export const acknowledgeSupplierOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const supplierEmail = req.user.email;

        const order = await SupplierOrder.findOne({ _id: id, supplierEmail });
        if (!order) return res.status(404).json({ message: 'Order not found or access denied' });

        if (order.status.toLowerCase() !== 'pending') {
            return res.status(400).json({ message: `Order cannot be acknowledged in its current state: ${order.status}` });
        }

        order.status = 'confirmed';
        await order.save();

        res.status(200).json({ success: true, message: 'Order acknowledged successfully', order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ==========================================
// 16. GET Single Order by ID
// ==========================================
export const getSupplierOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await SupplierOrder.findById(id);
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.status(200).json({ success: true, order });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


