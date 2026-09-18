const fs=require('fs'),assert=require('assert');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const out='artifacts/mobile-journey',base=process.env.MOBILE_TEST_URL||'http://localhost:3008';
fs.mkdirSync(out,{recursive:true});
(async()=>{
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 const results=[],errors=[];const record=x=>{results.push(x);console.log(x)};
 try{
  for(const width of [390,320,430]){
   const context=await browser.newContext({viewport:{width,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:1});
   const page=await context.newPage();const requests=[];page.on('request',r=>requests.push(r.url()));page.on('pageerror',e=>errors.push(e.message));
   await page.goto(base,{waitUntil:'domcontentloaded',timeout:120000});await page.locator('[data-mobile-journey]').waitFor({timeout:120000});await page.locator('[data-timeline-entry]').last().waitFor();
   assert.deepEqual(await page.locator('[data-mobile-chapter]').evaluateAll(nodes=>nodes.map(n=>n.dataset.mobileChapter)),['home','profile','projects','world']);
   assert.equal(await page.locator('main').count(),1);assert.equal(await page.locator('header.site-nav').count(),1);assert.equal(await page.locator('footer.site-footer').count(),1);assert.equal(await page.locator('[data-timeline-entry]').count(),7);
   assert.equal(await page.locator('canvas,iframe,.leo-room').count(),0);assert.equal(await page.locator('.sound-toggle').count(),0);assert(await page.locator('audio').evaluate(el=>el.paused));assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   const historyLength=await page.evaluate(()=>history.length);
   await page.screenshot({path:`${out}/home-${width}.png`});
   const cdp=await context.newCDPSession(page);
   const swipe=async()=>{await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:width-18,y:720}]});for(let i=1;i<=6;i++){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:width-18,y:720-i*80}]});await page.waitForTimeout(18)}await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await page.waitForTimeout(180)};
   await swipe();assert(await page.evaluate(()=>scrollY)>150);
   for(const chapter of ['profile','projects','world']){
    for(let i=0;i<40;i++){const top=await page.locator('#'+chapter).evaluate(el=>el.getBoundingClientRect().top);if(top<innerHeightFallback())break;await page.mouse.wheel(0,650);await page.waitForTimeout(70)}
    assert(await page.locator('#'+chapter).evaluate(el=>el.getBoundingClientRect().top)<844,chapter+' reachable by native scroll');
    if(chapter==='profile'){await page.locator('#profile').screenshot({path:`${out}/profile-${width}.png`});}
    if(chapter==='projects'){
      const projects=page.locator('#projects');await projects.locator('.projects-gallery__filters').scrollIntoViewIfNeeded();await projects.getByRole('button',{name:'写作',exact:true}).tap();const work=projects.locator('a[href="/projects/articles"]');await work.scrollIntoViewIfNeeded();await page.waitForTimeout(200);const before=await page.evaluate(()=>scrollY);await page.screenshot({path:`${out}/projects-${width}.png`});await work.tap();await page.waitForURL('**/projects/articles');await page.getByRole('link',{name:'返回项目作品',exact:false}).tap();await page.waitForURL('**/#projects');await page.locator('[data-mobile-journey]').waitFor();await page.waitForTimeout(400);assert.equal(await page.locator('#projects').getByRole('button',{name:'写作',exact:true}).getAttribute('aria-pressed'),'true');console.log('return debug',before,await page.evaluate(()=>({y:scrollY,saved:sessionStorage.getItem('leo-mobile-journey-v1'),hero:document.getElementById('home').offsetHeight,projectTop:document.getElementById('projects').offsetTop})));assert(Math.abs(await page.evaluate(()=>scrollY)-before)<8,'Project return must restore position');
      await page.locator('#projects').getByRole('button',{name:'全部',exact:true}).tap();
    }
   }
   await page.locator('#world').screenshot({path:`${out}/world-${width}.png`});
   assert.equal(await page.locator('canvas,iframe,.leo-room').count(),0);assert(!requests.some(url=>/\.(glb|gltf|ktx2)(\?|$)|childhood-game|rapier.*wasm/.test(url)),'No room or game assets before entering');assert(await page.locator('audio').evaluate(el=>el.paused));
   assert(await page.locator('video').evaluate(el=>el.paused),'Offscreen hero video is paused');
   const scrollables=await page.locator('[data-mobile-chapter], [data-mobile-chapter] section').evaluateAll(nodes=>nodes.filter(el=>['auto','scroll'].includes(getComputedStyle(el).overflowY)&&el.scrollHeight>el.clientHeight+2).map(el=>el.id||el.className));assert.deepEqual(scrollables,[]);
   record(width+'px: four chapters, native touch/scroll, seven records, no overflow, project filter/position restored, no early Room/assets/audio');
   if(width===390){
    const enter=page.getByRole('button',{name:'进入我的世界',exact:false});await enter.scrollIntoViewIfNeeded();await page.waitForTimeout(200);const worldY=await page.evaluate(()=>scrollY);await enter.tap();await page.waitForURL('**/other-side?enter=1&from=mobile-home');await page.locator('.leo-room').waitFor({timeout:180000});await page.locator('[class*="directLoading"]').waitFor({state:'detached',timeout:180000});assert.equal(await page.getByRole('button',{name:'进入我的世界',exact:true}).count(),0);await page.screenshot({path:out+'/room-entered-390.png'});await page.getByRole('link',{name:'退出房间',exact:false}).tap();await page.waitForURL('**/#world');await page.locator('[data-mobile-journey]').waitFor();await page.waitForTimeout(500);console.log('world return',worldY,await page.evaluate(()=>({y:scrollY,saved:sessionStorage.getItem('leo-mobile-journey-v1')})));assert(Math.abs(await page.evaluate(()=>scrollY)-worldY)<8,'Room exit position');assert.equal(await page.locator('.leo-room,canvas').count(),0);assert(await page.locator('audio').evaluate(el=>el.paused));await page.screenshot({path:out+'/room-return-390.png'});record('Actual Room loaded after click; no repeated invitation; exit returns to World cover position');
   }
   await page.locator('header.site-nav').getByRole('button',{name:'en',exact:true}).evaluate(el=>el.click());assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));assert.equal(await page.locator('[data-timeline-entry]').count(),7);await page.locator('#world').screenshot({path:`${out}/world-en-${width}.png`});
   await page.getByRole('button',{name:'Open explore navigation',exact:true}).evaluate(el=>el.click());await page.locator('.site-nav__mobile').getByRole('link',{name:/02.*Profile/}).tap();await page.waitForFunction(()=>Math.abs(document.getElementById('profile').getBoundingClientRect().top)<120,{},{timeout:5000});assert.equal(new URL(page.url()).hash,'#profile');assert(await page.evaluate(()=>history.length)<=historyLength+4);record(width+'px English and chapter navigation');
   await context.close();
  }
  const desktop=await browser.newContext({viewport:{width:1440,height:1000}});const page=await desktop.newPage();await page.goto(base,{waitUntil:'domcontentloaded'});await page.locator('.leo-hero').waitFor();assert.equal(await page.locator('[data-mobile-journey]').count(),0);assert.equal(await page.locator('main').count(),1);assert.equal(await page.locator('header.site-nav a[href="/profile"]').count(),1);await page.screenshot({path:out+'/desktop-home.png'});await page.goto(base+'/profile');await page.locator('[data-timeline-entry]').last().waitFor();assert.equal(await page.locator('[data-timeline-entry]').count(),7);assert.equal(await page.locator('main').count(),1);await page.goto(base+'/projects');assert.equal(await page.locator('.projects-gallery__card').count(),6);record('Desktop retains independent Homepage/Profile/Projects routes and seven records/six categories');
  assert.equal(errors.length,0);fs.writeFileSync(out+'/browser-check.json',JSON.stringify({results,errors},null,2));
 }catch(e){fs.writeFileSync(out+'/browser-check.json',JSON.stringify({results,errors,failure:String(e)},null,2));throw e}finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
function innerHeightFallback(){return 720;}
