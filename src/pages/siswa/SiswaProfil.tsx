import { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Save, UserCheck, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function SiswaProfil() {
  const [profile, setProfile] = useState({
    name: 'Andi Pratama',
    role: 'Siswa Aktif',
    class: 'Kelas X IPA 1',
    nisn: '0081234567',
    nis: '10293',
    email: 'andi.pratama@siswa.sekolahverse.id',
    phone: '0812-3456-7890',
    address: 'Jl. Merdeka No. 45, Jakarta Selatan',
    guardian: 'Bapak Hendra Gunawan',
    academicYear: '2024/2025',
    major: 'Ilmu Pengetahuan Alam (IPA)',
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    toast.success('Profil siswa berhasil diperbarui');
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-display font-bold text-slate-900 mb-1">Profil Siswa</h2>
            <p className="text-slate-500 text-sm">Informasi identitas kesiswaan, kontak personal, dan data akademik resmi.</p>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 font-bold text-xs text-slate-700 shadow-sm transition-colors"
          >
            {isEditing ? 'Batal Edit' : 'Edit Kontak'}
          </button>
        </div>
        
        <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:col-span-1 glass p-6 rounded-3xl border border-white/40 shadow-sm text-center bg-white flex flex-col items-center justify-center"
          >
            <div className="w-32 h-32 mx-auto rounded-full bg-slate-100 mb-4 overflow-hidden border-4 border-white shadow-md">
              <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Andi" alt="Andi Pratama" className="w-full h-full object-cover" />
            </div>
            <h3 className="font-bold text-xl text-slate-900">{profile.name}</h3>
            <p className="text-slate-500 text-xs font-semibold mb-2">{profile.role}</p>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
              <ShieldCheck className="w-3.5 h-3.5" /> {profile.class}
            </span>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-2 glass p-6 rounded-3xl border border-white/40 shadow-sm bg-white"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-bold text-lg text-slate-900">Informasi Pribadi & Kontak</h3>
              {isEditing && (
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">Mode Edit</span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">NISN</label>
                <p className="font-semibold text-slate-800 text-sm bg-slate-50 p-2.5 rounded-xl border border-slate-100">{profile.nisn}</p>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">NIS</label>
                <p className="font-semibold text-slate-800 text-sm bg-slate-50 p-2.5 rounded-xl border border-slate-100">{profile.nis}</p>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Mail className="w-3 h-3 text-blue-500" /> Email Pribadi
                </label>
                {isEditing ? (
                  <input 
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="font-medium text-slate-700 text-sm p-2">{profile.email}</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-blue-500" /> Nomor HP / WhatsApp
                </label>
                {isEditing ? (
                  <input 
                    type="text"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="font-medium text-slate-700 text-sm p-2">{profile.phone}</p>
                )}
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-blue-500" /> Alamat Domisili
                </label>
                {isEditing ? (
                  <input 
                    type="text"
                    value={profile.address}
                    onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="font-medium text-slate-700 text-sm p-2">{profile.address}</p>
                )}
              </div>
            </div>

            <h3 className="font-bold text-lg text-slate-900 mb-4 mt-6 border-b border-slate-100 pb-2">Informasi Akademik Lembaga</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Wali Kelas</p>
                <p className="font-medium text-slate-700 text-sm">{profile.guardian}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Tahun Ajaran</p>
                <p className="font-medium text-slate-700 text-sm">{profile.academicYear}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Peminatan / Jurusan</p>
                <p className="font-medium text-slate-700 text-sm">{profile.major}</p>
              </div>
            </div>

            {isEditing && (
              <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-md flex items-center gap-2 text-sm"
                >
                  <Save className="w-4 h-4" /> Simpan Perubahan
                </button>
              </div>
            )}
          </motion.div>
        </form>
      </div>
    </DashboardLayout>
  );
}
