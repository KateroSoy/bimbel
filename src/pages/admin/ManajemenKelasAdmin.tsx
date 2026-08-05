import { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { UsersRound, Edit, Trash2, Plus } from 'lucide-react';
import { ClassroomFormDialog } from '../../components/common/ClassroomFormDialog';
import { useDataStore, Classroom } from '../../store/useDataStore';

export default function ManajemenKelasAdmin() {
  const [formOpen, setFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Classroom | null>(null);

  const { classes, addClassroom, updateClassroom, deleteClassroom } = useDataStore();

  const handleAdd = () => {
    setIsEditing(false);
    setSelectedClass(null);
    setFormOpen(true);
  };

  const handleEdit = (c: Classroom) => {
    setIsEditing(true);
    setSelectedClass(c);
    setFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus kelas ini?')) {
      deleteClassroom(id);
    }
  };

  const handleSubmit = (data: Omit<Classroom, 'id'>) => {
    if (isEditing && selectedClass) {
      updateClassroom(selectedClass.id, data);
    } else {
      addClassroom(data);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Data Kelas</h2>
          <button onClick={handleAdd} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all active:scale-95">
            <Plus className="w-5 h-5" /> Tambah Kelas
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {classes.map((c) => (
            <div key={c.id} className="glass p-6 rounded-3xl border border-white/40 shadow-sm flex flex-col">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl w-fit mb-4">
                <UsersRound className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-xl text-slate-900 mb-1">{c.name}</h3>
              <p className="text-slate-500 text-sm mb-4">Wali: {c.wali}</p>
              
              <div className="text-slate-700 font-medium text-sm mb-6">
                {c.students} Siswa
              </div>
              
              <div className="mt-auto flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button onClick={() => handleEdit(c)} className="p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"><Edit className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(c.id)} className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <ClassroomFormDialog
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        initialData={selectedClass}
      />
    </DashboardLayout>
  );
}
