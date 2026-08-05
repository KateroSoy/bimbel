import { cn } from '../../lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Logo({ className, size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  return (
    <div className={cn("relative flex items-center justify-center shrink-0", sizeClasses[size], className)}>
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
        <defs>
          <linearGradient id="gradCap" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0072FF" />
            <stop offset="100%" stopColor="#0035A0" />
          </linearGradient>
          <linearGradient id="gradLeft" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00A2FF" />
            <stop offset="100%" stopColor="#003399" />
          </linearGradient>
          <linearGradient id="gradRight" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#001F70" />
            <stop offset="100%" stopColor="#0062E6" />
          </linearGradient>
          <linearGradient id="gradBars" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0088FF" />
            <stop offset="100%" stopColor="#0035A0" />
          </linearGradient>
        </defs>

        {/* --- Left Arm of U --- */}
        <path d="M 23 35 
                 L 23 60 
                 C 23 72, 33 80, 48 88 
                 C 47 80, 43 72, 35 66 
                 L 31 63 
                 L 31 43 Z" 
              fill="url(#gradLeft)" />

        {/* --- Right Arm of U --- */}
        <path d="M 77 35 
                 L 77 60 
                 C 77 72, 67 80, 52 88 
                 C 53 80, 57 72, 65 66 
                 L 69 63 
                 L 69 43 Z" 
              fill="url(#gradRight)" />

        {/* --- Bars --- */}
        <path d="M 39 60 L 43 58 L 43 69 L 39 67 Z" fill="url(#gradBars)" />
        <path d="M 45 53 L 49 51 L 49 72 L 45 69 Z" fill="url(#gradBars)" />
        <path d="M 51 46 L 55 44 L 55 75 L 51 72 Z" fill="url(#gradBars)" />

        {/* --- Graduation Cap --- */}
        {/* Diamond Top */}
        <path d="M 50 16 L 25 26 L 50 36 L 75 26 Z" fill="url(#gradCap)" />
        {/* Cap Base */}
        <path d="M 38 31.5 L 38 42 L 50 48 L 62 42 L 62 31.5 L 50 36 Z" fill="#0044C0" />
        {/* Tassel */}
        <path d="M 68 28 L 68 40" stroke="#0035A0" strokeWidth="1.5" />
        <path d="M 67.5 40 L 68.5 40 L 69 43 L 67 43 Z" fill="#0035A0" />

        {/* --- Floating Pixels --- */}
        <rect x="78" y="20" width="4" height="4" fill="#00AAFF" />
        <rect x="75" y="27" width="5" height="5" fill="#0088FF" />
        <rect x="81" y="29" width="6.5" height="6.5" fill="#0055DD" />
        <rect x="78" y="38" width="5.5" height="5.5" fill="#0035A0" />

      </svg>
    </div>
  );
}
