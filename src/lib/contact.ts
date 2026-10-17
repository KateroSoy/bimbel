import { api } from './api';

/** Official StudyHack contact details and outbound links, used by the landing page and the portals. */
export const CONTACT = {
  name: 'StudyHack Education Center',
  phone: '0812-8591-7614',
  whatsapp: '6281285917614',
  email: 'help.studyhack@gmail.com',
  address: 'Jl. Denai No. 152, Tegal Sari Mandala III, Medan Denai, Kota Medan',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Jl.+Denai+No.+152,+Tegal+Sari+Mandala+III,+Medan+Denai,+Kota+Medan',
  director: 'Muhammad Heikal Hasan, S.T., M.Eng., M.P.A.',
};

export const LINKS = {
  instagram: 'https://www.instagram.com/studyhack_education?obrf=Y2tzNTd4Z3o3dmhq&utm_source=qr',
  tiktok: 'https://www.tiktok.com/@studyhack_education?_r=1&_t=ZS-9AZqO9hQTBt',
  lynk: 'https://lynk.id/studyhack26',
};

export const whatsappUrl = (text: string) => `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`;

// Google Drive folder with the app installer: set by admin (Pengaturan Lembaga) or VITE_APP_DOWNLOAD_URL.
let appUrl: Promise<string> | null = null;
function appDownloadUrl(): Promise<string> {
  const fromEnv = import.meta.env.VITE_APP_DOWNLOAD_URL as string | undefined;
  if (fromEnv) return Promise.resolve(fromEnv);
  appUrl ??= api.get<{ data: { appDownloadUrl: string | null } }>('/public/info')
    .then((r) => r.data.appDownloadUrl ?? '')
    .catch(() => { appUrl = null; return ''; });
  return appUrl;
}

/** Opens the app download folder, or explains that the link is not configured yet. */
export function openAppDownload(onMissing: () => void) {
  // Open the tab synchronously so pop-up blockers allow it, then point it at the link.
  const tab = window.open('', '_blank');
  void appDownloadUrl().then((url) => {
    if (url && tab) { tab.opener = null; tab.location.href = url; }
    else { tab?.close(); onMissing(); }
  });
}
