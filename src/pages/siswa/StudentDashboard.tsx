import { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { motion, animate } from 'motion/react';
import { useAppStore } from '../../store/useAppStore';
import { Atom, Terminal, Waves, ArrowRight, Play, BadgeCheck, Hourglass, TrendingUp, Target, Trophy, Star, Zap, Medal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Leaderboard } from '../../components/common/Leaderboard';


function AnimatedProgressRing({ progress }: { progress: number }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(0, progress, {
      duration: 1.5,
      ease: "easeOut",
      onUpdate: (val) => setDisplayValue(Math.round(val)),
    });
    return controls.stop;
  }, [progress]);

  const radius = 28;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="relative flex items-center justify-center w-16 h-16 shrink-0">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="#E2E8F0" strokeWidth="8" />
        <motion.circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="#3B82F6"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - (circumference * progress) / 100 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center flex-col">
        <span className="text-sm font-display font-bold text-slate-900">{displayValue}%</span>
      </div>
    </div>
  );
}

const progressData = [
  { name: 'Sen', score: 65 },
  { name: 'Sel', score: 72 },
  { name: 'Rab', score: 85 },
  { name: 'Kam', score: 78 },
  { name: 'Jum', score: 90 },
  { name: 'Sab', score: 95 },
  { name: 'Min', score: 88 },
];

const skillsData = [
  { subject: 'Logika', A: 85, fullMark: 100 },
  { subject: 'Kreativitas', A: 90, fullMark: 100 },
  { subject: 'Analitik', A: 75, fullMark: 100 },
  { subject: 'Komunikasi', A: 80, fullMark: 100 },
  { subject: 'Sains', A: 70, fullMark: 100 },
  { subject: 'Bahasa', A: 88, fullMark: 100 },
];


const topStudents = [
  { id: '1', name: 'Siti Aminah', score: 9500, coursesCompleted: 15 },
  { id: '2', name: 'Anda', score: 9200, coursesCompleted: 14 },
  { id: '3', name: 'Andi Pratama', score: 8800, coursesCompleted: 12 },
  { id: '4', name: 'Dewi Lestari', score: 8500, coursesCompleted: 10 },
  { id: '5', name: 'Bagas Kusuma', score: 8100, coursesCompleted: 9 },
];

export default function StudentDashboard() {
  const { user } = useAppStore();

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Welcome Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-blue-900/10"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-3xl rounded-full translate-x-1/3 -translate-y-1/3"></div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-xs font-medium mb-4">
                <Target className="w-4 h-4" />
                <span>Semester Ganjil 2024/2025</span>
              </div>
              <h2 className="font-display font-bold text-3xl md:text-4xl mb-2">Selamat datang kembali, {user?.name?.split(' ')[0] || 'Siswa'}!</h2>
              <p className="text-blue-100 max-w-xl text-lg">
                Kamu punya <span className="font-bold text-white">2 tes</span> yang belum selesai. Lanjutkan progress belajarmu hari ini untuk mencapai target.
              </p>
            </div>
            <div className="hidden md:flex gap-4">
              <div className="glass p-4 rounded-2xl border-white/20 bg-white/10 text-center min-w-[120px]">
                <p className="text-blue-100 text-sm mb-1">Peringkat</p>
                <p className="font-display font-bold text-3xl">#5</p>
              </div>
              <div className="glass p-4 rounded-2xl border-white/20 bg-white/10 text-center min-w-[120px]">
                <p className="text-blue-100 text-sm mb-1">XP Points</p>
                <p className="font-display font-bold text-3xl">2,450</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats / Quick Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-6 rounded-3xl border border-white/40 shadow-sm flex items-center justify-between hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-4">
              <AnimatedProgressRing progress={68} />
              <div>
                <p className="text-slate-500 text-sm font-medium">Progress Rata-rata</p>
                <p className="text-xs font-bold text-slate-400 mt-1">Keseluruhan Course</p>
              </div>
            </div>
          </motion.div>
          {[
            { label: 'Rata-rata Nilai', value: '87.5', icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+2.5' },
            { label: 'Tes Diselesaikan', value: '12', icon: BadgeCheck, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+3' },
            { label: 'Waktu Belajar', value: '24 Jam', icon: Hourglass, color: 'text-orange-600', bg: 'bg-orange-50', trend: '+4j' }
          ].map((stat, i) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (i + 1) * 0.1 }}
              className="glass p-6 rounded-3xl border border-white/40 shadow-sm flex items-center justify-between hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                  <stat.icon className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
                  <p className="font-display font-bold text-3xl text-slate-900">{stat.value}</p>
                </div>
              </div>
              <div className="text-emerald-500 bg-emerald-50 px-2.5 py-1 rounded-full text-xs font-bold">
                {stat.trend}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Chart Column */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass p-6 rounded-3xl border border-white/40 shadow-sm"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-display font-bold text-xl text-slate-900">Perkembangan Belajar</h3>
                  <p className="text-sm text-slate-500">Skor rata-rata mingguan</p>
                </div>
                <select className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2">
                  <option>Minggu Ini</option>
                  <option>Bulan Ini</option>
                  <option>Semester Ini</option>
                </select>
              </div>
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={progressData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} />
                    <RechartsTooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Area type="monotone" dataKey="score" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Active Tasks */}
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-display font-bold text-xl text-slate-900">Tugas & Tes Aktif</h3>
                <Link to="/siswa/katalog-tes" className="text-sm font-medium text-blue-600 hover:text-blue-700">Lihat Semua</Link>
              </div>
              
              {[
                { title: 'Tes Minat Bakat Kelas X', type: 'Assesment', progress: 40, icon: Atom, bg: 'bg-indigo-100', color: 'text-indigo-600' },
                { title: 'Simulasi TOEFL #4', type: 'Latihan', progress: 0, icon: Waves, bg: 'bg-blue-100', color: 'text-blue-600' },
                { title: 'Skill Digital Dasar', type: 'Ujian', progress: 85, icon: Terminal, bg: 'bg-emerald-100', color: 'text-emerald-600' }
              ].map((task, i) => (
                <motion.div 
                  key={task.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + (i * 0.1) }}
                  className="glass p-5 rounded-2xl border border-white/40 shadow-sm hover:border-blue-200 transition-all group flex flex-col sm:flex-row sm:items-center gap-4 hover:-translate-y-1 hover:shadow-md"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${task.bg} ${task.color}`}>
                    <task.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{task.title}</h4>
                      <span className="text-xs font-bold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full">{task.type}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 rounded-full relative" style={{ width: `${task.progress}%` }}>
                          <div className="absolute inset-0 bg-white/20 w-full animate-pulse"></div>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-slate-600 w-8">{task.progress}%</span>
                    </div>
                  </div>
                  <Link to="/siswa/lesson/1" className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0 shadow-sm">
                    <Play className="w-5 h-5 ml-1" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            
            {/* AI Shortcut */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 text-white relative overflow-hidden group shadow-xl"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 blur-2xl rounded-full"></div>
              
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6 ring-1 ring-white/20">
                <Atom className="w-6 h-6 text-blue-300" />
              </div>
              
              <h4 className="font-display font-bold text-xl mb-2">AI Assistant</h4>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                Butuh bantuan belajar? Tanya AI untuk merangkum materi atau simulasi interview.
              </p>
              
              <Link 
                to="/playground"
                className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-600/30"
              >
                <span>Buka AI Playground</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
            
            {/* Radar Chart / Skills Profile */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="glass rounded-3xl p-6 border border-white/40 shadow-sm flex flex-col items-center"
            >
              <h4 className="font-bold text-slate-900 mb-2 w-full text-left">Profil Potensi</h4>
              <p className="text-sm text-slate-500 mb-4 w-full text-left">Berdasarkan hasil asesmen terakhir</p>
              
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={skillsData}>
                    <PolarGrid stroke="#E2E8F0" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748B', fontSize: 11 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar name="Skor" dataKey="A" stroke="#3B82F6" strokeWidth={2} fill="#3B82F6" fillOpacity={0.4} />
                    <RechartsTooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="w-full bg-blue-50 rounded-xl p-4 mt-4 border border-blue-100">
                <p className="text-sm text-blue-900 leading-relaxed font-medium">
                  Potensi terkuat kamu ada di <span className="font-bold text-blue-700">Kreativitas</span> dan <span className="font-bold text-blue-700">Logika</span>.
                </p>
              </div>
            </motion.div>

            {/* Achievements */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="glass rounded-3xl p-6 border border-white/40 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-bold text-slate-900">Pencapaian</h4>
                  <p className="text-sm text-slate-500">Badge & Penghargaan</p>
                </div>
                <Link to="/siswa/profil" className="text-sm font-medium text-blue-600 hover:text-blue-700">Lihat</Link>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {[
                  { title: 'Top Scorer', icon: Trophy, color: 'text-amber-600', bg: 'bg-amber-100' },
                  { title: 'Fast Learner', icon: Zap, color: 'text-blue-600', bg: 'bg-blue-100' },
                  { title: 'Quiz Master', icon: Star, color: 'text-purple-600', bg: 'bg-purple-100' },
                  { title: 'Perfectionist', icon: Medal, color: 'text-emerald-600', bg: 'bg-emerald-100' }
                ].map((badge, i) => (
                  <motion.div
                    key={badge.title}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.6 + (i * 0.1) }}
                    className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white border border-slate-100 hover:shadow-md hover:border-blue-200 transition-all cursor-pointer text-center group"
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${badge.bg} ${badge.color} group-hover:scale-110 transition-transform`}>
                      <badge.icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-slate-700">{badge.title}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Leaderboard students={topStudents} />
        </motion.div>
      </div>
    </DashboardLayout>
  );
}


