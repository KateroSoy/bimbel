import { useEffect, useRef, useState, type FormEvent } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';
import { CONTACT, whatsappUrl } from '../../lib/contact';
import { BUNDLES, LANDING_PROGRAMS, PROGRAM_GROUPS, ribu, rupiah } from '../../data/landingPrograms';
import { openRegistration } from './RegistrationForm';
import { cn } from '../../lib/utils';

const OPEN_EVENT = 'studyhack:chat';

/** Opens the consultation chatbox, optionally with a first visitor message. */
export function openChat(message?: string) {
  window.dispatchEvent(new CustomEvent(OPEN_EVENT, { detail: { message } }));
}

type Msg = { from: 'bot' | 'me'; text: string; actions?: { label: string; run: () => void }[] };

const TOPICS = ['Info Program', 'Biaya & Paket', 'Promo Bawa Teman', 'Jadwal & Lokasi', 'Daftar & Tes Diagnostik'];

function answer(text: string): Msg {
  const t = text.toLowerCase();
  const program = LANDING_PROGRAMS.find((p) => t.includes(p.name.toLowerCase().split(':')[0].split(' &')[0].toLowerCase()));
  if (program) {
    return {
      from: 'bot',
      text: `${program.name} (${program.group}): ${program.summary} Metode ${program.method.toLowerCase()}, ${program.frequency}, ${program.duration}. Biaya ${ribu(program.price)}/bulan.`,
      actions: [{ label: `Daftar ${program.name}`, run: () => openRegistration(program.name, program.group === 'Early Childhood' ? 'Early Childhood' : 'Kids') }],
    };
  }
  if (/(biaya|harga|paket|bundl|spp|bayar)/.test(t)) {
    return {
      from: 'bot',
      text: `Paket bundling per bulan: ${BUNDLES.map((b) => `${b.name} ${rupiah(b.price)} (normal ${rupiah(b.normal)})`).join(' · ')}. Program satuan mulai ${ribu(Math.min(...LANDING_PROGRAMS.map((p) => p.price)))}/bulan.`,
    };
  }
  if (/(promo|teman|diskon|cuan)/.test(t)) {
    return { from: 'bot', text: 'Promo Bawa Teman: ajak temanmu mendaftar, kamu dapat diskon SPP 10% untuk 1 bulan berikutnya dan temanmu gratis uang pendaftaran. Tulis nama temanmu di kolom catatan saat mendaftar.' };
  }
  if (/(jadwal|lokasi|alamat|dimana|di mana|online|tatap)/.test(t)) {
    return { from: 'bot', text: `Kami berlokasi di ${CONTACT.address}. Sebagian besar program tersedia Tatap Muka dan Online; jadwal disesuaikan setelah Tes Diagnostik.` };
  }
  if (/(daftar|tes|diagnos|gabung)/.test(t)) {
    return {
      from: 'bot',
      text: 'Pendaftaran bisa langsung lewat formulir. Setelah mendaftar, anak mendapat Tes Diagnostik GRATIS untuk memetakan kemampuan awal.',
      actions: [{ label: 'Buka formulir pendaftaran', run: () => openRegistration('Konsultasi Program') }],
    };
  }
  if (/(program|kelas|kursus|belajar)/.test(t)) {
    return { from: 'bot', text: `Program kami terbagi menjadi ${PROGRAM_GROUPS.join(', ')}. Sebutkan nama program (misal "Math Essential" atau "Mandarin World") untuk detailnya.` };
  }
  return {
    from: 'bot',
    text: 'Terima kasih! Pertanyaan ini akan lebih cepat dijawab langsung oleh admin kami.',
    actions: [{ label: 'Lanjut chat dengan admin (WhatsApp)', run: () => window.open(whatsappUrl(text), '_blank', 'noopener') }],
  };
}

const GREETING: Msg = { from: 'bot', text: 'Halo! 👋 Saya asisten StudyHack. Mau tanya soal program, biaya, atau pendaftaran? Pilih topik di bawah atau ketik pertanyaanmu.' };

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([GREETING]);
  const [draft, setDraft] = useState('');
  const listRef = useRef<HTMLDivElement>(null);

  const ask = (text: string) => {
    const clean = text.trim();
    if (!clean) return;
    setMessages((m) => [...m, { from: 'me', text: clean }, answer(clean)]);
    setDraft('');
  };

  useEffect(() => {
    const onOpen = (e: Event) => {
      setOpen(true);
      const message = (e as CustomEvent<{ message?: string }>).detail?.message;
      if (message) ask(message);
    };
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_EVENT, onOpen);
  }, []);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, open]);

  const submit = (e: FormEvent) => { e.preventDefault(); ask(draft); };

  return (
    <>
      {open && (
        <div role="dialog" aria-label="Konsultasi StudyHack" className="fixed z-[70] bottom-24 right-4 left-4 sm:left-auto sm:w-[370px] h-[min(560px,calc(100vh-8rem))] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="bg-[#062564] text-white px-5 py-4 flex items-center gap-3">
            <img src="/assets/landing/cs-avatar.jpg" alt="" className="w-10 h-10 rounded-full object-cover border-2 border-white/30" />
            <div className="flex-1 min-w-0">
              <p className="font-extrabold text-sm">Konsultasi Gratis</p>
              <p className="text-[11px] text-blue-200 font-semibold flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400" /> Tim StudyHack · biasanya membalas cepat</p>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Tutup chat" className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div ref={listRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
            {messages.map((m, i) => (
              <div key={i} className={cn('flex flex-col', m.from === 'me' ? 'items-end' : 'items-start')}>
                <div className={cn('max-w-[85%] px-3.5 py-2.5 rounded-2xl text-[13px] font-medium leading-relaxed',
                  m.from === 'me' ? 'bg-[#062564] text-white rounded-br-md' : 'bg-white text-slate-700 border border-slate-200 rounded-bl-md')}>
                  {m.text}
                </div>
                {m.actions?.map((a) => (
                  <button key={a.label} onClick={a.run} className="mt-1.5 text-xs font-extrabold text-[#F16710] hover:underline cursor-pointer">{a.label} →</button>
                ))}
              </div>
            ))}
          </div>

          <div className="px-3 pt-2 flex gap-1.5 overflow-x-auto [scrollbar-width:none] bg-white">
            {TOPICS.map((t) => (
              <button key={t} onClick={() => ask(t)} className="shrink-0 px-3 py-1.5 rounded-full border border-[#DCE3EE] text-[11px] font-bold text-[#062564] hover:border-[#062564] cursor-pointer">{t}</button>
            ))}
          </div>
          <form onSubmit={submit} className="p-3 flex gap-2 bg-white">
            <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Tulis pertanyaan…" maxLength={500}
              className="flex-1 h-10 px-4 rounded-full bg-slate-100 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#062564]/25" />
            <button type="submit" aria-label="Kirim" className="w-10 h-10 rounded-full bg-[#F16710] text-white flex items-center justify-center hover:bg-[#d95b0e] cursor-pointer">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Tutup konsultasi' : 'Buka konsultasi gratis'}
        className="fixed z-[70] bottom-5 right-5 h-14 pl-4 pr-5 rounded-full bg-[#F16710] text-white shadow-xl shadow-orange-500/30 flex items-center gap-2 font-extrabold text-sm hover:bg-[#d95b0e] cursor-pointer"
      >
        {open ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
        <span className="hidden sm:inline">{open ? 'Tutup' : 'Konsultasi Gratis'}</span>
      </button>
    </>
  );
}
