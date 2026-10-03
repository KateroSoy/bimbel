import { ReactNode, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, ChevronLeft, ChevronRight, ChevronDown, Eye, SquarePen, MoreVertical, Info, X, Filter, RotateCcw,
  type LucideIcon,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '../../lib/utils';
import { useResource } from '../../store/useRemote';

/* Kit bersama portal Admin & Tutor LearnSpace+ (mengikuti mockup klien) */

export type Tone = 'green' | 'blue' | 'orange' | 'red' | 'purple' | 'slate' | 'teal' | 'pink' | 'amber';

const BADGE: Record<Tone, string> = {
  green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  blue: 'bg-blue-50 text-blue-700 border-blue-200',
  orange: 'bg-orange-50 text-orange-700 border-orange-200',
  red: 'bg-red-50 text-red-600 border-red-200',
  purple: 'bg-violet-50 text-violet-700 border-violet-200',
  slate: 'bg-slate-100 text-slate-600 border-slate-200',
  teal: 'bg-teal-50 text-teal-700 border-teal-200',
  pink: 'bg-pink-50 text-pink-700 border-pink-200',
  amber: 'bg-amber-50 text-amber-700 border-amber-200',
};

export const TONE_HEX: Record<Tone, string> = {
  green: '#16A34A', blue: '#1D4ED8', orange: '#F97316', red: '#EF4444', purple: '#7C3AED',
  slate: '#94A3B8', teal: '#0EA5B7', pink: '#EC4899', amber: '#F59E0B',
};

export const rupiah = (n: number) => `Rp ${n.toLocaleString('id-ID')}`;
export const soon = (label: string) => toast.info(label, { description: 'Fitur ini akan tersedia pada tahap berikutnya.' });

const STATUS_TONES: Record<string, Tone> = {
  Aktif: 'green', Lunas: 'green', Hadir: 'green', Diterima: 'green', Berhasil: 'green', Dibayar: 'green', Optimal: 'green',
  Baik: 'green', 'Sangat Baik': 'green', Published: 'green', Membaik: 'green', Normal: 'green',
  Nonaktif: 'orange', 'Belum Lunas': 'amber', Terlambat: 'orange', 'Dalam Proses': 'orange', Tertunda: 'orange', Cukup: 'orange',
  'Jatuh Tempo': 'orange', 'Belum Dibayar': 'orange', 'Perlu Perhatian': 'orange', 'Perlu Dinilai': 'orange', Draft: 'orange',
  'Risiko Sedang': 'orange', 'Perlu Perbaikan': 'orange', 'Dalam Perawatan': 'amber',
  'Tidak Hadir': 'red', Ditolak: 'red', Gagal: 'red', Maksimal: 'red', 'Lalu Jatuh Tempo': 'red', 'Risiko Tinggi': 'red',
  Tinggi: 'red', Alpa: 'red', Rusak: 'red',
  'Menunggu Verifikasi': 'purple', Izin: 'purple', Sakit: 'purple', 'Remedial Aktif': 'purple',
  'Sebagian Dibayar': 'blue', Ringan: 'blue', Selesai: 'blue', 'Akan Datang': 'blue', Rendah: 'blue', Refund: 'blue',
  Lulus: 'slate', 'Tidak Mengajar': 'slate', Arsip: 'slate',
};
export const toneOf = (status: string): Tone => STATUS_TONES[status] ?? 'slate';

export function Badge({ tone, children, className }: { tone?: Tone; children: ReactNode; className?: string }) {
  const t = tone ?? (typeof children === 'string' ? toneOf(children) : 'slate');
  return (
    <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[11px] font-bold whitespace-nowrap', BADGE[t], className)}>
      {children}
    </span>
  );
}

type BtnVariant = 'primary' | 'outline' | 'soft' | 'ghost' | 'danger';
const BTN: Record<BtnVariant, string> = {
  primary: 'bg-[#1D4ED8] hover:bg-blue-800 text-white border-transparent',
  outline: 'bg-white hover:bg-slate-50 text-[#1D4ED8] border-slate-200',
  soft: 'bg-[#EAF1FF] hover:bg-blue-100 text-[#1D4ED8] border-transparent',
  ghost: 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200',
  danger: 'bg-red-600 hover:bg-red-700 text-white border-transparent',
};

export function Btn({
  variant = 'outline', icon: Icon, children, onClick, to, className, type = 'button', size = 'md',
}: {
  variant?: BtnVariant; icon?: LucideIcon; children?: ReactNode; onClick?: () => unknown; to?: string;
  className?: string; type?: 'button' | 'submit'; size?: 'sm' | 'md';
}) {
  const cls = cn(
    'inline-flex items-center justify-center gap-2 rounded-lg border font-bold transition-colors whitespace-nowrap',
    size === 'sm' ? 'h-8 px-3 text-xs' : 'h-10 px-4 text-[13px]', BTN[variant], className,
  );
  const body = <>{Icon && <Icon className="w-4 h-4 shrink-0" />}{children}</>;
  if (to) return <Link to={to} className={cls}>{body}</Link>;
  return <button type={type} onClick={onClick} className={cls}>{body}</button>;
}

export function PageHead({ title, subtitle, actions }: { title: ReactNode; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3">
      <div className="min-w-0">
        <h1 className="text-2xl md:text-[26px] font-extrabold text-[#0F1E4A] tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-slate-600 font-medium mt-0.5">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Panel({ title, action, children, className }: { title?: ReactNode; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={cn('bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_2px_rgba(15,30,74,0.04)] p-4', className)}>
      {(title || action) && (
        <div className="flex items-center justify-between gap-3 mb-3">
          <h2 className="text-[15px] font-extrabold text-[#0F1E4A]">{title}</h2>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export const LinkAction = ({ to, onClick, children }: { to?: string; onClick?: () => void; children: ReactNode }) =>
  to ? <Link to={to} className="text-xs font-bold text-[#1D4ED8] hover:underline whitespace-nowrap">{children}</Link>
    : <button onClick={onClick} className="text-xs font-bold text-[#1D4ED8] hover:underline whitespace-nowrap">{children}</button>;

export interface Stat { label: string; value: ReactNode; sub?: ReactNode; icon: LucideIcon; tone: Tone; subTone?: 'up' | 'down' | 'muted'; to?: string }

export function StatCards({ items }: { items: Stat[] }) {
  return (
    <div className={cn('grid grid-cols-1 sm:grid-cols-2 gap-3', items.length >= 6 ? 'lg:grid-cols-3 2xl:grid-cols-6' : 'lg:grid-cols-3 xl:grid-cols-5')}>
      {items.map((s) => {
        const body = (
          <>
            <span className="w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0" style={{ backgroundColor: TONE_HEX[s.tone] }}>
              <s.icon className="w-6 h-6" />
            </span>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide leading-tight line-clamp-2">{s.label}</p>
              <p className={cn('font-extrabold text-[#0F1E4A] leading-tight whitespace-nowrap', String(s.value).length > 10 ? 'text-[15px]' : 'text-xl')}>{s.value}</p>
              {s.sub && (
                <p className={cn('text-[11px] font-semibold truncate', s.subTone === 'up' ? 'text-emerald-600' : s.subTone === 'down' ? 'text-red-600' : 'text-slate-500')}>
                  {s.sub}
                </p>
              )}
            </div>
          </>
        );
        const cls = 'bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_2px_rgba(15,30,74,0.04)] p-4 flex items-center gap-3 min-w-0';
        return s.to
          ? <Link key={s.label} to={s.to} className={cn(cls, 'hover:border-blue-300 transition-colors')}>{body}</Link>
          : <div key={s.label} className={cls}>{body}</div>;
      })}
    </div>
  );
}

/** Ringkasan satu baris ala portal tutor: angka + label dipisah garis */
export function StatStrip({ items, action }: { items: { icon: LucideIcon; value: ReactNode; label: string; color: string }[]; action?: ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        {items.map((s, i) => (
          <div key={s.label} className={cn('flex items-center gap-2.5', i > 0 && 'md:pl-6 md:border-l md:border-slate-200')}>
            <s.icon className="w-6 h-6 shrink-0" style={{ color: s.color }} />
            <div className="leading-tight">
              <p className="text-lg font-extrabold text-[#0F1E4A]">{s.value}</p>
              <p className="text-xs text-slate-600 font-medium">{s.label}</p>
            </div>
          </div>
        ))}
      </div>
      {action}
    </div>
  );
}

export type TabDef = string | { label: string; value?: string; count?: number };

export function Tabs({ tabs, value, onChange, className }: { tabs: TabDef[]; value: string; onChange: (v: string) => void; className?: string }) {
  return (
    <div className={cn('flex gap-1 border-b border-slate-200 overflow-x-auto overflow-y-hidden', className)}>
      {tabs.map((t) => {
        const label = typeof t === 'string' ? t : t.label;
        const val = typeof t === 'string' ? t : t.value ?? t.label;
        const count = typeof t === 'string' ? undefined : t.count;
        const active = val === value;
        return (
          <button
            key={val}
            onClick={() => onChange(val)}
            className={cn(
              'px-4 py-2.5 text-[13px] font-bold whitespace-nowrap border-b-2 -mb-px transition-colors flex items-center gap-1.5',
              active ? 'border-[#1D4ED8] text-[#1D4ED8]' : 'border-transparent text-slate-600 hover:text-slate-900',
            )}
          >
            {label}
            {count !== undefined && (
              <span className={cn('px-1.5 rounded-full text-[10px]', active ? 'bg-[#1D4ED8] text-white' : 'bg-slate-100 text-slate-600')}>{count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export function SearchInput({ value, onChange, placeholder, className }: { value: string; onChange: (v: string) => void; placeholder: string; className?: string }) {
  return (
    <label className={cn('flex items-center gap-2 h-10 px-3 rounded-lg border border-slate-200 bg-white min-w-[200px] flex-1', className)}>
      <Search className="w-4 h-4 text-slate-400 shrink-0" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 min-w-0 bg-transparent outline-none text-[13px] font-medium text-slate-800 placeholder:text-slate-400"
      />
    </label>
  );
}

/** Dropdown filter; opsi pertama (`all`) berarti tanpa filter */
export function Select({ value, onChange, all, options, className }: { value: string; onChange: (v: string) => void; all?: string; options: string[]; className?: string }) {
  return (
    <div className={cn('relative', className)}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none h-10 w-full pl-3 pr-8 rounded-lg border border-slate-200 bg-white text-[13px] font-bold text-slate-800 outline-none focus:border-[#1D4ED8] cursor-pointer"
      >
        {all && <option value="">{all}</option>}
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown className="w-4 h-4 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
    </div>
  );
}

export function FilterBar({ children, onReset, more = true }: { children: ReactNode; onReset?: () => void; more?: boolean }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {children}
      {more && <Btn icon={Filter} onClick={() => soon('Filter Lainnya')}>Filter Lainnya</Btn>}
      {onReset && <Btn variant="ghost" icon={RotateCcw} onClick={onReset}>Reset</Btn>}
    </div>
  );
}

const AVATAR_COLORS = ['#DBEAFE', '#DCFCE7', '#FEF3C7', '#FCE7F3', '#EDE9FE', '#CFFAFE', '#FFEDD5'];
const AVATAR_TEXT = ['#1D4ED8', '#15803D', '#B45309', '#BE185D', '#6D28D9', '#0E7490', '#C2410C'];

export function Avatar({ name, src, size = 36 }: { name: string; src?: string; size?: number }) {
  if (src) return <img src={src} alt="" className="rounded-full object-cover shrink-0 bg-blue-50" style={{ width: size, height: size }} />;
  const hash = [...name].reduce((a, c) => a + c.charCodeAt(0), 0) % AVATAR_COLORS.length;
  const initials = name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
  return (
    <span
      className="rounded-full inline-flex items-center justify-center font-extrabold shrink-0"
      style={{ width: size, height: size, backgroundColor: AVATAR_COLORS[hash], color: AVATAR_TEXT[hash], fontSize: size * 0.36 }}
    >
      {initials}
    </span>
  );
}

export function Person({ name, sub, src }: { name: string; sub?: ReactNode; src?: string }) {
  return (
    <div className="flex items-center gap-2.5 min-w-0">
      <Avatar name={name} src={src} />
      <div className="min-w-0">
        <p className="text-[13px] font-bold text-[#0F1E4A] truncate">{name}</p>
        {sub && <p className="text-[11px] text-slate-500 font-medium truncate">{sub}</p>}
      </div>
    </div>
  );
}

export function Meter({ value, color, className }: { value: number; color?: string; className?: string }) {
  const auto = value >= 100 ? '#EF4444' : value >= 61 ? '#16A34A' : '#F97316';
  return (
    <div className={cn('h-1.5 rounded-full bg-slate-100 overflow-hidden', className)}>
      <div className="h-full rounded-full" style={{ width: `${Math.max(0, Math.min(100, value))}%`, backgroundColor: color ?? auto }} />
    </div>
  );
}

export interface Slice { label: string; value: number; color: string; note?: string }

export function Donut({ data, center, sub, size = 128, thickness = 22 }: { data: Slice[]; center: ReactNode; sub?: string; size?: number; thickness?: number }) {
  const total = data.reduce((a, d) => a + d.value, 0) || 1;
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  let acc = 0;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#F1F5F9" strokeWidth={thickness} />
        {data.map((d) => {
          const len = (d.value / total) * c;
          const el = (
            <circle key={d.label} cx={size / 2} cy={size / 2} r={r} fill="none" stroke={d.color} strokeWidth={thickness}
              strokeDasharray={`${len} ${c - len}`} strokeDashoffset={-acc} />
          );
          acc += len;
          return el;
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-5">
        <span className={cn('font-extrabold text-[#0F1E4A] leading-tight whitespace-nowrap', String(center).length > 8 ? 'text-[11px]' : 'text-[15px]')}>{center}</span>
        {sub && <span className="text-[10px] font-semibold text-slate-500 leading-tight">{sub}</span>}
      </div>
    </div>
  );
}

export function DonutPanel({ title, data, center, sub, className }: { title: string; data: Slice[]; center: ReactNode; sub?: string; className?: string }) {
  return (
    <Panel title={title} className={className}>
      <div className="flex items-center gap-4 flex-wrap">
        <Donut data={data} center={center} sub={sub} />
        <ul className="flex-1 min-w-[130px] space-y-2">
          {data.map((d) => (
            <li key={d.label} className="flex items-start gap-2 text-xs">
              <span className="w-2.5 h-2.5 rounded-full mt-1 shrink-0" style={{ backgroundColor: d.color }} />
              <span className="min-w-0">
                <span className="font-bold text-slate-800 block">{d.label}</span>
                {d.note && <span className="text-slate-500 font-medium">{d.note}</span>}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Panel>
  );
}

export interface Quick { label: string; icon: LucideIcon; tone?: Tone; to?: string; onClick?: () => void; badge?: number }

export function QuickList({ title = 'Aksi Cepat', items }: { title?: string; items: Quick[] }) {
  return (
    <Panel title={title}>
      <div className="-my-1">
        {items.map((q) => {
          const body = (
            <>
              <q.icon className="w-4 h-4 shrink-0" style={{ color: TONE_HEX[q.tone ?? 'blue'] }} />
              <span className="flex-1 text-left text-[13px] font-bold text-slate-800 truncate">{q.label}</span>
              {q.badge !== undefined && <span className="px-1.5 min-w-5 text-center rounded-full bg-red-500 text-white text-[10px] font-bold">{q.badge}</span>}
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </>
          );
          const cls = 'w-full flex items-center gap-2.5 py-2 hover:text-[#1D4ED8] transition-colors';
          return q.to
            ? <Link key={q.label} to={q.to} className={cls}>{body}</Link>
            : <button key={q.label} onClick={q.onClick ?? (() => soon(q.label))} className={cls}>{body}</button>;
        })}
      </div>
    </Panel>
  );
}

export function InfoBox({ title = 'Informasi', items, className }: { title?: string; items: string[]; className?: string }) {
  return (
    <section className={cn('rounded-2xl border border-blue-100 bg-[#F4F8FF] p-4', className)}>
      <h2 className="flex items-center gap-2 text-[15px] font-extrabold text-[#0F1E4A] mb-2">
        <span className="w-5 h-5 rounded-full bg-[#1D4ED8] text-white flex items-center justify-center"><Info className="w-3.5 h-3.5" /></span>
        {title}
      </h2>
      <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600 font-medium">
        {items.map((t) => <li key={t}>{t}</li>)}
      </ul>
    </section>
  );
}

/** Kartu keterangan: daftar [badge/label, penjelasan] */
export function LegendBox({ title, rows, className }: { title: string; rows: [ReactNode, string][]; className?: string }) {
  return (
    <section className={cn('rounded-2xl border border-blue-100 bg-[#F4F8FF] p-4', className)}>
      <h2 className="text-[15px] font-extrabold text-[#0F1E4A] mb-2">{title}</h2>
      <ul className="space-y-1.5">
        {rows.map(([k, v], i) => (
          <li key={i} className="flex items-start gap-2 text-xs text-slate-600 font-medium">
            <span className="w-[104px] shrink-0">{typeof k === 'string' ? <Badge>{k}</Badge> : k}</span>
            <span>: {v}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function KeyValues({ rows }: { rows: [ReactNode, ReactNode][] }) {
  return (
    <dl className="divide-y divide-slate-100">
      {rows.map(([k, v], i) => (
        <div key={i} className="flex items-center justify-between gap-3 py-2 text-[13px]">
          <dt className="text-slate-600 font-semibold">{k}</dt>
          <dd className="font-extrabold text-[#0F1E4A] text-right">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

export function BarList({ rows }: { rows: { label: string; value: number; display?: string; color: string; max?: number }[] }) {
  const max = Math.max(...rows.map((r) => r.max ?? r.value), 1);
  return (
    <ul className="space-y-2.5">
      {rows.map((r) => (
        <li key={r.label}>
          <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
            <span className="truncate">{r.label}</span><span>{r.display ?? r.value}</span>
          </div>
          <Meter value={(r.value / max) * 100} color={r.color} />
        </li>
      ))}
    </ul>
  );
}

export function MiniBars({ data, color = '#16A34A', height = 96 }: { data: { label: string; value: number; display?: string; color?: string }[]; color?: string; height?: number }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="flex items-end justify-between gap-2" style={{ height: height + 34 }}>
      {data.map((d) => (
        <div key={d.label} className="flex-1 flex flex-col items-center justify-end gap-1 min-w-0">
          <span className="text-[10px] font-bold text-slate-700 whitespace-nowrap">{d.display ?? d.value}</span>
          <div className="w-full max-w-[22px] rounded-t-md" style={{ height: Math.max(3, (d.value / max) * height), backgroundColor: d.value ? d.color ?? color : '#E2E8F0' }} />
          <span className="text-[10px] font-semibold text-slate-500 whitespace-nowrap">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

/* ---------- Tabel + paginasi ---------- */

export interface Col<T> { header: ReactNode; cell: (row: T, index: number) => ReactNode; align?: 'left' | 'center' | 'right'; className?: string }

export function Pagination({ page, pages, onPage, perPage, onPerPage, total, unit }: {
  page: number; pages: number; onPage: (p: number) => void; perPage: number; onPerPage: (n: number) => void; total: number; unit: string;
}) {
  const from = total === 0 ? 0 : (page - 1) * perPage + 1;
  const to = Math.min(total, page * perPage);
  const nums = Array.from({ length: pages }, (_, i) => i + 1).filter((n) => n === 1 || n === pages || Math.abs(n - page) <= 1);
  const btn = 'w-8 h-8 rounded-lg border text-xs font-bold flex items-center justify-center transition-colors disabled:opacity-40';
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-t border-slate-100">
      <p className="text-xs text-slate-600 font-medium">Menampilkan {from} - {to} dari {total.toLocaleString('id-ID')} {unit}</p>
      <div className="flex items-center gap-1.5">
        <button className={cn(btn, 'border-slate-200 text-slate-600 hover:bg-slate-50')} disabled={page <= 1} onClick={() => onPage(page - 1)} aria-label="Sebelumnya"><ChevronLeft className="w-4 h-4" /></button>
        {nums.map((n, i) => (
          <span key={n} className="flex items-center gap-1.5">
            {i > 0 && n - nums[i - 1] > 1 && <span className="text-xs text-slate-400">…</span>}
            <button onClick={() => onPage(n)} className={cn(btn, n === page ? 'border-[#1D4ED8] bg-[#1D4ED8] text-white' : 'border-slate-200 text-slate-700 hover:bg-slate-50')}>{n}</button>
          </span>
        ))}
        <button className={cn(btn, 'border-slate-200 text-slate-600 hover:bg-slate-50')} disabled={page >= pages} onClick={() => onPage(page + 1)} aria-label="Berikutnya"><ChevronRight className="w-4 h-4" /></button>
      </div>
      <Select value={String(perPage)} onChange={(v) => onPerPage(Number(v))} options={['5', '10', '25']} className="w-[76px]" />
    </div>
  );
}

export function DataTable<T>({ columns, rows, rowKey, unit = 'data', initialPerPage = 10, selectable, empty = 'Tidak ada data yang cocok.' }: {
  columns: Col<T>[]; rows: T[]; rowKey: (row: T) => string; unit?: string; initialPerPage?: number; selectable?: boolean; empty?: string;
}) {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(initialPerPage);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const pages = Math.max(1, Math.ceil(rows.length / perPage));
  useEffect(() => { if (page > pages) setPage(pages); }, [page, pages]);
  const start = (Math.min(page, pages) - 1) * perPage;
  const visible = rows.slice(start, start + perPage);
  const allChecked = visible.length > 0 && visible.every((r) => selected.has(rowKey(r)));
  const toggle = (keys: string[], on: boolean) => setSelected((prev) => {
    const next = new Set(prev);
    keys.forEach((k) => (on ? next.add(k) : next.delete(k)));
    return next;
  });
  const alignCls = { left: 'text-left', center: 'text-center', right: 'text-right' };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_2px_rgba(15,30,74,0.04)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-xs text-slate-700">
              {selectable && (
                <th className="pl-4 w-8"><input type="checkbox" aria-label="Pilih semua" checked={allChecked} onChange={(e) => toggle(visible.map(rowKey), e.target.checked)} className="w-4 h-4 accent-[#1D4ED8]" /></th>
              )}
              {columns.map((c, i) => (
                <th key={i} className={cn('px-3 py-3 font-bold whitespace-nowrap', alignCls[c.align ?? 'left'])}>{c.header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {visible.map((row, i) => {
              const key = rowKey(row);
              return (
                <tr key={key} className="hover:bg-slate-50/60">
                  {selectable && (
                    <td className="pl-4"><input type="checkbox" aria-label="Pilih baris" checked={selected.has(key)} onChange={(e) => toggle([key], e.target.checked)} className="w-4 h-4 accent-[#1D4ED8]" /></td>
                  )}
                  {columns.map((c, ci) => (
                    <td key={ci} className={cn('px-3 py-2.5 font-medium text-slate-700 align-middle', alignCls[c.align ?? 'left'], c.className)}>{c.cell(row, start + i)}</td>
                  ))}
                </tr>
              );
            })}
            {visible.length === 0 && (
              <tr><td colSpan={columns.length + (selectable ? 1 : 0)} className="px-4 py-10 text-center text-sm text-slate-500 font-medium">{empty}</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <Pagination page={Math.min(page, pages)} pages={pages} onPage={setPage} perPage={perPage} onPerPage={(n) => { setPerPage(n); setPage(1); }} total={rows.length} unit={unit} />
    </div>
  );
}

export interface MenuItem { label: string; onClick: () => void; danger?: boolean }

export function RowMenu({ items }: { items: MenuItem[] }) {
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  return (
    <>
      <button
        aria-label="Aksi lainnya"
        onClick={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          const height = items.length * 36 + 12;
          setPos({ top: r.bottom + height > window.innerHeight ? r.top - height - 4 : r.bottom + 4, left: Math.max(8, r.right - 190) });
        }}
        className="w-8 h-8 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 inline-flex items-center justify-center"
      >
        <MoreVertical className="w-4 h-4" />
      </button>
      {pos && (
        <>
          <div className="fixed inset-0 z-[70]" onClick={() => setPos(null)} />
          <div className="fixed z-[71] w-[190px] bg-white rounded-xl border border-slate-200 shadow-lg py-1.5 text-left" style={pos}>
            {items.map((m) => (
              <button key={m.label} onClick={() => { setPos(null); m.onClick(); }} className={cn('w-full text-left px-3.5 py-2 text-[13px] font-semibold hover:bg-slate-50', m.danger ? 'text-red-600' : 'text-slate-700')}>
                {m.label}
              </button>
            ))}
          </div>
        </>
      )}
    </>
  );
}

export function RowActions({ onView, onEdit, menu }: { onView?: () => void; onEdit?: () => void; menu?: MenuItem[] }) {
  const cls = 'w-8 h-8 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-[#1D4ED8] inline-flex items-center justify-center';
  return (
    <div className="inline-flex items-center gap-1.5">
      {onView && <button aria-label="Lihat detail" onClick={onView} className={cls}><Eye className="w-4 h-4" /></button>}
      {onEdit && <button aria-label="Ubah" onClick={onEdit} className={cls}><SquarePen className="w-4 h-4" /></button>}
      {menu && menu.length > 0 && <RowMenu items={menu} />}
    </div>
  );
}

/* ---------- Dialog ---------- */

export function Modal({ open, title, onClose, children, footer, wide }: { open: boolean; title: string; onClose: () => void; children: ReactNode; footer?: ReactNode; wide?: boolean }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-900/40" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label={title} className={cn('bg-white rounded-2xl shadow-xl w-full max-h-[90vh] flex flex-col', wide ? 'max-w-2xl' : 'max-w-lg')} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 className="text-base font-extrabold text-[#0F1E4A]">{title}</h3>
          <button aria-label="Tutup" onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-500 flex items-center justify-center"><X className="w-4 h-4" /></button>
        </div>
        <div className="px-5 py-4 overflow-y-auto">{children}</div>
        {footer && <div className="px-5 py-3 border-t border-slate-100 flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
}

export interface Field { key: string; label: string; type?: 'text' | 'number' | 'date' | 'select' | 'textarea' | 'email' | 'tel'; options?: string[]; required?: boolean; placeholder?: string }

export function FormDialog({ open, title, fields, initial, onSubmit, onClose, submitLabel = 'Simpan' }: {
  open: boolean; title: string; fields: Field[]; initial?: Record<string, string>; onSubmit: (values: Record<string, string>) => void | Promise<void>; onClose: () => void; submitLabel?: string;
}) {
  const [values, setValues] = useState<Record<string, string>>({});
  useEffect(() => {
    if (open) setValues(Object.fromEntries(fields.map((f) => [f.key, initial?.[f.key] ?? (f.type === 'select' ? f.options?.[0] ?? '' : '')])));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
  const input = 'w-full h-10 px-3 rounded-lg border border-slate-200 text-[13px] font-medium text-slate-800 outline-none focus:border-[#1D4ED8] bg-white';
  const set = (k: string, v: string) => setValues((p) => ({ ...p, [k]: v }));
  return (
    <Modal open={open} title={title} onClose={onClose}>
      <form
        onSubmit={(e) => { e.preventDefault(); void onSubmit(values); onClose(); }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-3"
      >
        {fields.map((f) => (
          <label key={f.key} className={cn('block', f.type === 'textarea' && 'sm:col-span-2')}>
            <span className="block text-xs font-bold text-slate-700 mb-1">{f.label}{f.required && <span className="text-red-500"> *</span>}</span>
            {f.type === 'select' ? (
              <select value={values[f.key] ?? ''} onChange={(e) => set(f.key, e.target.value)} className={input}>
                {f.options?.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            ) : f.type === 'textarea' ? (
              <textarea value={values[f.key] ?? ''} onChange={(e) => set(f.key, e.target.value)} required={f.required} placeholder={f.placeholder} rows={3} className={cn(input, 'h-auto py-2')} />
            ) : (
              <input type={f.type ?? 'text'} min={f.type === 'number' ? 0 : undefined} value={values[f.key] ?? ''} onChange={(e) => set(f.key, e.target.value)} required={f.required} placeholder={f.placeholder} className={input} />
            )}
          </label>
        ))}
        <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
          <Btn variant="ghost" onClick={onClose}>Batal</Btn>
          <Btn variant="primary" type="submit">{submitLabel}</Btn>
        </div>
      </form>
    </Modal>
  );
}

/**
 * CRUD untuk halaman daftar di atas satu resource API (/api/r/{resource}): tambah / ubah / lihat / hapus beserta dialognya.
 * Nilai form berupa string; field bertipe number dikonversi sebelum dikirim. Id dibuat oleh server.
 */
export function useCrud<T extends { id: string }>(resource: string, cfg: {
  label: string;
  fields: Field[];
  create: (values: Record<string, string>, rows: T[]) => T;
  detail: (row: T) => [ReactNode, ReactNode][];
}) {
  const remote = useResource<T>(resource);
  const { rows } = remote;
  const [form, setForm] = useState<{ row?: T } | null>(null);
  const [viewing, setViewing] = useState<T | null>(null);
  const [deleting, setDeleting] = useState<T | null>(null);

  const coerce = (values: Record<string, string>) =>
    Object.fromEntries(cfg.fields.map((f) => [f.key, f.type === 'number' ? Number(values[f.key]) || 0 : values[f.key]])) as Partial<T>;

  const submit = async (values: Record<string, string>) => {
    if (form?.row) {
      if (await remote.update(form.row.id, coerce(values))) toast.success(`${cfg.label} berhasil diperbarui`);
    } else if (await remote.create(cfg.create(values, rows))) {
      toast.success(`${cfg.label} berhasil ditambahkan`);
    }
  };

  const initialValues = form?.row
    ? Object.fromEntries(cfg.fields.map((f) => [f.key, String((form.row as Record<string, unknown>)[f.key] ?? '')]))
    : undefined;

  const dialogs = (
    <>
      <FormDialog open={!!form} title={`${form?.row ? 'Ubah' : 'Tambah'} ${cfg.label}`} fields={cfg.fields} initial={initialValues} onSubmit={submit} onClose={() => setForm(null)} />
      <Modal open={!!viewing} title={`Detail ${cfg.label}`} onClose={() => setViewing(null)} footer={<Btn variant="ghost" onClick={() => setViewing(null)}>Tutup</Btn>}>
        {viewing && <KeyValues rows={cfg.detail(viewing)} />}
      </Modal>
      <Modal
        open={!!deleting}
        title={`Hapus ${cfg.label}`}
        onClose={() => setDeleting(null)}
        footer={<>
          <Btn variant="ghost" onClick={() => setDeleting(null)}>Batal</Btn>
          <Btn variant="danger" onClick={async () => { const target = deleting!; setDeleting(null); if (await remote.remove(target.id)) toast.success(`${cfg.label} dihapus`); }}>Hapus</Btn>
        </>}
      >
        <p className="text-sm text-slate-600 font-medium">Data ini akan dihapus permanen. Lanjutkan?</p>
      </Modal>
    </>
  );

  return {
    rows, loading: remote.loading, dialogs,
    add: () => setForm({}),
    edit: (row: T) => setForm({ row }),
    view: (row: T) => setViewing(row),
    remove: (row: T) => setDeleting(row),
    patch: (id: string, changes: Partial<T>) => remote.update(id, changes),
  };
}

/** Unduh baris tabel sebagai CSV (dapat dibuka di Excel) */
export function exportCsv(filename: string, headers: string[], rows: (string | number)[][]) {
  const esc = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
  const csv = '﻿' + [headers, ...rows].map((r) => r.map(esc).join(';')).join('\r\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  toast.success('Data diekspor', { description: `${filename}.csv (${rows.length} baris)` });
}

/* ---------- Kalender jadwal mingguan ---------- */

const BLOCK: Record<Tone, string> = {
  blue: 'bg-blue-50 border-blue-200 text-blue-800',
  green: 'bg-emerald-50 border-emerald-200 text-emerald-800',
  purple: 'bg-violet-50 border-violet-200 text-violet-800',
  pink: 'bg-pink-50 border-pink-200 text-pink-800',
  orange: 'bg-orange-50 border-orange-200 text-orange-800',
  amber: 'bg-amber-50 border-amber-200 text-amber-800',
  teal: 'bg-teal-50 border-teal-200 text-teal-800',
  red: 'bg-red-50 border-red-200 text-red-800',
  slate: 'bg-slate-50 border-slate-200 text-slate-700',
};

export interface Session { id: string; day: number; slot: number; title: string; lines: string[]; tone: Tone; flag?: ReactNode }

export function WeekGrid({ days, slots, sessions, onSelect, today, notes }: {
  days: { name: string; date: string }[]; slots: string[]; sessions: Session[]; onSelect?: (s: Session) => void; today?: number;
  notes?: Record<string, string>;
}) {
  return (
    <div className="overflow-x-auto">
      <div className="grid min-w-[860px] border border-slate-200 rounded-xl overflow-hidden" style={{ gridTemplateColumns: `92px repeat(${days.length}, minmax(0, 1fr))` }}>
        <div className="bg-slate-50 border-b border-slate-200 px-2 py-2.5 text-xs font-bold text-slate-700 text-center">Waktu</div>
        {days.map((d, i) => (
          <div key={d.name} className={cn('border-b border-l border-slate-200 px-2 py-2 text-center', i === today ? 'bg-[#EAF1FF]' : 'bg-slate-50')}>
            <p className={cn('text-xs font-extrabold', i === today ? 'text-[#1D4ED8]' : 'text-slate-800')}>{d.name}</p>
            <p className="text-[11px] text-slate-500 font-semibold">{d.date}</p>
          </div>
        ))}
        {slots.map((slot, si) => (
          <div key={slot} className="contents">
            <div className="border-b border-slate-100 px-2 py-3 text-[11px] font-bold text-slate-700 text-center flex items-center justify-center">{slot}</div>
            {days.map((d, di) => {
              const items = sessions.filter((s) => s.day === di && s.slot === si);
              const note = notes?.[`${di}-${si}`];
              return (
                <div key={d.name} className={cn('border-b border-l border-slate-100 p-1.5 min-h-[76px] flex flex-col gap-1 justify-center', di === today && 'bg-[#F4F8FF]')}>
                  {items.map((s) => (
                    <button key={s.id} onClick={() => onSelect?.(s)} className={cn('w-full text-left rounded-lg border px-2 py-1.5 hover:shadow-sm transition-shadow', BLOCK[s.tone])}>
                      <span className="flex items-start justify-between gap-1">
                        <span className="text-[11px] font-extrabold leading-tight">{s.title}</span>
                        {s.flag}
                      </span>
                      {s.lines.map((l) => <span key={l} className="block text-[10px] font-semibold opacity-80 leading-tight truncate">{l}</span>)}
                    </button>
                  ))}
                  {items.length === 0 && <span className="text-center text-[11px] text-slate-400 font-medium">{note ?? '–'}</span>}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export function DotLegend({ items }: { items: { label: string; color: string }[] }) {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5">
      {items.map((i) => (
        <span key={i.label} className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: i.color }} />{i.label}
        </span>
      ))}
    </div>
  );
}

/** Tata letak halaman daftar admin: konten utama + rel kanan */
export function WithRail({ children, rail }: { children: ReactNode; rail: ReactNode }) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_300px] gap-4 items-start">
      <div className="space-y-4 min-w-0">{children}</div>
      <aside className="space-y-4 min-w-0">{rail}</aside>
    </div>
  );
}
