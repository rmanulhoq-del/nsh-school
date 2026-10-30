import React from 'react';
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
  User
} from 'lucide-react';
import SchoolLogo from './SchoolLogo';
import HeadmasterPortrait from './HeadmasterPortrait';
import PresidentPortrait from './PresidentPortrait';

import { HeadmasterData, PresidentData } from '../types';

interface AboutTabProps {
  language: 'bn' | 'en';
  isAdmin?: boolean;
  headmasterData?: HeadmasterData;
  onOpenEditHeadmaster?: () => void;
  presidentData?: PresidentData;
  onOpenEditPresident?: () => void;
}

export default function AboutTab({
  language,
  isAdmin = false,
  headmasterData,
  onOpenEditHeadmaster,
  presidentData,
  onOpenEditPresident
}: AboutTabProps) {
  return (
    <div className="space-y-8">
      <div className="bg-white border border-[#d9e6e7] rounded-3xl p-6 md:p-10 shadow-xs space-y-8">
        
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
                <span>{language === 'bn' ? 'শ্রেণি: ৬ষ্ঠ থেকে ১০ম (শাখা: এ, বি, সি, ডি)' : 'Grades: 6 to 10 (Sections A, B, C, D)'}</span>
              </div>
            </div>
          </div>

          {/* Monogram Badge Card */}
          <div className="shrink-0 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-[#f0f6f6] to-[#e4eff0] border-2 border-[#d2e5e7] rounded-3xl text-center shadow-xs">
            <SchoolLogo size={140} className="drop-shadow-md hover:scale-105 transition-transform" />
            <div className="mt-3 text-sm font-bold text-slate-900">
              {language === 'bn' ? 'বিদ্যালয়ের অফিশিয়াল মনোগ্রাম' : 'Official School Emblem'}
            </div>
            <div className="text-xs text-[#d9482b] font-bold italic mt-0.5">
              "পড় স্রষ্টার নামে"
            </div>
            <div className="text-[11px] text-slate-600 font-semibold mt-1">
              {language === 'bn' ? 'স্থাপিত : ১৯৬৪ ইং · বাঁশখালী, চট্টগ্রাম' : 'Est. 1964 · Banshkhali, Chattogram'}
            </div>
          </div>
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
    </div>
  );
}
