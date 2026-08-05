import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, Megaphone } from 'lucide-react';
import { Announcement } from '../../store/useDataStore';

interface AnnouncementFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Announcement, 'id'>) => void;
  initialData?: Announcement | null;
}

export function AnnouncementFormDialog({ isOpen, onClose, onSubmit, initialData }: AnnouncementFormDialogProps) {
  const [formData, setFormData] = useState({
    title: '',
    date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
    content: '',
    category: 'Akademik' as 'Akademik' | 'Libur' | 'Ujian' | 'Umum',
    author: 'Admin Sekolah',
    pinned: false,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        date: initialData.date,
        content: initialData.content,
        category: initialData.category,
        author: initialData.author,
        pinned: initialData.pinned || false,
      });
    } else {
      setFormData({
        title: '',
        date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
        content: '',
        category: 'Akademik',
        author: 'Admin Sekolah',
        pinned: false,
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
                <Megaphone className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                {initialData ? 'Edit Pengumuman' : 'Buat Pengumuman Baru'}
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
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Judul Pengumuman *</label>
              <input 
                type="text" 
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Contoh: Pemberitahuan Libur Hari Raya"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Kategori</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 font-medium"
                >
                  <option value="Akademik">Akademik</option>
                  <option value="Ujian">Ujian & Evaluasi</option>
                  <option value="Libur">Libur & Kegiatan</option>
                  <option value="Umum">Informasi Umum</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Penulis / Unit</label>
                <input 
                  type="text"
                  required
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  placeholder="Contoh: Kepala Sekolah / Bagian Akademik"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Isi Pengumuman *</label>
              <textarea 
                rows={4}
                required
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Tuliskan detail pengumuman secara lengkap..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white font-medium resize-none text-sm"
              ></textarea>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input 
                type="checkbox" 
                id="pinned"
                checked={formData.pinned}
                onChange={(e) => setFormData({ ...formData, pinned: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
              />
              <label htmlFor="pinned" className="text-sm font-semibold text-slate-700 cursor-pointer">
                Sematkan di bagian teratas (Pin Announcement)
              </label>
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
                {initialData ? 'Simpan Perubahan' : 'Terbitkan Pengumuman'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
