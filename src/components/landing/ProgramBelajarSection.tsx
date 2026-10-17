import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Tag } from 'lucide-react';
import { cn } from '../../lib/utils';
import { LANDING_PROGRAMS, PROGRAM_GROUPS, ribu, type LandingProgram, type ProgramGroup } from '../../data/landingPrograms';

type Tab = 'Semua Program' | ProgramGroup;
const TABS: Tab[] = ['Semua Program', ...PROGRAM_GROUPS];

export function ProgramCard({ prog }: { prog: LandingProgram }) {
  return (
    <div className="bg-white border border-[#DCE3EE] rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col shadow-sm hover:-translate-y-1">
      <div className="aspect-[16/9] overflow-hidden bg-slate-100">
        <img src={prog.image} alt={prog.name} loading="lazy" className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500" />
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-extrabold text-[#062564] text-xl leading-tight mb-2">{prog.name}</h3>
        <p className="text-[13px] text-slate-600 mb-4 font-medium leading-relaxed">{prog.summary}</p>

        <div className="space-y-1.5 mb-4 flex-1">
          {[prog.highlight, prog.frequency, prog.duration.replace(' per sesi', '/sesi')].map((feat) => (
            <div key={feat} className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-[#F16710] shrink-0 mt-0.5" strokeWidth={3} />
              <span className="text-[13px] font-semibold text-slate-700">{feat}</span>
            </div>
          ))}
        </div>

        <div className="self-start inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border-2 border-[#F16710] bg-orange-50/60 mb-3">
          <Tag className="w-4 h-4 text-[#F16710] fill-[#F16710]" />
          <span className="text-lg font-extrabold text-[#062564]">{ribu(prog.price)}</span>
          <span className="text-[11px] font-bold text-slate-500">/bulan</span>
        </div>

        <Link to={`/program/${prog.slug}`} className="inline-flex items-center gap-2 text-[#1D3FD8] font-bold text-sm hover:text-blue-800 transition-colors">
          Selengkapnya <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

export function ProgramBelajarSection() {
  const [activeTab, setActiveTab] = useState<Tab>('Semua Program');
  const groups = activeTab === 'Semua Program' ? PROGRAM_GROUPS : [activeTab];

  return (
    <section id="program" className="py-14 bg-white scroll-mt-32">
      <div className="max-w-[1240px] mx-auto px-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-[34px] font-extrabold text-[#062564] mb-5">Program Pilihan</h2>

          <div className="flex flex-wrap justify-center gap-2.5" role="tablist">
            {TABS.map((tab) => (
              <button
                key={tab}
                role="tab"
                aria-selected={activeTab === tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'px-5 py-1.5 rounded-full text-[13px] font-bold transition-all border cursor-pointer',
                  activeTab === tab
                    ? 'bg-[#062564] text-white border-[#062564]'
                    : 'bg-white text-[#5D6263] border-[#DCE3EE] hover:border-[#062564] hover:text-[#062564]',
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-10">
          {groups.map((group) => (
            <div key={group}>
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#F16710] mb-4">{group}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {LANDING_PROGRAMS.filter((p) => p.group === group).map((prog) => <ProgramCard key={prog.slug} prog={prog} />)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
