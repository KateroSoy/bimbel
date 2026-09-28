import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Facebook, Instagram, Youtube, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

export function Footer() {
  const handleSocialClick = (name: string) => {
    toast.success(`Membuka profil ${name} StudyHack`, {
      description: "Terima kasih sudah terhubung dengan sosial media kami."
    });
  };

  const handleOpenMap = () => {
    toast.info("Membuka Google Maps: Kampus Pusat StudyHack Bandung");
    window.open("https://maps.google.com/?q=Kota+Bandung", "_blank");
  };

  return (
    <footer id="kontak" className="bg-[#F9F8F9] pt-20 pb-10 border-t border-[#DCE3EE] scroll-mt-24">
      <div className="max-w-[1240px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2 pr-8">
            <h4 className="font-bold text-slate-800 text-lg mb-4">StudyHack Education</h4>
            
            <ul className="space-y-4 mb-8 text-sm text-slate-600 font-medium">
              <li className="flex gap-3">
                <MapPin className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <span>Jl. Pendidikan No. 123<br/>Kota Bandung, Jawa Barat 40123</span>
              </li>
              <li className="flex gap-3 items-center">
                <Phone className="w-5 h-5 text-red-500 shrink-0" />
                <span>0823-2456-7906 / (022) 1234-5678</span>
              </li>
              <li className="flex gap-3 items-center">
                <Mail className="w-5 h-5 text-red-500 shrink-0" />
                <span>info@studyhack.co.id</span>
              </li>
            </ul>
            
            <div className="flex gap-3">
              <button 
                onClick={() => handleSocialClick('Facebook')}
                className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-blue-600 hover:border-blue-600 transition-colors cursor-pointer shadow-xs"
              >
                <Facebook className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleSocialClick('Instagram')}
                className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-pink-600 hover:border-pink-600 transition-colors cursor-pointer shadow-xs"
              >
                <Instagram className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleSocialClick('YouTube')}
                className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-red-600 hover:border-red-600 transition-colors cursor-pointer shadow-xs"
              >
                <Youtube className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-slate-800 text-lg mb-4">Link Cepat</h4>
            <ul className="space-y-3 text-sm text-slate-600 font-medium">
              <li><Link to="/#tentang" className="hover:text-[#F16710] transition-colors">Tentang Kami</Link></li>
              <li><Link to="/#program" className="hover:text-[#F16710] transition-colors">Program Belajar</Link></li>
              <li><Link to="/#kursus-materi" className="hover:text-[#F16710] transition-colors">Kursus Per Materi</Link></li>
              <li><Link to="/#paket" className="hover:text-[#F16710] transition-colors">Paket Terbaik</Link></li>
              <li><Link to="/#produk-digital" className="hover:text-[#F16710] transition-colors">Produk Digital</Link></li>
              <li><Link to="/#fasilitas" className="hover:text-[#F16710] transition-colors">Fasilitas Bimbel</Link></li>
              <li><Link to="/#testimoni" className="hover:text-[#F16710] transition-colors">Testimoni Siswa</Link></li>
              <li><Link to="/#faq" className="hover:text-[#F16710] transition-colors">Tanya Jawab (FAQ)</Link></li>
              <li><Link to="/karir" className="hover:text-[#F16710] transition-colors">Karir</Link></li>
              <li><Link to="/login" className="text-blue-600 font-bold hover:underline">Masuk LMS Demo &rarr;</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-slate-800 text-lg mb-4">Lokasi Kami</h4>
            <div 
              onClick={handleOpenMap}
              className="rounded-xl overflow-hidden bg-slate-200 aspect-[4/3] shadow-inner border border-slate-300 relative group cursor-pointer"
            >
              <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=400&h=300" className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500" alt="Map Location" />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-xs p-2.5 rounded-full shadow-lg">
                <MapPin className="w-6 h-6 text-red-600" />
              </div>
              <div className="absolute bottom-2 left-2 right-2 bg-white/95 rounded-lg py-1 px-2 text-[11px] font-bold text-slate-800 text-center flex items-center justify-center gap-1 shadow-xs">
                Buka Google Maps <ExternalLink className="w-3 h-3" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-[#DCE3EE] text-center flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 font-medium text-xs">
            © 2024 StudyHack Education. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs font-semibold text-slate-500">
            <Link to="/#faq" className="hover:text-slate-900">Kebijakan Privasi</Link>
            <span>•</span>
            <Link to="/#faq" className="hover:text-slate-900">Syarat & Ketentuan</Link>
            <span>•</span>
            <Link to="/login" className="text-blue-600 font-bold hover:underline">Portal LMS</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
