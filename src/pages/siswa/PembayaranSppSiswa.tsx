import { useState } from 'react';
import {
  Wallet, CalendarDays, FileCheck2, GraduationCap, CheckCircle2, Clock, Landmark, CreditCard, QrCode,
  ChevronRight, ChevronDown, ShieldCheck, Headphones, MessageCircle, MoreVertical, X, Printer, Heart, Info, Smartphone, Copy,
} from 'lucide-react';
import { toast } from 'sonner';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, PageTitle, Pill, statusTone } from '../../components/siswa/PortalUI';
import { cn } from '../../lib/utils';
import { ADMIN_WA, ADMIN_WA_LABEL, BILLS, PAYMENT_METHODS, STUDENT, rupiah, hydrateStudentPortal, type Bill } from '../../data/siswaPortal';
import { api, ApiError } from '../../lib/api';
import { useFetch } from '../../store/useRemote';
import { parseAccounts, type PaymentAccount } from '../../lib/payment';

const METHOD_ICON = { bank: Landmark, ewallet: Smartphone, qris: QrCode, card: CreditCard } as const;

function AccountList({ accounts, empty }: { accounts: PaymentAccount[]; empty: string }) {
  if (!accounts.length) return <p className="text-xs font-semibold text-orange-700 bg-orange-50 border border-orange-100 rounded-lg px-3 py-2">{empty}</p>;
  return (
    <ul className="space-y-1.5">
      {accounts.map((a) => (
        <li key={a.name + a.number} className="flex items-center gap-2 rounded-lg bg-white border border-slate-200 px-3 py-2">
          <span className="flex-1 min-w-0">
            <span className="block text-[11px] font-bold text-slate-500">{a.name}{a.holder ? ` · a.n. ${a.holder}` : ''}</span>
            <span className="block text-sm font-extrabold text-[#0F1E4A] tracking-wide">{a.number}</span>
          </span>
          <button
            type="button"
            onClick={() => { void navigator.clipboard.writeText(a.number.replace(/\s|-/g, '')); toast.success(`Nomor ${a.name} disalin`); }}
            className="h-8 px-2.5 rounded-lg border border-blue-200 text-[#1D4ED8] text-xs font-bold inline-flex items-center gap-1 hover:bg-blue-50"
          >
            <Copy className="w-3.5 h-3.5" /> Salin
          </button>
        </li>
      ))}
    </ul>
  );
}
type Tab = 'ringkasan' | 'semua' | 'riwayat' | 'metode';

export default function PembayaranSppSiswa() {
  const [bills, setBills] = useState<Bill[]>(BILLS);
  const [tab, setTab] = useState<Tab>('ringkasan');
  const [showAll, setShowAll] = useState(false);
  const [payFor, setPayFor] = useState<Bill | null>(null);
  const [method, setMethod] = useState<string>('qris');
  const [detail, setDetail] = useState<Bill | null>(null);
  const settings = useFetch<{ data: { bankAccounts?: string; ewallets?: string } }>('/settings');
  const banks = parseAccounts(settings?.data.bankAccounts);
  const wallets = parseAccounts(settings?.data.ewallets);
  const missing = 'Nomor belum diatur admin. Silakan hubungi admin melalui WhatsApp.';

  const paid = bills.filter((b) => b.status === 'Lunas');
  const unpaid = bills.filter((b) => b.status !== 'Lunas');
  const current = unpaid[0];
  const totalPaid = paid.reduce((s, b) => s + b.amount, 0);
  const previous = bills.filter((b) => b !== current);

  const confirmPay = async () => {
    if (!payFor) return;
    const m = PAYMENT_METHODS.find((x) => x.id === method && !x.disabled);
    if (!m) return;
    try {
      const { bill } = await api.post<{ bill: Bill }>(`/student/bills/${encodeURIComponent(payFor.id)}/pay`, { method: m.name });
      const next = bills.map((b) => (b.id === bill.id ? bill : b));
      setBills(next);
      hydrateStudentPortal({ bills: next });
      toast.success('Pembayaran dikirim', { description: `${payFor.title} via ${m.name} — menunggu verifikasi admin.` });
      setPayFor(null);
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : 'Gagal mengirim pembayaran.');
    }
  };

  const BillRow = ({ b }: { b: Bill }) => (
    <div className="flex flex-wrap items-center gap-3 px-3 py-2.5">
      <span className="w-12 text-center rounded-lg bg-slate-50 border border-slate-100 py-1 leading-tight">
        <span className="block text-[10px] font-bold text-slate-600">{b.month}</span>
        <span className="block text-sm font-extrabold text-[#0F1E4A]">{b.year}</span>
      </span>
      <div className="flex-1 min-w-[140px]"><p className="text-sm font-bold text-[#0F1E4A]">{b.title}</p><p className="text-xs text-slate-600">{b.description}</p></div>
      <p className="w-28 text-sm font-extrabold text-[#0F1E4A]">{rupiah(b.amount)}</p>
      <div className="w-40"><Pill tone={statusTone(b.status)}>{b.status} {b.status === 'Lunas' && <CheckCircle2 className="w-3.5 h-3.5" />}</Pill></div>
      {b.status === 'Belum Dibayar' ? (
        <button onClick={() => setPayFor(b)} className="h-8 px-4 rounded-lg bg-[#1D4ED8] text-white text-xs font-bold">Bayar</button>
      ) : (
        <button onClick={() => setDetail(b)} className="h-8 px-4 rounded-lg border border-blue-200 text-[#1D4ED8] text-xs font-bold hover:bg-blue-50">Lihat Detail</button>
      )}
      <button onClick={() => setDetail(b)} aria-label="Opsi" className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center"><MoreVertical className="w-4 h-4" /></button>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="max-w-[1400px] space-y-3">
        <PageTitle title="Pembayaran" subtitle="Kelola pembayaran dan lihat riwayat transaksi Anda." />

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          <Card className="p-4 flex gap-4">
            <span className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0"><Wallet className="w-6 h-6" /></span>
            <div><p className="text-sm font-bold text-[#0F1E4A]">Total Terbayar</p><p className="text-2xl font-extrabold text-emerald-600">{rupiah(totalPaid)}</p><p className="text-xs text-slate-600 font-medium flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> {paid.length} periode lunas</p></div>
          </Card>
          <Card className="p-4 flex gap-4">
            <span className="w-12 h-12 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0"><CalendarDays className="w-6 h-6" /></span>
            <div className="min-w-0">
              <p className="text-sm font-bold text-[#0F1E4A]">Tagihan Berikutnya</p>
              <p className="text-2xl font-extrabold text-orange-500">{current ? rupiah(current.amount) : '-'}</p>
              <p className="text-xs text-slate-600 font-medium">{current?.title ?? 'Tidak ada tagihan'}</p>
              {current && <p className="mt-1 text-[11px] font-bold text-orange-600 bg-orange-50 rounded-md px-2 py-0.5 inline-flex items-center gap-1"><Clock className="w-3 h-3" /> Jatuh tempo: {current.dueDate}</p>}
            </div>
          </Card>
          <Card className="p-4 flex gap-4">
            <span className="w-12 h-12 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center shrink-0"><FileCheck2 className="w-6 h-6" /></span>
            <div><p className="text-sm font-bold text-[#0F1E4A]">Status Akun</p><p className="text-2xl font-extrabold text-emerald-600">Aktif</p><p className="text-xs text-slate-600 font-medium">{unpaid.some((b) => b.status === 'Belum Dibayar') ? 'Ada tagihan berjalan' : 'Tidak ada tunggakan'}</p></div>
          </Card>
          <Card className="p-4 flex gap-4">
            <span className="w-12 h-12 rounded-xl bg-blue-50 text-[#1D4ED8] flex items-center justify-center shrink-0"><GraduationCap className="w-6 h-6" /></span>
            <div><p className="text-sm font-bold text-[#0F1E4A]">Program Aktif</p><p className="text-lg font-extrabold text-[#1D4ED8] leading-tight">{STUDENT.programShort}</p><Pill tone="blue" className="mt-1">{STUDENT.level}</Pill></div>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-3">
          <div className="space-y-3 min-w-0">
            <Card>
              <div className="flex overflow-x-auto px-3 border-b border-slate-100">
                {([['ringkasan', 'Ringkasan'], ['semua', 'Semua Tagihan'], ['riwayat', 'Riwayat Pembayaran'], ['metode', 'Metode Pembayaran']] as const).map(([k, l]) => (
                  <button key={k} onClick={() => setTab(k)} className={cn('px-4 py-3 text-sm font-bold border-b-2 -mb-px whitespace-nowrap', tab === k ? 'border-[#1D4ED8] text-[#1D4ED8]' : 'border-transparent text-slate-700')}>{l}</button>
                ))}
              </div>

              <div className="p-3">
                {tab === 'ringkasan' && (
                  <>
                    <h3 className="font-extrabold text-[#0F1E4A] text-sm mb-2">Tagihan Berjalan</h3>
                    {current ? (
                      <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-3 flex flex-wrap items-center gap-4 mb-4">
                        <span className="w-16 text-center rounded-lg bg-emerald-100/70 py-1.5 leading-tight">
                          <span className="block text-sm font-bold text-emerald-800">{current.month}</span>
                          <span className="block text-lg font-extrabold text-emerald-800">{current.year}</span>
                        </span>
                        <div className="flex-1 min-w-[160px]">
                          <p className="font-extrabold text-[#0F1E4A] flex items-center gap-2">{current.title} <Pill tone={current.status === 'Menunggu Verifikasi' ? 'blue' : 'green'}>{current.status === 'Menunggu Verifikasi' ? 'Diverifikasi' : 'Berikutnya'}</Pill></p>
                          <p className="text-sm text-slate-600">{current.description}</p>
                        </div>
                        <div className="text-right"><p className="text-lg font-extrabold text-[#0F1E4A]">{rupiah(current.amount)}</p><p className="text-xs text-slate-600">Jatuh tempo: {current.dueDate}</p></div>
                        {current.status === 'Belum Dibayar' ? (
                          <button onClick={() => setPayFor(current)} className="h-11 px-6 rounded-xl bg-[#1D4ED8] hover:bg-blue-800 text-white text-sm font-bold">Bayar Sekarang</button>
                        ) : (
                          <span className="h-11 px-5 rounded-xl bg-blue-50 text-[#1D4ED8] text-sm font-bold flex items-center gap-2"><Clock className="w-4 h-4" /> Menunggu Verifikasi</span>
                        )}
                      </div>
                    ) : <p className="text-sm text-slate-500 mb-4">Tidak ada tagihan berjalan. 🎉</p>}

                    <h3 className="font-extrabold text-[#0F1E4A] text-sm mb-2">Tagihan Sebelumnya</h3>
                    <div className="rounded-xl border border-slate-200 divide-y divide-slate-100">
                      {previous.slice(0, showAll ? undefined : 4).map((b) => <BillRow key={b.id} b={b} />)}
                    </div>
                    {previous.length > 4 && (
                      <button onClick={() => setShowAll((v) => !v)} className="w-full mt-2 py-2 text-sm font-bold text-[#1D4ED8] flex items-center justify-center gap-1">
                        {showAll ? 'Tampilkan lebih sedikit' : 'Lihat Semua Tagihan'} <ChevronDown className={cn('w-4 h-4', showAll && 'rotate-180')} />
                      </button>
                    )}
                  </>
                )}

                {tab === 'semua' && <div className="rounded-xl border border-slate-200 divide-y divide-slate-100">{bills.map((b) => <BillRow key={b.id} b={b} />)}</div>}

                {tab === 'riwayat' && (
                  <div className="rounded-xl border border-slate-200 divide-y divide-slate-100">
                    {bills.filter((b) => b.paidAt).map((b) => (
                      <div key={b.id} className="flex flex-wrap items-center gap-3 px-3 py-2.5 text-sm">
                        <CheckCircle2 className={cn('w-5 h-5', b.status === 'Lunas' ? 'text-emerald-600' : 'text-blue-500')} />
                        <div className="flex-1 min-w-[160px]"><p className="font-bold text-[#0F1E4A]">{b.title}</p><p className="text-xs text-slate-600">{b.invoice} · {b.method}</p></div>
                        <p className="text-xs text-slate-600 w-40">{b.paidAt}</p>
                        <p className="font-extrabold text-[#0F1E4A] w-28">{rupiah(b.amount)}</p>
                        <button onClick={() => setDetail(b)} className="text-xs font-bold text-[#1D4ED8] hover:underline">Kuitansi</button>
                      </div>
                    ))}
                  </div>
                )}

                {tab === 'metode' && (
                  <div className="grid sm:grid-cols-2 gap-3">
                    {PAYMENT_METHODS.map((m) => {
                      const Icon = METHOD_ICON[m.id];
                      return (
                        <div key={m.id} className={cn('rounded-xl border border-slate-200 p-4', m.disabled && 'opacity-60')}>
                          <div className="flex items-center gap-3">
                            <span className="w-10 h-10 rounded-lg bg-[#EAF1FF] text-[#1D4ED8] flex items-center justify-center"><Icon className="w-5 h-5" /></span>
                            <div><p className="font-bold text-[#0F1E4A] text-sm">{m.name}</p><p className="text-xs text-slate-600">{m.desc}</p></div>
                          </div>
                          {m.id === 'bank' && <div className="mt-3"><AccountList accounts={banks} empty={missing} /></div>}
                          {m.id === 'ewallet' && <div className="mt-3"><AccountList accounts={wallets} empty={missing} /></div>}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-4 bg-[#F5F8FF] border-blue-100 flex flex-wrap items-center gap-5">
              <img src="/assets/portal/mascot-wave.png" alt="" className="h-20 w-auto mix-blend-multiply" />
              <div className="flex-1 min-w-[220px]">
                <p className="font-extrabold text-[#1D4ED8]">Terima kasih!</p>
                <p className="text-sm text-slate-700 font-medium">Pembayaran tepat waktu sangat membantu kelancaran kegiatan belajar mengajar.</p>
                <p className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-bold text-[#1D4ED8] bg-white border border-blue-100 rounded-lg px-2.5 py-1">Terus semangat dan selamat belajar! <Heart className="w-3 h-3 fill-current" /></p>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-12 h-12 text-[#1D4ED8]" />
                <div><p className="text-sm font-bold text-[#1D4ED8]">Pembayaran aman</p><p className="text-xs text-slate-600 max-w-[200px]">Data pembayaran terenkripsi dan diverifikasi otomatis.</p></div>
              </div>
            </Card>
          </div>

          <div className="space-y-3">
            <Card className="p-4">
              <h2 className="font-extrabold text-[#0F1E4A] mb-2">Cara Pembayaran</h2>
              <div className="divide-y divide-slate-100">
                {PAYMENT_METHODS.map((m) => {
                  const Icon = METHOD_ICON[m.id];
                  return (
                    <button key={m.id} disabled={m.disabled} onClick={() => { setMethod(m.id); current?.status === 'Belum Dibayar' ? setPayFor(current) : setTab('metode'); }} className="w-full flex items-center gap-3 py-2.5 text-left disabled:opacity-50 disabled:cursor-not-allowed">
                      <span className="w-9 h-9 rounded-lg bg-[#EAF1FF] text-[#1D4ED8] flex items-center justify-center"><Icon className="w-5 h-5" /></span>
                      <span className="flex-1"><span className="block text-sm font-bold text-[#0F1E4A]">{m.name}</span><span className="block text-xs text-slate-600">{m.desc}</span></span>
                      <ChevronRight className="w-4 h-4 text-slate-500" />
                    </button>
                  );
                })}
              </div>
            </Card>
            <Card className="p-4">
              <h2 className="font-extrabold text-[#0F1E4A] mb-2">Informasi Penting</h2>
              {[
                { t: 'Pembayaran tepat waktu', d: 'Hindari denda keterlambatan.', c: 'text-emerald-600' },
                { t: 'Konfirmasi otomatis', d: 'Pembayaran akan terverifikasi otomatis.', c: 'text-orange-500' },
                { t: 'Butuh bantuan?', d: 'Hubungi admin bimbel jika ada kendala.', c: 'text-violet-600' },
              ].map((x) => (
                <div key={x.t} className="flex gap-2.5 py-1.5"><Info className={cn('w-4 h-4 mt-0.5', x.c)} /><div><p className="text-sm font-bold text-[#0F1E4A]">{x.t}</p><p className="text-xs text-slate-600">{x.d}</p></div></div>
              ))}
            </Card>
            <Card className="p-4">
              <h2 className="font-extrabold text-[#0F1E4A] flex items-center gap-2 mb-2"><Headphones className="w-5 h-5 text-emerald-600" /> Hubungi Admin</h2>
              <div className="flex items-center gap-3 mb-3"><MessageCircle className="w-8 h-8 text-emerald-600" /><div><p className="text-sm font-bold text-[#0F1E4A]">WhatsApp</p><p className="text-sm text-slate-600">{ADMIN_WA_LABEL}</p></div></div>
              <a href={`https://wa.me/${ADMIN_WA}?text=${encodeURIComponent(`Halo Admin, saya ${STUDENT.name} ingin bertanya tentang pembayaran.`)}`} target="_blank" rel="noreferrer"
                className="h-10 rounded-xl border border-blue-200 text-[#1D4ED8] text-sm font-bold flex items-center justify-center gap-2 hover:bg-blue-50">
                <MessageCircle className="w-4 h-4" /> Chat Admin
              </a>
            </Card>
          </div>
        </div>
      </div>

      {/* Modal bayar */}
      {payFor && (
        <div className="fixed inset-0 z-[70] bg-slate-900/40 flex items-center justify-center p-4" onClick={() => setPayFor(null)}>
          <div className="bg-white rounded-2xl w-full max-w-md p-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-1"><h3 className="text-lg font-extrabold text-[#0F1E4A]">Bayar {payFor.title}</h3><button onClick={() => setPayFor(null)} aria-label="Tutup"><X className="w-5 h-5 text-slate-500" /></button></div>
            <p className="text-sm text-slate-600 mb-4">Total <b className="text-[#0F1E4A]">{rupiah(payFor.amount)}</b> · jatuh tempo {payFor.dueDate}</p>
            <div className="space-y-2 mb-4">
              {PAYMENT_METHODS.map((m) => {
                const Icon = METHOD_ICON[m.id];
                return (
                  <div key={m.id}>
                    <label className={cn('flex items-center gap-3 rounded-xl border p-3', m.disabled ? 'border-slate-200 opacity-50 cursor-not-allowed' : 'cursor-pointer', !m.disabled && method === m.id ? 'border-[#1D4ED8] bg-[#EAF1FF]' : 'border-slate-200')}>
                      <input type="radio" name="method" disabled={m.disabled} checked={method === m.id} onChange={() => setMethod(m.id)} className="accent-[#1D4ED8]" />
                      <Icon className="w-5 h-5 text-[#1D4ED8]" />
                      <span className="flex-1"><span className="block text-sm font-bold text-[#0F1E4A]">{m.name}</span><span className="block text-xs text-slate-600">{m.desc}</span></span>
                      {m.disabled && <span className="text-[10px] font-bold text-slate-500 bg-slate-100 rounded px-1.5 py-0.5">Nonaktif</span>}
                    </label>
                    {method === m.id && m.id === 'bank' && <div className="mt-2 ml-2 rounded-xl bg-slate-50 p-2.5"><p className="text-xs font-bold text-slate-600 mb-1.5">Transfer ke salah satu rekening berikut:</p><AccountList accounts={banks} empty={missing} /></div>}
                    {method === m.id && m.id === 'ewallet' && <div className="mt-2 ml-2 rounded-xl bg-slate-50 p-2.5"><p className="text-xs font-bold text-slate-600 mb-1.5">Kirim ke salah satu akun e-wallet berikut:</p><AccountList accounts={wallets} empty={missing} /></div>}
                  </div>
                );
              })}
            </div>
            <button onClick={confirmPay} className="w-full h-11 rounded-xl bg-[#1D4ED8] hover:bg-blue-800 text-white text-sm font-bold">{method === 'bank' || method === 'ewallet' ? 'Saya Sudah Transfer' : 'Lanjutkan Pembayaran'}</button>
          </div>
        </div>
      )}

      {/* Modal detail / kuitansi */}
      {detail && (
        <div className="fixed inset-0 z-[70] bg-slate-900/40 flex items-center justify-center p-4" onClick={() => setDetail(null)}>
          <div className="bg-white rounded-2xl w-full max-w-md p-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3"><h3 className="text-lg font-extrabold text-[#0F1E4A]">Detail Tagihan</h3><button onClick={() => setDetail(null)} aria-label="Tutup"><X className="w-5 h-5 text-slate-500" /></button></div>
            <dl className="text-sm divide-y divide-slate-100">
              {[
                ['No. Invoice', detail.invoice], ['Siswa', `${STUDENT.name} (${STUDENT.id})`], ['Tagihan', `${detail.title} – ${detail.description}`],
                ['Jumlah', rupiah(detail.amount)], ['Jatuh Tempo', detail.dueDate], ['Status', detail.status], ['Dibayar', detail.paidAt ?? '-'], ['Metode', detail.method ?? '-'],
              ].map(([k, v]) => <div key={k} className="flex justify-between gap-4 py-2"><dt className="text-slate-600">{k}</dt><dd className="font-bold text-[#0F1E4A] text-right">{v}</dd></div>)}
            </dl>
            {detail.status === 'Lunas' && (
              <button onClick={() => { toast.success(`Kuitansi ${detail.invoice} diunduh`); setDetail(null); }} className="mt-4 w-full h-11 rounded-xl border border-blue-200 text-[#1D4ED8] text-sm font-bold flex items-center justify-center gap-2 hover:bg-blue-50">
                <Printer className="w-4 h-4" /> Unduh Kuitansi
              </button>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
