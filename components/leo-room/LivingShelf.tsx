"use client";
import { RoomHover } from './RoomHover';
import { useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import { useEffect, useMemo, useRef, type ReactNode } from 'react';
import * as THREE from 'three';
import { useRoomLife } from './RoomLifeContext';
import type { LivingShelfItem } from './useRoomInteractionController';
import { Block, Books, Plant } from './StudioInterior';
import { SHELF_BOOKS } from '@/data/leoRoomBookshelf';
import { photoWallImages } from '@/data/photoWall';
import { useGlobalAudio } from '@/hooks/useGlobalAudio';
import { useLanguage } from '@/components/LanguageProvider';
import styles from './RoomNavigation.module.css';

const positions: Record<LivingShelfItem,[number,number,number]>={lamp:[-1.35,1.12,0],vinyl:[1.12,.89,0],drawer:[0,.41,.28],book:[-.05,1.01,.08],plant:[-.62,1.12,0]};
const reading=SHELF_BOOKS.find(b=>b.title==='论摄影')!;
const smooth=(x:number)=>x*x*(3-2*x);

/** One selection/ranking pass and one hint for the entire console; no keyboard owner here. */
export function LivingShelf({wood}:{wood:THREE.Texture}) {
  const life=useRoomLife()!, {camera,size,gl}=useThree();
  const {vinylWantsPlay,vinylTrack}=useGlobalAudio();
  const {language}=useLanguage();
  const root=useRef<THREE.Group>(null);
  const hovered=useRef<LivingShelfItem|null>(null), down=useRef<[number,number]|null>(null);
  const vectors=useMemo(()=>({point:new THREE.Vector3(),view:new THREE.Vector3(),origin:new THREE.Vector3(-3.05,0,-3.43)}),[]);
  const elapsed=useRef(0);
  useFrame((_,dt)=>{
    elapsed.current+=dt;if(elapsed.current<.12)return;elapsed.current=0;
    const find=(name:string)=>root.current?.getObjectByName(name);
    gl.domElement.dataset.shelfRecordAngle=(find('living-record-disc')?.rotation.y??0).toFixed(4);
    gl.domElement.dataset.shelfDrawerZ=(find('living-drawer')?.position.z??0).toFixed(4);
    gl.domElement.dataset.shelfBookZ=(find('living-reading-book')?.position.z??0).toFixed(4);
    gl.domElement.dataset.shelfLampIntensity=((find('living-local-light') as THREE.PointLight)?.intensity??0).toFixed(4);
    if(!life.objectsEnabled || life.microHint){life.selectLivingShelfItem(null);return;}
    let closest:LivingShelfItem|null=null, score=Infinity;
    for(const id of Object.keys(positions) as LivingShelfItem[]){
      vectors.point.fromArray(positions[id]).add(vectors.origin);
      const distance=camera.position.distanceTo(vectors.point);
      vectors.view.copy(vectors.point).project(camera);
      if((distance>6.8 && hovered.current!==id) || Math.abs(vectors.view.x)>.86 || Math.abs(vectors.view.y)>.8 || vectors.view.z>1)continue;
      const rank=hovered.current===id?-1:distance+Math.hypot(vectors.view.x,vectors.view.y)*2;
      if(rank<score){closest=id;score=rank;}
    }
    life.selectLivingShelfItem(life.readingBook ? "book" : closest);
  });
  const hit=(id:LivingShelfItem,children:ReactNode)=><group name={`living-hit-${id}`} onPointerOver={e=>{e.stopPropagation();hovered.current=id;}} onPointerOut={()=>{if(hovered.current===id)hovered.current=null;}}
    onPointerDown={e=>{e.stopPropagation();down.current=[e.clientX,e.clientY];}}
    onClick={(e:ThreeEvent<MouseEvent>)=>{e.stopPropagation();const p=down.current;down.current=null;if(p&&e.delta<=8&&Math.hypot(e.clientX-p[0],e.clientY-p[1])<=8)life.interactLivingShelf(id);}}><RoomHover>{children}</RoomHover></group>;
  const active=life.objectsEnabled?(life.readingBook ? "book" : life.activeLivingShelfItem):null;
  return <group ref={root} position={[-3.05,0,-3.43]} name="living-shelf">
    <Block size={[4.05,.06,.63]} at={[0,.76,0]} wood={wood}/><Block size={[4.05,.06,.6]} at={[0,.16,0]} wood={wood}/>
    <Block size={[4,.55,.035]} at={[0,.46,-.28]}/>
    {[-1.98,-.68,.68,1.98].map(x=><Block key={x} size={[.065,.59,.6]} at={[x,.46,0]} wood={wood}/>)}
    {[-1.8,1.8].map(x=><Block key={x} size={[.08,.16,.46]} at={[x,.08,0]}/>)}
    <Books at={[-1.75,.2,.06]} count={9}/><Books at={[.85,.2,.06]} count={8}/>
    {hit('drawer',<LivingDrawer/>)}
    {hit('lamp',<LocalLamp/>)}
    {hit('plant',<Plant at={[-.62,.8,0]} scale={.4} living/>)}
    {hit('vinyl',<Vinyl wood={wood}/>)}
    {hit('book',<ReadingBook/>)}<Books at={[.07,.8,0]} count={3}/>

  </group>;
}
function LocalLamp(){
 const life=useRoomLife()!, material=useRef<THREE.MeshStandardMaterial>(null), light=useRef<THREE.PointLight>(null);
 const value=useRef(1), tween=useRef({from:1,to:1,t:1});
 useEffect(()=>{tween.current={from:value.current,to:life.shelfLampOn?1:0,t:0};},[life.shelfLampOn]);
 useFrame((_,dt)=>{const a=tween.current;a.t=Math.min(1,a.t+dt/.45);value.current=THREE.MathUtils.lerp(a.from,a.to,smooth(a.t));if(material.current)material.current.emissiveIntensity=.04+value.current*1.66;if(light.current)light.current.intensity=1.7*value.current;});
 return <group position={[-1.35,.8,0]}>
  <mesh position={[0,.025,0]} castShadow><cylinderGeometry args={[.19,.21,.05,24]}/><meshStandardMaterial color="#22211d" metalness={.72} roughness={.35}/></mesh>
  <mesh position={[0,.16,0]}><cylinderGeometry args={[.018,.018,.32,12]}/><meshStandardMaterial color="#8c7044" metalness={.78} roughness={.3}/></mesh>
  <mesh position={[0,.32,0]} userData={{independentPractical:true}}><sphereGeometry args={[.17,24,16]}/><meshStandardMaterial ref={material} color="#eee1c9" emissive="#ffe1ac" emissiveIntensity={1.7} roughness={.36}/></mesh>
  <pointLight name="living-local-light" ref={light} userData={{independentPractical:true}} position={[0,.4,.08]} color="#ffdfa9" intensity={1.7} distance={2.5} decay={2}/>
 </group>;
}
function Vinyl({wood}:{wood:THREE.Texture}){
 const {vinylIsPlaying,vinylTrack}=useGlobalAudio();
 const disc=useRef<THREE.Group>(null), arm=useRef<THREE.Group>(null), velocity=useRef(0);
 useFrame((_,dt)=>{velocity.current=THREE.MathUtils.damp(velocity.current,vinylIsPlaying?.8:0,2.5,Math.min(dt,.05));if(arm.current)arm.current.position.y=THREE.MathUtils.damp(arm.current.position.y,vinylIsPlaying?0:.025,5,Math.min(dt,.05));if(disc.current)disc.current.rotation.y=(disc.current.rotation.y+velocity.current*Math.min(dt,.05))%(Math.PI*2);});
 return <group><Block size={[.72,.075,.43]} at={[1.15,.83,0]} wood={wood}/>
  <mesh position={[1.12,.882,0]}><cylinderGeometry args={[.215,.215,.025,48]}/><meshStandardMaterial color="#8a8d87" metalness={.8} roughness={.28}/></mesh>
  <group ref={disc} position={[1.12,.905,0]} scale={[1.12,1,1.12]} name="living-record-disc">
   <mesh><cylinderGeometry args={[.18,.18,.012,48]}/><meshStandardMaterial color="#171918" roughness={.28} metalness={.25}/></mesh>
   {[.09,.115,.14,.165].map(r=><mesh key={r} rotation={[-Math.PI/2,0,0]} position={[0,.0065,0]}><ringGeometry args={[r,r+.001,48]}/><meshStandardMaterial color="#393c36" roughness={.32} metalness={.4}/></mesh>)}
   <mesh position={[0,.008,0]}><cylinderGeometry args={[.05,.05,.006,24]}/><meshStandardMaterial color={vinylTrack.labelColor} roughness={.7}/></mesh>
   <mesh position={[.027,.012,0]} rotation={[-Math.PI/2,0,0]}><circleGeometry args={[.008,12]}/><meshStandardMaterial color="#4c5048"/></mesh>
   <mesh position={[.105,.009,0]} rotation={[-Math.PI/2,0,0]}><ringGeometry args={[.026,.032,24,1,0,Math.PI*1.4]}/><meshStandardMaterial color="#b9aa83" roughness={.65}/></mesh>
   <mesh position={[0,.013,.028]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[.055,.015]}/><meshStandardMaterial color="#e6ddc8" roughness={.8}/></mesh>
  </group><mesh position={[1.12,.925,0]}><cylinderGeometry args={[.009,.009,.03,12]}/><meshStandardMaterial color="#c2beb0" metalness={.85} roughness={.25}/></mesh><group ref={arm}><Block size={[.025,.025,.28]} at={[1.42,.9,.015]} color="#b1aaa0"/></group>
 </group>;
}
function LivingDrawer(){
 const life=useRoomLife()!, ref=useRef<THREE.Group>(null), tween=useRef({from:0,to:0,t:1});
 const photos=useMemo(()=>photoWallImages.slice(0,2).map(p=>new THREE.TextureLoader().load(p.thumbnailSrc,t=>{t.colorSpace=THREE.SRGBColorSpace;})),[]);
 useEffect(()=>()=>photos.forEach(p=>p.dispose()),[photos]);
 useEffect(()=>{tween.current={from:ref.current?.position.z??0,to:life.drawerOpen?.21:0,t:0};},[life.drawerOpen]);
 useFrame((_,dt)=>{const a=tween.current;a.t=Math.min(1,a.t+dt/.7);if(ref.current)ref.current.position.z=THREE.MathUtils.lerp(a.from,a.to,smooth(a.t));});
 return <group ref={ref} name="living-drawer">
  <Block size={[.83,.04,.42]} at={[0,.23,.05]} color="#44443b"/>
  <Block size={[.83,.30,.035]} at={[0,.4,.26]} color="#44443b"/>
  <Block size={[.83,.27,.025]} at={[0,.385,-.15]} color="#49483d"/>
  {[-.4,.4].map(x=><Block key={x} size={[.025,.27,.4]} at={[x,.385,.05]} color="#49483d"/>)}
  <Block size={[.15,.025,.025]} at={[0,.41,.29]} color="#ba9b68"/>
  {photos.map((map,i)=><group key={i} position={[-.1+i*.055,.254+i*.003,.08]} rotation={[0,i*.22,0]}><Block size={[.18,.003,.13]} at={[0,0,0]} color="#d8cfba"/><mesh rotation={[-Math.PI/2,0,0]} position={[0,.002,0]}><planeGeometry args={[.16,.105]}/><meshStandardMaterial map={map} roughness={.75}/></mesh></group>)}
  <mesh position={[.23,.29,.06]} rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[.034,.034,.075,12]}/><meshStandardMaterial color="#9c8455" roughness={.5} metalness={.25}/></mesh>
  <Block size={[.2,.009,.012]} at={[-.12,.258,-.08]} color="#292c28"/>
 </group>;
}
function ReadingBook(){
 const life=useRoomLife()!,ref=useRef<THREE.Group>(null);
 const map=useMemo(()=>{const c=document.createElement('canvas');c.width=128;c.height=512;const x=c.getContext('2d')!;x.fillStyle=reading.color;x.fillRect(0,0,128,512);x.fillStyle=reading.ink;x.textAlign='center';x.font='38px SimSun,serif';[...reading.title].forEach((s,i)=>x.fillText(s,64,100+i*52));x.font='17px SimSun,serif';[...reading.author].forEach((s,i)=>x.fillText(s,64,320+i*24));const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t;},[]);
 useEffect(()=>()=>map.dispose(),[map]);
 useFrame((_,dt)=>{if(ref.current)ref.current.position.z=THREE.MathUtils.damp(ref.current.position.z,life.readingBook?.045:0,9,dt);});
 return <group position={[-.05,.8,0]}><group ref={ref} name="living-reading-book">
  <Block size={[.083,.36,.26]} at={[0,.18,0]} color={reading.color}/>
  <mesh position={[0,.18,.131]}><planeGeometry args={[.083,.36]}/><meshStandardMaterial map={map} roughness={.9}/></mesh>
 </group></group>;
}
