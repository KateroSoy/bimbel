import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Search, Send, Users, CheckCheck, Copy, ExternalLink, CreditCard, UserCheck, Sparkles, BarChart, Calendar, PenLine, ArrowLeft, Info, MessageSquare,
} from 'lucide-react';
import { toast } from 'sonner';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useDataStore, type WhatsAppMessageLog, type Student } from '../../store/useDataStore';
import { formatAccounts, parseAccounts } from '../../lib/payment';
import { cn } from '../../lib/utils';

type Category = WhatsAppMessageLog['category'];
type Chat =
  | { kind: 'person'; key: string; title: string; sub: string; phone: string; student: Student }
  | { kind: 'group'; key: string; title: string; sub: string; kelas: string; members: Student[] };

const TEMPLATES: { category: Category; label: string; icon: typeof CreditCard }[] = [
  { category: 'Pengingat SPP', label: 'Pengingat SPP', icon: CreditCard },
  { category: 'Laporan Absensi', label: 'Laporan Absensi', icon: UserCheck },
  { category: 'Pengumuman Tryout', label: 'Pengumuman', icon: Sparkles },
  { category: 'Evaluasi Belajar', label: 'Evaluasi Belajar', icon: BarChart },
  { category: 'Jadwal Bimbel', label: 'Jadwal Bimbel', icon: Calendar },
  { category: 'Umum', label: 'Pesan Bebas', icon: PenLine },
];

const toIntl = (phone: string) => {
  const digits = (phone || '').replace(/\D/g, '');
  return digits.startsWith('0') ? `62${digits.slice(1)}` : digits;
};
const waLink = (phone: string, text: string) => `https://wa.me/${toIntl(phone)}?text=${encodeURIComponent(text)}`;
const nowLabel = () => `${new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })} WIB`;
const timeOf = (sentAt: string) => sentAt.match(/\d{1,2}[.:]\d{2}/)?.[0]?.replace(':', '.') ?? '';
const initials = (name: string) => name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();

export default function KirimWaOrtu() {
  const { students, tuitionPayments, attendanceLogs, whatsAppLogs, sendWhatsAppMessage, schoolSettings } = useDataStore();
  const [filter, setFilter] = useState<'Semua' | 'Personal' | 'Grup Kelas'>('Semua');
  const [q, setQ] = useState('');
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const [category, setCategory] = useState<Category>('Umum');
  const [queue, setQueue] = useState<{ name: string; phone: string; text: string }[] | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const chats = useMemo<Chat[]>(() => {
    const people: Chat[] = students.map((s) => ({
      kind: 'person', key: `p-${s.id}`, title: s.parentName || `Wali ${s.name}`, sub: `Wali dari ${s.name} · ${s.grade}`,
      phone: s.parentPhone || s.phone, student: s,
    }));
    const classes = [...new Set(students.map((s) => s.grade).filter(Boolean))].sort();
    const groups: Chat[] = classes.map((kelas) => {
      const members = students.filter((s) => s.grade === kelas);
      return { kind: 'group', key: `g-${kelas}`, title: `Grup Wali · ${kelas}`, sub: `${members.length} wali murid`, kelas, members };
    });
    return [...groups, ...people];
  }, [students]);

  // Oldest first; ids are sequential (WA-0001, WA-0002, …)
  const ordered = useMemo(() => [...whatsAppLogs].sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true })), [whatsAppLogs]);
  const logsFor = (chat: Chat) => chat.kind === 'person'
    ? (chat.phone ? ordered.filter((l) => l.recipientPhone && toIntl(l.recipientPhone) === toIntl(chat.phone)) : [])
    : ordered.filter((l) => l.recipientName === `Grup ${chat.kelas}`);

  // Latest message per chat drives the preview and the list order
  const listed = chats
    .filter((c) => filter === 'Semua' || (filter === 'Grup Kelas' ? c.kind === 'group' : c.kind === 'person'))
    .filter((c) => !q || `${c.title} ${c.sub}`.toLowerCase().includes(q.toLowerCase()));
  const active = chats.find((c) => c.key === activeKey) ?? null;
  const history = active ? logsFor(active) : [];

  useEffect(() => { bottomRef.current?.scrollIntoView({ block: 'end' }); }, [activeKey, history.length]);

  const template = (cat: Category, s: Student | null, kelas?: string) => {
    const name = schoolSettings.schoolName || 'StudyHack Education Center';
    const salutation = s ? `Yth. *${s.parentName || `Orang Tua Ananda ${s.name}`}*,\nWali dari *${s.name} (${s.grade})*\n\n` : `Yth. Bapak/Ibu Wali Murid *${kelas}*,\n\n`;
    const accounts = [...parseAccounts(schoolSettings.bankAccounts), ...parseAccounts(schoolSettings.ewallets)];
    switch (cat) {
      case 'Pengingat SPP': {
        const bill = s ? tuitionPayments.find((p) => p.studentId === s.id && p.status !== 'Lunas') : undefined;
        return `*PEMBERITAHUAN SPP BIMBEL - ${name.toUpperCase()}*\n\n${salutation}` +
          (bill ? `Tagihan bimbingan belajar periode *${bill.period}* sebesar *Rp ${bill.amount.toLocaleString('id-ID')}* jatuh tempo *${bill.dueDate}*.\n\n`
            : 'Kami mengingatkan pembayaran SPP bimbingan belajar bulan ini.\n\n') +
          `💳 Pembayaran dapat dilakukan melalui menu *Pembayaran* di portal siswa${accounts.length ? ` atau ke:\n${formatAccounts(accounts)}` : '.'}\n\n` +
          `Terima kasih atas kerja samanya.\n_Admin Keuangan ${name}_`;
      }
      case 'Laporan Absensi': {
        const log = s ? attendanceLogs.find((a) => a.studentId === s.id) : undefined;
        return `*LAPORAN PRESENSI KELAS*\n\n${salutation}Kehadiran ananda hari ini:\n` +
          `📌 *Status*: *${(log?.status || 'Hadir').toUpperCase()}*\n📅 *Tanggal*: ${log?.date || new Date().toLocaleDateString('id-ID')}\n` +
          `📚 *Mata Pelajaran*: ${log?.subject || '-'}\n💡 *Topik*: ${log?.topic || '-'}\n\nRiwayat lengkap dapat dipantau di portal siswa.\n\n_Akademik ${name}_`;
      }
      case 'Pengumuman Tryout':
        return `*PENGUMUMAN*\n\n${salutation}(Tulis isi pengumuman di sini: kegiatan, tanggal, waktu, dan tempat.)\n\nMohon bantuan Bapak/Ibu untuk mengingatkan ananda.\n\n_${name}_`;
      case 'Evaluasi Belajar':
        return `*LAPORAN PERKEMBANGAN BELAJAR*\n\n${salutation}` +
          (s ? `🎯 *Kehadiran*: ${s.attendance || '-'}\n⭐ *Catatan Tutor*: (tulis catatan perkembangan)\n\n` : '(Tulis ringkasan perkembangan kelas)\n\n') +
          `Rincian nilai tersedia di menu Hasil Belajar portal siswa.\n\n_Akademik ${name}_`;
      case 'Jadwal Bimbel':
        return `*INFORMASI JADWAL KELAS*\n\n${salutation}Berikut jadwal ananda pekan ini:\n• (hari, jam, Tatap Muka / Online)\n\nJadwal lengkap ada di menu Jadwal Kelas portal siswa.\n\n_Layanan Siswa ${name}_`;
      default:
        return '';
    }
  };

  const openChat = (chat: Chat) => {
    setActiveKey(chat.key);
    setCategory('Umum');
    setDraft('');
  };

  const applyTemplate = (cat: Category) => {
    if (!active) return;
    setCategory(cat);
    setDraft(template(cat, active.kind === 'person' ? active.student : null, active.kind === 'group' ? active.kelas : undefined));
  };

  const send = () => {
    if (!active || !draft.trim()) return;
    const text = draft.trim();
    if (active.kind === 'person') {
      sendWhatsAppMessage({
        recipientName: active.title, recipientPhone: active.phone, studentName: active.student.name, studentGrade: active.student.grade,
        category, message: text, sentAt: nowLabel(), status: 'Terkirim',
      });
      window.open(waLink(active.phone, text), '_blank', 'noopener');
      toast.success('Pesan dicatat dan WhatsApp dibuka', { description: `${active.title} · ${active.phone}` });
    } else {
      // One log for the group thread, then one per wali so each personal chat shows it too
      sendWhatsAppMessage({
        recipientName: `Grup ${active.kelas}`, recipientPhone: '', studentName: `${active.members.length} siswa`, studentGrade: active.kelas,
        category, message: text, sentAt: nowLabel(), status: 'Terkirim',
      });
      const recipients = active.members.filter((m) => m.parentPhone || m.phone).map((m) => {
        const personal = text.replace(`Yth. Bapak/Ibu Wali Murid *${active.kelas}*,`, `Yth. *${m.parentName || `Wali ${m.name}`}*, wali dari *${m.name}*,`);
        sendWhatsAppMessage({
          recipientName: m.parentName || `Wali ${m.name}`, recipientPhone: m.parentPhone || m.phone, studentName: m.name, studentGrade: m.grade,
          category, message: personal, sentAt: nowLabel(), status: 'Pending',
        });
        return { name: m.parentName || `Wali ${m.name}`, phone: m.parentPhone || m.phone, text: personal };
      });
      setQueue(recipients);
      toast.success(`Pesan batch untuk ${recipients.length} wali murid ${active.kelas} disiapkan`);
    }
    setDraft('');
  };

  const copy = (text: string) => { void navigator.clipboard.writeText(text); toast.success('Pesan disalin — tempel ke grup WhatsApp kelas'); };

  return (
    <DashboardLayout>
      <div className="max-w-[1500px] space-y-3">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h1 className="text-2xl md:text-[26px] font-extrabold text-[#0F1E4A] tracking-tight">WhatsApp Wali Murid</h1>
            <p className="text-sm text-slate-600 font-medium">Inbox WhatsApp bimbel: kirim pesan ke wali per siswa atau sekaligus satu grup kelas.</p>
          </div>
          <p className="text-xs font-semibold text-slate-500 flex items-center gap-1.5"><Info className="w-3.5 h-3.5" /> Pesan dibuka di WhatsApp untuk dikirim & dicatat di riwayat.</p>
        </div>

        <div className="h-[calc(100vh-170px)] min-h-[520px] rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm flex">
          {/* Chat list */}
          <aside className={cn('w-full md:w-[360px] shrink-0 border-r border-slate-200 flex flex-col', active && 'hidden md:flex')}>
            <div className="h-16 px-4 flex items-center gap-3 bg-[#F0F2F5] border-b border-slate-200">
              <span className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-extrabold text-sm">SH</span>
              <div className="min-w-0">
                <p className="text-sm font-extrabold text-slate-900 truncate">{schoolSettings.schoolName || 'StudyHack Education Center'}</p>
                <p className="text-[11px] text-slate-500 font-semibold">{whatsAppLogs.length} pesan tercatat</p>
              </div>
            </div>
            <div className="p-2.5 space-y-2 border-b border-slate-100">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari wali, siswa, atau kelas" className="w-full h-9 pl-9 pr-3 rounded-lg bg-[#F0F2F5] text-[13px] font-medium outline-none focus:ring-2 focus:ring-emerald-500/30" />
              </div>
              <div className="flex gap-1.5">
                {(['Semua', 'Personal', 'Grup Kelas'] as const).map((f) => (
                  <button key={f} onClick={() => setFilter(f)} className={cn('px-3 py-1 rounded-full text-xs font-bold', filter === f ? 'bg-emerald-100 text-emerald-800' : 'bg-[#F0F2F5] text-slate-600 hover:bg-slate-200')}>{f}</button>
                ))}
              </div>
            </div>
            <ul className="flex-1 overflow-y-auto">
              {listed.map((c) => {
                const last = logsFor(c).at(-1);
                return (
                  <li key={c.key}>
                    <button onClick={() => openChat(c)} className={cn('w-full flex items-center gap-3 px-3.5 py-3 text-left border-b border-slate-100 hover:bg-[#F5F6F6]', activeKey === c.key && 'bg-[#F0F2F5]')}>
                      <span className={cn('w-11 h-11 rounded-full flex items-center justify-center font-extrabold text-sm shrink-0', c.kind === 'group' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600')}>
                        {c.kind === 'group' ? <Users className="w-5 h-5" /> : initials(c.title)}
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="flex items-center justify-between gap-2">
                          <span className="text-[14px] font-bold text-slate-900 truncate">{c.title}</span>
                          {last && <span className="text-[11px] text-slate-500 shrink-0">{timeOf(last.sentAt)}</span>}
                        </span>
                        <span className="flex items-center gap-1 text-[12.5px] text-slate-500 truncate">
                          {last && <CheckCheck className="w-3.5 h-3.5 text-sky-500 shrink-0" />}
                          <span className="truncate">{last ? last.message.replace(/[*_]/g, '').split('\n')[0] : c.sub}</span>
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
              {listed.length === 0 && <li className="p-6 text-center text-sm text-slate-500">Tidak ada kontak yang cocok.</li>}
            </ul>
          </aside>

          {/* Conversation */}
          <section className={cn('flex-1 min-w-0 flex flex-col bg-[#EFEAE2]', !active && 'hidden md:flex')}>
            {!active ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-[#F8F9FA]">
                <MessageSquare className="w-14 h-14 text-emerald-600 mb-3" />
                <h2 className="text-xl font-extrabold text-slate-800 mb-1">WhatsApp Wali Murid</h2>
                <p className="text-sm text-slate-500 max-w-sm">Pilih wali murid untuk pesan personal, atau <strong>Grup Wali</strong> untuk mengirim ke satu kelas sekaligus.</p>
              </div>
            ) : (
              <>
                <header className="h-16 px-4 flex items-center gap-3 bg-[#F0F2F5] border-b border-slate-200">
                  <button className="md:hidden w-8 h-8 flex items-center justify-center" onClick={() => setActiveKey(null)} aria-label="Kembali"><ArrowLeft className="w-5 h-5" /></button>
                  <span className={cn('w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-sm shrink-0', active.kind === 'group' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600')}>
                    {active.kind === 'group' ? <Users className="w-5 h-5" /> : initials(active.title)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-extrabold text-slate-900 truncate">{active.title}</p>
                    <p className="text-[12px] text-slate-500 truncate">{active.kind === 'group' ? active.members.map((m) => m.parentName || m.name).join(', ') : `${active.phone} · ${active.sub}`}</p>
                  </div>
                  {active.kind === 'person' && (
                    <a href={waLink(active.phone, '')} target="_blank" rel="noreferrer" className="hidden sm:inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-white border border-slate-200 text-xs font-bold text-emerald-700"><ExternalLink className="w-3.5 h-3.5" /> Buka di WhatsApp</a>
                  )}
                </header>

                <div className="flex-1 overflow-y-auto px-4 md:px-10 py-4 space-y-2 [background-image:radial-gradient(#d9d2c5_1px,transparent_1px)] [background-size:18px_18px]">
                  {history.length === 0 && (
                    <p className="mx-auto w-fit text-[12px] font-semibold text-slate-600 bg-[#FFF3C4] rounded-lg px-3 py-1.5 shadow-sm">Belum ada pesan. Pilih template di bawah atau tulis pesan.</p>
                  )}
                  {history.map((log) => (
                    <div key={log.id} className="flex justify-end">
                      <div className="max-w-[78%] bg-[#D9FDD3] rounded-lg rounded-tr-none px-3 py-2 shadow-sm">
                        <p className="text-[10px] font-extrabold text-emerald-700 mb-0.5">{log.category}{active.kind === 'group' ? ` · ${log.studentName}` : ''}</p>
                        <p className="text-[13.5px] text-slate-800 whitespace-pre-wrap break-words">{log.message.replace(/\*/g, '')}</p>
                        <p className="text-[10.5px] text-slate-500 text-right mt-1 flex items-center justify-end gap-1">
                          {log.sentAt}
                          <CheckCheck className={cn('w-3.5 h-3.5', log.status === 'Terkirim' ? 'text-sky-500' : 'text-slate-400')} />
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={bottomRef} />
                </div>

                <div className="bg-[#F0F2F5] border-t border-slate-200 px-3 pt-2.5 pb-3 space-y-2">
                  <div className="flex gap-1.5 overflow-x-auto [scrollbar-width:none]">
                    {TEMPLATES.map((t) => (
                      <button key={t.category} onClick={() => applyTemplate(t.category)} className={cn('shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border', category === t.category && draft ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-400')}>
                        <t.icon className="w-3.5 h-3.5" /> {t.label}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-end gap-2">
                    <textarea
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      placeholder={active.kind === 'group' ? `Tulis pesan untuk semua wali ${active.kelas}…` : 'Ketik pesan'}
                      rows={Math.min(8, Math.max(1, draft.split('\n').length))}
                      className="flex-1 resize-none rounded-xl bg-white px-4 py-2.5 text-[14px] outline-none border border-transparent focus:border-emerald-400"
                    />
                    {draft && <button onClick={() => copy(draft)} aria-label="Salin pesan" className="w-11 h-11 rounded-full bg-white text-slate-600 flex items-center justify-center border border-slate-200"><Copy className="w-4 h-4" /></button>}
                    <button onClick={send} disabled={!draft.trim()} aria-label="Kirim" className="w-11 h-11 rounded-full bg-emerald-600 disabled:bg-slate-300 text-white flex items-center justify-center"><Send className="w-5 h-5" /></button>
                  </div>
                  {active.kind === 'group' && <p className="text-[11px] text-slate-500 font-semibold">Mode batch: pesan dipersonalisasi untuk tiap wali di {active.kelas}. Bisa juga disalin lalu ditempel ke grup WhatsApp kelas.</p>}
                </div>
              </>
            )}
          </section>
        </div>
      </div>

      {queue && (
        <div className="fixed inset-0 z-[80] bg-slate-900/40 flex items-center justify-center p-4" onClick={() => setQueue(null)}>
          <div role="dialog" aria-modal="true" aria-label="Kirim batch" className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[85vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="px-5 py-4 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-[#0F1E4A]">Kirim ke {queue.length} wali murid</h3>
              <p className="text-xs text-slate-500 font-medium">Klik tiap tombol untuk membuka WhatsApp dengan pesan yang sudah terisi.</p>
            </div>
            <ul className="px-5 py-3 overflow-y-auto divide-y divide-slate-100">
              {queue.map((r) => (
                <li key={r.phone + r.name} className="py-2.5 flex items-center gap-3">
                  <span className="flex-1 min-w-0"><span className="block text-sm font-bold text-slate-800 truncate">{r.name}</span><span className="block text-xs text-slate-500">{r.phone}</span></span>
                  <a href={waLink(r.phone, r.text)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg bg-emerald-600 text-white text-xs font-bold"><Send className="w-3.5 h-3.5" /> Kirim</a>
                </li>
              ))}
            </ul>
            <div className="px-5 py-3 border-t border-slate-100 flex justify-end">
              <button onClick={() => setQueue(null)} className="h-10 px-4 rounded-lg border border-slate-200 text-sm font-bold text-slate-700">Selesai</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
