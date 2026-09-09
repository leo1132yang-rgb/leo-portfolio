"use client";
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import { useRoomLife } from './RoomLifeContext';
export function LampPullChain(){
 const life=useRoomLife(),ref=useRef<THREE.Group>(null),last=useRef(life?.lightingMode),pulse=useRef(10);
 useFrame((_,dt)=>{if(last.current!==life?.lightingMode){last.current=life?.lightingMode;pulse.current=0;}pulse.current+=dt;if(!ref.current)return;const t=pulse.current;ref.current.position.y=t<.55?-.075*Math.sin(t/.55*Math.PI):0;ref.current.rotation.z=t<1.1?Math.sin(t*13)*.09*(1-t/1.1):0;});
 return <group ref={ref} name="lamp-pull-chain">
  <mesh position={[.2,.72,.1]}><cylinderGeometry args={[.007,.007,.4,8]}/><meshStandardMaterial color="#bb9c66" roughness={.33} metalness={.8}/></mesh>
  <mesh position={[.2,.51,.1]} scale={[.022,.045,.022]}><sphereGeometry args={[1,12,8]}/><meshStandardMaterial color="#d1b57c" roughness={.3} metalness={.75}/></mesh>
 </group>;
}
