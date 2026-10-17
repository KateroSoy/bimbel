import { useState } from 'react';
import { X, Armchair, Wifi, BookOpenText, Monitor, UsersRound, Presentation } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '../../lib/utils';
import { whatsappUrl } from '../../lib/contact';
import { openChat } from './ChatWidget';

const FASILITAS = [
  { icon: Armchair, color: 'text-[#205C96]', label: 'Ruang Belajar Nyaman', desc: 'Dilengkapi kursi ergonomis dan pencahayaan standar belajar modern' },
  { icon: Wifi, color: 'text-[#205C96]', label: 'AC & WiFi', desc: 'Koneksi internet cepat dan ruangan full AC sejuk' },
  { icon: BookOpenText, color: 'text-[#F16710]', label: 'Perpustakaan', desc: 'Ratusan buku latihan, bank soal, dan modul cetak eksklusif' },
  { icon: Monitor, color: 'text-[#205C96]', label: 'Lab Komputer', desc: 'Perangkat PC siap simulasi UTBK, SNBT, dan TOEFL' },
  { icon: UsersRound, color: 'text-[#E52833]', label: 'Tutor Profesional', desc: 'Pengajar lulusan PTN ternama dengan sertifikasi mengajar' },
  { icon: Presentation, color: 'text-[#205C96]', label: 'Kelas Interaktif', desc: 'Smart screen digital & metode diskusi aktif 2 arah' },
];

// Foto fasilitas dari StudyHack (dipotong seragam 4:3)
const GALLERY = [
  { src: '/assets/landing/gallery/foto-01.jpg', label: 'Ruang Bermain & Belajar Anak' },
  { src: '/assets/landing/gallery/foto-02.jpg', label: 'Ruang Kelas Kids' },
  { src: '/assets/landing/gallery/foto-03.jpg', label: 'Ruang Diskusi' },
  { src: '/assets/landing/gallery/foto-04.jpg', label: 'Panggung & Area Kegiatan' },
  { src: '/assets/landing/gallery/foto-05.jpg', label: 'Green House' },
  { src: '/assets/landing/gallery/foto-06.jpg', label: 'Lobi StudyHack' },
  { src: '/assets/landing/gallery/foto-07.jpg', label: 'Area Bermain Outdoor' },
  { src: '/assets/landing/gallery/foto-08.jpg', label: 'Halaman' },
];

export function TentangKamiSection() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <>
      {/* Consultation CTA Banner */}
      <section id="konsultasi" className="pt-8 pb-4 bg-white scroll-mt-32">
        <div className="max-w-[1040px] mx-auto px-6">
          <div className="bg-[#062564] rounded-2xl px-6 py-5 md:px-8 flex flex-col md:flex-row items-center justify-between shadow-lg gap-5">
            <div className="flex items-center gap-5 text-white">
              <img
                src="/assets/landing/cs-avatar.jpg"
                alt="Konsultan StudyHack"
                className="w-16 h-16 rounded-full object-cover shrink-0 hidden sm:block"
              />
              <div>
                <h3 className="font-extrabold text-xl md:text-2xl mb-0.5">Masih bingung memilih program?</h3>
                <p className="text-blue-100 text-sm font-semibold">Konsultasikan kebutuhan belajar kamu dengan tim kami.</p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
              <button
                onClick={() => openChat()}
                className="flex-1 md:flex-none text-center bg-[#19A66A] hover:bg-green-700 text-white font-extrabold px-7 py-3 rounded-xl text-sm transition-colors cursor-pointer"
              >
                Konsultasi Gratis
              </button>
              <a
                href={whatsappUrl('Halo StudyHack, saya ingin bertanya tentang program bimbel.')}
                target="_blank"
                rel="noreferrer"
                className="flex-1 md:flex-none text-center bg-white hover:bg-slate-100 text-[#062564] font-extrabold px-7 py-3 rounded-xl text-sm transition-colors"
              >
                Hubungi Kami
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Tentang Kami: fasilitas + testimoni */}
      <section id="tentang" className="py-10 bg-white relative scroll-mt-32">
        <div id="fasilitas" className="scroll-mt-32"></div>
        <div className="max-w-[1040px] mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-[30px] font-extrabold text-[#062564]">Tentang Kami</h2>
            <div className="w-14 h-1 bg-[#F16710] rounded-full mx-auto mt-2"></div>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-6 gap-y-6 gap-x-2 mb-8">
            {FASILITAS.map(({ icon: Icon, color, label, desc }) => (
              <button
                key={label}
                onClick={() => toast.success(`Fasilitas: ${label}`, { description: desc })}
                className="flex flex-col items-center text-center gap-2 group cursor-pointer focus:outline-none"
              >
                <Icon className={cn("w-9 h-9 group-hover:scale-110 transition-transform", color)} strokeWidth={1.5} />
                <span className="text-xs md:text-[13px] font-bold text-slate-700 leading-tight">{label}</span>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {GALLERY.map((img) => (
              <button
                key={img.src}
                onClick={() => setSelectedImage(img.src)}
                className="rounded-xl overflow-hidden aspect-[4/3] relative group cursor-pointer"
              >
                <img src={img.src} alt={img.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                  <span className="text-white text-xs font-bold">{img.label}</span>
                </div>
              </button>
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
                aria-label="Tutup"
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors z-10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <img src={selectedImage} alt="Fasilitas StudyHack" className="w-full h-auto max-h-[85vh] object-contain rounded-2xl" />
            </div>
          </div>
        )}
      </section>
    </>
  );
}
