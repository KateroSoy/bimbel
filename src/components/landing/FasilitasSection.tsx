import { useState } from 'react';
import { MapPin, Wifi, Book, Monitor, Users, Presentation, X, Check } from 'lucide-react';
import { toast } from 'sonner';

export function FasilitasSection() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const fasilitas = [
    { icon: MapPin, label: 'Ruang Belajar Nyaman', desc: 'Dilengkapi kursi ergonomis dan pencahayaan standar belajar modern' },
    { icon: Wifi, label: 'AC & High-Speed WiFi', desc: 'Koneksi internet cepat dan ruangan full AC sejuk' },
    { icon: Book, label: 'Perpustakaan & Modul', desc: 'Ratusan buku latihan, bank soal, dan modul cetak eksklusif' },
    { icon: Monitor, label: 'Lab Komputer CBT', desc: 'Perangkat PC siap simulasi UTBK, SNBT, dan TOEFL' },
    { icon: Users, label: 'Tutor Profesional', desc: 'Pengajar lulusan PTN ternama dengan sertifikasi mengajar' },
    { icon: Presentation, label: 'Kelas Interaktif', desc: 'Smart screen digital & metode diskusi aktif 2 arah' },
  ];

  const galleryImages = [
    { src: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=600&h=800', label: 'Ruang Kelas Reguler' },
    { src: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=600&h=800', label: 'Perpustakaan & Diskusi' },
    { src: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=600&h=800', label: 'Lab Komputer CBT' },
    { src: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=600&h=800', label: 'Sesi Belajar Interaktif' },
  ];

  const handleFasilitasClick = (item: typeof fasilitas[0]) => {
    toast.success(`Fasilitas: ${item.label}`, {
      description: item.desc
    });
  };

  return (
    <section id="fasilitas" className="py-20 bg-white relative scroll-mt-24">
      <div id="pengajar" className="scroll-mt-24"></div>
      <div className="max-w-[1240px] mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-[#062564] mb-12">
          Fasilitas Bimbel StudyHack
        </h2>
        
        <div className="flex flex-wrap justify-center gap-6 md:gap-12 mb-16">
          {fasilitas.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                onClick={() => handleFasilitasClick(item)}
                className="flex flex-col items-center text-center gap-3 w-24 md:w-32 group cursor-pointer focus:outline-none"
              >
                <div className="w-16 h-16 rounded-full border-2 border-red-100 flex items-center justify-center text-[#E52833] bg-white shadow-sm group-hover:scale-110 group-hover:border-[#E52833] group-hover:bg-red-50 transition-all duration-300">
                  <Icon className="w-8 h-8" strokeWidth={1.5} />
                </div>
                <span className="text-xs font-bold text-slate-700 leading-tight group-hover:text-[#062564] transition-colors">{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {galleryImages.map((img, idx) => (
            <div 
              key={idx}
              onClick={() => setSelectedImage(img.src)}
              className="rounded-2xl overflow-hidden aspect-[3/4] shadow-md relative group cursor-pointer"
            >
              <img 
                src={img.src} 
                alt={img.label} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <span className="text-white text-xs font-bold">{img.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm"
        >
          <div className="relative max-w-3xl max-h-[85vh] rounded-2xl overflow-hidden shadow-2xl">
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <img src={selectedImage} alt="Fasilitas Preview" className="w-full h-auto max-h-[85vh] object-contain rounded-2xl" />
          </div>
        </div>
      )}
    </section>
  );
}
