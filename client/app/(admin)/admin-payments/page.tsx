'use client';

import { useEffect, useMemo, useState } from 'react';
import PaymentsLoading from './loading';
import {
  CreditCard,
  Search,
  Plus,
  TrendingUp,
  TrendingDown,
  Building2,
  Users,
  Receipt,
  Download,
  Eye,
  Edit,
  CheckCircle,
  Upload,
  FileText,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  BarChart3,
  PieChart as PieChartIcon,
  X,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

type PaymentType = 'expense' | 'supplier' | 'customer';
type PaymentMethod = 'cash' | 'bank';
type PaymentStatus = 'pending' | 'completed' | 'failed';

interface Transaction {
  _id?: string;
  id?: string;
  transaction_id?: string;
  date: string;
  type: PaymentType;
  category: string;
  relatedEntity: string;
  amount: number;
  paymentMethod: PaymentMethod;
  bankAccountId?: string;
  bankAccountName?: string;
  status: PaymentStatus;
  notes?: string;
  receiptUrl?: string;
  isFinanceLinked?: boolean;
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

const API_BASE = 'http://localhost:5900/api/paymentTransactions';
const API_BASE_BANK = 'http://localhost:5900/api/bankAccounts';

function getToken(): string {
  if (typeof window === 'undefined') return '';
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user?.token || localStorage.getItem('token') || '';
  } catch { return ''; }
}
function authHeaders() {
  const t = getToken();
  return t ? { 'Authorization': `Bearer ${t}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
}


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

const mapBankFromBackend = (item: any): BankAccount => ({
  _id: item._id || item.id,
  id: item._id || item.id,
  bank_name: item.bank_name || '',
  account_name: item.account_name || '',
  account_number: item.account_number || '',
  branch: item.branch || '',
  notes: item.notes || '',
  opening_balance: parseNumber(item.opening_balance),
});

const mapTransactionFromBackend = (item: any): Transaction => ({
  _id: item._id || item.id,
  id: item._id || item.id,
  transaction_id: item.transaction_id || item.txn_id || item.id || item._id,
  date: item.date ? String(item.date).slice(0, 10) : '',
  type: item.type || 'expense',
  category: item.category || '',
  relatedEntity: item.relatedEntity || item.related_entity || '',
  amount: parseNumber(item.amount),
  paymentMethod: item.paymentMethod || item.payment_method || 'cash',
  bankAccountId: item.bankAccountId || item.bank_account_id || '',
  bankAccountName: item.bankAccountName || item.bank_account_name || '',
  status: item.status || 'pending',
  notes: item.notes || '',
  receiptUrl: item.receiptUrl || item.receipt_url || '',
  isFinanceLinked: item.isFinanceLinked || false,
});

const initialForm = {
  paymentType: 'expense' as PaymentType,
  relatedEntity: '',
  amount: '',
  paymentMethod: 'bank' as PaymentMethod,
  date: new Date().toISOString().split('T')[0],
  category: '',
  notes: '',
  status: 'completed' as PaymentStatus,
  bankAccountId: '',
};

const inputStyle =
  'w-full px-4 py-3 border-2 border-black bg-white shadow-[2px_2px_0px_0px_#000] focus:shadow-[4px_4px_0px_0px_#000] focus:outline-none font-bold uppercase transition-all rounded-none';
const selectStyle =
  'w-full px-4 py-3 border-2 border-black bg-white shadow-[2px_2px_0px_0px_#000] focus:shadow-[4px_4px_0px_0px_#000] focus:outline-none font-bold uppercase transition-all rounded-none appearance-none cursor-pointer';

export default function PaymentsTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [formData, setFormData] = useState(initialForm);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [financeTransactions, setFinanceTransactions] = useState<any[]>([]);

  // New states for View/Edit
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    fetchTransactions();
    fetchBankAccounts();
    fetchFinanceTransactions();
  }, []);

  const fetchFinanceTransactions = async () => {
    try {
      const response = await fetch(`http://localhost:5900/api/finance/getTransactions`, { headers: authHeaders() });
      if (!response.ok) return;
      const data = await response.json();
      const itemsArray =
        Array.isArray(data) ? data :
        Array.isArray(data.items) ? data.items :
        Array.isArray(data.data) ? data.data :
        Array.isArray(data.transactions) ? data.transactions :
        [];
      setFinanceTransactions(itemsArray);
    } catch (error) {
      console.error('Error fetching finance transactions:', error);
    }
  };

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/getPayments`, { headers: authHeaders() });

      if (!response.ok) {
        throw new Error(`Failed to fetch transactions: ${response.status}`);
      }

      const data = await response.json();

      const itemsArray =
        Array.isArray(data) ? data :
        Array.isArray(data.items) ? data.items :
        Array.isArray(data.data) ? data.data :
        Array.isArray(data.transactions) ? data.transactions :
        Array.isArray(data.payments) ? data.payments :
        [];

      setTransactions(itemsArray.map(mapTransactionFromBackend));
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchBankAccounts = async () => {
    try {
      const response = await fetch(`${API_BASE_BANK}/getBankAccounts`, { headers: authHeaders() });

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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const handleView = (txn: Transaction) => {
    setSelectedTxn(txn);
    setIsViewOpen(true);
  };

  const handleEdit = (txn: Transaction) => {
    setSelectedTxn(txn);
    setIsEditMode(true);
    setFormData({
      paymentType: txn.type,
      relatedEntity: txn.relatedEntity,
      amount: String(txn.amount) as any,
      paymentMethod: txn.paymentMethod,
      date: txn.date,
      category: txn.category,
      notes: txn.notes || '',
      status: txn.status,
      bankAccountId: txn.bankAccountId || '',
    });
    setShowAddModal(true);
  };

  const handleSubmit = async () => {
    if (!formData.category) {
      alert('Category is required');
      return;
    }

    if (!formData.relatedEntity.trim()) {
      alert('Related entity is required');
      return;
    }

    if (!formData.amount || Number(formData.amount) <= 0) {
      alert('Amount must be greater than 0');
      return;
    }

    if (!formData.date) {
      alert('Payment date is required');
      return;
    }

    if (formData.paymentMethod === 'bank' && !formData.bankAccountId) {
      alert('Please select a bank account');
      return;
    }

    setSubmitLoading(true);

    try {
      const selectedBank = bankAccounts.find(
        (bank) => (bank._id || bank.id) === formData.bankAccountId
      );

      const payload = {
        type: formData.paymentType,
        category: formData.category,
        relatedEntity: formData.relatedEntity,
        amount: Number(formData.amount),
        paymentMethod: formData.paymentMethod,
        date: formData.date,
        notes: formData.notes,
        status: formData.status,
        bankAccountId: formData.paymentMethod === 'bank' ? formData.bankAccountId : null,
        bankAccountName:
          formData.paymentMethod === 'bank' && selectedBank
            ? `${selectedBank.bank_name} - ${selectedBank.account_number}`
            : '',
      };

      const response = await fetch(
        isEditMode && selectedTxn
          ? `${API_BASE}/updatePayment/${selectedTxn._id || selectedTxn.id}`
          : `${API_BASE}/addPayment`,
        {
          method: isEditMode ? 'PUT' : 'POST',
          headers: authHeaders(),
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.message || 'Failed to save payment');
      }

      setShowAddModal(false);
      setShowSuccessModal(true);
      setFormData(initialForm);
      setIsEditMode(false);
      setSelectedTxn(null);
      setUploadedFile(null);
      await fetchTransactions();
    } catch (error: any) {
      console.error('Error saving payment:', error);
      alert(error.message || 'Failed to save payment');
    } finally {
      setSubmitLoading(false);
    }
  };

  const totalExpenses = useMemo(
    () =>
      transactions
        .filter((t) => t.type === 'expense' && t.status === 'completed')
        .reduce((sum, t) => sum + t.amount, 0),
    [transactions]
  );

  const totalSupplierPayments = useMemo(
    () =>
      transactions
        .filter((t) => t.type === 'supplier' && t.status === 'completed')
        .reduce((sum, t) => sum + t.amount, 0),
    [transactions]
  );

  const totalCustomerIncome = useMemo(
    () =>
      transactions
        .filter((t) => t.type === 'customer' && t.status === 'completed')
        .reduce((sum, t) => sum + t.amount, 0),
    [transactions]
  );

  const cashInHand = useMemo(() => {
    const cashCustomer = transactions
      .filter((t) => t.status === 'completed' && t.paymentMethod === 'cash' && t.type === 'customer' && !t.isFinanceLinked)
      .reduce((sum, t) => sum + t.amount, 0);
  
    const cashSupplier = transactions
      .filter((t) => t.status === 'completed' && t.paymentMethod === 'cash' && t.type === 'supplier' && !t.isFinanceLinked)
      .reduce((sum, t) => sum + t.amount, 0);
  
    const cashExpense = transactions
      .filter((t) => t.status === 'completed' && t.paymentMethod === 'cash' && t.type === 'expense' && !t.isFinanceLinked)
      .reduce((sum, t) => sum + t.amount, 0);

    const financeCashIn = financeTransactions
      .filter((t) => t.transaction_type === 'cash_in' || t.type === 'cash_in')
      .reduce((sum, t) => sum + parseNumber(t.amount), 0);

    const financeCashOut = financeTransactions
      .filter((t) => t.transaction_type === 'cash_out' || t.type === 'cash_out')
      .reduce((sum, t) => sum + parseNumber(t.amount), 0);

    const financeBankWithdraw = financeTransactions
      .filter((t) => t.transaction_type === 'bank_withdraw' || t.type === 'bank_withdraw')
      .reduce((sum, t) => sum + parseNumber(t.amount), 0);

    const financeBankDeposit = financeTransactions
      .filter((t) => t.transaction_type === 'bank_deposit' || t.type === 'bank_deposit')
      .reduce((sum, t) => sum + parseNumber(t.amount), 0);

    return cashCustomer - cashSupplier - cashExpense + financeCashIn + financeBankWithdraw - financeCashOut - financeBankDeposit;
  }, [transactions, financeTransactions]);

  const getBankBalance = (bankId: string) => {
    const account = bankAccounts.find((b) => (b._id || b.id) === bankId);
    const openingBalance = parseNumber(account?.opening_balance);

    const bankCustomerIncome = transactions
      .filter(
        (t) =>
          t.status === 'completed' &&
          t.paymentMethod === 'bank' &&
          t.type === 'customer' &&
          t.bankAccountId === bankId &&
          !t.isFinanceLinked
      )
      .reduce((sum, t) => sum + t.amount, 0);

    const bankExpenses = transactions
      .filter(
        (t) =>
          t.status === 'completed' &&
          t.paymentMethod === 'bank' &&
          (t.type === 'expense' || t.type === 'supplier') &&
          t.bankAccountId === bankId &&
          !t.isFinanceLinked
      )
      .reduce((sum, t) => sum + t.amount, 0);

    const financeDeposits = financeTransactions
      .filter((t) => (t.transaction_type === 'bank_deposit' || t.type === 'bank_deposit') && (t.bankAccountId === bankId || t.bank_account_id === bankId))
      .reduce((sum, t) => sum + parseNumber(t.amount), 0);

    const financeWithdrawals = financeTransactions
      .filter((t) => (t.transaction_type === 'bank_withdraw' || t.type === 'bank_withdraw') && (t.bankAccountId === bankId || t.bank_account_id === bankId))
      .reduce((sum, t) => sum + parseNumber(t.amount), 0);

    return openingBalance + bankCustomerIncome - bankExpenses + financeDeposits - financeWithdrawals;
  };

  const totalBankBalance = useMemo(() => {
    return bankAccounts.reduce((sum, bank) => {
      const bankId = bank._id || bank.id || '';
      return sum + getBankBalance(bankId);
    }, 0);
  }, [bankAccounts, transactions]);

  const netBalance = totalCustomerIncome - totalExpenses - totalSupplierPayments;

  const filteredTransactions = transactions.filter((txn) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      (txn.transaction_id || '').toLowerCase().includes(q) ||
      (txn.relatedEntity || '').toLowerCase().includes(q) ||
      (txn.category || '').toLowerCase().includes(q) ||
      (txn.bankAccountName || '').toLowerCase().includes(q);

    const matchesType = typeFilter === 'all' || txn.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || txn.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  const stackedData = useMemo(() => {
    const dataMap: Record<string, { month: string; expenses: number; suppliers: number; customers: number }> = {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const mKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      dataMap[mKey] = { month: months[d.getMonth()], expenses: 0, suppliers: 0, customers: 0 };
    }

    transactions.forEach(t => {
      if ((t.status === 'completed' || t.status === undefined) && t.date) {
        const d = new Date(t.date);
        if (!isNaN(d.getTime())) {
          const mKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
          if (dataMap[mKey]) {
            if (t.type === 'expense') dataMap[mKey].expenses += t.amount;
            else if (t.type === 'supplier') dataMap[mKey].suppliers += t.amount;
            else if (t.type === 'customer') dataMap[mKey].customers += t.amount;
          }
        }
      }
    });

    return Object.values(dataMap);
  }, [transactions]);

  const pieData = useMemo(() => {
    const categoryMap: Record<string, number> = {};
    transactions.forEach(t => {
      if ((t.status === 'completed' || t.status === undefined) && (t.type === 'expense' || t.type === 'supplier')) {
        const cat = t.category || 'Other';
        categoryMap[cat] = (categoryMap[cat] || 0) + t.amount;
      }
    });

    const colors = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#ec4899', '#f97316'];
    
    return Object.entries(categoryMap)
      .filter(([_, value]) => value > 0)
      .map(([name, value], index) => ({
        name,
        value,
        color: colors[index % colors.length]
      }));
  }, [transactions]);

  const lineData = useMemo(() => {
    const dataMap: Record<string, { month: string; income: number; expenses: number }> = {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const mKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      dataMap[mKey] = { month: months[d.getMonth()], income: 0, expenses: 0 };
    }

    transactions.forEach(t => {
      if ((t.status === 'completed' || t.status === undefined) && t.date) {
        const d = new Date(t.date);
        if (!isNaN(d.getTime())) {
          const mKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
          if (dataMap[mKey]) {
            if (t.type === 'expense' || t.type === 'supplier') {
              dataMap[mKey].expenses += t.amount;
            } else if (t.type === 'customer') {
              dataMap[mKey].income += t.amount;
            }
          }
        }
      }
    });

    return Object.values(dataMap);
  }, [transactions]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'customer':
        return 'bg-nb-green text-black';
      case 'supplier':
        return 'bg-nb-purple text-black';
      case 'expense':
        return 'bg-nb-red text-black';
      default:
        return 'bg-white text-black';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-nb-green text-black';
      case 'pending':
        return 'bg-nb-yellow text-black';
      case 'failed':
        return 'bg-nb-red text-white';
      default:
        return 'bg-white text-black';
    }
  };

  if (loading) {
    return <PaymentsLoading />;
  }

  return (
    <>

      <main className="flex-1 overflow-y-auto p-8 border-l-4 border-black">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="bg-nb-purple border-4 border-black shadow-[8px_8px_0px_0px_#000] p-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-4xl font-black uppercase tracking-tight mb-2 flex items-center gap-3">
                  <CreditCard className="w-10 h-10" />
                  Payments & Transactions
                </h1>
                <p className="text-xl font-bold">
                  Track expenses, supplier payments, customer income, and bank balances
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-nb-yellow text-black px-6 py-3 border-4 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-none transition-all font-bold text-lg flex items-center gap-2 uppercase"
              >
                <Plus className="w-6 h-6" />
                Add Payment
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
            <div className="bg-nb-pink border-4 border-black shadow-[4px_4px_0px_0px_#000] p-6 relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000]">
                  <Receipt className="w-6 h-6 text-black" />
                </div>
                <div className="bg-white border-2 border-black px-2 py-1 font-bold text-sm shadow-[2px_2px_0px_0px_#000] flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +5.2%
                </div>
              </div>
              <h3 className="text-sm font-bold uppercase mb-1">Total Expenses</h3>
              <p className="text-2xl font-black">LKR {totalExpenses.toLocaleString()}</p>
            </div>

            <div className="bg-nb-blue border-4 border-black shadow-[4px_4px_0px_0px_#000] p-6 relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000]">
                  <Building2 className="w-6 h-6 text-black" />
                </div>
                <div className="bg-white border-2 border-black px-2 py-1 font-bold text-sm shadow-[2px_2px_0px_0px_#000] flex items-center">
                  <TrendingDown className="w-3 h-3 mr-1" />
                  -2.1%
                </div>
              </div>
              <h3 className="text-sm font-bold uppercase mb-1">Supplier Payments</h3>
              <p className="text-2xl font-black">LKR {totalSupplierPayments.toLocaleString()}</p>
            </div>

            <div className="bg-nb-cyan border-4 border-black shadow-[4px_4px_0px_0px_#000] p-6 relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000]">
                  <Users className="w-6 h-6 text-black" />
                </div>
                <div className="bg-white border-2 border-black px-2 py-1 font-bold text-sm shadow-[2px_2px_0px_0px_#000] flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +8.5%
                </div>
              </div>
              <h3 className="text-sm font-bold uppercase mb-1">Customer Income</h3>
              <p className="text-2xl font-black">LKR {totalCustomerIncome.toLocaleString()}</p>
            </div>

            <div className={`border-4 border-black shadow-[4px_4px_0px_0px_#000] p-6 relative ${cashInHand >= 0 ? 'bg-nb-green' : 'bg-nb-red'}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000]">
                  <Wallet className="w-6 h-6 text-black" />
                </div>
              </div>
              <h3 className="text-sm font-bold uppercase mb-1">Cash In Hand</h3>
              <p className="text-2xl font-black">
                LKR {Math.abs(cashInHand).toLocaleString()}
              </p>
            </div>

            <div className={`border-4 border-black shadow-[4px_4px_0px_0px_#000] p-6 relative ${totalBankBalance >= 0 ? 'bg-nb-orange' : 'bg-nb-red'}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000]">
                  <Building2 className="w-6 h-6 text-black" />
                </div>
                <div className="bg-white border-2 border-black px-2 py-1 font-bold text-sm shadow-[2px_2px_0px_0px_#000] flex items-center">
                  {netBalance >= 0 ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                  {netBalance >= 0 ? '+' : ''}{totalCustomerIncome ? ((netBalance / totalCustomerIncome) * 100).toFixed(1) : '0'}%
                </div>
              </div>
              <h3 className="text-sm font-bold uppercase mb-1">Total Bank Balance</h3>
              <p className="text-2xl font-black">
                LKR {Math.abs(totalBankBalance).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Bank Accounts List */}
          {bankAccounts.length > 0 && (
            <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] overflow-hidden">
              <div className="bg-nb-yellow border-b-4 border-black p-4 flex items-center gap-2 font-black uppercase text-xl">
                <Building2 className="w-6 h-6" />
                Bank Account Balances
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {bankAccounts.map((bank) => {
                  const bankId = bank._id || bank.id || '';
                  return (
                    <div key={bankId} className="bg-nb-bg border-4 border-black shadow-[4px_4px_0px_0px_#000] p-4 relative">
                      <p className="text-sm font-bold uppercase bg-white border-2 border-black px-2 py-1 inline-block mb-2 shadow-[2px_2px_0px_0px_#000]">{bank.bank_name}</p>
                      <h3 className="text-xl font-black uppercase mb-1">{bank.account_name}</h3>
                      <p className="text-sm font-bold text-gray-700">{bank.account_number}</p>
                      <div className="mt-4 border-t-2 border-black pt-4">
                        <p className="text-2xl font-black bg-white inline-block px-3 py-1 border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                          LKR {getBankBalance(bankId).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Table */}
          <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] overflow-hidden">
            <div className="bg-nb-orange border-b-4 border-black p-4 flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-2 font-black uppercase text-xl">
                <FileText className="w-6 h-6" />
                Payment Logs
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black" />
                  <input
                    placeholder="SEARCH TRANSACTIONS..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 border-2 border-black bg-white shadow-[2px_2px_0px_0px_#000] focus:shadow-[4px_4px_0px_0px_#000] focus:outline-none font-bold uppercase w-64"
                  />
                </div>
                <select 
                  value={typeFilter} 
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-4 py-2 border-2 border-black bg-white shadow-[2px_2px_0px_0px_#000] focus:shadow-[4px_4px_0px_0px_#000] focus:outline-none font-bold uppercase w-40 appearance-none cursor-pointer"
                >
                  <option value="all">ALL TYPES</option>
                  <option value="expense">EXPENSE</option>
                  <option value="supplier">SUPPLIER</option>
                  <option value="customer">CUSTOMER</option>
                </select>
                <select 
                  value={statusFilter} 
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border-2 border-black bg-white shadow-[2px_2px_0px_0px_#000] focus:shadow-[4px_4px_0px_0px_#000] focus:outline-none font-bold uppercase w-40 appearance-none cursor-pointer"
                >
                  <option value="all">ALL STATUS</option>
                  <option value="completed">COMPLETED</option>
                  <option value="pending">PENDING</option>
                  <option value="failed">FAILED</option>
                </select>
              </div>
            </div>

            <div className="p-0 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-nb-bg border-b-4 border-black">
                    <th className="p-4 font-black uppercase border-r-2 border-black whitespace-nowrap">Date</th>
                    <th className="p-4 font-black uppercase border-r-2 border-black whitespace-nowrap">Txn ID</th>
                    <th className="p-4 font-black uppercase border-r-2 border-black whitespace-nowrap">Type</th>
                    <th className="p-4 font-black uppercase border-r-2 border-black whitespace-nowrap">Category</th>
                    <th className="p-4 font-black uppercase border-r-2 border-black whitespace-nowrap">Related Entity</th>
                    <th className="p-4 font-black uppercase border-r-2 border-black whitespace-nowrap">Amount</th>
                    <th className="p-4 font-black uppercase border-r-2 border-black whitespace-nowrap">Method</th>
                    <th className="p-4 font-black uppercase border-r-2 border-black whitespace-nowrap">Bank Account</th>
                    <th className="p-4 font-black uppercase border-r-2 border-black whitespace-nowrap">Status</th>
                    <th className="p-4 font-black uppercase whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={10} className="p-8 text-center font-bold uppercase">
                        LOADING TRANSACTIONS...
                      </td>
                    </tr>
                  ) : filteredTransactions.length > 0 ? (
                    filteredTransactions.map((txn) => (
                      <tr key={txn._id || txn.id} className="border-b-2 border-black hover:bg-nb-bg transition-colors">
                        <td className="p-4 font-bold border-r-2 border-black whitespace-nowrap">{txn.date}</td>
                        <td className="p-4 font-bold border-r-2 border-black whitespace-nowrap">{txn.transaction_id}</td>
                        <td className="p-4 border-r-2 border-black whitespace-nowrap">
                          <span className={`px-2 py-1 border-2 border-black font-bold text-xs uppercase shadow-[2px_2px_0px_0px_#000] inline-flex items-center ${getTypeColor(txn.type)}`}>
                            {txn.type === 'customer' && <ArrowUpRight className="w-3 h-3 mr-1" />}
                            {txn.type === 'supplier' && <ArrowDownRight className="w-3 h-3 mr-1" />}
                            {txn.type === 'expense' && <Receipt className="w-3 h-3 mr-1" />}
                            {txn.type}
                          </span>
                        </td>
                        <td className="p-4 font-bold border-r-2 border-black uppercase">{txn.category}</td>
                        <td className="p-4 font-bold border-r-2 border-black">{txn.relatedEntity}</td>
                        <td className={`p-4 font-black border-r-2 border-black whitespace-nowrap ${txn.type === 'customer' ? 'text-green-600' : 'text-red-600'}`}>
                          {txn.type === 'customer' ? '+' : '-'}LKR {txn.amount.toLocaleString()}
                        </td>
                        <td className="p-4 font-bold border-r-2 border-black uppercase whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {txn.paymentMethod === 'bank' ? <Building2 className="w-4 h-4" /> : <Wallet className="w-4 h-4" />}
                            {txn.paymentMethod === 'bank' ? 'Bank' : 'Cash'}
                          </div>
                        </td>
                        <td className="p-4 font-bold border-r-2 border-black whitespace-nowrap">{txn.paymentMethod === 'bank' ? txn.bankAccountName || '-' : '-'}</td>
                        <td className="p-4 border-r-2 border-black whitespace-nowrap">
                          <span className={`px-2 py-1 border-2 border-black font-bold text-xs uppercase shadow-[2px_2px_0px_0px_#000] inline-flex items-center ${getStatusColor(txn.status)}`}>
                            {txn.status === 'completed' && <CheckCircle className="w-3 h-3 mr-1" />}
                            {txn.status}
                          </span>
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleView(txn)}
                              className="p-2 bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-none transition-all"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEdit(txn)}
                              className="p-2 bg-nb-cyan border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-none transition-all"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={10} className="p-8 text-center font-bold uppercase">
                        NO TRANSACTIONS FOUND
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="p-4 bg-nb-bg border-t-4 border-black flex items-center justify-between font-bold uppercase">
              <p>SHOWING {filteredTransactions.length} OF {transactions.length} TRANSACTIONS</p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] overflow-hidden">
              <div className="bg-nb-pink border-b-4 border-black p-4 flex items-center justify-between">
                <h3 className="font-black uppercase text-xl flex items-center gap-2">
                  <BarChart3 className="w-6 h-6" /> Payment Distribution
                </h3>
                <select className="px-4 py-2 border-2 border-black bg-white shadow-[2px_2px_0px_0px_#000] font-bold uppercase appearance-none cursor-pointer">
                  <option>6 MONTHS</option>
                  <option>QUARTER</option>
                  <option>YEAR</option>
                </select>
              </div>
              <div className="p-6">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stackedData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#000" vertical={false} />
                    <XAxis dataKey="month" stroke="#000" tick={{fontFamily: 'monospace', fontWeight: 'bold'}} />
                    <YAxis stroke="#000" tick={{fontFamily: 'monospace', fontWeight: 'bold'}} />
                    <Tooltip contentStyle={{border: '4px solid #000', borderRadius: '0', boxShadow: '4px 4px 0px 0px #000', fontFamily: 'monospace', fontWeight: 'bold'}} />
                    <Legend wrapperStyle={{fontFamily: 'monospace', fontWeight: 'bold'}} />
                    <Bar dataKey="expenses" stackId="a" fill="#ff4d4d" stroke="#000" strokeWidth={2} name="Expenses" />
                    <Bar dataKey="suppliers" stackId="a" fill="#cda4ff" stroke="#000" strokeWidth={2} name="Suppliers" />
                    <Bar dataKey="customers" stackId="a" fill="#4dff4d" stroke="#000" strokeWidth={2} name="Customers" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] overflow-hidden">
              <div className="bg-nb-cyan border-b-4 border-black p-4 flex items-center justify-between">
                <h3 className="font-black uppercase text-xl flex items-center gap-2">
                  <PieChartIcon className="w-6 h-6" /> Expense Breakdown
                </h3>
                <select className="px-4 py-2 border-2 border-black bg-white shadow-[2px_2px_0px_0px_#000] font-bold uppercase appearance-none cursor-pointer">
                  <option>THIS MONTH</option>
                  <option>QUARTER</option>
                  <option>YEAR</option>
                </select>
              </div>
              <div className="p-6">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      dataKey="value"
                      stroke="#000"
                      strokeWidth={2}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{border: '4px solid #000', borderRadius: '0', boxShadow: '4px 4px 0px 0px #000', fontFamily: 'monospace', fontWeight: 'bold'}} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] overflow-hidden lg:col-span-2">
              <div className="bg-nb-purple border-b-4 border-black p-4 flex items-center justify-between">
                <h3 className="font-black uppercase text-xl flex items-center gap-2 text-white">
                  <Sparkles className="w-6 h-6" /> Income vs Expenses Trend
                </h3>
              </div>
              <div className="p-6">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={lineData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#000" vertical={false} />
                    <XAxis dataKey="month" stroke="#000" tick={{fontFamily: 'monospace', fontWeight: 'bold'}} />
                    <YAxis stroke="#000" tick={{fontFamily: 'monospace', fontWeight: 'bold'}} />
                    <Tooltip contentStyle={{border: '4px solid #000', borderRadius: '0', boxShadow: '4px 4px 0px 0px #000', fontFamily: 'monospace', fontWeight: 'bold'}} />
                    <Legend wrapperStyle={{fontFamily: 'monospace', fontWeight: 'bold'}} />
                    <Line type="monotone" dataKey="income" stroke="#4dff4d" strokeWidth={4} name="Income" activeDot={{ r: 8, stroke: '#000', strokeWidth: 2 }} />
                    <Line type="monotone" dataKey="expenses" stroke="#ff4d4d" strokeWidth={4} name="Expenses" activeDot={{ r: 8, stroke: '#000', strokeWidth: 2 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] overflow-hidden mb-8">
            <div className="bg-nb-green border-b-4 border-black p-4">
              <h3 className="font-black uppercase text-xl flex items-center gap-2">
                <Download className="w-6 h-6" /> Reports & Export
              </h3>
            </div>
            <div className="p-6">
              <p className="font-bold uppercase mb-4">Generate and export financial reports</p>
              <div className="flex gap-4 flex-wrap">
                <button className="bg-nb-cyan px-6 py-3 border-4 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-none transition-all font-black uppercase flex items-center gap-2">
                  <Download className="w-5 h-5" /> Export Report
                </button>
                <button className="bg-white px-6 py-3 border-4 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-none transition-all font-black uppercase flex items-center gap-2">
                  <FileText className="w-5 h-5" /> Preview Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] w-full max-w-3xl max-h-[90vh] flex flex-col font-mono">
            <div className="bg-nb-yellow border-b-4 border-black p-4 flex justify-between items-center">
              <h2 className="text-2xl font-black uppercase flex items-center gap-2">
                {isEditMode ? <Edit className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
                {isEditMode ? 'Edit Payment' : 'Add New Payment'}
              </h2>
              <button 
                onClick={() => {
                  setShowAddModal(false);
                  setIsEditMode(false);
                  setSelectedTxn(null);
                  setFormData(initialForm);
                }}
                className="p-1 hover:bg-black hover:text-white border-2 border-transparent hover:border-black transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 font-bold space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 uppercase">Payment Type *</label>
                  <select
                    value={formData.paymentType}
                    onChange={(e) => setFormData({ ...formData, paymentType: e.target.value as PaymentType, category: '', relatedEntity: '' })}
                    className={selectStyle}
                  >
                    <option value="expense">EXPENSE</option>
                    <option value="supplier">SUPPLIER PAYMENT</option>
                    <option value="customer">CUSTOMER INCOME</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2 uppercase">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className={selectStyle}
                  >
                    <option value="">SELECT CATEGORY</option>
                    {formData.paymentType === 'expense' && (
                      <>
                        <option value="salary">SALARY</option>
                        <option value="utilities">UTILITIES</option>
                        <option value="rent">RENT</option>
                        <option value="transport">TRANSPORT</option>
                        <option value="other">OTHER</option>
                      </>
                    )}
                    {formData.paymentType === 'supplier' && (
                      <>
                        <option value="stock-purchase">STOCK PURCHASE</option>
                        <option value="services">SERVICES</option>
                        <option value="raw-materials">RAW MATERIALS</option>
                      </>
                    )}
                    {formData.paymentType === 'customer' && (
                      <>
                        <option value="product-sale">PRODUCT SALE</option>
                        <option value="service">SERVICE</option>
                        <option value="subscription">SUBSCRIPTION</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div>
                <label className="block mb-2 uppercase">Related Entity *</label>
                <input
                  type="text"
                  placeholder={
                    formData.paymentType === 'expense'
                      ? 'ENTER EXPENSE TITLE'
                      : formData.paymentType === 'supplier'
                      ? 'ENTER SUPPLIER NAME'
                      : 'ENTER CUSTOMER NAME'
                  }
                  value={formData.relatedEntity}
                  onChange={(e) => setFormData({ ...formData, relatedEntity: e.target.value })}
                  className={inputStyle}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 uppercase">Amount *</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className={inputStyle}
                  />
                </div>

                <div>
                  <label className="block mb-2 uppercase">Payment Method *</label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({
                      ...formData,
                      paymentMethod: e.target.value as PaymentMethod,
                      bankAccountId: e.target.value === 'bank' ? formData.bankAccountId : '',
                    })}
                    className={selectStyle}
                  >
                    <option value="cash">CASH</option>
                    <option value="bank">BANK TRANSFER</option>
                  </select>
                </div>
              </div>

              {formData.paymentMethod === 'bank' && (
                <div>
                  <label className="block mb-2 uppercase">Bank Account *</label>
                  <select
                    value={formData.bankAccountId}
                    onChange={(e) => setFormData({ ...formData, bankAccountId: e.target.value })}
                    className={selectStyle}
                  >
                    <option value="">SELECT BANK ACCOUNT</option>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 uppercase">Payment Date *</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className={inputStyle}
                  />
                </div>

                <div>
                  <label className="block mb-2 uppercase">Status *</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as PaymentStatus })}
                    className={selectStyle}
                  >
                    <option value="pending">PENDING</option>
                    <option value="completed">COMPLETED</option>
                    <option value="failed">FAILED</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block mb-2 uppercase">Notes / Description</label>
                <textarea
                  placeholder="ADD ANY ADDITIONAL NOTES OR DESCRIPTION..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className={inputStyle}
                  rows={3}
                />
              </div>

              <div>
                <label className="block mb-2 uppercase">Upload Receipt / Proof (Optional)</label>
                <div className="mt-2 border-4 border-dashed border-black bg-white p-6 text-center hover:bg-nb-bg transition-all shadow-[4px_4px_0px_0px_#000]">
                  <Upload className="w-8 h-8 text-black mx-auto mb-2" />
                  <p className="font-bold uppercase mb-2">Click to upload or drag and drop</p>
                  <p className="text-sm font-bold mb-3">PDF, PNG, JPG (MAX 5MB)</p>
                  <input
                    type="file"
                    id="receipt-upload"
                    className="hidden"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={handleFileUpload}
                  />
                  <label htmlFor="receipt-upload">
                    <button
                      type="button"
                      className="px-4 py-2 bg-nb-cyan border-2 border-black font-black uppercase shadow-[2px_2px_0px_0px_#000] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-none transition-all"
                      onClick={() => document.getElementById('receipt-upload')?.click()}
                    >
                      Choose File
                    </button>
                  </label>
                  {uploadedFile && (
                    <div className="mt-4 inline-flex items-center gap-2 font-bold uppercase bg-nb-green px-4 py-2 border-2 border-black">
                      <CheckCircle className="w-5 h-5" />
                      {uploadedFile.name}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t-4 border-black p-4 bg-nb-bg flex gap-4">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setIsEditMode(false);
                  setSelectedTxn(null);
                  setFormData(initialForm);
                }}
                className="flex-1 px-4 py-3 bg-white border-4 border-black font-black uppercase shadow-[4px_4px_0px_0px_#000] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-none transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitLoading}
                className={`flex-1 px-4 py-3 border-4 border-black font-black uppercase shadow-[4px_4px_0px_0px_#000] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-none transition-all ${
                  isEditMode ? 'bg-nb-cyan' : 'bg-nb-green'
                }`}
              >
                {submitLoading ? 'SAVING...' : isEditMode ? 'UPDATE PAYMENT' : 'ADD PAYMENT'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Transaction Modal */}
      {isViewOpen && selectedTxn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] w-full max-w-2xl max-h-[90vh] flex flex-col font-mono">
            <div className="bg-nb-cyan border-b-4 border-black p-4 flex justify-between items-center">
              <h2 className="text-2xl font-black uppercase flex items-center gap-2">
                <Receipt className="w-6 h-6" />
                Transaction Details
              </h2>
              <button 
                onClick={() => setIsViewOpen(false)}
                className="p-1 hover:bg-black hover:text-white border-2 border-transparent hover:border-black transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              <div className="grid grid-cols-2 gap-6 bg-nb-bg border-4 border-black p-6 shadow-[4px_4px_0px_0px_#000]">
                <div>
                  <label className="text-sm font-black uppercase block mb-1">Transaction ID</label>
                  <p className="font-bold bg-white border-2 border-black px-2 py-1 inline-block">{selectedTxn.transaction_id}</p>
                </div>
                <div>
                  <label className="text-sm font-black uppercase block mb-1">Date</label>
                  <p className="font-bold bg-white border-2 border-black px-2 py-1 inline-block">{selectedTxn.date}</p>
                </div>
                <div>
                  <label className="text-sm font-black uppercase block mb-1">Type</label>
                  <span className={`px-2 py-1 border-2 border-black font-bold uppercase shadow-[2px_2px_0px_0px_#000] inline-block ${getTypeColor(selectedTxn.type)}`}>
                    {selectedTxn.type}
                  </span>
                </div>
                <div>
                  <label className="text-sm font-black uppercase block mb-1">Status</label>
                  <span className={`px-2 py-1 border-2 border-black font-bold uppercase shadow-[2px_2px_0px_0px_#000] inline-block ${getStatusColor(selectedTxn.status)}`}>
                    {selectedTxn.status}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-end border-b-4 border-black pb-4">
                  <div>
                    <label className="text-sm font-black uppercase block">Related Entity</label>
                    <p className="text-2xl font-black uppercase">{selectedTxn.relatedEntity}</p>
                    <p className="font-bold inline-block px-2 py-1 bg-nb-yellow border-2 border-black mt-2 uppercase text-sm shadow-[2px_2px_0px_0px_#000]">{selectedTxn.category}</p>
                  </div>
                  <div className="text-right">
                    <label className="text-sm font-black uppercase block mb-1">Amount</label>
                    <p className={`text-4xl font-black bg-white border-4 border-black px-3 py-1 shadow-[4px_4px_0px_0px_#000] inline-block ${selectedTxn.type === 'customer' ? 'text-green-600' : 'text-red-600'}`}>
                      LKR {selectedTxn.amount.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-black uppercase block mb-1">Payment Method</label>
                    <div className="flex items-center gap-2 font-black uppercase bg-nb-bg border-2 border-black px-3 py-2 inline-flex shadow-[2px_2px_0px_0px_#000]">
                      {selectedTxn.paymentMethod === 'bank' ? <Building2 className="w-5 h-5" /> : <Wallet className="w-5 h-5" />}
                      <span>{selectedTxn.paymentMethod}</span>
                    </div>
                  </div>
                  {selectedTxn.bankAccountName && (
                    <div>
                      <label className="text-sm font-black uppercase block mb-1">Bank Account</label>
                      <p className="font-black uppercase bg-white border-2 border-black px-3 py-2 shadow-[2px_2px_0px_0px_#000] inline-block">{selectedTxn.bankAccountName}</p>
                    </div>
                  )}
                </div>

                {selectedTxn.notes && (
                  <div className="bg-nb-yellow p-4 border-4 border-black shadow-[4px_4px_0px_0px_#000]">
                    <label className="text-sm font-black uppercase block mb-2">Notes</label>
                    <p className="font-bold uppercase leading-relaxed">{selectedTxn.notes}</p>
                  </div>
                )}

                {selectedTxn.receiptUrl && (
                  <div className="mt-6">
                    <label className="text-sm font-black uppercase block mb-2">Receipt / Proof</label>
                    <button 
                      onClick={() => window.open(selectedTxn.receiptUrl, '_blank')}
                      className="w-full py-3 bg-white border-4 border-black font-black uppercase shadow-[4px_4px_0px_0px_#000] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-none transition-all flex items-center justify-center gap-2"
                    >
                      <FileText className="w-5 h-5" />
                      VIEW UPLOADED DOCUMENT
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t-4 border-black p-4 bg-nb-bg flex gap-4">
              <button 
                onClick={() => setIsViewOpen(false)}
                className="flex-1 px-4 py-3 bg-white border-4 border-black font-black uppercase shadow-[4px_4px_0px_0px_#000] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-none transition-all"
              >
                Close
              </button>
              <button 
                onClick={() => {
                  setIsViewOpen(false);
                  handleEdit(selectedTxn);
                }}
                className="flex-1 px-4 py-3 bg-nb-cyan border-4 border-black font-black uppercase shadow-[4px_4px_0px_0px_#000] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-none transition-all flex items-center justify-center gap-2"
              >
                <Edit className="w-5 h-5" />
                Edit Transaction
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] w-full max-w-sm flex flex-col font-mono text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-4 bg-nb-green border-b-4 border-black"></div>
            <div className="p-8 pt-10">
              <div className="w-20 h-20 bg-nb-green border-4 border-black flex items-center justify-center mx-auto mb-6 shadow-[4px_4px_0px_0px_#000]">
                <CheckCircle className="w-10 h-10 text-black" />
              </div>
              <h2 className="text-2xl font-black uppercase mb-4">Payment Saved!</h2>
              <p className="font-bold mb-8 uppercase text-gray-700">
                Your payment transaction has been recorded.
              </p>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full px-4 py-3 bg-nb-green border-4 border-black font-black uppercase shadow-[4px_4px_0px_0px_#000] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-none transition-all"
              >
                DONE
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}