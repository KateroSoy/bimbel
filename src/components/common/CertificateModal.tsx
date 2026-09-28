import { motion, AnimatePresence } from 'motion/react';
import { X, Download, Award, CheckCircle2, ShieldCheck, Sparkles, Printer } from 'lucide-react';
import { CertificateItem } from '../../store/useDataStore';
import { toast } from 'sonner';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  certificate: CertificateItem | null;
}

export function CertificateModal({ isOpen, onClose, certificate }: CertificateModalProps) {
  if (!isOpen || !certificate) return null;

  const handleDownload = () => {
    toast.success(`Mengunduh sertifikat resmi: ${certificate.title}.pdf`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header Bar */}
          <div className="p-4 px-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <div className="flex items-center gap-2 text-slate-700 font-bold text-sm">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              Sertifikat Terverifikasi Digital
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={handlePrint}
                className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-xl transition-colors text-xs font-bold flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" /> Cetak
              </button>
              <button 
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-200 text-slate-500 hover:bg-slate-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Certificate Body (Pre-styled Certificate layout) */}
          <div className="p-8 md:p-12 bg-gradient-to-br from-amber-50/40 via-white to-blue-50/40 relative overflow-hidden text-center border-8 border-double border-amber-200/80 m-4 rounded-2xl">
            {/* Watermark/Badges */}
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-amber-400/10 rounded-full blur-2xl pointer-events-none"></div>
            <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-blue-400/10 rounded-full blur-2xl pointer-events-none"></div>

            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/30">
                <Award className="w-8 h-8" />
              </div>
            </div>

            <p className="text-xs font-extrabold uppercase tracking-widest text-amber-700 mb-1 flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> SERTIFIKAT KELULUSAN & PENGHARGAAN <Sparkles className="w-3.5 h-3.5" />
            </p>
            <h2 className="text-3xl md:text-4xl font-serif font-black text-slate-900 tracking-tight mb-4">
              LearnSpace+ ACADEMY
            </h2>

            <p className="text-sm text-slate-500 italic mb-3">Sertifikat ini dengan bangga dianugerahkan kepada:</p>
            <p className="text-2xl md:text-3xl font-bold font-display text-blue-900 border-b-2 border-slate-200 inline-block px-8 pb-1 mb-4">
              {certificate.recipientName}
            </p>

            <p className="text-sm text-slate-600 max-w-lg mx-auto mb-2">
              Atas keberhasilan dan dedikasi luar biasa dalam menyelesaikan program kompetensi:
            </p>
            <h3 className="text-xl font-bold text-slate-900 mb-1">
              "{certificate.title}"
            </h3>
            <p className="text-xs font-bold text-emerald-600 mb-6 bg-emerald-50 px-3 py-1 rounded-full inline-block">
              Predikat: {certificate.gradeScore}
            </p>

            <div className="grid grid-cols-2 gap-8 pt-6 border-t border-slate-200/80 max-w-md mx-auto text-left">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tanggal Penerbitan</p>
                <p className="text-xs font-bold text-slate-700">{certificate.date}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{certificate.issuer}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nomor Kredensial</p>
                <p className="text-xs font-mono font-bold text-blue-700">{certificate.credentialId}</p>
                <p className="text-[10px] text-emerald-600 font-bold flex items-center justify-end gap-1 mt-0.5">
                  <CheckCircle2 className="w-3 h-3" /> Valid & Verified
                </p>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="p-4 px-6 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
            <span className="text-xs text-slate-500 font-medium">Format file: PDF Kualitas Tinggi (300 DPI)</span>
            <button 
              onClick={handleDownload}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-blue-500/20 transition-all flex items-center gap-2 text-sm"
            >
              <Download className="w-4 h-4" /> Unduh Sertifikat Digital (PDF)
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
