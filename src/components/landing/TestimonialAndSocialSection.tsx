import { useState } from 'react';
import { Star, Headset, Check } from 'lucide-react';
import { toast } from 'sonner';

export function TestimonialAndSocialSection() {
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

  const handleConsultation = () => {
    toast.success("Membuka WhatsApp Konsultasi Program...", {
      description: "Konsultan pendidikan StudyHack siap mendampingi pemilihan kelas."
    });
    window.open("https://wa.me/6282324567906?text=Halo%20StudyHack,%20saya%20ingin%20konsultasi%20program%20bimbel", "_blank");
  };

  const handleContact = () => {
    toast.info("Hubungi Kami", {
      description: "Call Center: (022) 1234-5678 | Email: info@studyhack.id"
    });
  };

  return (
    <>
      {/* Consultation CTA Banner */}
      <section id="konsultasi" className="py-10 bg-white">
        <div className="max-w-[1000px] mx-auto px-6">
          <div className="bg-[#062564] rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between shadow-xl gap-6">
            <div className="flex items-center gap-6 text-white">
              <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 border border-blue-400/30">
                <Headset className="w-8 h-8 text-blue-200" />
              </div>
              <div>
                <h3 className="font-bold text-xl md:text-2xl mb-1">Masih bingung memilih program?</h3>
                <p className="text-blue-200 text-sm">Konsultasikan kebutuhan belajar kamu dengan tim kami.</p>
              </div>
            </div>
            <div className="flex items-center gap-4 shrink-0 w-full md:w-auto">
              <button 
                onClick={handleConsultation}
                className="flex-1 md:flex-none text-center bg-[#19A66A] hover:bg-green-700 text-white font-bold px-6 py-3 rounded-full text-sm transition-colors shadow-lg shadow-green-900/20 cursor-pointer"
              >
                Konsultasi Gratis
              </button>
              <button 
                onClick={handleContact}
                className="flex-1 md:flex-none text-center bg-white hover:bg-slate-100 text-[#062564] font-bold px-6 py-3 rounded-full text-sm transition-colors shadow-lg cursor-pointer"
              >
                Hubungi Kami
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimoni" className="py-10 bg-white">
        <div className="max-w-[1000px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Testimonial Card */}
            <div className="md:col-span-2 bg-[#F8F9FA] rounded-2xl p-6 flex flex-col sm:flex-row gap-6 border border-slate-100 shadow-sm">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden shrink-0 bg-slate-200">
                <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200&h=200" alt="Student" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-1 mb-3">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />)}
                </div>
                <p className="text-slate-700 font-medium text-sm leading-relaxed mb-4 italic">
                  "Belajar di StudyHack sangat membantu saya memahami materi dengan lebih mudah. Tutor ramah dan penjelasannya jelas!"
                </p>
                <div>
                  <h4 className="font-bold text-[#062564] text-sm">Andi Pratama</h4>
                  <p className="text-xs text-slate-500">Siswa Kelas 11 • Target FK UI</p>
                </div>
              </div>
            </div>

            {/* Rating Card */}
            <div className="bg-[#062564] rounded-2xl p-6 text-white flex flex-col justify-center relative overflow-hidden shadow-sm">
              <div className="absolute -top-4 -right-4 w-32 h-32 bg-blue-500/20 rounded-full blur-xl"></div>
              <div className="w-12 h-12 rounded-xl bg-[#F16710] flex items-center justify-center mb-4 shadow-lg shadow-orange-900/20">
                <Star className="w-6 h-6 text-white fill-current" />
              </div>
              <div className="text-3xl font-bold mb-1">4.9/5</div>
              <div className="text-blue-200 text-xs mb-6">dari 500+ ulasan peserta</div>
              <div className="flex items-center">
                <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => (
                    <img key={i} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i+30}`} className="w-8 h-8 rounded-full border-2 border-[#062564] bg-white" alt="Avatar" />
                  ))}
                </div>
                <span className="ml-3 text-xs font-bold">+496</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-12 bg-[#F9F8F9]">
        <div className="max-w-[1240px] mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-[#062564] mb-2">Dipercaya oleh orang tua dari sekolah favorit</h2>
            <p className="text-slate-500 text-sm">Kami berkomitmen memberikan pendidikan terbaik untuk masa depan anak bangsa.</p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8">
            <div className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center gap-2 font-bold text-xs text-red-800">
              <span className="w-6 h-6 rounded bg-red-100 flex items-center justify-center">🏛️</span> Global School
            </div>
            <div className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center gap-2 font-bold text-xs text-blue-800">
              <span className="w-6 h-6 rounded bg-blue-100 flex items-center justify-center">🏫</span> EduNusantara
            </div>
            <div className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center gap-2 font-bold text-xs text-green-800">
              <span className="w-6 h-6 rounded bg-green-100 flex items-center justify-center">🎓</span> Bina Prestasi
            </div>
            <div className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center gap-2 font-bold text-xs text-amber-800">
              <span className="w-6 h-6 rounded bg-yellow-100 flex items-center justify-center">📚</span> Tunas Bangsa
            </div>
            <div className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center gap-2 font-bold text-xs text-purple-800">
              <span className="w-6 h-6 rounded bg-purple-100 flex items-center justify-center">⭐</span> Mentari Inter
            </div>
          </div>
        </div>
      </section>

      {/* Social Media */}
      <section className="py-20 bg-white">
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
    </>
  );
}
