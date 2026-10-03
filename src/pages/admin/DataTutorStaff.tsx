import { useState } from 'react';
import { Users, UserCheck, UserCog, UserX, Award, Upload, Download, Plus, CalendarDays, Scale, ClipboardCheck, Printer, MessageCircle } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import {
  PageHead, StatCards, FilterBar, SearchInput, Select, DataTable, Person, Badge, RowActions, Btn, InfoBox, Panel, DonutPanel, QuickList, BarList,
  WithRail, useCrud, exportCsv, soon, TONE_HEX, type Col, type Field,
} from '../../components/portal/Kit';
import { programTone, type StaffRow } from '../../data/adminPortal';

const TEACH = ['English Primary', 'Math Primary', 'Combo', 'English Teens', 'Intensif', 'IPA Junior'];
const FIELDS: Field[] = [
  { key: 'name', label: 'Nama Lengkap', required: true },
  { key: 'email', label: 'Email', type: 'email', required: true },
  { key: 'role', label: 'Peran', type: 'select', options: ['Tutor', 'Staff'] },
  { key: 'program', label: 'Program Mengajar / Tugas', type: 'select', options: [...TEACH, 'Administrasi', 'Keuangan', 'Customer Service', 'IT Support'] },
  { key: 'phone', label: 'No. HP', type: 'tel', required: true },
  { key: 'status', label: 'Status', type: 'select', options: ['Aktif', 'Nonaktif'] },
];

export default function DataTutorStaff() {
  const [q, setQ] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');
  const [program, setProgram] = useState('');

  const crud = useCrud<StaffRow & { program?: string }>('staff', {
    label: 'Tutor / Staff',
    fields: FIELDS,
    create: (v, rows) => {
      const prefix = v.role === 'Tutor' ? 'TUT' : 'STF';
      const n = rows.filter((r) => r.id.startsWith(prefix)).length + 1;
      return { id: `${prefix}-${String(n).padStart(3, '0')}`, name: v.name, email: v.email, role: v.role as StaffRow['role'], programs: [v.program], program: v.program, phone: v.phone, status: v.status as StaffRow['status'], joined: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }) };
    },
    detail: (s) => [['NIP / ID', s.id], ['Nama', s.name], ['Email', s.email], ['Peran', s.role], ['Program / Tugas', programsOf(s).join(', ')], ['No. HP', s.phone], ['Bergabung', s.joined], ['Status', <Badge>{s.status}</Badge>]],
  });

  const rows = crud.rows.filter((s) =>
    (!q || `${s.name} ${s.id} ${s.phone} ${s.email}`.toLowerCase().includes(q.toLowerCase())) && (!role || s.role === role) &&
    (!status || s.status === status) && (!program || programsOf(s).includes(program)));
  const n = (f: (s: StaffRow) => boolean) => crud.rows.filter(f).length;
  const doExport = () => exportCsv('tutor-staff', ['ID', 'Nama', 'Email', 'Peran', 'Program', 'No HP', 'Status', 'Bergabung'], rows.map((s) => [s.id, s.name, s.email, s.role, programsOf(s).join(' / '), s.phone, s.status, s.joined]));

  const columns: Col<StaffRow & { program?: string }>[] = [
    { header: 'No.', cell: (_, i) => i + 1, align: 'center' },
    { header: 'Nama', cell: (s) => <Person name={s.name} sub={s.email} src={s.avatar} /> },
    { header: 'NIP / ID', cell: (s) => <span className="whitespace-nowrap">{s.id}</span> },
    { header: 'Peran', cell: (s) => <Badge tone={s.role === 'Tutor' ? 'blue' : 'green'}>{s.role}</Badge> },
    { header: 'Program Mengajar / Tugas', cell: (s) => <div className="flex flex-wrap gap-1 max-w-[220px]">{programsOf(s).map((p) => <Badge key={p} tone={programTone(p)}>{p}</Badge>)}</div> },
    { header: 'No. HP', cell: (s) => <span className="whitespace-nowrap flex items-center gap-1.5">{s.phone}{s.role === 'Tutor' && <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />}</span> },
    { header: 'Status', cell: (s) => <Badge>{s.status}</Badge> },
    { header: 'Bergabung', cell: (s) => s.joined },
    {
      header: 'Aksi', align: 'center',
      cell: (s) => <RowActions onView={() => crud.view(s)} onEdit={() => crud.edit(s)} menu={[
        { label: s.status === 'Aktif' ? 'Nonaktifkan' : 'Aktifkan', onClick: () => crud.patch(s.id, { status: s.status === 'Aktif' ? 'Nonaktif' : 'Aktif' }) },
        { label: 'Hapus', onClick: () => crud.remove(s), danger: true },
      ]} />,
    },
  ];

  const tutorAktif = n((s) => s.role === 'Tutor' && s.status === 'Aktif');
  const staffAktif = n((s) => s.role === 'Staff' && s.status === 'Aktif');
  const nonaktif = n((s) => s.status === 'Nonaktif');
  const barColors = [TONE_HEX.blue, TONE_HEX.green, TONE_HEX.orange, TONE_HEX.purple, TONE_HEX.blue, TONE_HEX.teal];

  return (
    <DashboardLayout>
      <div className="space-y-4 max-w-[1500px]">
        <PageHead
          title="Data Tutor & Staff"
          subtitle="Kelola data tutor dan staff bimbel Anda."
          actions={<>
            <Btn icon={Upload} onClick={() => soon('Import Data')}>Import Data</Btn>
            <Btn icon={Download} className="!text-emerald-700" onClick={doExport}>Export</Btn>
            <Btn variant="primary" icon={Plus} onClick={crud.add}>Tambah Tutor / Staff</Btn>
          </>}
        />
        <StatCards items={[
          { label: 'Total Tutor & Staff', value: crud.rows.length, sub: '100% dari total', icon: Users, tone: 'blue' },
          { label: 'Tutor Aktif', value: tutorAktif, sub: 'Mengajar aktif', icon: UserCheck, tone: 'green' },
          { label: 'Staff Aktif', value: staffAktif, sub: 'Operasional', icon: UserCog, tone: 'orange' },
          { label: 'Tutor Nonaktif', value: nonaktif, sub: 'Tidak aktif', icon: UserX, tone: 'purple' },
          { label: 'Program Diampu', value: new Set(crud.rows.flatMap(programsOf)).size, sub: 'Program / tugas berbeda', icon: Award, tone: 'teal' },
        ]} />

        <WithRail
          rail={<>
            <DonutPanel title="Ringkasan Tutor & Staff" center={crud.rows.length} sub="Total" data={[
              { label: 'Tutor Aktif', value: tutorAktif, color: '#1D4ED8', note: `${tutorAktif} orang` },
              { label: 'Staff Aktif', value: staffAktif, color: '#16A34A', note: `${staffAktif} orang` },
              { label: 'Nonaktif', value: nonaktif, color: '#EF4444', note: `${nonaktif} orang` },
            ]} />
            <Panel title="Tutor per Program (Aktif)">
              <BarList rows={TEACH.map((p, i) => ({ label: p, value: n((s) => s.status === 'Aktif' && programsOf(s).includes(p)), color: barColors[i] }))} />
            </Panel>
            <QuickList items={[
              { label: 'Tambah Tutor / Staff', icon: Plus, onClick: crud.add },
              { label: 'Import Data Tutor / Staff', icon: Upload },
              { label: 'Jadwal Mengajar', icon: CalendarDays, to: '/admin/jadwal-tutor' },
              { label: 'Beban Mengajar', icon: Scale, to: '/admin/beban' },
              { label: 'Rekap Kehadiran', icon: ClipboardCheck, to: '/admin/kehadiran-tutor' },
              { label: 'Cetak Daftar Tutor & Staff', icon: Printer, onClick: () => window.print() },
            ]} />
          </>}
        >
          <FilterBar onReset={() => { setQ(''); setRole(''); setStatus(''); setProgram(''); }}>
            <SearchInput value={q} onChange={setQ} placeholder="Cari nama, NIP, telepon, email..." />
            <Select value={role} onChange={setRole} all="Semua Peran" options={['Tutor', 'Staff']} />
            <Select value={status} onChange={setStatus} all="Semua Status" options={['Aktif', 'Nonaktif']} />
            <Select value={program} onChange={setProgram} all="Semua Program" options={TEACH} />
          </FilterBar>
          <DataTable columns={columns} rows={rows} rowKey={(s) => s.id} selectable />
          <InfoBox items={['Data tutor digunakan untuk mengelola jadwal, beban mengajar, kehadiran, dan laporan tutor.', 'Pastikan data kontak selalu diperbarui agar komunikasi berjalan lancar.', 'Gunakan fitur import untuk menambah banyak data sekaligus melalui file Excel.']} />
        </WithRail>
        {crud.dialogs}
      </div>
    </DashboardLayout>
  );
}

// Setelah diubah lewat form, program utama mengikuti pilihan form; sisanya tetap.
function programsOf(s: StaffRow & { program?: string }) {
  const programs = s.programs ?? [];
  return s.program && s.program !== programs[0] ? [s.program, ...programs.slice(1)] : programs;
}
