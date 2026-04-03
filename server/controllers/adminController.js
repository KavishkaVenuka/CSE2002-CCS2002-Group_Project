import Admin from "../models/Admin.js";
import StockItem from "../models/Stock.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";


export async function createAdmin(req, res) {
    try {
        const data = req.body;

        // check if email exists
        const existingAdmin = await Admin.findOne({ email: data.email });
        if (existingAdmin) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const hashedPassword = bcrypt.hashSync(data.password, 10);

        const admin = new Admin({
            email: data.email,
            name: data.name,
            password: hashedPassword,
            role: "Admin",
        });

        await admin.save();

        res.status(201).json({
            message: "Admin registered successfully",
            admin: {
                id: admin._id,
                email: admin.email,
                name: admin.name,
            },
        })

    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
}


export async function loginAdmin(req, res) {
    try {
        const { email, password } = req.body;

        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        const isPasswordCorrect = bcrypt.compareSync(password, admin.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Invalid password" });
        }

        const payload = {
            id: admin._id,
            email: admin.email,
            role: admin.role,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "150h",
        });

        res.json({
            message: "Login successful",
            token,
            admin: payload,
        });

    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
}


export async function addStock(req, res) {
    try {
        const newStock = new StockItem(req.body);
        await newStock.save();
        res.status(201).json({ message: "Stock item added successfully", stock: newStock });
    } catch (error) {
        res.status(500).json({ message: "Error adding stock item", error: error.message });
    }
}

export async function updateStock(req, res) {
    try {
        const { id } = req.params;
        const updatedStock = await StockItem.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedStock) {
            return res.status(404).json({ message: "Stock item not found" });
        }
        res.status(200).json({ message: "Stock item updated successfully", stock: updatedStock });
    } catch (error) {
        res.status(500).json({ message: "Error updating stock item", error: error.message });
    }
}

export async function deleteStock(req, res) {
    try {
        const { id } = req.params;
        const deletedStock = await StockItem.findByIdAndDelete(id);
        if (!deletedStock) {
            return res.status(404).json({ message: "Stock item not found" });
        }
        res.status(200).json({ message: "Stock item deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting stock item", error: error.message });
    }
}