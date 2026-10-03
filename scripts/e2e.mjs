// Browser smoke test against a running app (SPA + API). Logs in through the real form as each role,
// opens every page, and fails on page errors, console errors or API responses >= 400.
// Usage: node scripts/e2e.mjs [baseUrl] [screenshotDir]     (default http://127.0.0.1:3107)
import puppeteer from 'puppeteer';
import fs from 'node:fs';
import path from 'node:path';

const BASE = process.argv[2] || 'http://127.0.0.1:3107';
const SHOTS = process.argv[3];
const PASSWORD = process.env.SEED_PASSWORD || 'LearnSpace#2026';
if (SHOTS) fs.mkdirSync(SHOTS, { recursive: true });

const ROUTES = {
  admin: ['dashboard', 'notifikasi', 'siswa', 'pendaftaran', 'ortu', 'guru', 'jadwal-tutor', 'kehadiran-tutor', 'beban', 'course', 'kelas', 'jadwal-kelas', 'ruang',
    'keuangan', 'pembayaran', 'piutang', 'pengeluaran', 'honor', 'laporan-keuangan', 'whatsapp', 'inventaris', 'laporan', 'pengumuman', 'pengaturan', 'alumni'],
  guru: ['dashboard', 'kelas', 'kelas/1', 'jadwal', 'course', 'course/kelola', 'tugas', 'tugas/1', 'absensi', 'siswa', 'nilai', 'nilai/input', 'progress-siswa', 'bank-soal',
    'ai-bahan-ajar', 'pengumuman', 'pesan', 'profil', 'pengaturan'],
  siswa: ['dashboard', 'jadwal', 'course', 'course/math-p3', 'tugas', 'tugas/1', 'nilai', 'absensi', 'spp', 'profil', 'pengaturan', 'pengumuman', 'sertifikat'],
};
const ACCOUNTS = { admin: 'admin@studyhack.id', guru: 'budi.santoso@studyhack.id', siswa: 'andi.pratama@email.com' };

const failures = [];
const fail = (msg) => { failures.push(msg); console.log(`  FAIL ${msg}`); };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await puppeteer.launch({ headless: true });

async function newPage(viewport = { width: 1536, height: 1024 }) {
  const context = await browser.createBrowserContext();
  const page = await context.newPage();
  await page.setViewport(viewport);
  page.problems = [];
  page.on('pageerror', (e) => page.problems.push(`pageerror: ${e.message}`));
  page.on('console', (m) => { if (m.type() === 'error' && !m.text().includes('favicon')) page.problems.push(`console: ${m.text().slice(0, 200)}`); });
  page.on('response', (r) => { if (r.url().includes('/api/') && r.status() >= 400) page.problems.push(`api ${r.status()} ${r.request().method()} ${r.url().replace(BASE, '')}`); });
  return page;
}

async function login(page, email, password = PASSWORD) {
  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle2' });
  await page.type('input[type=email]', email);
  await page.type('input[type=password]', password);
  await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle2' }).catch(() => undefined), page.click('button[type=submit]')]);
  await sleep(800);
}

const heading = (page) => page.evaluate(() => (document.querySelector('main h1, main h2')?.textContent || '').trim().slice(0, 40));

// ---- 1. guards
{
  console.log('Guards');
  const page = await newPage();
  await page.goto(`${BASE}/admin/siswa`, { waitUntil: 'networkidle2' });
  if (!page.url().endsWith('/login')) fail(`guest reached ${page.url()}`);
  await login(page, ACCOUNTS.siswa, 'wrong-password');
  if (!page.url().endsWith('/login')) fail('wrong password logged in');
  if (!(await page.evaluate(() => document.body.innerText.includes('Email atau password salah')))) fail('no error shown for wrong password');
  page.problems.length = 0; // the 422 above is expected
  await page.evaluate(() => { document.querySelectorAll('input').forEach((i) => { i.value = ''; }); });
  await page.reload({ waitUntil: 'networkidle2' });
  await login(page, ACCOUNTS.siswa);
  if (!page.url().endsWith('/siswa/dashboard')) fail(`student landed on ${page.url()}`);
  await page.goto(`${BASE}/admin/siswa`, { waitUntil: 'networkidle2' });
  await sleep(500);
  if (!page.url().endsWith('/siswa/dashboard')) fail(`student could open admin page: ${page.url()}`);
  await page.close();
}

// ---- 2. every page of every role
for (const [role, routes] of Object.entries(ROUTES)) {
  console.log(`Pages: ${role}`);
  const page = await newPage();
  await login(page, ACCOUNTS[role]);
  for (const route of routes) {
    page.problems.length = 0;
    await page.goto(`${BASE}/${role}/${route}`, { waitUntil: 'networkidle2' });
    await sleep(900);
    const title = await heading(page);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 2);
    if (!title) fail(`${role}/${route}: no heading rendered`);
    if (overflow) fail(`${role}/${route}: horizontal overflow`);
    for (const problem of new Set(page.problems)) fail(`${role}/${route}: ${problem}`);
    if (SHOTS) await page.screenshot({ path: path.join(SHOTS, `${role}-${route.replace(/\//g, '_')}.png`) });
    console.log(`  ${role}/${route} — ${title}`);
  }
  await page.close();
}

// ---- 3. a write through the UI survives a reload (admin adds a guardian)
{
  console.log('Persistence through the UI');
  const page = await newPage();
  await login(page, ACCOUNTS.admin);
  await page.goto(`${BASE}/admin/ortu`, { waitUntil: 'networkidle2' });
  await sleep(800);
  const name = `Wali Uji ${Date.now()}`;
  await page.evaluate(() => [...document.querySelectorAll('main button')].find((b) => b.textContent.includes('Tambah Orang Tua'))?.click());
  await page.waitForSelector('[role=dialog] form');
  const fields = await page.$$('[role=dialog] form input');
  await fields[0].type(name);
  await fields[1].type('Siswa Uji');
  await fields[2].type('081200001111');
  await page.click('[role=dialog] form button[type=submit]');
  await sleep(1200);
  await page.reload({ waitUntil: 'networkidle2' });
  await sleep(1200);
  await page.type('main input[placeholder^="Cari nama orang tua"]', name);
  await sleep(400);
  if (!(await page.evaluate((n) => document.querySelector('main table')?.innerText.includes(n), name))) fail('guardian added through the UI is missing after reload');
  for (const problem of new Set(page.problems)) fail(`ui write: ${problem}`);
  await page.close();
}

await browser.close();
console.log(failures.length ? `\n${failures.length} problem(s)` : '\nAll browser checks passed');
process.exit(failures.length ? 1 : 0);
