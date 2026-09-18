const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.MOBILE_TEST_URL || 'http://localhost:3008';
(async () => {
  const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
  try {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const page = await context.newPage();
    await page.goto(base + '/#profile');
    await page.locator('[data-mobile-journey]').waitFor();
    const projects = page.locator('#projects');
    await projects.getByRole('button', { name: '写作', exact: true }).tap();
    const work = projects.locator('a[href="/projects/articles"]');
    await work.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    const before = await page.evaluate(() => scrollY);
    await work.tap();
    await page.waitForURL('**/projects/articles');
    await page.goBack();
    await page.locator('[data-mobile-journey]').waitFor();
    await page.waitForTimeout(500);
    const after = await page.evaluate(() => scrollY);
    console.log({ before, after, url: page.url() });
    assert(Math.abs(after - before) < 8, 'Browser Back restores scrolled position even when URL has an earlier chapter hash');
    assert.equal(await projects.getByRole('button', { name: '写作', exact: true }).getAttribute('aria-pressed'), 'true');
    const fresh = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const direct = await fresh.newPage();
    await direct.goto(base + '/projects/articles?category=short-fiction');
    await direct.reload();
    await direct.getByRole('link', { name: '返回项目作品', exact: false }).tap();
    await direct.waitForURL('**/#projects');
    await direct.locator('[data-mobile-journey]').waitFor();
    await direct.waitForTimeout(500);
    assert(Math.abs(await direct.locator('#projects').evaluate(el => el.getBoundingClientRect().top) - 80) < 8, 'Direct child visit has a stable Projects chapter return');
    console.log('PASS browser Back preserves filter/position; direct child refresh returns to Projects chapter');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
