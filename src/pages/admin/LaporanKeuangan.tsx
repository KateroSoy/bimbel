import { useState } from 'react';
import { Wallet, ShoppingCart, TrendingUp, Landmark, PieChart, FileSpreadsheet, Printer, CalendarDays, FileDown, Send, CalendarCog, ArrowUp, ArrowDown } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { PageHead, StatCards, Tabs, Select, Panel, DonutPanel, KeyValues, InfoBox, Btn, DotLegend, LinkAction, exportCsv, rupiah, soon, TONE_HEX } from '../../components/portal/Kit';

const INCOME = 87250000;
const EXPENSE = 45600000;
const OPENING = 71850000;
// Angka contoh diambil apa adanya dari mockup klien (saldo akhir tidak diturunkan dari saldo awal)
const CLOSING = 68420000;
const PREV = { income: 73600000, expense: 40600000, profit: 33000000, closing: 61250000 };

const FLOW = [
  { d: '1 Mei', pendapatan: 9, pengeluaran: 5, laba: 2 }, { d: '6 Mei', pendapatan: 25, pengeluaran: 13, laba: 6 }, { d: '11 Mei', pendapatan: 32, pengeluaran: 19, laba: 10 },
  { d: '16 Mei', pendapatan: 36, pengeluaran: 23, laba: 13 }, { d: '21 Mei', pendapatan: 40, pengeluaran: 27, laba: 18 }, { d: '26 Mei', pendapatan: 44, pengeluaran: 30, laba: 21 },
  { d: '31 Mei', pendapatan: 47, pengeluaran: 34, laba: 24 },
];
const CASH = [{ d: '1 Mei', saldo: 38 }, { d: '6 Mei', saldo: 60 }, { d: '11 Mei', saldo: 66 }, { d: '16 Mei', saldo: 67 }, { d: '21 Mei', saldo: 82 }, { d: '26 Mei', saldo: 75 }, { d: '31 Mei', saldo: 80 }];
const COMPOSITION = [
  { label: 'SPP', value: 63750000, color: '#16A34A' }, { label: 'Pendaftaran', value: 12800000, color: '#1D4ED8' },
  { label: 'Lain-lain', value: 7450000, color: '#F59E0B' }, { label: 'Penjualan Materi', value: 3250000, color: '#7C3AED' },
];
const PROGRAMS: [string, number, number][] = [
  ['English Teens', 28750000, 12450000], ['Math Primary', 18600000, 9200000], ['Playclub', 14250000, 6100000],
  ['Calistung (Privat)', 8450000, 4200000], ['Intensif (All Subject)', 9900000, 7450000], ['Lain-lain', 7300000, 6200000],
];
const TOP_EXPENSES: [string, number][] = [['Gaji & Honor Tutor', 18000000], ['Sewa & Listrik', 8250000], ['ATK & Perlengkapan', 5600000], ['Promosi & Marketing', 4350000], ['Kebersihan & Keamanan', 3500000]];
const TABS = ['Ringkasan', 'Arus Kas', 'Pendapatan', 'Pengeluaran', 'Laba Rugi', 'Perbandingan'];

const pct = (v: number, base: number) => `${((v / base) * 100).toFixed(1).replace('.', ',')}%`;
const juta = (v: number) => `Rp ${(v / 1e6).toFixed(2).replace('.', ',')} jt`;
const growth = (now: number, prev: number) => `${(((now - prev) / prev) * 100).toFixed(1).replace('.', ',')}%`;
const Trend = ({ now, prev, bad }: { now: number; prev: number; bad?: boolean }) => (
  <span className={`inline-flex items-center font-bold ${bad ? 'text-red-600' : 'text-emerald-600'}`}>{now >= prev ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}{growth(now, prev).replace('-', '')}</span>
);

export default function LaporanKeuangan() {
  const [tab, setTab] = useState(TABS[0]);
  const [program, setProgram] = useState('');
  const [note, setNote] = useState('');
  const profit = INCOME - EXPENSE;
  const programs = PROGRAMS.filter(([p]) => !program || p === program);
  const show = (...tabs: string[]) => tab === 'Ringkasan' || tabs.includes(tab);

  const doExport = () => exportCsv('laporan-keuangan-mei-2025', ['Program', 'Pendapatan', 'Pengeluaran', 'Laba Bersih', 'Margin Laba'], [
    ...PROGRAMS.map(([p, i, e]) => [p, i, e, i - e, pct(i - e, i)]), ['TOTAL', INCOME, EXPENSE, profit, pct(profit, INCOME)],
  ]);

  const chart = (
    <Panel title="Grafik Arus Keuangan">
      <DotLegend items={[{ label: 'Pendapatan', color: '#16A34A' }, { label: 'Pengeluaran', color: '#EF4444' }, { label: 'Laba Bersih', color: '#1D4ED8' }]} />
      <div className="h-56 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={FLOW} margin={{ top: 6, right: 8, left: -18, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
            <XAxis dataKey="d" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 11 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 11 }} tickFormatter={(v) => `${v} jt`} />
            <Tooltip formatter={(v) => `Rp ${v} jt`} />
            {tab !== 'Pengeluaran' && <Line type="monotone" dataKey="pendapatan" name="Pendapatan" stroke="#16A34A" strokeWidth={2} dot={{ r: 3 }} />}
            {tab !== 'Pendapatan' && <Line type="monotone" dataKey="pengeluaran" name="Pengeluaran" stroke="#EF4444" strokeWidth={2} dot={{ r: 3 }} />}
            {show('Arus Kas', 'Laba Rugi') && <Line type="monotone" dataKey="laba" name="Laba Bersih" stroke="#1D4ED8" strokeWidth={2} dot={{ r: 3 }} />}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  );

  return (
    <DashboardLayout>
      <div className="space-y-4 max-w-[1500px]">
        <PageHead
          title="Laporan Keuangan"
          subtitle="Ringkasan kondisi keuangan bimbel secara menyeluruh dan transparan."
          actions={<>
            <Btn icon={FileSpreadsheet} className="!text-emerald-700" onClick={doExport}>Export ke Excel</Btn>
            <Btn variant="primary" icon={Printer} onClick={() => window.print()}>Cetak Laporan</Btn>
          </>}
        />
        <StatCards items={[
          { label: 'Total Pendapatan', value: rupiah(INCOME), sub: `▲ ${growth(INCOME, PREV.income)} vs Apr 2025`, subTone: 'up', icon: Wallet, tone: 'green' },
          { label: 'Total Pengeluaran', value: rupiah(EXPENSE), sub: `▲ ${growth(EXPENSE, PREV.expense)} vs Apr 2025`, subTone: 'down', icon: ShoppingCart, tone: 'red' },
          { label: 'Laba Bersih', value: rupiah(profit), sub: `▲ ${growth(profit, PREV.profit)} vs Apr 2025`, subTone: 'up', icon: TrendingUp, tone: 'blue' },
          { label: 'Saldo Kas Akhir', value: rupiah(CLOSING), sub: 'Per 31 Mei 2025', icon: Landmark, tone: 'purple' },
          { label: 'Rasio Laba Bersih', value: pct(profit, INCOME), sub: 'Dari total pendapatan', icon: PieChart, tone: 'orange' },
        ]} />

        <div className="flex flex-wrap items-end justify-between gap-2">
          <Tabs tabs={TABS} value={tab} onChange={setTab} className="flex-1 min-w-0" />
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-2 h-10 px-3 rounded-lg border border-slate-200 bg-white text-[13px] font-bold text-slate-800"><CalendarDays className="w-4 h-4 text-slate-500" /> 01 - 31 Mei 2025</span>
            <Select value={program} onChange={setProgram} all="Semua Program" options={PROGRAMS.map(([p]) => p)} />
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_320px] gap-4 items-start">
          <div className="space-y-4 min-w-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {tab !== 'Perbandingan' && chart}
              {show('Pendapatan') && <DonutPanel title="Komposisi Pendapatan" center={rupiah(INCOME)} sub="Total Pendapatan" data={COMPOSITION.map((c) => ({ ...c, note: `${rupiah(c.value)} (${pct(c.value, INCOME)})` }))} />}
              {show('Laba Rugi', 'Pendapatan', 'Pengeluaran') && (
                <Panel title="Ringkasan Keuangan per Program" className="overflow-x-auto">
                  <table className="w-full text-xs min-w-[480px]">
                    <thead><tr className="text-slate-700 font-bold border-b border-slate-200">{['Program', 'Pendapatan', 'Pengeluaran', 'Laba Bersih', 'Margin Laba'].map((h, i) => <th key={h} className={`py-2 ${i ? 'text-right' : 'text-left'}`}>{h}</th>)}</tr></thead>
                    <tbody className="divide-y divide-slate-100">
                      {programs.map(([p, i, e]) => (
                        <tr key={p} className="font-semibold">
                          <td className="py-2 text-slate-800">{p}</td><td className="text-right text-slate-800">{rupiah(i)}</td><td className="text-right text-red-600">{rupiah(e)}</td>
                          <td className="text-right text-emerald-600">{rupiah(i - e)}</td><td className="text-right text-slate-800">{pct(i - e, i)}</td>
                        </tr>
                      ))}
                      {!program && (
                        <tr className="font-extrabold">
                          <td className="py-2 text-[#0F1E4A]">TOTAL</td><td className="text-right text-[#0F1E4A]">{rupiah(INCOME)}</td><td className="text-right text-red-600">{rupiah(EXPENSE)}</td>
                          <td className="text-right text-emerald-600">{rupiah(profit)}</td><td className="text-right text-[#0F1E4A]">{pct(profit, INCOME)}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </Panel>
              )}
              {show('Arus Kas') && (
                <Panel title="Arus Kas">
                  <KeyValues rows={[['Saldo Kas Awal', rupiah(OPENING)], ['+ Total Pendapatan', <span className="text-emerald-600">{rupiah(INCOME)}</span>], ['- Total Pengeluaran', <span className="text-red-600">{rupiah(EXPENSE)}</span>], [<b className="text-[#1D4ED8]">Saldo Kas Akhir</b>, <span className="text-[#1D4ED8]">{rupiah(CLOSING)}</span>]]} />
                  <div className="h-32 mt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={CASH} margin={{ top: 6, right: 8, left: -18, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                        <XAxis dataKey="d" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 11 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 11 }} tickFormatter={(v) => `${v} jt`} />
                        <Tooltip formatter={(v) => `Rp ${v} jt`} />
                        <Area type="monotone" dataKey="saldo" name="Saldo Kas" stroke="#1D4ED8" strokeWidth={2} fill="#1D4ED8" fillOpacity={0.12} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </Panel>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <InfoBox items={['Laporan keuangan dihitung berdasarkan transaksi yang telah diverifikasi.', 'Data dapat difilter berdasarkan periode, program, dan kategori.', 'Pastikan semua transaksi telah dicatat dengan benar.', 'Hubungi admin jika ada data yang tidak sesuai.']} />
              <Panel title="Aksi Cepat" className="!bg-[#F4F8FF] !border-blue-100">
                <div className="grid grid-cols-5 gap-2">
                  {([[FileSpreadsheet, 'Export ke Excel', doExport], [Printer, 'Cetak Laporan', () => window.print()], [FileDown, 'Unduh PDF', () => window.print()], [Send, 'Kirim Laporan', () => soon('Kirim Laporan')], [CalendarCog, 'Atur Periode', () => soon('Atur Periode')]] as const).map(([Icon, l, fn]) => (
                    <button key={l} onClick={fn} className="rounded-xl bg-white border border-slate-100 hover:border-blue-300 p-2 flex flex-col items-center gap-1 text-center"><Icon className="w-5 h-5" style={{ color: TONE_HEX.blue }} /><span className="text-[10px] font-bold text-slate-700 leading-tight">{l}</span></button>
                  ))}
                </div>
              </Panel>
              <Panel title="Catatan" className="!bg-[#F4F8FF] !border-blue-100">
                <textarea value={note} onChange={(e) => setNote(e.target.value.slice(0, 300))} rows={3} placeholder="Tulis catatan laporan keuangan (opsional)..." className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs font-medium outline-none focus:border-[#1D4ED8]" />
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-[11px] text-slate-500 font-medium">{note.length} / 300 karakter</span>
                  <Btn size="sm" variant="soft" onClick={() => (note.trim() ? toast.success('Catatan disimpan') : toast.info('Catatan masih kosong'))}>Simpan Catatan</Btn>
                </div>
              </Panel>
            </div>
          </div>

          <aside className="space-y-4">
            <Panel title="Ringkasan Keuangan">
              <KeyValues rows={[['Total Pendapatan', <span className="text-emerald-600">{rupiah(INCOME)}</span>], ['Total Pengeluaran', <span className="text-red-600">{rupiah(EXPENSE)}</span>], ['Laba Bersih', <span className="text-[#1D4ED8]">{rupiah(profit)}</span>], ['Margin Laba Bersih', pct(profit, INCOME)], ['Saldo Kas Awal', rupiah(OPENING)], ['Saldo Kas Akhir', rupiah(CLOSING)]]} />
            </Panel>
            <Panel title="Perbandingan Bulanan" action={<span className="text-[11px] font-bold text-slate-600 whitespace-nowrap">Mei vs Apr 2025</span>}>
              <table className="w-full text-[11px]">
                <thead><tr className="text-slate-700 font-bold border-b border-slate-200"><th className="py-1.5 text-left">Keterangan</th><th className="text-right">Mei 2025</th><th className="text-right">Apr 2025</th><th className="text-right">Perubahan</th></tr></thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
                  {([['Pendapatan', INCOME, PREV.income, false], ['Pengeluaran', EXPENSE, PREV.expense, true], ['Laba Bersih', profit, PREV.profit, false], ['Saldo Kas Akhir', CLOSING, PREV.closing, false]] as const).map(([l, now, prev, bad]) => (
                    <tr key={l}><td className="py-2 font-bold">{l}</td><td className="text-right whitespace-nowrap">{juta(now)}</td><td className="text-right whitespace-nowrap">{juta(prev)}</td><td className="text-right"><Trend now={now} prev={prev} bad={bad} /></td></tr>
                  ))}
                </tbody>
              </table>
            </Panel>
            <Panel title="5 Pengeluaran Terbesar" action={<span className="text-[11px] font-bold text-slate-600">Mei 2025</span>}>
              <ol className="space-y-2">
                {TOP_EXPENSES.map(([l, v], i) => (
                  <li key={l} className="flex items-center gap-2.5 text-[13px] font-bold text-slate-800">
                    <span className="w-6 h-6 rounded-md bg-orange-50 text-orange-600 text-xs flex items-center justify-center">{i + 1}</span><span className="flex-1 truncate">{l}</span><span className={i === 0 ? 'text-red-600' : ''}>{rupiah(v)}</span>
                  </li>
                ))}
              </ol>
              <div className="mt-3 text-center"><LinkAction to="/admin/pengeluaran">Lihat Semua Pengeluaran</LinkAction></div>
            </Panel>
          </aside>
        </div>
      </div>
    </DashboardLayout>
  );
}
