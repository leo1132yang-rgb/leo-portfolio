"use client";
import { Html } from "@react-three/drei";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { useEffect, useRef, type ReactNode } from "react";
import * as THREE from "three";
import { CENTRAL_WORKSPACE } from "@/data/leoRoomWorkspace";
import { ROOM_LIFE } from "@/data/leoRoomLife";
import { useRoomLife } from "./RoomLifeContext";
import styles from "./RoomNavigation.module.css";

export function ChairMotion({children}:{children:ReactNode}) {
  const life=useRoomLife(), latest=useRef(life);latest.current=life;
  const ref=useRef<THREE.Group>(null), {camera,size,gl}=useThree();
  const drag=useRef<{id:number;px:number;x:number;pixels:number}|null>(null);
  const initial=CENTRAL_WORKSPACE.chair.position[0];
  useFrame((_,delta)=>{
    if(!ref.current||!life)return;
    const before=ref.current.position.x;
    ref.current.position.x=THREE.MathUtils.damp(before,life.chairX-initial,14,delta);
    // Rotate the chair itself about its centre, not about the room origin.
    const model=ref.current.children[0];
    if(model){const yaw=-.15+THREE.MathUtils.clamp((ref.current.position.x-before)/Math.max(delta,.001)*.025,-.045,.045);model.rotation.y=THREE.MathUtils.damp(model.rotation.y,yaw,9,delta);}
  });
  useEffect(()=>{
    const move=(e:PointerEvent)=>{const d=drag.current;if(!d||d.id!==e.pointerId)return;latest.current?.moveChair(d.x+(e.clientX-d.px)/d.pixels);};
    const up=(e:PointerEvent)=>{if(drag.current?.id!==e.pointerId)return;drag.current=null;latest.current?.endChairDrag();if(gl.domElement.hasPointerCapture(e.pointerId))gl.domElement.releasePointerCapture(e.pointerId);};
    const cancel=()=>{drag.current=null;latest.current?.endChairDrag();};
    window.addEventListener("pointermove",move);window.addEventListener("pointerup",up);window.addEventListener("pointercancel",up);window.addEventListener("blur",cancel);
    return()=>{window.removeEventListener("pointermove",move);window.removeEventListener("pointerup",up);window.removeEventListener("pointercancel",up);window.removeEventListener("blur",cancel);};
  },[gl]);
  useEffect(()=>{if(!life?.chairDragging)drag.current=null;},[life?.chairDragging]);
  const down=(e:ThreeEvent<PointerEvent>)=>{
    e.stopPropagation();if(!life?.objectsEnabled)return;
    if(e.pointerType==="touch"||size.width<768){return;}
    const x=life.chairX, z=CENTRAL_WORKSPACE.chair.position[2]+CENTRAL_WORKSPACE.position[2];
    const a=new THREE.Vector3(x,.7,z).project(camera), b=new THREE.Vector3(x+1,.7,z).project(camera);
    const pixels=(b.x-a.x)*size.width/2;
    if(Math.abs(pixels)<8||!life.beginChairDrag())return;
    gl.domElement.setPointerCapture(e.pointerId);drag.current={id:e.pointerId,px:e.nativeEvent.clientX,x,pixels};
  };
  const hint=life?.microHint==="chair"&&!life.seatActive&&!life.contentOpen;
  return <group ref={ref} name="office-chair-rail" onPointerDown={down}
    onPointerOver={e=>{e.stopPropagation();if(life?.objectsEnabled)life.showMicroHint("chair");}}
    onPointerOut={()=>{if(size.width>=768&&!life?.chairDragging)life?.showMicroHint(null);}}
    onClick={e=>{e.stopPropagation();if(e.delta<=8&&life?.objectsEnabled)life.showMicroHint("chair");}}>
    {children}
    {hint&&<Html center position={[initial,.95,CENTRAL_WORKSPACE.chair.position[2]+.55]} zIndexRange={[44,40]}><div className={styles.micro} onPointerDown={e=>e.stopPropagation()}><span>移动椅子</span>
      <button aria-label="椅子向左移动" onClick={()=>life.moveChair(life.chairX-(ROOM_LIFE.chairRail.max-ROOM_LIFE.chairRail.min)/4)}>‹</button>
      <button aria-label="椅子向右移动" onClick={()=>life.moveChair(life.chairX+(ROOM_LIFE.chairRail.max-ROOM_LIFE.chairRail.min)/4)}>›</button>
    </div></Html>}
  </group>;
}

export function LoungeSeat({children}:{children:ReactNode}){
  const life=useRoomLife();
  return <group name="lounge-seat-interaction" onPointerOver={e=>{e.stopPropagation();if(life?.objectsEnabled)life.showMicroHint("seat");}} onPointerOut={()=>life?.showMicroHint(null)}
    onPointerDown={e=>e.stopPropagation()} onClick={e=>{e.stopPropagation();if(e.delta<=8&&life?.objectsEnabled)life.sitDown();}}>
    {children}
    {life?.microHint==="seat"&&life.objectsEnabled&&<Html center position={[0,1.55,.2]} zIndexRange={[44,40]}><button className={styles.micro} onClick={life.sitDown} onPointerDown={e=>e.stopPropagation()}>坐下 · E / 点击</button></Html>}
  </group>;
}
