import { cn } from '../../lib/utils';

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-slate-200/60 backdrop-blur-sm", className)}
      {...props}
    />
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("glass p-6 rounded-2xl border border-white/40", className)}>
      <div className="flex items-center gap-4 mb-4">
        <Skeleton className="w-12 h-12 rounded-xl" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-1/4" />
        </div>
      </div>
      <div className="space-y-3">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
        <Skeleton className="h-3 w-4/6" />
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5, className }: { rows?: number; className?: string }) {
  return (
    <div className={cn("glass rounded-2xl border border-white/40 overflow-hidden", className)}>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4"><Skeleton className="h-4 w-24" /></th>
              <th className="px-6 py-4"><Skeleton className="h-4 w-32" /></th>
              <th className="px-6 py-4"><Skeleton className="h-4 w-20" /></th>
              <th className="px-6 py-4"><Skeleton className="h-4 w-16" /></th>
              <th className="px-6 py-4"><Skeleton className="h-4 w-10 ml-auto" /></th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, i) => (
              <tr key={i} className="border-b border-slate-100 last:border-0">
                <td className="px-6 py-4"><Skeleton className="h-4 w-20" /></td>
                <td className="px-6 py-4 flex items-center gap-3">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <Skeleton className="h-4 w-32" />
                </td>
                <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
                <td className="px-6 py-4"><Skeleton className="h-6 w-16 rounded-full" /></td>
                <td className="px-6 py-4"><Skeleton className="h-6 w-6 rounded-md ml-auto" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function SkeletonMetric({ className }: { className?: string }) {
  return (
    <div className={cn("glass p-6 rounded-2xl border border-white/40", className)}>
      <Skeleton className="h-4 w-24 mb-4" />
      <Skeleton className="h-8 w-32 mb-2" />
      <Skeleton className="h-3 w-40" />
    </div>
  );
}
