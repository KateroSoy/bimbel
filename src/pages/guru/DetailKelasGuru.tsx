import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { UsersRound, FileText, ChevronLeft, Calendar, ArrowRight, UserCircle2 } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useDataStore } from '../../store/useDataStore';

export default function DetailKelasGuru() {
  const { id } = useParams<{ id: string }>();
  const { classes, students, grades } = useDataStore();

  const currentClass = classes.find((c) => c.id === id) || classes[0] || {
    id: '1',
    name: 'X IPA 1',
    wali: 'Drs. Ahmad Yani',
    students: 32,
    schedule: 'Senin, Rabu, Jumat',
  };

  const classStudents = students.filter(
    (s) => s.grade.toLowerCase().includes(currentClass.name.toLowerCase().replace(/kelas\s*/i, '')) ||
           currentClass.name.toLowerCase().includes(s.grade.toLowerCase())
  );

  const displayStudents = classStudents.length > 0 ? classStudents : students;

  const avgGpa = (
    displayStudents.reduce((acc, curr) => acc + (curr.gpa || 3.5), 0) / (displayStudents.length || 1)
  ).toFixed(2);

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/guru/kelas" className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
            <ChevronLeft className="w-6 h-6 text-slate-600" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Detail Kelas {currentClass.name}</h2>
            <p className="text-slate-500 text-sm">Wali Kelas: {currentClass.wali} • Jadwal: {currentClass.schedule || 'Senin, Rabu'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass p-6 rounded-3xl border border-white/40 shadow-sm flex flex-col gap-2 bg-white">
            <div className="flex items-center gap-3 text-slate-600 mb-2">
              <UsersRound className="w-5 h-5 text-blue-600" />
              <span className="font-bold">Total Siswa</span>
            </div>
            <p className="text-3xl font-bold text-slate-900">{displayStudents.length} Siswa</p>
          </div>
          
          <div className="glass p-6 rounded-3xl border border-white/40 shadow-sm flex flex-col gap-2 bg-white">
            <div className="flex items-center gap-3 text-slate-600 mb-2">
              <Calendar className="w-5 h-5 text-emerald-600" />
              <span className="font-bold">Rata-rata Kehadiran</span>
            </div>
            <p className="text-3xl font-bold text-slate-900">97.8%</p>
          </div>

          <div className="glass p-6 rounded-3xl border border-white/40 shadow-sm flex flex-col gap-2 bg-white">
            <div className="flex items-center gap-3 text-slate-600 mb-2">
              <FileText className="w-5 h-5 text-amber-600" />
              <span className="font-bold">Rata-rata IPK Siswa</span>
            </div>
            <p className="text-3xl font-bold text-slate-900">{avgGpa} / 4.00</p>
          </div>
        </div>

        <div className="glass p-6 rounded-3xl border border-white/40 shadow-sm bg-white">
          <h3 className="font-bold text-lg text-slate-900 mb-6">Daftar Siswa di Kelas Ini</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="p-4 font-bold text-slate-700">Nama Siswa</th>
                  <th className="p-4 font-bold text-slate-700">NIS / ID</th>
                  <th className="p-4 font-bold text-slate-700">Kehadiran</th>
                  <th className="p-4 font-bold text-slate-700">IPK / Rata-rata</th>
                  <th className="p-4 font-bold text-slate-700 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {displayStudents.map((s) => (
                  <tr key={s.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <UserCircle2 className="w-8 h-8 text-slate-400" />
                        <div>
                          <span className="font-bold text-slate-900 block">{s.name}</span>
                          <span className="text-xs text-slate-500">{s.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-slate-600 font-mono text-sm">{s.id}</td>
                    <td className="p-4 text-slate-600 font-semibold">{s.attendance || '98%'}</td>
                    <td className="p-4 text-blue-600 font-bold">{s.gpa}</td>
                    <td className="p-4 text-right">
                      <Link to={`/guru/progress-siswa`} className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors font-medium text-sm">
                        Lihat Progress <ArrowRight className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
