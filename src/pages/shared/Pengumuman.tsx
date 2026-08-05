import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Megaphone, Calendar } from 'lucide-react';

export default function Pengumuman() {
  const announcements = [
    { title: 'Libur Nasional Kemerdekaan', date: '15 Agustus 2023', content: 'Diberitahukan kepada seluruh siswa dan staf bahwa pada tanggal 17 Agustus 2023 sekolah akan diliburkan.' },
    { title: 'Ujian Tengah Semester', date: '10 Agustus 2023', content: 'Jadwal UTS akan dimulai pada minggu pertama bulan September. Harap persiapkan diri dengan baik.' },
  ];
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Pengumuman Sekolah</h2>
        <div className="space-y-4">
          {announcements.map((ann, i) => (
            <div key={i} className="glass p-6 rounded-3xl border border-white/40 shadow-sm flex gap-4 items-start">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl shrink-0">
                <Megaphone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900">{ann.title}</h3>
                <div className="flex items-center gap-2 text-sm text-slate-500 mb-2 mt-1">
                  <Calendar className="w-4 h-4" /> {ann.date}
                </div>
                <p className="text-slate-700">{ann.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
