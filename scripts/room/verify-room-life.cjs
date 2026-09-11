const fs=require('fs'),path=require('path'),Module=require('module'),ts=require('typescript'),React=require('react'),THREE=require('three'),assert=require('node:assert/strict');
global.IS_REACT_ACT_ENVIRONMENT=true; global.DOMRect=class {constructor(x=0,y=0,width=0,height=0){Object.assign(this,{x,y,width,height})}};
const listeners=new Map();
global.window={matchMedia:()=>({matches:false}),addEventListener:(n,f)=>{if(!listeners.has(n))listeners.set(n,new Set());listeners.get(n).add(f)},removeEventListener:(n,f)=>listeners.get(n)?.delete(f)};
global.requestAnimationFrame=()=>0;global.cancelAnimationFrame=()=>{};
const {createRoot,extend,useThree,useFrame}=require('@react-three/fiber');extend(THREE);
const Controls=require('camera-controls').default;Controls.install({THREE});
let orbit,controlProps;
const CameraControls=React.forwardRef(function FakeDomControls(props,ref){
 const camera=useThree(s=>s.camera);const c=React.useMemo(()=>new Controls(camera),[camera]);
 orbit=c;controlProps=props;React.useImperativeHandle(ref,()=>c,[c]);
 React.useEffect(()=>{for(const [k,v] of Object.entries(props))if(k in c&&typeof v!=='function')c[k]=v},[props]);
 useFrame((_,dt)=>c.update(dt),-1);return null;
});
const originalLoad=Module._load;
Module._load=function(name,parent,isMain){if(name==='@react-three/drei')return {CameraControls};if(name.startsWith('@/'))name=path.join(process.cwd(),name.slice(2));return originalLoad.call(this,name,parent,isMain)};
for(const ext of ['.ts','.tsx'])require.extensions[ext]=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true,target:ts.ScriptTarget.ES2020}}).outputText,f);
const {useRoomInteractionController}=require('../../components/leo-room/useRoomInteractionController.ts');
const {RoomCameraControls}=require('../../components/leo-room/RoomCameraControls.tsx');
const {leoRoomOverviewCamera,leoRoomMobileOverviewCamera,leoRoomFocusTargets}=require('../../data/leoRoomCamera.ts');
let interaction,state,registrations=0;
function Harness(){interaction=useRoomInteractionController();return React.createElement(RoomCameraControls,{interaction})}
const act=React.act;
const frame=async(n=360)=>{await act(async()=>{for(let i=0;i<n;i++){for(const sub of state.internal.subscribers)sub.ref.current(state,1/60);await Promise.resolve()}})};
const invoke=async(fn)=>{await act(async()=>fn())};
const pose=()=>({pos:state.camera.position.clone(),target:orbit.getTarget(new THREE.Vector3(),false)});
const equalPose=(a,b)=>a.pos.distanceTo(b.pos)<.002&&a.target.distanceTo(b.target)<.002;
const free=()=>{assert.equal(interaction.interactionState,'FREE_EXPLORE');assert.equal(interaction.activeHotspot,null);assert.equal(interaction.content,null);assert.equal(orbit.enabled,true)};
const esc=()=>{for(const fn of listeners.get('keydown')||[])fn({key:'Escape',type:'keydown',repeat:false,preventDefault(){},stopImmediatePropagation(){}})};
async function run(width){
 let vinylIntent=false;
 const seatedEvents=new Map();const surface={style:{},addEventListener(n,f){if(!seatedEvents.has(n))seatedEvents.set(n,new Set());seatedEvents.get(n).add(f)},removeEventListener(n,f){seatedEvents.get(n)?.delete(f)},setPointerCapture(){},hasPointerCapture(){return false},releasePointerCapture(){}};
 const canvas={style:{},dataset:{},width,height:844,addEventListener(){},removeEventListener(){},getBoundingClientRect:()=>({left:0,top:0,width,height:844}),getContext:()=>({})};
 const gl={domElement:canvas,render(){},setSize(){},setPixelRatio(){},setClearAlpha(){},shadowMap:{},xr:{enabled:false,isPresenting:false,addEventListener(){},removeEventListener(){}},capabilities:{},getPixelRatio:()=>1,dispose(){},forceContextLoss(){},renderLists:{dispose(){}}};
 const root=createRoot(canvas);await root.configure({gl,frameloop:'never',size:{width,height:844,top:0,left:0},camera:{position:[-4.6,7.4,15.7]},onCreated:s=>state=s});await act(async()=>root.render(React.createElement(Harness)));await frame();free();await invoke(()=>state.setEvents({connected:surface}));
 await invoke(()=>interaction.focusHotspot('bookshelf'));await frame();assert.equal(interaction.interactionState,'FOCUSED');assert.equal(interaction.activeHotspot,'bookshelf');assert(pose().target.distanceTo(new THREE.Vector3(...leoRoomFocusTargets.bookshelf.target))<.01);await invoke(esc);free();await invoke(()=>interaction.resetView());await frame();

 const aquariumPose=pose();await invoke(()=>interaction.toggleAquarium());assert.equal(interaction.aquariumBright,false);assert(equalPose(aquariumPose,pose()));await invoke(()=>interaction.toggleAquarium());assert.equal(interaction.aquariumBright,true);
 await invoke(()=>interaction.registerVinylAction(()=>{vinylIntent=!vinylIntent;}));
 await invoke(()=>interaction.interactLivingShelf('lamp'));assert.equal(interaction.shelfLampOn,false);free();
 await invoke(()=>interaction.interactLivingShelf('lamp'));assert.equal(interaction.shelfLampOn,true);
 await invoke(()=>interaction.interactLivingShelf('vinyl'));assert.equal(vinylIntent,true);free();
 await invoke(()=>interaction.interactLivingShelf('drawer'));assert.equal(interaction.drawerOpen,true);free();
 await invoke(()=>interaction.interactLivingShelf('book'));assert.equal(interaction.readingBook,true);free();
 await invoke(()=>interaction.cancelBackground());assert.equal(interaction.readingBook,false);assert.equal(vinylIntent,true);
 await invoke(()=>esc());assert.equal(interaction.drawerOpen,false);free();
 await invoke(()=>interaction.interactLivingShelf('plant'));assert.equal(interaction.plantTouch,1);
 await invoke(()=>interaction.selectLivingShelfItem('vinyl'));assert.equal(interaction.activeLivingShelfItem,'vinyl');
 await invoke(()=>interaction.selectLivingShelfItem('lamp'));assert.equal(interaction.activeLivingShelfItem,'lamp');
 await invoke(()=>interaction.selectLivingShelfItem(null));
 let dismissed=0;const unregisterDismiss=interaction.registerTransientDismiss(()=>{dismissed++;return true;});
 await invoke(()=>interaction.interactLivingShelf('drawer'));const drawerBeforeEscape=interaction.drawerOpen;await invoke(esc);assert.equal(dismissed,1);assert.equal(interaction.drawerOpen,drawerBeforeEscape,'playlist ESC leaked into drawer');unregisterDismiss();await invoke(esc);assert.equal(interaction.drawerOpen,false);
 console.log('PASS Living Shelf: independent state, single selection, drawer ESC, book background close, free camera, vinyl persistence');
 const initial=pose();
 await invoke(()=>interaction.focusHotspot('journey'));assert.equal(interaction.interactionState,'FOCUSING');assert.equal(interaction.previousCameraSnapshot.current.rotation.length,4);await frame(12);
 const interrupted=pose();await invoke(esc);free();await frame();free();assert(equalPose(interrupted,pose()),'dismissed focus retained camera animation');
 await invoke(()=>interaction.focusHotspot('journey'));await frame();assert.equal(interaction.interactionState,'FOCUSED');await invoke(esc);free();
 const modules=[{type:'childhood'},{type:'world'},{type:'desk',selection:{id:'camera',center:[0,1.7,0],size:[.3,.2,.2]}},{type:'photo',id:'existing-photo'}];
 for(let round=0;round<3;round++)for(const content of modules){
  await invoke(()=>interaction.openContent(content));await frame();assert.equal(interaction.interactionState,'CONTENT_OPEN');assert.equal(orbit.enabled,false);await invoke(()=>interaction.interactLivingShelf('vinyl'));assert.equal(vinylIntent,true);
  const before=pose();await invoke(round%2?esc:()=>interaction.returnToExplore());free();await frame();assert(equalPose(before,pose()),content.type+' close moved camera');
  await invoke(()=>orbit.rotate(-.08,0,false));await frame();assert(!equalPose(before,pose()),content.type+' cannot rotate after close');
 }
 // Close a desk transition before it settles: no jump to its queued destination.
 await invoke(()=>interaction.openContent(modules[2]));await frame(8);const mid=pose();await invoke(()=>interaction.returnToExplore());await frame();free();assert(equalPose(mid,pose()),'mid-desk close snapped');
 // Late focus completions must not reopen a module or replace its state.
 await invoke(()=>interaction.focusHotspot('journey'));await frame(5);await invoke(()=>interaction.openContent({type:'world'}));await frame();assert.equal(interaction.content.type,'world');await invoke(esc);await frame();free();
 await invoke(()=>interaction.focusHotspot('gallery'));await frame();await invoke(()=>interaction.cancelBackground());free();
 await invoke(()=>interaction.focusHotspot('journey'));await frame(8);await invoke(()=>interaction.takeCameraControl());await frame();await invoke(esc);free();
 await invoke(()=>interaction.resetView());await frame();free();const overview=width<768?leoRoomMobileOverviewCamera:leoRoomOverviewCamera;assert(state.camera.position.distanceTo(new THREE.Vector3(...overview.position))<.03,'reset wrong position');
 await invoke(esc);free();
 await invoke(()=>interaction.toggleLighting());assert.equal(interaction.lightingMode,'ROOM_LIGHT_OFF');assert.equal(interaction.shelfLampOn,true);
 for(let i=0;i<10;i++)await invoke(()=>interaction.toggleLighting());assert.equal(interaction.lightingMode,'ROOM_LIGHT_OFF');
 await invoke(()=>interaction.beginChairDrag());assert.equal(orbit.enabled,false);const dragPose=pose();await invoke(()=>interaction.moveChair(999));assert.equal(interaction.chairX,1.505);await frame(20);assert(equalPose(dragPose,pose()),'chair moved camera');await invoke(()=>interaction.endChairDrag());free();
 const chairX=interaction.chairX;await invoke(()=>interaction.openContent({type:'childhood'}));await invoke(esc);free();assert.equal(interaction.chairX,chairX);assert.equal(interaction.lightingMode,'ROOM_LIGHT_OFF');
 await invoke(()=>interaction.sitDown());assert.equal(interaction.interactionState,'APPROACHING_SEAT');await frame(width<768?160:120);assert.equal(interaction.interactionState,'SITTING');assert.equal(orbit.enabled,false);assert.equal(state.raycaster.layers.mask,0);assert(Math.abs(state.camera.position.y-1.475)<.002,'wrong seated eye height');
 await invoke(()=>interaction.interactLivingShelf('drawer'));assert.equal(interaction.drawerOpen,false);assert.equal(vinylIntent,true);
 const seatBeforePointer=pose();
 await invoke(()=>{for(const f of seatedEvents.get('pointerdown')||[])f({pointerId:7,clientX:100,clientY:100});for(const f of seatedEvents.get('pointermove')||[])f({pointerId:7,clientX:220,clientY:145});for(const f of seatedEvents.get('pointerup')||[])f({pointerId:7});});await frame(60);assert(!equalPose(pose(),seatBeforePointer),'seated pointer drag failed');assert(pose().pos.distanceTo(seatBeforePointer.pos)<.0001,'seated pointer moved eye');
 const beforeSlider=pose();
 await invoke(()=>{for(const fn of listeners.get('keydown'))fn({key:'ArrowRight',type:'keydown',target:{closest:()=>({})},preventDefault(){},stopImmediatePropagation(){}})});await frame(30);
 assert(equalPose(beforeSlider,pose()),'player keyboard input rotated seated camera');
 const seatedPose=pose();await invoke(()=>interaction.openContent({type:'world'}));await invoke(()=>interaction.focusHotspot('desk'));await invoke(()=>interaction.resetView());assert.equal(interaction.interactionState,'SITTING');
 for(let i=0;i<60;i++)await invoke(()=>{for(const fn of listeners.get('keydown'))fn({key:'ArrowLeft',type:'keydown',preventDefault(){},stopImmediatePropagation(){}})});await frame(60);assert(pose().pos.distanceTo(seatedPose.pos)<.0001,'look moved seated eye');assert(!equalPose(pose(),seatedPose),'look did not turn');
 await invoke(()=>state.setSize(width<768?1280:390,844));await frame(30);assert.equal(interaction.interactionState,'SITTING');assert(pose().pos.distanceTo(seatedPose.pos)<.0001,'resize moved seated eye');assert.equal(orbit.enabled,false);await invoke(()=>state.setSize(width,844));await frame(30);
 await invoke(esc);assert.equal(interaction.interactionState,'STANDING_UP');await frame(width<768?120:90);free();assert.equal(interaction.lightingMode,'ROOM_LIGHT_OFF');assert.equal(interaction.chairX,chairX);assert.equal(state.raycaster.layers.mask,1);
 await invoke(()=>interaction.sitDown());await frame(20);await invoke(esc);await frame(width<768?135:100);free();
 await act(async()=>new Promise(resolve=>setTimeout(resolve,850)));await invoke(()=>interaction.toggleLighting());assert.equal(interaction.lightingMode,'ROOM_LIGHT_ON');
 console.log('PASS life: light debounce, chair clamp/lock/persistence, seated eye, fixed-eye look, hotspot priority, stand/unlock, interrupted sit');
 await act(async()=>root.unmount());assert.equal(listeners.get('keydown').size,0,'keyboard listener leaked');assert.equal(listeners.get('keyup').size,0,'keyup listener leaked');
 console.log('PASS '+width+'px: immediate focus release, focused ESC, all four modules x3, nearby unlock, interrupted desk, stale completion, background cancel, gesture takeover, RESET, ESC free, listener cleanup');
}
(async()=>{await run(1280);await run(320);await run(360);await run(390);await run(430)})().catch(e=>{console.error(e);process.exitCode=1});
