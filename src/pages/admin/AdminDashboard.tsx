import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { motion } from 'motion/react';
import { useAppStore } from '../../store/useAppStore';
import { AdminStatsCard } from '../../components/AdminStatsCard';
import { Users, Calendar, Megaphone, Brain, Trophy, FileText, Sparkles } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';
import { Link } from 'react-router-dom';

const financialData = [
  { month: 'Jan', income: 450, expense: 380 },
  { month: 'Feb', income: 520, expense: 410 },
  { month: 'Mar', income: 480, expense: 390 },
  { month: 'Apr', income: 610, expense: 450 },
  { month: 'Mei', income: 590, expense: 420 },
  { month: 'Jun', income: 650, expense: 480 },
];

const performanceData = [
  { grade: 'Kelas X', math: 82, science: 85, english: 78 },
  { grade: 'Kelas XI', math: 78, science: 88, english: 82 },
  { grade: 'Kelas XII', math: 85, science: 82, english: 85 },
];

function ProgressBar({ label, value }: { label: string, value: number }) {
  return (
    <div className="flex items-center gap-4">
      <span className="w-32 text-sm font-medium text-slate-700">{label}</span>
      <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-full bg-blue-600 rounded-full"
        />
      </div>
      <span className="w-8 text-right text-sm font-bold text-slate-700">{value}</span>
    </div>
  );
}

export default function AdminDashboard() {
  const { user } = useAppStore();

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div>
          <h2 className="font-display font-bold text-2xl text-slate-900">Dashboard Sekolah</h2>
          <p className="text-slate-500">Selamat datang, {user?.name || 'Admin Sekolah'}!</p>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AdminStatsCard 
            title="Total Siswa Aktif" 
            value="1,248" 
            trend={{ value: 12, isPositive: true }}
            type="students"
          />
          <AdminStatsCard 
            title="Rata-rata Penyelesaian Tes" 
            value="84.2%" 
            trend={{ value: 4.5, isPositive: true }}
            type="completion"
          />
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex justify-between items-center"
          >
            <div>
              <h3 className="font-medium text-slate-900 mb-1">Data Siswa</h3>
              <p className="font-display font-bold text-3xl text-slate-900 mb-1">1.248</p>
              <p className="text-slate-500 text-sm">Total Siswa</p>
            </div>
            <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
              <Users className="w-7 h-7" />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex justify-between items-center"
          >
            <div>
              <h3 className="font-medium text-slate-900 mb-1">Jadwal / Kelas</h3>
              <p className="font-display font-bold text-3xl text-slate-900 mb-1">24</p>
              <p className="text-slate-500 text-sm">Kelas Aktif</p>
            </div>
            <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
              <Calendar className="w-7 h-7" />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex justify-between items-center"
          >
            <div>
              <h3 className="font-medium text-slate-900 mb-1">Pengumuman</h3>
              <p className="font-display font-bold text-3xl text-slate-900 mb-1">5</p>
              <p className="text-slate-500 text-sm">Pengumuman Baru</p>
            </div>
            <div className="w-14 h-14 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
              <Megaphone className="w-7 h-7" />
            </div>
          </motion.div>
        </div>

        {/* Middle Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Laporan Minat Bakat */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100"
          >
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white shrink-0">
                  <Brain className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-lg">Laporan Minat Bakat</h3>
              </div>
              <span className="px-3 py-1 rounded-md bg-emerald-50 text-emerald-600 text-[10px] font-bold tracking-wider uppercase">Selesai</span>
            </div>

            <div className="space-y-5 mb-10">
              <ProgressBar label="Minat Sains" value={82} />
              <ProgressBar label="Bakat Analitis" value={76} />
              <ProgressBar label="Gaya Belajar" value={68} />
              <ProgressBar label="Potensi Karier" value={71} />
            </div>

            <div className="border-t border-slate-100 pt-6">
              <p className="text-slate-500 text-sm mb-1">Hasil Dominan</p>
              <div className="flex items-center justify-between">
                <p className="font-bold text-blue-600 text-2xl">Visual - Kinestetik</p>
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Stack */}
          <div className="space-y-6 flex flex-col">
            {/* AI Pembuatan Bahan Ajar */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex-1 flex flex-col justify-center"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-xl">AI Pembuatan Bahan Ajar</h3>
              </div>
              <p className="text-slate-500 text-sm mb-6">Buat bahan ajar otomatis sesuai kurikulum dan kebutuhan.</p>
              <Link to="/guru/rpp-generator" className="h-12 w-48 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">
                <Sparkles className="w-4 h-4" /> Buat Bahan Ajar
              </Link>
            </motion.div>

            {/* Playground Belajar */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex-1 relative overflow-hidden flex items-center"
            >
              <div className="relative z-10 w-2/3">
                <h3 className="font-bold text-slate-900 text-xl mb-2">Playground Belajar</h3>
                <p className="text-slate-500 text-sm">Belajar jadi seru dengan<br/>aktivitas interaktif!</p>
              </div>
              {/* Illustration using emojis to simulate character */}
              <div className="absolute right-4 bottom-0 top-0 w-1/3 flex items-center justify-center">
                <div className="text-7xl drop-shadow-xl translate-y-2">🧒</div>
                <div className="absolute top-8 right-16 text-3xl animate-bounce" style={{ animationDuration: '3s' }}>🎮</div>
                <div className="absolute bottom-8 right-8 text-3xl animate-bounce" style={{ animationDuration: '2.5s' }}>📚</div>
                <div className="absolute top-1/2 right-0 text-3xl animate-bounce" style={{ animationDuration: '4s' }}>✏️</div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Financial Trends Area Chart */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100"
          >
            <div className="mb-6">
              <h3 className="font-bold text-slate-900 text-lg">Tren Keuangan Sekolah</h3>
              <p className="text-sm text-slate-500">Pemasukan vs Pengeluaran (Juta Rupiah)</p>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={financialData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                  <Area type="monotone" dataKey="income" name="Pemasukan" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
                  <Area type="monotone" dataKey="expense" name="Pengeluaran" stroke="#EF4444" strokeWidth={3} fillOpacity={1} fill="url(#colorExpense)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Student Performance Bar Chart */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100"
          >
            <div className="mb-6">
              <h3 className="font-bold text-slate-900 text-lg">Performa Akademik Siswa</h3>
              <p className="text-sm text-slate-500">Rata-rata Nilai per Mata Pelajaran Utama</p>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="grade" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} domain={[0, 100]} />
                  <RechartsTooltip 
                    cursor={{ fill: '#F8FAFC' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                  <Bar dataKey="math" name="Matematika" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={20} />
                  <Bar dataKey="science" name="Sains (IPA)" fill="#8B5CF6" radius={[4, 4, 0, 0]} barSize={20} />
                  <Bar dataKey="english" name="B. Inggris" fill="#F59E0B" radius={[4, 4, 0, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

      </div>
    </DashboardLayout>
  );
}

