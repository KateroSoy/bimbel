/** Lesson content as edited by tutors (Materi & Modul) and shown to students (Kursus & Materi). */

export interface ExampleItem { question: string; answer: string }
export interface PracticeItem { question: string; options: string[]; answer: number }
export interface Attachment { name: string; url?: string; size?: string }

/** Turns a YouTube / Google Drive / direct video link into something an iframe or <video> can play. */
export function videoEmbed(url?: string | null): { kind: 'iframe' | 'video'; src: string } | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, '');
    if (host === 'youtu.be') return { kind: 'iframe', src: `https://www.youtube.com/embed/${u.pathname.slice(1)}` };
    if (host.endsWith('youtube.com')) {
      const id = u.searchParams.get('v') ?? u.pathname.match(/\/(?:embed|shorts|live)\/([\w-]+)/)?.[1];
      return id ? { kind: 'iframe', src: `https://www.youtube.com/embed/${id}` } : null;
    }
    if (host === 'drive.google.com') {
      const id = u.pathname.match(/\/file\/d\/([\w-]+)/)?.[1] ?? u.searchParams.get('id');
      return id ? { kind: 'iframe', src: `https://drive.google.com/file/d/${id}/preview` } : null;
    }
    if (/\.(mp4|webm|ogg)$/i.test(u.pathname)) return { kind: 'video', src: url };
    return { kind: 'iframe', src: url };
  } catch {
    return null;
  }
}

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null;

/** "Penjelasan" bullet points (catatan lessons). */
export const notePoints = (notes: unknown): string[] =>
  Array.isArray(notes) ? notes.filter((n): n is string => typeof n === 'string' && n.trim() !== '') : [];

export const exampleItems = (notes: unknown): ExampleItem[] =>
  Array.isArray(notes)
    ? notes.filter(isObj).map((n) => ({ question: String(n.question ?? ''), answer: String(n.answer ?? '') })).filter((n) => n.question)
    : [];

export const practiceItems = (notes: unknown): PracticeItem[] =>
  Array.isArray(notes)
    ? notes.filter(isObj).map((n) => ({
      question: String(n.question ?? ''),
      options: Array.isArray(n.options) ? n.options.map(String).filter(Boolean) : [],
      answer: Number(n.answer ?? 0),
    })).filter((n) => n.question && n.options.length >= 2)
    : [];

export const attachments = (files: unknown): Attachment[] =>
  Array.isArray(files) ? files.filter(isObj).map((f) => ({ name: String(f.name ?? 'Lampiran'), url: f.url ? String(f.url) : undefined, size: f.size ? String(f.size) : undefined })) : [];
