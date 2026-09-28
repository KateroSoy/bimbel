import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAppStore } from '../store/useAppStore';
import { ArrowLeft, ScanFace, Library, Sliders } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Logo } from '../components/ui/Logo';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAppStore();

  const handleLogin = (role: 'siswa' | 'guru' | 'admin') => {
    login({
      id: '1',
      name: role === 'siswa' ? 'Andi Pratama' : role === 'guru' ? 'Budi Santoso, S.Pd' : 'Admin Sekolah',
      role,
      schoolName: 'SMA Negeri 1 Jakarta'
    });
    
    if (role === 'siswa') navigate('/siswa/dashboard');
    if (role === 'guru') navigate('/guru/dashboard');
    if (role === 'admin') navigate('/admin/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-500/20 blur-[100px] rounded-full mix-blend-multiply animate-blob"></div>
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-cyan-400/20 blur-[100px] rounded-full mix-blend-multiply animate-blob" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-400/10 blur-[120px] rounded-full mix-blend-multiply animate-blob" style={{ animationDelay: '4s' }}></div>
      
      <div className="w-full max-w-md relative z-10">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </Link>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-3xl p-8 shadow-2xl"
        >
          <div className="text-center mb-8 flex flex-col items-center">
            <div className="mb-5">
              <Logo variant="learnspace" size="xl" showText={true} />
            </div>
            <h1 className="font-display font-bold text-2xl text-slate-900">Masuk ke LearnSpace+</h1>
            <p className="text-slate-500 mt-2">Pilih peran untuk masuk ke dashboard demo</p>
          </div>

          <div className="space-y-4">
            <button 
              onClick={() => handleLogin('siswa')}
              className="w-full flex items-center gap-4 p-4 rounded-xl glass-card hover:bg-white/40 transition-all group text-left"
            >
              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 shadow-inner">
                <ScanFace className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 group-hover:text-blue-600">Masuk sebagai Siswa</h3>
                <p className="text-sm text-slate-500">Akses tes, modul belajar & AI Playground</p>
              </div>
            </button>
            
            <button 
              onClick={() => handleLogin('guru')}
              className="w-full flex items-center gap-4 p-4 rounded-xl glass-card hover:bg-white/40 transition-all group text-left"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 shadow-inner">
                <Library className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 group-hover:text-blue-600">Masuk sebagai Guru</h3>
                <p className="text-sm text-slate-500">Akses AI Pembuatan Bahan Ajar & Pantau Siswa</p>
              </div>
            </button>

            <button 
              onClick={() => handleLogin('admin')}
              className="w-full flex items-center gap-4 p-4 rounded-xl glass-card hover:bg-white/40 transition-all group text-left"
            >
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 shrink-0 shadow-inner">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 group-hover:text-blue-600">Masuk sebagai Admin</h3>
                <p className="text-sm text-slate-500">Manajemen data & Laporan Akademik</p>
              </div>
            </button>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-xs text-slate-400">
              Demo Version 1.0. Data akan direset setelah sesi berakhir.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

