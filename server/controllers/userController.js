import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export async function createUser(req, res) {
    try {
        const { 
            fullName, 
            email, 
            password, 
            role, // "Admin", "Customer", හෝ "Supplier" ලෙස Frontend එකෙන් එවිය යුතුයි
            contactNumber,
            address 
        } = req.body;

        // 1. Validation
        if (!fullName || !email || !password || !role) {
            return res.status(400).json({ message: "Required fields are missing." });
        }

        // 2. පවතින Email එකක්දැයි බැලීම
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // -----------------------------------------------------------
        // 3. ROLE-BASED ID GENERATION (Dynamic Prefix)
        // -----------------------------------------------------------
        let prefix = "";
        if (role === "Admin") prefix = "ADM";
        else if (role === "Customer") prefix = "CUST";
        else if (role === "Supplier") prefix = "SUP";
        else prefix = "USR"; // වෙනත් අවස්ථාවකදී

        // අදාළ Role එකේ අවසාන පරිශීලකයා පමණක් සෙවීම
        const latestUser = await User.findOne({ role: role }).sort({ createdAt: -1 });

        let customID = prefix + "000001"; 

        if (latestUser && latestUser.customID) {
            let latestIDString = latestUser.customID.replace(prefix, "");
            let latestNumber = parseInt(latestIDString);
            let newNumber = latestNumber + 1;
            customID = prefix + newNumber.toString().padStart(6, '0');
        }
        // -----------------------------------------------------------

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            customID, // උදා: CUST000005
            fullName,
            email: email.toLowerCase(),
            password: hashedPassword,
            role, 
            contactNumber,
            address
        });

        await newUser.save();

        res.status(201).json({
            message: `${role} registered successfully`,
            user: { customID, fullName, email, role }
        });

    } catch (err) {
        res.status(500).json({ message: "Registration failed", error: err.message });
    }
}

export async function loginUser(req, res) {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

        const payload = {
            id: user._id,
            customID: user.customID,
            role: user.role, // මෙය Frontend එකේ Routes filter කිරීමට වැදගත් වේ
            fullName: user.fullName
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "150h" });

        res.status(200).json({
            token,
            user: payload // මෙහි Role එක තිබේ
        });
    } catch (err) {
        res.status(500).json({ message: "Login failed", error: err.message });
    }
}