import { useState } from 'react';
import { Wallet, CircleCheck, Clock, Users, BarChart3, FileSpreadsheet, Plus, CalendarDays, SquarePen, FileText, Layers, Settings, BookOpen, MinusCircle, Gift, SlidersHorizontal, CalendarCheck } from 'lucide-react';
import { toast } from 'sonner';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import {
  PageHead, StatCards, Tabs, FilterBar, SearchInput, Select, DataTable, Person, Badge, RowMenu, Btn, InfoBox, Panel, DonutPanel, QuickList, WithRail,
  MiniBars, FormDialog, useCrud, exportCsv, rupiah, type Col, type Field,
} from '../../components/portal/Kit';
import { HONORS, honorStatus, staffAvatar, type HonorRow, type HonorStatus } from '../../data/adminPortal';

const TABS = ['Semua Tutor', 'Belum Dibayar', 'Sebagian Dibayar', 'Sudah Dibayar'];
const TAB_STATUS: Record<string, HonorStatus> = { 'Belum Dibayar': 'Belum Dibayar', 'Sebagian Dibayar': 'Sebagian Dibayar', 'Sudah Dibayar': 'Lunas' };
const LEVELS = ['Primary', 'SMP Intensif', 'Playclub', 'Mengaji'];
const FIELDS: Field[] = [
  { key: 'name', label: 'Nama Tutor', required: true },
  { key: 'program', label: 'Program / Kelas', required: true },
  { key: 'level', label: 'Jenjang', type: 'select', options: LEVELS },
  { key: 'sessions', label: 'Beban Mengajar (sesi)', type: 'number', required: true },
  { key: 'total', label: 'Total Honor (Rp)', type: 'number', required: true },
  { key: 'paid', label: 'Sudah Dibayar (Rp)', type: 'number' },
];
const HISTORY = [['Des 24', 18.2], ['Jan 25', 20.1], ['Feb 25', 22.6], ['Mar 25', 21.3], ['Apr 25', 24.0]] as const;

export default function HonorTutor() {
  const [tab, setTab] = useState(TABS[0]);
  const [q, setQ] = useState('');
  const [level, setLevel] = useState('');
  const [status, setStatus] = useState('');
  const [paying, setPaying] = useState<HonorRow | null>(null);

  const crud = useCrud<HonorRow>(HONORS, {
    label: 'Honor Tutor',
    fields: FIELDS,
    create: (v, rows) => ({ id: `T-${String(rows.length + 1).padStart(3, '0')}`, name: v.name, program: v.program, level: v.level, sessions: Number(v.sessions) || 0, total: Number(v.total) || 0, paid: Math.min(Number(v.paid) || 0, Number(v.total) || 0) }),
    detail: (h) => [['Tutor', `${h.name} (${h.id})`], ['Program / Kelas', `${h.program} · ${h.level}`], ['Beban Mengajar', `${h.sessions} sesi`], ['Total Honor', rupiah(h.total)], ['Dibayar', rupiah(h.paid)], ['Sisa', rupiah(h.total - h.paid)], ['Status Pembayaran', <Badge>{honorStatus(h)}</Badge>]],
  });

  const rows = crud.rows.filter((h) =>
    (!TAB_STATUS[tab] || honorStatus(h) === TAB_STATUS[tab]) && (!q || `${h.name} ${h.program} ${h.level}`.toLowerCase().includes(q.toLowerCase())) &&
    (!level || h.level === level) && (!status || honorStatus(h) === status));
  const total = crud.rows.reduce((a, h) => a + h.total, 0);
  const paid = crud.rows.reduce((a, h) => a + h.paid, 0);
  const pct = (v: number) => `${((v / (total || 1)) * 100).toFixed(2).replace('.', ',')}%`;
  const sumBy = (s: HonorStatus, f: (h: HonorRow) => number) => crud.rows.filter((h) => honorStatus(h) === s).reduce((a, h) => a + f(h), 0);
  const pending = crud.rows.filter((h) => h.paid < h.total).slice(0, 3);
  const dueDates = ['20 Mei 2025', '22 Mei 2025', '25 Mei 2025'];
  const doExport = () => exportCsv('honor-tutor', ['ID', 'Tutor', 'Program', 'Sesi', 'Total Honor', 'Dibayar', 'Sisa', 'Status'], rows.map((h) => [h.id, h.name, h.program, h.sessions, h.total, h.paid, h.total - h.paid, honorStatus(h)]));

  const columns: Col<HonorRow>[] = [
    { header: 'No.', cell: (_, i) => i + 1, align: 'center' },
    { header: 'Tutor', cell: (h) => <Person name={h.name} sub={`ID: ${h.id}`} src={staffAvatar(h.name)} /> },
    { header: 'Program / Kelas', cell: (h) => <>{h.program}<span className="block text-[11px] text-slate-500">{h.level}</span></> },
    { header: 'Beban Mengajar', align: 'center', cell: (h) => `${h.sessions} sesi` },
    { header: 'Total Honor', cell: (h) => <span className="whitespace-nowrap font-bold text-slate-800">{rupiah(h.total)}</span> },
    { header: 'Dibayar', cell: (h) => <span className={`whitespace-nowrap font-bold ${h.paid ? 'text-emerald-600' : 'text-red-600'}`}>{rupiah(h.paid)}</span> },
    { header: 'Sisa', cell: (h) => <span className={`whitespace-nowrap font-bold ${h.total - h.paid ? 'text-red-600' : 'text-slate-700'}`}>{rupiah(h.total - h.paid)}</span> },
    { header: 'Status Pembayaran', cell: (h) => <Badge>{honorStatus(h)}</Badge> },
    {
      header: 'Aksi', align: 'center',
      cell: (h) => (
        <div className="inline-flex items-center gap-1.5">
          <button aria-label="Ubah" onClick={() => crud.edit(h)} className="w-8 h-8 rounded-lg border border-slate-200 text-slate-600 hover:text-[#1D4ED8] inline-flex items-center justify-center"><SquarePen className="w-4 h-4" /></button>
          <RowMenu items={[
            { label: 'Lihat Detail', onClick: () => crud.view(h) },
            ...(h.paid < h.total ? [{ label: 'Catat Pembayaran', onClick: () => setPaying(h) }] : []),
            { label: 'Hapus', onClick: () => crud.remove(h), danger: true },
          ]} />
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-4 max-w-[1500px]">
        <PageHead
          title="Honor Tutor"
          subtitle="Kelola perhitungan dan pembayaran honor tutor secara transparan."
          actions={<>
            <Btn icon={FileSpreadsheet} className="!text-emerald-700" onClick={doExport}>Export ke Excel</Btn>
            <Btn variant="primary" icon={Plus} onClick={crud.add}>Catat Honor Tutor</Btn>
          </>}
        />
        <StatCards items={[
          { label: 'Total Honor Bulan Ini', value: rupiah(total), sub: `Dari ${crud.rows.length} tutor`, icon: Wallet, tone: 'blue' },
          { label: 'Total Dibayar', value: rupiah(paid), sub: `${pct(paid)} dari total honor`, icon: CircleCheck, tone: 'green' },
          { label: 'Sisa Belum Dibayar', value: rupiah(total - paid), sub: `${pct(total - paid)} dari total honor`, icon: Clock, tone: 'orange' },
          { label: 'Tutor Aktif', value: crud.rows.length, sub: 'Mengajar bulan ini', icon: Users, tone: 'purple' },
          { label: 'Rata-rata Honor / Tutor', value: rupiah(Math.round(total / (crud.rows.length || 1))), sub: 'Per bulan', icon: BarChart3, tone: 'teal' },
        ]} />

        <WithRail
          rail={<>
            <DonutPanel title="Ringkasan Honor" center={rupiah(total)} sub="Total Honor" data={[
              { label: 'Lunas', value: sumBy('Lunas', (h) => h.total), color: '#16A34A', note: `${rupiah(sumBy('Lunas', (h) => h.total))} (${pct(sumBy('Lunas', (h) => h.total))})` },
              { label: 'Sebagian Dibayar', value: sumBy('Sebagian Dibayar', (h) => h.total), color: '#1D4ED8', note: `${rupiah(sumBy('Sebagian Dibayar', (h) => h.total))} (${pct(sumBy('Sebagian Dibayar', (h) => h.total))})` },
              { label: 'Belum Dibayar', value: sumBy('Belum Dibayar', (h) => h.total), color: '#F59E0B', note: `${rupiah(sumBy('Belum Dibayar', (h) => h.total))} (${pct(sumBy('Belum Dibayar', (h) => h.total))})` },
            ]} />
            <Panel title="Pembayaran Terdekat">
              <ul className="space-y-2.5">
                {pending.map((h, i) => (
                  <li key={h.id}>
                    <button onClick={() => setPaying(h)} className="w-full flex items-start gap-2.5 text-left hover:opacity-80">
                      <CalendarCheck className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                      <span className="flex-1 min-w-0"><span className="block text-[13px] font-bold text-[#0F1E4A] truncate">{h.name}</span><span className="block text-[11px] text-slate-500 font-medium truncate">{h.program}</span></span>
                      <span className="text-right shrink-0"><span className="block text-[10px] text-slate-500 font-semibold">{dueDates[i]}</span><span className="block text-xs font-extrabold text-[#0F1E4A]">{rupiah(h.total - h.paid)}</span></span>
                    </button>
                  </li>
                ))}
                {pending.length === 0 && <li className="text-xs text-slate-500 font-medium">Semua honor sudah dibayar.</li>}
              </ul>
              <button onClick={() => setTab('Belum Dibayar')} className="mt-3 w-full h-9 rounded-lg border border-slate-200 text-[13px] font-bold text-[#1D4ED8] hover:bg-slate-50">Lihat Semua Jadwal Pembayaran</button>
            </Panel>
            <Panel title="Total Honor per Bulan" action={<Badge tone="slate">6 Bulan Terakhir</Badge>}>
              <MiniBars color="#BFDBFE" data={[...HISTORY.map(([label, v]) => ({ label, value: v, display: `Rp ${String(v).replace('.', ',')} jt` })), { label: 'Mei 25', value: total / 1e6, display: `Rp ${(total / 1e6).toFixed(1).replace('.', ',')} jt`, color: '#1D4ED8' }]} />
            </Panel>
          </>}
        >
          <Tabs tabs={TABS} value={tab} onChange={setTab} />
          <FilterBar onReset={() => { setQ(''); setLevel(''); setStatus(''); }}>
            <SearchInput value={q} onChange={setQ} placeholder="Cari tutor / program / kelas..." />
            <Select value={level} onChange={setLevel} all="Semua Program" options={LEVELS} />
            <Select value={status} onChange={setStatus} all="Semua Status Pembayaran" options={['Lunas', 'Sebagian Dibayar', 'Belum Dibayar']} />
            <span className="inline-flex items-center gap-2 h-10 px-3 rounded-lg border border-slate-200 bg-white text-[13px] font-bold text-slate-800"><CalendarDays className="w-4 h-4 text-slate-500" /> Mei 2025</span>
          </FilterBar>
          <DataTable columns={columns} rows={rows} rowKey={(h) => h.id} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <InfoBox items={['Honor dihitung berdasarkan jumlah sesi mengajar sesuai jadwal.', 'Pastikan kehadiran tutor sudah tervalidasi sebelum pembayaran.', 'Pembayaran honor dapat dicatat secara penuh atau sebagian.', 'Hubungi admin jika ada perbedaan perhitungan honor.']} />
            <Panel title="Ringkasan Perhitungan Honor" className="!bg-[#F4F8FF] !border-blue-100">
              <div className="grid grid-cols-2 gap-3">
                {([[BookOpen, 'Per Sesi Mengajar', 'Sesuai tarif per program'], [MinusCircle, 'Potongan', 'Keterlambatan / Ketidakhadiran'], [Gift, 'Bonus / Insentif', 'Berdasarkan kinerja & target'], [SlidersHorizontal, 'Lainnya', 'Koreksi & Penyesuaian']] as const).map(([Icon, l, s]) => (
                  <div key={l} className="flex items-start gap-2"><Icon className="w-5 h-5 text-[#1D4ED8] shrink-0" /><div><p className="text-xs font-extrabold text-[#0F1E4A]">{l}</p><p className="text-[11px] text-slate-500 font-medium">{s}</p></div></div>
                ))}
              </div>
            </Panel>
            <QuickList items={[
              { label: 'Catat Pembayaran Honor', icon: Plus, onClick: () => setTab('Belum Dibayar') },
              { label: 'Laporan Honor Tutor', icon: FileText, onClick: doExport },
              { label: 'Rekap Honor per Program', icon: Layers },
              { label: 'Pengaturan Tarif Honor', icon: Settings },
            ]} />
          </div>
        </WithRail>

        <FormDialog
          open={!!paying}
          title={`Catat Pembayaran Honor · ${paying?.name ?? ''}`}
          fields={[{ key: 'amount', label: 'Nominal Dibayar (Rp)', type: 'number', required: true }]}
          initial={{ amount: String(paying ? paying.total - paying.paid : 0) }}
          onClose={() => setPaying(null)}
          onSubmit={(v) => {
            const h = paying!;
            const next = Math.min(h.total, h.paid + (Number(v.amount) || 0));
            crud.patch(h.id, { paid: next });
            toast.success('Pembayaran honor dicatat', { description: `${h.name} · sisa ${rupiah(h.total - next)}` });
          }}
        />
        {crud.dialogs}
      </div>
    </DashboardLayout>
  );
}
