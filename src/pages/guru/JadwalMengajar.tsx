import { useState } from 'react';
import { CalendarDays, Clock, BookOpen, AlertTriangle, Plus, ChevronLeft, ChevronRight, LayoutGrid, List } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { PageHead, StatStrip, Btn, Select, WeekGrid, DotLegend, Panel, Modal, KeyValues, Badge } from '../../components/portal/Kit';
import { TEACH_DAYS, TEACH_SLOTS, TEACH_SESSIONS, type TeachSession } from '../../data/guruPortal';
import { RequestChangeDialog } from './KelasSaya';
import { cn } from '../../lib/utils';

const TODAY = 2;
const duration = (slot: string) => {
  const [a, b] = slot.split(' – ').map((t) => Number(t.slice(0, 2)) + Number(t.slice(3)) / 60);
  return b - a;
};
const flag = (s: TeachSession) => (s.mark === 'next' ? <span className="w-2.5 h-2.5 rounded-full bg-[#1D4ED8] shrink-0 mt-0.5" title="Sesi berikutnya" /> : s.mark === 'clash' ? <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" /> : undefined);

export default function JadwalMengajar() {
  const [view, setView] = useState<'Mingguan' | 'Agenda'>('Mingguan');
  const [kelas, setKelas] = useState('');
  const [selected, setSelected] = useState<TeachSession | null>(null);
  const [requesting, setRequesting] = useState(false);

  const sessions = TEACH_SESSIONS.filter((s) => !kelas || s.kelas === kelas);
  const hours = TEACH_SESSIONS.reduce((a, s) => a + duration(TEACH_SLOTS[s.slot]), 0);
  const clashes = TEACH_SESSIONS.filter((s) => s.mark === 'clash').length;

  return (
    <DashboardLayout>
      <div className="space-y-4 max-w-[1300px]">
        <PageHead title="Jadwal Mengajar" subtitle="Lihat jadwal mengajar, kelas, dan ruang Anda." />
        <StatStrip
          items={[
            { icon: CalendarDays, value: TEACH_SESSIONS.length, label: 'sesi', color: '#0F1E4A' },
            { icon: Clock, value: String(hours).replace('.', ','), label: 'jam', color: '#0F1E4A' },
            { icon: BookOpen, value: new Set(TEACH_SESSIONS.map((s) => s.subject)).size, label: 'mata pelajaran', color: '#0F1E4A' },
            { icon: AlertTriangle, value: clashes, label: 'bentrok', color: '#EF4444' },
          ]}
          action={<Btn variant="primary" icon={Plus} onClick={() => setRequesting(true)}>Ajukan Perubahan</Btn>}
        />

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 pt-4">
          <div className="flex items-center gap-2">
            <span className="w-10 h-10 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-400"><ChevronLeft className="w-4 h-4" /></span>
            <span className="inline-flex items-center gap-2 h-10 px-4 rounded-lg border border-slate-200 bg-white text-sm font-extrabold text-[#0F1E4A]"><CalendarDays className="w-4 h-4" /> 11 – 17 Agustus 2026</span>
            <span className="w-10 h-10 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-400"><ChevronRight className="w-4 h-4" /></span>
            <Btn variant="ghost" onClick={() => setView('Agenda')}>Hari Ini</Btn>
          </div>
          <div className="flex items-center gap-2">
            {([['Mingguan', LayoutGrid], ['Agenda', List]] as const).map(([v, Icon]) => (
              <button key={v} onClick={() => setView(v)} className={cn('h-10 px-4 rounded-lg border text-[13px] font-bold flex items-center gap-2', view === v ? 'bg-[#1D4ED8] border-[#1D4ED8] text-white' : 'bg-white border-slate-200 text-slate-700')}><Icon className="w-4 h-4" /> {v}</button>
            ))}
            <Select value={kelas} onChange={setKelas} all="Semua Kelas" options={[...new Set(TEACH_SESSIONS.map((s) => s.kelas))]} />
          </div>
        </div>

        {view === 'Mingguan' ? (
          <WeekGrid days={TEACH_DAYS} slots={TEACH_SLOTS} today={TODAY} sessions={sessions.map((s) => ({ ...s, flag: flag(s) }))} onSelect={(s) => setSelected(TEACH_SESSIONS.find((t) => t.id === s.id) ?? null)} />
        ) : (
          <div className="space-y-3">
            {TEACH_DAYS.map((d, di) => {
              const list = sessions.filter((s) => s.day === di).sort((a, b) => a.slot - b.slot);
              if (list.length === 0) return null;
              return (
                <Panel key={d.name} title={<span className="flex items-center gap-2">{d.name}, {d.date} {di === TODAY && <Badge tone="blue">Hari Ini</Badge>}</span>}>
                  <ul className="divide-y divide-slate-100">
                    {list.map((s) => (
                      <li key={s.id}>
                        <button onClick={() => setSelected(s)} className="w-full flex items-center gap-3 py-2.5 text-left hover:bg-slate-50 rounded-lg px-1">
                          <span className="w-[110px] text-[13px] font-extrabold text-[#0F1E4A] shrink-0">{TEACH_SLOTS[s.slot]}</span>
                          <span className="flex-1 min-w-0"><span className="block text-sm font-bold text-[#0F1E4A]">{s.subject} · {s.kelas}</span><span className="block text-xs text-slate-500 font-medium">{s.room}</span></span>
                          {s.mark === 'clash' && <Badge tone="red"><AlertTriangle className="w-3 h-3" /> Bentrok</Badge>}
                          {s.mark === 'next' && <Badge tone="blue">Sesi Berikutnya</Badge>}
                        </button>
                      </li>
                    ))}
                  </ul>
                </Panel>
              );
            })}
          </div>
        )}

        <div className="rounded-2xl border border-slate-200 bg-white px-5 py-3 flex flex-wrap items-center gap-x-6 gap-y-2">
          <DotLegend items={[{ label: 'Batch UTBK 1', color: '#16A34A' }, { label: 'Batch Kedinasan 2', color: '#0EA5B7' }, { label: 'English Level 1', color: '#7C3AED' }, { label: 'Batch XI RPL', color: '#F97316' }, { label: 'Sesi Berikutnya', color: '#1D4ED8' }]} />
          <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-700"><AlertTriangle className="w-4 h-4 text-red-500" /> Bentrok</span>
        </div>

        <Modal
          open={!!selected}
          title="Detail Sesi"
          onClose={() => setSelected(null)}
          footer={<>
            <Btn variant="ghost" onClick={() => setSelected(null)}>Tutup</Btn>
            <Btn onClick={() => { setSelected(null); setRequesting(true); }}>Ajukan Perubahan</Btn>
            <Btn variant="primary" to="/guru/absensi">Buka Presensi</Btn>
          </>}
        >
          {selected && (
            <>
              {selected.mark === 'clash' && <p className="mb-3 rounded-lg bg-red-50 border border-red-100 px-3 py-2 text-xs font-semibold text-red-700 flex items-center gap-2"><AlertTriangle className="w-4 h-4 shrink-0" /> Sesi ini bentrok dengan jadwal lain pada jam berdekatan. Ajukan perubahan ke Admin.</p>}
              <KeyValues rows={[['Mata Pelajaran', selected.subject], ['Kelas', selected.kelas], ['Hari', `${TEACH_DAYS[selected.day].name}, ${TEACH_DAYS[selected.day].date}`], ['Jam', TEACH_SLOTS[selected.slot]], ['Ruang', selected.room]]} />
            </>
          )}
        </Modal>
        <RequestChangeDialog open={requesting} onClose={() => setRequesting(false)} />
      </div>
    </DashboardLayout>
  );
}
