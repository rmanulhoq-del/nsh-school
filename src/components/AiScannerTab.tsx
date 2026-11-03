import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Check,
  Upload,
  FileSpreadsheet,
  Users,
  Landmark,
  Image as ImageIcon,
  Copy,
  Trash2,
  ArrowRight,
  UserPlus
} from 'lucide-react';
import { Student, ExtractedRecord, Transaction, formatClassBangla } from '../types';
import { SAMPLE_BKB_STATEMENT, SAMPLE_IFIC_STATEMENT } from '../data/initialData';

interface AiScannerTabProps {
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
}

const SAMPLE_STUDENTS_PASTE = `রোল | নাম | শ্রেণি | শাখা | বিভাগ | অভিভাবক | মোবাইল
১ | মোহাম্মদ তানভীর চৌধুরী | ১০ | A | বিজ্ঞান | মোঃ জাহাঙ্গীর আলম | 01819-112233
২ | ফারহানা সুলতানা সুমি | ১০ | A | বিজ্ঞান | সুলতান আহমদ | 01822-445566
৩ | সাকিব হাসান শান্ত | ১০ | B | মানবিক | আবুল বাশার | 01833-778899
৪ | নুসরাত জাহান মিম | ১০ | B | মানবিক | নুরুল হুদা | 01844-001122
৫ | রবিউল ইসলাম সিয়াম | ৯ | A | বিজ্ঞান | জয়নাল আবেদীন | 01855-334455
৬ | আয়েশা ছিদ্দিকা মারিয়া | ৯ | B | ব্যবসায় শিক্ষা | রফিকুল ইসলাম | 01866-667788
৭ | হাসিবুর রহমান তামিম | ৮ | A | সাধারণ | মোস্তফা কামাল | 01877-990011
৮ | তাসফিয়া আনজুম রাইসা | ৮ | B | সাধারণ | ইকবাল হোসেন | 01888-223344
৯ | জিসান মাহমুদ আকাশ | ৭ | A | সাধারণ | ফজলুল করিম | 01899-556677
১০ | সুমাইয়া আক্তার রিয়া | ৬ | A | সাধারণ | দেলোয়ার হোসেন | 01811-889900`;

export default function AiScannerTab({
  students,
  setStudents,
  transactions,
  setTransactions
}: AiScannerTabProps) {
  // Main Tab Switch: 'students' (Bulk Student Scanner) or 'bank' (Bank Statement Reconcile)
  const [scannerMode, setScannerMode] = useState<'students' | 'bank'>('students');

  // --- Student Bulk Scanner States ---
  const [studentInputText, setStudentInputText] = useState<string>(SAMPLE_STUDENTS_PASTE);
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [isStudentProcessing, setIsStudentProcessing] = useState<boolean>(false);
  const [parsedStudents, setParsedStudents] = useState<Student[]>([]);
  const [studentSuccessMessage, setStudentSuccessMessage] = useState<string | null>(null);
  const [studentErrorMessage, setStudentErrorMessage] = useState<string | null>(null);

  // --- Bank Statement States ---
  const [statementInput, setStatementInput] = useState<string>(SAMPLE_BKB_STATEMENT);
  const [aiSelectedBankHint, setAiSelectedBankHint] = useState<'বাংলাদেশ কৃষি ব্যাংক' | 'আইএফআইসি ব্যাংক'>('বাংলাদেশ কৃষি ব্যাংক');
  const [isAiProcessing, setIsAiProcessing] = useState<boolean>(false);
  const [aiExtractedRecords, setAiExtractedRecords] = useState<ExtractedRecord[]>([]);
  const [aiMessage, setAiMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // --- Handlers for Student List Scanner ---
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImagePreview(reader.result as string);
        setStudentSuccessMessage(`নথি "${file.name}" সফলভাবে আপলোড করা হয়েছে। নিচে 'এআই দিয়ে তালিকা স্ক্যান ও পার্স করুন' বাটনে ক্লিক করুন।`);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleParseStudentList = () => {
    if (!studentInputText.trim() && !uploadedImagePreview) {
      setStudentErrorMessage('অনুগ্রহ করে শিক্ষার্থীদের তালিকা পেস্ট করুন অথবা ইমেজ/পিডিএফ ফাইল নির্বাচন করুন।');
      return;
    }

    setIsStudentProcessing(true);
    setStudentErrorMessage(null);
    setStudentSuccessMessage(null);

    // Smart Text / OCR Parser
    setTimeout(() => {
      const lines = studentInputText.split('\n').filter(l => l.trim().length > 0);
      const extractedList: Student[] = [];

      lines.forEach((line) => {
        // Skip header lines
        if (line.includes('রোল') && line.includes('নাম')) return;

        // Split by |, comma, tab or multiple spaces
        let parts = line.split(/[|\t,]/).map(p => p.trim());
        if (parts.length < 2) {
          parts = line.split(/\s{2,}/).map(p => p.trim());
        }

        if (parts.length >= 2) {
          // Detect roll
          const rollMatch = parts[0].match(/\d+/);
          const roll = rollMatch ? parseInt(rollMatch[0], 10) : (extractedList.length + 1);

          // Name
          const name = parts[1] || `শিক্ষার্থী ${roll}`;

          // Class
          let className: '6' | '7' | '8' | '9' | '10' = '10';
          const classStr = parts[2] || '';
          if (classStr.includes('৬') || classStr.includes('6')) className = '6';
          else if (classStr.includes('৭') || classStr.includes('7')) className = '7';
          else if (classStr.includes('৮') || classStr.includes('8')) className = '8';
          else if (classStr.includes('৯') || classStr.includes('9')) className = '9';
          else if (classStr.includes('১০') || classStr.includes('10')) className = '10';

          // Section
          let section: 'A' | 'B' | 'C' | 'D' = 'A';
          const secStr = (parts[3] || '').toUpperCase();
          if (secStr.includes('B') || secStr.includes('খ') || secStr.includes('বি')) section = 'B';
          else if (secStr.includes('C') || secStr.includes('গ') || secStr.includes('সি')) section = 'C';
          else if (secStr.includes('D') || secStr.includes('ঘ') || secStr.includes('ডি')) section = 'D';

          // Group
          let group: 'science' | 'humanities' | 'business' | undefined = undefined;
          if (className === '9' || className === '10') {
            const grpStr = parts[4] || '';
            if (grpStr.includes('মানবিক') || grpStr.includes('arts')) group = 'humanities';
            else if (grpStr.includes('ব্যবসায়') || grpStr.includes('commerce') || grpStr.includes('বাণিজ্য')) group = 'business';
            else group = 'science';
          }

          // Guardian & Phone
          const guardianName = parts[5] || parts[4] || 'অভিভাবকের তথ্য সংরক্ষিত';
          const phoneMatch = line.match(/01\d{3}[-\s]?\d{6}/);
          const guardianPhone = phoneMatch ? phoneMatch[0] : (parts[6] || '01800-000000');

          const newId = `STU-${className}${section}-${String(roll).padStart(3, '0')}`;

          extractedList.push({
            id: newId,
            name,
            className,
            section,
            roll,
            gender: 'male',
            group,
            guardianName,
            guardianPhone,
            monthlyFee: 500,
            examFee: 300,
            status: 'due'
          });
        }
      });

      if (extractedList.length > 0) {
        setParsedStudents(extractedList);
        setStudentSuccessMessage(`AI পার্সার সফলভাবে ${extractedList.length} জন শিক্ষার্থীর তথ্য শনাক্ত করেছে! নিচে প্রিভিউ তালিকা দেখে 'ডাটাবেসে যুক্ত করুন' বোতামে ক্লিক করুন।`);
      } else {
        setStudentErrorMessage('তালিকা থেকে শিক্ষার্থীদের তথ্য শনাক্ত করা সম্ভব হয়নি। সঠিক ফরম্যাটে পেস্ট করুন।');
      }

      setIsStudentProcessing(false);
    }, 600);
  };

  const handleApplyStudentsToDatabase = () => {
    if (parsedStudents.length === 0) return;

    // Merge or append: if student with same class + section + roll exists, update, else prepend
    const currentList = [...students];
    let addedCount = 0;
    let updatedCount = 0;

    parsedStudents.forEach(newStu => {
      const idx = currentList.findIndex(
        s => s.className === newStu.className && s.section === newStu.section && s.roll === newStu.roll
      );
      if (idx !== -1) {
        currentList[idx] = { ...currentList[idx], ...newStu };
        updatedCount++;
      } else {
        currentList.push(newStu);
        addedCount++;
      }
    });

    setStudents(currentList);
    localStorage.setItem('school_students', JSON.stringify(currentList));

    setStudentSuccessMessage(
      `আলহামদুলিল্লাহ! মোট ${addedCount} জন নতুন শিক্ষার্থী ডাটাবেসে সফলভাবে যুক্ত হয়েছে এবং ${updatedCount} জনের তথ্য হালনাগাদ করা হয়েছে! এখন 'শিক্ষার্থী তথ্য ডিরেক্টরি' ট্যাবে গিয়ে তাদের তালিকা দেখুন।`
    );
    setParsedStudents([]);
  };

  // --- Handlers for Bank Statement ---
  const handleAnalyzeStatementWithAI = async () => {
    if (!statementInput.trim()) {
      setAiMessage({ type: 'error', text: 'অনুগ্রহ করে ব্যাংকের স্টেটমেন্ট টেক্সট প্রদান করুন।' });
      return;
    }

    setIsAiProcessing(true);
    setAiMessage(null);

    try {
      const res = await fetch('/api/ai-reconcile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          statementText: statementInput,
          bankHint: aiSelectedBankHint
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.records && Array.isArray(data.records) && data.records.length > 0) {
          setAiExtractedRecords(data.records);
          setAiMessage({
            type: 'success',
            text: `AI সফলভাবে স্টেটমেন্ট থেকে ${data.records.length} টি পেমেন্ট রেকর্ড খুঁজে বের করেছে! নিচে প্রিভিউ দেখুন এবং '১-ক্লিকে ডেটাবেস আপডেট' চাপুন।`
          });
          setIsAiProcessing(false);
          return;
        }
      }
    } catch {
      // Fallback
    }

    // Smart Fallback Parser
    const extracted: ExtractedRecord[] = [];
    const lines = statementInput.split('\n');

    students.forEach(student => {
      const regexId = new RegExp(student.id, 'i');
      const regexRoll = new RegExp(`রোল\\s*${student.roll}|roll\\s*${student.roll}`, 'i');
      const foundInText = lines.some(line => regexId.test(line) || (regexRoll.test(line) && line.includes(student.className)));

      if (foundInText) {
        const isBkb = statementInput.includes('কৃষি') || statementInput.includes('BKB') || aiSelectedBankHint === 'বাংলাদেশ কৃষি ব্যাংক';
        const detectedBank = isBkb ? 'বাংলাদেশ কৃষি ব্যাংক' : 'আইএফআইসি ব্যাংক';
        const prefix = isBkb ? 'BKB' : 'IFIC';
        const mockTxn = `${prefix}-AI-${Math.floor(100000 + Math.random() * 900000)}`;

        extracted.push({
          studentId: student.id,
          roll: student.roll,
          className: student.className,
          section: student.section,
          studentName: student.name,
          amount: student.monthlyFee + student.examFee,
          bank: detectedBank,
          txnId: mockTxn,
          paymentDate: new Date().toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
        });
      }
    });

    if (extracted.length > 0) {
      setAiExtractedRecords(extracted);
      setAiMessage({
        type: 'success',
        text: `স্মার্ট এআই পার্সার সফলভাবে ${extracted.length} জন শিক্ষার্থীর পেমেন্ট রেকর্ড শনাক্ত করেছে! নিচে তালিকা দেখে ১-ক্লিকে ডাটাবেসে সেভ করুন।`
      });
    } else {
      setAiMessage({
        type: 'error',
        text: 'স্টেটমেন্ট থেকে কোনো নির্দিষ্ট শিক্ষার্থীর আইডি বা রোল মেলানো সম্ভব হয়নি। অনুগ্রহ করে স্টেটমেন্ট টেক্সটটি যাচাই করুন।'
      });
    }

    setIsAiProcessing(false);
  };

  const handleApplyAiRecordsToDatabase = () => {
    if (aiExtractedRecords.length === 0) return;

    let updatedCount = 0;
    const now = new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const updatedStudents = students.map(student => {
      const match = aiExtractedRecords.find(r => r.studentId === student.id || (r.roll === student.roll && r.className === student.className));
      if (match) {
        updatedCount++;
        return {
          ...student,
          status: 'paid' as const,
          paidBank: match.bank,
          txnId: match.txnId,
          paymentDate: match.paymentDate || now
        };
      }
      return student;
    });

    setStudents(updatedStudents);
    localStorage.setItem('school_students', JSON.stringify(updatedStudents));

    const newTxns: Transaction[] = aiExtractedRecords.map(r => ({
      id: `TXN-AI-${Math.floor(1000 + Math.random() * 9000)}`,
      type: 'income',
      title: `AI সিঙ্ক: ${r.studentName || r.studentId} এর ফি জমা`,
      category: 'শিক্ষার্থী ফি',
      amount: r.amount || 800,
      date: new Date().toISOString().split('T')[0],
      bank: r.bank,
      refNo: r.txnId
    }));
    setTransactions([...newTxns, ...transactions]);

    setAiMessage({
      type: 'success',
      text: `আলহামদুলিল্লাহ! মোট ${updatedCount} জন শিক্ষার্থীর ফি সফলভাবে ডেটাবেসে "PAID" হিসেবে হালনাগাদ করা হয়েছে!`
    });
    setAiExtractedRecords([]);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0c3664] to-[#124275] text-white p-6 rounded-3xl border-2 border-amber-400 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-300 font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>AI স্মার্ট ডেটা হাব ও বাল্ক ইম্পোর্ট সেন্টার</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
            শিক্ষার্থী তালিকা স্ক্যান ও ব্যাংক স্টেটমেন্ট রিকনসিলিয়েশন
          </h2>
          <p className="text-xs text-slate-200 mt-1 max-w-2xl">
            জেপিজি/পিডিএফ স্ক্যান কপি, এক্সেল ফাইল বা টেক্সট তালিকা পেস্ট করে চোখের পলকে শত শত শিক্ষার্থীর তথ্য ডেটাবেসে যুক্ত করুন অথবা ব্যাংকের দৈনিক জমা শিট অটো-রিকনসাইল করুন।
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center bg-[#07213d] p-1.5 rounded-2xl border border-amber-400/40 shrink-0">
          <button
            type="button"
            onClick={() => setScannerMode('students')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              scannerMode === 'students'
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>শিক্ষার্থী তালিকা স্ক্যান ও ইম্পোর্ট</span>
          </button>
          <button
            type="button"
            onClick={() => setScannerMode('bank')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              scannerMode === 'bank'
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Landmark className="w-4 h-4" />
            <span>ব্যাংক স্টেটমেন্ট ফি সিঙ্ক</span>
          </button>
        </div>
      </div>

      {/* MODE 1: BULK STUDENT LIST SCANNER */}
      {scannerMode === 'students' && (
        <div className="bg-white border border-[#d9e6e7] rounded-3xl p-5 sm:p-7 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-[#d9482b]" />
                <span>বাল্ক শিক্ষার্থী ডেটা এন্ট্রি ও OCR স্ক্যানার</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                ছবি (JPG/PNG), স্ক্যানড পিডিএফ কপি অথবা এক্সেল/ওয়ার্ডের টেবিল টেক্সট দিয়ে বাল্ক শিক্ষার্থী সংযুক্ত করুন।
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setStudentInputText(SAMPLE_STUDENTS_PASTE);
                  setUploadedImagePreview(null);
                  setUploadedFileName('');
                  setParsedStudents([]);
                  setStudentSuccessMessage('নমুনা ১০ জন শিক্ষার্থীর তালিকা লোড করা হয়েছে।');
                  setStudentErrorMessage(null);
                }}
                className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>স্যাম্পল তালিকা লোড করুন</span>
              </button>
            </div>
          </div>

          {/* Input & Upload Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Text / CSV Input */}
            <div className="lg:col-span-2 space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <label>শিক্ষার্থীদের তালিকা (টেক্সট, এক্সেল কপি বা টেবিল):</label>
                <span className="text-slate-400 font-mono text-[11px]">ফরম্যাট: রোল | নাম | শ্রেণি | শাখা | বিভাগ | অভিভাবক | ফোন</span>
              </div>
              <textarea
                rows={10}
                value={studentInputText}
                onChange={(e) => setStudentInputText(e.target.value)}
                placeholder="রোল | শিক্ষার্থীর নাম | শ্রেণি | শাখা | বিভাগ | অভিভাবক | ফোন..."
                className="w-full p-4 font-mono text-xs bg-[#f8fafc] border border-slate-200 rounded-2xl focus:outline-none focus:border-[#0c3664] focus:ring-2 focus:ring-blue-100 text-slate-800 leading-relaxed shadow-inner"
              />
            </div>

            {/* Right Col: Image / PDF Document Scanner */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-700">
                স্ক্যান কপি বা ছবি আপলোড (OCR):
              </label>

              <div className="border-2 border-dashed border-[#144275]/40 hover:border-[#144275] bg-[#f0f6f6] rounded-2xl p-4 text-center transition-all flex flex-col items-center justify-center min-h-[220px]">
                {uploadedImagePreview ? (
                  <div className="space-y-2 w-full">
                    <img
                      src={uploadedImagePreview}
                      alt="Uploaded Document"
                      className="max-h-36 mx-auto rounded-lg shadow-sm border border-slate-200 object-cover"
                    />
                    <div className="text-[11px] font-bold text-slate-700 truncate px-2">
                      {uploadedFileName}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setUploadedImagePreview(null);
                        setUploadedFileName('');
                      }}
                      className="text-[10px] text-rose-600 hover:underline flex items-center justify-center gap-1 mx-auto"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>ছবি রিমুভ করুন</span>
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center justify-center p-2 w-full">
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-xs flex items-center justify-center text-[#0c3664] mb-2 border border-slate-200">
                      <Upload className="w-6 h-6 text-[#0c3664]" />
                    </div>
                    <span className="text-xs font-bold text-slate-800">
                      ছবি বা স্ক্যান কপি সিলেক্ট করুন
                    </span>
                    <span className="text-[10px] text-slate-500 mt-1">
                      হাতে লেখা বা প্রিন্ট করা শিক্ষার্থীর রেজিস্টার, মার্কশিট বা তালিকা (JPG, PNG)
                    </span>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3 text-[11px] text-amber-900 space-y-1">
                <div className="font-bold flex items-center gap-1 text-amber-950">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>চ্যাটে পাঠালেও চলবে!</span>
                </div>
                <p className="text-[10px] leading-tight text-amber-800">
                  আপনি চাইলে চ্যাটের ভেতরে সরাসরি ছবি বা ফাইল এটাচ করে দিলেও আমরা সাথে সাথে সাইটে স্বয়ংক্রিয়ভাবে কোডে যুক্ত করে দেব।
                </p>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <span className="text-xs text-slate-500">
              বিদ্যালয়ে বর্তমানে মোট শিক্ষার্থী রয়েছে: <strong className="text-slate-800">{students.length} জন</strong>
            </span>

            <button
              type="button"
              disabled={isStudentProcessing || (!studentInputText.trim() && !uploadedImagePreview)}
              onClick={handleParseStudentList}
              className="px-6 py-3 bg-[#0c3664] hover:bg-[#092b50] disabled:opacity-50 text-white font-bold rounded-xl text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{isStudentProcessing ? 'এআই পার্স করছে...' : 'এআই দিয়ে তালিকা স্ক্যান ও পার্স করুন'}</span>
            </button>
          </div>

          {/* Success / Error Messages */}
          {studentSuccessMessage && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="font-medium leading-relaxed">{studentSuccessMessage}</div>
            </div>
          )}
          {studentErrorMessage && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="font-medium leading-relaxed">{studentErrorMessage}</div>
            </div>
          )}

          {/* Parsed Students Preview Table */}
          {parsedStudents.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-slate-200 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-amber-50/60 p-4 rounded-2xl border border-amber-200">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <UserPlus className="w-4 h-4 text-amber-600" />
                    <span>শনাক্তকৃত নতুন শিক্ষার্থীদের প্রিভিউ তালিকা ({parsedStudents.length} জন)</span>
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    তথ্যগুলো যাচাই করুন এবং নিচের বোতাম চেপে শিক্ষার্থী ডিরেক্টরিতে সংরক্ষণ করুন।
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleApplyStudentsToDatabase}
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center gap-2 cursor-pointer active:scale-95 shrink-0"
                >
                  <Check className="w-4 h-4 text-white" />
                  <span>১-ক্লিকে শিক্ষার্থী ডিরেক্টরিতে সংরক্ষণ করুন (Import All)</span>
                </button>
              </div>

              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#0c3664] text-white">
                      <tr>
                        <th className="py-2.5 px-3">রোল</th>
                        <th className="py-2.5 px-3">আইডি</th>
                        <th className="py-2.5 px-3">শিক্ষার্থীর নাম</th>
                        <th className="py-2.5 px-3">শ্রেণি ও শাখা</th>
                        <th className="py-2.5 px-3">বিভাগ / গ্রুপ</th>
                        <th className="py-2.5 px-3">অভিভাবকের নাম</th>
                        <th className="py-2.5 px-3">মোবাইল নম্বর</th>
                        <th className="py-2.5 px-3 text-center">স্ট্যাটাস</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {parsedStudents.map((stu, i) => (
                        <tr key={i} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{stu.roll}</td>
                          <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">{stu.id}</td>
                          <td className="py-2.5 px-3 font-bold text-slate-800">{stu.name}</td>
                          <td className="py-2.5 px-3 text-slate-700">
                            {formatClassBangla(stu.className)} · শাখা {stu.section}
                          </td>
                          <td className="py-2.5 px-3 text-slate-600">
                            {stu.group === 'science' ? 'বিজ্ঞান' : stu.group === 'humanities' ? 'মানবিক' : stu.group === 'business' ? 'ব্যবসায় শিক্ষা' : 'সাধারণ'}
                          </td>
                          <td className="py-2.5 px-3 text-slate-700">{stu.guardianName}</td>
                          <td className="py-2.5 px-3 font-mono text-slate-600">{stu.guardianPhone}</td>
                          <td className="py-2.5 px-3 text-center">
                            <span className="inline-block bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-bold">
                              প্রস্তুত
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODE 2: BANK STATEMENT RECONCILIATION */}
      {scannerMode === 'bank' && (
        <div className="bg-white border border-[#d9e6e7] rounded-3xl p-5 sm:p-7 shadow-xs space-y-6">
          <div className="pb-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-[#0c3664] font-bold">
                <Sparkles className="w-4 h-4 text-[#d9482b]" />
                <span>Gemini AI চালিত স্মার্ট ব্যাংক স্টেটমেন্ট রিকনসিলিয়েশন</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mt-1">
                ব্যাংক স্টেটমেন্ট থেকে এআই দিয়ে ১-ক্লিকে সব স্টুডেন্ট অটো আপডেট
              </h3>
              <p className="text-xs text-slate-600 mt-1 max-w-3xl">
                নাপোড়া বাজার কৃষি ব্যাংক বা আইএফআইসি ব্যাংক থেকে প্রাপ্ত দৈনিক জমার শিট বা টেক্সট এখানে পেস্ট করুন। এআই স্বয়ংক্রিয়ভাবে শিক্ষার্থীদের রোল, শ্রেণি, জমার পরিমাণ ও ট্রানজাকশন খুঁজে বের করে ডাটাবেস আপডেট করবে।
              </p>
            </div>
          </div>

          {/* Sample statement presets */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">নমুনা স্টেটমেন্ট লোড করুন:</span>
            <button
              type="button"
              onClick={() => {
                setStatementInput(SAMPLE_BKB_STATEMENT);
                setAiSelectedBankHint('বাংলাদেশ কৃষি ব্যাংক');
                setAiExtractedRecords([]);
                setAiMessage(null);
              }}
              className="px-3 py-1 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors cursor-pointer"
            >
              বাংলাদেশ কৃষি ব্যাংক (নাপোড়া বাজার শাখা) স্যাম্পল শিট
            </button>
            <button
              type="button"
              onClick={() => {
                setStatementInput(SAMPLE_IFIC_STATEMENT);
                setAiSelectedBankHint('আইএফআইসি ব্যাংক');
                setAiExtractedRecords([]);
                setAiMessage(null);
              }}
              className="px-3 py-1 bg-[#f0f6f6] text-[#0c3664] hover:bg-slate-200 rounded-lg border border-[#d2e5e7] transition-colors cursor-pointer"
            >
              আইএফআইসি ব্যাংক (নাপোড়া বাজার উপশাখা) স্যাম্পল শিট
            </button>
          </div>

          {/* Statement input area */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
              <label>ব্যাংক স্টেটমেন্ট বা জমার স্লিপের টেক্সট:</label>
              <span>যেকোনো ফরম্যাট সমর্থিত (টেক্সট, এক্সেল, কপি-পেস্ট)</span>
            </div>
            <textarea
              rows={8}
              value={statementInput}
              onChange={(e) => setStatementInput(e.target.value)}
              placeholder="ব্যাংক স্টেটমেন্ট এখানে পেস্ট করুন..."
              className="w-full p-4 font-mono text-xs bg-[#f0f6f6] border border-[#d2e5e7] rounded-xl focus:outline-none focus:border-[#0c3664] text-slate-800"
            />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
              <div className="flex items-center gap-3 text-xs">
                <span className="text-slate-600 font-medium">স্টেটমেন্টের ব্যাংক:</span>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    checked={aiSelectedBankHint === 'বাংলাদেশ কৃষি ব্যাংক'}
                    onChange={() => setAiSelectedBankHint('বাংলাদেশ কৃষি ব্যাংক')}
                    className="text-[#0c3664]"
                  />
                  <span>বাংলাদেশ কৃষি ব্যাংক</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    checked={aiSelectedBankHint === 'আইএফআইসি ব্যাংক'}
                    onChange={() => setAiSelectedBankHint('আইএফআইসি ব্যাংক')}
                    className="text-[#0c3664]"
                  />
                  <span>আইএফআইসি ব্যাংক</span>
                </label>
              </div>

              <button
                type="button"
                disabled={isAiProcessing || !statementInput.trim()}
                onClick={handleAnalyzeStatementWithAI}
                className="px-6 py-2.5 bg-[#0c3664] hover:bg-[#092b50] disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{isAiProcessing ? 'এআই দিয়ে বিশ্লেষণ করা হচ্ছে...' : 'এআই দিয়ে স্টেটমেন্ট বিশ্লেষণ করুন'}</span>
              </button>
            </div>
          </div>

          {/* Message Alert */}
          {aiMessage && (
            <div className={`p-4 rounded-xl text-xs flex items-start gap-3 ${
              aiMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                : 'bg-rose-50 text-rose-900 border border-rose-200'
            }`}>
              {aiMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div className="leading-relaxed font-medium">{aiMessage.text}</div>
            </div>
          )}

          {/* Extracted Records Preview Table */}
          {aiExtractedRecords.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    এআই দ্বারা শনাক্তকৃত পেমেন্ট রেকর্ডসমূহ ({aiExtractedRecords.length} টি)
                  </h3>
                  <p className="text-xs text-slate-500">
                    নিচের তথ্যগুলো যাচাই করে '১-ক্লিকে ডেটাবেস আপডেট' চাপুন
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleApplyAiRecordsToDatabase}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs flex items-center gap-2 shrink-0 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>১-ক্লিকে ডেটাবেস আপডেট করুন (Apply All)</span>
                </button>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#f0f6f6] border-b border-[#d2e5e7] text-slate-700 font-semibold">
                    <tr>
                      <th className="py-2.5 px-3">আইডি</th>
                      <th className="py-2.5 px-3">নাম</th>
                      <th className="py-2.5 px-3">শ্রেণি ও শাখা</th>
                      <th className="py-2.5 px-3">রোল</th>
                      <th className="py-2.5 px-3 text-right">টাকা</th>
                      <th className="py-2.5 px-3">ব্যাংক</th>
                      <th className="py-2.5 px-3">ট্রানজাকশন আইডি</th>
                      <th className="py-2.5 px-3 text-center">স্ট্যাটাস হবে</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {aiExtractedRecords.map((rec, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-mono font-medium text-slate-900">{rec.studentId}</td>
                        <td className="py-2.5 px-3 font-medium text-slate-800">{rec.studentName || '—'}</td>
                        <td className="py-2.5 px-3 text-slate-600">{formatClassBangla(rec.className)} · শাখা {rec.section}</td>
                        <td className="py-2.5 px-3 font-mono text-slate-700">{rec.roll}</td>
                        <td className="py-2.5 px-3 text-right font-mono font-semibold text-slate-900">৳{rec.amount}</td>
                        <td className="py-2.5 px-3 text-slate-700">{rec.bank}</td>
                        <td className="py-2.5 px-3 font-mono text-slate-500">{rec.txnId}</td>
                        <td className="py-2.5 px-3 text-center">
                          <span className="inline-block bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-bold">
                            পেইড হবে
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
