import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// =====================
// CREATE USER
// =====================
export async function createUser(req, res) {
    try {
        const data = req.body;

        // check if email exists
        const existingUser = await User.findOne({ email: data.email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const hashedPassword = bcrypt.hashSync(data.password, 10);

        const user = new User({
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            password: hashedPassword,
            role: data.role,
        });

        await user.save();

        res.json({ message: "User created successfully" });

    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
}

// =====================
// LOGIN USER
// =====================
export async function loginUser(req, res) {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isPasswordCorrect = bcrypt.compareSync(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Invalid password" });
        }

        const payload = {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            isEmailVerified: user.isEmailVerified,
            image: user.image,
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

// =====================
// GET CURRENT USER
// =====================
export async function getCurrentUser(req, res) {
    try {
        // `verifyToken` middleware attaches `req.user` when a valid token is provided
        if (!req.user) {
            return res.status(401).json({ message: "Authentication required" });
        }

        // Return the token payload as the current user info. If you prefer the
        // complete fresh record from DB, you can query User.findOne({ email: req.user.email })
        // and exclude the password field.
        res.json(req.user);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
}

// =====================
// ADMIN CHECK (MIDDLEWARE)
// =====================
export function isAdmin(req, res, next) {
    if (!req.user) {
        return res.status(401).json({ message: "Access denied" });
    }

    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access only" });
    }

    next();
}
