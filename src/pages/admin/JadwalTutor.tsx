import { useState } from 'react';
import { CalendarDays, UserCheck, BookOpen, DoorOpen, Clock, Settings, FileDown, Plus, Copy, LayoutTemplate, History } from 'lucide-react';
import { toast } from 'sonner';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import {
  PageHead, StatCards, FilterBar, Select, Btn, InfoBox, Panel, QuickList, WithRail, WeekGrid, Person, LinkAction, Modal, KeyValues, FormDialog,
  DataTable, exportCsv, soon, type Field, type Col,
} from '../../components/portal/Kit';
import { TIME_SLOTS, DAY_NAMES, currentWeek, weekLabel, todayIndex, toSession, staffAvatar, type ScheduleEntry } from '../../data/adminPortal';
import { useResource } from '../../store/useRemote';
import { cn } from '../../lib/utils';

const uniq = (list: string[]) => [...new Set(list)].sort();

export const scheduleFields = (entries: ScheduleEntry[]): Field[] => [
  { key: 'kelas', label: 'Kelas / Rombel', required: true, placeholder: 'English Primary 1A' },
  entries.length ? { key: 'tutor', label: 'Tutor', type: 'select', options: uniq(entries.map((e) => e.tutor)) } : { key: 'tutor', label: 'Tutor', required: true },
  { key: 'room', label: 'Ruang', type: 'select', options: ['Ruang 1', 'Ruang 2', 'Ruang 3', 'Ruang 4', 'Ruang 5'] },
  { key: 'day', label: 'Hari', type: 'select', options: DAY_NAMES },
  { key: 'slot', label: 'Jam', type: 'select', options: TIME_SLOTS },
  { key: 'fill', label: 'Terisi / Kapasitas', placeholder: '8/10' },
];

/** Nilai form → payload jadwal. Bentrok tutor / ruang pada hari + jam yang sama ditolak oleh server. */
export const scheduleInput = (v: Record<string, string>): Partial<ScheduleEntry> => ({
  day: DAY_NAMES.indexOf(v.day), slot: TIME_SLOTS.indexOf(v.slot), kelas: v.kelas, tutor: v.tutor, room: v.room, fill: v.fill || '0/10',
});

export default function JadwalTutor() {
  const schedule = useResource<ScheduleEntry>('schedules');
  const entries = schedule.rows;
  useResource('staff');
  const WEEK_DAYS = currentWeek();
  const [kelas, setKelas] = useState('');
  const [tutor, setTutor] = useState('');
  const [room, setRoom] = useState('');
  const [view, setView] = useState<'Mingguan' | 'Harian'>('Mingguan');
  const [selected, setSelected] = useState<ScheduleEntry | null>(null);
  const [adding, setAdding] = useState(false);

  const filtered = entries.filter((e) => (!kelas || e.kelas === kelas) && (!tutor || e.tutor === tutor) && (!room || e.room === room));
  const tutors = uniq(entries.map((e) => e.tutor)).map((name) => ({ name, sessions: entries.filter((e) => e.tutor === name).length })).sort((a, b) => b.sessions - a.sessions);
  const doExport = () => exportCsv('jadwal-tutor', ['Hari', 'Jam', 'Kelas', 'Tutor', 'Ruang'], filtered.map((e) => [DAY_NAMES[e.day], TIME_SLOTS[e.slot], e.kelas, e.tutor, e.room]));

  const dayColumns: Col<ScheduleEntry>[] = [
    { header: 'Hari', cell: (e) => DAY_NAMES[e.day] },
    { header: 'Jam', cell: (e) => <span className="whitespace-nowrap font-bold text-slate-800">{TIME_SLOTS[e.slot]}</span> },
    { header: 'Kelas', cell: (e) => e.kelas },
    { header: 'Tutor', cell: (e) => <Person name={e.tutor} src={staffAvatar(e.tutor)} /> },
    { header: 'Ruang', cell: (e) => e.room },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-4 max-w-[1500px]">
        <PageHead
          title="Jadwal Tutor"
          subtitle="Kelola dan atur jadwal mengajar tutor di semua program dan kelas."
          actions={<>
            <Btn icon={Settings} onClick={() => soon('Pengaturan Jadwal')}>Pengaturan Jadwal</Btn>
            <Btn icon={FileDown} className="!text-emerald-700" onClick={doExport}>Export Jadwal</Btn>
            <Btn variant="primary" icon={Plus} onClick={() => setAdding(true)}>Buat Jadwal Baru</Btn>
          </>}
        />
        <StatCards items={[
          { label: 'Total Jadwal', value: entries.length, sub: 'Sesi / Minggu', icon: CalendarDays, tone: 'blue' },
          { label: 'Tutor Aktif', value: tutors.length, sub: 'Orang', icon: UserCheck, tone: 'teal' },
          { label: 'Kelas Aktif', value: uniq(entries.map((e) => e.kelas)).length, sub: 'Kelas', icon: BookOpen, tone: 'purple' },
          { label: 'Ruang Terpakai', value: uniq(entries.map((e) => e.room)).length, sub: 'Ruang', icon: DoorOpen, tone: 'red' },
          { label: 'Jam Mengajar', value: entries.length * 1.5, sub: 'Jam / Minggu', icon: Clock, tone: 'blue' },
        ]} />

        <FilterBar onReset={() => { setKelas(''); setTutor(''); setRoom(''); }}>
          <Select value={kelas} onChange={setKelas} all="Semua Kelas" options={uniq(entries.map((e) => e.kelas))} />
          <Select value={tutor} onChange={setTutor} all="Semua Tutor" options={uniq(entries.map((e) => e.tutor))} />
          <Select value={room} onChange={setRoom} all="Semua Ruang" options={uniq(entries.map((e) => e.room))} />
          <span className="inline-flex items-center gap-2 h-10 px-3 rounded-lg border border-slate-200 bg-white text-[13px] font-bold text-slate-800"><CalendarDays className="w-4 h-4 text-slate-500" /> {weekLabel()}</span>
          <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5">
            {(['Mingguan', 'Harian'] as const).map((v) => (
              <button key={v} onClick={() => setView(v)} className={cn('h-9 px-3 rounded-md text-[13px] font-bold', view === v ? 'bg-[#EAF1FF] text-[#1D4ED8]' : 'text-slate-600')}>{v}</button>
            ))}
          </div>
        </FilterBar>

        <WithRail
          rail={<>
            <Panel title="Tutor" action={<LinkAction to="/admin/guru">Lihat Semua</LinkAction>}>
              <ul className="space-y-2.5">
                {tutors.slice(0, 5).map((t) => (
                  <li key={t.name}>
                    <button onClick={() => setTutor(tutor === t.name ? '' : t.name)} className={cn('w-full flex items-center justify-between gap-2 rounded-xl border p-2 text-left transition-colors', tutor === t.name ? 'border-[#1D4ED8] bg-[#F4F8FF]' : 'border-slate-100 hover:border-blue-200')}>
                      <Person name={t.name} sub={entries.find((e) => e.tutor === t.name)?.kelas.split(' ')[0]} src={staffAvatar(t.name)} />
                      <span className="text-[11px] font-bold text-slate-600 whitespace-nowrap">{t.sessions} sesi</span>
                    </button>
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex justify-between text-[13px] font-extrabold text-[#0F1E4A]"><span>Total Tutor Aktif</span><span>{tutors.length} orang</span></div>
            </Panel>
            <QuickList items={[
              { label: 'Buat Jadwal Baru', icon: Plus, onClick: () => setAdding(true) },
              { label: 'Salin Jadwal', icon: Copy },
              { label: 'Template Jadwal', icon: LayoutTemplate },
              { label: 'Riwayat Perubahan', icon: History },
            ]} />
            <InfoBox title="Informasi" items={['Klik pada blok jadwal untuk melihat detail', 'Pastikan tidak ada bentrok jadwal', 'Jadwal baru dicek otomatis terhadap bentrok tutor dan ruang']} />
          </>}
        >
          {view === 'Mingguan' ? (
            <Panel title="Kalender Jadwal Mengajar">
              <WeekGrid days={WEEK_DAYS} slots={TIME_SLOTS} today={todayIndex()} sessions={filtered.map((e) => toSession(e, 'tutor'))} onSelect={(s) => setSelected(entries.find((e) => e.id === s.id) ?? null)} />
            </Panel>
          ) : (
            <DataTable columns={dayColumns} rows={[...filtered].sort((a, b) => a.day - b.day || a.slot - b.slot)} rowKey={(e) => e.id} unit="sesi" />
          )}
          <InfoBox title="Catatan" items={['Pastikan beban mengajar tutor seimbang.', 'Hindari bentrok jadwal tutor dan ruang.', 'Gunakan fitur salin jadwal untuk efisiensi penjadwalan.']} />
        </WithRail>

        <Modal
          open={!!selected}
          title="Detail Jadwal"
          onClose={() => setSelected(null)}
          footer={<>
            <Btn variant="danger" onClick={async () => { const target = selected!; setSelected(null); if (await schedule.remove(target.id)) toast.success('Jadwal dihapus'); }}>Hapus Jadwal</Btn>
            <Btn variant="ghost" onClick={() => setSelected(null)}>Tutup</Btn>
          </>}
        >
          {selected && <KeyValues rows={[['Kelas', selected.kelas], ['Tutor', selected.tutor], ['Hari', `${WEEK_DAYS[selected.day].name}, ${WEEK_DAYS[selected.day].date}`], ['Jam', TIME_SLOTS[selected.slot]], ['Ruang', selected.room], ['Siswa', selected.fill]]} />}
        </Modal>
        <FormDialog open={adding} title="Buat Jadwal Baru" fields={scheduleFields(entries)} onClose={() => setAdding(false)} onSubmit={async (v) => { if (await schedule.create(scheduleInput(v))) toast.success('Jadwal berhasil dibuat'); }} />
      </div>
    </DashboardLayout>
  );
}
