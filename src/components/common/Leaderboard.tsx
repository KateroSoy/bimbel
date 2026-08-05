import { Trophy, Medal, Star } from 'lucide-react';
import { motion } from 'motion/react';

export interface LeaderboardStudent {
  id: string;
  name: string;
  score: number;
  coursesCompleted: number;
  avatar?: string;
}

interface LeaderboardProps {
  students: LeaderboardStudent[];
}

export function Leaderboard({ students }: LeaderboardProps) {
  const sortedStudents = [...students].sort((a, b) => b.score - a.score);

  return (
    <div className="glass p-6 rounded-3xl border border-white/40 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
          <Trophy className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-bold text-lg text-slate-900">Leaderboard</h3>
          <p className="text-slate-500 text-sm">Top Performers Bulan Ini</p>
        </div>
      </div>

      <div className="space-y-4">
        {sortedStudents.slice(0, 5).map((student, index) => (
          <motion.div 
            key={student.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-center justify-between p-4 rounded-2xl ${
              index === 0 ? 'bg-gradient-to-r from-amber-100/50 to-orange-100/50 border border-amber-200/50' : 
              index === 1 ? 'bg-slate-50/80 border border-slate-200/50' :
              index === 2 ? 'bg-orange-50/50 border border-orange-200/30' : 'bg-transparent border border-slate-100'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 flex items-center justify-center font-bold font-display text-lg">
                {index === 0 ? <Medal className="w-7 h-7 text-amber-500" /> : 
                 index === 1 ? <Medal className="w-7 h-7 text-slate-400" /> : 
                 index === 2 ? <Medal className="w-7 h-7 text-orange-400" /> : 
                 <span className="text-slate-400">#{index + 1}</span>}
              </div>
              <div>
                <p className="font-bold text-slate-900">{student.name}</p>
                <div className="flex items-center gap-3 text-xs font-medium text-slate-500 mt-0.5">
                  <span className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-500" /> {student.score} Pts</span>
                  <span>•</span>
                  <span>{student.coursesCompleted} Course</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
