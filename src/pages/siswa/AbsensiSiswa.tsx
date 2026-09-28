import { useState } from 'react';
import { CheckCircle2, Clock, XCircle, MinusCircle, Download, CalendarDays, ChevronDown, MoreVertical } from 'lucide-react';
import { toast } from 'sonner';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, PageTitle, Pill, statusTone } from '../../components/siswa/PortalUI';
import { ATTENDANCE, SUBJECTS, STUDENT, subjectById, type SubjectId } from '../../data/siswaPortal';

const PAGE = 5;

export default function AbsensiSiswa() {
  const [subject, setSubject] = useState<SubjectId | 'all'>('all');
  const [range, setRange] = useState('1 Mei – 31 Agustus 2025');
  const [shown, setShown] = useState(PAGE);
  const [menuFor, setMenuFor] = useState<string | null>(null);

  const rows = ATTENDANCE.filter((a) => subject === 'all' || a.subjectId === subject);
  const total = rows.length || 1;
  const n = (fn: (s: string) => boolean) => rows.filter((a) => fn(a.status)).length;
  const hadir = n((s) => s === 'Hadir');
  const telat = n((s) => s === 'Terlambat');
  const izin = n((s) => s === 'Izin' || s === 'Sakit');
  const alpha = n((s) => s === 'Alpha');
  const pct = (v: number) => `${Math.round((v / total) * 100)}%`;

  const cards = [
    { label: 'Hadir', value: pct(hadir + telat), sub: 'Presentase Kehadiran', icon: CheckCircle2, fg: '#16A34A', bg: '#E9F8EF' },
    { label: 'Terlambat', value: pct(telat), sub: `${telat} sesi`, icon: Clock, fg: '#F97316', bg: '#FFF1E7' },
    { label: 'Izin / Sakit', value: pct(izin), sub: `${izin} sesi`, icon: XCircle, fg: '#DC2626', bg: '#FDECEC' },
    { label: 'Alpha', value: pct(alpha), sub: `${alpha} sesi`, icon: MinusCircle, fg: '#475569', bg: '#F1F5F9' },
  ];

  const downloadCsv = () => {
    const header = ['Tanggal', 'Kelas', 'Mata Pelajaran', 'Topik', 'Guru', 'Jam', 'Status', 'Catatan'];
    const lines = rows.map((a) => {
      const s = subjectById(a.subjectId);
      return [`${a.date} ${a.month} 2025`, s.className, s.name, a.topic, s.tutor, a.time, a.status, a.note ?? '-'];
    });
    const csv = [header, ...lines].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `Rekap_Kehadiran_${STUDENT.name.replace(/\s+/g, '_')}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Rekap kehadiran diunduh');
  };

  return (
    <DashboardLayout>
      <div className="max-w-[1400px] space-y-3">
        <PageTitle title="Kehadiran" subtitle="Pantau kehadiran di setiap kelas dan sesi belajar." />

        <Card className="p-3 flex flex-wrap items-center gap-2">
          <label className="relative">
            <select value={subject} onChange={(e) => { setSubject(e.target.value as SubjectId | 'all'); setShown(PAGE); }}
              className="appearance-none h-11 pl-4 pr-10 rounded-xl border border-slate-200 bg-white text-sm font-bold text-[#0F1E4A] min-w-[200px]">
              <option value="all">Semua Kelas</option>
              {SUBJECTS.map((s) => <option key={s.id} value={s.id}>{s.className}</option>)}
            </select>
            <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500" />
          </label>
          <label className="relative flex items-center">
            <CalendarDays className="w-4 h-4 absolute left-3 text-slate-600 pointer-events-none" />
            <select value={range} onChange={(e) => setRange(e.target.value)} className="appearance-none h-11 pl-9 pr-10 rounded-xl border border-slate-200 bg-white text-sm font-bold text-[#0F1E4A]">
              <option>1 Mei – 31 Agustus 2025</option>
              <option>1 – 31 Agustus 2025</option>
              <option>1 – 31 Juli 2025</option>
            </select>
            <ChevronDown className="w-4 h-4 absolute right-3 pointer-events-none text-slate-500" />
          </label>
          <div className="flex-1" />
          <button onClick={downloadCsv} className="flex items-center gap-2 h-11 px-5 rounded-xl border border-slate-200 bg-white text-sm font-bold text-[#0F1E4A] hover:bg-slate-50">
            <Download className="w-4 h-4" /> Unduh Rekap
          </button>
        </Card>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {cards.map(({ label, value, sub, icon: Icon, fg, bg }) => (
            <Card key={label} className="p-4 flex items-start gap-4">
              <span className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: bg, color: fg }}><Icon className="w-7 h-7" /></span>
              <div>
                <p className="text-sm font-bold text-[#0F1E4A]">{label}</p>
                <p className="text-3xl font-extrabold leading-tight" style={{ color: fg }}>{value}</p>
                <p className="text-xs text-slate-600 font-medium">{sub}</p>
              </div>
            </Card>
          ))}
        </div>

        <Card className="overflow-hidden">
          <h2 className="px-4 pt-4 pb-2 text-base font-extrabold text-[#0F1E4A]">Riwayat Kehadiran</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[860px]">
              <thead>
                <tr className="text-left text-xs font-bold text-slate-700 border-b border-slate-100">
                  <th className="px-4 py-2">Tanggal</th><th className="px-2 py-2">Kelas</th><th className="px-2 py-2">Mata Pelajaran</th>
                  <th className="px-2 py-2">Guru</th><th className="px-2 py-2">Status</th><th className="px-2 py-2">Catatan</th><th className="w-10" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.slice(0, shown).map((a) => {
                  const s = subjectById(a.subjectId);
                  return (
                    <tr key={a.id}>
                      <td className="px-4 py-2.5">
                        <span className="inline-flex flex-col items-center w-12 rounded-lg border border-slate-200 py-1 leading-tight">
                          <span className="text-[9px] font-bold text-slate-600">{a.day}</span>
                          <span className="text-base font-extrabold text-[#0F1E4A]">{a.date}</span>
                          <span className="text-[9px] font-bold text-slate-600">{a.month}</span>
                        </span>
                      </td>
                      <td className="px-2"><p className="font-bold text-[#0F1E4A]">{s.className}</p><p className="text-xs text-slate-600">{a.time}</p></td>
                      <td className="px-2"><p className="font-bold text-[#0F1E4A]">{s.name}</p><p className="text-xs text-slate-600">{a.topic}</p></td>
                      <td className="px-2"><span className="flex items-center gap-2"><img src={s.tutorAvatar} alt="" className="w-9 h-9 rounded-full object-cover bg-slate-100" /><span className="text-slate-700 font-semibold">{s.tutor}</span></span></td>
                      <td className="px-2"><Pill tone={statusTone(a.status)}>{a.status} {a.status === 'Hadir' && <CheckCircle2 className="w-3.5 h-3.5" />}</Pill></td>
                      <td className="px-2 text-slate-700 font-medium">{a.note ?? '–'}</td>
                      <td className="px-2 relative">
                        <button onClick={() => setMenuFor(menuFor === a.id ? null : a.id)} aria-label="Opsi" className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center"><MoreVertical className="w-4 h-4" /></button>
                        {menuFor === a.id && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setMenuFor(null)} />
                            <div className="absolute right-2 top-10 z-20 w-52 bg-white border border-slate-200 rounded-xl shadow-lg p-1">
                              <button onClick={() => { setMenuFor(null); toast.success('Permintaan koreksi dikirim ke admin'); }} className="w-full text-left px-3 py-2 text-sm font-semibold rounded-lg hover:bg-slate-50">Ajukan koreksi kehadiran</button>
                            </div>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {shown < rows.length && (
            <button onClick={() => setShown((v) => v + PAGE)} className="w-full py-3 border-t border-slate-100 text-sm font-bold text-[#1D4ED8] flex items-center justify-center gap-1.5 hover:bg-slate-50">
              Tampilkan lebih banyak <ChevronDown className="w-4 h-4" />
            </button>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
