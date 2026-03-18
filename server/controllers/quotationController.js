import Quotation from "../models/Order.js";

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
