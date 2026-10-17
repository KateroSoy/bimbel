import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { toast } from 'sonner';
import { CalendarDays, ChevronDown, Download, Star, Award, TrendingUp, ArrowRight, BookOpen, PencilLine, FlaskConical } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, PageTitle, SubjectBadge } from '../../components/siswa/PortalUI';
import { cn } from '../../lib/utils';
import {
  STUDENT, SUBJECTS, GRADE_TREND, REPORT_SUMMARY, SUBJECT_DESCRIPTIONS, ATTENDANCE, type SubjectId,
} from '../../data/siswaPortal';
import { downloadReport } from '../../lib/pdfReport';

const STATUS_CLASS: Record<string, string> = { 'Sangat Baik': 'text-emerald-600', 'Baik': 'text-emerald-600', 'Perlu Perhatian': 'text-red-600' };
const PREDIKAT_CLASS: Record<string, string> = { A: 'bg-emerald-50 text-emerald-700', B: 'bg-blue-50 text-blue-700', C: 'bg-orange-50 text-orange-600' };

export default function NilaiSiswa() {
  const [semester, setSemester] = useState(STUDENT.semester);
  const [chartSubject, setChartSubject] = useState<SubjectId | 'all'>('all');
  const [period, setPeriod] = useState(6);

  const weakest = [...SUBJECTS].sort((a, b) => a.score - b.score)[0];
  // One series per subject, ending at its current score; "nilai" is the overall average
  const shown = chartSubject === 'all' ? SUBJECTS : SUBJECTS.filter((s) => s.id === chartSubject);
  const trend: Record<string, string | number>[] = GRADE_TREND.slice(-period).map((p, i) => ({
    ...p,
    ...Object.fromEntries(SUBJECTS.map((s) => [s.id, Math.max(40, Math.min(100, s.score - (period - 1 - i) * (s.trend >= 0 ? 3 : -1)))])),
  }));
  const gainKey = chartSubject === 'all' ? 'nilai' : chartSubject;
  const gain = trend.length ? Number(trend[trend.length - 1][gainKey]) - Number(trend[0][gainKey]) : 0;
  const [busy, setBusy] = useState(false);

  const downloadRapor = async () => {
    setBusy(true);
    const counts = {
      hadir: ATTENDANCE.filter((a) => a.status === 'Hadir' || a.status === 'Terlambat').length,
      izin: ATTENDANCE.filter((a) => a.status === 'Izin').length,
      sakit: ATTENDANCE.filter((a) => a.status === 'Sakit').length,
      alpha: ATTENDANCE.filter((a) => a.status === 'Alpha').length,
    };
    try {
      await downloadReport({
        filename: `rapor-${STUDENT.name.toLowerCase().replace(/\s+/g, '-')}-${semester.replace(/\W+/g, '-').toLowerCase()}`,
        title: 'LAPORAN HASIL BELAJAR',
        subtitle: `${semester}${STUDENT.program ? ` · Program ${STUDENT.program}` : ''}`,
        identity: [
          ['Nama Siswa', STUDENT.name], ['Level', STUDENT.level || '-'],
          ['ID Siswa', STUDENT.id], ['Sekolah Asal', STUDENT.school || '-'],
          ['Orang Tua/Wali', STUDENT.parents[0]?.name ?? '-'], ['Kelas Sekolah', STUDENT.schoolClass || '-'],
        ],
        sections: [
          {
            title: 'A. Rekap Nilai',
            head: ['No', 'Mata Pelajaran', 'Tutor', 'Nilai', 'Predikat', 'Deskripsi Capaian'],
            widths: [9, 32, 28, 13, 17, 'auto'], align: ['center', 'left', 'left', 'center', 'center', 'left'],
            body: [
              ...SUBJECTS.map((s, i) => [i + 1, s.name, s.tutor, s.score, s.predikat, SUBJECT_DESCRIPTIONS[s.id] ?? '-']),
              ['', 'Rata-rata', '', REPORT_SUMMARY.average, '', `Peringkat ${REPORT_SUMMARY.rank} dari ${REPORT_SUMMARY.classSize} siswa`],
            ],
          },
          {
            title: 'B. Rekap Kehadiran',
            head: ['Hadir', 'Izin', 'Sakit', 'Tanpa Keterangan', 'Total Sesi'],
            align: ['center', 'center', 'center', 'center', 'center'],
            body: [[`${counts.hadir} sesi`, `${counts.izin} sesi`, `${counts.sakit} sesi`, `${counts.alpha} sesi`, `${ATTENDANCE.length} sesi`]],
          },
        ],
        note: {
          title: 'C. Catatan',
          text: `Mata pelajaran terkuat: ${[...SUBJECTS].sort((a, b) => b.score - a.score)[0]?.name ?? '-'}. Fokus berikutnya: ${weakest?.name ?? '-'} (nilai ${weakest?.score ?? '-'}).`,
        },
      });
      toast.success('Rapor PDF diunduh');
    } catch {
      toast.error('Gagal membuat PDF. Coba lagi.');
    } finally {
      setBusy(false);
    }
  };

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
            <button onClick={() => void downloadRapor()} disabled={busy} className="flex items-center gap-2 h-10 px-4 rounded-xl bg-white border border-slate-200 text-sm font-bold text-[#0F1E4A] hover:bg-slate-50 disabled:opacity-60">
              <Download className="w-4 h-4" /> {busy ? 'Menyiapkan PDF…' : 'Unduh Rapor (PDF)'}
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
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trend} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                    <CartesianGrid stroke="#EEF2F7" vertical={false} />
                    <XAxis dataKey="bulan" tick={{ fontSize: 11, fill: '#334155' }} axisLine={false} tickLine={false} />
                    <YAxis domain={[40, 100]} ticks={[40, 60, 80, 100]} tick={{ fontSize: 11, fill: '#334155' }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12 }} />
                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, fontWeight: 700 }} />
                    {shown.map((s) => (
                      <Line key={s.id} type="monotone" dataKey={s.id} name={s.name} stroke={s.color} strokeWidth={2.5} dot={{ r: 3, fill: s.color }} activeDot={{ r: 5 }} />
                    ))}
                    {chartSubject === 'all' && <Line type="monotone" dataKey="nilai" name="Rata-rata" stroke="#0F1E4A" strokeWidth={2} strokeDasharray="5 4" dot={false} />}
                  </LineChart>
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

    </DashboardLayout>
  );
}
