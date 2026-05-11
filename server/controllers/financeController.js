import Finance from "../models/finance.js";
import BankAccount from "../models/bankAccount.js";
import PaymentTransaction from "../models/PaymentTransaction.js";

// Helper to get total cash in hand
const getCashInHand = async () => {
  const financeStats = await Finance.aggregate([
    {
      $group: {
        _id: "$transaction_type",
        total: { $sum: { $toDouble: "$amount" } }
      }
    }
  ]);

  const stats = {};
  financeStats.forEach(s => stats[s._id] = s.total);

  const payments = await PaymentTransaction.aggregate([
    { $match: { isFinanceLinked: false, status: { $ne: 'failed' }, paymentMethod: 'cash' } },
    {
      $group: {
        _id: "$type",
        total: { $sum: { $toDouble: "$amount" } }
      }
    }
  ]);

  const pStats = {};
  payments.forEach(p => pStats[p._id] = p.total);

  const cashIn = (stats.cash_in || 0) + (stats.bank_withdraw || 0) + (pStats.customer || 0);
  const cashOut = (stats.cash_out || 0) + (stats.bank_deposit || 0) + (pStats.supplier || 0) + (pStats.expense || 0);

  return cashIn - cashOut;
};

// Helper to get bank balance
const getBankBalance = async (bankAccountId) => {
  const bank = await BankAccount.findById(bankAccountId);
  if (!bank) return 0;

  const openingBalance = Number(bank.opening_balance || 0);

  const financeStats = await Finance.aggregate([
    { $match: { bankAccountId: bank._id } },
    {
      $group: {
        _id: "$transaction_type",
        total: { $sum: { $toDouble: "$amount" } }
      }
    }
  ]);

  const stats = {};
  financeStats.forEach(s => stats[s._id] = s.total);

  const payments = await PaymentTransaction.aggregate([
    { $match: { isFinanceLinked: false, status: { $ne: 'failed' }, paymentMethod: 'bank', bankAccountId: bank._id } },
    {
      $group: {
        _id: "$type",
        total: { $sum: { $toDouble: "$amount" } }
      }
    }
  ]);

  const pStats = {};
  payments.forEach(p => pStats[p._id] = p.total);

  const deposits = (stats.bank_deposit || 0) + (pStats.customer || 0);
  const withdrawals = (stats.bank_withdraw || 0) + (pStats.supplier || 0) + (pStats.expense || 0);

  return openingBalance + deposits - withdrawals;
};

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

    // 1. Validate Bank Withdraw (Money leaving Bank -> going to Cash)
    if (transaction_type === 'bank_withdraw') {
      if (!bankAccountId) return res.status(400).json({ success: false, message: "Bank account is required" });
      const balance = await getBankBalance(bankAccountId);
      if (numericAmount > balance) {
        return res.status(400).json({ success: false, message: `Insufficient bank balance. Available: LKR ${balance.toLocaleString()}` });
      }
    }

    // 2. Validate Bank Deposit (Money leaving Cash -> going to Bank)
    if (transaction_type === 'bank_deposit') {
      if (!bankAccountId) return res.status(400).json({ success: false, message: "Bank account is required" });
      const cashBalance = await getCashInHand();
      if (numericAmount > cashBalance) {
        return res.status(400).json({ success: false, message: `Insufficient cash in hand. Available: LKR ${cashBalance.toLocaleString()}` });
      }
    }

    // 3. Validate Cash Out (Money leaving Cash)
    if (transaction_type === 'cash_out') {
      const cashBalance = await getCashInHand();
      if (numericAmount > cashBalance) {
        return res.status(400).json({ success: false, message: `Insufficient cash in hand. Available: LKR ${cashBalance.toLocaleString()}` });
      }
    }

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
    res.status(500).json({ success: false, message: "Error adding transaction: " + error.message });
  }
};

export const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Finance.find().sort({ date: -1 });
    const formattedTransactions = transactions.map((item) => ({
      ...item.toObject(),
      amount: Number(item.amount?.toString?.() || item.amount || 0),
    }));

    res.status(200).json({ success: true, data: formattedTransactions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTransactionById = async (req, res) => {
  try {
    const transaction = await Finance.findById(req.params.id);
    if (!transaction) return res.status(404).json({ success: false, message: "Transaction not found" });
    res.status(200).json({ success: true, data: { ...transaction.toObject(), amount: Number(transaction.amount?.toString() || 0) } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateTransaction = async (req, res) => {
  try {
    const transaction = await Finance.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!transaction) return res.status(404).json({ success: false, message: "Transaction not found" });
    res.status(200).json({ success: true, message: "Transaction updated successfully", data: transaction });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Finance.findByIdAndDelete(req.params.id);
    if (!transaction) return res.status(404).json({ success: false, message: "Transaction not found" });
    res.status(200).json({ success: true, message: "Transaction deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
