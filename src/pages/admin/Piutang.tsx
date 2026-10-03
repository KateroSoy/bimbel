import { useState } from 'react';
import { Receipt, CalendarX, CalendarClock, Users, Calculator, FileSpreadsheet, Plus, BellRing, CircleCheck, FileText, ListChecks, CalendarDays, History, Info } from 'lucide-react';
import { toast } from 'sonner';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import {
  PageHead, StatCards, Tabs, FilterBar, SearchInput, Select, DataTable, Person, Badge, RowMenu, Btn, InfoBox, Panel, DonutPanel, WithRail, Meter,
  LinkAction, FormDialog, useCrud, exportCsv, rupiah, soon, TONE_HEX, type Col, type Field, type Tone,
} from '../../components/portal/Kit';
import { type DebtRow, type DebtStatus } from '../../data/adminPortal';

const TABS = ['Semua Piutang', 'Jatuh Tempo', 'Lalu Jatuh Tempo', 'Sebagian Dibayar', 'Lunas'];
const STATUSES: DebtStatus[] = ['Jatuh Tempo', 'Lalu Jatuh Tempo', 'Sebagian Dibayar', 'Lunas'];
const FIELDS: Field[] = [
  { key: 'name', label: 'Nama Siswa', required: true },
  { key: 'program', label: 'Program / Kelas', required: true },
  { key: 'total', label: 'Total Tagihan (Rp)', type: 'number', required: true },
  { key: 'paid', label: 'Total Dibayar (Rp)', type: 'number' },
  { key: 'due', label: 'Jatuh Tempo', placeholder: '30 Mei 2025', required: true },
  { key: 'status', label: 'Status', type: 'select', options: STATUSES },
];
const rest = (d: DebtRow) => d.total - d.paid;

export default function Piutang() {
  const [tab, setTab] = useState(TABS[0]);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const [paying, setPaying] = useState<DebtRow | null>(null);

  const crud = useCrud<DebtRow>('debts', {
    label: 'Piutang',
    fields: FIELDS,
    create: (v) => ({ id: '', name: v.name, program: v.program, total: Number(v.total) || 0, paid: Number(v.paid) || 0, due: v.due, late: 0, status: v.status as DebtStatus }),
    detail: (d) => [['Siswa', `${d.name} (${d.id})`], ['Program / Kelas', d.program], ['Total Tagihan', rupiah(d.total)], ['Total Dibayar', rupiah(d.paid)], ['Sisa Piutang', rupiah(rest(d))], ['Jatuh Tempo', d.due], ['Hari Terlambat', d.late ? `${d.late} hari` : '-'], ['Status', <Badge>{d.status}</Badge>]],
  });

  const rows = crud.rows.filter((d) => (tab === TABS[0] || d.status === tab) && (!q || `${d.name} ${d.program}`.toLowerCase().includes(q.toLowerCase())) && (!status || d.status === status));
  const open = crud.rows.filter((d) => rest(d) > 0);
  const sum = (list: DebtRow[]) => list.reduce((a, d) => a + rest(d), 0);
  const total = sum(open);
  const overdue = open.filter((d) => d.status === 'Lalu Jatuh Tempo');
  const dueNow = open.filter((d) => d.status === 'Jatuh Tempo' && d.late > 0);
  const notYet = open.filter((d) => !overdue.includes(d) && !dueNow.includes(d));
  const pct = (v: number) => `${((v / (total || 1)) * 100).toFixed(2).replace('.', ',')}%`;
  const aging = [
    { label: 'Belum Jatuh Tempo', value: sum(notYet), color: '#16A34A' },
    { label: '1 - 30 hari terlambat', value: sum(open.filter((d) => d.late >= 1 && d.late <= 30)), color: '#F59E0B' },
    { label: '31 - 60 hari terlambat', value: sum(open.filter((d) => d.late > 30 && d.late <= 60)), color: '#F97316' },
    { label: '> 60 hari terlambat', value: sum(open.filter((d) => d.late > 60)), color: '#EF4444' },
  ];
  const doExport = () => exportCsv('piutang', ['ID', 'Siswa', 'Program', 'Total Tagihan', 'Dibayar', 'Sisa', 'Jatuh Tempo', 'Hari Terlambat', 'Status'], rows.map((d) => [d.id, d.name, d.program, d.total, d.paid, rest(d), d.due, d.late, d.status]));
  const remind = (d: DebtRow) => toast.success(`Pengingat dikirim ke wali ${d.name}`, { description: `Sisa piutang ${rupiah(rest(d))}` });

  const columns: Col<DebtRow>[] = [
    { header: 'No.', cell: (_, i) => i + 1, align: 'center' },
    { header: 'Siswa', cell: (d) => <Person name={d.name} sub={d.id} /> },
    { header: 'Program / Kelas', cell: (d) => <span className="block max-w-[160px]">{d.program}</span> },
    { header: 'Total Tagihan', cell: (d) => <span className="whitespace-nowrap">{rupiah(d.total)}</span> },
    { header: 'Total Dibayar', cell: (d) => <span className="whitespace-nowrap">{rupiah(d.paid)}</span> },
    { header: 'Sisa Piutang', cell: (d) => <span className={`whitespace-nowrap font-bold ${rest(d) ? 'text-red-600' : 'text-emerald-600'}`}>{rupiah(rest(d))}</span> },
    { header: 'Jatuh Tempo', cell: (d) => <span className="whitespace-nowrap">{d.due}</span> },
    { header: 'Hari Terlambat', align: 'center', cell: (d) => (d.late ? <span className="font-bold text-red-600">{d.late} hari</span> : '-') },
    { header: 'Status', cell: (d) => <Badge>{d.status}</Badge> },
    {
      header: 'Aksi', align: 'center',
      cell: (d) => <RowMenu items={[
        { label: 'Lihat Detail', onClick: () => crud.view(d) },
        ...(rest(d) > 0 ? [{ label: 'Konfirmasi Pembayaran', onClick: () => setPaying(d) }, { label: 'Kirim Pengingat', onClick: () => remind(d) }] : []),
        { label: 'Hapus', onClick: () => crud.remove(d), danger: true },
      ]} />,
    },
  ];

  const quick: { label: string; icon: typeof Plus; tone: Tone; onClick: () => void }[] = [
    { label: 'Catat Piutang Baru', icon: Plus, tone: 'blue', onClick: crud.add },
    { label: 'Kirim Pengingat', icon: BellRing, tone: 'teal', onClick: () => toast.success(`Pengingat dikirim ke ${open.length} wali murid`) },
    { label: 'Konfirmasi Pembayaran', icon: CircleCheck, tone: 'green', onClick: () => setTab('Jatuh Tempo') },
    { label: 'Laporan Piutang', icon: FileText, tone: 'purple', onClick: doExport },
    { label: 'Daftar Piutang', icon: ListChecks, tone: 'blue', onClick: () => setTab(TABS[0]) },
    { label: 'Daftar Jatuh Tempo', icon: CalendarDays, tone: 'orange', onClick: () => setTab('Jatuh Tempo') },
    { label: 'Daftar Debitur', icon: Users, tone: 'pink', onClick: () => setTab(TABS[0]) },
    { label: 'Riwayat Piutang', icon: History, tone: 'blue', onClick: () => setTab('Lunas') },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-4 max-w-[1500px]">
        <PageHead
          title="Piutang"
          subtitle="Kelola seluruh piutang siswa dan riwayat penagihan."
          actions={<>
            <Btn icon={FileSpreadsheet} className="!text-emerald-700" onClick={doExport}>Export ke Excel</Btn>
            <Btn variant="primary" icon={Plus} onClick={crud.add}>Catat Piutang Baru</Btn>
          </>}
        />
        <StatCards items={[
          { label: 'Total Piutang', value: rupiah(total), sub: `Dari ${open.length} siswa`, icon: Receipt, tone: 'blue' },
          { label: 'Piutang Lalu Jatuh Tempo', value: rupiah(sum(overdue)), sub: `${pct(sum(overdue))} dari total piutang`, icon: CalendarX, tone: 'green' },
          { label: 'Piutang Jatuh Tempo (Bulan Ini)', value: rupiah(sum(dueNow)), sub: `${pct(sum(dueNow))} dari total piutang`, icon: CalendarClock, tone: 'orange' },
          { label: 'Jumlah Debitur', value: open.length, sub: 'Siswa', icon: Users, tone: 'purple' },
          { label: 'Rata-rata Piutang / Siswa', value: rupiah(Math.round(total / (open.length || 1))), sub: 'Rata-rata per siswa', icon: Calculator, tone: 'teal' },
        ]} />

        <WithRail
          rail={<>
            <DonutPanel title="Ringkasan Piutang" center={rupiah(total)} sub="Total Piutang" data={[
              { label: 'Belum Jatuh Tempo', value: sum(notYet), color: '#16A34A', note: `${rupiah(sum(notYet))} (${pct(sum(notYet))})` },
              { label: 'Jatuh Tempo', value: sum(dueNow), color: '#F59E0B', note: `${rupiah(sum(dueNow))} (${pct(sum(dueNow))})` },
              { label: 'Lalu Jatuh Tempo', value: sum(overdue), color: '#EF4444', note: `${rupiah(sum(overdue))} (${pct(sum(overdue))})` },
            ]} />
            <Panel title={<>Aging Piutang <span className="text-[10px] font-semibold text-slate-500">(Berdasarkan Tanggal Jatuh Tempo)</span></>}>
              <ul className="space-y-2.5">
                {aging.map((a) => (
                  <li key={a.label}>
                    <div className="flex justify-between text-xs font-bold text-slate-700 mb-1"><span>{a.label}</span><span>{rupiah(a.value)} ({pct(a.value)})</span></div>
                    <Meter value={(a.value / (total || 1)) * 100} color={a.color} />
                  </li>
                ))}
              </ul>
            </Panel>
            <Panel title="5 Piutang Terbesar" action={<LinkAction onClick={() => setTab(TABS[0])}>Lihat Semua</LinkAction>}>
              <ol className="space-y-2">
                {[...open].sort((a, b) => rest(b) - rest(a)).slice(0, 5).map((d, i) => (
                  <li key={d.id} className="flex items-center gap-2.5 text-[13px] font-bold text-slate-800">
                    <span className="w-6 h-6 rounded-md bg-[#EAF1FF] text-[#1D4ED8] text-xs flex items-center justify-center">{i + 1}</span>
                    <span className="flex-1 truncate">{d.name}</span><span>{rupiah(rest(d))}</span>
                  </li>
                ))}
              </ol>
            </Panel>
          </>}
        >
          <FilterBar onReset={() => { setQ(''); setStatus(''); }}>
            <SearchInput value={q} onChange={setQ} placeholder="Cari siswa / orang tua / program..." />
            <Select value={status} onChange={setStatus} all="Semua Status" options={STATUSES} />
          </FilterBar>
          <Tabs tabs={TABS.map((t) => (t === 'Lunas' ? { label: 'Lunas (dengan Sisa Bayar)', value: t } : t))} value={tab} onChange={setTab} />
          <DataTable columns={columns} rows={rows} rowKey={(d) => d.id} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <InfoBox items={['Piutang dihitung dari tagihan yang belum dibayar penuh.', 'Status piutang diperbarui otomatis sesuai jatuh tempo.', 'Hubungi orang tua/wali untuk konfirmasi pembayaran.', 'Gunakan menu Pengingat untuk mengirim reminder.']} />
            <Panel title="Aksi Cepat" className="!bg-[#F4F8FF] !border-blue-100">
              <div className="grid grid-cols-4 gap-2">
                {quick.map((a) => (
                  <button key={a.label} onClick={a.onClick} className="flex flex-col items-center gap-1 text-center">
                    <span className="w-9 h-9 rounded-lg bg-white border border-slate-100 flex items-center justify-center"><a.icon className="w-4 h-4" style={{ color: TONE_HEX[a.tone] }} /></span>
                    <span className="text-[10px] font-bold text-slate-700 leading-tight">{a.label}</span>
                  </button>
                ))}
              </div>
            </Panel>
            <Panel title="Catatan" className="!bg-[#F4F8FF] !border-blue-100">
              <ul className="space-y-2 text-xs text-slate-600 font-medium">
                {['Pastikan data tagihan siswa sudah benar agar piutang tercatat akurat.', 'Pembayaran sebagian akan mengurangi sisa piutang secara otomatis.', 'Gunakan fitur laporan untuk memantau piutang setiap periode.'].map((t) => (
                  <li key={t} className="flex gap-2"><Info className="w-3.5 h-3.5 text-[#1D4ED8] shrink-0 mt-0.5" />{t}</li>
                ))}
              </ul>
              <button onClick={() => soon('Pengaturan Reminder')} className="mt-3 text-[13px] font-bold text-[#1D4ED8] hover:underline">Pengaturan Reminder</button>
            </Panel>
          </div>
        </WithRail>

        <FormDialog
          open={!!paying}
          title={`Konfirmasi Pembayaran · ${paying?.name ?? ''}`}
          fields={[{ key: 'amount', label: 'Nominal Dibayar (Rp)', type: 'number', required: true }]}
          initial={{ amount: String(paying ? rest(paying) : 0) }}
          onClose={() => setPaying(null)}
          onSubmit={(v) => {
            const d = paying!;
            const paid = Math.min(d.total, d.paid + (Number(v.amount) || 0));
            crud.patch(d.id, { paid, status: paid >= d.total ? 'Lunas' : 'Sebagian Dibayar', late: paid >= d.total ? 0 : d.late });
            toast.success('Pembayaran dikonfirmasi', { description: `${d.name} · sisa ${rupiah(d.total - paid)}` });
          }}
        />
        {crud.dialogs}
      </div>
    </DashboardLayout>
  );
}
