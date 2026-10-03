// Tipe dan konstanta tampilan portal Tutor. Datanya berasal dari API (/api/r/<resource>), bukan dari berkas ini.
import type { Session, Tone } from '../components/portal/Kit';

/* ---------- Kelas (resource: tutor-classes) ---------- */
export interface TutorClass { id: string; name: string; code: string; subject: string; days: string; time: string; students: number; status: 'Aktif' | 'Akan Datang' | 'Selesai'; tone: Tone }

/* ---------- Jadwal mengajar (resource: teach-sessions) ---------- */
export const TEACH_SLOTS = ['09.00 – 10.30', '11.00 – 12.30', '13.00 – 14.30', '14.00 – 15.30', '16.00 – 18.00', '18.30 – 20.30'];
export const TEACH_DAY_NAMES = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
export interface TeachRow { id: string; day: number; slot: number; subject: string; kelas: string; room: string; mark?: 'next' | 'clash' | null }
export interface TeachSession extends Session { subject: string; kelas: string; room: string; mark?: 'next' | 'clash' | null }

const TONES: Tone[] = ['green', 'teal', 'purple', 'orange', 'blue', 'pink'];
/** Warna blok jadwal: tetap per nama kelas. */
export const classTone = (kelas: string, all: string[]): Tone => TONES[Math.max(0, [...new Set(all)].sort().indexOf(kelas)) % TONES.length];
export const toTeachSession = (r: TeachRow, all: string[]): TeachSession => ({
  ...r, title: r.subject, lines: [r.kelas, TEACH_SLOTS[r.slot] ?? ''], tone: r.mark === 'clash' ? 'red' : classTone(r.kelas, all),
});

/** Jam mulai/selesai (desimal) dari label slot "09.00 – 10.30". */
export const slotHours = (slot: string): [number, number] => {
  const [a, b] = slot.split(' – ').map((t) => Number(t.slice(0, 2)) + Number(t.slice(3)) / 60);
  return [a, b];
};
/** Status sesi hari ini relatif terhadap jam sekarang. */
export const sessionStatus = (slot: string, now = new Date()): string => {
  const [start, end] = slotHours(slot);
  const hour = now.getHours() + now.getMinutes() / 60;
  if (hour >= end) return 'Selesai';
  if (hour >= start) return 'Berlangsung';
  const minutes = Math.round((start - hour) * 60);
  return minutes < 60 ? `${minutes} menit lagi` : `${Math.round(minutes / 60)} jam lagi`;
};

/* ---------- Materi (resources: materials, modules) ---------- */
export interface MaterialRow { id: string; kelas: string; subject: string; students: number; status: 'Published' | 'Draft'; last: string; date: string; progress: number; done: number; planned: number; color: string }
export interface ModuleRow { id: string; title: string; kelas: string; topics: number; updated: string; status: string }

/* ---------- Siswa (resource: class-students) ---------- */
export interface TutorStudent { id: string; name: string; kelas: string; subject: string; attendance: number; score: number; progress: number; avatar?: string }
export const studentStatus = (s: TutorStudent) => (s.score < 75 || s.attendance < 76 ? 'Perlu Perhatian' : 'Aktif');
export const gradeStatus = (s: TutorStudent) => (s.score >= 90 ? 'Sangat Baik' : s.score >= 72 ? 'Baik' : 'Perlu Perhatian');

/* ---------- Presensi (resource: presences) ---------- */
export type Presence = 'Hadir' | 'Terlambat' | 'Izin' | 'Sakit' | 'Alpa';
export const PRESENCE_COLOR: Record<Presence, string> = { Hadir: '#16A34A', Terlambat: '#F97316', Izin: '#F59E0B', Sakit: '#1D4ED8', Alpa: '#EF4444' };
export interface PresenceRow { id: string; name: string; status: Presence; note: string; time: string }

/* ---------- Siswa perlu perhatian (resource: attention-cases) ---------- */
export type Risk = 'Risiko Tinggi' | 'Risiko Sedang' | 'Membaik' | 'Remedial Aktif';
export interface AttentionRow { id: string; name: string; kelas: string; subject: string; issue: string; issueSub: string; stats: [string, string][]; risk: Risk; trend: number; note: string }

/* ---------- Bank soal (resource: questions) ---------- */
export interface QuestionRow { id: string; text: string; type: 'Pilihan Ganda' | 'Uraian'; subject: string; topic: string; grade: string; level: 'Mudah' | 'Sedang' | 'Sulit'; mine: boolean; fav: boolean }

/* ---------- AI bahan ajar (resource: ai-results) ---------- */
export const AI_TYPES = ['Worksheet', 'Modul', 'Quiz / Soal', 'Presentasi', 'RPP / ATP', 'Infografis', 'Lainnya'];
export interface AiResult { id: string; title: string; subject: string; grade: string; type: string; created: string; date: string; fav: boolean; body: string }

/* ---------- Pengumuman (resource: announcements) ---------- */
export interface AnnouncementRow { id: string; title: string; body: string; date: string; author: string; category: 'Pengumuman' | 'Kegiatan Sekolah' | 'Informasi' | 'Agenda' | 'Tugas'; important?: boolean; unread: boolean; tone: Tone }

/* ---------- Pesan (resource: conversations) ---------- */
export interface ChatMessage { from: 'me' | 'them'; text: string; time: string }
export interface Conversation { id: string; name: string; role: string; time: string; preview: string; unread: number; starred: boolean; avatar?: string; messages: ChatMessage[] }

export interface Achievement { title: string; desc: string; date: string; tone: Tone }
