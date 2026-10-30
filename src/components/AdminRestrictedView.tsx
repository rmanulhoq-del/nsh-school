import React from 'react';
import { Lock, ShieldAlert, ArrowLeft, KeyRound, Eye } from 'lucide-react';

interface AdminRestrictedViewProps {
  title: string;
  description: string;
  onLogin: () => void;
  onGoHome: () => void;
}

export default function AdminRestrictedView({
  title,
  description,
  onLogin,
  onGoHome
}: AdminRestrictedViewProps) {
  return (
    <div className="max-w-2xl mx-auto my-12 bg-white rounded-3xl border border-amber-200 shadow-md p-6 sm:p-10 text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-50 border-2 border-amber-400 flex items-center justify-center text-amber-600 shadow-xs">
        <Lock className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
          <span>এডমিন প্যানেল সংরক্ষিত এলাকা</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900">{title}</h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
          {description}
        </p>
      </div>

      <div className="bg-[#f0f6f6] border border-[#d2e5e7] p-4 rounded-2xl text-xs text-slate-700 text-left space-y-2">
        <div className="font-bold text-[#0c3664] flex items-center gap-1.5">
          <Eye className="w-4 h-4 text-emerald-600" />
          <span>পাবলিক ভিজিটরদের জন্য জ্ঞাতব্য:</span>
        </div>
        <p className="text-[11px] leading-relaxed text-slate-600">
          ছাত্র/ছাত্রীদের ব্যক্তিগত আর্থিক লেনদেন, মাসিক বেতন/পরীক্ষার ফি এর অবস্থা, পরীক্ষার গোপনীয় নম্বর এন্ট্রি, টেবুলেশন শীট ও স্কুলের অভ্যন্তরীণ আয়-ব্যয়ের হিসাবের গোপনীয়তা বজায় রাখার স্বার্থে এই ফিচারগুলো শুধুমাত্র স্কুলের দায়িত্বপ্রাপ্ত শিক্ষক ও এডমিন কর্মকর্তাদের জন্য সীমাবদ্ধ রাখা হয়েছে।
        </p>
      </div>

      <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={onLogin}
          className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold rounded-xl text-xs flex items-center gap-2 shadow-md transition-all"
        >
          <KeyRound className="w-4 h-4 text-slate-950" />
          <span>এডমিন প্যানেলে লগইন করুন</span>
        </button>

        <button
          type="button"
          onClick={onGoHome}
          className="px-5 py-2.5 bg-[#0c3664] hover:bg-[#092b50] text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-xs transition-all"
        >
          <ArrowLeft className="w-4 h-4 text-amber-300" />
          <span>মূল পাতায় (হোম) ফিরে যান</span>
        </button>
      </div>
    </div>
  );
}
