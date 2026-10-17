import type { jsPDF } from 'jspdf';
import { CONTACT } from './contact';

/** PDF reports on the StudyHack letterhead (A4, mm). jsPDF is loaded only when a report is generated. */

const MARGIN = 18;
const PAGE_W = 210;
const PAGE_H = 297;
const NAVY: [number, number, number] = [15, 30, 74];
const LETTERHEAD_BLUE: [number, number, number] = [127, 149, 194];

export interface ReportSection {
  title?: string;
  head: string[];
  body: (string | number)[][];
  /** Column widths in mm (optional) */
  widths?: (number | 'auto')[];
  align?: ('left' | 'center' | 'right')[];
}

export interface ReportSpec {
  filename: string;
  title: string;
  subtitle?: string;
  /** Label/value pairs printed under the title, two per row */
  identity: [string, string][];
  sections: ReportSection[];
  /** Free text printed after the tables (e.g. tutor note) */
  note?: { title: string; text: string };
}

let emblem: Promise<string | null> | null = null;
function loadEmblem(): Promise<string | null> {
  emblem ??= fetch('/assets/brand/studyhack-emblem.png')
    .then((r) => (r.ok ? r.blob() : Promise.reject()))
    .then((blob) => new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    }))
    .catch(() => null);
  return emblem;
}

function letterhead(doc: jsPDF, logo: string | null) {
  if (logo) doc.addImage(logo, 'PNG', MARGIN, 10, 24, 20.3);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(32, 62, 140);
  doc.text('Study', MARGIN + 4.5, 34);
  doc.setTextColor(241, 103, 16);
  doc.text('Hack', MARGIN + 4.5 + doc.getTextWidth('Study'), 34);

  doc.setTextColor(...LETTERHEAD_BLUE);
  doc.setFontSize(21);
  doc.text('STUDYHACK EDUCATION CENTER', MARGIN + 29, 22);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(150, 150, 150);
  doc.text(CONTACT.address, MARGIN + 29, 28.5);
  doc.setFontSize(8.5);
  doc.text(`Telp/WA ${CONTACT.phone}  ·  ${CONTACT.email}`, MARGIN + 29, 33);

  doc.setDrawColor(250, 205, 170);
  doc.setLineWidth(0.7);
  doc.line(MARGIN, 38, PAGE_W - MARGIN, 38);
}

const CONTENT_TOP = 46;

function newPage(doc: jsPDF, logo: string | null): number {
  doc.addPage();
  letterhead(doc, logo);
  return CONTENT_TOP;
}

function signature(doc: jsPDF, logo: string | null, y: number) {
  // Keep the signature block together on one page
  if (y > PAGE_H - 52) y = newPage(doc, logo);
  doc.setTextColor(30, 30, 30);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Medan, ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`, MARGIN, y);
  y += 24;
  doc.setFont('helvetica', 'bold');
  doc.text(CONTACT.director, MARGIN, y);
  doc.setFont('helvetica', 'normal');
  doc.text('Direktur', MARGIN, y + 5);
  doc.setFont('helvetica', 'bold');
  doc.text(CONTACT.name, MARGIN, y + 10);
}

/** Builds the PDF and triggers the download. */
export async function downloadReport(spec: ReportSpec): Promise<void> {
  const [{ jsPDF }, { autoTable }, logo] = await Promise.all([import('jspdf'), import('jspdf-autotable'), loadEmblem()]);
  const doc = new jsPDF({ unit: 'mm', format: 'a4', compress: true });
  const last = () => (doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? 0;

  letterhead(doc, logo);
  let y = 50;
  doc.setTextColor(...NAVY);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(spec.title, PAGE_W / 2, y, { align: 'center' });
  if (spec.subtitle) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.text(spec.subtitle, PAGE_W / 2, y + 6, { align: 'center' });
  }
  y += spec.subtitle ? 13 : 8;

  // Identity block, two pairs per row
  const rows: string[][] = [];
  for (let i = 0; i < spec.identity.length; i += 2) {
    const [a, b] = [spec.identity[i], spec.identity[i + 1]];
    rows.push([a[0], `: ${a[1]}`, b?.[0] ?? '', b ? `: ${b[1]}` : '']);
  }
  autoTable(doc, {
    startY: y, body: rows, theme: 'plain', margin: { left: MARGIN, right: MARGIN },
    styles: { fontSize: 9.5, cellPadding: 0.8, textColor: [30, 30, 30] },
    columnStyles: { 0: { cellWidth: 32 }, 1: { fontStyle: 'bold' }, 2: { cellWidth: 30 } },
  });
  y = last() + 6;

  for (const section of spec.sections) {
    if (y > PAGE_H - 40) y = newPage(doc, logo);
    if (section.title) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(...NAVY);
      doc.text(section.title, MARGIN, y);
      y += 2.5;
    }
    const columnStyles: Record<number, { cellWidth?: number | 'auto'; halign?: 'left' | 'center' | 'right' }> = {};
    section.head.forEach((_, i) => {
      columnStyles[i] = { cellWidth: section.widths?.[i] ?? 'auto', halign: section.align?.[i] ?? 'left' };
    });
    autoTable(doc, {
      startY: y, head: [section.head], body: section.body.map((r) => r.map(String)), margin: { top: CONTENT_TOP, left: MARGIN, right: MARGIN },
      theme: 'grid', styles: { fontSize: 9, cellPadding: 1.8, lineColor: [200, 205, 215], lineWidth: 0.2, textColor: [30, 30, 30] },
      headStyles: { fillColor: [234, 241, 255], textColor: NAVY, fontStyle: 'bold' },
      columnStyles,
      // Pages the table spills onto get the letterhead too
      didDrawPage: (data) => { if (data.pageNumber > 1) letterhead(doc, logo); },
    });
    y = last() + 8;
  }

  if (spec.note) {
    if (y > PAGE_H - 60) y = newPage(doc, logo);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(...NAVY);
    doc.text(spec.note.title, MARGIN, y);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(40, 40, 40);
    const lines = doc.splitTextToSize(spec.note.text, PAGE_W - MARGIN * 2 - 6);
    const h = lines.length * 4.6 + 5;
    doc.setDrawColor(200, 205, 215);
    doc.rect(MARGIN, y + 2, PAGE_W - MARGIN * 2, h);
    doc.text(lines, MARGIN + 3, y + 7);
    y += h + 12;
  }

  signature(doc, logo, y + 4);

  const pages = doc.getNumberOfPages();
  for (let p = 1; p <= pages; p++) {
    doc.setPage(p);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Dokumen dibuat dari LearnSpace+ · Halaman ${p} dari ${pages}`, PAGE_W / 2, PAGE_H - 8, { align: 'center' });
  }
  doc.save(`${spec.filename}.pdf`);
}
