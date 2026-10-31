import React, { useState } from 'react';
import {
  FileText,
  Printer,
  TrendingUp,
  Users,
  Award,
  Landmark,
  CheckCircle2,
  Calendar,
  BookOpen,
  PieChart,
  Building
} from 'lucide-react';
import { Student, Teacher, StaffMember } from '../types';
import SchoolLogo from './SchoolLogo';

interface InstitutionalReportsTabProps {
  students: Student[];
  teachers: Teacher[];
  staffList: StaffMember[];
  isAdmin: boolean;
}

export default function InstitutionalReportsTab({
  students,
  teachers,
  staffList,
  isAdmin
}: InstitutionalReportsTabProps) {
  const [reportType, setReportType] = useState<'monthly' | 'annual'>('monthly');
  const [selectedMonth, setSelectedMonth] = useState('অক্টোবর ২০২৬');

  // Demographic stats
  const totalStudents = students.length;
  const maleCount = students.filter(s => s.gender === 'male').length;
  const femaleCount = students.filter(s => s.gender === 'female').length;
  const paidCount = students.filter(s => s.status === 'paid').length;
  const dueCount = students.filter(s => s.status === 'due').length;

  const totalFeeCollected = students.reduce((acc, s) => s.status === 'paid' ? acc + s.monthlyFee : acc, 0);
  const totalFeeDue = students.reduce((acc, s) => s.status === 'due' ? acc + s.monthlyFee : acc, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#0c3664] to-[#144275] text-white p-6 rounded-2xl shadow-md border-b-4 border-[#d9482b]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider mb-1">
              <TrendingUp className="w-4 h-4" />
              <span>পরিসংখ্যান ও প্রাতিষ্ঠানিক মূল্যায়ন সেল</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black">
              মাসিক ও বাৎসরিক প্রাতিষ্ঠানিক রিপোর্ট
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-2xl">
              বিদ্যালয়ের সামগ্রিক একাডেমিক অগ্রগতি, উপস্থিতি বিশ্লেষণ, আর্থিক লেনদেন এবং সরকারি পরিদর্শন উপযোগী বার্ষিক মাস্টার প্রতিবেদন।
            </p>
          </div>

          <button
            type="button"
            onClick={() => window.print()}
            className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all shrink-0"
          >
            <Printer className="w-4 h-4 text-slate-950" />
            <span>রিপোর্ট প্রিন্ট করুন</span>
          </button>
        </div>

        {/* Report Type Switcher */}
        <div className="flex items-center gap-2 mt-5 pt-4 border-t border-white/15">
          <button
            type="button"
            onClick={() => setReportType('monthly')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              reportType === 'monthly'
                ? 'bg-[#d9482b] text-white shadow-xs'
                : 'bg-black/20 text-slate-200 hover:text-white hover:bg-black/30'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>মাসিক অগ্রগতি রিপোর্ট (Monthly Report)</span>
          </button>

          <button
            type="button"
            onClick={() => setReportType('annual')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              reportType === 'annual'
                ? 'bg-[#d9482b] text-white shadow-xs'
                : 'bg-black/20 text-slate-200 hover:text-white hover:bg-black/30'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>বাৎসরিক সার্বিক প্রতিবেদন ২০২৬ (Annual Report)</span>
          </button>
        </div>
      </div>

      {/* MONTHLY REPORT VIEW */}
      {reportType === 'monthly' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <label className="text-xs font-bold text-slate-700">রিপোর্টের মাস:</label>
              <select
                value={selectedMonth}
                onChange={e => setSelectedMonth(e.target.value)}
                className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-bold text-slate-800 focus:ring-2 focus:ring-[#0c3664] focus:outline-hidden"
              >
                <option value="অক্টোবর ২০২৬">অক্টোবর ২০২৬</option>
                <option value="সেপ্টেম্বর ২০২৬">সেপ্টেম্বর ২০২৬</option>
                <option value="আগস্ট ২০২৬">আগস্ট ২০২৬</option>
                <option value="জুলাই ২০২৬">জুলাই ২০২৬</option>
              </select>
            </div>
            <div className="text-xs text-slate-500 font-medium">
              সর্বশেষ প্রস্তুতকৃত: ৩১ অক্টোবর ২০২৬ · স্বাক্ষরিত: প্রধান শিক্ষক
            </div>
          </div>

          {/* Printable Monthly Document Container */}
          <div className="bg-white border-2 border-slate-300 rounded-2xl p-6 sm:p-8 shadow-lg max-w-4xl mx-auto space-y-6">
            <div className="text-center border-b-2 border-[#0c3664] pb-4">
              <SchoolLogo size={56} className="mx-auto mb-2" />
              <h2 className="text-xl sm:text-2xl font-black text-[#0c3664]">
                নাপোড়া শেখেরখীল উচ্চ বিদ্যালয়
              </h2>
              <p className="text-xs text-slate-600">ডাক: নাপোড়া, বাঁশখালী, চট্টগ্রাম · ইআইআইএন: ১০৪০৬২</p>
              <div className="inline-block bg-[#0c3664] text-white font-bold text-xs px-4 py-1 rounded-full uppercase tracking-wide mt-2">
                মাসিক একাডেমিক ও প্রশাসনিক অগ্রগতি প্রতিবেদন - {selectedMonth}
              </div>
            </div>

            {/* 4 Core Pillars KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                <div className="text-[10px] text-slate-500 font-bold uppercase">মোট শিক্ষার্থী</div>
                <div className="text-xl font-black text-slate-900">{totalStudents} জন</div>
                <div className="text-[10px] text-slate-400 mt-0.5">ছাত্র: {maleCount} | ছাত্রী: {femaleCount}</div>
              </div>

              <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-center">
                <div className="text-[10px] text-emerald-700 font-bold uppercase">গড় শিক্ষার্থী উপস্থিতি</div>
                <div className="text-xl font-black text-emerald-700">৯৩.৮%</div>
                <div className="text-[10px] text-emerald-600 mt-0.5">চলতি মাসে সন্তোষজনক</div>
              </div>

              <div className="bg-blue-50 p-3 rounded-xl border border-blue-200 text-center">
                <div className="text-[10px] text-blue-700 font-bold uppercase">ফি আদায় অগ্রগতি</div>
                <div className="text-xl font-black text-blue-800">{Math.round((paidCount / totalStudents) * 100)}%</div>
                <div className="text-[10px] text-blue-600 mt-0.5">{paidCount} জন পরিশোধিত</div>
              </div>

              <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-center">
                <div className="text-[10px] text-amber-700 font-bold uppercase">শিক্ষক উপস্থিতি হার</div>
                <div className="text-xl font-black text-amber-800">৯৮.৫%</div>
                <div className="text-[10px] text-amber-600 mt-0.5">মোট শিক্ষক: {teachers.length} জন</div>
              </div>
            </div>

            {/* Financial Summary Table */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-[#0c3664] uppercase flex items-center gap-1.5">
                <Landmark className="w-4 h-4 text-[#d9482b]" />
                <span>আর্থিক ও ব্যাংক ফি কালেকশন সারাংশ ({selectedMonth})</span>
              </h4>
              <div className="border border-slate-300 rounded-xl overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
                    <tr>
                      <th className="py-2 px-3">খাত / বিবরণ</th>
                      <th className="py-2 px-3">ব্যাংক অ্যাকাউন্ট</th>
                      <th className="py-2 px-3 text-right">নির্ধারিত লক্ষ্য</th>
                      <th className="py-2 px-3 text-right">আদায়কৃত পরিমাণ</th>
                      <th className="py-2 px-3 text-right">আদায়ের শতকরা হার</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr>
                      <td className="py-2 px-3 font-semibold text-slate-800">শিক্ষার্থী মাসিক টিউশন ফি</td>
                      <td className="py-2 px-3 text-slate-600">বাংলাদেশ কৃষি ব্যাংক, নাপোড়া</td>
                      <td className="py-2 px-3 text-right font-mono">{(totalFeeCollected + totalFeeDue).toLocaleString()} ৳</td>
                      <td className="py-2 px-3 text-right font-mono font-bold text-emerald-700">{totalFeeCollected.toLocaleString()} ৳</td>
                      <td className="py-2 px-3 text-right font-bold text-emerald-700">{Math.round((paidCount / totalStudents) * 100)}%</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-semibold text-slate-800">অর্ধবার্ষিক পরীক্ষার ফি</td>
                      <td className="py-2 px-3 text-slate-600">আইএফআইসি ব্যাংক পিএলসি, নাপোড়া</td>
                      <td className="py-2 px-3 text-right font-mono">১,৫০,০০০ ৳</td>
                      <td className="py-2 px-3 text-right font-mono font-bold text-emerald-700">১,৩৫,০০০ ৳</td>
                      <td className="py-2 px-3 text-right font-bold text-emerald-700">৯০%</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-semibold text-slate-800">বিজ্ঞান ল্যাব ও লাইব্রেরি ফি</td>
                      <td className="py-2 px-3 text-slate-600">বাংলাদেশ কৃষি ব্যাংক</td>
                      <td className="py-2 px-3 text-right font-mono">৪৫,০০০ ৳</td>
                      <td className="py-2 px-3 text-right font-mono font-bold text-emerald-700">৪২,৫০০ ৳</td>
                      <td className="py-2 px-3 text-right font-bold text-emerald-700">৯৪.৪%</td>
                    </tr>
                  </tbody>
                  <tfoot className="bg-slate-100 font-bold border-t-2 border-slate-300">
                    <tr>
                      <td colSpan={3} className="py-2 px-3">সর্বমোট আদায় ও ব্যাংক ব্যালান্স</td>
                      <td className="py-2 px-3 text-right text-emerald-800 font-mono text-sm">{(totalFeeCollected + 177500).toLocaleString()} ৳</td>
                      <td className="py-2 px-3 text-right text-emerald-700">৯২.২%</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Official Signatures */}
            <div className="pt-8 border-t border-slate-200 flex items-center justify-between text-xs text-slate-800">
              <div className="text-center">
                <div className="w-36 border-b border-slate-400 mb-1 font-semibold">হিসাব সহকারী</div>
                <span className="text-[11px] text-slate-600">নাপোড়া শেখেরখীল উচ্চ বিদ্যালয়</span>
              </div>

              <div className="text-center">
                <div className="w-40 border-b-2 border-[#0c3664] mb-1 font-bold text-[#0c3664]">
                  মোঃ জাহাঙ্গীর আলম
                </div>
                <span className="text-[11px] font-extrabold text-[#0c3664] block">প্রধান শিক্ষক ও সদস্য সচিব</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ANNUAL REPORT VIEW */}
      {reportType === 'annual' && (
        <div className="bg-white border-2 border-[#0c3664] rounded-2xl p-6 sm:p-10 shadow-lg max-w-4xl mx-auto space-y-6">
          <div className="text-center border-b-2 border-[#d9482b] pb-4">
            <SchoolLogo size={64} className="mx-auto mb-2" />
            <h2 className="text-2xl sm:text-3xl font-black text-[#0c3664]">
              নাপোড়া শেখেরখীল উচ্চ বিদ্যালয়
            </h2>
            <p className="text-xs text-slate-600 font-medium">
              ডাক: নাপোড়া, উপজেলা: বাঁশখালী, জেলা: চট্টগ্রাম · ইআইআইএন: ১০৪০৬২ · স্থাপিত: ১৯৬৪ খ্রি.
            </p>
            <div className="inline-block bg-[#0c3664] text-white font-black text-xs sm:text-sm px-5 py-1.5 rounded-full uppercase tracking-wider mt-2 shadow-xs">
              বার্ষিক প্রাতিষ্ঠানিক প্রতিবেদন ও অর্জন বিবরণী - ২০২৬ (Annual Institutional Report)
            </div>
          </div>

          {/* Section 1: Institutional Overview */}
          <div className="space-y-2">
            <h3 className="text-sm font-extrabold text-[#0c3664] border-b border-slate-200 pb-1">
              ১. প্রাতিষ্ঠানিক পরিচিতি ও কাঠামো
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
              <div>
                <span className="text-slate-500 block text-[10px]">প্রতিষ্ঠাকাল:</span>
                <span className="font-bold text-slate-900">১৯৬৪ খ্রিস্টাব্দ (৬০+ বছর)</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">মোট পাঠদান শ্রেণি:</span>
                <span className="font-bold text-slate-900">৬ষ্ঠ থেকে ১০ম শ্রেণি</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">অনুমোদিত বিভাগ:</span>
                <span className="font-bold text-slate-900">বিজ্ঞান, মানবিক ও ব্যবসায় শিক্ষা</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">মোট শিক্ষক ও কর্মচারী:</span>
                <span className="font-bold text-slate-900">{teachers.length + staffList.length} জন</span>
              </div>
            </div>
          </div>

          {/* Section 2: Historical Board Exam Results */}
          <div className="space-y-2">
            <h3 className="text-sm font-extrabold text-[#0c3664] border-b border-slate-200 pb-1">
              ২. এস.এস.সি (SSC) ও পাবলিক পরীক্ষায় বিগত ৫ বছরের সাফল্য
            </h3>
            <div className="border border-slate-300 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-[#0c3664] text-white font-bold">
                  <tr>
                    <th className="py-2 px-3">সাল</th>
                    <th className="py-2 px-3 text-center">মোট পরীক্ষার্থী</th>
                    <th className="py-2 px-3 text-center">উত্তীর্ণ ছাত্র-ছাত্রী</th>
                    <th className="py-2 px-3 text-center">পাসের হার</th>
                    <th className="py-2 px-3 text-center">জিপিএ-৫ (A+)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-semibold text-slate-800">
                  <tr>
                    <td className="py-2 px-3">২০২৫</td>
                    <td className="py-2 px-3 text-center">১৭৫ জন</td>
                    <td className="py-2 px-3 text-center font-bold text-emerald-700">১৭১ জন</td>
                    <td className="py-2 px-3 text-center font-black text-emerald-700">৯৭.৭১%</td>
                    <td className="py-2 px-3 text-center font-black text-blue-700">২৮ জন</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3">২০২৪</td>
                    <td className="py-2 px-3 text-center">১৬৮ জন</td>
                    <td className="py-2 px-3 text-center font-bold text-emerald-700">১৬২ জন</td>
                    <td className="py-2 px-3 text-center font-black text-emerald-700">৯৬.৪৩%</td>
                    <td className="py-2 px-3 text-center font-black text-blue-700">২২ জন</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3">২০২৩</td>
                    <td className="py-2 px-3 text-center">১৫২ জন</td>
                    <td className="py-2 px-3 text-center font-bold text-emerald-700">১৪৬ জন</td>
                    <td className="py-2 px-3 text-center font-black text-emerald-700">৯৬.০৫%</td>
                    <td className="py-2 px-3 text-center font-black text-blue-700">১৯ জন</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: Strategic Vision & Commitments */}
          <div className="space-y-2">
            <h3 className="text-sm font-extrabold text-[#0c3664] border-b border-slate-200 pb-1">
              ৩. বার্ষিক উন্নয়ন মাইলফলক ও ভবিষ্যৎ কর্মপরিকল্পনা
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1">
                <span className="font-bold text-emerald-900 block flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>২০২৬ সালে অর্জিত প্রধান মাইলফলকসমূহ:</span>
                </span>
                <ul className="list-disc list-inside text-slate-700 space-y-0.5 text-[11px]">
                  <li>শতভাগ ডিজিটাল ফি ও ব্যাংক চালানে রূপান্তর।</li>
                  <li>আধুনিক মাল্টিমিডিয়া আইসিটি ল্যাব সম্প্রসারণ।</li>
                  <li>শিক্ষার্থী বায়োমেট্রিক ও দৈনিক এসএমএস হাজিরা চালু।</li>
                </ul>
              </div>

              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 space-y-1">
                <span className="font-bold text-blue-900 block flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-blue-600" />
                  <span>আগামী ২০২৭ শিক্ষাবর্ষের রূপকল্প:</span>
                </span>
                <ul className="list-disc list-inside text-slate-700 space-y-0.5 text-[11px]">
                  <li>নতুন বিজ্ঞান ভবনের ল্যাবরেটরি আধুনিকায়ন।</li>
                  <li>আন্তর্জাতিক রোবোটিক্স ও কোডিং ক্লাব চালু।</li>
                  <li>দরিদ্র ও মেধাবী শিক্ষার্থীদের শতভাগ উপবৃত্তি তহবিল।</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Signatures */}
          <div className="pt-8 border-t-2 border-slate-200 flex items-center justify-between text-xs text-slate-800">
            <div className="text-center">
              <div className="w-44 border-b-2 border-slate-400 mb-1 font-bold text-slate-900">
                অধ্যক্ষ মোঃ আবদুল কাদের
              </div>
              <span className="text-[11px] font-bold text-slate-700 block">সভাপতি, পরিচালনা পর্ষদ</span>
              <span className="text-[10px] text-slate-500">নাপোড়া শেখেরখীল উচ্চ বিদ্যালয়</span>
            </div>

            <div className="text-center">
              <div className="w-44 border-b-2 border-[#0c3664] mb-1 font-bold text-[#0c3664]">
                মোঃ জাহাঙ্গীর আলম
              </div>
              <span className="text-[11px] font-extrabold text-[#0c3664] block">প্রধান শিক্ষক ও সদস্য সচিব</span>
              <span className="text-[10px] text-slate-500">নাপোড়া শেখেরখীল উচ্চ বিদ্যালয়</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
