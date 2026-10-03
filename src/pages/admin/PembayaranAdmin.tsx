import { useState } from 'react';
import {
  Wallet, CalendarCheck, BadgeCheck, Calculator, CircleX, FileSpreadsheet, Plus, CalendarDays, Landmark, Smartphone, QrCode, Banknote,
  Download, ShieldCheck, Send, Settings, ReceiptText,
} from 'lucide-react';
import { toast } from 'sonner';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import {
  PageHead, StatCards, Tabs, FilterBar, SearchInput, Select, DataTable, Person, Badge, RowMenu, Btn, InfoBox, Panel, DonutPanel, QuickList, WithRail,
  KeyValues, LinkAction, Modal, useCrud, exportCsv, rupiah, soon, type Col, type Field,
} from '../../components/portal/Kit';
import { PAYMENTS, type PaymentRow, type PayStatus } from '../../data/adminPortal';

const METHODS = ['Transfer Bank', 'E-Wallet', 'Tunai', 'QRIS'];
const METHOD_COLOR: Record<string, string> = { 'Transfer Bank': '#1D4ED8', 'E-Wallet': '#16A34A', Tunai: '#F59E0B', QRIS: '#EC4899' };
const STATUSES: PayStatus[] = ['Berhasil', 'Tertunda', 'Gagal', 'Refund'];
const TABS = ['Semua Transaksi', 'Berhasil', 'Tertunda', 'Gagal / Ditolak', 'Refund'];
const FIELDS: Field[] = [
  { key: 'name', label: 'Nama Siswa', required: true },
  { key: 'program', label: 'Program / Kelas', required: true },
  { key: 'method', label: 'Metode', type: 'select', options: METHODS },
  { key: 'channel', label: 'Bank / Kanal', placeholder: 'BCA, OVO, ...' },
  { key: 'bill', label: 'Tagihan (Rp)', type: 'number', required: true },
  { key: 'paid', label: 'Dibayar (Rp)', type: 'number', required: true },
  { key: 'discount', label: 'Diskon (Rp)', type: 'number' },
  { key: 'status', label: 'Status', type: 'select', options: STATUSES },
];

export default function PembayaranAdmin() {
  const [tab, setTab] = useState(TABS[0]);
  const [q, setQ] = useState('');
  const [method, setMethod] = useState('');
  const [status, setStatus] = useState('');
  const [proof, setProof] = useState<PaymentRow | null>(null);

  const crud = useCrud<PaymentRow>(PAYMENTS, {
    label: 'Pembayaran',
    fields: FIELDS,
    create: (v, rows) => ({
      id: `TRX-250517-${String(rows.length + 1).padStart(4, '0')}`, date: '17 Mei 2025', time: new Date().toTimeString().slice(0, 5), name: v.name, sid: '-', program: v.program,
      method: v.method, channel: v.channel, bill: Number(v.bill) || 0, paid: Number(v.paid) || 0, discount: Number(v.discount) || 0, status: v.status as PayStatus,
    }),
    detail: (p) => [['No. Transaksi', p.id], ['Tanggal', `${p.date}, ${p.time}`], ['Siswa', `${p.name} (${p.sid})`], ['Program / Kelas', p.program], ['Metode', `${p.method} ${p.channel}`], ['Tagihan', rupiah(p.bill)], ['Dibayar', rupiah(p.paid)], ['Diskon', p.discount ? rupiah(p.discount) : '-'], ['Status', <Badge>{p.status}</Badge>]],
  });

  const tabStatus = tab === 'Gagal / Ditolak' ? 'Gagal' : tab === TABS[0] ? '' : tab;
  const rows = crud.rows.filter((p) =>
    (!tabStatus || p.status === tabStatus) && (!q || `${p.name} ${p.id} ${p.sid}`.toLowerCase().includes(q.toLowerCase())) && (!method || p.method === method) && (!status || p.status === status));
  const ok = crud.rows.filter((p) => p.status === 'Berhasil');
  const sum = (list: PaymentRow[]) => list.reduce((a, p) => a + p.paid, 0);
  const by = (s: PayStatus) => crud.rows.filter((p) => p.status === s);
  const total = sum(ok);
  const pct = (v: number, base = total) => `${((v / (base || 1)) * 100).toFixed(2).replace('.', ',')}%`;
  const setStatusOf = (p: PaymentRow, s: PayStatus) => { crud.patch(p.id, { status: s }); toast.success(`${p.id}: ${s}`); };
  const doExport = (name = 'pembayaran') => exportCsv(name, ['No Transaksi', 'Tanggal', 'Siswa', 'Program', 'Metode', 'Tagihan', 'Dibayar', 'Diskon', 'Status'], rows.map((p) => [p.id, `${p.date} ${p.time}`, p.name, p.program, `${p.method} ${p.channel}`.trim(), p.bill, p.paid, p.discount, p.status]));

  const columns: Col<PaymentRow>[] = [
    { header: 'No.', cell: (_, i) => i + 1, align: 'center' },
    { header: 'Tanggal', cell: (p) => <span className="whitespace-nowrap">{p.date}<span className="block text-[11px] text-slate-500">{p.time}</span></span> },
    { header: 'No. Transaksi', cell: (p) => <span className="whitespace-nowrap font-bold text-slate-800">{p.id}</span> },
    { header: 'Siswa', cell: (p) => <Person name={p.name} sub={p.sid} /> },
    { header: 'Program / Kelas', cell: (p) => <span className="block max-w-[150px]">{p.program}</span> },
    { header: 'Metode', cell: (p) => <span className="whitespace-nowrap font-bold text-slate-800">{p.method}<span className="block text-[11px] text-slate-500 font-medium">{p.channel}</span></span> },
    { header: 'Tagihan', cell: (p) => <span className="whitespace-nowrap">{rupiah(p.bill)}</span> },
    { header: 'Dibayar', cell: (p) => <span className="whitespace-nowrap font-bold text-emerald-600">{rupiah(p.paid)}</span> },
    { header: 'Diskon', cell: (p) => (p.discount ? <span className="whitespace-nowrap">{rupiah(p.discount)}</span> : '-') },
    { header: 'Status', cell: (p) => <Badge>{p.status}</Badge> },
    { header: 'Bukti', align: 'center', cell: (p) => <button aria-label="Lihat bukti" onClick={() => setProof(p)} className="text-[#1D4ED8] hover:text-blue-800"><ReceiptText className="w-4 h-4" /></button> },
    {
      header: 'Aksi', align: 'center',
      cell: (p) => <RowMenu items={[
        { label: 'Lihat Detail', onClick: () => crud.view(p) },
        ...(p.status === 'Tertunda' ? [{ label: 'Verifikasi (Berhasil)', onClick: () => setStatusOf(p, 'Berhasil') }, { label: 'Tolak', onClick: () => setStatusOf(p, 'Gagal'), danger: true }] : []),
        ...(p.status === 'Berhasil' ? [{ label: 'Refund', onClick: () => setStatusOf(p, 'Refund') }] : []),
        { label: 'Kirim Bukti Pembayaran', onClick: () => toast.success(`Bukti dikirim ke wali ${p.name}`) },
      ]} />,
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-4 max-w-[1500px]">
        <PageHead
          title="Pembayaran"
          subtitle="Kelola semua transaksi pembayaran siswa secara terpusat dan terverifikasi."
          actions={<>
            <Btn icon={FileSpreadsheet} className="!text-emerald-700" onClick={() => doExport()}>Export ke Excel</Btn>
            <Btn variant="primary" icon={Plus} onClick={crud.add}>Catat Pembayaran</Btn>
          </>}
        />
        <StatCards items={[
          { label: 'Total Pembayaran', value: rupiah(total), sub: `Dari ${ok.length} transaksi berhasil`, icon: Wallet, tone: 'blue' },
          { label: 'Pembayaran Hari Ini', value: rupiah(sum(ok.filter((p) => p.date === crud.rows[0]?.date))), sub: `${ok.filter((p) => p.date === crud.rows[0]?.date).length} transaksi`, icon: CalendarCheck, tone: 'green' },
          { label: 'Transaksi Berhasil', value: ok.length, sub: `Dari ${crud.rows.length} transaksi`, icon: BadgeCheck, tone: 'orange' },
          { label: 'Rata-rata Pembayaran', value: rupiah(Math.round(total / (ok.length || 1))), sub: 'Per transaksi', icon: Calculator, tone: 'purple' },
          { label: 'Gagal / Ditolak', value: by('Gagal').length, sub: `${pct(by('Gagal').length, crud.rows.length)} dari transaksi`, icon: CircleX, tone: 'teal' },
        ]} />

        <WithRail
          rail={<>
            <DonutPanel title="Ringkasan Metode Pembayaran" center={rupiah(total)} sub="Total Dibayar" data={METHODS.map((m) => {
              const v = sum(ok.filter((p) => p.method === m));
              return { label: m, value: v, color: METHOD_COLOR[m], note: `${rupiah(v)} (${pct(v)})` };
            })} />
            <Panel title="Status Pembayaran">
              <KeyValues rows={STATUSES.map((s) => [s === 'Gagal' ? 'Gagal / Ditolak' : s, `${rupiah(s === 'Gagal' ? by(s).reduce((a, p) => a + p.bill, 0) : sum(by(s)))}`])} />
            </Panel>
            <Panel title="Transaksi Terbaru" action={<LinkAction onClick={() => setTab(TABS[0])}>Lihat Semua</LinkAction>}>
              <ul className="space-y-2.5 border-l-2 border-emerald-200 ml-1.5 pl-3">
                {crud.rows.slice(0, 5).map((p) => (
                  <li key={p.id} className="relative flex justify-between gap-2 text-xs">
                    <span className="absolute -left-[17px] top-1 w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="font-bold text-[#0F1E4A] truncate">{p.name}</span>
                    <span className="text-right shrink-0"><span className="block font-extrabold text-[#0F1E4A]">{rupiah(p.paid)}</span><span className="text-[10px] text-slate-500 font-medium">{p.date}, {p.time}</span></span>
                  </li>
                ))}
              </ul>
            </Panel>
            <QuickList items={[
              { label: 'Catat Pembayaran Manual', icon: Plus, onClick: crud.add },
              { label: 'Verifikasi Pembayaran', icon: ShieldCheck, onClick: () => setTab('Tertunda') },
              { label: 'Kirim Bukti Pembayaran', icon: Send },
              { label: 'Pengaturan Metode Pembayaran', icon: Settings },
            ]} />
          </>}
        >
          <Tabs tabs={TABS} value={tab} onChange={setTab} />
          <FilterBar onReset={() => { setQ(''); setMethod(''); setStatus(''); }}>
            <SearchInput value={q} onChange={setQ} placeholder="Cari nama siswa / invoice / no. transaksi..." />
            <Select value={method} onChange={setMethod} all="Semua Metode" options={METHODS} />
            <Select value={status} onChange={setStatus} all="Semua Status" options={STATUSES} />
            <span className="inline-flex items-center gap-2 h-10 px-3 rounded-lg border border-slate-200 bg-white text-[13px] font-bold text-slate-800"><CalendarDays className="w-4 h-4 text-slate-500" /> 01 - 31 Mei 2025</span>
          </FilterBar>
          <DataTable columns={columns} rows={rows} rowKey={(p) => p.id} unit="transaksi" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <InfoBox items={['Pembayaran diterima setelah diverifikasi oleh admin.', 'Pastikan bukti pembayaran jelas dan sesuai nominal.', 'Metode pembayaran dapat diatur pada menu pengaturan.', 'Hubungi admin jika ada kendala pembayaran.']} />
            <Panel title="Metode Pembayaran Tersedia" className="!bg-[#F4F8FF] !border-blue-100">
              <div className="grid grid-cols-2 gap-3">
                {([[Landmark, 'Transfer Bank', 'BCA, Mandiri, BNI'], [Smartphone, 'E-Wallet', 'OVO, DANA, GoPay, ShopeePay'], [QrCode, 'QRIS', 'Scan QR Code'], [Banknote, 'Tunai', 'Pembayaran di lokasi']] as const).map(([Icon, l, s]) => (
                  <div key={l} className="flex items-center gap-2"><Icon className="w-6 h-6 text-[#1D4ED8] shrink-0" /><div><p className="text-xs font-extrabold text-[#0F1E4A]">{l}</p><p className="text-[11px] text-slate-500 font-medium">{s}</p></div></div>
                ))}
              </div>
            </Panel>
            <Panel title="Download Laporan" className="!bg-[#F4F8FF] !border-blue-100">
              {['Laporan Pembayaran Harian', 'Laporan Pembayaran Bulanan', 'Rekap Pembayaran Per Program', 'Rekap Pembayaran Per Metode'].map((l) => (
                <button key={l} onClick={() => doExport(l.toLowerCase().replace(/ /g, '-'))} className="w-full flex items-center justify-between py-1.5 text-[13px] font-bold text-slate-800 hover:text-[#1D4ED8]">{l} <Download className="w-4 h-4" /></button>
              ))}
            </Panel>
          </div>
        </WithRail>

        <Modal open={!!proof} title="Bukti Pembayaran" onClose={() => setProof(null)} footer={<><Btn onClick={() => soon('Unduh Bukti')} icon={Download}>Unduh</Btn><Btn variant="ghost" onClick={() => setProof(null)}>Tutup</Btn></>}>
          {proof && (
            <div className="rounded-xl border border-dashed border-slate-300 p-4">
              <p className="text-center text-sm font-extrabold text-[#0F1E4A] mb-2">LearnSpace+ by StudyHack</p>
              <KeyValues rows={[['No. Transaksi', proof.id], ['Tanggal', `${proof.date}, ${proof.time}`], ['Siswa', proof.name], ['Program', proof.program], ['Metode', `${proof.method} ${proof.channel}`], ['Dibayar', rupiah(proof.paid)], ['Status', <Badge>{proof.status}</Badge>]]} />
            </div>
          )}
        </Modal>
        {crud.dialogs}
      </div>
    </DashboardLayout>
  );
}
