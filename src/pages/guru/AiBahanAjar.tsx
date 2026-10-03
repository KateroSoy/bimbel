import { useState } from 'react';
import { Sparkles, History, UserRound, Send, FileText, BookOpen, CircleHelp, Presentation, ClipboardList, Image, MoreHorizontal, Star, Info, ArrowRight, Clock, type LucideIcon } from 'lucide-react';
import { toast } from 'sonner';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { PageHead, Panel, Select, Btn, Badge, RowMenu, Modal, type Tone } from '../../components/portal/Kit';
import { AI_RESULTS, AI_TYPES, type AiResult } from '../../data/guruPortal';
import { cn } from '../../lib/utils';

const TYPE_META: Record<string, { icon: LucideIcon; tone: Tone; cls: string }> = {
  Worksheet: { icon: FileText, tone: 'green', cls: 'bg-violet-50 text-violet-600' }, Modul: { icon: BookOpen, tone: 'green', cls: 'bg-emerald-50 text-emerald-600' },
  'Quiz / Soal': { icon: CircleHelp, tone: 'orange', cls: 'bg-orange-50 text-orange-500' }, Presentasi: { icon: Presentation, tone: 'purple', cls: 'bg-violet-50 text-violet-600' },
  'RPP / ATP': { icon: ClipboardList, tone: 'blue', cls: 'bg-blue-50 text-blue-600' }, Infografis: { icon: Image, tone: 'teal', cls: 'bg-teal-50 text-teal-600' }, Lainnya: { icon: MoreHorizontal, tone: 'green', cls: 'bg-emerald-50 text-emerald-600' },
};
const SUBJECTS = ['Matematika', 'Bahasa Inggris', 'IPA', 'Fisika', 'Bahasa Indonesia'];
const GRADES = ['1 SD', '2 SD', '3 SD', '4 SD', '5 SD', '6 SD', '7 SMP', '8 SMP', '9 SMP', '10 SMA', '11 SMA', '12 SMA'];
const MAX = 1000;

// Kerangka draf per jenis bahan ajar. Integrasi model AI belum tersambung, jadi draf disusun dari kerangka ini + instruksi tutor.
const OUTLINE: Record<string, string[]> = {
  Worksheet: ['Identitas & petunjuk pengerjaan', 'Bagian A – latihan dasar', 'Bagian B – latihan bertahap', 'Bagian C – soal cerita', 'Kunci jawaban'],
  Modul: ['Tujuan pembelajaran', 'Ringkasan konsep', 'Contoh soal & pembahasan', 'Latihan terbimbing', 'Refleksi'],
  'Quiz / Soal': ['10 soal pilihan ganda', 'Tingkat kesulitan bertahap', 'Kunci jawaban & pembahasan singkat'],
  Presentasi: ['Slide pembuka & apersepsi', 'Konsep inti', 'Contoh', 'Latihan bersama', 'Rangkuman'],
  'RPP / ATP': ['Capaian & tujuan pembelajaran', 'Langkah kegiatan (pembuka, inti, penutup)', 'Asesmen', 'Media & sumber belajar'],
  Infografis: ['Judul & pesan utama', '3–5 poin kunci', 'Ilustrasi pendukung', 'Ringkasan'],
  Lainnya: ['Tujuan', 'Isi utama', 'Penutup'],
};

export default function AiBahanAjar() {
  const [results, setResults] = useState(AI_RESULTS);
  const [prompt, setPrompt] = useState('');
  const [subject, setSubject] = useState('Matematika');
  const [grade, setGrade] = useState('2 SD');
  const [type, setType] = useState('Worksheet');
  const [mineOnly, setMineOnly] = useState(false);
  const [opened, setOpened] = useState<AiResult | null>(null);

  const generate = () => {
    const text = prompt.trim();
    if (!text) { toast.error('Tulis dulu bahan ajar yang ingin dibuat.'); return; }
    const title = `${type} ${text.length > 48 ? `${text.slice(0, 48)}…` : text}`;
    const item: AiResult = {
      id: `A${Date.now()}`, title, subject, grade: `Kelas ${grade}`, type, created: 'Dibuat baru saja',
      date: new Date().toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }), fav: false,
      body: `Instruksi: ${text}\n\nKerangka ${type} (${subject}, Kelas ${grade}):\n${OUTLINE[type].map((o, i) => `${i + 1}. ${o}`).join('\n')}`,
    };
    setResults((prev) => [item, ...prev]);
    setPrompt('');
    setOpened(item);
    toast.success('Draf kerangka dibuat', { description: 'Integrasi AI belum aktif — draf disusun dari kerangka standar.' });
  };

  const list = mineOnly ? results.filter((r) => r.fav) : results;

  return (
    <DashboardLayout>
      <div className="space-y-4 max-w-[1300px]">
        <PageHead title={<span className="flex items-center gap-2">AI Pembuat Bahan Ajar <Sparkles className="w-5 h-5 text-[#1D4ED8]" /></span>} subtitle="Buat bahan ajar berkualitas dengan AI, cepat dan mudah." />

        <Panel className="!py-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-slate-700 font-medium">
              <span className="flex items-center gap-2"><Clock className="w-5 h-5 text-[#1D4ED8]" /><b className="text-[#0F1E4A]">{results.length}</b> bahan ajar dibuat</span>
              <span className="flex items-center gap-2"><UserRound className="w-5 h-5 text-slate-600" /><b className="text-[#0F1E4A]">{results.filter((r) => r.fav).length}</b> favorit Anda</span>
            </p>
            <Btn variant={mineOnly ? 'soft' : 'ghost'} icon={History} onClick={() => setMineOnly((v) => !v)}>{mineOnly ? 'Tampilkan Semua' : 'Favorit Saya'}</Btn>
          </div>
        </Panel>

        <Panel className="!p-5">
          <h2 className="text-lg font-extrabold text-[#0F1E4A] mb-3">Apa yang ingin Anda buat?</h2>
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_380px] gap-5">
            <div className="relative rounded-xl border border-blue-200 bg-white p-3 focus-within:border-[#1D4ED8]">
              <div className="flex gap-2.5">
                <Sparkles className="w-5 h-5 text-[#1D4ED8] shrink-0 mt-0.5" />
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value.slice(0, MAX))}
                  rows={4}
                  aria-label="Instruksi bahan ajar"
                  placeholder="Contoh: Buat worksheet Matematika kelas 2 tentang penjumlahan dua bilangan hingga 100, 15 soal pilihan ganda, tingkat kesulitan bertahap."
                  className="flex-1 resize-none outline-none text-sm font-medium text-slate-800 placeholder:text-slate-400 bg-transparent"
                />
              </div>
              <div className="flex items-center justify-end gap-3 mt-1">
                <span className="text-xs text-slate-500 font-medium">{prompt.length}/{MAX}</span>
                <button aria-label="Buat" onClick={generate} className="w-9 h-9 rounded-lg bg-[#1D4ED8] hover:bg-blue-800 text-white flex items-center justify-center"><Send className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 content-start lg:pl-5 lg:border-l lg:border-slate-100">
              <label className="block"><span className="block text-[13px] font-bold text-slate-700 mb-1.5">Mata Pelajaran</span><Select value={subject} onChange={setSubject} options={SUBJECTS} /></label>
              <label className="block"><span className="block text-[13px] font-bold text-slate-700 mb-1.5">Kelas</span><Select value={grade} onChange={setGrade} options={GRADES} /></label>
            </div>
          </div>

          <p className="text-[13px] font-bold text-slate-700 mt-4 mb-2">Jenis Bahan Ajar</p>
          <div className="flex flex-wrap items-center gap-2">
            {AI_TYPES.map((t) => {
              const Icon = TYPE_META[t].icon;
              return (
                <button key={t} onClick={() => setType(t)} aria-pressed={type === t} className={cn('h-10 px-3.5 rounded-lg border text-[13px] font-bold flex items-center gap-2 transition-colors', type === t ? 'border-[#1D4ED8] bg-[#F4F8FF] text-[#1D4ED8]' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50')}>
                  <Icon className="w-4 h-4" /> {t}
                </button>
              );
            })}
            <Btn variant="primary" icon={Sparkles} onClick={generate} className="ml-auto !h-11 !px-5 !text-sm">Buat dengan AI</Btn>
          </div>
        </Panel>

        <Panel title={<span className="text-lg">Hasil Terbaru</span>} action={<button onClick={() => setMineOnly(false)} className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#1D4ED8] hover:underline">Lihat Semua <ArrowRight className="w-4 h-4" /></button>}>
          <ul className="divide-y divide-slate-100">
            {list.map((r) => {
              const meta = TYPE_META[r.type] ?? TYPE_META.Lainnya;
              return (
                <li key={r.id} className="flex flex-wrap sm:flex-nowrap items-center gap-3 py-3">
                  <span className={cn('w-11 h-11 rounded-xl flex items-center justify-center shrink-0', meta.cls)}><meta.icon className="w-5 h-5" /></span>
                  <div className="flex-1 min-w-[200px]">
                    <p className="flex items-center gap-2 text-[15px] font-extrabold text-[#0F1E4A]">
                      <span className="truncate">{r.title}</span>
                      <button aria-label={r.fav ? 'Hapus dari favorit' : 'Tambah ke favorit'} onClick={() => setResults((prev) => prev.map((x) => (x.id === r.id ? { ...x, fav: !x.fav } : x)))}><Star className={cn('w-4 h-4', r.fav ? 'fill-amber-400 text-amber-400' : 'text-slate-400')} /></button>
                    </p>
                    <p className="flex flex-wrap items-center gap-2 text-xs text-slate-600 font-medium mt-0.5">{r.subject} · {r.grade} <Badge tone={meta.tone}>{r.type}</Badge></p>
                  </div>
                  <div className="text-xs text-slate-600 font-medium w-[150px]"><p>{r.created}</p><p>{r.date}</p></div>
                  <div className="flex items-center gap-2">
                    <Btn onClick={() => setOpened(r)} className="w-[88px]">Buka</Btn>
                    <RowMenu items={[
                      { label: 'Salin Isi', onClick: () => { navigator.clipboard?.writeText(r.body); toast.success('Isi disalin'); } },
                      { label: 'Hapus', danger: true, onClick: () => { setResults((prev) => prev.filter((x) => x.id !== r.id)); toast.success('Bahan ajar dihapus'); } },
                    ]} />
                  </div>
                </li>
              );
            })}
            {list.length === 0 && <li className="py-8 text-center text-sm text-slate-500 font-medium">Belum ada bahan ajar favorit.</li>}
          </ul>
        </Panel>

        <p className="flex items-center gap-2 rounded-xl border border-blue-100 bg-[#F4F8FF] px-4 py-2.5 text-[13px] text-slate-700 font-medium">
          <Info className="w-4 h-4 text-[#1D4ED8] shrink-0" /> Hasil AI dapat Anda edit, sesuaikan, dan bagikan. Pastikan selalu meninjau sebelum digunakan.
        </p>

        <Modal open={!!opened} title={opened?.title ?? ''} wide onClose={() => setOpened(null)} footer={<>
          <Btn onClick={() => { navigator.clipboard?.writeText(opened!.body); toast.success('Isi disalin'); }}>Salin</Btn>
          <Btn variant="ghost" onClick={() => setOpened(null)}>Tutup</Btn>
        </>}>
          {opened && (
            <>
              <p className="flex flex-wrap items-center gap-2 text-xs text-slate-600 font-medium mb-3">{opened.subject} · {opened.grade} <Badge tone={(TYPE_META[opened.type] ?? TYPE_META.Lainnya).tone}>{opened.type}</Badge> · {opened.date}</p>
              <pre className="whitespace-pre-wrap rounded-xl bg-slate-50 border border-slate-100 p-4 text-[13px] text-slate-800 font-medium leading-relaxed" style={{ fontFamily: 'inherit' }}>{opened.body}</pre>
            </>
          )}
        </Modal>
      </div>
    </DashboardLayout>
  );
}
