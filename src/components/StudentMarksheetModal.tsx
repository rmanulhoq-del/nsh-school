import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Printer,
  X,
  Award,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Pencil,
  Save,
  RotateCcw,
  Landmark,
  Calendar,
  FileCheck2
} from 'lucide-react';
import { Student, ExamType, formatClassBangla, formatGroupBangla, sortStudentsBySerial } from '../types';
import SchoolLogo from './SchoolLogo';
import {
  getSubjectConfigsForClass,
  evaluateStudentMarks,
  generateSampleMarksForStudent,
  MarkInput,
  EXAM_BANKS
} from '../data/examRules';

interface StudentMarksheetModalProps {
  student: Student;
  allStudents: Student[];
  isOpen: boolean;
  onClose: () => void;
  onSelectStudent: (student: Student) => void;
  onUpdateStudentMarks?: (studentId: string, examType: ExamType, marksMap: Record<string, MarkInput>) => void;
}

export default function StudentMarksheetModal({
  student,
  allStudents,
  isOpen,
  onClose,
  onSelectStudent,
  onUpdateStudentMarks
}: StudentMarksheetModalProps) {
  const [selectedExam, setSelectedExam] = useState<ExamType>(student.examType || '১ম সাময়িক');
  const [isEditingMarks, setIsEditingMarks] = useState<boolean>(false);
  const [editableMarks, setEditableMarks] = useState<Record<string, MarkInput>>({});

  // Filter students in the same class and sort by serial (class -> section -> gender -> roll)
  const classStudents = useMemo(() => {
    return sortStudentsBySerial(
      allStudents.filter(s => s.className === student.className && !s.tcIssued)
    );
  }, [allStudents, student.className]);

  const currentIndex = classStudents.findIndex(s => s.id === student.id);
  const prevStudent = currentIndex > 0 ? classStudents[currentIndex - 1] : null;
  const nextStudent = currentIndex < classStudents.length - 1 ? classStudents[currentIndex + 1] : null;

  // Initialize or load exam marks for current student
  const examRecord = useMemo(() => {
    if (student.examRecords && student.examRecords[selectedExam]) {
      return student.examRecords[selectedExam];
    }
    return generateSampleMarksForStudent(student, selectedExam);
  }, [student, selectedExam]);

  // Sync editable marks when student or exam changes
  React.useEffect(() => {
    const initialMap: Record<string, MarkInput> = {};
    if (examRecord && examRecord.subjects) {
      Object.entries(examRecord.subjects).forEach(([key, s]) => {
        initialMap[key] = {
          cq: s.cq,
          mcq: s.mcq,
          practical: s.practical,
          total: s.obtainedTotal
        };
      });
    }
    setEditableMarks(initialMap);
    setIsEditingMarks(false);
  }, [student.id, selectedExam, examRecord]);

  // Isolate print styles and listen for escape key
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('has-print-modal-open');
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.classList.remove('has-print-modal-open');
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const subjectConfigs = getSubjectConfigsForClass(
    student.className,
    student.gender || 'male',
    student.group || 'science'
  );

  const handlePrint = () => {
    window.print();
  };

  const handleSaveMarks = () => {
    if (onUpdateStudentMarks) {
      onUpdateStudentMarks(student.id, selectedExam, editableMarks);
    }
    setIsEditingMarks(false);
  };

  return createPortal(
    <div className="printable-modal-portal fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 print:p-0 print:bg-white print:static">
      <style dangerouslySetInnerHTML={{ __html: '@media print { @page { size: portrait; margin: 0.8cm; } }' }} />
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[96vh] print:max-h-none print:shadow-none print:border-none print:rounded-none">
        
        {/* TOP CONTROLS TOOLBAR (HIDDEN IN PRINT) */}
        <div className="bg-gradient-to-r from-[#0c3664] via-[#103d6d] to-[#144275] text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 shrink-0 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-400/20 border border-amber-300/40 flex items-center justify-center text-amber-300 font-bold">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-amber-200 font-medium">ইনডিভিজুয়াল নম্বর ফর্দ ও মার্কশিট</div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <span>{student.name}</span>
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-mono">
                  রোল: {student.roll} · শ্রেণি: {student.className}ম ({student.section})
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Exam Selector */}
            <select
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value as ExamType)}
              className="bg-[#061d36] text-amber-200 border border-amber-400/40 text-xs font-bold rounded-xl px-3 py-1.5 focus:outline-none"
            >
              <option value="১ম সাময়িক">১ম সাময়িক পরীক্ষা</option>
              <option value="২য় সাময়িক">২য় সাময়িক পরীক্ষা</option>
              <option value="বার্ষিক">বার্ষিক পরীক্ষা</option>
              <option value="টেস্ট পরীক্ষা">টেস্ট পরীক্ষা (SSC Test Exam)</option>
            </select>

            {/* Prev / Next Student */}
            <div className="flex items-center bg-white/10 rounded-xl p-0.5 border border-white/20">
              <button
                type="button"
                onClick={() => prevStudent && onSelectStudent(prevStudent)}
                disabled={!prevStudent}
                className="p-1.5 text-white hover:text-amber-300 disabled:opacity-30 disabled:hover:text-white transition-colors"
                title={prevStudent ? `পূর্ববর্তী: ${prevStudent.name} (রোল ${prevStudent.roll})` : 'কোনো পূর্ববর্তী শিক্ষার্থী নেই'}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-[11px] font-mono px-2 text-slate-200">
                {currentIndex + 1}/{classStudents.length}
              </span>
              <button
                type="button"
                onClick={() => nextStudent && onSelectStudent(nextStudent)}
                disabled={!nextStudent}
                className="p-1.5 text-white hover:text-amber-300 disabled:opacity-30 disabled:hover:text-white transition-colors"
                title={nextStudent ? `পরবর্তী: ${nextStudent.name} (রোল ${nextStudent.roll})` : 'কোনো পরবর্তী শিক্ষার্থী নেই'}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Edit / Save Marks Button */}
            {!isEditingMarks ? (
              <button
                type="button"
                onClick={() => setIsEditingMarks(true)}
                className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-xs"
                title="পরীক্ষার নম্বর এডিট করুন"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>নম্বর এন্ট্রি / এডিট</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSaveMarks}
                className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>সংরক্ষণ করুন</span>
              </button>
            )}

            {/* A4 Print Button */}
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-1.5 bg-white text-[#0c3664] hover:bg-slate-100 font-extrabold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-sm"
              title="A4 পেজে নিখুঁত প্রিন্ট বা PDF ডাউনলোড করুন"
            >
              <Printer className="w-4 h-4 text-[#d9482b]" />
              <span>A4 প্রিন্ট / PDF</span>
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* MARKSHEET BODY (PRINTABLE A4 DOCUMENT) */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 bg-white print:p-4 print:overflow-visible text-slate-900 font-sans print:m-0">
          <div className="max-w-[780px] mx-auto border-4 border-[#0c3664] rounded-2xl p-5 sm:p-6 bg-white relative print:border-2 print:p-4 print:max-w-none">
            
            {/* Inner Decorative Border */}
            <div className="absolute inset-1.5 border border-[#d9e6e7] pointer-events-none rounded-xl" />

            {/* Header: School Crest, EIIN, Name, Address */}
            <div className="text-center space-y-1 relative pb-3 border-b-2 border-[#0c3664]">
              <div className="flex items-center justify-center gap-3">
                <SchoolLogo size={68} className="shadow-xs print:w-14 print:h-14" />
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0c3664] tracking-tight leading-tight">
                    নাপোড়া শেখেরখীল উচ্চ বিদ্যালয়
                  </h1>
                  <div className="text-xs sm:text-[13px] text-slate-600 font-semibold">
                    ডাকঘর: নাপোড়া, উপজেলা: বাঁশখালী, জেলা: চট্টগ্রাম · স্থাপিত: ১৯৬৪ ইং
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                    ইআইআইএন (EIIN): ১০৪০৬২ · বিদ্যালয় কোড: ৩৫৬১
                  </div>
                </div>
              </div>

              {/* Title Badge */}
              <div className="pt-2">
                <span className="inline-block bg-[#0c3664] text-white px-5 py-1 rounded-full text-xs sm:text-sm font-extrabold uppercase tracking-wide shadow-xs">
                  একাডেমিক নম্বর ফর্দ / মার্কশিট (Academic Marksheet)
                </span>
                <div className="text-xs font-bold text-[#d9482b] mt-1">
                  {selectedExam.includes('পরীক্ষা') ? selectedExam : `${selectedExam} পরীক্ষা`} — শিক্ষাবর্ষ: {student.feeYear || '২০২৬'}
                </div>
              </div>
            </div>

            {/* PART A & PART B: STUDENT INFORMATION (ক ও খ অংশ) */}
            <div className="my-3.5 grid grid-cols-2 sm:grid-cols-3 gap-2 bg-[#f8fafc] border border-slate-200 rounded-xl p-3 text-[11px] leading-relaxed">
              <div>
                <span className="text-slate-500 block">শিক্ষার্থীর নাম:</span>
                <span className="font-bold text-slate-900 text-xs sm:text-[13px]">{student.name}</span>
              </div>
              <div>
                <span className="text-slate-500 block">রোল ও আইডি নম্বর:</span>
                <span className="font-bold text-[#0c3664] font-mono text-xs">
                  রোল: {student.roll} · ID: {student.id}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">শ্রেণি, শাখা ও বিভাগ:</span>
                <span className="font-bold text-slate-900">
                  {formatClassBangla(student.className)} (শাখা: {student.section})
                  {student.group && (
                    <span className="text-[#0c3664] ml-1 font-bold">
                      · {formatGroupBangla(student.group)}
                    </span>
                  )}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">পিতার নাম:</span>
                <span className="font-medium text-slate-800">{student.fatherName || student.guardianName || '—'}</span>
              </div>
              <div>
                <span className="text-slate-500 block">মাতার নাম:</span>
                <span className="font-medium text-slate-800">{student.motherName || 'মোছাঃ ফাতেমা বেগম'}</span>
              </div>
              <div>
                <span className="text-slate-500 block">লিঙ্গ (Gender):</span>
                <span className="font-bold text-slate-800">
                  {student.gender === 'female' ? 'ছাত্রী' : 'ছাত্র'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">জন্ম তারিখ ও জন্ম নিবন্ধন:</span>
                <span className="font-mono text-slate-700">
                  {student.birthDate || '২০১৩-০৩-১৫'} {student.birthRegNo ? `· ${student.birthRegNo}` : ''}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">ফি ও ব্যাংকিং অবস্থা (খ অংশ):</span>
                <span className={`font-bold inline-flex items-center gap-1 ${student.status === 'paid' ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {student.status === 'paid' ? '● ফি পরিশোধিত (Paid)' : '● ফি বকেয়া (Due)'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">ব্যাংকের নাম:</span>
                <span className="text-slate-700 font-medium truncate block" title={student.paidBank || 'বাংলাদেশ কৃষি ব্যাংক, নাপোড়া শাখা'}>
                  {student.paidBank || 'বাংলাদেশ কৃষি ব্যাংক, নাপোড়া শাখা'}
                </span>
              </div>
            </div>

            {/* SUBJECT MARKS TABLE */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse border border-slate-300">
                <thead>
                  <tr className="bg-[#0c3664] text-white text-[11px] sm:text-xs text-center font-bold">
                    <th className="border border-slate-400 py-1.5 px-2 w-8">ক্র.</th>
                    <th className="border border-slate-400 py-1.5 px-2.5 text-left">বিষয়ের নাম</th>
                    <th className="border border-slate-400 py-1.5 px-2 w-12">পূর্ণমান</th>
                    <th className="border border-slate-400 py-1.5 px-2 w-14">সিকিউ (CQ)</th>
                    <th className="border border-slate-400 py-1.5 px-2 w-14">এমসিকিউ (MCQ)</th>
                    <th className="border border-slate-400 py-1.5 px-2 w-14">ব্যবহারিক (Practical)</th>
                    <th className="border border-slate-400 py-1.5 px-2 w-16">মোট প্রাপ্ত</th>
                    <th className="border border-slate-400 py-1.5 px-2 w-12">লেটার গ্রেড</th>
                    <th className="border border-slate-400 py-1.5 px-2 w-12">গ্রেড পয়েন্ট</th>
                    <th className="border border-slate-400 py-1.5 px-2 w-16">ফলাফল</th>
                  </tr>
                </thead>
                <tbody>
                  {subjectConfigs.map((cfg, idx) => {
                    const mark = examRecord.subjects[cfg.key] || {
                      totalMarks: cfg.totalMarks,
                      obtainedTotal: 0,
                      isPassed: false,
                      grade: 'F',
                      gradePoint: 0.0
                    };

                    const currentInput = editableMarks[cfg.key] || {};

                    return (
                      <tr
                        key={cfg.key}
                        className={`text-center text-[11px] ${
                          idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'
                        } ${!mark.isPassed ? 'bg-rose-50/60 font-semibold' : ''}`}
                      >
                        <td className="border border-slate-300 py-1 px-1 font-mono">{idx + 1}</td>
                        <td className="border border-slate-300 py-1 px-2.5 text-left font-medium text-slate-900">
                          {cfg.name}
                        </td>
                        <td className="border border-slate-300 py-1 px-1 font-mono text-slate-600">{cfg.totalMarks}</td>
                        
                        {/* CQ Column */}
                        <td className="border border-slate-300 py-1 px-1 font-mono">
                          {cfg.cqTotal && cfg.cqTotal > 0 ? (
                            isEditingMarks ? (
                              <input
                                type="number"
                                min={0}
                                max={cfg.cqTotal}
                                value={currentInput.cq !== undefined ? currentInput.cq : (mark.cq !== undefined ? mark.cq : '')}
                                onChange={(e) => {
                                  const val = e.target.value === '' ? '' : Number(e.target.value);
                                  setEditableMarks(prev => ({
                                    ...prev,
                                    [cfg.key]: { ...prev[cfg.key], cq: val }
                                  }));
                                }}
                                className="w-12 text-center p-0.5 border border-amber-400 rounded bg-amber-50 font-bold"
                              />
                            ) : (
                              <span className={mark.cq !== undefined && cfg.cqPass && mark.cq < cfg.cqPass ? 'text-rose-600 font-bold' : ''}>
                                {mark.cq !== undefined ? mark.cq : '—'}
                              </span>
                            )
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>

                        {/* MCQ Column */}
                        <td className="border border-slate-300 py-1 px-1 font-mono">
                          {cfg.mcqTotal && cfg.mcqTotal > 0 ? (
                            isEditingMarks ? (
                              <input
                                type="number"
                                min={0}
                                max={cfg.mcqTotal}
                                value={currentInput.mcq !== undefined ? currentInput.mcq : (mark.mcq !== undefined ? mark.mcq : '')}
                                onChange={(e) => {
                                  const val = e.target.value === '' ? '' : Number(e.target.value);
                                  setEditableMarks(prev => ({
                                    ...prev,
                                    [cfg.key]: { ...prev[cfg.key], mcq: val }
                                  }));
                                }}
                                className="w-12 text-center p-0.5 border border-amber-400 rounded bg-amber-50 font-bold"
                              />
                            ) : (
                              <span className={mark.mcq !== undefined && cfg.mcqPass && mark.mcq < cfg.mcqPass ? 'text-rose-600 font-bold' : ''}>
                                {mark.mcq !== undefined ? mark.mcq : '—'}
                              </span>
                            )
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>

                        {/* Practical Column */}
                        <td className="border border-slate-300 py-1 px-1 font-mono">
                          {cfg.hasPractical ? (
                            isEditingMarks ? (
                              <input
                                type="number"
                                min={0}
                                max={cfg.practicalTotal || 25}
                                value={currentInput.practical !== undefined ? currentInput.practical : (mark.practical !== undefined ? mark.practical : '')}
                                onChange={(e) => {
                                  const val = e.target.value === '' ? '' : Number(e.target.value);
                                  setEditableMarks(prev => ({
                                    ...prev,
                                    [cfg.key]: { ...prev[cfg.key], practical: val }
                                  }));
                                }}
                                className="w-12 text-center p-0.5 border border-amber-400 rounded bg-amber-50 font-bold"
                              />
                            ) : (
                              <span className={mark.practical !== undefined && cfg.practicalPass && mark.practical < cfg.practicalPass ? 'text-rose-600 font-bold' : 'text-amber-800 font-medium'}>
                                {mark.practical !== undefined ? mark.practical : '—'}
                              </span>
                            )
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>

                        {/* Obtained Total */}
                        <td className="border border-slate-300 py-1 px-1 font-mono font-bold text-slate-900">
                          {!cfg.hasCqMcq && !cfg.hasPractical && isEditingMarks ? (
                            <input
                              type="number"
                              min={0}
                              max={cfg.totalMarks}
                              value={currentInput.total !== undefined ? currentInput.total : mark.obtainedTotal}
                              onChange={(e) => {
                                const val = e.target.value === '' ? '' : Number(e.target.value);
                                setEditableMarks(prev => ({
                                  ...prev,
                                  [cfg.key]: { ...prev[cfg.key], total: val }
                                }));
                              }}
                              className="w-12 text-center p-0.5 border border-amber-400 rounded bg-amber-50 font-bold"
                            />
                          ) : (
                            <span>{mark.obtainedTotal}</span>
                          )}
                        </td>

                        {/* Letter Grade */}
                        <td className="border border-slate-300 py-1 px-1 font-bold">
                          <span className={mark.grade === 'F' ? 'text-rose-600' : mark.grade === 'A+' ? 'text-emerald-700' : 'text-slate-800'}>
                            {mark.grade}
                          </span>
                        </td>

                        {/* Grade Point */}
                        <td className="border border-slate-300 py-1 px-1 font-mono">
                          {mark.gradePoint.toFixed(2)}
                        </td>

                        {/* Status */}
                        <td className="border border-slate-300 py-1 px-1 text-[10px]">
                          {mark.isPassed ? (
                            <span className="text-emerald-700 font-bold">উত্তীর্ণ</span>
                          ) : (
                            <span className="text-rose-600 font-bold" title={mark.failReason}>
                              অনুপস্থিত/ফেল
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>

                {/* Table Footer: Total & GPA */}
                <tfoot>
                  <tr className="bg-[#0c3664]/10 font-bold text-[11px] text-center border-t-2 border-[#0c3664]">
                    <td colSpan={2} className="border border-slate-300 py-1.5 px-2 text-right">
                      সর্বমোট (Total):
                    </td>
                    <td className="border border-slate-300 py-1.5 px-1 font-mono">{examRecord.totalMarks}</td>
                    <td colSpan={3} className="border border-slate-300 py-1.5 px-1 text-slate-500">—</td>
                    <td className="border border-slate-300 py-1.5 px-1 font-mono text-xs font-extrabold text-[#0c3664]">
                      {examRecord.obtainedTotal}
                    </td>
                    <td className="border border-slate-300 py-1.5 px-1 font-extrabold text-[#0c3664]">
                      {examRecord.grade}
                    </td>
                    <td className="border border-slate-300 py-1.5 px-1 font-mono font-extrabold text-[#0c3664]">
                      {examRecord.gpa.toFixed(2)}
                    </td>
                    <td className="border border-slate-300 py-1.5 px-1">
                      {examRecord.isPassed ? (
                        <span className="bg-emerald-600 text-white px-2 py-0.5 rounded text-[10px]">কৃতকার্য</span>
                      ) : (
                        <span className="bg-rose-600 text-white px-1.5 py-0.5 rounded text-[10px]">অকৃতকার্য</span>
                      )}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* RESULT SUMMARY & REMARKS */}
            <div className="my-3.5 p-3 rounded-xl border border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="space-y-1 text-center sm:text-left">
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <span className="font-bold text-slate-700">ফলাফলের বিবরণ:</span>
                  {examRecord.isPassed ? (
                    <span className="inline-flex items-center gap-1 text-emerald-800 font-extrabold bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-full text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>পরীক্ষায় কৃতকার্য (PASSED)</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-rose-800 font-extrabold bg-rose-100 border border-rose-300 px-2.5 py-0.5 rounded-full text-xs">
                      <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                      <span>পরীক্ষায় অকৃতকার্য (FAILED)</span>
                    </span>
                  )}
                  <span className="text-slate-500 font-medium ml-2">
                    মেধা স্থান: <strong className="text-[#0c3664] font-mono">{student.roll}ম</strong>
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 italic">
                  মন্তব্য: "{examRecord.remarks}"
                </p>
              </div>

              <div className="flex items-center gap-4 text-center shrink-0">
                <div className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-2xs">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">গ্রেড পয়েন্ট (GPA)</span>
                  <span className="text-base font-extrabold text-[#0c3664] font-mono">{examRecord.gpa.toFixed(2)}</span>
                </div>
                <div className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-2xs">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">লেটার গ্রেড</span>
                  <span className="text-base font-extrabold text-[#d9482b]">{examRecord.grade}</span>
                </div>
              </div>
            </div>

            {/* OFFICIAL SIGNATURES SECTION */}
            <div className="mt-8 pt-4 border-t border-slate-300 grid grid-cols-3 gap-4 text-center text-xs">
              <div className="space-y-1">
                <div className="h-9 border-b border-dashed border-slate-400 mx-auto w-3/4" />
                <span className="font-bold text-slate-700 block">শ্রেণি শিক্ষকের স্বাক্ষর</span>
                <span className="text-[10px] text-slate-500">তারিখ: ....................</span>
              </div>
              <div className="space-y-1">
                <div className="h-9 border-b border-dashed border-slate-400 mx-auto w-3/4" />
                <span className="font-bold text-slate-700 block">পরীক্ষা আহ্বায়ক / নিয়ন্ত্রক</span>
                <span className="text-[10px] text-slate-500">নাপোড়া শেখেরখীল উচ্চ বিদ্যালয়</span>
              </div>
              <div className="space-y-1">
                <div className="h-9 border-b border-dashed border-slate-400 mx-auto w-3/4 flex items-end justify-center pb-1">
                  <span className="text-[11px] font-serif font-bold text-[#0c3664] italic">Md. Jahangir Alam</span>
                </div>
                <span className="font-bold text-slate-900 block">প্রধান শিক্ষকের স্বাক্ষর ও সিল</span>
                <span className="text-[10px] text-slate-500 font-medium">জনাব মোঃ জাহাঙ্গীর আলম</span>
              </div>
            </div>

            {/* Bottom System Footer */}
            <div className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-[9px] text-slate-400 print:text-[8px]">
              <span>নাপোড়া শেখেরখীল উচ্চ বিদ্যালয় · বাঁশখালী, চট্টগ্রাম · স্মার্ট স্কুল ডিজিটাল রেজাল্ট ম্যানেজমেন্ট সিস্টেম</span>
              <span>ইস্যুর তারিখ: {new Date().toLocaleDateString('bn-BD')}</span>
            </div>

          </div>
        </div>

      </div>
    </div>,
    document.body
  );
}
