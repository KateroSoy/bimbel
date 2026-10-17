import { Link } from 'react-router-dom';
import { CheckCircle2, Clock, ListChecks } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useDataStore } from '../../store/useDataStore';

export default function KatalogTes() {
  const { assignments, submissions } = useDataStore();
  const tests = assignments.filter((item) => item.type === 'quiz' && item.status === 'Aktif');

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-slate-900 mb-2">Katalog Tes</h1>
          <p className="text-slate-600">Kuis yang diterbitkan tutor. Nilai dihitung dan disimpan oleh sistem setelah dikumpulkan.</p>
        </div>
        {tests.length === 0 && <p className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-600">Belum ada tes yang tersedia.</p>}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {tests.map((test) => {
            const submission = submissions.find((item) => item.assignmentId === test.id);
            return <article key={test.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><ListChecks className="h-6 w-6" /></span>
              <h2 className="text-lg font-bold text-slate-900">{test.title}</h2>
              <p className="mt-1 text-sm text-slate-600">{test.subject || 'Tes umum'}</p>
              <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-600">
                <span className="inline-flex items-center gap-1"><Clock className="h-4 w-4" /> {test.duration ? `${test.duration} menit` : 'Tanpa batas waktu'}</span>
                <span className="inline-flex items-center gap-1"><ListChecks className="h-4 w-4" /> {test.questions?.length ?? 0} soal</span>
              </div>
              {submission && <p className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-emerald-700"><CheckCircle2 className="h-4 w-4" /> {submission.score === null ? 'Menunggu penilaian' : `Nilai ${submission.score}/100`}</p>}
              <Link to={`/siswa/tugas/${test.id}`} className="mt-5 block rounded-xl bg-blue-700 px-4 py-2.5 text-center text-sm font-bold text-white hover:bg-blue-800">
                {submission ? 'Lihat hasil' : 'Kerjakan tes'}
              </Link>
            </article>;
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
