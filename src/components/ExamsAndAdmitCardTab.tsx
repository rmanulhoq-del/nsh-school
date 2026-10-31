import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Users,
  Search,
  CheckCircle2,
  Calendar,
  Layers,
  Award,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Building,
  QrCode
} from 'lucide-react';
import { Student, ExamType, formatClassBangla, formatSectionBangla } from '../types';
import SchoolLogo from './SchoolLogo';

interface ExamsAndAdmitCardTabProps {
  students: Student[];
  isAdmin: boolean;
}

export default function ExamsAndAdmitCardTab({ students, isAdmin }: ExamsAndAdmitCardTabProps) {
  const [activeSubTab, setActiveSubTab] = useState<'admit' | 'seatplan' | 'reportcard'>('admit');
  const [selectedClass, setSelectedClass] = useState<string>('6');
  const [selectedSection, setSelectedSection] = useState<string>('A');
  const [selectedExam, setSelectedExam] = useState<ExamType>('১ম সাময়িক');
  const [examYear, setExamYear] = useState<string>('২০২৬');
  const [searchStudent, setSearchStudent] = useState<string>('');

  // Single active student for preview/modal
  const [activeStudentId, setActiveStudentId] = useState<string>(() => {
    const first = students.find(s => s.className === '6' && s.section === 'A');
    return first ? first.id : (students[0]?.id || '');
  });

  // Seat Plan room allocation settings
  const [rooms, setRooms] = useState([
    { roomNo: '১০১', building: 'প্রধান একাডেমিক ভবন (নিচতলা)', capacity: 40, classes: '৬ষ্ঠ ও ৯ম শ্রেণি' },
    { roomNo: '১০২', building: 'প্রধান একাডেমিক ভবন (নিচতলা)', capacity: 40, classes: '৭ম ও ১০ম শ্রেণি' },
    { roomNo: '২০১', building: 'বিজ্ঞান ভবন (দোতলা)', capacity: 35, classes: '৮ম শ্রেণি' },
    { roomNo: '২০২', building: 'বিজ্ঞান ভবন (দোতলা)', capacity: 35, classes: '৯ম ও ১০ম (বিজ্ঞান শাখা)' },
    { roomNo: '৩০১', building: 'মুহাম্মদ আলী মেমোরিয়াল ভবন (তেতলা)', capacity: 45, classes: 'সকল শ্রেণির অবশিষ্ট শিক্ষার্থী' }
  ]);

  // Exam Routine Schedule for Admit Card
  const examRoutine = [
    { date: '২৫/১০/২০২৬', day: 'রবিবার', subject: 'বাংলা ১ম পত্র', time: 'সকাল ১০:০০ - দুপুর ০১:০০' },
    { date: '২৭/১০/২০২৬', day: 'মঙ্গলবার', subject: 'বাংলা ২য় পত্র', time: 'সকাল ১০:০০ - দুপুর ০১:০০' },
    { date: '২৯/১০/২০২৬', day: 'বৃহস্পতিবার', subject: 'ইংরেজি ১ম পত্র', time: 'সকাল ১০:০০ - দুপুর ০১:০০' },
    { date: '০১/১১/২০২৬', day: 'রবিবার', subject: 'ইংরেজি ২য় পত্র', time: 'সকাল ১০:০০ - দুপুর ০১:০০' },
    { date: '০৩/১১/২০২৬', day: 'মঙ্গলবার', subject: 'গণিত (আবশ্যিক)', time: 'সকাল ১০:০০ - দুপুর ০১:০০' },
    { date: '০৫/১১/২০২৬', day: 'বৃহস্পতিবার', subject: 'সাধারণ বিজ্ঞান / পদার্থবিজ্ঞান', time: 'সকাল ১০:০০ - দুপুর ০১:০০' },
    { date: '০৮/১১/২০২৬', day: 'রবিবার', subject: 'ইসলাম ও নৈতিক শিক্ষা / হিন্দুধর্ম', time: 'সকাল ১০:০০ - দুপুর ০১:০০' },
    { date: '১০/১১/২০২৬', day: 'মঙ্গলবার', subject: 'তথ্য ও যোগাযোগ প্রযুক্তি (ICT)', time: 'সকাল ১০:০০ - দুপুর ১২:৩০' }
  ];

  const filteredStudents = students
    .filter(s => s.className === selectedClass && s.section === selectedSection)
    .filter(s => {
      if (!searchStudent.trim()) return true;
      const q = searchStudent.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.roll.toString().includes(q) ||
        s.id.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => a.roll - b.roll);

  const currentStudent = students.find(s => s.id === activeStudentId) || filteredStudents[0] || students[0];

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#0c3664] to-[#144275] text-white p-6 rounded-2xl shadow-md border-b-4 border-[#d9482b]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider mb-1">
              <Award className="w-4 h-4" />
              <span>পরীক্ষা নিয়ন্ত্রণ ও ফলাফল প্রস্তুতকরণ বিভাগ</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black">
              পরীক্ষার প্রবেশপত্র, সিট প্ল্যান ও Report Card
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-2xl">
              অফিসিয়াল প্রবেশপত্র জেনারেট, পরীক্ষার হল ও সিট প্ল্যান বিন্যাস এবং গ্রেডিং স্কেলসহ আধুনিক একাডেমিক প্রগ্রেস রিপোর্ট কার্ড।
            </p>
          </div>

          <button
            type="button"
            onClick={() => window.print()}
            className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all shrink-0"
          >
            <Printer className="w-4 h-4 text-slate-950" />
            <span>প্রিন্ট করুন</span>
          </button>
        </div>

        {/* Sub-tab pills */}
        <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-white/15">
          <button
            type="button"
            onClick={() => setActiveSubTab('admit')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeSubTab === 'admit'
                ? 'bg-[#d9482b] text-white shadow-xs'
                : 'bg-black/20 text-slate-200 hover:text-white hover:bg-black/30'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>পরীক্ষার প্রবেশপত্র (Admit Card)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('seatplan')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeSubTab === 'seatplan'
                ? 'bg-[#d9482b] text-white shadow-xs'
                : 'bg-black/20 text-slate-200 hover:text-white hover:bg-black/30'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>সিট প্ল্যান ও রুম বিন্যাস (Seat Plan)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('reportcard')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeSubTab === 'reportcard'
                ? 'bg-[#d9482b] text-white shadow-xs'
                : 'bg-black/20 text-slate-200 hover:text-white hover:bg-black/30'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>ফলাফল ও Report Card তৈরি</span>
          </button>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">পরীক্ষার নাম</label>
            <select
              value={selectedExam}
              onChange={e => setSelectedExam(e.target.value as ExamType)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-bold text-slate-800 focus:ring-2 focus:ring-[#0c3664] focus:outline-hidden"
            >
              <option value="১ম সাময়িক">১ম সাময়িক পরীক্ষা</option>
              <option value="২য় সাময়িক">২য় সাময়িক পরীক্ষা</option>
              <option value="বার্ষিক">বার্ষিক পরীক্ষা</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">শ্রেণি নির্বাচন</label>
            <select
              value={selectedClass}
              onChange={e => setSelectedClass(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-bold text-slate-800 focus:ring-2 focus:ring-[#0c3664] focus:outline-hidden"
            >
              <option value="6">৬ষ্ঠ শ্রেণি</option>
              <option value="7">৭ম শ্রেণি</option>
              <option value="8">৮ম শ্রেণি</option>
              <option value="9">৯ম শ্রেণি</option>
              <option value="10">১০ম শ্রেণি</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">শাখা নির্বাচন</label>
            <select
              value={selectedSection}
              onChange={e => setSelectedSection(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-bold text-slate-800 focus:ring-2 focus:ring-[#0c3664] focus:outline-hidden"
            >
              <option value="A">শাখা: ক (A)</option>
              <option value="B">শাখা: খ (B)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">শিক্ষার্থী খুঁজুন</label>
            <div className="relative">
              <input
                type="text"
                value={searchStudent}
                onChange={e => setSearchStudent(e.target.value)}
                placeholder="রোল বা নাম..."
                className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-[#0c3664] focus:outline-hidden"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>
        </div>
      </div>

      {/* SUB-TAB 1: ADMIT CARD GENERATOR */}
      {activeSubTab === 'admit' && currentStudent && (
        <div className="space-y-6">
          {/* Student Selector Quick Pills */}
          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            <span className="text-xs font-bold text-slate-500 shrink-0 mr-1">শিক্ষার্থী:</span>
            {filteredStudents.map(s => (
              <button
                key={s.id}
                type="button"
                onClick={() => setActiveStudentId(s.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all ${
                  activeStudentId === s.id
                    ? 'bg-[#0c3664] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                রোল {s.roll}: {s.name}
              </button>
            ))}
          </div>

          {/* Official Admit Card Design (A4 Half Size Printable Layout) */}
          <div className="bg-white border-2 border-[#0c3664] rounded-2xl p-6 sm:p-8 shadow-lg max-w-3xl mx-auto space-y-6 relative overflow-hidden">
            {/* Header */}
            <div className="border-b-2 border-[#d9482b] pb-4 flex items-center justify-between gap-4">
              <SchoolLogo size={64} className="shrink-0" />
              <div className="text-center flex-1">
                <div className="text-xs font-bold text-[#d9482b] uppercase tracking-wider">
                  গণপ্রজাতন্ত্রী বাংলাদেশ সরকার অনুমোদিত
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-[#0c3664]">
                  নাপোড়া শেখেরখীল উচ্চ বিদ্যালয়
                </h2>
                <p className="text-xs text-slate-600 font-medium">
                  ডাক: নাপোড়া, উপজেলা: বাঁশখালী, জেলা: চট্টগ্রাম · ইআইআইএন: ১০৪০৬২
                </p>
                <div className="inline-block bg-[#0c3664] text-white font-black text-xs sm:text-sm px-4 py-1 rounded-full uppercase tracking-wide mt-2 shadow-xs">
                  {selectedExam} পরীক্ষা {examYear} - প্রবেশপত্র (Admit Card)
                </div>
              </div>

              {/* Student Photo Placeholder */}
              <div className="w-20 h-24 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center text-[10px] text-slate-400 bg-slate-50 shrink-0">
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center mb-1 text-slate-500 font-bold">
                  {currentStudent.name.charAt(0)}
                </div>
                <span>ছবি</span>
              </div>
            </div>

            {/* Student Identification Meta Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
              <div>
                <span className="text-slate-500 block text-[11px]">শিক্ষার্থীর নাম:</span>
                <span className="font-extrabold text-slate-900">{currentStudent.name}</span>
              </div>

              <div>
                <span className="text-slate-500 block text-[11px]">শ্রেণি ও শাখা:</span>
                <span className="font-extrabold text-slate-900">
                  {formatClassBangla(currentStudent.className)} · {formatSectionBangla(currentStudent.section)}
                </span>
              </div>

              <div>
                <span className="text-slate-500 block text-[11px]">শ্রেণি রোল:</span>
                <span className="font-black text-lg text-red-600">{currentStudent.roll}</span>
              </div>

              <div>
                <span className="text-slate-500 block text-[11px]">স্টুডেন্ট আইডি:</span>
                <span className="font-mono font-bold text-slate-800">{currentStudent.id}</span>
              </div>

              <div>
                <span className="text-slate-500 block text-[11px]">পিতা / অভিভাবক:</span>
                <span className="font-semibold text-slate-800">{currentStudent.guardianName}</span>
              </div>

              <div>
                <span className="text-slate-500 block text-[11px]">মোবাইল নম্বর:</span>
                <span className="font-mono text-slate-800">{currentStudent.guardianPhone}</span>
              </div>

              <div>
                <span className="text-slate-500 block text-[11px]">ফি পরিশোধের স্থিতি:</span>
                <span className="font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>পরিশোধিত (Approved)</span>
                </span>
              </div>

              <div>
                <span className="text-slate-500 block text-[11px]">পরীক্ষার রুম নং:</span>
                <span className="font-bold text-indigo-900">রুম নং ১০১</span>
              </div>
            </div>

            {/* Exam Schedule Routine Table */}
            <div>
              <div className="text-xs font-bold text-[#0c3664] mb-2 uppercase flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#d9482b]" />
                <span>পরীক্ষার বিষয় ও সময়সূচি তালিকা</span>
              </div>
              <div className="border border-slate-300 rounded-xl overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
                    <tr>
                      <th className="py-2 px-3">তারিখ ও বার</th>
                      <th className="py-2 px-3">বিষয়</th>
                      <th className="py-2 px-3">পরীক্ষার সময়</th>
                      <th className="py-2 px-3 text-center">কক্ষ পরিদর্শকের স্বাক্ষর</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {examRoutine.map((item, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                        <td className="py-1.5 px-3 font-semibold text-slate-800">
                          {item.date} ({item.day})
                        </td>
                        <td className="py-1.5 px-3 font-bold text-slate-900">{item.subject}</td>
                        <td className="py-1.5 px-3 text-slate-600">{item.time}</td>
                        <td className="py-1.5 px-3 text-center text-slate-300 font-mono text-[10px]">
                          ..............
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Exam Hall Code of Conduct */}
            <div className="bg-amber-50/70 border border-amber-200 p-3 rounded-xl text-[11px] text-amber-900 space-y-1">
              <div className="font-bold text-amber-950 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                <span>পরীক্ষার্থীদের জন্য বিশেষ নির্দেশনাবলী:</span>
              </div>
              <ul className="list-disc list-inside space-y-0.5 text-slate-700 text-[10px]">
                <li>পরীক্ষা শুরুর কমপক্ষে ১৫ মিনিট পূর্বে নির্দিষ্ট আসন গ্রহণ করতে হবে।</li>
                <li>প্রবেশপত্র (Admit Card) ব্যতীত কাউকে পরীক্ষা কক্ষে প্রবেশ করতে দেওয়া হবে না।</li>
                <li>পরীক্ষা কক্ষে মোবাইল ফোন বা যে কোনো ডিজিটাল ইলেকট্রনিক ডিভাইস বহন সম্পূর্ণ নিষিদ্ধ।</li>
              </ul>
            </div>

            {/* Official Signatures Bar */}
            <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-xs text-slate-800">
              <div className="text-center">
                <div className="w-36 border-b border-slate-400 mb-1"></div>
                <span className="text-[11px] text-slate-600">শ্রেণি শিক্ষকের স্বাক্ষর</span>
              </div>

              <div className="text-center">
                <div className="w-36 border-b border-slate-400 mb-1"></div>
                <span className="text-[11px] text-slate-600">শিক্ষার্থীর পূর্ণ স্বাক্ষর</span>
              </div>

              <div className="text-center">
                <div className="w-40 border-b-2 border-[#0c3664] mb-1 font-bold text-[#0c3664]">
                  মোঃ জাহাঙ্গীর আলম
                </div>
                <span className="text-[11px] font-extrabold text-[#0c3664] block">প্রধান শিক্ষক</span>
                <span className="text-[10px] text-slate-500">নাপোড়া শেখেরখীল উচ্চ বিদ্যালয়</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: SEAT PLAN & ROOM ARRANGEMENT */}
      {activeSubTab === 'seatplan' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-[#0c3664]">
                  পরীক্ষা কক্ষ ও সিট প্ল্যান বিন্যাস (Exam Hall & Room Allocation)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  প্রতিটি কক্ষের ধারণক্ষমতা, শ্রেণি বণ্টন ও বেঞ্চে সাঁটানোর জন্য ডেস্ক স্লিপ।
                </p>
              </div>

              <button
                type="button"
                onClick={() => window.print()}
                className="px-3.5 py-1.5 bg-[#0c3664] hover:bg-[#144275] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Printer className="w-3.5 h-3.5 text-amber-300" />
                <span>মাস্টার সিট প্ল্যান প্রিন্ট</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rooms.map((room, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 hover:border-blue-400 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[#0c3664] text-white font-black text-xs flex items-center justify-center">
                        {room.roomNo}
                      </div>
                      <div>
                        <div className="font-extrabold text-xs text-slate-900">কক্ষ নং {room.roomNo}</div>
                        <div className="text-[10px] text-slate-500">{room.building}</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                      আসন: {room.capacity}
                    </span>
                  </div>

                  <div className="text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-500 block text-[10px]">নির্ধারিত শ্রেণি:</span>
                    <span className="font-bold text-[#0c3664]">{room.classes}</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200">
                    <span className="text-slate-500">বেঞ্চ সংখ্যা: ২০টি (প্রতি বেঞ্চ ২ জন)</span>
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="text-xs font-bold text-blue-700 hover:underline"
                    >
                      ডেস্ক স্লিপ প্রিন্ট →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Desk Slips Sheet Preview (যা বেঞ্চে লাগানো হয়) */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Building className="w-4 h-4 text-[#d9482b]" />
                <span>ডেস্ক স্লিপ প্রিভিউ (প্রতি বেঞ্চে লাগানোর স্টিকার)</span>
              </h4>
              <span className="text-[11px] text-slate-500">প্রিন্ট করলে প্রতিটি কাট করে বেঞ্চে সাঁটানো যাবে</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {filteredStudents.slice(0, 8).map(s => (
                <div key={s.id} className="border-2 border-dashed border-slate-300 p-3 rounded-xl bg-slate-50/50 space-y-2">
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
                    <span className="text-[10px] font-bold text-[#0c3664]">নাপোড়া শেখেরখীল উ.বি.</span>
                    <span className="text-[9px] bg-red-600 text-white font-extrabold px-1.5 py-0.2 rounded">
                      রুম ১০১
                    </span>
                  </div>

                  <div className="text-center py-1">
                    <div className="text-2xl font-black text-red-600 leading-none">রোল: {s.roll}</div>
                    <div className="font-extrabold text-xs text-slate-900 mt-1 truncate">{s.name}</div>
                    <div className="text-[10px] text-slate-500">শ্রেণি: {formatClassBangla(s.className)} (শাখা {s.section})</div>
                  </div>

                  <div className="pt-1 border-t border-slate-200 flex items-center justify-between text-[9px] text-slate-400 font-mono">
                    <span>{selectedExam} ২০২৬</span>
                    <span>আইডি: {s.id}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: REPORT CARD GENERATOR */}
      {activeSubTab === 'reportcard' && currentStudent && (
        <div className="space-y-6">
          <div className="bg-white border-2 border-slate-300 rounded-2xl p-6 sm:p-8 shadow-lg max-w-3xl mx-auto space-y-6">
            {/* Header */}
            <div className="text-center border-b-2 border-[#0c3664] pb-4">
              <SchoolLogo size={56} className="mx-auto mb-2" />
              <h2 className="text-xl sm:text-2xl font-black text-[#0c3664]">
                নাপোড়া শেখেরখীল উচ্চ বিদ্যালয়
              </h2>
              <p className="text-xs text-slate-600">ডাক: নাপোড়া, বাঁশখালী, চট্টগ্রাম · ইআইআইএন: ১০৪০৬২</p>
              <div className="inline-block bg-[#d9482b] text-white font-bold text-xs px-4 py-1 rounded-full uppercase tracking-wide mt-2">
                শিক্ষার্থী একাডেমিক প্রগ্রেস রিপোর্ট কার্ড (Report Card)
              </div>
            </div>

            {/* Student Info */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
              <div>
                <span className="text-slate-500 block text-[10px]">শিক্ষার্থীর নাম:</span>
                <span className="font-bold text-slate-900">{currentStudent.name}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">শ্রেণি ও শাখা:</span>
                <span className="font-bold text-slate-900">{formatClassBangla(currentStudent.className)} ({currentStudent.section})</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">শ্রেণি রোল:</span>
                <span className="font-black text-red-600 text-sm">{currentStudent.roll}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">পরীক্ষার নাম:</span>
                <span className="font-bold text-slate-900">{selectedExam} {examYear}</span>
              </div>
            </div>

            {/* Marksheet & Grading Table */}
            <div className="border border-slate-300 rounded-xl overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#0c3664] text-white font-bold">
                  <tr>
                    <th className="py-2.5 px-3">বিষয়</th>
                    <th className="py-2.5 px-2 text-center">পূর্ণমান</th>
                    <th className="py-2.5 px-2 text-center">CQ</th>
                    <th className="py-2.5 px-2 text-center">MCQ</th>
                    <th className="py-2.5 px-2 text-center">মোট প্রাপ্ত</th>
                    <th className="py-2.5 px-2 text-center">লেটার গ্রেড</th>
                    <th className="py-2.5 px-2 text-center">জিপি (GP)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-800 font-semibold">
                  <tr>
                    <td className="py-2 px-3">বাংলা (১ম ও ২য় পত্র)</td>
                    <td className="py-2 px-2 text-center">১০০</td>
                    <td className="py-2 px-2 text-center">৫৮</td>
                    <td className="py-2 px-2 text-center">২৫</td>
                    <td className="py-2 px-2 text-center font-bold text-slate-900">৮৩</td>
                    <td className="py-2 px-2 text-center font-black text-emerald-700">A+</td>
                    <td className="py-2 px-2 text-center font-bold">৫.০০</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3">ইংরেজি (১ম ও ২য় পত্র)</td>
                    <td className="py-2 px-2 text-center">১০০</td>
                    <td className="py-2 px-2 text-center">৫৪</td>
                    <td className="py-2 px-2 text-center">২২</td>
                    <td className="py-2 px-2 text-center font-bold text-slate-900">৭৬</td>
                    <td className="py-2 px-2 text-center font-black text-blue-700">A</td>
                    <td className="py-2 px-2 text-center font-bold">৪.০০</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3">গণিত</td>
                    <td className="py-2 px-2 text-center">১০০</td>
                    <td className="py-2 px-2 text-center">৬৫</td>
                    <td className="py-2 px-2 text-center">২৮</td>
                    <td className="py-2 px-2 text-center font-bold text-slate-900">৯৩</td>
                    <td className="py-2 px-2 text-center font-black text-emerald-700">A+</td>
                    <td className="py-2 px-2 text-center font-bold">৫.০০</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3">সাধারণ বিজ্ঞান</td>
                    <td className="py-2 px-2 text-center">১০০</td>
                    <td className="py-2 px-2 text-center">৫২</td>
                    <td className="py-2 px-2 text-center">২৬</td>
                    <td className="py-2 px-2 text-center font-bold text-slate-900">৭৮</td>
                    <td className="py-2 px-2 text-center font-black text-blue-700">A</td>
                    <td className="py-2 px-2 text-center font-bold">৪.০০</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3">ইসলাম ও নৈতিক শিক্ষা</td>
                    <td className="py-2 px-2 text-center">১০০</td>
                    <td className="py-2 px-2 text-center">৬০</td>
                    <td className="py-2 px-2 text-center">২৭</td>
                    <td className="py-2 px-2 text-center font-bold text-slate-900">৮৭</td>
                    <td className="py-2 px-2 text-center font-black text-emerald-700">A+</td>
                    <td className="py-2 px-2 text-center font-bold">৫.০০</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3">তথ্য ও যোগাযোগ প্রযুক্তি</td>
                    <td className="py-2 px-2 text-center">৫০</td>
                    <td className="py-2 px-2 text-center">-</td>
                    <td className="py-2 px-2 text-center">২২</td>
                    <td className="py-2 px-2 text-center font-bold text-slate-900">৪৫</td>
                    <td className="py-2 px-2 text-center font-black text-emerald-700">A+</td>
                    <td className="py-2 px-2 text-center font-bold">৫.০০</td>
                  </tr>
                </tbody>
                <tfoot className="bg-slate-100 font-bold border-t-2 border-slate-300">
                  <tr>
                    <td className="py-2.5 px-3">সর্বমোট নম্বর ও জিপিএ</td>
                    <td className="py-2.5 px-2 text-center">৫৫০</td>
                    <td colSpan={2} className="py-2.5 px-2 text-center">অর্জিত মোট: ৪৬২</td>
                    <td className="py-2.5 px-2 text-center font-black text-emerald-700">পাস</td>
                    <td className="py-2.5 px-2 text-center font-black text-blue-800">A+</td>
                    <td className="py-2.5 px-2 text-center font-black text-lg text-emerald-700">৪.৮৩</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Performance Summary */}
            <div className="grid grid-cols-3 gap-3 text-center text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-slate-500 block text-[10px]">শ্রেণিতে মেধা স্থান:</span>
                <span className="font-black text-lg text-[#0c3664]">১ম স্থান</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-slate-500 block text-[10px]">বাৎসরিক উপস্থিতি:</span>
                <span className="font-black text-lg text-emerald-700">৯৫.৪%</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-slate-500 block text-[10px]">আচরণ ও নিয়মানুবর্তিতা:</span>
                <span className="font-black text-lg text-indigo-700">উত্তম (A+)</span>
              </div>
            </div>

            {/* Signatures */}
            <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-xs text-slate-800">
              <div className="text-center">
                <div className="w-32 border-b border-slate-400 mb-1"></div>
                <span className="text-[11px] text-slate-600">অভিভাবকের স্বাক্ষর</span>
              </div>
              <div className="text-center">
                <div className="w-32 border-b border-slate-400 mb-1"></div>
                <span className="text-[11px] text-slate-600">শ্রেণি শিক্ষকের স্বাক্ষর</span>
              </div>
              <div className="text-center">
                <div className="w-36 border-b-2 border-[#0c3664] mb-1 font-bold text-[#0c3664]">
                  মোঃ জাহাঙ্গীর আলম
                </div>
                <span className="text-[11px] font-extrabold text-[#0c3664] block">প্রধান শিক্ষক</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
