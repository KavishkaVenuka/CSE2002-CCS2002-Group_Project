import Quotation from "../models/Order.js";
import Supplier from "../models/Supplier.js";
import Quotation from "../models/Quotation.js";

exports.getPendingQuotationCount = async (req, res) => {
    try{
        const email = req.params.email;
        const pendingQuotationCount = await Quotation.countDocuments({
             email: email, 
             status: "pending" 
        });
        
        res.status(200).json({ success: true, pendingQuotationCount: pendingQuotationCount });

    } catch (err) {
        res.status(500).json({
             success: false, 
             message: "Error getting pending quotation count", 
             error: err.message });
    }
}

exports.getPendingQuotations = async (req, res) => {
    try{
        const email = req.params.email;
        const pendingQuotations = await Quotation.find({
             email: email, 
             status: "pending" 
        }).sort({ date: -1 }).select('quotationID status date total');
        res.status(200).json({ success: true, pendingQuotations: pendingQuotations });
    } catch (err) {
        res.status(500).json({
             success: false, 
             message: "Error getting pending quotations", 
             error: err.message });
    }
}   

exports.getAcceptedQuotationsCount = async (req, res) => {
    try{
        const {email} = req.query;
        if(!email){
            return res.status(400).json({ success: false, message: "Email is required" });
        }
        const acceptedQuotationCount = await Quotation.countDocuments({
            email: email,
            status: "accepted"
        });
        res.status(200).json({ success: true, email, acceptedQuotationCount: acceptedQuotationCount });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error getting accepted quotation count",
            error: err.message
        });
    }
};

exports.getRejectedQuotationsCount = async (req, res) => {
    try{
        const {email} = req.query;
        if(!email){
            return res.status(400).json({ success: false, message: "Email is required" });
        }
        const rejectedQuotationCount = await Quotation.countDocuments({
            email: email,
            status: "rejected"
        });
        res.status(200).json({ success: true, email, rejectedQuotationCount: rejectedQuotationCount });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error getting rejected quotation count",
            error: err.message
        });
    }
};

exports.getExpiredQuotationsCount = async (req, res) => {
    try{
        const {email} = req.query; 
        if(!email){
            return res.status(400).json({ success: false, message: "Email is required" });
        }
        const currentDate = new Date();
        const expiredQuotationCount = await Quotation.countDocuments({
            email: email,
            status: "pending",
            date: { $lt: currentDate }
        });
        res.status(200).json({ success: true, email, expiredQuotationCount: expiredQuotationCount });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error getting expired quotation count",
            error: err.message
        });
    }
}

exports.getAllQuotationsByCustomer = async (req, res) => {
    try{
        const email = req.params.email;

        if(!email) {
            return res.status(400).json({ success: false, message: "Email is required" });
        }

        const quotations = await Quotation.find({ email: email }).sort({ date: -1 });
        res.status(200).json({ success: true, quotations: quotations });
    } catch (err) {
        res.status(500).json({
            success: false,      
            message: "Error getting quotations for customer",      
            error: err.message
        });
    }
}

exports.getPendingQuotationsByCustomer = async (req, res) => {
    try{
        const email = req.params.email;         
        if(!email) {
            return res.status(400).json({ success: false, message: "Email is required" });
        }

        const pendingQuotations = await Quotation.find({ email: email, status: "pending" }).sort({ date: -1 });
        res.status(200).json({ success: true, pendingQuotations: pendingQuotations });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error getting pending quotations for customer",
            error: err.message
        });
    }
}

exports.rejectQuotation = async (req, res) => {
    try{
        const { quotationID, email } = req.body;
        if(!quotationID || !email) {
            return res.status(400).json({ success: false, message: "Quotation ID and email are required" });
        }
        const quotation = await Quotation.findOne({ _id: quotationID, email: email });

        if(!quotation) {
            return res.status(404).json({ success: false, message: "Quotation not found" });
        }  
        quotation.status = "rejected";
        await quotation.save();
        res.status(200).json({ success: true, message: "Quotation rejected successfully" });
         
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error rejecting quotation",
            error: err.message
        });
    }
}

// ================================
//   CREATE SUPPLIER QUOTATION
// ================================
exports.createSupplierQuotation = async (req, res) => {
    try {
        const supplierId    = req.user.id;
        const supplierEmail = req.user.email;

        const {
            requirementId,
            items,           
            subtotal,
            tax_amount,
            total_estimate,
            currency,
            notes,
            validUntil,
            delivery_timeline, 
            payment_terms,     
            status,            
        } = req.body;

        if (!items || items.length === 0 || !total_estimate) {
            return res.status(400).json({
                success: false,
                message: "items and total_estimate are required",
            });
        }

        // Verify requirement exists
        if (requirementId) {
            const requirement = await Requirement.findById(requirementId);
            if (!requirement) {
                return res.status(404).json({
                    success: false,
                    message: "Requirement not found",
                });
            }
        }

        // Prevent duplicate active quotation for same requirement
        if (requirementId && status !== "draft") {
            const existing = await Quotation.findOne({
                supplierId,
                quotationType: "supplier",
                requirementId,
                status: "pending",
            });
            if (existing) {
                return res.status(409).json({
                    success: false,
                    message: "You already have a pending quotation for this requirement",
                });
            }
        }

        const quotationStatus = status === "draft" ? "draft" : "pending";

        const quotation = new Quotation({
            quotationID:       `SQ-TEMP-${Date.now()}`,
            email:             supplierEmail,
            name:              req.user.fullName || "Supplier",
            address:           "",
            total:             total_estimate,
            phonenumber:       0,
            items: items.map(item => ({
                productID:   item.itemName,   
                name:        item.itemName,
                price:       item.unitPrice || 0,
                quantity:    item.quantity || 0,
                image:       "",
                unit:        item.unit        || "pieces",
                unitPrice:   item.unitPrice   || 0,
                totalPrice:  item.totalPrice  || 0,
                description: item.description || "",
            })),
            requirementId:     requirementId || null,
            supplierId,
            supplierEmail,
            total_estimate,
            subtotal:          subtotal       || 0,
            tax_amount:        tax_amount     || 0,
            currency:          currency       || "LKR",
            notes:             notes          || "",
            validUntil:        validUntil     || null,
            delivery_timeline: delivery_timeline || "",
            payment_terms:     payment_terms  || "Net 30",
            quotationType:     "supplier",
            status:            quotationStatus,
        });

        await quotation.save();

        quotation.quotationID = quotation.sq_id;
        await quotation.save();

        if (requirementId && quotationStatus === "pending") {
            await Supplier.findByIdAndUpdate(supplierId, {
                $addToSet: { quotedRequirementIds: requirementId },
            });
        }

        return res.status(201).json({
            success: true,
            message: quotationStatus === "draft"
                ? "Quotation saved as draft"
                : "Quotation submitted successfully",
            quotation: {
                id:        quotation._id,
                sq_id:     quotation.sq_id,
                status:    quotation.status,
                total:     quotation.total_estimate,
                createdAt: quotation.createdAt,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================================
//   GET ALL QUOTATIONS FOR THIS SUPPLIER
// ================================
exports.getSupplierQuotations = async (req, res) => {
    try {
        const supplierEmail = req.user.email;

        const quotations = await Quotation.find({
            supplierEmail,
            quotationType: "supplier",
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            quotations,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ================================
//   GET SINGLE SUPPLIER QUOTATION
// ================================
exports.getSupplierQuotationById = async (req, res) => {
    try {
        const supplierEmail = req.user.email;

        const quotation = await Quotation.findOne({
            _id:           req.params.id,
            supplierEmail,
            quotationType: "supplier",
        });

        if (!quotation) {
            return res.status(404).json({
                success: false,
                message: "Quotation not found",
            });
        }

        return res.status(200).json({
            success: true,
            quotation,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ================================
//   UPDATE / EDIT A DRAFT QUOTATION
// ================================
exports.updateSupplierQuotation = async (req, res) => {
    try {
        const supplierId    = req.user.id;
        const supplierEmail = req.user.email;

        const quotation = await Quotation.findOne({
            _id:           req.params.id,
            supplierId,
            quotationType: "supplier",
        });

        if (!quotation) {
            return res.status(404).json({ success: false, message: "Quotation not found" });
        }

        // Only drafts can be edited freely; pending can only have notes/terms edited
        if (quotation.status !== "draft" && quotation.status !== "pending") {
            return res.status(400).json({
                success: false,
                message: "Only draft or pending quotations can be edited",
            });
        }

        const {
            items,
            subtotal,
            tax_amount,
            total_estimate,
            currency,
            notes,
            validUntil,
            delivery_timeline,
            payment_terms,
            status,
        } = req.body;

        if (items) {
            quotation.items = items.map(item => ({
                productID:   item.itemName,
                name:        item.itemName,
                price:       item.unitPrice || 0,
                quantity:    item.quantity  || 0,
                image:       "",
                unit:        item.unit        || "pieces",
                unitPrice:   item.unitPrice   || 0,
                totalPrice:  item.totalPrice  || 0,
                description: item.description || "",
            }));
        }

        if (subtotal       !== undefined) quotation.subtotal          = subtotal;
        if (tax_amount     !== undefined) quotation.tax_amount        = tax_amount;
        if (total_estimate !== undefined) {
            quotation.total_estimate = total_estimate;
            quotation.total          = total_estimate;
        }
        if (currency          ) quotation.currency          = currency;
        if (notes      !== undefined) quotation.notes       = notes;
        if (validUntil        ) quotation.validUntil        = validUntil;
        if (delivery_timeline ) quotation.delivery_timeline = delivery_timeline;
        if (payment_terms     ) quotation.payment_terms     = payment_terms;

        // Allow promoting a draft to submitted
        if (status === "pending" && quotation.status === "draft") {
            quotation.status = "pending";
            if (quotation.requirementId) {
                await Supplier.findByIdAndUpdate(supplierId, {
                    $addToSet: { quotedRequirementIds: quotation.requirementId },
                });
            }
        }

        await quotation.save();

        return res.status(200).json({
            success: true,
            message: quotation.status === "draft"
                ? "Draft updated successfully"
                : "Quotation updated successfully",
            quotation: {
                id:        quotation._id,
                sq_id:     quotation.sq_id,
                status:    quotation.status,
                total:     quotation.total_estimate,
                updatedAt: quotation.updatedAt,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================================
//   SUBMIT A SAVED DRAFT
// ================================
exports.submitDraftQuotation = async (req, res) => {
    try {
        const supplierId = req.user.id;

        const quotation = await Quotation.findOne({
            _id:           req.params.id,
            supplierId,
            quotationType: "supplier",
            status:        "draft",
        });

        if (!quotation) {
            return res.status(404).json({
                success: false,
                message: "Draft quotation not found",
            });
        }

        quotation.status = "pending";
        await quotation.save();

        if (quotation.requirementId) {
            await Supplier.findByIdAndUpdate(supplierId, {
                $addToSet: { quotedRequirementIds: quotation.requirementId },
            });
        }

        return res.status(200).json({
            success: true,
            message: "Quotation submitted successfully",
            quotation: {
                id:     quotation._id,
                sq_id:  quotation.sq_id,
                status: quotation.status,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================================
//   QUOTATION STATUS PAGE - STAT CARDS
// ================================
exports.getSupplierQuotationStats = async (req, res) => {
    try {
        const supplierId = req.user.id;

        const pending = await Quotation.countDocuments({
            supplierId, quotationType: "supplier", status: "pending"
        });
        const approved = await Quotation.countDocuments({
            supplierId, quotationType: "supplier", status: "accepted"
        });
        const rejected = await Quotation.countDocuments({
            supplierId, quotationType: "supplier", status: "rejected"
        });

        return res.status(200).json({
            success: true,
            stats: { pending, approved, rejected },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================================
//   QUOTATION STATUS PAGE - TABLE
// ================================
exports.getSupplierQuotationsTable = async (req, res) => {
    try {
        const supplierEmail = req.user.email;
        const { status, search } = req.query;

        const filter = { supplierEmail, quotationType: "supplier" };
        if (status) filter.status = status;
        if (search) {
            filter.$or = [
                { sq_id: { $regex: search, $options: "i" } },
                { quotationID: { $regex: search, $options: "i" } },
            ];
        }

        const quotations = await Quotation.find(filter)
            .sort({ createdAt: -1 });

        const formatted = quotations.map((q) => ({
            id:            q._id,
            sq_id:         q.sq_id,
            quotationID:   q.quotationID,
            requirementId: q.requirementId
                ? `REQ-${q.requirementId.toString().slice(-5).toUpperCase()}`
                : null,
            requirementObjectId: q.requirementId || null,
            customerName:  "Hardware Store",   // Admin side customer — adjust if your Requirement model stores customer name
            total_estimate: q.total_estimate,
            date:          q.createdAt,
            status:        q.status,
            adminNotes:    q.adminNotes || null,
        }));

        return res.status(200).json({ success: true, quotations: formatted });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================================
//   QUOTATION DETAIL BOX
// ================================
exports.getSupplierQuotationDetail = async (req, res) => {
    try {
        const supplierId = req.user.id;

        const q = await Quotation.findOne({
            _id: req.params.id,
            supplierId,
            quotationType: "supplier",
        });

        if (!q) {
            return res.status(404).json({ success: false, message: "Quotation not found" });
        }

        return res.status(200).json({
            success: true,
            quotation: {
                id:            q._id,
                sq_id:         q.sq_id,
                requirementId: q.requirementId
                    ? `REQ-${q.requirementId.toString().slice(-5).toUpperCase()}`
                    : null,
                requirementObjectId: q.requirementId || null,
                customerName:  "Hardware Store",
                date:          q.createdAt,
                total_estimate: q.total_estimate,
                status:        q.status,
                adminNotes:    q.adminNotes || null,
                items:         q.items,
                notes:         q.notes,
                delivery_timeline: q.delivery_timeline || null,
                payment_terms: q.payment_terms || null,
                validUntil:    q.validUntil || null,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};