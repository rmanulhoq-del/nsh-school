/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  MapPin,
  RefreshCw,
  Lock,
  Printer,
  Home,
  Info,
  Award,
  Users,
  UserCheck,
  GraduationCap,
  MessageCircle,
  Globe,
  Landmark,
  ShieldCheck,
  Sparkles,
  Phone,
  Bell,
  LogOut,
  X,
  Menu,
  ChevronRight,
  UserPlus,
  Pencil,
  Save,
  Plus,
  HeartHandshake,
  ArrowLeft,
  ChevronDown,
  Eye,
  EyeOff,
  KeyRound,
  Check,
  TrendingUp,
  Image as ImageIcon,
  Sun
} from 'lucide-react';

import SchoolLogo from './components/SchoolLogo';
import HomeTab from './components/HomeTab';
import AboutTab from './components/AboutTab';
import DailyAssemblyTab from './components/DailyAssemblyTab';
import FacultyTab from './components/FacultyTab';
import StaffTab from './components/StaffTab';
import StudentsTab from './components/StudentsTab';
import AttendanceHubTab from './components/AttendanceHubTab';
import ExamsAndAdmitCardTab from './components/ExamsAndAdmitCardTab';
import SmsGatewayTab from './components/SmsGatewayTab';
import InstitutionalReportsTab from './components/InstitutionalReportsTab';
import AcademicExcellenceTab from './components/AcademicExcellenceTab';
import OnlineAdmissionModal from './components/OnlineAdmissionModal';
import BankDashboardTab from './components/BankDashboardTab';
import AdminDeskTab from './components/AdminDeskTab';
import AiScannerTab from './components/AiScannerTab';
import ContactTab from './components/ContactTab';
import NoticeBoardTab from './components/NoticeBoardTab';
import UrgentNoticeBar from './components/UrgentNoticeBar';
import CommitteeTab from './components/CommitteeTab';
import DonorsTab from './components/DonorsTab';
import ParentsColumnTab from './components/ParentsColumnTab';
import GalleryTab from './components/GalleryTab';
import EduLinksTab from './components/EduLinksTab';
import GuardianDispatchModal, { StudentDataForDispatch } from './components/GuardianDispatchModal';
import StudentSlipModal from './components/StudentSlipModal';
import StudentRegisterPrintModal from './components/StudentRegisterPrintModal';
import HeadmasterEditModal from './components/HeadmasterEditModal';
import PresidentEditModal from './components/PresidentEditModal';
import AdminUsersManagementModal from './components/AdminUsersManagementModal';

import {
  NavTab,
  AdminUser,
  Student,
  Teacher,
  StaffMember,
  Transaction,
  HeadmasterData,
  DEFAULT_HEADMASTER_DATA,
  PresidentData,
  DEFAULT_PRESIDENT_DATA
} from './types';
import {
  AUTHORIZED_STAFF,
  INITIAL_STUDENTS,
  INITIAL_TEACHERS,
  INITIAL_STAFF,
  INITIAL_TRANSACTIONS,
  sortTeachersByHierarchy
} from './data/initialData';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [language, setLanguage] = useState<'bn' | 'en'>('bn');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Guardian Dispatch & Slip State
  const [selectedStudentForDispatch, setSelectedStudentForDispatch] = useState<StudentDataForDispatch | null>(null);
  const [showDispatchModal, setShowDispatchModal] = useState<boolean>(false);
  const [selectedStudentForSlip, setSelectedStudentForSlip] = useState<StudentDataForDispatch | null>(null);
  const [showSlipModal, setShowSlipModal] = useState<boolean>(false);
  const [showGlobalRegisterPrint, setShowGlobalRegisterPrint] = useState<boolean>(false);

  // Online Admission Modal & SMS Prefill State
  const [showAdmissionModal, setShowAdmissionModal] = useState<boolean>(false);
  const [smsPrefillMessage, setSmsPrefillMessage] = useState<string>('');

  // Admin Users State with LocalStorage Persistence
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(() => {
    try {
      const saved = localStorage.getItem('nsh_admin_users');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((u: AdminUser) => ({
            ...u,
            pin: u.pin && u.pin.trim() ? u.pin.trim() : '1234'
          }));
        }
      }
    } catch {}
    return AUTHORIZED_STAFF;
  });
  const [showAdminUsersModal, setShowAdminUsersModal] = useState<boolean>(false);

  // Admin Session State (Starts as null so visitors enter in Public View)
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(() => {
    try {
      const saved = sessionStorage.getItem('nsh_admin_session');
      if (saved) return JSON.parse(saved);
    } catch {}
    return null;
  });
  const [showAdminLoginModal, setShowAdminLoginModal] = useState<boolean>(false);
  const [loginSelectedStaffId, setLoginSelectedStaffId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('nsh_admin_users');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0) return parsed[0].id;
      }
    } catch {}
    return AUTHORIZED_STAFF[0].id;
  });
  const [loginPasswordInput, setLoginPasswordInput] = useState<string>('');
  const [loginShowPassword, setLoginShowPassword] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string>('');

  const handleAdminLoginSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const targetStaff = adminUsers.find(s => s.id === loginSelectedStaffId) || adminUsers[0] || AUTHORIZED_STAFF[0];
    const expectedPin = (targetStaff.pin && targetStaff.pin.trim()) || localStorage.getItem('nsh_admin_pin') || '1234';
    const entered = loginPasswordInput.trim();

    if (!entered) {
      setLoginError('অনুগ্রহ করে এডমিন পাসওয়ার্ড বা গোপন পিন কোডটি লিখুন।');
      return;
    }

    if (entered === expectedPin) {
      setCurrentAdmin(targetStaff);
      try {
        sessionStorage.setItem('nsh_admin_session', JSON.stringify(targetStaff));
      } catch {}
      setShowAdminLoginModal(false);
      setLoginPasswordInput('');
      setLoginError('');
      setActiveTab('office');
    } else {
      setLoginError('ভুল পাসওয়ার্ড! প্রদত্ত পাসওয়ার্ডটি নির্বাচিত কর্মকর্তার পাসওয়ার্ডের সাথে মেলেনি। দয়া করে সঠিক পাসওয়ার্ড দিয়ে পুনরায় চেষ্টা করুন।');
    }
  };

  const handleAdminLogout = () => {
    setCurrentAdmin(null);
    try {
      sessionStorage.removeItem('nsh_admin_session');
    } catch {}
    if (activeTab === 'office') {
      setActiveTab('home');
    }
  };

  // Headmaster Profile & Speech State
  const [headmasterData, setHeadmasterData] = useState<HeadmasterData>(() => {
    try {
      const saved = localStorage.getItem('school_headmaster_data');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_HEADMASTER_DATA;
  });
  const [showHeadmasterEditModal, setShowHeadmasterEditModal] = useState<boolean>(false);

  // President Profile & Speech State
  const [presidentData, setPresidentData] = useState<PresidentData>(() => {
    try {
      const saved = localStorage.getItem('school_president_data');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_PRESIDENT_DATA;
  });
  const [showPresidentEditModal, setShowPresidentEditModal] = useState<boolean>(false);

  // Teacher Modals State
  const [showAddTeacherModal, setShowAddTeacherModal] = useState<boolean>(false);
  const [showEditTeacherModal, setShowEditTeacherModal] = useState<boolean>(false);
  const [newTeacherName, setNewTeacherName] = useState<string>('');
  const [newTeacherDesignation, setNewTeacherDesignation] = useState<string>('সহকারী শিক্ষক');
  const [newTeacherSubject, setNewTeacherSubject] = useState<string>('');
  const [newTeacherPhone, setNewTeacherPhone] = useState<string>('');
  const [newTeacherEmail, setNewTeacherEmail] = useState<string>('');
  const [newTeacherJoinDate, setNewTeacherJoinDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [newTeacherQualification, setNewTeacherQualification] = useState<string>('');

  const [editingTeacherId, setEditingTeacherId] = useState<string>('');
  const [editTeacherName, setEditTeacherName] = useState<string>('');
  const [editTeacherDesignation, setEditTeacherDesignation] = useState<string>('সহকারী শিক্ষক');
  const [editTeacherSubject, setEditTeacherSubject] = useState<string>('');
  const [editTeacherPhone, setEditTeacherPhone] = useState<string>('');
  const [editTeacherEmail, setEditTeacherEmail] = useState<string>('');
  const [editTeacherJoinDate, setEditTeacherJoinDate] = useState<string>('');
  const [editTeacherQualification, setEditTeacherQualification] = useState<string>('');

  // Staff Modals State
  const [showAddStaffModal, setShowAddStaffModal] = useState<boolean>(false);
  const [showEditStaffModal, setShowEditStaffModal] = useState<boolean>(false);
  const [newStaffName, setNewStaffName] = useState<string>('');
  const [newStaffDesignation, setNewStaffDesignation] = useState<string>('অফিস সহকারী');
  const [newStaffDutyScope, setNewStaffDutyScope] = useState<string>('');
  const [newStaffPhone, setNewStaffPhone] = useState<string>('');
  const [newStaffJoinDate, setNewStaffJoinDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [newStaffQualification, setNewStaffQualification] = useState<string>('');

  const [editingStaffId, setEditingStaffId] = useState<string>('');
  const [editStaffName, setEditStaffName] = useState<string>('');
  const [editStaffDesignation, setEditStaffDesignation] = useState<string>('অফিস সহকারী');
  const [editStaffDutyScope, setEditStaffDutyScope] = useState<string>('');
  const [editStaffPhone, setEditStaffPhone] = useState<string>('');
  const [editStaffJoinDate, setEditStaffJoinDate] = useState<string>('');
  const [editStaffQualification, setEditStaffQualification] = useState<string>('');

  // Data State
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('school_students');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [teachers, setTeachers] = useState<Teacher[]>(() => {
    const saved = localStorage.getItem('school_teachers');
    if (saved) {
      try {
        const parsed: Teacher[] = JSON.parse(saved);
        return sortTeachersByHierarchy(parsed);
      } catch {
        return sortTeachersByHierarchy(INITIAL_TEACHERS);
      }
    }
    return sortTeachersByHierarchy(INITIAL_TEACHERS);
  });

  const [staffList, setStaffList] = useState<StaffMember[]>(() => {
    const saved = localStorage.getItem('school_staff');
    return saved ? JSON.parse(saved) : INITIAL_STAFF;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);

  // Statistics
  const totalStudents = students.length;
  const paidStudents = students.filter(s => s.status === 'paid').length;
  const dueStudents = students.filter(s => s.status === 'due').length;
  const krishiCount = students.filter(s => s.status === 'paid' && s.paidBank === 'বাংলাদেশ কৃষি ব্যাংক').length;
  const ificCount = students.filter(s => s.status === 'paid' && s.paidBank === 'আইএফআইসি ব্যাংক').length;
  const totalCollected = students.filter(s => s.status === 'paid').reduce((acc, curr) => acc + curr.monthlyFee + curr.examFee, 0);
  const totalDueAmount = students.filter(s => s.status === 'due').reduce((acc, curr) => acc + curr.monthlyFee + curr.examFee, 0);

  const handleResetDemoData = () => {
    setStudents(INITIAL_STUDENTS);
    localStorage.setItem('school_students', JSON.stringify(INITIAL_STUDENTS));
    const sorted = sortTeachersByHierarchy(INITIAL_TEACHERS);
    setTeachers(sorted);
    localStorage.setItem('school_teachers', JSON.stringify(sorted));
    setStaffList(INITIAL_STAFF);
    localStorage.setItem('school_staff', JSON.stringify(INITIAL_STAFF));
    setHeadmasterData(DEFAULT_HEADMASTER_DATA);
    localStorage.setItem('school_headmaster_data', JSON.stringify(DEFAULT_HEADMASTER_DATA));
    setPresidentData(DEFAULT_PRESIDENT_DATA);
    localStorage.setItem('school_president_data', JSON.stringify(DEFAULT_PRESIDENT_DATA));
  };

  const handleSavePresidentData = (updated: PresidentData) => {
    setPresidentData(updated);
    try {
      localStorage.setItem('school_president_data', JSON.stringify(updated));
    } catch {}
  };

  const handleSaveHeadmasterData = (updated: HeadmasterData) => {
    setHeadmasterData(updated);
    try {
      localStorage.setItem('school_headmaster_data', JSON.stringify(updated));
    } catch {}

    // Update in teachers list
    const updatedTeachers = teachers.map(t => {
      if (t.isHeadmaster || t.id === 'TCH-001' || (t.designation.includes('প্রধান শিক্ষক') && !t.designation.includes('সহকারী'))) {
        return {
          ...t,
          name: updated.name,
          designation: updated.designation,
          phone: updated.phone,
          email: updated.email,
          qualification: updated.qualification,
          subject: updated.subject,
          joinDate: updated.joinDate
        };
      }
      return t;
    });
    const sorted = sortTeachersByHierarchy(updatedTeachers);
    setTeachers(sorted);
    try {
      localStorage.setItem('school_teachers', JSON.stringify(sorted));
    } catch {}

    // Update in currentAdmin if Headmaster
    if (currentAdmin && (currentAdmin.role === 'headmaster' || currentAdmin.id === 'ADM-01')) {
      setCurrentAdmin({
        ...currentAdmin,
        name: updated.name,
        roleName: updated.designation,
        phone: updated.phone
      });
    }
  };

  // Add Teacher Handler
  const handleAddNewTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeacherName.trim()) return;

    const nextIdNum = teachers.length + 1;
    const generatedId = `TCH-${String(nextIdNum).padStart(3, '0')}`;
    const isHead = newTeacherDesignation.includes('প্রধান শিক্ষক') && !newTeacherDesignation.includes('সহকারী');

    const newTeacher: Teacher = {
      id: generatedId,
      name: newTeacherName.trim(),
      designation: newTeacherDesignation.trim() || 'সহকারী শিক্ষক',
      subject: newTeacherSubject.trim() || 'সাধারণ পাঠদান',
      phone: newTeacherPhone.trim() || '01700-000000',
      email: newTeacherEmail.trim() || `${newTeacherName.trim().toLowerCase().replace(/[^a-z0-9]/g, '') || 'teacher'}@school.edu.bd`,
      joinDate: newTeacherJoinDate.trim() || new Date().toISOString().split('T')[0],
      qualification: newTeacherQualification.trim() || 'স্নাতক / স্নাতকোত্তর',
      isHeadmaster: isHead
    };

    const updated = sortTeachersByHierarchy([...teachers, newTeacher]);
    setTeachers(updated);
    localStorage.setItem('school_teachers', JSON.stringify(updated));

    setNewTeacherName('');
    setNewTeacherSubject('');
    setNewTeacherPhone('');
    setNewTeacherEmail('');
    setNewTeacherQualification('');
    setShowAddTeacherModal(false);
  };

  const handleOpenEditTeacher = (teacher: Teacher) => {
    setEditingTeacherId(teacher.id);
    setEditTeacherName(teacher.name);
    setEditTeacherDesignation(teacher.designation);
    setEditTeacherSubject(teacher.subject);
    setEditTeacherPhone(teacher.phone);
    setEditTeacherEmail(teacher.email);
    setEditTeacherJoinDate(teacher.joinDate);
    setEditTeacherQualification(teacher.qualification || '');
    setShowEditTeacherModal(true);
  };

  const handleUpdateTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTeacherName.trim()) return;

    const isHead = editTeacherDesignation.includes('প্রধান শিক্ষক') && !editTeacherDesignation.includes('সহকারী');

    const updated = sortTeachersByHierarchy(teachers.map(t => {
      if (t.id === editingTeacherId) {
        return {
          ...t,
          name: editTeacherName.trim(),
          designation: editTeacherDesignation.trim() || 'সহকারী শিক্ষক',
          subject: editTeacherSubject.trim() || 'সাধারণ পাঠদান',
          phone: editTeacherPhone.trim() || '01700-000000',
          email: editTeacherEmail.trim() || `${editTeacherName.trim().toLowerCase().replace(/[^a-z0-9]/g, '') || 'teacher'}@school.edu.bd`,
          joinDate: editTeacherJoinDate.trim() || t.joinDate,
          qualification: editTeacherQualification.trim() || undefined,
          isHeadmaster: isHead
        };
      }
      return t;
    }));

    setTeachers(updated);
    localStorage.setItem('school_teachers', JSON.stringify(updated));
    setShowEditTeacherModal(false);
  };

  const handleDeleteTeacher = (id: string, name: string) => {
    if (confirm(`আপনি কি নিশ্চিত যে "${name}"-কে শিক্ষক তালিকা থেকে অপসারণ করতে চান?`)) {
      const updated = sortTeachersByHierarchy(teachers.filter(t => t.id !== id));
      setTeachers(updated);
      localStorage.setItem('school_teachers', JSON.stringify(updated));
    }
  };

  // Staff Handlers
  const handleAddNewStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName.trim()) return;

    const nextNum = staffList.length + 1;
    const generatedId = `STF-${String(nextNum).padStart(3, '0')}`;

    const newStaff: StaffMember = {
      id: generatedId,
      name: newStaffName.trim(),
      designation: newStaffDesignation.trim() || 'অফিস সহকারী',
      dutyScope: newStaffDutyScope.trim() || 'দাপ্তরিক ও সহায়ক দায়িত্ব পালন',
      phone: newStaffPhone.trim() || '01800-000000',
      joinDate: newStaffJoinDate.trim() || new Date().toISOString().split('T')[0],
      qualification: newStaffQualification.trim() || undefined,
      category: 'office'
    };

    const updated = [...staffList, newStaff];
    setStaffList(updated);
    localStorage.setItem('school_staff', JSON.stringify(updated));

    setNewStaffName('');
    setNewStaffDutyScope('');
    setNewStaffPhone('');
    setNewStaffQualification('');
    setShowAddStaffModal(false);
  };

  const handleOpenEditStaff = (staff: StaffMember) => {
    setEditingStaffId(staff.id);
    setEditStaffName(staff.name);
    setEditStaffDesignation(staff.designation);
    setEditStaffDutyScope(staff.dutyScope);
    setEditStaffPhone(staff.phone);
    setEditStaffJoinDate(staff.joinDate);
    setEditStaffQualification(staff.qualification || '');
    setShowEditStaffModal(true);
  };

  const handleUpdateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editStaffName.trim()) return;

    const updated = staffList.map(s => {
      if (s.id === editingStaffId) {
        return {
          ...s,
          name: editStaffName.trim(),
          designation: editStaffDesignation.trim() || 'অফিস সহকারী',
          dutyScope: editStaffDutyScope.trim() || 'দাপ্তরিক ও সহায়ক দায়িত্ব পালন',
          phone: editStaffPhone.trim() || '01800-000000',
          joinDate: editStaffJoinDate.trim() || s.joinDate,
          qualification: editStaffQualification.trim() || undefined
        };
      }
      return s;
    });

    setStaffList(updated);
    localStorage.setItem('school_staff', JSON.stringify(updated));
    setShowEditStaffModal(false);
  };

  const handleDeleteStaff = (id: string, name: string) => {
    if (confirm(`আপনি কি নিশ্চিত যে "${name}"-কে কর্মচারী তালিকা থেকে অপসারণ করতে চান?`)) {
      const updated = staffList.filter(s => s.id !== id);
      setStaffList(updated);
      localStorage.setItem('school_staff', JSON.stringify(updated));
    }
  };

  const navTabsList = [
    { id: 'home', label: language === 'bn' ? 'হোম' : 'Home', icon: Home },
    { id: 'about', label: language === 'bn' ? 'আমাদের সম্পর্কে' : 'About Us', icon: Info },
    { id: 'donors', label: language === 'bn' ? 'প্রতিষ্ঠাতা ও দাতা ফোরাম' : 'Founders & Donors', icon: HeartHandshake },
    { id: 'committee', label: language === 'bn' ? 'পরিচালনা পর্ষদ' : 'Managing Committee', icon: Award },
    { id: 'teachers', label: language === 'bn' ? 'শিক্ষক ফোরাম' : "Teachers' Forum", icon: Users },
    { id: 'staff', label: language === 'bn' ? 'কর্মচারী তথ্য' : 'Staff Directory', icon: ShieldCheck },
    { id: 'students', label: language === 'bn' ? 'শিক্ষার্থী ও ভর্তি' : 'Students & Admission', icon: GraduationCap },
    { id: 'assembly', label: language === 'bn' ? 'প্রাত্যহিক সমাবেশ' : 'Daily Assembly', icon: Sun },
    { id: 'gallery', label: language === 'bn' ? 'ফটো ও ভিডিও গ্যালারি' : 'Photo & Video Gallery', icon: ImageIcon },
    { id: 'parents', label: language === 'bn' ? 'অভিভাবক কলাম' : 'Parents Column', icon: MessageCircle },
    { id: 'notices', label: language === 'bn' ? 'নোটিশ বোর্ড' : 'Notice Board', icon: Bell },
    { id: 'attendance', label: language === 'bn' ? 'দৈনিক হাজিরা' : 'Attendance', icon: UserCheck },
    { id: 'exams', label: language === 'bn' ? 'পরীক্ষা ও প্রবেশপত্র' : 'Exams & Admit Card', icon: Award },
    { id: 'banks', label: language === 'bn' ? 'ফি ও হিসাব' : 'Fees & Accounts', icon: Landmark },
    { id: 'sms', label: language === 'bn' ? 'SMS গেটওয়ে' : 'SMS Gateway', icon: MessageCircle },
    { id: 'reports', label: language === 'bn' ? 'মাসিক ও বাৎসরিক রিপোর্ট' : 'Reports', icon: TrendingUp },
    { id: 'excellence', label: language === 'bn' ? 'প্রশিক্ষণ ও মেধা বিকাশ' : 'Excellence Hub', icon: Sparkles },
    { id: 'contact', label: language === 'bn' ? 'যোগাযোগ' : 'Contact', icon: Phone }
  ];

  return (
    <div className="min-h-screen bg-[#f0f6f6] text-slate-900 flex flex-col font-sans selection:bg-[#0d3b66] selection:text-white">
     {/* HEADER */}
      <header className="bg-[#0c3664] text-white border-b-2 border-[#d9482b] sticky top-0 z-40 shadow-md">
        {/* Tier 1: Top Info Bar (Desktop only) */}
        <div className="bg-[#082545] border-b border-[#144275] text-slate-300 text-xs hidden md:block">
          <div className="max-w-7xl mx-auto px-6 h-9 flex items-center justify-between gap-4">
           <div className="flex items-center gap-3 shrink-0">
              <span className="text-slate-300 font-medium">
                {language === 'bn' ? 'ইআইআইএন: ১০৪০৬২' : 'EIIN: 104062'}
              </span>
            </div>

            <div className="flex items-center gap-3 text-[11px] shrink-0">
              <div className="flex items-center bg-[#051c36] rounded-md p-0.5 border border-[#1d4c82]">
                <button
                  type="button"
                  onClick={() => setLanguage('bn')}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                    language === 'bn' ? 'bg-[#d9482b] text-white shadow-xs' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  বাংলা
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                    language === 'en' ? 'bg-[#d9482b] text-white shadow-xs' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  English
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tier 2: Main Header Row */}
        {/* 2A. Mobile View (< md): 100% visible, never cut off, with hamburger menu toggle */}
        <div className="md:hidden px-3 py-2 bg-[#0c3664] border-b border-[#134377]/80">
          <div className="flex items-center justify-between gap-2">
            <div
              onClick={() => {
                setActiveTab('home');
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-2.5 cursor-pointer min-w-0"
            >
              <div className="flex items-center shrink-0">
                <SchoolLogo size={42} className="shadow-md shrink-0 w-10 h-10" />
              </div>
              <div className="min-w-0">
                <div className="text-[14px] sm:text-base font-extrabold text-white leading-tight truncate">
                  {language === 'bn' ? 'নাপোড়া শেখেরখীল উচ্চ বিদ্যালয়' : 'Napora Shekherkhil High School'}
                </div>
                <div className="text-[10px] text-amber-200 leading-tight truncate">
                  {language === 'bn' ? 'বাঁশখালী, চট্টগ্রাম · ইআইআইএন: ১০৪০৬২' : 'Banshkhali, Chattogram · EIIN: 104062'}
                </div>
              </div>
            </div>

            {/* Mobile Menu & Quick Toggle */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="px-2.5 py-1.5 bg-[#144275] hover:bg-[#1d5796] border border-amber-400/40 text-amber-300 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
                aria-label="মেনু খুলুন"
              >
                {isMobileMenuOpen ? (
                  <>
                    <X className="w-4 h-4 text-rose-300" />
                    <span>বন্ধ</span>
                  </>
                ) : (
                  <>
                    <Menu className="w-4 h-4 text-amber-300" />
                    <span>মেনু</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Quick Action Buttons Bar */}
          <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-[#144275]">
            {currentAdmin ? (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setShowAdminUsersModal(true)}
                  className="px-2 py-1.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 rounded-lg text-xs font-bold shrink-0 flex items-center justify-center shadow-2xs"
                  title="এডমিন একাউন্ট ও সিকিউরিটি সেটিংস"
                >
                  <Users className="w-3.5 h-3.5 text-slate-950" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLoginPasswordInput('');
                    setLoginError('');
                    setShowAdminLoginModal(true);
                  }}
                  className="flex-1 px-2 py-1.5 bg-[#061d36] border border-amber-400/50 text-amber-300 rounded-lg text-xs font-bold truncate flex items-center justify-center gap-1 shadow-2xs"
                  title="এডমিন সুইচ / প্রোফাইল"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 animate-pulse" />
                  <span className="truncate">{currentAdmin.name.split(' ')[0] || 'এডমিন'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleAdminLogout}
                  className="px-2 py-1.5 bg-rose-700 hover:bg-rose-600 text-white rounded-lg text-xs font-bold shrink-0 flex items-center justify-center shadow-2xs"
                  title="পাবলিক ভিউ / লগআউট"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setLoginPasswordInput('');
                  setLoginError('');
                  setShowAdminLoginModal(true);
                }}
                className="px-2 py-1.5 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 rounded-lg text-xs font-extrabold truncate flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Lock className="w-3.5 h-3.5 text-slate-950 shrink-0" />
                <span>এডমিন লগইন</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                if (activeTab === 'students') {
                  setShowGlobalRegisterPrint(true);
                } else {
                  window.print();
                }
              }}
              className="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 rounded-lg text-xs font-bold truncate flex items-center justify-center gap-1.5 shadow-xs"
              title="প্রিন্ট করুন"
            >
              <Printer className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span>প্রিন্ট</span>
            </button>
          </div>
        </div>

        {/* 2B. Desktop View (>= md / >= 768px): Full Spacious Layout */}
        <div className="hidden md:flex max-w-7xl mx-auto px-6 min-h-[5.5rem] py-3 items-center justify-between gap-6">
          <div
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-4 cursor-pointer shrink-0 group"
          >
            <div className="flex items-center shrink-0">
              <SchoolLogo size={58} className="shadow-md group-hover:scale-105 transition-transform" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white leading-tight">
                  {language === 'bn' ? 'নাপোড়া শেখেরখীল উচ্চ বিদ্যালয়' : 'Napora Shekherkhil High School'}
                </span>
              </div>
              <div className="text-xs text-slate-200 mt-1 flex items-center gap-2">
                <span>{language === 'bn' ? 'ডাক: নাপোড়া, বাঁশখালী, চট্টগ্রাম' : 'Napora, Banshkhali, Chattogram'}</span>
                <span aria-hidden="true" className="text-slate-400">·</span>
                <span className="text-amber-200 font-medium">
                  {language === 'bn' ? 'স্মার্ট স্কুল পোর্টাল' : 'Smart School Portal'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {currentAdmin ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 bg-[#061d36] border border-amber-400/50 px-2.5 py-1.5 rounded-lg text-xs shadow-xs">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <div className="text-left hidden lg:block">
                    <div className="text-[10px] text-amber-300 font-bold leading-none flex items-center gap-1">
                      <span>অথরাইজড এডমিন</span>
                      <span className="text-[9px] bg-amber-400/20 text-amber-200 px-1 rounded">{currentAdmin.roleName}</span>
                    </div>
                    <div className="text-white font-semibold text-xs leading-tight truncate max-w-[130px]">
                      {currentAdmin.name}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAdminLoginModal(true)}
                    className="px-2 py-0.5 bg-[#144275] hover:bg-[#1d5796] text-amber-200 hover:text-white rounded text-[10px] font-bold transition-colors ml-1"
                    title="অন্য কর্মকর্তার একাউন্টে সুইচ করুন"
                  >
                    {language === 'bn' ? 'সুইচ' : 'Switch'}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAdminUsersModal(true)}
                  className="px-3 py-1.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 rounded-lg text-xs font-extrabold transition-all shadow-xs flex items-center gap-1.5"
                  title="এডমিন একাউন্ট যোগ, এডিট, ডিলিট ও পাসওয়ার্ড পরিবর্তন"
                >
                  <Users className="w-3.5 h-3.5 text-slate-950" />
                  <span className="hidden sm:inline">ইউজার ও সিকিউরিটি</span>
                </button>

                <button
                  type="button"
                  onClick={handleAdminLogout}
                  className="px-3 py-1.5 bg-rose-700 hover:bg-rose-600 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 border border-rose-400/50"
                  title="এডমিন মোড বন্ধ করে সাধারণ দর্শক বা ভিজিটর হিসেবে ওয়েবসাইট দেখতে এখানে ক্লিক করুন"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>পাবলিক ভিউ</span>
                  <LogOut className="w-3 h-3 text-rose-200" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-[11px] bg-emerald-950/80 border border-emerald-400/50 text-emerald-300 px-2.5 py-1.5 rounded-lg font-medium flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-emerald-400" />
                  <span>পাবলিক মোড</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setLoginPasswordInput('');
                    setLoginError('');
                    setShowAdminLoginModal(true);
                  }}
                  className="px-3.5 py-1.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 rounded-lg text-xs font-extrabold transition-all shadow-xs flex items-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5 text-slate-950" />
                  <span>{language === 'bn' ? 'এডমিন লগইন' : 'Admin Login'}</span>
                </button>
              </div>
            )}

            {/* Apply Now / ভর্তি আবেদন Button (Matches user reference design) */}
            <button
              type="button"
              onClick={() => setShowAdmissionModal(true)}
              className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg text-xs font-black transition-all shadow-xs flex items-center gap-1.5 border border-emerald-400/50 cursor-pointer active:scale-95"
              title="নতুন শিক্ষার্থী অনলাইন ভর্তি আবেদন"
            >
              <UserPlus className="w-3.5 h-3.5 text-white" />
              <span>{language === 'bn' ? 'ভর্তি আবেদন' : 'Apply Now'}</span>
            </button>

            {currentAdmin && (
              <button
                type="button"
                onClick={() => setActiveTab('office')}
                className="px-3 py-1.5 bg-[#144275] hover:bg-[#1d5796] border border-blue-400/40 text-amber-200 hover:text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                title="এডমিন ইনপুট ও অফিস ডেস্ক"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                <span>{language === 'bn' ? 'অফিস ডেস্ক' : 'Office'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                if (activeTab === 'students') {
                  setShowGlobalRegisterPrint(true);
                } else {
                  window.print();
                }
              }}
              className="px-3 py-1.5 bg-slate-800/80 hover:bg-slate-700 border border-slate-600 text-slate-200 hover:text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
              title={activeTab === 'students' ? 'শিক্ষার্থী রেজিস্টার শিট প্রিন্ট করুন' : 'প্রিন্ট করুন'}
            >
              <Printer className="w-3.5 h-3.5 text-amber-300" />
              <span>{language === 'bn' ? 'প্রিন্ট' : 'Print'}</span>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu Drawer (Visible when isMobileMenuOpen is true) */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#07213d] border-b-2 border-amber-400 p-3 sm:p-4 space-y-3 animate-in slide-in-from-top duration-150 shadow-xl">
            <div className="text-xs font-bold text-amber-300 uppercase tracking-wider pb-1.5 border-b border-[#144275] flex items-center justify-between">
              <span>মেনু তালিকা (Navigation Menu)</span>
              <span className="text-[10px] text-slate-300">{navTabsList.length} টি বিভাগ</span>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              {navTabsList.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      setActiveTab(tab.id as NavTab);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-2 p-2 rounded-xl text-xs font-bold transition-all text-left ${
                      isActive
                        ? 'bg-[#d9482b] text-white shadow-xs'
                        : 'bg-[#0c3664] text-slate-200 hover:text-white hover:bg-[#144275]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-amber-300'}`} />
                    <span className="truncate">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Mobile Drawer Footer Utilities */}
            <div className="pt-2 border-t border-[#144275] flex items-center justify-between text-xs">
              <div className="flex items-center gap-1 bg-[#051c36] p-1 rounded-lg border border-[#1d4c82]">
                <button
                  type="button"
                  onClick={() => setLanguage('bn')}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    language === 'bn' ? 'bg-[#d9482b] text-white' : 'text-slate-300'
                  }`}
                >
                  বাংলা
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    language === 'en' ? 'bg-[#d9482b] text-white' : 'text-slate-300'
                  }`}
                >
                  EN
                </button>
              </div>

              {currentAdmin && (
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('office');
                    setIsMobileMenuOpen(false);
                  }}
                  className="px-2.5 py-1 bg-[#144275] text-amber-200 rounded-lg text-xs font-bold flex items-center gap-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                  <span>অফিস ডেস্ক</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Tier 3: Horizontal Swipeable Nav Strip (Zero-overlap guaranteed) */}
        <nav className="bg-[#092b50] border-t border-[#134377] w-full">
          <div className="max-w-7xl mx-auto px-2 sm:px-6 py-1.5 w-full flex items-center gap-1.5 overflow-x-auto scrollbar-none touch-pan-x">
            {navTabsList.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.id as NavTab);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`shrink-0 flex items-center justify-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-lg whitespace-nowrap transition-all text-xs font-semibold select-none ${
                    isActive
                      ? 'bg-[#d9482b] text-white font-bold shadow-xs'
                      : 'text-slate-200 hover:text-white hover:bg-[#123e6e]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-amber-300'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Tier 4: Urgent Notice Bar (Positioned directly below Header & Menu Bar, matching traditional school portals) */}
        <UrgentNoticeBar
          isAdmin={!!currentAdmin}
          onRequireAdminLogin={() => {
            setLoginPasswordInput('');
            setLoginError('');
            setShowAdminLoginModal(true);
          }}
          language={language}
          onNavigateToNotices={() => {
            setActiveTab('notices');
            setIsMobileMenuOpen(false);
          }}
        />
      </header>

      {/* MAIN BODY CONTENT */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 flex-1 w-full max-w-full overflow-hidden space-y-6">
        {/* Universal Back / Close Navigation Bar for Inner Pages */}
        {activeTab !== 'home' && (
          <div className="flex flex-wrap items-center justify-between gap-2 bg-white px-3 sm:px-5 py-2.5 sm:py-3 rounded-2xl border border-[#d9e6e7] shadow-xs animate-in fade-in duration-150">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('home')}
                className="px-4 py-2 bg-[#0c3664] hover:bg-[#092b50] text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-xs transition-all group"
                title="মূল পাতায় (হোমে) ফিরে যান"
              >
                <ArrowLeft className="w-4 h-4 text-amber-300 group-hover:-translate-x-1 transition-transform" />
                <span>← মূল পাতায় ফিরে যান (হোম)</span>
              </button>

              <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500">
                <span>হোম</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-bold text-[#0c3664]">
                  {
                    activeTab === 'students' ? 'শিক্ষার্থীর তথ্য ডিরেক্টরি' :
                    activeTab === 'committee' ? 'পরিচালনা পর্ষদ' :
                    activeTab === 'donors' ? 'প্রতিষ্ঠাতা ও দাতা ফোরাম' :
                    activeTab === 'notices' ? 'জরুরি বার্তা ও নোটিশ বোর্ড' :
                    activeTab === 'teachers' ? 'শিক্ষক ফোরাম' :
                    activeTab === 'staff' ? 'কর্মচারী তথ্য' :
                    activeTab === 'parents' ? 'অভিভাবক কলাম' :
                    activeTab === 'edulinks' ? 'শিক্ষা লিংক' :
                    activeTab === 'banks' ? 'ব্যাংক একাউন্ট ড্যাশবোর্ড' :
                    activeTab === 'office' ? 'এডমিন ইনপুট ও অফিস' :
                    activeTab === 'ai' ? 'এআই ব্যাংক স্টেটমেন্ট স্ক্যানার' :
                    activeTab === 'about' ? 'আমাদের সম্পর্কে' :
                    activeTab === 'contact' ? 'যোগাযোগ ও ঠিকানা' : activeTab
                  }
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveTab('home')}
              className="px-3.5 py-1.5 text-slate-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors border border-slate-200 text-xs font-semibold flex items-center gap-1.5"
              title="বর্তমান সেকশন বন্ধ করুন এবং হোমে ফিরে যান"
            >
              <X className="w-4 h-4 text-slate-500" />
              <span>ক্লোজ / ব্যাকে যান (Close / Back)</span>
            </button>
          </div>
        )}

        {activeTab === 'home' && (
          <HomeTab
            language={language}
            setActiveTab={setActiveTab}
            students={students}
            totalStudents={totalStudents}
            paidStudents={paidStudents}
            dueStudents={dueStudents}
            totalCollected={totalCollected}
            totalDueAmount={totalDueAmount}
            teacherCount={teachers.length}
            currentAdmin={currentAdmin}
            onOpenNoticeEntry={() => setActiveTab('office')}
            headmasterData={headmasterData}
            onOpenEditHeadmaster={currentAdmin ? () => setShowHeadmasterEditModal(true) : undefined}
            presidentData={presidentData}
            onOpenEditPresident={currentAdmin ? () => setShowPresidentEditModal(true) : undefined}
          />
        )}

        {activeTab === 'notices' && (
          <NoticeBoardTab
            isAdmin={!!currentAdmin}
            onPrint={() => window.print()}
          />
        )}

        {activeTab === 'about' && (
          <AboutTab
            language={language}
            headmasterData={headmasterData}
            onOpenEditHeadmaster={currentAdmin ? () => setShowHeadmasterEditModal(true) : undefined}
            presidentData={presidentData}
            onOpenEditPresident={currentAdmin ? () => setShowPresidentEditModal(true) : undefined}
          />
        )}

        {activeTab === 'committee' && (
          <CommitteeTab
            isAdmin={!!currentAdmin}
            onPrint={() => window.print()}
            presidentData={presidentData}
            onOpenEditPresident={currentAdmin ? () => setShowPresidentEditModal(true) : undefined}
          />
        )}

        {activeTab === 'donors' && (
          <DonorsTab
            isAdmin={!!currentAdmin}
            onPrint={() => window.print()}
          />
        )}

        {activeTab === 'teachers' && (
          <FacultyTab
            language={language}
            teachers={teachers}
            currentAdmin={currentAdmin}
            onOpenAddTeacher={() => setShowAddTeacherModal(true)}
            onOpenEditTeacher={handleOpenEditTeacher}
            onDeleteTeacher={handleDeleteTeacher}
            setActiveTab={setActiveTab}
            headmasterData={headmasterData}
            onOpenEditHeadmaster={currentAdmin ? () => setShowHeadmasterEditModal(true) : undefined}
          />
        )}

        {activeTab === 'staff' && (
          <StaffTab
            staffList={staffList}
            onOpenAddStaff={() => setShowAddStaffModal(true)}
            onOpenEditStaff={handleOpenEditStaff}
            onDeleteStaff={handleDeleteStaff}
            onPrint={() => window.print()}
          />
        )}

        {activeTab === 'students' && (
          <StudentsTab
            students={students}
            setStudents={setStudents}
            isAdmin={!!currentAdmin}
            onOpenDispatch={(stu) => {
              setSelectedStudentForDispatch(stu);
              setShowDispatchModal(true);
            }}
            onOpenSlip={(stu) => {
              setSelectedStudentForSlip(stu);
              setShowSlipModal(true);
            }}
            onPrint={() => setShowGlobalRegisterPrint(true)}
          />
        )}

        {activeTab === 'assembly' && (
          <DailyAssemblyTab
            language={language}
            isAdmin={!!currentAdmin}
            onRequireAdminLogin={() => {
              setLoginPasswordInput('');
              setLoginError('');
              setShowAdminLoginModal(true);
            }}
            teachers={teachers}
          />
        )}

        {activeTab === 'gallery' && (
          <GalleryTab
            isAdmin={!!currentAdmin}
            onRequireAdminLogin={() => {
              setLoginPasswordInput('');
              setLoginError('');
              setShowAdminLoginModal(true);
            }}
            language={language}
          />
        )}

        {activeTab === 'attendance' && (
          <AttendanceHubTab
            students={students}
            teachers={teachers}
            staffList={staffList}
            isAdmin={!!currentAdmin}
            onNavigateToSms={(note) => {
              setSmsPrefillMessage(note || '');
              setActiveTab('sms');
            }}
          />
        )}

        {activeTab === 'exams' && (
          <ExamsAndAdmitCardTab
            students={students}
            isAdmin={!!currentAdmin}
          />
        )}

        {activeTab === 'sms' && (
          <SmsGatewayTab
            students={students}
            isAdmin={!!currentAdmin}
            initialCustomMessage={smsPrefillMessage}
          />
        )}

        {activeTab === 'reports' && (
          <InstitutionalReportsTab
            students={students}
            teachers={teachers}
            staffList={staffList}
            isAdmin={!!currentAdmin}
          />
        )}

        {activeTab === 'excellence' && (
          <AcademicExcellenceTab
            isAdmin={!!currentAdmin}
          />
        )}

        {activeTab === 'parents' && (
          <ParentsColumnTab
            isAdmin={!!currentAdmin}
            onPrint={() => window.print()}
          />
        )}

        {activeTab === 'edulinks' && (
          <EduLinksTab
            isAdmin={!!currentAdmin}
          />
        )}

        {activeTab === 'banks' && (
          currentAdmin ? (
            <BankDashboardTab
              students={students}
              totalStudents={totalStudents}
              paidStudents={paidStudents}
              dueStudents={dueStudents}
              totalCollected={totalCollected}
              totalDueAmount={totalDueAmount}
              krishiCount={krishiCount}
              ificCount={ificCount}
              setActiveTab={setActiveTab}
            />
          ) : (
            <div className="bg-white border-2 border-amber-400/80 rounded-3xl p-8 max-w-2xl mx-auto shadow-md text-center space-y-5 animate-in fade-in my-8">
              <div className="w-16 h-16 bg-amber-100 text-[#0c3664] rounded-2xl flex items-center justify-center mx-auto shadow-xs border border-amber-300">
                <Lock className="w-8 h-8 text-[#0c3664]" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-extrabold text-[#0c3664]">
                  বিদ্যালয়ের ব্যাংক হিসাব ও আয়-ব্যয় ড্যাশবোর্ড
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-lg mx-auto">
                  বিদ্যালয়ের ব্যাংক হিসাব, ফি আদায় ও সামগ্রিক আয়/ব্যয়ের তথ্য সাধারণ দর্শকদের জন্য সম্পূর্ণ গোপন রাখা হয়েছে। শুধুমাত্র অনুমোদিত শিক্ষক ও প্রশাসনিক কর্মকর্তা এডমিন লগইন করে এই তথ্য দেখতে ও পরিচালনা করতে পারবেন।
                </p>
              </div>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowAdminLoginModal(true)}
                  className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all"
                >
                  <Lock className="w-4 h-4 text-slate-950" />
                  <span>এডমিন প্যানেলে লগইন করুন</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('home')}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
                >
                  ← মূল পাতায় ফিরে যান
                </button>
              </div>
            </div>
          )
        )}

        {activeTab === 'office' && (
          <AdminDeskTab
            currentAdmin={currentAdmin}
            setCurrentAdmin={setCurrentAdmin}
            setShowAdminLoginModal={setShowAdminLoginModal}
            students={students}
            setStudents={setStudents}
            teachers={teachers}
            onOpenAddTeacher={() => setShowAddTeacherModal(true)}
            staffList={staffList}
            onOpenAddStaff={() => setShowAddStaffModal(true)}
            transactions={transactions}
            setTransactions={setTransactions}
            onOpenEditHeadmaster={() => setShowHeadmasterEditModal(true)}
            onOpenAdminUsersModal={() => setShowAdminUsersModal(true)}
          />
        )}

        {activeTab === 'ai' && (
          <AiScannerTab
            students={students}
            setStudents={setStudents}
            transactions={transactions}
            setTransactions={setTransactions}
          />
        )}

        {activeTab === 'contact' && (
          <ContactTab />
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-[#0c3664] text-white border-t-2 border-[#d9482b] mt-12">
        <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3 md:col-span-2">
              <div className="flex items-center gap-3">
                <SchoolLogo size={50} className="shadow-md" />
                <div>
                  <div className="font-bold text-base text-white">নাপোড়া শেখেরখীল উচ্চ বিদ্যালয়</div>
                  <div className="text-xs text-amber-300 italic font-semibold">"পড় স্রষ্টার নামে"</div>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed max-w-md">
                ডাক: নাপোড়া, উপজেলা: বাঁশখালী, জেলা: চট্টগ্রাম। ১৯৬৪ সালে প্রতিষ্ঠিত ঐতিহ্যবাহী বিদ্যাপীঠ। আধুনিক যুগোপযোগী শিক্ষা ও ডিজিটাল ব্যাংক ফি সমন্বয় ব্যবস্থাপনা।
              </p>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                {language === 'bn' ? 'দ্রুত নেভিগেশন' : 'Quick Links'}
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-slate-300">
                <button type="button" onClick={() => setActiveTab('home')} className="hover:text-white text-left">
                  {language === 'bn' ? 'হোম' : 'Home'}
                </button>
                <button type="button" onClick={() => setActiveTab('about')} className="hover:text-white text-left">
                  {language === 'bn' ? 'আমাদের সম্পর্কে' : 'About Us'}
                </button>
                <button type="button" onClick={() => setActiveTab('donors')} className="hover:text-white text-left">
                  {language === 'bn' ? 'প্রতিষ্ঠাতা ও দাতা' : 'Donors'}
                </button>
                <button type="button" onClick={() => setActiveTab('committee')} className="hover:text-white text-left">
                  {language === 'bn' ? 'পরিচালনা পর্ষদ' : 'Committee'}
                </button>
                <button type="button" onClick={() => setActiveTab('teachers')} className="hover:text-white text-left">
                  {language === 'bn' ? 'শিক্ষক ফোরাম' : "Teachers' Forum"}
                </button>
                <button type="button" onClick={() => setActiveTab('staff')} className="hover:text-white text-left">
                  {language === 'bn' ? 'কর্মচারী তথ্য' : 'Staff Info'}
                </button>
                <button type="button" onClick={() => setActiveTab('students')} className="hover:text-white text-left">
                  {language === 'bn' ? 'শিক্ষার্থীর তথ্য' : 'Student Info'}
                </button>
                <button type="button" onClick={() => setActiveTab('assembly')} className="hover:text-amber-300 text-left font-bold text-amber-200">
                  {language === 'bn' ? 'প্রাত্যহিক সমাবেশ' : 'Daily Assembly'}
                </button>
                <button type="button" onClick={() => setActiveTab('gallery')} className="hover:text-amber-300 text-left font-bold text-amber-200">
                  {language === 'bn' ? 'ফটো গ্যালারি' : 'Gallery'}
                </button>
                <button type="button" onClick={() => setActiveTab('parents')} className="hover:text-white text-left">
                  {language === 'bn' ? 'অভিভাবক কলাম' : 'Parents'}
                </button>
                <button type="button" onClick={() => setActiveTab('notices')} className="hover:text-white text-left">
                  {language === 'bn' ? 'নোটিশ বোর্ড' : 'Notices'}
                </button>
                <button type="button" onClick={() => setActiveTab('contact')} className="hover:text-white text-left">
                  {language === 'bn' ? 'যোগাযোগ' : 'Contact'}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-bold text-amber-300 uppercase tracking-wider">ফি জমা শাখা</div>
              <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
                <div>
                  <div className="font-semibold text-white">বাংলাদেশ কৃষি ব্যাংক</div>
                  <div className="text-[11px] text-slate-400">নাপোড়া বাজার শাখা, বাঁশখালী</div>
                </div>
                <div>
                  <div className="font-semibold text-white">আইএফআইসি ব্যাংক পিএলসি</div>
                  <div className="text-[11px] text-slate-400">নাপোড়া বাজার উপশাখা, বাঁশখালী</div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-[#144275] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-300">
            <div>
              © {new Date().getFullYear()} নাপোড়া শেখেরখীল উচ্চ বিদ্যালয় · সর্বস্বত্ব সংরক্ষিত।
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <span>ইআইআইএন: ১০৪০৬২</span>
              <span aria-hidden="true" className="text-slate-500">·</span>
              <span>স্থাপিত: ১৯৬৪ ইং</span>
              <span aria-hidden="true" className="text-slate-500">·</span>
              <span className="text-amber-300 font-semibold">বাঁশখালী, চট্টগ্রাম</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ADMIN AUTHORIZATION MODAL WITH PASSWORD / PIN */}
      {showAdminLoginModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-slate-200 space-y-5 relative my-8 animate-in fade-in zoom-in-95 duration-150">
            <button
              type="button"
              onClick={() => {
                setShowAdminLoginModal(false);
                setLoginError('');
                setLoginPasswordInput('');
              }}
              className="absolute right-5 top-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-amber-50 border border-amber-200 text-amber-600 rounded-2xl flex items-center justify-center shrink-0">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  {language === 'bn' ? 'এডমিন সিকিউরিটি লগইন' : 'Admin Security Login'}
                </h3>
                <p className="text-xs text-slate-500">
                  {language === 'bn' ? 'নাপোড়া শেখেরখীল উচ্চ বিদ্যালয় · বাঁশখালী, চট্টগ্রাম' : 'Napora Shekherkhil High School, Banshkhali'}
                </p>
              </div>
            </div>

            {loginError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-semibold flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleAdminLoginSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  {language === 'bn' ? 'অনুমোদিত কর্মকর্তা / পদবি নির্বাচন করুন:' : 'Select Authorized Official:'}
                </label>

                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {adminUsers.map(staff => (
                    <div
                      key={staff.id}
                      onClick={() => setLoginSelectedStaffId(staff.id)}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex items-center justify-between group ${
                        loginSelectedStaffId === staff.id
                          ? 'bg-amber-50/80 border-amber-400 ring-2 ring-amber-400/30'
                          : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-sm text-slate-900 flex items-center gap-2">
                          <span>{staff.name}</span>
                          {currentAdmin?.id === staff.id && (
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                              সক্রিয়
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-[#0c3664] font-semibold mt-0.5">{staff.roleName}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{staff.badge}</div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                        loginSelectedStaffId === staff.id
                          ? 'border-amber-500 bg-amber-500 text-slate-950'
                          : 'border-slate-300 bg-white'
                      }`}>
                        {loginSelectedStaffId === staff.id && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5 pt-1 border-t border-slate-100">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>{language === 'bn' ? 'এডমিন পাসওয়ার্ড / পিন কোড:' : 'Admin Password / PIN:'}</span>
                  <span className="text-[11px] text-amber-700 font-medium">প্রাথমিক ডিফল্ট: 1234</span>
                </label>
                <div className="relative">
                  <input
                    type={loginShowPassword ? 'text' : 'password'}
                    value={loginPasswordInput}
                    onChange={(e) => setLoginPasswordInput(e.target.value)}
                    placeholder="গোপন পিন লিখুন (যেমন: 1234)"
                    required
                    autoFocus
                    className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0c3664] focus:bg-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setLoginShowPassword(!loginShowPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {loginShowPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  🔒 পাসওয়ার্ড না জানা থাকলে সাধারণ ভিজিটর বা শিক্ষার্থীরা এডমিন প্যানেলে প্রবেশ করতে পারবে না।
                </p>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAdminLoginModal(false);
                    setLoginError('');
                    setLoginPasswordInput('');
                  }}
                  className="flex-1 py-2.5 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-colors"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 rounded-xl text-xs font-extrabold shadow-sm transition-all flex items-center justify-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>লগইন সম্পন্ন করুন</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD TEACHER MODAL */}
      {showAddTeacherModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 md:p-8 shadow-2xl border border-slate-200 space-y-5 relative my-8 animate-in fade-in zoom-in-95 duration-150">
            <button
              type="button"
              onClick={() => setShowAddTeacherModal(false)}
              className="absolute right-5 top-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-rose-50 border border-rose-200 text-[#d9482b] rounded-2xl flex items-center justify-center shrink-0">
                <UserPlus className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">নতুন শিক্ষক অন্তর্ভুক্তি ফরম</h3>
                <p className="text-xs text-slate-500">প্রধান শিক্ষক বা যেকোনো সম্মানিত শিক্ষক যুক্ত করুন</p>
              </div>
            </div>

            <form onSubmit={handleAddNewTeacher} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="sm:col-span-2">
                  <label className="font-semibold text-slate-700 block mb-1">শিক্ষকের পূর্ণ নাম *</label>
                  <input
                    type="text"
                    required
                    value={newTeacherName}
                    onChange={(e) => setNewTeacherName(e.target.value)}
                    placeholder="যেমন: জনাব মোঃ জাহাঙ্গীর আলম"
                    className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900 font-medium"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">পদবী *</label>
                  <select
                    value={newTeacherDesignation}
                    onChange={(e) => setNewTeacherDesignation(e.target.value)}
                    className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900 font-medium"
                  >
                    <option value="প্রধান শিক্ষক">প্রধান শিক্ষক (Headmaster)</option>
                    <option value="সহকারী প্রধান শিক্ষক">সহকারী প্রধান শিক্ষক</option>
                    <option value="সিনিয়র শিক্ষক">সিনিয়র শিক্ষক</option>
                    <option value="সহকারী শিক্ষক">সহকারী শিক্ষক</option>
                    <option value="সহকারী শিক্ষক (আইসিটি)">সহকারী শিক্ষক (আইসিটি)</option>
                    <option value="সহকারী মৌলভী">সহকারী মৌলভী</option>
                    <option value="শরীরচর্চা শিক্ষক">শরীরচর্চা শিক্ষক</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">পাঠদানের বিষয় *</label>
                  <input
                    type="text"
                    required
                    value={newTeacherSubject}
                    onChange={(e) => setNewTeacherSubject(e.target.value)}
                    placeholder="যেমন: গণিত / ইংরেজি / বিজ্ঞান"
                    className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">শিক্ষাগত যোগ্যতা</label>
                  <input
                    type="text"
                    value={newTeacherQualification}
                    onChange={(e) => setNewTeacherQualification(e.target.value)}
                    placeholder="যেমন: এম.এসসি, বি.এড"
                    className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">মোবাইল নম্বর *</label>
                  <input
                    type="tel"
                    required
                    value={newTeacherPhone}
                    onChange={(e) => setNewTeacherPhone(e.target.value)}
                    placeholder="01711-XXXXXX"
                    className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">ইমেইল ঠিকানা</label>
                  <input
                    type="email"
                    value={newTeacherEmail}
                    onChange={(e) => setNewTeacherEmail(e.target.value)}
                    placeholder="teacher@school.edu.bd"
                    className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">যোগদানের তারিখ</label>
                  <input
                    type="date"
                    value={newTeacherJoinDate}
                    onChange={(e) => setNewTeacherJoinDate(e.target.value)}
                    className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddTeacherModal(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#d9482b] hover:bg-[#b8381e] text-white font-bold rounded-xl shadow-xs"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT TEACHER MODAL */}
      {showEditTeacherModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 md:p-8 shadow-2xl border border-slate-100 space-y-6 animate-in fade-in zoom-in-95 duration-150 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#0c3664] flex items-center justify-center border border-blue-200">
                  <Pencil className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">শিক্ষক তথ্য সম্পাদনা ও আপডেট</h3>
                  <p className="text-xs text-slate-500 font-mono text-[#0c3664]">{editingTeacherId}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowEditTeacherModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateTeacher} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="sm:col-span-2">
                  <label className="font-semibold text-slate-700 block mb-1">শিক্ষকের পূর্ণ নাম *</label>
                  <input
                    type="text"
                    required
                    value={editTeacherName}
                    onChange={(e) => setEditTeacherName(e.target.value)}
                    className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900 font-medium"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">পদবী *</label>
                  <select
                    value={editTeacherDesignation}
                    onChange={(e) => setEditTeacherDesignation(e.target.value)}
                    className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900 font-medium"
                  >
                    <option value="প্রধান শিক্ষক">প্রধান শিক্ষক (Headmaster)</option>
                    <option value="সহকারী প্রধান শিক্ষক">সহকারী প্রধান শিক্ষক</option>
                    <option value="সিনিয়র শিক্ষক">সিনিয়র শিক্ষক</option>
                    <option value="সহকারী শিক্ষক">সহকারী শিক্ষক</option>
                    <option value="সহকারী শিক্ষক (আইসিটি)">সহকারী শিক্ষক (আইসিটি)</option>
                    <option value="সহকারী মৌলভী">সহকারী মৌলভী</option>
                    <option value="শরীরচর্চা শিক্ষক">শরীরচর্চা শিক্ষক</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">পাঠদানের বিষয় *</label>
                  <input
                    type="text"
                    required
                    value={editTeacherSubject}
                    onChange={(e) => setEditTeacherSubject(e.target.value)}
                    className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">শিক্ষাগত যোগ্যতা</label>
                  <input
                    type="text"
                    value={editTeacherQualification}
                    onChange={(e) => setEditTeacherQualification(e.target.value)}
                    className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">মোবাইল নম্বর *</label>
                  <input
                    type="tel"
                    required
                    value={editTeacherPhone}
                    onChange={(e) => setEditTeacherPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">ইমেইল ঠিকানা</label>
                  <input
                    type="email"
                    value={editTeacherEmail}
                    onChange={(e) => setEditTeacherEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">যোগদানের তারিখ</label>
                  <input
                    type="date"
                    value={editTeacherJoinDate}
                    onChange={(e) => setEditTeacherJoinDate(e.target.value)}
                    className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowEditTeacherModal(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#0c3664] hover:bg-[#092b50] text-white font-bold rounded-xl shadow-xs"
                >
                  আপডেট করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD STAFF MODAL */}
      {showAddStaffModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 md:p-8 shadow-2xl border border-slate-100 space-y-6 animate-in fade-in zoom-in-95 duration-150 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">নতুন কর্মচারী অন্তর্ভুক্তি ফরম</h3>
                  <p className="text-xs text-slate-500">অফিস সহকারী, পিয়ন, আয়া, নিরাপত্তা প্রহরী ইত্যাদি</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddStaffModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddNewStaff} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="sm:col-span-2">
                  <label className="font-semibold text-slate-700 block mb-1">কর্মচারীর পূর্ণ নাম *</label>
                  <input
                    type="text"
                    required
                    value={newStaffName}
                    onChange={(e) => setNewStaffName(e.target.value)}
                    placeholder="যেমন: মোঃ দেলোয়ার হোসেন"
                    className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900 font-medium"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">পদবী *</label>
                  <input
                    type="text"
                    required
                    value={newStaffDesignation}
                    onChange={(e) => setNewStaffDesignation(e.target.value)}
                    placeholder="যেমন: অফিস সহকারী / পিয়ন / আয়া"
                    className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900 font-medium"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">প্রধান দায়িত্ব *</label>
                  <input
                    type="text"
                    required
                    value={newStaffDutyScope}
                    onChange={(e) => setNewStaffDutyScope(e.target.value)}
                    placeholder="যেমন: দাপ্তরিক কাজ / প্রাঙ্গণ সেবা"
                    className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">শিক্ষাগত যোগ্যতা</label>
                  <input
                    type="text"
                    value={newStaffQualification}
                    onChange={(e) => setNewStaffQualification(e.target.value)}
                    placeholder="যেমন: এইচএসসি / এসএসসি"
                    className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">মোবাইল নম্বর *</label>
                  <input
                    type="tel"
                    required
                    value={newStaffPhone}
                    onChange={(e) => setNewStaffPhone(e.target.value)}
                    placeholder="018XX-XXXXXX"
                    className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">যোগদানের তারিখ</label>
                  <input
                    type="date"
                    value={newStaffJoinDate}
                    onChange={(e) => setNewStaffJoinDate(e.target.value)}
                    className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddStaffModal(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#d9482b] hover:bg-[#b8381e] text-white font-bold rounded-xl shadow-xs"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT STAFF MODAL */}
      {showEditStaffModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 md:p-8 shadow-2xl border border-slate-100 space-y-6 animate-in fade-in zoom-in-95 duration-150 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#0c3664] flex items-center justify-center border border-blue-200">
                  <Pencil className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">কর্মচারী তথ্য সম্পাদনা ও আপডেট</h3>
                  <p className="text-xs text-slate-500 font-mono text-[#0c3664]">{editingStaffId}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowEditStaffModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateStaff} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="sm:col-span-2">
                  <label className="font-semibold text-slate-700 block mb-1">কর্মচারীর পূর্ণ নাম *</label>
                  <input
                    type="text"
                    required
                    value={editStaffName}
                    onChange={(e) => setEditStaffName(e.target.value)}
                    className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900 font-medium"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">পদবী *</label>
                  <input
                    type="text"
                    required
                    value={editStaffDesignation}
                    onChange={(e) => setEditStaffDesignation(e.target.value)}
                    className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900 font-medium"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">প্রধান দায়িত্ব *</label>
                  <input
                    type="text"
                    required
                    value={editStaffDutyScope}
                    onChange={(e) => setEditStaffDutyScope(e.target.value)}
                    className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">শিক্ষাগত যোগ্যতা</label>
                  <input
                    type="text"
                    value={editStaffQualification}
                    onChange={(e) => setEditStaffQualification(e.target.value)}
                    className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">মোবাইল নম্বর *</label>
                  <input
                    type="tel"
                    required
                    value={editStaffPhone}
                    onChange={(e) => setEditStaffPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">যোগদানের তারিখ</label>
                  <input
                    type="date"
                    value={editStaffJoinDate}
                    onChange={(e) => setEditStaffJoinDate(e.target.value)}
                    className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowEditStaffModal(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#0c3664] hover:bg-[#092b50] text-white font-bold rounded-xl shadow-xs"
                >
                  আপডেট করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GUARDIAN DISPATCH MODAL */}
      {showDispatchModal && selectedStudentForDispatch && (
        <GuardianDispatchModal
          student={selectedStudentForDispatch}
          isOpen={showDispatchModal}
          onClose={() => {
            setShowDispatchModal(false);
            setSelectedStudentForDispatch(null);
          }}
          onOpenSlip={(stu) => {
            setSelectedStudentForSlip(stu);
            setShowSlipModal(true);
          }}
        />
      )}

      {/* STUDENT SLIP MODAL */}
      {showSlipModal && selectedStudentForSlip && (
        <StudentSlipModal
          student={selectedStudentForSlip}
          isOpen={showSlipModal}
          onClose={() => {
            setShowSlipModal(false);
            setSelectedStudentForSlip(null);
          }}
        />
      )}

      {/* HEADMASTER EDIT MODAL */}
      <HeadmasterEditModal
        isOpen={showHeadmasterEditModal}
        onClose={() => setShowHeadmasterEditModal(false)}
        data={headmasterData}
        onSave={handleSaveHeadmasterData}
      />

      {/* PRESIDENT EDIT MODAL */}
      <PresidentEditModal
        isOpen={showPresidentEditModal}
        onClose={() => setShowPresidentEditModal(false)}
        data={presidentData}
        onSave={handleSavePresidentData}
      />

      {/* GLOBAL STUDENT REGISTER PRINT MODAL */}
      {showGlobalRegisterPrint && (
        <StudentRegisterPrintModal
          students={students}
          isOpen={showGlobalRegisterPrint}
          onClose={() => setShowGlobalRegisterPrint(false)}
          selectedClass="all"
          selectedSection="all"
          selectedGroup="all"
        />
      )}

      {/* ADMIN USERS & SECURITY MANAGEMENT MODAL */}
      <AdminUsersManagementModal
        isOpen={showAdminUsersModal}
        onClose={() => setShowAdminUsersModal(false)}
        adminUsers={adminUsers}
        setAdminUsers={setAdminUsers}
        currentAdmin={currentAdmin}
        setCurrentAdmin={setCurrentAdmin}
      />

      {/* ONLINE STUDENT ADMISSION MODAL */}
      <OnlineAdmissionModal
        isOpen={showAdmissionModal}
        onClose={() => setShowAdmissionModal(false)}
        existingCount={students.length}
        onAddStudent={(newStudent) => {
          const updated = [...students, newStudent];
          setStudents(updated);
          localStorage.setItem('school_students', JSON.stringify(updated));
        }}
      />
    </div>
  );
}
