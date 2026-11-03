import React, { useState, useEffect } from 'react';
import {
  Sun,
  Flag,
  Music,
  Volume2,
  VolumeX,
  Users,
  Clock,
  Calendar,
  CheckCircle2,
  Award,
  Plus,
  Trash2,
  Edit3,
  Image as ImageIcon,
  BookOpen,
  Eye,
  Printer,
  Sparkles,
  X,
  Radio,
  FileText,
  RotateCcw,
  ShieldCheck,
  Check,
  Lock,
  KeyRound,
  AlertCircle,
  Shield
} from 'lucide-react';
import { Teacher, AdminUser } from '../types';

interface DailyAssemblyTabProps {
  language: 'bn' | 'en';
  isAdmin: boolean;
  currentAdmin?: AdminUser | null;
  onRequireAdminLogin: () => void;
  teachers?: Teacher[];
}

export interface AssemblyPhotoItem {
  id: string;
  title: string;
  date: string;
  category: string;
  imageUrl: string;
  caption: string;
  isFeatured?: boolean;
}

export interface AssemblyRoster {
  date: string;
  dutyTeacherName: string;
  dutyTeacherPhone: string;
  assistantTeacherName: string;
  scoutLeader: string;
  quranReciter: string;
  gitaReciter: string;
  studentAnchor: string;
  moralLessonTitle: string;
  moralLessonBody: string;
}

export interface AssemblyHeaderInfo {
  title: string;
  subtitle: string;
  time: string;
  attendance: string;
  participants: string;
  location: string;
  introText: string;
}

export interface AssemblyRoutineStep {
  id: string;
  step: string;
  time: string;
  title: string;
  desc: string;
}

export interface AssemblyRulesData {
  girlsTitle: string;
  girlsPoints: string[];
  boysTitle: string;
  boysPoints: string[];
  strictRules: string[];
}

const DEFAULT_HEADER_INFO: AssemblyHeaderInfo = {
  title: 'নাপোড়া শেখেরখীল উচ্চ বিদ্যালয় প্রাত্যহিক সমাবেশ',
  subtitle: 'প্রাত্যহিক সমাবেশ · নিয়মানুবর্তিতা ও দেশপ্রেম',
  time: 'সকাল ৯:১৫ ঘটিকা',
  attendance: 'বাধ্যতামূলক',
  participants: '৬ষ্ঠ-১০ম শ্রেণি',
  location: 'বিদ্যালয় কেন্দ্রীয় প্রাঙ্গণ',
  introText: 'প্রতিটি শিক্ষাদিবসের শুভ সূচনা হয় সুশৃঙ্খল প্রাত্যহিক সমাবেশের মাধ্যমে। পবিত্র ধর্মগ্রন্থ থেকে পাঠ, জাতীয় পতাকা উত্তোলন, সমস্বরে জাতীয় সংগীত ও দেশাত্ববোধক শপথের মাধ্যমে হাজারো শিক্ষার্থী আত্মশুদ্ধি ও শৃঙ্খলার দীক্ষা নেয়।'
};

const DEFAULT_ROSTER: AssemblyRoster = {
  date: '২০২৬-০৩-১০',
  dutyTeacherName: 'জনাব মোঃ শাহ আলম (সহকারী প্রধান শিক্ষক)',
  dutyTeacherPhone: '০১৭১২-৩৪৫৬৭৮',
  assistantTeacherName: 'জনাব নাছির উদ্দিন (সিনিয়র শিক্ষক, সমাজবিজ্ঞান)',
  scoutLeader: 'আব্দুল করিম (দলনেতা, নাপোড়া স্কাউট দল)',
  quranReciter: 'মোহাম্মদ তানভীর (১০ম শ্রেণি, রোল: ০১)',
  gitaReciter: 'সৌমেন চক্রবর্তী (৯ম শ্রেণি, রোল: ০৫)',
  studentAnchor: 'জান্নাতুল ফেরদৌস (১০ম শ্রেণি, রোল: ০২)',
  moralLessonTitle: 'শৃঙ্খলা ও পরিষ্কার-পরিচ্ছন্নতা ঈমানের অঙ্গ',
  moralLessonBody: 'প্রত্যেক শিক্ষার্থীর উচিত স্কুলের ইউনিফর্ম পরিচ্ছন্ন রাখা, ক্লাসরুম ও খেলার মাঠ পরিষ্কার রাখা এবং বড়দের শ্রদ্ধা ও ছোটদের স্নেহ করা।'
};

const DEFAULT_ROUTINE_STEPS: AssemblyRoutineStep[] = [
  {
    id: 'step-1',
    step: '০১',
    time: 'সকাল ৯:১৫ - ৯:১৭',
    title: 'সমাবেশস্থলে কাতারবদ্ধ হওয়া ও উপস্থিতি যাচাই',
    desc: 'ঘণ্টা বাজার সাথে সাথে সকল শিক্ষার্থী নিজ নিজ শ্রেণির নির্ধারিত লাইনে উচ্চতা অনুসারে সুশৃঙ্খলভাবে দাঁড়াবে। স্কাউট দল কাতার পর্যবেক্ষণ করবে।'
  },
  {
    id: 'step-2',
    step: '০২',
    time: 'সকাল ৯:১৭ - ৯:২০',
    title: 'পবিত্র ধর্মগ্রন্থ থেকে পাঠ',
    desc: 'পবিত্র কুরআন থেকে নির্ধারিত সুরা তেলাওয়াত ও বাংলা অর্থ পাঠ। একই সাথে হিন্দু শিক্ষার্থীদের জন্য পবিত্র গীতা পাঠ এবং অন্যান্য ধর্মাবলম্বীদের পাঠ সম্পন্ন হয়।'
  },
  {
    id: 'step-3',
    step: '০৩',
    time: 'সকাল ৯:২০ - ৯:২৩',
    title: 'জাতীয় পতাকা উত্তোলন ও জাতীয় অভিবাদন (Salute)',
    desc: 'প্রধান শিক্ষক অথবা উপস্থিত জ্যেষ্ঠ শিক্ষকের মাধ্যমে জাতীয় পতাকা উত্তোলন। পতাকা উত্তোলনের পর সকল শিক্ষক-শিক্ষার্থী সতর্ক অবস্থানে থেকে জাতীয় অভিবাদন প্রদান করবে।'
  },
  {
    id: 'step-4',
    step: '০৪',
    time: 'সকাল ৯:২৩ - ৯:২৬',
    title: 'সমস্বরে জাতীয় সংগীত পরিবেশন',
    desc: 'শ্রদ্ধা ও ভালোবাসার সাথে সকল শিক্ষক ও শিক্ষার্থী সমস্বরে জাতীয় সংগীত "আমার সোনার বাংলা, আমি তোমায় ভালোবাসি" পরিবেশন করবে।'
  },
  {
    id: 'step-5',
    step: '০৫',
    time: 'সকাল ৯:২৬ - ৯:২৮',
    title: 'শিক্ষার্থীদের প্রাত্যহিক শপথ বাক্য পাঠ',
    desc: 'নির্ধারিত শিক্ষার্থী মাইক্রোফোনে পাঠ করবে এবং মাঠে উপস্থিত সকল শিক্ষার্থী ডান হাত কাঁধ বরাবর উঁচু করে সমস্বরে শপথ বাক্য পাঠ করবে।'
  },
  {
    id: 'step-6',
    step: '০৬',
    time: 'সকাল ৯:২৮ - ৯:৩৩',
    title: 'শারীরিক কসরত / দৈনিক পিটি (PT Session)',
    desc: 'শরীরচর্চা শিক্ষকের বাঁশির সংকেতে শারীরিক কসরত, হাতের ব্যায়াম, পিঠের ব্যায়াম ও গভীর শ্বাস-প্রশ্বাসের অনুশীলন। যা শিক্ষার্থীদের সারাদিনের পড়াশোনায় সতেজ রাখে।'
  },
  {
    id: 'step-7',
    step: '০৭',
    time: 'সকাল ৯:৩৩ - ৯:৪০',
    title: 'শিক্ষকের দিকনির্দেশনা, নীতিকথা ও ক্লাসে গমন',
    desc: 'প্রধান শিক্ষক বা দায়িত্বপ্রাপ্ত শিক্ষকের ২-৩ মিনিটের দিকনির্দেশনামূলক বক্তব্য, জরুরি নোটিশ ঘোষণা এবং ড্রামের তালে তালে সারিবদ্ধভাবে নিজ নিজ ক্লাসরুমে প্রবেশ।'
  }
];

const DEFAULT_OATH_TEXT = `আমি শপথ করিতেছি যে, মানুষের সেবায় নিজেকে নিয়োজিত রাখিব। দেশের প্রতি অনুগত থাকিব। দেশের একতা ও সংহতি বজায় রাখিবার জন্য সর্বদা সচেষ্ট থাকিব। অন্যায় করিব না এবং অন্যায়কে প্রশ্রয় দিব না। হে প্রভু, আমাকে শক্তি দিন, আমি যেন দেশের সেবায় নিজেকে নিয়োজিত করিতে পারি এবং দেশকে একটি শক্তিশালী ও আদর্শ রাষ্ট্র হিসেবে গড়িয়া তুলিতে পারি। আমিন।`;

const DEFAULT_RULES_DATA: AssemblyRulesData = {
  girlsTitle: 'ছাত্রীদের নির্ধারিত ইউনিফর্ম (৬ষ্ঠ-১০ম শ্রেণি)',
  girlsPoints: [
    'পোশাক: গাড় সবুজ রঙের ফ্রক / সালোয়ার-কামিজ।',
    'পায়জামা ও ওড়না: ধবধবে সাদা পায়জামা ও নির্ধারিত সাদা ওড়না।',
    'হিজাব/স্কার্ফ: মুসলিম ছাত্রীদের জন্য নির্ধারিত মাপের সাদা স্কার্ফ বা হিজাব।',
    'জুতা ও মোজা: সাদা কেডস / বাটা স্কুল জুতো এবং সাদা মোজা।',
    'আইডি কার্ড: বাম বুকের পকেটে দৃশ্যমান ডিজিটাল আইডি কার্ড বাধ্যতামূলক।'
  ],
  boysTitle: 'ছাত্রদের নির্ধারিত ইউনিফর্ম (৬ষ্ঠ-১০ম শ্রেণি)',
  boysPoints: [
    'শার্ট: ধবধবে সাদা হাফহাতা বা ফুলহাতা কলারযুক্ত শার্ট।',
    'প্যান্ট: নেভি ব্লু রঙের ফুল প্যান্ট (স্কুল কাটিং)।',
    'জুতা ও মোজা: সাদা কেডস এবং সাদা মোজা।',
    'চুলের কাটিং: ভদ্র ও রুচিশীল সংক্ষিপ্ত ছাত্রসুলভ চুল।',
    'আইডি কার্ড: শার্টের পকেটে দৃশ্যমান ডিজিটাল আইডি কার্ড বাধ্যতামূলক।'
  ],
  strictRules: [
    'সকাল ৯:১৫ ঘটিকার পর বিদ্যালয়ের প্রধান ফটক বন্ধ করা হয়। দেরিতে আসলে অভিভাবকের অনুমতি পত্র প্রয়োজন।',
    'মোবাইল ফোন বা কোনো ধরনের ইলেকট্রনিক ডিভাইস সমাবেশ বা বিদ্যালয়ে আনা সম্পূর্ণ নিষিদ্ধ।',
    'নখ ছোট ও পরিষ্কার রাখা এবং ব্যক্তিগত পরিচ্ছন্নতা প্রতিদিন সমাবেশে শিক্ষকগণ দ্বারা নিরীক্ষণ করা হয়।'
  ]
};

const DEFAULT_ASSEMBLY_PHOTOS: AssemblyPhotoItem[] = [
  {
    id: 'asm-1',
    title: 'নাপোড়া শেখেরখীল উচ্চ বিদ্যালয়ের বিশাল প্রাঙ্গণে প্রাত্যহিক সমাবেশ',
    date: '২০২৬-০৩-১০',
    category: 'দৈনিক সমাবেশ',
    imageUrl: '/assets/aistudio/image_e9445d3b.png',
    caption: 'সবুজ-সাদা ইউনিফর্মে সহস্রাধিক শিক্ষার্থীর নিখুঁত সারিবদ্ধতা ও শৃঙ্খলার চমৎকার দৃশ্য। শিক্ষক ও স্কাউটদের প্রত্যক্ষ তত্ত্বাবধানে এই সমাবেশ পরিচালিত হয়।',
    isFeatured: true
  },
  {
    id: 'asm-2',
    title: 'জাতীয় পতাকা উত্তোলন ও সম্মান প্রদর্শন',
    date: '২০২৬-০৩-০৮',
    category: 'পতাকা উত্তোলন',
    imageUrl: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=800&q=80',
    caption: 'প্রধান শিক্ষক মহোদয় ও দায়িত্বপ্রাপ্ত শিক্ষকের উপস্থিতিতে স্কাউট দলের মাধ্যমে জাতীয় পতাকা উত্তোলন।'
  },
  {
    id: 'asm-3',
    title: 'শরীরচর্চা ও শারীরিক কসরত (পিটি পর্ব)',
    date: '২০২৬-০৩-০৫',
    category: 'পিটি ও ড্রিল',
    imageUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80',
    caption: 'সমাবেশে শিক্ষার্থীদের শারীরিক সুস্থতা ও মনন বিকাশে দৈনিক শরীরচর্চা ও ড্রাম বিট অনুশীলন।'
  }
];

export default function DailyAssemblyTab({
  language,
  isAdmin,
  currentAdmin,
  onRequireAdminLogin,
  teachers = []
}: DailyAssemblyTabProps) {
  // হেডার এডিট শুধুমাত্র প্রধান এডমিন (Headmaster) এবং ডেভেলপার (IT Admin) এর অধীনে থাকবে
  const isSuperAdminOrDev = Boolean(
    currentAdmin && (
      currentAdmin.role === 'headmaster' ||
      currentAdmin.role === 'it_admin' ||
      currentAdmin.id === 'ADM-01' ||
      currentAdmin.id === 'ADM-05'
    )
  );

  const [headerDevPin, setHeaderDevPin] = useState('');
  const [headerDevPinError, setHeaderDevPinError] = useState('');

  // 1. Header Info State
  const [headerInfo, setHeaderInfo] = useState<AssemblyHeaderInfo>(() => {
    try {
      const saved = localStorage.getItem('nsh_assembly_header');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_HEADER_INFO;
  });

  // 2. Roster State
  const [roster, setRoster] = useState<AssemblyRoster>(() => {
    try {
      const saved = localStorage.getItem('nsh_assembly_roster');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_ROSTER;
  });

  // 3. Routine Steps State
  const [routineSteps, setRoutineSteps] = useState<AssemblyRoutineStep[]>(() => {
    try {
      const saved = localStorage.getItem('nsh_assembly_routine');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return DEFAULT_ROUTINE_STEPS;
  });

  // 4. Oath State
  const [oathText, setOathText] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('nsh_assembly_oath');
      if (saved) return saved;
    } catch {}
    return DEFAULT_OATH_TEXT;
  });

  // 5. Rules State
  const [rulesData, setRulesData] = useState<AssemblyRulesData>(() => {
    try {
      const saved = localStorage.getItem('nsh_assembly_rules');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_RULES_DATA;
  });

  // 6. Photos State
  const [photos, setPhotos] = useState<AssemblyPhotoItem[]>(() => {
    try {
      const saved = localStorage.getItem('nsh_assembly_photos');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return DEFAULT_ASSEMBLY_PHOTOS;
  });

  // Active view tab inside assembly
  const [activeSection, setActiveSection] = useState<'routine' | 'oath' | 'anthem' | 'photos' | 'rules'>('routine');

  // Lightbox / Image Viewer
  const [selectedPhoto, setSelectedPhoto] = useState<AssemblyPhotoItem | null>(null);

  // Edit Modals
  const [showRosterEditModal, setShowRosterEditModal] = useState(false);
  const [showHeaderEditModal, setShowHeaderEditModal] = useState(false);
  const [showOathEditModal, setShowOathEditModal] = useState(false);
  const [showRulesEditModal, setShowRulesEditModal] = useState(false);
  const [showAddPhotoModal, setShowAddPhotoModal] = useState(false);
  const [showEditPhotoModal, setShowEditPhotoModal] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<AssemblyPhotoItem | null>(null);
  const [showStepEditModal, setShowStepEditModal] = useState(false);
  const [editingStep, setEditingStep] = useState<AssemblyRoutineStep | null>(null);

  // Forms
  const [headerForm, setHeaderForm] = useState<AssemblyHeaderInfo>(headerInfo);
  const [rosterForm, setRosterForm] = useState<AssemblyRoster>(roster);
  const [oathForm, setOathForm] = useState<string>(oathText);
  const [rulesForm, setRulesForm] = useState({
    girlsPointsText: rulesData.girlsPoints.join('\n'),
    boysPointsText: rulesData.boysPoints.join('\n'),
    strictRulesText: rulesData.strictRules.join('\n')
  });

  const [photoForm, setPhotoForm] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    category: 'দৈনিক সমাবেশ',
    imageUrl: '',
    caption: ''
  });

  const [stepForm, setStepForm] = useState<AssemblyRoutineStep>({
    id: '',
    step: '',
    time: '',
    title: '',
    desc: ''
  });

  // Audio synthesizer state
  const [isPlayingAnthem, setIsPlayingAnthem] = useState(false);
  const [isPlayingDrum, setIsPlayingDrum] = useState(false);
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);

  useEffect(() => {
    return () => {
      if (audioCtx) {
        try {
          audioCtx.close();
        } catch {}
      }
    };
  }, [audioCtx]);

  // Drum cadence synthesizer (1-2-3 march cadence)
  const toggleDrumCadence = () => {
    if (isPlayingDrum) {
      setIsPlayingDrum(false);
      return;
    }

    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      setAudioCtx(ctx);
      setIsPlayingDrum(true);

      let beatCount = 0;
      const interval = setInterval(() => {
        if (!ctx || ctx.state === 'closed') {
          clearInterval(interval);
          setIsPlayingDrum(false);
          return;
        }

        beatCount++;
        if (beatCount > 16) {
          clearInterval(interval);
          setIsPlayingDrum(false);
          return;
        }

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const freq = beatCount % 4 === 1 ? 160 : 120;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.15);

        gain.gain.setValueAtTime(0.7, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      }, 400);
    } catch {
      setIsPlayingDrum(false);
    }
  };

  // National Anthem Melody Chime (Synthesizer representation)
  const toggleAnthemMelody = () => {
    if (isPlayingAnthem) {
      setIsPlayingAnthem(false);
      return;
    }

    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      setAudioCtx(ctx);
      setIsPlayingAnthem(true);

      const notes = [
        { f: 392.00, d: 0.5 },
        { f: 329.63, d: 0.5 },
        { f: 392.00, d: 0.5 },
        { f: 440.00, d: 0.8 },
        { f: 392.00, d: 0.5 },
        { f: 329.63, d: 0.5 },
        { f: 293.66, d: 0.8 },
        { f: 261.63, d: 1.0 },
      ];

      let time = ctx.currentTime + 0.1;
      notes.forEach((n) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.f, time);

        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(0.25, time + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, time + n.d);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(time);
        osc.stop(time + n.d);
        time += n.d + 0.05;
      });

      setTimeout(() => {
        setIsPlayingAnthem(false);
      }, (time - ctx.currentTime) * 1000);
    } catch {
      setIsPlayingAnthem(false);
    }
  };

  // Save Handlers
  const handleSaveHeader = (e: React.FormEvent) => {
    e.preventDefault();

    // Security check: Must be Super Admin (Headmaster) or Developer (IT Admin) or verified with Master PIN
    const masterPin = localStorage.getItem('nsh_admin_pin') || '1234';
    const isAuthorized = isSuperAdminOrDev || (headerDevPin.trim() === masterPin);

    if (!isAuthorized) {
      setHeaderDevPinError('অননুমোদিত চেষ্টা! সমাবেশ হেডার এডিট শুধুমাত্র প্রধান এডমিন এবং সিস্টেম ডেভেলপারের অধীনে সংরক্ষিত। দয়া করে সঠিক পিন দিন।');
      return;
    }

    setHeaderInfo(headerForm);
    localStorage.setItem('nsh_assembly_header', JSON.stringify(headerForm));
    setShowHeaderEditModal(false);
    setHeaderDevPin('');
    setHeaderDevPinError('');
  };

  const handleSaveRoster = (e: React.FormEvent) => {
    e.preventDefault();
    setRoster(rosterForm);
    localStorage.setItem('nsh_assembly_roster', JSON.stringify(rosterForm));
    setShowRosterEditModal(false);
  };

  const handleSaveOath = (e: React.FormEvent) => {
    e.preventDefault();
    setOathText(oathForm);
    localStorage.setItem('nsh_assembly_oath', oathForm);
    setShowOathEditModal(false);
  };

  const handleSaveRules = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: AssemblyRulesData = {
      girlsTitle: rulesData.girlsTitle,
      girlsPoints: rulesForm.girlsPointsText.split('\n').map(s => s.trim()).filter(Boolean),
      boysTitle: rulesData.boysTitle,
      boysPoints: rulesForm.boysPointsText.split('\n').map(s => s.trim()).filter(Boolean),
      strictRules: rulesForm.strictRulesText.split('\n').map(s => s.trim()).filter(Boolean)
    };
    setRulesData(updated);
    localStorage.setItem('nsh_assembly_rules', JSON.stringify(updated));
    setShowRulesEditModal(false);
  };

  const handleAddPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoForm.title.trim() || !photoForm.imageUrl.trim()) return;

    const newPhoto: AssemblyPhotoItem = {
      id: `asm-${Date.now()}`,
      title: photoForm.title.trim(),
      date: photoForm.date,
      category: photoForm.category,
      imageUrl: photoForm.imageUrl.trim(),
      caption: photoForm.caption.trim() || 'নাপোড়া শেখেরখীল উচ্চ বিদ্যালয়ের প্রাত্যহিক সমাবেশ।'
    };

    const updated = [newPhoto, ...photos];
    setPhotos(updated);
    localStorage.setItem('nsh_assembly_photos', JSON.stringify(updated));
    setShowAddPhotoModal(false);
    setPhotoForm({
      title: '',
      date: new Date().toISOString().split('T')[0],
      category: 'দৈনিক সমাবেশ',
      imageUrl: '',
      caption: ''
    });
  };

  const handleUpdatePhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPhoto) return;
    const updated = photos.map(p => p.id === editingPhoto.id ? editingPhoto : p);
    setPhotos(updated);
    localStorage.setItem('nsh_assembly_photos', JSON.stringify(updated));
    setShowEditPhotoModal(false);
    setEditingPhoto(null);
  };

  const handleDeletePhoto = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAdmin) {
      onRequireAdminLogin();
      return;
    }
    if (confirm('আপনি কি এই সমাবেশের ছবিটি অ্যালবাম থেকে মুছে ফেলতে চান?')) {
      const updated = photos.filter(p => p.id !== id);
      setPhotos(updated);
      localStorage.setItem('nsh_assembly_photos', JSON.stringify(updated));
      if (selectedPhoto?.id === id) setSelectedPhoto(null);
    }
  };

  const handleSaveStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (stepForm.id) {
      // Edit existing
      const updated = routineSteps.map(s => s.id === stepForm.id ? stepForm : s);
      setRoutineSteps(updated);
      localStorage.setItem('nsh_assembly_routine', JSON.stringify(updated));
    } else {
      // New step
      const newStep: AssemblyRoutineStep = {
        ...stepForm,
        id: `step-${Date.now()}`
      };
      const updated = [...routineSteps, newStep];
      setRoutineSteps(updated);
      localStorage.setItem('nsh_assembly_routine', JSON.stringify(updated));
    }
    setShowStepEditModal(false);
    setEditingStep(null);
  };

  const handleDeleteStep = (id: string) => {
    if (!isAdmin) {
      onRequireAdminLogin();
      return;
    }
    if (confirm('আপনি কি এই রুটিন পর্বটি মুছে ফেলতে চান?')) {
      const updated = routineSteps.filter(s => s.id !== id);
      setRoutineSteps(updated);
      localStorage.setItem('nsh_assembly_routine', JSON.stringify(updated));
    }
  };

  const copyOathText = () => {
    navigator.clipboard.writeText(oathText);
    alert('শিক্ষার্থীদের প্রাত্যহিক শপথ বাক্য কপি করা হয়েছে!');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Admin Notice / Status Bar */}
      <div className="bg-white border border-[#d2e5e7] rounded-2xl px-4 py-2.5 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-700">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>
            {isAdmin ? (
              <span className="font-bold text-emerald-800">
                ✅ এডমিন মোড সক্রিয়: সমাবেশ রুটিন, শপথ, দায়িত্বপ্রাপ্ত শিক্ষক ও ছবির প্রতিটি তথ্য আপনি সরাসরি এডিট করতে পারবেন।
              </span>
            ) : (
              <span>
                🔒 পাবলিক ভিউ মোড। সমাবেশ তথ্য পরিবর্তন বা সম্পাদনা করতে অনুগ্রহ করে এডমিন পাসওয়ার্ড দিয়ে লগইন করুন।
              </span>
            )}
          </span>
        </div>

        <div>
          {isAdmin ? (
            <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full text-[11px]">
              সম্পূর্ণ এডিটেবল
            </span>
          ) : (
            <button
              type="button"
              onClick={onRequireAdminLogin}
              className="px-3 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg transition-all shadow-xs flex items-center gap-1 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>এডিট করতে লগইন করুন</span>
            </button>
          )}
        </div>
      </div>

      {/* Hero Presentation Card with Authentic User-Uploaded Assembly Photo */}
      <div className="bg-gradient-to-br from-[#082545] via-[#0c3664] to-[#144275] text-white rounded-3xl p-6 md:p-8 shadow-md border border-[#144275] relative overflow-hidden space-y-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
          <div className="space-y-4 max-w-2xl text-center lg:text-left">
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
              <div className="inline-flex items-center gap-2 bg-[#d9482b] text-white px-3.5 py-1 rounded-full text-xs font-bold tracking-wide shadow-xs">
                <Sun className="w-4 h-4 text-amber-300 animate-spin-slow" />
                <span>{headerInfo.subtitle}</span>
              </div>

              {/* হেডার এডিট বাটন: শুধুমাত্র এডমিন ও ডেভেলপারের অধীনে থাকবে */}
              {isSuperAdminOrDev ? (
                <button
                  type="button"
                  onClick={() => {
                    setHeaderForm(headerInfo);
                    setHeaderDevPin('');
                    setHeaderDevPinError('');
                    setShowHeaderEditModal(true);
                  }}
                  className="px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-full text-xs font-black transition-all flex items-center gap-1 cursor-pointer shadow-xs"
                  title="হেডার তথ্য ও সময় এডিট করুন (এডমিন ও ডেভেলপার এক্সেস)"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-950" />
                  <span>হেডার এডিট (এডমিন/ডেভ)</span>
                </button>
              ) : isAdmin ? (
                <button
                  type="button"
                  onClick={() => {
                    setHeaderForm(headerInfo);
                    setHeaderDevPin('');
                    setHeaderDevPinError('');
                    setShowHeaderEditModal(true);
                  }}
                  className="px-2 py-0.5 bg-white/10 hover:bg-white/20 text-slate-300 hover:text-amber-300 rounded-full text-[11px] font-medium transition-all flex items-center gap-1 cursor-pointer border border-white/20"
                  title="হেডার এডিট শুধুমাত্র প্রধান এডমিন এবং সিস্টেম ডেভেলপারের অধীনে সংরক্ষিত"
                >
                  <Lock className="w-3 h-3 text-amber-300" />
                  <span>হেডার এডিট (সুরক্ষিত)</span>
                </button>
              ) : null}
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
              {headerInfo.title}
            </h1>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              {headerInfo.introText}
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2 text-xs">
              <div className="bg-white/10 backdrop-blur-xs border border-white/15 px-3 py-1.5 rounded-xl flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span className="font-semibold">সময়: {headerInfo.time}</span>
              </div>
              <div className="bg-white/10 backdrop-blur-xs border border-white/15 px-3 py-1.5 rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="font-semibold">উপস্থিতি: {headerInfo.attendance}</span>
              </div>
              <div className="bg-white/10 backdrop-blur-xs border border-white/15 px-3 py-1.5 rounded-xl flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-300" />
                <span className="font-semibold">অংশগ্রহণকারী: {headerInfo.participants}</span>
              </div>
            </div>
          </div>

          {/* Featured Assembly Photo Showcase with Click to Expand & Edit */}
          <div className="w-full lg:w-96 shrink-0 space-y-2">
            <div
              onClick={() => setSelectedPhoto(photos[0])}
              className="group relative rounded-2xl overflow-hidden border-2 border-amber-400/60 shadow-xl cursor-pointer bg-slate-900"
            >
              <img
                src={photos[0]?.imageUrl || '/assets/aistudio/image_e9445d3b.png'}
                alt={photos[0]?.title || 'নাপোড়া শেখেরখীল উচ্চ বিদ্যালয়ের সমাবেশ'}
                className="w-full h-56 object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-4">
                <div className="flex items-center justify-between text-white text-xs font-bold">
                  <span className="bg-emerald-600/90 px-2 py-0.5 rounded text-[10px]">বাস্তব সমাবেশ দৃশ্য</span>
                  <span className="flex items-center gap-1 text-amber-300 text-[11px] group-hover:underline">
                    <Eye className="w-3.5 h-3.5" />
                    <span>বড় করে দেখুন</span>
                  </span>
                </div>
                <p className="text-[11px] text-slate-200 mt-1 line-clamp-1">
                  {photos[0]?.caption || 'বিদ্যালয় খেলার মাঠে হাজারো শিক্ষার্থীর সুশৃঙ্খল কাতার'}
                </p>
              </div>
            </div>

            {isAdmin && photos[0] && (
              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setEditingPhoto(photos[0]);
                    setShowEditPhotoModal(true);
                  }}
                  className="text-xs text-amber-300 hover:text-white flex items-center gap-1 font-semibold transition-colors cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>মূল ছবির তথ্য / ক্যাপশন এডিট করুন</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Action Bar (Audio, Drum, Print, Admin Edit) */}
        <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={toggleAnthemMelody}
              className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-xs cursor-pointer ${
                isPlayingAnthem
                  ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300'
                  : 'bg-white/15 hover:bg-white/25 text-white'
              }`}
            >
              {isPlayingAnthem ? <VolumeX className="w-4 h-4" /> : <Music className="w-4 h-4 text-amber-300" />}
              <span>{isPlayingAnthem ? 'সুর থামান' : 'জাতীয় সংগীতের সুর শুনুন'}</span>
            </button>

            <button
              type="button"
              onClick={toggleDrumCadence}
              className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-xs cursor-pointer ${
                isPlayingDrum
                  ? 'bg-rose-500 text-white ring-2 ring-rose-300'
                  : 'bg-white/15 hover:bg-white/25 text-white'
              }`}
            >
              <Radio className={`w-4 h-4 ${isPlayingDrum ? 'animate-pulse text-white' : 'text-rose-300'}`} />
              <span>{isPlayingDrum ? 'ড্রাম বন্ধ করুন' : 'ড্রামের মার্চ তাল (১-২-৩)'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setRosterForm(roster);
                    setShowRosterEditModal(true);
                  }}
                  className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold rounded-xl transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>দায়িত্ব ও নীতিকথা এডিট</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowAddPhotoModal(true)}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>নতুন সমাবেশ ছবি যুক্ত করুন</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={onRequireAdminLogin}
                className="px-3.5 py-1.5 bg-white/15 hover:bg-white/25 text-amber-200 hover:text-white font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5 text-amber-300" />
                <span>তথ্য পরিবর্তন / এডিট</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => window.print()}
              className="px-3 py-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-200 rounded-xl font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-amber-300" />
              <span>প্রিন্ট রুটিন</span>
            </button>
          </div>
        </div>
      </div>

      {/* Today's Assembly Roster & Duty Desk (আজকের দায়িত্ব ও দিনের নীতিকথা - ১০০% এডিটেবল) */}
      <div className="bg-white border border-[#d2e5e7] rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h2 className="text-base sm:text-lg font-black text-[#0c3664]">
                আজকের দায়িত্বপ্রাপ্ত শিক্ষক ও সমাবেশ পরিচালনা দল
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              তারিখ: <span className="font-bold text-slate-700">{roster.date}</span> · সমাবেশ স্থান: {headerInfo.location}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin ? (
              <button
                type="button"
                onClick={() => {
                  setRosterForm(roster);
                  setShowRosterEditModal(true);
                }}
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold transition-all flex items-center gap-1 shadow-xs cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>দায়িত্ব তালিকা এডিট করুন</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onRequireAdminLogin}
                className="text-xs text-slate-500 hover:text-[#0c3664] flex items-center gap-1 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>এডিট করুন</span>
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1 relative group">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">প্রধান দায়িত্বপ্রাপ্ত শিক্ষক</div>
            <div className="font-extrabold text-sm text-[#0c3664]">{roster.dutyTeacherName}</div>
            <div className="text-xs text-slate-500">{roster.dutyTeacherPhone}</div>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">সহকারী দায়িত্বপ্রাপ্ত শিক্ষক</div>
            <div className="font-extrabold text-sm text-[#0c3664]">{roster.assistantTeacherName}</div>
            <div className="text-xs text-slate-500">শৃংখলা ও পোশাক পরিদর্শনের দায়িত্বে</div>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">স্কাউট ও গার্ল গাইড দলনেতা</div>
            <div className="font-extrabold text-sm text-[#0c3664]">{roster.scoutLeader}</div>
            <div className="text-xs text-slate-500">পতাকা উত্তোলন ও কাতার সোজা করার দায়িত্বে</div>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">তেলাওয়াত ও সঞ্চালক শিক্ষার্থী</div>
            <div className="font-extrabold text-xs text-[#0c3664]">{roster.quranReciter} (কুরআন)</div>
            <div className="text-xs text-slate-600">{roster.gitaReciter} (গীতা)</div>
          </div>
        </div>

        {/* Thought of the Day (দিনের নীতিকথা) */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/90 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2 text-xs font-black text-amber-900 uppercase tracking-wider">
              <Award className="w-4 h-4 text-amber-600" />
              <span>আজকের সমাবেশে শিক্ষকের অনুপ্রেরণামূলক নীতিকথা:</span>
            </div>
            <div className="text-sm font-black text-slate-900">"{roster.moralLessonTitle}"</div>
            <p className="text-xs text-slate-700 leading-relaxed max-w-3xl">
              {roster.moralLessonBody}
            </p>
          </div>

          {isAdmin && (
            <button
              type="button"
              onClick={() => {
                setRosterForm(roster);
                setShowRosterEditModal(true);
              }}
              className="px-3 py-1.5 bg-amber-200 hover:bg-amber-300 text-amber-950 font-bold rounded-xl text-xs shrink-0 flex items-center gap-1 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>নীতিকথা এডিট</span>
            </button>
          )}
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        {[
          { id: 'routine', label: 'সমাবেশের নিয়মিত ক্রমধারা (রুটিন)', icon: Clock },
          { id: 'oath', label: 'শিক্ষার্থীদের জাতীয় শপথ বাক্য', icon: Award },
          { id: 'anthem', label: 'জাতীয় সংগীত ও ইতিহাস', icon: Flag },
          { id: 'photos', label: `সমাবেশ ফটো অ্যালবাম (${photos.length})`, icon: ImageIcon },
          { id: 'rules', label: 'পোশাক ও শৃঙ্খলা বিধিমালা', icon: BookOpen }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSection(tab.id as typeof activeSection)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 cursor-pointer shadow-xs ${
                isActive
                  ? 'bg-[#0c3664] text-white shadow-xs'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-slate-500'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SECTION 1: ROUTINE & PHASES (এডিটেবল) */}
      {activeSection === 'routine' && (
        <div className="space-y-6">
          <div className="bg-white border border-[#d2e5e7] rounded-3xl p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-black text-[#0c3664] flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-500" />
                  <span>প্রাত্যহিক সমাবেশের সরকারি ও প্রাতিষ্ঠানিক নিয়মিত ক্রমধারা</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  মাধ্যমিক ও উচ্চশিক্ষা অধিদপ্তর (মাউশি) নির্ধারিত আদর্শ প্রাত্যহিক সমাবেশ কাঠামো যা প্রতিদিন পালিত হয়।
                </p>
              </div>

              {isAdmin ? (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setStepForm({
                        id: '',
                        step: `০${routineSteps.length + 1}`,
                        time: 'সকাল ৯:৪০ - ৯:৪৫',
                        title: '',
                        desc: ''
                      });
                      setShowStepEditModal(true);
                    }}
                    className="px-3.5 py-1.5 bg-[#0c3664] hover:bg-[#092b50] text-amber-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>নতুন পর্ব যোগ করুন</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('রুটিনকে ডিফল্ট ৭টি পর্বে রিসেট করতে চান?')) {
                        setRoutineSteps(DEFAULT_ROUTINE_STEPS);
                        localStorage.setItem('nsh_assembly_routine', JSON.stringify(DEFAULT_ROUTINE_STEPS));
                      }
                    }}
                    className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                    title="ডিফল্ট রুটিনে রিসেট করুন"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={onRequireAdminLogin}
                  className="text-xs text-slate-500 hover:text-[#0c3664] flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>পর্ব এডিট করুন</span>
                </button>
              )}
            </div>

            <div className="space-y-4">
              {routineSteps.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row items-start gap-4 p-4 rounded-2xl border border-slate-200 hover:border-[#0c3664] transition-all bg-slate-50/60 hover:bg-white group"
                >
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="w-10 h-10 rounded-xl bg-[#0c3664] text-amber-300 font-black text-sm flex items-center justify-center shadow-xs">
                      {item.step}
                    </span>
                  </div>

                  <div className="space-y-1 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="font-extrabold text-sm sm:text-base text-slate-900">{item.title}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-md">
                          {item.time}
                        </span>

                        {isAdmin && (
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              type="button"
                              onClick={() => {
                                setStepForm(item);
                                setShowStepEditModal(true);
                              }}
                              className="p-1 text-[#0c3664] hover:bg-blue-50 rounded"
                              title="এই পর্বটি এডিট করুন"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteStep(item.id)}
                              className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                              title="মুছে ফেলুন"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: STUDENT OATH (শপথ বাক্য - ১০০% এডিটেবল) */}
      {activeSection === 'oath' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-emerald-900 via-teal-900 to-[#0c3664] text-white rounded-3xl p-6 sm:p-10 shadow-lg border border-emerald-700/50 space-y-6 text-center relative overflow-hidden">
            <div className="max-w-2xl mx-auto space-y-3">
              <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/30 px-3.5 py-1 rounded-full text-xs font-bold text-emerald-300">
                <Award className="w-4 h-4" />
                <span>গণপ্রজাতন্ত্রী বাংলাদেশ সরকার অনুমোদিত বিদ্যালয় শপথ</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">শিক্ষার্থীদের প্রাত্যহিক শপথ বাক্য</h2>
              <p className="text-xs sm:text-sm text-emerald-100">
                প্রতিদিন সকালের সমাবেশে ডান হাত কাঁধ বরাবর উঁচু করে সকল শিক্ষার্থী এই পবিত্র শপথ গ্রহণ করে।
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 sm:p-8 max-w-3xl mx-auto shadow-inner text-left space-y-4">
              <div className="text-lg sm:text-xl font-bold leading-relaxed text-amber-200 tracking-wide font-serif text-center sm:text-left whitespace-pre-line">
                {oathText}
              </div>

              <div className="pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-3 text-xs text-emerald-200">
                <span>মূলভাব: দেশপ্রেম, মানবসেবা, সততা ও ন্যায়পরায়ণতা</span>
                <div className="flex items-center gap-2">
                  {isAdmin ? (
                    <button
                      type="button"
                      onClick={() => {
                        setOathForm(oathText);
                        setShowOathEditModal(true);
                      }}
                      className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>শপথ বাণী এডিট করুন</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={onRequireAdminLogin}
                      className="px-2.5 py-1.5 bg-white/15 hover:bg-white/25 text-amber-300 font-semibold rounded-lg text-xs"
                    >
                      এডমিন এডিট
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={copyOathText}
                    className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-amber-300" />
                    <span>কপি করুন</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>প্রিন্ট</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="text-xs text-emerald-200/80 max-w-xl mx-auto">
              💡 শপথের নিয়ম: ডান হাত মুঠো নয়, করতলে অঙ্গুলি সোজা রেখে কাঁধ সমান্তরালে রেখে বুক টান টান করে মাথা সোজা রেখে পাঠ করতে হবে।
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: NATIONAL ANTHEM */}
      {activeSection === 'anthem' && (
        <div className="space-y-6">
          <div className="bg-white border border-[#d2e5e7] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-black text-[#0c3664] flex items-center gap-2">
                  <Flag className="w-5 h-5 text-rose-600" />
                  <span>গণপ্রজাতন্ত্রী বাংলাদেশের জাতীয় সংগীত</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  রচয়িতা: বিশ্বকবি রবীন্দ্রনাথ ঠাকুর (১৯০৫) · সুর: বাউল গগন হরকরার সুরানুসারে
                </p>
              </div>

              <button
                type="button"
                onClick={toggleAnthemMelody}
                className="px-4 py-2 bg-[#0c3664] hover:bg-[#092b50] text-amber-300 font-extrabold rounded-xl text-xs flex items-center gap-2 shadow-xs cursor-pointer"
              >
                {isPlayingAnthem ? <VolumeX className="w-4 h-4 text-rose-300" /> : <Volume2 className="w-4 h-4 text-amber-300" />}
                <span>{isPlayingAnthem ? 'বাজনা থামান' : 'জাতীয় সংগীতের সুর শুনুন'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
              <div className="p-6 bg-gradient-to-br from-emerald-50 via-teal-50 to-white border border-emerald-200 rounded-3xl space-y-4 text-center">
                <div className="text-sm font-bold text-emerald-800 uppercase tracking-widest pb-2 border-b border-emerald-200">
                  জাতীয় সংগীতের মূল ১০ চরণ
                </div>

                <div className="font-serif text-slate-800 text-sm sm:text-base leading-loose font-semibold">
                  আমার সোনার বাংলা, আমি তোমায় ভালোবাসি।<br />
                  চিরদিন তোমার আকাশ, তোমার বাতাস, আমার প্রাণে বাজায় বাঁশি॥<br />
                  ও মা, ফাগুনে তোর আমের বনে ঘ্রাণে পাগল করে,<br />
                  মরি হায়, হায় রে—<br />
                  ও মা, অঘ্রাণে তোর ভরা ক্ষেতে আমি কী দেখেছি মধুর হাসি॥<br />
                  <br />
                  কী শোভা, কী ছায়া গো, কী স্নেহ, কী মায়া গো—<br />
                  কী আঁচল বিছায়েছ বটের মূলে, নদীর কূলে কূলে।<br />
                  মা, তোর মুখের বাণী আমার কানে লাগে সুধার মতো,<br />
                  মরি হায়, হায় রে—<br />
                  মা, তোর বদনখানি মলিন হলে, ও মা, আমি নয়নজলে ভাসি॥
                </div>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
                  <h4 className="font-black text-slate-900 text-sm flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>সমাবেশে পরিবেশনের নির্দেশাবলি</span>
                  </h4>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    ১. জাতীয় সংগীতের সময় সকল শিক্ষক-শিক্ষার্থী সতর্ক (Attention) অবস্থায় স্থির থাকবে।
                    <br />
                    ২. কোনো প্রকার হাঁটাচলা বা অঙ্গভঙ্গি করা সম্পূর্ণ নিষিদ্ধ।
                    <br />
                    ৩. কোনো শিক্ষার্থী অসুস্থ বোধ করলে সমাবেশ মাঠের পাশে সহায়ক শিক্ষকদের সহায়তা গ্রহণ করবে।
                  </p>
                </div>

                <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-1.5">
                  <h4 className="font-black text-amber-900 text-sm flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-700" />
                    <span>ঐতিহাসিক মর্যাদা</span>
                  </h4>
                  <p className="text-amber-800 text-xs leading-relaxed">
                    ১৯৭১ সালের মুক্তিযুদ্ধ চলাকালীন মুজিবনগর সরকার কর্তৃক এই সংগীতকে বাংলাদেশের জাতীয় সংগীত হিসেবে স্বীকৃতি প্রদান করা হয়। ১৯৭২ সালের সংবিধানে এটি অন্তর্ভুক্ত হয়।
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: PHOTOS ALBUM (এডিটেবল) */}
      {activeSection === 'photos' && (
        <div className="space-y-6">
          <div className="bg-white border border-[#d2e5e7] rounded-3xl p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-black text-[#0c3664] flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-amber-500" />
                  <span>প্রাত্যহিক সমাবেশ ফটো অ্যালবাম</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  বিদ্যালয় খেলার মাঠে শিক্ষার্থীদের শৃঙ্খলাময় সমাবেশ, শরীরচর্চা ও পতাকা উত্তোলনের আলোকচিত্র
                </p>
              </div>

              {isAdmin ? (
                <button
                  type="button"
                  onClick={() => setShowAddPhotoModal(true)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>নতুন সমাবেশ ছবি যোগ করুন</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onRequireAdminLogin}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>এডমিন মোডে ছবি যোগ / পরিবর্তন</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {photos.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedPhoto(item)}
                  className="group rounded-3xl overflow-hidden border border-slate-200 hover:border-[#0c3664] transition-all bg-slate-50 hover:bg-white shadow-xs hover:shadow-md cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="aspect-video relative overflow-hidden bg-slate-900">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[10px] font-extrabold bg-[#0c3664]/90 text-white backdrop-blur-xs">
                        {item.category}
                      </span>
                      {item.isFeatured && (
                        <span className="absolute top-3 right-3 px-2 py-1 rounded-lg text-[10px] font-extrabold bg-amber-400 text-slate-950">
                          বাস্তব মাঠের ছবি
                        </span>
                      )}
                    </div>

                    <div className="p-4 space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{item.date}</span>
                        </span>
                      </div>
                      <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-[#0c3664] line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {item.caption}
                      </p>
                    </div>
                  </div>

                  <div className="px-4 pb-4 pt-1 flex items-center justify-between border-t border-slate-100 text-xs">
                    <span className="text-[#0c3664] font-bold group-hover:underline flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      <span>পূর্ণাঙ্গ ছবি দেখুন</span>
                    </span>

                    {isAdmin && (
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingPhoto(item);
                            setShowEditPhotoModal(true);
                          }}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="ছবির তথ্য এডিট করুন"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        {item.id !== 'asm-1' && (
                          <button
                            type="button"
                            onClick={(e) => handleDeletePhoto(item.id, e)}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                            title="মুছে ফেলুন"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 5: UNIFORM & RULES (এডিটেবল) */}
      {activeSection === 'rules' && (
        <div className="space-y-6">
          <div className="bg-white border border-[#d2e5e7] rounded-3xl p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-black text-[#0c3664] flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-amber-500" />
                  <span>প্রাত্যহিক সমাবেশ ও ইউনিফর্ম পরিধান বিধিমালা</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  বিদ্যালয়ের প্রতিটি শিক্ষার্থীকে নির্ধারিত পোশাকে সুশৃঙ্খলভাবে সমাবেশে উপস্থিত থাকতে হবে।
                </p>
              </div>

              {isAdmin ? (
                <button
                  type="button"
                  onClick={() => {
                    setRulesForm({
                      girlsPointsText: rulesData.girlsPoints.join('\n'),
                      boysPointsText: rulesData.boysPoints.join('\n'),
                      strictRulesText: rulesData.strictRules.join('\n')
                    });
                    setShowRulesEditModal(true);
                  }}
                  className="px-3.5 py-1.5 bg-[#0c3664] hover:bg-[#092b50] text-amber-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>পোশাক ও নিয়মাবলি এডিট</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onRequireAdminLogin}
                  className="text-xs text-slate-500 hover:text-[#0c3664] flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>নিয়মাবলি এডিট</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Girls Uniform */}
              <div className="p-5 bg-emerald-50/60 border border-emerald-200 rounded-3xl space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">
                    ছাত্রী
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-emerald-950">{rulesData.girlsTitle}</h3>
                    <p className="text-[11px] text-emerald-700">৬ষ্ঠ থেকে ১০ম শ্রেণি পর্যন্ত</p>
                  </div>
                </div>

                <ul className="text-xs text-slate-700 space-y-2 list-disc list-inside leading-relaxed">
                  {rulesData.girlsPoints.map((pt, idx) => (
                    <li key={idx}>{pt}</li>
                  ))}
                </ul>
              </div>

              {/* Boys Uniform */}
              <div className="p-5 bg-blue-50/60 border border-blue-200 rounded-3xl space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#0c3664] text-white font-bold flex items-center justify-center text-xs">
                    ছাত্র
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-blue-950">{rulesData.boysTitle}</h3>
                    <p className="text-[11px] text-blue-700">৬ষ্ঠ থেকে ১০ম শ্রেণি পর্যন্ত</p>
                  </div>
                </div>

                <ul className="text-xs text-slate-700 space-y-2 list-disc list-inside leading-relaxed">
                  {rulesData.boysPoints.map((pt, idx) => (
                    <li key={idx}>{pt}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 space-y-1">
              <div className="font-black text-amber-950">⚠️ সমাবেশের কড়া নিয়মাবলি:</div>
              <ul className="space-y-1 leading-relaxed list-decimal list-inside">
                {rulesData.strictRules.map((r, idx) => (
                  <li key={idx}>{r}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* FULLSCREEN IMAGE LIGHTBOX MODAL */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col bg-slate-950 rounded-3xl overflow-hidden border border-slate-700 shadow-2xl">
            <div className="p-4 bg-slate-900/90 flex items-center justify-between text-white border-b border-slate-800">
              <div>
                <h3 className="font-bold text-sm text-white">{selectedPhoto.title}</h3>
                <p className="text-xs text-slate-400">তারিখ: {selectedPhoto.date} · বিভাগ: {selectedPhoto.category}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-auto p-2 flex items-center justify-center bg-black">
              <img
                src={selectedPhoto.imageUrl}
                alt={selectedPhoto.title}
                className="max-h-[65vh] w-auto max-w-full object-contain rounded-xl"
              />
            </div>

            <div className="p-4 bg-slate-900/90 border-t border-slate-800 text-xs text-slate-300 space-y-2">
              <p className="leading-relaxed">{selectedPhoto.caption}</p>
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-amber-400 font-semibold">
                  নাপোড়া শেখেরখীল উচ্চ বিদ্যালয় · বাঁশখালী, চট্টগ্রাম
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedPhoto(null)}
                  className="px-4 py-1.5 bg-[#0c3664] hover:bg-[#144275] text-white rounded-xl font-bold cursor-pointer"
                >
                  বন্ধ করুন
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: EDIT HEADER INFO */}
      {showHeaderEditModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <h3 className="font-bold text-base text-slate-900">সমাবেশ হেডার ও পরিচিতি এডিট</h3>
                </div>
                <p className="text-xs text-amber-700 font-medium">
                  🔒 শুধুমাত্র সম্মানিত প্রধান শিক্ষক (এডমিন) ও আইটি ইনচার্জ (ডেভেলপার)-এর জন্য সংরক্ষিত
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowHeaderEditModal(false);
                  setHeaderDevPin('');
                  setHeaderDevPinError('');
                }}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Role Verification Banner */}
            {isSuperAdminOrDev ? (
              <div className="flex items-center gap-2 p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>অনুমোদিত কর্মকর্তা: {currentAdmin?.name} ({currentAdmin?.roleName}) · এক্সেস সক্রিয়</span>
              </div>
            ) : (
              <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl space-y-2">
                <div className="flex items-start gap-2 text-xs text-amber-900 font-medium">
                  <Shield className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <strong>এডমিন ও ডেভেলপার ভেরিফিকেশন:</strong> হেডার পরিবর্তনের ক্ষমতা শুধুমাত্র প্রধান শিক্ষক (এডমিন) এবং সিস্টেম ডেভেলপারের অধীনে। পরিবর্তন সংরক্ষণে মাস্টার পিন প্রদান করুন।
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-rose-600" />
                    <span>এডমিন বা ডেভেলপার মাস্টার পিন (Security PIN) *:</span>
                  </label>
                  <input
                    type="password"
                    value={headerDevPin}
                    onChange={(e) => {
                      setHeaderDevPin(e.target.value);
                      setHeaderDevPinError('');
                    }}
                    placeholder="মাস্টার পিন দিন (ডিফল্ট: 1234)"
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-mono"
                  />
                  {headerDevPinError && (
                    <p className="text-[11px] text-red-600 font-bold flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{headerDevPinError}</span>
                    </p>
                  )}
                </div>
              </div>
            )}

            <form onSubmit={handleSaveHeader} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">মূল শিরোনাম:</label>
                <input
                  type="text"
                  value={headerForm.title}
                  onChange={(e) => setHeaderForm({ ...headerForm, title: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">উপশিরোনাম / ট্যাগ:</label>
                <input
                  type="text"
                  value={headerForm.subtitle}
                  onChange={(e) => setHeaderForm({ ...headerForm, subtitle: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">সমাবেশের সময়:</label>
                  <input
                    type="text"
                    value={headerForm.time}
                    onChange={(e) => setHeaderForm({ ...headerForm, time: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">উপস্থিতি শর্ত:</label>
                  <input
                    type="text"
                    value={headerForm.attendance}
                    onChange={(e) => setHeaderForm({ ...headerForm, attendance: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">অংশগ্রহণকারী শ্রেণি:</label>
                  <input
                    type="text"
                    value={headerForm.participants}
                    onChange={(e) => setHeaderForm({ ...headerForm, participants: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">সমাবেশের স্থান:</label>
                  <input
                    type="text"
                    value={headerForm.location}
                    onChange={(e) => setHeaderForm({ ...headerForm, location: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">ভূমিকা ও পরিচিতিমূলক টেক্সট:</label>
                <textarea
                  rows={3}
                  value={headerForm.introText}
                  onChange={(e) => setHeaderForm({ ...headerForm, introText: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowHeaderEditModal(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0c3664] hover:bg-[#092b50] text-white font-bold rounded-xl shadow-xs"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT ROSTER */}
      {showRosterEditModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-base text-slate-900">সমাবেশ দায়িত্ব ও নীতিকথা আপডেট</h3>
                <p className="text-xs text-slate-500">আজকের প্রাত্যহিক সমাবেশের পরিচালনা তালিকা সম্পাদন করুন</p>
              </div>
              <button
                type="button"
                onClick={() => setShowRosterEditModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRoster} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">তারিখ:</label>
                  <input
                    type="date"
                    value={rosterForm.date}
                    onChange={(e) => setRosterForm({ ...rosterForm, date: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">দায়িত্বপ্রাপ্ত প্রধান শিক্ষক:</label>
                  <input
                    type="text"
                    value={rosterForm.dutyTeacherName}
                    onChange={(e) => setRosterForm({ ...rosterForm, dutyTeacherName: e.target.value })}
                    placeholder="শিক্ষকের নাম ও পদবি"
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">শিক্ষকের মোবাইল:</label>
                  <input
                    type="text"
                    value={rosterForm.dutyTeacherPhone}
                    onChange={(e) => setRosterForm({ ...rosterForm, dutyTeacherPhone: e.target.value })}
                    placeholder="০১৭১১-XXXXXX"
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">সহকারী শিক্ষক:</label>
                  <input
                    type="text"
                    value={rosterForm.assistantTeacherName}
                    onChange={(e) => setRosterForm({ ...rosterForm, assistantTeacherName: e.target.value })}
                    placeholder="সহকারী শিক্ষকের নাম"
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">স্কাউট দলনেতা:</label>
                  <input
                    type="text"
                    value={rosterForm.scoutLeader}
                    onChange={(e) => setRosterForm({ ...rosterForm, scoutLeader: e.target.value })}
                    placeholder="শিক্ষার্থীর নাম"
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">সঞ্চালক শিক্ষার্থী:</label>
                  <input
                    type="text"
                    value={rosterForm.studentAnchor}
                    onChange={(e) => setRosterForm({ ...rosterForm, studentAnchor: e.target.value })}
                    placeholder="শিক্ষার্থীর নাম ও শ্রেণি"
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">কুরআন তেলাওয়াতকারী:</label>
                  <input
                    type="text"
                    value={rosterForm.quranReciter}
                    onChange={(e) => setRosterForm({ ...rosterForm, quranReciter: e.target.value })}
                    placeholder="নাম ও শ্রেণি"
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">গীতা পাঠকারী:</label>
                  <input
                    type="text"
                    value={rosterForm.gitaReciter}
                    onChange={(e) => setRosterForm({ ...rosterForm, gitaReciter: e.target.value })}
                    placeholder="নাম ও শ্রেণি"
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-1 pt-1 border-t border-slate-100">
                <label className="font-bold text-slate-700">দিনের নীতিকথা (শিরোনাম):</label>
                <input
                  type="text"
                  value={rosterForm.moralLessonTitle}
                  onChange={(e) => setRosterForm({ ...rosterForm, moralLessonTitle: e.target.value })}
                  placeholder="যেমন: সময়ের মূল্য বা সত্যবাদিতা"
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">দিনের নীতিকথা (বিস্তারিত বিবরণ):</label>
                <textarea
                  rows={3}
                  value={rosterForm.moralLessonBody}
                  onChange={(e) => setRosterForm({ ...rosterForm, moralLessonBody: e.target.value })}
                  placeholder="সমাবেশে শিক্ষকের প্রেরিত উপদেশ"
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowRosterEditModal(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0c3664] hover:bg-[#092b50] text-white font-bold rounded-xl shadow-xs"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: EDIT OATH */}
      {showOathEditModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-base text-slate-900">শিক্ষার্থীদের শপথ বাক্য এডিট</h3>
                <p className="text-xs text-slate-500">প্রাত্যহিক সমাবেশের শপথ বাণী সম্পাদন করুন</p>
              </div>
              <button
                type="button"
                onClick={() => setShowOathEditModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveOath} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">শপথের সম্পূর্ণ বাণী:</label>
                <textarea
                  rows={6}
                  required
                  value={oathForm}
                  onChange={(e) => setOathForm(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-serif text-sm leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setOathForm(DEFAULT_OATH_TEXT)}
                  className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>ডিফল্ট শপথে রিসেট</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowOathEditModal(false)}
                    className="px-4 py-2 text-slate-600 hover:text-slate-800"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-xs"
                  >
                    সংরক্ষণ করুন
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: EDIT ROUTINE STEP */}
      {showStepEditModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  {stepForm.id ? 'সমাবেশ পর্ব এডিট' : 'নতুন সমাবেশ পর্ব যোগ'}
                </h3>
                <p className="text-xs text-slate-500">পর্বের ক্রম, সময় ও বিবরণ সম্পাদন করুন</p>
              </div>
              <button
                type="button"
                onClick={() => setShowStepEditModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStep} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">পর্ব ক্রম:</label>
                  <input
                    type="text"
                    required
                    value={stepForm.step}
                    onChange={(e) => setStepForm({ ...stepForm, step: e.target.value })}
                    placeholder="যেমন: ০১ বা ০৮"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">সময়সীমা:</label>
                  <input
                    type="text"
                    required
                    value={stepForm.time}
                    onChange={(e) => setStepForm({ ...stepForm, time: e.target.value })}
                    placeholder="যেমন: সকাল ৯:১৫ - ৯:১৭"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">পর্বের নাম / শিরোনাম:</label>
                <input
                  type="text"
                  required
                  value={stepForm.title}
                  onChange={(e) => setStepForm({ ...stepForm, title: e.target.value })}
                  placeholder="যেমন: পবিত্র ধর্মগ্রন্থ থেকে পাঠ"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">বিস্তারিত বিবরণ:</label>
                <textarea
                  rows={3}
                  required
                  value={stepForm.desc}
                  onChange={(e) => setStepForm({ ...stepForm, desc: e.target.value })}
                  placeholder="এই পর্বে কী কী অনুষ্ঠিত হবে তার বিবরণ"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowStepEditModal(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0c3664] hover:bg-[#092b50] text-white font-bold rounded-xl shadow-xs"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: EDIT UNIFORM & RULES */}
      {showRulesEditModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-base text-slate-900">পোশাক ও সমাবেশ বিধিমালা এডিট</h3>
                <p className="text-xs text-slate-500">প্রতি লাইনে একটি করে নিয়ম/পয়েন্ট লিখুন</p>
              </div>
              <button
                type="button"
                onClick={() => setShowRulesEditModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRules} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-emerald-900">ছাত্রীদের ইউনিফর্ম পয়েন্টসমূহ (প্রতি লাইনে ১টি):</label>
                <textarea
                  rows={4}
                  value={rulesForm.girlsPointsText}
                  onChange={(e) => setRulesForm({ ...rulesForm, girlsPointsText: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-blue-900">ছাত্রদের ইউনিফর্ম পয়েন্টসমূহ (প্রতি লাইনে ১টি):</label>
                <textarea
                  rows={4}
                  value={rulesForm.boysPointsText}
                  onChange={(e) => setRulesForm({ ...rulesForm, boysPointsText: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-amber-900">কড়া নিয়মাবলি (প্রতি লাইনে ১টি):</label>
                <textarea
                  rows={3}
                  value={rulesForm.strictRulesText}
                  onChange={(e) => setRulesForm({ ...rulesForm, strictRulesText: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowRulesEditModal(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0c3664] hover:bg-[#092b50] text-white font-bold rounded-xl shadow-xs"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 6: ADD PHOTO */}
      {showAddPhotoModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-base text-slate-900">নতুন সমাবেশ আলোকচিত্র যুক্ত করুন</h3>
                <p className="text-xs text-slate-500">প্রাত্যহিক সমাবেশের নতুন ছবি যোগ করুন</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddPhotoModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddPhoto} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">ছবির শিরোনাম / বিষয়বস্তু:</label>
                <input
                  type="text"
                  required
                  value={photoForm.title}
                  onChange={(e) => setPhotoForm({ ...photoForm, title: e.target.value })}
                  placeholder="যেমন: সকালের ড্রিল ও পিটি পর্ব"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">তারিখ:</label>
                  <input
                    type="date"
                    value={photoForm.date}
                    onChange={(e) => setPhotoForm({ ...photoForm, date: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">ক্যাটাগরি:</label>
                  <select
                    value={photoForm.category}
                    onChange={(e) => setPhotoForm({ ...photoForm, category: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  >
                    <option value="দৈনিক সমাবেশ">দৈনিক সমাবেশ</option>
                    <option value="পতাকা উত্তোলন">পতাকা উত্তোলন</option>
                    <option value="পিটি ও ড্রিল">পিটি ও ড্রিল</option>
                    <option value="শপথ পাঠ">শপথ পাঠ</option>
                    <option value="পুরস্কার বিতরণী">পুরস্কার বিতরণী</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">ছবির URL বা পাথ:</label>
                <input
                  type="text"
                  required
                  value={photoForm.imageUrl}
                  onChange={(e) => setPhotoForm({ ...photoForm, imageUrl: e.target.value })}
                  placeholder="যেমন: /assets/aistudio/... বা ছবির অনলাইন লিংক"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">ছবির বর্ণনা (ক্যাপশন):</label>
                <textarea
                  rows={2}
                  value={photoForm.caption}
                  onChange={(e) => setPhotoForm({ ...photoForm, caption: e.target.value })}
                  placeholder="ছবির বিস্তারিত বিবরণ লিখুন"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddPhotoModal(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-xs"
                >
                  যোগ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 7: EDIT EXISTING PHOTO */}
      {showEditPhotoModal && editingPhoto && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-base text-slate-900">সমাবেশ ছবি ও তথ্য সম্পাদনা</h3>
                <p className="text-xs text-slate-500">ছবির শিরোনাম ও ক্যাপশন এডিট করুন</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowEditPhotoModal(false);
                  setEditingPhoto(null);
                }}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdatePhoto} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">ছবির শিরোনাম:</label>
                <input
                  type="text"
                  required
                  value={editingPhoto.title}
                  onChange={(e) => setEditingPhoto({ ...editingPhoto, title: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">তারিখ:</label>
                  <input
                    type="date"
                    value={editingPhoto.date}
                    onChange={(e) => setEditingPhoto({ ...editingPhoto, date: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">ক্যাটাগরি:</label>
                  <input
                    type="text"
                    value={editingPhoto.category}
                    onChange={(e) => setEditingPhoto({ ...editingPhoto, category: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">ছবির URL / পাথ:</label>
                <input
                  type="text"
                  required
                  value={editingPhoto.imageUrl}
                  onChange={(e) => setEditingPhoto({ ...editingPhoto, imageUrl: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">ক্যাপশন / বিবরণ:</label>
                <textarea
                  rows={3}
                  value={editingPhoto.caption}
                  onChange={(e) => setEditingPhoto({ ...editingPhoto, caption: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditPhotoModal(false);
                    setEditingPhoto(null);
                  }}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0c3664] hover:bg-[#092b50] text-white font-bold rounded-xl shadow-xs"
                >
                  আপডেট করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
