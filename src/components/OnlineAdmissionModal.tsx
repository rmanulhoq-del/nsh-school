import React, { useState } from 'react';
import {
  X,
  UserPlus,
  Check,
  Printer,
  Calendar,
  Phone,
  MapPin,
  Sparkles,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { Student } from '../types';
import SchoolLogo from './SchoolLogo';

interface OnlineAdmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStudent: (newStudent: Student) => void;
  existingCount: number;
}

export default function OnlineAdmissionModal({
  isOpen,
  onClose,
  onAddStudent,
  existingCount
}: OnlineAdmissionModalProps) {
  const [name, setName] = useState('');
  const [className, setClassName] = useState<'6' | '7' | '8' | '9' | '10'>('6');
  const [section, setSection] = useState<'A' | 'B' | 'C' | 'D'>('A');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [group, setGroup] = useState<'science' | 'humanities' | 'business'>('science');
  const [fatherName, setFatherName] = useState('');
  const [motherName, setMotherName] = useState('');
  const [guardianName, setGuardianName] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('018');
  const [address, setAddress] = useState('নাপোড়া, বাঁশখালী, চট্টগ্রাম');
  const [birthDate, setBirthDate] = useState('2013-05-15');
  const [birthRegNo, setBirthRegNo] = useState('');
  const [monthlyFee, setMonthlyFee] = useState<number>(500);
  const [roll, setRoll] = useState<number>(existingCount + 1);

  const [submittedStudent, setSubmittedStudent] = useState<Student | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newId = `STU-${className}${section}-${String(roll).padStart(3, '0')}`;
    const newStudent: Student = {
      id: newId,
      name: name.trim(),
      className,
      section,
      roll: Number(roll) || existingCount + 1,
      gender,
      group: Number(className) >= 9 ? group : undefined,
      fatherName: fatherName.trim() || undefined,
      motherName: motherName.trim() || undefined,
      guardianName: guardianName.trim() || fatherName.trim() || 'অভিভাবক',
      guardianPhone: guardianPhone.trim(),
      address: address.trim(),
      birthDate,
      birthRegNo: birthRegNo.trim() || undefined,
      admissionDate: new Date().toISOString().split('T')[0],
      monthlyFee: Number(monthlyFee) || 500,
      examFee: 300,
      status: 'paid',
      paidBank: 'বাংলাদেশ কৃষি ব্যাংক, নাপোড়া শাখা',
      feeMonths: ['জানুয়ারি'],
      feeYear: '২০২৬',
      txnId: `ADM-${Math.floor(100000 + Math.random() * 900000)}`
    };

    onAddStudent(newStudent);
    setSubmittedStudent(newStudent);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#0c3664] text-white px-5 py-4 flex items-center justify-between border-b-2 border-[#d9482b]">
          <div className="flex items-center gap-2.5">
            <UserPlus className="w-5 h-5 text-amber-300" />
            <div>
              <h3 className="font-extrabold text-base sm:text-lg leading-tight">
                নতুন শিক্ষার্থী অনলাইন ভর্তি ও ডাটাবেস এন্ট্রি
              </h3>
              <p className="text-[11px] text-amber-200">নাপোড়া শেখেরখীল উচ্চ বিদ্যালয় · শিক্ষাবর্ষ ২০২৬</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {submittedStudent ? (
            <div className="text-center space-y-4 py-4 animate-in fade-in">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h4 className="text-xl font-black text-slate-900">ভর্তি সফলভাবে সম্পন্ন হয়েছে!</h4>
                <p className="text-xs text-slate-600 mt-1">
                  শিক্ষার্থীকে কেন্দ্রীয় ডাটাবেসে সফলভাবে অন্তর্ভুক্ত করা হয়েছে।
                </p>
              </div>

              {/* Admission Confirmation Slip */}
              <div className="bg-slate-50 border-2 border-slate-300 rounded-xl p-4 max-w-md mx-auto text-left text-xs space-y-2">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="font-bold text-[#0c3664]">স্টুডেন্ট আইডি:</span>
                  <span className="font-mono font-black text-red-600">{submittedStudent.id}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">শিক্ষার্থীর নাম:</span>
                  <span className="font-bold text-slate-900">{submittedStudent.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">শ্রেণি ও শাখা:</span>
                  <span className="font-bold text-slate-900">{submittedStudent.className}ম শ্রেণি ({submittedStudent.section})</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">শ্রেণি রোল:</span>
                  <span className="font-black text-slate-900">{submittedStudent.roll}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">অভিভাবকের মোবাইল:</span>
                  <span className="font-mono text-slate-900">{submittedStudent.guardianPhone}</span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-slate-200">
                  <span className="text-slate-600">ভর্তি স্ট্যাটাস:</span>
                  <span className="font-bold text-emerald-700">অনুমোদিত ও রেজিস্টার্ড</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-[#0c3664] hover:bg-[#144275] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <Printer className="w-4 h-4 text-amber-300" />
                  <span>ভর্তি স্লিপ প্রিন্ট</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition-colors"
                >
                  বন্ধ করুন
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Part 1: Academic & Personal */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-[#0c3664] uppercase tracking-wider pb-1 border-b border-slate-200">
                  ১. শিক্ষার্থীর ব্যক্তিগত ও শ্রেণি তথ্য
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      শিক্ষার্থীর পূর্ণ নাম (বাংলায়) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="যেমন: তানভীর আহমেদ"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:ring-2 focus:ring-[#0c3664] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">ভর্তিচ্ছু শ্রেণি</label>
                    <select
                      value={className}
                      onChange={e => setClassName(e.target.value as any)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:ring-2 focus:ring-[#0c3664] focus:outline-hidden"
                    >
                      <option value="6">৬ষ্ঠ শ্রেণি</option>
                      <option value="7">৭ম শ্রেণি</option>
                      <option value="8">৮ম শ্রেণি</option>
                      <option value="9">৯ম শ্রেণি</option>
                      <option value="10">১০ম শ্রেণি</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">শাখা</label>
                    <select
                      value={section}
                      onChange={e => setSection(e.target.value as any)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:ring-2 focus:ring-[#0c3664] focus:outline-hidden"
                    >
                      <option value="A">শাখা: ক (A)</option>
                      <option value="B">শাখা: খ (B)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">শ্রেণি রোল নম্বর</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={roll}
                      onChange={e => setRoll(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-black text-red-600 focus:ring-2 focus:ring-[#0c3664] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">শিক্ষার্থীর লিঙ্গ</label>
                    <select
                      value={gender}
                      onChange={e => setGender(e.target.value as any)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:ring-2 focus:ring-[#0c3664] focus:outline-hidden"
                    >
                      <option value="male">ছাত্র (Male)</option>
                      <option value="female">ছাত্রী (Female)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">জন্ম তারিখ</label>
                    <input
                      type="date"
                      value={birthDate}
                      onChange={e => setBirthDate(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-[#0c3664] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">১৭ সংখ্যার ডিজিটাল জন্ম নিবন্ধন</label>
                    <input
                      type="text"
                      value={birthRegNo}
                      onChange={e => setBirthRegNo(e.target.value)}
                      placeholder="২০১৩১৫..."
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono text-slate-800 focus:ring-2 focus:ring-[#0c3664] focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Part 2: Guardian Details */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-[#0c3664] uppercase tracking-wider pb-1 border-b border-slate-200">
                  ২. পিতা, মাতা ও অভিভাবকের তথ্য
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">পিতার নাম</label>
                    <input
                      type="text"
                      value={fatherName}
                      onChange={e => setFatherName(e.target.value)}
                      placeholder="পিতার নাম..."
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:ring-2 focus:ring-[#0c3664] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">মাতার নাম</label>
                    <input
                      type="text"
                      value={motherName}
                      onChange={e => setMotherName(e.target.value)}
                      placeholder="মাতার নাম..."
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:ring-2 focus:ring-[#0c3664] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">অভিভাবকের নাম</label>
                    <input
                      type="text"
                      value={guardianName}
                      onChange={e => setGuardianName(e.target.value)}
                      placeholder="অভিভাবকের নাম..."
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:ring-2 focus:ring-[#0c3664] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      অভিভাবকের মোবাইল নম্বর (SMS প্রাপ্তির জন্য) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={guardianPhone}
                      onChange={e => setGuardianPhone(e.target.value)}
                      placeholder="01812-345678"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono font-bold text-slate-900 focus:ring-2 focus:ring-[#0c3664] focus:outline-hidden"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">স্থায়ী ও বর্তমান ঠিকানা</label>
                    <input
                      type="text"
                      value={address}
                      onChange={e => setAddress(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:ring-2 focus:ring-[#0c3664] focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-lg transition-colors"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-[#0c3664] to-[#144275] hover:from-[#082545] hover:to-[#0c3664] text-white font-extrabold text-xs rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
                >
                  <Check className="w-4 h-4 text-amber-300" />
                  <span>ভর্তি সম্পন্ন ও ডাটাবেসে সেভ করুন</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
