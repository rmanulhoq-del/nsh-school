import React, { useState, useEffect } from 'react';
import {
  Bell,
  ChevronRight,
  Edit3,
  Plus,
  Trash2,
  X,
  Check,
  Megaphone,
  Settings,
  Sparkles,
  Gauge,
  SlidersHorizontal,
  CheckCircle2,
  Lock,
  ShieldCheck
} from 'lucide-react';
import { SchoolNotice, INITIAL_NOTICES } from './NoticeBoardTab';

export interface UrgentNoticeItem {
  id: string;
  title: string;
  detail?: string;
  date?: string;
  isActive: boolean;
}

interface UrgentNoticeBarProps {
  isAdmin?: boolean;
  onRequireAdminLogin?: () => void;
  onNavigateToNotices: (noticeId?: string) => void;
  language?: 'bn' | 'en';
}

const DEFAULT_URGENT_NOTICES: UrgentNoticeItem[] = [
  {
    id: 'urg-1',
    title: '২০২৪ শিক্ষাবর্ষের অর্ধবার্ষিক পরীক্ষার চূড়ান্ত সময়সূচি ঘোষণা ও প্রবেশপত্র সংগ্রহ সংক্রান্ত বিজ্ঞপ্তি',
    detail: 'সকল শিক্ষার্থীকে নির্ধারিত তারিখের মধ্যে অফিস হতে প্রবেশপত্র সংগ্রহ করতে অনুরোধ করা যাচ্ছে।',
    date: '১০ অক্টোবর ২০২৪',
    isActive: true
  },
  {
    id: 'urg-2',
    title: 'বাংলাদেশ কৃষি ব্যাংক ও আইএফআইসি ব্যাংক নাপোড়া বাজার শাখায় শিক্ষার্থী ফি জমাদানের নির্দেশনাবলী',
    detail: 'নগদ লেনদেনের পরিবর্তে নির্ধারিত ব্যাংকের মাধ্যমে ফি জমা প্রদান করুন।',
    date: '০৮ অক্টোবর ২০২৪',
    isActive: true
  },
  {
    id: 'urg-3',
    title: 'বিদ্যালয়ের বার্ষিক ক্রীড়া, সাংস্কৃতিক প্রতিযোগিতা ও বিজ্ঞান মেলার রেজিস্ট্রেশন শুরু হয়েছে',
    detail: 'আগ্রহী শিক্ষার্থীদের শ্রেণি শিক্ষকের নিকট নাম লিপিবদ্ধ করার জন্য বলা হলো।',
    date: '০৫ অক্টোবর ২০২৪',
    isActive: true
  }
];

export default function UrgentNoticeBar({
  isAdmin = false,
  onRequireAdminLogin,
  onNavigateToNotices,
  language = 'bn'
}: UrgentNoticeBarProps) {
  // Urgent Notices List State (persisted in localStorage)
  const [urgentList, setUrgentList] = useState<UrgentNoticeItem[]>(() => {
    try {
      const saved = localStorage.getItem('school_urgent_notices_list');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return DEFAULT_URGENT_NOTICES;
  });

  // Ticker speed state: 'slow' (38s), 'veryslow' (50s), 'normal' (25s)
  const [tickerSpeed, setTickerSpeed] = useState<'veryslow' | 'slow' | 'normal'>(() => {
    try {
      const saved = localStorage.getItem('school_ticker_speed');
      if (saved === 'veryslow' || saved === 'slow' || saved === 'normal') return saved;
    } catch {}
    return 'slow';
  });

  // Modal State for Adding / Editing Urgent Notices
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formDetail, setFormDetail] = useState('');
  const [formIsActive, setFormIsActive] = useState(true);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  // Sync with localStorage
  useEffect(() => {
    const handleStorage = () => {
      try {
        const saved = localStorage.getItem('school_urgent_notices_list');
        if (saved) setUrgentList(JSON.parse(saved));
        const savedSpeed = localStorage.getItem('school_ticker_speed');
        if (savedSpeed === 'veryslow' || savedSpeed === 'slow' || savedSpeed === 'normal') {
          setTickerSpeed(savedSpeed);
        }
      } catch {}
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const saveListToStorage = (updated: UrgentNoticeItem[]) => {
    setUrgentList(updated);
    try {
      localStorage.setItem('school_urgent_notices_list', JSON.stringify(updated));
      window.dispatchEvent(new Event('storage'));
    } catch {}
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormTitle('');
    setFormDetail('');
    setFormIsActive(true);
    setIsManageModalOpen(true);
  };

  const handleOpenEdit = (item: UrgentNoticeItem) => {
    setEditingId(item.id);
    setFormTitle(item.title);
    setFormDetail(item.detail || '');
    setFormIsActive(item.isActive);
    setIsManageModalOpen(true);
  };

  const handleDeleteItem = (id: string) => {
    if (!isAdmin) {
      if (onRequireAdminLogin) onRequireAdminLogin();
      else alert('শুধুমাত্র পাসওয়ার্ডধারী অনুমোদিত এডমিন নোটিশ মুছে ফেলতে পারবেন।');
      return;
    }
    if (confirm('আপনি কি এই জরুরি নোটিশটি মুছে ফেলতে চান?')) {
      const updated = urgentList.filter(item => item.id !== id);
      saveListToStorage(updated);
      setFeedbackMsg('নোটিশ সফলভাবে মুছে ফেলা হয়েছে।');
      setTimeout(() => setFeedbackMsg(''), 2500);
    }
  };

  const handleToggleActive = (id: string) => {
    if (!isAdmin) {
      if (onRequireAdminLogin) onRequireAdminLogin();
      else alert('শুধুমাত্র পাসওয়ার্ডধারী অনুমোদিত এডমিন নোটিশ অন/অফ করতে পারবেন।');
      return;
    }
    const updated = urgentList.map(item =>
      item.id === id ? { ...item, isActive: !item.isActive } : item
    );
    saveListToStorage(updated);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      if (onRequireAdminLogin) onRequireAdminLogin();
      else alert('শুধুমাত্র পাসওয়ার্ডধারী অনুমোদিত এডমিন নোটিশ সংরক্ষণ করতে পারবেন।');
      return;
    }
    if (!formTitle.trim()) return;

    if (editingId) {
      // Edit existing
      const updated = urgentList.map(item =>
        item.id === editingId
          ? {
              ...item,
              title: formTitle.trim(),
              detail: formDetail.trim() || undefined,
              isActive: formIsActive
            }
          : item
      );
      saveListToStorage(updated);
      setFeedbackMsg('নোটিশ সফলভাবে আপডেট করা হয়েছে!');
    } else {
      // Add new
      const newItem: UrgentNoticeItem = {
        id: `urg-${Date.now()}`,
        title: formTitle.trim(),
        detail: formDetail.trim() || undefined,
        date: new Date().toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US'),
        isActive: formIsActive
      };
      saveListToStorage([newItem, ...urgentList]);
      setFeedbackMsg('নতুন জরুরি নোটিশ সফলভাবে যুক্ত হয়েছে!');
    }

    setEditingId(null);
    setFormTitle('');
    setFormDetail('');
    setTimeout(() => setFeedbackMsg(''), 2500);
  };

  const handleSpeedChange = (speed: 'veryslow' | 'slow' | 'normal') => {
    setTickerSpeed(speed);
    try {
      localStorage.setItem('school_ticker_speed', speed);
    } catch {}
  };

  // Speed in CSS seconds
  const speedSeconds = tickerSpeed === 'veryslow' ? '50s' : tickerSpeed === 'slow' ? '35s' : '22s';

  // Active notices to show in ticker
  const activeItems = urgentList.filter(item => item.isActive);

  if (activeItems.length === 0 && !isAdmin) {
    return null;
  }

  return (
    <>
      {/* Ticker Bar Container */}
      <div className="w-full bg-white border-y border-red-200/90 shadow-2xs relative z-30 transition-all select-none ticker-container">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 py-1.5 flex items-center justify-between gap-2 overflow-hidden">
          
          {/* Left: Distinctive Red Badge + Manage Buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => onNavigateToNotices()}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white shadow-xs text-xs font-black tracking-wide cursor-pointer transition-transform active:scale-95"
              title="সকল জরুরি নোটিশ দেখতে ক্লিক করুন"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              <span>{language === 'bn' ? 'জরুরি নোটিশ' : 'URGENT NOTICE'}</span>
            </button>

            {/* Direct Add & Edit Button Right on the Bar - STRICTLY ADMIN PROTECTED */}
            {isAdmin ? (
              <button
                type="button"
                onClick={() => setIsManageModalOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 transition-all shadow-2xs cursor-pointer active:scale-95"
                title="অনুমোদিত এডমিন: নোটিশ যোগ, পরিবর্তন বা এডিট করুন"
              >
                <Edit3 className="w-3.5 h-3.5 text-amber-800" />
                <span className="hidden sm:inline">নোটিশ এডিট (এডমিন)</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  if (onRequireAdminLogin) {
                    onRequireAdminLogin();
                  } else {
                    alert('শুধুমাত্র পাসওয়ার্ডধারী অনুমোদিত এডমিন নোটিশ এডিট করতে পারবেন।');
                  }
                }}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-all shadow-2xs cursor-pointer active:scale-95"
                title="শুধুমাত্র পাসওয়ার্ডধারী অনুমোদিত এডমিন নোটিশ এডিট করতে পারবেন"
              >
                <Lock className="w-3 h-3 text-slate-500" />
                <span className="hidden sm:inline">এডিট (এডমিন)</span>
              </button>
            )}
          </div>

          {/* Center: Live Continuous Slow-Motion Scrolling Marquee Ticker */}
          <div
            className="flex-1 min-w-0 overflow-hidden relative cursor-pointer mx-1"
            style={{ maskImage: 'linear-gradient(to right, transparent, black 15px, black 95%, transparent)' }}
            onClick={() => onNavigateToNotices()}
            title="নোটিশের বিস্তারিত দেখতে এখানে ক্লিক করুন (মাউস রাখলে স্ক্রল থামবে)"
          >
            {activeItems.length > 0 ? (
              <div
                className="animate-ticker-slow"
                style={{ '--ticker-duration': speedSeconds } as React.CSSProperties}
              >
                {/* 1st copy of items */}
                <div className="flex items-center gap-8 shrink-0 pr-8">
                  {activeItems.map((item, idx) => (
                    <span
                      key={`orig-${item.id}-${idx}`}
                      className="inline-flex items-center gap-2 text-red-700 hover:text-red-950 font-bold text-xs sm:text-[13px] tracking-wide transition-colors"
                    >
                      <span className="text-red-500 font-black text-sm">✦</span>
                      <span>{item.title}</span>
                    </span>
                  ))}
                </div>

                {/* 2nd copy for seamless infinite loop */}
                <div className="flex items-center gap-8 shrink-0 pr-8" aria-hidden="true">
                  {activeItems.map((item, idx) => (
                    <span
                      key={`copy-${item.id}-${idx}`}
                      className="inline-flex items-center gap-2 text-red-700 hover:text-red-950 font-bold text-xs sm:text-[13px] tracking-wide transition-colors"
                    >
                      <span className="text-red-500 font-black text-sm">✦</span>
                      <span>{item.title}</span>
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-400 italic">
                কোনো জরুরি নোটিশ দৃশ্যমান নেই। নতুন নোটিশ যুক্ত করতে ডানপাশের বাটনে ক্লিক করুন।
              </div>
            )}
          </div>

          {/* Right: Quick Speed & View All Actions */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => onNavigateToNotices()}
              className="flex items-center gap-1 text-xs font-extrabold text-red-600 hover:text-red-800 hover:underline px-2 py-1 rounded transition-colors whitespace-nowrap"
            >
              <span className="hidden md:inline">{language === 'bn' ? 'সব নোটিশ' : 'All Notices'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* COMPREHENSIVE ADD / EDIT & SPEED MANAGEMENT MODAL */}
      {isManageModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-red-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-red-600 to-rose-700 text-white px-5 py-4 flex items-center justify-between border-b-2 border-red-800">
              <div className="flex items-center gap-2.5">
                <Megaphone className="w-5 h-5 text-amber-200" />
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg leading-tight">
                    জরুরি নোটিশ বার পরিচালনা ও গতি নির্ধারণ
                  </h3>
                  <p className="text-[11px] text-red-100">
                    এখানে নতুন জরুরি নোটিশ যোগ, এডিট, ডিলিট এবং স্লো-মোশন গতি নিয়ন্ত্রণ করা যায়
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsManageModalOpen(false);
                  setEditingId(null);
                }}
                className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content Body */}
            <div className="p-5 overflow-y-auto space-y-5">
              
              {feedbackMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{feedbackMsg}</span>
                </div>
              )}

              {/* Ticker Speed Controller */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                    <Gauge className="w-4 h-4 text-red-600" />
                    <span>নোটিশ চলার গতি (Scrolling Speed):</span>
                  </span>
                  <span className="text-[11px] text-slate-500">বর্তমান: {tickerSpeed === 'veryslow' ? 'খুব ধীর (Super Slow)' : tickerSpeed === 'slow' ? 'ধীর ও সাবলীল (Slow Motion)' : 'স্বাভাবিক (Normal)'}</span>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleSpeedChange('veryslow')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold transition-all border ${
                      tickerSpeed === 'veryslow'
                        ? 'bg-red-600 text-white border-red-700 shadow-xs'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-300'
                    }`}
                  >
                    🐢 খুব ধীর (৫০ সে.)
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSpeedChange('slow')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold transition-all border ${
                      tickerSpeed === 'slow'
                        ? 'bg-red-600 text-white border-red-700 shadow-xs'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-300'
                    }`}
                  >
                    🚶 স্লো মোশন (৩৫ সে. - ডিফল্ট)
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSpeedChange('normal')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold transition-all border ${
                      tickerSpeed === 'normal'
                        ? 'bg-red-600 text-white border-red-700 shadow-xs'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-300'
                    }`}
                  >
                    🏃 স্বাভাবিক (২২ সে.)
                  </button>
                </div>
              </div>

              {/* Add / Edit Form */}
              <form onSubmit={handleSaveForm} className="bg-red-50/50 border border-red-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-red-100 pb-2">
                  <span className="text-xs font-extrabold text-red-900 flex items-center gap-1.5">
                    {editingId ? <Edit3 className="w-4 h-4 text-red-600" /> : <Plus className="w-4 h-4 text-red-600" />}
                    <span>{editingId ? 'নোটিশটি সম্পাদন করুন (Edit Notice)' : 'নতুন জরুরি নোটিশ যোগ করুন (Add New Urgent Notice)'}</span>
                  </span>

                  {editingId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(null);
                        setFormTitle('');
                        setFormDetail('');
                      }}
                      className="text-[11px] text-slate-500 hover:text-slate-800 underline"
                    >
                      নতুন নোটিশ যোগে ফিরুন
                    </button>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    নোটিশের প্রধান শিরোনাম (যা স্লো মোশনে স্ক্রল হবে) <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={e => setFormTitle(e.target.value)}
                    placeholder="যেমন: আগামী ২৫ অক্টোবর হতে অর্ধবার্ষিক পরীক্ষা শুরু হবে। প্রবেশপত্র অফিস হতে সংগ্রহ করুন।"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:ring-2 focus:ring-red-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    সংক্ষিপ্ত বিস্তারিত বিবরণ (ঐচ্ছিক)
                  </label>
                  <textarea
                    rows={2}
                    value={formDetail}
                    onChange={e => setFormDetail(e.target.value)}
                    placeholder="নোটিশের অতিরিক্ত বিস্তারিত বা নিয়মাবলী..."
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-red-500 focus:outline-hidden"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="activeCheck"
                      checked={formIsActive}
                      onChange={e => setFormIsActive(e.target.checked)}
                      className="w-4 h-4 text-red-600 rounded border-slate-300 focus:ring-red-500"
                    />
                    <label htmlFor="activeCheck" className="text-xs font-bold text-slate-800 cursor-pointer">
                      এই নোটিশটি বর্তমানে স্ক্রলে সচল রাখুন
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-lg shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>{editingId ? 'আপডেট সংরক্ষণ' : 'নোটিশ যোগ করুন'}</span>
                  </button>
                </div>
              </form>

              {/* Active Notices List with Actions */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-extrabold text-slate-800 pb-1 border-b border-slate-200">
                  <span>বর্তমানে সংরক্ষিত জরুরি নোটিশ তালিকা ({urgentList.length} টি)</span>
                  <span className="text-[11px] text-slate-500">সক্রিয়: {activeItems.length} টি</span>
                </div>

                <div className="divide-y divide-slate-100 max-h-56 overflow-y-auto border border-slate-200 rounded-xl">
                  {urgentList.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-400">
                      কোনো জরুরি নোটিশ সংরক্ষিত নেই।
                    </div>
                  ) : (
                    urgentList.map((item, idx) => (
                      <div
                        key={item.id}
                        className={`p-3 flex items-start justify-between gap-3 text-xs transition-colors ${
                          item.isActive ? 'bg-white hover:bg-slate-50' : 'bg-slate-50/70 text-slate-400'
                        }`}
                      >
                        <div className="space-y-1 flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono text-slate-400">#{idx + 1}</span>
                            <span className={`font-bold truncate ${item.isActive ? 'text-slate-900' : 'text-slate-400 line-through'}`}>
                              {item.title}
                            </span>
                            <span
                              className={`text-[9px] px-1.5 py-0.2 rounded font-extrabold ${
                                item.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                              }`}
                            >
                              {item.isActive ? 'সক্রিয়' : 'বন্ধ'}
                            </span>
                          </div>
                          {item.detail && (
                            <p className="text-[11px] text-slate-500 line-clamp-1">{item.detail}</p>
                          )}
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleToggleActive(item.id)}
                            className={`px-2 py-1 rounded text-[10px] font-bold transition-colors ${
                              item.isActive ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700'
                            }`}
                            title={item.isActive ? 'বন্ধ করুন' : 'চালু করুন'}
                          >
                            {item.isActive ? 'বন্ধ করুন' : 'চালু করুন'}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenEdit(item)}
                            className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                            title="এডিট করুন"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteItem(item.id)}
                            className="p-1 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded"
                            title="মুছে ফেলুন"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-500">মাউস স্ক্রলের ওপর নিলে স্বয়ংক্রিয়ভাবে থেমে যাবে।</span>
              <button
                type="button"
                onClick={() => setIsManageModalOpen(false)}
                className="px-5 py-2 bg-[#0c3664] hover:bg-[#144275] text-white font-bold rounded-xl transition-colors shadow-xs"
              >
                সম্পন্ন (Done)
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
