// Geometry + handler regression in R3F. Loads the actual flat GLB geometry;
// browser checks cover materials, visual appearance and the real camera.
const fs = require('fs');
const path = require('path');
const Module = require('module');
const ts = require('typescript');
const React = require('react');
const THREE = require('three');
const rootDir = process.cwd();
const testWidth = Number(process.argv[2] || 1280);
global.IS_REACT_ACT_ENVIRONMENT = true;
const listeners = new Map();
global.window = { devicePixelRatio: 1, addEventListener: (name, fn) => { const set=listeners.get(name)||new Set(); set.add(fn);listeners.set(name,set); }, removeEventListener:(name,fn)=>listeners.get(name)?.delete(fn), matchMedia:()=>({matches:false,addEventListener(){},removeEventListener(){}}) };
const ctx = new Proxy({}, { get: (_, key) => key === 'createLinearGradient' || key === 'createRadialGradient' ? () => ({ addColorStop(){} }) : () => {}, set: () => true });
global.document = { createElement: () => ({ width:512,height:256,getContext:()=>ctx }), documentElement:{} };
global.requestAnimationFrame = () => 0;
global.cancelAnimationFrame = () => {};
global.ResizeObserver = class { observe(){} disconnect(){} };
const {createRoot, extend} = require('@react-three/fiber');
extend(THREE);
const RealRoundedBox = require('@react-three/drei/core/RoundedBox.cjs.js').RoundedBox;
const textures = new Map();
const assets=new Map();
function readAsset(url){
 if(assets.has(url))return assets.get(url);
 const bytes=fs.readFileSync(path.join('public',url));
 const json=JSON.parse(bytes.subarray(20,20+bytes.readUInt32LE(12))),bin=bytes.subarray(28+bytes.readUInt32LE(12));
 const read=a=>{const v=json.bufferViews[a.bufferView];const start=(v.byteOffset||0)+(a.byteOffset||0);const n={VEC3:3,VEC2:2,VEC4:4,SCALAR:1}[a.type],Type={5126:Float32Array,5123:Uint16Array,5125:Uint32Array,5121:Uint8Array}[a.componentType];const copy=bin.subarray(start,start+a.count*n*Type.BYTES_PER_ELEMENT);return new Type(copy.buffer.slice(copy.byteOffset,copy.byteOffset+copy.length));};
 const nodes=json.nodes.map(node=>{const group=new THREE.Group();group.name=node.name||'';if(node.translation)group.position.fromArray(node.translation);if(node.rotation)group.quaternion.fromArray(node.rotation);if(node.scale)group.scale.fromArray(node.scale);
 if(node.mesh!==undefined)for(const p of json.meshes[node.mesh].primitives){const g=new THREE.BufferGeometry();for(const [a,key,n] of [['POSITION','position',3],['NORMAL','normal',3],['TEXCOORD_0','uv',2]])if(p.attributes[a]!==undefined)g.setAttribute(key,new THREE.BufferAttribute(read(json.accessors[p.attributes[a]]),n));if(p.indices!==undefined)g.setIndex(new THREE.BufferAttribute(read(json.accessors[p.indices]),1));const mesh=new THREE.Mesh(g,new THREE.MeshStandardMaterial());mesh.name=node.name||"";group.add(mesh);}return group;});
 json.nodes.forEach((n,i)=>(n.children||[]).forEach(child=>nodes[i].add(nodes[child])));
 const scene=new THREE.Group();json.scenes[json.scene||0].nodes.forEach(i=>scene.add(nodes[i]));assets.set(url,scene);return scene;
}
const originalLoad = Module._load;
const jsx = React.createElement;
Module._load = function(name,parent,isMain){
  if(name==='@react-three/drei')return {
    RoundedBox:RealRoundedBox,
    useTexture:(url)=>{if(!textures.has(url)){const t=new THREE.Texture();t.image={width:1672,height:941};textures.set(url,t)}return textures.get(url)},
    useGLTF:Object.assign((url)=>({scene:readAsset(url)}),{preload(){}}), Html:()=>null,
  };
  if(name==='@/components/LanguageProvider')return {useLanguage:()=>({language:'cn'})};
  if(name.endsWith('.module.css'))return new Proxy({},{get:(_,k)=>k});
  if(name.startsWith('@/')) name=path.join(rootDir,name.slice(2));
  return originalLoad.call(this,name,parent,isMain);
};
for(const ext of ['.ts','.tsx'])require.extensions[ext]=(module,filename)=>module._compile(ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true,target:ts.ScriptTarget.ES2020}}).outputText,filename);
const {StitchCollectionCabinet}=require('../../components/leo-room/StitchCollectionCabinet.tsx');
const {ROOM_COLLECTION}=require('../../data/leoRoomCollection.ts');
const {RoomLifeContext}=require('../../components/leo-room/RoomLifeContext.tsx');
const {CentralWorkspace}=require('../../components/leo-room/CentralWorkspace.tsx');
const {DeskInteractionScope}=require('../../components/leo-room/DeskInteractiveItem.tsx');
const {deskItems}=require('../../data/deskItems.ts');
const {CENTRAL_WORKSPACE,DESK_PROP_SCALE}=require('../../data/leoRoomWorkspace.ts');
const canvas={style:{},width:1280,height:720,addEventListener(){},removeEventListener(){},getBoundingClientRect:()=>({left:0,top:0,width:1280,height:720}),getContext:()=>({})};
const renderer={domElement:canvas,render(){},setSize(){},setPixelRatio(){},setClearAlpha(){},shadowMap:{},xr:{enabled:false,isPresenting:false,addEventListener(){},removeEventListener(){}},capabilities:{},getPixelRatio:()=>1,dispose(){},forceContextLoss(){},renderLists:{dispose(){}}};
let state,lastSelection=null,lastFocus=null;
const renderTree=()=>jsx(DeskInteractionScope,{enabled:true,onSelect:s=>{lastSelection=s}},jsx(React.Fragment,null,jsx('group',{name:'desk-test'},jsx(CentralWorkspace)),jsx(RoomLifeContext.Provider,{value:{objectsEnabled:true,focusHotspot:id=>{lastFocus=id}}},jsx(StitchCollectionCabinet,{wood:new THREE.Texture()}))));
const assert=(condition,message)=>{if(!condition)throw Error(message)};
const fire=(event,payload)=>{for(const fn of listeners.get(event)||[])fn(payload)};
(async()=>{
  const root=createRoot(canvas);
  await root.configure({gl:renderer,frameloop:'never',size:{width:testWidth,height:844,top:0,left:0},camera:{position:[0,3,5],fov:48},onCreated:s=>{state=s}});
  await React.act(async()=>root.render(renderTree()));
  state.scene.updateMatrixWorld(true);
  const items=[];state.scene.traverse(o=>{if(o.userData.deskItem)items.push(o)});
  assert(items.length===Object.keys(deskItems).length-1,'Missing/duplicate clickable item');
  assert(!items.some(o=>o.userData.interactiveId==='coffee'),'Ordinary cup must be replaced by Runtian');
  assert(items.filter(o=>o.userData.interactiveId==='runtian-water').length===1,'Exactly one original Runtian bottle');
  const boxes=new Map(items.map(o=>[o.userData.interactiveId,new THREE.Box3().setFromObject(o)]));
  console.log('Independent clickable items:',items.length);
  const surface=.14+CENTRAL_WORKSPACE.desk.height+CENTRAL_WORKSPACE.desk.topThickness/2;
  for(const item of items){
    const id=item.userData.interactiveId,box=boxes.get(id);
    assert(Number.isFinite(box.min.x)&&!box.isEmpty(),id+' invalid bounds');
    if(id!=='desktop-pc')assert(box.min.y>=surface-.012,id+' intersects desktop: '+box.min.y+' vs '+surface);
    const handlers=item.__r3f.handlers;
    fire('pointerdown',{pointerId:1});
    await React.act(async()=>{handlers.onPointerDown({stopPropagation(){},pointerId:1,nativeEvent:{clientX:100,clientY:100}}); handlers.onClick({stopPropagation(){},delta:0});});
    assert(lastSelection?.id===id,id+' wrong mapping');
    fire('pointerup',{pointerId:1});
    await React.act(async()=>root.render(renderTree()));


    lastSelection=null;fire('pointerdown',{pointerId:1});
    handlers.onPointerDown({stopPropagation(){},pointerId:1,nativeEvent:{clientX:100,clientY:100}});
    fire('pointermove',{pointerId:1,clientX:109,clientY:100});
    handlers.onClick({stopPropagation(){},delta:9});
    assert(lastSelection===null,id+' drag incorrectly clicked');
    fire('pointerup',{pointerId:1});
    fire('pointerdown',{pointerId:1});handlers.onPointerDown({stopPropagation(){},pointerId:1,nativeEvent:{clientX:100,clientY:100}});
    fire('pointerdown',{pointerId:2});handlers.onPointerDown({stopPropagation(){},pointerId:2,nativeEvent:{clientX:100,clientY:100}});
    fire('pointerup',{pointerId:2});handlers.onClick({stopPropagation(){},delta:0});
    assert(lastSelection===null,id+' pinch incorrectly clicked');fire('pointerup',{pointerId:1});
    console.log(id,JSON.stringify({size:box.getSize(new THREE.Vector3()).toArray(),position:item.position.toArray(),rotation:item.rotation.toArray().slice(0,3),scale:item.scale.toArray(),bottom:box.min.y,surface}));
  }
  // Separate props must not occupy one another's space. Keyboard/mouse sit on
  // the intentional desk mat; accessories share no other overlap.
  const topItems=items.filter(o=>o.userData.interactiveId!=='desktop-pc');
  assert(!state.scene.getObjectByName('desk-stitch'),'Single desktop Stitch should be removed');
  const cabinet=state.scene.getObjectByName('stitch-collection-cabinet');
  assert(cabinet,'Missing collection cabinet');
  const figures=ROOM_COLLECTION.figures.map(f=>state.scene.getObjectByName('collection-'+f.id));
  assert(figures.length===6&&figures.every(Boolean),'Six configured poses must render');
  for(let i=0;i<figures.length;i++){
    const b=new THREE.Box3().setFromObject(figures[i]);
    assert(Math.abs(b.min.y-(.322+ROOM_COLLECTION.figures[i].row*.42))<.001,'Figure not supported');
    assert(b.min.x>ROOM_COLLECTION.position[0]-.47&&b.max.x<ROOM_COLLECTION.position[0]+.47,'Figure outside cabinet');
    assert(b.max.y<.69+ROOM_COLLECTION.figures[i].row*.42,'Figure hits shelf above');
  }
  const ch=cabinet.__r3f.handlers;
  ch.onPointerDown({stopPropagation(){},nativeEvent:{clientX:10,clientY:10}});
  ch.onClick({stopPropagation(){},delta:0,nativeEvent:{clientX:10,clientY:10}});
  assert(lastFocus==='collection','Collection must use original focus handler');lastFocus=null;
  ch.onPointerDown({stopPropagation(){},nativeEvent:{clientX:10,clientY:10}});
  ch.onClick({stopPropagation(){},delta:12,nativeEvent:{clientX:22,clientY:10}});
  assert(lastFocus===null,'Dragging collection must not click');
  for(let i=0;i<topItems.length;i++){
    const a=topItems[i],id=a.userData.interactiveId,box=boxes.get(id);
    const support=surface+(['keyboard','mouse'].includes(id)?.008*DESK_PROP_SCALE:0);
    assert(Math.abs(box.min.y-support)<.001,id+' not grounded');
    for(let j=i+1;j<topItems.length;j++)assert(!box.intersectsBox(boxes.get(topItems[j].userData.interactiveId)),id+' intersects '+topItems[j].userData.interactiveId);
  }
  const bottle=boxes.get('runtian-water');
  assert(Math.abs(bottle.getSize(new THREE.Vector3()).y-.215*DESK_PROP_SCALE)<.0001,'Bottle height');
  assert(Math.abs(boxes.get('keyboard').getSize(new THREE.Vector3()).x-.44*DESK_PROP_SCALE)<.0001,'Keyboard width');
  const pc=boxes.get('desktop-pc');const desk=state.scene.getObjectsByProperty('type','Group').find(g=>g.userData.interactiveId==='office-desk');
  const aquarium=state.scene.getObjectByName('desk-aquascape');
  const tankBox=new THREE.Box3().setFromObject(aquarium);
  // The tank body must be supported by the tabletop, with no phone/prop overlap.
  assert(tankBox.min.z>=CENTRAL_WORKSPACE.position[2]-CENTRAL_WORKSPACE.desk.depth/2,'Aquarium overhangs the back edge');
  for(const item of topItems)assert(!tankBox.intersectsBox(boxes.get(item.userData.interactiveId)),'Aquarium intersects '+item.userData.interactiveId);
  desk.traverse(o=>{if(!o.isMesh)return;const g=o.geometry,pos=g.attributes.position,index=g.index;for(let i=0;i<(index?.count||pos.count);i+=3){const points=[0,1,2].map(j=>new THREE.Vector3().fromBufferAttribute(pos,index?index.getX(i+j):i+j).applyMatrix4(o.matrixWorld));assert(!pc.intersectsTriangle(new THREE.Triangle(...points)),'PC intersects Blender desk');}});
  const deskBox=new THREE.Box3().setFromObject(desk),cabinetBox=new THREE.Box3().setFromObject(cabinet);
  assert(Math.abs(deskBox.getSize(new THREE.Vector3()).x-4.81)<.001,'Desk width changed');
  assert(Math.abs(deskBox.getSize(new THREE.Vector3()).z-2.2648)<.001,'Main slab and wing footprint changed');
  assert(Math.abs(deskBox.max.y-(surface+.001))<.001,'Desktop support plane changed');
  const cb=cabinetBox.getSize(new THREE.Vector3());
  assert(Math.abs(cb.x-1.06)<.001&&Math.abs(cb.y-1.66)<.001&&Math.abs(cb.z-.48)<.001,'Cabinet dimensions changed');
  assert(DESK_PROP_SCALE===2,'Desk props scale changed');
  const minClearance=(.14+CENTRAL_WORKSPACE.desk.height-CENTRAL_WORKSPACE.desk.topThickness/2)-pc.max.y;
  console.log('PC top clearance:',minClearance.toFixed(3),'m');
  let triangles=0,meshes=0;state.scene.getObjectByName('desk-test').traverse(o=>{if(o.isMesh){meshes++;triangles+=(o.geometry.index?.count||o.geometry.attributes.position?.count||0)/3*(o.isInstancedMesh?o.count:1)}});
  console.log('Desktop meshes:',meshes,'triangles:',triangles);
  assert(triangles<65000,'Desktop triangle budget exceeded');
  for(const [name,object] of [['bottle',items.find(o=>o.userData.interactiveId==='runtian-water')],['collection',cabinet]]){let count=0,draws=0;object.traverse(o=>{if(o.isMesh){draws++;count+=(o.geometry.index?.count||o.geometry.attributes.position.count)/3;}});console.log(name,{triangles:count,draws});}
  await React.act(async()=>root.unmount());
  process.exit(0);
})().catch(e=>{console.error(e);process.exit(1)});
