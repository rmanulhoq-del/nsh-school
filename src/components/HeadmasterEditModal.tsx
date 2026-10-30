import React, { useState, useEffect } from 'react';
import {
  X,
  ArrowLeft,
  Pencil,
  Save,
  CheckCircle2,
  Sparkles,
  Phone,
  Mail,
  GraduationCap,
  Award,
  BookOpen,
  Calendar,
  RotateCcw,
  User,
  Upload
} from 'lucide-react';
import HeadmasterPortrait from './HeadmasterPortrait';
import { HeadmasterData, DEFAULT_HEADMASTER_DATA } from '../types';

interface HeadmasterEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: HeadmasterData;
  onSave: (updated: HeadmasterData) => void;
}

export default function HeadmasterEditModal({
  isOpen,
  onClose,
  data,
  onSave
}: HeadmasterEditModalProps) {
  const [formData, setFormData] = useState<HeadmasterData>(data);
  const [showSavedToast, setShowSavedToast] = useState(false);

  useEffect(() => {
    setFormData(data);
  }, [data]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    onSave(formData);
    setShowSavedToast(true);
    setTimeout(() => {
      setShowSavedToast(false);
      onClose();
    }, 600);
  };

  const handleResetToDefault = () => {
    if (confirm('আপনি কি পূর্বনির্ধারিত ডেমো তথ্যে ফিরে যেতে চান?')) {
      setFormData(DEFAULT_HEADMASTER_DATA);
    }
  };

  const applyMessagePreset = (title: string, body: string) => {
    setFormData(prev => ({
      ...prev,
      messageTitle: title,
      messageBody: body
    }));
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
    >
      <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl border border-slate-200 space-y-5 relative my-6 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Top Back & Close Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors border border-slate-200 shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-slate-600" />
            <span>← ব্যাকে যান (Back)</span>
          </button>

          <div className="text-center hidden sm:block">
            <span className="text-xs font-bold text-slate-700">প্রধান শিক্ষক তথ্য ও শুভেচ্ছা বাণী ম্যানেজমেন্ট</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-1 text-xs"
            title="উইন্ডো বন্ধ করুন (Esc)"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">বন্ধ (Close)</span>
          </button>
        </div>

        {/* Modal Header */}
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 bg-amber-50 border border-amber-200 text-amber-700 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold mb-1">
              <Pencil className="w-3 h-3" />
              <span>হেড স্যারের তথ্য, পরিচিতি ও বাণী সম্পাদনা</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
              প্রধান শিক্ষকের প্রোফাইল ও বাণী আপডেট
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              এখানে তথ্য পরিবর্তন করলে হোম পেজের বাণী, শিক্ষক তালিকা ও এডমিন সেশনে তাৎক্ষণিক আপডেট হবে।
            </p>
          </div>
        </div>

        {/* Quick Message Presets */}
        <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-2 text-xs">
          <div className="font-bold text-amber-900 flex items-center justify-between text-[11px]">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>বাণীর দ্রুত টেমপ্লেট নির্বাচন করুন:</span>
            </span>
            <button
              type="button"
              onClick={handleResetToDefault}
              className="text-slate-600 hover:text-[#0c3664] flex items-center gap-1 font-semibold"
            >
              <RotateCcw className="w-3 h-3" />
              <span>ডিফল্ট রিস্টোর</span>
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => applyMessagePreset(
                'ডিজিটাল ব্যবস্থার মাধ্যমে স্বচ্ছতা ও আধুনিক শিক্ষা',
                'নাপোড়া শেখেরখীল উচ্চ বিদ্যালয়ের সকল শিক্ষার্থী, শিক্ষক ও অভিভাবকবৃন্দকে আন্তরিক মোবারকবাদ। আমাদের ঐতিহ্য ও সুনামের মূল ভিত্তি হচ্ছে শিক্ষার গুণগত মান এবং সুশৃঙ্খল প্রশাসনিক জবাবদিহিতা। নাপোড়া বাজারের ব্যাংকগুলোর সাথে সমন্বয়ের মাধ্যমে স্কুলের যাবতীয় ফি এখন ডিজিটালভাবে পরিচালিত হচ্ছে।'
              )}
              className="px-2.5 py-1 bg-white hover:bg-amber-100 border border-amber-300 rounded-lg text-[11px] font-semibold text-slate-800 transition-colors"
            >
              🎓 ডিজিটাল শিক্ষা ও স্বচ্ছতা
            </button>
            <button
              type="button"
              onClick={() => applyMessagePreset(
                'নৈতিক মূল্যবোধ ও আধুনিক বিজ্ঞানভিত্তিক শিক্ষা আমাদের অঙ্গীকার',
                'বাঁশখালীর এই ঐতিহ্যবাহী বিদ্যাপীঠ দীর্ঘ ছয় দশক ধরে আলো ছড়িয়ে আসছে। আমরা শিক্ষার্থীদের কেবল পুথিগত বিদ্যা নয়, বরং দেশপ্রেম, বিজ্ঞানমনস্কতা ও মানবিক মূল্যবোধে বলীয়ান সুনাগরিক হিসেবে গড়ে তুলতে নিরলস কাজ করে যাচ্ছি।'
              )}
              className="px-2.5 py-1 bg-white hover:bg-amber-100 border border-amber-300 rounded-lg text-[11px] font-semibold text-slate-800 transition-colors"
            >
              🔬 বিজ্ঞান ও মানবিক শিক্ষা
            </button>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Photo Section */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center gap-4">
            <div className="w-18 h-18 rounded-2xl border-2 border-amber-400 overflow-hidden bg-slate-200 shrink-0 flex items-center justify-center shadow-xs">
              {formData.photoUrl ? (
                <img src={formData.photoUrl} alt={formData.name} className="w-full h-full object-cover" />
              ) : (
                <HeadmasterPortrait size="100%" className="w-full h-full object-cover" />
              )}
            </div>
            <div className="flex-1 w-full space-y-1.5">
              <label className="font-semibold text-slate-800 text-xs block">
                প্রধান শিক্ষকের ছবি (ফাইল আপলোড বা ছবির লিঙ্ক)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={formData.photoUrl || ''}
                  onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                  placeholder="ছবির লিঙ্ক (Image URL) অথবা ডানপাশের আপলোড বাটন চাপুন"
                  className="flex-1 px-3 py-1.5 bg-white border border-[#d2e5e7] rounded-xl text-xs focus:outline-none focus:border-[#0c3664]"
                />
                <label className="px-3.5 py-1.5 bg-[#0c3664] hover:bg-[#092b50] text-white text-xs font-bold rounded-xl cursor-pointer transition-colors shrink-0 flex items-center gap-1.5 shadow-xs">
                  <Upload className="w-3.5 h-3.5 text-amber-300" />
                  <span>আপলোড ছবি</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          const img = new Image();
                          img.onload = () => {
                            const canvas = document.createElement('canvas');
                            const maxWidth = 500;
                            let width = img.width;
                            let height = img.height;
                            if (width > maxWidth) {
                              height = Math.round((height * maxWidth) / width);
                              width = maxWidth;
                            }
                            canvas.width = width;
                            canvas.height = height;
                            const ctx = canvas.getContext('2d');
                            if (ctx) {
                              ctx.drawImage(img, 0, 0, width, height);
                              setFormData({ ...formData, photoUrl: canvas.toDataURL('image/jpeg', 0.85) });
                            } else {
                              setFormData({ ...formData, photoUrl: event.target?.result as string });
                            }
                          };
                          img.onerror = () => {
                            setFormData({ ...formData, photoUrl: event.target?.result as string });
                          };
                          img.src = event.target?.result as string;
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
                {formData.photoUrl && (
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, photoUrl: '' })}
                    className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg text-xs"
                    title="ছবি অপসারণ"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Row 1: Name & Designation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                প্রধান শিক্ষকের পূর্ণ নাম *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="যেমন: জনাব মোঃ জাহাঙ্গীর আলম"
                className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900 font-bold focus:outline-none focus:border-[#0c3664]"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                পদবি ও দায়িত্ব *
              </label>
              <input
                type="text"
                required
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                placeholder="যেমন: প্রধান শিক্ষক ও সদস্য সচিব"
                className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900 font-medium focus:outline-none focus:border-[#0c3664]"
              />
            </div>
          </div>

          {/* Row 2: Phone & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="font-semibold text-slate-700 block mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#0c3664]" />
                <span>অফিসিয়াল মোবাইল নম্বর *</span>
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="যেমন: 01711-000111"
                className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900 font-mono font-medium focus:outline-none focus:border-[#0c3664]"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#0c3664]" />
                <span>ইমেইল ঠিকানা</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="যেমন: headmaster@school.edu.bd"
                className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900 font-mono focus:outline-none focus:border-[#0c3664]"
              />
            </div>
          </div>

          {/* Row 3: Qualification & Subject/Scope */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="font-semibold text-slate-700 block mb-1 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-[#0c3664]" />
                <span>শিক্ষাগত যোগ্যতা</span>
              </label>
              <input
                type="text"
                value={formData.qualification}
                onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                placeholder="যেমন: এম.এসসি (পদার্থবিজ্ঞান), বি.এড (১ম শ্রেণি)"
                className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900 focus:outline-none focus:border-[#0c3664]"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#0c3664]" />
                <span>পাঠদানের বিষয় ও বিভাগ</span>
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="যেমন: পদার্থবিজ্ঞান ও সার্বিক প্রশাসন"
                className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900 focus:outline-none focus:border-[#0c3664]"
              />
            </div>
          </div>

          {/* Row 4: Message Title */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-[#d9482b]" />
              <span>প্রধান শিক্ষকের শুভেচ্ছা বাণীর শিরোনাম *</span>
            </label>
            <input
              type="text"
              required
              value={formData.messageTitle}
              onChange={(e) => setFormData({ ...formData, messageTitle: e.target.value })}
              placeholder="যেমন: ডিজিটাল ব্যবস্থার মাধ্যমে স্বচ্ছতা ও আধুনিক শিক্ষা"
              className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900 font-bold focus:outline-none focus:border-[#0c3664]"
            />
          </div>

          {/* Row 5: Message Body */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              প্রধান শিক্ষকের শুভেচ্ছা বাণী ও দিকনির্দেশনা (ওয়েবসাইটে প্রকাশিত বক্তব্য) *
            </label>
            <textarea
              rows={4}
              required
              value={formData.messageBody}
              onChange={(e) => setFormData({ ...formData, messageBody: e.target.value })}
              placeholder="প্রধান শিক্ষকের বাণী এখানে লিখুন..."
              className="w-full p-3 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900 leading-relaxed italic focus:outline-none focus:border-[#0c3664]"
            />
          </div>

          {/* Modal Actions */}
          <div className="pt-3 flex items-center justify-between gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-800 font-semibold"
            >
              বাতিল
            </button>

            <div className="flex items-center gap-2">
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#0c3664] hover:bg-[#092b50] text-white font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4 text-amber-300" />
                <span>হেড স্যারের তথ্য সংরক্ষণ করুন</span>
              </button>
            </div>
          </div>
        </form>

        {showSavedToast && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-xs rounded-3xl flex items-center justify-center p-6 animate-in fade-in duration-200">
            <div className="text-center space-y-2">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
              <div className="text-base font-bold text-slate-900">
                প্রধান শিক্ষকের তথ্য সফলভাবে সংরক্ষণ ও আপডেট সম্পন্ন হয়েছে!
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
