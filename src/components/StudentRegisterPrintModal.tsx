import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Printer,
  ArrowLeft,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import SchoolLogo from './SchoolLogo';
import { Student, formatClassBangla, formatGroupBangla, sortStudentsBySerial } from '../types';

interface StudentRegisterPrintModalProps {
  students: Student[];
  isOpen: boolean;
  onClose: () => void;
  selectedClass: string;
  selectedSection: string;
  selectedGroup: string;
}

export default function StudentRegisterPrintModal({
  students,
  isOpen,
  onClose,
  selectedClass,
  selectedSection,
  selectedGroup
}: StudentRegisterPrintModalProps) {
  // Isolate print by adding class to body when modal is open
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

  const activeStudents = sortStudentsBySerial(students.filter(s => !s.tcIssued));
  const maleCount = activeStudents.filter(s => s.gender === 'male' || !s.gender).length;
  const femaleCount = activeStudents.filter(s => s.gender === 'female').length;
  const paidCount = activeStudents.filter(s => s.status === 'paid').length;
  const dueCount = activeStudents.filter(s => s.status === 'due').length;

  return createPortal(
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="printable-modal-portal fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-start justify-center p-2 sm:p-4 overflow-y-auto print:p-0 print:bg-white print:static"
    >
      <style dangerouslySetInnerHTML={{ __html: '@media print { @page { size: landscape; margin: 0.8cm; } }' }} />
      <div className="bg-white rounded-3xl max-w-5xl w-full p-4 sm:p-6 shadow-2xl border border-slate-200 space-y-4 my-2 sm:my-4 print:border-none print:shadow-none print:m-0 print:p-4 print:rounded-none animate-in fade-in zoom-in-95 duration-150">
        
        {/* TOP CONTROLS & PRINT BAR (HIDDEN IN PRINT) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 print:hidden bg-white sticky top-0 z-10 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-xs border border-slate-300"
          >
            <ArrowLeft className="w-4 h-4 text-slate-700" />
            <span>← ব্যাকে যান (Back)</span>
          </button>

          <div className="text-center">
            <h3 className="text-sm font-bold text-slate-900 leading-tight flex items-center gap-2 justify-center">
              <FileSpreadsheet className="w-4 h-4 text-[#0c3664]" />
              <span>শিক্ষার্থী তথ্য ও হাজিরা রেজিস্টার খাতা</span>
            </h3>
            <span className="text-[11px] text-slate-500">
              প্রিন্ট উপযোগী অফিশিয়াল শিট প্রস্তুত · মোট {activeStudents.length} জন শিক্ষার্থী
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 bg-[#0c3664] hover:bg-[#092b50] text-white font-extrabold rounded-xl text-xs flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all"
              title="রেজিস্টার কপি প্রিন্ট বা PDF সেভ করুন"
            >
              <Printer className="w-4 h-4 text-amber-300" />
              <span>রেজিস্টার প্রিন্ট / সেভ</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors border border-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* OFFICIAL PRINTABLE REGISTER SHEET */}
        {/* ========================================================= */}
        <div className="border border-slate-300 rounded-2xl p-4 sm:p-6 space-y-4 bg-white text-slate-800 print:border-none print:p-0">
          
          {/* Official Letterhead */}
          <div className="text-center space-y-1 pb-3 border-b-2 border-[#0c3664]">
            <div className="flex items-center justify-center gap-3">
              <SchoolLogo size={48} />
              <div>
                <h1 className="text-lg sm:text-xl font-extrabold text-[#0c3664] tracking-wide">
                  নাপোড়া শেখেরখীল উচ্চ বিদ্যালয়
                </h1>
                <p className="text-xs text-slate-600 font-medium">
                  ডাকঘর: নাপোড়া, উপজেলা: বাঁশখালী, জেলা: চট্টগ্রাম · ইআইআইএন: ১০৪০৬২
                </p>
                <p className="text-[11px] text-amber-800 italic font-semibold">
                  "পড় স্রষ্টার নামে" · স্থাপিত : ১৯৬৪ ইং
                </p>
              </div>
            </div>

            <div className="pt-2">
              <span className="inline-block bg-[#0c3664] text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">
                শিক্ষার্থী ভর্তি, হাজিরা ও সাধারণ তথ্য রেজিস্টার (২০২৬ শিক্ষাবর্ষ)
              </span>
            </div>
          </div>

          {/* Filter & Summary Header */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs">
            <div>
              <span className="text-slate-500 block text-[10px]">শ্রেণি:</span>
              <strong className="text-slate-900">
                {selectedClass === 'all' ? 'সকল শ্রেণি (৬ষ্ঠ-১০ম)' : formatClassBangla(selectedClass)}
              </strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">শাখা:</span>
              <strong className="text-slate-900">
                {selectedSection === 'all' ? 'সকল শাখা (ক, খ, গ, ঘ)' : `শাখা '${selectedSection === 'A' ? 'ক' : selectedSection === 'B' ? 'খ' : selectedSection === 'C' ? 'গ' : 'ঘ'}' (${selectedSection})`}
              </strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">বিভাগ (গ্রুপ):</span>
              <strong className="text-slate-900">
                {selectedGroup === 'all' ? 'সকল বিভাগ' : formatGroupBangla(selectedGroup)}
              </strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">মোট শিক্ষার্থী:</span>
              <strong className="text-[#0c3664] font-bold">
                {activeStudents.length} জন (ছাত্র: {maleCount}, ছাত্রী: {femaleCount})
              </strong>
            </div>
          </div>

          {/* Student Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse border border-slate-400">
              <thead>
                <tr className="bg-[#0c3664] text-white text-[11px] text-center font-bold">
                  <th className="border border-slate-400 py-2 px-1.5 w-10">ক্র.</th>
                  <th className="border border-slate-400 py-2 px-1.5 w-12">রোল</th>
                  <th className="border border-slate-400 py-2 px-2 w-24">স্টুডেন্ট আইডি</th>
                  <th className="border border-slate-400 py-2 px-2.5 text-left">শিক্ষার্থীর নাম</th>
                  <th className="border border-slate-400 py-2 px-1.5 w-14">লিঙ্গ</th>
                  <th className="border border-slate-400 py-2 px-1.5 w-20">শ্রেণি/শাখা</th>
                  <th className="border border-slate-400 py-2 px-2 text-left">অভিভাবকের নাম</th>
                  <th className="border border-slate-400 py-2 px-2 w-28">মোবাইল নম্বর</th>
                  <th className="border border-slate-400 py-2 px-1.5 w-20">ফি অবস্থা</th>
                  <th className="border border-slate-400 py-2 px-2 w-24">স্বাক্ষর / মন্তব্য</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300">
                {activeStudents.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="text-center py-6 text-slate-500 italic">
                      নির্বাচিত শ্রেণি বা শাখায় কোনো সক্রিয় শিক্ষার্থী পাওয়া যায়নি।
                    </td>
                  </tr>
                ) : (
                  activeStudents.map((stu, idx) => (
                    <tr
                      key={stu.id}
                      className={`text-center text-[11px] ${
                        idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'
                      }`}
                    >
                      <td className="border border-slate-300 py-1.5 px-1 font-mono text-slate-600">
                        {idx + 1}
                      </td>
                      <td className="border border-slate-300 py-1.5 px-1 font-mono font-bold text-slate-900">
                        {stu.roll}
                      </td>
                      <td className="border border-slate-300 py-1.5 px-1.5 font-mono text-[10px] text-slate-700">
                        {stu.id}
                      </td>
                      <td className="border border-slate-300 py-1.5 px-2 text-left font-bold text-slate-900">
                        {stu.name}
                      </td>
                      <td className="border border-slate-300 py-1.5 px-1 text-[10px]">
                        {stu.gender === 'female' ? 'ছাত্রী' : 'ছাত্র'}
                      </td>
                      <td className="border border-slate-300 py-1.5 px-1 text-[10.5px]">
                        {formatClassBangla(stu.className)} ({stu.section === 'A' ? 'ক' : stu.section === 'B' ? 'খ' : stu.section === 'C' ? 'গ' : 'ঘ'})
                        {stu.group && (
                          <div className="text-[9px] text-slate-500">
                            {stu.group === 'science' ? 'বিজ্ঞান' : stu.group === 'humanities' ? 'মানবিক' : 'ব্যবসায়'}
                          </div>
                        )}
                      </td>
                      <td className="border border-slate-300 py-1.5 px-2 text-left text-slate-800">
                        {stu.guardianName || '—'}
                      </td>
                      <td className="border border-slate-300 py-1.5 px-1.5 font-mono text-slate-700">
                        {stu.guardianPhone || '—'}
                      </td>
                      <td className="border border-slate-300 py-1.5 px-1 text-[10px] font-bold">
                        <span className={stu.status === 'paid' ? 'text-emerald-700' : 'text-rose-700'}>
                          {stu.status === 'paid' ? 'পরিশোধিত' : 'বকেয়া'}
                        </span>
                      </td>
                      <td className="border border-slate-300 py-1.5 px-1">
                        <div className="h-4 border-b border-dashed border-slate-300"></div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Signatures */}
          <div className="pt-8 flex items-end justify-between text-xs text-slate-600 print:pt-12">
            <div className="text-center space-y-1">
              <div className="w-40 border-b border-slate-400 mx-auto"></div>
              <div className="font-semibold text-slate-800">শ্রেণি শিক্ষকের স্বাক্ষর ও তারিখ</div>
              <div className="text-[10px] text-slate-500">নাপোড়া শেখেরখীল উচ্চ বিদ্যালয়</div>
            </div>

            <div className="text-center space-y-1">
              <div className="w-40 border-b border-slate-400 mx-auto"></div>
              <div className="font-bold text-slate-900">জনাব মোঃ জাহাঙ্গীর আলম</div>
              <div className="text-[10px] text-slate-600">প্রধান শিক্ষক ও সদস্য সচিব</div>
            </div>
          </div>

          {/* Bottom Barcode / Print Verification */}
          <div className="pt-2 border-t border-slate-200 text-center text-[10px] text-slate-400 flex items-center justify-between">
            <span>কমিউনিটি বিদ্যালয় অনলাইন পোর্টাল দ্বারা প্রস্তুতকৃত · মোট শিক্ষার্থী: {activeStudents.length} (পরিশোধিত: {paidCount}, বকেয়া: {dueCount})</span>
            <span className="font-mono">OFFICIAL REGISTER #{new Date().toISOString().split('T')[0]}</span>
          </div>
        </div>

      </div>
    </div>,
    document.body
  );
}
