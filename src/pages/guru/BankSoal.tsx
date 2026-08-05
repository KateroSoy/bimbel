import { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, Plus, Search, BookOpen, Clock, BarChart2, Edit, Trash2, Eye, X, CheckCircle2 } from 'lucide-react';
import { useDataStore, QuestionPack } from '../../store/useDataStore';
import { BankSoalFormDialog } from '../../components/common/BankSoalFormDialog';
import { toast } from 'sonner';

export default function BankSoal() {
  const { questionPacks, addQuestionPack, updateQuestionPack, deleteQuestionPack } = useDataStore();
  const [formOpen, setFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedPack, setSelectedPack] = useState<QuestionPack | null>(null);
  const [detailPack, setDetailPack] = useState<QuestionPack | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');

  const handleAdd = () => {
    setIsEditing(false);
    setSelectedPack(null);
    setFormOpen(true);
  };

  const handleEdit = (pack: QuestionPack) => {
    setIsEditing(true);
    setSelectedPack(pack);
    setFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus paket soal ini?')) {
      deleteQuestionPack(id);
      toast.success('Paket soal berhasil dihapus');
    }
  };

  const handleSubmit = (data: Omit<QuestionPack, 'id'>) => {
    if (isEditing && selectedPack) {
      updateQuestionPack(selectedPack.id, data);
      toast.success('Paket soal berhasil diperbarui');
    } else {
      addQuestionPack(data);
      toast.success('Paket soal baru berhasil dibuat');
    }
  };

  const filteredPacks = questionPacks.filter((pack) => {
    const matchQuery = pack.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pack.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchSubject = !subjectFilter || pack.subject.toLowerCase().includes(subjectFilter.toLowerCase());
    const matchGrade = !gradeFilter || pack.grade === gradeFilter;
    return matchQuery && matchSubject && matchGrade;
  });

  const totalQuestions = questionPacks.reduce((acc, curr) => acc + curr.questions, 0);

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-display font-bold text-slate-900 mb-2">Bank Soal Guru</h2>
            <p className="text-slate-500">Kelola dan buat paket soal evaluasi, kuis, dan tryout untuk siswa Anda.</p>
          </div>
          <button 
            onClick={handleAdd}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-md shadow-blue-600/20 active:scale-95"
          >
            <Plus className="w-5 h-5" />
            Buat Paket Soal Baru
          </button>
        </div>

        {/* Search & Filters */}
        <div className="glass p-4 rounded-2xl border border-white/40 flex flex-col md:flex-row gap-4 shadow-sm">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari judul soal atau mata pelajaran..." 
              className="w-full pl-12 pr-4 py-3 bg-white/60 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium placeholder:font-normal shadow-sm"
            />
          </div>
          <div className="flex gap-2">
            <select 
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="px-4 py-3 bg-white/60 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 font-medium shadow-sm text-sm"
            >
              <option value="">Semua Mapel</option>
              <option value="matematika">Matematika</option>
              <option value="bahasa">Bahasa</option>
              <option value="ipa">IPA</option>
              <option value="ips">IPS</option>
            </select>
            <select 
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
              className="px-4 py-3 bg-white/60 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 font-medium shadow-sm text-sm"
            >
              <option value="">Semua Kelas</option>
              <option value="X">Kelas X</option>
              <option value="XI">Kelas XI</option>
              <option value="XII">Kelas XII</option>
              <option value="Alumni">Alumni / UTBK</option>
            </select>
          </div>
        </div>

        {/* Categories/Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'Total Paket Soal', value: questionPacks.length.toString(), icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Total Butir Soal', value: totalQuestions.toString(), icon: BookOpen, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Rata-rata Waktu', value: '75 Min', icon: Clock, color: 'text-purple-600', bg: 'bg-purple-50' },
            { label: 'Tingkat Standar', value: 'Kurikulum Merdeka', icon: BarChart2, color: 'text-amber-600', bg: 'bg-amber-50' }
          ].map((stat, i) => (
             <motion.div 
               key={stat.label}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.05 }}
               className="glass p-5 rounded-3xl border border-white/40 shadow-sm flex flex-col items-center text-center hover:-translate-y-1 hover:shadow-md transition-all group"
             >
               <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                 <stat.icon className="w-6 h-6" />
               </div>
               <p className="font-display font-bold text-2xl text-slate-900 leading-tight">{stat.value}</p>
               <p className="text-slate-500 text-xs font-medium uppercase tracking-wide mt-1">{stat.label}</p>
             </motion.div>
          ))}
        </div>

        <div className="flex items-center justify-between mt-8 mb-4">
          <h3 className="font-display font-bold text-xl text-slate-900">Daftar Paket Soal Tersedia ({filteredPacks.length})</h3>
          <span className="text-xs text-slate-500 font-bold bg-slate-100 px-3 py-1 rounded-full">Bank Soal Aktif</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPacks.map((pack, index) => (
            <motion.div
              key={pack.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + (index * 0.05) }}
              className="glass p-6 rounded-3xl border border-white/40 hover:shadow-lg hover:border-blue-200 transition-all group relative flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0 shadow-inner">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold tracking-wide uppercase bg-slate-100 text-slate-600">
                      Kelas {pack.grade}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ${
                      pack.difficulty === 'Mudah' ? 'bg-emerald-100 text-emerald-800' :
                      pack.difficulty === 'Sedang' ? 'bg-blue-100 text-blue-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {pack.difficulty}
                    </span>
                  </div>
                </div>

                <h4 className="font-bold text-slate-900 text-lg mb-2 group-hover:text-blue-600 transition-colors">
                  {pack.title}
                </h4>
                <p className="text-sm font-semibold text-slate-500 mb-4">
                  Mata Pelajaran: <span className="text-slate-800 font-bold">{pack.subject}</span>
                </p>

                <div className="grid grid-cols-2 gap-3 py-3 border-y border-slate-100 text-xs text-slate-600 font-medium mb-4">
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-blue-500" />
                    <span>{pack.questions} Butir Soal</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-purple-500" />
                    <span>{pack.time}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button 
                  onClick={() => setDetailPack(pack)}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" /> Preview Soal
                </button>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => handleEdit(pack)}
                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(pack.id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
          {filteredPacks.length === 0 && (
            <div className="col-span-2 glass p-12 rounded-3xl text-center text-slate-500">
              Tidak ada paket soal yang sesuai dengan filter atau kata kunci pencarian.
            </div>
          )}
        </div>
      </div>

      {/* Preview Soal Modal */}
      <AnimatePresence>
        {detailPack && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDetailPack(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/70">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{detailPack.title}</h3>
                  <p className="text-xs text-slate-500 font-medium">{detailPack.subject} • Kelas {detailPack.grade} • {detailPack.questions} Soal</p>
                </div>
                <button 
                  onClick={() => setDetailPack(null)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-200 text-slate-500 hover:bg-slate-300 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-4 flex-1">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                  <p className="text-sm font-bold text-slate-800 mb-2">1. Jika f(x) = 2x^2 + 5x - 3, berapakah nilai turunan f'(2)?</p>
                  <div className="grid grid-cols-2 gap-2 text-xs font-medium text-slate-600">
                    <span className="p-2 bg-white rounded-lg border border-slate-200">A. 11</span>
                    <span className="p-2 bg-emerald-50 rounded-lg border border-emerald-300 text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> B. 13 (Kunci Jawaban)
                    </span>
                    <span className="p-2 bg-white rounded-lg border border-slate-200">C. 15</span>
                    <span className="p-2 bg-white rounded-lg border border-slate-200">D. 17</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                  <p className="text-sm font-bold text-slate-800 mb-2">2. Manakah relasi sudut trigonometri berikut yang bernilai identik dengan sin(90° - A)?</p>
                  <div className="grid grid-cols-2 gap-2 text-xs font-medium text-slate-600">
                    <span className="p-2 bg-emerald-50 rounded-lg border border-emerald-300 text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> A. cos(A) (Kunci Jawaban)
                    </span>
                    <span className="p-2 bg-white rounded-lg border border-slate-200">B. -cos(A)</span>
                    <span className="p-2 bg-white rounded-lg border border-slate-200">C. sin(A)</span>
                    <span className="p-2 bg-white rounded-lg border border-slate-200">D. -sin(A)</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                  <p className="text-sm font-bold text-slate-800 mb-2">3. Suatu barisan geometri memiliki suku pertama 3 dan rasio 2. Suku ke-6 adalah...</p>
                  <div className="grid grid-cols-2 gap-2 text-xs font-medium text-slate-600">
                    <span className="p-2 bg-white rounded-lg border border-slate-200">A. 48</span>
                    <span className="p-2 bg-white rounded-lg border border-slate-200">B. 64</span>
                    <span className="p-2 bg-emerald-50 rounded-lg border border-emerald-300 text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> C. 96 (Kunci Jawaban)
                    </span>
                    <span className="p-2 bg-white rounded-lg border border-slate-200">D. 192</span>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
                <button 
                  onClick={() => setDetailPack(null)}
                  className="px-5 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors text-sm"
                >
                  Tutup Preview
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <BankSoalFormDialog
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        initialData={selectedPack}
      />
    </DashboardLayout>
  );
}
