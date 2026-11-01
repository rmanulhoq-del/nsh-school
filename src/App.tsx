import React, { useState } from 'react';
import {
  Shield,
  UserCheck,
  Eye,
  UserPlus,
  Building2,
  Home,
  BookOpen,
  Award,
  Users,
  GraduationCap,
  Calendar,
  Image as ImageIcon,
  Bell,
  Edit3,
  ChevronRight,
  ArrowLeft,
  X,
  KeyRound,
  LogOut,
  UserCog,
  Save,
  CheckCircle2,
  FileSpreadsheet,
  Receipt,
  FileCheck2,
  CreditCard,
  Phone,
  Search,
  Filter,
  Download,
  Printer,
  ChevronDown,
  Sparkles,
  School,
  Check
} from 'lucide-react';

interface Student {
  id: string;
  name: string;
  class: string;
  section: string;
  roll: string;
  gender: 'male' | 'female';
  guardianName: string;
  guardianPhone: string;
  monthlyFee: number;
  examFee: number;
  status: 'active' | 'pending';
}

export default function App() {
  // Navigation & Active States
  const [currentView, setCurrentView] = useState<'admin' | 'public'>('admin');
  const [adminTab, setAdminTab] = useState<'student-entry' | 'results' | 'fees' | 'notice' | 'accounts' | 'verification'>('student-entry');
  const [lang, setLang] = useState<'bn' | 'en'>('bn');
  const [activeNav, setActiveNav] = useState<string>('হোম');
  const [showAdmissionModal, setShowAdmissionModal] = useState<boolean>(false);
  const [showSecurityModal, setShowSecurityModal] = useState<boolean>(false);
  const [showSuccessToast, setShowSuccessToast] = useState<string | null>(null);

  // Student Form State
  const [formData, setFormData] = useState({
    studentClass: '৬ষ্ঠ শ্রেণি',
    section: 'শাখা A',
    roll: '১৪',
    name: '',
    gender: 'male' as 'male' | 'female',
    guardianName: '',
    guardianPhone: '',
    monthlyFee: '500',
    examFee: '300'
  });

  // Students Database
  const [students, setStudents] = useState<Student[]>([
    { id: 'STU-6A-001', name: 'মোঃ সাকিবুল হাসান', class: '৬ষ্ঠ শ্রেণি', section: 'শাখা A', roll: '১', gender: 'male', guardianName: 'আব্দুল করিম', guardianPhone: '01812345671', monthlyFee: 500, examFee: 300, status: 'active' },
    { id: 'STU-6A-002', name: 'ফাতেমা আক্তার নূর', class: '৬ষ্ঠ শ্রেণি', section: 'শাখা A', roll: '২', gender: 'female', guardianName: 'নুরুল ইসলাম', guardianPhone: '01812345672', monthlyFee: 500, examFee: 300, status: 'active' },
    { id: 'STU-6A-003', name: 'তানভীর আহমেদ', class: '৬ষ্ঠ শ্রেণি', section: 'শাখা A', roll: '৩', gender: 'male', guardianName: 'রফিকুল ইসলাম', guardianPhone: '01812345673', monthlyFee: 500, examFee: 300, status: 'active' },
    { id: 'STU-7A-001', name: 'মারিয়া আক্তার', class: '৭ম শ্রেণি', section: 'শাখা A', roll: '১', gender: 'female', guardianName: 'মোশাররফ হোসেন', guardianPhone: '01812345674', monthlyFee: 500, examFee: 300, status: 'active' },
    { id: 'STU-8B-005', name: 'মোঃ ইরফান উদ্দিন', class: '৮ম শ্রেণি', section: 'শাখা B', roll: '৫', gender: 'male', guardianName: 'জামাল উদ্দিন', guardianPhone: '01812345675', monthlyFee: 600, examFee: 350, status: 'active' },
    { id: 'STU-9A-002', name: 'সাদিয়া জাহান মিমি', class: '৯ম শ্রেণি', section: 'বিজ্ঞান', roll: '২', gender: 'female', guardianName: 'জাফর আলম', guardianPhone: '01812345676', monthlyFee: 700, examFee: 400, status: 'active' },
    { id: 'STU-10A-001', name: 'আরিফুল ইসলাম', class: '১০ম শ্রেণি', section: 'বিজ্ঞান', roll: '১', gender: 'male', guardianName: 'শামসুল হক', guardianPhone: '01812345677', monthlyFee: 700, examFee: 450, status: 'active' },
    { id: 'STU-6B-008', name: 'সুমাইয়া তাবাসসুম', class: '৬ষ্ঠ শ্রেণি', section: 'শাখা B', roll: '৮', gender: 'female', guardianName: 'শাহজাহান কবির', guardianPhone: '01812345678', monthlyFee: 500, examFee: 300, status: 'active' },
    { id: 'STU-7B-012', name: 'মোঃ রায়হান চৌধুরী', class: '৭ম শ্রেণি', section: 'শাখা B', roll: '১২', gender: 'male', guardianName: 'হারুনুর রশিদ', guardianPhone: '01812345679', monthlyFee: 500, examFee: 300, status: 'active' },
    { id: 'STU-8A-004', name: 'তাসনিম জাহান অহনা', class: '৮ম শ্রেণি', section: 'শাখা A', roll: '৪', gender: 'female', guardianName: 'আবুল কালাম', guardianPhone: '01812345680', monthlyFee: 600, examFee: 350, status: 'active' },
    { id: 'STU-9B-009', name: 'মেহেদী হাসান সাকিব', class: '৯ম শ্রেণি', section: 'ব্যবসায় শিক্ষা', roll: '৯', gender: 'male', guardianName: 'আনোয়ার হোসেন', guardianPhone: '01812345681', monthlyFee: 700, examFee: 400, status: 'active' },
    { id: 'STU-10B-015', name: 'রোকেয়া সুলতানা', class: '১০ম শ্রেণি', section: 'মানবিক', roll: '১৫', gender: 'female', guardianName: 'নুর মোহাম্মদ', guardianPhone: '01812345682', monthlyFee: 700, examFee: 450, status: 'active' },
    { id: 'STU-6A-013', name: 'আবির হোসেন ফাহিম', class: '৬ষ্ঠ শ্রেণি', section: 'শাখা A', roll: '১৩', gender: 'male', guardianName: 'সিরাজুল ইসলাম', guardianPhone: '01812345683', monthlyFee: 500, examFee: 300, status: 'active' }
  ]);

  // Generate dynamic student ID
  const classCode = formData.studentClass.includes('৬') ? '6' : formData.studentClass.includes('৭') ? '7' : formData.studentClass.includes('৮') ? '8' : formData.studentClass.includes('৯') ? '9' : '10';
  const sectionCode = formData.section.includes('A') ? 'A' : formData.section.includes('B') ? 'B' : formData.section.includes('বিজ্ঞান') ? 'SCI' : 'HUM';
  const generatedId = `STU-${classCode}${sectionCode}-${formData.roll.padStart(3, '0')}`;

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      alert('দয়া করে শিক্ষার্থীর পূর্ণ নাম লিখুন');
      return;
    }

    const newStudent: Student = {
      id: generatedId,
      name: formData.name,
      class: formData.studentClass,
      section: formData.section,
      roll: formData.roll,
      gender: formData.gender,
      guardianName: formData.guardianName || 'অভিভাবকের নাম',
      guardianPhone: formData.guardianPhone || '018XXXXXXXX',
      monthlyFee: Number(formData.monthlyFee) || 500,
      examFee: Number(formData.examFee) || 300,
      status: 'active'
    };

    setStudents([newStudent, ...students]);
    setFormData({
      ...formData,
      name: '',
      guardianName: '',
      guardianPhone: '',
      roll: (Number(formData.roll) + 1).toString()
    });

    setShowSuccessToast(`শিক্ষার্থী ${newStudent.name} (${newStudent.id}) সফলভাবে ডেটাবেসে সংরক্ষিত হয়েছে!`);
    setTimeout(() => setShowSuccessToast(null), 3500);
  };

  const navItems = [
    'হোম',
    'আমাদের সম্পর্কে',
    'প্রতিষ্ঠাতা ও দাতা ফোরাম',
    'পরিচালনা পর্ষদ',
    'শিক্ষক ফোরাম',
    'কর্মচারী তথ্য',
    'শিক্ষার্থী ও ভর্তি',
    'প্রাত্যহিক সমাবেশ',
    'ফটো ও ভিডিও গ্যালারি'
  ];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans flex flex-col selection:bg-blue-800 selection:text-white">
      
      {/* Toast Notification */}
      {showSuccessToast && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-700 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-emerald-500 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-200" />
          <span className="text-sm font-medium">{showSuccessToast}</span>
        </div>
      )}

      {/* ১. টপ বার (ডেভেলপার জিপ বাটন ছাড়া একদম ফ্রেশ) */}
      <div className="bg-[#081a2e] text-slate-300 border-b border-slate-800 text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-serif italic text-sm tracking-wide">
              "পড় স্রষ্টার নামে"
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 text-slate-400 text-[11px]">
              <span>ইআইআইএন: ১০৪০৬২</span>
              <span>•</span>
              <span>স্থাপিত: ১৯৬৩ ইং</span>
            </div>

            {/* Language Switch */}
            <div className="inline-flex rounded-md border border-slate-700 overflow-hidden text-[11px]">
              <button
                onClick={() => setLang('bn')}
                className={`px-2 py-0.5 font-medium transition ${
                  lang === 'bn' ? 'bg-rose-700 text-white font-semibold' : 'bg-slate-800/80 text-slate-400 hover:text-white'
                }`}
              >
                বাংলা
              </button>
              <button
                onClick={() => setLang('en')}
                className={`px-2 py-0.5 font-medium transition ${
                  lang === 'en' ? 'bg-rose-700 text-white font-semibold' : 'bg-slate-800/80 text-slate-400 hover:text-white'
                }`}
              >
                English
              </button>
            </div>

            {/* Quick Demo Reset */}
            <button
              onClick={() => {
                alert('সিস্টেম ক্যাশ ও ডেমো ডেটা সফলভাবে হালনাগাদ করা হয়েছে।');
              }}
              className="text-slate-400 hover:text-amber-300 transition text-[11px] flex items-center gap-1"
              title="রিসেট ডেমো"
            >
              <span>⟳</span>
              <span>রিসেট ডেমো</span>
            </button>
          </div>
        </div>
      </div>

      {/* ২. হিরো / হেডার সেকশন (অফিস ডেস্ক বাটনটি নিখুঁতভাবে এলাইন করা) */}
      <header className="bg-[#0f2744] text-white border-b border-slate-800 py-3.5 px-4 sm:px-6 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-4">
          
          {/* School Brand Identity */}
          <div className="flex items-center gap-3.5 w-full lg:w-auto justify-center lg:justify-start">
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-500 via-amber-400 to-rose-600 p-0.5 shadow-lg shrink-0">
              <div className="w-full h-full rounded-full bg-[#081a2e] flex flex-col items-center justify-center text-center border-2 border-amber-300 relative overflow-hidden">
                <School className="w-6 h-6 text-amber-300 mb-0.5" />
                <span className="text-[6px] text-amber-200 font-bold tracking-tighter uppercase leading-none">
                  NSHS • 1963
                </span>
              </div>
            </div>

            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-tight">
                নাপোড়া শেখেরখীল উচ্চ বিদ্যালয়
              </h1>
              <p className="text-xs text-sky-300 flex items-center gap-1.5 flex-wrap">
                <span>ডাক: নাপোড়া, বাঁশখালী, চট্টগ্রাম</span>
                <span className="text-amber-400">•</span>
                <span className="text-amber-300 font-medium">স্মার্ট স্কুল পোর্টাল</span>
              </p>
            </div>
          </div>

          {/* অ্যাকশন বাটনসমূহ: সব বাটন সমান উচ্চতায় ও সোজা লাইনে এলাইন করা */}
          <div className="flex flex-wrap items-center justify-center lg:justify-end gap-2 w-full lg:w-auto">
            
            {/* Admin Status Pill */}
            <div className="h-9 px-3 rounded-lg bg-[#081a2e]/90 border border-slate-700/80 text-xs flex items-center gap-2 shadow-sm shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <div className="flex items-center gap-1 text-[11px] leading-tight text-slate-300">
                <span className="text-amber-400 font-medium hidden sm:inline">অথরাইজড এডমিন:</span>
                <span className="font-semibold text-white">প্রধান শিক্ষক জনাব মোঃ জাহাঙ্গীর ...</span>
              </div>
              <button
                onClick={() => alert('কর্মকর্তা পরিবর্তনের প্যানেল চালু হবে')}
                className="text-[10px] px-1.5 py-0.5 rounded bg-blue-600/40 hover:bg-blue-600 border border-blue-400/40 text-blue-200 ml-1 transition"
              >
                সুইচ
              </button>
            </div>

            {/* Security Button */}
            <button
              onClick={() => setShowSecurityModal(true)}
              className="h-9 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-sm transition shrink-0"
            >
              <Users className="w-3.5 h-3.5 text-slate-950" />
              <span>ইউজার ও সিকিউরিটি</span>
            </button>

            {/* Public View Button */}
            <button
              onClick={() => setCurrentView(currentView === 'admin' ? 'public' : 'admin')}
              className={`h-9 px-3 rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-sm transition shrink-0 ${
                currentView === 'public'
                  ? 'bg-blue-600 hover:bg-blue-500 text-white'
                  : 'bg-rose-700 hover:bg-rose-600 text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{currentView === 'admin' ? 'পাবলিক ভিউ ➔' : 'এডমিন ভিউ ➔'}</span>
            </button>

            {/* Admission Button */}
            <button
              onClick={() => setShowAdmissionModal(true)}
              className="h-9 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition shrink-0"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>ভর্তি আবেদন</span>
            </button>

            {/* অফিস ডেস্ক বাটন: উচ্চতা ও প্যাডিং সমান করে সোজা লাইনে আনা হয়েছে */}
            <button
              onClick={() => {
                setCurrentView('admin');
                setAdminTab('student-entry');
              }}
              className={`h-9 px-3.5 rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-sm transition shrink-0 border ${
                currentView === 'admin'
                  ? 'bg-[#15345a] text-cyan-300 border-cyan-400/50 shadow-inner'
                  : 'bg-[#0b1d33] hover:bg-[#15345a] text-slate-200 border-slate-600'
              }`}
              title="অফিস ডেস্ক ও প্রশাসনিক ইনপুট"
            >
              <Building2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>অফিস ডেস্ক</span>
            </button>

          </div>
        </div>
      </header>

      {/* ৩. সাব-নেভিগেশন বার */}
      <nav className="bg-[#091e36] text-slate-200 border-b border-slate-800 text-xs shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1 overflow-x-auto py-1 scrollbar-none">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => {
                setActiveNav(item);
                if (item === 'হোম') setCurrentView('admin');
                else setCurrentView('public');
              }}
              className={`px-3 py-2 rounded-md font-medium whitespace-nowrap transition flex items-center gap-1.5 ${
                activeNav === item
                  ? 'bg-blue-600 text-white font-bold shadow-sm'
                  : 'hover:bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              {item === 'হোম' && <Home className="w-3.5 h-3.5" />}
              {item === 'আমাদের সম্পর্কে' && <Building2 className="w-3.5 h-3.5" />}
              {item === 'শিক্ষক ফোরাম' && <Users className="w-3.5 h-3.5" />}
              {item === 'শিক্ষার্থী ও ভর্তি' && <GraduationCap className="w-3.5 h-3.5" />}
              {item === 'ফটো ও ভিডিও গ্যালারি' && <ImageIcon className="w-3.5 h-3.5" />}
              <span>{item}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* ৪. নোটিশ বার */}
      <div className="bg-white border-b border-slate-200 py-1.5 px-4 sm:px-6 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 shrink-0">
            <span className="px-2.5 py-1 rounded-full bg-rose-600 text-white font-bold text-[11px] flex items-center gap-1 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              জরুরি নোটিশ
            </span>
            <button
              onClick={() => {
                setCurrentView('admin');
                setAdminTab('notice');
              }}
              className="px-2 py-0.5 rounded bg-amber-100 hover:bg-amber-200 text-amber-800 font-medium text-[11px] border border-amber-300 flex items-center gap-1 transition"
            >
              <Edit3 className="w-3 h-3" />
              নোটিশ এডিট (এডমিন)
            </button>
          </div>

          <div className="overflow-hidden whitespace-nowrap flex-1 mx-3 text-slate-700 font-medium text-[12px]">
            <span className="inline-block animate-marquee">
              ✦ বিজ্ঞান মেলার রেজিস্ট্রেশন শুরু হয়েছে ✦ ২০২৪ শিক্ষাবর্ষের অর্ধবার্ষিক পরীক্ষার চূড়ান্ত সময়সূচি ঘোষণা ও প্রবেশপত্র সংগ্রহ ✦ ৬ষ্ঠ থেকে ১০ম শ্রেণির ডিজিটাল আইডি কার্ড বিতরণ চলছে ✦
            </span>
          </div>

          <button
            onClick={() => {
              setCurrentView('public');
              setActiveNav('হোম');
            }}
            className="text-rose-600 hover:text-rose-800 font-bold shrink-0 text-xs flex items-center gap-0.5 transition"
          >
            সব নোটিশ <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* মূল কন্টেন্ট */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">

        {/* ব্রেডক্রাম্ব */}
        <div className="bg-white rounded-xl border border-slate-200 p-2.5 shadow-sm flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentView('public')}
              className="px-3 py-1.5 rounded-lg bg-[#0f2744] hover:bg-[#1a3a60] text-white font-medium flex items-center gap-1.5 shadow-sm transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>মূল পাতায় ফিরে যান (হোম)</span>
            </button>
            <div className="text-slate-500 font-medium hidden sm:flex items-center gap-1">
              <span>হোম</span>
              <span>&gt;</span>
              <span className="text-blue-900 font-semibold">এডমিন ইনপুট ও অফিস</span>
            </div>
          </div>

          <button
            onClick={() => setCurrentView('public')}
            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium flex items-center gap-1 transition border border-slate-300"
          >
            <X className="w-3.5 h-3.5 text-slate-500" />
            <span>ক্লোজ / ব্যাকে যান (Close / Back)</span>
          </button>
        </div>

        {/* প্রধান শিক্ষকের এডমিন সেশন কার্ড */}
        <div className="bg-gradient-to-r from-[#0c233c] via-[#102d4d] to-[#0c233c] text-white rounded-2xl p-5 shadow-lg border border-slate-700/60">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-bold shadow-md shrink-0">
                <Shield className="w-6 h-6 text-slate-950" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    অথরাইজড সেশন সক্রিয়
                  </span>
                  <span className="text-[11px] text-amber-400 font-medium">
                    সর্বোচ্চ প্রশাসনিক অথরাইজেশন
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-amber-300">
                  জনাব মোঃ জাহাঙ্গীর আলম — প্রধান শিক্ষক
                </h2>
                <p className="text-xs text-slate-300">
                  নাপোড়া শেখেরখীল উচ্চ বিদ্যালয় • বাঁশখালী, চট্টগ্রাম • মোবাইল: 01816801501
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
              <button
                onClick={() => setShowSecurityModal(true)}
                className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition shadow-sm"
              >
                <Users className="w-3.5 h-3.5" />
                <span>এডমিন ইউজার ও সিকিউরিটি</span>
              </button>

              <button
                onClick={() => alert('হেড স্যারের তথ্য এডিট')}
                className="px-3 py-1.5 rounded-lg bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/40 text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>হেড স্যারের তথ্য এডিট</span>
              </button>

              <button
                onClick={() => alert('পিন পরিবর্তনের ডায়ালগ')}
                className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-600 text-xs font-medium flex items-center gap-1.5 transition"
              >
                <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                <span>পিন পরিবর্তন</span>
              </button>

              <button
                onClick={() => alert('কর্মকর্তা পরিবর্তনের তালিকা')}
                className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-600 text-xs font-medium transition"
              >
                কর্মকর্তা সুইচ
              </button>

              <button
                onClick={() => {
                  if (confirm('আপনি কি নিশ্চিত যে এডমিন সেশন থেকে লগআউট করতে চান?')) {
                    setCurrentView('public');
                  }
                }}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1 transition shadow-sm"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>লগআউট</span>
              </button>
            </div>
          </div>
        </div>

        {/* এডমিন সাব-ট্যাব */}
        <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-sm">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none text-xs">
            <button
              onClick={() => setAdminTab('student-entry')}
              className={`px-4 py-2.5 rounded-xl font-bold whitespace-nowrap transition flex items-center gap-2 ${
                adminTab === 'student-entry'
                  ? 'bg-[#0f2744] text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <UserPlus className="w-4 h-4 text-amber-400" />
              <span>নতুন শিক্ষার্থী ভর্তি এন্ট্রি</span>
            </button>

            <button
              onClick={() => setAdminTab('results')}
              className={`px-4 py-2.5 rounded-xl font-bold whitespace-nowrap transition flex items-center gap-2 ${
                adminTab === 'results'
                  ? 'bg-[#0f2744] text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4 text-blue-400" />
              <span>পরীক্ষার নম্বর ও রেজাল্ট এন্ট্রি</span>
            </button>

            <button
              onClick={() => setAdminTab('fees')}
              className={`px-4 py-2.5 rounded-xl font-bold whitespace-nowrap transition flex items-center gap-2 ${
                adminTab === 'fees'
                  ? 'bg-[#0f2744] text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <CreditCard className="w-4 h-4 text-emerald-400" />
              <span>ব্যাংক ডিপোজিট স্লিপ ও ফি এন্ট্রি</span>
            </button>

            <button
              onClick={() => setAdminTab('notice')}
              className={`px-4 py-2.5 rounded-xl font-bold whitespace-nowrap transition flex items-center gap-2 ${
                adminTab === 'notice'
                  ? 'bg-[#0f2744] text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Bell className="w-4 h-4 text-rose-400" />
              <span>নতুন নোটিশ প্রকাশ</span>
            </button>

            <button
              onClick={() => setAdminTab('accounts')}
              className={`px-4 py-2.5 rounded-xl font-bold whitespace-nowrap transition flex items-center gap-2 ${
                adminTab === 'accounts'
                  ? 'bg-[#0f2744] text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Receipt className="w-4 h-4 text-amber-500" />
              <span>আয়-ব্যয়ের হিসাব ভাউচার</span>
            </button>

            <button
              onClick={() => setAdminTab('verification')}
              className={`px-4 py-2.5 rounded-xl font-bold whitespace-nowrap transition flex items-center gap-2 ${
                adminTab === 'verification'
                  ? 'bg-[#0f2744] text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <FileCheck2 className="w-4 h-4 text-indigo-400" />
              <span>দ্রুত ১-ক্লিক ভেরিফিকেশন তালিকা</span>
            </button>
          </div>
        </div>

        {/* শিক্ষার্থী ভর্তি ফরম ও ডেটাবেস টেবিল */}
        {adminTab === 'student-entry' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-rose-600" />
                  নতুন শিক্ষার্থী ভর্তি ও তথ্য ইনপুট ফরম
                </h3>
                <p className="text-xs text-slate-500">
                  ৬ষ্ঠ থেকে ১০ম শ্রেণির যেকোনো শাখার শিক্ষার্থীর তথ্য ডেটাবেসে সংযুক্ত করুন।
                </p>
              </div>

              <div className="text-xs text-slate-600 font-semibold px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200">
                মোট শিক্ষার্থী: <span className="text-blue-700 font-bold">{students.length} জন</span>
              </div>
            </div>

            <form onSubmit={handleAddStudent} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">শ্রেণি *</label>
                  <select
                    value={formData.studentClass}
                    onChange={(e) => setFormData({ ...formData, studentClass: e.target.value })}
                    className="w-full text-xs font-medium rounded-xl border border-slate-200 bg-slate-50/70 p-3 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="৬ষ্ঠ শ্রেণি">৬ষ্ঠ শ্রেণি</option>
                    <option value="৭ম শ্রেণি">৭ম শ্রেণি</option>
                    <option value="৮ম শ্রেণি">৮ম শ্রেণি</option>
                    <option value="৯ম শ্রেণি">৯ম শ্রেণি</option>
                    <option value="১০ম শ্রেণি">১০ম শ্রেণি</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">শাখা (Section) *</label>
                  <select
                    value={formData.section}
                    onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                    className="w-full text-xs font-medium rounded-xl border border-slate-200 bg-slate-50/70 p-3 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="শাখা A">শাখা A</option>
                    <option value="শাখা B">শাখা B</option>
                    <option value="বিজ্ঞান">বিজ্ঞান</option>
                    <option value="মানবিক">মানবিক</option>
                    <option value="ব্যবসায় শিক্ষা">ব্যবসায় শিক্ষা</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">রোল নম্বর *</label>
                  <input
                    type="number"
                    value={formData.roll}
                    onChange={(e) => setFormData({ ...formData, roll: e.target.value })}
                    placeholder="যেমন: ৩"
                    required
                    className="w-full text-xs font-medium rounded-xl border border-slate-200 bg-slate-50/70 p-3 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">শিক্ষার্থীর পূর্ণ নাম *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="যেমন: মোঃ সাকিবুল হাসান"
                    required
                    className="w-full text-xs font-medium rounded-xl border border-slate-200 bg-slate-50/70 p-3 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">লিঙ্গ (Gender) *</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'male' | 'female' })}
                    className="w-full text-xs font-medium rounded-xl border border-slate-200 bg-slate-50/70 p-3 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="male">👦 ছাত্র (ছেলে)</option>
                    <option value="female">👧 ছাত্রী (মেয়ে)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">অভিভাবকের নাম</label>
                  <input
                    type="text"
                    value={formData.guardianName}
                    onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                    placeholder="পিতা / মাতার নাম"
                    className="w-full text-xs font-medium rounded-xl border border-slate-200 bg-slate-50/70 p-3 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">অভিভাবকের মোবাইল</label>
                  <input
                    type="tel"
                    value={formData.guardianPhone}
                    onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })}
                    placeholder="017XXXXXXXX"
                    className="w-full text-xs font-medium rounded-xl border border-slate-200 bg-slate-50/70 p-3 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">মাসিক বেতন (টাকা)</label>
                  <input
                    type="number"
                    value={formData.monthlyFee}
                    onChange={(e) => setFormData({ ...formData, monthlyFee: e.target.value })}
                    className="w-full text-xs font-medium rounded-xl border border-slate-200 bg-slate-50/70 p-3 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">পরীক্ষার ফি (টাকা)</label>
                  <input
                    type="number"
                    value={formData.examFee}
                    onChange={(e) => setFormData({ ...formData, examFee: e.target.value })}
                    className="w-full text-xs font-medium rounded-xl border border-slate-200 bg-slate-50/70 p-3 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
                <div className="font-mono text-xs text-slate-500 bg-slate-100 px-3.5 py-2 rounded-lg border border-slate-200 flex items-center gap-2">
                  <span>আইডি জেনারেট হবে:</span>
                  <span className="font-bold text-blue-900 bg-white px-2 py-0.5 rounded shadow-xs border border-slate-300">
                    {generatedId}
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#0f2744] hover:bg-[#193a62] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-950/20 transition cursor-pointer"
                >
                  <Save className="w-4 h-4 text-emerald-400" />
                  <span>শিক্ষার্থী তথ্য ডাটাবেসে সেভ করুন</span>
                </button>
              </div>
            </form>

            <div className="pt-6 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  সম্প্রতি নিবন্ধিত শিক্ষার্থী তালিকা ({students.length} জন)
                </h4>
                <span className="text-xs text-slate-400">অটো সেভ সক্রিয়</span>
              </div>

              <div className="rounded-xl border border-slate-200 overflow-hidden overflow-x-auto shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-bold">
                    <tr>
                      <th className="p-3">আইডি</th>
                      <th className="p-3">শিক্ষার্থীর নাম</th>
                      <th className="p-3">শ্রেণি ও শাখা</th>
                      <th className="p-3">রোল</th>
                      <th className="p-3">অভিভাবক ও মোবাইল</th>
                      <th className="p-3">মাসিক বেতন</th>
                      <th className="p-3">স্ট্যাটাস</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {students.slice(0, 6).map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50/80 transition">
                        <td className="p-3 font-mono font-bold text-blue-900">{s.id}</td>
                        <td className="p-3 font-semibold text-slate-900">{s.name}</td>
                        <td className="p-3 text-slate-600">{s.class} ({s.section})</td>
                        <td className="p-3 font-mono font-medium">{s.roll}</td>
                        <td className="p-3 text-slate-600">
                          <div>{s.guardianName}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{s.guardianPhone}</div>
                        </td>
                        <td className="p-3 font-mono text-emerald-700 font-bold">{s.monthlyFee} ৳</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-[10px]">
                            সক্রিয়
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* অন্যান্য সাব-ট্যাব */}
        {adminTab === 'results' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-blue-600" />
              পরীক্ষার নম্বর ও রেজাল্ট শিট এন্ট্রি প্যানেল
            </h3>
            <p className="text-xs text-slate-500">
              ২০২৪ শিক্ষাবর্ষের অর্ধবার্ষিক ও বার্ষিক পরীক্ষার বিষয়ভিত্তিক নম্বর ইনপুট ও গ্রেড কার্ড প্রস্তুতকরণ।
            </p>
          </div>
        )}

        {adminTab === 'fees' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-emerald-600" />
              ব্যাংক ডিপোজিট স্লিপ ও অনলাইন ফি সমন্বয়
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <strong className="text-xs font-bold text-slate-800 block">বাংলাদেশ কৃষি ব্যাংক শাখা</strong>
                <p className="text-xs text-slate-500">হিসাব নং: 0200018593402 • নাপোড়া বাজার শাখা, বাঁশখালী</p>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <strong className="text-xs font-bold text-slate-800 block">আইএফআইসি ব্যাংক পিএলসি</strong>
                <p className="text-xs text-slate-500">হিসাব নং: 1042-8849-001 • নাপোড়া বাজার উপশাখা, বাঁশখালী</p>
              </div>
            </div>
          </div>
        )}

        {adminTab === 'notice' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Bell className="w-5 h-5 text-rose-600" />
              নতুন নোটিশ প্রকাশ ও ওয়েবসাইট নোটিশ বোর্ড
            </h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="নোটিশের শিরোনাম লিখুন..."
                className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50"
              />
              <textarea
                rows={4}
                placeholder="নোটিশের বিস্তারিত বিবরণ লিখুন..."
                className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50"
              />
              <button
                type="button"
                onClick={() => setShowSuccessToast('নতুন নোটিশ ওয়েবসাইটে লাইভ করা হয়েছে')}
                className="px-5 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-600 text-white font-bold text-xs flex items-center gap-2 transition"
              >
                <Bell className="w-4 h-4" />
                নোটিশ লাইভ পাবলিশ করুন
              </button>
            </div>
          </div>
        )}

      </main>

      {/* ৫. ফুটার (কোনো ডেভেলপার জিপ ফাইল বাটন ছাড়া) */}
      <footer className="bg-[#0b192c] text-slate-300 border-t border-slate-800 mt-12 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 md:grid-cols-12 gap-8">
          
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-400 to-rose-600 p-0.5 shadow-md shrink-0">
                <div className="w-full h-full rounded-full bg-[#081a2e] flex items-center justify-center border border-amber-300">
                  <School className="w-5 h-5 text-amber-300" />
                </div>
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">
                  নাপোড়া শেখেরখীল উচ্চ বিদ্যালয়
                </h4>
                <p className="text-[11px] text-amber-400 font-serif italic">
                  "পড় স্রষ্টার নামে"
                </p>
              </div>
            </div>
            
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              ডাক: নাপোড়া, উপজেলা: বাঁশখালী, জেলা: চট্টগ্রাম। ১৯৬৪ সালে প্রতিষ্ঠিত ঐতিহ্যবাহী বিদ্যাপীঠ। আধুনিক যুগোপযোগী শিক্ষা ও ডিজিটাল ব্যাংক ফি সমন্বয় ব্যবস্থাপনা।
            </p>
          </div>

          <div className="md:col-span-4 space-y-2.5">
            <h5 className="font-bold text-amber-400 text-xs uppercase tracking-wider">
              দ্রুত নেভিগেশন
            </h5>
            <div className="grid grid-cols-2 gap-1.5 text-xs text-slate-400">
              <a href="#home" onClick={(e) => { e.preventDefault(); setCurrentView('public'); }} className="hover:text-white transition">হোম</a>
              <a href="#about" onClick={(e) => { e.preventDefault(); setCurrentView('public'); }} className="hover:text-white transition">আমাদের সম্পর্কে</a>
              <a href="#teachers" onClick={(e) => { e.preventDefault(); setCurrentView('public'); }} className="hover:text-white transition">শিক্ষক ফোরাম</a>
              <a href="#students" onClick={(e) => { e.preventDefault(); setCurrentView('public'); }} className="hover:text-white transition">শিক্ষার্থীর তথ্য</a>
              <a href="#gallery" onClick={(e) => { e.preventDefault(); setCurrentView('public'); }} className="hover:text-white transition">ফটো ও ভিডিও গ্যালারি</a>
              <a href="#contact" onClick={(e) => { e.preventDefault(); setCurrentView('public'); }} className="hover:text-white transition">যোগাযোগ</a>
            </div>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h5 className="font-bold text-amber-400 text-xs uppercase tracking-wider">
              ফি জমা শাখা
            </h5>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                <strong className="text-white block font-medium">বাংলাদেশ কৃষি ব্যাংক</strong>
                <span className="text-slate-400 text-[11px]">নাপোড়া বাজার শাখা, বাঁশখালী</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                <strong className="text-white block font-medium">আইএফআইসি ব্যাংক পিএলসি</strong>
                <span className="text-slate-400 text-[11px]">নাপোড়া বাজার উপশাখা, বাঁশখালী</span>
              </div>
            </div>
          </div>

        </div>

        <div className="border-t border-slate-800 py-3.5 px-4 sm:px-6 bg-[#081424] text-[11px] text-slate-400">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
            <div>
              © 2026 নাপোড়া শেখেরখীল উচ্চ বিদ্যালয় • সর্বস্বত্ব সংরক্ষিত।
            </div>
            <div className="flex items-center gap-2">
              <span>ইআইআইএন: ১০৪০৬২</span>
              <span>•</span>
              <span>স্থাপিত: ১৯৬৩ ইং</span>
              <span>•</span>
              <span className="text-amber-400 font-medium">বাঁশখালী, চট্টগ্রাম</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ভর্তি আবেদন মডাল */}
      {showAdmissionModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-emerald-600" />
                অনলাইন ভর্তি আবেদন ফরম (২০২৪-২০২৫)
              </h3>
              <button
                onClick={() => setShowAdmissionModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-500">
              নাপোড়া শেখেরখীল উচ্চ বিদ্যালয়ে নতুন শিক্ষার্থী ভর্তির প্রাথমিক আবেদন অনলাইনে জমা দিন।
            </p>
            <div className="space-y-3 text-xs">
              <input
                type="text"
                placeholder="শিক্ষার্থীর পূর্ণ নাম *"
                className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50"
              />
              <select className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50">
                <option>ভর্তির শ্রেণি নির্বাচন করুন</option>
                <option>৬ষ্ঠ শ্রেণি</option>
                <option>৭ম শ্রেণি</option>
                <option>৮ম শ্রেণি</option>
                <option>৯ম শ্রেণি</option>
              </select>
              <input
                type="tel"
                placeholder="অভিভাবকের মোবাইল নম্বর *"
                className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAdmissionModal(false)}
                className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold"
              >
                বাতিল
              </button>
              <button
                onClick={() => {
                  setShowAdmissionModal(false);
                  setShowSuccessToast('ভর্তি আবেদন সফলভাবে জমা হয়েছে!');
                }}
                className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-bold"
              >
                আবেদন জমা দিন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* সিকিউরিটি মডাল */}
      {showSecurityModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-600" />
                এডমিন ইউজার ও সিকিউরিটি কন্ট্রোল
              </h3>
              <button
                onClick={() => setShowSecurityModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900">
                <strong>প্রধান শিক্ষক লগইন স্ট্যাটাস:</strong> সক্রিয় (Session Secure)
              </div>
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">বর্তমান এডমিন পিন</label>
                <input
                  type="password"
                  defaultValue="******"
                  className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50"
                  readOnly
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowSecurityModal(false)}
                className="px-4 py-2 rounded-lg bg-blue-900 text-white text-xs font-bold"
              >
                ঠিক আছে
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
