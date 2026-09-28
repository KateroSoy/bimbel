import { useState } from 'react';
import { Search, Star, ArrowRight, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '../../lib/utils';

const IMG = {
  math: '/assets/landing/course-math.jpg',
  physics: '/assets/landing/course-physics.jpg',
  english: '/assets/landing/course-english.jpg',
};

const ALL_COURSES = [
  { id: 1, tag: 'Matematika', category: 'SD', metode: 'Offline', cabang: 'Bandung Dago', rating: 4.8, students: 120, title: 'Matematika Dasar Kelas 6', tutor: 'Kak Aditya', price: 'Rp199.000', image: IMG.math },
  { id: 2, tag: 'Fisika', category: 'SMA', metode: 'Online', cabang: 'Jakarta Selatan', rating: 4.7, students: 84, title: 'Fisika SMA: Mekanika Dasar', tutor: 'Kak Raka', price: 'Rp325.000', image: IMG.physics },
  { id: 3, tag: 'Matematika', category: 'SMP', metode: 'Privat', cabang: 'Bandung Dago', rating: 4.8, students: 120, title: 'Aljabar & Geometri SMP', tutor: 'Kak Aditya', price: 'Rp199.000', image: IMG.math },
  { id: 4, tag: 'Bahasa Inggris', category: 'UTBK', metode: 'Online', cabang: 'Surabaya Timur', rating: 5.0, students: 215, title: 'Bahasa Inggris: Grammar Fundamental', tutor: 'Kak Sinta', price: 'Rp225.000', image: IMG.english },
  { id: 5, tag: 'Fisika', category: 'Ujian Sekolah', metode: 'Offline', cabang: 'Jakarta Selatan', rating: 4.7, students: 64, title: 'Fisika SMA: Listrik & Magnet', tutor: 'Kak Raka', price: 'Rp325.000', image: IMG.physics },
  { id: 6, tag: 'Bahasa Inggris', category: 'SMP', metode: 'Offline', cabang: 'Bandung Dago', rating: 5.0, students: 215, title: 'Bahasa Inggris: Reading & Writing', tutor: 'Kak Sinta', price: 'Rp225.000', image: IMG.english },
  { id: 7, tag: 'Matematika', category: 'SMA', metode: 'Privat', cabang: 'Surabaya Timur', rating: 4.9, students: 98, title: 'Trigonometri SMA', tutor: 'Kak Aditya', price: 'Rp249.000', image: IMG.math },
  { id: 8, tag: 'Matematika', category: 'UTBK', metode: 'Online', cabang: 'Jakarta Selatan', rating: 4.8, students: 176, title: 'Penalaran Matematika UTBK', tutor: 'Kak Dimas', price: 'Rp275.000', image: IMG.math },
];

const FILTER_PILLS = ['SD', 'SMP', 'SMA', 'UTBK', 'Ujian Sekolah', 'Privat', 'Online', 'Offline'];
const MAX_CARDS = 6;

type Filters = { jenjang: string; metode: string; cabang: string };
const EMPTY_FILTERS: Filters = { jenjang: '', metode: '', cabang: '' };

function PillSelect({ value, onChange, placeholder, options }: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  options: string[];
}) {
  return (
    <div className="relative flex-1 min-w-[150px]">
      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none bg-white text-slate-700 font-bold pl-9 pr-9 h-11 rounded-full border border-[#DCE3EE] text-sm shadow-sm hover:border-[#062564] focus:outline-none focus:ring-2 focus:ring-[#062564]/30 cursor-pointer"
      >
        <option value="">{placeholder}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
    </div>
  );
}

export function CourseSearchSection() {
  const [selectedPill, setSelectedPill] = useState<string | null>(null);
  const [draft, setDraft] = useState<Filters>(EMPTY_FILTERS);
  const [applied, setApplied] = useState<Filters>(EMPTY_FILTERS);

  const filteredCourses = ALL_COURSES.filter(course => {
    const matchesPill = !selectedPill || course.category === selectedPill || course.metode === selectedPill;
    const matchesJenjang = !applied.jenjang || course.category === applied.jenjang;
    const matchesMetode = !applied.metode || course.metode === applied.metode;
    const matchesCabang = !applied.cabang || course.cabang === applied.cabang;
    return matchesPill && matchesJenjang && matchesMetode && matchesCabang;
  }).slice(0, MAX_CARDS);

  const handleSearch = () => {
    setApplied(draft);
    toast.info("Menampilkan materi sesuai pencarian");
  };

  const resetAll = () => {
    setSelectedPill(null);
    setDraft(EMPTY_FILTERS);
    setApplied(EMPTY_FILTERS);
  };

  const handleEnroll = (courseTitle: string) => {
    toast.success(`Pendaftaran ${courseTitle} berhasil dipilih!`, {
      description: "Tim konsultan akan segera mengonfirmasi jadwal belajar Anda."
    });
  };

  return (
    <section id="kursus-materi" className="py-14 bg-white relative scroll-mt-32">
      <div className="max-w-[1240px] mx-auto px-6 relative z-10">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-6 text-[#E52833] uppercase tracking-wide text-center">
          Kursus Per Materi
        </h2>

        {/* Filter bar — one row */}
        <div className="flex flex-col sm:flex-row gap-3 max-w-[900px] mx-auto mb-4">
          <PillSelect
            value={draft.jenjang}
            onChange={(v) => setDraft({ ...draft, jenjang: v })}
            placeholder="Pilih Jenjang"
            options={['SD', 'SMP', 'SMA', 'UTBK']}
          />
          <PillSelect
            value={draft.metode}
            onChange={(v) => setDraft({ ...draft, metode: v })}
            placeholder="Pilih Metode"
            options={['Online', 'Offline', 'Privat']}
          />
          <PillSelect
            value={draft.cabang}
            onChange={(v) => setDraft({ ...draft, cabang: v })}
            placeholder="Pilih Kota/Cabang"
            options={['Jakarta Selatan', 'Bandung Dago', 'Surabaya Timur']}
          />
          <button
            onClick={handleSearch}
            className="flex-1 min-w-[150px] h-11 flex items-center justify-center gap-2 bg-[#F16710] text-white font-extrabold px-6 rounded-full text-sm shadow-md shadow-orange-500/20 hover:bg-[#d95b0e] transition-colors cursor-pointer"
          >
            <Search className="w-4 h-4" /> Cari Program
          </button>
        </div>

        {/* Quick filter pills — one row */}
        <div className="flex gap-2 max-w-[900px] mx-auto mb-8 overflow-x-auto pb-1 sm:justify-between [scrollbar-width:none]">
          {FILTER_PILLS.map(pill => (
            <button
              key={pill}
              onClick={() => setSelectedPill(selectedPill === pill ? null : pill)}
              className={cn(
                "shrink-0 sm:flex-1 px-4 py-1.5 rounded-full text-xs font-bold transition-all border whitespace-nowrap cursor-pointer",
                selectedPill === pill
                  ? 'bg-[#062564] text-white border-[#062564]'
                  : 'bg-white text-slate-600 border-[#DCE3EE] hover:border-[#062564] hover:text-[#062564]'
              )}
            >
              {pill}
            </button>
          ))}
        </div>

        {/* Course cards — one row on desktop */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {filteredCourses.map((course) => (
              <div key={course.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-[#DCE3EE] flex flex-col hover:shadow-lg hover:-translate-y-0.5 transition-all group">
                <div className="aspect-[3/2] relative overflow-hidden">
                  <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className="absolute top-2 left-2 bg-white/95 text-[10px] font-bold px-2 py-0.5 rounded text-[#062564] shadow-sm">
                    {course.tag}
                  </span>
                </div>
                <div className="p-3 flex-1 flex flex-col">
                  <div className="flex items-center gap-1 mb-1">
                    <Star className="w-3 h-3 text-amber-400 fill-current"/>
                    <span className="text-[11px] font-bold text-slate-700">{course.rating}</span>
                    <span className="text-[10px] text-slate-400">({course.students} siswa)</span>
                  </div>
                  <h4 className="font-bold text-[#062564] text-[13px] mb-2 leading-snug">{course.title}</h4>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-3 font-semibold">
                    <span className="w-4 h-4 rounded-full bg-red-100 text-[#E52833] text-[9px] font-extrabold flex items-center justify-center">
                      {course.tutor.replace('Kak ', '').charAt(0)}
                    </span>
                    {course.tutor}
                  </div>
                  <div className="mt-auto pt-2.5 border-t border-[#DCE3EE] flex justify-between items-center">
                    <span className="text-[#E52833] font-extrabold text-sm">{course.price}</span>
                    <button
                      onClick={() => handleEnroll(course.title)}
                      className="text-[11px] font-bold text-[#062564] flex items-center gap-0.5 hover:underline cursor-pointer"
                    >
                      Daftar <ArrowRight className="w-3 h-3"/>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <p className="text-slate-600 font-medium">Tidak ada kursus yang cocok dengan filter yang dipilih.</p>
            <button onClick={resetAll} className="mt-3 text-xs font-bold text-blue-600 hover:underline cursor-pointer">
              Tampilkan semua kursus
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
