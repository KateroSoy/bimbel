/** Program catalogue shown on the landing page and on /program/:slug (copy supplied by StudyHack, revisi tahap 2). */

export type ProgramGroup = 'Early Childhood' | 'Kids' | 'Creativity' | 'Specialization';

export interface LandingProgram {
  slug: string;
  group: ProgramGroup;
  name: string;
  image: string;
  /** Short card copy */
  summary: string;
  highlight: string;
  /** Monthly fee in rupiah */
  price: number;
  method: string;
  frequency: string;
  duration: string;
  headline: string;
  intro: string[];
  pointsTitle: string;
  points: { title: string; text: string }[];
  closing: string;
  cta: string;
}

export const PROGRAM_GROUPS: ProgramGroup[] = ['Early Childhood', 'Kids', 'Creativity', 'Specialization'];

const img = (name: string) => `/assets/landing/programs/${name}.jpg`;

export const LANDING_PROGRAMS: LandingProgram[] = [
  {
    slug: 'playclub', group: 'Early Childhood', name: 'Play Club', image: img('playclub'),
    summary: 'Membangun kemampuan sosial, motorik, dan sensorik anak melalui aktivitas bermain yang menyenangkan.',
    highlight: 'Sosial, motorik & sensorik', price: 350_000,
    method: 'Tatap muka', frequency: '12x per bulan', duration: '120 menit per sesi',
    headline: 'PLAYCLUB — Belajar Seru, Tumbuh Percaya Diri!',
    intro: [
      'Dunia anak adalah dunia bermain. Melalui aktivitas bermain yang terarah dan menyenangkan, anak diajak mengeksplorasi lingkungan, mengembangkan keterampilan, dan belajar berinteraksi dengan teman sebaya.',
      'Di Playclub, setiap aktivitas menjadi kesempatan bagi anak untuk tumbuh, bereksplorasi, dan mengembangkan potensinya sejak dini.',
    ],
    pointsTitle: 'Apa yang Anak Kembangkan?',
    points: [
      { title: 'Kemampuan Sosial', text: 'Belajar berbagi, bergiliran, bekerja sama, dan berinteraksi dengan teman.' },
      { title: 'Kemampuan Motorik', text: 'Melatih koordinasi tubuh, keseimbangan, serta keterampilan gerak halus dan kasar.' },
      { title: 'Kemampuan Sensorik', text: 'Mengenal berbagai tekstur, bentuk, warna, suara, dan pengalaman sensorik melalui kegiatan eksplorasi.' },
    ],
    closing: 'Karena bermain bukan sekadar bersenang-senang, tetapi juga bagian penting dari proses tumbuh kembang anak.',
    cta: 'Yuk, berikan pengalaman bermain yang lebih bermakna bersama Playclub!',
  },
  {
    slug: 'little-star', group: 'Early Childhood', name: 'Little Star', image: img('little-star'),
    summary: 'Membangun kemampuan dasar membaca, menulis, dan berhitung sebagai bekal belajar anak.',
    highlight: 'Membaca, Menulis & Berhitung', price: 300_000,
    method: 'Tatap muka', frequency: '12x per bulan', duration: '60 menit per sesi',
    headline: 'LITTLE STAR — Langkah Kecil Menuju Prestasi Besar!',
    intro: [
      'Setiap anak memiliki potensi untuk bersinar. Dengan pendampingan yang tepat dan metode belajar yang menyenangkan, anak dapat mulai membangun fondasi akademik yang kuat sejak dini.',
      'Little Star dirancang untuk membantu anak mengenal huruf, belajar menulis, dan memahami angka melalui kegiatan belajar yang terarah, bertahap, dan sesuai dengan tahap perkembangannya.',
    ],
    pointsTitle: 'Apa yang Anak Pelajari?',
    points: [
      { title: 'Membaca', text: 'Mengenal huruf, memahami bunyi huruf, dan membangun kemampuan membaca secara bertahap.' },
      { title: 'Menulis', text: 'Melatih motorik halus, memegang alat tulis, serta menulis huruf dan angka.' },
      { title: 'Berhitung', text: 'Mengenal angka, memahami konsep jumlah, dan mengembangkan kemampuan berhitung dasar.' },
    ],
    closing: 'Bukan sekadar belajar membaca, menulis, dan berhitung, tetapi membangun kesiapan anak untuk melangkah ke jenjang pendidikan berikutnya dengan lebih percaya diri.',
    cta: 'Yuk, mulai perjalanan belajar si kecil bersama Little Star!',
  },
  {
    slug: 'math-essential', group: 'Kids', name: 'Math Essential', image: img('math-essential'),
    summary: 'Membangun kemampuan matematika anak melalui pemahaman konsep, latihan yang terarah, dan aktivitas belajar yang menyenangkan.',
    highlight: 'Number Sense & Operasi Matematika', price: 240_000,
    method: 'Tatap muka & Online', frequency: '8x per bulan', duration: '45 menit per sesi',
    headline: 'MATH ESSENTIAL — Pahami Konsepnya, Kuasai Matematikanya!',
    intro: [
      'Matematika bukan sekadar menghafal rumus dan menghitung angka. Anak perlu memahami konsep dasar agar mampu berpikir logis, memecahkan masalah, dan menghadapi tantangan matematika dengan percaya diri.',
      'Di Math Essential, anak belajar matematika secara bertahap melalui pendekatan yang terstruktur, latihan yang terarah, dan aktivitas belajar yang membantu konsep menjadi lebih mudah dipahami.',
    ],
    pointsTitle: 'Apa yang Anak Pelajari?',
    points: [
      { title: 'Number Sense', text: 'Memahami angka, nilai tempat, urutan, dan hubungan antarbilangan.' },
      { title: 'Mathematical Operations', text: 'Menguasai penjumlahan, pengurangan, perkalian, dan pembagian sesuai tingkat kemampuan.' },
      { title: 'Logical Thinking & Problem Solving', text: 'Mengembangkan penalaran logis, strategi berhitung, dan kemampuan menyelesaikan soal cerita.' },
    ],
    closing: 'Karena anak yang memahami konsep akan lebih siap menghadapi matematika yang lebih menantang.',
    cta: 'Yuk, bangun fondasi matematika yang kuat bersama Math Essential!',
  },
  {
    slug: 'english-young-learners', group: 'Kids', name: 'English for Young Learners', image: img('eyl'),
    summary: 'Membangun kemampuan bahasa Inggris anak melalui aktivitas interaktif, permainan edukatif, lagu, cerita, dan latihan yang menyenangkan.',
    highlight: 'Vocabulary, Grammar & Conversation', price: 240_000,
    method: 'Tatap muka & Online', frequency: '8x per bulan', duration: '45 menit per sesi',
    headline: 'ENGLISH FOR YOUNG LEARNERS — Little Learners, Big Confidence!',
    intro: [
      'Bahasa Inggris akan menjadi bekal penting bagi masa depan anak. Semakin dini anak mengenal bahasa Inggris melalui pengalaman belajar yang positif, semakin banyak kesempatan baginya untuk membangun kosakata, memahami bahasa, dan berani berkomunikasi.',
      'Di English for Young Learners (EYL), anak belajar bahasa Inggris melalui aktivitas interaktif, permainan edukatif, lagu, cerita, dan latihan yang disesuaikan dengan tingkat kemampuannya.',
    ],
    pointsTitle: 'Apa yang Anak Pelajari?',
    points: [
      { title: 'Vocabulary', text: 'Memperkaya kosakata dan memahami penggunaannya dalam berbagai situasi sehari-hari.' },
      { title: 'Grammar', text: 'Mengenal dan menggunakan struktur bahasa Inggris secara bertahap sesuai dengan tingkat kemampuan anak.' },
      { title: 'Conversation', text: 'Melatih kemampuan menyimak, memahami pertanyaan dan instruksi, serta merespons dan berbicara dalam percakapan sederhana.' },
    ],
    closing: 'Belajar bahasa Inggris bukan hanya tentang menghafal kata, tetapi juga berani menggunakannya dalam kehidupan sehari-hari.',
    cta: 'Yuk, tumbuhkan kecintaan anak terhadap bahasa Inggris bersama EYL!',
  },
  {
    slug: 'wonderworld', group: 'Kids', name: 'WonderWorld: Science & Discovery', image: img('wonderworld'),
    summary: 'Mengenal dunia sains melalui pengamatan, eksperimen sederhana, eksplorasi, dan aktivitas langsung yang menyenangkan.',
    highlight: 'Science Exploration & Eksperimen', price: 120_000,
    method: 'Tatap muka & Online', frequency: '4x per bulan', duration: '45 menit per sesi',
    headline: 'WONDERWORLD: SCIENCE & DISCOVERY — Rasa Ingin Tahu, Awal Penemuan Hebat!',
    intro: [
      'Mengapa langit berubah warna? Bagaimana tumbuhan tumbuh? Mengapa benda tertentu bisa mengapung atau tenggelam?',
      'Anak-anak memiliki rasa ingin tahu yang luar biasa. Melalui WonderWorld: Science & Discovery, rasa ingin tahu tersebut diarahkan menjadi pengalaman belajar yang seru, bermakna, dan penuh penemuan.',
      'Anak diajak mengenal dunia sains melalui pengamatan, eksperimen sederhana, eksplorasi, dan aktivitas langsung yang membantu mereka memahami bagaimana dunia bekerja.',
    ],
    pointsTitle: 'Apa yang Anak Pelajari?',
    points: [
      { title: 'Science Exploration', text: 'Mengenal makhluk hidup, tubuh manusia, lingkungan, bumi, dan fenomena alam.' },
      { title: 'Hands-on Experiments', text: 'Melakukan percobaan sederhana untuk mengamati sebab dan akibat serta memahami konsep sains.' },
      { title: 'Critical Thinking & Discovery', text: 'Belajar bertanya, membuat prediksi, mengamati hasil, dan menarik kesimpulan sederhana.' },
    ],
    closing: 'Karena setiap pertanyaan adalah awal dari pengetahuan, dan setiap penemuan adalah kesempatan untuk belajar.',
    cta: 'Yuk, ajak si kecil menjelajahi keajaiban dunia bersama WonderWorld!',
  },
  {
    slug: 'mandarin-world', group: 'Kids', name: 'Mandarin World', image: img('mandarin'),
    summary: 'Mengenal bahasa Mandarin melalui kosakata sehari-hari, latihan mendengar dan berbicara, pengenalan nada, serta karakter Mandarin.',
    highlight: 'Vocabulary, Speaking & Chinese Characters', price: 120_000,
    method: 'Tatap muka & Online', frequency: '4x per bulan', duration: '45 menit per sesi',
    headline: 'MANDARIN WORLD — Open a World of New Possibilities!',
    intro: [
      'Bahasa Mandarin membuka pintu menuju budaya, komunikasi, dan peluang masa depan yang lebih luas. Dengan pengenalan yang tepat sejak dini, anak dapat mulai membangun kemampuan bahasa Mandarin secara bertahap dan menyenangkan.',
      'Di Mandarin World, anak diajak mengenal bahasa Mandarin melalui kosakata sehari-hari, latihan mendengar dan berbicara, pengenalan nada, serta karakter Mandarin sesuai tingkat kemampuannya.',
    ],
    pointsTitle: 'Apa yang Anak Pelajari?',
    points: [
      { title: 'Vocabulary & Pronunciation', text: 'Mengenal kosakata dasar, pelafalan, dan empat nada utama bahasa Mandarin.' },
      { title: 'Listening & Speaking', text: 'Melatih kemampuan memahami dan menggunakan ungkapan sederhana dalam percakapan sehari-hari.' },
      { title: 'Pinyin & Chinese Characters', text: 'Mengenal Pinyin, membaca suku kata, serta mulai menulis karakter Mandarin sesuai level pembelajaran.' },
    ],
    closing: 'Setiap kata baru adalah langkah kecil untuk mengenal bahasa dan budaya yang berbeda.',
    cta: 'Yuk, mulai petualangan bahasa Mandarin si kecil bersama Mandarin World!',
  },
  {
    slug: 'abacus-academy', group: 'Kids', name: 'Abacus Academy', image: img('abacus'),
    summary: 'Melatih kemampuan berhitung, konsentrasi, dan logika anak melalui metode sempoa yang menyenangkan dan terstruktur.',
    highlight: 'Abacus Skills & Mental Arithmetic', price: 120_000,
    method: 'Tatap muka & Online', frequency: '4x per bulan', duration: '45 menit per sesi',
    headline: 'ABACUS ACADEMY — Berhitung Lebih Cepat, Berpikir Lebih Terlatih!',
    intro: [
      'Bagaimana jika anak dapat berlatih berhitung dengan lebih cepat sekaligus melatih konsentrasi dan daya ingat?',
      'Abacus Academy memperkenalkan metode berhitung menggunakan sempoa sebagai sarana untuk mengembangkan keterampilan numerik dan membangun kebiasaan berpikir secara terstruktur.',
      'Melalui latihan yang bertahap dan konsisten, anak belajar menggerakkan manik-manik sempoa, memahami pola perhitungan, hingga mengembangkan kemampuan membayangkan sempoa secara mental sesuai tahap pembelajarannya.',
    ],
    pointsTitle: 'Apa yang Anak Kembangkan?',
    points: [
      { title: 'Abacus Skills', text: 'Mengenal sempoa dan menguasai teknik berhitung menggunakan manik-manik.' },
      { title: 'Mental Arithmetic', text: 'Melatih kemampuan melakukan perhitungan secara mental melalui visualisasi sempoa.' },
      { title: 'Focus & Number Fluency', text: 'Melatih konsentrasi, ketelitian, daya ingat, dan kelancaran berhitung melalui latihan rutin.' },
    ],
    closing: 'Bukan hanya tentang seberapa cepat anak menghitung, tetapi juga tentang membangun ketekunan, ketelitian, dan kepercayaan diri dalam belajar.',
    cta: 'Yuk, kembangkan potensi berhitung si kecil bersama Abacus Academy!',
  },
  {
    slug: 'literacy-lab', group: 'Kids', name: 'Literacy Lab: Reading & Writing', image: img('literacy'),
    summary: 'Meningkatkan kemampuan membaca dengan pemahaman, memperkaya kosakata, dan menulis cerita atau paragraf dengan ide yang jelas dan runtut.',
    highlight: 'Reading Comprehension & Writing Skills', price: 120_000,
    method: 'Tatap muka & Online', frequency: '4x per bulan', duration: '45 menit per sesi',
    headline: 'LITERACY LAB: READING & WRITING — Membaca dengan Pemahaman, Menulis dengan Imajinasi!',
    intro: [
      'Bagaimana jika anak tidak hanya mampu membaca kata demi kata, tetapi juga memahami isi bacaan, mengungkapkan gagasan, dan menuangkan imajinasinya ke dalam tulisan?',
      'Literacy Lab: Reading & Writing dirancang untuk mengembangkan kemampuan literasi anak secara bertahap, mulai dari memahami teks bacaan, menemukan informasi penting, mengenali ide pokok, hingga menyusun cerita dan paragraf secara runtut.',
      'Melalui kegiatan membaca terpandu, diskusi, latihan memahami bacaan, serta praktik menulis yang terarah, anak belajar menghubungkan informasi, mengembangkan kosakata, menyusun kalimat, dan menyampaikan ide dengan lebih jelas. Anak juga dilatih untuk memahami apa yang dibacanya, bukan sekadar melafalkan kata-kata.',
    ],
    pointsTitle: 'Apa yang Anak Kembangkan?',
    points: [
      { title: 'Reading Comprehension', text: 'Melatih kemampuan memahami isi bacaan, menemukan informasi penting, mengenali ide pokok, serta menarik kesimpulan sederhana dari teks.' },
      { title: 'Vocabulary & Language Skills', text: 'Memperkaya kosakata dan memahami penggunaan kata serta kalimat untuk mendukung kemampuan membaca dan menulis.' },
      { title: 'Creative Writing', text: 'Mengembangkan kemampuan menulis cerita dan paragraf dengan ide yang jelas, urutan yang logis, serta kalimat yang saling berkaitan.' },
      { title: 'Critical Thinking & Expression', text: 'Melatih anak mengolah informasi, menyampaikan pendapat, dan mengungkapkan gagasan secara tertulis dengan lebih percaya diri.' },
    ],
    closing: 'Bukan hanya tentang seberapa lancar anak membaca atau seberapa panjang tulisan yang dapat dibuat, tetapi juga tentang bagaimana anak memahami informasi, mengembangkan pemikiran, dan menyampaikan gagasannya dengan baik.',
    cta: 'Yuk, bangun kemampuan membaca, memahami bacaan, dan menulis si kecil bersama Literacy Lab: Reading & Writing — karena setiap bacaan membuka wawasan dan setiap tulisan membawa ide menjadi nyata!',
  },
  {
    slug: 'artventure', group: 'Creativity', name: 'ArtVenture', image: img('artventure'),
    summary: 'Menjelajahi dunia seni melalui kegiatan menggambar, melukis, mewarnai, dan kerajinan yang menyenangkan.',
    highlight: 'Creative Expression & Art Skills', price: 200_000,
    method: 'Tatap muka', frequency: '4x per bulan', duration: '90 menit per sesi',
    headline: 'ARTVENTURE — Unleash Creativity, Express Your Imagination!',
    intro: [
      'Setiap anak memiliki imajinasi dan cara unik untuk mengekspresikan dirinya. Melalui seni, anak dapat menuangkan ide, mengenal warna dan bentuk, serta menciptakan sesuatu yang mencerminkan kreativitasnya.',
      'Di ArtVenture, anak diajak menjelajahi dunia seni melalui kegiatan menggambar, melukis, mewarnai, membuat kerajinan, dan bereksperimen dengan berbagai media kreatif. Setiap karya menjadi kesempatan untuk bereksplorasi, belajar, dan mengembangkan potensi diri.',
    ],
    pointsTitle: 'Apa yang Anak Kembangkan?',
    points: [
      { title: 'Creative Expression', text: 'Mengembangkan imajinasi dan kemampuan mengekspresikan ide melalui karya seni.' },
      { title: 'Art & Craft Skills', text: 'Mengenal warna, bentuk, pola, tekstur, serta berbagai teknik menggambar, melukis, dan membuat kerajinan.' },
      { title: 'Fine Motor Skills & Focus', text: 'Melatih koordinasi mata dan tangan, ketelitian, konsentrasi, serta kesabaran melalui aktivitas kreatif.' },
    ],
    closing: 'Karena setiap karya memiliki cerita, dan setiap anak memiliki imajinasi yang layak untuk diekspresikan.',
    cta: 'Yuk, bebaskan kreativitas si kecil dan jelajahi dunia seni bersama ArtVenture!',
  },
  {
    slug: 'rhythm-move', group: 'Creativity', name: 'Rhythm & Move', image: img('rhythm'),
    summary: 'Menari, bergerak, dan berekspresi melalui musik dengan aktivitas yang menyenangkan dan penuh energi.',
    highlight: 'Rhythm, Coordination & Confidence', price: 200_000,
    method: 'Tatap muka', frequency: '4x per bulan', duration: '90 menit per sesi',
    headline: 'RHYTHM & MOVE — Move to the Music, Grow with Joy!',
    intro: [
      'Musik dan gerakan adalah cara menyenangkan bagi anak untuk mengenal tubuh, mengekspresikan emosi, dan belajar mengikuti irama. Melalui aktivitas yang aktif dan interaktif, anak dapat mengembangkan koordinasi gerak sekaligus menikmati pengalaman belajar yang penuh energi.',
      'Di Rhythm & Move, anak diajak bernyanyi, menari, mengikuti ketukan, melakukan permainan gerak, dan mengeksplorasi berbagai pola ritme melalui aktivitas yang menyenangkan dan sesuai tahap perkembangannya.',
    ],
    pointsTitle: 'Apa yang Anak Kembangkan?',
    points: [
      { title: 'Rhythm & Musical Awareness', text: 'Mengenal irama, tempo, ketukan, serta merespons musik melalui gerakan.' },
      { title: 'Coordination & Body Movement', text: 'Melatih keseimbangan, koordinasi tubuh, kelenturan, dan keterampilan motorik kasar.' },
      { title: 'Expression & Confidence', text: 'Mengembangkan ekspresi diri, keberanian tampil, kemampuan mengikuti instruksi, dan interaksi positif dengan teman.' },
    ],
    closing: 'Karena setiap irama mengajak anak bergerak, dan setiap gerakan menjadi kesempatan untuk tumbuh lebih percaya diri.',
    cta: 'Yuk, bergerak, berekspresi, dan bersenang-senang bersama Rhythm & Move!',
  },
  {
    slug: 'little-warriors', group: 'Creativity', name: 'Little Warriors', image: img('little-warriors'),
    summary: 'Melatih kebugaran, disiplin, dan karakter anak melalui aktivitas bela diri dasar yang menyenangkan dan terarah.',
    highlight: 'Physical Fitness, Discipline & Confidence', price: 200_000,
    method: 'Tatap muka', frequency: '4x per bulan', duration: '90 menit per sesi',
    headline: 'LITTLE WARRIORS — Strong Body, Brave Heart, Respectful Mind!',
    intro: [
      'Menjadi kuat bukan hanya tentang kemampuan fisik, tetapi juga tentang disiplin, keberanian, pengendalian diri, dan rasa hormat terhadap orang lain.',
      'Di Little Warriors, anak diperkenalkan pada aktivitas bela diri dasar dan latihan gerak yang sesuai dengan usia serta kemampuan mereka. Melalui latihan yang terarah dan suasana yang positif, anak belajar membangun kebugaran, mengikuti aturan, dan menghadapi tantangan dengan sikap yang baik.',
    ],
    pointsTitle: 'Apa yang Anak Kembangkan?',
    points: [
      { title: 'Physical Fitness & Coordination', text: 'Melatih keseimbangan, kelincahan, koordinasi tubuh, kekuatan, dan kebugaran fisik.' },
      { title: 'Discipline & Self-Control', text: 'Membiasakan anak mengikuti instruksi, menaati aturan, melatih fokus, dan mengendalikan gerakan.' },
      { title: 'Confidence & Respect', text: 'Membangun keberanian, ketekunan, rasa percaya diri, serta sikap menghormati guru dan teman.' },
    ],
    closing: 'Karena pejuang kecil yang hebat bukan hanya berani menghadapi tantangan, tetapi juga tahu cara menghormati dan mengendalikan dirinya.',
    cta: 'Yuk, bangun karakter, kebugaran, dan kepercayaan diri si kecil bersama Little Warriors!',
  },
  {
    slug: 'math-mastery-olympiad', group: 'Specialization', name: 'Math Mastery & Olympiad Prep', image: img('math-mastery'),
    summary: 'Pendalaman konsep matematika, latihan soal menantang, dan strategi pemecahan masalah untuk persiapan kompetisi dan olimpiade.',
    highlight: 'Advanced Concepts & Problem Solving', price: 400_000,
    method: 'Tatap muka & Online', frequency: '4x per bulan', duration: '90 menit per sesi',
    headline: 'MATH MASTERY & OLYMPIAD PREP — Think Beyond Numbers, Achieve Beyond Limits!',
    intro: [
      'Matematika bukan hanya tentang menemukan jawaban yang benar, tetapi juga tentang memahami pola, membangun strategi, dan menemukan cara kreatif untuk menyelesaikan masalah.',
      'Di Math Mastery & Olympiad Prep, anak diajak melampaui latihan matematika rutin melalui pembelajaran konsep yang mendalam, soal-soal menantang, dan strategi pemecahan masalah. Program ini dirancang untuk memperkuat kemampuan matematika sekaligus mempersiapkan anak menghadapi kompetisi dan olimpiade matematika sesuai tingkat kemampuannya.',
    ],
    pointsTitle: 'Apa yang Anak Kembangkan?',
    points: [
      { title: 'Advanced Mathematical Concepts', text: 'Memperdalam pemahaman bilangan, operasi hitung, geometri, pola, dan konsep matematika sesuai level.' },
      { title: 'Olympiad Problem Solving', text: 'Melatih strategi penyelesaian soal nonrutin, penalaran matematis, serta kemampuan menganalisis masalah yang menantang.' },
      { title: 'Logical Thinking & Competition Readiness', text: 'Mengembangkan ketelitian, kreativitas, kemandirian berpikir, dan kesiapan menghadapi kompetisi matematika.' },
    ],
    closing: 'Karena kemampuan matematika yang hebat tidak hanya dibangun dari banyaknya soal yang dikerjakan, tetapi juga dari kedalaman cara berpikir.',
    cta: 'Yuk, tantang kemampuan matematika si kecil dan persiapkan langkahnya menuju prestasi bersama Math Mastery & Olympiad Prep!',
  },
  {
    slug: 'science-mastery-olympiad', group: 'Specialization', name: 'Science Mastery & Olympiad Prep', image: img('science-mastery'),
    summary: 'Pendalaman konsep sains, eksperimen, dan strategi pemecahan masalah untuk persiapan kompetisi dan olimpiade.',
    highlight: 'Konsep Sains & Scientific Thinking', price: 400_000,
    method: 'Tatap muka & Online', frequency: '4x per bulan', duration: '90 menit per sesi',
    headline: 'SCIENCE MASTERY & OLYMPIAD PREP — Explore Curiosity, Excel in Science!',
    intro: [
      'Ilmu pengetahuan bukan sekadar menghafal fakta dan teori, melainkan memahami bagaimana dunia bekerja, mempertanyakan apa yang kita temui, dan menemukan jawaban melalui penalaran ilmiah.',
      'Di Science Mastery & Olympiad Prep, anak diajak melampaui pembelajaran sains biasa melalui pendalaman konsep, analisis fenomena, latihan soal menantang, dan strategi pemecahan masalah. Program ini dirancang untuk membangun pemahaman sains yang kuat, mengasah kemampuan berpikir kritis dan analitis, serta mempersiapkan anak menghadapi kompetisi dan olimpiade sains sesuai tingkat kemampuannya.',
    ],
    pointsTitle: 'Apa yang Anak Kembangkan?',
    points: [
      { title: 'Advanced Scientific Concepts', text: 'Memperdalam pemahaman konsep sains yang mencakup makhluk hidup, tubuh manusia, lingkungan, materi, energi, serta berbagai fenomena alam sesuai tingkat pembelajaran.' },
      { title: 'Scientific Reasoning & Olympiad Problem Solving', text: 'Melatih kemampuan menganalisis fenomena, menghubungkan berbagai konsep, menafsirkan informasi, serta menyelesaikan soal-soal sains nonrutin yang membutuhkan penalaran mendalam.' },
      { title: 'Critical Thinking & Scientific Inquiry', text: 'Mengembangkan rasa ingin tahu, ketelitian, dan kemampuan berpikir kritis melalui proses mengajukan pertanyaan, mengevaluasi informasi, serta menarik kesimpulan berdasarkan bukti ilmiah.' },
    ],
    closing: 'Karena penguasaan sains yang sesungguhnya bukan hanya tentang mengetahui apa yang terjadi, tetapi juga memahami mengapa dan bagaimana hal itu terjadi.',
    cta: 'Yuk, tumbuhkan rasa ingin tahu si kecil, pertajam kemampuan berpikir ilmiahnya, dan persiapkan langkahnya menuju prestasi bersama Science Mastery & Olympiad Prep!',
  },
];

export interface Bundle {
  name: string;
  programs: string[];
  normal: number;
  price: number;
  popular?: boolean;
}

export const BUNDLES: Bundle[] = [
  { name: 'Essential', programs: ['English for Young Learners', 'Math Essential'], normal: 480_000, price: 429_000 },
  { name: 'Plus', programs: ['English for Young Learners', 'Math Essential', 'WonderWorld: Science & Discovery', 'Mandarin World'], normal: 720_000, price: 579_000, popular: true },
  {
    name: 'Comprehensive',
    programs: ['English for Young Learners', 'Math Essential', 'WonderWorld: Science & Discovery', 'Mandarin World', 'Abacus Academy', 'Literacy Lab: Reading & Writing'],
    normal: 960_000, price: 699_000,
  },
];

export const rupiah = (n: number) => `Rp${n.toLocaleString('id-ID')}`;
export const ribu = (n: number) => `Rp. ${Math.round(n / 1000)} ribu`;

export const findProgram = (slug: string) => LANDING_PROGRAMS.find((p) => p.slug === slug);
