import { useId } from 'react';
import { cn } from '../../lib/utils';

/** LearnSpace+ brand mark: faceted hexagon "C" (separate identity from the StudyHack emblem). */
export function LearnSpaceMark({ className }: { className?: string }) {
  const id = useId().replace(/:/g, '');
  return (
    <svg viewBox="0 0 100 100" className={cn('shrink-0', className)} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-l`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2563EB" />
          <stop offset="1" stopColor="#1D4ED8" />
        </linearGradient>
        <linearGradient id={`${id}-t`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#4F46E5" />
          <stop offset="1" stopColor="#7C3AED" />
        </linearGradient>
        <linearGradient id={`${id}-b`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#3730A3" />
          <stop offset="1" stopColor="#4F46E5" />
        </linearGradient>
      </defs>
      {/* left facet */}
      <polygon points="50,4 11,26.5 11,73.5 50,96 50,74 30,62.5 30,37.5 50,26" fill={`url(#${id}-l)`} />
      {/* upper arm */}
      <polygon points="50,4 89,26.5 89,40 50,40 50,26" fill={`url(#${id}-t)`} />
      {/* inner shading of upper arm */}
      <polygon points="50,26 30,37.5 50,40" fill="#1E40AF" />
      {/* lower arm */}
      <polygon points="50,96 89,73.5 89,60 50,60 50,74" fill={`url(#${id}-b)`} />
      <polygon points="50,74 30,62.5 50,60" fill="#312E81" />
      {/* cyan accent on lower arm tip */}
      <polygon points="89,60 89,73.5 70,60" fill="#22D3EE" />
    </svg>
  );
}
