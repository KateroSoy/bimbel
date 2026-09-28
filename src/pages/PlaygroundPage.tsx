import { useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { motion } from 'motion/react';
import { Orbit, Send, Wand2, Timer, AlignLeft, Zap, ScanFace } from 'lucide-react';

export default function PlaygroundPage() {
  const [messages, setMessages] = useState<{role: 'user'|'ai', content: string}[]>([
    { role: 'ai', content: 'Halo! Saya AI Assistant LearnSpace+. Ada yang bisa saya bantu untuk pelajaran hari ini?' }
  ]);
  const [input, setInput] = useState('');
  
  const handleSend = () => {
    if (!input.trim()) return;
    
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setInput('');
    
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'ai', content: 'Baik, saya akan membantu merangkum materi tersebut. Berikut adalah poin-poin pentingnya:\n\n1. Konsep Utama\n2. Definisi\n3. Contoh Penerapan\n\nApakah ada bagian spesifik yang ingin dijelaskan lebih detail?' }]);
    }, 1000);
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto h-[calc(100vh-8rem)] flex flex-col lg:flex-row gap-6">
        
        {/* Main Chat Area */}
        <div className="flex-1 glass-card rounded-3xl flex flex-col overflow-hidden relative shadow-xl">
          {/* Header */}
          <div className="h-16 border-b border-white/50 px-6 flex items-center gap-3 glass z-10 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
              <Orbit className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-slate-900">AI Belajar</h2>
              <p className="text-xs text-slate-500">Tutor virtual siap membantu (Aman untuk Siswa)</p>
            </div>
          </div>
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((msg, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={i} 
                className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-1 ${
                  msg.role === 'user' ? 'bg-slate-900 text-white' : 'bg-blue-600 text-white'
                }`}>
                  {msg.role === 'user' ? 'U' : <Wand2 className="w-4 h-4" />}
                </div>
                <div className={`p-4 rounded-2xl whitespace-pre-wrap text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-slate-900 text-white rounded-tr-sm shadow-md' 
                    : 'glass-card text-slate-800 shadow-sm rounded-tl-sm'
                }`}>
                  {msg.content}
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Input */}
          <div className="p-6 glass border-t border-white/50 shrink-0">
            <div className="relative">
              <input 
                type="text" 
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Tanya apapun tentang pelajaranmu..."
                className="w-full h-14 bg-white/50 border border-white/60 rounded-2xl pl-6 pr-16 focus:bg-white focus:border-blue-500 outline-none transition-all shadow-inner"
              />
              <button 
                onClick={handleSend}
                className="absolute right-2 top-2 bottom-2 w-10 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-500 text-center mt-3 font-medium">
              AI dapat membuat kesalahan. Harap verifikasi fakta penting dengan guru.
            </p>
          </div>
        </div>

        {/* Sidebar Templates */}
        <div className="w-full lg:w-80 space-y-6 hidden lg:block">
          <div className="glass-card rounded-3xl p-6 shadow-xl">
            <h3 className="font-display font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Wand2 className="w-4 h-4 text-blue-600" /> Prompt Cepat
            </h3>
            
            <div className="space-y-3">
              {[
                { title: 'Rangkum Materi', desc: 'Buat ringkasan dari teks panjang', icon: AlignLeft },
                { title: 'Latihan Soal', desc: 'Generate 5 soal pilihan ganda', icon: Timer },
                { title: 'Brainstorm Ide', desc: 'Cari ide project akhir', icon: Zap },
                { title: 'Simulasi Interview', desc: 'Latihan tanya jawab', icon: ScanFace }
              ].map((template, i) => (
                <button 
                  key={i}
                  onClick={() => setInput(`Tolong bantu saya: ${template.title.toLowerCase()}`)}
                  className="w-full flex items-start gap-3 p-3 rounded-xl border border-slate-100 hover:border-blue-300 hover:bg-blue-50 transition-all text-left group"
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-blue-100 text-slate-600 group-hover:text-blue-600 flex items-center justify-center shrink-0">
                    <template.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-700">{template.title}</h4>
                    <p className="text-xs text-slate-500">{template.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-3xl p-6 text-white">
            <h3 className="font-display font-bold mb-2">Tutor Bahasa Inggris</h3>
            <p className="text-blue-100 text-sm mb-4">
              Ketik "Let's practice english" untuk memulai percakapan dan koreksi grammar otomatis.
            </p>
            <button 
              onClick={() => setInput("Let's practice English about my hobby")}
              className="w-full py-2 bg-white text-blue-600 font-bold rounded-xl text-sm hover:bg-slate-50 transition-colors"
            >
              Mulai Latihan
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

