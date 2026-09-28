import { useMemo, useState } from 'react';
import {
  CalendarDays, ChevronLeft, ChevronRight, LayoutGrid, List, Filter, CheckCircle2, PlayCircle, Clock,
  BookOpen, User, MapPin, Video, Lock, Info,
} from 'lucide-react';
import { toast } from 'sonner';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, PageTitle, Pill, statusTone } from '../../components/siswa/PortalUI';
import { cn } from '../../lib/utils';
import { LIVE_CLASSES, WEEK_DAYS, SUBJECTS, subjectById, canJoinLive, type LiveClass, type LiveStatus, type SubjectId } from '../../data/siswaPortal';

const MONTHS = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
const BASE_MONDAY = new Date(2025, 7, 11); // Senin, 11 Agustus 2025 (minggu demo)

function weekDates(offset: number) {
  return WEEK_DAYS.map((d, i) => {
    const dt = new Date(BASE_MONDAY);
    dt.setDate(dt.getDate() + offset * 7 + i);
    return { name: d.name, date: `${dt.getDate()} ${MONTHS[dt.getMonth()]}`, day: dt.getDate(), month: dt.getMonth(), year: dt.getFullYear() };
  });
}

const STATUS_DOT: Record<LiveStatus, string> = { 'Selesai': 'bg-emerald-500', 'Berlangsung': 'bg-violet-600', 'Akan Datang': 'bg-orange-500' };

export default function JadwalBelajar() {
  const [weekOffset, setWeekOffset] = useState(0);
  const [view, setView] = useState<'minggu' | 'agenda'>('minggu');
  const [dayFilter, setDayFilter] = useState('Semua Hari');
  const [subjectFilter, setSubjectFilter] = useState<SubjectId | 'all'>('all');
  const [showFilter, setShowFilter] = useState(false);

  const days = weekDates(weekOffset);
  const weekLabel = days[0].month === days[6].month
    ? `${days[0].day} – ${days[6].day} ${MONTHS[days[6].month]} ${days[6].year}`
    : `${days[0].day} ${MONTHS[days[0].month].slice(0, 3)} – ${days[6].day} ${MONTHS[days[6].month].slice(0, 3)} ${days[6].year}`;

  // Jadwal berulang tiap minggu; status mengikuti posisi minggu terhadap minggu berjalan
  const classes: LiveClass[] = useMemo(() => LIVE_CLASSES
    .map((c) => {
      const day = days.find((d) => d.name === c.dayName)!;
      const status: LiveStatus = weekOffset < 0 ? 'Selesai' : weekOffset > 0 ? 'Akan Datang' : c.status;
      return { ...c, date: day.date, status, openedByTutor: weekOffset === 0 && c.openedByTutor };
    })
    .filter((c) => subjectFilter === 'all' || c.subjectId === subjectFilter), [weekOffset, subjectFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  const count = (s: LiveStatus) => classes.filter((c) => c.status === s).length;
  const nearest = classes.find((c) => c.status === 'Berlangsung') ?? classes.find((c) => c.status === 'Akan Datang');

  const visibleDays = dayFilter === 'Semua Hari' ? days : days.filter((d) => d.name === dayFilter);

  const join = (c: LiveClass) => {
    if (!canJoinLive(c)) {
      toast.info('Kelas belum dibuka tutor', { description: 'Tombol Masuk Kelas aktif otomatis saat tutor membuka Google Meet.' });
      return;
    }
    window.open(c.meetUrl, '_blank', 'noopener');
  };

  const stats = [
    { label: 'Total Kelas', value: classes.length, icon: CalendarDays, fg: '#1D4ED8', bg: '#EAF1FF' },
    { label: 'Selesai', value: count('Selesai'), icon: CheckCircle2, fg: '#16A34A', bg: '#E9F8EF' },
    { label: 'Akan Berlangsung', value: count('Berlangsung'), icon: PlayCircle, fg: '#7C3AED', bg: '#F3EDFF' },
    { label: 'Akan Datang', value: count('Akan Datang'), icon: Clock, fg: '#F97316', bg: '#FFF1E7' },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-[1400px] space-y-3">
        <PageTitle title="Jadwal Live Tutor" subtitle="Lihat jadwal kelas dan tutor yang mengajar minggu ini. Jadwal diatur oleh admin sesuai mata pelajaran program kamu." />

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 h-10 px-4 rounded-xl bg-white border border-slate-200 text-sm font-bold text-[#0F1E4A]">
            <CalendarDays className="w-4 h-4" /> {weekLabel}
          </div>
          <button onClick={() => setWeekOffset((w) => w - 1)} className="flex items-center gap-1.5 h-10 px-4 rounded-xl bg-white border border-slate-200 text-sm font-bold text-[#1D4ED8] hover:bg-slate-50">
            <ChevronLeft className="w-4 h-4" /> Minggu Sebelumnya
          </button>
          <button onClick={() => setWeekOffset((w) => w + 1)} className="flex items-center gap-1.5 h-10 px-4 rounded-xl bg-white border border-slate-200 text-sm font-bold text-[#1D4ED8] hover:bg-slate-50">
            Minggu Berikutnya <ChevronRight className="w-4 h-4" />
          </button>
          {weekOffset !== 0 && (
            <button onClick={() => setWeekOffset(0)} className="h-10 px-3 text-sm font-bold text-slate-500 hover:text-[#1D4ED8]">Minggu ini</button>
          )}
          <div className="flex-1" />
          <button onClick={() => setView('minggu')} className={cn('flex items-center gap-2 h-10 px-4 rounded-xl border text-sm font-bold', view === 'minggu' ? 'bg-[#1D4ED8] border-[#1D4ED8] text-white' : 'bg-white border-slate-200 text-[#0F1E4A]')}>
            <LayoutGrid className="w-4 h-4" /> Mingguan
          </button>
          <button onClick={() => setView('agenda')} className={cn('flex items-center gap-2 h-10 px-4 rounded-xl border text-sm font-bold', view === 'agenda' ? 'bg-[#1D4ED8] border-[#1D4ED8] text-white' : 'bg-white border-slate-200 text-[#0F1E4A]')}>
            <List className="w-4 h-4" /> Agenda
          </button>
          <div className="relative">
            <button onClick={() => setShowFilter((v) => !v)} className={cn('flex items-center gap-2 h-10 px-4 rounded-xl border text-sm font-bold bg-white', subjectFilter !== 'all' ? 'border-[#1D4ED8] text-[#1D4ED8]' : 'border-slate-200 text-[#0F1E4A]')}>
              <Filter className="w-4 h-4" /> Filter
            </button>
            {showFilter && (
              <>
                <div className="fixed inset-0 z-20" onClick={() => setShowFilter(false)} />
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl border border-slate-200 shadow-lg p-1.5 z-30">
                  {[{ id: 'all', name: 'Semua Mata Pelajaran' }, ...SUBJECTS].map((s) => (
                    <button key={s.id} onClick={() => { setSubjectFilter(s.id as SubjectId | 'all'); setShowFilter(false); }}
                      className={cn('w-full text-left px-3 py-2 rounded-lg text-sm font-semibold', subjectFilter === s.id ? 'bg-[#EAF1FF] text-[#1D4ED8]' : 'text-slate-700 hover:bg-slate-50')}>
                      {s.name}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Stats */}
        <Card className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-slate-100 py-3">
          {stats.map(({ label, value, icon: Icon, fg, bg }) => (
            <div key={label} className="flex items-center justify-center gap-3 px-4 py-1">
              <span className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: bg, color: fg }}><Icon className="w-6 h-6" /></span>
              <div>
                <p className="text-xs font-bold" style={{ color: fg }}>{label}</p>
                <p className="text-xl font-extrabold" style={{ color: fg }}>{value}</p>
              </div>
            </div>
          ))}
        </Card>

        {/* Kelas terdekat */}
        {nearest && (() => {
          const s = subjectById(nearest.subjectId);
          const joinable = canJoinLive(nearest);
          return (
            <Card className="p-4 bg-[#F5F8FF] border-blue-100">
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-base font-extrabold text-[#1D4ED8]">Kelas Terdekat</h2>
                <Pill tone={statusTone(nearest.status)}>{nearest.status === 'Berlangsung' ? 'Sedang Berlangsung' : nearest.status}</Pill>
              </div>
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <span className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ backgroundColor: s.soft, color: s.color }}><BookOpen className="w-7 h-7" /></span>
                  <div>
                    <p className="font-extrabold text-[#0F1E4A]">{s.className} · {nearest.topic}</p>
                    <p className="text-sm text-slate-600 font-medium">{s.tutor}</p>
                    <p className="text-sm text-slate-600 font-medium flex flex-wrap gap-x-4">
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {nearest.dayName}, {nearest.start} – {nearest.end}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {nearest.room}</span>
                    </p>
                  </div>
                </div>
                <div className="md:border-l md:border-blue-100 md:pl-6 md:pr-4">
                  <p className="text-xs text-slate-600 font-semibold">{joinable ? 'Kelas sudah dibuka tutor' : 'Status kelas'}</p>
                  <p className="text-lg font-extrabold text-[#1D4ED8]">{joinable ? 'Silakan bergabung' : 'Menunggu tutor membuka kelas'}</p>
                </div>
                <button
                  onClick={() => join(nearest)}
                  className={cn('flex items-center justify-center gap-2 h-12 px-8 rounded-xl text-sm font-bold transition-colors', joinable ? 'bg-[#1D4ED8] hover:bg-blue-800 text-white' : 'bg-slate-200 text-slate-500 cursor-not-allowed')}
                >
                  {joinable ? <Video className="w-5 h-5" /> : <Lock className="w-4 h-4" />} Masuk Kelas
                </button>
              </div>
            </Card>
          );
        })()}

        {/* Day chips */}
        <div className="flex flex-wrap gap-2">
          {['Semua Hari', ...WEEK_DAYS.map((d) => d.name).filter((d) => d !== 'Minggu')].map((d) => (
            <button key={d} onClick={() => setDayFilter(d)}
              className={cn('flex items-center gap-2 h-9 px-4 rounded-lg border text-sm font-bold', dayFilter === d ? 'bg-[#1D4ED8] border-[#1D4ED8] text-white' : 'bg-white border-slate-200 text-[#0F1E4A] hover:bg-slate-50')}>
              <CalendarDays className="w-4 h-4" /> {d}
            </button>
          ))}
        </div>

        {view === 'minggu' ? (
          <div className={cn('grid gap-2.5', visibleDays.length > 1 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-7' : 'grid-cols-1 max-w-md')}>
            {visibleDays.map((d) => {
              const list = classes.filter((c) => c.dayName === d.name);
              const isToday = weekOffset === 0 && d.name === 'Kamis';
              return (
                <Card key={d.name} className={cn('p-3 flex flex-col min-h-[220px]', isToday && 'border-[#1D4ED8] ring-1 ring-[#1D4ED8]/30 bg-[#F8FAFF]')}>
                  <div className="flex items-start justify-between pb-2 mb-2 border-b border-slate-100">
                    <div>
                      <p className={cn('font-extrabold', isToday ? 'text-[#1D4ED8]' : 'text-[#0F1E4A]')}>{d.name}</p>
                      <p className="text-xs text-slate-500 font-medium">{d.date}</p>
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 rounded px-1.5 py-0.5">{list.length} sesi</span>
                  </div>
                  {list.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-400">
                      <CalendarDays className="w-8 h-8 mb-2" />
                      <p className="text-xs font-medium">Tidak ada jadwal belajar di hari ini.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {list.map((c) => {
                        const s = subjectById(c.subjectId);
                        return (
                          <div key={c.id} className="space-y-1 text-[12px] text-slate-600 font-medium">
                            <p className="flex items-center gap-1.5 font-bold text-[#0F1E4A]"><BookOpen className="w-3.5 h-3.5" style={{ color: s.color }} /> {s.className}</p>
                            <p className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> {s.tutor}</p>
                            <p className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {c.start} – {c.end}</p>
                            <p className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {c.room}</p>
                            <div className="flex items-center justify-between gap-2 pt-0.5">
                              <Pill tone={statusTone(c.status)}>{c.status}</Pill>
                              {c.status === 'Berlangsung' && (
                                <button onClick={() => join(c)} className={cn('text-[11px] font-bold px-2 py-1 rounded-md', canJoinLive(c) ? 'bg-[#1D4ED8] text-white' : 'bg-slate-100 text-slate-400')}>Masuk</button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="divide-y divide-slate-100">
            {visibleDays.flatMap((d) => classes.filter((c) => c.dayName === d.name)).length === 0 && (
              <p className="p-6 text-sm text-slate-500 text-center">Tidak ada jadwal.</p>
            )}
            {visibleDays.flatMap((d) => classes.filter((c) => c.dayName === d.name)).map((c) => {
              const s = subjectById(c.subjectId);
              return (
                <div key={c.id} className="flex flex-wrap items-center gap-4 px-4 py-3">
                  <div className="w-28 text-sm"><p className="font-extrabold text-[#0F1E4A]">{c.dayName}</p><p className="text-xs text-slate-500">{c.date}</p></div>
                  <div className="w-28 text-sm font-bold text-slate-700">{c.start} – {c.end}</div>
                  <div className="flex-1 min-w-[180px]"><p className="font-bold text-[#0F1E4A] text-sm">{s.className}</p><p className="text-xs text-slate-500">{c.topic} · {s.tutor}</p></div>
                  <div className="text-xs text-slate-500 w-40">{c.room}</div>
                  <Pill tone={statusTone(c.status)}>{c.status}</Pill>
                  <button onClick={() => join(c)} disabled={c.status !== 'Berlangsung'}
                    className={cn('h-8 px-3 rounded-lg text-xs font-bold', canJoinLive(c) ? 'bg-[#1D4ED8] text-white' : 'bg-slate-100 text-slate-400')}>
                    Masuk Kelas
                  </button>
                </div>
              );
            })}
          </Card>
        )}

        {/* Tips + legend */}
        <Card className="px-4 py-3 bg-[#F5F8FF] border-blue-100 flex flex-wrap items-center gap-x-6 gap-y-2">
          <p className="flex items-center gap-2 text-sm text-slate-700 font-medium flex-1 min-w-[260px]">
            <Info className="w-5 h-5 text-[#1D4ED8]" />
            <span><b className="text-[#1D4ED8]">Tips:</b> Kelas online memakai Google Meet. Tombol <b>Masuk Kelas</b> aktif saat tutor sudah membuka kelas.</span>
          </p>
          {(Object.keys(STATUS_DOT) as LiveStatus[]).map((s) => (
            <span key={s} className="flex items-center gap-1.5 text-xs font-semibold text-slate-600"><span className={cn('w-2.5 h-2.5 rounded-full', STATUS_DOT[s])} /> {s === 'Berlangsung' ? 'Akan/Sedang Berlangsung' : s}</span>
          ))}
          <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-600"><span className="w-2.5 h-2.5 rounded-full bg-slate-300" /> Tidak Ada Kelas</span>
        </Card>
      </div>
    </DashboardLayout>
  );
}
