import { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { motion, AnimatePresence } from 'motion/react';
import { 
  UserCheck, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  Search, 
  Printer, 
  Sparkles,
  MapPin,
  FileCheck2,
  X
} from 'lucide-react';
import { useDataStore, AttendanceRecord } from '../../store/useDataStore';
import { toast } from 'sonner';

export default function AbsensiSiswa() {
  const { attendanceLogs, students, schoolSettings } = useDataStore();
  const currentStudent = students[0] || { name: 'Budi Santoso', id: '1001', grade: 'Batch UTBK 1' };

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [monthFilter, setMonthFilter] = useState('all');
  const [showPrintModal, setShowPrintModal] = useState(false);

  const studentLogs = attendanceLogs.filter(
    (log) => log.studentId === currentStudent.id || log.studentName === currentStudent.name
  );

  const totalSessions = studentLogs.length;
  const hadirCount = studentLogs.filter((l) => l.status === 'Hadir').length;
  const izinCount = studentLogs.filter((l) => l.status === 'Izin').length;
  const sakitCount = studentLogs.filter((l) => l.status === 'Sakit').length;
  const alphaCount = studentLogs.filter((l) => l.status === 'Alpha').length;
  const attendanceRate = totalSessions > 0 ? Math.round((hadirCount / totalSessions) * 100) : 100;

  const filteredLogs = studentLogs.filter((log) => {
    const matchQuery =
      log.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.tutor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.room.toLowerCase().includes(searchQuery.toLowerCase());

    const matchStatus = statusFilter === 'all' || log.status.toLowerCase() === statusFilter.toLowerCase();
    
    let matchMonth = true;
    if (monthFilter !== 'all') {
      matchMonth = log.date.startsWith(monthFilter);
    }

    return matchQuery && matchStatus && matchMonth;
  });

  const getStatusBadge = (status: AttendanceRecord['status']) => {
    switch (status) {
      case 'Hadir':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Hadir Tepat Waktu
          </span>
        );
      case 'Izin':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-bold">
            <AlertCircle className="w-3.5 h-3.5" />
            Izin Terkonfirmasi
          </span>
        );
      case 'Sakit':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs font-bold">
            <AlertCircle className="w-3.5 h-3.5" />
            Sakit (Surat Dokter)
          </span>
        );
      case 'Alpha':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-full text-xs font-bold">
            <XCircle className="w-3.5 h-3.5" />
            Tanpa Keterangan
          </span>
        );
    }
  };

  const handlePrint = () => {
    toast.success('Rekap absensi siap dicetak / diunduh sebagai PDF');
    window.print();
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-lg bg-blue-100 text-blue-700 font-bold text-xs">
                {currentStudent.grade}
              </span>
              <span className="text-xs text-slate-500 font-medium">NIS: {currentStudent.id}</span>
            </div>
            <h2 className="text-3xl font-display font-bold text-slate-900 mb-1">
              Laporan Absensi & Kehadiran Bimbel
            </h2>
            <p className="text-slate-500 text-sm">
              Pantau riwayat presensi sesi kelas tatap muka, daring, dan klinik konsultasi belajar Anda.
            </p>
          </div>

          <button
            onClick={() => setShowPrintModal(true)}
            className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-bold hover:bg-slate-50 hover:border-blue-300 transition-all shadow-sm active:scale-95 text-sm"
          >
            <Printer className="w-4 h-4 text-blue-600" />
            Cetak Rekap Presensi
          </button>
        </div>

        {/* Attendance Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-5 rounded-3xl border border-white/40 shadow-sm bg-white col-span-2 lg:col-span-1"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tingkat Kehadiran</span>
              <Sparkles className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-display font-bold text-blue-600">{attendanceRate}%</span>
              <span className="text-xs font-semibold text-emerald-600">Sangat Baik</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full transition-all duration-1000"
                style={{ width: `${attendanceRate}%` }}
              ></div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="glass p-5 rounded-3xl border border-white/40 shadow-sm bg-white"
          >
            <div className="flex items-center gap-2 text-slate-400 mb-2">
              <Calendar className="w-4 h-4 text-slate-600" />
              <span className="text-xs font-bold uppercase tracking-wider">Total Sesi</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{totalSessions}</p>
            <p className="text-[11px] text-slate-500 mt-1">Pertemuan Bimbel</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass p-5 rounded-3xl border border-white/40 shadow-sm bg-white"
          >
            <div className="flex items-center gap-2 text-slate-400 mb-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold uppercase tracking-wider">Hadir</span>
            </div>
            <p className="text-2xl font-bold text-emerald-600">{hadirCount}</p>
            <p className="text-[11px] text-slate-500 mt-1">Sesi Terpenuhi</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass p-5 rounded-3xl border border-white/40 shadow-sm bg-white"
          >
            <div className="flex items-center gap-2 text-slate-400 mb-2">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-bold uppercase tracking-wider">Izin / Sakit</span>
            </div>
            <p className="text-2xl font-bold text-amber-600">{izinCount + sakitCount}</p>
            <p className="text-[11px] text-slate-500 mt-1">{izinCount} Izin • {sakitCount} Sakit</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass p-5 rounded-3xl border border-white/40 shadow-sm bg-white"
          >
            <div className="flex items-center gap-2 text-slate-400 mb-2">
              <XCircle className="w-4 h-4 text-rose-500" />
              <span className="text-xs font-bold uppercase tracking-wider">Alpha</span>
            </div>
            <p className="text-2xl font-bold text-rose-600">{alphaCount}</p>
            <p className="text-[11px] text-slate-500 mt-1">Tanpa Keterangan</p>
          </motion.div>
        </div>

        {/* Filter & Search Bar */}
        <div className="glass p-4 rounded-2xl border border-white/40 flex flex-col md:flex-row gap-4 justify-between items-center shadow-sm bg-white">
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <div className="flex bg-slate-100 p-1 rounded-xl">
              {['all', 'Hadir', 'Izin', 'Sakit'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3.5 py-1.5 rounded-lg font-bold text-xs transition-all ${
                    statusFilter === st
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {st === 'all' ? 'Semua Status' : st}
                </button>
              ))}
            </div>

            <select
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none"
            >
              <option value="all">Semua Periode</option>
              <option value="2024-11">November 2024</option>
              <option value="2024-10">Oktober 2024</option>
              <option value="2024-09">September 2024</option>
            </select>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari mapel, materi, atau tentor..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-medium"
            />
          </div>
        </div>

        {/* Attendance List */}
        <div className="glass rounded-3xl border border-white/40 shadow-sm bg-white overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-lg text-slate-900">Riwayat Sesi Pertemuan Kelas</h3>
            </div>
            <span className="text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
              Menampilkan {filteredLogs.length} dari {studentLogs.length} Sesi
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            <AnimatePresence mode="popLayout">
              {filteredLogs.map((log, i) => (
                <motion.div
                  key={log.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2, delay: i * 0.03 }}
                  className="p-5 sm:p-6 hover:bg-slate-50/60 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl shrink-0 mt-1">
                      <Calendar className="w-5 h-5" />
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-slate-900 text-base">{log.subject}</span>
                        {getStatusBadge(log.status)}
                      </div>
                      
                      <p className="text-xs font-semibold text-slate-600">
                        Topik Bahasan: <span className="text-blue-700 font-bold">{log.topic}</span>
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {log.date} • {log.time}
                        </span>
                        <span className="flex items-center gap-1 font-medium text-slate-700">
                          Tentor: {log.tutor}
                        </span>
                        <span className="flex items-center gap-1 text-slate-500">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {log.room}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 shrink-0">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Waktu Presensi</span>
                    <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg">
                      {log.checkInTime || '15:55 WIB'}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredLogs.length === 0 && (
              <div className="p-12 text-center text-slate-400 text-sm">
                Tidak ada data absensi yang sesuai dengan filter pencarian.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Print / Recap Modal */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl relative">
            <button
              onClick={() => setShowPrintModal(false)}
              className="absolute right-5 top-5 p-2 rounded-xl text-slate-400 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Letterhead */}
            <div className="border-b-2 border-slate-900 pb-4 text-center space-y-1">
              <h3 className="font-bold text-xl text-slate-900 tracking-tight uppercase">
                {schoolSettings.schoolName}
              </h3>
              <p className="text-xs text-slate-600">{schoolSettings.address}</p>
              <p className="text-xs text-slate-500 font-mono">Telp: {schoolSettings.phone} • Web: {schoolSettings.website}</p>
            </div>

            <div className="text-center">
              <h4 className="font-bold text-base text-slate-900 uppercase underline decoration-2 underline-offset-4">
                SURAT REKAPITULASI KEHADIRAN BELAJAR SISWA
              </h4>
              <p className="text-xs text-slate-500 mt-1">Nomor: REKAP-ABS/BV/2024/XI-089</p>
            </div>

            {/* Student Info */}
            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
              <div>
                <p className="text-slate-500 font-medium">Nama Siswa: <strong className="text-slate-900">{currentStudent.name}</strong></p>
                <p className="text-slate-500 font-medium mt-1">NIS / ID: <strong className="text-slate-900">{currentStudent.id}</strong></p>
              </div>
              <div>
                <p className="text-slate-500 font-medium">Program / Batch: <strong className="text-slate-900">{currentStudent.grade}</strong></p>
                <p className="text-slate-500 font-medium mt-1">Persentase Kehadiran: <strong className="text-emerald-700 font-bold">{attendanceRate}%</strong></p>
              </div>
            </div>

            {/* Summary Table */}
            <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
              <thead className="bg-slate-100 font-bold text-slate-700">
                <tr>
                  <th className="p-3 border-b">Tanggal</th>
                  <th className="p-3 border-b">Mata Pelajaran</th>
                  <th className="p-3 border-b">Tentor Pengampu</th>
                  <th className="p-3 border-b text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {studentLogs.slice(0, 6).map((log) => (
                  <tr key={log.id}>
                    <td className="p-3 font-mono">{log.date}</td>
                    <td className="p-3 font-medium text-slate-900">{log.subject}</td>
                    <td className="p-3 text-slate-600">{log.tutor}</td>
                    <td className="p-3 text-right font-bold text-emerald-600">{log.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Signature & Stamp */}
            <div className="pt-6 flex justify-between items-end text-xs">
              <div>
                <p className="text-slate-400">Dicetak pada: {new Date().toLocaleDateString('id-ID')}</p>
                <div className="flex items-center gap-2 mt-2 text-emerald-600 font-bold">
                  <FileCheck2 className="w-5 h-5" />
                  <span>Terverifikasi Sistem Digital BimbelVerse</span>
                </div>
              </div>

              <div className="text-center space-y-1">
                <p className="text-slate-600">Jakarta, {new Date().toLocaleDateString('id-ID')}</p>
                <p className="font-bold text-slate-900">Kepala Akademik Bimbel,</p>
                <div className="h-14 flex items-center justify-center">
                  <span className="font-serif italic text-blue-700 font-bold text-sm tracking-wider">[ Tanda Tangan Resmi ]</span>
                </div>
                <p className="font-bold text-slate-900">{schoolSettings.principalName}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
              <button
                onClick={() => setShowPrintModal(false)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
              >
                Tutup
              </button>
              <button
                onClick={handlePrint}
                className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 text-xs shadow-md shadow-blue-600/20 flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                Cetak Dokumen
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
