import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Building2,
  Calendar,
  Search,
  Filter,
  PlusCircle,
  Printer,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Trash2,
  X,
  DollarSign,
  Landmark,
  Save,
  Lock
} from 'lucide-react';
import { Transaction } from '../types';
import SchoolLogo from './SchoolLogo';

interface SchoolAccountsLedgerViewProps {
  transactions: Transaction[];
  onAddTransaction: (txn: Omit<Transaction, 'id'>) => void;
  onDeleteTransaction?: (id: string) => void;
  isAdmin?: boolean;
  onRequireAdminLogin?: () => void;
}

export default function SchoolAccountsLedgerView({
  transactions,
  onAddTransaction,
  onDeleteTransaction,
  isAdmin = false,
  onRequireAdminLogin
}: SchoolAccountsLedgerViewProps) {
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [filterBank, setFilterBank] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);

  // New Voucher Form State
  const [newType, setNewType] = useState<'income' | 'expense'>('income');
  const [newTitle, setNewTitle] = useState<string>('');
  const [newCategory, setNewCategory] = useState<string>('শিক্ষার্থী বেতন ও সেশন ফি');
  const [newAmount, setNewAmount] = useState<number | ''>('');
  const [newBank, setNewBank] = useState<'বাংলাদেশ কৃষি ব্যাংক' | 'আইএফআইসি ব্যাংক' | 'Cash'>('বাংলাদেশ কৃষি ব্যাংক');
  const [newDate, setNewDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [newRefNo, setNewRefNo] = useState<string>('');
  const [formError, setFormError] = useState<string>('');
  const [formSuccess, setFormSuccess] = useState<string>('');

  // Categories list
  const categories = useMemo(() => {
    const defaultCats = [
      'শিক্ষার্থী বেতন ও সেশন ফি',
      'উন্নয়ন ও দান অনুদান',
      'পরীক্ষা ও মূল্যায়ন ফি',
      'বেতন ও উৎসব ভাতা',
      'মেরামত ও রক্ষণাবেক্ষণ',
      'পরীক্ষা ও মুদ্রণ ব্যয়',
      'ইউটিলিটি ও বিল',
      'ক্রীড়া ও সাংস্কৃতিক',
      'অবকাঠামো উন্নয়ন',
      'দরিদ্র ও কল্যাণ তহবিল',
      'আইসিটি ও ল্যাব উন্নয়ন'
    ];
    const existing = new Set(defaultCats);
    transactions.forEach(t => {
      if (t.category) existing.add(t.category);
    });
    return Array.from(existing);
  }, [transactions]);

  // Financial KPI calculations
  const totalIncome = useMemo(() => {
    return transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const totalExpense = useMemo(() => {
    return transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const netBalance = totalIncome - totalExpense;

  const bkbBalance = useMemo(() => {
    const inc = transactions
      .filter(t => t.bank && (t.bank === 'বাংলাদেশ কৃষি ব্যাংক' || t.bank.includes('কৃষি ব্যাংক')) && t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const exp = transactions
      .filter(t => t.bank && (t.bank === 'বাংলাদেশ কৃষি ব্যাংক' || t.bank.includes('কৃষি ব্যাংক')) && t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    return inc - exp;
  }, [transactions]);

  const ificBalance = useMemo(() => {
    const inc = transactions
      .filter(t => t.bank && (t.bank === 'আইএফআইসি ব্যাংক' || t.bank.includes('আইএফআইসি')) && t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const exp = transactions
      .filter(t => t.bank && (t.bank === 'আইএফআইসি ব্যাংক' || t.bank.includes('আইএফআইসি')) && t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    return inc - exp;
  }, [transactions]);

  const cashBalance = useMemo(() => {
    const inc = transactions
      .filter(t => t.bank === 'Cash' && t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const exp = transactions
      .filter(t => t.bank === 'Cash' && t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    return inc - exp;
  }, [transactions]);

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      if (filterType !== 'all' && t.type !== filterType) return false;
      if (filterBank !== 'all') {
        if (filterBank === 'বাংলাদেশ কৃষি ব্যাংক') {
          if (!t.bank || !t.bank.includes('কৃষি ব্যাংক')) return false;
        } else if (filterBank === 'আইএফআইসি ব্যাংক') {
          if (!t.bank || !t.bank.includes('আইএফআইসি')) return false;
        } else if (t.bank !== filterBank) {
          return false;
        }
      }
      if (filterCategory !== 'all' && t.category !== filterCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = t.title.toLowerCase().includes(q);
        const matchesRef = (t.refNo || '').toLowerCase().includes(q);
        const matchesCat = (t.category || '').toLowerCase().includes(q);
        if (!matchesTitle && !matchesRef && !matchesCat) return false;
      }
      return true;
    });
  }, [transactions, filterType, filterBank, filterCategory, searchQuery]);

  // Running balance calculation for ledger display
  const ledgerWithRunningBalance = useMemo(() => {
    // Sort transactions oldest to newest to compute running balance
    const sorted = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    let currentBal = 0;
    const balanceMap = new Map<string, number>();

    sorted.forEach(t => {
      if (t.type === 'income') {
        currentBal += t.amount;
      } else {
        currentBal -= t.amount;
      }
      balanceMap.set(t.id, currentBal);
    });

    // Return filtered list maintaining its view order (newest first)
    return filteredTransactions.map(t => ({
      ...t,
      runningBalance: balanceMap.get(t.id) ?? 0
    }));
  }, [transactions, filteredTransactions]);

  const handleOpenAddModal = () => {
    if (!isAdmin && onRequireAdminLogin) {
      onRequireAdminLogin();
      return;
    }
    setNewRefNo(`VCH-${Math.floor(1000 + Math.random() * 9000)}`);
    setFormError('');
    setFormSuccess('');
    setShowAddModal(true);
  };

  const handleSubmitVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      setFormError('অনুগ্রহ করে ভাউচারের বিবরণ লিখুন।');
      return;
    }
    if (!newAmount || Number(newAmount) <= 0) {
      setFormError('সঠিক টাকার পরিমাণ ইনপুট দিন।');
      return;
    }

    onAddTransaction({
      type: newType,
      title: newTitle.trim(),
      category: newCategory,
      amount: Number(newAmount),
      date: newDate || new Date().toISOString().split('T')[0],
      bank: newBank,
      refNo: newRefNo.trim() || `VCH-${Math.floor(1000 + Math.random() * 9000)}`
    });

    setFormSuccess('ভাউচার সফলভাবে ক্যাশ বুকে যুক্ত হয়েছে!');
    setTimeout(() => {
      setShowAddModal(false);
      setNewTitle('');
      setNewAmount('');
      setFormSuccess('');
    }, 700);
  };

  return (
    <div className="space-y-6">
      {/* Financial KPI Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Total Income */}
        <div className="bg-gradient-to-br from-emerald-700 to-teal-800 text-white rounded-2xl p-5 shadow-sm space-y-2 border border-emerald-600/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-200 uppercase tracking-wider">সর্বমোট আয় (Total Income)</span>
            <div className="p-2 bg-emerald-600/40 rounded-xl">
              <TrendingUp className="w-5 h-5 text-emerald-300" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono">
            ৳{totalIncome.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-100 flex items-center justify-between pt-1 border-t border-emerald-600/50">
            <span>ছাত্র বেতন, সেশন ও অনুদান</span>
            <span className="font-semibold">{transactions.filter(t => t.type === 'income').length} টি এন্ট্রি</span>
          </div>
        </div>

        {/* Total Expense */}
        <div className="bg-gradient-to-br from-rose-700 to-red-800 text-white rounded-2xl p-5 shadow-sm space-y-2 border border-rose-600/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-200 uppercase tracking-wider">সর্বমোট ব্যয় (Total Expenses)</span>
            <div className="p-2 bg-rose-600/40 rounded-xl">
              <TrendingDown className="w-5 h-5 text-rose-300" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono">
            ৳{totalExpense.toLocaleString()}
          </div>
          <div className="text-[11px] text-rose-100 flex items-center justify-between pt-1 border-t border-rose-600/50">
            <span>বেতন, মেরামত, পরীক্ষা ও ইউটিলিটি</span>
            <span className="font-semibold">{transactions.filter(t => t.type === 'expense').length} টি ভাউচার</span>
          </div>
        </div>

        {/* Net Balance */}
        <div className="bg-gradient-to-br from-[#0c3664] to-[#124b8a] text-white rounded-2xl p-5 shadow-sm space-y-2 border border-[#1b5ba4]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">বর্তমান স্থিতি / উদ্বৃত্ত (Net Balance)</span>
            <div className="p-2 bg-[#072445] rounded-xl border border-amber-400/30">
              <Wallet className="w-5 h-5 text-amber-300" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-amber-300">
            ৳{netBalance.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-200 flex items-center justify-between pt-1 border-t border-[#1a5499]">
            <span>ব্যাংক জমা ও অফিস ক্যাশ সর্বমোট</span>
            <span className="font-semibold text-emerald-300">হিসাব হালনাগাদ</span>
          </div>
        </div>
      </div>

      {/* Account Breakdown Bar */}
      <div className="bg-white border border-[#d9e6e7] rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-[#0c3664]" />
          <span>হিসাব ও মাধ্যমভিত্তিক বর্তমান স্থিতি (Bank & Cash Breakdown)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Krishi Bank */}
          <div className="bg-[#f0f6f6] border border-[#d2e5e7] p-3.5 rounded-xl flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-[#0c3664]">বাংলাদেশ কৃষি ব্যাংক</div>
              <div className="text-[10px] text-slate-500">নাপোড়া বাজার শাখা, বাঁশখালী</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-black text-slate-900 font-mono">
                ৳{bkbBalance.toLocaleString()}
              </div>
              <div className="text-[10px] text-emerald-600 font-semibold">হিসাব ০১ (সক্রিয়)</div>
            </div>
          </div>

          {/* IFIC Bank */}
          <div className="bg-[#f0f6f6] border border-[#d2e5e7] p-3.5 rounded-xl flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-[#0c3664]">আইএফআইসি ব্যাংক পিএলসি</div>
              <div className="text-[10px] text-slate-500">নাপোড়া বাজার উপশাখা</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-black text-slate-900 font-mono">
                ৳{ificBalance.toLocaleString()}
              </div>
              <div className="text-[10px] text-emerald-600 font-semibold">হিসাব ০২ (সক্রিয়)</div>
            </div>
          </div>

          {/* Cash in hand */}
          <div className="bg-[#f0f6f6] border border-[#d2e5e7] p-3.5 rounded-xl flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-[#0c3664]">ক্যাশ ইন হ্যান্ড (অফিস)</div>
              <div className="text-[10px] text-slate-500">দৈনিক খুচরা লেনদেন ও ভাউচার</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-black text-slate-900 font-mono">
                ৳{cashBalance.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-500 font-semibold">পেটি ক্যাশ স্থিতি</div>
            </div>
          </div>
        </div>
      </div>

      {/* Control Panel: Filters, Search & Action Buttons */}
      <div className="bg-white border border-[#d9e6e7] rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-[#d9482b]" />
              <span>বিদ্যালয়ের সাধারণ ক্যাশ বুক ও লেজার বিবরণী</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              বিদ্যালয়ের প্রতিটি আয়-ব্যয়ের হিসাব, ভাউচার নম্বর, ব্যাংক ও অবশিষ্ট ব্যালেন্সের ডিজিটাল লেজার।
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => setShowPrintModal(true)}
              className="px-3.5 py-2 bg-[#0c3664] hover:bg-[#082545] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
              title="আয়-ব্যয় হিসাব স্টেটমেন্ট প্রিন্ট করুন"
            >
              <Printer className="w-4 h-4 text-amber-300" />
              <span>আয়-ব্যয় স্টেটমেন্ট প্রিন্ট</span>
            </button>

            <button
              type="button"
              onClick={handleOpenAddModal}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ নতুন ভাউচার এন্ট্রি</span>
            </button>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="বিবরণ, খাত বা ভাউচার..."
              className="w-full pl-9 pr-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900 focus:outline-none focus:border-[#0c3664]"
            />
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900 font-semibold"
            >
              <option value="all">লেনদেনের ধরন: সকল (আয় ও ব্যয়)</option>
              <option value="income">শুধু আয় (+ Income)</option>
              <option value="expense">শুধু ব্যয় (- Expense)</option>
            </select>
          </div>

          {/* Bank / Cash Filter */}
          <div>
            <select
              value={filterBank}
              onChange={(e) => setFilterBank(e.target.value)}
              className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900"
            >
              <option value="all">সকল মাধ্যম (উভয় ব্যাংক ও ক্যাশ)</option>
              <option value="বাংলাদেশ কৃষি ব্যাংক">বাংলাদেশ কৃষি ব্যাংক</option>
              <option value="আইএফআইসি ব্যাংক">আইএফআইসি ব্যাংক</option>
              <option value="Cash">ক্যাশ ইন হ্যান্ড (অফিস ক্যাশ)</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900"
            >
              <option value="all">সকল খাত (All Categories)</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white border border-[#d9e6e7] rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="font-bold text-slate-900 flex items-center gap-2">
            <span>ভাউচার তালিকা ({filteredTransactions.length} টি রেকর্ড)</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-emerald-700 font-semibold">● সবুজ = জমা/আয় (+)</span>
            <span className="text-rose-700 font-semibold">● লাল = খরচ/ব্যয় (-)</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f0f6f6] border-b border-[#d2e5e7] text-slate-700 font-semibold">
              <tr>
                <th className="py-3 px-3.5">তারিখ</th>
                <th className="py-3 px-3">ভাউচার / রেফারেন্স</th>
                <th className="py-3 px-3.5">খাত ও বিবরণ</th>
                <th className="py-3 px-3">মাধ্যম / ব্যাংক</th>
                <th className="py-3 px-3.5 text-right text-emerald-800">জমা / আয় (+)</th>
                <th className="py-3 px-3.5 text-right text-rose-800">খরচ / ব্যয় (-)</th>
                <th className="py-3 px-3.5 text-right text-[#0c3664]">উদ্বৃত্ত / স্থিতি</th>
                {isAdmin && <th className="py-3 px-2 text-center">মুছুন</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ledgerWithRunningBalance.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 8 : 7} className="py-8 text-center text-slate-400">
                    কোনো লেনদেনের তথ্য পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                ledgerWithRunningBalance.map((txn) => (
                  <tr key={txn.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3.5 whitespace-nowrap font-mono text-slate-600">
                      {txn.date}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap font-mono font-semibold text-slate-700">
                      <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] border border-slate-200">
                        {txn.refNo || txn.id}
                      </span>
                    </td>
                    <td className="py-3 px-3.5">
                      <div className="font-semibold text-slate-900">{txn.title}</div>
                      <div className="text-[10px] text-slate-500">{txn.category}</div>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                        txn.bank === 'বাংলাদেশ কৃষি ব্যাংক' ? 'bg-amber-50 text-amber-900 border border-amber-200' :
                        txn.bank === 'আইএফআইসি ব্যাংক' ? 'bg-blue-50 text-blue-900 border border-blue-200' :
                        'bg-slate-100 text-slate-800 border border-slate-300'
                      }`}>
                        {txn.bank}
                      </span>
                    </td>
                    <td className="py-3 px-3.5 text-right whitespace-nowrap font-mono font-bold text-emerald-700">
                      {txn.type === 'income' ? `+৳${txn.amount.toLocaleString()}` : '—'}
                    </td>
                    <td className="py-3 px-3.5 text-right whitespace-nowrap font-mono font-bold text-rose-700">
                      {txn.type === 'expense' ? `-৳${txn.amount.toLocaleString()}` : '—'}
                    </td>
                    <td className="py-3 px-3.5 text-right whitespace-nowrap font-mono font-black text-[#0c3664]">
                      ৳{txn.runningBalance.toLocaleString()}
                    </td>
                    {isAdmin && (
                      <td className="py-3 px-2 text-center">
                        {onDeleteTransaction && (
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`আপনি কি "${txn.title}" ভাউচারটি মুছে ফেলতে চান?`)) {
                                onDeleteTransaction(txn.id);
                              }
                            }}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors"
                            title="ভাউচার মুছুন"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
            <tfoot className="bg-[#f0f6f6] border-t-2 border-[#d2e5e7] font-bold text-xs">
              <tr>
                <td colSpan={4} className="py-3 px-3.5 text-slate-800">
                  ফিল্টারকৃত মোট যোগফল:
                </td>
                <td className="py-3 px-3.5 text-right font-mono text-emerald-700">
                  +৳{filteredTransactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0).toLocaleString()}
                </td>
                <td className="py-3 px-3.5 text-right font-mono text-rose-700">
                  -৳{filteredTransactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0).toLocaleString()}
                </td>
                <td className="py-3 px-3.5 text-right font-mono text-[#0c3664] font-black">
                  ৳{netBalance.toLocaleString()}
                </td>
                {isAdmin && <td></td>}
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Modal: Add New Voucher Entry */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 relative my-8 animate-in fade-in zoom-in-95 duration-150">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="absolute right-5 top-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl flex items-center justify-center shrink-0">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  নতুন আয়/ব্যয় ভাউচার এন্ট্রি
                </h3>
                <p className="text-xs text-slate-500">
                  বিদ্যালয়ের সাধারণ ক্যাশ বুক ও ব্যাংক লেজারে হিসাব সংরক্ষণ
                </p>
              </div>
            </div>

            {formError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{formError}</span>
              </div>
            )}

            {formSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{formSuccess}</span>
              </div>
            )}

            <form onSubmit={handleSubmitVoucher} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">লেনদেনের ধরন *</label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
                  <button
                    type="button"
                    onClick={() => {
                      setNewType('income');
                      setNewCategory('শিক্ষার্থী বেতন ও সেশন ফি');
                    }}
                    className={`py-2 rounded-lg font-bold text-xs transition-all ${
                      newType === 'income' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    + আয় (Income)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setNewType('expense');
                      setNewCategory('বেতন ও উৎসব ভাতা');
                    }}
                    className={`py-2 rounded-lg font-bold text-xs transition-all ${
                      newType === 'expense' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    - ব্যয় (Expense)
                  </button>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">ভাউচারের বিবরণ / শিরোনাম *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="যেমন: বিদ্যুৎ বিল পরিশোধ / ১০ম শ্রেণির মডেল টেস্ট প্রশ্নপত্র মুদ্রণ"
                  className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">টাকার পরিমাণ (৳) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="টাকার অংক"
                    className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">তারিখ *</label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">হিসাবের মাধ্যম / ব্যাংক *</label>
                  <select
                    value={newBank}
                    onChange={(e) => setNewBank(e.target.value as any)}
                    className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900 font-semibold"
                  >
                    <option value="বাংলাদেশ কৃষি ব্যাংক">বাংলাদেশ কৃষি ব্যাংক (নাপোড়া)</option>
                    <option value="আইএফআইসি ব্যাংক">আইএফআইসি ব্যাংক (উপশাখা)</option>
                    <option value="Cash">ক্যাশ ইন হ্যান্ড (অফিস নগদ)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">ভাউচার / রেফারেন্স নং</label>
                  <input
                    type="text"
                    value={newRefNo}
                    onChange={(e) => setNewRefNo(e.target.value)}
                    placeholder="যেমন: VCH-1092"
                    className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">খাত (Category) *</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900 font-semibold"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 text-xs"
                >
                  <Save className="w-4 h-4" />
                  <span>ভাউচার সংরক্ষণ করুন</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Printable Audit Statement */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto print:p-0 print:bg-white print:fixed print:inset-0">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-10 shadow-2xl border border-slate-300 space-y-6 relative my-8 print:border-none print:shadow-none print:m-0 print:p-4">
            {/* Header controls for screen only */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 print:hidden">
              <div className="text-xs font-bold text-slate-600">
                আয়-ব্যয় বিবরণী অডিট ও ক্যাশ বুক প্রিন্ট প্রিভিউ
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-[#0c3664] hover:bg-[#082545] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <Printer className="w-4 h-4 text-amber-300" />
                  <span>প্রিন্ট করুন</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowPrintModal(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Document Body */}
            <div className="space-y-6 text-slate-900">
              {/* Institution Header */}
              <div className="text-center border-b-2 border-[#0c3664] pb-4">
                <SchoolLogo size={56} className="mx-auto mb-2" />
                <h1 className="text-xl sm:text-2xl font-black text-[#0c3664]">
                  নাপোড়া শেখেরখীল উচ্চ বিদ্যালয়
                </h1>
                <p className="text-xs text-slate-600 mt-0.5">
                  ডাক: নাপোড়া, উপজেলা: বাঁশখালী, জেলা: চট্টগ্রাম · স্থাপিত: ১৯৬৪ ইং · ইআইআইএন: ১০৪০৬২
                </p>
                <div className="inline-block bg-[#0c3664] text-white font-bold text-xs px-4 py-1 rounded-full uppercase tracking-wide mt-2">
                  বিদ্যালয়ের সার্বিক আয়-ব্যয় অডিট হিসাব ও ক্যাশ বুক বিবরণী - ২০২৬
                </div>
              </div>

              {/* Financial Summary Box */}
              <div className="grid grid-cols-3 gap-3 text-center border border-slate-300 rounded-xl p-3 bg-slate-50">
                <div className="border-r border-slate-200">
                  <div className="text-[10px] text-slate-500 font-bold uppercase">সর্বমোট আয়</div>
                  <div className="text-base sm:text-lg font-black text-emerald-700 font-mono">৳{totalIncome.toLocaleString()}</div>
                </div>
                <div className="border-r border-slate-200">
                  <div className="text-[10px] text-slate-500 font-bold uppercase">সর্বমোট ব্যয়</div>
                  <div className="text-base sm:text-lg font-black text-rose-700 font-mono">৳{totalExpense.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase">উদ্বৃত্ত স্থিতি</div>
                  <div className="text-base sm:text-lg font-black text-[#0c3664] font-mono">৳{netBalance.toLocaleString()}</div>
                </div>
              </div>

              {/* Bank Balances */}
              <div className="text-xs text-slate-700 flex justify-between border-b border-slate-200 pb-2">
                <span><strong>বাংলাদেশ কৃষি ব্যাংক:</strong> ৳{bkbBalance.toLocaleString()}</span>
                <span><strong>আইএফআইসি ব্যাংক:</strong> ৳{ificBalance.toLocaleString()}</span>
                <span><strong>ক্যাশ ইন হ্যান্ড (অফিস):</strong> ৳{cashBalance.toLocaleString()}</span>
              </div>

              {/* Printable Table */}
              <div className="border border-slate-300 rounded-lg overflow-hidden">
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-slate-100 border-b border-slate-300 font-bold text-slate-800">
                    <tr>
                      <th className="py-2 px-2.5">তারিখ</th>
                      <th className="py-2 px-2">ভাউচার নং</th>
                      <th className="py-2 px-2.5">বিবরণ ও খাত</th>
                      <th className="py-2 px-2">মাধ্যম</th>
                      <th className="py-2 px-2.5 text-right">আয় (+)</th>
                      <th className="py-2 px-2.5 text-right">ব্যয় (-)</th>
                      <th className="py-2 px-2.5 text-right">স্থিতি</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {ledgerWithRunningBalance.map((t) => (
                      <tr key={t.id}>
                        <td className="py-1.5 px-2.5 font-mono">{t.date}</td>
                        <td className="py-1.5 px-2 font-mono font-semibold">{t.refNo || t.id}</td>
                        <td className="py-1.5 px-2.5">
                          <div className="font-semibold text-slate-900">{t.title}</div>
                          <div className="text-[10px] text-slate-500">{t.category}</div>
                        </td>
                        <td className="py-1.5 px-2 text-[10px]">{t.bank}</td>
                        <td className="py-1.5 px-2.5 text-right font-mono font-semibold text-emerald-800">
                          {t.type === 'income' ? `৳${t.amount.toLocaleString()}` : '—'}
                        </td>
                        <td className="py-1.5 px-2.5 text-right font-mono font-semibold text-rose-800">
                          {t.type === 'expense' ? `৳${t.amount.toLocaleString()}` : '—'}
                        </td>
                        <td className="py-1.5 px-2.5 text-right font-mono font-bold text-[#0c3664]">
                          ৳{t.runningBalance.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-100 font-bold border-t-2 border-slate-300">
                    <tr>
                      <td colSpan={4} className="py-2 px-2.5 text-slate-800">সর্বমোট স্থিতি:</td>
                      <td className="py-2 px-2.5 text-right text-emerald-800 font-mono">৳{totalIncome.toLocaleString()}</td>
                      <td className="py-2 px-2.5 text-right text-rose-800 font-mono">৳{totalExpense.toLocaleString()}</td>
                      <td className="py-2 px-2.5 text-right text-[#0c3664] font-mono font-black">৳{netBalance.toLocaleString()}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Official Signatures */}
              <div className="pt-10 grid grid-cols-3 gap-6 text-center text-xs text-slate-800">
                <div>
                  <div className="w-32 border-b border-slate-400 mx-auto mb-1 font-semibold">হিসাব সহকারী</div>
                  <span className="text-[11px] text-slate-500">নাপোড়া শেখেরখীল উচ্চ বিদ্যালয়</span>
                </div>
                <div>
                  <div className="w-36 border-b border-slate-400 mx-auto mb-1 font-semibold">অভ্যন্তরীণ অডিটর</div>
                  <span className="text-[11px] text-slate-500">পরিচালনা পর্ষদ মনোনীত</span>
                </div>
                <div>
                  <div className="w-40 border-b-2 border-[#0c3664] mx-auto mb-1 font-bold text-[#0c3664]">
                    মোঃ জাহাঙ্গীর আলম
                  </div>
                  <span className="text-[11px] font-bold text-[#0c3664]">প্রধান শিক্ষক ও সদস্য সচিব</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
