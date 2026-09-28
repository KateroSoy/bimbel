import { useEffect, useState } from 'react';
import { Star, X, Armchair, Wifi, BookOpenText, Monitor, UsersRound, Presentation } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '../../lib/utils';

const FASILITAS = [
  { icon: Armchair, color: 'text-[#205C96]', label: 'Ruang Belajar Nyaman', desc: 'Dilengkapi kursi ergonomis dan pencahayaan standar belajar modern' },
  { icon: Wifi, color: 'text-[#205C96]', label: 'AC & WiFi', desc: 'Koneksi internet cepat dan ruangan full AC sejuk' },
  { icon: BookOpenText, color: 'text-[#F16710]', label: 'Perpustakaan', desc: 'Ratusan buku latihan, bank soal, dan modul cetak eksklusif' },
  { icon: Monitor, color: 'text-[#205C96]', label: 'Lab Komputer', desc: 'Perangkat PC siap simulasi UTBK, SNBT, dan TOEFL' },
  { icon: UsersRound, color: 'text-[#E52833]', label: 'Tutor Profesional', desc: 'Pengajar lulusan PTN ternama dengan sertifikasi mengajar' },
  { icon: Presentation, color: 'text-[#205C96]', label: 'Kelas Interaktif', desc: 'Smart screen digital & metode diskusi aktif 2 arah' },
];

const GALLERY = [
  { src: '/assets/landing/fasilitas-1.jpg', label: 'Ruang Kelas Reguler' },
  { src: '/assets/landing/fasilitas-2.jpg', label: 'Pojok Baca & Perpustakaan' },
  { src: '/assets/landing/fasilitas-3.jpg', label: 'Lab Komputer' },
  { src: '/assets/landing/fasilitas-4.jpg', label: 'Kelas Interaktif' },
];

// Struktur data siap diisi dari Google Review (author_name, rating, text, profile_photo_url)
const TESTIMONIALS: { name: string; role: string; text: string; rating: number; photo?: string }[] = [
  {
    name: 'Andi Pratama',
    role: 'Siswa Kelas 11',
    text: 'Belajar di StudyHack sangat membantu saya memahami materi dengan lebih mudah. Tutor ramah dan penjelasannya jelas!',
    rating: 5,
    photo: '/assets/landing/testimoni-andi.jpg',
  },
  {
    name: 'Ibu Ratna',
    role: 'Orang Tua Siswa SD',
    text: 'Anak saya jadi lebih semangat belajar. Laporan perkembangannya rutin dikirim sehingga saya bisa ikut memantau.',
    rating: 5,
  },
  {
    name: 'Nadia Putri',
    role: 'Alumni, Lolos SNBT 2025',
    text: 'Tryout dan pembahasan UTBK-nya lengkap banget. Kelasnya kecil jadi bisa tanya kapan saja ke tutor.',
    rating: 5,
  },
];

const REVIEW_AVATARS = ['#F59E0B', '#205C96', '#E52833', '#19A66A'];

export function TentangKamiSection() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [testiIdx, setTestiIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTestiIdx((i) => (i + 1) % TESTIMONIALS.length), 6000);
    return () => clearInterval(t);
  }, [testiIdx]);

  const handleConsultation = () => {
    window.open("https://wa.me/6282324567906?text=Halo%20StudyHack,%20saya%20ingin%20konsultasi%20program%20bimbel", "_blank");
  };

  const handleContact = () => {
    toast.info("Hubungi Kami", {
      description: "Telepon: 0823-2456-7906 | Email: info@studyhack.co.id"
    });
  };

  const testi = TESTIMONIALS[testiIdx];

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
                onClick={handleConsultation}
                className="flex-1 md:flex-none text-center bg-[#19A66A] hover:bg-green-700 text-white font-extrabold px-7 py-3 rounded-xl text-sm transition-colors cursor-pointer"
              >
                Konsultasi Gratis
              </button>
              <button
                onClick={handleContact}
                className="flex-1 md:flex-none text-center bg-white hover:bg-slate-100 text-[#062564] font-extrabold px-7 py-3 rounded-xl text-sm transition-colors cursor-pointer"
              >
                Hubungi Kami
              </button>
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

          <div className="grid grid-cols-2 md:grid-cols-[1.15fr_1fr_0.87fr_0.98fr] gap-3 md:gap-4 mb-5">
            {GALLERY.map((img) => (
              <button
                key={img.src}
                onClick={() => setSelectedImage(img.src)}
                className="rounded-xl overflow-hidden h-48 md:h-[290px] relative group cursor-pointer"
              >
                <img src={img.src} alt={img.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                  <span className="text-white text-xs font-bold">{img.label}</span>
                </div>
              </button>
            ))}
          </div>

          <div id="testimoni" className="grid grid-cols-1 md:grid-cols-[1.45fr_1fr] gap-4 scroll-mt-32">
            {/* Testimonial carousel */}
            <div className="bg-white rounded-2xl p-5 md:p-6 border border-[#DCE3EE] shadow-sm flex flex-col">
              <div className="flex flex-col sm:flex-row gap-5 flex-1">
                <div className="w-28 h-32 rounded-xl overflow-hidden shrink-0 bg-slate-100 flex items-center justify-center">
                  {testi.photo ? (
                    <img src={testi.photo} alt={testi.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl font-extrabold text-[#062564]/60">{testi.name.replace('Ibu ', '').charAt(0)}</span>
                  )}
                </div>
                <div className="flex flex-col justify-center">
                  <div className="flex items-center gap-0.5 mb-2">
                    {Array.from({ length: testi.rating }).map((_, i) => <Star key={i} className="w-4 h-4 text-amber-400 fill-current" />)}
                  </div>
                  <p className="text-slate-700 font-semibold text-sm leading-relaxed mb-3">{testi.text}</p>
                  <h4 className="font-extrabold text-[#062564] text-sm">{testi.name}</h4>
                  <p className="text-xs text-slate-500 font-semibold">{testi.role}</p>
                </div>
              </div>
              <div className="flex justify-center gap-2 mt-4">
                {TESTIMONIALS.map((t, i) => (
                  <button
                    key={t.name}
                    onClick={() => setTestiIdx(i)}
                    aria-label={`Testimoni ${i + 1}`}
                    className={cn("h-2 rounded-full transition-all cursor-pointer", i === testiIdx ? "w-5 bg-[#062564]" : "w-2 bg-slate-300")}
                  />
                ))}
              </div>
            </div>

            {/* Rating card */}
            <div className="rounded-2xl border border-[#DCE3EE] shadow-sm overflow-hidden flex flex-col">
              <div className="bg-[#062564] text-white p-6 flex-1 flex flex-col justify-center">
                <Star className="w-9 h-9 text-amber-400 mb-2" strokeWidth={2.5} />
                <div className="text-3xl font-extrabold leading-tight">4.9/5</div>
                <div className="text-blue-100 text-sm font-semibold">dari 500+ ulasan peserta</div>
              </div>
              <div className="bg-white px-6 py-3 flex items-center">
                <div className="flex -space-x-2">
                  {REVIEW_AVATARS.map((color, i) => (
                    <span key={color} className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-[11px] font-extrabold" style={{ backgroundColor: color }}>
                      {['A', 'R', 'N', 'S'][i]}
                    </span>
                  ))}
                </div>
                <span className="ml-3 text-xs font-bold text-slate-500">+496</span>
              </div>
            </div>
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
