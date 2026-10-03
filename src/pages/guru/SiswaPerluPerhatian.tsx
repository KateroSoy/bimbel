import { useState } from 'react';
import { AlertTriangle, CircleAlert, TrendingUp, TrendingDown, BarChart3, ClipboardList, Target, BookOpen, ArrowRight, CalendarX, type LucideIcon } from 'lucide-react';
import { toast } from 'sonner';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { PageHead, Tabs, SearchInput, Select, DataTable, Person, Badge, Btn, RowMenu, Panel, FormDialog, type Col } from '../../components/portal/Kit';
import { ATTENTION, type AttentionRow, type Risk } from '../../data/guruPortal';

const ISSUE_ICON: Record<string, { icon: LucideIcon; color: string }> = {
  'Nilai rendah': { icon: TrendingDown, color: '#EF4444' }, 'Progress rendah': { icon: BarChart3, color: '#F97316' }, 'Tugas belum selesai': { icon: ClipboardList, color: '#EF4444' },
  'Nilai di bawah KKM': { icon: Target, color: '#F97316' }, Membaik: { icon: TrendingUp, color: '#16A34A' }, 'Remedial aktif': { icon: BookOpen, color: '#7C3AED' }, 'Kehadiran rendah': { icon: CalendarX, color: '#EF4444' },
};
const STAT_COLOR: Record<Risk, string> = { 'Risiko Tinggi': 'text-red-600', 'Risiko Sedang': 'text-orange-500', Membaik: 'text-emerald-600', 'Remedial Aktif': 'text-violet-600' };
const ACTION: Record<Risk, string> = { 'Risiko Tinggi': 'Tindak Lanjut', 'Risiko Sedang': 'Tindak Lanjut', Membaik: 'Lihat Perkembangan', 'Remedial Aktif': 'Lihat Remedial' };

export default function SiswaPerluPerhatian() {
  const [rows, setRows] = useState(ATTENTION);
  const [tab, setTab] = useState('Semua');
  const [q, setQ] = useState('');
  const [kelas, setKelas] = useState('');
  const [risk, setRisk] = useState('');
  const [acting, setActing] = useState<AttentionRow | null>(null);

  const n = (r: Risk) => rows.filter((x) => x.risk === r).length;
  const need = rows.filter((r) => r.risk.startsWith('Risiko')).length;
  const tabRisk = tab === 'Semua' ? '' : tab;
  const filtered = rows.filter((r) => (!tabRisk || r.risk === tabRisk) && (!q || `${r.name} ${r.id}`.toLowerCase().includes(q.toLowerCase())) && (!kelas || r.kelas === kelas) && (!risk || r.risk === risk));

  const columns: Col<AttentionRow>[] = [
    { header: 'SISWA', cell: (r) => <div className="py-1"><Person name={r.name} sub={`NIS: ${r.id}`} /></div> },
    { header: 'KELAS / MATA PELAJARAN', cell: (r) => <><span className="font-bold text-[#0F1E4A]">{r.kelas}</span><span className="block text-xs text-slate-500">{r.subject}</span></> },
    {
      header: 'MASALAH UTAMA',
      cell: (r) => {
        const i = ISSUE_ICON[r.issue] ?? { icon: CircleAlert, color: '#F97316' };
        return <div className="flex items-center gap-2.5"><i.icon className="w-6 h-6 shrink-0" style={{ color: i.color }} /><div><p className="font-bold text-[#0F1E4A]">{r.issue}</p><p className="text-xs text-slate-500">{r.issueSub}</p></div></div>;
      },
    },
    { header: 'KONDISI TERKAIT', cell: (r) => <div className="flex gap-5">{r.stats.map(([l, v]) => <div key={l}><p className="text-[11px] text-slate-500 whitespace-nowrap">{l}</p><p className={`text-[15px] font-extrabold ${STAT_COLOR[r.risk]}`}>{v}</p></div>)}</div> },
    { header: 'TINGKAT RISIKO', cell: (r) => <Badge className="!text-xs !py-1">{r.risk}</Badge> },
    {
      header: 'AKSI', align: 'center',
      cell: (r) => (
        <div className="inline-flex items-center gap-2">
          <Btn onClick={() => setActing(r)} className="min-w-[128px]">{ACTION[r.risk]}</Btn>
          <RowMenu items={[
            { label: 'Hubungi Orang Tua', onClick: () => toast.success(`Pesan disiapkan untuk orang tua ${r.name}`) },
            { label: 'Tandai Membaik', onClick: () => { setRows((prev) => prev.map((x) => (x.id === r.id ? { ...x, risk: 'Membaik', issue: 'Membaik', issueSub: 'Perkembangan positif' } : x))); toast.success(`${r.name} ditandai membaik`); } },
          ]} />
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-4 max-w-[1300px]">
        <PageHead title="Siswa Perlu Perhatian" subtitle="Fokus pada siswa yang membutuhkan tindak lanjut untuk membantu mereka berkembang." />
        <Panel className="!p-5">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {([[AlertTriangle, '#EF4444', need, 'Siswa Perlu Perhatian', 'dari seluruh siswa Anda'], [CircleAlert, '#F97316', n('Risiko Tinggi'), 'Risiko Tinggi', 'Perlu intervensi segera'], [TrendingUp, '#16A34A', n('Membaik'), 'Sudah Membaik', 'Intervensi berhasil']] as const).map(([Icon, color, v, l, sub], i) => (
                <div key={l} className={`flex items-center gap-3 ${i > 0 ? 'sm:pl-4 sm:border-l sm:border-slate-200' : ''}`}>
                  <Icon className="w-9 h-9 shrink-0" style={{ color }} />
                  <div><p className="text-xl font-extrabold text-[#0F1E4A] leading-tight">{v}</p><p className="text-[13px] font-bold text-slate-800">{l}</p><p className="text-xs text-slate-500 font-medium">{sub}</p></div>
                </div>
              ))}
            </div>
            <Btn to="/guru/nilai">Lihat Analisis Lengkap <ArrowRight className="w-4 h-4" /></Btn>
          </div>
        </Panel>

        <Tabs
          tabs={['Semua', { label: `Risiko Tinggi (${n('Risiko Tinggi')})`, value: 'Risiko Tinggi' }, { label: `Risiko Sedang (${n('Risiko Sedang')})`, value: 'Risiko Sedang' }, { label: `Membaik (${n('Membaik')})`, value: 'Membaik' }]}
          value={tab}
          onChange={setTab}
        />
        <div className="flex flex-wrap gap-2">
          <SearchInput value={q} onChange={setQ} placeholder="Cari siswa..." />
          <Select value={kelas} onChange={setKelas} all="Semua Kelas" options={[...new Set(rows.map((r) => r.kelas))]} />
          <Select value={risk} onChange={setRisk} all="Risiko" options={['Risiko Tinggi', 'Risiko Sedang', 'Membaik', 'Remedial Aktif']} />
        </div>
        <DataTable columns={columns} rows={filtered} rowKey={(r) => r.id} unit="siswa" />

        <FormDialog
          open={!!acting}
          title={`${acting ? ACTION[acting.risk] : ''} · ${acting?.name ?? ''}`}
          submitLabel="Simpan Tindak Lanjut"
          fields={[
            { key: 'action', label: 'Jenis Tindak Lanjut', type: 'select', options: ['Bimbingan tambahan', 'Program remedial', 'Hubungi orang tua', 'Tugas pengayaan', 'Pemantauan kehadiran'] },
            { key: 'due', label: 'Target Tanggal', type: 'date' },
            { key: 'note', label: 'Catatan', type: 'textarea', required: true, placeholder: 'Rencana dan catatan untuk siswa ini...' },
          ]}
          onClose={() => setActing(null)}
          onSubmit={(v) => {
            const target = acting!;
            if (v.action === 'Program remedial') setRows((prev) => prev.map((x) => (x.id === target.id ? { ...x, risk: 'Remedial Aktif', issue: 'Remedial aktif', issueSub: 'Sedang menjalani program remedial' } : x)));
            toast.success('Tindak lanjut disimpan', { description: `${target.name} · ${v.action}` });
          }}
        />
      </div>
    </DashboardLayout>
  );
}
