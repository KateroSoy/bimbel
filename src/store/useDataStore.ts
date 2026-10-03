import { create } from 'zustand';
import { toast } from 'sonner';
import { api, ApiError } from '../lib/api';

export interface Student {
  id: string;
  name: string;
  grade: string;
  status: 'Aktif' | 'Nonaktif';
  gpa: number;
  email: string;
  phone: string;
  attendance?: string;
  avatar?: string;
  nis?: string;
  parentName?: string;
  parentPhone?: string;
  classId?: string;
}

export interface Teacher {
  id: string;
  name: string;
  subject: string;
  status: 'Aktif' | 'Nonaktif';
  rating: number;
  classes: number;
  email: string;
  phone: string;
  avatar?: string;
}

export interface LessonAttachment {
  id: string;
  name: string;
  type: 'pdf' | 'docx' | 'image';
  size: string;
  url: string;
}

export interface LessonItem {
  id: string;
  courseId: string;
  title: string;
  moduleTitle: string;
  type: 'video' | 'document' | 'quiz';
  duration: string;
  completed: boolean;
  videoUrl?: string; // YouTube URL / embed
  images?: string[];
  documents?: LessonAttachment[];
  summary?: string;
  content?: string;
}

export interface Course {
  id: string;
  title: string;
  category: string;
  status: 'Aktif' | 'Nonaktif' | 'Draft' | 'Published';
  instructor: string;
  students: number;
  rating: number;
  lessons?: number;
  description?: string;
  videoUrl?: string;
  images?: string[];
  documents?: LessonAttachment[];
}

export interface Classroom {
  id: string;
  name: string;
  wali: string;
  students: number;
  studentCount?: number;
  schedule?: string;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  type: 'income' | 'expense';
  amount: number;
  status: 'Success' | 'Pending' | 'Failed';
  category?: string;
}

export interface Assignment {
  id: string;
  title: string;
  type: 'tugas' | 'quiz';
  kelas: string;
  subject: string;
  deadline: string;
  description: string;
  submitted: number;
  total: number;
  status: 'Aktif' | 'Selesai';
  duration?: number;
  source?: string;
  /** Cara pengerjaan dan soal (tanpa kunci jawaban untuk siswa) */
  mode?: 'pilihan-ganda' | 'isian' | 'file';
  questions?: { id: number; question: string; options?: string[]; answer?: number }[];
  accept?: string;
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  studentNis: string;
  submittedAt: string | null;
  status: 'Dinilai' | 'Perlu Dinilai' | 'Belum Mengumpulkan';
  score: number | null;
  feedback?: string;
  fileName?: string;
  answers?: Record<string, number | string> | null;
}

export interface QuestionPack {
  id: string;
  title: string;
  subject: string;
  grade: string;
  questions: number;
  time: string;
  difficulty: 'Mudah' | 'Sedang' | 'Sulit';
  questionsList?: { id: number; question: string; options: string[]; answer: number }[];
}

export interface Announcement {
  id: string;
  title: string;
  date: string;
  content: string;
  category: 'Akademik' | 'Libur' | 'Ujian' | 'Umum';
  author: string;
  pinned?: boolean;
}

export interface GradeItem {
  id: string;
  studentId: string;
  studentName: string;
  studentNis: string;
  class: string;
  subject: string;
  tugas: number;
  uts: number;
  uas: number;
  finalScore: number;
  letterGrade: string;
}

export interface CertificateItem {
  id: string;
  title: string;
  date: string;
  issuer: string;
  recipientName: string;
  credentialId: string;
  gradeScore: string;
}
export type Certificate = CertificateItem;

export interface ScheduleItem {
  id: string;
  day: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu';
  subject: string;
  teacher: string;
  time: string;
  room: string;
}

export interface SchoolSettings {
  schoolName: string;
  address: string;
  academicYear: string;
  phone: string;
  email: string;
  principalName: string;
  website: string;
}

// Student Attendance Record
export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  time: string;
  subject: string;
  tutor: string;
  room: string;
  status: 'Hadir' | 'Izin' | 'Sakit' | 'Alpha';
  topic: string;
  checkInTime?: string;
}

// Student Tuition / SPP Payment Record
export interface TuitionPayment {
  id: string;
  invoiceNo: string;
  studentId: string;
  studentName: string;
  period: string;
  description: string;
  amount: number;
  dueDate: string;
  paidDate?: string | null;
  status: 'Lunas' | 'Belum Dibayar' | 'Menunggu Verifikasi';
  paymentMethod?: string;
  receiptUrl?: string;
}

// WhatsApp Message Log for Parent Notifications
export interface WhatsAppMessageLog {
  id: string;
  recipientName: string;
  recipientPhone: string;
  studentName: string;
  studentGrade: string;
  category: 'Pengingat SPP' | 'Laporan Absensi' | 'Pengumuman Tryout' | 'Jadwal Bimbel' | 'Evaluasi Belajar' | 'Umum';
  message: string;
  sentAt: string;
  status: 'Terkirim' | 'Pending' | 'Gagal';
}

// Bimbel Inventory & Asset Record
export interface InventoryItem {
  id: string;
  itemCode: string;
  name: string;
  category: 'Modul & Buku' | 'Elektronik & Multimedia' | 'Fasilitas Studio Kelas' | 'Perlengkapan Belajar' | 'ATK & Operasional';
  quantity: number;
  unit: string;
  location: string;
  condition: 'Baik' | 'Perlu Perbaikan' | 'Rusak';
  purchaseDate: string;
  pricePerUnit: number;
  totalValue: number;
  status: 'Tersedia' | 'Dipinjam' | 'Habis / Perlu Restock';
  notes?: string;
}

interface DataState {
  /** Peran yang datanya sedang dimuat; null = belum dimuat */
  loadedFor: 'admin' | 'guru' | 'siswa' | null;
  /** Muat ulang semua koleksi yang boleh dibaca peran ini dari server */
  hydrate: (role: 'admin' | 'guru' | 'siswa') => Promise<void>;
  students: Student[];
  teachers: Teacher[];
  courses: Course[];
  lessons: LessonItem[];
  classes: Classroom[];
  transactions: Transaction[];
  assignments: Assignment[];
  submissions: Submission[];
  questionPacks: QuestionPack[];
  announcements: Announcement[];
  grades: GradeItem[];
  certificates: CertificateItem[];
  schedules: ScheduleItem[];
  attendanceLogs: AttendanceRecord[];
  tuitionPayments: TuitionPayment[];
  whatsAppLogs: WhatsAppMessageLog[];
  inventoryItems: InventoryItem[];
  schoolSettings: SchoolSettings;

  // Student CRUD
  addStudent: (student: Omit<Student, 'id'>) => void;
  updateStudent: (id: string, student: Partial<Student>) => void;
  deleteStudent: (id: string) => void;

  // Teacher CRUD
  addTeacher: (teacher: Omit<Teacher, 'id'>) => void;
  updateTeacher: (id: string, teacher: Partial<Teacher>) => void;
  deleteTeacher: (id: string) => void;

  // Course CRUD
  addCourse: (course: Omit<Course, 'id'>) => void;
  updateCourse: (id: string, course: Partial<Course>) => void;
  deleteCourse: (id: string) => void;

  // Lesson CRUD
  updateLesson: (id: string, lesson: Partial<LessonItem>) => void;
  
  // Classroom CRUD
  addClassroom: (classroom: Omit<Classroom, 'id'>) => void;
  updateClassroom: (id: string, classroom: Partial<Classroom>) => void;
  deleteClassroom: (id: string) => void;

  // Transaction CRUD
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;

  // Assignment CRUD
  addAssignment: (assignment: Omit<Assignment, 'id'>) => void;
  updateAssignment: (id: string, assignment: Partial<Assignment>) => void;
  deleteAssignment: (id: string) => void;

  // Submission / Grading
  addSubmission: (submission: { assignmentId: string; answers?: Record<string, number | string>; fileName?: string }) => Promise<Submission | null>;
  gradeSubmission: (id: string, score: number, feedback?: string) => void;

  // Question Pack CRUD
  addQuestionPack: (pack: Omit<QuestionPack, 'id'>) => void;
  updateQuestionPack: (id: string, pack: Partial<QuestionPack>) => void;
  deleteQuestionPack: (id: string) => void;

  // Announcement CRUD
  addAnnouncement: (announcement: Omit<Announcement, 'id'>) => void;
  updateAnnouncement: (id: string, announcement: Partial<Announcement>) => void;
  deleteAnnouncement: (id: string) => void;

  // Grade CRUD
  updateGrade: (id: string, grade: Partial<GradeItem>) => void;

  // Schedule CRUD
  addSchedule: (schedule: Omit<ScheduleItem, 'id'>) => void;
  deleteSchedule: (id: string) => void;

  // Attendance Records
  addAttendanceRecord: (record: Omit<AttendanceRecord, 'id'>) => void;
  addBatchAttendanceRecords: (records: Omit<AttendanceRecord, 'id'>[]) => void;

  // Tuition Payments
  payTuition: (id: string, method: string) => void;
  addTuitionPayment: (payment: Omit<TuitionPayment, 'id'>) => void;
  updateTuitionPayment: (id: string, payment: Partial<TuitionPayment>) => void;

  // WhatsApp Notifications
  sendWhatsAppMessage: (log: Omit<WhatsAppMessageLog, 'id'>) => void;

  // Inventory CRUD
  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => void;
  updateInventoryItem: (id: string, item: Partial<InventoryItem>) => void;
  deleteInventoryItem: (id: string) => void;

  // School / Bimbel Settings
  updateSchoolSettings: (settings: Partial<SchoolSettings>) => void;

  // Reset
  resetToDefaultData: () => void;
}

/* ------------------------------------------------------------------ */
/* Implementasi: cache sisi klien di atas API. Tidak ada data bawaan.   */
/* ------------------------------------------------------------------ */

type Role = 'admin' | 'guru' | 'siswa';
type Row = Record<string, any>;

const emptySettings: SchoolSettings = { schoolName: '', address: '', academicYear: '', phone: '', email: '', principalName: '', website: '' };
const fail = (e: unknown) => { toast.error(e instanceof ApiError ? e.first : 'Terjadi kesalahan.'); };
const list = async (resource: string): Promise<Row[]> => (await api.get<{ data: Row[] }>(`/r/${resource}`)).data;

// Bentuk lama store ↔ kolom API
const toStudent = (r: Row): Student => ({ ...r, nis: r.id, grade: r.kelas ?? '', parentName: r.parent ?? '', parentPhone: r.parentPhone || r.phone || '', gpa: r.gpa ?? 0, attendance: r.attendance || '-' } as Student);
const fromStudent = (s: Partial<Student>): Row => ({ name: s.name, kelas: s.grade, parent: s.parentName, parentPhone: s.parentPhone, phone: s.phone, email: s.email, status: s.status, gpa: s.gpa, attendance: s.attendance });
const toCourse = (r: Row): Course => ({ ...r, students: r.students ?? 0, rating: r.rating ?? 0 } as Course);
const toAnnouncement = (r: Row): Announcement => ({ id: r.id, title: r.title, date: r.date, content: r.body ?? '', category: r.category, author: r.author, pinned: !!r.important });
const toTuition = (b: Row): TuitionPayment => ({
  id: b.id, invoiceNo: b.invoice || b.id, studentId: b.studentRef || b.id, studentName: b.name, period: b.title || b.program || '', description: b.description || b.program || '',
  amount: (b.amount ?? 0) - (b.discount ?? 0), dueDate: b.due ?? '', paidDate: b.paidAt ?? null,
  status: b.status === 'Lunas' ? 'Lunas' : b.verification === 'pending' ? 'Menunggu Verifikasi' : 'Belum Dibayar', paymentMethod: b.method,
});
const toAttendance = (a: Row): AttendanceRecord => ({ id: a.id, studentId: a.studentRef ?? '', studentName: '', date: `${a.date ?? ''} ${a.month ?? ''}`.trim(), time: a.time ?? '', subject: a.subjectId ?? '', tutor: '', room: '', status: a.status, topic: a.topic ?? '' });

/** Resource yang dimuat untuk tiap peran saat masuk (sesuai hak baca di server). */
const LOADS: Record<Role, [keyof DataState, string, (r: Row) => any][]> = {
  siswa: [['assignments', 'assignments', (r) => r], ['submissions', 'submissions', (r) => r], ['lessons', 'lesson-items', (r) => r], ['certificates', 'certificates', (r) => r], ['announcements', 'announcements', toAnnouncement]],
  guru: [['assignments', 'assignments', (r) => r], ['submissions', 'submissions', (r) => r], ['courses', 'courses', toCourse], ['lessons', 'lesson-items', (r) => r],
    ['classes', 'classrooms', (r) => r], ['students', 'students', toStudent], ['grades', 'grades', (r) => r], ['announcements', 'announcements', toAnnouncement]],
  admin: [['students', 'students', toStudent], ['courses', 'courses', toCourse], ['classes', 'classrooms', (r) => r], ['inventoryItems', 'inventory-items', (r) => r],
    ['whatsAppLogs', 'whatsapp-logs', (r) => r], ['tuitionPayments', 'bills', toTuition], ['attendanceLogs', 'student-attendances', toAttendance], ['announcements', 'announcements', toAnnouncement]],
};

const EMPTY = {
  students: [], teachers: [], courses: [], lessons: [], classes: [], transactions: [], assignments: [], submissions: [], questionPacks: [], announcements: [],
  grades: [], certificates: [], schedules: [], attendanceLogs: [], tuitionPayments: [], whatsAppLogs: [], inventoryItems: [], schoolSettings: emptySettings,
};

export const useDataStore = create<DataState>()((set, get) => {
  /** add / update / delete untuk satu koleksi yang dipetakan ke satu resource API. */
  const crud = <T extends { id: string }>(key: keyof DataState, resource: string, inbound: (r: Row) => T = (r) => r as T, outbound: (v: any) => Row = (v) => v) => ({
    add: (value: any) => { api.post<{ data: Row }>(`/r/${resource}`, outbound(value)).then(({ data }) => set((s) => ({ [key]: [inbound(data), ...(s[key] as unknown as T[])] } as any))).catch(fail); },
    update: (id: string, changes: any) => { api.put<{ data: Row }>(`/r/${resource}/${encodeURIComponent(id)}`, outbound(changes)).then(({ data }) => set((s) => ({ [key]: (s[key] as unknown as T[]).map((x) => (x.id === id ? inbound(data) : x)) } as any))).catch(fail); },
    remove: (id: string) => { api.del(`/r/${resource}/${encodeURIComponent(id)}`).then(() => set((s) => ({ [key]: (s[key] as unknown as T[]).filter((x) => x.id !== id) } as any))).catch(fail); },
  });
  const students = crud<Student>('students', 'students', toStudent, fromStudent);
  const courses = crud<Course>('courses', 'courses', toCourse);
  const classes = crud<Classroom>('classes', 'classrooms');
  const assignments = crud<Assignment>('assignments', 'assignments');
  const announcements = crud<Announcement>('announcements', 'announcements', toAnnouncement, (a) => ({ title: a.title, body: a.content, date: a.date, category: a.category, author: a.author, important: a.pinned }));
  const grades = crud<GradeItem>('grades', 'grades');
  const inventory = crud<InventoryItem>('inventoryItems', 'inventory-items');
  const lessons = crud<LessonItem>('lessons', 'lesson-items');
  const waLogs = crud<WhatsAppMessageLog>('whatsAppLogs', 'whatsapp-logs');
  const legacy = (what: string) => () => { toast.info(`${what} kini dikelola dari menu baru di sidebar.`); };

  return {
    ...EMPTY,
    loadedFor: null,

    hydrate: async (role) => {
      set({ ...EMPTY, loadedFor: null });
      const [settings, ...lists] = await Promise.all([
        api.get<{ data: SchoolSettings }>('/settings').then((r) => r.data).catch(() => emptySettings),
        ...LOADS[role].map(([, resource]) => list(resource).catch(() => [] as Row[])),
      ]);
      const next: Row = { schoolSettings: settings, loadedFor: role };
      LOADS[role].forEach(([key, , map], i) => { next[key as string] = lists[i].map(map); });
      set(next as Partial<DataState>);
    },

    addStudent: students.add, updateStudent: students.update, deleteStudent: students.remove,
    addCourse: courses.add, updateCourse: courses.update, deleteCourse: courses.remove,
    updateLesson: lessons.update,
    addClassroom: classes.add, updateClassroom: classes.update, deleteClassroom: classes.remove,
    addAssignment: assignments.add, updateAssignment: assignments.update, deleteAssignment: assignments.remove,
    addAnnouncement: announcements.add, updateAnnouncement: announcements.update, deleteAnnouncement: announcements.remove,
    updateGrade: grades.update,
    addInventoryItem: inventory.add, updateInventoryItem: inventory.update, deleteInventoryItem: inventory.remove,
    sendWhatsAppMessage: waLogs.add,

    // Pengumpulan tugas: identitas siswa dan nilai pilihan ganda ditentukan server.
    addSubmission: async (submission) => {
      try {
        const { data } = await api.post<{ data: Submission }>('/r/submissions', submission);
        set((s) => ({
          submissions: [data, ...s.submissions.filter((x) => x.id !== data.id)],
          assignments: s.assignments.map((a) => (a.id === data.assignmentId && !s.submissions.some((x) => x.id === data.id) ? { ...a, submitted: Math.min(a.total || Infinity, a.submitted + 1) } : a)),
        }));
        return data;
      } catch (e) { fail(e); return null; }
    },
    gradeSubmission: (id, score, feedback) => {
      api.put<{ data: Submission }>(`/r/submissions/${encodeURIComponent(id)}`, { score, feedback })
        .then(({ data }) => set((s) => ({ submissions: s.submissions.map((x) => (x.id === id ? data : x)) }))).catch(fail);
    },

    updateSchoolSettings: (settings) => {
      api.put<{ data: SchoolSettings }>('/settings', settings).then(({ data }) => set({ schoolSettings: data })).catch(fail);
    },
    resetToDefaultData: () => { const role = get().loadedFor; if (role) void get().hydrate(role); },

    // Koleksi dari halaman lama yang sudah digantikan halaman baru (tidak dirutekan lagi).
    addTeacher: legacy('Data tutor'), updateTeacher: legacy('Data tutor'), deleteTeacher: legacy('Data tutor'),
    addTransaction: legacy('Transaksi'), updateTransaction: legacy('Transaksi'), deleteTransaction: legacy('Transaksi'),
    addQuestionPack: legacy('Bank soal'), updateQuestionPack: legacy('Bank soal'), deleteQuestionPack: legacy('Bank soal'),
    addSchedule: legacy('Jadwal'), deleteSchedule: legacy('Jadwal'),
    addAttendanceRecord: legacy('Presensi'), addBatchAttendanceRecords: legacy('Presensi'),
    payTuition: legacy('Tagihan'), addTuitionPayment: legacy('Tagihan'), updateTuitionPayment: legacy('Tagihan'),
  };
});
