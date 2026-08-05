import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { motion } from 'motion/react';
import { useAppStore } from '../../store/useAppStore';
import { Fingerprint, ScrollText, PenTool, Hourglass, ArrowRight, Orbit, CheckCircle2, MoreHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DashboardAnalitikGuru } from '../../components/guru/DashboardAnalitikGuru';

export default function TeacherDashboard() {
  const { user } = useAppStore();

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Welcome Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-emerald-900/10"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-3xl rounded-full translate-x-1/3 -translate-y-1/3"></div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-xs font-medium mb-4">
                <CheckCircle2 className="w-4 h-4" />
                <span>Semester Ganjil 2024/2025</span>
              </div>
              <h2 className="font-display font-bold text-3xl md:text-4xl mb-2">Selamat pagi, {user?.name || 'Guru'}!</h2>
              <p className="text-emerald-100 max-w-xl text-lg">
                Ada <span className="font-bold text-white">45 tugas siswa</span> yang perlu dikoreksi dan <span className="font-bold text-white">2 kelas</span> yang akan Anda ajar hari ini.
              </p>
            </div>
            <Link to="/guru/rpp-generator" className="inline-flex items-center gap-2 h-14 px-8 rounded-2xl bg-white text-emerald-700 font-bold hover:bg-emerald-50 transition-colors shrink-0 shadow-lg shadow-black/10">
              <ScrollText className="w-6 h-6" />
              <span>Buat Bahan Ajar Baru</span>
            </Link>
          </div>
        </motion.div>

        <DashboardAnalitikGuru />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Class List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-display font-bold text-xl text-slate-900">Jadwal Kelas Hari Ini</h3>
                <Link to="/guru/kelas" className="text-sm font-medium text-emerald-600 hover:text-emerald-700">Lihat Kelas</Link>
              </div>
              
              {[
                { time: '07:15 - 08:45', class: 'X IPA 1', subject: 'Informatika', topic: 'Algoritma Dasar', students: 36, status: 'upcoming' },
                { time: '09:00 - 10:30', class: 'XI RPL', subject: 'Informatika', topic: 'Struktur Data', students: 32, status: 'waiting' },
                { time: '11:00 - 12:30', class: 'X IPS 2', subject: 'Informatika', topic: 'Literasi Digital', students: 34, status: 'waiting' }
              ].map((cls, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + (i * 0.1) }}
                  className="glass p-5 rounded-2xl border border-white/40 hover:border-emerald-200 hover:shadow-lg hover:-translate-y-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-20 text-center shrink-0">
                      <p className="text-sm font-bold text-slate-900">{cls.time.split(' - ')[0]}</p>
                      <p className="text-xs text-slate-500 font-medium">{cls.time.split(' - ')[1]}</p>
                    </div>
                    <div className="w-1.5 h-12 rounded-full bg-slate-200 hidden sm:block">
                      <div className={`w-full rounded-full ${cls.status === 'upcoming' ? 'bg-emerald-500 h-1/2' : ''}`}></div>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-lg leading-tight">{cls.class}</h4>
                      <p className="text-sm text-slate-500">{cls.subject} • {cls.topic}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 shrink-0 mt-4 sm:mt-0">
                    <div className="flex items-center gap-1.5 text-slate-500 text-sm font-medium bg-slate-50 px-3 py-1.5 rounded-lg">
                      <Fingerprint className="w-4 h-4" />
                      <span>{cls.students} Siswa</span>
                    </div>
                    <Link to="/guru/kelas" className={`h-10 px-5 flex items-center rounded-xl font-bold transition-colors text-sm ${
                      cls.status === 'upcoming' 
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700' 
                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    }`}>
                      Mulai Kelas
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Assistant & Alerts */}
          <div className="space-y-6">
            <h3 className="font-display font-bold text-xl text-slate-900">Asisten AI</h3>
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-blue-50 rounded-3xl p-6 border border-blue-100 shadow-sm"
            >
              <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center mb-4 shadow-md shadow-blue-600/20">
                <Orbit className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-blue-900 mb-2 text-lg">AI Assistant</h4>
              <p className="text-sm text-blue-800 mb-6 leading-relaxed font-medium">
                Berdasarkan hasil tes terakhir, AI menyarankan penyesuaian metode belajar untuk kelas XI RPL (Struktur Data).
              </p>
              <Link to="/playground" className="flex items-center justify-center w-full h-12 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors text-sm shadow-md shadow-blue-600/20">
                Lihat Saran AI
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}


