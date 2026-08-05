import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { StudentPerformanceChart } from '../../components/common/StudentPerformanceChart';
import { TrendingUp, BookOpen, Award } from 'lucide-react';

const performanceData = [
  { month: 'Jan', matematika: 75, bahasa: 80, fisika: 70 },
  { month: 'Feb', matematika: 78, bahasa: 82, fisika: 72 },
  { month: 'Mar', matematika: 80, bahasa: 85, fisika: 75 },
  { month: 'Apr', matematika: 82, bahasa: 88, fisika: 76 },
  { month: 'Mei', matematika: 85, bahasa: 90, fisika: 78 },
  { month: 'Jun', matematika: 85, bahasa: 92, fisika: 78 },
];

export default function NilaiSiswa() {
  const nilai = [
    { subject: 'Matematika', score: 85, grade: 'A', trend: '+3' },
    { subject: 'Bahasa Inggris', score: 92, grade: 'A', trend: '+2' },
    { subject: 'Fisika', score: 78, grade: 'B', trend: '0' },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Laporan Akademik</h2>
          <p className="text-slate-500 mt-1">Pantau perkembangan nilai dan prestasimu</p>
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass p-6 rounded-3xl border border-white/40 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-lg text-slate-900">Tren Nilai Kuis</h3>
                <p className="text-slate-500 text-sm">Rata-rata per bulan</p>
              </div>
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            
            <div className="h-[300px] w-full">
              <StudentPerformanceChart 
                data={performanceData} 
                subjects={[
                  { key: 'matematika', name: 'Matematika', color: '#3B82F6' },
                  { key: 'bahasa', name: 'Bahasa', color: '#10B981' },
                  { key: 'fisika', name: 'Fisika', color: '#F59E0B' }
                ]}
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass p-6 rounded-3xl border border-white/40 shadow-sm flex flex-col items-center justify-center text-center h-[180px]">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-3">
                <BookOpen className="w-6 h-6" />
              </div>
              <p className="text-slate-500 font-medium">Rata-rata Keseluruhan</p>
              <h4 className="text-4xl font-bold text-slate-900 mt-2">85.0</h4>
            </div>

            <div className="glass p-6 rounded-3xl border border-white/40 shadow-sm flex flex-col items-center justify-center text-center h-[180px]">
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mb-3">
                <Award className="w-6 h-6" />
              </div>
              <p className="text-slate-500 font-medium">Predikat Terbaik</p>
              <h4 className="text-xl font-bold text-slate-900 mt-2">B. Inggris (A)</h4>
            </div>
          </div>
        </div>

        <div className="glass p-6 rounded-3xl border border-white/40 shadow-sm overflow-hidden">
          <h3 className="font-bold text-lg text-slate-900 mb-6">Rekap Nilai Mata Pelajaran</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="p-4 font-bold text-slate-700">Mata Pelajaran</th>
                  <th className="p-4 font-bold text-slate-700 text-center">Nilai Akhir</th>
                  <th className="p-4 font-bold text-slate-700 text-center">Predikat</th>
                  <th className="p-4 font-bold text-slate-700 text-right">Tren (Bulan Ini)</th>
                </tr>
              </thead>
              <tbody>
                {nilai.map((n, i) => (
                  <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 font-semibold text-slate-800">{n.subject}</td>
                    <td className="p-4 text-center font-bold text-slate-900">{n.score}</td>
                    <td className="p-4 text-center">
                      <span className={`px-3 py-1 rounded-full font-bold text-xs ${
                        n.grade === 'A' ? 'bg-emerald-50 text-emerald-600' :
                        n.grade === 'B' ? 'bg-blue-50 text-blue-600' :
                        'bg-amber-50 text-amber-600'
                      }`}>
                        {n.grade}
                      </span>
                    </td>
                    <td className="p-4 text-right font-medium">
                      <span className={n.trend.startsWith('+') ? 'text-emerald-600' : n.trend === '0' ? 'text-slate-400' : 'text-red-600'}>
                        {n.trend !== '0' ? n.trend : '-'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}