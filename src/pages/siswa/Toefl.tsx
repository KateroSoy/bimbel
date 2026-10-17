import { Link } from 'react-router-dom';
import { Headphones } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useDataStore } from '../../store/useDataStore';

export default function Toefl() {
  const { assignments, submissions } = useDataStore();
  const tests = assignments.filter((item) => item.type === 'quiz' && item.status === 'Aktif' && /toefl/i.test(`${item.title} ${item.subject}`));

  return <DashboardLayout>
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-slate-900">Persiapan TOEFL</h1>
        <p className="mt-2 text-slate-600">Latihan TOEFL yang diterbitkan tutor. Nilai dan progres berasal dari hasil pengerjaan Anda.</p>
      </div>
      {tests.length === 0 && <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-600">Belum ada latihan TOEFL yang diterbitkan. <Link to="/siswa/katalog-tes" className="font-bold text-blue-700">Lihat semua tes</Link></div>}
      <div className="grid gap-4 md:grid-cols-2">
        {tests.map((test) => {
          const result = submissions.find((item) => item.assignmentId === test.id);
          return <article key={test.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <Headphones className="mb-4 h-7 w-7 text-blue-700" />
            <h2 className="text-lg font-bold text-slate-900">{test.title}</h2>
            <p className="mt-1 text-sm text-slate-600">{test.questions?.length ?? 0} soal{test.duration ? ` · ${test.duration} menit` : ''}</p>
            {result && <p className="mt-3 text-sm font-bold text-emerald-700">{result.score === null ? 'Menunggu penilaian' : `Nilai ${result.score}/100`}</p>}
            <Link to={`/siswa/tugas/${test.id}`} className="mt-5 block rounded-xl bg-blue-700 px-4 py-2.5 text-center text-sm font-bold text-white hover:bg-blue-800">{result ? 'Lihat hasil' : 'Mulai latihan'}</Link>
          </article>;
        })}
      </div>
    </div>
  </DashboardLayout>;
}
