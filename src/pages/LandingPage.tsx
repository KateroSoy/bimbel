import { useState, useEffect } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { ArrowRight } from 'lucide-react';
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
import { ChatWidget, openChat } from '../components/landing/ChatWidget';
import { RegistrationModalHost } from '../components/landing/RegistrationForm';

const HERO_IMAGE = { src: '/assets/landing/hero-collage-hd.jpg', alt: 'Siswa belajar bersama StudyHack' };

// Two hero messages that rotate; dots below the copy switch between them
const HERO_MESSAGES = [
  {
    title: <>Hack Cara <br /><span className="text-[#F16710]">Belajarmu!</span></>,
    sub: 'Melalui pendekatan visual-konseptual, kami meretas kerumitan materi agar proses belajarmu jadi lebih logis, cepat, dan terarah.',
  },
  {
    title: <>Mulai Belajar dari <br /><span className="text-[#F16710]">Titik yang Tepat!</span></>,
    sub: 'Dapatkan Tes Diagnostik GRATIS saat mendaftar untuk memetakan kemampuan awal. Kami memastikan setiap individu memulai materi tepat dari tingkat pemahamannya.',
  },
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
    const timer = window.setInterval(() => setHeroIdx((i) => (i + 1) % HERO_MESSAGES.length), 7000);
    return () => window.clearInterval(timer);
  }, []);

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

  return (
    <div className="landing-font min-h-screen bg-white text-[#171719] overflow-x-hidden">
      <Navbar />
      
      {/* Hero Section */}
      <section id="beranda" className="relative pt-32 pb-12 md:pt-[150px] md:pb-16 bg-white scroll-mt-24">
        <div className="max-w-[1240px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-10 items-center">
          <div className="flex flex-col items-start">
            <div key={heroIdx} className="animate-in fade-in duration-500">
              <h1 className="text-[40px] md:text-5xl lg:text-[56px] font-extrabold text-[#062564] leading-[1.12] mb-5 tracking-tight">
                {HERO_MESSAGES[heroIdx].title}
              </h1>
              <p className="text-slate-600 text-[15px] md:text-base mb-8 max-w-md leading-relaxed font-semibold min-h-[78px]">
                {HERO_MESSAGES[heroIdx].sub}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto mb-8">
              <a href="/#program" onClick={(e) => { e.preventDefault(); scrollToSection('program'); }} className="w-full sm:w-auto h-11 px-7 rounded-full bg-[#062564] text-white text-sm font-extrabold hover:bg-blue-900 transition-colors flex items-center justify-center gap-2 shadow-md shadow-blue-900/20">
                Mulai Belajar <ArrowRight className="w-4 h-4" />
              </a>
              <a href="/#konsultasi" onClick={(e) => { e.preventDefault(); openChat(); }} className="w-full sm:w-auto h-11 px-7 rounded-full bg-white text-[#F16710] border border-[#F16710] text-sm font-extrabold hover:bg-orange-50 transition-colors flex items-center justify-center">
                Konsultasi Gratis
              </a>
            </div>
            
            <div className="flex items-center gap-2" role="tablist" aria-label="Pesan utama">
              {HERO_MESSAGES.map((_, i) => (
                <button
                  key={i}
                  role="tab"
                  aria-selected={i === heroIdx}
                  aria-label={`Pesan ${i + 1}`}
                  onClick={() => setHeroIdx(i)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${i === heroIdx ? 'w-8 bg-[#062564]' : 'w-2 bg-slate-300 hover:bg-slate-400'}`}
                />
              ))}
            </div>
          </div>
          
          <div className="relative">
            <img src={HERO_IMAGE.src} alt={HERO_IMAGE.alt} className="w-full h-auto object-contain" />
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
      <RegistrationModalHost />
      <ChatWidget />
    </div>
  );
}
