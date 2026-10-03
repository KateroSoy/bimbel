// Tipe dan konstanta tampilan portal Admin. Datanya berasal dari API (/api/r/<resource>), bukan dari berkas ini.
import type { Session, Tone } from '../components/portal/Kit';
import { useRemote } from '../store/useRemote';

export const PROGRAM_TONE: Record<string, Tone> = {
  'English Primary': 'blue', 'Math Primary': 'green', Combo: 'orange', Intensif: 'purple', 'English Teens': 'blue',
  'IPA Junior': 'teal', Calistung: 'pink', Playclub: 'amber', 'Afternoon Package': 'orange', 'Speaking Club': 'amber', 'SMP Intensif': 'purple',
  Administrasi: 'slate', Keuangan: 'slate', 'Customer Service': 'slate', 'IT Support': 'slate',
};
export const programTone = (p: string): Tone => PROGRAM_TONE[p] ?? 'blue';

/* ---------- Siswa (resource: students) ---------- */
export interface AdminStudent {
  id: string; name: string; gender: 'L' | 'P'; program: string; kelas: string; dob: string; age: number;
  parent: string; phone: string; status: 'Aktif' | 'Nonaktif' | 'Lulus';
}

/* ---------- Pendaftaran (resource: registrations) ---------- */
export type RegStatus = 'Dalam Proses' | 'Menunggu Verifikasi' | 'Diterima' | 'Ditolak';
export interface Registration {
  id: string; date: string; time: string; name: string; gender: 'L' | 'P'; age: number; program: string;
  source: string; status: RegStatus; stage: string; stageNote: string;
}

/* ---------- Orang tua / wali (resource: guardians) ---------- */
export interface ParentRow {
  id: string; name: string; child: string; relation: string; phone: string; email: string; address: string; status: 'Aktif' | 'Nonaktif';
}

/* ---------- Tutor & staff (resource: staff) ---------- */
export interface StaffRow {
  id: string; name: string; email: string; role: 'Tutor' | 'Staff'; programs: string[]; phone: string;
  status: 'Aktif' | 'Nonaktif'; joined: string; avatar?: string;
}
/** Foto tutor dari data staff yang sudah dimuat (halaman pemanggil memuat resource `staff`). */
export const staffAvatar = (name: string): string | undefined =>
  (useRemote.getState().entries.staff?.rows as StaffRow[] | undefined)?.find((s) => s.name.startsWith(name.split(',')[0]))?.avatar || undefined;

/* ---------- Kehadiran tutor (resource: tutor-attendances) ---------- */
export type AttStatus = 'Hadir' | 'Terlambat' | 'Tidak Hadir' | 'Izin' | 'Sakit';
export interface TutorAttendance {
  id: string; name: string; program: string; code: string; room: string; schedule: string; checkIn: string; checkOut: string;
  status: AttStatus; note: string;
}

/* ---------- Beban mengajar (resource: workloads) ---------- */
export type LoadStatus = 'Optimal' | 'Cukup' | 'Ringan' | 'Maksimal' | 'Tidak Mengajar';
export interface Workload { id: string; name: string; classes: string[]; classCount: number; hours: string; sessions: number; pct: number; status: LoadStatus; note: string }

/* ---------- Program (resource: programs) ---------- */
export interface ProgramRow {
  id: string; name: string; level: string; category: string; desc: string; sessions: number; minutes: number; fee: number;
  classes: number; students: number; status: 'Aktif' | 'Nonaktif' | 'Arsip';
}
export const CATEGORY_TONE: Record<string, Tone> = { 'Early Learning': 'purple', Calistung: 'pink', Akademik: 'green', Bahasa: 'blue', Paket: 'orange' };

/* ---------- Kelas & rombel (resources: class-levels, rombels) ---------- */
export interface LevelRow { id: string; name: string; sub: string; level: string; rombel: number; students: number; capacity: number; status: 'Aktif' | 'Nonaktif' }
export interface RombelRow { id: string; name: string; level: string; tutor: string; room: string; students: number; capacity: number; status: 'Aktif' | 'Nonaktif' }

/* ---------- Ruang (resource: rooms) ---------- */
export interface RoomRow { id: string; name: string; type: string; floor: string; capacity: number; used: number; status: 'Aktif' | 'Nonaktif'; condition: string }

/* ---------- Keuangan (resources: bills, payments, debts, expenses, honors) ---------- */
export type BillStatus = 'Lunas' | 'Belum Lunas' | 'Terlambat';
export interface BillRow { id: string; name: string; program: string; kelas: string; amount: number; discount: number; paid: number; due: string; status: BillStatus; verification?: string; method?: string }

export type PayStatus = 'Berhasil' | 'Tertunda' | 'Gagal' | 'Refund';
export interface PaymentRow { id: string; date: string; time: string; name: string; sid: string; program: string; method: string; channel: string; bill: number; paid: number; discount: number; status: PayStatus }

export type DebtStatus = 'Jatuh Tempo' | 'Lalu Jatuh Tempo' | 'Sebagian Dibayar' | 'Lunas';
export interface DebtRow { id: string; name: string; program: string; total: number; paid: number; due: string; late: number; status: DebtStatus }

export interface ExpenseRow { id: string; date: string; time: string; category: string; note: string; method: string; channel: string; amount: number; status: 'Dibayar' | 'Tertunda' }
export const EXPENSE_CATEGORIES = ['Gaji & Honor', 'Sewa & Utilitas', 'ATK & Perlengkapan', 'Promosi & Marketing', 'Kebersihan & Keamanan', 'Perawatan & Perbaikan', 'Internet & Telepon', 'Pelatihan & Pengembangan', 'Konsumsi', 'Lain-lain'];

export type HonorStatus = 'Lunas' | 'Sebagian Dibayar' | 'Belum Dibayar';
export interface HonorRow { id: string; name: string; program: string; level: string; sessions: number; total: number; paid: number }
export const honorStatus = (h: HonorRow): HonorStatus => (h.paid >= h.total ? 'Lunas' : h.paid > 0 ? 'Sebagian Dibayar' : 'Belum Dibayar');

/* ---------- Jadwal (resource: schedules) ---------- */
export const TIME_SLOTS = ['07:00 - 08:30', '08:30 - 10:00', '10:00 - 11:30', '13:00 - 14:30', '14:30 - 16:00', '16:00 - 17:30', '18:30 - 20:00'];
export const DAY_NAMES = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

/** Senin–Minggu dari pekan berjalan, untuk kepala kolom kalender. */
export const currentWeek = (today = new Date()) => {
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
  return DAY_NAMES.map((name, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return { name, date: d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }), full: d };
  });
};
/** Indeks hari ini pada kalender Senin–Minggu (0 = Senin). */
export const todayIndex = (today = new Date()) => (today.getDay() + 6) % 7;
export const weekLabel = (today = new Date()) => {
  const w = currentWeek(today);
  return `${w[0].full.getDate()} - ${w[6].full.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`;
};

const SUBJECT_TONE: [string, Tone][] = [
  ['English', 'blue'], ['Math', 'green'], ['IPA', 'purple'], ['Calistung', 'pink'], ['Speaking', 'amber'], ['Afternoon', 'orange'], ['Intensif', 'blue'],
];
const subjectTone = (title: string): Tone => SUBJECT_TONE.find(([k]) => title.startsWith(k))?.[1] ?? 'slate';

export interface ScheduleEntry { id: string; day: number; slot: number; kelas: string; room: string; tutor: string; fill: string }

/** Blok kalender per kelas (Jadwal Kelas) atau per tutor (Jadwal Tutor) */
export const toSession = (e: ScheduleEntry, mode: 'kelas' | 'tutor'): Session => ({
  id: e.id, day: e.day, slot: e.slot, tone: subjectTone(e.kelas),
  title: mode === 'kelas' ? e.kelas : e.kelas.split(' ')[0],
  lines: mode === 'kelas' ? [e.room, e.tutor, `${e.fill} siswa`] : [e.kelas.split(' ').slice(1).join(' ') || e.kelas, e.tutor, (e.room ?? '').replace('Ruang ', 'R. ')],
});

/* ---------- Notifikasi (resource: admin-notifications) ---------- */
export interface AdminNotif { id: string; category: string; title: string; desc: string; time: string; action?: string; to?: string; tone: Tone; unread: boolean }
