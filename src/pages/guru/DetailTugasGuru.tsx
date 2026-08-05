import { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { ChevronLeft, CheckCircle2, Clock, Users, Search, Download, Award, FileText } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useDataStore, Submission } from '../../store/useDataStore';
import { GradingDialog } from '../../components/common/GradingDialog';
import { toast } from 'sonner';

export default function DetailTugasGuru() {
  const { id } = useParams<{ id: string }>();
  const { assignments, submissions, gradeSubmission } = useDataStore();
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [gradingOpen, setGradingOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Find assignment or take the first one as fallback
  const assignment = assignments.find((a) => a.id === id) || assignments[0] || {
    id: '1',
    title: 'Makalah Sejarah Kemerdekaan',
    kelas: 'X IPA 1',
    subject: 'Sejarah',
    deadline: '2024-11-25T23:59',
    description: 'Buat makalah sejarah...',
    submitted: 28,
    total: 32,
    status: 'Aktif' as const,
    type: 'tugas' as const
  };

  const taskSubmissions = submissions.filter((s) => s.assignmentId === assignment.id || !s.assignmentId);

  const filteredSubmissions = taskSubmissions.filter((s) => 
    s.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.studentNis.includes(searchQuery)
  );

  const gradedCount = taskSubmissions.filter((s) => s.status === 'Dinilai').length;
  const pendingCount = taskSubmissions.filter((s) => s.status === 'Perlu Dinilai').length;

  const handleOpenGrading = (sub: Submission) => {
    setSelectedSubmission(sub);
    setGradingOpen(true);
  };

  const handleGradeSubmit = (submissionId: string, score: number, feedback: string) => {
    gradeSubmission(submissionId, score, feedback);
  };

  const handleExport = () => {
    toast.success(`Daftar nilai untuk ${assignment.title} berhasil diekspor ke Excel`);
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/guru/tugas" className="p-2.5 hover:bg-slate-100 rounded-xl transition-colors bg-white border border-slate-200 shadow-sm">
            <ChevronLeft className="w-6 h-6 text-slate-600" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-blue-100 text-blue-700 uppercase">
                {assignment.type === 'tugas' ? 'Penugasan' : 'Quiz'}
              </span>
              <span className="text-xs font-semibold text-slate-500">{assignment.subject}</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900">{assignment.title}</h2>
            <p className="text-slate-500 text-sm font-medium">Kelas {assignment.kelas}</p>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="glass p-6 rounded-3xl border border-white/40 shadow-sm flex flex-col gap-2">
            <div className="flex items-center gap-3 text-slate-600 mb-1">
              <Users className="w-5 h-5 text-blue-600" />
              <span className="font-bold text-sm">Total Terkumpul</span>
            </div>
            <p className="text-3xl font-bold text-slate-900">
              {taskSubmissions.filter(s => s.submittedAt).length}{' '}
              <span className="text-sm text-slate-500 font-medium">/ {assignment.total} Siswa</span>
            </p>
          </div>
          
          <div className="glass p-6 rounded-3xl border border-white/40 shadow-sm flex flex-col gap-2">
            <div className="flex items-center gap-3 text-slate-600 mb-1">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span className="font-bold text-sm">Sudah Dinilai</span>
            </div>
            <p className="text-3xl font-bold text-emerald-600">{gradedCount}</p>
          </div>

          <div className="glass p-6 rounded-3xl border border-white/40 shadow-sm flex flex-col gap-2">
            <div className="flex items-center gap-3 text-slate-600 mb-1">
              <Award className="w-5 h-5 text-amber-500" />
              <span className="font-bold text-sm">Perlu Dinilai</span>
            </div>
            <p className="text-3xl font-bold text-amber-600">{pendingCount}</p>
          </div>

          <div className="glass p-6 rounded-3xl border border-white/40 shadow-sm flex flex-col gap-2">
            <div className="flex items-center gap-3 text-slate-600 mb-1">
              <Clock className="w-5 h-5 text-indigo-600" />
              <span className="font-bold text-sm">Tenggat Waktu</span>
            </div>
            <p className="text-sm font-bold text-slate-900 mt-1">
              {new Date(assignment.deadline).toLocaleDateString('id-ID', {
                day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
              })}
            </p>
          </div>
        </div>

        {/* Submissions List */}
        <div className="glass p-6 rounded-3xl border border-white/40 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="font-bold text-lg text-slate-900">Daftar Pengumpulan Siswa</h3>
              <p className="text-xs text-slate-500">Klik tombol Beri Nilai untuk memeriksa berkas dan memasukkan skor.</p>
            </div>
            
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari nama atau NIS..."
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
                />
              </div>
              <button 
                onClick={handleExport}
                className="p-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-1 text-xs font-bold"
              >
                <Download className="w-4 h-4" /> Export
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="p-4 font-bold text-slate-700 text-xs uppercase tracking-wider">Nama Siswa</th>
                  <th className="p-4 font-bold text-slate-700 text-xs uppercase tracking-wider">Waktu Kumpul</th>
                  <th className="p-4 font-bold text-slate-700 text-xs uppercase tracking-wider">Berkas Lampiran</th>
                  <th className="p-4 font-bold text-slate-700 text-xs uppercase tracking-wider">Status</th>
                  <th className="p-4 font-bold text-slate-700 text-xs uppercase tracking-wider">Nilai</th>
                  <th className="p-4 font-bold text-slate-700 text-xs uppercase tracking-wider text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubmissions.map((s) => (
                  <tr key={s.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 font-medium text-slate-900">
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{s.studentName}</p>
                        <p className="text-xs text-slate-400 font-mono">NIS: {s.studentNis}</p>
                      </div>
                    </td>
                    <td className="p-4 text-slate-600 text-xs font-medium">{s.submittedAt || '-'}</td>
                    <td className="p-4 text-slate-600 text-xs">
                      {s.fileName ? (
                        <span className="flex items-center gap-1 text-blue-600 font-medium">
                          <FileText className="w-3.5 h-3.5" /> {s.fileName}
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        s.status === 'Dinilai' ? 'bg-emerald-100 text-emerald-700' :
                        s.status === 'Perlu Dinilai' ? 'bg-amber-100 text-amber-700' :
                        'bg-rose-100 text-rose-700'
                      }`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-slate-900">
                      {s.score !== null ? (
                        <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg text-sm">{s.score}/100</span>
                      ) : '-'}
                    </td>
                    <td className="p-4 text-right">
                      {s.status !== 'Belum Mengumpulkan' ? (
                        <button 
                          onClick={() => handleOpenGrading(s)}
                          className="px-4 py-1.5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors text-xs shadow-sm"
                        >
                          {s.status === 'Dinilai' ? 'Ubah Nilai' : 'Beri Nilai'}
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Belum Ada Berkas</span>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredSubmissions.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500">
                      Tidak ada pengumpulan yang sesuai dengan pencarian.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <GradingDialog
        isOpen={gradingOpen}
        onClose={() => setGradingOpen(false)}
        onSubmit={handleGradeSubmit}
        submission={selectedSubmission}
      />
    </DashboardLayout>
  );
}
