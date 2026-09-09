"use client";
import { useEffect, useLayoutEffect, useRef, type ReactNode } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { ROOM_LIFE } from "@/data/leoRoomLife";
import { useRoomLife } from "./RoomLifeContext";

/** One registry over the existing interior. Exterior shaders are outside this
 * group, so turning off practicals never changes the universe or Travel Globe. */
export function RoomLightingScope({ children }: { children: ReactNode }) {
  const ref=useRef<THREE.Group>(null), life=useRoomLife();
  const {size}=useThree();
  const entries=useRef<{apply:(amount:number)=>void;restore:()=>void}[]>([]);
  const amount=useRef(1), tween=useRef({from:1,to:1,elapsed:0,started:0});
  useLayoutEffect(()=>{
    const result:typeof entries.current=[];
    const materials=new Set<THREE.Material>();
    ref.current?.traverse(o=>{
      if(o.userData.independentPractical) return;
      if(o instanceof THREE.Light){
        const base=o.intensity, color=o.color.clone();
        const night=typeof o.userData.roomNightIntensity==="number"?o.userData.roomNightIntensity:0;
        const nightColor=new THREE.Color(o.userData.roomNightColor??color);
        result.push({apply:a=>{o.intensity=THREE.MathUtils.lerp(night,base,a);o.color.copy(nightColor).lerp(color,a);},restore:()=>{o.intensity=base;o.color.copy(color);}});
      }
      if(o instanceof THREE.Mesh)for(const m of (Array.isArray(o.material)?o.material:[o.material])){
        if(materials.has(m))continue;materials.add(m);
        if(m instanceof THREE.MeshStandardMaterial && m.emissiveIntensity>0 && m.emissive.getHex()!==0){
          const base=m.emissiveIntensity, night=o.userData.roomNightFactor??0;
          result.push({apply:a=>{m.emissiveIntensity=base*THREE.MathUtils.lerp(night,1,a);},restore:()=>{m.emissiveIntensity=base;}});
        }else if(m instanceof THREE.MeshBasicMaterial && m.map && !m.stencilWrite){
          const base=m.color.clone();
          result.push({apply:a=>{m.color.copy(base).multiplyScalar(THREE.MathUtils.lerp(.24,1,a));},restore:()=>{m.color.copy(base);}});
        }
      }
    });
    entries.current=result;result.forEach(e=>e.apply(amount.current));
    return()=>{result.forEach(e=>e.restore());};
  },[size.width<768]);
  useEffect(()=>{tween.current={from:amount.current,to:life?.lightingMode==="ROOM_LIGHT_OFF"?0:1,elapsed:0,started:performance.now()};},[life?.lightingMode]);
  useFrame(()=>{
    const t=tween.current, p=Math.min(1,(performance.now()-t.started)/(ROOM_LIFE.lightDuration*1000));
    amount.current=THREE.MathUtils.lerp(t.from,t.to,p*p*(3-2*p));
    for(const entry of entries.current)entry.apply(amount.current);
  });
  return <group ref={ref} name="room-controlled-lighting">{children}</group>;
}
