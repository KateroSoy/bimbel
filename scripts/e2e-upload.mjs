// End-to-end check of a real student file upload, authenticated download, and cleanup.
// Usage: PUPPETEER_EXECUTABLE_PATH=<chrome> node scripts/e2e-upload.mjs [baseUrl]
import puppeteer from 'puppeteer';
import path from 'node:path';

const base = process.argv[2] || 'http://127.0.0.1:3001';
const password = process.env.SEED_PASSWORD || 'LearnSpace#2026';
const photo = path.resolve('public/assets/portal/video-poster.jpg');

async function call(endpoint, token, method = 'GET', body) {
  const response = await fetch(`${base}/api${endpoint}`, {
    method,
    headers: { Accept: 'application/json', ...(body ? { 'Content-Type': 'application/json' } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(`${method} ${endpoint}: ${response.status} ${JSON.stringify(data)}`);
  return data;
}

let assignmentId;
let browser;
let adminToken;
try {
  adminToken = (await call('/auth/login', undefined, 'POST', { email: 'admin@studyhack.id', password })).token;
  const assignment = await call('/r/assignments', adminToken, 'POST', {
    title: `Uji Upload ${Date.now()}`,
    type: 'tugas', mode: 'file', kelas: 'Primary 3', subject: 'Uji Sistem',
    status: 'Aktif', description: 'Berkas uji integrasi yang akan dihapus otomatis.',
  });
  assignmentId = assignment.data.id;

  browser = await puppeteer.launch({
    headless: true,
    ...(process.env.PUPPETEER_EXECUTABLE_PATH ? { executablePath: process.env.PUPPETEER_EXECUTABLE_PATH } : {}),
    args: ['--no-sandbox'],
  });
  const page = await browser.newPage();
  await page.goto(`${base}/login`, { waitUntil: 'networkidle2' });
  await page.type('input[type=email]', 'andi.pratama@email.com');
  await page.type('input[type=password]', password);
  await page.click('button[type=submit]');
  await page.waitForFunction(() => location.pathname === '/siswa/dashboard', { timeout: 15000 });
  await page.goto(`${base}/siswa/tugas/${assignmentId}`, { waitUntil: 'networkidle2' });
  await page.waitForSelector('input[type=file]', { timeout: 15000 });
  await (await page.$('input[type=file]')).uploadFile(photo);
  await page.evaluate(() => [...document.querySelectorAll('button')].find((button) => button.textContent?.includes('Kumpulkan Tugas'))?.click());
  await page.waitForFunction(() => [...document.querySelectorAll('button')].some((button) => button.textContent?.trim() === 'Unduh'), { timeout: 15000 });

  const studentToken = await page.evaluate(() => JSON.parse(localStorage.getItem('LearnSpace+-storage') || '{}')?.state?.token);
  const list = await call('/r/submissions', studentToken);
  const submission = list.data.find((item) => item.assignmentId === assignmentId);
  if (!submission?.hasFile || !submission.id) throw new Error('The uploaded file is missing from the student API.');
  const download = await fetch(`${base}/api/submissions/${encodeURIComponent(submission.id)}/file`, { headers: { Authorization: `Bearer ${studentToken}` } });
  if (!download.ok || (await download.arrayBuffer()).byteLength === 0) throw new Error('Authenticated file download failed.');
  console.log(`Upload and download passed for ${assignmentId}.`);
} finally {
  if (browser) await browser.close();
  if (assignmentId && adminToken) await call(`/r/assignments/${encodeURIComponent(assignmentId)}`, adminToken, 'DELETE');
}
