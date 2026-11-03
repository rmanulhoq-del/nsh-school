import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Printer,
  X,
  FileSpreadsheet,
  Award,
  CheckCircle2,
  AlertCircle,
  FileText,
  Search,
  Filter,
  Users,
  Download
} from 'lucide-react';
import { Student, ExamType, StudentGroup, formatClassBangla } from '../types';
import SchoolLogo from './SchoolLogo';
import {
  getSubjectConfigsForClass,
  generateSampleMarksForStudent,
  evaluateStudentMarks,
  SubjectConfig
} from '../data/examRules';

interface ClassTabulationSheetModalProps {
  students: Student[];
  isOpen: boolean;
  onClose: () => void;
  onOpenIndividualMarksheet: (student: Student) => void;
}

export default function ClassTabulationSheetModal({
  students,
  isOpen,
  onClose,
  onOpenIndividualMarksheet
}: ClassTabulationSheetModalProps) {
  const [selectedClass, setSelectedClass] = useState<string>('6');
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [selectedExam, setSelectedExam] = useState<ExamType>('১ম সাময়িক');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const isNineOrTen = selectedClass === '9' || selectedClass === '10';

  // Filter students for the selected class, section, and group
  const filteredStudents = useMemo(() => {
    return students
      .filter(s => {
        if (s.tcIssued) return false;
        if (s.className !== selectedClass) return false;
        if (selectedSection !== 'all' && s.section !== selectedSection) return false;
        if (isNineOrTen && selectedGroup !== 'all' && s.group !== selectedGroup) return false;
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          return (
            s.name.toLowerCase().includes(q) ||
            s.id.toLowerCase().includes(q) ||
            s.roll.toString().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => a.roll - b.roll);
  }, [students, selectedClass, selectedSection, selectedGroup, isNineOrTen, searchQuery]);

  // Compile exam results for each student
  const studentResults = useMemo(() => {
    return filteredStudents.map(student => {
      const record = (student.examRecords && student.examRecords[selectedExam])
        ? student.examRecords[selectedExam]
        : generateSampleMarksForStudent(student, selectedExam);
      return {
        student,
        record
      };
    });
  }, [filteredStudents, selectedExam]);

  // Calculate Merit Positions based on GPA and Total Marks
  const rankedResults = useMemo(() => {
    const sorted = [...studentResults].sort((a, b) => {
      // Passed students rank higher than failed
      if (a.record.isPassed && !b.record.isPassed) return -1;
      if (!a.record.isPassed && b.record.isPassed) return 1;
      // Then by GPA
      if (b.record.gpa !== a.record.gpa) return b.record.gpa - a.record.gpa;
      // Then by Total Obtained
      return b.record.obtainedTotal - a.record.obtainedTotal;
    });

    return sorted.map((item, idx) => ({
      ...item,
      meritRank: item.record.isPassed ? idx + 1 : '—'
    }));
  }, [studentResults]);

  // Statistics
  const totalCount = rankedResults.length;
  const passedCount = rankedResults.filter(r => r.record.isPassed).length;
  const failedCount = totalCount - passedCount;
  const passRate = totalCount > 0 ? ((passedCount / totalCount) * 100).toFixed(1) : '0';
  const aPlusCount = rankedResults.filter(r => r.record.grade === 'A+').length;

  // Subjects for table header
  const representativeGroup = selectedGroup !== 'all' ? (selectedGroup as StudentGroup) : 'science';
  const tableSubjects = useMemo(() => {
    return getSubjectConfigsForClass(selectedClass, 'male', representativeGroup);
  }, [selectedClass, representativeGroup]);

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

  const handlePrint = () => {
    window.print();
  };

  return createPortal(
    <div className="printable-modal-portal fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 print:p-0 print:bg-white print:static">
      <style dangerouslySetInnerHTML={{ __html: '@media print { @page { size: landscape; margin: 0.8cm; } }' }} />
      <div className="bg-white rounded-3xl shadow-2xl max-w-7xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[96vh] print:max-h-none print:shadow-none print:border-none print:rounded-none">
        
        {/* TOP CONTROLS & FILTER TOOLBAR (HIDDEN IN PRINT) */}
        <div className="bg-gradient-to-r from-[#0c3664] via-[#103d6d] to-[#144275] text-white px-5 py-4 shrink-0 print:hidden space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-300/40 flex items-center justify-center text-amber-300">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <span>শ্রেণিভিত্তিক সার্বিক টেবুলেশন শীট ও রেজাল্ট গেজেট</span>
                  <span className="text-xs bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full font-bold">
                    Class Master Tabulation
                  </span>
                </h2>
                <p className="text-xs text-slate-300">
                  ক্লাসের সকল ছাত্র/ছাত্রীর রোল নম্বর অনুযায়ী পূর্ণাঙ্গ নম্বর ফর্দ, জিপিএ, মেধা স্থান এবং পাশ/ফেল বিবরণী
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                type="button"
                onClick={handlePrint}
                className="px-4 py-2 bg-white text-[#0c3664] hover:bg-slate-100 font-extrabold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-sm"
                title="টেবুলেশন শীট প্রিন্ট করুন (Landscape Mode প্রস্তাবিত)"
              >
                <Printer className="w-4 h-4 text-[#d9482b]" />
                <span>টেবুলেশন শীট প্রিন্ট</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors ml-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-white/10 text-xs">
            {/* Class Selector */}
            <div className="flex items-center gap-1 bg-[#061d36] p-1 rounded-xl border border-amber-400/30">
              <span className="text-[10px] text-amber-300 font-bold px-2">শ্রেণি:</span>
              {['6', '7', '8', '9', '10'].map(cls => (
                <button
                  key={cls}
                  type="button"
                  onClick={() => setSelectedClass(cls)}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                    selectedClass === cls
                      ? 'bg-amber-400 text-slate-950 shadow-xs'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {formatClassBangla(cls)}
                </button>
              ))}
            </div>

            {/* Section Selector */}
            <div className="flex items-center gap-1 bg-[#061d36] p-1 rounded-xl border border-white/15">
              <span className="text-[10px] text-slate-400 px-2">শাখা:</span>
              {[
                { id: 'all', label: 'সকল শাখা' },
                { id: 'A', label: "শাখা 'ক' (A)" },
                { id: 'B', label: "শাখা 'খ' (B)" },
                { id: 'C', label: "শাখা 'গ' (C)" },
                { id: 'D', label: "শাখা 'ঘ' (D)" }
              ].map(sec => (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => setSelectedSection(sec.id)}
                  className={`px-2 py-1 rounded-lg font-medium transition-all ${
                    selectedSection === sec.id
                      ? 'bg-[#144275] text-white font-bold'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {sec.label}
                </button>
              ))}
            </div>

            {/* Group Selector for 9 & 10 */}
            {isNineOrTen && (
              <div className="flex items-center gap-1 bg-[#061d36] p-1 rounded-xl border border-white/15">
                <span className="text-[10px] text-slate-400 px-2">বিভাগ:</span>
                {[
                  { id: 'all', label: 'সকল' },
                  { id: 'science', label: 'বিজ্ঞান' },
                  { id: 'business', label: 'বাণিজ্য' },
                  { id: 'humanities', label: 'মানবিক' }
                ].map(grp => (
                  <button
                    key={grp.id}
                    type="button"
                    onClick={() => setSelectedGroup(grp.id)}
                    className={`px-2 py-1 rounded-lg font-medium transition-all ${
                      selectedGroup === grp.id
                        ? 'bg-[#144275] text-amber-200 font-bold'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {grp.label}
                  </button>
                ))}
              </div>
            )}

            {/* Exam Selector */}
            <div className="flex items-center gap-1 bg-[#061d36] px-2 py-1 rounded-xl border border-white/15">
              <span className="text-[10px] text-slate-400">পরীক্ষা:</span>
              <select
                value={selectedExam}
                onChange={(e) => setSelectedExam(e.target.value as ExamType)}
                className="bg-transparent text-amber-200 font-bold text-xs focus:outline-none cursor-pointer"
              >
                <option value="১ম সাময়িক" className="bg-[#0c3664] text-white">১ম সাময়িক</option>
                <option value="২য় সাময়িক" className="bg-[#0c3664] text-white">২য় সাময়িক</option>
                <option value="বার্ষিক" className="bg-[#0c3664] text-white">বার্ষিক পরীক্ষা</option>
              </select>
            </div>

            {/* Search Box */}
            <div className="relative ml-auto">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="রোল বা নাম খুঁজুন..."
                className="bg-[#061d36] text-white placeholder-slate-400 pl-8 pr-3 py-1 rounded-xl border border-white/20 text-xs w-44 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        </div>

        {/* TABULATION SHEET PRINTABLE BODY */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 bg-white print:p-3 print:overflow-visible">
          <div className="border-2 border-[#0c3664] rounded-2xl p-5 bg-white relative print:border-none print:p-0">
            
            {/* Header: Institutional Details */}
            <div className="text-center pb-3 border-b-2 border-[#0c3664] space-y-1">
              <div className="flex items-center justify-center gap-3">
                <SchoolLogo size={58} className="print:w-12 print:h-12" />
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0c3664] tracking-tight">
                    নাপোড়া শেখেরখীল উচ্চ বিদ্যালয়
                  </h1>
                  <div className="text-xs text-slate-600 font-semibold">
                    ডাক: নাপোড়া, উপজেলা: বাঁশখালী, জেলা: চট্টগ্রাম · স্থাপিত: ১৯৬৪ ইং · EIIN: ১০৪০৬২
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <span className="inline-block bg-[#0c3664] text-white px-5 py-1 rounded-full text-xs sm:text-sm font-extrabold uppercase shadow-xs">
                  সার্বিক পরীক্ষার টেবুলেশন শীট (Master Result Tabulation Sheet)
                </span>
                <div className="text-xs font-bold text-[#d9482b] mt-1 flex items-center justify-center gap-3">
                  <span>শ্রেণি: {formatClassBangla(selectedClass)}</span>
                  <span>·</span>
                  <span>পরীক্ষা: {selectedExam}</span>
                  <span>·</span>
                  <span>শিক্ষাবর্ষ: ২০২৬ ইং</span>
                </div>
              </div>
            </div>

            {/* Quick Stats Bar */}
            <div className="my-3 grid grid-cols-2 sm:grid-cols-5 gap-2.5 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-center text-xs">
              <div className="border-r border-slate-200 last:border-none">
                <span className="text-slate-500 block text-[10px]">মোট পরীক্ষার্থী</span>
                <span className="font-extrabold text-sm text-slate-900 font-mono">{totalCount} জন</span>
              </div>
              <div className="border-r border-slate-200 last:border-none">
                <span className="text-emerald-700 block text-[10px] font-bold">কৃতকার্য (Passed)</span>
                <span className="font-extrabold text-sm text-emerald-700 font-mono">{passedCount} জন</span>
              </div>
              <div className="border-r border-slate-200 last:border-none">
                <span className="text-rose-700 block text-[10px] font-bold">অকৃতকার্য (Failed)</span>
                <span className="font-extrabold text-sm text-rose-700 font-mono">{failedCount} জন</span>
              </div>
              <div className="border-r border-slate-200 last:border-none">
                <span className="text-slate-500 block text-[10px]">পাসের হার</span>
                <span className="font-extrabold text-sm text-[#0c3664] font-mono">{passRate}%</span>
              </div>
              <div>
                <span className="text-amber-700 block text-[10px] font-bold">জিপিএ ৫.০০ (A+)</span>
                <span className="font-extrabold text-sm text-amber-700 font-mono">{aPlusCount} জন</span>
              </div>
            </div>

            {/* MAIN TABULATION TABLE */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse border border-slate-300">
                <thead>
                  <tr className="bg-[#0c3664] text-white text-[10.5px] text-center font-bold">
                    <th className="border border-slate-400 py-1.5 px-1.5 w-10">রোল</th>
                    <th className="border border-slate-400 py-1.5 px-2 text-left min-w-[120px]">শিক্ষার্থীর নাম</th>
                    <th className="border border-slate-400 py-1.5 px-1.5 w-12">শাখা/লিঙ্গ</th>
                    {tableSubjects.map(sub => (
                      <th key={sub.key} className="border border-slate-400 py-1.5 px-1 min-w-[50px]" title={sub.name}>
                        <div className="truncate max-w-[70px] mx-auto">{sub.name.split(' ')[0]}</div>
                        <div className="text-[9px] font-mono opacity-80">({sub.totalMarks})</div>
                      </th>
                    ))}
                    <th className="border border-slate-400 py-1.5 px-1.5 w-14">মোট</th>
                    <th className="border border-slate-400 py-1.5 px-1.5 w-12">GPA</th>
                    <th className="border border-slate-400 py-1.5 px-1.5 w-12">গ্রেড</th>
                    <th className="border border-slate-400 py-1.5 px-1.5 w-14">মেধা</th>
                    <th className="border border-slate-400 py-1.5 px-1.5 w-16">ফলাফল</th>
                    <th className="border border-slate-400 py-1.5 px-2 w-20 print:hidden">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody>
                  {rankedResults.map(({ student, record, meritRank }, idx) => (
                    <tr
                      key={student.id}
                      className={`text-center text-[11px] ${
                        idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'
                      } ${!record.isPassed ? 'bg-rose-50/50' : ''}`}
                    >
                      <td className="border border-slate-300 py-1.5 px-1 font-mono font-bold text-slate-900">
                        {student.roll}
                      </td>
                      <td className="border border-slate-300 py-1.5 px-2 text-left font-bold text-slate-900">
                        <div>{student.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{student.id}</div>
                      </td>
                      <td className="border border-slate-300 py-1.5 px-1 text-[10px]">
                        <span>{student.section}</span> · <span>{student.gender === 'female' ? 'ছাত্রী' : 'ছাত্র'}</span>
                      </td>

                      {/* Subject Marks Columns */}
                      {tableSubjects.map(sub => {
                        const m = record.subjects[sub.key];
                        const markVal = m ? m.obtainedTotal : '—';
                        const isFail = m && !m.isPassed;
                        return (
                          <td
                            key={sub.key}
                            className={`border border-slate-300 py-1 px-1 font-mono ${
                              isFail ? 'text-rose-600 font-bold bg-rose-100/50' : 'text-slate-800'
                            }`}
                            title={
                              m && m.failReason
                                ? m.failReason
                                : m
                                ? `${sub.name}: ${markVal}${
                                    m.practical !== undefined
                                      ? ` (CQ: ${m.cq}, MCQ: ${m.mcq}, ব্যবহারিক: ${m.practical})`
                                      : m.cq !== undefined || m.mcq !== undefined
                                      ? ` (CQ: ${m.cq ?? 0}, MCQ: ${m.mcq ?? 0})`
                                      : ''
                                  }`
                                : sub.name
                            }
                          >
                            {markVal}
                          </td>
                        );
                      })}

                      {/* Total */}
                      <td className="border border-slate-300 py-1.5 px-1 font-mono font-extrabold text-[#0c3664]">
                        {record.obtainedTotal}
                      </td>

                      {/* GPA */}
                      <td className="border border-slate-300 py-1.5 px-1 font-mono font-bold">
                        {record.gpa.toFixed(2)}
                      </td>

                      {/* Grade */}
                      <td className="border border-slate-300 py-1.5 px-1 font-extrabold">
                        <span className={record.grade === 'F' ? 'text-rose-600' : record.grade === 'A+' ? 'text-emerald-700' : 'text-slate-800'}>
                          {record.grade}
                        </span>
                      </td>

                      {/* Merit Rank */}
                      <td className="border border-slate-300 py-1.5 px-1 font-mono font-bold text-[#d9482b]">
                        {meritRank !== '—' ? `${meritRank}ম` : '—'}
                      </td>

                      {/* Overall Status */}
                      <td className="border border-slate-300 py-1.5 px-1">
                        {record.isPassed ? (
                          <span className="bg-emerald-600 text-white px-2 py-0.5 rounded text-[10px] font-bold">কৃতকার্য</span>
                        ) : (
                          <span className="bg-rose-600 text-white px-1.5 py-0.5 rounded text-[10px] font-bold">অকৃতকার্য</span>
                        )}
                      </td>

                      {/* Action: Open Individual Marksheet */}
                      <td className="border border-slate-300 py-1 px-1 print:hidden">
                        <button
                          type="button"
                          onClick={() => onOpenIndividualMarksheet(student)}
                          className="px-2 py-1 bg-[#0c3664] hover:bg-[#092b50] text-white rounded-lg text-[10px] font-bold transition-colors shadow-2xs flex items-center justify-center gap-1 mx-auto"
                          title="এই শিক্ষার্থীর স্বতন্ত্র A4 মার্কশিট প্রিন্ট করুন"
                        >
                          <FileText className="w-3 h-3 text-amber-300" />
                          <span>মার্কশিট</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* SIGNATURES SECTION */}
            <div className="mt-8 pt-5 border-t border-slate-300 grid grid-cols-4 gap-4 text-center text-xs">
              <div className="space-y-1">
                <div className="h-8 border-b border-dashed border-slate-400 mx-auto w-3/4" />
                <span className="font-bold text-slate-700 block">শ্রেণি শিক্ষকের স্বাক্ষর</span>
              </div>
              <div className="space-y-1">
                <div className="h-8 border-b border-dashed border-slate-400 mx-auto w-3/4" />
                <span className="font-bold text-slate-700 block">ফলাফল প্রস্তুতকারী</span>
              </div>
              <div className="space-y-1">
                <div className="h-8 border-b border-dashed border-slate-400 mx-auto w-3/4" />
                <span className="font-bold text-slate-700 block">পরীক্ষা আহ্বায়ক</span>
              </div>
              <div className="space-y-1">
                <div className="h-8 border-b border-dashed border-slate-400 mx-auto w-3/4 flex items-end justify-center pb-0.5">
                  <span className="text-[11px] font-serif font-bold text-[#0c3664] italic">Md. Jahangir Alam</span>
                </div>
                <span className="font-bold text-slate-900 block">প্রধান শিক্ষক ও সিলমোহর</span>
              </div>
            </div>

            {/* Bottom Footer Note */}
            <div className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-[9px] text-slate-400 print:text-[8px]">
              <span>নাপোড়া শেখেরখীল উচ্চ বিদ্যালয় · বাঁশখালী, চট্টগ্রাম · অফিসিয়াল টেবুলেশন গেজেট</span>
              <span>মুদ্রণের তারিখ: {new Date().toLocaleDateString('bn-BD')}</span>
            </div>

          </div>
        </div>

      </div>
    </div>,
    document.body
  );
}
