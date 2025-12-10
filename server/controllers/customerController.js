import Customer from "../models/Customer.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export async function createCustomer(req, res) {
    try {
        const data = req.body;

        
        const existingCustomer = await Customer.findOne({ email: data.email });
        if (existingCustomer) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const hashedPassword = bcrypt.hashSync(data.password, 10);

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
                role: "Customer", // default role
    });

        await customer.save();

        res.status(201).json({
            message: "Customer registered successfully",
            Customer: {
                id: customer._id,
                email: customer.email,
                companyName: customer.companyName,
                role: customer.role,
      },
    });

    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
}

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