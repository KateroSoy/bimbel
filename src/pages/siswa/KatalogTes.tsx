import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { motion } from 'motion/react';
import { Play, CheckCircle2, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function KatalogTes() {
  const tests = [
    {
      id: 1,
      title: 'Tes Minat Bakat (100 Detik)',
      duration: '2 Menit',
      status: 'Selesai',
      score: '98%',
      color: 'bg-blue-50 text-blue-700',
    },
    {
      id: 2,
      title: 'Tes Logika & Penalaran',
      duration: '45 Menit',
      status: 'Belum Mulai',
      score: '-',
      color: 'bg-purple-50 text-purple-700',
    },
    {
      id: 3,
      title: 'Kuesioner Gaya Belajar',
      duration: '15 Menit',
      status: 'Belum Mulai',
      score: '-',
      color: 'bg-emerald-50 text-emerald-700',
    }
  ];

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-display font-bold text-slate-900 mb-2">Katalog Tes</h2>
          <p className="text-slate-500">Pilih dan kerjakan tes yang tersedia untuk mengetahui potensimu.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tests.map((test, index) => (
            <motion.div
              key={test.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass p-6 rounded-2xl border border-white/40 hover:shadow-lg transition-all"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${test.color}`}>
                <Play className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{test.title}</h3>
              
              <div className="flex items-center gap-4 mb-6 text-sm text-slate-500">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {test.duration}
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  {test.status}
                </div>
              </div>

              {test.status === 'Selesai' ? (
                <Link to="/siswa/profil" className="block w-full py-2.5 rounded-xl font-medium text-center transition-colors bg-emerald-50 text-emerald-600 hover:bg-emerald-100">
                  Lihat Hasil
                </Link>
              ) : (
                <Link to="/siswa/quiz/1" className="block w-full py-2.5 rounded-xl font-medium text-center transition-colors bg-blue-600 text-white hover:bg-blue-700">
                  Mulai Tes
                </Link>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
