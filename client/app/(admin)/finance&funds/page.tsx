'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Wallet,
  Landmark,
  Banknote,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Search,
  Trash2,
  Receipt,
  Building2,
  CreditCard
} from 'lucide-react';

type FundType =
  | 'fund'
  | 'loan'
  | 'cash_in'
  | 'cash_out'
  | 'bank_deposit'
  | 'bank_withdraw'
  | 'income'
  | 'expense';

interface FundTransaction {
  _id?: string;
  id?: string;
  date: string;
  description: string;
  amount: number;
  type: FundType;
  notes?: string;
  bankAccountId?: string;
  bankAccountName?: string;
}

interface BankAccount {
  _id?: string;
  id?: string;
  bank_name: string;
  account_name: string;
  account_number: string;
  branch?: string;
  notes?: string;
  opening_balance?: number;
}

const API_BASE = 'http://localhost:5900/api/finance';
const API_BASE_BANK = 'http://localhost:5900/api/bankAccounts';

const initialTransaction: FundTransaction = {
  date: '',
  description: '',
  amount: 0,
  type: 'fund',
  notes: '',
  bankAccountId: ''
};

const initialBankAccount: BankAccount = {
  bank_name: '',
  account_name: '',
  account_number: '',
  branch: '',
  notes: '',
  opening_balance: 0
};

const parseNumber = (value: any): number => {
  if (value == null) return 0;
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return Number(value) || 0;

  if (typeof value === 'object') {
    if ('$numberDecimal' in value) return Number(value.$numberDecimal) || 0;
    if (typeof value.toString === 'function') {
      const n = Number(value.toString());
      return Number.isNaN(n) ? 0 : n;
    }
  }

  return 0;
};

const mapFromBackend = (item: any): FundTransaction => ({
  _id: item._id || item.id,
  id: item._id || item.id,
  date: item.date ? String(item.date).slice(0, 10) : '',
  description: item.description || '',
  amount: parseNumber(item.amount),
  type: item.transaction_type || item.type || 'fund',
  notes: item.notes || '',
  bankAccountId: item.bankAccountId || item.bank_account_id || '',
  bankAccountName: item.bankAccountName || item.bank_account_name || ''
});

const mapBankFromBackend = (item: any): BankAccount => ({
  _id: item._id || item.id,
  id: item._id || item.id,
  bank_name: item.bank_name || '',
  account_name: item.account_name || '',
  account_number: item.account_number || '',
  branch: item.branch || '',
  notes: item.notes || '',
  opening_balance: parseNumber(item.opening_balance)
});

export default function FinanceManagement() {
  const [transactions, setTransactions] = useState<FundTransaction[]>([]);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [bankSubmitLoading, setBankSubmitLoading] = useState(false);
  const [newTransaction, setNewTransaction] = useState<FundTransaction>(initialTransaction);
  const [newBankAccount, setNewBankAccount] = useState<BankAccount>(initialBankAccount);
  const [showBankForm, setShowBankForm] = useState(false);
  const [paymentTransactions, setPaymentTransactions] = useState<any[]>([]);

  useEffect(() => {
    fetchTransactions();
    fetchBankAccounts();
    fetchPaymentTransactions();
  }, []);

  const fetchPaymentTransactions = async () => {
    try {
      const response = await fetch(`http://localhost:5900/api/paymentTransactions/getPayments`);
      if (!response.ok) return;
      const data = await response.json();
      const itemsArray =
        Array.isArray(data) ? data :
        Array.isArray(data.items) ? data.items :
        Array.isArray(data.data) ? data.data :
        Array.isArray(data.transactions) ? data.transactions :
        Array.isArray(data.payments) ? data.payments :
        [];
      setPaymentTransactions(itemsArray);
    } catch (error) {
      console.error('Error fetching payment transactions:', error);
    }
  };

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/getTransactions`);

      if (!response.ok) {
        throw new Error(`Failed to fetch transactions: ${response.status}`);
      }

      const data = await response.json();

      const itemsArray =
        Array.isArray(data) ? data :
        Array.isArray(data.items) ? data.items :
        Array.isArray(data.data) ? data.data :
        Array.isArray(data.transactions) ? data.transactions :
        [];

      const mappedItems = itemsArray.map(mapFromBackend);

      const validTypes: FundType[] = ['fund', 'loan', 'cash_in', 'cash_out', 'bank_deposit', 'bank_withdraw', 'income', 'expense'];
      const filtered = mappedItems.filter((item: FundTransaction) =>
        validTypes.includes(item.type)
      );

      setTransactions(filtered);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchBankAccounts = async () => {
    try {
      const response = await fetch(`${API_BASE_BANK}/getBankAccounts`);

      if (!response.ok) {
        throw new Error(`Failed to fetch bank accounts: ${response.status}`);
      }

      const data = await response.json();

      const itemsArray =
        Array.isArray(data) ? data :
        Array.isArray(data.items) ? data.items :
        Array.isArray(data.data) ? data.data :
        Array.isArray(data.bankAccounts) ? data.bankAccounts :
        [];

      setBankAccounts(itemsArray.map(mapBankFromBackend));
    } catch (error) {
      console.error('Error fetching bank accounts:', error);
      setBankAccounts([]);
    }
  };

  const handleAddBankAccount = async () => {
    if (!newBankAccount.bank_name.trim()) {
      alert('Bank name is required');
      return;
    }

    if (!newBankAccount.account_name.trim()) {
      alert('Account name is required');
      return;
    }

    if (!newBankAccount.account_number.trim()) {
      alert('Account number is required');
      return;
    }

    setBankSubmitLoading(true);

    try {
      const payload = {
        bank_name: newBankAccount.bank_name,
        account_name: newBankAccount.account_name,
        account_number: newBankAccount.account_number,
        branch: newBankAccount.branch,
        notes: newBankAccount.notes,
        opening_balance: newBankAccount.opening_balance || 0
      };

      const response = await fetch(`${API_BASE_BANK}/addBankAccount`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to add bank account');
      }

      await fetchBankAccounts();
      setNewBankAccount(initialBankAccount);
      setShowBankForm(false);
    } catch (error) {
      console.error('Error adding bank account:', error);
      alert('Failed to add bank account');
    } finally {
      setBankSubmitLoading(false);
    }
  };

  const handleDeleteBankAccount = async (id?: string) => {
    if (!id) return;

    const confirmed = window.confirm('Are you sure you want to delete this bank account?');
    if (!confirmed) return;

    try {
      const response = await fetch(`${API_BASE_BANK}/deleteBankAccount/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete bank account');
      }

      await fetchBankAccounts();
    } catch (error) {
      console.error('Error deleting bank account:', error);
      alert('Failed to delete bank account');
    }
  };

  const handleAddTransaction = async () => {
    if (!newTransaction.description.trim()) {
      alert('Description is required');
      return;
    }

    if (!newTransaction.date) {
      alert('Date is required');
      return;
    }

    if (newTransaction.amount <= 0) {
      alert('Amount must be greater than 0');
      return;
    }

    const isBankType =
      newTransaction.type === 'bank_deposit' || newTransaction.type === 'bank_withdraw';

    if (isBankType && !newTransaction.bankAccountId) {
      alert('Please select a bank account');
      return;
    }

    if (newTransaction.type === 'bank_deposit') {
      const currentCash = cashInHand;
      if (newTransaction.amount > currentCash) {
        alert('Not enough cash in hand to deposit');
        return;
      }
    }

    if (newTransaction.type === 'bank_withdraw') {
      const accountBalance = getBankBalance(newTransaction.bankAccountId || '');
      if (newTransaction.amount > accountBalance) {
        alert('Not enough balance in selected bank account');
        return;
      }
    }

    setSubmitLoading(true);

    try {
      const selectedBank = bankAccounts.find(
        (bank) => (bank._id || bank.id) === newTransaction.bankAccountId
      );

      const payload = {
        transaction_type: newTransaction.type,
        amount: newTransaction.amount,
        description: newTransaction.description,
        date: newTransaction.date,
        notes: newTransaction.notes,
        bankAccountId: newTransaction.bankAccountId || null,
        bankAccountName: selectedBank
          ? `${selectedBank.bank_name} - ${selectedBank.account_number}`
          : null
      };

      const response = await fetch(`${API_BASE}/addTransaction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to add transaction');
      }

      await fetchTransactions();
      setNewTransaction(initialTransaction);
    } catch (error) {
      console.error('Error adding transaction:', error);
      alert('Failed to add transaction');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteTransaction = async (id?: string) => {
    if (!id) return;

    const confirmed = window.confirm('Are you sure you want to delete this entry?');
    if (!confirmed) return;

    try {
      const response = await fetch(`${API_BASE}/deleteTransaction/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete transaction');
      }

      await fetchTransactions();
    } catch (error) {
      console.error('Error deleting transaction:', error);
      alert('Failed to delete transaction');
    }
  };

  const getBankBalance = (bankId: string) => {
    const account = bankAccounts.find((b) => (b._id || b.id) === bankId);
    const openingBalance = parseNumber(account?.opening_balance);

    const deposits = transactions
      .filter((t) => t.type === 'bank_deposit' && t.bankAccountId === bankId)
      .reduce((sum, t) => sum + t.amount, 0);

    const withdrawals = transactions
      .filter((t) => (t.type === 'bank_withdraw' || t.type === 'expense') && t.bankAccountId === bankId)
      .reduce((sum, t) => sum + t.amount, 0);

    const externalIncome = transactions
      .filter((t) => t.type === 'income' && t.bankAccountId === bankId)
      .reduce((sum, t) => sum + t.amount, 0);

    const paymentCustomerIncome = paymentTransactions
      .filter(
        (t) =>
          (t.status === 'completed' || t.status === undefined) &&
          (t.paymentMethod === 'bank' || t.payment_method === 'bank') &&
          t.type === 'customer' &&
          (t.bankAccountId === bankId || t.bank_account_id === bankId) &&
          !t.isFinanceLinked
      )
      .reduce((sum, t) => sum + parseNumber(t.amount), 0);

    const paymentExpenses = paymentTransactions
      .filter(
        (t) =>
          (t.status === 'completed' || t.status === undefined) &&
          (t.paymentMethod === 'bank' || t.payment_method === 'bank') &&
          (t.type === 'expense' || t.type === 'supplier') &&
          (t.bankAccountId === bankId || t.bank_account_id === bankId) &&
          !t.isFinanceLinked
      )
      .reduce((sum, t) => sum + parseNumber(t.amount), 0);

    return openingBalance + deposits - withdrawals + externalIncome + paymentCustomerIncome - paymentExpenses;
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (transaction.notes || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (transaction.bankAccountName || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = typeFilter === 'all' || transaction.type === typeFilter;

    return matchesSearch && matchesType;
  });

  const totalFunds = useMemo(
    () =>
      transactions
        .filter((t) => t.type === 'fund')
        .reduce((sum, t) => sum + t.amount, 0),
    [transactions]
  );

  const totalLoans = useMemo(
    () =>
      transactions
        .filter((t) => t.type === 'loan')
        .reduce((sum, t) => sum + t.amount, 0),
    [transactions]
  );

  const cashInHand = useMemo(() => {
    const cashIn = transactions
      .filter((t) => (t.type === 'cash_in' || ((t.type === 'fund' || t.type === 'loan') && !t.bankAccountId)))
      .reduce((sum, t) => sum + t.amount, 0);

    const cashOut = transactions
      .filter((t) => t.type === 'cash_out')
      .reduce((sum, t) => sum + t.amount, 0);

    const bankWithdraw = transactions
      .filter((t) => t.type === 'bank_withdraw')
      .reduce((sum, t) => sum + t.amount, 0);

    const bankDeposit = transactions
      .filter((t) => t.type === 'bank_deposit')
      .reduce((sum, t) => sum + t.amount, 0);

    const incomeToCash = transactions
      .filter((t) => t.type === 'income' && !t.bankAccountId)
      .reduce((sum, t) => sum + t.amount, 0);

    const expenseFromCash = transactions
      .filter((t) => t.type === 'expense' && !t.bankAccountId)
      .reduce((sum, t) => sum + t.amount, 0);

    const paymentCashCustomer = paymentTransactions
      .filter((t) => (t.status === 'completed' || t.status === undefined) && (t.paymentMethod === 'cash' || t.payment_method === 'cash') && t.type === 'customer' && !t.isFinanceLinked)
      .reduce((sum, t) => sum + parseNumber(t.amount), 0);
      
    const paymentCashSupplier = paymentTransactions
      .filter((t) => (t.status === 'completed' || t.status === undefined) && (t.paymentMethod === 'cash' || t.payment_method === 'cash') && (t.type === 'supplier') && !t.isFinanceLinked)
      .reduce((sum, t) => sum + parseNumber(t.amount), 0);

    const paymentCashExpense = paymentTransactions
      .filter((t) => (t.status === 'completed' || t.status === undefined) && (t.paymentMethod === 'cash' || t.payment_method === 'cash') && (t.type === 'expense') && !t.isFinanceLinked)
      .reduce((sum, t) => sum + parseNumber(t.amount), 0);

    return cashIn + bankWithdraw + incomeToCash - cashOut - bankDeposit - expenseFromCash + paymentCashCustomer - paymentCashSupplier - paymentCashExpense;
  }, [transactions, paymentTransactions]);

  const totalBankBalance = useMemo(() => {
    return bankAccounts.reduce((sum, bank) => {
      const bankId = bank._id || bank.id || '';
      return sum + getBankBalance(bankId);
    }, 0);
  }, [bankAccounts, transactions, paymentTransactions]);

  const availableFunds = cashInHand + totalBankBalance;

  const getTypeLabel = (type: FundType) => {
    switch (type) {
      case 'fund': return 'Investment/Fund';
      case 'loan': return 'Loan Entry';
      case 'cash_in': return 'Manual Cash In';
      case 'cash_out': return 'Manual Cash Out';
      case 'bank_deposit': return 'Cash to Bank';
      case 'bank_withdraw': return 'Bank to Cash';
      case 'income': return 'Sales/Income';
      case 'expense': return 'Business Expense';
      default: return type;
    }
  };

  const getAmountClass = (type: string) => {
    if (type === 'cash_out' || type === 'bank_withdraw' || type === 'bank_deposit' || type === 'expense') {
      if (type === 'bank_deposit') return 'text-orange-600'; 
      return 'text-nb-red';
    }
    return 'text-nb-green';
  };

  const getAmountPrefix = (type: string) => {
    if (type === 'cash_out' || type === 'bank_withdraw' || type === 'bank_deposit' || type === 'expense') return '-';
    return '+';
  };

  const inputStyle = "w-full mt-2 border-2 border-nb-black rounded-none shadow-[2px_2px_0px_0px_#000] focus:outline-none bg-white text-nb-black font-bold h-12 px-3 tracking-wide";
  const labelStyle = "block font-black text-nb-black uppercase tracking-widest text-xs";

  return (
    <>
      {loading ? (
        <div className="flex-1 p-8 overflow-y-auto">

          {/* Header Skeleton */}
          <div className="bg-nb-yellow border-4 border-nb-black p-8 shadow-nb mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-[#d4ede9] border-2 border-nb-black shimmer"></div>
              <div className="h-5 w-48 bg-[#d4ede9] border-2 border-nb-black shimmer"></div>
            </div>
            <div className="h-12 w-64 bg-[#d4ede9] border-2 border-nb-black shimmer mb-4"></div>
            <div className="h-4 w-96 bg-[#d4ede9] border-2 border-nb-black shimmer"></div>
          </div>

          {/* Stats Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6 mb-8">
            {/* Cyan Card */}
            <div className="bg-nb-cyan border-4 border-nb-black p-6 shadow-nb">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-nb-white border-2 border-nb-black shimmer"></div>
                <div className="h-4 w-24 bg-nb-black/20 border-2 border-nb-black shimmer"></div>
              </div>
              <div className="h-8 w-32 bg-nb-black/20 border-2 border-nb-black shimmer"></div>
            </div>

            {/* Red Card */}
            <div className="bg-nb-red border-4 border-nb-black p-6 shadow-nb">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-nb-white border-2 border-nb-black shimmer"></div>
                <div className="h-4 w-24 bg-white/30 border-2 border-nb-black shimmer"></div>
              </div>
              <div className="h-8 w-32 bg-white/30 border-2 border-nb-black shimmer"></div>
            </div>

            {/* Green Card */}
            <div className="bg-nb-green border-4 border-nb-black p-6 shadow-nb">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-nb-white border-2 border-nb-black shimmer"></div>
                <div className="h-4 w-24 bg-nb-black/20 border-2 border-nb-black shimmer"></div>
              </div>
              <div className="h-8 w-32 bg-nb-black/20 border-2 border-nb-black shimmer"></div>
            </div>

            {/* Purple Card */}
            <div className="bg-[#A78BFA] border-4 border-nb-black p-6 shadow-nb">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-nb-white border-2 border-nb-black shimmer"></div>
                <div className="h-4 w-24 bg-nb-black/20 border-2 border-nb-black shimmer"></div>
              </div>
              <div className="h-8 w-32 bg-nb-black/20 border-2 border-nb-black shimmer"></div>
            </div>

            {/* Pink Card */}
            <div className="bg-nb-pink border-4 border-nb-black p-6 shadow-nb">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-nb-white border-2 border-nb-black shimmer"></div>
                <div className="h-4 w-24 bg-nb-black/20 border-2 border-nb-black shimmer"></div>
              </div>
              <div className="h-8 w-32 bg-nb-black/20 border-2 border-nb-black shimmer"></div>
            </div>
          </div>

          {/* Bank Accounts Section Skeleton */}
          <div className="bg-white border-4 border-nb-black shadow-nb mb-8">
            <div className="bg-nb-orange border-b-4 border-nb-black p-6">
              <div className="h-6 w-64 bg-[#d4ede9] border-2 border-nb-black shimmer"></div>
            </div>
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-nb-bg border-4 border-nb-black p-5 shadow-[4px_4px_0px_0px_#000]">
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex-1">
                        <div className="h-4 w-32 bg-[#d4ede9] border-2 border-nb-black shimmer mb-2"></div>
                        <div className="h-3 w-24 bg-[#d4ede9] border-2 border-nb-black shimmer mb-2"></div>
                        <div className="h-3 w-28 bg-[#d4ede9] border-2 border-nb-black shimmer"></div>
                      </div>
                      <div className="w-8 h-8 bg-nb-red border-2 border-nb-black shimmer"></div>
                    </div>
                    <div className="bg-white border-2 border-nb-black p-3 shadow-nb-sm">
                      <div className="h-2 w-20 bg-[#d4ede9] border-2 border-nb-black shimmer mb-2"></div>
                      <div className="h-6 w-32 bg-[#d4ede9] border-2 border-nb-black shimmer"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Forms Section Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Add Entry Form */}
            <div className="bg-white border-4 border-nb-black shadow-nb">
              <div className="bg-nb-blue border-b-4 border-nb-black p-6">
                <div className="h-6 w-48 bg-[#d4ede9] border-2 border-nb-black shimmer"></div>
              </div>
              <div className="p-8 space-y-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i}>
                    <div className="h-3 w-24 bg-[#d4ede9] border-2 border-nb-black shimmer mb-2"></div>
                    <div className="h-12 w-full bg-[#d4ede9] border-2 border-nb-black shimmer"></div>
                  </div>
                ))}
                <div className="h-12 w-full bg-nb-yellow border-2 border-nb-black shimmer"></div>
              </div>
            </div>

            {/* Recent Finance Log */}
            <div className="bg-white border-4 border-nb-black shadow-nb">
              <div className="bg-nb-purple border-b-4 border-nb-black p-6">
                <div className="h-6 w-48 bg-[#d4ede9] border-2 border-nb-black shimmer"></div>
              </div>
              <div className="p-8 space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-nb-bg border-4 border-nb-black">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 bg-[#d4ede9] border-2 border-nb-black shimmer"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-3 w-32 bg-[#d4ede9] border-2 border-nb-black shimmer"></div>
                        <div className="h-2 w-48 bg-[#d4ede9] border-2 border-nb-black shimmer"></div>
                      </div>
                    </div>
                    <div className="h-6 w-24 bg-[#d4ede9] border-2 border-nb-black shimmer ml-4"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Table Section Skeleton */}
          <div className="bg-white border-4 border-nb-black shadow-nb">
            <div className="bg-nb-yellow border-b-4 border-nb-black p-6">
              <div className="h-6 w-48 bg-[#d4ede9] border-2 border-nb-black shimmer"></div>
            </div>
            <div className="p-6 border-b-4 border-nb-black flex flex-col md:flex-row gap-4 bg-nb-bg">
              <div className="flex-1 h-12 bg-[#d4ede9] border-2 border-nb-black shimmer"></div>
              <div className="w-full md:w-64 h-12 bg-[#d4ede9] border-2 border-nb-black shimmer"></div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-nb-gray text-nb-black">
                    <th className="p-4 border-b-4 border-nb-black h-10"></th>
                    <th className="p-4 border-b-4 border-nb-black h-10"></th>
                    <th className="p-4 border-b-4 border-nb-black h-10"></th>
                    <th className="p-4 border-b-4 border-nb-black h-10"></th>
                    <th className="p-4 border-b-4 border-nb-black h-10"></th>
                    <th className="p-4 border-b-4 border-nb-black h-10"></th>
                    <th className="p-4 border-b-4 border-nb-black h-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <tr key={i} className="border-b border-nb-black/20">
                      <td className="p-4"><div className="h-4 w-24 bg-[#d4ede9] border-2 border-nb-black shimmer"></div></td>
                      <td className="p-4"><div className="h-4 w-32 bg-[#d4ede9] border-2 border-nb-black shimmer"></div></td>
                      <td className="p-4"><div className="h-4 w-28 bg-[#d4ede9] border-2 border-nb-black shimmer"></div></td>
                      <td className="p-4"><div className="h-4 w-36 bg-[#d4ede9] border-2 border-nb-black shimmer"></div></td>
                      <td className="p-4"><div className="h-4 w-28 bg-[#d4ede9] border-2 border-nb-black shimmer"></div></td>
                      <td className="p-4"><div className="h-4 w-24 bg-[#d4ede9] border-2 border-nb-black shimmer"></div></td>
                      <td className="p-4 text-right"><div className="h-8 w-8 bg-nb-red border-2 border-nb-black shimmer ml-auto"></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <style jsx>{`
            @keyframes shimmer {
              0% {
                background-position: -600px 0;
              }
              100% {
                background-position: 600px 0;
              }
            }

            .shimmer {
              background-image: linear-gradient(
                90deg,
                transparent,
                rgba(255, 255, 255, 0.3),
                transparent
              );
              background-size: 200px 100%;
              animation: shimmer 2s infinite;
              background-position: -600px 0;
            }
          `}</style>
        </div>
      ) : (
        <div className="flex-1 p-8 overflow-y-auto">

          {/* Page Header */}
          <div className="bg-nb-yellow border-4 border-nb-black p-8 shadow-nb mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Wallet className="w-8 h-8 text-nb-black" strokeWidth={2.5} />
              <span className="font-black text-nb-black uppercase tracking-widest">Business Funds & Bank Accounts</span>
            </div>
            <h1 className="text-4xl font-display font-black text-nb-black uppercase tracking-widest mb-2">
              Finance Management
            </h1>
            <p className="font-bold text-nb-black">
              Manage company funds, loans, cash in hand, and multiple bank accounts
            </p>
          </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6 mb-8">
          <div className="bg-nb-cyan border-4 border-nb-black p-6 shadow-nb flex flex-col justify-between">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white border-2 border-nb-black p-2 shadow-nb-sm">
                <Banknote className="w-6 h-6 text-nb-black" strokeWidth={2.5} />
              </div>
              <h3 className="font-black text-nb-black uppercase tracking-widest text-sm">Total Funds</h3>
            </div>
            <p className="text-3xl font-black text-nb-black truncate">LKR {totalFunds.toLocaleString()}</p>
          </div>

          <div className="bg-nb-red text-white border-4 border-nb-black p-6 shadow-nb flex flex-col justify-between">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white border-2 border-nb-black p-2 shadow-nb-sm">
                <Landmark className="w-6 h-6 text-nb-black" strokeWidth={2.5} />
              </div>
              <h3 className="font-black text-white uppercase tracking-widest text-sm">Loan Amount</h3>
            </div>
            <p className="text-3xl font-black text-white truncate">LKR {totalLoans.toLocaleString()}</p>
          </div>

          <div className="bg-nb-green border-4 border-nb-black p-6 shadow-nb flex flex-col justify-between">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white border-2 border-nb-black p-2 shadow-nb-sm">
                <Wallet className="w-6 h-6 text-nb-black" strokeWidth={2.5} />
              </div>
              <h3 className="font-black text-nb-black uppercase tracking-widest text-sm">Cash In Hand</h3>
            </div>
            <p className="text-3xl font-black text-nb-black truncate">LKR {cashInHand.toLocaleString()}</p>
          </div>

          <div className="bg-[#A78BFA] border-4 border-nb-black p-6 shadow-nb flex flex-col justify-between">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white border-2 border-nb-black p-2 shadow-nb-sm">
                <Building2 className="w-6 h-6 text-nb-black" strokeWidth={2.5} />
              </div>
              <h3 className="font-black text-nb-black uppercase tracking-widest text-sm">Bank Balance</h3>
            </div>
            <p className="text-3xl font-black text-nb-black truncate">LKR {totalBankBalance.toLocaleString()}</p>
          </div>

          <div className="bg-nb-pink border-4 border-nb-black p-6 shadow-nb flex flex-col justify-between">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white border-2 border-nb-black p-2 shadow-nb-sm">
                <Banknote className="w-6 h-6 text-nb-black" strokeWidth={2.5} />
              </div>
              <h3 className="font-black text-nb-black uppercase tracking-widest text-sm">Available Funds</h3>
            </div>
            <p className="text-3xl font-black text-nb-black truncate">LKR {availableFunds.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white border-4 border-nb-black shadow-nb mb-8">
          <div className="bg-nb-orange border-b-4 border-nb-black p-6 flex justify-between items-center">
            <h2 className="text-2xl font-display font-black text-nb-black uppercase tracking-widest flex items-center gap-3">
              <Building2 className="w-8 h-8" strokeWidth={2.5} />
              Company Bank Accounts
            </h2>
            <button
              type="button"
              onClick={() => setShowBankForm(!showBankForm)}
              className="nb-interactive bg-white border-2 border-nb-black px-6 py-2 text-nb-black font-bold flex items-center gap-2 shadow-[2px_2px_0px_0px_#000]"
            >
              <Plus className="w-5 h-5" strokeWidth={2.5} />
              {showBankForm ? 'CLOSE' : 'ADD BANK ACCOUNT'}
            </button>
          </div>
          
          <div className="p-8">
            {showBankForm && (
              <div className="bg-nb-bg border-4 border-nb-black p-6 shadow-nb mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelStyle}>Bank Name</label>
                  <input
                    value={newBankAccount.bank_name}
                    onChange={(e) =>
                      setNewBankAccount({ ...newBankAccount, bank_name: e.target.value })
                    }
                    placeholder="e.g. Commercial Bank"
                    className={inputStyle}
                  />
                </div>

                <div>
                  <label className={labelStyle}>Account Name</label>
                  <input
                    value={newBankAccount.account_name}
                    onChange={(e) =>
                      setNewBankAccount({ ...newBankAccount, account_name: e.target.value })
                    }
                    placeholder="Company Account Name"
                    className={inputStyle}
                  />
                </div>

                <div>
                  <label className={labelStyle}>Account Number</label>
                  <input
                    value={newBankAccount.account_number}
                    onChange={(e) =>
                      setNewBankAccount({ ...newBankAccount, account_number: e.target.value })
                    }
                    placeholder="Enter account number"
                    className={inputStyle}
                  />
                </div>

                <div>
                  <label className={labelStyle}>Branch</label>
                  <input
                    value={newBankAccount.branch}
                    onChange={(e) =>
                      setNewBankAccount({ ...newBankAccount, branch: e.target.value })
                    }
                    placeholder="Branch"
                    className={inputStyle}
                  />
                </div>

                <div>
                  <label className={labelStyle}>Opening Balance</label>
                  <input
                    type="number"
                    value={newBankAccount.opening_balance}
                    onChange={(e) =>
                      setNewBankAccount({
                        ...newBankAccount,
                        opening_balance: Number(e.target.value) || 0
                      })
                    }
                    placeholder="0.00"
                    className={inputStyle}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className={labelStyle}>Notes</label>
                  <textarea
                    value={newBankAccount.notes}
                    onChange={(e) =>
                      setNewBankAccount({ ...newBankAccount, notes: e.target.value })
                    }
                    placeholder="Optional notes"
                    className="w-full mt-2 border-2 border-nb-black rounded-none shadow-[2px_2px_0px_0px_#000] focus:outline-none bg-white text-nb-black font-bold min-h-[100px] p-3"
                  />
                </div>

                <div className="md:col-span-2">
                  <button
                    onClick={handleAddBankAccount}
                    disabled={bankSubmitLoading}
                    className="nb-interactive w-full bg-nb-green border-2 border-nb-black py-4 text-nb-black font-black uppercase tracking-widest shadow-nb-sm text-lg flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" strokeWidth={2.5} />
                    {bankSubmitLoading ? 'SAVING...' : 'SAVE BANK ACCOUNT'}
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {bankAccounts.length > 0 ? (
                bankAccounts.map((bank) => {
                  const bankId = bank._id || bank.id || '';
                  const balance = getBankBalance(bankId);

                  return (
                    <div key={bankId} className="bg-nb-bg border-4 border-nb-black p-5 shadow-[4px_4px_0px_0px_#000] flex flex-col justify-between">
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <CreditCard className="w-5 h-5 text-nb-black" strokeWidth={2.5} />
                            <h3 className="font-black text-nb-black uppercase tracking-widest">{bank.bank_name}</h3>
                          </div>
                          <p className="font-bold text-nb-black">{bank.account_name}</p>
                          <p className="text-sm font-bold text-nb-black/70">{bank.account_number}</p>
                          <p className="text-xs font-bold text-nb-black/50 mt-1">{bank.branch || 'NO BRANCH'}</p>
                        </div>
                        <button
                          className="nb-interactive bg-nb-red border-2 border-nb-black p-2 shadow-[2px_2px_0px_0px_#000]"
                          onClick={() => handleDeleteBankAccount(bankId)}
                        >
                          <Trash2 className="w-5 h-5 text-white" strokeWidth={2.5} />
                        </button>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="bg-white border-2 border-nb-black p-3 shadow-nb-sm">
                          <p className="text-xs font-black text-nb-black uppercase tracking-widest mb-1">Current Balance</p>
                          <p className="text-2xl font-black text-nb-black truncate">LKR {balance.toLocaleString()}</p>
                        </div>
                        {bank.notes && (
                          <p className="text-xs font-bold text-nb-black/60 italic">{bank.notes}</p>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full text-center py-12 border-4 border-dashed border-nb-black/30">
                  <p className="font-black text-nb-black uppercase tracking-widest text-lg">No bank accounts added yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white border-4 border-nb-black shadow-nb">
            <div className="bg-nb-blue border-b-4 border-nb-black p-6">
              <h2 className="text-2xl font-display font-black text-white uppercase tracking-widest flex items-center gap-3">
                <Plus className="w-8 h-8" strokeWidth={2.5} />
                Add Finance Entry
              </h2>
            </div>
            <div className="p-8 space-y-6">
              <div>
                <label className={labelStyle}>Entry Type</label>
                <select
                  value={newTransaction.type}
                  onChange={(e) =>
                    setNewTransaction({
                      ...newTransaction,
                      type: e.target.value as FundType,
                      bankAccountId:
                        e.target.value === 'bank_deposit' || e.target.value === 'bank_withdraw'
                          ? newTransaction.bankAccountId
                          : ''
                    })
                  }
                  className={`${inputStyle} appearance-none cursor-pointer`}
                >
                  <option value="fund">Investment / Fund</option>
                  <option value="loan">Loan Entry</option>
                  <option value="cash_in">Manual Cash In</option>
                  <option value="cash_out">Manual Cash Out</option>
                  <option value="bank_deposit">Transfer: Cash to Bank</option>
                  <option value="bank_withdraw">Transfer: Bank to Cash</option>
                  <option value="income">External Income</option>
                  <option value="expense">External Expense</option>
                </select>
              </div>

              {(newTransaction.type === 'bank_deposit' ||
                newTransaction.type === 'bank_withdraw') && (
                <div>
                  <label className={labelStyle}>Select Bank Account</label>
                  <select
                    value={newTransaction.bankAccountId || ''}
                    onChange={(e) =>
                      setNewTransaction({ ...newTransaction, bankAccountId: e.target.value })
                    }
                    className={`${inputStyle} appearance-none cursor-pointer`}
                  >
                    <option value="" disabled>Select bank account...</option>
                    {bankAccounts.map((bank) => {
                      const bankId = bank._id || bank.id || '';
                      return (
                        <option key={bankId} value={bankId}>
                          {bank.bank_name} - {bank.account_number}
                        </option>
                      );
                    })}
                  </select>
                </div>
              )}

              <div>
                <label className={labelStyle}>Description</label>
                <input
                  value={newTransaction.description}
                  onChange={(e) =>
                    setNewTransaction({ ...newTransaction, description: e.target.value })
                  }
                  placeholder="Enter description"
                  className={inputStyle}
                />
              </div>

              <div>
                <label className={labelStyle}>Amount</label>
                <input
                  type="number"
                  value={newTransaction.amount}
                  onChange={(e) =>
                    setNewTransaction({
                      ...newTransaction,
                      amount: Number(e.target.value) || 0
                    })
                  }
                  placeholder="0.00"
                  className={inputStyle}
                />
              </div>

              <div>
                <label className={labelStyle}>Date</label>
                <input
                  type="date"
                  value={newTransaction.date}
                  onChange={(e) =>
                    setNewTransaction({ ...newTransaction, date: e.target.value })
                  }
                  className={inputStyle}
                />
              </div>

              <div>
                <label className={labelStyle}>Notes</label>
                <textarea
                  value={newTransaction.notes}
                  onChange={(e) =>
                    setNewTransaction({ ...newTransaction, notes: e.target.value })
                  }
                  placeholder="Optional notes"
                  className="w-full mt-2 border-2 border-nb-black rounded-none shadow-[2px_2px_0px_0px_#000] focus:outline-none bg-white text-nb-black font-bold min-h-[100px] p-3"
                />
              </div>

              <button
                onClick={handleAddTransaction}
                disabled={submitLoading}
                className="nb-interactive w-full bg-nb-yellow border-2 border-nb-black py-4 text-nb-black font-black uppercase tracking-widest shadow-nb-sm text-lg flex items-center justify-center gap-2 mt-4"
              >
                <Plus className="w-5 h-5" strokeWidth={2.5} />
                {submitLoading ? 'SAVING...' : 'ADD ENTRY'}
              </button>
            </div>
          </div>

          <div className="bg-white border-4 border-nb-black shadow-nb flex flex-col h-full max-h-[850px]">
            <div className="bg-nb-purple border-b-4 border-nb-black p-6 shrink-0">
              <h2 className="text-2xl font-display font-black text-white uppercase tracking-widest flex items-center gap-3">
                <Receipt className="w-8 h-8" strokeWidth={2.5} />
                Recent Finance Log
              </h2>
            </div>
            <div className="p-8 space-y-4 overflow-y-auto flex-1">
              {filteredTransactions.slice(0, 8).map((entry) => (
                <div
                  key={entry._id || entry.id}
                  className="flex items-center justify-between p-4 bg-nb-bg border-4 border-nb-black shadow-[4px_4px_0px_0px_#000]"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 flex items-center justify-center border-2 border-nb-black shadow-nb-sm ${
                        entry.type === 'cash_out' || entry.type === 'bank_withdraw' || entry.type === 'expense'
                          ? 'bg-nb-red'
                          : 'bg-nb-green'
                      }`}
                    >
                      {entry.type === 'cash_out' || entry.type === 'bank_withdraw' || entry.type === 'expense' ? (
                        <ArrowDownRight className="w-6 h-6 text-white" strokeWidth={2.5} />
                      ) : (
                        <ArrowUpRight className="w-6 h-6 text-nb-black" strokeWidth={2.5} />
                      )}
                    </div>

                    <div>
                      <p className="font-black text-nb-black mb-1">{entry.description}</p>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-xs bg-white border-2 border-nb-black px-2 py-0.5 shadow-[2px_2px_0px_0px_#000]">{entry.date}</span>
                        <span className="font-bold text-xs bg-nb-yellow border-2 border-nb-black px-2 py-0.5 shadow-[2px_2px_0px_0px_#000]">
                          {getTypeLabel(entry.type)}
                        </span>
                        {entry.bankAccountName && (
                          <span className="font-bold text-xs bg-nb-cyan border-2 border-nb-black px-2 py-0.5 shadow-[2px_2px_0px_0px_#000]">
                            {entry.bankAccountName}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className={`text-xl font-black ${getAmountClass(entry.type)}`}>
                    {getAmountPrefix(entry.type)}
                    {entry.amount.toLocaleString()}
                  </div>
                </div>
              ))}
              
              {filteredTransactions.length === 0 && (
                <div className="text-center py-12 border-4 border-dashed border-nb-black/30">
                  <p className="font-black text-nb-black uppercase tracking-widest text-lg">No recent logs</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white border-4 border-nb-black shadow-nb">
          <div className="bg-nb-yellow border-b-4 border-nb-black p-6">
            <h2 className="text-2xl font-display font-black text-nb-black uppercase tracking-widest flex items-center gap-3">
              <Banknote className="w-8 h-8" strokeWidth={2.5} />
              All Finance Entries
            </h2>
          </div>
          <div className="p-0">
            <div className="p-6 border-b-4 border-nb-black flex flex-col md:flex-row gap-4 bg-nb-bg">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-nb-black" strokeWidth={2.5} />
                <input
                  placeholder="SEARCH ENTRIES..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full border-2 border-nb-black rounded-none shadow-[2px_2px_0px_0px_#000] focus:outline-none bg-white text-nb-black font-black uppercase tracking-widest h-12"
                />
              </div>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full md:w-64 border-2 border-nb-black rounded-none shadow-[2px_2px_0px_0px_#000] focus:outline-none bg-white text-nb-black font-black uppercase tracking-widest h-12 px-3 appearance-none cursor-pointer"
              >
                <option value="all">ALL TYPES</option>
                <option value="fund">FUND</option>
                <option value="loan">LOAN</option>
                <option value="cash_in">CASH IN</option>
                <option value="cash_out">CASH OUT</option>
                <option value="bank_deposit">DEPOSIT TO BANK</option>
                <option value="bank_withdraw">WITHDRAW FROM BANK</option>
                <option value="income">INCOME</option>
                <option value="expense">EXPENSE</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-nb-gray text-nb-black">
                    <th className="p-4 border-b-4 border-nb-black font-black uppercase tracking-widest whitespace-nowrap">Date</th>
                    <th className="p-4 border-b-4 border-nb-black font-black uppercase tracking-widest whitespace-nowrap">Description</th>
                    <th className="p-4 border-b-4 border-nb-black font-black uppercase tracking-widest whitespace-nowrap">Type</th>
                    <th className="p-4 border-b-4 border-nb-black font-black uppercase tracking-widest whitespace-nowrap">Bank Account</th>
                    <th className="p-4 border-b-4 border-nb-black font-black uppercase tracking-widest whitespace-nowrap">Amount</th>
                    <th className="p-4 border-b-4 border-nb-black font-black uppercase tracking-widest whitespace-nowrap">Notes</th>
                    <th className="p-4 border-b-4 border-nb-black font-black uppercase tracking-widest whitespace-nowrap text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="font-bold">
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((transaction) => (
                      <tr key={transaction._id || transaction.id} className="border-b border-nb-black/20 hover:bg-nb-bg transition-colors">
                        <td className="p-4 whitespace-nowrap">{transaction.date}</td>
                        <td className="p-4">{transaction.description}</td>
                        <td className="p-4 whitespace-nowrap">
                          <span className="bg-white border-2 border-nb-black px-2 py-1 text-xs font-black uppercase tracking-widest shadow-[2px_2px_0px_0px_#000]">
                            {getTypeLabel(transaction.type)}
                          </span>
                        </td>
                        <td className="p-4">{transaction.bankAccountName || '-'}</td>
                        <td className={`p-4 whitespace-nowrap ${getAmountClass(transaction.type)}`}>
                          {getAmountPrefix(transaction.type)}LKR {transaction.amount.toLocaleString()}
                        </td>
                        <td className="p-4 max-w-xs truncate">{transaction.notes || '-'}</td>
                        <td className="p-4 text-right">
                          <button
                            className="nb-interactive bg-nb-red border-2 border-nb-black p-2 shadow-[2px_2px_0px_0px_#000] inline-flex items-center justify-center"
                            onClick={() => handleDeleteTransaction(transaction._id || transaction.id)}
                          >
                            <Trash2 className="w-4 h-4 text-white" strokeWidth={2.5} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-nb-black font-black uppercase tracking-widest border-b border-nb-black/20">
                        No entries found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        </div>
      )}
    </>
  );
}