import React, { useState, useEffect } from 'react';
import {
  Image as ImageIcon,
  Video,
  Plus,
  Edit2,
  Trash2,
  X,
  Play,
  Calendar,
  Tag,
  ExternalLink,
  Search,
  Filter,
  CheckCircle2,
  ShieldCheck,
  Lock,
  Sparkles,
  Info
} from 'lucide-react';
import { GalleryItem } from '../types';

interface GalleryTabProps {
  isAdmin?: boolean;
  onRequireAdminLogin?: () => void;
  language?: 'bn' | 'en';
}

const INITIAL_GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gal-1',
    title: '৬০তম বার্ষিক ক্রীড়া প্রতিযোগিতা ও বর্ণাঢ্য সাংস্কৃতিক অনুষ্ঠান',
    category: 'sports',
    type: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=80',
    date: '২০২৪-০২-১৫',
    description: 'বিদ্যালয়ের বিশাল খেলার মাঠে আয়োজিত বার্ষিক ক্রীড়া প্রতিযোগিতায় দৌড়, দীর্ঘ লম্ফ, ক্রিকেট ও ফুটবল ম্যাচ অনুষ্ঠিত হয়। প্রধান অতিথি হিসেবে উপস্থিত থেকে বিজয়ীদের হাতে ট্রফি তুলে দেন পরিচালনা পর্ষদ সভাপতি জনাব মোঃ আবদুল কাদের এবং প্রধান শিক্ষক জনাব মোঃ জাহাঙ্গীর আলম।',
    isFeatured: true
  },
  {
    id: 'gal-2',
    title: 'মহান স্বাধীনতা ও জাতীয় দিবস উপলক্ষে কুচকাওয়াজ ও বিশেষ আলোচনা সভা',
    category: 'national',
    type: 'video',
    mediaUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    youtubeId: 'dQw4w9WgXcQ',
    date: '২০২৪-০৩-২৬',
    description: '২৬শে মার্চ প্রত্যুষে জাতীয় পতাকা উত্তোলনের মাধ্যমে দিবসের শুভ সূচনা হয়। শিক্ষার্থীদের মনোমুগ্ধকর ডিসপ্লে, কুচকাওয়াজ ও স্বাধীনতা যুদ্ধের বীর শহীদদের স্মরণে বিশেষ স্মৃতিচারণ অনুষ্ঠিত হয়।',
    isFeatured: true
  },
  {
    id: 'gal-3',
    title: 'আন্তঃশ্রেণি বিজ্ঞান মেলা, রোবোটিক্স মডেল ও জলবায়ু প্রকল্প প্রদর্শনী',
    category: 'science',
    type: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&w=1200&q=80',
    date: '২০২৪-০৪-১৮',
    description: '৬ষ্ঠ থেকে ১০ম শ্রেণির শিক্ষার্থীরা সোলার এনার্জি, রেইন ওয়াটার হার্ভেস্টিং, স্বয়ংক্রিয় সেচযন্ত্র এবং আধুনিক চিকিৎসা প্রযুক্তির নানা উদ্ভাবনী মডেল উপস্থাপন করে। বাঁশখালী উপজেলার বিভিন্ন গণ্যমান্য ব্যক্তিবর্গ এই প্রদর্শনী পরিদর্শন করেন।',
    isFeatured: true
  },
  {
    id: 'gal-4',
    title: 'এস.এস.সি পরীক্ষায় জিপিএ-৫.০০ প্রাপ্ত কৃতি শিক্ষার্থীদের সংবর্ধনা ও ক্রেস্ট বিতরণ',
    category: 'academic',
    type: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
    date: '২০২৪-০৫-১২',
    description: 'এসএসসি পরীক্ষায় বিজ্ঞান, ব্যবসায় শিক্ষা ও মানবিক বিভাগ থেকে মেধার স্বাক্ষর রাখা কৃতি শিক্ষার্থীদের উৎসাহ দিতে বিশেষ সম্মাননা ক্রেস্ট ও সনদপত্র প্রদান করা হয়। পরিচালনা পর্ষদ ও শিক্ষকবৃন্দ শিক্ষার্থীদের ভবিষ্যৎ জীবনের সার্বিক সাফল্য কামনা করেন।',
    isFeatured: false
  },
  {
    id: 'gal-5',
    title: 'নাপোড়া শেখেরখীল উচ্চ বিদ্যালয় ক্যাম্পাস, মূল একাডেমিক ভবন ও খেলার মাঠ',
    category: 'campus',
    type: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80',
    date: '২০২৪-০১-১০',
    description: '১৯৬৪ সালে প্রতিষ্ঠিত বাঁশখালী উপজেলার অন্যতম প্রাচীন ও ঐতিহ্যবাহী এই বিদ্যাপীঠের নয়নাভিরাম ক্যাম্পাস। আধুনিক শ্রেণিকক্ষ, সুসজ্জিত কম্পিউটার ল্যাব, বিজ্ঞানাগার এবং বিশাল সবুজ মাঠ শিক্ষার্থীদের শারীরিক ও মানসিক বিকাশে সহায়ক।',
    isFeatured: true
  },
  {
    id: 'gal-6',
    title: '২১শে ফেব্রুয়ারি আন্তর্জাতিক মাতৃভাষা দিবস উপলক্ষে প্রভাতফেরি ও শহীদ মিনারে পুষ্পস্তবক অর্পণ',
    category: 'national',
    type: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
    date: '২০২৪-০২-২১',
    description: 'ভাষা শহীদদের আত্মত্যাগের প্রতি বিনম্র শ্রদ্ধা জানিয়ে খালি পায়ে প্রভাতফেরি সহকারে বিদ্যালয়ের শহীদ মিনারে পুষ্পস্তবক অর্পণ করেন শিক্ষক, কর্মচারী, পরিচালনা পর্ষদের সদস্যবৃন্দ এবং সর্বস্তরের শিক্ষার্থীবৃন্দ।',
    isFeatured: false
  },
  {
    id: 'gal-7',
    title: 'শেখ রাসেল ডিজিটাল কম্পিউটার ল্যাব ও স্মার্ট ক্লাসরুমে শিক্ষার্থীদের আইসিটি প্রশিক্ষণ',
    category: 'academic',
    type: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
    date: '২০২৪-০৬-০৫',
    description: 'ডিজিটাল বাংলাদেশ বিনির্মাণে কম্পিউটার ল্যাবে শিক্ষার্থীদের প্রোগ্রামিং, টাইপিং, ইন্টারনেট ব্রাউজিং এবং মাইক্রোসফট অফিস অ্যাপ্লিকেশনের বিশেষ বাস্তবমুখী প্রশিক্ষণ ক্লাস।',
    isFeatured: false
  },
  {
    id: 'gal-8',
    title: 'গ্রিন ক্যাম্পাস পরিবেশ সচেতনতা ক্যাম্পেইন ও বার্ষিক বৃক্ষরোপণ কর্মসূচি',
    category: 'general',
    type: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
    date: '২০২৪-০৭-১০',
    description: 'স্কুল প্রাঙ্গণ সবুজায়ন ও পরিবেশ রক্ষার অঙ্গীকার নিয়ে বিভিন্ন জাতের বনজ, ফলদ ও ঔষধি চারাগাছ রোপণ করা হয়। শিক্ষার্থীরা পরম যত্নে গাছগুলোর পরিচর্যা করার দায়িত্ব নেয়।',
    isFeatured: false
  }
];

export default function GalleryTab({
  isAdmin = false,
  onRequireAdminLogin,
  language = 'bn'
}: GalleryTabProps) {
  // Gallery Items state with localStorage
  const [items, setItems] = useState<GalleryItem[]>(() => {
    try {
      const saved = localStorage.getItem('school_gallery_items');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_GALLERY_ITEMS;
  });

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeType, setActiveType] = useState<'all' | 'image' | 'video'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Lightbox / Detail Modal State
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  // Add / Edit Modal State (Admin Only)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<GalleryItem['category']>('sports');
  const [formType, setFormType] = useState<'image' | 'video'>('image');
  const [formMediaUrl, setFormMediaUrl] = useState('');
  const [formDate, setFormDate] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formIsFeatured, setFormIsFeatured] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  // Helper to extract YouTube ID from URL
  const extractYouTubeId = (url: string): string | undefined => {
    if (!url) return undefined;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : undefined;
  };

  const saveItems = (updated: GalleryItem[]) => {
    setItems(updated);
    try {
      localStorage.setItem('school_gallery_items', JSON.stringify(updated));
    } catch {}
  };

  const handleOpenAdd = () => {
    if (!isAdmin) {
      if (onRequireAdminLogin) {
        onRequireAdminLogin();
      } else {
        alert('শুধুমাত্র পাসওয়ার্ডধারী অনুমোদিত এডমিন গ্যালারিতে ছবি বা ভিডিও যোগ করতে পারবেন।');
      }
      return;
    }
    setEditingItem(null);
    setFormTitle('');
    setFormCategory('sports');
    setFormType('image');
    setFormMediaUrl('');
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormDescription('');
    setFormIsFeatured(false);
    setIsEditModalOpen(true);
  };

  const handleOpenEdit = (item: GalleryItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAdmin) {
      if (onRequireAdminLogin) onRequireAdminLogin();
      return;
    }
    setEditingItem(item);
    setFormTitle(item.title);
    setFormCategory(item.category);
    setFormType(item.type);
    setFormMediaUrl(item.mediaUrl);
    setFormDate(item.date);
    setFormDescription(item.description);
    setFormIsFeatured(!!item.isFeatured);
    setIsEditModalOpen(true);
  };

  const handleDelete = (id: string, title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAdmin) {
      if (onRequireAdminLogin) onRequireAdminLogin();
      return;
    }
    if (confirm(`আপনি কি নিশ্চিত যে "${title}" আইটেমটি গ্যালারি থেকে মুছে ফেলতে চান?`)) {
      const updated = items.filter(it => it.id !== id);
      saveItems(updated);
      setFeedbackMsg('আইটেমটি সফলভাবে মুছে ফেলা হয়েছে।');
      setTimeout(() => setFeedbackMsg(''), 2500);
    }
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      if (onRequireAdminLogin) onRequireAdminLogin();
      return;
    }
    if (!formTitle.trim()) {
      alert('অনুগ্রহ করে অনুষ্ঠানের শিরোনাম লিখুন।');
      return;
    }

    const ytId = formType === 'video' ? extractYouTubeId(formMediaUrl) : undefined;
    const finalMediaUrl = formMediaUrl.trim() || (formType === 'video'
      ? 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
      : 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=80');

    if (editingItem) {
      const updated = items.map(it => {
        if (it.id === editingItem.id) {
          return {
            ...it,
            title: formTitle.trim(),
            category: formCategory,
            type: formType,
            mediaUrl: finalMediaUrl,
            youtubeId: ytId,
            date: formDate.trim() || it.date,
            description: formDescription.trim(),
            isFeatured: formIsFeatured
          };
        }
        return it;
      });
      saveItems(updated);
      setFeedbackMsg('গ্যালারি আইটেম সফলভাবে আপডেট করা হয়েছে!');
    } else {
      const newItem: GalleryItem = {
        id: `gal-${Date.now()}`,
        title: formTitle.trim(),
        category: formCategory,
        type: formType,
        mediaUrl: finalMediaUrl,
        youtubeId: ytId,
        date: formDate.trim() || new Date().toISOString().split('T')[0],
        description: formDescription.trim(),
        isFeatured: formIsFeatured
      };
      saveItems([newItem, ...items]);
      setFeedbackMsg('নতুন গ্যালারি আইটেম সফলভাবে যুক্ত হয়েছে!');
    }

    setIsEditModalOpen(false);
    setTimeout(() => setFeedbackMsg(''), 2500);
  };

  // Filtered Items
  const filteredItems = items.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesType = activeType === 'all' || item.type === activeType;
    const matchesSearch =
      searchQuery.trim() === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesType && matchesSearch;
  });

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'sports': return 'ক্রীড়া ও সাংস্কৃতিক';
      case 'national': return 'জাতীয় দিবস';
      case 'science': return 'বিজ্ঞান মেলা';
      case 'academic': return 'একাডেমিক ও কৃতি';
      case 'campus': return 'ক্যাম্পাস ও ভবন';
      case 'cultural': return 'সাংস্কৃতিক উৎসব';
      default: return 'সাধারণ অনুষ্ঠান';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-[#0c3664] via-[#10437b] to-[#185394] text-white p-6 sm:p-8 rounded-3xl shadow-sm border border-[#082545] relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/20 border border-amber-400/40 text-amber-300 rounded-full text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>স্মৃতি, ঐতিহ্য ও সাফল্যের আলোকচিত্র</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              {language === 'bn' ? 'বিদ্যালয়ের ফটো ও ভিডিও গ্যালারি' : 'School Photo & Video Gallery'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 mt-1.5 max-w-2xl leading-relaxed">
              নাপোড়া শেখেরখীল উচ্চ বিদ্যালয়ের বিভিন্ন ঐতিহাসিক অনুষ্ঠান, জাতীয় দিবস, বার্ষিক ক্রীড়া প্রতিযোগিতা, সাংস্কৃতিক উৎসব ও মনোরম ক্যাম্পাসের স্থিরচিত্র, ভিডিও ও বিবরণী।
            </p>
          </div>

          {/* Admin Add Media Button */}
          <div className="shrink-0 flex items-center gap-2">
            {isAdmin ? (
              <button
                type="button"
                onClick={handleOpenAdd}
                className="px-4 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>মিডিয়া যোগ করুন (এডমিন)</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  if (onRequireAdminLogin) onRequireAdminLogin();
                  else alert('শুধুমাত্র পাসওয়ার্ডধারী অনুমোদিত এডমিন গ্যালারিতে ছবি বা ভিডিও যোগ করতে পারবেন।');
                }}
                className="px-4 py-2.5 bg-[#051c36] hover:bg-[#08274d] text-amber-300 border border-amber-400/40 font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-all cursor-pointer"
                title="লগইন করে মিডিয়া যোগ বা পরিবর্তন করুন"
              >
                <Lock className="w-4 h-4 text-amber-400" />
                <span>এডমিন অপশন</span>
              </button>
            )}
          </div>
        </div>

        {/* Feedback alert */}
        {feedbackMsg && (
          <div className="mt-4 p-3 bg-emerald-500/90 text-white rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>{feedbackMsg}</span>
          </div>
        )}
      </div>

      {/* Control Strip: Filters & Search */}
      <div className="bg-white border border-[#d9e6e7] rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          
          {/* Categories Tab Strip */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 touch-pan-x">
            {[
              { id: 'all', label: 'সকল আইটেম' },
              { id: 'sports', label: '🏆 ক্রীড়া ও সাংস্কৃতিক' },
              { id: 'national', label: '🇧🇩 জাতীয় দিবস' },
              { id: 'science', label: '🔬 বিজ্ঞান মেলা' },
              { id: 'academic', label: '🎓 কৃতি শিক্ষার্থী ও ক্লাস' },
              { id: 'campus', label: '🏫 ক্যাম্পাস ও ভবন' },
              { id: 'general', label: '🌿 সাধারণ ও অন্যান্য' }
            ].map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeCategory === cat.id
                    ? 'bg-[#0c3664] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Type Filter & Search Bar */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Type buttons: All, Image, Video */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
              <button
                type="button"
                onClick={() => setActiveType('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  activeType === 'all' ? 'bg-white text-[#0c3664] shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                সব
              </button>
              <button
                type="button"
                onClick={() => setActiveType('image')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  activeType === 'image' ? 'bg-white text-[#0c3664] shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                <span>চিত্র</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveType('video')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  activeType === 'video' ? 'bg-white text-[#0c3664] shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Video className="w-3.5 h-3.5 text-red-600" />
                <span>ভিডিও</span>
              </button>
            </div>

            {/* Search Input */}
            <div className="relative min-w-[170px] sm:min-w-[200px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="অনুষ্ঠান বা শিরোনাম খুঁজুন..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0c3664]"
              />
            </div>
          </div>

        </div>

        {/* Counter Info */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
          <span>প্রদর্শন হচ্ছে: <strong className="text-slate-800">{filteredItems.length}</strong> টি অনুষ্ঠান / চিত্র</span>
          {isAdmin && (
            <span className="text-emerald-700 font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>এডমিন মোড সক্রিয়: প্রতিটি আইটেমের এডিট ও ডিলিট অপশন উন্মুক্ত</span>
            </span>
          )}
        </div>
      </div>

      {/* Gallery Cards Grid */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-[#d9e6e7] space-y-3">
          <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
            <ImageIcon className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-700">কোনো চিত্র বা ভিডিও পাওয়া যায়নি</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            আপনার ফিল্টার বা অনুসন্ধানের সাথে মিল পাওয়া যায়নি। অন্য ক্যাটাগরি নির্বাচন করুন অথবা নতুন মিডিয়া যোগ করুন।
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredItems.map(item => {
            const isVideo = item.type === 'video';
            const ytThumb = item.youtubeId
              ? `https://img.youtube.com/vi/${item.youtubeId}/hqdefault.jpg`
              : null;
            const displayImage = isVideo ? (ytThumb || item.mediaUrl) : item.mediaUrl;

            return (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="bg-white rounded-2xl border border-[#d9e6e7] hover:border-[#0c3664] overflow-hidden shadow-xs hover:shadow-md transition-all group flex flex-col cursor-pointer relative"
              >
                {/* Image / Thumbnail Container */}
                <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
                  <img
                    src={displayImage}
                    alt={item.title}
                    onError={(e) => {
                      // Fallback image if broken
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80';
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />

                  {/* Badges on Image */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#0c3664]/90 text-white backdrop-blur-xs shadow-xs">
                      {getCategoryLabel(item.category)}
                    </span>
                    {item.isFeatured && (
                      <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-amber-400 text-slate-950 shadow-xs">
                        ★ বিশেষ
                      </span>
                    )}
                  </div>

                  <div className="absolute top-2.5 right-2.5">
                    {isVideo ? (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-red-600 text-white flex items-center gap-1 shadow-xs">
                        <Video className="w-3 h-3" />
                        <span>ভিডিও</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-900/80 text-white flex items-center gap-1 backdrop-blur-xs shadow-xs">
                        <ImageIcon className="w-3 h-3 text-blue-300" />
                        <span>চিত্র</span>
                      </span>
                    )}
                  </div>

                  {/* Play Icon Overlay for Videos */}
                  {isVideo && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-red-600/90 text-white flex items-center justify-center group-hover:scale-115 transition-transform shadow-lg">
                        <Play className="w-6 h-6 fill-white ml-0.5" />
                      </div>
                    </div>
                  )}

                  {/* Date badge on bottom of thumbnail */}
                  <div className="absolute bottom-2 left-2.5 text-[11px] font-semibold text-slate-200 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-amber-300" />
                    <span>{item.date}</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-2.5">
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-[#0c3664] transition-colors line-clamp-2 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Card Footer: Admin Controls & View Details */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[#0c3664] font-bold group-hover:underline flex items-center gap-1">
                      <span>বিস্তারিত দেখুন</span>
                      <ExternalLink className="w-3 h-3" />
                    </span>

                    {/* Admin Action Buttons (Visible only if logged in as Admin) */}
                    {isAdmin && (
                      <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={(e) => handleOpenEdit(item, e)}
                          className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 transition-colors"
                          title="এডিট করুন"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleDelete(item.id, item.title, e)}
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 transition-colors"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* DETAIL / LIGHTBOX MODAL */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-150"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-[#0c3664] text-white px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {selectedItem.type === 'video' ? (
                  <Video className="w-5 h-5 text-red-400" />
                ) : (
                  <ImageIcon className="w-5 h-5 text-blue-300" />
                )}
                <span className="font-bold text-sm">
                  {selectedItem.type === 'video' ? 'ভিডিও প্রদর্শন' : 'চিত্র ও বিবরণ'}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-amber-400 text-slate-950 font-bold ml-1">
                  {getCategoryLabel(selectedItem.category)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Media Content Area */}
            <div className="bg-slate-950 flex items-center justify-center relative">
              {selectedItem.type === 'video' ? (
                <div className="w-full aspect-video bg-black flex items-center justify-center">
                  {selectedItem.youtubeId ? (
                    <iframe
                      className="w-full h-full"
                      src={`https://www.youtube.com/embed/${selectedItem.youtubeId}?autoplay=1`}
                      title={selectedItem.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      controls
                      autoPlay
                      src={selectedItem.mediaUrl}
                      className="w-full h-full max-h-[500px]"
                    />
                  )}
                </div>
              ) : (
                <div className="w-full max-h-[500px] overflow-hidden flex items-center justify-center bg-slate-900">
                  <img
                    src={selectedItem.mediaUrl}
                    alt={selectedItem.title}
                    className="max-h-[500px] w-auto max-w-full object-contain"
                  />
                </div>
              )}
            </div>

            {/* Content Details */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 pb-2 border-b border-slate-100">
                <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                  <Calendar className="w-4 h-4 text-[#0c3664]" />
                  <span>অনুষ্ঠানের তারিখ: {selectedItem.date}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-slate-400" />
                  <span>ক্যাটাগরি: {getCategoryLabel(selectedItem.category)}</span>
                </div>
              </div>

              <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
                {selectedItem.title}
              </h2>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-xl border border-slate-200">
                {selectedItem.description}
              </p>

              {/* Admin Actions inside Lightbox */}
              {isAdmin && (
                <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      setSelectedItem(null);
                      handleOpenEdit(selectedItem, e);
                    }}
                    className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-xs"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>এডিট করুন</span>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      const itemToDelete = selectedItem;
                      setSelectedItem(null);
                      handleDelete(itemToDelete.id, itemToDelete.title, e);
                    }}
                    className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-xs"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>মুছে ফেলুন</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ADMIN ADD / EDIT MODAL (PROTECTED) */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-amber-300 overflow-hidden my-auto max-h-[92vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#0c3664] to-[#14477d] text-white px-5 py-4 flex items-center justify-between border-b-2 border-amber-400">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
                  {editingItem ? <Edit2 className="w-4 h-4" /> : <Plus className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base leading-tight">
                    {editingItem ? 'গ্যালারি আইটেম এডিট করুন' : 'নতুন ছবি / ভিডিও / অনুষ্ঠান যোগ'}
                  </h3>
                  <p className="text-[11px] text-amber-200">
                    শুধুমাত্র অনুমোদিত পাসওয়ার্ডধারী এডমিন প্যানেল
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveForm} className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs">
              
              {/* Type Selection */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">মিডিয়ার ধরণ নির্বাচন করুন *</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormType('image')}
                    className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-2 border transition-all ${
                      formType === 'image'
                        ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    <ImageIcon className="w-4 h-4 text-blue-600" />
                    <span>চিত্র / ফটো (Image)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormType('video')}
                    className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-2 border transition-all ${
                      formType === 'video'
                        ? 'bg-red-50 border-red-600 text-red-900 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    <Video className="w-4 h-4 text-red-600" />
                    <span>ভিডিও (YouTube / Video)</span>
                  </button>
                </div>
              </div>

              {/* Title Input */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">অনুষ্ঠানের শিরোনাম / বিষয় *</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={e => setFormTitle(e.target.value)}
                  placeholder="যেমন: মহান স্বাধীনতা দিবস উদযাপন ও ক্রীড়া প্রতিযোগিতা"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0c3664]"
                />
              </div>

              {/* Category & Date Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ক্যাটাগরি</label>
                  <select
                    value={formCategory}
                    onChange={e => setFormCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0c3664]"
                  >
                    <option value="sports">🏆 বার্ষিক ক্রীড়া ও সাংস্কৃতিক</option>
                    <option value="national">🇧🇩 জাতীয় দিবস</option>
                    <option value="science">🔬 বিজ্ঞান মেলা ও আইসিটি</option>
                    <option value="academic">🎓 কৃতি শিক্ষার্থী ও ক্লাস</option>
                    <option value="campus">🏫 ক্যাম্পাস ও একাডেমি ভবন</option>
                    <option value="general">🌿 অন্যান্য সাধারণ অনুষ্ঠান</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">অনুষ্ঠানের তারিখ</label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={e => setFormDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0c3664]"
                  />
                </div>
              </div>

              {/* Media URL */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {formType === 'video' ? 'ইউটিউব ভিডিও লিংক (YouTube URL)' : 'ছবির লিংক (Image URL)'} *
                </label>
                <input
                  type="url"
                  required
                  value={formMediaUrl}
                  onChange={e => setFormMediaUrl(e.target.value)}
                  placeholder={
                    formType === 'video'
                      ? 'https://www.youtube.com/watch?v=...'
                      : 'https://images.unsplash.com/... অথবা অনলাইন ছবির লিংক'
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0c3664]"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  {formType === 'video'
                    ? 'ইউটিউবের যেকোনো সাধারণ ভিডিও লিংক (Watch URL বা Share URL) দিলে স্বয়ংক্রিয়ভাবে প্লেয়ার হিসেবে চালু হবে।'
                    : 'যেকোনো পাবলিক ফটো লিংক অথবা ক্লাউড ইমেজ ইউআরএল ব্যবহার করুন।'}
                </p>
              </div>

              {/* Description / Caption */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">অনুষ্ঠানের বিবরণ ও টেক্সট (Description)</label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={e => setFormDescription(e.target.value)}
                  placeholder="অনুষ্ঠানের বিস্তারিত তথ্য, উপস্থিত অতিথি ও কর্মসূচি সম্পর্কে লিখুন..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0c3664]"
                />
              </div>

              {/* Featured Checkbox */}
              <div className="flex items-center gap-2 bg-amber-50/70 p-3 rounded-xl border border-amber-200">
                <input
                  type="checkbox"
                  id="featuredToggle"
                  checked={formIsFeatured}
                  onChange={e => setFormIsFeatured(e.target.checked)}
                  className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
                />
                <label htmlFor="featuredToggle" className="text-xs font-bold text-amber-950 cursor-pointer">
                  ★ বিশেষ / হাইলাইটেড অনুষ্ঠান হিসেবে চিহ্নিত করুন
                </label>
              </div>

              {/* Modal Footer Buttons */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0c3664] hover:bg-[#092b50] text-white rounded-xl font-black shadow-md transition-all active:scale-95"
                >
                  {editingItem ? 'আপডেট সংরক্ষণ করুন' : 'গ্যালারিতে যুক্ত করুন'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}
