import Customer from "../models/Customer.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// ================================
//   REGISTER CUSTOMER (VAT CUSTOMER)
// ================================
export async function createCustomer(req, res) {
    try {
        const data = req.body;

        // Check existing email
        const existingCustomer = await Customer.findOne({ email: data.email });
        if (existingCustomer) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(data.password, 10);

        // Create customer
        const customer = new Customer({
            companyName: data.companyName,
            businessRegistrationNumber: data.businessRegistrationNumber,
            vatNumber: data.vatNumber,
            taxIdentificationNumber: data.taxIdentificationNumber,
            contactNumber: data.contactNumber,
            email: data.email,
            address: data.address,
            businessType: data.businessType,
            natureOfBusiness: data.natureOfBusiness,
            productCategories: data.productCategories || [],
            password: hashedPassword,
            role: "Customer",
        });

        await customer.save();

        res.status(201).json({
            message: "Customer registered successfully",
            customer: {
                id: customer._id,
                email: customer.email,
                companyName: customer.companyName,
            },
        });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
}

// ================================
//        LOGIN CUSTOMER
// ================================
export async function loginCustomer(req, res) {
    try {
        const { email, password } = req.body;

        // Check if email exists
        const customer = await Customer.findOne({ email });
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        // Compare password
        const isPasswordCorrect = await bcrypt.compare(password, customer.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Invalid password" });
        }

        // Payload for JWT
        const payload = {
            id: customer._id,
            email: customer.email,
            companyName: customer.companyName,
            businessRegistrationNumber: customer.businessRegistrationNumber,
            businessType: customer.businessType,
            contactNumber: customer.contactNumber,
            role: customer.role,
        };

        // Generate token
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "150h",
        });

        return res.status(200).json({
            message: "Login successful",
            token,
            customer: payload,
        });

    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
}
