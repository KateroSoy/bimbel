import { motion } from 'motion/react';
import { ScrollReveal } from './ui/ScrollReveal';
import { Compass, BookOpen, Target, Award } from 'lucide-react';
import { cn } from '../lib/utils';

const STEPS = [
  {
    id: '01',
    title: 'Beginner',
    subtitle: 'Mulai Perjalananmu',
    description: 'Pelajari konsep dasar dan fondasi penting dari bidang yang kamu minati dengan materi yang mudah dipahami.',
    icon: Compass,
    color: 'bg-blue-100 text-blue-600',
    borderColor: 'border-blue-200'
  },
  {
    id: '02',
    title: 'Intermediate',
    subtitle: 'Kembangkan Keahlian',
    description: 'Tingkatkan pemahamanmu melalui proyek praktik, studi kasus, dan evaluasi untuk membangun portofolio awal.',
    icon: BookOpen,
    color: 'bg-emerald-100 text-emerald-600',
    borderColor: 'border-emerald-200'
  },
  {
    id: '03',
    title: 'Advanced',
    subtitle: 'Kuasai Keterampilan',
    description: 'Pelajari teknik tingkat lanjut, best practices industri, dan selesaikan tantangan dunia nyata yang kompleks.',
    icon: Target,
    color: 'bg-indigo-100 text-indigo-600',
    borderColor: 'border-indigo-200'
  },
  {
    id: '04',
    title: 'Expert',
    subtitle: 'Siap Berkarir',
    description: 'Dapatkan sertifikasi profesional, bangun koneksi, dan mulai karir impianmu dengan percaya diri penuh.',
    icon: Award,
    color: 'bg-purple-100 text-purple-600',
    borderColor: 'border-purple-200'
  }
];

export function LearningPath() {
  return (
    <section className="py-24 relative overflow-hidden bg-slate-50 border-y border-slate-200/50">
      <ScrollReveal className="max-w-7xl mx-auto px-6 relative z-10 text-slate-900">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4">
            Alur Belajar
          </div>
          <h2 className="font-display font-bold text-4xl md:text-5xl mb-4 max-w-3xl mx-auto">
            Langkah Terstruktur Menuju Keahlian Profesional
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto font-medium">
            Ikuti kurikulum kami yang dirancang khusus untuk membimbingmu dari tingkat pemula hingga menjadi ahli yang siap bersaing di dunia kerja.
          </p>
        </div>

        <div className="relative">
          {/* Connecting Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-blue-200 via-emerald-200 to-purple-200 -translate-y-1/2 rounded-full opacity-50"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {STEPS.map((step, index) => (
              <motion.div
                key={step.id}
                whileHover={{ y: -5 }}
                className="relative bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 z-10"
              >
                <div className="absolute -top-6 -left-6 text-6xl font-display font-bold text-slate-50 opacity-50 z-0 select-none pointer-events-none">
                  {step.id}
                </div>
                
                <div className="relative z-10">
                  <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border", step.color, step.borderColor)}>
                    <step.icon className="w-7 h-7" />
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="font-display font-bold text-2xl text-slate-900">{step.title}</h3>
                    <p className="text-sm font-bold uppercase tracking-wider text-slate-400 mt-1">{step.subtitle}</p>
                  </div>
                  
                  <p className="text-slate-600 leading-relaxed font-medium">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
