import { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Download, 
  QrCode, 
  Building2, 
  Wallet, 
  FileCheck2, 
  X, 
  Copy, 
  Upload,
  Receipt,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useDataStore, TuitionPayment } from '../../store/useDataStore';
import { toast } from 'sonner';

export default function PembayaranSppSiswa() {
  const { tuitionPayments, payTuition, schoolSettings, students } = useDataStore();
  const currentStudent = students[0] || { name: 'Budi Santoso', id: '1001', grade: 'Batch UTBK 1' };

  const [activeTab, setActiveTab] = useState<'all' | 'unpaid' | 'paid'>('all');
  const [selectedInvoice, setSelectedInvoice] = useState<TuitionPayment | null>(null);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<'qris' | 'va_bca' | 'va_mandiri' | 'transfer'>('qris');
  const [isProcessing, setIsProcessing] = useState(false);

  const studentInvoices = tuitionPayments.filter(
    (p) => p.studentId === currentStudent.id || p.studentName === currentStudent.name
  );

  const totalPaid = studentInvoices
    .filter((p) => p.status === 'Lunas')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalUnpaid = studentInvoices
    .filter((p) => p.status === 'Belum Dibayar')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const filteredInvoices = studentInvoices.filter((inv) => {
    if (activeTab === 'paid') return inv.status === 'Lunas';
    if (activeTab === 'unpaid') return inv.status === 'Belum Dibayar';
    return true;
  });

  const handleOpenPay = (invoice: TuitionPayment) => {
    setSelectedInvoice(invoice);
    setIsPayModalOpen(true);
  };

  const handleOpenReceipt = (invoice: TuitionPayment) => {
    setSelectedInvoice(invoice);
    setIsReceiptModalOpen(true);
  };

  const handleConfirmPayment = () => {
    if (!selectedInvoice) return;
    setIsProcessing(true);

    const methodNames: Record<string, string> = {
      qris: 'QRIS Realtime',
      va_bca: 'BCA Virtual Account',
      va_mandiri: 'Mandiri Virtual Account',
      transfer: 'Transfer Bank Manual',
    };

    setTimeout(() => {
      payTuition(selectedInvoice.id, methodNames[selectedMethod] || 'Transfer Online');
      setIsProcessing(false);
      setIsPayModalOpen(false);
      toast.success('Pembayaran Berhasil Diverifikasi!', {
        description: `Tagihan ${selectedInvoice.description} sebesar Rp ${selectedInvoice.amount.toLocaleString('id-ID')} telah lunas.`
      });
      // Automatically open receipt preview
      setIsReceiptModalOpen(true);
    }, 1200);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} berhasil disalin ke clipboard!`);
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-lg bg-emerald-100 text-emerald-700 font-bold text-xs">
                Status: Siswa Aktif Terdaftar
              </span>
              <span className="text-xs text-slate-500 font-medium">No. Registrasi: {currentStudent.id}</span>
            </div>
            <h2 className="text-3xl font-display font-bold text-slate-900 mb-1">
              Histori Pembayaran SPP & Biaya Bimbel
            </h2>
            <p className="text-slate-500 text-sm">
              Kelola tagihan iuran bulanan, paket belajar intensif, tryout nasional, dan unduh kuitansi resmi bimbel.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const firstUnpaid = studentInvoices.find((i) => i.status === 'Belum Dibayar');
                if (firstUnpaid) {
                  handleOpenPay(firstUnpaid);
                } else {
                  toast.info('Seluruh tagihan bimbel Anda telah lunas!');
                }
              }}
              className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-md shadow-blue-600/20 active:scale-95 text-sm"
            >
              <CreditCard className="w-4 h-4" />
              Bayar Tagihan Terdekat
            </button>
          </div>
        </div>

        {/* Financial Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-5 rounded-3xl border border-white/40 shadow-sm bg-white"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Terbayar</span>
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-display font-bold text-slate-900">
              Rp {totalPaid.toLocaleString('id-ID')}
            </p>
            <p className="text-xs text-emerald-600 font-semibold mt-1">Lunas 3 Periode</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="glass p-5 rounded-3xl border border-white/40 shadow-sm bg-white"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tagihan Tertunda</span>
              <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-display font-bold text-rose-600">
              Rp {totalUnpaid.toLocaleString('id-ID')}
            </p>
            <p className="text-xs text-rose-500 font-medium mt-1">
              {studentInvoices.filter((p) => p.status === 'Belum Dibayar').length} Tagihan Belum Dibayar
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass p-5 rounded-3xl border border-white/40 shadow-sm bg-white"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Jatuh Tempo Terdekat</span>
              <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                <AlertCircle className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-display font-bold text-slate-900">10 Des 2024</p>
            <p className="text-xs text-amber-600 font-medium mt-1">SPP Periode Desember</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass p-5 rounded-3xl border border-white/40 shadow-sm bg-white"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Paket Belajar</span>
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                <Sparkles className="w-5 h-5" />
              </div>
            </div>
            <p className="text-xl font-bold text-slate-900 truncate">{currentStudent.grade}</p>
            <p className="text-xs text-blue-600 font-medium mt-1">Layanan Reguler + Tryout</p>
          </motion.div>
        </div>

        {/* Invoice Tabs & List */}
        <div className="glass rounded-3xl border border-white/40 shadow-sm bg-white overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex gap-2 bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-lg font-bold text-xs transition-all ${
                  activeTab === 'all' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Semua Invoice ({studentInvoices.length})
              </button>
              <button
                onClick={() => setActiveTab('unpaid')}
                className={`px-4 py-2 rounded-lg font-bold text-xs transition-all ${
                  activeTab === 'unpaid' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Belum Bayar ({studentInvoices.filter((p) => p.status === 'Belum Dibayar').length})
              </button>
              <button
                onClick={() => setActiveTab('paid')}
                className={`px-4 py-2 rounded-lg font-bold text-xs transition-all ${
                  activeTab === 'paid' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Lunas ({studentInvoices.filter((p) => p.status === 'Lunas').length})
              </button>
            </div>

            <span className="text-xs text-slate-400 font-medium">
              Sistem Pembayaran Terintegrasi Otomatis
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            <AnimatePresence mode="popLayout">
              {filteredInvoices.map((inv, i) => (
                <motion.div
                  key={inv.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2, delay: i * 0.04 }}
                  className="p-6 hover:bg-slate-50/50 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3.5 rounded-2xl shrink-0 mt-1 ${
                      inv.status === 'Lunas' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                    }`}>
                      <Receipt className="w-6 h-6" />
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="font-bold text-slate-900 text-base">{inv.description}</span>
                        <span className="font-mono text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                          {inv.invoiceNo}
                        </span>
                        {inv.status === 'Lunas' ? (
                          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Lunas
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-full text-xs font-bold flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> Menunggu Pembayaran
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium">
                        <span>Periode: <strong className="text-slate-700">{inv.period}</strong></span>
                        <span>Jatuh Tempo: <strong className="text-slate-700">{inv.dueDate}</strong></span>
                        {inv.paidDate && (
                          <span className="text-emerald-700 font-semibold">
                            Dibayar: {inv.paidDate} ({inv.paymentMethod})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between lg:justify-end gap-6 border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-100">
                    <div className="text-left lg:text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Total Tagihan</span>
                      <span className="text-xl font-display font-bold text-slate-900">
                        Rp {inv.amount.toLocaleString('id-ID')}
                      </span>
                    </div>

                    {inv.status === 'Belum Dibayar' ? (
                      <button
                        onClick={() => handleOpenPay(inv)}
                        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-blue-600/20 active:scale-95 flex items-center gap-2"
                      >
                        <CreditCard className="w-4 h-4" />
                        Bayar Sekarang
                      </button>
                    ) : (
                      <button
                        onClick={() => handleOpenReceipt(inv)}
                        className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors flex items-center gap-2"
                      >
                        <Download className="w-4 h-4 text-blue-600" />
                        Kuitansi Lunas
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredInvoices.length === 0 && (
              <div className="p-12 text-center text-slate-400 text-sm">
                Tidak ada data transaksi pembayaran pada tab ini.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Payment Simulator Modal */}
      {isPayModalOpen && selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setIsPayModalOpen(false)}
              className="absolute right-5 top-5 p-2 rounded-xl text-slate-400 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-slate-900">Pembayaran Biaya Bimbel</h3>
                  <p className="text-xs text-slate-500 font-mono">{selectedInvoice.invoiceNo}</p>
                </div>
              </div>
            </div>

            {/* Bill Summary */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Item Pembayaran:</span>
                <span className="font-bold text-slate-900">{selectedInvoice.description}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Periode:</span>
                <span className="font-bold text-slate-700">{selectedInvoice.period}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200">
                <span className="text-slate-700 font-bold text-sm">Total Harus Dibayar:</span>
                <span className="font-display font-bold text-blue-600 text-base">
                  Rp {selectedInvoice.amount.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Pilih Metode Pembayaran
              </label>

              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { id: 'qris', name: 'QRIS Interaktif', icon: QrCode, desc: 'BCA, GoPay, OVO, ShopeePay' },
                  { id: 'va_bca', name: 'BCA Virtual Account', icon: Building2, desc: '827390100100234' },
                  { id: 'va_mandiri', name: 'Mandiri VA', icon: Building2, desc: '8890100100234' },
                  { id: 'transfer', name: 'Transfer Bank Manual', icon: Wallet, desc: 'Bank BRI & BNI' },
                ].map((method) => (
                  <div
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id as any)}
                    className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                      selectedMethod === method.id
                        ? 'border-blue-600 bg-blue-50/70 text-blue-900 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <method.icon className={`w-4 h-4 mb-1.5 ${selectedMethod === method.id ? 'text-blue-600' : 'text-slate-400'}`} />
                    <p className="font-bold text-xs leading-snug">{method.name}</p>
                    <p className="text-[10px] text-slate-500 truncate mt-0.5">{method.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Method Details Box */}
            <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 text-center">
              {selectedMethod === 'qris' && (
                <div className="flex flex-col items-center gap-2">
                  <p className="text-xs font-bold text-slate-700">Scan QRIS Menggunakan Aplikasi Mobile Banking / E-Wallet</p>
                  <div className="w-36 h-36 bg-white p-2 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIMBELVERSE-PAY-${selectedInvoice.id}-${selectedInvoice.amount}`} 
                      alt="QR Code Bimbel"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">NMID: ID1020092837482 BIMBELVERSE</span>
                </div>
              )}

              {selectedMethod.startsWith('va_') && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-600">Nomor Virtual Account Pembayaran:</p>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-lg font-mono font-bold text-blue-700">
                      {selectedMethod === 'va_bca' ? '8273 9010 0100 234' : '8890 1001 0023 441'}
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard('827390100100234', 'Nomor Virtual Account')}
                      className="p-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-500">Otomatis terverifikasi dalam hitungan detik setelah transfer.</p>
                </div>
              )}

              {selectedMethod === 'transfer' && (
                <div className="space-y-2 text-xs text-slate-600">
                  <p className="font-semibold">Rekening Resmi Bimbel Bintang Prestasi:</p>
                  <p className="font-mono font-bold text-slate-900">Bank BRI: 0123-01-002891-53-4</p>
                  <p className="text-[11px] text-slate-500">a.n. Yayasan Bimbel Bintang Prestasi Indonesia</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsPayModalOpen(false)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleConfirmPayment}
                className="px-6 py-2.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 text-xs shadow-md shadow-emerald-600/20 flex items-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? (
                  <span>Memproses Pembayaran...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Konfirmasi Pembayaran Selesai
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Official Receipt Modal */}
      {isReceiptModalOpen && selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl relative">
            <button
              onClick={() => setIsReceiptModalOpen(false)}
              className="absolute right-5 top-5 p-2 rounded-xl text-slate-400 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header / Kop */}
            <div className="border-b-2 border-slate-900 pb-4 text-center space-y-1">
              <h3 className="font-bold text-xl text-slate-900 tracking-tight uppercase">
                {schoolSettings.schoolName}
              </h3>
              <p className="text-xs text-slate-600">{schoolSettings.address}</p>
              <p className="text-xs text-slate-500 font-mono">Telp: {schoolSettings.phone} • {schoolSettings.website}</p>
            </div>

            <div className="text-center relative">
              <h4 className="font-bold text-base text-slate-900 uppercase tracking-wide">
                BUKTI PEMBAYARAN RESMI (KUITANSI)
              </h4>
              <p className="text-xs font-mono text-slate-500 mt-0.5">No. Kuitansi: {selectedInvoice.invoiceNo}</p>
            </div>

            {/* Receipt Details */}
            <div className="space-y-3 bg-slate-50 p-5 rounded-2xl border border-slate-200 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Telah Diterima Dari:</span>
                <span className="font-bold text-slate-900">{currentStudent.name} (NIS: {currentStudent.id})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Program / Batch:</span>
                <span className="font-bold text-slate-900">{currentStudent.grade}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Untuk Pembayaran:</span>
                <span className="font-bold text-blue-700">{selectedInvoice.description}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Metode Pembayaran:</span>
                <span className="font-medium text-slate-800">{selectedInvoice.paymentMethod || 'QRIS Digital'}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Waktu Pembayaran:</span>
                <span className="font-mono text-slate-700">{selectedInvoice.paidDate || 'Lunas'}</span>
              </div>
            </div>

            {/* Total Amount & Lunas Stamp */}
            <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
              <div>
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">Jumlah Pembayaran</span>
                <span className="text-2xl font-display font-bold text-emerald-700">
                  Rp {selectedInvoice.amount.toLocaleString('id-ID')}
                </span>
              </div>

              <div className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold text-sm tracking-wider uppercase shadow-sm flex items-center gap-1.5 rotate-[-2deg]">
                <FileCheck2 className="w-4 h-4" />
                LUNAS
              </div>
            </div>

            {/* Verification Footer */}
            <div className="pt-2 text-center text-xs text-slate-400 space-y-1">
              <p>Dokumen ini diterbitkan secara otomatis dan sah sebagai bukti pembayaran resmi bimbel.</p>
              <p className="font-mono text-[10px]">Security Hash: SHA256-{selectedInvoice.invoiceNo}-VERIFIED</p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
              <button
                onClick={() => setIsReceiptModalOpen(false)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  toast.success('Kuitansi berhasil diunduh sebagai PDF');
                  window.print();
                }}
                className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 text-xs shadow-md shadow-blue-600/20 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Unduh Kuitansi PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
