import React, { useState } from 'react';
import { MapPin, Phone, Mail, Landmark, CheckCircle2, Send } from 'lucide-react';

export default function ContactTab() {
  const [senderName, setSenderName] = useState<string>('');
  const [senderPhone, setSenderPhone] = useState<string>('');
  const [studentInfo, setStudentInfo] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [contactSubmitted, setContactSubmitted] = useState<boolean>(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newMsg = {
      id: 'msg-' + Date.now(),
      senderName,
      senderPhone,
      studentInfo,
      message,
      submittedAt: new Date().toISOString()
    };
    try {
      const existing = JSON.parse(localStorage.getItem('guardian_messages_to_headmaster') || '[]');
      localStorage.setItem('guardian_messages_to_headmaster', JSON.stringify([newMsg, ...existing]));
    } catch {}
    setContactSubmitted(true);
    setSenderName('');
    setSenderPhone('');
    setStudentInfo('');
    setMessage('');
    setTimeout(() => setContactSubmitted(false), 6000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-[#d9e6e7] rounded-3xl p-6 md:p-10 shadow-xs space-y-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
            যোগাযোগ ও অবস্থান (Contact Us)
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            নাপোড়া শেখেরখীল উচ্চ বিদ্যালয় সংক্রান্ত যেকোনো তথ্যের জন্য সরাসরি যোগাযোগ করুন।
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Contact Information Cards */}
          <div className="space-y-4">
            <div className="p-5 bg-[#f0f6f6] border border-[#d2e5e7] rounded-2xl space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#d9482b] shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-900 text-sm">বিদ্যালয়ের ঠিকানা:</div>
                  <div className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                    নাপোড়া শেখেরখীল উচ্চ বিদ্যালয়<br />
                    ডাকঘর: নাপোড়া (পোস্ট কোড: ৪৩৯০)<br />
                    উপজেলা: বাঁশখালী, জেলা: চট্টগ্রাম<br />
                    বিভাগ: চট্টগ্রাম, বাংলাদেশ
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-3 border-t border-slate-200">
                <Phone className="w-5 h-5 text-[#0c3664] shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-900 text-sm">হেল্পলাইন ও অফিস ফোন:</div>
                  <div className="text-xs font-mono text-slate-700 mt-0.5">
                    প্রধান শিক্ষক: ০১৭১১-০০০১১১<br />
                    অফিস সহকারী: ০১৮১২-২২২৩৩৩
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-3 border-t border-slate-200">
                <Mail className="w-5 h-5 text-[#0c3664] shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-900 text-sm">ইমেইল:</div>
                  <div className="text-xs text-slate-700 mt-0.5 font-mono">
                    info@naporashekherkhil.edu.bd<br />
                    headmaster@school.edu.bd
                  </div>
                </div>
              </div>
            </div>

            {/* Nearest Banks card */}
            <div className="p-4 bg-white border border-[#d2e5e7] rounded-2xl space-y-2 text-xs">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <Landmark className="w-4 h-4 text-[#0c3664]" />
                <span>ফি জমাদানের ব্যাংক শাখাসমূহ:</span>
              </div>
              <div className="text-slate-600 leading-relaxed">
                ১. বাংলাদেশ কৃষি ব্যাংক, নাপোড়া বাজার শাখা, বাঁশখালী<br />
                ২. আইএফআইসি ব্যাংক, নাপোড়া বাজার উপশাখা, বাঁশখালী
              </div>
            </div>
          </div>

          {/* Contact Message Form */}
          <div className="p-6 bg-[#f0f6f6] border border-[#d2e5e7] rounded-2xl space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                প্রধান শিক্ষকের প্রতি অভিভাবকের মেসেজ
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                অভিভাবকবৃন্দ বিদ্যালয় সংক্রান্ত যেকোনো মতামত, পরামর্শ বা জিজ্ঞাসা সরাসরি প্রধান শিক্ষক মহোদয়ের নিকট প্রেরণ করতে পারবেন।
              </p>
            </div>
            
            {contactSubmitted && (
              <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>আপনার বার্তাটি সফলভাবে প্রধান শিক্ষক মহোদয়ের নিকট পাঠানো হয়েছে! বিদ্যালয় কর্তৃপক্ষ শীঘ্রই যোগাযোগ করবে।</span>
              </div>
            )}

            <form onSubmit={handleContactSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">আপনার নাম:</label>
                <input
                  type="text"
                  required
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="যেমন: মোঃ জসিম উদ্দিন"
                  className="w-full px-3 py-2 bg-white border border-[#d2e5e7] rounded-xl focus:outline-none focus:border-[#0c3664]"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">মোবাইল নম্বর:</label>
                <input
                  type="tel"
                  required
                  value={senderPhone}
                  onChange={(e) => setSenderPhone(e.target.value)}
                  placeholder="017XXXXXXXX"
                  className="w-full px-3 py-2 bg-white border border-[#d2e5e7] rounded-xl focus:outline-none focus:border-[#0c3664]"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">শিক্ষার্থীর শ্রেণি ও রোল (যদি থাকে):</label>
                <input
                  type="text"
                  value={studentInfo}
                  onChange={(e) => setStudentInfo(e.target.value)}
                  placeholder="যেমন: ৮ম শ্রেণি, রোল ১২"
                  className="w-full px-3 py-2 bg-white border border-[#d2e5e7] rounded-xl focus:outline-none focus:border-[#0c3664]"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">বার্তা বা জিজ্ঞাস্য বিষয়:</label>
                <textarea
                  rows={3}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="আপনার বক্তব্য এখানে লিখুন..."
                  className="w-full p-3 bg-white border border-[#d2e5e7] rounded-xl focus:outline-none focus:border-[#0c3664]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#0c3664] hover:bg-[#092b50] text-white font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5 text-amber-300" />
                <span>বার্তা পাঠান</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
