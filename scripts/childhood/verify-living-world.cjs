const assert = require('node:assert/strict');
const fs = require('node:fs'), ts = require('typescript');
require.extensions['.ts'] = (m, f) => m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'), {compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText, f);
const base = '../../components/leo-room/childhood/';
const {ChildhoodEngine,readProgress} = require(base+'engine.ts');
const {IdleDirector} = require(base+'idle.ts');
const {DialogueTrack,characterDelay} = require(base+'dialogue.ts');
const {AmbientLife} = require(base+'ambient.ts');
const {swimPose} = require(base+'swimming.ts');
const {worldX,WORLD_LENGTH,quietZones} = require(base+'layout.ts');
const {smallInteractions,memoryEvents,GROUND,doors,scenes} = require(base+'world.ts');
const none={left:false,right:false,jump:false};
const tick=(g,s,input=none)=>{for(let i=0;i<Math.ceil(s*60);i++)g.update(1/60,input)};
assert.equal(WORLD_LENGTH,8400); assert.equal(quietZones.length,9); assert.equal(memoryEvents.length,24);
for(const x of [0,510,1800,2250,2870,3320,4580]) {
 const migrated=readProgress(JSON.stringify({version:1,scene:'street',x,completed:['arrival']}));
 assert.equal(migrated.layoutVersion,3);assert(migrated.x>=30&&migrated.x<=scenes[migrated.scene].width-30);assert.deepEqual(migrated.completed,['arrival']);assert.deepEqual(readProgress(JSON.stringify(migrated)),migrated);
}
const dialogue=new DialogueTrack();dialogue.start([{speaker:'父亲',text:'别急，汤还热着。',at:0},{speaker:'',text:'慢慢吃。',at:0}]);
dialogue.update(.05);assert.equal(Array.from(dialogue.view.text).length,1);
dialogue.update(.26);dialogue.advance();assert.equal(dialogue.view.text,'别急，汤还热着。');
dialogue.advance();assert.equal(dialogue.index,0);dialogue.update(.33);dialogue.advance();assert.equal(dialogue.index,1);
assert.equal(dialogue.view.text,'');assert(characterDelay('，',1)>.13);assert(characterDelay('。',1)>.22);assert(characterDelay('…',1)>.34);
dialogue.clear();assert(dialogue.done);assert.equal(dialogue.view,null);
const g=new ChildhoodEngine(readProgress(null),()=>.99);
g.x=220;g.interact();tick(g,5);assert(g.encounter,'Reading waits for acknowledgement');g.interact();tick(g,.1);assert(g.completed.includes('arrival'));
g.x=260;g.refreshNearby();assert.equal(g.nearby,null,'Only close objects prompt');
for(const item of smallInteractions.filter(i=>i.kind!=='pet')) {
 g.changeScene(item.scene,item.x);g.interact();assert.equal(g.smallAction?.interaction.id,item.id);
 const completed=[...g.completed];tick(g,.2);assert.deepEqual(g.completed,completed);assert.equal(g.encounter,null);
 const x=g.x;tick(g,1/60,{...none,right:true});assert.equal(g.smallAction,null);assert(g.x>x);
}
for(const facing of [-1,1]) {
 const idle=new IdleDirector(()=>0);for(let i=0;i<230;i++)idle.update(1/60,true,facing,true,true);
 assert.equal(idle.action?.kind,'look-back');assert.equal(idle.action?.facing,facing);assert(idle.action.entrance);
 idle.update(.01,false,facing,true,true);assert.equal(idle.action,null);assert(idle.entranceSeen);
 for(let i=0;i<600;i++)idle.update(1/60,true,facing,true,true);assert.equal(idle.action,null,'No repeated entrance glance');
}
// Same random draw belongs to a normal idle outside Act 05, and a glance inside it.
for(const ending of [false,true]) {
 let values=[0,0,0,0,.15,0];const idle=new IdleDirector(()=>values.shift()??0);
 for(let i=0;i<181;i++)idle.update(1/60,true,1,ending,false);
 assert.equal(idle.action?.kind,ending?'look-back':'look-down');
}
for(const input of [{...none,left:true},{...none,right:true},{...none,jump:true}]) {
 const game=new ChildhoodEngine({...readProgress(null),scene:'schoolroad',x:1480},()=>0);
 tick(game,3.85);assert.equal(game.idle.action?.kind,'look-back');const x=game.x;
 tick(game,1/60,input);assert.equal(game.idle.action,null);
 assert(input.jump ? game.y<GROUND : game.x!==x,'Input affects physics immediately');
}
g.changeScene('street',1000);g.camera=500;g.x=1000;tick(g,.2);assert.equal(g.camera,500);
g.x=1200;tick(g,.2);assert(g.camera>500);g.x=600;tick(g,.2);assert(g.camera<550);
const life=new AmbientLife(()=>0);life.update(.01,375,true,true);assert.equal(life.dogMode,'follow');
for(let i=0;i<190;i++)life.update(1/60,450,true,true);assert.equal(life.dogMode,'sniff');assert(life.dogCooldown>20);
life.pet();assert.equal(life.dogMode,'wag');
const pool = new ChildhoodEngine(readProgress(JSON.stringify({version:1,layoutVersion:2,scene:'reservoir',x:310,completed:[]})));
pool.viewWidth=330;pool.interact();const bank=pool.x;tick(pool,4.5);
assert.equal(pool.encounter?.event.id,'reservoir');assert.equal(pool.x,bank,'Swimming saves a safe bank position');
assert(pool.camera>250,'Mobile camera follows the swimmer');assert.equal(swimPose(4.5).phase,'swim');assert.equal(swimPose(10).phase,'done');
assert.equal(swimPose(10,bank).x,bank,'Swimming returns to the bank');
assert.equal(memoryEvents.filter(e=>e.scene==='street'&&e.x>750).length,0,'Main trail holds entrances, not a queue of story triggers');
for(const scene of ['street','town','market']) {
 const entries=doors.filter(d=>d.scene===scene&&(scene!=='street'||d.x>750)).map(d=>d.x).sort((a,b)=>a-b);
 for(let i=1;i<entries.length;i++)assert(entries[i]-entries[i-1]>=500,`Spaced entrances in ${scene}`);
}
const route=new ChildhoodEngine({...readProgress(null),x:3570});tick(route,1,{...none,right:true});assert.equal(route.scene,'outskirts');assert(route.x<250);
route.changeScene('outskirts',30);tick(route,1,{...none,left:true});assert.equal(route.scene,'street');
for(const [x,scene]of [[2900,'outskirts'],[4000,'town'],[5500,'market'],[8100,'schoolroad']])assert.equal(readProgress(JSON.stringify({version:1,layoutVersion:2,scene:'street',x,completed:['arrival','reservoir']})).scene,scene);
console.log('PASS: distinct places, spaced entrances, bidirectional routes, v1/v2/v3 migration, dialogue reveal/debounce/punctuation, all ordinary actions, rare idle weights, one-shot entrance glance, immediate movement/jump cancellation, camera dead zone, dog follow/cooldown.');
