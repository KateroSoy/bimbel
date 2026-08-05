import { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Save, Building2, MapPin, Calendar, Phone, Mail, UserCheck, Globe, RotateCcw } from 'lucide-react';
import { useDataStore } from '../../store/useDataStore';
import { toast } from 'sonner';

export default function PengaturanSekolah() {
  const { schoolSettings, updateSchoolSettings, resetToDefaultData } = useDataStore();
  const [formData, setFormData] = useState(schoolSettings);

  useEffect(() => {
    setFormData(schoolSettings);
  }, [schoolSettings]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSchoolSettings(formData);
    toast.success('Pengaturan profil lembaga bimbel berhasil disimpan dan diperbarui');
  };

  const handleReset = () => {
    if (confirm('Apakah Anda ingin me-reset semua data demo bimbel kembali ke kondisi awal?')) {
      resetToDefaultData();
      toast.success('Data demo berhasil di-reset ke nilai default awal');
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-display font-bold text-slate-900 mb-1">Pengaturan Lembaga Bimbel</h2>
            <p className="text-slate-500 text-sm">Konfigurasi identitas lembaga bimbel, tahun akademik / program aktif, dan opsi data demo.</p>
          </div>
          <button 
            onClick={handleReset}
            className="px-4 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors flex items-center gap-2 text-sm"
          >
            <RotateCcw className="w-4 h-4" /> Reset Data Demo Bimbel
          </button>
        </div>

        <form onSubmit={handleSubmit} className="glass p-8 rounded-3xl border border-white/40 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900">Identitas Lembaga Bimbingan Belajar</h3>
              <p className="text-xs text-slate-500">Informasi ini ditampilkan pada kuitansi SPP resmi, rapor berkala, dan sertifikat kelulusan.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Nama Lembaga Bimbel *</label>
              <input 
                type="text" 
                required
                value={formData.schoolName}
                onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-colors font-medium text-sm" 
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-600" /> Program Akademik & Periode Aktif
              </label>
              <input 
                type="text" 
                required
                value={formData.academicYear}
                onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-colors font-medium text-sm" 
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-600" /> Alamat Lengkap Kampus Bimbel
            </label>
            <textarea 
              rows={3} 
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-colors resize-none font-medium text-sm" 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-blue-600" /> Direktur / Kepala Bimbel
              </label>
              <input 
                type="text" 
                value={formData.principalName}
                onChange={(e) => setFormData({ ...formData, principalName: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-colors font-medium text-sm" 
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-blue-600" /> Nomor Hotline Bimbel & WhatsApp
              </label>
              <input 
                type="text" 
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-colors font-medium text-sm" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-blue-600" /> Email Resmi Lembaga
              </label>
              <input 
                type="email" 
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-colors font-medium text-sm" 
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-blue-600" /> Domain Website / Portal Bimbel
              </label>
              <input 
                type="text" 
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-colors font-medium text-sm" 
              />
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex justify-end">
            <button 
              type="submit"
              className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-md shadow-blue-600/20 flex items-center gap-2 text-sm"
            >
              <Save className="w-5 h-5" /> Simpan Pengaturan Lembaga
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
