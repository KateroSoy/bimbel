import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';

const FAQS = [
  {
    question: "Bagaimana cara saya memulai kursus?",
    answer: "Sangat mudah! Anda hanya perlu mendaftar akun, pilih kursus yang Anda minati di halaman Jelajahi, dan klik tombol 'Mulai Belajar'. Anda bisa langsung mengakses seluruh materi kursus tersebut."
  },
  {
    question: "Apakah saya bisa mengakses kursus selamanya?",
    answer: "Ya, sebagian besar kursus kami menawarkan akses seumur hidup. Setelah Anda mendaftar, Anda dapat mengakses materi, video, dan pembaruan kursus kapan saja tanpa batas waktu."
  },
  {
    question: "Apakah saya akan mendapatkan sertifikat?",
    answer: "Tentu saja. Setelah Anda menyelesaikan seluruh modul dan lulus kuis akhir, Anda akan otomatis mendapatkan sertifikat penyelesaian yang bisa langsung dibagikan ke LinkedIn atau dicantumkan di CV Anda."
  },
  {
    question: "Bagaimana jika saya kesulitan memahami materi?",
    answer: "Setiap kursus dilengkapi dengan forum diskusi komunitas. Anda dapat bertanya langsung kepada instruktur atau berdiskusi dengan siswa lain. Instruktur kami sangat responsif dalam membantu kendala Anda."
  },
  {
    question: "Apakah platform ini bisa diakses di smartphone?",
    answer: "Ya, platform kami sepenuhnya responsif dan dioptimalkan untuk perangkat mobile. Anda bisa belajar dengan nyaman melalui browser di smartphone atau tablet Anda kapan pun dan di mana pun."
  }
];

function FAQItem({ question, answer, isOpen, onClick }: { question: string, answer: string, isOpen: boolean, onClick: () => void }) {
  return (
    <div className="border-b border-slate-200/60 last:border-0">
      <button
        className="w-full py-6 flex items-center justify-between text-left focus:outline-none group"
        onClick={onClick}
      >
        <span className={cn(
          "font-bold text-lg transition-colors",
          isOpen ? "text-blue-600" : "text-slate-800 group-hover:text-blue-500"
        )}>
          {question}
        </span>
        <div className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 transition-all duration-300 shrink-0 ml-4",
          isOpen ? "rotate-180 bg-blue-100 text-blue-600" : "group-hover:bg-slate-200 text-slate-500"
        )}>
          <ChevronDown className="w-5 h-5" />
        </div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pb-6 pr-12 text-slate-600 font-medium leading-relaxed">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 relative">
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="font-display font-bold text-4xl md:text-5xl text-slate-900 mb-4">
            Pertanyaan Umum
          </h2>
          <p className="text-slate-600 text-lg font-medium max-w-2xl mx-auto">
            Temukan jawaban tentang bagaimana kami dapat membantu Anda mencapai tujuan karir dan pembelajaran.
          </p>
        </div>

        <div className="glass-card bg-white/70 backdrop-blur-xl border border-white/80 rounded-[2rem] p-6 md:p-10 shadow-xl">
          {FAQS.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
