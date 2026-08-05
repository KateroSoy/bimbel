import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { cn } from '../lib/utils';

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Nadia Putri',
    role: 'Siswa',
    content: 'Materinya mudah dipahami, tampilannya nyaman, dan saya bisa belajar sesuai waktu saya sendiri.',
  },
  {
    id: 2,
    name: 'Rizky Pratama',
    role: 'Mahasiswa',
    content: 'Kelasnya membantu saya memahami skill digital dari dasar. Progress belajar juga terasa lebih terarah.',
  },
  {
    id: 3,
    name: 'Aditya Wibowo',
    role: 'Guru',
    content: 'Platform ini memudahkan proses belajar online karena materi, kelas, dan evaluasi tersusun dengan rapi.',
  },
];

export function TestimonialSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const next = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const prev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4">
            Cerita Pengguna
          </div>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-slate-900 mb-4">
            Apa Kata Mereka Setelah Belajar di Platform Ini
          </h2>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="absolute top-1/2 -translate-y-1/2 -left-4 md:-left-12 z-20">
            <button 
              onClick={prev}
              className="w-12 h-12 flex items-center justify-center rounded-full glass bg-white/80 text-slate-800 shadow-lg hover:bg-white transition-all hover:scale-110"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          </div>
          
          <div className="absolute top-1/2 -translate-y-1/2 -right-4 md:-right-12 z-20">
            <button 
              onClick={next}
              className="w-12 h-12 flex items-center justify-center rounded-full glass bg-white/80 text-slate-800 shadow-lg hover:bg-white transition-all hover:scale-110"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          <div className="overflow-hidden relative px-4 py-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="glass-card rounded-[2rem] p-10 md:p-16 bg-white/60 backdrop-blur-xl border border-white/80 shadow-2xl relative"
              >
                <Quote className="w-12 h-12 text-blue-500/20 absolute top-8 left-8 rotate-180" />
                
                <div className="relative z-10">
                  <p className="text-xl md:text-2xl text-slate-700 font-medium leading-relaxed mb-8 text-center">
                    "{TESTIMONIALS[currentIndex].content}"
                  </p>
                  
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 mb-4 shadow-md"></div>
                    <h4 className="font-bold text-lg text-slate-900">{TESTIMONIALS[currentIndex].name}</h4>
                    <p className="text-sm font-medium text-blue-600">{TESTIMONIALS[currentIndex].role}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          
          <div className="flex justify-center gap-3 mt-8">
            {TESTIMONIALS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setIsAutoPlaying(false);
                  setCurrentIndex(idx);
                }}
                className={cn(
                  "w-3 h-3 rounded-full transition-all duration-300",
                  idx === currentIndex ? "bg-blue-600 w-8" : "bg-blue-200 hover:bg-blue-400"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
