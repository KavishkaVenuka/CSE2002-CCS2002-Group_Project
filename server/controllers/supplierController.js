import Supplier from "../models/Supplier.js";
import Requirement from "../models/Requirement.js";
import Quotation from "../models/Quotation.js";
import Order from "../models/Order.js";
import Invoice from "../models/Invoice.js";
import PaymentTransaction from "../models/PaymentTransaction.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// ================================
//   REGISTER SUPPLIER
// ================================
export async function createSupplier(req, res) {
    try {
        const { 
            fullName, 
            companyName, 
            vatNumber, 
            email, 
            contactNumber, 
            password,
            role 
        } = req.body;

        // 1. Validation for required fields from the UI
        if (!fullName || !email || !contactNumber || !password) {
            return res.status(400).json({ message: "Please fill in all required fields." });
        }

        // 2. Check existing email (normalized to lowercase)
        const existingSupplier = await Supplier.findOne({ email: email.toLowerCase() });
        if (existingSupplier) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // 3. Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4. Create supplier instance
        const supplier = new Supplier({
            fullName,
            companyName: companyName || null, // Optional in UI
            vatNumber: vatNumber || null,     // Optional in UI
            contactNumber,
            email: email.toLowerCase(),
            password: hashedPassword,
            role: role || "Supplier",
            // Placeholder for fields not in the current form
            productCategories: req.body.productCategories || [],
            businessRegistrationNumber: req.body.businessRegistrationNumber || null,
        });

        await supplier.save();

        res.status(201).json({
            message: "Supplier registered successfully",
            supplier: {
                id: supplier._id,
                fullName: supplier.fullName,
                email: supplier.email,
                role: supplier.role,
            },
        });

    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
}

// ================================
//         LOGIN SUPPLIER
// ================================
export async function loginSupplier(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Find supplier by normalized email
        const supplier = await Supplier.findOne({ email: email.toLowerCase() });
        if (!supplier) {
            return res.status(404).json({ message: "Supplier not found" });
        }

        // Compare password
        const isPasswordCorrect = await bcrypt.compare(password, supplier.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Invalid password" });
        }

        // Generate JWT Payload
        const payload = {
            id: supplier._id,
            email: supplier.email,
            fullName: supplier.fullName,
            companyName: supplier.companyName,
            role: supplier.role || "Supplier",
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "150h",
        });

        return res.status(200).json({
            message: "Login successful",
            token,
            supplier: payload, 
        });

    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
}

// ================================
//   GET ALL SUPPLIERS (Admin)
// ================================
export async function getAllSuppliers(req, res) {
    try {
        const suppliers = await Supplier.find().select("-password");
        return res.status(200).json({ success: true, suppliers });
    } catch (err) {
        return res.status(500).json({
            message: "Server error",
            error: err.message,
        });
    }
}

// ================================
//   GET SUPPLIER PROFILE
// ================================
export async function getSupplierProfile(req, res) {
    try {
        const supplier = await Supplier.findById(req.user.id).select("-password");
        if (!supplier) {
            return res.status(404).json({ message: "Supplier not found" });
        }
        return res.status(200).json({ success: true, supplier });
    } catch (err) {
        return res.status(500).json({
            message: "Server error",
            error: err.message,
        });
    }
}

// ================================
//   UPDATE SUPPLIER PROFILE
// ================================
export async function updateSupplierProfile(req, res) {
    try {
        const updateData = { ...req.body };
        delete updateData.password;
        delete updateData.email;
        delete updateData.role;

        const updated = await Supplier.findByIdAndUpdate(
            req.user.id,
            { $set: updateData },
            { new: true, runValidators: true }
        ).select("-password");

        if (!updated) {
            return res.status(404).json({ message: "Supplier not found" });
        }
        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            supplier: updated,
        });
    } catch (err) {
        return res.status(500).json({
            message: "Server error",
            error: err.message,
        });
    }
}

// ================================
//   DASHBOARD STAT CARDS
// ================================
export async function getDashboardStats(req, res) {
    try {
        const supplierEmail = req.user.email;
        const supplierId    = req.user.id;

        const quotedReqIds = await Quotation.distinct("requirementId", {
            supplierId,
            quotationType: "supplier",
            requirementId: { $ne: null },
        });

        const newRequirements = await Requirement.countDocuments({
            _id: { $nin: quotedReqIds },
        });

        const pendingQuotations = await Quotation.countDocuments({
            supplierEmail,
            quotationType: "supplier",
            status: "pending",
        });

        const activeOrders = await Order.countDocuments({
            supplierEmail,
            orderType: "purchase",
            status: { $in: ["confirmed", "dispatched"] },
        });

        const revenueResult = await PaymentTransaction.aggregate([
            {
                $match: {
                    relatedEntity: supplierEmail,
                    type:          "supplier",
                    status:        "completed",
                },
            },
            {
                $group: {
                    _id:   null,
                    total: { $sum: { $toDouble: "$amount" } },
                },
            },
        ]);
        const totalRevenue = revenueResult[0]?.total || 0;

        return res.status(200).json({
            success: true,
            stats: {
                newRequirements,
                pendingQuotations,
                activeOrders,
                totalRevenue,
            },
        });
    } catch (err) {
        console.error("getDashboardStats error:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard stats",
            error: err.message,
        });
    }
}

// ================================
//   DASHBOARD RECENT REQUIREMENTS
// ================================
export async function getDashboardRecentRequirements(req, res) {
    try {
        const recentRequirements = await Requirement.find()
            .sort({ createdAt: -1 })
            .limit(3)
            .select("requirements attachedDocument createdAt");

        const formatted = recentRequirements.map((r) => ({
            id:           r._id,
            createdAt:    r.createdAt,
            itemCount:    r.requirements?.length || 0,
            previewTitle: r.requirements?.[0]?.itemName || "Requirement",
            items: r.requirements?.map((item) => ({
                itemName:             item.itemName,
                quantity:             item.quantity,
                unit:                 item.unit,
                expectedDeliveryDate: item.expectedDeliveryDate,
                notes:                item.notes || "",
            })),
            attachedDocument: r.attachedDocument || null,
        }));

        return res.status(200).json({
            success: true,
            recentRequirements: formatted,
        });
    } catch (err) {
        console.error("getDashboardRecentRequirements error:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch recent requirements",
            error: err.message,
        });
    }
}

// ================================
//   DASHBOARD RECENT ORDERS
// ================================
export async function getDashboardRecentOrders(req, res) {
    try {
        const supplierEmail = req.user.email;

        const recentOrders = await Order.find({
            supplierEmail,
            orderType: "purchase",
        })
            .sort({ createdAt: -1 })
            .limit(3)
            .select("po_id status total date expectedDeliveryDate items payment_terms");

        const formatted = recentOrders.map((order) => ({
            id:                   order._id,
            po_id:                order.po_id,
            status:               order.status,
            total:                order.total,
            date:                 order.date,
            expectedDeliveryDate: order.expectedDeliveryDate || null,
            itemCount:            order.items?.length || 0,
            payment_terms:        order.payment_terms,
        }));

        return res.status(200).json({
            success: true,
            recentOrders: formatted,
        });
    } catch (err) {
        console.error("getDashboardRecentOrders error:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch recent orders",
            error: err.message,
        });
    }
}

// ================================
//   DASHBOARD PENDING PAYMENTS
// ================================
export async function getDashboardPendingPayments(req, res) {
    try {
        const supplierEmail = req.user.email;

        const pendingBills = await Invoice.find({
            supplierEmail,
            invoiceType:    "supplier",
            payment_status: { $in: ["unpaid", "overdue", "partially_paid"] },
        })
            .sort({ date: -1 })
            .select("bill_id purchaseOrderRef total payment_status date due_date tax_amount");

        const formatted = pendingBills.map((bill) => ({
            id:               bill._id,
            bill_id:          bill.bill_id,
            purchaseOrderRef: bill.purchaseOrderRef,
            total:            bill.total,
            payment_status:   bill.payment_status,
            bill_date:        bill.date,
            due_date:         bill.due_date || null,
            isOverdue:
                bill.due_date &&
                new Date(bill.due_date) < new Date() &&
                bill.payment_status !== "paid",
        }));

        const totalPendingAmount = pendingBills.reduce(
            (sum, b) => sum + (b.total || 0), 0
        );

        return res.status(200).json({
            success: true,
            pendingPayments:    formatted,
            totalPendingAmount,
            count:              pendingBills.length,
        });
    } catch (err) {
        console.error("getDashboardPendingPayments error:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch pending payments",
            error: err.message,
        });
    }
}