import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { Toaster } from 'sonner';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';

// Siswa
import StudentDashboard from './pages/siswa/StudentDashboard';
import CourseList from './pages/siswa/CourseList';
import CourseDetail from './pages/siswa/CourseDetail';
import LessonDetail from './pages/siswa/LessonDetail';
import Quiz from './pages/siswa/Quiz';
import SiswaProfil from './pages/siswa/SiswaProfil';
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

// Guru / Tentor
import TeacherDashboard from './pages/guru/TeacherDashboard';
import AbsensiKelasGuru from './pages/guru/AbsensiKelasGuru';
import RPPGenerator from './pages/guru/RPPGenerator';
import BankSoal from './pages/guru/BankSoal';
import ManajemenTugasQuiz from './pages/guru/ManajemenTugasQuiz';
import ManajemenKelasGuru from './pages/guru/ManajemenKelasGuru';
import ManajemenCourseGuru from './pages/guru/ManajemenCourseGuru';
import NilaiSiswaGuru from './pages/guru/NilaiSiswaGuru';
import ProgressSiswaGuru from './pages/guru/ProgressSiswaGuru';
import DetailKelasGuru from './pages/guru/DetailKelasGuru';
import DetailTugasGuru from './pages/guru/DetailTugasGuru';

// Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import KirimWaOrtu from './pages/admin/KirimWaOrtu';
import InventarisBimbel from './pages/admin/InventarisBimbel';
import ManajemenSiswa from './pages/admin/ManajemenSiswa';
import ManajemenGuru from './pages/admin/ManajemenGuru';
import ManajemenKeuangan from './pages/admin/ManajemenKeuangan';
import Laporan from './pages/admin/Laporan';
import ManajemenKelasAdmin from './pages/admin/ManajemenKelasAdmin';
import ManajemenCourseAdmin from './pages/admin/ManajemenCourseAdmin';
import MonitoringProgressAdmin from './pages/admin/MonitoringProgressAdmin';
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
        
        {/* Guru / Tentor Routes */}
        <Route path="/guru/dashboard" element={<PageTransition><TeacherDashboard /></PageTransition>} />
        <Route path="/guru/absensi" element={<PageTransition><AbsensiKelasGuru /></PageTransition>} />
        <Route path="/guru/rpp-generator" element={<PageTransition><RPPGenerator /></PageTransition>} />
        <Route path="/guru/bank-soal" element={<PageTransition><BankSoal /></PageTransition>} />
        <Route path="/guru/kelas" element={<PageTransition><ManajemenKelasGuru /></PageTransition>} />
        <Route path="/guru/kelas/:id" element={<PageTransition><DetailKelasGuru /></PageTransition>} />
        <Route path="/guru/course" element={<PageTransition><ManajemenCourseGuru /></PageTransition>} />
        <Route path="/guru/tugas" element={<PageTransition><ManajemenTugasQuiz /></PageTransition>} />
        <Route path="/guru/tugas/:id" element={<PageTransition><DetailTugasGuru /></PageTransition>} />
        <Route path="/guru/quiz" element={<PageTransition><ManajemenTugasQuiz /></PageTransition>} />
        <Route path="/guru/nilai" element={<PageTransition><NilaiSiswaGuru /></PageTransition>} />
        <Route path="/guru/progress-siswa" element={<PageTransition><ProgressSiswaGuru /></PageTransition>} />
        <Route path="/guru/pengumuman" element={<PageTransition><Pengumuman /></PageTransition>} />
        
        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<PageTransition><AdminDashboard /></PageTransition>} />
        <Route path="/admin/whatsapp" element={<PageTransition><KirimWaOrtu /></PageTransition>} />
        <Route path="/admin/inventaris" element={<PageTransition><InventarisBimbel /></PageTransition>} />
        <Route path="/admin/siswa" element={<PageTransition><ManajemenSiswa /></PageTransition>} />
        <Route path="/admin/guru" element={<PageTransition><ManajemenGuru /></PageTransition>} />
        <Route path="/admin/keuangan" element={<PageTransition><ManajemenKeuangan /></PageTransition>} />
        <Route path="/admin/kelas" element={<PageTransition><ManajemenKelasAdmin /></PageTransition>} />
        <Route path="/admin/course" element={<PageTransition><ManajemenCourseAdmin /></PageTransition>} />
        <Route path="/admin/progress" element={<PageTransition><MonitoringProgressAdmin /></PageTransition>} />
        <Route path="/admin/laporan" element={<PageTransition><Laporan /></PageTransition>} />
        <Route path="/admin/pengumuman" element={<PageTransition><Pengumuman /></PageTransition>} />
        <Route path="/admin/pengaturan" element={<PageTransition><PengaturanSekolah /></PageTransition>} />
        
        {/* Shared */}
        <Route path="/playground" element={<PageTransition><PlaygroundPage /></PageTransition>} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <Router>
      <AnimatedRoutes />
      <Toaster position="top-right" richColors />
    </Router>
  );
}
