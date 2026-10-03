import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, BadgeCheck, TrendingUp, AlertTriangle, ArrowRight } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { PageHead, StatStrip, Tabs, SearchInput, Select, DataTable, Person, Badge, Btn, RowMenu, Meter, Panel, exportCsv, type Col } from '../../components/portal/Kit';
import { MY_STUDENTS, gradeStatus, type TutorStudent } from '../../data/guruPortal';
import { StudentProfileModal } from './SiswaSaya';
import { cn } from '../../lib/utils';

const fmt = (n: number) => n.toFixed(1).replace('.', ',');
const avg = (list: TutorStudent[], f: (s: TutorStudent) => number) => (list.length ? list.reduce((a, s) => a + f(s), 0) / list.length : 0);
const CLASS_COLORS = ['#1D4ED8', '#16A34A', '#7C3AED', '#F97316'];
const barColor = (v: number) => (v >= 80 ? '#16A34A' : v >= 60 ? '#F97316' : '#EF4444');

export default function NilaiProgress() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('Ringkasan');
  const [q, setQ] = useState('');
  const [kelas, setKelas] = useState('');
  const [chip, setChip] = useState('Semua');
  const [viewing, setViewing] = useState<TutorStudent | null>(null);

  const classNames = [...new Set(MY_STUDENTS.map((s) => s.kelas))];
  const need = MY_STUDENTS.filter((s) => gradeStatus(s) === 'Perlu Perhatian');
  const best = MY_STUDENTS.filter((s) => gradeStatus(s) === 'Sangat Baik');
  const rows = MY_STUDENTS.filter((s) =>
    (!q || `${s.name} ${s.kelas}`.toLowerCase().includes(q.toLowerCase())) && (!kelas || s.kelas === kelas) &&
    (chip === 'Semua' || (chip === 'Perlu Perhatian' ? need.includes(s) : best.includes(s))));
  const doExport = () => exportCsv('nilai-progress', ['NIS', 'Nama', 'Kelas', 'Kehadiran', 'Rata-rata Nilai', 'Progress', 'Status'], rows.map((s) => [s.id, s.name, s.kelas, `${s.attendance}%`, fmt(s.score), `${s.progress}%`, gradeStatus(s)]));

  const columns: Col<TutorStudent>[] = [
    { header: 'No.', cell: (_, i) => `${i + 1}.`, align: 'center' },
    { header: 'Siswa', cell: (s) => <Person name={s.name} sub={`NIS: ${s.id}`} /> },
    { header: 'Kelas', cell: (s) => <><span className="font-bold text-[#0F1E4A]">{s.kelas}</span><span className="block text-xs text-slate-500">{s.subject}</span></> },
    { header: 'Kehadiran', cell: (s) => <div className="flex items-center gap-2 w-32"><span className="font-bold text-[#0F1E4A] w-9">{s.attendance}%</span><Meter value={s.attendance} color={barColor(s.attendance)} className="flex-1" /></div> },
    { header: 'Rata-rata Nilai', align: 'center', cell: (s) => <span className="font-extrabold text-[#0F1E4A]">{fmt(s.score)}</span> },
    { header: 'Progress', cell: (s) => <div className="flex items-center gap-2 w-32"><span className="font-bold text-[#0F1E4A] w-9">{s.progress}%</span><Meter value={s.progress} color={barColor(s.progress)} className="flex-1" /></div> },
    { header: 'Status', cell: (s) => <Badge>{gradeStatus(s)}</Badge> },
    { header: 'Aksi', align: 'center', cell: (s) => <div className="inline-flex items-center gap-2"><Btn size="sm" onClick={() => setViewing(s)}>Profil</Btn><RowMenu items={[{ label: 'Input / Ubah Nilai', onClick: () => navigate('/guru/nilai/input') }]} /></div> },
  ];

  const perClass = (
    <Panel title="Rata-rata Nilai per Kelas" action={<button onClick={() => setTab('Analisis')} className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#1D4ED8] hover:underline">Lihat Analisis Kelas <ArrowRight className="w-4 h-4" /></button>}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {classNames.map((c, i) => {
          const v = avg(MY_STUDENTS.filter((s) => s.kelas === c), (s) => s.score);
          return <div key={c}><p className="text-[13px] font-bold text-[#0F1E4A] mb-1.5">{c}</p><div className="flex items-center gap-3"><Meter value={v} color={CLASS_COLORS[i % 4]} className="flex-1" /><span className="text-sm font-extrabold text-[#0F1E4A]">{fmt(v)}</span></div></div>;
        })}
      </div>
    </Panel>
  );

  return (
    <DashboardLayout>
      <div className="space-y-4 max-w-[1300px]">
        <PageHead title="Nilai & Progress" subtitle="Pantau capaian belajar siswa dan analisis perkembangan kelas." />
        <StatStrip
          items={[
            { icon: Users, value: MY_STUDENTS.length, label: 'Siswa', color: '#1D4ED8' },
            { icon: BadgeCheck, value: fmt(avg(MY_STUDENTS, (s) => s.score)), label: 'Rata-rata Nilai', color: '#16A34A' },
            { icon: TrendingUp, value: `${Math.round(avg(MY_STUDENTS, (s) => s.progress))}%`, label: 'Rata-rata Progress', color: '#7C3AED' },
            { icon: AlertTriangle, value: need.length, label: 'Perlu Perhatian', color: '#F97316' },
          ]}
          action={<div className="flex gap-2"><Btn onClick={doExport}>Export Nilai</Btn><Btn variant="primary" to="/guru/nilai/input">Input Nilai</Btn></div>}
        />
        <Tabs tabs={['Ringkasan', 'Siswa', 'Analisis']} value={tab} onChange={setTab} />

        {tab !== 'Analisis' && (
          <>
            <div className="flex flex-wrap gap-2">
              <SearchInput value={q} onChange={setQ} placeholder="Cari siswa atau kelas..." />
              <Select value={kelas} onChange={setKelas} all="Semua Kelas" options={classNames} />
              <span className="inline-flex items-center h-10 px-3 rounded-lg border border-slate-200 bg-white text-[13px] font-bold text-slate-800">Periode: Agustus 2026</span>
            </div>
            {tab === 'Ringkasan' && perClass}
            <div className="flex flex-wrap gap-2">
              {([['Semua', MY_STUDENTS.length, 'border-[#1D4ED8] text-[#1D4ED8] bg-[#F4F8FF]'], ['Perlu Perhatian', need.length, 'border-orange-300 text-orange-600 bg-orange-50'], ['Berprestasi', best.length, 'border-emerald-300 text-emerald-700 bg-emerald-50']] as const).map(([l, c, cls]) => (
                <button key={l} onClick={() => setChip(l)} className={cn('h-9 px-3.5 rounded-lg border text-[13px] font-bold', chip === l ? cls : 'border-slate-200 text-slate-600 bg-white')}>{l} ({c})</button>
              ))}
            </div>
            <DataTable columns={columns} rows={rows} rowKey={(s) => s.id} unit="siswa" />
          </>
        )}

        {tab === 'Analisis' && (
          <>
            {perClass}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {classNames.map((c) => {
                const list = MY_STUDENTS.filter((s) => s.kelas === c);
                return (
                  <Panel key={c} title={c} action={<Badge tone="blue">{list.length} siswa</Badge>}>
                    <ul className="space-y-2.5">
                      {([['Rata-rata Nilai', avg(list, (s) => s.score)], ['Kehadiran', avg(list, (s) => s.attendance)], ['Progress', avg(list, (s) => s.progress)]] as const).map(([l, v]) => (
                        <li key={l}><div className="flex justify-between text-xs font-bold text-slate-700 mb-1"><span>{l}</span><span>{fmt(v)}</span></div><Meter value={v} color={barColor(v)} /></li>
                      ))}
                    </ul>
                    <p className="mt-3 text-xs text-slate-600 font-medium">Tertinggi: <b>{[...list].sort((a, b) => b.score - a.score)[0]?.name}</b> · Perlu perhatian: <b>{list.filter((s) => gradeStatus(s) === 'Perlu Perhatian').length} siswa</b></p>
                  </Panel>
                );
              })}
            </div>
          </>
        )}
        <StudentProfileModal student={viewing} onClose={() => setViewing(null)} />
      </div>
    </DashboardLayout>
  );
}
