import { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Plus, Search, Star, Users, Layers, Edit, Trash2, CheckCircle2, FileText, ArrowRight } from 'lucide-react';
import { useDataStore, Course } from '../../store/useDataStore';
import { CourseFormDialog } from '../../components/common/CourseFormDialog';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

export default function ManajemenCourseGuru() {
  const { courses, addCourse, updateCourse, deleteCourse } = useDataStore();
  const [formOpen, setFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

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

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus course "${title}"?`)) {
      deleteCourse(id);
      toast.success(`Course "${title}" berhasil dihapus`);
    }
  };

  const handleSubmit = (data: Omit<Course, 'id'>) => {
    if (isEditing && selectedCourse) {
      updateCourse(selectedCourse.id, data);
      toast.success('Course & materi berhasil diperbarui');
    } else {
      addCourse(data);
      toast.success('Course baru berhasil ditambahkan');
    }
  };

  const filteredCourses = courses.filter((c) => {
    const matchQuery =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.description && c.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchCategory =
      categoryFilter === 'all' || c.category.toLowerCase() === categoryFilter.toLowerCase();
    return matchQuery && matchCategory;
  });

  const totalLessons = courses.reduce((acc, curr) => acc + (curr.lessons || 6), 0);
  const totalEnrolled = courses.reduce((acc, curr) => acc + curr.students, 0);

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-display font-bold text-slate-900 mb-2">
              Manajemen Course & Materi Guru
            </h2>
            <p className="text-slate-500">
              Buat, edit, dan kelola silabus kurikulum, modul digital, serta materi pembelajaran interaktif.
            </p>
          </div>
          
          <button 
            onClick={handleAdd}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-md shadow-blue-600/20 active:scale-95 text-sm"
          >
            <Plus className="w-5 h-5" />
            Tambah Course Baru
          </button>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'Total Course Aktif', value: courses.length.toString(), icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Total Modul / Bab', value: totalLessons.toString(), icon: Layers, color: 'text-purple-600', bg: 'bg-purple-50' },
            { label: 'Siswa Belajar', value: totalEnrolled.toString(), icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Rata-rata Rating', value: '4.8 ★', icon: Star, color: 'text-amber-600', bg: 'bg-amber-50' },
          ].map((stat, i) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass p-5 rounded-3xl border border-white/40 shadow-sm flex flex-col items-center text-center bg-white hover:-translate-y-1 hover:shadow-md transition-all group"
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <p className="font-display font-bold text-2xl text-slate-900 leading-tight">{stat.value}</p>
              <p className="text-slate-500 text-xs font-medium uppercase tracking-wide mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Filter & Search */}
        <div className="glass p-4 rounded-2xl border border-white/40 flex flex-col sm:flex-row gap-4 justify-between items-center shadow-sm bg-white">
          <div className="flex gap-2 bg-slate-100 p-1 rounded-xl w-full sm:w-auto overflow-x-auto">
            {['all', 'MIPA', 'Bahasa', 'IPS', 'Teknologi'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-4 py-2 rounded-lg font-bold text-xs transition-all shrink-0 ${
                  categoryFilter === cat
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {cat === 'all' ? 'Semua Kategori' : cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari judul course / pengampu..." 
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-medium"
            />
          </div>
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredCourses.map((c, i) => (
              <motion.div
                key={c.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, delay: i * 0.04 }}
                className="glass p-6 rounded-3xl border border-white/40 shadow-sm flex flex-col justify-between hover:shadow-xl hover:border-blue-200 transition-all bg-white group relative"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3.5 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-sm">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
                        {c.category}
                      </span>
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                          c.status === 'Aktif' || c.status === 'Published'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {c.status}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-bold text-lg text-slate-900 mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {c.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mb-3">
                    Pengampu: <strong className="text-slate-700">{c.instructor}</strong>
                  </p>

                  {c.description && (
                    <p className="text-xs text-slate-600 line-clamp-2 mb-4 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      {c.description}
                    </p>
                  )}

                  <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 text-xs text-slate-600 font-medium mb-4">
                    <div className="flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-blue-500" />
                      <span>{c.lessons || 6} Bab</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{c.students} Siswa</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span>{c.rating || 4.8}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between gap-2">
                  <Link 
                    to={`/siswa/course/2`} 
                    className="flex-1 py-2 px-3 bg-slate-50 hover:bg-blue-50 hover:text-blue-700 text-slate-700 font-bold rounded-xl text-xs flex items-center justify-center gap-1 transition-colors border border-slate-100"
                  >
                    <span>Materi Course</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <button
                    onClick={() => handleEdit(c)}
                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200"
                    title="Edit Course"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(c.id, c.title)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors border border-slate-200"
                    title="Hapus Course"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredCourses.length === 0 && (
            <div className="col-span-3 glass p-12 rounded-3xl text-center text-slate-500 bg-white">
              Tidak ada course yang sesuai dengan kriteria pencarian atau kategori ini.
            </div>
          )}
        </div>
      </div>

      <CourseFormDialog
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        initialData={selectedCourse}
      />
    </DashboardLayout>
  );
}
