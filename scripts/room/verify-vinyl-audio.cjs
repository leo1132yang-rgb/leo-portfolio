const fs=require('fs'),ts=require('typescript'),assert=require('node:assert/strict');
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText,f);
const {AudioTransport}=require('../../lib/audio/AudioTransport.ts');
const {vinylTracks}=require('../../data/vinylTracks.ts');
class Media extends EventTarget {constructor(){super();this.src='';this.currentSrc='';this.currentTime=0;this.duration=200;this.paused=true;this.volume=0;this.pending=[];}load(){this.currentSrc=this.src;this.currentTime=0;}play(){this.paused=false;this.dispatchEvent(new Event('playing'));return Promise.resolve();}pause(){this.paused=true;this.dispatchEvent(new Event('pause'));}removeAttribute(){this.src='';}event(n){this.dispatchEvent(new Event(n));}}
const a=new Media();let state,ends=0;const t=new AudioTransport(a,s=>state=s,()=>ends++);
(async()=>{
 for(const track of vinylTracks){assert(fs.existsSync('public'+track.src));t.configure(track.id,track.src,false,.14,false);assert(a.paused);assert.equal(state.key,track.id);}
 const first=vinylTracks[0],second=vinylTracks[1];
 t.configure(first.id,first.src,true,.14,false);await Promise.resolve();assert.equal(state.status,'playing');
 a.currentTime=42;a.event('timeupdate');t.configure(first.id,first.src,false,.14,false);assert.equal(a.currentTime,42);assert(a.paused);
 t.configure(first.id,first.src,true,.14,false);await Promise.resolve();assert.equal(a.currentTime,42);
 t.configure('childhood','/audio/childhood.mp3',true,.1,true);await Promise.resolve();t.configure(first.id,first.src,true,.14,false);a.event('loadedmetadata');assert.equal(a.currentTime,42);
 t.configure(second.id,second.src,true,.14,false);await Promise.resolve();assert.equal(state.key,second.id);assert(!a.paused);
 t.seek(198);assert.equal(a.currentTime,198);a.event('ended');assert.equal(ends,1);
 t.configure(second.id,second.src,false,.14,false);a.event('ended');assert.equal(ends,1);
 a.event('error');assert.equal(state.status,'error');t.configure(first.id,first.src,true,.14,false);await Promise.resolve();assert.equal(state.status,'playing');
 t.dispose();a.event('ended');assert.equal(ends,1);assert(a.paused);assert.equal(a.src,'');
 console.log('PASS: 7 exact local paths; paused/playing switches; SOUND position retention; overlay resume; seek; ended gating; error recovery; listener cleanup; single media element.');
})();
