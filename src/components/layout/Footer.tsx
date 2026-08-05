import { Link } from 'react-router-dom';
import { Logo } from '../ui/Logo';

export function Footer() {
  return (
    <footer className="glass border-t border-white/20 pt-20 pb-10 relative overflow-hidden text-slate-900 mt-20">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-full max-w-3xl h-64 bg-blue-400/20 blur-[100px] rounded-full pointer-events-none"></div>
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <Logo size="sm" />
              <span className="font-display font-bold text-xl tracking-tight text-slate-900 drop-shadow-sm">
                SEKOLAH<span className="text-blue-600">VERSE</span>
              </span>
            </Link>
            <p className="text-slate-700 font-medium text-sm leading-relaxed">
              Platform pembelajaran online yang membantu siswa, guru, sekolah, dan profesional mengembangkan skill melalui kelas digital yang fleksibel dan mudah diakses.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-4 drop-shadow-sm text-slate-900">Program</h4>
            <ul className="space-y-3 text-sm text-slate-700 font-medium">
              <li><Link to="/#kategori" className="hover:text-blue-600 transition-colors">Kelas Singkat</Link></li>
              <li><Link to="/#kategori" className="hover:text-blue-600 transition-colors">Expert Track</Link></li>
              <li><Link to="/#kategori" className="hover:text-blue-600 transition-colors">Sertifikat</Link></li>
              <li><Link to="/#kategori" className="hover:text-blue-600 transition-colors">Kelas Online</Link></li>
              <li><Link to="/#kategori" className="hover:text-blue-600 transition-colors">Program Sekolah</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4 drop-shadow-sm text-slate-900">Platform</h4>
            <ul className="space-y-3 text-sm text-slate-700 font-medium">
              <li><Link to="#" className="hover:text-blue-600 transition-colors">Tentang Kami</Link></li>
              <li><Link to="/#instruktur" className="hover:text-blue-600 transition-colors">Instruktur</Link></li>
              <li><Link to="/#blog" className="hover:text-blue-600 transition-colors">Artikel</Link></li>
              <li><Link to="#" className="hover:text-blue-600 transition-colors">Bantuan</Link></li>
              <li><Link to="#" className="hover:text-blue-600 transition-colors">Kontak</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4 drop-shadow-sm text-slate-900">Legal</h4>
            <ul className="space-y-3 text-sm text-slate-700 font-medium">
              <li><Link to="#" className="hover:text-blue-600 transition-colors">Syarat Penggunaan</Link></li>
              <li><Link to="#" className="hover:text-blue-600 transition-colors">Kebijakan Privasi</Link></li>
              <li><Link to="#" className="hover:text-blue-600 transition-colors">Kebijakan Refund</Link></li>
              <li><Link to="#" className="hover:text-blue-600 transition-colors">Keamanan Data</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/40 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-700 font-medium text-sm">
            © {new Date().getFullYear()} Sekolahverse. Hak Cipta Dilindungi.
          </p>
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-white/50 backdrop-blur-sm border border-white flex items-center justify-center text-slate-700 hover:text-blue-600 hover:bg-white transition-colors cursor-pointer shadow-sm">In</div>
            <div className="w-8 h-8 rounded-full bg-white/50 backdrop-blur-sm border border-white flex items-center justify-center text-slate-700 hover:text-blue-600 hover:bg-white transition-colors cursor-pointer shadow-sm">Tw</div>
            <div className="w-8 h-8 rounded-full bg-white/50 backdrop-blur-sm border border-white flex items-center justify-center text-slate-700 hover:text-blue-600 hover:bg-white transition-colors cursor-pointer shadow-sm">Ig</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
