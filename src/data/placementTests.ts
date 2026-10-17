/** Tes Kemampuan Dasar untuk calon siswa (dijalankan admin di /admin/tes-dasar). */

export interface PlacementQuestion { id: string; text: string; options: string[]; answer: number; skill: string }
export interface PlacementTest {
  key: 'matematika' | 'logika';
  title: string;
  subject: string;
  description: string;
  minutes: number;
  questions: PlacementQuestion[];
  recommend: (score: number) => { level: string; program: string };
}

export const PLACEMENT_TESTS: PlacementTest[] = [
  {
    key: 'matematika',
    title: 'Matematika SD',
    subject: 'Matematika',
    description: 'Bilangan, operasi hitung, pecahan, pengukuran, dan soal cerita tingkat SD.',
    minutes: 30,
    questions: [
      { id: 'm1', skill: 'Bilangan', text: 'Nilai tempat angka 7 pada bilangan 4.738 adalah …', options: ['Satuan', 'Puluhan', 'Ratusan', 'Ribuan'], answer: 2 },
      { id: 'm2', skill: 'Penjumlahan', text: '256 + 189 = …', options: ['335', '435', '445', '455'], answer: 2 },
      { id: 'm3', skill: 'Pengurangan', text: '1.000 − 365 = …', options: ['635', '645', '735', '665'], answer: 0 },
      { id: 'm4', skill: 'Perkalian', text: '24 × 6 = …', options: ['124', '134', '144', '154'], answer: 2 },
      { id: 'm5', skill: 'Pembagian', text: '96 : 8 = …', options: ['11', '12', '13', '14'], answer: 1 },
      { id: 'm6', skill: 'Pecahan', text: 'Pecahan yang senilai dengan 1/2 adalah …', options: ['2/3', '3/6', '2/5', '4/6'], answer: 1 },
      { id: 'm7', skill: 'Pecahan', text: '3/4 + 1/4 = …', options: ['1/2', '4/8', '1', '3/16'], answer: 2 },
      { id: 'm8', skill: 'Pengukuran', text: '2 meter = … cm', options: ['20', '200', '2.000', '0,2'], answer: 1 },
      { id: 'm9', skill: 'Waktu', text: 'Kelas dimulai pukul 07.30 dan berlangsung 45 menit. Kelas selesai pukul …', options: ['08.05', '08.10', '08.15', '08.30'], answer: 2 },
      { id: 'm10', skill: 'Geometri', text: 'Keliling persegi dengan sisi 9 cm adalah …', options: ['18 cm', '27 cm', '36 cm', '81 cm'], answer: 2 },
      { id: 'm11', skill: 'Soal Cerita', text: 'Rina membeli 3 buku seharga Rp4.500 per buku. Ia membayar Rp20.000. Kembaliannya …', options: ['Rp5.500', 'Rp6.500', 'Rp7.500', 'Rp15.500'], answer: 1 },
      { id: 'm12', skill: 'Pola Bilangan', text: 'Lanjutkan pola: 3, 6, 12, 24, …', options: ['30', '36', '48', '50'], answer: 2 },
      { id: 'm13', skill: 'KPK & FPB', text: 'KPK dari 4 dan 6 adalah …', options: ['2', '12', '18', '24'], answer: 1 },
      { id: 'm14', skill: 'Soal Cerita', text: 'Sebuah kotak berisi 48 kue dibagi rata ke 6 anak. Setiap anak mendapat …', options: ['6 kue', '7 kue', '8 kue', '9 kue'], answer: 2 },
      { id: 'm15', skill: 'Bangun Datar', text: 'Luas persegi panjang dengan panjang 12 cm dan lebar 5 cm adalah …', options: ['17 cm²', '34 cm²', '60 cm²', '120 cm²'], answer: 2 },
    ],
    recommend: (score) =>
      score >= 85 ? { level: 'Lanjutan', program: 'Math Mastery & Olympiad Prep' }
        : score >= 60 ? { level: 'Menengah', program: 'Math Essential (level menengah)' }
          : { level: 'Dasar', program: 'Math Essential (level dasar)' },
  },
  {
    key: 'logika',
    title: 'Logika & Coding SD',
    subject: 'Logika / Coding',
    description: 'Pola, urutan langkah (algoritma), logika sederhana, dan berpikir komputasional.',
    minutes: 25,
    questions: [
      { id: 'l1', skill: 'Pola', text: 'Lanjutkan pola: ▲ ● ▲ ● ▲ …', options: ['▲', '●', '■', '★'], answer: 1 },
      { id: 'l2', skill: 'Pola', text: 'Lanjutkan pola huruf: A, C, E, G, …', options: ['H', 'I', 'J', 'K'], answer: 1 },
      { id: 'l3', skill: 'Algoritma', text: 'Urutan yang benar untuk menggosok gigi adalah …', options: ['Berkumur → beri pasta → sikat', 'Beri pasta → sikat → berkumur', 'Sikat → beri pasta → berkumur', 'Berkumur → sikat → beri pasta'], answer: 1 },
      { id: 'l4', skill: 'Algoritma', text: 'Robot di kotak 1 menjalankan perintah "maju 3, mundur 1". Robot berada di kotak …', options: ['2', '3', '4', '5'], answer: 1 },
      { id: 'l5', skill: 'Perulangan', text: '"Ulangi 4 kali: lompat 2 langkah". Total langkah yang ditempuh …', options: ['6', '8', '10', '12'], answer: 1 },
      { id: 'l6', skill: 'Logika', text: 'Semua kucing suka ikan. Momo adalah kucing. Maka …', options: ['Momo tidak suka ikan', 'Momo suka ikan', 'Momo adalah ikan', 'Tidak dapat disimpulkan'], answer: 1 },
      { id: 'l7', skill: 'Logika', text: 'Andi lebih tinggi dari Budi. Budi lebih tinggi dari Caca. Siapa yang paling pendek?', options: ['Andi', 'Budi', 'Caca', 'Sama tinggi'], answer: 2 },
      { id: 'l8', skill: 'Kondisi', text: 'JIKA hujan MAKA bawa payung. Hari ini tidak hujan. Yang pasti benar …', options: ['Wajib bawa payung', 'Tidak wajib bawa payung', 'Pasti hujan nanti', 'Payung rusak'], answer: 1 },
      { id: 'l9', skill: 'Debugging', text: 'Perintah: "belok kanan, maju 2" seharusnya membawa robot ke bintang di sebelah kirinya. Perintah yang perlu diperbaiki …', options: ['maju 2', 'belok kanan', 'tidak ada', 'keduanya'], answer: 1 },
      { id: 'l10', skill: 'Pengurutan', text: 'Urutkan dari terkecil: 7, 2, 9, 4. Angka ketiga adalah …', options: ['2', '4', '7', '9'], answer: 2 },
      { id: 'l11', skill: 'Pola Bilangan', text: 'Lanjutkan pola: 1, 1, 2, 3, 5, 8, …', options: ['11', '12', '13', '14'], answer: 2 },
      { id: 'l12', skill: 'Dekomposisi', text: 'Membuat roti isi: ambil roti, oles selai, tutup roti. Langkah ke-2 adalah …', options: ['Ambil roti', 'Oles selai', 'Tutup roti', 'Makan roti'], answer: 1 },
    ],
    recommend: (score) =>
      score >= 85 ? { level: 'Lanjutan', program: 'Kelas Coding Lanjutan' }
        : score >= 60 ? { level: 'Menengah', program: 'Kelas Coding Dasar' }
          : { level: 'Dasar', program: 'Kelas Logika & Problem Solving' },
  },
];

export const testByKey = (key: string) => PLACEMENT_TESTS.find((t) => t.key === key);
export const testBySubject = (subject: string) => PLACEMENT_TESTS.find((t) => t.subject === subject);
