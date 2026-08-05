import { useState, useEffect } from 'react';
import { School } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Classroom } from '../../store/useDataStore';

interface ClassroomFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (classroom: Omit<Classroom, 'id'>) => void;
  initialData?: Classroom | null;
}

export function ClassroomFormDialog({ isOpen, onClose, onSubmit, initialData }: ClassroomFormDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    wali: '',
    students: 0,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({ ...initialData });
    } else {
      setFormData({
        name: '',
        wali: '',
        students: 0,
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'students' ? parseInt(value) || 0 : value
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
              <School className="w-6 h-6" />
            </div>
            <div>
              
          <DialogTitle className="text-xl font-bold text-slate-900">
            {initialData ? 'Edit Kelas' : 'Tambah Kelas Baru'}
          </DialogTitle>
        
              <p className="text-sm text-slate-500 mt-1 font-medium">{initialData ? 'Perbarui informasi data yang sudah ada' : 'Masukkan informasi data baru di bawah ini'}</p>
            </div>
          </div>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Nama Kelas</label>
              <input required name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all placeholder:text-slate-400 font-medium text-slate-900" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Wali Kelas</label>
              <input required name="wali" value={formData.wali} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all placeholder:text-slate-400 font-medium text-slate-900" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Jumlah Siswa</label>
              <input type="number" step="1" min="0" required name="students" value={formData.students} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all placeholder:text-slate-400 font-medium text-slate-900" />
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
