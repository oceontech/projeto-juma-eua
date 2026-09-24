const { chromium } = require('C:/Users/Dell G15/AppData/Local/npm-cache/_npx/361ceb562f3b3235/node_modules/playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  for (const [name, width, height, reducedMotion] of [
    ['desktop', 1920, 1080, 'no-preference'],
    ['mobile', 390, 844, 'reduce'],
  ]) {
    const context = await browser.newContext({ viewport: { width, height }, reducedMotion });
    await context.addCookies([{ name: 'locale', value: 'pt', url: 'http://localhost:3100' }]);
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto('http://localhost:3100/kmep', { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(1200);
    const stage = page.locator('.tj-stage');
    const top = await stage.evaluate(el => el.getBoundingClientRect().top + window.scrollY);
    await page.evaluate(y => window.scrollTo(0, y), top - 400);
    await page.waitForTimeout(1500);
    await page.screenshot({ path: `output/imagegen/soil-${name}-seam.png` });
    await page.evaluate(y => window.scrollTo(0, y), top + (width > 1000 ? 1700 : 0));
    await page.waitForTimeout(1500);
    await page.screenshot({ path: `output/imagegen/soil-${name}-section.png` });
    const css = await stage.evaluate(el => ({ background: getComputedStyle(el, '::before').backgroundImage, overflow: document.documentElement.scrollWidth > innerWidth, base: getComputedStyle(el).backgroundColor }));
    const response = await page.request.get('http://localhost:3100/img/kmep/soil-transition-2k.png');
    console.log(JSON.stringify({ name, css, asset: response.status(), errors }));
    await context.close();
  }
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
