// Data contoh portal Tutor LearnSpace+ (mengikuti mockup klien "Akses Tutor / LMS Web").
import type { Session, Tone } from '../components/portal/Kit';

export const TUTOR = {
  name: 'Budi Santoso, S.Pd', firstName: 'Budi', role: 'Guru', org: 'StudyHack Education', email: 'budi.santoso@studyhack.id', phone: '0812-3456-7890',
  education: 'S1 Pendidikan Matematika', joined: '15 Juli 2023', avatar: '/assets/portal/tutor-budi.png', term: 'TA 2026/2027 · Semester 1', today: 'Rabu, 19 Agustus 2026',
};

export interface TutorClass { id: string; name: string; code: string; subject: string; days: string; time: string; students: number; status: 'Aktif' | 'Akan Datang' | 'Selesai'; tone: Tone }
export const CLASSES: TutorClass[] = [
  { id: '1', name: 'Batch UTBK 1', code: 'KLS-UTBK1', subject: 'Matematika', days: 'Sen, Rab, Jum', time: '14.00 – 15.30', students: 32, status: 'Aktif', tone: 'blue' },
  { id: '2', name: 'Batch Kedinasan 2', code: 'KLS-KED2', subject: 'Fisika', days: 'Sel, Kamis', time: '18.30 – 20.30', students: 28, status: 'Aktif', tone: 'green' },
  { id: '3', name: 'Batch English Level 1', code: 'KLS-ENG1', subject: 'Bahasa Inggris', days: 'Sen, Rab', time: '16.00 – 17.30', students: 24, status: 'Aktif', tone: 'purple' },
  { id: '4', name: 'Batch XI RPL', code: 'KLS-XIRPL', subject: 'Matematika', days: 'Sen, Kamis', time: '16.00 – 18.00', students: 30, status: 'Aktif', tone: 'orange' },
  { id: '5', name: 'Batch UTBK 2', code: 'KLS-UTBK2', subject: 'Matematika', days: 'Sel, Jum', time: '14.00 – 15.30', students: 0, status: 'Akan Datang', tone: 'blue' },
  { id: '6', name: 'Batch Kedinasan 1', code: 'KLS-KED1', subject: 'Fisika', days: 'Sel, Kamis', time: '18.30 – 20.30', students: 26, status: 'Selesai', tone: 'green' },
];
export const ACTIVE_CLASSES = CLASSES.filter((c) => c.status === 'Aktif');
export const CLASS_NAMES = ACTIVE_CLASSES.map((c) => c.name);

export const TODAY_CLASSES = [
  { time: '07.15 - 08.45', kelas: 'Batch UTBK 1', subject: 'Matematika', status: 'Berlangsung', action: 'Buka Kelas', classId: '1' },
  { time: '09.00 - 10.30', kelas: 'Batch Kedinasan 2', subject: 'Fisika', status: '30 menit lagi', action: 'Siapkan', classId: '2' },
  { time: '13.00 - 14.30', kelas: 'English Level 1', subject: 'Bahasa Inggris', status: '2 jam lagi', action: 'Detail', classId: '3' },
  { time: '16.00 - 18.00', kelas: 'Batch XI RPL', subject: 'Matematika', status: '3 jam lagi', action: 'Detail', classId: '4' },
];

/* ---------- Jadwal mengajar ---------- */
export const TEACH_DAYS = [
  { name: 'Sen', date: '11 Agt' }, { name: 'Sel', date: '12 Agt' }, { name: 'Rab', date: '13 Agt' }, { name: 'Kam', date: '14 Agt' },
  { name: 'Jum', date: '15 Agt' }, { name: 'Sab', date: '16 Agt' }, { name: 'Min', date: '17 Agt' },
];
export const TEACH_SLOTS = ['09.00 – 10.30', '11.00 – 12.30', '13.00 – 14.30', '14.00 – 15.30', '16.00 – 18.00', '18.30 – 20.30'];
const SUBJECT_TONE: Record<string, Tone> = { 'Batch UTBK 1': 'green', 'Batch Kedinasan 2': 'teal', 'English Level 1': 'purple', 'Batch XI RPL': 'orange' };
// [hari, slot, mapel, kelas, ruang, penanda]
const RAW: [number, number, string, string, string, ('next' | 'clash')?][] = [
  [0, 0, 'Matematika', 'Batch UTBK 1', 'Studio Belajar 1'], [0, 2, 'Bahasa Inggris', 'English Level 1', 'Studio Belajar 2'], [0, 4, 'Matematika', 'Batch XI RPL', 'Studio Belajar 1'],
  [1, 5, 'Fisika', 'Batch Kedinasan 2', 'Lab IPA'],
  [2, 0, 'Matematika', 'Batch UTBK 1', 'Studio Belajar 1'], [2, 3, 'Matematika', 'Batch UTBK 1', 'Studio Belajar 1', 'next'], [2, 4, 'Bahasa Inggris', 'English Level 1', 'Studio Belajar 2'],
  [2, 5, 'Matematika', 'Batch XI RPL', 'Studio Belajar 1', 'clash'],
  [3, 0, 'Bahasa Inggris', 'English Level 1', 'Studio Belajar 2'], [3, 4, 'Matematika', 'Batch XI RPL', 'Studio Belajar 1'],
  [4, 0, 'Matematika', 'Batch UTBK 1', 'Studio Belajar 1'], [4, 1, 'Matematika', 'Batch UTBK 1', 'Studio Belajar 1'],
  [6, 5, 'Fisika', 'Batch Kedinasan 2', 'Lab IPA'],
];
export interface TeachSession extends Session { subject: string; kelas: string; room: string; mark?: 'next' | 'clash' }
export const TEACH_SESSIONS: TeachSession[] = RAW.map(([day, slot, subject, kelas, room, mark], i) => ({
  id: `S${i + 1}`, day, slot, subject, kelas, room, mark, title: subject, lines: [kelas, TEACH_SLOTS[slot]], tone: mark === 'clash' ? 'red' : SUBJECT_TONE[kelas] ?? 'blue',
}));

/* ---------- Materi ---------- */
export interface MaterialRow { id: string; kelas: string; subject: string; students: number; status: 'Published' | 'Draft'; last: string; date: string; progress: number; done: number; planned: number; color: string }
export const MATERIALS: MaterialRow[] = [
  { id: 'M1', kelas: 'Batch UTBK 1', subject: 'Matematika', students: 32, status: 'Published', last: 'Persamaan Linear', date: '10 Agustus 2026', progress: 82, done: 3, planned: 4, color: '#16A34A' },
  { id: 'M2', kelas: 'Batch Kedinasan 2', subject: 'Fisika', students: 28, status: 'Published', last: 'Hukum Newton', date: '9 Agustus 2026', progress: 74, done: 2, planned: 3, color: '#7C3AED' },
  { id: 'M3', kelas: 'English Level 1', subject: 'Bahasa Inggris', students: 24, status: 'Published', last: 'Vocabulary – Daily Activity', date: '9 Agustus 2026', progress: 90, done: 4, planned: 4, color: '#F59E0B' },
  { id: 'M4', kelas: 'Batch XI RPL', subject: 'Matematika', students: 30, status: 'Draft', last: 'Fungsi Trigonometri', date: '6 Agustus 2026', progress: 60, done: 1, planned: 3, color: '#1D4ED8' },
];
export const MODULES = [
  { id: 'MD1', title: 'Modul Aljabar & Persamaan Linear', kelas: 'Batch UTBK 1', topics: 6, updated: '10 Agustus 2026', status: 'Published' },
  { id: 'MD2', title: 'Modul Mekanika: Hukum Newton', kelas: 'Batch Kedinasan 2', topics: 5, updated: '9 Agustus 2026', status: 'Published' },
  { id: 'MD3', title: 'Modul Vocabulary & Daily Conversation', kelas: 'English Level 1', topics: 8, updated: '9 Agustus 2026', status: 'Published' },
  { id: 'MD4', title: 'Modul Trigonometri Dasar', kelas: 'Batch XI RPL', topics: 4, updated: '6 Agustus 2026', status: 'Draft' },
];

/* ---------- Siswa ---------- */
export interface TutorStudent { id: string; name: string; kelas: string; subject: string; attendance: number; score: number; progress: number; avatar?: string }
const ts = (id: string, name: string, kelas: string, subject: string, attendance: number, score: number, progress: number): TutorStudent => ({ id, name, kelas, subject, attendance, score, progress });
export const MY_STUDENTS: TutorStudent[] = [
  ts('2024001', 'Andi Pratama', 'Batch UTBK 1', 'Matematika', 92, 85.3, 90),
  ts('2024002', 'Siti Aisyah', 'Batch Kedinasan 2', 'Fisika', 88, 78.6, 82),
  ts('2024003', 'Budi Santoso Jr.', 'Batch English Level 1', 'Bahasa Inggris', 75, 72.1, 61),
  ts('2024004', 'Citra Dewi', 'Batch XI RPL', 'Matematika', 95, 89.4, 92),
  ts('2024005', 'Rizky Maulana', 'Batch UTBK 1', 'Matematika', 60, 65.2, 58),
  ts('2024006', 'Nabila Putri', 'Batch Kedinasan 2', 'Bahasa Inggris', 90, 87.9, 55),
  ts('2024007', 'Fauzan Akbar', 'Batch UTBK 1', 'Matematika', 70, 71.5, 68),
  ts('2024008', 'Reza Rahardian', 'Batch English Level 1', 'Bahasa Inggris', 85, 81.2, 80),
  ts('2024009', 'Dinda Ayu', 'Batch XI RPL', 'Matematika', 96, 92.4, 94),
  ts('2024010', 'Galih Permana', 'Batch UTBK 1', 'Matematika', 82, 76.8, 74),
  ts('2024011', 'Hana Salsabila', 'Batch Kedinasan 2', 'Fisika', 93, 90.1, 88),
  ts('2024012', 'Ilham Ramadhan', 'Batch XI RPL', 'Matematika', 68, 66.4, 59),
];
export const studentStatus = (s: TutorStudent) => (s.score < 75 || s.attendance < 76 ? 'Perlu Perhatian' : 'Aktif');
export const gradeStatus = (s: TutorStudent) => (s.score >= 90 ? 'Sangat Baik' : s.score >= 72 ? 'Baik' : 'Perlu Perhatian');

/* ---------- Presensi ---------- */
export type Presence = 'Hadir' | 'Terlambat' | 'Izin' | 'Sakit' | 'Alpa';
export const PRESENCE_COLOR: Record<Presence, string> = { Hadir: '#16A34A', Terlambat: '#F97316', Izin: '#F59E0B', Sakit: '#1D4ED8', Alpa: '#EF4444' };
export interface PresenceRow { id: string; name: string; status: Presence; note: string; time: string }
const pc = (id: string, name: string, status: Presence, note = '', time = '14.00'): PresenceRow => ({ id, name, status, note, time: status === 'Hadir' || status === 'Terlambat' ? time : '' });
export const PRESENCE: PresenceRow[] = [
  pc('2024001', 'Andi Pratama', 'Hadir'), pc('2024002', 'Siti Aisyah', 'Terlambat', 'Terlambat 10 menit', '14.10'), pc('2024003', 'Budi Santoso', 'Hadir'),
  pc('2024004', 'Citra Dewi', 'Izin', 'Izin keluarga'), pc('2024005', 'Rizky Maulana', 'Sakit', 'Sakit (demam)'), pc('2024006', 'Nabila Putri', 'Hadir'),
  pc('2024007', 'Fauzan Akbar', 'Alpa'), pc('2024008', 'Reza Rahardian', 'Terlambat', 'Terlambat 15 menit', '14.15'), pc('2024009', 'Dinda Ayu', 'Hadir'),
  pc('2024010', 'Galih Permana', 'Hadir'), pc('2024011', 'Hana Salsabila', 'Hadir'), pc('2024012', 'Ilham Ramadhan', 'Hadir'),
];

/* ---------- Siswa perlu perhatian ---------- */
export type Risk = 'Risiko Tinggi' | 'Risiko Sedang' | 'Membaik' | 'Remedial Aktif';
export interface AttentionRow { id: string; name: string; kelas: string; subject: string; issue: string; issueSub: string; stats: [string, string][]; risk: Risk; trend: number; note: string }
export const ATTENTION: AttentionRow[] = [
  { id: '2024005', name: 'Rizky Maulana', kelas: 'Batch UTBK 1', subject: 'Matematika', issue: 'Nilai rendah', issueSub: 'Performa di bawah standar', stats: [['Nilai rata-rata', '65,2'], ['Kehadiran', '60%']], risk: 'Risiko Tinggi', trend: -12, note: 'Kehadiran rendah' },
  { id: '2024003', name: 'Budi Santoso Jr.', kelas: 'Batch English Level 1', subject: 'Bahasa Inggris', issue: 'Progress rendah', issueSub: 'Perkembangan belajar lambat', stats: [['Progress Belajar', '61%'], ['Nilai rata-rata', '78,6']], risk: 'Risiko Sedang', trend: -8, note: 'Tugas belum selesai' },
  { id: '2024006', name: 'Nabila Putri', kelas: 'Batch Kedinasan 2', subject: 'Bahasa Inggris', issue: 'Tugas belum selesai', issueSub: 'Beberapa tugas belum dikumpulkan', stats: [['Tugas belum dikumpulkan', '3 tugas']], risk: 'Risiko Tinggi', trend: -7, note: 'Speaking rendah' },
  { id: '2024007', name: 'Fauzan Akbar', kelas: 'Batch UTBK 1', subject: 'Matematika', issue: 'Nilai di bawah KKM', issueSub: 'Belum mencapai standar KKM', stats: [['Nilai rata-rata', '71,5']], risk: 'Risiko Sedang', trend: -5, note: 'Nilai di bawah KKM' },
  { id: '2024002', name: 'Siti Aisyah', kelas: 'Batch Kedinasan 2', subject: 'Fisika', issue: 'Membaik', issueSub: 'Perkembangan positif', stats: [['Nilai rata-rata', '86,7'], ['Progress Belajar', 'Meningkat']], risk: 'Membaik', trend: 6, note: 'Intervensi berhasil' },
  { id: '2024001', name: 'Andi Pratama', kelas: 'Batch UTBK 1', subject: 'Matematika', issue: 'Remedial aktif', issueSub: 'Sedang menjalani program remedial', stats: [['Program Remedial', 'Aktif'], ['Progress Remedial', '65%']], risk: 'Remedial Aktif', trend: 3, note: 'Remedial berjalan' },
  { id: '2024012', name: 'Ilham Ramadhan', kelas: 'Batch XI RPL', subject: 'Matematika', issue: 'Kehadiran rendah', issueSub: 'Sering tidak hadir tanpa keterangan', stats: [['Kehadiran', '68%'], ['Nilai rata-rata', '66,4']], risk: 'Risiko Tinggi', trend: -9, note: 'Kehadiran rendah' },
];

/* ---------- Bank soal ---------- */
export interface QuestionRow { id: string; text: string; type: 'Pilihan Ganda' | 'Uraian'; subject: string; topic: string; grade: string; level: 'Mudah' | 'Sedang' | 'Sulit'; mine: boolean; fav: boolean }
const qs = (n: number, text: string, type: QuestionRow['type'], subject: string, topic: string, grade: string, level: QuestionRow['level'], mine = false): QuestionRow =>
  ({ id: `Q${n}`, text, type, subject, topic, grade, level, mine, fav: false });
export const QUESTIONS: QuestionRow[] = [
  qs(1, 'Jika 48 + 27 = ?', 'Pilihan Ganda', 'Matematika', 'Penjumlahan', 'SD 1', 'Mudah', true),
  qs(2, 'Choose the correct word to complete the sentence: She ___ to school every day.', 'Pilihan Ganda', 'Bahasa Inggris', 'Present Simple', 'SD 2', 'Sedang'),
  qs(3, 'Benda yang dapat ditarik magnet adalah ...', 'Pilihan Ganda', 'IPA', 'Gaya Magnet', 'SD 3', 'Mudah'),
  qs(4, 'Bacalah teks berikut, kemudian jawablah pertanyaan di bawahnya!', 'Uraian', 'Bahasa Indonesia', 'Teks Bacaan', 'SD 4', 'Sulit'),
  qs(5, 'Tentukan keliling persegi panjang berikut jika panjang = 12 cm dan lebar = 7 cm.', 'Uraian', 'Matematika', 'Keliling Bangun Datar', 'SD 5', 'Sedang', true),
  qs(6, 'Sebutkan 3 faktor yang mempengaruhi perubahan iklim!', 'Uraian', 'IPA', 'Perubahan Iklim', 'SD 6', 'Sulit'),
  qs(7, 'Hasil dari 3x + 5 = 20 adalah x = ...', 'Pilihan Ganda', 'Matematika', 'Persamaan Linear', 'SMP 7', 'Sedang', true),
  qs(8, 'Sebuah benda bermassa 2 kg diberi gaya 10 N. Berapakah percepatannya?', 'Pilihan Ganda', 'Fisika', 'Hukum Newton', 'SMA 10', 'Sedang', true),
  qs(9, 'Write a short paragraph about your daily activity.', 'Uraian', 'Bahasa Inggris', 'Writing', 'SMP 8', 'Sedang'),
  qs(10, 'Nilai sin 30° + cos 60° adalah ...', 'Pilihan Ganda', 'Matematika', 'Trigonometri', 'SMA 11', 'Mudah', true),
  qs(11, 'Jelaskan perbedaan fotosintesis dan respirasi pada tumbuhan!', 'Uraian', 'IPA', 'Fotosintesis', 'SMP 7', 'Sulit'),
  qs(12, 'Tentukan ide pokok paragraf kedua pada teks di atas.', 'Pilihan Ganda', 'Bahasa Indonesia', 'Ide Pokok', 'SMP 9', 'Mudah'),
];

/* ---------- AI bahan ajar ---------- */
export const AI_TYPES = ['Worksheet', 'Modul', 'Quiz / Soal', 'Presentasi', 'RPP / ATP', 'Infografis', 'Lainnya'];
export interface AiResult { id: string; title: string; subject: string; grade: string; type: string; created: string; date: string; fav: boolean; body: string }
export const AI_RESULTS: AiResult[] = [
  { id: 'A1', title: 'Worksheet Penjumlahan Hasil hingga 100', subject: 'Matematika', grade: 'Kelas 2 SD', type: 'Worksheet', created: 'Dibuat hari ini', date: '15 Mei 2026, 10:30', fav: true, body: '15 soal penjumlahan dua bilangan dengan hasil hingga 100, tingkat kesulitan bertahap, dilengkapi kunci jawaban.' },
  { id: 'A2', title: 'Modul Penjumlahan Dua Bilangan', subject: 'Matematika', grade: 'Kelas 2 SD', type: 'Modul', created: 'Dibuat kemarin', date: '15 Mei 2026, 09:15', fav: false, body: 'Modul konsep penjumlahan bersusun: tujuan belajar, contoh soal, latihan terbimbing, dan refleksi.' },
  { id: 'A3', title: 'Quiz Penjumlahan Dua Bilangan', subject: 'Matematika', grade: 'Kelas 2 SD', type: 'Quiz / Soal', created: 'Dibuat 2 hari lalu', date: '14 Mei 2026, 11:20', fav: false, body: '10 soal pilihan ganda penjumlahan dua bilangan beserta pembahasan singkat.' },
  { id: 'A4', title: 'PPT Penjumlahan Dua Bilangan', subject: 'Matematika', grade: 'Kelas 2 SD', type: 'Presentasi', created: 'Dibuat 3 hari lalu', date: '13 Mei 2026, 16:45', fav: false, body: 'Kerangka 8 slide: apersepsi, konsep, contoh, latihan bersama, kuis cepat, dan rangkuman.' },
  { id: 'A5', title: 'Rubrik Penilaian Matematika', subject: 'Matematika', grade: 'Kelas 2 SD', type: 'Lainnya', created: 'Dibuat 4 hari lalu', date: '12 Mei 2026, 08:50', fav: false, body: 'Rubrik 4 kriteria (pemahaman konsep, ketepatan hitung, langkah pengerjaan, kerapian) dengan skala 1–4.' },
];

/* ---------- Pengumuman ---------- */
export interface AnnouncementRow { id: string; title: string; body: string; date: string; author: string; category: 'Pengumuman' | 'Kegiatan Sekolah' | 'Informasi' | 'Agenda' | 'Tugas'; important?: boolean; unread: boolean; tone: Tone }
export const ANNOUNCEMENTS: AnnouncementRow[] = [
  { id: 'P1', title: 'Libur Nasional HUT RI ke-81 🇮🇩', body: 'Kelas akan libur pada Minggu, 17 Agustus 2026. Kelas akan kembali berjalan normal pada Senin, 18 Agustus 2026.', date: '14 Agu 2026', author: 'Admin', category: 'Pengumuman', important: true, unread: true, tone: 'red' },
  { id: 'P2', title: 'StudyHack English Speaking Day 📢', body: 'Ayo tingkatkan kemampuan speaking-mu! Akan ada games, sharing, dan hadiah menarik.', date: '12 Agu 2026', author: 'Teacher Fitri', category: 'Kegiatan Sekolah', unread: true, tone: 'green' },
  { id: 'P3', title: 'Pembagian Modul Bulan Agustus 📖', body: 'Modul Matematika dan Bahasa Inggris bulan Agustus sudah bisa diambil di front office.', date: '10 Agu 2026', author: 'Admin', category: 'Informasi', unread: true, tone: 'purple' },
  { id: 'P4', title: 'Ujian Kenaikan Tingkat A1 ke A2 📈', body: 'Ujian akan dilaksanakan pada 24–25 Agustus 2026. Pastikan kamu sudah siap dan terus berlatih.', date: '9 Agu 2026', author: 'Teacher Fitri', category: 'Agenda', unread: false, tone: 'orange' },
  { id: 'P5', title: 'Pengumpulan Tugas Project Science 🧪', body: 'Tugas project Science dikumpulkan paling lambat 20 Agustus 2026.', date: '8 Agu 2026', author: 'Teacher Sinta', category: 'Tugas', unread: false, tone: 'blue' },
  { id: 'P6', title: 'Rapat Evaluasi Tutor Bulanan', body: 'Rapat evaluasi tutor dilaksanakan Sabtu, 22 Agustus 2026 pukul 10.00 di Ruang Serbaguna.', date: '7 Agu 2026', author: 'Admin', category: 'Agenda', unread: false, tone: 'orange' },
  { id: 'P7', title: 'Pembaruan Bank Soal Semester 1', body: 'Bank soal Matematika dan IPA telah diperbarui dengan 240 soal baru.', date: '5 Agu 2026', author: 'Admin', category: 'Informasi', unread: false, tone: 'purple' },
];

/* ---------- Pesan ---------- */
export interface ChatMessage { from: 'me' | 'them'; text: string; time: string }
export interface Conversation { id: string; name: string; role: string; time: string; preview: string; unread: number; starred: boolean; avatar?: string; messages: ChatMessage[] }
export const CONVERSATIONS: Conversation[] = [
  {
    id: 'C1', name: 'Orang Tua – Mecca', role: 'Orang Tua Siswa', time: '10.30', preview: 'Bu, terima kasih atas update hari ini.', unread: 2, starred: true, avatar: '/assets/portal/ibu.png',
    messages: [
      { from: 'them', text: "Assalamu'alaikum Pak Budi 🙏", time: '10.20' }, { from: 'them', text: 'Bagaimana perkembangan Mecca hari ini di kelas?', time: '10.21' },
      { from: 'me', text: "Wa'alaikumsalam Ibu 🙂 Alhamdulillah, Mecca hari ini aktif dan semangat sekali. Ia sudah bisa menjawab pertanyaan dengan percaya diri.", time: '10.25' },
      { from: 'me', text: 'Tetap semangat belajar di rumah ya, Ibu. Jangan lupa istirahat yang cukup.', time: '10.26' }, { from: 'them', text: 'Terima kasih banyak Pak 😊', time: '10.30' },
    ],
  },
  { id: 'C2', name: 'Yasmin A.', role: 'Siswa', time: '09.45', preview: 'Pak, untuk tugas speaking boleh dikirim...', unread: 1, starred: false, messages: [{ from: 'them', text: 'Pak, untuk tugas speaking boleh dikirim lewat rekaman suara?', time: '09.45' }, { from: 'me', text: 'Tentu Yasmin, silakan ya.', time: '09.50' }] },
  { id: 'C3', name: 'Orang Tua – Marco', role: 'Orang Tua Siswa', time: 'Kemarin', preview: 'Marco sedikit kurang sehat hari ini...', unread: 0, starred: false, avatar: '/assets/portal/ayah.png', messages: [{ from: 'them', text: 'Marco sedikit kurang sehat hari ini, mohon izin tidak masuk kelas.', time: '07.10' }, { from: 'me', text: 'Terima kasih informasinya, Pak. Semoga Marco lekas sembuh.', time: '07.25' }] },
  { id: 'C4', name: 'Tim Admin StudyHack', role: 'Admin', time: 'Kemarin', preview: 'Pengumuman: Libur Nasional 17 Agustus...', unread: 0, starred: true, messages: [{ from: 'them', text: 'Pengumuman: Libur Nasional 17 Agustus, kelas kembali normal 18 Agustus.', time: '15.00' }, { from: 'me', text: 'Baik, terima kasih.', time: '15.12' }] },
  { id: 'C5', name: 'Nadhira', role: 'Siswa', time: '2 hari lalu', preview: 'Pak, nilai quiz saya belum muncul ya?', unread: 0, starred: false, messages: [{ from: 'them', text: 'Pak, nilai quiz saya belum muncul ya?', time: '13.02' }, { from: 'me', text: 'Sudah saya cek, nanti sore ya.', time: '13.30' }] },
  { id: 'C6', name: 'Orang Tua – Askya', role: 'Orang Tua Siswa', time: '2 hari lalu', preview: 'Terima kasih untuk bimbingannya, Pak.', unread: 0, starred: false, messages: [{ from: 'them', text: 'Terima kasih untuk bimbingannya, Pak.', time: '19.40' }, { from: 'me', text: 'Sama-sama, Ibu 😊', time: '19.55' }] },
];

export const ACHIEVEMENTS = [
  { title: 'Guru Inspiratif StudyHack 2025', desc: 'Diberikan atas dedikasi dan kontribusi luar biasa dalam proses pembelajaran.', date: '10 Mei 2025', tone: 'orange' as Tone },
  { title: 'Sertifikat Google for Education', desc: 'Pelatihan pemanfaatan teknologi dalam pembelajaran.', date: '18 Februari 2025', tone: 'purple' as Tone },
  { title: 'Pelatihan Pembelajaran Aktif', desc: 'Workshop strategi pembelajaran aktif dan berdiferensiasi.', date: '12 Oktober 2024', tone: 'green' as Tone },
];
