import React, { useState } from 'react';
import {
  Users,
  ShieldCheck,
  Plus,
  Pencil,
  Trash2,
  Printer,
  Phone,
  Search,
  X,
  Save,
  CheckCircle2,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { CommitteeMember, PresidentData } from '../types';
import { INITIAL_COMMITTEE } from './CommitteeAndDonorsTab';
import PresidentPortrait from './PresidentPortrait';

interface CommitteeTabProps {
  isAdmin: boolean;
  onPrint?: () => void;
  presidentData?: PresidentData;
  onOpenEditPresident?: () => void;
}

export default function CommitteeTab({
  isAdmin,
  onPrint,
  presidentData,
  onOpenEditPresident
}: CommitteeTabProps) {
  const [committeeList, setCommitteeList] = useState<CommitteeMember[]>(() => {
    try {
      const saved = localStorage.getItem('school_committee_members');
      if (saved) {
        const parsed: CommitteeMember[] = JSON.parse(saved);
        const updated = parsed.map(m => {
          if (m.category === 'president' || m.role.includes('সভাপতি')) {
            return {
              ...m,
              name: 'অধ্যক্ষ জনাব মোঃ আবদুল কাদের',
              profession: 'অধ্যক্ষ ও বিশিষ্ট শিক্ষাবিদ',
              responsibility: 'বিদ্যালয় পরিচালনা পরিষদের সার্বিক নীতি নির্ধারণ ও প্রশাসনিক দিকনির্দেশনা'
            };
          }
          return m;
        });
        localStorage.setItem('school_committee_members', JSON.stringify(updated));
        return updated;
      }
      return INITIAL_COMMITTEE;
    } catch {
      return INITIAL_COMMITTEE;
    }
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // Add Member Modal
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('অভিভাবক প্রতিনিধি (Guardian Representative)');
  const [newMemberPhone, setNewMemberPhone] = useState('');
  const [newMemberProfession, setNewMemberProfession] = useState('');
  const [newMemberTenure, setNewMemberTenure] = useState('২০২৪ – ২০২৬');
  const [newMemberResponsibility, setNewMemberResponsibility] = useState('');

  // Edit Member Modal
  const [showEditMemberModal, setShowEditMemberModal] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState('');
  const [editMemberName, setEditMemberName] = useState('');
  const [editMemberRole, setEditMemberRole] = useState('');
  const [editMemberPhone, setEditMemberPhone] = useState('');
  const [editMemberProfession, setEditMemberProfession] = useState('');
  const [editMemberTenure, setEditMemberTenure] = useState('');
  const [editMemberResponsibility, setEditMemberResponsibility] = useState('');

  const showFeedback = (msg: string) => {
    setActionFeedback(msg);
    setTimeout(() => setActionFeedback(null), 4000);
  };

  const handlePrint = () => {
    if (onPrint) onPrint();
    else window.print();
  };

  // Add Member
  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;

    let category: CommitteeMember['category'] = 'guardian_rep';
    if (newMemberRole.includes('সভাপতি')) category = 'president';
    else if (newMemberRole.includes('সচিব')) category = 'secretary';
    else if (newMemberRole.includes('শিক্ষক')) category = 'teacher_rep';
    else if (newMemberRole.includes('বিদ্যোৎসাহী')) category = 'enthusiast';
    else if (newMemberRole.includes('দাতা')) category = 'donor_rep';
    else if (newMemberRole.includes('কর্মকর্তা')) category = 'official';

    const newMember: CommitteeMember = {
      id: `SMC-${Date.now().toString().slice(-4)}`,
      name: newMemberName.trim(),
      role: newMemberRole,
      category,
      phone: newMemberPhone.trim() || '০১৮XX-XXXXXX',
      profession: newMemberProfession.trim() || 'সমাজসেবক',
      tenure: newMemberTenure.trim() || '২০২৪ – ২০২৬',
      responsibility: newMemberResponsibility.trim() || 'কমিটির সাধারণ দায়িত্ব পালন'
    };

    const updated = [...committeeList, newMember];
    setCommitteeList(updated);
    try {
      localStorage.setItem('school_committee_members', JSON.stringify(updated));
    } catch {}

    setNewMemberName('');
    setNewMemberPhone('');
    setNewMemberProfession('');
    setNewMemberResponsibility('');
    setShowAddMemberModal(false);
    showFeedback(`সদস্য "${newMember.name}" সফলভাবে পরিচালনা কমিটিতে যুক্ত হয়েছেন।`);
  };

  // Open Edit Modal
  const handleOpenEdit = (member: CommitteeMember) => {
    setEditingMemberId(member.id);
    setEditMemberName(member.name);
    setEditMemberRole(member.role);
    setEditMemberPhone(member.phone);
    setEditMemberProfession(member.profession);
    setEditMemberTenure(member.tenure);
    setEditMemberResponsibility(member.responsibility);
    setShowEditMemberModal(true);
  };

  // Save Edit
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editMemberName.trim()) return;

    const updated = committeeList.map(m => {
      if (m.id === editingMemberId) {
        let category = m.category;
        if (editMemberRole.includes('সভাপতি')) category = 'president';
        else if (editMemberRole.includes('সচিব')) category = 'secretary';
        else if (editMemberRole.includes('শিক্ষক')) category = 'teacher_rep';
        else if (editMemberRole.includes('বিদ্যোৎসাহী')) category = 'enthusiast';
        else if (editMemberRole.includes('দাতা')) category = 'donor_rep';

        return {
          ...m,
          name: editMemberName.trim(),
          role: editMemberRole.trim(),
          phone: editMemberPhone.trim() || m.phone,
          profession: editMemberProfession.trim() || m.profession,
          tenure: editMemberTenure.trim() || m.tenure,
          responsibility: editMemberResponsibility.trim() || m.responsibility,
          category
        };
      }
      return m;
    });

    setCommitteeList(updated);
    try {
      localStorage.setItem('school_committee_members', JSON.stringify(updated));
    } catch {}

    setShowEditMemberModal(false);
    showFeedback(`সদস্য "${editMemberName}"-এর তথ্য সফলভাবে হালনাগাদ করা হয়েছে।`);
  };

  // Delete Member
  const handleDeleteMember = (id: string, name: string) => {
    if (confirm(`আপনি কি নিশ্চিত যে পরিচালনা কমিটির সদস্য "${name}"-কে অপসারণ করতে চান?`)) {
      const updated = committeeList.filter(m => m.id !== id);
      setCommitteeList(updated);
      try {
        localStorage.setItem('school_committee_members', JSON.stringify(updated));
      } catch {}
      showFeedback(`সদস্য "${name}" পরিচালনা কমিটি থেকে অপসারিত হয়েছেন।`);
    }
  };

  const filteredCommittee = committeeList.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.profession.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-[#d9e6e7] rounded-3xl p-6 md:p-8 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 bg-[#0c3664]/10 text-[#0c3664] px-3 py-1 rounded-full text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>বিদ্যালয় পরিচালনা পরিষদ (SMC)</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              বিদ্যালয় পরিচালনা কমিটি (Managing Committee)
            </h1>
            <p className="text-xs md:text-sm text-slate-600 max-w-2xl">
              নাপোড়া শেখেরখীল উচ্চ বিদ্যালয়ের নীতিমালা প্রণয়ন, অবকাঠামোগত উন্নয়ন ও সার্বিক তত্ত্বাবধানে নিয়োজিত সম্মানিত পরিচালনা পরিষদের পরিচিতি ও দায়িত্ব।
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-2 shadow-2xs transition-colors"
            >
              <Printer className="w-4 h-4 text-[#0c3664]" />
              <span>তালিকা প্রিন্ট</span>
            </button>

            {isAdmin && (
              <button
                type="button"
                onClick={() => setShowAddMemberModal(true)}
                className="px-4 py-2.5 bg-[#d9482b] hover:bg-[#b8381e] text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>+ নতুন সদস্য যোগ করুন</span>
              </button>
            )}
          </div>
        </div>

        {/* Feedback message */}
        {actionFeedback && (
          <div className="p-3 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-xl text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionFeedback}</span>
          </div>
        )}

        {/* Search & Count Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-[#0c3664] bg-[#f0f6f6] px-3 py-1.5 rounded-lg border border-[#d2e5e7]">
              মোট সদস্য: {committeeList.length} জন
            </span>
            {isAdmin && (
              <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-md text-[11px]">
                ● এডমিন এডিট ও ডিলিট সক্রিয়
              </span>
            )}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="সদস্যের নাম বা পদবি দিয়ে খুঁজুন..."
              className="w-full pl-9 pr-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-xs focus:outline-none focus:border-[#0c3664]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Top Leadership Cards (President & Member Secretary) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredCommittee.filter(m => m.category === 'president' || m.category === 'secretary').map(member => (
          <div
            key={member.id}
            className="bg-gradient-to-br from-white to-blue-50/50 border-2 border-[#0c3664] rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-4 relative overflow-hidden"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3.5">
                  <div
                    onClick={() => {
                      if (member.category === 'president' && onOpenEditPresident) {
                        onOpenEditPresident();
                      } else if (isAdmin) {
                        handleOpenEdit(member);
                      }
                    }}
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-xl shadow-xs overflow-hidden shrink-0 relative border-2 ${
                      member.category === 'president'
                        ? `border-amber-400 bg-blue-50 ${onOpenEditPresident ? 'cursor-pointer group' : ''}`
                        : 'border-[#0c3664] bg-[#0c3664] text-white'
                    }`}
                    title={member.category === 'president' && onOpenEditPresident ? 'সভাপতির ছবি ও তথ্য এডিট করতে ক্লিক করুন' : member.name}
                  >
                    {member.category === 'president' ? (
                      presidentData?.photoUrl ? (
                        <img
                          src={presidentData.photoUrl}
                          alt={member.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <PresidentPortrait size="100%" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      )
                    ) : (
                      <span className="text-white">
                        {member.name.charAt(member.name.indexOf(' ') + 1) || member.name.charAt(0)}
                      </span>
                    )}
                    {member.category === 'president' && onOpenEditPresident && (
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-[10px] font-bold">
                        ছবি এডিট
                      </div>
                    )}
                  </div>
                  <div>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                      {member.role}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mt-1">
                      {member.category === 'president' && presidentData?.name ? presidentData.name : member.name}
                    </h3>
                    <p className="text-xs text-[#0c3664] font-semibold">
                      {member.category === 'president' && presidentData?.profession ? presidentData.profession : member.profession}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {member.category === 'president' && onOpenEditPresident ? (
                    <button
                      type="button"
                      onClick={onOpenEditPresident}
                      className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                      title="সভাপতির ছবি ও তথ্য এডিট করুন"
                    >
                      <Pencil className="w-3.5 h-3.5 text-amber-700" />
                      <span>ছবি ও তথ্য এডিট</span>
                    </button>
                  ) : isAdmin ? (
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(member)}
                      className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-[#0c3664] border border-blue-200 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                      title="তথ্য এডিট করুন"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      <span>এডিট</span>
                    </button>
                  ) : null}
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => handleDeleteMember(member.id, member.name)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="সদস্য অপসারণ করুন"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="p-3 bg-white border border-[#d2e5e7] rounded-xl text-xs space-y-1.5">
                <div className="flex items-center justify-between text-slate-600">
                  <span className="font-semibold text-slate-500">কার্যকাল / মেয়াদ:</span>
                  <span className="font-mono font-bold text-slate-800">{member.tenure}</span>
                </div>
                <div className="text-slate-700 leading-relaxed pt-1 border-t border-slate-100">
                  <strong className="text-slate-900">প্রধান দায়িত্ব:</strong> {member.responsibility}
                </div>
                {member.bio && (
                  <div className="text-slate-500 italic text-[11px] pt-1">
                    "{member.bio}"
                  </div>
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs">
              <a
                href={`tel:${member.phone}`}
                className="inline-flex items-center gap-1.5 font-mono text-[#0c3664] hover:text-[#d9482b] font-bold"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{member.phone}</span>
              </a>
              <span className="text-[11px] bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-mono">
                {member.id}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Other Committee Members */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Users className="w-4 h-4 text-[#0c3664]" />
          <span>পরিচালনা কমিটির সম্মানিত সদস্যবৃন্দ:</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCommittee.filter(m => m.category !== 'president' && m.category !== 'secretary').map(member => (
            <div
              key={member.id}
              className="bg-white border border-[#d9e6e7] hover:border-[#0c3664] rounded-2xl p-5 shadow-xs transition-all flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-[#0c3664] border border-blue-200">
                      {member.role}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 mt-1">
                      {member.name}
                    </h4>
                    <div className="text-xs text-slate-600">{member.profession}</div>
                  </div>

                  {isAdmin && (
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(member)}
                        className="p-1.5 text-[#0c3664] hover:bg-blue-50 rounded-lg transition-colors"
                        title="এডিট করুন"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteMember(member.id, member.name)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="বাদ দিন"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="p-2.5 bg-[#f0f6f6] rounded-xl text-xs space-y-1">
                  <div className="text-slate-600 leading-snug">
                    <strong className="text-slate-700">ভূমিকা: </strong>
                    {member.responsibility}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    মেয়াদ: <span className="font-mono font-medium text-slate-700">{member.tenure}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <a
                  href={`tel:${member.phone}`}
                  className="inline-flex items-center gap-1 font-mono text-slate-700 hover:text-[#0c3664]"
                >
                  <Phone className="w-3 h-3 text-slate-400" />
                  <span>{member.phone}</span>
                </a>
                <span className="text-[10px] text-slate-400 font-mono">{member.id}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ADD MEMBER MODAL */}
      {showAddMemberModal && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowAddMemberModal(false);
          }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-slate-200 space-y-5 relative my-8 animate-in fade-in zoom-in-95 duration-150">
            {/* Top Back & Close Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <button
                type="button"
                onClick={() => setShowAddMemberModal(false)}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors border border-slate-200"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-slate-600" />
                <span>← ব্যাকে যান (Back)</span>
              </button>

              <button
                type="button"
                onClick={() => setShowAddMemberModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-1 text-xs"
                title="উইন্ডো বন্ধ করুন"
              >
                <X className="w-4 h-4" />
                <span>বন্ধ (Close)</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 text-[#0c3664] rounded-2xl flex items-center justify-center shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">পরিচালনা কমিটির নতুন সদস্য অন্তর্ভুক্তি</h3>
                <p className="text-xs text-slate-500">নাপোড়া শেখেরখীল উচ্চ বিদ্যালয় পরিচালনা পরিষদ</p>
              </div>
            </div>

            <form onSubmit={handleAddMember} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">সদস্যের নাম *</label>
                <input
                  type="text"
                  required
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  placeholder="যেমন: জনাব মোঃ আব্দুল জলিল"
                  className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">কমিটির পদবি *</label>
                <select
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value)}
                  className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900"
                >
                  <option value="সভাপতি (President)">সভাপতি (President)</option>
                  <option value="সদস্য সচিব (Member Secretary)">সদস্য সচিব (Member Secretary)</option>
                  <option value="অভিভাবক প্রতিনিধি (Guardian Representative)">অভিভাবক প্রতিনিধি (সাধারণ)</option>
                  <option value="অভিভাবক প্রতিনিধি (মহিলা)">অভিভাবক প্রতিনিধি (মহিলা)</option>
                  <option value="শিক্ষক প্রতিনিধি (Teacher Representative)">শিক্ষক প্রতিনিধি</option>
                  <option value="বিদ্যোৎসাহী সদস্য (Education Enthusiast)">বিদ্যোৎসাহী সদস্য</option>
                  <option value="দাতা প্রতিনিধি সদস্য">দাতা প্রতিনিধি সদস্য</option>
                  <option value="প্রশাসন প্রতিনিধি (Govt. Representative)">প্রশাসন প্রতিনিধি</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">পেশা / পরিচিতি:</label>
                  <input
                    type="text"
                    value={newMemberProfession}
                    onChange={(e) => setNewMemberProfession(e.target.value)}
                    placeholder="যেমন: সমাজসেবক / ব্যবসায়ী"
                    className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">মোবাইল নম্বর:</label>
                  <input
                    type="tel"
                    value={newMemberPhone}
                    onChange={(e) => setNewMemberPhone(e.target.value)}
                    placeholder="018XX-XXXXXX"
                    className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">মেয়াদকাল:</label>
                <input
                  type="text"
                  value={newMemberTenure}
                  onChange={(e) => setNewMemberTenure(e.target.value)}
                  placeholder="যেমন: ২০২৪ – ২০২৬"
                  className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">কমিটির ভূমিকা / দায়িত্ব:</label>
                <textarea
                  rows={2}
                  value={newMemberResponsibility}
                  onChange={(e) => setNewMemberResponsibility(e.target.value)}
                  placeholder="যেমন: ছাত্র-ছাত্রীদের নিয়মিত উপস্থিতি ও স্কুল শৃঙ্খলা তদারকি..."
                  className="w-full p-2.5 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddMemberModal(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0c3664] hover:bg-[#092b50] text-white font-bold rounded-xl"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MEMBER MODAL */}
      {showEditMemberModal && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowEditMemberModal(false);
          }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-slate-200 space-y-5 relative my-8 animate-in fade-in zoom-in-95 duration-150">
            {/* Top Back & Close Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <button
                type="button"
                onClick={() => setShowEditMemberModal(false)}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors border border-slate-200"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-slate-600" />
                <span>← ব্যাকে যান (Back)</span>
              </button>

              <button
                type="button"
                onClick={() => setShowEditMemberModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-1 text-xs"
                title="উইন্ডো বন্ধ করুন"
              >
                <X className="w-4 h-4" />
                <span>বন্ধ (Close)</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-50 text-amber-700 rounded-2xl flex items-center justify-center shrink-0">
                <Pencil className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">কমিটি সদস্য তথ্য সম্পাদনা ও আপডেট</h3>
                <p className="text-xs text-slate-500 font-mono">{editingMemberId}</p>
              </div>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">সদস্যের নাম *</label>
                <input
                  type="text"
                  required
                  value={editMemberName}
                  onChange={(e) => setEditMemberName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">কমিটির পদবি *</label>
                <input
                  type="text"
                  required
                  value={editMemberRole}
                  onChange={(e) => setEditMemberRole(e.target.value)}
                  className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">পেশা / পরিচিতি:</label>
                  <input
                    type="text"
                    value={editMemberProfession}
                    onChange={(e) => setEditMemberProfession(e.target.value)}
                    className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">মোবাইল নম্বর:</label>
                  <input
                    type="tel"
                    value={editMemberPhone}
                    onChange={(e) => setEditMemberPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">মেয়াদকাল:</label>
                <input
                  type="text"
                  value={editMemberTenure}
                  onChange={(e) => setEditMemberTenure(e.target.value)}
                  className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">কমিটির ভূমিকা / দায়িত্ব:</label>
                <textarea
                  rows={2}
                  value={editMemberResponsibility}
                  onChange={(e) => setEditMemberResponsibility(e.target.value)}
                  className="w-full p-2.5 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEditMemberModal(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0c3664] hover:bg-[#092b50] text-white font-bold rounded-xl"
                >
                  আপডেট সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
