import React, { useState, useEffect } from 'react';
import { Bell, ChevronRight, Edit3, X, Check, Megaphone, AlertCircle, ArrowUpRight } from 'lucide-react';
import { SchoolNotice, INITIAL_NOTICES } from './NoticeBoardTab';

interface UrgentNoticeBarProps {
  isAdmin?: boolean;
  onNavigateToNotices: (noticeId?: string) => void;
  language?: 'bn' | 'en';
}

export default function UrgentNoticeBar({
  isAdmin = false,
  onNavigateToNotices,
  language = 'bn'
}: UrgentNoticeBarProps) {
  // Load emergency alert state
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
      headline: '২০২৪ শিক্ষাবর্ষের অর্ধবার্ষিক পরীক্ষার চূড়ান্ত সময়সূচি ঘোষণা ও ব্যাংক ফি জমাদানের নির্দেশনাবলী',
      detail: 'সকল শিক্ষার্থীকে কৃষি ব্যাংক বা আইএফআইসি ব্যাংক নাপোড়া শাখায় সময়মতো ফি পরিশোধ করে প্রবেশপত্র সংগ্রহ করার নির্দেশ দেওয়া যাচ্ছে।',
      type: 'urgent',
      date: '১০ অক্টোবর ২০২৪',
      isActive: true
    };
  });

  // Load notices list to pull any additional marked urgent notices
  const [urgentItems, setUrgentItems] = useState<Array<{ id?: string; title: string; isUrgent?: boolean }>>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editHeadline, setEditHeadline] = useState(emergencyAlert.headline);
  const [editDetail, setEditDetail] = useState(emergencyAlert.detail);
  const [editIsActive, setEditIsActive] = useState(emergencyAlert.isActive);

  // Refresh items from localStorage whenever modal closes or storage changes
  const refreshItems = () => {
    try {
      const alertSaved = localStorage.getItem('school_emergency_alert');
      const parsedAlert = alertSaved ? JSON.parse(alertSaved) : emergencyAlert;
      setEmergencyAlert(parsedAlert);

      const savedNotices = localStorage.getItem('school_digital_notices');
      const notices: SchoolNotice[] = savedNotices ? JSON.parse(savedNotices) : INITIAL_NOTICES;
      
      const list: Array<{ id?: string; title: string; isUrgent?: boolean }> = [];
      
      if (parsedAlert && parsedAlert.isActive && parsedAlert.headline) {
        list.push({ title: parsedAlert.headline, isUrgent: true });
      }

      notices
        .filter(n => n.isUrgent)
        .forEach(n => {
          if (!list.some(item => item.title === n.title)) {
            list.push({ id: n.id, title: n.title, isUrgent: true });
          }
        });

      if (list.length === 0) {
        // Fallback default urgent notice
        list.push({
          title: '২০২৪ শিক্ষাবর্ষের অর্ধবার্ষিক পরীক্ষার চূড়ান্ত সময়সূচি ঘোষণা ও ব্যাংক ফি জমাদানের নির্দেশনাবলী',
          isUrgent: true
        });
      }

      setUrgentItems(list);
    } catch {
      setUrgentItems([
        {
          title: '২০২৪ শিক্ষাবর্ষের অর্ধবার্ষিক পরীক্ষার চূড়ান্ত সময়সূচি ঘোষণা ও ব্যাংক ফি জমাদানের নির্দেশনাবলী',
          isUrgent: true
        }
      ]);
    }
  };

  useEffect(() => {
    refreshItems();
    const handleStorage = () => refreshItems();
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Auto rotate items every 6 seconds if not hovered
  useEffect(() => {
    if (urgentItems.length <= 1 || isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % urgentItems.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [urgentItems.length, isPaused]);

  const handleSaveAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editHeadline.trim()) return;

    const updated = {
      ...emergencyAlert,
      headline: editHeadline.trim(),
      detail: editDetail.trim(),
      isActive: editIsActive,
      date: new Date().toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US')
    };

    setEmergencyAlert(updated);
    try {
      localStorage.setItem('school_emergency_alert', JSON.stringify(updated));
      window.dispatchEvent(new Event('storage'));
    } catch {}

    refreshItems();
    setIsEditModalOpen(false);
  };

  if (!emergencyAlert.isActive && urgentItems.length === 0) {
    return null;
  }

  const currentItem = urgentItems[currentIndex] || urgentItems[0] || {
    title: emergencyAlert.headline,
    isUrgent: true
  };

  return (
    <>
      <div
        className="w-full bg-white border-y border-red-200 shadow-xs relative z-30 transition-all select-none"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 flex items-center justify-between gap-2.5 sm:gap-4 overflow-hidden">
          {/* Left: Distinctive Red Pill Badge */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onNavigateToNotices(currentItem.id)}
              className="group flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1 sm:py-1.2 rounded-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white shadow-xs text-xs sm:text-sm font-extrabold tracking-wide cursor-pointer transition-transform active:scale-95"
              title="সকল জরুরি নোটিশ দেখতে ক্লিক করুন"
            >
              <span className="relative flex h-2 sm:h-2.5 w-2 sm:w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 sm:h-2.5 w-2 sm:w-2.5 bg-white"></span>
              </span>
              <span>{language === 'bn' ? 'জরুরি নোটিশ' : 'URGENT NOTICE'}</span>
            </button>

            {isAdmin && (
              <button
                type="button"
                onClick={() => {
                  setEditHeadline(emergencyAlert.headline);
                  setEditDetail(emergencyAlert.detail);
                  setEditIsActive(emergencyAlert.isActive);
                  setIsEditModalOpen(true);
                }}
                className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold text-rose-700 hover:text-white bg-rose-50 hover:bg-rose-600 border border-rose-300 transition-colors"
                title="জরুরি নোটিশ লেখা পরিবর্তন বা এডিট করুন"
              >
                <Edit3 className="w-3 h-3" />
                <span>এডিট</span>
              </button>
            )}
          </div>

          {/* Center: Live Scrolling Ticker / Headline */}
          <div className="flex-1 min-w-0 overflow-hidden relative cursor-pointer" onClick={() => onNavigateToNotices(currentItem.id)}>
            <div className="flex items-center gap-3">
              <span className="text-red-600 font-extrabold hidden md:inline text-xs sm:text-sm shrink-0">
                ●
              </span>
              <p
                className="text-red-700 hover:text-red-900 font-bold text-xs sm:text-sm sm:leading-relaxed truncate transition-colors hover:underline tracking-normal"
                title={`${currentItem.title} (বিস্তারিত দেখতে ক্লিক করুন)`}
              >
                {currentItem.title}
              </p>
            </div>
          </div>

          {/* Right: Quick Action Link & Pagination Indicator */}
          <div className="flex items-center gap-2 shrink-0">
            {urgentItems.length > 1 && (
              <div className="hidden lg:flex items-center gap-1 text-[11px] font-semibold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
                <span>{currentIndex + 1}</span>
                <span>/</span>
                <span>{urgentItems.length}</span>
              </div>
            )}

            <button
              type="button"
              onClick={() => onNavigateToNotices(currentItem.id)}
              className="flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-800 hover:underline px-2 py-1 rounded transition-colors whitespace-nowrap"
            >
              <span className="hidden sm:inline">{language === 'bn' ? 'সব নোটিশ' : 'All Notices'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Admin Fast Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-rose-200 overflow-hidden">
            <div className="bg-gradient-to-r from-red-600 to-rose-700 text-white px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-amber-200" />
                <h3 className="font-bold text-base sm:text-lg">জরুরি নোটিশ বার আপডেট</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAlert} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  নোটিশের প্রধান শিরোনাম (যা লাল রঙের বারে প্রদর্শিত হবে) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editHeadline}
                  onChange={e => setEditHeadline(e.target.value)}
                  placeholder="যেমন: কলেজ বার্ষিক ক্রীড়া ও সাংস্কৃতিক প্রতিযোগিতা ২০২৬ এর সময়সূচি ঘোষণা"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-red-500 font-semibold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  সংক্ষিপ্ত বিবরণী (ঐচ্ছিক)
                </label>
                <textarea
                  rows={3}
                  value={editDetail}
                  onChange={e => setEditDetail(e.target.value)}
                  placeholder="নোটিশের বিস্তারিত অংশ যা ক্লিক করলে দর্শনার্থীরা দেখতে পাবেন..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-red-500 text-slate-800"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="noticeActiveCheck"
                  checked={editIsActive}
                  onChange={e => setEditIsActive(e.target.checked)}
                  className="w-4 h-4 text-red-600 rounded border-slate-300 focus:ring-red-500"
                />
                <label htmlFor="noticeActiveCheck" className="text-xs font-bold text-slate-800 cursor-pointer">
                  জরুরি নোটিশ বারটি ওয়েবসাইটে দৃশ্যমান রাখুন
                </label>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-lg transition-colors"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
                >
                  <Check className="w-4 h-4" />
                  <span>সংরক্ষণ করুন</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
