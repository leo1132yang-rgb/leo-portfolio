"use client";
import {useRef} from 'react';
import {RoomFurnitureAsset} from './RoomFurnitureAsset';
import {ROOM_COLLECTION} from '@/data/leoRoomCollection';
import {StitchFigurine} from './DeskPersonalProps';
import {useRoomLife} from './RoomLifeContext';
import {RoomHover} from './RoomHover';

export function StitchCollectionCabinet(){
 const life=useRoomLife(),start=useRef<[number,number]|null>(null);
 return <group name="stitch-collection-cabinet" position={ROOM_COLLECTION.position}
  onPointerDown={e=>{e.stopPropagation();start.current=[e.nativeEvent.clientX,e.nativeEvent.clientY];}}
  onClick={e=>{e.stopPropagation();const p=start.current;start.current=null;if(!p||!life?.objectsEnabled||e.delta>8||Math.hypot(e.nativeEvent.clientX-p[0],e.nativeEvent.clientY-p[1])>8)return;life.focusHotspot('collection');}}>
  <RoomHover>
   <RoomFurnitureAsset url="/room/models/stitch-display-cabinet.glb"/>
   <rectAreaLight position={[0,.95,.195]} color="#ffe0b0" intensity={.25} width={.80} height={1.15} userData={{roomNightIntensity:.12}}/>
   {ROOM_COLLECTION.figures.map(figure=><group key={figure.id} name={`collection-${figure.id}`} position={[figure.column===0?-.245:.245,.322+figure.row*.42,.015]} rotation={[0,figure.yaw,0]}>
    <group scale={1.85}><StitchFigurine pose={figure.pose}/></group>
   </group>)}
  </RoomHover>
 </group>;
}
