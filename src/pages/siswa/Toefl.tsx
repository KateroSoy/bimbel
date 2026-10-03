import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { motion } from 'motion/react';
import { Headphones, BookOpen, Mic } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Toefl() {
  const sections = [
    { title: 'Listening Comprehension', icon: <Headphones className="w-6 h-6" />, progress: 85, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Structure & Written Expression', icon: <BookOpen className="w-6 h-6" />, progress: 60, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'Reading Comprehension', icon: <Mic className="w-6 h-6" />, progress: 40, color: 'text-purple-600', bg: 'bg-purple-50' }
  ];

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-display font-bold text-slate-900 mb-2">Persiapan TOEFL</h2>
            <p className="text-slate-500">Latih kemampuan bahasa Inggris Anda dengan simulasi TOEFL standar.</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-500 mb-1">Target Skor</p>
            <p className="text-2xl font-bold text-blue-600">550</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {sections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass p-6 rounded-2xl border border-white/40"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${section.bg} ${section.color}`}>
                {section.icon}
              </div>
              <h3 className="font-bold text-slate-900 mb-4">{section.title}</h3>
              <div className="w-full bg-slate-100 rounded-full h-2 mb-2">
                <div 
                  className={`h-full rounded-full bg-current ${section.color}`} 
                  style={{ width: `${section.progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-slate-500 text-right">{section.progress}% Dikuasai</p>
            </motion.div>
          ))}
        </div>

        <div className="glass p-8 rounded-2xl border border-white/40 text-center">
          <h3 className="text-2xl font-bold text-slate-900 mb-4">Mulai Simulasi Penuh</h3>
          <p className="text-slate-500 mb-6 max-w-lg mx-auto">Simulasi ini akan memakan waktu kurang lebih 120 menit. Pastikan koneksi internet stabil dan gunakan earphone untuk hasil yang maksimal.</p>
          <Link 
            to="/siswa/quiz/1"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-md shadow-blue-600/20"
          >
            Mulai Simulasi (120 Menit)
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
