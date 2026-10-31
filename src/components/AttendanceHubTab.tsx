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
  FileSpreadsheet
} from 'lucide-react';
import { Student, Teacher, StaffMember } from '../types';
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
  const [studentSearch, setStudentSearch] = useState<string>('');

  // Student Attendance Records: Key = date_class_section, Value = Record<studentId, AttendanceStatus>
  const [studentAttendance, setStudentAttendance] = useState<Record<string, AttendanceStatus>>(() => {
    try {
      const saved = localStorage.getItem(`attendance_students_${selectedDate}_${selectedClass}_${selectedSection}`);
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

  // Reload student attendance on class/section/date change
  useEffect(() => {
    const key = `attendance_students_${selectedDate}_${selectedClass}_${selectedSection}`;
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        setStudentAttendance(JSON.parse(saved));
      } else {
        // Default: mark everyone present for convenience
        const defaults: Record<string, AttendanceStatus> = {};
        students
          .filter(s => s.className === selectedClass && s.section === selectedSection)
          .forEach(s => {
            defaults[s.id] = 'present';
          });
        setStudentAttendance(defaults);
      }
    } catch {
      setStudentAttendance({});
    }
  }, [selectedDate, selectedClass, selectedSection, students]);

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
  const currentClassStudents = students
    .filter(s => s.className === selectedClass && s.section === selectedSection)
    .filter(s => {
      if (!studentSearch.trim()) return true;
      const q = studentSearch.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.roll.toString().includes(q) ||
        s.id.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => a.roll - b.roll);

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

  const allStaffRoster = [
    ...teachers.map(t => ({ id: t.id, name: t.name, role: t.designation, type: 'শিক্ষক', phone: t.phone })),
    ...staffList.map(s => ({ id: s.id, name: s.name, role: s.designation, type: 'কর্মচারী', phone: s.phone }))
  ];

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

          <div className="flex items-center gap-2">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
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
                  <option value="A">শাখা: ক (A)</option>
                  <option value="B">শাখা: খ (B)</option>
                  <option value="C">শাখা: গ (C)</option>
                </select>
              </div>

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
              <div className="text-xs font-bold text-slate-800">
                শ্রেণি: {selectedClass}ম · শাখা: {selectedSection} · শিক্ষার্থীর তালিকা ({currentClassStudents.length})
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
                            <div className="font-bold text-slate-900">{student.name}</div>
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
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">হাজিরার তারিখ</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={e => setSelectedDate(e.target.value)}
                  className="px-3 py-2 border border-slate-300 rounded-lg text-xs font-bold text-slate-800 focus:ring-2 focus:ring-[#0c3664] focus:outline-hidden"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const updated = { ...staffAttendance };
                    allStaffRoster.forEach(s => {
                      updated[s.id] = { status: 'present', inTime: '০৮:৪৫ সকাল', outTime: '০৪:১৫ বিকাল' };
                    });
                    setStaffAttendance(updated);
                    localStorage.setItem(`attendance_staff_${selectedDate}`, JSON.stringify(updated));
                    setSaveSuccessMsg('সকল শিক্ষক ও কর্মচারীকে "উপস্থিত" চিহ্নিত করা হয়েছে।');
                    setTimeout(() => setSaveSuccessMsg(''), 3000);
                  }}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>সকল শিক্ষক উপস্থিত</span>
                </button>
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
          </div>

          {/* Staff Roster Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="text-xs font-bold text-slate-800">
                শিক্ষক ও কর্মচারীদের মাস্টার হাজিরা খাতা (তারিখ: {selectedDate})
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
                  {allStaffRoster.map(person => {
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
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
