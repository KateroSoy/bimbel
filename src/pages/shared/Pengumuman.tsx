import { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Megaphone, Calendar, Search, Tag, CheckCircle2, Sparkles, Filter, Bell } from 'lucide-react';
import { toast } from 'sonner';

export default function Pengumuman() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [readAnnouncements, setReadAnnouncements] = useState<number[]>([]);

  const announcements = [
    { 
      id: 1, 
      title: 'Libur Nasional Kemerdekaan RI Ke-80', 
      category: 'Libur', 
      date: '15 Agustus 2025', 
      badge: 'Penting',
      content: 'Diberitahukan kepada seluruh peserta didik, orang tua, dan staf pengajar bahwa kegiatan belajar mengajar bimbel diliburkan pada 17 Agustus 2025. Kelas pengganti dapat dijadwalkan bersama tutor.' 
    },
    { 
      id: 2, 
      title: 'Simulasi Akbar UTBK-SNBT Gelombang 2', 
      category: 'Akademik', 
      date: '10 Agustus 2025', 
      badge: 'Wajib Siswa 12',
      content: 'Simulasi ujian CBT berbasis komputer akan dilaksanakan serentak pada Sabtu, 23 Agustus 2025 mulai pukul 08.00 WIB. Silakan cek menu CBT untuk tata tertib.' 
    },
    { 
      id: 3, 
      title: 'Workshop Metode Belajar Cepat & Pemilihan Jurusan PTN', 
      category: 'Kegiatan', 
      date: '5 Agustus 2025', 
      badge: 'Gratis',
      content: 'Webinar daring eksklusif bersama alumni UI dan ITB membahas strategi tembus jurusan impian dan cara menembus passing grade tinggi.' 
    },
    { 
      id: 4, 
      title: 'Pembaruan Modul Pembelajaran & Bank Soal Digital', 
      category: 'Akademik', 
      date: '1 Agustus 2025', 
      badge: 'Info Modul',
      content: 'Modul kurikulum terbaru telah diunggah pada e-library. Siswa dapat mengunduh materi PDF atau mengakses ringkasan rumus di menu Course.' 
    }
  ];

  const toggleRead = (id: number, title: string) => {
    if (readAnnouncements.includes(id)) {
      setReadAnnouncements(readAnnouncements.filter(i => i !== id));
      toast.info(`Pengumuman ditandai belum dibaca`);
    } else {
      setReadAnnouncements([...readAnnouncements, id]);
      toast.success(`Pengumuman "${title}" telah ditandai sudah dibaca`);
    }
  };

  const filteredAnnouncements = announcements.filter(ann => {
    const matchQuery = ann.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                       ann.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = selectedCategory === 'all' || ann.category === selectedCategory;
    return matchQuery && matchCat;
  });

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-display font-bold text-slate-900 mb-1">Pusat Pengumuman & Informasi</h2>
            <p className="text-slate-500 text-sm">Informasi penting kalender akademik, jadwal ujian, dan agenda bimbingan belajar.</p>
          </div>
          <button 
            onClick={() => {
              setReadAnnouncements(announcements.map(a => a.id));
              toast.success("Semua pengumuman ditandai sudah dibaca");
            }}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Tandai Semua Dibaca
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="glass p-4 rounded-2xl border border-white/40 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between bg-white">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {['all', 'Akademik', 'Kegiatan', 'Libur'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-xl font-bold text-xs shrink-0 transition-all cursor-pointer ${
                  selectedCategory === cat 
                    ? 'bg-blue-600 text-white shadow-xs' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat === 'all' ? 'Semua Kategori' : cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari pengumuman..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </div>
        </div>

        {/* Announcement List */}
        <div className="space-y-4">
          {filteredAnnouncements.map((ann) => {
            const isRead = readAnnouncements.includes(ann.id);
            return (
              <div 
                key={ann.id} 
                className={`glass p-6 rounded-3xl border transition-all shadow-xs flex gap-4 items-start bg-white ${
                  isRead ? 'border-slate-200 opacity-80' : 'border-blue-100 hover:border-blue-300'
                }`}
              >
                <div className={`p-3 rounded-2xl shrink-0 ${
                  ann.category === 'Libur' ? 'bg-orange-50 text-orange-600' :
                  ann.category === 'Akademik' ? 'bg-blue-50 text-blue-600' :
                  'bg-emerald-50 text-emerald-600'
                }`}>
                  <Megaphone className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700">
                      {ann.category}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-red-50 text-red-600">
                      {ann.badge}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 ml-auto">
                      <Calendar className="w-3.5 h-3.5" /> {ann.date}
                    </div>
                  </div>
                  <h3 className="font-bold text-base text-slate-900 mt-1 mb-2">{ann.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">{ann.content}</p>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <span className="text-xs text-slate-400 font-medium">Bimbel StudyHack Management</span>
                    <button 
                      onClick={() => toggleRead(ann.id, ann.title)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-colors flex items-center gap-1.5 cursor-pointer ${
                        isRead 
                          ? 'border-slate-200 text-slate-500 hover:bg-slate-50' 
                          : 'border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {isRead ? 'Tandai Belum Dibaca' : 'Tandai Selesai Dibaca'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
