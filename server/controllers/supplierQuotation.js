import SupplierQuotation from "../models/supplierQuotation.js";
import SupplierRequirement from "../models/supplierRequirement.js";
import User from "../models/User.js";
import SupplierOrder from "../models/supplierOrder.js";

export const getPendingQuotationCount = async (req, res) => {
    try{
        const email = req.params.email;
        const pendingQuotationCount = await SupplierQuotation.countDocuments({
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
        const pendingQuotations = await SupplierQuotation.find({
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
        const acceptedQuotationCount = await SupplierQuotation.countDocuments({
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
        const rejectedQuotationCount = await SupplierQuotation.countDocuments({
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
        const expiredQuotationCount = await SupplierQuotation.countDocuments({
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
        const quotations = await SupplierQuotation.find().sort({ createdAt: -1 });
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

        const quotations = await SupplierQuotation.find({ customerId }).sort({ createdAt: -1 });
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

        const pendingQuotations = await SupplierQuotation.find({ email: email, status: "pending" }).sort({ date: -1 });
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
        const quotation = await SupplierQuotation.findById(id);

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
        const quotation = await SupplierQuotation.findById(id);

        if(!quotation) {
            return res.status(404).json({ success: false, message: "Quotation not found" });
        }  
        quotation.status = "accepted";
        await quotation.save();

        // Automatically create a Purchase Order in the SupplierOrder collection (NOT customer orders)
        const purchaseOrder = new SupplierOrder({
            orderID: `PO-${Date.now()}`,
            quotationRef: quotation.sq_id || quotation.quotationID,
            supplierId: quotation.supplierId,
            supplierEmail: quotation.email,
            name: "Hardware Store", // Admin's business name (Receiver of goods)
            email: quotation.email,
            items: quotation.items.map(item => ({
                productID: item.productID,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                unit: item.unit
            })),
            total: quotation.total,
            totalCost: quotation.total,
            status: "Pending",
            date: new Date(),
            phonenumber: quotation.phonenumber || 0,
            address: "Main Warehouse, Hardware Store"
        });
        await purchaseOrder.save();

        res.status(200).json({ success: true, message: "Quotation accepted and Purchase Order created successfully" });
         
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error accepting quotation",
            error: err.message
        });
    }
}

// ================================
//   CREATE SUPPLIER QUOTATION
// ================================
export const createSupplierQuotation = async (req, res) => {
    try {
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

        // Verify supplier requirement exists
        if (requirementId) {
            const requirement = await SupplierRequirement.findById(requirementId);
            if (!requirement) {
                return res.status(404).json({
                    success: false,
                    message: "Supplier Requirement not found",
                });
            }
        }

        // Prevent duplicate active quotation for same requirement + supplier
        if (requirementId && supplierId && status !== "draft") {
            const existing = await SupplierQuotation.findOne({
                supplierId,
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

        const quotation = new SupplierQuotation({
            quotationID:       `QT-TEMP-${Date.now()}`,
            email:             supplierEmail || "unknown@supplier",
            name:              req.user?.fullName || "Supplier",
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
            status:            quotationStatus,
        });

        await quotation.save();

        // Update SupplierRequirement status to 'quoted'
        if (requirementId && quotationStatus === "pending") {
            await SupplierRequirement.findByIdAndUpdate(requirementId, { status: "quoted" });
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

        const { status } = req.query;

        const query = { supplierEmail };
        if (status && status !== 'all') {
            query.status = status;
        }

        const quotations = await SupplierQuotation.find(query).sort({ createdAt: -1 });

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

        const quotation = await SupplierQuotation.findOne({
            _id:           req.params.id,
            supplierEmail
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

        const quotation = await SupplierQuotation.findOne({
            _id:           req.params.id,
            supplierId
        });

        if (!quotation) {
            return res.status(404).json({ success: false, message: "Quotation not found" });
        }

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

        if (status === "pending" && quotation.status === "draft") {
            quotation.status = "pending";
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

        const quotation = await SupplierQuotation.findOne({
            _id:           req.params.id,
            supplierId,
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
//   GET QUOTATION STATS FOR SUPPLIER
// ================================
export const getSupplierQuotationStats = async (req, res) => {
    try {
        const supplierEmail = req.user.email;

        const [total, pending, approved, rejected] = await Promise.all([
            SupplierQuotation.countDocuments({ supplierEmail }),
            SupplierQuotation.countDocuments({ supplierEmail, status: "pending" }),
            SupplierQuotation.countDocuments({ supplierEmail, status: "accepted" }),
            SupplierQuotation.countDocuments({ supplierEmail, status: "rejected" })
        ]);

        return res.status(200).json({
            success: true,
            stats: { total, pending, approved, rejected }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
