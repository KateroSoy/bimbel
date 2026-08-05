import { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Calendar, Clock, Plus, Trash2, User, BookOpen } from 'lucide-react';
import { useDataStore, ScheduleItem } from '../../store/useDataStore';
import { ScheduleFormDialog } from '../../components/common/ScheduleFormDialog';
import { motion } from 'motion/react';
import { toast } from 'sonner';

const DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

export default function JadwalBelajar() {
  const { schedules, addSchedule, deleteSchedule } = useDataStore();
  const [formOpen, setFormOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState('all');

  const handleAddSchedule = (data: Omit<ScheduleItem, 'id'>) => {
    addSchedule(data);
    toast.success('Jadwal pelajaran berhasil ditambahkan');
  };

  const handleDelete = (id: string) => {
    if (confirm('Hapus jadwal pelajaran ini?')) {
      deleteSchedule(id);
      toast.success('Jadwal berhasil dihapus');
    }
  };

  const groupedSchedules = DAYS.map((day) => ({
    day,
    items: schedules.filter((s) => s.day.toLowerCase() === day.toLowerCase()),
  })).filter(g => selectedDay === 'all' || g.day.toLowerCase() === selectedDay.toLowerCase());

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-display font-bold text-slate-900 mb-2">Jadwal Belajar & Pembelajaran</h2>
            <p className="text-slate-500">Susunan jam pelajaran mingguan dan informasi guru pengampu.</p>
          </div>
          <button 
            onClick={() => setFormOpen(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-md shadow-blue-600/20 active:scale-95 text-sm"
          >
            <Plus className="w-4 h-4" />
            Tambah Jadwal Pelajaran
          </button>
        </div>

        {/* Day Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedDay('all')}
            className={`px-5 py-2 rounded-xl font-bold text-xs shrink-0 transition-all ${
              selectedDay === 'all' ? 'bg-blue-600 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Semua Hari
          </button>
          {DAYS.map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDay(d)}
              className={`px-4 py-2 rounded-xl font-bold text-xs shrink-0 transition-all ${
                selectedDay === d ? 'bg-blue-600 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        {/* Schedule Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groupedSchedules.map((group, i) => (
            <motion.div 
              key={group.day}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass p-6 rounded-3xl border border-white/40 shadow-sm flex flex-col justify-between bg-white"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                  <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-600" /> {group.day}
                  </h3>
                  <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                    {group.items.length} Sesi
                  </span>
                </div>

                <div className="space-y-3">
                  {group.items.map((sub) => (
                    <div key={sub.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-start group/item hover:border-blue-200 transition-colors">
                      <div>
                        <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm mb-1">
                          <BookOpen className="w-4 h-4 text-blue-500" />
                          {sub.subject}
                        </div>
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          <User className="w-3.5 h-3.5" /> {sub.teacher}
                        </p>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50/80 px-2.5 py-1 rounded-lg w-fit mt-2">
                          <Clock className="w-3.5 h-3.5" />
                          {sub.time}
                        </div>
                      </div>
                      <button 
                        onClick={() => handleDelete(sub.id)}
                        className="opacity-0 group-hover/item:opacity-100 p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {group.items.length === 0 && (
                    <p className="text-xs text-slate-400 italic py-6 text-center">Tidak ada jadwal belajar di hari ini.</p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <ScheduleFormDialog
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleAddSchedule}
      />
    </DashboardLayout>
  );
}
