import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { motion } from 'motion/react';
import { Download, BarChart2, TrendingUp, Users, FileText, PieChart as PieChartIcon } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { toast } from 'sonner';

const userActivityData = [
  { name: 'Sen', students: 400, teachers: 240 },
  { name: 'Sel', students: 300, teachers: 139 },
  { name: 'Rab', students: 200, teachers: 980 },
  { name: 'Kam', students: 278, teachers: 390 },
  { name: 'Jum', students: 189, teachers: 480 },
  { name: 'Sab', students: 239, teachers: 380 },
  { name: 'Min', students: 349, teachers: 430 },
];

export default function Laporan() {
  const reports = [
    { title: 'Laporan Perkembangan Siswa', desc: 'Rangkuman nilai dan minat bakat seluruh siswa semester ini.', icon: <TrendingUp className="w-6 h-6" />, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Statistik Penggunaan AI', desc: 'Metrik penggunaan AI pembuatan bahan ajar oleh guru dan tes siswa.', icon: <BarChart2 className="w-6 h-6" />, color: 'text-purple-600', bg: 'bg-purple-50' },
    { title: 'Kehadiran & Partisipasi', desc: 'Data agregat kehadiran siswa dalam kegiatan sekolah.', icon: <Users className="w-6 h-6" />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'Laporan Keuangan Bulanan', desc: 'Arus kas masuk dan keluar secara mendetail.', icon: <PieChartIcon className="w-6 h-6" />, color: 'text-rose-600', bg: 'bg-rose-50' },
  ];

  const handleDownloadReport = (title: string) => {
    toast.success(`Mengunduh berkas laporan: ${title}.pdf`);
  };

  const handleDownloadAll = () => {
    toast.success('Mengunduh paket arsip seluruh laporan sekolah (ZIP)');
  };

  const handleGenerateCustomReport = () => {
    toast.info('Memproses generasi laporan kustom menggunakan AI...');
    setTimeout(() => {
      toast.success('Laporan kustom AI berhasil di-generate!');
    }, 1200);
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-display font-bold text-slate-900 mb-2">Laporan & Analitik</h2>
            <p className="text-slate-500">Unduh laporan performa sekolah dan analitik sistem.</p>
          </div>
          <button 
            onClick={handleDownloadAll}
            className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20 active:scale-95"
          >
            <Download className="w-5 h-5" />
            Unduh Semua Laporan (PDF)
          </button>
        </div>

        {/* Top Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-6 rounded-3xl border border-white/40 text-center relative overflow-hidden group hover:shadow-md transition-all"
          >
            <div className="absolute -left-4 -bottom-4 w-24 h-24 bg-blue-50 rounded-full group-hover:scale-150 transition-transform duration-500 z-0"></div>
            <div className="relative z-10">
              <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-2">Total Tes Selesai</p>
              <p className="text-5xl font-display font-bold text-slate-900 tracking-tight">1,482</p>
              <div className="inline-flex items-center gap-1 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-xs font-bold mt-4">
                <TrendingUp className="w-3 h-3" /> +12% dari bulan lalu
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass p-6 rounded-3xl border border-white/40 text-center relative overflow-hidden group hover:shadow-md transition-all"
          >
            <div className="absolute -left-4 -bottom-4 w-24 h-24 bg-purple-50 rounded-full group-hover:scale-150 transition-transform duration-500 z-0"></div>
            <div className="relative z-10">
              <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-2">Bahan Ajar Digenerate</p>
              <p className="text-5xl font-display font-bold text-slate-900 tracking-tight">845</p>
              <div className="inline-flex items-center gap-1 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-xs font-bold mt-4">
                <TrendingUp className="w-3 h-3" /> +5% dari bulan lalu
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass p-6 rounded-3xl border border-white/40 text-center relative overflow-hidden group hover:shadow-md transition-all"
          >
            <div className="absolute -left-4 -bottom-4 w-24 h-24 bg-emerald-50 rounded-full group-hover:scale-150 transition-transform duration-500 z-0"></div>
            <div className="relative z-10">
              <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-2">Siswa Aktif Harian</p>
              <p className="text-5xl font-display font-bold text-slate-900 tracking-tight">92%</p>
              <div className="inline-flex items-center gap-1 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-xs font-bold mt-4">
                <TrendingUp className="w-3 h-3" /> +2% dari bulan lalu
              </div>
            </div>
          </motion.div>
        </div>

        {/* Chart Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass p-8 rounded-3xl border border-white/40 shadow-sm"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="font-display font-bold text-xl text-slate-900">Aktivitas Sistem</h3>
                  <p className="text-sm text-slate-500">Keterlibatan Siswa vs Guru (7 Hari Terakhir)</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-sm font-medium text-slate-600">Siswa</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                    <span className="text-sm font-medium text-slate-600">Guru</span>
                  </div>
                </div>
              </div>
              
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={userActivityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorTeachers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 13, fontWeight: 500}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 13}} />
                    <RechartsTooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Area type="monotone" dataKey="students" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorStudents)" />
                    <Area type="monotone" dataKey="teachers" stroke="#8B5CF6" strokeWidth={3} fillOpacity={1} fill="url(#colorTeachers)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          {/* Quick Reports */}
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-2xl rounded-full"></div>
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md border border-white/20">
                <FileText className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-display font-bold text-2xl mb-2">Laporan Kustom AI</h3>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                Buat laporan khusus menggunakan AI dengan menentukan parameter yang Anda butuhkan.
              </p>
              <button 
                onClick={handleGenerateCustomReport}
                className="w-full bg-white text-slate-900 py-3 rounded-xl font-bold hover:bg-slate-100 transition-colors shadow-lg"
              >
                Generate Laporan
              </button>
            </motion.div>
          </div>
        </div>

        {/* Reports List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-display font-bold text-slate-900">Laporan Tersedia</h3>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">{reports.length} Format Laporan</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reports.map((report, index) => (
              <motion.div
                key={report.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + (index * 0.1) }}
                onClick={() => handleDownloadReport(report.title)}
                className="glass p-6 rounded-3xl border border-white/40 flex items-center justify-between group hover:shadow-lg hover:border-blue-200 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-5">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform ${report.bg} ${report.color}`}>
                    {report.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg mb-1 group-hover:text-blue-600 transition-colors">{report.title}</h4>
                    <p className="text-sm text-slate-500 leading-relaxed">{report.desc}</p>
                  </div>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownloadReport(report.title);
                  }}
                  className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors shrink-0"
                >
                  <Download className="w-6 h-6" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
