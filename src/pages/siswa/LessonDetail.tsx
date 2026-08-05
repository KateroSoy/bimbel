import { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { motion, AnimatePresence } from 'motion/react';
import { 
  PlayCircle, 
  FileText, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight, 
  Award, 
  MessageCircle, 
  Download, 
  FileCheck, 
  ExternalLink,
  Image as ImageIcon,
  Video,
  FileSpreadsheet,
  Eye,
  X
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useDataStore, LessonItem } from '../../store/useDataStore';

// Helper function to extract YouTube Embed URL
function getYouTubeEmbedUrl(url: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) 
    ? `https://www.youtube.com/embed/${match[2]}?autoplay=0&rel=0` 
    : null;
}

export default function LessonDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { lessons, updateLesson } = useDataStore();
  
  // Find current lesson from store or fallback
  const lessonFromStore = lessons.find((l) => l.id === id) || lessons[0];
  
  const [activeTab, setActiveTab] = useState<'content' | 'attachments' | 'gallery' | 'discussion'>('content');
  const [isCompleted, setIsCompleted] = useState(lessonFromStore?.completed || false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [selectedPreviewImage, setSelectedPreviewImage] = useState<string | null>(null);

  const youtubeEmbed = lessonFromStore?.videoUrl ? getYouTubeEmbedUrl(lessonFromStore.videoUrl) : null;

  const handleComplete = () => {
    setIsCompleted(true);
    setShowConfetti(true);
    if (lessonFromStore) {
      updateLesson(lessonFromStore.id, { completed: true });
    }
    toast.success('Luar biasa! Materi pembelajaran telah diselesaikan.', {
      description: 'Progress belajar dan pemahaman Anda berhasil dicatat ke sistem bimbel.'
    });
    
    setTimeout(() => {
      setShowConfetti(false);
    }, 3000);
  };

  const handleDownloadAttachment = (name: string) => {
    toast.success(`Dokumen "${name}" berhasil diunduh ke perangkat Anda!`);
  };

  return (
    <DashboardLayout>
      <div className="max-w-[1400px] mx-auto space-y-6">
        
        {/* Navigation & Header */}
        <div className="flex items-center justify-between bg-white p-4 px-6 rounded-2xl border border-slate-200 shadow-sm">
          <button 
            onClick={() => navigate('/siswa/course/2')}
            className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Kembali ke Modul Bimbel
          </button>
          
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold px-3 py-1 bg-blue-100 text-blue-700 rounded-lg">
              {lessonFromStore.moduleTitle || 'Modul 2: Listening Mastery'}
            </span>
            <span className="text-xs font-medium text-slate-400">
              Durasi: {lessonFromStore.duration || '24:10 Menit'}
            </span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Main Lesson Player & Content Area (Left) */}
          <div className="flex-1 flex flex-col bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            
            {/* Rich Media Player Container */}
            <div className="w-full bg-slate-950 aspect-video relative overflow-hidden flex items-center justify-center">
              {youtubeEmbed ? (
                <iframe 
                  src={youtubeEmbed}
                  title={lessonFromStore.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video 
                  controls 
                  className="w-full h-full object-contain"
                  poster={lessonFromStore.images?.[0] || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop'}
                  src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                >
                  Browser Anda tidak mendukung tag video.
                </video>
              )}
            </div>

            {/* Lesson Info & Complete Action */}
            <div className="p-6 bg-white border-b border-slate-100">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
                      Materi Multimedia
                    </span>
                    <span className="text-xs text-slate-400 font-medium">BimbelVerse Masterclass</span>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-900 mb-2">
                    {lessonFromStore.title}
                  </h1>
                  <p className="text-slate-500 text-sm leading-relaxed max-w-2xl">
                    {lessonFromStore.summary || 'Pelajari strategi dan trik kilat menjawab soal listening, penalaran, dan literasi secara sistematis bersama Master Tentor.'}
                  </p>
                </div>
                
                <div className="flex items-center gap-3 shrink-0">
                  <AnimatePresence mode="wait">
                    {!isCompleted ? (
                      <motion.button
                        key="mark-complete"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        onClick={handleComplete}
                        className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-md shadow-blue-600/20 hover:bg-blue-700 transition-colors flex items-center gap-2 active:scale-95 text-sm"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Tandai Selesai Belajar
                      </motion.button>
                    ) : (
                      <motion.button
                        key="completed"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="px-6 py-3 bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl font-bold flex items-center gap-2 cursor-default text-sm"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Materi Terselesaikan
                      </motion.button>
                    )}
                  </AnimatePresence>
                  
                  {isCompleted && (
                    <motion.button
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      onClick={() => navigate('/siswa/quiz')}
                      className="px-5 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors flex items-center gap-2 text-sm shadow-md"
                    >
                      Lanjut Quiz / Tryout
                      <ChevronRight className="w-4 h-4" />
                    </motion.button>
                  )}
                </div>
              </div>

              {/* Resource Navigation Tabs */}
              <div className="mt-8 pt-4 border-t border-slate-100 flex flex-wrap gap-2 sm:gap-6 text-sm font-bold">
                <button 
                  onClick={() => setActiveTab('content')}
                  className={`flex items-center gap-2 pb-2.5 transition-colors border-b-2 ${
                    activeTab === 'content' ? 'text-blue-600 border-blue-600' : 'text-slate-500 border-transparent hover:text-slate-900'
                  }`}
                >
                  <FileText className="w-4 h-4" /> Rangkuman & Catatan
                </button>

                <button 
                  onClick={() => setActiveTab('attachments')}
                  className={`flex items-center gap-2 pb-2.5 transition-colors border-b-2 ${
                    activeTab === 'attachments' ? 'text-blue-600 border-blue-600' : 'text-slate-500 border-transparent hover:text-slate-900'
                  }`}
                >
                  <Download className="w-4 h-4" /> Dokumen Lampiran (PDF/DOCX)
                  <span className="px-2 py-0.5 text-xs bg-slate-100 rounded-full text-slate-600">
                    {lessonFromStore.documents?.length || 2}
                  </span>
                </button>

                <button 
                  onClick={() => setActiveTab('gallery')}
                  className={`flex items-center gap-2 pb-2.5 transition-colors border-b-2 ${
                    activeTab === 'gallery' ? 'text-blue-600 border-blue-600' : 'text-slate-500 border-transparent hover:text-slate-900'
                  }`}
                >
                  <ImageIcon className="w-4 h-4" /> Galeri & Infografis
                  <span className="px-2 py-0.5 text-xs bg-slate-100 rounded-full text-slate-600">
                    {lessonFromStore.images?.length || 2}
                  </span>
                </button>

                <button 
                  onClick={() => setActiveTab('discussion')}
                  className={`flex items-center gap-2 pb-2.5 transition-colors border-b-2 ${
                    activeTab === 'discussion' ? 'text-blue-600 border-blue-600' : 'text-slate-500 border-transparent hover:text-slate-900'
                  }`}
                >
                  <MessageCircle className="w-4 h-4" /> Forum Tanya Tentor (12)
                </button>
              </div>
            </div>

            {/* Tab Contents */}
            <div className="p-6 bg-slate-50/50 flex-1">
              
              {/* 1. Content / Notes Tab */}
              {activeTab === 'content' && (
                <div className="space-y-4">
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
                    <h4 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                      <FileCheck className="w-5 h-5 text-blue-600" />
                      Poin-Poin Penting Pembelajaran
                    </h4>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {lessonFromStore.content || 'Strategi utama menjawab soal: Dengarkan baik-baik maksud pembicara kedua. Catat kata kunci yang menjadi inti persoalan dan abaikan opsi jawaban dengan pengucapan yang sengaja mengecoh (distractor sounds).'}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-100 text-xs">
                        <p className="font-bold text-blue-900 mb-1">🎯 Tips Efektif Tentor:</p>
                        <p className="text-blue-700">Gunakan metode eliminasi cepat jika menemukan 2 pilihan jawaban yang artinya bertentangan secara frontal.</p>
                      </div>
                      <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-100 text-xs">
                        <p className="font-bold text-emerald-900 mb-1">⏱️ Manajemen Waktu:</p>
                        <p className="text-emerald-700">Maksimal 12 detik per nomor soal untuk membaca opsi sebelum audio berikutnya berputar.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. Attachments Tab (PDF / DOCX) */}
              {activeTab === 'attachments' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(lessonFromStore.documents || [
                      { id: 'DOC-1', name: 'Ringkasan_Formula_Listening_Part_A.pdf', type: 'pdf', size: '2.4 MB', url: '#' },
                      { id: 'DOC-2', name: 'Latihan_Dialog_Percakapan_Singkat.docx', type: 'docx', size: '1.1 MB', url: '#' }
                    ]).map((doc) => (
                      <div 
                        key={doc.id}
                        className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-300 transition-all flex items-center justify-between gap-4 shadow-sm group"
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className={`p-3 rounded-2xl shrink-0 ${
                            doc.type === 'pdf' ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'
                          }`}>
                            {doc.type === 'pdf' ? <FileText className="w-6 h-6" /> : <FileSpreadsheet className="w-6 h-6" />}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-sm text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                              {doc.name}
                            </p>
                            <p className="text-xs text-slate-400 font-mono mt-0.5">
                              Format: {doc.type.toUpperCase()} • Ukuran: {doc.size}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => handleDownloadAttachment(doc.name)}
                          className="p-2.5 bg-slate-100 hover:bg-blue-600 hover:text-white rounded-xl text-slate-600 transition-colors shrink-0"
                          title="Unduh Berkas"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. Image Gallery Tab */}
              {activeTab === 'gallery' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {(lessonFromStore.images || [
                      'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1200&auto=format&fit=crop',
                      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop'
                    ]).map((imgUrl, index) => (
                      <div 
                        key={index}
                        onClick={() => setSelectedPreviewImage(imgUrl)}
                        className="group relative rounded-2xl overflow-hidden aspect-video bg-slate-900 border border-slate-200 cursor-pointer shadow-sm"
                      >
                        <img 
                          src={imgUrl} 
                          alt={`Infografis Pelajaran ${index + 1}`} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white">
                          <Eye className="w-5 h-5" />
                          <span className="text-xs font-bold">Perbesar Gambar</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. Discussion Tab */}
              {activeTab === 'discussion' && (
                <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h4 className="font-bold text-slate-900 text-sm">Ruang Diskusi & Konsultasi Sesi Ini</h4>
                    <span className="text-xs text-blue-600 font-bold">Tentor Standby Aktif</span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-900">Andi Darmawan</span>
                        <span className="text-slate-400">10 Menit lalu</span>
                      </div>
                      <p className="text-slate-600">Apakah di Part B ada kemungkinan topik percakapan membahas penelitian sains?</p>
                    </div>

                    <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 ml-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-blue-900">Drs. Ahmad Yani (Master Tentor)</span>
                        <span className="text-blue-500 font-semibold">Tutor Bimbel</span>
                      </div>
                      <p className="text-blue-800">Tentu saja Andi, topik seputar astronomi, geologi, dan psikologi sering menjadi tema utama.</p>
                    </div>
                  </div>

                  <div className="pt-2 flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Tulis pertanyaan seputar materi ini ke Tentor..."
                      className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button 
                      onClick={() => toast.success('Pertanyaan Anda berhasil dikirim ke Tentor!')}
                      className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl text-xs hover:bg-blue-700"
                    >
                      Kirim
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Syllabus Sidebar (Right) */}
          <div className="w-full lg:w-80 flex flex-col bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm shrink-0">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50 shrink-0">
              <h3 className="font-bold text-slate-900">Daftar Modul Belajar</h3>
              <div className="mt-2 w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-emerald-500 h-1.5 rounded-full transition-all duration-1000" 
                  style={{ width: isCompleted ? '75%' : '60%' }}
                ></div>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-2 text-right">
                Progress: {isCompleted ? '75%' : '60%'}
              </p>
            </div>

            <div className="p-4 space-y-4 overflow-y-auto max-h-[600px]">
              {/* Module 1 */}
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">Modul 1: Fondasi</p>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="font-medium line-clamp-1">Pengenalan Format Ujian</span>
                  </div>
                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="font-medium line-clamp-1">Struktur & Strategi Skor</span>
                  </div>
                </div>
              </div>

              {/* Module 2 */}
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-2 mt-3">Modul 2: Listening Mastery</p>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="font-medium line-clamp-1">Listening Part A: Short Dialogues</span>
                  </div>
                  
                  {/* Current Active Lesson */}
                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 font-bold">
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    ) : (
                      <PlayCircle className="w-4 h-4 text-blue-600 shrink-0" />
                    )}
                    <span className="line-clamp-1">{lessonFromStore.title}</span>
                  </div>
                  
                  <div 
                    onClick={() => navigate('/siswa/quiz')}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 text-slate-500 cursor-pointer transition-colors"
                  >
                    <Award className="w-4 h-4 text-amber-500 shrink-0" />
                    <span className="font-medium line-clamp-1">Latihan Soal Listening 1</span>
                  </div>
                </div>
              </div>

              {/* Module 3 */}
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-2 mt-3">Modul 3: Grammar & Structure</p>
                <div className="space-y-1 text-xs opacity-60">
                  <div className="flex items-center gap-3 p-2.5 rounded-xl text-slate-500">
                    <PlayCircle className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="font-medium line-clamp-1">Trik Kilat Subject & Verb Agreement</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Lightbox Modal */}
      {selectedPreviewImage && (
        <div 
          onClick={() => setSelectedPreviewImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in"
        >
          <div className="relative max-w-4xl max-h-[85vh] w-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelectedPreviewImage(null)}
              className="absolute -top-12 right-0 p-2 text-white/80 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
            <img 
              src={selectedPreviewImage} 
              alt="Preview Infografis" 
              className="w-full h-auto max-h-[80vh] object-contain rounded-2xl shadow-2xl border border-white/20"
            />
          </div>
        </div>
      )}

      {/* Confetti Overlay Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center overflow-hidden">
          <motion.div 
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: [1, 2, 3], opacity: [1, 1, 0] }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="w-36 h-36 bg-emerald-400 rounded-full blur-3xl absolute"
          />
        </div>
      )}
    </DashboardLayout>
  );
}
