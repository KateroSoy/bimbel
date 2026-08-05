import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  LineChart,
  Line,
  Cell,
} from 'recharts';
import { Users, AlertTriangle, TrendingUp, CheckCircle } from 'lucide-react';

const classPerformanceData = [
  { month: 'Jan', '10 IPA 1': 82, '10 IPA 2': 78, '11 IPA 1': 85 },
  { month: 'Feb', '10 IPA 1': 84, '10 IPA 2': 80, '11 IPA 1': 86 },
  { month: 'Mar', '10 IPA 1': 83, '10 IPA 2': 82, '11 IPA 1': 88 },
  { month: 'Apr', '10 IPA 1': 86, '10 IPA 2': 85, '11 IPA 1': 87 },
  { month: 'Mei', '10 IPA 1': 88, '10 IPA 2': 84, '11 IPA 1': 89 },
];

const attendanceData = [
  { name: '10 IPA 1', hadir: 95, izin: 3, sakit: 2 },
  { name: '10 IPA 2', hadir: 92, izin: 5, sakit: 3 },
  { name: '11 IPA 1', hadir: 98, izin: 1, sakit: 1 },
];

const assignmentCompletionData = [
  { week: 'Minggu 1', selesai: 85, terlambat: 10, tidakSelesai: 5 },
  { week: 'Minggu 2', selesai: 88, terlambat: 8, tidakSelesai: 4 },
  { week: 'Minggu 3', selesai: 92, terlambat: 5, tidakSelesai: 3 },
  { week: 'Minggu 4', selesai: 95, terlambat: 3, tidakSelesai: 2 },
];

const atRiskStudents = [
  { name: 'Rudi Hermawan', class: '10 IPA 2', issue: 'Sering Absen', severity: 'high' },
  { name: 'Siti Aminah', class: '10 IPA 1', issue: 'Nilai Menurun', severity: 'medium' },
  { name: 'Anton Syahputra', class: '11 IPA 1', issue: 'Tugas Menunggak', severity: 'high' },
];

export function DashboardAnalitikGuru() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass p-5 rounded-2xl border border-white/40 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Siswa Aktif</p>
            <h4 className="text-2xl font-bold text-slate-900">124</h4>
          </div>
        </div>
        
        <div className="glass p-5 rounded-2xl border border-white/40 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shrink-0">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Rata-rata Kehadiran</p>
            <h4 className="text-2xl font-bold text-slate-900">95%</h4>
          </div>
        </div>
        
        <div className="glass p-5 rounded-2xl border border-white/40 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Rata-rata Nilai Kelas</p>
            <h4 className="text-2xl font-bold text-slate-900">84.5</h4>
          </div>
        </div>
        
        <div className="glass p-5 rounded-2xl border border-white/40 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Siswa Berisiko</p>
            <h4 className="text-2xl font-bold text-slate-900">3</h4>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass p-6 rounded-3xl border border-white/40 shadow-sm">
          <div className="mb-6">
            <h3 className="font-bold text-lg text-slate-900">Tren Nilai Rata-rata Kelas</h3>
            <p className="text-slate-500 text-sm">Perkembangan nilai kuis per kelas</p>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={classPerformanceData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} domain={['dataMin - 5', 'dataMax + 5']} dx={-10} />
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                <Line type="monotone" dataKey="10 IPA 1" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="10 IPA 2" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="11 IPA 1" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass p-6 rounded-3xl border border-white/40 shadow-sm">
          <div className="mb-6">
            <h3 className="font-bold text-lg text-slate-900">Tingkat Kehadiran Kelas</h3>
            <p className="text-slate-500 text-sm">Persentase kehadiran bulan ini</p>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dx={-10} />
                <Tooltip cursor={{ fill: 'rgba(241, 245, 249, 0.5)' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                <Bar dataKey="hadir" name="Hadir" stackId="a" fill="#10b981" radius={[0, 0, 4, 4]} />
                <Bar dataKey="izin" name="Izin" stackId="a" fill="#f59e0b" />
                <Bar dataKey="sakit" name="Sakit" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="glass p-6 rounded-3xl border border-white/40 shadow-sm">
        <div className="mb-6">
          <h3 className="font-bold text-lg text-slate-900">Tren Penyelesaian Tugas</h3>
          <p className="text-slate-500 text-sm">Persentase penyelesaian tugas mingguan</p>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={assignmentCompletionData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <defs>
                <linearGradient id="colorSelesai" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorTerlambat" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorTidak" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dx={-10} />
              <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
              <Area type="monotone" dataKey="selesai" name="Selesai Tepat Waktu" stroke="#10b981" fillOpacity={1} fill="url(#colorSelesai)" />
              <Area type="monotone" dataKey="terlambat" name="Terlambat" stroke="#f59e0b" fillOpacity={1} fill="url(#colorTerlambat)" />
              <Area type="monotone" dataKey="tidakSelesai" name="Tidak Selesai" stroke="#ef4444" fillOpacity={1} fill="url(#colorTidak)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass p-6 rounded-3xl border border-white/40 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-bold text-lg text-slate-900">Perhatian Khusus (Siswa Berisiko)</h3>
            <p className="text-slate-500 text-sm">Siswa yang membutuhkan pendampingan akademik</p>
          </div>
          <AlertTriangle className="w-6 h-6 text-red-500" />
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="p-4 font-bold text-slate-700 rounded-tl-xl">Nama Siswa</th>
                <th className="p-4 font-bold text-slate-700">Kelas</th>
                <th className="p-4 font-bold text-slate-700">Masalah</th>
                <th className="p-4 font-bold text-slate-700 text-right rounded-tr-xl">Prioritas</th>
              </tr>
            </thead>
            <tbody>
              {atRiskStudents.map((student, i) => (
                <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50">
                  <td className="p-4 font-semibold text-slate-800">{student.name}</td>
                  <td className="p-4 text-slate-600 font-medium">{student.class}</td>
                  <td className="p-4 text-slate-600">{student.issue}</td>
                  <td className="p-4 text-right">
                    <span className={`px-3 py-1 rounded-full font-bold text-xs ${
                      student.severity === 'high' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {student.severity === 'high' ? 'Tinggi' : 'Sedang'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
