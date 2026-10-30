import React, { useState, useMemo } from 'react';
import {
  GraduationCap,
  Users,
  UserPlus,
  Briefcase,
  Search,
  X,
  Award,
  Phone,
  Mail,
  Calendar,
  Pencil,
  Trash2
} from 'lucide-react';
import { Teacher, AdminUser, NavTab, HeadmasterData } from '../types';
import { sortTeachersByHierarchy } from '../data/initialData';
import HeadmasterPortrait from './HeadmasterPortrait';

interface FacultyTabProps {
  language: 'bn' | 'en';
  teachers: Teacher[];
  currentAdmin: AdminUser | null;
  onOpenAddTeacher: () => void;
  onOpenEditTeacher: (teacher: Teacher) => void;
  onDeleteTeacher: (id: string, name: string) => void;
  setActiveTab: (tab: NavTab) => void;
  headmasterData?: HeadmasterData;
  onOpenEditHeadmaster?: () => void;
}

export default function FacultyTab({
  language,
  teachers,
  currentAdmin,
  onOpenAddTeacher,
  onOpenEditTeacher,
  onDeleteTeacher,
  setActiveTab,
  headmasterData,
  onOpenEditHeadmaster
}: FacultyTabProps) {
  const [teacherSearchQuery, setTeacherSearchQuery] = useState<string>('');
  const [teacherFilterDesignation, setTeacherFilterDesignation] = useState<string>('all');

  const filteredTeachers = useMemo(() => {
    const list = teachers.filter(teacher => {
      if (teacherFilterDesignation !== 'all') {
        if (teacherFilterDesignation === 'headmaster') {
          if (!teacher.designation.includes('প্রধান শিক্ষক')) return false;
        } else if (teacherFilterDesignation === 'senior') {
          if (!teacher.designation.includes('সিনিয়র')) return false;
        } else if (teacherFilterDesignation === 'assistant') {
          if (!teacher.designation.includes('সহকারী')) return false;
        } else if (teacherFilterDesignation === 'ict') {
          if (!teacher.designation.includes('আইসিটি') && !teacher.subject.includes('আইসিটি') && !teacher.subject.includes('তথ্য')) return false;
        }
      }

      if (teacherSearchQuery.trim()) {
        const query = teacherSearchQuery.toLowerCase();
        const matchesName = teacher.name.toLowerCase().includes(query);
        const matchesSub = teacher.subject.toLowerCase().includes(query);
        const matchesDes = teacher.designation.toLowerCase().includes(query);
        const matchesPhone = teacher.phone.includes(query);
        if (!matchesName && !matchesSub && !matchesDes && !matchesPhone) return false;
      }
      return true;
    });

    return sortTeachersByHierarchy(list);
  }, [teachers, teacherFilterDesignation, teacherSearchQuery]);

  const head = teachers.find(t => t.designation.includes('প্রধান শিক্ষক') && !t.designation.includes('সহকারী'));
  const asstHead = teachers.find(t => t.designation.includes('সহকারী প্রধান শিক্ষক'));

  return (
    <div className="space-y-6">
      {/* Header & Quick Action */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-[#d9e6e7] shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#d9482b] uppercase tracking-wider mb-1">
              <GraduationCap className="w-4 h-4" />
              <span>{language === 'bn' ? 'শিক্ষক পর্ষদ ও ডিরেক্টরি' : 'Faculty Directory'}</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900">
              {language === 'bn' ? 'শিক্ষক ফোরাম (Teachers\' Forum)' : 'Faculty & Teachers Forum'}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {language === 'bn'
                ? 'নাপোড়া শেখেরখীল উচ্চ বিদ্যালয়ের প্রধান শিক্ষক, সহকারী প্রধান শিক্ষক এবং সকল সম্মানিত শিক্ষকমণ্ডলীর পূর্ণাঙ্গ প্রোফাইল ও যোগাযোগ তথ্য।'
                : 'Complete faculty profile directory of Napora Shekherkhil High School, Banshkhali.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-xs font-mono font-bold text-[#0c3664] bg-[#f0f6f6] px-3.5 py-2 rounded-xl border border-[#d2e5e7]">
              {language === 'bn' ? `মোট ${teachers.length} জন শিক্ষক` : `Total ${teachers.length} Faculty`}
            </span>

            <button
              type="button"
              onClick={onOpenAddTeacher}
              className="px-4 py-2.5 bg-[#d9482b] hover:bg-[#b8381e] text-white font-bold rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-2 text-xs"
              title="প্রধান শিক্ষক বা নতুন কোনো শিক্ষক যুক্ত করুন"
            >
              <UserPlus className="w-4 h-4 text-white" />
              <span>{language === 'bn' ? '+ নতুন শিক্ষক অন্তর্ভুক্তি' : '+ Add Teacher'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('office')}
              className="px-3 py-2.5 bg-[#0c3664] hover:bg-[#082545] text-white font-medium rounded-xl text-xs transition-colors flex items-center gap-1.5"
            >
              <Briefcase className="w-3.5 h-3.5 text-amber-300" />
              <span>{language === 'bn' ? 'অফিস এন্ট্রি ডেস্ক' : 'Admin Desk'}</span>
            </button>
          </div>
        </div>

        {/* Search & Filter Pills */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={teacherSearchQuery}
              onChange={(e) => setTeacherSearchQuery(e.target.value)}
              placeholder={language === 'bn' ? 'শিক্ষকের নাম, বিষয় বা মোবাইল দিয়ে খুঁজুন...' : 'Search by teacher name or subject...'}
              className="w-full pl-9 pr-4 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0c3664]"
            />
            {teacherSearchQuery && (
              <button
                type="button"
                onClick={() => setTeacherSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto">
            {[
              { id: 'all', label: language === 'bn' ? `সকল শিক্ষক (${teachers.length})` : 'All' },
              { id: 'headmaster', label: language === 'bn' ? 'প্রধান ও সহকারী প্রধান' : 'Head & Asst Head' },
              { id: 'senior', label: language === 'bn' ? 'সিনিয়র শিক্ষক' : 'Senior Teachers' },
              { id: 'assistant', label: language === 'bn' ? 'সহকারী শিক্ষক' : 'Assistant Teachers' },
              { id: 'ict', label: language === 'bn' ? 'বিজ্ঞান ও আইসিটি' : 'Science & ICT' }
            ].map(pill => (
              <button
                key={pill.id}
                type="button"
                onClick={() => setTeacherFilterDesignation(pill.id)}
                className={`px-3 py-1.5 rounded-xl font-medium transition-colors ${
                  teacherFilterDesignation === pill.id
                    ? 'bg-[#0c3664] text-white shadow-xs font-bold'
                    : 'bg-[#f0f6f6] text-slate-600 hover:bg-slate-200'
                }`}
              >
                {pill.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Leadership Showcase: Headmaster & Assistant Headmaster */}
      {teacherFilterDesignation === 'all' && !teacherSearchQuery && (head || asstHead) && (
        <div className={`grid grid-cols-1 ${head && asstHead ? 'lg:grid-cols-2' : ''} gap-5`}>
          {head && (
            <div className="bg-gradient-to-br from-[#0c3664] via-[#103d6d] to-[#144275] text-white rounded-3xl p-6 md:p-7 shadow-sm border-2 border-amber-400/60 relative overflow-hidden flex flex-col justify-between">
              <div className="relative z-10 space-y-4">
                <div className="flex items-start gap-4">
                  <div
                    onClick={onOpenEditHeadmaster ? onOpenEditHeadmaster : undefined}
                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-amber-400/20 border-2 border-amber-300/80 text-amber-200 flex items-center justify-center font-bold text-2xl shrink-0 shadow-md overflow-hidden relative ${
                      onOpenEditHeadmaster ? 'cursor-pointer group' : ''
                    }`}
                    title={onOpenEditHeadmaster ? 'প্রধান শিক্ষকের ছবি ও তথ্য দেখতে বা এডিট করতে ক্লিক করুন' : head.name}
                  >
                    {headmasterData?.photoUrl ? (
                      <img
                        src={headmasterData.photoUrl}
                        alt={head.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <HeadmasterPortrait size="100%" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    )}
                    {onOpenEditHeadmaster && (
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-[10px] font-bold">
                        ছবি এডিট
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="bg-amber-400 text-[#0c3664] font-bold text-[11px] px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                        <Award className="w-3 h-3" />
                        <span>{head.designation}</span>
                      </span>
                      <span className="text-[11px] bg-white/10 text-white/90 px-2 py-0.5 rounded-md font-mono">
                        আইডি: {head.id}
                      </span>
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-white tracking-tight">
                      {head.name}
                    </h3>
                    <div className="text-xs text-amber-200/90 font-medium">
                      {head.qualification && <span>{head.qualification} · </span>}
                      <span>বিষয়: {head.subject}</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-300 italic leading-relaxed bg-white/5 p-3 rounded-xl border border-white/10">
                  "বিদ্যালয়ের সার্বিক শিক্ষা ব্যবস্থাপনা, শিক্ষক ফোরাম ও পরীক্ষার একাডেমিক শৃঙ্খলা পরিচালনা প্রধান শিক্ষকের প্রত্যক্ষ তদারকিতে পরিচালিত হয়।"
                </p>
              </div>

              <div className="relative z-10 pt-4 mt-3 border-t border-white/15 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={`tel:${head.phone}`}
                    className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white font-mono flex items-center gap-1.5 transition-colors text-[11px]"
                  >
                    <Phone className="w-3.5 h-3.5 text-amber-300" />
                    <span>{head.phone}</span>
                  </a>
                  <a
                    href={`mailto:${head.email}`}
                    className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white font-mono flex items-center gap-1.5 transition-colors text-[11px]"
                  >
                    <Mail className="w-3.5 h-3.5 text-amber-300" />
                    <span className="truncate max-w-[130px]">{head.email}</span>
                  </a>
                  <div className="text-[11px] text-slate-300 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-amber-300/70" />
                    <span>যোগদান: {head.joinDate}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      if (onOpenEditHeadmaster) {
                        onOpenEditHeadmaster();
                      } else {
                        onOpenEditTeacher(head);
                      }
                    }}
                    className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-[#0c3664] font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-xs"
                    title="প্রধান শিক্ষকের নাম, পদবি, শিক্ষাগত যোগ্যতা ও বাণী এডিট করুন"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    <span>হেড স্যারের ছবি ও বাণী এডিট</span>
                  </button>
                  {currentAdmin && (
                    <button
                      type="button"
                      onClick={() => onDeleteTeacher(head.id, head.name)}
                      className="p-1.5 bg-white/10 hover:bg-rose-600/80 text-white rounded-xl text-xs transition-colors"
                      title="অপসারণ করুন"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {asstHead && (
            <div className="bg-gradient-to-br from-[#0a314b] via-[#0e3b5a] to-[#124669] text-white rounded-3xl p-6 md:p-7 shadow-sm border-2 border-cyan-400/60 relative overflow-hidden flex flex-col justify-between">
              <div className="relative z-10 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-cyan-400/20 border-2 border-cyan-300/60 text-cyan-200 flex items-center justify-center font-bold text-2xl shrink-0 shadow-md">
                    {asstHead.name.charAt(0)}
                  </div>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="bg-cyan-400 text-[#0c3664] font-bold text-[11px] px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                        <Award className="w-3 h-3" />
                        <span>{asstHead.designation}</span>
                      </span>
                      <span className="text-[11px] bg-white/10 text-white/90 px-2 py-0.5 rounded-md font-mono">
                        আইডি: {asstHead.id}
                      </span>
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-white tracking-tight">
                      {asstHead.name}
                    </h3>
                    <div className="text-xs text-cyan-200/90 font-medium">
                      {asstHead.qualification && <span>{asstHead.qualification} · </span>}
                      <span>বিষয়: {asstHead.subject}</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-300 italic leading-relaxed bg-white/5 p-3 rounded-xl border border-white/10">
                  "বিদ্যালয়ের দৈনন্দিন অ্যাকাডেমিক সমন্বয়, ক্লাস রুটিন, সহশিক্ষা কার্যক্রম ও শিক্ষক ফোরামের সমন্বয় সহকারী প্রধান শিক্ষকের তত্ত্বাবধানে পরিচালিত হয়।"
                </p>
              </div>

              <div className="relative z-10 pt-4 mt-3 border-t border-white/15 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={`tel:${asstHead.phone}`}
                    className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white font-mono flex items-center gap-1.5 transition-colors text-[11px]"
                  >
                    <Phone className="w-3.5 h-3.5 text-cyan-300" />
                    <span>{asstHead.phone}</span>
                  </a>
                  <a
                    href={`mailto:${asstHead.email}`}
                    className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white font-mono flex items-center gap-1.5 transition-colors text-[11px]"
                  >
                    <Mail className="w-3.5 h-3.5 text-cyan-300" />
                    <span className="truncate max-w-[130px]">{asstHead.email}</span>
                  </a>
                  <div className="text-[11px] text-slate-300 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-cyan-300/70" />
                    <span>যোগদান: {asstHead.joinDate}</span>
                  </div>
                </div>

                {currentAdmin && (
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => onOpenEditTeacher(asstHead)}
                      className="px-3 py-1.5 bg-cyan-400 hover:bg-cyan-300 text-[#0c3664] font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-xs"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      <span>এডিট</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteTeacher(asstHead.id, asstHead.name)}
                      className="p-1.5 bg-white/10 hover:bg-rose-600/80 text-white rounded-xl text-xs transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Teachers Grid */}
      {filteredTeachers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTeachers.map(teacher => {
            const isHead = teacher.designation.includes('প্রধান শিক্ষক') && !teacher.designation.includes('সহকারী');
            const isAsstHead = teacher.designation.includes('সহকারী প্রধান শিক্ষক');
            const isSenior = teacher.designation.includes('সিনিয়র শিক্ষক');

            return (
              <div
                key={teacher.id}
                className={`bg-white border rounded-2xl p-6 shadow-xs space-y-4 transition-all hover:shadow-md ${
                  isHead
                    ? 'border-amber-300 bg-amber-50/20 ring-1 ring-amber-300/60'
                    : isAsstHead
                    ? 'border-[#0c3664]/40 bg-[#f0f6f6]/40'
                    : 'border-[#d9e6e7] hover:border-[#0c3664]'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-13 h-13 rounded-2xl flex items-center justify-center font-bold text-xl shrink-0 shadow-xs ${
                        isHead
                          ? 'bg-amber-500 text-white'
                          : isAsstHead
                          ? 'bg-[#0c3664] text-white'
                          : isSenior
                          ? 'bg-[#d9482b] text-white'
                          : 'bg-[#1b4977] text-white'
                      }`}
                    >
                      {teacher.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 leading-snug">{teacher.name}</h3>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                            isHead
                              ? 'bg-amber-100 text-amber-900 border border-amber-300/70'
                              : isAsstHead
                              ? 'bg-blue-100 text-[#0c3664] border border-blue-200'
                              : isSenior
                              ? 'bg-rose-100 text-[#d9482b] border border-rose-200'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {teacher.designation}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1 font-medium">{teacher.subject}</div>
                    </div>
                  </div>

                  {currentAdmin && (
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => onOpenEditTeacher(teacher)}
                        className="text-slate-400 hover:text-[#0c3664] p-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                        title="সম্পাদনা করুন"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteTeacher(teacher.id, teacher.name)}
                        className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                        title="বাদ দিন"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {teacher.qualification && (
                  <div className="text-[11px] text-slate-600 bg-[#f0f6f6] px-2.5 py-1.5 rounded-lg border border-[#d2e5e7]">
                    <strong className="text-slate-700 font-medium">যোগ্যতা:</strong> {teacher.qualification}
                  </div>
                )}

                <div className="border-t border-slate-100 pt-3 space-y-2 text-xs text-slate-600">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <a href={`tel:${teacher.phone}`} className="font-mono hover:text-[#0c3664] hover:underline">
                        {teacher.phone}
                      </a>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">আইডি: {teacher.id}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <a href={`mailto:${teacher.email}`} className="truncate hover:text-[#0c3664] hover:underline text-[11px]">
                      {teacher.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>যোগদানের তারিখ: {teacher.joinDate}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white p-12 rounded-3xl border border-[#d9e6e7] text-center space-y-3">
          <Users className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-700">কোনো শিক্ষক পাওয়া যায়নি</h3>
          <button
            type="button"
            onClick={onOpenAddTeacher}
            className="px-4 py-2 bg-[#d9482b] text-white text-xs font-bold rounded-xl"
          >
            + নতুন শিক্ষক যোগ করুন
          </button>
        </div>
      )}
    </div>
  );
}
