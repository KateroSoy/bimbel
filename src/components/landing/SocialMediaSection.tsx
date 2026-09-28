import { useState } from 'react';
import { Check } from 'lucide-react';
import { toast } from 'sonner';

export function SocialMediaSection() {
  const [socialState, setSocialState] = useState<Record<string, boolean>>({});

  const toggleFollow = (platform: string) => {
    const isFollowed = !!socialState[platform];
    setSocialState(prev => ({ ...prev, [platform]: !isFollowed }));
    if (!isFollowed) {
      toast.success(`Berhasil mengikuti ${platform} StudyHack!`, {
        description: "Terima kasih sudah terhubung dengan komunitas belajar kami."
      });
    } else {
      toast.info(`Berhenti mengikuti ${platform}`);
    }
  };

  return (
    <section id="sosial-media" className="py-14 bg-white">
      <div className="max-w-[1240px] mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-[#062564] mb-3">Temukan Kami di Media Sosial</h2>
          <p className="text-slate-500 text-sm">Ikuti akun resmi StudyHack untuk tips belajar, info program, dan konten edukatif lainnya!</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Instagram */}
          <div className="border border-[#DCE3EE] rounded-2xl p-5 bg-white shadow-sm flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl shadow-sm">IG</div>
              <div>
                <h4 className="font-bold text-sm text-slate-800">Instagram</h4>
                <p className="text-[10px] text-slate-500">@studyhack.education</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-4 flex-1">
              <div className="bg-slate-100 rounded-lg aspect-square flex items-center justify-center text-xs text-slate-400">Tips SNBT</div>
              <div className="bg-slate-100 rounded-lg aspect-square flex items-center justify-center text-xs text-slate-400">Kuis Matematika</div>
              <div className="bg-slate-100 rounded-lg aspect-square flex items-center justify-center text-xs text-slate-400">Live Q&A</div>
              <div className="bg-slate-100 rounded-lg aspect-square flex items-center justify-center text-xs text-slate-400">Beasiswa</div>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <div className="font-bold text-sm">1.2K <span className="text-[10px] text-slate-500 font-normal">Followers</span></div>
              <button 
                onClick={() => toggleFollow('Instagram')}
                className={`px-6 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  socialState['Instagram'] ? 'bg-emerald-600 text-white flex items-center gap-1' : 'bg-[#062564] text-white hover:bg-blue-900'
                }`}
              >
                {socialState['Instagram'] ? <><Check className="w-3.5 h-3.5" /> Mengikuti</> : 'Ikuti'}
              </button>
            </div>
          </div>

          {/* TikTok */}
          <div className="border border-[#DCE3EE] rounded-2xl p-5 bg-white shadow-sm flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-white font-bold text-xl shadow-sm">TK</div>
              <div>
                <h4 className="font-bold text-sm text-slate-800">TikTok</h4>
                <p className="text-[10px] text-slate-500">@studyhack.education</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-4 flex-1">
              <div className="bg-slate-100 rounded-lg aspect-[3/4] flex items-center justify-center text-xs text-slate-400 p-2 text-center">Trik Cepat TPS</div>
              <div className="bg-slate-100 rounded-lg aspect-[3/4] flex items-center justify-center text-xs text-slate-400 p-2 text-center">Belajar 15 Menit</div>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <div className="font-bold text-sm">8.7K <span className="text-[10px] text-slate-500 font-normal">Followers</span></div>
              <button 
                onClick={() => toggleFollow('TikTok')}
                className={`px-6 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  socialState['TikTok'] ? 'bg-emerald-600 text-white flex items-center gap-1' : 'bg-[#062564] text-white hover:bg-blue-900'
                }`}
              >
                {socialState['TikTok'] ? <><Check className="w-3.5 h-3.5" /> Mengikuti</> : 'Ikuti'}
              </button>
            </div>
          </div>

          {/* Threads */}
          <div className="border border-[#DCE3EE] rounded-2xl p-5 bg-white shadow-sm flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-white font-bold text-xl shadow-sm">@</div>
              <div>
                <h4 className="font-bold text-sm text-slate-800">Threads</h4>
                <p className="text-[10px] text-slate-500">@studyhack.education</p>
              </div>
            </div>
            <div className="bg-slate-50 rounded-lg p-3 mb-4 flex-1 border border-slate-100">
              <div className="flex gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-slate-200 shrink-0"></div>
                <div className="h-2 w-20 bg-slate-200 rounded mt-2"></div>
              </div>
              <div className="space-y-1.5 pl-8">
                <p className="text-[11px] text-slate-600">Diskusi terbuka: materi apa yang paling menantang minggu ini?</p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <div className="font-bold text-sm">755 <span className="text-[10px] text-slate-500 font-normal">Followers</span></div>
              <button 
                onClick={() => toggleFollow('Threads')}
                className={`px-6 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  socialState['Threads'] ? 'bg-emerald-600 text-white flex items-center gap-1' : 'bg-[#062564] text-white hover:bg-blue-900'
                }`}
              >
                {socialState['Threads'] ? <><Check className="w-3.5 h-3.5" /> Mengikuti</> : 'Ikuti'}
              </button>
            </div>
          </div>

          {/* YouTube */}
          <div className="border border-[#DCE3EE] rounded-2xl p-5 bg-white shadow-sm flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white font-bold text-xl shadow-sm">YT</div>
              <div>
                <h4 className="font-bold text-sm text-slate-800">YouTube</h4>
                <p className="text-[10px] text-slate-500">StudyHack Education</p>
              </div>
            </div>
            <div className="space-y-2 mb-4 flex-1">
              <div className="bg-slate-100 rounded-lg aspect-video flex items-center justify-center text-xs text-slate-500">▶ Bedah Tuntas UTBK</div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-100 rounded-lg aspect-video flex items-center justify-center text-[10px] text-slate-400">▶ Aljabar</div>
                <div className="bg-slate-100 rounded-lg aspect-video flex items-center justify-center text-[10px] text-slate-400">▶ Grammar</div>
              </div>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <div className="font-bold text-sm">4.1K <span className="text-[10px] text-slate-500 font-normal">Subscribers</span></div>
              <button 
                onClick={() => toggleFollow('YouTube')}
                className={`px-6 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  socialState['YouTube'] ? 'bg-emerald-600 text-white flex items-center gap-1' : 'bg-[#E52833] text-white hover:bg-red-700'
                }`}
              >
                {socialState['YouTube'] ? <><Check className="w-3.5 h-3.5" /> Subscribed</> : 'Subscribe'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
