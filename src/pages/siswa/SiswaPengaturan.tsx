import { useState } from 'react';
import { api, ApiError } from '../../lib/api';
import { useAppStore, type User as AccountUser } from '../../store/useAppStore';
import {
  User, Bell, ShieldCheck, Lock, Monitor, Globe, MoreHorizontal, Pencil, Camera, Mail, School, Users, Trash2,
  ChevronRight, Check, ArrowRight, Smartphone, Tablet, Headphones, MessageCircle, X,
} from 'lucide-react';
import { toast } from 'sonner';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, PageTitle, Pill } from '../../components/siswa/PortalUI';
import { cn } from '../../lib/utils';
import { ADMIN_WA, STUDENT, hydrateStudentPortal } from '../../data/siswaPortal';

type Tab = 'akun' | 'notifikasi' | 'keamanan' | 'privasi' | 'tampilan' | 'bahasa';
const TABS: { id: Tab; label: string; icon: typeof User }[] = [
  { id: 'akun', label: 'Akun', icon: User },
  { id: 'notifikasi', label: 'Notifikasi', icon: Bell },
  { id: 'keamanan', label: 'Keamanan', icon: ShieldCheck },
  { id: 'privasi', label: 'Privasi', icon: Lock },
  { id: 'tampilan', label: 'Tampilan', icon: Monitor },
  { id: 'bahasa', label: 'Bahasa', icon: Globe },
];

function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button role="switch" aria-checked={on} aria-label={label} onClick={() => onChange(!on)}
      className={cn('w-11 h-6 rounded-full relative transition-colors shrink-0', on ? 'bg-[#1D4ED8]' : 'bg-slate-300')}>
      <span className={cn('absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all', on ? 'left-[22px]' : 'left-0.5')} />
    </button>
  );
}

export default function SiswaPengaturan() {
  const [tab, setTab] = useState<Tab>('akun');
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ email: STUDENT.email, phone: STUDENT.phone });
  const [notif, setNotif] = useState({ tugas: true, jadwal: true, nilai: true, pembayaran: true, promo: false });
  const [privacy, setPrivacy] = useState({ leaderboard: true, parentReport: true });
  const [theme, setTheme] = useState<'terang' | 'sistem'>('terang');
  const [lang, setLang] = useState('Bahasa Indonesia');
  const [pwOpen, setPwOpen] = useState(false);

  const waAdmin = (msg: string) => window.open(`https://wa.me/${ADMIN_WA}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');

  const settings = [
    { icon: Lock, t: 'Ubah Kata Sandi', d: 'Ubah kata sandi akun Anda secara berkala untuk keamanan.', btn: 'Ubah', act: () => setPwOpen(true) },
    { icon: Mail, t: 'Email Pemulihan', d: 'Kelola email pemulihan untuk membantu mengamankan akun Anda.', btn: 'Kelola', act: () => setEditing(true) },
    { icon: School, t: 'Informasi Sekolah', d: 'Kelola informasi sekolah dan kelas Anda.', btn: 'Kelola', act: () => waAdmin(`Halo Admin, saya ${STUDENT.name} ingin memperbarui informasi sekolah.`) },
    { icon: Users, t: 'Orang Tua / Wali', d: 'Kelola data orang tua atau wali yang terhubung dengan akun Anda.', btn: 'Kelola', act: () => waAdmin(`Halo Admin, saya ${STUDENT.name} ingin memperbarui data orang tua/wali.`) },
    { icon: Trash2, t: 'Hapus Akun', d: 'Penghapusan akun diproses oleh admin bimbel.', btn: 'Hapus', danger: true, act: () => toast.info('Penghapusan akun harus diajukan ke admin bimbel.', { description: 'Gunakan tombol Hubungi Admin di samping.' }) },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-[1400px] grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-4">
        <div className="min-w-0 space-y-3">
          <PageTitle title="Pengaturan" subtitle="Kelola akun, preferensi, keamanan, dan lainnya." />

          <Card className="flex overflow-x-auto px-2">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setTab(id)} className={cn('flex items-center gap-2 px-4 py-3.5 text-sm font-bold border-b-2 whitespace-nowrap', tab === id ? 'border-[#1D4ED8] text-[#1D4ED8]' : 'border-transparent text-slate-700')}>
                <Icon className="w-4 h-4" /> {label}
              </button>
            ))}
            <span className="flex items-center gap-2 px-4 py-3.5 text-sm font-bold text-slate-400"><MoreHorizontal className="w-4 h-4" /> Lainnya</span>
          </Card>

          {tab === 'akun' && (
            <>
              <Card className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-extrabold text-[#0F1E4A]">Informasi Akun</h2>
                  {editing ? (
                    <div className="flex gap-2">
                      <button onClick={() => { setEditing(false); setForm({ email: STUDENT.email, phone: STUDENT.phone }); }} className="h-9 px-4 rounded-lg border border-slate-200 text-sm font-bold text-slate-700">Batal</button>
                      <button onClick={() => {
                        api.put<{ user: AccountUser }>('/me', { email: form.email, phone: form.phone })
                          .then((res) => { useAppStore.getState().setUser(res.user); hydrateStudentPortal({ student: { ...STUDENT, email: form.email, phone: form.phone } }); setEditing(false); toast.success('Informasi akun disimpan'); })
                          .catch((err) => toast.error(err instanceof ApiError ? err.first : 'Gagal menyimpan informasi akun.'));
                      }} className="h-9 px-4 rounded-lg bg-[#1D4ED8] text-white text-sm font-bold">Simpan</button>
                    </div>
                  ) : (
                    <button onClick={() => setEditing(true)} className="h-9 px-4 rounded-lg border border-blue-200 text-sm font-bold text-[#1D4ED8] flex items-center gap-1.5 hover:bg-blue-50"><Pencil className="w-3.5 h-3.5" /> Edit Profil</button>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row gap-6 items-start">
                  <div className="relative shrink-0">
                    <img src={STUDENT.avatar} alt="" className="w-28 h-28 rounded-full object-cover bg-blue-50" />
                    <button onClick={() => toast.info('Ganti foto profil melalui admin bimbel.')} aria-label="Ganti foto" className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white border border-slate-200 shadow flex items-center justify-center"><Camera className="w-4 h-4" /></button>
                  </div>
                  <dl className="grid grid-cols-[120px_1fr] gap-y-3 text-sm flex-1">
                    <dt className="font-semibold text-[#0F1E4A]">Nama Lengkap</dt><dd className="text-slate-700">{STUDENT.name}</dd>
                    <dt className="font-semibold text-[#0F1E4A]">Email</dt>
                    <dd className="flex items-center gap-2">
                      {editing ? <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="h-8 px-2 rounded-lg border border-slate-200 w-full max-w-xs" />
                        : <><span className="text-slate-700">{form.email}</span><Pill tone="green">Terverifikasi</Pill></>}
                    </dd>
                    <dt className="font-semibold text-[#0F1E4A]">Nomor HP</dt>
                    <dd className="flex items-center gap-2">
                      {editing ? <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="h-8 px-2 rounded-lg border border-slate-200 w-full max-w-xs" />
                        : <><span className="text-slate-700">{form.phone}</span><Pill tone="green">Terverifikasi</Pill></>}
                    </dd>
                    <dt className="font-semibold text-[#0F1E4A]">Tanggal Lahir</dt><dd className="text-slate-700">{STUDENT.birthDate}</dd>
                    <dt className="font-semibold text-[#0F1E4A]">ID Siswa</dt><dd className="text-slate-700">{STUDENT.id}</dd>
                  </dl>
                </div>
              </Card>

              <Card className="p-4">
                <h2 className="font-extrabold text-[#0F1E4A] mb-2">Pengaturan Akun</h2>
                <div className="divide-y divide-slate-100">
                  {settings.map(({ icon: Icon, t, d, btn, act, danger }) => (
                    <div key={t} className="flex items-center gap-4 py-3">
                      <span className={cn('w-10 h-10 rounded-full flex items-center justify-center', danger ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-700')}><Icon className="w-5 h-5" /></span>
                      <div className="flex-1 min-w-0"><p className="text-sm font-bold text-[#0F1E4A]">{t}</p><p className="text-xs text-slate-600">{d}</p></div>
                      <button onClick={act} className={cn('h-9 w-24 rounded-lg border text-sm font-bold', danger ? 'border-red-200 text-red-600 hover:bg-red-50' : 'border-blue-200 text-[#1D4ED8] hover:bg-blue-50')}>{btn}</button>
                      <ChevronRight className="w-4 h-4 text-slate-500 hidden sm:block" />
                    </div>
                  ))}
                </div>
              </Card>
            </>
          )}

          {tab === 'notifikasi' && (
            <Card className="p-4 divide-y divide-slate-100">
              {([
                ['tugas', 'Tugas & deadline', 'Pengingat tugas baru dan deadline mendekat.'],
                ['jadwal', 'Jadwal Live Tutor', 'Notifikasi saat tutor membuka kelas online.'],
                ['nilai', 'Nilai & rapor', 'Saat nilai tugas atau rapor tersedia.'],
                ['pembayaran', 'Pembayaran', 'Tagihan baru dan konfirmasi pembayaran.'],
                ['promo', 'Promo & info bimbel', 'Informasi program dan promo terbaru.'],
              ] as const).map(([k, t, d]) => (
                <div key={k} className="flex items-center gap-4 py-3">
                  <div className="flex-1"><p className="text-sm font-bold text-[#0F1E4A]">{t}</p><p className="text-xs text-slate-600">{d}</p></div>
                  <Toggle label={t} on={notif[k]} onChange={(v) => setNotif({ ...notif, [k]: v })} />
                </div>
              ))}
            </Card>
          )}

          {tab === 'keamanan' && (
            <Card className="p-4 space-y-3">
              <p className="text-sm text-slate-700">Terakhir mengganti kata sandi: <b>2 bulan lalu</b></p>
              <button onClick={() => setPwOpen(true)} className="h-10 px-4 rounded-xl bg-[#1D4ED8] text-white text-sm font-bold">Ubah Kata Sandi</button>
            </Card>
          )}

          {tab === 'privasi' && (
            <Card className="p-4 divide-y divide-slate-100">
              <div className="flex items-center gap-4 py-3"><div className="flex-1"><p className="text-sm font-bold text-[#0F1E4A]">Tampilkan nama di papan peringkat</p><p className="text-xs text-slate-600">Teman sekelas dapat melihat peringkatmu.</p></div><Toggle label="Papan peringkat" on={privacy.leaderboard} onChange={(v) => setPrivacy({ ...privacy, leaderboard: v })} /></div>
              <div className="flex items-center gap-4 py-3"><div className="flex-1"><p className="text-sm font-bold text-[#0F1E4A]">Kirim laporan ke orang tua</p><p className="text-xs text-slate-600">Laporan kehadiran & nilai dikirim ke WhatsApp wali.</p></div><Toggle label="Laporan orang tua" on={privacy.parentReport} onChange={(v) => setPrivacy({ ...privacy, parentReport: v })} /></div>
            </Card>
          )}

          {tab === 'tampilan' && (
            <Card className="p-4 flex gap-3">
              {(['terang', 'sistem'] as const).map((t) => (
                <button key={t} onClick={() => setTheme(t)} className={cn('flex-1 rounded-xl border p-4 text-left', theme === t ? 'border-[#1D4ED8] bg-[#EAF1FF]' : 'border-slate-200')}>
                  <p className="text-sm font-bold text-[#0F1E4A] capitalize">{t === 'terang' ? 'Terang' : 'Ikuti sistem'}</p>
                  <p className="text-xs text-slate-600">{t === 'terang' ? 'Tampilan standar LearnSpace+' : 'Menyesuaikan pengaturan perangkat'}</p>
                </button>
              ))}
            </Card>
          )}

          {tab === 'bahasa' && (
            <Card className="p-4 flex gap-3">
              {['Bahasa Indonesia', 'English'].map((l) => (
                <button key={l} onClick={() => { setLang(l); toast.success(`Bahasa diatur ke ${l}`); }} className={cn('flex-1 rounded-xl border p-4 text-left flex items-center justify-between', lang === l ? 'border-[#1D4ED8] bg-[#EAF1FF]' : 'border-slate-200')}>
                  <span className="text-sm font-bold text-[#0F1E4A]">{l}</span>{lang === l && <Check className="w-4 h-4 text-[#1D4ED8]" />}
                </button>
              ))}
            </Card>
          )}

          <Card className="p-4 bg-[#F5F8FF] border-blue-100 flex flex-wrap items-center gap-4">
            <ShieldCheck className="w-12 h-12 text-[#1D4ED8]" />
            <div className="flex-1 min-w-[220px]">
              <p className="text-sm font-bold text-[#1D4ED8]">Kami menjaga data dan privasi Anda</p>
              <p className="text-xs text-slate-700">LearnSpace+ menggunakan enkripsi untuk melindungi semua data dan informasi pribadi Anda.</p>
            </div>
          </Card>
        </div>

        <div className="space-y-3 xl:pt-[60px]">
          <Card className="p-4">
            <h2 className="font-extrabold text-[#0F1E4A] mb-3">Keamanan Akun</h2>
            <div className="flex items-center gap-4 mb-3">
              <span className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center"><ShieldCheck className="w-11 h-11 text-emerald-600" /></span>
              <div><p className="text-sm font-bold text-[#0F1E4A]">Status Keamanan</p><p className="text-xl font-extrabold text-emerald-600">Aman</p><p className="text-xs text-slate-600">Akun Anda terlindungi dengan baik.</p></div>
            </div>
            {['Kata sandi kuat', 'Verifikasi email aktif', 'Tidak ada aktivitas mencurigakan', 'Perangkat terpercaya'].map((t) => (
              <p key={t} className="flex items-center gap-2 text-sm text-slate-700 py-1"><Check className="w-4 h-4 text-emerald-600" /> {t}</p>
            ))}
            <button onClick={() => setTab('keamanan')} className="mt-2 w-full text-sm font-bold text-[#1D4ED8] flex items-center justify-center gap-1 hover:underline">Lihat Aktivitas Login <ArrowRight className="w-4 h-4" /></button>
          </Card>

          <Card className="p-4">
            <h2 className="font-extrabold text-[#0F1E4A] mb-2">Perangkat Terhubung</h2>
            {[
              { icon: Monitor, n: 'Windows - Chrome', l: 'Jakarta, Indonesia', s: 'Aktif', c: '#1D4ED8', bg: '#EAF1FF' },
              { icon: Smartphone, n: 'Android - LearnSpace+ App', l: 'Jakarta, Indonesia', s: 'Aktif', c: '#7C3AED', bg: '#F3EDFF' },
              { icon: Tablet, n: 'iPad - Safari', l: 'Jakarta, Indonesia', s: '2 hari lalu', c: '#F97316', bg: '#FFF1E7' },
            ].map(({ icon: Icon, n, l, s, c, bg }) => (
              <div key={n} className="flex items-center gap-3 py-2">
                <span className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: bg, color: c }}><Icon className="w-5 h-5" /></span>
                <div className="flex-1 min-w-0"><p className="text-sm font-bold text-[#0F1E4A] truncate">{n}</p><p className="text-xs text-slate-600">{l}</p></div>
                {s === 'Aktif' ? <Pill tone="green">Aktif</Pill> : <span className="text-[11px] text-slate-500 text-right">Terakhir aktif<br />{s}</span>}
              </div>
            ))}
          </Card>

          <Card className="p-4">
            <h2 className="font-extrabold text-[#0F1E4A] flex items-center gap-2 mb-1"><Headphones className="w-5 h-5 text-[#1D4ED8]" /> Butuh Bantuan?</h2>
            <p className="text-sm text-slate-600 mb-3">Jika Anda mengalami kendala dengan pengaturan akun, hubungi admin bimbel.</p>
            <button onClick={() => waAdmin(`Halo Admin, saya ${STUDENT.name} butuh bantuan pengaturan akun.`)} className="w-full h-10 rounded-xl border border-blue-200 text-[#1D4ED8] text-sm font-bold flex items-center justify-center gap-2 hover:bg-blue-50">
              <MessageCircle className="w-4 h-4" /> Hubungi Admin
            </button>
          </Card>
        </div>
      </div>

      {pwOpen && (
        <div className="fixed inset-0 z-[70] bg-slate-900/40 flex items-center justify-center p-4" onClick={() => setPwOpen(false)}>
          <form className="bg-white rounded-2xl w-full max-w-sm p-5 space-y-3" onClick={(e) => e.stopPropagation()}
            onSubmit={(e) => {
              e.preventDefault();
              const data = new FormData(e.currentTarget);
              const next = String(data.get('next') ?? '');
              if (next.length < 8) { toast.error('Kata sandi baru minimal 8 karakter'); return; }
              if (next !== data.get('confirm')) { toast.error('Konfirmasi kata sandi tidak sama'); return; }
              api.put('/me/password', { currentPassword: String(data.get('current') ?? ''), password: next })
                .then(() => { setPwOpen(false); toast.success('Kata sandi berhasil diubah'); })
                .catch((err) => toast.error(err instanceof ApiError ? err.first : 'Gagal mengubah kata sandi.'));
            }}>
            <div className="flex items-center justify-between"><h3 className="text-lg font-extrabold text-[#0F1E4A]">Ubah Kata Sandi</h3><button type="button" onClick={() => setPwOpen(false)} aria-label="Tutup"><X className="w-5 h-5 text-slate-500" /></button></div>
            {[['current', 'Kata sandi saat ini'], ['next', 'Kata sandi baru'], ['confirm', 'Ulangi kata sandi baru']].map(([n, l]) => (
              <label key={n} className="block text-sm font-bold text-[#0F1E4A]">{l}
                <input name={n} type="password" required className="mt-1 w-full h-10 px-3 rounded-lg border border-slate-200 font-normal" />
              </label>
            ))}
            <button type="submit" className="w-full h-11 rounded-xl bg-[#1D4ED8] text-white text-sm font-bold">Simpan</button>
          </form>
        </div>
      )}
    </DashboardLayout>
  );
}
