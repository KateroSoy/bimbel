import { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Clock, FileText, Users, Search, PenTool, Edit, Trash2, BookOpen } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import { useDataStore, Assignment } from '../../store/useDataStore';
import { AssignmentFormDialog } from '../../components/common/AssignmentFormDialog';
import { toast } from 'sonner';

export default function ManajemenTugasQuiz() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'tugas' | 'quiz'>(
    location.pathname.includes('quiz') ? 'quiz' : 'tugas'
  );
  const [formOpen, setFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [classFilter, setClassFilter] = useState('');

  const { assignments, addAssignment, updateAssignment, deleteAssignment } = useDataStore();

  useEffect(() => {
    setActiveTab(location.pathname.includes('quiz') ? 'quiz' : 'tugas');
  }, [location.pathname]);

  const handleAdd = () => {
    setIsEditing(false);
    setSelectedAssignment(null);
    setFormOpen(true);
  };

  const handleEdit = (item: Assignment) => {
    setIsEditing(true);
    setSelectedAssignment(item);
    setFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus evaluasi ini?')) {
      deleteAssignment(id);
      toast.success('Evaluasi berhasil dihapus');
    }
  };

  const handleSubmit = (data: Omit<Assignment, 'id'>) => {
    if (isEditing && selectedAssignment) {
      updateAssignment(selectedAssignment.id, data);
      toast.success(`${data.type === 'tugas' ? 'Tugas' : 'Quiz'} berhasil diperbarui`);
    } else {
      addAssignment(data);
      toast.success(`${data.type === 'tugas' ? 'Tugas' : 'Quiz'} baru berhasil dibuat & diterbitkan`);
    }
  };

  const currentData = assignments.filter((item) => {
    const matchType = item.type === activeTab;
    const matchQuery = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchClass = !classFilter || item.kelas === classFilter;
    return matchType && matchQuery && matchClass;
  });

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-display font-bold text-slate-900 mb-2">
              Manajemen {activeTab === 'tugas' ? 'Penugasan' : 'Quiz & Evaluasi'}
            </h2>
            <p className="text-slate-500">
              Kelola penugasan, ulangan harian, dan pantau progress pengumpulan siswa.
            </p>
          </div>
          
          <button 
            onClick={handleAdd}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-md hover:bg-blue-700 transition-colors flex items-center gap-2 active:scale-95"
          >
            <Plus className="w-5 h-5" />
            Buat {activeTab === 'tugas' ? 'Tugas' : 'Quiz'} Baru
          </button>
        </div>

        {/* Tabs & Search */}
        <div className="glass p-4 rounded-2xl border border-white/40 flex flex-col md:flex-row gap-4 shadow-sm justify-between items-center">
          <div className="flex gap-2 bg-slate-100 p-1 rounded-xl w-full md:w-auto">
            <button
              onClick={() => setActiveTab('tugas')}
              className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg font-bold text-sm transition-all ${
                activeTab === 'tugas' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
              }`}
            >
              Penugasan Siswa
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg font-bold text-sm transition-all ${
                activeTab === 'quiz' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
              }`}
            >
              Quiz & Ulangan
            </button>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Cari ${activeTab}...`}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium shadow-sm"
              />
            </div>
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium text-slate-700"
            >
              <option value="">Semua Kelas</option>
              <option value="X IPA 1">X IPA 1</option>
              <option value="X IPA 2">X IPA 2</option>
              <option value="X IPS 1">X IPS 1</option>
              <option value="XI IPA 3">XI IPA 3</option>
            </select>
          </div>
        </div>

        {/* Data Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {currentData.map((item, index) => (
              <motion.div
                key={`${activeTab}-${item.id}`}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="glass rounded-3xl border border-white/40 overflow-hidden hover:shadow-xl transition-all group flex flex-col bg-white"
              >
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-2xl ${
                      activeTab === 'tugas' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
                    }`}>
                      {activeTab === 'tugas' ? <PenTool className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      item.status === 'Aktif' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {item.status}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-lg leading-tight mb-2 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>
                  
                  <div className="flex items-center gap-3 text-xs text-slate-500 font-semibold mb-5">
                    <span className="flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-lg text-slate-700">
                      <Users className="w-3.5 h-3.5" />
                      {item.kelas}
                    </span>
                    <span className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg font-bold">
                      <BookOpen className="w-3.5 h-3.5" />
                      {item.subject}
                    </span>
                  </div>

                  <div className="mt-auto space-y-4">
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                        <Clock className="w-3.5 h-3.5" />
                        Tenggat Waktu
                      </div>
                      <p className="text-xs font-bold text-slate-700">
                        {new Date(item.deadline).toLocaleDateString('id-ID', {
                          weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </p>
                    </div>

                    <div>
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-xs font-bold text-slate-500">Progress Pengumpulan</span>
                        <span className="text-sm font-bold text-slate-900">{item.submitted}/{item.total} Siswa</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div 
                          className={`h-2 rounded-full transition-all duration-1000 ${
                            item.submitted >= item.total ? 'bg-emerald-500' : 'bg-blue-500'
                          }`}
                          style={{ width: `${Math.min(100, (item.submitted / item.total) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex gap-2">
                  <Link 
                    to={`/guru/tugas/${item.id}`} 
                    className="flex-1 py-2.5 flex items-center justify-center bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-50 transition-colors shadow-sm"
                  >
                    Periksa & Nilai Siswa
                  </Link>
                  <button 
                    onClick={() => handleEdit(item)}
                    className="w-10 flex items-center justify-center bg-white border border-slate-200 text-slate-400 rounded-xl hover:text-blue-600 hover:bg-slate-50 transition-colors shadow-sm"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="w-10 flex items-center justify-center bg-white border border-slate-200 text-slate-400 rounded-xl hover:text-red-600 hover:bg-slate-50 transition-colors shadow-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {currentData.length === 0 && (
            <div className="col-span-3 glass p-12 rounded-3xl text-center text-slate-500">
              Tidak ada {activeTab} yang ditemukan sesuai kriteria pencarian.
            </div>
          )}
        </div>
      </div>

      <AssignmentFormDialog
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        initialData={selectedAssignment}
        defaultType={activeTab}
      />
    </DashboardLayout>
  );
}
