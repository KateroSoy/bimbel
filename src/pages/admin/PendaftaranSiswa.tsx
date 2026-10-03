import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  UserPlus, Hourglass, ClipboardCheck, CircleCheck, CircleX, Settings, Download, Plus, Camera, MessageCircle, Globe, User, Users,
  CalendarClock, Bell, Megaphone, Check, ArrowRight,
} from 'lucide-react';
import { toast } from 'sonner';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import {
  PageHead, StatCards, Tabs, FilterBar, SearchInput, Select, DataTable, Person, Badge, RowActions, Btn, InfoBox, Panel, DonutPanel, QuickList,
  WithRail, useCrud, exportCsv, soon, TONE_HEX, type Col, type Field,
} from '../../components/portal/Kit';
import { programTone, type Registration, type RegStatus } from '../../data/adminPortal';
import { cn } from '../../lib/utils';

const PROGRAMS = ['English Primary', 'Math Primary', 'Combo', 'Intensif'];
const SOURCES = ['Instagram', 'WhatsApp', 'Website', 'Walk-in', 'Referensi Orang Tua'];
const SOURCE_ICON = { Instagram: Camera, WhatsApp: MessageCircle, Website: Globe, 'Walk-in': User, 'Referensi Orang Tua': Users } as const;
const STATUSES: RegStatus[] = ['Dalam Proses', 'Menunggu Verifikasi', 'Diterima', 'Ditolak'];
const TABS = ['Semua Pendaftaran', 'Dalam Proses', 'Menunggu Verifikasi', 'Diterima', 'Ditolak / Batal'];
const STAGES = [['Pengajuan', 'Calon siswa mendaftar'], ['Verifikasi Data', 'Cek kelengkapan data'], ['Tes & Interview', 'Penilaian calon siswa'], ['Pembayaran', 'Pembayaran biaya'], ['Diterima', 'Siswa aktif']];

const FIELDS: Field[] = [
  { key: 'name', label: 'Nama Calon Siswa', required: true },
  { key: 'gender', label: 'Jenis Kelamin', type: 'select', options: ['L', 'P'] },
  { key: 'age', label: 'Usia (tahun)', type: 'number', required: true },
  { key: 'program', label: 'Program Pilihan', type: 'select', options: PROGRAMS },
  { key: 'source', label: 'Sumber', type: 'select', options: SOURCES },
  { key: 'status', label: 'Status', type: 'select', options: STATUSES },
];

export default function PendaftaranSiswa() {
  const [tab, setTab] = useState(TABS[0]);
  const [q, setQ] = useState('');
  const [program, setProgram] = useState('');
  const [source, setSource] = useState('');
  const [status, setStatus] = useState('');

  const crud = useCrud<Registration>('registrations', {
    label: 'Pendaftaran',
    fields: FIELDS,
    create: (v) => ({
      id: '', date: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }), time: new Date().toTimeString().slice(0, 5), name: v.name,
      gender: v.gender as 'L' | 'P', age: Number(v.age) || 0, program: v.program, source: v.source, status: v.status as RegStatus,
      stage: 'Verifikasi Data', stageNote: 'Oleh: Admin',
    }),
    detail: (r) => [['No. Daftar', r.id], ['Tanggal', `${r.date} ${r.time}`], ['Calon Siswa', `${r.name} (${r.gender} / ${r.age} thn)`], ['Program', r.program], ['Sumber', r.source], ['Status', <Badge>{r.status}</Badge>], ['Tahap Saat Ini', `${r.stage} · ${r.stageNote}`]],
  });

  const setStatusOf = (r: Registration, s: RegStatus, stage: string, note: string) => {
    crud.patch(r.id, { status: s, stage, stageNote: note });
    toast.success(`${r.name}: ${s}`);
  };

  const tabStatus = tab === 'Ditolak / Batal' ? 'Ditolak' : tab === TABS[0] ? '' : tab;
  const rows = crud.rows.filter((r) =>
    (!tabStatus || r.status === tabStatus) && (!q || `${r.name} ${r.id}`.toLowerCase().includes(q.toLowerCase())) &&
    (!program || r.program === program) && (!source || r.source === source) && (!status || r.status === status));
  const count = (s: RegStatus) => crud.rows.filter((r) => r.status === s).length;
  const total = crud.rows.length || 1;
  const pct = (n: number) => `${((n / total) * 100).toFixed(1).replace('.', ',')}%`;

  const columns: Col<Registration>[] = [
    { header: 'No. Daftar', cell: (r) => <span className="whitespace-nowrap font-bold text-slate-800">{r.id}</span> },
    { header: 'Tanggal Daftar', cell: (r) => <>{r.date}<span className="block text-[11px] text-slate-500">{r.time}</span></> },
    { header: 'Calon Siswa', cell: (r) => <Person name={r.name} sub={`${r.gender} / ${r.age} thn`} /> },
    { header: 'Program Pilihan', cell: (r) => <Badge tone={programTone(r.program)}>{r.program}</Badge> },
    { header: 'Sumber', cell: (r) => r.source },
    { header: 'Status', cell: (r) => <Badge>{r.status}</Badge> },
    { header: 'Tahap Saat Ini', cell: (r) => <><span className="font-bold text-slate-800">{r.stage}</span><span className="block text-[11px] text-slate-500">{r.stageNote}</span></> },
    {
      header: 'Aksi', align: 'center',
      cell: (r) => <RowActions onView={() => crud.view(r)} onEdit={() => crud.edit(r)} menu={[
        { label: 'Verifikasi Data', onClick: () => setStatusOf(r, 'Dalam Proses', 'Tes & Interview', 'Menunggu jadwal') },
        { label: 'Terima Siswa', onClick: () => setStatusOf(r, 'Diterima', 'Selesai', `Diterima: ${new Date().toLocaleDateString('id-ID')}`) },
        { label: 'Tolak Pendaftaran', onClick: () => setStatusOf(r, 'Ditolak', 'Ditolak', 'Alasan: Keputusan admin'), danger: true },
        { label: 'Hapus', onClick: () => crud.remove(r), danger: true },
      ]} />,
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-4 max-w-[1500px]">
        <PageHead
          title="Pendaftaran Siswa Baru"
          subtitle="Kelola semua proses pendaftaran siswa baru dari pengajuan hingga diterima."
          actions={<>
            <Btn icon={Settings} onClick={() => soon('Pengaturan Pendaftaran')}>Pengaturan Pendaftaran</Btn>
            <Btn icon={Download} className="!text-emerald-700" onClick={() => exportCsv('pendaftaran-siswa', ['No Daftar', 'Tanggal', 'Nama', 'Program', 'Sumber', 'Status', 'Tahap'], rows.map((r) => [r.id, r.date, r.name, r.program, r.source, r.status, r.stage]))}>Export Laporan</Btn>
            <Btn variant="primary" icon={Plus} onClick={crud.add}>Pendaftaran Manual</Btn>
          </>}
        />
        <StatCards items={[
          { label: 'Total Pendaftaran', value: crud.rows.length, sub: 'Semua pengajuan', icon: UserPlus, tone: 'blue' },
          { label: 'Dalam Proses', value: count('Dalam Proses'), sub: `${pct(count('Dalam Proses'))} dari total`, icon: Hourglass, tone: 'amber' },
          { label: 'Menunggu Verifikasi', value: count('Menunggu Verifikasi'), sub: `${pct(count('Menunggu Verifikasi'))} dari total`, icon: ClipboardCheck, tone: 'purple' },
          { label: 'Diterima', value: count('Diterima'), sub: `${pct(count('Diterima'))} dari total`, subTone: 'up', icon: CircleCheck, tone: 'green' },
          { label: 'Ditolak / Batal', value: count('Ditolak'), sub: `${pct(count('Ditolak'))} dari total`, icon: CircleX, tone: 'red' },
        ]} />

        <WithRail
          rail={<>
            <DonutPanel title="Ringkasan Pendaftaran" center={crud.rows.length} sub="Total" data={[
              { label: 'Dalam Proses', value: count('Dalam Proses'), color: '#F59E0B', note: `${count('Dalam Proses')} (${pct(count('Dalam Proses'))})` },
              { label: 'Menunggu Verifikasi', value: count('Menunggu Verifikasi'), color: '#7C3AED', note: `${count('Menunggu Verifikasi')} (${pct(count('Menunggu Verifikasi'))})` },
              { label: 'Diterima', value: count('Diterima'), color: '#16A34A', note: `${count('Diterima')} (${pct(count('Diterima'))})` },
              { label: 'Ditolak / Batal', value: count('Ditolak'), color: '#EF4444', note: `${count('Ditolak')} (${pct(count('Ditolak'))})` },
            ]} />
            <Panel title="Sumber Pendaftaran">
              <ul className="space-y-2.5">
                {SOURCES.map((s) => {
                  const n = crud.rows.filter((r) => r.source === s).length;
                  const Icon = SOURCE_ICON[s as keyof typeof SOURCE_ICON];
                  return (
                    <li key={s} className="flex items-center gap-2.5 text-[13px] font-bold text-slate-800">
                      <Icon className="w-4 h-4 text-[#1D4ED8]" /><span className="flex-1">{s}</span><span>{n} ({pct(n)})</span>
                    </li>
                  );
                })}
              </ul>
            </Panel>
            <QuickList items={[
              { label: 'Tambah Pendaftaran Manual', icon: Plus, onClick: crud.add },
              { label: 'Jadwalkan Tes / Interview', icon: CalendarClock },
              { label: 'Kirim Pengingat Pembayaran', icon: Bell },
              { label: 'Buat Pengumuman Pendaftaran', icon: Megaphone, to: '/admin/pengumuman' },
            ]} />
          </>}
        >
          <Tabs tabs={TABS} value={tab} onChange={setTab} />
          <FilterBar onReset={() => { setQ(''); setProgram(''); setSource(''); setStatus(''); }}>
            <SearchInput value={q} onChange={setQ} placeholder="Cari nama calon siswa / no. pendaftaran..." />
            <Select value={program} onChange={setProgram} all="Semua Program" options={PROGRAMS} />
            <Select value={source} onChange={setSource} all="Semua Sumber" options={SOURCES} />
            <Select value={status} onChange={setStatus} all="Semua Status" options={STATUSES} />
          </FilterBar>
          <DataTable columns={columns} rows={rows} rowKey={(r) => r.id} selectable />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Panel title="Tahapan Pendaftaran" className="lg:col-span-1">
              <ol className="space-y-2.5">
                {STAGES.map(([name, sub], i) => (
                  <li key={name} className="flex items-center gap-2.5">
                    <span className={cn('w-7 h-7 rounded-full border-2 flex items-center justify-center text-[11px] font-extrabold shrink-0', i < 2 ? 'border-emerald-500 text-emerald-600' : i === 2 ? 'border-[#1D4ED8] bg-[#1D4ED8] text-white' : 'border-slate-200 text-slate-400')}>
                      {i < 2 ? <Check className="w-3.5 h-3.5" /> : i + 1}
                    </span>
                    <span><span className={cn('block text-[13px] font-bold', i === 2 ? 'text-[#1D4ED8]' : 'text-[#0F1E4A]')}>{i + 1}. {name}</span><span className="block text-[11px] text-slate-500 font-medium">{sub}</span></span>
                  </li>
                ))}
              </ol>
            </Panel>
            <InfoBox title="Informasi Penting" items={['Pastikan semua data calon siswa terisi dengan lengkap dan benar.', 'Verifikasi data maksimal 1x24 jam setelah pendaftaran masuk.', 'Kuota kelas akan otomatis berkurang setelah siswa diterima.', 'Data pendaftaran akan otomatis diarsipkan setiap akhir tahun ajaran.']} />
            <Panel title="Catatan">
              <p className="text-xs text-slate-600 font-medium leading-relaxed">Anda dapat mengatur formulir pendaftaran, dokumen yang diperlukan, dan biaya pendaftaran pada menu Pengaturan Pendaftaran.</p>
              <Link to="/admin/pengaturan" className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-bold text-[#1D4ED8] hover:underline">Buka Pengaturan <ArrowRight className="w-4 h-4" style={{ color: TONE_HEX.blue }} /></Link>
            </Panel>
          </div>
        </WithRail>
        {crud.dialogs}
      </div>
    </DashboardLayout>
  );
}
