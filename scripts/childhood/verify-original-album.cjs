const assert=require('node:assert/strict'),fs=require('node:fs'),ts=require('typescript');
require.extensions['.ts']=(module,file)=>module._compile(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText,file);
const {memoryEvents}=require('../../components/leo-room/childhood/world.ts');
const {chromium}=require('C:/Users/Zachary/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{const browser=await chromium.launch({headless:true,channel:'chrome'});try{
 const page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(completed=>localStorage.setItem('leo-childhood-world-v1',JSON.stringify({version:1,layoutVersion:3,scene:'street',x:220,completed})),memoryEvents.map(e=>e.id));
 await page.goto('http://localhost:3001/other-side',{waitUntil:'networkidle'});await page.getByRole('button',{name:/点击进入我的房间/}).click();await page.getByRole('button',{name:/正在进入房间/}).waitFor({state:'hidden',timeout:90000});
 await page.mouse.click(335,444);await page.getByRole('button',{name:/探索童年世界/}).click();await page.getByRole('button',{name:/CONTINUE/}).click();
 await page.getByRole('button',{name:'打开童年记忆册',exact:true}).click();
 await page.getByRole('dialog',{name:"LEO'S CHILDHOOD",exact:true}).waitFor();
 assert.equal(await page.getByRole('dialog',{name:'互动回看'}).count(),0,'Original album opens directly');
 assert.equal(await page.locator('.childhood-reader__segments button').count(),18);
 assert.equal(await page.locator('.childhood-reader__segments button:disabled').count(),0);
 await page.locator('img[alt="Leo\'s Childhood 01"]').waitFor();await page.screenshot({path:'scripts/childhood/restored-original-album.png'});
 for(let i=1;i<=18;i++){
  const id=String(i).padStart(2,'0');
  const response=await page.request.get('http://localhost:3001/room/childhood-story/web/'+id+'.webp');
  assert(response.ok());assert((await response.body()).equals(fs.readFileSync('public/room/childhood-story/web/'+id+'.webp')),`Original page ${id} served unchanged`);
 }
 await page.getByRole('button',{name:'第 18 页',exact:true}).click();await page.locator('img[alt="Leo\'s Childhood 18"]').waitFor();await page.waitForTimeout(500);
 await page.keyboard.press('Escape');await page.getByRole('dialog',{name:"LEO'S CHILDHOOD",exact:true}).waitFor({state:'hidden'});
 await page.getByRole('button',{name:'菜单',exact:true}).click();await page.getByRole('button',{name:'打开记忆册 (18 / 18)',exact:true}).click();await page.getByRole('dialog',{name:"LEO'S CHILDHOOD",exact:true}).waitFor();
 await page.setViewportSize({width:390,height:844});await page.waitForTimeout(300);await page.screenshot({path:'scripts/childhood/restored-original-album-mobile.png'});
 await page.getByRole('button',{name:'返回童年世界',exact:true}).click();await page.getByRole('button',{name:'菜单',exact:true}).click();await page.getByRole('button',{name:/回看已完成的互动/}).click();await page.getByRole('dialog',{name:'互动回看',exact:true}).waitFor();
 await page.getByRole('button',{name:'返回童年世界',exact:true}).click();await page.getByRole('button',{name:"← 返回 Leo's Room",exact:true}).click();
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('leo-childhood-world-v1')));assert.equal(saved.completed.length,24);assert.deepEqual(errors,[]);
 console.log('PASS: HUD and menu directly open original 18-page album; all original page bytes intact, page 18 navigation, mobile reader, separate interaction review, Escape and saved progress.');
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exit(1)});
