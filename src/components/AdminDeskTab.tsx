import React, { useState } from 'react';
import {
  Lock,
  ShieldCheck,
  LogOut,
  UserPlus,
  Users,
  UserCheck,
  Landmark,
  BellRing,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  Save,
  Send,
  Pencil,
  Award,
  FileSpreadsheet,
  KeyRound,
  X,
  Check,
  Eye,
  EyeOff,
  Sparkles
} from 'lucide-react';
import { AdminUser, Student, Teacher, StaffMember, Transaction, formatClassOrdinal, formatClassBangla } from '../types';
import { AUTHORIZED_STAFF } from '../data/initialData';
import ExamMarksEntryModal from './ExamMarksEntryModal';
import ClassTabulationSheetModal from './ClassTabulationSheetModal';
import StudentMarksheetModal from './StudentMarksheetModal';
import { evaluateStudentMarks } from '../data/examRules';

interface AdminDeskTabProps {
  currentAdmin: AdminUser | null;
  setCurrentAdmin: (admin: AdminUser | null) => void;
  setShowAdminLoginModal: (show: boolean) => void;
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  teachers: Teacher[];
  onOpenAddTeacher: () => void;
  staffList: StaffMember[];
  onOpenAddStaff: () => void;
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  onPublishNoticeExternal?: (title: string, content: string, author: string) => void;
  onOpenEditHeadmaster?: () => void;
  onOpenAdminUsersModal?: () => void;
  onNavigateToAiScanner?: () => void;
}

export default function AdminDeskTab({
  currentAdmin,
  setCurrentAdmin,
  setShowAdminLoginModal,
  students,
  setStudents,
  transactions,
  setTransactions,
  onPublishNoticeExternal,
  onOpenEditHeadmaster,
  onOpenAdminUsersModal,
  onNavigateToAiScanner
}: AdminDeskTabProps) {
  const [adminActiveSubTab, setAdminActiveSubTab] = useState<'student_entry' | 'bulk_import' | 'exam_marks_entry' | 'bank_fee_entry' | 'notice_entry' | 'account_entry' | 'quick_list'>('student_entry');
  const [adminActionMessage, setAdminActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Exam Marks & Tabulation Modal States
  const [showMarksEntryModal, setShowMarksEntryModal] = useState<boolean>(false);
  const [marksEntryStudentId, setMarksEntryStudentId] = useState<string | undefined>(undefined);
  const [showTabulationModal, setShowTabulationModal] = useState<boolean>(false);
  const [showMarksheetModal, setShowMarksheetModal] = useState<boolean>(false);
  const [selectedStudentForMarksheet, setSelectedStudentForMarksheet] = useState<Student | null>(null);

  // Password / PIN Change Modal State
  const [showChangePinModal, setShowChangePinModal] = useState<boolean>(false);
  const [currentPinInput, setCurrentPinInput] = useState<string>('');
  const [newPinInput, setNewPinInput] = useState<string>('');
  const [confirmPinInput, setConfirmPinInput] = useState<string>('');
  const [showPinText, setShowPinText] = useState<boolean>(false);
  const [changePinError, setChangePinError] = useState<string>('');
  const [changePinSuccess, setChangePinSuccess] = useState<string>('');

  const handleSaveNewPin = (e: React.FormEvent) => {
    e.preventDefault();
    const existingPin = currentAdmin?.pin || localStorage.getItem('nsh_admin_pin') || '1234';

    if (currentPinInput.trim() !== existingPin) {
      setChangePinError('বর্তমান পিন কোড সঠিক নয়!');
      return;
    }
    if (newPinInput.trim().length < 4) {
      setChangePinError('নতুন পিন কোড কমপক্ষে ৪ ডিজিট বা অক্ষরের হতে হবে!');
      return;
    }
    if (newPinInput.trim() !== confirmPinInput.trim()) {
      setChangePinError('নতুন পিন এবং নিশ্চিতকরণ পিন মিলছে না!');
      return;
    }

    const updatedPin = newPinInput.trim();
    localStorage.setItem('nsh_admin_pin', updatedPin);

    // Also update currentAdmin in state and localStorage
    if (currentAdmin) {
      try {
        const saved = localStorage.getItem('nsh_admin_users');
        if (saved) {
          const list: AdminUser[] = JSON.parse(saved);
          const updatedList = list.map(u => u.id === currentAdmin.id ? { ...u, pin: updatedPin } : u);
          localStorage.setItem('nsh_admin_users', JSON.stringify(updatedList));
        }
        const updatedCurrent = { ...currentAdmin, pin: updatedPin };
        setCurrentAdmin(updatedCurrent);
        sessionStorage.setItem('nsh_admin_session', JSON.stringify(updatedCurrent));
      } catch {}
    }

    setChangePinSuccess('এডমিন পাসওয়ার্ড/পিন সফলভাবে পরিবর্তন করা হয়েছে!');
    setChangePinError('');
    setTimeout(() => {
      setShowChangePinModal(false);
      setCurrentPinInput('');
      setNewPinInput('');
      setConfirmPinInput('');
      setChangePinSuccess('');
      setAdminActionMessage({
        type: 'success',
        text: 'এডমিন পাসওয়ার্ড সফলভাবে আপডেট করা হয়েছে। পরবর্তী লগইনে এই পিন কার্যকর হবে।'
      });
    }, 1200);
  };

  // New Student Form State
  const [newStudentName, setNewStudentName] = useState<string>('');
  const [newStudentClass, setNewStudentClass] = useState<'6' | '7' | '8' | '9' | '10'>('6');
  const [newStudentSection, setNewStudentSection] = useState<'A' | 'B' | 'C' | 'D'>('A');
  const [newStudentRoll, setNewStudentRoll] = useState<number | ''>('');
  const [newStudentGender, setNewStudentGender] = useState<'male' | 'female'>('male');
  const [newStudentGroup, setNewStudentGroup] = useState<'science' | 'humanities' | 'business'>('science');
  const [newStudentGuardian, setNewStudentGuardian] = useState<string>('');
  const [newStudentPhone, setNewStudentPhone] = useState<string>('');
  const [newStudentMonthlyFee, setNewStudentMonthlyFee] = useState<number>(500);
  const [newStudentExamFee, setNewStudentExamFee] = useState<number>(300);

  // Direct Bank Fee Input State
  const [feeStudentId, setFeeStudentId] = useState<string>(students[0]?.id || 'STU-6A-002');
  const [feeBank, setFeeBank] = useState<'বাংলাদেশ কৃষি ব্যাংক' | 'আইএফআইসি ব্যাংক'>('বাংলাদেশ কৃষি ব্যাংক');
  const [feeSlipNo, setFeeSlipNo] = useState<string>('');
  const [feeDate, setFeeDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [feeAmount, setFeeAmount] = useState<number | ''>('');
  const [feeMonth, setFeeMonth] = useState<string>('অক্টোবর ২০২৬');

  // Notice Form State
  const [noticeTitle, setNoticeTitle] = useState<string>('');
  const [noticeContent, setNoticeContent] = useState<string>('');
  const [noticeAuthor, setNoticeAuthor] = useState<string>('প্রধান শিক্ষক');

  // Accounts Form State
  const [txnType, setTxnType] = useState<'income' | 'expense'>('income');
  const [txnTitle, setTxnTitle] = useState<string>('');
  const [txnCategory] = useState<string>('শিক্ষার্থী ফি');
  const [txnAmount, setTxnAmount] = useState<number | ''>('');
  const [txnBank, setTxnBank] = useState<'বাংলাদেশ কৃষি ব্যাংক' | 'আইএফআইসি ব্যাংক' | 'Cash'>('বাংলাদেশ কৃষি ব্যাংক');
  const [txnRefNo, setTxnRefNo] = useState<string>('');

  // Quick Table State
  const [clerkSelectedBank, setClerkSelectedBank] = useState<'বাংলাদেশ কৃষি ব্যাংক' | 'আইএফআইসি ব্যাংক'>('বাংলাদেশ কৃষি ব্যাংক');
  const [clerkSelectedMonth, setClerkSelectedMonth] = useState<string>('অক্টোবর ২০২৬');

  const handleAddNewStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim() || newStudentRoll === '') {
      setAdminActionMessage({ type: 'error', text: 'শিক্ষার্থীর নাম এবং রোল নম্বর অবশ্যই প্রদান করতে হবে।' });
      return;
    }

    const rollNum = Number(newStudentRoll);
    const existing = students.find(
      s => s.className === newStudentClass && s.section === newStudentSection && s.roll === rollNum && !s.tcIssued
    );

    if (existing) {
      const existingRolls = students
        .filter(s => s.className === newStudentClass && s.section === newStudentSection && !s.tcIssued)
        .map(s => s.roll);
      let nextRoll = 1;
      while (existingRolls.includes(nextRoll)) nextRoll++;

      setAdminActionMessage({
        type: 'error',
        text: `সতর্কতা: শ্রেণি ${formatClassBangla(newStudentClass)}, শাখা ${newStudentSection}-এ রোল #${rollNum} ইতিমধ্যে "${existing.name}"-এর নামে নিবন্ধিত আছে! অনুগ্রহ করে পরবর্তী খালি রোল (${nextRoll}) ব্যবহার করুন।`
      });
      return;
    }

    const generatedId = `STU-${newStudentClass}${newStudentSection}-${String(rollNum).padStart(3, '0')}`;
    const newStudent: Student = {
      id: generatedId,
      name: newStudentName.trim(),
      className: newStudentClass,
      section: newStudentSection,
      roll: rollNum,
      gender: newStudentGender,
      group: (newStudentClass === '9' || newStudentClass === '10') ? newStudentGroup : undefined,
      guardianName: newStudentGuardian.trim() || 'অভিভাবকের নাম উল্লেখ নেই',
      guardianPhone: newStudentPhone.trim() || '01800-000000',
      monthlyFee: Number(newStudentMonthlyFee) || 500,
      examFee: Number(newStudentExamFee) || 300,
      status: 'due'
    };

    const updated = [newStudent, ...students];
    setStudents(updated);
    localStorage.setItem('school_students', JSON.stringify(updated));

    setAdminActionMessage({
      type: 'success',
      text: `আলহামদুলিল্লাহ! নতুন শিক্ষার্থী "${newStudent.name}" (রোল: ${newStudent.roll}, শ্রেণি: ${newStudent.className}ম-${newStudent.section}) সফলভাবে ডাটাবেসে অন্তর্ভুক্ত করা হয়েছে।`
    });

    setNewStudentName('');
    setNewStudentRoll('');
    setNewStudentGuardian('');
    setNewStudentPhone('');
  };

  const handleRecordBankPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feeStudentId) {
      setAdminActionMessage({ type: 'error', text: 'অনুগ্রহ করে শিক্ষার্থী নির্বাচন করুন।' });
      return;
    }

    const targetStudent = students.find(s => s.id === feeStudentId);
    if (!targetStudent) {
      setAdminActionMessage({ type: 'error', text: 'নির্বাচিত শিক্ষার্থী পাওয়া যায়নি।' });
      return;
    }

    const bankSlipRef = feeSlipNo.trim() || `${feeBank === 'বাংলাদেশ কৃষি ব্যাংক' ? 'BKB' : 'IFIC'}-${Math.floor(100000 + Math.random() * 900000)}`;
    const feeVal = feeAmount !== '' ? Number(feeAmount) : (targetStudent.monthlyFee + targetStudent.examFee);
    const dateFormatted = feeDate ? `${feeDate} (স্লিপ: ${bankSlipRef})` : new Date().toLocaleString();

    const updated = students.map(s => {
      if (s.id === targetStudent.id) {
        return {
          ...s,
          status: 'paid' as const,
          paidBank: feeBank,
          txnId: bankSlipRef,
          paymentDate: dateFormatted,
          paidMonth: feeMonth
        };
      }
      return s;
    });

    setStudents(updated);
    localStorage.setItem('school_students', JSON.stringify(updated));

    const newTxn: Transaction = {
      id: `TXN-${Date.now().toString().slice(-4)}`,
      type: 'income',
      title: `${targetStudent.name} (শ্রেণি: ${targetStudent.className}, রোল: ${targetStudent.roll}) এর [${feeMonth}] মাসের ফি জমা`,
      category: 'শিক্ষার্থী ফি',
      amount: feeVal,
      date: feeDate || new Date().toISOString().split('T')[0],
      bank: feeBank,
      refNo: bankSlipRef
    };
    setTransactions([newTxn, ...transactions]);

    setAdminActionMessage({
      type: 'success',
      text: `সাফল্যজনকভাবে [${feeMonth}] মাসের ফি জমা অনুমোদন সম্পন্ন! শিক্ষার্থী: ${targetStudent.name} (রোল ${targetStudent.roll}), জমার ব্যাংক: ${feeBank}, পরিমাণ: ৳${feeVal}`
    });

    setFeeSlipNo('');
    setFeeAmount('');
  };

  const handlePublishNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle.trim() || !noticeContent.trim()) {
      setAdminActionMessage({ type: 'error', text: 'নোটিশের শিরোনাম এবং বিস্তারিত বিষয় পূরণ করুন।' });
      return;
    }

    if (onPublishNoticeExternal) {
      onPublishNoticeExternal(noticeTitle.trim(), noticeContent.trim(), noticeAuthor || 'প্রধান শিক্ষক');
    }

    setAdminActionMessage({
      type: 'success',
      text: `বিজ্ঞপ্তি "${noticeTitle}" সফলভাবে বিদ্যালয়ের নোটিশ বোর্ডে প্রকাশ করা হয়েছে!`
    });

    setNoticeTitle('');
    setNoticeContent('');
  };

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!txnTitle.trim() || txnAmount === '') {
      setAdminActionMessage({ type: 'error', text: 'লেনদেনের বিবরণ ও টাকার পরিমাণ প্রদান করুন।' });
      return;
    }

    const ref = txnRefNo.trim() || `VCH-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTxn: Transaction = {
      id: `TXN-${Date.now().toString().slice(-4)}`,
      type: txnType,
      title: txnTitle.trim(),
      category: txnCategory,
      amount: Number(txnAmount),
      date: new Date().toISOString().split('T')[0],
      bank: txnBank,
      refNo: ref
    };

    setTransactions([newTxn, ...transactions]);
    setAdminActionMessage({
      type: 'success',
      text: `নতুন হিসাব রেকর্ড সংরক্ষণ সম্পন্ন! (${txnType === 'income' ? 'আয়' : 'ব্যয়'} ৳${txnAmount}), মাধ্যম: ${txnBank}`
    });

    setTxnTitle('');
    setTxnAmount('');
    setTxnRefNo('');
  };

  const handleQuickTogglePayment = (studentId: string, markAsPaid: boolean) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    const now = new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const ref = `${clerkSelectedBank === 'বাংলাদেশ কৃষি ব্যাংক' ? 'BKB-MAN' : 'IFIC-MAN'}-${Math.floor(1000 + Math.random() * 9000)}`;

    const updated = students.map(s => {
      if (s.id === studentId) {
        if (markAsPaid) {
          return {
            ...s,
            status: 'paid' as const,
            paidBank: clerkSelectedBank,
            txnId: ref,
            paymentDate: now,
            paidMonth: clerkSelectedMonth
          };
        } else {
          return {
            ...s,
            status: 'due' as const,
            paidBank: undefined,
            txnId: undefined,
            paymentDate: undefined,
            dueMonth: clerkSelectedMonth
          };
        }
      }
      return s;
    });

    setStudents(updated);
    localStorage.setItem('school_students', JSON.stringify(updated));

    setAdminActionMessage({
      type: 'success',
      text: markAsPaid
        ? `${student.name} (রোল: ${student.roll}) এর [${clerkSelectedMonth}] মাসের ফি "${clerkSelectedBank}"-এ পেইড মার্ক করা হয়েছে।`
        : `${student.name} (রোল: ${student.roll}) এর ফি বকেয়া (Due) করা হয়েছে।`
    });
  };

  if (!currentAdmin) {
    return (
      <div className="bg-white border border-[#d9e6e7] rounded-3xl p-8 md:p-12 shadow-xs text-center space-y-6 max-w-2xl mx-auto my-6">
        <div className="w-16 h-16 bg-amber-50 border border-amber-200 text-amber-600 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
          <Lock className="w-8 h-8" />
        </div>
        
        <div className="space-y-2">
          <div className="inline-block px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full">
            সুরক্ষিত প্রশাসনিক জোন
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
            এডমিন পাসওয়ার্ড দিয়ে প্রবেশ করুন
          </h2>
          <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
            শিক্ষার্থী ভর্তি, ব্যাংক ফি অনুমোদন, পরীক্ষার মার্কস এন্ট্রি ও আয়-ব্যয় হিসাব শুধুমাত্র বিদ্যালয়ের অনুমোদিত কর্মকর্তা ও কর্মচারীদের জন্য সংরক্ষিত। সাধারণ দর্শক বা শিক্ষার্থীদের জন্য এটি সুরক্ষিত।
          </p>
        </div>

        <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-4">
          <p className="text-xs text-slate-500">
            আপনি বর্তমানে সাধারণ পাবলিক ভিউতে আছেন। প্রশাসনিক ডেস্কে ঢুকতে আপনার সিকিউরিটি পিন দিয়ে লগইন করুন।
          </p>
          <button
            type="button"
            onClick={() => setShowAdminLoginModal(true)}
            className="w-full py-3.5 px-6 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold rounded-xl text-sm transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <Lock className="w-4 h-4 text-slate-950" />
            <span>এডমিন সিকিউরিটি লগইন করুন</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Active Session Banner */}
      <div className="bg-gradient-to-r from-[#0c3664] to-[#124275] text-white p-6 rounded-2xl border-2 border-amber-400/60 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start md:items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-amber-400/20 border border-amber-300/40 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-bold px-2 py-0.5 rounded-full">
                ● অথরাইজড সেশন সক্রিয়
              </span>
              <span className="text-xs text-amber-200 font-semibold">{currentAdmin.badge}</span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">
              {currentAdmin.name} — <span className="text-amber-300 font-medium">{currentAdmin.roleName}</span>
            </h2>
            <div className="text-xs text-slate-200 mt-0.5">
              নাপোড়া শেখেরখীল উচ্চ বিদ্যালয় · বাঁশখালী, চট্টগ্রাম · মোবাইল: {currentAdmin.phone}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          {onOpenAdminUsersModal && (
            <button
              type="button"
              onClick={onOpenAdminUsersModal}
              className="px-3.5 py-1.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold rounded-xl text-xs transition-all shadow-xs flex items-center gap-1.5"
              title="নতুন এডমিন যোগ, এডিট, ডিলিট এবং সিকিউরিটি পিন পরিবর্তন"
            >
              <Users className="w-3.5 h-3.5 text-slate-950" />
              <span>এডমিন ইউজার ও সিকিউরিটি</span>
            </button>
          )}
          {onOpenEditHeadmaster && (
            <button
              type="button"
              onClick={onOpenEditHeadmaster}
              className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-xs flex items-center gap-1.5"
              title="প্রধান শিক্ষক স্যারের নাম, পদবি, মোবাইল নম্বর ও শুভেচ্ছা বাণী এডিট করুন"
            >
              <Pencil className="w-3.5 h-3.5 text-slate-950" />
              <span>হেড স্যারের তথ্য এডিট</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              setCurrentPinInput('');
              setNewPinInput('');
              setConfirmPinInput('');
              setChangePinError('');
              setChangePinSuccess('');
              setShowChangePinModal(true);
            }}
            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-amber-200 hover:text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
            title="এডমিন পাসওয়ার্ড পরিবর্তন করুন"
          >
            <KeyRound className="w-3.5 h-3.5 text-amber-300" />
            <span>পিন পরিবর্তন</span>
          </button>
          <button
            type="button"
            onClick={() => setShowAdminLoginModal(true)}
            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg text-xs font-bold transition-colors"
          >
            কর্মকর্তা সুইচ
          </button>
          <button
            type="button"
            onClick={() => setCurrentAdmin(null)}
            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>লগআউট</span>
          </button>
        </div>
      </div>

      {adminActionMessage && (
        <div className={`p-4 rounded-xl text-xs flex items-start gap-3 border ${
          adminActionMessage.type === 'success'
            ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
            : 'bg-rose-50 border-rose-200 text-rose-900'
        }`}>
          {adminActionMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          )}
          <div className="font-medium leading-relaxed">{adminActionMessage.text}</div>
        </div>
      )}

      {/* Admin Sub-tabs Navigation */}
      <div className="bg-white border border-[#d9e6e7] rounded-2xl p-2 shadow-xs">
        <div className="flex items-center gap-1 overflow-x-auto text-xs font-semibold scrollbar-none">
          {[
            { id: 'student_entry', label: '📝 নতুন শিক্ষার্থী ভর্তি এন্ট্রি', icon: UserPlus },
            { id: 'bulk_import', label: '🤖 AI স্ক্যানার ও বাল্ক ডাটা ইম্পোর্ট', icon: Sparkles },
            { id: 'exam_marks_entry', label: '📊 পরীক্ষার নম্বর ও রেজাল্ট এন্ট্রি', icon: Award },
            { id: 'bank_fee_entry', label: '💳 ব্যাংক ডিপোজিট স্লিপ ও ফি এন্ট্রি', icon: Landmark },
            { id: 'notice_entry', label: '📢 নতুন নোটিশ প্রকাশ', icon: BellRing },
            { id: 'account_entry', label: '💰 আয়-ব্যয়ের হিসাব ভাউচার', icon: DollarSign },
            { id: 'quick_list', label: '📋 দ্রুত ১-ক্লিক ভেরিফিকেশন তালিকা', icon: CheckCircle2 }
          ].map(subTab => {
            const Icon = subTab.icon;
            const isActive = adminActiveSubTab === subTab.id;
            return (
              <button
                key={subTab.id}
                type="button"
                onClick={() => setAdminActiveSubTab(subTab.id as any)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-[#0c3664] text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-300' : 'text-slate-400'}`} />
                <span>{subTab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sub-tab: Bulk Import & AI Scanner Hub */}
      {adminActiveSubTab === 'bulk_import' && (
        <div className="bg-white border border-[#d9e6e7] rounded-3xl p-6 md:p-8 shadow-xs space-y-6">
          <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-slate-950 p-6 rounded-2xl shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-900">
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>AI চালিত বাল্ক শিক্ষার্থী ডাটা ও ব্যাংক স্টেটমেন্ট হাব</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-950 mt-1">
                এক সাথে শত শত শিক্ষার্থীর তালিকা অটো-এড করুন
              </h3>
              <p className="text-xs text-slate-900/90 mt-1 max-w-2xl font-medium">
                হাতে লেখা বা প্রিন্ট করা শিক্ষার্থীর রেজিস্টার/তালিকার ছবি (JPG/PNG), স্ক্যানড পিডিএফ কপি অথবা এক্সেল/ওয়ার্ডের পুরো টেবিল কপি-পেস্ট করে ১-ক্লিকে ডেটাবেসে অন্তর্ভুক্ত করার স্বয়ংক্রিয় ব্যবস্থা।
              </p>
            </div>

            {onNavigateToAiScanner && (
              <button
                type="button"
                onClick={onNavigateToAiScanner}
                className="px-6 py-3 bg-[#0c3664] hover:bg-[#092b50] text-white font-extrabold rounded-xl text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer shrink-0 active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>সরাসরি AI স্ক্যানার ট্যাবে যান →</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <span>১. ছাত্র / ছাত্রীদের লিস্ট ছবি বা স্ক্যান করে পাঠানোর পদ্ধতি</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                আপনার কাছে থাকা ক্লাস রেজিস্টার বা ছাত্র-ছাত্রীদের তালিকার পরিষ্কার ছবি (JPG/PNG) বা স্ক্যান কপি <strong>AI স্ক্যানার</strong> ট্যাবে আপলোড করলে এআই স্বয়ংক্রিয়ভাবে শিক্ষার্থীদের নাম, শ্রেণি, শাখা ও রোল শনাক্ত করে টেবিলে সাজিয়ে দেবে।
              </p>
              <div className="text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl font-medium">
                ✓ এছাড়াও ব্যবহারকারী চ্যাটে ছবি বা পিডিএফ পাঠিয়ে দিলে স্বয়ংক্রিয়ভাবে তা সরাসরি মূল ডাটাবেসে সেভ হয়ে যায়।
              </div>
            </div>

            <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <Landmark className="w-4 h-4 text-[#0c3664]" />
                <span>২. ব্যাংকের দৈনিক জমার স্টেটমেন্ট রিকনসিলিয়েশন</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                বাংলাদেশ কৃষি ব্যাংক ও আইএফআইসি ব্যাংক নাপোড়া বাজার শাখা থেকে প্রাপ্ত জমার শিট পেস্ট করলেই এআই শিক্ষার্থীদের ফি পরিশোধ ও ভাউচার ট্রানজাকশন ১-ক্লিকে হালনাগাদ করে দেয়।
              </p>
              <div className="text-[11px] text-blue-900 bg-blue-50 border border-blue-200 p-2.5 rounded-xl font-medium">
                ✓ কৃষি ব্যাংক ও আইএফআইসি ব্যাংকের স্যাম্পল শিট দিয়ে তাৎক্ষণিক টেস্ট করার সুবিধাও রয়েছে।
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub-tab: Student Entry */}
      {adminActiveSubTab === 'student_entry' && (
        <div className="bg-white border border-[#d9e6e7] rounded-3xl p-6 md:p-8 shadow-xs space-y-6">
          {/* Quick Bulk Import Callout */}
          <div className="bg-amber-50 border border-amber-300 p-3.5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-amber-950 font-medium">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span>এক সাথে একাধিক শিক্ষার্থীর তালিকা বা এক্সেল শিট আপলোড করতে চান?</span>
            </div>
            <button
              type="button"
              onClick={() => setAdminActiveSubTab('bulk_import')}
              className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI স্ক্যানার ও বাল্ক ইম্পোর্ট খুলুন</span>
            </button>
          </div>

          <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#d9482b]" />
                <span>নতুন শিক্ষার্থী ভর্তি ও তথ্য ইনপুট ফরম</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                ৬ষ্ঠ থেকে ১০ম শ্রেণির যেকোনো শাখার শিক্ষার্থীর তথ্য ডেটাবেসে সংযুক্ত করুন।
              </p>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              মোট শিক্ষার্থী: {students.length} জন
            </span>
          </div>

          <form onSubmit={handleAddNewStudent} className="space-y-6 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="font-semibold text-slate-700 block mb-1.5">শ্রেণি *</label>
                <select
                  value={newStudentClass}
                  onChange={(e) => setNewStudentClass(e.target.value as any)}
                  className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900 font-medium"
                >
                  <option value="6">৬ষ্ঠ শ্রেণি</option>
                  <option value="7">৭ম শ্রেণি</option>
                  <option value="8">৮ম শ্রেণি</option>
                  <option value="9">৯ম শ্রেণি</option>
                  <option value="10">১০ম শ্রেণি</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1.5">শাখা (Section) *</label>
                <select
                  value={newStudentSection}
                  onChange={(e) => setNewStudentSection(e.target.value as any)}
                  className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900 font-medium"
                >
                  <option value="A">শাখা A</option>
                  <option value="B">শাখা B</option>
                  <option value="C">শাখা C</option>
                  <option value="D">শাখা D</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1.5">রোল নম্বর *</label>
                <input
                  type="number"
                  min="1"
                  max="200"
                  required
                  value={newStudentRoll}
                  onChange={(e) => setNewStudentRoll(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="যেমন: ৩"
                  className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900 font-mono font-medium"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1.5">শিক্ষার্থীর পূর্ণ নাম *</label>
                <input
                  type="text"
                  required
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  placeholder="যেমন: মোঃ সাকিবুল হাসান"
                  className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900 font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="font-semibold text-slate-700 block mb-1.5">লিঙ্গ (Gender) *</label>
                <select
                  value={newStudentGender}
                  onChange={(e) => setNewStudentGender(e.target.value as any)}
                  className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900 font-bold"
                >
                  <option value="male">👦 ছাত্র (ছেলে)</option>
                  <option value="female">👧 ছাত্রী (মেয়ে)</option>
                </select>
              </div>

              {(newStudentClass === '9' || newStudentClass === '10') ? (
                <div>
                  <label className="font-semibold text-slate-700 block mb-1.5">বিভাগ (Department / Group) *</label>
                  <select
                    value={newStudentGroup}
                    onChange={(e) => setNewStudentGroup(e.target.value as any)}
                    className="w-full px-3 py-2 bg-blue-50 border border-blue-300 rounded-xl text-blue-950 font-bold"
                  >
                    <option value="science">🧪 বিজ্ঞান (Science)</option>
                    <option value="humanities">📚 মানবিক (Humanities)</option>
                    <option value="business">💼 ব্যবসায় শিক্ষা (Business)</option>
                  </select>
                </div>
              ) : (
                <div>
                  <label className="font-semibold text-slate-700 block mb-1.5">অভিভাবকের নাম</label>
                  <input
                    type="text"
                    value={newStudentGuardian}
                    onChange={(e) => setNewStudentGuardian(e.target.value)}
                    placeholder="পিতা / মাতার নাম"
                    className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900"
                  />
                </div>
              )}

              {(newStudentClass === '9' || newStudentClass === '10') && (
                <div>
                  <label className="font-semibold text-slate-700 block mb-1.5">অভিভাবকের নাম</label>
                  <input
                    type="text"
                    value={newStudentGuardian}
                    onChange={(e) => setNewStudentGuardian(e.target.value)}
                    placeholder="পিতা / মাতার নাম"
                    className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900"
                  />
                </div>
              )}

              <div>
                <label className="font-semibold text-slate-700 block mb-1.5">অভিভাবকের মোবাইল</label>
                <input
                  type="tel"
                  value={newStudentPhone}
                  onChange={(e) => setNewStudentPhone(e.target.value)}
                  placeholder="017XXXXXXXX"
                  className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1.5">মাসিক বেতন (টাকা)</label>
                <input
                  type="number"
                  value={newStudentMonthlyFee}
                  onChange={(e) => setNewStudentMonthlyFee(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1.5">পরীক্ষার ফি (টাকা)</label>
                <input
                  type="number"
                  value={newStudentExamFee}
                  onChange={(e) => setNewStudentExamFee(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900 font-mono"
                />
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
              <div className="text-slate-500">
                আইডি জেনারেট হবে: <span className="font-mono font-bold text-slate-800">STU-{newStudentClass}{newStudentSection}-{String(newStudentRoll || 0).padStart(3, '0')}</span>
              </div>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#0c3664] hover:bg-[#092b50] text-white font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4 text-amber-300" />
                <span>শিক্ষার্থী তথ্য ডাটাবেসে সেভ করুন</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Sub-tab: Exam Marks & Tabulation Entry */}
      {adminActiveSubTab === 'exam_marks_entry' && (
        <div className="bg-white border border-[#d9e6e7] rounded-3xl p-6 md:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <span>পরীক্ষার নম্বর এন্ট্রি ও ফলাফল প্রস্তুতকরণ সেন্টার</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                ৬ষ্ঠ থেকে ১০ম শ্রেণির শিক্ষার্থীদের ১ম সাময়িক, ২য় সাময়িক ও বার্ষিক পরীক্ষার বিষয়ভিত্তিক নম্বর এন্ট্রি ও স্বয়ংক্রিয় মার্কশিট জেনারেশন।
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setMarksEntryStudentId(undefined);
                  setShowMarksEntryModal(true);
                }}
                className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-xs transition-all border border-emerald-400/40"
              >
                <Award className="w-4 h-4 text-amber-300" />
                <span>📝 নম্বর এন্ট্রি পোর্টাল খুলুন</span>
              </button>

              <button
                type="button"
                onClick={() => setShowTabulationModal(true)}
                className="px-4 py-2.5 bg-[#0c3664] hover:bg-[#092b50] text-amber-200 hover:text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-xs transition-all border border-amber-400/40"
              >
                <FileSpreadsheet className="w-4 h-4 text-amber-400" />
                <span>📊 ক্লাসভিত্তিক টেবুলেশন শীট</span>
              </button>
            </div>
          </div>

          {/* Guidelines Banner (Based on 3-page Government & School Syllabus Rules) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 bg-blue-50/60 border border-blue-200/80 rounded-2xl">
              <div className="font-bold text-[#0c3664] mb-1 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                <span>৬ষ্ঠ-৮ম শ্রেণি পাস নীতি</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                বাংলা ১ম ও ২য় পত্র মিলে মোট ৫০ এবং ইংরেজি ১ম ও ২য় পত্র মিলে মোট ৫০ নম্বর পেলেই শিক্ষার্থী ওই বিষয়ে পাস বলে গণ্য হবে।
              </p>
            </div>

            <div className="p-3.5 bg-amber-50/60 border border-amber-200/80 rounded-2xl">
              <div className="font-bold text-amber-900 mb-1 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                <span>৯ম-১০ম শ্রেণি ও বিজ্ঞান বিভাগ</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                বিজ্ঞান বিভাগে পদার্থ, রসায়ন ও জীববিজ্ঞানে CQ+MCQ মিলে ৬৬ পেলে পাস। সাধারণ বিষয়ে CQ ৭০-এ ২৩ এবং MCQ ৩০-এ ১০ পাস মার্ক।
              </p>
            </div>

            <div className="p-3.5 bg-emerald-50/60 border border-emerald-200/80 rounded-2xl">
              <div className="font-bold text-emerald-900 mb-1 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                <span>মানবিক ও ব্যবসায় শিক্ষা</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                নৈর্বাচনিক বিষয়ে ছাত্রদের জন্য কৃষি শিক্ষা এবং ছাত্রীদের জন্য গার্হস্থ্য বিজ্ঞান স্বয়ংক্রিয়ভাবে প্রযোজ্য ও কার্যকর হয়।
              </p>
            </div>
          </div>

          {/* Quick Student Marks Entry Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800">
                সকল শিক্ষার্থীর সরাসরি নম্বর এন্ট্রি ও স্বতন্ত্র মার্কশিট তালিকা:
              </span>
              <span className="text-slate-500 font-mono">মোট শিক্ষার্থী: {students.length} জন</span>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f0f6f6] text-slate-700 font-bold border-b border-slate-200 uppercase text-[11px]">
                  <tr>
                    <th className="py-2.5 px-3">রোল</th>
                    <th className="py-2.5 px-3">শিক্ষার্থীর নাম</th>
                    <th className="py-2.5 px-3">শ্রেণি ও শাখা</th>
                    <th className="py-2.5 px-3">গ্রুপ / লিঙ্গ</th>
                    <th className="py-2.5 px-3 text-center">পরীক্ষা রেকর্ড</th>
                    <th className="py-2.5 px-3 text-right">কার্যক্রম (Action)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students.map(s => (
                    <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-800">#{s.roll}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-900">{s.name}</td>
                      <td className="py-2.5 px-3 text-slate-600">{formatClassBangla(s.className)} · শাখা {s.section}</td>
                      <td className="py-2.5 px-3 text-slate-500">
                        {s.gender === 'female' ? 'ছাত্রী' : 'ছাত্র'} {s.group ? `(${s.group === 'science' ? 'বিজ্ঞান' : s.group === 'humanities' ? 'মানবিক' : 'ব্যবসায়'})` : ''}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="inline-block bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-[11px] font-semibold border border-blue-200">
                          {s.examRecords?.['১ম সাময়িক'] ? '১ম সাময়িক এন্ট্রিকৃত' : 'নম্বর প্রস্তুত'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setMarksEntryStudentId(s.id);
                              setShowMarksEntryModal(true);
                            }}
                            className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs flex items-center gap-1 shadow-2xs transition-colors"
                            title="এই শিক্ষার্থীর নম্বর এন্ট্রি করুন"
                          >
                            <Pencil className="w-3 h-3 text-amber-300" />
                            <span>নম্বর এন্ট্রি</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedStudentForMarksheet(s);
                              setShowMarksheetModal(true);
                            }}
                            className="px-2.5 py-1.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1 shadow-2xs transition-colors"
                            title="এই শিক্ষার্থীর অফিশিয়াল A4 মার্কশিট প্রিন্ট করুন"
                          >
                            <Award className="w-3 h-3 text-slate-950" />
                            <span>A4 মার্কশিট</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Sub-tab: Bank Fee Entry */}
      {adminActiveSubTab === 'bank_fee_entry' && (
        <div className="bg-white border border-[#d9e6e7] rounded-3xl p-6 md:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Landmark className="w-5 h-5 text-[#0c3664]" />
              <span>ব্যাংক ডিপোজিট স্লিপ / চালান দিয়ে সরাসরি ফি এন্ট্রি</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              শিক্ষার্থী বা অভিভাবক নাপোড়া বাজারের ব্যাংক শাখায় ফি জমা দিয়ে স্লিপ নিয়ে এলে এখান থেকে সরাসরি এন্ট্রি ও অনুমোদন করুন।
            </p>
          </div>

          <form onSubmit={handleRecordBankPayment} className="space-y-6 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="font-semibold text-slate-700 block mb-1.5">শিক্ষার্থী নির্বাচন *</label>
                <select
                  value={feeStudentId}
                  onChange={(e) => setFeeStudentId(e.target.value)}
                  className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900 font-medium"
                >
                  <option value="">-- শিক্ষার্থী বাছাই করুন --</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      [{formatClassOrdinal(s.className)}-{s.section}, রোল {s.roll}] {s.name} ({s.status === 'paid' ? 'পরিশোধিত' : 'বকেয়া'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1.5">কোন মাসের বেতন *</label>
                <select
                  value={feeMonth}
                  onChange={(e) => setFeeMonth(e.target.value)}
                  className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900 font-bold"
                >
                  {[
                    'জানুয়ারি ২০২৬', 'ফেব্রুয়ারি ২০২৬', 'মার্চ ২০২৬', 'এপ্রিল ২০২৬',
                    'মে ২০২৬', 'জুন ২০২৬', 'জুলাই ২০২৬', 'আগস্ট ২০২৬',
                    'সেপ্টেম্বর ২০২৬', 'অক্টোবর ২০২৬', 'নভেম্বর ২০২৬', 'ডিসেম্বর ২০২৬'
                  ].map(m => (
                    <option key={m} value={m}>{m} মাসের বেতন</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1.5">জমার ব্যাংক শাখা *</label>
                <select
                  value={feeBank}
                  onChange={(e) => setFeeBank(e.target.value as any)}
                  className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900 font-medium"
                >
                  <option value="বাংলাদেশ কৃষি ব্যাংক">বাংলাদেশ কৃষি ব্যাংক, নাপোড়া বাজার শাখা</option>
                  <option value="আইএফআইসি ব্যাংক">আইএফআইসি ব্যাংক পিএলসি, নাপোড়া বাজার উপশাখা</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1.5">ডিপোজিট স্লিপ / চালান নং</label>
                <input
                  type="text"
                  value={feeSlipNo}
                  onChange={(e) => setFeeSlipNo(e.target.value)}
                  placeholder="যেমন: BKB-2026-8802"
                  className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="font-semibold text-slate-700 block mb-1.5">জমার তারিখ *</label>
                <input
                  type="date"
                  value={feeDate}
                  onChange={(e) => setFeeDate(e.target.value)}
                  className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1.5">জমার পরিমাণ (টাকা)</label>
                <input
                  type="number"
                  value={feeAmount}
                  onChange={(e) => setFeeAmount(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="স্বয়ংক্রিয় বা কাস্টম পরিমাণ"
                  className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1.5">অনুমোদনকারী কর্মকর্তা</label>
                <input
                  type="text"
                  disabled
                  value={`${currentAdmin.name} (${currentAdmin.roleName})`}
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-slate-600 font-medium cursor-not-allowed"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>ফি অনুমোদন ও ডেটাবেসে পেইড মার্ক করুন</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Sub-tab: Notice Entry */}
      {adminActiveSubTab === 'notice_entry' && (
        <div className="bg-white border border-[#d9e6e7] rounded-3xl p-6 md:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <BellRing className="w-5 h-5 text-[#d9482b]" />
              <span>ডিজিটাল নোটিশ বোর্ডে নতুন বিজ্ঞপ্তি প্রকাশ</span>
            </h3>
          </div>

          <form onSubmit={handlePublishNotice} className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1.5">নোটিশের শিরোনাম *</label>
              <input
                type="text"
                required
                value={noticeTitle}
                onChange={(e) => setNoticeTitle(e.target.value)}
                placeholder="যেমন: অর্ধবার্ষিক পরীক্ষার ফি জমাদানের বর্ধিত সময়সীমা প্রসঙ্গে"
                className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900 font-medium"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1.5">বিজ্ঞপ্তির বিস্তারিত বিবরণ *</label>
              <textarea
                rows={4}
                required
                value={noticeContent}
                onChange={(e) => setNoticeContent(e.target.value)}
                placeholder="সকল ছাত্র-ছাত্রী, অভিভাবক ও শিক্ষকমণ্ডলীর অবগতির জন্য জানানো যাচ্ছে যে..."
                className="w-full p-3 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-slate-700 block mb-1.5">প্রচারক / আদেশক্রমে</label>
                <input
                  type="text"
                  value={noticeAuthor}
                  onChange={(e) => setNoticeAuthor(e.target.value)}
                  placeholder="যেমন: প্রধান শিক্ষক"
                  className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#0c3664] hover:bg-[#092b50] text-white font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5 text-amber-300" />
                  <span>ডিজিটাল নোটিশ বোর্ডে প্রকাশ করুন</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Sub-tab: Accounts Voucher */}
      {adminActiveSubTab === 'account_entry' && (
        <div className="bg-white border border-[#d9e6e7] rounded-3xl p-6 md:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-600" />
              <span>আয় ও ব্যয় ভাউচার এন্ট্রি (ক্যাশ বুক ও ব্যাংক লেজার)</span>
            </h3>
          </div>

          <form onSubmit={handleAddTransaction} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="font-semibold text-slate-700 block mb-1.5">লেনদেনের ধরন *</label>
                <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setTxnType('income')}
                    className={`flex-1 py-1.5 rounded-lg font-bold ${
                      txnType === 'income' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    + আয় (Income)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTxnType('expense')}
                    className={`flex-1 py-1.5 rounded-lg font-bold ${
                      txnType === 'expense' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    - ব্যয় (Expense)
                  </button>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1.5">খাত / বিবরণ *</label>
                <input
                  type="text"
                  required
                  value={txnTitle}
                  onChange={(e) => setTxnTitle(e.target.value)}
                  placeholder="যেমন: বিদ্যুৎ বিল পরিশোধ / খেলার সামগ্রী"
                  className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1.5">টাকার পরিমাণ *</label>
                <input
                  type="number"
                  required
                  value={txnAmount}
                  onChange={(e) => setTxnAmount(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="৳ টাকার অংক"
                  className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900 font-mono font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="font-semibold text-slate-700 block mb-1.5">অ্যাকাউন্ট / মাধ্যম</label>
                <select
                  value={txnBank}
                  onChange={(e) => setTxnBank(e.target.value as any)}
                  className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900"
                >
                  <option value="বাংলাদেশ কৃষি ব্যাংক">বাংলাদেশ কৃষি ব্যাংক (নাপোড়া বাজার)</option>
                  <option value="আইএফআইসি ব্যাংক">আইএফআইসি ব্যাংক (নাপোড়া বাজার উপশাখা)</option>
                  <option value="Cash">ক্যাশ ইন হ্যান্ড (অফিস ক্যাশ)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1.5">ভাউচার / চেক নং</label>
                <input
                  type="text"
                  value={txnRefNo}
                  onChange={(e) => setTxnRefNo(e.target.value)}
                  placeholder="যেমন: VCH-1092"
                  className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900 font-mono"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>হিসাব বইতে যুক্ত করুন</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Sub-tab: Quick Verification List */}
      {adminActiveSubTab === 'quick_list' && (
        <div className="bg-white border border-[#d9e6e7] rounded-3xl p-6 md:p-8 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                শিক্ষার্থীদের ফি তালিকা ও ১-ক্লিক স্ট্যাটাস পরিবর্তন
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs bg-[#f0f6f6] p-1.5 rounded-xl border border-[#d2e5e7]">
              <span className="font-semibold text-slate-700">ডিফল্ট ব্যাংক:</span>
              <select
                value={clerkSelectedBank}
                onChange={(e) => setClerkSelectedBank(e.target.value as any)}
                className="bg-white border border-[#d2e5e7] rounded-lg px-2 py-1 text-xs font-medium"
              >
                <option value="বাংলাদেশ কৃষি ব্যাংক">কৃষি ব্যাংক (নাপোড়া বাজার)</option>
                <option value="আইএফআইসি ব্যাংক">আইএফআইসি ব্যাংক (উপশাখা)</option>
              </select>
              <span className="font-semibold text-slate-700 ml-1">বেতনের মাস:</span>
              <select
                value={clerkSelectedMonth}
                onChange={(e) => setClerkSelectedMonth(e.target.value)}
                className="bg-white border border-[#d2e5e7] rounded-lg px-2 py-1 text-xs font-bold text-[#0c3664]"
              >
                {[
                  'জানুয়ারি ২০২৬', 'ফেব্রুয়ারি ২০২৬', 'মার্চ ২০২৬', 'এপ্রিল ২০২৬',
                  'মে ২০২৬', 'জুন ২০২৬', 'জুলাই ২০২৬', 'আগস্ট ২০২৬',
                  'সেপ্টেম্বর ২০২৬', 'অক্টোবর ২০২৬', 'নভেম্বর ২০২৬', 'ডিসেম্বর ২০২৬'
                ].map(m => (
                  <option key={m} value={m}>{m} মাসের বেতন</option>
                ))}
              </select>
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f0f6f6] text-slate-600 font-semibold border-b border-[#d2e5e7]">
                  <tr>
                    <th className="py-2.5 px-3">রোল ও আইডি</th>
                    <th className="py-2.5 px-3">নাম</th>
                    <th className="py-2.5 px-3">শ্রেণি ও শাখা</th>
                    <th className="py-2.5 px-3">অভিভাবক ও ফোন</th>
                    <th className="py-2.5 px-3 text-right">বকেয়া ফি</th>
                    <th className="py-2.5 px-3 text-center">বর্তমান অবস্থা</th>
                    <th className="py-2.5 px-3 text-right">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students.map(student => (
                    <tr key={student.id} className="hover:bg-slate-50">
                      <td className="py-3 px-3 font-mono font-medium text-slate-900">
                        <div>রোল: {student.roll}</div>
                        <div className="text-[10px] text-slate-400">{student.id}</div>
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-900">{student.name}</td>
                      <td className="py-3 px-3 text-slate-600">{student.className}ম · শাখা {student.section}</td>
                      <td className="py-3 px-3 text-slate-600">
                        <div>{student.guardianName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{student.guardianPhone}</div>
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-slate-800">
                        ৳{student.monthlyFee + student.examFee}
                      </td>
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        {student.status === 'paid' ? (
                          <span className="inline-block bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded text-[11px] font-bold border border-emerald-300">
                            ✓ পেইড ({student.paidMonth || 'অক্টোবর ২০২৬'})
                          </span>
                        ) : (
                          <span className="inline-block bg-rose-50 text-rose-700 px-2 py-0.5 rounded text-[11px] font-semibold border border-rose-200">
                            বকেয়া ({student.dueMonth || 'অক্টোবর ২০২৬'})
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        {student.status === 'due' ? (
                          <button
                            type="button"
                            onClick={() => handleQuickTogglePayment(student.id, true)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                          >
                            ✓ পেইড মার্ক করুন
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleQuickTogglePayment(student.id, false)}
                            className="px-3 py-1.5 bg-slate-200 hover:bg-rose-100 hover:text-rose-700 text-slate-600 rounded-lg text-xs font-medium transition-colors"
                          >
                            আন-ডু
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Student Individual Marksheet Modal */}
      {showMarksheetModal && selectedStudentForMarksheet && (
        <StudentMarksheetModal
          student={selectedStudentForMarksheet}
          allStudents={students}
          isOpen={showMarksheetModal}
          onClose={() => {
            setShowMarksheetModal(false);
            setSelectedStudentForMarksheet(null);
          }}
          onSelectStudent={(stu) => setSelectedStudentForMarksheet(stu)}
          onUpdateStudentMarks={(studentId, examType, marksMap) => {
            const evaluated = evaluateStudentMarks(
              selectedStudentForMarksheet.className,
              selectedStudentForMarksheet.gender || 'male',
              selectedStudentForMarksheet.group || 'science',
              marksMap
            );

            const updated = students.map(s => {
              if (s.id === studentId) {
                return {
                  ...s,
                  examRecords: {
                    ...(s.examRecords || {}),
                    [examType]: evaluated
                  }
                };
              }
              return s;
            });

            setStudents(updated);
            try {
              localStorage.setItem('school_students', JSON.stringify(updated));
            } catch {}

            setSelectedStudentForMarksheet(prev => prev ? {
              ...prev,
              examRecords: {
                ...(prev.examRecords || {}),
                [examType]: evaluated
              }
            } : null);

            setAdminActionMessage({
              type: 'success',
              text: `"${selectedStudentForMarksheet.name}"-এর ${examType} পরীক্ষার নম্বর সফলভাবে সংরক্ষিত হয়েছে!`
            });
          }}
        />
      )}

      {/* Class Tabulation Modal */}
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

      {/* Exam Marks Entry Modal */}
      {showMarksEntryModal && (
        <ExamMarksEntryModal
          students={students}
          setStudents={setStudents}
          isOpen={showMarksEntryModal}
          onClose={() => {
            setShowMarksEntryModal(false);
            setMarksEntryStudentId(undefined);
          }}
          preSelectedStudentId={marksEntryStudentId}
          onShowFeedback={(msg) => setAdminActionMessage({ type: 'success', text: msg })}
        />
      )}

      {/* Change Password / PIN Modal */}
      {showChangePinModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5 relative animate-in fade-in zoom-in-95 duration-150">
            <button
              type="button"
              onClick={() => setShowChangePinModal(false)}
              className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-amber-50 border border-amber-200 text-amber-600 rounded-2xl flex items-center justify-center shrink-0">
                <KeyRound className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">এডমিন পাসওয়ার্ড পরিবর্তন</h3>
                <p className="text-xs text-slate-500">সিকিউরিটি পিন কোড আপডেট করুন</p>
              </div>
            </div>

            {changePinError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{changePinError}</span>
              </div>
            )}

            {changePinSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0" />
                <span>{changePinSuccess}</span>
              </div>
            )}

            <form onSubmit={handleSaveNewPin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  বর্তমান পিন কোড <span className="text-slate-400 font-normal">(ডিফল্ট: 1234)</span>:
                </label>
                <div className="relative">
                  <input
                    type={showPinText ? 'text' : 'password'}
                    value={currentPinInput}
                    onChange={(e) => setCurrentPinInput(e.target.value)}
                    placeholder="বর্তমান পিন লিখুন"
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0c3664]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPinText(!showPinText)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPinText ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  নতুন গোপন পিন কোড:
                </label>
                <input
                  type={showPinText ? 'text' : 'password'}
                  value={newPinInput}
                  onChange={(e) => setNewPinInput(e.target.value)}
                  placeholder="কমপক্ষে ৪ সংখ্যার নতুন পিন দিন"
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0c3664]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  নতুন পিন নিশ্চিত করুন:
                </label>
                <input
                  type={showPinText ? 'text' : 'password'}
                  value={confirmPinInput}
                  onChange={(e) => setConfirmPinInput(e.target.value)}
                  placeholder="নতুন পিনটি পুনরায় লিখুন"
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0c3664]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowChangePinModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-xl text-xs font-bold transition-colors"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 rounded-xl text-xs font-extrabold shadow-sm transition-all"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
