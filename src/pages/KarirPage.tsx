import { useState } from 'react';
import { Briefcase, MapPin, Clock, ChevronDown, Mail, MessageCircle, Heart, GraduationCap, TrendingUp } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { cn } from '../lib/utils';

// Daftar lowongan — ubah/tambah posisi di sini
const LOWONGAN = [
  {
    title: 'Tutor Matematika (SD–SMA)',
    divisi: 'Akademik',
    tipe: 'Part Time',
    lokasi: 'Bandung',
    deskripsi: 'Mengajar kelas reguler dan privat Matematika untuk jenjang SD hingga SMA, termasuk persiapan ujian sekolah.',
    kualifikasi: [
      'Minimal mahasiswa tingkat akhir / S1 Pendidikan Matematika, Matematika, atau bidang terkait',
      'Menguasai materi Kurikulum Nasional; nilai plus jika memahami Cambridge/IB',
      'Komunikatif, sabar, dan senang mengajar anak',
    ],
  },
  {
    title: 'Tutor Bahasa Inggris',
    divisi: 'Akademik',
    tipe: 'Part Time',
    lokasi: 'Bandung',
    deskripsi: 'Mengajar English Class (grammar, reading, writing, speaking) untuk siswa SD, SMP, dan SMA.',
    kualifikasi: [
      'S1 Pendidikan Bahasa Inggris / Sastra Inggris atau setara',
      'Memiliki skor TOEFL/IELTS yang baik (nilai plus)',
      'Kreatif dalam membuat aktivitas belajar yang menyenangkan',
    ],
  },
  {
    title: 'Staff Admin & Customer Service',
    divisi: 'Operasional',
    tipe: 'Full Time',
    lokasi: 'Bandung',
    deskripsi: 'Melayani pendaftaran siswa, menjawab pertanyaan orang tua via WhatsApp, dan mengelola jadwal kelas.',
    kualifikasi: [
      'Minimal D3/S1 semua jurusan',
      'Terbiasa menggunakan Google Workspace / Microsoft Office',
      'Ramah, teliti, dan mampu bekerja dengan target',
    ],
  },
  {
    title: 'Staff Marketing & Social Media',
    divisi: 'Marketing',
    tipe: 'Full Time',
    lokasi: 'Bandung / Hybrid',
    deskripsi: 'Merencanakan konten Instagram, TikTok, dan YouTube, serta menjalankan program promosi StudyHack.',
    kualifikasi: [
      'Minimal D3/S1 Komunikasi, Marketing, DKV, atau bidang terkait',
      'Mampu membuat konten foto/video pendek (Canva, CapCut, dsb.)',
      'Memiliki portofolio media sosial (nilai plus)',
    ],
  },
];

const BENEFITS = [
  { icon: Heart, title: 'Lingkungan Suportif', desc: 'Tim yang hangat dan kolaboratif' },
  { icon: GraduationCap, title: 'Pelatihan Rutin', desc: 'Pengembangan skill mengajar & profesional' },
  { icon: TrendingUp, title: 'Jenjang Karir', desc: 'Kesempatan berkembang bersama StudyHack' },
];

const HR_EMAIL = 'info@studyhack.co.id';
const HR_WA = '6282324567906';

export default function KarirPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div className="landing-font min-h-screen bg-white text-[#171719] overflow-x-hidden">
      <Navbar />

      {/* Header */}
      <section className="pt-36 md:pt-[150px] pb-10 bg-[#F9F8F9] border-b border-[#DCE3EE]">
        <div className="max-w-[960px] mx-auto px-6 text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-[#F16710] text-xs font-extrabold mb-4">
            <Briefcase className="w-3.5 h-3.5" /> KARIR DI STUDYHACK
          </span>
          <h1 className="text-3xl md:text-[42px] font-extrabold text-[#062564] leading-tight mb-3">
            Tumbuh Bersama, <span className="text-[#F16710]">Mencerdaskan Bangsa</span>
          </h1>
          <p className="text-slate-600 font-semibold max-w-xl mx-auto">
            Kami mencari tutor dan staff yang bersemangat membantu siswa meraih prestasi terbaiknya.
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-10">
        <div className="max-w-[960px] mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {BENEFITS.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-center gap-3 p-4 rounded-2xl border border-[#DCE3EE]">
              <div className="w-10 h-10 rounded-xl bg-[#062564] text-white flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-[#062564] text-sm">{title}</h3>
                <p className="text-xs text-slate-500 font-semibold">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Job list */}
      <section className="pb-16">
        <div className="max-w-[960px] mx-auto px-6">
          <h2 className="text-2xl font-extrabold text-[#062564] mb-1">Lowongan Tersedia</h2>
          <p className="text-sm text-slate-500 font-semibold mb-6">{LOWONGAN.length} posisi terbuka</p>

          <div className="space-y-3">
            {LOWONGAN.map((job, idx) => {
              const isOpen = openIdx === idx;
              const subject = encodeURIComponent(`Lamaran - ${job.title}`);
              const waText = encodeURIComponent(`Halo StudyHack, saya ingin melamar posisi ${job.title}.`);
              return (
                <div key={job.title} className={cn("rounded-2xl border bg-white transition-colors", isOpen ? "border-[#062564]/40 shadow-md" : "border-[#DCE3EE]")}>
                  <button
                    onClick={() => setOpenIdx(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center justify-between gap-4 p-5 text-left cursor-pointer"
                  >
                    <div>
                      <h3 className="font-extrabold text-[#062564] text-base md:text-lg">{job.title}</h3>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 text-xs font-bold text-slate-500">
                        <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" /> {job.divisi}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {job.tipe}</span>
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {job.lokasi}</span>
                      </div>
                    </div>
                    <ChevronDown className={cn("w-5 h-5 text-slate-400 shrink-0 transition-transform", isOpen && "rotate-180")} />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 border-t border-slate-100 pt-4">
                      <p className="text-sm text-slate-700 font-semibold mb-3">{job.deskripsi}</p>
                      <h4 className="text-xs font-extrabold text-[#062564] uppercase tracking-wide mb-2">Kualifikasi</h4>
                      <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 font-medium mb-5">
                        {job.kualifikasi.map((k) => <li key={k}>{k}</li>)}
                      </ul>
                      <div className="flex flex-wrap gap-2">
                        <a
                          href={`https://wa.me/${HR_WA}?text=${waText}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#19A66A] hover:bg-green-700 text-white text-sm font-extrabold transition-colors"
                        >
                          <MessageCircle className="w-4 h-4" /> Lamar via WhatsApp
                        </a>
                        <a
                          href={`mailto:${HR_EMAIL}?subject=${subject}`}
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#062564] text-[#062564] hover:bg-slate-50 text-sm font-extrabold transition-colors"
                        >
                          <Mail className="w-4 h-4" /> Kirim CV via Email
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <p className="text-xs text-slate-500 font-semibold mt-6">
            Tidak menemukan posisi yang cocok? Kirimkan CV kamu ke <a href={`mailto:${HR_EMAIL}`} className="text-[#062564] underline">{HR_EMAIL}</a> — kami akan menghubungi saat ada posisi yang sesuai.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
