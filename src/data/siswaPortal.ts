/**
 * Data demo portal siswa LearnSpace+ (satu persona konsisten di semua halaman).
 * Mapel, jadwal, dan course diturunkan dari PROGRAM yang diambil siswa —
 * siswa tidak menambah jadwal/mapel sendiri; admin yang mengatur.
 */

export type SubjectId = 'english' | 'math' | 'science' | 'bindo' | 'mengaji';

export interface Subject {
  id: SubjectId;
  name: string;
  short: string;
  /** Tailwind-friendly hex colors */
  color: string;
  soft: string;
  tutor: string;
  tutorAvatar: string;
  days: string;
  time: string;
  progress: number;
  score: number;
  trend: number;
  predikat: 'A' | 'B' | 'C';
  status: 'Sangat Baik' | 'Baik' | 'Perlu Perhatian';
  className: string;
}

export const STUDENT = {
  id: 'SH-00023',
  name: 'Andi Pratama',
  nickname: 'Andi',
  level: 'Primary 3',
  avatar: '/assets/portal/andi.png',
  birthDate: '10 Maret 2016',
  age: '9 tahun',
  gender: 'Laki-laki',
  school: 'SD Negeri 03 Jakarta',
  schoolClass: '3A',
  address: 'Jl. Merdeka No. 45, Jakarta Selatan',
  joined: '12 Januari 2025',
  email: 'andi.pratama@email.com',
  phone: '0812-3456-7890',
  program: 'Paket SUPER + Mengaji',
  programShort: 'English, Math & Science',
  semester: 'Semester 1 (2025)',
  parents: [
    { role: 'Ayah (Wali Utama)', name: 'Budi Kandung', phone: '0813-9876-5432', email: 'budi.kandung@email.com', job: 'Karyawan Swasta', avatar: '/assets/portal/ayah.png' },
    { role: 'Ibu (Wali)', name: 'Andini', phone: '0812-3456-7890', email: 'andini@email.com', job: 'Ibu Rumah Tangga', avatar: '/assets/portal/ibu.png' },
  ],
};

export const ADMIN_WA = '6282324567906';
export const ADMIN_WA_LABEL = '0823-2456-7906';

export const SUBJECTS: Subject[] = [
  { id: 'english', name: 'English', short: 'EN', color: '#F97316', soft: '#FFF1E7', tutor: 'Ms. Fitri', tutorAvatar: '/assets/portal/tutor-fitri.png', days: 'Senin & Rabu', time: '16.00 – 17.30', progress: 82, score: 92, trend: 6, predikat: 'A', status: 'Sangat Baik', className: 'English – Primary 3' },
  { id: 'math', name: 'Mathematics', short: 'MA', color: '#2563EB', soft: '#EAF1FF', tutor: 'Mr. Andi', tutorAvatar: '/assets/portal/tutor-andi.png', days: 'Selasa & Kamis', time: '16.00 – 17.30', progress: 78, score: 85, trend: 3, predikat: 'A', status: 'Baik', className: 'Mathematics – Primary 3' },
  { id: 'science', name: 'Science', short: 'SC', color: '#7C3AED', soft: '#F3EDFF', tutor: 'Ms. Nurul', tutorAvatar: '/assets/portal/tutor-nurul.png', days: 'Rabu & Jumat', time: '18.30 – 20.00', progress: 65, score: 65, trend: -2, predikat: 'C', status: 'Perlu Perhatian', className: 'Science – Primary 3' },
  { id: 'bindo', name: 'Bahasa Indonesia', short: 'BI', color: '#DC2626', soft: '#FDECEC', tutor: 'Ms. Siti Rohmah', tutorAvatar: '/assets/portal/tutor-siti.png', days: 'Jumat', time: '16.00 – 17.30', progress: 88, score: 88, trend: 5, predikat: 'A', status: 'Sangat Baik', className: 'Bahasa Indonesia – Primary 3' },
  { id: 'mengaji', name: 'Mengaji', short: 'MG', color: '#16A34A', soft: '#E9F8EF', tutor: 'Ust. Budi', tutorAvatar: '/assets/portal/tutor-budi.png', days: 'Kamis & Sabtu', time: '20.00 – 21.00', progress: 90, score: 90, trend: 4, predikat: 'A', status: 'Sangat Baik', className: 'Mengaji – Level 2' },
];

export const subjectById = (id: SubjectId) => SUBJECTS.find((s) => s.id === id)!;

/* ------------------------------------------------------------------ */
/* Jadwal Live Tutor (diatur admin sesuai mapel program siswa)          */
/* ------------------------------------------------------------------ */

export type LiveStatus = 'Selesai' | 'Berlangsung' | 'Akan Datang';

export interface LiveClass {
  id: string;
  subjectId: SubjectId;
  topic: string;
  dayName: string;
  date: string; // "14 Agustus"
  dateShort: string; // "14 Agu 2025"
  start: string;
  end: string;
  room: string;
  status: LiveStatus;
  /** Link Google Meet dari tutor; hanya bisa dimasuki saat tutor sudah membuka kelas */
  meetUrl?: string;
  openedByTutor: boolean;
}

export const DEMO_TODAY = 'Kamis, 14 Agustus 2025';
export const WEEK_LABEL = '11 – 17 Agustus 2025';

export const WEEK_DAYS = [
  { name: 'Senin', date: '11 Agustus' },
  { name: 'Selasa', date: '12 Agustus' },
  { name: 'Rabu', date: '13 Agustus' },
  { name: 'Kamis', date: '14 Agustus' },
  { name: 'Jumat', date: '15 Agustus' },
  { name: 'Sabtu', date: '16 Agustus' },
  { name: 'Minggu', date: '17 Agustus' },
];

export const LIVE_CLASSES: LiveClass[] = [
  { id: 'LC1', subjectId: 'english', topic: 'Unit 4: Daily Activities', dayName: 'Senin', date: '11 Agustus', dateShort: '11 Agu 2025', start: '16.00', end: '17.30', room: 'Studio Belajar 1', status: 'Selesai', openedByTutor: false },
  { id: 'LC2', subjectId: 'math', topic: 'Bab 1: Bilangan Bulat', dayName: 'Selasa', date: '12 Agustus', dateShort: '12 Agu 2025', start: '16.00', end: '17.30', room: 'Studio Belajar 2', status: 'Selesai', openedByTutor: false },
  { id: 'LC3', subjectId: 'english', topic: 'Unit 4: Speaking Practice', dayName: 'Rabu', date: '13 Agustus', dateShort: '13 Agu 2025', start: '16.00', end: '17.30', room: 'Studio Belajar 1', status: 'Selesai', openedByTutor: false },
  { id: 'LC4', subjectId: 'science', topic: 'Chapter 2: Plants and Light', dayName: 'Rabu', date: '13 Agustus', dateShort: '13 Agu 2025', start: '18.30', end: '20.00', room: 'Studio Sains', status: 'Selesai', openedByTutor: false },
  { id: 'LC5', subjectId: 'math', topic: 'Bab 1: Penjumlahan & Pengurangan', dayName: 'Kamis', date: '14 Agustus', dateShort: '14 Agu 2025', start: '16.00', end: '17.30', room: 'Studio Belajar 2', status: 'Selesai', openedByTutor: false },
  { id: 'LC6', subjectId: 'science', topic: 'Chapter 3: Light and Shadows', dayName: 'Kamis', date: '14 Agustus', dateShort: '14 Agu 2025', start: '18.30', end: '20.00', room: 'Online (Google Meet)', status: 'Berlangsung', meetUrl: 'https://meet.google.com/lsp-sci3-p3a', openedByTutor: true },
  { id: 'LC7', subjectId: 'mengaji', topic: 'Surah Al-Ikhlas', dayName: 'Kamis', date: '14 Agustus', dateShort: '14 Agu 2025', start: '20.00', end: '21.00', room: 'Online (Google Meet)', status: 'Akan Datang', meetUrl: 'https://meet.google.com/lsp-mgj2-lv2', openedByTutor: false },
  { id: 'LC8', subjectId: 'bindo', topic: 'Bab 2: Kalimat Efektif', dayName: 'Jumat', date: '15 Agustus', dateShort: '15 Agu 2025', start: '16.00', end: '17.30', room: 'Studio Belajar 3', status: 'Akan Datang', openedByTutor: false },
  { id: 'LC9', subjectId: 'science', topic: 'Chapter 3: Review & Quiz', dayName: 'Jumat', date: '15 Agustus', dateShort: '15 Agu 2025', start: '18.30', end: '20.00', room: 'Studio Sains', status: 'Akan Datang', openedByTutor: false },
  { id: 'LC10', subjectId: 'mengaji', topic: 'Surah Al-Falaq', dayName: 'Sabtu', date: '16 Agustus', dateShort: '16 Agu 2025', start: '10.00', end: '11.30', room: 'Ruang Mengaji', status: 'Akan Datang', openedByTutor: false },
];

export const canJoinLive = (c: LiveClass) => c.status === 'Berlangsung' && c.openedByTutor && !!c.meetUrl;

/* ------------------------------------------------------------------ */
/* Course & Materi (belajar mandiri: modul + video), sesuai program     */
/* ------------------------------------------------------------------ */

export type LessonKind = 'video' | 'catatan' | 'contoh' | 'latihan';

export interface CourseLesson {
  id: string;
  title: string;
  kind: LessonKind;
  duration: string;
  done: boolean;
  /** URL embed video (mis. YouTube). Kosong = tampilkan poster demo */
  videoUrl?: string;
  about: string;
  notes?: string[];
  files?: { name: string; size: string }[];
}

export interface CourseChapter {
  id: string;
  title: string;
  lessons: CourseLesson[];
  locked?: boolean;
}

export interface PortalCourse {
  id: string;
  subjectId: SubjectId;
  title: string;
  category: string;
  level: 'Mudah' | 'Sedang' | 'Sulit';
  description: string;
  chapters: CourseChapter[];
  lastStudied?: string;
}

const lessonsFor = (prefix: string, chapter: string, done: number): CourseLesson[] => ([
  { id: `${prefix}-1`, title: chapter, kind: 'video', duration: '10 menit', done: done > 0, about: `Pelajari konsep ${chapter.toLowerCase()} melalui video penjelasan tutor dan contoh penerapannya dalam kehidupan sehari-hari.`, files: [{ name: 'Ringkasan Materi (PDF)', size: '320 KB' }, { name: 'Rumus & Poin Penting (PDF)', size: '180 KB' }] },
  { id: `${prefix}-2`, title: `Catatan: ${chapter}`, kind: 'catatan', duration: '8 menit', done: done > 1, about: 'Catatan ringkas berisi poin penting materi.', notes: ['Baca kembali definisi dan contoh pada video.', 'Tandai bagian yang belum dipahami untuk ditanyakan ke tutor.', 'Buat rangkuman versi kamu sendiri.'] },
  { id: `${prefix}-3`, title: 'Contoh Soal dan Pembahasan', kind: 'contoh', duration: '15 menit', done: done > 2, about: 'Contoh soal bertahap dari mudah ke sulit beserta pembahasan lengkap.' },
  { id: `${prefix}-4`, title: 'Latihan Soal 1', kind: 'latihan', duration: '10 soal', done: done > 3, about: 'Uji pemahamanmu dengan 10 soal latihan. Nilai akan tersimpan di Hasil Belajar.' },
]);

export const COURSES: PortalCourse[] = [
  {
    id: 'math-p3', subjectId: 'math', title: 'Mathematics Primary 3', category: 'Matematika', level: 'Sedang', lastStudied: '13 Agu 2025',
    description: 'Belajar bilangan bulat, pecahan, desimal, persentase, dan perbandingan dengan video dan latihan bertahap.',
    chapters: [
      { id: 'm1', title: 'Bab 1: Bilangan Bulat', lessons: lessonsFor('m1', 'Penjumlahan dan Pengurangan Bilangan Bulat', 1) },
      { id: 'm2', title: 'Bab 2: Pecahan', lessons: lessonsFor('m2', 'Mengenal Pecahan', 0), locked: true },
      { id: 'm3', title: 'Bab 3: Desimal', lessons: lessonsFor('m3', 'Bilangan Desimal', 0), locked: true },
      { id: 'm4', title: 'Bab 4: Persentase', lessons: lessonsFor('m4', 'Persentase', 0), locked: true },
    ],
  },
  {
    id: 'english-p3', subjectId: 'english', title: 'English Primary 3', category: 'Bahasa', level: 'Sedang', lastStudied: '12 Agu 2025',
    description: 'Vocabulary, grammar, reading dan speaking untuk kegiatan sehari-hari.',
    chapters: [
      { id: 'e3', title: 'Unit 3: My Family', lessons: lessonsFor('e3', 'Talking About My Family', 4) },
      { id: 'e4', title: 'Unit 4: Daily Activities', lessons: lessonsFor('e4', 'Daily Activities', 3) },
      { id: 'e5', title: 'Unit 5: At School', lessons: lessonsFor('e5', 'Things at School', 0), locked: true },
    ],
  },
  {
    id: 'science-p3', subjectId: 'science', title: 'Science Primary 3', category: 'Sains', level: 'Sulit',
    description: 'Memahami tumbuhan, cahaya, dan bayangan lewat eksperimen sederhana.',
    chapters: [
      { id: 's2', title: 'Chapter 2: Plants and Light', lessons: lessonsFor('s2', 'How Plants Use Light', 3) },
      { id: 's3', title: 'Chapter 3: Light and Shadows', lessons: lessonsFor('s3', 'Light and Shadows', 1) },
      { id: 's4', title: 'Chapter 4: Materials', lessons: lessonsFor('s4', 'Properties of Materials', 0), locked: true },
    ],
  },
  {
    id: 'bindo-p3', subjectId: 'bindo', title: 'Bahasa Indonesia Primary 3', category: 'Bahasa', level: 'Mudah',
    description: 'Membaca pemahaman, kalimat efektif, dan menulis cerita sederhana.',
    chapters: [
      { id: 'b1', title: 'Bab 1: Membaca Pemahaman', lessons: lessonsFor('b1', 'Membaca Pemahaman', 4) },
      { id: 'b2', title: 'Bab 2: Kalimat Efektif', lessons: lessonsFor('b2', 'Kalimat Efektif', 2) },
    ],
  },
  {
    id: 'mengaji-l2', subjectId: 'mengaji', title: 'Mengaji – Level 2', category: 'Mengaji', level: 'Mudah',
    description: 'Hafalan surah pendek dan bacaan shalat secara bertahap.',
    chapters: [
      { id: 'q1', title: 'Hafalan: Surah Al-Ikhlas', lessons: lessonsFor('q1', 'Surah Al-Ikhlas', 4) },
      { id: 'q2', title: 'Hafalan: Surah Al-Falaq', lessons: lessonsFor('q2', 'Surah Al-Falaq', 1) },
    ],
  },
];

export const courseStats = (c: PortalCourse) => {
  const all = c.chapters.flatMap((ch) => ch.lessons);
  const done = all.filter((l) => l.done).length;
  return { total: all.length, done, percent: Math.round((done / all.length) * 100) };
};

/* ------------------------------------------------------------------ */
/* Tugas & Asesmen: konten per tugas (PG, isian, atau upload file)       */
/* ------------------------------------------------------------------ */

export type TaskMode = 'pilihan-ganda' | 'isian' | 'file';

export interface TaskQuestion {
  id: number;
  question: string;
  options?: string[];
  answer?: number;
}

export interface TaskContent {
  mode: TaskMode;
  questions?: TaskQuestion[];
  accept?: string;
}

/** Konten pengerjaan per id tugas (id dari store `assignments`). */
export const TASK_CONTENT: Record<string, TaskContent> = {
  '1': { mode: 'file', accept: '.pdf,.doc,.docx,.jpg,.png' },
  '2': {
    mode: 'isian',
    questions: [
      { id: 1, question: 'Sebutkan bunyi Hukum Pascal dengan kalimatmu sendiri.' },
      { id: 2, question: 'Sebuah benda tercelup sebagian di air. Gaya apa yang membuat benda tersebut terapung?' },
      { id: 3, question: 'Berikan satu contoh penerapan fluida dinamis dalam kehidupan sehari-hari.' },
    ],
  },
  '3': {
    mode: 'pilihan-ganda',
    questions: [
      { id: 1, question: 'Woman: "Would you like some coffee?" Man: "I\'d rather have tea." What does the man mean?', options: ['He wants coffee', 'He prefers tea', 'He does not want anything', 'He will make coffee'], answer: 1 },
      { id: 2, question: 'Man: "The library closes at five today." What can be inferred?', options: ['The library is closed', 'The library closes earlier than usual', 'The man works at the library', 'The library opens at five'], answer: 1 },
      { id: 3, question: 'Woman: "I can hardly hear the lecturer." What does the woman mean?', options: ['The lecturer speaks loudly', 'She hears the lecturer clearly', 'It is difficult for her to hear', 'She is not in class'], answer: 2 },
      { id: 4, question: 'Man: "Have you finished the report?" Woman: "Not quite." What does the woman mean?', options: ['She has finished', 'She has not started', 'She almost finished', 'She lost the report'], answer: 2 },
    ],
  },
};

export const taskContentFor = (id: string, type: 'tugas' | 'quiz'): TaskContent =>
  TASK_CONTENT[id] ?? (type === 'quiz' ? { mode: 'pilihan-ganda', questions: TASK_CONTENT['3'].questions } : { mode: 'file' });

export const TASK_MODE_LABEL: Record<TaskMode, string> = {
  'pilihan-ganda': 'Pilihan Ganda',
  isian: 'Isian Singkat',
  file: 'Upload File',
};

/* ------------------------------------------------------------------ */
/* Hasil Belajar                                                        */
/* ------------------------------------------------------------------ */

export const GRADE_TREND = [
  { bulan: 'Jan', nilai: 66 },
  { bulan: 'Feb', nilai: 72 },
  { bulan: 'Mar', nilai: 79 },
  { bulan: 'Apr', nilai: 83 },
  { bulan: 'Mei', nilai: 88 },
  { bulan: 'Jun', nilai: 95 },
];

export const REPORT_SUMMARY = { average: 85, rank: 3, classSize: 12, topPercent: 25, status: 'Baik', improvement: 15 };

export const SUBJECT_DESCRIPTIONS: Record<SubjectId, string> = {
  english: 'Sangat baik dalam kosakata dan speaking; perlu latihan menulis kalimat yang lebih panjang.',
  math: 'Menguasai penjumlahan dan pengurangan bilangan bulat; teruskan latihan soal cerita.',
  science: 'Perlu mengulang materi cahaya dan bayangan serta aktif bertanya saat kelas.',
  bindo: 'Pemahaman bacaan baik dan mampu menyusun kalimat efektif dengan tepat.',
  mengaji: 'Hafalan lancar dengan tajwid yang baik; pertahankan murajaah rutin.',
};

/* ------------------------------------------------------------------ */
/* Kehadiran                                                            */
/* ------------------------------------------------------------------ */

export type AttendanceStatus = 'Hadir' | 'Terlambat' | 'Izin' | 'Sakit' | 'Alpha';

export interface PortalAttendance {
  id: string;
  day: string;
  date: string;
  month: string;
  subjectId: SubjectId;
  time: string;
  topic: string;
  status: AttendanceStatus;
  note?: string;
}

export const ATTENDANCE: PortalAttendance[] = [
  { id: 'A1', day: 'KAM', date: '14', month: 'AGU', subjectId: 'math', time: '16.00 – 17.30', topic: 'Bab 1: Penjumlahan & Pengurangan', status: 'Hadir' },
  { id: 'A2', day: 'RAB', date: '13', month: 'AGU', subjectId: 'english', time: '16.00 – 17.30', topic: 'Unit 4: Speaking Practice', status: 'Hadir' },
  { id: 'A3', day: 'RAB', date: '13', month: 'AGU', subjectId: 'science', time: '18.30 – 20.00', topic: 'Chapter 2: Plants and Light', status: 'Izin', note: 'Sakit' },
  { id: 'A4', day: 'SEL', date: '12', month: 'AGU', subjectId: 'math', time: '16.00 – 17.30', topic: 'Bab 1: Bilangan Bulat', status: 'Hadir' },
  { id: 'A5', day: 'SEN', date: '11', month: 'AGU', subjectId: 'english', time: '16.00 – 17.30', topic: 'Unit 4: Daily Activities', status: 'Hadir' },
  { id: 'A6', day: 'SAB', date: '09', month: 'AGU', subjectId: 'mengaji', time: '10.00 – 11.30', topic: 'Surah Al-Ikhlas', status: 'Hadir' },
  { id: 'A7', day: 'JUM', date: '08', month: 'AGU', subjectId: 'bindo', time: '16.00 – 17.30', topic: 'Bab 2: Kalimat Efektif', status: 'Terlambat', note: 'Terlambat 10 menit' },
  { id: 'A8', day: 'JUM', date: '08', month: 'AGU', subjectId: 'science', time: '18.30 – 20.00', topic: 'Chapter 2: Plants and Light', status: 'Hadir' },
  { id: 'A9', day: 'KAM', date: '07', month: 'AGU', subjectId: 'mengaji', time: '20.00 – 21.00', topic: 'Bacaan Shalat', status: 'Hadir' },
  { id: 'A10', day: 'KAM', date: '07', month: 'AGU', subjectId: 'math', time: '16.00 – 17.30', topic: 'Nilai Tempat', status: 'Hadir' },
  { id: 'A11', day: 'RAB', date: '06', month: 'AGU', subjectId: 'english', time: '16.00 – 17.30', topic: 'Unit 3: Review', status: 'Hadir' },
  { id: 'A12', day: 'SEL', date: '05', month: 'AGU', subjectId: 'math', time: '16.00 – 17.30', topic: 'Membandingkan Bilangan', status: 'Hadir' },
];

/* ------------------------------------------------------------------ */
/* Pembayaran                                                           */
/* ------------------------------------------------------------------ */

export interface Bill {
  id: string;
  invoice: string;
  month: string;
  year: string;
  title: string;
  description: string;
  amount: number;
  dueDate: string;
  status: 'Lunas' | 'Belum Dibayar' | 'Menunggu Verifikasi';
  paidAt?: string;
  method?: string;
}

export const BILLS: Bill[] = [
  { id: 'B9', invoice: 'INV-2025-09-023', month: 'SEP', year: '2025', title: 'SPP September 2025', description: 'SPP Bimbel Bulanan', amount: 300000, dueDate: '10 Sep 2025', status: 'Belum Dibayar' },
  { id: 'B8', invoice: 'INV-2025-08-023', month: 'AGU', year: '2025', title: 'SPP Agustus 2025', description: 'SPP Bimbel Bulanan', amount: 300000, dueDate: '10 Agu 2025', status: 'Lunas', paidAt: '2 Agu 2025, 09.12', method: 'QRIS' },
  { id: 'B7', invoice: 'INV-2025-07-023', month: 'JUL', year: '2025', title: 'SPP Juli 2025', description: 'SPP Bimbel Bulanan', amount: 300000, dueDate: '10 Jul 2025', status: 'Lunas', paidAt: '5 Jul 2025, 14.20', method: 'Virtual Account BCA' },
  { id: 'B6', invoice: 'INV-2025-06-023', month: 'JUN', year: '2025', title: 'SPP Juni 2025', description: 'SPP Bimbel Bulanan', amount: 300000, dueDate: '10 Jun 2025', status: 'Lunas', paidAt: '3 Jun 2025, 10.05', method: 'Transfer Bank Mandiri' },
  { id: 'B5', invoice: 'INV-2025-05-023', month: 'MEI', year: '2025', title: 'SPP Mei 2025', description: 'SPP Bimbel Bulanan', amount: 300000, dueDate: '10 Mei 2025', status: 'Lunas', paidAt: '8 Mei 2025, 19.40', method: 'QRIS' },
  { id: 'B1', invoice: 'INV-2025-01-023', month: 'JAN', year: '2025', title: 'Biaya Pendaftaran', description: 'Pendaftaran & Modul Awal', amount: 350000, dueDate: '12 Jan 2025', status: 'Lunas', paidAt: '12 Jan 2025, 11.00', method: 'Transfer Bank BCA' },
];

export const PAYMENT_METHODS = [
  { id: 'bank', name: 'Transfer Bank', desc: 'BCA, Mandiri, BNI, BRI' },
  { id: 'va', name: 'Virtual Account', desc: 'Bayar melalui Virtual Account' },
  { id: 'qris', name: 'QRIS', desc: 'Scan QRIS untuk pembayaran cepat' },
  { id: 'card', name: 'Kartu Debit/Kredit', desc: 'Visa, Mastercard, JCB' },
] as const;

export const rupiah = (n: number) => `Rp${n.toLocaleString('id-ID')}`;

/* ------------------------------------------------------------------ */
/* Dashboard extras                                                     */
/* ------------------------------------------------------------------ */

export const ANNOUNCEMENTS = [
  { title: 'Libur Kemerdekaan', desc: 'Bimbel akan libur pada tanggal 17 Agustus 2025', date: '12 Agustus 2025' },
  { title: 'Workshop Belajar Efektif', desc: '24 Agustus 2025 – Daftar sekarang!', date: '10 Agustus 2025' },
];

export const ACHIEVEMENTS = [
  { title: 'Perfect Attendance', desc: 'Juli 2025' },
  { title: 'Vocabulary Master', desc: 'Level 1' },
];
