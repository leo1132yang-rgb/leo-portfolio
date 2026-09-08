const assert=require('node:assert/strict');
const {chromium}=require('C:/Users/Zachary/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{const browser=await chromium.launch({headless:true,channel:'chrome'});try{
 const page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>localStorage.setItem('leo-childhood-world-v1',JSON.stringify({version:1,layoutVersion:3,scene:'home',x:270,completed:[]})));
 await page.goto('http://localhost:3001/other-side',{waitUntil:'networkidle'});
 await page.getByRole('button',{name:/点击进入我的房间/}).click();await page.getByRole('button',{name:/正在进入房间/}).waitFor({state:'hidden',timeout:90000});
 await page.mouse.click(335,444);await page.getByRole('button',{name:/探索童年世界/}).click();await page.getByRole('button',{name:/PRESS START/}).click();
 await page.getByRole('heading',{name:'白马李家 · 爷爷的厨房'}).waitFor();await page.keyboard.press('e');await page.waitForTimeout(2400);
 await page.screenshot({path:'scripts/childhood/kitchen-cooking-browser.png'});
 const open=async(scene,x,completed=[])=>{
  await page.getByRole('button',{name:"← 返回 Leo's Room",exact:true}).click();await page.getByRole('dialog',{name:'Leo 的童年像素世界'}).waitFor({state:'hidden'});
  await page.evaluate(p=>localStorage.setItem('leo-childhood-world-v1',JSON.stringify({version:1,layoutVersion:3,...p})),{scene,x,completed});
  await page.getByRole('button',{name:/探索童年世界/}).click();await page.getByRole('button',{name:/PRESS START|CONTINUE/}).click();await page.waitForTimeout(450);
 };
 for(const [scene,x,target,spawn] of [['home',687,'street',135],['arcade',1767,'town',220],['reservoir',1167,'street',2110],['bedroom',687,'kitchen',550]]) {
  await open(scene,x,['arrival']);await page.keyboard.down('ArrowRight');await page.waitForTimeout(550);await page.keyboard.up('ArrowRight');
  await page.getByRole('button',{name:"← 返回 Leo's Room",exact:true}).click();
  const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('leo-childhood-world-v1')));
  assert.equal(saved.scene,target);assert(Math.abs(saved.x-spawn)<110);assert(saved.completed.includes('arrival'));
  await page.getByRole('button',{name:/探索童年世界/}).click();await page.getByRole('button',{name:/CONTINUE/}).click();
 }
 await open('gandong',700);await page.keyboard.press('e');await page.waitForTimeout(2500);await page.screenshot({path:'scripts/childhood/trade-clean-browser.png'});
 await open('street',85);await page.screenshot({path:'scripts/childhood/wood-sign-browser.png'});
 await open('home',670);await page.setViewportSize({width:390,height:844});await page.waitForTimeout(350);
 await page.screenshot({path:'scripts/childhood/kitchen-return-mobile.png'});
 const right=page.getByRole('button',{name:'向右移动'});await right.hover();await page.mouse.down();await page.waitForTimeout(650);await page.mouse.up();
 await page.getByRole('heading',{name:'白马李家',exact:true}).waitFor();
 assert.deepEqual(errors,[]);console.log('PASS: kitchen cooking, four parent entrances by walking right, saved memories, clean trade gesture, wood signs and mobile walking exit; no browser errors.');
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exit(1)});
