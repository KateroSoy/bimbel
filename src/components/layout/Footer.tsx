import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Instagram, ExternalLink } from 'lucide-react';
import { CONTACT, LINKS } from '../../lib/contact';

export function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6 0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64 0 3.33 2.76 5.7 5.69 5.7 3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48Z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer id="kontak" className="bg-[#F9F8F9] pt-20 pb-24 border-t border-[#DCE3EE] scroll-mt-24">
      <div className="max-w-[1240px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div className="md:col-span-2 md:pr-8">
            <h4 className="font-bold text-slate-800 text-lg mb-4">{CONTACT.name}</h4>

            <ul className="space-y-4 mb-8 text-sm text-slate-600 font-medium">
              <li className="flex gap-3">
                <MapPin className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <span>{CONTACT.address}</span>
              </li>
              <li className="flex gap-3 items-center">
                <Phone className="w-5 h-5 text-red-500 shrink-0" />
                <a href={`tel:${CONTACT.phone.replace(/\D/g, '')}`} className="hover:text-[#F16710]">{CONTACT.phone}</a>
              </li>
              <li className="flex gap-3 items-center">
                <Mail className="w-5 h-5 text-red-500 shrink-0" />
                <a href={`mailto:${CONTACT.email}`} className="hover:text-[#F16710]">{CONTACT.email}</a>
              </li>
            </ul>

            <div className="flex gap-3">
              <a
                href={LINKS.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram StudyHack"
                className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-pink-600 hover:border-pink-600 transition-colors shadow-xs"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={LINKS.tiktok}
                target="_blank"
                rel="noreferrer"
                aria-label="TikTok StudyHack"
                className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-black hover:border-black transition-colors shadow-xs"
              >
                <TikTokIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-800 text-lg mb-4">Lokasi Kami</h4>
            <a
              href={CONTACT.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="block rounded-xl overflow-hidden bg-slate-200 aspect-[4/3] shadow-inner border border-slate-300 relative group"
            >
              <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=400&h=300" className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500" alt="Peta lokasi StudyHack" />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-xs p-2.5 rounded-full shadow-lg">
                <MapPin className="w-6 h-6 text-red-600" />
              </div>
              <div className="absolute bottom-2 left-2 right-2 bg-white/95 rounded-lg py-1 px-2 text-[11px] font-bold text-slate-800 text-center flex items-center justify-center gap-1 shadow-xs">
                Buka Google Maps <ExternalLink className="w-3 h-3" />
              </div>
            </a>
          </div>
        </div>

        <div className="pt-8 border-t border-[#DCE3EE] text-center flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 font-medium text-xs">
            © {new Date().getFullYear()} {CONTACT.name}. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs font-semibold text-slate-500">
            <Link to="/#faq" className="hover:text-slate-900">Kebijakan Privasi</Link>
            <span>•</span>
            <Link to="/#faq" className="hover:text-slate-900">Syarat & Ketentuan</Link>
            <span>•</span>
            <Link to="/login" className="text-blue-600 font-bold hover:underline">Portal LMS</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
