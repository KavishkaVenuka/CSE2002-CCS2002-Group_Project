import Requirement from "../models/Requirement.js";
import User from "../models/User.js";
import mongoose from "mongoose";

// ==========================================
// 1. GET ALL CUSTOMER REQUIREMENTS (For Admin)
// ==========================================
// මෙමගින් Admin හට සියලුම පාරිභෝගිකයින්ගේ දත්ත දැකගත හැක.
export const getAllRequirements = async (req, res) => {
    try {
        const { status, search, customerId } = req.query;

        const filter = {};
        
        // පාරිභෝගිකයෙකු තමන්ගේ දත්ත බලනවා නම් customerId අනුව filter වේ.
        // Admin බලනවා නම් customerId අවශ්‍ය නැත, එවිට සියලුම දත්ත පෙන්වයි.
        if (customerId) filter.customerId = customerId;
        if (status && status !== "All Requests") filter.status = status.toLowerCase();
        
        // ID එකෙන් search කිරීමට
        if (search) filter._id = search;

        const requirements = await Requirement.find(filter)
            .populate("customerId", "fullName companyName email") // User model එකෙන් දත්ත ලබා ගැනීම
            .sort({ createdAt: -1 });

        const formatted = requirements.map((r) => {
            // මුළු ප්‍රමාණය ගණනය කිරීම
            const totalQty = r.requirements?.reduce(
                (sum, item) => sum + (item.quantity || 0), 0
            ) || 0;

            return {
                id: r._id,
                requirementId: `REQ-${r._id.toString().slice(-5).toUpperCase()}`,
                customerName: r.customerId?.fullName || "Unknown Customer",
                companyName: r.customerId?.companyName || "N/A",
                items: r.requirements?.map(i => i.itemName).join(", "), // පින්තූරයේ ඇති ලෙස summary එකක්
                totalQty,
                requestDate: r.createdAt,
                status: r.status, // pending, quoted, accepted, delivered
                attachedDocument: r.attachedDocument || null,
            };
        });

        return res.status(200).json({
            success: true,
            count: formatted.length,
            requirements: formatted,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==========================================
// 2. GET REQUIREMENT BY ID (Admin & Customer)
// ==========================================
export const getRequirementById = async (req, res) => {
    try {
        const { customerId } = req.query; 

        const requirement = await Requirement.findById(req.params.id)
            .populate("customerId", "fullName email contactNumber companyName address");

        if (!requirement) {
            return res.status(404).json({ success: false, message: "Requirement not found" });
        }

        // Security: පාරිභෝගිකයෙකු නම් වෙනත් අයගේ දත්ත බැලීම වැලැක්වීම
        // Admin හට ඕනෑම එකක් බැලිය හැක
        const isAdmin = req.user && req.user.role === "Admin";
        if (!isAdmin && customerId && requirement.customerId._id.toString() !== customerId) {
            return res.status(403).json({ success: false, message: "Access Denied" });
        }

        return res.status(200).json({
            success: true,
            requirement: {
                id: requirement._id,
                requirementId: `REQ-${requirement._id.toString().slice(-5).toUpperCase()}`,
                customer: requirement.customerId, // මෙහි සම්පූර්ණ විස්තර ඇත
                status: requirement.status,
                createdAt: requirement.createdAt,
                items: requirement.requirements,
                attachedDocument: requirement.attachedDocument || null
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==========================================
// 3. CREATE REQUIREMENT (Customer Only)
// ==========================================
export const createRequirement = async (req, res) => {
    try {
        const { requirements, customerId } = req.body;

        if (!customerId) {
            return res.status(400).json({ success: false, message: "Customer ID is required" });
        }

        const newRequirement = new Requirement({ 
            requirements: JSON.parse(requirements), // FormData භාවිතා කරන්නේ නම් stringify කර එවිය හැක
            customerId,
            attachedDocument: req.file ? req.file.path : null,
            status: "pending" 
        });

        const savedRequirement = await newRequirement.save();

        res.status(201).json({
            success: true, 
            message: "Request submitted successfully", 
            data: savedRequirement 
        });

    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

// ==========================================
// 4. UPDATE STATUS (Admin Only)
// ==========================================
// පින්තූරයේ ඇති "Send Quote" හෝ "Update Delivery" වැනි button සඳහා
export const updateRequirementStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const { id } = req.params;

        const updated = await Requirement.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: `Status updated to ${status}`,
            data: updated
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};