import { cn } from '../../lib/utils';
import { LearnSpaceMark } from './LearnSpaceMark';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  variant?: 'learnspace' | 'studyhack';
}

export function Logo({ className, size = 'md', showText = false, variant = 'learnspace' }: LogoProps) {
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-11',
    xl: 'h-14',
  };

  if (variant === 'studyhack') {
    const emblemClasses = { sm: 'h-9', md: 'h-12', lg: 'h-14', xl: 'h-16' };
    const wordClasses = { sm: 'text-xl', md: 'text-[26px]', lg: 'text-3xl', xl: 'text-4xl' };
    return (
      <div className={cn("relative flex items-center shrink-0 gap-2.5", className)}>
        <img
          src="/assets/brand/studyhack-emblem.png"
          alt="StudyHack Logo"
          className={cn("object-contain w-auto", emblemClasses[size])}
        />
        {showText && (
          <div className="flex flex-col justify-center">
            <span className={cn("font-extrabold leading-none tracking-tight", wordClasses[size])}>
              <span className="text-[#062564]">Study</span><span className="text-[#F16710]">Hack</span>
            </span>
            <span className="text-[10px] md:text-[11px] font-bold text-[#062564]/70 uppercase tracking-[0.18em] leading-tight mt-1">
              Education Center
            </span>
          </div>
        )}
      </div>
    );
  }

  const wordClasses = { sm: 'text-lg', md: 'text-[22px]', lg: 'text-2xl', xl: 'text-[32px]' };
  const subClasses = { sm: 'text-[10px]', md: 'text-xs', lg: 'text-[13px]', xl: 'text-base' };

  return (
    <div className={cn("relative flex items-center shrink-0 gap-2.5", className)}>
      <LearnSpaceMark className={cn("w-auto aspect-square", sizeClasses[size])} />
      {showText && (
        <div className="flex flex-col justify-center">
          <span className={cn("font-extrabold text-[#1D4ED8] leading-none tracking-tight", wordClasses[size])}>
            LearnSpace<sup className="text-[0.6em] ml-px">+</sup>
          </span>
          <span className={cn("font-bold text-[#0F1E4A] leading-tight mt-0.5", subClasses[size])}>by StudyHack</span>
        </div>
      )}
    </div>
  );
}
