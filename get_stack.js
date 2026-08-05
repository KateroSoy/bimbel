import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => {
    console.log('PAGE ERROR:', err.toString());
    console.log('STACK:', err.stack);
  });

  try {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  } catch (e) {
    console.log("Goto error:", e);
  }
  
  await new Promise(r => setTimeout(r, 2000));
  
  await browser.close();
})();
