import React, { useState, useEffect } from 'react';
import {
  X,
  ArrowLeft,
  Pencil,
  Save,
  CheckCircle2,
  ShieldCheck,
  User,
  RotateCcw,
  Upload
} from 'lucide-react';
import { PresidentData, DEFAULT_PRESIDENT_DATA } from '../types';
import PresidentPortrait from './PresidentPortrait';

interface PresidentEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: PresidentData;
  onSave: (updated: PresidentData) => void;
}

export default function PresidentEditModal({
  isOpen,
  onClose,
  data,
  onSave
}: PresidentEditModalProps) {
  const [formData, setFormData] = useState<PresidentData>(data);
  const [showSavedToast, setShowSavedToast] = useState(false);

  useEffect(() => {
    setFormData(data);
  }, [data]);

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
    if (confirm('আপনি কি পূর্বনির্ধারিত সভাপতি তথ্যে ফিরে যেতে চান?')) {
      setFormData(DEFAULT_PRESIDENT_DATA);
    }
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
            <span className="text-xs font-bold text-slate-700">পরিচালনা পরিষদ সভাপতি মহোদয়ের তথ্য ও দিকনির্দেশনা</span>
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
          <div className="w-12 h-12 bg-blue-50 border border-blue-200 text-[#0c3664] rounded-2xl flex items-center justify-center shrink-0 shadow-2xs">
            <ShieldCheck className="w-6 h-6 text-[#d9482b]" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-100 text-[#0c3664] text-[11px] font-bold mb-1">
              <Pencil className="w-3 h-3" />
              <span>সভাপতি মহোদয়ের ছবি, পরিচিতি ও দিকনির্দেশনা</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
              পরিচালনা পরিষদ সভাপতির তথ্য ও ছবি আপডেট
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              এখানে তথ্য বা ছবি পরিবর্তন করলে হোম পেজ, আমাদের সম্পর্কে ও পরিচালনা পর্ষদ পেজে তাৎক্ষণিক আপডেট হবে।
            </p>
          </div>
        </div>

        {/* Photo Upload Section */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center gap-4">
          <div className="w-20 h-20 rounded-2xl border-2 border-amber-400 overflow-hidden bg-slate-200 shrink-0 flex items-center justify-center shadow-xs relative">
            {formData.photoUrl ? (
              <img src={formData.photoUrl} alt={formData.name} className="w-full h-full object-cover" />
            ) : (
              <PresidentPortrait size="100%" className="w-full h-full object-cover" />
            )}
          </div>
          <div className="flex-1 w-full space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-800 text-xs block">
                সভাপতি মহোদয়ের ছবি (ছবি নির্বাচন বা লিঙ্ক প্রদান)
              </label>
              <button
                type="button"
                onClick={handleResetToDefault}
                className="text-[11px] text-slate-500 hover:text-[#0c3664] flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>রিস্টোর ডিফল্ট</span>
              </button>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={formData.photoUrl || ''}
                onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                placeholder="ছবির ওয়েব লিঙ্ক (Image URL) অথবা ডানপাশের বাটন দিয়ে কম্পিউটার/ফোন থেকে আপলোড করুন"
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

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Row 1: Name & Designation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                সভাপতি মহোদয়ের নাম *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="যেমন: অধ্যক্ষ জনাব মোঃ আবদুল কাদের"
                className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900 font-bold focus:outline-none focus:border-[#0c3664]"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                পদবি *
              </label>
              <input
                type="text"
                required
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                placeholder="যেমন: সভাপতি, বিদ্যালয় পরিচালনা কমিটি"
                className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900 focus:outline-none focus:border-[#0c3664]"
              />
            </div>
          </div>

          {/* Row 2: Profession */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              পেশা ও সামাজিক পরিচয়
            </label>
            <input
              type="text"
              value={formData.profession}
              onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
              placeholder="যেমন: অধ্যক্ষ ও বিশিষ্ট শিক্ষাবিদ"
              className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900 focus:outline-none focus:border-[#0c3664]"
            />
          </div>

          {/* Row 3: Message Title */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              দিকনির্দেশনামূলক বাণীর শিরোনাম *
            </label>
            <input
              type="text"
              required
              value={formData.messageTitle}
              onChange={(e) => setFormData({ ...formData, messageTitle: e.target.value })}
              placeholder="যেমন: আধুনিক ও মানসম্মত শিক্ষায় বাঁশখালীর আলোকবর্তিকা"
              className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900 font-bold focus:outline-none focus:border-[#0c3664]"
            />
          </div>

          {/* Row 4: Message Body */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              সভাপতির বক্তব্য ও দিকনির্দেশনা (ওয়েবসাইটে প্রকাশিত বক্তব্য) *
            </label>
            <textarea
              rows={4}
              required
              value={formData.messageBody}
              onChange={(e) => setFormData({ ...formData, messageBody: e.target.value })}
              placeholder="সভাপতির বক্তব্য এখানে লিখুন..."
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
                <span>সভাপতির তথ্য ও ছবি সংরক্ষণ করুন</span>
              </button>
            </div>
          </div>
        </form>

        {showSavedToast && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-xs rounded-3xl flex items-center justify-center p-6 animate-in fade-in duration-200">
            <div className="text-center space-y-2">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
              <div className="text-base font-bold text-slate-900">
                সভাপতি মহোদয়ের তথ্য ও ছবি সফলভাবে সংরক্ষণ হয়েছে!
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
