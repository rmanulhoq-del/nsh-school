import React, { useState, useMemo } from 'react';
import {
  BadgeCheck,
  CheckCircle2,
  AlertCircle,
  Building2,
  Sparkles,
  UserCheck,
  Search
} from 'lucide-react';
import SchoolLogo from './SchoolLogo';
import { Student, NavTab, formatClassOrdinal } from '../types';

interface BankDashboardTabProps {
  students: Student[];
  totalStudents: number;
  paidStudents: number;
  dueStudents: number;
  totalCollected: number;
  totalDueAmount: number;
  krishiCount: number;
  ificCount: number;
  setActiveTab: (tab: NavTab) => void;
}

export default function BankDashboardTab({
  students,
  totalStudents,
  paidStudents,
  dueStudents,
  totalCollected,
  totalDueAmount,
  krishiCount,
  ificCount,
  setActiveTab
}: BankDashboardTabProps) {
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'paid' | 'due'>('all');
  const [selectedBank, setSelectedBank] = useState<'all' | 'বাংলাদেশ কৃষি ব্যাংক' | 'আইএফআইসি ব্যাংক'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      if (selectedClass !== 'all' && student.className !== selectedClass) return false;
      if (selectedSection !== 'all' && student.section !== selectedSection) return false;
      if (selectedStatus !== 'all' && student.status !== selectedStatus) return false;
      if (selectedBank !== 'all' && student.paidBank !== selectedBank) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = student.name.toLowerCase().includes(query);
        const matchesId = student.id.toLowerCase().includes(query);
        const matchesRoll = student.roll.toString().includes(query);
        const matchesPhone = student.guardianPhone.includes(query);
        if (!matchesName && !matchesId && !matchesRoll && !matchesPhone) return false;
      }
      return true;
    });
  }, [students, selectedClass, selectedSection, selectedStatus, selectedBank, searchQuery]);

  return (
    <div className="space-y-6">
      <div className="bg-[#0c3664] text-white rounded-2xl p-6 md:p-8 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs text-amber-300 font-bold">
              <BadgeCheck className="w-4 h-4 text-emerald-400" />
              <span>নাপোড়া শেখেরখীল উচ্চ বিদ্যালয় · ব্যাংক ফি ড্যাশবোর্ড</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              ১-ক্লিক ব্যাংক ফি রিকনসিলিয়েশন ও রিয়েল-টাইম তথ্য
            </h2>
            <p className="text-xs md:text-sm text-slate-200 leading-relaxed">
              বাংলাদেশ কৃষি ব্যাংক (নাপোড়া বাজার শাখা) বা আইএফআইসি ব্যাংক (নাপোড়া বাজার উপশাখা)-এ টাকা জমা হওয়ামাত্রই সফটওয়্যার স্বয়ংক্রিয়ভাবে হিসাব আপডেট করে।
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3 bg-[#082545] p-3 rounded-2xl border border-amber-400/30">
            <SchoolLogo size={58} className="drop-shadow-sm" />
            <div className="text-xs">
              <div className="text-amber-300 font-bold">নাপোড়া বাজার ব্রাঞ্চ</div>
              <div className="text-white">কৃষি ব্যাংক ও আইএফআইসি</div>
              <div className="text-slate-400 text-[10px]">অ্যাকাউন্ট ০১ ও ০২</div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-[#144275]">
          <button
            type="button"
            onClick={() => setActiveTab('ai')}
            className="px-4 py-2 bg-[#d9482b] hover:bg-[#b8381e] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>এআই দিয়ে ব্যাংক স্টেটমেন্ট স্ক্যান করুন</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('office')}
            className="px-4 py-2 bg-[#082545] hover:bg-[#061c33] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>অফিস এন্ট্রি প্যানেলে যান</span>
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-[#d9e6e7] rounded-2xl p-5 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">মোট শিক্ষার্থী</div>
          <div className="text-2xl font-bold text-slate-900 mt-1 font-mono tabular-nums">
            {totalStudents} জন
          </div>
          <div className="text-[11px] text-slate-400 mt-1">৬ষ্ঠ থেকে ১০ম শ্রেণি</div>
        </div>

        <div className="bg-white border border-[#d9e6e7] rounded-2xl p-5 shadow-xs">
          <div className="text-xs text-emerald-700 font-medium flex items-center justify-between">
            <span>ফি পরিশোধিত (Paid)</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-700 mt-1 font-mono tabular-nums">
            {paidStudents} জন
          </div>
          <div className="text-[11px] text-slate-500 mt-1 font-mono tabular-nums">
            আদায়কৃত: ৳{totalCollected.toLocaleString()}
          </div>
        </div>

        <div className="bg-white border border-[#d9e6e7] rounded-2xl p-5 shadow-xs">
          <div className="text-xs text-rose-700 font-medium flex items-center justify-between">
            <span>বকেয়া (Due)</span>
            <AlertCircle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-bold text-rose-700 mt-1 font-mono tabular-nums">
            {dueStudents} জন
          </div>
          <div className="text-[11px] text-slate-500 mt-1 font-mono tabular-nums">
            বকেয়া মোট: ৳{totalDueAmount.toLocaleString()}
          </div>
        </div>

        <div className="bg-white border border-[#d9e6e7] rounded-2xl p-5 shadow-xs">
          <div className="text-xs text-slate-600 font-medium flex items-center justify-between">
            <span>ব্যাংক অনুযায়ী হিসাব</span>
            <Building2 className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-xs text-slate-700 space-y-1 mt-2">
            <div className="flex justify-between font-mono tabular-nums">
              <span>কৃষি ব্যাংক (নাপোড়া):</span>
              <span className="font-bold text-[#0c3664]">{krishiCount} জন</span>
            </div>
            <div className="flex justify-between font-mono tabular-nums">
              <span>আইএফআইসি (উপশাখা):</span>
              <span className="font-bold text-[#0c3664]">{ificCount} জন</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter controls */}
      <div className="bg-white border border-[#d9e6e7] rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              ফিল্টারিং ও ইনস্ট্যান্ট সার্চ কন্ট্রোল
            </h3>
            <div className="text-xs text-slate-500">
              ১-ক্লিক বাটনে যেকোনো ক্লাস ও সেকশনের ফি স্ট্যাটাস দেখুন
            </div>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="নাম, রোল, আইডি লিখুন..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl focus:outline-none focus:border-[#0c3664]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1 block">শ্রেণি</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full text-xs bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl px-3 py-2"
            >
              <option value="all">সকল শ্রেণি (৬ষ্ঠ - ১০ম)</option>
              <option value="6">৬ষ্ঠ শ্রেণি</option>
              <option value="7">৭ম শ্রেণি</option>
              <option value="8">৮ম শ্রেণি</option>
              <option value="9">৯ম শ্রেণি</option>
              <option value="10">১০ম শ্রেণি</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1 block">শাখা</label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="w-full text-xs bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl px-3 py-2"
            >
              <option value="all">সকল শাখা (A, B, C, D)</option>
              <option value="A">শাখা A</option>
              <option value="B">শাখা B</option>
              <option value="C">শাখা C</option>
              <option value="D">শাখা D</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1 block">পেমেন্ট অবস্থা</label>
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setSelectedStatus('all')}
                className={`flex-1 py-1.5 text-xs font-medium rounded-lg ${
                  selectedStatus === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                সকল
              </button>
              <button
                type="button"
                onClick={() => setSelectedStatus('paid')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg ${
                  selectedStatus === 'paid' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600'
                }`}
              >
                পরিশোধিত
              </button>
              <button
                type="button"
                onClick={() => setSelectedStatus('due')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg ${
                  selectedStatus === 'due' ? 'bg-white text-rose-700 shadow-xs' : 'text-slate-600'
                }`}
              >
                বকেয়া
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1 block">ব্যাংক অ্যাকাউন্ট</label>
            <select
              value={selectedBank}
              onChange={(e) => setSelectedBank(e.target.value as any)}
              className="w-full text-xs bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl px-3 py-2"
            >
              <option value="all">উভয় ব্যাংক (সকল শাখা)</option>
              <option value="বাংলাদেশ কৃষি ব্যাংক">বাংলাদেশ কৃষি ব্যাংক, নাপোড়া বাজার শাখা</option>
              <option value="আইএফআইসি ব্যাংক">আইএফআইসি ব্যাংক, নাপোড়া বাজার উপশাখা</option>
            </select>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white border border-[#d9e6e7] rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between text-xs">
          <span className="font-bold text-slate-900">
            শিক্ষার্থীদের ফি পরিশোধ বিবরণী ({filteredStudents.length} জন)
          </span>
          <div className="flex items-center gap-3">
            <span className="text-emerald-700 font-semibold">● সবুজ = পরিশোধিত</span>
            <span className="text-rose-700 font-semibold">● লাল = বকেয়া</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f0f6f6] border-b border-[#d2e5e7] text-slate-700 font-semibold">
              <tr>
                <th className="py-3 px-4">রোল ও আইডি</th>
                <th className="py-3 px-4">নাম</th>
                <th className="py-3 px-4">শ্রেণি ও শাখা</th>
                <th className="py-3 px-4 text-right">ফি ও বেতনের মাস</th>
                <th className="py-3 px-4 text-center">স্ট্যাটাস</th>
                <th className="py-3 px-4">ব্যাংক ও ট্রানজাকশন আইডি</th>
                <th className="py-3 px-4">পেমেন্ট তারিখ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map(student => (
                <tr key={student.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-mono font-medium text-slate-900">
                    <div>রোল: {student.roll}</div>
                    <div className="text-[10px] text-slate-400">{student.id}</div>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-900">{student.name}</td>
                  <td className="py-3 px-4 text-slate-600">{formatClassOrdinal(student.className)} · শাখা {student.section}</td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="font-mono font-bold text-slate-900">৳{student.monthlyFee + student.examFee}</div>
                    <div className="text-[10px] font-semibold mt-0.5 inline-block">
                      {student.status === 'paid' ? (
                        <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold border border-emerald-200">
                          {student.paidMonth || 'অক্টোবর ২০২৬'} (পরিশোধিত)
                        </span>
                      ) : (
                        <span className="bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full font-bold border border-rose-200">
                          {student.dueMonth || 'অক্টোবর ২০২৬'} (বকেয়া)
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {student.status === 'paid' ? (
                      <span className="inline-block bg-emerald-50 border border-emerald-200 text-emerald-700 px-2.5 py-0.5 rounded text-[11px] font-bold">
                        পরিশোধিত
                      </span>
                    ) : (
                      <span className="inline-block bg-rose-50 border border-rose-200 text-rose-700 px-2.5 py-0.5 rounded text-[11px] font-bold">
                        বকেয়া (Due)
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-700">
                    {student.status === 'paid' ? (
                      <div>
                        <div className="font-semibold text-[#0c3664]">{student.paidBank}</div>
                        <div className="font-mono text-[10px] text-slate-400">Txn: {student.txnId}</div>
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">এখনও জমা হয়নি</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                    {student.paymentDate || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
