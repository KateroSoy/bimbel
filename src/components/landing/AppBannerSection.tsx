import { toast } from 'sonner';

export function AppBannerSection() {
  const handleDownload = (store: string) => {
    toast.success(`Menyiapkan unduhan dari ${store}...`, {
      description: "Aplikasi StudyHack Mobile PWA juga dapat langsung diinstal melalui browser."
    });
  };

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
                onClick={() => handleDownload("Google Play")}
                className="bg-black hover:bg-slate-900 text-white rounded-lg px-4 py-2 flex items-center gap-2.5 transition-colors border border-slate-700 cursor-pointer"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M3.6 1.8 13.8 12 3.6 22.2c-.2-.2-.3-.4-.3-.7V2.5c0-.3.1-.5.3-.7Z" fill="#00D7FE" />
                  <path d="m17.1 8.7-3.3 3.3-10.2-10.2c.2-.1.5-.1.7 0l12.8 6.9Z" fill="#00F076" />
                  <path d="m17.1 15.3-12.8 6.9c-.2.1-.5.1-.7 0L13.8 12l3.3 3.3Z" fill="#FF3A44" />
                  <path d="m21 12.9-3.9 2.4L13.8 12l3.3-3.3 3.9 2.4c.7.4.7 1.4 0 1.8Z" fill="#FFD500" />
                </svg>
                <div className="text-left">
                  <div className="text-[9px] uppercase leading-none">Get it on</div>
                  <div className="text-base font-bold leading-tight">Google Play</div>
                </div>
              </button>

              <button
                onClick={() => handleDownload("App Store")}
                className="bg-black hover:bg-slate-900 text-white rounded-lg px-4 py-2 flex items-center gap-2.5 transition-colors border border-slate-700 cursor-pointer"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M16.4 12.6c0-2.6 2.1-3.8 2.2-3.9-1.2-1.8-3.1-2-3.7-2-1.6-.2-3.1.9-3.9.9-.8 0-2-.9-3.3-.9-1.7 0-3.3 1-4.2 2.5-1.8 3.1-.5 7.7 1.3 10.2.8 1.2 1.8 2.6 3.1 2.5 1.2 0 1.7-.8 3.2-.8s1.9.8 3.2.8c1.3 0 2.2-1.2 3-2.4.9-1.4 1.3-2.7 1.3-2.8 0 0-2.5-1-2.5-3.9ZM13.9 5c.7-.8 1.1-1.9 1-3-1 0-2.1.7-2.8 1.5-.6.7-1.2 1.8-1 2.9 1.1.1 2.1-.6 2.8-1.4Z" />
                </svg>
                <div className="text-left">
                  <div className="text-[9px] leading-none">Download on the</div>
                  <div className="text-base font-bold leading-tight">App Store</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
