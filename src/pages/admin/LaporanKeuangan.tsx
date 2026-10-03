import { useState } from 'react';
import { Wallet, ShoppingCart, TrendingUp, Landmark, PieChart, FileSpreadsheet, Printer, CalendarDays, FileDown, Send, CalendarCog } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { PageHead, StatCards, Tabs, Select, Panel, DonutPanel, KeyValues, InfoBox, Btn, DotLegend, LinkAction, exportCsv, rupiah, soon, TONE_HEX } from '../../components/portal/Kit';
import { useResource } from '../../store/useRemote';
import type { ExpenseRow, PaymentRow } from '../../data/adminPortal';

const TABS = ['Ringkasan', 'Arus Kas', 'Pendapatan', 'Pengeluaran', 'Laba Rugi', 'Perbandingan'];
const METHOD_COLOR = ['#16A34A', '#1D4ED8', '#F59E0B', '#7C3AED', '#EC4899'];
const pct = (v: number, base: number) => `${((v / (base || 1)) * 100).toFixed(1).replace('.', ',')}%`;
const sumBy = <T,>(rows: T[], key: (r: T) => string, value: (r: T) => number) =>
  Object.entries(rows.reduce<Record<string, number>>((acc, r) => ({ ...acc, [key(r)]: (acc[key(r)] ?? 0) + value(r) }), {})).sort((a, b) => b[1] - a[1]);
/** "English & Math · Kelas 1A" → "English & Math" */
const programOf = (p: PaymentRow) => (p.program ?? '').split(' · ')[0] || 'Lain-lain';

export default function LaporanKeuangan() {
  const [tab, setTab] = useState(TABS[0]);
  const [program, setProgram] = useState('');
  const [note, setNote] = useState('');

  // Semua angka di halaman ini dihitung dari transaksi tersimpan: pembayaran berhasil dan pengeluaran.
  const payments = useResource<PaymentRow>('payments').rows.filter((p) => p.status === 'Berhasil');
  const expenses = useResource<ExpenseRow>('expenses').rows;
  const income = payments.reduce((a, p) => a + p.paid, 0);
  const expense = expenses.reduce((a, e) => a + e.amount, 0);
  const profit = income - expense;

  const byProgram = sumBy(payments, programOf, (p) => p.paid);
  const byMethod = sumBy(payments, (p) => p.method || 'Lainnya', (p) => p.paid);
  const byCategory = sumBy(expenses, (e) => e.category || 'Lain-lain', (e) => e.amount);
  const programs = byProgram.filter(([p]) => !program || p === program);

  // Arus kumulatif per tanggal transaksi. Baris tersimpan dari yang terbaru, jadi urutannya dibalik.
  const dates = [...new Set([...payments.map((p) => p.date), ...expenses.map((e) => e.date)])].filter(Boolean).reverse();
  let inAcc = 0;
  let outAcc = 0;
  const flow = dates.map((d) => {
    inAcc += payments.filter((p) => p.date === d).reduce((a, p) => a + p.paid, 0);
    outAcc += expenses.filter((e) => e.date === d).reduce((a, e) => a + e.amount, 0);
    return { d: d.split(' ').slice(0, 2).join(' '), pendapatan: inAcc / 1e6, pengeluaran: outAcc / 1e6, laba: (inAcc - outAcc) / 1e6 };
  });
  const show = (...tabs: string[]) => tab === 'Ringkasan' || tabs.includes(tab);
  const period = new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });

  const doExport = () => exportCsv('laporan-keuangan', ['Program', 'Pendapatan', 'Porsi'], [
    ...byProgram.map(([p, v]) => [p, v, pct(v, income)]), ['TOTAL PENDAPATAN', income, '100%'], ['TOTAL PENGELUARAN', expense, ''], ['LABA BERSIH', profit, pct(profit, income)],
  ]);

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
          { label: 'Total Pendapatan', value: rupiah(income), sub: `Dari ${payments.length} transaksi`, subTone: 'up', icon: Wallet, tone: 'green' },
          { label: 'Total Pengeluaran', value: rupiah(expense), sub: `Dari ${expenses.length} transaksi`, subTone: 'down', icon: ShoppingCart, tone: 'red' },
          { label: 'Laba Bersih', value: rupiah(profit), sub: 'Pendapatan - Pengeluaran', subTone: profit >= 0 ? 'up' : 'down', icon: TrendingUp, tone: 'blue' },
          { label: 'Saldo Kas', value: rupiah(profit), sub: 'Dari transaksi tercatat', icon: Landmark, tone: 'purple' },
          { label: 'Rasio Laba Bersih', value: pct(profit, income), sub: 'Dari total pendapatan', icon: PieChart, tone: 'orange' },
        ]} />

        <div className="flex flex-wrap items-end justify-between gap-2">
          <Tabs tabs={TABS} value={tab} onChange={setTab} className="flex-1 min-w-0" />
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-2 h-10 px-3 rounded-lg border border-slate-200 bg-white text-[13px] font-bold text-slate-800"><CalendarDays className="w-4 h-4 text-slate-500" /> {period}</span>
            <Select value={program} onChange={setProgram} all="Semua Program" options={byProgram.map(([p]) => p)} />
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_320px] gap-4 items-start">
          <div className="space-y-4 min-w-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {tab !== 'Perbandingan' && (
                <Panel title="Grafik Arus Keuangan">
                  <DotLegend items={[{ label: 'Pendapatan', color: '#16A34A' }, { label: 'Pengeluaran', color: '#EF4444' }, { label: 'Laba Bersih', color: '#1D4ED8' }]} />
                  <div className="h-56 mt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={flow} margin={{ top: 6, right: 8, left: -18, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                        <XAxis dataKey="d" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 11 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 11 }} tickFormatter={(v) => `${v} jt`} />
                        <Tooltip formatter={(v) => `Rp ${Number(v).toFixed(2).replace('.', ',')} jt`} />
                        {tab !== 'Pengeluaran' && <Line type="monotone" dataKey="pendapatan" name="Pendapatan" stroke="#16A34A" strokeWidth={2} dot={{ r: 3 }} />}
                        {tab !== 'Pendapatan' && <Line type="monotone" dataKey="pengeluaran" name="Pengeluaran" stroke="#EF4444" strokeWidth={2} dot={{ r: 3 }} />}
                        {show('Arus Kas', 'Laba Rugi') && <Line type="monotone" dataKey="laba" name="Laba Bersih" stroke="#1D4ED8" strokeWidth={2} dot={{ r: 3 }} />}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </Panel>
              )}
              {show('Pendapatan', 'Perbandingan') && (
                <DonutPanel title="Komposisi Pendapatan" center={rupiah(income)} sub="Total Pendapatan" data={byMethod.map(([label, value], i) => ({ label, value, color: METHOD_COLOR[i % METHOD_COLOR.length], note: `${rupiah(value)} (${pct(value, income)})` }))} />
              )}
              {show('Laba Rugi', 'Pendapatan', 'Perbandingan') && (
                <Panel title="Pendapatan per Program" className="overflow-x-auto">
                  <table className="w-full text-xs min-w-[360px]">
                    <thead><tr className="text-slate-700 font-bold border-b border-slate-200">{['Program', 'Pendapatan', 'Porsi'].map((h, i) => <th key={h} className={`py-2 ${i ? 'text-right' : 'text-left'}`}>{h}</th>)}</tr></thead>
                    <tbody className="divide-y divide-slate-100">
                      {programs.map(([p, v]) => (
                        <tr key={p} className="font-semibold"><td className="py-2 text-slate-800">{p}</td><td className="text-right text-emerald-600">{rupiah(v)}</td><td className="text-right text-slate-800">{pct(v, income)}</td></tr>
                      ))}
                      {!program && <tr className="font-extrabold"><td className="py-2 text-[#0F1E4A]">TOTAL</td><td className="text-right text-emerald-600">{rupiah(income)}</td><td className="text-right text-[#0F1E4A]">100%</td></tr>}
                    </tbody>
                  </table>
                </Panel>
              )}
              {show('Arus Kas', 'Pengeluaran') && (
                <Panel title="Arus Kas">
                  <KeyValues rows={[['+ Total Pendapatan', <span className="text-emerald-600">{rupiah(income)}</span>], ['- Total Pengeluaran', <span className="text-red-600">{rupiah(expense)}</span>], [<b className="text-[#1D4ED8]">Saldo Kas</b>, <span className="text-[#1D4ED8]">{rupiah(profit)}</span>]]} />
                  <div className="h-32 mt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={flow} margin={{ top: 6, right: 8, left: -18, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                        <XAxis dataKey="d" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 11 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 11 }} tickFormatter={(v) => `${v} jt`} />
                        <Tooltip formatter={(v) => `Rp ${Number(v).toFixed(2).replace('.', ',')} jt`} />
                        <Area type="monotone" dataKey="laba" name="Saldo Kas" stroke="#1D4ED8" strokeWidth={2} fill="#1D4ED8" fillOpacity={0.12} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </Panel>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <InfoBox items={['Laporan keuangan dihitung dari pembayaran berstatus Berhasil dan seluruh pengeluaran tercatat.', 'Data dapat difilter berdasarkan program.', 'Pastikan semua transaksi telah dicatat dengan benar.', 'Hubungi admin jika ada data yang tidak sesuai.']} />
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
                  <Btn size="sm" variant="soft" onClick={() => { void navigator.clipboard?.writeText(note); toast.success(note.trim() ? 'Catatan disalin ke clipboard' : 'Catatan masih kosong'); }}>Salin Catatan</Btn>
                </div>
              </Panel>
            </div>
          </div>

          <aside className="space-y-4">
            <Panel title="Ringkasan Keuangan">
              <KeyValues rows={[['Total Pendapatan', <span className="text-emerald-600">{rupiah(income)}</span>], ['Total Pengeluaran', <span className="text-red-600">{rupiah(expense)}</span>], ['Laba Bersih', <span className="text-[#1D4ED8]">{rupiah(profit)}</span>], ['Margin Laba Bersih', pct(profit, income)], ['Transaksi Masuk', payments.length], ['Transaksi Keluar', expenses.length]]} />
            </Panel>
            <Panel title="Pendapatan per Metode" action={<span className="text-[11px] font-bold text-slate-600 whitespace-nowrap">{period}</span>}>
              <KeyValues rows={byMethod.map(([m, v]) => [m, `${rupiah(v)} (${pct(v, income)})`])} />
            </Panel>
            <Panel title="5 Pengeluaran Terbesar" action={<span className="text-[11px] font-bold text-slate-600">{period}</span>}>
              <ol className="space-y-2">
                {byCategory.slice(0, 5).map(([l, v], i) => (
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
