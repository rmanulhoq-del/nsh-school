import { AdminUser, Student, Teacher, StaffMember, Transaction } from '../types';

export const SCHOOL_EIIN = '104062';
export const SCHOOL_EIIN_BN = '১০৪০৬২';

export const AUTHORIZED_STAFF: AdminUser[] = [
  {
    id: 'ADM-01',
    name: 'জনাব মোঃ জাহাঙ্গীর আলম',
    role: 'headmaster',
    roleName: 'প্রধান শিক্ষক',
    phone: '01711-000111',
    badge: 'সর্বোচ্চ প্রশাসনিক অথরাইজেশন',
    pin: '1234'
  },
  {
    id: 'ADM-02',
    name: 'জনাব মাহবুবুল আলম',
    role: 'asst_headmaster',
    roleName: 'সহকারী প্রধান শিক্ষক',
    phone: '01812-222333',
    badge: 'শিক্ষা ও প্রশাসনিক কার্যক্রম সমন্বয়',
    pin: '1234'
  },
  {
    id: 'ADM-03',
    name: 'মোঃ দেলোয়ার হোসেন',
    role: 'clerk',
    roleName: 'অফিস সহকারী ও প্রধান ক্লার্ক',
    phone: '01819-334455',
    badge: 'শিক্ষার্থী ভর্তি ও ব্যাংক রসিদ এন্ট্রি',
    pin: '1234'
  },
  {
    id: 'ADM-04',
    name: 'মোহাম্মদ ফারুক',
    role: 'accounts',
    roleName: 'হিসাবরক্ষক (Accounts)',
    phone: '01912-778899',
    badge: 'ব্যাংক হিসাব ও আয়-ব্যয় ভাউচার',
    pin: '1234'
  },
  {
    id: 'ADM-05',
    name: 'প্রকৌশলী সাজ্জাদ হোসেন',
    role: 'it_admin',
    roleName: 'আইটি অ্যাডমিন ও সিস্টেম ইনচার্জ',
    phone: '01614-556677',
    badge: 'সিস্টেম মেইনটেন্যান্স ও এআই সিঙ্ক',
    pin: '1234'
  }
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'STU-6A-001',
    name: 'তানভীর আহমেদ',
    className: '6',
    section: 'A',
    roll: 1,
    gender: 'male',
    fatherName: 'মোঃ রফিকুল ইসলাম',
    motherName: 'মোছাঃ ফাতেমা বেগম',
    guardianName: 'মোঃ রফিকুল ইসলাম',
    guardianPhone: '01711-234567',
    address: 'গ্রাম: উত্তর নাপোড়া, ওয়ার্ড নং ০২, বাঁশখালী, চট্টগ্রাম',
    birthDate: '২০১৩-০৩-১৫',
    birthRegNo: '২০১৩০৪১৫১২৩৪৫৬৭৮১',
    admissionDate: '২০২৪-০১-১০',
    monthlyFee: 500,
    examFee: 300,
    status: 'paid',
    paidBank: 'বাংলাদেশ কৃষি ব্যাংক, নাপোড়া শাখা',
    txnId: 'BKB-892104',
    paymentDate: '2026-10-12 10:15 AM',
    paidMonth: 'অক্টোবর ২০২৬',
    feeMonths: ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'সেপ্টেম্বর', 'অক্টোবর'],
    feeYear: '২০২৬',
    examType: '১ম সাময়িক',
    examFeeStatus: 'paid'
  },
  {
    id: 'STU-6A-002',
    name: 'ফারহানা ইসলাম তন্বী',
    className: '6',
    section: 'A',
    roll: 2,
    gender: 'female',
    fatherName: 'মোঃ রফিকুল ইসলাম',
    motherName: 'মোছাঃ নাজমুন নাহার',
    guardianName: 'মোছাঃ নাজমুন নাহার',
    guardianPhone: '01812-987654',
    address: 'গ্রাম: শেখেরখীল, বাঁশখালী, চট্টগ্রাম',
    birthDate: '২০১৩-০৭-২২',
    birthRegNo: '২০১৩০৪১৫১২৩৪৫৬৭৮২',
    admissionDate: '২০২৪-০১-১২',
    monthlyFee: 500,
    examFee: 300,
    status: 'due',
    dueMonth: 'অক্টোবর ২০২৬',
    feeMonths: ['জানুয়ারি', 'ফেব্রুয়ারি'],
    feeYear: '২০২৬',
    examType: '১ম সাময়িক',
    examFeeStatus: 'due'
  },
  {
    id: 'STU-6A-003',
    name: 'আবরার জাহিদ চৌধুরী',
    className: '6',
    section: 'A',
    roll: 3,
    gender: 'male',
    fatherName: 'জাহিদ হোসেন চৌধুরী',
    motherName: 'শাহিনুর আক্তার',
    guardianName: 'জাহিদ হোসেন চৌধুরী',
    guardianPhone: '01713-889900',
    address: 'গ্রাম: মধ্যম নাপোড়া, বাঁশখালী, চট্টগ্রাম',
    birthDate: '২০১৩-০৫-১০',
    birthRegNo: '২০১৩০৪১৫১২৩৪৫৬৭৮৩',
    admissionDate: '২০২৪-০১-১০',
    monthlyFee: 500,
    examFee: 300,
    status: 'paid',
    paidBank: 'বাংলাদেশ কৃষি ব্যাংক, নাপোড়া শাখা',
    txnId: 'BKB-892140',
    paymentDate: '2026-10-14 09:30 AM',
    paidMonth: 'অক্টোবর ২০২৬',
    feeMonths: ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'অক্টোবর'],
    feeYear: '২০২৬',
    examType: '১ম সাময়িক',
    examFeeStatus: 'paid'
  },
  {
    id: 'STU-6B-001',
    name: 'আব্দুল্লাহ আল নোমান',
    className: '6',
    section: 'B',
    roll: 1,
    gender: 'male',
    fatherName: 'মুহাম্মদ আব্দুল কাদের',
    motherName: 'জাহানারা বেগম',
    guardianName: 'মুহাম্মদ আব্দুল কাদের',
    guardianPhone: '01913-456789',
    address: 'গ্রাম: পশ্চিম নাপোড়া, বাঁশখালী, চট্টগ্রাম',
    birthDate: '২০১২-১১-০৮',
    birthRegNo: '২০১২০৪১৫১২৩৪৫৬৭৮৪',
    admissionDate: '২০২৪-০১-০৮',
    monthlyFee: 500,
    examFee: 300,
    status: 'paid',
    paidBank: 'আইএফআইসি ব্যাংক পিএলসি, নাপোড়া উপশাখা',
    txnId: 'IFIC-554109',
    paymentDate: '2026-10-13 09:40 AM',
    paidMonth: 'অক্টোবর ২০২৬',
    feeMonths: ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'সেপ্টেম্বর', 'অক্টোবর'],
    feeYear: '২০২৬',
    examType: '১ম সাময়িক',
    examFeeStatus: 'paid'
  },
  {
    id: 'STU-7A-005',
    name: 'সাদিয়া আক্তার মীম',
    className: '7',
    section: 'A',
    roll: 5,
    gender: 'female',
    fatherName: 'মোঃ কবির হোসেন',
    motherName: 'রেহানা পারভীন',
    guardianName: 'মোঃ কবির হোসেন',
    guardianPhone: '01614-112233',
    address: 'গ্রাম: নাপোড়া বাজার রোড, বাঁশখালী, চট্টগ্রাম',
    birthDate: '২০১২-০৮-১৮',
    birthRegNo: '২০১২০৪১৫১২৩৪৫৬৭৮৫',
    admissionDate: '২০২৩-০১-১৫',
    monthlyFee: 600,
    examFee: 350,
    status: 'paid',
    paidBank: 'বাংলাদেশ কৃষি ব্যাংক, নাপোড়া শাখা',
    txnId: 'BKB-892211',
    paymentDate: '2026-10-11 11:20 AM',
    paidMonth: 'অক্টোবর ২০২৬',
    feeMonths: ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'অক্টোবর'],
    feeYear: '২০২৬',
    examType: '১ম সাময়িক',
    examFeeStatus: 'paid'
  },
  {
    id: 'STU-8B-012',
    name: 'মাহমুদুল হাসান শুভ',
    className: '8',
    section: 'B',
    roll: 12,
    gender: 'male',
    fatherName: 'মোঃ রফিক উল্লাহ',
    motherName: 'মাজেদা খাতুন',
    guardianName: 'মোঃ রফিক উল্লাহ',
    guardianPhone: '01715-998877',
    address: 'গ্রাম: শেখেরখীল দক্ষিণ পাড়া, বাঁশখালী',
    birthDate: '২০১১-০৪-২৫',
    birthRegNo: '২০১১০৪১৫১২৩৪৫৬৭৮৬',
    admissionDate: '২০২২-০১-২০',
    monthlyFee: 700,
    examFee: 400,
    status: 'due',
    dueMonth: 'অক্টোবর ২০২৬',
    feeMonths: ['জানুয়ারি', 'ফেব্রুয়ারি'],
    feeYear: '২০২৬',
    examType: '১ম সাময়িক',
    examFeeStatus: 'due'
  },
  {
    id: 'STU-9A-001',
    name: 'আদনান হাবিব সৈকত',
    className: '9',
    section: 'A',
    roll: 1,
    gender: 'male',
    group: 'science',
    fatherName: 'মোঃ হাবিবুর রহমান',
    motherName: 'সালমা আক্তার',
    guardianName: 'মোঃ হাবিবুর রহমান',
    guardianPhone: '01716-112299',
    address: 'গ্রাম: পূর্ব নাপোড়া, বাঁশখালী, চট্টগ্রাম',
    birthDate: '২০১০-০২-১২',
    birthRegNo: '২০১০০৪১৫১২৩৪৫৬৭৮৭',
    admissionDate: '২০২১-০১-১৮',
    monthlyFee: 800,
    examFee: 500,
    status: 'paid',
    paidBank: 'বাংলাদেশ কৃষি ব্যাংক, নাপোড়া শাখা',
    txnId: 'BKB-892550',
    paymentDate: '2026-10-10 10:00 AM',
    paidMonth: 'অক্টোবর ২০২৬',
    feeMonths: ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'অক্টোবর'],
    feeYear: '২০২৬',
    examType: '১ম সাময়িক',
    examFeeStatus: 'paid'
  },
  {
    id: 'STU-9A-003',
    name: 'নুসরাত জাহান মাহি',
    className: '9',
    section: 'A',
    roll: 3,
    gender: 'female',
    group: 'business',
    fatherName: 'জহিরুল হক ভূঁইয়া',
    motherName: 'শিরীন আক্তার',
    guardianName: 'জহিরুল হক ভূঁইয়া',
    guardianPhone: '01816-334455',
    address: 'গ্রাম: উত্তর নাপোড়া, বাঁশখালী, চট্টগ্রাম',
    birthDate: '২০১০-০৯-১৪',
    birthRegNo: '২০১০০৪১৫১২৩৪৫৬৭৮৮',
    admissionDate: '২০২১-০১-১২',
    monthlyFee: 800,
    examFee: 500,
    status: 'paid',
    paidBank: 'আইএফআইসি ব্যাংক পিএলসি, নাপোড়া উপশাখা',
    txnId: 'IFIC-554320',
    paymentDate: '2026-10-13 11:05 AM',
    paidMonth: 'অক্টোবর ২০২৬',
    feeMonths: ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'অক্টোবর'],
    feeYear: '২০২৬',
    examType: '১ম সাময়িক',
    examFeeStatus: 'paid'
  },
  {
    id: 'STU-9A-004',
    name: 'মোবারক হোসেন ইমন',
    className: '9',
    section: 'A',
    roll: 4,
    gender: 'male',
    group: 'business',
    fatherName: 'আব্দুস শুক্কুর',
    motherName: 'মরিয়ম বেগম',
    guardianName: 'আব্দুস শুক্কুর',
    guardianPhone: '01718-445566',
    address: 'গ্রাম: নাপোড়া বাজার, বাঁশখালী',
    birthDate: '২০১০-০৬-৩০',
    birthRegNo: '২০১০০৪১৫১২৩৪৫৬৭৮৯',
    admissionDate: '২০২১-০১-১৫',
    monthlyFee: 800,
    examFee: 500,
    status: 'paid',
    paidBank: 'বাংলাদেশ কৃষি ব্যাংক, নাপোড়া শাখা',
    txnId: 'BKB-892601',
    paymentDate: '2026-10-14 11:20 AM',
    paidMonth: 'অক্টোবর ২০২৬',
    feeMonths: ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'অক্টোবর'],
    feeYear: '২০২৬',
    examType: '১ম সাময়িক',
    examFeeStatus: 'paid'
  },
  {
    id: 'STU-9B-002',
    name: 'মমতাজ বেগম মুক্তা',
    className: '9',
    section: 'B',
    roll: 2,
    gender: 'female',
    group: 'humanities',
    fatherName: 'মোঃ আবুল কাশেম',
    motherName: 'মমতাজ আক্তার',
    guardianName: 'মোঃ আবুল কাশেম',
    guardianPhone: '01819-776655',
    address: 'গ্রাম: পশ্চিম নাপোড়া, বাঁশখালী',
    birthDate: '২০১০-০৪-১৮',
    birthRegNo: '২০১০০৪১৫১২৩৪৫৬৭৯৩',
    admissionDate: '২০২১-০১-১৫',
    monthlyFee: 800,
    examFee: 500,
    status: 'paid',
    paidBank: 'আইএফআইসি ব্যাংক পিএলসি, নাপোড়া উপশাখা',
    txnId: 'IFIC-554401',
    paymentDate: '2026-10-15 10:30 AM',
    paidMonth: 'অক্টোবর ২০২৬',
    feeMonths: ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'অক্টোবর'],
    feeYear: '২০২৬',
    examType: '১ম সাময়িক',
    examFeeStatus: 'paid'
  },
  {
    id: 'STU-10A-001',
    name: 'রাকিবুল হাসান শান্ত',
    className: '10',
    section: 'A',
    roll: 1,
    gender: 'male',
    group: 'science',
    fatherName: 'আনোয়ার হোসেন',
    motherName: 'হাসিনা বানু',
    guardianName: 'আনোয়ার হোসেন',
    guardianPhone: '01917-778899',
    address: 'গ্রাম: শেখেরখীল ৫নং ওয়ার্ড, বাঁশখালী',
    birthDate: '২০০৯-০১-১০',
    birthRegNo: '২০০৯০৪১৫১২৩৪৫৬৭৯০',
    admissionDate: '২০২০-০১-০৫',
    monthlyFee: 1000,
    examFee: 600,
    status: 'paid',
    paidBank: 'বাংলাদেশ কৃষি ব্যাংক, নাপোড়া শাখা',
    txnId: 'BKB-892305',
    paymentDate: '2026-10-13 08:50 AM',
    paidMonth: 'অক্টোবর ২০২৬',
    feeMonths: ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'অক্টোবর'],
    feeYear: '২০২৬',
    examType: '১ম সাময়িক',
    examFeeStatus: 'paid'
  },
  {
    id: 'STU-10A-002',
    name: 'সুমাইয়া তাবাসসুম স্নেহা',
    className: '10',
    section: 'A',
    roll: 2,
    gender: 'female',
    group: 'humanities',
    fatherName: 'নুরুল হক চৌধুরী',
    motherName: 'রওশন আরা',
    guardianName: 'নুরুল হক চৌধুরী',
    guardianPhone: '01819-667788',
    address: 'গ্রাম: উত্তর শেখেরখীল, বাঁশখালী',
    birthDate: '২০০৯-০৪-০৫',
    birthRegNo: '২০০৯০৪১৫১২৩৪৫৬৭৯১',
    admissionDate: '২০২০-০১-১০',
    monthlyFee: 1000,
    examFee: 600,
    status: 'paid',
    paidBank: 'আইএফআইসি ব্যাংক পিএলসি, নাপোড়া উপশাখা',
    txnId: 'IFIC-554499',
    paymentDate: '2026-10-12 12:00 PM',
    paidMonth: 'অক্টোবর ২০২৬',
    feeMonths: ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'অক্টোবর'],
    feeYear: '২০২৬',
    examType: '১ম সাময়িক',
    examFeeStatus: 'paid'
  },
  {
    id: 'STU-10B-008',
    name: 'মেহেদী হাসান রিয়াদ',
    className: '10',
    section: 'B',
    roll: 8,
    gender: 'male',
    group: 'science',
    fatherName: 'আবুল বাশার',
    motherName: 'খালেদা আক্তার',
    guardianName: 'আবুল বাশার',
    guardianPhone: '01518-223344',
    address: 'গ্রাম: চাম্বল সীমানা, নাপোড়া, বাঁশখালী',
    birthDate: '২০০৯-০৭-২০',
    birthRegNo: '২০০৯০৪১৫১২৩৪৫৬৭৯২',
    admissionDate: '২০২০-০১-১৫',
    monthlyFee: 1000,
    examFee: 600,
    status: 'due',
    dueMonth: 'অক্টোবর ২০২৬',
    feeMonths: ['জানুয়ারি'],
    feeYear: '২০২৬',
    examType: '১ম সাময়িক',
    examFeeStatus: 'due'
  }
];

export const getTeacherHierarchyRank = (t: Teacher): number => {
  const des = (t.designation || '').trim();
  if (des.includes('প্রধান শিক্ষক') && !des.includes('সহকারী') && !des.includes('ভারপ্রাপ্ত')) return 1;
  if (des.includes('ভারপ্রাপ্ত প্রধান শিক্ষক')) return 1.5;
  if (des.includes('সহকারী প্রধান শিক্ষক') || des.includes('সহ-প্রধান শিক্ষক') || des.includes('সহকারী প্রধান')) return 2;
  if (des.includes('সিনিয়র শিক্ষক') || des.includes('সিনিয়র শিক্ষক')) return 3;
  if (des.includes('সহকারী শিক্ষক') || des.includes('সহকারী মৌলভী')) return 4;
  return 5;
};

export const sortTeachersByHierarchy = (list: Teacher[]): Teacher[] => {
  return [...list].sort((a, b) => {
    const rankA = getTeacherHierarchyRank(a);
    const rankB = getTeacherHierarchyRank(b);
    if (rankA !== rankB) return rankA - rankB;
    return a.id.localeCompare(b.id);
  });
};

export const INITIAL_TEACHERS: Teacher[] = [
  {
    id: 'TCH-001',
    name: 'জনাব মোঃ জাহাঙ্গীর আলম',
    designation: 'প্রধান শিক্ষক',
    subject: 'পদার্থবিজ্ঞান ও প্রশাসন',
    phone: '01711-000111',
    email: 'headmaster@school.edu.bd',
    joinDate: '২০০৮-০৩-১৫',
    qualification: 'এম.এসসি (পদার্থবিজ্ঞান), বি.এড',
    isHeadmaster: true
  },
  {
    id: 'TCH-002',
    name: 'জনাব মাহবুবুল আলম',
    designation: 'সহকারী প্রধান শিক্ষক',
    subject: 'ইংরেজি সাহিত্য ও ব্যাকরণ',
    phone: '01812-222333',
    email: 'assistant_head@school.edu.bd',
    joinDate: '২০১২-০৭-০১',
    qualification: 'এম.এ (ইংরেজি), বি.এড'
  },
  {
    id: 'TCH-003',
    name: 'মাওলানা আব্দুল হাকিম',
    designation: 'সিনিয়র শিক্ষক',
    subject: 'ইসলাম ও নৈতিক শিক্ষা',
    phone: '01913-444555',
    email: 'hakim.islamic@school.edu.bd',
    joinDate: '২০১০-০১-১০',
    qualification: 'কামিল (হাদিস), এম.এ'
  },
  {
    id: 'TCH-004',
    name: 'প্রদীপ কুমার বিশ্বাস',
    designation: 'সিনিয়র শিক্ষক',
    subject: 'উচ্চতর গণিত ও বিজ্ঞান',
    phone: '01614-666777',
    email: 'pradip.math@school.edu.bd',
    joinDate: '২০১৫-০২-২০',
    qualification: 'এম.এসসি (গণিত), বি.এড'
  },
  {
    id: 'TCH-005',
    name: 'নাসরিন জাহান ইতি',
    designation: 'সহকারী শিক্ষক',
    subject: 'রসায়ন ও জীববিজ্ঞান',
    phone: '01715-888999',
    email: 'nasrin.sci@school.edu.bd',
    joinDate: '২০১৮-০৯-০৫',
    qualification: 'বি.এসসি (অনার্স), এম.এসসি'
  },
  {
    id: 'TCH-006',
    name: 'মোহাম্মদ তানভীর রায়হান',
    designation: 'সহকারী শিক্ষক (আইসিটি)',
    subject: 'তথ্য ও যোগাযোগ প্রযুক্তি (ICT)',
    phone: '01819-445566',
    email: 'tanvir.ict@school.edu.bd',
    joinDate: '২০২০-০১-১৫',
    qualification: 'বি.এসসি ইন সিএসই (কম্পিউটার সায়েন্স)'
  }
];

export const INITIAL_STAFF: StaffMember[] = [
  {
    id: 'STF-001',
    name: 'মোঃ দেলোয়ার হোসেন',
    designation: 'অফিস সহকারী কাম কম্পিউটার অপারেটর',
    category: 'office',
    dutyScope: 'দাপ্তরিক চিঠিপত্র, শিক্ষার্থী ভর্তি রেজিস্টার ও ডাটাবেস এন্ট্রি',
    phone: '01819-334455',
    joinDate: '২০১৫-০৩-১০',
    qualification: 'এইচএসসি (বাণিজ্য) ও কম্পিউটার ডিপ্লোমা'
  },
  {
    id: 'STF-002',
    name: 'মোহাম্মদ ফারুক',
    designation: 'হিসাব সহকারী (Accounts)',
    category: 'office',
    dutyScope: 'ব্যাংক চালান, শিক্ষার্থী বেতন রসিদ ও দৈনিক ভাউচার ক্যাশ বই',
    phone: '01912-778899',
    joinDate: '২০১৭-০৬-১৫',
    qualification: 'স্নাতক (বিবিএস - হিসাববিজ্ঞান)'
  },
  {
    id: 'STF-003',
    name: 'আবুল কাশেম',
    designation: 'অফিস সহায়ক (পিয়ন / MLSS)',
    category: 'peon',
    dutyScope: 'অফিস ফাইলপত্র আদান-প্রদান, ঘণ্টা বাজানো ও দাপ্তরিক ফরমাশ সম্পাদন',
    phone: '01822-114477',
    joinDate: '২০১২-০১-০৫',
    qualification: 'এসএসসি পাস'
  },
  {
    id: 'STF-004',
    name: 'মোসাম্মৎ রহিমা খাতুন',
    designation: 'আয়া (Ayah / Support Staff)',
    category: 'ayah',
    dutyScope: 'ছাত্রীদের কমনরুম, প্রাথমিক সেবা ও প্রাঙ্গণ সহায়তা',
    phone: '01733-665544',
    joinDate: '২০১৬-০৮-২০',
    qualification: 'অষ্টম শ্রেণি পাস'
  },
  {
    id: 'STF-005',
    name: 'নুরুল ইসলাম',
    designation: 'নিরাপত্তা প্রহরী ও গেটকিপার',
    category: 'security',
    dutyScope: 'বিদ্যালয়ের প্রধান ফটক পাহারা, দর্শনার্থী রেজিস্টার ও ক্যাম্পাসের নিরাপত্তা',
    phone: '01831-998822',
    joinDate: '২০১৮-১১-০১',
    qualification: 'এসএসসি পাস'
  },
  {
    id: 'STF-006',
    name: 'মোঃ শাহ আলম',
    designation: 'নৈশপ্রহরী (Night Guard)',
    category: 'security',
    dutyScope: 'রাত্রিকালীন স্কুল প্রাঙ্গণ, কম্পিউটার ল্যাব ও ভবনের সার্বিক পাহারা',
    phone: '01612-337711',
    joinDate: '২০১৯-০২-১০',
    qualification: 'অষ্টম শ্রেণি পাস'
  },
  {
    id: 'STF-007',
    name: 'সুবল দাশ',
    designation: 'পরিচ্ছন্নতাকর্মী ও মালী',
    category: 'service',
    dutyScope: 'বিদ্যালয় প্রাঙ্গণ, ফুলবাগান ও স্যানিটেশন ব্লকের নিয়মিত পরিচ্ছন্নতা',
    phone: '01934-228811',
    joinDate: '২০২০-০৩-১৫',
    qualification: 'অষ্টম শ্রেণি পাস'
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'TXN-101',
    type: 'income',
    title: 'দশম শ্রেণির মাসিক বেতন ও পরীক্ষার ফি জমা',
    category: 'শিক্ষার্থী ফি',
    amount: 85000,
    date: '2026-10-13',
    bank: 'বাংলাদেশ কৃষি ব্যাংক',
    refNo: 'BATCH-BKB-098'
  },
  {
    id: 'TXN-102',
    type: 'income',
    title: 'অষ্টম শ্রেণির বার্ষিক উন্নয়ন ফি',
    category: 'উন্নয়ন তহবিল',
    amount: 42000,
    date: '2026-10-12',
    bank: 'আইএফআইসি ব্যাংক',
    refNo: 'BATCH-IFIC-044'
  },
  {
    id: 'TXN-103',
    type: 'expense',
    title: 'শিক্ষক ও কর্মচারী মাসিক সম্মানী/বেতন',
    category: 'বেতন ও ভাতা',
    amount: 95000,
    date: '2026-10-10',
    bank: 'বাংলাদেশ কৃষি ব্যাংক',
    refNo: 'CHQ-778812'
  },
  {
    id: 'TXN-104',
    type: 'expense',
    title: 'বিজ্ঞানাগার ও আইসিটি ল্যাব মেরামত',
    category: 'মেরামত ও রক্ষণাবেক্ষণ',
    amount: 14500,
    date: '2026-10-08',
    bank: 'Cash',
    refNo: 'VCH-0042'
  }
];

export const SAMPLE_BKB_STATEMENT = `
বাংলাদেশ কৃষি ব্যাংক, নাপোড়া বাজার শাখা, বাঁশখালী, চট্টগ্রাম
দৈনিক স্কুল ফি কালেকশন শিট - তারিখ: ১৩ অক্টোবর ২০২৬
প্রতিষ্ঠান: নাপোড়া শেখেরখীল উচ্চ বিদ্যালয়
------------------------------------------------------------------------
SL | ট্রানজাকশন আইডি | শিক্ষার্থী আইডি / রোল | শ্রেণি ও শাখা | জমার পরিমাণ (টাকা) | মন্তব্য
1  | BKB-991201       | STU-6A-002 (রোল ২)  | ৬ষ্ঠ - A    | 800.00             | মাসিক ও পরীক্ষার ফি
2  | BKB-991202       | STU-8B-012 (রোল ১২) | ৮ম - B     | 1100.00            | পরীক্ষার ফি সহ
3  | BKB-991203       | STU-10B-008 (রোল ৮) | ১০ম - B    | 1600.00            | বার্ষিক ফি
------------------------------------------------------------------------
মোট আদায়: ৩,৫০০.০০ টাকা | ক্যাশিয়ার সিল ও স্বাক্ষর
`;

export const SAMPLE_IFIC_STATEMENT = `
IFIC BANK PLC - NAPORA BAZAR SUB-BRANCH, BANSHKHALI
COLLECTION ADVICE - NAPORA SHEKHERKHIL HIGH SCHOOL
DATE: 13-OCT-2026
--------------------------------------------------
TXN REF: IFIC-770412 | STU ID: STU-6A-002 | CLASS: 6 | SEC: A | ROLL: 2 | BDT 800.00
TXN REF: IFIC-770413 | STU ID: STU-8B-012 | CLASS: 8 | SEC: B | ROLL: 12 | BDT 1100.00
--------------------------------------------------
TOTAL CREDITED TO A/C: 104062-IFIC-02
`;
