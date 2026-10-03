import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  User, Receipt, Wallet, CalendarDays, MessageCircle, GraduationCap, Users, BookOpen, CheckCheck, Settings, UserPlus,
  ClipboardCheck, Megaphone, Clock, Bell, ChevronRight, type LucideIcon,
} from 'lucide-react';
import { toast } from 'sonner';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { PageHead, Panel, Badge, Select, Donut, QuickList, InfoBox, Pagination, soon, TONE_HEX, WithRail } from '../../components/portal/Kit';
import { type AdminNotif } from '../../data/adminPortal';
import { useResource } from '../../store/useRemote';
import { cn } from '../../lib/utils';

const CATEGORY_ICON: Record<string, LucideIcon> = {
  Siswa: User, Keuangan: Receipt, 'Tutor & Staff': Users, 'Kelas & Jadwal': CalendarDays, Komunikasi: MessageCircle, Sistem: GraduationCap, Operasional: BookOpen,
};
const CATEGORY_COLOR: Record<string, string> = {
  Siswa: '#EF4444', Keuangan: '#F97316', 'Tutor & Staff': '#F59E0B', 'Kelas & Jadwal': '#7C3AED', Komunikasi: '#10B981', Sistem: '#1D4ED8', Operasional: '#94A3B8',
};
const CATEGORIES = Object.keys(CATEGORY_ICON);
const FILTERS = ['Siswa', 'Keuangan', 'Tutor & Staff', 'Kelas & Jadwal', 'Sistem'];

export default function NotifikasiAdmin() {
  const remote = useResource<AdminNotif>('admin-notifications');
  const items = remote.rows;
  const [filter, setFilter] = useState('Semua');
  const [sort, setSort] = useState('Terbaru');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const unread = items.filter((n) => n.unread).length;
  const filtered = items.filter((n) => filter === 'Semua' || (filter === 'Belum Dibaca' ? n.unread : n.category === filter));
  const sorted = sort === 'Terbaru' ? filtered : [...filtered].reverse();
  const pages = Math.max(1, Math.ceil(sorted.length / perPage));
  const current = Math.min(page, pages);
  const visible = sorted.slice((current - 1) * perPage, current * perPage);
  const read = (id: string) => { if (items.find((n) => n.id === id)?.unread) void remote.update(id, { unread: false }); };

  const chips = [
    { label: 'Semua', count: items.length }, { label: 'Belum Dibaca', count: unread },
    ...FILTERS.map((c) => ({ label: c, count: items.filter((n) => n.category === c).length })),
  ];

  return (
    <DashboardLayout>
      <div className="space-y-4 max-w-[1500px]">
        <PageHead title="Notifikasi" subtitle="Semua informasi penting dan update terbaru dari sistem bimbel Anda." />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {chips.map((c) => (
              <button
                key={c.label}
                onClick={() => { setFilter(c.label); setPage(1); }}
                className={cn('h-9 px-3 rounded-lg border text-[13px] font-bold flex items-center gap-2 transition-colors', filter === c.label ? 'bg-[#EAF1FF] border-[#1D4ED8] text-[#1D4ED8]' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50')}
              >
                {c.label}
                <span className={cn('px-1.5 rounded-full text-[10px]', c.label === 'Belum Dibaca' && c.count > 0 ? 'bg-red-500 text-white' : filter === c.label ? 'bg-[#1D4ED8] text-white' : 'bg-slate-100 text-slate-600')}>{c.count}</span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4 text-[13px] font-bold text-slate-700">
            <button onClick={async () => { await Promise.all(items.filter((n) => n.unread).map((n) => remote.update(n.id, { unread: false }))); toast.success('Semua notifikasi ditandai dibaca'); }} className="flex items-center gap-1.5 hover:text-[#1D4ED8]"><CheckCheck className="w-4 h-4" /> Tandai semua dibaca</button>
            <button onClick={() => soon('Pengaturan Notifikasi')} className="flex items-center gap-1.5 hover:text-[#1D4ED8]"><Settings className="w-4 h-4" /> Pengaturan Notifikasi</button>
          </div>
        </div>

        <WithRail
          rail={<>
            <Panel title="Ringkasan Notifikasi">
              <div className="flex items-center gap-4">
                <Donut data={CATEGORIES.map((c) => ({ label: c, value: items.filter((n) => n.category === c).length, color: CATEGORY_COLOR[c] }))} center={items.length} sub="Total" />
                <ul className="flex-1 space-y-1.5">
                  {CATEGORIES.map((c) => (
                    <li key={c} className="flex items-center gap-2 text-xs font-bold text-slate-700">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CATEGORY_COLOR[c] }} />
                      <span className="flex-1">{c}</span><span>{items.filter((n) => n.category === c).length}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3">
                <div className="rounded-xl border border-slate-100 p-3"><p className="text-xs text-slate-500 font-semibold">Belum Dibaca</p><p className="text-lg font-extrabold text-red-600">{unread}</p></div>
                <div className="rounded-xl border border-slate-100 p-3"><p className="text-xs text-slate-500 font-semibold">Sudah Dibaca</p><p className="text-lg font-extrabold text-emerald-600">{items.length - unread}</p></div>
              </div>
            </Panel>
            <QuickList items={[
              { label: 'Lihat Pendaftaran Baru', icon: UserPlus, tone: 'red', to: '/admin/pendaftaran' },
              { label: 'Lihat Tagihan Belum Lunas', icon: Wallet, tone: 'orange', to: '/admin/piutang' },
              { label: 'Periksa Absensi Tutor', icon: ClipboardCheck, tone: 'amber', to: '/admin/kehadiran-tutor' },
              { label: 'Buka WhatsApp Wali Murid', icon: MessageCircle, tone: 'green', to: '/admin/whatsapp' },
              { label: 'Buat Pengumuman / Broadcast', icon: Megaphone, tone: 'blue', to: '/admin/pengumuman' },
            ]} />
            <Panel title="Pengaturan Notifikasi">
              {[
                { icon: Settings, title: 'Preferensi Notifikasi', sub: 'Atur jenis dan cara notifikasi' },
                { icon: Clock, title: 'Jadwal Ringkasan', sub: 'Atur ringkasan notifikasi harian' },
                { icon: Bell, title: 'Saluran Notifikasi', sub: 'Email, WhatsApp, In-App' },
              ].map((s) => (
                <button key={s.title} onClick={() => soon(s.title)} className="w-full flex items-center gap-3 py-2 text-left border-b border-slate-100 last:border-0">
                  <s.icon className="w-5 h-5 text-[#1D4ED8] shrink-0" />
                  <span className="flex-1"><span className="block text-[13px] font-bold text-[#0F1E4A]">{s.title}</span><span className="block text-[11px] text-slate-500 font-medium">{s.sub}</span></span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              ))}
            </Panel>
          </>}
        >
          <Panel title="Daftar Notifikasi" action={<Select value={sort} onChange={setSort} options={['Terbaru', 'Terlama']} className="w-[120px]" />} className="!p-0 [&>div:first-child]:px-4 [&>div:first-child]:pt-4">
            <ul className="px-4 space-y-2">
              {visible.map((n) => {
                const Icon = CATEGORY_ICON[n.category] ?? Bell;
                return (
                  <li key={n.id} onClick={() => read(n.id)} className={cn('flex flex-wrap sm:flex-nowrap items-center gap-3 rounded-xl border p-3 cursor-pointer transition-colors', n.unread ? 'border-slate-200 bg-white' : 'border-slate-100 bg-slate-50/60')}>
                    <span className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0" style={{ backgroundColor: TONE_HEX[n.tone] }}><Icon className="w-5 h-5" /></span>
                    <div className="flex-1 min-w-[200px]">
                      <p className="text-[10px] font-extrabold uppercase tracking-wide" style={{ color: TONE_HEX[n.tone] }}>{n.category}</p>
                      <p className="text-sm font-extrabold text-[#0F1E4A]">{n.title}</p>
                      <p className="text-xs text-slate-600 font-medium">{n.desc}</p>
                    </div>
                    <span className="text-xs text-slate-500 font-medium w-[120px] shrink-0">{n.time}</span>
                    <span className="w-[140px] shrink-0 flex justify-end">
                      {n.action && n.to && <Link to={n.to} onClick={() => read(n.id)}><Badge tone={n.tone} className="py-1.5 px-2.5 hover:opacity-80">{n.action}</Badge></Link>}
                    </span>
                    <span className={cn('w-2 h-2 rounded-full shrink-0', n.unread ? 'bg-[#1D4ED8]' : 'bg-slate-300')} title={n.unread ? 'Belum dibaca' : 'Sudah dibaca'} />
                  </li>
                );
              })}
              {visible.length === 0 && <li className="py-10 text-center text-sm text-slate-500 font-medium">Tidak ada notifikasi pada kategori ini.</li>}
            </ul>
            <div className="mt-3"><Pagination page={current} pages={pages} onPage={setPage} perPage={perPage} onPerPage={(n) => { setPerPage(n); setPage(1); }} total={sorted.length} unit="notifikasi" /></div>
          </Panel>
          <InfoBox items={['Notifikasi ini hanya untuk keperluan manajemen bimbel. Data pembelajaran siswa, materi, tugas, dan nilai dikelola oleh guru.']} />
        </WithRail>
      </div>
    </DashboardLayout>
  );
}
