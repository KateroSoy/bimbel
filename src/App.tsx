import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { Toaster } from 'sonner';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import KarirPage from './pages/KarirPage';

// Siswa
import StudentDashboard from './pages/siswa/StudentDashboard';
import CourseList from './pages/siswa/CourseList';
import CourseDetail from './pages/siswa/CourseDetail';
import LessonDetail from './pages/siswa/LessonDetail';
import Quiz from './pages/siswa/Quiz';
import SiswaProfil from './pages/siswa/SiswaProfil';
import SiswaPengaturan from './pages/siswa/SiswaPengaturan';
import JadwalBelajar from './pages/siswa/JadwalBelajar';
import AbsensiSiswa from './pages/siswa/AbsensiSiswa';
import PembayaranSppSiswa from './pages/siswa/PembayaranSppSiswa';
import TugasSiswa from './pages/siswa/TugasSiswa';
import DetailTugasSiswa from './pages/siswa/DetailTugasSiswa';
import NilaiSiswa from './pages/siswa/NilaiSiswa';
import SertifikatSiswa from './pages/siswa/SertifikatSiswa';

import KatalogTes from './pages/siswa/KatalogTes';
import Toefl from './pages/siswa/Toefl';

// Shared
import Pengumuman from './pages/shared/Pengumuman';

// Guru / Tutor
import TeacherDashboard from './pages/guru/TeacherDashboard';
import KelasSaya from './pages/guru/KelasSaya';
import JadwalMengajar from './pages/guru/JadwalMengajar';
import MateriModul from './pages/guru/MateriModul';
import TugasAssessment from './pages/guru/TugasAssessment';
import PresensiKelas from './pages/guru/PresensiKelas';
import SiswaSaya from './pages/guru/SiswaSaya';
import NilaiProgress from './pages/guru/NilaiProgress';
import SiswaPerluPerhatian from './pages/guru/SiswaPerluPerhatian';
import BankSoalGuru from './pages/guru/BankSoalGuru';
import AiBahanAjar from './pages/guru/AiBahanAjar';
import PengumumanGuru from './pages/guru/PengumumanGuru';
import PesanGuru from './pages/guru/PesanGuru';
import ProfilGuru from './pages/guru/ProfilGuru';
import PengaturanGuru from './pages/guru/PengaturanGuru';
import ManajemenCourseGuru from './pages/guru/ManajemenCourseGuru';
import NilaiSiswaGuru from './pages/guru/NilaiSiswaGuru';
import DetailKelasGuru from './pages/guru/DetailKelasGuru';
import DetailTugasGuru from './pages/guru/DetailTugasGuru';

// Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import NotifikasiAdmin from './pages/admin/NotifikasiAdmin';
import DataSiswa from './pages/admin/DataSiswa';
import PendaftaranSiswa from './pages/admin/PendaftaranSiswa';
import OrangTuaWali from './pages/admin/OrangTuaWali';
import DataTutorStaff from './pages/admin/DataTutorStaff';
import JadwalTutor from './pages/admin/JadwalTutor';
import KehadiranTutor from './pages/admin/KehadiranTutor';
import BebanMengajar from './pages/admin/BebanMengajar';
import ProgramBimbel from './pages/admin/ProgramBimbel';
import KelasRombel from './pages/admin/KelasRombel';
import JadwalKelas from './pages/admin/JadwalKelas';
import RuangKapasitas from './pages/admin/RuangKapasitas';
import SppTagihan from './pages/admin/SppTagihan';
import PembayaranAdmin from './pages/admin/PembayaranAdmin';
import Piutang from './pages/admin/Piutang';
import Pengeluaran from './pages/admin/Pengeluaran';
import HonorTutor from './pages/admin/HonorTutor';
import LaporanKeuangan from './pages/admin/LaporanKeuangan';
import KirimWaOrtu from './pages/admin/KirimWaOrtu';
import InventarisBimbel from './pages/admin/InventarisBimbel';
import ManajemenSiswa from './pages/admin/ManajemenSiswa';
import Laporan from './pages/admin/Laporan';
import PengaturanSekolah from './pages/admin/PengaturanSekolah';

// Shared
import PlaygroundPage from './pages/PlaygroundPage';
import { PageTransition } from './components/layout/PageTransition';

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><LandingPage /></PageTransition>} />
        <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
        <Route path="/karir" element={<PageTransition><KarirPage /></PageTransition>} />
        
        {/* Siswa Routes */}
        <Route path="/siswa/dashboard" element={<PageTransition><StudentDashboard /></PageTransition>} />
        <Route path="/siswa/profil" element={<PageTransition><SiswaProfil /></PageTransition>} />
        <Route path="/siswa/course" element={<PageTransition><CourseList /></PageTransition>} />
        <Route path="/siswa/course/:id" element={<PageTransition><CourseDetail /></PageTransition>} />
        <Route path="/siswa/lesson/:id" element={<PageTransition><LessonDetail /></PageTransition>} />
        <Route path="/siswa/jadwal" element={<PageTransition><JadwalBelajar /></PageTransition>} />
        <Route path="/siswa/absensi" element={<PageTransition><AbsensiSiswa /></PageTransition>} />
        <Route path="/siswa/spp" element={<PageTransition><PembayaranSppSiswa /></PageTransition>} />
        <Route path="/siswa/tugas" element={<PageTransition><TugasSiswa /></PageTransition>} />
        <Route path="/siswa/tugas/:id" element={<PageTransition><DetailTugasSiswa /></PageTransition>} />
        <Route path="/siswa/quiz" element={<PageTransition><Quiz /></PageTransition>} />
        <Route path="/siswa/quiz/:id" element={<PageTransition><Quiz /></PageTransition>} />
        <Route path="/siswa/nilai" element={<PageTransition><NilaiSiswa /></PageTransition>} />
        <Route path="/siswa/sertifikat" element={<PageTransition><SertifikatSiswa /></PageTransition>} />
        <Route path="/siswa/katalog-tes" element={<PageTransition><KatalogTes /></PageTransition>} />
        <Route path="/siswa/toefl" element={<PageTransition><Toefl /></PageTransition>} />
        <Route path="/siswa/pengumuman" element={<PageTransition><Pengumuman /></PageTransition>} />
        
        <Route path="/siswa/pengaturan" element={<PageTransition><SiswaPengaturan /></PageTransition>} />
        
        {/* Guru / Tutor Routes */}
        <Route path="/guru/dashboard" element={<PageTransition><TeacherDashboard /></PageTransition>} />
        <Route path="/guru/kelas" element={<PageTransition><KelasSaya /></PageTransition>} />
        <Route path="/guru/kelas/:id" element={<PageTransition><DetailKelasGuru /></PageTransition>} />
        <Route path="/guru/jadwal" element={<PageTransition><JadwalMengajar /></PageTransition>} />
        <Route path="/guru/course" element={<PageTransition><MateriModul /></PageTransition>} />
        <Route path="/guru/course/kelola" element={<PageTransition><ManajemenCourseGuru /></PageTransition>} />
        <Route path="/guru/tugas" element={<PageTransition><TugasAssessment /></PageTransition>} />
        <Route path="/guru/tugas/:id" element={<PageTransition><DetailTugasGuru /></PageTransition>} />
        <Route path="/guru/quiz" element={<PageTransition><TugasAssessment /></PageTransition>} />
        <Route path="/guru/absensi" element={<PageTransition><PresensiKelas /></PageTransition>} />
        <Route path="/guru/siswa" element={<PageTransition><SiswaSaya /></PageTransition>} />
        <Route path="/guru/nilai" element={<PageTransition><NilaiProgress /></PageTransition>} />
        <Route path="/guru/nilai/input" element={<PageTransition><NilaiSiswaGuru /></PageTransition>} />
        <Route path="/guru/progress-siswa" element={<PageTransition><SiswaPerluPerhatian /></PageTransition>} />
        <Route path="/guru/bank-soal" element={<PageTransition><BankSoalGuru /></PageTransition>} />
        <Route path="/guru/ai-bahan-ajar" element={<PageTransition><AiBahanAjar /></PageTransition>} />
        <Route path="/guru/rpp-generator" element={<PageTransition><AiBahanAjar /></PageTransition>} />
        <Route path="/guru/pengumuman" element={<PageTransition><PengumumanGuru /></PageTransition>} />
        <Route path="/guru/pesan" element={<PageTransition><PesanGuru /></PageTransition>} />
        <Route path="/guru/profil" element={<PageTransition><ProfilGuru /></PageTransition>} />
        <Route path="/guru/pengaturan" element={<PageTransition><PengaturanGuru /></PageTransition>} />
        
        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<PageTransition><AdminDashboard /></PageTransition>} />
        <Route path="/admin/notifikasi" element={<PageTransition><NotifikasiAdmin /></PageTransition>} />
        <Route path="/admin/siswa" element={<PageTransition><DataSiswa /></PageTransition>} />
        <Route path="/admin/pendaftaran" element={<PageTransition><PendaftaranSiswa /></PageTransition>} />
        <Route path="/admin/ortu" element={<PageTransition><OrangTuaWali /></PageTransition>} />
        <Route path="/admin/alumni" element={<PageTransition><ManajemenSiswa /></PageTransition>} />
        <Route path="/admin/guru" element={<PageTransition><DataTutorStaff /></PageTransition>} />
        <Route path="/admin/jadwal-tutor" element={<PageTransition><JadwalTutor /></PageTransition>} />
        <Route path="/admin/kehadiran-tutor" element={<PageTransition><KehadiranTutor /></PageTransition>} />
        <Route path="/admin/beban" element={<PageTransition><BebanMengajar /></PageTransition>} />
        <Route path="/admin/course" element={<PageTransition><ProgramBimbel /></PageTransition>} />
        <Route path="/admin/kelas" element={<PageTransition><KelasRombel /></PageTransition>} />
        <Route path="/admin/jadwal-kelas" element={<PageTransition><JadwalKelas /></PageTransition>} />
        <Route path="/admin/ruang" element={<PageTransition><RuangKapasitas /></PageTransition>} />
        <Route path="/admin/keuangan" element={<PageTransition><SppTagihan /></PageTransition>} />
        <Route path="/admin/pembayaran" element={<PageTransition><PembayaranAdmin /></PageTransition>} />
        <Route path="/admin/piutang" element={<PageTransition><Piutang /></PageTransition>} />
        <Route path="/admin/pengeluaran" element={<PageTransition><Pengeluaran /></PageTransition>} />
        <Route path="/admin/honor" element={<PageTransition><HonorTutor /></PageTransition>} />
        <Route path="/admin/laporan-keuangan" element={<PageTransition><LaporanKeuangan /></PageTransition>} />
        <Route path="/admin/whatsapp" element={<PageTransition><KirimWaOrtu /></PageTransition>} />
        <Route path="/admin/broadcast" element={<PageTransition><KirimWaOrtu /></PageTransition>} />
        <Route path="/admin/template" element={<PageTransition><KirimWaOrtu /></PageTransition>} />
        <Route path="/admin/inventaris" element={<PageTransition><InventarisBimbel /></PageTransition>} />
        <Route path="/admin/buku" element={<PageTransition><InventarisBimbel /></PageTransition>} />
        <Route path="/admin/cbt" element={<PageTransition><InventarisBimbel /></PageTransition>} />
        <Route path="/admin/laporan" element={<PageTransition><Laporan /></PageTransition>} />
        <Route path="/admin/laporan-siswa" element={<PageTransition><Laporan /></PageTransition>} />
        <Route path="/admin/laporan-kelas" element={<PageTransition><Laporan /></PageTransition>} />
        <Route path="/admin/laporan-tutor" element={<PageTransition><Laporan /></PageTransition>} />
        <Route path="/admin/laporan-operasional" element={<PageTransition><Laporan /></PageTransition>} />
        <Route path="/admin/pengumuman" element={<PageTransition><Pengumuman /></PageTransition>} />
        <Route path="/admin/pengaturan" element={<PageTransition><PengaturanSekolah /></PageTransition>} />
        <Route path="/admin/role" element={<PageTransition><PengaturanSekolah /></PageTransition>} />
        <Route path="/admin/tahun-ajaran" element={<PageTransition><PengaturanSekolah /></PageTransition>} />
        <Route path="/admin/data-master" element={<PageTransition><PengaturanSekolah /></PageTransition>} />
        <Route path="/admin/audit" element={<PageTransition><PengaturanSekolah /></PageTransition>} />
        
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
      <AnimatedRoutes />
      <Toaster position="top-right" richColors />
    </Router>
  );
}
