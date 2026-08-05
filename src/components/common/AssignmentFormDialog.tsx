import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, FileText, PenTool } from 'lucide-react';
import { Assignment } from '../../store/useDataStore';

interface AssignmentFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Assignment, 'id'>) => void;
  initialData?: Assignment | null;
  defaultType?: 'tugas' | 'quiz';
}

export function AssignmentFormDialog({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  defaultType = 'tugas',
}: AssignmentFormDialogProps) {
  const [formData, setFormData] = useState({
    title: '',
    type: defaultType as 'tugas' | 'quiz',
    kelas: 'X IPA 1',
    subject: 'Matematika',
    deadline: '',
    description: '',
    submitted: 0,
    total: 32,
    status: 'Aktif' as 'Aktif' | 'Selesai',
    duration: 60,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        type: initialData.type,
        kelas: initialData.kelas,
        subject: initialData.subject || 'Umum',
        deadline: initialData.deadline,
        description: initialData.description,
        submitted: initialData.submitted,
        total: initialData.total,
        status: initialData.status,
        duration: initialData.duration || 60,
      });
    } else {
      setFormData({
        title: '',
        type: defaultType,
        kelas: 'X IPA 1',
        subject: 'Matematika',
        deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
        description: '',
        submitted: 0,
        total: 32,
        status: 'Aktif',
        duration: 60,
      });
    }
  }, [initialData, defaultType, isOpen]);

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
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/70">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                {formData.type === 'tugas' ? <PenTool className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                {initialData ? `Edit ${formData.type === 'tugas' ? 'Tugas' : 'Quiz'}` : `Buat ${formData.type === 'tugas' ? 'Tugas' : 'Quiz'} Baru`}
              </h3>
            </div>
            <button 
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-200 text-slate-500 hover:bg-slate-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
            <div className="p-6 overflow-y-auto flex-1 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Tipe Evaluasi</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as 'tugas' | 'quiz' })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 font-medium"
                  >
                    <option value="tugas">Penugasan / Tugas</option>
                    <option value="quiz">Quiz / Ulangan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Aktif' | 'Selesai' })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 font-medium"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Selesai">Selesai</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Judul {formData.type === 'tugas' ? 'Tugas' : 'Quiz'} *</label>
                <input 
                  type="text" 
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Contoh: Makalah Analisis Sejarah Kemerdekaan"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white font-medium"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Kelas Sasaran</label>
                  <select 
                    value={formData.kelas}
                    onChange={(e) => setFormData({ ...formData, kelas: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 font-medium"
                  >
                    <option value="X IPA 1">X IPA 1</option>
                    <option value="X IPA 2">X IPA 2</option>
                    <option value="X IPS 1">X IPS 1</option>
                    <option value="XI IPA 3">XI IPA 3</option>
                    <option value="Semua Kelas">Semua Kelas</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Mata Pelajaran</label>
                  <input 
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Contoh: Matematika / Sejarah"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Tenggat Waktu (Deadline) *</label>
                  <input 
                    type="datetime-local" 
                    required
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 font-medium"
                  />
                </div>
                {formData.type === 'quiz' && (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Durasi Pengerjaan (Menit)</label>
                    <input 
                      type="number"
                      min={10}
                      max={180}
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 font-medium"
                    />
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Instruksi & Panduan Pengerjaan</label>
                <textarea 
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Tuliskan petunjuk pengerjaan, format berkas, kriteria penilaian..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white font-medium resize-none"
                ></textarea>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
              <button 
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-colors"
              >
                Batal
              </button>
              <button 
                type="submit"
                className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-md flex items-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                {initialData ? 'Simpan Perubahan' : 'Terbitkan Sekarang'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
