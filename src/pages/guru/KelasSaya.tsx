import { useState } from 'react';
import {
  Users, BookOpen, Plus, CalendarDays, Play, Video, School, Clock, MapPin, Info, ArrowRight, LayoutGrid, List, Settings2, type LucideIcon,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { PageHead, Tabs, SearchInput, Select, DataTable, Btn, RowMenu, FormDialog, Panel, Badge, TONE_HEX, type Col } from '../../components/portal/Kit';
import { TEACH_SLOTS, sessionStatus, type TeachRow, type TutorClass } from '../../data/guruPortal';
import { currentWeek, todayIndex } from '../../data/adminPortal';
import { useResource } from '../../store/useRemote';
import { findClass, modeOf, openClass, type ClassMode } from '../../lib/tutorClass';
import { cn } from '../../lib/utils';

const DAY_NAMES = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
const SORTS = ['Urutkan: Nama A-Z', 'Urutkan: Siswa Terbanyak'];

/** Form "Ajukan Perubahan": tutor tidak mengubah jadwal/ruang/daftar siswa langsung, permintaan ditinjau Admin */
export function RequestChangeDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const classes = useResource<TutorClass>('tutor-classes').rows;
  const requests = useResource<{ id: string; kelas: string; type: string; detail: string; status: string }>('change-requests');
  return (
    <FormDialog
      open={open}
      title="Ajukan Perubahan"
      submitLabel="Kirim ke Admin"
      fields={[
        { key: 'kelas', label: 'Kelas', type: 'select', options: classes.map((c) => c.name) },
        { key: 'type', label: 'Jenis Perubahan', type: 'select', options: ['Jadwal', 'Ruang', 'Daftar Siswa', 'Materi / Topik', 'Lainnya'] },
        { key: 'detail', label: 'Detail Permintaan', type: 'textarea', required: true, placeholder: 'Jelaskan perubahan yang diajukan...' },
      ]}
      onClose={onClose}
      onSubmit={async (v) => { if (await requests.create({ kelas: v.kelas, type: v.type, detail: v.detail, status: 'Menunggu' })) toast.success('Permintaan dikirim ke Admin', { description: `${v.type} · ${v.kelas}` }); }}
    />
  );
}

export function RequestChangeBanner({ title, text, onClick }: { title?: string; text: string; onClick: () => void }) {
  return (
    <div className="rounded-2xl border border-blue-100 bg-[#F4F8FF] px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3">
      <Info className="w-6 h-6 text-[#1D4ED8] shrink-0" />
      <div className="flex-1">
        {title && <p className="text-sm font-extrabold text-[#0F1E4A]">{title}</p>}
        <p className="text-[13px] text-slate-600 font-medium">{text}</p>
      </div>
      <Btn onClick={onClick}>Ajukan Perubahan <ArrowRight className="w-4 h-4" /></Btn>
    </div>
  );
}

export function ModeBadge({ mode }: { mode: ClassMode }) {
  const online = mode === 'Online';
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10.5px] font-extrabold border whitespace-nowrap',
      online ? 'bg-sky-50 text-sky-700 border-sky-200' : 'bg-amber-50 text-amber-700 border-amber-200')}>
      {online ? <Video className="w-3 h-3" /> : <School className="w-3 h-3" />} {mode}
    </span>
  );
}

type Entry = TeachRow & { cls?: TutorClass; mode: ClassMode; time: string };

export default function KelasSaya() {
  const navigate = useNavigate();
  const classRes = useResource<TutorClass>('tutor-classes');
  const CLASSES = classRes.rows;
  const sessions = useResource<TeachRow>('teach-sessions').rows;
  const [view, setView] = useState<'Jadwal Mingguan' | 'Daftar Kelas'>('Jadwal Mingguan');
  const [dayFilter, setDayFilter] = useState('Semua Hari');
  const [tab, setTab] = useState('Aktif');
  const [q, setQ] = useState('');
  const [subject, setSubject] = useState('');
  const [sort, setSort] = useState(SORTS[0]);
  const [requesting, setRequesting] = useState(false);
  const [editing, setEditing] = useState<TutorClass | null>(null);

  const week = currentWeek();
  const today = todayIndex();
  const entries: Entry[] = sessions
    .filter((s) => TEACH_SLOTS[s.slot])
    .map((s) => {
      const cls = findClass(s.kelas, CLASSES);
      return { ...s, cls, mode: modeOf(cls, s.room), time: TEACH_SLOTS[s.slot] };
    })
    .sort((a, b) => a.day - b.day || a.slot - b.slot);
  const todayEntries = entries.filter((e) => e.day === today);
  const next = todayEntries.find((e) => sessionStatus(e.time) !== 'Selesai');
  const active = CLASSES.filter((c) => c.status === 'Aktif');
  const count = (s: TutorClass['status']) => CLASSES.filter((c) => c.status === s).length;
  const visibleDays = DAY_NAMES.map((name, i) => ({ name, i, date: week[i]?.date ?? '' })).filter((d) => dayFilter === 'Semua Hari' || d.name === dayFilter);
  const rows = CLASSES
    .filter((c) => c.status === tab && (!q || `${c.name} ${c.code}`.toLowerCase().includes(q.toLowerCase())) && (!subject || c.subject === subject))
    .sort((a, b) => (sort === SORTS[0] ? a.name.localeCompare(b.name) : b.students - a.students));

  const OpenBtn = ({ cls, room, size = 'sm' }: { cls?: TutorClass; room?: string; size?: 'sm' | 'md' }) => {
    const online = modeOf(cls, room) === 'Online';
    return (
      <Btn size={size} variant="primary" icon={online ? Video : Play} onClick={() => openClass(cls, navigate, room)}>
        {online ? 'Buka Meet' : 'Buka Kelas'}
      </Btn>
    );
  };

  const columns: Col<TutorClass>[] = [
    {
      header: 'Kelas',
      cell: (c) => (
        <div className="flex items-center gap-3 py-1">
          <span className="w-11 h-11 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${TONE_HEX[c.tone]}1A`, color: TONE_HEX[c.tone] }}><BookOpen className="w-5 h-5" /></span>
          <div><p className="text-[15px] font-extrabold text-[#0F1E4A]">{c.name}</p><p className="text-xs text-slate-500 font-medium">{c.code}</p></div>
        </div>
      ),
    },
    { header: 'Mata Pelajaran', cell: (c) => c.subject },
    { header: 'Jadwal', cell: (c) => <span className="flex items-center gap-2 whitespace-nowrap"><CalendarDays className="w-4 h-4 text-slate-500" /><span><b className="text-[#0F1E4A]">{c.days}</b><br />{c.time}</span></span> },
    { header: 'Tatap Muka / Online', cell: (c) => <span className="flex flex-col items-start gap-0.5"><ModeBadge mode={modeOf(c)} /><span className="text-[11px] text-slate-500">{modeOf(c) === 'Online' ? (c.meetUrl ? 'Link Meet tersedia' : 'Link Meet belum diatur') : c.room || '-'}</span></span> },
    { header: 'Siswa', cell: (c) => <span className="flex items-center gap-2 whitespace-nowrap"><Users className="w-4 h-4 text-slate-500" /> {c.students} siswa</span> },
    { header: 'Status', cell: (c) => <Badge>{c.status}</Badge> },
    {
      header: 'Aksi', align: 'center',
      cell: (c) => (
        <div className="inline-flex items-center gap-2">
          <OpenBtn cls={c} size="md" />
          <RowMenu items={[
            { label: 'Atur Tatap Muka / Online', onClick: () => setEditing(c) },
            { label: 'Detail Kelas', onClick: () => navigate(`/guru/kelas/${c.id}`) },
            { label: 'Presensi Kelas', onClick: () => navigate(`/guru/absensi?kelas=${encodeURIComponent(c.id)}`) },
            { label: 'Ajukan Perubahan', onClick: () => setRequesting(true) },
          ]} />
        </div>
      ),
    },
  ];

  const stat = (icon: LucideIcon, value: number, label: string, color: string) => {
    const Icon = icon;
    return <span key={label} className="flex items-center gap-2.5 text-sm font-semibold text-slate-700"><span className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}1A`, color }}><Icon className="w-5 h-5" /></span><b className="text-lg font-extrabold text-[#0F1E4A]">{value}</b> {label}</span>;
  };

  return (
    <DashboardLayout>
      <div className="space-y-3 max-w-[1400px]">
        <PageHead title="Jadwal Mengajar" subtitle="Jadwal kelas yang Anda ajar minggu ini. Tatap Muka → presensi di kelas, Online → Google Meet." actions={<Btn variant="primary" icon={Plus} onClick={() => setRequesting(true)}>Ajukan Perubahan</Btn>} />

        <div className="rounded-2xl bg-[#F4F8FF] border border-blue-100 px-5 py-3 flex flex-wrap items-center gap-x-8 gap-y-2">
          {stat(CalendarDays, entries.length, 'sesi minggu ini', '#1D4ED8')}
          {stat(Users, active.length, 'kelas aktif', '#16A34A')}
          {stat(BookOpen, active.reduce((a, c) => a + c.students, 0), 'siswa', '#7C3AED')}
          {stat(School, entries.filter((e) => e.mode === 'Tatap Muka').length, 'sesi tatap muka', '#D97706')}
          {stat(Video, entries.filter((e) => e.mode === 'Online').length, 'sesi online', '#0284C7')}
        </div>

        {next && (
          <Panel className="!py-3 bg-[#F5F8FF] border-blue-100">
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="flex items-center gap-2 text-sm font-extrabold text-[#1D4ED8]">Kelas Berikutnya Hari Ini <Badge tone={sessionStatus(next.time) === 'Berlangsung' ? 'green' : 'orange'}>{sessionStatus(next.time)}</Badge> <ModeBadge mode={next.mode} /></p>
                <p className="text-base font-extrabold text-[#0F1E4A]">{next.subject} · {next.kelas}</p>
                <p className="text-sm text-slate-600 font-medium flex flex-wrap gap-x-4"><span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {next.time}</span><span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {next.mode === 'Online' ? 'Google Meet' : next.room}</span></p>
              </div>
              <OpenBtn cls={next.cls} room={next.room} size="md" />
            </div>
          </Panel>
        )}

        <div className="flex flex-wrap items-center gap-2">
          {(['Jadwal Mingguan', 'Daftar Kelas'] as const).map((v) => (
            <button key={v} onClick={() => setView(v)} className={cn('h-9 px-4 rounded-lg border text-[13px] font-bold flex items-center gap-2', view === v ? 'bg-[#1D4ED8] border-[#1D4ED8] text-white' : 'bg-white border-slate-200 text-slate-700')}>
              {v === 'Jadwal Mingguan' ? <LayoutGrid className="w-4 h-4" /> : <List className="w-4 h-4" />} {v}
            </button>
          ))}
          {view === 'Jadwal Mingguan' && <span className="w-px h-6 bg-slate-200 mx-1" />}
          {view === 'Jadwal Mingguan' && ['Semua Hari', ...DAY_NAMES.slice(0, 6)].map((d) => (
            <button key={d} onClick={() => setDayFilter(d)} className={cn('h-8 px-3 rounded-lg border text-[12.5px] font-bold', dayFilter === d ? 'bg-[#EAF1FF] border-[#1D4ED8] text-[#1D4ED8]' : 'bg-white border-slate-200 text-slate-700')}>{d}</button>
          ))}
        </div>

        {view === 'Jadwal Mingguan' ? (
          <div className={cn('grid gap-2.5', visibleDays.length > 1 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-7' : 'grid-cols-1 max-w-md')}>
            {visibleDays.map((d) => {
              const list = entries.filter((e) => e.day === d.i);
              const isToday = d.i === today;
              return (
                <div key={d.name} className={cn('bg-white rounded-2xl border p-2.5 flex flex-col min-h-[150px]', isToday ? 'border-[#1D4ED8] ring-1 ring-[#1D4ED8]/30 bg-[#F8FAFF]' : 'border-slate-200/80')}>
                  <div className="flex items-start justify-between pb-1.5 mb-1.5 border-b border-slate-100">
                    <div><p className={cn('font-extrabold', isToday ? 'text-[#1D4ED8]' : 'text-[#0F1E4A]')}>{d.name}</p><p className="text-xs text-slate-500 font-medium">{d.date}</p></div>
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 rounded px-1.5 py-0.5">{list.length} sesi</span>
                  </div>
                  {list.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-400"><CalendarDays className="w-7 h-7 mb-1.5" /><p className="text-xs font-medium">Tidak ada jadwal.</p></div>
                  ) : (
                    <div className="space-y-2.5">
                      {list.map((e) => (
                        <div key={e.id} className="space-y-0.5 text-[11.5px] text-slate-600 font-medium">
                          <p className="flex items-center gap-1.5 font-bold text-[#0F1E4A]"><BookOpen className="w-3.5 h-3.5 shrink-0" style={{ color: TONE_HEX[e.cls?.tone ?? 'blue'] }} /> {e.subject}</p>
                          <p className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 shrink-0" /> {e.kelas}</p>
                          <p className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 shrink-0" /> {e.time}</p>
                          <p className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 shrink-0" /> <span className="truncate">{e.mode === 'Online' ? 'Google Meet' : e.room}</span></p>
                          <div className="flex flex-wrap items-center gap-1 pt-0.5">
                            <ModeBadge mode={e.mode} />
                            {isToday && <Badge tone={sessionStatus(e.time) === 'Berlangsung' ? 'green' : sessionStatus(e.time) === 'Selesai' ? 'slate' : 'orange'}>{sessionStatus(e.time)}</Badge>}
                          </div>
                          <button onClick={() => openClass(e.cls, navigate, e.room)} className="mt-1 w-full h-7 rounded-md bg-[#1D4ED8] hover:bg-blue-800 text-white text-[11px] font-bold inline-flex items-center justify-center gap-1">
                            {e.mode === 'Online' ? <><Video className="w-3 h-3" /> Buka Meet</> : <><Play className="w-3 h-3" /> Buka Kelas</>}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <>
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3">
              <Tabs className="flex-1" tabs={[{ label: `Aktif (${count('Aktif')})`, value: 'Aktif' }, 'Akan Datang', 'Selesai']} value={tab} onChange={setTab} />
              <div className="flex flex-wrap items-center gap-2">
                <SearchInput value={q} onChange={setQ} placeholder="Cari kelas..." className="!flex-none w-56" />
                <Select value={subject} onChange={setSubject} all="Semua Program" options={[...new Set(CLASSES.map((c) => c.subject))]} />
                <Select value={sort} onChange={setSort} options={SORTS} />
              </div>
            </div>
            <DataTable columns={columns} rows={rows} rowKey={(c) => c.id} unit="kelas" empty={`Belum ada kelas ${tab.toLowerCase()}.`} />
          </>
        )}

        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-2 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[12.5px] font-medium text-slate-600">
          <Info className="w-4 h-4 text-[#1D4ED8]" />
          <span className="flex items-center gap-1.5"><ModeBadge mode="Tatap Muka" /> Buka Kelas → langsung ke presensi</span>
          <span className="flex items-center gap-1.5"><ModeBadge mode="Online" /> Buka Meet → langsung live di Google Meet, tanpa presensi</span>
          <button onClick={() => setRequesting(true)} className="ml-auto text-[#1D4ED8] font-bold hover:underline flex items-center gap-1">Ajukan perubahan jadwal <ArrowRight className="w-3.5 h-3.5" /></button>
        </div>

        <FormDialog
          open={!!editing}
          title={`Atur Kelas · ${editing?.name ?? ''}`}
          fields={[
            { key: 'mode', label: 'Metode', type: 'select', options: ['Tatap Muka', 'Online'] },
            { key: 'room', label: 'Ruang (tatap muka)', placeholder: 'Studio Belajar 1' },
            { key: 'meetUrl', label: 'Link Google Meet (online)', placeholder: 'https://meet.google.com/…' },
          ]}
          initial={editing ? { mode: modeOf(editing), room: editing.room ?? '', meetUrl: editing.meetUrl ?? '' } : undefined}
          onClose={() => setEditing(null)}
          onSubmit={async (v) => {
            if (!editing) return;
            if (v.mode === 'Online' && v.meetUrl && !/^https:\/\/meet\.google\.com\//.test(v.meetUrl)) { toast.error('Link Meet harus diawali https://meet.google.com/'); return; }
            if (await classRes.update(editing.id, { mode: v.mode as ClassMode, room: v.room, meetUrl: v.meetUrl })) toast.success('Pengaturan kelas disimpan');
          }}
          submitLabel="Simpan"
        />
        <RequestChangeDialog open={requesting} onClose={() => setRequesting(false)} />
      </div>
    </DashboardLayout>
  );
}
