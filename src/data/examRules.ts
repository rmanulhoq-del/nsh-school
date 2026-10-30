import { Student, StudentGender, StudentGroup, ExamType, SubjectMark, StudentExamRecord } from '../types';

export const EXAM_MONTHS = [
  'জানুয়ারি',
  'ফেব্রুয়ারি',
  'মার্চ',
  'এপ্রিল',
  'মে',
  'জুন',
  'জুলাই',
  'আগস্ট',
  'সেপ্টেম্বর',
  'অক্টোবর',
  'নভেম্বর',
  'ডিসেম্বর'
] as const;

export const EXAM_BANKS = [
  'বাংলাদেশ কৃষি ব্যাংক, নাপোড়া শাখা',
  'আইএফআইসি ব্যাংক পিএলসি, নাপোড়া উপশাখা, বাঁশখালী, চট্টগ্রাম'
] as const;

export interface SubjectConfig {
  key: string;
  name: string;
  totalMarks: number;
  hasCqMcq: boolean;
  hasPractical?: boolean;
  cqTotal?: number;
  cqPass?: number;
  mcqTotal?: number;
  mcqPass?: number;
  practicalTotal?: number;
  practicalPass?: number;
  passTotal: number;
  isPractical?: boolean;
}

export function calculateGrade(obtained: number, total: number): { grade: string; gpa: number } {
  if (total <= 0) return { grade: 'F', gpa: 0.0 };
  const percent = (obtained / total) * 100;
  if (percent >= 80) return { grade: 'A+', gpa: 5.0 };
  if (percent >= 70) return { grade: 'A', gpa: 4.0 };
  if (percent >= 60) return { grade: 'A-', gpa: 3.5 };
  if (percent >= 50) return { grade: 'B', gpa: 3.0 };
  if (percent >= 40) return { grade: 'C', gpa: 2.0 };
  if (percent >= 33) return { grade: 'D', gpa: 1.0 };
  return { grade: 'F', gpa: 0.0 };
}

/**
 * Returns subjects config for a given class, gender, and group according to the PDF rules.
 */
export function getSubjectConfigsForClass(
  className: string,
  gender: StudentGender = 'male',
  group: StudentGroup = 'science'
): SubjectConfig[] {
  const isNineOrTen = className === '9' || className === '10';

  if (!isNineOrTen) {
    // ৬ষ্ঠ থেকে ৮ম শ্রেণি
    return [
      { key: 'bangla_1st', name: 'বাংলা ১ম পত্র', totalMarks: 100, hasCqMcq: false, passTotal: 33 },
      { key: 'bangla_2nd', name: 'বাংলা ২য় পত্র', totalMarks: 50, hasCqMcq: false, passTotal: 17 },
      { key: 'english_1st', name: 'ইংরেজি ১ম পত্র', totalMarks: 100, hasCqMcq: false, passTotal: 33 },
      { key: 'english_2nd', name: 'ইংরেজি ২য় পত্র', totalMarks: 50, hasCqMcq: false, passTotal: 17 },
      { key: 'math', name: 'গণিত', totalMarks: 100, hasCqMcq: false, passTotal: 33 },
      { key: 'science', name: 'বিজ্ঞান', totalMarks: 100, hasCqMcq: false, passTotal: 33 },
      { key: 'religion', name: 'ধর্ম ও নৈতিক শিক্ষা', totalMarks: 100, hasCqMcq: false, passTotal: 33 },
      { key: 'bgs', name: 'বাংলাদেশ ও বিশ্বপরিচয়', totalMarks: 100, hasCqMcq: false, passTotal: 33 },
      { key: 'ict', name: 'তথ্য ও যোগাযোগ প্রযুক্তি (আইসিটি)', totalMarks: 25, hasCqMcq: false, passTotal: 8 }
    ];
  }

  // নবম ও দশম শ্রেণির কমন বিষয়াবলী (CQ 70/23, MCQ 30/10)
  const commonNineTen: SubjectConfig[] = [
    { key: 'bangla_1st', name: 'বাংলা ১ম পত্র', totalMarks: 100, hasCqMcq: true, cqTotal: 70, cqPass: 23, mcqTotal: 30, mcqPass: 10, passTotal: 33 },
    { key: 'bangla_2nd', name: 'বাংলা ২য় পত্র', totalMarks: 100, hasCqMcq: true, cqTotal: 70, cqPass: 23, mcqTotal: 30, mcqPass: 10, passTotal: 33 },
    { key: 'english_1st', name: 'ইংরেজি ১ম পত্র', totalMarks: 100, hasCqMcq: true, cqTotal: 70, cqPass: 23, mcqTotal: 30, mcqPass: 10, passTotal: 33 },
    { key: 'english_2nd', name: 'ইংরেজি ২য় পত্র', totalMarks: 100, hasCqMcq: true, cqTotal: 70, cqPass: 23, mcqTotal: 30, mcqPass: 10, passTotal: 33 },
    { key: 'math', name: 'গণিত', totalMarks: 100, hasCqMcq: true, cqTotal: 70, cqPass: 23, mcqTotal: 30, mcqPass: 10, passTotal: 33 }
  ];

  if (group === 'science') {
    // বিজ্ঞান বিভাগ: পদার্থবিজ্ঞান, রসায়নবিজ্ঞান, জীববিজ্ঞান, উচ্চতর গণিত -> সিকিউ ৫০ (পাস ১৭), এমসিকিউ ২৫ (পাস ৮), ব্যবহারিক ২৫ (পাস ৮)
    return [
      ...commonNineTen,
      {
        key: 'physics',
        name: 'পদার্থবিজ্ঞান',
        totalMarks: 100,
        hasCqMcq: true,
        hasPractical: true,
        cqTotal: 50,
        cqPass: 17,
        mcqTotal: 25,
        mcqPass: 8,
        practicalTotal: 25,
        practicalPass: 8,
        passTotal: 33,
        isPractical: true
      },
      {
        key: 'chemistry',
        name: 'রসায়নবিজ্ঞান',
        totalMarks: 100,
        hasCqMcq: true,
        hasPractical: true,
        cqTotal: 50,
        cqPass: 17,
        mcqTotal: 25,
        mcqPass: 8,
        practicalTotal: 25,
        practicalPass: 8,
        passTotal: 33,
        isPractical: true
      },
      {
        key: 'biology',
        name: 'জীববিজ্ঞান',
        totalMarks: 100,
        hasCqMcq: true,
        hasPractical: true,
        cqTotal: 50,
        cqPass: 17,
        mcqTotal: 25,
        mcqPass: 8,
        practicalTotal: 25,
        practicalPass: 8,
        passTotal: 33,
        isPractical: true
      },
      {
        key: 'higher_math',
        name: 'উচ্চতর গণিত',
        totalMarks: 100,
        hasCqMcq: true,
        hasPractical: true,
        cqTotal: 50,
        cqPass: 17,
        mcqTotal: 25,
        mcqPass: 8,
        practicalTotal: 25,
        practicalPass: 8,
        passTotal: 33,
        isPractical: true
      },
      { key: 'religion', name: 'ধর্ম ও নৈতিক শিক্ষা', totalMarks: 100, hasCqMcq: true, cqTotal: 70, cqPass: 23, mcqTotal: 30, mcqPass: 10, passTotal: 33 },
      { key: 'bgs', name: 'বাংলাদেশ ও বিশ্বপরিচয়', totalMarks: 100, hasCqMcq: true, cqTotal: 70, cqPass: 23, mcqTotal: 30, mcqPass: 10, passTotal: 33 },
      { key: 'ict', name: 'তথ্য ও যোগাযোগ প্রযুক্তি (আইসিটি)', totalMarks: 25, hasCqMcq: false, passTotal: 8 }
    ];
  }

  // বাণিজ্য ও মানবিক বিভাগের ঐচ্ছিক বিষয় (PDF পেজ ৩ নোট অনুযায়ী: ছাত্র হলে কৃষি শিক্ষা, ছাত্রী হলে গার্হস্থ্য বিজ্ঞান)
  const optionalSubject: SubjectConfig = gender === 'female'
    ? { key: 'home_science', name: 'গার্হস্থ্য বিজ্ঞান', totalMarks: 100, hasCqMcq: true, cqTotal: 70, cqPass: 23, mcqTotal: 30, mcqPass: 10, passTotal: 33 }
    : { key: 'agriculture', name: 'কৃষি শিক্ষা', totalMarks: 100, hasCqMcq: true, cqTotal: 70, cqPass: 23, mcqTotal: 30, mcqPass: 10, passTotal: 33 };

  if (group === 'business') {
    // বাণিজ্য বিভাগ (১২টি বিষয়)
    return [
      ...commonNineTen,
      { key: 'accounting', name: 'হিসাববিজ্ঞান', totalMarks: 100, hasCqMcq: true, cqTotal: 70, cqPass: 23, mcqTotal: 30, mcqPass: 10, passTotal: 33 },
      { key: 'finance', name: 'ফিন্যান্স ও ব্যাংকিং', totalMarks: 100, hasCqMcq: true, cqTotal: 70, cqPass: 23, mcqTotal: 30, mcqPass: 10, passTotal: 33 },
      { key: 'business_ent', name: 'ব্যবসায় উদ্যোগ', totalMarks: 100, hasCqMcq: true, cqTotal: 70, cqPass: 23, mcqTotal: 30, mcqPass: 10, passTotal: 33 },
      { key: 'general_science', name: 'বিজ্ঞান', totalMarks: 100, hasCqMcq: true, cqTotal: 70, cqPass: 23, mcqTotal: 30, mcqPass: 10, passTotal: 33 },
      { key: 'religion', name: 'ধর্ম ও নৈতিক শিক্ষা', totalMarks: 100, hasCqMcq: true, cqTotal: 70, cqPass: 23, mcqTotal: 30, mcqPass: 10, passTotal: 33 },
      optionalSubject,
      { key: 'ict', name: 'তথ্য ও যোগাযোগ প্রযুক্তি (আইসিটি)', totalMarks: 25, hasCqMcq: false, passTotal: 8 }
    ];
  }

  // মানবিক বিভাগ (১২টি বিষয়)
  return [
    ...commonNineTen,
    { key: 'history', name: 'বাংলাদেশের ইতিহাস ও বিশ্বসভ্যতা', totalMarks: 100, hasCqMcq: true, cqTotal: 70, cqPass: 23, mcqTotal: 30, mcqPass: 10, passTotal: 33 },
    { key: 'geography', name: 'ভূগোল ও পরিবেশ', totalMarks: 100, hasCqMcq: true, cqTotal: 70, cqPass: 23, mcqTotal: 30, mcqPass: 10, passTotal: 33 },
    { key: 'civics', name: 'পৌরনীতি ও নাগরিকতা', totalMarks: 100, hasCqMcq: true, cqTotal: 70, cqPass: 23, mcqTotal: 30, mcqPass: 10, passTotal: 33 },
    { key: 'general_science', name: 'বিজ্ঞান', totalMarks: 100, hasCqMcq: true, cqTotal: 70, cqPass: 23, mcqTotal: 30, mcqPass: 10, passTotal: 33 },
    { key: 'religion', name: 'ধর্ম ও নৈতিক শিক্ষা', totalMarks: 100, hasCqMcq: true, cqTotal: 70, cqPass: 23, mcqTotal: 30, mcqPass: 10, passTotal: 33 },
    optionalSubject,
    { key: 'ict', name: 'তথ্য ও যোগাযোগ প্রযুক্তি (আইসিটি)', totalMarks: 25, hasCqMcq: false, passTotal: 8 }
  ];
}

export interface MarkInput {
  cq?: number | '';
  mcq?: number | '';
  practical?: number | '';
  total?: number | '';
}

/**
 * Evaluates student marks strictly following the PDF rules.
 */
export function evaluateStudentMarks(
  className: string,
  gender: StudentGender = 'male',
  group: StudentGroup = 'science',
  marksMap: Record<string, MarkInput>,
  examType: ExamType = '১ম সাময়িক',
  year: string = '২০২৬'
): StudentExamRecord {
  const configs = getSubjectConfigsForClass(className, gender, group);
  const subjects: Record<string, SubjectMark> = {};
  const isNineOrTen = className === '9' || className === '10';

  let totalMarks = 0;
  let obtainedTotal = 0;
  let totalGradePoints = 0;
  let failedCount = 0;

  // Evaluate individual subjects first
  for (const cfg of configs) {
    const input = marksMap[cfg.key] || {};
    let obtained = 0;
    let isPassed = true;
    let failReason = '';

    if (cfg.hasCqMcq) {
      const cq = Number(input.cq) || 0;
      const mcq = Number(input.mcq) || 0;
      const practical = cfg.hasPractical ? (Number(input.practical) || 0) : undefined;
      obtained = cq + mcq + (practical !== undefined ? practical : 0);

      // Check sub-components pass
      if (cfg.cqPass && cq < cfg.cqPass) {
        isPassed = false;
        failReason = `CQ-তে ${cq} (ন্যূনতম ${cfg.cqPass})`;
      }
      if (cfg.mcqPass && mcq < cfg.mcqPass) {
        isPassed = false;
        failReason = failReason ? `${failReason}, MCQ-তে ${mcq} (ন্যূনতম ${cfg.mcqPass})` : `MCQ-তে ${mcq} (ন্যূনতম ${cfg.mcqPass})`;
      }
      if (cfg.hasPractical && cfg.practicalPass && (practical || 0) < cfg.practicalPass) {
        isPassed = false;
        const pracReason = `ব্যবহারিকে ${practical || 0} (ন্যূনতম ${cfg.practicalPass})`;
        failReason = failReason ? `${failReason}, ${pracReason}` : pracReason;
      }
      if (obtained < cfg.passTotal) {
        isPassed = false;
      }

      const { grade, gpa } = calculateGrade(obtained, cfg.totalMarks);

      subjects[cfg.key] = {
        subjectKey: cfg.key,
        subjectName: cfg.name,
        totalMarks: cfg.totalMarks,
        cq,
        mcq,
        practical,
        obtainedTotal: obtained,
        passMarksTotal: cfg.passTotal,
        passMarksCq: cfg.cqPass,
        passMarksMcq: cfg.mcqPass,
        passMarksPractical: cfg.practicalPass,
        hasPractical: cfg.hasPractical,
        isPassed,
        grade: isPassed ? grade : 'F',
        gradePoint: isPassed ? gpa : 0.0,
        failReason
      };
    } else {
      obtained = Number(input.total) || 0;
      if (obtained < cfg.passTotal) {
        isPassed = false;
        failReason = `মোট ${obtained} (ন্যূনতম ${cfg.passTotal})`;
      }
      const { grade, gpa } = calculateGrade(obtained, cfg.totalMarks);

      subjects[cfg.key] = {
        subjectKey: cfg.key,
        subjectName: cfg.name,
        totalMarks: cfg.totalMarks,
        obtainedTotal: obtained,
        passMarksTotal: cfg.passTotal,
        isPassed,
        grade: isPassed ? grade : 'F',
        gradePoint: isPassed ? gpa : 0.0,
        failReason
      };
    }

    totalMarks += cfg.totalMarks;
    obtainedTotal += obtained;
  }

  // Enforce Special PDF Rules:
  if (!isNineOrTen) {
    // ৬ষ্ঠ থেকে ৮ম শ্রেণির জন্য বাংলা ১ম ও ২য় পত্র যৌথ নিয়ম (উভয় পত্র মিলে ৫০ এ পাস)
    const b1 = subjects['bangla_1st'];
    const b2 = subjects['bangla_2nd'];
    if (b1 && b2) {
      const banglaTotal = b1.obtainedTotal + b2.obtainedTotal;
      if (banglaTotal < 50) {
        b1.isPassed = false;
        b2.isPassed = false;
        b1.grade = 'F';
        b2.grade = 'F';
        b1.gradePoint = 0.0;
        b2.gradePoint = 0.0;
        b1.failReason = `উভয় পত্র মিলে ${banglaTotal} (৫০ এর নিচে)`;
        b2.failReason = `উভয় পত্র মিলে ${banglaTotal} (৫০ এর নিচে)`;
      } else {
        // উভয় পত্র মিলে ৫০ বা তদূর্ধ্ব হলে পাস হিসেবে গণ্য হবে
        b1.isPassed = true;
        b2.isPassed = true;
      }
    }

    // ইংরেজি ১ম ও ২য় পত্র যৌথ নিয়ম (উভয় পত্র মিলে ৫০ এ পাস)
    const e1 = subjects['english_1st'];
    const e2 = subjects['english_2nd'];
    if (e1 && e2) {
      const englishTotal = e1.obtainedTotal + e2.obtainedTotal;
      if (englishTotal < 50) {
        e1.isPassed = false;
        e2.isPassed = false;
        e1.grade = 'F';
        e2.grade = 'F';
        e1.gradePoint = 0.0;
        e2.gradePoint = 0.0;
        e1.failReason = `উভয় পত্র মিলে ${englishTotal} (৫০ এর নিচে)`;
        e2.failReason = `উভয় পত্র মিলে ${englishTotal} (৫০ এর নিচে)`;
      } else {
        e1.isPassed = true;
        e2.isPassed = true;
      }
    }
  } else {
    // নবম ও দশম শ্রেণি:
    // বাংলা ১ম ও ২য় পত্র মিলে CQ-তে ৪৬ এবং MCQ-তে ২০ (মোট ৬৬) এ পাস
    const b1 = subjects['bangla_1st'];
    const b2 = subjects['bangla_2nd'];
    if (b1 && b2) {
      const combinedCq = (b1.cq || 0) + (b2.cq || 0);
      const combinedMcq = (b1.mcq || 0) + (b2.mcq || 0);
      const combinedTotal = combinedCq + combinedMcq;
      if (combinedCq < 46 || combinedMcq < 20 || combinedTotal < 66) {
        b1.isPassed = false;
        b2.isPassed = false;
        b1.grade = 'F';
        b2.grade = 'F';
        b1.gradePoint = 0.0;
        b2.gradePoint = 0.0;
        b1.failReason = `উভয় পত্র CQ: ${combinedCq}/৪৬, MCQ: ${combinedMcq}/২০ (মোট: ${combinedTotal}/৬৬)`;
        b2.failReason = `উভয় পত্র CQ: ${combinedCq}/৪৬, MCQ: ${combinedMcq}/২০ (মোট: ${combinedTotal}/৬৬)`;
      } else {
        b1.isPassed = true;
        b2.isPassed = true;
      }
    }

    // ইংরেজি ১ম ও ২য় পত্র মিলে CQ-তে ৪৬ এবং MCQ-তে ২০ (মোট ৬৬) এ পাস
    const e1 = subjects['english_1st'];
    const e2 = subjects['english_2nd'];
    if (e1 && e2) {
      const combinedCq = (e1.cq || 0) + (e2.cq || 0);
      const combinedMcq = (e1.mcq || 0) + (e2.mcq || 0);
      const combinedTotal = combinedCq + combinedMcq;
      if (combinedCq < 46 || combinedMcq < 20 || combinedTotal < 66) {
        e1.isPassed = false;
        e2.isPassed = false;
        e1.grade = 'F';
        e2.grade = 'F';
        e1.gradePoint = 0.0;
        e2.gradePoint = 0.0;
        e1.failReason = `উভয় পত্র CQ: ${combinedCq}/৪৬, MCQ: ${combinedMcq}/২০ (মোট: ${combinedTotal}/৬৬)`;
        e2.failReason = `উভয় পত্র CQ: ${combinedCq}/৪৬, MCQ: ${combinedMcq}/২০ (মোট: ${combinedTotal}/৬৬)`;
      } else {
        e1.isPassed = true;
        e2.isPassed = true;
      }
    }
  }

  // Count fails and sum grade points
  const subList = Object.values(subjects);
  for (const s of subList) {
    if (!s.isPassed) {
      failedCount++;
    }
    totalGradePoints += s.gradePoint;
  }

  const overallPassed = failedCount === 0;
  const rawGpa = subList.length > 0 ? totalGradePoints / subList.length : 0;
  const gpa = overallPassed ? Math.min(5.0, Number(rawGpa.toFixed(2))) : 0.0;

  let overallGrade = 'F';
  if (overallPassed) {
    if (gpa >= 5.0) overallGrade = 'A+';
    else if (gpa >= 4.0) overallGrade = 'A';
    else if (gpa >= 3.5) overallGrade = 'A-';
    else if (gpa >= 3.0) overallGrade = 'B';
    else if (gpa >= 2.0) overallGrade = 'C';
    else if (gpa >= 1.0) overallGrade = 'D';
  }

  const remarks = overallPassed
    ? (gpa >= 4.5 ? 'অসাধারণ মেধা ও সাফল্য!' : gpa >= 3.5 ? 'সন্তোষজনক ও প্রশংসনীয় ফলাফল।' : 'উত্তীর্ণ, আরও অধ্যবসায় কাম্য।')
    : `অকৃতকার্য (${failedCount} বিষয়ে অকৃতকার্য)`;

  return {
    examType,
    year,
    subjects,
    totalMarks,
    obtainedTotal,
    gpa,
    grade: overallGrade,
    isPassed: overallPassed,
    failedSubjectCount: failedCount,
    remarks
  };
}

/**
 * Creates sample marks for a student based on their class and roll.
 */
export function generateSampleMarksForStudent(student: Student, examType: ExamType = '১ম সাময়িক'): StudentExamRecord {
  const configs = getSubjectConfigsForClass(student.className, student.gender || 'male', student.group || 'science');
  const marksMap: Record<string, MarkInput> = {};

  const baseFactor = student.roll === 1 ? 0.88 : student.roll === 2 ? 0.82 : student.roll <= 5 ? 0.74 : 0.65;

  for (const cfg of configs) {
    if (cfg.hasCqMcq) {
      if (cfg.hasPractical) {
        // বিজ্ঞান বিভাগ: CQ 50, MCQ 25, Practical 25
        const cqTarget = Math.round((cfg.cqTotal || 50) * baseFactor) - Math.floor(Math.random() * 3);
        const mcqTarget = Math.round((cfg.mcqTotal || 25) * baseFactor) - Math.floor(Math.random() * 2);
        const pracTarget = Math.round((cfg.practicalTotal || 25) * baseFactor) - Math.floor(Math.random() * 2);
        marksMap[cfg.key] = {
          cq: Math.max(18, Math.min(cfg.cqTotal || 50, cqTarget)),
          mcq: Math.max(9, Math.min(cfg.mcqTotal || 25, mcqTarget)),
          practical: Math.max(14, Math.min(cfg.practicalTotal || 25, pracTarget))
        };
      } else {
        const cqTarget = Math.round((cfg.cqTotal || 70) * baseFactor) - Math.floor(Math.random() * 4);
        const mcqTarget = Math.round((cfg.mcqTotal || 30) * baseFactor) - Math.floor(Math.random() * 2);
        marksMap[cfg.key] = {
          cq: Math.max(25, Math.min(cfg.cqTotal || 70, cqTarget)),
          mcq: Math.max(12, Math.min(cfg.mcqTotal || 30, mcqTarget))
        };
      }
    } else {
      const target = Math.round(cfg.totalMarks * baseFactor) - Math.floor(Math.random() * 3);
      marksMap[cfg.key] = {
        total: Math.max(cfg.passTotal, Math.min(cfg.totalMarks, target))
      };
    }
  }

  return evaluateStudentMarks(
    student.className,
    student.gender || 'male',
    student.group || 'science',
    marksMap,
    examType,
    student.feeYear || '২০২৬'
  );
}
