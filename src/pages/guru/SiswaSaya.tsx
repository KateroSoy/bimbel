import { useState } from 'react';
import { Users, CircleCheck, CircleAlert, Presentation, Award } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { PageHead, StatStrip, Tabs, SearchInput, Select, DataTable, Person, Badge, Btn, RowMenu, Meter, Modal, KeyValues, Panel, exportCsv, type Col } from '../../components/portal/Kit';
import { MY_STUDENTS, ACTIVE_CLASSES, studentStatus, gradeStatus, type TutorStudent } from '../../data/guruPortal';

const fmt = (n: number) => n.toFixed(1).replace('.', ',');
const avg = (list: TutorStudent[], f: (s: TutorStudent) => number) => (list.length ? list.reduce((a, s) => a + f(s), 0) / list.length : 0);

export function StudentProfileModal({ student, onClose }: { student: TutorStudent | null; onClose: () => void }) {
  return (
    <Modal open={!!student} title="Profil Siswa" onClose={onClose} footer={<><Btn to="/guru/pesan">Kirim Pesan</Btn><Btn variant="ghost" onClick={onClose}>Tutup</Btn></>}>
      {student && (
        <>
          <div className="mb-3"><Person name={student.name} sub={`NIS: ${student.id}`} /></div>
          <KeyValues rows={[['Kelas', student.kelas], ['Mata Pelajaran', student.subject], ['Kehadiran', `${student.attendance}%`], ['Rata-rata Nilai', fmt(student.score)], ['Progress Belajar', `${student.progress}%`], ['Status', <Badge>{studentStatus(student)}</Badge>]]} />
        </>
      )}
    </Modal>
  );
}

export default function SiswaSaya() {
  const [tab, setTab] = useState('Daftar Siswa');
  const [q, setQ] = useState('');
  const [kelas, setKelas] = useState('');
  const [status, setStatus] = useState('');
  const [viewing, setViewing] = useState<TutorStudent | null>(null);

  const rows = MY_STUDENTS.filter((s) => (!q || `${s.name} ${s.id} ${s.kelas}`.toLowerCase().includes(q.toLowerCase())) && (!kelas || s.kelas === kelas) && (!status || studentStatus(s) === status));
  const classNames = [...new Set(MY_STUDENTS.map((s) => s.kelas))];
  const attention = MY_STUDENTS.filter((s) => studentStatus(s) === 'Perlu Perhatian').length;
  const doExport = () => exportCsv('siswa-saya', ['NIS', 'Nama', 'Kelas', 'Mapel', 'Kehadiran', 'Rata-rata Nilai', 'Status'], rows.map((s) => [s.id, s.name, s.kelas, s.subject, `${s.attendance}%`, fmt(s.score), studentStatus(s)]));

  const columns: Col<TutorStudent>[] = [
    { header: 'NO.', cell: (_, i) => `${i + 1}.`, align: 'center' },
    { header: 'SISWA', cell: (s) => <Person name={s.name} sub={`NIS: ${s.id}`} /> },
    { header: 'KELAS', cell: (s) => <><span className="font-bold text-[#0F1E4A]">{s.kelas}</span><span className="block text-xs text-slate-500">{s.subject}</span></> },
    { header: 'KEHADIRAN', cell: (s) => <div className="w-28"><span className="font-bold text-[#0F1E4A]">{s.attendance}%</span><Meter value={s.attendance} color={s.attendance >= 80 ? '#16A34A' : '#F97316'} className="mt-1" /></div> },
    { header: 'RATA-RATA NILAI', cell: (s) => <span className="text-[15px] font-extrabold text-[#0F1E4A]">{fmt(s.score)}</span> },
    { header: 'STATUS', cell: (s) => <Badge>{studentStatus(s)}</Badge> },
    { header: 'AKSI', align: 'center', cell: (s) => <div className="inline-flex items-center gap-2"><Btn onClick={() => setViewing(s)}>Profil</Btn><RowMenu items={[{ label: 'Lihat Nilai & Progress', onClick: () => setViewing(s) }]} /></div> },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-4 max-w-[1300px]">
        <PageHead title="Siswa Saya" subtitle="Kelola dan pantau perkembangan siswa yang Anda ajar." />
        <StatStrip
          items={[
            { icon: Users, value: MY_STUDENTS.length, label: 'Siswa', color: '#1D4ED8' },
            { icon: CircleCheck, value: MY_STUDENTS.length - attention, label: 'Aktif', color: '#16A34A' },
            { icon: CircleAlert, value: attention, label: 'Perlu Perhatian', color: '#F59E0B' },
            { icon: Presentation, value: ACTIVE_CLASSES.length, label: 'Kelas yang diajar', color: '#7C3AED' },
          ]}
          action={<div className="flex gap-2"><Btn onClick={doExport}>Export Daftar</Btn><Btn variant="ghost" to="/guru/progress-siswa">Siswa Perlu Perhatian</Btn></div>}
        />
        <Tabs tabs={['Daftar Siswa', 'Ringkasan per Kelas', 'Prestasi & Sertifikat']} value={tab} onChange={setTab} />

        {tab === 'Daftar Siswa' && (
          <>
            <div className="flex flex-wrap gap-2">
              <SearchInput value={q} onChange={setQ} placeholder="Cari nama, NIS, atau kelas..." />
              <Select value={kelas} onChange={setKelas} all="Semua Kelas" options={classNames} />
              <Select value={status} onChange={setStatus} all="Semua Status" options={['Aktif', 'Perlu Perhatian']} />
            </div>
            <DataTable columns={columns} rows={rows} rowKey={(s) => s.id} unit="siswa" />
          </>
        )}

        {tab === 'Ringkasan per Kelas' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {classNames.map((c) => {
              const list = MY_STUDENTS.filter((s) => s.kelas === c);
              return (
                <Panel key={c} title={c} action={<Badge tone="blue">{list.length} siswa</Badge>}>
                  <KeyValues rows={[['Rata-rata Nilai', fmt(avg(list, (s) => s.score))], ['Rata-rata Kehadiran', `${Math.round(avg(list, (s) => s.attendance))}%`], ['Rata-rata Progress', `${Math.round(avg(list, (s) => s.progress))}%`], ['Perlu Perhatian', `${list.filter((s) => studentStatus(s) === 'Perlu Perhatian').length} siswa`]]} />
                </Panel>
              );
            })}
          </div>
        )}

        {tab === 'Prestasi & Sertifikat' && (
          <Panel title="Siswa Berprestasi">
            <ul className="divide-y divide-slate-100">
              {MY_STUDENTS.filter((s) => gradeStatus(s) === 'Sangat Baik' || s.score >= 85).sort((a, b) => b.score - a.score).map((s) => (
                <li key={s.id} className="flex items-center gap-3 py-2.5">
                  <Award className="w-5 h-5 text-orange-500 shrink-0" />
                  <div className="flex-1 min-w-0"><Person name={s.name} sub={`${s.kelas} · ${s.subject}`} /></div>
                  <span className="text-sm font-extrabold text-[#0F1E4A]">{fmt(s.score)}</span>
                  <Badge>{gradeStatus(s)}</Badge>
                </li>
              ))}
            </ul>
          </Panel>
        )}
        <StudentProfileModal student={viewing} onClose={() => setViewing(null)} />
      </div>
    </DashboardLayout>
  );
}
