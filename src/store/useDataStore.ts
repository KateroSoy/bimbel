import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
  addSubmission: (submission: Omit<Submission, 'id'>) => void;
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

export const initialStudents: Student[] = [
  { id: '1001', name: 'Budi Santoso', nis: '1001', grade: 'Batch UTBK 1', status: 'Aktif', gpa: 3.85, email: 'budi.santoso@bimbel.edu', phone: '081234567890', attendance: '98%', parentName: 'Ibu Sri Handayani', parentPhone: '081234567890' },
  { id: '1002', name: 'Siti Aminah', nis: '1002', grade: 'Batch Kedinasan 2', status: 'Aktif', gpa: 3.65, email: 'siti.aminah@bimbel.edu', phone: '081234567891', attendance: '96%', parentName: 'Bpk. H. Rahmat Hidayat', parentPhone: '081298761234' },
  { id: '1003', name: 'Andi Darmawan', nis: '1003', grade: 'Batch TOEFL Intensif', status: 'Aktif', gpa: 3.92, email: 'andi.darmawan@bimbel.edu', phone: '081234567892', attendance: '99%', parentName: 'Ibu Ratna Dewi', parentPhone: '081345678901' },
  { id: '1004', name: 'Rina Wijaya', nis: '1004', grade: 'Batch Reguler SMA', status: 'Nonaktif', gpa: 3.10, email: 'rina.wijaya@bimbel.edu', phone: '081234567893', attendance: '82%', parentName: 'Bpk. Agus Wijaya', parentPhone: '081567890123' },
  { id: '1005', name: 'Dewi Lestari', nis: '1005', grade: 'Batch UTBK Soshum', status: 'Aktif', gpa: 3.75, email: 'dewi.lestari@bimbel.edu', phone: '081234567894', attendance: '95%', parentName: 'Ibu Nurhayati', parentPhone: '081789012345' },
  { id: '1006', name: 'Reza Rahardian', nis: '1006', grade: 'Batch UTBK 1', status: 'Aktif', gpa: 3.80, email: 'reza.rahardian@bimbel.edu', phone: '081234567895', attendance: '97%', parentName: 'Bpk. Hendra Rahardian', parentPhone: '081890123456' },
];

export const initialTeachers: Teacher[] = [
  { id: 'G-001', name: 'Drs. Ahmad Yani (Tentor Master)', subject: 'Matematika & TPS', status: 'Aktif', rating: 4.9, classes: 4, email: 'ahmad.yani@bimbel.edu', phone: '081298765430' },
  { id: 'G-002', name: 'Siti Rohmah, M.Pd', subject: 'Literasi Bahasa Indonesia', status: 'Aktif', rating: 4.9, classes: 5, email: 'siti.rohmah@bimbel.edu', phone: '081298765431' },
  { id: 'G-003', name: 'Budi Hartono, S.Si', subject: 'Fisika & Penalaran Sains', status: 'Aktif', rating: 4.8, classes: 3, email: 'budi.hartono@bimbel.edu', phone: '081298765432' },
  { id: 'G-004', name: 'Sri Wahyuni, S.E', subject: 'Ekonomi & Akuntansi UTBK', status: 'Aktif', rating: 4.7, classes: 4, email: 'sri.wahyuni@bimbel.edu', phone: '081298765433' },
];

export const initialLessons: LessonItem[] = [
  {
    id: '201',
    courseId: '2',
    title: 'Listening Part A: Short Conversations',
    moduleTitle: 'Modul 2: Listening Mastery',
    type: 'video',
    duration: '24:10',
    completed: true,
    videoUrl: 'https://www.youtube.com/watch?v=kqtD5dpn9C8',
    images: [
      'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop'
    ],
    documents: [
      { id: 'DOC-1', name: 'Ringkasan_Formula_Listening_Part_A.pdf', type: 'pdf', size: '2.4 MB', url: '#' },
      { id: 'DOC-2', name: 'Latihan_Dialog_Percakapan_Singkat.docx', type: 'docx', size: '1.1 MB', url: '#' }
    ],
    summary: 'Membahas trik kilat menjawab 30 soal Listening Part A TOEFL dengan mendengarkan pembicara kedua.',
    content: 'Fokus utama pada Part A adalah menangkap makna tersirat dari speaker kedua, mengenali idiom umum bahasa Inggris, dan menghindari jebakan kata yang berbunyi mirip.'
  },
  {
    id: '202',
    courseId: '2',
    title: 'Listening Part B: Longer Conversations',
    moduleTitle: 'Modul 2: Listening Mastery',
    type: 'video',
    duration: '18:30',
    completed: false,
    videoUrl: 'https://www.youtube.com/watch?v=aircAruvnKk',
    images: [
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=1200&auto=format&fit=crop'
    ],
    documents: [
      { id: 'DOC-3', name: 'Modul_Eksklusif_Listening_Part_B_LearnSpace+.pdf', type: 'pdf', size: '3.8 MB', url: '#' },
      { id: 'DOC-4', name: 'Lembar_Kerja_Siswa_Sesi_Bimbel.docx', type: 'docx', size: '1.5 MB', url: '#' }
    ],
    summary: 'Strategi menjawab percakapan panjang akademik antara mahasiswa dan profesor.',
    content: 'Dalam percakapan panjang, tentukan topik utama di 2 kalimat pertama. Catat poin-poin penting seperti Who, What, When, Where, dan Why.'
  },
  {
    id: '203',
    courseId: '2',
    title: 'Latihan Listening 1 & Pembahasan Soal',
    moduleTitle: 'Modul 2: Listening Mastery',
    type: 'quiz',
    duration: '30 mins',
    completed: false,
    summary: 'Evaluasi pemahaman Listening Part A dan Part B dengan simulasi tryout.',
  }
];

export const initialCourses: Course[] = [
  { 
    id: 'C-001', 
    title: 'Matematika Dasar & TPS Kuantitatif', 
    category: 'MIPA', 
    status: 'Aktif', 
    instructor: 'Drs. Ahmad Yani (Tentor Master)', 
    students: 140, 
    rating: 4.9, 
    lessons: 10, 
    description: 'Konsep dasar aljabar kilat, logika kuantitatif, dan trik eliminasi pilihan ganda UTBK.',
    videoUrl: 'https://www.youtube.com/watch?v=kqtD5dpn9C8',
    images: ['https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1200&auto=format&fit=crop'],
    documents: [{ id: 'D1', name: 'Formula_Super_TPS_Kuantitatif.pdf', type: 'pdf', size: '2.8 MB', url: '#' }]
  },
  { 
    id: 'C-002', 
    title: 'Bahasa Inggris TOEFL & Literasi Bahasa', 
    category: 'Bahasa', 
    status: 'Aktif', 
    instructor: 'Rina Wulandari (Tutor Ahli)', 
    students: 180, 
    rating: 4.9, 
    lessons: 12, 
    description: 'Strategi menembus skor TOEFL 550+ dan literasi bahasa Inggris tingkat lanjut.',
    videoUrl: 'https://www.youtube.com/watch?v=aircAruvnKk',
    images: ['https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop'],
    documents: [
      { id: 'D2', name: 'Modul_TOEFL_Mastery_Complete.pdf', type: 'pdf', size: '4.5 MB', url: '#' },
      { id: 'D3', name: 'Worksheet_Grammar_Drills.docx', type: 'docx', size: '1.2 MB', url: '#' }
    ]
  },
  { 
    id: 'C-003', 
    title: 'Fisika Kuantum & Penalaran Sains UTBK', 
    category: 'MIPA', 
    status: 'Aktif', 
    instructor: 'Budi Hartono, S.Si', 
    students: 95, 
    rating: 4.8, 
    lessons: 12, 
    description: 'Eksplorasi hukum gerak Newton, termodinamika, dan pemahaman konsep sains fundamental.',
    videoUrl: 'https://www.youtube.com/watch?v=77ZozI0rw7w',
    images: ['https://images.unsplash.com/photo-1507668077129-56e32842fceb?q=80&w=1200&auto=format&fit=crop'],
    documents: [{ id: 'D4', name: 'Rangkuman_Fisika_Intensif.pdf', type: 'pdf', size: '3.1 MB', url: '#' }]
  },
  { 
    id: 'C-004', 
    title: 'Ekonomi & Akuntansi SBMPTN', 
    category: 'IPS', 
    status: 'Aktif', 
    instructor: 'Sri Wahyuni, S.E', 
    students: 110, 
    rating: 4.7, 
    lessons: 8, 
    description: 'Laporan siklus akuntansi, pasar modal, dan trik membedah soal-soal soshum tingkat tinggi.',
    videoUrl: 'https://www.youtube.com/watch?v=aircAruvnKk',
    images: ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop'],
    documents: [{ id: 'D5', name: 'Modul_Ekonomi_Soshum.pdf', type: 'pdf', size: '2.0 MB', url: '#' }]
  },
];

export const initialClasses: Classroom[] = [
  { id: '1', name: 'Batch UTBK 1 (Saintek Intensif)', wali: 'Drs. Ahmad Yani', students: 32, schedule: 'Senin, Rabu, Jumat (16.00 - 18.00)' },
  { id: '2', name: 'Batch Kedinasan 2 (SKD Master)', wali: 'Budi Hartono, S.Si', students: 30, schedule: 'Selasa, Kamis (18.30 - 20.30)' },
  { id: '3', name: 'Batch UTBK Soshum 1', wali: 'Sri Wahyuni, S.E', students: 28, schedule: 'Senin, Kamis (16.00 - 18.00)' },
  { id: '4', name: 'Batch TOEFL & Academic Prep', wali: 'Siti Rohmah, M.Pd', students: 31, schedule: 'Sabtu & Minggu (09.00 - 12.00)' }
];

export const initialTransactions: Transaction[] = [
  { id: 'TRX-001', date: '2024-03-15', description: 'Pembayaran SPP Bimbel Budi Santoso (Batch UTBK 1)', type: 'income', amount: 650000, status: 'Success', category: 'SPP Bimbel' },
  { id: 'TRX-002', date: '2024-03-15', description: 'Pengadaan Modul Cetak & Bank Soal SNBT 2024', type: 'expense', amount: 2500000, status: 'Success', category: 'Modul Belajar' },
  { id: 'TRX-003', date: '2024-03-14', description: 'Pembayaran SPP Bimbel Siti Aminah (Kedinasan)', type: 'income', amount: 650000, status: 'Success', category: 'SPP Bimbel' },
  { id: 'TRX-004', date: '2024-03-14', description: 'Honorarium Tentor Pengampu Tryout Akbar', type: 'expense', amount: 3500000, status: 'Success', category: 'Honor Tentor' },
  { id: 'TRX-005', date: '2024-03-13', description: 'Pendaftaran Paket Belajar Privat 1-on-1', type: 'income', amount: 4500000, status: 'Success', category: 'Paket Belajar' },
  { id: 'TRX-006', date: '2024-03-12', description: 'Lisensi Server Cloud & Aplikasi CBT Bimbel', type: 'expense', amount: 1800000, status: 'Success', category: 'Infrastruktur' },
];

export const initialAssignments: Assignment[] = [
  { id: '1', title: 'Tugas Bedah Soal TPS Penalaran Matematika', type: 'tugas', kelas: 'Batch UTBK 1', subject: 'Matematika & TPS', deadline: '2024-11-25T23:59', description: 'Kerjakan 15 nomor soal analisis penalaran matematika beserta langkah pengerjaan cepat.', submitted: 28, total: 32, status: 'Aktif' },
  { id: '2', title: 'Latihan Mandiri Fisika: Mekanika Fluida', type: 'tugas', kelas: 'Batch Kedinasan 2', subject: 'Fisika', deadline: '2024-11-28T12:00', description: 'Latihan soal fluida statis dan dinamis dengan pembahasan mandiri.', submitted: 15, total: 30, status: 'Aktif' },
  { id: '3', title: 'Tryout Evaluasi TOEFL Listening Part A', type: 'quiz', kelas: 'Batch TOEFL Intensif', subject: 'Bahasa Inggris', deadline: '2024-11-30T10:00', description: 'Quiz 25 butir soal audio listening dengan batas pengerjaan 30 menit.', submitted: 30, total: 32, status: 'Aktif', duration: 30 },
];

export const initialSubmissions: Submission[] = [
  { id: 'SUB-1', assignmentId: '1', studentId: '1001', studentName: 'Budi Santoso', studentNis: '1001', submittedAt: '2024-11-20 14:30', status: 'Dinilai', score: 95, feedback: 'Luar biasa! Cara penyelesaian sangat efisien dan sistematis.', fileName: 'Tugas_TPS_Matematika_Budi_Santoso.pdf' },
  { id: 'SUB-2', assignmentId: '1', studentId: '1002', studentName: 'Siti Aminah', studentNis: '1002', submittedAt: '2024-11-21 09:15', status: 'Perlu Dinilai', score: null, feedback: '', fileName: 'Tugas_TPS_Siti.pdf' },
];

export const initialQuestionPacks: QuestionPack[] = [
  { id: 'QP-001', title: 'Paket Tryout UTBK SNBT - TPS Lengkap', subject: 'TPS & Skolastik', grade: 'SMA/Gapyear', questions: 60, time: '90 Menit', difficulty: 'Sulit' },
  { id: 'QP-002', title: 'Latihan Drills Soal TOEFL ITP Full Sesi', subject: 'Bahasa Inggris', grade: 'Umum/Alumni', questions: 50, time: '60 Menit', difficulty: 'Sedang' },
  { id: 'QP-003', title: 'Simulasi SKD Kedinasan (TIU, TWK, TKP)', subject: 'Kedinasan', grade: 'Persiapan Tes', questions: 110, time: '100 Menit', difficulty: 'Sedang' },
];

export const initialAnnouncements: Announcement[] = [
  { id: 'ANN-001', title: 'Tryout Akbar UTBK SNBT 2024 Gratis Bersama Bimbel Bintang Prestasi', date: '15 Agustus 2024', content: 'Tryout nasional berskala besar dengan sistem Computer Based Test (CBT) dan pembahasan langsung bersama Master Tentor.', category: 'Ujian', author: 'Akademik Bimbel', pinned: true },
  { id: 'ANN-002', title: 'Jadwal Konsultasi Jurusan & Rasionalisasi Nilai SNBP', date: '01 September 2024', content: 'Sesi konsultasi 1-on-1 bersama konselor bimbel untuk memetakan peluang lolos PTN impian Anda.', category: 'Akademik', author: 'Konselor Bimbel', pinned: true },
];

export const initialGrades: GradeItem[] = [
  { id: 'G-1', studentId: '1001', studentName: 'Budi Santoso', studentNis: '1001', class: 'Batch UTBK 1', subject: 'TPS Kuantitatif', tugas: 95, uts: 92, uas: 96, finalScore: 94, letterGrade: 'A+' },
  { id: 'G-2', studentId: '1001', studentName: 'Budi Santoso', studentNis: '1001', class: 'Batch UTBK 1', subject: 'Literasi Bahasa Inggris', tugas: 88, uts: 90, uas: 92, finalScore: 90, letterGrade: 'A' },
  { id: 'G-3', studentId: '1001', studentName: 'Budi Santoso', studentNis: '1001', class: 'Batch UTBK 1', subject: 'Penalaran Sains Fisika', tugas: 86, uts: 88, uas: 90, finalScore: 88, letterGrade: 'A' },
];

export const initialCertificates: CertificateItem[] = [
  { id: 'CERT-001', title: 'Kelulusan Program Intensif UTBK SNBT', date: '12 Okt 2024', issuer: 'LearnSpace+ Education Center', recipientName: 'Budi Santoso', credentialId: 'BV-CERT-2024-88912', gradeScore: 'Skor Prediksi: 720 (Sangat Memuaskan)' },
  { id: 'CERT-002', title: 'English Proficiency Mastery (TOEFL Prep)', date: '05 Sep 2024', issuer: 'LearnSpace+ Language Institute', recipientName: 'Budi Santoso', credentialId: 'BV-CERT-2024-44120', gradeScore: 'Score: 585' },
];

export const initialSchedules: ScheduleItem[] = [
  { id: 'SCH-1', day: 'Senin', subject: 'TPS Kuantitatif & Logika', teacher: 'Drs. Ahmad Yani (Tentor Master)', time: '16:00 - 18:00', room: 'Studio Belajar 1' },
  { id: 'SCH-2', day: 'Senin', subject: 'Fisika Intensif UTBK', teacher: 'Budi Hartono, S.Si', time: '18:30 - 20:30', room: 'Studio Sains' },
  { id: 'SCH-3', day: 'Selasa', subject: 'Literasi Bahasa Indonesia', teacher: 'Siti Rohmah, M.Pd', time: '16:00 - 17:30', room: 'Studio Belajar 2' },
  { id: 'SCH-4', day: 'Rabu', subject: 'TOEFL & Bahasa Inggris', teacher: 'Sarah Jenkins, B.Ed', time: '16:00 - 18:00', room: 'Studio Bahasa' },
  { id: 'SCH-5', day: 'Kamis', subject: 'Kimia & Biologi SBMPTN', teacher: 'Dr. Nurul Hidayah', time: '16:00 - 18:00', room: 'Studio Sains' },
  { id: 'SCH-6', day: 'Jumat', subject: 'Klinik Soal & Konsultasi Belajar', teacher: 'Tim Konselor Bimbel', time: '15:30 - 17:30', room: 'Lounge Konseling' },
];

export const initialAttendanceRecords: AttendanceRecord[] = [
  { id: 'ATT-001', studentId: '1001', studentName: 'Budi Santoso', date: '2024-11-20', time: '16:00 - 18:00', subject: 'TPS Kuantitatif & Logika', tutor: 'Drs. Ahmad Yani', room: 'Studio Belajar 1', status: 'Hadir', topic: 'Trik Cepat Aljabar & Barisan Deret', checkInTime: '15:55 WIB' },
  { id: 'ATT-002', studentId: '1001', studentName: 'Budi Santoso', date: '2024-11-18', time: '18:30 - 20:30', subject: 'Fisika Intensif UTBK', tutor: 'Budi Hartono, S.Si', room: 'Studio Sains', status: 'Hadir', topic: 'Dinamika Rotasi & Kesetimbangan Benda Tegar', checkInTime: '18:25 WIB' },
  { id: 'ATT-003', studentId: '1001', studentName: 'Budi Santoso', date: '2024-11-15', time: '16:00 - 17:30', subject: 'Literasi Bahasa Indonesia', tutor: 'Siti Rohmah, M.Pd', room: 'Studio Belajar 2', status: 'Hadir', topic: 'Analisis Paragraf Kritis & Makna Konteks', checkInTime: '15:58 WIB' },
  { id: 'ATT-004', studentId: '1001', studentName: 'Budi Santoso', date: '2024-11-13', time: '16:00 - 18:00', subject: 'TOEFL & Bahasa Inggris', tutor: 'Sarah Jenkins, B.Ed', room: 'Studio Bahasa', status: 'Izin', topic: 'Listening Part B: Academic Dialogues', checkInTime: '-' },
  { id: 'ATT-005', studentId: '1001', studentName: 'Budi Santoso', date: '2024-11-11', time: '16:00 - 18:00', subject: 'TPS Kuantitatif & Logika', tutor: 'Drs. Ahmad Yani', room: 'Studio Belajar 1', status: 'Hadir', topic: 'Pertidaksamaan Nilai Mutlak & Fungsi Kuadrat', checkInTime: '15:50 WIB' },
  { id: 'ATT-006', studentId: '1001', studentName: 'Budi Santoso', date: '2024-11-08', time: '18:30 - 20:30', subject: 'Fisika Intensif UTBK', tutor: 'Budi Hartono, S.Si', room: 'Studio Sains', status: 'Hadir', topic: 'Hukum Kekekalan Energi & Usaha', checkInTime: '18:20 WIB' },
  { id: 'ATT-007', studentId: '1001', studentName: 'Budi Santoso', date: '2024-11-06', time: '16:00 - 17:30', subject: 'Literasi Bahasa Indonesia', tutor: 'Siti Rohmah, M.Pd', room: 'Studio Belajar 2', status: 'Hadir', topic: 'PUEBI & Tata Kalimat Efektif', checkInTime: '15:52 WIB' },
];

export const initialTuitionPayments: TuitionPayment[] = [
  { id: 'PAY-001', invoiceNo: 'INV-2024-11-001', studentId: '1001', studentName: 'Budi Santoso', period: 'November 2024', description: 'SPP Bimbel Bulanan - Batch UTBK Saintek Intensif', amount: 650000, dueDate: '2024-11-10', paidDate: '2024-11-05 10:30', status: 'Lunas', paymentMethod: 'QRIS BCA' },
  { id: 'PAY-002', invoiceNo: 'INV-2024-10-001', studentId: '1001', studentName: 'Budi Santoso', period: 'Oktober 2024', description: 'SPP Bimbel Bulanan - Batch UTBK Saintek Intensif', amount: 650000, dueDate: '2024-10-10', paidDate: '2024-10-08 14:15', status: 'Lunas', paymentMethod: 'Transfer Virtual Account Mandiri' },
  { id: 'PAY-003', invoiceNo: 'INV-2024-09-001', studentId: '1001', studentName: 'Budi Santoso', period: 'September 2024', description: 'SPP Bimbel Bulanan - Batch UTBK Saintek Intensif + Modul Cetak', amount: 850000, dueDate: '2024-09-10', paidDate: '2024-09-05 09:00', status: 'Lunas', paymentMethod: 'Transfer Bank BRI' },
  { id: 'PAY-004', invoiceNo: 'INV-2024-12-001', studentId: '1001', studentName: 'Budi Santoso', period: 'Desember 2024', description: 'SPP Bimbel Bulanan - Batch UTBK Saintek Intensif', amount: 650000, dueDate: '2024-12-10', paidDate: null, status: 'Belum Dibayar' },
  { id: 'PAY-005', invoiceNo: 'INV-2024-TO-001', studentId: '1001', studentName: 'Budi Santoso', period: 'Desember 2024', description: 'Tiket Tryout Akbar Nasional SNBT 2025 + Analisis IRT', amount: 75000, dueDate: '2024-12-15', paidDate: null, status: 'Belum Dibayar' },
];

export const initialWhatsAppLogs: WhatsAppMessageLog[] = [
  {
    id: 'WA-001',
    recipientName: 'Ibu Sri Handayani',
    recipientPhone: '081234567890',
    studentName: 'Budi Santoso',
    studentGrade: 'Batch UTBK 1',
    category: 'Pengingat SPP',
    message: 'Yth. Ibu Sri Handayani, kami menginfokan tagihan SPP Bimbel ananda Budi Santoso untuk periode Desember 2024 sebesar Rp 650.000 jatuh tempo pd 10 Des 2024. Terima kasih.',
    sentAt: '2024-12-01 09:30 WIB',
    status: 'Terkirim'
  },
  {
    id: 'WA-002',
    recipientName: 'Bpk. H. Rahmat Hidayat',
    recipientPhone: '081298761234',
    studentName: 'Siti Aminah',
    studentGrade: 'Batch Kedinasan 2',
    category: 'Laporan Absensi',
    message: 'Yth. Bpk. H. Rahmat Hidayat, ananda Siti Aminah telah HADIR tepat waktu pada sesi Bimbel SKD Kedinasan materi "TIU & Analogi Logika" hari ini di Studio Belajar 1. Terima kasih.',
    sentAt: '2024-12-02 16:15 WIB',
    status: 'Terkirim'
  },
  {
    id: 'WA-003',
    recipientName: 'Ibu Ratna Dewi',
    recipientPhone: '081345678901',
    studentName: 'Andi Darmawan',
    studentGrade: 'Batch TOEFL Intensif',
    category: 'Pengumuman Tryout',
    message: 'Halo Ibu Ratna Dewi, ananda Andi Darmawan dijadwalkan mengikuti Simulasi Akbar TOEFL ITP Nasional pada hari Sabtu, 14 Des 2024 pukul 09.00 WIB. Mohon dipersiapkan dengan baik.',
    sentAt: '2024-12-03 14:00 WIB',
    status: 'Terkirim'
  },
  {
    id: 'WA-004',
    recipientName: 'Ibu Nurhayati',
    recipientPhone: '081789012345',
    studentName: 'Dewi Lestari',
    studentGrade: 'Batch UTBK Soshum',
    category: 'Evaluasi Belajar',
    message: 'Yth. Ibu Nurhayati, hasil evaluasi Tryout UTBK ke-3 ananda Dewi Lestari telah keluar dengan Prediksi Skor 685 (Masuk Zona Aman PTN Favorit). Laporan lengkap tersedia di portal murid.',
    sentAt: '2024-12-03 17:45 WIB',
    status: 'Terkirim'
  }
];

export const initialInventoryItems: InventoryItem[] = [
  {
    id: 'INV-001',
    itemCode: 'MOD-UTBK-2024',
    name: 'Buku Modul Cetak Master UTBK SNBT 2024 (Saintek + TPS)',
    category: 'Modul & Buku',
    quantity: 120,
    unit: 'Buku',
    location: 'Gudang Modul & Perpustakaan',
    condition: 'Baik',
    purchaseDate: '2024-01-15',
    pricePerUnit: 125000,
    totalValue: 15000000,
    status: 'Tersedia',
    notes: 'Modul kurikulum terbaru edisi SNBT 2024 terlengkap.'
  },
  {
    id: 'INV-002',
    itemCode: 'MOD-TOEFL-01',
    name: 'Buku Panduan & Latihan Soal TOEFL ITP Preparation Edisi 5',
    category: 'Modul & Buku',
    quantity: 65,
    unit: 'Buku',
    location: 'Gudang Modul & Perpustakaan',
    condition: 'Baik',
    purchaseDate: '2024-02-10',
    pricePerUnit: 95000,
    totalValue: 6175000,
    status: 'Tersedia',
    notes: 'Disertai audio listening MP3 via QR Code.'
  },
  {
    id: 'INV-003',
    itemCode: 'ELK-PRJ-EPSON',
    name: 'Proyektor Epson EB-X500 High-Lumen Multimedia',
    category: 'Elektronik & Multimedia',
    quantity: 6,
    unit: 'Unit',
    location: 'Studio Belajar 1 & 2',
    condition: 'Baik',
    purchaseDate: '2023-08-20',
    pricePerUnit: 6200000,
    totalValue: 37200000,
    status: 'Tersedia',
    notes: 'Dipasang di plafon ruang kelas Studio 1, 2, 3, dan Aula Tryout.'
  },
  {
    id: 'INV-004',
    itemCode: 'ELK-STV-65',
    name: 'Smart Interactive Board TV 65 Inch UHD 4K (Digital Whiteboard)',
    category: 'Elektronik & Multimedia',
    quantity: 2,
    unit: 'Unit',
    location: 'Studio Belajar 1 (Utama)',
    condition: 'Baik',
    purchaseDate: '2023-11-05',
    pricePerUnit: 18500000,
    totalValue: 37000000,
    status: 'Tersedia',
    notes: 'Papan tulis interaktif digital untuk pengajaran materi visual tentor.'
  },
  {
    id: 'INV-005',
    itemCode: 'ELK-MIC-PODCAST',
    name: 'Set Wireless Lavalier Microphone & Sound System Studio Zoom',
    category: 'Elektronik & Multimedia',
    quantity: 4,
    unit: 'Set',
    location: 'Studio Hybrid & Podcast Belajar',
    condition: 'Baik',
    purchaseDate: '2024-03-12',
    pricePerUnit: 2400000,
    totalValue: 9600000,
    status: 'Tersedia',
    notes: 'Digunakan untuk sesi live streaming bimbingan belajar online.'
  },
  {
    id: 'INV-006',
    itemCode: 'FAS-MEJA-ERGONOMIC',
    name: 'Set Meja & Kursi Belajar Ergonomis Siswa Bimbel Premium',
    category: 'Fasilitas Studio Kelas',
    quantity: 80,
    unit: 'Set',
    location: 'Studio Belajar 1, 2, 3',
    condition: 'Baik',
    purchaseDate: '2023-06-10',
    pricePerUnit: 650000,
    totalValue: 52000000,
    status: 'Tersedia',
    notes: 'Dilengkapi colokan stop kontak dan sandaran empuk.'
  },
  {
    id: 'INV-007',
    itemCode: 'FAS-AC-DAIKIN',
    name: 'AC Inverter Daikin 2 PK Multi-Split Studio',
    category: 'Fasilitas Studio Kelas',
    quantity: 6,
    unit: 'Unit',
    location: 'Seluruh Studio Belajar & Kantor',
    condition: 'Perlu Perbaikan',
    purchaseDate: '2023-05-18',
    pricePerUnit: 4500000,
    totalValue: 27000000,
    status: 'Tersedia',
    notes: '1 unit di Studio 2 perlu servis cuci filter & pengisian freon.'
  },
  {
    id: 'INV-008',
    itemCode: 'ATK-KERTAS-A4',
    name: 'Kertas HVS PaperOne A4 80gr untuk Lembar Soal Tryout',
    category: 'ATK & Operasional',
    quantity: 45,
    unit: 'Rim',
    location: 'Ruang Cetak & Front Office',
    condition: 'Baik',
    purchaseDate: '2024-11-01',
    pricePerUnit: 52000,
    totalValue: 2340000,
    status: 'Tersedia',
    notes: 'Stok pencetakan lembar kerja latihan rutin dan tryout mingguan.'
  },
  {
    id: 'INV-009',
    itemCode: 'MERCH-GOODIE-BAG',
    name: 'Starter Kit Bimbel: Goodie Bag, Tumbler & Binder Binderverse',
    category: 'Perlengkapan Belajar',
    quantity: 90,
    unit: 'Pcs',
    location: 'Front Office & Ruang Konseling',
    condition: 'Baik',
    purchaseDate: '2024-01-20',
    pricePerUnit: 85000,
    totalValue: 7650000,
    status: 'Tersedia',
    notes: 'Paket merchandise selamat datang untuk siswa pendaftar baru.'
  }
];

export const initialSchoolSettings: SchoolSettings = {
  schoolName: 'Bimbel Bintang Prestasi (LearnSpace+ Indonesia)',
  address: 'Jl. Pemuda Pendidikan No. 88, Jakarta Selatan, DKI Jakarta 12430',
  academicYear: '2024/2025 - Program Persiapan UTBK & Kedinasan',
  phone: '(021) 7890-1234 / 0812-9988-7766',
  email: 'halo@LearnSpace+.id',
  principalName: 'Dr. H. Muhammad Ridwan, M.Pd. (Direktur Bimbel)',
  website: 'https://LearnSpace+.id',
};

export const useDataStore = create<DataState>()(
  persist(
    (set) => ({
      students: initialStudents,
      teachers: initialTeachers,
      courses: initialCourses,
      lessons: initialLessons,
      classes: initialClasses,
      transactions: initialTransactions,
      assignments: initialAssignments,
      submissions: initialSubmissions,
      questionPacks: initialQuestionPacks,
      announcements: initialAnnouncements,
      grades: initialGrades,
      certificates: initialCertificates,
      schedules: initialSchedules,
      attendanceLogs: initialAttendanceRecords,
      tuitionPayments: initialTuitionPayments,
      whatsAppLogs: initialWhatsAppLogs,
      inventoryItems: initialInventoryItems,
      schoolSettings: initialSchoolSettings,

      // Students
      addStudent: (student) => set((state) => {
        const nextId = (Math.max(1000, ...state.students.map(s => parseInt(s.id) || 0)) + 1).toString();
        return { students: [ { ...student, id: nextId }, ...state.students] };
      }),
      updateStudent: (id, updatedFields) => set((state) => ({
        students: state.students.map((s) => s.id === id ? { ...s, ...updatedFields } : s)
      })),
      deleteStudent: (id) => set((state) => ({
        students: state.students.filter((s) => s.id !== id)
      })),

      // Teachers
      addTeacher: (teacher) => set((state) => {
        const nextNum = Math.max(0, ...state.teachers.map(t => parseInt(t.id.replace('G-', '')) || 0)) + 1;
        const id = `G-${String(nextNum).padStart(3, '0')}`;
        return { teachers: [{ ...teacher, id }, ...state.teachers] };
      }),
      updateTeacher: (id, updatedFields) => set((state) => ({
        teachers: state.teachers.map((t) => t.id === id ? { ...t, ...updatedFields } : t)
      })),
      deleteTeacher: (id) => set((state) => ({
        teachers: state.teachers.filter((t) => t.id !== id)
      })),

      // Courses
      addCourse: (course) => set((state) => {
        const nextNum = Math.max(0, ...state.courses.map(c => parseInt(c.id.replace('C-', '')) || 0)) + 1;
        const id = `C-${String(nextNum).padStart(3, '0')}`;
        return { courses: [{ ...course, id }, ...state.courses] };
      }),
      updateCourse: (id, updatedFields) => set((state) => ({
        courses: state.courses.map((c) => c.id === id ? { ...c, ...updatedFields } : c)
      })),
      deleteCourse: (id) => set((state) => ({
        courses: state.courses.filter((c) => c.id !== id)
      })),

      // Lessons
      updateLesson: (id, updatedFields) => set((state) => ({
        lessons: state.lessons.map((l) => l.id === id ? { ...l, ...updatedFields } : l)
      })),

      // Classes
      addClassroom: (classroom) => set((state) => {
        const id = (Math.max(0, ...state.classes.map(c => parseInt(c.id) || 0)) + 1).toString();
        return { classes: [...state.classes, { ...classroom, id }] };
      }),
      updateClassroom: (id, updatedFields) => set((state) => ({
        classes: state.classes.map((c) => c.id === id ? { ...c, ...updatedFields } : c)
      })),
      deleteClassroom: (id) => set((state) => ({
        classes: state.classes.filter((c) => c.id !== id)
      })),

      // Transactions
      addTransaction: (transaction) => set((state) => {
        const nextNum = Math.max(0, ...state.transactions.map(t => parseInt(t.id.replace('TRX-', '')) || 0)) + 1;
        const id = `TRX-${String(nextNum).padStart(3, '0')}`;
        return { transactions: [{ ...transaction, id }, ...state.transactions] };
      }),
      updateTransaction: (id, updatedFields) => set((state) => ({
        transactions: state.transactions.map((t) => t.id === id ? { ...t, ...updatedFields } : t)
      })),
      deleteTransaction: (id) => set((state) => ({
        transactions: state.transactions.filter((t) => t.id !== id)
      })),

      // Assignments
      addAssignment: (assignment) => set((state) => {
        const id = (Math.max(0, ...state.assignments.map(a => parseInt(a.id) || 0)) + 1).toString();
        return { assignments: [{ ...assignment, id }, ...state.assignments] };
      }),
      updateAssignment: (id, updatedFields) => set((state) => ({
        assignments: state.assignments.map((a) => a.id === id ? { ...a, ...updatedFields } : a)
      })),
      deleteAssignment: (id) => set((state) => ({
        assignments: state.assignments.filter((a) => a.id !== id)
      })),

      // Submissions
      addSubmission: (submission) => set((state) => {
        const nextNum = state.submissions.length + 1;
        const id = `SUB-${nextNum}`;
        const newSubmissions = [ ...state.submissions.filter(s => !(s.assignmentId === submission.assignmentId && s.studentId === submission.studentId)), { ...submission, id } ];
        const targetAssign = state.assignments.find(a => a.id === submission.assignmentId);
        const updatedAssignments = targetAssign
          ? state.assignments.map(a => a.id === submission.assignmentId ? { ...a, submitted: Math.min(a.total, a.submitted + 1) } : a)
          : state.assignments;
        return { submissions: newSubmissions, assignments: updatedAssignments };
      }),
      gradeSubmission: (id, score, feedback) => set((state) => ({
        submissions: state.submissions.map((s) => s.id === id ? { ...s, score, feedback: feedback || s.feedback, status: 'Dinilai' } : s)
      })),

      // Question Packs
      addQuestionPack: (pack) => set((state) => {
        const nextNum = Math.max(0, ...state.questionPacks.map(q => parseInt(q.id.replace('QP-', '')) || 0)) + 1;
        const id = `QP-${String(nextNum).padStart(3, '0')}`;
        return { questionPacks: [{ ...pack, id }, ...state.questionPacks] };
      }),
      updateQuestionPack: (id, updatedFields) => set((state) => ({
        questionPacks: state.questionPacks.map((q) => q.id === id ? { ...q, ...updatedFields } : q)
      })),
      deleteQuestionPack: (id) => set((state) => ({
        questionPacks: state.questionPacks.filter((q) => q.id !== id)
      })),

      // Announcements
      addAnnouncement: (ann) => set((state) => {
        const nextNum = Math.max(0, ...state.announcements.map(a => parseInt(a.id.replace('ANN-', '')) || 0)) + 1;
        const id = `ANN-${String(nextNum).padStart(3, '0')}`;
        return { announcements: [{ ...ann, id }, ...state.announcements] };
      }),
      updateAnnouncement: (id, updatedFields) => set((state) => ({
        announcements: state.announcements.map((a) => a.id === id ? { ...a, ...updatedFields } : a)
      })),
      deleteAnnouncement: (id) => set((state) => ({
        announcements: state.announcements.filter((a) => a.id !== id)
      })),

      // Grades
      updateGrade: (id, updatedFields) => set((state) => ({
        grades: state.grades.map((g) => {
          if (g.id === id) {
            const updated = { ...g, ...updatedFields };
            const finalScore = Math.round((updated.tugas * 0.3) + (updated.uts * 0.3) + (updated.uas * 0.4));
            let letterGrade = 'E';
            if (finalScore >= 90) letterGrade = 'A+';
            else if (finalScore >= 85) letterGrade = 'A';
            else if (finalScore >= 80) letterGrade = 'A-';
            else if (finalScore >= 75) letterGrade = 'B+';
            else if (finalScore >= 70) letterGrade = 'B';
            else if (finalScore >= 60) letterGrade = 'C';
            else if (finalScore >= 50) letterGrade = 'D';
            return { ...updated, finalScore, letterGrade };
          }
          return g;
        })
      })),

      // Schedules
      addSchedule: (sch) => set((state) => {
        const id = `SCH-${state.schedules.length + 1}`;
        return { schedules: [...state.schedules, { ...sch, id }] };
      }),
      deleteSchedule: (id) => set((state) => ({
        schedules: state.schedules.filter((s) => s.id !== id)
      })),

      // Attendance
      addAttendanceRecord: (record) => set((state) => {
        const id = `ATT-${String(state.attendanceLogs.length + 1).padStart(3, '0')}`;
        return { attendanceLogs: [{ ...record, id }, ...state.attendanceLogs] };
      }),
      addBatchAttendanceRecords: (records) => set((state) => {
        let currentCount = state.attendanceLogs.length;
        const newRecordsWithId = records.map((rec) => {
          currentCount += 1;
          return {
            ...rec,
            id: `ATT-${String(currentCount).padStart(3, '0')}`
          };
        });
        return { attendanceLogs: [...newRecordsWithId, ...state.attendanceLogs] };
      }),

      // Tuition Payments
      payTuition: (id, method) => set((state) => {
        const nowStr = new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });
        const targetPayment = state.tuitionPayments.find(p => p.id === id);
        
        // If payment found, create corresponding transaction
        let updatedTransactions = state.transactions;
        if (targetPayment) {
          const nextTrxId = `TRX-${String(state.transactions.length + 1).padStart(3, '0')}`;
          const newTrx: Transaction = {
            id: nextTrxId,
            date: new Date().toISOString().split('T')[0],
            description: `Pembayaran ${targetPayment.description} via ${method}`,
            type: 'income',
            amount: targetPayment.amount,
            status: 'Success',
            category: 'SPP Bimbel'
          };
          updatedTransactions = [newTrx, ...state.transactions];
        }

        return {
          tuitionPayments: state.tuitionPayments.map((p) =>
            p.id === id ? { ...p, status: 'Lunas', paidDate: nowStr, paymentMethod: method } : p
          ),
          transactions: updatedTransactions
        };
      }),
      addTuitionPayment: (payment) => set((state) => {
        const id = `PAY-${String(state.tuitionPayments.length + 1).padStart(3, '0')}`;
        return { tuitionPayments: [{ ...payment, id }, ...state.tuitionPayments] };
      }),
      updateTuitionPayment: (id, updatedFields) => set((state) => ({
        tuitionPayments: state.tuitionPayments.map((p) => p.id === id ? { ...p, ...updatedFields } : p)
      })),

      // School / Bimbel Settings
      updateSchoolSettings: (settings) => set((state) => ({
        schoolSettings: { ...state.schoolSettings, ...settings }
      })),

      // WhatsApp Notifications
      sendWhatsAppMessage: (log) => set((state) => {
        const id = `WA-${String(state.whatsAppLogs.length + 1).padStart(3, '0')}`;
        return { whatsAppLogs: [{ ...log, id }, ...state.whatsAppLogs] };
      }),

      // Inventory CRUD
      addInventoryItem: (item) => set((state) => {
        const id = `INV-${String(state.inventoryItems.length + 1).padStart(3, '0')}`;
        return { inventoryItems: [{ ...item, id }, ...state.inventoryItems] };
      }),
      updateInventoryItem: (id, item) => set((state) => ({
        inventoryItems: state.inventoryItems.map((i) => i.id === id ? { ...i, ...item } : i)
      })),
      deleteInventoryItem: (id) => set((state) => ({
        inventoryItems: state.inventoryItems.filter((i) => i.id !== id)
      })),

      // Reset to Default
      resetToDefaultData: () => set({
        students: initialStudents,
        teachers: initialTeachers,
        courses: initialCourses,
        lessons: initialLessons,
        classes: initialClasses,
        transactions: initialTransactions,
        assignments: initialAssignments,
        submissions: initialSubmissions,
        questionPacks: initialQuestionPacks,
        announcements: initialAnnouncements,
        grades: initialGrades,
        certificates: initialCertificates,
        schedules: initialSchedules,
        attendanceLogs: initialAttendanceRecords,
        tuitionPayments: initialTuitionPayments,
        whatsAppLogs: initialWhatsAppLogs,
        inventoryItems: initialInventoryItems,
        schoolSettings: initialSchoolSettings,
      }),
    }),
    {
      name: 'LearnSpace+-app-data',
    }
  )
);
