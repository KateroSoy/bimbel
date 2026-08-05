import { useState, useMemo } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { motion, AnimatePresence } from 'motion/react';
import {
  MessageSquare,
  Send,
  Users,
  Copy,
  Check,
  Search,
  Filter,
  CreditCard,
  UserCheck,
  Sparkles,
  Calendar,
  BarChart,
  Phone,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Clock,
  RotateCcw,
  Smartphone,
  Eye,
  AlertCircle,
  FileText
} from 'lucide-react';
import { useDataStore, WhatsAppMessageLog, Student } from '../../store/useDataStore';
import { toast } from 'sonner';

export default function KirimWaOrtu() {
  const { students, tuitionPayments, attendanceLogs, whatsAppLogs, sendWhatsAppMessage, schoolSettings } = useDataStore();

  const [activeTab, setActiveTab] = useState<'single' | 'broadcast' | 'logs'>('single');

  // Single Message Form State
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '1001');
  const [selectedCategory, setSelectedCategory] = useState<
    'Pengingat SPP' | 'Laporan Absensi' | 'Pengumuman Tryout' | 'Jadwal Bimbel' | 'Evaluasi Belajar' | 'Umum'
  >('Pengingat SPP');
  const [customMessage, setCustomMessage] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [searchLogQuery, setSearchLogQuery] = useState('');
  const [logCategoryFilter, setLogCategoryFilter] = useState('all');

  // Broadcast Form State
  const [broadcastBatch, setBroadcastBatch] = useState<string>('Batch UTBK 1');
  const [broadcastCategory, setBroadcastCategory] = useState<'Pengumuman Tryout' | 'Jadwal Bimbel' | 'Umum'>('Pengumuman Tryout');
  const [broadcastTitle, setBroadcastTitle] = useState('Pemberitahuan Pelaksanaan Tryout Akbar SNBT 2025');
  const [broadcastBody, setBroadcastBody] = useState(
    'Diberitahukan kepada seluruh Orang Tua/Wali Murid BimbelVerse bahwa Tryout Akbar Nasional SNBT 2025 akan diselenggarakan serentak pada hari Sabtu mendatang pukul 08.00 WIB melalui portal CBT eSchool. Mohon pastikan ananda mempersiapkan diri dengan maksimal.'
  );
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  // Selected student object
  const selectedStudent = useMemo(() => {
    return students.find((s) => s.id === selectedStudentId) || students[0];
  }, [students, selectedStudentId]);

  // Unpaid SPP for selected student
  const studentUnpaidSPP = useMemo(() => {
    return tuitionPayments.find((p) => p.studentId === selectedStudent?.id && p.status !== 'Lunas');
  }, [tuitionPayments, selectedStudent]);

  // Recent attendance for selected student
  const studentRecentAttendance = useMemo(() => {
    return attendanceLogs.find((a) => a.studentId === selectedStudent?.id) || attendanceLogs[0];
  }, [attendanceLogs, selectedStudent]);

  // Auto-compose message text based on Category & Templates
  const defaultTemplateMessage = useMemo(() => {
    if (!selectedStudent) return '';
    const parent = selectedStudent.parentName || `Orang Tua Ananda ${selectedStudent.name}`;
    const sName = selectedStudent.name;
    const grade = selectedStudent.grade;
    const sNameFormal = `${sName} (${grade})`;

    switch (selectedCategory) {
      case 'Pengingat SPP': {
        const amountStr = studentUnpaidSPP ? `Rp ${studentUnpaidSPP.amount.toLocaleString('id-ID')}` : 'Rp 650.000';
        const periodStr = studentUnpaidSPP ? studentUnpaidSPP.period : 'Desember 2024';
        const dueStr = studentUnpaidSPP ? studentUnpaidSPP.dueDate : '10 Desember 2024';
        return `*PEMBERITAHUAN SPP BIMBEL - ${schoolSettings.schoolName.toUpperCase()}*\n\n` +
          `Yth. *${parent}*,\n` +
          `Wali dari siswa: *${sNameFormal}*\n\n` +
          `Kami menginformasikan tagihan bimbingan belajar ananda untuk periode *${periodStr}* sebesar *${amountStr}* (Jatuh Tempo: *${dueStr}*).\n\n` +
          `💳 Pembayaran dapat dilakukan via:\n` +
          `• *QRIS All Payment* di Portal Siswa\n` +
          `• *Virtual Account BCA*: 88012${selectedStudent.id}\n` +
          `• *Transfer Mandiri*: 137-00-198822-1 a.n BimbelVerse Edukasi\n\n` +
          `Setelah transfer, kuitansi digital otomatis terbit di portal murid. Terima kasih atas kerja samanya.\n\n` +
          `_Admin Keuangan ${schoolSettings.schoolName}_\n` +
          `_Hotline: ${schoolSettings.phone}_`;
      }

      case 'Laporan Absensi': {
        const status = studentRecentAttendance?.status || 'Hadir';
        const date = studentRecentAttendance?.date || new Date().toISOString().split('T')[0];
        const subject = studentRecentAttendance?.subject || 'TPS Penalaran Matematika';
        const topic = studentRecentAttendance?.topic || 'Trik Kilat Aljabar & Fungsi';
        return `*LAPORAN PRESENSI KELAS BIMBEL*\n\n` +
          `Yth. *${parent}*,\n` +
          `Wali dari siswa: *${sNameFormal}*\n\n` +
          `Kami menginformasikan bahwa ananda pada hari ini telah tercatat:\n` +
          `📌 *Status Kehadiran*: *${status.toUpperCase()}*\n` +
          `📅 *Tanggal*: ${date}\n` +
          `📚 *Mata Pelajaran*: ${subject}\n` +
          `💡 *Topik Bahasan*: ${topic}\n` +
          `👨‍🏫 *Tentor*: ${studentRecentAttendance?.tutor || 'Tentor Master'}\n\n` +
          `Riwayat presensi lengkap dan modul belajar dapat dipantau di akun portal murid.\n\n` +
          `_Akademik & Kesiswaan ${schoolSettings.schoolName}_`;
      }

      case 'Pengumuman Tryout':
        return `*PENGUMUMAN SIMULASI TRYOUT AKBAR NASIONAL*\n\n` +
          `Yth. *${parent}*,\n` +
          `Wali dari siswa: *${sNameFormal}*\n\n` +
          `Diberitahukan bahwa ananda dijadwalkan mengikuti *Simulasi Tryout Akbar SNBT 2025* dengan standar sistem penilaian IRT resmi:\n\n` +
          `🗓 *Hari/Tanggal*: Sabtu, 14 Desember 2024\n` +
          `⏰ *Waktu*: 08.30 - 12.00 WIB\n` +
          `💻 *Platform*: CBT eSchool BimbelVerse\n\n` +
          `Mohon bantuannya untuk mengingatkan ananda agar hadir tepat waktu dan menjaga kondisi kesehatan.\n\n` +
          `_Divisi Evaluasi Belajar ${schoolSettings.schoolName}_`;

      case 'Evaluasi Belajar':
        return `*LAPORAN PERKEMBANGAN & EVALUASI HASIL BELAJAR*\n\n` +
          `Yth. *${parent}*,\n` +
          `Wali dari siswa: *${sNameFormal}*\n\n` +
          `Hasil evaluasi progres belajar ananda bulan ini menunjukkan capaian yang sangat positif:\n` +
          `📈 *Rata-rata Skor Tryout*: *${selectedStudent.gpa >= 3.8 ? '715 (Peluang Lolos: 94%)' : '650 (Peluang Lolos: 85%)'}*\n` +
          `🎯 *Tingkat Presensi*: *${selectedStudent.attendance || '98%'}*\n` +
          `⭐ *Catatan Konselor*: Konsisten dalam pengerjaan tugas & drill soal harian.\n\n` +
          `Rincian evaluasi dan grafik perkembangan tersedia di menu Evaluasi portal siswa.\n\n` +
          `_Konselor Akademik ${schoolSettings.schoolName}_`;

      case 'Jadwal Bimbel':
        return `*INFORMASI JADWAL BIMBEL & KLINIK KONSULTASI*\n\n` +
          `Yth. *${parent}*,\n` +
          `Wali dari siswa: *${sNameFormal}*\n\n` +
          `Berikut pengingat jadwal bimbingan belajar ananda untuk pekan ini:\n` +
          `• Senin & Rabu: 16.00 - 18.00 WIB (Studio Belajar 1)\n` +
          `• Jumat: Klinik Konsultasi PR & Bedah Soal (15.30 WIB)\n\n` +
          `Pastikan ananda membawa modul cetak dan buku catatan bimbel.\n\n` +
          `_Layanan Siswa ${schoolSettings.schoolName}_`;

      default:
        return `Yth. *${parent}*,\nWali dari *${sNameFormal}*.\n\n(Tulis pesan kustom Anda di sini...)\n\n_Salam hangat, ${schoolSettings.schoolName}_`;
    }
  }, [selectedCategory, selectedStudent, studentUnpaidSPP, studentRecentAttendance, schoolSettings]);

  // Effective message (custom or template)
  const activeMessage = customMessage.trim() !== '' ? customMessage : defaultTemplateMessage;

  // Generate WhatsApp Direct URL
  const whatsappUrl = useMemo(() => {
    if (!selectedStudent) return '#';
    let phone = selectedStudent.parentPhone || selectedStudent.phone || '081234567890';
    // Format to international 62xxx
    let cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '62' + cleanPhone.slice(1);
    }
    const encodedText = encodeURIComponent(activeMessage);
    return `https://wa.me/${cleanPhone}?text=${encodedText}`;
  }, [selectedStudent, activeMessage]);

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(activeMessage);
    setCopied(true);
    toast.success('Pesan WhatsApp berhasil disalin ke clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendAndLog = () => {
    if (!selectedStudent) return;

    const nowStr = new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });

    sendWhatsAppMessage({
      recipientName: selectedStudent.parentName || `Wali Murid ${selectedStudent.name}`,
      recipientPhone: selectedStudent.parentPhone || selectedStudent.phone,
      studentName: selectedStudent.name,
      studentGrade: selectedStudent.grade,
      category: selectedCategory,
      message: activeMessage,
      sentAt: `${nowStr} WIB`,
      status: 'Terkirim',
    });

    toast.success('Pesan WhatsApp Berhasil Dikirim & Dicatat!', {
      description: `Notifikasi dikirim ke ${selectedStudent.parentName || 'Wali Murid'} (${selectedStudent.parentPhone || selectedStudent.phone})`,
    });

    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank');
  };

  // Broadcast logic
  const batchTargetStudents = useMemo(() => {
    if (broadcastBatch === 'Semua Siswa Bimbel') return students;
    return students.filter((s) => s.grade === broadcastBatch);
  }, [students, broadcastBatch]);

  const handleExecuteBroadcast = () => {
    if (batchTargetStudents.length === 0) {
      toast.error('Tidak ada siswa pada batch yang dipilih.');
      return;
    }

    setIsBroadcasting(true);

    setTimeout(() => {
      const nowStr = new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });

      batchTargetStudents.forEach((st) => {
        const parent = st.parentName || `Wali dari ${st.name}`;
        const personalizedMsg = `*${broadcastTitle.toUpperCase()} - ${schoolSettings.schoolName.toUpperCase()}*\n\n` +
          `Yth. *${parent}* (Wali dari *${st.name} - ${st.grade}*),\n\n` +
          `${broadcastBody}\n\n` +
          `_Pusat Informasi & Administrasi ${schoolSettings.schoolName}_\n` +
          `_Hotline WA: ${schoolSettings.phone}_`;

        sendWhatsAppMessage({
          recipientName: parent,
          recipientPhone: st.parentPhone || st.phone,
          studentName: st.name,
          studentGrade: st.grade,
          category: broadcastCategory,
          message: personalizedMsg,
          sentAt: `${nowStr} WIB`,
          status: 'Terkirim',
        });
      });

      setIsBroadcasting(false);
      toast.success(`Broadcast WhatsApp Berhasil Terkirim ke ${batchTargetStudents.length} Wali Murid!`, {
        description: `Pesan "${broadcastTitle}" telah dipublikasikan dan dicatat ke log sistem.`,
      });
      setActiveTab('logs');
    }, 1200);
  };

  // Filtered Logs
  const filteredLogs = whatsAppLogs.filter((log) => {
    const matchCat = logCategoryFilter === 'all' || log.category === logCategoryFilter;
    const matchSearch =
      log.recipientName.toLowerCase().includes(searchLogQuery.toLowerCase()) ||
      log.studentName.toLowerCase().includes(searchLogQuery.toLowerCase()) ||
      log.message.toLowerCase().includes(searchLogQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5" /> Portal WhatsApp Gateway Admin
              </span>
              <span className="text-xs text-slate-500 font-medium">Pengiriman Langsung ke WhatsApp Wali Murid</span>
            </div>
            <h2 className="text-3xl font-display font-bold text-slate-900 mb-1">
              WhatsApp Notifikasi & Broadcast Wali Murid
            </h2>
            <p className="text-slate-500 text-sm">
              Kirim informasi tagihan SPP, presensi, jadwal, dan pengumuman tryout langsung ke nomor WhatsApp orang tua/wali murid dengan template otomatis.
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex bg-slate-100 p-1.5 rounded-2xl shrink-0">
            <button
              onClick={() => setActiveTab('single')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
                activeTab === 'single'
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Send className="w-4 h-4" />
              Kirim Personal / Satuan
            </button>
            <button
              onClick={() => setActiveTab('broadcast')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
                activeTab === 'broadcast'
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-4 h-4" />
              Broadcast Massal Batch
            </button>
            <button
              onClick={() => setActiveTab('logs')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
                activeTab === 'logs'
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              Riwayat Pesan ({whatsAppLogs.length})
            </button>
          </div>
        </div>

        {/* Quick Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs font-semibold">Total Log Terkirim</span>
              <MessageSquare className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-bold font-display text-slate-900">{whatsAppLogs.length}</p>
            <span className="text-[11px] text-emerald-600 font-medium">Tercatat di sistem</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs font-semibold">Kontak Wali Aktif</span>
              <Phone className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-2xl font-bold font-display text-slate-900">{students.length}</p>
            <span className="text-[11px] text-blue-600 font-medium">Nomor terverifikasi</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs font-semibold">Template Siap Pakai</span>
              <FileText className="w-4 h-4 text-indigo-600" />
            </div>
            <p className="text-2xl font-bold font-display text-slate-900">5 Kategori</p>
            <span className="text-[11px] text-indigo-600 font-medium">Otomatisasi variabel</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs font-semibold">Integrasi WA</span>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-bold font-display text-slate-900">WA Direct API</p>
            <span className="text-[11px] text-emerald-600 font-medium">Tanpa biaya per pesan</span>
          </div>
        </div>

        {/* TAB 1: SINGLE MESSAGE */}
        {activeTab === 'single' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left: Message Configuration */}
            <div className="lg:col-span-7 space-y-5">
              <div className="glass p-6 sm:p-7 rounded-3xl border border-white/40 shadow-sm bg-white space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                    <Send className="w-4 h-4 text-emerald-600" /> Form Pengiriman WhatsApp Personal
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">ID: WA-{selectedStudent?.id}</span>
                </div>

                {/* 1. Pilih Siswa */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    1. Pilih Siswa & Wali Murid Penerima *
                  </label>
                  <select
                    value={selectedStudentId}
                    onChange={(e) => {
                      setSelectedStudentId(e.target.value);
                      setCustomMessage('');
                    }}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 font-bold text-slate-900 text-sm outline-none"
                  >
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.grade}) — Wali: {s.parentName || 'Orang Tua'} ({s.parentPhone || s.phone})
                      </option>
                    ))}
                  </select>

                  {/* Student & Parent Info Card */}
                  {selectedStudent && (
                    <div className="mt-2.5 p-3.5 bg-emerald-50/60 rounded-2xl border border-emerald-200/60 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                          {selectedStudent.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">
                            {selectedStudent.parentName || 'Wali Siswa'} (Wali dari {selectedStudent.name})
                          </p>
                          <p className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                            <Phone className="w-3 h-3 text-emerald-600" />
                            {selectedStudent.parentPhone || selectedStudent.phone} • {selectedStudent.grade}
                          </p>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 bg-white text-emerald-800 rounded-lg text-[10px] font-bold border border-emerald-200">
                        {selectedStudent.status}
                      </span>
                    </div>
                  )}
                </div>

                {/* 2. Pilih Kategori & Template */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    2. Pilih Template Pesan Siap Pakai *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { label: 'Pengingat SPP', value: 'Pengingat SPP', icon: CreditCard },
                      { label: 'Laporan Absensi', value: 'Laporan Absensi', icon: UserCheck },
                      { label: 'Pengumuman Tryout', value: 'Pengumuman Tryout', icon: Sparkles },
                      { label: 'Evaluasi Belajar', value: 'Evaluasi Belajar', icon: BarChart },
                      { label: 'Jadwal Bimbel', value: 'Jadwal Bimbel', icon: Calendar },
                      { label: 'Pesan Bebas', value: 'Umum', icon: FileText },
                    ].map((tpl) => {
                      const isSelected = selectedCategory === tpl.value;
                      const Icon = tpl.icon;
                      return (
                        <button
                          key={tpl.value}
                          type="button"
                          onClick={() => {
                            setSelectedCategory(tpl.value as any);
                            setCustomMessage('');
                          }}
                          className={`p-3 rounded-xl text-xs font-bold transition-all text-left flex items-center gap-2 border ${
                            isSelected
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-emerald-600'}`} />
                          <span className="truncate">{tpl.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Message Body Editor */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      3. Rincian & Modifikasi Isi Pesan
                    </label>
                    {customMessage.trim() !== '' && (
                      <button
                        type="button"
                        onClick={() => setCustomMessage('')}
                        className="text-[11px] text-rose-600 hover:underline flex items-center gap-1 font-semibold"
                      >
                        <RotateCcw className="w-3 h-3" /> Reset ke Template Default
                      </button>
                    )}
                  </div>
                  <textarea
                    rows={8}
                    value={activeMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Gunakan tanda bintang (*) untuk teks tebal dan tanda garis bawah (_) untuk teks miring di WhatsApp.
                  </span>
                </div>

                {/* Bottom Send Buttons */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={handleCopyMessage}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-all flex items-center gap-2"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Tersalin!' : 'Salin Format Pesan'}
                  </button>

                  <button
                    type="button"
                    onClick={handleSendAndLog}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-emerald-600/30 active:scale-95 flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Kirim & Buka di WhatsApp Web
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Smartphone Live Preview */}
            <div className="lg:col-span-5 space-y-4">
              <div className="glass p-5 rounded-3xl border border-white/40 shadow-sm bg-white">
                <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-emerald-600" /> Pratinjau Tampilan WhatsApp
                  </span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                    Live Preview
                  </span>
                </div>

                {/* Mock WhatsApp Screen */}
                <div className="bg-[#EFEAE2] rounded-2xl overflow-hidden border border-slate-300 shadow-inner flex flex-col min-h-[460px]">
                  
                  {/* WA Header */}
                  <div className="bg-[#075E54] text-white p-3 flex items-center gap-2.5 shadow-sm">
                    <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden">
                      {selectedStudent?.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-xs truncate">
                        {selectedStudent?.parentName || 'Wali Murid'} ({selectedStudent?.name})
                      </p>
                      <p className="text-[10px] text-emerald-100 truncate">
                        {selectedStudent?.parentPhone || '081234567890'} • Online
                      </p>
                    </div>
                  </div>

                  {/* WA Chat Body */}
                  <div className="p-3.5 flex-1 flex flex-col justify-end space-y-2">
                    
                    {/* Timestamp Pill */}
                    <div className="self-center bg-white/80 backdrop-blur-sm text-[10px] text-slate-500 font-semibold px-2.5 py-0.5 rounded-full shadow-xs">
                      HARI INI
                    </div>

                    {/* Chat Bubble Sent by Admin */}
                    <div className="self-end bg-[#DCF8C6] rounded-2xl rounded-tr-xs p-3.5 max-w-[90%] shadow-sm text-slate-800 text-[11px] leading-relaxed whitespace-pre-line border border-emerald-100">
                      {activeMessage}
                      <div className="flex items-center justify-end gap-1 text-[9px] text-slate-400 mt-1">
                        <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        <CheckCircle2 className="w-3 h-3 text-blue-500" />
                      </div>
                    </div>

                  </div>

                  {/* WA Footer Mock */}
                  <div className="bg-[#F0F2F5] p-2 flex items-center gap-2 border-t border-slate-200">
                    <div className="flex-1 bg-white rounded-full px-3 py-1.5 text-[11px] text-slate-400">
                      Ketik pesan...
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#128C7E] text-white flex items-center justify-center">
                      <Send className="w-3.5 h-3.5" />
                    </div>
                  </div>

                </div>

                {/* Direct Action Link */}
                <div className="mt-4">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Buka Direct Link WhatsApp (wa.me)
                  </a>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: BROADCAST MASSAL PER BATCH */}
        {activeTab === 'broadcast' && (
          <div className="space-y-6">
            <div className="glass p-6 sm:p-7 rounded-3xl border border-white/40 shadow-sm bg-white space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-2xl">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">Broadcast Pengumuman ke Seluruh Wali Murid Batch</h3>
                    <p className="text-xs text-slate-500">Kirim pesan serentak ke seluruh nomor WhatsApp orang tua murid pada kelas tertentu.</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold">
                  {batchTargetStudents.length} Penerima Terpilih
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Pilih Batch Rombel Bimbel Target *
                  </label>
                  <select
                    value={broadcastBatch}
                    onChange={(e) => setBroadcastBatch(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 font-bold text-slate-900 text-sm outline-none"
                  >
                    <option value="Batch UTBK 1">Batch UTBK 1</option>
                    <option value="Batch Kedinasan 2">Batch Kedinasan 2</option>
                    <option value="Batch TOEFL Intensif">Batch TOEFL Intensif</option>
                    <option value="Batch UTBK Soshum">Batch UTBK Soshum</option>
                    <option value="Semua Siswa Bimbel">Semua Siswa Bimbel (Seluruh Batch)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Kategori Pesan
                  </label>
                  <select
                    value={broadcastCategory}
                    onChange={(e) => setBroadcastCategory(e.target.value as any)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 font-bold text-slate-900 text-sm outline-none"
                  >
                    <option value="Pengumuman Tryout">Pengumuman Tryout Akbar</option>
                    <option value="Jadwal Bimbel">Jadwal & Agenda Belajar</option>
                    <option value="Umum">Pengumuman Umum Bimbel</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Judul Pengumuman Broadcast *
                  </label>
                  <input
                    type="text"
                    value={broadcastTitle}
                    onChange={(e) => setBroadcastTitle(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 font-bold text-slate-900 text-sm outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Isi Pesan Broadcast *
                </label>
                <textarea
                  rows={5}
                  value={broadcastBody}
                  onChange={(e) => setBroadcastBody(e.target.value)}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-sans text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed"
                />
              </div>

              {/* Recipient Preview List */}
              <div>
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 block">
                  Daftar Wali Murid yang Akan Menerima ({batchTargetStudents.length} Kontak)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-48 overflow-y-auto pr-1">
                  {batchTargetStudents.map((st) => (
                    <div key={st.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
                      <div>
                        <p className="font-bold text-slate-900">{st.parentName || `Wali ${st.name}`}</p>
                        <p className="text-[10px] text-slate-500">{st.name} • {st.parentPhone || st.phone}</p>
                      </div>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[10px] font-bold">
                        Siap
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action */}
              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  disabled={isBroadcasting || batchTargetStudents.length === 0}
                  onClick={handleExecuteBroadcast}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-emerald-600/30 active:scale-95 flex items-center gap-2 disabled:opacity-50"
                >
                  {isBroadcasting ? (
                    <span>Mengirimkan Broadcast ke Seluruh Nomor...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Kirim Broadcast ke {batchTargetStudents.length} Wali Murid
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: LOGS & HISTORY */}
        {activeTab === 'logs' && (
          <div className="space-y-4">
            <div className="glass rounded-3xl border border-white/40 shadow-sm bg-white overflow-hidden">
              
              {/* Toolbar */}
              <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Cari wali, siswa, atau pesan..."
                      value={searchLogQuery}
                      onChange={(e) => setSearchLogQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                    />
                  </div>

                  <select
                    value={logCategoryFilter}
                    onChange={(e) => setLogCategoryFilter(e.target.value)}
                    className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none"
                  >
                    <option value="all">Semua Kategori</option>
                    <option value="Pengingat SPP">Pengingat SPP</option>
                    <option value="Laporan Absensi">Laporan Absensi</option>
                    <option value="Pengumuman Tryout">Pengumuman Tryout</option>
                    <option value="Evaluasi Belajar">Evaluasi Belajar</option>
                    <option value="Jadwal Bimbel">Jadwal Bimbel</option>
                  </select>
                </div>

                <span className="text-xs font-bold text-slate-500">
                  {filteredLogs.length} Pesan Terkirim
                </span>
              </div>

              {/* Logs Table */}
              <div className="divide-y divide-slate-100">
                {filteredLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-5 hover:bg-slate-50/60 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 max-w-2xl">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{log.recipientName}</span>
                        <span className="text-xs text-slate-500">({log.recipientPhone})</span>
                        <span className="text-xs text-emerald-800 bg-emerald-100 font-bold px-2.5 py-0.5 rounded-full">
                          {log.category}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                          {log.sentAt}
                        </span>
                      </div>

                      <p className="text-xs text-slate-700 line-clamp-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 font-mono">
                        {log.message}
                      </p>

                      <p className="text-[11px] text-slate-400">
                        Siswa Terkait: <strong className="text-slate-600">{log.studentName}</strong> ({log.studentGrade})
                      </p>
                    </div>

                    <div className="flex items-center justify-between lg:justify-end gap-4 shrink-0">
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-lg border border-emerald-200 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Terkirim
                      </span>

                      <button
                        onClick={() => {
                          const cleanPhone = log.recipientPhone.replace(/[^0-9]/g, '');
                          const p = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;
                          window.open(`https://wa.me/${p}?text=${encodeURIComponent(log.message)}`, '_blank');
                        }}
                        className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
                        Kirim Ulang
                      </button>
                    </div>
                  </div>
                ))}

                {filteredLogs.length === 0 && (
                  <div className="p-12 text-center text-slate-400 text-sm">
                    Tidak ada riwayat pesan WhatsApp yang sesuai dengan pencarian.
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
