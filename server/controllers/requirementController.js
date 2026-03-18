import Requirement from "../models/Requirement.js";

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
