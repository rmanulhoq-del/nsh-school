import React, { useState, useEffect } from 'react';
import {
  Bell,
  Calendar,
  Printer,
  Share2,
  Search,
  Plus,
  Trash2,
  X,
  Pencil,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Megaphone,
  ArrowLeft
} from 'lucide-react';
import SchoolLogo from './SchoolLogo';

export interface SchoolNotice {
  id: string;
  memoNo: string;
  title: string;
  category: 'exam' | 'fee' | 'holiday' | 'circular' | 'general';
  publishDate: string;
  body: string;
  isUrgent?: boolean;
  signedBy: string;
}

export const INITIAL_NOTICES: SchoolNotice[] = [
  {
    id: 'NTC-2024-001',
    memoNo: 'না.শে.উ.বি/নোটিশ/২০২৪/০১',
    title: '২০২৪ শিক্ষাবর্ষের অর্ধবার্ষিক পরীক্ষার চূড়ান্ত সময়সূচি ও নির্দেশনাবলী',
    category: 'exam',
    publishDate: '২০২৪-১০-১০',
    isUrgent: true,
    signedBy: 'জনাব মোঃ জাহাঙ্গীর আলম, প্রধান শিক্ষক',
    body: `এতদ্বারা নাপোড়া শেখেরখীল উচ্চ বিদ্যালয়ের ৬ষ্ঠ থেকে ১০ম শ্রেণির সকল শিক্ষার্থী ও অভিভাবকদের অবগতির জন্য জানানো যাচ্ছে যে, আগামী ২৫শে অক্টোবর ২০২৪ ইং তারিখ হতে ২০২৪ শিক্ষাবর্ষের অর্ধবার্ষিক পরীক্ষা শুরু হবে।

১. সকল শিক্ষার্থীকে নির্ধারিত সময়ের ১৫ মিনিট পূর্বে পরীক্ষা কক্ষে উপস্থিত থাকতে হবে।
২. পরীক্ষার প্রবেশপত্র (Admit Card) অফিস কক্ষ হতে আগামী ২০শে অক্টোবরের মধ্যে সংগ্রহ করতে হবে।
৩. যে সকল শিক্ষার্থীর চলতি মাসের টিউশন ফি ও পরীক্ষা ফি বকেয়া রয়েছে, তাদেরকে অবিলম্বে বাংলাদেশ কৃষি ব্যাংক অথবা আইএফআইসি ব্যাংক নাপোড়া শাখায় ফি পরিশোধ করে রসিদ প্রদর্শনের অনুরোধ করা হলো।`
  },
  {
    id: 'NTC-2024-002',
    memoNo: 'না.শে.উ.বি/হিসাব/২০২৪/০৪',
    title: 'ডিজিটাল ব্যাংক চালান ও কাউন্টারে শিক্ষার্থী ফি জমাদানের নিয়মাবলী',
    category: 'fee',
    publishDate: '২০২৪-১০-০৫',
    isUrgent: false,
    signedBy: 'হিসাব শাখা ও প্রধান শিক্ষক',
    body: `সকল সম্মানিত অভিভাবক ও শিক্ষার্থীদের জ্ঞাতার্থে জানানো যাচ্ছে যে, বিদ্যালয়ের যাবতীয় আর্থিক লেনদেন শতভাগ স্বচ্ছ ও নিরাপদ রাখতে এখন থেকে নগদ ক্যাশ লেনদেনের পরিবর্তে নির্ধারিত ব্যাংকের মাধ্যমে ফি গ্রহণ করা হচ্ছে।

ফি জমাদানের ব্যাংক শাখাসমূহ:
ক) বাংলাদেশ কৃষি ব্যাংক, নাপোড়া বাজার শাখা, বাঁশখালী (হিসাব নং: ০২০০০০১২৩৪৫৬৭)
খ) আইএফআইসি ব্যাংক পিএলসি, নাপোড়া বাজার উপশাখা, বাঁশখালী (হিসাব নং: ১০৫০১২৩৪৫৬৭৮)

ব্যাংক কাউন্টারে শিক্ষার্থীর নাম, শ্রেণি, শাখা ও রোল উল্লেখ করে চালান জমা দিন। জমা দেওয়ার পর অনলাইন পোর্টালের এআই স্ক্যানারে অথবা অফিস সহকারী কাম কম্পিউটার অপারেটরের নিকট রসিদ দাখিল করে ১-ক্লিকে নিশ্চিতকরণ গ্রহণ করুন।`
  },
  {
    id: 'NTC-2024-003',
    memoNo: 'না.শে.উ.বি/প্রশাসন/২০২৪/০৯',
    title: '৬ষ্ঠ থেকে ১০ম শ্রেণির শিক্ষার্থীদের ইউনিক আইডি ও ডিজিটাল ডেটাবেস হালনাগাদ',
    category: 'circular',
    publishDate: '২০২৪-০৯-২৮',
    isUrgent: false,
    signedBy: 'জনাব মোঃ জাহাঙ্গীর আলম, প্রধান শিক্ষক',
    body: `মাধ্যমিক ও উচ্চশিক্ষা অধিদপ্তর (DSHE) এবং শিক্ষা মন্ত্রণালয়ের নির্দেশনায় সকল শিক্ষার্থীর ইউনিক আইডি ও প্রোফাইল ডাটাবেস হালনাগাদ কার্যক্রম চলমান রয়েছে।

যে সকল শিক্ষার্থী এখনও ডিজিটাল জন্মনিবন্ধন ও পিতা-মাতার জাতীয় পরিচয়পত্রের কপি জমা দেয়নি, তাদেরকে আগামী ১৫ই অক্টোবরের মধ্যে শ্রেণি শিক্ষকের নিকট প্রয়োজনীয় কাগজপত্র জমা দেওয়ার জন্য নির্দেশ দেওয়া হলো।`
  },
  {
    id: 'NTC-2024-004',
    memoNo: 'না.শে.উ.বি/ছুটি/২০২৪/০২',
    title: 'আসন্ন দুর্গাপূজা, ফাতেহা-ই-ইয়াজদাহম ও প্রবারণা পূর্ণিমা উপলক্ষে বিদ্যালয় বন্ধের বিজ্ঞপ্তি',
    category: 'holiday',
    publishDate: '২০২৪-০৯-২০',
    isUrgent: false,
    signedBy: 'জনাব মোঃ জাহাঙ্গীর আলম, প্রধান শিক্ষক',
    body: `বিদ্যালয়ের সকল শিক্ষক, কর্মচারী ও ছাত্র-ছাত্রীদের জানানো যাচ্ছে যে, সরকারি ছুটির তালিকা অনুযায়ী আসন্ন দুর্গাপূজা, ফাতেহা-ই-ইয়াজদাহম ও প্রবারণা পূর্ণিমা উপলক্ষে আগামী ০৯ই অক্টোবর হতে ১৪ই অক্টোবর ২০২৪ পর্যন্ত বিদ্যালয়ের শ্রেণি কার্যক্রম বন্ধ থাকবে। ১৫ই অক্টোবর রোজ মঙ্গলবার যথারীতি সকাল ৯:০০ টায় ক্লাস শুরু হবে।`
  },
  {
    id: 'NTC-2024-005',
    memoNo: 'না.শে.উ.বি/অভিভাবক/২০২৪/০৩',
    title: 'মা ও অভিভাবক সমাবেশ এবং শিক্ষার্থী অগ্রগতি পর্যালোচনা সভা',
    category: 'general',
    publishDate: '২০২৪-০৯-১২',
    isUrgent: false,
    signedBy: 'জনাব মোঃ জাহাঙ্গীর আলম, প্রধান শিক্ষক',
    body: `সম্মানিত অভিভাবকবৃন্দের সদয় অবগতির জন্য জানানো যাচ্ছে যে, শিক্ষার্থীদের পড়াশোনার মানোন্নয়ন, বিদ্যালয়ে নিয়মিত উপস্থিতি এবং ডিজিটাল ফি ব্যবস্থাপনা পর্যালোচনার নিমিত্তে আগামী ১৮ই অক্টোবর শুক্রবার সকাল ১০:০০ ঘটিকায় বিদ্যালয় মিলনায়তনে এক অভিভাবক সমাবেশ আহ্বান করা হয়েছে। উক্ত সভায় সকল অভিভাবকের উপস্থিতি একান্তভাবে কাম্য।`
  }
];

interface NoticeBoardTabProps {
  isAdmin: boolean;
  onPrint?: () => void;
}

export default function NoticeBoardTab({ isAdmin, onPrint }: NoticeBoardTabProps) {
  const [notices, setNotices] = useState<SchoolNotice[]>(() => {
    try {
      const saved = localStorage.getItem('school_digital_notices');
      return saved ? JSON.parse(saved) : INITIAL_NOTICES;
    } catch {
      return INITIAL_NOTICES;
    }
  });

  // Emergency Alert Custom State
  const [emergencyAlert, setEmergencyAlert] = useState<{
    headline: string;
    detail: string;
    type: 'urgent' | 'special' | 'general';
    date: string;
    isActive: boolean;
  }>(() => {
    try {
      const saved = localStorage.getItem('school_emergency_alert');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      headline: '২০২৪ শিক্ষাবর্ষের অর্ধবার্ষিক পরীক্ষার চূড়ান্ত রুটিন ও ব্যাংক ফি জমাদানের শেষ তারিখ ২০ অক্টোবর ২০২৬',
      detail: 'সকল শিক্ষার্থীকে কৃষি ব্যাংক বা আইএফআইসি ব্যাংক নাপোড়া শাখায় সময়মতো ফি পরিশোধ করে প্রবেশপত্র সংগ্রহ করার নির্দেশ দেওয়া যাচ্ছে।',
      type: 'urgent',
      date: new Date().toLocaleDateString('bn-BD'),
      isActive: true
    };
  });

  const [showEmergencyEditModal, setShowEmergencyEditModal] = useState(false);
  const [tempEmergencyHeadline, setTempEmergencyHeadline] = useState(emergencyAlert.headline);
  const [tempEmergencyDetail, setTempEmergencyDetail] = useState(emergencyAlert.detail);
  const [tempEmergencyType, setTempEmergencyType] = useState(emergencyAlert.type);
  const [tempEmergencyActive, setTempEmergencyActive] = useState(emergencyAlert.isActive);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeNoticeForPrint, setActiveNoticeForPrint] = useState<SchoolNotice | null>(null);
  const [showAddNoticeModal, setShowAddNoticeModal] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // New Notice Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<SchoolNotice['category']>('general');
  const [newBody, setNewBody] = useState('');
  const [newIsUrgent, setNewIsUrgent] = useState(false);

  const categories = [
    { id: 'all', label: 'সকল নোটিশ' },
    { id: 'exam', label: 'পরীক্ষা ও ফলাফল' },
    { id: 'fee', label: 'ভর্তি ও ফি সংক্রান্ত' },
    { id: 'holiday', label: 'ছুটি ও দিবস' },
    { id: 'circular', label: 'সরকারি পরিপত্র' },
    { id: 'general', label: 'সাধারণ নোটিশ' }
  ];

  const showFeedback = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowEmergencyEditModal(false);
        setActiveNoticeForPrint(null);
        setShowAddNoticeModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredNotices = notices.filter(n => {
    const matchesCategory = selectedCategory === 'all' || n.category === selectedCategory;
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.memoNo.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Save Emergency Alert
  const handleSaveEmergencyAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempEmergencyHeadline.trim()) return;

    const updated = {
      headline: tempEmergencyHeadline.trim(),
      detail: tempEmergencyDetail.trim(),
      type: tempEmergencyType,
      date: new Date().toLocaleDateString('bn-BD'),
      isActive: tempEmergencyActive
    };

    setEmergencyAlert(updated);
    try {
      localStorage.setItem('school_emergency_alert', JSON.stringify(updated));
    } catch {}

    setShowEmergencyEditModal(false);
    showFeedback('জরুরি বার্তা সফলভাবে হালনাগাদ ও লাইভ প্রচার করা হয়েছে!');
  };

  // Quick Preset Selector for Emergency Alert
  const applyEmergencyPreset = (headline: string, detail: string, type: 'urgent' | 'special' | 'general') => {
    setTempEmergencyHeadline(headline);
    setTempEmergencyDetail(detail);
    setTempEmergencyType(type);
    setTempEmergencyActive(true);
  };

  // Handle Add Notice
  const handleAddNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newBody.trim()) return;

    const newNotice: SchoolNotice = {
      id: `NTC-2024-${Date.now().toString().slice(-4)}`,
      memoNo: `না.শে.উ.বি/নোটিশ/২০২৪/${notices.length + 1}`,
      title: newTitle.trim(),
      category: newCategory,
      publishDate: new Date().toISOString().split('T')[0],
      isUrgent: newIsUrgent,
      signedBy: 'জনাব মোঃ জাহাঙ্গীর আলম, প্রধান শিক্ষক',
      body: newBody.trim()
    };

    const updated = [newNotice, ...notices];
    setNotices(updated);
    try {
      localStorage.setItem('school_digital_notices', JSON.stringify(updated));
    } catch {}

    // If marked urgent, update emergency alert ticker as well
    if (newIsUrgent) {
      const emergencyData = {
        headline: newNotice.title,
        detail: newNotice.body.slice(0, 180) + '...',
        type: 'urgent' as const,
        date: new Date().toLocaleDateString('bn-BD'),
        isActive: true
      };
      setEmergencyAlert(emergencyData);
      try {
        localStorage.setItem('school_emergency_alert', JSON.stringify(emergencyData));
      } catch {}
    }

    setNewTitle('');
    setNewBody('');
    setNewIsUrgent(false);
    setShowAddNoticeModal(false);
    showFeedback(`নতুন নোটিশ "${newNotice.title}" সফলভাবে প্রকাশ করা হয়েছে।`);
  };

  // Handle Delete Notice
  const handleDeleteNotice = (id: string, title: string) => {
    if (confirm(`আপনি কি নিশ্চিত যে "${title}" নোটিশটি ডিলিট করতে চান?`)) {
      const updated = notices.filter(n => n.id !== id);
      setNotices(updated);
      try {
        localStorage.setItem('school_digital_notices', JSON.stringify(updated));
      } catch {}
      showFeedback(`"${title}" নোটিশটি ডিলিট করা হয়েছে।`);
    }
  };

  // WhatsApp Share Notice
  const handleShareWhatsApp = (notice: SchoolNotice) => {
    const shareText = `*${notice.title}*\n${notice.memoNo} | তারিখ: ${notice.publishDate}\nনাপোড়া শেখেরখীল উচ্চ বিদ্যালয়\n\n${notice.body}\n\n— প্রধান শিক্ষক, নাপোড়া শেখেরখীল উচ্চ বিদ্যালয়`;
    const waUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* ========================================================= */}
      {/* 1. INTERACTIVE LIVE EMERGENCY ALERT & UPDATE TICKER */}
      {/* ========================================================= */}
      {emergencyAlert.isActive && (
        <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 p-3.5 md:p-4 rounded-2xl shadow-sm border border-amber-600/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-3">
            <div className="flex items-center gap-1.5 shrink-0 bg-slate-950 text-amber-300 px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider shadow-xs">
              <Megaphone className="w-4 h-4 animate-bounce text-amber-400" />
              <span>
                {emergencyAlert.type === 'urgent' ? '🚨 জরুরি বার্তা' : emergencyAlert.type === 'special' ? '⚠️ বিশেষ ঘোষণা' : '📢 জরুরি নোটিশ'}
              </span>
            </div>
            <div>
              <div className="font-extrabold text-xs md:text-sm text-slate-950 leading-snug">
                {emergencyAlert.headline}
              </div>
              {emergencyAlert.detail && (
                <div className="text-[11px] text-slate-900/80 font-medium line-clamp-1 mt-0.5">
                  {emergencyAlert.detail}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
            <span className="text-[10px] bg-slate-950/10 px-2 py-0.5 rounded font-mono text-slate-900 font-semibold">
              তারিখ: {emergencyAlert.date}
            </span>

            {/* ADMIN EMERGENCY MESSAGE UPDATE BUTTON */}
            {isAdmin && (
              <button
                type="button"
                onClick={() => {
                  setTempEmergencyHeadline(emergencyAlert.headline);
                  setTempEmergencyDetail(emergencyAlert.detail);
                  setTempEmergencyType(emergencyAlert.type);
                  setTempEmergencyActive(emergencyAlert.isActive);
                  setShowEmergencyEditModal(true);
                }}
                className="px-3 py-1 bg-slate-950 hover:bg-slate-900 text-amber-300 hover:text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                title="জরুরি বার্তা মেসেজ এডিট ও আপডেট করুন"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>মেসেজ আপডেট করুন</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Notice Banner */}
      <div className="bg-white border border-[#d9e6e7] rounded-3xl p-6 md:p-8 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 bg-[#d9482b]/10 text-[#d9482b] px-3 py-1 rounded-full text-xs font-bold">
              <Bell className="w-3.5 h-3.5" />
              <span>ডিজিটাল নোটিশ বোর্ড ও সার্কুলার</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              বিদ্যালয় নোটিশ বোর্ড ও জরুরি বার্তা
            </h1>
            <p className="text-xs md:text-sm text-slate-600">
              নাপোড়া শেখেরখীল উচ্চ বিদ্যালয়ের সকল অফিসিয়াল নোটিশ, পরীক্ষার রুটিন, ফি সংক্রান্ত বিজ্ঞপ্তি ও ছুটির তালিকা।
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => {
                if (onPrint) onPrint();
                else window.print();
              }}
              className="px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-2 shadow-2xs transition-colors"
            >
              <Printer className="w-4 h-4 text-[#0c3664]" />
              <span>নোটিশ তালিকা প্রিন্ট</span>
            </button>

            {isAdmin && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setTempEmergencyHeadline(emergencyAlert.headline);
                    setTempEmergencyDetail(emergencyAlert.detail);
                    setTempEmergencyType(emergencyAlert.type);
                    setTempEmergencyActive(emergencyAlert.isActive);
                    setShowEmergencyEditModal(true);
                  }}
                  className="px-3.5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>জরুরি বার্তা পরিবর্তন</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowAddNoticeModal(true)}
                  className="px-4 py-2.5 bg-[#d9482b] hover:bg-[#b8381e] text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>নতুন নোটিশ প্রকাশ</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Action feedback */}
        {feedbackMsg && (
          <div className="p-3 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-xl text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{feedbackMsg}</span>
          </div>
        )}

        {/* Filter Pills & Search */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-3 border-t border-slate-100">
          <div className="flex flex-wrap gap-2 text-xs">
            {categories.map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-[#0c3664] text-white shadow-xs font-bold'
                    : 'bg-[#f0f6f6] hover:bg-slate-100 text-slate-700 border border-[#d2e5e7]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative w-full lg:w-72 shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="নোটিশের শিরোনাম বা বিষয় দিয়ে খুঁজুন..."
              className="w-full pl-9 pr-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-xs focus:outline-none focus:border-[#0c3664] text-slate-800"
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

      {/* Notices List */}
      <div className="space-y-4">
        {filteredNotices.length > 0 ? (
          filteredNotices.map(notice => {
            const isExam = notice.category === 'exam';
            const isFee = notice.category === 'fee';
            const isHoliday = notice.category === 'holiday';

            return (
              <div
                key={notice.id}
                className={`bg-white rounded-3xl p-6 border shadow-xs transition-all space-y-4 ${
                  notice.isUrgent
                    ? 'border-amber-400/80 bg-amber-50/20'
                    : 'border-[#d9e6e7] hover:border-[#0c3664]'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          isExam
                            ? 'bg-blue-100 text-[#0c3664] border border-blue-200'
                            : isFee
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : isHoliday
                            ? 'bg-rose-100 text-[#d9482b] border border-rose-200'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {notice.category === 'exam' && 'পরীক্ষা ও ফলাফল'}
                        {notice.category === 'fee' && 'ভর্তি ও ফি সংক্রান্ত'}
                        {notice.category === 'holiday' && 'ছুটি ও দিবস'}
                        {notice.category === 'circular' && 'সরকারি পরিপত্র'}
                        {notice.category === 'general' && 'সাধারণ নোটিশ'}
                      </span>

                      {notice.isUrgent && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-slate-950">
                          জরুরি নোটিশ
                        </span>
                      )}

                      <span className="text-[11px] text-slate-400 font-mono">
                        স্মারক: {notice.memoNo}
                      </span>
                    </div>

                    <h3 className="text-base md:text-lg font-bold text-slate-900 leading-snug">
                      {notice.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono shrink-0">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{notice.publishDate}</span>
                  </div>
                </div>

                <div className="p-4 bg-[#f8fafc] border border-slate-200/80 rounded-2xl text-xs md:text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                  {notice.body}
                </div>

                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="text-slate-500 italic text-[11px]">
                    স্বাক্ষরিত: <strong className="text-slate-700">{notice.signedBy}</strong>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveNoticeForPrint(notice)}
                      className="px-3.5 py-1.5 bg-[#0c3664] hover:bg-[#092b50] text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
                    >
                      <Printer className="w-3.5 h-3.5 text-amber-300" />
                      <span>অফিসিয়াল কপি প্রিন্ট</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleShareWhatsApp(notice)}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>WhatsApp শেয়ার</span>
                    </button>

                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => handleDeleteNotice(notice.id, notice.title)}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                        title="নোটিশ মুছে ফেলুন"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white p-12 rounded-3xl border border-[#d9e6e7] text-center space-y-3">
            <Bell className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-700">কোনো নোটিশ পাওয়া যায়নি</h3>
            <p className="text-xs text-slate-500">আপনার অনুসন্ধানের সাথে মিলে এমন কোনো নোটিশ এই মুহূর্তে নেই।</p>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* MODAL 1: জরুরি বার্তা আপডেট ও প্রচার (EMERGENCY MESSAGE MODAL) */}
      {/* ========================================================= */}
      {showEmergencyEditModal && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowEmergencyEditModal(false);
          }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 md:p-8 shadow-2xl border border-slate-200 space-y-5 relative my-8 animate-in fade-in zoom-in-95 duration-150">
            {/* Top Back & Close Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <button
                type="button"
                onClick={() => setShowEmergencyEditModal(false)}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors border border-slate-200"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-slate-600" />
                <span>← ব্যাকে যান (Back)</span>
              </button>

              <button
                type="button"
                onClick={() => setShowEmergencyEditModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-1 text-xs"
                title="উইন্ডো বন্ধ করুন"
              >
                <X className="w-4 h-4" />
                <span>বন্ধ (Close)</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-amber-100 text-amber-800 rounded-2xl flex items-center justify-center shrink-0">
                <Megaphone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">জরুরি বার্তা আপডেট ও প্রচার</h3>
                <p className="text-xs text-slate-500">
                  ওয়েবসাইটের শীর্ষে ও নোটিশ বোর্ডে তাৎক্ষণিক জরুরি বার্তা হালনাগাদ করুন
                </p>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-2 text-xs">
              <div className="font-bold text-amber-900 flex items-center gap-1.5 text-[11px]">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>দ্রুত জরুরি বার্তা টেমপ্লেট নির্বাচন করুন:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => applyEmergencyPreset(
                    'অর্ধবার্ষিক পরীক্ষার রুটিন ও ব্যাংক ফি জমাদানের শেষ তারিখ ২০ অক্টোবর ২০২৬',
                    'কৃষি ব্যাংক বা আইএফআইসি ব্যাংক নাপোড়া শাখায় সময়মতো ফি পরিশোধ করে প্রবেশপত্র সংগ্রহ করুন।',
                    'urgent'
                  )}
                  className="px-2.5 py-1 bg-white hover:bg-amber-100 border border-amber-300 rounded-lg text-[11px] font-semibold text-slate-800 transition-colors"
                >
                  📝 পরীক্ষা ও ব্যাংক ফি
                </button>
                <button
                  type="button"
                  onClick={() => applyEmergencyPreset(
                    'দুর্যোগপূর্ণ উপকূলীয় আবহাওয়ার কারণে বিদ্যালয়ের শ্রেণি কার্যক্রম সাময়িক বন্ধ',
                    'সকল শিক্ষার্থী ও অভিভাবকদের নিরাপদে থাকার পরামর্শ দেওয়া হচ্ছে। পরবর্তী নোটিশ না দেওয়া পর্যন্ত ক্লাস স্থগিত।',
                    'urgent'
                  )}
                  className="px-2.5 py-1 bg-white hover:bg-amber-100 border border-amber-300 rounded-lg text-[11px] font-semibold text-slate-800 transition-colors"
                >
                  ⛈️ বৈরী আবহাওয়া ও ছুটি
                </button>
                <button
                  type="button"
                  onClick={() => applyEmergencyPreset(
                    'বার্ষিক অভিভাবক ও মা সমাবেশ আগামী ১৮ই অক্টোবর সকাল ১০:০০ টায়',
                    'বিদ্যালয়ের প্রাঙ্গণে সকল অভিভাবকের সশরীরে উপস্থিতি একান্তভাবে কাম্য।',
                    'special'
                  )}
                  className="px-2.5 py-1 bg-white hover:bg-amber-100 border border-amber-300 rounded-lg text-[11px] font-semibold text-slate-800 transition-colors"
                >
                  👨‍👩‍👧 অভিভাবক সমাবেশ
                </button>
                <button
                  type="button"
                  onClick={() => applyEmergencyPreset(
                    '৬ষ্ঠ থেকে ১০ম শ্রেণির ডিজিটাল আইডি কার্ড ও কিউআর স্লিপ বিতরণ চলছে',
                    'শ্রেণি শিক্ষকের কাছ থেকে নিজ নিজ আইডি কার্ড ও স্লিপ সংগ্রহ করুন।',
                    'general'
                  )}
                  className="px-2.5 py-1 bg-white hover:bg-amber-100 border border-amber-300 rounded-lg text-[11px] font-semibold text-slate-800 transition-colors"
                >
                  🪪 ডিজিটাল আইডি কার্ড
                </button>
              </div>
            </div>

            <form onSubmit={handleSaveEmergencyAlert} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">জরুরি বার্তার শিরোনাম *</label>
                <input
                  type="text"
                  required
                  value={tempEmergencyHeadline}
                  onChange={(e) => setTempEmergencyHeadline(e.target.value)}
                  placeholder="যেমন: পরীক্ষার রুটিন ও ব্যাংক ফি জমাদানের শেষ তারিখ প্রসঙ্গে"
                  className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900 font-bold focus:outline-none focus:border-[#0c3664]"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">বিস্তারিত বিবরণ (এক লাইন বা সংক্ষিপ্ত বার্তা):</label>
                <textarea
                  rows={2}
                  value={tempEmergencyDetail}
                  onChange={(e) => setTempEmergencyDetail(e.target.value)}
                  placeholder="যেমন: বাংলাদেশ কৃষি ব্যাংক অথবা আইএফআইসি ব্যাংকে আগামী ২০ তারিখের মধ্যে ফি জমা দিতে হবে..."
                  className="w-full p-2.5 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900 focus:outline-none focus:border-[#0c3664]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">বার্তার গুরুত্ব / টাইপ:</label>
                  <select
                    value={tempEmergencyType}
                    onChange={(e) => setTempEmergencyType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900 font-medium"
                  >
                    <option value="urgent">🚨 অতি জরুরি (Red Urgent)</option>
                    <option value="special">⚠️ বিশেষ ঘোষণা (Special Notice)</option>
                    <option value="general">📢 সাধারণ জরুরি নোটিশ (Notice)</option>
                  </select>
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={tempEmergencyActive}
                      onChange={(e) => setTempEmergencyActive(e.target.checked)}
                      className="w-4 h-4 text-[#d9482b] rounded"
                    />
                    <span className="font-bold text-slate-800">সাইটে সক্রিয় রাখুন (Live Active)</span>
                  </label>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEmergencyEditModal(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#0c3664] hover:bg-[#092b50] text-white font-bold rounded-xl shadow-xs flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>জরুরি বার্তা লাইভ আপডেট করুন</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: PRINT OFFICIAL NOTICE MEMO */}
      {activeNoticeForPrint && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveNoticeForPrint(null);
          }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto print:p-0 print:bg-white print:static"
        >
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl border border-slate-200 space-y-6 relative my-8 print:border-none print:shadow-none print:m-0 print:p-6 print:rounded-none">
            {/* Top Back & Print Control Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 print:hidden">
              <button
                type="button"
                onClick={() => setActiveNoticeForPrint(null)}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors border border-slate-200"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-slate-600" />
                <span>← ব্যাকে যান (Back)</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-1.5 bg-[#0c3664] hover:bg-[#092b50] text-white font-bold rounded-xl text-xs flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5 text-amber-300" />
                  <span>প্রিন্ট করুন</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveNoticeForPrint(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-1 text-xs"
                  title="উইন্ডো বন্ধ করুন"
                >
                  <X className="w-4 h-4" />
                  <span>বন্ধ</span>
                </button>
              </div>
            </div>

            <div className="border-2 border-[#0c3664] rounded-2xl p-6 md:p-8 space-y-6 bg-white text-slate-800">
              <div className="text-center space-y-1.5 pb-4 border-b-2 border-slate-300">
                <div className="flex items-center justify-center gap-3">
                  <SchoolLogo size={52} />
                  <div>
                    <h1 className="text-2xl font-extrabold text-[#0c3664]">
                      নাপোড়া শেখেরখীল উচ্চ বিদ্যালয়
                    </h1>
                    <p className="text-xs text-slate-600">
                      ডাকঘর: নাপোড়া, উপজেলা: বাঁশখালী, জেলা: চট্টগ্রাম · ইআইআইএন: ১০৪০৬২
                    </p>
                    <p className="text-[11px] text-amber-800 italic font-semibold">
                      "পড় স্রষ্টার নামে" · স্থাপিত : ১৯৬৪ ইং
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <span className="inline-block bg-[#0c3664] text-white text-xs font-bold px-4 py-1 rounded-full uppercase">
                    অফিসিয়াল নোটিশ ও বিজ্ঞপ্তি
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs font-mono text-slate-700">
                <div>স্মারক নম্বর: <strong>{activeNoticeForPrint.memoNo}</strong></div>
                <div>প্রকাশের তারিখ: <strong>{activeNoticeForPrint.publishDate}</strong></div>
              </div>

              <div className="space-y-2">
                <h2 className="text-base font-bold text-slate-900 pb-1 border-b border-slate-200">
                  বিষয়: {activeNoticeForPrint.title}
                </h2>
                <div className="text-xs md:text-sm text-slate-800 whitespace-pre-line leading-relaxed pt-2">
                  {activeNoticeForPrint.body}
                </div>
              </div>

              <div className="pt-10 flex items-end justify-between text-xs text-slate-700">
                <div>
                  <span className="text-[10px] text-slate-400 block font-mono">
                    নাপোড়া শেখেরখীল উচ্চ বিদ্যালয় ডিজিটাল রেকর্ড
                  </span>
                </div>

                <div className="text-center space-y-1">
                  <div className="w-40 border-b border-slate-400 mx-auto"></div>
                  <div className="font-bold text-slate-900">জনাব মোঃ জাহাঙ্গীর আলম</div>
                  <div className="text-[10px] text-slate-600">প্রধান শিক্ষক ও সদস্য সচিব</div>
                  <div className="text-[10px] text-slate-500">নাপোড়া শেখেরখীল উচ্চ বিদ্যালয়</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: ADD NEW NOTICE */}
      {showAddNoticeModal && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowAddNoticeModal(false);
          }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 md:p-8 shadow-2xl border border-slate-200 space-y-5 relative my-8 animate-in fade-in zoom-in-95 duration-150">
            {/* Top Back & Close Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <button
                type="button"
                onClick={() => setShowAddNoticeModal(false)}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors border border-slate-200"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-slate-600" />
                <span>← ব্যাকে যান (Back)</span>
              </button>

              <button
                type="button"
                onClick={() => setShowAddNoticeModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-1 text-xs"
                title="উইন্ডো বন্ধ করুন"
              >
                <X className="w-4 h-4" />
                <span>বন্ধ (Close)</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-rose-50 text-[#d9482b] rounded-2xl flex items-center justify-center shrink-0">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">নতুন নোটিশ প্রকাশ ফরম</h3>
                <p className="text-xs text-slate-500">শিক্ষার্থী ও অভিভাবকদের জন্য বিজ্ঞপ্তি প্রকাশ করুন</p>
              </div>
            </div>

            <form onSubmit={handleAddNotice} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">নোটিশের শিরোনাম *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="যেমন: ২০২৪ শিক্ষাবর্ষের অর্ধবার্ষিক পরীক্ষার রুটিন প্রকাশ"
                  className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">নোটিশের ক্যাটাগরি *</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900"
                  >
                    <option value="exam">পরীক্ষা ও ফলাফল</option>
                    <option value="fee">ভর্তি ও ফি সংক্রান্ত</option>
                    <option value="holiday">ছুটি ও দিবস</option>
                    <option value="circular">সরকারি পরিপত্র</option>
                    <option value="general">সাধারণ নোটিশ</option>
                  </select>
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newIsUrgent}
                      onChange={(e) => setNewIsUrgent(e.target.checked)}
                      className="w-4 h-4 text-[#d9482b] rounded"
                    />
                    <span className="font-bold text-amber-700">জরুরি নোটিশ হিসেবে চিহ্নিত করুন</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">নোটিশের বিস্তারিত বক্তব্য *</label>
                <textarea
                  rows={5}
                  required
                  value={newBody}
                  onChange={(e) => setNewBody(e.target.value)}
                  placeholder="নোটিশের পূর্ণাঙ্গ বিবরণ ও নির্দেশনাবলী এখানে লিখুন..."
                  className="w-full p-3 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900 leading-relaxed"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddNoticeModal(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#d9482b] hover:bg-[#b8381e] text-white font-bold rounded-xl"
                >
                  নোটিশ প্রকাশ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
