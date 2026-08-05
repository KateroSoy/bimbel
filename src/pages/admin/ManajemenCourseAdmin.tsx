import { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { DetailsDialog } from '../../components/common/DetailsDialog';
import { CourseFormDialog } from '../../components/common/CourseFormDialog';
import { useDataStore, Course } from '../../store/useDataStore';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';

export default function ManajemenCourseAdmin() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  
  const { courses, addCourse, updateCourse, deleteCourse } = useDataStore();

  const handleAdd = () => {
    setIsEditing(false);
    setSelectedCourse(null);
    setFormOpen(true);
  };

  const handleEdit = (course: Course) => {
    setIsEditing(true);
    setSelectedCourse(course);
    setFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus course ini?')) {
      deleteCourse(id);
    }
  };

  const handleSubmit = (data: Omit<Course, 'id'>) => {
    if (isEditing && selectedCourse) {
      updateCourse(selectedCourse.id, data);
    } else {
      addCourse(data);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Data Course</h2>
          <button onClick={handleAdd} className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold hover:shadow-lg hover:shadow-blue-500/30 transition-all active:scale-95">
            <Plus className="w-5 h-5" />
            Tambah Course
          </button>
        </div>
        <div className="glass p-6 rounded-3xl border border-white/40 shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="p-4 font-bold text-slate-700">Judul Course</th>
                <th className="p-4 font-bold text-slate-700">Kategori</th>
                <th className="p-4 font-bold text-slate-700">Status</th>
                <th className="p-4 font-bold text-slate-700 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((c) => (
                <tr key={c.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                  <td className="p-4 font-medium text-slate-900">{c.title}</td>
                  <td className="p-4 text-slate-600">{c.category}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full font-bold text-xs ${c.status === 'Aktif' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600'}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => {
                          setSelectedCourse(c);
                          setDialogOpen(true);
                        }}
                        className="p-2 text-slate-400 hover:text-blue-600 transition-colors rounded-xl hover:bg-slate-100"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleEdit(c)}
                        className="p-2 text-slate-400 hover:text-blue-600 transition-colors rounded-xl hover:bg-slate-100"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(c.id)}
                        className="p-2 text-slate-400 hover:text-red-600 transition-colors rounded-xl hover:bg-red-50"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <DetailsDialog 
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title="Detail Course"
        data={selectedCourse}
      />
      <CourseFormDialog
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        initialData={selectedCourse}
      />
    </DashboardLayout>
  );
}
