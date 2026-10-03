import { useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Mail, Lock, UserRound, Phone, LoaderCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useAppStore } from '../store/useAppStore';
import { api, ApiError } from '../lib/api';
import { Logo } from '../components/ui/Logo';

type Mode = 'login' | 'register' | 'forgot' | 'reset';

const COPY: Record<Mode, { title: string; hint: string; submit: string }> = {
  login: { title: 'Masuk ke LearnSpace+', hint: 'Gunakan email dan password akun Anda', submit: 'Masuk' },
  register: { title: 'Daftar Akun Siswa', hint: 'Buat akun untuk mulai belajar di LearnSpace+', submit: 'Daftar' },
  forgot: { title: 'Lupa Password', hint: 'Kami kirim tautan reset ke email Anda', submit: 'Kirim Tautan Reset' },
  reset: { title: 'Buat Password Baru', hint: 'Masukkan password baru untuk akun Anda', submit: 'Simpan Password' },
};

function Field({ icon: Icon, label, error, ...props }: { icon: typeof Mail; label: string; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block text-left">
      <span className="block text-sm font-bold text-slate-900 mb-1.5">{label}</span>
      <span className={`flex items-center gap-3 px-4 h-12 rounded-xl glass-card transition-all focus-within:bg-white/60 ${error ? 'ring-1 ring-red-400' : ''}`}>
        <Icon className="w-5 h-5 text-slate-500 shrink-0" />
        <input {...props} className="flex-1 min-w-0 bg-transparent outline-none text-sm text-slate-900 placeholder:text-slate-400" />
      </span>
      {error && <span className="block text-xs text-red-600 mt-1">{error}</span>}
    </label>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const { user, token, login, register } = useAppStore();
  const resetToken = params.get('reset');
  const [mode, setMode] = useState<Mode>(resetToken ? 'reset' : 'login');
  const [form, setForm] = useState({ name: '', email: params.get('email') ?? '', phone: '', password: '', confirm: '' });
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [busy, setBusy] = useState(false);

  if (user && token) return <Navigate to={`/${user.role}/dashboard`} replace />;

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const switchTo = (next: Mode) => { setMode(next); setErrors({}); if (next !== 'reset' && resetToken) setParams({}); };
  const err = (key: string) => errors[key]?.[0];

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if ((mode === 'register' || mode === 'reset') && form.password !== form.confirm) {
      setErrors({ confirm: ['Konfirmasi password tidak sama.'] });
      return;
    }
    setBusy(true);
    setErrors({});
    try {
      if (mode === 'login') {
        const u = await login(form.email, form.password);
        navigate(`/${u.role}/dashboard`);
      } else if (mode === 'register') {
        await register({ name: form.name, email: form.email, phone: form.phone || undefined, password: form.password, password_confirmation: form.confirm });
        toast.success('Akun berhasil dibuat');
        navigate('/siswa/dashboard');
      } else if (mode === 'forgot') {
        const res = await api.post<{ message: string }>('/auth/forgot-password', { email: form.email });
        toast.success(res.message);
        switchTo('login');
      } else {
        const res = await api.post<{ message: string }>('/auth/reset-password', { token: resetToken, email: form.email, password: form.password, password_confirmation: form.confirm });
        toast.success(res.message);
        setForm((f) => ({ ...f, password: '', confirm: '' }));
        switchTo('login');
      }
    } catch (error) {
      if (error instanceof ApiError) {
        setErrors(error.errors);
        if (!Object.keys(error.errors).length) toast.error(error.message);
      } else {
        toast.error('Terjadi kesalahan. Coba lagi.');
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-500/20 blur-[100px] rounded-full mix-blend-multiply animate-blob"></div>
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-cyan-400/20 blur-[100px] rounded-full mix-blend-multiply animate-blob" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-400/10 blur-[120px] rounded-full mix-blend-multiply animate-blob" style={{ animationDelay: '4s' }}></div>

      <div className="w-full max-w-md relative z-10">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-3xl p-8 shadow-2xl"
        >
          <div className="text-center mb-8 flex flex-col items-center">
            <div className="mb-5">
              <Logo variant="learnspace" size="xl" showText={true} />
            </div>
            <h1 className="font-display font-bold text-2xl text-slate-900">{COPY[mode].title}</h1>
            <p className="text-slate-500 mt-2">{COPY[mode].hint}</p>
          </div>

          <form onSubmit={submit} className="space-y-4" noValidate>
            {mode === 'register' && <Field icon={UserRound} label="Nama Lengkap" value={form.name} onChange={set('name')} required autoComplete="name" placeholder="Nama siswa" error={err('name')} />}
            <Field icon={Mail} label="Email" type="email" value={form.email} onChange={set('email')} required autoComplete="email" placeholder="nama@email.com" error={err('email')} />
            {mode === 'register' && <Field icon={Phone} label="No. HP (opsional)" type="tel" value={form.phone} onChange={set('phone')} autoComplete="tel" placeholder="08xx-xxxx-xxxx" error={err('phone')} />}
            {mode !== 'forgot' && (
              <Field icon={Lock} label={mode === 'reset' ? 'Password Baru' : 'Password'} type="password" value={form.password} onChange={set('password')} required
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'} placeholder={mode === 'login' ? 'Password' : 'Minimal 8 karakter'} error={err('password')} />
            )}
            {(mode === 'register' || mode === 'reset') && (
              <Field icon={Lock} label="Ulangi Password" type="password" value={form.confirm} onChange={set('confirm')} required autoComplete="new-password" placeholder="Ulangi password" error={err('confirm')} />
            )}

            <button type="submit" disabled={busy} className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold transition-colors flex items-center justify-center gap-2">
              {busy && <LoaderCircle className="w-4 h-4 animate-spin" />}
              {COPY[mode].submit}
            </button>
          </form>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-2 text-sm">
            {mode === 'login' ? (
              <>
                <button type="button" onClick={() => switchTo('forgot')} className="font-semibold text-blue-600 hover:underline">Lupa password?</button>
                <button type="button" onClick={() => switchTo('register')} className="font-semibold text-blue-600 hover:underline">Daftar sebagai siswa</button>
              </>
            ) : (
              <button type="button" onClick={() => switchTo('login')} className="font-semibold text-blue-600 hover:underline">Kembali ke halaman masuk</button>
            )}
          </div>

          <div className="mt-8 text-center">
            <p className="text-xs text-slate-400">
              Akun tutor dan admin dibuat oleh pengelola bimbel.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
