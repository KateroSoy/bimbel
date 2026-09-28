// Logo sekolah mitra — tambahkan file ke /public/assets/landing/schools/ lalu daftarkan di sini
const SCHOOL_LOGOS = Array.from({ length: 19 }, (_, i) => `/assets/landing/schools/school-${String(i + 1).padStart(2, '0')}.png`);

const GOOGLE_REVIEWS = [
  { name: 'Budi Santoso', date: '2 bulan lalu', rating: 5, text: 'Tutornya sabar banget ngajarin anak saya. Nilai matematikanya naik drastis sejak ikut StudyHack.' },
  { name: 'Rina Marlina', date: '3 bulan lalu', rating: 5, text: 'Tempat les paling nyaman. Modulnya lengkap dan mudah dipahami. Recommended untuk persiapan UTBK.' },
  { name: 'Arif Setiawan', date: '4 bulan lalu', rating: 5, text: 'Pelayanannya ramah, adminnya fast respon. Anak saya selalu semangat kalau waktunya les.' },
];

export function TrustSection() {
  return (
    <section className="py-10 bg-white">
      <div className="max-w-[1240px] mx-auto px-6 space-y-8">
        <div className="bg-[#F9F8F9] rounded-2xl border border-[#DCE3EE] py-7 overflow-hidden">
          <div className="px-6 md:px-8 mb-5">
            <h2 className="text-xl md:text-2xl font-extrabold text-[#062564] mb-1">Dipercaya oleh orang tua dari sekolah favorit</h2>
            <p className="text-slate-500 text-sm font-semibold">Kami berkomitmen memberikan pendidikan terbaik untuk masa depan anak bangsa.</p>
          </div>
          <div className="relative [mask-image:linear-gradient(to_right,transparent,#000_4%,#000_96%,transparent)]">
            <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
              {[...SCHOOL_LOGOS, ...SCHOOL_LOGOS].map((src, i) => (
                <div key={i} className="h-16 px-4 md:px-5 flex items-center shrink-0" aria-hidden={i >= SCHOOL_LOGOS.length}>
                  <img src={src} alt={i < SCHOOL_LOGOS.length ? `Logo sekolah mitra ${i + 1}` : ''} className="h-full w-auto max-w-[150px] object-contain mix-blend-multiply" loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-5 px-2">
            <h2 className="text-xl md:text-2xl font-extrabold text-[#062564]">Ulasan Google</h2>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg">4.9</span>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                ))}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {GOOGLE_REVIEWS.map((review, i) => (
              <div key={i} className="bg-white border border-[#DCE3EE] p-5 rounded-2xl shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold uppercase">{review.name.charAt(0)}</div>
                    <div>
                      <h4 className="font-bold text-sm text-[#062564] leading-tight">{review.name}</h4>
                      <p className="text-xs text-slate-400">{review.date}</p>
                    </div>
                  </div>
                  <div className="flex mb-2">
                    {[...Array(review.rating)].map((_, j) => (
                      <svg key={j} className="w-3.5 h-3.5 text-amber-400 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                    ))}
                  </div>
                  <p className="text-sm text-slate-600 font-medium leading-relaxed">"{review.text}"</p>
                </div>
                <div className="mt-4 flex items-center gap-1.5">
                  <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                  <span className="text-xs font-bold text-slate-400">Review</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
