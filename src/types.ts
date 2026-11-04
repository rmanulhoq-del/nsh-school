/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface AdminUser {
  id: string;
  name: string;
  role: 'headmaster' | 'asst_headmaster' | 'clerk' | 'accounts' | 'it_admin';
  roleName: string;
  phone: string;
  badge: string;
  pin?: string;
}

export const formatClassOrdinal = (cls: string): string => {
  switch (cls) {
    case '6':
    case '৬':
      return '৬ষ্ঠ';
    case '7':
    case '৭':
      return '৭ম';
    case '8':
    case '৮':
      return '৮ম';
    case '9':
    case '৯':
      return '৯ম';
    case '10':
    case '১০':
      return '১০ম';
    default:
      return cls;
  }
};

export const formatClassBangla = (cls: string): string => {
  return `${formatClassOrdinal(cls)} শ্রেণি`;
};

export const formatGroupBangla = (group?: StudentGroup | string): string => {
  switch (group) {
    case 'science':
      return 'বিজ্ঞান বিভাগ';
    case 'humanities':
      return 'মানবিক বিভাগ';
    case 'business':
      return 'ব্যবসায় শিক্ষা বিভাগ';
    default:
      return 'সাধারণ পাঠ্যক্রম';
  }
};

export const formatSectionBangla = (sec: string): string => {
  switch (sec) {
    case 'A': return "শাখা: ক (A)";
    case 'B': return "শাখা: খ (B)";
    case 'C': return "শাখা: গ (C)";
    case 'D': return "শাখা: ঘ (D)";
    default: return `শাখা: ${sec}`;
  }
};

export type StudentGender = 'male' | 'female';
export type StudentGroup = 'science' | 'business' | 'humanities';
export type ExamType = '১ম সাময়িক' | '২য় সাময়িক' | 'বার্ষিক' | 'টেস্ট পরীক্ষা';

export interface ExamRoutineItem {
  id: string;
  date: string;
  day: string;
  subject: string;
  time: string;
}

export const DEFAULT_EXAM_ROUTINE: ExamRoutineItem[] = [
  { id: '1', date: '২৫/১০/২০২৬', day: 'রবিবার', subject: 'বাংলা ১ম পত্র', time: 'সকাল ১০:০০ - দুপুর ০১:০০' },
  { id: '2', date: '২৭/১০/২০২৬', day: 'মঙ্গলবার', subject: 'বাংলা ২য় পত্র', time: 'সকাল ১০:০০ - দুপুর ০১:০০' },
  { id: '3', date: '২৯/১০/২০২৬', day: 'বৃহস্পতিবার', subject: 'ইংরেজি ১ম পত্র', time: 'সকাল ১০:০০ - দুপুর ০১:০০' },
  { id: '4', date: '০১/১১/২০২৬', day: 'রবিবার', subject: 'ইংরেজি ২য় পত্র', time: 'সকাল ১০:০০ - দুপুর ০১:০০' },
  { id: '5', date: '০৩/১১/২০২৬', day: 'মঙ্গলবার', subject: 'গণিত (আবশ্যিক)', time: 'সকাল ১০:০০ - দুপুর ০১:০০' },
  { id: '6', date: '০৫/১১/২০২৬', day: 'বৃহস্পতিবার', subject: 'সাধারণ বিজ্ঞান / পদার্থবিজ্ঞান', time: 'সকাল ১০:০০ - দুপুর ০১:০০' },
  { id: '7', date: '০৮/১১/২০২৬', day: 'রবিবার', subject: 'ইসলাম ও নৈতিক শিক্ষা / হিন্দুধর্ম', time: 'সকাল ১০:০০ - দুপুর ০১:০০' },
  { id: '8', date: '১০/১১/২০২৬', day: 'মঙ্গলবার', subject: 'তথ্য ও যোগাযোগ প্রযুক্তি (ICT)', time: 'সকাল ১০:০০ - দুপুর ১২:৩০' }
];

export interface SubjectMark {
  subjectKey: string;
  subjectName: string;
  totalMarks: number;
  cq?: number;
  mcq?: number;
  practical?: number;
  obtainedTotal: number;
  passMarksTotal: number;
  passMarksCq?: number;
  passMarksMcq?: number;
  passMarksPractical?: number;
  hasPractical?: boolean;
  isPassed: boolean;
  grade: string;
  gradePoint: number;
  failReason?: string;
}

export interface StudentExamRecord {
  examType: ExamType;
  year: string;
  subjects: Record<string, SubjectMark>;
  totalMarks: number;
  obtainedTotal: number;
  gpa: number;
  grade: string;
  isPassed: boolean;
  failedSubjectCount: number;
  meritPosition?: number;
  remarks: string;
}

export interface Student {
  id: string;
  name: string;
  className: '6' | '7' | '8' | '9' | '10';
  section: 'A' | 'B' | 'C' | 'D';
  roll: number;
  gender?: StudentGender; // 'male' (ছাত্র) or 'female' (ছাত্রী) - controls কৃষি শিক্ষা vs গার্হস্থ্য বিজ্ঞান
  group?: StudentGroup; // 'science' (বিজ্ঞান), 'business' (বাণিজ্য), 'humanities' (মানবিক)

  // ক অংশ (ব্যক্তিগত ও ভর্তি তথ্য)
  fatherName?: string;
  motherName?: string;
  guardianName: string;
  guardianPhone: string;
  address?: string;
  birthDate?: string;
  birthRegNo?: string;
  admissionDate?: string;

  // খ অংশ (ফি ও ব্যাংকিং তথ্য)
  monthlyFee: number;
  examFee: number;
  status: 'paid' | 'due';
  paidBank?: 'বাংলাদেশ কৃষি ব্যাংক, নাপোড়া শাখা' | 'আইএফআইসি ব্যাংক পিএলসি, নাপোড়া উপশাখা' | 'বাংলাদেশ কৃষি ব্যাংক' | 'আইএফআইসি ব্যাংক';
  txnId?: string;
  paymentDate?: string;
  paidMonth?: string;
  dueMonth?: string;
  feeMonths?: string[]; // ক্যালেন্ডার / চেকমূলক মাস তালিকা
  feeYear?: string; // সাল, যেমন '২০২৬'
  examType?: ExamType; // ১ম সাময়িক, ২য় সাময়িক, বার্ষিক
  examFeeStatus?: 'paid' | 'due';

  // টিসি প্রদানের তথ্য
  tcIssued?: boolean;
  tcDate?: string;
  tcReason?: string;

  // পরীক্ষার নম্বর ফর্দ রেকর্ডসমূহ (key = examType, e.g. '১ম সাময়িক')
  examRecords?: Record<string, StudentExamRecord>;
}

export interface Teacher {
  id: string;
  name: string;
  designation: string;
  subject: string;
  phone: string;
  email: string;
  joinDate: string;
  qualification?: string;
  isHeadmaster?: boolean;
}

export interface StaffMember {
  id: string;
  name: string;
  designation: string;
  dutyScope: string;
  phone: string;
  joinDate: string;
  qualification?: string;
  category: 'office' | 'peon' | 'ayah' | 'security' | 'service';
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  title: string;
  category: string;
  amount: number;
  date: string;
  bank: 'বাংলাদেশ কৃষি ব্যাংক' | 'আইএফআইসি ব্যাংক' | 'Cash';
  refNo: string;
}

export interface ExtractedRecord {
  studentId: string;
  roll: number;
  className: string;
  section: string;
  studentName: string;
  amount: number;
  bank: 'বাংলাদেশ কৃষি ব্যাংক' | 'আইএফআইসি ব্যাংক';
  txnId: string;
  paymentDate: string;
}

export interface CommitteeMember {
  id: string;
  name: string;
  role: string;
  category: 'president' | 'secretary' | 'teacher_rep' | 'guardian_rep' | 'enthusiast' | 'donor_rep' | 'official';
  phone: string;
  profession: string;
  tenure: string;
  responsibility: string;
  bio?: string;
}

export interface DonorFounder {
  id: string;
  name: string;
  type: 'founder' | 'land_donor' | 'life_donor' | 'lab_infrastructure' | 'scholarship';
  contributionType: string;
  amountOrLand: string;
  year: string;
  title: string;
  description: string;
  tributeQuote?: string;
}

export type NavTab =
  | 'home'
  | 'notices'
  | 'about'
  | 'assembly'
  | 'committee'
  | 'donors'
  | 'teachers'
  | 'staff'
  | 'students'
  | 'gallery'
  | 'attendance'
  | 'exams'
  | 'sms'
  | 'reports'
  | 'excellence'
  | 'parents'
  | 'edulinks'
  | 'banks'
  | 'office'
  | 'ai'
  | 'contact';

export interface GalleryItem {
  id: string;
  title: string;
  category: 'sports' | 'cultural' | 'national' | 'science' | 'campus' | 'academic' | 'general';
  type: 'image' | 'video';
  mediaUrl: string;
  youtubeId?: string;
  date: string;
  description: string;
  isFeatured?: boolean;
}

export interface HeadmasterData {
  name: string;
  designation: string;
  phone: string;
  email: string;
  qualification: string;
  subject: string;
  joinDate: string;
  messageTitle: string;
  messageBody: string;
  photoUrl?: string;
}

export const DEFAULT_HEADMASTER_DATA: HeadmasterData = {
  name: 'জনাব মোঃ জাহাঙ্গীর আলম',
  designation: 'প্রধান শিক্ষক ও সদস্য সচিব',
  phone: '01711-000111',
  email: 'headmaster@school.edu.bd',
  qualification: 'এম.এসসি (পদার্থবিজ্ঞান), বি.এড (১ম শ্রেণি)',
  subject: 'পদার্থবিজ্ঞান ও প্রশাসন',
  joinDate: '২০০৮-০৩-১৫',
  messageTitle: 'ডিজিটাল ব্যবস্থার মাধ্যমে স্বচ্ছতা ও আধুনিক শিক্ষা',
  messageBody: 'নাপোড়া শেখেরখীল উচ্চ বিদ্যালয়ের সকল শিক্ষার্থী, শিক্ষক ও অভিভাবকবৃন্দকে আন্তরিক মোবারকবাদ। আমাদের ঐতিহ্য ও সুনামের মূল ভিত্তি হচ্ছে শিক্ষার গুণগত মান এবং সুশৃঙ্খল প্রশাসনিক জবাবদিহিতা। নাপোড়া বাজারের ব্যাংকগুলোর সাথে সমন্বয়ের মাধ্যমে স্কুলের যাবতীয় ফি এখন ডিজিটালভাবে পরিচালিত হচ্ছে।',
  photoUrl: ''
};

export interface PresidentData {
  name: string;
  designation: string;
  profession: string;
  phone?: string;
  messageTitle: string;
  messageBody: string;
  photoUrl?: string;
}

export const DEFAULT_PRESIDENT_DATA: PresidentData = {
  name: 'অধ্যক্ষ জনাব মোঃ আবদুল কাদের',
  designation: 'সভাপতি, বিদ্যালয় পরিচালনা কমিটি',
  profession: 'অধ্যক্ষ ও বিশিষ্ট শিক্ষাবিদ',
  phone: '০১৭১১-XXXXXX',
  messageTitle: 'আধুনিক ও মানসম্মত শিক্ষায় বাঁশখালীর আলোকবর্তিকা',
  messageBody: 'নাপোড়া শেখেরখীল উচ্চ বিদ্যালয় এই অঞ্চলের এক ঐতিহাসিক ঐতিহ্যবাহী বাতিঘর। নৈতিকতা, প্রযুক্তি ও মানসম্মত শিক্ষার সমন্বয়ে আমাদের শিক্ষার্থীরা দেশ ও জাতির যোগ্য নাগরিক হয়ে গড়ে উঠবে—এটাই আমাদের পরিচালনা পরিষদের অঙ্গীকার। বিদ্যালয়ের সকল উন্নয়ন কার্যক্রম ও ব্যাংক ব্যবস্থার ডিজিটালাইজেশনে আমরা সর্বদা সচেষ্ট।',
  photoUrl: ''
};

export const sortStudentsBySerial = (studentList: Student[]): Student[] => {
  return [...studentList].sort((a, b) => {
    // 1. Sort by class (6, 7, 8, 9, 10)
    const classA = parseInt(String(a.className || '6').replace(/\D/g, ''), 10) || 0;
    const classB = parseInt(String(b.className || '6').replace(/\D/g, ''), 10) || 0;
    if (classA !== classB) {
      return classA - classB;
    }

    // 2. Sort by section (A, B, C, D)
    const secA = String(a.section || 'A').toUpperCase();
    const secB = String(b.section || 'B').toUpperCase();
    if (secA !== secB) {
      return secA.localeCompare(secB);
    }

    // 3. Sort by gender (male / ছাত্র first, then female / ছাত্রী)
    const genA = a.gender === 'female' ? 2 : 1;
    const genB = b.gender === 'female' ? 2 : 1;
    if (genA !== genB) {
      return genA - genB;
    }

    // 4. Sort by roll in ascending order (1, 2, 3, 4, ... 132, 133, ... 146)
    // Convert Bengali digits (১, ২, ৩...) or strings to integer
    const rollStrA = String(a.roll ?? 0).replace(/[০-৯]/g, d => String('০১২৩৪৫৬৭৮৯'.indexOf(d)));
    const rollStrB = String(b.roll ?? 0).replace(/[০-৯]/g, d => String('০১২৩৪৫৬৭৮৯'.indexOf(d)));
    const rollA = parseInt(rollStrA.replace(/\D/g, ''), 10) || 0;
    const rollB = parseInt(rollStrB.replace(/\D/g, ''), 10) || 0;
    if (rollA !== rollB) {
      return rollA - rollB;
    }

    // 5. Stable tie-breaker by name
    return (a.name || '').localeCompare(b.name || '', 'bn');
  });
};



