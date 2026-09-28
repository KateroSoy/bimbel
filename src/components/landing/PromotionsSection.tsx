import { ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export function PromotionsSection() {
  const handleClaimPromo = () => {
    toast.success("Kode Promo 'DISKON30' Berhasil Diklaim!", {
      description: "Diskon 30% otomatis terpasang pada paket bimbingan semester baru."
    });
    const paketSection = document.getElementById('paket');
    if (paketSection) {
      paketSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="promo" className="py-8 bg-white scroll-mt-32">
      <div className="max-w-[1240px] mx-auto px-6">
        <div className="bg-[#FFF1F2] rounded-[24px] px-8 py-9 md:px-12 md:py-10 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between border border-red-100/70">
          
          <div className="flex-1 relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full border border-[#E52833] text-[#E52833] bg-white text-[11px] font-extrabold tracking-wide mb-4">
              <span className="text-lg leading-none mb-0.5">+</span> PROMO PENDAFTARAN
            </div>
            
            <h2 className="text-3xl md:text-[40px] font-extrabold text-[#062564] mb-3 leading-tight">
              Diskon hingga <span className="text-[#E52833]">30%</span>
            </h2>
            
            <p className="text-slate-600 font-semibold text-base md:text-[17px] mb-4 leading-relaxed max-w-xl">
              Khusus pendaftaran program semester baru. Tingkatkan nilai dan raih sekolah impianmu bersama StudyHack.
            </p>
            
            <p className="text-[#E52833] font-bold text-sm flex items-center gap-1.5">
              <span className="text-base leading-none">★</span> Kuota terbatas
            </p>
          </div>
          
          <div className="mt-7 md:mt-0 relative z-10 md:pr-6">
            <button 
              onClick={handleClaimPromo}
              className="inline-flex items-center gap-3 h-12 px-8 rounded-full bg-[#062564] text-white text-sm font-extrabold hover:bg-blue-900 transition-colors shadow-lg shadow-blue-900/20 cursor-pointer"
            >
              Ambil Promo Sekarang <ArrowRight className="w-5 h-5" />
            </button>
          </div>
          
          {/* Soft peach blob behind the CTA, as in the reference */}
          <div className="absolute -bottom-20 right-[10%] w-48 h-52 bg-[#FBD5BC]/60 rounded-[60%_40%_55%_45%/55%_60%_40%_45%] -rotate-12 pointer-events-none"></div>
        </div>
      </div>
    </section>
  );
}
