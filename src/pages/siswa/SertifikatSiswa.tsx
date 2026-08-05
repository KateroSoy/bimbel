import { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Award, Download, Eye, CheckCircle2 } from 'lucide-react';
import { useDataStore, Certificate } from '../../store/useDataStore';
import { CertificateModal } from '../../components/common/CertificateModal';
import { motion } from 'motion/react';
import { toast } from 'sonner';

export default function SertifikatSiswa() {
  const { certificates } = useDataStore();
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

  const handleDownloadDirect = (cert: Certificate) => {
    toast.success(`Mengunduh berkas sertifikat "${cert.title}" (PDF)`);
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h2 className="text-3xl font-display font-bold text-slate-900 mb-2">Sertifikat & Penghargaan Digital</h2>
          <p className="text-slate-500">Sertifikat kelulusan kursus dan evaluasi resmi terverifikasi dengan kode kredensial unik.</p>
        </div>

        {/* Certificate Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certificates.map((s, i) => (
            <motion.div 
              key={s.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass p-6 rounded-3xl border border-white/40 shadow-sm flex flex-col justify-between hover:shadow-lg hover:border-amber-200 transition-all bg-white group"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Award className="w-8 h-8" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Terverifikasi Resmi
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 leading-tight mb-1 group-hover:text-blue-600 transition-colors">
                    {s.title}
                  </h3>
                  <p className="text-slate-500 text-xs font-medium">Penerbit: <strong className="text-slate-700">{s.issuer}</strong></p>
                </div>
              </div>

              <div className="py-3 px-4 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center text-xs text-slate-600 font-mono mb-4">
                <span>No. Kredensial:</span>
                <span className="font-bold text-slate-900">{s.credentialId}</span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="text-xs text-slate-400 font-medium">Diterbitkan: {s.date}</span>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setSelectedCert(s)}
                    className="px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl transition-colors font-bold text-xs flex items-center gap-1.5"
                  >
                    <Eye className="w-4 h-4" /> Lihat Sertifikat
                  </button>
                  <button 
                    onClick={() => handleDownloadDirect(s)}
                    className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <CertificateModal
        isOpen={!!selectedCert}
        onClose={() => setSelectedCert(null)}
        certificate={selectedCert}
      />
    </DashboardLayout>
  );
}
