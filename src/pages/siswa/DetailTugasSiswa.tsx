import { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { motion } from 'motion/react';
import { Clock, Calendar, CheckCircle2, FileText, Upload, ChevronLeft, Award, FileCheck } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useDataStore } from '../../store/useDataStore';
import { toast } from 'sonner';

export default function DetailTugasSiswa() {
  const { id } = useParams<{ id: string }>();
  const { assignments, submissions, addSubmission } = useDataStore();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [simulatedFileName, setSimulatedFileName] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const studentId = '1001';
  const studentName = 'Budi Santoso';
  const studentNis = '1001';

  const assignment = assignments.find((a) => a.id === id) || assignments[0] || {
    id: '1',
    title: 'Makalah Sejarah Kemerdekaan',
    kelas: 'X IPA 1',
    subject: 'Sejarah',
    deadline: '2024-11-25T23:59',
    description: 'Buatlah makalah tentang peristiwa penting menjelang proklamasi kemerdekaan RI 1945.',
    submitted: 28,
    total: 32,
    status: 'Aktif' as const,
    type: 'tugas' as const,
  };

  const currentSubmission = submissions.find(
    (s) => s.assignmentId === assignment.id && s.studentId === studentId
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setSimulatedFileName(e.target.files[0].name);
    }
  };

  const handleSimulateSelect = () => {
    setSimulatedFileName(`Tugas_${assignment.subject.replace(/\s+/g, '_')}_Budi_Santoso.pdf`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fileName = simulatedFileName || selectedFile?.name || `Tugas_${assignment.subject}_Budi.pdf`;
    setIsSubmitting(true);

    setTimeout(() => {
      addSubmission({
        assignmentId: assignment.id,
        studentId,
        studentName,
        studentNis,
        submittedAt: new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }),
        status: 'Perlu Dinilai',
        score: null,
        fileName,
      });
      setIsSubmitting(false);
      toast.success('Tugas berhasil dikumpulkan dan dikirim ke guru!');
    }, 800);
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Link 
            to="/siswa/tugas" 
            className="flex items-center gap-1.5 text-sm font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-4 py-2 rounded-xl transition-colors shadow-sm"
          >
            <ChevronLeft className="w-4 h-4" /> Kembali ke Daftar
          </Link>
          <h2 className="text-2xl font-bold text-slate-900">Detail Evaluasi</h2>
        </div>

        <div className="glass p-8 rounded-3xl border border-white/40 shadow-sm space-y-6 relative overflow-hidden bg-white">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-bl-[100px] pointer-events-none"></div>
          
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold mb-3 border ${
                currentSubmission?.status === 'Dinilai' 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                  : currentSubmission?.submittedAt 
                  ? 'bg-blue-50 text-blue-700 border-blue-200' 
                  : 'bg-amber-50 text-amber-600 border-amber-100'
              }`}>
                {currentSubmission?.status === 'Dinilai' ? (
                  <>
                    <Award className="w-4 h-4 text-emerald-600" />
                    Sudah Dinilai ({currentSubmission.score}/100)
                  </>
                ) : currentSubmission?.submittedAt ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    Sudah Dikumpulkan
                  </>
                ) : (
                  <>
                    <Clock className="w-4 h-4" />
                    Belum Dikumpulkan
                  </>
                )}
              </span>
              <h1 className="text-3xl font-display font-bold text-slate-900 mb-2">{assignment.title}</h1>
              <p className="text-slate-500 font-medium">Mata Pelajaran: <span className="text-slate-800 font-bold">{assignment.subject}</span> • Kelas {assignment.kelas}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status Pengerjaan</p>
                <p className="font-semibold text-slate-700">{currentSubmission?.submittedAt ? 'Telah Diserahkan' : 'Menunggu Pengumpulan'}</p>
              </div>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Batas Waktu (Deadline)</p>
                <p className="font-semibold text-rose-600">
                  {new Date(assignment.deadline).toLocaleDateString('id-ID', {
                    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100">
            <h3 className="font-bold text-lg text-slate-900 mb-2">Instruksi & Panduan Pengerjaan</h3>
            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-2xl border border-slate-100">
              {assignment.description || 'Kerjakan tugas sesuai dengan petunjuk yang telah dijelaskan oleh guru di kelas.'}
            </p>
          </div>

          {/* Feedback Section if Graded */}
          {currentSubmission?.status === 'Dinilai' && (
            <div className="p-5 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-800 font-bold">
                  <Award className="w-5 h-5 text-emerald-600" />
                  Hasil Penilaian Guru
                </div>
                <span className="text-2xl font-black text-emerald-700 bg-white px-4 py-1 rounded-xl shadow-sm border border-emerald-100">
                  {currentSubmission.score} / 100
                </span>
              </div>
              {currentSubmission.feedback && (
                <p className="text-sm text-emerald-900 font-medium">
                  <strong>Catatan Guru:</strong> "{currentSubmission.feedback}"
                </p>
              )}
            </div>
          )}

          {/* Upload Submission Box */}
          <div className="pt-6 border-t border-slate-100">
            <h3 className="font-bold text-lg text-slate-900 mb-3">
              {currentSubmission?.submittedAt ? 'Berkas yang Telah Dikumpulkan' : 'Kumpulkan Tugas'}
            </h3>

            {currentSubmission?.submittedAt ? (
              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-600 text-white rounded-xl">
                    <FileCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{currentSubmission.fileName || 'Tugas_Kemerdekaan_Budi.pdf'}</p>
                    <p className="text-xs text-slate-500">Diserahkan pada: {currentSubmission.submittedAt}</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold">
                  Tersimpan di Server
                </span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div 
                  onClick={handleSimulateSelect}
                  className="border-2 border-dashed border-slate-300 rounded-3xl p-8 flex flex-col items-center justify-center text-center bg-slate-50/50 hover:bg-blue-50/30 hover:border-blue-400 transition-all cursor-pointer"
                >
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                    <Upload className="w-7 h-7" />
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm mb-1">
                    {simulatedFileName ? simulatedFileName : 'Klik di sini untuk memilih berkas tugas (PDF / DOCX)'}
                  </h4>
                  <p className="text-xs text-slate-500">Maksimal ukuran file: 20 MB</p>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-md flex items-center gap-2 disabled:opacity-50 text-sm"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    {isSubmitting ? 'Mengirim Tugas...' : 'Kumpulkan Tugas Sekarang'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
