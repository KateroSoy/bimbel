import { useState } from 'react';
import { ArrowLeft, NotebookPen, Save, CalendarCheck, CalendarDays, Clock, Timer, CircleCheck, Users, SquarePen, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { PageHead, Tabs, SearchInput, Select, DataTable, Person, Btn, RowMenu, Panel, Badge, FormDialog, Meter, type Col } from '../../components/portal/Kit';
import { PRESENCE_COLOR, type Presence, type PresenceRow, type TutorClass } from '../../data/guruPortal';
import { useResource } from '../../store/useRemote';

const STATUSES: Presence[] = ['Hadir', 'Terlambat', 'Izin', 'Sakit', 'Alpa'];
interface TeachingNote { id: string; kelas: string; date: string; topic: string; homework: string; note: string }
const now = () => new Date().toTimeString().slice(0, 5).replace(':', '.');

export default function PresensiKelas() {
  const remote = useResource<PresenceRow>('presences');
  const rows = remote.rows;
  const notes = useResource<TeachingNote>('teaching-notes');
  const kelas = useResource<TutorClass>('tutor-classes').rows.find((c) => c.status === 'Aktif');
  const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const [tab, setTab] = useState('Daftar Siswa');
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState('');
  const [savedAt, setSavedAt] = useState(now());
  const [noting, setNoting] = useState<PresenceRow | null>(null);
  const [journal, setJournal] = useState(false);
  const [corrections, setCorrections] = useState<{ name: string; from: Presence; to: Presence; time: string }[]>([]);

  const touch = () => setSavedAt(now());
  const setStatus = (r: PresenceRow, status: Presence) => {
    if (status === r.status) return;
    setCorrections((prev) => [{ name: r.name, from: r.status, to: status, time: now() }, ...prev]);
    void remote.update(r.id, { status, time: status === 'Hadir' || status === 'Terlambat' ? r.time || now() : '' }).then((saved) => saved && touch());
  };
  const filtered = rows.filter((r) => (!q || `${r.name} ${r.id}`.toLowerCase().includes(q.toLowerCase())) && (!filter || r.status === filter));
  const n = (s: Presence) => rows.filter((r) => r.status === s).length;
  const pct = (v: number) => Math.round((v / (rows.length || 1)) * 100);

  const columns: Col<PresenceRow>[] = [
    { header: 'NO.', cell: (_, i) => `${i + 1}.`, align: 'center' },
    { header: 'SISWA', cell: (r) => <Person name={r.name} sub={`NIS: ${r.id}`} /> },
    {
      header: 'STATUS KEHADIRAN',
      cell: (r) => (
        <div className="relative w-[150px]">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PRESENCE_COLOR[r.status] }} />
          <select aria-label={`Status kehadiran ${r.name}`} value={r.status} onChange={(e) => setStatus(r, e.target.value as Presence)} className="appearance-none w-full h-9 pl-8 pr-8 rounded-lg border border-slate-200 bg-white text-[13px] font-bold outline-none focus:border-[#1D4ED8] cursor-pointer" style={{ color: PRESENCE_COLOR[r.status] }}>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <ChevronDown className="w-4 h-4 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      ),
    },
    { header: 'CATATAN', cell: (r) => <button onClick={() => setNoting(r)} className="flex items-center gap-2 text-left hover:text-[#1D4ED8]"><span>{r.note || '—'}</span><SquarePen className="w-3.5 h-3.5 text-slate-400" /></button> },
    { header: 'JAM DATANG', cell: (r) => <span className="font-extrabold text-[#0F1E4A]">{r.time || '—'}</span> },
    { header: '', align: 'center', cell: (r) => <RowMenu items={[{ label: 'Tambah / Ubah Catatan', onClick: () => setNoting(r) }, ...STATUSES.filter((s) => s !== r.status).map((s) => ({ label: `Tandai ${s}`, onClick: () => setStatus(r, s) }))]} /> },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-4 max-w-[1300px]">
        <PageHead title="Presensi Kelas" subtitle="Kelola kehadiran siswa pada sesi bimbingan belajar Anda." />
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Btn variant="ghost" icon={ArrowLeft} to="/guru/jadwal">Kembali ke Jadwal</Btn>
          <div className="flex gap-2">
            <Btn variant="ghost" icon={NotebookPen} onClick={() => setJournal(true)}>Catatan Mengajar</Btn>
            <Btn variant="primary" icon={Save} onClick={() => { touch(); toast.success('Presensi disimpan', { description: `${n('Hadir') + n('Terlambat')} dari ${rows.length} siswa hadir.` }); }}>Selesai & Simpan</Btn>
          </div>
        </div>

        <Panel className="!p-0">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
            <div className="p-5">
              <div className="flex items-start gap-3.5">
                <span className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0"><CalendarCheck className="w-6 h-6" /></span>
                <div><h2 className="text-lg font-extrabold text-[#0F1E4A]">{kelas ? `${kelas.subject} - ${kelas.name}` : 'Sesi Kelas'}</h2><p className="text-sm text-slate-700 font-medium">{kelas?.code ?? '—'}</p></div>
              </div>
              <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-3 text-[13px] text-slate-700 font-medium">
                <span className="flex items-center gap-1.5"><CalendarDays className="w-4 h-4" /> {today}</span>
                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {kelas?.time ?? '—'} WIB</span>
                <span className="flex items-center gap-1.5"><Timer className="w-4 h-4" /> {kelas?.days ?? '—'}</span>
              </div>
              <Badge tone="green" className="mt-3 !text-xs !py-1">Sedang berlangsung</Badge>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-5 gap-2">
                {STATUSES.map((s) => (
                  <button key={s} onClick={() => setFilter(filter === s ? '' : s)} className={`text-left rounded-lg px-1.5 py-1 ${filter === s ? 'bg-slate-100' : ''}`}>
                    <p className="flex items-center gap-2 text-xl font-extrabold text-[#0F1E4A]"><span className="w-3 h-3 rounded-full" style={{ backgroundColor: PRESENCE_COLOR[s] }} />{n(s)}</p>
                    <p className="text-xs font-bold text-slate-700 mt-0.5">{s}</p>
                    <p className="text-xs text-slate-500 font-medium">{pct(n(s))}%</p>
                  </button>
                ))}
              </div>
              <p className="mt-3 flex items-center gap-2 text-xs font-medium text-slate-500"><CircleCheck className="w-4 h-4 text-emerald-600" /><span className="text-emerald-700 font-bold">Tersimpan otomatis</span> Terakhir disimpan {savedAt}</p>
            </div>
          </div>
        </Panel>

        <Tabs tabs={['Daftar Siswa', 'Rekap', 'Riwayat', { label: 'Koreksi', count: corrections.length || undefined }]} value={tab} onChange={setTab} />

        {tab === 'Daftar Siswa' && (
          <>
            <div className="flex flex-wrap gap-2">
              <SearchInput value={q} onChange={setQ} placeholder="Cari nama siswa atau NIS..." />
              <Btn icon={Users} onClick={async () => { await Promise.all(rows.filter((r) => r.status !== 'Hadir').map((r) => remote.update(r.id, { status: 'Hadir', time: r.time || now() }))); touch(); toast.success('Semua siswa ditandai hadir'); }}>Tandai Semua Hadir</Btn>
              <Select value={filter} onChange={setFilter} all="Semua Status" options={STATUSES} />
            </div>
            <DataTable columns={columns} rows={filtered} rowKey={(r) => r.id} unit="siswa" />
          </>
        )}

        {tab === 'Rekap' && (
          <Panel title="Rekap Kehadiran Sesi Ini">
            <ul className="space-y-3">
              {STATUSES.map((s) => (
                <li key={s}>
                  <div className="flex justify-between text-[13px] font-bold text-slate-700 mb-1"><span>{s}</span><span>{n(s)} siswa ({pct(n(s))}%)</span></div>
                  <Meter value={pct(n(s))} color={PRESENCE_COLOR[s]} />
                </li>
              ))}
            </ul>
          </Panel>
        )}

        {tab === 'Riwayat' && (
          <DataTable
            unit="catatan"
            rows={notes.rows}
            rowKey={(h) => h.id}
            empty="Belum ada catatan mengajar. Gunakan tombol Catatan Mengajar untuk menambahkan."
            columns={[
              { header: 'TANGGAL', cell: (h) => <span className="font-bold text-[#0F1E4A] whitespace-nowrap">{h.date}</span> },
              { header: 'KELAS', cell: (h) => h.kelas },
              { header: 'TOPIK', cell: (h) => h.topic },
              { header: 'TUGAS / PR', cell: (h) => h.homework || '—' },
              { header: 'CATATAN', cell: (h) => h.note || '—' },
            ]}
          />
        )}

        {tab === 'Koreksi' && (
          <Panel title="Riwayat Koreksi Sesi Ini">
            {corrections.length === 0 ? <p className="text-sm text-slate-500 font-medium">Belum ada perubahan status pada sesi ini.</p> : (
              <ul className="divide-y divide-slate-100">
                {corrections.map((c, i) => (
                  <li key={i} className="flex flex-wrap items-center gap-2 py-2 text-[13px] font-medium text-slate-700">
                    <span className="font-bold text-[#0F1E4A] w-40">{c.name}</span><Badge>{c.from}</Badge><span>→</span><Badge>{c.to}</Badge><span className="ml-auto text-xs text-slate-500">{c.time}</span>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        )}

        <FormDialog
          open={!!noting}
          title={`Catatan · ${noting?.name ?? ''}`}
          fields={[{ key: 'note', label: 'Catatan', type: 'textarea', placeholder: 'Contoh: Terlambat 10 menit' }]}
          initial={{ note: noting?.note ?? '' }}
          onClose={() => setNoting(null)}
          onSubmit={async (v) => { if (await remote.update(noting!.id, { note: v.note })) touch(); }}
        />
        <FormDialog
          open={journal}
          title="Catatan Mengajar"
          fields={[{ key: 'topic', label: 'Topik yang Diajarkan', required: true }, { key: 'homework', label: 'Tugas / PR' }, { key: 'note', label: 'Catatan Sesi', type: 'textarea' }]}
          onClose={() => setJournal(false)}
          onSubmit={async (v) => { if (await notes.create({ kelas: kelas?.name ?? '', date: today, topic: v.topic, homework: v.homework, note: v.note })) toast.success('Catatan mengajar disimpan', { description: v.topic }); }}
        />
      </div>
    </DashboardLayout>
  );
}
