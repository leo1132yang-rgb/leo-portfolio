const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict'),fs=require('node:fs');
const base=process.env.ROOM_TEST_URL||'http://localhost:3025';
const output='.tools/world-intro-proof';fs.mkdirSync(output,{recursive:true});
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 try{for(const width of (process.env.ROOM_TEST_WIDTHS||'1440,390,320').split(',').map(Number)){
  const context=await browser.newContext({viewport:{width,height:width===1440?960:width===320?568:844},hasTouch:width<768,isMobile:width<768});
  const page=await context.newPage(),errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto(base+'/other-side',{waitUntil:'domcontentloaded'});
  await page.getByRole('heading',{name:'欢迎来到我的世界',exact:true}).waitFor();
  assert((await page.title()).includes('我的世界'));
  const invitation=page.locator('section[aria-labelledby="world-welcome-title"]');
  assert((await invitation.innerText()).includes('90%'));assert((await invitation.innerText()).includes('bug'));
  assert.equal(await page.getByRole('link',{name:'告诉我你的发现'}).getAttribute('href'),'mailto:leoyang1132@outlook.com');
  assert(!(await page.locator('body').innerText()).includes('另一面'));
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await page.screenshot({path:`${output}/intro-cn-${width}.png`});
  await page.getByRole('button',{name:'en',exact:true}).first().click();
  await page.getByRole('heading',{name:'Welcome to Leo’s World',exact:true}).waitFor();
  assert((await invitation.innerText()).includes('90%'));
  if(width<768){await page.getByRole('button',{name:'Open explore navigation',exact:true}).click();assert((await page.locator('.site-nav__mobile.is-open a[href="/other-side"]').innerText()).includes('Leo’s World'));await page.getByRole('button',{name:'Close navigation',exact:true}).click();await page.waitForTimeout(600);}
  else assert.equal(await page.locator('.site-nav__links a[href="/other-side"]').innerText(),'Leo’s World');
  const enterEN=page.getByRole('button',{name:'Enter Leo’s World',exact:true});await enterEN.scrollIntoViewIfNeeded();const box=await enterEN.boundingBox();assert(box.y>=0&&box.y+box.height<=page.viewportSize().height+1);
  await page.screenshot({path:`${output}/intro-en-${width}.png`});
  await page.getByRole('button',{name:'cn',exact:true}).first().click();
  if(width!==320){
   await page.getByRole('button',{name:'进入我的世界',exact:true}).click();
   await page.getByRole('button',{name:'正在进入我的世界…',exact:true}).waitFor({state:'hidden',timeout:120000});
   await page.locator('.leo-room').waitFor();assert.equal(await page.locator('.leo-room__heading h1').innerText(),'我的世界');
   assert.equal(await page.locator('.leo-room__world-entry b').innerText(),'旅行地球');
   if(width<768){await page.getByRole('button',{name:'探索',exact:true}).click();await page.getByRole('button',{name:'旅行地球',exact:true}).click();}
   else{await page.locator('.leo-room__world-entry').click();await page.getByRole('button',{name:'探索旅行地球'}).click();}
   await page.getByRole('heading',{name:'旅行地球',exact:true}).waitFor({timeout:30000});
   await page.keyboard.press('Escape');await page.waitForFunction(()=>document.querySelector('.leo-room')?.dataset.roomState==='FREE_EXPLORE');
  }
  assert.deepEqual(errors,[]);console.log(`PASS ${width}px: CN/EN intro, navigation, title, copy, layout${width!==320?', Room entry, Travel Globe and close recovery':''}`);await context.close();
 }}finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1});
