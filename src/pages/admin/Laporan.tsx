import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Download, Printer } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { api, ApiError } from '../../lib/api';

type Section = 'overview' | 'students' | 'classes' | 'tutors' | 'operations';
type Report = {
  title: string;
  metrics: { label: string; value: number }[];
  columns: Record<string, string>;
  rows: Record<string, string | number | null>[];
  generatedAt: string;
};

const sections: { slug: Section; path: string; label: string }[] = [
  { slug: 'overview', path: '/admin/laporan', label: 'Ringkasan' },
  { slug: 'students', path: '/admin/laporan-siswa', label: 'Siswa' },
  { slug: 'classes', path: '/admin/laporan-kelas', label: 'Kelas' },
  { slug: 'tutors', path: '/admin/laporan-tutor', label: 'Tutor' },
  { slug: 'operations', path: '/admin/laporan-operasional', label: 'Operasional' },
];

const number = (value: number) => new Intl.NumberFormat('id-ID').format(value);
const cell = (value: string | number | null) => value === null || value === '' ? '—' : typeof value === 'number' ? number(value) : value;
const csvCell = (value: string | number | null) => {
  const text = value === null ? '' : String(value);
  return `"${(typeof value === 'string' && /^[\s]*[=+@\-]/.test(text) ? `'${text}` : text).replaceAll('"', '""')}"`;
};

function downloadCsv(report: Report, section: Section) {
  const keys = Object.keys(report.columns);
  const lines = [
    keys.map((key) => csvCell(report.columns[key])).join(','),
    ...report.rows.map((row) => keys.map((key) => csvCell(row[key])).join(',')),
  ];
  const blob = new Blob(['\uFEFF', lines.join('\r\n')], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `laporan-${section}-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export default function Laporan() {
  const { pathname } = useLocation();
  const section = sections.find((item) => item.path === pathname)?.slug ?? 'overview';
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setReport(null);
    setError('');
    api.get<Report>(`/admin/reports/${section}`)
      .then((result) => { if (active) setReport(result); })
      .catch((cause) => { if (active) setError(cause instanceof ApiError ? cause.first : 'Laporan tidak dapat dimuat.'); });
    return () => { active = false; };
  }, [section]);

  return (
    <DashboardLayout>
      <main className="max-w-7xl mx-auto space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-slate-900">{report?.title ?? 'Laporan & Analitik'}</h1>
            <p className="text-sm text-slate-600 mt-1">Data langsung dari sistem. Diperbarui saat halaman dibuka.</p>
          </div>
          {report && <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => downloadCsv(report, section)} className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-800"><Download className="h-4 w-4" /> Unduh CSV</button>
            <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-800 hover:bg-slate-50"><Printer className="h-4 w-4" /> Cetak</button>
          </div>}
        </div>

        <nav aria-label="Jenis laporan" className="flex gap-2 overflow-x-auto pb-1">
          {sections.map((item) => <Link key={item.slug} to={item.path} className={`whitespace-nowrap rounded-xl px-4 py-2 text-sm font-bold ${section === item.slug ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'}`}>{item.label}</Link>)}
        </nav>

        {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>}
        {!report && !error && <p role="status" className="rounded-xl bg-white p-6 text-slate-600">Memuat laporan…</p>}
        {report && <>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {report.metrics.map((metric) => <div key={metric.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{metric.label}</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">{number(metric.value)}</p>
            </div>)}
          </div>
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-5 py-4">
              <h2 className="text-lg font-bold text-slate-900">Rincian {section === 'overview' ? 'data' : sections.find((item) => item.slug === section)?.label}</h2>
              <span className="text-xs text-slate-500">{report.rows.length} baris · {new Date(report.generatedAt).toLocaleString('id-ID')}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead className="bg-slate-50 text-slate-600"><tr>{Object.entries(report.columns).map(([key, label]) => <th key={key} scope="col" className="px-5 py-3 font-bold">{label}</th>)}</tr></thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {report.rows.map((row, index) => <tr key={index}>{Object.keys(report.columns).map((key) => <td key={key} className="px-5 py-3">{cell(row[key])}</td>)}</tr>)}
                </tbody>
              </table>
              {report.rows.length === 0 && <p className="p-6 text-center text-slate-600">Belum ada data untuk laporan ini.</p>}
            </div>
          </section>
        </>}
      </main>
    </DashboardLayout>
  );
}
