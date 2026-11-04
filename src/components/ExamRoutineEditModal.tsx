import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Plus,
  Trash2,
  Save,
  RotateCcw,
  Calendar,
  Clock,
  BookOpen,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { ExamRoutineItem, DEFAULT_EXAM_ROUTINE } from '../types';

interface ExamRoutineEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  routine: ExamRoutineItem[];
  onSave: (newRoutine: ExamRoutineItem[]) => void;
}

export default function ExamRoutineEditModal({
  isOpen,
  onClose,
  routine,
  onSave
}: ExamRoutineEditModalProps) {
  const [items, setItems] = useState<ExamRoutineItem[]>([]);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setItems(routine && routine.length > 0 ? JSON.parse(JSON.stringify(routine)) : [...DEFAULT_EXAM_ROUTINE]);
      setSuccessMsg(null);
    }
  }, [isOpen, routine]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleUpdateItem = (id: string, field: keyof ExamRoutineItem, value: string) => {
    setItems(prev => prev.map(item => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const handleAddItem = () => {
    const newId = `routine_${Date.now()}`;
    const newItem: ExamRoutineItem = {
      id: newId,
      date: '১২/১১/২০২৬',
      day: 'বৃহস্পতিবার',
      subject: 'নতুন বিষয়ের নাম',
      time: 'সকাল ১০:০০ - দুপুর ০১:০০'
    };
    setItems(prev => [...prev, newItem]);
  };

  const handleDeleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const handleResetToDefault = () => {
    if (window.confirm('আপনি কি পরীক্ষার রুটিন রিসেট করে ডিফল্ট সময়সূচিতে ফিরিয়ে নিতে চান?')) {
      setItems([...DEFAULT_EXAM_ROUTINE]);
      setSuccessMsg('ডিফল্ট রুটিন লোড করা হয়েছে। পরিবর্তন স্থায়ী করতে "রুটিন সংরক্ষণ করুন" বাটনে চাপুন।');
    }
  };

  const handleSave = () => {
    try {
      localStorage.setItem('school_exam_routine', JSON.stringify(items));
      onSave(items);
      setSuccessMsg('✅ পরীক্ষার রুটিন সফলভাবে সংরক্ষিত হয়েছে এবং প্রবেশপত্রে হালনাগাদ করা হয়েছে!');
      setTimeout(() => {
        setSuccessMsg(null);
        onClose();
      }, 1200);
    } catch {
      alert('রুটিন সংরক্ষণে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-150">
        
        {/* HEADER */}
        <div className="bg-gradient-to-r from-[#0c3664] via-[#114073] to-[#164a85] text-white px-6 py-4 flex items-center justify-between gap-4 border-b-4 border-amber-400 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-sm">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-amber-300 font-bold uppercase tracking-wider">
                বিদ্যালয় এডমিন কন্ট্রোল প্যানেল
              </div>
              <h2 className="text-base sm:text-lg font-black text-white">
                পরীক্ষার সময়সূচি ও রুটিন এডিটর (Admit Card Routine Editor)
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
            title="বন্ধ করুন (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* NOTICE / INFO BAR */}
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs text-amber-950 font-medium shrink-0">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              এখানে পরিবর্তিত তারিখ, বার, বিষয় ও সময় সাথে সাথে সকল শিক্ষার্থীর প্রবেশপত্র (Admit Card)-এ প্রতিফলিত হবে।
            </span>
          </div>
          <button
            type="button"
            onClick={handleResetToDefault}
            className="text-[11px] font-bold text-[#0c3664] hover:underline flex items-center gap-1 shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>ডিফল্ট রুটিনে রিসেট</span>
          </button>
        </div>

        {/* SUCCESS MESSAGE */}
        {successMsg && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-2.5 text-xs text-emerald-800 font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* BODY - EDITABLE ROWS */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-3 bg-slate-50">
          <div className="hidden md:grid md:grid-cols-12 gap-3 px-3 py-1 text-xs font-bold text-slate-600 uppercase tracking-wider">
            <div className="col-span-1 text-center">ক্রম</div>
            <div className="col-span-3">তারিখ (Date)</div>
            <div className="col-span-2">বার (Day)</div>
            <div className="col-span-3">বিষয় (Subject)</div>
            <div className="col-span-2">সময় (Exam Time)</div>
            <div className="col-span-1 text-center">মুছুন</div>
          </div>

          {items.map((item, index) => (
            <div
              key={item.id || index}
              className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-3 sm:p-3.5 shadow-2xs transition-all flex flex-col md:grid md:grid-cols-12 gap-2.5 items-center"
            >
              <div className="w-full md:col-span-1 flex items-center justify-between md:justify-center">
                <span className="text-xs font-extrabold text-slate-700 bg-slate-100 rounded-lg px-2 py-1 md:px-0 md:py-0 md:bg-transparent">
                  #{index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => handleDeleteItem(item.id)}
                  className="md:hidden text-rose-500 hover:text-rose-700 p-1"
                  title="সারি মুছুন"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Date */}
              <div className="w-full md:col-span-3">
                <label className="text-[10px] font-bold text-slate-500 block md:hidden mb-0.5">তারিখ:</label>
                <input
                  type="text"
                  value={item.date}
                  onChange={e => handleUpdateItem(item.id, 'date', e.target.value)}
                  placeholder="যেমন: ২৫/১০/২০২৬"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-[#0c3664] focus:bg-white"
                />
              </div>

              {/* Day */}
              <div className="w-full md:col-span-2">
                <label className="text-[10px] font-bold text-slate-500 block md:hidden mb-0.5">বার:</label>
                <input
                  type="text"
                  value={item.day}
                  onChange={e => handleUpdateItem(item.id, 'day', e.target.value)}
                  placeholder="যেমন: রবিবার"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-[#0c3664] focus:bg-white"
                />
              </div>

              {/* Subject */}
              <div className="w-full md:col-span-3">
                <label className="text-[10px] font-bold text-slate-500 block md:hidden mb-0.5">বিষয়:</label>
                <input
                  type="text"
                  value={item.subject}
                  onChange={e => handleUpdateItem(item.id, 'subject', e.target.value)}
                  placeholder="যেমন: বাংলা ১ম পত্র"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black text-[#0c3664] focus:outline-none focus:border-[#0c3664] focus:bg-white"
                />
              </div>

              {/* Time */}
              <div className="w-full md:col-span-2">
                <label className="text-[10px] font-bold text-slate-500 block md:hidden mb-0.5">সময়:</label>
                <input
                  type="text"
                  value={item.time}
                  onChange={e => handleUpdateItem(item.id, 'time', e.target.value)}
                  placeholder="সকাল ১০:০০ - দুপুর ০১:০০"
                  className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-[#0c3664] focus:bg-white"
                />
              </div>

              {/* Delete Button (Desktop) */}
              <div className="hidden md:flex md:col-span-1 justify-center">
                <button
                  type="button"
                  onClick={() => handleDeleteItem(item.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                  title="এই বিষয়ের সারি মুছে ফেলুন"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {/* Add Row Button */}
          <button
            type="button"
            onClick={handleAddItem}
            className="w-full py-3 border-2 border-dashed border-slate-300 hover:border-[#0c3664] hover:bg-white text-slate-700 hover:text-[#0c3664] rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all mt-3"
          >
            <Plus className="w-4 h-4 text-emerald-600" />
            <span>➕ নতুন পরীক্ষা / বিষয়ের সময়সূচি সারি যুক্ত করুন</span>
          </button>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="bg-white px-6 py-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500 font-medium">
            মোট পরীক্ষার বিষয় সংখ্যা: <strong className="text-slate-800">{items.length} টি</strong>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold rounded-xl text-xs transition-colors"
            >
              বাতিল (Cancel)
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-extrabold rounded-xl text-xs flex items-center gap-2 shadow-md transition-transform active:scale-95"
            >
              <Save className="w-4 h-4 text-amber-300" />
              <span>💾 রুটিন সংরক্ষণ ও প্রবেশপত্রে প্রয়োগ করুন</span>
            </button>
          </div>
        </div>

      </div>
    </div>,
    document.body
  );
}
