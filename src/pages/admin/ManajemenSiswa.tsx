import { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { motion } from 'motion/react';
import { Users, UserPlus, Search, MoreVertical, GraduationCap, TrendingUp, Filter, Download, Edit, Trash2 } from 'lucide-react';
import { SkeletonTable, SkeletonMetric } from '../../components/ui/Skeleton';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { DetailsDialog } from '../../components/common/DetailsDialog';
import { StudentFormDialog } from '../../components/common/StudentFormDialog';
import { useDataStore, Student } from '../../store/useDataStore';

const studentDistribution = [
  { name: 'Kelas X', value: 450, color: '#3B82F6' },
  { name: 'Kelas XI', value: 420, color: '#10B981' },
  { name: 'Kelas XII', value: 378, color: '#8B5CF6' },
];

export default function ManajemenSiswa() {
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const { students, addStudent, updateStudent, deleteStudent } = useDataStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleAdd = () => {
    setIsEditing(false);
    setSelectedStudent(null);
    setFormOpen(true);
  };

  const handleEdit = (student: Student) => {
    setIsEditing(true);
    setSelectedStudent(student);
    setFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus siswa ini?')) {
      deleteStudent(id);
    }
  };

  const handleSubmit = (data: Omit<Student, 'id'>) => {
    if (isEditing && selectedStudent) {
      updateStudent(selectedStudent.id, data);
    } else {
      addStudent(data);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-display font-bold text-slate-900 mb-2">Manajemen Siswa</h2>
            <p className="text-slate-500">Kelola data akademik, kehadiran, dan status siswa.</p>
          </div>
          <div className="flex gap-3">
            <button className="bg-white border border-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-bold hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-sm">
              <Download className="w-4 h-4" />
              Import CSV
            </button>
            <button onClick={handleAdd} className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold hover:shadow-lg hover:shadow-blue-500/30 transition-all active:scale-95">
              <UserPlus className="w-5 h-5" />
              Tambah Siswa
            </button>
          </div>
        </div>

        {/* Top Section: Metrics & Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {isLoading ? (
              <>
                <SkeletonMetric />
                <SkeletonMetric />
                <SkeletonMetric />
                <SkeletonMetric />
              </>
            ) : (
              <>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass p-6 rounded-3xl border border-white/40 shadow-sm flex items-center gap-4 group hover:shadow-md transition-all"
                >
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-display font-bold text-3xl text-slate-900">1,248</p>
                    <p className="text-slate-500 text-sm font-medium">Total Siswa Aktif</p>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="glass p-6 rounded-3xl border border-white/40 shadow-sm flex items-center gap-4 group hover:shadow-md transition-all"
                >
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-display font-bold text-3xl text-slate-900">95.2%</p>
                    <p className="text-slate-500 text-sm font-medium">Tingkat Kehadiran</p>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="glass p-6 rounded-3xl border border-white/40 shadow-sm flex items-center gap-4 group hover:shadow-md transition-all"
                >
                  <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-display font-bold text-3xl text-slate-900">3.45</p>
                    <p className="text-slate-500 text-sm font-medium">Rata-rata IPK</p>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gradient-to-br from-indigo-600 to-blue-700 p-6 rounded-3xl shadow-xl text-white relative overflow-hidden group hover:shadow-blue-600/30 transition-all flex flex-col justify-center"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-2xl rounded-full"></div>
                  <h4 className="font-bold text-lg mb-1 relative z-10">Penerimaan Siswa Baru</h4>
                  <p className="text-indigo-100 text-sm mb-4 relative z-10">Pendaftaran gelombang 1 dibuka.</p>
                  <button className="bg-white/20 hover:bg-white/30 text-white w-full py-2 rounded-xl font-bold transition-colors border border-white/20 backdrop-blur-sm relative z-10">
                    Kelola PPDB
                  </button>
                </motion.div>
              </>
            )}
          </div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass p-6 rounded-3xl border border-white/40 shadow-sm"
          >
            <h3 className="font-display font-bold text-lg text-slate-900 mb-4">Distribusi Siswa</h3>
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={studentDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {studentDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 500 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Directory Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          {/* Filters */}
          <div className="glass p-4 rounded-2xl border border-white/40 flex flex-col md:flex-row gap-4 shadow-sm">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Cari nama atau NIS siswa..." 
                className="w-full pl-12 pr-4 py-3 bg-white/60 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium placeholder:font-normal"
              />
            </div>
            <div className="flex gap-2">
              <select className="px-4 py-3 bg-white/60 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 font-medium min-w-[150px]">
                <option value="">Semua Kelas</option>
                <option value="10">Kelas 10</option>
                <option value="11">Kelas 11</option>
                <option value="12">Kelas 12</option>
              </select>
              <button className="flex items-center justify-center w-12 h-12 bg-white/60 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-700 font-medium shadow-sm">
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Table */}
          {isLoading ? (
            <SkeletonTable rows={4} />
          ) : (
            <div className="glass rounded-3xl border border-white/40 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50/80 border-b border-slate-100 backdrop-blur-md">
                    <tr>
                      <th className="px-6 py-5 font-bold text-slate-500 text-sm">NIS</th>
                      <th className="px-6 py-5 font-bold text-slate-500 text-sm">NAMA SISWA</th>
                      <th className="px-6 py-5 font-bold text-slate-500 text-sm">KELAS</th>
                      <th className="px-6 py-5 font-bold text-slate-500 text-sm">IPK</th>
                      <th className="px-6 py-5 font-bold text-slate-500 text-sm">STATUS</th>
                      <th className="px-6 py-5 font-bold text-slate-500 text-sm text-right">AKSI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student, index) => (
                      <motion.tr 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + (index * 0.05) }}
                        key={student.id} 
                        className="border-b border-slate-50 last:border-0 hover:bg-white/60 transition-colors group"
                      >
                        <td className="px-6 py-4 text-slate-500 font-mono text-sm group-hover:text-blue-600 transition-colors">{student.id}</td>
                        <td className="px-6 py-4 font-bold text-slate-900 flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600 flex items-center justify-center font-bold text-sm shadow-inner">
                            {student.name.charAt(0)}
                          </div>
                          {student.name}
                        </td>
                        <td className="px-6 py-4 text-slate-600 font-medium">{student.grade}</td>
                        <td className="px-6 py-4">
                          <span className="font-mono font-bold text-slate-700">{student.gpa.toFixed(2)}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold tracking-wide uppercase ${
                            student.status === 'Aktif' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'
                          }`}>
                            {student.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => {
                                setSelectedStudent(student);
                                setDialogOpen(true);
                              }}
                              className="p-2 text-slate-400 hover:text-blue-600 transition-colors rounded-xl hover:bg-slate-100"
                            >
                              <MoreVertical className="w-5 h-5" />
                            </button>
                            <button 
                              onClick={() => handleEdit(student)}
                              className="p-2 text-slate-400 hover:text-blue-600 transition-colors rounded-xl hover:bg-slate-100"
                            >
                              <Edit className="w-5 h-5" />
                            </button>
                            <button 
                              onClick={() => handleDelete(student.id)}
                              className="p-2 text-slate-400 hover:text-red-600 transition-colors rounded-xl hover:bg-red-50"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      <DetailsDialog 
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title="Detail Siswa"
        data={selectedStudent}
      />
      
      <StudentFormDialog 
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        initialData={selectedStudent}
      />
    </DashboardLayout>
  );
}
