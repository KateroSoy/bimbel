import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { StudentPerformanceChart } from '../../components/common/StudentPerformanceChart';



const performanceData = [
  { month: 'Jan', matematika: 75, bahasa: 80, fisika: 70 },
  { month: 'Feb', matematika: 78, bahasa: 82, fisika: 72 },
  { month: 'Mar', matematika: 80, bahasa: 85, fisika: 75 },
  { month: 'Apr', matematika: 82, bahasa: 88, fisika: 76 },
  { month: 'Mei', matematika: 85, bahasa: 90, fisika: 78 },
  { month: 'Jun', matematika: 85, bahasa: 92, fisika: 78 },
];

export default function ProgressSiswaGuru() {
  const students = [
    { name: 'Andi Pratama', class: 'X IPA 1', progress: 85 },
    { name: 'Budi Santoso', class: 'X IPA 1', progress: 40 },
    { name: 'Siti Aminah', class: 'X IPA 2', progress: 100 },
  ];
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Progress Belajar Siswa</h2>

        <div className="glass p-6 rounded-3xl border border-white/40 shadow-sm mb-6">
          <h3 className="font-bold text-lg text-slate-900 mb-6">Rata-rata Progress Keseluruhan Siswa</h3>
          <StudentPerformanceChart 
            data={performanceData} 
            subjects={[
              { key: 'matematika', name: 'Matematika', color: '#3B82F6' },
              { key: 'bahasa', name: 'Bahasa Indonesia', color: '#10B981' },
              { key: 'fisika', name: 'Fisika', color: '#F59E0B' }
            ]}
          />
        </div>

        <div className="glass p-6 rounded-3xl border border-white/40 shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="p-4 font-bold text-slate-700">Nama Siswa</th>
                <th className="p-4 font-bold text-slate-700">Kelas</th>
                <th className="p-4 font-bold text-slate-700">Progress</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s, i) => (
                <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50">
                  <td className="p-4 font-medium text-slate-900">{s.name}</td>
                  <td className="p-4 text-slate-600">{s.class}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden flex-1 max-w-[200px]">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${s.progress}%` }}></div>
                      </div>
                      <span className="text-sm font-bold text-slate-600">{s.progress}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
