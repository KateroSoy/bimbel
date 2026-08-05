import { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { PenTool, Clock, BookOpen, CheckCircle2, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDataStore } from '../../store/useDataStore';

export default function TugasSiswa() {
  const { assignments, submissions } = useDataStore();
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Student is Budi Santoso (1001)
  const studentId = '1001';

  const myTasks = assignments.map((task) => {
    const submission = submissions.find(s => s.assignmentId === task.id && s.studentId === studentId);
    const isSubmitted = !!submission && !!submission.submittedAt;
    const isGraded = submission?.status === 'Dinilai';
    return {
      ...task,
      submission,
      isSubmitted,
      isGraded,
    };
  });

  const filteredTasks = myTasks.filter((t) => {
    const matchQuery = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchFilter = filter === 'all' || 
      (filter === 'completed' && t.isSubmitted) || 
      (filter === 'pending' && !t.isSubmitted);
    return matchQuery && matchFilter;
  });

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-display font-bold text-slate-900 mb-2">Tugas & Evaluasi Belajar</h2>
            <p className="text-slate-500">Kerjakan tugas, kumpulkan dokumen laporan, dan pantau hasil penilaian guru.</p>
          </div>
        </div>

        {/* Search & Tabs */}
        <div className="glass p-4 rounded-2xl border border-white/40 flex flex-col sm:flex-row gap-4 justify-between items-center shadow-sm">
          <div className="flex gap-2 bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
            <button
              onClick={() => setFilter('all')}
              className={`flex-1 sm:flex-none px-5 py-2 rounded-lg font-bold text-xs transition-all ${
                filter === 'all' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Semua ({myTasks.length})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`flex-1 sm:flex-none px-5 py-2 rounded-lg font-bold text-xs transition-all ${
                filter === 'pending' ? 'bg-white text-amber-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Perlu Dikerjakan ({myTasks.filter(t => !t.isSubmitted).length})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`flex-1 sm:flex-none px-5 py-2 rounded-lg font-bold text-xs transition-all ${
                filter === 'completed' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Selesai / Dinilai ({myTasks.filter(t => t.isSubmitted).length})
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama tugas / mapel..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-medium"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((t) => (
            <Link 
              key={t.id} 
              to={`/siswa/tugas/${t.id}`} 
              className="glass p-6 rounded-3xl border border-white/40 shadow-sm flex flex-col hover:shadow-lg hover:-translate-y-1 hover:border-blue-300 transition-all cursor-pointer bg-white group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <PenTool className="w-6 h-6" />
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  t.isGraded ? 'bg-emerald-100 text-emerald-800' :
                  t.isSubmitted ? 'bg-blue-100 text-blue-800' :
                  'text-amber-700 bg-amber-100'
                }`}>
                  {t.isGraded ? `Nilai: ${t.submission?.score}/100` : t.isSubmitted ? 'Sudah Dikumpulkan' : 'Belum Selesai'}
                </span>
              </div>

              <h3 className="font-bold text-lg text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                {t.title}
              </h3>
              
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-4">
                <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                {t.subject} • Kelas {t.kelas}
              </div>
              
              <div className="mt-auto flex items-center justify-between text-xs font-medium text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Tenggat:</span>
                </div>
                <span className="font-bold text-slate-800">
                  {new Date(t.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </Link>
          ))}
          {filteredTasks.length === 0 && (
            <div className="col-span-3 glass p-12 rounded-3xl text-center text-slate-500">
              Tidak ada tugas yang sesuai kriteria pencarian saat ini.
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
