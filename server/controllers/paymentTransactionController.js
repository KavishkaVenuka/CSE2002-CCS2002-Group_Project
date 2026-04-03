import mongoose from "mongoose";
import PaymentTransaction from "../models/PaymentTransaction.js";
import BankAccount from "../models/BankAccount.js";
import Invoice from "../models/Invoice.js";

const parseDecimal = (value) => {
  if (value == null) return 0;
  if (typeof value === "number") return value;
  if (typeof value === "string") return Number(value) || 0;
  if (typeof value === "object" && "$numberDecimal" in value) {
    return Number(value.$numberDecimal) || 0;
  }
  return Number(value) || 0;
};

const getCashInHand = async () => {
  const customerCash = await PaymentTransaction.aggregate([
    {
      $match: {
        status: "completed",
        paymentMethod: "cash",
        type: "customer",
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: { $toDouble: "$amount" } },
      },
    },
  ]);

  const expenseCash = await PaymentTransaction.aggregate([
    {
      $match: {
        status: "completed",
        paymentMethod: "cash",
        type: { $in: ["expense", "supplier"] },
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: { $toDouble: "$amount" } },
      },
    },
  ]);

  return (customerCash[0]?.total || 0) - (expenseCash[0]?.total || 0);
};

const getBankBalance = async (bankAccountId) => {
  const bank = await BankAccount.findById(bankAccountId);
  if (!bank) return 0;

  const openingBalance = parseDecimal(bank.opening_balance);

  const income = await PaymentTransaction.aggregate([
    {
      $match: {
        status: "completed",
        paymentMethod: "bank",
        type: "customer",
        bankAccountId: new mongoose.Types.ObjectId(bankAccountId),
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: { $toDouble: "$amount" } },
      },
    },
  ]);

  const outflow = await PaymentTransaction.aggregate([
    {
      $match: {
        status: "completed",
        paymentMethod: "bank",
        type: { $in: ["expense", "supplier"] },
        bankAccountId: new mongoose.Types.ObjectId(bankAccountId),
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: { $toDouble: "$amount" } },
      },
    },
  ]);

  return openingBalance + (income[0]?.total || 0) - (outflow[0]?.total || 0);
};

export const getPayments = async (req, res) => {
  try {
    const payments = await PaymentTransaction.find().sort({ date: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: payments.length,
      payments,
    });
  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch payments",
      error: error.message,
    });
  }
};

export const addPayment = async (req, res) => {
  try {
    const {
      type,
      category,
      relatedEntity,
      amount,
      paymentMethod,
      bankAccountId,
      bankAccountName,
      date,
      status,
      notes,
      receiptUrl,
    } = req.body;

    const numericAmount = Number(amount);

    if (!type || !category || !relatedEntity || !date || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: "type, category, relatedEntity, paymentMethod and date are required",
      });
    }

    if (!["expense", "supplier", "customer"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment type",
      });
    }

    if (!["cash", "bank"].includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: "Payment method must be cash or bank",
      });
    }

    if (!["pending", "completed", "failed"].includes(status || "completed")) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    if (!numericAmount || numericAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be greater than 0",
      });
    }

    if (paymentMethod === "bank") {
      if (!bankAccountId) {
        return res.status(400).json({
          success: false,
          message: "Bank account is required for bank transfer",
        });
      }

      const bank = await BankAccount.findById(bankAccountId);
      if (!bank) {
        return res.status(404).json({
          success: false,
          message: "Selected bank account not found",
        });
      }
    }

    if (status === "completed") {
      if (paymentMethod === "cash" && (type === "expense" || type === "supplier")) {
        const cashInHand = await getCashInHand();

        if (numericAmount > cashInHand) {
          return res.status(400).json({
            success: false,
            message: `Not enough cash in hand. Available cash: ${cashInHand}`,
          });
        }
      }

      if (paymentMethod === "bank" && (type === "expense" || type === "supplier")) {
        const bankBalance = await getBankBalance(bankAccountId);

        if (numericAmount > bankBalance) {
          return res.status(400).json({
            success: false,
            message: `Not enough bank balance. Available balance: ${bankBalance}`,
          });
        }
      }
    }

    const payment = await PaymentTransaction.create({
      type,
      category,
      relatedEntity,
      amount: numericAmount,
      paymentMethod,
      bankAccountId: paymentMethod === "bank" ? bankAccountId : null,
      bankAccountName: paymentMethod === "bank" ? bankAccountName || "" : "",
      date,
      status: status || "completed",
      notes: notes || "",
      receiptUrl: receiptUrl || "",
    });

    res.status(201).json({
      success: true,
      message: "Payment added successfully",
      payment,
    });
  } catch (error) {
    console.error("Error adding payment:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add payment",
      error: error.message,
    });
  }
};

export const deletePayment = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await PaymentTransaction.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Payment deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting payment:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete payment",
      error: error.message,
    });
  }
};

// ================================
//   GET PAYMENT HISTORY FOR SUPPLIER
// ================================
export const getSupplierPayments = async (req, res) => {
    try {
        const supplierEmail = req.user.email;

        const payments = await PaymentTransaction.find({
            relatedEntity: supplierEmail,
            type:          "supplier",
        }).sort({ date: -1 });

        const formatted = payments.map((p) => ({
            id:               p._id,
            transaction_id:   p.transaction_id,
            amount:           parseDecimal(p.amount),
            paymentMethod:    p.paymentMethod,
            date:             p.date,
            status:           p.status,
            category:         p.category,
            billRef:          p.billRef          || null,
            purchaseOrderRef: p.purchaseOrderRef || null,
            notes:            p.notes,
        }));

        return res.status(200).json({
            success: true,
            payments: formatted,
        });
    } catch (error) {
        console.error("Error fetching supplier payments:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch supplier payments",
            error: error.message,
        });
    }
};

// ================================
//   PAYMENT STATUS PAGE - STAT CARDS
// ================================
export const getSupplierPaymentStats = async (req, res) => {
    try {
        const supplierEmail = req.user.email;

        const allPayments = await PaymentTransaction.find({
            relatedEntity: supplierEmail,
            type:          "supplier",
        });

        let receivedAmount = 0;
        let pendingAmount  = 0;
        let failedCount    = 0;

        allPayments.forEach((p) => {
            const amount = parseDecimal(p.amount);
            if (p.status === "completed") receivedAmount += amount;
            if (p.status === "pending")   pendingAmount  += amount;
            if (p.status === "failed")    failedCount++;
        });

        return res.status(200).json({
            success: true,
            stats: {
                receivedAmount,
                pendingAmount,
                totalPayments: allPayments.length,
                failedPayments: failedCount,
            },
        });
    } catch (error) {
        console.error("Error fetching supplier payment stats:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================================
//   PAYMENT STATUS PAGE - TABLE WITH FILTER
// ================================
export const getSupplierPaymentsTable = async (req, res) => {
    try {
        const supplierEmail = req.user.email;
        const { status, search } = req.query;

        const filter = { relatedEntity: supplierEmail, type: "supplier" };
        if (status) filter.status = status;
        if (search) {
            filter.$or = [
                { transaction_id: { $regex: search, $options: "i" } },
                { billRef:        { $regex: search, $options: "i" } },
                { purchaseOrderRef: { $regex: search, $options: "i" } },
            ];
        }

        const payments = await PaymentTransaction.find(filter)
            .sort({ date: -1 });

        // Fetch linked invoice for invoiceID display
        const billRefs = payments.map((p) => p.billRef).filter(Boolean);
        const invoices = await Invoice.find({ bill_id: { $in: billRefs } })
            .select("bill_id invoiceID orderID");

        const invoiceMap = {};
        invoices.forEach((inv) => { invoiceMap[inv.bill_id] = inv; });

        const formatted = payments.map((p) => {
            const inv = invoiceMap[p.billRef] || null;
            return {
                id:               p._id,
                transaction_id:   p.transaction_id,
                po_id:            p.purchaseOrderRef || null,
                invoiceId:        inv?.bill_id       || null,
                customerName:     "Hardware Store",
                amount:           parseDecimal(p.amount),
                paymentMethod:    p.paymentMethod,
                status:           p.status,
                date:             p.date,
                receiptUrl:       p.receiptUrl       || null,
                notes:            p.notes,
            };
        });

        return res.status(200).json({ success: true, payments: formatted });
    } catch (error) {
        console.error("Error fetching supplier payments table:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};