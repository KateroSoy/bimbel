import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, Award, FileText, Download } from 'lucide-react';
import { Submission } from '../../store/useDataStore';
import { toast } from 'sonner';

interface GradingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (submissionId: string, score: number, feedback: string) => void;
  submission: Submission | null;
}

export function GradingDialog({ isOpen, onClose, onSubmit, submission }: GradingDialogProps) {
  const [score, setScore] = useState<number>(85);
  const [feedback, setFeedback] = useState<string>('');

  useEffect(() => {
    if (submission) {
      setScore(submission.score ?? 85);
      setFeedback(submission.feedback || 'Kerja bagus, materi dipahami dengan baik.');
    }
  }, [submission]);

  if (!isOpen || !submission) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(submission.id, score, feedback);
    toast.success(`Nilai untuk ${submission.studentName} berhasil disimpan (${score}/100)`);
    onClose();
  };

  const presetScores = [100, 95, 90, 85, 80, 75];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        >
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/70">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Beri Nilai & Evaluasi</h3>
                <p className="text-xs text-slate-500 font-medium">{submission.studentName} ({submission.studentNis})</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-200 text-slate-500 hover:bg-slate-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {submission.fileName && (
              <div className="p-3.5 bg-blue-50/60 border border-blue-100 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-bold text-slate-800">{submission.fileName}</p>
                    <p className="text-xs text-slate-500">Dikumpulkan: {submission.submittedAt || 'Tepat Waktu'}</p>
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={() => toast.info(`Membuka berkas: ${submission.fileName}`)}
                  className="p-2 bg-white text-blue-600 hover:bg-blue-100 rounded-lg transition-colors text-xs font-bold flex items-center gap-1 border border-blue-200"
                >
                  <Download className="w-3.5 h-3.5" /> Unduh
                </button>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Nilai Akhir (0 - 100) *
              </label>
              <div className="flex items-center gap-3">
                <input 
                  type="number" 
                  min={0}
                  max={100}
                  required
                  value={score}
                  onChange={(e) => setScore(Number(e.target.value))}
                  className="w-32 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-2xl font-bold text-emerald-600 text-center bg-slate-50 focus:bg-white"
                />
                <div className="flex flex-wrap gap-1.5 flex-1">
                  {presetScores.map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setScore(val)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        score === val 
                          ? 'bg-emerald-600 text-white shadow-sm' 
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Catatan Guru & Umpan Balik (Feedback)
              </label>
              <textarea 
                rows={3}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Tuliskan catatan apresiasi atau saran perbaikan untuk siswa..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 focus:bg-white font-medium resize-none text-sm"
              ></textarea>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
              <button 
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-colors text-sm"
              >
                Batal
              </button>
              <button 
                type="submit"
                className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-md flex items-center gap-2 text-sm"
              >
                <CheckCircle2 className="w-4 h-4" />
                Simpan Penilaian
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
