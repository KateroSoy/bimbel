export function TrustAndSocialSection() {
  return (
    <div className="mt-20 pt-10 border-t border-[#DCE3EE]">
      <p className="text-center text-sm font-bold text-[#5D6263] uppercase tracking-wider mb-8">Dipercaya oleh siswa dari berbagai sekolah ternama</p>
      <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale">
        {/* Dummy partner names */}
        <div className="font-display font-bold text-xl">Global School</div>
        <div className="font-display font-bold text-xl">EduNusantara</div>
        <div className="font-display font-bold text-xl">Bina Prestasi</div>
        <div className="font-display font-bold text-xl">Tunas Bangsa</div>
        <div className="font-display font-bold text-xl">Mentari Inter</div>
      </div>
    </div>
  );
}
