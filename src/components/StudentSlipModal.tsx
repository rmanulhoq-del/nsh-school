import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Printer,
  CheckCircle2,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';
import SchoolLogo from './SchoolLogo';
import { StudentDataForDispatch } from './GuardianDispatchModal';
import { formatClassBangla } from '../types';

interface StudentSlipModalProps {
  student: StudentDataForDispatch | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function StudentSlipModal({
  student,
  isOpen,
  onClose
}: StudentSlipModalProps) {
  // Listen for Escape key and isolate print styles
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

  const totalFee = (student.monthlyFee || 0) + (student.examFee || 0);

  const handlePrint = () => {
    window.print();
  };

  return createPortal(
    <div
      onClick={(e) => {
        // Close when clicking dark backdrop outside the modal
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      className="printable-modal-portal fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-start justify-center p-3 sm:p-6 overflow-y-auto print:p-0 print:bg-white print:static"
    >
      <style dangerouslySetInnerHTML={{ __html: '@media print { @page { size: portrait; margin: 1cm; } }' }} />
      <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl border border-slate-200 space-y-5 relative my-4 sm:my-6 print:border-none print:shadow-none print:m-0 print:p-6 print:rounded-none animate-in fade-in zoom-in-95 duration-150">
        
        {/* ========================================================= */}
        {/* TOP ACTION & BACK CONTROL BAR (Always visible & prominent) */}
        {/* ========================================================= */}
        <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-200 print:hidden bg-white sticky top-0 z-10 pt-1">
          {/* Prominent Back Button */}
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-xs border border-slate-300 group"
            title="শিক্ষার্থী তালিকায় ফিরে যান"
          >
            <ArrowLeft className="w-4 h-4 text-slate-700 group-hover:-translate-x-0.5 transition-transform" />
            <span>← ব্যাকে যান (Back)</span>
          </button>

          <div className="text-center hidden sm:block">
            <h3 className="text-sm font-bold text-slate-900 leading-tight">
              ডিজিটাল ফি রসিদ ও শিক্ষার্থী বিবরণী
            </h3>
            <span className="text-[11px] text-slate-500 font-mono">আইডি: {student.id}</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Print Button */}
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 bg-[#0c3664] hover:bg-[#092b50] text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-colors"
              title="রসিদ স্লিপ প্রিন্ট বা PDF সেভ করুন"
            >
              <Printer className="w-3.5 h-3.5 text-amber-300" />
              <span>প্রিন্ট / সেভ</span>
            </button>

            {/* Clear Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors border border-slate-200 hover:border-rose-200 flex items-center gap-1 text-xs font-semibold"
              title="স্লিপ উইন্ডো বন্ধ করুন (Esc)"
            >
              <X className="w-4 h-4" />
              <span className="hidden sm:inline">বন্ধ</span>
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* PRINTABLE MEMO CONTENT */}
        {/* ========================================================= */}
        <div className="border-2 border-[#0c3664] rounded-2xl p-5 sm:p-7 space-y-5 bg-white text-slate-800 shadow-2xs">
          {/* Memo Header with Logo */}
          <div className="text-center space-y-1.5 pb-4 border-b-2 border-slate-200 relative">
            <div className="flex items-center justify-center gap-3">
              <SchoolLogo size={52} />
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
                শিক্ষার্থী ফি রসিদ ও অফিসিয়াল বিবরণী (অভিভাবক কপি)
              </span>
            </div>
          </div>

          {/* Student Info Grid */}
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
              <span className="text-slate-500 block text-[11px]">শিক্ষার্থী লিঙ্গ (Gender):</span>
              <strong className={student.gender === 'female' ? 'text-fuchsia-700' : 'text-blue-700'}>
                {student.gender === 'female' ? '👧 ছাত্রী (মেয়ে)' : '👦 ছাত্র (ছেলে)'}
              </strong>
            </div>

            <div>
              <span className="text-slate-500 block text-[11px]">রোল নম্বর:</span>
              <strong className="font-mono text-slate-900 text-sm">#{student.roll}</strong>
            </div>

            <div>
              <span className="text-slate-500 block text-[11px]">অভিভাবকের নাম:</span>
              <strong className="text-slate-900">{student.guardianName || '—'}</strong>
            </div>

            <div className="sm:col-span-2">
              <span className="text-slate-500 block text-[11px]">অভিভাবক মোবাইল:</span>
              <strong className="font-mono text-slate-900">{student.guardianPhone}</strong>
            </div>
          </div>

          {/* Fee Itemized Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-[#0c3664] text-white font-semibold">
                <tr>
                  <th className="py-2.5 px-3">ফি বিবরণ / খাত</th>
                  <th className="py-2.5 px-3 text-center">মাসিক / অধিবেশন</th>
                  <th className="py-2.5 px-3 text-right">নির্ধারিত টাকা</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-2.5 px-3 font-medium">মাসিক টিউশন ফি (Monthly Tuition Fee)</td>
                  <td className="py-2.5 px-3 text-center text-slate-800 font-bold">
                    {student.status === 'paid' ? (student.paidMonth || 'অক্টোবর ২০২৬') : (student.dueMonth || 'অক্টোবর ২০২৬')}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-semibold">৳{student.monthlyFee}</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-medium">পরীক্ষা ও মূল্যায়ন ফি (Exam & Assessment Fee)</td>
                  <td className="py-2.5 px-3 text-center text-slate-600">অর্ধবার্ষিক / চলতি অধিবেশন</td>
                  <td className="py-2.5 px-3 text-right font-mono font-semibold">৳{student.examFee}</td>
                </tr>
                <tr className="bg-slate-50 font-bold text-slate-900">
                  <td className="py-3 px-3">সর্বমোট প্রদেয় ফি:</td>
                  <td className="py-3 px-3 text-center text-slate-500">—</td>
                  <td className="py-3 px-3 text-right font-mono text-base text-[#0c3664]">৳{totalFee}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Payment Status Banner */}
          <div className={`p-4 rounded-xl border flex items-start justify-between gap-3 text-xs ${
            student.status === 'paid'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
              : 'bg-rose-50 border-rose-300 text-rose-950'
          }`}>
            <div className="space-y-1.5">
              <div className="font-bold flex items-center gap-1.5 text-sm">
                {student.status === 'paid' ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>ফি সম্পূর্ণরূপে পরিশোধিত (PAID)</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                    <span>ফি বর্তমানে বকেয়া রয়েছে (FEE DUE)</span>
                  </>
                )}
              </div>

              {student.status === 'paid' ? (
                <div className="text-[11px] text-emerald-900 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-emerald-950">পরিশোধকৃত বেতনের মাস:</span>
                    <span className="bg-emerald-200/80 text-emerald-950 font-extrabold px-2.5 py-0.5 rounded-full text-xs border border-emerald-300">
                      {student.paidMonth || 'অক্টোবর ২০২৬'}
                    </span>
                  </div>
                  <div>জমাকৃত ব্যাংক: <strong>{student.paidBank || 'বাংলাদেশ কৃষি ব্যাংক (নাপোড়া বাজার শাখা)'}</strong></div>
                  <div>ট্রানজাকশন আইডি: <span className="font-mono font-bold">{student.txnId || 'BKB-VERIFIED'}</span></div>
                  <div>পরিশোধের তারিখ: {student.paymentDate || '২০২৬-১০-১২'}</div>
                </div>
              ) : (
                <div className="text-[11px] text-rose-900 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-rose-950">বকেয়া বেতনের মাস:</span>
                    <span className="bg-rose-200/80 text-rose-950 font-extrabold px-2.5 py-0.5 rounded-full text-xs border border-rose-300">
                      {student.dueMonth || 'অক্টোবর ২০২৬'}
                    </span>
                  </div>
                  <div>অনুগ্রহ করে বাংলাদেশ কৃষি ব্যাংক বা আইএফআইসি ব্যাংক নাপোড়া বাজার শাখায় উল্লেখিত ফি দ্রুত জমা দিন।</div>
                </div>
              )}
            </div>

            <div className="text-right">
              <span className={`inline-block px-3 py-1 rounded-lg font-bold text-xs uppercase ${
                student.status === 'paid'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-rose-600 text-white'
              }`}>
                {student.status === 'paid' ? 'অনুমোদিত' : 'অপরিশোধিত'}
              </span>
            </div>
          </div>

          {/* Signatures & Verification */}
          <div className="pt-8 flex items-end justify-between text-xs text-slate-600">
            <div className="text-center space-y-1">
              <div className="w-36 border-b border-slate-400 mx-auto"></div>
              <div className="font-semibold text-slate-800">আদায়কারী / হিসাব সহকারী</div>
              <div className="text-[10px] text-slate-500">নাপোড়া শেখেরখীল উচ্চ বিদ্যালয়</div>
            </div>

            <div className="text-center space-y-1">
              <div className="w-36 border-b border-slate-400 mx-auto"></div>
              <div className="font-bold text-slate-900">জনাব মোঃ জাহাঙ্গীর আলম</div>
              <div className="text-[10px] text-slate-600">প্রধান শিক্ষক ও সদস্য সচিব</div>
            </div>
          </div>

          {/* Footer Barcode */}
          <div className="pt-2 border-t border-slate-200 text-center text-[10px] text-slate-400 flex items-center justify-between">
            <span>কমিউনিটি বিদ্যালয় অনলাইন পোর্টাল দ্বারা স্বয়ংক্রিয় প্রস্তুতকৃত</span>
            <span className="font-mono">VERIFIED #{student.id}</span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* BOTTOM ACTION & BACK BUTTON (Guarantees user can always go back) */}
        {/* ========================================================= */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-200 print:hidden">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center gap-2 transition-colors border border-slate-300"
          >
            <ArrowLeft className="w-4 h-4 text-slate-600" />
            <span>← শিক্ষার্থী তালিকায় ব্যাকে যান</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-5 py-2.5 bg-[#0c3664] hover:bg-[#092b50] text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-xs transition-colors"
          >
            <Printer className="w-4 h-4 text-amber-300" />
            <span>প্রিন্ট রসিদ</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
