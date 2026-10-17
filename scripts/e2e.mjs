// Browser smoke test against a running app (SPA + API). Logs in through the real form as each role,
// opens every page, and fails on page errors, console errors or API responses >= 400.
// Usage: node scripts/e2e.mjs [baseUrl] [screenshotDir]     (default http://127.0.0.1:3107)
import puppeteer from 'puppeteer';
import fs from 'node:fs';
import path from 'node:path';

const BASE = process.argv[2] || 'http://127.0.0.1:3107';
const SHOTS = process.argv[3];
const PASSWORD = process.env.SEED_PASSWORD || 'LearnSpace#2026';
const VIEWPORT = process.env.E2E_VIEWPORT === 'mobile' ? { width: 390, height: 844 } : { width: 1536, height: 1024 };
if (SHOTS) fs.mkdirSync(SHOTS, { recursive: true });

const ROUTES = {
  admin: ['dashboard', 'notifikasi', 'siswa', 'pendaftaran', 'ortu', 'guru', 'jadwal-tutor', 'kehadiran-tutor', 'beban', 'course', 'course-digital', 'kelas', 'jadwal-kelas', 'ruang',
    'keuangan', 'pembayaran', 'piutang', 'pengeluaran', 'honor', 'laporan-keuangan', 'whatsapp', 'inventaris', 'laporan', 'laporan-siswa', 'laporan-kelas', 'laporan-tutor', 'laporan-operasional', 'pengumuman', 'pengaturan', 'alumni', 'tes-dasar'],
  guru: ['dashboard', 'kelas', 'kelas/1', 'course', 'tugas', 'tugas/1', 'tugas?tab=rekap', 'absensi', 'siswa', 'nilai', 'progress-siswa', 'bank-soal',
    'ai-bahan-ajar', 'pengumuman', 'pesan', 'profil', 'pengaturan'],
  siswa: ['dashboard', 'jadwal', 'course', 'course/math-p3', 'tugas', 'tugas/1', 'katalog-tes', 'toefl', 'nilai', 'absensi', 'spp', 'profil', 'pengaturan', 'pengumuman', 'sertifikat'],
};
const ACCOUNTS = { admin: 'admin@studyhack.id', guru: 'budi.santoso@studyhack.id', siswa: 'andi.pratama@email.com' };

const failures = [];
const fail = (msg) => { failures.push(msg); console.log(`  FAIL ${msg}`); };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await puppeteer.launch({
  headless: true,
  ...(process.env.PUPPETEER_EXECUTABLE_PATH ? { executablePath: process.env.PUPPETEER_EXECUTABLE_PATH } : {}),
  args: ['--no-sandbox'],
});

async function newPage(viewport = VIEWPORT) {
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
  await page.click('button[type=submit]');
  await page.waitForFunction(() => location.pathname !== '/login' || document.body.innerText.includes('Email atau password salah'), { timeout: 10000 });
  await sleep(400);
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
    if (SHOTS) await page.screenshot({ path: path.join(SHOTS, `${role}-${route.replace(/[/?=]/g, '_')}.png`) });
    console.log(`  ${role}/${route} — ${title}`);
  }
  await page.close();
}

// ---- 3. public website: landing, program detail, sign-up form reaching the admin
{
  console.log('Public website');
  const page = await newPage();
  for (const route of ['/', '/program/math-essential', '/karir']) {
    page.problems.length = 0;
    await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle2' });
    await sleep(700);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 2);
    if (overflow) fail(`${route}: horizontal overflow`);
    for (const problem of new Set(page.problems)) fail(`${route}: ${problem}`);
    if (SHOTS) await page.screenshot({ path: path.join(SHOTS, `public${route.replace(/\//g, '_') || '_home'}.png`), fullPage: route === '/' });
    console.log(`  ${route}`);
  }
  const child = `Calon Uji ${Date.now()}`;
  page.problems.length = 0;
  await page.goto(`${BASE}/program/math-essential`, { waitUntil: 'networkidle2' });
  const inputs = await page.$$('#daftar form input:not([name=website])');
  await inputs[0].type(child);
  await inputs[2].type('Wali Uji');
  await inputs[3].type('081299990000');
  await page.click('#daftar form button[type=submit]');
  await page.waitForFunction(() => document.body.innerText.includes('Pendaftaran terkirim'), { timeout: 10000 }).catch(() => fail('sign-up form did not confirm'));
  for (const problem of new Set(page.problems)) fail(`sign-up: ${problem}`);
  await page.close();

  const admin = await newPage();
  await login(admin, ACCOUNTS.admin);
  const found = await admin.evaluate(async (n) => {
    const token = JSON.parse(localStorage.getItem('LearnSpace+-storage') || '{}')?.state?.token;
    const headers = { Accept: 'application/json', Authorization: `Bearer ${token}` };
    const row = (await (await fetch(`/api/r/registrations?q=${encodeURIComponent(n)}`, { headers })).json()).data.find((r) => r.name === n);
    if (!row) return 'missing';
    await fetch(`/api/r/registrations/${encodeURIComponent(row.id)}`, { method: 'DELETE', headers });
    return row.source;
  }, child);
  if (found !== 'Website') fail(`website sign-up not found in admin registrations (${found})`);
  await admin.close();
}

// ---- 4. a write through the UI survives a reload (admin adds a guardian)
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
  const cleaned = await page.evaluate(async (n) => {
    const token = JSON.parse(localStorage.getItem('LearnSpace+-storage') || '{}')?.state?.token;
    const headers = { Accept: 'application/json', Authorization: `Bearer ${token}` };
    const list = await fetch(`/api/r/guardians?q=${encodeURIComponent(n)}`, { headers });
    if (!list.ok) return false;
    const row = (await list.json()).data.find((item) => item.name === n);
    if (!row) return false;
    return (await fetch(`/api/r/guardians/${encodeURIComponent(row.id)}`, { method: 'DELETE', headers })).ok;
  }, name);
  if (!cleaned) fail('could not clean up guardian created by browser test');
  for (const problem of new Set(page.problems)) fail(`ui write: ${problem}`);
  await page.close();
}

await browser.close();
console.log(failures.length ? `\n${failures.length} problem(s)` : '\nAll browser checks passed');
process.exit(failures.length ? 1 : 0);
