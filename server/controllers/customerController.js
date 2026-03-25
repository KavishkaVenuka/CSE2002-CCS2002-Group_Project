import Customer from "../models/Customer.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// ==========================================
// 1. REGISTER CUSTOMER (With Auto-ID)
// ==========================================
export async function createCustomer(req, res) {
    try {
        const { 
            fullName, 
            companyName, 
            vatNumber, 
            email, 
            contactNumber, 
            address,
            password 
        } = req.body;

        // මූලික පරීක්ෂාව (Validation)
        if (!fullName || !email || !contactNumber || !address || !password) {
            return res.status(400).json({ message: "Required fields are missing." });
        }

        // Email එක කලින් පද්ධතියේ තිබේදැයි බැලීම
        const existingCustomer = await Customer.findOne({ email: email.toLowerCase() });
        if (existingCustomer) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // මුරපදය Hash කිරීම
        const hashedPassword = await bcrypt.hash(password, 10);

        // පාරිභෝගිකයා නිර්මාණය කිරීම
        // (customerId එක ස්වයංක්‍රීයව Model එකේ ඇති pre-save hook මගින් හැදේ)
        const customer = new Customer({
            fullName, 
            companyName: companyName || null,
            vatNumber: vatNumber || null,
            contactNumber,
            address,
            email: email.toLowerCase(),
            password: hashedPassword,
            role: "Customer",
        });

        await customer.save();

        res.status(201).json({
            message: "Customer registered successfully",
            customer: {
                id: customer._id,
                customerId: customer.customerId, // ස්වයංක්‍රීයව ජනනය වූ ID එක
                fullName: customer.fullName,
                email: customer.email,
            },
        });
    } catch (err) {
        res.status(500).json({ message: "Registration failed", error: err.message });
    }
}

// ==========================================
// 2. LOGIN CUSTOMER
// ==========================================
export async function loginCustomer(req, res) {
    try {
        const { email, password } = req.body;

        const customer = await Customer.findOne({ email: email.toLowerCase() });
        if (!customer) {
            return res.status(404).json({ message: "Account not found" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, customer.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // JWT Token එක සඳහා අවශ්‍ය දත්ත (Payload)
        const payload = {
            id: customer._id,
            customerId: customer.customerId, // Relationship සඳහා මෙය වැදගත් වේ
            email: customer.email,
            fullName: customer.fullName,
            role: customer.role,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "150h",
        });

        return res.status(200).json({
            message: "Login successful",
            token,
            customer: payload,
        });

    } catch (err) {
        res.status(500).json({ message: "Login failed", error: err.message });
    }
}

// ==========================================
// 3. GET ALL CUSTOMERS (Admin use)
// ==========================================
export async function getAllCustomers(req, res) {
    try {
        const customers = await Customer.find().select("-password");
        res.status(200).json(customers);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch customers", error: err.message });
    }
}

// ==========================================
// 4. UPDATE CUSTOMER
// ==========================================
export async function updateCustomer(req, res) {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // මුරපදය මෙතැනින් යාවත්කාලීන කිරීම වැළැක්වීම
        if (updateData.password) delete updateData.password;
        // customerId එක වෙනස් කිරීමට ඉඩ නොදීම (දත්ත සමුදාය සම්බන්ධතා බිඳෙන බැවින්)
        if (updateData.customerId) delete updateData.customerId;

        const updatedCustomer = await Customer.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        ).select("-password");

        if (!updatedCustomer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        res.status(200).json({
            message: "Profile updated successfully",
            customer: updatedCustomer,
        });

    } catch (err) {
        res.status(500).json({ message: "Update failed", error: err.message });
    }
}

// ==========================================
// 5. DELETE CUSTOMER
// ==========================================
export async function deleteCustomer(req, res) {
    try {
        const { id } = req.params;
        const deletedCustomer = await Customer.findByIdAndDelete(id);

        if (!deletedCustomer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        res.status(200).json({ message: "Account deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Delete failed", error: err.message });
    }
}