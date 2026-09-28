import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { CalendarDays, ChevronDown, Download, Star, Award, TrendingUp, ArrowRight, BookOpen, PencilLine, FlaskConical } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, PageTitle, SubjectBadge } from '../../components/siswa/PortalUI';
import { cn } from '../../lib/utils';
import {
  STUDENT, SUBJECTS, GRADE_TREND, REPORT_SUMMARY, SUBJECT_DESCRIPTIONS, ATTENDANCE, type SubjectId,
} from '../../data/siswaPortal';

const STATUS_CLASS: Record<string, string> = { 'Sangat Baik': 'text-emerald-600', 'Baik': 'text-emerald-600', 'Perlu Perhatian': 'text-red-600' };
const PREDIKAT_CLASS: Record<string, string> = { A: 'bg-emerald-50 text-emerald-700', B: 'bg-blue-50 text-blue-700', C: 'bg-orange-50 text-orange-600' };

export default function NilaiSiswa() {
  const [semester, setSemester] = useState(STUDENT.semester);
  const [chartSubject, setChartSubject] = useState<SubjectId | 'all'>('all');
  const [period, setPeriod] = useState(6);

  const weakest = [...SUBJECTS].sort((a, b) => a.score - b.score)[0];
  const trend = GRADE_TREND.slice(-period).map((p, i) => {
    if (chartSubject === 'all') return p;
    const s = SUBJECTS.find((x) => x.id === chartSubject)!;
    return { ...p, nilai: Math.max(40, Math.min(100, s.score - (period - 1 - i) * (s.trend >= 0 ? 3 : -1))) };
  });
  const gain = trend[trend.length - 1].nilai - trend[0].nilai;

  return (
    <DashboardLayout>
      <div className="max-w-[1400px] space-y-3">
        <PageTitle
          title="Hasil Belajar"
          subtitle="Pantau perkembangan belajarmu"
          actions={<>
            <label className="relative flex items-center gap-2 h-10 pl-3 pr-8 rounded-xl bg-white border border-slate-200 text-sm font-bold text-[#0F1E4A]">
              <CalendarDays className="w-4 h-4" />
              <select value={semester} onChange={(e) => setSemester(e.target.value)} className="appearance-none bg-transparent focus:outline-none">
                <option>Semester 1 (2025)</option>
                <option>Semester 2 (2024)</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-2.5 pointer-events-none" />
            </label>
            <button onClick={() => window.print()} className="flex items-center gap-2 h-10 px-4 rounded-xl bg-white border border-slate-200 text-sm font-bold text-[#0F1E4A] hover:bg-slate-50">
              <Download className="w-4 h-4" /> Unduh / Cetak Rapor
            </button>
          </>}
        />

        {/* Summary */}
        <Card className="grid grid-cols-1 md:grid-cols-3 md:divide-x divide-slate-100 py-4">
          <div className="flex items-center gap-4 px-6 py-2">
            <span className="w-16 h-16 rounded-full bg-blue-50 text-[#1D4ED8] flex items-center justify-center"><Star className="w-8 h-8" /></span>
            <div>
              <p className="text-sm font-bold text-[#0F1E4A]">Rata-rata Nilai</p>
              <p className="text-[32px] leading-none font-extrabold text-[#1D4ED8]">{REPORT_SUMMARY.average} <span className="text-lg text-[#0F1E4A] font-bold">/ 100</span></p>
              <span className="inline-block mt-1.5 text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700">Baik</span>
            </div>
          </div>
          <div className="flex items-center gap-4 px-6 py-2">
            <span className="w-16 h-16 rounded-full bg-violet-50 text-violet-600 flex items-center justify-center"><Award className="w-8 h-8" /></span>
            <div>
              <p className="text-sm font-bold text-[#0F1E4A]">Peringkat Kelas</p>
              <p className="text-[32px] leading-none font-extrabold text-violet-700">{REPORT_SUMMARY.rank} <span className="text-lg text-[#0F1E4A] font-bold">dari {REPORT_SUMMARY.classSize}</span></p>
              <span className="inline-block mt-1.5 text-xs font-bold px-2 py-0.5 rounded-md bg-violet-50 text-violet-700">Top {REPORT_SUMMARY.topPercent}%</span>
            </div>
          </div>
          <div className="flex items-center gap-4 px-6 py-2">
            <span className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center"><TrendingUp className="w-8 h-8" /></span>
            <div>
              <p className="text-sm font-bold text-[#0F1E4A]">Status</p>
              <p className="text-[28px] leading-none font-extrabold text-emerald-600">{REPORT_SUMMARY.status}</p>
              <p className="text-xs text-slate-600 font-medium mt-1">Terus pertahankan!</p>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_1fr] gap-3">
          <Card className="p-4 flex flex-col">
            <h2 className="text-base font-extrabold text-[#0F1E4A] mb-3">Nilai Mata Pelajaran</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs font-bold text-slate-700 border-b border-slate-100">
                  <th className="py-2 font-bold">Mata Pelajaran</th><th className="py-2 font-bold text-center">Nilai</th><th className="py-2 font-bold text-center">Predikat</th><th className="py-2 font-bold text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {SUBJECTS.map((s) => (
                  <tr key={s.id}>
                    <td className="py-2.5"><span className="flex items-center gap-2.5 font-bold text-[#0F1E4A]"><SubjectBadge subject={s} size="sm" /> {s.name}</span></td>
                    <td className={cn('py-2.5 text-center text-lg font-extrabold', s.score < 70 ? 'text-red-600' : 'text-[#0F1E4A]')}>{s.score}</td>
                    <td className="py-2.5 text-center"><span className={cn('inline-flex w-7 h-7 items-center justify-center rounded-md font-extrabold', PREDIKAT_CLASS[s.predikat])}>{s.predikat}</span></td>
                    <td className={cn('py-2.5 text-center font-bold', STATUS_CLASS[s.status])}>{s.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Link to="/siswa/course" className="mt-auto pt-3 self-center text-sm font-bold text-[#1D4ED8] flex items-center gap-1.5 hover:underline">Lihat Detail Belajar <ArrowRight className="w-4 h-4" /></Link>
          </Card>

          <div className="space-y-3">
            <Card className="p-4">
              <div className="flex flex-wrap items-end justify-between gap-2 mb-2">
                <h2 className="text-base font-extrabold text-[#0F1E4A]">Perkembangan Nilai</h2>
                <div className="flex gap-2">
                  <label className="text-[11px] font-bold text-slate-600">Mata Pelajaran
                    <select value={chartSubject} onChange={(e) => setChartSubject(e.target.value as SubjectId | 'all')} className="block mt-0.5 h-8 px-2 rounded-lg border border-slate-200 text-xs font-bold text-[#0F1E4A]">
                      <option value="all">Semua Pelajaran</option>
                      {SUBJECTS.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </label>
                  <label className="text-[11px] font-bold text-slate-600">Periode
                    <select value={period} onChange={(e) => setPeriod(Number(e.target.value))} className="block mt-0.5 h-8 px-2 rounded-lg border border-slate-200 text-xs font-bold text-[#0F1E4A]">
                      <option value={6}>6 Bulan</option>
                      <option value={3}>3 Bulan</option>
                    </select>
                  </label>
                </div>
              </div>
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trend} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="nilaiFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#1D4ED8" stopOpacity={0.18} />
                        <stop offset="100%" stopColor="#1D4ED8" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#EEF2F7" vertical={false} />
                    <XAxis dataKey="bulan" tick={{ fontSize: 11, fill: '#334155' }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 100]} ticks={[0, 20, 40, 60, 80, 100]} tick={{ fontSize: 11, fill: '#334155' }} axisLine={false} tickLine={false} />
                    <Tooltip formatter={(v) => [`${v}`, 'Nilai']} />
                    <Area type="linear" dataKey="nilai" stroke="#1D4ED8" strokeWidth={2.5} fill="url(#nilaiFill)" dot={{ r: 4, fill: '#1D4ED8' }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 rounded-xl bg-[#EEF3FF] px-3 py-2 flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-[#1D4ED8]" />
                <p className="text-sm font-medium text-slate-700"><b className="text-[#1D4ED8]">Nilaimu {gain >= 0 ? 'meningkat' : 'turun'} {gain >= 0 ? '+' : ''}{gain} poin</b> dalam {period} bulan terakhir.</p>
              </div>
            </Card>

            <Card className="p-4">
              <h2 className="text-base font-extrabold text-[#0F1E4A] mb-2">Perlu Ditingkatkan</h2>
              <div className="flex items-start gap-3">
                <span className="w-11 h-11 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: weakest.color }}><FlaskConical className="w-5 h-5" /></span>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-extrabold text-[#0F1E4A]">{weakest.name}</p>
                    <span className="text-sm font-bold text-red-600 border border-red-200 rounded px-1.5">{weakest.score}</span>
                    <span className="text-sm font-bold text-red-600">({weakest.status})</span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium">Disarankan mempelajari kembali materi:</p>
                  <p className="text-sm font-bold text-[#0F1E4A]">Light and Shadows</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                <Link to="/siswa/course/science-p3" className="h-9 px-4 rounded-lg bg-[#1D4ED8] text-white text-sm font-bold flex items-center gap-2"><BookOpen className="w-4 h-4" /> Pelajari Materi</Link>
                <Link to="/siswa/course/science-p3?materi=s3-4" className="h-9 px-4 rounded-lg border border-[#1D4ED8] text-[#1D4ED8] text-sm font-bold flex items-center gap-2"><PencilLine className="w-4 h-4" /> Latihan Soal</Link>
              </div>
            </Card>
          </div>
        </div>

        <Card className="px-4 py-3 bg-[#F5F8FF] border-blue-100 text-center text-sm font-medium text-slate-700">
          💡 Belajar sedikit demi sedikit setiap hari akan membawa hasil yang luar biasa! 💙
        </Card>
      </div>

      {createPortal(<RaporPrint semester={semester} />, document.body)}
    </DashboardLayout>
  );
}

/** Lembar rapor A4 — hanya tampil saat dicetak (lihat .print-root di index.css). */
function RaporPrint({ semester }: { semester: string }) {
  const counts = {
    hadir: ATTENDANCE.filter((a) => a.status === 'Hadir' || a.status === 'Terlambat').length,
    izin: ATTENDANCE.filter((a) => a.status === 'Izin').length,
    sakit: ATTENDANCE.filter((a) => a.status === 'Sakit').length,
    alpha: ATTENDANCE.filter((a) => a.status === 'Alpha').length,
  };
  const cell = 'border border-slate-400 px-2 py-1.5';

  return (
    <div className="print-root text-[11pt] text-black" style={{ fontFamily: '"Plus Jakarta Sans", Arial, sans-serif' }}>
      <div className="flex items-center gap-4 border-b-[3px] border-double border-black pb-3 mb-4">
        <img src="/assets/brand/studyhack-emblem.png" alt="" style={{ height: 64 }} />
        <div className="flex-1">
          <p className="text-[16pt] font-extrabold leading-tight">STUDYHACK EDUCATION CENTER</p>
          <p className="text-[9.5pt]">Jl. Pendidikan No. 123, Kota Bandung · 0823-2456-7906 · info@studyhack.co.id</p>
        </div>
        <div className="text-right text-[9pt]"><p className="font-bold">LearnSpace+</p><p>Portal Belajar Siswa</p></div>
      </div>

      <p className="text-center text-[14pt] font-extrabold tracking-wide">LAPORAN HASIL BELAJAR</p>
      <p className="text-center text-[10pt] mb-4">{semester} · Program {STUDENT.program}</p>

      <table className="w-full text-[10pt] mb-4">
        <tbody>
          <tr><td className="w-36 py-0.5">Nama Siswa</td><td>: <b>{STUDENT.name}</b></td><td className="w-32">Level</td><td>: {STUDENT.level}</td></tr>
          <tr><td className="py-0.5">ID Siswa</td><td>: {STUDENT.id}</td><td>Sekolah Asal</td><td>: {STUDENT.school}</td></tr>
          <tr><td className="py-0.5">Orang Tua/Wali</td><td>: {STUDENT.parents[0].name}</td><td>Kelas Sekolah</td><td>: {STUDENT.schoolClass}</td></tr>
        </tbody>
      </table>

      <p className="font-bold text-[10.5pt] mb-1">A. Nilai Akademik</p>
      <table className="w-full border-collapse text-[10pt] mb-4">
        <thead className="bg-slate-100">
          <tr>
            <th className={`${cell} w-8`}>No</th><th className={`${cell} text-left`}>Mata Pelajaran</th><th className={`${cell} w-28 text-left`}>Tutor</th>
            <th className={`${cell} w-14`}>Nilai</th><th className={`${cell} w-16`}>Predikat</th><th className={`${cell} text-left`}>Deskripsi Capaian</th>
          </tr>
        </thead>
        <tbody>
          {SUBJECTS.map((s, i) => (
            <tr key={s.id} style={{ breakInside: 'avoid' }}>
              <td className={`${cell} text-center`}>{i + 1}</td>
              <td className={cell}>{s.name}</td>
              <td className={cell}>{s.tutor}</td>
              <td className={`${cell} text-center font-bold`}>{s.score}</td>
              <td className={`${cell} text-center`}>{s.predikat}</td>
              <td className={`${cell} text-[9pt]`}>{SUBJECT_DESCRIPTIONS[s.id]}</td>
            </tr>
          ))}
          <tr>
            <td className={`${cell} font-bold text-right`} colSpan={3}>Rata-rata</td>
            <td className={`${cell} text-center font-bold`}>{REPORT_SUMMARY.average}</td>
            <td className={cell} colSpan={2}>Peringkat {REPORT_SUMMARY.rank} dari {REPORT_SUMMARY.classSize} siswa</td>
          </tr>
        </tbody>
      </table>

      <div className="grid grid-cols-2 gap-6 mb-4" style={{ breakInside: 'avoid' }}>
        <div>
          <p className="font-bold text-[10.5pt] mb-1">B. Kehadiran</p>
          <table className="w-full border-collapse text-[10pt]">
            <tbody>
              <tr><td className={cell}>Hadir</td><td className={`${cell} text-center w-20`}>{counts.hadir} sesi</td></tr>
              <tr><td className={cell}>Izin</td><td className={`${cell} text-center`}>{counts.izin} sesi</td></tr>
              <tr><td className={cell}>Sakit</td><td className={`${cell} text-center`}>{counts.sakit} sesi</td></tr>
              <tr><td className={cell}>Tanpa Keterangan</td><td className={`${cell} text-center`}>{counts.alpha} sesi</td></tr>
            </tbody>
          </table>
        </div>
        <div>
          <p className="font-bold text-[10.5pt] mb-1">C. Catatan Tutor</p>
          <div className="border border-slate-400 p-2 text-[9.5pt] leading-relaxed min-h-[110px]">
            Andi menunjukkan perkembangan yang baik, terutama pada English dan Bahasa Indonesia. Fokus semester berikutnya:
            memperkuat Science (materi cahaya & bayangan) dan membiasakan latihan soal cerita Matematika.
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 text-center text-[10pt] mt-8" style={{ breakInside: 'avoid' }}>
        <div className="flex flex-col h-32"><p>&nbsp;</p><p>Orang Tua/Wali</p><p className="mt-auto font-bold underline">{STUDENT.parents[0].name}</p></div>
        <div className="flex flex-col h-32"><p>&nbsp;</p><p>Tutor Pembimbing</p><p className="mt-auto font-bold underline">{SUBJECTS[1].tutor}</p></div>
        <div className="flex flex-col h-32"><p>Bandung, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p><p>Kepala Bimbel</p><p className="mt-auto font-bold underline">StudyHack Education</p></div>
      </div>
    </div>
  );
}
