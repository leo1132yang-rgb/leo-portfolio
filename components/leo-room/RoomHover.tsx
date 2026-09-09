"use client";
import { useLayoutEffect, useRef, type ReactNode } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useRoomLife } from './RoomLifeContext';
/** Material-only feedback: no outline pass, extra light or per-frame React state. */
export function RoomHover({children}:{children:ReactNode}){
 const root=useRef<THREE.Group>(null),hover=useRef(false),amount=useRef(0),life=useRoomLife();
 const entries=useRef<{material:THREE.MeshStandardMaterial;base:THREE.Color;warm:THREE.Color}[]>([]);
 useLayoutEffect(()=>{const restore:(()=>void)[]=[];root.current?.traverse(o=>{if(!(o instanceof THREE.Mesh)||o.userData.independentPractical)return;const original=o.material;const cloned=(Array.isArray(original)?original:[original]).map(m=>{if(!(m instanceof THREE.MeshStandardMaterial))return m;const c=m.clone();entries.current.push({material:c,base:c.color.clone(),warm:c.color.clone().lerp(new THREE.Color('#ffe2b0'),.13)});restore.push(()=>c.dispose());return c;});o.material=Array.isArray(original)?cloned:cloned[0];restore.push(()=>{o.material=original;});});return()=>{restore.reverse().forEach(f=>f());entries.current=[];};},[]);
 useFrame((_,dt)=>{const target=hover.current&&life?.objectsEnabled?1:0;if(Math.abs(amount.current-target)<.001&&amount.current===target)return;amount.current=THREE.MathUtils.damp(amount.current,target,12,Math.min(dt,.05));if(Math.abs(amount.current-target)<.001)amount.current=target;for(const e of entries.current)e.material.color.copy(e.base).lerp(e.warm,amount.current);});
 return <group ref={root} name="room-hover-response" onPointerOver={()=>{hover.current=true;}} onPointerOut={()=>{hover.current=false;}}>{children}</group>;
}
