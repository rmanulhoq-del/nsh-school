import React, { useState, useEffect } from 'react';
import {
  Award,
  BookOpen,
  Sparkles,
  Building2,
  CheckCircle2,
  Landmark,
  MapPin,
  GraduationCap,
  ShieldCheck,
  Pencil,
  User,
  Calendar,
  History,
  Plus,
  Trash2,
  Clock,
  Briefcase
} from 'lucide-react';
import SchoolLogo from './SchoolLogo';
import HeadmasterPortrait from './HeadmasterPortrait';
import PresidentPortrait from './PresidentPortrait';

import { HeadmasterData, PresidentData } from '../types';

export interface HistoricalHeadmaster {
  id: string;
  serial: number;
  name: string;
  designation: string;
  tenureStart: string;
  tenureEnd: string;
  tenureDisplay: string;
  qualification: string;
  status: 'current' | 'former' | 'founder';
  specialContribution: string;
  photoUrl?: string;
}

const DEFAULT_HISTORICAL_HEADMASTERS: HistoricalHeadmaster[] = [
  {
    id: 'hm-1',
    serial: 1,
    name: 'মরহুম মাওলানা মোজাম্মেল হক',
    designation: 'প্রতিষ্ঠাতা প্রধান শিক্ষক',
    tenureStart: '১৯৬৪',
    tenureEnd: '১৯৭২',
    tenureDisplay: '১৯৬৪ – ১৯৭২ ইং (৮ বছর)',
    qualification: 'বি.এ, বি.এড, ফাজিল (প্রথম বিভাগ)',
    status: 'founder',
    specialContribution: 'উপকূলীয় বাঁশখালীর প্রত্যন্ত নাপোড়া ও শেখেরখীলে শিক্ষার আলো ছড়াতে বিদ্যালয়টির ভিত্তিপ্রস্তর স্থাপন ও প্রারম্ভিক অবকাঠামো গড়ে তোলা।'
  },
  {
    id: 'hm-2',
    serial: 2,
    name: 'জনাব মোহাম্মদ ইসহাক চৌধুরী',
    designation: 'সাবেক প্রধান শিক্ষক',
    tenureStart: '১৯৭২',
    tenureEnd: '১৯৮১',
    tenureDisplay: '১৯৭২ – ১৯৮১ ইং (৯ বছর)',
    qualification: 'এম.এ (ইতিহাস), বি.এড',
    status: 'former',
    specialContribution: 'মাধ্যমিক শিক্ষা বোর্ড, চট্টগ্রামের স্থায়ী স্বীকৃতি লাভ ও বিজ্ঞান বিভাগ চালুকরণে অগ্রণী ভূমিকা পালন।'
  },
  {
    id: 'hm-3',
    serial: 3,
    name: 'জনাব আহমদ ছফা চৌধুরী',
    designation: 'সাবেক প্রধান শিক্ষক',
    tenureStart: '১৯৮১',
    tenureEnd: '১৯৯৩',
    tenureDisplay: '১৯৮১ – ১৯৯৩ ইং (১২ বছর)',
    qualification: 'এম.এসসি (গণিত), বি.এড',
    status: 'former',
    specialContribution: 'বিদ্যালয়ের মূল পাকা একাডেমিক ভবন নির্মাণ, সহশিক্ষা কার্যক্রমের প্রসার ও পাবলিক পরীক্ষায় গৌরবোজ্জ্বল ফলাফল অর্জন।'
  },
  {
    id: 'hm-4',
    serial: 4,
    name: 'জনাব মোহাম্মদ নুরুল আবছার',
    designation: 'সাবেক প্রধান শিক্ষক',
    tenureStart: '১৯৯৩',
    tenureEnd: '২০০৪',
    tenureDisplay: '১৯৯৩ – ২০০৪ ইং (১১ বছর)',
    qualification: 'এম.এ (বাংলা), বি.এড',
    status: 'former',
    specialContribution: 'স্কাউটিং, গার্ল গাইডস ও বিজ্ঞান মেলায় আঞ্চলিক পর্যায়ে শীর্ষ স্থান অর্জন এবং আধুনিক পাঠদান পদ্ধতির প্রচলন।'
  },
  {
    id: 'hm-5',
    serial: 5,
    name: 'জনাব মোহাম্মদ আবুল বশর',
    designation: 'সাবেক প্রধান শিক্ষক',
    tenureStart: '২০০৪',
    tenureEnd: '২০১৭',
    tenureDisplay: '২০০৪ – ২০১৭ ইং (১৩ বছর)',
    qualification: 'এম.এ (ইংরেজি), বি.এড',
    status: 'former',
    specialContribution: 'বিদ্যালয়ে কম্পিউটার ল্যাব প্রতিষ্ঠা, শিক্ষক প্রশিক্ষণের উন্নয়ন এবং একাডেমিক স্বীকৃতির যুগোপযোগী নবায়ন।'
  },
  {
    id: 'hm-6',
    serial: 6,
    name: 'জনাব মোঃ জাহাঙ্গীর আলম',
    designation: 'বর্তমান প্রধান শিক্ষক ও সদস্য সচিব',
    tenureStart: '২০১৮',
    tenureEnd: 'বর্তমান',
    tenureDisplay: '২০১৮ – বর্তমান',
    qualification: 'এম.এসসি (পদার্থবিজ্ঞান), বি.এড (১ম শ্রেণি)',
    status: 'current',
    specialContribution: 'স্মার্ট স্কুল ব্যবস্থাপনা, ডিজিটাল বায়োমেট্রিক হাজিরা, কৃষি ব্যাংক ও আইএফআইসি ব্যাংকের মাধ্যমে অনলাইন ফি অটোমেশন এবং সার্বিক ডিজিটালাইজেশন।'
  }
];

interface AboutTabProps {
  language: 'bn' | 'en';
  isAdmin?: boolean;
  headmasterData?: HeadmasterData;
  onOpenEditHeadmaster?: () => void;
  presidentData?: PresidentData;
  onOpenEditPresident?: () => void;
  initialSection?: 'all' | 'overview' | 'headmasters';
}

export default function AboutTab({
  language,
  isAdmin = false,
  headmasterData,
  onOpenEditHeadmaster,
  presidentData,
  onOpenEditPresident,
  initialSection = 'all'
}: AboutTabProps) {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'headmasters'>(
    initialSection === 'headmasters' ? 'headmasters' : 'overview'
  );

  useEffect(() => {
    if (initialSection === 'headmasters') {
      setActiveSubTab('headmasters');
    } else if (initialSection === 'overview') {
      setActiveSubTab('overview');
    }
  }, [initialSection]);

  const [headmastersList, setHeadmastersList] = useState<HistoricalHeadmaster[]>(() => {
    try {
      const saved = localStorage.getItem('school_historical_headmasters');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_HISTORICAL_HEADMASTERS;
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<HistoricalHeadmaster | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    designation: 'সাবেক প্রধান শিক্ষক',
    tenureDisplay: '',
    qualification: '',
    status: 'former' as 'current' | 'former' | 'founder',
    specialContribution: ''
  });

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      designation: 'সাবেক প্রধান শিক্ষক',
      tenureDisplay: '',
      qualification: '',
      status: 'former',
      specialContribution: ''
    });
    setShowAddModal(true);
  };

  const handleOpenEdit = (item: HistoricalHeadmaster) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      designation: item.designation,
      tenureDisplay: item.tenureDisplay,
      qualification: item.qualification,
      status: item.status,
      specialContribution: item.specialContribution
    });
    setShowAddModal(true);
  };

  const handleSaveHeadmaster = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    let updated: HistoricalHeadmaster[];
    if (editingItem) {
      updated = headmastersList.map(h => (h.id === editingItem.id ? { ...h, ...formData } : h));
    } else {
      const newItem: HistoricalHeadmaster = {
        id: 'hm-' + Date.now(),
        serial: headmastersList.length + 1,
        name: formData.name,
        designation: formData.designation,
        tenureStart: '',
        tenureEnd: '',
        tenureDisplay: formData.tenureDisplay,
        qualification: formData.qualification,
        status: formData.status,
        specialContribution: formData.specialContribution
      };
      updated = [...headmastersList, newItem];
    }
    setHeadmastersList(updated);
    localStorage.setItem('school_historical_headmasters', JSON.stringify(updated));
    setShowAddModal(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`আপনি কি নিশ্চিত যে "${name}"-কে তালিকা থেকে মুছে ফেলতে চান?`)) {
      const updated = headmastersList.filter(h => h.id !== id);
      setHeadmastersList(updated);
      localStorage.setItem('school_historical_headmasters', JSON.stringify(updated));
    }
  };

  const handleResetToDefault = () => {
    if (confirm('প্রধান শিক্ষকগণের ইতিহাস তথ্য ডিফল্ট অবস্থায় ফিরিয়ে নিতে চান?')) {
      setHeadmastersList(DEFAULT_HISTORICAL_HEADMASTERS);
      localStorage.removeItem('school_historical_headmasters');
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub-tab Navigation Header */}
      <div className="bg-white border border-[#d9e6e7] rounded-2xl p-2.5 sm:p-3 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveSubTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeSubTab === 'overview'
                ? 'bg-[#0c3664] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-4 h-4 text-amber-300" />
            <span>{language === 'bn' ? 'বিস্তারিত বিবরণ ও ইতিহাস' : 'Overview & History'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('headmasters')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeSubTab === 'headmasters'
                ? 'bg-[#d9482b] text-white shadow-xs ring-2 ring-rose-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <History className="w-4 h-4 text-amber-200" />
            <span>{language === 'bn' ? 'প্রথম থেকে বর্তমান প্রধান শিক্ষকের তথ্যাবলী ও সময়কাল' : 'Headmasters Succession (1964 - Present)'}</span>
            <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full font-mono">{headmastersList.length} জন</span>
          </button>
        </div>

        {activeSubTab === 'headmasters' && isAdmin && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleOpenAdd}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>নতুন প্রধান শিক্ষক যোগ করুন</span>
            </button>
            <button
              type="button"
              onClick={handleResetToDefault}
              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-medium"
              title="ডিফল্ট তথ্যে রিসেট"
            >
              রিসেট
            </button>
          </div>
        )}
      </div>

      {/* VIEW 1: HEADMASTERS CHRONOLOGY & SUCCESSION TIMELINE */}
      {activeSubTab === 'headmasters' && (
        <div className="bg-white border border-[#d9e6e7] rounded-3xl p-6 md:p-10 shadow-xs space-y-8 animate-in fade-in duration-200">
          <div className="border-b border-slate-200 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#f0f6f6] border border-[#d2e5e7] text-[#0c3664] mb-2">
                <History className="w-3.5 h-3.5 text-[#d9482b]" />
                <span>ঐতিহাসিক ধারাবাহিকতা (১৯৬৪ - বর্তমান)</span>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 leading-tight">
                {language === 'bn'
                  ? 'প্রথম থেকে বর্তমান প্রধান শিক্ষকের তথ্যাবলী ও সময়কাল'
                  : 'Chronological Succession & Timeline of Honorable Headmasters'}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                ১৯৬৪ সালে বিদ্যালয় প্রতিষ্ঠার পর থেকে অদ্যবধি পর্যন্ত নিষ্ঠাবান যে সকল শিক্ষানুরাগী প্রধান শিক্ষক প্রতিষ্ঠানটির দায়িত্বভার বহন করেছেন তাঁদের পূর্ণাঙ্গ তথ্যাবলী।
              </p>
            </div>

            <div className="bg-[#f0f6f6] border border-[#d2e5e7] p-4 rounded-2xl flex items-center gap-3 shrink-0">
              <div className="w-12 h-12 rounded-xl bg-[#0c3664] text-white flex items-center justify-center font-bold text-lg">
                ৬২+
              </div>
              <div className="text-xs">
                <div className="font-bold text-slate-800">বছরের গৌরবোজ্জ্বল ইতিহাস</div>
                <div className="text-slate-500">মোট {headmastersList.length} জন প্রধান শিক্ষক দায়িত্ব পালন করেছেন</div>
              </div>
            </div>
          </div>

          {/* Current Headmaster Spotlight Card */}
          {headmasterData && (
            <div className="p-6 bg-gradient-to-r from-[#0c3664] to-[#12427a] text-white rounded-3xl shadow-md border-2 border-amber-400/40 relative overflow-hidden">
              <div className="absolute right-0 top-0 bottom-0 w-64 bg-white/5 transform skew-x-12 pointer-events-none" />
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-2 border-amber-400 bg-amber-50 overflow-hidden shrink-0 shadow-lg">
                  {headmasterData.photoUrl ? (
                    <img
                      src={headmasterData.photoUrl}
                      alt={headmasterData.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <HeadmasterPortrait size="100%" className="w-full h-full object-cover" />
                  )}
                </div>

                <div className="space-y-2 text-center md:text-left flex-1">
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-500 text-white flex items-center gap-1 shadow-xs">
                      <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                      বর্তমান প্রধান শিক্ষক
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-400 text-slate-950">
                      ২০১৮ – বর্তমান
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    {headmasterData.name}
                  </h3>
                  <div className="text-xs text-amber-200 font-medium">
                    {headmasterData.qualification} · {headmasterData.subject}
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed max-w-3xl pt-1">
                    "{headmasterData.messageBody}"
                  </p>
                </div>

                {isAdmin && onOpenEditHeadmaster && (
                  <button
                    type="button"
                    onClick={onOpenEditHeadmaster}
                    className="shrink-0 px-3 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    <span>তথ্য ও ছবি পরিবর্তন</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Chronological Table of All Headmasters */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#d9482b]" />
                <span>প্রথম থেকে বর্তমান প্রধান শিক্ষকের পূর্ণাঙ্গ তালিকা (সময়কালসহ)</span>
              </h3>
              <span className="text-xs text-slate-500 font-medium">ক্রম অনুসারে সাজানো</span>
            </div>

            <div className="overflow-x-auto border border-[#d9e6e7] rounded-2xl bg-white shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0c3664] text-white">
                  <tr>
                    <th className="p-3.5 text-center font-bold w-12">নং</th>
                    <th className="p-3.5 font-bold">প্রধান শিক্ষকের নাম ও পদবি</th>
                    <th className="p-3.5 font-bold">কার্যকাল / সময়কাল</th>
                    <th className="p-3.5 font-bold">শিক্ষাগত যোগ্যতা</th>
                    <th className="p-3.5 font-bold">বিশেষ অবদান ও ভূমিকা</th>
                    <th className="p-3.5 text-center font-bold">অবস্থা</th>
                    {isAdmin && <th className="p-3.5 text-center font-bold">অ্যাকশন</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {headmastersList.map((hm, idx) => (
                    <tr
                      key={hm.id}
                      className={`hover:bg-[#f8fbfb] transition-colors ${
                        hm.status === 'current'
                          ? 'bg-amber-50/50 font-medium'
                          : hm.status === 'founder'
                          ? 'bg-emerald-50/30'
                          : ''
                      }`}
                    >
                      <td className="p-3.5 text-center font-bold text-slate-600">
                        {idx + 1}
                      </td>
                      <td className="p-3.5 font-bold text-slate-900">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                            hm.status === 'current'
                              ? 'bg-[#0c3664] text-white'
                              : hm.status === 'founder'
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-200 text-slate-700'
                          }`}>
                            {idx + 1}
                          </div>
                          <div>
                            <div className="text-slate-900 font-bold">{hm.name}</div>
                            <div className="text-[11px] text-slate-500">{hm.designation}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5 text-slate-700">
                        <span className="font-bold text-[#0c3664] bg-[#f0f6f6] border border-[#d2e5e7] px-2 py-0.5 rounded-md inline-block">
                          {hm.tenureDisplay}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-600">
                        {hm.qualification || '—'}
                      </td>
                      <td className="p-3.5 text-slate-600 max-w-xs leading-relaxed">
                        {hm.specialContribution}
                      </td>
                      <td className="p-3.5 text-center">
                        {hm.status === 'current' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            বর্তমান প্রধান শিক্ষক
                          </span>
                        )}
                        {hm.status === 'founder' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                            প্রতিষ্ঠাতা প্রধান শিক্ষক
                          </span>
                        )}
                        {hm.status === 'former' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                            সাবেক প্রধান শিক্ষক
                          </span>
                        )}
                      </td>
                      {isAdmin && (
                        <td className="p-3.5 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(hm)}
                              className="p-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-md transition-colors"
                              title="এডিট করুন"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(hm.id, hm.name)}
                              className="p-1.5 bg-rose-100 hover:bg-rose-200 text-rose-800 rounded-md transition-colors"
                              title="ডিলিট করুন"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tribute & Historical Significance Note */}
          <div className="p-5 bg-[#f0f6f6] border border-[#d2e5e7] rounded-2xl flex items-start gap-3">
            <Award className="w-5 h-5 text-[#d9482b] shrink-0 mt-0.5" />
            <div className="text-xs text-slate-600 leading-relaxed">
              <strong className="text-slate-900 font-bold block mb-1">
                প্রধান শিক্ষকগণের অবদানের প্রতি সশ্রদ্ধ কৃতজ্ঞতা:
              </strong>
              ১৯৬৪ সালে বিদ্যালয় প্রতিষ্ঠার শুভলগ্নে বাঁশখালীর দক্ষিণ উপকূলীয় পিছিয়ে পড়া নাপোড়া ও শেখেরখীল এলাকার শিক্ষার্থীদের জন্য প্রদীপ জ্বালিয়েছিলেন প্রথম প্রধান শিক্ষক মরহুম মাওলানা মোজাম্মেল হক। এরপর বিগত ৬ দশকেরও বেশি সময় ধরে ধারাবাহিক নেতৃত্ব দিয়ে বর্তমান প্রধান শিক্ষক জনাব মোঃ জাহাঙ্গীর আলমের হাত ধরে প্রতিষ্ঠানটি আজ ডিজিটাল রূপান্তরের অনন্য শিখরে আসীন হয়েছে।
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: FULL DETAILED OVERVIEW & HISTORY (Standard AboutTab view) */}
      {activeSubTab === 'overview' && (
        <div className="bg-white border border-[#d9e6e7] rounded-3xl p-6 md:p-10 shadow-xs space-y-8 animate-in fade-in duration-200">
          
          {/* Top Banner with Monogram */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 pb-8 border-b border-slate-200">
            <div className="space-y-4 max-w-2xl text-center lg:text-left">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 text-xs">
                <span className="font-bold text-[#0c3664] bg-[#f0f6f6] px-2.5 py-1 rounded-md border border-[#d2e5e7]">
                  {language === 'bn' ? 'ইআইআইএন: ১০৪০৬২' : 'EIIN: 104062'}
                </span>
                <span className="font-bold text-[#d9482b] bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200">
                  {language === 'bn' ? 'স্থাপিত : ১৯৬৪ ইং' : 'Established: 1964'}
                </span>
                <span className="text-slate-500 font-medium">
                  {language === 'bn' ? '· মাধ্যমিক ও উচ্চ মাধ্যমিক শিক্ষা বোর্ড, চট্টগ্রাম' : '· BISE, Chattogram'}
                </span>
              </div>
              
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight">
                {language === 'bn' ? 'নাপোড়া শেখেরখীল উচ্চ বিদ্যালয়' : 'Napora Shekherkhil High School'}
              </h1>

              <p className="text-sm text-slate-600 leading-relaxed">
                {language === 'bn'
                  ? 'চট্টগ্রাম জেলার বাঁশখালী উপজেলার সমুদ্র উপকূলীয় সবুজ শ্যামল নাপোড়া ও শেখেরখীল অঞ্চলের জ্ঞানালোকের প্রতীক। ১৯৬৪ সালে প্রত্যন্ত এ অঞ্চলের বিদ্যোৎসাহী গুণীজনদের নিরলস প্রচেষ্টায় বিদ্যালয়টি প্রতিষ্ঠিত হয়। বিগত ৬২ বছরেরও বেশি সময় ধরে প্রতিষ্ঠানটি সহস্রাধিক যোগ্য নাগরিক, শিক্ষক, চিকিৎসক, প্রকৌশলী, সরকারি কর্মকর্তা ও উদ্যোক্তা গড়ে তুলেছে।'
                  : 'A prestigious educational institution located at the confluence of Napora and Shekherkhil in Banshkhali Upazila, Chattogram. Founded in 1964 by dedicated education enthusiasts, it has nurtured generations of scholars, leaders, doctors, engineers, and patriotic citizens for over 6 decades.'}
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2 text-xs">
                <div className="bg-[#f0f6f6] border border-[#d2e5e7] px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-slate-700">
                  <MapPin className="w-3.5 h-3.5 text-[#d9482b]" />
                  <span>{language === 'bn' ? 'ডাক: নাপোড়া, উপজেলা: বাঁশখালী, জেলা: চট্টগ্রাম' : 'Post: Napora, Banshkhali, Chattogram'}</span>
                </div>
                <div className="bg-[#f0f6f6] border border-[#d2e5e7] px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-slate-700">
                  <GraduationCap className="w-3.5 h-3.5 text-[#0c3664]" />
                  <span>{language === 'bn' ? 'শ্রেণি: ৬ষ্ঠ থেকে ১০ম (শাখা: ক, খ, গ, ঘ)' : 'Grades: 6 to 10 (Sections A, B, C, D)'}</span>
                </div>
              </div>
            </div>

            {/* Monogram Badge Card */}
            <div className="shrink-0 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-[#f0f6f6] to-[#e4eff0] border-2 border-[#d2e5e7] rounded-3xl text-center shadow-xs">
              <div className="mb-2.5 text-base sm:text-lg font-black text-[#d9482b] italic tracking-wide">
                "পড় স্রষ্টার নামে"
              </div>
              <SchoolLogo size={140} className="drop-shadow-md hover:scale-105 transition-transform" />
              <div className="mt-3 text-sm font-bold text-slate-900">
                {language === 'bn' ? 'বিদ্যালয়ের অফিশিয়াল মনোগ্রাম' : 'Official School Emblem'}
              </div>
              <div className="text-[11px] text-slate-600 font-semibold mt-1">
                {language === 'bn' ? 'স্থাপিত : ১৯৬৪ ইং · বাঁশখালী, চট্টগ্রাম' : 'Est. 1964 · Banshkhali, Chattogram'}
              </div>
            </div>
          </div>

          {/* Quick link button to Headmasters timeline */}
          <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 text-xs text-amber-900">
              <History className="w-5 h-5 text-amber-700 shrink-0" />
              <div>
                <span className="font-bold text-sm block">প্রথম থেকে বর্তমান প্রধান শিক্ষকের তথ্যাবলী ও সময়কাল দেখতে চান?</span>
                <span className="text-amber-800">১৯৬৪ সাল থেকে বর্তমান পর্যন্ত সকল প্রধান শিক্ষকের বিস্তারিত কার্যকাল ও ইতিহাস সংযোজিত হয়েছে।</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActiveSubTab('headmasters')}
              className="shrink-0 px-4 py-2 bg-[#d9482b] hover:bg-[#b8381e] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
            >
              <span>সময়কাল ও তালিকা দেখুন</span>
              <span>→</span>
            </button>
          </div>

          {/* Comprehensive Sections: Deep Research Profile */}
          <div className="space-y-8">
            
            {/* 1. Monogram Symbolism (Deep Analysis) */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-[#d9482b]" />
                <h2 className="text-lg font-bold text-slate-900">
                  {language === 'bn' ? 'বিদ্যালয়ের মনোগ্রাম ও প্রতীকের অন্তর্নিহিত তাৎপর্য' : 'Significance of School Emblem & Motto'}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600 leading-relaxed">
                <div className="p-5 bg-[#f0f6f6] border border-[#d2e5e7] rounded-2xl space-y-2">
                  <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#d9482b]" />
                    <span>{language === 'bn' ? '১. মূল নীতিবাক্য: "পড় স্রষ্টার নামে"' : '1. Motto: "Read in the Name of Lord"'}</span>
                  </div>
                  <p>
                    {language === 'bn'
                      ? 'পবিত্র মহাগ্রন্থ আল-কুরআনের প্রথম অবতীর্ণ বাণী "ইকরা বিসমি রাব্বিকা"—যা প্রত্যেক শিক্ষার্থীর অন্তরে স্রষ্টাপ্রেম, সততা, মানবিক মূল্যবোধ ও নৈতিক চরিত্রের অবিচল ভিত্তি স্থাপন করে।'
                      : 'The core motto instills divine reverence, ethical integrity, and humane compassion in students from day one.'}
                  </p>
                </div>

                <div className="p-5 bg-[#f0f6f6] border border-[#d2e5e7] rounded-2xl space-y-2">
                  <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#d9482b]" />
                    <span>{language === 'bn' ? '২. উদীয়মান রক্তিম সূর্য ও বিচ্ছুরিত কিরণ' : '2. Rising Crimson Sun & Radiance'}</span>
                  </div>
                  <p>
                    {language === 'bn'
                      ? 'অজ্ঞতা ও কুসংস্কারের তিমির বিদূরিত করে উপকূলীয় বাঁশখালীর জনপদে সত্য ও আধুনিক জ্ঞান-বিজ্ঞানের নবপ্রভাত সূচনা করার চিরন্তন আলোকোজ্জ্বল অঙ্গীকার।'
                      : 'Dispels the darkness of ignorance, heralding an enlightened dawn across coastal Banshkhali with the light of knowledge.'}
                  </p>
                </div>

                <div className="p-5 bg-[#f0f6f6] border border-[#d2e5e7] rounded-2xl space-y-2">
                  <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#0c3664]" />
                    <span>{language === 'bn' ? '৩. উন্মুক্ত কিতাব, জোড়া তারকা ও নীল সীমানা' : '3. Open Book, Stars & Royal Blue Orbit'}</span>
                  </div>
                  <p>
                    {language === 'bn'
                      ? 'উন্মুক্ত পুস্তক অবাধ জ্ঞানার্জনের প্রতীক; দুই শুভ্র তারকা শৃঙ্খলা ও উজ্জ্বল ভবিষ্যতের দিশারী এবং সমুদ্র-নীল বৃত্তাকার বন্ধনী নাপোড়া-শেখেরখীলের ভৌগোলিক মর্যাদাকে নির্দেশ করে।'
                      : 'The open book represents accessible learning, while twin white stars reflect discipline and the limitless potential of students.'}
                  </p>
                </div>
              </div>
            </div>

            {/* 2. Historical Background & Vision-Mission */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
              <div className="p-6 bg-[#f0f6f6] border border-[#d2e5e7] rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                  <BookOpen className="w-4 h-4 text-[#0c3664]" />
                  <span>{language === 'bn' ? 'ঐতিহাসিক পটভূমি ও আত্মপ্রকাশ' : 'Historical Overview'}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {language === 'bn'
                    ? '১৯৬৪ সালে বাঁশখালী উপজেলার দক্ষিণ প্রান্তে উপকূলীয় বঙ্গোপসাগরের কোল ঘেঁষে অবস্থিত নাপোড়া ও শেখেরখীল অঞ্চলের শিক্ষাব্রতী ব্যক্তিবর্গের আন্তরিক দানে এই বিদ্যাপীঠ যাত্রা শুরু করে। তৎকালে এ অঞ্চলে মাধ্যমিক শিক্ষার সুযোগ সীমিত থাকায় বিদ্যালয়টি আশপাশের বহু গ্রাম ও চরাঞ্চলের শিক্ষার্থীদের একমাত্র নির্ভরযোগ্য বাতিঘরে পরিণত হয়। দীর্ঘ ছয় দশকের ধারাবাহিকতায় বিদ্যালয়টি আজ বিজ্ঞান, মানবিক ও কারিগরি ভাবনায় যুগোপযোগী পূর্ণাঙ্গ রূপ পরিগ্রহ করেছে।'
                    : 'Napora Shekherkhil High School was founded in 1964 by local benefactors and educators to provide secondary education to the coastal youth of Banshkhali. For over sixty years, it has stood as the beacon of academic excellence in southern Chattogram.'}
                </p>
              </div>

              <div className="p-6 bg-[#f0f6f6] border border-[#d2e5e7] rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                  <Sparkles className="w-4 h-4 text-[#d9482b]" />
                  <span>{language === 'bn' ? 'লক্ষ্য, উদ্দেশ্য ও ভিশন ২০৪১' : 'Vision & Mission'}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {language === 'bn'
                    ? 'আমাদের মূল লক্ষ্য হলো প্রতিটি শিক্ষার্থীকে তথ্যপ্রযুক্তি জ্ঞানে পারদর্শী, সততা ও দেশপ্রেমে উদ্বুদ্ধ এবং চতুর্থ শিল্পবিপ্লবের বৈশ্বিক প্রতিযোগিতায় যোগ্য করে গড়ে তোলা। কেবল পাঠ্যবইয়ের সীমাবদ্ধ গণ্ডি নয়, বরং চরিত্র গঠন, উদ্ভাবনী চিন্তা, ক্রীড়া ও সমাজসেবামূলক কর্মকাণ্ডে শিক্ষার্থীদের সমানভাবে উৎসাহিত করা হয়।'
                    : 'To provide quality, inclusive, and technology-driven education that shapes students into disciplined, morally upright, and academically competent citizens ready to serve the nation.'}
                </p>
              </div>
            </div>

            {/* 3. Facilities & Modern Infrastructure */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#0c3664]" />
                <span>{language === 'bn' ? 'অবকাঠামো ও অনন্য সুযোগ-সুবিধাসমূহ' : 'Campus Infrastructure & Facilities'}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                <div className="p-4 bg-white border border-[#d2e5e7] rounded-xl space-y-1.5 shadow-xs">
                  <div className="font-bold text-[#0c3664] flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>ডিজিটাল কম্পিউটার ল্যাব</span>
                  </div>
                  <p className="text-slate-500 text-[11px]">
                    উচ্চগতির ইন্টারনেট সুবিধাসহ অত্যাধুনিক কম্পিউটার ল্যাব ও আইসিটি প্রশিক্ষণ।
                  </p>
                </div>

                <div className="p-4 bg-white border border-[#d2e5e7] rounded-xl space-y-1.5 shadow-xs">
                  <div className="font-bold text-[#0c3664] flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>বিজ্ঞান গবেষণাগার</span>
                  </div>
                  <p className="text-slate-500 text-[11px]">
                    পদার্থ, রসায়ন ও জীববিজ্ঞানের বাস্তব পরীক্ষার জন্য সুসজ্জিত ব্যবহারিক ল্যাব।
                  </p>
                </div>

                <div className="p-4 bg-white border border-[#d2e5e7] rounded-xl space-y-1.5 shadow-xs">
                  <div className="font-bold text-[#0c3664] flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>সুপরিসর খেলার মাঠ ও শহীদ মিনার</span>
                  </div>
                  <p className="text-slate-500 text-[11px]">
                    বিদ্যালয় প্রাঙ্গণে জাতীয় শহীদ মিনার, প্রশস্ত ফুটবল-ক্রিকেট মাঠ ও শরীরচর্চা অঙ্গন।
                  </p>
                </div>

                <div className="p-4 bg-white border border-[#d2e5e7] rounded-xl space-y-1.5 shadow-xs">
                  <div className="font-bold text-[#0c3664] flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>ডিজিটাল ব্যাংক ফি সমন্বয়</span>
                  </div>
                  <p className="text-slate-500 text-[11px]">
                    কৃষি ব্যাংক ও আইএফআইসি ব্যাংকের মাধ্যমে শিক্ষার্থীদের ফি তাৎক্ষণিক অটো-আপডেট।
                  </p>
                </div>
              </div>
            </div>

            {/* 4. Leadership & Messages: President & Headmaster */}
            <div className="space-y-6 pt-4 border-t border-slate-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* President of Managing Committee Card */}
                <div className="p-6 bg-white border-2 border-[#0c3664]/30 rounded-2xl space-y-4 shadow-xs relative">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs text-[#0c3664] font-bold">
                      <ShieldCheck className="w-4 h-4 text-[#d9482b]" />
                      <span>{language === 'bn' ? 'বর্তমান পরিচালনা কমিটির সভাপতি মহোদয়ের দিকনির্দেশনা' : 'Message from Committee President'}</span>
                    </div>
                    {isAdmin && onOpenEditPresident && (
                      <button
                        type="button"
                        onClick={onOpenEditPresident}
                        className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors shadow-2xs"
                        title="সভাপতি মহোদয়ের তথ্য ও ছবি এডিট করুন"
                      >
                        <Pencil className="w-3 h-3 text-amber-700" />
                        <span>সভাপতির তথ্য ও ছবি এডিট</span>
                      </button>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    {/* President Photo */}
                    <div
                      onClick={isAdmin ? onOpenEditPresident : undefined}
                      className={`w-18 h-18 sm:w-20 sm:h-20 rounded-2xl border-2 border-amber-400 bg-blue-50/70 overflow-hidden shrink-0 flex items-center justify-center shadow-xs relative ${
                        isAdmin ? 'cursor-pointer group' : ''
                      }`}
                      title={isAdmin ? 'ছবি পরিবর্তন করতে ক্লিক করুন' : presidentData?.name}
                    >
                      {presidentData?.photoUrl ? (
                        <img
                          src={presidentData.photoUrl}
                          alt={presidentData.name}
                          className={`w-full h-full object-cover transition-transform ${isAdmin ? 'group-hover:scale-105' : ''}`}
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <PresidentPortrait size="100%" className={`w-full h-full object-cover transition-transform ${isAdmin ? 'group-hover:scale-105' : ''}`} />
                      )}
                      {isAdmin && (
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-[10px] font-bold">
                          এডিট
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed italic flex-1">
                      {language === 'bn'
                        ? `"${presidentData?.messageBody || 'নাপোড়া শেখেরখীল উচ্চ বিদ্যালয় কেবল একটি সাধারণ শিক্ষালয় নয়, এটি বাঁশখালীর দক্ষিণ উপকূলের ঐতিহ্যবাহী বাতিঘর। নৈতিকতা, শৃঙ্খলা, আধুনিক প্রযুক্তি ও সুষম শিক্ষার আলোয় প্রতিটি শিক্ষার্থীকে আলোকিত মানুষ ও দেশপ্রেমিক সুনাগরিক হিসেবে গড়ে তোলার মহান ব্রতে আমাদের পরিচালনা পর্ষদ সর্বদা নিবেদিত।'}"`
                        : '"Napora Shekherkhil High School stands as a proud bastion of wisdom, discipline and morality across coastal Banshkhali. Our managing committee is dedicated to shaping patriotic and capable leaders of tomorrow."'}
                    </p>
                  </div>

                  <div className="text-xs font-semibold text-slate-800 pt-3 border-t border-slate-150">
                    <span className="font-bold text-[#0c3664] block text-sm">
                      {presidentData?.name || 'অধ্যক্ষ জনাব মোঃ আবদুল কাদের'}
                    </span>
                    <span className="text-slate-500 text-[11px]">
                      {presidentData?.designation || 'সভাপতি, বিদ্যালয় পরিচালনা পরিষদ'} · {presidentData?.profession || 'বিশিষ্ট শিক্ষাবিদ'}
                    </span>
                  </div>
                </div>

                {/* Headmaster's Message Card with Edit Button & Photo */}
                <div className="p-6 bg-[#f0f6f6] border border-[#d2e5e7] rounded-2xl space-y-4 shadow-xs relative">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Award className="w-4 h-4 text-[#d9482b]" />
                      <span>{language === 'bn' ? 'প্রধান শিক্ষকের শুভেচ্ছা বাণী' : 'Message from Headmaster'}</span>
                    </h3>
                    {isAdmin && onOpenEditHeadmaster && (
                      <button
                        type="button"
                        onClick={onOpenEditHeadmaster}
                        className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors shadow-2xs"
                        title="প্রধান শিক্ষকের নাম, পদবি, ছবি ও বাণী এডিট করুন"
                      >
                        <Pencil className="w-3 h-3 text-amber-700" />
                        <span>হেড স্যারের তথ্য ও ছবি এডিট</span>
                      </button>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    {/* Headmaster Photo */}
                    <div
                      onClick={isAdmin ? onOpenEditHeadmaster : undefined}
                      className={`w-18 h-18 sm:w-20 sm:h-20 rounded-2xl border-2 border-[#0c3664] bg-amber-50/70 overflow-hidden shrink-0 flex items-center justify-center shadow-xs relative ${
                        isAdmin ? 'cursor-pointer group' : ''
                      }`}
                      title={isAdmin ? 'ছবি পরিবর্তন করতে ক্লিক করুন' : headmasterData?.name}
                    >
                      {headmasterData?.photoUrl ? (
                        <img
                          src={headmasterData.photoUrl}
                          alt={headmasterData.name}
                          className={`w-full h-full object-cover transition-transform ${isAdmin ? 'group-hover:scale-105' : ''}`}
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <HeadmasterPortrait size="100%" className={`w-full h-full object-cover transition-transform ${isAdmin ? 'group-hover:scale-105' : ''}`} />
                      )}
                      {isAdmin && (
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-[10px] font-bold">
                          এডিট
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed italic flex-1">
                      {language === 'bn'
                        ? `"${headmasterData?.messageBody || 'নাপোড়া শেখেরখীল উচ্চ বিদ্যালয় কেবল সিলেবাসের পাঠ মুখস্থ করানোর কোনো কারখানা নয়; এটি মানবিক চরিত্র গঠন, সততা এবং দেশপ্রেমের উন্মুক্ত বিদ্যাপীঠ। শিক্ষকমণ্ডলীর অক্লান্ত পরিশ্রম, পরিচালনা পর্ষদের দূরদর্শী দিকনির্দেশনা এবং অভিভাবকদের গঠনমূলক সহযোগিতায় আমরা প্রতিনিয়ত এগিয়ে চলেছি।'}"`
                        : '"Napora Shekherkhil High School is dedicated to nurturing honest, skilled, and compassionate human beings. With our faculty dedication, board leadership, and real-time bank reconciliation system, we are setting a benchmark for smart school management."'}
                    </p>
                  </div>

                  <div className="text-xs font-semibold text-slate-800 pt-3 border-t border-slate-200">
                    <span className="font-bold text-slate-900 block text-sm">
                      {headmasterData?.name || 'জনাব মোঃ জাহাঙ্গীর আলম'}
                    </span>
                    <span className="text-slate-500 text-[11px]">
                      {headmasterData?.designation || 'প্রধান শিক্ষক ও সদস্য সচিব'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Banking Partnership Card */}
              <div className="p-6 bg-[#f0f6f6] border border-[#d2e5e7] rounded-2xl space-y-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Landmark className="w-4 h-4 text-[#0c3664]" />
                  <span>{language === 'bn' ? 'ব্যাংকিং অংশীদারিত্ব ও অর্থনৈতিক স্বচ্ছতা' : 'Banking Partnerships'}</span>
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {language === 'bn'
                    ? 'বিদ্যালয়ের যাবতীয় ফি কালেকশন সরাসরি সরকারের নির্দেশনামাফিক নাপোড়া বাজারস্থ দুটি ব্যাংকে পরিচালিত হয়:'
                    : 'All tuition and exam collections are processed through two authorized banking outlets in Napora Bazar:'}
                </p>
                <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4">
                  <li>
                    <strong>বাংলাদেশ কৃষি ব্যাংক (নাপোড়া বাজার শাখা, বাঁশখালী)</strong> — নিয়মিত মাসিক ফি ও পাবলিক পরীক্ষার ফি।
                  </li>
                  <li>
                    <strong>আইএফআইসি ব্যাংক পিএলসি (নাপোড়া বাজার উপশাখা, বাঁশখালী)</strong> — বিজ্ঞানাগার, আইসিটি ও অবকাঠামো উন্নয়ন তহবিল।
                  </li>
                </ul>
                <div className="text-[11px] text-emerald-700 bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                  {language === 'bn' ? '✓ ব্যাংকে টাকা জমা হওয়ামাত্রই প্রধান শিক্ষক ১-ক্লিকে তা অনলাইন ড্যাশবোর্ডে দেখতে পারেন।' : '✓ Instant automated fee reconciliation upon bank deposit.'}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Admin Modal to Add / Edit Historical Headmaster */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border-2 border-slate-200 animate-in zoom-in-95 duration-150">
            <h3 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <History className="w-5 h-5 text-[#d9482b]" />
              <span>{editingItem ? 'প্রধান শিক্ষকের তথ্য সম্পাদনা' : 'নতুন প্রধান শিক্ষকের তথ্য যোগ'}</span>
            </h3>

            <form onSubmit={handleSaveHeadmaster} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">প্রধান শিক্ষকের পুরো নাম *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="যেমন: জনাব আহমদ ছফা চৌধুরী"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0c3664] focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">পদবি</label>
                  <input
                    type="text"
                    value={formData.designation}
                    onChange={e => setFormData({ ...formData, designation: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0c3664] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">অবস্থা (Status)</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0c3664] focus:outline-hidden"
                  >
                    <option value="former">সাবেক প্রধান শিক্ষক</option>
                    <option value="current">বর্তমান প্রধান শিক্ষক</option>
                    <option value="founder">প্রতিষ্ঠাতা প্রধান শিক্ষক</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">কার্যকাল / সময়কাল *</label>
                  <input
                    type="text"
                    required
                    value={formData.tenureDisplay}
                    onChange={e => setFormData({ ...formData, tenureDisplay: e.target.value })}
                    placeholder="যেমন: ১৯৮১ – ১৯৯৩ ইং"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0c3664] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">শিক্ষাগত যোগ্যতা</label>
                  <input
                    type="text"
                    value={formData.qualification}
                    onChange={e => setFormData({ ...formData, qualification: e.target.value })}
                    placeholder="যেমন: এম.এসসি (গণিত), বি.এড"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0c3664] focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">বিশেষ অবদান ও ঐতিহাসিক ভূমিকা</label>
                <textarea
                  rows={3}
                  value={formData.specialContribution}
                  onChange={e => setFormData({ ...formData, specialContribution: e.target.value })}
                  placeholder="বিদ্যালয়ের উন্নয়ন ও পাঠদানে তাঁর বিশেষ অবদান..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0c3664] focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0c3664] hover:bg-[#12427a] text-white font-bold rounded-xl shadow-xs"
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
