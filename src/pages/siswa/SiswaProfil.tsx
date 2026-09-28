import { Link } from 'react-router-dom';
import {
  User, CalendarDays, UserRound, School, BookOpen, MapPin, CalendarCheck, Camera, Phone, Mail, Briefcase, Info,
  TrendingUp, ArrowRight, Pencil, Landmark, BookMarked, Baby, ShieldCheck, CheckCircle2, MessageCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, PageTitle, Pill, ProgressBar, SubjectBadge } from '../../components/siswa/PortalUI';
import { ADMIN_WA, STUDENT, SUBJECTS } from '../../data/siswaPortal';

export default function SiswaProfil() {
  const left = [
    { icon: User, k: 'Nama Lengkap', v: STUDENT.name },
    { icon: User, k: 'Nama Panggilan', v: STUDENT.nickname },
    { icon: CalendarDays, k: 'Tanggal Lahir', v: STUDENT.birthDate },
    { icon: UserRound, k: 'Jenis Kelamin', v: STUDENT.gender },
  ];
  const right = [
    { icon: School, k: 'Sekolah', v: STUDENT.school },
    { icon: BookOpen, k: 'Kelas Sekolah', v: STUDENT.schoolClass },
    { icon: MapPin, k: 'Alamat', v: STUDENT.address },
    { icon: CalendarCheck, k: 'Bergabung', v: STUDENT.joined },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-[1400px] grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-4">
        <div className="min-w-0 space-y-3">
          <PageTitle
            title="Profil Saya"
            subtitle="Informasi pribadimu dan program belajar yang sedang diikuti."
            actions={<Link to="/siswa/pengaturan" className="flex items-center gap-2 h-10 px-4 rounded-xl border border-blue-200 bg-white text-sm font-bold text-[#1D4ED8] hover:bg-blue-50"><Pencil className="w-4 h-4" /> Edit Profil</Link>}
          />

          <Card className="p-4">
            <h2 className="font-extrabold text-[#0F1E4A] mb-3">Identitas Siswa</h2>
            <div className="grid grid-cols-1 lg:grid-cols-[180px_1fr_1fr] gap-5 lg:divide-x divide-slate-100">
              <div className="flex flex-col items-center text-center">
                <div className="relative">
                  <img src={STUDENT.avatar} alt={STUDENT.name} className="w-32 h-32 rounded-full object-cover bg-blue-50" />
                  <button onClick={() => toast.info('Ganti foto profil melalui admin bimbel.')} aria-label="Ganti foto" className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-white border border-slate-200 shadow flex items-center justify-center"><Camera className="w-4 h-4 text-slate-700" /></button>
                </div>
                <p className="mt-2 text-lg font-extrabold text-[#0F1E4A]">{STUDENT.name}</p>
                <Pill tone="blue">{STUDENT.level}</Pill>
                <p className="text-xs text-slate-600 font-medium mt-1">ID Siswa: {STUDENT.id}</p>
              </div>
              {[left, right].map((col, i) => (
                <dl key={i} className="space-y-3.5 lg:pl-5 text-sm">
                  {col.map(({ icon: Icon, k, v }) => (
                    <div key={k} className="grid grid-cols-[20px_110px_1fr] gap-2 items-start">
                      <Icon className="w-4 h-4 text-slate-600 mt-0.5" />
                      <dt className="text-slate-600">{k}</dt>
                      <dd className="font-bold text-[#0F1E4A]">: {v}</dd>
                    </div>
                  ))}
                </dl>
              ))}
            </div>
          </Card>

          <Card className="p-4">
            <h2 className="font-extrabold text-[#0F1E4A] mb-3">Orang Tua / Wali</h2>
            <div className="grid md:grid-cols-2 gap-3">
              {STUDENT.parents.map((p) => (
                <div key={p.role} className="rounded-xl border border-slate-200 p-3 flex items-center gap-4">
                  <img src={p.avatar} alt="" className="w-16 h-16 rounded-full object-cover bg-slate-100" />
                  <div className="text-sm space-y-0.5 min-w-0">
                    <p className="text-xs font-bold text-slate-600">{p.role}</p>
                    <p className="font-bold text-[#0F1E4A]">{p.name}</p>
                    <p className="flex items-center gap-2 text-slate-700"><Phone className="w-3.5 h-3.5" /> {p.phone}</p>
                    <p className="flex items-center gap-2 text-slate-700 truncate"><Mail className="w-3.5 h-3.5" /> {p.email}</p>
                    <p className="flex items-center gap-2 text-slate-700"><Briefcase className="w-3.5 h-3.5" /> Pekerjaan: {p.job}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-3 rounded-xl bg-[#F5F8FF] px-3 py-2 text-sm text-slate-700 font-medium flex items-center gap-2"><Info className="w-4 h-4 text-[#1D4ED8]" /> Informasi wali digunakan untuk komunikasi penting terkait kegiatan belajar dan administrasi.</p>
          </Card>

          <Card className="p-4">
            <h2 className="font-extrabold text-[#0F1E4A]">Program Aktif</h2>
            <p className="text-xs text-slate-600 font-medium mb-3">Program belajar yang sedang kamu ikuti di bimbel: <b>{STUDENT.program}</b></p>
            <div className="space-y-2">
              {SUBJECTS.map((s) => (
                <div key={s.id} className="rounded-xl border border-slate-200 px-3 py-2.5 grid grid-cols-1 md:grid-cols-[1.3fr_1.4fr_1.2fr_110px] items-center gap-3">
                  <div className="flex items-center gap-3"><SubjectBadge subject={s} /><div><p className="text-sm font-bold text-[#0F1E4A]">{s.className}</p><p className="text-xs text-slate-600">{s.tutor}</p></div></div>
                  <div className="flex items-center gap-2 text-xs"><CalendarDays className="w-4 h-4 text-slate-600" /><div><p className="font-bold text-[#0F1E4A]">Jadwal</p><p className="text-slate-600">{s.days} · {s.time}</p></div></div>
                  <div className="flex items-center gap-2 text-xs"><TrendingUp className="w-4 h-4 text-slate-600" /><div className="flex-1"><p className="font-bold text-[#0F1E4A]">Progress {s.progress}%</p><ProgressBar value={s.progress} className="mt-1" /></div></div>
                  <Pill tone={s.status === 'Perlu Perhatian' ? 'orange' : 'green'} className="justify-self-start md:justify-self-center">{s.status === 'Perlu Perhatian' ? 'Perlu Perhatian' : 'Aktif'}</Pill>
                </div>
              ))}
            </div>
            <Link to="/siswa/course" className="mt-3 flex items-center justify-center gap-1.5 text-sm font-bold text-[#1D4ED8] hover:underline">Lihat Semua Program <ArrowRight className="w-4 h-4" /></Link>
          </Card>
        </div>

        <div className="space-y-3 xl:pt-[60px]">
          <Card className="p-4">
            <h2 className="font-extrabold text-[#0F1E4A] mb-3">Ringkasan Profil</h2>
            {[
              { icon: Landmark, k: 'Level Bimbel', v: STUDENT.level, c: '#1D4ED8', bg: '#EAF1FF' },
              { icon: BookMarked, k: 'Kelas Sekolah', v: STUDENT.schoolClass, c: '#F97316', bg: '#FFF1E7' },
              { icon: Baby, k: 'Usia', v: STUDENT.age, c: '#7C3AED', bg: '#F3EDFF' },
              { icon: CalendarDays, k: 'Bergabung di LearnSpace+', v: STUDENT.joined, c: '#7C3AED', bg: '#F3EDFF' },
            ].map(({ icon: Icon, k, v, c, bg }) => (
              <div key={k} className="flex items-center gap-3 py-2">
                <span className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: bg, color: c }}><Icon className="w-4 h-4" /></span>
                <div><p className="text-sm font-bold text-[#0F1E4A]">{k}</p><p className="text-sm text-slate-600">{v}</p></div>
              </div>
            ))}
          </Card>

          <Card className="p-4 bg-[#F4FBF6] border-emerald-100">
            <h2 className="font-extrabold text-emerald-700 mb-1">Lengkapi Profilmu</h2>
            <div className="flex items-center gap-3">
              <p className="text-sm text-slate-700 font-medium flex-1">Pastikan informasi sudah lengkap agar kami dapat memberikan layanan terbaik untukmu.</p>
              <ShieldCheck className="w-14 h-14 text-emerald-600 shrink-0" />
            </div>
            <p className="mt-3 h-10 rounded-xl border border-emerald-200 bg-white text-sm font-bold text-emerald-700 flex items-center justify-center gap-2"><CheckCircle2 className="w-4 h-4" /> Informasi sudah lengkap</p>
          </Card>

          <Card className="p-4">
            <h2 className="font-extrabold text-[#0F1E4A] mb-1">Butuh Bantuan?</h2>
            <p className="text-sm text-slate-600 font-medium mb-3">Ada pertanyaan tentang profil atau programmu? Hubungi admin bimbel.</p>
            <a href={`https://wa.me/${ADMIN_WA}?text=${encodeURIComponent(`Halo Admin, saya ${STUDENT.name} ingin bertanya tentang profil/program.`)}`} target="_blank" rel="noreferrer"
              className="h-10 rounded-xl border border-blue-200 text-[#1D4ED8] text-sm font-bold flex items-center justify-center gap-2 hover:bg-blue-50">
              <MessageCircle className="w-4 h-4" /> Hubungi Admin
            </a>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
