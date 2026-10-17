import { useMemo, useState } from 'react';
import { Search, ArrowRight, ChevronDown } from 'lucide-react';
import { openRegistration } from './RegistrationForm';

const IMG = {
  math: '/assets/landing/course-math.jpg',
  physics: '/assets/landing/course-physics.jpg',
  english: '/assets/landing/course-english.jpg',
  science: '/assets/landing/programs/wonderworld.jpg',
  chemistry: '/assets/landing/programs/science-mastery.jpg',
  mandarin: '/assets/landing/programs/mandarin.jpg',
  abacus: '/assets/landing/programs/abacus.jpg',
  literacy: '/assets/landing/programs/literacy.jpg',
};

const LEVELS = ['Early Childhood', 'Kids', 'Teens'] as const;
const SUBJECTS = ['English', 'Math', 'Science', 'Mandarin', 'Abacus', 'Literacy', 'Physics', 'Chemistry'] as const;

type Course = { id: number; level: typeof LEVELS[number]; subject: typeof SUBJECTS[number]; topic: string; title: string; tutor: string; price: number; image: string };

const ALL_COURSES: Course[] = [
  { id: 1, level: 'Early Childhood', subject: 'English', topic: 'Phonics & Alphabet', title: 'Phonics Fun: Mengenal Bunyi Huruf', tutor: 'Kak Fitri', price: 150_000, image: IMG.english },
  { id: 2, level: 'Early Childhood', subject: 'Math', topic: 'Mengenal Angka', title: 'Mengenal Angka 1–20', tutor: 'Kak Andi', price: 150_000, image: IMG.math },
  { id: 3, level: 'Kids', subject: 'Math', topic: 'Pecahan', title: 'Pecahan & Desimal Kelas 4–5', tutor: 'Kak Andi', price: 199_000, image: IMG.math },
  { id: 4, level: 'Kids', subject: 'Math', topic: 'Soal Cerita', title: 'Strategi Soal Cerita Matematika', tutor: 'Kak Aditya', price: 199_000, image: IMG.math },
  { id: 5, level: 'Kids', subject: 'English', topic: 'Grammar', title: 'Grammar Fundamental: Simple Tenses', tutor: 'Kak Sinta', price: 225_000, image: IMG.english },
  { id: 6, level: 'Kids', subject: 'English', topic: 'Speaking', title: 'Speaking Confidence for Kids', tutor: 'Kak Fitri', price: 225_000, image: IMG.english },
  { id: 7, level: 'Kids', subject: 'Science', topic: 'Tumbuhan & Hewan', title: 'Makhluk Hidup di Sekitar Kita', tutor: 'Kak Nurul', price: 199_000, image: IMG.science },
  { id: 8, level: 'Kids', subject: 'Mandarin', topic: 'Pinyin', title: 'Pinyin & 4 Nada Dasar', tutor: 'Laoshi Mei', price: 199_000, image: IMG.mandarin },
  { id: 9, level: 'Kids', subject: 'Abacus', topic: 'Mental Arithmetic', title: 'Abacus Level 1: Penjumlahan', tutor: 'Kak Rina', price: 175_000, image: IMG.abacus },
  { id: 10, level: 'Kids', subject: 'Literacy', topic: 'Reading Comprehension', title: 'Memahami Ide Pokok Bacaan', tutor: 'Kak Sinta', price: 175_000, image: IMG.literacy },
  { id: 11, level: 'Teens', subject: 'Math', topic: 'Aljabar', title: 'Aljabar & Persamaan Linear SMP', tutor: 'Kak Aditya', price: 249_000, image: IMG.math },
  { id: 12, level: 'Teens', subject: 'Physics', topic: 'Mekanika', title: 'Fisika: Gerak & Hukum Newton', tutor: 'Kak Raka', price: 325_000, image: IMG.physics },
  { id: 13, level: 'Teens', subject: 'Physics', topic: 'Listrik & Magnet', title: 'Fisika: Listrik & Magnet', tutor: 'Kak Raka', price: 325_000, image: IMG.physics },
  { id: 14, level: 'Teens', subject: 'Chemistry', topic: 'Stoikiometri', title: 'Kimia: Mol & Stoikiometri', tutor: 'Kak Dimas', price: 325_000, image: IMG.chemistry },
  { id: 15, level: 'Teens', subject: 'English', topic: 'Reading & Writing', title: 'Academic Reading & Writing', tutor: 'Kak Sinta', price: 249_000, image: IMG.english },
];

const MAX_CARDS = 6;
type Filters = { level: string; subject: string; topic: string };
const EMPTY: Filters = { level: '', subject: '', topic: '' };

function PillSelect({ value, onChange, placeholder, options }: { value: string; onChange: (v: string) => void; placeholder: string; options: readonly string[] }) {
  return (
    <div className="relative flex-1 min-w-[150px]">
      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={placeholder}
        className="w-full appearance-none bg-white text-slate-700 font-bold pl-9 pr-9 h-11 rounded-full border border-[#DCE3EE] text-sm shadow-sm hover:border-[#062564] focus:outline-none focus:ring-2 focus:ring-[#062564]/30 cursor-pointer"
      >
        <option value="">{placeholder}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
    </div>
  );
}

const matches = (c: Course, f: Filters) => (!f.level || c.level === f.level) && (!f.subject || c.subject === f.subject) && (!f.topic || c.topic === f.topic);

export function CourseSearchSection() {
  const [draft, setDraft] = useState<Filters>(EMPTY);
  const [applied, setApplied] = useState<Filters>(EMPTY);

  // Topics offered for the chosen level + subject
  const topics = useMemo(
    () => [...new Set(ALL_COURSES.filter((c) => matches(c, { ...draft, topic: '' })).map((c) => c.topic))],
    [draft.level, draft.subject],
  );
  const results = ALL_COURSES.filter((c) => matches(c, applied)).slice(0, MAX_CARDS);

  return (
    <section id="kursus-materi" className="py-14 bg-white relative scroll-mt-32">
      <div className="max-w-[1240px] mx-auto px-6 relative z-10">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-6 text-[#E52833] uppercase tracking-wide text-center">
          Kursus Per Materi
        </h2>

        <div className="flex flex-col sm:flex-row gap-3 max-w-[900px] mx-auto mb-8">
          <PillSelect value={draft.level} onChange={(v) => setDraft({ ...draft, level: v, topic: '' })} placeholder="Pilih Jenjang" options={LEVELS} />
          <PillSelect value={draft.subject} onChange={(v) => setDraft({ ...draft, subject: v, topic: '' })} placeholder="Pilih Pelajaran" options={SUBJECTS} />
          <PillSelect value={draft.topic} onChange={(v) => setDraft({ ...draft, topic: v })} placeholder="Pilih Topik" options={topics} />
          <button
            onClick={() => setApplied(draft)}
            className="flex-1 min-w-[150px] h-11 flex items-center justify-center gap-2 bg-[#F16710] text-white font-extrabold px-6 rounded-full text-sm shadow-md shadow-orange-500/20 hover:bg-[#d95b0e] transition-colors cursor-pointer"
          >
            <Search className="w-4 h-4" /> Cari Program
          </button>
        </div>

        {results.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {results.map((course) => (
              <div key={course.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-[#DCE3EE] flex flex-col hover:shadow-lg hover:-translate-y-0.5 transition-all group">
                <div className="aspect-[3/2] relative overflow-hidden">
                  <img src={course.image} alt={course.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className="absolute top-2 left-2 bg-white/95 text-[10px] font-bold px-2 py-0.5 rounded text-[#062564] shadow-sm">{course.subject}</span>
                </div>
                <div className="p-3 flex-1 flex flex-col">
                  <p className="text-[10px] font-extrabold text-[#F16710] uppercase tracking-wide mb-1">{course.level} · {course.topic}</p>
                  <h4 className="font-bold text-[#062564] text-[13px] mb-2 leading-snug">{course.title}</h4>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-3 font-semibold">
                    <span className="w-4 h-4 rounded-full bg-red-100 text-[#E52833] text-[9px] font-extrabold flex items-center justify-center">
                      {course.tutor.split(' ').pop()!.charAt(0)}
                    </span>
                    {course.tutor}
                  </div>
                  <div className="mt-auto pt-2.5 border-t border-[#DCE3EE] flex justify-between items-center">
                    <span className="text-[#E52833] font-extrabold text-sm">Rp{course.price.toLocaleString('id-ID')}</span>
                    <button
                      onClick={() => openRegistration(`Kursus: ${course.title}`, course.level)}
                      className="text-[11px] font-bold text-[#062564] flex items-center gap-0.5 hover:underline cursor-pointer"
                    >
                      Daftar <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <p className="text-slate-600 font-medium">Belum ada kursus untuk pilihan ini.</p>
            <button onClick={() => { setDraft(EMPTY); setApplied(EMPTY); }} className="mt-3 text-xs font-bold text-blue-600 hover:underline cursor-pointer">
              Tampilkan semua kursus
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
