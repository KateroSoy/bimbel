import { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { motion } from 'motion/react';
import { ScrollText, Wand2, CloudDownload, Save, Sliders, ChevronRight } from 'lucide-react';

export default function RPPGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setGenerated(false);
    setTimeout(() => {
      setIsGenerating(false);
      setGenerated(true);
    }, 2500);
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto h-[calc(100vh-8rem)] flex flex-col lg:flex-row gap-6">
        
        {/* Left: Input Form */}
        <div className="w-full lg:w-1/3 glass-card rounded-3xl overflow-hidden flex flex-col shadow-xl">
          <div className="p-6 border-b border-white/50 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-slate-900">Parameter Bahan Ajar</h2>
              <p className="text-xs text-slate-500">Isi data untuk generate otomatis</p>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Kurikulum</label>
              <select className="w-full h-11 rounded-xl border border-slate-200 px-4 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all">
                <option>Kurikulum Merdeka</option>
                <option>Kurikulum 2013</option>
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Jenjang</label>
                <select className="w-full h-11 rounded-xl border border-slate-200 px-4 bg-slate-50 focus:bg-white focus:border-blue-500 outline-none transition-all">
                  <option>SMA</option>
                  <option>SMK</option>
                  <option>SMP</option>
                  <option>SD</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Kelas</label>
                <select className="w-full h-11 rounded-xl border border-slate-200 px-4 bg-slate-50 focus:bg-white focus:border-blue-500 outline-none transition-all">
                  <option>X (Sepuluh)</option>
                  <option>XI (Sebelas)</option>
                  <option>XII (Dua Belas)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Mata Pelajaran</label>
              <select className="w-full h-11 rounded-xl border border-slate-200 px-4 bg-slate-50 focus:bg-white focus:border-blue-500 outline-none transition-all">
                <option>Informatika</option>
                <option>Matematika</option>
                <option>Bahasa Indonesia</option>
                <option>Bahasa Inggris</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Topik Materi</label>
              <input 
                type="text" 
                defaultValue="Algoritma dan Pemrograman Dasar"
                className="w-full h-11 rounded-xl border border-slate-200 px-4 bg-slate-50 focus:bg-white focus:border-blue-500 outline-none transition-all"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tujuan Pembelajaran Khusus (Opsional)</label>
              <textarea 
                rows={3}
                placeholder="Misal: Siswa dapat membuat flowchart sederhana..."
                className="w-full rounded-xl border border-slate-200 p-4 bg-slate-50 focus:bg-white focus:border-blue-500 outline-none transition-all resize-none"
              ></textarea>
            </div>
          </div>
          
          <div className="p-6 border-t border-slate-100 bg-slate-50">
            <button 
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full h-12 rounded-xl bg-blue-600 text-white font-medium flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-70"
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Generating AI...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  <span>Generate Bahan Ajar</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right: Preview Editor */}
        <div className="w-full lg:w-2/3 glass-card rounded-3xl overflow-hidden flex flex-col relative shadow-xl">
          {/* Header */}
          <div className="h-16 border-b border-white/50 px-6 flex items-center justify-between glass z-10">
            <h2 className="font-display font-bold text-lg text-slate-900">Preview Bahan Ajar</h2>
            <div className="flex gap-2">
              <button disabled={!generated} className="h-10 px-4 rounded-lg flex items-center gap-2 text-slate-600 hover:bg-slate-100 font-medium transition-colors disabled:opacity-50">
                <Save className="w-4 h-4" />
                <span className="hidden sm:inline">Simpan</span>
              </button>
              <button disabled={!generated} className="h-10 px-4 rounded-lg bg-slate-900 text-white flex items-center gap-2 font-medium hover:bg-slate-800 transition-colors disabled:opacity-50">
                <CloudDownload className="w-4 h-4" />
                <span className="hidden sm:inline">Export PDF</span>
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto bg-slate-50 p-6 md:p-10">
            {isGenerating ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                <div className="relative w-24 h-24">
                  <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Wand2 className="w-8 h-8 text-blue-600 animate-pulse" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-xl text-slate-900 mb-2">AI sedang menyusun Bahan Ajar</h3>
                  <p className="text-slate-500">Menganalisis kompetensi dasar dan merancang skenario pembelajaran...</p>
                </div>
              </div>
            ) : generated ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 p-8 md:p-12 font-serif"
              >
                <div className="text-center mb-8">
                  <h1 className="font-bold text-xl uppercase mb-1">BAHAN AJAR & RENCANA PEMBELAJARAN</h1>
                  <h2 className="font-bold text-lg uppercase text-slate-700">KURIKULUM MERDEKA</h2>
                </div>
                
                <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm mb-8">
                  <div className="flex"><span className="w-32 font-bold">Mata Pelajaran</span><span>: Informatika</span></div>
                  <div className="flex"><span className="w-32 font-bold">Fase / Kelas</span><span>: E / X</span></div>
                  <div className="flex"><span className="w-32 font-bold">Topik</span><span>: Algoritma & Pemrograman</span></div>
                  <div className="flex"><span className="w-32 font-bold">Alokasi Waktu</span><span>: 2 x 45 Menit</span></div>
                </div>
                
                <div className="space-y-6 text-sm leading-relaxed">
                  <section>
                    <h3 className="font-bold text-base mb-2 pb-1 border-b-2 border-slate-900 uppercase">A. Tujuan Pembelajaran</h3>
                    <ol className="list-decimal pl-5 space-y-1">
                      <li>Peserta didik mampu memahami konsep dasar algoritma.</li>
                      <li>Peserta didik mampu menyusun flowchart untuk menyelesaikan masalah sederhana.</li>
                      <li>Peserta didik menunjukkan profil pelajar Pancasila (Bernalar kritis).</li>
                    </ol>
                  </section>
                  
                  <section>
                    <h3 className="font-bold text-base mb-2 pb-1 border-b-2 border-slate-900 uppercase">B. Kegiatan Pembelajaran</h3>
                    
                    <div className="mb-4">
                      <h4 className="font-bold mb-1">1. Kegiatan Pendahuluan (15 Menit)</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Guru membuka dengan salam dan doa bersama.</li>
                        <li>Guru memeriksa kehadiran dan kesiapan siswa.</li>
                        <li>Apersepsi: Guru menanyakan pengalaman siswa menggunakan aplikasi komputer.</li>
                      </ul>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="font-bold mb-1">2. Kegiatan Inti (60 Menit)</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Orientasi:</strong> Guru menjelaskan konsep algoritma sebagai urutan langkah logis.</li>
                        <li><strong>Eksplorasi:</strong> Siswa dibagi dalam kelompok untuk memecahkan studi kasus (membuat kopi).</li>
                        <li><strong>Presentasi:</strong> Setiap kelompok mempresentasikan flowchart yang dibuat.</li>
                      </ul>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="font-bold mb-1">3. Kegiatan Penutup (15 Menit)</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Siswa dan guru menyimpulkan materi bersama.</li>
                        <li>Refleksi pembelajaran.</li>
                        <li>Guru menyampaikan materi untuk pertemuan berikutnya.</li>
                      </ul>
                    </div>
                  </section>
                  
                  <section>
                    <h3 className="font-bold text-base mb-2 pb-1 border-b-2 border-slate-900 uppercase">C. Asesmen</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li><strong>Formatif:</strong> Observasi keaktifan diskusi kelompok.</li>
                      <li><strong>Sumatif:</strong> Tugas mandiri membuat flowchart kasus sederhana.</li>
                    </ul>
                  </section>
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-400">
                <ScrollText className="w-16 h-16 mb-4 opacity-20" />
                <p>Isi parameter di samping dan klik Generate <br/>untuk melihat hasil bahan ajar di sini.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

