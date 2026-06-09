import express from "express"
import fs from 'fs'
import mongoose from "mongoose"
import jwt from "jsonwebtoken"
import cors from "cors"
import dotenv from "dotenv"
import { verifyToken } from "./middleware/auth.js"
import userRouter from "./routes/userRouter.js"
import stockRouter from "./routes/stockRouter.js"
import financeRouter from "./routes/financeRouter.js"
import bankAccountRoutes from "./routes/bankAccountRouter.js"
import paymentTransactionRoutes from "./routes/paymentTransactionRoutes.js"
import requirementRouter from "./routes/requirementRouter.js"   
import quotationRouter from "./routes/quotationRouter.js"
import orderRouter from "./routes/orderRouter.js"
import invoiceRouter from "./routes/invoiceRouter.js"  
import supplierRequirementRouter from "./routes/supplierrequirementRouter.js"
import supplierQuotationRouter from "./routes/supplierQuotationRouter.js"
import supplierOrderRouter from "./routes/supplierOrderRouter.js"
import supplierInvoiceRouter from "./routes/supplierInvoiceRouter.js"
import supplierPaymentTransactionRouter from "./routes/supplierPaymentTransactionRouter.js"
import dashboardRouter from "./routes/dashboardRouter.js"



dotenv.config()

const mongoURI = process.env.MONGO_URL

mongoose.connect(mongoURI).then(
    () => {
        console.log("Connected to MongoDB Cluster")
    }
)


const app = express()

app.use(cors())

app.use(express.json())
app.use('/uploads', express.static('uploads'))

// Ensure uploads directory exists
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// const orderRoutes = require("./routes/orderRouter.js");
// const requirementRoutes = require("./routes/requirementRouter.js");
// const quotationRoutes = require("./routes/quotationRouter.js");
// const invoiceRoutes = require("./routes/invoiceRouter.js");

// Apply verifyToken globally — populates req.user if a valid Bearer token is present
app.use(verifyToken)


// app.use("/api/admin", adminRouter)  
// app.use("/api/customers", customerRouter)
app.use("/api/users", userRouter)
app.use("/api/stocks", stockRouter)
app.use("/api/finance", financeRouter)
app.use("/api/bankAccounts", bankAccountRoutes)  
app.use("/api/paymentTransactions", paymentTransactionRoutes);
app.use("/api/requirements", requirementRouter);
app.use("/api/orders", orderRouter)
app.use("/api/quotations", quotationRouter)
app.use("/api/invoices", invoiceRouter)
app.use("/api/suppliers", supplierRequirementRouter)
app.use("/api/suppliers/quotations", supplierQuotationRouter)
app.use("/api/supplier-orders", supplierOrderRouter)
app.use("/api/supplier-invoices", supplierInvoiceRouter)
app.use("/api/supplier-payments", supplierPaymentTransactionRouter)
app.use("/api/dashboard", dashboardRouter)

// // Centralized error handler
// app.use(errorHandler)


app.listen(5900,
    () => {
        console.log("server is running")
    }
)