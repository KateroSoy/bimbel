import { useState } from 'react';
import { FileText, UserRound, Plus, Calculator, Languages, FlaskConical, ClipboardList, Globe, Star, type LucideIcon } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { PageHead, Tabs, SearchInput, Select, DataTable, Badge, Btn, RowMenu, useCrud, type Col, type Field } from '../../components/portal/Kit';
import { type QuestionRow } from '../../data/guruPortal';

const SUBJECTS = ['Matematika', 'Bahasa Inggris', 'IPA', 'Fisika', 'Bahasa Indonesia'];
const SUBJECT_ICON: Record<string, { icon: LucideIcon; cls: string }> = {
  Matematika: { icon: Calculator, cls: 'bg-blue-50 text-blue-600' }, 'Bahasa Inggris': { icon: Languages, cls: 'bg-emerald-50 text-emerald-600' },
  IPA: { icon: FlaskConical, cls: 'bg-orange-50 text-orange-500' }, Fisika: { icon: Globe, cls: 'bg-teal-50 text-teal-600' }, 'Bahasa Indonesia': { icon: ClipboardList, cls: 'bg-violet-50 text-violet-600' },
};
const LEVEL_DOT = { Mudah: 'bg-emerald-500', Sedang: 'bg-amber-500', Sulit: 'bg-red-500' };
const FIELDS: Field[] = [
  { key: 'text', label: 'Pertanyaan', type: 'textarea', required: true },
  { key: 'type', label: 'Jenis Soal', type: 'select', options: ['Pilihan Ganda', 'Uraian'] },
  { key: 'subject', label: 'Mata Pelajaran', type: 'select', options: SUBJECTS },
  { key: 'topic', label: 'Topik', required: true },
  { key: 'grade', label: 'Kelas', required: true, placeholder: 'SD 5 / SMP 7 / SMA 10' },
  { key: 'level', label: 'Kesulitan', type: 'select', options: ['Mudah', 'Sedang', 'Sulit'] },
];

export default function BankSoalGuru() {
  const [tab, setTab] = useState('Semua');
  const [q, setQ] = useState('');
  const [subject, setSubject] = useState('');
  const [grade, setGrade] = useState('');
  const [level, setLevel] = useState('');
  const [used, setUsed] = useState<Set<string>>(new Set());

  const crud = useCrud<QuestionRow>('questions', {
    label: 'Soal',
    fields: FIELDS,
    create: (v) => ({ id: '', text: v.text, type: v.type as QuestionRow['type'], subject: v.subject, topic: v.topic, grade: v.grade, level: v.level as QuestionRow['level'], mine: true, fav: false }),
    detail: (r) => [['Pertanyaan', <span className="font-medium text-slate-700">{r.text}</span>], ['Jenis', r.type], ['Mata Pelajaran', r.subject], ['Topik', r.topic], ['Kelas', r.grade], ['Kesulitan', r.level]],
  });

  const rows = crud.rows.filter((r) =>
    (tab === 'Semua' || (tab === 'Soal Saya' ? r.mine : r.fav)) && (!q || `${r.text} ${r.topic}`.toLowerCase().includes(q.toLowerCase())) &&
    (!subject || r.subject === subject) && (!grade || r.grade === grade) && (!level || r.level === level));
  const toggleUse = (r: QuestionRow) => setUsed((prev) => {
    const next = new Set(prev);
    if (next.has(r.id)) next.delete(r.id); else next.add(r.id);
    return next;
  });

  const columns: Col<QuestionRow>[] = [
    {
      header: 'SOAL',
      cell: (r) => {
        const s = SUBJECT_ICON[r.subject] ?? SUBJECT_ICON.Matematika;
        return (
          <div className="flex items-start gap-3 py-1.5">
            <span className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${s.cls}`}><s.icon className="w-5 h-5" /></span>
            <div className="min-w-0 max-w-[340px]">
              <p className="text-sm font-bold text-[#0F1E4A] leading-snug">{r.text}</p>
              <p className="mt-1 flex items-center gap-1.5"><Badge tone="slate">{r.type}</Badge>{r.mine && <Badge tone="blue">Soal Saya</Badge>}</p>
            </div>
          </div>
        );
      },
    },
    { header: 'MATA PELAJARAN / TOPIK', cell: (r) => <><span className="font-extrabold text-[#0F1E4A]">{r.subject}</span><span className="block text-xs text-slate-500">{r.topic}</span></> },
    { header: 'KELAS', cell: (r) => r.grade },
    { header: 'KESULITAN', cell: (r) => <span className="inline-flex items-center gap-2"><span className={`w-2.5 h-2.5 rounded-full ${LEVEL_DOT[r.level]}`} />{r.level}</span> },
    {
      header: 'AKSI', align: 'center',
      cell: (r) => (
        <div className="inline-flex items-center gap-2">
          <button aria-label={r.fav ? 'Hapus dari favorit' : 'Tambah ke favorit'} onClick={() => crud.patch(r.id, { fav: !r.fav })} className="w-8 h-8 inline-flex items-center justify-center"><Star className={`w-4 h-4 ${r.fav ? 'fill-amber-400 text-amber-400' : 'text-slate-400'}`} /></button>
          <Btn variant={used.has(r.id) ? 'soft' : 'outline'} onClick={() => toggleUse(r)} className="w-[104px]">{used.has(r.id) ? 'Dipilih' : 'Gunakan'}</Btn>
          <RowMenu items={[
            { label: 'Lihat Detail', onClick: () => crud.view(r) },
            ...(r.mine ? [{ label: 'Ubah', onClick: () => crud.edit(r) }, { label: 'Hapus', onClick: () => crud.remove(r), danger: true }] : []),
          ]} />
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-4 max-w-[1300px]">
        <PageHead title="Bank Soal" subtitle="Kelola dan gunakan ribuan soal untuk pembelajaran, latihan, dan asesmen." />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-slate-700 font-medium">
            <span className="flex items-center gap-2"><FileText className="w-5 h-5 text-slate-600" /><b className="text-[#0F1E4A]">{crud.rows.length}</b> soal tersedia</span>
            <span className="flex items-center gap-2"><UserRound className="w-5 h-5 text-slate-600" /><b className="text-[#0F1E4A]">{crud.rows.filter((r) => r.mine).length}</b> soal milik Anda</span>
          </p>
          <div className="flex gap-2">
            {used.size > 0 && <span className="inline-flex items-center h-10 px-3 rounded-lg bg-[#EAF1FF] text-[13px] font-bold text-[#1D4ED8]">{used.size} soal dipilih</span>}
            <Btn variant="primary" icon={Plus} onClick={crud.add}>Buat Soal</Btn>
          </div>
        </div>
        <Tabs tabs={['Semua', 'Soal Saya', 'Favorit']} value={tab} onChange={setTab} />
        <div className="flex flex-wrap gap-2">
          <SearchInput value={q} onChange={setQ} placeholder="Cari soal, topik, atau kata kunci..." />
          <Select value={subject} onChange={setSubject} all="Semua Mata Pelajaran" options={SUBJECTS} />
          <Select value={grade} onChange={setGrade} all="Semua Kelas" options={[...new Set(crud.rows.map((r) => r.grade))].sort()} />
          <Select value={level} onChange={setLevel} all="Semua Kesulitan" options={['Mudah', 'Sedang', 'Sulit']} />
        </div>
        <DataTable columns={columns} rows={rows} rowKey={(r) => r.id} unit="soal" initialPerPage={10} selectable empty={tab === 'Favorit' ? 'Belum ada soal favorit. Klik ikon bintang untuk menambahkan.' : 'Tidak ada soal yang cocok.'} />
        {crud.dialogs}
      </div>
    </DashboardLayout>
  );
}
