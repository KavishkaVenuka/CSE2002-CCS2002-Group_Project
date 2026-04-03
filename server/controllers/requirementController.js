import Requirement from "../models/Requirement.js";
import Supplier from "../models/Supplier.js";
import Quotation from "../models/Quotation.js";

exports.createRequirement = async (req, res) => {
    try {
        const { requirements } = req.body;

        const newRequirement = new Requirement({ 
            requirements,
            attachedDocument: req.file ? req.file.path : null 
        });

        const savedRequirement = await newRequirement.save();

        res.status(201).json({
            success: true, 
            message: "Requirement created successfully", 
            data: savedRequirement 
        });

    } catch (error) {
        res.status(400).json({ 
            success: false,
            message: error.message 
        });
    }
}

// ================================
//   GET ALL REQUIREMENTS WITH FILTERS
// ================================
export const getAllRequirements = async (req, res) => {
    try {
        const supplierId = req.user.id;
        const { status, search } = req.query;

        const filter = {};
        if (search) {
            filter._id = search;
        }

        const requirements = await Requirement.find(filter)
            .sort({ createdAt: -1 });

        const supplierQuotations = await Quotation.find({
            supplierId,
            quotationType: "supplier",
            requirementId: { $ne: null },
        }).select("requirementId status");

        const quotationMap = {};
        supplierQuotations.forEach((q) => {
            quotationMap[q.requirementId.toString()] = q.status;
        });

        const formatted = requirements.map((r) => {
            const reqId = r._id.toString();
            const quotationStatus = quotationMap[reqId];

            let derivedStatus = "new";
            if (quotationStatus === "pending")   derivedStatus = "quoted";
            if (quotationStatus === "accepted")  derivedStatus = "in_progress";
            if (quotationStatus === "completed") derivedStatus = "completed";

            // Total quantity across all items in this requirement
            const totalQty = r.requirements?.reduce(
                (sum, item) => sum + (item.quantity || 0), 0
            ) || 0;

            // Earliest expected delivery date across all items
            const deliveryDates = r.requirements
                ?.map((item) => item.expectedDeliveryDate)
                .filter(Boolean)
                .sort();
            const expectedDelivery = deliveryDates?.[0] || null;

            return {
                id:               r._id,
                requirementId:    `REQ-${r._id.toString().slice(-5).toUpperCase()}`,
                createdAt:        r.createdAt,
                itemCount:        r.requirements?.length || 0,
                totalQty,
                expectedDelivery,
                hasDocument:      !!r.attachedDocument,
                attachedDocument: r.attachedDocument || null,
                status:           derivedStatus,
                items: r.requirements?.map((item) => ({
                    itemName:             item.itemName,
                    quantity:             item.quantity,
                    unit:                 item.unit,
                    expectedDeliveryDate: item.expectedDeliveryDate,
                    notes:                item.notes || "",
                })),
            };
        });

        const filtered = status
            ? formatted.filter((r) => r.status === status)
            : formatted;

        return res.status(200).json({
            success: true,
            count: filtered.length,
            requirements: filtered,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ================================
//   GET SINGLE REQUIREMENT DETAIL
// ================================
export const getRequirementById = async (req, res) => {
    try {
        const supplierId = req.user.id;

        const requirement = await Requirement.findById(req.params.id);

        if (!requirement) {
            return res.status(404).json({
                success: false,
                message: "Requirement not found",
            });
        }

        // Check if this supplier already submitted a quotation
        const existingQuotation = await Quotation.findOne({
            supplierId,
            quotationType: "supplier",
            requirementId: requirement._id,
        }).select("sq_id status total_estimate createdAt");

        // Derive status same logic as getAllRequirements
        let derivedStatus = "new";
        if (existingQuotation) {
            if (existingQuotation.status === "pending")   derivedStatus = "quoted";
            if (existingQuotation.status === "accepted")  derivedStatus = "in_progress";
            if (existingQuotation.status === "completed") derivedStatus = "completed";
        }

        // Earliest expected delivery across all items
        const deliveryDates = requirement.requirements
            ?.map((item) => item.expectedDeliveryDate)
            .filter(Boolean)
            .sort();
        const expectedDelivery = deliveryDates?.[0] || null;

        return res.status(200).json({
            success: true,
            requirement: {
                id:            requirement._id,
                requirementId: `REQ-${requirement._id.toString().slice(-5).toUpperCase()}`,
                createdAt:     requirement.createdAt,
                expectedDelivery,
                status:        derivedStatus,
                items: requirement.requirements?.map((item) => ({
                    itemName:             item.itemName,
                    quantity:             item.quantity,
                    unit:                 item.unit,
                    expectedDeliveryDate: item.expectedDeliveryDate,
                    notes:                item.notes || "",
                })),
                attachedDocument:  requirement.attachedDocument || null,
                existingQuotation: existingQuotation
                    ? {
                        id:             existingQuotation._id,
                        sq_id:          existingQuotation.sq_id,
                        status:         existingQuotation.status,
                        total_estimate: existingQuotation.total_estimate,
                        createdAt:      existingQuotation.createdAt,
                    }
                    : null,
                // Tells the frontend whether to show
                // "Prepare Quotation" or disable the button
                canQuote: !existingQuotation || 
                          existingQuotation.status === "rejected" || 
                          existingQuotation.status === "expired",
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ================================
//   GET REQUIREMENT PAGE STAT CARDS
// ================================
export const getRequirementStats = async (req, res) => {
    try {
        const supplierId = req.user.id;

        // Get all requirements
        const allRequirements = await Requirement.find()
            .select("_id");

        // Get all quotations by this supplier
        const supplierQuotations = await Quotation.find({
            supplierId,
            quotationType: "supplier",
            requirementId: { $ne: null },
        }).select("requirementId status");

        // Build lookup map
        const quotationMap = {};
        supplierQuotations.forEach((q) => {
            quotationMap[q.requirementId.toString()] = q.status;
        });

        // Count each status bucket using same derivation logic
        let newCount        = 0;
        let quotedCount     = 0;
        let inProgressCount = 0;
        let completedCount  = 0;

        allRequirements.forEach((r) => {
            const quotationStatus = quotationMap[r._id.toString()];

            if (!quotationStatus || 
                quotationStatus === "rejected" || 
                quotationStatus === "expired") {
                newCount++;
            } else if (quotationStatus === "pending") {
                quotedCount++;
            } else if (quotationStatus === "accepted") {
                inProgressCount++;
            } else if (quotationStatus === "completed") {
                completedCount++;
            }
        });

        return res.status(200).json({
            success: true,
            stats: {
                new:         newCount,
                quoted:      quotedCount,
                in_progress: inProgressCount,
                completed:   completedCount,
                total:       allRequirements.length,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
