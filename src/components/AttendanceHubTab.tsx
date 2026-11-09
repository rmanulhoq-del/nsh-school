import React, { useState, useEffect } from 'react';
import {
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Printer,
  Users,
  Send,
  UserCheck,
  Check,
  AlertCircle,
  Search,
  Filter,
  Save,
  FileSpreadsheet,
  QrCode,
  Smartphone,
  Sparkles,
  X,
  ExternalLink
} from 'lucide-react';
import { Student, Teacher, StaffMember, sortStudentsBySerial } from '../types';
import SchoolLogo from './SchoolLogo';

interface AttendanceHubTabProps {
  students: Student[];
  teachers: Teacher[];
  staffList: StaffMember[];
  isAdmin: boolean;
  onNavigateToSms?: (prefillNote?: string) => void;
}

type AttendanceStatus = 'present' | 'absent' | 'late' | 'leave';

export default function AttendanceHubTab({
  students,
  teachers,
  staffList,
  isAdmin,
  onNavigateToSms
}: AttendanceHubTabProps) {
  const [activeSubTab, setActiveSubTab] = useState<'students' | 'staff'>('students');
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [selectedClass, setSelectedClass] = useState<string>('6');
  const [selectedSection, setSelectedSection] = useState<string>('A');
  const [selectedGender, setSelectedGender] = useState<'all' | 'male' | 'female'>('all');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [studentSearch, setStudentSearch] = useState<string>('');
  const [staffSearch, setStaffSearch] = useState<string>('');

  const isNineOrTen = selectedClass === '9' || selectedClass === '10';

  // Student Attendance Records: Key = date_class_section[_group], Value = Record<studentId, AttendanceStatus>
  const [studentAttendance, setStudentAttendance] = useState<Record<string, AttendanceStatus>>(() => {
    try {
      const storageKey = isNineOrTen && selectedGroup !== 'all'
        ? `attendance_students_${selectedDate}_${selectedClass}_${selectedSection}_${selectedGroup}`
        : `attendance_students_${selectedDate}_${selectedClass}_${selectedSection}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {};
  });

  // Staff Attendance Records: Key = date, Value = Record<staffId, { status: AttendanceStatus; inTime: string; outTime: string }>
  const [staffAttendance, setStaffAttendance] = useState<Record<string, { status: AttendanceStatus; inTime: string; outTime: string }>>(() => {
    try {
      const saved = localStorage.getItem(`attendance_staff_${selectedDate}`);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {};
  });

  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string>('');
  const [showQrModal, setShowQrModal] = useState<boolean>(false);
  const [simulatedStaffId, setSimulatedStaffId] = useState<string>('');
  const [qrFeedbackMsg, setQrFeedbackMsg] = useState<string>('');

  // Reload student attendance on class/section/group/date change
  useEffect(() => {
    const storageKey = isNineOrTen && selectedGroup !== 'all'
      ? `attendance_students_${selectedDate}_${selectedClass}_${selectedSection}_${selectedGroup}`
      : `attendance_students_${selectedDate}_${selectedClass}_${selectedSection}`;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setStudentAttendance(JSON.parse(saved));
      } else {
        // Default: mark everyone present for convenience
        const defaults: Record<string, AttendanceStatus> = {};
        students
          .filter(s => {
            if (s.className !== selectedClass || s.section !== selectedSection) return false;
            if (isNineOrTen && selectedGroup !== 'all' && s.group !== selectedGroup) return false;
            return true;
          })
          .forEach(s => {
            defaults[s.id] = 'present';
          });
        setStudentAttendance(defaults);
      }
    } catch {
      setStudentAttendance({});
    }
  }, [selectedDate, selectedClass, selectedSection, selectedGroup, isNineOrTen, students]);

  // Reload staff attendance on date change
  useEffect(() => {
    const key = `attendance_staff_${selectedDate}`;
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        setStaffAttendance(JSON.parse(saved));
      } else {
        const defaults: Record<string, { status: AttendanceStatus; inTime: string; outTime: string }> = {};
        [...teachers, ...staffList].forEach(person => {
          defaults[person.id] = { status: 'present', inTime: '০৮:৪৫ সকাল', outTime: '০৪:১৫ বিকাল' };
        });
        setStaffAttendance(defaults);
      }
    } catch {
      setStaffAttendance({});
    }
  }, [selectedDate, teachers, staffList]);

  // Filter current roster
  const currentClassStudents = sortStudentsBySerial(
    students
      .filter(s => {
        if (s.className !== selectedClass || s.section !== selectedSection) return false;
        if (selectedGender !== 'all' && s.gender !== selectedGender) return false;
        if (isNineOrTen && selectedGroup !== 'all' && s.group !== selectedGroup) return false;
        return true;
      })
      .filter(s => {
        if (!studentSearch.trim()) return true;
        const q = studentSearch.toLowerCase();
        return (
          s.name.toLowerCase().includes(q) ||
          s.roll.toString().includes(q) ||
          s.id.toLowerCase().includes(q)
        );
      })
  );

  // Stats calculation
  const totalRoster = currentClassStudents.length;
  const presentCount = currentClassStudents.filter(s => (studentAttendance[s.id] || 'present') === 'present').length;
  const absentCount = currentClassStudents.filter(s => studentAttendance[s.id] === 'absent').length;
  const lateCount = currentClassStudents.filter(s => studentAttendance[s.id] === 'late').length;
  const leaveCount = currentClassStudents.filter(s => studentAttendance[s.id] === 'leave').length;
  const attendanceRate = totalRoster > 0 ? Math.round(((presentCount + lateCount) / totalRoster) * 100) : 100;

  const handleSetStudentStatus = (studentId: string, status: AttendanceStatus) => {
    const updated = { ...studentAttendance, [studentId]: status };
    setStudentAttendance(updated);
    try {
      localStorage.setItem(`attendance_students_${selectedDate}_${selectedClass}_${selectedSection}`, JSON.stringify(updated));
    } catch {}
  };

  const handleMarkAllStudents = (status: AttendanceStatus) => {
    const updated = { ...studentAttendance };
    currentClassStudents.forEach(s => {
      updated[s.id] = status;
    });
    setStudentAttendance(updated);
    try {
      localStorage.setItem(`attendance_students_${selectedDate}_${selectedClass}_${selectedSection}`, JSON.stringify(updated));
      setSaveSuccessMsg(`সকল শিক্ষার্থীকে "${status === 'present' ? 'উপস্থিত' : 'অনুপস্থিত'}" হিসেবে সংরক্ষণ করা হয়েছে।`);
      setTimeout(() => setSaveSuccessMsg(''), 3000);
    } catch {}
  };

  const handleSaveStudentAttendance = () => {
    try {
      localStorage.setItem(`attendance_students_${selectedDate}_${selectedClass}_${selectedSection}`, JSON.stringify(studentAttendance));
      setSaveSuccessMsg('হাজিরা ডেটাবেসে সফলভাবে সংরক্ষিত হয়েছে!');
      setTimeout(() => setSaveSuccessMsg(''), 3000);
    } catch {}
  };

  const handleSetStaffStatus = (id: string, status: AttendanceStatus) => {
    const current = staffAttendance[id] || { status: 'present', inTime: '০৮:৪৫ সকাল', outTime: '০৪:১৫ বিকাল' };
    const updated = {
      ...staffAttendance,
      [id]: { ...current, status }
    };
    setStaffAttendance(updated);
    try {
      localStorage.setItem(`attendance_staff_${selectedDate}`, JSON.stringify(updated));
    } catch {}
  };

  const handleSetStaffTime = (id: string, field: 'inTime' | 'outTime', value: string) => {
    const current = staffAttendance[id] || { status: 'present', inTime: '০৮:৪৫ সকাল', outTime: '০৪:১৫ বিকাল' };
    const updated = {
      ...staffAttendance,
      [id]: { ...current, [field]: value }
    };
    setStaffAttendance(updated);
    try {
      localStorage.setItem(`attendance_staff_${selectedDate}`, JSON.stringify(updated));
    } catch {}
  };

  const handleSaveStaffAttendance = () => {
    try {
      localStorage.setItem(`attendance_staff_${selectedDate}`, JSON.stringify(staffAttendance));
      setSaveSuccessMsg(`তারিখ: ${selectedDate} এর শিক্ষক ও কর্মচারীদের দৈনিক উপস্থিতি সফলভাবে ডেটাবেসে সংরক্ষিত হয়েছে!`);
      setTimeout(() => setSaveSuccessMsg(''), 3500);
    } catch {}
  };

  const handleMarkAllStaff = (status: AttendanceStatus) => {
    const updated = { ...staffAttendance };
    allStaffRoster.forEach(s => {
      const prev = staffAttendance[s.id] || { inTime: '০৮:৪৫ সকাল', outTime: '০৪:১৫ বিকাল' };
      updated[s.id] = { ...prev, status };
    });
    setStaffAttendance(updated);
    try {
      localStorage.setItem(`attendance_staff_${selectedDate}`, JSON.stringify(updated));
      setSaveSuccessMsg(`সকল শিক্ষক ও কর্মচারীকে "${status === 'present' ? 'উপস্থিত' : status === 'absent' ? 'অনুপস্থিত' : 'নৈমিত্তিক ছুটি (CL)'}" হিসেবে চিহ্নিত ও সংরক্ষণ করা হয়েছে।`);
      setTimeout(() => setSaveSuccessMsg(''), 3500);
    } catch {}
  };

  const allStaffRoster = [
    ...teachers.map(t => ({ id: t.id, name: t.name, role: t.designation, type: 'শিক্ষক', phone: t.phone })),
    ...staffList.map(s => ({ id: s.id, name: s.name, role: s.designation, type: 'কর্মচারী', phone: s.phone }))
  ];

  const filteredStaffRoster = allStaffRoster.filter(person => {
    if (!staffSearch.trim()) return true;
    const q = staffSearch.toLowerCase();
    return (
      person.name.toLowerCase().includes(q) ||
      person.role.toLowerCase().includes(q) ||
      person.phone.toLowerCase().includes(q) ||
      person.type.toLowerCase().includes(q)
    );
  });

  const staffPresentCount = allStaffRoster.filter(s => (staffAttendance[s.id]?.status || 'present') === 'present').length;
  const staffAbsentCount = allStaffRoster.filter(s => staffAttendance[s.id]?.status === 'absent').length;
  const staffLeaveCount = allStaffRoster.filter(s => staffAttendance[s.id]?.status === 'leave').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#0c3664] to-[#144275] text-white p-6 rounded-2xl shadow-md border-b-4 border-[#d9482b]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider mb-1">
              <Calendar className="w-4 h-4" />
              <span>ডিজিটাল বায়োমেট্রিক ও দৈনিক হাজিরা পোর্টাল</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black">
              দৈনিক হাজিরা ব্যবস্থাপনা (শিক্ষার্থী ও শিক্ষক-কর্মচারী)
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-2xl">
              প্রতিদিনের রিয়েল-টাইম উপস্থিতি সংরক্ষণ, অনুপস্থিত শিক্ষার্থীদের অভিভাবকদের তাৎক্ষণিক নোটিফিকেশন এবং প্রিন্টযোগ্য হাজিরা রেজিস্টার প্রস্তুতকরণ।
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (!simulatedStaffId && allStaffRoster.length > 0) {
                  setSimulatedStaffId(allStaffRoster[0].id);
                }
                setShowQrModal(true);
              }}
              className="px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs border border-emerald-400/40"
              title="বিদ্যালয়ের নোটিশ বোর্ডে টাঙানোর কিউ আর কোড ও মোবাইল দিয়ে স্ব-হাজিরা দেওয়ার সুবিধা"
            >
              <QrCode className="w-4 h-4 text-emerald-200" />
              <span>📱 শিক্ষক QR হাজিরা পয়েন্ট</span>
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="px-3.5 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-4 h-4 text-amber-300" />
              <span>হাজিরা শিট প্রিন্ট</span>
            </button>
          </div>
        </div>

        {/* Dual Tab Switcher */}
        <div className="flex items-center gap-2 mt-5 pt-4 border-t border-white/15">
          <button
            type="button"
            onClick={() => setActiveSubTab('students')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeSubTab === 'students'
                ? 'bg-[#d9482b] text-white shadow-xs'
                : 'bg-black/20 text-slate-200 hover:text-white hover:bg-black/30'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>শিক্ষার্থীদের হাজিরা ({students.length} জন)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('staff')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeSubTab === 'staff'
                ? 'bg-[#d9482b] text-white shadow-xs'
                : 'bg-black/20 text-slate-200 hover:text-white hover:bg-black/30'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>শিক্ষক ও কর্মচারীদের হাজিরা ({allStaffRoster.length} জন)</span>
          </button>
        </div>
      </div>

      {saveSuccessMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* SUB-TAB 1: STUDENTS ATTENDANCE */}
      {activeSubTab === 'students' && (
        <div className="space-y-5">
          {/* Controls Bar */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 ${isNineOrTen ? 'lg:grid-cols-6' : 'lg:grid-cols-5'} gap-3`}>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">হাজিরার তারিখ</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={e => setSelectedDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-bold text-slate-800 focus:ring-2 focus:ring-[#0c3664] focus:outline-hidden"
                />
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
                  <option value="A">শাখা: ক (Section A)</option>
                  <option value="B">শাখা: খ (Section B)</option>
                  <option value="C">শাখা: গ (Section C)</option>
                  <option value="D">শাখা: ঘ (Section D)</option>
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

              {isNineOrTen && (
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
                <label className="block text-xs font-bold text-slate-700 mb-1">রোল বা নাম খুঁজুন</label>
                <div className="relative">
                  <input
                    type="text"
                    value={studentSearch}
                    onChange={e => setStudentSearch(e.target.value)}
                    placeholder="রোল বা নাম..."
                    className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-[#0c3664] focus:outline-hidden"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                </div>
              </div>
            </div>

            {/* Quick Combined Section + Gender Buttons (যেমন: ১০ম ক ছাত্র, ১০ম ক ছাত্রী) */}
            <div className="flex flex-wrap items-center gap-1.5 pt-3 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-600 mr-1 flex items-center gap-1">
                <span>🏷️ দ্রুত সেকশন নির্বাচন:</span>
              </span>
              {[
                { sec: 'A', g: 'male', label: `${selectedClass}ম ক ছাত্র`, icon: '👦' },
                { sec: 'A', g: 'female', label: `${selectedClass}ম ক ছাত্রী`, icon: '👧' },
                { sec: 'B', g: 'male', label: `${selectedClass}ম খ ছাত্র`, icon: '👦' },
                { sec: 'B', g: 'female', label: `${selectedClass}ম খ ছাত্রী`, icon: '👧' },
                { sec: 'C', g: 'male', label: `${selectedClass}ম গ ছাত্র`, icon: '👦' },
                { sec: 'C', g: 'female', label: `${selectedClass}ম গ ছাত্রী`, icon: '👧' },
                { sec: 'D', g: 'male', label: `${selectedClass}ম ঘ ছাত্র`, icon: '👦' },
                { sec: 'D', g: 'female', label: `${selectedClass}ম ঘ ছাত্রী`, icon: '👧' },
              ].map(b => {
                const isActive = selectedSection === b.sec && selectedGender === b.g;
                return (
                  <button
                    key={`${b.sec}-${b.g}`}
                    type="button"
                    onClick={() => {
                      setSelectedSection(b.sec);
                      setSelectedGender(b.g as any);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all border flex items-center gap-1 ${
                      isActive
                        ? 'bg-[#0c3664] text-white border-[#0c3664] shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span>{b.icon}</span>
                    <span>{b.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Quick Summary KPIs */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-3 border-t border-slate-100">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-center">
                <div className="text-[10px] text-slate-500 font-bold uppercase">মোট শিক্ষার্থী</div>
                <div className="text-lg font-black text-slate-900">{totalRoster} জন</div>
              </div>

              <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 text-center">
                <div className="text-[10px] text-emerald-700 font-bold uppercase">উপস্থিত</div>
                <div className="text-lg font-black text-emerald-700">{presentCount} জন</div>
              </div>

              <div className="bg-rose-50 p-2.5 rounded-xl border border-rose-200 text-center">
                <div className="text-[10px] text-rose-700 font-bold uppercase">অনুপস্থিত</div>
                <div className="text-lg font-black text-rose-700">{absentCount} জন</div>
              </div>

              <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200 text-center">
                <div className="text-[10px] text-amber-700 font-bold uppercase">বিলম্বে / ছুটি</div>
                <div className="text-lg font-black text-amber-700">{lateCount + leaveCount} জন</div>
              </div>

              <div className="bg-blue-50 p-2.5 rounded-xl border border-blue-200 text-center col-span-2 sm:col-span-1">
                <div className="text-[10px] text-blue-700 font-bold uppercase">উপস্থিতির হার</div>
                <div className="text-lg font-black text-blue-800">{attendanceRate}%</div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleMarkAllStudents('present')}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>সকলকে উপস্থিত করুন</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleMarkAllStudents('absent')}
                  className="px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-800 rounded-lg text-xs font-bold transition-colors"
                >
                  সকলকে অনুপস্থিত
                </button>
              </div>

              <div className="flex items-center gap-2">
                {absentCount > 0 && onNavigateToSms && (
                  <button
                    type="button"
                    onClick={() => onNavigateToSms(`আজ ${selectedDate} তারিখে আপনার সন্তান শ্রেণি: ${selectedClass}, শাখা: ${selectedSection}-এ অনুপস্থিত রয়েছে।`)}
                    className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
                    title="অনুপস্থিত শিক্ষার্থীদের অভিভাবকদের তাৎক্ষণিক SMS পাঠান"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>অনুপস্থিতদের অভিভাবককে SMS ({absentCount})</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleSaveStudentAttendance}
                  className="px-4 py-1.5 bg-[#0c3664] hover:bg-[#144275] text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Save className="w-3.5 h-3.5 text-amber-300" />
                  <span>সংরক্ষণ করুন</span>
                </button>
              </div>
            </div>
          </div>

          {/* Student Roster Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="text-xs font-bold text-slate-800 flex items-center gap-2">
                <span>
                  শ্রেণি: {selectedClass}ম · শাখা: {selectedSection === 'A' ? 'ক (A)' : selectedSection === 'B' ? 'খ (B)' : selectedSection === 'C' ? 'গ (C)' : 'ঘ (D)'}
                  {isNineOrTen && selectedGroup !== 'all' ? ` · বিভাগ: ${selectedGroup === 'science' ? 'বিজ্ঞান' : selectedGroup === 'humanities' ? 'মানবিক' : 'ব্যবসায় শিক্ষা'}` : ''}
                </span>
                <span className="text-[10px] bg-blue-100 text-[#0c3664] px-2 py-0.5 rounded-full font-bold">
                  {currentClassStudents.length} জন
                </span>
              </div>
              <div className="text-[11px] text-slate-500">
                তারিখ: {selectedDate}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 font-bold">
                    <th className="py-2.5 px-3 w-14 text-center">রোল</th>
                    <th className="py-2.5 px-4">শিক্ষার্থীর নাম</th>
                    <th className="py-2.5 px-3">অভিভাবক ও ফোন</th>
                    <th className="py-2.5 px-3 text-center">হাজিরা স্ট্যাটাস</th>
                    <th className="py-2.5 px-3 text-right">পদক্ষেপ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {currentClassStudents.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400">
                        নির্বাচিত শ্রেণি ও শাখার কোনো শিক্ষার্থী পাওয়া যায়নি।
                      </td>
                    </tr>
                  ) : (
                    currentClassStudents.map(student => {
                      const status = studentAttendance[student.id] || 'present';
                      return (
                        <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-2.5 px-3 text-center font-bold text-slate-900">
                            {student.roll}
                          </td>
                          <td className="py-2.5 px-4">
                            <div className="font-bold text-slate-900 flex items-center gap-1.5 flex-wrap">
                              <span>{student.name}</span>
                              <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                                student.gender === 'female' ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700'
                              }`}>
                                {student.gender === 'female' ? '👧 ছাত্রী' : '👦 ছাত্র'}
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-400">আইডি: {student.id}</div>
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="font-semibold text-slate-700">{student.guardianName}</div>
                            <div className="text-[10px] text-slate-500 font-mono">{student.guardianPhone}</div>
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                                status === 'present'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : status === 'absent'
                                  ? 'bg-rose-100 text-rose-800 font-extrabold'
                                  : status === 'late'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {status === 'present' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                              {status === 'absent' && <XCircle className="w-3 h-3 text-rose-600" />}
                              {status === 'late' && <Clock className="w-3 h-3 text-amber-600" />}
                              {status === 'present'
                                ? 'উপস্থিত'
                                : status === 'absent'
                                ? 'অনুপস্থিত'
                                : status === 'late'
                                ? 'বিলম্বে'
                                : 'ছুটি'}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <div className="inline-flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
                              <button
                                type="button"
                                onClick={() => handleSetStudentStatus(student.id, 'present')}
                                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                                  status === 'present'
                                    ? 'bg-emerald-600 text-white shadow-2xs'
                                    : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50'
                                }`}
                              >
                                উপ
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSetStudentStatus(student.id, 'absent')}
                                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                                  status === 'absent'
                                    ? 'bg-rose-600 text-white shadow-2xs'
                                    : 'text-slate-600 hover:text-rose-700 hover:bg-rose-50'
                                }`}
                              >
                                অনু
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSetStudentStatus(student.id, 'late')}
                                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                                  status === 'late'
                                    ? 'bg-amber-500 text-white shadow-2xs'
                                    : 'text-slate-600 hover:text-amber-700 hover:bg-amber-50'
                                }`}
                              >
                                বিলম্ব
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSetStudentStatus(student.id, 'leave')}
                                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                                  status === 'leave'
                                    ? 'bg-blue-600 text-white shadow-2xs'
                                    : 'text-slate-600 hover:text-blue-700 hover:bg-blue-50'
                                }`}
                              >
                                ছুটি
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: TEACHERS & STAFF ATTENDANCE */}
      {activeSubTab === 'staff' && (
        <div className="space-y-5">
          {/* Staff Date & Summary */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">হাজিরার তারিখ</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={e => setSelectedDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-bold text-slate-800 focus:ring-2 focus:ring-[#0c3664] focus:outline-hidden"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">শিক্ষক / কর্মচারী খুঁজুন</label>
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={staffSearch}
                    onChange={e => setStaffSearch(e.target.value)}
                    placeholder="নাম, পদবি বা মোবাইল নম্বর দিয়ে খুঁজুন..."
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-[#0c3664] focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Staff KPIs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-center">
                <div className="text-[10px] text-slate-500 font-bold uppercase">মোট শিক্ষক ও কর্মী</div>
                <div className="text-lg font-black text-slate-900">{allStaffRoster.length} জন</div>
              </div>
              <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 text-center">
                <div className="text-[10px] text-emerald-700 font-bold uppercase">উপস্থিত</div>
                <div className="text-lg font-black text-emerald-700">{staffPresentCount} জন</div>
              </div>
              <div className="bg-rose-50 p-2.5 rounded-xl border border-rose-200 text-center">
                <div className="text-[10px] text-rose-700 font-bold uppercase">অনুপস্থিত</div>
                <div className="text-lg font-black text-rose-700">{staffAbsentCount} জন</div>
              </div>
              <div className="bg-blue-50 p-2.5 rounded-xl border border-blue-200 text-center">
                <div className="text-[10px] text-blue-700 font-bold uppercase">নৈমিত্তিক ছুটি (CL)</div>
                <div className="text-lg font-black text-blue-700">{staffLeaveCount} জন</div>
              </div>
            </div>

            {/* Action Bar (Preserving and saving staff attendance) */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100">
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleMarkAllStaff('present')}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1 shadow-xs"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>সকল শিক্ষক উপস্থিত</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleMarkAllStaff('absent')}
                  className="px-3.5 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-800 rounded-lg text-xs font-bold transition-colors"
                >
                  সকলকে অনুপস্থিত
                </button>

                <button
                  type="button"
                  onClick={() => handleMarkAllStaff('leave')}
                  className="px-3.5 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg text-xs font-bold transition-colors"
                >
                  সকলকে নৈমিত্তিক ছুটি (CL)
                </button>
              </div>

              <div className="flex items-center gap-2">
                {staffAbsentCount > 0 && onNavigateToSms && (
                  <button
                    type="button"
                    onClick={() => onNavigateToSms(`সম্মানিত শিক্ষক/কর্মকর্তা, আজ ${selectedDate} তারিখে বিদ্যালয় হাজিরা খাতায় আপনার অনুপস্থিতি রেকর্ড করা হয়েছে। জরুরি প্রয়োজনে অফিসে অবহিত করুন। - প্রধান শিক্ষক`)}
                    className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
                    title="অনুপস্থিত শিক্ষক/কর্মচারীকে SMS পাঠান"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>অনুপস্থিতদের SMS ({staffAbsentCount})</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleSaveStaffAttendance}
                  className="px-4 py-1.5 bg-[#0c3664] hover:bg-[#144275] text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs border border-amber-400/40"
                >
                  <Save className="w-3.5 h-3.5 text-amber-300" />
                  <span>সংরক্ষণ করুন</span>
                </button>
              </div>
            </div>
          </div>

          {/* Staff Roster Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
              <div className="text-xs font-bold text-slate-800">
                শিক্ষক ও কর্মচারীদের মাস্টার হাজিরা খাতা (তারিখ: {selectedDate})
              </div>
              <div className="text-[11px] text-slate-500 font-semibold">
                প্রদর্শিত: {filteredStaffRoster.length} জন (মোট {allStaffRoster.length} জন)
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 font-bold">
                    <th className="py-2.5 px-4">নাম ও পদবি</th>
                    <th className="py-2.5 px-3">ধরন ও মোবাইল</th>
                    <th className="py-2.5 px-3">প্রবেশের সময়</th>
                    <th className="py-2.5 px-3">প্রস্থানের সময়</th>
                    <th className="py-2.5 px-3 text-center">স্ট্যাটাস</th>
                    <th className="py-2.5 px-3 text-right">পদক্ষেপ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {filteredStaffRoster.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        কোনো শিক্ষক বা কর্মচারী খুঁজে পাওয়া যায়নি।
                      </td>
                    </tr>
                  ) : (
                    filteredStaffRoster.map(person => {
                      const record = staffAttendance[person.id] || {
                        status: 'present',
                        inTime: '০৮:৪৫ সকাল',
                        outTime: '০৪:১৫ বিকাল'
                      };
                      return (
                        <tr key={person.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-4">
                            <div className="font-bold text-slate-900">{person.name}</div>
                            <div className="text-[11px] text-slate-500">{person.role}</div>
                          </td>
                          <td className="py-3 px-3">
                            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                              person.type === 'শিক্ষক' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'
                            }`}>
                              {person.type}
                            </span>
                            <div className="text-[10px] text-slate-400 font-mono mt-0.5">{person.phone}</div>
                          </td>
                          <td className="py-3 px-3">
                            <input
                              type="text"
                              value={record.inTime}
                              onChange={e => handleSetStaffTime(person.id, 'inTime', e.target.value)}
                              className="w-24 px-2 py-1 border border-slate-200 rounded text-[11px] font-semibold text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-[#0c3664]"
                            />
                          </td>
                          <td className="py-3 px-3">
                            <input
                              type="text"
                              value={record.outTime}
                              onChange={e => handleSetStaffTime(person.id, 'outTime', e.target.value)}
                              className="w-24 px-2 py-1 border border-slate-200 rounded text-[11px] font-semibold text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-[#0c3664]"
                            />
                          </td>
                          <td className="py-3 px-3 text-center">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                                record.status === 'present'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : record.status === 'absent'
                                  ? 'bg-rose-100 text-rose-800'
                                  : record.status === 'late'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {record.status === 'present'
                                ? 'উপস্থিত'
                                : record.status === 'absent'
                                ? 'অনুপস্থিত'
                                : record.status === 'late'
                                ? 'বিলম্বে'
                                : 'ছুটি (CL)'}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <div className="inline-flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
                              <button
                                type="button"
                                onClick={() => handleSetStaffStatus(person.id, 'present')}
                                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                                  record.status === 'present'
                                    ? 'bg-emerald-600 text-white'
                                    : 'text-slate-600 hover:text-emerald-700'
                                }`}
                              >
                                উপ
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSetStaffStatus(person.id, 'absent')}
                                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                                  record.status === 'absent'
                                    ? 'bg-rose-600 text-white'
                                    : 'text-slate-600 hover:text-rose-700'
                                }`}
                              >
                                অনু
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSetStaffStatus(person.id, 'leave')}
                                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                                  record.status === 'leave'
                                    ? 'bg-blue-600 text-white'
                                    : 'text-slate-600 hover:text-blue-700'
                                }`}
                              >
                                ছুটি
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer with instant Save */}
            <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-slate-500 font-medium">
                প্রদর্শিত: {filteredStaffRoster.length} জন (মোট শিক্ষক ও কর্মী: {allStaffRoster.length} জন)
              </div>
              <button
                type="button"
                onClick={handleSaveStaffAttendance}
                className="px-4 py-1.5 bg-[#0c3664] hover:bg-[#144275] text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs border border-amber-400/40"
              >
                <Save className="w-3.5 h-3.5 text-amber-300" />
                <span>শিক্ষক হাজিরা ডেটাবেসে সংরক্ষণ করুন</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR ATTENDANCE MODAL & MOBILE SCANNER SIMULATOR */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl border border-slate-200 space-y-6 relative my-8 animate-in fade-in zoom-in-95 duration-150">
            <button
              type="button"
              onClick={() => {
                setShowQrModal(false);
                setQrFeedbackMsg('');
              }}
              className="absolute right-5 top-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
              title="বন্ধ করুন"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Title */}
            <div className="flex items-center gap-3 pr-8">
              <div className="w-12 h-12 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl flex items-center justify-center shrink-0">
                <QrCode className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                  শিক্ষকগণের মোবাইল QR কোড স্ব-হাজিরা ব্যবস্থা
                </h3>
                <p className="text-xs text-slate-500">
                  বিদ্যালয়ে সংরক্ষিত কিউ আর কোড স্ক্যান করে এক ক্লিকেই স্বয়ংক্রিয় উপস্থিতি নিশ্চিতকরণ
                </p>
              </div>
            </div>

            {qrFeedbackMsg && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl text-xs sm:text-sm text-emerald-800 font-bold flex items-center gap-2.5 animate-in fade-in">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{qrFeedbackMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {/* Left Column: Official Printable School QR Code Card */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center space-y-3">
                <div className="flex items-center justify-center gap-2">
                  <SchoolLogo size={36} />
                  <div className="text-left">
                    <div className="text-xs font-bold text-slate-800">নাপোড়া শেখেরখীল উচ্চ বিদ্যালয়</div>
                    <div className="text-[10px] text-slate-500">শিক্ষক হাজিরা পয়েন্ট · বাঁশখালী</div>
                  </div>
                </div>

                {/* SVG High Resolution QR Code */}
                <div className="p-3 bg-white rounded-xl border border-slate-200 inline-block shadow-inner">
                  <svg viewBox="0 0 100 100" className="w-40 h-40 mx-auto">
                    {/* Background */}
                    <rect width="100" height="100" fill="#ffffff" />
                    {/* Corner Markers */}
                    <rect x="5" y="5" width="26" height="26" fill="#0c3664" rx="3" />
                    <rect x="9" y="9" width="18" height="18" fill="#ffffff" rx="2" />
                    <rect x="13" y="13" width="10" height="10" fill="#0c3664" rx="1.5" />

                    <rect x="69" y="5" width="26" height="26" fill="#0c3664" rx="3" />
                    <rect x="73" y="9" width="18" height="18" fill="#ffffff" rx="2" />
                    <rect x="77" y="13" width="10" height="10" fill="#0c3664" rx="1.5" />

                    <rect x="5" y="69" width="26" height="26" fill="#0c3664" rx="3" />
                    <rect x="9" y="73" width="18" height="18" fill="#ffffff" rx="2" />
                    <rect x="13" y="77" width="10" height="10" fill="#0c3664" rx="1.5" />

                    {/* QR Code Matrix Dots Simulation */}
                    <rect x="36" y="8" width="5" height="5" fill="#0c3664" />
                    <rect x="45" y="8" width="5" height="5" fill="#0c3664" />
                    <rect x="54" y="8" width="5" height="5" fill="#0c3664" />
                    <rect x="36" y="17" width="5" height="5" fill="#0c3664" />
                    <rect x="54" y="17" width="5" height="5" fill="#0c3664" />
                    <rect x="45" y="26" width="5" height="5" fill="#0c3664" />
                    <rect x="8" y="36" width="5" height="5" fill="#0c3664" />
                    <rect x="17" y="36" width="5" height="5" fill="#0c3664" />
                    <rect x="26" y="36" width="5" height="5" fill="#0c3664" />
                    <rect x="36" y="36" width="5" height="5" fill="#0c3664" />
                    <rect x="58" y="36" width="5" height="5" fill="#0c3664" />
                    <rect x="68" y="36" width="5" height="5" fill="#0c3664" />
                    <rect x="80" y="36" width="5" height="5" fill="#0c3664" />

                    <rect x="8" y="45" width="5" height="5" fill="#0c3664" />
                    <rect x="26" y="45" width="5" height="5" fill="#0c3664" />
                    <rect x="36" y="45" width="5" height="5" fill="#0c3664" />
                    <rect x="68" y="45" width="5" height="5" fill="#0c3664" />
                    <rect x="87" y="45" width="5" height="5" fill="#0c3664" />

                    <rect x="8" y="55" width="5" height="5" fill="#0c3664" />
                    <rect x="22" y="55" width="5" height="5" fill="#0c3664" />
                    <rect x="36" y="55" width="5" height="5" fill="#0c3664" />
                    <rect x="50" y="55" width="5" height="5" fill="#0c3664" />
                    <rect x="65" y="55" width="5" height="5" fill="#0c3664" />
                    <rect x="80" y="55" width="5" height="5" fill="#0c3664" />

                    <rect x="36" y="68" width="5" height="5" fill="#0c3664" />
                    <rect x="45" y="68" width="5" height="5" fill="#0c3664" />
                    <rect x="54" y="68" width="5" height="5" fill="#0c3664" />
                    <rect x="75" y="68" width="5" height="5" fill="#0c3664" />
                    <rect x="85" y="68" width="5" height="5" fill="#0c3664" />

                    <rect x="45" y="78" width="5" height="5" fill="#0c3664" />
                    <rect x="60" y="78" width="5" height="5" fill="#0c3664" />
                    <rect x="75" y="78" width="5" height="5" fill="#0c3664" />
                    <rect x="85" y="78" width="5" height="5" fill="#0c3664" />

                    {/* Center Accent Badge */}
                    <circle cx="50" cy="50" r="10" fill="#d9482b" />
                    <circle cx="50" cy="50" r="7" fill="#ffffff" />
                    <circle cx="50" cy="50" r="4" fill="#0c3664" />
                  </svg>
                </div>

                <div className="text-[11px] text-slate-600 font-semibold leading-relaxed">
                  এটি প্রিন্ট করে শিক্ষক মিলনায়তন বা প্রধান শিক্ষকের কক্ষের সামনে দেয়ালে ঝুলিয়ে রাখা যায়।
                </div>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="w-full py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-all"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-600" />
                  <span>কিউ আর কোড শিট প্রিন্ট করুন</span>
                </button>
              </div>

              {/* Right Column: Live Mobile Attendance Confirmation Simulator */}
              <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-700 space-y-4 shadow-lg">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                    <Smartphone className="w-4 h-4 text-emerald-400" />
                    <span>শিক্ষকের মোবাইল স্ক্রিন প্রিভিউ</span>
                  </div>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                    ক্যাম্পাস লাইভ
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-slate-300 font-medium block mb-1">
                      স্ক্যানকারী শিক্ষক বা কর্মচারী নির্বাচন করুন:
                    </label>
                    <select
                      value={simulatedStaffId}
                      onChange={(e) => setSimulatedStaffId(e.target.value)}
                      className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      {allStaffRoster.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.role}) - {p.type}
                        </option>
                      ))}
                    </select>
                  </div>

                  {(() => {
                    const selectedPerson = allStaffRoster.find(p => p.id === simulatedStaffId);
                    const record = selectedPerson ? staffAttendance[selectedPerson.id] : null;
                    const isPresent = record?.status === 'present';

                    return (
                      <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700/80 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">নাম:</span>
                          <span className="font-bold text-white">{selectedPerson?.name}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">পদবি:</span>
                          <span className="text-amber-200">{selectedPerson?.role}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">তারিখ ও সময়:</span>
                          <span className="text-emerald-400 font-mono">
                            {selectedDate} · ০৯:১৫ পূর্বাহ্ন
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">বর্তমান স্ট্যাটাস:</span>
                          <span className={`font-bold px-2 py-0.5 rounded ${
                            isPresent ? 'bg-emerald-900/60 text-emerald-300' : 'bg-rose-900/60 text-rose-300'
                          }`}>
                            {isPresent ? `উপস্থিত (ইন-টাইম: ${record?.inTime || '০৮:৪৫ সকাল'})` : 'এখনো এন্ট্রি হয়নি'}
                          </span>
                        </div>

                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={() => {
                              if (!selectedPerson) return;
                              const now = new Date();
                              const hours = now.getHours();
                              const mins = now.getMinutes().toString().padStart(2, '0');
                              const isAm = hours < 12;
                              const formattedHour = (hours % 12 || 12).toString().padStart(2, '0');
                              const timeStr = `${formattedHour}:${mins} ${isAm ? 'সকাল' : 'বিকাল'}`;

                              const updated = {
                                ...staffAttendance,
                                [selectedPerson.id]: {
                                  status: 'present' as AttendanceStatus,
                                  inTime: timeStr,
                                  outTime: '০৪:১৫ বিকাল'
                                }
                              };
                              setStaffAttendance(updated);
                              try {
                                localStorage.setItem(`attendance_staff_${selectedDate}`, JSON.stringify(updated));
                              } catch {}

                              setQrFeedbackMsg(`জনাব ${selectedPerson.name}-এর উপস্থিতি স্বয়ংক্রিয়ভাবে ইন-টাইম (${timeStr}) সহ সফলভাবে ওয়েবসাইটে সংরক্ষিত হয়েছে!`);
                            }}
                            className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 rounded-xl text-xs font-black shadow-md flex items-center justify-center gap-2 transition-all transform active:scale-95"
                          >
                            <CheckCircle2 className="w-4 h-4 text-slate-950" />
                            <span>উপস্থিতি নিশ্চিত করুন (OK / Confirm)</span>
                          </button>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                <div className="text-[11px] text-slate-400 leading-relaxed border-t border-slate-800 pt-3">
                  💡 <span className="text-slate-200 font-semibold">কিভাবে এটি কাজ করে:</span> শিক্ষক যখন স্মার্টফোন দিয়ে দেওয়ালে টানানো কিউ আর কোড স্ক্যান করবেন, মোবাইল ব্রাউজারে স্বয়ংক্রিয়ভাবে উক্ত পাতা খুলে যাবে এবং 'উপস্থিতি নিশ্চিত করুন' বাটনে চাপ দিলেই সার্ভারে ও প্রধান ওয়েবসাইটের হাজিরা ড্যাশবোর্ডে ওনার নাম 'উপস্থিত' হিসেবে ভেসে উঠবে।
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
