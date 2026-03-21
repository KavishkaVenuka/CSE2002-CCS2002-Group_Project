import Finance from "../models/finance.js";
import BankAccount from "../models/bankAccount.js";

export const addTransaction = async (req, res) => {
  try {
    const {
      transaction_type,
      amount,
      description,
      date,
      notes,
      bankAccountId,
      bankAccountName,
    } = req.body;

    const numericAmount = Number(amount);

    // 🔴 BANK WITHDRAW VALIDATION
    if (transaction_type === 'bank_withdraw') {
      if (!bankAccountId) {
        return res.status(400).json({
          success: false,
          message: "Bank account is required",
        });
      }

      const balance = await getBankBalance(bankAccountId);

      if (numericAmount > balance) {
        return res.status(400).json({
          success: false,
          message: `Insufficient bank balance. Available: ${balance}`,
        });
      }
    }

    // 🔴 BANK DEPOSIT VALIDATION (optional advanced)
    if (transaction_type === 'bank_deposit') {
      const cashIn = await Finance.aggregate([
        { $match: { transaction_type: 'cash_in' } },
        { $group: { _id: null, total: { $sum: { $toDouble: "$amount" } } } }
      ]);

      const cashOut = await Finance.aggregate([
        { $match: { transaction_type: 'cash_out' } },
        { $group: { _id: null, total: { $sum: { $toDouble: "$amount" } } } }
      ]);

      const withdraw = await Finance.aggregate([
        { $match: { transaction_type: 'bank_withdraw' } },
        { $group: { _id: null, total: { $sum: { $toDouble: "$amount" } } } }
      ]);

      const deposit = await Finance.aggregate([
        { $match: { transaction_type: 'bank_deposit' } },
        { $group: { _id: null, total: { $sum: { $toDouble: "$amount" } } } }
      ]);

      const cashBalance =
        (cashIn[0]?.total || 0) +
        (withdraw[0]?.total || 0) -
        (cashOut[0]?.total || 0) -
        (deposit[0]?.total || 0);

      if (numericAmount > cashBalance) {
        return res.status(400).json({
          success: false,
          message: `Not enough cash in hand. Available: ${cashBalance}`,
        });
      }
    }

    // ✅ CREATE TRANSACTION
    const transaction = await Finance.create({
      transaction_type,
      amount,
      description,
      date,
      notes,
      bankAccountId,
      bankAccountName,
    });

    res.status(201).json({
      success: true,
      message: "Transaction added successfully",
      transaction,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error adding transaction",
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

const getBankBalance = async (bankAccountId) => {
  const bank = await BankAccount.findById(bankAccountId);

  if (!bank) return 0;

  const openingBalance = Number(bank.opening_balance || 0);

  const deposits = await Finance.aggregate([
    { $match: { bankAccountId: bank._id, transaction_type: 'bank_deposit' } },
    { $group: { _id: null, total: { $sum: { $toDouble: "$amount" } } } }
  ]);

  const withdrawals = await Finance.aggregate([
    { $match: { bankAccountId: bank._id, transaction_type: 'bank_withdraw' } },
    { $group: { _id: null, total: { $sum: { $toDouble: "$amount" } } } }
  ]);

  const totalDeposits = deposits[0]?.total || 0;
  const totalWithdrawals = withdrawals[0]?.total || 0;

  return openingBalance + totalDeposits - totalWithdrawals;
};