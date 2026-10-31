import React, { useState } from 'react';
import {
  Laptop,
  Trophy,
  Brain,
  Award,
  Users,
  Calendar,
  CheckCircle2,
  BookOpen,
  Sparkles,
  ChevronRight,
  Printer,
  Medal,
  Star,
  Quote,
  Target,
  GraduationCap
} from 'lucide-react';

interface AcademicExcellenceTabProps {
  isAdmin: boolean;
}

export default function AcademicExcellenceTab({ isAdmin }: AcademicExcellenceTabProps) {
  const [activeSubTab, setActiveSubTab] = useState<'training' | 'competitions' | 'consultants'>('training');

  // Teacher Training Programs
  const trainingPrograms = [
    {
      id: 'TRN-01',
      title: 'জাতীয় শিক্ষাক্রম রূপরেখা ও অভিজ্ঞতাভিত্তিক শিখন প্রশিক্ষণ',
      category: 'কারিকুলাম ও শিখন',
      trainer: 'প্রফেসর ড. এ. কে. এম. মাইনউদ্দিন (মাস্টার ট্রেইনার, HSTTI চট্টগ্রাম)',
      duration: '৫ দিন ব্যাপী কর্মশালা (৪০ ঘণ্টা)',
      date: '১২-১৬ সেপ্টেম্বর ২০২৬',
      venue: 'বিদ্যালয় মাল্টিমিডিয়া আইসিটি সেমিনার হল',
      participants: 'সকল শিক্ষক (১৬ জন শিক্ষক সফলভাবে সম্পন্ন)',
      topics: [
        'অভিজ্ঞতাভিত্তিক শিখন চক্র (Learning Cycle) বাস্তবায়ন',
        'ধারাবাহিক ও সামষ্টিক মূল্যায়ন নির্দেশিকা',
        'শিখনকালীন পারদর্শিতার সূচক (PI) ও আচরণিক সূচক (BI) নির্ধারণ'
      ],
      status: 'সম্পন্ন ও সনদ বিতরণকৃত'
    },
    {
      id: 'TRN-02',
      title: 'স্মার্ট ক্লাসরুম পেডাগজি ও এআই এডুকেশন টুলস কর্মশালা',
      category: 'আইসিটি ও প্রযুক্তি',
      trainer: 'প্রকৌশলী তানভীর রায়হান (আইসিটি কো-অর্ডিনেটর ও সার্টিফাইড এডুকেটর)',
      duration: '৩ দিন ব্যাপী হাতে-কলমে প্রশিক্ষণ',
      date: '০৩-০৫ অক্টোবর ২০২৬',
      venue: 'শেখ রাসেল ডিজিটাল কম্পিউটার ল্যাব',
      participants: 'সহকারী শিক্ষকবৃন্দ (১২ জন)',
      topics: [
        'ইন্টারেক্টিভ ডিজিটাল কনটেন্ট তৈরি ও প্রজেক্টর পরিচালনা',
        'গুগল ক্লাসরুম ও অনলাইন কুইজ পোর্টাল ব্যবহার',
        'শ্রেণিকক্ষে শিক্ষার্থীদের সাইবার সচেতনতা ও নিরাপদ ইন্টারনেট'
      ],
      status: 'সম্পন্ন'
    },
    {
      id: 'TRN-03',
      title: 'সৃজনশীল প্রশ্ন প্রণয়ন, ব্লু-প্রিন্ট ও উত্তরপত্র নিরপেক্ষ মূল্যায়ন',
      category: 'পরীক্ষা ও মূল্যায়ন',
      trainer: 'জনাব মাহবুবুল আলম (সহকারী প্রধান শিক্ষক ও বোর্ড পরীক্ষক)',
      duration: '২ দিন ব্যাপী বিশেষ কর্মশালা',
      date: '২০-২১ নভেম্বর ২০২৬ (আসন্ন)',
      venue: 'সম্মেলন কক্ষ',
      participants: 'সকল বিষয়ভিত্তিক শিক্ষক',
      topics: [
        'বোর্ড মানদণ্ডে জ্ঞান, অনুধাবন, প্রয়োগ ও উচ্চতর দক্ষতার ভারসাম্য',
        'রুব্রিক্স ভিত্তিক নৈর্ব্যক্তিক ও রচনামূলক মূল্যায়ন পদ্ধতি'
      ],
      status: 'আসন্ন'
    }
  ];

  // Student Co-Curricular Competitions
  const competitions = [
    {
      id: 'CMP-01',
      title: 'বার্ষিক ক্রীড়া ও অ্যাথলেটিক্স প্রতিযোগিতা ২০২৬',
      date: '১০-১২ ফেব্রুয়ারি ২০২৬',
      coordinator: 'শারীরিক শিক্ষা বিভাগ ও ক্রীড়া উপ-কমিটি',
      participants: '৬ষ্ঠ থেকে ১০ম শ্রেণির ৪৫০+ শিক্ষার্থী',
      events: [
        '১০০ মিটার ও ২০০ মিটার দ্রুততম দৌড় (ছাত্র ও ছাত্রী)',
        'লং জাম্প, হাই জাম্প ও গোলক নিক্ষেপ',
        'আন্তঃশ্রেণি ফুটবল চ্যাম্পিয়নশিপ ও ক্রিকেট টুর্নামেন্ট',
        'অভিভাবক ও শিক্ষকদের জন্য যেমন খুশি তেমন সাজো ও বালিশ খেলা'
      ],
      topPerformers: [
        { rank: '১ম স্থান (চ্যাম্পিয়ন)', name: 'তানভীর আহমেদ', class: '১০ম শ্রেণি', event: '১০০মি স্প্রিন্ট' },
        { rank: '১ম স্থান (চ্যাম্পিয়ন)', name: 'ফারহানা ইসলাম তন্বী', class: '৮ম শ্রেণি', event: 'হাই জাম্প' },
        { rank: 'রানার্স-আপ', name: 'মোঃ সাকিবুল হাসান', class: '৯ম শ্রেণি', event: 'ক্রিকেট টুর্নামেন্ট' }
      ]
    },
    {
      id: 'CMP-02',
      title: 'বিজ্ঞান মেলা ও উদ্ভাবনী প্রজেক্ট অলিম্পিয়াড ২০২৬',
      date: '১৫ মার্চ ২০২৬',
      coordinator: 'নাপোড়া সায়েন্স ক্লাব ও বিজ্ঞান ফোরাম',
      participants: '৩৫টি বিজ্ঞান প্রজেক্ট দল (১৪০ জন শিক্ষার্থী)',
      events: [
        'স্মার্ট সোলার গ্রিড ও স্বয়ংক্রিয় সেচ প্রকল্প',
        'বাঁশখালীর উপকূলীয় বন্যা সতর্কতা মডেল',
        'পরিবেশবান্ধব জৈব সার ও প্লাস্টিক রিসাইক্লিং প্রযুক্তি',
        'জুনিয়র গণিত ও বিজ্ঞান কুইজ অলিম্পিয়াড'
      ],
      topPerformers: [
        { rank: 'সেরা উদ্ভাবন (১ম স্থান)', name: 'দল: গ্রিন সায়েন্স', class: '১০ম শ্রেণি (বিজ্ঞান)', event: 'উপকূলীয় স্মার্ট বাঁধ' },
        { rank: '২য় স্থান', name: 'দল: ফিউচার রোবোটিক্স', class: '৯ম শ্রেণি (বিজ্ঞান)', event: 'স্বয়ংক্রিয় অগ্নি নির্বাপণ' }
      ]
    },
    {
      id: 'CMP-03',
      title: 'আন্তঃশ্রেণি বাংলা ও ইংরেজি বিতর্ক চ্যাম্পিয়নশিপ',
      date: '২২ মে ২০২৬',
      coordinator: 'নাপোড়া ডিবেটিং সোসাইটি',
      participants: '৮টি হাউস ডিবেট টিম',
      events: [
        'সংসদীয় ধারার বাংলা বিতর্ক প্রতিযোগিতা',
        'ইংরেজি তাৎক্ষণিক বক্তৃতা (Extempore Speech)',
        'সাধারণ জ্ঞান ও বঙ্গবন্ধু মেধা অন্বেষণ কুইজ'
      ],
      topPerformers: [
        { rank: 'শ্রেষ্ঠ বিতার্কিক', name: 'আবরার জাহিদ চৌধুরী', class: '১০ম শ্রেণি', event: 'বিতর্ক ফাইনাল' },
        { rank: '১ম স্থান', name: 'নুসরাত জাহান মিম', class: '৯ম শ্রেণি', event: 'ইংরেজি বক্তৃতা' }
      ]
    },
    {
      id: 'CMP-04',
      title: 'হামদ-নাত, ক্বিরাত ও জাতীয় দিবস সাংস্কৃতিক উৎসব',
      date: '২৬ মার্চ ও আন্তর্জাতিক মাতৃভাষা দিবস',
      coordinator: 'সাংস্কৃতিক পরিষদ ও সাহিত্য সমিতি',
      participants: 'সকল শ্রেণির শিক্ষার্থী',
      events: [
        'সহিহ কুরআন তিলাওয়াত ও ক্বিরাত প্রতিযোগিতা',
        'মনোজ্ঞ হামদ-নাত ও ইসলামী সংগীত',
        'দেশাত্মবোধক গান ও আবৃত্তি প্রতিযোগিতা',
        'বার্ষিক দেয়ালিকা প্রকাশনা ও ক্যালিগ্রাফি প্রদর্শনী'
      ],
      topPerformers: [
        { rank: '১ম স্থান', name: 'হাফেজ মোস্তফা কামাল', class: '৮ম শ্রেণি', event: 'ক্বিরাত' },
        { rank: '১ম স্থান', name: 'সাদিয়া সুলতানা', class: '৭ম শ্রেণি', event: 'হামদ-নাত' }
      ]
    }
  ];

  // Eminent Education Consultants & Advisers
  const consultants = [
    {
      name: 'প্রফেসর ড. মুহাম্মদ শামসুল হক',
      title: 'সাবেক মহাপরিচালক, মাধ্যমিক ও উচ্চশিক্ষা অধিদপ্তর (মাউশি)',
      qualification: 'পিএইচডি (এডুকেশনাল লিডারশিপ, লন্ডন), এম.এ (ঢাবি)',
      location: 'ঢাকা ও চট্টগ্রাম',
      recommendationTitle: 'আধুনিক শিক্ষাক্রম বাস্তবায়ন ও শিক্ষক পেশাদারিত্ব বৃদ্ধি',
      quote:
        'নাপোড়া শেখেরখীল উচ্চ বিদ্যালয় দক্ষিণ চট্টগ্রামের এক ঐতিহাসিক বাতিঘর। বর্তমান তথ্যপ্রযুক্তির যুগে ক্লাসরুমগুলোকে শুধু পুঁথিগত পাঠদানের মধ্যে সীমাবদ্ধ না রেখে অভিজ্ঞতাভিত্তিক শিক্ষায় রূপান্তর করতে হবে। শিক্ষকদের জন্য নিয়মিত ইন-সার্ভিস ট্রেনিং এবং পাঠপরিকল্পনা মনিটরিং নিশ্চিত করাই এই বিদ্যালয়ের সাফল্যের প্রধান চাবিকাঠি।'
    },
    {
      name: 'প্রফেসর প্রকৌশলী নুরুল মোস্তফা চৌধুরী',
      title: 'শিক্ষাবিদ ও প্রযুক্তি উপদেষ্টা, চট্টগ্রাম প্রকৌশল ও প্রযুক্তি বিশ্ববিদ্যালয় (চুয়েট)',
      qualification: 'বিএসসি ইঞ্জিনিয়ারিং (চুয়েট), এমএসসি (বুয়েট)',
      location: 'চট্টগ্রাম',
      recommendationTitle: 'STEM শিক্ষা ও ভবিষ্যৎমুখী বিজ্ঞান ল্যাবরেটরি স্থাপন',
      quote:
        'গ্রামাঞ্চলের শিক্ষার্থীদের মেধার কোনো ঘাটতি নেই, দরকার শুধু সঠিক সুযোগ ও পরিবেশ। বিদ্যালয়ের পদার্থ, রসায়ন ও জীববিজ্ঞানের ল্যাবগুলোকে শতভাগ আধুনিক যন্ত্রপাতি সমৃদ্ধ করতে হবে। কোডিং ও রোবোটিক্স ক্লাবের মাধ্যমে শিক্ষার্থীরা আন্তর্জাতিক পর্যায়ের অলিম্পিয়াডে বাঁশখালীর নাম উজ্জ্বল করতে সক্ষম হবে।'
    },
    {
      name: 'ড. সৈয়দা রাশেদা বেগম',
      title: 'শিক্ষা মনোবিজ্ঞানী ও শিক্ষক প্রশিক্ষণ বিশেষজ্ঞ, ঢাকা বিশ্ববিদ্যালয়',
      qualification: 'এম.ফিল, পিএইচডি (শিক্ষা মনোবিজ্ঞান)',
      location: 'ঢাকা',
      recommendationTitle: 'কৈশোরকালীন মানসিক স্বাস্থ্য, কাউন্সেলিং ও নৈতিক মূল্যবোধ',
      quote:
        'শিক্ষার্থীদের জন্য বিদ্যালয় প্রাঙ্গণ হতে হবে আনন্দময় ও নিরাপদ। পরীক্ষার ফলাফলের চাপের পাশাপাশি শিক্ষার্থীদের নৈতিক চরিত্র গঠন, দেশপ্রেম ও নিয়মিত মানসিক কাউন্সেলিং দেওয়া অত্যন্ত জরুরি। অভিভাবক ও শিক্ষকদের মধ্যকার নিবিড় যোগাযোগ কিশোর-কিশোরীদের বিপথগামী হওয়া থেকে রক্ষা করবে।'
    },
    {
      name: 'বীর মুক্তিযোদ্ধা অ্যাডভোকেট রফিকুল আনোয়ার চৌধুরী',
      title: 'সাবেক শিক্ষা আইন উপদেষ্টা ও বিশিষ্ট শিক্ষানুরাগী',
      qualification: 'এলএলএম (চট্টগ্রাম বিশ্ববিদ্যালয়), সুপ্রিম কোর্ট বার',
      location: 'বাঁশখালী, চট্টগ্রাম',
      recommendationTitle: 'স্বচ্ছ প্রাতিষ্ঠানিক সুশাসন ও দরিদ্র মেধা সুরক্ষা তহবিল',
      quote:
        'নাপোড়া শেখেরখীল উচ্চ বিদ্যালয়ের প্রাতিষ্ঠানিক সুশাসন ও ব্যাংক চালানের ডিজিটালাইজেশন সত্যিই অনুকরণীয়। এলাকার কোনো দরিদ্র বা এতিম শিক্ষার্থী যেন অর্থাভাবে পড়ালেখা থেকে বঞ্চিত না হয়, সেজন্য একটি স্থায়ী উপবৃত্তি এনডাউমেন্ট ফান্ড গঠন করা পরিচালনা কমিটির অন্যতম মহৎ দায়িত্ব।'
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#0c3664] to-[#144275] text-white p-6 rounded-2xl shadow-md border-b-4 border-[#d9482b]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>গুণগত শিক্ষা, মেধা অন্বেষণ ও কৌশলগত উন্নয়ন উইং</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black">
              শিক্ষক প্রশিক্ষণ, মেধা বিকাশ ও বিশেষজ্ঞ পরামর্শক ফোরাম
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-2xl">
              শিক্ষকদের নিয়মিত আধুনিক ইন-সার্ভিস ট্রেনিং, শিক্ষার্থীদের জন্য বছরব্যাপী সহ-শিক্ষা প্রতিযোগিতা এবং দেশের খ্যাতনামা শিক্ষাবিদ কনসালটেন্টদের দিকনির্দেশনা।
            </p>
          </div>

          <button
            type="button"
            onClick={() => window.print()}
            className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all shrink-0"
          >
            <Printer className="w-4 h-4 text-slate-950" />
            <span>প্রিন্ট করুন</span>
          </button>
        </div>

        {/* 3 Pills */}
        <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-white/15">
          <button
            type="button"
            onClick={() => setActiveSubTab('training')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeSubTab === 'training'
                ? 'bg-[#d9482b] text-white shadow-xs'
                : 'bg-black/20 text-slate-200 hover:text-white hover:bg-black/30'
            }`}
          >
            <Laptop className="w-4 h-4" />
            <span>💻 শিক্ষক প্রশিক্ষণ ও কর্মশালা ({trainingPrograms.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('competitions')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeSubTab === 'competitions'
                ? 'bg-[#d9482b] text-white shadow-xs'
                : 'bg-black/20 text-slate-200 hover:text-white hover:bg-black/30'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>🏆 মেধা বিকাশ ও বিভিন্ন প্রতিযোগিতা ({competitions.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('consultants')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeSubTab === 'consultants'
                ? 'bg-[#d9482b] text-white shadow-xs'
                : 'bg-black/20 text-slate-200 hover:text-white hover:bg-black/30'
            }`}
          >
            <Brain className="w-4 h-4" />
            <span>🧠 বিজ্ঞ কনসালটেন্টদের বিশেষ পরামর্শ ({consultants.length})</span>
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: TEACHER TRAINING */}
      {activeSubTab === 'training' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-extrabold text-[#0c3664]">
                শিক্ষকদের পেশাগত দক্ষতা বৃদ্ধি ও পেডাগজি প্রশিক্ষণ
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                নতুন কারিকুলাম, আধুনিক আইসিটি ও নিরপেক্ষ মূল্যায়নে অভিজ্ঞ মাস্টার ট্রেইনার দ্বারা পরিচালিত কর্মশালা।
              </p>
            </div>
            <span className="text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full">
              ১০০% শিক্ষক ইন-সার্ভিস ট্রেনিংপ্রাপ্ত
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {trainingPrograms.map(prog => (
              <div
                key={prog.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4 hover:border-blue-400 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                      {prog.category}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        prog.status === 'আসন্ন'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {prog.status}
                    </span>
                  </div>

                  <h4 className="text-sm sm:text-base font-extrabold text-[#0c3664] leading-snug">
                    {prog.title}
                  </h4>

                  <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <div>
                      <span className="font-bold text-slate-700">রিসোর্স পার্সন:</span> {prog.trainer}
                    </div>
                    <div>
                      <span className="font-bold text-slate-700">সময় ও স্থান:</span> {prog.duration} · {prog.venue}
                    </div>
                    <div>
                      <span className="font-bold text-slate-700">তারিখ:</span> {prog.date}
                    </div>
                    <div>
                      <span className="font-bold text-slate-700">অংশগ্রহণকারী:</span> {prog.participants}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-slate-800 block">প্রশিক্ষণের প্রধান বিষয়বস্তু:</span>
                    <ul className="list-disc list-inside text-[11px] text-slate-600 space-y-0.5">
                      {prog.topics.map((t, idx) => (
                        <li key={idx}>{t}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>সনদ নং: {prog.id}-CERT</span>
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>যাচাইকৃত ট্রেনিং</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: CO-CURRICULAR COMPETITIONS */}
      {activeSubTab === 'competitions' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-extrabold text-[#0c3664]">
                শিক্ষার্থীদের জন্য সহ-শিক্ষা ও মেধা বিকাশ প্রতিযোগিতা
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                ক্রীড়া, বিজ্ঞান মেলা, বিতর্ক, সাংস্কৃতিক উৎসব ও ক্যালিগ্রাফির মাধ্যমে শিক্ষার্থীদের বহুমুখী মেধার বিকাশ।
              </p>
            </div>
            <span className="text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 rounded-full flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-amber-600" />
              <span>প্রতি বছর ৫টি মেগা ইভেন্ট</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {competitions.map(comp => (
              <div
                key={comp.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4 hover:border-amber-400 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#d9482b]" />
                      <span>{comp.date}</span>
                    </span>
                    <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                      {comp.participants}
                    </span>
                  </div>

                  <h4 className="text-sm sm:text-base font-extrabold text-[#0c3664] leading-snug">
                    {comp.title}
                  </h4>

                  <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-700">পরিচালনা:</span> {comp.coordinator}
                  </div>

                  {/* Events list */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-slate-800 block">ইভেন্ট তালিকা:</span>
                    <div className="grid grid-cols-1 gap-1 text-[11px] text-slate-600">
                      {comp.events.map((ev, idx) => (
                        <div key={idx} className="flex items-start gap-1.5">
                          <span className="text-amber-500 font-bold shrink-0">✦</span>
                          <span>{ev}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Top Performers Table */}
                  <div className="pt-2 border-t border-slate-100 space-y-1.5">
                    <span className="text-[11px] font-extrabold text-[#0c3664] flex items-center gap-1">
                      <Medal className="w-3.5 h-3.5 text-amber-500" />
                      <span>সেরা বিজয়ী ও পদকপ্রাপ্ত শিক্ষার্থী:</span>
                    </span>
                    <div className="divide-y divide-slate-100 text-xs">
                      {comp.topPerformers.map((p, idx) => (
                        <div key={idx} className="py-1 flex items-center justify-between text-[11px]">
                          <span className="font-bold text-slate-800">{p.name} ({p.class})</span>
                          <span className="font-extrabold text-amber-700">{p.rank}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: EMINENT CONSULTANTS RECOMMENDATIONS */}
      {activeSubTab === 'consultants' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-extrabold text-[#0c3664]">
                স্কুলের মান উন্নয়নে দেশের বিজ্ঞ শিক্ষাবিদ ও কনসালটেন্টদের বিশেষ পরামর্শ
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                শিক্ষা মন্ত্রণালয়, চুয়েট, ঢাবি ও বোর্ড বিশেষজ্ঞদের দিকনির্দেশনায় আগামী ৫ বছরের রূপকল্প (Vision 2026-2030)।
              </p>
            </div>
            <span className="text-xs font-bold bg-indigo-50 text-indigo-800 border border-indigo-200 px-3 py-1 rounded-full flex items-center gap-1">
              <Brain className="w-3.5 h-3.5 text-indigo-600" />
              <span>উচ্চপর্যায়ের উপদেষ্টা পরিষদ</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {consultants.map((con, idx) => (
              <div
                key={idx}
                className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-sm hover:border-[#0c3664] transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#0c3664] text-amber-300 font-black text-lg flex items-center justify-center shrink-0 shadow-sm">
                      {con.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm sm:text-base text-slate-900 leading-tight">
                        {con.name}
                      </h4>
                      <p className="text-xs text-[#d9482b] font-bold mt-0.5">{con.title}</p>
                      <p className="text-[10px] text-slate-500">{con.qualification}</p>
                    </div>
                  </div>

                  <div className="bg-amber-50/60 border-l-4 border-amber-400 p-3 rounded-r-xl space-y-1">
                    <div className="text-xs font-black text-amber-950 flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5 text-amber-700" />
                      <span>পরামর্শের বিষয়: {con.recommendationTitle}</span>
                    </div>
                    <p className="text-xs text-slate-700 italic leading-relaxed pt-1">
                      "{con.quote}"
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>অবস্থান: {con.location}</span>
                  <span className="text-slate-600 font-semibold">কার্যকরী সুপারিশ কমিটি</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
