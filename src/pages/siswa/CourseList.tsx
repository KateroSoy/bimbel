import { useState, useMemo } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { motion } from 'motion/react';
import { BookOpen, Search, Filter, PlayCircle, Star, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const courses = [
  { id: 1, title: 'Matematika Kelas X', teacher: 'Agus Santoso', lessons: 24, progress: 68, category: 'MIPA', difficulty: 'Sedang', thumbnail: 'bg-blue-100', color: 'text-blue-600' },
  { id: 2, title: 'Bahasa Inggris TOEFL Dasar', teacher: 'Rina Wulandari', lessons: 15, progress: 55, category: 'Bahasa', difficulty: 'Menengah', thumbnail: 'bg-emerald-100', color: 'text-emerald-600' },
  { id: 3, title: 'IPA Terpadu', teacher: 'Dewi Kartika', lessons: 32, progress: 20, category: 'MIPA', difficulty: 'Sulit', thumbnail: 'bg-purple-100', color: 'text-purple-600' },
  { id: 4, title: 'Skill Digital Dasar', teacher: 'Hendra Gunawan', lessons: 12, progress: 0, category: 'Informatika', difficulty: 'Mudah', thumbnail: 'bg-amber-100', color: 'text-amber-600' },
  { id: 5, title: 'Test Minat Bakat', teacher: 'Maya Sari', lessons: 5, progress: 100, category: 'BK', difficulty: 'Umum', thumbnail: 'bg-rose-100', color: 'text-rose-600' },
  { id: 6, title: 'Playground AI untuk Siswa', teacher: 'Hendra Gunawan', lessons: 8, progress: 0, category: 'Ekstrakurikuler', difficulty: 'Mudah', thumbnail: 'bg-indigo-100', color: 'text-indigo-600' }
];

export default function CourseList() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [teacherFilter, setTeacherFilter] = useState('');
  
  // Extract unique filter options
  const categories = useMemo(() => [...new Set(courses.map(c => c.category))], []);
  const difficulties = useMemo(() => [...new Set(courses.map(c => c.difficulty))], []);
  const teachers = useMemo(() => [...new Set(courses.map(c => c.teacher))], []);

  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            course.teacher.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === '' || course.category === categoryFilter;
      const matchesDifficulty = difficultyFilter === '' || course.difficulty === difficultyFilter;
      const matchesTeacher = teacherFilter === '' || course.teacher === teacherFilter;
      
      return matchesSearch && matchesCategory && matchesDifficulty && matchesTeacher;
    });
  }, [searchQuery, categoryFilter, difficultyFilter, teacherFilter]);

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-display font-bold text-slate-900 mb-2">Course Saya</h2>
            <p className="text-slate-500">Lanjutkan pembelajaran dan akses semua materi e-course.</p>
          </div>
        </div>

        {/* Filters */}
        <div className="glass p-4 rounded-2xl border border-white/40 flex flex-col gap-4 shadow-sm">
          <div className="relative w-full">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari nama course atau pengajar..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/60 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium placeholder:font-normal shadow-sm"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-3 bg-white/60 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 font-medium shadow-sm w-full"
            >
              <option value="">Semua Kategori</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            
            <select 
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="px-4 py-3 bg-white/60 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 font-medium shadow-sm w-full"
            >
              <option value="">Semua Tingkat Kesulitan</option>
              {difficulties.map(diff => (
                <option key={diff} value={diff}>{diff}</option>
              ))}
            </select>
            
            <select 
              value={teacherFilter}
              onChange={(e) => setTeacherFilter(e.target.value)}
              className="px-4 py-3 bg-white/60 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 font-medium shadow-sm w-full"
            >
              <option value="">Semua Pengajar</option>
              {teachers.map(teacher => (
                <option key={teacher} value={teacher}>{teacher}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => navigate(`/siswa/course/${course.id}`)}
                className="glass rounded-3xl border border-white/40 overflow-hidden hover:shadow-2xl hover:-translate-y-2 hover:border-blue-300 transition-all duration-300 cursor-pointer group flex flex-col"
              >
                {/* Thumbnail Area */}
                <div className={`h-48 ${course.thumbnail} relative overflow-hidden flex items-center justify-center`}>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300 z-0"></div>
                  
                  {/* Hover Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40 shadow-xl transform scale-75 group-hover:scale-100 transition-transform duration-300">
                      <PlayCircle className="w-8 h-8 text-white ml-1" />
                    </div>
                  </div>

                  <BookOpen className={`w-24 h-24 ${course.color} opacity-30 group-hover:scale-110 transition-transform duration-700 absolute z-0`} />
                  
                  {/* Badges Top */}
                  <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
                    <div className="bg-white/90 backdrop-blur text-slate-800 text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm">
                      {course.category}
                    </div>
                    <div className="bg-black/40 backdrop-blur text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 border border-white/10">
                      <Star className="w-3 h-3 text-amber-400" />
                      {course.difficulty}
                    </div>
                  </div>
                  
                  {/* Content Bottom */}
                  <div className="absolute bottom-4 left-4 right-4 z-10">
                    <h3 className="font-bold text-white text-xl leading-tight line-clamp-2 drop-shadow-md mb-3 group-hover:text-blue-100 transition-colors">{course.title}</h3>
                    
                    {/* Progress Bar inside thumbnail */}
                    <div className="w-full bg-white/20 rounded-full h-1.5 overflow-hidden backdrop-blur-sm">
                      <div 
                        className="bg-blue-400 h-1.5 rounded-full transition-all duration-1000 ease-out relative" 
                        style={{ width: `${course.progress}%` }}
                      >
                        <div className="absolute inset-0 bg-white/30 w-full animate-[shimmer_2s_infinite]"></div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-[10px] font-bold text-white/80 uppercase tracking-wider">{course.progress}% Selesai</span>
                      <span className="text-[10px] font-bold text-white/80 uppercase tracking-wider">{course.lessons} Materi</span>
                    </div>
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-5 flex flex-col flex-1 bg-white relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200 shrink-0">
                      <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${course.teacher}`} alt={course.teacher} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none mb-1">Pengajar</p>
                      <span className="text-sm font-bold text-slate-700 leading-none">{course.teacher}</span>
                    </div>
                  </div>

                  {/* Progress & Button */}
                  <div className="mt-auto pt-4 border-t border-slate-100">
                    <button className="w-full py-3 rounded-xl font-bold transition-all duration-300 text-sm flex justify-center items-center gap-2 bg-slate-50 text-slate-600 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-md group-hover:shadow-blue-600/20 border border-slate-200 group-hover:border-blue-600 overflow-hidden relative">
                      <span className="relative z-10 flex items-center gap-2">
                        {course.progress === 0 ? 'Mulai Belajar Sekarang' : course.progress === 100 ? 'Lihat Sertifikat' : 'Lanjutkan Belajar'}
                        <PlayCircle className="w-4 h-4 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                      </span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-slate-500 flex flex-col items-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">Tidak ada course yang ditemukan</h3>
              <p>Coba gunakan kata kunci atau filter pencarian yang berbeda.</p>
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setCategoryFilter('');
                  setDifficultyFilter('');
                  setTeacherFilter('');
                }}
                className="mt-6 text-blue-600 font-bold hover:underline"
              >
                Reset Filter
              </button>
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
}
