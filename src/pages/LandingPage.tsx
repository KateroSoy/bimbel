import { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { ArrowRight, Wand2, Atom, Terminal, ScrollText, LineChart, Fingerprint, Grid3X3, AlignLeft, ScanFace } from 'lucide-react';
import { cn } from '../lib/utils';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { AdminStatsCard } from '../components/AdminStatsCard';
import { ScrollProgress } from '../components/ScrollProgress';
import { TestimonialSlider } from '../components/TestimonialSlider';
import { FAQSection } from '../components/FAQSection';
import { BackgroundBlobs } from '../components/BackgroundBlobs';
import { Logo } from '../components/ui/Logo';

import { ScrollReveal } from '../components/ui/ScrollReveal';

import { LearningPath } from '../components/LearningPath';

export default function LandingPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [courseCategory, setCourseCategory] = useState('Semua Kelas');
  const [courseLevel, setCourseLevel] = useState('Semua Level');
  const [coursePrice, setCoursePrice] = useState('Semua Harga');

  const COURSES = [
    { id: 1, title: 'Pengalaman Belajar Digital yang Efektif', category: 'Teknologi', level: 'Beginner', price: 'Rp 79.000', originalPrice: 'Rp 99.000', priceValue: 79000, rating: '4.9', students: '5', instructor: 'Coralina Cloud', lessons: 9, image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=600&h=400' },
    { id: 2, title: 'Dasar Desain Web Modern', category: 'Desain', level: 'Beginner', price: 'Rp 89.000', originalPrice: 'Rp 129.000', priceValue: 89000, rating: '4.8', students: '8', instructor: 'Donald Rose', lessons: 12, image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=600&h=400' },
    { id: 3, title: 'Membangun Masa Depan dengan Skill Digital', category: 'Pengembangan', level: 'Intermediate', price: 'Rp 99.000', originalPrice: 'Rp 149.000', priceValue: 99000, rating: '4.7', students: '6', instructor: 'Edward Narton', lessons: 10, image: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&q=80&w=600&h=400' },
    { id: 4, title: 'Revolusi Pembelajaran Online', category: 'Produktivitas', level: 'Advanced', price: 'Rp 109.000', originalPrice: 'Rp 159.000', priceValue: 109000, rating: '4.9', students: '12', instructor: 'Kamal Abraham', lessons: 20, image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=600&h=400' },
    { id: 5, title: 'Era Baru Kelas Online Interaktif', category: 'Teknologi', level: 'Intermediate', price: 'Rp 95.000', originalPrice: 'Rp 139.000', priceValue: 95000, rating: '4.8', students: '9', instructor: 'Elton Portman', lessons: 16, image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600&h=400' },
    { id: 6, title: 'Strategi Belajar Mandiri yang Efektif', category: 'Learning', level: 'Beginner', price: 'Rp 150.000', originalPrice: 'Rp 199.000', priceValue: 150000, rating: '4.9', students: '7', instructor: 'Leslie Alexander', lessons: 11, image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=600&h=400' },
  ];

  const filteredCourses = COURSES.filter(course => {
    const matchCategory = courseCategory === 'Semua Kelas' || course.category === courseCategory;
    const matchLevel = courseLevel === 'Semua Level' || course.level === courseLevel;
    let matchPrice = true;
    if (coursePrice === 'Di bawah Rp 100rb') matchPrice = course.priceValue < 100000;
    else if (coursePrice === 'Rp 100rb - Rp 150rb') matchPrice = course.priceValue >= 100000 && course.priceValue <= 150000;
    else if (coursePrice === 'Di atas Rp 150rb') matchPrice = course.priceValue > 150000;
    return matchCategory && matchLevel && matchPrice;
  });

  return (
    <div className="min-h-screen bg-transparent text-slate-900 overflow-x-hidden relative">
      <ScrollProgress />
      <BackgroundBlobs />
      <AnimatedBackground />
      
      <div className="relative z-10">
        <Navbar />
        
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
          
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial="hidden"
                animate="show"
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 1,
                    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
                  }
                }}
                className="flex flex-col items-start text-left"
              >
                <motion.div 
                  variants={{
                    hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
                    show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-white font-medium text-sm mb-6 shadow-lg"
                >
                  <Wand2 className="w-4 h-4 text-blue-600" />
                  <span className="text-blue-700">Platform Belajar Online Modern</span>
                </motion.div>
                
                <motion.h1 
                  variants={{
                    hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
                    show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
                  }}
                  className="font-display font-bold text-5xl md:text-7xl lg:text-8xl tracking-tight text-slate-900 leading-[1.1] mb-6 drop-shadow-sm"
                >
                  Temukan Kelas Terbaik untuk Meningkatkan <span className="text-slate-500">Skill dan Masa Depanmu</span>
                </motion.h1>
                
                <motion.p 
                  variants={{
                    hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
                    show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
                  }}
                  className="text-lg md:text-xl text-slate-600 max-w-xl mb-8 leading-relaxed font-medium"
                >
                  Akses berbagai kelas, materi video, latihan, dan panduan belajar yang dirancang untuk membantu siswa, guru, dan profesional berkembang lebih cepat dengan pengalaman belajar yang fleksibel.
                </motion.p>
                
                <motion.div 
                  variants={{
                    hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
                    show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
                  }}
                  className="flex flex-col sm:flex-row items-center justify-start gap-4 w-full"
                >
                  <Link to="/login" className="w-full sm:w-auto flex items-center justify-center gap-2 h-12 px-6 rounded-full bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 hover:-translate-y-0.5">
                    <span>Jelajahi Kelas</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <a href="#kategori" className="w-full sm:w-auto flex items-center justify-center h-12 px-6 rounded-full glass-card text-slate-700 font-bold hover:bg-white/60 transition-all shadow-lg border border-white/60">
                    Mulai Gratis
                  </a>
                </motion.div>
                
                <motion.p 
                  variants={{
                    hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
                    show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
                  }}
                  className="mt-6 text-sm text-slate-500 font-medium"
                >
                  Dipercaya untuk pembelajaran digital yang lebih praktis, terstruktur, dan mudah diakses.
                </motion.p>
              </motion.div>

              {/* Glass Card Showcase */}
              <motion.div
                initial={{ opacity: 0, x: 50, filter: 'blur(20px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                transition={{ duration: 1, delay: 0.4 }}
                className="relative"
              >
                <div className="glass-card rounded-[2rem] p-8 text-slate-900 max-w-md mx-auto relative z-20 backdrop-blur-2xl bg-white/60">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-lg">
                      <Atom className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl">Desain UI/UX</h3>
                      <p className="text-sm text-slate-500 font-medium">12 Modul · 45 Jam</p>
                    </div>
                    <div className="ml-auto px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold tracking-wide">
                      POPULER
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    {[
                      { label: 'Riset Pengguna', value: 90 },
                      { label: 'Wireframing', value: 85 },
                      { label: 'Prototyping', value: 95 },
                      { label: 'Usability Testing', value: 80 },
                    ].map(stat => (
                      <div key={stat.label} className="flex items-center gap-4">
                        <span className="text-sm font-semibold w-28 text-slate-700">{stat.label}</span>
                        <div className="flex-1 h-2.5 bg-white rounded-full overflow-hidden shadow-inner">
                          <div className="h-full bg-slate-800 rounded-full" style={{ width: `${stat.value}%` }}></div>
                        </div>
                        <span className="text-sm font-bold w-6 text-right">{stat.value}%</span>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/50 p-4 rounded-2xl border border-white/60">
                      <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Tingkat</div>
                      <div className="font-bold text-sm">Menengah</div>
                    </div>
                    <div className="bg-white/50 p-4 rounded-2xl border border-white/60">
                      <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Sertifikat</div>
                      <div className="font-bold text-sm">Tersedia</div>
                    </div>
                  </div>
                </div>

                {/* Floating elements behind */}
                <div className="absolute -top-10 -left-16 w-64 z-30 animate-blob">
                  <AdminStatsCard title="Materi & Video" value="900+" trend={{ value: 10, isPositive: true }} type="completion" />
                </div>
                <div className="absolute -bottom-10 -right-16 w-64 z-30 animate-blob" style={{ animationDelay: '2s' }}>
                  <AdminStatsCard title="Kelas & Modul" value="1.400+" trend={{ value: 15, isPositive: true }} type="students" />
                </div>
                <div className="absolute top-32 -right-8 glass-card p-4 rounded-2xl z-10 animate-blob" style={{ animationDelay: '4s' }}>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                    <span className="text-sm font-bold text-slate-800">4.9/5 Rata-rata Penilaian</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Partner Logos Marquee */}
        <ScrollReveal className="w-full overflow-hidden py-8 bg-white/80 backdrop-blur-xl border-y border-white/60 flex flex-col items-center shadow-sm relative z-10">
          <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-6">Belajar bersama ekosistem pendidikan yang terus berkembang</p>
          <div className="flex w-full overflow-hidden">
            {[...Array(2)].map((_, cIdx) => (
              <div key={cIdx} className="flex whitespace-nowrap animate-marquee shrink-0 items-center justify-around min-w-full">
                {[
                  { name: 'Universitas Bina Nusantara', logo: '🏛️' },
                  { name: 'TechBite Academy', logo: '💻' },
                  { name: 'EduCorp Indonesia', logo: '🏢' },
                  { name: 'Sekolah Global Nusantara', logo: '🎓' },
                  { name: 'FutureWorks', logo: '🚀' },
                  { name: 'Creative Studio', logo: '🎨' },
                ].map((partner, i) => (
                  <div key={i} className="flex items-center gap-3 px-8 grayscale hover:grayscale-0 opacity-50 hover:opacity-100 transition-all cursor-pointer">
                    <span className="text-3xl">{partner.logo}</span>
                    <span className="font-display font-bold text-xl text-slate-700">{partner.name}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* Categories Section */}
        <ScrollReveal className="w-full overflow-hidden py-6 bg-white/40 backdrop-blur-xl border-y border-white/60 flex shadow-sm">
          {[...Array(2)].map((_, cIdx) => (
            <div key={cIdx} className="flex whitespace-nowrap animate-marquee shrink-0">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex items-center gap-8 px-4 text-slate-400 font-display font-bold text-xl uppercase tracking-wider">
                  <span>WAKTU BELAJAR FLEKSIBEL</span>
                  <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                  <span>SERTIFIKAT RESMI</span>
                  <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                  <span>PENGAJAR PROFESIONAL</span>
                  <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                  <span>AKSES SEUMUR HIDUP</span>
                  <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                  <span>MATERI SELALU DIPERBARUI</span>
                  <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                  <span>DASHBOARD PROGRESS</span>
                  <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                  <span>KELAS INTERAKTIF</span>
                  <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                  <span>BELAJAR DARI MANA SAJA</span>
                  <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                </div>
              ))}
            </div>
          ))}
        </ScrollReveal>

        <LearningPath />

        <section id="kategori" className="py-20 relative z-10">
          <ScrollReveal className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="font-display font-bold text-3xl md:text-4xl mb-12 text-slate-900">
              Jelajahi kursus berdasarkan bidang
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[
                { name: 'Desain & Seni', icon: '🎨' },
                { name: 'Pemrograman', icon: '💻' },
                { name: 'Bisnis', icon: '📈' },
                { name: 'Pemasaran', icon: '🎯' },
                { name: 'Gaya Hidup', icon: '🧘‍♀️' },
                { name: 'Fotografi', icon: '📸' },
              ].map((category) => (
                <div key={category.name} className="glass-card rounded-2xl p-6 hover:-translate-y-1 transition-transform cursor-pointer flex flex-col items-center justify-center gap-3">
                  <div className="text-4xl">{category.icon}</div>
                  <span className="font-bold text-sm text-slate-800 text-center">{category.name}</span>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </section>

        {/* Why Choose Us Section */}
        <section id="fitur" className="py-32 relative overflow-hidden glass rounded-[3rem] mx-4 md:mx-10 my-10 border border-white/20">
          <ScrollReveal className="max-w-7xl mx-auto px-6 relative z-10 text-slate-900">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4">
                  Kenapa Memilih Kami
                </div>
                <h2 className="font-display font-bold text-4xl md:text-5xl mb-4 max-w-2xl">
                  Platform Belajar Online yang Praktis, Terarah, dan Mudah Digunakan
                </h2>
                <p className="text-slate-600 text-lg max-w-xl font-medium">
                  Kami menghadirkan pengalaman belajar yang fleksibel dengan materi terstruktur, instruktur berpengalaman, dan fitur yang membantu pengguna memahami materi lebih cepat.
                </p>
              </div>
              
              <div className="flex items-center gap-2 p-1 bg-white/40 rounded-xl border border-white/60 shadow-inner">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={cn("p-2 rounded-lg transition-colors font-medium", viewMode === 'grid' ? "bg-white shadow-sm text-blue-600" : "text-slate-500 hover:text-slate-900")}
                >
                  <Grid3X3 className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={cn("p-2 rounded-lg transition-colors font-medium", viewMode === 'list' ? "bg-white shadow-sm text-blue-600" : "text-slate-500 hover:text-slate-900")}
                >
                  <AlignLeft className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className={cn(
              "grid gap-6 transition-all",
              viewMode === 'grid' ? "grid-cols-1 md:grid-cols-3" : "grid-cols-1"
            )}>
              {[
                { id: '01', title: 'Instruktur Ahli', desc: 'Belajar dari pengajar dan praktisi yang memahami kebutuhan siswa dan dunia kerja.', icon: Atom, color: 'bg-indigo-100 text-indigo-600' },
                { id: '02', title: 'Komunitas Belajar', desc: 'Terhubung dengan pengguna lain untuk berbagi insight, diskusi, dan progres belajar.', icon: Wand2, color: 'bg-emerald-100 text-emerald-600' },
                { id: '03', title: 'Dukungan Berkelanjutan', desc: 'Dapatkan bantuan dan panduan agar proses belajar tetap lancar dan terarah.', icon: Terminal, color: 'bg-blue-100 text-blue-600' },
            ].map((feature, i) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={cn(
                  "group glass-card rounded-3xl p-8 hover:-translate-y-2 hover:shadow-2xl hover:border-white transition-all duration-500 bg-white/60 backdrop-blur-xl border border-white/80",
                  viewMode === 'list' ? "flex flex-col md:flex-row md:items-center gap-8" : "flex flex-col"
                )}
              >
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-md bg-white", feature.color, viewMode === 'list' && "mb-0 shrink-0")}>
                  <feature.icon className="w-7 h-7" />
                </div>
                
                <div className="flex-1">
                  <h3 className="font-display font-bold text-2xl text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed font-medium">
                    {feature.desc}
                  </p>
                </div>
                
                {viewMode === 'list' && (
                  <div className="shrink-0 mt-6 md:mt-0">
                    <Link to="/login" className="flex items-center gap-2 text-blue-600 font-bold hover:text-blue-700 bg-white/80 px-4 py-2 rounded-xl">
                      <span>Pelajari Lebih Lanjut</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
          </ScrollReveal>
        </section>

      {/* Broad Selection of Courses */}
      <section className="py-20 relative z-10">
        <ScrollReveal className="max-w-7xl mx-auto px-6 text-slate-900">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4">
              Kelas Populer
            </div>
            <h2 className="font-display font-bold text-4xl md:text-5xl mb-4">Pilihan Kelas untuk Meningkatkan Kemampuanmu</h2>
            <p className="text-slate-600 font-medium text-lg max-w-2xl">Pilih kelas berdasarkan minat, kebutuhan, dan tujuan belajar. Semua materi disusun agar mudah dipahami dan bisa dipelajari secara fleksibel.</p>
          </div>
          <Link to="/login" className="shrink-0 flex items-center gap-2 h-12 px-6 rounded-full glass-card text-slate-700 font-bold hover:bg-white/60 transition-all shadow-sm border border-white/60">
            <span>Lihat Semua Kelas</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {['Semua Kelas', 'Desain', 'Pengembangan', 'Bisnis', 'Teknologi', 'Produktivitas', 'Learning'].map((tab) => (
              <button 
                key={tab} 
                onClick={() => setCourseCategory(tab)}
                className={cn(
                  "whitespace-nowrap px-6 py-2 rounded-full font-bold text-sm transition-all",
                  courseCategory === tab ? "bg-blue-600 text-white shadow-md" : "bg-white/60 text-slate-600 hover:bg-white"
                )}>
                {tab}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-4 flex-wrap">
            <select 
              value={courseLevel}
              onChange={(e) => setCourseLevel(e.target.value)}
              className="px-4 py-2.5 rounded-full font-bold text-sm bg-white border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-sm text-slate-700"
            >
              <option>Semua Level</option>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
            
            <select 
              value={coursePrice}
              onChange={(e) => setCoursePrice(e.target.value)}
              className="px-4 py-2.5 rounded-full font-bold text-sm bg-white border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-sm text-slate-700"
            >
              <option>Semua Harga</option>
              <option>Di bawah Rp 100rb</option>
              <option>Rp 100rb - Rp 150rb</option>
              <option>Di atas Rp 150rb</option>
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.length > 0 ? filteredCourses.map((course) => (
            <div key={course.id} className="glass-card rounded-3xl overflow-hidden hover:-translate-y-2 transition-all duration-300 shadow-md hover:shadow-xl border border-white/60 flex flex-col">
              <div className="aspect-video w-full overflow-hidden relative">
                <img src={course.image} alt={course.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-slate-800">
                  {course.category}
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-3 text-sm font-medium text-slate-500">
                  <div className="flex items-center text-yellow-500">
                    {'★'.repeat(5)} <span className="text-slate-600 ml-1">{course.rating}</span>
                  </div>
                  <span>•</span>
                  <span>{course.level}</span>
                  <span>•</span>
                  <span>{course.lessons} Materi</span>
                </div>
                <h3 className="font-display font-bold text-xl mb-2 line-clamp-2 hover:text-blue-600 transition-colors cursor-pointer">{course.title}</h3>
                <p className="text-sm font-medium text-slate-500 mb-4">Oleh {course.instructor}</p>
                <div className="flex items-center justify-between border-t border-slate-200/50 pt-4 mt-auto">
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-400 line-through font-bold">{course.originalPrice}</span>
                    <span className="font-bold text-lg text-blue-600">{course.price}</span>
                  </div>
                  <Link to="/login" className="h-10 px-4 rounded-full bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition-colors flex items-center justify-center">
                    Ikuti Kelas
                  </Link>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-16 text-center text-slate-500 font-medium bg-white/40 rounded-3xl border border-white/60 backdrop-blur-sm">
              Tidak ada kelas yang sesuai dengan filter Anda.
            </div>
          )}
        </div>
        </ScrollReveal>
      </section>

      {/* Instructor Section */}
      <section id="instruktur" className="py-20 relative z-10">
        <ScrollReveal className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4">
              Instruktur Kami
            </div>
            <h2 className="font-display font-bold text-4xl md:text-5xl mb-4 text-slate-900">
              Belajar dari Pengajar dan Praktisi Berpengalaman
            </h2>
            <p className="text-slate-600 font-medium text-lg max-w-2xl mx-auto">
              Setiap kelas dirancang dan dipandu oleh instruktur yang fokus membantu pengguna memahami konsep, menerapkan skill, dan menyelesaikan pembelajaran dengan percaya diri.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { id: 1, name: 'Elton Portman', role: 'Developer dan Pengajar', bio: 'Berpengalaman mengajar pemrograman, pengembangan web, dan konsep teknologi dengan pendekatan yang mudah dipahami.', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elton' },
              { id: 2, name: 'Edward Narton', role: 'Teacher & Speaker', bio: 'Fokus pada pembelajaran digital, komunikasi, dan pengembangan kemampuan akademik serta profesional.', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Edward' },
              { id: 3, name: 'Donald Rose', role: 'Web Design Teacher', bio: 'Mengajarkan desain web, UI, layout, dan prinsip visual agar peserta mampu membuat tampilan digital yang lebih baik.', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Donald' },
              { id: 4, name: 'Kamal Abraham', role: 'IT Specialist', bio: 'Membantu peserta memahami teknologi, sistem digital, dan skill praktis yang relevan untuk kebutuhan modern.', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kamal' }
            ].map((instructor) => (
              <div key={instructor.id} className="glass-card rounded-3xl p-6 text-center hover:-translate-y-2 transition-all duration-300 shadow-md border border-white/60">
                <div className="w-24 h-24 mx-auto bg-blue-50 rounded-full mb-4 overflow-hidden border-2 border-white shadow-inner">
                  <img src={instructor.image} alt={instructor.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="font-display font-bold text-xl text-slate-900 mb-1">{instructor.name}</h3>
                <p className="text-blue-600 font-medium text-sm mb-4">{instructor.role}</p>
                <p className="text-slate-600 text-sm leading-relaxed">{instructor.bio}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Link to="/login" className="inline-flex items-center gap-2 h-12 px-8 rounded-full bg-white text-blue-600 font-bold hover:bg-slate-50 transition-colors border border-blue-100 shadow-sm">
              <span>Lihat Semua Instruktur</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </ScrollReveal>
      </section>

      <ScrollReveal>
        <TestimonialSlider />
      </ScrollReveal>
      
      <ScrollReveal>
        <FAQSection />
      </ScrollReveal>

      {/* Dual CTA Cards */}
      <section className="py-20 relative z-10">
        <ScrollReveal className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass-card rounded-3xl p-10 md:p-12 border border-white/60 shadow-lg relative overflow-hidden bg-gradient-to-br from-blue-50 to-white/60">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/10 blur-[60px] rounded-full"></div>
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-blue-700 text-xs font-bold uppercase tracking-wider mb-6 shadow-sm">
                Ramah Pengguna & Profesional
              </div>
              <h3 className="font-display font-bold text-3xl md:text-4xl text-slate-900 mb-4 leading-tight">
                Siap Meningkatkan Skill untuk Masa Depan?
              </h3>
              <p className="text-slate-600 font-medium text-lg mb-8 max-w-sm">
                Pilih kelas yang sesuai dengan tujuanmu dan mulai belajar dengan pengalaman yang lebih fleksibel.
              </p>
              <Link to="/login" className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all shadow-md hover:-translate-y-0.5">
                Jelajahi Kelas
              </Link>
            </div>
          </div>
          
          <div className="glass-card rounded-3xl p-10 md:p-12 border border-white/60 shadow-lg relative overflow-hidden bg-gradient-to-br from-emerald-50 to-white/60">
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-emerald-400/10 blur-[60px] rounded-full"></div>
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-emerald-700 text-xs font-bold uppercase tracking-wider mb-6 shadow-sm">
                Kelas Online Interaktif
              </div>
              <h3 className="font-display font-bold text-3xl md:text-4xl text-slate-900 mb-4 leading-tight">
                Belajar Langsung dari Instruktur Ahli
              </h3>
              <p className="text-slate-600 font-medium text-lg mb-8 max-w-sm">
                Ikuti materi video, latihan, dan panduan belajar yang disusun agar mudah diterapkan.
              </p>
              <Link to="/login" className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all shadow-md hover:-translate-y-0.5">
                Mulai Belajar
              </Link>
            </div>
          </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Blog Section */}
      <section id="blog" className="py-32 glass rounded-[3rem] mx-4 md:mx-10 my-10 border border-white/20 shadow-xl">
        <ScrollReveal className="max-w-7xl mx-auto px-6 text-slate-900">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4">
              Artikel Terbaru
            </div>
            <h2 className="font-display font-bold text-4xl md:text-5xl mb-6 drop-shadow-md text-white">
              Baca Insight Terbaru Seputar Belajar dan Skill Digital
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { id: 1, title: 'Skill Penting yang Bisa Dipelajari Melalui Kelas Online', category: 'Produktivitas', date: '30 September 2026', author: 'Admin', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600&h=400' },
              { id: 2, title: 'Belajar Online vs Kelas Tradisional: Mana yang Lebih Cocok?', category: 'Learning', date: '30 September 2026', author: 'Admin', image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=600&h=400' },
              { id: 3, title: 'Cara Memaksimalkan Self-Paced Learning', category: 'Pengembangan Diri', date: '30 September 2026', author: 'Admin', image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=600&h=400' },
              { id: 4, title: 'Peran Teknologi dalam Pendidikan Modern', category: 'Teknologi', date: '30 September 2026', author: 'Admin', image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=600&h=400' }
            ].map((post) => (
              <div key={post.id} className="bg-white/70 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/80 shadow-lg hover:-translate-y-2 transition-transform duration-300">
                <div className="aspect-[16/10] overflow-hidden">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 text-xs font-bold text-slate-500 mb-4 uppercase tracking-wider">
                    <span className="text-blue-600">{post.category}</span>
                    <span>{post.date}</span>
                  </div>
                  <h3 className="font-display font-bold text-lg mb-4 line-clamp-3 hover:text-blue-600 transition-colors cursor-pointer text-slate-900">
                    {post.title}
                  </h3>
                  <Link to="/login" className="inline-flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-blue-600">
                    Baca Selengkapnya <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Link to="/login" className="inline-flex items-center gap-2 h-12 px-8 rounded-full bg-white text-blue-600 font-bold hover:bg-slate-50 transition-colors border border-blue-100 shadow-sm">
              <span>Lihat Semua Artikel</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </ScrollReveal>
      </section>

      {/* App Download Section */}
      <section className="py-20 relative overflow-hidden glass rounded-[3rem] mx-4 md:mx-10 my-10 border border-white/20 shadow-xl bg-blue-900 text-white">
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-l from-blue-600/30 to-transparent"></div>
        <ScrollReveal className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-800/50 text-blue-200 text-xs font-bold uppercase tracking-wider mb-6 border border-blue-700/50">
                Download Aplikasi
              </div>
              <h2 className="font-display font-bold text-4xl md:text-5xl mb-6 leading-tight drop-shadow-md">
                Tempat Terbaik untuk Belajar? <br/>Di Mana Saja Kamu Berada
              </h2>
              <p className="text-blue-100 text-lg max-w-xl font-medium mb-8">
                Dengan aplikasi belajar ini, pengguna dapat mengakses kelas, materi, latihan, dan progress belajar kapan saja dari perangkat mobile.
              </p>
              
              <ul className="space-y-4 mb-10">
                {[
                  'Akses gratis untuk mulai eksplorasi kelas', 
                  'Promo hingga 50% untuk pengguna baru', 
                  'Materi diperbarui secara berkala', 
                  'Progress belajar tersimpan otomatis'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-blue-50 font-medium">
                    <div className="w-6 h-6 rounded-full bg-blue-500/30 flex items-center justify-center shrink-0">
                      <div className="w-2 h-2 rounded-full bg-blue-300"></div>
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <button className="h-14 px-8 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 shadow-xl transition-all flex items-center justify-center gap-3 border border-slate-700">
                  <ScanFace className="w-6 h-6" />
                  <div className="text-left">
                    <div className="text-[10px] uppercase text-slate-400">Segera Hadir di</div>
                    <div className="text-sm leading-tight">App Store</div>
                  </div>
                </button>
                <button className="h-14 px-8 rounded-xl bg-white text-slate-900 font-bold hover:bg-slate-50 shadow-xl transition-all flex items-center justify-center gap-3">
                  <Atom className="w-6 h-6 text-blue-600" />
                  <div className="text-left">
                    <div className="text-[10px] uppercase text-slate-500">Segera Hadir di</div>
                    <div className="text-sm leading-tight">Google Play</div>
                  </div>
                </button>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-blue-900 bg-blue-200 overflow-hidden">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i+10}`} alt="User" />
                    </div>
                  ))}
                </div>
                <div>
                  <div className="font-bold text-xl">1 Juta+</div>
                  <div className="text-xs text-blue-200 font-medium uppercase tracking-wide">Pengguna aktif</div>
                </div>
              </div>
            </div>
            
            <div className="relative hidden lg:block">
              {/* Phone mockup placeholder */}
              <div className="w-[320px] h-[640px] mx-auto bg-slate-900 rounded-[3rem] border-[12px] border-slate-800 shadow-2xl relative overflow-hidden flex items-center justify-center flex-col gap-6">
                <Logo size="lg" />
                <div className="text-white font-display font-bold text-2xl">SEKOLAH<span className="text-blue-500">VERSE</span></div>
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/20 blur-[80px] rounded-full -z-10"></div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 relative z-10 max-w-4xl mx-auto px-6 text-center">
        <ScrollReveal>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider mb-6">
            Newsletter
          </div>
        <h2 className="font-display font-bold text-3xl md:text-5xl mb-4 text-slate-900">
          Dapatkan Update Kelas dan Materi Terbaru
        </h2>
        <p className="text-slate-600 font-medium text-lg mb-10 max-w-2xl mx-auto">
          Berlangganan untuk menerima informasi kelas baru, tips belajar, artikel pilihan, dan promo program secara berkala.
        </p>
        
        <form className="max-w-md mx-auto relative flex flex-col sm:flex-row gap-3">
          <input 
            type="email" 
            placeholder="Masukkan email kamu" 
            className="flex-1 h-14 px-6 rounded-full bg-white border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 font-medium"
            required
          />
          <button type="submit" className="h-14 px-8 rounded-full bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors shadow-md whitespace-nowrap">
            Berlangganan
          </button>
        </form>
        <p className="mt-4 text-xs text-slate-400 font-medium">
          Dengan berlangganan, kamu menyetujui kebijakan privasi dan syarat penggunaan platform.
        </p>
        </ScrollReveal>
      </section>
      </div>

      <Footer />
      
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
          width: fit-content;
        }
      `}</style>
    </div>
  );
}

