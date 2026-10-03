import { useState } from 'react';
import {
  Receipt, CircleCheck, Hourglass, AlarmClock, Users, FileSpreadsheet, Settings, Plus, BellRing, FileText, History, CalendarDays, Banknote,
  Landmark, QrCode, Smartphone, Clock, AlertTriangle, ChevronRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import {
  PageHead, StatCards, Tabs, FilterBar, SearchInput, Select, DataTable, Person, Badge, RowMenu, Btn, InfoBox, Panel, DonutPanel, QuickList, WithRail,
  KeyValues, FormDialog, exportCsv, rupiah, soon, type Col,
} from '../../components/portal/Kit';
import { BILLS, type BillRow, type BillStatus } from '../../data/adminPortal';

const TAB_TO: Record<string, string> = { 'Riwayat Pembayaran': '/admin/pembayaran', Piutang: '/admin/piutang' };
const statusOf = (paid: number, total: number): BillStatus => (paid >= total ? 'Lunas' : paid > 0 ? 'Belum Lunas' : 'Terlambat');
const total = (b: BillRow) => b.amount - b.discount;

export default function SppTagihan() {
  const navigate = useNavigate();
  const [rows, setRows] = useState(BILLS);
  const [tab, setTab] = useState('Ringkasan Tagihan');
  const [q, setQ] = useState('');
  const [program, setProgram] = useState('');
  const [status, setStatus] = useState('');
  const [paying, setPaying] = useState<BillRow | null>(null);
  const [adding, setAdding] = useState(false);

  const filtered = rows.filter((b) => (!q || `${b.name} ${b.id}`.toLowerCase().includes(q.toLowerCase())) && (!program || b.program === program) && (!status || b.status === status));
  const sum = (f: (b: BillRow) => number, list = rows) => list.reduce((a, b) => a + f(b), 0);
  const billed = sum(total);
  const paid = sum((b) => b.paid);
  const late = sum((b) => total(b) - b.paid, rows.filter((b) => b.status === 'Terlambat'));
  const partial = billed - paid - late;
  const pct = (v: number) => `${((v / (billed || 1)) * 100).toFixed(2).replace('.', ',')}%`;
  const n = (s: BillStatus) => rows.filter((b) => b.status === s).length;

  const columns: Col<BillRow>[] = [
    { header: 'No.', cell: (_, i) => i + 1, align: 'center' },
    { header: 'Siswa', cell: (b) => <Person name={b.name} sub={b.id} /> },
    { header: 'Program / Kelas', cell: (b) => <>{b.program}<span className="block text-[11px] text-slate-500">{b.kelas}</span></> },
    { header: 'Tagihan', cell: (b) => <span className="whitespace-nowrap">{rupiah(b.amount)}</span> },
    { header: 'Diskon', cell: (b) => (b.discount ? <span className="whitespace-nowrap">{rupiah(b.discount)}<span className="block text-[11px] text-slate-500">({Math.round((b.discount / b.amount) * 100)}%)</span></span> : '-') },
    { header: 'Total Tagihan', cell: (b) => <span className="whitespace-nowrap font-bold text-slate-800">{rupiah(total(b))}</span> },
    { header: 'Terbayar', cell: (b) => <span className={`whitespace-nowrap font-bold ${b.paid ? 'text-emerald-600' : 'text-red-600'}`}>{rupiah(b.paid)}</span> },
    { header: 'Sisa Tagihan', cell: (b) => <span className={`whitespace-nowrap font-bold ${total(b) - b.paid ? 'text-red-600' : 'text-slate-700'}`}>{rupiah(total(b) - b.paid)}</span> },
    { header: 'Jatuh Tempo', cell: (b) => <span className="whitespace-nowrap">{b.due}</span> },
    { header: 'Status', cell: (b) => <Badge>{b.status}</Badge> },
    {
      header: 'Aksi', align: 'center',
      cell: (b) => <RowMenu items={[
        ...(b.status !== 'Lunas' ? [{ label: 'Catat Pembayaran', onClick: () => setPaying(b) }, { label: 'Kirim Pengingat', onClick: () => toast.success(`Pengingat dikirim ke wali ${b.name}`) }] : []),
        { label: 'Cetak Kuitansi', onClick: () => soon('Cetak Kuitansi') },
      ]} />,
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-4 max-w-[1500px]">
        <PageHead
          title="SPP & Tagihan"
          subtitle="Kelola pembayaran SPP siswa, riwayat transaksi, dan status tagihan."
          actions={<>
            <Btn icon={FileSpreadsheet} className="!text-emerald-700" onClick={() => exportCsv('spp-tagihan', ['ID', 'Siswa', 'Program', 'Tagihan', 'Diskon', 'Total', 'Terbayar', 'Sisa', 'Jatuh Tempo', 'Status'], filtered.map((b) => [b.id, b.name, b.program, b.amount, b.discount, total(b), b.paid, total(b) - b.paid, b.due, b.status]))}>Export ke Excel</Btn>
            <Btn variant="primary" icon={Settings} onClick={() => soon('Pengaturan Tagihan')}>Pengaturan Tagihan</Btn>
          </>}
        />
        <StatCards items={[
          { label: 'Total Tagihan Bulan Ini', value: rupiah(billed), sub: `Dari ${rows.length} siswa`, icon: Receipt, tone: 'blue' },
          { label: 'Total Terbayar', value: rupiah(paid), sub: `${pct(paid)} dari tagihan`, icon: CircleCheck, tone: 'green' },
          { label: 'Belum Terbayar', value: rupiah(billed - paid), sub: `${pct(billed - paid)} dari tagihan`, icon: Hourglass, tone: 'orange' },
          { label: 'Terlambat Bayar', value: rupiah(late), sub: `${n('Terlambat')} siswa`, icon: AlarmClock, tone: 'purple' },
          { label: 'Total Siswa', value: rows.length, sub: 'Aktif', icon: Users, tone: 'teal' },
        ]} />

        <WithRail
          rail={<>
            <DonutPanel title="Ringkasan Tagihan Bulan Ini" center={rupiah(billed)} sub="Total Tagihan" data={[
              { label: 'Lunas', value: paid, color: '#16A34A', note: `${rupiah(paid)} (${pct(paid)})` },
              { label: 'Belum Lunas', value: partial, color: '#F59E0B', note: `${rupiah(partial)} (${pct(partial)})` },
              { label: 'Terlambat', value: late, color: '#EF4444', note: `${rupiah(late)} (${pct(late)})` },
            ]} />
            <Panel title="Status Siswa">
              <ul className="space-y-2.5">
                {([[CircleCheck, 'Lunas', '#16A34A'], [Clock, 'Belum Lunas', '#F59E0B'], [AlertTriangle, 'Terlambat', '#EF4444']] as const).map(([Icon, s, color]) => (
                  <li key={s} className="flex items-center gap-2.5 text-[13px] font-bold text-slate-800"><Icon className="w-4 h-4" style={{ color }} /><span className="flex-1">{s}</span><span>{n(s)} siswa</span></li>
                ))}
              </ul>
              <button onClick={() => setTab('Tagihan Per Siswa')} className="mt-3 w-full h-9 rounded-lg border border-slate-200 text-[13px] font-bold text-[#1D4ED8] hover:bg-slate-50">Lihat Detail</button>
            </Panel>
            <Panel title="Pengingat Pembayaran">
              {[['Jatuh tempo hari ini', '5 siswa'], ['Jatuh tempo 3 hari lagi', '12 siswa'], ['Terlambat lebih dari 7 hari', `${n('Terlambat')} siswa`]].map(([l, v]) => (
                <button key={l} onClick={() => toast.success('Pengingat pembayaran dikirim', { description: `${l}: ${v}` })} className="w-full flex items-center gap-2 py-2 text-[13px] font-bold text-slate-800 hover:text-[#1D4ED8]">
                  <BellRing className="w-4 h-4 text-red-500" /><span className="flex-1 text-left">{l}</span><span className="text-slate-600">{v}</span><ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              ))}
            </Panel>
            <QuickList items={[
              { label: 'Buat Tagihan Bulan Ini', icon: Plus, onClick: () => setAdding(true) },
              { label: 'Kirim Pengingat Pembayaran', icon: BellRing, onClick: () => toast.success('Pengingat dikirim ke semua wali dengan tagihan belum lunas') },
              { label: 'Laporan Tagihan', icon: FileText, to: '/admin/laporan-keuangan' },
              { label: 'Riwayat Pembayaran', icon: History, to: '/admin/pembayaran' },
            ]} />
          </>}
        >
          <Tabs tabs={['Ringkasan Tagihan', 'Tagihan Per Siswa', 'Riwayat Pembayaran', 'Piutang', 'Pengaturan SPP']} value={tab} onChange={(t) => (TAB_TO[t] ? navigate(TAB_TO[t]) : t === 'Pengaturan SPP' ? soon('Pengaturan SPP') : setTab(t))} />
          <FilterBar onReset={() => { setQ(''); setProgram(''); setStatus(''); }}>
            <SearchInput value={q} onChange={setQ} placeholder="Cari siswa / nama orang tua / ID..." />
            <Select value={program} onChange={setProgram} all="Semua Program" options={[...new Set(rows.map((b) => b.program))].sort()} />
            <Select value={status} onChange={setStatus} all="Semua Status" options={['Lunas', 'Belum Lunas', 'Terlambat']} />
            <span className="inline-flex items-center gap-2 h-10 px-3 rounded-lg border border-slate-200 bg-white text-[13px] font-bold text-slate-800"><CalendarDays className="w-4 h-4 text-slate-500" /> Mei 2025</span>
          </FilterBar>
          <DataTable columns={columns} rows={tab === 'Tagihan Per Siswa' ? [...filtered].sort((a, b) => a.name.localeCompare(b.name)) : filtered} rowKey={(b) => b.id} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <InfoBox items={['Tagihan dibuat otomatis setiap awal bulan.', 'Pembayaran dapat dilakukan di kasir atau transfer bank.', 'Status akan otomatis diperbarui setelah pembayaran dikonfirmasi.', 'Hubungi admin jika ada pertanyaan terkait tagihan.']} />
            <Panel title="Metode Pembayaran" className="!bg-[#F4F8FF] !border-blue-100">
              <div className="grid grid-cols-2 gap-3">
                {([[Banknote, 'Tunai', 'Di kasir bimbel'], [Landmark, 'Transfer Bank', 'BCA / Mandiri / BNI'], [QrCode, 'QRIS', 'Scan QR Code'], [Smartphone, 'E-Wallet', 'OVO / DANA / GoPay']] as const).map(([Icon, l, s]) => (
                  <div key={l} className="flex items-center gap-2"><Icon className="w-6 h-6 text-emerald-600 shrink-0" /><div><p className="text-xs font-extrabold text-[#0F1E4A]">{l}</p><p className="text-[11px] text-slate-500 font-medium">{s}</p></div></div>
                ))}
              </div>
            </Panel>
            <Panel title="Rekening Pembayaran" className="!bg-[#F4F8FF] !border-blue-100">
              <KeyValues rows={[['BCA', '123 456 7890 an. Bimbel StudyHack'], ['Mandiri', '987 654 3210 an. Bimbel StudyHack'], ['BNI', '111 222 3333 an. Bimbel StudyHack']]} />
            </Panel>
          </div>
        </WithRail>

        <FormDialog
          open={!!paying}
          title={`Catat Pembayaran · ${paying?.name ?? ''}`}
          fields={[{ key: 'amount', label: 'Nominal Dibayar (Rp)', type: 'number', required: true }, { key: 'method', label: 'Metode', type: 'select', options: ['Tunai', 'Transfer Bank', 'QRIS', 'E-Wallet'] }]}
          initial={{ amount: String(paying ? total(paying) - paying.paid : 0), method: 'Tunai' }}
          onClose={() => setPaying(null)}
          onSubmit={(v) => {
            const target = paying!;
            const nextPaid = Math.min(total(target), target.paid + (Number(v.amount) || 0));
            setRows((prev) => prev.map((b) => (b.id === target.id ? { ...b, paid: nextPaid, status: statusOf(nextPaid, total(b)) } : b)));
            toast.success('Pembayaran dicatat', { description: `${target.name} · ${rupiah(Number(v.amount) || 0)} via ${v.method}` });
          }}
        />
        <FormDialog
          open={adding}
          title="Buat Tagihan"
          fields={[{ key: 'name', label: 'Nama Siswa', required: true }, { key: 'program', label: 'Program', required: true }, { key: 'kelas', label: 'Kelas' }, { key: 'amount', label: 'Tagihan (Rp)', type: 'number', required: true }, { key: 'discount', label: 'Diskon (Rp)', type: 'number' }]}
          onClose={() => setAdding(false)}
          onSubmit={(v) => {
            setRows((prev) => [{ id: `SHK-${String(prev.length + 1).padStart(4, '0')}`, name: v.name, program: v.program, kelas: v.kelas || '-', amount: Number(v.amount) || 0, discount: Number(v.discount) || 0, paid: 0, due: '10 Jun 2025', status: 'Belum Lunas' }, ...prev]);
            toast.success('Tagihan dibuat');
          }}
        />
      </div>
    </DashboardLayout>
  );
}
