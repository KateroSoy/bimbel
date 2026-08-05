import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, Award } from 'lucide-react';
import { GradeItem } from '../../store/useDataStore';

interface GradeFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: string, updated: Partial<GradeItem>) => void;
  gradeItem: GradeItem | null;
}

export function GradeFormDialog({ isOpen, onClose, onSubmit, gradeItem }: GradeFormDialogProps) {
  const [tugas, setTugas] = useState<number>(85);
  const [uts, setUts] = useState<number>(85);
  const [uas, setUas] = useState<number>(85);

  useEffect(() => {
    if (gradeItem) {
      setTugas(gradeItem.tugas);
      setUts(gradeItem.uts);
      setUas(gradeItem.uas);
    }
  }, [gradeItem, isOpen]);

  if (!isOpen || !gradeItem) return null;

  const currentFinal = Math.round((tugas * 0.3) + (uts * 0.3) + (uas * 0.4));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(gradeItem.id, { tugas, uts, uas });
    onClose();
  };

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
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        >
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/70">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Input / Edit Nilai Siswa</h3>
                <p className="text-xs text-slate-500 font-medium">{gradeItem.studentName} • {gradeItem.subject}</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-200 text-slate-500 hover:bg-slate-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Nilai Tugas (30%)</label>
                <input 
                  type="number" 
                  min={0}
                  max={100}
                  required
                  value={tugas}
                  onChange={(e) => setTugas(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 font-bold text-center"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Nilai UTS (30%)</label>
                <input 
                  type="number" 
                  min={0}
                  max={100}
                  required
                  value={uts}
                  onChange={(e) => setUts(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 font-bold text-center"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Nilai UAS (40%)</label>
                <input 
                  type="number" 
                  min={0}
                  max={100}
                  required
                  value={uas}
                  onChange={(e) => setUas(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 font-bold text-center"
                />
              </div>
            </div>

            {/* Calculated Preview */}
            <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500">Estimasi Nilai Akhir</p>
                <p className="text-2xl font-black text-blue-700">{currentFinal} / 100</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-slate-500">Predikat</p>
                <span className="px-3 py-1 bg-blue-600 text-white font-extrabold text-sm rounded-lg inline-block">
                  {currentFinal >= 85 ? 'A' : currentFinal >= 75 ? 'B' : currentFinal >= 60 ? 'C' : 'D'}
                </span>
              </div>
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
                className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-md flex items-center gap-2 text-sm"
              >
                <CheckCircle2 className="w-4 h-4" /> Simpan Nilai
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
