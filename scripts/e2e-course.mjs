// Browser check for course authoring, enrollment, and student visibility.
// Usage: PUPPETEER_EXECUTABLE_PATH=<chrome> node scripts/e2e-course.mjs [baseUrl]
import puppeteer from 'puppeteer';

const base = process.argv[2] || 'http://127.0.0.1:3001';
const password = process.env.SEED_PASSWORD || 'LearnSpace#2026';
const title = `Uji Course ${Date.now()}`;
let browser;
let courseId;
let adminToken;

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

async function login(page, email) {
  await page.goto(`${base}/login`, { waitUntil: 'networkidle2' });
  await page.type('input[type=email]', email);
  await page.type('input[type=password]', password);
  await page.click('button[type=submit]');
  await page.waitForFunction(() => location.pathname.endsWith('/dashboard'), { timeout: 15000 });
}

try {
  adminToken = (await call('/auth/login', undefined, 'POST', { email: 'admin@studyhack.id', password })).token;
  browser = await puppeteer.launch({
    headless: true,
    ...(process.env.PUPPETEER_EXECUTABLE_PATH ? { executablePath: process.env.PUPPETEER_EXECUTABLE_PATH } : {}),
    args: ['--no-sandbox'],
  });
  const admin = await browser.newPage();
  const errors = [];
  admin.on('pageerror', (error) => errors.push(error.message));
  await login(admin, 'admin@studyhack.id');
  await admin.goto(`${base}/admin/course-digital`, { waitUntil: 'networkidle2' });
  await admin.waitForSelector('[data-testid=add-course]');
  await admin.click('[data-testid=add-course]');
  await admin.waitForSelector('[data-testid=course-form]');
  await admin.type('[data-testid=course-form] input', title);
  await admin.select('[data-testid=course-form] select', 'Published');
  await admin.click('[data-testid=course-form] button[type=submit]');
  await admin.waitForFunction((name) => [...document.querySelectorAll('h2')].some((heading) => heading.textContent === name) && !document.querySelector('[data-testid=course-form]'), { timeout: 15000 }, title);

  const courses = await call('/r/courses', adminToken);
  courseId = courses.data.find((course) => course.title === title)?.id;
  if (!courseId) throw new Error('The course was not persisted.');
  await admin.waitForSelector('[data-testid=add-module]');
  await admin.click('[data-testid=add-module]');
  await admin.waitForSelector('[data-testid=module-form]');
  await admin.type('[data-testid=module-form] input', 'Bab Uji');
  await admin.click('[data-testid=module-form] button[type=submit]');
  await admin.waitForFunction(() => [...document.querySelectorAll('h3')].some((heading) => heading.textContent === 'Bab Uji') && !document.querySelector('[data-testid=module-form]'), { timeout: 15000 });

  let modules = await call(`/courses/${courseId}/modules`, adminToken);
  const moduleId = modules.data.find((item) => item.title === 'Bab Uji')?.id;
  if (!moduleId) throw new Error('The module was not persisted.');
  await admin.click(`[data-testid="add-lesson-${moduleId}"]`);
  await admin.waitForSelector('[data-testid=lesson-form]');
  await admin.type('[data-testid=lesson-form] input', 'Materi Uji');
  await admin.click('[data-testid=lesson-form] button[type=submit]');
  await admin.waitForFunction(() => document.body.textContent.includes('Materi Uji') && !document.querySelector('[data-testid=lesson-form]'), { timeout: 15000 });
  modules = await call(`/courses/${courseId}/modules`, adminToken);
  if (!modules.data.some((item) => item.lessons.some((lesson) => lesson.title === 'Materi Uji'))) throw new Error('The lesson was not persisted.');

  await admin.waitForSelector('[data-testid=enrollment-form] select');
  const studentId = await admin.$eval('[data-testid=enrollment-form] select', (select) => [...select.options].find((option) => option.textContent.includes('Andi Pratama'))?.value);
  if (!studentId) throw new Error('The seeded student is unavailable for enrollment.');
  await admin.select('[data-testid=enrollment-form] select', studentId);
  await admin.click('[data-testid=enrollment-form] button[type=submit]');
  await admin.waitForFunction((id) => [...document.querySelectorAll('li')].some((item) => item.textContent?.includes(id)), { timeout: 15000 }, studentId);

  const studentToken = (await call('/auth/login', undefined, 'POST', { email: 'andi.pratama@email.com', password })).token;
  const portal = await call('/student/portal', studentToken);
  const course = portal.courses.find((item) => item.id === courseId);
  if (!course?.chapters.some((chapter) => chapter.lessons.some((lesson) => lesson.title === 'Materi Uji'))) throw new Error('The published content is absent from the student portal.');
  await admin.evaluate(() => localStorage.clear());
  await login(admin, 'andi.pratama@email.com');
  await admin.goto(`${base}/siswa/course`, { waitUntil: 'networkidle2' });
  await admin.waitForFunction((name) => document.body.textContent.includes(name), { timeout: 15000 }, title);
  if (errors.length) throw new Error(`Browser errors: ${errors.join('; ')}`);
  console.log(`Course, module, lesson, enrollment, and student portal passed for ${courseId}.`);
} finally {
  if (browser) await browser.close();
  if (courseId && adminToken) await call(`/r/courses/${encodeURIComponent(courseId)}`, adminToken, 'DELETE');
}
