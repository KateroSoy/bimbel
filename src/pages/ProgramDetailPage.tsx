import { useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, CalendarDays, CheckCircle2, Clock, MonitorSmartphone, Tag } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { RegistrationForm, RegistrationModalHost } from '../components/landing/RegistrationForm';
import { ChatWidget } from '../components/landing/ChatWidget';
import { ProgramCard } from '../components/landing/ProgramBelajarSection';
import { findProgram, LANDING_PROGRAMS, ribu } from '../data/landingPrograms';

export default function ProgramDetailPage() {
  const { slug = '' } = useParams<{ slug: string }>();
  const program = findProgram(slug);

  useEffect(() => {
    window.scrollTo({ top: 0 });
    if (program) document.title = `${program.name} · StudyHack Education Center`;
  }, [program]);

  if (!program) return <Navigate to="/#program" replace />;

  const methods = program.method.toLowerCase().includes('online') ? ['Tatap Muka', 'Online'] : ['Tatap Muka'];
  const level = program.group === 'Early Childhood' ? 'Early Childhood' : program.group === 'Specialization' ? undefined : 'Kids';
  const related = LANDING_PROGRAMS.filter((p) => p.group === program.group && p.slug !== program.slug).slice(0, 3);
  const [title, tagline] = program.headline.split(' — ');

  return (
    <div className="landing-font min-h-screen bg-white text-[#171719] overflow-x-hidden">
      <Navbar />

      <section className="pt-32 md:pt-[140px] pb-14 bg-gradient-to-b from-[#F0F6FE] to-white">
        <div className="max-w-[1240px] mx-auto px-6">
          <Link to="/#program" className="inline-flex items-center gap-2 text-sm font-bold text-[#062564] hover:text-[#F16710] mb-6">
            <ArrowLeft className="w-4 h-4" /> Kembali ke Program Pilihan
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-[1.25fr_1fr] gap-10 items-start">
            <article>
              <span className="inline-block px-3 py-1 rounded-full bg-[#F16710] text-white text-[11px] font-extrabold uppercase tracking-wide mb-4">{program.group}</span>
              <h1 className="text-3xl md:text-[42px] font-extrabold text-[#062564] leading-tight mb-2">{title}</h1>
              {tagline && <p className="text-xl md:text-2xl font-extrabold text-[#F16710] mb-6">{tagline}</p>}

              <div className="rounded-2xl overflow-hidden aspect-[16/8] mb-7 shadow-sm border border-[#DCE3EE]">
                <img src={program.image} alt={program.name} className="w-full h-full object-cover object-top" />
              </div>

              <div className="space-y-4 text-[15px] leading-relaxed text-slate-700 font-medium mb-8">
                {program.intro.map((p) => <p key={p}>{p}</p>)}
              </div>

              <h2 className="text-xl font-extrabold text-[#062564] mb-4">{program.pointsTitle}</h2>
              <ul className="space-y-3 mb-8">
                {program.points.map((pt) => (
                  <li key={pt.title} className="flex gap-3 bg-white border border-[#DCE3EE] rounded-xl p-4">
                    <CheckCircle2 className="w-5 h-5 text-[#19A66A] shrink-0 mt-0.5" />
                    <p className="text-sm text-slate-700 font-medium leading-relaxed"><strong className="text-[#062564]">{pt.title}:</strong> {pt.text}</p>
                  </li>
                ))}
              </ul>

              <h2 className="text-xl font-extrabold text-[#062564] mb-4">Detail Program</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                {[
                  { icon: MonitorSmartphone, label: 'Metode', value: program.method },
                  { icon: CalendarDays, label: 'Frekuensi', value: program.frequency },
                  { icon: Clock, label: 'Durasi', value: program.duration },
                  { icon: Tag, label: 'Biaya', value: `${ribu(program.price)}/bulan` },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="rounded-xl bg-[#F0F6FE] border border-[#DCE3EE] p-3.5">
                    <Icon className="w-5 h-5 text-[#205C96] mb-1.5" />
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">{label}</p>
                    <p className="text-sm font-extrabold text-[#062564]">{value}</p>
                  </div>
                ))}
              </div>

              <p className="text-base font-extrabold text-[#062564] mb-1.5">{program.closing}</p>
              <p className="text-base font-semibold text-[#F16710]">{program.cta}</p>
            </article>

            <aside id="daftar" className="lg:sticky lg:top-[130px] bg-white rounded-3xl border border-[#DCE3EE] shadow-lg p-6 md:p-7 scroll-mt-32">
              <h2 className="text-2xl font-extrabold text-[#062564] mb-1">Daftar {program.name}</h2>
              <p className="text-sm text-slate-500 font-medium mb-5">Isi formulir, tim StudyHack akan menghubungi Anda untuk Tes Diagnostik GRATIS.</p>
              <RegistrationForm program={program.name} methods={methods} level={level} />
            </aside>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="pb-16 bg-white">
          <div className="max-w-[1240px] mx-auto px-6">
            <h2 className="text-2xl font-extrabold text-[#062564] mb-5">Program {program.group} lainnya</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((p) => <ProgramCard key={p.slug} prog={p} />)}
            </div>
          </div>
        </section>
      )}

      <Footer />
      <RegistrationModalHost />
      <ChatWidget />
    </div>
  );
}
