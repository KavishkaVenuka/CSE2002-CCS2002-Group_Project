import Supplier from "../models/Supplier.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export async function createSupplier(req, res) {
    try {
        const data = req.body;

        const existingSupplier = await Supplier.findOne({ email: data.email });
        if (existingSupplier) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const hashedPassword = bcrypt.hashSync(data.password, 10);

        const supplier = new Supplier({
                companyName: data.companyName,
                businessRegistrationNumber: data.businessRegistrationNumber,
                vatNumber: data.vatNumber,
                contactNumber: data.contactNumber,
                email: data.email,
                address: data.address,
                businessType: data.businessType,
                natureOfBusiness: data.natureOfBusiness,
                productCategories: data.productCategories || [],
                password: hashedPassword,
                role: data.role || "Supplier", // default role
        });

        await supplier.save();

        res.status(201).json({
            message: "Supplier registered successfully",
            Supplier: {
                id: supplier._id,
                email: supplier.email,
                companyName: supplier.companyName,
                role: supplier.role,
            },
        });

    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
}

export async function loginSupplier(req, res) {
    try {
        const { email, password } = req.body;

        const supplier = await Supplier.findOne({ email });
        if (!supplier) {
            return res.status(404).json({ message: "Supplier not found" });
        }

        const isPasswordCorrect = bcrypt.compareSync(password, supplier.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Invalid password" });
        }

        const payload = {
            id: supplier._id,
            email: supplier.email,
            companyName: supplier.companyName,
            businessRegistrationNumber: supplier.businessRegistrationNumber,
            role: supplier.role,
            businessType: supplier.businessType,
            contactNumber: supplier.contactNumber,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "150h",
        });

        res.json({
            message: "Login successful",
            token,
        });

    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
}