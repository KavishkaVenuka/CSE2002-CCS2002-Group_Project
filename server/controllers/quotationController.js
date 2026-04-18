import Quotation from "../models/Quotation.js";
import Supplier from "../models/Supplier.js";
import Requirement from "../models/Requirement.js";

export const getPendingQuotationCount = async (req, res) => {
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

export const getPendingQuotations = async (req, res) => {
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

export const getAcceptedQuotationsCount = async (req, res) => {
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

export const getRejectedQuotationsCount = async (req, res) => {
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

export const getExpiredQuotationsCount = async (req, res) => {
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

export const getAllQuotations = async (req, res) => {
    try {
        const quotations = await Quotation.find().sort({ date: -1 });
        res.status(200).json({ success: true, quotations: quotations });
    } catch (err) {
        res.status(500).json({
            success: false,      
            message: "Error getting all quotations",      
            error: err.message
        });
    }
}

export const getAllQuotationsByCustomer = async (req, res) => {
    try{
        const customerId = req.params.customerId;

        if(!customerId) {
            return res.status(400).json({ success: false, message: "Customer ID is required" });
        }

        const quotations = await Quotation.find({ customerId }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, quotations: quotations });
    } catch (err) {
        res.status(500).json({
            success: false,      
            message: "Error getting quotations for customer",      
            error: err.message
        });
    }
}

export const getPendingQuotationsByCustomer = async (req, res) => {
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

export const rejectQuotation = async (req, res) => {
    try{
        const id = req.params.id;
        const quotation = await Quotation.findById(id);

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

export const acceptQuotation = async (req, res) => {
    try{
        const id = req.params.id;
        const quotation = await Quotation.findById(id);

        if(!quotation) {
            return res.status(404).json({ success: false, message: "Quotation not found" });
        }  
        quotation.status = "accepted";
        await quotation.save();
        res.status(200).json({ success: true, message: "Quotation accepted successfully" });
         
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error accepting quotation",
            error: err.message
        });
    }
}

// ================================
//   CREATE SUPPLIER / ADMIN QUOTATION
// ================================
export const createSupplierQuotation = async (req, res) => {
    try {
        // Works for both: a logged-in supplier (req.user populated) OR an admin calling on behalf
        const supplierId    = req.user?.id    || null;
        const supplierEmail = req.user?.email || null;

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

        // Verify requirement exists (if linked) and extract the customerId
        let customerId = req.body.customerId || null;
        if (requirementId) {
            const requirement = await Requirement.findById(requirementId);
            if (!requirement) {
                return res.status(404).json({
                    success: false,
                    message: "Requirement not found",
                });
            }
            // Always use the customerId from the Requirement as the source of truth
            customerId = requirement.customerId;
        }

        // Prevent duplicate active quotation for same requirement + supplier
        if (requirementId && supplierId && status !== "draft") {
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
            quotationID:       `QT-TEMP-${Date.now()}`,
            customerId:        customerId    || undefined,   // link to correct customer
            email:             supplierEmail || "admin@system",
            name:              req.user?.fullName || req.user?.name || "Admin",
            address:           "",
            total:             total_estimate,
            phonenumber:       0,
            items: items.map(item => ({
                productID:   item.itemName,
                name:        item.itemName,
                price:       item.unitPrice || 0,
                quantity:    item.quantity  || 0,
                unit:        item.unit        || "pieces",
                unitPrice:   item.unitPrice   || 0,
                totalPrice:  item.totalPrice  || 0,
                description: item.description || "",
            })),
            requirementId:     requirementId || null,
            supplierId:        supplierId    || null,
            supplierEmail:     supplierEmail || null,
            total_estimate,
            subtotal:          subtotal       || 0,
            tax_amount:        tax_amount     || 0,
            currency:          currency       || "LKR",
            notes:             notes          || "",
            validUntil:        validUntil     || null,
            quotationType:     "supplier",
            status:            quotationStatus,
        });

        await quotation.save();

        // Update supplierId-tracked requirements (only if a real supplier is calling)
        if (requirementId && supplierId && quotationStatus === "pending") {
            await Supplier.findByIdAndUpdate(supplierId, {
                $addToSet: { quotedRequirementIds: requirementId },
            });
        }

        // When quotation is SENT (not draft), mark the Requirement as "quoted"
        // Admin side → shows as "Sent" | Customer side → shows as "Received"
        if (requirementId && quotationStatus === "pending") {
            await Requirement.findByIdAndUpdate(requirementId, { status: "quoted" });
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
export const getSupplierQuotations = async (req, res) => {
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
export const getSupplierQuotationById = async (req, res) => {
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
export const updateSupplierQuotation = async (req, res) => {
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
export const submitDraftQuotation = async (req, res) => {
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
export const getSupplierQuotationStats = async (req, res) => {
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
export const getSupplierQuotationsTable = async (req, res) => {
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
export const getSupplierQuotationDetail = async (req, res) => {
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