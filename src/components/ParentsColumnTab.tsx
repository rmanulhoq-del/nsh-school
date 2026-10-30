import React, { useState } from 'react';
import {
  MessageCircle,
  PenTool,
  Heart,
  Printer,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export interface ParentColumnArticle {
  id: string;
  authorName: string;
  studentRelation: string; // e.g. "৮ম শ্রেণির তানভীরের পিতা"
  profession: string;
  phone: string;
  title: string;
  date: string;
  content: string;
  category: 'academic' | 'discipline' | 'digital_fee' | 'suggestions';
  likes: number;
  isFeatured?: boolean;
}

export const INITIAL_PARENT_COLUMNS: ParentColumnArticle[] = [
  {
    id: 'COL-001',
    authorName: 'মুহাম্মদ আব্দুল কাদের',
    studentRelation: '৬ষ্ঠ ও ৯ম শ্রেণির শিক্ষার্থীর অভিভাবক',
    profession: 'স্থানীয় ব্যবসায়ী ও সমাজসেবক',
    phone: '01913-456789',
    title: 'নাপোড়া শেখেরখীল উচ্চ বিদ্যালয়ের ডিজিটাল ফি ব্যবস্থাপনা: বাঁশখালীর জন্য এক দৃষ্টান্ত',
    date: '২০২৪-১০-০৮',
    category: 'digital_fee',
    likes: 38,
    isFeatured: true,
    content: `আগে সন্তানকে স্কুলে পাঠিয়ে নগদ টাকা দিয়ে ফি জমা দেওয়ার বিষয়ে এক ধরণের অনিশ্চয়তা কাজ করত। কখনো রসিদ হারালে কিংবা দীর্ঘ লাইনে দাঁড়িয়ে সময় নষ্ট হতো। 

নাপোড়া শেখেরখীল উচ্চ বিদ্যালয় কর্তৃপক্ষ যেভাবে বাংলাদেশ কৃষি ব্যাংক ও আইএফআইসি ব্যাংকের মাধ্যমে শতভাগ স্বচ্ছ ও ডিজিটাল পদ্ধতিতে ফি আদায়ের ব্যবস্থা করেছে, তা বাঁশখালী উপজেলার অন্যান্য শিক্ষাপ্রতিষ্ঠানের জন্যও এক অনুকরণীয় দৃষ্টান্ত। 

এখন মোবাইল ফোনে তৎক্ষণাৎ মেসেজের মাধ্যমে ফি নিশ্চিতকরণ জানা যায়। প্রধান শিক্ষক জনাব মোঃ জাহাঙ্গীর আলম এবং সহকারী প্রধান শিক্ষক জনাব মাহবুবুল আলমসহ পুরো শিক্ষক মণ্ডলীকে এই যুগান্তকারী উদ্যোগের জন্য আন্তরিক ধন্যবাদ ও কৃতজ্ঞতা জানাই।`
  },
  {
    id: 'COL-002',
    authorName: 'মোছাঃ নাজমুন নাহার',
    studentRelation: '৭ম শ্রেণির শিক্ষার্থীর মাতা',
    profession: 'গৃহিণী ও সমাজকর্মী',
    phone: '01812-987654',
    title: 'সন্তানের পড়াশোনায় নিয়মিত নজরদারি ও শিক্ষকের সাথে সংযোগ: আমাদের করণীয়',
    date: '২০২৪-০৯-২৫',
    category: 'academic',
    likes: 29,
    isFeatured: true,
    content: `একজন শিক্ষার্থী শুধু স্কুলে গিয়েই ভালো ফলাফল করতে পারে না, যদি না পরিবারে তার পড়ার উপযুক্ত পরিবেশ তৈরি করা হয়। প্রতিদিন সন্তান স্কুল থেকে ফিরে কী শিখল, শ্রেণি শিক্ষকের কোনো বিশেষ নির্দেশনা আছে কি না—তা নিয়মিত তদারকি করা আমাদের অভিভাবকদের প্রথম দায়িত্ব।

নাপোড়া শেখেরখীল উচ্চ বিদ্যালয়ের শিক্ষকরা সবসময় আন্তরিক। কোনো শিক্ষার্থীর দুর্বলতা থাকলে শিক্ষকরা সরাসরি অভিভাবকদের সাথে মোবাইল ফোনে যোগাযোগ করেন। আমি সকল মায়েদের প্রতি আহ্বান জানাব, সন্তানদের স্মার্টফোনের অতিরিক্ত আসক্তি থেকে দূরে রেখে প্রতিদিন অন্তত দুই ঘণ্টা মনোযোগ দিয়ে বইপড়ার অভ্যাস গড়ে তুলুন।`
  },
  {
    id: 'COL-003',
    authorName: 'মোঃ কবির হোসেন',
    studentRelation: '১০ম শ্রেণির এসএসসি পরীক্ষার্থীর পিতা',
    profession: 'প্রবাসী কল্যাণ কর্মী',
    phone: '01614-112233',
    title: 'নৈতিক শিক্ষা ও সহশিক্ষা কার্যক্রমে বিদ্যালয় কর্তৃপক্ষের প্রশংসা',
    date: '২০২৪-০৯-১৫',
    category: 'discipline',
    likes: 24,
    isFeatured: false,
    content: `১৯৬৪ সালে প্রতিষ্ঠিত আমাদের এই প্রিয় বিদ্যাপীঠ শুধু পুঁথিগত বিদ্যায় সীমাবদ্ধ নয়; খেলাধুলা, বিতর্ক প্রতিযোগিতা ও স্কাউটিংয়ের মতো সহশিক্ষা কার্যক্রমে শিক্ষার্থীদের মেধা বিকাশের সুযোগ রয়েছে। 

আমার সন্তান যখন স্কুলের বিজ্ঞান ক্লাবে অংশগ্রহণ করে নতুন প্রজেক্ট তৈরি করে, তখন অভিভাবক হিসেবে গর্বে বুক ভরে ওঠে। বিদ্যালয়ের শৃঙ্খলা এবং নৈতিক শিক্ষার যে পরিবেশ বজায় রাখা হয়েছে, তা অব্যাহত থাকুক—এই কামনা করি।`
  }
];

interface ParentsColumnTabProps {
  isAdmin: boolean;
  onPrint?: () => void;
}

export default function ParentsColumnTab({ isAdmin: _isAdmin, onPrint }: ParentsColumnTabProps) {
  const [columns, setColumns] = useState<ParentColumnArticle[]>(() => {
    try {
      const saved = localStorage.getItem('school_parent_columns');
      return saved ? JSON.parse(saved) : INITIAL_PARENT_COLUMNS;
    } catch {
      return INITIAL_PARENT_COLUMNS;
    }
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [likedArticles, setLikedArticles] = useState<Record<string, boolean>>({});
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Form State
  const [authorName, setAuthorName] = useState('');
  const [studentRelation, setStudentRelation] = useState('');
  const [profession, setProfession] = useState('');
  const [phone, setPhone] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<ParentColumnArticle['category']>('suggestions');

  const categories = [
    { id: 'all', label: 'সকল কলাম ও মতামত' },
    { id: 'digital_fee', label: 'ডিজিটাল ব্যাংকিং ও ফি' },
    { id: 'academic', label: 'পড়াশোনা ও শিক্ষাদান' },
    { id: 'discipline', label: 'নৈতিকতা ও সহশিক্ষা' },
    { id: 'suggestions', label: 'গঠনমূলক পরামর্শ' }
  ];

  const handleLike = (id: string) => {
    if (likedArticles[id]) return;

    setLikedArticles(prev => ({ ...prev, [id]: true }));
    const updated = columns.map(c => c.id === id ? { ...c, likes: c.likes + 1 } : c);
    setColumns(updated);
    try {
      localStorage.setItem('school_parent_columns', JSON.stringify(updated));
    } catch {}
  };

  const handleSubmitColumn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !title.trim() || !content.trim()) return;

    const newColumn: ParentColumnArticle = {
      id: `COL-${Date.now().toString().slice(-4)}`,
      authorName: authorName.trim(),
      studentRelation: studentRelation.trim() || 'সম্মানিত অভিভাবক',
      profession: profession.trim() || 'অভিভাবক',
      phone: phone.trim() || '',
      title: title.trim(),
      date: new Date().toISOString().split('T')[0],
      category,
      likes: 1,
      content: content.trim()
    };

    const updated = [newColumn, ...columns];
    setColumns(updated);
    try {
      localStorage.setItem('school_parent_columns', JSON.stringify(updated));
    } catch {}

    setAuthorName('');
    setStudentRelation('');
    setProfession('');
    setPhone('');
    setTitle('');
    setContent('');
    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
      setShowSubmitModal(false);
    }, 2000);
  };

  const filteredColumns = columns.filter(c =>
    selectedCategory === 'all' || c.category === selectedCategory
  );

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white border border-[#d9e6e7] rounded-3xl p-6 md:p-8 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 bg-[#0c3664]/10 text-[#0c3664] px-3 py-1 rounded-full text-xs font-bold">
              <MessageCircle className="w-3.5 h-3.5" />
              <span>অভিভাবকের কণ্ঠস্বর ও মুক্ত চিন্তার মঞ্চ</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              অভিভাবক কলাম ও সুচিন্তিত মতামত কর্নার
            </h1>
            <p className="text-xs md:text-sm text-slate-600 max-w-2xl">
              বিদ্যালয়ের পড়াশোনার মান, ডিজিটাল ব্যাংকিং ফি ব্যবস্থা, শিক্ষার্থীদের নৈতিক চরিত্র ও সার্বিক উন্নয়নে সম্মানিত অভিভাবকদের গুরুত্বপূর্ণ ভাবনা, নিবন্ধ ও অভিজ্ঞতা।
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => {
                if (onPrint) onPrint();
                else window.print();
              }}
              className="px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-2 shadow-2xs transition-colors"
            >
              <Printer className="w-4 h-4 text-[#0c3664]" />
              <span>কলাম প্রিন্ট করুন</span>
            </button>

            <button
              type="button"
              onClick={() => setShowSubmitModal(true)}
              className="px-5 py-2.5 bg-[#d9482b] hover:bg-[#b8381e] text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-xs transition-colors"
            >
              <PenTool className="w-4 h-4" />
              <span>আপনার কলাম / মতামত লিখুন</span>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-100 text-xs">
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
      </div>

      {/* Columns List */}
      <div className="space-y-5">
        {filteredColumns.map(col => (
          <article
            key={col.id}
            className={`bg-white rounded-3xl p-6 md:p-8 border shadow-xs transition-all space-y-4 ${
              col.isFeatured
                ? 'border-amber-300 ring-2 ring-amber-400/20'
                : 'border-[#d9e6e7] hover:border-[#0c3664]'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-[#0c3664] border border-blue-200">
                    {col.category === 'digital_fee' && 'ডিজিটাল ব্যাংকিং ফি'}
                    {col.category === 'academic' && 'পড়াশোনা ও শিখন'}
                    {col.category === 'discipline' && 'নৈতিকতা ও শৃঙ্খলা'}
                    {col.category === 'suggestions' && 'গঠনমূলক পরামর্শ'}
                  </span>

                  {col.isFeatured && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>ফিচার্ড কলাম</span>
                    </span>
                  )}

                  <span className="text-xs text-slate-400 font-mono">
                    তারিখ: {col.date}
                  </span>
                </div>

                <h2 className="text-lg md:text-xl font-bold text-slate-900 leading-snug">
                  {col.title}
                </h2>
              </div>

              {/* Author Badge */}
              <div className="flex items-center gap-3 p-2 bg-[#f0f6f6] rounded-2xl border border-[#d2e5e7] shrink-0 text-xs">
                <div className="w-10 h-10 rounded-xl bg-[#0c3664] text-white flex items-center justify-center font-bold text-sm">
                  {col.authorName.charAt(col.authorName.indexOf(' ') + 1) || col.authorName.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-slate-900">{col.authorName}</div>
                  <div className="text-[11px] text-slate-500">{col.studentRelation}</div>
                  <div className="text-[10px] text-[#0c3664] font-medium">{col.profession}</div>
                </div>
              </div>
            </div>

            {/* Content Body */}
            <div className="text-xs md:text-sm text-slate-700 whitespace-pre-line leading-relaxed bg-[#f8fafc] p-5 rounded-2xl border border-slate-200/80">
              {col.content}
            </div>

            {/* Interaction Bar */}
            <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleLike(col.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-bold transition-all ${
                    likedArticles[col.id]
                      ? 'bg-rose-50 text-rose-600 border-rose-200'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${likedArticles[col.id] ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
                  <span>{col.likes} লাইক / একমত</span>
                </button>
              </div>

              <div className="text-[11px] text-slate-400">
                নাপোড়া শেখেরখীল উচ্চ বিদ্যালয় অভিভাবক পরিষদ
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* MODAL: SUBMIT COLUMN */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 md:p-8 shadow-2xl border border-slate-200 space-y-5 relative my-8 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center justify-center">
                <PenTool className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">অভিভাবক কলাম ও মতামত জমা দিন</h3>
                <p className="text-xs text-slate-500">বিদ্যালয়ের উন্নয়ন ও শিক্ষার্থীদের কল্যাণে আপনার মূল্যবান লেখনী</p>
              </div>
            </div>

            {submittedSuccess ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="text-base font-bold text-emerald-900">আপনার কলাম সফলভাবে প্রকাশিত হয়েছে!</h4>
                <p className="text-xs text-emerald-700">বিদ্যালয় পরিবারের সাথে আপনার সুচিন্তিত মতামত ভাগ করে নেওয়ার জন্য ধন্যবাদ।</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitColumn} className="space-y-3.5 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">আপনার নাম *</label>
                    <input
                      type="text"
                      required
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      placeholder="যেমন: মোঃ জসিম উদ্দিন"
                      className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900 font-medium"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">সন্তানের শ্রেণি ও পরিচয় *</label>
                    <input
                      type="text"
                      required
                      value={studentRelation}
                      onChange={(e) => setStudentRelation(e.target.value)}
                      placeholder="যেমন: ৮ম শ্রেণির শিক্ষার্থীর পিতা/মাতা"
                      className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">আপনার পেশা:</label>
                    <input
                      type="text"
                      value={profession}
                      onChange={(e) => setProfession(e.target.value)}
                      placeholder="যেমন: শিক্ষক / ব্যবসায়ী / প্রবাসী"
                      className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">মোবাইল নম্বর (গোপনীয় থাকবে):</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="017XX-XXXXXX"
                      className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">কলামের বিষয় / ক্যাটাগরি:</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900 font-medium"
                  >
                    <option value="digital_fee">ডিজিটাল ব্যাংকিং ও ফি ব্যবস্থাপনা</option>
                    <option value="academic">পড়াশোনা ও শিক্ষাদান বিষয়ক</option>
                    <option value="discipline">নৈতিক শিক্ষা ও সহশিক্ষা কার্যক্রম</option>
                    <option value="suggestions">স্কুলের সার্বিক উন্নয়নে গঠনমূলক পরামর্শ</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">কলামের আকর্ষণীয় শিরোনাম *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="যেমন: ডিজিটাল যুগে শিক্ষার্থী তদারকিতে শিক্ষক-অভিভাবক মেলবন্ধন"
                    className="w-full px-3 py-2 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900 font-bold"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">কলামের বক্তব্য / মতামত (বিস্তারিত) *</label>
                  <textarea
                    rows={5}
                    required
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="আপনার মূল্যবান অভিজ্ঞতা, পরামর্শ বা মতামত বিস্তারিত লিখুন..."
                    className="w-full p-3 bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl text-slate-900 leading-relaxed"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowSubmitModal(false)}
                    className="px-4 py-2 text-slate-600 hover:text-slate-800"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#d9482b] hover:bg-[#b8381e] text-white font-bold rounded-xl shadow-xs"
                  >
                    কলাম প্রকাশ করুন
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
