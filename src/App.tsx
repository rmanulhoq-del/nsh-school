/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
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
  ChevronLeft,
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
  Sun,
  LayoutGrid,
  History,
  FileText,
  BookOpen
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
  DEFAULT_PRESIDENT_DATA,
  sortStudentsBySerial
} from './types';
import {
  AUTHORIZED_STAFF,
  INITIAL_STUDENTS,
  INITIAL_TEACHERS,
  INITIAL_STAFF,
  INITIAL_TRANSACTIONS,
  sortTeachersByHierarchy
} from './data/initialData';
import { CLASS_10_HUMANITIES_STUDENTS } from './data/class10HumanitiesStudents';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [language, setLanguage] = useState<'bn' | 'en'>('bn');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [aboutInitialSection, setAboutInitialSection] = useState<'all' | 'overview' | 'headmasters'>('overview');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [dropdownCoords, setDropdownCoords] = useState<{ left: number; top: number }>({ left: 100, top: 120 });
  const navContainerRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = (menuName: string, event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (activeDropdown === menuName) {
      setActiveDropdown(null);
    } else {
      const rect = event.currentTarget.getBoundingClientRect();
      const menuWidth = 320;
      let targetLeft = rect.left;
      if (targetLeft + menuWidth > window.innerWidth - 12) {
        targetLeft = Math.max(12, window.innerWidth - menuWidth - 12);
      }
      setDropdownCoords({
        left: targetLeft,
        top: rect.bottom + 6
      });
      setActiveDropdown(menuName);
      setShowAllMenuDropdown(false);
    }
  };

  // Close dropdown on window resize or scroll
  useEffect(() => {
    const handleClose = () => {
      if (activeDropdown) setActiveDropdown(null);
    };
    window.addEventListener('resize', handleClose);
    return () => window.removeEventListener('resize', handleClose);
  }, [activeDropdown]);

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
    if (!saved) return sortStudentsBySerial(INITIAL_STUDENTS);
    try {
      const parsed: Student[] = JSON.parse(saved);
      // 100% Data Preservation: Keep all existing user-saved students intact!
      const existingIds = new Set(parsed.map(s => s.id));
      const missing = CLASS_10_HUMANITIES_STUDENTS.filter(s => !existingIds.has(s.id));
      const merged = sortStudentsBySerial([...parsed, ...missing]);
      localStorage.setItem('school_students', JSON.stringify(merged));
      return merged;
    } catch {
      return sortStudentsBySerial(INITIAL_STUDENTS);
    }
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

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem('school_transactions');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_TRANSACTIONS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('school_transactions', JSON.stringify(transactions));
    } catch {}
  }, [transactions]);

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
    setTransactions(INITIAL_TRANSACTIONS);
    localStorage.setItem('school_transactions', JSON.stringify(INITIAL_TRANSACTIONS));
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

  const navScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [showAllMenuDropdown, setShowAllMenuDropdown] = useState(false);

  const checkNavScroll = () => {
    if (navScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = navScrollRef.current;
      setCanScrollLeft(scrollLeft > 6);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 6);
    }
  };

  useEffect(() => {
    const el = navScrollRef.current;
    if (el) {
      checkNavScroll();
      el.addEventListener('scroll', checkNavScroll, { passive: true });
      window.addEventListener('resize', checkNavScroll);
      return () => {
        el.removeEventListener('scroll', checkNavScroll);
        window.removeEventListener('resize', checkNavScroll);
      };
    }
  }, []);

  // Smooth scroll active tab into view whenever activeTab changes
  useEffect(() => {
    if (navScrollRef.current) {
      const activeEl = navScrollRef.current.querySelector('[data-active="true"]') as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', inline: 'nearest', block: 'nearest' });
      }
      setTimeout(checkNavScroll, 300);
    }
  }, [activeTab]);

  const handleNavScroll = (direction: 'left' | 'right') => {
    if (navScrollRef.current) {
      navScrollRef.current.scrollBy({
        left: direction === 'left' ? -280 : 280,
        behavior: 'smooth'
      });
      setTimeout(checkNavScroll, 320);
    }
  };

  const handleNavWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (navScrollRef.current && Math.abs(e.deltaY) > 0) {
      navScrollRef.current.scrollLeft += e.deltaY;
    }
  };

  const navTabsList = [
    { id: 'home', serial: '০১', label: language === 'bn' ? 'হোম' : 'Home', icon: Home, category: 'মূল প্রতিষ্ঠান ও পরিচিতি' },
    { id: 'about', serial: '০২', label: language === 'bn' ? 'আমাদের সম্পর্কে (বিস্তারিত বিবরণ)' : 'About Us', icon: Info, category: 'মূল প্রতিষ্ঠান ও পরিচিতি' },
    { id: 'committee', serial: '০৩', label: language === 'bn' ? 'বিদ্যালয় পরিচালনা কমিটি' : 'Managing Committee', icon: Award, category: 'মূল প্রতিষ্ঠান ও পরিচিতি' },
    { id: 'donors', serial: '০৪', label: language === 'bn' ? 'প্রতিষ্ঠাতা ও দাতা ফোরাম' : 'Founders & Donors', icon: HeartHandshake, category: 'মূল প্রতিষ্ঠান ও পরিচিতি' },
    { id: 'students', serial: '০৫', label: language === 'bn' ? 'শিক্ষার্থী তথ্য ডিরেক্টরি' : 'Students Directory', icon: GraduationCap, category: 'শিক্ষার্থী ও একাডেমিক' },
    { id: 'exams', serial: '০৬', label: language === 'bn' ? 'পরীক্ষা ও ফলাফল' : 'Exams & Results', icon: Award, category: 'শিক্ষার্থী ও একাডেমিক' },
    { id: 'assembly', serial: '০৭', label: language === 'bn' ? 'প্রাত্যহিক সমাবেশ ও শপথ' : 'Daily Assembly', icon: Sun, category: 'শিক্ষার্থী ও একাডেমিক' },
    { id: 'teachers', serial: '০৮', label: language === 'bn' ? 'শিক্ষক ফোরাম (শিক্ষকমণ্ডলী)' : "Teachers' Forum", icon: Users, category: 'শিক্ষক ও কর্মচারী ফোরাম' },
    { id: 'staff', serial: '০৯', label: language === 'bn' ? 'কর্মচারী তথ্য' : 'Staff Directory', icon: ShieldCheck, category: 'শিক্ষক ও কর্মচারী ফোরাম' },
    { id: 'attendance', serial: '১০', label: language === 'bn' ? 'দৈনিক ডিজিটাল হাজিরা' : 'Attendance', icon: UserCheck, category: 'প্রাত্যহিক কার্যক্রম ও প্রশাসন' },
    { id: 'banks', serial: '১১', label: language === 'bn' ? 'ফি ও আয়-ব্যয় হিসাব (ব্যাংক)' : 'Fees & Accounts', icon: Landmark, category: 'প্রাত্যহিক কার্যক্রম ও প্রশাসন' },
    { id: 'notices', serial: '১২', label: language === 'bn' ? 'নোটিশ বোর্ড' : 'Notice Board', icon: Bell, category: 'প্রাত্যহিক কার্যক্রম ও প্রশাসন' },
    { id: 'contact', serial: '১৩', label: language === 'bn' ? 'যোগাযোগ ও অবস্থান' : 'Contact', icon: Phone, category: 'প্রাত্যহিক কার্যক্রম ও প্রশাসন' },
    { id: 'parents', serial: '১৪', label: language === 'bn' ? 'অভিভাবকের কলাম' : "Parents' Column", icon: MessageCircle, category: 'অন্যান্য সেবা ও সুবিধা' },
    { id: 'gallery', serial: '১৫', label: language === 'bn' ? 'ফটো ও ভিডিও গ্যালারি' : 'Photo & Video Gallery', icon: ImageIcon, category: 'অন্যান্য সেবা ও সুবিধা' },
    { id: 'edulinks', serial: '১৬', label: language === 'bn' ? 'শিক্ষা মন্ত্রণালয় ও বোর্ড লিংক' : 'Edu Portal Links', icon: Globe, category: 'অন্যান্য সেবা ও সুবিধা' },
    { id: 'sms', serial: '১৭', label: language === 'bn' ? 'স্মার্ট SMS গেটওয়ে' : 'SMS Gateway', icon: MessageCircle, category: 'অন্যান্য সেবা ও সুবিধা' },
    { id: 'reports', serial: '১৮', label: language === 'bn' ? 'মাসিক ও বাৎসরিক রিপোর্ট' : 'Reports', icon: TrendingUp, category: 'অন্যান্য সেবা ও সুবিধা' },
    { id: 'excellence', serial: '১৯', label: language === 'bn' ? 'প্রশিক্ষণ ও মেধা বিকাশ' : 'Excellence Hub', icon: Sparkles, category: 'অন্যান্য সেবা ও সুবিধা' },
    { id: 'office', serial: '২০', label: language === 'bn' ? 'অফিস ডেস্ক ও ইনপুট' : 'Office Desk', icon: ShieldCheck, category: 'এডমিন ও ডাটা এন্ট্রি' },
    { id: 'ai', serial: '২১', label: language === 'bn' ? 'AI স্ক্যানার ও বাল্ক ডাটা' : 'AI Scanner & Bulk Import', icon: Sparkles, category: 'এডমিন ও ডাটা এন্ট্রি' }
  ];

  return (
    <div className="min-h-screen bg-[#f0f6f6] text-slate-900 flex flex-col font-sans selection:bg-[#0d3b66] selection:text-white">
      {/* HEADER */}
      <header className="bg-[#0c3664] text-white border-b-2 border-[#d9482b] sticky top-0 z-40 shadow-md">
        {/* Tier 1: Top Info Bar (Desktop only) */}
        <div className="bg-[#082545] border-b border-[#144275] text-slate-300 text-xs hidden md:block">
          <div className="max-w-7xl mx-auto px-4 h-9 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-slate-300 font-medium">
                {language === 'bn' ? 'ইআইআইএন: ১০৪০৬২' : 'EIIN: 104062'}
              </span>
              <span aria-hidden="true" className="text-slate-600">|</span>
              <button
                type="button"
                onClick={() => setActiveTab('edulinks')}
                className="flex items-center gap-1.5 text-[11px] text-amber-300 hover:text-white transition-colors bg-[#051c36] hover:bg-[#123e6e] px-2.5 py-1 rounded border border-[#1d4c82]"
                title="শিক্ষা মন্ত্রণালয় ও শিক্ষা বোর্ডের সরকারি ওয়েবসাইট ও পোর্টাল লিংক"
              >
                <Globe className="w-3.5 h-3.5 text-amber-300" />
                <span>{language === 'bn' ? 'শিক্ষা মন্ত্রণালয় ও বোর্ড পোর্টাল' : 'Ministry & Board Portal'}</span>
              </button>
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
        <div className="hidden md:flex max-w-7xl mx-auto px-4 min-h-[5.5rem] py-3 items-center justify-between gap-6">
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
                {/* 1. Admin Badge (Height 40px / h-10) */}
                <div className="h-10 flex items-center gap-2 bg-[#061d36] border border-amber-400/50 px-3 rounded-xl text-xs shadow-xs">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                  <div className="text-left hidden lg:block leading-tight">
                    <div className="text-[10px] text-amber-300 font-bold flex items-center gap-1">
                      <span>অথরাইজড এডমিন</span>
                      <span className="text-[9px] bg-amber-400/20 text-amber-200 px-1 py-0.5 rounded font-medium">{currentAdmin.roleName}</span>
                    </div>
                    <div className="text-white font-semibold text-xs truncate max-w-[125px]">
                      {currentAdmin.name}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAdminLoginModal(true)}
                    className="h-6 px-2 bg-[#144275] hover:bg-[#1d5796] text-amber-200 hover:text-white rounded-md text-[10px] font-bold transition-colors ml-0.5 shrink-0 flex items-center justify-center cursor-pointer"
                    title="অন্য কর্মকর্তার একাউন্টে সুইচ করুন"
                  >
                    {language === 'bn' ? 'সুইচ' : 'Switch'}
                  </button>
                </div>

                {/* 2. Office Desk Button (Directly next to Admin - Never overflows to the right) */}
                <button
                  type="button"
                  onClick={() => setActiveTab('office')}
                  className={`h-10 px-3.5 border rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer shrink-0 ${
                    activeTab === 'office'
                      ? 'bg-amber-400 text-slate-950 border-amber-300 font-extrabold shadow-sm ring-2 ring-amber-300/40'
                      : 'bg-[#144275] hover:bg-[#1d5796] border-blue-400/40 text-amber-200 hover:text-white'
                  }`}
                  title="এডমিন ইনপুট ও অফিস ডেস্ক (ডিফল্ট পিন: ১২৩৪)"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-300 shrink-0" />
                  <span>{language === 'bn' ? 'অফিস ডেস্ক' : 'Office Desk'}</span>
                </button>

                {/* 3. Users & Security Button (Height 40px / h-10) */}
                <button
                  type="button"
                  onClick={() => setShowAdminUsersModal(true)}
                  className="h-10 px-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 rounded-xl text-xs font-extrabold transition-all shadow-xs flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
                  title="এডমিন একাউন্ট যোগ, এডিট, ডিলিট ও পাসওয়ার্ড পরিবর্তন"
                >
                  <Users className="w-4 h-4 text-slate-950 shrink-0" />
                  <span className="hidden sm:inline">ইউজার ও সিকিউরিটি</span>
                </button>

                {/* 4. Apply Now / ভর্তি আবেদন Button (Height 40px / h-10) */}
                <button
                  type="button"
                  onClick={() => setShowAdmissionModal(true)}
                  className="h-10 px-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 border border-emerald-400/50 cursor-pointer active:scale-95 shrink-0"
                  title="নতুন শিক্ষার্থী অনলাইন ভর্তি আবেদন"
                >
                  <UserPlus className="w-4 h-4 text-white shrink-0" />
                  <span>{language === 'bn' ? 'ভর্তি আবেদন' : 'Apply Now'}</span>
                </button>

                {/* 5. Public View Button (Height 40px / h-10) */}
                <button
                  type="button"
                  onClick={handleAdminLogout}
                  className="h-10 px-3 bg-rose-700 hover:bg-rose-600 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 border border-rose-400/50 shrink-0 cursor-pointer"
                  title="এডমিন মোড বন্ধ করে সাধারণ দর্শক বা ভিজিটর হিসেবে ওয়েবসাইট দেখতে এখানে ক্লিক করুন"
                >
                  <Eye className="w-4 h-4 shrink-0" />
                  <span>পাবলিক ভিউ</span>
                  <LogOut className="w-3.5 h-3.5 text-rose-200 shrink-0" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {/* Public Mode Badge (Height 40px / h-10) */}
                <div className="h-10 flex items-center gap-1.5 bg-emerald-950/80 border border-emerald-400/50 text-emerald-300 px-3 rounded-xl text-xs font-medium shrink-0">
                  <Eye className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>পাবলিক মোড</span>
                </div>

                {/* Admin Login Button (Height 40px / h-10) */}
                <button
                  type="button"
                  onClick={() => {
                    setLoginPasswordInput('');
                    setLoginError('');
                    setShowAdminLoginModal(true);
                  }}
                  className="h-10 px-3.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 rounded-xl text-xs font-extrabold transition-all shadow-xs flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <Lock className="w-4 h-4 text-slate-950 shrink-0" />
                  <span>{language === 'bn' ? 'এডমিন লগইন' : 'Admin Login'}</span>
                </button>

                {/* Office Desk Button in Public Mode (Height 40px / h-10) */}
                <button
                  type="button"
                  onClick={() => setActiveTab('office')}
                  className={`h-10 px-3.5 border rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer shrink-0 ${
                    activeTab === 'office'
                      ? 'bg-amber-400 text-slate-950 border-amber-300 font-extrabold shadow-sm ring-2 ring-amber-300/40'
                      : 'bg-[#144275] hover:bg-[#1d5796] border-blue-400/40 text-amber-200 hover:text-white'
                  }`}
                  title="এডমিন ইনপুট ও অফিস ডেস্ক (ডিফল্ট পিন: ১২৩৪)"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-300 shrink-0" />
                  <span>{language === 'bn' ? 'অফিস ডেস্ক' : 'Office Desk'}</span>
                </button>

                {/* Apply Now Button in Public Mode (Height 40px / h-10) */}
                <button
                  type="button"
                  onClick={() => setShowAdmissionModal(true)}
                  className="h-10 px-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 border border-emerald-400/50 cursor-pointer active:scale-95 shrink-0"
                  title="নতুন শিক্ষার্থী অনলাইন ভর্তি আবেদন"
                >
                  <UserPlus className="w-4 h-4 text-white shrink-0" />
                  <span>{language === 'bn' ? 'ভর্তি আবেদন' : 'Apply Now'}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Dropdown Menu Drawer (Visible when isMobileMenuOpen is true) */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#07213d] border-b-2 border-amber-400 p-3 sm:p-4 space-y-4 animate-in slide-in-from-top duration-150 shadow-xl max-h-[85vh] overflow-y-auto">
            <div className="text-xs font-bold text-amber-300 uppercase tracking-wider pb-1.5 border-b border-[#144275] flex items-center justify-between">
              <span>মেনু ও প্রধান বিভাগসমূহ</span>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Group 1: প্রধান লিংকসমূহ */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold text-amber-400/90 flex items-center gap-1.5 px-1">
                <Home className="w-3.5 h-3.5" />
                <span>প্রধান সেবা ও হোম</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => { setActiveTab('home'); setIsMobileMenuOpen(false); }}
                  className={`flex items-center gap-2 p-2 rounded-xl text-xs font-bold transition-all text-left ${
                    activeTab === 'home' ? 'bg-[#d9482b] text-white shadow-xs' : 'bg-[#0c3664] text-slate-200 hover:bg-[#144275]'
                  }`}
                >
                  <Home className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  <span className="truncate">হোম</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveTab('attendance'); setIsMobileMenuOpen(false); }}
                  className={`flex items-center gap-2 p-2 rounded-xl text-xs font-bold transition-all text-left ${
                    activeTab === 'attendance' ? 'bg-[#d9482b] text-white shadow-xs' : 'bg-[#0c3664] text-slate-200 hover:bg-[#144275]'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  <span className="truncate">দৈনিক হাজিরা</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveTab('banks'); setIsMobileMenuOpen(false); }}
                  className={`flex items-center gap-2 p-2 rounded-xl text-xs font-bold transition-all text-left ${
                    activeTab === 'banks' ? 'bg-[#d9482b] text-white shadow-xs' : 'bg-[#0c3664] text-slate-200 hover:bg-[#144275]'
                  }`}
                >
                  <Landmark className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  <span className="truncate">আয়-ব্যয় হিসাব</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveTab('notices'); setIsMobileMenuOpen(false); }}
                  className={`flex items-center gap-2 p-2 rounded-xl text-xs font-bold transition-all text-left ${
                    activeTab === 'notices' ? 'bg-[#d9482b] text-white shadow-xs' : 'bg-[#0c3664] text-slate-200 hover:bg-[#144275]'
                  }`}
                >
                  <Bell className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  <span className="truncate">নোটিশ বোর্ড</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveTab('contact'); setIsMobileMenuOpen(false); }}
                  className={`flex items-center gap-2 p-2 rounded-xl text-xs font-bold transition-all text-left col-span-2 ${
                    activeTab === 'contact' ? 'bg-[#d9482b] text-white shadow-xs' : 'bg-[#0c3664] text-slate-200 hover:bg-[#144275]'
                  }`}
                >
                  <Phone className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  <span className="truncate">যোগাযোগ ও লোকেশন</span>
                </button>
              </div>
            </div>

            {/* Group 2: আমাদের সম্পর্কে (ড্রপডাউন সাব-আইটেমস) */}
            <div className="space-y-1.5 pt-2 border-t border-[#144275]/60">
              <div className="text-[11px] font-bold text-amber-400/90 flex items-center gap-1.5 px-1">
                <Info className="w-3.5 h-3.5" />
                <span>আমাদের সম্পর্কে (About Us)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('about');
                    setAboutInitialSection('overview');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 p-2 rounded-xl text-xs font-bold text-left transition-all ${
                    activeTab === 'about' && aboutInitialSection === 'overview'
                      ? 'bg-[#d9482b] text-white shadow-xs'
                      : 'bg-[#0c3664] text-slate-200 hover:bg-[#144275]'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  <span>বিস্তারিত বিবরণ ও ইতিহাস</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('about');
                    setAboutInitialSection('headmasters');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 p-2 rounded-xl text-xs font-bold text-left transition-all ${
                    activeTab === 'about' && aboutInitialSection === 'headmasters'
                      ? 'bg-[#d9482b] text-white shadow-xs ring-1 ring-amber-300'
                      : 'bg-[#0c3664] text-slate-200 hover:bg-[#144275]'
                  }`}
                >
                  <History className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  <span>১ম থেকে বর্তমান প্রধান শিক্ষকের তথ্যাবলী (সময়কাল)</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('committee');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 p-2 rounded-xl text-xs font-bold text-left transition-all ${
                    activeTab === 'committee' ? 'bg-[#d9482b] text-white shadow-xs' : 'bg-[#0c3664] text-slate-200 hover:bg-[#144275]'
                  }`}
                >
                  <Award className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  <span>বর্তমান বিদ্যালয় পরিচালনা কমিটি</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('donors');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 p-2 rounded-xl text-xs font-bold text-left transition-all ${
                    activeTab === 'donors' ? 'bg-[#d9482b] text-white shadow-xs' : 'bg-[#0c3664] text-slate-200 hover:bg-[#144275]'
                  }`}
                >
                  <HeartHandshake className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  <span>বিদ্যালয়ের প্রতিষ্ঠাতা ও দাতা তথ্য</span>
                </button>
              </div>
            </div>

            {/* Group 3: শিক্ষার্থী তথ্য */}
            <div className="space-y-1.5 pt-2 border-t border-[#144275]/60">
              <div className="text-[11px] font-bold text-amber-400/90 flex items-center gap-1.5 px-1">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>শিক্ষার্থী তথ্য ও কার্যক্রম</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setShowAdmissionModal(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 p-2 rounded-xl text-xs font-bold text-left bg-gradient-to-r from-emerald-700 to-teal-700 text-white shadow-xs"
                >
                  <UserPlus className="w-3.5 h-3.5 text-white shrink-0" />
                  <span>ভর্তির আবেদন</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('students');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 p-2 rounded-xl text-xs font-bold text-left transition-all ${
                    activeTab === 'students' ? 'bg-[#d9482b] text-white shadow-xs' : 'bg-[#0c3664] text-slate-200 hover:bg-[#144275]'
                  }`}
                >
                  <Users className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  <span>শিক্ষার্থী তালিকা</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('exams');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 p-2 rounded-xl text-xs font-bold text-left transition-all ${
                    activeTab === 'exams' ? 'bg-[#d9482b] text-white shadow-xs' : 'bg-[#0c3664] text-slate-200 hover:bg-[#144275]'
                  }`}
                >
                  <Award className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  <span>পরীক্ষা ও ফলাফল</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('assembly');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 p-2 rounded-xl text-xs font-bold text-left transition-all ${
                    activeTab === 'assembly' ? 'bg-[#d9482b] text-white shadow-xs' : 'bg-[#0c3664] text-slate-200 hover:bg-[#144275]'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  <span>প্রাত্যহিক সমাবেশ</span>
                </button>
              </div>
            </div>

            {/* Group 4: শিক্ষক ফোরাম ও কর্মী */}
            <div className="space-y-1.5 pt-2 border-t border-[#144275]/60">
              <div className="text-[11px] font-bold text-amber-400/90 flex items-center gap-1.5 px-1">
                <Users className="w-3.5 h-3.5" />
                <span>শিক্ষক ফোরাম ও কর্মচারী</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('teachers');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 p-2 rounded-xl text-xs font-bold text-left transition-all ${
                    activeTab === 'teachers' ? 'bg-[#d9482b] text-white shadow-xs' : 'bg-[#0c3664] text-slate-200 hover:bg-[#144275]'
                  }`}
                >
                  <Users className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  <span>শিক্ষক ফোরাম</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('staff');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 p-2 rounded-xl text-xs font-bold text-left transition-all ${
                    activeTab === 'staff' ? 'bg-[#d9482b] text-white shadow-xs' : 'bg-[#0c3664] text-slate-200 hover:bg-[#144275]'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  <span>কর্মচারী তথ্য</span>
                </button>
              </div>
            </div>

            {/* Group 5: সহশিক্ষা ও অন্যান্য সেবা */}
            <div className="space-y-1.5 pt-2 border-t border-[#144275]/60">
              <div className="text-[11px] font-bold text-amber-400/90 flex items-center gap-1.5 px-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>অন্যান্য সেবা ও সহশিক্ষা</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => { setActiveTab('parents'); setIsMobileMenuOpen(false); }}
                  className={`flex items-center gap-2 p-2 rounded-xl text-xs font-bold text-left transition-all ${
                    activeTab === 'parents' ? 'bg-[#d9482b] text-white shadow-xs' : 'bg-[#0c3664] text-slate-200 hover:bg-[#144275]'
                  }`}
                >
                  <MessageCircle className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  <span>অভিভাবকের কলাম</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveTab('gallery'); setIsMobileMenuOpen(false); }}
                  className={`flex items-center gap-2 p-2 rounded-xl text-xs font-bold text-left transition-all ${
                    activeTab === 'gallery' ? 'bg-[#d9482b] text-white shadow-xs' : 'bg-[#0c3664] text-slate-200 hover:bg-[#144275]'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  <span>ফটো ও ভিডিও গ্যালারি</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveTab('sms'); setIsMobileMenuOpen(false); }}
                  className={`flex items-center gap-2 p-2 rounded-xl text-xs font-bold text-left transition-all ${
                    activeTab === 'sms' ? 'bg-[#d9482b] text-white shadow-xs' : 'bg-[#0c3664] text-slate-200 hover:bg-[#144275]'
                  }`}
                >
                  <MessageCircle className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  <span>SMS গেটওয়ে</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveTab('edulinks'); setIsMobileMenuOpen(false); }}
                  className={`flex items-center gap-2 p-2 rounded-xl text-xs font-bold text-left transition-all ${
                    activeTab === 'edulinks' ? 'bg-[#d9482b] text-white shadow-xs' : 'bg-[#0c3664] text-slate-200 hover:bg-[#144275]'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  <span>শিক্ষা মন্ত্রণালয় পোর্টাল</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveTab('reports'); setIsMobileMenuOpen(false); }}
                  className={`flex items-center gap-2 p-2 rounded-xl text-xs font-bold text-left transition-all ${
                    activeTab === 'reports' ? 'bg-[#d9482b] text-white shadow-xs' : 'bg-[#0c3664] text-slate-200 hover:bg-[#144275]'
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  <span>প্রতিবেদন ও রিপোর্ট</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveTab('excellence'); setIsMobileMenuOpen(false); }}
                  className={`flex items-center gap-2 p-2 rounded-xl text-xs font-bold text-left transition-all ${
                    activeTab === 'excellence' ? 'bg-[#d9482b] text-white shadow-xs' : 'bg-[#0c3664] text-slate-200 hover:bg-[#144275]'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  <span>মেধা বিকাশ</span>
                </button>
              </div>
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

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('office');
                    setIsMobileMenuOpen(false);
                  }}
                  className="px-2.5 py-1 bg-[#144275] hover:bg-[#1d5796] text-amber-200 rounded-lg text-xs font-bold flex items-center gap-1 border border-blue-400/40"
                  title="অফিস ডেস্ক"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                  <span>অফিস ডেস্ক</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('ai');
                    setIsMobileMenuOpen(false);
                  }}
                  className="px-2.5 py-1 bg-[#061e38] hover:bg-[#0c3664] text-amber-300 rounded-lg text-xs font-bold flex items-center gap-1 border border-amber-400/40"
                  title="AI স্ক্যানার"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>AI স্ক্যানার</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tier 3: Hierarchical Structured Nav Bar with Rich Dropdowns & Controls */}
        <nav
          ref={navContainerRef}
          className="bg-[#092b50] border-t border-[#134377] w-full relative z-30 shadow-inner"
        >
          <div className="max-w-7xl mx-auto px-1 sm:px-2 py-1.5 w-full flex items-center gap-1 relative">
            
            {/* Left Scroll Button (For narrower screens) */}
            <button
              type="button"
              onClick={() => handleNavScroll('left')}
              disabled={!canScrollLeft}
              className={`shrink-0 w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg border transition-all ${
                canScrollLeft
                  ? 'bg-[#123e6e] hover:bg-[#1a5391] border-blue-400/40 text-amber-300 hover:text-white shadow-xs cursor-pointer active:scale-95'
                  : 'bg-[#061d36]/40 border-slate-700/40 text-slate-600 opacity-40 cursor-not-allowed'
              }`}
              title="মেনু বামে স্ক্রল করুন"
              aria-label="মেনু বামে স্ক্রল করুন"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Scrollable Container with the ordered main tabs and dropdowns */}
            <div className="relative flex-1 min-w-0 flex items-center">
              {canScrollLeft && (
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-[#092b50] to-transparent z-10"
                />
              )}

              <div
                ref={navScrollRef}
                onWheel={handleNavWheel}
                className="w-full flex items-center gap-1 sm:gap-1.5 overflow-x-auto scrollbar-none touch-pan-x scroll-smooth py-0.5 pr-2"
              >
                {/* 1. হোম (Home) */}
                <button
                  type="button"
                  data-active={activeTab === 'home' ? 'true' : undefined}
                  onClick={() => {
                    setActiveTab('home');
                    setActiveDropdown(null);
                  }}
                  className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-lg whitespace-nowrap transition-all text-xs font-semibold select-none ${
                    activeTab === 'home'
                      ? 'bg-[#d9482b] text-white font-bold shadow-xs ring-1 ring-white/20'
                      : 'text-slate-200 hover:text-white hover:bg-[#123e6e]'
                  }`}
                >
                  <Home className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'home' ? 'text-white' : 'text-amber-300'}`} />
                  <span>{language === 'bn' ? 'হোম' : 'Home'}</span>
                </button>

                {/* 2. আমাদের সম্পর্কে ▾ (About Us Dropdown) */}
                <button
                  type="button"
                  data-active={['about', 'committee', 'donors'].includes(activeTab) ? 'true' : undefined}
                  onClick={(e) => toggleDropdown('about', e)}
                  className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-lg whitespace-nowrap transition-all text-xs font-semibold select-none cursor-pointer ${
                    ['about', 'committee', 'donors'].includes(activeTab)
                      ? 'bg-[#d9482b] text-white font-bold shadow-xs ring-1 ring-white/20'
                      : activeDropdown === 'about'
                      ? 'bg-[#123e6e] text-amber-300 ring-2 ring-amber-400'
                      : 'text-slate-200 hover:text-white hover:bg-[#123e6e]'
                  }`}
                >
                  <Info className="w-3.5 h-3.5 shrink-0 text-amber-300" />
                  <span>{language === 'bn' ? 'আমাদের সম্পর্কে' : 'About Us'}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'about' ? 'rotate-180 text-amber-300' : 'text-slate-300'}`} />
                </button>

                {/* 3. শিক্ষার্থী তথ্য ▾ (Students Dropdown) */}
                <button
                  type="button"
                  data-active={['students', 'exams', 'assembly'].includes(activeTab) ? 'true' : undefined}
                  onClick={(e) => toggleDropdown('students', e)}
                  className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-lg whitespace-nowrap transition-all text-xs font-semibold select-none cursor-pointer ${
                    ['students', 'exams', 'assembly'].includes(activeTab)
                      ? 'bg-[#d9482b] text-white font-bold shadow-xs ring-1 ring-white/20'
                      : activeDropdown === 'students'
                      ? 'bg-[#123e6e] text-amber-300 ring-2 ring-amber-400'
                      : 'text-slate-200 hover:text-white hover:bg-[#123e6e]'
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5 shrink-0 text-amber-300" />
                  <span>{language === 'bn' ? 'শিক্ষার্থী তথ্য' : 'Student Info'}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'students' ? 'rotate-180 text-amber-300' : 'text-slate-300'}`} />
                </button>

                {/* 4. শিক্ষক ফোরাম ▾ (Faculty Dropdown) */}
                <button
                  type="button"
                  data-active={['teachers', 'staff'].includes(activeTab) ? 'true' : undefined}
                  onClick={(e) => toggleDropdown('teachers', e)}
                  className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-lg whitespace-nowrap transition-all text-xs font-semibold select-none cursor-pointer ${
                    ['teachers', 'staff'].includes(activeTab)
                      ? 'bg-[#d9482b] text-white font-bold shadow-xs ring-1 ring-white/20'
                      : activeDropdown === 'teachers'
                      ? 'bg-[#123e6e] text-amber-300 ring-2 ring-amber-400'
                      : 'text-slate-200 hover:text-white hover:bg-[#123e6e]'
                  }`}
                >
                  <Users className="w-3.5 h-3.5 shrink-0 text-amber-300" />
                  <span>{language === 'bn' ? 'শিক্ষক ফোরাম' : "Teachers' Forum"}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'teachers' ? 'rotate-180 text-amber-300' : 'text-slate-300'}`} />
                </button>

                {/* 5. দৈনিক হাজিরা (Daily Attendance - Direct Tab in Sequence) */}
                <button
                  type="button"
                  data-active={activeTab === 'attendance' ? 'true' : undefined}
                  onClick={() => {
                    setActiveTab('attendance');
                    setActiveDropdown(null);
                  }}
                  className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-lg whitespace-nowrap transition-all text-xs font-semibold select-none cursor-pointer ${
                    activeTab === 'attendance'
                      ? 'bg-[#d9482b] text-white font-bold shadow-xs ring-1 ring-white/20'
                      : 'text-slate-200 hover:text-white hover:bg-[#123e6e]'
                  }`}
                >
                  <UserCheck className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'attendance' ? 'text-white' : 'text-amber-300'}`} />
                  <span>{language === 'bn' ? 'দৈনিক হাজিরা' : 'Attendance'}</span>
                </button>

                {/* 6. আয়-ব্যয় হিসাব (Fees & Bank Dashboard) */}
                <button
                  type="button"
                  data-active={activeTab === 'banks' ? 'true' : undefined}
                  onClick={() => {
                    setActiveTab('banks');
                    setActiveDropdown(null);
                  }}
                  className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-lg whitespace-nowrap transition-all text-xs font-semibold select-none cursor-pointer ${
                    activeTab === 'banks'
                      ? 'bg-[#d9482b] text-white font-bold shadow-xs ring-1 ring-white/20'
                      : 'text-slate-200 hover:text-white hover:bg-[#123e6e]'
                  }`}
                >
                  <Landmark className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'banks' ? 'text-white' : 'text-amber-300'}`} />
                  <span>{language === 'bn' ? 'আয়-ব্যয় হিসাব' : 'Fees & Accounts'}</span>
                </button>

                {/* 7. নোটিশ বোর্ড (Notice Board) */}
                <button
                  type="button"
                  data-active={activeTab === 'notices' ? 'true' : undefined}
                  onClick={() => {
                    setActiveTab('notices');
                    setActiveDropdown(null);
                  }}
                  className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-lg whitespace-nowrap transition-all text-xs font-semibold select-none cursor-pointer ${
                    activeTab === 'notices'
                      ? 'bg-[#d9482b] text-white font-bold shadow-xs ring-1 ring-white/20'
                      : 'text-slate-200 hover:text-white hover:bg-[#123e6e]'
                  }`}
                >
                  <Bell className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'notices' ? 'text-white' : 'text-amber-300'}`} />
                  <span>{language === 'bn' ? 'নোটিশ বোর্ড' : 'Notice Board'}</span>
                </button>

                {/* 8. যোগাযোগ (Contact) */}
                <button
                  type="button"
                  data-active={activeTab === 'contact' ? 'true' : undefined}
                  onClick={() => {
                    setActiveTab('contact');
                    setActiveDropdown(null);
                  }}
                  className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-lg whitespace-nowrap transition-all text-xs font-semibold select-none cursor-pointer ${
                    activeTab === 'contact'
                      ? 'bg-[#d9482b] text-white font-bold shadow-xs ring-1 ring-white/20'
                      : 'text-slate-200 hover:text-white hover:bg-[#123e6e]'
                  }`}
                >
                  <Phone className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'contact' ? 'text-white' : 'text-amber-300'}`} />
                  <span>{language === 'bn' ? 'যোগাযোগ' : 'Contact'}</span>
                </button>

                {/* 9. অন্যান্য সেবা ▾ (More Dropdown) */}
                <button
                  type="button"
                  data-active={['parents', 'gallery', 'sms', 'edulinks', 'reports', 'excellence'].includes(activeTab) ? 'true' : undefined}
                  onClick={(e) => toggleDropdown('more', e)}
                  className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-lg whitespace-nowrap transition-all text-xs font-semibold select-none cursor-pointer ${
                    ['parents', 'gallery', 'sms', 'edulinks', 'reports', 'excellence'].includes(activeTab)
                      ? 'bg-[#d9482b] text-white font-bold shadow-xs ring-1 ring-white/20'
                      : activeDropdown === 'more'
                      ? 'bg-[#123e6e] text-amber-300 ring-2 ring-amber-400'
                      : 'text-slate-200 hover:text-white hover:bg-[#123e6e]'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 shrink-0 text-amber-300" />
                  <span>{language === 'bn' ? 'অন্যান্য সেবা' : 'More'}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'more' ? 'rotate-180 text-amber-300' : 'text-slate-300'}`} />
                </button>
              </div>

              {canScrollRight && (
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#092b50] to-transparent z-10"
                />
              )}
            </div>

            {/* Right Scroll Button */}
            <button
              type="button"
              onClick={() => handleNavScroll('right')}
              disabled={!canScrollRight}
              className={`shrink-0 w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg border transition-all ${
                canScrollRight
                  ? 'bg-[#123e6e] hover:bg-[#1a5391] border-amber-400/50 text-amber-300 hover:text-white shadow-xs cursor-pointer active:scale-95'
                  : 'bg-[#061d36]/40 border-slate-700/40 text-slate-600 opacity-40 cursor-not-allowed'
              }`}
              title="মেনু ডানে স্ক্রল করুন"
              aria-label="মেনু ডানে স্ক্রল করুন"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* All Menus Dropdown Quick Button */}
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => {
                  setShowAllMenuDropdown(!showAllMenuDropdown);
                  setActiveDropdown(null);
                }}
                className={`flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                  showAllMenuDropdown
                    ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-sm'
                    : 'bg-[#061d36] hover:bg-[#123e6e] text-amber-300 hover:text-white border-[#1d4c82]'
                }`}
                title="সকল ১৯টি মেনুর তালিকা দেখুন"
              >
                <LayoutGrid className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="hidden xl:inline">{language === 'bn' ? 'সকল মেনু' : 'All Menus'}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${showAllMenuDropdown ? 'rotate-180' : ''}`} />
              </button>

              {/* All Menus Dropdown Popover */}
              {showAllMenuDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-2xs"
                    onClick={() => setShowAllMenuDropdown(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-[340px] sm:w-[500px] max-h-[82vh] overflow-y-auto bg-[#07213d] border-2 border-amber-400 rounded-2xl shadow-2xl z-50 p-3 sm:p-4 animate-in fade-in zoom-in-95 duration-150 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-[#144275]">
                      <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wide">
                        <LayoutGrid className="w-4 h-4 text-amber-400" />
                        <span>{language === 'bn' ? 'সকল ২১টি মেনুর ধারাবাহিক তালিকা' : 'Complete Menu (1 to 21)'}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowAllMenuDropdown(false)}
                        className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-[#144275] cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Department Section Blocks with strict serial order */}
                    {['মূল প্রতিষ্ঠান ও পরিচিতি', 'শিক্ষার্থী ও একাডেমিক', 'শিক্ষক ও কর্মচারী ফোরাম', 'প্রাত্যহিক কার্যক্রম ও প্রশাসন', 'অন্যান্য সেবা ও সুবিধা', 'এডমিন ও ডাটা এন্ট্রি'].map((catName) => {
                      const itemsInCat = navTabsList.filter(t => t.category === catName);
                      if (itemsInCat.length === 0) return null;
                      return (
                        <div key={catName} className="space-y-1.5">
                          <div className="text-[11px] font-bold text-amber-300/90 bg-[#092b52] px-2.5 py-1 rounded-lg border-l-3 border-amber-400 flex items-center justify-between">
                            <span>{catName}</span>
                            <span className="text-[10px] text-amber-200/70 font-mono font-semibold">
                              ক্রমিক {itemsInCat[0].serial} - {itemsInCat[itemsInCat.length - 1].serial}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                            {itemsInCat.map((tab) => {
                              const Icon = tab.icon;
                              const isActive = activeTab === tab.id;
                              return (
                                <button
                                  key={tab.id}
                                  type="button"
                                  onClick={() => {
                                    setActiveTab(tab.id as NavTab);
                                    setShowAllMenuDropdown(false);
                                  }}
                                  className={`flex items-center gap-2 p-2 rounded-xl text-xs font-semibold text-left transition-all cursor-pointer ${
                                    isActive
                                      ? 'bg-[#d9482b] text-white shadow-xs font-bold ring-1 ring-amber-300'
                                      : 'bg-[#0c3664] hover:bg-[#144275] text-slate-200 hover:text-white'
                                  }`}
                                >
                                  <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded-md bg-[#051c36] text-amber-300 border border-amber-400/30 shrink-0">
                                    {tab.serial}
                                  </span>
                                  <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-amber-300'}`} />
                                  <span className="truncate">{tab.label}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Floating Dropdown Popover (Attached outside overflow container so it is NEVER clipped) */}
            {activeDropdown && (
              <>
                <div
                  className="fixed inset-0 z-40 bg-black/25 backdrop-blur-2xs"
                  onClick={() => setActiveDropdown(null)}
                />

                <div
                  style={{
                    position: 'fixed',
                    top: `${dropdownCoords.top}px`,
                    left: `${dropdownCoords.left}px`,
                    width: '330px',
                    maxWidth: 'calc(100vw - 24px)'
                  }}
                  className="z-50 bg-[#07213d] border-2 border-amber-400 rounded-2xl shadow-2xl p-2.5 animate-in fade-in zoom-in-95 duration-150 space-y-1"
                >
                  {/* Dropdown 1: আমাদের সম্পর্কে */}
                  {activeDropdown === 'about' && (
                    <>
                      <div className="flex items-center justify-between pb-1.5 mb-1 border-b border-[#144275] px-1">
                        <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wide flex items-center gap-1.5">
                          <Info className="w-3.5 h-3.5 text-amber-300" />
                          <span>আমাদের সম্পর্কে মেনু</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => setActiveDropdown(null)}
                          className="text-slate-400 hover:text-white p-0.5 rounded cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('about');
                          setAboutInitialSection('overview');
                          setActiveDropdown(null);
                        }}
                        className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-xs text-left transition-all cursor-pointer ${
                          activeTab === 'about' && aboutInitialSection === 'overview'
                            ? 'bg-[#d9482b] text-white font-bold shadow-xs'
                            : 'hover:bg-[#144275] text-slate-200 hover:text-white'
                        }`}
                      >
                        <BookOpen className="w-4 h-4 text-amber-300 shrink-0" />
                        <div>
                          <div className="font-bold">📖 বিস্তারিত বিবরণ ও পরিচিতি</div>
                          <div className="text-[10px] text-slate-300">বিদ্যালয়ের ইতিহাস, ঐতিহ্য ও অবকাঠামো</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('about');
                          setAboutInitialSection('headmasters');
                          setActiveDropdown(null);
                        }}
                        className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-xs text-left transition-all cursor-pointer ${
                          activeTab === 'about' && aboutInitialSection === 'headmasters'
                            ? 'bg-[#d9482b] text-white font-bold shadow-xs ring-1 ring-amber-300'
                            : 'hover:bg-[#144275] text-slate-200 hover:text-white'
                        }`}
                      >
                        <History className="w-4 h-4 text-amber-300 shrink-0" />
                        <div>
                          <div className="font-bold flex items-center gap-1.5">
                            <span>📜 ১ম থেকে বর্তমান প্রধান শিক্ষকের তথ্যাবলী</span>
                            <span className="text-[9px] bg-amber-400 text-slate-950 px-1 rounded font-bold font-mono">সময়কাল</span>
                          </div>
                          <div className="text-[10px] text-slate-300">১৯৬৪ সাল থেকে বর্তমান পর্যন্ত প্রধান শিক্ষকগণের ইতিহাস</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('committee');
                          setActiveDropdown(null);
                        }}
                        className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-xs text-left transition-all cursor-pointer ${
                          activeTab === 'committee'
                            ? 'bg-[#d9482b] text-white font-bold shadow-xs'
                            : 'hover:bg-[#144275] text-slate-200 hover:text-white'
                        }`}
                      >
                        <Award className="w-4 h-4 text-amber-300 shrink-0" />
                        <div>
                          <div className="font-bold">🎖️ বর্তমান বিদ্যালয় পরিচালনা কমিটি</div>
                          <div className="text-[10px] text-slate-300">সভাপতি ও সম্মানিত পরিচালনা পর্ষদ</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('donors');
                          setActiveDropdown(null);
                        }}
                        className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-xs text-left transition-all cursor-pointer ${
                          activeTab === 'donors'
                            ? 'bg-[#d9482b] text-white font-bold shadow-xs'
                            : 'hover:bg-[#144275] text-slate-200 hover:text-white'
                        }`}
                      >
                        <HeartHandshake className="w-4 h-4 text-amber-300 shrink-0" />
                        <div>
                          <div className="font-bold">🤝 বিদ্যালয়ের দাতা ও প্রতিষ্ঠাতা তথ্য</div>
                          <div className="text-[10px] text-slate-300">ভূমিদাতা, আজীবন দাতা ও প্রতিষ্ঠাতাদের তালিকা</div>
                        </div>
                      </button>
                    </>
                  )}

                  {/* Dropdown 2: শিক্ষার্থী তথ্য */}
                  {activeDropdown === 'students' && (
                    <>
                      <div className="flex items-center justify-between pb-1.5 mb-1 border-b border-[#144275] px-1">
                        <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wide flex items-center gap-1.5">
                          <GraduationCap className="w-3.5 h-3.5 text-amber-300" />
                          <span>শিক্ষার্থী তথ্য ও ভর্তি</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => setActiveDropdown(null)}
                          className="text-slate-400 hover:text-white p-0.5 rounded cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setShowAdmissionModal(true);
                          setActiveDropdown(null);
                        }}
                        className="w-full flex items-center justify-between p-2 rounded-xl text-xs text-left bg-gradient-to-r from-emerald-800 to-teal-800 hover:from-emerald-700 hover:to-teal-700 text-white font-bold shadow-xs transition-all cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <UserPlus className="w-4 h-4 text-emerald-300 shrink-0" />
                          <div>
                            <div className="font-bold">📝 ভর্তির আবেদন (অনলাইন)</div>
                            <div className="text-[10px] text-emerald-200">৬ষ্ঠ থেকে ৯ম শ্রেণির ভর্তি ফরম</div>
                          </div>
                        </div>
                        <span className="text-[9px] bg-emerald-500 text-white px-1.5 py-0.5 rounded-full font-bold">উন্মুক্ত</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('students');
                          setActiveDropdown(null);
                        }}
                        className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-xs text-left transition-all cursor-pointer ${
                          activeTab === 'students'
                            ? 'bg-[#d9482b] text-white font-bold shadow-xs'
                            : 'hover:bg-[#144275] text-slate-200 hover:text-white'
                        }`}
                      >
                        <Users className="w-4 h-4 text-amber-300 shrink-0" />
                        <div>
                          <div className="font-bold">👥 শিক্ষার্থী তালিকা ও ডিরেক্টরি</div>
                          <div className="text-[10px] text-slate-300">৬ষ্ঠ থেকে ১০ম শ্রেণি, শাখা ক-ঘ ও বিভাগ</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('exams');
                          setActiveDropdown(null);
                        }}
                        className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-xs text-left transition-all cursor-pointer ${
                          activeTab === 'exams'
                            ? 'bg-[#d9482b] text-white font-bold shadow-xs'
                            : 'hover:bg-[#144275] text-slate-200 hover:text-white'
                        }`}
                      >
                        <Award className="w-4 h-4 text-amber-300 shrink-0" />
                        <div>
                          <div className="font-bold">📊 পরীক্ষা ও ফলাফল</div>
                          <div className="text-[10px] text-slate-300">নম্বর ফর্দ, টেবুলেশন ও প্রবেশপত্র</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('attendance');
                          setActiveDropdown(null);
                        }}
                        className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-xs text-left transition-all cursor-pointer ${
                          activeTab === 'attendance'
                            ? 'bg-[#d9482b] text-white font-bold shadow-xs'
                            : 'hover:bg-[#144275] text-slate-200 hover:text-white'
                        }`}
                      >
                        <UserCheck className="w-4 h-4 text-amber-300 shrink-0" />
                        <div>
                          <div className="font-bold">⏱️ দৈনিক হাজিরা পোর্টাল</div>
                          <div className="text-[10px] text-slate-300">ডিজিটাল উপস্থিতি ও SMS সংরক্ষণ</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('assembly');
                          setActiveDropdown(null);
                        }}
                        className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-xs text-left transition-all cursor-pointer ${
                          activeTab === 'assembly'
                            ? 'bg-[#d9482b] text-white font-bold shadow-xs'
                            : 'hover:bg-[#144275] text-slate-200 hover:text-white'
                        }`}
                      >
                        <Sun className="w-4 h-4 text-amber-300 shrink-0" />
                        <div>
                          <div className="font-bold">🌅 প্রাত্যহিক সমাবেশ ও শপথ</div>
                          <div className="text-[10px] text-slate-300">জাতীয় সংগীত, শপথ ও সাপ্তাহিক রুটিন</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('ai');
                          setActiveDropdown(null);
                        }}
                        className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-xs text-left transition-all cursor-pointer ${
                          activeTab === 'ai'
                            ? 'bg-[#d9482b] text-white font-bold shadow-xs'
                            : 'hover:bg-[#144275] text-slate-200 hover:text-white'
                        }`}
                      >
                        <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
                        <div>
                          <div className="font-bold flex items-center gap-1.5">
                            <span>🤖 AI স্ক্যানার ও বাল্ক ডাটা ইম্পোর্ট</span>
                            <span className="text-[9px] bg-amber-400 text-slate-950 px-1 rounded font-bold">স্মার্ট</span>
                          </div>
                          <div className="text-[10px] text-slate-300">ছবি/পিডিএফ বা তালিকা দিয়ে বাল্ক শিক্ষার্থী এন্ট্রি</div>
                        </div>
                      </button>
                    </>
                  )}

                  {/* Dropdown 3: শিক্ষক ফোরাম */}
                  {activeDropdown === 'teachers' && (
                    <>
                      <div className="flex items-center justify-between pb-1.5 mb-1 border-b border-[#144275] px-1">
                        <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wide flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-amber-300" />
                          <span>শিক্ষক ফোরাম ও কর্মচারী</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => setActiveDropdown(null)}
                          className="text-slate-400 hover:text-white p-0.5 rounded cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('teachers');
                          setActiveDropdown(null);
                        }}
                        className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-xs text-left transition-all cursor-pointer ${
                          activeTab === 'teachers'
                            ? 'bg-[#d9482b] text-white font-bold shadow-xs'
                            : 'hover:bg-[#144275] text-slate-200 hover:text-white'
                        }`}
                      >
                        <Users className="w-4 h-4 text-amber-300 shrink-0" />
                        <div>
                          <div className="font-bold">👨‍🏫 শিক্ষক ফোরাম ও পরিষদ</div>
                          <div className="text-[10px] text-slate-300">শিক্ষকগণের পরিচিতি, পদবি ও দায়িত্ব</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('staff');
                          setActiveDropdown(null);
                        }}
                        className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-xs text-left transition-all cursor-pointer ${
                          activeTab === 'staff'
                            ? 'bg-[#d9482b] text-white font-bold shadow-xs'
                            : 'hover:bg-[#144275] text-slate-200 hover:text-white'
                        }`}
                      >
                        <ShieldCheck className="w-4 h-4 text-amber-300 shrink-0" />
                        <div>
                          <div className="font-bold">🛡️ কর্মচারী তথ্য ডিরেক্টরি</div>
                          <div className="text-[10px] text-slate-300">অফিস সহকারী ও সহায়ক কর্মচারীবৃন্দ</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('office');
                          setActiveDropdown(null);
                        }}
                        className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-xs text-left transition-all cursor-pointer ${
                          activeTab === 'office'
                            ? 'bg-[#d9482b] text-white font-bold shadow-xs'
                            : 'hover:bg-[#144275] text-slate-200 hover:text-white'
                        }`}
                      >
                        <ShieldCheck className="w-4 h-4 text-amber-300 shrink-0" />
                        <div>
                          <div className="font-bold flex items-center gap-1.5">
                            <span>🏢 অফিস ডেস্ক ও ইনপুট প্যানেল</span>
                            <span className="text-[9px] bg-blue-500 text-white px-1 rounded font-bold">এডমিন</span>
                          </div>
                          <div className="text-[10px] text-slate-300">শিক্ষার্থী, নম্বর, ফি ও নোটিশ প্রশাসনিক এন্ট্রি</div>
                        </div>
                      </button>
                    </>
                  )}

                  {/* Dropdown 4: অন্যান্য সেবা */}
                  {activeDropdown === 'more' && (
                    <>
                      <div className="flex items-center justify-between pb-1.5 mb-1 border-b border-[#144275] px-1">
                        <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wide flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                          <span>অন্যান্য সেবা ও সহশিক্ষা</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => setActiveDropdown(null)}
                          className="text-slate-400 hover:text-white p-0.5 rounded cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('parents');
                          setActiveDropdown(null);
                        }}
                        className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-xs text-left transition-all cursor-pointer ${
                          activeTab === 'parents' ? 'bg-[#d9482b] text-white font-bold shadow-xs' : 'hover:bg-[#144275] text-slate-200 hover:text-white'
                        }`}
                      >
                        <MessageCircle className="w-4 h-4 text-amber-300 shrink-0" />
                        <div>
                          <div className="font-bold">💬 অভিভাবকের কলাম</div>
                          <div className="text-[10px] text-slate-300">মতামত, পরামর্শ ও গঠনমূলক প্রতিক্রিয়া</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('gallery');
                          setActiveDropdown(null);
                        }}
                        className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-xs text-left transition-all cursor-pointer ${
                          activeTab === 'gallery' ? 'bg-[#d9482b] text-white font-bold shadow-xs' : 'hover:bg-[#144275] text-slate-200 hover:text-white'
                        }`}
                      >
                        <ImageIcon className="w-4 h-4 text-amber-300 shrink-0" />
                        <div>
                          <div className="font-bold">📸 ফটো ও ভিডিও গ্যালারি</div>
                          <div className="text-[10px] text-slate-300">বার্ষিক ক্রীড়া, সাংস্কৃতিক উৎসব ও স্মৃতি</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('sms');
                          setActiveDropdown(null);
                        }}
                        className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-xs text-left transition-all cursor-pointer ${
                          activeTab === 'sms' ? 'bg-[#d9482b] text-white font-bold shadow-xs' : 'hover:bg-[#144275] text-slate-200 hover:text-white'
                        }`}
                      >
                        <MessageCircle className="w-4 h-4 text-amber-300 shrink-0" />
                        <div>
                          <div className="font-bold">📱 SMS নোটিফিকেশন গেটওয়ে</div>
                          <div className="text-[10px] text-slate-300">অভিভাবকদের জরুরি বার্তা ও নোটিশ প্রেরণ</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('edulinks');
                          setActiveDropdown(null);
                        }}
                        className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-xs text-left transition-all cursor-pointer ${
                          activeTab === 'edulinks' ? 'bg-[#d9482b] text-white font-bold shadow-xs' : 'hover:bg-[#144275] text-slate-200 hover:text-white'
                        }`}
                      >
                        <Globe className="w-4 h-4 text-amber-300 shrink-0" />
                        <div>
                          <div className="font-bold">🌐 শিক্ষা মন্ত্রণালয় ও বোর্ড লিংক</div>
                          <div className="text-[10px] text-slate-300">সরকারি সার্কুলার ও পোর্টাল সংযোগ</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('reports');
                          setActiveDropdown(null);
                        }}
                        className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-xs text-left transition-all cursor-pointer ${
                          activeTab === 'reports' ? 'bg-[#d9482b] text-white font-bold shadow-xs' : 'hover:bg-[#144275] text-slate-200 hover:text-white'
                        }`}
                      >
                        <TrendingUp className="w-4 h-4 text-amber-300 shrink-0" />
                        <div>
                          <div className="font-bold">📈 মাসিক ও বাৎসরিক রিপোর্ট</div>
                          <div className="text-[10px] text-slate-300">উপস্থিতি, ফি ও প্রাতিষ্ঠানিক পরিসংখ্যান</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('excellence');
                          setActiveDropdown(null);
                        }}
                        className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-xs text-left transition-all cursor-pointer ${
                          activeTab === 'excellence' ? 'bg-[#d9482b] text-white font-bold shadow-xs' : 'hover:bg-[#144275] text-slate-200 hover:text-white'
                        }`}
                      >
                        <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
                        <div>
                          <div className="font-bold">✨ প্রশিক্ষণ ও মেধা বিকাশ</div>
                          <div className="text-[10px] text-slate-300">আইসিটি স্কিল ও বিশেষ উৎকর্ষ কেন্দ্র</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('office');
                          setActiveDropdown(null);
                        }}
                        className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-xs text-left transition-all cursor-pointer ${
                          activeTab === 'office' ? 'bg-[#d9482b] text-white font-bold shadow-xs' : 'hover:bg-[#144275] text-slate-200 hover:text-white'
                        }`}
                      >
                        <ShieldCheck className="w-4 h-4 text-amber-300 shrink-0" />
                        <div>
                          <div className="font-bold flex items-center gap-1.5">
                            <span>🏢 অফিস ডেস্ক ও এডমিন প্যানেল</span>
                            <span className="text-[9px] bg-blue-500 text-white px-1 rounded font-bold">এডমিন</span>
                          </div>
                          <div className="text-[10px] text-slate-300">সকল দাপ্তরিক তথ্য এন্ট্রি ও পরিচালনা কেন্দ্র</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('ai');
                          setActiveDropdown(null);
                        }}
                        className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-xs text-left transition-all cursor-pointer ${
                          activeTab === 'ai' ? 'bg-[#d9482b] text-white font-bold shadow-xs' : 'hover:bg-[#144275] text-slate-200 hover:text-white'
                        }`}
                      >
                        <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
                        <div>
                          <div className="font-bold flex items-center gap-1.5">
                            <span>🤖 AI স্ক্যানার ও বাল্ক ডাটা হাব</span>
                            <span className="text-[9px] bg-amber-400 text-slate-950 px-1 rounded font-bold">স্মার্ট</span>
                          </div>
                          <div className="text-[10px] text-slate-300">ব্যাংক স্টেটমেন্ট ও শিক্ষার্থী বাল্ক অটো-সিঙ্ক</div>
                        </div>
                      </button>
                    </>
                  )}
                </div>
              </>
            )}

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
      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 flex-1 w-full max-w-full overflow-hidden space-y-6">
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
                    activeTab === 'parents' ? 'অভিভাবকের কলাম' :
                    activeTab === 'edulinks' ? 'শিক্ষা লিংক' :
                    activeTab === 'banks' ? 'ফি ও আয়-ব্যয় হিসাব (ক্যাশ বুক ও ব্যাংক ড্যাশবোর্ড)' :
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
            initialSection={aboutInitialSection}
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
            onNavigateToAttendance={() => setActiveTab('attendance')}
            onNavigateToExams={() => setActiveTab('exams')}
            onNavigateToFees={() => setActiveTab('banks')}
          />
        )}

        {activeTab === 'assembly' && (
          <DailyAssemblyTab
            language={language}
            isAdmin={!!currentAdmin}
            currentAdmin={currentAdmin}
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
            setStudents={setStudents}
            isAdmin={!!currentAdmin}
            onRequireAdminLogin={() => {
              setLoginPasswordInput('');
              setLoginError('');
              setShowAdminLoginModal(true);
            }}
          />
        )}

        {activeTab === 'sms' && (
          <SmsGatewayTab
            students={students}
            teachers={teachers}
            staffList={staffList}
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
            isAdmin={!!currentAdmin}
            transactions={transactions}
            setTransactions={setTransactions}
            onOpenSlip={(stu) => {
              setSelectedStudentForSlip(stu);
              setShowSlipModal(true);
            }}
            onRequireAdminLogin={() => {
              setLoginPasswordInput('');
              setLoginError('');
              setShowAdminLoginModal(true);
            }}
          />
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
            onNavigateToAiScanner={() => setActiveTab('ai')}
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
                  <div className="text-xs text-amber-300 italic font-semibold mb-0.5">"পড় স্রষ্টার নামে"</div>
                  <div className="font-bold text-base text-white leading-tight">নাপোড়া শেখেরখীল উচ্চ বিদ্যালয়</div>
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
                  {language === 'bn' ? 'ফটো ও ভিডিও গ্যালারি' : 'Gallery'}
                </button>
                <button type="button" onClick={() => setActiveTab('parents')} className="hover:text-white text-left">
                  {language === 'bn' ? 'অভিভাবকের কলাম' : "Parents' Column"}
                </button>
                <button type="button" onClick={() => setActiveTab('notices')} className="hover:text-white text-left">
                  {language === 'bn' ? 'নোটিশ বোর্ড' : 'Notices'}
                </button>
                <button type="button" onClick={() => setActiveTab('edulinks')} className="hover:text-amber-300 text-left font-bold text-amber-200">
                  {language === 'bn' ? 'শিক্ষা মন্ত্রণালয় ও বোর্ড লিংক' : 'Edu Ministry Links'}
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
          isAdmin={!!currentAdmin}
          onUpdateFeeMonths={(studentId, updatedMonths) => {
            const updated = students.map(s => {
              if (s.id === studentId) {
                return {
                  ...s,
                  feeMonths: updatedMonths,
                  status: (updatedMonths.length >= 10 ? 'paid' : 'due') as 'paid' | 'due'
                };
              }
              return s;
            });
            setStudents(updated);
            try {
              localStorage.setItem('school_students', JSON.stringify(updated));
            } catch {}
          }}
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
