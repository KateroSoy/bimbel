import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

const FAQS = [
  {
    question: "Bagaimana cara mendaftar di StudyHack?",
    answer: "Pendaftaran dapat dilakukan secara online melalui website ini dengan memilih program belajar yang diinginkan, atau langsung menghubungi tim konsultan kami via WhatsApp untuk panduan lengkap dan tes pemetaan minat bakat gratis."
  },
  {
    question: "Apakah ada program khusus untuk ujian sekolah?",
    answer: "Ya! Kami menyediakan program intensif persiapan Ujian Sekolah, Asesmen Nasional, hingga UTBK-SNBT dengan bank soal terupdate, tryout berkala berskala nasional, dan bedah kisi-kisi tuntas."
  },
  {
    question: "Apakah tersedia kelas online?",
    answer: "Tersedia! Kelas online kami diselenggarakan secara live interaktif via platform digital dengan rekaman sesi belajar yang dapat diakses seumur hidup serta modul materi digital lengkap."
  },
  {
    question: "Bagaimana sistem pembayaran?",
    answer: "Kami mendukung berbagai metode pembayaran fleksibel: transfer bank (BCA, Mandiri, BNI, BRI), e-wallet (GoPay, OVO, ShopeePay), serta cicilan bulanan atau paket tahunan hemat."
  }
];

function FAQItem({ question, answer, isOpen, onClick }: { question: string, answer: string, isOpen: boolean, onClick: () => void }) {
  return (
    <div className="rounded-lg mb-2.5 overflow-hidden shadow-sm shadow-red-900/10">
      <button
        className="w-full py-3 px-4 flex items-center justify-between text-left focus:outline-none bg-[#E52833] hover:bg-[#d4202b] text-white transition-colors cursor-pointer"
        onClick={onClick}
        aria-expanded={isOpen}
      >
        <span className="font-bold text-sm md:text-[15px]">
          {question}
        </span>
        <span className={cn(
          "w-6 h-6 rounded-full flex items-center justify-center shrink-0 ml-4 bg-[#FDB515] text-[#E52833] font-black text-lg leading-none transition-transform duration-300",
          isOpen && "rotate-45"
        )}>
          +
        </span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="bg-[#FFF1F2] overflow-hidden"
          >
            <div className="px-4 py-3.5 text-slate-700 font-semibold text-sm leading-relaxed">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="pt-12 bg-white relative scroll-mt-32">
      <div className="max-w-[1080px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_1fr] gap-6 items-end">
          <div className="pb-20 lg:pl-16">
            <h2 className="text-2xl md:text-[30px] font-extrabold text-[#062564] text-center mb-6">
              Tanya Jawab Umum
            </h2>
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

          {/* Model berdiri tepat di atas banner aplikasi */}
          <div className="hidden lg:flex justify-center items-end self-end">
            <img
              src="/assets/landing/faq-girl.jpg"
              alt="Tutor StudyHack"
              className="w-[300px] h-auto object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
