import React, { useState, useMemo } from 'react';
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
  QrCode,
  Lock,
  KeyRound,
  FileSpreadsheet,
  Pencil,
  Sparkles,
  TrendingUp,
  RotateCcw,
  AlertCircle
} from 'lucide-react';
import { Student, ExamType, ExamRoutineItem, DEFAULT_EXAM_ROUTINE, formatClassBangla, formatSectionBangla, formatGroupBangla, sortStudentsBySerial } from '../types';
import SchoolLogo from './SchoolLogo';
import StudentMarksheetModal from './StudentMarksheetModal';
import ClassTabulationSheetModal from './ClassTabulationSheetModal';
import ExamMarksEntryModal from './ExamMarksEntryModal';
import ExamRoutineEditModal from './ExamRoutineEditModal';
import { generateSampleMarksForStudent, evaluateStudentMarks, getSubjectConfigsForClass } from '../data/examRules';

interface ExamsAndAdmitCardTabProps {
  students: Student[];
  setStudents?: React.Dispatch<React.SetStateAction<Student[]>>;
  isAdmin: boolean;
  onRequireAdminLogin?: () => void;
}

export default function ExamsAndAdmitCardTab({
  students,
  setStudents,
  isAdmin,
  onRequireAdminLogin
}: ExamsAndAdmitCardTabProps) {
  const [activeSubTab, setActiveSubTab] = useState<'result' | 'tabulation' | 'marks_entry' | 'admit' | 'seatplan'>('result');
  const [selectedClass, setSelectedClass] = useState<string>('6');
  const [selectedSection, setSelectedSection] = useState<string>('A');
  const [selectedGender, setSelectedGender] = useState<'all' | 'male' | 'female'>('all');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [selectedExam, setSelectedExam] = useState<ExamType>('১ম সাময়িক');
  const [examYear, setExamYear] = useState<string>('২০২৬');
  const [searchStudent, setSearchStudent] = useState<string>('');

  // Modals State
  const [showMarksEntryModal, setShowMarksEntryModal] = useState<boolean>(false);
  const [showTabulationModal, setShowTabulationModal] = useState<boolean>(false);
  const [showMarksheetModal, setShowMarksheetModal] = useState<boolean>(false);
  const [showRoutineEditModal, setShowRoutineEditModal] = useState<boolean>(false);
  const [selectedStudentForMarksheet, setSelectedStudentForMarksheet] = useState<Student | null>(null);

  // Exam Routine Schedule for Admit Card (Loaded from localStorage or default)
  const [examRoutine, setExamRoutine] = useState<ExamRoutineItem[]>(() => {
    try {
      const saved = localStorage.getItem('school_exam_routine');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [...DEFAULT_EXAM_ROUTINE];
  });

  // Student Passcode Result Search State
  const [passcodeClass, setPasscodeClass] = useState<string>('6');
  const [passcodeSection, setPasscodeSection] = useState<string>('A');
  const [passcodeGroup, setPasscodeGroup] = useState<string>('all');
  const [passcodeExam, setPasscodeExam] = useState<ExamType>('১ম সাময়িক');
  const [passcodeRoll, setPasscodeRoll] = useState<string>('1');
  const [passcodePin, setPasscodePin] = useState<string>('');
  const [passcodeError, setPasscodeError] = useState<string>('');
  // Secure Result Privacy: Always start as null so no student result is displayed until authenticated with passcode
  const [searchResultStudent, setSearchResultStudent] = useState<Student | null>(null);

  // Privacy lock: Whenever user switches sub-tab or navigates away, clear searched student result
  React.useEffect(() => {
    setSearchResultStudent(null);
    setPasscodePin('');
    setPasscodeError('');
  }, [activeSubTab]);

  // Active student for admit card
  const [activeStudentId, setActiveStudentId] = useState<string>(() => {
    const first = students.find(s => s.className === '6' && s.section === 'A');
    return first ? first.id : (students[0]?.id || '');
  });

  // Seat Plan room allocation settings
  const [rooms] = useState([
    { roomNo: '১০১', building: 'প্রধান একাডেমিক ভবন (নিচতলা)', capacity: 40, classes: '৬ষ্ঠ ও ৯ম শ্রেণি' },
    { roomNo: '১০২', building: 'প্রধান একাডেমিক ভবন (নিচতলা)', capacity: 40, classes: '৭ম ও ১০ম শ্রেণি' },
    { roomNo: '২০১', building: 'বিজ্ঞান ভবন (দোতলা)', capacity: 35, classes: '৮ম শ্রেণি' },
    { roomNo: '২০২', building: 'বিজ্ঞান ভবন (দোতলা)', capacity: 35, classes: '৯ম ও ১০ম (বিজ্ঞান শাখা)' },
    { roomNo: '৩০১', building: 'মুহাম্মদ আলী মেমোরিয়াল ভবন (তেতলা)', capacity: 45, classes: 'সকল শ্রেণির অবশিষ্ট শিক্ষার্থী' }
  ]);

  const isNineOrTenSelected = selectedClass === '9' || selectedClass === '10';

  const filteredStudents = useMemo(() => {
    const list = students
      .filter(s => {
        if (s.className !== selectedClass) return false;
        if (selectedSection !== 'all' && s.section !== selectedSection) return false;
        if (selectedGender !== 'all' && s.gender !== selectedGender) return false;
        if (isNineOrTenSelected && selectedGroup !== 'all' && s.group !== selectedGroup) return false;
        if (!searchStudent.trim()) return true;
        const q = searchStudent.toLowerCase();
        return (
          s.name.toLowerCase().includes(q) ||
          s.roll.toString().includes(q) ||
          s.id.toLowerCase().includes(q)
        );
      });

    return sortStudentsBySerial(list);
  }, [students, selectedClass, selectedSection, selectedGender, selectedGroup, isNineOrTenSelected, searchStudent]);

  const currentStudent = students.find(s => s.id === activeStudentId) || filteredStudents[0] || students[0];

  // Handle Student Passcode & Roll Result Lookup
  const handleStudentResultSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPasscodeError('');

    if (!passcodeRoll.trim()) {
      setSearchResultStudent(null);
      setPasscodeError('অনুগ্রহ করে শিক্ষার্থীর শ্রেণি রোল নম্বর লিখুন।');
      return;
    }

    const rollNum = parseInt(passcodeRoll.trim(), 10);
    const isNineOrTenPasscode = passcodeClass === '9' || passcodeClass === '10';

    const found = students.find(s => {
      if (s.className !== passcodeClass || s.section !== passcodeSection || s.roll !== rollNum) return false;
      if (isNineOrTenPasscode && passcodeGroup !== 'all' && s.group !== passcodeGroup) return false;
      return true;
    });

    if (!found) {
      setSearchResultStudent(null);
      const groupNote = isNineOrTenPasscode && passcodeGroup !== 'all'
        ? `, বিভাগ: ${formatGroupBangla(passcodeGroup)}`
        : '';
      setPasscodeError(`প্রদত্ত শ্রেণি (${formatClassBangla(passcodeClass)}), ${formatSectionBangla(passcodeSection)}${groupNote} ও রোল নং (${passcodeRoll})-এর কোনো শিক্ষার্থী পাওয়া যায়নি।`);
      return;
    }

    // Passcode validation: Mandatory for individual student result confidentiality
    const enteredPin = passcodePin.trim();
    if (!enteredPin) {
      setSearchResultStudent(null);
      setPasscodeError('অনুগ্রহ করে শিক্ষার্থীর গোপন পাসকোড (Passcode / PIN) লিখুন।');
      return;
    }

    const phoneDigits = (found.guardianPhone || '').replace(/\D/g, '');
    const phoneLast4 = phoneDigits.slice(-4);
    const rollStr = found.roll.toString();
    const idMatch = found.id.toLowerCase() === enteredPin.toLowerCase();
    const pinMatch = enteredPin === '1234' || enteredPin === rollStr || enteredPin === phoneLast4 || idMatch;

    if (!pinMatch) {
      setSearchResultStudent(null);
      setPasscodeError('প্রদত্ত পাসকোডটি সঠিক নয়! নিরাপত্তা ও গোপনীয়তা রক্ষার স্বার্থে সঠিক পাসকোড প্রদান করুন। (সহায়তা: পাসকোড হিসেবে ১২৩৪, শিক্ষার্থীর আইডি অথবা রোল নম্বর ব্যবহার করা যাবে)');
      return;
    }

    setSearchResultStudent(found);
    setSelectedExam(passcodeExam);
  };

  // Compute exam record for active search result student
  const activeStudentExamRecord = useMemo(() => {
    if (!searchResultStudent) return null;
    if (searchResultStudent.examRecords && searchResultStudent.examRecords[passcodeExam]) {
      return searchResultStudent.examRecords[passcodeExam];
    }
    return generateSampleMarksForStudent(searchResultStudent, passcodeExam);
  }, [searchResultStudent, passcodeExam]);

  // Tabulation sheet stats for preview
  const tabulationStats = useMemo(() => {
    const isNineOrTen = selectedClass === '9' || selectedClass === '10';
    const classStus = students.filter(s => {
      if (s.className !== selectedClass) return false;
      if (selectedSection !== 'all' && s.section !== selectedSection) return false;
      if (isNineOrTen && selectedGroup !== 'all' && s.group !== selectedGroup) return false;
      return true;
    });
    const records = classStus.map(s => {
      if (s.examRecords && s.examRecords[selectedExam]) return s.examRecords[selectedExam];
      return generateSampleMarksForStudent(s, selectedExam);
    });
    const total = records.length;
    const passed = records.filter(r => r.isPassed).length;
    const failed = total - passed;
    const aPlus = records.filter(r => r.grade === 'A+').length;
    const passRate = total > 0 ? ((passed / total) * 100).toFixed(1) : '০';

    return { total, passed, failed, aPlus, passRate };
  }, [students, selectedClass, selectedSection, selectedGroup, selectedExam]);

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#0c3664] to-[#144275] text-white p-6 rounded-2xl shadow-md border-b-4 border-[#d9482b]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider mb-1">
              <Award className="w-4 h-4" />
              <span>পরীক্ষা নিয়ন্ত্রণ ও ফলাফল প্রস্তুতকরণ কেন্দ্র</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black">
              পরীক্ষা, ফলাফল ও মার্কশীট ব্যবস্থাপনা পোর্টাল
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-2xl">
              ১ম সাময়িক, ২য় সাময়িক ও বার্ষিক পরীক্ষার নম্বর এন্ট্রি, ক্লাসের সার্বিক টেবুলেশন শীট, শিক্ষার্থীদের পাসকোড ভিত্তিক ফলাফল অনুসন্ধান ও অফিশিয়াল প্রবেশপত্র।
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isAdmin && setStudents && (
              <button
                type="button"
                onClick={() => setShowMarksEntryModal(true)}
                className="px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all border border-emerald-400/50"
                title="১ম, ২য় বা বার্ষিক পরীক্ষার নম্বর ইনপুট দিন"
              >
                <Pencil className="w-3.5 h-3.5 text-amber-300" />
                <span>📝 নম্বর এন্ট্রি</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowTabulationModal(true)}
              className="px-3.5 py-2 bg-[#092544] hover:bg-[#061c36] border border-amber-400/50 text-amber-300 hover:text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all"
              title="পুরো ক্লাসের টেবুলেশন শীট দেখুন ও প্রিন্ট করুন"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-amber-400" />
              <span>📊 টেবুলেশন শীট</span>
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="px-3.5 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Printer className="w-4 h-4 text-slate-950" />
              <span>প্রিন্ট</span>
            </button>
          </div>
        </div>

        {/* Sub-tab pills */}
        <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-white/15">
          <button
            type="button"
            onClick={() => setActiveSubTab('result')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeSubTab === 'result'
                ? 'bg-[#d9482b] text-white shadow-xs'
                : 'bg-black/20 text-slate-200 hover:text-white hover:bg-black/30'
            }`}
          >
            <Search className="w-4 h-4 text-amber-300" />
            <span>🔍 শিক্ষার্থী রেজাল্ট ও মার্কশীট</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('tabulation')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeSubTab === 'tabulation'
                ? 'bg-[#d9482b] text-white shadow-xs'
                : 'bg-black/20 text-slate-200 hover:text-white hover:bg-black/30'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>📊 সার্বিক টেবুলেশন শীট (Tabulation)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('marks_entry')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeSubTab === 'marks_entry'
                ? 'bg-[#d9482b] text-white shadow-xs'
                : 'bg-black/20 text-slate-200 hover:text-white hover:bg-black/30'
            }`}
          >
            <Pencil className="w-4 h-4" />
            <span>📝 পরীক্ষার নম্বর এন্ট্রি (Marks Entry)</span>
          </button>

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
            <span>🪪 পরীক্ষার প্রবেশপত্র (Admit Card)</span>
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
            <span>🪑 সিট প্ল্যান ও হল বিন্যাস</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* SUB-TAB 1: STUDENT RESULT SEARCH BY PASSCODE & ROLL            */}
      {/* ============================================================== */}
      {activeSubTab === 'result' && (
        <div className="space-y-6">
          {/* Result Search Form Card */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100">
              <KeyRound className="w-5 h-5 text-[#0c3664]" />
              <div>
                <h3 className="text-base font-extrabold text-[#0c3664]">
                  শিক্ষার্থীর ফলাফল ও অফিশিয়াল নম্বর ফর্দ অনুসন্ধান
                </h3>
                <p className="text-xs text-slate-500">
                  পরীক্ষা, শ্রেণি, রোল এবং পাসকোড প্রদান করে মুহূর্তের মধ্যে নিজের রেজাল্ট ও গ্রেডিং পয়েন্ট দেখুন।
                </p>
              </div>
            </div>

            <form onSubmit={handleStudentResultSearch} className="space-y-4">
              <div className={`grid grid-cols-1 sm:grid-cols-2 ${(passcodeClass === '9' || passcodeClass === '10') ? 'lg:grid-cols-3 xl:grid-cols-6' : 'lg:grid-cols-5'} gap-3`}>
                {/* Exam Type */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    পরীক্ষার নাম <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={passcodeExam}
                    onChange={e => setPasscodeExam(e.target.value as ExamType)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-[#0c3664] focus:outline-hidden bg-slate-50"
                  >
                    <option value="১ম সাময়িক">১ম সাময়িক পরীক্ষা</option>
                    <option value="২য় সাময়িক">২য় সাময়িক পরীক্ষা</option>
                    <option value="বার্ষিক">বার্ষিক পরীক্ষা</option>
                  </select>
                </div>

                {/* Class */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    শ্রেণি নির্বাচন <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={passcodeClass}
                    onChange={e => {
                      setPasscodeClass(e.target.value);
                      setPasscodeError('');
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-[#0c3664] focus:outline-hidden bg-slate-50"
                  >
                    <option value="6">৬ষ্ঠ শ্রেণি</option>
                    <option value="7">৭ম শ্রেণি</option>
                    <option value="8">৮ম শ্রেণি</option>
                    <option value="9">৯ম শ্রেণি</option>
                    <option value="10">১০ম শ্রেণি</option>
                  </select>
                </div>

                {/* Section (4 Sections: ক, খ, গ, ঘ) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    শাখা নির্বাচন <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={passcodeSection}
                    onChange={e => {
                      setPasscodeSection(e.target.value);
                      setPasscodeError('');
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-[#0c3664] focus:outline-hidden bg-slate-50"
                  >
                    <option value="A">শাখা: ক (A)</option>
                    <option value="B">শাখা: খ (B)</option>
                    <option value="C">শাখা: গ (C)</option>
                    <option value="D">শাখা: ঘ (D)</option>
                  </select>
                </div>

                {/* Group Selector for Class 9 and 10 */}
                {(passcodeClass === '9' || passcodeClass === '10') && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                        <span>বিভাগ (৯ম ও ১০ম)</span>
                      </span>
                      <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-bold">
                        সক্রিয়
                      </span>
                    </label>
                    <select
                      value={passcodeGroup}
                      onChange={e => {
                        setPasscodeGroup(e.target.value);
                        setPasscodeError('');
                      }}
                      className="w-full px-3 py-2 border border-amber-300 rounded-xl text-xs font-bold text-amber-950 focus:ring-2 focus:ring-amber-500 focus:outline-hidden bg-amber-50/70"
                    >
                      <option value="all">সকল বিভাগ</option>
                      <option value="science">🧪 বিজ্ঞান বিভাগ (Science Group)</option>
                      <option value="humanities">📚 মানবিক বিভাগ (Humanities Group)</option>
                      <option value="business">💼 ব্যবসায় শিক্ষা (Business Studies)</option>
                    </select>
                  </div>
                )}

                {/* Roll Number */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    শ্রেণি রোল নং <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={passcodeRoll}
                    onChange={e => {
                      setPasscodeRoll(e.target.value);
                      setSearchResultStudent(null);
                      setPasscodeError('');
                    }}
                    placeholder="যেমন: ১"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-[#0c3664] focus:outline-hidden"
                    required
                  />
                </div>

                {/* Student Passcode / PIN */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                    <span>পাসকোড (গোপন PIN) <span className="text-red-500">*</span></span>
                    <span className="text-[10px] text-amber-700 font-semibold">(যেমন: ১২৩৪)</span>
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      value={passcodePin}
                      onChange={e => {
                        setPasscodePin(e.target.value);
                        setSearchResultStudent(null);
                        setPasscodeError('');
                      }}
                      placeholder="গোপন পাসকোড..."
                      className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-[#0c3664] focus:outline-hidden"
                    />
                    <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  </div>
                </div>
              </div>

              {/* Quick Filter Shortcuts (matching Image 2) */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100 text-xs">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="font-bold text-slate-500 text-[11px] mr-1">শ্রেণি শর্টকাট:</span>
                  {['6', '7', '8', '9', '10'].map(cls => (
                    <button
                      key={cls}
                      type="button"
                      onClick={() => {
                        setPasscodeClass(cls);
                        setSearchResultStudent(null);
                        setPasscodeError('');
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                        passcodeClass === cls
                          ? 'bg-[#0c3664] text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {formatClassBangla(cls)}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="font-bold text-slate-500 text-[11px] mr-1">শাখা:</span>
                  {[
                    { id: 'A', label: "শাখা 'ক' (A)" },
                    { id: 'B', label: "শাখা 'খ' (B)" },
                    { id: 'C', label: "শাখা 'গ' (C)" },
                    { id: 'D', label: "শাখা 'ঘ' (D)" }
                  ].map(sec => (
                    <button
                      key={sec.id}
                      type="button"
                      onClick={() => {
                        setPasscodeSection(sec.id);
                        setSearchResultStudent(null);
                        setPasscodeError('');
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                        passcodeSection === sec.id
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {sec.label}
                    </button>
                  ))}
                </div>
              </div>

              {passcodeError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{passcodeError}</span>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <span className="text-[11px] text-slate-500">
                  💡 <strong>সহায়তা:</strong> শিক্ষার্থী বা অভিভাবক রোল নম্বর ও পাসকোড (অথবা ডিফল্ট পাসকোড <strong>১২৩৪</strong>) দিয়ে যেকোনো সময় নিজের রেজাল্ট দেখতে পারবেন।
                </span>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-[#0c3664] to-[#144275] hover:from-[#092b50] hover:to-[#0f345c] text-white font-extrabold rounded-xl text-xs flex items-center gap-2 shadow-xs transition-transform active:scale-95"
                >
                  <Search className="w-4 h-4 text-amber-300" />
                  <span>ফলাফল ও নম্বর ফর্দ অনুসন্ধান করুন</span>
                </button>
              </div>
            </form>
          </div>

          {/* Result Display Card */}
          {searchResultStudent && activeStudentExamRecord && (
            <div className="bg-white rounded-2xl p-6 sm:p-8 border-2 border-[#0c3664] shadow-lg max-w-4xl mx-auto space-y-6">
              {/* Privacy Session Banner & Close Button */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-emerald-50 border border-emerald-300 p-3.5 rounded-xl text-xs">
                <div className="flex items-center gap-2 text-emerald-950 font-bold">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <span>🔒 ব্যক্তিগত ফলাফল ও নম্বর ফর্দ ভিউ সক্রিয় ({searchResultStudent.name})</span>
                    <span className="block text-[11px] text-slate-500 font-normal">
                      পাসকোড ভেরিফিকেশনের মাধ্যমে খোলা হয়েছে। দেখা শেষে অন্য কেউ যাতে দেখতে না পারে সেজন্য ফলাফল বন্ধ করুন।
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSearchResultStudent(null);
                    setPasscodePin('');
                    setPasscodeError('');
                  }}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>🔒 ফলাফল বন্ধ ও গোপন করুন (Close & Lock)</span>
                </button>
              </div>

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
                  <div className="inline-block bg-[#0c3664] text-amber-300 font-black text-xs sm:text-sm px-4 py-1 rounded-full uppercase tracking-wide mt-2 shadow-xs">
                    {passcodeExam} পরীক্ষা ২০২৬ - অফিশিয়াল একাডেমিক নম্বর ফর্দ (Marksheet)
                  </div>
                </div>
                <div className="w-16 h-20 border border-slate-300 rounded-lg bg-slate-50 flex flex-col items-center justify-center text-[10px] text-slate-400 shrink-0">
                  <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 mb-1">
                    {searchResultStudent.name.charAt(0)}
                  </div>
                  <span>ছবি</span>
                </div>
              </div>

              {/* Student Meta Details */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-500 block text-[11px]">শিক্ষার্থীর নাম:</span>
                  <span className="font-extrabold text-slate-900 text-sm">{searchResultStudent.name}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">শ্রেণি ও শাখা:</span>
                  <span className="font-bold text-slate-900">
                    {formatClassBangla(searchResultStudent.className)} · {formatSectionBangla(searchResultStudent.section)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">শ্রেণি রোল:</span>
                  <span className="font-black text-red-600 text-sm">{searchResultStudent.roll}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">স্টুডেন্ট আইডি:</span>
                  <span className="font-mono font-bold text-slate-800">{searchResultStudent.id}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">পিতা / অভিভাবক:</span>
                  <span className="font-semibold text-slate-800">{searchResultStudent.guardianName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">বিভাগ / গ্রুপ:</span>
                  <span className="font-bold text-slate-800">{formatGroupBangla(searchResultStudent.group)}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">শিক্ষাবর্ষ:</span>
                  <span className="font-bold text-slate-800">২০২৬ খ্রিষ্টাব্দ</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">সার্বিক ফলাফল:</span>
                  <span className={`font-black text-xs ${activeStudentExamRecord.isPassed ? 'text-emerald-700' : 'text-rose-600'}`}>
                    {activeStudentExamRecord.isPassed ? '✓ উত্তীর্ণ (PASSED)' : '✕ অকৃতকার্য (FAILED)'}
                  </span>
                </div>
              </div>

              {/* High-level Result Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl">
                  <span className="text-[11px] text-emerald-800 font-bold block">গ্রেড পয়েন্ট (GPA)</span>
                  <span className="text-2xl font-black text-emerald-700 font-mono">
                    {activeStudentExamRecord.gpa.toFixed(2)}
                  </span>
                </div>
                <div className="bg-blue-50 border border-blue-200 p-3 rounded-xl">
                  <span className="text-[11px] text-blue-800 font-bold block">লেটার গ্রেড</span>
                  <span className="text-2xl font-black text-blue-800">
                    {activeStudentExamRecord.grade}
                  </span>
                </div>
                <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl">
                  <span className="text-[11px] text-amber-900 font-bold block">সর্বমোট প্রাপ্ত নম্বর</span>
                  <span className="text-xl font-black text-amber-800 font-mono">
                    {activeStudentExamRecord.obtainedTotal} / {activeStudentExamRecord.totalMarks}
                  </span>
                </div>
                <div className="bg-indigo-50 border border-indigo-200 p-3 rounded-xl">
                  <span className="text-[11px] text-indigo-900 font-bold block">শ্রেণিতে সম্ভাব্য স্থান</span>
                  <span className="text-xl font-black text-indigo-800">
                    {searchResultStudent.roll <= 3 ? `${searchResultStudent.roll === 1 ? '১ম' : searchResultStudent.roll === 2 ? '২য়' : '৩য়'} স্থান` : `${searchResultStudent.roll}তম`}
                  </span>
                </div>
              </div>

              {/* Subject-wise Marks Table */}
              <div className="border border-slate-300 rounded-xl overflow-hidden shadow-xs">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#0c3664] text-white font-bold">
                    <tr>
                      <th className="py-2.5 px-3">বিষয়</th>
                      <th className="py-2.5 px-2 text-center">পূর্ণমান</th>
                      <th className="py-2.5 px-2 text-center">CQ</th>
                      <th className="py-2.5 px-2 text-center">MCQ</th>
                      <th className="py-2.5 px-2 text-center">ব্যবহারিক</th>
                      <th className="py-2.5 px-2 text-center">মোট প্রাপ্ত</th>
                      <th className="py-2.5 px-2 text-center">গ্রেড</th>
                      <th className="py-2.5 px-2 text-center">জিপি (GP)</th>
                      <th className="py-2.5 px-2 text-center">স্থিতি</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-800 font-semibold">
                    {Object.values(activeStudentExamRecord.subjects).map((sub, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}>
                        <td className="py-2 px-3 font-bold text-slate-900">{sub.subjectName}</td>
                        <td className="py-2 px-2 text-center text-slate-600">{sub.totalMarks}</td>
                        <td className="py-2 px-2 text-center">{sub.cq !== undefined ? sub.cq : '-'}</td>
                        <td className="py-2 px-2 text-center">{sub.mcq !== undefined ? sub.mcq : '-'}</td>
                        <td className="py-2 px-2 text-center">{sub.practical !== undefined ? sub.practical : '-'}</td>
                        <td className="py-2 px-2 text-center font-black text-slate-900">{sub.obtainedTotal}</td>
                        <td className={`py-2 px-2 text-center font-black ${
                          sub.grade === 'A+' ? 'text-emerald-700' :
                          sub.grade === 'A' ? 'text-blue-700' :
                          sub.grade === 'F' ? 'text-rose-600' : 'text-slate-800'
                        }`}>
                          {sub.grade}
                        </td>
                        <td className="py-2 px-2 text-center font-bold">{sub.gradePoint.toFixed(2)}</td>
                        <td className="py-2 px-2 text-center">
                          {sub.isPassed ? (
                            <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">উত্তীর্ণ</span>
                          ) : (
                            <span className="text-[10px] text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full font-bold">ফেল</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-100 font-bold border-t-2 border-slate-300">
                    <tr>
                      <td className="py-2.5 px-3">সর্বমোট নম্বর ও চূড়ান্ত ফলাফল</td>
                      <td className="py-2.5 px-2 text-center">{activeStudentExamRecord.totalMarks}</td>
                      <td colSpan={3} className="py-2.5 px-2 text-center text-slate-700">
                        অর্জিত মোট নম্বর: <strong>{activeStudentExamRecord.obtainedTotal}</strong>
                      </td>
                      <td className="py-2.5 px-2 text-center font-black text-slate-900">{activeStudentExamRecord.obtainedTotal}</td>
                      <td className="py-2.5 px-2 text-center font-black text-blue-800 text-sm">{activeStudentExamRecord.grade}</td>
                      <td className="py-2.5 px-2 text-center font-black text-emerald-700 text-base">{activeStudentExamRecord.gpa.toFixed(2)}</td>
                      <td className="py-2.5 px-2 text-center font-black text-xs text-emerald-700">
                        {activeStudentExamRecord.isPassed ? 'পাস' : 'ফেল'}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Action Buttons: Official Marksheet Print */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-600">মন্তব্য:</span>
                  <span className="text-xs font-bold text-slate-800">{activeStudentExamRecord.remarks}</span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSearchResultStudent(null);
                      setPasscodePin('');
                      setPasscodeError('');
                    }}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors border border-slate-200 hover:border-rose-200"
                  >
                    <Lock className="w-3.5 h-3.5 text-rose-600" />
                    <span>🔒 ফলাফল বন্ধ ও গোপন করুন</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedStudentForMarksheet(searchResultStudent);
                      setShowMarksheetModal(true);
                    }}
                    className="px-5 py-2.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 shadow-md transition-all active:scale-95"
                  >
                    <Award className="w-4 h-4 text-slate-950" />
                    <span>📄 পূর্ণাঙ্গ অফিশিয়াল A4 নম্বর ফর্দ (প্রিন্ট ভিউ)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-4 py-2.5 bg-[#0c3664] hover:bg-[#092b50] text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>প্রিন্ট করুন</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Locked State Placeholder when no student marksheet is active */}
          {!searchResultStudent && (
            <div className="bg-slate-50 rounded-2xl p-8 border-2 border-dashed border-slate-300 text-center max-w-4xl mx-auto space-y-3">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-100 flex items-center justify-center text-amber-700 shadow-inner">
                <Lock className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-slate-800">
                শিক্ষার্থীর ব্যক্তিগত নম্বর ফর্দ সুরক্ষিত ও লক করা আছে
              </h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                শিক্ষার্থীর ফলাফল ও গ্রেডিং অত্যন্ত গোপনীয়। নম্বর ফর্দ দেখতে উপরে শিক্ষার্থীর <strong>শ্রেণি, শাখা, রোল ও পাসকোড (PIN)</strong> প্রদান করে অনুসন্ধান করুন।
              </p>
              <div className="inline-flex items-center gap-2 text-[11px] text-emerald-800 font-semibold bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>ব্যক্তিগত গোপনীয়তা নিশ্চিতকরণ: দেখা শেষে ফলাফল বন্ধ করলে সাইটে কোনো তথ্য উন্মুক্ত থাকবে না</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* SUB-TAB 2: CLASS TABULATION SHEET                              */}
      {/* ============================================================== */}
      {activeSubTab === 'tabulation' && (
        <div className="space-y-6">
          {/* Tabulation Controls Banner */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-extrabold text-[#0c3664] flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-amber-500" />
                <span>ক্লাসভিত্তিক সার্বিক টেবুলেশন শীট ও গেজেট (Class Tabulation Sheet)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                পুরো শ্রেণির সকল শিক্ষার্থীর রোল অনুসারে বিষয়ভিত্তিক প্রাপ্ত নম্বর, মোট, জিপিএ ও মেধা তালিকা এক নজরে দেখুন।
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedExam}
                onChange={e => setSelectedExam(e.target.value as ExamType)}
                className="px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 bg-slate-50"
              >
                <option value="১ম সাময়িক">১ম সাময়িক পরীক্ষা</option>
                <option value="২য় সাময়িক">২য় সাময়িক পরীক্ষা</option>
                <option value="বার্ষিক">বার্ষিক পরীক্ষা</option>
                <option value="টেস্ট পরীক্ষা">টেস্ট পরীক্ষা (SSC Test Exam)</option>
              </select>

              <select
                value={selectedClass}
                onChange={e => setSelectedClass(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 bg-slate-50"
              >
                <option value="6">৬ষ্ঠ শ্রেণি</option>
                <option value="7">৭ম শ্রেণি</option>
                <option value="8">৮ম শ্রেণি</option>
                <option value="9">৯ম শ্রেণি</option>
                <option value="10">১০ম শ্রেণি</option>
              </select>

              <select
                value={selectedSection}
                onChange={e => setSelectedSection(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 bg-slate-50"
              >
                <option value="all">সকল শাখা (ক, খ, গ, ঘ)</option>
                <option value="A">শাখা: ক (A)</option>
                <option value="B">শাখা: খ (B)</option>
                <option value="C">শাখা: গ (C)</option>
                <option value="D">শাখা: ঘ (D)</option>
              </select>

              {(selectedClass === '9' || selectedClass === '10') && (
                <select
                  value={selectedGroup}
                  onChange={e => setSelectedGroup(e.target.value)}
                  className="px-3 py-2 border border-amber-300 rounded-xl text-xs font-bold text-amber-950 bg-amber-50/70"
                >
                  <option value="all">সকল বিভাগ</option>
                  <option value="science">🧪 বিজ্ঞান বিভাগ (Science Group)</option>
                  <option value="humanities">📚 মানবিক বিভাগ (Humanities Group)</option>
                  <option value="business">💼 ব্যবসায় শিক্ষা (Business Studies)</option>
                </select>
              )}

              <button
                type="button"
                onClick={() => setShowTabulationModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-[#0c3664] to-[#144275] text-amber-300 hover:text-white font-extrabold rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-transform active:scale-95"
              >
                <FileSpreadsheet className="w-4 h-4 text-amber-400" />
                <span>📊 ফুলস্ক্রিন টেবুলেশন শীট খুলুন</span>
              </button>
            </div>
          </div>

          {/* Quick Statistics Overview */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-center shadow-2xs">
              <span className="text-[11px] text-slate-500 font-bold block">মোট পরীক্ষার্থী</span>
              <span className="text-xl font-black text-slate-900">{tabulationStats.total} জন</span>
            </div>
            <div className="bg-emerald-50 p-3.5 rounded-xl border border-emerald-200 text-center shadow-2xs">
              <span className="text-[11px] text-emerald-800 font-bold block">কৃতকার্য (পাস)</span>
              <span className="text-xl font-black text-emerald-700">{tabulationStats.passed} জন</span>
            </div>
            <div className="bg-rose-50 p-3.5 rounded-xl border border-rose-200 text-center shadow-2xs">
              <span className="text-[11px] text-rose-800 font-bold block">অকৃতকার্য (ফেল)</span>
              <span className="text-xl font-black text-rose-600">{tabulationStats.failed} জন</span>
            </div>
            <div className="bg-amber-50 p-3.5 rounded-xl border border-amber-200 text-center shadow-2xs">
              <span className="text-[11px] text-amber-900 font-bold block">জিপিএ ৫.০০ (A+)</span>
              <span className="text-xl font-black text-amber-700">{tabulationStats.aPlus} জন</span>
            </div>
            <div className="bg-blue-50 p-3.5 rounded-xl border border-blue-200 text-center shadow-2xs">
              <span className="text-[11px] text-blue-900 font-bold block">পাসের হার</span>
              <span className="text-xl font-black text-blue-800">{tabulationStats.passRate}%</span>
            </div>
          </div>

          {/* Tabulation Preview Table */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                {formatClassBangla(selectedClass)} {selectedSection !== 'all' ? `(${formatSectionBangla(selectedSection)})` : ''} · {selectedExam} ফলাফল সংক্ষিপ্ত গেজেট
              </h4>
              <button
                type="button"
                onClick={() => setShowTabulationModal(true)}
                className="text-xs font-bold text-[#0c3664] hover:underline flex items-center gap-1"
              >
                <span>সম্পূর্ণ টেবুলেশন ও প্রিন্ট ভিউ দেখুন</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#0c3664] text-white font-bold">
                  <tr>
                    <th className="py-2 px-3 text-center">মেধা ক্রম</th>
                    <th className="py-2 px-2 text-center">রোল</th>
                    <th className="py-2 px-3">শিক্ষার্থীর নাম</th>
                    <th className="py-2 px-2 text-center">শাখা</th>
                    <th className="py-2 px-2 text-center">মোট প্রাপ্ত</th>
                    <th className="py-2 px-2 text-center">গ্রেড</th>
                    <th className="py-2 px-2 text-center">জিপিএ (GPA)</th>
                    <th className="py-2 px-2 text-center">ফলাফল</th>
                    <th className="py-2 px-3 text-center">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredStudents.slice(0, 10).map((s, idx) => {
                    const rec = s.examRecords && s.examRecords[selectedExam]
                      ? s.examRecords[selectedExam]
                      : generateSampleMarksForStudent(s, selectedExam);
                    return (
                      <tr key={s.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                        <td className="py-2 px-3 text-center font-bold text-indigo-900">{idx + 1}</td>
                        <td className="py-2 px-2 text-center font-black text-red-600">{s.roll}</td>
                        <td className="py-2 px-3 font-bold text-slate-900">{s.name}</td>
                        <td className="py-2 px-2 text-center">{s.section}</td>
                        <td className="py-2 px-2 text-center font-mono font-bold">{rec.obtainedTotal}</td>
                        <td className="py-2 px-2 text-center font-black text-blue-700">{rec.grade}</td>
                        <td className="py-2 px-2 text-center font-mono font-bold text-emerald-700">{rec.gpa.toFixed(2)}</td>
                        <td className="py-2 px-2 text-center">
                          {rec.isPassed ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">উত্তীর্ণ</span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">অকৃতকার্য</span>
                          )}
                        </td>
                        <td className="py-2 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedStudentForMarksheet(s);
                              setShowMarksheetModal(true);
                            }}
                            className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold rounded-lg text-[11px] transition-colors"
                          >
                            মার্কশীট
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SUB-TAB 3: EXAM MARKS ENTRY (FOR TEACHERS & ADMINS)            */}
      {/* ============================================================== */}
      {activeSubTab === 'marks_entry' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm text-center max-w-2xl mx-auto space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center shadow-xs">
              <Pencil className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-900">
                পরীক্ষার বিষয়ভিত্তিক নম্বর এন্ট্রি ও রেজাল্ট ইনপুট
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                ১ম সাময়িক, ২য় সাময়িক ও বার্ষিক পরীক্ষার CQ (সৃজনশীল), MCQ (বহুনির্বাচনি) ও ব্যবহারিক নম্বর সহজে ইনপুট দিন।
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left text-xs space-y-2 text-slate-700">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>নম্বর এন্ট্রি সিস্টেমের মূল সুবিধাসমূহ:</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                <li>একক শিক্ষার্থী অনুযায়ী অথবা পুরো ক্লাসের নির্দিষ্ট বিষয় একসাথে এন্ট্রি করার সুযোগ।</li>
                <li>নম্বর প্রবেশের সাথে সাথেই স্বয়ংক্রিয়ভাবে লেটার গ্রেড, জিপিএ ও পাস/ফেল নির্ধারণ।</li>
                <li>বাংলা ও ইংরেজি উভয় পত্রের কম্বাইন্ড পাস রুল স্বয়ংক্রিয়ভাবে যাচাই হয়।</li>
              </ul>
            </div>

            {isAdmin && setStudents ? (
              <button
                type="button"
                onClick={() => setShowMarksEntryModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-black rounded-xl text-xs sm:text-sm shadow-md transition-transform active:scale-95 inline-flex items-center gap-2"
              >
                <Pencil className="w-4 h-4 text-amber-300" />
                <span>📝 নম্বর এন্ট্রি উইন্ডো খুলুন</span>
              </button>
            ) : (
              <div className="space-y-3 pt-2">
                <div className="text-xs text-amber-800 bg-amber-50 border border-amber-200 p-3 rounded-xl">
                  🔒 নম্বর এন্ট্রি ও সংরক্ষণের জন্য <strong>অথরাইজড এডমিন বা শ্রেণি শিক্ষক</strong> হিসেবে লগইন করা আবশ্যক।
                </div>
                <button
                  type="button"
                  onClick={onRequireAdminLogin}
                  className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black rounded-xl text-xs inline-flex items-center gap-1.5 shadow-sm"
                >
                  <Lock className="w-3.5 h-3.5 text-slate-950" />
                  <span>এডমিন লগইন করুন</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SUB-TAB 4: ADMIT CARD GENERATOR                                */}
      {/* ============================================================== */}
      {activeSubTab === 'admit' && currentStudent && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 ${isNineOrTenSelected ? 'lg:grid-cols-6' : 'lg:grid-cols-5'} gap-3`}>
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
                  <option value="টেস্ট পরীক্ষা">টেস্ট পরীক্ষা (SSC Test Exam)</option>
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
                  <option value="C">শাখা: গ (C)</option>
                  <option value="D">শাখা: ঘ (D)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ছাত্র / ছাত্রী শাখা</label>
                <select
                  value={selectedGender}
                  onChange={e => setSelectedGender(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-bold text-slate-800 focus:ring-2 focus:ring-[#0c3664] focus:outline-hidden"
                >
                  <option value="all">উভয় (সকল ছাত্র-ছাত্রী)</option>
                  <option value="male">👦 ছাত্র শাখা (Boys)</option>
                  <option value="female">👧 ছাত্রী শাখা (Girls)</option>
                </select>
              </div>

              {isNineOrTenSelected && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                    <span>বিভাগ (৯ম ও ১০ম)</span>
                    <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-bold">সক্রিয়</span>
                  </label>
                  <select
                    value={selectedGroup}
                    onChange={e => setSelectedGroup(e.target.value)}
                    className="w-full px-3 py-2 border border-amber-300 rounded-lg text-xs font-bold text-amber-950 bg-amber-50/70 focus:ring-2 focus:ring-[#0c3664] focus:outline-hidden"
                  >
                    <option value="all">সকল বিভাগ</option>
                    <option value="science">🧪 বিজ্ঞান বিভাগ (Science Group)</option>
                    <option value="humanities">📚 মানবিক বিভাগ (Humanities Group)</option>
                    <option value="business">💼 ব্যবসায় শিক্ষা (Business Studies)</option>
                  </select>
                </div>
              )}

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

          {/* Admin Routine Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-slate-900 to-[#0c3664] p-3.5 rounded-2xl text-white shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-400/20 border border-amber-300/40 flex items-center justify-center text-amber-300 font-bold shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>পরীক্ষার রুটিন ও প্রবেশপত্র কন্ট্রোল</span>
                  <span className="text-[10px] bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 px-2 py-0.2 rounded-full font-bold">
                    রুটিন আইটেম: {examRoutine.length} টি
                  </span>
                </div>
                <div className="text-[11px] text-slate-300">
                  রুটিনের তারিখ, সময় ও বিষয় পরিবর্তন করতে পাশের এডমিন বাটনে ক্লিক করুন
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {isAdmin ? (
                <button
                  type="button"
                  onClick={() => setShowRoutineEditModal(true)}
                  className="px-3.5 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all"
                  title="পরীক্ষার সময়সূচি, বিষয়, তারিখ ও বার পরিবর্তন করুন"
                >
                  <Pencil className="w-3.5 h-3.5 text-slate-950" />
                  <span>✏️ পরীক্ষার রুটিন এডিট ও পরিবর্তন (এডমিন)</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onRequireAdminLogin}
                  className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-amber-200 border border-white/20 rounded-xl text-xs font-bold flex items-center gap-1.5"
                  title="রুটিন পরিবর্তনের জন্য এডমিন হিসেবে লগইন করুন"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-300" />
                  <span>রুটিন এডিট (এডমিন লগইন প্রয়োজন)</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Printer className="w-3.5 h-3.5 text-amber-300" />
                <span>🖨️ প্রবেশপত্র প্রিন্ট</span>
              </button>
            </div>
          </div>

          {/* Student Selector Quick Pills */}
          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            <span className="text-xs font-bold text-slate-500 shrink-0 mr-1">শিক্ষার্থী:</span>
            {filteredStudents.length === 0 ? (
              <span className="text-xs text-slate-400 italic">কোনো শিক্ষার্থী পাওয়া যায়নি</span>
            ) : (
              filteredStudents.map(s => (
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
                  {s.gender === 'female' ? '👧' : '👦'} রোল {s.roll}: {s.name}
                </button>
              ))
            )}
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

            {/* Official Signatures & QR Code */}
            <div className="pt-4 border-t-2 border-slate-200 flex items-end justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1 border border-slate-300 rounded bg-white">
                  <QrCode className="w-12 h-12 text-slate-800" />
                </div>
                <div className="text-[10px] text-slate-500 leading-tight">
                  <span className="font-mono font-bold block text-slate-700">EIIN: 104062</span>
                  <span>ডিজিটাল ভেরিফায়েড</span>
                </div>
              </div>

              <div className="text-center">
                <div className="w-28 border-b border-slate-400 mb-1"></div>
                <span className="text-[11px] text-slate-600 block">শ্রেণি শিক্ষকের স্বাক্ষর</span>
              </div>

              <div className="text-center">
                <div className="w-36 border-b-2 border-[#0c3664] mb-1 font-bold text-[#0c3664]">
                  মোঃ জাহাঙ্গীর আলম
                </div>
                <span className="text-[11px] font-extrabold text-[#0c3664] block">প্রধান শিক্ষক</span>
                <span className="text-[9px] text-slate-500">নাপোড়া শেখেরখীল উচ্চ বিদ্যালয়</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SUB-TAB 5: SEAT PLAN & ROOM ARRANGEMENT                        */}
      {/* ============================================================== */}
      {activeSubTab === 'seatplan' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-extrabold text-[#0c3664] flex items-center gap-2">
                  <Building className="w-5 h-5 text-[#d9482b]" />
                  <span>পরীক্ষার হলরুম ও সিট প্ল্যান বিন্যাস (Exam Seat Plan)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  পরীক্ষার্থীদের রোল অনুযায়ী কক্ষ বণ্টন ও সিট প্ল্যান তালিকা।
                </p>
              </div>

              <button
                type="button"
                onClick={() => window.print()}
                className="px-3.5 py-1.5 bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5 text-amber-300" />
                <span>সিট প্ল্যান প্রিন্ট</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rooms.map((room, idx) => (
                <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-extrabold text-[#0c3664]">রুম নং: {room.roomNo}</span>
                    <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-bold">
                      আসন: {room.capacity} টি
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 font-medium">
                    ভবন: <span className="font-semibold text-slate-800">{room.building}</span>
                  </div>
                  <div className="text-xs text-slate-600">
                    বরাদ্দকৃত শ্রেণি: <span className="font-bold text-emerald-700">{room.classes}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODALS INTEGRATION                                             */}
      {/* ============================================================== */}

      {/* 1. Exam Marks Entry Modal */}
      {showMarksEntryModal && setStudents && (
        <ExamMarksEntryModal
          students={students}
          setStudents={setStudents}
          isOpen={showMarksEntryModal}
          onClose={() => setShowMarksEntryModal(false)}
        />
      )}

      {/* 2. Class Tabulation Sheet Modal */}
      {showTabulationModal && (
        <ClassTabulationSheetModal
          students={students}
          isOpen={showTabulationModal}
          onClose={() => setShowTabulationModal(false)}
          onOpenIndividualMarksheet={(stu) => {
            setSelectedStudentForMarksheet(stu);
            setShowMarksheetModal(true);
          }}
        />
      )}

      {/* 3. Individual Student Marksheet Modal */}
      {showMarksheetModal && selectedStudentForMarksheet && (
        <StudentMarksheetModal
          student={selectedStudentForMarksheet}
          allStudents={students}
          isOpen={showMarksheetModal}
          onClose={() => setShowMarksheetModal(false)}
          onSelectStudent={(stu) => setSelectedStudentForMarksheet(stu)}
          onUpdateStudentMarks={(stuId, exType, marksMap) => {
            if (setStudents) {
              setStudents(prev => prev.map(s => {
                if (s.id === stuId) {
                  const evalRecord = evaluateStudentMarks(s.className, s.gender, s.group, marksMap, exType, '২০২৬');
                  const updatedRecs = { ...(s.examRecords || {}), [exType]: evalRecord };
                  return { ...s, examRecords: updatedRecs };
                }
                return s;
              }));
            }
          }}
        />
      )}

      {/* 4. Admit Card Exam Routine Edit Modal */}
      {showRoutineEditModal && (
        <ExamRoutineEditModal
          isOpen={showRoutineEditModal}
          onClose={() => setShowRoutineEditModal(false)}
          routine={examRoutine}
          onSave={(newRoutine) => {
            setExamRoutine(newRoutine);
          }}
        />
      )}
    </div>
  );
}
