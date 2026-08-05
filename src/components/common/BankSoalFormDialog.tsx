import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, BookOpen } from 'lucide-react';
import { QuestionPack } from '../../store/useDataStore';

interface BankSoalFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<QuestionPack, 'id'>) => void;
  initialData?: QuestionPack | null;
}

export function BankSoalFormDialog({ isOpen, onClose, onSubmit, initialData }: BankSoalFormDialogProps) {
  const [formData, setFormData] = useState({
    title: '',
    subject: 'Matematika',
    grade: 'X',
    questions: 40,
    time: '90 Menit',
    difficulty: 'Sedang' as 'Mudah' | 'Sedang' | 'Sulit',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        subject: initialData.subject,
        grade: initialData.grade,
        questions: initialData.questions,
        time: initialData.time,
        difficulty: initialData.difficulty,
      });
    } else {
      setFormData({
        title: '',
        subject: 'Matematika',
        grade: 'X',
        questions: 40,
        time: '90 Menit',
        difficulty: 'Sedang',
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
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
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        >
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/70">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                {initialData ? 'Edit Paket Soal' : 'Buat Paket Soal Baru'}
              </h3>
            </div>
            <button 
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-200 text-slate-500 hover:bg-slate-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Judul Paket Soal *</label>
              <input 
                type="text" 
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Contoh: Tryout UTBK Saintek 2024"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Mata Pelajaran</label>
                <select 
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 font-medium"
                >
                  <option value="Matematika">Matematika</option>
                  <option value="Bahasa Indonesia">Bahasa Indonesia</option>
                  <option value="Bahasa Inggris">Bahasa Inggris</option>
                  <option value="IPA / Fisika">IPA / Fisika</option>
                  <option value="IPS / Ekonomi">IPS / Ekonomi</option>
                  <option value="Umum / Campuran">Umum / Campuran</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Tingkat Kelas</label>
                <select 
                  value={formData.grade}
                  onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 font-medium"
                >
                  <option value="X">Kelas X</option>
                  <option value="XI">Kelas XI</option>
                  <option value="XII">Kelas XII</option>
                  <option value="Alumni">Alumni / UTBK</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Jml Butir Soal</label>
                <input 
                  type="number" 
                  min={5}
                  max={200}
                  required
                  value={formData.questions}
                  onChange={(e) => setFormData({ ...formData, questions: Number(e.target.value) })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Estimasi Waktu</label>
                <input 
                  type="text" 
                  required
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  placeholder="90 Menit"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Tingkat Kesulitan</label>
                <select 
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as 'Mudah' | 'Sedang' | 'Sulit' })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 font-medium"
                >
                  <option value="Mudah">Mudah</option>
                  <option value="Sedang">Sedang</option>
                  <option value="Sulit">Sulit</option>
                </select>
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
                <CheckCircle2 className="w-4 h-4" />
                {initialData ? 'Simpan Perubahan' : 'Simpan Paket Soal'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
