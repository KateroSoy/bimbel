import { useState } from 'react';
import {
  Wallet, ArrowDownToLine, PieChart, Calculator, FileText, FileSpreadsheet, Plus, CalendarDays, ReceiptText, Tags, Target, UserRound, Building2,
  PenLine, Megaphone, ShieldCheck, Wrench, Wifi, GraduationCap, Coffee, MoreHorizontal, Banknote, Landmark, Smartphone, type LucideIcon,
} from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import {
  PageHead, StatCards, Tabs, FilterBar, SearchInput, Select, DataTable, Badge, RowActions, Btn, InfoBox, Panel, DonutPanel, QuickList, WithRail,
  Meter, LinkAction, useCrud, exportCsv, rupiah, soon, TONE_HEX, type Col, type Field, type Tone,
} from '../../components/portal/Kit';
import { EXPENSE_CATEGORIES, type ExpenseRow } from '../../data/adminPortal';

const BUDGET = 25000000;
const METHODS = ['Transfer Bank', 'Tunai', 'E-Wallet'];
const CAT: Record<string, { icon: LucideIcon; tone: Tone }> = {
  'Gaji & Honor': { icon: UserRound, tone: 'purple' }, 'Sewa & Utilitas': { icon: Building2, tone: 'blue' }, 'ATK & Perlengkapan': { icon: PenLine, tone: 'green' },
  'Promosi & Marketing': { icon: Megaphone, tone: 'red' }, 'Kebersihan & Keamanan': { icon: ShieldCheck, tone: 'orange' }, 'Perawatan & Perbaikan': { icon: Wrench, tone: 'purple' },
  'Internet & Telepon': { icon: Wifi, tone: 'blue' }, 'Pelatihan & Pengembangan': { icon: GraduationCap, tone: 'teal' }, Konsumsi: { icon: Coffee, tone: 'orange' }, 'Lain-lain': { icon: MoreHorizontal, tone: 'slate' },
};
const TABS = ['Semua Pengeluaran', 'Berdasarkan Kategori', 'Berdasarkan Metode', 'Berdasarkan Anggaran'];
const FIELDS: Field[] = [
  { key: 'category', label: 'Kategori', type: 'select', options: EXPENSE_CATEGORIES },
  { key: 'amount', label: 'Nominal (Rp)', type: 'number', required: true },
  { key: 'method', label: 'Metode', type: 'select', options: METHODS },
  { key: 'channel', label: 'Bank / Kanal', placeholder: 'BCA, OVO, ...' },
  { key: 'status', label: 'Status', type: 'select', options: ['Dibayar', 'Tertunda'] },
  { key: 'note', label: 'Keterangan', type: 'textarea', required: true },
];

const CatIcon = ({ name }: { name: string }) => {
  const c = CAT[name] ?? CAT['Lain-lain'];
  return <span className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${TONE_HEX[c.tone]}1A`, color: TONE_HEX[c.tone] }}><c.icon className="w-4 h-4" /></span>;
};

export default function Pengeluaran() {
  const [tab, setTab] = useState(TABS[0]);
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('');
  const [method, setMethod] = useState('');

  const crud = useCrud<ExpenseRow>('expenses', {
    label: 'Pengeluaran',
    fields: FIELDS,
    create: (v) => ({ id: '', date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }), time: new Date().toTimeString().slice(0, 5), category: v.category, note: v.note, method: v.method, channel: v.channel, amount: Number(v.amount) || 0, status: v.status as ExpenseRow['status'] }),
    detail: (e) => [['Tanggal', `${e.date}, ${e.time}`], ['Kategori', e.category], ['Keterangan', e.note], ['Metode', `${e.method} ${e.channel}`], ['Nominal', rupiah(e.amount)], ['Status', <Badge>{e.status}</Badge>]],
  });

  const rows = crud.rows.filter((e) => (!q || `${e.category} ${e.note}`.toLowerCase().includes(q.toLowerCase())) && (!category || e.category === category) && (!method || e.method === method));
  const total = crud.rows.reduce((a, e) => a + e.amount, 0);
  const pct = (v: number, base = total) => `${((v / (base || 1)) * 100).toFixed(1).replace('.', ',')}%`;
  const group = (key: 'category' | 'method') =>
    Object.entries(crud.rows.reduce<Record<string, number>>((acc, e) => ({ ...acc, [e[key]]: (acc[e[key]] ?? 0) + e.amount }), {})).sort((a, b) => b[1] - a[1]);
  const byCategory = group('category');
  const top = byCategory.slice(0, 3);
  const others = byCategory.slice(3).reduce((a, [, v]) => a + v, 0);
  const todayRows = crud.rows.filter((e) => e.date === crud.rows[0]?.date);
  const doExport = () => exportCsv('pengeluaran', ['Tanggal', 'Kategori', 'Keterangan', 'Metode', 'Nominal', 'Status'], rows.map((e) => [`${e.date} ${e.time}`, e.category, e.note, `${e.method} ${e.channel}`.trim(), e.amount, e.status]));

  const columns: Col<ExpenseRow>[] = [
    { header: 'No.', cell: (_, i) => i + 1, align: 'center' },
    { header: 'Tanggal', cell: (e) => <span className="whitespace-nowrap">{e.date}<span className="block text-[11px] text-slate-500">{e.time}</span></span> },
    { header: 'Kategori', cell: (e) => <div className="flex items-center gap-2.5"><CatIcon name={e.category} /><span className="font-bold text-[#0F1E4A]">{e.category}</span></div> },
    { header: 'Keterangan', cell: (e) => <span className="block max-w-[200px]">{e.note}</span> },
    { header: 'Metode', cell: (e) => <span className="whitespace-nowrap font-bold text-slate-800">{e.method}<span className="block text-[11px] text-slate-500 font-medium">{e.channel}</span></span> },
    { header: 'Nominal', align: 'right', cell: (e) => <span className="whitespace-nowrap font-bold text-red-600">{rupiah(e.amount)}</span> },
    { header: 'Status', cell: (e) => <Badge>{e.status}</Badge> },
    { header: 'Bukti', align: 'center', cell: () => <button aria-label="Lihat bukti" onClick={() => soon('Bukti Pengeluaran')} className="text-[#1D4ED8]"><ReceiptText className="w-4 h-4" /></button> },
    { header: 'Aksi', align: 'center', cell: (e) => <RowActions onView={() => crud.view(e)} onEdit={() => crud.edit(e)} menu={[{ label: 'Hapus', onClick: () => crud.remove(e), danger: true }]} /> },
  ];

  const groupCols = (label: string): Col<[string, number]>[] => [
    { header: 'No.', cell: (_, i) => i + 1, align: 'center' },
    { header: label, cell: ([k]) => <div className="flex items-center gap-2.5">{label === 'Kategori' && <CatIcon name={k} />}<span className="font-bold text-[#0F1E4A]">{k}</span></div> },
    { header: 'Transaksi', align: 'center', cell: ([k]) => crud.rows.filter((e) => (label === 'Kategori' ? e.category : e.method) === k).length },
    { header: 'Total', align: 'right', cell: ([, v]) => <span className="font-bold text-red-600">{rupiah(v)}</span> },
    { header: 'Porsi', cell: ([, v]) => <div className="w-32"><span className="font-bold text-slate-800">{pct(v)}</span><Meter value={(v / (total || 1)) * 100} color="#1D4ED8" className="mt-1" /></div> },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-4 max-w-[1500px]">
        <PageHead
          title="Pengeluaran"
          subtitle="Kelola seluruh pengeluaran bimbel secara terstruktur dan transparan."
          actions={<>
            <Btn icon={FileSpreadsheet} className="!text-emerald-700" onClick={doExport}>Export ke Excel</Btn>
            <Btn variant="primary" icon={Plus} onClick={crud.add}>Catat Pengeluaran</Btn>
          </>}
        />
        <StatCards items={[
          { label: 'Total Pengeluaran', value: rupiah(total), sub: `Dari ${crud.rows.length} transaksi`, icon: Wallet, tone: 'blue' },
          { label: 'Pengeluaran Bulan Ini', value: rupiah(total), sub: `${pct(total, BUDGET)} dari anggaran`, icon: ArrowDownToLine, tone: 'green' },
          { label: 'Sisa Anggaran', value: rupiah(BUDGET - total), sub: `${pct(BUDGET - total, BUDGET)} dari anggaran`, icon: PieChart, tone: 'orange' },
          { label: 'Rata-rata / Transaksi', value: rupiah(Math.round(total / (crud.rows.length || 1))), sub: 'Per transaksi', icon: Calculator, tone: 'purple' },
          { label: 'Transaksi Terbaru', value: rupiah(todayRows.reduce((a, e) => a + e.amount, 0)), sub: `${todayRows.length} transaksi · ${crud.rows[0]?.date ?? '-'}`, icon: FileText, tone: 'teal' },
        ]} />

        <WithRail
          rail={<>
            <DonutPanel title="Ringkasan Pengeluaran" center={rupiah(total)} sub="Total Pengeluaran" data={[
              ...top.map(([k, v]) => ({ label: k, value: v, color: TONE_HEX[CAT[k]?.tone ?? 'slate'], note: `${rupiah(v)} (${pct(v)})` })),
              { label: 'Lainnya', value: others, color: '#10B981', note: `${rupiah(others)} (${pct(others)})` },
            ]} />
            <Panel title="Pengeluaran vs Anggaran">
              <Meter value={(total / BUDGET) * 100} color="#1D4ED8" className="!h-2" />
              <div className="flex justify-between mt-1.5 text-[11px] font-semibold text-slate-500">
                <span><b className="text-slate-800">{rupiah(total)}</b><br />Terpakai</span><span className="text-right"><b className="text-slate-800">{rupiah(BUDGET)}</b><br />Anggaran</span>
              </div>
              <p className="text-center mt-2 text-base font-extrabold text-[#0F1E4A]">{pct(total, BUDGET)}</p>
              <p className="text-center text-[11px] text-slate-500 font-semibold">Persentase Terpakai</p>
            </Panel>
            <Panel title="Pengeluaran per Kategori" action={<LinkAction onClick={() => setTab('Berdasarkan Kategori')}>Lihat Semua</LinkAction>}>
              <ul className="space-y-2">
                {byCategory.slice(0, 5).map(([k, v]) => (
                  <li key={k} className="flex items-center gap-2.5 text-[13px] font-bold text-slate-800"><CatIcon name={k} /><span className="flex-1 truncate">{k}</span><span>{rupiah(v)}</span></li>
                ))}
              </ul>
            </Panel>
            <QuickList items={[
              { label: 'Catat Pengeluaran Baru', icon: Plus, onClick: crud.add },
              { label: 'Pengaturan Kategori', icon: Tags },
              { label: 'Pengaturan Anggaran', icon: Target },
              { label: 'Laporan Pengeluaran', icon: FileText, to: '/admin/laporan-keuangan' },
            ]} />
          </>}
        >
          <FilterBar onReset={() => { setQ(''); setCategory(''); setMethod(''); }}>
            <SearchInput value={q} onChange={setQ} placeholder="Cari pengeluaran / kategori / keterangan..." />
            <Select value={category} onChange={setCategory} all="Semua Kategori" options={EXPENSE_CATEGORIES} />
            <Select value={method} onChange={setMethod} all="Semua Metode" options={METHODS} />
            <span className="inline-flex items-center gap-2 h-10 px-3 rounded-lg border border-slate-200 bg-white text-[13px] font-bold text-slate-800"><CalendarDays className="w-4 h-4 text-slate-500" /> 01 - 31 Mei 2025</span>
          </FilterBar>
          <Tabs tabs={TABS} value={tab} onChange={setTab} />

          {tab === TABS[0] && <DataTable columns={columns} rows={rows} rowKey={(e) => e.id} />}
          {tab === TABS[1] && <DataTable columns={groupCols('Kategori')} rows={byCategory} rowKey={([k]) => k} unit="kategori" />}
          {tab === TABS[2] && <DataTable columns={groupCols('Metode')} rows={group('method')} rowKey={([k]) => k} unit="metode" />}
          {tab === TABS[3] && (
            <Panel title="Realisasi Anggaran per Kategori">
              <ul className="space-y-3">
                {byCategory.map(([k, v]) => {
                  // Pagu contoh (belum ada data anggaran per kategori): 125% realisasi, dibulatkan ke atas per Rp 500.000
                  const cap = Math.max(Math.ceil((v * 1.25) / 500000) * 500000, 500000);
                  return (
                    <li key={k}>
                      <div className="flex justify-between text-xs font-bold text-slate-700 mb-1"><span>{k}</span><span>{rupiah(v)} / {rupiah(cap)} ({pct(v, cap)})</span></div>
                      <Meter value={(v / cap) * 100} />
                    </li>
                  );
                })}
              </ul>
            </Panel>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <InfoBox items={['Catat setiap pengeluaran sesuai bukti transaksi.', 'Pilih kategori yang tepat untuk memudahkan laporan.', 'Data pengeluaran akan mempengaruhi laporan keuangan.', 'Pastikan pengeluaran sesuai dengan anggaran yang tersedia.']} />
            <Panel title="Kategori Pengeluaran" className="!bg-[#F4F8FF] !border-blue-100">
              <div className="grid grid-cols-5 gap-2">
                {EXPENSE_CATEGORIES.map((c) => (
                  <button key={c} onClick={() => { setCategory(c); setTab(TABS[0]); }} className="flex flex-col items-center gap-1 text-center"><CatIcon name={c} /><span className="text-[9px] font-bold text-slate-700 leading-tight">{c}</span></button>
                ))}
              </div>
            </Panel>
            <Panel title="Metode Pembayaran" className="!bg-[#F4F8FF] !border-blue-100">
              <div className="grid grid-cols-3 gap-2">
                {([[Banknote, 'Tunai'], [Landmark, 'Transfer Bank'], [Smartphone, 'E-Wallet']] as const).map(([Icon, l]) => (
                  <button key={l} onClick={() => { setMethod(l); setTab(TABS[0]); }} className="flex flex-col items-center gap-1 text-center"><span className="w-9 h-9 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-emerald-600"><Icon className="w-4 h-4" /></span><span className="text-[10px] font-bold text-slate-700">{l}</span></button>
                ))}
              </div>
            </Panel>
          </div>
        </WithRail>
        {crud.dialogs}
      </div>
    </DashboardLayout>
  );
}
