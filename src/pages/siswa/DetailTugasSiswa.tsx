import { useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Clock, CalendarDays, CheckCircle2, Upload, ChevronLeft, Award, FileCheck, ListChecks, PencilLine, X } from 'lucide-react';
import { toast } from 'sonner';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, Pill } from '../../components/siswa/PortalUI';
import { cn } from '../../lib/utils';
import { useDataStore } from '../../store/useDataStore';
import { STUDENT, TASK_MODE_LABEL, taskContentFor } from '../../data/siswaPortal';

const MAX_MB = 20;

export default function DetailTugasSiswa() {
  const { id } = useParams<{ id: string }>();
  const { assignments, submissions, addSubmission } = useDataStore();
  const fileInput = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [choices, setChoices] = useState<Record<number, number>>({});
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const assignment = assignments.find((a) => a.id === id) ?? assignments[0];
  if (!assignment) {
    return <DashboardLayout><Card className="p-8 text-center">Tugas tidak ditemukan. <Link to="/siswa/tugas" className="text-[#1D4ED8] font-bold">Kembali</Link></Card></DashboardLayout>;
  }

  const content = taskContentFor(assignment.id, assignment.type);
  const questions = content.questions ?? [];
  const submission = submissions.find((s) => s.assignmentId === assignment.id);
  const submitted = !!submission?.submittedAt;
  const ModeIcon = content.mode === 'pilihan-ganda' ? ListChecks : content.mode === 'isian' ? PencilLine : Upload;

  const answeredCount = content.mode === 'pilihan-ganda'
    ? Object.keys(choices).length
    : content.mode === 'isian' ? Object.values(answers).filter((v) => v.trim()).length : file ? 1 : 0;
  const required = content.mode === 'file' ? 1 : questions.length;

  const pickFile = (f: File | undefined) => {
    if (!f) return;
    if (f.size > MAX_MB * 1024 * 1024) { toast.error(`Ukuran file maksimal ${MAX_MB} MB`); return; }
    setFile(f);
  };

  const handleSubmit = async () => {
    if (answeredCount < required) {
      toast.error(content.mode === 'file' ? 'Pilih file tugas terlebih dahulu.' : `Jawab semua soal dulu (${answeredCount}/${required}).`);
      return;
    }
    setIsSubmitting(true);

    // PG dinilai server dari kunci jawaban yang tidak pernah dikirim ke browser; isian & file dinilai guru.
    const summary = content.mode === 'file'
      ? file!.name
      : content.mode === 'isian'
        ? questions.map((q) => `${q.id}. ${answers[q.id]?.trim()}`).join(' | ')
        : `Jawaban PG: ${questions.map((q) => `${q.id}${'ABCD'[choices[q.id]]}`).join(', ')}`;
    const saved = await addSubmission({
      assignmentId: assignment.id,
      answers: content.mode === 'pilihan-ganda' ? choices : content.mode === 'isian' ? answers : undefined,
      fileName: summary.slice(0, 190),
    });
    setIsSubmitting(false);
    if (saved) toast.success(saved.score !== null ? `Jawaban terkirim! Nilai kamu: ${saved.score}` : 'Tugas terkirim dan menunggu penilaian tutor.');
  };

  const deadline = new Date(assignment.deadline).toLocaleString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <DashboardLayout>
      <div className="max-w-4xl space-y-3">
        <Link to="/siswa/tugas" className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-600 hover:text-[#1D4ED8]">
          <ChevronLeft className="w-4 h-4" /> Kembali ke Tugas & Asesmen
        </Link>

        <Card className="p-5 space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-emerald-600">{assignment.subject} · {assignment.kelas}</p>
              <h1 className="text-xl md:text-2xl font-extrabold text-[#0F1E4A]">{assignment.title}</h1>
            </div>
            {submission?.status === 'Dinilai' ? <Pill tone="green"><Award className="w-3.5 h-3.5" /> Dinilai ({submission.score}/100)</Pill>
              : submitted ? <Pill tone="blue"><CheckCircle2 className="w-3.5 h-3.5" /> Sudah Dikumpulkan</Pill>
              : <Pill tone="orange"><Clock className="w-3.5 h-3.5" /> Belum Dikumpulkan</Pill>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 flex items-center gap-3">
              <ModeIcon className="w-5 h-5 text-[#1D4ED8]" />
              <div><p className="text-[11px] font-bold text-slate-500">JENIS TUGAS</p><p className="text-sm font-bold text-[#0F1E4A]">{TASK_MODE_LABEL[content.mode]}</p></div>
            </div>
            <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 flex items-center gap-3">
              <CalendarDays className="w-5 h-5 text-red-500" />
              <div><p className="text-[11px] font-bold text-slate-500">DEADLINE</p><p className="text-sm font-bold text-red-600">{deadline}</p></div>
            </div>
            <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <div><p className="text-[11px] font-bold text-slate-500">PROGRES</p><p className="text-sm font-bold text-[#0F1E4A]">{submitted ? 'Terkirim' : `${answeredCount} / ${required} terjawab`}</p></div>
            </div>
          </div>

          <div>
            <h2 className="font-extrabold text-[#0F1E4A] text-sm mb-1.5">Instruksi</h2>
            <p className="text-sm text-slate-700 font-medium leading-relaxed bg-slate-50 rounded-xl border border-slate-100 p-3">{assignment.description}</p>
          </div>

          {submission?.status === 'Dinilai' && (
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 flex items-center justify-between gap-4">
              <div>
                <p className="font-extrabold text-emerald-800 flex items-center gap-2"><Award className="w-5 h-5" /> Hasil Penilaian</p>
                {submission.feedback && <p className="text-sm text-emerald-900 font-medium mt-1">“{submission.feedback}”</p>}
              </div>
              <span className="text-2xl font-extrabold text-emerald-700 bg-white rounded-xl px-4 py-1 border border-emerald-100">{submission.score}/100</span>
            </div>
          )}
        </Card>

        {submitted ? (
          <Card className="p-5">
            <h2 className="font-extrabold text-[#0F1E4A] mb-3">Jawaban yang Dikumpulkan</h2>
            <div className="rounded-xl bg-blue-50/60 border border-blue-200 p-3 flex items-center gap-3">
              <span className="w-10 h-10 rounded-lg bg-[#1D4ED8] text-white flex items-center justify-center"><FileCheck className="w-5 h-5" /></span>
              <div className="min-w-0">
                <p className="text-sm font-bold text-[#0F1E4A] break-words">{submission!.fileName}</p>
                <p className="text-xs text-slate-500">Dikirim: {submission!.submittedAt}</p>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="p-5 space-y-4">
            <h2 className="font-extrabold text-[#0F1E4A]">Kerjakan Tugas</h2>

            {content.mode === 'pilihan-ganda' && questions.map((q, qi) => (
              <div key={q.id} className="rounded-xl border border-slate-200 p-4">
                <p className="text-sm font-bold text-[#0F1E4A] mb-2">{qi + 1}. {q.question}</p>
                <div className="grid sm:grid-cols-2 gap-2">
                  {q.options!.map((opt, oi) => (
                    <label key={oi} className={cn('flex items-center gap-2.5 rounded-lg border px-3 py-2 cursor-pointer text-sm font-semibold transition-colors',
                      choices[q.id] === oi ? 'border-[#1D4ED8] bg-[#EAF1FF] text-[#1D4ED8]' : 'border-slate-200 text-slate-700 hover:bg-slate-50')}>
                      <input type="radio" name={`q${q.id}`} className="accent-[#1D4ED8]" checked={choices[q.id] === oi} onChange={() => setChoices({ ...choices, [q.id]: oi })} />
                      <span className="font-bold">{'ABCD'[oi]}.</span> {opt}
                    </label>
                  ))}
                </div>
              </div>
            ))}

            {content.mode === 'isian' && questions.map((q, qi) => (
              <div key={q.id}>
                <label htmlFor={`isian-${q.id}`} className="text-sm font-bold text-[#0F1E4A] block mb-1.5">{qi + 1}. {q.question}</label>
                <textarea id={`isian-${q.id}`} rows={3} value={answers[q.id] ?? ''} onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                  placeholder="Tulis jawabanmu di sini..." className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/30" />
              </div>
            ))}

            {content.mode === 'file' && (
              <div>
                <input ref={fileInput} type="file" accept={content.accept} className="hidden" onChange={(e) => pickFile(e.target.files?.[0])} />
                {file ? (
                  <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-3 flex items-center gap-3">
                    <FileCheck className="w-6 h-6 text-[#1D4ED8]" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[#0F1E4A] truncate">{file.name}</p>
                      <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <button onClick={() => setFile(null)} aria-label="Hapus file" className="text-slate-400 hover:text-red-600"><X className="w-4 h-4" /></button>
                  </div>
                ) : (
                  <button
                    onClick={() => fileInput.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => { e.preventDefault(); pickFile(e.dataTransfer.files?.[0]); }}
                    className="w-full border-2 border-dashed border-slate-300 rounded-2xl p-8 flex flex-col items-center text-center hover:border-[#1D4ED8] hover:bg-blue-50/30 transition-colors"
                  >
                    <Upload className="w-8 h-8 text-[#1D4ED8] mb-2" />
                    <span className="text-sm font-bold text-[#0F1E4A]">Klik atau seret file ke sini</span>
                    <span className="text-xs text-slate-500 mt-1">PDF, DOC/DOCX, JPG, PNG · maks. {MAX_MB} MB</span>
                  </button>
                )}
              </div>
            )}

            <div className="flex justify-end">
              <button onClick={handleSubmit} disabled={isSubmitting} className="h-11 px-6 rounded-xl bg-[#1D4ED8] hover:bg-blue-800 text-white text-sm font-bold flex items-center gap-2 disabled:opacity-50">
                <CheckCircle2 className="w-4 h-4" /> {isSubmitting ? 'Mengirim...' : 'Kumpulkan Tugas'}
              </button>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
