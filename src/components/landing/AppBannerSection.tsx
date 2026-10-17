import { Download } from 'lucide-react';
import { toast } from 'sonner';
import { openAppDownload } from '../../lib/contact';

export function AppBannerSection() {
  const handleDownload = () => openAppDownload(() => toast.info('Link unduhan aplikasi sedang disiapkan', {
    description: 'Silakan hubungi admin StudyHack untuk mendapatkan aplikasi.',
  }));

  return (
    <section className="pb-14 bg-white">
      <div className="max-w-[1120px] mx-auto px-6">
        <div className="bg-[#E52833] rounded-2xl relative flex flex-col md:flex-row items-center gap-8 px-8 py-10 md:py-12 md:pl-[300px] md:pr-12 shadow-lg shadow-red-900/10">
          {/* Phone mockup with the real LearnSpace+ app screen, poking out above the banner */}
          <div className="hidden md:block absolute left-12 bottom-0 w-[230px] h-[300px] [clip-path:inset(-200px_-200px_0_-200px)]">
            <div className="absolute left-0 -bottom-16 w-[210px] h-[360px] -rotate-[10deg] rounded-[34px] bg-slate-900 p-[7px] shadow-2xl">
              <div className="relative rounded-[28px] overflow-hidden bg-white h-full">
                <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-16 h-4 bg-slate-900 rounded-full z-10"></div>
                <img src="/assets/landing/app-screen.jpg" alt="Tampilan aplikasi LearnSpace+" className="w-full object-cover object-top" />
              </div>
            </div>
          </div>

          <div className="relative z-10 text-white text-center md:text-left">
            <h2 className="text-2xl md:text-[28px] font-extrabold mb-2 leading-tight">
              Belajar lebih mudah dengan Aplikasi StudyHack!
            </h2>
            <p className="text-red-50 text-base md:text-lg mb-6 font-semibold">
              Akses materi, jadwal, dan info terbaru kapan saja.
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <button
                onClick={handleDownload}
                className="bg-white hover:bg-red-50 text-[#E52833] rounded-full h-12 px-7 flex items-center gap-2.5 font-extrabold text-sm transition-colors shadow-md cursor-pointer"
              >
                <Download className="w-5 h-5" /> Download Aplikasi
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
