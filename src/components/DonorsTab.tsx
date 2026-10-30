import React, { useState, useEffect } from 'react';
import {
  HeartHandshake,
  Award,
  Plus,
  Pencil,
  Trash2,
  Printer,
  Search,
  X,
  CheckCircle2,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { DonorFounder } from '../types';
import { INITIAL_DONORS } from './CommitteeAndDonorsTab';

interface DonorsTabProps {
  isAdmin: boolean;
  onPrint?: () => void;
}

export default function DonorsTab({ isAdmin, onPrint }: DonorsTabProps) {
  const [donorsList, setDonorsList] = useState<DonorFounder[]>(() => {
    try {
      const saved = localStorage.getItem('school_donors_founders');
      return saved ? JSON.parse(saved) : INITIAL_DONORS;
    } catch {
      return INITIAL_DONORS;
    }
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // Add Donor Modal
  const [showAddDonorModal, setShowAddDonorModal] = useState(false);
  const [newDonorName, setNewDonorName] = useState('');
  const [newDonorType, setNewDonorType] = useState<DonorFounder['type']>('life_donor');
  const [newDonorContribution, setNewDonorContribution] = useState('');
  const [newDonorAmount, setNewDonorAmount] = useState('');
  const [newDonorYear, setNewDonorYear] = useState('২০২৪ ইং');
  const [newDonorTitle, setNewDonorTitle] = useState('সম্মানিত আজীবন দাতা');
  const [newDonorDesc, setNewDonorDesc] = useState('');
  const [newDonorQuote, setNewDonorQuote] = useState('');

  // Edit Donor Modal
  const [showEditDonorModal, setShowEditDonorModal] = useState(false);
  const [editingDonorId, setEditingDonorId] = useState('');
  const [editDonorName, setEditDonorName] = useState('');
  const [editDonorType, setEditDonorType] = useState<DonorFounder['type']>('life_donor');
  const [editDonorContribution, setEditDonorContribution] = useState('');
  const [editDonorAmount, setEditDonorAmount] = useState('');
  const [editDonorYear, setEditDonorYear] = useState('');
  const [editDonorTitle, setEditDonorTitle] = useState('');
  const [editDonorDesc, setEditDonorDesc] = useState('');
  const [editDonorQuote, setEditDonorQuote] = useState('');

  const showFeedback = (msg: string) => {
    setActionFeedback(msg);
    setTimeout(() => setActionFeedback(null), 4000);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowAddDonorModal(false);
        setShowEditDonorModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handlePrint = () => {
    if (onPrint) onPrint();
    else window.print();
  };

  // Add Donor
  const handleAddDonor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDonorName.trim()) return;

    const newDonor: DonorFounder = {
      id: `DNR-${Date.now().toString().slice(-4)}`,
      name: newDonorName.trim(),
      type: newDonorType,
      contributionType: newDonorContribution.trim() || 'আর্থিক অনুদান ও পৃষ্ঠপোষকতা',
      amountOrLand: newDonorAmount.trim() || 'অনুদান',
      year: newDonorYear.trim() || '২০২৪ ইং',
      title: newDonorTitle.trim() || 'সম্মানিত দাতা সদস্য',
      description: newDonorDesc.trim() || 'বিদ্যালয়ের সার্বিক শিক্ষা উন্নয়ন ও অবকাঠামো সম্প্রসারণে আন্তরিক সহায়তা।',
      tributeQuote: newDonorQuote.trim() || undefined
    };

    const updated = [newDonor, ...donorsList];
    setDonorsList(updated);
    try {
      localStorage.setItem('school_donors_founders', JSON.stringify(updated));
    } catch {}

    setNewDonorName('');
    setNewDonorContribution('');
    setNewDonorAmount('');
    setNewDonorDesc('');
    setNewDonorQuote('');
    setShowAddDonorModal(false);
    showFeedback(`দাতা/পৃষ্ঠপোষক "${newDonor.name}" সফলভাবে যুক্ত হয়েছেন।`);
  };

  // Open Edit Modal
  const handleOpenEdit = (donor: DonorFounder) => {
    setEditingDonorId(donor.id);
    setEditDonorName(donor.name);
    setEditDonorType(donor.type);
    setEditDonorContribution(donor.contributionType);
    setEditDonorAmount(donor.amountOrLand);
    setEditDonorYear(donor.year);
    setEditDonorTitle(donor.title);
    setEditDonorDesc(donor.description);
    setEditDonorQuote(donor.tributeQuote || '');
    setShowEditDonorModal(true);
  };

  // Save Edit
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editDonorName.trim()) return;

    const updated = donorsList.map(d => {
      if (d.id === editingDonorId) {
        return {
          ...d,
          name: editDonorName.trim(),
          type: editDonorType,
          contributionType: editDonorContribution.trim(),
          amountOrLand: editDonorAmount.trim(),
          year: editDonorYear.trim(),
          title: editDonorTitle.trim(),
          description: editDonorDesc.trim(),
          tributeQuote: editDonorQuote.trim() || undefined
        };
      }
      return d;
    });

    setDonorsList(updated);
    try {
      localStorage.setItem('school_donors_founders', JSON.stringify(updated));
    } catch {}

    setShowEditDonorModal(false);
    showFeedback(`দাতা "${editDonorName}"-এর তথ্য সফলভাবে আপডেট হয়েছে।`);
  };

  // Delete Donor
  const handleDeleteDonor = (id: string, name: string) => {
    if (confirm(`আপনি কি নিশ্চিত যে "${name}"-কে দাতা ও প্রতিষ্ঠাতা তালিকা থেকে অপসারণ করতে চান?`)) {
      const updated = donorsList.filter(d => d.id !== id);
      setDonorsList(updated);
      try {
        localStorage.setItem('school_donors_founders', JSON.stringify(updated));
      } catch {}
      showFeedback(`"${name}" দাতা তালিকা থেকে অপসারিত হয়েছেন।`);
    }
  };

  const filteredDonors = donorsList.filter(d =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.contributionType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.amountOrLand.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-[#d9e6e7] rounded-3xl p-6 md:p-8 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 bg-[#d9482b]/10 text-[#d9482b] px-3 py-1 rounded-full text-xs font-bold">
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>প্রতিষ্ঠাতা ও আজীবন দাতা ফোরাম</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              প্রতিষ্ঠাতা ও আজীবন দাতা সদস্যবৃন্দ (Founders & Donors)
            </h1>
            <p className="text-xs md:text-sm text-slate-600 max-w-2xl">
              ১৯৬৪ সালে নাপোড়া ও শেখেরখীলের যেসব মহান শিক্ষানুরাগী জমিদান, অর্থ ও ত্যাগের মাধ্যমে এই বিদ্যাপীঠ গড়ে তুলেছেন এবং পরবর্তীতে অবকাঠামোগত উন্নয়ন করেছেন তাঁদের চিরস্মরণীয় তালিকা।
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-2 shadow-2xs transition-colors"
            >
              <Printer className="w-4 h-4 text-[#0c3664]" />
              <span>দাতা তালিকা প্রিন্ট</span>
            </button>

            {isAdmin && (
              <button
                type="button"
                onClick={() => setShowAddDonorModal(true)}
                className="px-4 py-2.5 bg-[#d9482b] hover:bg-[#b8381e] text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>+ নতুন দাতা / প্রতিষ্ঠাতা যোগ করুন</span>
              </button>
            )}
          </div>
        </div>

        {/* Feedback Alert */}
        {actionFeedback && (
          <div className="p-3 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-xl text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionFeedback}</span>
          </div>
        )}

        {/* Tribute Callout */}
        <div className="p-5 bg-amber-50/80 border border-amber-300/80 rounded-2xl text-amber-950 space-y-2">
          <div className="flex items-center gap-2 text-sm font-bold text-amber-900">
            <Award className="w-5 h-5 text-amber-700" />
            <span>শ্রদ্ধা ও কৃতজ্ঞতা স্মরণ: ১৯৬৪ থেকে নিরবচ্ছিন্ন কল্যাণ</span>
          </div>
          <p className="text-xs text-amber-900/80 leading-relaxed">
            নাপোড়া শেখেরখীল উচ্চ বিদ্যালয় যাদের নিঃস্বার্থ জমিদান, আর্থিক সহায়তা ও ত্যাগের উপর প্রতিষ্ঠিত—বিদ্যালয় কর্তৃপক্ষ ও বাঁশখালীবাসী তাঁদের অবদান চিরকাল শ্রদ্ধার সাথে স্মরণ রাখবে।
          </p>
        </div>

        {/* Search & Stats */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-[#d9482b] bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-200">
              মোট দাতা ও প্রতিষ্ঠাতা: {donorsList.length} জন
            </span>
            {isAdmin && (
              <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-md text-[11px]">
                ● এডমিন এডিট ও ডিলিট সক্রিয়
              </span>
            )}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="দাতার নাম বা অবদানের খাত খুঁজুন..."
              className="w-full pl-9 pr-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-xs focus:outline-none focus:border-[#0c3664]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Donors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDonors.map(donor => {
          const isFounder = donor.type === 'founder' || donor.type === 'land_donor';
          return (
            <div
              key={donor.id}
              className={`rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4 border transition-all ${
                isFounder
                  ? 'bg-gradient-to-b from-white to-amber-50/30 border-amber-300'
                  : 'bg-white border-[#d9e6e7] hover:border-[#d9482b]'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        isFounder
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-rose-50 text-[#d9482b] border border-rose-200'
                      }`}
                    >
                      {donor.title}
                    </span>
                    <h4 className="text-base font-bold text-slate-900 mt-1.5">
                      {donor.name}
                    </h4>
                    <div className="text-xs font-semibold text-slate-700 mt-0.5">
                      {donor.contributionType}
                    </div>
                  </div>
                  <span className="font-mono text-[11px] font-bold bg-[#f0f6f6] px-2 py-0.5 rounded text-slate-600 shrink-0">
                    {donor.year}
                  </span>
                </div>

                <div className="p-3 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-xs space-y-1">
                  <div className="text-slate-500 text-[11px]">অনুদানের পরিমাণ / জমি:</div>
                  <div className="font-bold text-slate-900 text-xs">
                    {donor.amountOrLand}
                  </div>
                  <p className="text-slate-600 leading-relaxed pt-1 text-[11px]">
                    {donor.description}
                  </p>
                </div>

                {donor.tributeQuote && (
                  <div className="text-xs text-amber-800 italic bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                    "{donor.tributeQuote}"
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span className="font-mono text-[11px]">{donor.id}</span>

                {isAdmin && (
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(donor)}
                      className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                      title="তথ্য এডিট করুন"
                    >
                      <Pencil className="w-3 h-3 text-amber-700" />
                      <span>এডিট</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteDonor(donor.id, donor.name)}
                      className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="দাতা বাদ দিন"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ADD DONOR MODAL */}
      {showAddDonorModal && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowAddDonorModal(false);
          }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-slate-200 space-y-5 relative my-8 animate-in fade-in zoom-in-95 duration-150">
            {/* Top Back & Close Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <button
                type="button"
                onClick={() => setShowAddDonorModal(false)}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors border border-slate-200"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-slate-600" />
                <span>← ব্যাকে যান (Back)</span>
              </button>

              <button
                type="button"
                onClick={() => setShowAddDonorModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-1 text-xs"
                title="উইন্ডো বন্ধ করুন"
              >
                <X className="w-4 h-4" />
                <span>বন্ধ (Close)</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-50 text-amber-700 rounded-2xl flex items-center justify-center shrink-0">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">নতুন দাতা / প্রতিষ্ঠাতা অন্তর্ভুক্তি</h3>
                <p className="text-xs text-slate-500">নাপোড়া শেখেরখীল উচ্চ বিদ্যালয় দাতা ফোরাম</p>
              </div>
            </div>

            <form onSubmit={handleAddDonor} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">দাতার পূর্ণ নাম *</label>
                <input
                  type="text"
                  required
                  value={newDonorName}
                  onChange={(e) => setNewDonorName(e.target.value)}
                  placeholder="যেমন: হাজী মোঃ কামাল উদ্দিন"
                  className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">অবদানের ধরন:</label>
                  <select
                    value={newDonorType}
                    onChange={(e) => setNewDonorType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900"
                  >
                    <option value="life_donor">আজীবন দাতা</option>
                    <option value="land_donor">ভূমিদাতা</option>
                    <option value="lab_infrastructure">ল্যাব ও অবকাঠামো দাতা</option>
                    <option value="scholarship">বৃত্তি ও কল্যাণ তহবিল</option>
                    <option value="founder">প্রতিষ্ঠাতা সদস্য</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">অবদানের বছর/সাল:</label>
                  <input
                    type="text"
                    value={newDonorYear}
                    onChange={(e) => setNewDonorYear(e.target.value)}
                    placeholder="যেমন: ২০২৪ ইং"
                    className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">সম্মানসূচক উপাধি / পদবি:</label>
                <input
                  type="text"
                  value={newDonorTitle}
                  onChange={(e) => setNewDonorTitle(e.target.value)}
                  placeholder="যেমন: প্রতিষ্ঠাতা প্রধান ভূমিদাতা / আজীবন দাতা"
                  className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">অনুদানের খাত/শিরোনাম:</label>
                <input
                  type="text"
                  value={newDonorContribution}
                  onChange={(e) => setNewDonorContribution(e.target.value)}
                  placeholder="যেমন: বিজ্ঞানাগার আধুনিকায়ন ও ছাত্রকল্যাণ তহবিল"
                  className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">অনুদানের পরিমাণ বা জমি:</label>
                <input
                  type="text"
                  value={newDonorAmount}
                  onChange={(e) => setNewDonorAmount(e.target.value)}
                  placeholder="যেমন: নগদ ২,০০,০০০ টাকা / ২০ শতক জমি"
                  className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">সংক্ষিপ্ত বিবরণ:</label>
                <textarea
                  rows={2}
                  value={newDonorDesc}
                  onChange={(e) => setNewDonorDesc(e.target.value)}
                  placeholder="বিদ্যালয়ের উন্নতিতে তাঁর অনন্য অবদানের সংক্ষিপ্ত ইতিহাস..."
                  className="w-full p-2.5 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">কৃতজ্ঞতা বাণী / উক্তি (ঐচ্ছিক):</label>
                <input
                  type="text"
                  value={newDonorQuote}
                  onChange={(e) => setNewDonorQuote(e.target.value)}
                  placeholder="যেমন: তাঁর নিঃস্বার্থ দানেই আজ স্কুলের এই রূপ..."
                  className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900 italic"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddDonorModal(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#d9482b] hover:bg-[#b8381e] text-white font-bold rounded-xl"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT DONOR MODAL */}
      {showEditDonorModal && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowEditDonorModal(false);
          }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-slate-200 space-y-5 relative my-8 animate-in fade-in zoom-in-95 duration-150">
            {/* Top Back & Close Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <button
                type="button"
                onClick={() => setShowEditDonorModal(false)}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors border border-slate-200"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-slate-600" />
                <span>← ব্যাকে যান (Back)</span>
              </button>

              <button
                type="button"
                onClick={() => setShowEditDonorModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-1 text-xs"
                title="উইন্ডো বন্ধ করুন"
              >
                <X className="w-4 h-4" />
                <span>বন্ধ (Close)</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-50 text-amber-700 rounded-2xl flex items-center justify-center shrink-0">
                <Pencil className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">দাতা / প্রতিষ্ঠাতা তথ্য সম্পাদনা ও আপডেট</h3>
                <p className="text-xs text-slate-500 font-mono">{editingDonorId}</p>
              </div>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">দাতার পূর্ণ নাম *</label>
                <input
                  type="text"
                  required
                  value={editDonorName}
                  onChange={(e) => setEditDonorName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">অবদানের ধরন:</label>
                  <select
                    value={editDonorType}
                    onChange={(e) => setEditDonorType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900"
                  >
                    <option value="life_donor">আজীবন দাতা</option>
                    <option value="land_donor">ভূমিদাতা</option>
                    <option value="lab_infrastructure">ল্যাব ও অবকাঠামো দাতা</option>
                    <option value="scholarship">বৃত্তি ও কল্যাণ তহবিল</option>
                    <option value="founder">প্রতিষ্ঠাতা সদস্য</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">অবদানের বছর/সাল:</label>
                  <input
                    type="text"
                    value={editDonorYear}
                    onChange={(e) => setEditDonorYear(e.target.value)}
                    className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">সম্মানসূচক উপাধি / পদবি:</label>
                <input
                  type="text"
                  value={editDonorTitle}
                  onChange={(e) => setEditDonorTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">অনুদানের খাত/শিরোনাম:</label>
                <input
                  type="text"
                  value={editDonorContribution}
                  onChange={(e) => setEditDonorContribution(e.target.value)}
                  className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">অনুদানের পরিমাণ বা জমি:</label>
                <input
                  type="text"
                  value={editDonorAmount}
                  onChange={(e) => setEditDonorAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">সংক্ষিপ্ত বিবরণ:</label>
                <textarea
                  rows={2}
                  value={editDonorDesc}
                  onChange={(e) => setEditDonorDesc(e.target.value)}
                  className="w-full p-2.5 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">কৃতজ্ঞতা বাণী / উক্তি:</label>
                <input
                  type="text"
                  value={editDonorQuote}
                  onChange={(e) => setEditDonorQuote(e.target.value)}
                  className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900 italic"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEditDonorModal(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#d9482b] hover:bg-[#b8381e] text-white font-bold rounded-xl"
                >
                  আপডেট সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
