import { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserRound, Bell, ShieldCheck, Monitor, Link2, Info, ChevronRight, ChevronDown, type LucideIcon } from 'lucide-react';
import { toast } from 'sonner';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { PageHead, Panel, Btn, Select, soon } from '../../components/portal/Kit';
import { cn } from '../../lib/utils';

const SECTIONS: { id: string; icon: LucideIcon; bg: string; fg: string; title: string; desc: string }[] = [
  { id: 'akun', icon: UserRound, bg: '#EAF1FF', fg: '#1D4ED8', title: 'Akun', desc: 'Kelola profil, informasi pribadi, dan kontak akun Anda.' },
  { id: 'notifikasi', icon: Bell, bg: '#E7F8EE', fg: '#16A34A', title: 'Notifikasi', desc: 'Atur pengumuman, pesan, tugas, presensi, dan notifikasi lainnya.' },
  { id: 'keamanan', icon: ShieldCheck, bg: '#F1EBFF', fg: '#6D28D9', title: 'Keamanan', desc: 'Kelola password, verifikasi dua langkah, perangkat aktif, dan login.' },
  { id: 'tampilan', icon: Monitor, bg: '#FFF4E5', fg: '#F59E0B', title: 'Tampilan & Bahasa', desc: 'Atur tema, ukuran font, bahasa, zona waktu, dan format tanggal/waktu.' },
  { id: 'integrasi', icon: Link2, bg: '#E6F7F8', fg: '#0E7490', title: 'Integrasi & Data', desc: 'Kelola aplikasi terhubung, backup, dan ekspor data akun Anda.' },
  { id: 'tentang', icon: Info, bg: '#FDECF3', fg: '#DB2777', title: 'Tentang & Bantuan', desc: 'Pusat bantuan, kebijakan privasi, syarat & ketentuan, dan informasi aplikasi.' },
];
const NOTIFS = ['Pengumuman', 'Pesan', 'Tugas & Assessment', 'Presensi', 'Pengingat Jadwal'];

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex items-center justify-between gap-3 py-2 text-sm font-semibold text-slate-800 cursor-pointer">
      {label}
      <button type="button" role="switch" aria-checked={checked} aria-label={label} onClick={() => onChange(!checked)} className={cn('w-10 h-6 rounded-full p-0.5 transition-colors', checked ? 'bg-[#1D4ED8]' : 'bg-slate-300')}>
        <span className={cn('block w-5 h-5 rounded-full bg-white transition-transform', checked && 'translate-x-4')} />
      </button>
    </label>
  );
}

export default function PengaturanGuru() {
  const [open, setOpen] = useState('');
  const [notifs, setNotifs] = useState<Record<string, boolean>>(Object.fromEntries(NOTIFS.map((n) => [n, true])));
  const [twoStep, setTwoStep] = useState(false);
  const [passwords, setPasswords] = useState({ current: '', next: '' });
  const [language, setLanguage] = useState('Bahasa Indonesia');
  const [fontSize, setFontSize] = useState('Normal');
  const [timezone, setTimezone] = useState('WIB (GMT+7)');
  const input = 'w-full h-10 px-3 rounded-lg border border-slate-200 text-[13px] font-medium outline-none focus:border-[#1D4ED8]';

  const changePassword = () => {
    if (!passwords.current || passwords.next.length < 8) { toast.error('Isi password saat ini dan password baru minimal 8 karakter.'); return; }
    setPasswords({ current: '', next: '' });
    toast.success('Password diperbarui');
  };

  const body: Record<string, React.ReactNode> = {
    akun: <p className="text-sm text-slate-600 font-medium">Nama, email, nomor telepon, dan foto dikelola di halaman profil. <Link to="/guru/profil" className="font-bold text-[#1D4ED8] hover:underline">Buka Profil Saya</Link></p>,
    notifikasi: <div className="max-w-md divide-y divide-slate-100">{NOTIFS.map((n) => <Toggle key={n} label={n} checked={notifs[n]} onChange={(v) => setNotifs((p) => ({ ...p, [n]: v }))} />)}</div>,
    keamanan: (
      <div className="max-w-md space-y-3">
        <label className="block"><span className="block text-xs font-bold text-slate-700 mb-1">Password Saat Ini</span><input type="password" autoComplete="current-password" value={passwords.current} onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))} className={input} /></label>
        <label className="block"><span className="block text-xs font-bold text-slate-700 mb-1">Password Baru (min. 8 karakter)</span><input type="password" autoComplete="new-password" value={passwords.next} onChange={(e) => setPasswords((p) => ({ ...p, next: e.target.value }))} className={input} /></label>
        <Btn variant="primary" onClick={changePassword}>Perbarui Password</Btn>
        <Toggle label="Verifikasi dua langkah" checked={twoStep} onChange={setTwoStep} />
      </div>
    ),
    tampilan: (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl">
        <label className="block"><span className="block text-xs font-bold text-slate-700 mb-1">Bahasa</span><Select value={language} onChange={setLanguage} options={['Bahasa Indonesia', 'English']} /></label>
        <label className="block"><span className="block text-xs font-bold text-slate-700 mb-1">Ukuran Font</span><Select value={fontSize} onChange={setFontSize} options={['Kecil', 'Normal', 'Besar']} /></label>
        <label className="block"><span className="block text-xs font-bold text-slate-700 mb-1">Zona Waktu</span><Select value={timezone} onChange={setTimezone} options={['WIB (GMT+7)', 'WITA (GMT+8)', 'WIT (GMT+9)']} /></label>
      </div>
    ),
    integrasi: <div className="flex flex-wrap gap-2"><Btn onClick={() => soon('Hubungkan Google Classroom / Meet')}>Hubungkan Google</Btn><Btn onClick={() => soon('Ekspor data akun')}>Ekspor Data Akun</Btn></div>,
    tentang: (
      <div className="text-sm text-slate-600 font-medium space-y-1.5">
        <p><b className="text-[#0F1E4A]">LearnSpace+ by StudyHack</b> · Portal Tutor</p>
        <p>Butuh bantuan? Hubungi admin bimbel melalui menu <Link to="/guru/pesan" className="font-bold text-[#1D4ED8] hover:underline">Pesan</Link>.</p>
        <div className="flex flex-wrap gap-2 pt-1"><Btn size="sm" onClick={() => soon('Kebijakan Privasi')}>Kebijakan Privasi</Btn><Btn size="sm" onClick={() => soon('Syarat & Ketentuan')}>Syarat & Ketentuan</Btn></div>
      </div>
    ),
  };

  return (
    <DashboardLayout>
      <div className="space-y-4 max-w-[1300px]">
        <PageHead title="Pengaturan" subtitle="Kelola preferensi akun Anda." />
        <Panel className="!py-1 !px-6">
          <ul className="divide-y divide-slate-100">
            {SECTIONS.map((s) => {
              const expanded = open === s.id;
              return (
                <li key={s.id}>
                  <button onClick={() => setOpen(expanded ? '' : s.id)} aria-expanded={expanded} className="w-full flex items-center gap-5 py-5 text-left">
                    <span className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: s.bg, color: s.fg }}><s.icon className="w-7 h-7" /></span>
                    <span className="flex-1 min-w-0"><span className="block text-[17px] font-extrabold text-[#0F1E4A]">{s.title}</span><span className="block text-sm text-slate-600 font-medium mt-0.5">{s.desc}</span></span>
                    {expanded ? <ChevronDown className="w-5 h-5 text-[#0F1E4A] shrink-0" /> : <ChevronRight className="w-5 h-5 text-[#0F1E4A] shrink-0" />}
                  </button>
                  {expanded && <div className="pb-5 sm:pl-[76px]">{body[s.id]}</div>}
                </li>
              );
            })}
          </ul>
        </Panel>
      </div>
    </DashboardLayout>
  );
}
