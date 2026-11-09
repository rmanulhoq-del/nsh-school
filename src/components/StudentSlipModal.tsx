import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Printer,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Calendar,
  CreditCard,
  Building2,
  Check,
  ShieldCheck
} from 'lucide-react';
import SchoolLogo from './SchoolLogo';
import { StudentDataForDispatch } from './GuardianDispatchModal';
import { formatClassBangla } from '../types';

interface StudentSlipModalProps {
  student: StudentDataForDispatch | null;
  isOpen: boolean;
  onClose: () => void;
  isAdmin?: boolean;
  onUpdateFeeMonths?: (studentId: string, updatedMonths: string[], updatedExamStatus?: string) => void;
}

const ALL_12_MONTHS = [
  'জানুয়ারি',
  'ফেব্রুয়ারি',
  'মার্চ',
  'এপ্রিল',
  'মে',
  'জুন',
  'জুলাই',
  'আগস্ট',
  'সেপ্টেম্বর',
  'অক্টোবর',
  'নভেম্বর',
  'ডিসেম্বর'
];

const EXAM_TYPES_LIST = [
  { id: '১ম সাময়িক', label: '১ম সাময়িক পরীক্ষা', month: 'এপ্রিল' },
  { id: '২য় সাময়িক', label: '২য় সাময়িক পরীক্ষা', month: 'আগস্ট' },
  { id: 'বার্ষিক', label: 'বার্ষিক পরীক্ষা', month: 'নভেম্বর' },
  { id: 'টেস্ট পরীক্ষা', label: 'টেস্ট পরীক্ষা (SSC Test Exam)', month: 'ডিসেম্বর' }
];

export default function StudentSlipModal({
  student,
  isOpen,
  onClose,
  isAdmin = false,
  onUpdateFeeMonths
}: StudentSlipModalProps) {
  // Local state for interactive 12-month selection
  const [currentFeeMonths, setCurrentFeeMonths] = useState<string[]>([]);
  const [examStatusMap, setExamStatusMap] = useState<Record<string, boolean>>({
    '১ম সাময়িক': true,
    '২য় সাময়িক': false,
    'বার্ষিক': false,
    'টেস্ট পরীক্ষা': false
  });
  const [selectedBank, setSelectedBank] = useState<string>('বাংলাদেশ কৃষি ব্যাংক, নাপোড়া শাখা');
  const [receiptNote, setReceiptNote] = useState<string>('');

  useEffect(() => {
    if (student) {
      if (student.feeMonths && student.feeMonths.length > 0) {
        setCurrentFeeMonths(student.feeMonths);
      } else if (student.status === 'paid') {
        // Default paid up to current month (e.g. up to অক্টোবর)
        setCurrentFeeMonths(['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর']);
      } else {
        setCurrentFeeMonths(['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ']);
      }

      if (student.paidBank) {
        setSelectedBank(student.paidBank);
      }
    }
  }, [student]);

  // Listen for Escape key
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('has-print-modal-open');
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.classList.remove('has-print-modal-open');
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen || !student) return null;

  const monthlyRate = student.monthlyFee || 500;
  const examRate = student.examFee || 300;

  // Toggle month
  const handleToggleMonth = (month: string) => {
    const isPaid = currentFeeMonths.includes(month);
    const updated = isPaid
      ? currentFeeMonths.filter(m => m !== month)
      : [...currentFeeMonths, month];
    setCurrentFeeMonths(updated);
    if (onUpdateFeeMonths) {
      onUpdateFeeMonths(student.id, updated);
    }
  };

  const handleToggleExam = (examId: string) => {
    const updated = { ...examStatusMap, [examId]: !examStatusMap[examId] };
    setExamStatusMap(updated);
  };

  const paidMonthsCount = currentFeeMonths.length;
  const dueMonthsCount = Math.max(0, 12 - paidMonthsCount);
  const paidTuitionTotal = paidMonthsCount * monthlyRate;
  const dueTuitionTotal = dueMonthsCount * monthlyRate;

  const isClass10 = student.className === '10' || student.className === '১০';
  const totalExamsCount = isClass10 ? 4 : 3;
  const paidExamsCount = Object.values(examStatusMap).filter(Boolean).length;
  const dueExamsCount = Math.max(0, totalExamsCount - paidExamsCount);
  const paidExamTotal = paidExamsCount * examRate;
  const dueExamTotal = dueExamsCount * examRate;

  const grandTotalAnnual = (12 * monthlyRate) + (totalExamsCount * examRate);
  const totalPaid = paidTuitionTotal + paidExamTotal;
  const totalDue = dueTuitionTotal + dueExamTotal;

  const handlePrint = () => {
    window.print();
  };

  return createPortal(
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      className="printable-modal-portal fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-start justify-center p-2 sm:p-4 md:p-6 overflow-y-auto print:p-0 print:bg-white print:static"
    >
      <style dangerouslySetInnerHTML={{ __html: '@media print { @page { size: portrait; margin: 0.8cm; } }' }} />
      <div className="bg-white rounded-3xl max-w-4xl w-full p-4 sm:p-6 md:p-8 shadow-2xl border border-slate-200 space-y-6 relative my-2 sm:my-4 print:border-none print:shadow-none print:m-0 print:p-4 print:rounded-none animate-in fade-in zoom-in-95 duration-150">
        
        {/* ========================================================= */}
        {/* TOP ACTION & BACK CONTROL BAR (Screen Only) */}
        {/* ========================================================= */}
        <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-200 print:hidden bg-white sticky top-0 z-10 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-xs border border-slate-300 group"
          >
            <ArrowLeft className="w-4 h-4 text-slate-700 group-hover:-translate-x-0.5 transition-transform" />
            <span>← ব্যাকে যান (Back)</span>
          </button>

          <div className="text-center">
            <h3 className="text-sm font-bold text-slate-900 leading-tight flex items-center justify-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#0c3664]" />
              <span>শিক্ষার্থীর বার্ষিক ১২ মাসের ফি ক্যালেন্ডার ও ব্যাংক স্লিপ</span>
            </h3>
            <span className="text-[11px] text-slate-500 font-mono">আইডি: {student.id} · শিক্ষাবর্ষ: ২০২৬</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 bg-[#0c3664] hover:bg-[#092b50] text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-colors"
              title="১২ মাসের ফি রসিদ স্লিপ প্রিন্ট বা PDF সেভ করুন"
            >
              <Printer className="w-3.5 h-3.5 text-amber-300" />
              <span>প্রিন্ট / PDF</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors border border-slate-200"
              title="বন্ধ করুন"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* PRINTABLE MEMO CONTENT */}
        {/* ========================================================= */}
        <div className="border-2 border-[#0c3664] rounded-2xl p-4 sm:p-6 space-y-5 bg-white text-slate-800 shadow-2xs">
          {/* Memo Header */}
          <div className="text-center space-y-1.5 pb-4 border-b-2 border-slate-200 relative">
            <div className="flex items-center justify-center gap-3">
              <SchoolLogo size={54} />
              <div>
                <h1 className="text-xl md:text-2xl font-extrabold text-[#0c3664]">
                  নাপোড়া শেখেরখীল উচ্চ বিদ্যালয়
                </h1>
                <p className="text-xs text-slate-600 font-medium">
                  ডাকঘর: নাপোড়া, উপজেলা: বাঁশখালী, জেলা: চট্টগ্রাম · ইআইআইএন: ১০৪০৬২
                </p>
                <p className="text-[11px] text-amber-700 italic font-semibold">
                  "পড় স্রষ্টার নামে" · স্থাপিত : ১৯৬৪ ইং
                </p>
              </div>
            </div>

            <div className="pt-2">
              <span className="inline-block bg-[#0c3664] text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">
                শিক্ষার্থী বার্ষিক ১২ মাসের ফি বিবরণী ও ব্যাংক রসিদ স্লিপ (শিক্ষাবর্ষ ২০২৬)
              </span>
            </div>
          </div>

          {/* Student Profile Overview Card */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-[#f0f6f6] rounded-xl text-xs border border-[#d2e5e7]">
            <div>
              <span className="text-slate-500 block text-[11px]">শিক্ষার্থীর নাম:</span>
              <strong className="text-slate-900 text-sm">{student.name}</strong>
            </div>

            <div>
              <span className="text-slate-500 block text-[11px]">স্টুডেন্ট আইডি:</span>
              <strong className="font-mono text-slate-900">{student.id}</strong>
            </div>

            <div>
              <span className="text-slate-500 block text-[11px]">শ্রেণি ও শাখা:</span>
              <strong className="text-slate-900">
                {formatClassBangla(student.className)} · শাখা {student.section}
                {student.group && ` (${student.group === 'science' ? 'বিজ্ঞান' : student.group === 'humanities' ? 'মানবিক' : 'ব্যবসায়'})`}
              </strong>
            </div>

            <div>
              <span className="text-slate-500 block text-[11px]">রোল নম্বর:</span>
              <strong className="font-mono text-slate-900 text-sm">#{student.roll}</strong>
            </div>

            <div>
              <span className="text-slate-500 block text-[11px]">লিঙ্গ / ধরন:</span>
              <strong className={student.gender === 'female' ? 'text-fuchsia-700' : 'text-blue-700'}>
                {student.gender === 'female' ? '👧 ছাত্রী (মেয়ে)' : '👦 ছাত্র (ছেলে)'}
              </strong>
            </div>

            <div>
              <span className="text-slate-500 block text-[11px]">অভিভাবকের নাম:</span>
              <strong className="text-slate-900">{student.guardianName || '—'}</strong>
            </div>

            <div>
              <span className="text-slate-500 block text-[11px]">অভিভাবক মোবাইল:</span>
              <strong className="font-mono text-slate-900">{student.guardianPhone}</strong>
            </div>

            <div>
              <span className="text-slate-500 block text-[11px]">মাসিক বেতন হার:</span>
              <strong className="font-mono text-[#0c3664] text-sm">৳{monthlyRate} / মাস</strong>
            </div>
          </div>

          {/* KPI Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-center">
              <span className="text-[10px] text-blue-700 font-bold uppercase block">সর্বমোট বার্ষিক ফি</span>
              <span className="text-lg font-black text-[#0c3664] font-mono">৳{grandTotalAnnual}</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">১২ মাস বেতন + {totalExamsCount} পরীক্ষা</span>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
              <span className="text-[10px] text-emerald-700 font-bold uppercase block">মোট পরিশোধিত</span>
              <span className="text-lg font-black text-emerald-700 font-mono">৳{totalPaid}</span>
              <span className="text-[10px] text-emerald-800 font-semibold block mt-0.5">{paidMonthsCount} মাস পরিশোধিত</span>
            </div>

            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-center">
              <span className="text-[10px] text-rose-700 font-bold uppercase block">বর্তমান বকেয়া ফি</span>
              <span className="text-lg font-black text-rose-700 font-mono">৳{totalDue}</span>
              <span className="text-[10px] text-rose-800 font-semibold block mt-0.5">{dueMonthsCount} মাস বকেয়া</span>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-center">
              <span className="text-[10px] text-amber-800 font-bold uppercase block">পেমেন্ট অগ্রগতি</span>
              <span className="text-lg font-black text-amber-900 font-mono">
                {Math.round((totalPaid / (grandTotalAnnual || 1)) * 100)}%
              </span>
              <span className="text-[10px] text-amber-700 block mt-0.5">বছরের কিস্তি সম্পূর্ণ</span>
            </div>
          </div>

          {/* ========================================================= */}
          {/* SECTION 1: FULL YEAR 12-MONTH FEE CALENDAR (ক্যালেন্ডার) */}
          {/* ========================================================= */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wide">
                <Calendar className="w-4 h-4 text-[#0c3664]" />
                <span>পুরো বছরের ১২ মাসের মাসিক বেতন ক্যালেন্ডার (জানুয়ারি — ডিসেম্বর ২০২৬)</span>
              </h3>
              <div className="flex items-center gap-3 text-[11px] print:hidden">
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  পরিশোধিত ({paidMonthsCount})
                </span>
                <span className="text-rose-700 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                  বকেয়া ({dueMonthsCount})
                </span>
              </div>
            </div>

            {/* 12-Month Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 text-xs">
              {ALL_12_MONTHS.map((month, idx) => {
                const isPaid = currentFeeMonths.includes(month);
                return (
                  <div
                    key={month}
                    onClick={() => {
                      // Allow toggling for convenience
                      handleToggleMonth(month);
                    }}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer select-none ${
                      isPaid
                        ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950 hover:bg-emerald-100'
                        : 'bg-rose-50/70 border-rose-300 text-rose-950 hover:bg-rose-100'
                    }`}
                    title={`ক্লিক করে ${month} মাসের স্ট্যাটাস পরিবর্তন করুন`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-[11px] text-slate-700">#{idx + 1} মাস</span>
                      {isPaid ? (
                        <span className="inline-flex items-center gap-0.5 text-[10px] bg-emerald-600 text-white font-extrabold px-1.5 py-0.2 rounded">
                          <Check className="w-2.5 h-2.5" /> পেইড
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-[10px] bg-rose-600 text-white font-extrabold px-1.5 py-0.2 rounded">
                          বকেয়া
                        </span>
                      )}
                    </div>

                    <div className="font-extrabold text-sm">{month}</div>

                    <div className="flex items-center justify-between text-[11px] mt-1 pt-1 border-t border-slate-200/60 font-mono">
                      <span className="text-slate-500">বেতন:</span>
                      <strong className={isPaid ? 'text-emerald-800' : 'text-rose-800'}>
                        ৳{monthlyRate}
                      </strong>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-[11px] text-slate-500 italic print:hidden">
              * টিপস: মাসের কার্ডে ক্লিক করে সরাসরি 'পরিশোধিত' বা 'বকেয়া' পরিবর্তন করতে পারেন।
            </p>
          </div>

          {/* ========================================================= */}
          {/* SECTION 2: EXAM FEE BREAKDOWN (পরীক্ষার ফি) */}
          {/* ========================================================= */}
          <div className="space-y-2.5 pt-2 border-t border-slate-200">
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wide">
              <CreditCard className="w-4 h-4 text-[#d9482b]" />
              <span>পরীক্ষা ও মূল্যায়ন ফি বিবরণী (১ম সাময়িক, ২য় সাময়িক, বার্ষিক ও টেস্ট পরীক্ষা)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
              {EXAM_TYPES_LIST.map((exam) => {
                const isPaid = !!examStatusMap[exam.id];
                return (
                  <div
                    key={exam.id}
                    onClick={() => handleToggleExam(exam.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer select-none ${
                      isPaid
                        ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950 hover:bg-emerald-100'
                        : 'bg-rose-50/70 border-rose-300 text-rose-950 hover:bg-rose-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] text-slate-600 font-medium">{exam.month} অধিবেশন</span>
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        isPaid ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                      }`}>
                        {isPaid ? 'পরিশোধিত' : 'বকেয়া'}
                      </span>
                    </div>

                    <div className="font-bold text-slate-900 text-sm">{exam.label}</div>

                    <div className="flex items-center justify-between text-[11px] mt-1 pt-1 border-t border-slate-200/60">
                      <span className="text-slate-500">নির্ধারিত ফি:</span>
                      <span className="font-mono font-bold text-slate-900">৳{examRate}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ========================================================= */}
          {/* SECTION 3: BANK DEPOSIT & RECONCILIATION */}
          {/* ========================================================= */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#0c3664]" />
                <span className="font-bold text-slate-800">অফিশিয়াল ব্যাংক জমার বিবরণ:</span>
              </div>
              <span className="text-[11px] text-slate-500 font-mono">
                চালান / ট্রানজাকশন আইডি: {student.txnId || `BKB-2026-${student.roll.toString().padStart(4, '0')}`}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-slate-700">
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <span className="text-slate-400 block text-[10px]">অনুমোদিত ব্যাংক শাখা:</span>
                <span className="font-semibold text-slate-900">{selectedBank}</span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <span className="text-slate-400 block text-[10px]">সর্বশেষ পেমেন্ট তারিখ:</span>
                <span className="font-semibold font-mono text-slate-900">{student.paymentDate || '২০২৬-১০-১৫'}</span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <span className="text-slate-400 block text-[10px]">যাচাইকরণ অবস্থা:</span>
                <span className="font-bold text-emerald-700 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  ডিজিটাল সিস্টেম অনুমোদিত
                </span>
              </div>
            </div>
          </div>

          {/* Signatures & Office Verification */}
          <div className="pt-8 flex items-end justify-between text-xs text-slate-600">
            <div className="text-center space-y-1">
              <div className="w-40 border-b border-slate-400 mx-auto"></div>
              <div className="font-semibold text-slate-800">আদায়কারী / হিসাব সহকারী</div>
              <div className="text-[10px] text-slate-500">নাপোড়া শেখেরখীল উচ্চ বিদ্যালয়</div>
            </div>

            <div className="text-center space-y-1">
              <div className="w-40 border-b border-slate-400 mx-auto"></div>
              <div className="font-bold text-slate-900">জনাব মোঃ জাহাঙ্গীর আলম</div>
              <div className="text-[10px] text-slate-600">প্রধান শিক্ষক ও সদস্য সচিব</div>
            </div>
          </div>

          {/* Barcode & Verification Footer */}
          <div className="pt-2 border-t border-slate-200 text-center text-[10px] text-slate-400 flex items-center justify-between">
            <span>নাপোড়া শেখেরখীল উচ্চ বিদ্যালয় সমন্বিত ডিজিটাল ম্যানেজমেন্ট পোর্টাল</span>
            <span className="font-mono font-bold">EIIN-104062 · STUDENT-VERIFIED #{student.id}</span>
          </div>
        </div>

        {/* BOTTOM ACTION BUTTONS */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-200 print:hidden">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center gap-2 transition-colors border border-slate-300"
          >
            <ArrowLeft className="w-4 h-4 text-slate-600" />
            <span>← শিক্ষার্থী তালিকায় ফিরে যান</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-5 py-2.5 bg-[#0c3664] hover:bg-[#092b50] text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-xs transition-colors"
            >
              <Printer className="w-4 h-4 text-amber-300" />
              <span>প্রিন্ট ১২ মাসের ফি স্লিপ</span>
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
