import { useState, useMemo } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { motion, AnimatePresence } from 'motion/react';
import { 
  UserCheck, 
  Users, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  XCircle, 
  Save, 
  Sparkles, 
  RotateCcw, 
  Calendar, 
  BookOpen, 
  Building2, 
  Search,
  Filter,
  Check,
  FileCheck2,
  ChevronRight,
  Eye,
  X,
  Download
} from 'lucide-react';
import { useDataStore, AttendanceRecord } from '../../store/useDataStore';
import { toast } from 'sonner';

export default function AbsensiKelasGuru() {
  const { students, classes, attendanceLogs, addBatchAttendanceRecords, schoolSettings } = useDataStore();

  const [activeMainTab, setActiveMainTab] = useState<'take_attendance' | 'history'>('take_attendance');

  // Session Config State
  const [selectedBatch, setSelectedBatch] = useState<string>('Batch UTBK 1');
  const [subject, setSubject] = useState<string>('TPS Penalaran Umum & Kuantitatif');
  const [topic, setTopic] = useState<string>('Trik Cepat Soal Penalaran Matematika & Deret Angka');
  const [room, setRoom] = useState<string>('Studio Belajar 1 (Utama)');
  const [sessionDate, setSessionDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [sessionTime, setSessionTime] = useState<string>('14:00 - 15:30 WIB');
  const [tutorName, setTutorName] = useState<string>('Drs. Ahmad Yani (Master Tentor)');

  // Filter students in the chosen batch
  const batchStudents = useMemo(() => {
    return students.filter((s) => s.grade === selectedBatch || s.classId === selectedBatch);
  }, [students, selectedBatch]);

  // Attendance map: { [studentId]: 'Hadir' | 'Izin' | 'Sakit' | 'Alpha' }
  const [attendanceMap, setAttendanceMap] = useState<Record<string, 'Hadir' | 'Izin' | 'Sakit' | 'Alpha'>>({});
  const [notesMap, setNotesMap] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // History detail modal state
  const [selectedHistorySession, setSelectedHistorySession] = useState<{
    date: string;
    time: string;
    subject: string;
    topic: string;
    tutor: string;
    room: string;
    records: AttendanceRecord[];
  } | null>(null);

  // Initialize all to 'Hadir' if not set
  const getStudentStatus = (studentId: string) => {
    return attendanceMap[studentId] || 'Hadir';
  };

  const handleStatusChange = (studentId: string, status: 'Hadir' | 'Izin' | 'Sakit' | 'Alpha') => {
    setAttendanceMap((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleMarkAll = (status: 'Hadir' | 'Izin' | 'Sakit' | 'Alpha') => {
    const updated: Record<string, 'Hadir' | 'Izin' | 'Sakit' | 'Alpha'> = {};
    batchStudents.forEach((s) => {
      updated[s.id] = status;
    });
    setAttendanceMap(updated);
    toast.success(`Semua siswa berhasil ditandai sebagai "${status}"`);
  };

  const handleResetAttendance = () => {
    setAttendanceMap({});
    toast.info('Status presensi di-reset ke nilai default (Hadir).');
  };

  // Live Statistics
  const stats = useMemo(() => {
    let hadir = 0;
    let izin = 0;
    let sakit = 0;
    let alpha = 0;

    batchStudents.forEach((s) => {
      const st = getStudentStatus(s.id);
      if (st === 'Hadir') hadir++;
      else if (st === 'Izin') izin++;
      else if (st === 'Sakit') sakit++;
      else if (st === 'Alpha') alpha++;
    });

    const total = batchStudents.length;
    const rate = total > 0 ? Math.round((hadir / total) * 100) : 100;

    return { total, hadir, izin, sakit, alpha, rate };
  }, [batchStudents, attendanceMap]);

  // Filtered student list by search
  const filteredStudents = batchStudents.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.nis.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSaveAttendance = () => {
    if (batchStudents.length === 0) {
      toast.error('Tidak ada siswa di batch/kelas yang dipilih.');
      return;
    }

    setIsSaving(true);

    const nowTime = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';

    const recordsToSave: Omit<AttendanceRecord, 'id'>[] = batchStudents.map((student) => {
      const status = getStudentStatus(student.id);
      return {
        studentId: student.id,
        studentName: student.name,
        date: sessionDate,
        time: sessionTime,
        subject: subject,
        tutor: tutorName,
        room: room,
        status: status,
        topic: topic,
        checkInTime: status === 'Hadir' ? nowTime : '-',
      };
    });

    setTimeout(() => {
      addBatchAttendanceRecords(recordsToSave);
      setIsSaving(false);
      toast.success('Presensi Kelas Berhasil Disimpan & Tersinkronisasi!', {
        description: `Rekapitulasi kehadiran ${batchStudents.length} siswa pada sesi "${topic}" telah dipublikasikan ke akun murid secara real-time.`,
      });
      setActiveMainTab('history');
    }, 900);
  };

  // Group historical attendance logs by Session (date + topic + subject)
  const groupedHistory = useMemo(() => {
    const map = new Map<string, AttendanceRecord[]>();

    attendanceLogs.forEach((log) => {
      const key = `${log.date}_${log.subject}_${log.topic}`;
      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key)!.push(log);
    });

    return Array.from(map.entries()).map(([_, records]) => {
      const sample = records[0];
      const hadirCount = records.filter((r) => r.status === 'Hadir').length;
      const izinCount = records.filter((r) => r.status === 'Izin').length;
      const sakitCount = records.filter((r) => r.status === 'Sakit').length;
      const alphaCount = records.filter((r) => r.status === 'Alpha').length;
      const totalCount = records.length;
      const rate = totalCount > 0 ? Math.round((hadirCount / totalCount) * 100) : 0;

      return {
        date: sample.date,
        time: sample.time,
        subject: sample.subject,
        topic: sample.topic,
        tutor: sample.tutor,
        room: sample.room,
        records,
        hadirCount,
        izinCount,
        sakitCount,
        alphaCount,
        totalCount,
        rate,
      };
    });
  }, [attendanceLogs]);

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-lg bg-blue-100 text-blue-700 font-bold text-xs flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5" /> Portal Presensi Tentor Bimbel
              </span>
              <span className="text-xs text-slate-500 font-medium">Tersinkronisasi Realtime dengan Akun Siswa</span>
            </div>
            <h2 className="text-3xl font-display font-bold text-slate-900 mb-1">
              Presensi & Absensi Sesi Kelas
            </h2>
            <p className="text-slate-500 text-sm">
              Lakukan absensi murid saat sesi bimbingan belajar dimulai. Data kehadiran otomatis terupdate di dashboard & histori murid.
            </p>
          </div>

          {/* Main Tab Toggle */}
          <div className="flex bg-slate-100 p-1.5 rounded-2xl shrink-0">
            <button
              onClick={() => setActiveMainTab('take_attendance')}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
                activeMainTab === 'take_attendance'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              Mulai Absensi Sesi Ini
            </button>
            <button
              onClick={() => setActiveMainTab('history')}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
                activeMainTab === 'history'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileCheck2 className="w-4 h-4" />
              Riwayat Sesi ({groupedHistory.length})
            </button>
          </div>
        </div>

        {activeMainTab === 'take_attendance' ? (
          <div className="space-y-6">
            
            {/* Session Config Card */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass p-6 sm:p-7 rounded-3xl border border-white/40 shadow-sm bg-white space-y-5"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">Informasi Sesi Pertemuan Kelas</h3>
                    <p className="text-xs text-slate-500">Tentukan rombel batch bimbel, mata pelajaran, dan studio bimbingan belajar.</p>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-200">
                  <Sparkles className="w-3.5 h-3.5" /> Sesi Sedang Berlangsung
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Pilih Rombel / Batch Bimbel *
                  </label>
                  <select
                    value={selectedBatch}
                    onChange={(e) => setSelectedBatch(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 font-bold text-slate-900 text-sm outline-none"
                  >
                    {classes.map((cls) => (
                      <option key={cls.id} value={cls.name}>
                        {cls.name} ({cls.studentCount} Siswa)
                      </option>
                    ))}
                    {classes.length === 0 && (
                      <>
                        <option value="Batch UTBK 1">Batch UTBK 1</option>
                        <option value="Batch Kedinasan 2">Batch Kedinasan 2</option>
                        <option value="Batch TOEFL Intensif">Batch TOEFL Intensif</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Mata Pelajaran *
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Contoh: TPS Kuantitatif"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 font-medium text-slate-900 text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Ruang / Studio Belajar
                  </label>
                  <select
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 font-medium text-slate-900 text-sm outline-none"
                  >
                    <option value="Studio Belajar 1 (Utama)">Studio Belajar 1 (Utama)</option>
                    <option value="Studio Belajar 2 (Sains)">Studio Belajar 2 (Sains)</option>
                    <option value="Studio Bahasa & TOEFL">Studio Bahasa & TOEFL</option>
                    <option value="Studio Hybrid / Zoom">Studio Hybrid / Zoom</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Topik Bahasan / Materi Sesi Ini *
                  </label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Contoh: Bedah Soal Penalaran Matematika & Trik 20 Detik"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 font-medium text-slate-900 text-sm outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Tanggal
                    </label>
                    <input
                      type="date"
                      value={sessionDate}
                      onChange={(e) => setSessionDate(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 font-medium text-slate-900 text-xs outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Waktu
                    </label>
                    <input
                      type="text"
                      value={sessionTime}
                      onChange={(e) => setSessionTime(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 font-medium text-slate-900 text-xs outline-none"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Attendance Live Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Siswa</span>
                <span className="text-2xl font-display font-bold text-slate-900">{stats.total}</span>
              </div>

              <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 text-center">
                <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">Hadir</span>
                <span className="text-2xl font-display font-bold text-emerald-700">{stats.hadir}</span>
              </div>

              <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 text-center">
                <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block">Izin</span>
                <span className="text-2xl font-display font-bold text-amber-700">{stats.izin}</span>
              </div>

              <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-200 text-center">
                <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider block">Sakit</span>
                <span className="text-2xl font-display font-bold text-blue-700">{stats.sakit}</span>
              </div>

              <div className="col-span-2 sm:col-span-1 bg-rose-50/70 p-4 rounded-2xl border border-rose-200 text-center">
                <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider block">Alpha</span>
                <span className="text-2xl font-display font-bold text-rose-700">{stats.alpha}</span>
              </div>
            </div>

            {/* Student Roster Card */}
            <div className="glass rounded-3xl border border-white/40 shadow-sm bg-white overflow-hidden space-y-0">
              
              {/* Table Toolbar */}
              <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Cari nama atau NIS siswa..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-500 shrink-0">
                    {filteredStudents.length} Siswa
                  </span>
                </div>

                {/* Quick Bulk Actions */}
                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => handleMarkAll('Hadir')}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold text-xs transition-all flex items-center gap-1.5 active:scale-95"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Tandai Semua Hadir
                  </button>

                  <button
                    type="button"
                    onClick={handleResetAttendance}
                    className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs transition-colors flex items-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset
                  </button>
                </div>
              </div>

              {/* Student Roster List */}
              <div className="divide-y divide-slate-100">
                <AnimatePresence mode="popLayout">
                  {filteredStudents.map((student, index) => {
                    const currentStatus = getStudentStatus(student.id);

                    return (
                      <motion.div
                        key={student.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.15, delay: index * 0.02 }}
                        className="p-4 sm:p-5 hover:bg-slate-50/60 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >
                        {/* Student Profile Info */}
                        <div className="flex items-center gap-3.5">
                          <span className="text-xs font-mono font-bold text-slate-400 w-6">
                            {index + 1}.
                          </span>
                          <div className="w-10 h-10 rounded-2xl bg-blue-100 border border-blue-200 flex items-center justify-center font-bold text-blue-700 shrink-0 overflow-hidden">
                            <img
                              src={`https://api.dicebear.com/7.x/notionists/svg?seed=${student.name}`}
                              alt={student.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-bold text-sm text-slate-900 flex items-center gap-2">
                              {student.name}
                              <span className="text-[10px] font-mono font-normal bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                                NIS: {student.nis || student.id}
                              </span>
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {student.grade} • {student.email}
                            </p>
                          </div>
                        </div>

                        {/* Status Toggle Buttons */}
                        <div className="flex items-center gap-2 self-end md:self-center">
                          {[
                            { label: 'Hadir', value: 'Hadir', bg: 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30 ring-2 ring-emerald-600 ring-offset-1', inactive: 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700' },
                            { label: 'Izin', value: 'Izin', bg: 'bg-amber-500 text-white shadow-sm shadow-amber-500/30 ring-2 ring-amber-500 ring-offset-1', inactive: 'bg-slate-100 text-slate-600 hover:bg-amber-50 hover:text-amber-700' },
                            { label: 'Sakit', value: 'Sakit', bg: 'bg-blue-600 text-white shadow-sm shadow-blue-600/30 ring-2 ring-blue-600 ring-offset-1', inactive: 'bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-700' },
                            { label: 'Alpha', value: 'Alpha', bg: 'bg-rose-600 text-white shadow-sm shadow-rose-600/30 ring-2 ring-rose-600 ring-offset-1', inactive: 'bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-700' },
                          ].map((btn) => {
                            const isSelected = currentStatus === btn.value;

                            return (
                              <button
                                key={btn.value}
                                type="button"
                                onClick={() => handleStatusChange(student.id, btn.value as any)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 flex items-center gap-1.5 ${
                                  isSelected ? btn.bg : btn.inactive
                                }`}
                              >
                                {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                {btn.label}
                              </button>
                            );
                          })}
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {filteredStudents.length === 0 && (
                  <div className="p-12 text-center text-slate-400 text-sm">
                    Tidak ditemukan siswa yang cocok dengan filter atau batch ini.
                  </div>
                )}
              </div>

              {/* Bottom Sticky Action Bar */}
              <div className="p-5 bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-slate-300">
                  <span>Partisipasi Sesi: <strong className="text-emerald-400">{stats.rate}%</strong> ({stats.hadir} dari {stats.total} Siswa Hadir)</span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    disabled={isSaving || batchStudents.length === 0}
                    onClick={handleSaveAttendance}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-blue-600/30 active:scale-95 flex items-center gap-2 disabled:opacity-50"
                  >
                    {isSaving ? (
                      <span>Menyimpan & Menyinkronkan...</span>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Simpan & Publikasikan Presensi Kelas
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

          </div>
        ) : (
          /* Historical Sessions Tab */
          <div className="space-y-4">
            <div className="glass rounded-3xl border border-white/40 shadow-sm bg-white overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Riwayat Presensi Sesi Bimbel Selesai</h3>
                  <p className="text-xs text-slate-500">Daftar sesi pertemuan kelas yang telah diabsen dan disinkronkan ke siswa.</p>
                </div>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">
                  {groupedHistory.length} Sesi Pertemuan
                </span>
              </div>

              <div className="divide-y divide-slate-100">
                {groupedHistory.map((sess, idx) => (
                  <div
                    key={idx}
                    className="p-5 hover:bg-slate-50/60 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-slate-900 text-base">{sess.subject}</span>
                        <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                          {sess.room}
                        </span>
                        <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                          {sess.date} • {sess.time}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 font-medium">
                        Topik: <strong className="text-slate-800">{sess.topic}</strong>
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Tentor Pengampu: {sess.tutor}
                      </p>
                    </div>

                    <div className="flex items-center justify-between lg:justify-end gap-6 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                      {/* Mini Stats Badges */}
                      <div className="flex items-center gap-2 text-xs font-bold">
                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200">
                          {sess.hadirCount} Hadir
                        </span>
                        <span className="px-2.5 py-1 bg-amber-50 text-amber-700 rounded-lg border border-amber-200">
                          {sess.izinCount} Izin
                        </span>
                        <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg border border-blue-200">
                          {sess.sakitCount} Sakit
                        </span>
                        {sess.alphaCount > 0 && (
                          <span className="px-2.5 py-1 bg-rose-50 text-rose-700 rounded-lg border border-rose-200">
                            {sess.alphaCount} Alpha
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => setSelectedHistorySession(sess)}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 shrink-0"
                      >
                        <Eye className="w-3.5 h-3.5 text-blue-600" />
                        Rincian Presensi
                      </button>
                    </div>
                  </div>
                ))}

                {groupedHistory.length === 0 && (
                  <div className="p-12 text-center text-slate-400 text-sm">
                    Belum ada riwayat sesi presensi yang tersimpan.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* History Detail Modal */}
      {selectedHistorySession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 max-h-[85vh] overflow-y-auto space-y-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedHistorySession(null)}
              className="absolute right-5 top-5 p-2 rounded-xl text-slate-400 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                Rincian Rekap Presensi Sesi
              </span>
              <h3 className="font-bold text-xl text-slate-900 mt-1">
                {selectedHistorySession.subject}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {selectedHistorySession.topic} • {selectedHistorySession.date} ({selectedHistorySession.time})
              </p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center text-xs">
              <div>
                <span className="text-slate-400 font-medium">Hadir</span>
                <p className="text-emerald-700 font-bold text-base">{selectedHistorySession.hadirCount}</p>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Izin</span>
                <p className="text-amber-700 font-bold text-base">{selectedHistorySession.izinCount}</p>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Sakit</span>
                <p className="text-blue-700 font-bold text-base">{selectedHistorySession.sakitCount}</p>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Alpha</span>
                <p className="text-rose-700 font-bold text-base">{selectedHistorySession.alphaCount}</p>
              </div>
            </div>

            {/* Students List */}
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {selectedHistorySession.records.map((rec, i) => (
                <div
                  key={rec.id || i}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-slate-400 w-4">{i + 1}.</span>
                    <div>
                      <p className="font-bold text-slate-900">{rec.studentName}</p>
                      <p className="text-[10px] text-slate-400 font-mono">ID: {rec.studentId}</p>
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full font-bold text-[11px] ${
                      rec.status === 'Hadir'
                        ? 'bg-emerald-100 text-emerald-700'
                        : rec.status === 'Izin'
                        ? 'bg-amber-100 text-amber-700'
                        : rec.status === 'Sakit'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-rose-100 text-rose-700'
                    }`}
                  >
                    {rec.status}
                  </span>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-100 flex justify-end gap-3">
              <button
                onClick={() => setSelectedHistorySession(null)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  toast.success('Rekap presensi sesi berhasil diexport!');
                  window.print();
                }}
                className="px-5 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 text-xs flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                Cetak / Export Rekap
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
