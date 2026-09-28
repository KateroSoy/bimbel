import { Check } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useState } from 'react';
import { toast } from 'sonner';

// Paket tahunan = harga bulanan x 11 (bayar 11 bulan, belajar 12 bulan)
const ANNUAL_MONTHS_PAID = 11;

const formatRupiah = (value: number) => `Rp${value.toLocaleString('id-ID')}`;

type BillingCycle = 'Tahunan';

export function PricingPackagesSection() {
  const billingCycle: BillingCycle = 'Tahunan';

  const packages = [
    {
      name: 'COMBO',
      subtitle: 'English + Math',
      price: 3850000,
      monthlyNormal: 400000,
      monthlyPromo: 350000,
      savings: 350000,
      desc: 'Dua mata pelajaran untuk memperkuat kemampuan Bahasa Inggris dan Matematika secara seimbang.',
      features: [
        '12x pertemuan per bulan',
        '90 menit per sesi'
      ],
      isPopular: false
    },
    {
      name: 'SUPER',
      subtitle: 'English + Math + Science',
      price: 5500000,
      monthlyNormal: 550000,
      monthlyPromo: 500000,
      savings: 500000,
      desc: 'Program belajar lebih lengkap untuk mengembangkan kemampuan Bahasa Inggris, Matematika, dan IPA.',
      features: [
        '16x pertemuan per bulan',
        '90 menit per sesi'
      ],
      isPopular: true
    },
    {
      name: 'INTENSIF',
      subtitle: 'English + Math + Science + Mengaji',
      price: 6600000,
      monthlyNormal: 670000,
      monthlyPromo: 600000,
      savings: 600000,
      desc: 'Program belajar paling lengkap untuk mendukung perkembangan akademik sekaligus kemampuan mengaji secara rutin.',
      features: [
        '24x pertemuan per bulan',
        '90 menit per sesi'
      ],
      isPopular: false
    },
  ];

  const handleSelectPackage = (pkgName: string) => {
    toast.success(`Paket ${pkgName} (${billingCycle}) dipilih!`, {
      description: "Lanjutkan ke login demo siswa atau admin untuk memproses pendaftaran."
    });
  };

  return (
    <section id="paket" className="py-14 bg-white scroll-mt-32">
      <div className="max-w-[1240px] mx-auto px-6">
          <div className="text-center mb-10">
          <h2 className="text-3xl md:text-[34px] font-extrabold text-[#062564] mb-4">Pilihan Paket</h2>
          <p className="text-sm font-bold text-[#19A66A] mt-3">
            Bayar {ANNUAL_MONTHS_PAID} bulan, belajar 12 bulan!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[940px] mx-auto items-stretch">
          {packages.map((pkg) => {
            return (
              <div key={pkg.name} className={cn(
                "rounded-2xl p-7 relative flex flex-col bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
                pkg.isPopular ? "border-[1.5px] border-[#E52833]" : "border border-[#DCE3EE]"
              )}>
                {pkg.isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#E52833] text-white text-[10px] font-extrabold px-3 py-1 rounded-full tracking-wider uppercase shadow-sm z-10 whitespace-nowrap">
                    PALING POPULER
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="font-extrabold text-[#062564] text-xl mb-1">{pkg.name}</h3>
                  <p className="text-xs font-bold text-[#F16710] mb-3">{pkg.subtitle}</p>
                  
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <span className="text-[11px] text-slate-400 font-semibold line-through">
                      {formatRupiah(pkg.monthlyNormal)}/bln
                    </span>
                    <span className="text-xs text-slate-600 font-bold">
                      {formatRupiah(pkg.monthlyPromo)}/bln
                    </span>
                  </div>

                  <div className="flex items-end justify-center gap-1">
                    <span className="text-[28px] font-extrabold text-[#062564] leading-tight">
                      {formatRupiah(pkg.price)}
                    </span>
                    <span className="text-sm font-semibold text-slate-500 pb-1">
                      /tahun
                    </span>
                  </div>
                  <p className="text-[11px] text-[#19A66A] font-semibold mt-1">
                    Hemat {formatRupiah(pkg.savings)} dibandingkan pembayaran bulanan selama 12 bulan
                  </p>
                </div>

                <div className="space-y-3 mb-7 flex-1">
                  <p className="text-[13px] text-slate-600 font-medium text-center mb-4 leading-relaxed">
                    {pkg.desc}
                  </p>
                  {pkg.features.map((feat) => (
                    <div key={feat} className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-[#19A66A] shrink-0 mt-0.5" strokeWidth={3} />
                      <span className="text-sm font-semibold text-slate-700 leading-tight">{feat}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleSelectPackage(pkg.name)}
                  className={cn(
                    "w-full py-3 rounded-full font-extrabold transition-colors text-sm cursor-pointer",
                    pkg.isPopular ? "bg-[#E52833] text-white hover:bg-red-700 shadow-md shadow-red-500/20" : "bg-[#EEF2FF] text-[#062564] hover:bg-blue-100"
                  )}
                >
                  Pilih Paket
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
