import { useState } from 'react';
import { UserRound, Mail, Phone, GraduationCap, CalendarDays, Pencil, Camera, Award, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { PageHead, Panel, Btn, Badge, FormDialog, soon, TONE_HEX } from '../../components/portal/Kit';
import { useAppStore } from '../../store/useAppStore';
import { TUTOR, ACHIEVEMENTS } from '../../data/guruPortal';

export default function ProfilGuru() {
  const { user, login } = useAppStore();
  const [profile, setProfile] = useState({ name: user?.name || TUTOR.name, email: TUTOR.email, phone: TUTOR.phone, education: TUTOR.education });
  const [editing, setEditing] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const info = [
    [UserRound, 'Nama Lengkap', profile.name], [Mail, 'Email', profile.email], [Phone, 'Nomor Telepon', profile.phone],
    [GraduationCap, 'Pendidikan Terakhir', profile.education], [CalendarDays, 'Bergabung Sejak', TUTOR.joined],
  ] as const;

  return (
    <DashboardLayout>
      <div className="space-y-4 max-w-[1300px]">
        <PageHead title={<span className="flex items-center gap-2">Profil Saya <UserRound className="w-5 h-5 text-[#1D4ED8]" /></span>} subtitle="Kelola informasi profil dan preferensi akun Anda." />

        <Panel className="!p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="relative w-28 h-28 shrink-0">
              <img src={TUTOR.avatar} alt={profile.name} className="w-28 h-28 rounded-full object-cover bg-blue-50" />
              <button aria-label="Ganti foto" onClick={() => soon('Ganti foto profil')} className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-700"><Camera className="w-4 h-4" /></button>
            </div>
            <div className="flex-1 min-w-0">
              <p className="flex flex-wrap items-center gap-2.5 text-xl font-extrabold text-[#0F1E4A]">{profile.name} <Badge tone="blue" className="!text-xs !py-1">{TUTOR.role}</Badge></p>
              <p className="text-sm text-slate-600 font-medium mt-1">{TUTOR.org}</p>
              <p className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-slate-700 font-medium mt-2.5">
                <span className="flex items-center gap-2"><Mail className="w-4 h-4" /> {profile.email}</span>
                <span className="flex items-center gap-2"><Phone className="w-4 h-4" /> {profile.phone}</span>
              </p>
            </div>
            <Btn icon={Pencil} onClick={() => setEditing(true)}>Edit Profil</Btn>
          </div>
        </Panel>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Panel title={<span className="text-lg">Informasi Profil</span>} className="!p-6">
            <dl className="divide-y divide-slate-100">
              {info.map(([Icon, label, value]) => (
                <div key={label} className="flex items-center gap-3 py-3.5 text-sm">
                  <Icon className="w-5 h-5 text-[#0F1E4A] shrink-0" />
                  <dt className="flex-1 text-slate-700 font-medium">{label}</dt>
                  <dd className="font-semibold text-[#0F1E4A] text-right break-all">{value}</dd>
                </div>
              ))}
            </dl>
          </Panel>

          <Panel title={<span className="text-lg">Pencapaian</span>} className="!p-6">
            <ul className="divide-y divide-slate-100">
              {(showAll ? ACHIEVEMENTS : ACHIEVEMENTS.slice(0, 3)).map((a) => (
                <li key={a.title} className="flex gap-4 py-3.5">
                  <span className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${TONE_HEX[a.tone]}1A`, color: TONE_HEX[a.tone] }}><Award className="w-6 h-6" /></span>
                  <div className="flex-1 min-w-0">
                    <p className="flex flex-wrap items-baseline justify-between gap-x-3"><span className="text-[15px] font-extrabold text-[#0F1E4A]">{a.title}</span><span className="text-xs text-slate-500 font-medium">{a.date}</span></p>
                    <p className="text-[13px] text-slate-600 font-medium mt-0.5">{a.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="text-center mt-2">
              <button onClick={() => setShowAll(true)} className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#1D4ED8] hover:underline">Lihat semua pencapaian <ArrowRight className="w-4 h-4" /></button>
            </div>
          </Panel>
        </div>

        <FormDialog
          open={editing}
          title="Edit Profil"
          fields={[{ key: 'name', label: 'Nama Lengkap', required: true }, { key: 'email', label: 'Email', type: 'email', required: true }, { key: 'phone', label: 'Nomor Telepon', type: 'tel', required: true }, { key: 'education', label: 'Pendidikan Terakhir' }]}
          initial={profile}
          onClose={() => setEditing(false)}
          onSubmit={(v) => {
            setProfile({ name: v.name, email: v.email, phone: v.phone, education: v.education });
            if (user) login({ ...user, name: v.name });
            toast.success('Profil diperbarui');
          }}
        />
      </div>
    </DashboardLayout>
  );
}
