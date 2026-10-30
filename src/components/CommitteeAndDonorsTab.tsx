import React, { useState } from 'react';
import {
  Users,
  Award,
  HeartHandshake,
  Landmark,
  Phone,
  Calendar,
  ShieldCheck,
  Plus,
  Pencil,
  Trash2,
  Printer,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  X,
  Save,
  Search,
  BookOpen
} from 'lucide-react';
import SchoolLogo from './SchoolLogo';

export interface CommitteeMember {
  id: string;
  name: string;
  role: string;
  category: 'president' | 'secretary' | 'teacher_rep' | 'guardian_rep' | 'enthusiast' | 'donor_rep' | 'official';
  phone: string;
  profession: string;
  tenure: string;
  responsibility: string;
  bio?: string;
}

export interface DonorFounder {
  id: string;
  name: string;
  type: 'founder' | 'land_donor' | 'life_donor' | 'lab_infrastructure' | 'scholarship';
  contributionType: string;
  amountOrLand: string;
  year: string;
  title: string;
  description: string;
  tributeQuote?: string;
}

export const INITIAL_COMMITTEE: CommitteeMember[] = [
  {
    id: 'SMC-001',
    name: 'অধ্যক্ষ জনাব মোঃ আবদুল কাদের',
    role: 'সভাপতি (President)',
    category: 'president',
    phone: '01819-334455',
    profession: 'অধ্যক্ষ ও বিশিষ্ট শিক্ষাবিদ',
    tenure: '২০২৪ – ২০২৬',
    responsibility: 'বিদ্যালয় পরিচালনা পরিষদের সার্বিক নীতি নির্ধারণ ও প্রশাসনিক দিকনির্দেশনা',
    bio: 'নাপোড়া শেখেরখীল উচ্চ বিদ্যালয় পরিচালনা কমিটির মাননীয় সভাপতি। সুযোগ্য শিক্ষাবিদ ও দক্ষ শিক্ষাপ্রশাসক হিসেবে তিনি অত্র প্রতিষ্ঠানের সার্বিক শিক্ষা মানোন্নয়ন, শৃঙ্খলা ও অবকাঠামোগত উন্নয়নে সার্বক্ষণিক দিকনির্দেশনা দিয়ে যাচ্ছেন।'
  },
  {
    id: 'SMC-002',
    name: 'জনাব মোঃ জাহাঙ্গীর আলম',
    role: 'সদস্য সচিব (Member Secretary)',
    category: 'secretary',
    phone: '01711-000111',
    profession: 'প্রধান শিক্ষক, নাপোড়া শেখেরখীল উচ্চ বিদ্যালয়',
    tenure: 'পদাধিকার বলে (চলমান)',
    responsibility: 'বিদ্যালয়ের সার্বিক একাডেমিক, প্রশাসনিক ও আর্থিক ব্যবস্থাপনা সমন্বয়',
    bio: 'এম.এসসি, বি.এড। সফলতার সাথে দীর্ঘ সময় ধরে প্রধান শিক্ষকের দায়িত্ব পালন করছেন এবং আধুনিক ডিজিটাল ব্যাংকিং ব্যবস্থাপনা প্রবর্তন করেছেন।'
  },
  {
    id: 'SMC-003',
    name: 'জনাব মাহবুবুল আলম',
    role: 'শিক্ষক প্রতিনিধি (Teacher Representative)',
    category: 'teacher_rep',
    phone: '01812-223344',
    profession: 'সহকারী প্রধান শিক্ষক',
    tenure: '২০২৪ – ২০২৬',
    responsibility: 'শিক্ষকবৃন্দের স্বার্থ সংরক্ষণ, পাঠদান মানোন্নয়ন ও পরিচালনা পরিষদে শিক্ষক মতামত তুলে ধরা',
    bio: 'এম.এ (ইংরেজি), বি.এড। শিক্ষক ফোরামের সমন্বয়কারী ও পরীক্ষার শৃঙ্খলার দায়িত্বপ্রাপ্ত।'
  },
  {
    id: 'SMC-004',
    name: 'জনাবা শাহনাজ পারভীন',
    role: 'শিক্ষক প্রতিনিধি (মহিলা)',
    category: 'teacher_rep',
    phone: '01913-445566',
    profession: 'সিনিয়র শিক্ষিকা (গণিত ও বিজ্ঞান)',
    tenure: '২০২৪ – ২০২৬',
    responsibility: 'নারী শিক্ষার্থীদের একাডেমিক অগ্রগতি ও শিক্ষিকাদের প্রতিনিধিত্ব',
    bio: 'বি.এসসি (অনার্স), এম.এসসি। দীর্ঘ ১৫ বছর ধরে সুনামের সাথে গণিত শিক্ষাদান করছেন।'
  },
  {
    id: 'SMC-005',
    name: 'অধ্যাপক মোঃ মোস্তাফিজুর রহমান',
    role: 'বিদ্যোৎসাহী সদস্য (Education Enthusiast)',
    category: 'enthusiast',
    phone: '01715-667788',
    profession: 'অবসরপ্রাপ্ত সরকারি কলেজ অধ্যাপক',
    tenure: '২০২৪ – ২০২৬',
    responsibility: 'উচ্চশিক্ষার মান নিশ্চিতকরণ ও পাঠ্যক্রম সমৃদ্ধকরণ পরামর্শ',
    bio: 'বাঁশখালীর কৃতি সন্তান। শিক্ষা ও গবেষণায় বিশেষ অবদানের জন্য সমাদৃত।'
  },
  {
    id: 'SMC-006',
    name: 'জনাব মোহাম্মদ ওসমান গনি',
    role: 'অভিভাবক প্রতিনিধি (Guardian Representative)',
    category: 'guardian_rep',
    phone: '01817-889900',
    profession: 'ব্যবসায়ী ও সমাজকর্মী',
    tenure: '২০২৪ – ২০২৬',
    responsibility: 'অভিভাবকদের প্রত্যাশা, ফি নীতিমালা ও শিক্ষার্থীদের নিরাপত্তা বিষয় উপস্থাপন',
    bio: 'বিদ্যালয়ের ৯ম ও ৭ম শ্রেণির শিক্ষার্থীর অভিভাবক। বিদ্যালয় প্রাঙ্গণ পরিষ্কার ও খেলাধুলার আয়োজনে সক্রিয়।'
  },
  {
    id: 'SMC-007',
    name: 'জনাবা ফিরোজা বেগম',
    role: 'অভিভাবক প্রতিনিধি (মহিলা)',
    category: 'guardian_rep',
    phone: '01618-112244',
    profession: 'গৃহিণী ও সমাজসেবী',
    tenure: '২০২৪ – ২০২৬',
    responsibility: 'ছাত্রীদের কমনরুম সুবিধা, স্বাস্থ্যসম্মত পরিবেশ ও মা সমাবেশ আয়োজন',
    bio: '১০ম শ্রেণির শিক্ষার্থীর অভিভাবক। নিয়মিত মা ও অভিভাবক সমাবেশের উদ্যোক্তা।'
  },
  {
    id: 'SMC-008',
    name: 'জনাব মোঃ কামাল উদ্দিন সওদাগর',
    role: 'দাতা ও প্রতিষ্ঠাতা প্রতিনিধি',
    category: 'donor_rep',
    phone: '01712-998877',
    profession: 'বিশিষ্ট শিল্পোদ্যোক্তা ও দানশীল ব্যক্তি',
    tenure: '২০২৪ – ২০২৬',
    responsibility: 'অবকাঠামো উন্নয়ন তহবিল তদারকি ও কল্যাণমূলক প্রকল্পের সহায়তা',
    bio: 'প্রতিষ্ঠাতা পরিবারের প্রতিনিধি। স্কুলের বিজ্ঞান ভবন সম্প্রসারণে অগ্রণী ভূমিকা পালনকারী।'
  },
  {
    id: 'SMC-009',
    name: 'উপজেলা মাধ্যমিক শিক্ষা কর্মকর্তা',
    role: 'প্রশাসন প্রতিনিধি (Govt. Representative)',
    category: 'official',
    phone: '01713-000222',
    profession: 'উপজেলা মাধ্যমিক শিক্ষা অফিস, বাঁশখালী',
    tenure: 'পদাধিকার বলে',
    responsibility: 'সরকারি নীতিমালা, শিক্ষাক্রম মনিটরিং ও আইনি নির্দেশনা বাস্তবায়ন',
    bio: 'মাধ্যমিক ও উচ্চশিক্ষা অধিদপ্তরের নির্দেশনায় বিদ্যালয় পরিচালনায় সরকারি সমন্বয়কারী।'
  }
];

export const INITIAL_DONORS: DonorFounder[] = [
  {
    id: 'FND-001',
    name: 'মরহুম আলহাজ্ব আমির হোসেন সওদাগর',
    type: 'founder',
    contributionType: 'প্রধান প্রতিষ্ঠাতা ও প্রধান ভূমিদাতা',
    amountOrLand: '২.৫০ একর জমি ও নগদ ভিত্তি অনুদান',
    year: '১৯৬৪ ইং',
    title: 'প্রতিষ্ঠাতা ও আজীবন প্রধান পৃষ্ঠপোষক',
    description: '১৯৬৪ সালে নাপোড়া ও শেখেরখীল এলাকার পিছিয়ে পড়া ছেলেমেয়েদের শিক্ষার আলো ছড়াতে নিজের মূল্যবান জমি দান করে বিদ্যালয়টির ভিত্তি স্থাপন করেন।',
    tributeQuote: 'তাঁর নিঃস্বার্থ ভূমিদানের উপরই আজ দাঁড়িয়ে আছে ঐতিহ্যবাহী এই বিদ্যাপীঠ।'
  },
  {
    id: 'FND-002',
    name: 'মরহুম মাস্টার নুরুল ইসলাম চৌধুরী',
    type: 'founder',
    contributionType: 'প্রতিষ্ঠাতা প্রধান শিক্ষক ও শিক্ষাবিদ',
    amountOrLand: 'আজীবন বিনা বেতনে শিক্ষা সেবাদান ও গ্রন্থ সংগ্রহ',
    year: '১৯৬৪ ইং',
    title: 'স্বপ্নদ্রষ্টা প্রতিষ্ঠাতা প্রধান শিক্ষক',
    description: 'বিদ্যালয় প্রতিষ্ঠার সূচনালগ্নে বাড়ি বাড়ি গিয়ে শিক্ষার্থী সংগ্রহ এবং প্রাথমিক টিনশেড ভবন নির্মাণে অগ্রণী ভূমিকা পালন করেছিলেন।',
    tributeQuote: 'শিক্ষার আলো ছড়াতে তাঁর ত্যাগ নাপোড়াবাসী চিরকাল শ্রদ্ধার সাথে স্মরণ করবে।'
  },
  {
    id: 'FND-003',
    name: 'মরহুম মৌলভী আহমদ ছফা',
    type: 'land_donor',
    contributionType: 'সহ-প্রতিষ্ঠাতা ও খেলার মাঠের জমিদাতা',
    amountOrLand: '১.২০ একর খেলার মাঠের জমি',
    year: '১৯৬৬ ইং',
    title: 'ক্রীড়াঙ্গন ও মাঠের আজীবন দাতা',
    description: 'শিক্ষার্থীদের শারীরিক সুস্থতা ও ক্রীড়া চর্চার জন্য স্কুলের সম্মুখস্থ খেলার মাঠের জমি দান করেন।'
  },
  {
    id: 'DNR-001',
    name: 'আলহাজ্ব মোঃ নুরুল আনোয়ার',
    type: 'lab_infrastructure',
    contributionType: 'শেখ রাসেল ডিজিটাল ল্যাব ও কম্পিউটার ভবন অনুদান',
    amountOrLand: '১৫টি আধুনিক কম্পিউটার ও শীতাতপ নিয়ন্ত্রণ ব্যবস্থা',
    year: '২০১৯ ইং',
    title: 'আইসিটি ও ডিজিটাল ল্যাব পৃষ্ঠপোষক',
    description: 'বিদ্যালয়ের আইসিটি শিক্ষাকে আধুনিক করতে নিজস্ব অর্থায়নে কম্পিউটার ল্যাব ও পাওয়ার ব্যাকআপ ব্যবস্থা স্থাপন করে দেন।'
  },
  {
    id: 'DNR-002',
    name: 'আলহাজ্ব মোঃ জানে আলম',
    type: 'life_donor',
    contributionType: 'আজীবন দাতা ও কেন্দ্রীয় লাইব্রেরি প্রতিষ্ঠা',
    amountOrLand: '৫,০০০+ বই ও আধুনিক রিডিং টেবিল সেট',
    year: '২০২২ ইং',
    title: 'আজীবন দাতা সদস্য',
    description: 'শিক্ষার্থীদের সৃজনশীল বইপড়ার সুযোগ তৈরিতে স্কুল লাইব্রেরিতে সমৃদ্ধ বইয়ের সংগ্রহ ও আসবাবপত্র প্রদান করেছেন।'
  },
  {
    id: 'DNR-003',
    name: 'ড. শামীমা নাসরিন',
    type: 'scholarship',
    contributionType: 'মেধাবী ও অসচ্ছল শিক্ষার্থী শিক্ষাবৃত্তি তহবিল',
    amountOrLand: 'স্থায়ী আমানত ৳৫,০০,০০০ (বার্ষিক বৃত্তি)',
    year: '২০২৩ ইং',
    title: 'কল্যাণ বৃত্তি ট্রাস্টি',
    description: 'প্রতিবছর দরিদ্র অথচ মেধাবী ১০ জন ছাত্র-ছাত্রীর সম্পূর্ণ বেতন ও পরীক্ষা ফি পরিশোধের জন্য ট্রাস্ট ফান্ড গঠন।'
  }
];

interface CommitteeAndDonorsTabProps {
  isAdmin: boolean;
  onPrint?: () => void;
}

export default function CommitteeAndDonorsTab({ isAdmin, onPrint }: CommitteeAndDonorsTabProps) {
  const [activeSubView, setActiveSubView] = useState<'committee' | 'donors'>('committee');
  const [committeeList, setCommitteeList] = useState<CommitteeMember[]>(() => {
    try {
      const saved = localStorage.getItem('school_committee_members');
      return saved ? JSON.parse(saved) : INITIAL_COMMITTEE;
    } catch {
      return INITIAL_COMMITTEE;
    }
  });

  const [donorsList, setDonorsList] = useState<DonorFounder[]>(() => {
    try {
      const saved = localStorage.getItem('school_donors_founders');
      return saved ? JSON.parse(saved) : INITIAL_DONORS;
    } catch {
      return INITIAL_DONORS;
    }
  });

  const [searchQuery, setSearchQuery] = useState('');

  // Modals for admin add/edit
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showAddDonorModal, setShowAddDonorModal] = useState(false);

  // New member state
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('অভিভাবক প্রতিনিধি (Guardian Representative)');
  const [newMemberPhone, setNewMemberPhone] = useState('');
  const [newMemberProfession, setNewMemberProfession] = useState('');
  const [newMemberTenure, setNewMemberTenure] = useState('২০২৪ – ২০২৬');
  const [newMemberResponsibility, setNewMemberResponsibility] = useState('');

  // New donor state
  const [newDonorName, setNewDonorName] = useState('');
  const [newDonorType, setNewDonorType] = useState<DonorFounder['type']>('life_donor');
  const [newDonorContribution, setNewDonorContribution] = useState('');
  const [newDonorAmount, setNewDonorAmount] = useState('');
  const [newDonorYear, setNewDonorYear] = useState('২০২৪ ইং');
  const [newDonorDesc, setNewDonorDesc] = useState('');

  const handlePrint = () => {
    if (onPrint) onPrint();
    else window.print();
  };

  // Add Committee Member
  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;

    const newMember: CommitteeMember = {
      id: `SMC-${Date.now().toString().slice(-4)}`,
      name: newMemberName.trim(),
      role: newMemberRole,
      category: 'guardian_rep',
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
  };

  // Add Donor
  const handleAddDonor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDonorName.trim()) return;

    const newDonor: DonorFounder = {
      id: `DNR-${Date.now().toString().slice(-4)}`,
      name: newDonorName.trim(),
      type: newDonorType,
      contributionType: newDonorContribution.trim() || 'আর্থিক অনুদান ও পৃষ্ঠপোষকতা',
      amountOrLand: newDonorAmount.trim() || 'অনুদান',
      year: newDonorYear.trim() || '২০২৪ ইং',
      title: 'সম্মানিত দাতা সদস্য',
      description: newDonorDesc.trim() || 'বিদ্যালয়ের সার্বিক শিক্ষা উন্নয়ন ও অবকাঠামো সম্প্রসারণে আন্তরিক সহায়তা।'
    };

    const updated = [...donorsList, newDonor];
    setDonorsList(updated);
    try {
      localStorage.setItem('school_donors_founders', JSON.stringify(updated));
    } catch {}

    setNewDonorName('');
    setNewDonorContribution('');
    setNewDonorAmount('');
    setNewDonorDesc('');
    setShowAddDonorModal(false);
  };

  const filteredCommittee = committeeList.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.profession.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDonors = donorsList.filter(d =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.contributionType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.amountOrLand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-[#d9e6e7] rounded-3xl p-6 md:p-8 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 bg-[#0c3664]/10 text-[#0c3664] px-3 py-1 rounded-full text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>পরিচালনা পরিষদ ও ঐতিহ্যবাহী অবদান</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              বিদ্যালয় পরিচালনা কমিটি ও প্রতিষ্ঠাতা-দাতা ফোরাম
            </h1>
            <p className="text-xs md:text-sm text-slate-600 max-w-2xl">
              ১৯৬৪ সালে প্রতিষ্ঠিত নাপোড়া শেখেরখীল উচ্চ বিদ্যালয়ের বর্তমান কার্যকরী পরিচালনা পরিষদ (SMC) এবং শ্রদ্ধেয় প্রতিষ্ঠাতা ও আজীবন দাতা সদস্যবৃন্দের পরিচিতি।
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-2 shadow-2xs transition-colors"
            >
              <Printer className="w-4 h-4 text-[#0c3664]" />
              <span>তালিকা প্রিন্ট করুন</span>
            </button>

            {isAdmin && (
              <button
                type="button"
                onClick={() => {
                  if (activeSubView === 'committee') setShowAddMemberModal(true);
                  else setShowAddDonorModal(true);
                }}
                className="px-4 py-2.5 bg-[#d9482b] hover:bg-[#b8381e] text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>{activeSubView === 'committee' ? 'নতুন সদস্য যুক্ত করুন' : 'নতুন দাতা যোগ করুন'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Sub-Tabs Selector */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveSubView('committee')}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
                activeSubView === 'committee'
                  ? 'bg-[#0c3664] text-white shadow-xs'
                  : 'bg-[#f0f6f6] hover:bg-slate-100 text-slate-700 border border-[#d2e5e7]'
              }`}
            >
              <Users className="w-4 h-4 text-amber-300" />
              <span>পরিচালনা কমিটি (Managing Committee - {committeeList.length} জন)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSubView('donors')}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
                activeSubView === 'donors'
                  ? 'bg-[#d9482b] text-white shadow-xs'
                  : 'bg-[#f0f6f6] hover:bg-slate-100 text-slate-700 border border-[#d2e5e7]'
              }`}
            >
              <HeartHandshake className="w-4 h-4 text-amber-300" />
              <span>প্রতিষ্ঠাতা ও আজীবন দাতা সদস্যবৃন্দ ({donorsList.length} জন)</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="নাম বা দায়িত্ব দিয়ে খুঁজুন..."
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

      {/* --------------------------------------------------------- */}
      {/* VIEW 1: পরিচালনা কমিটি (MANAGING COMMITTEE) */}
      {/* --------------------------------------------------------- */}
      {activeSubView === 'committee' && (
        <div className="space-y-6">
          {/* Top Key Roles: President & Member Secretary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredCommittee.filter(m => m.category === 'president' || m.category === 'secretary').map(member => (
              <div
                key={member.id}
                className="bg-gradient-to-br from-white to-blue-50/50 border-2 border-[#0c3664] rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-4 relative overflow-hidden"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3.5">
                      <div className="w-14 h-14 bg-[#0c3664] text-white rounded-2xl flex items-center justify-center font-bold text-xl shadow-xs">
                        {member.name.charAt(member.name.indexOf(' ') + 1) || member.name.charAt(0)}
                      </div>
                      <div>
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                          {member.role}
                        </span>
                        <h3 className="text-lg font-bold text-slate-900 mt-1">
                          {member.name}
                        </h3>
                        <p className="text-xs text-[#0c3664] font-semibold">{member.profession}</p>
                      </div>
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

          {/* Other Committee Members Grid */}
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
        </div>
      )}

      {/* --------------------------------------------------------- */}
      {/* VIEW 2: স্কুলের প্রতিষ্ঠাতা ও দাতা সদস্যবৃন্দ (DONORS & FOUNDERS) */}
      {/* --------------------------------------------------------- */}
      {activeSubView === 'donors' && (
        <div className="space-y-6">
          {/* Tribute Banner */}
          <div className="p-6 bg-amber-50/70 border border-amber-300 rounded-3xl text-amber-950 space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-amber-900">
              <Award className="w-5 h-5 text-amber-700" />
              <span>শ্রদ্ধা ও কৃতজ্ঞতা স্মরণ: ১৯৬৪ থেকে চিরস্মরণীয় অবদান</span>
            </div>
            <p className="text-xs text-amber-900/80 leading-relaxed">
              নাপোড়া শেখেরখীল উচ্চ বিদ্যালয় যাদের নিঃস্বার্থ জমিদান, আর্থিক সহায়তা ও ত্যাগের উপর প্রতিষ্ঠিত ও পরিচালিত—বিদ্যালয় কর্তৃপক্ষ ও এলাকাবাসী তাঁদের অমর অবদান গভীর শ্রদ্ধার সাথে চিরকাল স্মরণ করে।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredDonors.map(donor => {
              const isFounder = donor.type === 'founder' || donor.type === 'land_donor';
              return (
                <div
                  key={donor.id}
                  className={`rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4 border transition-all ${
                    isFounder
                      ? 'bg-gradient-to-b from-white to-amber-50/30 border-amber-300'
                      : 'bg-white border-[#d9e6e7] hover:border-[#d9482b]'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                            isFounder
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : 'bg-rose-50 text-[#d9482b] border border-rose-200'
                          }`}
                        >
                          {donor.title}
                        </span>
                        <h4 className="text-base font-bold text-slate-900 mt-1.5">
                          {donor.name}
                        </h4>
                        <div className="text-xs font-semibold text-slate-700 mt-0.5">
                          {donor.contributionType}
                        </div>
                      </div>
                      <span className="font-mono text-[11px] font-bold bg-[#f0f6f6] px-2 py-0.5 rounded text-slate-600 shrink-0">
                        {donor.year}
                      </span>
                    </div>

                    {/* Donation Highlights Box */}
                    <div className="p-3 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-xs space-y-1">
                      <div className="text-slate-500 text-[11px]">অনুদানের বিবরণ / জমি:</div>
                      <div className="font-bold text-slate-900 text-xs">
                        {donor.amountOrLand}
                      </div>
                      <p className="text-slate-600 leading-relaxed pt-1 text-[11px]">
                        {donor.description}
                      </p>
                    </div>

                    {donor.tributeQuote && (
                      <div className="text-xs text-amber-800 italic bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                        "{donor.tributeQuote}"
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span>নাপোড়া শেখেরখীল উচ্চ বিদ্যালয় রেকর্ড</span>
                    <span className="font-mono">{donor.id}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* --------------------------------------------------------- */}
      {/* MODAL: ADD COMMITTEE MEMBER */}
      {/* --------------------------------------------------------- */}
      {showAddMemberModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-slate-200 space-y-5 relative my-8 animate-in fade-in zoom-in-95 duration-150">
            <button
              type="button"
              onClick={() => setShowAddMemberModal(false)}
              className="absolute right-5 top-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 text-[#0c3664] rounded-2xl flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">পরিচালনা কমিটির সদস্য অন্তর্ভুক্তি</h3>
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
                  <option value="অভিভাবক প্রতিনিধি (Guardian Representative)">অভিভাবক প্রতিনিধি (সাধারণ)</option>
                  <option value="অভিভাবক প্রতিনিধি (মহিলা)">অভিভাবক প্রতিনিধি (মহিলা)</option>
                  <option value="শিক্ষক প্রতিনিধি">শিক্ষক প্রতিনিধি</option>
                  <option value="বিদ্যোৎসাহী সদস্য">বিদ্যোৎসাহী সদস্য</option>
                  <option value="দাতা প্রতিনিধি সদস্য">দাতা প্রতিনিধি সদস্য</option>
                  <option value="বিশেষ আমন্ত্রিত সদস্য">বিশেষ আমন্ত্রিত সদস্য</option>
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

      {/* --------------------------------------------------------- */}
      {/* MODAL: ADD DONOR / FOUNDER */}
      {/* --------------------------------------------------------- */}
      {showAddDonorModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-slate-200 space-y-5 relative my-8 animate-in fade-in zoom-in-95 duration-150">
            <button
              type="button"
              onClick={() => setShowAddDonorModal(false)}
              className="absolute right-5 top-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-50 text-amber-700 rounded-2xl flex items-center justify-center">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">নতুন দাতা / প্রতিষ্ঠাতা অন্তর্ভুক্তি</h3>
                <p className="text-xs text-slate-500">নাপোড়া শেখেরখীল উচ্চ বিদ্যালয় দাতা ফোরাম</p>
              </div>
            </div>

            <form onSubmit={handleAddDonor} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">দাতার পূর্ণ নাম *</label>
                <input
                  type="text"
                  required
                  value={newDonorName}
                  onChange={(e) => setNewDonorName(e.target.value)}
                  placeholder="যেমন: হাজী মোঃ কামাল উদ্দিন"
                  className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">অবদানের ধরন:</label>
                  <select
                    value={newDonorType}
                    onChange={(e) => setNewDonorType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900"
                  >
                    <option value="life_donor">আজীবন দাতা</option>
                    <option value="land_donor">ভূমিদাতা</option>
                    <option value="lab_infrastructure">ল্যাব ও অবকাঠামো দাতা</option>
                    <option value="scholarship">বৃত্তি ও কল্যাণ তহবিল</option>
                    <option value="founder">প্রতিষ্ঠাতা সদস্য</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">অবদানের বছর/সাল:</label>
                  <input
                    type="text"
                    value={newDonorYear}
                    onChange={(e) => setNewDonorYear(e.target.value)}
                    placeholder="যেমন: ২০২৪ ইং"
                    className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">অনুদানের খাত/শিরোনাম:</label>
                <input
                  type="text"
                  value={newDonorContribution}
                  onChange={(e) => setNewDonorContribution(e.target.value)}
                  placeholder="যেমন: বিজ্ঞানাগার আধুনিকায়ন ও ছাত্রকল্যাণ তহবিল"
                  className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">অনুদানের পরিমাণ বা জমি:</label>
                <input
                  type="text"
                  value={newDonorAmount}
                  onChange={(e) => setNewDonorAmount(e.target.value)}
                  placeholder="যেমন: নগদ ২,০০,০০০ টাকা / ২০ শতক জমি"
                  className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">সংক্ষিপ্ত বিবরণ:</label>
                <textarea
                  rows={2}
                  value={newDonorDesc}
                  onChange={(e) => setNewDonorDesc(e.target.value)}
                  placeholder="বিদ্যালয়ের উন্নতিতে তাঁর অনন্য অবদানের সংক্ষিপ্ত ইতিহাস..."
                  className="w-full p-2.5 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddDonorModal(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#d9482b] hover:bg-[#b8381e] text-white font-bold rounded-xl"
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
