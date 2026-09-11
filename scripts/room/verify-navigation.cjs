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
const {ROOM_LAYOUT}=require("../../data/leoRoomDimensions.ts");
const {constrainRoomCamera,sweepRoomCamera}=require("../../components/leo-room/roomSpatialBounds.ts");
const crossed=sweepRoomCamera({x:0,y:.7,z:-1},{x:0,y:.7,z:3.8},0.82);
assert(crossed.z<.3,'camera tunneled through desk');
assert(constrainRoomCamera({x:20,y:-2,z:-20},0.82).y>=.38,'floor guard failed');
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
 const canvas={style:{},dataset:{},width,height:844,addEventListener(){},removeEventListener(){},getBoundingClientRect:()=>({left:0,top:0,width,height:844}),getContext:()=>({})};
 const gl={domElement:canvas,render(){},setSize(){},setPixelRatio(){},setClearAlpha(){},shadowMap:{},xr:{enabled:false,isPresenting:false,addEventListener(){},removeEventListener(){}},capabilities:{},getPixelRatio:()=>1,dispose(){},forceContextLoss(){},renderLists:{dispose(){}}};
 const root=createRoot(canvas);await root.configure({gl,frameloop:'never',size:{width,height:844,top:0,left:0},camera:{position:[-4.6,7.4,15.7]},onCreated:s=>state=s});await act(async()=>root.render(React.createElement(Harness)));await frame();free();
 const initial=pose();
 assert(controlProps.truckSpeed>0,'panning disabled');
 for(const id of ['journey','gallery','desk','bookshelf','vinyl','collection','lounge']){
  await invoke(()=>interaction.focusHotspot(id));await frame();assert.equal(interaction.interactionState,'FOCUSED',id+' failed to settle');
  assert(pose().target.distanceTo(new THREE.Vector3(...leoRoomFocusTargets[id].target))<.03,id+' target mismatch '+JSON.stringify(pose().target.toArray()));
  const guarded=constrainRoomCamera(pose().pos,interaction.chairX);assert(pose().pos.distanceTo(new THREE.Vector3(guarded.x,guarded.y,guarded.z))<.01,id+' obstructed camera');
  if(id==='journey'){
   state.camera.updateMatrixWorld();
   for(const x of [-2.84,2.84])for(const y of [-1.85,1.85]){
    const point=new THREE.Vector3(x,y,.19).multiplyScalar(ROOM_LAYOUT.journey.scale).applyAxisAngle(new THREE.Vector3(0,1,0),ROOM_LAYOUT.journey.yaw).add(new THREE.Vector3(...ROOM_LAYOUT.journey.position)).project(state.camera);
    assert(Math.abs(point.x)<.96&&Math.abs(point.y)<.96,'Childhood cropped at '+width+'px '+point.toArray());
   }
  }
  const before=pose();await invoke(()=>orbit.rotate(.08,.03,false));await invoke(()=>interaction.takeCameraControl());await frame();assert.equal(interaction.activeHotspot,id,'inspect lost on adjustment');assert(!equalPose(before,pose()),'inspect camera locked');
  const adjusted=pose();await invoke(esc);await frame();free();assert(equalPose(adjusted,pose()),id+' inspect close jumped '+JSON.stringify({before:adjusted.pos.toArray(),after:pose().pos.toArray(),bt:adjusted.target.toArray(),at:pose().target.toArray()}));
 }
 await invoke(()=>orbit.truck(.7,0,false));await frame();const panned=pose();assert(panned.target.distanceTo(new THREE.Vector3(...leoRoomFocusTargets.lounge.target))>.3,'truck did not translate target');
 await invoke(()=>interaction.resetView());await frame();
 await invoke(()=>interaction.focusHotspot('journey'));assert.equal(interaction.interactionState,'FOCUSING');assert.equal(interaction.previousCameraSnapshot.current.rotation.length,4);await frame(12);
 const interrupted=pose();await invoke(esc);free();await frame();assert(equalPose(interrupted,pose()),'interrupted focus did not retain nearby pose');
 await invoke(()=>interaction.focusHotspot('journey'));await frame();assert.equal(interaction.interactionState,'FOCUSED');await invoke(esc);free();
 const modules=[{type:'childhood'},{type:'world'},{type:'desk',selection:{id:'camera',center:[0,1.7,0],size:[.3,.2,.2]}},{type:'photo',id:'existing-photo'}];
 for(let round=0;round<3;round++)for(const content of modules){
  await invoke(()=>interaction.openContent(content));await frame();assert.equal(interaction.interactionState,'CONTENT_OPEN');assert.equal(orbit.enabled,false);
  const before=pose();await invoke(round%2?esc:()=>interaction.returnToExplore());free();await frame();assert(equalPose(before,pose()),content.type+' close moved camera');
  await invoke(()=>orbit.rotate(-.08,0,false));await frame();assert(!equalPose(before,pose()),content.type+' cannot rotate after close');
 }
 // Close a desk transition before it settles: no jump to its queued destination.
 await invoke(()=>interaction.openContent(modules[2]));await frame(8);const mid=pose();await invoke(()=>interaction.returnToExplore());await frame();free();assert(equalPose(mid,pose()),'mid-desk close snapped');
 // Late focus completions must not reopen a module or replace its state.
 await invoke(()=>interaction.focusHotspot('journey'));await frame(5);await invoke(()=>interaction.openContent({type:'world'}));await frame();assert.equal(interaction.content.type,'world');await invoke(esc);await frame();free();
 await invoke(()=>interaction.focusHotspot('gallery'));await frame();await invoke(()=>interaction.cancelBackground());free();
 await invoke(()=>interaction.focusHotspot('journey'));await frame(8);await invoke(()=>interaction.takeCameraControl());await frame();assert.equal(interaction.interactionState,'FOCUSED');await invoke(esc);free();
 await invoke(()=>interaction.resetView());await frame();free();const overview=width<768?leoRoomMobileOverviewCamera:leoRoomOverviewCamera;assert(state.camera.position.distanceTo(new THREE.Vector3(...overview.position))<.03,'reset wrong position');
 await invoke(esc);free();
 await act(async()=>root.unmount());assert.equal(listeners.get('keydown').size,0,'keyboard listener leaked');assert.equal(listeners.get('keyup').size,0,'keyup listener leaked');
 console.log('PASS '+width+'px: seven inspect areas, panning, nearby cancel, focused ESC, all four modules x3, nearby unlock, interrupted desk, stale completion, background cancel, gesture takeover, RESET, ESC free, listener cleanup');
}
(async()=>{await run(1280);await run(390);await run(320)})().catch(e=>{console.error(e);process.exitCode=1});
