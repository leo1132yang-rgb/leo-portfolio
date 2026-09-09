const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const base=process.env.WORLD_TEST_URL||'http://localhost:3021';
const out=path.resolve('.tools/world-proof');fs.mkdirSync(out,{recursive:true});
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--enable-unsafe-webgpu']});
 const report=[];
 try{for(const width of (process.env.WORLD_WIDTHS||"1440,390").split(",").map(Number)){
  const context=await browser.newContext({viewport:{width,height:width===1440?960:844},isMobile:width<768,hasTouch:width<768,deviceScaleFactor:1});
  const page=await context.newPage(),errors=[],http=[];
  page.on('pageerror',e=>{errors.push(e.message);console.log('PAGE ERROR',e.stack)});page.on('response',r=>{if(r.status()>=400&&r.url().startsWith(base))http.push([r.status(),r.url()]);});
  await page.goto(base+'/world/index.html#skip',{waitUntil:'domcontentloaded'});
  try{await page.waitForFunction(()=>window.game?.reveal?.step===2,null,{timeout:90000});}catch(e){console.log('START FAILURE',await page.evaluate(()=>({text:document.body.innerText.slice(-1000),ready:document.body.dataset.leoReady,step:window.game?.reveal?.step,elapsed:window.game?.ticker?.elapsed,keys:window.game?Object.keys(game):[]})));await page.screenshot({path:path.join(out,`failed-${width}.png`)});throw e;}await page.waitForTimeout(2000);
  assert.equal(await page.locator('canvas.js-canvas').count(),1);
  await page.screenshot({path:path.join(out,`world-${width}.png`)});
  const before=await page.evaluate(()=>({x:game.player.position.x,z:game.player.position.z}));
  if(width===1440){await page.keyboard.down('w');await page.waitForTimeout(2200);await page.keyboard.up('w');}
  else{const cdp=await context.newCDPSession(page);await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:220,y:620}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:220,y:450}]});await page.waitForTimeout(2500);await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});}
  const after=await page.evaluate(()=>({x:game.player.position.x,z:game.player.position.z}));assert(Math.hypot(before.x-after.x,before.z-after.z)>1,'Car did not move');
  await page.locator('.leo-hud [data-action="garage"]').click();await page.waitForTimeout(1300);
  for(const id of ['rally','tourer','electric']){await page.locator(`[data-car="${id}"]`).click();assert.equal(await page.locator('body').getAttribute('data-vehicle'),id);}
  await page.screenshot({path:path.join(out,`garage-${width}.png`)});
  await page.locator('.leo-tabs [data-tab="career"]').click();assert((await page.locator('.leo-timeline article').count())===7);assert((await page.locator('.leo-timeline').innerText()).includes('500'));
  await page.locator('.leo-tabs [data-tab="photos"]').click();assert.equal(await page.locator('.leo-cards button').count(),29);await page.locator('.leo-cards button').first().click();await page.locator('.leo-photo-large').evaluate(img=>img.decode());
  await page.locator('.leo-tabs [data-tab="memories"]').click();assert(await page.locator('.leo-memory').count()>5);await page.locator('.leo-memory summary').first().click();assert((await page.locator('.leo-memory[open]').innerText()).length>100);
  await page.locator('.leo-tabs [data-tab="missions"]').click();await page.getByRole('textbox',{name:'旅途便签'}).fill('在 Leo 的世界绕了一点远路。');await page.locator('[data-action="note"]').click();assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('leo-world-note'))),'在 Leo 的世界绕了一点远路。');
  await page.locator('.menu .js-close').first().click();await page.waitForTimeout(1500);assert(await page.evaluate(()=>game.inputs.filters.has('wandering')),'Menu did not release driving');
  await page.locator('.leo-hud [data-action="map"]').click();await page.waitForTimeout(1200);await page.locator('.map .location').filter({hasText:'作品工坊'}).click();await page.waitForTimeout(2500);
  assert(await page.evaluate(()=>game.player.position.distanceTo(game.respawns.getByName('projects').position)<10),'Map did not travel');
  await page.evaluate(()=>game.world.areas.projects.open());await page.waitForTimeout(2500);await page.screenshot({path:path.join(out,`projects-${width}.png`)});await page.keyboard.press('Escape');await page.waitForTimeout(1800);assert(await page.evaluate(()=>game.inputs.filters.has('wandering')));
  if(width===1440){await page.evaluate(()=>game.player.respawn('circuit'));await page.waitForTimeout(2500);await page.evaluate(()=>game.world.areas.circuit.restart());await page.waitForFunction(()=>game.world.areas.circuit.state===3,null,{timeout:25000});await page.keyboard.down('w');await page.waitForTimeout(2000);await page.keyboard.up('w');assert(await page.evaluate(()=>game.world.areas.circuit.timer.elapsedTime>0));await page.evaluate(()=>game.world.areas.circuit.finish(true));await page.waitForTimeout(2000);}
  const perf=await page.evaluate(()=>new Promise(resolve=>{let frames=0;const t=performance.now();const tick=()=>{frames++;if(performance.now()-t>=3000)resolve({fps:Math.round(frames*1000/(performance.now()-t)),quality:game.quality.level,pixelRatio:game.viewport.pixelRatio,backend:game.rendering.renderer.backend.constructor.name});else requestAnimationFrame(tick)};requestAnimationFrame(tick)}));
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'Horizontal overflow');assert.deepEqual(errors,[]);assert.deepEqual(http,[]);
  report.push({width,driving:true,garage:true,career:true,photos:true,notes:true,map:true,close:true,...perf,errors,http});console.log('PASS',JSON.stringify(report.at(-1)));await context.close();
 }}finally{fs.writeFileSync(path.join(out,'verification.json'),JSON.stringify(report,null,2));await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
