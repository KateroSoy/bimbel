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
import { Guard } from './components/auth/Guard';

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
        <Route path="/siswa/quiz" element={<Guard role="siswa"><PageTransition><Quiz /></PageTransition></Guard>} />
        <Route path="/siswa/quiz/:id" element={<Guard role="siswa"><PageTransition><Quiz /></PageTransition></Guard>} />
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
        <Route path="/guru/course/kelola" element={<Guard role="guru"><PageTransition><ManajemenCourseGuru /></PageTransition></Guard>} />
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
      <AnimatedRoutes />
      <Toaster position="top-right" richColors />
    </Router>
  );
}
