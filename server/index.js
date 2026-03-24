import express from "express"
import mongoose from "mongoose"
import jwt from "jsonwebtoken"
// import productRouter from "./routes/productRouter.js"
import cors from "cors"
import dotenv from "dotenv"
// import errorHandler from "./middleware/errorHandler.js"
// import orderRouter from "./routes/orderRouter.js"
// import requirementRouter from "./routes/requirementRouter.js"
// import quotationRouter from "./routes/quotationRouter.js"
// import adminRouter from "./routes/adminRouter.js"
// import customerRouter from "./routes/customerRouter.js"
// import supplierRouter from "./routes/supplierRouter.js"
import userRouter from "./routes/userRouter.js"
import stockRouter from "./routes/stockRouter.js"
import financeRouter from "./routes/financeRouter.js"
import bankAccountRoutes from "./routes/bankAccountRoutes.js"
import paymentTransactionRoutes from "./routes/paymentTransactionRoutes.js"
// import invoiceRouter from "./routes/invoiceRouter.js"  

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

// const orderRoutes = require("./routes/orderRouter.js");
// const requirementRoutes = require("./routes/requirementRouter.js");
// const quotationRoutes = require("./routes/quotationRouter.js");
// const invoiceRoutes = require("./routes/invoiceRouter.js");

// app.use(
//     // attach user to req if a valid Bearer token is present
//     (req, res, next) => {
//         const authorizationHeader = req.header("Authorization");

//         if (!authorizationHeader) return next();

//         const token = authorizationHeader.replace("Bearer ", "");

//         jwt.verify(token, process.env.JWT_SECRET, (error, content) => {
//             if (error || !content) {
//                 // invalid token — do not block here, just continue without user
//                 console.log("invalid token");
//                 return next();
//             }

//             req.user = content;
//             next();
//         });
//     }
// )

// app.use("/api/admin", adminRouter)  
// app.use("/api/customers", customerRouter)
app.use("/api/users", userRouter)
// app.use("/api/suppliers", supplierRouter)
app.use("/api/stocks", stockRouter)
app.use("/api/finance", financeRouter)
app.use("/api/bankAccounts", bankAccountRoutes)  
app.use("/api/paymentTransactions", paymentTransactionRoutes);


// app.use("/api/orders", orderRoutes)
// app.use("/api/products", productRouter)
// app.use("/api/requirements", requirementRoutes)
// app.use("/api/quotations", quotationRoutes)
// app.use("/api/invoices", invoiceRoutes)

// // Centralized error handler
// app.use(errorHandler)


app.listen(5900,
    () => {
        console.log("server is running")
    }
)