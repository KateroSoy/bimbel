import { ReactNode } from 'react';
import { cn } from '../../lib/utils';
import type { Subject } from '../../data/siswaPortal';

export function PageTitle({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-4">
      <div>
        <h1 className="text-2xl md:text-[26px] font-extrabold text-[#0F1E4A] tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-slate-600 font-medium mt-0.5">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn('bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_2px_rgba(15,30,74,0.04)]', className)}>{children}</div>;
}

export function CardHeader({ title, action, className }: { title: ReactNode; action?: ReactNode; className?: string }) {
  return (
    <div className={cn('flex items-center justify-between gap-3 mb-2.5', className)}>
      <h2 className="text-[15px] font-extrabold text-[#0F1E4A]">{title}</h2>
      {action}
    </div>
  );
}

export function SubjectBadge({ subject, size = 'md' }: { subject: Subject; size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'w-6 h-6 text-[9px] rounded-md', md: 'w-9 h-9 text-[11px] rounded-lg', lg: 'w-11 h-11 text-xs rounded-xl' };
  return (
    <span className={cn('inline-flex items-center justify-center font-extrabold text-white shrink-0', sizes[size])} style={{ backgroundColor: subject.color }}>
      {subject.short}
    </span>
  );
}

type Tone = 'green' | 'blue' | 'orange' | 'red' | 'purple' | 'slate';
const TONES: Record<Tone, string> = {
  green: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  blue: 'bg-blue-50 text-blue-700 border-blue-100',
  orange: 'bg-orange-50 text-orange-700 border-orange-100',
  red: 'bg-red-50 text-red-700 border-red-100',
  purple: 'bg-violet-50 text-violet-700 border-violet-100',
  slate: 'bg-slate-100 text-slate-600 border-slate-200',
};

export function Pill({ tone = 'slate', children, className }: { tone?: Tone; children: ReactNode; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[11px] font-bold whitespace-nowrap', TONES[tone], className)}>
      {children}
    </span>
  );
}

export function ProgressBar({ value, color = '#1D4ED8', className }: { value: number; color?: string; className?: string }) {
  return (
    <div className={cn('h-1.5 rounded-full bg-slate-100 overflow-hidden', className)}>
      <div className="h-full rounded-full transition-all" style={{ width: `${Math.max(0, Math.min(100, value))}%`, backgroundColor: color }} />
    </div>
  );
}

export function IconTile({ icon, bg, fg, className }: { icon: ReactNode; bg: string; fg: string; className?: string }) {
  return (
    <span className={cn('inline-flex items-center justify-center rounded-full shrink-0 w-12 h-12', className)} style={{ backgroundColor: bg, color: fg }}>
      {icon}
    </span>
  );
}

export const statusTone = (status: string): Tone => {
  switch (status) {
    case 'Sangat Baik':
    case 'Hadir':
    case 'Lunas':
    case 'Aktif':
    case 'Selesai':
      return 'green';
    case 'Baik':
    case 'Menunggu Verifikasi':
      return 'blue';
    case 'Berlangsung':
      return 'purple';
    case 'Perlu Perhatian':
    case 'Akan Datang':
    case 'Terlambat':
    case 'Izin':
    case 'Sakit':
      return 'orange';
    case 'Alpha':
    case 'Belum Dibayar':
      return 'red';
    default:
      return 'slate';
  }
};
