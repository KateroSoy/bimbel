import { useState } from 'react';
import { Users, Phone, Mail, UserCheck, HeartHandshake, Upload, Download, Plus, MessageCircle, Megaphone, Printer, PhoneCall, MessageSquare } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import {
  PageHead, StatCards, FilterBar, SearchInput, Select, DataTable, Person, Badge, RowActions, Btn, InfoBox, Panel, DonutPanel, QuickList, WithRail,
  useCrud, exportCsv, soon, type Col, type Field,
} from '../../components/portal/Kit';
import { type ParentRow } from '../../data/adminPortal';

const RELATIONS = ['Ibu Kandung', 'Ayah Kandung', 'Wali'];
const FIELDS: Field[] = [
  { key: 'name', label: 'Nama Orang Tua / Wali', required: true },
  { key: 'child', label: 'Nama Siswa', required: true },
  { key: 'relation', label: 'Hubungan', type: 'select', options: RELATIONS },
  { key: 'phone', label: 'No. HP (WhatsApp)', type: 'tel', required: true },
  { key: 'email', label: 'Email', type: 'email' },
  { key: 'status', label: 'Status', type: 'select', options: ['Aktif', 'Nonaktif'] },
  { key: 'address', label: 'Alamat', type: 'textarea' },
];
const waLink = (phone: string) => `https://wa.me/62${phone.replace(/\D/g, '').replace(/^0/, '')}`;

export default function OrangTuaWali() {
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const [relation, setRelation] = useState('');

  const crud = useCrud<ParentRow>('guardians', {
    label: 'Orang Tua / Wali',
    fields: FIELDS,
    create: (v) => ({ id: '', name: v.name, child: v.child, relation: v.relation, phone: v.phone, email: v.email, address: v.address, status: v.status as ParentRow['status'] }),
    detail: (p) => [['ID', p.id], ['Nama', p.name], ['Siswa', p.child], ['Hubungan', p.relation], ['No. HP', p.phone], ['Email', p.email], ['Alamat', p.address], ['Status', <Badge>{p.status}</Badge>]],
  });

  const rows = crud.rows.filter((p) =>
    (!q || `${p.name} ${p.phone} ${p.email} ${p.child}`.toLowerCase().includes(q.toLowerCase())) && (!status || p.status === status) && (!relation || p.relation === relation));
  const all = crud.rows.length;
  const has = (f: (p: ParentRow) => boolean) => crud.rows.filter(f).length;
  const hasEmail = (p: ParentRow) => !!p.email && p.email !== '-';
  const share = (n: number) => `${((n / (all || 1)) * 100).toFixed(1).replace('.', ',')}%`;
  const rel = (r: string) => crud.rows.filter((p) => p.relation === r).length;
  const doExport = () => exportCsv('orang-tua-wali', ['ID', 'Nama', 'Siswa', 'Hubungan', 'No HP', 'Email', 'Alamat', 'Status'], rows.map((p) => [p.id, p.name, p.child, p.relation, p.phone, p.email, p.address, p.status]));

  const columns: Col<ParentRow>[] = [
    { header: 'No.', cell: (_, i) => i + 1, align: 'center' },
    { header: 'Nama Orang Tua / Wali', cell: (p) => <Person name={p.name} sub={`ID: ${p.id}`} /> },
    { header: 'Siswa (Jumlah)', cell: (p) => <>{p.child}<span className="block mt-0.5"><Badge tone="blue">1 siswa</Badge></span></> },
    { header: 'Hubungan', cell: (p) => p.relation },
    {
      header: 'Kontak',
      cell: (p) => (
        <div className="flex items-center gap-2">
          <span><span className="block font-bold text-slate-800 whitespace-nowrap">{p.phone}</span><span className="block text-[11px] text-slate-500">{p.email}</span></span>
          <a href={waLink(p.phone)} target="_blank" rel="noopener noreferrer" aria-label={`WhatsApp ${p.name}`} className="text-emerald-600 hover:text-emerald-700"><MessageCircle className="w-4 h-4" /></a>
        </div>
      ),
    },
    { header: 'Alamat', cell: (p) => <span className="block max-w-[150px]">{p.address}</span> },
    { header: 'Status', cell: (p) => <Badge>{p.status}</Badge> },
    {
      header: 'Aksi', align: 'center',
      cell: (p) => <RowActions onView={() => crud.view(p)} onEdit={() => crud.edit(p)} menu={[
        { label: 'Kirim WhatsApp', onClick: () => window.open(waLink(p.phone), '_blank', 'noopener') },
        { label: 'Hapus', onClick: () => crud.remove(p), danger: true },
      ]} />,
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-4 max-w-[1500px]">
        <PageHead
          title="Orang Tua / Wali"
          subtitle="Kelola data orang tua / wali siswa dan informasi kontak."
          actions={<>
            <Btn icon={Upload} onClick={() => soon('Import Data')}>Import Data</Btn>
            <Btn icon={Download} className="!text-emerald-700" onClick={doExport}>Export</Btn>
            <Btn variant="primary" icon={Plus} onClick={crud.add}>Tambah Orang Tua / Wali</Btn>
          </>}
        />
        <StatCards items={[
          { label: 'Total Orang Tua / Wali', value: all, sub: 'Terdaftar', icon: Users, tone: 'blue' },
          { label: 'Kontak Aktif (WA)', value: has((p) => !!p.phone), sub: `${share(has((p) => !!p.phone))} dari total`, icon: Phone, tone: 'green' },
          { label: 'Email Terdaftar', value: has(hasEmail), sub: `${share(has(hasEmail))} dari total`, icon: Mail, tone: 'purple' },
          { label: 'Terhubung dengan Siswa', value: has((p) => !!p.child), sub: 'Memiliki data siswa', icon: UserCheck, tone: 'orange' },
          { label: 'Keluarga Aktif', value: has((p) => p.status === 'Aktif'), sub: `${share(has((p) => p.status === 'Aktif'))} dari total`, icon: HeartHandshake, tone: 'teal' },
        ]} />

        <WithRail
          rail={<>
            <DonutPanel title="Ringkasan Orang Tua / Wali" center={all} sub="Total" data={[
              { label: 'Ibu Kandung', value: rel('Ibu Kandung'), color: '#1D4ED8', note: `${rel('Ibu Kandung')} (${share(rel('Ibu Kandung'))})` },
              { label: 'Ayah Kandung', value: rel('Ayah Kandung'), color: '#16A34A', note: `${rel('Ayah Kandung')} (${share(rel('Ayah Kandung'))})` },
              { label: 'Wali / Lainnya', value: rel('Wali'), color: '#F59E0B', note: `${rel('Wali')} (${share(rel('Wali'))})` },
            ]} />
            <Panel title="Komunikasi Terbanyak">
              <ul className="space-y-2.5">
                {([[MessageCircle, 'WhatsApp', `${has((p) => !!p.phone)} (${share(has((p) => !!p.phone))})`], [Mail, 'Email', `${has(hasEmail)} (${share(has(hasEmail))})`], [PhoneCall, 'Telepon', `${has((p) => !!p.phone)} kontak`], [MessageSquare, 'Tanpa email', `${all - has(hasEmail)} kontak`]] as const).map(([Icon, l, v]) => (
                  <li key={l} className="flex items-center gap-2.5 text-[13px] font-bold text-slate-800"><Icon className="w-4 h-4 text-[#1D4ED8]" /><span className="flex-1">{l}</span><span>{v}</span></li>
                ))}
              </ul>
            </Panel>
            <QuickList items={[
              { label: 'Tambah Orang Tua / Wali', icon: Plus, onClick: crud.add },
              { label: 'Import Data Orang Tua / Wali', icon: Upload },
              { label: 'Kirim Pesan WhatsApp', icon: MessageCircle, tone: 'green', to: '/admin/whatsapp' },
              { label: 'Buat Pengumuman untuk Wali', icon: Megaphone, to: '/admin/pengumuman' },
              { label: 'Cetak Daftar Kontak', icon: Printer, onClick: () => window.print() },
            ]} />
          </>}
        >
          <FilterBar onReset={() => { setQ(''); setStatus(''); setRelation(''); }}>
            <SearchInput value={q} onChange={setQ} placeholder="Cari nama orang tua / wali, no. HP, email..." />
            <Select value={status} onChange={setStatus} all="Semua Status" options={['Aktif', 'Nonaktif']} />
            <Select value={relation} onChange={setRelation} all="Semua Jenis Hubungan" options={RELATIONS} />
          </FilterBar>
          <DataTable columns={columns} rows={rows} rowKey={(p) => p.id} selectable />
          <InfoBox items={['Data orang tua / wali digunakan untuk komunikasi, informasi akademik, dan keperluan administrasi.', 'Pastikan nomor WhatsApp aktif agar pesan dan notifikasi dapat diterima dengan baik.']} />
        </WithRail>
        {crud.dialogs}
      </div>
    </DashboardLayout>
  );
}
