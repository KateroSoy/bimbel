import { useState } from 'react';
import { GraduationCap, Users, UserRound, PieChart, Armchair, FileSpreadsheet, Plus, SlidersHorizontal, ArrowLeftRight, CalendarDays, FileText } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import {
  PageHead, StatCards, Tabs, FilterBar, SearchInput, Select, DataTable, Badge, RowActions, Btn, InfoBox, LegendBox, Panel, DonutPanel, QuickList,
  BarList, WithRail, Meter, Avatar, useCrud, exportCsv, type Col, type Field,
} from '../../components/portal/Kit';
import { LEVELS, ROMBELS, type LevelRow, type RombelRow } from '../../data/adminPortal';

const JENJANG = ['Pra-Sekolah', 'Pra-SD & SD', 'SD', 'SMP', 'SMA'];
const JENJANG_COLOR: Record<string, string> = { 'Pra-Sekolah': '#1D4ED8', 'Pra-SD & SD': '#EC4899', SD: '#16A34A', SMP: '#F59E0B', SMA: '#EF4444' };
const TABS = ['Kelas (Tingkat)', 'Rombel (Rombongan Belajar)'];
const pctOf = (used: number, cap: number) => (cap ? Math.round((used / cap) * 100) : 0);

const Fill = ({ used, cap }: { used: number; cap: number }) => (
  <div className="w-24 mx-auto"><span className="font-bold text-slate-800">{pctOf(used, cap)}%</span><Meter value={pctOf(used, cap)} className="mt-1" /></div>
);

export default function KelasRombel() {
  const [tab, setTab] = useState(TABS[0]);
  const [q, setQ] = useState('');
  const [jenjang, setJenjang] = useState('');
  const [status, setStatus] = useState('');

  const levelFields: Field[] = [
    { key: 'name', label: 'Nama Kelas (Tingkat)', required: true },
    { key: 'sub', label: 'Keterangan', placeholder: 'SD / Usia 3-4 tahun' },
    { key: 'level', label: 'Jenjang', type: 'select', options: JENJANG },
    { key: 'status', label: 'Status', type: 'select', options: ['Aktif', 'Nonaktif'] },
    { key: 'rombel', label: 'Total Rombel', type: 'number' },
    { key: 'capacity', label: 'Kapasitas Total', type: 'number', required: true },
  ];
  const levels = useCrud<LevelRow>(LEVELS, {
    label: 'Kelas',
    fields: levelFields,
    create: (v, rows) => ({ id: `KLS-${String(rows.length + 1).padStart(2, '0')}`, name: v.name, sub: v.sub || v.level, level: v.level, rombel: Number(v.rombel) || 0, students: 0, capacity: Number(v.capacity) || 0, status: v.status as LevelRow['status'] }),
    detail: (l) => [['Kelas', l.name], ['Jenjang', l.level], ['Total Rombel', l.rombel], ['Total Siswa', l.students], ['Kapasitas Total', l.capacity], ['Terpakai', `${pctOf(l.students, l.capacity)}%`], ['Status', <Badge>{l.status}</Badge>]],
  });

  const rombelFields: Field[] = [
    { key: 'name', label: 'Nama Rombel', required: true },
    { key: 'level', label: 'Kelas (Tingkat)', type: 'select', options: levels.rows.map((l) => l.name) },
    { key: 'tutor', label: 'Tutor', required: true },
    { key: 'room', label: 'Ruang', type: 'select', options: ['Ruang 1', 'Ruang 2', 'Ruang 3', 'Ruang 4', 'Ruang 5'] },
    { key: 'students', label: 'Jumlah Siswa', type: 'number' },
    { key: 'capacity', label: 'Kapasitas', type: 'number', required: true },
    { key: 'status', label: 'Status', type: 'select', options: ['Aktif', 'Nonaktif'] },
  ];
  const rombels = useCrud<RombelRow>(ROMBELS, {
    label: 'Rombel',
    fields: rombelFields,
    create: (v, rows) => ({ id: `RMB-${String(rows.length + 1).padStart(2, '0')}`, name: v.name, level: v.level, tutor: v.tutor, room: v.room, students: Number(v.students) || 0, capacity: Number(v.capacity) || 0, status: v.status as RombelRow['status'] }),
    detail: (r) => [['Kode', r.id], ['Rombel', r.name], ['Kelas (Tingkat)', r.level], ['Tutor', r.tutor], ['Ruang', r.room], ['Siswa', `${r.students} / ${r.capacity}`], ['Status', <Badge>{r.status}</Badge>]],
  });

  const isLevel = tab === TABS[0];
  const match = (name: string, st: string) => (!q || name.toLowerCase().includes(q.toLowerCase())) && (!status || st === status);
  const levelRows = levels.rows.filter((l) => match(l.name, l.status) && (!jenjang || l.level === jenjang));
  const rombelRows = rombels.rows.filter((r) => match(r.name, r.status) && (!jenjang || levels.rows.find((l) => l.name === r.level)?.level === jenjang));

  const activeLevels = levels.rows.filter((l) => l.status === 'Aktif');
  const totalStudents = activeLevels.reduce((a, l) => a + l.students, 0);
  const totalCap = activeLevels.reduce((a, l) => a + l.capacity, 0);
  const rombelOf = (j: string) => levels.rows.filter((l) => l.level === j && l.status === 'Aktif').reduce((a, l) => a + l.rombel, 0);
  const nonaktif = levels.rows.filter((l) => l.status === 'Nonaktif').reduce((a, l) => a + l.rombel, 0);

  const actions = <T extends { id: string; status: 'Aktif' | 'Nonaktif' }>(crud: { view: (r: T) => void; edit: (r: T) => void; remove: (r: T) => void; patch: (id: string, c: Partial<T>) => void }, r: T) => (
    <RowActions onView={() => crud.view(r)} onEdit={() => crud.edit(r)} menu={[
      { label: r.status === 'Aktif' ? 'Nonaktifkan' : 'Aktifkan', onClick: () => crud.patch(r.id, { status: r.status === 'Aktif' ? 'Nonaktif' : 'Aktif' } as Partial<T>) },
      { label: 'Hapus', onClick: () => crud.remove(r), danger: true },
    ]} />
  );

  const levelCols: Col<LevelRow>[] = [
    { header: 'No.', cell: (_, i) => i + 1, align: 'center' },
    { header: 'Kelas (Tingkat)', cell: (l) => <div className="flex items-center gap-2.5"><Avatar name={l.name} /><div><p className="font-bold text-[#0F1E4A]">{l.name}</p><p className="text-[11px] text-slate-500">{l.sub}</p></div></div> },
    { header: 'Jenjang', cell: (l) => l.level },
    { header: 'Total Rombel', align: 'center', cell: (l) => l.rombel },
    { header: 'Total Siswa', align: 'center', cell: (l) => l.students },
    { header: 'Kapasitas Total', align: 'center', cell: (l) => l.capacity },
    { header: 'Kapasitas Terpakai', align: 'center', cell: (l) => <Fill used={l.students} cap={l.capacity} /> },
    { header: 'Status', cell: (l) => <Badge>{l.status}</Badge> },
    { header: 'Aksi', align: 'center', cell: (l) => actions(levels, l) },
  ];
  const rombelCols: Col<RombelRow>[] = [
    { header: 'No.', cell: (_, i) => i + 1, align: 'center' },
    { header: 'Rombel', cell: (r) => <><p className="font-bold text-[#0F1E4A]">{r.name}</p><p className="text-[11px] text-slate-500">{r.id}</p></> },
    { header: 'Kelas (Tingkat)', cell: (r) => r.level },
    { header: 'Tutor', cell: (r) => r.tutor },
    { header: 'Ruang', cell: (r) => r.room },
    { header: 'Siswa', align: 'center', cell: (r) => `${r.students} / ${r.capacity}` },
    { header: 'Kapasitas Terpakai', align: 'center', cell: (r) => <Fill used={r.students} cap={r.capacity} /> },
    { header: 'Status', cell: (r) => <Badge>{r.status}</Badge> },
    { header: 'Aksi', align: 'center', cell: (r) => actions(rombels, r) },
  ];

  const doExport = () => (isLevel
    ? exportCsv('kelas-tingkat', ['Kelas', 'Jenjang', 'Rombel', 'Siswa', 'Kapasitas', 'Status'], levelRows.map((l) => [l.name, l.level, l.rombel, l.students, l.capacity, l.status]))
    : exportCsv('rombel', ['Kode', 'Rombel', 'Kelas', 'Tutor', 'Ruang', 'Siswa', 'Kapasitas', 'Status'], rombelRows.map((r) => [r.id, r.name, r.level, r.tutor, r.room, r.students, r.capacity, r.status])));
  const dot = (c: string) => <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c }} /></span>;

  return (
    <DashboardLayout>
      <div className="space-y-4 max-w-[1500px]">
        <PageHead
          title="Kelas & Rombel"
          subtitle="Kelola semua kelas (tingkat) dan rombongan belajar."
          actions={<>
            <Btn icon={FileSpreadsheet} className="!text-emerald-700" onClick={doExport}>Export ke Excel</Btn>
            <Btn variant="primary" icon={Plus} onClick={isLevel ? levels.add : rombels.add}>Tambah {isLevel ? 'Kelas' : 'Rombel'}</Btn>
          </>}
        />
        <StatCards items={[
          { label: 'Total Kelas', value: activeLevels.length, sub: 'Kelas aktif', icon: GraduationCap, tone: 'blue' },
          { label: 'Total Rombel', value: activeLevels.reduce((a, l) => a + l.rombel, 0), sub: 'Rombel aktif', icon: Users, tone: 'green' },
          { label: 'Total Siswa', value: totalStudents, sub: 'Siswa terdaftar', icon: UserRound, tone: 'orange' },
          { label: 'Kapasitas Terpakai', value: `${pctOf(totalStudents, totalCap)}%`, sub: 'Dari total kapasitas', icon: PieChart, tone: 'purple' },
          { label: 'Kapasitas Tersedia', value: totalCap - totalStudents, sub: 'Sisa kursi tersedia', icon: Armchair, tone: 'teal' },
        ]} />

        <WithRail
          rail={<>
            <DonutPanel title="Ringkasan Kelas & Rombel" center={activeLevels.reduce((a, l) => a + l.rombel, 0) + nonaktif} sub="Total Rombel" data={[
              ...JENJANG.filter((j) => rombelOf(j) > 0).map((j) => ({ label: j, value: rombelOf(j), color: JENJANG_COLOR[j], note: `${rombelOf(j)} rombel` })),
              { label: 'Nonaktif', value: nonaktif, color: '#CBD5E1', note: `${nonaktif} rombel` },
            ]} />
            <Panel title="Jumlah Rombel per Jenjang">
              <BarList rows={[...JENJANG.filter((j) => rombelOf(j) > 0).map((j) => ({ label: j, value: rombelOf(j), color: JENJANG_COLOR[j] })), { label: 'Nonaktif', value: nonaktif, color: '#94A3B8' }]} />
            </Panel>
            <QuickList items={[
              { label: 'Tambah Kelas', icon: Plus, onClick: levels.add },
              { label: 'Tambah Rombel', icon: Plus, onClick: rombels.add },
              { label: 'Atur Kapasitas Kelas', icon: SlidersHorizontal, to: '/admin/ruang' },
              { label: 'Pindahkan Rombel', icon: ArrowLeftRight },
              { label: 'Lihat Jadwal Kelas', icon: CalendarDays, to: '/admin/jadwal-kelas' },
              { label: 'Laporan Kelas', icon: FileText, to: '/admin/laporan-kelas' },
            ]} />
          </>}
        >
          <Tabs tabs={TABS} value={tab} onChange={setTab} />
          <FilterBar onReset={() => { setQ(''); setJenjang(''); setStatus(''); }}>
            <SearchInput value={q} onChange={setQ} placeholder={isLevel ? 'Cari kelas / tingkat...' : 'Cari rombel...'} />
            <Select value={jenjang} onChange={setJenjang} all="Semua Jenjang" options={JENJANG} />
            <Select value={status} onChange={setStatus} all="Semua Status" options={['Aktif', 'Nonaktif']} />
          </FilterBar>
          {isLevel
            ? <DataTable columns={levelCols} rows={levelRows} rowKey={(l) => l.id} unit="kelas (tingkat)" />
            : <DataTable columns={rombelCols} rows={rombelRows} rowKey={(r) => r.id} unit="rombel" />}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <InfoBox items={['Kelas adalah tingkat atau jenjang pembelajaran.', 'Rombel adalah pembagian siswa dalam satu kelas/program tertentu.', 'Kapasitas dapat diatur sesuai dengan standar bimbel Anda.', 'Nonaktifkan kelas/rombel yang sudah tidak digunakan.']} />
            <LegendBox title="Legenda Persentase" rows={[[<>{dot('#F97316')}</>, '0 - 60%: Low (Rendah)'], [<>{dot('#16A34A')}</>, '61% - 99%: Medium - High'], [<>{dot('#EF4444')}</>, '≥ 100%: Penuh / Over Capacity']]} />
            <LegendBox title="Keterangan Status" rows={[['Aktif', 'Kelas / Rombel berjalan dan menerima siswa.'], ['Nonaktif', 'Kelas / Rombel dihentikan sementara.'], ['Arsip', 'Kelas / Rombel sudah tidak digunakan.']]} />
          </div>
        </WithRail>
        {levels.dialogs}
        {rombels.dialogs}
      </div>
    </DashboardLayout>
  );
}
