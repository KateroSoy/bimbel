import { toast } from 'sonner';
import type { TutorClass } from '../data/guruPortal';

export type ClassMode = 'Tatap Muka' | 'Online';

/** Class for a schedule entry: sessions name classes loosely ("English Level 1" vs "Batch English Level 1"). */
export const findClass = (kelas: string, classes: TutorClass[]) =>
  classes.find((c) => c.name === kelas) ?? classes.find((c) => c.name.endsWith(kelas) || kelas.endsWith(c.name));

export const modeOf = (c?: Pick<TutorClass, 'mode' | 'room'> | null, room?: string): ClassMode =>
  c?.mode === 'Online' || c?.mode === 'Tatap Muka' ? c.mode : /online|meet/i.test(c?.room ?? room ?? '') ? 'Online' : 'Tatap Muka';

/**
 * "Buka Kelas": a face-to-face class opens attendance for that class,
 * an online class opens its Google Meet link (no attendance step).
 */
export function openClass(c: TutorClass | undefined, navigate: (to: string) => void, room?: string) {
  if (!c) {
    navigate('/guru/absensi');
    return;
  }
  if (modeOf(c, room) === 'Online') {
    if (c.meetUrl) window.open(c.meetUrl, '_blank', 'noopener');
    else toast.info('Link Google Meet belum diatur', { description: `Atur link Meet untuk ${c.name} lewat menu Atur Kelas di Jadwal Mengajar.` });
    return;
  }
  navigate(`/guru/absensi?kelas=${encodeURIComponent(c.id)}`);
}
