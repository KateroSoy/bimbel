import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useParams } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { Toaster } from 'sonner';
const LandingPage = lazy(() => import('./pages/LandingPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const KarirPage = lazy(() => import('./pages/KarirPage'));

// Siswa
const StudentDashboard = lazy(() => import('./pages/siswa/StudentDashboard'));
const CourseList = lazy(() => import('./pages/siswa/CourseList'));
const CourseDetail = lazy(() => import('./pages/siswa/CourseDetail'));
const LessonDetail = lazy(() => import('./pages/siswa/LessonDetail'));
const SiswaProfil = lazy(() => import('./pages/siswa/SiswaProfil'));
const SiswaPengaturan = lazy(() => import('./pages/siswa/SiswaPengaturan'));
const JadwalBelajar = lazy(() => import('./pages/siswa/JadwalBelajar'));
const AbsensiSiswa = lazy(() => import('./pages/siswa/AbsensiSiswa'));
const PembayaranSppSiswa = lazy(() => import('./pages/siswa/PembayaranSppSiswa'));
const TugasSiswa = lazy(() => import('./pages/siswa/TugasSiswa'));
const DetailTugasSiswa = lazy(() => import('./pages/siswa/DetailTugasSiswa'));
const NilaiSiswa = lazy(() => import('./pages/siswa/NilaiSiswa'));
const SertifikatSiswa = lazy(() => import('./pages/siswa/SertifikatSiswa'));

const KatalogTes = lazy(() => import('./pages/siswa/KatalogTes'));
const Toefl = lazy(() => import('./pages/siswa/Toefl'));


// Guru / Tutor
const TeacherDashboard = lazy(() => import('./pages/guru/TeacherDashboard'));
const KelasSaya = lazy(() => import('./pages/guru/KelasSaya'));
const JadwalMengajar = lazy(() => import('./pages/guru/JadwalMengajar'));
const MateriModul = lazy(() => import('./pages/guru/MateriModul'));
const TugasAssessment = lazy(() => import('./pages/guru/TugasAssessment'));
const PresensiKelas = lazy(() => import('./pages/guru/PresensiKelas'));
const SiswaSaya = lazy(() => import('./pages/guru/SiswaSaya'));
const NilaiProgress = lazy(() => import('./pages/guru/NilaiProgress'));
const SiswaPerluPerhatian = lazy(() => import('./pages/guru/SiswaPerluPerhatian'));
const BankSoalGuru = lazy(() => import('./pages/guru/BankSoalGuru'));
const AiBahanAjar = lazy(() => import('./pages/guru/AiBahanAjar'));
const PengumumanGuru = lazy(() => import('./pages/guru/PengumumanGuru'));
const PesanGuru = lazy(() => import('./pages/guru/PesanGuru'));
const ProfilGuru = lazy(() => import('./pages/guru/ProfilGuru'));
const PengaturanGuru = lazy(() => import('./pages/guru/PengaturanGuru'));
const CourseManager = lazy(() => import('./pages/shared/CourseManager'));
const NilaiSiswaGuru = lazy(() => import('./pages/guru/NilaiSiswaGuru'));
const DetailKelasGuru = lazy(() => import('./pages/guru/DetailKelasGuru'));
const DetailTugasGuru = lazy(() => import('./pages/guru/DetailTugasGuru'));

// Admin
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const NotifikasiAdmin = lazy(() => import('./pages/admin/NotifikasiAdmin'));
const DataSiswa = lazy(() => import('./pages/admin/DataSiswa'));
const PendaftaranSiswa = lazy(() => import('./pages/admin/PendaftaranSiswa'));
const OrangTuaWali = lazy(() => import('./pages/admin/OrangTuaWali'));
const DataTutorStaff = lazy(() => import('./pages/admin/DataTutorStaff'));
const JadwalTutor = lazy(() => import('./pages/admin/JadwalTutor'));
const KehadiranTutor = lazy(() => import('./pages/admin/KehadiranTutor'));
const BebanMengajar = lazy(() => import('./pages/admin/BebanMengajar'));
const ProgramBimbel = lazy(() => import('./pages/admin/ProgramBimbel'));
const KelasRombel = lazy(() => import('./pages/admin/KelasRombel'));
const JadwalKelas = lazy(() => import('./pages/admin/JadwalKelas'));
const RuangKapasitas = lazy(() => import('./pages/admin/RuangKapasitas'));
const SppTagihan = lazy(() => import('./pages/admin/SppTagihan'));
const PembayaranAdmin = lazy(() => import('./pages/admin/PembayaranAdmin'));
const Piutang = lazy(() => import('./pages/admin/Piutang'));
const Pengeluaran = lazy(() => import('./pages/admin/Pengeluaran'));
const HonorTutor = lazy(() => import('./pages/admin/HonorTutor'));
const LaporanKeuangan = lazy(() => import('./pages/admin/LaporanKeuangan'));
const KirimWaOrtu = lazy(() => import('./pages/admin/KirimWaOrtu'));
const InventarisBimbel = lazy(() => import('./pages/admin/InventarisBimbel'));
const ManajemenSiswa = lazy(() => import('./pages/admin/ManajemenSiswa'));
const Laporan = lazy(() => import('./pages/admin/Laporan'));
const PengaturanSekolah = lazy(() => import('./pages/admin/PengaturanSekolah'));

// Shared
const PlaygroundPage = lazy(() => import('./pages/PlaygroundPage'));
import { PageTransition } from './components/layout/PageTransition';
import { Guard } from './components/auth/Guard';

function QuizRedirect() {
  const { id } = useParams<{ id: string }>();
  return <Navigate to={id ? `/siswa/tugas/${encodeURIComponent(id)}` : '/siswa/katalog-tes'} replace />;
}

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><LandingPage /></PageTransition>} />
        <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
        <Route path="/karir" element={<PageTransition><KarirPage /></PageTransition>} />
        
        {/* Siswa Routes */}
        <Route path="/siswa/dashboard" element={<Guard role="siswa"><PageTransition><StudentDashboard /></PageTransition></Guard>} />
        <Route path="/siswa/profil" element={<Guard role="siswa"><PageTransition><SiswaProfil /></PageTransition></Guard>} />
        <Route path="/siswa/course" element={<Guard role="siswa"><PageTransition><CourseList /></PageTransition></Guard>} />
        <Route path="/siswa/course/:id" element={<Guard role="siswa"><PageTransition><CourseDetail /></PageTransition></Guard>} />
        <Route path="/siswa/lesson/:id" element={<Guard role="siswa"><PageTransition><LessonDetail /></PageTransition></Guard>} />
        <Route path="/siswa/jadwal" element={<Guard role="siswa"><PageTransition><JadwalBelajar /></PageTransition></Guard>} />
        <Route path="/siswa/absensi" element={<Guard role="siswa"><PageTransition><AbsensiSiswa /></PageTransition></Guard>} />
        <Route path="/siswa/spp" element={<Guard role="siswa"><PageTransition><PembayaranSppSiswa /></PageTransition></Guard>} />
        <Route path="/siswa/tugas" element={<Guard role="siswa"><PageTransition><TugasSiswa /></PageTransition></Guard>} />
        <Route path="/siswa/tugas/:id" element={<Guard role="siswa"><PageTransition><DetailTugasSiswa /></PageTransition></Guard>} />
        <Route path="/siswa/quiz" element={<Guard role="siswa"><Navigate to="/siswa/katalog-tes" replace /></Guard>} />
        <Route path="/siswa/quiz/:id" element={<Guard role="siswa"><QuizRedirect /></Guard>} />
        <Route path="/siswa/nilai" element={<Guard role="siswa"><PageTransition><NilaiSiswa /></PageTransition></Guard>} />
        <Route path="/siswa/sertifikat" element={<Guard role="siswa"><PageTransition><SertifikatSiswa /></PageTransition></Guard>} />
        <Route path="/siswa/katalog-tes" element={<Guard role="siswa"><PageTransition><KatalogTes /></PageTransition></Guard>} />
        <Route path="/siswa/toefl" element={<Guard role="siswa"><PageTransition><Toefl /></PageTransition></Guard>} />
        <Route path="/siswa/pengumuman" element={<Guard role="siswa"><PageTransition><PengumumanGuru /></PageTransition></Guard>} />
        
        <Route path="/siswa/pengaturan" element={<Guard role="siswa"><PageTransition><SiswaPengaturan /></PageTransition></Guard>} />
        
        {/* Guru / Tutor Routes */}
        <Route path="/guru/dashboard" element={<Guard role="guru"><PageTransition><TeacherDashboard /></PageTransition></Guard>} />
        <Route path="/guru/kelas" element={<Guard role="guru"><PageTransition><KelasSaya /></PageTransition></Guard>} />
        <Route path="/guru/kelas/:id" element={<Guard role="guru"><PageTransition><DetailKelasGuru /></PageTransition></Guard>} />
        <Route path="/guru/jadwal" element={<Guard role="guru"><PageTransition><JadwalMengajar /></PageTransition></Guard>} />
        <Route path="/guru/course" element={<Guard role="guru"><PageTransition><MateriModul /></PageTransition></Guard>} />
        <Route path="/guru/course/kelola" element={<Guard role="guru"><PageTransition><CourseManager /></PageTransition></Guard>} />
        <Route path="/guru/tugas" element={<Guard role="guru"><PageTransition><TugasAssessment /></PageTransition></Guard>} />
        <Route path="/guru/tugas/:id" element={<Guard role="guru"><PageTransition><DetailTugasGuru /></PageTransition></Guard>} />
        <Route path="/guru/quiz" element={<Guard role="guru"><PageTransition><TugasAssessment /></PageTransition></Guard>} />
        <Route path="/guru/absensi" element={<Guard role="guru"><PageTransition><PresensiKelas /></PageTransition></Guard>} />
        <Route path="/guru/siswa" element={<Guard role="guru"><PageTransition><SiswaSaya /></PageTransition></Guard>} />
        <Route path="/guru/nilai" element={<Guard role="guru"><PageTransition><NilaiProgress /></PageTransition></Guard>} />
        <Route path="/guru/nilai/input" element={<Guard role="guru"><PageTransition><NilaiSiswaGuru /></PageTransition></Guard>} />
        <Route path="/guru/progress-siswa" element={<Guard role="guru"><PageTransition><SiswaPerluPerhatian /></PageTransition></Guard>} />
        <Route path="/guru/bank-soal" element={<Guard role="guru"><PageTransition><BankSoalGuru /></PageTransition></Guard>} />
        <Route path="/guru/ai-bahan-ajar" element={<Guard role="guru"><PageTransition><AiBahanAjar /></PageTransition></Guard>} />
        <Route path="/guru/rpp-generator" element={<Guard role="guru"><PageTransition><AiBahanAjar /></PageTransition></Guard>} />
        <Route path="/guru/pengumuman" element={<Guard role="guru"><PageTransition><PengumumanGuru /></PageTransition></Guard>} />
        <Route path="/guru/pesan" element={<Guard role="guru"><PageTransition><PesanGuru /></PageTransition></Guard>} />
        <Route path="/guru/profil" element={<Guard role="guru"><PageTransition><ProfilGuru /></PageTransition></Guard>} />
        <Route path="/guru/pengaturan" element={<Guard role="guru"><PageTransition><PengaturanGuru /></PageTransition></Guard>} />
        
        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<Guard role="admin"><PageTransition><AdminDashboard /></PageTransition></Guard>} />
        <Route path="/admin/notifikasi" element={<Guard role="admin"><PageTransition><NotifikasiAdmin /></PageTransition></Guard>} />
        <Route path="/admin/siswa" element={<Guard role="admin"><PageTransition><DataSiswa /></PageTransition></Guard>} />
        <Route path="/admin/pendaftaran" element={<Guard role="admin"><PageTransition><PendaftaranSiswa /></PageTransition></Guard>} />
        <Route path="/admin/ortu" element={<Guard role="admin"><PageTransition><OrangTuaWali /></PageTransition></Guard>} />
        <Route path="/admin/alumni" element={<Guard role="admin"><PageTransition><ManajemenSiswa /></PageTransition></Guard>} />
        <Route path="/admin/guru" element={<Guard role="admin"><PageTransition><DataTutorStaff /></PageTransition></Guard>} />
        <Route path="/admin/jadwal-tutor" element={<Guard role="admin"><PageTransition><JadwalTutor /></PageTransition></Guard>} />
        <Route path="/admin/kehadiran-tutor" element={<Guard role="admin"><PageTransition><KehadiranTutor /></PageTransition></Guard>} />
        <Route path="/admin/beban" element={<Guard role="admin"><PageTransition><BebanMengajar /></PageTransition></Guard>} />
        <Route path="/admin/course" element={<Guard role="admin"><PageTransition><ProgramBimbel /></PageTransition></Guard>} />
        <Route path="/admin/course-digital" element={<Guard role="admin"><PageTransition><CourseManager /></PageTransition></Guard>} />
        <Route path="/admin/kelas" element={<Guard role="admin"><PageTransition><KelasRombel /></PageTransition></Guard>} />
        <Route path="/admin/jadwal-kelas" element={<Guard role="admin"><PageTransition><JadwalKelas /></PageTransition></Guard>} />
        <Route path="/admin/ruang" element={<Guard role="admin"><PageTransition><RuangKapasitas /></PageTransition></Guard>} />
        <Route path="/admin/keuangan" element={<Guard role="admin"><PageTransition><SppTagihan /></PageTransition></Guard>} />
        <Route path="/admin/pembayaran" element={<Guard role="admin"><PageTransition><PembayaranAdmin /></PageTransition></Guard>} />
        <Route path="/admin/piutang" element={<Guard role="admin"><PageTransition><Piutang /></PageTransition></Guard>} />
        <Route path="/admin/pengeluaran" element={<Guard role="admin"><PageTransition><Pengeluaran /></PageTransition></Guard>} />
        <Route path="/admin/honor" element={<Guard role="admin"><PageTransition><HonorTutor /></PageTransition></Guard>} />
        <Route path="/admin/laporan-keuangan" element={<Guard role="admin"><PageTransition><LaporanKeuangan /></PageTransition></Guard>} />
        <Route path="/admin/whatsapp" element={<Guard role="admin"><PageTransition><KirimWaOrtu /></PageTransition></Guard>} />
        <Route path="/admin/broadcast" element={<Guard role="admin"><PageTransition><KirimWaOrtu /></PageTransition></Guard>} />
        <Route path="/admin/template" element={<Guard role="admin"><PageTransition><KirimWaOrtu /></PageTransition></Guard>} />
        <Route path="/admin/inventaris" element={<Guard role="admin"><PageTransition><InventarisBimbel /></PageTransition></Guard>} />
        <Route path="/admin/buku" element={<Guard role="admin"><PageTransition><InventarisBimbel /></PageTransition></Guard>} />
        <Route path="/admin/cbt" element={<Guard role="admin"><PageTransition><InventarisBimbel /></PageTransition></Guard>} />
        <Route path="/admin/laporan" element={<Guard role="admin"><PageTransition><Laporan /></PageTransition></Guard>} />
        <Route path="/admin/laporan-siswa" element={<Guard role="admin"><PageTransition><Laporan /></PageTransition></Guard>} />
        <Route path="/admin/laporan-kelas" element={<Guard role="admin"><PageTransition><Laporan /></PageTransition></Guard>} />
        <Route path="/admin/laporan-tutor" element={<Guard role="admin"><PageTransition><Laporan /></PageTransition></Guard>} />
        <Route path="/admin/laporan-operasional" element={<Guard role="admin"><PageTransition><Laporan /></PageTransition></Guard>} />
        <Route path="/admin/pengumuman" element={<Guard role="admin"><PageTransition><PengumumanGuru /></PageTransition></Guard>} />
        <Route path="/admin/pengaturan" element={<Guard role="admin"><PageTransition><PengaturanSekolah /></PageTransition></Guard>} />
        <Route path="/admin/role" element={<Guard role="admin"><PageTransition><PengaturanSekolah /></PageTransition></Guard>} />
        <Route path="/admin/tahun-ajaran" element={<Guard role="admin"><PageTransition><PengaturanSekolah /></PageTransition></Guard>} />
        <Route path="/admin/data-master" element={<Guard role="admin"><PageTransition><PengaturanSekolah /></PageTransition></Guard>} />
        <Route path="/admin/audit" element={<Guard role="admin"><PageTransition><PengaturanSekolah /></PageTransition></Guard>} />
        
        {/* Shared */}
        <Route path="/playground" element={<PageTransition><PlaygroundPage /></PageTransition>} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  const rawBase = import.meta.env.BASE_URL || '/';
  const basename = (rawBase === '/' || rawBase === './') ? undefined : rawBase.replace(/\/$/, '');
  return (
    <Router basename={basename}>
      <Suspense fallback={<div role="status" className="min-h-screen flex items-center justify-center text-slate-600">Memuat halaman…</div>}><AnimatedRoutes /></Suspense>
      <Toaster position="top-right" richColors />
    </Router>
  );
}
