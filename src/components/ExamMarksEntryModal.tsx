import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Save,
  CheckCircle2,
  AlertCircle,
  Award,
  ChevronRight,
  ChevronLeft,
  FileSpreadsheet,
  Users,
  Search,
  BookOpen,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { Student, ExamType, StudentGender, StudentGroup, formatClassBangla, formatGroupBangla, sortStudentsBySerial } from '../types';
import SchoolLogo from './SchoolLogo';
import {
  getSubjectConfigsForClass,
  evaluateStudentMarks,
  generateSampleMarksForStudent,
  MarkInput,
  SubjectConfig
} from '../data/examRules';

interface ExamMarksEntryModalProps {
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  isOpen: boolean;
  onClose: () => void;
  preSelectedStudentId?: string;
  onShowFeedback?: (msg: string) => void;
}

export default function ExamMarksEntryModal({
  students,
  setStudents,
  isOpen,
  onClose,
  preSelectedStudentId,
  onShowFeedback
}: ExamMarksEntryModalProps) {
  const [selectedClass, setSelectedClass] = useState<'6' | '7' | '8' | '9' | '10'>('6');
  const [selectedSection, setSelectedSection] = useState<'A' | 'B' | 'C' | 'D'>('A');
  const [selectedGender, setSelectedGender] = useState<'all' | 'male' | 'female'>('all');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [selectedExam, setSelectedExam] = useState<ExamType>('১ম সাময়িক');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [entryMode, setEntryMode] = useState<'individual' | 'bulk_subject'>('individual');
  const [selectedSubjectKey, setSelectedSubjectKey] = useState<string>('bangla_1st');

  const isNineOrTen = selectedClass === '9' || selectedClass === '10';

  // Input states for individual student mode
  const [currentMarksInput, setCurrentMarksInput] = useState<Record<string, MarkInput>>({});
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Input states for bulk subject mode (studentId -> MarkInput)
  const [bulkMarksMap, setBulkMarksMap] = useState<Record<string, MarkInput>>({});

  // Filter students in current class & section & gender & group
  const classStudents = useMemo(() => {
    return sortStudentsBySerial(
      students.filter(s => {
        if (s.tcIssued) return false;
        if (s.className !== selectedClass || s.section !== selectedSection) return false;
        if (selectedGender !== 'all' && s.gender !== selectedGender) return false;
        if (isNineOrTen && selectedGroup !== 'all' && s.group !== selectedGroup) return false;
        return true;
      })
    );
  }, [students, selectedClass, selectedSection, selectedGender, selectedGroup, isNineOrTen]);

  // Handle pre-selected student or default to first student in class
  useEffect(() => {
    if (preSelectedStudentId) {
      const found = students.find(s => s.id === preSelectedStudentId);
      if (found) {
        setSelectedClass(found.className);
        setSelectedSection(found.section);
        setSelectedStudentId(found.id);
        if (found.examType) setSelectedExam(found.examType);
        return;
      }
    }
    if (classStudents.length > 0 && !classStudents.some(s => s.id === selectedStudentId)) {
      setSelectedStudentId(classStudents[0].id);
    }
  }, [preSelectedStudentId, classStudents, selectedClass, selectedSection]);

  // Current active student
  const currentStudent = useMemo(() => {
    return students.find(s => s.id === selectedStudentId) || classStudents[0] || null;
  }, [students, selectedStudentId, classStudents]);

  // Navigation: prev / next student
  const currentIndex = classStudents.findIndex(s => s.id === currentStudent?.id);
  const prevStudent = currentIndex > 0 ? classStudents[currentIndex - 1] : null;
  const nextStudent = currentIndex >= 0 && currentIndex < classStudents.length - 1 ? classStudents[currentIndex + 1] : null;

  // Subjects for the current student
  const currentSubjects = useMemo(() => {
    if (!currentStudent) {
      return getSubjectConfigsForClass(selectedClass, 'male', 'science');
    }
    return getSubjectConfigsForClass(
      currentStudent.className,
      currentStudent.gender || 'male',
      currentStudent.group || 'science'
    );
  }, [currentStudent, selectedClass]);

  // Selected subject configuration for bulk mode
  const currentBulkSubjectConfig = useMemo(() => {
    const list = getSubjectConfigsForClass(selectedClass, 'male', 'science');
    return list.find(s => s.key === selectedSubjectKey) || list[0];
  }, [selectedClass, selectedSubjectKey]);

  // Load existing marks into state when current student or exam changes
  useEffect(() => {
    if (!currentStudent) return;
    const existingRecord = currentStudent.examRecords && currentStudent.examRecords[selectedExam];
    const initialMap: Record<string, MarkInput> = {};

    if (existingRecord && existingRecord.subjects) {
      Object.entries(existingRecord.subjects).forEach(([key, s]) => {
        initialMap[key] = {
          cq: s.cq !== undefined ? s.cq : '',
          mcq: s.mcq !== undefined ? s.mcq : '',
          practical: s.practical !== undefined ? s.practical : '',
          total: s.obtainedTotal !== undefined ? s.obtainedTotal : ''
        };
      });
    } else {
      // Default sample marks template
      const sample = generateSampleMarksForStudent(currentStudent, selectedExam);
      Object.entries(sample.subjects).forEach(([key, s]) => {
        initialMap[key] = {
          cq: s.cq !== undefined ? s.cq : '',
          mcq: s.mcq !== undefined ? s.mcq : '',
          practical: s.practical !== undefined ? s.practical : '',
          total: s.obtainedTotal !== undefined ? s.obtainedTotal : ''
        };
      });
    }

    setCurrentMarksInput(initialMap);
    setSaveSuccessMsg(null);
  }, [currentStudent?.id, selectedExam]);

  // Load bulk marks when switching to bulk mode or changing class/subject
  useEffect(() => {
    if (entryMode !== 'bulk_subject') return;
    const map: Record<string, MarkInput> = {};
    classStudents.forEach(stu => {
      const rec = stu.examRecords && stu.examRecords[selectedExam];
      const sub = rec?.subjects?.[selectedSubjectKey];
      if (sub) {
        map[stu.id] = {
          cq: sub.cq !== undefined ? sub.cq : '',
          mcq: sub.mcq !== undefined ? sub.mcq : '',
          practical: sub.practical !== undefined ? sub.practical : '',
          total: sub.obtainedTotal !== undefined ? sub.obtainedTotal : ''
        };
      } else {
        map[stu.id] = { cq: '', mcq: '', practical: '', total: '' };
      }
    });
    setBulkMarksMap(map);
  }, [entryMode, selectedClass, selectedSection, selectedExam, selectedSubjectKey, classStudents]);

  // Live evaluation of current individual inputs
  const liveEvaluation = useMemo(() => {
    if (!currentStudent) return null;
    return evaluateStudentMarks(
      currentStudent.className,
      currentStudent.gender || 'male',
      currentStudent.group || 'science',
      currentMarksInput,
      selectedExam,
      currentStudent.feeYear || '২০২৬'
    );
  }, [currentStudent, currentMarksInput, selectedExam]);

  if (!isOpen) return null;

  // Save current individual student's marks
  const handleSaveIndividualMarks = () => {
    if (!currentStudent || !liveEvaluation) return;

    const updated = students.map(s => {
      if (s.id === currentStudent.id) {
        return {
          ...s,
          examRecords: {
            ...(s.examRecords || {}),
            [selectedExam]: liveEvaluation
          }
        };
      }
      return s;
    });

    setStudents(updated);
    try {
      localStorage.setItem('school_students', JSON.stringify(updated));
    } catch {}

    const msg = `আলহামদুলিল্লাহ! "${currentStudent.name}" (রোল ${currentStudent.roll})-এর ${selectedExam} পরীক্ষার সকল নম্বর সংরক্ষিত হয়েছে।`;
    setSaveSuccessMsg(msg);
    if (onShowFeedback) onShowFeedback(msg);

    // Auto-clear success message after 4 seconds
    setTimeout(() => setSaveSuccessMsg(null), 4000);
  };

  // Save bulk marks for the whole class
  const handleSaveBulkMarks = () => {
    const updated = students.map(s => {
      if (s.className === selectedClass && s.section === selectedSection && !s.tcIssued) {
        const studentInput = bulkMarksMap[s.id] || {};
        const existingRecord = s.examRecords && s.examRecords[selectedExam]
          ? s.examRecords[selectedExam]
          : generateSampleMarksForStudent(s, selectedExam);

        // Update just this subject
        const currentSubjectsMap: Record<string, MarkInput> = {};
        if (existingRecord.subjects) {
          Object.entries(existingRecord.subjects).forEach(([k, sub]) => {
            currentSubjectsMap[k] = {
              cq: sub.cq !== undefined ? sub.cq : '',
              mcq: sub.mcq !== undefined ? sub.mcq : '',
              practical: sub.practical !== undefined ? sub.practical : '',
              total: sub.obtainedTotal !== undefined ? sub.obtainedTotal : ''
            };
          });
        }
        currentSubjectsMap[selectedSubjectKey] = studentInput;

        const evaluated = evaluateStudentMarks(
          s.className,
          s.gender || 'male',
          s.group || 'science',
          currentSubjectsMap,
          selectedExam,
          s.feeYear || '২০২৬'
        );

        return {
          ...s,
          examRecords: {
            ...(s.examRecords || {}),
            [selectedExam]: evaluated
          }
        };
      }
      return s;
    });

    setStudents(updated);
    try {
      localStorage.setItem('school_students', JSON.stringify(updated));
    } catch {}

    const msg = `শ্রেণি ${formatClassBangla(selectedClass)} (${selectedSection})-এর সকল শিক্ষার্থীর "${selectedSubjectKey}" বিষয়ের নম্বর সংরক্ষিত হয়েছে!`;
    setSaveSuccessMsg(msg);
    if (onShowFeedback) onShowFeedback(msg);
    setTimeout(() => setSaveSuccessMsg(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[96vh] animate-in fade-in duration-150">
        
        {/* HEADER BAR */}
        <div className="bg-gradient-to-r from-[#0c3664] via-[#103d6d] to-[#144275] text-white p-5 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-400/20 border border-amber-300/40 flex items-center justify-center text-amber-300 shadow-xs">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] bg-amber-400 text-slate-950 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  নম্বর এন্ট্রি প্যানেল
                </span>
                <span className="text-xs text-amber-200 font-medium">স্বয়ংক্রিয় রেজাল্ট ও গ্রেডিং ইঞ্জিন</span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white mt-0.5">
                পরীক্ষার নম্বর ফর্দ ও ফলাফল এন্ট্রি (Exam Marks Entry)
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Mode Switcher */}
            <div className="flex items-center bg-[#061d36] p-1 rounded-xl border border-amber-400/30 text-xs font-bold">
              <button
                type="button"
                onClick={() => setEntryMode('individual')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  entryMode === 'individual'
                    ? 'bg-amber-400 text-slate-950 shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                শিক্ষার্থীভিত্তিক এন্ট্রি
              </button>
              <button
                type="button"
                onClick={() => setEntryMode('bulk_subject')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  entryMode === 'bulk_subject'
                    ? 'bg-amber-400 text-slate-950 shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                বিষয়ভিত্তিক দ্রুত এন্ট্রি
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors ml-1"
              title="উইন্ডো বন্ধ করুন"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* CONTROLS & SELECTION STRIP */}
        <div className="bg-[#f8fafc] border-b border-slate-200 p-4 space-y-3 shrink-0 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Class & Section Controls */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-slate-700">শ্রেণি:</span>
              <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-300">
                {(['6', '7', '8', '9', '10'] as const).map(cls => (
                  <button
                    key={cls}
                    type="button"
                    onClick={() => {
                      setSelectedClass(cls);
                      setSaveSuccessMsg(null);
                    }}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                      selectedClass === cls
                        ? 'bg-[#0c3664] text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {formatClassBangla(cls)}
                  </button>
                ))}
              </div>

              <span className="font-bold text-slate-700 ml-2">শাখা:</span>
              <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-300">
                {(['A', 'B', 'C', 'D'] as const).map(sec => (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => {
                      setSelectedSection(sec);
                      setSaveSuccessMsg(null);
                    }}
                    className={`px-2 py-1 rounded-lg font-bold transition-all ${
                      selectedSection === sec
                        ? 'bg-[#0c3664] text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {sec === 'A' ? "শাখা 'ক' (A)" : sec === 'B' ? "শাখা 'খ' (B)" : sec === 'C' ? "শাখা 'গ' (C)" : "শাখা 'ঘ' (D)"}
                  </button>
                ))}
              </div>

              <span className="font-bold text-slate-700 ml-2">শাখা রূপ:</span>
              <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-300">
                {[
                  { id: 'all', label: 'উভয়' },
                  { id: 'male', label: '👦 ছাত্র' },
                  { id: 'female', label: '👧 ছাত্রী' }
                ].map(g => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => {
                      setSelectedGender(g.id as any);
                      setSaveSuccessMsg(null);
                    }}
                    className={`px-2 py-1 rounded-lg font-bold transition-all ${
                      selectedGender === g.id
                        ? 'bg-purple-700 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>

              {isNineOrTen && (
                <>
                  <span className="font-bold text-slate-700 ml-2 flex items-center gap-1">
                    <span>বিভাগ:</span>
                    <span className="text-[10px] bg-amber-100 text-amber-800 px-1 rounded font-bold">সক্রিয়</span>
                  </span>
                  <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-amber-300">
                    {[
                      { id: 'all', label: 'সকল' },
                      { id: 'science', label: 'বিজ্ঞান' },
                      { id: 'business', label: 'বাণিজ্য' },
                      { id: 'humanities', label: 'মানবিক' }
                    ].map(grp => (
                      <button
                        key={grp.id}
                        type="button"
                        onClick={() => {
                          setSelectedGroup(grp.id);
                          setSaveSuccessMsg(null);
                        }}
                        className={`px-2 py-1 rounded-lg font-bold transition-all ${
                          selectedGroup === grp.id
                            ? 'bg-amber-400 text-slate-950 shadow-xs'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {grp.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Exam Selector */}
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-700">পরীক্ষা:</span>
              <select
                value={selectedExam}
                onChange={(e) => {
                  setSelectedExam(e.target.value as ExamType);
                  setSaveSuccessMsg(null);
                }}
                className="bg-white border-2 border-amber-400 font-extrabold text-[#0c3664] text-xs px-3 py-1.5 rounded-xl shadow-2xs focus:outline-none"
              >
                <option value="১ম সাময়িক">১ম সাময়িক পরীক্ষা</option>
                <option value="২য় সাময়িক">২য় সাময়িক পরীক্ষা</option>
                <option value="বার্ষিক">বার্ষিক পরীক্ষা</option>
                <option value="টেস্ট পরীক্ষা">টেস্ট পরীক্ষা (SSC Test Exam)</option>
              </select>
            </div>
          </div>

          {/* Sub-selector for Mode */}
          {entryMode === 'individual' ? (
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200">
              {/* Student Selector */}
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <span className="font-bold text-slate-700 text-xs">শিক্ষার্থী নির্বাচন:</span>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="bg-white border border-slate-300 font-bold text-slate-900 text-xs px-3 py-1.5 rounded-xl shadow-2xs focus:outline-none w-full sm:w-auto sm:min-w-[240px] max-w-full"
                >
                  {classStudents.map(s => (
                    <option key={s.id} value={s.id}>
                      রোল #{s.roll} : {s.name} ({s.gender === 'female' ? 'ছাত্রী' : 'ছাত্র'}{s.group ? ` · ${formatGroupBangla(s.group)}` : ''})
                    </option>
                  ))}
                </select>
              </div>

              {/* Prev / Next Student Quick Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={!prevStudent}
                  onClick={() => prevStudent && setSelectedStudentId(prevStudent.id)}
                  className="px-3 py-1.5 bg-white hover:bg-slate-100 disabled:opacity-40 border border-slate-300 text-slate-700 font-bold rounded-xl transition-all flex items-center gap-1 shadow-2xs text-xs"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>পূর্ববর্তী রোল</span>
                </button>
                <span className="text-slate-400 font-mono text-xs">
                  {currentIndex + 1} / {classStudents.length}
                </span>
                <button
                  type="button"
                  disabled={!nextStudent}
                  onClick={() => nextStudent && setSelectedStudentId(nextStudent.id)}
                  className="px-3 py-1.5 bg-white hover:bg-slate-100 disabled:opacity-40 border border-slate-300 text-slate-700 font-bold rounded-xl transition-all flex items-center gap-1 shadow-2xs text-xs"
                >
                  <span>পরবর্তী রোল</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-200">
              <span className="font-bold text-slate-700 text-xs">বিষয় নির্বাচন করুন:</span>
              <select
                value={selectedSubjectKey}
                onChange={(e) => setSelectedSubjectKey(e.target.value)}
                className="bg-white border-2 border-[#0c3664] font-extrabold text-[#0c3664] text-xs px-3 py-1.5 rounded-xl shadow-2xs focus:outline-none w-full sm:w-auto sm:min-w-[240px] max-w-full"
              >
                {getSubjectConfigsForClass(selectedClass, 'male', 'science').map(sub => (
                  <option key={sub.key} value={sub.key}>
                    {sub.name} (পূর্ণমান: {sub.totalMarks})
                  </option>
                ))}
              </select>
              <span className="text-slate-500 text-[11px]">
                (নিচের তালিকায় পুরো ক্লাসের সকল ছাত্র/ছাত্রীর এই বিষয়ের নম্বর একসাথে এন্ট্রি করুন)
              </span>
            </div>
          )}
        </div>

        {/* SUCCESS FEEDBACK BANNER */}
        {saveSuccessMsg && (
          <div className="bg-emerald-50 border-b border-emerald-200 p-3 px-6 text-xs text-emerald-950 font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{saveSuccessMsg}</span>
          </div>
        )}

        {/* MODAL MAIN CONTENT BODY */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 bg-white space-y-5">
          {entryMode === 'individual' && currentStudent ? (
            /* ========================================================= */
            /* MODE A: INDIVIDUAL STUDENT FULL MARKSHEET ENTRY */
            /* ========================================================= */
            <div className="space-y-4">
              {/* Student Header Card */}
              <div className="bg-gradient-to-r from-blue-50/70 to-emerald-50/70 border-2 border-[#0c3664]/30 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-extrabold text-[#0c3664]">{currentStudent.name}</span>
                    <span className="bg-[#0c3664] text-white font-mono px-2 py-0.5 rounded-full font-bold text-[10px]">
                      রোল: {currentStudent.roll}
                    </span>
                    <span className="bg-white border border-slate-300 text-slate-700 font-mono px-2 py-0.5 rounded text-[10px]">
                      ID: {currentStudent.id}
                    </span>
                  </div>
                  <div className="text-slate-600 flex flex-wrap items-center gap-3 text-[11px]">
                    <span>শ্রেণি: {formatClassBangla(currentStudent.className)} ({currentStudent.section})</span>
                    <span>·</span>
                    <span>লিঙ্গ: <strong>{currentStudent.gender === 'female' ? 'ছাত্রী' : 'ছাত্র'}</strong></span>
                    {currentStudent.group && (
                      <>
                        <span>·</span>
                        <span>বিভাগ: <strong className="text-[#0c3664] bg-white px-2 py-0.5 rounded border border-blue-200 font-extrabold">{formatGroupBangla(currentStudent.group)}</strong></span>
                      </>
                    )}
                    <span>·</span>
                    <span>অভিভাবক: {currentStudent.guardianName}</span>
                  </div>
                </div>

                {/* Live Result Badge */}
                {liveEvaluation && (
                  <div className="flex items-center gap-3 shrink-0 bg-white border border-slate-200 p-2.5 rounded-xl shadow-2xs">
                    <div className="text-center">
                      <span className="text-[10px] text-slate-500 block">মোট প্রাপ্ত</span>
                      <span className="text-sm font-extrabold text-[#0c3664] font-mono">
                        {liveEvaluation.obtainedTotal}/{liveEvaluation.totalMarks}
                      </span>
                    </div>
                    <div className="h-7 w-px bg-slate-200" />
                    <div className="text-center">
                      <span className="text-[10px] text-slate-500 block">জিপিএ (GPA)</span>
                      <span className="text-sm font-extrabold text-[#0c3664] font-mono">
                        {liveEvaluation.gpa.toFixed(2)} ({liveEvaluation.grade})
                      </span>
                    </div>
                    <div className="h-7 w-px bg-slate-200" />
                    <div className="text-center">
                      <span className="text-[10px] text-slate-500 block">ফলাফল</span>
                      {liveEvaluation.isPassed ? (
                        <span className="bg-emerald-600 text-white font-bold text-[10px] px-2 py-0.5 rounded">
                          কৃতকার্য
                        </span>
                      ) : (
                        <span className="bg-rose-600 text-white font-bold text-[10px] px-2 py-0.5 rounded" title={liveEvaluation.remarks}>
                          অকৃতকার্য
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Subject Marks Table Inputs */}
              <div className="border border-slate-300 rounded-2xl overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#0c3664] text-white text-[11px] text-center font-bold">
                      <th className="py-2.5 px-2 w-10">ক্র.</th>
                      <th className="py-2.5 px-3 text-left">বিষয়ের নাম</th>
                      <th className="py-2.5 px-2 w-14">পূর্ণমান</th>
                      <th className="py-2.5 px-2 w-24">সিকিউ (CQ)</th>
                      <th className="py-2.5 px-2 w-24">এমসিকিউ (MCQ)</th>
                      <th className="py-2.5 px-2 w-28">ব্যবহারিক (Practical)</th>
                      <th className="py-2.5 px-2 w-20">মোট প্রাপ্ত</th>
                      <th className="py-2.5 px-2 w-14">গ্রেড</th>
                      <th className="py-2.5 px-2 w-14">পয়েন্ট</th>
                      <th className="py-2.5 px-2 w-24">ফলাফল / শর্ত</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentSubjects.map((cfg, idx) => {
                      const input = currentMarksInput[cfg.key] || {};
                      const evalSub = liveEvaluation?.subjects[cfg.key];

                      return (
                        <tr
                          key={cfg.key}
                          className={`text-center text-xs border-b border-slate-200 ${
                            idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'
                          } ${evalSub && !evalSub.isPassed ? 'bg-rose-50/70 font-semibold' : ''}`}
                        >
                          <td className="py-2 px-1 font-mono text-slate-500">{idx + 1}</td>
                          <td className="py-2 px-3 text-left font-bold text-slate-900">
                            {cfg.name}
                          </td>
                          <td className="py-2 px-2 font-mono text-slate-600">{cfg.totalMarks}</td>

                          {/* CQ Input Column */}
                          <td className="py-2 px-2">
                            {cfg.hasCqMcq ? (
                              <div className="flex items-center justify-center gap-1">
                                <input
                                  type="number"
                                  min={0}
                                  max={cfg.cqTotal || 70}
                                  value={input.cq !== undefined ? input.cq : ''}
                                  onChange={(e) => {
                                    const val = e.target.value === '' ? '' : Number(e.target.value);
                                    setCurrentMarksInput(prev => ({
                                      ...prev,
                                      [cfg.key]: { ...prev[cfg.key], cq: val }
                                    }));
                                  }}
                                  placeholder={`০-${cfg.cqTotal || 70}`}
                                  className="w-14 px-1.5 py-1 text-center font-mono font-bold bg-white border border-slate-300 focus:border-[#0c3664] focus:ring-1 focus:ring-[#0c3664] rounded-lg text-xs"
                                />
                                <span className="text-[10px] text-slate-500 font-mono">/{cfg.cqTotal || 70}</span>
                              </div>
                            ) : (
                              <span className="text-slate-400 font-mono">—</span>
                            )}
                          </td>

                          {/* MCQ Input Column */}
                          <td className="py-2 px-2">
                            {cfg.hasCqMcq ? (
                              <div className="flex items-center justify-center gap-1">
                                <input
                                  type="number"
                                  min={0}
                                  max={cfg.mcqTotal || 30}
                                  value={input.mcq !== undefined ? input.mcq : ''}
                                  onChange={(e) => {
                                    const val = e.target.value === '' ? '' : Number(e.target.value);
                                    setCurrentMarksInput(prev => ({
                                      ...prev,
                                      [cfg.key]: { ...prev[cfg.key], mcq: val }
                                    }));
                                  }}
                                  placeholder={`০-${cfg.mcqTotal || 30}`}
                                  className="w-14 px-1.5 py-1 text-center font-mono font-bold bg-white border border-slate-300 focus:border-[#0c3664] focus:ring-1 focus:ring-[#0c3664] rounded-lg text-xs"
                                />
                                <span className="text-[10px] text-slate-500 font-mono">/{cfg.mcqTotal || 30}</span>
                              </div>
                            ) : (
                              <span className="text-slate-400 font-mono">—</span>
                            )}
                          </td>

                          {/* Practical Input Column */}
                          <td className="py-2 px-2">
                            {cfg.hasPractical ? (
                              <div className="flex items-center justify-center gap-1">
                                <input
                                  type="number"
                                  min={0}
                                  max={cfg.practicalTotal || 25}
                                  value={input.practical !== undefined ? input.practical : ''}
                                  onChange={(e) => {
                                    const val = e.target.value === '' ? '' : Number(e.target.value);
                                    setCurrentMarksInput(prev => ({
                                      ...prev,
                                      [cfg.key]: { ...prev[cfg.key], practical: val }
                                    }));
                                  }}
                                  placeholder={`০-${cfg.practicalTotal || 25}`}
                                  className="w-14 px-1.5 py-1 text-center font-mono font-bold bg-blue-50 border border-blue-400 focus:border-[#0c3664] focus:ring-1 focus:ring-[#0c3664] rounded-lg text-xs text-blue-950"
                                />
                                <span className="text-[10px] text-blue-700 font-mono font-bold">/{cfg.practicalTotal || 25}</span>
                              </div>
                            ) : (
                              <span className="text-slate-300 font-mono">—</span>
                            )}
                          </td>

                          {/* Total Column (Input if not CQ/MCQ, else calculated) */}
                          <td className="py-2 px-2 font-mono font-extrabold text-slate-900">
                            {!cfg.hasCqMcq ? (
                              <div className="flex items-center justify-center gap-1">
                                <input
                                  type="number"
                                  min={0}
                                  max={cfg.totalMarks}
                                  value={input.total !== undefined ? input.total : ''}
                                  onChange={(e) => {
                                    const val = e.target.value === '' ? '' : Number(e.target.value);
                                    setCurrentMarksInput(prev => ({
                                      ...prev,
                                      [cfg.key]: { ...prev[cfg.key], total: val }
                                    }));
                                  }}
                                  placeholder={`০-${cfg.totalMarks}`}
                                  className="w-14 px-1.5 py-1 text-center font-mono font-bold bg-white border border-slate-300 focus:border-[#0c3664] rounded-lg text-xs"
                                />
                                <span className="text-[10px] text-slate-500 font-mono">/{cfg.totalMarks}</span>
                              </div>
                            ) : (
                              <span className="text-sm text-[#0c3664] font-bold">
                                {evalSub?.obtainedTotal !== undefined ? evalSub.obtainedTotal : (
                                  (Number(input.cq) || 0) + (Number(input.mcq) || 0) + (Number(input.practical) || 0)
                                )}
                              </span>
                            )}
                          </td>

                          {/* Grade */}
                          <td className="py-2 px-1 font-bold">
                            <span className={evalSub?.grade === 'F' ? 'text-rose-600' : 'text-slate-800'}>
                              {evalSub?.grade || 'F'}
                            </span>
                          </td>

                          {/* Grade Point */}
                          <td className="py-2 px-1 font-mono">
                            {evalSub ? evalSub.gradePoint.toFixed(2) : '0.00'}
                          </td>

                          {/* Status / Fail Reason */}
                          <td className="py-2 px-1 text-[11px]">
                            {evalSub?.isPassed ? (
                              <span className="text-emerald-700 font-bold">পাস</span>
                            ) : (
                              <span className="text-rose-600 font-bold" title={evalSub?.failReason}>
                                অকৃতকার্য
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Bottom Action Strip */}
              <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-slate-500">
                  💡 <span className="font-semibold text-slate-700">নম্বর বণ্টন ও পাস মার্ক নিয়ম:</span> ৬ষ্ঠ-৮ম শ্রেণিতে বাংলা ও ইংরেজি উভয় পত্র মিলে ৫০-এ পাস। ৯ম-১০ম বিজ্ঞান বিভাগে বিজ্ঞান বিষয়সমূহে (পদার্থবিজ্ঞান, রসায়নবিজ্ঞান, জীববিজ্ঞান, উচ্চতর গণিত): CQ ৫০ (পাস ১৭) + MCQ ২৫ (পাস ৮) + ব্যবহারিক ২৫ (পাস ৮) = মোট ১০০। সাধারণ বিষয়ে CQ ৭০ (পাস ২৩) + MCQ ৩০ (পাস ১০) = মোট ১০০।
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handleSaveIndividualMarks}
                    className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-extrabold rounded-xl text-xs flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
                  >
                    <Save className="w-4 h-4" />
                    <span>এই শিক্ষার্থীর নম্বর সংরক্ষণ করুন</span>
                  </button>

                  {nextStudent && (
                    <button
                      type="button"
                      onClick={() => {
                        handleSaveIndividualMarks();
                        setSelectedStudentId(nextStudent.id);
                      }}
                      className="px-4 py-2.5 bg-[#0c3664] hover:bg-[#092b50] text-amber-200 hover:text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all"
                      title="সংরক্ষণ করে পরবর্তী শিক্ষার্থীর নম্বরে যান"
                    >
                      <span>সেভ ও পরবর্তী রোল ({nextStudent.roll})</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* ========================================================= */
            /* MODE B: BULK CLASS SUBJECT SPREADSHEET ENTRY */
            /* ========================================================= */
            <div className="space-y-4">
              <div className="bg-amber-50/70 border border-amber-300 rounded-2xl p-4 flex items-center justify-between gap-3 text-xs">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    {formatClassBangla(selectedClass)} ({selectedSection}) — বিষয়: {currentBulkSubjectConfig?.name || selectedSubjectKey}
                  </h4>
                  <p className="text-slate-600 text-xs mt-0.5">
                    ক্লাসের সকল শিক্ষার্থীর এই বিষয়ের নম্বর একসাথে ইনপুট দিন এবং এক ক্লিকে সংরক্ষণ করুন।
                    {currentBulkSubjectConfig?.hasPractical && (
                      <span className="text-amber-800 font-semibold block mt-1">
                        (বিজ্ঞান বিষয়: CQ ৫০ এ পাস ১৭, MCQ ২৫ এ পাস ৮, ব্যবহারিক ২৫ এ পাস ৮)
                      </span>
                    )}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSaveBulkMarks}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs flex items-center gap-1.5 shadow-md"
                >
                  <Save className="w-4 h-4" />
                  <span>সকল নম্বর একসাথে সংরক্ষণ করুন</span>
                </button>
              </div>

              {/* Class Table */}
              <div className="border border-slate-300 rounded-2xl overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#0c3664] text-white text-[11px] text-center font-bold">
                      <th className="py-2.5 px-2 w-12">রোল</th>
                      <th className="py-2.5 px-3 text-left">শিক্ষার্থীর নাম</th>
                      <th className="py-2.5 px-2 w-20">আইডি</th>
                      <th className="py-2.5 px-2 w-16">লিঙ্গ</th>
                      <th className="py-2.5 px-3 w-28">সিকিউ (CQ)</th>
                      <th className="py-2.5 px-3 w-28">এমসিকিউ (MCQ)</th>
                      <th className="py-2.5 px-3 w-28">ব্যবহারিক (Practical)</th>
                      <th className="py-2.5 px-2 w-20">মোট প্রাপ্ত</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classStudents.map((stu, idx) => {
                      const input = bulkMarksMap[stu.id] || {};
                      const cqVal = input.cq !== undefined && input.cq !== '' ? Number(input.cq) : 0;
                      const mcqVal = input.mcq !== undefined && input.mcq !== '' ? Number(input.mcq) : 0;
                      const practicalVal = input.practical !== undefined && input.practical !== '' ? Number(input.practical) : 0;
                      const totalVal = input.total !== undefined && input.total !== ''
                        ? Number(input.total)
                        : (cqVal + mcqVal + (currentBulkSubjectConfig?.hasPractical ? practicalVal : 0));

                      return (
                        <tr
                          key={stu.id}
                          className={`text-center text-xs border-b border-slate-200 ${
                            idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'
                          }`}
                        >
                          <td className="py-2 px-2 font-mono font-bold text-slate-900">{stu.roll}</td>
                          <td className="py-2 px-3 text-left font-bold text-slate-900">{stu.name}</td>
                          <td className="py-2 px-2 font-mono text-slate-500 text-[10px]">{stu.id}</td>
                          <td className="py-2 px-2 text-[11px] text-slate-600">
                            {stu.gender === 'female' ? 'ছাত্রী' : 'ছাত্র'}
                          </td>

                          {/* CQ Input */}
                          <td className="py-2 px-3">
                            {currentBulkSubjectConfig?.cqTotal === 0 ? (
                              <span className="text-slate-400 font-mono">—</span>
                            ) : (
                              <input
                                type="number"
                                min={0}
                                max={currentBulkSubjectConfig?.cqTotal || 70}
                                value={input.cq !== undefined ? input.cq : ''}
                                onChange={(e) => {
                                  const val = e.target.value === '' ? '' : Number(e.target.value);
                                  setBulkMarksMap(prev => ({
                                    ...prev,
                                    [stu.id]: { ...prev[stu.id], cq: val }
                                  }));
                                }}
                                placeholder={`০-${currentBulkSubjectConfig?.cqTotal || 70}`}
                                className="w-20 px-2 py-1 text-center font-mono font-bold bg-white border border-slate-300 focus:border-[#0c3664] rounded-lg text-xs"
                              />
                            )}
                          </td>

                          {/* MCQ Input */}
                          <td className="py-2 px-3">
                            {currentBulkSubjectConfig?.mcqTotal === 0 ? (
                              <span className="text-slate-400 font-mono">—</span>
                            ) : (
                              <input
                                type="number"
                                min={0}
                                max={currentBulkSubjectConfig?.mcqTotal || 30}
                                value={input.mcq !== undefined ? input.mcq : ''}
                                onChange={(e) => {
                                  const val = e.target.value === '' ? '' : Number(e.target.value);
                                  setBulkMarksMap(prev => ({
                                    ...prev,
                                    [stu.id]: { ...prev[stu.id], mcq: val }
                                  }));
                                }}
                                placeholder={`০-${currentBulkSubjectConfig?.mcqTotal || 30}`}
                                className="w-20 px-2 py-1 text-center font-mono font-bold bg-white border border-slate-300 focus:border-[#0c3664] rounded-lg text-xs"
                              />
                            )}
                          </td>

                          {/* Practical Input */}
                          <td className="py-2 px-3">
                            {currentBulkSubjectConfig?.hasPractical ? (
                              <input
                                type="number"
                                min={0}
                                max={currentBulkSubjectConfig?.practicalTotal || 25}
                                value={input.practical !== undefined ? input.practical : ''}
                                onChange={(e) => {
                                  const val = e.target.value === '' ? '' : Number(e.target.value);
                                  setBulkMarksMap(prev => ({
                                    ...prev,
                                    [stu.id]: { ...prev[stu.id], practical: val }
                                  }));
                                }}
                                placeholder={`০-${currentBulkSubjectConfig?.practicalTotal || 25}`}
                                className="w-20 px-2 py-1 text-center font-mono font-bold bg-amber-50/70 border border-amber-300 focus:border-amber-600 rounded-lg text-xs"
                              />
                            ) : (
                              <span className="text-slate-400 font-mono">—</span>
                            )}
                          </td>

                          {/* Total */}
                          <td className="py-2 px-2 font-mono font-extrabold text-[#0c3664]">
                            {totalVal}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveBulkMarks}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs flex items-center gap-2 shadow-md"
                >
                  <Save className="w-4 h-4" />
                  <span>সকল শিক্ষার্থীর নম্বর সংরক্ষণ করুন</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
