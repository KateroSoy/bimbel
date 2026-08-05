import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';

const data = [
  { name: 'Jan', students: 4000, completion: 60 },
  { name: 'Feb', students: 4200, completion: 65 },
  { name: 'Mar', students: 4500, completion: 70 },
  { name: 'Apr', students: 4800, completion: 72 },
  { name: 'May', students: 5100, completion: 78 },
  { name: 'Jun', students: 5400, completion: 82 },
  { name: 'Jul', students: 5800, completion: 85 },
];

interface AdminStatsCardProps {
  title: string;
  value: string | number;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  type?: 'students' | 'completion';
}

export const AdminStatsCard: React.FC<AdminStatsCardProps> = ({ 
  title, 
  value, 
  trend,
  type = 'students'
}) => {
  return (
    <div className="glass-card bg-white/40 backdrop-blur-3xl border border-white/60 shadow-[0_8px_32px_rgba(37,99,235,0.15)] rounded-3xl p-6 flex flex-col gap-4 overflow-hidden relative group hover:shadow-[0_16px_48px_rgba(37,99,235,0.2)] transition-all duration-500">
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 z-0"></div>
      
      <div className="flex justify-between items-start z-10 relative">
        <div className="flex flex-col gap-1">
          <h3 className="text-xs uppercase tracking-wider font-bold text-slate-500/80">{title}</h3>
          <p className="text-4xl font-bold font-display text-slate-900 tracking-tight">{value}</p>
        </div>
        {trend && (
          <div className={`px-2.5 py-1 rounded-full text-xs font-bold shadow-sm ${trend.isPositive ? 'bg-emerald-100/80 text-emerald-700 border border-emerald-200/50' : 'bg-rose-100/80 text-rose-700 border border-rose-200/50'}`}>
            {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
          </div>
        )}
      </div>
      
      <div className="h-28 w-full mt-2 z-10 relative">
        <ResponsiveContainer width="100%" height="100%">
          {type === 'students' ? (
            <AreaChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: '1px solid rgba(255,255,255,0.6)', backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(12px)', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ color: '#2563EB', fontWeight: 700 }}
                labelStyle={{ color: '#64748b', fontWeight: 600 }}
              />
              <Area type="monotone" dataKey="students" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#colorStudents)" />
            </AreaChart>
          ) : (
            <LineChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: '1px solid rgba(255,255,255,0.6)', backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(12px)', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ color: '#38BDF8', fontWeight: 700 }}
                labelStyle={{ color: '#64748b', fontWeight: 600 }}
              />
              <Line type="monotone" dataKey="completion" stroke="#38BDF8" strokeWidth={3} dot={{ r: 4, fill: '#38BDF8', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};
