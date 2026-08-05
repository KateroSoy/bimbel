import { useState, useEffect } from 'react';
import { UserPlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Student } from '../../store/useDataStore';

interface StudentFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (student: Omit<Student, 'id'>) => void;
  initialData?: Student | null;
}

export function StudentFormDialog({ isOpen, onClose, onSubmit, initialData }: StudentFormDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    grade: '',
    status: 'Aktif',
    gpa: 0,
    email: '',
    phone: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({ ...initialData });
    } else {
      setFormData({
        name: '',
        grade: '',
        status: 'Aktif',
        gpa: 0,
        email: '',
        phone: '',
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'gpa' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden bg-white border-none rounded-3xl shadow-2xl">
        <DialogHeader className="p-6 pb-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100/50 text-blue-600 rounded-2xl shadow-sm border border-blue-100">
              <UserPlus className="w-6 h-6" />
            </div>
            <div>
              
          <DialogTitle className="text-xl font-bold text-slate-900">
            {initialData ? 'Edit Siswa' : 'Tambah Siswa Baru'}
          </DialogTitle>
        
              <p className="text-sm text-slate-500 mt-1 font-medium">{initialData ? 'Perbarui informasi data yang sudah ada' : 'Masukkan informasi data baru di bawah ini'}</p>
            </div>
          </div>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Nama Lengkap</label>
              <input required name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all placeholder:text-slate-400 font-medium text-slate-900" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Kelas</label>
              <input required name="grade" value={formData.grade} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all placeholder:text-slate-400 font-medium text-slate-900" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all font-medium text-slate-900">
                <option value="Aktif">Aktif</option>
                <option value="Nonaktif">Nonaktif</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">IPK</label>
              <input type="number" step="0.1" max="4.0" min="0" required name="gpa" value={formData.gpa} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all placeholder:text-slate-400 font-medium text-slate-900" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
              <input type="email" required name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all placeholder:text-slate-400 font-medium text-slate-900" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">No. HP</label>
              <input required name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all placeholder:text-slate-400 font-medium text-slate-900" />
            </div>
          </div>
          <div className="p-6 pt-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-6 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-all">Batal</button>
            <button type="submit" className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all active:scale-95">Simpan</button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
