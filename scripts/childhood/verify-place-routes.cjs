const assert=require('node:assert/strict');
const {chromium}=require('C:/Users/Zachary/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{const browser=await chromium.launch({headless:true,channel:'chrome'});try{
 const page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>localStorage.setItem('leo-childhood-world-v1',JSON.stringify({version:1,layoutVersion:3,scene:'street',x:950,completed:[]})));
 await page.goto('http://localhost:3001/other-side',{waitUntil:'networkidle'});await page.getByRole('button',{name:/点击进入我的房间/}).click();await page.getByRole('button',{name:/正在进入房间/}).waitFor({state:'hidden',timeout:90000});
 await page.mouse.click(335,444);await page.getByRole('button',{name:/探索童年世界/}).click();await page.getByRole('button',{name:/PRESS START/}).click();
 await page.getByRole('button',{name:/走进树荫下的空地/}).waitFor();await page.keyboard.press('e');await page.getByRole('heading',{name:'树荫下的空地'}).waitFor();
 const open=async(scene,x,completed=[])=>{await page.getByRole('button',{name:"← 返回 Leo's Room",exact:true}).click();await page.evaluate(p=>localStorage.setItem('leo-childhood-world-v1',JSON.stringify({version:1,layoutVersion:3,...p})),{scene,x,completed});await page.getByRole('button',{name:/探索童年世界/}).click();await page.getByRole('button',{name:/PRESS START|CONTINUE/}).click();await page.waitForTimeout(300)};
 await open('street',3570);await page.keyboard.down('ArrowRight');await page.waitForTimeout(700);await page.keyboard.up('ArrowRight');await page.getByRole('heading',{name:'从田野走向县城'}).waitFor();await page.screenshot({path:'scripts/childhood/route-outskirts-desktop.png'});
 await open('outskirts',1770);await page.keyboard.down('ArrowRight');await page.waitForTimeout(700);await page.keyboard.up('ArrowRight');await page.getByRole('heading',{name:'老街 · 游戏厅与恒源祥'}).waitFor();
 await open('town',265);await page.getByRole('button',{name:/走进游戏机厅/}).waitFor();await page.keyboard.press('e');await page.getByRole('heading',{name:'游戏机厅 · 父亲的第一间店'}).waitFor();
 await open('arcade',900);await page.keyboard.press('e');await page.waitForTimeout(400);await page.keyboard.press('Space');await page.waitForTimeout(400);await page.keyboard.press('e');await page.getByText('MEMORY UNLOCKED',{exact:false}).waitFor({timeout:15000});
 await open('orchard',1000);await page.setViewportSize({width:390,height:844});await page.waitForTimeout(500);await page.screenshot({path:'scripts/childhood/place-orchard-mobile.png'});assert(await page.getByRole('button',{name:'向右移动'}).isEnabled());
 await open('market',1770);await page.keyboard.down('ArrowRight');await page.waitForTimeout(700);await page.keyboard.up('ArrowRight');await page.getByRole('heading',{name:'新的家与学校'}).waitFor();
 await page.getByRole('button',{name:"← 返回 Leo's Room",exact:true}).click();assert.deepEqual(errors,[]);console.log('PASS: spaced trail entrance, distinct place, countryside/outskirts/town route transitions, enter arcade and unlock original memory, mobile orchard, school road and exit.');
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exit(1)});
