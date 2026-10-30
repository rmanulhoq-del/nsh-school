import React, { useState, useEffect } from 'react';
import {
  X,
  MessageSquare,
  Send,
  Phone,
  Copy,
  Check,
  Printer,
  FileText,
  Sparkles,
  Clock,
  Share2,
  Calendar,
  ArrowLeft
} from 'lucide-react';
import { formatClassBangla, formatClassOrdinal } from '../types';

export interface StudentDataForDispatch {
  id: string;
  name: string;
  className: string;
  section: string;
  roll: number;
  gender?: 'male' | 'female';
  group?: 'science' | 'humanities' | 'business';
  guardianName: string;
  guardianPhone: string;
  monthlyFee: number;
  examFee: number;
  status: 'paid' | 'due';
  paidBank?: string;
  txnId?: string;
  paymentDate?: string;
  paidMonth?: string;
  dueMonth?: string;
}

interface GuardianDispatchModalProps {
  student: StudentDataForDispatch;
  isOpen: boolean;
  onClose: () => void;
  onOpenSlip?: (student: StudentDataForDispatch) => void;
}

export type MessageTemplateType = 'fee_due' | 'fee_paid' | 'result' | 'attendance' | 'custom';

export default function GuardianDispatchModal({
  student,
  isOpen,
  onClose,
  onOpenSlip
}: GuardianDispatchModalProps) {
  const schoolName = 'নাপোড়া শেখেরখীল উচ্চ বিদ্যালয়';
  const totalFee = (student.monthlyFee || 0) + (student.examFee || 0);

  const [selectedTemplate, setSelectedTemplate] = useState<MessageTemplateType>(
    student.status === 'due' ? 'fee_due' : 'fee_paid'
  );
  const [feeMonthInput, setFeeMonthInput] = useState<string>(student.paidMonth || student.dueMonth || 'অক্টোবর ২০২৬');
  const [guardianPhoneInput, setGuardianPhoneInput] = useState(student.guardianPhone || '');
  const [copied, setCopied] = useState(false);
  const [customSubject, setCustomSubject] = useState('সাধারণ জরুরি নোটিশ');
  const [resultGpa, setResultGpa] = useState('GPA 4.85 (A Grade)');
  const [examName, setExamName] = useState('অর্ধবার্ষিক মূল্যায়ন ২০২৪');
  const [customNote, setCustomNote] = useState('');
  const [recentDispatches, setRecentDispatches] = useState<Array<{ date: string; channel: string; text: string }>>(() => {
    try {
      const stored = localStorage.getItem(`guardian_dispatch_${student.id}`);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Generate dynamic message content based on template
  const generateMessageText = (): string => {
    switch (selectedTemplate) {
      case 'fee_due':
        return `শ্রদ্ধেয় অভিভাবক (${student.guardianName || 'অভিভাবক'}),\n` +
          `নাপোড়া শেখেরখীল উচ্চ বিদ্যালয় থেকে জানানো যাচ্ছে:\n` +
          `শিক্ষার্থীর নাম: ${student.name} (${formatClassBangla(student.className)} | শাখা: ${student.section} | রোল: ${student.roll} | আইডি: ${student.id})\n\n` +
          `বকেয়া বেতনের মাস: ${feeMonthInput}\n` +
          `আপনার সন্তানের ${feeMonthInput} মাসের বকেয়া বেতন ও পরীক্ষার ফি বাবদ মোট ৳${totalFee} বকেয়া রয়েছে (মাসিক বেতন: ৳${student.monthlyFee} + পরীক্ষা ফি: ৳${student.examFee})।\n\n` +
          `অনুগ্রহ করে বাংলাদেশ কৃষি ব্যাংক (নাপোড়া বাজার শাখা) অথবা আইএফআইসি ব্যাংক (নাপোড়া বাজার উপশাখা)-এ নির্ধারিত একাউন্টে ফি জমা দেওয়ার জন্য বিনীত অনুরোধ করা হলো।\n\n` +
          `— জনাব মোঃ জাহাঙ্গীর আলম (প্রধান শিক্ষক), ${schoolName} (EIIN: 104062)`;

      case 'fee_paid':
        return `শ্রদ্ধেয় অভিভাবক (${student.guardianName || 'অভিভাবক'}),\n` +
          `শুভেচ্ছা গ্রহণ করুন। নাপোড়া শেখেরখীল উচ্চ বিদ্যালয় থেকে জানানো যাচ্ছে:\n` +
          `শিক্ষার্থীর নাম: ${student.name} (${formatClassBangla(student.className)} | শাখা: ${student.section} | রোল: ${student.roll})\n\n` +
          `পরিশোধকৃত বেতনের মাস: ${feeMonthInput}\n` +
          `পরিশোধিত টাকার পরিমাণ: মোট ৳${totalFee} (মাসিক বেতন: ৳${student.monthlyFee} + পরীক্ষা ফি: ৳${student.examFee})\n` +
          `জমাকৃত ব্যাংক: ${student.paidBank || 'বাংলাদেশ কৃষি ব্যাংক (নাপোড়া বাজার শাখা)'}\n` +
          `ব্যাংক ট্রানজাকশন / স্লিপ আইডি: ${student.txnId || 'BKB-VERIFIED'}\n` +
          `পরিশোধের তারিখ: ${student.paymentDate || new Date().toLocaleDateString('bn-BD')}\n` +
          `স্ট্যাটাস: সফলভাবে অনুমোদিত ও পরিশোধিত (PAID)\n\n` +
          `ডিজিটাল ব্যবস্থার মাধ্যমে নিয়মিত ফি পরিশোধের জন্য আপনাকে আন্তরিক ধন্যবাদ।\n` +
          `— জনাব মোঃ জাহাঙ্গীর আলম (প্রধান শিক্ষক) ও হিসাব শাখা, ${schoolName}`;

      case 'result':
        return `শ্রদ্ধেয় অভিভাবক (${student.guardianName || 'অভিভাবক'}),\n` +
          `${schoolName}-এর ${examName}-এর ফলাফল প্রকাশিত হয়েছে।\n` +
          `শিক্ষার্থীর নাম: ${student.name}\n` +
          `${formatClassBangla(student.className)} | শাখা: ${student.section} | রোল: ${student.roll}\n` +
          `অর্জিত ফলাফল: ${resultGpa}\n\n` +
          `আপনার সন্তানের প্রগ্রেসিভ মার্কশিট ও মূল রিপোর্ট কার্ড বিদ্যালয় কার্যালয়ে সংরক্ষিত রয়েছে। সন্তানের নিয়মিত পড়াশোনায় সজাগ দৃষ্টি রাখার অনুরোধ করা হলো।\n` +
          `— পরীক্ষা কমিটি, ${schoolName}`;

      case 'attendance':
        return `শ্রদ্ধেয় অভিভাবক (${student.guardianName || 'অভিভাবক'}),\n` +
          `${schoolName} থেকে জানানো যাচ্ছে যে, আপনার সন্তান ${student.name} (${formatClassBangla(student.className)}, রোল: ${student.roll})-এর নিয়মিত উপস্থিতি ও ক্লাসের অগ্রগতি বিষয়ে অবহিত করা হচ্ছে।\n` +
          `${customNote ? `বিশেষ দ্রষ্টব্য: ${customNote}\n\n` : ''}` +
          `যেকোনো জিজ্ঞাসায় শ্রেণি শিক্ষকের সাথে যোগাযোগ করুন।\n` +
          `— ${schoolName}`;

      case 'custom':
        return `শ্রদ্ধেয় অভিভাবক (${student.guardianName || 'অভিভাবক'}),\n` +
          `বিষয়: ${customSubject}\n\n` +
          `শিক্ষার্থীর নাম: ${student.name} (${formatClassBangla(student.className)}, রোল: ${student.roll}, আইডি: ${student.id})\n\n` +
          `${customNote || 'বিদ্যালয়ের বিশেষ নোটিশ বা নির্দেশনা সম্পর্কে আপনাকে অবহিত করা হলো।'}\n\n` +
          `— কার্যালয়, ${schoolName}`;
    }
  };

  const messageText = generateMessageText();

  // Clean phone number for WhatsApp / SMS
  const cleanPhoneForWhatsApp = (rawPhone: string): string => {
    const digits = rawPhone.replace(/\D/g, '');
    if (digits.startsWith('880')) return digits;
    if (digits.startsWith('0')) return '88' + digits;
    return '880' + digits;
  };

  const cleanPhoneForSMS = (rawPhone: string): string => {
    return rawPhone.replace(/\D/g, '');
  };

  // Record dispatch in history
  const logDispatch = (channel: string) => {
    const entry = {
      date: new Date().toLocaleString('bn-BD'),
      channel,
      text: messageText.slice(0, 100) + '...'
    };
    const updated = [entry, ...recentDispatches].slice(0, 5);
    setRecentDispatches(updated);
    try {
      localStorage.setItem(`guardian_dispatch_${student.id}`, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  // Actions
  const handleOpenWhatsApp = () => {
    logDispatch('WhatsApp');
    const waNumber = cleanPhoneForWhatsApp(guardianPhoneInput);
    const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(messageText)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleOpenSMS = () => {
    logDispatch('SMS');
    const smsNumber = cleanPhoneForSMS(guardianPhoneInput);
    const smsUrl = `sms:${smsNumber}?body=${encodeURIComponent(messageText)}`;
    window.location.href = smsUrl;
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-start justify-center p-3 sm:p-6 overflow-y-auto"
    >
      <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl border border-slate-200 space-y-5 relative my-4 sm:my-6 animate-in fade-in zoom-in-95 duration-150">
        {/* Top Control Bar with Back Button */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors border border-slate-200"
          >
            <ArrowLeft className="w-4 h-4 text-slate-600" />
            <span>← ব্যাকে যান (Back)</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            title="বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Header */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl flex items-center justify-center shrink-0">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold mb-1">
              <Share2 className="w-3 h-3" />
              <span>অভিভাবক যোগাযোগ ও নোটিফিকেশন সিস্টেম</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 leading-snug">
              মোবাইলে তথ্য ও রেজাল্ট / ফি বার্তা প্রেরণ
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              অভিভাবকের নম্বরে ১-ক্লিকে হোয়াটসঅ্যাপ, এসএমএস বা রসিদ এটাচমেন্ট পাঠান
            </p>
          </div>
        </div>

        {/* Student Quick Bio Card */}
        <div className="p-4 bg-[#f0f6f6] border border-[#d2e5e7] rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="space-y-1">
            <div className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <span>{student.name}</span>
              <span className="font-mono text-[11px] bg-white px-2 py-0.5 rounded border border-[#d2e5e7] text-slate-600">
                {student.id}
              </span>
            </div>
            <div className="text-slate-600">
              শ্রেণি: <strong>{formatClassBangla(student.className)}</strong> · শাখা: <strong>{student.section}</strong> · রোল: <strong>{student.roll}</strong>
            </div>
            <div className="text-slate-600">
              অভিভাবক: <strong>{student.guardianName || 'নাম উল্লেখ নেই'}</strong>
            </div>
          </div>

          <div className="text-right space-y-1">
            <div>
              <span className="text-slate-500 text-[11px]">নির্ধারিত ফি: </span>
              <strong className="font-mono text-sm text-slate-900">৳{totalFee}</strong>
            </div>
            <span
              className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                student.status === 'paid'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-100 text-rose-800 border border-rose-200'
              }`}
            >
              {student.status === 'paid' ? 'পরিশোধিত (Paid)' : 'বকেয়া (Fee Due)'}
            </span>
          </div>
        </div>

        {/* Guardian Mobile Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#0c3664]" />
              <span>অভিভাবকের মোবাইল নম্বর (প্রয়োজনে পরিবর্তনযোগ্য):</span>
            </span>
            <span className="text-[11px] text-slate-400 font-mono">বাংলাদেশ কোড (+880) স্বয়ংক্রিয় যুক্ত হবে</span>
          </label>
          <input
            type="tel"
            value={guardianPhoneInput}
            onChange={(e) => setGuardianPhoneInput(e.target.value)}
            placeholder="যেমন: 01711234567 বা 01812987654"
            className="w-full px-3.5 py-2.5 bg-white border border-[#d2e5e7] rounded-xl text-sm font-mono font-bold text-slate-900 focus:outline-none focus:border-[#0c3664]"
          />
        </div>

        {/* Message Template Selection Buttons */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>বার্তা বা নোটিশের বিষয় নির্বাচন করুন:</span>
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
            <button
              type="button"
              onClick={() => setSelectedTemplate('fee_due')}
              className={`p-2.5 rounded-xl border text-center font-semibold transition-all ${
                selectedTemplate === 'fee_due'
                  ? 'bg-[#d9482b] text-white border-[#d9482b] shadow-xs'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
              }`}
            >
              ⚠️ বকেয়া ফি তাগাদা
            </button>

            <button
              type="button"
              onClick={() => setSelectedTemplate('fee_paid')}
              className={`p-2.5 rounded-xl border text-center font-semibold transition-all ${
                selectedTemplate === 'fee_paid'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
              }`}
            >
              ✅ ফি প্রাপ্তি নিশ্চিতকরণ
            </button>

            <button
              type="button"
              onClick={() => setSelectedTemplate('result')}
              className={`p-2.5 rounded-xl border text-center font-semibold transition-all ${
                selectedTemplate === 'result'
                  ? 'bg-[#0c3664] text-white border-[#0c3664] shadow-xs'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
              }`}
            >
              📊 পরীক্ষার ফলাফল/রেজাল্ট
            </button>

            <button
              type="button"
              onClick={() => setSelectedTemplate('attendance')}
              className={`p-2.5 rounded-xl border text-center font-semibold transition-all ${
                selectedTemplate === 'attendance'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
              }`}
            >
              📅 উপস্থিতি ও সভা
            </button>

            <button
              type="button"
              onClick={() => setSelectedTemplate('custom')}
              className={`p-2.5 rounded-xl border text-center font-semibold transition-all ${
                selectedTemplate === 'custom'
                  ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
              }`}
            >
              ✏️ কাস্টম বার্তা
            </button>
          </div>
        </div>

        {/* Dynamic Month Selection for Fee Paid or Fee Due */}
        {(selectedTemplate === 'fee_due' || selectedTemplate === 'fee_paid') && (
          <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-2 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="font-bold text-slate-800 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-700" />
                <span>{selectedTemplate === 'fee_paid' ? 'পরিশোধিত বেতনের মাস নির্বাচন / পরিবর্তন:' : 'বকেয়া বেতনের মাস নির্বাচন / পরিবর্তন:'}</span>
              </label>
              <span className="text-[11px] bg-white px-2.5 py-0.5 rounded-full text-emerald-800 font-bold border border-emerald-300 font-mono">
                {feeMonthInput}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[
                'জানুয়ারি ২০২৬', 'ফেব্রুয়ারি ২০২৬', 'মার্চ ২০২৬', 'এপ্রিল ২০২৬',
                'মে ২০২৬', 'জুন ২০২৬', 'জুলাই ২০২৬', 'আগস্ট ২০২৬',
                'সেপ্টেম্বর ২০২৬', 'অক্টোবর ২০২৬', 'নভেম্বর ২০২৬', 'ডিসেম্বর ২০২৬'
              ].map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setFeeMonthInput(m)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
                    feeMonthInput === m
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-2xs font-bold'
                      : 'bg-white hover:bg-emerald-100 text-slate-700 border-slate-200'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Dynamic Fields for Result or Custom Template */}
        {selectedTemplate === 'result' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-blue-50/60 border border-blue-200 rounded-2xl text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">পরীক্ষার নাম:</label>
              <input
                type="text"
                value={examName}
                onChange={(e) => setExamName(e.target.value)}
                placeholder="যেমন: অর্ধবার্ষিক পরীক্ষা ২০২৪"
                className="w-full px-3 py-1.5 bg-white border border-blue-300 rounded-lg text-slate-900"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">প্রাপ্ত গ্রেড / জিপিএ:</label>
              <input
                type="text"
                value={resultGpa}
                onChange={(e) => setResultGpa(e.target.value)}
                placeholder="যেমন: GPA 5.00 বা A+"
                className="w-full px-3 py-1.5 bg-white border border-blue-300 rounded-lg text-slate-900 font-bold"
              />
            </div>
          </div>
        )}

        {(selectedTemplate === 'attendance' || selectedTemplate === 'custom') && (
          <div className="p-3 bg-purple-50/60 border border-purple-200 rounded-2xl space-y-2 text-xs">
            {selectedTemplate === 'custom' && (
              <div>
                <label className="font-semibold text-slate-700 block mb-1">বার্তার শিরোনাম:</label>
                <input
                  type="text"
                  value={customSubject}
                  onChange={(e) => setCustomSubject(e.target.value)}
                  placeholder="যেমন: জরুরি অভিভাবক সম্মেলন নোটিশ"
                  className="w-full px-3 py-1.5 bg-white border border-purple-300 rounded-lg text-slate-900 font-medium"
                />
              </div>
            )}
            <div>
              <label className="font-semibold text-slate-700 block mb-1">বিস্তারিত বার্তা / অতিরিক্ত নোট:</label>
              <textarea
                rows={2}
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                placeholder="অভিভাবকের উদ্দেশ্যে প্রয়োজনীয় তথ্য এখানে লিখুন..."
                className="w-full p-2.5 bg-white border border-purple-300 rounded-lg text-slate-900"
              />
            </div>
          </div>
        )}

        {/* Message Preview Box */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <span className="flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              <span>প্রেরণযোগ্য বার্তা প্রিভিউ:</span>
            </span>
            <button
              type="button"
              onClick={handleCopyText}
              className="text-[#0c3664] hover:text-[#092b50] flex items-center gap-1 transition-colors font-medium text-[11px]"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">কপি হয়েছে!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>কপি করুন</span>
                </>
              )}
            </button>
          </div>

          <div className="p-4 bg-[#f8fafc] border border-slate-200 rounded-2xl font-mono text-xs text-slate-800 whitespace-pre-line leading-relaxed max-h-48 overflow-y-auto">
            {messageText}
          </div>
        </div>

        {/* Action Buttons: WhatsApp / SMS / Attachment Slip */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* WhatsApp Send Button */}
            <button
              type="button"
              onClick={handleOpenWhatsApp}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2.5 text-sm"
            >
              <MessageSquare className="w-4 h-4 fill-white" />
              <span>WhatsApp-এ সরাসরি পাঠান</span>
            </button>

            {/* Standard SMS Button */}
            <button
              type="button"
              onClick={handleOpenSMS}
              className="w-full py-3 px-4 bg-[#0c3664] hover:bg-[#092b50] text-white font-bold rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2.5 text-sm"
            >
              <Send className="w-4 h-4" />
              <span>মোবাইল SMS অ্যাপে পাঠান</span>
            </button>
          </div>

          {/* Slip Attachment Option */}
          <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-start gap-2.5">
              <Printer className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block">
                  এটাচমেন্ট অপশন: ডিজিটাল ফি রসিদ ও রিপোর্ট কার্ড
                </span>
                <span className="text-slate-600 text-[11px]">
                  অভিভাবকের কাছে ইমেজ/পিডিএফ পাঠাতে শিক্ষার্থীর অফিসিয়াল স্লিপ প্রিন্ট বা সেভ করুন
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                if (onOpenSlip) {
                  onOpenSlip(student);
                } else {
                  window.print();
                }
              }}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl transition-colors shrink-0 flex items-center gap-1.5 shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>স্লিপ দেখুন ও প্রিন্ট করুন</span>
            </button>
          </div>
        </div>

        {/* Bottom Back Button */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>← ব্যাকে যান / বন্ধ করুন</span>
          </button>

          {/* History of recent sends */}
          {recentDispatches.length > 0 && (
            <div className="text-[11px] text-slate-500 flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>সর্বশেষ: {recentDispatches[0].date}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
