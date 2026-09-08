// Deterministic render inspection uses the exact current renderer and unchanged source atlases.
const fs=require('node:fs'),path=require('node:path'),ts=require('typescript');
const {chromium}=require('C:/Users/Zachary/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=path.resolve('components/leo-room/childhood'),modules={};
for(const name of ['engine','world','layout','dialogue','idle','ambient','render','lifeRender','swimming','placeRender']) modules['./'+name]=ts.transpileModule(fs.readFileSync(path.join(root,name+'.ts'),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020,esModuleInterop:true}}).outputText;
for(const name of ['spriteBounds','propBounds']) modules['./'+name+'.json']='module.exports='+fs.readFileSync(path.join(root,name+'.json'),'utf8');
(async()=>{const browser=await chromium.launch({headless:true,channel:'chrome'});try{
 const page=await browser.newPage({viewport:{width:1440,height:600}});
 await page.route('**/childhood-game/*.webp',r=>r.fulfill({contentType:'image/webp',body:fs.readFileSync(path.resolve('public/childhood-game',r.request().url().split('/').pop()))}));
 await page.route('**/art-check',r=>r.fulfill({contentType:'text/html',body:'<html><body style="margin:0;background:#091519"><canvas width="1440" height="600"></canvas></body></html>'}));
 await page.goto('http://localhost:3001/art-check');
 await page.evaluate(async modules=>{
  const cache={};const req=id=>{if(!cache[id]){const m={exports:{}};cache[id]=m;new Function('module','exports','require',modules[id])(m,m.exports,req)}return cache[id].exports};
  const {ChildhoodEngine,readProgress}=req('./engine');window.g=new ChildhoodEngine(readProgress(null));window.draw=req('./render').drawWorld;
  window.art=Object.fromEntries(await Promise.all(['countryside','town','interiors','characters','father-memory','props','reservoir','nature-places','outskirts','town-block','market-block','arcade-room','heng-room','gandong-room','grandpa-kitchen'].map(async name=>{const img=new Image();img.src='/childhood-game/'+name+'.webp';await img.decode();return [name,img]})));
 },modules);
 for(const scene of ['street','outskirts','town','market','playground','orchard','grove','station','arcade','heng','gandong','schoolroad']){
  await page.evaluate(scene=>{g.changeScene(scene,900);g.camera=scene==='street'?0:180;g.time=5;g.transition=0;draw(document.querySelector('canvas').getContext('2d'),art,g,1440,600,false)},scene);
  await page.screenshot({path:'scripts/childhood/place-'+scene+'.png'});
 }
 for(const [scene,x,id,t] of [['home',270,null,0],['home',270,'grandpa-cooks',3],['home',460,'grandpa-shares',3],['street',85,null,0],['gandong',700,'gandong-day',3]]) {
  await page.evaluate(([scene,x,id,t])=>{g.changeScene(scene,x);g.completed=['grandpa-cooks'];g.camera=0;g.time=t;g.transition=0;if(id){g.interact();g.encounter.elapsed=t}draw(document.querySelector('canvas').getContext('2d'),art,g,1440,600,false)},[scene,x,id,t]);
  await page.screenshot({path:'scripts/childhood/fix-'+(id||scene)+'.png'});
 }
 await page.setViewportSize({width:1200,height:600});await page.evaluate(()=>{document.querySelector('canvas').width=1200});
 for(const t of [0,1.7,4.6,8.8,10]) {
  await page.evaluate(t=>{g.changeScene('reservoir',310);g.interact();g.encounter.elapsed=t;g.camera=0;g.transition=0;g.time=t;draw(document.querySelector('canvas').getContext('2d'),art,g,1200,600,false)},t);
  await page.screenshot({path:`scripts/childhood/checked-reservoir-${t}.png`});
 }
 console.log('PASS: place backgrounds, kitchen cooking/sharing, wood signs, trade gesture and reservoir frames captured.');
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exit(1)});
