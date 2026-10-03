import { useEffect, useRef, useState } from 'react';
import { MessageCircleMore, Plus, Search, Star, Send, Paperclip, CheckCheck, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { PageHead, Avatar, RowMenu, FormDialog, soon } from '../../components/portal/Kit';
import { CONVERSATIONS, type Conversation } from '../../data/guruPortal';
import { cn } from '../../lib/utils';

const TABS = ['Semua', 'Belum Dibaca', 'Dibintangi'] as const;
const now = () => new Date().toTimeString().slice(0, 5).replace(':', '.');

export default function PesanGuru() {
  const [chats, setChats] = useState(CONVERSATIONS);
  const [activeId, setActiveId] = useState(CONVERSATIONS[0].id);
  const [tab, setTab] = useState<(typeof TABS)[number]>('Semua');
  const [q, setQ] = useState('');
  const [draft, setDraft] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [composing, setComposing] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const active = chats.find((c) => c.id === activeId) ?? chats[0];
  const unread = chats.filter((c) => c.unread > 0).length;
  const list = chats.filter((c) => (tab === 'Semua' || (tab === 'Belum Dibaca' ? c.unread > 0 : c.starred)) && (!q || `${c.name} ${c.preview}`.toLowerCase().includes(q.toLowerCase())));
  const patch = (id: string, changes: Partial<Conversation>) => setChats((prev) => prev.map((c) => (c.id === id ? { ...c, ...changes } : c)));

  useEffect(() => { endRef.current?.scrollIntoView({ block: 'nearest' }); }, [activeId, active?.messages.length]);

  const select = (c: Conversation) => { setActiveId(c.id); setMobileOpen(true); patch(c.id, { unread: 0 }); };
  const send = () => {
    const text = draft.trim();
    if (!text || !active) return;
    patch(active.id, { messages: [...active.messages, { from: 'me', text, time: now() }], preview: text, time: now() });
    setDraft('');
  };

  return (
    <DashboardLayout>
      <div className="space-y-4 max-w-[1300px]">
        <PageHead title={<span className="flex items-center gap-2">Pesan <MessageCircleMore className="w-5 h-5 text-[#1D4ED8]" /></span>} subtitle="Komunikasi mudah antara guru, siswa, dan orang tua." />

        <div className="grid grid-cols-1 lg:grid-cols-[360px_minmax(0,1fr)] gap-4 lg:h-[calc(100vh-190px)] lg:min-h-[520px]">
          <section className={cn('bg-white rounded-2xl border border-slate-200/80 flex-col min-h-0', mobileOpen ? 'hidden lg:flex' : 'flex')}>
            <div className="p-4 space-y-3">
              <button onClick={() => setComposing(true)} className="w-full h-11 rounded-lg bg-[#1D4ED8] hover:bg-blue-800 text-white text-sm font-bold flex items-center justify-center gap-2"><Plus className="w-4 h-4" /> Pesan Baru</button>
              <div className="flex gap-4 border-b border-slate-100">
                {TABS.map((t) => (
                  <button key={t} onClick={() => setTab(t)} className={cn('pb-2 text-[13px] font-bold border-b-2 -mb-px flex items-center gap-1.5', tab === t ? 'border-[#1D4ED8] text-[#1D4ED8]' : 'border-transparent text-slate-600')}>
                    {t}
                    {t === 'Semua' && <span className="px-1.5 rounded-full bg-[#1D4ED8] text-white text-[10px]">{chats.length}</span>}
                    {t === 'Belum Dibaca' && unread > 0 && <span className="px-1.5 rounded-full bg-slate-100 text-slate-600 text-[10px]">{unread}</span>}
                  </button>
                ))}
              </div>
              <label className="flex items-center gap-2 h-10 px-3 rounded-lg border border-slate-200">
                <Search className="w-4 h-4 text-slate-400" />
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari pesan..." className="flex-1 min-w-0 outline-none text-[13px] font-medium bg-transparent" />
              </label>
            </div>
            <ul className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {list.map((c) => (
                <li key={c.id}>
                  <button onClick={() => select(c)} className={cn('w-full flex gap-3 px-4 py-3 text-left transition-colors', c.id === activeId ? 'bg-[#EAF1FF]' : 'hover:bg-slate-50')}>
                    <Avatar name={c.name.replace('Orang Tua – ', '')} src={c.avatar} size={42} />
                    <span className="flex-1 min-w-0">
                      <span className="flex items-center justify-between gap-2"><span className="text-sm font-extrabold text-[#0F1E4A] truncate">{c.name}</span><span className="text-[11px] text-slate-500 font-medium whitespace-nowrap">{c.time}</span></span>
                      <span className="flex items-center justify-between gap-2 mt-0.5">
                        <span className="text-xs text-slate-600 font-medium truncate">{c.preview}</span>
                        {c.unread > 0 ? <span className="w-5 h-5 rounded-full bg-[#1D4ED8] text-white text-[10px] font-bold flex items-center justify-center shrink-0">{c.unread}</span> : c.starred && <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
              {list.length === 0 && <li className="py-10 text-center text-sm text-slate-500 font-medium">Tidak ada percakapan.</li>}
            </ul>
          </section>

          <section className={cn('bg-white rounded-2xl border border-slate-200/80 flex-col min-h-0 min-w-0', mobileOpen ? 'flex' : 'hidden lg:flex')}>
            {active && (
              <>
                <header className="flex items-center gap-3 p-4 border-b border-slate-100">
                  <button aria-label="Kembali ke daftar" onClick={() => setMobileOpen(false)} className="lg:hidden w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center"><ArrowLeft className="w-4 h-4" /></button>
                  <Avatar name={active.name.replace('Orang Tua – ', '')} src={active.avatar} size={48} />
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-extrabold text-[#0F1E4A] truncate">{active.name}</p>
                    <p className="text-xs text-slate-600 font-medium">{active.role} · <button onClick={() => soon('Profil kontak')} className="font-bold text-[#1D4ED8] hover:underline">Lihat Profil</button></p>
                  </div>
                  <RowMenu items={[
                    { label: active.starred ? 'Hapus Bintang' : 'Bintangi', onClick: () => patch(active.id, { starred: !active.starred }) },
                    { label: 'Tandai Belum Dibaca', onClick: () => patch(active.id, { unread: 1 }) },
                    { label: 'Hapus Percakapan', danger: true, onClick: () => { const rest = chats.filter((c) => c.id !== active.id); setChats(rest); setActiveId(rest[0]?.id ?? ''); setMobileOpen(false); toast.success('Percakapan dihapus'); } },
                  ]} />
                </header>

                <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[260px]">
                  <p className="flex items-center gap-3 text-[11px] text-slate-500 font-semibold"><span className="flex-1 h-px bg-slate-100" />Percakapan<span className="flex-1 h-px bg-slate-100" /></p>
                  {active.messages.map((m, i) => (
                    <div key={i} className={cn('flex gap-2.5', m.from === 'me' ? 'justify-end' : 'justify-start')}>
                      {m.from === 'them' && <Avatar name={active.name.replace('Orang Tua – ', '')} src={active.avatar} size={32} />}
                      <div className={cn('max-w-[78%] rounded-2xl px-4 py-2.5 text-sm font-medium text-slate-800', m.from === 'me' ? 'bg-[#E3ECFF]' : 'bg-slate-100')}>
                        <p className="whitespace-pre-wrap break-words">{m.text}</p>
                        <p className="flex items-center justify-end gap-1 text-[11px] text-slate-500 mt-1">{m.time}{m.from === 'me' && <CheckCheck className="w-3.5 h-3.5 text-[#1D4ED8]" />}</p>
                      </div>
                    </div>
                  ))}
                  <div ref={endRef} />
                </div>

                <form onSubmit={(e) => { e.preventDefault(); send(); }} className="p-4 border-t border-slate-100">
                  <div className="flex items-center gap-3">
                    <input value={draft} onChange={(e) => setDraft(e.target.value)} aria-label="Tulis pesan" placeholder="Tulis pesan..." className="flex-1 min-w-0 h-12 px-4 rounded-full border border-slate-200 outline-none focus:border-[#1D4ED8] text-sm font-medium" />
                    <button type="submit" aria-label="Kirim" disabled={!draft.trim()} className="w-12 h-12 rounded-full bg-[#1D4ED8] hover:bg-blue-800 disabled:opacity-40 text-white flex items-center justify-center shrink-0"><Send className="w-5 h-5" /></button>
                  </div>
                  <button type="button" onClick={() => soon('Lampiran')} className="mt-2 inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#1D4ED8]"><Paperclip className="w-4 h-4" /> Lampiran · Kirim foto, file, atau dokumen</button>
                </form>
              </>
            )}
            {!active && <p className="m-auto text-sm text-slate-500 font-medium">Pilih percakapan untuk mulai membaca.</p>}
          </section>
        </div>

        <FormDialog
          open={composing}
          title="Pesan Baru"
          submitLabel="Kirim"
          fields={[{ key: 'name', label: 'Kepada', required: true, placeholder: 'Nama siswa / orang tua' }, { key: 'role', label: 'Sebagai', type: 'select', options: ['Orang Tua Siswa', 'Siswa', 'Admin'] }, { key: 'text', label: 'Pesan', type: 'textarea', required: true }]}
          onClose={() => setComposing(false)}
          onSubmit={(v) => {
            const chat: Conversation = { id: `C${Date.now()}`, name: v.name, role: v.role, time: now(), preview: v.text, unread: 0, starred: false, messages: [{ from: 'me', text: v.text, time: now() }] };
            setChats((prev) => [chat, ...prev]);
            setActiveId(chat.id);
            setMobileOpen(true);
          }}
        />
      </div>
    </DashboardLayout>
  );
}
