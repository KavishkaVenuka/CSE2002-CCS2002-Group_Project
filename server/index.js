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


// Public routes — NO auth middleware (login & register must be accessible without a token)
app.use("/api/users", userRouter)

// Protected routes — verifyToken applied only here
app.use("/api/stocks", verifyToken, stockRouter)
app.use("/api/finance", verifyToken, financeRouter)
app.use("/api/bankAccounts", verifyToken, bankAccountRoutes)
app.use("/api/paymentTransactions", verifyToken, paymentTransactionRoutes)
app.use("/api/requirements", verifyToken, requirementRouter)
app.use("/api/orders", verifyToken, orderRouter)
app.use("/api/quotations", verifyToken, quotationRouter)
app.use("/api/invoices", verifyToken, invoiceRouter)
app.use("/api/suppliers", verifyToken, supplierRequirementRouter)
app.use("/api/suppliers/quotations", verifyToken, supplierQuotationRouter)
app.use("/api/supplier-orders", verifyToken, supplierOrderRouter)
app.use("/api/supplier-invoices", verifyToken, supplierInvoiceRouter)
app.use("/api/supplier-payments", verifyToken, supplierPaymentTransactionRouter)
app.use("/api/dashboard", verifyToken, dashboardRouter)


app.listen(5900, () => {
    console.log("server is running")
})