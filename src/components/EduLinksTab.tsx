import React, { useState } from 'react';
import {
  Globe,
  ExternalLink,
  Search,
  Copy,
  Check,
  Plus,
  X
} from 'lucide-react';

export interface EducationalLink {
  id: string;
  title: string;
  banglaTitle: string;
  category: 'ministry_board' | 'textbook_ebook' | 'teachers_training' | 'results_scholarship' | 'circulars';
  url: string;
  description: string;
  authority: string;
  badge: string;
  isPopular?: boolean;
}

export const INITIAL_EDU_LINKS: EducationalLink[] = [
  {
    id: 'LNK-001',
    title: 'Directorate of Secondary and Higher Education (DSHE)',
    banglaTitle: 'মাধ্যমিক ও উচ্চশিক্ষা অধিদপ্তর (মাউশি)',
    category: 'ministry_board',
    url: 'https://www.dshe.gov.bd',
    description: 'মাধ্যমিক বিদ্যালয়ের যাবতীয় সরকারি সার্কুলার, পরিপত্র, এমপিও নির্দেশিকা এবং শিক্ষক-শিক্ষার্থীদের প্রশাসনিক আদেশ।',
    authority: 'শিক্ষা মন্ত্রণালয়, বাংলাদেশ সরকার',
    badge: 'সরকারি প্রধান অধিদপ্তর',
    isPopular: true
  },
  {
    id: 'LNK-002',
    title: 'Board of Intermediate and Secondary Education, Chittagong',
    banglaTitle: 'মাধ্যমিক ও উচ্চমাধ্যমিক শিক্ষা বোর্ড, চট্টগ্রাম',
    category: 'ministry_board',
    url: 'https://www.bise-ctg.gov.bd',
    description: 'জেএসসি ও এসএসসি পরীক্ষা নিবন্ধন, রেজিস্ট্রেশন কার্ড, ফলাফল, রোল শিট ও একাডেমিক নির্দেশনাবলী।',
    authority: 'চট্টগ্রাম শিক্ষা বোর্ড',
    badge: 'আঞ্চলিক শিক্ষা বোর্ড',
    isPopular: true
  },
  {
    id: 'LNK-003',
    title: 'Ministry of Education (MOE)',
    banglaTitle: 'শিক্ষা মন্ত্রণালয়, গণপ্রজাতন্ত্রী বাংলাদেশ সরকার',
    category: 'ministry_board',
    url: 'https://www.moedu.gov.bd',
    description: 'জাতীয় শিক্ষা নীতিমালা, প্রজ্ঞাপন, শিক্ষা সংস্কার কর্মসূচি ও সরকারি ছুটির অনুমোদিত তালিকা।',
    authority: 'গণপ্রজাতন্ত্রী বাংলাদেশ সরকার',
    badge: 'মন্ত্রণালয়',
    isPopular: true
  },
  {
    id: 'LNK-004',
    title: 'National Curriculum and Textbook Board (NCTB)',
    banglaTitle: 'জাতীয় শিক্ষাক্রম ও পাঠ্যপুস্তক বোর্ড (এনসিটিবি)',
    category: 'textbook_ebook',
    url: 'https://www.nctb.gov.bd',
    description: 'নতুন কারিকুলাম, বিষয়ভিত্তিক শিখনফল, মূল্যায়ন নির্দেশিকা এবং শিক্ষক সহায়িকা ডাউনলোড।',
    authority: 'এনসিটিবি',
    badge: 'জাতীয় কারিকুলাম',
    isPopular: true
  },
  {
    id: 'LNK-005',
    title: 'National E-Book Portal',
    banglaTitle: 'জাতীয় ই-বুক ও ডিজিটাল পাঠ্যবই পোর্টাল',
    category: 'textbook_ebook',
    url: 'http://www.ebook.gov.bd',
    description: '৬ষ্ঠ থেকে ১০ম শ্রেণির সকল পাঠ্যবইয়ের অনলাইন পিডিএফ ও স্মার্ট ইন্টারঅ্যাক্টিভ সংস্করণ।',
    authority: 'এনসিটিবি ও এটুআই',
    badge: 'ডিজিটাল পাঠ্যবই',
    isPopular: true
  },
  {
    id: 'LNK-006',
    title: 'Shikkhok Batayan (Teachers Portal)',
    banglaTitle: 'শিক্ষক বাতায়ন (ডিজিটাল কনটেন্ট ও পেডাগজি)',
    category: 'teachers_training',
    url: 'https://www.teachers.gov.bd',
    description: 'সারাদেশের শিক্ষকদের ডিজিটাল কন্টেন্ট শেয়ারিং, মডেল লেসন প্ল্যান ও অনলাইন পাঠদান সহায়িকা।',
    authority: 'এটুআই ও মাউশি',
    badge: 'শিক্ষক কমিউনিটি',
    isPopular: true
  },
  {
    id: 'LNK-007',
    title: 'Muktopaath E-Learning Platform',
    banglaTitle: 'মুক্তপাঠ (জাতীয় ই-লার্নিং প্ল্যাটফর্ম)',
    category: 'teachers_training',
    url: 'https://muktopaath.gov.bd',
    description: 'নতুন শিক্ষাক্রম বিস্তরণ শিক্ষক প্রশিক্ষণ কোর্স, মূল্যায়ন ও প্রফেশনাল অনলাইন সার্টিফিকেট।',
    authority: 'তথ্যপ্রযুক্তি বিভাগ ও শিক্ষা মন্ত্রণালয়',
    badge: 'অনলাইন প্রশিক্ষণ'
  },
  {
    id: 'LNK-008',
    title: 'Education Board Results Archive',
    banglaTitle: 'সরকারি শিক্ষা বোর্ড ফলাফল আর্কাইভ ও মার্কশিট',
    category: 'results_scholarship',
    url: 'http://www.educationboardresults.gov.bd',
    description: 'সারাদেশের সকল শিক্ষা বোর্ডের এসএসসি, দাখিল ও জেএসসি পরীক্ষার অফিশিয়াল গ্রেডশিট যাচাই।',
    authority: 'শিক্ষা বোর্ড সমন্বয় সাব-কমিটি',
    badge: 'বোর্ড রেজাল্ট',
    isPopular: true
  },
  {
    id: 'LNK-009',
    title: "Prime Minister's Education Assistance Trust",
    banglaTitle: 'প্রধানমন্ত্রীর শিক্ষা সহায়তা ট্রাস্ট (উপবৃত্তি ও চিকিৎসা অনুদান)',
    category: 'results_scholarship',
    url: 'http://www.pmeat.gov.bd',
    description: 'অসচ্ছল ও মেধাবী শিক্ষার্থীদের সমন্বিত উপবৃত্তি কর্মসূচি এবং বিশেষ আর্থিক অনুদান প্রাপ্তি সংক্রান্ত তথ্য।',
    authority: 'মাধ্যমিক ও উচ্চশিক্ষা বিভাগ',
    badge: 'সরকারি উপবৃত্তি'
  },
  {
    id: 'LNK-010',
    title: 'BANBEIS Educational Statistics',
    banglaTitle: 'বাংলাদেশ শিক্ষাতথ্য ও পরিসংখ্যান ব্যুরো (ব্যানবেইস)',
    category: 'circulars',
    url: 'https://www.banbeis.gov.bd',
    description: 'শিক্ষা জরিপ, সকল শিক্ষাপ্রতিষ্ঠানের ইআইআইএন (EIIN) তথ্য ও শিক্ষার্থী পরিসংখ্যান।',
    authority: 'শিক্ষা মন্ত্রণালয়',
    badge: 'ইআইআইএন ও পরিসংখ্যান'
  },
  {
    id: 'LNK-011',
    title: 'NTRCA Teacher Registration',
    banglaTitle: 'বেসরকারি শিক্ষক নিবন্ধন ও প্রত্যয়ন কর্তৃপক্ষ (এনটিআরসিএ)',
    category: 'circulars',
    url: 'http://www.ntrca.gov.bd',
    description: 'বেসরকারি শিক্ষাপ্রতিষ্ঠানে শিক্ষক নিয়োগ বিজ্ঞপ্তি ও নিবন্ধন পরীক্ষার হালনাগাদ তথ্য।',
    authority: 'এনটিআরসিএ',
    badge: 'শিক্ষক নিয়োগ'
  },
  {
    id: 'LNK-012',
    title: 'Konnect Adolescent Portal',
    banglaTitle: 'কিশোর বাতায়ন (কনপেক্ট)',
    category: 'textbook_ebook',
    url: 'https://konnect.edu.bd',
    description: 'কিশোর-কিশোরীদের সৃজনশীল মেধা বিকাশ, বইপড়া, বিজ্ঞান প্রজেক্ট ও সুস্থ বিনোদন প্ল্যাটফর্ম।',
    authority: 'এটুআই',
    badge: 'শিক্ষার্থী কর্নার'
  }
];

interface EduLinksTabProps {
  isAdmin: boolean;
}

export default function EduLinksTab({ isAdmin }: EduLinksTabProps) {
  const [links, setLinks] = useState<EducationalLink[]>(() => {
    try {
      const saved = localStorage.getItem('school_educational_links');
      return saved ? JSON.parse(saved) : INITIAL_EDU_LINKS;
    } catch {
      return INITIAL_EDU_LINKS;
    }
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showAddLinkModal, setShowAddLinkModal] = useState(false);

  // New Link form state
  const [newTitle, setNewTitle] = useState('');
  const [newBanglaTitle, setNewBanglaTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newCategory, setNewCategory] = useState<EducationalLink['category']>('ministry_board');
  const [newDesc, setNewDesc] = useState('');
  const [newAuthority, setNewAuthority] = useState('');

  const categories = [
    { id: 'all', label: 'সকল সরকারি লিংক' },
    { id: 'ministry_board', label: 'মন্ত্রণালয় ও বোর্ড' },
    { id: 'textbook_ebook', label: 'পাঠ্যবই ও ই-বুক' },
    { id: 'teachers_training', label: 'শিক্ষক ও প্রশিক্ষণ' },
    { id: 'results_scholarship', label: 'ফলাফল ও উপবৃত্তি' },
    { id: 'circulars', label: 'পরিপত্র ও নিয়োগ' }
  ];

  const handleCopyLink = (link: EducationalLink) => {
    navigator.clipboard.writeText(link.url);
    setCopiedId(link.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBanglaTitle.trim() || !newUrl.trim()) return;

    let fullUrl = newUrl.trim();
    if (!fullUrl.startsWith('http://') && !fullUrl.startsWith('https://')) {
      fullUrl = 'https://' + fullUrl;
    }

    const newEntry: EducationalLink = {
      id: `LNK-${Date.now().toString().slice(-4)}`,
      title: newTitle.trim() || newBanglaTitle.trim(),
      banglaTitle: newBanglaTitle.trim(),
      category: newCategory,
      url: fullUrl,
      description: newDesc.trim() || 'সরকারি শিক্ষা বিষয়ক হালনাগাদ তথ্য ও নির্দেশনা।',
      authority: newAuthority.trim() || 'শিক্ষা অধিদপ্তর ও সরকার',
      badge: 'সংযোজিত লিংক'
    };

    const updated = [newEntry, ...links];
    setLinks(updated);
    try {
      localStorage.setItem('school_educational_links', JSON.stringify(updated));
    } catch {}

    setNewTitle('');
    setNewBanglaTitle('');
    setNewUrl('');
    setNewDesc('');
    setNewAuthority('');
    setShowAddLinkModal(false);
  };

  const filteredLinks = links.filter(l => {
    const matchesCategory = selectedCategory === 'all' || l.category === selectedCategory;
    const matchesSearch =
      l.banglaTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.url.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Welcome Banner */}
      <div className="bg-white border border-[#d9e6e7] rounded-3xl p-6 md:p-8 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 bg-[#0c3664]/10 text-[#0c3664] px-3 py-1 rounded-full text-xs font-bold">
              <Globe className="w-3.5 h-3.5" />
              <span>সরকারি তথ্য বাতায়ন ও ই-রিসোর্স হাব</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              শিক্ষা বিষয়ক সরকারি পোর্টাল ও গুরুত্বপূর্ণ লিংকসমূহ
            </h1>
            <p className="text-xs md:text-sm text-slate-600 max-w-2xl">
              মাধ্যমিক ও উচ্চশিক্ষা অধিদপ্তর, চট্টগ্রাম শিক্ষা বোর্ড, এনসিটিবি ডিজিটাল পাঠ্যবই এবং অন্যান্য গুরুত্বপূর্ণ সরকারি শিক্ষা পোর্টালের সরাসরি লিংক ও নোটিফিকেশন কর্নার।
            </p>
          </div>

          {isAdmin && (
            <button
              type="button"
              onClick={() => setShowAddLinkModal(true)}
              className="px-4 py-2.5 bg-[#d9482b] hover:bg-[#b8381e] text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন শিক্ষা লিংক যুক্ত করুন</span>
            </button>
          )}
        </div>

        {/* Categories & Search */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-3 border-t border-slate-100">
          <div className="flex flex-wrap gap-2 text-xs">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-[#0c3664] text-white shadow-xs font-bold'
                    : 'bg-[#f0f6f6] hover:bg-slate-100 text-slate-700 border border-[#d2e5e7]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full lg:w-72 shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="পোর্টালের নাম বা বিষয় দিয়ে খুঁজুন..."
              className="w-full pl-9 pr-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-xs focus:outline-none focus:border-[#0c3664] text-slate-800"
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

      {/* Grid of Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredLinks.map(link => (
          <div
            key={link.id}
            className="bg-white border border-[#d9e6e7] hover:border-[#0c3664] rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0c3664] border border-blue-200">
                  {link.badge}
                </span>

                {link.isPopular && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                    বহুল ব্যবহৃত
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-[#0c3664] transition-colors">
                  {link.banglaTitle}
                </h3>
                <div className="text-[11px] text-slate-400 font-medium truncate mt-0.5">
                  {link.title}
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                {link.description}
              </p>

              <div className="p-2 bg-[#f0f6f6] rounded-xl text-[11px] text-slate-500 font-mono truncate">
                {link.url}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => handleCopyLink(link)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                title="ওয়েবসাইট লিংক কপি করুন"
              >
                {copiedId === link.id ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>

              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2 px-3 bg-[#0c3664] hover:bg-[#092b50] text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <span>সরাসরি ওয়েবসাইটে যান</span>
                <ExternalLink className="w-3.5 h-3.5 text-amber-300" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL: ADD CUSTOM LINK */}
      {showAddLinkModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-slate-200 space-y-5 relative my-8 animate-in fade-in zoom-in-95 duration-150">
            <button
              type="button"
              onClick={() => setShowAddLinkModal(false)}
              className="absolute right-5 top-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 text-[#0c3664] rounded-2xl flex items-center justify-center">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">নতুন শিক্ষা লিংক সংযোজন</h3>
                <p className="text-xs text-slate-500">সরকারি বা প্রাতিষ্ঠানিক ওয়েব পোর্টাল লিংক</p>
              </div>
            </div>

            <form onSubmit={handleAddLink} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">পোর্টাল / ওয়েবসাইটের বাংলা নাম *</label>
                <input
                  type="text"
                  required
                  value={newBanglaTitle}
                  onChange={(e) => setNewBanglaTitle(e.target.value)}
                  placeholder="যেমন: বাংলাদেশ উন্মুক্ত বিশ্ববিদ্যালয়"
                  className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">ওয়েবসাইট লিংক (URL) *</label>
                <input
                  type="text"
                  required
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://www.example.gov.bd"
                  className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">ক্যাটাগরি:</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900"
                >
                  <option value="ministry_board">মন্ত্রণালয় ও বোর্ড</option>
                  <option value="textbook_ebook">পাঠ্যবই ও ই-বুক</option>
                  <option value="teachers_training">শিক্ষক ও প্রশিক্ষণ</option>
                  <option value="results_scholarship">ফলাফল ও উপবৃত্তি</option>
                  <option value="circulars">পরিপত্র ও নিয়োগ</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">সংক্ষিপ্ত বিবরণ:</label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="এই পোর্টালে কী পাওয়া যায় সে সম্পর্কে সংক্ষিপ্ত নোট..."
                  className="w-full p-2.5 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddLinkModal(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0c3664] hover:bg-[#092b50] text-white font-bold rounded-xl"
                >
                  লিংক যুক্ত করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
