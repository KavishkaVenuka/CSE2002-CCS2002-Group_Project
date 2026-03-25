import Supplier from "../models/Supplier.js";
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