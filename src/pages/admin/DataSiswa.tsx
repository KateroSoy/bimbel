import { useState } from 'react';
import { Users, UserCheck, UserX, UserPlus, GraduationCap, Upload, Download, Plus, Printer, FileSpreadsheet, MessageCircle, FileText } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import {
  PageHead, StatCards, FilterBar, SearchInput, Select, DataTable, Person, Badge, RowActions, Btn, InfoBox, Panel, useCrud, exportCsv, soon, TONE_HEX,
  type Col, type Field, type Tone,
} from '../../components/portal/Kit';
import { STUDENTS, programTone, type AdminStudent } from '../../data/adminPortal';

const PROGRAMS = ['English Primary', 'Math Primary', 'Combo', 'Intensif'];
const FIELDS: Field[] = [
  { key: 'name', label: 'Nama Siswa', required: true },
  { key: 'gender', label: 'Jenis Kelamin', type: 'select', options: ['L', 'P'] },
  { key: 'program', label: 'Program', type: 'select', options: PROGRAMS },
  { key: 'kelas', label: 'Kelas', required: true, placeholder: 'Primary 1A' },
  { key: 'dob', label: 'Tanggal Lahir', placeholder: 'dd/mm/yyyy' },
  { key: 'parent', label: 'Orang Tua / Wali', required: true },
  { key: 'phone', label: 'No. HP', type: 'tel', required: true },
  { key: 'status', label: 'Status', type: 'select', options: ['Aktif', 'Nonaktif', 'Lulus'] },
];

export default function DataSiswa() {
  const [q, setQ] = useState('');
  const [program, setProgram] = useState('');
  const [kelas, setKelas] = useState('');
  const [status, setStatus] = useState('');
  const [gender, setGender] = useState('');

  const crud = useCrud<AdminStudent>(STUDENTS, {
    label: 'Siswa',
    fields: FIELDS,
    create: (v, rows) => ({
      id: String(Math.max(...rows.map((r) => Number(r.id)), 2401000) + 1), name: v.name, gender: v.gender as 'L' | 'P', program: v.program, kelas: v.kelas,
      dob: v.dob || '-', age: 0, parent: v.parent, phone: v.phone, status: v.status as AdminStudent['status'],
    }),
    detail: (s) => [['NIS', s.id], ['Nama', s.name], ['Jenis Kelamin', s.gender === 'L' ? 'Laki-laki' : 'Perempuan'], ['Program', s.program], ['Kelas', s.kelas], ['Tanggal Lahir', s.dob], ['Orang Tua / Wali', s.parent], ['No. HP', s.phone], ['Status', <Badge>{s.status}</Badge>]],
  });

  const rows = crud.rows.filter((s) =>
    (!q || `${s.name} ${s.id} ${s.parent}`.toLowerCase().includes(q.toLowerCase())) &&
    (!program || s.program === program) && (!kelas || s.kelas === kelas) && (!status || s.status === status) &&
    (!gender || (gender === 'Laki-laki' ? s.gender === 'L' : s.gender === 'P')));
  const reset = () => { setQ(''); setProgram(''); setKelas(''); setStatus(''); setGender(''); };
  const doExport = () => exportCsv('data-siswa', ['NIS', 'Nama', 'Program', 'Kelas', 'Tgl Lahir', 'Orang Tua', 'No HP', 'Status'], rows.map((s) => [s.id, s.name, s.program, s.kelas, s.dob, s.parent, s.phone, s.status]));

  const columns: Col<AdminStudent>[] = [
    { header: 'No', cell: (_, i) => i + 1, align: 'center' },
    { header: 'Nama Siswa', cell: (s) => <Person name={s.name} sub={`NIS: ${s.id}`} /> },
    { header: 'Program', cell: (s) => <Badge tone={programTone(s.program)}>{s.program}</Badge> },
    { header: 'Kelas', cell: (s) => s.kelas },
    { header: 'Tgl. Lahir', cell: (s) => <>{s.dob}{s.age > 0 && <span className="block text-[11px] text-slate-500">({s.age} thn)</span>}</> },
    { header: 'Orang Tua / Wali', cell: (s) => s.parent },
    { header: 'No. HP', cell: (s) => <span className="whitespace-nowrap">{s.phone}</span> },
    { header: 'Status', cell: (s) => <Badge>{s.status}</Badge> },
    {
      header: 'Aksi', align: 'center',
      cell: (s) => <RowActions onView={() => crud.view(s)} onEdit={() => crud.edit(s)} menu={[
        { label: s.status === 'Aktif' ? 'Nonaktifkan' : 'Aktifkan', onClick: () => crud.patch(s.id, { status: s.status === 'Aktif' ? 'Nonaktif' : 'Aktif' }) },
        { label: 'Kirim ke Wali Murid', onClick: () => soon('Kirim ke Wali Murid') },
        { label: 'Hapus', onClick: () => crud.remove(s), danger: true },
      ]} />,
    },
  ];

  const quick: { label: string; icon: typeof Users; tone: Tone; onClick: () => void }[] = [
    { label: 'Tambah Siswa Baru', icon: UserPlus, tone: 'blue', onClick: crud.add },
    { label: 'Import Data Siswa', icon: Upload, tone: 'green', onClick: () => soon('Import Data Siswa') },
    { label: 'Cetak Daftar Siswa', icon: Printer, tone: 'purple', onClick: () => window.print() },
    { label: 'Export ke Excel', icon: FileSpreadsheet, tone: 'green', onClick: doExport },
    { label: 'Kirim ke Wali Murid', icon: MessageCircle, tone: 'orange', onClick: () => soon('Kirim ke Wali Murid') },
    { label: 'Laporan Siswa', icon: FileText, tone: 'blue', onClick: () => soon('Laporan Siswa') },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-4 max-w-[1500px]">
        <PageHead
          title="Data Siswa"
          subtitle="Kelola semua data siswa bimbel Anda dengan mudah dan terstruktur."
          actions={<>
            <Btn icon={Upload} onClick={() => soon('Impor Data Siswa')}>Impor Data Siswa</Btn>
            <Btn icon={Download} onClick={doExport} className="!text-emerald-700">Export</Btn>
            <Btn variant="primary" icon={Plus} onClick={crud.add}>Tambah Siswa Baru</Btn>
          </>}
        />
        <StatCards items={[
          { label: 'Total Siswa', value: '1.248', sub: '▲ 12% dari bulan lalu', subTone: 'up', icon: Users, tone: 'blue' },
          { label: 'Siswa Aktif', value: '1.186', sub: '95,02% dari total', subTone: 'up', icon: UserCheck, tone: 'green' },
          { label: 'Siswa Nonaktif', value: '62', sub: '4,98% dari total', icon: UserX, tone: 'orange' },
          { label: 'Siswa Baru (Bulan Ini)', value: '18', sub: '▲ 5 dari bulan lalu', subTone: 'up', icon: UserPlus, tone: 'purple' },
          { label: 'Lulus / Keluar', value: '24', sub: 'Bulan ini', icon: GraduationCap, tone: 'red' },
        ]} />

        <FilterBar onReset={reset}>
          <SearchInput value={q} onChange={setQ} placeholder="Cari nama, NIS, atau orang tua..." />
          <Select value={program} onChange={setProgram} all="Semua Program" options={PROGRAMS} />
          <Select value={kelas} onChange={setKelas} all="Semua Kelas" options={[...new Set(crud.rows.map((s) => s.kelas))].sort()} />
          <Select value={status} onChange={setStatus} all="Semua Status" options={['Aktif', 'Nonaktif', 'Lulus']} />
          <Select value={gender} onChange={setGender} all="Semua Jenis Kelamin" options={['Laki-laki', 'Perempuan']} />
        </FilterBar>

        <DataTable columns={columns} rows={rows} rowKey={(s) => s.id} selectable />

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-4">
          <InfoBox items={['Data siswa digunakan untuk keperluan administrasi dan operasional bimbel.', 'Untuk data nilai, tugas, absensi, dan materi dikelola oleh guru.', 'Pastikan data orang tua / wali selalu diperbarui.']} />
          <Panel title="Aksi Cepat">
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {quick.map((a) => (
                <button key={a.label} onClick={a.onClick} className="rounded-xl border border-slate-100 hover:border-blue-300 p-2.5 flex flex-col items-center gap-1.5 text-center transition-colors">
                  <a.icon className="w-6 h-6" style={{ color: TONE_HEX[a.tone] }} />
                  <span className="text-[11px] font-bold text-slate-700 leading-tight">{a.label}</span>
                </button>
              ))}
            </div>
          </Panel>
        </div>
        {crud.dialogs}
      </div>
    </DashboardLayout>
  );
}
