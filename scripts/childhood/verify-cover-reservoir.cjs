const assert=require('node:assert/strict');
const {chromium}=require('C:/Users/Zachary/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{const browser=await chromium.launch({headless:true,channel:'chrome'});try{
 const page=await browser.newPage({viewport:{width:1320,height:858}}),errors=[],requests=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>requests.push(r.url()));
 await page.addInitScript(()=>localStorage.removeItem('leo-childhood-world-v1'));
 await page.goto('http://localhost:3001/other-side',{waitUntil:'networkidle'});
 await page.getByRole('button',{name:/点击进入我的房间/}).click();await page.getByRole('button',{name:/正在进入房间/}).waitFor({state:'hidden',timeout:90000});
 assert(requests.some(u=>u.includes('/room/childhood-wall/childhood-game-home.webp')));
 assert(!requests.some(u=>u.includes('/room/childhood-wall/childhood-entry.png')));
 // Match the existing wall position at the established desktop viewport.
 await page.setViewportSize({width:1440,height:900});await page.waitForTimeout(300);await page.mouse.click(335,444);
 await page.getByRole('button',{name:/探索童年世界/}).click();await page.getByRole('button',{name:/PRESS START/}).waitFor();
 await page.setViewportSize({width:1320,height:858});await page.waitForTimeout(300);
 await page.screenshot({path:'public/room/childhood-wall/childhood-game-home-source.png'});
 await require('sharp')('public/room/childhood-wall/childhood-game-home-source.png').webp({quality:90}).toFile('public/room/childhood-wall/childhood-game-home.webp');
 const open=async p=>{await page.getByRole('button',{name:"← 返回 Leo's Room",exact:true}).click();await page.evaluate(p=>localStorage.setItem('leo-childhood-world-v1',JSON.stringify({version:1,layoutVersion:3,completed:[],...p})),p);await page.getByRole('button',{name:/探索童年世界/}).click();await page.getByRole('button',{name:/PRESS START|CONTINUE/}).click();};
 await open({scene:'street',x:2150});await page.getByRole('button',{name:/沿小路去水库/}).waitFor();await page.keyboard.press('e');
 await page.getByRole('heading',{name:'水库 · 夏天很长'}).waitFor();
 for(let i=0;i<16;i++){if(await page.getByRole('button',{name:/从岸边下水/}).count())break;await page.keyboard.down('ArrowRight');await page.waitForTimeout(100);await page.keyboard.up('ArrowRight');await page.waitForTimeout(60)}
 await page.getByRole('button',{name:/从岸边下水/}).waitFor();await page.screenshot({path:'scripts/childhood/reservoir-arrival-desktop.png'});
 await page.keyboard.press('e');await page.waitForTimeout(400);await page.keyboard.press('Space');await page.waitForTimeout(400);await page.keyboard.press('e');await page.waitForTimeout(3500);
 await page.screenshot({path:'scripts/childhood/reservoir-swimming-desktop.png'});
 await page.getByText('MEMORY UNLOCKED',{exact:false}).waitFor({timeout:20000});
 await page.getByRole('button',{name:"← 返回 Leo's Room",exact:true}).click();
 const progress=await page.evaluate(()=>JSON.parse(localStorage.getItem('leo-childhood-world-v1')));assert(progress.completed.includes('reservoir'));assert.equal(progress.scene,'reservoir');
 await page.getByRole('button',{name:/探索童年世界/}).click();await page.getByRole('button',{name:/CONTINUE/}).click();
 await page.setViewportSize({width:390,height:844});await page.waitForTimeout(250);await page.keyboard.press('e');await page.waitForTimeout(3500);
 await page.screenshot({path:'scripts/childhood/reservoir-swimming-mobile.png'});
 await open({scene:'reservoir',x:50,completed:['reservoir']});await page.getByRole('button',{name:/回到后山小路/}).waitFor();await page.keyboard.press('e');
 await page.getByRole('heading',{name:'伙伴与自然'}).waitFor();await page.getByRole('button',{name:"← 返回 Leo's Room",exact:true}).click();
 assert.deepEqual(errors,[]);console.log('PASS: actual game-home wall cover, reservoir entrance, walking to jetty, swimming and return, page-6 memory preservation, mobile scene and return path; no browser errors.');
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exit(1)});
