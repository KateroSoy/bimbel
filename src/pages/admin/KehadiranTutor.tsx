import { useState } from 'react';
import { Users, CalendarCheck, UserX, Clock, CalendarOff, FileSpreadsheet, Plus, ChevronLeft, ChevronRight, CalendarDays, ClipboardList, History, Settings, ShieldCheck, Download } from 'lucide-react';
import { toast } from 'sonner';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import {
  PageHead, StatCards, Tabs, FilterBar, Select, DataTable, Person, Badge, RowMenu, Btn, InfoBox, LegendBox, Panel, DonutPanel, QuickList, WithRail,
  FormDialog, DotLegend, exportCsv, soon, type Col, type Field,
} from '../../components/portal/Kit';
import { TUTOR_ATTENDANCE, staffAvatar, type TutorAttendance, type AttStatus } from '../../data/adminPortal';

const STATUSES: AttStatus[] = ['Hadir', 'Terlambat', 'Tidak Hadir', 'Izin', 'Sakit'];
const COLOR: Record<AttStatus, string> = { Hadir: '#16A34A', Terlambat: '#F59E0B', 'Tidak Hadir': '#EF4444', Izin: '#7C3AED', Sakit: '#A855F7' };
const TIME_COLOR: Partial<Record<AttStatus, string>> = { Hadir: 'text-emerald-600', Terlambat: 'text-orange-500' };
const WEEK = [['Sen', 29, 2, 1], ['Sel', 30, 1, 1], ['Rab', 27, 3, 2], ['Kam', 30, 1, 1], ['Jum', 26, 3, 3], ['Sab', 0, 0, 0], ['Min', 0, 0, 0]] as const;
const DATES = ['Kamis, 15 Mei 2025', 'Jumat, 16 Mei 2025', 'Sabtu, 17 Mei 2025'];

export default function KehadiranTutor() {
  const [rows, setRows] = useState(TUTOR_ATTENDANCE);
  const [tab, setTab] = useState('Harian');
  const [dateIdx, setDateIdx] = useState(1);
  const [tutor, setTutor] = useState('');
  const [room, setRoom] = useState('');
  const [status, setStatus] = useState('');
  const [adding, setAdding] = useState(false);

  const filtered = rows.filter((r) => (!tutor || r.name === tutor) && (!room || r.room === room) && (!status || r.status === status));
  const n = (s: AttStatus | AttStatus[]) => rows.filter((r) => (Array.isArray(s) ? s.includes(r.status) : r.status === s)).length;
  const pct = (v: number) => `${((v / (rows.length || 1)) * 100).toFixed(2).replace('.', ',')}%`;
  const mark = (r: TutorAttendance, s: AttStatus) => {
    setRows((prev) => prev.map((x) => (x.id === r.id ? { ...x, status: s, checkIn: s === 'Hadir' || s === 'Terlambat' ? (x.checkIn === '-' ? x.schedule.slice(0, 5) : x.checkIn) : '-', checkOut: s === 'Hadir' || s === 'Terlambat' ? (x.checkOut === '-' ? x.schedule.slice(-5) : x.checkOut) : '-', note: s === 'Hadir' ? '-' : x.note === '-' ? s : x.note } : x)));
    toast.success(`${r.name.split(',')[0]} ditandai ${s}`);
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
            <Panel title="Kehadiran Mingguan">
              <p className="text-xs font-bold text-slate-700 mb-2">12 - 18 Mei 2025</p>
              <div className="flex items-end justify-between gap-2 h-[130px]">
                {WEEK.map(([day, hadir, telat, absen], i) => (
                  <div key={day} className="flex-1 flex flex-col items-center justify-end gap-1">
                    <span className="text-[10px] font-bold text-slate-700">{hadir || ''}</span>
                    <div className="flex items-end gap-0.5">
                      <span className="w-2 rounded-t" style={{ height: Math.max(3, hadir * 2.6), backgroundColor: hadir ? COLOR.Hadir : '#E2E8F0' }} />
                      {telat > 0 && <span className="w-1.5 rounded-t" style={{ height: telat * 5, backgroundColor: COLOR.Terlambat }} />}
                      {absen > 0 && <span className="w-1.5 rounded-t" style={{ height: absen * 5, backgroundColor: COLOR['Tidak Hadir'] }} />}
                    </div>
                    <span className="text-[10px] font-semibold text-slate-500 text-center leading-tight">{day}<br />{12 + i}</span>
                  </div>
                ))}
              </div>
              <div className="mt-2"><DotLegend items={[{ label: 'Hadir', color: COLOR.Hadir }, { label: 'Terlambat', color: COLOR.Terlambat }, { label: 'Tidak Hadir', color: COLOR['Tidak Hadir'] }]} /></div>
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
                  <button aria-label="Hari sebelumnya" disabled={dateIdx === 0} onClick={() => setDateIdx((i) => i - 1)} className="w-9 h-10 rounded-lg border border-slate-200 bg-white flex items-center justify-center disabled:opacity-40"><ChevronLeft className="w-4 h-4" /></button>
                  <button aria-label="Hari berikutnya" disabled={dateIdx === DATES.length - 1} onClick={() => setDateIdx((i) => i + 1)} className="w-9 h-10 rounded-lg border border-slate-200 bg-white flex items-center justify-center disabled:opacity-40"><ChevronRight className="w-4 h-4" /></button>
                  <span className="inline-flex items-center gap-2 h-10 px-3 rounded-lg border border-slate-200 bg-white text-[13px] font-bold text-slate-800"><CalendarDays className="w-4 h-4 text-slate-500" /> {DATES[dateIdx]}</span>
                </div>
                <Select value={tutor} onChange={setTutor} all="Semua Tutor" options={rows.map((r) => r.name)} />
                <Select value={room} onChange={setRoom} all="Semua Ruang" options={[...new Set(rows.map((r) => r.room))].sort()} />
                <Select value={status} onChange={setStatus} all="Semua Status" options={STATUSES} />
              </FilterBar>
              <DataTable columns={columns} rows={dateIdx === 1 ? filtered : []} rowKey={(r) => r.id} empty="Belum ada catatan kehadiran pada tanggal ini." />
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
          onSubmit={(v) => {
            setRows((prev) => prev.map((r) => (r.name === v.name ? { ...r, status: v.status as AttStatus, checkIn: v.checkIn || '-', checkOut: v.checkOut || '-', note: v.note || '-' } : r)));
            toast.success('Kehadiran dicatat');
          }}
        />
      </div>
    </DashboardLayout>
  );
}
