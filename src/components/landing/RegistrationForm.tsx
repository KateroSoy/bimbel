import { useEffect, useState, type FormEvent } from 'react';
import { CheckCircle2, Loader2, Send, X } from 'lucide-react';
import { api, ApiError } from '../../lib/api';
import { whatsappUrl } from '../../lib/contact';
import { cn } from '../../lib/utils';

const LEVELS = ['Early Childhood', 'Kids', 'Teens'];

type Form = {
  name: string; age: string; gender: string; parentName: string; phone: string; email: string;
  school: string; level: string; method: string; note: string; website: string;
};
const EMPTY: Form = { name: '', age: '', gender: '', parentName: '', phone: '', email: '', school: '', level: '', method: '', note: '', website: '' };

const input = 'w-full h-11 px-3.5 rounded-xl border border-[#DCE3EE] bg-white text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#062564]/25 focus:border-[#062564]';

function Field({ label, required, children, error }: { label: string; required?: boolean; children: React.ReactNode; error?: string }) {
  return (
    <label className="block">
      <span className="block text-xs font-extrabold text-[#062564] mb-1.5">{label}{required && <span className="text-[#E52833]"> *</span>}</span>
      {children}
      {error && <span className="block text-[11px] font-semibold text-[#E52833] mt-1">{error}</span>}
    </label>
  );
}

/** Sign-up form; posts to /public/registrations so the entry shows up in Admin → Pendaftaran Siswa Baru. */
export function RegistrationForm({ program, methods, level, compact }: { program: string; methods?: string[]; level?: string; compact?: boolean }) {
  const [form, setForm] = useState<Form>({ ...EMPTY, level: level ?? '', method: methods?.length === 1 ? methods[0] : '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [doneId, setDoneId] = useState<string | null>(null);
  const set = (key: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setForm({ ...form, [key]: e.target.value });

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErrors({});
    try {
      const res = await api.post<{ data: { id: string } }>('/public/registrations', {
        ...form, program, age: form.age ? Number(form.age) : null,
        gender: form.gender || null, method: form.method || null, email: form.email || null,
      });
      setDoneId(res.data.id);
    } catch (err) {
      if (err instanceof ApiError && Object.keys(err.errors).length) {
        setErrors(Object.fromEntries(Object.entries(err.errors).map(([k, v]) => [k, v[0]])));
      } else {
        setErrors({ form: err instanceof ApiError && err.status === 429 ? 'Terlalu banyak percobaan. Coba lagi dalam 1 menit.' : err instanceof Error ? err.message : 'Gagal mengirim formulir.' });
      }
    } finally {
      setBusy(false);
    }
  };

  if (doneId) {
    const wa = whatsappUrl(`Halo StudyHack, saya ${form.parentName} sudah mendaftarkan ${form.name} untuk program ${program} (No. ${doneId}). Mohon info jadwal Tes Diagnostik.`);
    return (
      <div className="text-center py-6">
        <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto mb-3" />
        <h4 className="text-xl font-extrabold text-[#062564] mb-1">Pendaftaran terkirim!</h4>
        <p className="text-sm text-slate-600 font-medium mb-1">Nomor pendaftaran <strong className="text-[#062564]">{doneId}</strong></p>
        <p className="text-sm text-slate-600 font-medium mb-5 max-w-sm mx-auto">Tim kami akan menghubungi Anda melalui WhatsApp untuk jadwal Tes Diagnostik GRATIS.</p>
        <a href={wa} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 h-11 px-6 rounded-full bg-emerald-600 text-white text-sm font-extrabold hover:bg-emerald-700">
          Konfirmasi via WhatsApp
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-3.5" noValidate>
      <div className="rounded-xl bg-orange-50 border border-orange-100 px-3.5 py-2.5 text-[13px] font-bold text-[#062564]">
        Program: <span className="text-[#F16710]">{program}</span>
      </div>
      <div className={cn('grid gap-3.5', compact ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2')}>
        <Field label="Nama Lengkap Anak" required error={errors.name}>
          <input className={input} value={form.name} onChange={set('name')} placeholder="Nama calon siswa" required maxLength={120} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Usia" error={errors.age}>
            <input className={input} type="number" min={1} max={30} value={form.age} onChange={set('age')} placeholder="Tahun" />
          </Field>
          <Field label="Jenis Kelamin" error={errors.gender}>
            <select className={input} value={form.gender} onChange={set('gender')}>
              <option value="">Pilih</option><option value="L">Laki-laki</option><option value="P">Perempuan</option>
            </select>
          </Field>
        </div>
        <Field label="Nama Orang Tua / Wali" required error={errors.parentName}>
          <input className={input} value={form.parentName} onChange={set('parentName')} placeholder="Nama orang tua" required maxLength={120} />
        </Field>
        <Field label="No. WhatsApp" required error={errors.phone}>
          <input className={input} type="tel" value={form.phone} onChange={set('phone')} placeholder="08xx-xxxx-xxxx" required maxLength={30} />
        </Field>
        <Field label="Email" error={errors.email}>
          <input className={input} type="email" value={form.email} onChange={set('email')} placeholder="opsional" maxLength={191} />
        </Field>
        <Field label="Asal Sekolah" error={errors.school}>
          <input className={input} value={form.school} onChange={set('school')} placeholder="opsional" maxLength={191} />
        </Field>
        <Field label="Jenjang" error={errors.level}>
          <select className={input} value={form.level} onChange={set('level')}>
            <option value="">Pilih jenjang</option>
            {LEVELS.map((l) => <option key={l}>{l}</option>)}
          </select>
        </Field>
        <Field label="Metode Belajar" error={errors.method}>
          <select className={input} value={form.method} onChange={set('method')}>
            <option value="">Pilih metode</option>
            {(methods ?? ['Tatap Muka', 'Online']).map((m) => <option key={m}>{m}</option>)}
          </select>
        </Field>
      </div>
      <Field label="Catatan" error={errors.note}>
        <textarea className={cn(input, 'h-20 py-2.5 resize-none')} value={form.note} onChange={set('note')} placeholder="Jadwal yang diinginkan, kode teman (promo Bawa Teman), dll." maxLength={1000} />
      </Field>
      {/* Honeypot for bots */}
      <input type="text" name="website" value={form.website} onChange={set('website')} tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      {errors.form && <p className="text-sm font-semibold text-[#E52833]">{errors.form}</p>}
      <button type="submit" disabled={busy} className="w-full h-12 rounded-full bg-[#F16710] hover:bg-[#d95b0e] disabled:opacity-60 text-white text-sm font-extrabold inline-flex items-center justify-center gap-2 shadow-md shadow-orange-500/20 cursor-pointer">
        {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} Daftar Sekarang
      </button>
      <p className="text-[11px] text-slate-500 font-medium text-center">Gratis Tes Diagnostik untuk memetakan kemampuan awal anak.</p>
    </form>
  );
}

const OPEN_EVENT = 'studyhack:register';

/** Opens the registration modal from anywhere on the landing page. */
export function openRegistration(program: string, level?: string) {
  window.dispatchEvent(new CustomEvent(OPEN_EVENT, { detail: { program, level } }));
}

export function RegistrationModalHost() {
  const [state, setState] = useState<{ program: string; level?: string } | null>(null);

  useEffect(() => {
    const onOpen = (e: Event) => setState((e as CustomEvent<{ program: string; level?: string }>).detail);
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_EVENT, onOpen);
  }, []);
  useEffect(() => {
    if (!state) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setState(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [state]);

  if (!state) return null;
  return (
    <div className="fixed inset-0 z-[80] bg-slate-900/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={() => setState(null)}>
      <div role="dialog" aria-modal="true" aria-label="Formulir pendaftaran" className="bg-white w-full sm:max-w-2xl max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl p-6 sm:p-7 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h3 className="text-xl font-extrabold text-[#062564]">Formulir Pendaftaran</h3>
            <p className="text-sm text-slate-500 font-medium">Isi data berikut, tim StudyHack akan segera menghubungi Anda.</p>
          </div>
          <button onClick={() => setState(null)} aria-label="Tutup" className="w-9 h-9 shrink-0 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
        <RegistrationForm key={state.program} program={state.program} level={state.level} compact />
      </div>
    </div>
  );
}
