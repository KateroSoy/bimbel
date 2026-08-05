import { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { UsersRound, Plus, Search, Edit, Trash2, Calendar, ArrowRight, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useDataStore, Classroom } from '../../store/useDataStore';
import { ClassroomFormDialog } from '../../components/common/ClassroomFormDialog';
import { toast } from 'sonner';

export default function ManajemenKelasGuru() {
  const { classes, addClassroom, updateClassroom, deleteClassroom } = useDataStore();
  const [formOpen, setFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Classroom | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

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

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus rombel ${name}?`)) {
      deleteClassroom(id);
      toast.success(`Kelas ${name} berhasil dihapus`);
    }
  };

  const handleSubmit = (data: Omit<Classroom, 'id'>) => {
    if (isEditing && selectedClass) {
      updateClassroom(selectedClass.id, data);
      toast.success(`Kelas ${data.name} berhasil diperbarui`);
    } else {
      addClassroom(data);
      toast.success(`Kelas ${data.name} baru berhasil ditambahkan`);
    }
  };

  const filteredClasses = classes.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.wali.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-display font-bold text-slate-900 mb-2">
              Manajemen Rombel & Kelas Guru
            </h2>
            <p className="text-slate-500">
              Kelola rombongan belajar, alokasi siswa, wali kelas, dan jadwal mengajar mingguan.
            </p>
          </div>

          <button
            onClick={handleAdd}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-md shadow-blue-600/20 active:scale-95 text-sm"
          >
            <Plus className="w-5 h-5" />
            Tambah Kelas Baru
          </button>
        </div>

        {/* Filter & Search */}
        <div className="glass p-4 rounded-2xl border border-white/40 flex flex-col sm:flex-row gap-4 justify-between items-center shadow-sm bg-white">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl">
            <UsersRound className="w-4 h-4 text-blue-600" />
            Total {classes.length} Rombongan Belajar
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama kelas atau wali..."
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-medium"
            />
          </div>
        </div>

        {/* Classes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredClasses.map((c, i) => (
              <motion.div
                key={c.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, delay: i * 0.05 }}
                className="glass p-6 rounded-3xl border border-white/40 shadow-sm flex flex-col justify-between hover:shadow-xl hover:border-blue-200 transition-all bg-white group"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3.5 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-sm">
                        <UsersRound className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-xl text-slate-900 group-hover:text-blue-600 transition-colors">
                          {c.name}
                        </h3>
                        <p className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                          <UserCheck className="w-3.5 h-3.5 text-blue-500" />
                          Wali: <strong className="text-slate-700">{c.wali}</strong>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEdit(c)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-xl transition-colors"
                        title="Edit Kelas"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(c.id, c.name)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                        title="Hapus Kelas"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 py-3 border-y border-slate-100 text-xs text-slate-600 font-medium mb-4">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase tracking-wider font-bold">Kapasitas Siswa</span>
                      <span className="font-bold text-slate-900 text-sm">{c.students} Siswa Terdaftar</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase tracking-wider font-bold">Jadwal Mengajar</span>
                      <span className="font-bold text-blue-700 flex items-center gap-1 text-xs">
                        <Calendar className="w-3.5 h-3.5" />
                        {c.schedule || 'Senin, Rabu, Jumat'}
                      </span>
                    </div>
                  </div>
                </div>

                <Link
                  to={`/guru/kelas/${c.id}`}
                  className="w-full py-2.5 bg-slate-50 text-slate-700 font-bold rounded-xl border border-slate-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-all flex items-center justify-center gap-2 text-xs"
                >
                  Lihat Detail Siswa & Presensi
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredClasses.length === 0 && (
            <div className="col-span-2 glass p-12 rounded-3xl text-center text-slate-500 bg-white">
              Tidak ada rombel atau kelas yang cocok dengan pencarian.
            </div>
          )}
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
