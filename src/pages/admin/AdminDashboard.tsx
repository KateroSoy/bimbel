import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { motion } from 'motion/react';
import { useAppStore } from '../../store/useAppStore';
import { Users, Calendar, Megaphone, TrendingUp, CreditCard, BookOpen, UserCheck, UserPlus, CheckCircle, MapPin, MessageSquare, AlertCircle, FileText } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Link } from 'react-router-dom';

const financialData = [
  { month: 'Jan', income: 450, expense: 380 },
  { month: 'Feb', income: 520, expense: 410 },
  { month: 'Mar', income: 480, expense: 390 },
  { month: 'Apr', income: 610, expense: 450 },
  { month: 'Mei', income: 590, expense: 420 },
  { month: 'Jun', income: 650, expense: 480 },
];

const programData = [
  { name: 'English', value: 320, color: '#3B82F6' },
  { name: 'Math', value: 280, color: '#8B5CF6' },
  { name: 'English + Math', value: 410, color: '#F59E0B' },
  { name: 'IPA', value: 120, color: '#10B981' },
  { name: 'Mengaji', value: 118, color: '#EC4899' },
];

const COLORS = ['#3B82F6', '#8B5CF6', '#F59E0B', '#10B981', '#EC4899'];

export default function AdminDashboard() {
  const { user } = useAppStore();

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-display font-bold text-3xl text-slate-900 flex items-center gap-2">
              Selamat datang, Admin! 👋
            </h2>
            <p className="text-slate-500 mt-1">Kelola bimbel lebih mudah, semua informasi penting ada di sini.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-white rounded-xl border border-slate-200 text-sm font-bold text-slate-700 flex items-center gap-2 shadow-sm">
              <Calendar className="w-4 h-4 text-blue-600" />
              Selasa, 17 Juni 2025
            </div>
            <Link to="/admin/pengaturan" className="px-4 py-2 bg-white rounded-xl border border-slate-200 text-sm font-bold text-slate-700 flex items-center gap-2 shadow-sm cursor-pointer hover:bg-slate-50 transition-colors">
              <Calendar className="w-4 h-4 text-slate-400" />
              Tahun Ajaran 2024/2025
            </Link>
          </div>
        </div>

        {/* 6 Top Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {[
            { title: 'SISWA AKTIF', value: '1.248', icon: Users, bg: 'bg-blue-600', trend: '▲ 12% dari bulan lalu', trendColor: 'text-emerald-600', path: '/admin/siswa' },
            { title: 'PENDAPATAN BULAN INI', value: 'Rp 86,4 jt', icon: TrendingUp, bg: 'bg-emerald-500', trend: '▲ 8.4% dari bulan lalu', trendColor: 'text-emerald-600', path: '/admin/keuangan' },
            { title: 'BELUM TERBAYAR (PIUTANG)', value: 'Rp 7,2 jt', icon: CreditCard, bg: 'bg-orange-500', trend: '23 siswa', trendColor: 'text-rose-600', path: '/admin/keuangan' },
            { title: 'KELAS AKTIF', value: '24', icon: BookOpen, bg: 'bg-purple-600', trend: '▲ 3 kelas baru', trendColor: 'text-emerald-600', path: '/admin/kelas' },
            { title: 'TUTOR AKTIF', value: '32', icon: UserCheck, bg: 'bg-teal-500', trend: '2 tutor tidak hadir', trendColor: 'text-slate-500', path: '/admin/guru' },
            { title: 'SISWA BARU (BULAN INI)', value: '18', icon: UserPlus, bg: 'bg-rose-500', trend: '▲ 5 dari bulan lalu', trendColor: 'text-emerald-600', path: '/admin/siswa' }
          ].map((stat, i) => (
            <Link 
              to={stat.path}
              key={stat.title}
              className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-all hover:-translate-y-0.5 block"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center text-white shrink-0`}>
                  <stat.icon className="w-5 h-5" />
                </div>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">{stat.title}</p>
                <h3 className="text-2xl font-display font-bold text-slate-900">{stat.value}</h3>
              </div>
              <p className={`text-xs font-bold mt-2 ${stat.trendColor}`}>{stat.trend}</p>
            </Link>
          ))}
        </div>

        {/* Middle Section (4 Columns layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Perlu Tindakan */}
          <motion.div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 lg:col-span-1">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
                <AlertCircle className="w-4 h-4 text-orange-500" />
                PERLU TINDAKAN
              </h3>
              <Link to="/admin/laporan" className="text-xs font-bold text-blue-600 hover:underline">Lihat Semua</Link>
            </div>
            <div className="space-y-4">
              {[
                { icon: CreditCard, color: 'text-rose-500', bg: 'bg-rose-50', text: '23 siswa belum membayar SPP', subtext: 'Total tagihan Rp 7.200.000', btn: 'Lihat Tagihan', path: '/admin/keuangan' },
                { icon: UserCheck, color: 'text-orange-500', bg: 'bg-orange-50', text: '4 tutor belum mengisi absensi hari ini', subtext: 'Mohon periksa kehadiran tutor', btn: 'Periksa Absensi', path: '/admin/guru' },
                { icon: UserPlus, color: 'text-amber-500', bg: 'bg-amber-50', text: '7 siswa baru menunggu proses pendaftaran', subtext: 'Selesaikan proses pendaftaran', btn: 'Proses Pendaftaran', path: '/admin/siswa' },
                { icon: Users, color: 'text-blue-500', bg: 'bg-blue-50', text: '2 kelas membutuhkan tutor pengganti', subtext: 'Kelas English Primary 2A, Math Junior 1B', btn: 'Atur Tutor', path: '/admin/kelas' }
              ].map((item, i) => (
                <div key={i} className="flex gap-3 pb-3 border-b border-slate-50 last:border-0 last:pb-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${item.bg} ${item.color}`}>
                    <item.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-900 leading-tight">{item.text}</p>
                    <p className="text-xs text-slate-500 mb-2">{item.subtext}</p>
                    <Link to={item.path} className="inline-block text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors">
                      {item.btn}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Jadwal Hari Ini */}
          <motion.div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 lg:col-span-1">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-blue-500" />
                JADWAL HARI INI
              </h3>
              <Link to="/admin/kelas" className="text-xs font-bold text-blue-600 hover:underline">Lihat Semua</Link>
            </div>
            <div className="space-y-3">
              {[
                { time: '14:00 - 15:00', class: 'English Primary 1A', tutor: 'Tutor: Fitri Handayani', room: 'Ruang 1', attendance: '8/10 siswa', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { time: '15:00 - 16:00', class: 'Math Primary 2A', tutor: 'Tutor: Andi Saputra', room: 'Ruang 2', attendance: '10/10 siswa', color: 'text-orange-600', bg: 'bg-orange-50' },
                { time: '16:00 - 17:00', class: 'English Primary 3A', tutor: 'Tutor: Siti Aisyah', room: 'Ruang 1', attendance: '6/10 siswa', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { time: '17:00 - 18:00', class: 'IPA Junior 1A', tutor: 'Tutor: Muhammad Rizki', room: 'Ruang 3', attendance: '9/12 siswa', color: 'text-emerald-600', bg: 'bg-emerald-50' }
              ].map((item, i) => (
                <Link to="/admin/kelas" key={i} className="flex gap-3 p-3 rounded-xl border border-slate-100 hover:border-blue-200 transition-colors block">
                  <div className="text-blue-600 font-bold text-xs whitespace-nowrap pt-1">
                    {item.time.split(' - ')[0]} <br/> <span className="text-slate-400 font-medium">{item.time.split(' - ')[1]}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-900">{item.class}</p>
                    <p className="text-xs text-slate-500">{item.tutor}</p>
                    <p className="text-xs text-slate-500">{item.room}</p>
                  </div>
                  <div className={`px-2 py-1 rounded-md text-[10px] font-bold h-fit ${item.bg} ${item.color}`}>
                    {item.attendance}
                  </div>
                </Link>
              ))}
            </div>
            <Link to="/admin/kelas" className="w-full mt-3 py-2 text-sm font-bold text-blue-600 hover:bg-blue-50 rounded-xl transition-colors block text-center">
              Lihat jadwal lengkap &rarr;
            </Link>
          </motion.div>

          {/* Right Column Stack */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* Alur Pendaftaran */}
            <motion.div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex-1">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
                  <UserPlus className="w-4 h-4 text-emerald-500" />
                  ALUR PENDAFTARAN SISWA BARU
                </h3>
                <Link to="/admin/siswa" className="text-xs font-bold text-blue-600 hover:underline">Lihat Semua</Link>
              </div>
              <div className="flex justify-between items-center relative px-4">
                <div className="absolute left-10 right-10 top-5 h-0.5 bg-slate-200 -z-10"></div>
                {[
                  { count: 7, label: 'Data Masuk', icon: UserPlus, color: 'text-emerald-500' },
                  { count: 3, label: 'Verifikasi', icon: CheckCircle, color: 'text-blue-500' },
                  { count: 2, label: 'Tes Awal', icon: FileText, color: 'text-orange-500' },
                  { count: 4, label: 'Penempatan', icon: MapPin, color: 'text-purple-500' },
                  { count: 1, label: 'Menunggu Pembayaran', icon: CreditCard, color: 'text-blue-400' },
                  { count: 5, label: 'Aktif', icon: CheckCircle, color: 'text-emerald-500', isFilled: true }
                ].map((step, i) => (
                  <Link to="/admin/siswa" key={i} className="flex flex-col items-center gap-2 bg-white hover:scale-105 transition-transform">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step.isFilled ? 'bg-emerald-500 text-white' : 'bg-white border-2 border-slate-200 ' + step.color}`}>
                      {step.isFilled ? <CheckCircle className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
                    </div>
                    <p className="font-display font-bold text-xl text-slate-900">{step.count}</p>
                    <p className="text-[10px] font-bold text-slate-500 text-center max-w-[60px] leading-tight">{step.label}</p>
                  </Link>
                ))}
              </div>
              <div className="mt-6 flex justify-between items-center border-t border-slate-100 pt-4">
                <div>
                  <p className="text-xs text-slate-500">Total Pendaftar</p>
                  <p className="text-xl font-bold text-slate-900">21 Siswa</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500">Selesai Bulan Ini</p>
                  <p className="text-xl font-bold text-emerald-600">11 siswa aktif</p>
                </div>
              </div>
            </motion.div>

            {/* Komunikasi */}
            <motion.div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex-1">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
                  <MessageSquare className="w-4 h-4 text-purple-500" />
                  KOMUNIKASI WHATSAPP & PENGUMUMAN
                </h3>
                <Link to="/admin/whatsapp" className="text-xs font-bold text-blue-600 hover:underline">Buka Chat</Link>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: 'Pesan Wali Murid', value: '12', sub: 'Belum dibalas', icon: MessageSquare, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                  { label: 'Pengingat SPP', value: '23', sub: 'Belum terkirim', icon: AlertCircle, color: 'text-orange-600', bg: 'bg-orange-50' },
                  { label: 'Broadcast Terakhir', value: '15 Juni', sub: 'Promo Liburan', icon: Megaphone, color: 'text-purple-600', bg: 'bg-purple-50' },
                  { label: 'Total Pesan', value: '86', sub: 'Minggu ini', icon: MessageSquare, color: 'text-blue-600', bg: 'bg-blue-50' }
                ].map((item, i) => (
                  <Link to="/admin/whatsapp" key={i} className="flex flex-col p-2 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.bg} ${item.color}`}>
                        <item.icon className="w-4 h-4" />
                      </div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase leading-tight">{item.label}</p>
                    </div>
                    <p className="text-2xl font-display font-bold text-slate-900">{item.value}</p>
                    <p className="text-xs text-slate-500">{item.sub}</p>
                  </Link>
                ))}
              </div>
              <Link 
                to="/admin/whatsapp"
                className="w-full mt-4 py-2 text-sm font-bold text-emerald-600 border border-emerald-200 rounded-xl hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2 block text-center"
              >
                <MessageSquare className="w-4 h-4" /> Buka WhatsApp Wali Murid
              </Link>
            </motion.div>

          </div>
        </div>
        
        {/* Bottom Metrics Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Link to="/admin/course" className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col items-center justify-center hover:border-blue-200 transition-colors block">
             <PieChart width={160} height={160}>
               <Pie data={programData} cx={80} cy={80} innerRadius={50} outerRadius={70} paddingAngle={2} dataKey="value">
                 {programData.map((entry, index) => (
                   <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                 ))}
               </Pie>
             </PieChart>
             <h4 className="font-bold text-slate-900 mt-2 text-center text-sm">Distribusi Program</h4>
             <p className="text-xs text-blue-600 font-semibold mt-1">Kelola Program &rarr;</p>
          </Link>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 md:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-bold text-slate-900 text-sm">Pertumbuhan Siswa & Pendapatan</h4>
              <Link to="/admin/laporan" className="text-xs font-bold text-blue-600 hover:underline">Lihat Laporan</Link>
            </div>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={financialData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} />
                  <RechartsTooltip />
                  <Area type="monotone" dataKey="income" stroke="#10B981" strokeWidth={3} fillOpacity={0.2} fill="#10B981" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col justify-center gap-2">
             <div className="flex justify-between items-center mb-2">
               <h4 className="font-bold text-slate-900 text-sm">Beban Tutor</h4>
               <Link to="/admin/guru" className="text-xs font-bold text-blue-600 hover:underline">Kelola</Link>
             </div>
             <div className="space-y-2">
               <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                 <span className="text-xs font-bold text-slate-600">Fitri Handayani</span>
                 <span className="text-xs font-bold px-2 py-1 bg-rose-50 text-rose-600 rounded-md">Tinggi (5 kls)</span>
               </div>
               <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                 <span className="text-xs font-bold text-slate-600">Andi Saputra</span>
                 <span className="text-xs font-bold px-2 py-1 bg-emerald-50 text-emerald-600 rounded-md">Normal (3 kls)</span>
               </div>
               <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                 <span className="text-xs font-bold text-slate-600">Siti Aisyah</span>
                 <span className="text-xs font-bold px-2 py-1 bg-emerald-50 text-emerald-600 rounded-md">Normal (3 kls)</span>
               </div>
               <div className="flex justify-between items-center">
                 <span className="text-xs font-bold text-slate-600">Muh. Rizki</span>
                 <span className="text-xs font-bold px-2 py-1 bg-blue-50 text-blue-600 rounded-md">Rendah (2 kls)</span>
               </div>
             </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
