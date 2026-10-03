import { useState } from 'react';
import { CalendarDays, BookOpen, Clock, Users, Building2, FileSpreadsheet, Plus, Copy, CalendarOff, Printer, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import {
  PageHead, StatCards, Tabs, FilterBar, Select, Btn, InfoBox, Panel, QuickList, WithRail, WeekGrid, DotLegend, Donut, MiniBars, Modal, KeyValues,
  FormDialog, DataTable, Badge, exportCsv, type Col,
} from '../../components/portal/Kit';
import { TIME_SLOTS, currentWeek, weekLabel, todayIndex, toSession, type ScheduleEntry } from '../../data/adminPortal';
import { scheduleInput, scheduleFields } from './JadwalTutor';
import { useResource } from '../../store/useRemote';
import { cn } from '../../lib/utils';

const uniq = (list: string[]) => [...new Set(list)].sort();
const SUBJECTS = [['English', '#1D4ED8'], ['Math', '#16A34A'], ['IPA', '#7C3AED'], ['Calistung', '#EC4899'], ['Lainnya', '#F59E0B']] as const;
const subjectOf = (kelas: string) => SUBJECTS.find(([s]) => kelas.startsWith(s))?.[0] ?? 'Lainnya';
/** Sel kalender bulan berjalan (grid Senin–Minggu); angka < 1 atau > jumlah hari = bulan tetangga. */
const monthCells = (now: Date) => {
  const offset = (new Date(now.getFullYear(), now.getMonth(), 1).getDay() + 6) % 7;
  const days = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const prevDays = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
  return Array.from({ length: Math.ceil((offset + days) / 7) * 7 }, (_, i) => {
    const d = i - offset + 1;
    return { key: i, inMonth: d >= 1 && d <= days, label: d < 1 ? prevDays + d : d > days ? d - days : d, today: d === now.getDate() };
  });
};

export default function JadwalKelas() {
  const schedule = useResource<ScheduleEntry>('schedules');
  const entries = schedule.rows;
  const now = new Date();
  const WEEK_DAYS = currentWeek(now);
  const TODAY = todayIndex(now);
  const [kelas, setKelas] = useState('');
  const [room, setRoom] = useState('');
  const [tutor, setTutor] = useState('');
  const [tab, setTab] = useState('Tampilan Mingguan');
  const [day, setDay] = useState(todayIndex());
  const [selected, setSelected] = useState<ScheduleEntry | null>(null);
  const [adding, setAdding] = useState(false);

  const filtered = entries.filter((e) => (!kelas || e.kelas === kelas) && (!room || e.room === room) && (!tutor || e.tutor === tutor));
  const todays = entries.filter((e) => e.day === TODAY).sort((a, b) => a.slot - b.slot);
  const hours = (list: ScheduleEntry[]) => list.length * 1.5;
  const fmt = (h: number) => `${Math.floor(h)}:${h % 1 ? '30' : '00'}`;
  const students = entries.reduce((a, e) => Math.max(a, 0) + Number(e.fill.split('/')[0]), 0);

  const dayCols: Col<ScheduleEntry>[] = [
    { header: 'Jam', cell: (e) => <span className="whitespace-nowrap font-bold text-slate-800">{TIME_SLOTS[e.slot]}</span> },
    { header: 'Kelas', cell: (e) => <span className="font-bold text-[#0F1E4A]">{e.kelas}</span> },
    { header: 'Tutor', cell: (e) => e.tutor },
    { header: 'Ruang', cell: (e) => e.room },
    { header: 'Siswa', cell: (e) => <Badge tone="blue">{e.fill}</Badge> },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-4 max-w-[1500px]">
        <PageHead
          title="Jadwal Kelas"
          subtitle="Kelola jadwal setiap kelas dan rombel pada semua hari."
          actions={<>
            <Btn icon={FileSpreadsheet} className="!text-emerald-700" onClick={() => exportCsv('jadwal-kelas', ['Hari', 'Jam', 'Kelas', 'Ruang', 'Tutor', 'Siswa'], filtered.map((e) => [WEEK_DAYS[e.day].name, TIME_SLOTS[e.slot], e.kelas, e.room, e.tutor, e.fill]))}>Export ke Excel</Btn>
            <Btn variant="primary" icon={Plus} onClick={() => setAdding(true)}>Buat Jadwal</Btn>
          </>}
        />
        <StatCards items={[
          { label: 'Total Kelas Aktif', value: uniq(entries.map((e) => e.kelas)).length, sub: 'Kelas', icon: CalendarDays, tone: 'blue' },
          { label: 'Total Sesi', value: entries.length, sub: 'Sesi / minggu', icon: BookOpen, tone: 'green' },
          { label: 'Total Jam Mengajar / Minggu', value: fmt(hours(entries)), sub: 'Jam', icon: Clock, tone: 'orange' },
          { label: 'Total Kehadiran Kursi', value: students, sub: 'Siswa-sesi / minggu', icon: Users, tone: 'purple' },
          { label: 'Total Ruang', value: uniq(entries.map((e) => e.room)).length, sub: 'Ruang', icon: Building2, tone: 'teal' },
        ]} />

        <WithRail
          rail={<>
            <Panel title="Kalender">
              <div className="flex items-center justify-between mb-2 text-[13px] font-extrabold text-[#0F1E4A]"><ChevronLeft className="w-4 h-4 text-slate-400" /> {now.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })} <ChevronRight className="w-4 h-4 text-slate-400" /></div>
              <div className="grid grid-cols-7 gap-y-1 text-center text-[11px]">
                {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map((d) => <span key={d} className="font-bold text-slate-500 py-1">{d}</span>)}
                {monthCells(now).map((c) => (
                  <span key={c.key} className={cn('mx-auto w-7 h-7 flex items-center justify-center rounded-full font-bold', c.inMonth && c.today ? 'bg-[#1D4ED8] text-white' : c.inMonth ? 'text-slate-800' : 'text-slate-300')}>{c.label}</span>
                ))}
              </div>
            </Panel>
            <Panel title="Kelas Aktif Hari Ini">
              <p className="text-xs font-bold text-slate-700 mb-2">{now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
              <ul className="space-y-1.5">
                {todays.length === 0 && <li className="text-xs text-slate-500 font-medium">Tidak ada kelas hari ini.</li>}
                {todays.map((e) => (
                  <li key={e.id} className="flex items-center justify-between gap-2 rounded-lg border border-slate-100 px-2.5 py-2 text-xs font-bold">
                    <span className="text-[#1D4ED8] truncate">{e.kelas}</span><span className="text-slate-700 whitespace-nowrap">{TIME_SLOTS[e.slot]}</span><span className="text-slate-500">{e.room.replace('Ruang ', 'R.')}</span>
                  </li>
                ))}
              </ul>
            </Panel>
            <QuickList items={[
              { label: 'Buat Jadwal Kelas Baru', icon: Plus, onClick: () => setAdding(true) },
              { label: 'Duplikasi Jadwal', icon: Copy },
              { label: 'Kelola Hari Libur', icon: CalendarOff },
              { label: 'Cetak Jadwal', icon: Printer, onClick: () => window.print() },
              { label: 'Laporan Jadwal Kelas', icon: FileText, to: '/admin/laporan-kelas' },
            ]} />
          </>}
        >
          <FilterBar onReset={() => { setKelas(''); setRoom(''); setTutor(''); }}>
            <Select value={kelas} onChange={setKelas} all="Semua Kelas" options={uniq(entries.map((e) => e.kelas))} />
            <Select value={room} onChange={setRoom} all="Semua Ruang" options={uniq(entries.map((e) => e.room))} />
            <Select value={tutor} onChange={setTutor} all="Semua Tutor" options={uniq(entries.map((e) => e.tutor))} />
            <span className="inline-flex items-center gap-2 h-10 px-3 rounded-lg border border-slate-200 bg-white text-[13px] font-bold text-slate-800"><CalendarDays className="w-4 h-4 text-slate-500" /> {weekLabel(now)}</span>
          </FilterBar>
          <Tabs tabs={['Tampilan Mingguan', 'Tampilan Harian']} value={tab} onChange={setTab} />

          {tab === 'Tampilan Mingguan' ? (
            <Panel>
              <WeekGrid days={WEEK_DAYS} slots={TIME_SLOTS} today={TODAY} sessions={filtered.map((e) => toSession(e, 'kelas'))} onSelect={(s) => setSelected(entries.find((e) => e.id === s.id) ?? null)} />
              <div className="mt-3"><DotLegend items={[...SUBJECTS.map(([label, color]) => ({ label, color })), { label: 'Persiapan / Lainnya', color: '#CBD5E1' }]} /></div>
            </Panel>
          ) : (
            <>
              <div className="flex flex-wrap gap-2">
                {WEEK_DAYS.map((d, i) => (
                  <button key={d.name} onClick={() => setDay(i)} className={cn('h-9 px-3 rounded-lg border text-[13px] font-bold', day === i ? 'bg-[#1D4ED8] border-[#1D4ED8] text-white' : 'bg-white border-slate-200 text-slate-700')}>{d.name}, {d.date}</button>
                ))}
              </div>
              <DataTable columns={dayCols} rows={filtered.filter((e) => e.day === day).sort((a, b) => a.slot - b.slot)} rowKey={(e) => e.id} unit="sesi" empty="Tidak ada kelas pada hari ini." />
            </>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <InfoBox items={['Klik pada jadwal untuk melihat detail kelas.', 'Jadwal dapat berubah sewaktu-waktu.', 'Pastikan tidak ada bentrok jadwal kelas, tutor, dan ruang.']} />
            <Panel title="Ringkasan Jam Mengajar (per Minggu)">
              <div className="flex items-center gap-4">
                <ul className="flex-1 space-y-1.5">
                  {SUBJECTS.map(([s, color]) => (
                    <li key={s} className="flex items-center gap-2 text-xs font-bold text-slate-700">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} /><span className="flex-1">{s}</span><span>{fmt(hours(entries.filter((e) => subjectOf(e.kelas) === s)))} jam</span>
                    </li>
                  ))}
                </ul>
                <Donut size={104} thickness={18} center={fmt(hours(entries))} sub="Total Jam" data={SUBJECTS.map(([s, color]) => ({ label: s, color, value: entries.filter((e) => subjectOf(e.kelas) === s).length }))} />
              </div>
            </Panel>
            <Panel title="Jam Mengajar per Hari">
              <MiniBars height={70} data={WEEK_DAYS.map((d, i) => ({ label: d.name.slice(0, 3), value: hours(entries.filter((e) => e.day === i)), display: fmt(hours(entries.filter((e) => e.day === i))) }))} />
            </Panel>
          </div>
        </WithRail>

        <Modal
          open={!!selected}
          title="Detail Jadwal Kelas"
          onClose={() => setSelected(null)}
          footer={<>
            <Btn variant="danger" onClick={async () => { const target = selected!; setSelected(null); if (await schedule.remove(target.id)) toast.success('Jadwal dihapus'); }}>Hapus Jadwal</Btn>
            <Btn variant="ghost" onClick={() => setSelected(null)}>Tutup</Btn>
          </>}
        >
          {selected && <KeyValues rows={[['Kelas', selected.kelas], ['Hari', `${WEEK_DAYS[selected.day].name}, ${WEEK_DAYS[selected.day].date}`], ['Jam', TIME_SLOTS[selected.slot]], ['Ruang', selected.room], ['Tutor', selected.tutor], ['Siswa', selected.fill]]} />}
        </Modal>
        <FormDialog open={adding} title="Buat Jadwal Kelas" fields={scheduleFields(entries)} onClose={() => setAdding(false)} onSubmit={async (v) => { if (await schedule.create(scheduleInput(v))) toast.success('Jadwal berhasil dibuat'); }} />
      </div>
    </DashboardLayout>
  );
}
