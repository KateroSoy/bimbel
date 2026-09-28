import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { motion } from 'motion/react';
import { useAppStore } from '../../store/useAppStore';
import { Users, Calendar, CheckCircle2, BookOpen, Clock, AlertCircle, TrendingUp, Bell, ChevronRight, UserCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function TeacherDashboard() {
  const { user } = useAppStore();
  const navigate = useNavigate();

  const handleOpenClass = (className: string) => {
    toast.success(`Membuka sesi kelas: ${className}`, {
      description: "Mengarahkan ke presensi & catatan mengajar guru."
    });
    navigate('/guru/absensi');
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-display font-bold text-3xl text-slate-900 flex items-center gap-2">
              Selamat datang, {user?.name || 'Pak Budi'}! 👋
            </h2>
            <p className="text-slate-500 mt-1">Ini jadwal mengajar dan aktivitas kelas Anda hari ini.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link 
              to="/guru/absensi"
              className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm hover:bg-blue-700 transition-colors"
            >
              <UserCheck className="w-4 h-4" />
              Presensi Kelas Hari Ini
            </Link>
          </div>
        </div>

        {/* 4 Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <Calendar className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-display font-bold text-3xl text-slate-900 mb-1">4</h3>
              <p className="text-sm font-medium text-slate-600 mb-2">Kelas Hari Ini</p>
              <Link to="/guru/absensi" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
                Lihat Jadwal <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-500 shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-display font-bold text-3xl text-slate-900 mb-1">48</h3>
              <p className="text-sm font-medium text-slate-600 mb-2">Total Siswa Aktif</p>
              <Link to="/guru/progress-siswa" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
                Data Siswa <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-display font-bold text-3xl text-slate-900 mb-1">12</h3>
              <p className="text-sm font-medium text-slate-600 mb-2">Modul Materi Ajar</p>
              <Link to="/guru/course" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
                Kelola Modul <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 shrink-0">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-display font-bold text-3xl text-slate-900 mb-1">3</h3>
              <p className="text-sm font-medium text-slate-600 mb-2">Siswa Perlu Perhatian</p>
              <Link to="/guru/progress-siswa" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
                Lihat Siswa <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </motion.div>

        </div>

        {/* Action Bar (Perlu tindakan) */}
        <motion.div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-wrap lg:flex-nowrap items-center gap-4 lg:gap-8">
          <div className="text-sm font-bold text-slate-700 w-full lg:w-auto">Perlu tindakan:</div>
          
          <Link to="/guru/tugas" className="flex items-center gap-2 hover:bg-slate-50 px-3 py-2 rounded-xl cursor-pointer transition-colors border border-transparent hover:border-slate-100 flex-1 lg:flex-none">
            <div className="text-blue-600"><Calendar className="w-5 h-5" /></div>
            <div>
              <p className="font-bold text-slate-900 text-sm">8</p>
              <p className="text-[10px] font-medium text-slate-500 uppercase">Tugas belum dinilai</p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 ml-auto" />
          </Link>
          
          <Link to="/guru/progress-siswa" className="flex items-center gap-2 hover:bg-slate-50 px-3 py-2 rounded-xl cursor-pointer transition-colors border border-transparent hover:border-slate-100 flex-1 lg:flex-none">
            <div className="text-orange-500"><Users className="w-5 h-5" /></div>
            <div>
              <p className="font-bold text-slate-900 text-sm">3</p>
              <p className="text-[10px] font-medium text-slate-500 uppercase">Siswa perlu perhatian</p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 ml-auto" />
          </Link>

          <Link to="/guru/kelas" className="flex items-center gap-2 hover:bg-slate-50 px-3 py-2 rounded-xl cursor-pointer transition-colors border border-transparent hover:border-slate-100 flex-1 lg:flex-none">
            <div className="text-blue-600"><BookOpen className="w-5 h-5" /></div>
            <div>
              <p className="font-bold text-slate-900 text-sm">2</p>
              <p className="text-[10px] font-medium text-slate-500 uppercase">Kelas belum disiapkan</p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 ml-auto" />
          </Link>

          <Link to="/guru/course" className="flex items-center gap-2 hover:bg-slate-50 px-3 py-2 rounded-xl cursor-pointer transition-colors border border-transparent hover:border-slate-100 flex-1 lg:flex-none">
            <div className="text-emerald-500"><CheckCircle2 className="w-5 h-5" /></div>
            <div>
              <p className="font-bold text-slate-900 text-sm">1</p>
              <p className="text-[10px] font-medium text-slate-500 uppercase">Materi belum siap</p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 ml-auto" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Left Column Stack */}
          <div className="space-y-6 flex flex-col">
            
            {/* Kelas Hari Ini */}
            <motion.div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex-1 p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-slate-900 flex items-center gap-2 text-lg">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  Kelas Hari Ini
                </h3>
                <Link to="/guru/absensi" className="text-xs font-bold text-blue-600 hover:underline cursor-pointer flex items-center gap-1">
                  Lihat Semua Jadwal <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-xs text-slate-500 uppercase bg-slate-50/50">
                    <tr>
                      <th className="px-4 py-3 font-medium rounded-l-xl">Waktu</th>
                      <th className="px-4 py-3 font-medium">Kelas</th>
                      <th className="px-4 py-3 font-medium">Mata Pelajaran</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium rounded-r-xl">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      { time: '07.15 - 08.45', class: 'Batch UTBK 1', subject: 'Matematika', status: 'Berlangsung', statusColor: 'bg-emerald-100 text-emerald-700', btnClass: 'bg-blue-600 text-white hover:bg-blue-700', btnText: 'Buka Kelas' },
                      { time: '09.00 - 10.30', class: 'Batch Kedinasan 2', subject: 'Fisika', status: '30 menit lagi', statusColor: 'bg-orange-100 text-orange-700', btnClass: 'bg-white border-2 border-slate-200 text-slate-600 hover:bg-slate-50', btnText: 'Siapkan' },
                      { time: '13.00 - 14.30', class: 'English Level 1', subject: 'Bahasa Inggris', status: '2 jam lagi', statusColor: 'bg-slate-100 text-slate-600', btnClass: 'bg-white border-2 border-slate-200 text-slate-600 hover:bg-slate-50', btnText: 'Detail' },
                      { time: '16.00 - 18.00', class: 'Batch XI RPL', subject: 'Matematika', status: '3 jam lagi', statusColor: 'bg-slate-100 text-slate-600', btnClass: 'bg-white border-2 border-slate-200 text-slate-600 hover:bg-slate-50', btnText: 'Detail' }
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-4 py-4 font-bold text-slate-700">{row.time}</td>
                        <td className="px-4 py-4 font-bold text-slate-900">{row.class}</td>
                        <td className="px-4 py-4 text-slate-600">{row.subject}</td>
                        <td className="px-4 py-4">
                          <span className={`px-2 py-1 text-[10px] font-bold rounded-md flex items-center w-fit gap-1 ${row.statusColor}`}>
                            <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
                            {row.status}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <button 
                            onClick={() => handleOpenClass(row.class)}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${row.btnClass}`}
                          >
                            {row.btnText}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Deadline Terdekat */}
            <motion.div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex-1">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-900 flex items-center gap-2 text-lg">
                  <Clock className="w-5 h-5 text-orange-500" />
                  Deadline Terdekat
                </h3>
                <Link to="/guru/tugas" className="text-xs font-bold text-blue-600 hover:underline cursor-pointer flex items-center gap-1">
                  Lihat Semua <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-bold text-orange-500 mb-2">Hari ini</p>
                  <ul className="space-y-2">
                    <li className="flex justify-between items-center text-sm">
                      <Link to="/guru/tugas" className="flex items-center gap-2 text-slate-900 font-medium hover:text-blue-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div> Tugas Bedah Soal TPS
                      </Link>
                      <span className="text-xs text-slate-500">23.59 WIB</span>
                    </li>
                    <li className="flex justify-between items-center text-sm">
                      <Link to="/guru/tugas" className="flex items-center gap-2 text-slate-900 font-medium hover:text-blue-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div> Latihan Mandiri Fisika
                      </Link>
                      <span className="text-xs text-slate-500">23.59 WIB</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-bold text-blue-600 mb-2">Besok</p>
                  <ul className="space-y-2">
                    <li className="flex justify-between items-center text-sm">
                      <Link to="/guru/tugas" className="flex items-center gap-2 text-slate-900 font-medium hover:text-blue-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div> Essay: Dampak Teknologi
                      </Link>
                      <span className="text-xs text-slate-500">23.59 WIB</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column Stack */}
          <div className="space-y-6 flex flex-col">
            
            {/* Siswa Perlu Perhatian */}
            <motion.div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex-1">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-slate-900 flex items-center gap-2 text-lg">
                  <AlertCircle className="w-5 h-5 text-blue-600" />
                  Siswa Perlu Perhatian
                </h3>
                <Link to="/guru/progress-siswa" className="text-xs font-bold text-blue-600 hover:underline cursor-pointer flex items-center gap-1">
                  Lihat Semua <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
              
              <div className="space-y-4">
                {[
                  { initials: 'RR', name: 'Reza Rahardian', reason: 'Nilai: 62 • Kehadiran rendah', trend: '-12%', bg: 'bg-purple-100 text-purple-600' },
                  { initials: 'SA', name: 'Siti Aisyah', reason: 'Nilai: 68 • Tugas belum selesai', trend: '-8%', bg: 'bg-emerald-100 text-emerald-600' },
                  { initials: 'FA', name: 'Fauzan Akbar', reason: 'Nilai: 65 • Speaking rendah', trend: '-7%', bg: 'bg-orange-100 text-orange-600' }
                ].map((student, i) => (
                  <Link 
                    to="/guru/progress-siswa" 
                    key={i} 
                    className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors block"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${student.bg}`}>
                        {student.initials}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm leading-tight">{student.name}</p>
                        <p className="text-xs text-slate-500 mt-1">{student.reason}</p>
                      </div>
                    </div>
                    <div className="text-rose-500 font-bold text-xs flex items-center gap-1">
                      {student.trend} ↓
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
              {/* Pengumuman Terbaru */}
              <motion.div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex-1">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
                    <Bell className="w-4 h-4 text-blue-600" />
                    Pengumuman Terbaru
                  </h3>
                  <Link to="/guru/pengumuman" className="text-[10px] font-bold text-blue-600 hover:underline cursor-pointer">Lihat Semua</Link>
                </div>
                <div className="space-y-4">
                  {[
                    { title: 'Ujian Tengah Semester akan dimulai', time: 'Kemarin', color: 'bg-blue-500' },
                    { title: 'Materi baru telah tersedia', time: '3 jam lalu', color: 'bg-emerald-500' },
                    { title: 'Pengingat: Kelas dimulai pukul 16.00', time: '1 jam lalu', color: 'bg-orange-500' }
                  ].map((ann, i) => (
                    <Link to="/guru/pengumuman" key={i} className="flex gap-2 block hover:opacity-80 transition-opacity">
                      <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${ann.color}`}></div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 leading-tight">{ann.title}</p>
                        <p className="text-[10px] text-slate-500 mt-1">{ann.time}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>

              {/* Ringkasan */}
              <motion.div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex-1 flex flex-col">
                <h3 className="font-bold text-slate-900 flex items-center gap-2 text-sm mb-6">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  Ringkasan Mengajar
                </h3>
                <div className="grid grid-cols-2 gap-4 flex-1 items-center">
                  <Link to="/guru/nilai" className="text-center p-2 rounded-xl hover:bg-slate-50 transition-colors">
                    <p className="text-[10px] font-medium text-slate-500 mb-1">Rata-rata Nilai</p>
                    <p className="font-display font-bold text-4xl text-slate-900">78<span className="text-sm text-slate-400">/100</span></p>
                    <p className="text-[10px] font-medium text-blue-600 mt-1">Lihat Rekap</p>
                  </Link>
                  <Link to="/guru/absensi" className="text-center p-2 rounded-xl hover:bg-slate-50 transition-colors">
                    <p className="text-[10px] font-medium text-slate-500 mb-1">Kehadiran Siswa</p>
                    <p className="font-display font-bold text-4xl text-slate-900">89<span className="text-sm text-slate-400">%</span></p>
                    <p className="text-[10px] font-medium text-emerald-600 mt-1">Cek Presensi</p>
                  </Link>
                </div>
              </motion.div>
            </div>

          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
