import { useState, useEffect } from "react";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { motion } from "motion/react";
import {
  UserPlus,
  Search,
  MoreVertical,
  GraduationCap,
  Briefcase,
  Award,
  TrendingUp,
  Filter,
  Edit,
  Trash2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { DetailsDialog } from "../../components/common/DetailsDialog";
import { TeacherFormDialog } from "../../components/common/TeacherFormDialog";
import { useDataStore, Teacher } from "../../store/useDataStore";

const teacherPerformance = [
  { subject: "Matematika", score: 85, color: "#3B82F6" },
  { subject: "B. Inggris", score: 92, color: "#10B981" },
  { subject: "Fisika", score: 78, color: "#F59E0B" },
  { subject: "Seni Budaya", score: 88, color: "#8B5CF6" },
  { subject: "Biologi", score: 82, color: "#EC4899" },
];

export default function ManajemenGuru() {
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { teachers, addTeacher, updateTeacher, deleteTeacher } = useDataStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleAdd = () => {
    setIsEditing(false);
    setSelectedTeacher(null);
    setFormOpen(true);
  };
  const handleEdit = (t: Teacher) => {
    setIsEditing(true);
    setSelectedTeacher(t);
    setFormOpen(true);
  };
  const handleDelete = (id: string) => {
    if (confirm("Hapus guru ini?")) deleteTeacher(id);
  };
  const handleSubmit = (data: Omit<Teacher, "id">) => {
    if (isEditing && selectedTeacher) updateTeacher(selectedTeacher.id, data);
    else addTeacher(data);
  };
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-display font-bold text-slate-900 mb-2">
              Manajemen Guru
            </h2>
            <p className="text-slate-500">
              Kelola data staf pengajar, performa, dan jadwal mengajar.
            </p>
          </div>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold hover:shadow-lg hover:shadow-blue-500/30 transition-all active:scale-95"
          >
            <UserPlus className="w-5 h-5" />
            Tambah Guru
          </button>
        </div>

        {/* Top Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              label: "Total Guru Aktif",
              value: "42",
              icon: Briefcase,
              bg: "bg-blue-50",
              color: "text-blue-600",
            },
            {
              label: "Guru Tersertifikasi",
              value: "38",
              icon: Award,
              bg: "bg-emerald-50",
              color: "text-emerald-600",
            },
            {
              label: "Rata-rata Rating",
              value: "4.7",
              icon: TrendingUp,
              bg: "bg-purple-50",
              color: "text-purple-600",
            },
            {
              label: "Sedang Cuti",
              value: "2",
              icon: GraduationCap,
              bg: "bg-amber-50",
              color: "text-amber-600",
            },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass p-6 rounded-3xl border border-white/40 shadow-sm flex items-center gap-4 hover:-translate-y-1 hover:shadow-md transition-all group"
            >
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}
              >
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="font-display font-bold text-3xl text-slate-900">
                  {stat.value}
                </p>
                <p className="text-slate-500 text-sm font-medium">
                  {stat.label}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Main List Column */}
          <div className="xl:col-span-2 space-y-6">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari nama atau NIP guru..."
                  className="w-full pl-12 pr-4 py-3 bg-white/60 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium placeholder:font-normal shadow-sm"
                />
              </div>
              <div className="flex gap-2">
                <select className="px-4 py-3 bg-white/60 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 font-medium shadow-sm">
                  <option value="">Semua Mapel</option>
                  <option value="ipa">IPA</option>
                  <option value="ips">IPS</option>
                  <option value="bahasa">Bahasa</option>
                </select>
                <button className="flex items-center justify-center w-12 h-12 bg-white/60 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-700 font-medium shadow-sm">
                  <Filter className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Teacher List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {teachers.map((teacher, index) => (
                <motion.div
                  key={teacher.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="glass p-6 rounded-3xl border border-white/40 flex flex-col gap-4 hover:shadow-lg hover:border-blue-200 transition-all group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600 flex items-center justify-center font-bold text-xl shrink-0 group-hover:scale-105 transition-transform shadow-inner">
                        {teacher.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 leading-tight text-lg">
                          {teacher.name}
                        </h3>
                        <p className="text-sm text-slate-500 font-medium">
                          {teacher.id}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setSelectedTeacher(teacher);
                          setDialogOpen(true);
                        }}
                        className="text-slate-400 hover:text-blue-600 transition-colors bg-white/50 p-2 rounded-xl"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(teacher)}
                        className="text-slate-400 hover:text-blue-600 transition-colors bg-white/50 p-2 rounded-xl"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(teacher.id)}
                        className="text-slate-400 hover:text-red-600 transition-colors bg-white/50 p-2 rounded-xl"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-100">
                    <div>
                      <p className="text-xs text-slate-500 mb-1 font-medium uppercase tracking-wider">
                        Rating
                      </p>
                      <div className="flex items-center gap-1 font-bold text-slate-900">
                        <Award className="w-4 h-4 text-amber-500" />
                        {teacher.rating} / 5.0
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1 font-medium uppercase tracking-wider">
                        Kelas Aktif
                      </p>
                      <div className="flex items-center gap-1 font-bold text-slate-900">
                        <Briefcase className="w-4 h-4 text-emerald-500" />
                        {teacher.classes} Kelas
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-sm font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg">
                      {teacher.subject}
                    </span>
                    <span
                      className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide uppercase ${
                        teacher.status === "Aktif"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {teacher.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Column (Charts) */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="glass p-6 rounded-3xl border border-white/40 shadow-sm"
            >
              <h3 className="font-display font-bold text-xl text-slate-900 mb-2">
                Performa per Mata Pelajaran
              </h3>
              <p className="text-sm text-slate-500 mb-6 font-medium">
                Berdasarkan evaluasi siswa (skala 100)
              </p>

              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={teacherPerformance}
                    layout="vertical"
                    margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      horizontal={false}
                      stroke="#F1F5F9"
                    />
                    <XAxis type="number" hide domain={[0, 100]} />
                    <YAxis
                      dataKey="subject"
                      type="category"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#64748B", fontSize: 12, fontWeight: 500 }}
                      width={80}
                    />
                    <RechartsTooltip
                      cursor={{ fill: "#F8FAFC" }}
                      contentStyle={{
                        borderRadius: "12px",
                        border: "none",
                        boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                      }}
                    />
                    <Bar dataKey="score" radius={[0, 6, 6, 0]} barSize={20}>
                      {teacherPerformance.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-3xl p-6 shadow-xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-2xl rounded-full"></div>
              <h3 className="font-display font-bold text-xl text-white mb-2">
                Jadwal Sertifikasi
              </h3>
              <p className="text-sm text-indigo-100 mb-6 leading-relaxed">
                Ada 4 guru yang dijadwalkan untuk mengikuti program sertifikasi
                profesi bulan ini.
              </p>
              <button className="w-full h-12 rounded-xl bg-white text-indigo-700 font-bold hover:bg-indigo-50 transition-colors shadow-lg">
                Lihat Jadwal Lengkap
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      <DetailsDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title="Detail Guru"
        data={selectedTeacher}
      />
      <TeacherFormDialog
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        initialData={selectedTeacher}
      />
    </DashboardLayout>
  );
}
