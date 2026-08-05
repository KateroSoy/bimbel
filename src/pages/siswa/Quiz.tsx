import { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, CheckCircle2, ChevronRight, ChevronLeft, Flag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const quizData = {
  title: 'Latihan Listening 1',
  course: 'Bahasa Inggris TOEFL Dasar',
  totalQuestions: 5,
  timeLimit: 15, // minutes
  questions: [
    {
      id: 1,
      text: 'What does the man imply about the new project?',
      options: [
        'It will be finished on time.',
        'It requires more funding than expected.',
        'He is not interested in working on it.',
        'The deadline has been extended.'
      ]
    },
    {
      id: 2,
      text: 'What is the main topic of the conversation?',
      options: [
        'A recent scientific discovery.',
        'The requirements for a biology class.',
        'A proposed change to the curriculum.',
        'The results of a laboratory experiment.'
      ]
    },
    {
      id: 3,
      text: 'What will the woman probably do next?',
      options: [
        'Submit her application.',
        'Ask the professor for a recommendation.',
        'Review her notes from class.',
        'Go to the library to study.'
      ]
    },
    {
      id: 4,
      text: 'Why does the student go to see the advisor?',
      options: [
        'To change her major.',
        'To ask about graduation requirements.',
        'To drop a course.',
        'To get a signature on a form.'
      ]
    },
    {
      id: 5,
      text: 'What can be inferred about the professor\'s policy?',
      options: [
        'Late assignments are never accepted.',
        'Attendance is strictly required.',
        'Students can rewrite their papers for a better grade.',
        'There is no final exam in the course.'
      ]
    }
  ]
};

export default function Quiz() {
  const navigate = useNavigate();
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  
  // Dummy timer state for UI
  const [timeLeft] = useState('14:59');

  const handleStart = () => {
    setIsStarted(true);
  };

  const handleSelectOption = (qIndex: number, optIndex: number) => {
    setAnswers(prev => ({ ...prev, [qIndex]: optIndex }));
  };

  const handleNext = () => {
    if (currentQuestion < quizData.totalQuestions - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    // Check if all answered (for demo, allow submitting anyway)
    setIsFinished(true);
    toast.success('Kuis berhasil dikumpulkan!', {
      description: 'Nilai Anda telah diperbarui di sistem.'
    });
  };

  // 1. Intro View
  if (!isStarted && !isFinished) {
    return (
      <DashboardLayout>
        <div className="max-w-3xl mx-auto flex items-center justify-center min-h-[60vh]">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-10 rounded-3xl border border-white/40 shadow-xl text-center w-full relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full blur-3xl -z-10 opacity-50"></div>
            
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 font-bold text-sm mb-6 border border-blue-100">
              <Clock className="w-4 h-4" />
              {quizData.timeLimit} Menit
            </div>
            
            <h1 className="text-3xl font-display font-bold text-slate-900 mb-2">{quizData.title}</h1>
            <p className="text-slate-500 font-medium mb-8">{quizData.course}</p>
            
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-10">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-left">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Total Soal</p>
                <p className="text-xl font-bold text-slate-900">{quizData.totalQuestions} Pilihan Ganda</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-left">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Passing Grade</p>
                <p className="text-xl font-bold text-slate-900">75%</p>
              </div>
            </div>
            
            <button 
              onClick={handleStart}
              className="w-full sm:w-auto px-10 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all hover:scale-105"
            >
              Mulai Kuis Sekarang
            </button>
          </motion.div>
        </div>
      </DashboardLayout>
    );
  }

  // 3. Finished View
  if (isFinished) {
    // Mock calculate score based on answers filled
    const answeredCount = Object.keys(answers).length;
    const mockScore = answeredCount === quizData.totalQuestions ? 80 : 40;
    
    return (
      <DashboardLayout>
        <div className="max-w-3xl mx-auto flex items-center justify-center min-h-[60vh]">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass p-10 rounded-3xl border border-white/40 shadow-xl text-center w-full"
          >
            <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6 shadow-inner ${
              mockScore >= 75 ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
            }`}>
              <CheckCircle2 className="w-12 h-12" />
            </div>
            
            <h2 className="text-2xl font-display font-bold text-slate-900 mb-2">Kuis Selesai!</h2>
            <p className="text-slate-500 mb-8">Hasil pengerjaan {quizData.title}</p>
            
            <div className="bg-slate-50 rounded-2xl border border-slate-100 p-8 max-w-sm mx-auto mb-8">
              <p className="text-sm text-slate-500 font-bold uppercase tracking-wider mb-2">Nilai Akhir</p>
              <div className="text-6xl font-display font-bold text-slate-900 mb-4">{mockScore}</div>
              <div className={`inline-flex px-4 py-1.5 rounded-full text-sm font-bold ${
                mockScore >= 75 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
              }`}>
                {mockScore >= 75 ? 'LULUS' : 'TIDAK LULUS'}
              </div>
            </div>
            
            <div className="flex gap-4 justify-center">
              <button 
                onClick={() => navigate('/siswa/course/2')}
                className="px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-colors"
              >
                Kembali ke Course
              </button>
              <button 
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-md"
              >
                Lihat Pembahasan
              </button>
            </div>
          </motion.div>
        </div>
      </DashboardLayout>
    );
  }

  // 2. Active Quiz View
  const question = quizData.questions[currentQuestion];
  
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] min-h-[600px] flex flex-col relative">
        
        {/* Topbar / Timer */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-6 flex justify-between items-center shrink-0">
          <div>
            <h2 className="font-bold text-slate-900">{quizData.title}</h2>
            <p className="text-xs text-slate-500">Soal {currentQuestion + 1} dari {quizData.totalQuestions}</p>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="text-slate-400 hover:text-amber-500 transition-colors" title="Tandai ragu-ragu">
              <Flag className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-50 text-rose-600 font-mono font-bold text-lg border border-rose-100">
              <Clock className="w-5 h-5" />
              {timeLeft}
            </div>
          </div>
        </div>

        <div className="flex gap-6 flex-1 min-h-0">
          
          {/* Main Question Area */}
          <div className="flex-1 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto p-8 md:p-12">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuestion}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <h3 className="text-xl md:text-2xl font-medium text-slate-900 leading-relaxed mb-8">
                    <span className="font-bold mr-4 text-blue-600">{currentQuestion + 1}.</span>
                    {question.text}
                  </h3>
                  
                  <div className="space-y-4">
                    {question.options.map((opt, optIndex) => {
                      const isSelected = answers[currentQuestion] === optIndex;
                      const letter = String.fromCharCode(65 + optIndex); // A, B, C, D
                      
                      return (
                        <div 
                          key={optIndex}
                          onClick={() => handleSelectOption(currentQuestion, optIndex)}
                          className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-4 ${
                            isSelected 
                              ? 'border-blue-600 bg-blue-50/50' 
                              : 'border-slate-100 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${
                            isSelected ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {letter}
                          </div>
                          <span className={`text-base font-medium ${isSelected ? 'text-blue-900' : 'text-slate-700'}`}>
                            {opt}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
            
            {/* Navigation Footer */}
            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center shrink-0">
              <button 
                onClick={handlePrev}
                disabled={currentQuestion === 0}
                className="px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <ChevronLeft className="w-5 h-5" /> Sebelumnya
              </button>
              
              {currentQuestion === quizData.totalQuestions - 1 ? (
                <button 
                  onClick={handleSubmit}
                  className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-md hover:bg-blue-700 transition-colors"
                >
                  Kumpulkan Kuis
                </button>
              ) : (
                <button 
                  onClick={handleNext}
                  className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold shadow-md hover:bg-slate-800 transition-colors flex items-center gap-2"
                >
                  Selanjutnya <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Question Grid Sidebar */}
          <div className="w-64 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 hidden lg:flex flex-col shrink-0">
            <h3 className="font-bold text-slate-900 mb-4">Navigasi Soal</h3>
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: quizData.totalQuestions }).map((_, idx) => {
                const isAnswered = answers[idx] !== undefined;
                const isCurrent = currentQuestion === idx;
                
                return (
                  <button
                    key={idx}
                    onClick={() => setCurrentQuestion(idx)}
                    className={`w-10 h-10 rounded-xl font-bold text-sm flex items-center justify-center transition-all ${
                      isCurrent ? 'ring-2 ring-blue-600 ring-offset-2' : ''
                    } ${
                      isAnswered 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
            
            <div className="mt-auto pt-6 border-t border-slate-100">
              <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                Terjawab ({Object.keys(answers).length})
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                Belum Terjawab ({quizData.totalQuestions - Object.keys(answers).length})
              </div>
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
