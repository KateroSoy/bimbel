import { Check } from 'lucide-react';
import { cn } from '../../lib/utils';
import { BUNDLES, rupiah } from '../../data/landingPrograms';
import { openRegistration } from './RegistrationForm';

export function PricingPackagesSection() {
  return (
    <section id="paket" className="py-14 bg-white scroll-mt-32">
      <div className="max-w-[1240px] mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-[34px] font-extrabold text-[#062564]">Pilihan Paket</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[980px] mx-auto items-stretch">
          {BUNDLES.map((pkg) => (
            <div key={pkg.name} className={cn(
              'rounded-2xl p-7 relative flex flex-col bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg',
              pkg.popular ? 'border-[1.5px] border-[#E52833]' : 'border border-[#DCE3EE]',
            )}>
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#E52833] text-white text-[10px] font-extrabold px-3 py-1 rounded-full tracking-wider uppercase shadow-sm z-10 whitespace-nowrap">
                  PALING POPULER
                </div>
              )}

              <div className="text-center mb-5">
                <h3 className="font-extrabold text-[#062564] text-xl mb-3 uppercase">{pkg.name}</h3>
                <p className="text-[13px] text-slate-400 font-semibold line-through mb-0.5">{rupiah(pkg.normal)}/bulan</p>
                <div className="flex items-end justify-center gap-1">
                  <span className="text-[30px] font-extrabold text-[#062564] leading-tight">{rupiah(pkg.price)}</span>
                  <span className="text-sm font-semibold text-slate-500 pb-1.5">/bulan</span>
                </div>
                <p className="text-[11px] text-[#19A66A] font-bold mt-1">Hemat {rupiah(pkg.normal - pkg.price)} setiap bulan</p>
              </div>

              <div className="space-y-2.5 mb-7 flex-1">
                <p className="text-xs font-extrabold text-[#F16710] uppercase tracking-wide">{pkg.programs.length} program</p>
                {pkg.programs.map((p) => (
                  <div key={p} className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-[#19A66A] shrink-0 mt-0.5" strokeWidth={3} />
                    <span className="text-sm font-semibold text-slate-700 leading-tight">{p}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => openRegistration(`Paket ${pkg.name}`, 'Kids')}
                className={cn(
                  'w-full py-3 rounded-full font-extrabold transition-colors text-sm cursor-pointer',
                  pkg.popular ? 'bg-[#E52833] text-white hover:bg-red-700 shadow-md shadow-red-500/20' : 'bg-[#EEF2FF] text-[#062564] hover:bg-blue-100',
                )}
              >
                Pilih Paket
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
