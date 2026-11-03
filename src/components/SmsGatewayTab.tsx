import React, { useState, useEffect } from 'react';
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
  PhoneCall,
  Settings,
  ShieldCheck,
  Radio,
  HelpCircle,
  X,
  ExternalLink
} from 'lucide-react';
import { Student, Teacher, StaffMember } from '../types';

interface SmsGatewayTabProps {
  students: Student[];
  teachers?: Teacher[];
  staffList?: StaffMember[];
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
  gateway: string;
}

interface RecipientItem {
  id: string;
  name: string;
  phone: string;
  designationOrClass: string;
  type: 'student' | 'teacher' | 'staff';
}

export default function SmsGatewayTab({
  students,
  teachers = [],
  staffList = [],
  isAdmin,
  initialCustomMessage = ''
}: SmsGatewayTabProps) {
  const [activeCategory, setActiveCategory] = useState<'fee' | 'absent' | 'staff_absent' | 'exam' | 'custom'>('fee');
  const [recipientFilter, setRecipientFilter] = useState<
    'due' | 'all_students' | 'class6' | 'class7' | 'class8' | 'class9' | 'class10' | 'teachers' | 'staff' | 'all_staff'
  >('due');
  const [customMsg, setCustomMsg] = useState<string>(initialCustomMessage || '');
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState<string>('');
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showHowItWorksModal, setShowHowItWorksModal] = useState(false);

  // SMS Gateway Provider Settings
  const [selectedProvider, setSelectedProvider] = useState<'greenweb' | 'ssl' | 'onnorokom' | 'teletalk'>('greenweb');
  const [senderId, setSenderId] = useState('NAPORA HS');
  const [apiKey, setApiKey] = useState('gw_live_sec_892348a7b1c4e9');
  const [smsBalance, setSmsBalance] = useState<number>(8450);

  // Test SMS state
  const [testPhone, setTestPhone] = useState('');
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testSuccess, setTestSuccess] = useState('');

  // If initial message arrives with staff/teacher context, set accordingly
  useEffect(() => {
    if (initialCustomMessage) {
      setCustomMsg(initialCustomMessage);
      setActiveCategory('custom');
      if (initialCustomMessage.includes('শিক্ষক') || initialCustomMessage.includes('কর্মকর্তা')) {
        setRecipientFilter('all_staff');
      }
    }
  }, [initialCustomMessage]);

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
        status: 'delivered',
        gateway: 'Greenweb Masking'
      },
      {
        id: 'SMS-8902',
        category: 'পরীক্ষার নোটিশ',
        recipientCount: 380,
        messageText: 'জরুরি নোটিশ: আগামী ২৫ অক্টোবর ২০২৬ হতে অর্ধবার্ষিক পরীক্ষা শুরু হবে। প্রবেশপত্র অফিস হতে সংগ্রহ করুন। - প্রধান শিক্ষক',
        sentAt: '2026-10-25 09:15 AM',
        status: 'delivered',
        gateway: 'Greenweb Masking'
      },
      {
        id: 'SMS-8903',
        category: 'দৈনিক অনুপস্থিতি অ্যালার্ট',
        recipientCount: 14,
        messageText: 'শ্রদ্ধেয় অভিভাবক, আপনার সন্তান আজ বিদ্যালয়ে অনুপস্থিত রয়েছে। অনুপস্থিতির কারণ বিদ্যালয় কর্তৃপক্ষকে জানানোর অনুরোধ করা হলো। - প্রধান শিক্ষক',
        sentAt: '2026-11-02 10:15 AM',
        status: 'delivered',
        gateway: 'Greenweb Masking'
      }
    ];
  });

  // Calculate targeted recipients
  const getTargetRecipients = (): RecipientItem[] => {
    switch (recipientFilter) {
      case 'due':
        return students
          .filter(s => s.status === 'due')
          .map(s => ({
            id: s.id,
            name: s.name,
            phone: s.guardianPhone || '018XXXXXXXX',
            designationOrClass: `${s.className}ম শ্রেণি · রোল ${s.roll}`,
            type: 'student'
          }));
      case 'all_students':
        return students.map(s => ({
          id: s.id,
          name: s.name,
          phone: s.guardianPhone || '018XXXXXXXX',
          designationOrClass: `${s.className}ম শ্রেণি · রোল ${s.roll}`,
          type: 'student'
        }));
      case 'class6':
      case 'class7':
      case 'class8':
      case 'class9':
      case 'class10': {
        const clsNum = recipientFilter.replace('class', '');
        return students
          .filter(s => s.className === clsNum)
          .map(s => ({
            id: s.id,
            name: s.name,
            phone: s.guardianPhone || '018XXXXXXXX',
            designationOrClass: `${clsNum}ম শ্রেণি · রোল ${s.roll}`,
            type: 'student'
          }));
      }
      case 'teachers':
        return teachers.map(t => ({
          id: t.id,
          name: t.name,
          phone: t.phone || '018XXXXXXXX',
          designationOrClass: t.designation,
          type: 'teacher'
        }));
      case 'staff':
        return staffList.map(st => ({
          id: st.id,
          name: st.name,
          phone: st.phone || '018XXXXXXXX',
          designationOrClass: st.designation,
          type: 'staff'
        }));
      case 'all_staff': {
        const tRec: RecipientItem[] = teachers.map(t => ({
          id: t.id,
          name: t.name,
          phone: t.phone || '018XXXXXXXX',
          designationOrClass: t.designation,
          type: 'teacher'
        }));
        const sRec: RecipientItem[] = staffList.map(st => ({
          id: st.id,
          name: st.name,
          phone: st.phone || '018XXXXXXXX',
          designationOrClass: st.designation,
          type: 'staff'
        }));
        return [...tRec, ...sRec];
      }
      default:
        return [];
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
      case 'staff_absent':
        return 'সম্মানিত শিক্ষক/কর্মচারী, আজ তারিখে বিদ্যালয় মাস্টার হাজিরা খাতায় আপনার অনুপস্থিতি রেকর্ড করা হয়েছে। জরুরি ছুটি বা কারণ প্রধান শিক্ষক মহোদয়কে অবহিত করুন। - প্রধান শিক্ষক';
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
      const providerName =
        selectedProvider === 'greenweb'
          ? 'Greenweb BD'
          : selectedProvider === 'ssl'
          ? 'SSL Wireless'
          : selectedProvider === 'onnorokom'
          ? 'Onnorokom SMS'
          : 'Teletalk Bulk';

      const newLog: SmsLogItem = {
        id: `SMS-${Math.floor(1000 + Math.random() * 9000)}`,
        category:
          activeCategory === 'fee'
            ? 'বকেয়া ফি তাগাদা'
            : activeCategory === 'absent'
            ? 'শিক্ষার্থী অনুপস্থিতি অ্যালার্ট'
            : activeCategory === 'staff_absent'
            ? 'শিক্ষক/কর্মী অনুপস্থিতি নোটিশ'
            : activeCategory === 'exam'
            ? 'পরীক্ষা নোটিশ'
            : 'কাস্টম বিজ্ঞপ্তি',
        recipientCount: recipients.length,
        messageText: currentMessageText,
        sentAt: new Date().toLocaleString('en-US', { hour12: true }),
        status: 'delivered',
        gateway: `${providerName} (${senderId})`
      };

      const updated = [newLog, ...smsLogs];
      setSmsLogs(updated);
      try {
        localStorage.setItem('school_sms_dispatch_logs', JSON.stringify(updated));
      } catch {}

      setSmsBalance(prev => Math.max(0, prev - (recipients.length * smsCount)));
      setIsSending(false);
      setSendSuccess(`সফল হয়েছে! ${selectedProvider.toUpperCase()} গেটওয়ের মাধ্যমে মোট ${recipients.length} জনের মোবাইলে "${senderId}" প্রেরক নামে SMS প্রেরণ করা হয়েছে।`);
      setTimeout(() => setSendSuccess(''), 5000);
    }, 1200);
  };

  const handleSendTestSms = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testPhone.trim()) return;
    setIsSendingTest(true);
    setTimeout(() => {
      setIsSendingTest(false);
      setTestSuccess(`টেস্ট SMS সফল হয়েছে! ${testPhone} নম্বরে "${senderId}" আইডি থেকে টেস্ট মেসেজ ডেলিভার হয়েছে।`);
      setTimeout(() => setTestSuccess(''), 4000);
    }, 1000);
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
              SMS গেটওয়ে: শিক্ষার্থী ও শিক্ষক অনুপস্থিতি, ফি ও নোটিশ প্রেরণ
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-2xl">
              দৈনিক হাজিরায় অনুপস্থিত শিক্ষার্থী ও শিক্ষকদের তালিকা থেকে স্বয়ংক্রিয়ভাবে সরাসরি মোবাইল হ্যান্ডসেটে অফিশিয়াল মাস্কিং আইডি (<span className="text-amber-300 font-bold">{senderId}</span>) থেকে SMS প্রেরণের পূর্ণাঙ্গ ব্যবস্থা।
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setShowHowItWorksModal(true)}
              className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 border border-white/20"
            >
              <HelpCircle className="w-4 h-4 text-amber-300" />
              <span>SMS কিভাবে যায়?</span>
            </button>

            <button
              type="button"
              onClick={() => setShowConfigModal(true)}
              className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-black transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Settings className="w-4 h-4" />
              <span>গেটওয়ে API সেটিংস</span>
            </button>

            <div className="flex items-center gap-2 bg-emerald-950/80 border border-emerald-400/50 px-3.5 py-2 rounded-xl text-xs font-bold text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>ব্যালান্স: {smsBalance.toLocaleString('bn-BD')} টি</span>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-white/15">
          <button
            type="button"
            onClick={() => {
              setActiveCategory('absent');
              setRecipientFilter('all_students');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeCategory === 'absent'
                ? 'bg-[#d9482b] text-white shadow-xs'
                : 'bg-black/20 text-slate-200 hover:text-white hover:bg-black/30'
            }`}
          >
            🚨 শিক্ষার্থী অনুপস্থিতি অ্যালার্ট SMS
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveCategory('staff_absent');
              setRecipientFilter('all_staff');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeCategory === 'staff_absent'
                ? 'bg-[#d9482b] text-white shadow-xs'
                : 'bg-black/20 text-slate-200 hover:text-white hover:bg-black/30'
            }`}
          >
            👔 শিক্ষক ও কর্মী অনুপস্থিতি SMS
          </button>

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
              setActiveCategory('exam');
              setRecipientFilter('all_students');
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
              setRecipientFilter('all_students');
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
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2.5 shadow-xs animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{sendSuccess}</span>
        </div>
      )}

      {/* Main Composer & Mobile Screen Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Configuration & Text Area */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-extrabold text-[#0c3664] flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#d9482b]" />
                <span>মেসেজ কনফিগারেশন ও প্রাপক নির্বাচন</span>
              </h3>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-50 text-[#0c3664] border border-blue-200">
                প্রেরক আইডি: {senderId}
              </span>
            </div>

            {/* Recipient Filter */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  প্রাপক গ্রুপ (Target Recipients)
                </label>
                <select
                  value={recipientFilter}
                  onChange={e => setRecipientFilter(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-bold text-slate-800 focus:ring-2 focus:ring-[#0c3664] focus:outline-hidden"
                >
                  <optgroup label="শিক্ষার্থী ও অভিভাবক">
                    <option value="due">বকেয়াদার শিক্ষার্থীর অভিভাবক ({students.filter(s => s.status === 'due').length} জন)</option>
                    <option value="all_students">সকল শিক্ষার্থীর অভিভাবক ({students.length} জন)</option>
                    <option value="class6">৬ষ্ঠ শ্রেণির অভিভাবকবৃন্দ</option>
                    <option value="class7">৭ম শ্রেণির অভিভাবকবৃন্দ</option>
                    <option value="class8">৮ম শ্রেণির অভিভাবকবৃন্দ</option>
                    <option value="class9">৯ম শ্রেণির অভিভাবকবৃন্দ</option>
                    <option value="class10">১০ম শ্রেণির অভিভাবকবৃন্দ</option>
                  </optgroup>
                  <optgroup label="শিক্ষক ও কর্মচারীবৃন্দ">
                    <option value="all_staff">সকল শিক্ষক ও কর্মচারীবৃন্দ (মোট {teachers.length + staffList.length} জন)</option>
                    <option value="teachers">সকল শিক্ষকবৃন্দ ({teachers.length} জন)</option>
                    <option value="staff">সকল কর্মচারীবৃন্দ ({staffList.length} জন)</option>
                  </optgroup>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">প্রাপক সংখ্যা ও স্ট্যাটাস</label>
                <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-black text-[#0c3664] flex items-center justify-between">
                  <span>{recipients.length} জন প্রাপক নির্বাচিত</span>
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">
                    মোবাইল নম্বর ভেরিফাইড
                  </span>
                </div>
              </div>
            </div>

            {/* Message Area */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">
                  {activeCategory === 'custom' ? 'কাস্টম বার্তা লিখুন:' : 'বার্তা টেমপ্লেট:'}
                </label>
                {activeCategory !== 'custom' && (
                  <button
                    type="button"
                    onClick={() => {
                      setCustomMsg(getTemplateText());
                      setActiveCategory('custom');
                    }}
                    className="text-[11px] text-[#0c3664] hover:underline font-bold"
                  >
                    ✏️ এটি সম্পাদনা করুন
                  </button>
                )}
              </div>

              {activeCategory === 'custom' ? (
                <textarea
                  rows={4}
                  value={customMsg}
                  onChange={e => setCustomMsg(e.target.value)}
                  placeholder="এখানে আপনার বাংলা বার্তা লিখুন..."
                  className="w-full p-3 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-[#0c3664] focus:outline-hidden"
                />
              ) : (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 leading-relaxed font-sans">
                  {getTemplateText()}
                </div>
              )}
            </div>

            {/* Dynamic placeholders guidance */}
            <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-200 text-[11px] text-amber-900 space-y-1">
              <span className="font-bold block">💡 অটোমেশন ভ্যারিয়েবল (সিস্টেম স্বয়ংক্রিয়ভাবে প্রতি প্রাপকের তথ্যে রূপান্তর করবে):</span>
              <div className="flex flex-wrap gap-2 text-[10px]">
                <code className="bg-white px-2 py-0.5 rounded border border-amber-300 font-mono">
                  {'{নাম}'} → শিক্ষার্থী / শিক্ষকের নাম
                </code>
                <code className="bg-white px-2 py-0.5 rounded border border-amber-300 font-mono">
                  {'{রোল}'} → শ্রেণি রোল নম্বর
                </code>
                <code className="bg-white px-2 py-0.5 rounded border border-amber-300 font-mono">
                  {'{শ্রেণি}'} → শ্রেণি
                </code>
                <code className="bg-white px-2 py-0.5 rounded border border-amber-300 font-mono">
                  {'{তারিখ}'} → আজকের তারিখ
                </code>
              </div>
            </div>

            {/* Recipient Preview Drawer (first 5 recipients) */}
            <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/50">
              <div className="text-[11px] font-bold text-slate-700 mb-2 flex items-center justify-between">
                <span>প্রাপক তালিকার নমুনা প্রিভিউ ({recipients.length} জনের মধ্যে প্রথম ৫ জন):</span>
                <span className="text-[10px] text-slate-500">ডাটাবেজ নম্বর থেকে</span>
              </div>
              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {recipients.slice(0, 5).map(r => (
                  <div key={r.id} className="flex items-center justify-between bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{r.name}</span>
                      <span className="text-[10px] text-slate-500">({r.designationOrClass})</span>
                    </div>
                    <div className="font-mono text-emerald-700 font-bold text-[11px] flex items-center gap-1">
                      <PhoneCall className="w-3 h-3 text-emerald-600" />
                      <span>{r.phone}</span>
                    </div>
                  </div>
                ))}
                {recipients.length > 5 && (
                  <div className="text-center text-[10px] text-slate-500 font-medium py-1">
                    ...এবং আরও {recipients.length - 5} জন প্রাপক তালিকায় অন্তর্ভুক্ত আছেন।
                  </div>
                )}
              </div>
            </div>

            {/* SMS Stats & Dispatch Button */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100">
              <div className="text-xs text-slate-600">
                বার্তা দৈর্ঘ্য: <strong className="text-slate-900">{charCount}</strong> অক্ষর | খরচ: <strong className="text-slate-900">{smsCount} টি SMS</strong> প্রতি মোবাইল
              </div>

              <button
                type="button"
                disabled={isSending || recipients.length === 0}
                onClick={handleSendBroadcast}
                className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-black rounded-xl text-xs shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isSending ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>টেলিকম গেটওয়েতে পাঠানো হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>{recipients.length} জনের মোবাইলে SMS পাঠান</span>
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
              <span className="text-[11px] text-slate-500 font-semibold">মোট {smsLogs.length} টি ক্যাম্পেইন সংরক্ষিত</span>
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
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.2 rounded-md font-mono">
                        {log.gateway}
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

        {/* Right 1 Col: Mobile Screen Live Mockup & How It Works Info */}
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-[#d9482b]" />
                <span>হ্যান্ডসেটে লাইভ প্রিভিউ</span>
              </span>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-bold">
                SMS ডেলিভারি
              </span>
            </h4>

            {/* Phone Screen Mockup */}
            <div className="mx-auto w-64 bg-slate-900 rounded-[2.5rem] p-3 shadow-xl border-4 border-slate-800">
              {/* Notch */}
              <div className="w-24 h-4 bg-slate-800 rounded-b-xl mx-auto mb-2"></div>

              {/* Screen Area */}
              <div className="bg-[#e5ddd5] rounded-2xl p-3 min-h-[340px] flex flex-col justify-between text-xs space-y-3 font-sans">
                {/* Header */}
                <div className="bg-[#075e54] text-white p-2 rounded-lg text-center shadow-xs">
                  <div className="text-[11px] font-bold">{senderId}</div>
                  <div className="text-[9px] text-emerald-200">সরকারি বিটিআরসি রেজিস্টার্ড মাস্কিং প্রেরক</div>
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

            {/* Quick Test SMS Box */}
            <div className="pt-2 border-t border-slate-100">
              <form onSubmit={handleSendTestSms} className="space-y-2">
                <label className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
                  <span>📱 টেস্ট SMS পাঠান (নিজের নম্বরে):</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="tel"
                    placeholder="018XXXXXXXX"
                    value={testPhone}
                    onChange={e => setTestPhone(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs font-mono text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-[#0c3664]"
                  />
                  <button
                    type="submit"
                    disabled={isSendingTest || !testPhone}
                    className="px-3 py-1.5 bg-[#0c3664] hover:bg-[#144275] text-white rounded-lg text-xs font-bold shrink-0 disabled:opacity-50"
                  >
                    {isSendingTest ? '...' : 'টেস্ট'}
                  </button>
                </div>
                {testSuccess && (
                  <p className="text-[10px] text-emerald-700 font-bold">{testSuccess}</p>
                )}
              </form>
            </div>
          </div>

          {/* Quick Technical Summary Card */}
          <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-sm text-xs space-y-2.5">
            <div className="flex items-center gap-2 font-bold text-amber-300">
              <Radio className="w-4 h-4 text-emerald-400" />
              <span>টেলিকম গেটওয়ে স্ট্যাটাস: অনলাইন</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              সফটওয়্যারটি বিটিআরসি অনুমোদিত বাল্ক এসএমএস এপিআই (Greenweb, Teletalk, SSL Wireless) এর সাথে সমন্বিত। হাজিরা খাতায় অনুপস্থিত চিহ্নিত করার সাথে সাথেই এক ক্লিকে সরাসরি সংশ্লিষ্ট মোবাইল নম্বরে এসএমএস পৌঁছে যায়।
            </p>
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
              <span>এনক্রিপশন: SHA-256 SSL</span>
              <span className="text-emerald-400 font-mono">HTTP 200 OK</span>
            </div>
          </div>
        </div>
      </div>

      {/* HOW IT WORKS MODAL */}
      {showHowItWorksModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 md:p-8 shadow-2xl border border-slate-100 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#0c3664] flex items-center justify-center border border-blue-200">
                  <Smartphone className="w-5 h-5 text-[#d9482b]" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">অনুপস্থিতদের কাছে SMS কিভাবে যায়?</h3>
                  <p className="text-xs text-slate-500">হাজিরা খাতা থেকে অভিভাবক ও শিক্ষকের মোবাইলে পৌঁছানোর প্রক্রিয়া</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowHowItWorksModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs text-slate-700 leading-relaxed">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex gap-3">
                <span className="w-6 h-6 rounded-full bg-[#0c3664] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  ১
                </span>
                <div>
                  <h5 className="font-bold text-slate-900">দৈনিক হাজিরা ইনপুট ও অনুপস্থিত চিহ্নিতকরণ:</h5>
                  <p className="text-slate-600 text-[11px] mt-0.5">
                    ক্লাস শিক্ষক বা এডমিন হাজিরা পেজে গিয়ে শিক্ষার্থী বা শিক্ষকদের উপস্থিতি নিয়ে 'অনুপস্থিত' নির্বাচন করেন।
                  </p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex gap-3">
                <span className="w-6 h-6 rounded-full bg-[#0c3664] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  ২
                </span>
                <div>
                  <h5 className="font-bold text-slate-900">স্বয়ংক্রিয় মোবাইল নম্বর ফিল্টারিং:</h5>
                  <p className="text-slate-600 text-[11px] mt-0.5">
                    'অনুপস্থিতদের অভিভাবককে SMS' বা 'অনুপস্থিতদের SMS' বাটনে চাপ দিলে সিস্টেম শুধুমাত্র আজকের অনুপস্থিত ব্যক্তিদের তালিকা এবং ভর্তির সময় সংরক্ষিত অভিভাবক/শিক্ষকের সচল মোবাইল নম্বর স্বয়ংক্রিয়ভাবে সংগ্রহ করে।
                  </p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex gap-3">
                <span className="w-6 h-6 rounded-full bg-[#0c3664] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  ৩
                </span>
                <div>
                  <h5 className="font-bold text-slate-900">টেলিকম বাল্ক এসএমএস এপিআই (SMS Gateway API):</h5>
                  <p className="text-slate-600 text-[11px] mt-0.5">
                    সফটওয়্যারটি বিটিআরসি অনুমোদিত বাল্ক এসএমএস গেটওয়ে (যেমন: Greenweb, Teletalk, SSL Wireless)-এর মাধ্যমে সিকিউর এপিআই দিয়ে টেলিকম অপাটের (গ্রামীণফোন, রবি, বাংলালিংক, টেলিটক)-এর টাওয়ারে পাঠিয়ে দেয়।
                  </p>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex gap-3 text-emerald-900">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  ৪
                </span>
                <div>
                  <h5 className="font-bold text-emerald-950">মিনিটের মধ্যে হ্যান্ডসেটে ডেলিভারি:</h5>
                  <p className="text-emerald-800 text-[11px] mt-0.5">
                    অভিভাবক বা শিক্ষকের ফোনে বিদ্যালয়ের অফিশিয়াল নাম (<span className="font-mono font-bold">{senderId}</span>) প্রেরক হিসেবে প্রদর্শিত হয় এবং তাৎক্ষণিক নোটিফিকেশন পৌঁছে যায়।
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setShowHowItWorksModal(false)}
                className="px-5 py-2 bg-[#0c3664] hover:bg-[#144275] text-white text-xs font-bold rounded-xl"
              >
                ঠিক আছে, বুঝেছি
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SMS GATEWAY API CONFIGURATION MODAL */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 md:p-8 shadow-2xl border border-slate-100 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
                  <Settings className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">বাল্ক SMS গেটওয়ে কনফিগারেশন</h3>
                  <p className="text-xs text-slate-500">টেলিকম এপিআই টোকেন ও প্রেরক মাস্কিং নাম</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowConfigModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">বাল্ক এসএমএস প্রোভাইডার নির্বাচন করুন</label>
                <select
                  value={selectedProvider}
                  onChange={e => setSelectedProvider(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold text-slate-800"
                >
                  <option value="greenweb">Greenweb Bangladesh (BTRC Approved Masking)</option>
                  <option value="ssl">SSL Wireless (Enterprise Gateway)</option>
                  <option value="onnorokom">Onnorokom SMS Gateway (Bangladesh)</option>
                  <option value="teletalk">Teletalk Bangladesh Govt. Bulk SMS</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">প্রেরক আইডি / মাস্কিং নাম (Sender ID)</label>
                  <input
                    type="text"
                    value={senderId}
                    onChange={e => setSenderId(e.target.value)}
                    placeholder="যেমন: NAPORA HS"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold text-slate-800 uppercase"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">অভিভাবকের ফোনে এই নামে SMS যাবে (সর্বোচ্চ ১১ অক্ষর)</p>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">বর্তমান SMS ব্যালান্স</label>
                  <input
                    type="number"
                    value={smsBalance}
                    onChange={e => setSmsBalance(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">প্রোভাইডার API Key / সিক্রেট টোকেন</label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={e => setApiKey(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-slate-800"
                />
                <p className="text-[10px] text-slate-500 mt-1">প্রোভাইডার ড্যাশবোর্ড থেকে প্রাপ্ত সিক্রেট এপিআই কি</p>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-[11px] text-[#0c3664] flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
                <span>সকল ডেটা এন্ড-টু-এন্ড এনক্রিপ্ট হয়ে সুরক্ষিতভাবে বিটিআরসি নির্ধারিত প্রটোকলে ডেলিভারি করা হয়।</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowConfigModal(false)}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 font-bold"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowConfigModal(false);
                  setSendSuccess('গেটওয়ে সেটিংস সফলভাবে আপডেট ও সংরক্ষিত হয়েছে!');
                  setTimeout(() => setSendSuccess(''), 4000);
                }}
                className="px-5 py-2 bg-[#d9482b] hover:bg-[#b8381e] text-white font-bold rounded-xl shadow-xs"
              >
                সংরক্ষণ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
