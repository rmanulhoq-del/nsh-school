import React, { useState, useMemo, useEffect } from 'react';
import {
  Printer,
  MessageSquare,
  Search,
  UserPlus,
  Pencil,
  Trash2,
  X,
  Save,
  CheckCircle2,
  AlertCircle,
  FileText,
  UserMinus,
  RotateCcw,
  Sparkles,
  Phone,
  ShieldCheck,
  Calendar,
  ArrowLeft,
  FileSpreadsheet,
  Award,
  Filter,
  Lock,
  Layers
} from 'lucide-react';
import {
  Student,
  StudentGender,
  StudentGroup,
  ExamType,
  formatClassOrdinal,
  formatClassBangla,
  formatGroupBangla,
  formatSectionBangla
} from '../types';
import { StudentDataForDispatch } from './GuardianDispatchModal';
import StudentMarksheetModal from './StudentMarksheetModal';
import ClassTabulationSheetModal from './ClassTabulationSheetModal';
import ExamMarksEntryModal from './ExamMarksEntryModal';
import StudentRegisterPrintModal from './StudentRegisterPrintModal';
import { evaluateStudentMarks, MarkInput, EXAM_MONTHS, EXAM_BANKS } from '../data/examRules';

interface StudentsTabProps {
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  isAdmin: boolean;
  onOpenDispatch: (student: StudentDataForDispatch) => void;
  onOpenSlip: (student: StudentDataForDispatch) => void;
  onPrint: () => void;
}

export default function StudentsTab({
  students,
  setStudents,
  isAdmin,
  onOpenDispatch,
  onOpenSlip,
  onPrint
}: StudentsTabProps) {
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'active' | 'tc_archive'>('active');
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // Marksheet & Tabulation Modal States
  const [showMarksheetModal, setShowMarksheetModal] = useState<boolean>(false);
  const [selectedStudentForMarksheet, setSelectedStudentForMarksheet] = useState<Student | null>(null);
  const [showTabulationModal, setShowTabulationModal] = useState<boolean>(false);
  const [showRegisterPrintModal, setShowRegisterPrintModal] = useState<boolean>(false);

  // Dedicated Exam Marks Entry Modal State
  const [showMarksEntryModal, setShowMarksEntryModal] = useState<boolean>(false);
  const [marksEntryStudentId, setMarksEntryStudentId] = useState<string | undefined>(undefined);

  // TC Archive State (persisted in localStorage)
  const [tcArchive, setTcArchive] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem('school_tc_students');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modal 1: Add Student State
  const [showAddModal, setShowAddModal] = useState(false);
  const [addModalError, setAddModalError] = useState<string | null>(null);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentClass, setNewStudentClass] = useState<'6' | '7' | '8' | '9' | '10'>('6');
  const [newStudentSection, setNewStudentSection] = useState<'A' | 'B' | 'C' | 'D'>('A');
  const [newStudentRoll, setNewStudentRoll] = useState<number | ''>(1);
  const [newStudentGuardian, setNewStudentGuardian] = useState('');
  const [newStudentPhone, setNewStudentPhone] = useState('');
  const [newStudentMonthlyFee, setNewStudentMonthlyFee] = useState<number>(500);
  const [newStudentExamFee, setNewStudentExamFee] = useState<number>(300);
  const [newStudentStatus, setNewStudentStatus] = useState<'due' | 'paid'>('due');
  const [newStudentGender, setNewStudentGender] = useState<StudentGender>('male');
  const [newStudentGroup, setNewStudentGroup] = useState<StudentGroup>('science');
  const [newStudentFather, setNewStudentFather] = useState('');
  const [newStudentMother, setNewStudentMother] = useState('');
  const [newStudentAddress, setNewStudentAddress] = useState('');
  const [newStudentBirthDate, setNewStudentBirthDate] = useState('2013-03-15');
  const [newStudentBirthReg, setNewStudentBirthReg] = useState('');
  const [newStudentAdmissionDate, setNewStudentAdmissionDate] = useState(new Date().toISOString().split('T')[0]);
  const [newStudentFeeMonths, setNewStudentFeeMonths] = useState<string[]>(['অক্টোবর']);
  const [newStudentFeeYear, setNewStudentFeeYear] = useState('২০২৬');
  const [newStudentExamType, setNewStudentExamType] = useState<ExamType>('১ম সাময়িক');
  const [newStudentBank, setNewStudentBank] = useState<string>('বাংলাদেশ কৃষি ব্যাংক, নাপোড়া শাখা');

  // Modal 2: Edit Student State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editModalError, setEditModalError] = useState<string | null>(null);
  const [editingStudentId, setEditingStudentId] = useState('');
  const [editStudentName, setEditStudentName] = useState('');
  const [editStudentClass, setEditStudentClass] = useState<'6' | '7' | '8' | '9' | '10'>('6');
  const [editStudentSection, setEditStudentSection] = useState<'A' | 'B' | 'C' | 'D'>('A');
  const [editStudentRoll, setEditStudentRoll] = useState<number>(1);
  const [editStudentGuardian, setEditStudentGuardian] = useState('');
  const [editStudentPhone, setEditStudentPhone] = useState('');
  const [editStudentMonthlyFee, setEditStudentMonthlyFee] = useState<number>(500);
  const [editStudentExamFee, setEditStudentExamFee] = useState<number>(300);
  const [editStudentStatus, setEditStudentStatus] = useState<'paid' | 'due'>('due');
  const [editStudentBank, setEditStudentBank] = useState<string>('বাংলাদেশ কৃষি ব্যাংক, নাপোড়া শাখা');
  const [editStudentPaidMonth, setEditStudentPaidMonth] = useState('অক্টোবর ২০২৬');
  const [editStudentDueMonth, setEditStudentDueMonth] = useState('অক্টোবর ২০২৬');
  const [editStudentTxnId, setEditStudentTxnId] = useState('');
  const [editStudentGender, setEditStudentGender] = useState<StudentGender>('male');
  const [editStudentGroup, setEditStudentGroup] = useState<StudentGroup>('science');
  const [editStudentFather, setEditStudentFather] = useState('');
  const [editStudentMother, setEditStudentMother] = useState('');
  const [editStudentAddress, setEditStudentAddress] = useState('');
  const [editStudentBirthDate, setEditStudentBirthDate] = useState('');
  const [editStudentBirthReg, setEditStudentBirthReg] = useState('');
  const [editStudentAdmissionDate, setEditStudentAdmissionDate] = useState('');
  const [editStudentFeeMonths, setEditStudentFeeMonths] = useState<string[]>(['অক্টোবর']);
  const [editStudentFeeYear, setEditStudentFeeYear] = useState('২০২৬');
  const [editStudentExamType, setEditStudentExamType] = useState<ExamType>('১ম সাময়িক');

  // Modal 3: TC (Transfer Certificate) & Delete State
  const [showTcModal, setShowTcModal] = useState(false);
  const [targetStudentForTc, setTargetStudentForTc] = useState<Student | null>(null);
  const [tcReason, setTcReason] = useState('অন্য শিক্ষাপ্রতিষ্ঠানে ভর্তি / অভিভাবকের স্থানান্তর');
  const [tcDate, setTcDate] = useState(new Date().toISOString().split('T')[0]);
  const [tcActionType, setTcActionType] = useState<'tc_archive' | 'permanent_delete'>('tc_archive');

  // Helper to calculate the next available roll number in a specific class and section
  const getNextAvailableRoll = (cls: string, sec: string) => {
    const existingRolls = students
      .filter(s => s.className === cls && s.section === sec && !s.tcIssued)
      .map(s => s.roll);
    if (existingRolls.length === 0) return 1;
    let next = 1;
    while (existingRolls.includes(next)) {
      next++;
    }
    return next;
  };

  // Check if current input roll in Add Modal already belongs to another student
  const existingStudentWithRoll = useMemo(() => {
    if (newStudentRoll === '' || !newStudentRoll) return null;
    return students.find(
      s => s.className === newStudentClass && s.section === newStudentSection && s.roll === Number(newStudentRoll) && !s.tcIssued
    );
  }, [students, newStudentClass, newStudentSection, newStudentRoll]);

  // Open Add Student Modal initialized with next available roll
  const handleOpenAddModal = () => {
    const targetClass = (selectedClass !== 'all' ? selectedClass : '6') as '6' | '7' | '8' | '9' | '10';
    const targetSec = (selectedSection !== 'all' ? selectedSection : 'A') as 'A' | 'B' | 'C' | 'D';
    setNewStudentClass(targetClass);
    setNewStudentSection(targetSec);
    setNewStudentRoll(getNextAvailableRoll(targetClass, targetSec));
    setNewStudentName('');
    setNewStudentGuardian('');
    setNewStudentPhone('');
    setNewStudentFather('');
    setNewStudentMother('');
    setNewStudentAddress('');
    setNewStudentBirthReg('');
    setAddModalError(null);
    setShowAddModal(true);
  };

  // Handle Escape key to close any open modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowAddModal(false);
        setShowEditModal(false);
        setShowTcModal(false);
        setTargetStudentForTc(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const showFeedback = (msg: string) => {
    setActionFeedback(msg);
    setTimeout(() => setActionFeedback(null), 5000);
  };

  // Filtered Students Calculation
  const currentList = viewMode === 'active' ? students : tcArchive;

  const filteredStudents = useMemo(() => {
    return currentList.filter(student => {
      if (selectedClass !== 'all' && student.className !== selectedClass) return false;
      if (selectedSection !== 'all' && student.section !== selectedSection) return false;
      if (selectedGroup !== 'all') {
        if (student.className === '9' || student.className === '10') {
          if (student.group !== selectedGroup) return false;
        } else {
          return false;
        }
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = student.name.toLowerCase().includes(query);
        const matchesId = student.id.toLowerCase().includes(query);
        const matchesRoll = student.roll.toString().includes(query);
        const matchesPhone = student.guardianPhone.includes(query);
        const matchesGroup = student.group ? formatGroupBangla(student.group).toLowerCase().includes(query) : false;
        if (!matchesName && !matchesId && !matchesRoll && !matchesPhone && !matchesGroup) return false;
      }
      return true;
    });
  }, [currentList, selectedClass, selectedSection, selectedGroup, searchQuery]);

  // Handle Add Student
  const handleAddStudentSubmit = (e?: React.FormEvent) => {
    if (e && e.preventDefault) e.preventDefault();
    setAddModalError(null);

    if (!newStudentName.trim()) {
      setAddModalError('শিক্ষার্থীর পূর্ণ নাম অবশ্যই পূরণ করতে হবে।');
      return;
    }

    if (newStudentRoll === '' || Number(newStudentRoll) <= 0) {
      setAddModalError('অনুগ্রহ করে একটি সঠিক রোল নম্বর (যেমন: ১, ২, ৩...) প্রদান করুন।');
      return;
    }

    const rollNum = Number(newStudentRoll);
    const existing = students.find(
      s => s.className === newStudentClass && s.section === newStudentSection && s.roll === rollNum && !s.tcIssued
    );

    if (existing) {
      const nextRoll = getNextAvailableRoll(newStudentClass, newStudentSection);
      setAddModalError(
        `সতর্কতা: ${formatClassBangla(newStudentClass)}, শাখা ${newStudentSection}-এ রোল #${rollNum} ইতিমধ্যে "${existing.name}"-এর নামে নিবন্ধিত রয়েছে! অনুগ্রহ করে অন্য রোল দিন অথবা নিচের বাটনে ক্লিক করে পরবর্তী খালি রোল (${nextRoll}) ব্যবহার করুন।`
      );
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
      fatherName: newStudentFather.trim() || undefined,
      motherName: newStudentMother.trim() || undefined,
      guardianName: newStudentGuardian.trim() || newStudentFather.trim() || 'অভিভাবকের নাম উল্লেখ নেই',
      guardianPhone: newStudentPhone.trim() || '০১৮XX-XXXXXX',
      address: newStudentAddress.trim() || 'নাপোড়া, বাঁশখালী, চট্টগ্রাম',
      birthDate: newStudentBirthDate || '২০১৩-০৩-১৫',
      birthRegNo: newStudentBirthReg.trim() || undefined,
      admissionDate: newStudentAdmissionDate || new Date().toISOString().split('T')[0],
      monthlyFee: Number(newStudentMonthlyFee) || 500,
      examFee: Number(newStudentExamFee) || 300,
      status: newStudentStatus,
      dueMonth: newStudentStatus === 'due' ? 'অক্টোবর ২০২৬' : undefined,
      paidMonth: newStudentStatus === 'paid' ? 'অক্টোবর ২০২৬' : undefined,
      paidBank: newStudentBank as any,
      feeMonths: newStudentFeeMonths,
      feeYear: newStudentFeeYear,
      examType: newStudentExamType,
      examFeeStatus: newStudentStatus,
      txnId: newStudentStatus === 'paid' ? `BKB-NEW-${Math.floor(1000 + Math.random() * 9000)}` : undefined,
      paymentDate: newStudentStatus === 'paid' ? new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) : undefined
    };

    const updated = [newStudent, ...students];
    setStudents(updated);
    try {
      localStorage.setItem('school_students', JSON.stringify(updated));
    } catch {}

    setNewStudentName('');
    setNewStudentRoll('');
    setNewStudentGuardian('');
    setNewStudentPhone('');
    setNewStudentFather('');
    setNewStudentMother('');
    setNewStudentAddress('');
    setNewStudentBirthReg('');
    setAddModalError(null);
    setShowAddModal(false);
    showFeedback(`আলহামদুলিল্লাহ! নতুন শিক্ষার্থী "${newStudent.name}" (${formatClassBangla(newStudent.className)}, শাখা ${newStudentSection}, রোল #${newStudent.roll}) সফলভাবে ডাটাবেসে সংরক্ষিত হয়েছে।`);
  };

  // Open Edit Modal
  const handleOpenEdit = (student: Student) => {
    setEditingStudentId(student.id);
    setEditStudentName(student.name);
    setEditStudentClass(student.className);
    setEditStudentSection(student.section);
    setEditStudentRoll(student.roll);
    setEditStudentGuardian(student.guardianName);
    setEditStudentPhone(student.guardianPhone);
    setEditStudentMonthlyFee(student.monthlyFee);
    setEditStudentExamFee(student.examFee);
    setEditStudentStatus(student.status);
    setEditStudentBank(student.paidBank || 'বাংলাদেশ কৃষি ব্যাংক, নাপোড়া শাখা');
    setEditStudentPaidMonth(student.paidMonth || 'অক্টোবর ২০২৬');
    setEditStudentDueMonth(student.dueMonth || 'অক্টোবর ২০২৬');
    setEditStudentTxnId(student.txnId || '');
    setEditStudentGender(student.gender || 'male');
    setEditStudentGroup(student.group || 'science');
    setEditStudentFather(student.fatherName || '');
    setEditStudentMother(student.motherName || '');
    setEditStudentAddress(student.address || '');
    setEditStudentBirthDate(student.birthDate || '');
    setEditStudentBirthReg(student.birthRegNo || '');
    setEditStudentAdmissionDate(student.admissionDate || '');
    setEditStudentFeeMonths(student.feeMonths || ['অক্টোবর']);
    setEditStudentFeeYear(student.feeYear || '২০২৬');
    setEditStudentExamType(student.examType || '১ম সাময়িক');
    setShowEditModal(true);
  };

  // Save Edit Student
  const handleSaveEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editStudentName.trim()) return;

    const updated = students.map(s => {
      if (s.id === editingStudentId) {
        return {
          ...s,
          name: editStudentName.trim(),
          className: editStudentClass,
          section: editStudentSection,
          roll: Number(editStudentRoll),
          gender: editStudentGender,
          group: (editStudentClass === '9' || editStudentClass === '10') ? editStudentGroup : undefined,
          fatherName: editStudentFather.trim() || undefined,
          motherName: editStudentMother.trim() || undefined,
          guardianName: editStudentGuardian.trim() || editStudentFather.trim() || 'অভিভাবকের নাম উল্লেখ নেই',
          guardianPhone: editStudentPhone.trim() || s.guardianPhone,
          address: editStudentAddress.trim() || s.address,
          birthDate: editStudentBirthDate || s.birthDate,
          birthRegNo: editStudentBirthReg.trim() || s.birthRegNo,
          admissionDate: editStudentAdmissionDate || s.admissionDate,
          monthlyFee: Number(editStudentMonthlyFee),
          examFee: Number(editStudentExamFee),
          status: editStudentStatus,
          paidBank: (editStudentBank || 'বাংলাদেশ কৃষি ব্যাংক, নাপোড়া শাখা') as any,
          feeMonths: editStudentFeeMonths,
          feeYear: editStudentFeeYear,
          examType: editStudentExamType,
          paidMonth: editStudentStatus === 'paid' ? editStudentPaidMonth : undefined,
          dueMonth: editStudentStatus === 'due' ? editStudentDueMonth : undefined,
          txnId: editStudentStatus === 'paid' ? (editStudentTxnId || s.txnId || `BKB-EDIT-${Math.floor(1000 + Math.random() * 9000)}`) : undefined,
          paymentDate: editStudentStatus === 'paid' ? (s.paymentDate || new Date().toLocaleString()) : undefined
        };
      }
      return s;
    });

    setStudents(updated);
    try {
      localStorage.setItem('school_students', JSON.stringify(updated));
    } catch {}

    setShowEditModal(false);
    showFeedback(`শিক্ষার্থী "${editStudentName}"-এর তথ্য সফলভাবে সম্পূর্ণ আপডেট করা হয়েছে।`);
  };

  // Open TC Modal
  const handleOpenTc = (student: Student) => {
    setTargetStudentForTc(student);
    setTcDate(new Date().toISOString().split('T')[0]);
    setTcActionType('tc_archive');
    setShowTcModal(true);
  };

  // Execute TC / Delete
  const handleExecuteTc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetStudentForTc) return;

    const studentToProcess = targetStudentForTc;

    if (tcActionType === 'tc_archive') {
      // Move to TC Archive
      const tcRecord: Student = {
        ...studentToProcess,
        tcIssued: true,
        tcDate: tcDate,
        tcReason: tcReason
      };

      const updatedArchive = [tcRecord, ...tcArchive];
      setTcArchive(updatedArchive);
      try {
        localStorage.setItem('school_tc_students', JSON.stringify(updatedArchive));
      } catch {}

      // Remove from active list
      const updatedActive = students.filter(s => s.id !== studentToProcess.id);
      setStudents(updatedActive);
      try {
        localStorage.setItem('school_students', JSON.stringify(updatedActive));
      } catch {}

      showFeedback(`শিক্ষার্থী "${studentToProcess.name}" (আইডি: ${studentToProcess.id})-কে টিসি (Transfer Certificate) প্রদান করা হয়েছে এবং টিসি রেজিস্টার আর্কাইভে স্থানান্তর করা হয়েছে।`);
    } else {
      // Permanent Delete
      const updatedActive = students.filter(s => s.id !== studentToProcess.id);
      setStudents(updatedActive);
      try {
        localStorage.setItem('school_students', JSON.stringify(updatedActive));
      } catch {}

      showFeedback(`শিক্ষার্থী "${studentToProcess.name}"-এর রেকর্ড ডেটাবেস থেকে স্থায়ীভাবে মুছে ফেলা হয়েছে।`);
    }

    setShowTcModal(false);
    setTargetStudentForTc(null);
  };

  // Restore TC student back to active list
  const handleRestoreFromTc = (student: Student) => {
    if (confirm(`আপনি কি "${student.name}"-কে পুনরায় সক্রিয় শিক্ষার্থী তালিকায় ফিরিয়ে আনতে চান?`)) {
      const restoredStudent: Student = {
        ...student,
        tcIssued: false,
        tcDate: undefined,
        tcReason: undefined
      };

      const updatedActive = [restoredStudent, ...students];
      const updatedArchive = tcArchive.filter(s => s.id !== student.id);

      setStudents(updatedActive);
      setTcArchive(updatedArchive);

      try {
        localStorage.setItem('school_students', JSON.stringify(updatedActive));
        localStorage.setItem('school_tc_students', JSON.stringify(updatedArchive));
      } catch {}

      showFeedback(`"${student.name}"-কে পুনরায় সক্রিয় শিক্ষার্থী তালিকায় পুনর্বহাল করা হয়েছে।`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner and Actions */}
      <div className="bg-white p-6 rounded-2xl border border-[#d9e6e7] shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-[#0c3664] text-white px-2.5 py-0.5 rounded-full font-bold">
                শিক্ষার্থী ব্যবস্থাপনা
              </span>
              <span className="text-xs text-slate-500">
                ইআইআইএন: ১০৪০৬২ · নাপোড়া, বাঁশখালী
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 mt-1">
              {viewMode === 'active'
                ? 'শিক্ষার্থী তথ্য ডিরেক্টরি (শ্রেণি ৬ষ্ঠ থেকে ১০ম)'
                : 'টিসি (Transfer Certificate) গ্রহণকারী শিক্ষার্থী রেজিস্টার'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {viewMode === 'active'
                ? 'শাখা এ, বি, সি, ডি এবং রোলভিত্তিক শিক্ষার্থীদের পূর্ণাঙ্গ প্রোফাইল, অভিভাবক যোগাযোগ ও বর্তমান ফি অবস্থা'
                : 'বিদ্যালয় হতে টিসি গ্রহণ করে প্রস্থানকারী শিক্ষার্থীদের তালিকা ও কারণসমূহ'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* View Mode Switcher - only for admin */}
            {isAdmin ? (
              <div className="flex items-center bg-[#f0f6f6] p-1 rounded-xl border border-[#d2e5e7] text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setViewMode('active')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    viewMode === 'active'
                      ? 'bg-[#0c3664] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  সক্রিয় শিক্ষার্থী ({students.length})
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('tc_archive')}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                    viewMode === 'tc_archive'
                      ? 'bg-rose-700 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <UserMinus className="w-3.5 h-3.5" />
                  <span>টিসি রেজিস্টার ({tcArchive.length})</span>
                </button>
              </div>
            ) : (
              <div className="px-3 py-1.5 bg-blue-50 text-[#0c3664] border border-blue-200 rounded-xl text-xs font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>মোট নিবন্ধিত শিক্ষার্থী: {students.length} জন</span>
              </div>
            )}

            {/* Exam Marks Entry Button (ADMIN ONLY) */}
            {isAdmin && (
              <button
                type="button"
                onClick={() => {
                  setMarksEntryStudentId(undefined);
                  setShowMarksEntryModal(true);
                }}
                className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-extrabold rounded-xl text-xs flex items-center gap-1.5 shadow-xs hover:shadow-md transition-all border border-emerald-400/50"
                title="ছাত্র/ছাত্রীদের পরীক্ষায় প্রাপ্ত নম্বর ইনপুট ও রেজাল্ট এন্ট্রি করুন"
              >
                <Award className="w-4 h-4 text-amber-300" />
                <span>📝 নম্বর এন্ট্রি (Marks Entry)</span>
              </button>
            )}

            {/* Class Tabulation Sheet Button (ADMIN ONLY) */}
            {isAdmin && (
              <button
                type="button"
                onClick={() => setShowTabulationModal(true)}
                className="px-4 py-2 bg-[#0c3664] hover:bg-[#092b50] text-amber-200 hover:text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-all border border-amber-400/40"
                title="পুরো ক্লাসের সকল শিক্ষার্থীর রোল অনুযায়ী সার্বিক টেবুলেশন শীট ও রেজাল্ট গেজেট দেখুন"
              >
                <FileSpreadsheet className="w-4 h-4 text-amber-400" />
                <span>📊 ক্লাসের টেবুলেশন শীট</span>
              </button>
            )}

            {/* Print Register Button */}
            <button
              type="button"
              onClick={() => setShowRegisterPrintModal(true)}
              className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-2xs transition-colors"
              title="নির্বাচিত শ্রেণির অফিশিয়াল শিক্ষার্থী তথ্য ও হাজিরা রেজিস্টার শিট প্রিন্ট করুন"
            >
              <Printer className="w-3.5 h-3.5 text-[#0c3664]" />
              <span>রেজিস্টার প্রিন্ট</span>
            </button>

            {/* ADD STUDENT BUTTON (ADMIN ONLY) */}
            {isAdmin && (
              <button
                type="button"
                onClick={handleOpenAddModal}
                className="px-4 py-2 bg-[#d9482b] hover:bg-[#b8381e] text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-xs hover:shadow-md transition-all"
                title="নতুন শিক্ষার্থী ভর্তি বা তথ্য এন্ট্রি করুন"
              >
                <UserPlus className="w-4 h-4 text-white" />
                <span>+ নতুন শিক্ষার্থী ভর্তি / যোগ করুন</span>
              </button>
            )}
          </div>
        </div>

        {/* Action Feedback Banner */}
        {actionFeedback && (
          <div className="p-3 bg-emerald-50 text-emerald-950 border border-emerald-200 rounded-xl text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{actionFeedback}</span>
          </div>
        )}

        {/* Filter Console: Class, Section, Group Dropdowns & Search */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            {/* Dropdown 1: শ্রেণি নির্বাচন (Class Selector) */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#0c3664]"></span>
                <span>শ্রেণি নির্বাচন (Class):</span>
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900 font-bold focus:outline-none focus:border-[#0c3664]"
              >
                <option value="all">সকল শ্রেণি (৬ষ্ঠ - ১০ম)</option>
                <option value="6">৬ষ্ঠ শ্রেণি</option>
                <option value="7">৭ম শ্রেণি</option>
                <option value="8">৮ম শ্রেণি</option>
                <option value="9">৯ম শ্রেণি</option>
                <option value="10">১০ম শ্রেণি</option>
              </select>
            </div>

            {/* Dropdown 2: শাখা নির্বাচন (Section Selector) */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                <span>শাখা নির্বাচন (Section):</span>
              </label>
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900 font-bold focus:outline-none focus:border-emerald-600"
              >
                <option value="all">সকল শাখা (শাখা এ, বি, সি, ডি)</option>
                <option value="A">শাখা - 'এ' (Section A)</option>
                <option value="B">শাখা - 'বি' (Section B)</option>
                <option value="C">শাখা - 'সি' (Section C)</option>
                <option value="D">শাখা - 'ডি' (Section D)</option>
              </select>
            </div>

            {/* Dropdown 3: বিভাগ নির্বাচন (Group / Department for Class 9 & 10) */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <span>বিভাগ (৯ম ও ১০ম শ্রেণি):</span>
                </span>
                {(selectedClass === '9' || selectedClass === '10') && (
                  <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-bold">
                    সক্রিয়
                  </span>
                )}
              </label>
              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className={`w-full px-3 py-2 rounded-xl text-slate-900 font-bold border focus:outline-none ${
                  selectedClass === '9' || selectedClass === '10'
                    ? 'bg-amber-50/60 border-amber-300 text-amber-950 focus:border-amber-500'
                    : 'bg-[#f0f6f6] border-[#d2e5e7] focus:border-[#0c3664]'
                }`}
              >
                <option value="all">সকল বিভাগ (বিজ্ঞান, মানবিক, ব্যবসায়)</option>
                <option value="science">🧪 বিজ্ঞান বিভাগ (Science Group)</option>
                <option value="humanities">📚 মানবিক বিভাগ (Humanities Group)</option>
                <option value="business">💼 ব্যবসায় শিক্ষা বিভাগ (Business Studies)</option>
              </select>
            </div>

            {/* Search Box */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">দ্রুত অনুসন্ধান (Search):</label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="নাম, রোল, আইডি বা বিভাগ..."
                  className="w-full pl-9 pr-8 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-xs focus:outline-none focus:border-[#0c3664] text-slate-800 font-medium"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Quick-Click Toggles for Class & Section */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-slate-500 font-semibold mr-1">শ্রেণি শর্টকাট:</span>
              {['all', '6', '7', '8', '9', '10'].map(cls => (
                <button
                  key={cls}
                  type="button"
                  onClick={() => setSelectedClass(cls)}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all text-[11px] ${
                    selectedClass === cls
                      ? 'bg-[#0c3664] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {cls === 'all' ? 'সব শ্রেণি' : formatClassOrdinal(cls)}
                </button>
              ))}

              <span className="text-slate-300 mx-1">|</span>

              <span className="text-slate-500 font-semibold mr-1">শাখা:</span>
              {['all', 'A', 'B', 'C', 'D'].map(sec => (
                <button
                  key={sec}
                  type="button"
                  onClick={() => setSelectedSection(sec)}
                  className={`px-2 py-1 rounded-lg font-bold transition-all text-[11px] ${
                    selectedSection === sec
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {sec === 'all' ? 'সকল শাখা' : `শাখা '${sec === 'A' ? 'এ' : sec === 'B' ? 'বি' : sec === 'C' ? 'সি' : 'ডি'}' (${sec})`}
                </button>
              ))}
            </div>

            {(selectedClass !== 'all' || selectedSection !== 'all' || selectedGroup !== 'all' || searchQuery) && (
              <button
                type="button"
                onClick={() => {
                  setSelectedClass('all');
                  setSelectedSection('all');
                  setSelectedGroup('all');
                  setSearchQuery('');
                }}
                className="text-[11px] font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1 underline"
              >
                <RotateCcw className="w-3 h-3" />
                <span>ফিল্টার ক্লিয়ার করুন</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* DYNAMIC CLASS & SECTION HEADING BANNER */}
      <div className="bg-gradient-to-r from-[#0c3664] via-[#103e73] to-[#164b8a] text-white rounded-2xl p-4 md:p-5 shadow-sm border border-[#23589b] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] uppercase font-extrabold tracking-wider bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-md shadow-2xs">
              শ্রেণি ও শাখা হেডিং
            </span>
            {selectedClass !== 'all' && (
              <span className="text-xs font-bold bg-white/20 px-2.5 py-0.5 rounded-md text-amber-200">
                {formatClassBangla(selectedClass)}
              </span>
            )}
            {selectedSection !== 'all' && (
              <span className="text-xs font-bold bg-white/20 px-2.5 py-0.5 rounded-md text-emerald-300">
                শাখা- '{selectedSection}'
              </span>
            )}
            {selectedGroup !== 'all' && (
              <span className="text-xs font-bold bg-white/20 px-2.5 py-0.5 rounded-md text-sky-300">
                {formatGroupBangla(selectedGroup)}
              </span>
            )}
          </div>

          <h2 className="text-xl md:text-2xl font-black tracking-tight text-white flex flex-wrap items-center gap-2">
            <span>
              {selectedClass === 'all'
                ? 'বিদ্যালয়ের সকল শ্রেণির শিক্ষার্থীর সামগ্রিক তালিকা'
                : `${formatClassBangla(selectedClass)}`}
            </span>
            {selectedSection !== 'all' ? (
              <span className="text-amber-300 font-extrabold">
                · শাখা- '{selectedSection}'
              </span>
            ) : selectedClass !== 'all' ? (
              <span className="text-slate-300 text-base font-normal">
                (শাখা: এ, বি, সি, ডি)
              </span>
            ) : null}
            {(selectedClass === '9' || selectedClass === '10') && (
              <span className="text-sky-300 text-base md:text-lg font-bold">
                {selectedGroup === 'all'
                  ? '— [বিজ্ঞান, মানবিক ও ব্যবসায় শিক্ষা বিভাগ]'
                  : `— [${formatGroupBangla(selectedGroup)}]`}
              </span>
            )}
          </h2>

          <p className="text-xs text-slate-200 leading-relaxed max-w-3xl">
            {selectedClass === '9' || selectedClass === '10' ? (
              <span>
                নবম ও দশম শ্রেণিতে <strong>বিজ্ঞান, মানবিক ও ব্যবসায় শিক্ষা</strong> এই ৩টি আলাদা বিভাগ রয়েছে। প্রতিটি শিক্ষার্থীর কার্ডে বিভাগ স্পষ্টভাবে হাইলাইট করা আছে।
              </span>
            ) : selectedClass !== 'all' ? (
              <span>
                {formatClassBangla(selectedClass)} এর শাখাভিত্তিক ছাত্র-ছাত্রীর রোল নম্বর, অভিভাবকের মোবাইল, ফি স্ট্যাটাস ও অফিশিয়াল পরীক্ষার মার্কশিট রেকর্ড।
              </span>
            ) : (
              <span>
                ৬ষ্ঠ থেকে ১০ম শ্রেণির সকল শিক্ষার্থী তালিকা। ওপরের ড্রপডাউন থেকে যেকোনো নির্দিষ্ট শ্রেণি, শাখা বা বিভাগ সিলেক্ট করুন।
              </span>
            )}
          </p>
        </div>

        {/* Counter Statistics */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <div className="bg-white/10 backdrop-blur-xs px-3.5 py-2 rounded-xl border border-white/20 text-center min-w-[90px]">
            <div className="text-[10px] text-slate-300 font-medium">মোট শিক্ষার্থী</div>
            <div className="text-lg font-black font-mono text-amber-300">{filteredStudents.length} জন</div>
          </div>
          <div className="bg-white/10 backdrop-blur-xs px-3.5 py-2 rounded-xl border border-white/20 text-center min-w-[110px]">
            <div className="text-[10px] text-slate-300 font-medium">ছাত্র / ছাত্রী</div>
            <div className="text-xs font-bold font-mono text-white mt-0.5">
              {filteredStudents.filter(s => s.gender === 'male').length} ছাত্র · {filteredStudents.filter(s => s.gender === 'female').length} ছাত্রী
            </div>
          </div>
        </div>
      </div>

      {/* STUDENT CARDS GRID */}
      {filteredStudents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStudents.map(student => (
            <div
              key={student.id}
              className={`bg-white border rounded-2xl p-5 shadow-xs space-y-3.5 transition-all flex flex-col justify-between ${
                student.tcIssued
                  ? 'border-rose-200 bg-rose-50/20'
                  : 'border-[#d9e6e7] hover:border-[#0c3664]'
              }`}
            >
              <div className="space-y-3">
                {/* Header: Name, Class, Roll and Top Action Icons */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-base font-bold text-slate-900 leading-snug flex items-center gap-2 flex-wrap">
                      <span>{student.name}</span>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold ${
                        student.gender === 'female'
                          ? 'bg-fuchsia-100 text-fuchsia-800 border border-fuchsia-300'
                          : 'bg-blue-100 text-blue-800 border border-blue-300'
                      }`}>
                        {student.gender === 'female' ? '👧 ছাত্রী' : '👦 ছাত্র'}
                      </span>
                    </div>

                    {/* Department (বিভাগ) Badge for Class 9 & 10 */}
                    {(student.className === '9' || student.className === '10') && (
                      <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                        {student.group === 'science' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-extrabold bg-blue-100 text-blue-900 border border-blue-300 shadow-2xs">
                            🧪 বিজ্ঞান বিভাগ
                          </span>
                        )}
                        {student.group === 'humanities' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs">
                            📚 মানবিক বিভাগ
                          </span>
                        )}
                        {student.group === 'business' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-extrabold bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-2xs">
                            💼 ব্যবসায় শিক্ষা বিভাগ
                          </span>
                        )}
                      </div>
                    )}

                    <div className="text-xs text-slate-600 mt-1">
                      শ্রেণি: <strong className="text-slate-900">{formatClassBangla(student.className)}</strong> · শাখা: <strong className="text-slate-900">{student.section}</strong> · রোল: <strong className="text-slate-900 font-mono">#{student.roll}</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {isAdmin ? (
                      <>
                        {student.tcIssued ? (
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-300">
                            টিসি নিয়ে প্রস্থান
                          </span>
                        ) : (
                          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                            student.status === 'paid'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}>
                            {student.status === 'paid' ? 'ফি পরিশোধিত' : 'ফি বকেয়া'}
                          </span>
                        )}

                        {/* EDIT BUTTON (DIRECT ON CARD - ADMIN ONLY) */}
                        {!student.tcIssued && (
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(student)}
                            className="p-1.5 bg-blue-50 hover:bg-blue-100 text-[#0c3664] rounded-lg border border-blue-200 transition-colors ml-1"
                            title="শিক্ষার্থীর তথ্য এডিট বা সংশোধন করুন"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* TC / DELETE BUTTON (DIRECT ON CARD - ADMIN ONLY) */}
                        {!student.tcIssued ? (
                          <button
                            type="button"
                            onClick={() => handleOpenTc(student)}
                            className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg border border-rose-200 transition-colors"
                            title="টিসি নিয়ে চলে গেলে বা শিক্ষার্থী ডিলেট করুন"
                          >
                            <UserMinus className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleRestoreFromTc(student)}
                            className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg border border-emerald-300 transition-colors"
                            title="পুনরায় সক্রিয় তালিকায় ফিরিয়ে আনুন"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </>
                    ) : (
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                        শিক্ষার্থী পরিচিতি
                      </span>
                    )}
                  </div>
                </div>

                {/* Details Table */}
                <div className="border-t border-slate-100 pt-2 space-y-1.5 text-xs text-slate-600">
                  {/* Explicit Group / Department Row */}
                  {(student.className === '9' || student.className === '10') ? (
                    <div className="flex justify-between items-center bg-blue-50/60 px-2 py-1.5 rounded-lg border border-blue-100">
                      <span className="text-[#0c3664] font-bold text-[11px]">বিভাগ (Group):</span>
                      <span className="font-extrabold text-slate-900 text-xs">
                        {formatGroupBangla(student.group)}
                      </span>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center py-0.5 text-slate-500">
                      <span>পাঠ্যক্রম ধারা:</span>
                      <span className="text-slate-700 font-medium">সাধারণ পাঠ্যক্রম (সকল বিষয় অভিন্ন)</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-slate-400">শিক্ষার্থী ধরন / লিঙ্গ:</span>
                    <span className={`font-bold text-xs ${student.gender === 'female' ? 'text-fuchsia-700' : 'text-blue-700'}`}>
                      {student.gender === 'female' ? '👧 ছাত্রী (মেয়ে)' : '👦 ছাত্র (ছেলে)'}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-400">স্টুডেন্ট আইডি:</span>
                    <span className="font-mono font-bold text-slate-800">{student.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">অভিভাবক:</span>
                    <span className="text-slate-800 font-medium">{student.guardianName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">মোবাইল:</span>
                    <a href={`tel:${student.guardianPhone}`} className="font-mono text-[#0c3664] font-bold hover:underline">
                      {student.guardianPhone}
                    </a>
                  </div>
                  {isAdmin && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">নির্ধারিত ফি:</span>
                      <span className="font-mono font-bold text-slate-900">৳{student.monthlyFee + student.examFee}</span>
                    </div>
                  )}
                </div>

                {/* Payment Status or TC Info - Only for Admin */}
                {isAdmin ? (
                  student.tcIssued ? (
                    <div className="bg-rose-50 p-2.5 rounded-xl border border-rose-200 text-xs text-rose-900 space-y-1">
                      <div className="font-bold flex items-center justify-between">
                        <span>টিসি ইস্যুর তারিখ: {student.tcDate}</span>
                      </div>
                      <div className="text-[11px] text-rose-800">
                        কারণ: {student.tcReason || 'অন্য বিদ্যালয়ে স্থানান্তর'}
                      </div>
                    </div>
                  ) : student.status === 'paid' ? (
                    <div className="bg-[#f0f6f6] p-2.5 rounded-xl border border-[#d2e5e7] text-[11px] text-slate-600 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#0c3664]">{student.paidBank}</span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-full border border-emerald-300">
                          {student.paidMonth || 'অক্টোবর ২০২৬'} (পরিশোধিত)
                        </span>
                      </div>
                      <div className="font-mono text-[10px] text-slate-400">Txn: {student.txnId} · {student.paymentDate}</div>
                    </div>
                  ) : (
                    <div className="bg-rose-50/70 p-2.5 rounded-xl border border-rose-200 text-[11px] text-rose-800 flex items-center justify-between">
                      <span className="font-medium">বকেয়া বেতনের মাস:</span>
                      <span className="text-[10px] bg-rose-100 text-rose-900 font-extrabold px-2 py-0.5 rounded-full border border-rose-300">
                        {student.dueMonth || 'অক্টোবর ২০২৬'}
                      </span>
                    </div>
                  )
                ) : (
                  <div className="bg-slate-50/80 p-2 rounded-xl border border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-medium text-slate-600">
                      <Lock className="w-3.5 h-3.5 text-amber-500" />
                      <span>ফি ও পরীক্ষার বিবরণী</span>
                    </span>
                    <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded border border-amber-300">
                      এডমিন সংরক্ষিত
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons: Message / Slip / Marks / Marksheet - ONLY FOR ADMIN */}
              {isAdmin ? (
                <div className="pt-2.5 border-t border-slate-100 space-y-2">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => onOpenDispatch(student)}
                    className="py-2 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                    title="অভিভাবকের মোবাইলে WhatsApp বা SMS বার্তা পাঠান"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>মেসেজ পাঠান</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onOpenSlip(student)}
                    className="py-2 px-2.5 bg-[#0c3664] hover:bg-[#092b50] text-white font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                    title="অফিসিয়াল ফি রসিদ ও স্লিপ প্রিন্ট করুন"
                  >
                    <Printer className="w-3.5 h-3.5 text-amber-300" />
                    <span>রসিদ স্লিপ</span>
                  </button>
                </div>

                {/* Exam Marks Entry & A4 Marksheet Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMarksEntryStudentId(student.id);
                      setShowMarksEntryModal(true);
                    }}
                    className="py-2 px-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs"
                    title="এই শিক্ষার্থীর পরীক্ষার নম্বর ইনপুট ও এডিট করুন"
                  >
                    <Pencil className="w-3.5 h-3.5 text-amber-300" />
                    <span>📝 নম্বর এন্ট্রি</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedStudentForMarksheet(student);
                      setShowMarksheetModal(true);
                    }}
                    className="py-2 px-2.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-extrabold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs"
                    title="এই শিক্ষার্থীর অফিশিয়াল A4 নম্বর ফর্দ ও মার্কশিট প্রিন্ট করুন"
                  >
                    <Award className="w-3.5 h-3.5 text-slate-950" />
                    <span>📄 A4 মার্কশিট</span>
                  </button>
                </div>

                {/* Direct Edit & TC Buttons on Card Bottom */}
                <div className="flex items-center justify-between gap-2 text-xs pt-1">
                  {!student.tcIssued ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(student)}
                        className="flex-1 py-1.5 px-2 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-[#0c3664] font-semibold rounded-lg flex items-center justify-center gap-1 border border-slate-200 transition-colors"
                      >
                        <Pencil className="w-3 h-3 text-[#0c3664]" />
                        <span>তথ্য এডিট</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenTc(student)}
                        className="flex-1 py-1.5 px-2 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 font-semibold rounded-lg flex items-center justify-center gap-1 border border-slate-200 transition-colors"
                      >
                        <UserMinus className="w-3 h-3 text-rose-600" />
                        <span>টিসি / ডিলেট</span>
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleRestoreFromTc(student)}
                      className="w-full py-1.5 px-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-lg flex items-center justify-center gap-1 border border-emerald-300 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>পুনরায় সক্রিয় তালিকায় আনুন</span>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>শিক্ষার্থী পরিচিতি ডিরেক্টরি</span>
                <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                  নিয়মিত শিক্ষার্থী
                </span>
              </div>
            )}
          </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-12 rounded-3xl border border-[#d9e6e7] text-center space-y-3">
          <FileText className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-700">
            {viewMode === 'active' ? 'কোনো শিক্ষার্থী পাওয়া যায়নি' : 'টিসি রেজিস্টারে কোনো শিক্ষার্থী নেই'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {viewMode === 'active'
              ? 'আপনার অনুসন্ধানের সাথে মিলে এমন কোনো শিক্ষার্থী নেই অথবা নতুন শিক্ষার্থী ভর্তি করতে পারেন।'
              : 'বিদ্যালয় থেকে কোনো শিক্ষার্থী এখনও টিসি নিয়ে চলে যায়নি।'}
          </p>
          {viewMode === 'active' && (
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="px-4 py-2 bg-[#d9482b] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 mx-auto shadow-xs"
            >
              <UserPlus className="w-4 h-4" />
              <span>নতুন শিক্ষার্থী যোগ করুন</span>
            </button>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 1: নতুন শিক্ষার্থী ভর্তি / যোগ করুন (ADD STUDENT) */}
      {/* ========================================================= */}
      {showAddModal && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowAddModal(false);
          }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 md:p-8 shadow-2xl border border-slate-200 space-y-5 relative my-8 animate-in fade-in zoom-in-95 duration-150">
            {/* Top Back & Close Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors border border-slate-200"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-slate-600" />
                <span>← ব্যাকে যান (Back)</span>
              </button>

              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-1 text-xs"
                title="উইন্ডো বন্ধ করুন"
              >
                <X className="w-4 h-4" />
                <span>বন্ধ (Close)</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-rose-50 text-[#d9482b] rounded-2xl flex items-center justify-center shrink-0">
                <UserPlus className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">নতুন শিক্ষার্থী ভর্তি ও তথ্য অন্তর্ভুক্তি</h3>
                <p className="text-xs text-slate-500">নাপোড়া শেখেরখীল উচ্চ বিদ্যালয় শিক্ষার্থী রেজিস্টার</p>
              </div>
            </div>

            <form onSubmit={handleAddStudentSubmit} className="space-y-4 text-xs">
              {/* Inline Error Alert Banner inside Modal */}
              {addModalError && (
                <div className="p-3.5 bg-rose-50 border-2 border-rose-400 rounded-2xl text-rose-950 text-xs flex items-start gap-2.5 shadow-sm animate-in fade-in">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div className="space-y-2 flex-1">
                    <div className="font-extrabold leading-relaxed text-rose-900">{addModalError}</div>
                    {existingStudentWithRoll && (
                      <button
                        type="button"
                        onClick={() => {
                          setNewStudentRoll(getNextAvailableRoll(newStudentClass, newStudentSection));
                          setAddModalError(null);
                        }}
                        className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-xs transition-colors flex items-center gap-1.5"
                      >
                        <span>✓ পরবর্তী খালি রোল ({getNextAvailableRoll(newStudentClass, newStudentSection)}) ব্যবহার করুন</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="sm:col-span-2">
                  <label className="font-semibold text-slate-700 block mb-1">শিক্ষার্থীর পূর্ণ নাম *</label>
                  <input
                    type="text"
                    required
                    value={newStudentName}
                    onChange={(e) => {
                      setNewStudentName(e.target.value);
                      if (addModalError) setAddModalError(null);
                    }}
                    placeholder="যেমন: মোহাম্মদ তাজুল ইসলাম / তানভীর আহমেদ"
                    className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900 font-bold focus:outline-none focus:border-[#0c3664]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">শ্রেণি *</label>
                  <select
                    value={newStudentClass}
                    onChange={(e) => {
                      const cls = e.target.value as any;
                      setNewStudentClass(cls);
                      setNewStudentRoll(getNextAvailableRoll(cls, newStudentSection));
                      setAddModalError(null);
                    }}
                    className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900 font-bold"
                  >
                    <option value="6">৬ষ্ঠ শ্রেণি</option>
                    <option value="7">৭ম শ্রেণি</option>
                    <option value="8">৮ম শ্রেণি</option>
                    <option value="9">৯ম শ্রেণি</option>
                    <option value="10">১০ম শ্রেণি</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">শাখা (Section) *</label>
                  <select
                    value={newStudentSection}
                    onChange={(e) => {
                      const sec = e.target.value as any;
                      setNewStudentSection(sec);
                      setNewStudentRoll(getNextAvailableRoll(newStudentClass, sec));
                      setAddModalError(null);
                    }}
                    className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900 font-bold"
                  >
                    <option value="A">শাখা A</option>
                    <option value="B">শাখা B</option>
                    <option value="C">শাখা C</option>
                    <option value="D">শাখা D</option>
                  </select>
                </div>

                {/* বিভাগ নির্বাচন (Class 9 & 10) */}
                {(newStudentClass === '9' || newStudentClass === '10') && (
                  <div className="sm:col-span-2 bg-amber-50/70 p-3 rounded-2xl border-2 border-amber-300 space-y-1">
                    <label className="font-extrabold text-amber-950 block">
                      বিভাগ নির্বাচন (Group - ৯ম ও ১০ম শ্রেণি) *
                    </label>
                    <select
                      value={newStudentGroup}
                      onChange={(e) => setNewStudentGroup(e.target.value as StudentGroup)}
                      className="w-full px-3 py-2 bg-white border border-amber-300 rounded-xl text-slate-900 font-bold focus:outline-none focus:border-amber-500"
                    >
                      <option value="science">🧪 বিজ্ঞান বিভাগ (Science Group)</option>
                      <option value="humanities">📚 মানবিক বিভাগ (Humanities Group)</option>
                      <option value="business">💼 ব্যবসায় শিক্ষা বিভাগ (Business Studies)</option>
                    </select>
                    <p className="text-[11px] text-amber-800">
                      বিভাগ অনুযায়ী বিষয় ও ফলাফল স্বয়ংক্রিয়ভাবে নির্ধারিত হবে।
                    </p>
                  </div>
                )}

                {/* রোল নম্বর ইনপুট ও লাইভ ডুপ্লিকেট চেকার */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold text-slate-700">রোল নম্বর *</label>
                    {existingStudentWithRoll && (
                      <span className="text-[11px] font-bold text-rose-600">
                        ⚠️ রোল ইতিমধ্যে বিদ্যমান
                      </span>
                    )}
                  </div>
                  <input
                    type="number"
                    min="1"
                    max="300"
                    required
                    value={newStudentRoll}
                    onChange={(e) => {
                      setNewStudentRoll(e.target.value === '' ? '' : Number(e.target.value));
                      if (addModalError) setAddModalError(null);
                    }}
                    placeholder="যেমন: ১"
                    className={`w-full px-3 py-2 border rounded-xl font-mono font-bold ${
                      existingStudentWithRoll
                        ? 'bg-rose-50 border-rose-300 text-rose-900 focus:border-rose-500'
                        : 'bg-[#f0f6f6] border-[#d2e5e7] text-slate-900'
                    }`}
                  />
                  {existingStudentWithRoll && (
                    <div className="mt-1.5 p-2 bg-rose-50 border border-rose-200 rounded-xl text-[11px] text-rose-900 flex items-center justify-between gap-1.5">
                      <span>এই রোলটি <strong>{existingStudentWithRoll.name}</strong>-এর নামে আছে।</span>
                      <button
                        type="button"
                        onClick={() => {
                          setNewStudentRoll(getNextAvailableRoll(newStudentClass, newStudentSection));
                          setAddModalError(null);
                        }}
                        className="px-2 py-0.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded text-[10px] shrink-0"
                      >
                        খালি রোল {getNextAvailableRoll(newStudentClass, newStudentSection)} দিন
                      </button>
                    </div>
                  )}
                </div>

                {/* লিঙ্গ (Gender) */}
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">লিঙ্গ (Gender) *</label>
                  <select
                    value={newStudentGender}
                    onChange={(e) => setNewStudentGender(e.target.value as StudentGender)}
                    className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900 font-semibold"
                  >
                    <option value="male">ছাত্র (ছেলে)</option>
                    <option value="female">ছাত্রী (মেয়ে)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">প্রাথমিক ফি স্ট্যাটাস:</label>
                  <select
                    value={newStudentStatus}
                    onChange={(e) => setNewStudentStatus(e.target.value as any)}
                    className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900 font-semibold"
                  >
                    <option value="due">বকেয়া (Due)</option>
                    <option value="paid">পরিশোধিত (Paid)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">অভিভাবকের নাম:</label>
                  <input
                    type="text"
                    value={newStudentGuardian}
                    onChange={(e) => setNewStudentGuardian(e.target.value)}
                    placeholder="পিতা / মাতার নাম"
                    className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">অভিভাবকের মোবাইল নম্বর:</label>
                  <input
                    type="tel"
                    value={newStudentPhone}
                    onChange={(e) => setNewStudentPhone(e.target.value)}
                    placeholder="০১৭XX-XXXXXX"
                    className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">মাসিক বেতন (টাকা):</label>
                  <input
                    type="number"
                    value={newStudentMonthlyFee}
                    onChange={(e) => setNewStudentMonthlyFee(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">পরীক্ষার ফি (টাকা):</label>
                  <input
                    type="number"
                    value={newStudentExamFee}
                    onChange={(e) => setNewStudentExamFee(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl flex items-center justify-between text-xs text-blue-950">
                <span>স্বয়ংক্রিয় স্টুডেন্ট আইডি:</span>
                <span className="font-mono font-bold bg-white px-2 py-0.5 rounded border border-blue-200">
                  STU-{newStudentClass}{newStudentSection}-{String(newStudentRoll || 0).padStart(3, '0')}
                </span>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 font-semibold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  onClick={(e) => handleAddStudentSubmit(e)}
                  className="px-6 py-2.5 bg-[#d9482b] hover:bg-[#b8381e] text-white font-extrabold rounded-xl shadow-xs hover:shadow-md flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4 text-white" />
                  <span>শিক্ষার্থী সংরক্ষণ করুন</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: শিক্ষার্থী তথ্য এডিট ও সংশোধন (EDIT STUDENT) */}
      {/* ========================================================= */}
      {showEditModal && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowEditModal(false);
          }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 md:p-8 shadow-2xl border border-slate-200 space-y-5 relative my-8 animate-in fade-in zoom-in-95 duration-150">
            {/* Top Back & Close Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors border border-slate-200"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-slate-600" />
                <span>← ব্যাকে যান (Back)</span>
              </button>

              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-1 text-xs"
                title="উইন্ডো বন্ধ করুন"
              >
                <X className="w-4 h-4" />
                <span>বন্ধ (Close)</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-blue-50 text-[#0c3664] rounded-2xl flex items-center justify-center shrink-0">
                <Pencil className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">শিক্ষার্থী তথ্য সম্পাদনা ও সংশোধন</h3>
                <p className="text-xs text-slate-500 font-mono text-[#0c3664]">আইডি: {editingStudentId}</p>
              </div>
            </div>

            <form onSubmit={handleSaveEditSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="sm:col-span-2">
                  <label className="font-semibold text-slate-700 block mb-1">শিক্ষার্থীর পূর্ণ নাম *</label>
                  <input
                    type="text"
                    required
                    value={editStudentName}
                    onChange={(e) => setEditStudentName(e.target.value)}
                    className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900 font-bold focus:outline-none focus:border-[#0c3664]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">শ্রেণি *</label>
                  <select
                    value={editStudentClass}
                    onChange={(e) => setEditStudentClass(e.target.value as any)}
                    className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900 font-semibold"
                  >
                    <option value="6">৬ষ্ঠ শ্রেণি</option>
                    <option value="7">৭ম শ্রেণি</option>
                    <option value="8">৮ম শ্রেণি</option>
                    <option value="9">৯ম শ্রেণি</option>
                    <option value="10">১০ম শ্রেণি</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">শাখা (Section) *</label>
                  <select
                    value={editStudentSection}
                    onChange={(e) => setEditStudentSection(e.target.value as any)}
                    className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900 font-semibold"
                  >
                    <option value="A">শাখা A</option>
                    <option value="B">শাখা B</option>
                    <option value="C">শাখা C</option>
                    <option value="D">শাখা D</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">রোল নম্বর *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={editStudentRoll}
                    onChange={(e) => setEditStudentRoll(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900 font-mono font-bold"
                  />
                </div>

                {/* লিঙ্গ (Gender - ছাত্র / ছাত্রী) */}
                <div>
                  <label className="font-semibold text-slate-700 block mb-1 flex items-center justify-between">
                    <span>লিঙ্গ (Gender) *</span>
                    <span className="text-[10px] text-[#0c3664] font-bold">ছাত্র / ছাত্রী নির্বাচন</span>
                  </label>
                  <select
                    value={editStudentGender}
                    onChange={(e) => setEditStudentGender(e.target.value as StudentGender)}
                    className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900 font-bold focus:outline-none focus:border-[#0c3664]"
                  >
                    <option value="male">👦 ছাত্র (ছেলে)</option>
                    <option value="female">👧 ছাত্রী (মেয়ে)</option>
                  </select>
                </div>

                {/* বিভাগ (Department / Group) - শুধুমাত্র ৯ম ও ১০ম শ্রেণির জন্য */}
                {(editStudentClass === '9' || editStudentClass === '10') && (
                  <div className="sm:col-span-2">
                    <label className="font-semibold text-slate-700 block mb-1 flex items-center justify-between">
                      <span>বিভাগ (Department / Group) *</span>
                      <span className="text-[10px] text-blue-700 font-bold">৯ম ও ১০ম শ্রেণির গ্রুপ</span>
                    </label>
                    <select
                      value={editStudentGroup}
                      onChange={(e) => setEditStudentGroup(e.target.value as StudentGroup)}
                      className="w-full px-3 py-2 bg-blue-50 border border-blue-300 rounded-xl text-blue-950 font-bold focus:outline-none focus:border-[#0c3664]"
                    >
                      <option value="science">🧪 বিজ্ঞান বিভাগ (Science)</option>
                      <option value="humanities">📚 মানবিক বিভাগ (Humanities)</option>
                      <option value="business">💼 ব্যবসায় শিক্ষা বিভাগ (Business Studies)</option>
                    </select>
                  </div>
                )}

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">ফি স্ট্যাটাস:</label>
                  <select
                    value={editStudentStatus}
                    onChange={(e) => setEditStudentStatus(e.target.value as any)}
                    className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900 font-bold"
                  >
                    <option value="paid">পরিশোধিত (Paid)</option>
                    <option value="due">বকেয়া (Due)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">অভিভাবকের নাম:</label>
                  <input
                    type="text"
                    value={editStudentGuardian}
                    onChange={(e) => setEditStudentGuardian(e.target.value)}
                    className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900 font-medium"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">অভিভাবকের মোবাইল:</label>
                  <input
                    type="tel"
                    value={editStudentPhone}
                    onChange={(e) => setEditStudentPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">মাসিক বেতন (টাকা):</label>
                  <input
                    type="number"
                    value={editStudentMonthlyFee}
                    onChange={(e) => setEditStudentMonthlyFee(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">পরীক্ষার ফি (টাকা):</label>
                  <input
                    type="number"
                    value={editStudentExamFee}
                    onChange={(e) => setEditStudentExamFee(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900 font-mono font-bold"
                  />
                </div>
              </div>

              {/* Dynamic Bank / Month Fields if Paid */}
              {editStudentStatus === 'paid' && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="font-semibold text-emerald-950 block mb-1">পরিশোধকৃত ব্যাংক:</label>
                      <select
                        value={editStudentBank}
                        onChange={(e) => setEditStudentBank(e.target.value as any)}
                        className="w-full px-2.5 py-1.5 bg-white border border-emerald-300 rounded-lg text-emerald-950 font-bold"
                      >
                        <option value="বাংলাদেশ কৃষি ব্যাংক">বাংলাদেশ কৃষি ব্যাংক (নাপোড়া বাজার)</option>
                        <option value="আইএফআইসি ব্যাংক">আইএফআইসি ব্যাংক (নাপোড়া বাজার উপশাখা)</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold text-emerald-950 block mb-1">পরিশোধের মাস:</label>
                      <input
                        type="text"
                        value={editStudentPaidMonth}
                        onChange={(e) => setEditStudentPaidMonth(e.target.value)}
                        placeholder="যেমন: অক্টোবর ২০২৬"
                        className="w-full px-2.5 py-1.5 bg-white border border-emerald-300 rounded-lg text-emerald-950 font-bold"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#0c3664] hover:bg-[#092b50] text-white font-bold rounded-xl shadow-xs flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4 text-amber-300" />
                  <span>তথ্য আপডেট ও সংরক্ষণ করুন</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: টিসি নিয়ে চলে গেলে / ডিলেট অপশন (TC / DELETE MODAL) */}
      {/* ========================================================= */}
      {showTcModal && targetStudentForTc && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowTcModal(false);
              setTargetStudentForTc(null);
            }
          }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-slate-200 space-y-5 relative my-8 animate-in fade-in zoom-in-95 duration-150">
            {/* Top Back & Close Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setShowTcModal(false);
                  setTargetStudentForTc(null);
                }}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors border border-slate-200"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-slate-600" />
                <span>← ব্যাকে যান (Back)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowTcModal(false);
                  setTargetStudentForTc(null);
                }}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-1 text-xs"
                title="উইন্ডো বন্ধ করুন"
              >
                <X className="w-4 h-4" />
                <span>বন্ধ (Close)</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl flex items-center justify-center shrink-0">
                <UserMinus className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  টিসি (Transfer Certificate) প্রদান বা শিক্ষার্থী অপসারণ
                </h3>
                <p className="text-xs text-slate-500">
                  নাপোড়া শেখেরখীল উচ্চ বিদ্যালয় থেকে প্রস্থান বা টিসি এন্ট্রি
                </p>
              </div>
            </div>

            {/* Target Student Summary */}
            <div className="p-4 bg-[#f0f6f6] border border-[#d2e5e7] rounded-2xl space-y-1.5 text-xs">
              <div className="font-bold text-sm text-slate-900 flex items-center justify-between">
                <span>{targetStudentForTc.name}</span>
                <span className="font-mono bg-white px-2 py-0.5 rounded text-slate-700 border border-slate-200">
                  {targetStudentForTc.id}
                </span>
              </div>
              <div className="text-slate-600">
                শ্রেণি: <strong>{formatClassBangla(targetStudentForTc.className)}</strong> · শাখা: <strong>{targetStudentForTc.section}</strong> · রোল: <strong className="font-mono">#{targetStudentForTc.roll}</strong>
              </div>
              <div className="text-slate-600">
                অভিভাবক: <strong>{targetStudentForTc.guardianName}</strong> ({targetStudentForTc.guardianPhone})
              </div>
            </div>

            <form onSubmit={handleExecuteTc} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">অ্যাকশন বাছাই করুন:</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <label
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-2 ${
                      tcActionType === 'tc_archive'
                        ? 'bg-rose-50/80 border-rose-300 ring-1 ring-rose-400 text-rose-950 font-bold'
                        : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="tcAction"
                      checked={tcActionType === 'tc_archive'}
                      onChange={() => setTcActionType('tc_archive')}
                      className="mt-0.5 text-rose-600"
                    />
                    <div>
                      <div>টিসি রেজিস্টার আর্কাইভে স্থানান্তর (প্রস্তাবিত)</div>
                      <div className="text-[10px] text-slate-500 font-normal mt-0.5">
                        রেকর্ড সংরক্ষিত থাকবে এবং প্রয়োজনে রিস্টোর করা যাবে।
                      </div>
                    </div>
                  </label>

                  <label
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-2 ${
                      tcActionType === 'permanent_delete'
                        ? 'bg-rose-50/80 border-rose-300 ring-1 ring-rose-400 text-rose-950 font-bold'
                        : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="tcAction"
                      checked={tcActionType === 'permanent_delete'}
                      onChange={() => setTcActionType('permanent_delete')}
                      className="mt-0.5 text-rose-600"
                    />
                    <div>
                      <div>স্থায়ীভাবে মুছে ফেলুন (Delete)</div>
                      <div className="text-[10px] text-slate-500 font-normal mt-0.5">
                        ভুল বা ডুপ্লিকেট এন্ট্রি হলে ডেটাবেস থেকে মুছে দিন।
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {tcActionType === 'tc_archive' && (
                <>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">টিসি প্রদানের তারিখ:</label>
                    <input
                      type="date"
                      required
                      value={tcDate}
                      onChange={(e) => setTcDate(e.target.value)}
                      className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900 font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">টিসি গ্রহণের কারণ:</label>
                    <select
                      value={tcReason}
                      onChange={(e) => setTcReason(e.target.value)}
                      className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900 font-medium"
                    >
                      <option value="অন্য শিক্ষাপ্রতিষ্ঠানে ভর্তি / স্থানান্তর">অন্য শিক্ষাপ্রতিষ্ঠানে ভর্তি / স্থানান্তর</option>
                      <option value="অভিভাবকের কর্মস্থল বা বাসস্থান পরিবর্তন">অভিভাবকের কর্মস্থল বা বাসস্থান পরিবর্তন</option>
                      <option value="গ্রাম / এলাকা ত্যাগ করে চট্টগ্রাম শহরে গমন">গ্রাম / এলাকা ত্যাগ করে চট্টগ্রাম শহরে গমন</option>
                      <option value="পারিবারিক ও ব্যক্তিগত কারণ">পারিবারিক ও ব্যক্তিগত কারণ</option>
                    </select>
                  </div>
                </>
              )}

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowTcModal(false);
                    setTargetStudentForTc(null);
                  }}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-rose-700 hover:bg-rose-800 text-white font-bold rounded-xl shadow-xs flex items-center gap-1.5"
                >
                  <UserMinus className="w-4 h-4 text-white" />
                  <span>
                    {tcActionType === 'tc_archive' ? 'টিসি প্রদান ও স্থানান্তর করুন' : 'স্থায়ীভাবে ডিলিট করুন'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* INDIVIDUAL A4 MARKSHEET MODAL */}
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
              marksMap,
              examType,
              selectedStudentForMarksheet.feeYear || '২০২৬'
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

            showFeedback(`"${selectedStudentForMarksheet.name}"-এর ${examType} পরীক্ষার নম্বর সফলভাবে সংরক্ষিত হয়েছে!`);
          }}
        />
      )}

      {/* CLASS-WIDE MASTER TABULATION SHEET MODAL */}
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

      {/* DEDICATED EXAM MARKS ENTRY MODAL */}
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
          onShowFeedback={showFeedback}
        />
      )}

      {/* OFFICIAL STUDENT REGISTER PRINT MODAL */}
      {showRegisterPrintModal && (
        <StudentRegisterPrintModal
          students={filteredStudents}
          isOpen={showRegisterPrintModal}
          onClose={() => setShowRegisterPrintModal(false)}
          selectedClass={selectedClass}
          selectedSection={selectedSection}
          selectedGroup={selectedGroup}
        />
      )}
    </div>
  );
}
