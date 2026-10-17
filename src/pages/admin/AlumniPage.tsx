import { useState } from 'react';
import { GraduationCap, Trophy, CalendarCheck, Phone, Plus, Download, MessageCircle, School } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import {
  PageHead, StatCards, FilterBar, SearchInput, Select, DataTable, Person, Badge, RowActions, Btn, InfoBox, Panel, DonutPanel, WithRail,
  useCrud, exportCsv, type Col, type Field,
} from '../../components/portal/Kit';

interface AlumniRow {
  id: string; name: string; program: string; year: string; school: string; continuedTo: string;
  achievement: string; phone: string; status: 'Aktif Kontak' | 'Tidak Aktif'; note: string;
}

const STATUSES = ['Aktif Kontak', 'Tidak Aktif'];
const COLORS = ['#1D4ED8', '#16A34A', '#F59E0B', '#7C3AED', '#EC4899', '#0EA5B7'];
const FIELDS: Field[] = [
  { key: 'name', label: 'Nama Alumni', required: true },
  { key: 'program', label: 'Program Terakhir' },
  { key: 'year', label: 'Tahun Lulus', placeholder: String(new Date().getFullYear()) },
  { key: 'school', label: 'Sekolah Saat di Bimbel' },
  { key: 'continuedTo', label: 'Melanjutkan ke' },
  { key: 'phone', label: 'No. WhatsApp', type: 'tel' },
  { key: 'achievement', label: 'Prestasi', type: 'textarea' },
  { key: 'status', label: 'Status Kontak', type: 'select', options: STATUSES },
  { key: 'note', label: 'Catatan', type: 'textarea' },
];
const waLink = (phone: string) => `https://wa.me/62${phone.replace(/\D/g, '').replace(/^0/, '')}`;

export default function AlumniPage() {
  const [q, setQ] = useState('');
  const [year, setYear] = useState('');
  const [status, setStatus] = useState('');

  const crud = useCrud<AlumniRow>('alumni', {
    label: 'Alumni',
    fields: FIELDS,
    create: (v) => ({ id: '', name: v.name, program: v.program, year: v.year, school: v.school, continuedTo: v.continuedTo, achievement: v.achievement, phone: v.phone, status: (v.status || 'Aktif Kontak') as AlumniRow['status'], note: v.note }),
    detail: (a) => [['ID', a.id], ['Nama', a.name], ['Program', a.program || '-'], ['Tahun Lulus', a.year || '-'], ['Sekolah', a.school || '-'], ['Melanjutkan ke', a.continuedTo || '-'], ['Prestasi', a.achievement || '-'], ['No. WhatsApp', a.phone || '-'], ['Status', <Badge>{a.status}</Badge>], ['Catatan', a.note || '-']],
  });

  const years = [...new Set(crud.rows.map((a) => a.year).filter(Boolean))].sort().reverse();
  const rows = crud.rows.filter((a) =>
    (!q || `${a.name} ${a.program} ${a.school} ${a.continuedTo}`.toLowerCase().includes(q.toLowerCase())) && (!year || a.year === year) && (!status || a.status === status));
  const thisYear = String(new Date().getFullYear());
  const byProgram = Object.entries(crud.rows.reduce<Record<string, number>>((m, a) => ({ ...m, [a.program || 'Lainnya']: (m[a.program || 'Lainnya'] ?? 0) + 1 }), {}));

  const columns: Col<AlumniRow>[] = [
    { header: 'No.', cell: (_, i) => i + 1, align: 'center' },
    { header: 'Alumni', cell: (a) => <Person name={a.name} sub={`ID: ${a.id}`} /> },
    { header: 'Program', cell: (a) => a.program || '-' },
    { header: 'Lulus', align: 'center', cell: (a) => a.year || '-' },
    { header: 'Sekolah → Lanjut', cell: (a) => <><span className="block">{a.school || '-'}</span><span className="block text-[11px] text-slate-500">→ {a.continuedTo || '-'}</span></> },
    { header: 'Prestasi', cell: (a) => a.achievement ? <span className="block max-w-[200px] text-xs font-semibold text-emerald-700">{a.achievement}</span> : <span className="text-slate-400">-</span> },
    { header: 'Status', cell: (a) => <Badge tone={a.status === 'Aktif Kontak' ? 'green' : 'slate'}>{a.status}</Badge> },
    {
      header: 'Aksi', align: 'center',
      cell: (a) => <RowActions onView={() => crud.view(a)} onEdit={() => crud.edit(a)} menu={[
        ...(a.phone ? [{ label: 'Kirim WhatsApp', onClick: () => window.open(waLink(a.phone), '_blank', 'noopener') }] : []),
        { label: 'Hapus', onClick: () => crud.remove(a), danger: true },
      ]} />,
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-4 max-w-[1500px]">
        <PageHead
          title="Alumni"
          subtitle="Data siswa yang telah menyelesaikan program di StudyHack, beserta sekolah lanjutan dan prestasinya."
          actions={<>
            <Btn icon={Download} className="!text-emerald-700" onClick={() => exportCsv('alumni', ['ID', 'Nama', 'Program', 'Tahun Lulus', 'Sekolah', 'Melanjutkan ke', 'Prestasi', 'No WA', 'Status'], rows.map((a) => [a.id, a.name, a.program, a.year, a.school, a.continuedTo, a.achievement, a.phone, a.status]))}>Export</Btn>
            <Btn variant="primary" icon={Plus} onClick={crud.add}>Tambah Alumni</Btn>
          </>}
        />
        <StatCards items={[
          { label: 'Total Alumni', value: crud.rows.length, sub: 'Tercatat', icon: GraduationCap, tone: 'blue' },
          { label: `Lulus ${thisYear}`, value: crud.rows.filter((a) => a.year === thisYear).length, sub: 'Tahun ini', icon: CalendarCheck, tone: 'purple' },
          { label: 'Berprestasi', value: crud.rows.filter((a) => a.achievement).length, sub: 'Punya catatan prestasi', icon: Trophy, tone: 'amber' },
          { label: 'Kontak Aktif', value: crud.rows.filter((a) => a.status === 'Aktif Kontak').length, sub: 'Bisa dihubungi', icon: Phone, tone: 'green' },
          { label: 'Sekolah Lanjutan', value: new Set(crud.rows.map((a) => a.continuedTo).filter(Boolean)).size, sub: 'Sekolah berbeda', icon: School, tone: 'teal' },
        ]} />
        <WithRail rail={<>
          <DonutPanel title="Alumni per Program" center={crud.rows.length} sub="Alumni" data={byProgram.map(([label, value], i) => ({ label, value, color: COLORS[i % COLORS.length], note: String(value) }))} />
          <Panel title="Prestasi Terbaru">
            <ul className="space-y-2.5">
              {crud.rows.filter((a) => a.achievement).slice(0, 5).map((a) => (
                <li key={a.id} className="flex gap-2.5"><Trophy className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" /><span className="text-[13px] font-semibold text-slate-700"><strong className="text-[#0F1E4A]">{a.name}</strong> · {a.achievement}</span></li>
              ))}
            </ul>
          </Panel>
          <InfoBox items={['Alumni berprestasi dapat ditampilkan sebagai testimoni di website.', 'Hubungi alumni untuk program lanjutan atau promo Bawa Teman.']} />
        </>}>
          <FilterBar onReset={() => { setQ(''); setYear(''); setStatus(''); }} more={false}>
            <SearchInput value={q} onChange={setQ} placeholder="Cari nama, program, sekolah..." />
            <Select value={year} onChange={setYear} all="Semua Tahun" options={years} />
            <Select value={status} onChange={setStatus} all="Semua Status" options={STATUSES} />
          </FilterBar>
          <DataTable columns={columns} rows={rows} rowKey={(a) => a.id} unit="alumni" empty={crud.loading ? 'Memuat…' : 'Belum ada data alumni.'} />
          <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5"><MessageCircle className="w-3.5 h-3.5" /> Gunakan menu aksi untuk menghubungi alumni lewat WhatsApp.</p>
        </WithRail>
        {crud.dialogs}
      </div>
    </DashboardLayout>
  );
}
