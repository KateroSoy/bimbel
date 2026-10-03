import { useState } from 'react';
import { Users, CalendarCheck, UserX, Clock, CalendarOff, FileSpreadsheet, Plus, ChevronLeft, ChevronRight, CalendarDays, ClipboardList, History, Settings, ShieldCheck, Download } from 'lucide-react';
import { toast } from 'sonner';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import {
  PageHead, StatCards, Tabs, FilterBar, Select, DataTable, Person, Badge, RowMenu, Btn, InfoBox, LegendBox, Panel, DonutPanel, QuickList, WithRail,
  FormDialog, BarList, exportCsv, soon, type Col, type Field,
} from '../../components/portal/Kit';
import { staffAvatar, type TutorAttendance, type AttStatus } from '../../data/adminPortal';
import { useResource } from '../../store/useRemote';

const STATUSES: AttStatus[] = ['Hadir', 'Terlambat', 'Tidak Hadir', 'Izin', 'Sakit'];
const COLOR: Record<AttStatus, string> = { Hadir: '#16A34A', Terlambat: '#F59E0B', 'Tidak Hadir': '#EF4444', Izin: '#7C3AED', Sakit: '#A855F7' };
const TIME_COLOR: Partial<Record<AttStatus, string>> = { Hadir: 'text-emerald-600', Terlambat: 'text-orange-500' };

export default function KehadiranTutor() {
  const remote = useResource<TutorAttendance>('tutor-attendances');
  const rows = remote.rows;
  useResource('staff');
  const todayLabel = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const [tab, setTab] = useState('Harian');
  const [tutor, setTutor] = useState('');
  const [room, setRoom] = useState('');
  const [status, setStatus] = useState('');
  const [adding, setAdding] = useState(false);

  const filtered = rows.filter((r) => (!tutor || r.name === tutor) && (!room || r.room === room) && (!status || r.status === status));
  const n = (s: AttStatus | AttStatus[]) => rows.filter((r) => (Array.isArray(s) ? s.includes(r.status) : r.status === s)).length;
  const pct = (v: number) => `${((v / (rows.length || 1)) * 100).toFixed(2).replace('.', ',')}%`;
  const mark = async (r: TutorAttendance, s: AttStatus) => {
    const present = s === 'Hadir' || s === 'Terlambat';
    const saved = await remote.update(r.id, {
      status: s,
      checkIn: present ? (r.checkIn === '-' ? (r.schedule ?? '').slice(0, 5) : r.checkIn) : '-',
      checkOut: present ? (r.checkOut === '-' ? (r.schedule ?? '').slice(-5) : r.checkOut) : '-',
      note: s === 'Hadir' ? '-' : r.note === '-' ? s : r.note,
    });
    if (saved) toast.success(`${r.name.split(',')[0]} ditandai ${s}`);
  };
  const doExport = (label = 'kehadiran-tutor') => exportCsv(label, ['ID', 'Tutor', 'Program / Kelas', 'Ruang', 'Jadwal', 'Masuk', 'Pulang', 'Status', 'Keterangan'], filtered.map((r) => [r.id, r.name, r.program, r.room, r.schedule, r.checkIn, r.checkOut, r.status, r.note]));

  const fields: Field[] = [
    { key: 'name', label: 'Tutor / Staff', type: 'select', options: rows.map((r) => r.name) },
    { key: 'status', label: 'Status', type: 'select', options: STATUSES },
    { key: 'checkIn', label: 'Jam Masuk', placeholder: '07:00' },
    { key: 'checkOut', label: 'Jam Pulang', placeholder: '08:30' },
    { key: 'note', label: 'Keterangan', type: 'textarea' },
  ];

  const columns: Col<TutorAttendance>[] = [
    { header: 'No.', cell: (_, i) => i + 1, align: 'center' },
    { header: 'Tutor', cell: (r) => <Person name={r.name} sub={r.id} src={staffAvatar(r.name)} /> },
    { header: 'Program / Kelas', cell: (r) => <>{<span className="font-bold text-slate-800">{r.program}</span>}{r.code && <span className="block mt-0.5"><Badge tone="blue">Kelas: {r.code}</Badge></span>}</> },
    { header: 'Ruang', cell: (r) => r.room },
    { header: 'Jadwal', cell: (r) => <span className="whitespace-nowrap">{r.schedule}</span> },
    { header: 'Masuk', align: 'center', cell: (r) => <span className={`font-bold ${TIME_COLOR[r.status] ?? ''}`}>{r.checkIn}</span> },
    { header: 'Pulang', align: 'center', cell: (r) => <span className={`font-bold ${r.checkOut !== '-' ? 'text-emerald-600' : ''}`}>{r.checkOut}</span> },
    { header: 'Status', cell: (r) => <Badge>{r.status}</Badge> },
    { header: 'Keterangan', cell: (r) => r.note },
    { header: 'Aksi', align: 'center', cell: (r) => <RowMenu items={STATUSES.filter((s) => s !== r.status).map((s) => ({ label: `Tandai ${s}`, onClick: () => mark(r, s) }))} /> },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-4 max-w-[1500px]">
        <PageHead
          title="Kehadiran Tutor"
          subtitle="Pantau kehadiran tutor secara harian, mingguan, dan bulanan."
          actions={<>
            <Btn icon={FileSpreadsheet} className="!text-emerald-700" onClick={() => doExport()}>Export ke Excel</Btn>
            <Btn variant="primary" icon={Plus} onClick={() => setAdding(true)}>Catat Kehadiran</Btn>
          </>}
        />
        <StatCards items={[
          { label: 'Total Tutor', value: rows.length, sub: 'Tutor & staff aktif', icon: Users, tone: 'blue' },
          { label: 'Hadir Hari Ini', value: n('Hadir'), sub: `${pct(n('Hadir'))} dari ${rows.length}`, icon: CalendarCheck, tone: 'green' },
          { label: 'Tidak Hadir', value: n('Tidak Hadir'), sub: `${pct(n('Tidak Hadir'))} dari ${rows.length}`, icon: UserX, tone: 'orange' },
          { label: 'Terlambat', value: n('Terlambat'), sub: `${pct(n('Terlambat'))} dari ${rows.length}`, icon: Clock, tone: 'red' },
          { label: 'Izin / Sakit', value: n(['Izin', 'Sakit']), sub: `${pct(n(['Izin', 'Sakit']))} dari ${rows.length}`, icon: CalendarOff, tone: 'purple' },
        ]} />

        <WithRail
          rail={<>
            <DonutPanel title="Ringkasan Kehadiran Hari Ini" center={rows.length} sub="Total Tutor" data={[
              { label: 'Hadir', value: n('Hadir'), color: COLOR.Hadir, note: `${n('Hadir')} (${pct(n('Hadir'))})` },
              { label: 'Terlambat', value: n('Terlambat'), color: COLOR.Terlambat, note: `${n('Terlambat')} (${pct(n('Terlambat'))})` },
              { label: 'Tidak Hadir', value: n('Tidak Hadir'), color: COLOR['Tidak Hadir'], note: `${n('Tidak Hadir')} (${pct(n('Tidak Hadir'))})` },
              { label: 'Izin / Sakit', value: n(['Izin', 'Sakit']), color: COLOR.Izin, note: `${n(['Izin', 'Sakit'])} (${pct(n(['Izin', 'Sakit']))})` },
            ]} />
            <Panel title="Kehadiran per Status">
              <p className="text-xs font-bold text-slate-700 mb-2">{todayLabel}</p>
              <BarList rows={STATUSES.map((s) => ({ label: s, value: n(s), max: rows.length || 1, display: `${n(s)} orang`, color: COLOR[s] }))} />
            </Panel>
            <QuickList items={[
              { label: 'Catat Kehadiran Manual', icon: Plus, onClick: () => setAdding(true) },
              { label: 'Rekap Kehadiran', icon: ClipboardList, onClick: () => setTab('Bulanan') },
              { label: 'Riwayat Kehadiran Tutor', icon: History },
              { label: 'Pengaturan Jam Kerja', icon: Settings },
              { label: 'Kebijakan Kehadiran', icon: ShieldCheck },
            ]} />
          </>}
        >
          <Tabs tabs={['Harian', 'Mingguan', 'Bulanan']} value={tab} onChange={setTab} />
          {tab === 'Harian' ? (
            <>
              <FilterBar onReset={() => { setTutor(''); setRoom(''); setStatus(''); }}>
                <div className="inline-flex items-center gap-1">
                  <button aria-label="Hari sebelumnya" disabled className="w-9 h-10 rounded-lg border border-slate-200 bg-white flex items-center justify-center disabled:opacity-40"><ChevronLeft className="w-4 h-4" /></button>
                  <button aria-label="Hari berikutnya" disabled className="w-9 h-10 rounded-lg border border-slate-200 bg-white flex items-center justify-center disabled:opacity-40"><ChevronRight className="w-4 h-4" /></button>
                  <span className="inline-flex items-center gap-2 h-10 px-3 rounded-lg border border-slate-200 bg-white text-[13px] font-bold text-slate-800"><CalendarDays className="w-4 h-4 text-slate-500" /> {todayLabel}</span>
                </div>
                <Select value={tutor} onChange={setTutor} all="Semua Tutor" options={rows.map((r) => r.name)} />
                <Select value={room} onChange={setRoom} all="Semua Ruang" options={[...new Set(rows.map((r) => r.room))].sort()} />
                <Select value={status} onChange={setStatus} all="Semua Status" options={STATUSES} />
              </FilterBar>
              <DataTable columns={columns} rows={filtered} rowKey={(r) => r.id} empty="Belum ada catatan kehadiran." />
            </>
          ) : (
            <DataTable
              unit="tutor"
              rowKey={(r) => r.id}
              rows={rows}
              columns={[
                { header: 'Tutor', cell: (r) => <Person name={r.name} sub={r.id} src={staffAvatar(r.name)} /> },
                ...(['Hadir', 'Terlambat', 'Tidak Hadir', 'Izin / Sakit'] as const).map((label, ci): Col<TutorAttendance> => ({
                  header: label, align: 'center',
                  // Rekap periode: hari ini dihitung sesuai status, hari lain dalam periode dianggap hadir
                  cell: (r) => {
                    const days = tab === 'Mingguan' ? 5 : 22;
                    if (ci === 0) return days - (r.status === 'Hadir' ? 0 : 1);
                    if (ci === 1) return r.status === 'Terlambat' ? 1 : 0;
                    if (ci === 2) return r.status === 'Tidak Hadir' ? 1 : 0;
                    return r.status === 'Izin' || r.status === 'Sakit' ? 1 : 0;
                  },
                })),
              ]}
            />
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <InfoBox items={['Kehadiran harus dicatat sesuai jadwal mengajar / bekerja.', 'Toleransi keterlambatan 15 menit.', 'Jika tutor tidak dapat hadir, harap isi keterangan atau ajukan izin.', 'Data kehadiran digunakan untuk perhitungan honor dan evaluasi kinerja.']} />
            <LegendBox title="Keterangan Status" rows={[['Hadir', 'Masuk dan pulang sesuai jadwal.'], ['Terlambat', 'Masuk setelah jadwal mulai.'], ['Tidak Hadir', 'Tidak masuk tanpa keterangan.'], ['Izin', 'Telah mengajukan izin.'], ['Sakit', 'Mengajukan izin sakit (dengan bukti).']]} />
            <Panel title="Unduh Laporan">
              <div className="space-y-2">
                {['Kehadiran Harian', 'Kehadiran Mingguan', 'Kehadiran Bulanan'].map((l) => (
                  <button key={l} onClick={() => (l.endsWith('Harian') ? doExport('kehadiran-harian') : soon(l))} className="w-full flex items-center gap-2 h-9 px-3 rounded-lg border border-slate-200 text-[13px] font-bold text-[#1D4ED8] hover:bg-slate-50"><Download className="w-4 h-4" /> {l}</button>
                ))}
              </div>
            </Panel>
          </div>
        </WithRail>

        <FormDialog
          open={adding}
          title="Catat Kehadiran"
          fields={fields}
          onClose={() => setAdding(false)}
          onSubmit={async (v) => {
            const target = rows.find((r) => r.name === v.name);
            if (target && await remote.update(target.id, { status: v.status as AttStatus, checkIn: v.checkIn || '-', checkOut: v.checkOut || '-', note: v.note || '-' })) toast.success('Kehadiran dicatat');
          }}
        />
      </div>
    </DashboardLayout>
  );
}
