import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Activity } from 'lucide-react';

export default function MonitoringProgressAdmin() {
  const courses = [
    { name: 'Matematika Dasar', activeStudents: 120, avgProgress: 65 },
    { name: 'Bahasa Indonesia', activeStudents: 150, avgProgress: 80 },
  ];
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Monitoring Progress Global</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((c, i) => (
            <div key={i} className="glass p-6 rounded-3xl border border-white/40 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                  <Activity className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-slate-900">{c.name}</h3>
              </div>
              <div className="space-y-4">
                <p className="text-slate-600 text-sm">Siswa Aktif: <span className="font-bold text-slate-900">{c.activeStudents}</span></p>
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-xs font-bold text-slate-500">Rata-rata Progress</span>
                    <span className="text-sm font-bold text-slate-900">{c.avgProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${c.avgProgress}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
