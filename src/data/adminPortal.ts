// Data contoh portal Admin LearnSpace+ (mengikuti mockup klien "Akses Admin / LMS Web").
import type { Session, Tone } from '../components/portal/Kit';

export const PROGRAM_TONE: Record<string, Tone> = {
  'English Primary': 'blue', 'Math Primary': 'green', Combo: 'orange', Intensif: 'purple', 'English Teens': 'blue',
  'IPA Junior': 'teal', Calistung: 'pink', Playclub: 'amber', 'Afternoon Package': 'orange', 'Speaking Club': 'amber', 'SMP Intensif': 'purple',
  Administrasi: 'slate', Keuangan: 'slate', 'Customer Service': 'slate', 'IT Support': 'slate',
};
export const programTone = (p: string): Tone => PROGRAM_TONE[p] ?? 'blue';

/* ---------- Siswa ---------- */
export interface AdminStudent {
  id: string; name: string; gender: 'L' | 'P'; program: string; kelas: string; dob: string; age: number;
  parent: string; phone: string; status: 'Aktif' | 'Nonaktif' | 'Lulus';
}
const st = (id: string, name: string, gender: 'L' | 'P', program: string, kelas: string, dob: string, age: number, parent: string, phone: string, status: AdminStudent['status'] = 'Aktif'): AdminStudent =>
  ({ id, name, gender, program, kelas, dob, age, parent, phone, status });

export const STUDENTS: AdminStudent[] = [
  st('2401001', 'Nadhira Putri A.', 'P', 'English Primary', 'Primary 1A', '12/05/2017', 7, 'Rina Andayani', '0812-3456-7890'),
  st('2401002', 'Arsyad Alfarizky', 'L', 'Math Primary', 'Primary 1A', '21/08/2017', 6, 'Budi Santoso', '0813-2345-6789'),
  st('2401003', 'Yasmin Azzahra', 'P', 'Combo', 'Primary 2A', '03/02/2016', 8, 'Dewi Lestari', '0812-9876-5432'),
  st('2401004', 'Muhammad Marco', 'L', 'English Primary', 'Primary 2A', '17/07/2016', 7, 'Andi Wijaya', '0813-5555-2211'),
  st('2401005', 'Mecca A. Ramadhan', 'L', 'Intensif', 'Junior 1A', '11/11/2012', 11, 'Siti Rahmah', '0812-1234-5678'),
  st('2401006', 'Ethan Marisi S.', 'L', 'Combo', 'Primary 3A', '09/04/2015', 9, 'Marisi Sitohang', '0813-8765-4321'),
  st('2401007', 'Putri Anfielia S.', 'P', 'Math Primary', 'Primary 2B', '28/09/2016', 7, 'Rina Simangunsong', '0812-3344-5566', 'Nonaktif'),
  st('2401008', 'Zafi Arkaan', 'L', 'English Primary', 'Primary 1B', '14/03/2017', 7, 'Ahmad Arkaan', '0813-6677-8899'),
  st('2401009', 'Mutiara Azzahra', 'P', 'Combo', 'Junior 1A', '25/06/2013', 10, 'Taufik Hidayat', '0812-1122-3344', 'Lulus'),
  st('2401010', 'Cantika Putri', 'P', 'Intensif', 'Junior 2A', '30/12/2011', 12, 'Dian Purnama', '0813-9988-7766'),
  st('2401011', 'Hazqila Yasmin R.', 'P', 'English Primary', 'Primary 3A', '02/01/2015', 9, 'Ratna Sari', '0812-7711-2040'),
  st('2401012', 'Marco Febrian', 'L', 'Math Primary', 'Primary 3A', '19/10/2015', 9, 'Febri Kurniawan', '0813-4412-9087'),
  st('2401013', 'Nadhira Azzahra', 'P', 'Intensif', 'Junior 1A', '06/06/2012', 12, 'Yuni Astuti', '0812-5530-1188'),
  st('2401014', 'Putra Anfiela S.', 'L', 'Intensif', 'Junior 2A', '23/03/2011', 13, 'Hotman Sinaga', '0813-2090-7755'),
  st('2401015', 'Aisyah Humaira', 'P', 'Combo', 'Primary 2B', '15/08/2016', 8, 'Nur Hasanah', '0812-6601-4423'),
  st('2401016', 'Rafa Pratama', 'L', 'English Primary', 'Primary 1B', '27/11/2017', 6, 'Agus Pratama', '0813-7745-3310'),
  st('2401017', 'Khalisa Nur', 'P', 'Math Primary', 'Primary 1A', '08/04/2017', 7, 'Lina Wahyuni', '0812-8890-2265', 'Nonaktif'),
  st('2401018', 'Daffa Alfarezi', 'L', 'Combo', 'Primary 3A', '31/01/2015', 9, 'Reza Alfarezi', '0813-1023-5567'),
];

/* ---------- Pendaftaran ---------- */
export type RegStatus = 'Dalam Proses' | 'Menunggu Verifikasi' | 'Diterima' | 'Ditolak';
export interface Registration {
  id: string; date: string; time: string; name: string; gender: 'L' | 'P'; age: number; program: string;
  source: string; status: RegStatus; stage: string; stageNote: string;
}
const rg = (id: string, date: string, time: string, name: string, gender: 'L' | 'P', age: number, program: string, source: string, status: RegStatus, stage: string, stageNote: string): Registration =>
  ({ id, date, time, name, gender, age, program, source, status, stage, stageNote });

export const REGISTRATIONS: Registration[] = [
  rg('REG-250617-001', '17/06/2025', '10:21', 'Arsyad Alfarizky', 'L', 7, 'English Primary', 'Instagram', 'Dalam Proses', 'Tes & Interview', 'Jadwal: 18/06/2025'),
  rg('REG-250616-002', '16/06/2025', '14:35', 'Nadhira Putri A.', 'P', 8, 'Combo', 'WhatsApp', 'Menunggu Verifikasi', 'Verifikasi Data', 'Oleh: Admin'),
  rg('REG-250616-003', '16/06/2025', '11:08', 'Marco Wijaya', 'L', 7, 'Math Primary', 'Website', 'Dalam Proses', 'Menunggu Pembayaran', 'Batas: 18/06/2025'),
  rg('REG-250615-004', '15/06/2025', '16:40', 'Yasmin Azzahra', 'P', 6, 'Intensif', 'Walk-in', 'Menunggu Verifikasi', 'Verifikasi Data', 'Oleh: Admin'),
  rg('REG-250615-005', '15/06/2025', '09:22', 'Ethan Marisi S.', 'L', 8, 'Combo', 'Referensi Orang Tua', 'Diterima', 'Selesai', 'Diterima: 16/06/2025'),
  rg('REG-250614-006', '14/06/2025', '13:55', 'Putri Anfielia S.', 'P', 7, 'English Primary', 'Instagram', 'Ditolak', 'Ditolak', 'Alasan: Kuota Penuh'),
  rg('REG-250614-007', '14/06/2025', '10:11', 'Zafi Arkaan', 'L', 6, 'Math Primary', 'WhatsApp', 'Dalam Proses', 'Tes & Interview', 'Jadwal: 20/06/2025'),
  rg('REG-250613-008', '13/06/2025', '15:02', 'Aisyah Humaira', 'P', 8, 'Combo', 'Instagram', 'Dalam Proses', 'Tes & Interview', 'Jadwal: 19/06/2025'),
  rg('REG-250613-009', '13/06/2025', '09:47', 'Rafa Pratama', 'L', 6, 'English Primary', 'Website', 'Diterima', 'Selesai', 'Diterima: 15/06/2025'),
  rg('REG-250612-010', '12/06/2025', '11:30', 'Khalisa Nur', 'P', 7, 'Math Primary', 'WhatsApp', 'Menunggu Verifikasi', 'Verifikasi Data', 'Oleh: Admin'),
  rg('REG-250612-011', '12/06/2025', '08:15', 'Daffa Alfarezi', 'L', 9, 'Combo', 'Walk-in', 'Dalam Proses', 'Menunggu Pembayaran', 'Batas: 19/06/2025'),
  rg('REG-250611-012', '11/06/2025', '14:20', 'Kirana Larasati', 'P', 10, 'Intensif', 'Instagram', 'Ditolak', 'Ditolak', 'Alasan: Data tidak lengkap'),
];

/* ---------- Orang tua / wali ---------- */
export interface ParentRow {
  id: string; name: string; child: string; relation: string; phone: string; email: string; address: string; status: 'Aktif' | 'Nonaktif';
}
const pr = (n: number, name: string, child: string, relation: string, phone: string, email: string, address: string, status: ParentRow['status'] = 'Aktif'): ParentRow =>
  ({ id: `ORT-${String(n).padStart(4, '0')}`, name, child, relation, phone, email, address, status });

export const PARENTS: ParentRow[] = [
  pr(1, 'Rina Andayani', 'Nadhira Putri A.', 'Ibu Kandung', '0812-3456-7890', 'rina.andayani@gmail.com', 'Jl. Melati No. 12, Medan'),
  pr(2, 'Budi Santoso', 'Arsyad Alfarizky', 'Ayah Kandung', '0813-2345-6789', 'budi.santoso@gmail.com', 'Jl. Kenanga No. 45, Medan'),
  pr(3, 'Dewi Lestari', 'Yasmin Azzahra', 'Ibu Kandung', '0812-9876-5432', 'dewilestari@gmail.com', 'Jl. Anggrek No. 7, Medan'),
  pr(4, 'Andi Wijaya', 'Muhammad Marco', 'Ayah Kandung', '0813-5555-2211', 'andiwijaya@gmail.com', 'Jl. Cemara No. 3, Medan'),
  pr(5, 'Siti Rahmah', 'Mecca A. Ramadhan', 'Ibu Kandung', '0812-1234-5678', 's.rahmah@gmail.com', 'Jl. Karet No. 8, Medan'),
  pr(6, 'Marisi Sitohang', 'Ethan Marisi S.', 'Ayah Kandung', '0813-8765-4321', 'marisi.sitohang@gmail.com', 'Jl. Pinang No. 20, Medan'),
  pr(7, 'Rina Simangunsong', 'Putri Anfielia S.', 'Ibu Kandung', '0812-3344-5566', 'rina.simangunsong@gmail.com', 'Jl. Sakura No. 11, Medan'),
  pr(8, 'Ahmad Arkaan', 'Zafi Arkaan', 'Ayah Kandung', '0813-6677-8899', 'ahmad.arkaan@gmail.com', 'Jl. Merbau No. 9, Medan'),
  pr(9, 'Taufik Hidayat', 'Mutiara Azzahra', 'Ayah Kandung', '0812-1122-3344', 'taufik.hidayat@gmail.com', 'Jl. Flamboyan No. 15, Medan', 'Nonaktif'),
  pr(10, 'Dian Purnama', 'Cantika Putri', 'Ibu Kandung', '0813-9988-7766', 'dian.purnama@gmail.com', 'Jl. Azalea No. 2, Medan'),
  pr(11, 'Ratna Sari', 'Hazqila Yasmin R.', 'Ibu Kandung', '0812-7711-2040', 'ratna.sari@gmail.com', 'Jl. Dahlia No. 31, Medan'),
  pr(12, 'Hotman Sinaga', 'Putra Anfiela S.', 'Wali', '0813-2090-7755', 'hotman.sinaga@gmail.com', 'Jl. Teratai No. 5, Medan'),
];

/* ---------- Tutor & staff ---------- */
export interface StaffRow {
  id: string; name: string; email: string; role: 'Tutor' | 'Staff'; programs: string[]; phone: string;
  status: 'Aktif' | 'Nonaktif'; joined: string; avatar?: string;
}
const sf = (id: string, name: string, email: string, programs: string[], phone: string, joined: string, status: StaffRow['status'] = 'Aktif', avatar?: string): StaffRow =>
  ({ id, name, email: `${email}@studyhack.id`, role: id.startsWith('TUT') ? 'Tutor' : 'Staff', programs, phone, status, joined, avatar });

export const STAFF: StaffRow[] = [
  sf('TUT-001', 'Fitri Handayani, S.T.', 'fitri.handayani', ['English Primary', 'English Teens'], '0812-3456-7890', '01/08/2022', 'Aktif', '/assets/portal/tutor-fitri.png'),
  sf('TUT-002', 'Andi Saputra, S.Pd.', 'andi.saputra', ['Math Primary', 'Combo'], '0813-2345-6789', '15/09/2022', 'Aktif', '/assets/portal/tutor-andi.png'),
  sf('TUT-003', 'Siti Aisyah, S.Pd.', 'siti.aisyah', ['English Primary', 'Intensif'], '0812-9876-5432', '20/10/2022', 'Aktif', '/assets/portal/tutor-siti.png'),
  sf('TUT-004', 'Muhammad Rizki, S.Pd.', 'rizki', ['Math Primary', 'IPA Junior'], '0813-5555-2211', '05/01/2023'),
  sf('TUT-005', 'Dinda Puspita, S.Pd.', 'dinda', ['English Teens', 'Combo'], '0812-1234-5678', '11/02/2023'),
  sf('TUT-006', 'Fauzan Habibi, S.Pd.', 'fauzan', ['IPA Junior', 'Intensif'], '0813-8765-4321', '20/03/2023', 'Nonaktif'),
  sf('STF-001', 'Rani Putri, A.Md.', 'rani.putri', ['Administrasi'], '0812-3344-5566', '01/07/2022'),
  sf('STF-002', 'Yusuf Pratama', 'yusuf', ['Keuangan'], '0813-6677-8899', '10/07/2022'),
  sf('STF-003', 'Lina Marlina', 'lina', ['Customer Service'], '0812-1122-3344', '15/08/2022'),
  sf('STF-004', 'Rahmat Hidayat', 'rahmat', ['IT Support'], '0813-9988-7766', '01/09/2022'),
  sf('TUT-007', 'Budi Santoso, S.Pd', 'budi.santoso', ['Math Primary', 'Intensif'], '0812-3456-7890', '15/07/2023', 'Aktif', '/assets/portal/tutor-budi.png'),
  sf('TUT-008', 'Nurul Azmi, S.Pd.', 'nurul.azmi', ['IPA Junior'], '0812-4410-2231', '02/08/2023', 'Aktif', '/assets/portal/tutor-nurul.png'),
];
export const staffAvatar = (name: string) => STAFF.find((s) => s.name.startsWith(name.split(',')[0]))?.avatar;

/* ---------- Kehadiran tutor ---------- */
export type AttStatus = 'Hadir' | 'Terlambat' | 'Tidak Hadir' | 'Izin' | 'Sakit';
export interface TutorAttendance {
  id: string; name: string; program: string; code: string; room: string; schedule: string; checkIn: string; checkOut: string;
  status: AttStatus; note: string;
}
const ta = (id: string, name: string, program: string, code: string, room: string, schedule: string, checkIn: string, checkOut: string, status: AttStatus, note = '-'): TutorAttendance =>
  ({ id, name, program, code, room, schedule, checkIn, checkOut, status, note });

export const TUTOR_ATTENDANCE: TutorAttendance[] = [
  ta('TUT-001', 'Fitri Handayani, S.T.', 'English Primary 1A', 'EP1A-01', 'Ruang 2', '07:00 - 08:30', '06:58', '08:32', 'Hadir'),
  ta('TUT-002', 'Andi Saputra, S.Pd.', 'Math Primary 2A', 'MP2A-02', 'Ruang 3', '07:00 - 08:30', '07:05', '08:30', 'Terlambat', 'Terlambat 5 menit'),
  ta('TUT-003', 'Siti Aisyah, S.Pd.', 'Calistung B', 'CLB-01', 'Ruang 1', '08:30 - 10:00', '08:28', '10:02', 'Hadir'),
  ta('TUT-004', 'Muhammad Rizki, S.Pd.', 'IPA Junior 1A', 'IPAJ1A-01', 'Ruang 3', '10:00 - 11:30', '-', '-', 'Tidak Hadir', 'Tanpa Keterangan'),
  ta('TUT-005', 'Dinda Puspita, S.Pd.', 'English Teens A', 'ETA-01', 'Ruang 4', '14:30 - 16:00', '14:25', '16:05', 'Hadir'),
  ta('TUT-006', 'Fauzan Habibi, S.Pd.', 'Math Primary 3A', 'MP3A-02', 'Ruang 2', '16:00 - 17:30', '16:01', '17:30', 'Hadir'),
  ta('STF-001', 'Rani Putri, A.Md.', 'Administrasi', '', 'Kantor', '09:00 - 17:00', '09:02', '17:01', 'Hadir'),
  ta('STF-002', 'Yusuf Pratama', 'Keuangan', '', 'Kantor', '09:00 - 17:00', '-', '-', 'Izin', 'Izin Keluarga'),
  ta('TUT-007', 'Budi Santoso, S.Pd', 'Math Primary 3B', 'MP3B-01', 'Ruang 2', '16:00 - 17:30', '16:12', '17:32', 'Terlambat', 'Terlambat 12 menit'),
  ta('TUT-008', 'Nurul Azmi, S.Pd.', 'IPA Junior 1B', 'IPAJ1B-01', 'Ruang 3', '10:00 - 11:30', '-', '-', 'Sakit', 'Surat dokter terlampir'),
  ta('STF-003', 'Lina Marlina', 'Customer Service', '', 'Kantor', '09:00 - 17:00', '08:55', '17:03', 'Hadir'),
  ta('STF-004', 'Rahmat Hidayat', 'IT Support', '', 'Kantor', '09:00 - 17:00', '09:00', '17:00', 'Hadir'),
];

/* ---------- Beban mengajar ---------- */
export type LoadStatus = 'Optimal' | 'Cukup' | 'Ringan' | 'Maksimal' | 'Tidak Mengajar';
export interface Workload { id: string; name: string; classes: string[]; classCount: number; hours: string; sessions: number; pct: number; status: LoadStatus; note: string }
const wl = (id: string, name: string, classes: string[], classCount: number, hours: string, sessions: number, pct: number, status: LoadStatus, note = '-'): Workload =>
  ({ id, name, classes, classCount, hours, sessions, pct, status, note });

export const WORKLOADS: Workload[] = [
  wl('TUT-001', 'Fitri Handayani, S.T.', ['English Primary 1A', 'English Teens A'], 4, '18:00', 18, 90, 'Optimal'),
  wl('TUT-002', 'Andi Saputra, S.Pd.', ['Math Primary 2A', 'Math Primary 3B'], 5, '16:30', 16.5, 82.5, 'Optimal'),
  wl('TUT-003', 'Siti Aisyah, S.Pd.', ['Calistung B', 'Calistung C'], 4, '12:00', 12, 60, 'Ringan', 'Masih tersedia 8:00 jam'),
  wl('TUT-004', 'Muhammad Rizki, S.Pd.', ['IPA Junior 1A', 'IPA Junior 1B'], 5, '20:00', 20, 100, 'Maksimal', 'Sesuai batas maksimal'),
  wl('TUT-005', 'Dinda Puspita, S.Pd.', ['English Teens A', 'Intensif SMP'], 4, '14:30', 14.5, 72.5, 'Cukup', 'Masih tersedia 5:30 jam'),
  wl('TUT-006', 'Fauzan Habibi, S.Pd.', ['Math Primary 3A', 'Math Primary 2B'], 4, '17:30', 17.5, 87.5, 'Optimal'),
  wl('TUT-007', 'Budi Santoso, S.Pd', ['Math Primary 3B', 'Intensif SMP'], 3, '13:00', 13, 65, 'Cukup', 'Masih tersedia 7:00 jam'),
  wl('TUT-008', 'Nurul Azmi, S.Pd.', ['IPA Junior 1B'], 2, '8:00', 8, 40, 'Ringan', 'Masih tersedia 12:00 jam'),
  wl('STF-001', 'Rani Putri, A.Md.', ['Administrasi'], 0, '-', 0, 0, 'Tidak Mengajar', 'Staff Administrasi'),
  wl('STF-002', 'Yusuf Pratama', ['Keuangan'], 0, '-', 0, 0, 'Tidak Mengajar', 'Staff Keuangan'),
];

/* ---------- Program ---------- */
export interface ProgramRow {
  id: string; name: string; level: string; category: string; desc: string; sessions: number; minutes: number; fee: number;
  classes: number; students: number; status: 'Aktif' | 'Nonaktif' | 'Arsip';
}
const pg = (n: number, name: string, level: string, category: string, desc: string, sessions: number, minutes: number, fee: number, classes: number, students: number, status: ProgramRow['status'] = 'Aktif'): ProgramRow =>
  ({ id: `PRG-${String(n).padStart(2, '0')}`, name, level, category, desc, sessions, minutes, fee, classes, students, status });

export const CATEGORY_TONE: Record<string, Tone> = { 'Early Learning': 'purple', Calistung: 'pink', Akademik: 'green', Bahasa: 'blue', Paket: 'orange' };

export const PROGRAMS: ProgramRow[] = [
  pg(1, 'Playclub (Pre-school)', 'Pra-Sekolah', 'Early Learning', 'Program stimulasi untuk anak usia 3-5 tahun melalui bermain, bernyanyi, dan aktivitas kreatif.', 12, 60, 300000, 3, 36),
  pg(2, 'Calistung (Privat)', 'Pra-SD & SD', 'Calistung', 'Program membaca, menulis, dan berhitung 1-on-1 sesuai kebutuhan siswa.', 12, 60, 300000, 0, 24),
  pg(3, 'English & Math (Primary)', 'SD (Kelas 1-6)', 'Akademik', 'Belajar Bahasa Inggris dan Matematika dengan pendekatan fun & concept building.', 12, 90, 300000, 8, 96),
  pg(4, 'English (Secondary)', 'SMP & SMA', 'Bahasa', 'Penguatan kemampuan Bahasa Inggris untuk komunikasi, grammar, dan exam preparation.', 8, 90, 350000, 6, 48),
  pg(5, 'Afternoon Package (English, Math, Mengaji)', 'SD', 'Paket', 'Paket lengkap sore hari: English, Math, dan Mengaji.', 12, 195, 380000, 4, 40),
  pg(6, 'SD Bundling 5 Hari', 'SD', 'Paket', 'Program lengkap 5 hari dalam seminggu (Academic + Support).', 20, 90, 500000, 5, 55),
  pg(7, 'SMP Bundling', 'SMP', 'Paket', 'Program lengkap untuk siswa SMP (Bahasa Inggris, Matematika, IPA, dll).', 8, 120, 300000, 4, 32),
  pg(8, 'SMA Bundling', 'SMA', 'Paket', 'Program lengkap untuk siswa SMA (Bahasa Inggris, Matematika, IPA, dll).', 8, 120, 300000, 4, 25),
  pg(9, 'Speaking Club (Teens)', 'SMP & SMA', 'Bahasa', 'Program speaking intensif untuk meningkatkan kepercayaan diri berbicara Bahasa Inggris.', 24, 120, 200000, 2, 16),
  pg(10, 'Intensif SMP', 'SMP', 'Akademik', 'Persiapan ujian sekolah dan asesmen dengan latihan soal terarah.', 12, 120, 600000, 3, 28),
  pg(11, 'Mengaji Sore', 'SD', 'Early Learning', 'Belajar membaca Al-Quran dan tahfidz dasar untuk siswa SD.', 12, 60, 150000, 2, 18, 'Nonaktif'),
  pg(12, 'Holiday Camp 2024', 'SD', 'Paket', 'Program liburan sekolah tahun 2024.', 6, 180, 450000, 0, 0, 'Arsip'),
];

/* ---------- Kelas (tingkat) & rombel ---------- */
export interface LevelRow { id: string; name: string; sub: string; level: string; rombel: number; students: number; capacity: number; status: 'Aktif' | 'Nonaktif' }
const lv = (n: number, name: string, sub: string, level: string, rombel: number, students: number, capacity: number, status: LevelRow['status'] = 'Aktif'): LevelRow =>
  ({ id: `KLS-${String(n).padStart(2, '0')}`, name, sub, level, rombel, students, capacity, status });

export const LEVELS: LevelRow[] = [
  lv(1, 'Playclub', 'Usia 3-4 tahun', 'Pra-Sekolah', 2, 36, 50),
  lv(2, 'Calistung', 'Calistung', 'Pra-SD & SD', 2, 24, 30),
  lv(3, 'Kelas 1', 'SD', 'SD', 4, 48, 60),
  lv(4, 'Kelas 2', 'SD', 'SD', 4, 52, 60),
  lv(5, 'Kelas 3', 'SD', 'SD', 3, 36, 45),
  lv(6, 'Kelas 4', 'SD', 'SD', 3, 32, 45),
  lv(7, 'Kelas 5', 'SD', 'SD', 3, 34, 45),
  lv(8, 'Kelas 6', 'SD', 'SD', 3, 32, 45),
  lv(9, 'SMP (7-9)', 'SMP', 'SMP', 3, 40, 60),
  lv(10, 'SMA (10-12)', 'SMA', 'SMA', 2, 28, 40),
  lv(11, 'Speaking Club', 'Teens', 'SMP', 1, 16, 24, 'Nonaktif'),
  lv(12, 'Holiday Camp', 'Musiman', 'SD', 1, 0, 30, 'Nonaktif'),
];

export interface RombelRow { id: string; name: string; level: string; tutor: string; room: string; students: number; capacity: number; status: 'Aktif' | 'Nonaktif' }
const rb = (id: string, name: string, level: string, tutor: string, room: string, students: number, capacity: number, status: RombelRow['status'] = 'Aktif'): RombelRow =>
  ({ id, name, level, tutor, room, students, capacity, status });

export const ROMBELS: RombelRow[] = [
  rb('EP1A-01', 'English Primary 1A', 'Kelas 1', 'Fitri Handayani', 'Ruang 2', 8, 10),
  rb('MP2A-02', 'Math Primary 2A', 'Kelas 2', 'Andi Saputra', 'Ruang 3', 9, 10),
  rb('EP1B-01', 'English Primary 1B', 'Kelas 1', 'Fitri Handayani', 'Ruang 2', 8, 10),
  rb('CLA-01', 'Calistung A', 'Calistung', 'Siti Aisyah', 'Ruang 1', 5, 6),
  rb('CLB-01', 'Calistung B', 'Calistung', 'Siti Aisyah', 'Ruang 1', 6, 6),
  rb('IPAJ1A-01', 'IPA Junior 1A', 'SMP (7-9)', 'Dinda Puspita', 'Ruang 3', 8, 10),
  rb('IPAJ1B-01', 'IPA Junior 1B', 'SMP (7-9)', 'Dinda Puspita', 'Ruang 3', 9, 10),
  rb('ETA-01', 'English Teens A', 'SMP (7-9)', 'Muhammad Rizki', 'Ruang 4', 10, 12),
  rb('ETB-01', 'English Teens B', 'SMP (7-9)', 'Muhammad Rizki', 'Ruang 4', 11, 12),
  rb('MP3A-02', 'Math Primary 3A', 'Kelas 3', 'Fauzan Habibi', 'Ruang 2', 9, 10),
  rb('MP3B-01', 'Math Primary 3B', 'Kelas 3', 'Fauzan Habibi', 'Ruang 2', 8, 10),
  rb('ISMP-01', 'Intensif SMP', 'SMP (7-9)', 'Rani Putri', 'Ruang 4', 9, 12),
  rb('ISMA-01', 'Intensif SMA', 'SMA (10-12)', 'Rani Putri', 'Ruang 4', 9, 12),
  rb('SPK-01', 'Speaking Club (Teens)', 'Speaking Club', 'Rani Putri', 'Ruang 4', 6, 8, 'Nonaktif'),
];

/* ---------- Ruang ---------- */
export interface RoomRow { id: string; name: string; type: string; floor: string; capacity: number; used: number; status: 'Aktif' | 'Nonaktif'; condition: string }
const rm = (n: number, name: string, type: string, floor: string, capacity: number, used: number, condition = 'Baik'): RoomRow =>
  ({ id: `RNG-${n}`, name, type, floor, capacity, used, status: 'Aktif', condition });

export const ROOMS: RoomRow[] = [
  rm(1, 'Ruang 1', 'Ruang Kelas', 'Lantai 1', 32, 28),
  rm(2, 'Ruang 2', 'Ruang Kelas', 'Lantai 1', 28, 24),
  rm(3, 'Ruang 3', 'Ruang Kelas', 'Lantai 1', 28, 20),
  rm(4, 'Ruang 4', 'Ruang Kelas', 'Lantai 2', 24, 18),
  rm(5, 'Ruang Laboratorium IPA', 'Laboratorium', 'Lantai 2', 24, 16),
  rm(6, 'Ruang Baca & Diskusi', 'Perpustakaan', 'Lantai 2', 20, 8),
  rm(7, 'Ruang Serbaguna', 'Aula', 'Lantai 1', 40, 32),
  rm(8, 'Ruang Guru', 'Ruang Staff', 'Lantai 1', 16, 8),
];

/* ---------- Keuangan ---------- */
export type BillStatus = 'Lunas' | 'Belum Lunas' | 'Terlambat';
export interface BillRow { id: string; name: string; program: string; kelas: string; amount: number; discount: number; paid: number; due: string; status: BillStatus }
const bl = (n: number, name: string, program: string, kelas: string, amount: number, discount: number, paid: number): BillRow => {
  const total = amount - discount;
  return { id: `SHK-${String(n).padStart(4, '0')}`, name, program, kelas, amount, discount, paid, due: '10 Mei 2025', status: paid >= total ? 'Lunas' : paid > 0 ? 'Belum Lunas' : 'Terlambat' };
};

export const BILLS: BillRow[] = [
  bl(1, 'Arsyad Alfarizky', 'English & Math', 'Kelas 1A', 500000, 50000, 450000),
  bl(2, 'Hazqila Yasmin R.', 'Calistung (Privat)', '-', 300000, 0, 200000),
  bl(3, 'Marco Febrian', 'Playclub', 'Pre-school', 300000, 0, 0),
  bl(4, 'Mecca Putri', 'English Teens', 'Teens A', 500000, 50000, 450000),
  bl(5, 'Nadhira Azzahra', 'SMP Intensif', '-', 600000, 0, 300000),
  bl(6, 'Ethan Marisi S.', 'Afternoon Package', 'Eng, Math, Mengaji', 380000, 0, 380000),
  bl(7, 'Zafi Arkaan', 'Speaking Club', 'Teens', 200000, 0, 0),
  bl(8, 'Mutiara A. Putri', 'English & Math', 'Kelas 2B', 500000, 25000, 475000),
  bl(9, 'Cantika Putri', 'Calistung (Privat)', '-', 300000, 0, 0),
  bl(10, 'Putra Anfiela S.', 'SMP Intensif', '-', 600000, 0, 600000),
  bl(11, 'Aisyah Humaira', 'English & Math', 'Kelas 2B', 500000, 0, 500000),
  bl(12, 'Rafa Pratama', 'Playclub', 'Pre-school', 300000, 0, 150000),
  bl(13, 'Khalisa Nur', 'English & Math', 'Kelas 1A', 500000, 50000, 0),
  bl(14, 'Daffa Alfarezi', 'Afternoon Package', 'Eng, Math, Mengaji', 380000, 0, 380000),
];

export type PayStatus = 'Berhasil' | 'Tertunda' | 'Gagal' | 'Refund';
export interface PaymentRow { id: string; date: string; time: string; name: string; sid: string; program: string; method: string; channel: string; bill: number; paid: number; discount: number; status: PayStatus }
const py = (id: string, date: string, time: string, name: string, sid: number, program: string, method: string, channel: string, bill: number, paid: number, discount: number, status: PayStatus = 'Berhasil'): PaymentRow =>
  ({ id, date, time, name, sid: `SHK-${String(sid).padStart(4, '0')}`, program, method, channel, bill, paid, discount, status });

export const PAYMENTS: PaymentRow[] = [
  py('TRX-250516-0012', '16 Mei 2025', '10:24', 'Arsyad Alfarizky', 1, 'English & Math · Kelas 1A', 'Transfer Bank', 'BCA', 500000, 450000, 50000),
  py('TRX-250516-0011', '16 Mei 2025', '09:15', 'Hazqila Yasmin R.', 2, 'Calistung (Privat)', 'E-Wallet', 'OVO', 300000, 300000, 0),
  py('TRX-250515-0010', '15 Mei 2025', '19:08', 'Marco Febrian', 3, 'Playclub · Pre-school', 'QRIS', 'GoPay', 300000, 300000, 0),
  py('TRX-250515-0009', '15 Mei 2025', '18:22', 'Mecca Putri', 4, 'English Teens · Teens A', 'Transfer Bank', 'Mandiri', 500000, 475000, 25000),
  py('TRX-250515-0008', '15 Mei 2025', '17:05', 'Ethan Marisi S.', 6, 'Afternoon Package', 'Tunai', '', 380000, 380000, 0),
  py('TRX-250515-0007', '15 Mei 2025', '16:40', 'Nadhira Azzahra', 5, 'SMP Intensif', 'Transfer Bank', 'BCA', 600000, 300000, 0, 'Tertunda'),
  py('TRX-250515-0006', '15 Mei 2025', '14:12', 'Zafi Arkaan', 7, 'Speaking Club · Teens', 'E-Wallet', 'DANA', 200000, 200000, 0),
  py('TRX-250515-0005', '15 Mei 2025', '11:30', 'Mutiara A. Putri', 8, 'English & Math · Kelas 2B', 'QRIS', 'ShopeePay', 500000, 475000, 25000),
  py('TRX-250514-0004', '14 Mei 2025', '20:18', 'Cantika Putri', 9, 'Calistung (Privat)', 'Transfer Bank', 'BNI', 300000, 0, 0, 'Gagal'),
  py('TRX-250514-0003', '14 Mei 2025', '15:05', 'Putra Anfiela S.', 10, 'SMP Intensif', 'Tunai', '', 600000, 600000, 0),
  py('TRX-250514-0002', '14 Mei 2025', '10:41', 'Aisyah Humaira', 11, 'English & Math · Kelas 2B', 'Transfer Bank', 'BCA', 500000, 500000, 0),
  py('TRX-250513-0001', '13 Mei 2025', '13:27', 'Rafa Pratama', 12, 'Playclub · Pre-school', 'E-Wallet', 'OVO', 300000, 150000, 0, 'Refund'),
];

export type DebtStatus = 'Jatuh Tempo' | 'Lalu Jatuh Tempo' | 'Sebagian Dibayar' | 'Lunas';
export interface DebtRow { id: string; name: string; program: string; total: number; paid: number; due: string; late: number; status: DebtStatus }
const db = (n: number, name: string, program: string, total: number, paid: number, due: string, late: number, status: DebtStatus): DebtRow =>
  ({ id: `SHK-${String(n).padStart(4, '0')}`, name, program, total, paid, due, late, status });

export const DEBTS: DebtRow[] = [
  db(1, 'Arsyad Alfarizky', 'English & Math · Kelas 1A', 900000, 450000, '10 Mei 2025', 5, 'Jatuh Tempo'),
  db(2, 'Hazqila Yasmin R.', 'Calistung (Privat)', 600000, 300000, '10 Mei 2025', 5, 'Jatuh Tempo'),
  db(3, 'Marco Febrian', 'Playclub (Pre-school)', 300000, 0, '10 Mei 2025', 5, 'Jatuh Tempo'),
  db(4, 'Mecca Putri', 'English Teens (Teens A)', 900000, 450000, '20 Mei 2025', 0, 'Jatuh Tempo'),
  db(6, 'Ethan Marisi S.', 'Afternoon Package', 760000, 380000, '20 Mei 2025', 0, 'Jatuh Tempo'),
  db(7, 'Zafi Arkaan', 'Speaking Club (Teens)', 400000, 200000, '25 Mei 2025', 0, 'Jatuh Tempo'),
  db(5, 'Nadhira Azzahra', 'SMP Intensif', 600000, 200000, '30 Apr 2025', 15, 'Lalu Jatuh Tempo'),
  db(9, 'Cantika Putri', 'Calistung (Privat)', 300000, 100000, '15 Mei 2025', 0, 'Sebagian Dibayar'),
  db(10, 'Putra Anfiela S.', 'SMP Intensif', 600000, 600000, '-', 0, 'Lunas'),
  db(8, 'Mutiara A. Putri', 'English & Math · Kelas 2B', 950000, 250000, '05 Mei 2025', 10, 'Lalu Jatuh Tempo'),
  db(13, 'Khalisa Nur', 'English & Math · Kelas 1A', 450000, 0, '10 Mei 2025', 5, 'Jatuh Tempo'),
  db(12, 'Rafa Pratama', 'Playclub (Pre-school)', 300000, 150000, '18 Mei 2025', 0, 'Sebagian Dibayar'),
];

export interface ExpenseRow { id: string; date: string; time: string; category: string; note: string; method: string; channel: string; amount: number; status: 'Dibayar' | 'Tertunda' }
const ex = (n: number, date: string, time: string, category: string, note: string, method: string, channel: string, amount: number): ExpenseRow =>
  ({ id: `EXP-${String(n).padStart(3, '0')}`, date, time, category, note, method, channel, amount, status: 'Dibayar' });

export const EXPENSE_CATEGORIES = ['Gaji & Honor', 'Sewa & Utilitas', 'ATK & Perlengkapan', 'Promosi & Marketing', 'Kebersihan & Keamanan', 'Perawatan & Perbaikan', 'Internet & Telepon', 'Pelatihan & Pengembangan', 'Konsumsi', 'Lain-lain'];

export const EXPENSES: ExpenseRow[] = [
  ex(1, '16 Mei 2025', '14:30', 'Gaji & Honor', 'Gaji Tutor Mei 2025 · 10 Tutor', 'Transfer Bank', 'BCA', 8000000),
  ex(2, '15 Mei 2025', '10:20', 'Sewa & Utilitas', 'Sewa Gedung Mei 2025', 'Transfer Bank', 'BNI', 3500000),
  ex(3, '14 Mei 2025', '09:15', 'ATK & Perlengkapan', 'Pembelian ATK: kertas, pulpen, spidol', 'Tunai', '', 650000),
  ex(4, '12 Mei 2025', '16:40', 'Promosi & Marketing', 'Desain & Cetak Brosur', 'E-Wallet', 'OVO', 450000),
  ex(5, '10 Mei 2025', '11:05', 'Kebersihan & Keamanan', 'Jasa Kebersihan Mei 2025', 'Transfer Bank', 'Mandiri', 800000),
  ex(6, '09 Mei 2025', '15:20', 'Perawatan & Perbaikan', 'Perbaikan AC Kelas 1', 'Transfer Bank', 'BCA', 750000),
  ex(7, '08 Mei 2025', '13:10', 'Internet & Telepon', 'Internet & Telepon Mei 2025', 'Transfer Bank', 'BCA', 350000),
  ex(8, '06 Mei 2025', '09:00', 'Pelatihan & Pengembangan', 'Workshop Tutor: Metode Mengajar', 'Transfer Bank', 'BNI', 600000),
  ex(9, '05 Mei 2025', '16:00', 'Konsumsi', 'Konsumsi Rapat Bulanan', 'Tunai', '', 120000),
  ex(10, '03 Mei 2025', '10:30', 'Lain-lain', 'Transportasi Operasional', 'E-Wallet', 'DANA', 280000),
  ex(11, '02 Mei 2025', '14:45', 'ATK & Perlengkapan', 'Tinta printer & kertas HVS', 'Tunai', '', 950000),
  ex(12, '02 Mei 2025', '09:30', 'Promosi & Marketing', 'Iklan media sosial', 'E-Wallet', 'GoPay', 1200000),
];

export type HonorStatus = 'Lunas' | 'Sebagian Dibayar' | 'Belum Dibayar';
export interface HonorRow { id: string; name: string; program: string; level: string; sessions: number; total: number; paid: number }
const hn = (n: number, name: string, program: string, level: string, sessions: number, total: number, paid: number): HonorRow =>
  ({ id: `T-${String(n).padStart(3, '0')}`, name, program, level, sessions, total, paid });
export const honorStatus = (h: HonorRow): HonorStatus => (h.paid >= h.total ? 'Lunas' : h.paid > 0 ? 'Sebagian Dibayar' : 'Belum Dibayar');

export const HONORS: HonorRow[] = [
  hn(1, 'Fitri Handayani, S.T.', 'English Teens (A)', 'SMP Intensif', 16, 2400000, 2400000),
  hn(2, 'Rizky Ananda, S.Pd.', 'Math SD Kelas 1A', 'Primary', 12, 1200000, 900000),
  hn(3, 'Dewi Lestari, S.Pd.', 'English Kids (B)', 'Playclub', 12, 1200000, 0),
  hn(4, 'M. Farhan, S.Pd.', 'Math SD Kelas 2B', 'Primary', 16, 1600000, 1600000),
  hn(5, 'Siti Aisyah, S.Pd.', 'IPA SMP (A)', 'SMP Intensif', 12, 1200000, 600000),
  hn(6, 'Ahmad Fauzan, S.Pd.', 'Tahfidz & Mengaji', 'Mengaji', 20, 1800000, 1800000),
  hn(7, 'Putri Amanda, S.Pd.', 'English SD Kelas 3A', 'Primary', 12, 1000000, 500000),
  hn(8, 'Budi Hartono, S.Pd.', 'Math SMP (B)', 'SMP Intensif', 16, 1600000, 0),
  hn(9, 'Nurul Azmi, S.Pd.', 'Science SD Kelas 5', 'Primary', 8, 800000, 800000),
  hn(10, 'Irvan Maulana, S.Pd.', 'Math SD Kelas 4B', 'Primary', 12, 1050000, 750000),
  hn(11, 'Andi Saputra, S.Pd.', 'Math Primary 2A', 'Primary', 16, 1600000, 1600000),
  hn(12, 'Dinda Puspita, S.Pd.', 'English Teens (B)', 'SMP Intensif', 14, 1400000, 700000),
];

/* ---------- Jadwal ---------- */
export const TIME_SLOTS = ['07:00 - 08:30', '08:30 - 10:00', '10:00 - 11:30', '13:00 - 14:30', '14:30 - 16:00', '16:00 - 17:30', '18:30 - 20:00'];
export const WEEK_DAYS = [
  { name: 'Senin', date: '12 Mei' }, { name: 'Selasa', date: '13 Mei' }, { name: 'Rabu', date: '14 Mei' }, { name: 'Kamis', date: '15 Mei' },
  { name: 'Jumat', date: '16 Mei' }, { name: 'Sabtu', date: '17 Mei' }, { name: 'Minggu', date: '18 Mei' },
];

const SUBJECT_TONE: [string, Tone][] = [
  ['English', 'blue'], ['Math', 'green'], ['IPA', 'purple'], ['Calistung', 'pink'], ['Speaking', 'amber'], ['Afternoon', 'orange'], ['Intensif', 'blue'],
];
const subjectTone = (title: string): Tone => SUBJECT_TONE.find(([k]) => title.startsWith(k))?.[1] ?? 'slate';

// [hari, slot, kelas, ruang, tutor, terisi/kapasitas]
const RAW_SCHEDULE: [number, number, string, string, string, string][] = [
  [0, 0, 'English Primary 1A', 'Ruang 2', 'Fitri Handayani', '8/10'], [1, 0, 'Math Primary 2A', 'Ruang 3', 'Andi Saputra', '9/10'],
  [2, 0, 'English Primary 1B', 'Ruang 2', 'Fitri Handayani', '8/10'], [3, 0, 'IPA Junior 1A', 'Ruang 3', 'Dinda Puspita', '8/10'],
  [5, 0, 'Calistung A', 'Ruang 1', 'Siti Aisyah', '5/6'],
  [0, 1, 'Calistung A', 'Ruang 1', 'Siti Aisyah', '5/6'], [2, 1, 'Calistung B', 'Ruang 1', 'Siti Aisyah', '6/6'],
  [4, 1, 'English Teens A', 'Ruang 4', 'Muhammad Rizki', '10/12'], [5, 1, 'Calistung C', 'Ruang 1', 'Siti Aisyah', '6/6'],
  [0, 2, 'IPA Junior 1B', 'Ruang 3', 'Dinda Puspita', '9/10'], [1, 2, 'English Primary 2B', 'Ruang 2', 'Andi Saputra', '9/10'],
  [3, 2, 'IPA Junior 1B', 'Ruang 3', 'Dinda Puspita', '9/10'], [5, 2, 'Speaking Club', 'Ruang 4', 'Rani Putri', '6/8'],
  [0, 4, 'English Teens A', 'Ruang 4', 'Muhammad Rizki', '10/12'], [1, 4, 'English Teens B', 'Ruang 4', 'Muhammad Rizki', '11/12'],
  [3, 4, 'English Teens A', 'Ruang 4', 'Muhammad Rizki', '10/12'], [4, 4, 'English Teens B', 'Ruang 4', 'Muhammad Rizki', '11/12'],
  [0, 5, 'Math Primary 3A', 'Ruang 2', 'Fauzan Habibi', '9/10'], [1, 5, 'Math Primary 3B', 'Ruang 2', 'Fauzan Habibi', '8/10'],
  [2, 5, 'Math Primary 3A', 'Ruang 2', 'Fauzan Habibi', '9/10'], [3, 5, 'Math Primary 3B', 'Ruang 2', 'Fauzan Habibi', '8/10'],
  [4, 5, 'Afternoon Package', 'Ruang 5', 'Team Tutor', '10/10'], [5, 5, 'Afternoon Package', 'Ruang 5', 'Team Tutor', '10/10'],
  [0, 6, 'Intensif SMP', 'Ruang 4', 'Rani Putri', '9/12'], [1, 6, 'Intensif SMA', 'Ruang 4', 'Rani Putri', '9/12'],
  [2, 6, 'Intensif SMP', 'Ruang 4', 'Rani Putri', '9/12'], [3, 6, 'Intensif SMA', 'Ruang 4', 'Rani Putri', '9/12'],
  [4, 6, 'Speaking Club (Teens)', 'Ruang 4', 'Rani Putri', '6/8'],
];

export interface ScheduleEntry { id: string; day: number; slot: number; kelas: string; room: string; tutor: string; fill: string }
export const SCHEDULE: ScheduleEntry[] = RAW_SCHEDULE.map(([day, slot, kelas, room, tutor, fill], i) => ({ id: `JDW-${i + 1}`, day, slot, kelas, room, tutor, fill }));

/** Blok kalender per kelas (Jadwal Kelas) atau per tutor (Jadwal Tutor) */
export const toSession = (e: ScheduleEntry, mode: 'kelas' | 'tutor'): Session => ({
  id: e.id, day: e.day, slot: e.slot, tone: subjectTone(e.kelas),
  title: mode === 'kelas' ? e.kelas : e.kelas.split(' ')[0],
  lines: mode === 'kelas' ? [e.room, e.tutor, `${e.fill} siswa`] : [e.kelas.split(' ').slice(1).join(' ') || e.kelas, e.tutor, e.room.replace('Ruang ', 'R. ')],
});

export const SCHEDULE_NOTES: Record<string, string> = { '1-3': 'Persiapan Kelas', '2-3': 'Rapat Tutor', '3-3': 'Persiapan Kelas', '4-3': 'Persiapan Kelas', '5-3': 'Persiapan Kelas' };

/* ---------- Notifikasi ---------- */
export interface AdminNotif { id: string; category: string; title: string; desc: string; time: string; action?: string; to?: string; tone: Tone; unread: boolean }
export const NOTIFICATIONS: AdminNotif[] = [
  { id: 'N1', category: 'Siswa', title: '7 siswa baru menunggu proses pendaftaran', desc: 'Terdapat 7 calon siswa yang telah mengisi formulir dan menunggu verifikasi.', time: '10 menit yang lalu', action: 'Proses Pendaftaran', to: '/admin/pendaftaran', tone: 'red', unread: true },
  { id: 'N2', category: 'Keuangan', title: '23 siswa belum membayar SPP', desc: 'Total tagihan yang belum dibayarkan Rp 7.200.000', time: '25 menit yang lalu', action: 'Lihat Tagihan', to: '/admin/keuangan', tone: 'orange', unread: true },
  { id: 'N3', category: 'Tutor & Staff', title: '4 tutor belum mengisi absensi hari ini', desc: 'Mohon periksa kehadiran tutor sebelum jam 18.00', time: '50 menit yang lalu', action: 'Periksa Absensi', to: '/admin/kehadiran-tutor', tone: 'amber', unread: true },
  { id: 'N4', category: 'Kelas & Jadwal', title: 'Perubahan jadwal kelas English Primary 2A', desc: 'Kelas pada hari Selasa, 18 Juni 2025 diubah ke pukul 15:30 - 17:00', time: '1 jam yang lalu', action: 'Lihat Jadwal', to: '/admin/jadwal-kelas', tone: 'purple', unread: true },
  { id: 'N5', category: 'Komunikasi', title: '12 pesan baru dari wali murid', desc: 'Pesan terbaru dari wali murid mengenai berbagai hal', time: '2 jam yang lalu', action: 'Buka WhatsApp', to: '/admin/whatsapp', tone: 'green', unread: true },
  { id: 'N6', category: 'Sistem', title: 'Backup sistem berhasil dilakukan', desc: 'Backup otomatis harian telah selesai pada 09:00 WIB', time: '3 jam yang lalu', tone: 'blue', unread: true },
  { id: 'N7', category: 'Tutor & Staff', title: 'Izin tutor baru menunggu persetujuan', desc: 'Fitri Handayani mengajukan izin pada 20 Juni 2025', time: '5 jam yang lalu', action: 'Review Izin', to: '/admin/kehadiran-tutor', tone: 'teal', unread: true },
  { id: 'N8', category: 'Operasional', title: 'Stok buku Math Primary 1 hampir habis', desc: 'Sisa stok tinggal 5 unit', time: '1 hari yang lalu', tone: 'slate', unread: false },
];
