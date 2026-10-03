/**
 * Data portal siswa LearnSpace+. Nilainya diisi dari API (`GET /api/student/portal`) lewat `hydrateStudentPortal`
 * sebelum halaman siswa ditampilkan (lihat components/auth/Guard). Berkas ini hanya memuat tipe, helper, dan
 * wadah datanya — tidak ada data contoh.
 */
import { useDataStore } from '../store/useDataStore';

export type SubjectId = string;

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

interface Guardian { role: string; name: string; phone: string; email: string; job: string; avatar: string }
const EMPTY_STUDENT = {
  id: '', name: '', nickname: '', level: '', avatar: '', birthDate: '', age: '', gender: '', school: '', schoolClass: '', address: '', joined: '',
  email: '', phone: '', program: '', programShort: '', semester: '', parents: [] as Guardian[],
};
export let STUDENT = EMPTY_STUDENT;

/** Nomor WhatsApp admin bimbel (kontak bantuan). */
export const ADMIN_WA = '6282324567906';
export const ADMIN_WA_LABEL = '0823-2456-7906';

export let SUBJECTS: Subject[] = [];
const UNKNOWN_SUBJECT: Subject = { id: '', name: '-', short: '-', color: '#64748B', soft: '#F1F5F9', tutor: '-', tutorAvatar: '', days: '', time: '', progress: 0, score: 0, trend: 0, predikat: 'C', status: 'Baik', className: '-' };
export const subjectById = (id: SubjectId) => SUBJECTS.find((s) => s.id === id) ?? UNKNOWN_SUBJECT;

/* ------------------------------------------------------------------ */
/* Jadwal Live Tutor (diatur admin sesuai mapel program siswa)          */
/* ------------------------------------------------------------------ */

export type LiveStatus = 'Selesai' | 'Berlangsung' | 'Akan Datang';

export interface LiveClass {
  id: string;
  subjectId: SubjectId;
  topic: string;
  dayName: string;
  date: string;
  dateShort: string;
  start: string;
  end: string;
  room: string;
  status: LiveStatus;
  /** Link Google Meet dari tutor; hanya bisa dimasuki saat tutor sudah membuka kelas */
  meetUrl?: string;
  openedByTutor: boolean;
}

const DAY_ORDER = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
/** Nama hari ini, mis. "Kamis". */
export const TODAY_NAME = DAY_ORDER[(new Date().getDay() + 6) % 7];
export let WEEK_LABEL = '';
export let WEEK_DAYS: { name: string; date: string }[] = DAY_ORDER.map((name) => ({ name, date: '' }));
export let LIVE_CLASSES: LiveClass[] = [];

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
  /** URL embed video (mis. YouTube). Kosong = tampilkan poster */
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

export let COURSES: PortalCourse[] = [];

export const courseStats = (c: PortalCourse) => {
  const all = c.chapters.flatMap((ch) => ch.lessons);
  const done = all.filter((l) => l.done).length;
  return { total: all.length, done, percent: all.length ? Math.round((done / all.length) * 100) : 0 };
};

/* ------------------------------------------------------------------ */
/* Tugas & Asesmen: konten per tugas (PG, isian, atau upload file)       */
/* ------------------------------------------------------------------ */

export type TaskMode = 'pilihan-ganda' | 'isian' | 'file';

export interface TaskQuestion {
  id: number;
  question: string;
  options?: string[];
}

export interface TaskContent {
  mode: TaskMode;
  questions?: TaskQuestion[];
  accept?: string;
}

/** Konten pengerjaan sebuah tugas, dari data tugas di server (kunci jawaban tidak pernah dikirim ke siswa). */
export const taskContentFor = (id: string, type: 'tugas' | 'quiz'): TaskContent => {
  const a = useDataStore.getState().assignments.find((x) => x.id === id);
  const mode = (a?.mode as TaskMode | undefined) ?? (type === 'quiz' ? 'pilihan-ganda' : 'file');
  return { mode, questions: a?.questions ?? [], accept: a?.accept ?? '.pdf,.doc,.docx,.jpg,.png' };
};

export const TASK_MODE_LABEL: Record<TaskMode, string> = {
  'pilihan-ganda': 'Pilihan Ganda',
  isian: 'Isian Singkat',
  file: 'Upload File',
};

/* ------------------------------------------------------------------ */
/* Hasil Belajar                                                        */
/* ------------------------------------------------------------------ */

export let GRADE_TREND: { bulan: string; nilai: number }[] = [];
export let REPORT_SUMMARY = { average: 0, rank: 0, classSize: 0, topPercent: 0, status: '-', improvement: 0 };
export let SUBJECT_DESCRIPTIONS: Record<SubjectId, string> = {};

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

export let ATTENDANCE: PortalAttendance[] = [];

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

export let BILLS: Bill[] = [];

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

export let ANNOUNCEMENTS: { title: string; desc: string; date: string }[] = [];
export let ACHIEVEMENTS: { title: string; desc: string }[] = [];

/* ------------------------------------------------------------------ */
/* Hidrasi dari API                                                     */
/* ------------------------------------------------------------------ */

export interface StudentPortalPayload {
  student: Partial<typeof EMPTY_STUDENT>;
  subjects: Subject[];
  subjectDescriptions: Record<string, string>;
  liveClasses: LiveClass[];
  courses: PortalCourse[];
  attendance: PortalAttendance[];
  bills: Bill[];
  announcements: typeof ANNOUNCEMENTS;
  achievements: typeof ACHIEVEMENTS;
  gradeTrend: typeof GRADE_TREND;
  reportSummary: typeof REPORT_SUMMARY | null;
}

/** Isi wadah data di atas dari respons API. Ekspor di modul ini adalah live binding, jadi halaman membaca nilai terbaru saat render. */
export function hydrateStudentPortal(p: Partial<StudentPortalPayload>) {
  if (p.student) STUDENT = { ...EMPTY_STUDENT, ...p.student, parents: p.student.parents ?? [] };
  if (p.subjects) SUBJECTS = p.subjects;
  if (p.subjectDescriptions) SUBJECT_DESCRIPTIONS = p.subjectDescriptions;
  if (p.liveClasses) {
    LIVE_CLASSES = p.liveClasses;
    // kepala kolom jadwal mengikuti tanggal kelas yang tersimpan
    WEEK_DAYS = DAY_ORDER.map((name) => ({ name, date: LIVE_CLASSES.find((c) => c.dayName === name)?.date ?? '' }));
    const dated = WEEK_DAYS.filter((d) => d.date);
    WEEK_LABEL = dated.length ? `${dated[0].date} – ${dated[dated.length - 1].date}` : '';
  }
  if (p.courses) COURSES = p.courses;
  if (p.attendance) ATTENDANCE = p.attendance;
  if (p.bills) BILLS = p.bills;
  if (p.announcements) ANNOUNCEMENTS = p.announcements;
  if (p.achievements) ACHIEVEMENTS = p.achievements;
  if (p.gradeTrend) GRADE_TREND = p.gradeTrend;
  if (p.reportSummary) REPORT_SUMMARY = p.reportSummary;
}

export function resetStudentPortal() {
  STUDENT = EMPTY_STUDENT;
  SUBJECTS = []; LIVE_CLASSES = []; COURSES = []; ATTENDANCE = []; BILLS = []; ANNOUNCEMENTS = []; ACHIEVEMENTS = []; GRADE_TREND = [];
  SUBJECT_DESCRIPTIONS = {};
}
