import React, { useState } from 'react';
import {
  Send,
  MessageSquare,
  Smartphone,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Users,
  Search,
  Filter,
  RefreshCw,
  History,
  Sparkles,
  PhoneCall
} from 'lucide-react';
import { Student } from '../types';

interface SmsGatewayTabProps {
  students: Student[];
  isAdmin: boolean;
  initialCustomMessage?: string;
}

interface SmsLogItem {
  id: string;
  category: string;
  recipientCount: number;
  messageText: string;
  sentAt: string;
  status: 'delivered' | 'processing';
}

export default function SmsGatewayTab({
  students,
  isAdmin,
  initialCustomMessage = ''
}: SmsGatewayTabProps) {
  const [activeCategory, setActiveCategory] = useState<'fee' | 'absent' | 'exam' | 'custom'>('fee');
  const [recipientFilter, setRecipientFilter] = useState<'all' | 'due' | 'class6' | 'class7' | 'class8' | 'class9' | 'class10'>('due');
  const [customMsg, setCustomMsg] = useState<string>(initialCustomMessage || '');
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState<string>('');

  const [smsLogs, setSmsLogs] = useState<SmsLogItem[]>(() => {
    try {
      const saved = localStorage.getItem('school_sms_dispatch_logs');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'SMS-8901',
        category: 'বকেয়া ফি তাগাদা',
        recipientCount: 42,
        messageText: 'শ্রদ্ধেয় অভিভাবক, নাপোড়া শেখেরখীল উচ্চ বিদ্যালয়ে আপনার সন্তানের অক্টোবর ২০২৬ মাসের ফি বকেয়া রয়েছে। অবিলম্বে কৃষি ব্যাংক বা আইএফআইসি ব্যাংকে জমা দিন।',
        sentAt: '2026-10-30 11:30 AM',
        status: 'delivered'
      },
      {
        id: 'SMS-8902',
        category: 'পরীক্ষার নোটিশ',
        recipientCount: 380,
        messageText: 'জরুরি নোটিশ: আগামী ২৫ অক্টোবর ২০২৬ হতে অর্ধবার্ষিক পরীক্ষা শুরু হবে। প্রবেশপত্র অফিস হতে সংগ্রহ করুন। - প্রধান শিক্ষক',
        sentAt: '2026-10-25 09:15 AM',
        status: 'delivered'
      }
    ];
  });

  // Calculate targeted recipients
  const getTargetRecipients = () => {
    switch (recipientFilter) {
      case 'due':
        return students.filter(s => s.status === 'due');
      case 'class6':
        return students.filter(s => s.className === '6');
      case 'class7':
        return students.filter(s => s.className === '7');
      case 'class8':
        return students.filter(s => s.className === '8');
      case 'class9':
        return students.filter(s => s.className === '9');
      case 'class10':
        return students.filter(s => s.className === '10');
      case 'all':
      default:
        return students;
    }
  };

  const recipients = getTargetRecipients();

  // Template texts
  const getTemplateText = () => {
    switch (activeCategory) {
      case 'fee':
        return 'শ্রদ্ধেয় অভিভাবক, নাপোড়া শেখেরখীল উচ্চ বিদ্যালয়ে আপনার সন্তান {নাম} (রোল: {রোল}, শ্রেণি: {শ্রেণি})-এর চলতি মাসের ফি বকেয়া রয়েছে। অনুগ্রহপূর্বক কৃষি ব্যাংক অথবা আইএফআইসি ব্যাংক নাপোড়া শাখায় জমা প্রদান করুন। - হিসাব শাখা';
      case 'absent':
        return 'শ্রদ্ধেয় অভিভাবক, আপনার সন্তান {নাম} (শ্রেণি: {শ্রেণি}, রোল: {রোল}) আজ বিদ্যালয়ে অনুপস্থিত রয়েছে। অনুপস্থিতির কারণ বিদ্যালয় কর্তৃপক্ষকে জানানোর অনুরোধ করা হলো। - প্রধান শিক্ষক';
      case 'exam':
        return 'জরুরি পরীক্ষা নোটিশ: আগামী ২৫ অক্টোবর ২০২৬ হতে নাপোড়া শেখেরখীল উচ্চ বিদ্যালয়ের অর্ধবার্ষিক পরীক্ষা শুরু হবে। পরীক্ষার প্রবেশপত্র ও রুটিন অফিস হতে সংগ্রহ করুন।';
      case 'custom':
      default:
        return customMsg || 'সম্মানিত অভিভাবক, আগামী শুক্রবার সকাল ১০:০০ টায় বিদ্যালয় মিলনায়তনে অভিভাবক সমাবেশ অনুষ্ঠিত হবে। আপনার উপস্থিতি একান্ত কাম্য।';
    }
  };

  const currentMessageText = activeCategory === 'custom' ? (customMsg || getTemplateText()) : getTemplateText();
  const charCount = currentMessageText.length;
  const smsCount = Math.ceil(charCount / 70) || 1; // Standard Unicode Bengali SMS length

  const handleSendBroadcast = () => {
    if (recipients.length === 0) {
      alert('কোনো প্রাপক নির্বাচিত হয়নি।');
      return;
    }

    setIsSending(true);
    setTimeout(() => {
      const newLog: SmsLogItem = {
        id: `SMS-${Math.floor(1000 + Math.random() * 9000)}`,
        category:
          activeCategory === 'fee'
            ? 'বকেয়া ফি তাগাদা'
            : activeCategory === 'absent'
            ? 'অনুপস্থিতি সতর্কতা'
            : activeCategory === 'exam'
            ? 'পরীক্ষা নোটিশ'
            : 'সাধারণ বিজ্ঞপ্তি',
        recipientCount: recipients.length,
        messageText: currentMessageText,
        sentAt: new Date().toLocaleString('en-US', { hour12: true }),
        status: 'delivered'
      };

      const updated = [newLog, ...smsLogs];
      setSmsLogs(updated);
      try {
        localStorage.setItem('school_sms_dispatch_logs', JSON.stringify(updated));
      } catch {}

      setIsSending(false);
      setSendSuccess(`সফল হয়েছে! মোট ${recipients.length} জন অভিভাবকের মোবাইলে SMS সফলভাবে পাঠানো হয়েছে।`);
      setTimeout(() => setSendSuccess(''), 4000);
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#0c3664] to-[#144275] text-white p-6 rounded-2xl shadow-md border-b-4 border-[#d9482b]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider mb-1">
              <Smartphone className="w-4 h-4" />
              <span>টেলিকম ও অভিভাবক সংযোগ গেটওয়ে</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black">
              SMS গেটওয়ে: নোটিশ, ফি ও হাজিরার তথ্য প্রেরণ
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-2xl">
              অভিভাবকদের মোবাইল নম্বরে স্বয়ংক্রিয়ভাবে বকেয়া ফি তাগাদা, শিক্ষার্থীদের দৈনিক অনুপস্থিতির সতর্কতা এবং পরীক্ষার নোটিশ সরাসরি SMS আকারে পাঠানোর পূর্ণাঙ্গ সিস্টেম।
            </p>
          </div>

          <div className="flex items-center gap-2 bg-emerald-950/80 border border-emerald-400/50 px-3.5 py-2 rounded-xl text-xs font-bold text-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>SMS ব্যালান্স: ৮,৪৫০ টি সক্রিয়</span>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-white/15">
          <button
            type="button"
            onClick={() => {
              setActiveCategory('fee');
              setRecipientFilter('due');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeCategory === 'fee'
                ? 'bg-[#d9482b] text-white shadow-xs'
                : 'bg-black/20 text-slate-200 hover:text-white hover:bg-black/30'
            }`}
          >
            💰 বকেয়া ফি তাগাদা SMS
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveCategory('absent');
              setRecipientFilter('all');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeCategory === 'absent'
                ? 'bg-[#d9482b] text-white shadow-xs'
                : 'bg-black/20 text-slate-200 hover:text-white hover:bg-black/30'
            }`}
          >
            🚨 দৈনিক অনুপস্থিতি অ্যালার্ট SMS
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveCategory('exam');
              setRecipientFilter('all');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeCategory === 'exam'
                ? 'bg-[#d9482b] text-white shadow-xs'
                : 'bg-black/20 text-slate-200 hover:text-white hover:bg-black/30'
            }`}
          >
            📢 পরীক্ষার রুটিন ও জরুরি নোটিশ SMS
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveCategory('custom');
              setRecipientFilter('all');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeCategory === 'custom'
                ? 'bg-[#d9482b] text-white shadow-xs'
                : 'bg-black/20 text-slate-200 hover:text-white hover:bg-black/30'
            }`}
          >
            ✍️ কাস্টম বার্তা ও সমাবেশ SMS
          </button>
        </div>
      </div>

      {sendSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{sendSuccess}</span>
        </div>
      )}

      {/* Main Composer & Mobile Screen Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Configuration & Text Area */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-extrabold text-[#0c3664] flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#d9482b]" />
              <span>মেসেজ কনফিগারেশন ও প্রাপক নির্বাচন</span>
            </h3>

            {/* Recipient Filter */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">প্রাপক গ্রুপ (Recipients)</label>
                <select
                  value={recipientFilter}
                  onChange={e => setRecipientFilter(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-bold text-slate-800 focus:ring-2 focus:ring-[#0c3664] focus:outline-hidden"
                >
                  <option value="due">বকেয়াদার শিক্ষার্থীদের অভিভাবক ({students.filter(s => s.status === 'due').length} জন)</option>
                  <option value="all">সকল শিক্ষার্থীর অভিভাবক ({students.length} জন)</option>
                  <option value="class6">৬ষ্ঠ শ্রেণির অভিভাবক</option>
                  <option value="class7">৭ম শ্রেণির অভিভাবক</option>
                  <option value="class8">৮ম শ্রেণির অভিভাবক</option>
                  <option value="class9">৯ম শ্রেণির অভিভাবক</option>
                  <option value="class10">১০ম শ্রেণির অভিভাবক</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">প্রাপক সংখ্যা</label>
                <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-black text-[#0c3664]">
                  {recipients.length} জন অভিভাবক নির্বাচিত
                </div>
              </div>
            </div>

            {/* Custom Message Area if custom */}
            {activeCategory === 'custom' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  বাংলা বার্তা লিখুন <span className="text-slate-400 font-normal">({'দীঘল বার্তা স্বয়ংক্রিয়ভাবে ২ বা ৩ টি এসএমএস হিসেবে যাবে'})</span>
                </label>
                <textarea
                  rows={4}
                  value={customMsg}
                  onChange={e => setCustomMsg(e.target.value)}
                  placeholder="এখানে আপনার বার্তা লিখুন..."
                  className="w-full p-3 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-[#0c3664] focus:outline-hidden"
                />
              </div>
            )}

            {/* Placeholder info tags */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1">
              <span className="font-bold text-slate-800 block">সিস্টেম ডায়নামিক ভ্যারিয়েবল:</span>
              <div className="flex flex-wrap gap-2 text-[10px]">
                <code className="bg-white px-2 py-0.5 rounded border border-slate-300 text-blue-700 font-mono">
                  {'{নাম}'} → শিক্ষার্থীর নাম
                </code>
                <code className="bg-white px-2 py-0.5 rounded border border-slate-300 text-blue-700 font-mono">
                  {'{রোল}'} → শ্রেণি রোল
                </code>
                <code className="bg-white px-2 py-0.5 rounded border border-slate-300 text-blue-700 font-mono">
                  {'{শ্রেণি}'} → শ্রেণি নাম
                </code>
                <code className="bg-white px-2 py-0.5 rounded border border-slate-300 text-blue-700 font-mono">
                  {'{টাকা}'} → বকেয়া টাকার পরিমাণ
                </code>
              </div>
            </div>

            {/* SMS Stats & Dispatch Button */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100">
              <div className="text-xs text-slate-500">
                অক্ষর: <strong className="text-slate-900">{charCount}</strong> | মোট SMS: <strong className="text-slate-900">{smsCount} টি</strong> প্রতি অভিভাবক
              </div>

              <button
                type="button"
                disabled={isSending || recipients.length === 0}
                onClick={handleSendBroadcast}
                className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-extrabold rounded-xl text-xs shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isSending ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>পাঠানো হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>{recipients.length} জন অভিভাবককে SMS পাঠান</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* SMS Dispatch History Log */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <History className="w-4 h-4 text-[#0c3664]" />
                <span>সাম্প্রতিক পাঠানো SMS লগ হিস্ট্রি</span>
              </div>
              <span className="text-[11px] text-slate-500">মোট {smsLogs.length} টি ক্যাম্পেইন</span>
            </div>

            <div className="divide-y divide-slate-100">
              {smsLogs.map(log => (
                <div key={log.id} className="p-3.5 hover:bg-slate-50/70 transition-colors text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#0c3664]">{log.category}</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.2 rounded-full font-bold">
                        {log.recipientCount} জন সফল
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">{log.sentAt}</span>
                  </div>
                  <p className="text-slate-600 text-[11px] line-clamp-2 leading-relaxed">
                    "{log.messageText}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Mobile Screen Live Mockup */}
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-[#d9482b]" />
              <span>অভিভাবকের ফোনে প্রিভিউ</span>
            </h4>

            {/* Phone Screen Mockup */}
            <div className="mx-auto w-64 bg-slate-900 rounded-[2.5rem] p-3 shadow-xl border-4 border-slate-800">
              {/* Notch */}
              <div className="w-24 h-4 bg-slate-800 rounded-b-xl mx-auto mb-2"></div>

              {/* Screen Area */}
              <div className="bg-[#e5ddd5] rounded-2xl p-3 min-h-[340px] flex flex-col justify-between text-xs space-y-3 font-sans">
                {/* Header */}
                <div className="bg-[#075e54] text-white p-2 rounded-lg text-center shadow-xs">
                  <div className="text-[11px] font-bold">NSH-SCHOOL</div>
                  <div className="text-[9px] text-emerald-200">সরকারি রেজিস্টার্ড প্রেরক আইডি</div>
                </div>

                {/* Message Bubble */}
                <div className="bg-white p-3 rounded-2xl rounded-tl-xs shadow-sm border border-slate-200 text-slate-800 text-[11px] leading-relaxed relative">
                  <p>{currentMessageText}</p>
                  <div className="text-[9px] text-slate-400 text-right mt-1.5 flex items-center justify-end gap-1">
                    <span>এখন</span>
                    <span className="text-blue-500 font-bold">✓✓</span>
                  </div>
                </div>

                {/* Footer simulation */}
                <div className="bg-white/80 p-1.5 rounded-xl text-center text-[9px] text-slate-500 border border-slate-300">
                  নাপোড়া শেখেরখীল উচ্চ বিদ্যালয়
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
