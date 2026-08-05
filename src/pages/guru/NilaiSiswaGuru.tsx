import { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { motion } from 'motion/react';
import { Search, Download, Edit, Award, TrendingUp, Users, BookOpen } from 'lucide-react';
import { useDataStore, GradeItem } from '../../store/useDataStore';
import { GradeFormDialog } from '../../components/common/GradeFormDialog';
import { toast } from 'sonner';

export default function NilaiSiswaGuru() {
  const { grades, updateGrade } = useDataStore();
  const [selectedGrade, setSelectedGrade] = useState<GradeItem | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');

  const handleEdit = (grade: GradeItem) => {
    setSelectedGrade(grade);
    setDialogOpen(true);
  };

  const handleSaveGrade = (id: string, updated: Partial<GradeItem>) => {
    updateGrade(id, updated);
    toast.success('Nilai siswa berhasil diperbarui');
  };

  const handleExport = () => {
    toast.success('Rekapitulasi nilai akademik berhasil diekspor (Excel/PDF)');
  };

  const filteredGrades = grades.filter((g) => {
    const matchQuery = g.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.studentNis.includes(searchQuery);
    const matchClass = !classFilter || g.class.toLowerCase().includes(classFilter.toLowerCase());
    const matchSubject = !subjectFilter || g.subject.toLowerCase().includes(subjectFilter.toLowerCase());
    return matchQuery && matchClass && matchSubject;
  });

  const avgScore = grades.length > 0 
    ? Math.round(grades.reduce((acc, g) => acc + g.finalScore, 0) / grades.length)
    : 0;

  const topScore = grades.length > 0
    ? Math.max(...grades.map(g => g.finalScore))
    : 0;

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-display font-bold text-slate-900 mb-2">Buku Nilai & Rapor Guru</h2>
            <p className="text-slate-500">Kelola komponen nilai tugas, UTS, UAS, dan kalkulasi predikat siswa secara otomatis.</p>
          </div>
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-bold hover:bg-slate-50 transition-colors shadow-sm active:scale-95"
          >
            <Download className="w-4 h-4" />
            Unduh Rekap Nilai (Excel)
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-6 rounded-3xl border border-white/40 shadow-sm flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Siswa Ternilai</p>
              <p className="text-2xl font-bold text-slate-900">{grades.length} Siswa</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass p-6 rounded-3xl border border-white/40 shadow-sm flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Rata-rata Nilai Kelas</p>
              <p className="text-2xl font-bold text-slate-900">{avgScore} / 100</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass p-6 rounded-3xl border border-white/40 shadow-sm flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nilai Tertinggi</p>
              <p className="text-2xl font-bold text-slate-900">{topScore} / 100</p>
            </div>
          </motion.div>
        </div>

        {/* Filters */}
        <div className="glass p-4 rounded-2xl border border-white/40 flex flex-col md:flex-row gap-4 shadow-sm">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama atau NIS siswa..." 
              className="w-full pl-12 pr-4 py-3 bg-white/60 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium placeholder:font-normal text-sm"
            />
          </div>
          <div className="flex gap-2">
            <select 
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="px-4 py-3 bg-white/60 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 font-medium text-sm"
            >
              <option value="">Semua Kelas</option>
              <option value="10 IPA">Kelas 10 IPA</option>
              <option value="10 IPS">Kelas 10 IPS</option>
              <option value="11 IPA">Kelas 11 IPA</option>
              <option value="11 IPS">Kelas 11 IPS</option>
            </select>
            <select 
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="px-4 py-3 bg-white/60 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 font-medium text-sm"
            >
              <option value="">Semua Mapel</option>
              <option value="matematika">Matematika</option>
              <option value="fisika">Fisika</option>
              <option value="indonesia">Bahasa Indonesia</option>
              <option value="ekonomi">Ekonomi</option>
            </select>
          </div>
        </div>

        {/* Grade Table */}
        <div className="glass rounded-3xl border border-white/40 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead className="bg-slate-50/80 border-b border-slate-100 backdrop-blur-md">
                <tr>
                  <th className="px-6 py-4 font-bold text-slate-500 text-xs uppercase tracking-wider">Nama Siswa</th>
                  <th className="px-6 py-4 font-bold text-slate-500 text-xs uppercase tracking-wider">Kelas & Mapel</th>
                  <th className="px-6 py-4 font-bold text-slate-500 text-xs uppercase tracking-wider text-center">Tugas (30%)</th>
                  <th className="px-6 py-4 font-bold text-slate-500 text-xs uppercase tracking-wider text-center">UTS (30%)</th>
                  <th className="px-6 py-4 font-bold text-slate-500 text-xs uppercase tracking-wider text-center">UAS (40%)</th>
                  <th className="px-6 py-4 font-bold text-slate-500 text-xs uppercase tracking-wider text-center">Nilai Akhir</th>
                  <th className="px-6 py-4 font-bold text-slate-500 text-xs uppercase tracking-wider text-center">Predikat</th>
                  <th className="px-6 py-4 font-bold text-slate-500 text-xs uppercase tracking-wider text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredGrades.map((g) => (
                  <tr key={g.id} className="border-b border-slate-50 hover:bg-white/60 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{g.studentName}</p>
                        <p className="text-xs text-slate-400 font-mono">NIS: {g.studentNis}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-slate-800">{g.class}</p>
                      <p className="text-xs text-blue-600 font-medium">{g.subject}</p>
                    </td>
                    <td className="px-6 py-4 text-center font-semibold text-slate-700 text-sm">{g.tugas}</td>
                    <td className="px-6 py-4 text-center font-semibold text-slate-700 text-sm">{g.uts}</td>
                    <td className="px-6 py-4 text-center font-semibold text-slate-700 text-sm">{g.uas}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-base font-black text-blue-700">{g.finalScore}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-md font-bold text-xs">
                        {g.letterGrade}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleEdit(g)}
                        className="px-3.5 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl transition-colors font-bold text-xs flex items-center gap-1.5 ml-auto"
                      >
                        <Edit className="w-3.5 h-3.5" /> Edit Nilai
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredGrades.length === 0 && (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-slate-500">
                      Tidak ada data nilai yang sesuai dengan filter pencarian.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <GradeFormDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSaveGrade}
        gradeItem={selectedGrade}
      />
    </DashboardLayout>
  );
}
