import { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { cn } from '../../lib/utils';
import { toast } from 'sonner';

export function ProgramBelajarSection() {
  const [activeTab, setActiveTab] = useState('Semua Program');

  const tabs = ['Semua Program', 'Pre-School', 'SD', 'SMP', 'SMA', 'Lainnya'];

  const allPrograms = [
    { 
      tag: 'Pre-School', 
      title: 'Play Club', 
      desc: 'Membangun kemampuan sosial, motorik, dan sensorik anak melalui aktivitas belajar yang menyenangkan.',
      features: ['Fokus Sosial & Motorik', '12x per bulan', '60 menit/sesi'],
      image: '/assets/landing/program-playclub.jpg',
      category: ['Pre-School']
    },
    { 
      tag: 'SD', 
      title: 'Calistung', 
      desc: 'Membangun kemampuan dasar membaca, menulis, dan berhitung sebagai bekal belajar anak.',
      features: ['Membaca, Menulis, Berhitung', '12x per bulan', '60 menit/sesi'],
      image: '/assets/landing/program-calistung.jpg',
      category: ['Pre-School', 'SD']
    },
    { 
      tag: 'Bahasa', 
      title: 'English Class', 
      desc: 'Mengembangkan kemampuan Bahasa Inggris melalui vocabulary, grammar, reading, writing, listening, dan speaking.',
      features: ['English Skills & Comms', '8x per bulan', '90 menit/sesi'],
      image: '/assets/landing/program-english.jpg',
      category: ['SD', 'SMP', 'SMA']
    },
    { 
      tag: 'Eksakta', 
      title: 'Math Class', 
      desc: 'Memperkuat pemahaman konsep Matematika, kemampuan berhitung, pemecahan masalah, dan penalaran logis.',
      features: ['Mathematics Skills', '4x per bulan', '90 menit/sesi'],
      image: '/assets/landing/program-sma.jpg',
      category: ['SD', 'SMP', 'SMA']
    },
    { 
      tag: 'Sains', 
      title: 'Science Class', 
      desc: 'Memahami konsep IPA melalui pembelajaran yang kontekstual, eksploratif, dan mudah dipahami.',
      features: ['Science & Discovery', '4x per bulan', '90 menit/sesi'],
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=400&h=250',
      category: ['SD', 'SMP', 'SMA']
    },
    { 
      tag: 'Parenting', 
      title: 'Teaching Class for Moms', 
      desc: 'Membantu orang tua memahami cara mendampingi dan mengajarkan anak di rumah dengan metode yang menyenangkan.',
      features: ['Learn How to Teach', '4x per bulan', '90 menit/sesi'],
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=400&h=250',
      category: ['Lainnya']
    },
    { 
      tag: 'Privat', 
      title: 'Private Class', 
      desc: 'Kelas privat yang dapat disesuaikan dengan kebutuhan, kemampuan, target belajar, dan kurikulum siswa.',
      features: ['Personalized Learning', 'Nasional & Internasional', '90 menit/sesi'],
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=400&h=250',
      category: ['SD', 'SMP', 'SMA', 'Lainnya']
    },
    { 
      tag: 'Agama', 
      title: 'Tahfidz Class', 
      desc: 'Membantu siswa menghafal surah dan meningkatkan kemampuan membaca serta menghafalkan bacaan shalat.',
      features: ['Hafalan Surah', 'Bacaan Shalat', '8x per bulan'],
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=400&h=250',
      category: ['Lainnya']
    }
  ];

  const displayedPrograms = activeTab === 'Semua Program'
    ? allPrograms.slice(0, 3)
    : allPrograms.filter(p => p.category.includes(activeTab) || p.tag === activeTab);

  return (
    <section id="program" className="py-14 bg-white scroll-mt-32">
      <div className="max-w-[1240px] mx-auto px-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-[34px] font-extrabold text-[#062564] mb-5">Program Pilihan</h2>
          
          <div className="flex flex-wrap justify-center gap-2.5">
            {tabs.map(tab => (
              <button 
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  toast.info(`Memfilter program: ${tab}`);
                }}
                className={cn(
                  "px-5 py-1.5 rounded-full text-[13px] font-bold transition-all border cursor-pointer",
                  activeTab === tab 
                    ? "bg-[#062564] text-white border-[#062564]" 
                    : tab === 'Lainnya' 
                      ? "bg-[#F16710] text-white border-[#F16710] hover:bg-[#d95b0e]" 
                      : "bg-white text-[#5D6263] border-[#DCE3EE] hover:border-[#062564] hover:text-[#062564]"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[940px] mx-auto">
          {displayedPrograms.map((prog, idx) => (
            <div key={idx} className="bg-white border border-[#DCE3EE] rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col shadow-sm hover:-translate-y-1">
              <div className="relative h-32 overflow-hidden">
                <img src={prog.image} alt={prog.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-2.5 left-2.5 bg-[#F16710] text-white text-[11px] font-extrabold px-2.5 py-0.5 rounded-md shadow-sm">
                  {prog.tag}
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="font-extrabold text-[#062564] text-lg mb-2">{prog.title}</h3>
                <p className="text-sm text-slate-600 mb-4 font-medium leading-relaxed min-h-[44px]">
                  {prog.desc}
                </p>
                
                <div className="space-y-2 mb-6 flex-1">
                  {prog.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-[#F16710] shrink-0 mt-0.5" strokeWidth={3} />
                      <span className="text-[13px] font-semibold text-slate-700">{feat}</span>
                    </div>
                  ))}
                </div>
                
                <button 
                  onClick={() => toast.success(`Membuka detail kurikulum ${prog.title}`)}
                  className="inline-flex items-center gap-2 text-[#062564] font-bold text-sm hover:text-blue-800 transition-colors cursor-pointer text-left"
                >
                  Selengkapnya <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <button 
            onClick={() => {
              setActiveTab('Semua Program');
              toast.success("Menampilkan katalog lengkap bimbingan belajar StudyHack");
            }}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-[#DCE3EE] text-[#062564] text-sm font-bold hover:bg-slate-50 transition-colors shadow-sm cursor-pointer"
          >
            Lihat Semua Program <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
