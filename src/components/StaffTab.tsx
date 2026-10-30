import React, { useState, useMemo } from 'react';
import {
  UserCheck,
  Plus,
  Printer,
  ShieldCheck,
  Briefcase,
  Search,
  X,
  Award,
  Calendar,
  Phone,
  Pencil,
  Trash2
} from 'lucide-react';
import { StaffMember } from '../types';

interface StaffTabProps {
  staffList: StaffMember[];
  onOpenAddStaff: () => void;
  onOpenEditStaff: (staff: StaffMember) => void;
  onDeleteStaff: (id: string, name: string) => void;
  onPrint: () => void;
}

export default function StaffTab({
  staffList,
  onOpenAddStaff,
  onOpenEditStaff,
  onDeleteStaff,
  onPrint
}: StaffTabProps) {
  const [staffSearchQuery, setStaffSearchQuery] = useState<string>('');
  const [staffFilterCategory, setStaffFilterCategory] = useState<string>('all');

  const filteredStaff = useMemo(() => {
    return staffList.filter(staff => {
      if (staffFilterCategory !== 'all') {
        if (staffFilterCategory === 'office') {
          if (!staff.designation.includes('অফিস সহকারী') && !staff.designation.includes('হিসাব') && !staff.designation.includes('কম্পিউটার')) return false;
        } else if (staffFilterCategory === 'peon') {
          if (!staff.designation.includes('পিয়ন') && !staff.designation.includes('সহায়ক') && !staff.designation.includes('MLSS')) return false;
        } else if (staffFilterCategory === 'ayah') {
          if (!staff.designation.includes('আয়া')) return false;
        } else if (staffFilterCategory === 'security') {
          if (!staff.designation.includes('নিরাপত্তা') && !staff.designation.includes('নৈশপ্রহরী') && !staff.designation.includes('প্রহরী')) return false;
        } else if (staffFilterCategory === 'service') {
          if (!staff.designation.includes('পরিচ্ছন্ন') && !staff.designation.includes('মালী')) return false;
        }
      }

      if (staffSearchQuery.trim()) {
        const query = staffSearchQuery.toLowerCase();
        const matchesName = staff.name.toLowerCase().includes(query);
        const matchesDes = staff.designation.toLowerCase().includes(query);
        const matchesDuty = (staff.dutyScope || '').toLowerCase().includes(query);
        const matchesPhone = staff.phone.includes(query);
        const matchesId = staff.id.toLowerCase().includes(query);
        if (!matchesName && !matchesDes && !matchesDuty && !matchesPhone && !matchesId) return false;
      }
      return true;
    });
  }, [staffList, staffFilterCategory, staffSearchQuery]);

  return (
    <div className="space-y-6">
      {/* Header & Policy Banner */}
      <div className="bg-white p-6 md:p-7 rounded-3xl border border-[#d9e6e7] shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#0c3664] text-white flex items-center gap-1 shadow-xs">
                <UserCheck className="w-3.5 h-3.5 text-amber-300" />
                <span>অফিস ও সহায়ক স্টাফ ফোরাম</span>
              </span>
              <span className="text-xs text-slate-500 font-mono">
                মোট {staffList.length} জন
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
              বিদ্যালয় কর্মচারীবৃন্দ ও অফিস সহায়ক ডিরেক্টরি
            </h2>
            <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
              নাপোড়া শেখেরখীল উচ্চ বিদ্যালয়ের অফিস সহকারী, হিসাব সহকারী, অফিস সহায়ক (পিয়ন), আয়া, নিরাপত্তা প্রহরী ও অন্যান্য সকল সহায়ক কর্মচারীবৃন্দের সম্পূর্ণ তালিকা ও যোগাযোগ তথ্য।
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={onOpenAddStaff}
              className="px-4 py-2.5 bg-[#d9482b] hover:bg-[#b8381e] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন কর্মচারী যুক্ত করুন</span>
            </button>
            <button
              type="button"
              onClick={onPrint}
              className="px-3.5 py-2.5 bg-[#f0f6f6] hover:bg-[#e2eeee] border border-[#d2e5e7] text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4 text-[#0c3664]" />
              <span className="hidden sm:inline">প্রিন্ট তালিকা</span>
            </button>
          </div>
        </div>

        {/* Protocol Notice Banner */}
        <div className="p-3.5 bg-blue-50/70 border border-blue-200/80 rounded-2xl flex items-start gap-3 text-xs text-blue-900">
          <ShieldCheck className="w-4 h-4 text-[#0c3664] shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="font-bold text-[#0c3664]">প্রাতিষ্ঠানিক প্রটোকল নির্দেশনা: </strong>
            বিদ্যালয়ের প্রশাসনিক ও একাডেমিক নীতিমালা অনুযায়ী <em>'শিক্ষক ফোরাম'</em> শুধুমাত্র পাঠদানকারী সম্মানিত শিক্ষকমণ্ডলীর জন্য সংরক্ষিত। অফিস সহকারী, পিয়ন, আয়া, নৈশপ্রহরী ও অন্যান্য সহায়ক কর্মচারীদের জন্য এই স্বতন্ত্র <strong>'কর্মচারীবৃন্দ'</strong> ট্যাব সংরক্ষিত রাখা হয়েছে।
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#d9e6e7] shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 text-xs font-semibold scrollbar-none">
          {[
            { id: 'all', label: 'সকল কর্মচারী' },
            { id: 'office', label: 'অফিস সহকারী ও হিসাব' },
            { id: 'peon', label: 'অফিস সহায়ক (পিয়ন)' },
            { id: 'ayah', label: 'আয়া (Ayah)' },
            { id: 'security', label: 'নিরাপত্তা ও নৈশপ্রহরী' },
            { id: 'service', label: 'মালী ও পরিচ্ছন্নতাকর্মী' },
          ].map(cat => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setStaffFilterCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all text-xs ${
                staffFilterCategory === cat.id
                  ? 'bg-[#0c3664] text-white shadow-xs font-bold'
                  : 'bg-[#f0f6f6] hover:bg-slate-100 text-slate-600 border border-[#d2e5e7]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72 shrink-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={staffSearchQuery}
            onChange={(e) => setStaffSearchQuery(e.target.value)}
            placeholder="নাম, পদবী, দায়িত্ব বা ফোন..."
            className="w-full pl-9 pr-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-xs focus:outline-none focus:border-[#0c3664] text-slate-800 font-medium"
          />
          {staffSearchQuery && (
            <button
              type="button"
              onClick={() => setStaffSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Staff Cards Grid */}
      {filteredStaff.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredStaff.map(staff => {
            const isOffice = staff.designation.includes('অফিস সহকারী') || staff.designation.includes('হিসাব') || staff.designation.includes('কম্পিউটার');
            const isPeon = staff.designation.includes('পিয়ন') || staff.designation.includes('সহায়ক');
            const isAyah = staff.designation.includes('আয়া');
            const isSecurity = staff.designation.includes('নিরাপত্তা') || staff.designation.includes('নৈশপ্রহরী') || staff.designation.includes('প্রহরী');

            return (
              <div
                key={staff.id}
                className="bg-white border border-[#d9e6e7] hover:border-[#0c3664] rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3.5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg text-white shrink-0 shadow-xs ${
                          isOffice
                            ? 'bg-[#0c3664]'
                            : isPeon
                            ? 'bg-[#1e40af]'
                            : isAyah
                            ? 'bg-[#059669]'
                            : isSecurity
                            ? 'bg-[#d97706]'
                            : 'bg-[#0d9488]'
                        }`}
                      >
                        {staff.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-[#0c3664] transition-colors">
                          {staff.name}
                        </h3>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                              isOffice
                                ? 'bg-blue-100 text-[#0c3664] border border-blue-200'
                                : isPeon
                                ? 'bg-indigo-100 text-indigo-900 border border-indigo-200'
                                : isAyah
                                ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                                : isSecurity
                                ? 'bg-amber-100 text-amber-900 border border-amber-200'
                                : 'bg-teal-100 text-teal-900 border border-teal-200'
                            }`}
                          >
                            {staff.designation}
                          </span>
                        </div>
                      </div>
                    </div>

                    <span className="text-[10px] font-mono font-bold bg-[#f0f6f6] text-slate-600 px-2 py-0.5 rounded-md border border-[#d2e5e7] shrink-0">
                      {staff.id}
                    </span>
                  </div>

                  <div className="p-2.5 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-xs space-y-1">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                      <Briefcase className="w-3 h-3 text-[#0c3664]" />
                      <span>প্রধান দায়িত্ব:</span>
                    </div>
                    <div className="text-slate-800 font-medium leading-relaxed">
                      {staff.dutyScope}
                    </div>
                  </div>

                  {staff.qualification && (
                    <div className="text-[11px] text-slate-600 flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>যোগ্যতা: <strong className="font-semibold text-slate-700">{staff.qualification}</strong></span>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>যোগদান: {staff.joinDate}</span>
                    </div>

                    <a
                      href={`tel:${staff.phone}`}
                      className="text-[#0c3664] hover:text-[#d9482b] font-mono font-bold flex items-center gap-1 hover:underline"
                    >
                      <Phone className="w-3 h-3" />
                      <span>{staff.phone}</span>
                    </a>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-50">
                    <button
                      type="button"
                      onClick={() => onOpenEditStaff(staff)}
                      className="px-3 py-1.5 bg-[#0c3664] hover:bg-[#092b50] text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1 shadow-xs"
                      title="সম্পাদনা করুন"
                    >
                      <Pencil className="w-3 h-3 text-amber-300" />
                      <span>এডিট</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteStaff(staff.id, staff.name)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-200"
                      title="বাদ দিন"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white p-12 rounded-3xl border border-[#d9e6e7] text-center space-y-3">
          <UserCheck className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-700">কোনো কর্মচারী পাওয়া যায়নি</h3>
          <button
            type="button"
            onClick={onOpenAddStaff}
            className="px-4 py-2 bg-[#d9482b] text-white text-xs font-bold rounded-xl"
          >
            + নতুন কর্মচারী যুক্ত করুন
          </button>
        </div>
      )}
    </div>
  );
}
