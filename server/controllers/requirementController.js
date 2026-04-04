import Requirement from "../models/Requirement.js";
import mongoose from "mongoose";

// ==========================================
// 1. GET ALL REQUIREMENTS
//    GET /api/requirements?customerId=&status=&search=
//    Admin → all records | Customer → own records only
// =========================================

// ==========================================
// 2. GET STATS
//    GET /api/requirements/stats?customerId=
//    Frontend stats boxes සඳහා — total, pending, quoted/accepted/delivered
// ==========================================
export const getRequirementStats = async (req, res) => {
    try {
        const { customerId } = req.query;
        const matchStage = customerId
            ? { customerId: new mongoose.Types.ObjectId(customerId) }
            : {};

        const stats = await Requirement.aggregate([
            { $match: matchStage },
            { $group: { _id: "$status", count: { $sum: 1 } } },
        ]);

        const result = { total: 0, new: 0, completed: 0, in_progress: 0, rejected: 0 };

        stats.forEach(({ _id, count }) => {
            result.total += count;
            if (_id === "pending")                      result.new         += count;
            if (_id === "quoted" || _id === "accepted") result.in_progress += count;
            if (_id === "delivered")                    result.completed   += count;
            if (_id === "rejected")                     result.rejected    += count;
        });

        return res.status(200).json({ success: true, stats: result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==========================================
// 3. GET SINGLE REQUIREMENT BY ID
//    GET /api/requirements/:id?customerId=
// ==========================================
export const getRequirementById = async (req, res) => {
    try {
        const { customerId } = req.query;

        const requirement = await Requirement.findById(req.params.id)
            .populate("customerId", "fullName email contactNumber companyName address");

        if (!requirement) {
            return res.status(404).json({ success: false, message: "Requirement not found" });
        }

        // Security: Admin හට ඕනෑම record බැලිය හැක; Customer ට ස්වකීය record පමණි
        const isAdmin = req.user && req.user.role === "Admin";
        if (!isAdmin && customerId && requirement.customerId._id.toString() !== customerId) {
            return res.status(403).json({ success: false, message: "Access Denied" });
        }

        return res.status(200).json({
            success: true,
            requirement: {
                id:               requirement._id,
                requirementId:    `REQ-${requirement._id.toString().slice(-5).toUpperCase()}`,
                customer:         requirement.customerId,
                status:           requirement.status,
                createdAt:        requirement.createdAt,
                items:            requirement.requirements,
                attachedDocument: requirement.attachedDocument || null,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==========================================
// 4. CREATE REQUIREMENT
//    POST /api/requirements   (multipart/form-data)
//    Body: requirements (JSON string), customerId
//    File: attachedDocument (optional)
// ==========================================
export const createRequirement = async (req, res) => {
    try {
        const { requirements, customerId } = req.body;

        if (!customerId) {
            return res.status(400).json({ success: false, message: "Customer ID is required" });
        }

        if (!requirements) {
            return res.status(400).json({ success: false, message: "At least one requirement item is required" });
        }

        const parsedItems = JSON.parse(requirements);

        const newRequirement = new Requirement({
            customerId,
            requirements: parsedItems,
            attachedDocument: req.file ? req.file.path : null,
            status: "pending",
        });

        const saved = await newRequirement.save();

        return res.status(201).json({
            success: true,
            message: "Requirement submitted successfully",
            data: saved,
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// ==========================================
// 5. UPDATE STATUS  (Admin Only)
//    PATCH /api/requirements/:id/status
//    Body: { status }
// ==========================================
export const updateRequirementStatus = async (req, res) => {
    try {
        const { status, rejectReason } = req.body;
        const { id } = req.params;

        const validStatuses = ["pending", "quoted", "accepted", "delivered", "rejected"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: `Invalid status. Must be one of: ${validStatuses.join(", ")}` });
        }

        // Build update payload
        const updatePayload = { status };

        if (status === 'rejected') {
            if (!rejectReason || !rejectReason.trim()) {
                return res.status(400).json({ success: false, message: 'Rejection reason is required when rejecting a requirement.' });
            }
            updatePayload.rejectReason = rejectReason.trim();
        } else {
            // Clear reject reason if status is changed away from rejected
            updatePayload.rejectReason = null;
        }

        const updated = await Requirement.findByIdAndUpdate(
            id,
            updatePayload,
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ success: false, message: "Requirement not found" });
        }

        return res.status(200).json({
            success: true,
            message: `Status updated to "${status}"`,
            data: updated,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getAllRequirements = async (req, res) => {
    try {
        const { status, search, customerId } = req.query;
        const filter = {};

        if (customerId) filter.customerId = customerId;
        if (status && status !== "all") filter.status = status.toLowerCase();

        if (search && mongoose.Types.ObjectId.isValid(search)) {
            filter._id = search;
        }

        const requirements = await Requirement.find(filter)
            .populate("customerId", "fullName companyName email")
            .sort({ createdAt: -1 });

        const formatted = requirements.map((r) => {
            return {
                id: r._id,
                requirementId: `REQ-${r._id.toString().slice(-5).toUpperCase()}`,
                customerName: r.customerId?.fullName || "Unknown Customer",
                companyName:  r.customerId?.companyName || "N/A",
                items: r.requirements,
                itemSummary: r.requirements?.map(i => i.itemName).join(", "),
                createdAt: r.createdAt,
                status: r.status,
                rejectReason: r.rejectReason || null,
                attachedDocument: r.attachedDocument || null,
            };
        });

        return res.status(200).json({
            success: true,
            requirements: formatted,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};