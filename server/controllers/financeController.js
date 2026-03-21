import Finance from "../models/finance.js";

export const addTransaction = async (req, res) => {
  try {
    const {
      transaction_type,
      amount,
      description,
      date,
      category,
      payment_method,
      status,
      module,
      notes,
    } = req.body;

    if (!transaction_type || !amount || !description || !date) {
      return res.status(400).json({
        success: false,
        message: "transaction_type, amount, description, and date are required",
      });
    }

    const transaction = await Finance.create({
      transaction_type,
      amount,
      description,
      date,
      category: category || "",
      payment_method: payment_method || "",
      status: status || "paid",
      module: module || "",
      notes: notes || "",
    });

    res.status(201).json({
      success: true,
      message: "Transaction added successfully",
      data: transaction,
    });
  } catch (error) {
    console.error("Error adding transaction:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Finance.find().sort({ date: -1 });

    const formattedTransactions = transactions.map((item) => ({
      ...item.toObject(),
      amount: Number(item.amount?.toString?.() || item.amount || 0),
    }));

    res.status(200).json({
      success: true,
      data: formattedTransactions,
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getTransactionById = async (req, res) => {
  try {
    const transaction = await Finance.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    const formattedTransaction = {
      ...transaction.toObject(),
      amount: Number(transaction.amount?.toString?.() || transaction.amount || 0),
    };

    res.status(200).json({
      success: true,
      data: formattedTransaction,
    });
  } catch (error) {
    console.error("Error fetching transaction:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateTransaction = async (req, res) => {
  try {
    const {
      transaction_type,
      amount,
      description,
      date,
      category,
      payment_method,
      status,
      module,
      notes,
    } = req.body;

    const transaction = await Finance.findByIdAndUpdate(
      req.params.id,
      {
        transaction_type,
        amount,
        description,
        date,
        category,
        payment_method,
        status,
        module,
        notes,
      },
      { new: true, runValidators: true }
    );

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    const formattedTransaction = {
      ...transaction.toObject(),
      amount: Number(transaction.amount?.toString?.() || transaction.amount || 0),
    };

    res.status(200).json({
      success: true,
      message: "Transaction updated successfully",
      data: formattedTransaction,
    });
  } catch (error) {
    console.error("Error updating transaction:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Finance.findByIdAndDelete(req.params.id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Transaction deleted successfully",
      data: transaction,
    });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};