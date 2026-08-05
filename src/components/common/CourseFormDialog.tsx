import { useState, useEffect } from 'react';
import { BookOpen, Sparkles, User, Layers, Star, Users, AlignLeft, Video, Image as ImageIcon, FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Course } from '../../store/useDataStore';

interface CourseFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (course: Omit<Course, 'id'>) => void;
  initialData?: Course | null;
}

export function CourseFormDialog({ isOpen, onClose, onSubmit, initialData }: CourseFormDialogProps) {
  const [formData, setFormData] = useState({
    title: '',
    category: 'MIPA',
    status: 'Aktif' as 'Aktif' | 'Nonaktif' | 'Draft' | 'Published',
    instructor: 'Drs. Ahmad Yani (Tentor Master)',
    students: 32,
    rating: 4.9,
    lessons: 8,
    description: '',
    videoUrl: 'https://www.youtube.com/watch?v=kqtD5dpn9C8',
    imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1200&auto=format&fit=crop',
    docName: 'Modul_Pembelajaran_Intensif.pdf',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        category: initialData.category || 'MIPA',
        status: (initialData.status as any) || 'Aktif',
        instructor: initialData.instructor || '',
        students: initialData.students || 0,
        rating: initialData.rating || 4.9,
        lessons: initialData.lessons || 6,
        description: initialData.description || '',
        videoUrl: initialData.videoUrl || 'https://www.youtube.com/watch?v=kqtD5dpn9C8',
        imageUrl: initialData.images?.[0] || 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1200&auto=format&fit=crop',
        docName: initialData.documents?.[0]?.name || 'Modul_Pembelajaran_Intensif.pdf',
      });
    } else {
      setFormData({
        title: '',
        category: 'MIPA',
        status: 'Aktif',
        instructor: 'Drs. Ahmad Yani (Tentor Master)',
        students: 32,
        rating: 4.9,
        lessons: 8,
        description: '',
        videoUrl: 'https://www.youtube.com/watch?v=kqtD5dpn9C8',
        imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1200&auto=format&fit=crop',
        docName: 'Modul_Pembelajaran_Intensif.pdf',
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rating' ? parseFloat(value) || 0 :
              name === 'students' || name === 'lessons' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title: formData.title,
      category: formData.category,
      status: formData.status,
      instructor: formData.instructor,
      students: formData.students,
      rating: formData.rating,
      lessons: formData.lessons,
      description: formData.description,
      videoUrl: formData.videoUrl,
      images: [formData.imageUrl],
      documents: [
        {
          id: `DOC-${Date.now()}`,
          name: formData.docName,
          type: formData.docName.endsWith('.docx') ? 'docx' : 'pdf',
          size: '3.2 MB',
          url: '#'
        }
      ]
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[560px] p-0 overflow-hidden bg-white border-none rounded-3xl shadow-2xl">
        <DialogHeader className="p-6 pb-5 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100/60 text-blue-600 rounded-2xl shadow-sm border border-blue-100">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-slate-900">
                {initialData ? 'Edit Course & Modul Bimbel' : 'Tambah Course & Modul Baru'}
              </DialogTitle>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                {initialData ? 'Perbarui informasi modul & media pembelajaran' : 'Masukkan rincian materi, video YouTube, infografis & lampiran dokumen'}
              </p>
            </div>
          </div>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-blue-600" /> Judul Course / Modul Bimbel *
              </label>
              <input 
                required 
                name="title" 
                value={formData.title} 
                onChange={handleChange} 
                placeholder="Contoh: Fisika Kuantum & Mekanika UTBK"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all placeholder:text-slate-400 font-medium text-slate-900 text-sm" 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-blue-600" /> Kategori / Rumpun
                </label>
                <select 
                  name="category" 
                  value={formData.category} 
                  onChange={handleChange} 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-medium text-slate-900 text-sm"
                >
                  <option value="MIPA">MIPA / Saintek</option>
                  <option value="Bahasa">Bahasa & TOEFL</option>
                  <option value="IPS">IPS / Soshum</option>
                  <option value="TPS">TPS & Skolastik</option>
                  <option value="Kedinasan">Kedinasan & SKD</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Status Publikasi
                </label>
                <select 
                  name="status" 
                  value={formData.status} 
                  onChange={handleChange} 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-medium text-slate-900 text-sm"
                >
                  <option value="Aktif">Aktif (Published)</option>
                  <option value="Draft">Draft</option>
                  <option value="Nonaktif">Nonaktif</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-blue-600" /> Tentor / Tutor Pengampu *
              </label>
              <input 
                required 
                name="instructor" 
                value={formData.instructor} 
                onChange={handleChange} 
                placeholder="Contoh: Drs. Ahmad Yani (Tentor Master)"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all placeholder:text-slate-400 font-medium text-slate-900 text-sm" 
              />
            </div>

            {/* Rich Media Fields */}
            <div className="pt-2 border-t border-slate-100 space-y-3">
              <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Video className="w-4 h-4 text-rose-500" /> Media Interaktif (YouTube, Gambar & Berkas)
              </p>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Link Video YouTube (Watch / Embed URL)
                </label>
                <input 
                  name="videoUrl" 
                  value={formData.videoUrl} 
                  onChange={handleChange} 
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-xs font-mono text-slate-800" 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1 flex items-center gap-1">
                    <ImageIcon className="w-3.5 h-3.5 text-blue-500" /> Link Gambar / Cover
                  </label>
                  <input 
                    name="imageUrl" 
                    value={formData.imageUrl} 
                    onChange={handleChange} 
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-xs" 
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1 flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-emerald-500" /> Lampiran (PDF/DOCX)
                  </label>
                  <input 
                    name="docName" 
                    value={formData.docName} 
                    onChange={handleChange} 
                    placeholder="Nama_Modul_Bimbel.pdf"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-xs" 
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-blue-600" /> Sesi Modul
                </label>
                <input 
                  type="number" 
                  min="1" 
                  required 
                  name="lessons" 
                  value={formData.lessons} 
                  onChange={handleChange} 
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none font-medium text-slate-900 text-sm" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-blue-600" /> Siswa Aktif
                </label>
                <input 
                  type="number" 
                  min="0" 
                  required 
                  name="students" 
                  value={formData.students} 
                  onChange={handleChange} 
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none font-medium text-slate-900 text-sm" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-500" /> Rating
                </label>
                <input 
                  type="number" 
                  step="0.1" 
                  max="5.0" 
                  min="1.0" 
                  required 
                  name="rating" 
                  value={formData.rating} 
                  onChange={handleChange} 
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none font-medium text-slate-900 text-sm" 
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <AlignLeft className="w-3.5 h-3.5 text-blue-600" /> Deskripsi Singkat Course
              </label>
              <textarea 
                name="description" 
                rows={2}
                value={formData.description} 
                onChange={handleChange} 
                placeholder="Rangkuman materi, capaian pembelajaran, dan silabus bimbel..."
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all placeholder:text-slate-400 font-medium text-slate-900 text-sm resize-none" 
              />
            </div>
          </div>
          
          <div className="p-4 px-6 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold transition-all text-xs"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-md shadow-blue-600/20 active:scale-95 text-xs"
            >
              {initialData ? 'Simpan Perubahan' : 'Terbitkan Course'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
