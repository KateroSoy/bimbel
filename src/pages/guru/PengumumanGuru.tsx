import { useState } from 'react';
import { Megaphone, CalendarDays, ChevronRight, ChevronDown, MessageSquareText, BookOpen, ClipboardList, Plus, type LucideIcon } from 'lucide-react';
import { toast } from 'sonner';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { PageHead, Tabs, SearchInput, Select, Panel, Badge, Btn, Modal, FormDialog, TONE_HEX, type Tone } from '../../components/portal/Kit';
import { ANNOUNCEMENTS, TUTOR, type AnnouncementRow } from '../../data/guruPortal';

const CATEGORIES: AnnouncementRow['category'][] = ['Pengumuman', 'Kegiatan Sekolah', 'Informasi', 'Agenda', 'Tugas'];
const CATEGORY: Record<string, { icon: LucideIcon; tone: Tone }> = {
  Pengumuman: { icon: CalendarDays, tone: 'red' }, 'Kegiatan Sekolah': { icon: MessageSquareText, tone: 'green' }, Informasi: { icon: BookOpen, tone: 'purple' },
  Agenda: { icon: CalendarDays, tone: 'orange' }, Tugas: { icon: ClipboardList, tone: 'blue' },
};
const PAGE = 5;

export default function PengumumanGuru() {
  const [items, setItems] = useState(ANNOUNCEMENTS);
  const [tab, setTab] = useState('Semua');
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('Terbaru');
  const [limit, setLimit] = useState(PAGE);
  const [opened, setOpened] = useState<AnnouncementRow | null>(null);
  const [adding, setAdding] = useState(false);

  const unread = items.filter((a) => a.unread).length;
  const agenda = items.filter((a) => a.category === 'Agenda').length;
  const filtered = items.filter((a) =>
    (tab === 'Semua' || (tab === 'Belum Dibaca' ? a.unread : a.category === 'Agenda')) && (!q || `${a.title} ${a.body}`.toLowerCase().includes(q.toLowerCase())) && (!category || a.category === category));
  const sorted = sort === 'Terbaru' ? filtered : [...filtered].reverse();
  const open = (a: AnnouncementRow) => { setOpened(a); setItems((prev) => prev.map((x) => (x.id === a.id ? { ...x, unread: false } : x))); };

  return (
    <DashboardLayout>
      <div className="space-y-4 max-w-[1300px]">
        <PageHead
          title={<span className="flex items-center gap-2">Pengumuman <Megaphone className="w-5 h-5 text-[#1D4ED8]" /></span>}
          subtitle="Informasi terbaru dari StudyHack Education Center untuk Anda."
          actions={<Btn variant="primary" icon={Plus} onClick={() => setAdding(true)}>Buat Pengumuman Kelas</Btn>}
        />
        <div className="inline-flex flex-wrap items-center gap-x-6 gap-y-2 rounded-xl border border-blue-100 bg-[#F4F8FF] px-5 py-3 text-sm font-medium text-slate-700">
          <span className="flex items-center gap-2.5"><span className="w-3 h-3 rounded-full bg-[#1D4ED8]" /><b className="text-[#0F1E4A]">{unread}</b> pengumuman belum dibaca</span>
          <span className="flex items-center gap-2.5 sm:pl-6 sm:border-l sm:border-blue-100"><CalendarDays className="w-4 h-4 text-orange-500" /><b className="text-[#0F1E4A]">{agenda}</b> agenda mendatang</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <SearchInput value={q} onChange={setQ} placeholder="Cari pengumuman..." />
          <Select value={category} onChange={setCategory} all="Semua Kategori" options={CATEGORIES} className="w-48" />
          <Select value={sort} onChange={setSort} options={['Terbaru', 'Terlama']} className="w-36" />
        </div>
        <Tabs tabs={['Semua', { label: `Belum Dibaca (${unread})`, value: 'Belum Dibaca' }, { label: `Agenda (${agenda})`, value: 'Agenda' }]} value={tab} onChange={(t) => { setTab(t); setLimit(PAGE); }} />

        <Panel className="!py-1">
          <ul className="divide-y divide-slate-100">
            {sorted.slice(0, limit).map((a) => {
              const c = CATEGORY[a.category];
              return (
                <li key={a.id}>
                  <button onClick={() => open(a)} className="w-full flex items-center gap-4 py-4 text-left group">
                    <span className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${TONE_HEX[c.tone]}1A`, color: TONE_HEX[c.tone] }}><c.icon className="w-7 h-7" /></span>
                    <span className="flex-1 min-w-0">
                      <span className="flex flex-wrap items-center gap-2">
                        {a.unread && <span className="w-2.5 h-2.5 rounded-full bg-[#1D4ED8]" title="Belum dibaca" />}
                        <span className="text-base font-extrabold text-[#0F1E4A]">{a.title}</span>
                        {a.important && <Badge tone="red">Penting</Badge>}
                      </span>
                      <span className="block text-[13px] text-slate-600 font-medium mt-0.5 line-clamp-2">{a.body}</span>
                      <span className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-medium mt-1.5">{a.date} · {a.author} · <Badge tone={c.tone}>{a.category}</Badge></span>
                    </span>
                    <ChevronRight className="w-5 h-5 text-slate-700 group-hover:translate-x-0.5 transition-transform shrink-0" />
                  </button>
                </li>
              );
            })}
            {sorted.length === 0 && <li className="py-10 text-center text-sm text-slate-500 font-medium">Tidak ada pengumuman.</li>}
          </ul>
        </Panel>
        {sorted.length > limit && (
          <div className="flex justify-center"><Btn onClick={() => setLimit((l) => l + PAGE)}>Muat lebih banyak <ChevronDown className="w-4 h-4" /></Btn></div>
        )}

        <Modal open={!!opened} title={opened?.title ?? ''} onClose={() => setOpened(null)} footer={<Btn variant="ghost" onClick={() => setOpened(null)}>Tutup</Btn>}>
          {opened && (
            <>
              <p className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-medium mb-3">{opened.date} · {opened.author} · <Badge tone={CATEGORY[opened.category].tone}>{opened.category}</Badge></p>
              <p className="text-sm text-slate-700 font-medium leading-relaxed">{opened.body}</p>
            </>
          )}
        </Modal>
        <FormDialog
          open={adding}
          title="Buat Pengumuman Kelas"
          submitLabel="Terbitkan"
          fields={[{ key: 'title', label: 'Judul', required: true }, { key: 'category', label: 'Kategori', type: 'select', options: CATEGORIES }, { key: 'body', label: 'Isi Pengumuman', type: 'textarea', required: true }]}
          onClose={() => setAdding(false)}
          onSubmit={(v) => {
            const category = v.category as AnnouncementRow['category'];
            setItems((prev) => [{ id: `P${Date.now()}`, title: v.title, body: v.body, date: 'Hari ini', author: TUTOR.name.split(',')[0], category, unread: false, tone: CATEGORY[category].tone }, ...prev]);
            toast.success('Pengumuman diterbitkan');
          }}
        />
      </div>
    </DashboardLayout>
  );
}
