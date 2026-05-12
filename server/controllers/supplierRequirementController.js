import SupplierRequirement from "../models/supplierRequirement.js";
import User from "../models/User.js";
import SupplierOrder from "../models/supplierOrder.js";
import mongoose from "mongoose";

// ==========================================
// 1. CREATE SUPPLIER REQUIREMENT (ADMIN -> SUPPLIER)
// ==========================================
export const createSupplierRequirement = async (req, res) => {
    try {
        const { supplierId, items, originalRequirementId } = req.body;
        const assignedBy = req.user.id || req.user._id;

        if (!supplierId || !items || items.length === 0) {
            return res.status(400).json({ success: false, message: "Supplier and items are required" });
        }

        const newReq = new SupplierRequirement({
            supplierId,
            assignedBy,
            items,
            originalRequirementId: originalRequirementId || null,
            status: 'sent'
        });

        await newReq.save();

        res.status(201).json({
            success: true,
            message: "Requirement sent to supplier successfully",
            data: newReq
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==========================================
// 2. GET REQUIREMENTS (ADMIN VIEWS ALL, SUPPLIER VIEWS OWN)
// ==========================================
export const getMySupplierRequirements = async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;
        const userRole = req.user.role?.toLowerCase();
        const { status, search } = req.query;

        let filter = {};
        
        // If user is a Supplier, they only see requirements assigned to them
        if (userRole === 'supplier') {
            filter.supplierId = userId;
        }

        if (status && status !== 'all') {
            filter.status = status;
        }

        const requirements = await SupplierRequirement.find(filter)
            .sort({ createdAt: -1 })
            .populate('assignedBy', 'fullName email')
            .populate({
                path: 'supplierId',
                select: 'fullName companyName role',
                match: { role: { $regex: /^supplier$/i } }
            });

        // If Admin, filter out requirements where supplierId is null (meaning it didn't match the 'Supplier' role)
        let validRequirements = requirements;
        if (userRole === 'admin' || userRole === 'administration') {
            validRequirements = requirements.filter(r => r.supplierId !== null);
        }

        // Filter by search if provided
        let filtered = validRequirements;
        if (search) {
            const q = search.toLowerCase();
            filtered = validRequirements.filter(r => 
                r.items.some(item => item.itemName.toLowerCase().includes(q)) ||
                (r.supplierId?.fullName || '').toLowerCase().includes(q) ||
                (r.supplierId?.companyName || '').toLowerCase().includes(q)
            );
        }

        const formatted = filtered.map(r => {
            const isSupplier = userRole === 'supplier';
            const supplierName = r.supplierId?.fullName || 'Unknown Supplier';
            const supplierCompany = r.supplierId?.companyName || 'N/A';
            
            return {
                id: r._id,
                requirementId: `SREQ-${r._id.toString().slice(-5).toUpperCase()}`,
                itemSummary: r.items.map(i => i.itemName).join(', '),
                items: r.items,
                createdAt: r.createdAt,
                status: r.status,
                // In supplier view, the "Customer" is the Admin.
                // In admin view, "Customer" is also Admin (Hardware Store).
                customerName: isSupplier ? "Administration" : supplierName,
                companyName: isSupplier ? "Hardware Store" : supplierCompany,
            };
        });

        res.status(200).json({ success: true, requirements: formatted });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==========================================
// 3. GET STATS (FOR SUPPLIER DASHBOARD)
// ==========================================
export const getSupplierRequirementStats = async (req, res) => {
    try {
        const supplierId = req.user.id || req.user._id;
        const matchStage = { supplierId: new mongoose.Types.ObjectId(supplierId) };

        const stats = await SupplierRequirement.aggregate([
            { $match: matchStage },
            { $group: { _id: "$status", count: { $sum: 1 } } },
        ]);

        const result = { total: 0, new: 0, in_progress: 0, completed: 0, rejected: 0 };

        stats.forEach(({ _id, count }) => {
            result.total += count;
            if (_id === "sent" || _id === "pending") result.new += count;
            if (_id === "quoted" || _id === "accepted") result.in_progress += count;
            if (_id === "delivered") result.completed += count;
            if (_id === "rejected") result.rejected += count;
        });

        return res.status(200).json({ success: true, stats: result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==========================================
// 4. GET SINGLE BY ID
// ==========================================
export const getSupplierRequirementById = async (req, res) => {
    try {
        const requirement = await SupplierRequirement.findById(req.params.id)
            .populate('assignedBy', 'fullName email')
            .populate('supplierId', 'fullName companyName contactNumber address');

        if (!requirement) {
            return res.status(404).json({ success: false, message: "Requirement not found" });
        }

        const userRole = req.user.role?.toLowerCase();
        const userId = req.user.id || req.user._id;

        if (userRole === 'supplier' && requirement.supplierId._id.toString() !== userId.toString()) {
            return res.status(403).json({ success: false, message: "Access Denied" });
        }

        const supplierName = requirement.supplierId?.fullName || 'Unknown Supplier';
        const supplierCompany = requirement.supplierId?.companyName || 'N/A';

        res.status(200).json({
            success: true,
            requirement: {
                id: requirement._id,
                requirementId: `SREQ-${requirement._id.toString().slice(-5).toUpperCase()}`,
                customerName: userRole === 'supplier' ? "Administration" : supplierName,
                companyName: userRole === 'supplier' ? "Hardware Store" : supplierCompany,
                items: requirement.items,
                status: requirement.status,
                createdAt: requirement.createdAt,
                rejectReason: requirement.rejectReason || null
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==========================================
// 6. SUPPLIER DASHBOARD STATS
// ==========================================
export const getSupplierDashboardStats = async (req, res) => {
    try {
        const supplierId = req.user.id || req.user._id;
        const supplierEmail = req.user.email;

        // Requirements stats
        const reqStats = await SupplierRequirement.aggregate([
            { $match: { supplierId: new mongoose.Types.ObjectId(supplierId) } },
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);

        // Orders stats (using SupplierOrder model)
        const orderStats = await SupplierOrder.aggregate([
            { $match: { supplierEmail: supplierEmail } },
            { $group: { _id: "$status", count: { $sum: 1 }, revenue: { $sum: "$total" } } }
        ]);

        const stats = {
            newRequirements: 0,
            pendingQuotations: 0,
            activeOrders: 0,
            totalRevenue: 0
        };

        reqStats.forEach(s => {
            if (s._id === 'sent' || s._id === 'pending') stats.newRequirements += s.count;
            if (s._id === 'quoted') stats.pendingQuotations += s.count;
        });

        orderStats.forEach(s => {
            const status = s._id?.toLowerCase();
            if (status !== 'completed' && status !== 'delivered' && status !== 'cancelled') {
                stats.activeOrders += s.count;
            }
            stats.totalRevenue += s.revenue;
        });

        res.status(200).json({ success: true, stats });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==========================================
// 7. RECENT REQUIREMENTS (FOR DASHBOARD)
// ==========================================
export const getRecentSupplierRequirements = async (req, res) => {
    try {
        const supplierId = req.user.id || req.user._id;
        const requirements = await SupplierRequirement.find({ supplierId })
            .sort({ createdAt: -1 })
            .limit(5);

        const formatted = requirements.map(r => ({
            id: r._id,
            requirementId: `SREQ-${r._id.toString().slice(-5).toUpperCase()}`,
            previewTitle: r.items[0]?.itemName || 'New Requirement',
            itemCount: r.items.length,
            items: r.items,
            status: r.status,
            createdAt: r.createdAt
        }));

        res.status(200).json({ success: true, recentRequirements: formatted });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==========================================
// 8. RECENT ORDERS & PENDING PAYMENTS (FALLBACKS)
// ==========================================
export const getRecentSupplierOrders = async (req, res) => {
    try {
        const supplierEmail = req.user.email;
        const orders = await SupplierOrder.find({ supplierEmail })
            .sort({ date: -1 })
            .limit(5);

        const formatted = orders.map(o => ({
            id: o._id,
            po_id: o.po_id || o.orderID,
            status: o.status.toLowerCase(),
            total: o.total || 0,
            date: o.date
        }));

        res.status(200).json({ success: true, recentOrders: formatted });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getSupplierPendingPayments = async (req, res) => {
    try {
        // This would typically come from an Invoices model
        // For now, returning empty to prevent dashboard errors
        res.status(200).json({ success: true, pendingPayments: [] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==========================================
// 9. GET ALL SUPPLIERS (FOR ADMIN PICKLIST)
// ==========================================
export const getAllSuppliersForAdmin = async (req, res) => {
    try {
        const suppliers = await User.find({ role: { $regex: /^supplier$/i } }).select('fullName companyName email');
        res.status(200).json({ success: true, suppliers });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
