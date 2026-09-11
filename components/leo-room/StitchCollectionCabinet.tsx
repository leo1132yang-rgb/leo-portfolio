"use client";
import {useRef} from 'react';
import * as THREE from 'three';
import {RoundedBox} from '@react-three/drei';
import {ROOM_COLLECTION} from '@/data/leoRoomCollection';
import {StitchFigurine} from './DeskPersonalProps';
import {useRoomLife} from './RoomLifeContext';
import {RoomHover} from './RoomHover';

export function StitchCollectionCabinet({wood}:{wood:THREE.Texture}){
 const life=useRoomLife(),start=useRef<[number,number]|null>(null);
 return <group name="stitch-collection-cabinet" position={ROOM_COLLECTION.position}
  onPointerDown={e=>{e.stopPropagation();start.current=[e.nativeEvent.clientX,e.nativeEvent.clientY];}}
  onClick={e=>{e.stopPropagation();const p=start.current;start.current=null;if(!p||!life?.objectsEnabled||e.delta>8||Math.hypot(e.nativeEvent.clientX-p[0],e.nativeEvent.clientY-p[1])>8)return;life.focusHotspot('collection');}}>
  <RoomHover>
   {[-.48,.48].flatMap(x=>[-.19,.19].map(z=><mesh key={`${x}-${z}`} position={[x,.83,z]} castShadow><boxGeometry args={[.032,1.66,.032]}/><meshStandardMaterial color="#30322d" metalness={.65} roughness={.48}/></mesh>))}
   <mesh position={[0,.96,-.221]} receiveShadow><boxGeometry args={[.95,1.36,.027]}/><meshStandardMaterial color="#302f29" roughness={.9}/></mesh>
   {[.30,.72,1.14,1.63].map((y,i)=><group key={y}>
    <RoundedBox args={[1.06,.04,.48]} radius={.009} smoothness={2} bevelSegments={1} position={[0,y,0]} castShadow receiveShadow><meshStandardMaterial map={wood} color="#ddc6a8" roughness={.5}/></RoundedBox>
    {i>0&&<mesh position={[0,y-.024,.03]}><boxGeometry args={[.81,.005,.015]}/><meshStandardMaterial color="#f5d9b0" emissive="#ffd498" emissiveIntensity={.65}/></mesh>}
   </group>)}
   {[-1,1].map(side=><mesh key={side} position={[side*.478,.97,0]}><boxGeometry args={[.006,1.28,.38]}/><meshPhysicalMaterial color="#d9e1d7" transparent opacity={.07} roughness={.14} depthWrite={false} clearcoat={.45}/></mesh>)}
   {ROOM_COLLECTION.figures.map(figure=><group key={figure.id} name={`collection-${figure.id}`} position={[figure.column===0?-.245:.245,.322+figure.row*.42,.015]} rotation={[0,figure.yaw,0]}>
    <group scale={1.85}><StitchFigurine pose={figure.pose}/></group>
   </group>)}
   <mesh position={[0,.125,0]} castShadow><boxGeometry args={[.93,.21,.4]}/><meshStandardMaterial map={wood} color="#9f8c72" roughness={.65}/></mesh>
   <mesh position={[0,.24,.214]}><boxGeometry args={[.17,.012,.014]}/><meshStandardMaterial color="#9e8b69" metalness={.7} roughness={.45}/></mesh>
  </RoomHover>
 </group>;
}
