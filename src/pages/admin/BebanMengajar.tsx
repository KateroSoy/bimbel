import { useState } from 'react';
import { Users, BookOpenCheck, BarChart3, Scale, CircleCheck, FileSpreadsheet, Settings, Eye, SlidersHorizontal, Plus, Layers, FileText, CalendarDays } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import {
  PageHead, StatCards, FilterBar, Select, DataTable, Person, Badge, Btn, InfoBox, LegendBox, Panel, DonutPanel, QuickList, WithRail, Meter, Modal,
  KeyValues, exportCsv, soon, type Col,
} from '../../components/portal/Kit';
import { programTone, staffAvatar, weekLabel, type Workload, type LoadStatus } from '../../data/adminPortal';
import { useResource } from '../../store/useRemote';

const STATUSES: LoadStatus[] = ['Optimal', 'Cukup', 'Ringan', 'Maksimal', 'Tidak Mengajar'];
const COLOR: Record<LoadStatus, string> = { Optimal: '#16A34A', Cukup: '#1D4ED8', Ringan: '#F59E0B', Maksimal: '#EF4444', 'Tidak Mengajar': '#CBD5E1' };
const RANGE: Record<LoadStatus, string> = { Optimal: 'Optimal (80 - 100%)', Cukup: 'Cukup (60 - <80%)', Ringan: 'Ringan (<60%)', Maksimal: 'Melebihi Maksimal', 'Tidak Mengajar': 'Tidak Mengajar' };
const programOf = (kelas: string) => kelas.replace(/\s+\d?[A-C]$/, '').replace(/ [A-C]$/, '');

export default function BebanMengajar() {
  const [tutor, setTutor] = useState('');
  const [status, setStatus] = useState('');
  const [viewing, setViewing] = useState<Workload | null>(null);

  const WORKLOADS = useResource<Workload>('workloads').rows;
  useResource('staff');
  const rows = WORKLOADS.filter((w) => (!tutor || w.name === tutor) && (!status || w.status === status));
  const teaching = WORKLOADS.filter((w) => w.sessions > 0);
  const totalHours = teaching.reduce((a, w) => a + w.sessions, 0);
  const fmt = (h: number) => `${Math.floor(h)}:${String(Math.round((h % 1) * 60)).padStart(2, '0')}`;
  const n = (s: LoadStatus) => WORKLOADS.filter((w) => w.status === s).length;

  const columns: Col<Workload>[] = [
    { header: 'No.', cell: (_, i) => i + 1, align: 'center' },
    { header: 'Tutor', cell: (w) => <Person name={w.name} sub={w.id} src={staffAvatar(w.name)} /> },
    { header: 'Program / Kelas', cell: (w) => <div className="flex flex-col gap-1 items-start">{(w.classes ?? []).map((c) => <Badge key={c} tone={programTone(programOf(c))}>{c}</Badge>)}</div> },
    { header: 'Jumlah Kelas', align: 'center', cell: (w) => (w.classCount ? `${w.classCount} kelas` : '-') },
    { header: 'Jam Mengajar / Minggu', align: 'center', cell: (w) => (w.sessions ? <><span className="font-bold text-slate-800">{w.hours}</span><span className="block text-[11px] text-slate-500">({String(w.sessions).replace('.', ',')} pertemuan)</span></> : '-') },
    { header: '% dari Kapasitas', align: 'center', cell: (w) => (w.sessions ? <div className="w-24 mx-auto"><span className="font-bold text-slate-800">{String(w.pct).replace('.', ',')}%</span><Meter value={w.pct} color={COLOR[w.status]} className="mt-1" /></div> : '-') },
    { header: 'Status Beban', cell: (w) => <Badge>{w.status}</Badge> },
    { header: 'Keterangan', cell: (w) => <span className="block max-w-[130px]">{w.note}</span> },
    { header: 'Aksi', align: 'center', cell: (w) => <button aria-label="Lihat detail" onClick={() => setViewing(w)} className="w-8 h-8 rounded-lg border border-slate-200 text-slate-600 hover:text-[#1D4ED8] inline-flex items-center justify-center"><Eye className="w-4 h-4" /></button> },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-4 max-w-[1500px]">
        <PageHead
          title="Beban Mengajar"
          subtitle="Monitor dan kelola beban mengajar setiap tutor."
          actions={<>
            <Btn icon={FileSpreadsheet} className="!text-emerald-700" onClick={() => exportCsv('beban-mengajar', ['ID', 'Tutor', 'Kelas', 'Jumlah Kelas', 'Jam/Minggu', '% Kapasitas', 'Status'], rows.map((w) => [w.id, w.name, w.classes.join(' / '), w.classCount, w.hours, w.pct, w.status]))}>Export ke Excel</Btn>
            <Btn variant="primary" icon={Settings} onClick={() => soon('Pengaturan Beban Mengajar')}>Pengaturan Beban Mengajar</Btn>
          </>}
        />
        <StatCards items={[
          { label: 'Total Tutor', value: teaching.length, sub: 'Tutor aktif', icon: Users, tone: 'blue' },
          { label: 'Total Jam Mengajar / Minggu', value: fmt(totalHours), sub: 'Jam', icon: BookOpenCheck, tone: 'green' },
          { label: 'Rata-rata Beban / Tutor', value: fmt(totalHours / (teaching.length || 1)), sub: 'Jam / minggu', icon: BarChart3, tone: 'orange' },
          { label: 'Maksimal Beban / Tutor', value: '20:00', sub: 'Jam / minggu', icon: Scale, tone: 'purple' },
          { label: 'Sesuai Standar', value: n('Optimal') + n('Cukup'), sub: `dari ${teaching.length} tutor`, icon: CircleCheck, tone: 'teal' },
        ]} />

        <WithRail
          rail={<>
            <DonutPanel title="Distribusi Beban Mengajar" center={WORKLOADS.length} sub="Total Tutor" data={STATUSES.map((s) => ({ label: RANGE[s], value: n(s), color: COLOR[s], note: `${n(s)} orang` }))} />
            <Panel title="Statistik Beban Mengajar">
              <KeyValues rows={[
                ['Rata-rata Beban / Tutor', `${fmt(totalHours / (teaching.length || 1))} jam`],
                ['Beban Tertinggi', `${fmt(Math.max(0, ...teaching.map((w) => w.sessions)))} jam`],
                ['Beban Terendah', `${fmt(teaching.length ? Math.min(...teaching.map((w) => w.sessions)) : 0)} jam`],
                ['Total Pertemuan / Minggu', String(totalHours).replace('.', ',')],
                ['Total Kelas Aktif', teaching.reduce((a, w) => a + w.classCount, 0)],
              ]} />
            </Panel>
            <QuickList items={[
              { label: 'Atur Standar Beban Mengajar', icon: SlidersHorizontal },
              { label: 'Tambah Beban Tutor', icon: Plus, to: '/admin/jadwal-tutor' },
              { label: 'Rekap Beban per Program', icon: Layers },
              { label: 'Rekap Beban per Kelas', icon: Layers },
              { label: 'Laporan Beban Mengajar', icon: FileText, to: '/admin/laporan-tutor' },
            ]} />
          </>}
        >
          <FilterBar onReset={() => { setTutor(''); setStatus(''); }}>
            <Select value={tutor} onChange={setTutor} all="Semua Tutor" options={WORKLOADS.map((w) => w.name)} />
            <Select value={status} onChange={setStatus} all="Semua Status Beban" options={STATUSES} />
            <span className="inline-flex items-center gap-2 h-10 px-3 rounded-lg border border-slate-200 bg-white text-[13px] font-bold text-slate-800"><CalendarDays className="w-4 h-4 text-slate-500" /> Minggu, {weekLabel()}</span>
          </FilterBar>
          <DataTable columns={columns} rows={rows} rowKey={(w) => w.id} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <InfoBox items={['Standar beban mengajar maksimal tutor adalah 20 jam per minggu.', 'Perhitungan berdasarkan total pertemuan yang dijadwalkan.', 'Beban mengajar tidak termasuk rapat, briefing, atau kegiatan non-mengajar.', 'Pastikan distribusi beban mengajar seimbang antar tutor.']} />
            <LegendBox title="Legenda Status Beban" rows={[['Maksimal', '100% dari kapasitas (≥ 20 jam/minggu)'], ['Optimal', '80% - <100% dari kapasitas (16 - <20 jam/minggu)'], ['Cukup', '60% - <80% dari kapasitas (12 - <16 jam/minggu)'], ['Ringan', '<60% dari kapasitas (<12 jam/minggu)'], ['Tidak Mengajar', 'Belum ada jadwal mengajar']]} />
            <Panel title="Standar Beban Mengajar">
              <KeyValues rows={[[<b>Kategori Tutor</b>, 'Maksimal Jam / Minggu'], ['Tutor Tetap', '20 jam'], ['Tutor Part-Time', '16 jam'], ['Tutor Tamu / Freelance', '12 jam']]} />
            </Panel>
          </div>
        </WithRail>

        <Modal open={!!viewing} title="Detail Beban Mengajar" onClose={() => setViewing(null)} footer={<Btn variant="ghost" onClick={() => setViewing(null)}>Tutup</Btn>}>
          {viewing && <KeyValues rows={[['Tutor', viewing.name], ['ID', viewing.id], ['Program / Kelas', viewing.classes.join(', ')], ['Jumlah Kelas', viewing.classCount || '-'], ['Jam Mengajar / Minggu', viewing.hours], ['% dari Kapasitas', viewing.sessions ? `${viewing.pct}%` : '-'], ['Status', <Badge>{viewing.status}</Badge>], ['Keterangan', viewing.note]]} />}
        </Modal>
      </div>
    </DashboardLayout>
  );
}
