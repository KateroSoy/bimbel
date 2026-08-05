export const mockData = {
  students: [
    { id: '1001', name: 'Budi Santoso', grade: '10 IPA 1', status: 'Aktif', gpa: 3.8, email: 'budi.santoso@sekolah.edu', phone: '081234567890' },
    { id: '1002', name: 'Siti Aminah', grade: '10 IPS 2', status: 'Aktif', gpa: 3.6, email: 'siti.aminah@sekolah.edu', phone: '081234567891' },
    { id: '1003', name: 'Andi Darmawan', grade: '11 IPA 3', status: 'Aktif', gpa: 3.9, email: 'andi.darmawan@sekolah.edu', phone: '081234567892' },
    { id: '1004', name: 'Rina Wijaya', grade: '12 Bahasa', status: 'Nonaktif', gpa: 0.0, email: 'rina.wijaya@sekolah.edu', phone: '081234567893' },
    { id: '1005', name: 'Dewi Lestari', grade: '11 IPS 1', status: 'Aktif', gpa: 3.7, email: 'dewi.lestari@sekolah.edu', phone: '081234567894' },
  ],
  teachers: [
    { id: 'G-001', name: 'Drs. Ahmad Yani', subject: 'Matematika', status: 'Aktif', rating: 4.8, classes: 4, email: 'ahmad.yani@sekolah.edu', phone: '081298765430' },
    { id: 'G-002', name: 'Siti Rohmah, M.Pd', subject: 'Bahasa Indonesia', status: 'Aktif', rating: 4.9, classes: 5, email: 'siti.rohmah@sekolah.edu', phone: '081298765431' },
    { id: 'G-003', name: 'Budi Hartono, S.Si', subject: 'Fisika', status: 'Aktif', rating: 4.7, classes: 3, email: 'budi.hartono@sekolah.edu', phone: '081298765432' },
    { id: 'G-004', name: 'Sri Wahyuni, S.E', subject: 'Ekonomi', status: 'Aktif', rating: 4.6, classes: 4, email: 'sri.wahyuni@sekolah.edu', phone: '081298765433' },
  ],
  courses: [
    { id: 'C-001', title: 'Matematika Dasar', category: 'MIPA', status: 'Aktif', instructor: 'Drs. Ahmad Yani', students: 120, rating: 4.5 },
    { id: 'C-002', title: 'Bahasa Indonesia', category: 'Bahasa', status: 'Aktif', instructor: 'Siti Rohmah, M.Pd', students: 150, rating: 4.8 },
    { id: 'C-003', title: 'Fisika Kuantum', category: 'MIPA', status: 'Aktif', instructor: 'Budi Hartono, S.Si', students: 80, rating: 4.2 },
    { id: 'C-004', title: 'Sejarah Dunia', category: 'IPS', status: 'Nonaktif', instructor: 'Siti Rohmah, M.Pd', students: 0, rating: 0 },
  ]
};
