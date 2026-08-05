import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { motion } from 'motion/react';
import { PlayCircle, FileText, CheckCircle2, Clock, Award, BookOpen, ChevronRight, Lock } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const courseData = {
  id: 2,
  title: 'Bahasa Inggris TOEFL Dasar',
  teacher: 'Rina Wulandari',
  category: 'Bahasa',
  progress: 55,
  description: 'Mata pelajaran ini dirancang untuk mempersiapkan siswa menghadapi tes TOEFL ITP. Fokus utama pada pemahaman Listening, Structure and Written Expression, dan Reading Comprehension.',
  modules: [
    {
      id: 1,
      title: 'Pengenalan TOEFL',
      lessons: [
        { id: 101, title: 'Apa itu TOEFL?', type: 'video', duration: '12:45', completed: true },
        { id: 102, title: 'Format Listening, Structure, Reading', type: 'document', duration: '15 min read', completed: true }
      ]
    },
    {
      id: 2,
      title: 'Listening Basic',
      lessons: [
        { id: 201, title: 'Listening Part A: Short Conversations', type: 'video', duration: '24:10', completed: true },
        { id: 202, title: 'Listening Part B: Longer Conversations', type: 'video', duration: '18:30', completed: false },
        { id: 203, title: 'Latihan Listening 1', type: 'quiz', duration: '30 mins', completed: false }
      ]
    },
    {
      id: 3,
      title: 'Structure & Written Expression',
      lessons: [
        { id: 301, title: 'Grammar Dasar untuk TOEFL', type: 'video', duration: '35:00', completed: false },
        { id: 302, title: 'Error Recognition Strategies', type: 'video', duration: '28:15', completed: false }
      ]
    }
  ]
};

export default function CourseDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  // In a real app, we would fetch course data based on ID
  // For demo, we use the static data above

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
          <button onClick={() => navigate('/siswa/course')} className="hover:text-blue-600 transition-colors">Course Saya</button>
          <ChevronRight className="w-4 h-4" />
          <span className="text-slate-900">{courseData.title}</span>
        </div>

        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-slate-900 to-blue-900 rounded-3xl p-8 md:p-10 relative overflow-hidden text-white shadow-xl"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-3xl rounded-full"></div>
          
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-2 space-y-6">
              <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold tracking-wide uppercase bg-blue-500/20 text-blue-200 border border-blue-400/30 backdrop-blur-md">
                {courseData.category}
              </span>
              <h1 className="text-3xl md:text-4xl font-display font-bold leading-tight">{courseData.title}</h1>
              <p className="text-blue-100 text-sm md:text-base leading-relaxed max-w-xl">
                {courseData.description}
              </p>
              
              <div className="flex items-center gap-6 pt-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center overflow-hidden border border-white/20">
                    <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${courseData.teacher}`} alt={courseData.teacher} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-xs text-blue-200 font-medium">Pengajar</p>
                    <p className="text-sm font-bold text-white">{courseData.teacher}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="glass-dark bg-black/20 border border-white/10 p-6 rounded-2xl backdrop-blur-md flex flex-col items-center justify-center text-center">
              <div className="w-24 h-24 relative mb-4">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                  <circle 
                    cx="50" cy="50" r="45" fill="none" stroke="#38BDF8" strokeWidth="8" 
                    strokeDasharray={`${2 * Math.PI * 45}`} 
                    strokeDashoffset={`${2 * Math.PI * 45 * (1 - courseData.progress / 100)}`} 
                    strokeLinecap="round" 
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-2xl font-display font-bold text-white">{courseData.progress}%</span>
                </div>
              </div>
              <p className="text-sm font-medium text-blue-100 mb-6">Progress Pembelajaran</p>
              <button 
                onClick={() => navigate(`/siswa/lesson/202`)} // Demo link to first uncompleted lesson
                className="w-full py-3 rounded-xl font-bold transition-colors shadow-lg bg-blue-500 hover:bg-blue-400 text-white flex items-center justify-center gap-2"
              >
                <PlayCircle className="w-5 h-5" />
                Lanjutkan Belajar
              </button>
            </div>
          </div>
        </motion.div>

        {/* Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Syllabus */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="font-display font-bold text-xl text-slate-900">Materi Pembelajaran</h3>
            
            <div className="space-y-4">
              {courseData.modules.map((module, mIndex) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + (mIndex * 0.1) }}
                  key={module.id} 
                  className="glass rounded-2xl border border-slate-200 overflow-hidden shadow-sm"
                >
                  {/* Module Header */}
                  <div className="bg-slate-50 p-5 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Modul {mIndex + 1}</p>
                      <h4 className="font-bold text-slate-900 text-lg">{module.title}</h4>
                    </div>
                    <div className="text-sm font-medium text-slate-500">
                      {module.lessons.filter(l => l.completed).length} / {module.lessons.length} Selesai
                    </div>
                  </div>
                  
                  {/* Lesson List */}
                  <div className="divide-y divide-slate-100">
                    {module.lessons.map((lesson) => {
                      const Icon = lesson.type === 'video' ? PlayCircle : lesson.type === 'document' ? FileText : Award;
                      return (
                        <div 
                          key={lesson.id}
                          onClick={() => !lesson.completed && lesson.id === 202 ? navigate(`/siswa/lesson/${lesson.id}`) : null}
                          className={`p-4 flex items-center justify-between transition-colors ${
                            lesson.completed ? 'bg-white' : 
                            lesson.id === 202 ? 'bg-blue-50/50 hover:bg-blue-50 cursor-pointer group' : 'bg-white opacity-75'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                              lesson.completed ? 'bg-emerald-100 text-emerald-600' :
                              lesson.id === 202 ? 'bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white' : 'bg-slate-100 text-slate-400'
                            }`}>
                              {lesson.completed ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                            </div>
                            <div>
                              <h5 className={`font-medium text-sm md:text-base ${
                                lesson.completed ? 'text-slate-700' : 
                                lesson.id === 202 ? 'text-slate-900 font-bold group-hover:text-blue-600' : 'text-slate-500'
                              }`}>
                                {lesson.title}
                              </h5>
                              <div className="flex items-center gap-2 mt-1">
                                <span className={`text-xs font-medium ${lesson.id === 202 ? 'text-blue-500' : 'text-slate-400'}`}>
                                  {lesson.duration}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            {!lesson.completed && lesson.id !== 202 && lesson.id !== 201 && (
                              <Lock className="w-4 h-4 text-slate-300" />
                            )}
                            {lesson.id === 202 && (
                              <button className="text-xs font-bold text-blue-600 bg-blue-100 px-3 py-1.5 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                Mulai
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Sidebar Info */}
          <div className="space-y-6">
            <div className="glass p-6 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-4">Informasi Tambahan</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Total 7 Materi</p>
                    <p className="text-xs text-slate-500">Video, Dokumen, Quiz</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Estimasi Waktu</p>
                    <p className="text-xs text-slate-500">2 Jam 15 Menit</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Sertifikat Digital</p>
                    <p className="text-xs text-slate-500">Tersedia setelah lulus</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-3xl border border-blue-100">
              <h3 className="font-bold text-indigo-900 mb-2">Butuh Bantuan?</h3>
              <p className="text-sm text-indigo-700/80 mb-4 leading-relaxed">
                Tanya guru pengajar atau diskusikan dengan teman di forum kelas jika ada materi yang kurang jelas.
              </p>
              <button className="w-full py-2.5 rounded-xl font-bold bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-50 transition-colors text-sm shadow-sm">
                Buka Forum Diskusi
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </DashboardLayout>
  );
}
