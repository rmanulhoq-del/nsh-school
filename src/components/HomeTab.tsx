import React from 'react';
import {
  GraduationCap,
  Users,
  CheckCircle2,
  AlertCircle,
  Landmark,
  Sparkles,
  ArrowRight,
  Award,
  BellRing,
  FilePlus,
  ShieldCheck,
  Pencil,
  BookOpen,
  Building2,
  Check,
  ChevronRight,
  History,
  User,
  TrendingUp,
  UserCheck,
  MessageSquare
} from 'lucide-react';
import SchoolLogo from './SchoolLogo';
import HeadmasterPortrait from './HeadmasterPortrait';
import PresidentPortrait from './PresidentPortrait';
import { Student, NavTab, AdminUser, HeadmasterData, PresidentData } from '../types';

interface HomeTabProps {
  language: 'bn' | 'en';
  setActiveTab: (tab: NavTab) => void;
  students: Student[];
  totalStudents: number;
  paidStudents: number;
  dueStudents: number;
  totalCollected: number;
  totalDueAmount: number;
  teacherCount: number;
  currentAdmin: AdminUser | null;
  onOpenNoticeEntry: () => void;
  headmasterData?: HeadmasterData;
  onOpenEditHeadmaster?: () => void;
  presidentData?: PresidentData;
  onOpenEditPresident?: () => void;
}

export default function HomeTab({
  language,
  setActiveTab,
  totalStudents,
  paidStudents,
  dueStudents,
  totalCollected,
  totalDueAmount,
  teacherCount,
  currentAdmin,
  onOpenNoticeEntry,
  headmasterData,
  onOpenEditHeadmaster,
  presidentData,
  onOpenEditPresident
}: HomeTabProps) {
  return (
    <div className="space-y-8">
      {/* Hero Welcome Banner - 3-Part Balanced Institutional Presentation */}
      <div className="bg-gradient-to-br from-[#092b50] via-[#0c3664] to-[#14477d] text-white rounded-3xl p-5 md:p-8 shadow-sm border border-[#082545] relative overflow-hidden space-y-6">
        {/* Subtle Decorative Background Glow */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Welcome Headline */}
        <div className="relative z-10 text-center max-w-3xl mx-auto space-y-3">
          {/* Top Welcome Ribbon: Left (স্থাপিত : ১৯৬৪ ইং) | Center (শিক্ষা অর্জনের বাতিঘর) | Right (ইআইআইএন: ১০৪০৬২) */}
          <div className="w-full bg-[#082545]/90 border border-amber-400/40 px-3 sm:px-6 py-1.5 sm:py-2 rounded-2xl sm:rounded-full text-[11px] sm:text-xs text-amber-300 font-bold shadow-xs flex flex-wrap sm:flex-nowrap items-center justify-center sm:justify-between gap-2 sm:gap-3">
            <span className="shrink-0 text-center sm:text-left">
              {language === 'bn' ? 'স্থাপিত : ১৯৬৪ ইং' : 'Est. 1964'}
            </span>
            <span className="text-center font-extrabold text-amber-300 tracking-wide">
              {language === 'bn' ? 'শিক্ষা অর্জনের বাতিঘর' : 'Beacon of Education'}
            </span>
            <span className="shrink-0 text-center sm:text-right">
              {language === 'bn' ? 'ইআইআইএন: ১০৪০৬২' : 'EIIN: 104062'}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight leading-snug text-white">
            {language === 'bn'
              ? 'নাপোড়া শেখেরখীল উচ্চ বিদ্যালয়ে আপনাকে স্বাগতম'
              : 'Welcome to Napora Shekherkhil High School'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-2xl mx-auto">
            {language === 'bn'
              ? 'চট্টগ্রামের বাঁশখালী উপজেলার ঐতিহ্যবাহী বিদ্যাপীঠ। মানসম্মত সাধারণ শিক্ষা, নৈতিক চরিত্র গঠন এবং ১০০% স্বচ্ছ ডিজিটাল ব্যাংকিং ফি কালেকশন ও স্মার্ট রিকনসিলিয়েশন সিস্টেম।'
              : 'A prestigious educational institution located at Napora, Banshkhali, Chattogram. Providing quality education, ethical values, and transparent digital banking fee reconciliation.'}
          </p>
        </div>

        {/* 3-Part Balanced Grid: Left (Heritage & Academics) | Center (School Logo & Identity) | Right (Digital Services & Banking) */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          
          {/* LEFT COLUMN: School Heritage & Academic Highlights */}
          <div className="lg:col-span-4 bg-[#082545]/90 border border-[#1d4c82] hover:border-amber-400/50 rounded-2xl p-5 flex flex-col justify-between transition-all shadow-sm">
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2.5 border-b border-[#144275]">
                <div className="w-8 h-8 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white">
                    {language === 'bn' ? 'ঐতিহ্য ও অ্যাকাডেমিক তথ্য' : 'Heritage & Academics'}
                  </h2>
                  <p className="text-[11px] text-amber-300 font-semibold">
                    {language === 'bn' ? '৬০+ বছরের গৌরবোজ্জ্বল পথচলা' : '60+ Years of Excellence'}
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-200">
                <div className="flex items-start gap-2 bg-[#051c36]/60 p-2 rounded-lg border border-[#163e6d]">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white">৬ষ্ঠ থেকে ১০ম শ্রেণি:</span>{' '}
                    <span>বিজ্ঞান, মানবিক ও ব্যবসায় শিক্ষা সহ অভিজ্ঞ শিক্ষকমণ্ডলী।</span>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#051c36]/60 p-2 rounded-lg border border-[#163e6d]">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white">সরকারি স্বীকৃতি ও এমপিও:</span>{' '}
                    <span>ইআইআইএন: ১০৪০৬২, বাঁশখালী, চট্টগ্রাম।</span>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#051c36]/60 p-2 rounded-lg border border-[#163e6d]">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white">সহ-শিক্ষা ও শৃঙ্খলা:</span>{' '}
                    <span>নৈতিকতা, বিজ্ঞান চর্চা ও নিয়মিত মূল্যায়ন ব্যবস্থা।</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#144275] flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('about')}
                className="flex-1 py-2 px-3 bg-[#144275] hover:bg-[#1c5798] text-amber-200 hover:text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <span>{language === 'bn' ? 'স্কুল পরিচিতি' : 'About Us'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('committee')}
                className="py-2 px-3 bg-[#051c36] hover:bg-[#092b50] text-slate-300 hover:text-white border border-[#1d4c82] text-xs font-medium rounded-xl transition-colors"
              >
                {language === 'bn' ? 'পর্ষদ' : 'Committee'}
              </button>
            </div>
          </div>

          {/* CENTER COLUMN: School Monogram & Crest Showcase (User's focused center card) */}
          <div className="lg:col-span-4 bg-[#082545] border-2 border-amber-400/60 p-6 rounded-3xl shadow-xl flex flex-col items-center justify-center text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-b from-amber-400/5 to-transparent pointer-events-none" />
            
            <div className="relative">
              <div className="absolute -inset-1.5 bg-amber-400/20 rounded-full blur-sm group-hover:bg-amber-400/30 transition-all" />
              <SchoolLogo size={130} className="relative drop-shadow-lg group-hover:scale-105 transition-transform" />
            </div>

            <div className="mt-3 text-base font-extrabold text-white tracking-wide">
              {language === 'bn' ? 'নাপোড়া শেখেরখীল উচ্চ বিদ্যালয়' : 'Napora Shekherkhil High School'}
            </div>
            
            <div className="text-xs text-amber-300 font-bold italic mt-1">
              "পড় স্রষ্টার নামে"
            </div>
            
            <div className="text-[11px] text-slate-300 mt-1.5">
              {language === 'bn' ? 'ডাক: নাপোড়া, উপজেলা: বাঁশখালী, জেলা: চট্টগ্রাম' : 'Napora, Banshkhali, Chattogram'}
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
              <span className="text-[10px] text-amber-200 bg-[#0c3664] px-2.5 py-0.5 rounded-full border border-amber-400/30 font-semibold">
                ইআইআইএন: ১০৪০৬২
              </span>
              <span className="text-[10px] text-slate-300 bg-[#0c3664] px-2.5 py-0.5 rounded-full border border-slate-700">
                স্থাপিত: ১৯৬৪ ইং
              </span>
            </div>
          </div>

          {/* RIGHT COLUMN: Digital Banking & Smart Services */}
          <div className="lg:col-span-4 bg-[#082545]/90 border border-[#1d4c82] hover:border-blue-400/50 rounded-2xl p-5 flex flex-col justify-between transition-all shadow-sm">
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2.5 border-b border-[#144275]">
                <div className="w-8 h-8 rounded-lg bg-[#d9482b]/20 text-[#d9482b] flex items-center justify-center shrink-0">
                  <Landmark className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white">
                    {language === 'bn' ? 'স্মার্ট ডিজিটাল ফি কালেকশন' : 'Digital Fee Collection'}
                  </h2>
                  <p className="text-[11px] text-emerald-400 font-semibold">
                    {language === 'bn' ? '১০০% স্বচ্ছ ব্যাংকিং ও রসিদ' : 'Transparent & Bank Automated'}
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-200">
                <div className="bg-[#051c36]/60 p-2.5 rounded-lg border border-[#163e6d] space-y-1">
                  <div className="text-[11px] font-bold text-amber-300 flex items-center gap-1.5">
                    <span>🏦 নির্ধারিত পার্টনার ব্যাংকসমূহ:</span>
                  </div>
                  <div className="text-[11px] text-slate-300 pl-3 space-y-0.5">
                    <div>• বাংলাদেশ কৃষি ব্যাংক (নাপোড়া বাজার শাখা)</div>
                    <div>• আইএফআইসি ব্যাংক পিএলসি (নাপোড়া বাজার উপশাখা)</div>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#051c36]/60 p-2 rounded-lg border border-[#163e6d]">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white">স্বয়ংক্রিয় রিকনসিলিয়েশন:</span>{' '}
                    <span>এআই স্ক্যানার ও কিউআর রসিদের মাধ্যমে তাৎক্ষণিক হিসাব হালনাগাদ।</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#144275] flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('banks')}
                className="flex-1 py-2 px-3 bg-[#d9482b] hover:bg-[#b8381e] text-white text-xs font-bold rounded-xl transition-colors shadow-xs flex items-center justify-center gap-1.5"
              >
                <Landmark className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'ব্যাংক ফি ড্যাশবোর্ড' : 'Bank Fees'}</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('ai')}
                className="py-2 px-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold rounded-xl transition-colors flex items-center gap-1"
                title="এআই ব্যাংক স্ক্যানার"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>{language === 'bn' ? 'এআই স্ক্যানার' : 'AI'}</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Smart School Services & Core Modules Grid */}
      <div className="bg-white border border-[#d9e6e7] rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base sm:text-lg font-black text-[#0c3664] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#d9482b]" />
              <span>বিদ্যালয়ের প্রধান ডিজিটাল সার্ভিস ও কার্যক্রমসমূহ</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              হাজিরা, প্রবেশপত্র, পরীক্ষার ফলাফল, এসএমএস নোটিফিকেশন ও বিশেষজ্ঞ পরামর্শক পোর্টাল
            </p>
          </div>
          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            ১০+ ডিজিটাল মডিউল সক্রিয়
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Card 1: Students & Admission */}
          <div
            onClick={() => setActiveTab('students')}
            className="p-3.5 bg-gradient-to-b from-blue-50/50 to-white border border-blue-200/80 hover:border-blue-500 rounded-2xl cursor-pointer transition-all hover:shadow-xs group text-center space-y-2"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#0c3664] mx-auto flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xs">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="font-extrabold text-xs text-slate-900 leading-tight">ভর্তি ও শিক্ষার্থী তথ্য</div>
            <div className="text-[10px] text-slate-500">অনলাইন ফর্ম ও প্রোফাইল</div>
          </div>

          {/* Card 2: Attendance */}
          <div
            onClick={() => setActiveTab('attendance')}
            className="p-3.5 bg-gradient-to-b from-emerald-50/50 to-white border border-emerald-200/80 hover:border-emerald-500 rounded-2xl cursor-pointer transition-all hover:shadow-xs group text-center space-y-2"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xs">
              <UserCheck className="w-5 h-5" />
            </div>
            <div className="font-extrabold text-xs text-slate-900 leading-tight">দৈনিক হাজিরা</div>
            <div className="text-[10px] text-slate-500">ছাত্র ও শিক্ষক উপস্থিতি</div>
          </div>

          {/* Card 3: Exams & Admit Card */}
          <div
            onClick={() => setActiveTab('exams')}
            className="p-3.5 bg-gradient-to-b from-amber-50/50 to-white border border-amber-200/80 hover:border-amber-500 rounded-2xl cursor-pointer transition-all hover:shadow-xs group text-center space-y-2"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 mx-auto flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xs">
              <Award className="w-5 h-5" />
            </div>
            <div className="font-extrabold text-xs text-slate-900 leading-tight">প্রবেশপত্র ও সিট প্ল্যান</div>
            <div className="text-[10px] text-slate-500">অ্যাডমিট কার্ড ও ডেস্ক স্লিপ</div>
          </div>

          {/* Card 4: Report Card */}
          <div
            onClick={() => setActiveTab('exams')}
            className="p-3.5 bg-gradient-to-b from-purple-50/50 to-white border border-purple-200/80 hover:border-purple-500 rounded-2xl cursor-pointer transition-all hover:shadow-xs group text-center space-y-2"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 mx-auto flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xs">
              <FilePlus className="w-5 h-5" />
            </div>
            <div className="font-extrabold text-xs text-slate-900 leading-tight">ফলাফল ও Report Card</div>
            <div className="text-[10px] text-slate-500">গ্রেডিং ও মার্কশিট প্রিন্ট</div>
          </div>

          {/* Card 5: SMS Notification */}
          <div
            onClick={() => setActiveTab('sms')}
            className="p-3.5 bg-gradient-to-b from-rose-50/50 to-white border border-rose-200/80 hover:border-rose-500 rounded-2xl cursor-pointer transition-all hover:shadow-xs group text-center space-y-2"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 mx-auto flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xs">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div className="font-extrabold text-xs text-slate-900 leading-tight">SMS নোটিফিকেশন</div>
            <div className="text-[10px] text-slate-500">ফি ও হাজিরার বার্তা</div>
          </div>

          {/* Card 6: Excellence & Training */}
          <div
            onClick={() => setActiveTab('excellence')}
            className="p-3.5 bg-gradient-to-b from-teal-50/50 to-white border border-teal-200/80 hover:border-teal-500 rounded-2xl cursor-pointer transition-all hover:shadow-xs group text-center space-y-2"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 mx-auto flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="font-extrabold text-xs text-slate-900 leading-tight">প্রশিক্ষণ ও মেধা বিকাশ</div>
            <div className="text-[10px] text-slate-500">প্রতিযোগিতা ও পরামর্শক</div>
          </div>
        </div>
      </div>

      {/* Quick KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          onClick={() => setActiveTab('students')}
          className="bg-white border border-[#d9e6e7] rounded-2xl p-5 shadow-xs hover:border-[#0c3664] cursor-pointer transition-all"
        >
          <div className="text-xs text-slate-500 font-medium flex items-center justify-between">
            <span>{language === 'bn' ? 'মোট শিক্ষার্থী' : 'Total Students'}</span>
            <GraduationCap className="w-4 h-4 text-[#0c3664]" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2 font-mono tabular-nums">
            {totalStudents} {language === 'bn' ? 'জন' : ''}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">৬ষ্ঠ থেকে ১০ম শ্রেণি (শাখা A-D)</div>
        </div>

        {currentAdmin ? (
          <>
            <div
              onClick={() => setActiveTab('banks')}
              className="bg-white border border-[#d9e6e7] rounded-2xl p-5 shadow-xs hover:border-emerald-600 cursor-pointer transition-all"
            >
              <div className="text-xs text-emerald-700 font-medium flex items-center justify-between">
                <span>{language === 'bn' ? 'আদায়কৃত ফি (Paid)' : 'Collected Fees'}</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-bold text-emerald-700 mt-2 font-mono tabular-nums">
                ৳{totalCollected.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-500 mt-1 font-mono tabular-nums">
                {paidStudents} জন শিক্ষার্থী পরিশোধিত
              </div>
            </div>

            <div
              onClick={() => setActiveTab('banks')}
              className="bg-white border border-[#d9e6e7] rounded-2xl p-5 shadow-xs hover:border-rose-600 cursor-pointer transition-all"
            >
              <div className="text-xs text-rose-700 font-medium flex items-center justify-between">
                <span>{language === 'bn' ? 'বকেয়া ফি (Due)' : 'Due Fees'}</span>
                <AlertCircle className="w-4 h-4 text-rose-600" />
              </div>
              <div className="text-2xl font-bold text-rose-700 mt-2 font-mono tabular-nums">
                ৳{totalDueAmount.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-500 mt-1 font-mono tabular-nums">
                {dueStudents} জন শিক্ষার্থীর বকেয়া
              </div>
            </div>
          </>
        ) : (
          <>
            <div
              onClick={() => setActiveTab('committee')}
              className="bg-white border border-[#d9e6e7] rounded-2xl p-5 shadow-xs hover:border-blue-600 cursor-pointer transition-all"
            >
              <div className="text-xs text-slate-600 font-medium flex items-center justify-between">
                <span>{language === 'bn' ? 'পরিচালনা পর্ষদ' : 'Managing Committee'}</span>
                <Award className="w-4 h-4 text-[#0c3664]" />
              </div>
              <div className="text-2xl font-bold text-slate-900 mt-2 font-mono tabular-nums">
                ১১ {language === 'bn' ? 'সদস্য' : 'Members'}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">নির্বাচিত ও অভিভাবক প্রতিনিধি</div>
            </div>

            <div
              onClick={() => setActiveTab('donors')}
              className="bg-white border border-[#d9e6e7] rounded-2xl p-5 shadow-xs hover:border-amber-600 cursor-pointer transition-all"
            >
              <div className="text-xs text-slate-600 font-medium flex items-center justify-between">
                <span>{language === 'bn' ? 'দাতা ও প্রতিষ্ঠাতা' : 'Founders & Donors'}</span>
                <Building2 className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900 mt-2 font-mono tabular-nums">
                ১৬ {language === 'bn' ? 'জন' : ''}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">ভূমিদাতা ও আজীবন সদস্য</div>
            </div>
          </>
        )}

        <div
          onClick={() => setActiveTab('teachers')}
          className="bg-white border border-[#d9e6e7] rounded-2xl p-5 shadow-xs hover:border-[#0c3664] cursor-pointer transition-all"
        >
          <div className="text-xs text-slate-600 font-medium flex items-center justify-between">
            <span>{language === 'bn' ? 'শিক্ষক ও কর্মকর্তা' : 'Faculty & Staff'}</span>
            <Users className="w-4 h-4 text-[#0c3664]" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2 font-mono tabular-nums">
            {teacherCount} {language === 'bn' ? 'জন' : ''}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">অভিজ্ঞ শিক্ষক ফোরাম</div>
        </div>
      </div>

      {/* Quick Portals & Notice Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Bank and Fast Features */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-[#d9e6e7] rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Landmark className="w-5 h-5 text-[#0c3664]" />
                <h2 className="text-base font-bold text-slate-900">
                  নির্ধারিত ব্যাংক শাখাসমূহ ও ফি জমাদানের নিয়ম
                </h2>
              </div>
              <span className="text-xs text-slate-400">বাঁশখালী, চট্টগ্রাম</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#0c3664]">অ্যাকাউন্ট ০১</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded">সক্রিয়</span>
                </div>
                <div className="font-bold text-sm text-slate-900">বাংলাদেশ কৃষি ব্যাংক</div>
                <div className="text-xs text-slate-600">নাপোড়া বাজার শাখা, বাঁশখালী, চট্টগ্রাম</div>
                <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                  মাসিক বেতন ও অর্ধবার্ষিক পরীক্ষার ফি
                </div>
              </div>

              <div className="p-4 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#0c3664]">অ্যাকাউন্ট ০২</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded">সক্রিয়</span>
                </div>
                <div className="font-bold text-sm text-slate-900">আইএফআইসি ব্যাংক পিএলসি</div>
                <div className="text-xs text-slate-600">নাপোড়া বাজার উপশাখা, বাঁশখালী, চট্টগ্রাম</div>
                <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                  উন্নয়ন ও বিবিধ তহবিল হিসাব
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="text-slate-500">ব্যাংকে ফি জমা দেওয়া মাত্রই সাইটে ১-ক্লিকে রিকনসিলিয়েশন হয়ে যায়।</span>
              <button
                type="button"
                onClick={() => setActiveTab('office')}
                className="text-[#0c3664] hover:text-[#d9482b] font-bold flex items-center gap-1"
              >
                <span>অফিস এন্ট্রি প্যানেল</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* President & Headmaster's Leadership & Message Cards */}
          <div className="space-y-4">
            {/* President of School Managing Committee Card */}
            <div className="bg-white border-2 border-[#0c3664]/30 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 px-3 py-1 bg-[#0c3664] text-white text-[11px] font-bold rounded-bl-xl shadow-xs">
                সভাপতি মহোদয়
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pr-20">
                <div className="flex items-center gap-2 text-xs text-[#0c3664] font-bold">
                  <ShieldCheck className="w-4 h-4 text-[#d9482b]" />
                  <span>বর্তমান পরিচালনা পরিষদ সভাপতির বাণী ও দিকনির্দেশনা</span>
                </div>
                {currentAdmin && onOpenEditPresident && (
                  <button
                    type="button"
                    onClick={onOpenEditPresident}
                    className="px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-[#0c3664] border border-amber-500/50 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs hover:shadow-xs"
                    title="সভাপতি মহোদয়ের নাম, পদবি, ছবি ও দিকনির্দেশনা পরিবর্তন করতে ক্লিক করুন"
                  >
                    <Pencil className="w-3.5 h-3.5 text-[#0c3664]" />
                    <span>সভাপতির ছবি ও তথ্য এডিট</span>
                  </button>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-start gap-4">
                {/* President Photo Frame */}
                <div
                  onClick={currentAdmin ? onOpenEditPresident : undefined}
                  className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-2 border-amber-400 bg-blue-50/70 overflow-hidden shrink-0 flex items-center justify-center shadow-xs relative ${
                    currentAdmin ? 'cursor-pointer group' : ''
                  }`}
                  title={currentAdmin ? 'সভাপতির ছবি পরিবর্তন করতে ক্লিক করুন' : presidentData?.name}
                >
                  {presidentData?.photoUrl ? (
                    <img
                      src={presidentData.photoUrl}
                      alt={presidentData.name}
                      className={`w-full h-full object-cover transition-transform ${currentAdmin ? 'group-hover:scale-105' : ''}`}
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <PresidentPortrait size="100%" className={`w-full h-full object-cover transition-transform ${currentAdmin ? 'group-hover:scale-105' : ''}`} />
                  )}
                  {currentAdmin && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-[10px] font-bold">
                      এডিট
                    </div>
                  )}
                </div>

                {/* President Message Content */}
                <div className="space-y-2 flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                    {presidentData?.messageTitle || 'আধুনিক ও মানসম্মত শিক্ষায় বাঁশখালীর আলোকবর্তিকা'}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed italic line-clamp-3">
                    "{presidentData?.messageBody || 'নাপোড়া শেখেরখীল উচ্চ বিদ্যালয় এই অঞ্চলের এক ঐতিহাসিক ঐতিহ্যবাহী বাতিঘর। নৈতিকতা, প্রযুক্তি ও মানসম্মত শিক্ষার সমন্বয়ে আমাদের শিক্ষার্থীরা দেশ ও জাতির যোগ্য নাগরিক হয়ে গড়ে উঠবে—এটাই আমাদের পরিচালনা পরিষদের অঙ্গীকার।'}"
                  </p>
                </div>
              </div>

              <div className="text-xs font-semibold text-slate-800 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="font-bold text-[#0c3664] text-sm block">
                    {presidentData?.name || 'অধ্যক্ষ জনাব মোঃ আবদুল কাদের'}
                  </span>
                  <span className="text-slate-500 text-[11px] block">
                    {presidentData?.designation || 'সভাপতি, বিদ্যালয় পরিচালনা কমিটি'} · {presidentData?.profession || 'বিশিষ্ট শিক্ষাবিদ'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('committee')}
                    className="px-3 py-1.5 bg-[#f0f6f6] hover:bg-[#d2e5e7] text-[#0c3664] font-bold rounded-lg border border-[#d2e5e7] transition-colors text-[11px]"
                  >
                    কমিটি দেখুন →
                  </button>
                </div>
              </div>
            </div>

            {/* Headmaster's Message Card with Photo */}
            <div className="bg-white border border-[#d9e6e7] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4 relative overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs text-[#d9482b] font-bold">
                  <Award className="w-4 h-4" />
                  <span>প্রধান শিক্ষকের শুভেচ্ছা বাণী ও দিকদর্শন</span>
                </div>
                {currentAdmin && onOpenEditHeadmaster && (
                  <button
                    type="button"
                    onClick={onOpenEditHeadmaster}
                    className="px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-[#0c3664] border border-amber-500/50 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs hover:shadow-xs"
                    title="হেড স্যারের নাম, পদবি, ছবি ও শুভেচ্ছা বাণী পরিবর্তন করতে এখানে ক্লিক করুন"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    <span>হেড স্যারের ছবি ও বাণী এডিট</span>
                  </button>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-start gap-4">
                {/* Headmaster Photo Frame */}
                <div
                  onClick={currentAdmin ? onOpenEditHeadmaster : undefined}
                  className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-2 border-[#0c3664] bg-amber-50/70 overflow-hidden shrink-0 flex items-center justify-center shadow-xs relative ${
                    currentAdmin ? 'cursor-pointer group' : ''
                  }`}
                  title={currentAdmin ? 'হেড স্যারের ছবি পরিবর্তন করতে ক্লিক করুন' : headmasterData?.name}
                >
                  {headmasterData?.photoUrl ? (
                    <img
                      src={headmasterData.photoUrl}
                      alt={headmasterData.name}
                      className={`w-full h-full object-cover transition-transform ${currentAdmin ? 'group-hover:scale-105' : ''}`}
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <HeadmasterPortrait size="100%" className={`w-full h-full object-cover transition-transform ${currentAdmin ? 'group-hover:scale-105' : ''}`} />
                  )}
                  {currentAdmin && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-[10px] font-bold">
                      এডিট
                    </div>
                  )}
                </div>

                {/* Headmaster Message Content */}
                <div className="space-y-2 flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                    {headmasterData?.messageTitle || 'ডিজিটাল ব্যবস্থার মাধ্যমে স্বচ্ছতা ও আধুনিক শিক্ষা'}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed italic line-clamp-3">
                    "{headmasterData?.messageBody || 'নাপোড়া শেখেরখীল উচ্চ বিদ্যালয়ের সকল শিক্ষার্থী, শিক্ষক ও অভিভাবকবৃন্দকে আন্তরিক মোবারকবাদ। আমাদের ঐতিহ্য ও সুনামের মূল ভিত্তি হচ্ছে শিক্ষার গুণগত মান এবং সুশৃঙ্খল প্রশাসনিক জবাবদিহিতা।'}"
                  </p>
                </div>
              </div>

              <div className="text-xs font-semibold text-slate-800 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="font-bold text-slate-900 text-sm block">
                    {headmasterData?.name || 'জনাব মোঃ জাহাঙ্গীর আলম'}
                  </span>
                  <span className="text-slate-500 text-[11px] block">
                    {headmasterData?.designation || 'প্রধান শিক্ষক ও সদস্য সচিব'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('about')}
                  className="text-[#0c3664] hover:underline font-bold"
                >
                  বিস্তারিত পড়ুন →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Digital Notices Teaser */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-[#d9e6e7] rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <BellRing className="w-4 h-4 text-[#d9482b]" />
                <h3 className="text-base font-bold text-slate-900">
                  {language === 'bn' ? 'ডিজিটাল নোটিশ বোর্ড' : 'Digital Notice Board'}
                </h3>
              </div>
              {currentAdmin ? (
                <button
                  type="button"
                  onClick={onOpenNoticeEntry}
                  className="text-[11px] text-[#0c3664] hover:text-[#d9482b] font-bold flex items-center gap-1"
                >
                  <FilePlus className="w-3 h-3" />
                  <span>{language === 'bn' ? '+ নোটিশ দিন' : '+ Post'}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setActiveTab('notices')}
                  className="text-[11px] text-[#0c3664] hover:underline font-bold"
                >
                  {language === 'bn' ? 'সকল নোটিশ →' : 'All Notices →'}
                </button>
              )}
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-[#f0f6f6] rounded-xl border border-[#d2e5e7] space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="text-xs font-bold text-slate-900">অর্ধবার্ষিক পরীক্ষার রুটিন ও ব্যাংক ফি জমাদানের শেষ তারিখ</div>
                  <span className="text-[10px] text-amber-800 bg-amber-100/70 border border-amber-300/60 px-1.5 py-0.5 rounded font-semibold shrink-0">
                    প্রধান শিক্ষক
                  </span>
                </div>
                <div className="text-[11px] text-slate-600 leading-relaxed">
                  বাংলাদেশ কৃষি ব্যাংক (নাপোড়া বাজার শাখা) অথবা আইএফআইসি ব্যাংক (নাপোড়া বাজার উপশাখা)-এ নির্ধারিত তারিখের মধ্যে ফি জমা দেওয়ার নির্দেশ দেওয়া যাচ্ছে।
                </div>
                <div className="text-[10px] text-slate-400 pt-1 font-mono">১৩ অক্টোবর ২০২৬</div>
              </div>

              <div className="p-3 bg-[#f0f6f6] rounded-xl border border-[#d2e5e7] space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="text-xs font-bold text-slate-900">৬ষ্ঠ থেকে ১০ম শ্রেণির ডিজিটাল আইডি কার্ড বিতরণ</div>
                  <span className="text-[10px] text-amber-800 bg-amber-100/70 border border-amber-300/60 px-1.5 py-0.5 rounded font-semibold shrink-0">
                    অফিস সহকারী
                  </span>
                </div>
                <div className="text-[11px] text-slate-600 leading-relaxed">
                  প্রতিটি শিক্ষার্থীর ইউনিক স্টুডেন্ট আইডি ও কিউআর স্লিপ শ্রেণি শিক্ষকের মাধ্যমে বিতরণ করা হচ্ছে।
                </div>
                <div className="text-[10px] text-slate-400 pt-1 font-mono">১০ অক্টোবর ২০২৬</div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveTab('notices')}
              className="w-full py-2 bg-[#f0f6f6] hover:bg-slate-200 text-[#0c3664] rounded-xl text-xs font-bold transition-colors text-center block"
            >
              সম্পূর্ণ নোটিশ বোর্ড দেখুন →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
