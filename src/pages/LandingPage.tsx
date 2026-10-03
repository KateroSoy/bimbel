import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Star, UserRound, CircleDot, Award, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { FAQSection } from '../components/FAQSection';

// Extracted sections
import { PromotionsSection } from '../components/landing/PromotionsSection';
import { ProgramBelajarSection } from '../components/landing/ProgramBelajarSection';
import { PricingPackagesSection } from '../components/landing/PricingPackagesSection';
import { CourseSearchSection } from '../components/landing/CourseSearchSection';
import { ProdukDigitalSection } from '../components/landing/ProdukDigitalSection';
import { TentangKamiSection } from '../components/landing/TentangKamiSection';
import { TrustSection } from '../components/landing/TrustSection';
import { SocialMediaSection } from '../components/landing/SocialMediaSection';
import { AppBannerSection } from '../components/landing/AppBannerSection';

// Slides for the hero carousel; add more images here and the arrows appear automatically
const HERO_SLIDES = [
  { src: '/assets/landing/hero-collage-hd.jpg', alt: 'Siswa SD, SMP, dan SMA belajar di StudyHack' },
];

function scrollToSection(id: string, updateHash = true) {
  const el = document.getElementById(id);
  if (!el) return;
  const offset = 120;
  const top = el.getBoundingClientRect().top - document.body.getBoundingClientRect().top - offset;
  window.scrollTo({ top, behavior: 'smooth' });
  if (updateHash) window.history.pushState(null, '', `/#${id}`);
}

export default function LandingPage() {
  const [heroIdx, setHeroIdx] = useState(0);

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (!hash || hash === 'beranda') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      scrollToSection(hash, false);
    };

    if (window.location.hash) {
      setTimeout(handleHash, 200);
    }

    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const prevHero = () => {
    setHeroIdx((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1));
  };

  const nextHero = () => {
    setHeroIdx((prev) => (prev === HERO_SLIDES.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="landing-font min-h-screen bg-white text-[#171719] overflow-x-hidden">
      <Navbar />
      
      {/* Hero Section */}
      <section id="beranda" className="relative pt-32 pb-12 md:pt-[150px] md:pb-16 bg-white scroll-mt-24">
        <div className="max-w-[1240px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-10 items-center">
          <div className="flex flex-col items-start">
            <h1 className="text-[40px] md:text-5xl lg:text-[56px] font-extrabold text-[#062564] leading-[1.12] mb-5 tracking-tight">
              Belajar Lebih <br/>
              Terarah, Raih <br/>
              <span className="text-[#F16710]">Prestasi</span>
            </h1>
            
            <p className="text-slate-600 text-[15px] md:text-base mb-8 max-w-md leading-relaxed font-semibold">
              Program belajar untuk siswa SD, SMP, dan SMA dengan pengajar berpengalaman, kelas interaktif, dan perkembangan terukur.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto mb-10">
              <a href="/#program" onClick={(e) => { e.preventDefault(); scrollToSection('program'); }} className="w-full sm:w-auto h-11 px-7 rounded-full bg-[#062564] text-white text-sm font-extrabold hover:bg-blue-900 transition-colors flex items-center justify-center gap-2 shadow-md shadow-blue-900/20">
                Mulai Belajar <ArrowRight className="w-4 h-4" />
              </a>
              <a href="/#konsultasi" onClick={(e) => { e.preventDefault(); scrollToSection('konsultasi'); }} className="w-full sm:w-auto h-11 px-7 rounded-full bg-white text-[#F16710] border border-[#F16710] text-sm font-extrabold hover:bg-orange-50 transition-colors flex items-center justify-center">
                Konsultasi Gratis
              </a>
            </div>
            
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-x-8 gap-y-4">
              {[
                { icon: <Star className="w-5 h-5 text-amber-400 fill-current" />, value: '4.9/5', label: 'Rating Siswa' },
                { icon: <UserRound className="w-5 h-5 text-[#205C96]" />, value: '1.500+', label: 'Siswa Aktif' },
                { icon: <CircleDot className="w-5 h-5 text-[#205C96]" />, value: '50+', label: 'Program Ajar' },
                { icon: <Award className="w-5 h-5 text-[#F16710]" />, value: '10K+', label: 'Alumni Sukses' },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center gap-2.5">
                  {stat.icon}
                  <div>
                    <p className="text-base font-extrabold text-[#062564] leading-tight">{stat.value}</p>
                    <p className="text-[11px] text-slate-500 font-semibold">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative">
            <img 
              key={HERO_SLIDES[heroIdx].src}
              src={HERO_SLIDES[heroIdx].src} 
              alt={HERO_SLIDES[heroIdx].alt} 
              className="w-full h-auto object-contain" 
            />
            
            {HERO_SLIDES.length > 1 && (
              <>
                <button 
                  onClick={prevHero}
                  aria-label="Slide sebelumnya"
                  className="absolute top-1/2 -left-3 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-slate-600 hover:text-[#062564] border border-slate-100 cursor-pointer z-10"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button 
                  onClick={nextHero}
                  aria-label="Slide berikutnya"
                  className="absolute top-1/2 -right-3 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-slate-600 hover:text-[#062564] border border-slate-100 cursor-pointer z-10"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      <PromotionsSection />
      
      <ProgramBelajarSection />
      
      <PricingPackagesSection />
      
      <CourseSearchSection />
      
      <ProdukDigitalSection />
      
      <TentangKamiSection />
      
      <TrustSection />
      
      <SocialMediaSection />
      
      <FAQSection />
      
      <AppBannerSection />
      
      <Footer />
    </div>
  );
}
