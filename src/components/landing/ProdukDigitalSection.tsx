import { BookOpen, FileText, BookMarked, Printer, Download, BadgePercent, RefreshCw, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

const LEFT_FEATURES = [
  { icon: BookOpen, color: 'text-[#205C96]', title: 'Modul Pembelajaran', desc: 'Materi lengkap dan terstruktur' },
  { icon: FileText, color: 'text-[#F16710]', title: 'Worksheet & Latihan Soal', desc: 'Latihan menarik dan sesuai kurikulum' },
  { icon: BookMarked, color: 'text-[#F16710]', title: 'Buku Digital', desc: 'Buku elektronik praktis dan mudah diakses' },
  { icon: Printer, color: 'text-[#19A66A]', title: 'Siap Cetak / Print Friendly', desc: 'Desain rapi, hemat tinta dan kertas' },
];

const RIGHT_FEATURES = [
  { icon: Download, color: 'text-[#205C96]', title: 'Akses Instan', desc: 'Unduh segera setelah pembayaran' },
  { icon: BadgePercent, color: 'text-[#F16710]', title: 'Harga Terjangkau', desc: 'Kualitas terbaik, harga bersahabat' },
  { icon: RefreshCw, color: 'text-[#205C96]', title: 'Update Berkala', desc: 'Materi selalu diperbarui sesuai kebutuhan' },
];

export function ProdukDigitalSection() {
  const handleProductClick = (title: string) => {
    toast.success(`Membuka katalog: ${title}`, {
      description: "Pembayaran produk digital diproses terpisah dari pembayaran bimbel."
    });
  };

  return (
    <section id="produk-digital" className="py-10 bg-white scroll-mt-32">
      <div className="max-w-[1240px] mx-auto px-6">
        <div className="bg-[#F0F6FE] rounded-[24px] border border-[#DCE3EE] px-6 py-8 md:px-10 md:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.3fr_0.7fr] gap-8 items-center">
            {/* Left: title + features */}
            <div>
              <h2 className="text-2xl md:text-[26px] font-extrabold text-[#062564] mb-2 xl:whitespace-nowrap">Produk Digital StudyHack</h2>
              <p className="text-sm text-slate-600 font-semibold leading-relaxed mb-6">
                Dapatkan berbagai produk digital berkualitas untuk mendukung proses belajar di mana saja dan kapan saja.
              </p>
              <div className="space-y-4">
                {LEFT_FEATURES.map(({ icon: Icon, color, title, desc }) => (
                  <div key={title} className="flex gap-3 items-start">
                    <div className={`w-10 h-10 rounded-xl bg-white border border-[#DCE3EE] flex items-center justify-center shrink-0 ${color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#062564] text-sm leading-tight">{title}</h4>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Center: book covers */}
            <button
              onClick={() => handleProductClick('Modul, Worksheet & Buku Latihan')}
              className="block cursor-pointer group"
              aria-label="Lihat produk digital"
            >
              <img
                src="/assets/landing/produk-books-hd.jpg"
                alt="Modul Matematika, Worksheet Bahasa Inggris, dan Buku Latihan UTBK"
                className="w-full h-auto group-hover:scale-[1.02] transition-transform duration-300"
              />
            </button>

            {/* Right: benefits card */}
            <div className="bg-white rounded-2xl border border-[#DCE3EE] shadow-sm p-5 space-y-5">
              {RIGHT_FEATURES.map(({ icon: Icon, color, title, desc }) => (
                <div key={title} className="flex gap-3 items-start">
                  <Icon className={`w-6 h-6 shrink-0 mt-0.5 ${color}`} />
                  <div>
                    <h4 className="font-bold text-[#062564] text-sm leading-tight">{title}</h4>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-6">
            <button
              onClick={() => handleProductClick("Semua Produk Digital")}
              className="inline-flex items-center gap-3 h-11 px-8 rounded-full bg-[#062564] text-white text-sm font-extrabold hover:bg-blue-900 transition-colors shadow-lg shadow-blue-900/20 cursor-pointer"
            >
              Lihat Semua Produk <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
