import { useState } from 'react';
import { DoorOpen, Armchair, Users, UserPlus, Gauge, FileSpreadsheet, Plus, Wrench, FileText, Tags, History, FlaskConical, Library, UsersRound, Briefcase, LayoutGrid } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import {
  PageHead, StatCards, FilterBar, SearchInput, Select, DataTable, Badge, RowActions, Btn, InfoBox, LegendBox, Panel, DonutPanel, QuickList, BarList,
  WithRail, Meter, useCrud, exportCsv, type Col, type Field,
} from '../../components/portal/Kit';
import { type RoomRow } from '../../data/adminPortal';

const TYPES = ['Ruang Kelas', 'Laboratorium', 'Perpustakaan', 'Aula', 'Ruang Staff'];
const TYPE_ICON = { 'Ruang Kelas': LayoutGrid, Laboratorium: FlaskConical, Perpustakaan: Library, Aula: UsersRound, 'Ruang Staff': Briefcase } as const;
const CONDITIONS = ['Baik', 'Perlu Perbaikan', 'Rusak', 'Dalam Perawatan'];
const FIELDS: Field[] = [
  { key: 'name', label: 'Nama Ruang', required: true },
  { key: 'type', label: 'Jenis Ruang', type: 'select', options: TYPES },
  { key: 'floor', label: 'Lokasi', type: 'select', options: ['Lantai 1', 'Lantai 2'] },
  { key: 'capacity', label: 'Kapasitas Total', type: 'number', required: true },
  { key: 'used', label: 'Terpakai', type: 'number' },
  { key: 'status', label: 'Status', type: 'select', options: ['Aktif', 'Nonaktif'] },
  { key: 'condition', label: 'Kondisi', type: 'select', options: CONDITIONS },
];
const util = (r: RoomRow) => (r.capacity ? (r.used / r.capacity) * 100 : 0);
const pct = (v: number) => `${v.toFixed(1).replace('.', ',')}%`;

export default function RuangKapasitas() {
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const [floor, setFloor] = useState('');

  const crud = useCrud<RoomRow>('rooms', {
    label: 'Ruang',
    fields: FIELDS,
    create: (v) => ({ id: '', name: v.name, type: v.type, floor: v.floor, capacity: Number(v.capacity) || 0, used: Math.min(Number(v.used) || 0, Number(v.capacity) || 0), status: v.status as RoomRow['status'], condition: v.condition }),
    detail: (r) => [['Nama Ruang', r.name], ['Jenis', r.type], ['Lokasi', r.floor], ['Kapasitas Total', r.capacity], ['Terpakai', r.used], ['Tersedia', r.capacity - r.used], ['Utilisasi', pct(util(r))], ['Status', <Badge>{r.status}</Badge>], ['Kondisi', <Badge>{r.condition}</Badge>]],
  });

  const rows = crud.rows.filter((r) => (!q || r.name.toLowerCase().includes(q.toLowerCase())) && (!status || r.status === status) && (!floor || r.floor === floor));
  const active = crud.rows.filter((r) => r.status === 'Aktif');
  const cap = active.reduce((a, r) => a + r.capacity, 0);
  const used = active.reduce((a, r) => a + r.used, 0);
  const share = (v: number) => pct(cap ? (v / cap) * 100 : 0);

  const columns: Col<RoomRow>[] = [
    { header: 'No.', cell: (_, i) => i + 1, align: 'center' },
    {
      header: 'Nama Ruang',
      cell: (r) => {
        const Icon = TYPE_ICON[r.type as keyof typeof TYPE_ICON] ?? LayoutGrid;
        return <div className="flex items-center gap-2.5"><span className="w-9 h-9 rounded-lg bg-[#EAF1FF] text-[#1D4ED8] flex items-center justify-center shrink-0"><Icon className="w-5 h-5" /></span><div><p className="font-bold text-[#0F1E4A]">{r.name}</p><p className="text-[11px] text-slate-500">{r.type}</p></div></div>;
      },
    },
    { header: 'Lokasi', cell: (r) => r.floor },
    { header: 'Kapasitas Total', align: 'center', cell: (r) => r.capacity },
    { header: 'Terpakai', align: 'center', cell: (r) => r.used },
    { header: 'Tersedia', align: 'center', cell: (r) => r.capacity - r.used },
    { header: 'Utilisasi', align: 'center', cell: (r) => <div className="w-24 mx-auto"><span className="font-bold text-slate-800">{pct(util(r))}</span><Meter value={util(r)} className="mt-1" /></div> },
    { header: 'Status', cell: (r) => <Badge>{r.status}</Badge> },
    { header: 'Kondisi', cell: (r) => <Badge>{r.condition}</Badge> },
    {
      header: 'Aksi', align: 'center',
      cell: (r) => <RowActions onEdit={() => crud.edit(r)} menu={[
        { label: 'Lihat Detail', onClick: () => crud.view(r) },
        { label: r.status === 'Aktif' ? 'Nonaktifkan' : 'Aktifkan', onClick: () => crud.patch(r.id, { status: r.status === 'Aktif' ? 'Nonaktif' : 'Aktif' }) },
        { label: 'Hapus', onClick: () => crud.remove(r), danger: true },
      ]} />,
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-4 max-w-[1500px]">
        <PageHead
          title="Ruang & Kapasitas"
          subtitle="Kelola data ruang belajar dan kapasitas penggunaannya."
          actions={<>
            <Btn icon={FileSpreadsheet} className="!text-emerald-700" onClick={() => exportCsv('ruang-kapasitas', ['Ruang', 'Jenis', 'Lokasi', 'Kapasitas', 'Terpakai', 'Status', 'Kondisi'], rows.map((r) => [r.name, r.type, r.floor, r.capacity, r.used, r.status, r.condition]))}>Export ke Excel</Btn>
            <Btn variant="primary" icon={Plus} onClick={crud.add}>Tambah Ruang</Btn>
          </>}
        />
        <StatCards items={[
          { label: 'Total Ruang', value: active.length, sub: 'Ruang Aktif', icon: DoorOpen, tone: 'blue' },
          { label: 'Total Kapasitas', value: cap, sub: 'Kursi Tersedia', icon: Armchair, tone: 'green' },
          { label: 'Kapasitas Terpakai', value: used, sub: `${share(used)} Terpakai`, icon: Users, tone: 'orange' },
          { label: 'Kapasitas Tersedia', value: cap - used, sub: `${share(cap - used)} Tersedia`, icon: UserPlus, tone: 'purple' },
          { label: 'Utilisasi Ruang', value: share(used), sub: 'Rata-rata Utilisasi', icon: Gauge, tone: 'teal' },
        ]} />

        <WithRail
          rail={<>
            <DonutPanel title="Ringkasan Kapasitas" center={cap} sub="Total Kapasitas" data={[
              { label: 'Terpakai', value: used, color: '#16A34A', note: `${used} (${share(used)})` },
              { label: 'Tersedia', value: cap - used, color: '#1D4ED8', note: `${cap - used} (${share(cap - used)})` },
            ]} />
            <Panel title="Utilisasi Ruang">
              <BarList rows={active.map((r) => ({ label: r.name, value: util(r), max: 100, display: pct(util(r)), color: util(r) >= 61 ? '#16A34A' : '#F97316' }))} />
            </Panel>
            <QuickList items={[
              { label: 'Tambah Ruang Baru', icon: Plus, onClick: crud.add },
              { label: 'Kelola Kondisi Ruang', icon: Wrench },
              { label: 'Laporan Ruang', icon: FileText },
              { label: 'Atur Jenis Ruang', icon: Tags },
              { label: 'Riwayat Penggunaan Ruang', icon: History, to: '/admin/jadwal-kelas' },
            ]} />
          </>}
        >
          <FilterBar onReset={() => { setQ(''); setStatus(''); setFloor(''); }}>
            <SearchInput value={q} onChange={setQ} placeholder="Cari ruang..." />
            <Select value={status} onChange={setStatus} all="Semua Status" options={['Aktif', 'Nonaktif']} />
            <Select value={floor} onChange={setFloor} all="Semua Lokasi" options={['Lantai 1', 'Lantai 2']} />
          </FilterBar>
          <DataTable columns={columns} rows={rows} rowKey={(r) => r.id} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <InfoBox items={['Kapasitas dihitung dari jumlah kursi / peserta maksimal.', 'Jika ruangan tidak digunakan untuk kelas, tandai sebagai Nonaktif.', 'Pastikan kondisi ruang selalu diperbarui secara berkala.', 'Ruang yang tidak aktif tidak akan muncul saat penjadwalan kelas.']} />
            <LegendBox title="Jenis Ruang" rows={[[<b>Ruang Kelas</b>, 'Digunakan untuk kegiatan pembelajaran.'], [<b>Laboratorium</b>, 'Khusus untuk praktikum dan eksperimen.'], [<b>Perpustakaan</b>, 'Digunakan untuk membaca & diskusi.'], [<b>Aula / Serbaguna</b>, 'Digunakan untuk event & kegiatan besar.'], [<b>Ruang Staff</b>, 'Khusus untuk guru dan staff.']]} />
            <LegendBox title="Kondisi Ruang" rows={[['Baik', 'Sarana lengkap dan layak digunakan.'], ['Perlu Perbaikan', 'Ada fasilitas yang perlu diperbaiki.'], ['Rusak', 'Tidak layak digunakan sementara.'], ['Dalam Perawatan', 'Sedang dalam proses perawatan.']]} />
          </div>
        </WithRail>
        {crud.dialogs}
      </div>
    </DashboardLayout>
  );
}
